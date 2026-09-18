/**
 * Gate de deploy seguro do Worker institucional.
 *
 * Objetivo:
 * - nunca promover uma versão que perca bindings/segredos essenciais;
 * - enviar primeiro uma Worker Version sem tráfego;
 * - validar a versão candidata contra a produção ativa;
 * - promover somente a candidata íntegra;
 * - confirmar a Agenda após a promoção;
 * - restaurar a versão anterior se o pós-deploy falhar.
 *
 * Este arquivo não contém nem lê valores de secrets. O Wrangler pode expor
 * nomes/tipos dos bindings de uma versão, mas valores de secret_text/secret_key
 * permanecem opacos.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SAFE_DEPLOY = Object.freeze({
  account: '467be828c364ccf084240c34bb609b42',
  worker: 'yellow-wave-d0a1guia-regulacao-ia',
  wranglerVersion: '4.133.0',
  agendaApi: 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev/api/agenda',
  candidateMessage: 'Portal: candidato validado pelo gate de deploy seguro',
  candidateTag: 'portal-safe-deploy',
  postDeployAttempts: 15,
  postDeployDelayMs: 2000
});

export const CRITICAL_BINDINGS = Object.freeze([
  Object.freeze({ name: 'AUTH_DB', types: Object.freeze(['d1']) }),
  Object.freeze({ name: 'AI', types: Object.freeze(['ai']) }),
  Object.freeze({ name: 'FIREBASE_PROJECT_ID', types: Object.freeze(['plain_text', 'secret_text']) }),
  Object.freeze({ name: 'FIREBASE_CLIENT_EMAIL', types: Object.freeze(['plain_text', 'secret_text']) }),
  Object.freeze({ name: 'FIREBASE_PRIVATE_KEY', types: Object.freeze(['secret_text']) }),
  Object.freeze({ name: 'FIREBASE_STORAGE_BUCKET', types: Object.freeze(['plain_text', 'secret_text']) }),
  Object.freeze({ name: 'AUTH_SESSION_SECRET', types: Object.freeze(['secret_text', 'secret_key']) }),
  Object.freeze({ name: 'AUTH_RATE_LIMIT_SECRET', types: Object.freeze(['secret_text', 'secret_key']) }),
  Object.freeze({ name: 'GEMINI_API_KEY', types: Object.freeze(['secret_text', 'secret_key']) })
]);

export const STABLE_FIREBASE_TEXT_BINDINGS = Object.freeze([
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_STORAGE_BUCKET'
]);

const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

export class SafeDeployError extends Error {}

function must(condition, code) {
  if (!condition) throw new SafeDeployError(code);
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
    throw new SafeDeployError('RESPOSTA_JSON_NAO_RECONHECIDA');
  }
}

function safeLine(key, value) {
  console.log(String(key) + '=' + String(value ?? ''));
}

function run(command, args, cwd, timeout = 300000) {
  const result = spawnSync(command, args, {
    cwd,
    shell: false,
    windowsHide: true,
    encoding: 'utf8',
    timeout,
    maxBuffer: 12 * 1024 * 1024,
    env: {
      ...process.env,
      WRANGLER_SEND_METRICS: 'false',
      NO_COLOR: '1',
      FORCE_COLOR: '0',
      CI: 'true',
      CLOUDFLARE_ACCOUNT_ID: SAFE_DEPLOY.account
    }
  });
  return {
    ok: !result.error && result.status === 0,
    status: result.status,
    stdout: String(result.stdout || ''),
    stderr: String(result.stderr || '')
  };
}

export function wranglerCliPath(workerRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')) {
  const cli = path.join(workerRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
  must(fs.existsSync(cli), 'WRANGLER_LOCAL_NAO_ENCONTRADO');
  return cli;
}

export function wranglerArgs(args) {
  return [...args];
}

function runWrangler(args, cwd, code) {
  const cli = wranglerCliPath();
  const result = run(process.execPath, [cli, ...wranglerArgs(args)], cwd);
  if (!result.ok) {
    const text = (result.stderr + '\n' + result.stdout).toLowerCase();
    const category =
      /auth|unauthorized|forbidden|not logged in|login/.test(text) ? 'AUTENTICACAO' :
      /database_id|d1 database|d1_databases/.test(text) ? 'D1' :
      /inherit binding|required secrets|missing.*secret/.test(text) ? 'SEGREDOS' :
      /enotfound|econnreset|etimedout|network|fetch failed/.test(text) ? 'REDE' :
      result.status === null ? 'PROCESSO' : 'WRANGLER';
    safeLine('wranglerFalhaCategoria', category);
    throw new SafeDeployError(code);
  }
  return result.stdout;
}

function writeJson(file, value) {
  const temp = file + '.tmp-' + randomUUID();
  const fd = fs.openSync(temp, 'wx', 0o600);
  try {
    fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n', 'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(temp, file);
}

export function activeVersionFromDeployment(value) {
  must(value && Array.isArray(value.versions), 'DEPLOYMENT_NAO_IDENTIFICADO');
  const active = value.versions
    .filter((item) => item && UUID.test(item.version_id || '') && Number(item.percentage) > 0)
    .sort((a, b) => Number(b.percentage) - Number(a.percentage));
  must(active.length === 1 && Number(active[0].percentage) === 100, 'PRODUCAO_NAO_E_VERSAO_UNICA_EM_100');
  return active[0].version_id;
}

export function latestVersionEntry(values) {
  must(Array.isArray(values) && values.length > 0, 'LISTA_DE_VERSOES_INVALIDA');
  const valid = values
    .filter((item) => UUID.test(item?.id || '') && Number.isFinite(Date.parse(item?.metadata?.created_on || '')))
    .sort((a, b) => Date.parse(b.metadata.created_on) - Date.parse(a.metadata.created_on));
  must(valid.length > 0, 'LISTA_DE_VERSOES_SEM_METADADOS');
  if (valid.length > 1) {
    must(
      Date.parse(valid[0].metadata.created_on) !== Date.parse(valid[1].metadata.created_on),
      'ORDEM_DE_VERSOES_AMBIGUA'
    );
  }
  return valid[0];
}

export function latestVersionFromList(values) {
  return latestVersionEntry(values).id;
}

function versionAnnotation(value, key) {
  for (const source of [
    value?.annotations,
    value?.metadata?.annotations,
    value?.metadata
  ]) {
    const found = source?.[key];
    if (typeof found === 'string' && found) return found;
  }
  return '';
}

export function isSafeDeployCandidateVersion(...values) {
  const message = values.map((value) => versionAnnotation(value, 'workers/message')).find(Boolean) || '';
  const tag = values.map((value) => versionAnnotation(value, 'workers/tag')).find(Boolean) || '';
  return message === SAFE_DEPLOY.candidateMessage || tag === SAFE_DEPLOY.candidateTag;
}

function deploymentStatus(config, cwd) {
  return parseJson(runWrangler(
    ['deployments', 'status', '--json', '--config', config],
    cwd,
    'FALHA_AO_LER_DEPLOYMENT'
  ));
}

function versionView(versionId, config, cwd) {
  must(UUID.test(versionId), 'VERSAO_INVALIDA');
  return parseJson(runWrangler(
    ['versions', 'view', versionId, '--json', '--config', config],
    cwd,
    'FALHA_AO_LER_VERSAO'
  ));
}

function versionsList(config, cwd) {
  const values = parseJson(runWrangler(
    ['versions', 'list', '--json', '--config', config],
    cwd,
    'FALHA_AO_LISTAR_VERSOES'
  ));
  must(Array.isArray(values), 'LISTA_DE_VERSOES_INVALIDA');
  return values;
}

function versionIdSet(values) {
  return new Set(
    (Array.isArray(values) ? values : [])
      .map((item) => String(item?.id || ''))
      .filter((id) => UUID.test(id))
  );
}

export function newUploadedVersion(beforeValues, afterValues) {
  const before = versionIdSet(beforeValues);
  const after = versionIdSet(afterValues);
  const created = [...after].filter((id) => !before.has(id));
  must(created.length === 1, 'VERSAO_CANDIDATA_NAO_IDENTIFICADA');
  return created[0];
}

function bindingsOf(version) {
  const bindings = version?.resources?.bindings;
  must(Array.isArray(bindings), 'BINDINGS_NAO_IDENTIFICADOS');
  return bindings;
}

function bindingMap(version) {
  const map = new Map();
  for (const binding of bindingsOf(version)) {
    if (!binding || typeof binding.name !== 'string' || !binding.name) continue;
    must(!map.has(binding.name), 'BINDING_DUPLICADO');
    map.set(binding.name, binding);
  }
  return map;
}

export function authDbDatabaseId(version) {
  const binding = bindingMap(version).get('AUTH_DB');
  const id = String(binding?.id || '');
  must(binding?.type === 'd1' && UUID.test(id), 'AUTH_DB_ID_NAO_IDENTIFICADO');
  return id;
}

export function currentSecretBindingNames(version) {
  return bindingsOf(version)
    .filter((item) => item && (item.type === 'secret_text' || item.type === 'secret_key'))
    .map((item) => item.name)
    .filter(Boolean)
    .sort();
}

function sameSecretType(actualType, expectedType) {
  if (expectedType === 'secret_text' || expectedType === 'secret_key') {
    return actualType === 'secret_text' || actualType === 'secret_key';
  }
  return actualType === expectedType;
}

export function validateCandidateBindings(activeVersion, candidateVersion) {
  const active = bindingMap(activeVersion);
  const candidate = bindingMap(candidateVersion);

  for (const requirement of CRITICAL_BINDINGS) {
    const binding = candidate.get(requirement.name);
    must(binding && requirement.types.includes(binding.type), 'BINDING_CRITICO_AUSENTE_' + requirement.name);
  }

  const activeDb = active.get('AUTH_DB');
  const candidateDb = candidate.get('AUTH_DB');
  must(
    activeDb?.type === 'd1' &&
      candidateDb?.type === 'd1' &&
      UUID.test(String(activeDb.id || '')) &&
      candidateDb.id === activeDb.id,
    'AUTH_DB_DIVERGENTE'
  );

  for (const name of currentSecretBindingNames(activeVersion)) {
    const expected = active.get(name);
    const actual = candidate.get(name);
    must(actual && sameSecretType(actual.type, expected.type), 'SEGREDO_ATUAL_NAO_PRESERVADO_' + name);
  }

  for (const name of STABLE_FIREBASE_TEXT_BINDINGS) {
    const expected = active.get(name);
    const actual = candidate.get(name);
    if (!expected || expected.type !== 'plain_text') continue;
    must(
      actual?.type === 'plain_text' && String(actual.text || '') === String(expected.text || ''),
      'FIREBASE_PUBLICO_DIVERGENTE_' + name
    );
  }

  return {
    critical: CRITICAL_BINDINGS.length,
    preservedSecrets: currentSecretBindingNames(activeVersion).length,
    authDbId: String(candidateDb.id)
  };
}

function sectionStart(line) {
  return /^\s*\[\[?[^\]]+\]?\]\s*$/.test(line);
}

export function injectRequiredSecrets(toml, names) {
  const required = [...new Set((Array.isArray(names) ? names : []).map(String).filter(Boolean))].sort();
  must(required.length > 0, 'SEGREDOS_OBRIGATORIOS_NAO_IDENTIFICADOS');

  const source = String(toml || '').replace(/\r\n/g, '\n');
  must(!/^\s*\[secrets\]\s*$/m.test(source), 'SECAO_SECRETS_JA_EXISTE_NO_WRANGLER');
  const encoded = required.map((name) => JSON.stringify(name)).join(', ');
  return source.replace(/\s*$/, '') + '\n\n[secrets]\nrequired = [ ' + encoded + ' ]\n';
}

export function injectAuthDbDatabaseId(toml, databaseId) {
  must(UUID.test(databaseId), 'AUTH_DB_ID_INVALIDO');
  const lines = String(toml || '').replace(/\r\n/g, '\n').split('\n');
  let start = -1;
  let end = lines.length;
  let found = false;

  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*\[\[d1_databases\]\]\s*$/.test(lines[index])) {
      if (start >= 0 && found) {
        end = index;
        break;
      }
      start = index;
      found = false;
      continue;
    }
    if (start >= 0 && sectionStart(lines[index])) {
      if (found) {
        end = index;
        break;
      }
      start = -1;
      continue;
    }
    if (start >= 0 && /^\s*binding\s*=\s*["']AUTH_DB["']\s*$/.test(lines[index])) {
      found = true;
    }
  }

  must(start >= 0 && found, 'AUTH_DB_CONFIG_NAO_ENCONTRADO');

  let idLine = -1;
  let nameLine = -1;
  for (let index = start + 1; index < end; index += 1) {
    if (/^\s*database_id\s*=/.test(lines[index])) idLine = index;
    if (/^\s*database_name\s*=/.test(lines[index])) nameLine = index;
  }

  const line = 'database_id = "' + databaseId + '"';
  if (idLine >= 0) lines[idLine] = line;
  else lines.splice(nameLine >= 0 ? nameLine + 1 : end, 0, line);

  const output = lines.join('\n');
  must(output.includes(line), 'AUTH_DB_ID_NAO_INJETADO');
  must(/\bkeep_vars\s*=\s*true\b/.test(output), 'KEEP_VARS_OBRIGATORIO');
  return output;
}

function workerNameFromToml(toml) {
  const match = String(toml || '').match(/^\s*name\s*=\s*["']([^"']+)["']\s*$/m);
  must(match, 'WORKER_NAME_NAO_ENCONTRADO');
  must(match[1] === SAFE_DEPLOY.worker, 'WORKER_NAME_DIVERGENTE');
  return match[1];
}

export function classifyAgendaProbe(status) {
  const code = Number(status || 0);
  return {
    status: code,
    healthy: code === 401 || code === 403,
    firebaseBroken: code === 503
  };
}

async function probeAgenda(fetcher = fetch) {
  let response;
  try {
    response = await fetcher(SAFE_DEPLOY.agendaApi, {
      method: 'GET',
      redirect: 'manual',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
  } catch {
    throw new SafeDeployError('AGENDA_NAO_RESPONDE');
  }
  return classifyAgendaProbe(response.status);
}

async function waitForAgenda(fetcher = fetch) {
  let last = null;
  for (let attempt = 0; attempt < SAFE_DEPLOY.postDeployAttempts; attempt += 1) {
    last = await probeAgenda(fetcher);
    if (last.healthy) return last;
    if (last.firebaseBroken) {
      await new Promise((resolve) => setTimeout(resolve, SAFE_DEPLOY.postDeployDelayMs));
      continue;
    }
    await new Promise((resolve) => setTimeout(resolve, SAFE_DEPLOY.postDeployDelayMs));
  }
  return last || { status: 0, healthy: false, firebaseBroken: false };
}

function uploadCandidate(workerRoot, config) {
  const before = versionsList(config, workerRoot);
  runWrangler(
    [
      'versions', 'upload',
      '--experimental-provision=false',
      '--experimental-auto-create=false',
      '--message', SAFE_DEPLOY.candidateMessage,
      '--tag', SAFE_DEPLOY.candidateTag,
      '--strict',
      '--config', config
    ],
    workerRoot,
    'UPLOAD_DA_VERSAO_CANDIDATA_FALHOU'
  );
  const after = versionsList(config, workerRoot);
  return newUploadedVersion(before, after);
}

function promoteVersion(versionId, config, cwd, message) {
  must(UUID.test(versionId), 'VERSAO_PARA_PROMOCAO_INVALIDA');
  runWrangler(
    [
      'versions', 'deploy', versionId + '@100%', '-y',
      '--message', message,
      '--config', config
    ],
    cwd,
    'PROMOCAO_DA_VERSAO_FALHOU'
  );
}

function dryRun(workerRoot, config) {
  runWrangler(
    [
      'versions', 'upload',
      '--dry-run',
      '--experimental-provision=false',
      '--experimental-auto-create=false',
      '--strict',
      '--config', config
    ],
    workerRoot,
    'DRY_RUN_DO_DEPLOY_FALHOU'
  );
}

export async function safeDeploy({ workerRoot = process.cwd(), fetcher = fetch } = {}) {
  const root = path.resolve(workerRoot);
  const wranglerToml = path.join(root, 'wrangler.toml');
  must(fs.existsSync(wranglerToml), 'WRANGLER_TOML_NAO_ENCONTRADO');

  const sourceToml = fs.readFileSync(wranglerToml, 'utf8');
  workerNameFromToml(sourceToml);

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-worker-safe-deploy-'));
  const readConfig = path.join(tempRoot, 'wrangler.readonly.json');
  // Wrangler resolve "main" e outros caminhos relativos a partir do diretório
  // do arquivo de configuração. Por isso a configuração efêmera de deploy
  // precisa ficar dentro do workerRoot, não no diretório temporário externo.
  const deployConfig = path.join(root, '.wrangler.safe-deploy-' + randomUUID() + '.toml');
  let originalVersion = '';
  let candidateVersion = '';
  let promotionStarted = false;
  let completed = false;

  try {
    console.log('1/7 Conferindo produção e cadeia de versões...');
    safeLine('wranglerLocal', SAFE_DEPLOY.wranglerVersion);
    safeLine('authBuildToken', process.env.CLOUDFLARE_API_TOKEN ? 'PRESENTE' : 'AUSENTE');
    writeJson(readConfig, {
      name: SAFE_DEPLOY.worker,
      account_id: SAFE_DEPLOY.account,
      send_metrics: false
    });

    originalVersion = activeVersionFromDeployment(deploymentStatus(readConfig, tempRoot));
    const activeView = versionView(originalVersion, readConfig, tempRoot);
    const activeDbId = authDbDatabaseId(activeView);
    const activeValidation = validateCandidateBindings(activeView, activeView);

    const versionsBefore = versionsList(readConfig, tempRoot);
    const latestBefore = latestVersionEntry(versionsBefore);
    if (latestBefore.id !== originalVersion) {
      const latestView = versionView(latestBefore.id, readConfig, tempRoot);
      must(
        isSafeDeployCandidateVersion(latestBefore, latestView),
        'ULTIMA_VERSAO_NAO_E_A_PRODUCAO_PARE_E_REVISE'
      );
      const orphanValidation = validateCandidateBindings(activeView, latestView);
      safeLine('candidataOrfaAnterior', 'VALIDADA');
      safeLine('versaoOrfaAnterior', latestBefore.id);
      safeLine('segredosOrfaPreservados', orphanValidation.preservedSecrets);
    }

    safeLine('versaoProducao', originalVersion);
    safeLine('segredosAtuais', activeValidation.preservedSecrets);

    console.log('2/7 Preparando configuração efêmera e executando dry-run...');
    fs.writeFileSync(
      deployConfig,
      injectRequiredSecrets(
        injectAuthDbDatabaseId(sourceToml, activeDbId),
        currentSecretBindingNames(activeView)
      ),
      { encoding: 'utf8', mode: 0o600 }
    );
    dryRun(root, deployConfig);

    console.log('3/7 Enviando versão candidata sem tráfego...');
    candidateVersion = uploadCandidate(root, deployConfig);
    safeLine('versaoCandidata', candidateVersion);

    console.log('4/7 Validando bindings críticos e preservação de segredos...');
    const candidateView = versionView(candidateVersion, readConfig, tempRoot);
    const validation = validateCandidateBindings(activeView, candidateView);
    must(
      activeVersionFromDeployment(deploymentStatus(readConfig, tempRoot)) === originalVersion,
      'PRODUCAO_MUDOU_DURANTE_VALIDACAO'
    );
    safeLine('bindingsCriticos', validation.critical);
    safeLine('segredosPreservados', validation.preservedSecrets);
    console.log('gateBindings=OK');

    console.log('5/7 Promovendo somente a versão validada...');
    promotionStarted = true;
    promoteVersion(
      candidateVersion,
      readConfig,
      tempRoot,
      'Portal: promoção após gate de bindings e segredos'
    );

    const activeAfterPromotion = activeVersionFromDeployment(deploymentStatus(readConfig, tempRoot));
    must(activeAfterPromotion === candidateVersion, 'PROMOCAO_NAO_ATIVOU_CANDIDATA');

    console.log('6/7 Confirmando Agenda após a promoção...');
    const agenda = await waitForAgenda(fetcher);
    must(agenda.healthy, agenda.firebaseBroken ? 'AGENDA_FIREBASE_503_APOS_DEPLOY' : 'AGENDA_NAO_PASSOU_POS_DEPLOY');
    safeLine('agendaHttpAnonimo', agenda.status);

    console.log('7/7 Reconfirmando versão e bindings em produção...');
    const finalVersion = activeVersionFromDeployment(deploymentStatus(readConfig, tempRoot));
    must(finalVersion === candidateVersion, 'VERSAO_FINAL_DIVERGENTE');
    validateCandidateBindings(activeView, versionView(finalVersion, readConfig, tempRoot));

    completed = true;
    console.log('');
    console.log('DEPLOY_SEGURO_CONCLUIDO');
    safeLine('workerVersion', finalVersion);
    console.log('resultado=versao candidata validada antes do trafego e Agenda confirmada depois da promocao');
    return { originalVersion, candidateVersion, status: agenda.status };
  } catch (error) {
    if (promotionStarted && !completed && UUID.test(originalVersion)) {
      try {
        console.log('');
        console.log('Falha após iniciar promoção. Restaurando a versão produtiva anterior...');
        promoteVersion(
          originalVersion,
          readConfig,
          tempRoot,
          'Portal: rollback automático do gate de deploy seguro'
        );
        const restored = activeVersionFromDeployment(deploymentStatus(readConfig, tempRoot));
        must(restored === originalVersion, 'ROLLBACK_NAO_RESTAURADO');
        console.log('ROLLBACK_DE_SEGURANCA=OK');
      } catch {
        console.log('ROLLBACK_DE_SEGURANCA=FALHOU');
        console.log('ACAO_URGENTE=interromper novos deploys e conferir o Worker manualmente');
      }
    } else if (candidateVersion && !promotionStarted) {
      console.log('');
      console.log('CANDIDATA_BLOQUEADA_SEM_TRAFego=SIM');
      console.log('ACAO=nao repetir automaticamente; revisar a ultima Worker Version antes de novo upload');
    }
    throw error;
  } finally {
    try { fs.rmSync(deployConfig, { force: true }); } catch {}
    try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch {}
  }
}

export async function main() {
  must(Number(process.versions.node.split('.')[0]) >= 22, 'NODE_22_OU_SUPERIOR_NECESSARIO');
  await safeDeploy();
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.log('');
    safeLine(
      'DEPLOY_SEGURO_INTERROMPIDO',
      error instanceof SafeDeployError ? error.message : 'ERRO_NAO_CLASSIFICADO'
    );
    process.exitCode = 1;
  });
}
