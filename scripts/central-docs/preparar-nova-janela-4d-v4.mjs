/**
 * Central de Documentos 4D V4 — prepara uma NOVA janela controlada, inicialmente sem escrita.
 *
 * Segurança:
 * - não reutiliza o controle/prazo antigo;
 * - reconfirma produção antes de qualquer alteração;
 * - baixa o runtime Worker de um commit GitHub fixo e verifica blobs;
 * - copia o escopo permitido no D1 sem imprimir usuário/fileId;
 * - cria o controle novo desabilitado, publica preview com gate=false e só então ativa a janela;
 * - nunca promove deployment de produção;
 * - em falha após criar o controle, tenta revogá-lo automaticamente;
 * - não imprime segredos, bindings completos, arquivo permitido ou credenciais.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { pathToFileURL } from 'node:url';

export const FIXED = Object.freeze({
  account: '467be828c364ccf084240c34bb609b42',
  worker: 'yellow-wave-d0a1guia-regulacao-ia',
  productionVersion: '91eae913-ebaa-4550-8e88-f701f6cef777',
  productionDeployment: '250b3d7b-9012-4073-9986-de36dd14bc3d',
  oldPreview: 'a17473ce-ad9a-480c-8e53-901f2fcc3c92',
  oldControl: 'phase4d_d7275a73110548fc8fd26125a60d6a2b',
  candidateRelease: '1d4decd03e0047a1bad678d60cee36ba6822d5b5',
  alias: 'central-docs-phase4d',
  pages: 'https://codex-central-docs-drive-syn.portal-regulacao-central-staging.pages.dev',
  origin: 'https://central-docs-phase4d-yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev',
  sourceRef: '1d4decd03e0047a1bad678d60cee36ba6822d5b5',
  windowMinutes: 90
});

export const PUBLIC_NAMES = Object.freeze([
  'ALLOWED_ORIGINS', 'AUTH_DEVELOPER_USERNAMES', 'DOCUMENTS_DRIVE_WRITE_ENABLED',
  'DOCUMENTS_HOMOLOGATION_CONTROL_ID', 'DOCUMENTS_HOMOLOGATION_DIAGNOSTICS',
  'DOCUMENTS_HOMOLOGATION_ORIGIN', 'DOCUMENTS_HOMOLOGATION_RELEASE',
  'DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN', 'GOOGLE_DRIVE_OAUTH_CLIENT_ID',
  'GOOGLE_DRIVE_OAUTH_REDIRECT_URI'
]);

export const SECRET_NAMES = Object.freeze([
  'AUTH_RATE_LIMIT_SECRET', 'AUTH_SESSION_SECRET', 'AUTH_USERS_JSON',
  'DRIVE_TOKEN_ENCRYPTION_KEY', 'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET', 'POSTHOG_PROJECT_TOKEN'
]);

export const SOURCE_BLOBS = Object.freeze({
  'worker/homologation-4d.js': 'eb4fb65ddb7bf40866e17e2a7402f2fc5b84f47b',
  'worker/auth-management-flex.js': '6295d70535ab18de31540f270b50a21e11871d4d',
  'worker/auth-management-v2.js': '5736662c5299be6e133004d82a3f7b040cb9e5bf',
  'worker/firebase-gateway.js': 'cb9732467a46995d929b4f864ca60ddafb5cb217',
  'worker/email-verification-route.js': 'ab13dce4cd0fbe08a452e6a0eb5807151dec8eed',
  'worker/telemedicine-access.js': 'cb8ba8f162784ba3981b3fca800eed57a0810bdf',
  'worker/council-vice-access.js': 'ac92a6a3ff52bac1752b86602f6ad05d7dc5681e',
  'worker/document-access.js': '1fa85b784d8b7d7e861706cad9d0e36613bb1e26',
  'worker/additional-roles.js': '86788768cc87920bf6b2f55db108991a50e50f40',
  'worker/social-schema.js': 'bc95c9c0e9c33e6f4fabd140d08fae287ca93407',
  'worker/documents-router.js': '75effef01cfc0a1e160885ba6aa147cb09ce443b',
  'worker/document-drive.js': '892d65eedcb9a4ba339c1a4e9c5c1df2be7c14fe',
  'worker/observability.js': '39c8db2548622d4b5e36a854a70a6054a1035d1e',
  'worker/portal-safety.js': '1503ab9e5956871c3bf3689ad9e1d6b37b643e75',
  'worker/account-levels.js': '58efe67284a44aaded4bef3514a46e0f74d35055'
});

const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const CONTROL = /^phase4d_[a-f0-9]{32}$/;
const RAW_BASE = 'https://raw.githubusercontent.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/';
const UPLOAD_TAG = 'central-docs-phase4d-v4';
const UPLOAD_MESSAGE = 'Central Docs 4D V4: nova janela; escrita bloqueada';

export class SafeError extends Error {}
const must = (ok, code) => { if (!ok) throw new SafeError(code); };
const strip = value => String(value || '').replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '');

export function parseJson(text) {
  try { return JSON.parse(strip(text).replace(/^\uFEFF/, '').trim()); }
  catch { throw new SafeError('RESPOSTA_JSON_NAO_RECONHECIDA'); }
}

const canonical = value => JSON.stringify(value, (_, v) => (
  v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]]))
    : v
));

function gitBlobSha(bytes) {
  return createHash('sha1')
    .update('blob ' + bytes.length + '\0')
    .update(bytes)
    .digest('hex');
}

export function productionSnapshot(value) {
  must(value && value.id === FIXED.productionDeployment, 'DEPLOYMENT_DE_PRODUCAO_DIVERGENTE');
  must(Array.isArray(value.versions) && value.versions.length === 1, 'DISTRIBUICAO_DE_PRODUCAO_DIVERGENTE');
  const v = value.versions[0];
  must(v && v.version_id === FIXED.productionVersion && v.percentage === 100, 'VERSAO_DE_PRODUCAO_DIVERGENTE');
  return { deploymentId: value.id, versionId: v.version_id, percentage: 100 };
}

export function inspectBindings(version) {
  must(version && Array.isArray(version.resources?.bindings), 'BINDINGS_NAO_IDENTIFICADOS');
  const vars = {};
  const secrets = [];
  let db = '';
  const names = new Set();
  for (const b of version.resources.bindings) {
    must(b && typeof b.name === 'string' && !names.has(b.name), 'BINDING_DUPLICADO_OU_INVALIDO');
    names.add(b.name);
    if (b.type === 'plain_text' && PUBLIC_NAMES.includes(b.name)) {
      must(typeof b.text === 'string', 'VARIAVEL_PUBLICA_INVALIDA');
      vars[b.name] = b.text;
    } else if (b.type === 'secret_text' && SECRET_NAMES.includes(b.name)) {
      secrets.push(b.name);
    } else if (b.type === 'd1' && b.name === 'AUTH_DB' && UUID.test(b.id || '')) {
      db = b.id;
    } else {
      throw new SafeError('BINDING_FORA_DO_ESCOPO_REVISADO');
    }
  }
  must(PUBLIC_NAMES.every(n => typeof vars[n] === 'string'), 'VARIAVEL_PUBLICA_AUSENTE');
  must(SECRET_NAMES.every(n => secrets.includes(n)), 'SEGREDO_NECESSARIO_AUSENTE');
  must(db, 'D1_AUSENTE');
  return { vars, secrets, db };
}

export function inspectOldPreview(version) {
  must(version?.id === FIXED.oldPreview, 'PREVIEW_BASE_DIVERGENTE');
  const b = inspectBindings(version);
  must(b.vars.DOCUMENTS_DRIVE_WRITE_ENABLED === 'false', 'PREVIEW_BASE_COM_ESCRITA');
  must(b.vars.DOCUMENTS_HOMOLOGATION_CONTROL_ID === FIXED.oldControl, 'CONTROLE_ANTIGO_DIVERGENTE');
  must(b.vars.DOCUMENTS_HOMOLOGATION_ORIGIN === FIXED.pages, 'ORIGEM_PAGES_DIVERGENTE');
  must(b.vars.DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN === FIXED.origin, 'ORIGEM_WORKER_DIVERGENTE');
  must(b.vars.ALLOWED_ORIGINS === FIXED.pages, 'ALLOWED_ORIGINS_DIVERGENTE');
  must(b.vars.DOCUMENTS_HOMOLOGATION_DIAGNOSTICS === 'true', 'DIAGNOSTICO_DIVERGENTE');
  const runtime = version.resources?.script_runtime;
  must(runtime?.compatibility_date === '2026-08-25', 'RUNTIME_DIVERGENTE');
  const flags = runtime.compatibility_flags ?? [];
  must(Array.isArray(flags) && flags.every(x => typeof x === 'string'), 'FLAGS_RUNTIME_INVALIDAS');
  return { ...b, compatibilityDate: runtime.compatibility_date, compatibilityFlags: flags };
}

export function inspectProduction(version, base) {
  must(version?.id === FIXED.productionVersion, 'VERSAO_PRODUTIVA_NAO_IDENTIFICADA');
  must(Array.isArray(version.resources?.bindings), 'BINDINGS_PRODUTIVOS_NAO_IDENTIFICADOS');
  const byName = new Map();
  for (const b of version.resources.bindings) {
    if (b && typeof b.name === 'string' && !byName.has(b.name)) byName.set(b.name, b);
  }
  const requiredPlain = ['AUTH_DEVELOPER_USERNAMES', 'GOOGLE_DRIVE_OAUTH_CLIENT_ID', 'GOOGLE_DRIVE_OAUTH_REDIRECT_URI'];
  must(byName.get('AUTH_DB')?.type === 'd1' && byName.get('AUTH_DB')?.id === base.db, 'D1_PRODUTIVO_DIVERGENTE');
  for (const name of SECRET_NAMES) must(byName.get(name)?.type === 'secret_text', 'SEGREDO_PRODUTIVO_AUSENTE');
  for (const name of requiredPlain) {
    const b = byName.get(name);
    must(b?.type === 'plain_text' && b.text === base.vars[name], 'VARIAVEL_PRODUTIVA_DIVERGENTE');
  }
  return true;
}

export function buildConfig(base, entry, controlId) {
  must(CONTROL.test(controlId), 'CONTROLE_NOVO_INVALIDO');
  must(path.basename(entry) === 'homologation-4d.js', 'ENTRADA_NAO_E_HOMOLOGACAO');
  return {
    name: FIXED.worker,
    account_id: FIXED.account,
    main: entry.replace(/\\/g, '/'),
    compatibility_date: base.compatibilityDate,
    ...(base.compatibilityFlags.length ? { compatibility_flags: base.compatibilityFlags } : {}),
    send_metrics: false,
    vars: {
      ...base.vars,
      DOCUMENTS_DRIVE_WRITE_ENABLED: 'false',
      DOCUMENTS_HOMOLOGATION_CONTROL_ID: controlId,
      DOCUMENTS_HOMOLOGATION_RELEASE: FIXED.candidateRelease
    },
    d1_databases: [{ binding: 'AUTH_DB', database_name: 'portal-regulacao-users', database_id: base.db }],
    secrets: { required: [...SECRET_NAMES] },
    unsafe: { metadata: { keep_bindings: [] } },
    dependencies_instrumentation: { enabled: false },
    upload_source_maps: false
  };
}

export function oldControlSql() {
  return "SELECT enabled, expires_at, json_array_length(allowed_file_ids_json) AS file_count," +
    " (SELECT count(*) FROM document_drive_homologation_controls" +
    " WHERE enabled=1 AND expires_at>CAST(strftime('%s','now') AS INTEGER)) AS active_controls" +
    " FROM document_drive_homologation_controls WHERE control_id='" + FIXED.oldControl + "';";
}

export function createControlSql(controlId, expiresAt) {
  must(CONTROL.test(controlId) && Number.isSafeInteger(expiresAt), 'PARAMETROS_CONTROLE_INVALIDOS');
  return "INSERT INTO document_drive_homologation_controls" +
    " (control_id,enabled,expires_at,allowed_username,allowed_file_ids_json)" +
    " SELECT '" + controlId + "',0," + expiresAt + ",allowed_username,allowed_file_ids_json" +
    " FROM document_drive_homologation_controls" +
    " WHERE control_id='" + FIXED.oldControl + "' AND enabled=0" +
    " AND json_array_length(allowed_file_ids_json)=1" +
    " AND NOT EXISTS (SELECT 1 FROM document_drive_homologation_controls" +
    " WHERE enabled=1 AND expires_at>CAST(strftime('%s','now') AS INTEGER));";
}

export function stateControlSql(controlId) {
  must(CONTROL.test(controlId), 'CONTROLE_NOVO_INVALIDO');
  return "SELECT enabled,expires_at,json_array_length(allowed_file_ids_json) AS file_count," +
    " (SELECT count(*) FROM document_drive_homologation_controls" +
    " WHERE control_id<>'" + controlId + "' AND enabled=1" +
    " AND expires_at>CAST(strftime('%s','now') AS INTEGER)) AS other_active_controls" +
    " FROM document_drive_homologation_controls WHERE control_id='" + controlId + "';";
}

export function enableControlSql(controlId, expiresAt) {
  must(CONTROL.test(controlId) && Number.isSafeInteger(expiresAt), 'PARAMETROS_CONTROLE_INVALIDOS');
  return "UPDATE document_drive_homologation_controls SET enabled=1" +
    " WHERE control_id='" + controlId + "' AND enabled=0 AND expires_at=" + expiresAt +
    " AND expires_at>CAST(strftime('%s','now') AS INTEGER)" +
    " AND NOT EXISTS (SELECT 1 FROM document_drive_homologation_controls" +
    " WHERE control_id<>'" + controlId + "' AND enabled=1" +
    " AND expires_at>CAST(strftime('%s','now') AS INTEGER));";
}

export function disableControlSql(controlId) {
  must(CONTROL.test(controlId), 'CONTROLE_NOVO_INVALIDO');
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

export function validateOldControl(value) {
  const r = firstRow(value);
  must(r && Number(r.enabled) === 0, 'CONTROLE_ANTIGO_NAO_REVOGADO');
  must(Number(r.file_count) === 1, 'ESCOPO_ANTIGO_DIVERGENTE');
  must(Number(r.active_controls) === 0, 'OUTRA_JANELA_ATIVA');
  return true;
}

export function validateNewControl(value, expiresAt, enabled) {
  const r = firstRow(value);
  must(r && Number(r.enabled) === enabled, 'ESTADO_CONTROLE_NOVO_DIVERGENTE');
  must(Number(r.expires_at) === expiresAt, 'PRAZO_CONTROLE_NOVO_DIVERGENTE');
  must(Number(r.file_count) === 1, 'ESCOPO_CONTROLE_NOVO_DIVERGENTE');
  must(Number(r.other_active_controls) === 0, 'OUTRA_JANELA_ATIVA');
  return true;
}

export function latestVersion(values) {
  must(Array.isArray(values) && values.length, 'LISTA_DE_VERSOES_INVALIDA');
  const sorted = [...values].sort((a, b) => Date.parse(b?.metadata?.created_on || 0) - Date.parse(a?.metadata?.created_on || 0));
  must(UUID.test(sorted[0]?.id || '') && Number.isFinite(Date.parse(sorted[0]?.metadata?.created_on)), 'VERSAO_RECENTE_INVALIDA');
  return sorted[0].id;
}

export function uploadedId(text) {
  const m = [...strip(text).matchAll(/Worker Version ID:\s*([a-f0-9-]{36})\b/gi)];
  must(m.length === 1 && UUID.test(m[0][1]), 'ENVIO_SEM_ID_CONFIRMADO');
  must(![FIXED.productionVersion, FIXED.oldPreview].includes(m[0][1]), 'ID_NOVO_DIVERGENTE');
  return m[0][1];
}

export function verifyUploadedAlias(text) {
  const m = [...strip(text).matchAll(/Version Preview Alias URL:\s*(https:\/\/[^\s]+)/g)];
  must(m.length === 1 && m[0][1] === FIXED.origin, 'URL_DO_ALIAS_NAO_CONFIRMADA');
}

export function verifyVersion(version, config, id) {
  must(version?.id === id && UUID.test(id), 'VERSAO_NOVA_NAO_CONFIRMADA');
  const observed = inspectBindings(version);
  must(observed.db === config.d1_databases[0].database_id, 'D1_DIVERGENTE');
  must(PUBLIC_NAMES.every(n => observed.vars[n] === config.vars[n]), 'FLAGS_NAO_CONFIRMADAS');
  must(version.resources?.script_runtime?.compatibility_date === config.compatibility_date, 'RUNTIME_NAO_CONFIRMADO');
  must(canonical(version.resources?.script_runtime?.compatibility_flags ?? []) === canonical(config.compatibility_flags ?? []),
    'FLAGS_RUNTIME_DIVERGENTES');
  must(version.annotations?.['workers/alias'] === FIXED.alias, 'ALIAS_DIVERGENTE');
  return true;
}

const quote = value => "'" + String(value).replace(/'/g, "''") + "'";

export function runWrangler(args, cwd, runner = spawnSync) {
  const command = "$OutputEncoding=[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); & npx.cmd " +
    ['--yes', 'wrangler@4.133.0', ...args].map(quote).join(' ') + '; exit $LASTEXITCODE';
  const result = runner('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], {
    cwd, shell: false, windowsHide: true, encoding: 'utf8', timeout: 180000,
    maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1', FORCE_COLOR: '0', CI: 'true' }
  });
  must(!result.error && result.status === 0, 'WRANGLER_FALHOU_OU_EXCEDEU_PRAZO');
  return result.stdout;
}

function writeJson(file, value) {
  const temp = file + '.tmp-' + randomUUID();
  const fd = fs.openSync(temp, 'wx', 0o600);
  try {
    fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n', 'utf8');
    fs.fsyncSync(fd);
  } finally { fs.closeSync(fd); }
  fs.renameSync(temp, file);
}

async function downloadRuntime(root) {
  for (const [file, expected] of Object.entries(SOURCE_BLOBS)) {
    const url = RAW_BASE + FIXED.sourceRef + '/' + file.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20000) });
    must(response.ok, 'FONTE_GITHUB_INDISPONIVEL');
    const bytes = Buffer.from(await response.arrayBuffer());
    must(bytes.length > 0 && bytes.length < 2 * 1024 * 1024, 'FONTE_GITHUB_TAMANHO_INVALIDO');
    must(gitBlobSha(bytes) === expected, 'FONTE_GITHUB_DIVERGENTE');
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }
  return path.join(root, 'worker', 'homologation-4d.js');
}

async function inspectMultipart(bytes, config) {
  must(Buffer.isBuffer(bytes) && bytes.length > 0 && bytes.length <= 20 * 1024 * 1024, 'MULTIPART_TAMANHO_INVALIDO');
  const firstEnd = bytes.indexOf('\r\n');
  must(firstEnd > 2 && firstEnd < 200, 'MULTIPART_SEM_BOUNDARY');
  const first = bytes.subarray(0, firstEnd).toString('ascii');
  must(/^--[A-Za-z0-9_-]+$/.test(first), 'MULTIPART_BOUNDARY_INVALIDO');
  let form;
  try {
    form = await new Response(bytes, { headers: {
      'Content-Type': 'multipart/form-data; boundary=' + first.slice(2)
    }}).formData();
  } catch { throw new SafeError('MULTIPART_NAO_RECONHECIDO'); }
  const moduleName = path.basename(config.main);
  must(form.has('metadata') && form.has(moduleName), 'MULTIPART_PARTES_FORA_DO_ESCOPO');
  const m = parseJson(form.get('metadata'));
  must(m.main_module === moduleName && moduleName === 'homologation-4d.js', 'MODULO_DIVERGENTE');
  must(Array.isArray(m.keep_bindings) && m.keep_bindings.length === 0, 'HERANCA_AMPLA_BLOQUEADA');
  must(canonical(m.annotations) === canonical({
    'workers/alias': FIXED.alias, 'workers/tag': UPLOAD_TAG, 'workers/message': UPLOAD_MESSAGE
  }), 'ANOTACOES_MULTIPART_DIVERGENTES');
  must(Array.isArray(m.bindings) && m.bindings.length === PUBLIC_NAMES.length + SECRET_NAMES.length + 1,
    'BINDINGS_MULTIPART_DIVERGENTES');
  const seen = new Set();
  for (const b of m.bindings) {
    must(b && typeof b.name === 'string' && !seen.has(b.name), 'BINDING_MULTIPART_DUPLICADO');
    seen.add(b.name);
    if (PUBLIC_NAMES.includes(b.name)) {
      must(b.type === 'plain_text' && b.text === config.vars[b.name], 'VARIAVEL_MULTIPART_DIVERGENTE');
    } else if (SECRET_NAMES.includes(b.name)) {
      must(b.type === 'inherit' && Object.keys(b).every(k => ['name', 'type'].includes(k)), 'SEGREDO_MULTIPART_NAO_RESTRITO');
    } else if (b.name === 'AUTH_DB') {
      must(b.type === 'd1' && b.id === config.d1_databases[0].database_id, 'D1_MULTIPART_DIVERGENTE');
    } else {
      throw new SafeError('BINDING_MULTIPART_FORA_DO_ESCOPO');
    }
  }
  return true;
}

async function confirmPrepare() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('');
    console.log('Será criada uma NOVA janela 4D por ' + FIXED.windowMinutes + ' minutos.');
    console.log('O preview será publicado com DOCUMENTS_DRIVE_WRITE_ENABLED=false.');
    console.log('Nenhum PDF será alterado nesta etapa.');
    console.log('Produção não será promovida nem modificada.');
    const answer = await rl.question('Para continuar, digite PREPARAR NOVA JANELA 4D: ');
    must(answer.trim() === 'PREPARAR NOVA JANELA 4D', 'CANCELADO_PELO_OPERADOR');
  } finally { rl.close(); }
}

async function httpCheck() {
  const response = await fetch(FIXED.origin + '/api/documents/access', {
    method: 'GET',
    redirect: 'manual',
    cache: 'no-store',
    credentials: 'omit',
    headers: { Accept: 'application/json', Origin: FIXED.pages },
    signal: AbortSignal.timeout(15000)
  });
  const release = String(response.headers.get('X-Central-Docs-Preview-Release') || '').toLowerCase();
  must(response.status === 401, 'BLOQUEIO_AUTENTICACAO_NAO_CONFIRMADO');
  must(release === FIXED.candidateRelease, 'RELEASE_SERVIDO_DIVERGENTE');
  must(response.headers.get('Access-Control-Allow-Origin') === FIXED.pages, 'CORS_PREVIEW_DIVERGENTE');
  return true;
}

export async function prepare() {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_WINDOWS_DO_OPERADOR');
  const base = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos4D');
  fs.mkdirSync(base, { recursive: true });
  const marker = path.join(base, 'preparar-v4-upload-tentado.json');
  const ledger = path.join(base, 'nova-janela-v4.json');
  const lockPath = path.join(base, 'preparar-v4.lock');
  must(!fs.existsSync(marker), 'UPLOAD_V4_JA_TENTADO_NAO_REPETIR');
  must(!fs.existsSync(lockPath), 'OUTRA_EXECUCAO_V4_ATIVA');

  let lock;
  try { lock = fs.openSync(lockPath, 'wx', 0o600); }
  catch { throw new SafeError('OUTRA_EXECUCAO_V4_ATIVA'); }

  const tempRoot = path.join(base, 'v4-' + randomUUID());
  fs.mkdirSync(tempRoot, { recursive: true });
  let controlId = '';
  let expiresAt = 0;
  let configPath = '';
  let controlCreated = false;
  let controlEnabled = false;

  try {
    console.log('1/7 Baixando runtime fixo e verificando integridade...');
    const entry = await downloadRuntime(tempRoot);

    const minimalPath = path.join(tempRoot, 'wrangler.readonly.json');
    writeJson(minimalPath, { name: FIXED.worker, account_id: FIXED.account, send_metrics: false });
    const queryMinimal = args => parseJson(runWrangler([...args, '--json', '--config', minimalPath], tempRoot));

    console.log('2/7 Reconfirmando produção e preview-base...');
    productionSnapshot(queryMinimal(['deployments', 'status']));
    const previewVersion = queryMinimal(['versions', 'view', FIXED.oldPreview]);
    const basePreview = inspectOldPreview(previewVersion);
    const productionVersion = queryMinimal(['versions', 'view', FIXED.productionVersion]);
    inspectProduction(productionVersion, basePreview);
    validateOldControl(parseJson(runWrangler([
      'd1', 'execute', 'AUTH_DB', '--remote', '--command', oldControlSql(),
      '--json', '--config', (() => {
        const p = path.join(tempRoot, 'wrangler.d1.json');
        writeJson(p, {
          name: FIXED.worker, account_id: FIXED.account, send_metrics: false,
          d1_databases: [{ binding: 'AUTH_DB', database_name: 'portal-regulacao-users', database_id: basePreview.db }]
        });
        return p;
      })()
    ], tempRoot)));

    await confirmPrepare();

    controlId = 'phase4d_' + randomUUID().replaceAll('-', '');
    expiresAt = Math.floor(Date.now() / 1000) + FIXED.windowMinutes * 60;
    const config = buildConfig(basePreview, entry, controlId);
    configPath = path.join(tempRoot, 'wrangler.preview-v4.json');
    writeJson(configPath, config);
    const query = args => parseJson(runWrangler([...args, '--json', '--config', configPath], tempRoot));

    console.log('3/7 Criando controle novo DESABILITADO...');
    query(['d1', 'execute', 'AUTH_DB', '--remote', '--command', createControlSql(controlId, expiresAt)]);
    controlCreated = true;
    validateNewControl(query(['d1', 'execute', 'AUTH_DB', '--remote', '--command', stateControlSql(controlId)]), expiresAt, 0);

    console.log('4/7 Gerando dry-run do preview com gate false...');
    const dryPath = path.join(tempRoot, 'preview-v4-dry.multipart');
    const flags = ['--preview-alias', FIXED.alias, '--tag', UPLOAD_TAG, '--message', UPLOAD_MESSAGE];
    runWrangler(['versions', 'upload', ...flags, '--dry-run', '--outfile', dryPath, '--config', configPath], tempRoot);
    await inspectMultipart(fs.readFileSync(dryPath), config);

    console.log('5/7 Reconfirmando produção e enviando SOMENTE versão preview...');
    productionSnapshot(queryMinimal(['deployments', 'status']));
    const beforeLatest = latestVersion(queryMinimal(['versions', 'list']));
    writeJson(marker, {
      revision: '4.0.0',
      attemptedAt: new Date().toISOString(),
      controlId,
      expiresAt,
      candidateRelease: FIXED.candidateRelease
    });
    const sentPath = path.join(tempRoot, 'preview-v4-enviado.multipart');
    const output = runWrangler(['versions', 'upload', ...flags, '--outfile', sentPath, '--config', configPath], tempRoot);
    const newVersionId = uploadedId(output);
    verifyUploadedAlias(output);
    verifyVersion(queryMinimal(['versions', 'view', newVersionId]), config, newVersionId);
    const after = queryMinimal(['versions', 'list']);
    const sorted = [...after].sort((a, b) => Date.parse(b.metadata.created_on) - Date.parse(a.metadata.created_on));
    must(sorted[0]?.id === newVersionId && sorted[1]?.id === beforeLatest, 'UPLOAD_CONCORRENTE_DETECTADO');

    console.log('6/7 Ativando somente o controle da janela; escrita continua false...');
    query(['d1', 'execute', 'AUTH_DB', '--remote', '--command', enableControlSql(controlId, expiresAt)]);
    validateNewControl(query(['d1', 'execute', 'AUTH_DB', '--remote', '--command', stateControlSql(controlId)]), expiresAt, 1);
    controlEnabled = true;

    console.log('7/7 Confirmando alias/release e barreira de autenticação...');
    await httpCheck();

    writeJson(ledger, {
      revision: '4.0.0',
      createdAt: new Date().toISOString(),
      controlId,
      expiresAt,
      previewVersionId: newVersionId,
      candidateRelease: FIXED.candidateRelease,
      writeGateEnabled: false,
      production: {
        deploymentId: FIXED.productionDeployment,
        versionId: FIXED.productionVersion,
        percentage: 100
      }
    });

    console.log('');
    console.log('NOVA_JANELA_4D_PREPARADA');
    console.log('previewVersion=' + newVersionId);
    console.log('controlId=' + controlId);
    console.log('expiresAt=' + new Date(expiresAt * 1000).toISOString());
    console.log('release=' + FIXED.candidateRelease);
    console.log('writeGate=false');
    console.log('production=' + FIXED.productionVersion + '/' + FIXED.productionDeployment + '/100');
    console.log('proxima_acao=VALIDAR_LOGIN_E_LEITURA_SEM_ESCRITA');
    console.log('Envie somente este bloco. Nao envie configuracoes, JSON bruto ou credenciais.');
  } catch (error) {
    if (controlCreated && controlId && configPath && fs.existsSync(configPath)) {
      try {
        runWrangler([
          'd1', 'execute', 'AUTH_DB', '--remote', '--command', disableControlSql(controlId),
          '--config', configPath
        ], tempRoot);
        controlEnabled = false;
      } catch {
        console.log('REVOGACAO_AUTOMATICA_NAO_CONFIRMADA');
      }
    }
    if (error instanceof SafeError) {
      console.log('');
      console.log('OPERACAO_INTERROMPIDA=' + error.message);
      if (fs.existsSync(marker)) console.log('NAO_REPETIR_SEM_CONFERIR_O_PREVIEW');
      return;
    }
    console.log('');
    console.log('OPERACAO_INTERROMPIDA=ERRO_NAO_CLASSIFICADO');
    if (fs.existsSync(marker)) console.log('NAO_REPETIR_SEM_CONFERIR_O_PREVIEW');
  } finally {
    try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch {}
    try { if (lock) fs.closeSync(lock); } catch {}
    try { fs.unlinkSync(lockPath); } catch {}
  }
}

export async function main() {
  must(process.argv.length === 3 && process.argv[2] === '--preparar', 'USAR_PREPARAR');
  must(Number(process.versions.node.split('.')[0]) >= 22, 'NODE_22_OU_SUPERIOR_NECESSARIO');
  await prepare();
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    console.log('');
    console.log('OPERACAO_INTERROMPIDA=' + (error instanceof SafeError ? error.message : 'ERRO_NAO_CLASSIFICADO'));
    process.exitCode = 1;
  });
}
