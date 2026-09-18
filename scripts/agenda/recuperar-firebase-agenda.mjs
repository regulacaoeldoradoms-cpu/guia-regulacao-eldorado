/**
 * Agenda DigSaúde — recuperação controlada dos bindings Firebase em produção.
 *
 * O incidente conhecido retorna 503 antes de consultar o Firestore quando um dos
 * bindings FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ou FIREBASE_PRIVATE_KEY não
 * está disponível no Worker.
 *
 * Estratégia:
 * 1. confirma que /api/agenda ainda está no erro específico de armazenamento;
 * 2. inspeciona somente nomes/tipos de bindings, nunca valores;
 * 3. localiza uma versão já homologada da Agenda com os três bindings;
 * 4. após confirmação humana, faz rollback temporário para essa versão;
 * 5. republica a main atual com keep_vars=true, herdando a configuração recuperada;
 * 6. confirma que /api/agenda voltou a alcançar a barreira de autenticação.
 *
 * Nenhum segredo é impresso, copiado para arquivo ou enviado ao GitHub.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const FIXED = Object.freeze({
  account: '467be828c364ccf084240c34bb609b42',
  worker: 'yellow-wave-d0a1guia-regulacao-ia',
  repository: 'https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado.git',
  agendaApi: 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev/api/agenda',
  wranglerVersion: '4.133.0',
  knownGoodVersions: Object.freeze([
    '9dfd38af-4f3a-4f6e-a4ca-b177a377c0d6',
    '8fcc9e5f-868b-4c0a-be59-9e16744c72b3',
    'a790bd06-b51a-4a02-8bf2-fe2a28f84849'
  ])
});

export const REQUIRED_FIREBASE_BINDINGS = Object.freeze([
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
]);

const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const GIT_SHA = /^[a-f0-9]{40}$/i;

export class SafeError extends Error {}

function must(condition, code) {
  if (!condition) throw new SafeError(code);
}

function stripAnsi(value) {
  return String(value || '')
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '')
    .replace(/^\uFEFF/, '')
    .trim();
}

export function parseJson(value) {
  try {
    return JSON.parse(stripAnsi(value));
  } catch {
    throw new SafeError('RESPOSTA_JSON_NAO_RECONHECIDA');
  }
}

export function activeVersionFromDeployment(value) {
  must(value && Array.isArray(value.versions), 'DEPLOYMENT_NAO_IDENTIFICADO');
  const active = value.versions
    .filter((item) => item && UUID.test(item.version_id || '') && Number(item.percentage) > 0)
    .sort((a, b) => Number(b.percentage) - Number(a.percentage));
  must(active.length === 1 && Number(active[0].percentage) === 100, 'DISTRIBUICAO_PRODUTIVA_NAO_E_UNICA');
  return active[0].version_id;
}

function usableBinding(binding, name) {
  if (!binding || binding.name !== name) return false;
  if (name === 'FIREBASE_PRIVATE_KEY') return binding.type === 'secret_text';
  if (binding.type === 'secret_text') return true;
  return binding.type === 'plain_text' && Boolean(String(binding.text || '').trim());
}

export function inspectFirebaseBindings(version) {
  const bindings = Array.isArray(version?.resources?.bindings) ? version.resources.bindings : [];
  const byName = new Map(bindings.filter((item) => item && typeof item.name === 'string').map((item) => [item.name, item]));
  const present = {};
  const types = {};
  const missing = [];
  for (const name of REQUIRED_FIREBASE_BINDINGS) {
    const binding = byName.get(name);
    present[name] = usableBinding(binding, name);
    types[name] = binding?.type || '';
    if (!present[name]) missing.push(name);
  }
  return { ready: missing.length === 0, present, types, missing };
}

export function classifyAgendaProbe(status) {
  const code = Number(status || 0);
  return {
    status: code,
    incidentConfirmed: code === 503,
    storageGuardPassed: code === 401 || code === 403
  };
}

export function chooseKnownGoodVersion(candidates) {
  for (const candidate of candidates || []) {
    if (candidate?.ready && UUID.test(candidate.id || '')) return candidate.id;
  }
  return '';
}

function safeLine(key, value) {
  console.log(String(key) + '=' + String(value ?? ''));
}

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    shell: false,
    windowsHide: true,
    encoding: 'utf8',
    timeout: options.timeout || 240000,
    maxBuffer: 8 * 1024 * 1024,
    env: {
      ...process.env,
      WRANGLER_SEND_METRICS: 'false',
      NO_COLOR: '1',
      FORCE_COLOR: '0',
      CI: 'true',
      CLOUDFLARE_ACCOUNT_ID: FIXED.account
    }
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: String(result.stdout || ''),
    stderr: String(result.stderr || ''),
    status: result.status
  };
}

function runChecked(command, args, cwd, code, options = {}) {
  const result = run(command, args, cwd, options);
  must(result.ok, code);
  return result.stdout;
}

function npxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx';
}

export function wranglerArgs(args) {
  return ['--yes', 'wrangler@' + FIXED.wranglerVersion, ...args];
}

function runWrangler(args, cwd, code = 'WRANGLER_FALHOU', allowFailure = false) {
  const result = run(npxCommand(), wranglerArgs(args), cwd, { timeout: 300000 });
  if (!allowFailure) must(result.ok, code);
  return result;
}

function writeJson(file, value) {
  const temp = file + '.tmp-' + randomUUID();
  const descriptor = fs.openSync(temp, 'wx', 0o600);
  try {
    fs.writeFileSync(descriptor, JSON.stringify(value, null, 2) + '\n', 'utf8');
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
  fs.renameSync(temp, file);
}

function remoteMainSha(cloneRoot) {
  const output = runChecked('git', ['ls-remote', 'origin', 'refs/heads/main'], cloneRoot, 'GIT_REMOTO_INDISPONIVEL');
  const sha = output.trim().split(/\s+/)[0] || '';
  must(GIT_SHA.test(sha), 'SHA_MAIN_REMOTA_INVALIDA');
  return sha;
}

function localHeadSha(cloneRoot) {
  const output = runChecked('git', ['rev-parse', 'HEAD'], cloneRoot, 'GIT_HEAD_INDISPONIVEL');
  const sha = output.trim();
  must(GIT_SHA.test(sha), 'SHA_LOCAL_INVALIDA');
  return sha;
}

async function probeAgenda(fetcher = fetch) {
  let response;
  try {
    response = await fetcher(FIXED.agendaApi, {
      method: 'GET',
      redirect: 'manual',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
  } catch {
    throw new SafeError('AGENDA_NAO_RESPONDE');
  }
  return classifyAgendaProbe(response.status);
}

async function waitForStorageGuard(expectedReady, attempts = 12) {
  let last = null;
  for (let index = 0; index < attempts; index += 1) {
    last = await probeAgenda();
    if (expectedReady ? last.storageGuardPassed : last.incidentConfirmed) return last;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return last || { status: 0, incidentConfirmed: false, storageGuardPassed: false };
}

function versionView(versionId, minimalConfig, cwd, allowFailure = false) {
  const result = runWrangler(
    ['versions', 'view', versionId, '--json', '--config', minimalConfig],
    cwd,
    'FALHA_AO_INSPECIONAR_VERSAO',
    allowFailure
  );
  if (!result.ok) return null;
  return parseJson(result.stdout);
}

function deploymentStatus(minimalConfig, cwd) {
  const result = runWrangler(
    ['deployments', 'status', '--json', '--config', minimalConfig],
    cwd,
    'FALHA_AO_LER_DEPLOYMENT'
  );
  return parseJson(result.stdout);
}

async function findRecoveryVersion(minimalConfig, cwd) {
  const candidates = [];
  for (const id of FIXED.knownGoodVersions) {
    const view = versionView(id, minimalConfig, cwd, true);
    if (!view) {
      candidates.push({ id, ready: false });
      continue;
    }
    const summary = inspectFirebaseBindings(view);
    candidates.push({ id, ready: summary.ready });
    if (summary.ready) return { id, candidates };
  }

  const listed = runWrangler(
    ['versions', 'list', '--json', '--config', minimalConfig],
    cwd,
    'FALHA_AO_LISTAR_VERSOES'
  );
  const versions = parseJson(listed.stdout);
  must(Array.isArray(versions), 'LISTA_DE_VERSOES_INVALIDA');

  const ordered = [...versions]
    .filter((item) => UUID.test(item?.id || ''))
    .sort((a, b) => Date.parse(a?.metadata?.created_on || 0) - Date.parse(b?.metadata?.created_on || 0));

  for (const item of ordered) {
    if (FIXED.knownGoodVersions.includes(item.id)) continue;
    const view = versionView(item.id, minimalConfig, cwd, true);
    if (!view) continue;
    const summary = inspectFirebaseBindings(view);
    if (summary.ready) return { id: item.id, candidates };
  }

  return { id: '', candidates };
}

function rollback(versionId, minimalConfig, cwd, message) {
  must(UUID.test(versionId), 'VERSAO_DE_ROLLBACK_INVALIDA');
  runWrangler(
    ['rollback', versionId, '--message', message, '--config', minimalConfig],
    cwd,
    'ROLLBACK_CLOUDFLARE_FALHOU'
  );
}

function deployCurrentMain(cloneRoot) {
  const config = path.join(cloneRoot, 'worker', 'wrangler.toml');
  must(fs.existsSync(config), 'WRANGLER_TOML_AUSENTE');
  runWrangler(['deploy', '--config', config], cloneRoot, 'DEPLOY_MAIN_FALHOU');
}

function validateCurrentMain(cloneRoot) {
  runChecked(process.execPath, ['--check', 'worker/agenda.js'], cloneRoot, 'SINTAXE_AGENDA_INVALIDA');
  runChecked(
    process.execPath,
    ['--test', 'worker/tests/agenda.test.mjs', 'worker/tests/agenda-capacity.test.mjs'],
    cloneRoot,
    'TESTES_AGENDA_FALHARAM',
    { timeout: 180000 }
  );
}

function dryRunCurrentMain(cloneRoot, dryDir) {
  const config = path.join(cloneRoot, 'worker', 'wrangler.toml');
  fs.mkdirSync(dryDir, { recursive: true });
  runWrangler(
    ['deploy', '--dry-run', '--outdir', dryDir, '--config', config],
    cloneRoot,
    'DRY_RUN_MAIN_FALHOU'
  );
}

async function confirmHuman(originalVersion, recoveryVersion) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('');
    console.log('DIAGNOSTICO=bindings Firebase ausentes na versão produtiva atual');
    safeLine('versaoAtual', originalVersion);
    safeLine('versaoRecuperacao', recoveryVersion);
    console.log('acao=rollback temporario -> confirmar Firebase -> republicar a main atual');
    console.log('segredos=nenhum valor sera exibido ou gravado');
    const answer = await rl.question('Para continuar, digite RECUPERAR AGENDA: ');
    must(answer.trim() === 'RECUPERAR AGENDA', 'CANCELADO_PELO_OPERADOR');
  } finally {
    rl.close();
  }
}

export async function recoverAgenda() {
  const initialProbe = await probeAgenda();
  if (initialProbe.storageGuardPassed) {
    console.log('AGENDA_JA_DISPONIVEL');
    safeLine('http', initialProbe.status);
    return { changed: false, status: initialProbe.status };
  }
  must(initialProbe.incidentConfirmed, 'RESPOSTA_AGENDA_NAO_CORRESPONDE_AO_INCIDENTE');

  const baseRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agenda-firebase-recovery-'));
  const cloneRoot = path.join(baseRoot, 'repo');
  const minimalConfig = path.join(baseRoot, 'wrangler.readonly.json');
  const dryDir = path.join(baseRoot, 'dry-run');
  let originalVersion = '';
  let mutationStarted = false;
  let completed = false;

  try {
    console.log('1/8 Baixando a main atual e validando a Agenda...');
    runChecked(
      'git',
      ['clone', '--depth', '1', '--branch', 'main', '--single-branch', FIXED.repository, cloneRoot],
      baseRoot,
      'GIT_CLONE_FALHOU',
      { timeout: 180000 }
    );
    const localSha = localHeadSha(cloneRoot);
    must(localSha === remoteMainSha(cloneRoot), 'MAIN_MUDOU_DURANTE_PREPARACAO');
    validateCurrentMain(cloneRoot);

    console.log('2/8 Validando o deploy atual sem alterar produção...');
    dryRunCurrentMain(cloneRoot, dryDir);
    writeJson(minimalConfig, { name: FIXED.worker, account_id: FIXED.account, send_metrics: false });

    console.log('3/8 Inspecionando somente nomes e tipos dos bindings...');
    originalVersion = activeVersionFromDeployment(deploymentStatus(minimalConfig, baseRoot));
    const currentView = versionView(originalVersion, minimalConfig, baseRoot);
    const currentBindings = inspectFirebaseBindings(currentView);
    safeLine('firebaseBindingsAtuais', currentBindings.ready ? 'OK' : 'INCOMPLETOS');
    safeLine('firebaseBindingsAusentes', currentBindings.missing.join(',') || 'nenhum');
    must(!currentBindings.ready, 'WORKER_DECLARA_FIREBASE_PRONTO_MAS_API_RETORNA_503');

    console.log('4/8 Localizando versão homologada com Firebase íntegro...');
    const recovery = await findRecoveryVersion(minimalConfig, baseRoot);
    must(UUID.test(recovery.id), 'VERSAO_HOMOLOGADA_COM_FIREBASE_NAO_ENCONTRADA');
    safeLine('versaoRecuperacaoEncontrada', recovery.id);

    await confirmHuman(originalVersion, recovery.id);

    console.log('5/8 Restaurando temporariamente a configuração homologada...');
    mutationStarted = true;
    rollback(recovery.id, minimalConfig, baseRoot, 'Recuperar bindings Firebase da Agenda');
    const restoredProbe = await waitForStorageGuard(true);
    must(restoredProbe.storageGuardPassed, 'ROLLBACK_NAO_RESTAUROU_FIREBASE');

    const rollbackActive = activeVersionFromDeployment(deploymentStatus(minimalConfig, baseRoot));
    const rollbackBindings = inspectFirebaseBindings(versionView(rollbackActive, minimalConfig, baseRoot));
    must(rollbackBindings.ready, 'BINDINGS_FIREBASE_NAO_RESTAURADOS');

    console.log('6/8 Reconfirmando que a main não mudou...');
    must(localHeadSha(cloneRoot) === remoteMainSha(cloneRoot), 'MAIN_MUDOU_ANTES_DA_REPUBLICACAO');

    console.log('7/8 Republicando a main atual com os bindings preservados...');
    deployCurrentMain(cloneRoot);

    console.log('8/8 Confirmando armazenamento e autenticação da Agenda...');
    const finalProbe = await waitForStorageGuard(true);
    must(finalProbe.storageGuardPassed, 'AGENDA_CONTINUA_SEM_ARMAZENAMENTO');

    const finalVersion = activeVersionFromDeployment(deploymentStatus(minimalConfig, baseRoot));
    const finalBindings = inspectFirebaseBindings(versionView(finalVersion, minimalConfig, baseRoot));
    must(finalBindings.ready, 'DEPLOY_FINAL_PERDEU_BINDINGS_FIREBASE');

    completed = true;
    console.log('');
    console.log('AGENDA_RECUPERADA');
    safeLine('main', localSha);
    safeLine('workerVersion', finalVersion);
    safeLine('httpAnonimo', finalProbe.status);
    console.log('resultado=Firestore voltou a ficar configurado; a API alcança novamente a barreira de autenticação');
    console.log('proximaAcao=atualizar /agenda/ e executar uma sincronizacao autorizada');
    return { changed: true, status: finalProbe.status, mainSha: localSha, versionId: finalVersion };
  } catch (error) {
    if (mutationStarted && !completed && UUID.test(originalVersion)) {
      try {
        console.log('');
        console.log('Falha após iniciar a recuperação. Restaurando a versão produtiva anterior...');
        rollback(originalVersion, minimalConfig, baseRoot, 'Rollback de segurança após falha na recuperação da Agenda');
        console.log('ROLLBACK_DE_SEGURANCA=OK');
      } catch {
        console.log('ROLLBACK_DE_SEGURANCA=FALHOU');
        console.log('ACAO_URGENTE=nao repetir; conferir o deployment do Worker antes de qualquer nova tentativa');
      }
    }
    throw error;
  } finally {
    try { fs.rmSync(baseRoot, { recursive: true, force: true }); } catch {}
  }
}

export async function main() {
  must(process.argv.length === 3 && process.argv[2] === '--recuperar', 'USAR_RECUPERAR');
  must(Number(process.versions.node.split('.')[0]) >= 22, 'NODE_22_OU_SUPERIOR_NECESSARIO');
  await recoverAgenda();
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.log('');
    safeLine('RECUPERACAO_INTERROMPIDA', error instanceof SafeError ? error.message : 'ERRO_NAO_CLASSIFICADO');
    process.exitCode = 1;
  });
}
