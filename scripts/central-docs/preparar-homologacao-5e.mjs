/**
 * Central de Documentos — Fase 5E
 * Prepara uma janela preview-only para homologar IA documental com fixtures sintéticos.
 *
 * Segurança:
 * - nunca promove versão para produção;
 * - exige produção estável em uma única versão a 100%;
 * - exige GEMINI_API_KEY já existente como secret, sem ler seu valor;
 * - usa somente AUTH_DB + secrets mínimos de autenticação/provedor;
 * - mantém escrita do Drive explicitamente false;
 * - cria controle D1 revogável e inicialmente desabilitado;
 * - só ativa o controle depois de validar preview, alias, CORS e bloqueio;
 * - baixa código de um commit Git fixo e verifica os git blob SHAs;
 * - não imprime username, secrets ou conteúdo documental.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { pathToFileURL } from 'node:url';

export const FIXED_5E = Object.freeze({
  account: '467be828c364ccf084240c34bb609b42',
  worker: 'yellow-wave-d0a1guia-regulacao-ia',
  alias: 'central-docs-phase5e',
  workerOrigin: 'https://central-docs-phase5e-yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev',
  templateControl: 'phase4d_d28ac0d37fe3409f8751fac02007e777',
  windowMinutes: 90,
  wranglerVersion: '4.133.0',
  tag: 'central-docs-phase5e',
  message: 'Central Docs 5E: homologacao sintetica controlada'
});

export const REQUIRED_SECRETS_5E = Object.freeze([
  'AUTH_SESSION_SECRET',
  'AUTH_RATE_LIMIT_SECRET',
  'GEMINI_API_KEY'
]);

export const OPTIONAL_SECRETS_5E = Object.freeze([
  'AUTH_USERS_JSON'
]);

const REPO = 'regulacaoeldoradoms-cpu/guia-regulacao-eldorado';
const RAW_BASE = 'https://raw.githubusercontent.com/' + REPO + '/';
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const SHA40 = /^[a-f0-9]{40}$/i;
const CONTROL = /^phase5e_[a-f0-9]{32}$/i;

export class Safe5eError extends Error {}

function must(value, code) {
  if (!value) throw new Safe5eError(code);
}

function stripAnsi(value) {
  return String(value || '').replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '').replace(/^\uFEFF/, '').trim();
}

export function parseJson(value) {
  try {
    return JSON.parse(stripAnsi(value));
  } catch (_) {
    throw new Safe5eError('RESPOSTA_JSON_NAO_RECONHECIDA');
  }
}

function safeLine(key, value) {
  console.log(String(key) + '=' + String(value ?? ''));
}

export function parseArgs(argv = process.argv.slice(2)) {
  const out = { prepare: false, sourceRef: '', pagesOrigin: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const item = String(argv[i] || '');
    if (item === '--preparar') out.prepare = true;
    else if (item === '--source-ref') out.sourceRef = String(argv[++i] || '');
    else if (item.startsWith('--source-ref=')) out.sourceRef = item.slice('--source-ref='.length);
    else if (item === '--pages-origin') out.pagesOrigin = String(argv[++i] || '');
    else if (item.startsWith('--pages-origin=')) out.pagesOrigin = item.slice('--pages-origin='.length);
    else throw new Safe5eError('ARGUMENTO_5E_NAO_RECONHECIDO');
  }
  must(out.prepare, 'USAR_FLAG_PREPARAR');
  must(SHA40.test(out.sourceRef), 'SOURCE_REF_5E_INVALIDO');
  out.sourceRef = out.sourceRef.toLowerCase();
  out.pagesOrigin = validatePagesOrigin(out.pagesOrigin);
  return out;
}

export function validatePagesOrigin(value) {
  let url;
  try {
    url = new URL(String(value || '').trim());
  } catch (_) {
    throw new Safe5eError('PAGES_ORIGIN_5E_INVALIDA');
  }
  must(
    url.protocol === 'https:'
    && url.hostname.endsWith('.pages.dev')
    && !url.username
    && !url.password
    && !url.port
    && url.pathname === '/'
    && !url.search
    && !url.hash,
    'PAGES_ORIGIN_5E_INVALIDA'
  );
  return url.origin;
}

const quote = value => "'" + String(value).replace(/'/g, "''") + "'";

export function runWrangler(args, cwd, runner = spawnSync) {
  const command = "$OutputEncoding=[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); & npx.cmd "
    + ['--yes', 'wrangler@' + FIXED_5E.wranglerVersion, ...args].map(quote).join(' ')
    + '; exit $LASTEXITCODE';
  const result = runner('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], {
    cwd,
    shell: false,
    windowsHide: true,
    encoding: 'utf8',
    timeout: 240000,
    maxBuffer: 12 * 1024 * 1024,
    env: {
      ...process.env,
      WRANGLER_SEND_METRICS: 'false',
      NO_COLOR: '1',
      FORCE_COLOR: '0',
      CI: 'true',
      CLOUDFLARE_ACCOUNT_ID: FIXED_5E.account
    }
  });
  must(!result.error && result.status === 0, 'WRANGLER_5E_FALHOU_OU_EXCEDEU_PRAZO');
  return String(result.stdout || '');
}

export function writeJson(file, value) {
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

function gitBlobSha(bytes) {
  return createHash('sha1')
    .update('blob ' + bytes.length + '\0')
    .update(bytes)
    .digest('hex');
}

async function githubJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
    redirect: 'error',
    signal: AbortSignal.timeout(20000)
  });
  must(response.ok, 'GITHUB_API_5E_INDISPONIVEL');
  return response.json();
}

export async function downloadRuntime(root, sourceRef) {
  must(SHA40.test(sourceRef), 'SOURCE_REF_5E_INVALIDO');

  const commit = await githubJson(
    'https://api.github.com/repos/' + REPO + '/git/commits/' + sourceRef
  );
  const treeSha = String(commit?.tree?.sha || '');
  must(SHA40.test(treeSha), 'ARVORE_GIT_5E_INVALIDA');

  const tree = await githubJson(
    'https://api.github.com/repos/' + REPO + '/git/trees/' + treeSha + '?recursive=1'
  );
  const files = Array.isArray(tree?.tree)
    ? tree.tree.filter((entry) => (
        entry?.type === 'blob'
        && /^worker\/[^/]+\.js$/.test(String(entry.path || ''))
        && SHA40.test(String(entry.sha || ''))
      ))
    : [];

  must(files.some((entry) => entry.path === 'worker/homologation-5e.js'), 'WRAPPER_5E_AUSENTE_NO_COMMIT');
  must(files.length >= 20 && files.length <= 120, 'ARVORE_WORKER_5E_FORA_DO_ESPERADO');

  for (const entry of files) {
    const url = RAW_BASE + sourceRef + '/' + entry.path.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(url, {
      redirect: 'error',
      signal: AbortSignal.timeout(20000)
    });
    must(response.ok, 'FONTE_5E_GITHUB_INDISPONIVEL');
    const bytes = Buffer.from(await response.arrayBuffer());
    must(bytes.length > 0 && bytes.length < 4 * 1024 * 1024, 'FONTE_5E_TAMANHO_INVALIDO');
    must(gitBlobSha(bytes) === entry.sha, 'FONTE_5E_DIVERGENTE_DO_GIT');
    const target = path.join(root, entry.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }

  return path.join(root, 'worker', 'homologation-5e.js');
}

export function activeVersionFromDeployment(value) {
  must(value && Array.isArray(value.versions), 'DEPLOYMENT_5E_NAO_IDENTIFICADO');
  const active = value.versions
    .filter((item) => item && UUID.test(item.version_id || '') && Number(item.percentage) > 0)
    .sort((a, b) => Number(b.percentage) - Number(a.percentage));
  must(
    active.length === 1 && Number(active[0].percentage) === 100,
    'PRODUCAO_5E_NAO_E_VERSAO_UNICA_EM_100'
  );
  return active[0].version_id;
}

function bindingMap(version) {
  const bindings = version?.resources?.bindings;
  must(Array.isArray(bindings), 'BINDINGS_PRODUTIVOS_5E_NAO_IDENTIFICADOS');
  const map = new Map();
  for (const binding of bindings) {
    if (!binding || typeof binding.name !== 'string' || !binding.name) continue;
    must(!map.has(binding.name), 'BINDING_PRODUTIVO_5E_DUPLICADO');
    map.set(binding.name, binding);
  }
  return map;
}

export function inspectProductionVersion(version) {
  must(version && UUID.test(version.id || ''), 'VERSAO_PRODUTIVA_5E_INVALIDA');
  const map = bindingMap(version);

  const db = map.get('AUTH_DB');
  must(db?.type === 'd1' && UUID.test(db.id || ''), 'AUTH_DB_5E_NAO_IDENTIFICADO');

  const secrets = new Set(
    [...map.values()]
      .filter((binding) => binding.type === 'secret_text' || binding.type === 'secret_key')
      .map((binding) => binding.name)
  );

  for (const required of ['AUTH_SESSION_SECRET', 'AUTH_RATE_LIMIT_SECRET']) {
    must(secrets.has(required), 'SEGREDO_5E_NECESSARIO_AUSENTE_' + required);
  }
  if (!secrets.has('GEMINI_API_KEY')) {
    throw new Safe5eError('INTERVENCAO_NECESSARIA_GEMINI_API_KEY_AUSENTE');
  }

  const plainVars = {};
  for (const binding of map.values()) {
    if (binding.type !== 'plain_text') continue;
    if (!/^[A-Z0-9_]{2,100}$/.test(binding.name)) continue;
    must(typeof binding.text === 'string', 'VARIAVEL_PRODUTIVA_5E_INVALIDA');
    plainVars[binding.name] = binding.text;
  }

  const runtime = version.resources?.script_runtime;
  must(/^\d{4}-\d{2}-\d{2}$/.test(String(runtime?.compatibility_date || '')), 'RUNTIME_5E_INVALIDO');
  const flags = runtime?.compatibility_flags ?? [];
  must(Array.isArray(flags) && flags.every((item) => typeof item === 'string'), 'RUNTIME_FLAGS_5E_INVALIDAS');

  return {
    dbId: db.id,
    plainVars,
    secretNames: [...secrets]
      .filter((name) => REQUIRED_SECRETS_5E.includes(name) || OPTIONAL_SECRETS_5E.includes(name))
      .sort(),
    compatibilityDate: runtime.compatibility_date,
    compatibilityFlags: flags
  };
}

export function buildPreviewConfig(base, entry, input) {
  must(base && UUID.test(base.dbId || ''), 'BASE_5E_INVALIDA');
  must(path.basename(entry) === 'homologation-5e.js', 'ENTRYPOINT_5E_INVALIDO');
  must(CONTROL.test(input.controlId || ''), 'CONTROLE_5E_INVALIDO');
  must(SHA40.test(input.sourceRef || ''), 'SOURCE_REF_5E_INVALIDO');

  const vars = {
    ...base.plainVars,
    ALLOWED_ORIGINS: input.pagesOrigin,
    DOCUMENTS_AI_ENABLED: 'true',
    DOCUMENTS_AI_PROCESSING_ENABLED: 'true',
    DOCUMENTS_DRIVE_WRITE_ENABLED: 'false',
    DOCUMENTS_AI_HOMOLOGATION_CONTROL_ID: input.controlId,
    DOCUMENTS_AI_HOMOLOGATION_ORIGIN: input.pagesOrigin,
    DOCUMENTS_AI_HOMOLOGATION_WORKER_ORIGIN: FIXED_5E.workerOrigin,
    DOCUMENTS_AI_HOMOLOGATION_RELEASE: input.sourceRef
  };

  return {
    name: FIXED_5E.worker,
    account_id: FIXED_5E.account,
    main: entry.replace(/\\/g, '/'),
    compatibility_date: base.compatibilityDate,
    ...(base.compatibilityFlags.length ? { compatibility_flags: [...base.compatibilityFlags] } : {}),
    send_metrics: false,
    vars,
    d1_databases: [{
      binding: 'AUTH_DB',
      database_name: 'portal-regulacao-users',
      database_id: base.dbId
    }],
    secrets: { required: [...base.secretNames] },
    unsafe: { metadata: { keep_bindings: [] } },
    upload_source_maps: false
  };
}

export function templateControlSql() {
  return "SELECT c.enabled,c.expires_at," +
    " EXISTS(SELECT 1 FROM auth_users u JOIN auth_document_access a ON a.username=u.username" +
    " WHERE u.username=c.allowed_username AND u.active=1 AND a.can_extract=1 AND a.can_view=1) AS extract_allowed," +
    " (SELECT count(*) FROM document_drive_homologation_controls" +
    " WHERE enabled=1 AND expires_at>CAST(strftime('%s','now') AS INTEGER)) AS active_controls" +
    " FROM document_drive_homologation_controls c WHERE c.control_id='" +
    FIXED_5E.templateControl + "';";
}

export function createControlSql(controlId, expiresAt) {
  must(CONTROL.test(controlId) && Number.isSafeInteger(expiresAt), 'PARAMETROS_CONTROLE_5E_INVALIDOS');
  return "INSERT INTO document_drive_homologation_controls" +
    " (control_id,enabled,expires_at,allowed_username,allowed_file_ids_json)" +
    " SELECT '" + controlId + "',0," + expiresAt + ",allowed_username,'[]'" +
    " FROM document_drive_homologation_controls" +
    " WHERE control_id='" + FIXED_5E.templateControl + "' AND enabled=0" +
    " AND NOT EXISTS (SELECT 1 FROM document_drive_homologation_controls" +
    " WHERE enabled=1 AND expires_at>CAST(strftime('%s','now') AS INTEGER));";
}

export function stateControlSql(controlId) {
  must(CONTROL.test(controlId), 'CONTROLE_5E_INVALIDO');
  return "SELECT enabled,expires_at," +
    " (SELECT count(*) FROM document_drive_homologation_controls" +
    " WHERE control_id<>'" + controlId + "' AND enabled=1" +
    " AND expires_at>CAST(strftime('%s','now') AS INTEGER)) AS other_active_controls" +
    " FROM document_drive_homologation_controls WHERE control_id='" + controlId + "';";
}

export function enableControlSql(controlId, expiresAt) {
  must(CONTROL.test(controlId) && Number.isSafeInteger(expiresAt), 'PARAMETROS_CONTROLE_5E_INVALIDOS');
  return "UPDATE document_drive_homologation_controls SET enabled=1" +
    " WHERE control_id='" + controlId + "' AND enabled=0 AND expires_at=" + expiresAt +
    " AND expires_at>CAST(strftime('%s','now') AS INTEGER)" +
    " AND NOT EXISTS (SELECT 1 FROM document_drive_homologation_controls" +
    " WHERE control_id<>'" + controlId + "' AND enabled=1" +
    " AND expires_at>CAST(strftime('%s','now') AS INTEGER));";
}

export function disableControlSql(controlId) {
  must(CONTROL.test(controlId), 'CONTROLE_5E_INVALIDO');
  return "UPDATE document_drive_homologation_controls SET enabled=0 WHERE control_id='" + controlId + "';";
}

function firstRow(value) {
  if (Array.isArray(value)) {
    for (const block of value) {
      if (Array.isArray(block?.results) && block.results.length) return block.results[0];
    }
  }
  if (Array.isArray(value?.results) && value.results.length) return value.results[0];
  return null;
}

export function validateTemplateControl(value) {
  const row = firstRow(value);
  must(row && Number(row.enabled) === 0, 'CONTROLE_TEMPLATE_5E_NAO_REVOGADO');
  must(Number(row.active_controls) === 0, 'OUTRA_JANELA_CONTROLADA_ATIVA');
  must(
    Number(row.extract_allowed) === 1,
    'INTERVENCAO_NECESSARIA_CAPABILITY_EXTRACT_AUSENTE'
  );
  return true;
}

export function validateControl(value, expiresAt, enabled) {
  const row = firstRow(value);
  must(row && Number(row.enabled) === enabled, 'ESTADO_CONTROLE_5E_DIVERGENTE');
  must(Number(row.expires_at) === expiresAt, 'PRAZO_CONTROLE_5E_DIVERGENTE');
  must(Number(row.other_active_controls) === 0, 'OUTRA_JANELA_CONTROLADA_ATIVA');
  return true;
}

const canonical = value => JSON.stringify(value, (_, item) => (
  item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map((key) => [key, item[key]]))
    : item
));

export async function inspectMultipart(bytes, config) {
  must(Buffer.isBuffer(bytes) && bytes.length > 0 && bytes.length <= 30 * 1024 * 1024, 'MULTIPART_5E_TAMANHO_INVALIDO');
  const firstEnd = bytes.indexOf('\r\n');
  must(firstEnd > 2 && firstEnd < 200, 'MULTIPART_5E_SEM_BOUNDARY');
  const first = bytes.subarray(0, firstEnd).toString('ascii');
  must(/^--[A-Za-z0-9_-]+$/.test(first), 'MULTIPART_5E_BOUNDARY_INVALIDO');

  let form;
  try {
    form = await new Response(bytes, {
      headers: { 'Content-Type': 'multipart/form-data; boundary=' + first.slice(2) }
    }).formData();
  } catch (_) {
    throw new Safe5eError('MULTIPART_5E_NAO_RECONHECIDO');
  }

  const moduleName = path.basename(config.main);
  must(moduleName === 'homologation-5e.js', 'MODULO_5E_DIVERGENTE');
  must(form.has('metadata') && form.has(moduleName), 'MULTIPART_5E_PARTES_INVALIDAS');

  const metadata = parseJson(form.get('metadata'));
  must(metadata.main_module === moduleName, 'MAIN_MODULE_5E_DIVERGENTE');
  must(Array.isArray(metadata.keep_bindings) && metadata.keep_bindings.length === 0, 'HERANCA_5E_AMPLA_BLOQUEADA');
  must(canonical(metadata.annotations) === canonical({
    'workers/alias': FIXED_5E.alias,
    'workers/tag': FIXED_5E.tag,
    'workers/message': FIXED_5E.message
  }), 'ANOTACOES_5E_DIVERGENTES');

  const expectedCount = Object.keys(config.vars).length + config.secrets.required.length + 1;
  must(Array.isArray(metadata.bindings) && metadata.bindings.length === expectedCount, 'BINDINGS_5E_MULTIPART_DIVERGENTES');

  const seen = new Set();
  for (const binding of metadata.bindings) {
    must(binding && typeof binding.name === 'string' && !seen.has(binding.name), 'BINDING_5E_DUPLICADO');
    seen.add(binding.name);

    if (Object.prototype.hasOwnProperty.call(config.vars, binding.name)) {
      must(binding.type === 'plain_text' && binding.text === config.vars[binding.name], 'VARIAVEL_5E_MULTIPART_DIVERGENTE');
    } else if (config.secrets.required.includes(binding.name)) {
      must(
        binding.type === 'inherit'
        && Object.keys(binding).every((key) => key === 'name' || key === 'type'),
        'SEGREDO_5E_MULTIPART_NAO_RESTRITO'
      );
    } else if (binding.name === 'AUTH_DB') {
      must(
        binding.type === 'd1'
        && binding.id === config.d1_databases[0].database_id,
        'AUTH_DB_5E_MULTIPART_DIVERGENTE'
      );
    } else {
      throw new Safe5eError('BINDING_5E_MULTIPART_FORA_DO_ESCOPO');
    }
  }
  return true;
}

export function latestVersion(values) {
  must(Array.isArray(values) && values.length, 'LISTA_VERSOES_5E_INVALIDA');
  const sorted = [...values]
    .filter((item) => UUID.test(item?.id || '') && Number.isFinite(Date.parse(item?.metadata?.created_on || '')))
    .sort((a, b) => Date.parse(b.metadata.created_on) - Date.parse(a.metadata.created_on));
  must(sorted.length, 'LISTA_VERSOES_5E_SEM_VALIDAS');
  return sorted[0].id;
}

export function uploadedVersionId(text) {
  const matches = [...stripAnsi(text).matchAll(/Worker Version ID:\s*([a-f0-9-]{36})\b/gi)];
  must(matches.length === 1 && UUID.test(matches[0][1]), 'VERSAO_PREVIEW_5E_NAO_IDENTIFICADA');
  return matches[0][1];
}

export function verifyAliasOutput(text) {
  const matches = [...stripAnsi(text).matchAll(/Version Preview Alias URL:\s*(https:\/\/[^\s]+)/g)];
  must(matches.length === 1 && matches[0][1] === FIXED_5E.workerOrigin, 'ALIAS_5E_NAO_CONFIRMADO');
  return true;
}

export function verifyPreviewVersion(version, config, id) {
  must(version?.id === id && UUID.test(id), 'VERSAO_5E_PREVIEW_INVALIDA');
  const map = bindingMap(version);

  for (const [name, value] of Object.entries(config.vars)) {
    const binding = map.get(name);
    must(binding?.type === 'plain_text' && binding.text === value, 'VARIAVEL_5E_PREVIEW_DIVERGENTE_' + name);
  }
  for (const name of config.secrets.required) {
    const binding = map.get(name);
    must(binding && (binding.type === 'secret_text' || binding.type === 'secret_key'), 'SEGREDO_5E_PREVIEW_AUSENTE_' + name);
  }
  const db = map.get('AUTH_DB');
  must(db?.type === 'd1' && db.id === config.d1_databases[0].database_id, 'AUTH_DB_5E_PREVIEW_DIVERGENTE');

  must(version.annotations?.['workers/alias'] === FIXED_5E.alias, 'ALIAS_5E_VERSION_DIVERGENTE');
  must(version.annotations?.['workers/tag'] === FIXED_5E.tag, 'TAG_5E_VERSION_DIVERGENTE');
  must(version.annotations?.['workers/message'] === FIXED_5E.message, 'MESSAGE_5E_VERSION_DIVERGENTE');
  must(version.resources?.script_runtime?.compatibility_date === config.compatibility_date, 'RUNTIME_5E_PREVIEW_DIVERGENTE');
  return true;
}

async function confirmPrepare() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('');
    console.log('Será preparada uma janela 5E por ' + FIXED_5E.windowMinutes + ' minutos.');
    console.log('Somente o Worker preview terá IA documental habilitada.');
    console.log('A escrita no Google Drive permanecerá false.');
    console.log('Produção não será promovida nem alterada.');
    console.log('O laboratório aceita somente fixtures sintéticos e a conta previamente autorizada.');
    const answer = await rl.question('Para continuar, digite PREPARAR HOMOLOGACAO 5E: ');
    must(answer.trim() === 'PREPARAR HOMOLOGACAO 5E', 'CANCELADO_PELO_OPERADOR');
  } finally {
    rl.close();
  }
}

async function httpProbe(pagesOrigin, expectedStatus) {
  const response = await fetch(FIXED_5E.workerOrigin + '/api/documents/access', {
    method: 'GET',
    redirect: 'manual',
    cache: 'no-store',
    credentials: 'omit',
    headers: { Accept: 'application/json', Origin: pagesOrigin },
    signal: AbortSignal.timeout(15000)
  });
  const release = String(response.headers.get('X-Central-Docs-AI-Preview-Release') || '').toLowerCase();
  must(response.status === expectedStatus, 'HTTP_5E_STATUS_DIVERGENTE');
  must(response.headers.get('Access-Control-Allow-Origin') === pagesOrigin, 'CORS_5E_DIVERGENTE');
  return release;
}

export async function prepare5e(options) {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_WINDOWS_DO_OPERADOR_5E');
  const baseDir = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos5E');
  fs.mkdirSync(baseDir, { recursive: true });

  const ledgerPath = path.join(baseDir, 'janela-5e.json');
  const markerPath = path.join(baseDir, 'upload-5e-incerto.json');
  const lockPath = path.join(baseDir, 'preparar-5e.lock');

  if (fs.existsSync(markerPath)) throw new Safe5eError('UPLOAD_5E_ANTERIOR_INCERTO_NAO_REPETIR');
  if (fs.existsSync(ledgerPath)) {
    try {
      const previous = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
      if (previous?.state === 'active') throw new Safe5eError('JANELA_5E_LOCAL_JA_ATIVA');
    } catch (error) {
      if (error instanceof Safe5eError) throw error;
    }
  }

  let lock;
  try {
    lock = fs.openSync(lockPath, 'wx', 0o600);
  } catch (_) {
    throw new Safe5eError('OUTRA_EXECUCAO_5E_ATIVA');
  }

  const work = path.join(baseDir, 'work-' + randomUUID());
  fs.mkdirSync(work, { recursive: true });
  let controlId = '';
  let expiresAt = 0;
  let controlCreated = false;
  let uploadAttempted = false;

  try {
    console.log('1/8 Baixando runtime do commit fixo e verificando blobs...');
    const entry = await downloadRuntime(work, options.sourceRef);

    const minimalPath = path.join(work, 'wrangler.readonly.json');
    writeJson(minimalPath, {
      name: FIXED_5E.worker,
      account_id: FIXED_5E.account,
      send_metrics: false
    });
    const queryMinimal = (args) => parseJson(runWrangler(
      [...args, '--json', '--config', minimalPath],
      work
    ));

    console.log('2/8 Reconfirmando produção e bindings necessários...');
    const deploymentBefore = queryMinimal(['deployments', 'status']);
    const productionVersion = activeVersionFromDeployment(deploymentBefore);
    const production = queryMinimal(['versions', 'view', productionVersion]);
    const base = inspectProductionVersion(production);

    const d1Path = path.join(work, 'wrangler.d1.json');
    writeJson(d1Path, {
      name: FIXED_5E.worker,
      account_id: FIXED_5E.account,
      send_metrics: false,
      d1_databases: [{
        binding: 'AUTH_DB',
        database_name: 'portal-regulacao-users',
        database_id: base.dbId
      }]
    });
    const queryD1 = (sql) => parseJson(runWrangler([
      'd1', 'execute', 'AUTH_DB', '--remote', '--command', sql,
      '--json', '--config', d1Path
    ], work));
    validateTemplateControl(queryD1(templateControlSql()));

    await confirmPrepare();

    controlId = 'phase5e_' + randomUUID().replaceAll('-', '');
    expiresAt = Math.floor(Date.now() / 1000) + FIXED_5E.windowMinutes * 60;

    console.log('3/8 Criando controle 5E desabilitado...');
    queryD1(createControlSql(controlId, expiresAt));
    controlCreated = true;
    validateControl(queryD1(stateControlSql(controlId)), expiresAt, 0);

    const config = buildPreviewConfig(base, entry, {
      sourceRef: options.sourceRef,
      pagesOrigin: options.pagesOrigin,
      controlId
    });
    const configPath = path.join(work, 'wrangler.preview-5e.json');
    writeJson(configPath, config);

    console.log('4/8 Gerando e inspecionando dry-run...');
    const dry = path.join(work, 'preview-5e.multipart');
    const flags = [
      '--preview-alias', FIXED_5E.alias,
      '--tag', FIXED_5E.tag,
      '--message', FIXED_5E.message,
      '--experimental-provision=false',
      '--experimental-auto-create=false'
    ];
    runWrangler([
      'versions', 'upload', ...flags,
      '--dry-run', '--outfile', dry,
      '--config', configPath
    ], work);
    await inspectMultipart(fs.readFileSync(dry), config);

    console.log('5/8 Reconfirmando produção e enviando apenas versão preview...');
    const deploymentRecheck = queryMinimal(['deployments', 'status']);
    must(
      activeVersionFromDeployment(deploymentRecheck) === productionVersion,
      'PRODUCAO_5E_MUDOU_DURANTE_PREPARO'
    );
    writeJson(markerPath, {
      sourceRef: options.sourceRef,
      controlId,
      expiresAt,
      attemptedAt: new Date().toISOString()
    });
    uploadAttempted = true;

    const output = runWrangler([
      'versions', 'upload', ...flags, '--config', configPath
    ], work);
    const previewVersion = uploadedVersionId(output);
    verifyAliasOutput(output);

    const preview = queryMinimal(['versions', 'view', previewVersion]);
    verifyPreviewVersion(preview, config, previewVersion);
    must(
      activeVersionFromDeployment(queryMinimal(['deployments', 'status'])) === productionVersion,
      'PRODUCAO_5E_MUDOU_APOS_UPLOAD'
    );

    console.log('6/8 Confirmando bloqueio antes de ativar controle...');
    const blockedRelease = await httpProbe(options.pagesOrigin, 403);
    must(blockedRelease === options.sourceRef, 'RELEASE_5E_BLOQUEADO_DIVERGENTE');

    console.log('7/8 Ativando controle temporário...');
    queryD1(enableControlSql(controlId, expiresAt));
    validateControl(queryD1(stateControlSql(controlId)), expiresAt, 1);

    console.log('8/8 Confirmando autenticação obrigatória e produção intacta...');
    const activeRelease = await httpProbe(options.pagesOrigin, 401);
    must(activeRelease === options.sourceRef, 'RELEASE_5E_ATIVO_DIVERGENTE');
    must(
      activeVersionFromDeployment(queryMinimal(['deployments', 'status'])) === productionVersion,
      'PRODUCAO_5E_MUDOU_NO_FINAL'
    );

    writeJson(ledgerPath, {
      revision: '5E.1',
      state: 'active',
      sourceRef: options.sourceRef,
      pagesOrigin: options.pagesOrigin,
      workerOrigin: FIXED_5E.workerOrigin,
      previewVersion,
      controlId,
      expiresAt,
      productionVersion,
      preparedAt: new Date().toISOString()
    });
    fs.rmSync(markerPath, { force: true });

    console.log('');
    console.log('HOMOLOGACAO_5E_PREPARADA');
    safeLine('previewVersion', previewVersion);
    safeLine('controlId', controlId);
    safeLine('expiresAt', new Date(expiresAt * 1000).toISOString());
    safeLine('release', options.sourceRef);
    safeLine('aiGate', 'true');
    safeLine('driveWriteGate', 'false');
    safeLine('productionVersion', productionVersion);
    safeLine('proxima_acao', 'ABRIR_LABORATORIO_5E');
    return {
      previewVersion,
      controlId,
      expiresAt,
      productionVersion
    };
  } catch (error) {
    if (controlCreated && controlId) {
      try {
        const ledger = fs.existsSync(ledgerPath)
          ? JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
          : null;
        if (!ledger || ledger.state !== 'active') {
          // Best effort only. A failed disable remains fail-closed at the wrapper if the control never enabled.
          const readConfig = path.join(work, 'wrangler.cleanup.json');
          // The D1 config may already exist; this path is used only if possible.
          const existing = path.join(work, 'wrangler.d1.json');
          if (fs.existsSync(existing)) {
            parseJson(runWrangler([
              'd1', 'execute', 'AUTH_DB', '--remote',
              '--command', disableControlSql(controlId),
              '--json', '--config', existing
            ], work));
          } else if (fs.existsSync(readConfig)) {
            void readConfig;
          }
        }
      } catch (_) {}
    }

    if (uploadAttempted) {
      safeLine('NAO_REPETIR_SEM_CONFERIR_PREVIEW', 'true');
    }
    throw error;
  } finally {
    try { if (lock) fs.closeSync(lock); } catch (_) {}
    fs.rmSync(lockPath, { force: true });
    fs.rmSync(work, { recursive: true, force: true });
  }
}

export async function main() {
  const options = parseArgs();
  try {
    await prepare5e(options);
  } catch (error) {
    console.log('');
    safeLine(
      'OPERACAO_INTERROMPIDA',
      error instanceof Safe5eError ? error.message : 'ERRO_5E_NAO_CLASSIFICADO'
    );
    process.exitCode = 1;
  }
}

if (
  process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await main();
}
