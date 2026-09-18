/**
 * Agenda DigSaúde — recuperação controlada dos bindings Firebase em produção.
 *
 * O incidente conhecido retorna 503 antes de consultar o Firestore quando um dos
 * bindings FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ou FIREBASE_PRIVATE_KEY não
 * está disponível no Worker.
 *
 * Estratégia:
 * 1. confirma que /api/agenda ainda está no erro específico de armazenamento;
 *    a main é baixada como snapshot ZIP autenticado pela referência pública do GitHub, sem exigir Git instalado;
 * 2. inspeciona somente nomes/tipos de bindings, nunca valores, e injeta no arquivo temporário apenas o ID técnico do D1 já ligado a AUTH_DB;
 * 3. localiza uma versão já homologada da Agenda para recuperar somente os valores Firebase não secretos;
 * 4. valida localmente uma nova chave da conta de serviço Firebase, sem imprimir ou versionar o conteúdo;
 * 5. envia a main como NOVA VERSÃO, sem tráfego, usando --secrets-file temporário apenas para os segredos Firebase fornecidos localmente;
 * 6. confirma Firebase, AUTH_DB e preservação dos segredos atuais antes de promover exatamente essa versão a 100%.
 *
 * Valores secretos nunca são impressos nem enviados ao GitHub. O arquivo temporário de segredos
 * existe somente no diretório temporário desta execução e é removido no finally.
 * No Windows, o Wrangler é iniciado pelo próprio node.exe atual executando diretamente o npx-cli.js que acompanha essa instalação. Isso evita depender da execução de arquivos .cmd por subprocessos.
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
  repositoryOwner: 'regulacaoeldoradoms-cpu',
  repositoryName: 'guia-regulacao-eldorado',
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

export const FIREBASE_RECOVERY_BINDINGS = Object.freeze([
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_WEB_API_KEY',
  'FIREBASE_STORAGE_BUCKET'
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

export function authDbDatabaseId(version) {
  const bindings = Array.isArray(version?.resources?.bindings) ? version.resources.bindings : [];
  const binding = bindings.find((item) => item?.name === 'AUTH_DB' && item?.type === 'd1');
  const id = String(binding?.id || '');
  must(UUID.test(id), 'AUTH_DB_ID_NAO_IDENTIFICADO');
  return id;
}

export function firebaseRecoveryPlan(version) {
  const bindings = Array.isArray(version?.resources?.bindings) ? version.resources.bindings : [];
  const byName = new Map(bindings.filter((item) => item && typeof item.name === 'string').map((item) => [item.name, item]));
  const vars = {};
  const secrets = [];

  for (const name of FIREBASE_RECOVERY_BINDINGS) {
    const binding = byName.get(name);
    if (!binding) continue;
    if (binding.type === 'plain_text') {
      const value = String(binding.text || '').trim();
      must(value, 'FIREBASE_BINDING_PUBLICO_VAZIO');
      vars[name] = value;
      continue;
    }
    if (binding.type === 'secret_text') {
      secrets.push(name);
      continue;
    }
    throw new SafeError('FIREBASE_BINDING_TIPO_NAO_SUPORTADO');
  }

  for (const name of REQUIRED_FIREBASE_BINDINGS) {
    must(name in vars || secrets.includes(name), 'FIREBASE_RECOVERY_BINDING_AUSENTE');
  }
  must(secrets.includes('FIREBASE_PRIVATE_KEY'), 'FIREBASE_PRIVATE_KEY_NAO_E_SEGREDO');

  return { vars, secrets: [...new Set(secrets)].sort() };
}

function tomlValue(value) {
  return JSON.stringify(String(value));
}

export function parseServiceAccount(value, historicalVars = {}) {
  const payload = typeof value === 'string' ? parseJson(value) : value;
  must(payload && typeof payload === 'object' && !Array.isArray(payload), 'CONTA_SERVICO_FIREBASE_INVALIDA');

  const projectId = String(payload.project_id || '').trim();
  const clientEmail = String(payload.client_email || '').trim();
  const privateKey = String(payload.private_key || '').replace(/\\n/g, '\n').trim();

  must(projectId, 'CONTA_SERVICO_SEM_PROJECT_ID');
  must(clientEmail && clientEmail.includes('@'), 'CONTA_SERVICO_SEM_CLIENT_EMAIL');
  must(
    privateKey.startsWith('-----BEGIN PRIVATE KEY-----') &&
      privateKey.endsWith('-----END PRIVATE KEY-----'),
    'CONTA_SERVICO_SEM_PRIVATE_KEY'
  );

  if (historicalVars.FIREBASE_PROJECT_ID) {
    must(projectId === String(historicalVars.FIREBASE_PROJECT_ID).trim(), 'PROJECT_ID_FIREBASE_DIVERGENTE');
  }
  if (historicalVars.FIREBASE_CLIENT_EMAIL) {
    must(
      clientEmail.toLowerCase() === String(historicalVars.FIREBASE_CLIENT_EMAIL).trim().toLowerCase(),
      'CLIENT_EMAIL_FIREBASE_DIVERGENTE'
    );
  }

  return { projectId, clientEmail, privateKey };
}

function readSmallFile(file, code, maxBytes = 256 * 1024) {
  const target = path.resolve(String(file || ''));
  must(target && fs.existsSync(target), code);
  const stat = fs.lstatSync(target);
  must(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= maxBytes, code);
  return fs.readFileSync(target, 'utf8');
}

export function buildLocalFirebaseSecrets(plan, serviceAccount, webApiKey = '') {
  must(plan && Array.isArray(plan.secrets), 'PLANO_FIREBASE_INVALIDO');
  const allowed = new Set(['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_WEB_API_KEY']);
  for (const name of plan.secrets) must(allowed.has(name), 'SEGREDO_FIREBASE_NAO_SUPORTADO');

  const secrets = {};
  if (plan.secrets.includes('FIREBASE_PROJECT_ID')) secrets.FIREBASE_PROJECT_ID = serviceAccount.projectId;
  if (plan.secrets.includes('FIREBASE_CLIENT_EMAIL')) secrets.FIREBASE_CLIENT_EMAIL = serviceAccount.clientEmail;
  if (plan.secrets.includes('FIREBASE_PRIVATE_KEY')) secrets.FIREBASE_PRIVATE_KEY = serviceAccount.privateKey;

  const webKey = String(webApiKey || '').trim();
  if (webKey && plan.vars?.FIREBASE_WEB_API_KEY) {
    must(webKey === String(plan.vars.FIREBASE_WEB_API_KEY).trim(), 'WEB_API_KEY_FIREBASE_DIVERGENTE');
  } else if (webKey) {
    must(webKey.length >= 20, 'WEB_API_KEY_FIREBASE_LOCAL_INVALIDA');
    secrets.FIREBASE_WEB_API_KEY = webKey;
  }

  must(typeof secrets.FIREBASE_PRIVATE_KEY === 'string' && secrets.FIREBASE_PRIVATE_KEY.length > 100, 'PRIVATE_KEY_FIREBASE_LOCAL_AUSENTE');
  return secrets;
}

export function currentSecretBindingNames(version) {
  const bindings = Array.isArray(version?.resources?.bindings) ? version.resources.bindings : [];
  return bindings
    .filter((item) => item && (item.type === 'secret_text' || item.type === 'secret_key'))
    .map((item) => item.name)
    .filter(Boolean)
    .sort();
}

export function validatePreparedBindings(preparedVersion, currentVersion, plan, providedSecrets, databaseId) {
  const bindings = Array.isArray(preparedVersion?.resources?.bindings) ? preparedVersion.resources.bindings : [];
  const byName = new Map(bindings.filter((item) => item && typeof item.name === 'string').map((item) => [item.name, item]));

  for (const name of currentSecretBindingNames(currentVersion)) {
    const binding = byName.get(name);
    must(binding && (binding.type === 'secret_text' || binding.type === 'secret_key'), 'SEGREDO_ATUAL_NAO_PRESERVADO');
  }

  for (const [name, value] of Object.entries(plan?.vars || {})) {
    const binding = byName.get(name);
    must(binding?.type === 'plain_text' && binding.text === value, 'FIREBASE_PUBLICO_DIVERGENTE_NA_VERSAO');
  }

  for (const name of Object.keys(providedSecrets || {})) {
    const binding = byName.get(name);
    must(binding?.type === 'secret_text' || binding?.type === 'secret_key', 'SEGREDO_FIREBASE_NAO_APLICADO');
  }

  must(inspectFirebaseBindings(preparedVersion).ready, 'VERSAO_PREPARADA_SEM_FIREBASE');
  must(authDbDatabaseId(preparedVersion) === databaseId, 'VERSAO_PREPARADA_COM_D1_DIVERGENTE');
  return true;
}


export function injectVars(toml, values = {}) {
  const entries = Object.entries(values);
  if (!entries.length) return String(toml || '');
  const lines = String(toml || '').replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((line) => /^\s*\[vars\]\s*$/.test(line));
  must(start >= 0, 'VARS_CONFIG_NAO_ENCONTRADO');
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (sectionStart(lines[index])) { end = index; break; }
  }

  for (const [name, value] of entries) {
    const existing = lines.findIndex((line, index) => index > start && index < end && line.trimStart().startsWith(name + ' ='));
    const replacement = name + ' = ' + tomlValue(value);
    if (existing >= 0) lines[existing] = replacement;
    else { lines.splice(end, 0, replacement); end += 1; }
  }
  return lines.join('\n');
}

export function buildRecoveryToml(toml, databaseId, recoveryVersion) {
  const plan = firebaseRecoveryPlan(recoveryVersion);
  let output = injectAuthDbDatabaseId(toml, databaseId);
  output = injectVars(output, plan.vars);
  must(/\bkeep_vars\s*=\s*true\b/.test(output), 'KEEP_VARS_NAO_CONFIRMADO');
  must(!/^\s*\[secrets\]\s*$/m.test(output), 'SECRETS_REQUIRED_NAO_PERMITIDO_NA_RECUPERACAO');
  return { toml: output, plan };
}

function sectionStart(line) {
  return /^\s*\[\[?[^\]]+\]?\]\s*$/.test(line);
}

export function injectAuthDbDatabaseId(toml, databaseId) {
  must(UUID.test(databaseId), 'AUTH_DB_ID_INVALIDO');
  const lines = String(toml || '').replace(/\r\n/g, '\n').split('\n');
  let blockStart = -1;
  let blockEnd = lines.length;
  let found = false;

  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*\[\[d1_databases\]\]\s*$/.test(lines[index])) {
      if (blockStart >= 0 && found) {
        blockEnd = index;
        break;
      }
      blockStart = index;
      found = false;
      continue;
    }
    if (blockStart >= 0 && sectionStart(lines[index])) {
      if (found) {
        blockEnd = index;
        break;
      }
      blockStart = -1;
      continue;
    }
    if (blockStart >= 0 && /^\s*binding\s*=\s*["']AUTH_DB["']\s*$/.test(lines[index])) {
      found = true;
    }
  }

  must(blockStart >= 0 && found, 'AUTH_DB_CONFIG_NAO_ENCONTRADO');

  let databaseIdLine = -1;
  let databaseNameLine = -1;
  for (let index = blockStart + 1; index < blockEnd; index += 1) {
    if (/^\s*database_id\s*=/.test(lines[index])) databaseIdLine = index;
    if (/^\s*database_name\s*=/.test(lines[index])) databaseNameLine = index;
  }

  const line = `database_id = "${databaseId}"`;
  if (databaseIdLine >= 0) lines[databaseIdLine] = line;
  else {
    const insertAt = databaseNameLine >= 0 ? databaseNameLine + 1 : blockEnd;
    lines.splice(insertAt, 0, line);
  }

  const output = lines.join('\n');
  must(output.includes(line), 'AUTH_DB_ID_NAO_INJETADO');
  return output;
}

function createRecoveryDeployConfig(repositoryRoot, databaseId, recoveryVersion = null) {
  const original = path.join(repositoryRoot, 'worker', 'wrangler.toml');
  must(fs.existsSync(original), 'WRANGLER_TOML_AUSENTE');
  const source = fs.readFileSync(original, 'utf8');
  const built = recoveryVersion
    ? buildRecoveryToml(source, databaseId, recoveryVersion)
    : { toml: injectAuthDbDatabaseId(source, databaseId), plan: { vars: {}, secrets: [] } };
  const target = path.join(repositoryRoot, 'worker', 'wrangler.agenda-recovery.toml');
  fs.writeFileSync(target, built.toml, { encoding: 'utf8', mode: 0o600 });
  return { path: target, plan: built.plan };
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

export function wranglerArgs(args) {
  return ['--yes', 'wrangler@' + FIXED.wranglerVersion, ...args];
}

export function npxCliPath(execPath = process.execPath) {
  const candidate = path.join(path.dirname(execPath), 'node_modules', 'npm', 'bin', 'npx-cli.js');
  must(fs.existsSync(candidate), 'NPX_CLI_NAO_ENCONTRADO');
  return candidate;
}

export function classifyWranglerFailure(result = {}) {
  const text = `${result.stderr || ''}\n${result.stdout || ''}`.toLowerCase();
  if (/required secrets|missing.*secret|secret.*required|secret.*not.*configured/.test(text)) return 'SEGREDOS_AUSENTES';
  if (/(missing|invalid|not found).*database_id|database_id.*(missing|invalid|not found)|d1 database.*(missing|invalid|not found)|d1_databases.*(missing|invalid)/.test(text)) return 'CONFIG_D1';
  if (/not logged in|login|api token|authentication|unauthorized|forbidden/.test(text)) return 'AUTENTICACAO_CLOUDFLARE';
  if (/enotfound|econnreset|etimedout|network|network request failed|fetch failed/.test(text)) return 'REDE';
  if (/npm|npx|package/.test(text) && /error|failed|not found/.test(text)) return 'NPX_WRANGLER';
  if (/toml|config/.test(text) && /error|invalid|missing/.test(text)) return 'CONFIG_WRANGLER';
  return result.status === null ? 'PROCESSO_NAO_INICIADO' : 'WRANGLER';
}

function runWrangler(args, cwd, code = 'WRANGLER_FALHOU', allowFailure = false) {
  let result;
  if (process.platform === 'win32') {
    const cli = npxCliPath();
    result = run(
      process.execPath,
      [cli, ...wranglerArgs(args)],
      cwd,
      { timeout: 300000 }
    );
  } else {
    result = run('npx', wranglerArgs(args), cwd, { timeout: 300000 });
  }

  if (!result.ok && !allowFailure) {
    safeLine('wranglerFalhaCategoria', classifyWranglerFailure(result));
    throw new SafeError(code);
  }
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

export function mainBranchApiUrl() {
  return `https://api.github.com/repos/${FIXED.repositoryOwner}/${FIXED.repositoryName}/branches/main`;
}

export function mainArchiveUrl(sha) {
  must(GIT_SHA.test(sha), 'SHA_MAIN_REMOTA_INVALIDA');
  return `https://codeload.github.com/${FIXED.repositoryOwner}/${FIXED.repositoryName}/zip/${sha}`;
}

export async function remoteMainSha(fetcher = fetch) {
  let response;
  try {
    response = await fetcher(mainBranchApiUrl(), {
      method: 'GET',
      redirect: 'error',
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Portal-Regulacao-Agenda-Recovery/1.1'
      },
      signal: AbortSignal.timeout(15000)
    });
  } catch {
    throw new SafeError('GITHUB_MAIN_INDISPONIVEL');
  }
  must(response.ok, 'GITHUB_MAIN_INDISPONIVEL');
  const payload = await response.json().catch(() => ({}));
  const sha = String(payload?.commit?.sha || '');
  must(GIT_SHA.test(sha), 'SHA_MAIN_REMOTA_INVALIDA');
  return sha;
}

function powershellCommand() {
  if (process.platform === 'win32') return 'powershell.exe';
  return 'pwsh';
}

function expandZip(zipFile, destination, cwd) {
  const script = "& { param([string]$zip,[string]$dest) $ErrorActionPreference='Stop'; Expand-Archive -LiteralPath $zip -DestinationPath $dest -Force }";
  runChecked(
    powershellCommand(),
    ['-NoProfile', '-NonInteractive', '-Command', script, zipFile, destination],
    cwd,
    'FALHA_AO_EXTRAIR_MAIN',
    { timeout: 180000 }
  );
}

export function locateExtractedRepository(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true })
    .filter((item) => item.isDirectory() && item.name.startsWith(FIXED.repositoryName + '-'));
  must(entries.length === 1, 'ARQUIVO_MAIN_ESTRUTURA_INVALIDA');
  const repositoryRoot = path.join(root, entries[0].name);
  must(fs.existsSync(path.join(repositoryRoot, 'worker', 'wrangler.toml')), 'WRANGLER_TOML_AUSENTE');
  return repositoryRoot;
}

export async function downloadMainSnapshot(baseRoot, sha, fetcher = fetch) {
  must(GIT_SHA.test(sha), 'SHA_MAIN_REMOTA_INVALIDA');
  const zipFile = path.join(baseRoot, 'main.zip');
  const extractRoot = path.join(baseRoot, 'main-source');
  let response;
  try {
    response = await fetcher(mainArchiveUrl(sha), {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'User-Agent': 'Portal-Regulacao-Agenda-Recovery/1.1' },
      signal: AbortSignal.timeout(60000)
    });
  } catch {
    throw new SafeError('DOWNLOAD_MAIN_FALHOU');
  }
  must(response.ok, 'DOWNLOAD_MAIN_FALHOU');
  const bytes = Buffer.from(await response.arrayBuffer());
  must(bytes.length > 1000 && bytes.length < 80 * 1024 * 1024, 'DOWNLOAD_MAIN_TAMANHO_INVALIDO');
  fs.writeFileSync(zipFile, bytes, { mode: 0o600 });
  fs.mkdirSync(extractRoot, { recursive: true });
  expandZip(zipFile, extractRoot, baseRoot);
  return locateExtractedRepository(extractRoot);
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

function versionIdSet(minimalConfig, cwd) {
  const result = runWrangler(
    ['versions', 'list', '--json', '--config', minimalConfig],
    cwd,
    'FALHA_AO_LISTAR_VERSOES'
  );
  const values = parseJson(result.stdout);
  must(Array.isArray(values), 'LISTA_DE_VERSOES_INVALIDA');
  return new Set(values.map((item) => String(item?.id || '')).filter((id) => UUID.test(id)));
}

export function newUploadedVersion(beforeIds, afterIds) {
  const before = beforeIds instanceof Set ? beforeIds : new Set(beforeIds || []);
  const after = afterIds instanceof Set ? afterIds : new Set(afterIds || []);
  const created = [...after].filter((id) => UUID.test(id) && !before.has(id));
  must(created.length === 1, 'VERSAO_ENVIADA_NAO_IDENTIFICADA');
  return created[0];
}

function uploadCurrentMain(repositoryRoot, config, secretsFile, minimalConfig, cwd) {
  must(fs.existsSync(config), 'WRANGLER_RECOVERY_CONFIG_AUSENTE');
  must(fs.existsSync(secretsFile), 'ARQUIVO_SEGREDOS_FIREBASE_AUSENTE');
  const before = versionIdSet(minimalConfig, cwd);
  runWrangler(
    [
      'versions', 'upload',
      '--secrets-file', secretsFile,
      '--experimental-provision=false',
      '--experimental-auto-create=false',
      '--message', 'Agenda: recuperar Firebase e republicar main',
      '--config', config
    ],
    repositoryRoot,
    'UPLOAD_MAIN_FALHOU'
  );
  const after = versionIdSet(minimalConfig, cwd);
  return newUploadedVersion(before, after);
}

function deployUploadedVersion(versionId, minimalConfig, cwd, message = 'Agenda: promover main com Firebase recuperado') {
  must(UUID.test(versionId), 'VERSAO_PREPARADA_INVALIDA');
  runWrangler(
    [
      'versions', 'deploy', `${versionId}@100%`, '-y',
      '--message', message,
      '--config', minimalConfig
    ],
    cwd,
    'PROMOCAO_VERSAO_FALHOU'
  );
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

function dryRunCurrentMain(repositoryRoot, dryDir, config, secretsFile = '') {
  must(fs.existsSync(config), 'WRANGLER_RECOVERY_CONFIG_AUSENTE');
  fs.mkdirSync(dryDir, { recursive: true });
  const args = [
    'versions', 'upload',
    '--dry-run',
    '--experimental-provision=false',
    '--experimental-auto-create=false'
  ];
  if (secretsFile) {
    must(fs.existsSync(secretsFile), 'ARQUIVO_SEGREDOS_FIREBASE_AUSENTE');
    args.push('--secrets-file', secretsFile);
  }
  args.push('--config', config);
  runWrangler(args, repositoryRoot, 'DRY_RUN_MAIN_FALHOU');
}

async function confirmHuman(originalVersion, recoveryVersion, optionalWebKeyPending) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('');
    console.log('DIAGNOSTICO=bindings Firebase ausentes na versão produtiva atual');
    safeLine('versaoAtual', originalVersion);
    safeLine('versaoReferenciaFirebase', recoveryVersion);
    console.log('acao=upload sem trafego com credencial Firebase local -> validar -> promover');
    console.log('segredos=valores ficam somente em arquivo temporario local e nao serao exibidos');
    if (optionalWebKeyPending) console.log('observacao=FIREBASE_WEB_API_KEY nao foi fornecida; a Agenda pode ser restaurada sem ela');
    const answer = await rl.question('Para continuar, digite RECUPERAR AGENDA: ');
    must(answer.trim() === 'RECUPERAR AGENDA', 'CANCELADO_PELO_OPERADOR');
  } finally {
    rl.close();
  }
}

export async function recoverAgenda(options) {
  const initialProbe = await probeAgenda();
  if (initialProbe.storageGuardPassed) {
    console.log('AGENDA_JA_DISPONIVEL');
    safeLine('http', initialProbe.status);
    return { changed: false, status: initialProbe.status };
  }
  must(initialProbe.incidentConfirmed, 'RESPOSTA_AGENDA_NAO_CORRESPONDE_AO_INCIDENTE');

  const baseRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agenda-firebase-recovery-'));
  const minimalConfig = path.join(baseRoot, 'wrangler.readonly.json');
  const dryDir = path.join(baseRoot, 'dry-run');
  let originalVersion = '';
  let mutationStarted = false;
  let completed = false;

  try {
    console.log('1/8 Baixando a main atual e validando a Agenda...');
    const localSha = await remoteMainSha();
    const downloadedRoot = await downloadMainSnapshot(baseRoot, localSha);
    validateCurrentMain(downloadedRoot);

    console.log('2/8 Conferindo o Worker produtivo e preparando o deploy local...');
    writeJson(minimalConfig, { name: FIXED.worker, account_id: FIXED.account, send_metrics: false });
    originalVersion = activeVersionFromDeployment(deploymentStatus(minimalConfig, baseRoot));
    const currentView = versionView(originalVersion, minimalConfig, baseRoot);
    const databaseId = authDbDatabaseId(currentView);
    const initialDeployConfig = createRecoveryDeployConfig(downloadedRoot, databaseId);

    console.log('3/8 Validando o deploy atual sem alterar produção...');
    dryRunCurrentMain(downloadedRoot, dryDir, initialDeployConfig.path);
    const currentBindings = inspectFirebaseBindings(currentView);
    safeLine('firebaseBindingsAtuais', currentBindings.ready ? 'OK' : 'INCOMPLETOS');
    safeLine('firebaseBindingsAusentes', currentBindings.missing.join(',') || 'nenhum');
    must(!currentBindings.ready, 'WORKER_DECLARA_FIREBASE_PRONTO_MAS_API_RETORNA_503');

    console.log('4/8 Localizando referência Firebase e validando credencial local...');
    const recovery = await findRecoveryVersion(minimalConfig, baseRoot);
    must(UUID.test(recovery.id), 'VERSAO_HOMOLOGADA_COM_FIREBASE_NAO_ENCONTRADA');
    safeLine('versaoReferenciaFirebase', recovery.id);
    const recoveryView = versionView(recovery.id, minimalConfig, baseRoot);
    must(recoveryView, 'VERSAO_REFERENCIA_FIREBASE_NAO_LIDA');

    const recoveryPlan = firebaseRecoveryPlan(recoveryView);
    const serviceAccountText = readSmallFile(options.serviceAccountJson, 'ARQUIVO_CONTA_SERVICO_NAO_ENCONTRADO');
    const serviceAccount = parseServiceAccount(serviceAccountText, recoveryPlan.vars);
    const webApiKey = options.webApiKeyFile
      ? readSmallFile(options.webApiKeyFile, 'ARQUIVO_WEB_API_KEY_NAO_ENCONTRADO', 16 * 1024).trim()
      : '';
    const localFirebaseSecrets = buildLocalFirebaseSecrets(recoveryPlan, serviceAccount, webApiKey);
    const secretsFile = path.join(baseRoot, 'firebase-recovery-secrets.json');
    writeJson(secretsFile, localFirebaseSecrets);

    const recoveredDeployConfig = createRecoveryDeployConfig(downloadedRoot, databaseId, recoveryView);
    dryRunCurrentMain(downloadedRoot, dryDir, recoveredDeployConfig.path, secretsFile);
    const currentSecrets = new Set(currentSecretBindingNames(currentView));
    const optionalWebKeyPending = recoveryPlan.secrets.includes('FIREBASE_WEB_API_KEY')
      && !currentSecrets.has('FIREBASE_WEB_API_KEY')
      && !Object.prototype.hasOwnProperty.call(localFirebaseSecrets, 'FIREBASE_WEB_API_KEY');
    safeLine('firebasePublicosRecuperados', Object.keys(recoveryPlan.vars).length);
    safeLine('firebaseSegredosFornecidosLocalmente', Object.keys(localFirebaseSecrets).length);
    safeLine('segredosAtuaisAPreservar', currentSecrets.size);
    safeLine('credencialContaServico', 'VALIDADA');
    safeLine('firebaseWebApiKey', optionalWebKeyPending ? 'PENDENTE_OPCIONAL_PARA_AGENDA' : 'OK_OU_JA_EXISTENTE');

    await confirmHuman(originalVersion, recovery.id, optionalWebKeyPending);

    console.log('5/8 Reconfirmando main e produção antes do upload sem tráfego...');
    must(localSha === await remoteMainSha(), 'MAIN_MUDOU_ANTES_DA_REPUBLICACAO');
    must(activeVersionFromDeployment(deploymentStatus(minimalConfig, baseRoot)) === originalVersion, 'PRODUCAO_MUDOU_ANTES_DO_UPLOAD');

    console.log('6/8 Enviando a main como nova versão sem alterar o tráfego...');
    const preparedVersion = uploadCurrentMain(
      downloadedRoot, recoveredDeployConfig.path, secretsFile, minimalConfig, baseRoot
    );
    safeLine('versaoPreparada', preparedVersion);

    console.log('7/8 Validando Firebase, AUTH_DB e segredos preservados ainda sem tráfego...');
    const preparedView = versionView(preparedVersion, minimalConfig, baseRoot);
    must(preparedView, 'VERSAO_PREPARADA_NAO_LIDA');
    validatePreparedBindings(preparedView, currentView, recoveryPlan, localFirebaseSecrets, databaseId);
    must(activeVersionFromDeployment(deploymentStatus(minimalConfig, baseRoot)) === originalVersion, 'PRODUCAO_MUDOU_DURANTE_VALIDACAO');

    console.log('8/8 Promovendo somente a versão validada e confirmando a Agenda...');
    mutationStarted = true;
    deployUploadedVersion(preparedVersion, minimalConfig, baseRoot);
    const finalProbe = await waitForStorageGuard(true);
    must(finalProbe.storageGuardPassed, 'AGENDA_CONTINUA_SEM_ARMAZENAMENTO');

    const finalVersion = activeVersionFromDeployment(deploymentStatus(minimalConfig, baseRoot));
    must(finalVersion === preparedVersion, 'DEPLOY_FINAL_NAO_E_VERSAO_PREPARADA');
    const finalView = versionView(finalVersion, minimalConfig, baseRoot);
    validatePreparedBindings(finalView, currentView, recoveryPlan, localFirebaseSecrets, databaseId);
    completed = true;
    console.log('');
    console.log('AGENDA_RECUPERADA');
    safeLine('main', localSha);
    safeLine('workerVersion', finalVersion);
    safeLine('httpAnonimo', finalProbe.status);
    console.log('resultado=Agenda voltou ao Firestore usando nova credencial Firebase fornecida somente no computador local');
    console.log('proximaAcao=atualizar /agenda/ e executar uma sincronizacao autorizada');
    return { changed: true, status: finalProbe.status, mainSha: localSha, versionId: finalVersion };
  } catch (error) {
    if (mutationStarted && !completed && UUID.test(originalVersion)) {
      try {
        console.log('');
        console.log('Falha após iniciar a recuperação. Restaurando a versão produtiva anterior...');
        deployUploadedVersion(
          originalVersion,
          minimalConfig,
          baseRoot,
          'Agenda: restaurar versão anterior após falha na promoção'
        );
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

export function parseRecoveryArgs(argv) {
  const args = Array.isArray(argv) ? [...argv] : [];
  const options = { recuperar: false, serviceAccountJson: '', webApiKeyFile: '' };
  const seen = new Set();

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--recuperar') {
      must(!seen.has(token), 'ARGUMENTO_DUPLICADO');
      seen.add(token);
      options.recuperar = true;
      continue;
    }
    if (token === '--service-account-json' || token === '--web-api-key-file') {
      must(!seen.has(token), 'ARGUMENTO_DUPLICADO');
      seen.add(token);
      const value = args[index + 1];
      must(value && !String(value).startsWith('--'), 'ARGUMENTO_SEM_VALOR');
      if (token === '--service-account-json') options.serviceAccountJson = String(value);
      else options.webApiKeyFile = String(value);
      index += 1;
      continue;
    }
    throw new SafeError('ARGUMENTO_NAO_RECONHECIDO');
  }

  must(options.recuperar, 'USAR_RECUPERAR');
  must(options.serviceAccountJson, 'INFORMAR_SERVICE_ACCOUNT_JSON');
  return options;
}

export async function main() {
  const options = parseRecoveryArgs(process.argv.slice(2));
  must(Number(process.versions.node.split('.')[0]) >= 22, 'NODE_22_OU_SUPERIOR_NECESSARIO');
  await recoverAgenda(options);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.log('');
    safeLine('RECUPERACAO_INTERROMPIDA', error instanceof SafeError ? error.message : 'ERRO_NAO_CLASSIFICADO');
    process.exitCode = 1;
  });
}
