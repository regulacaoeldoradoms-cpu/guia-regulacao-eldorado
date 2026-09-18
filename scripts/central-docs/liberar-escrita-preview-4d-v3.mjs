/**
 * Central de Documentos 4D V3 — reconstruido do original conferido em 17/09/2026.
 * Nao e o V2 perdido. Liberar escrita SOMENTE na janela de teste existente.
 * Usa login OAuth normal do Wrangler. Nao le arquivos de credenciais.
 * Nao executa INSERT/UPDATE/DELETE no D1, nem promove deployment, nem grava PDF.
 * Alteracao remota autorizada: versions upload com gate true, mesmo wrapper e alias.
 * Requer confirmacao humana, janela ainda valida e producao exatamente inalterada.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { pathToFileURL } from 'node:url';

export const FIXED = Object.freeze({
  account: '467be828c364ccf084240c34bb609b42',
  worker: 'yellow-wave-d0a1guia-regulacao-ia',
  source: '2fee19e69e06ecd128be2b103354fc6c2fb4e431',
  preview: 'a17473ce-ad9a-480c-8e53-901f2fcc3c92',
  historicalProduction: '239cca88-9b19-400c-9cd1-82612f942ed0',
  production: 'f8848c45-0bfc-40d6-8508-92b33dea6f43',
  deployment: '83a620d7-82cc-47ae-9779-f7002f45482d',
  entryBlob: 'eb4fb65ddb7bf40866e17e2a7402f2fc5b84f47b',
  control: 'phase4d_d7275a73110548fc8fd26125a60d6a2b',
  previousControl: 'phase4d_c66178b3f7354dbe9583dc1fe6e377d0',
  deadline: '2026-09-17T20:10:01Z',
  alias: 'central-docs-phase4d',
  pages: 'https://codex-central-docs-drive-syn.portal-regulacao-central-staging.pages.dev',
  origin: 'https://central-docs-phase4d-yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev',
});
export const PUBLIC_NAMES = Object.freeze([
  'ALLOWED_ORIGINS', 'AUTH_DEVELOPER_USERNAMES', 'DOCUMENTS_DRIVE_WRITE_ENABLED',
  'DOCUMENTS_HOMOLOGATION_CONTROL_ID', 'DOCUMENTS_HOMOLOGATION_DIAGNOSTICS',
  'DOCUMENTS_HOMOLOGATION_ORIGIN', 'DOCUMENTS_HOMOLOGATION_RELEASE',
  'DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN', 'GOOGLE_DRIVE_OAUTH_CLIENT_ID',
  'GOOGLE_DRIVE_OAUTH_REDIRECT_URI',
]);
export const SECRET_NAMES = Object.freeze([
  'AUTH_RATE_LIMIT_SECRET', 'AUTH_SESSION_SECRET', 'AUTH_USERS_JSON',
  'DRIVE_TOKEN_ENCRYPTION_KEY', 'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET', 'POSTHOG_PROJECT_TOKEN',
]);
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
export class SafeError extends Error {}
const must = (ok, code) => { if (!ok) throw new SafeError(code); };
const strip = value => String(value).replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '');
export function parseJson(text) {
  try { return JSON.parse(strip(text).replace(/^\uFEFF/, '').trim()); }
  catch { throw new SafeError('RESPOSTA_JSON_NAO_RECONHECIDA'); }
}
export const REVISION = '3.0.0';
export const UPLOAD_MESSAGE = 'Central Docs 4D V3: teste restrito; prazo existente';
export const UPLOAD_TAG = 'central-docs-phase4d';
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const hash = value => createHash('sha256').update(value).digest('hex');
const keysAre = (value, names) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === names.length && names.every(n => Object.hasOwn(value, n));
export function deploymentMetadata(value) {
  must(value && UUID.test(value.id || ''), 'DEPLOYMENT_NAO_IDENTIFICADO');
  must(Array.isArray(value.versions) && value.versions.length > 0 && value.versions.length <= 10,
    'DISTRIBUICAO_DE_PRODUCAO_DIVERGENTE');
  must(value.versions.every(v => UUID.test(v?.version_id || '') && typeof v.percentage === 'number'
    && Number.isFinite(v.percentage) && v.percentage >= 0 && v.percentage <= 100),
    'METADADOS_DE_PRODUCAO_INVALIDOS');
  return { deploymentId: value.id, versions: value.versions.map(v => ({
    versionId: v.version_id, percentage: v.percentage,
  })) };
}
export function productionSnapshot(value) {
  const observed = deploymentMetadata(value);
  must(observed.versions.length === 1, 'DISTRIBUICAO_DE_PRODUCAO_DIVERGENTE');
  const v = observed.versions[0];
  must(v.versionId === FIXED.production && v.percentage === 100, 'VERSAO_DE_PRODUCAO_DIVERGENTE');
  must(observed.deploymentId === FIXED.deployment, 'DEPLOYMENT_DE_PRODUCAO_DIVERGENTE');
  return { deploymentId: observed.deploymentId, versionId: v.versionId, percentage: 100 };
}
export function validateHistoricalSnapshot(value) {
  must(value && UUID.test(value.deploymentId || '') && value.versionId === FIXED.historicalProduction
    && value.percentage === 100, 'HISTORICO_LOCAL_DIVERGENTE');
  return { deploymentId: value.deploymentId, versionId: value.versionId, percentage: 100 };
}
export function sameProduction(a, b) {
  must(a && b && a.deploymentId === b.deploymentId && a.versionId === b.versionId
    && a.percentage === b.percentage, 'PRODUCAO_MUDOU_PARE_AQUI');
}
export function inspectProductionDependencies(version, base) {
  must(version?.id === FIXED.production && Array.isArray(version?.resources?.bindings),
    'DEPENDENCIAS_DE_PRODUCAO_NAO_IDENTIFICADAS');
  const required = ['AUTH_DB', ...SECRET_NAMES, 'AUTH_DEVELOPER_USERNAMES',
    'GOOGLE_DRIVE_OAUTH_CLIENT_ID', 'GOOGLE_DRIVE_OAUTH_REDIRECT_URI'];
  const names = new Set(); const found = new Map();
  for (const b of version.resources.bindings) {
    must(b && typeof b.name === 'string' && !names.has(b.name), 'BINDING_DE_PRODUCAO_INVALIDO');
    names.add(b.name);
    // Nao copia recursos extras da producao nem le o valor de nenhum segredo.
    if (required.includes(b.name)) found.set(b.name, b);
  }
  must(required.every(n => found.has(n)), 'DEPENDENCIA_DE_PRODUCAO_AUSENTE');
  for (const n of SECRET_NAMES) must(found.get(n).type === 'secret_text', 'TIPO_DE_SEGREDO_DIVERGENTE');
  must(found.get('AUTH_DB').type === 'd1' && found.get('AUTH_DB').id === base.db, 'D1_DE_PRODUCAO_DIVERGENTE');
  for (const n of required.filter(n => n !== 'AUTH_DB' && !SECRET_NAMES.includes(n))) {
    const b = found.get(n);
    must(b.type === 'plain_text' && b.text === base.vars[n], 'DEPENDENCIA_PUBLICA_DIVERGENTE');
  }
  return { requiredSecretsPresent: SECRET_NAMES.length, databaseMatches: true, sharedPublicMatches: true };
}
export function inspectBindings(version) {
  must(Array.isArray(version?.resources?.bindings), 'BINDINGS_NAO_IDENTIFICADOS');
  const vars = {}; const secrets = []; const names = new Set(); let db = '';
  for (const b of version.resources.bindings) {
    must(b && typeof b.name === 'string' && !names.has(b.name), 'BINDING_DUPLICADO_OU_INVALIDO');
    names.add(b.name);
    if (b.type === 'plain_text' && PUBLIC_NAMES.includes(b.name)) {
      must(typeof b.text === 'string', 'VARIAVEL_PUBLICA_INVALIDA'); vars[b.name] = b.text;
    } else if (b.type === 'secret_text' && SECRET_NAMES.includes(b.name)) {
      // Somente o nome: nao copia nem registra valores de segredo.
      secrets.push(b.name);
    } else if (b.type === 'd1' && b.name === 'AUTH_DB' && UUID.test(b.id || '')) {
      db = b.id;
    } else { throw new SafeError('BINDING_FORA_DO_ESCOPO_REVISADO'); }
  }
  must(PUBLIC_NAMES.every(n => typeof vars[n] === 'string'), 'VARIAVEL_PUBLICA_AUSENTE');
  must(SECRET_NAMES.every(n => secrets.includes(n)), 'SEGREDO_NECESSARIO_AUSENTE');
  must(db, 'D1_AUSENTE');
  return { vars, secrets, db };
}
export function buildConfig(version, entry) {
  must(version?.id === FIXED.preview, 'PREVIEW_DESARMADO_DIVERGENTE');
  const { vars, db } = inspectBindings(version);
  must(vars.DOCUMENTS_DRIVE_WRITE_ENABLED === 'false', 'PREVIEW_BASE_NAO_ESTA_DESARMADO');
  must(vars.DOCUMENTS_HOMOLOGATION_CONTROL_ID === FIXED.control, 'CONTROLE_DIVERGENTE');
  must(vars.DOCUMENTS_HOMOLOGATION_RELEASE === FIXED.source, 'RELEASE_DIVERGENTE');
  must(vars.DOCUMENTS_HOMOLOGATION_ORIGIN === FIXED.pages
    && vars.DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN === FIXED.origin
    && vars.ALLOWED_ORIGINS === FIXED.pages, 'ORIGENS_DIVERGENTES');
  must(vars.DOCUMENTS_HOMOLOGATION_DIAGNOSTICS === 'true', 'DIAGNOSTICO_DIVERGENTE');
  const runtime = version.resources.script_runtime;
  must(runtime?.compatibility_date === '2026-08-25', 'RUNTIME_DIVERGENTE');
  const flags = runtime.compatibility_flags ?? [];
  must(Array.isArray(flags) && flags.every(f => typeof f === 'string'), 'FLAGS_RUNTIME_INVALIDAS');
  must(path.basename(entry) === 'homologation-4d.js', 'ENTRADA_NAO_E_HOMOLOGACAO');
  return {
    name: FIXED.worker, account_id: FIXED.account, main: entry.replace(/\\/g, '/'),
    compatibility_date: runtime.compatibility_date,
    ...(flags.length ? { compatibility_flags: flags } : {}), send_metrics: false,
    vars: { ...vars, DOCUMENTS_DRIVE_WRITE_ENABLED: 'true' },
    d1_databases: [{ binding: 'AUTH_DB', database_name: 'portal-regulacao-users', database_id: db }],
    secrets: { required: [...SECRET_NAMES] },
    // Wrangler normalmente herda TODOS os segredos. Sobrescrever apenas o payload do preview.
    unsafe: { metadata: { keep_bindings: [] } },
    dependencies_instrumentation: { enabled: false },
    upload_source_maps: false,
  };
}
export function verifyVersion(version, config) {
  must(UUID.test(version?.id || '') && ![FIXED.preview, FIXED.production].includes(version.id),
    'NOVA_VERSAO_INVALIDA');
  const observed = inspectBindings(version);
  must(observed.db === config.d1_databases[0].database_id, 'D1_DIVERGENTE');
  must(PUBLIC_NAMES.every(n => observed.vars[n] === config.vars[n]), 'FLAGS_NAO_CONFIRMADOS');
  must(version.resources.script_runtime?.compatibility_date === config.compatibility_date,
    'RUNTIME_NAO_CONFIRMADO');
  must(JSON.stringify(version.resources.script_runtime?.compatibility_flags ?? [])
    === JSON.stringify(config.compatibility_flags ?? []), 'FLAGS_RUNTIME_DIVERGENTES');
  must(version.annotations?.['workers/alias'] === FIXED.alias, 'ALIAS_DIVERGENTE');
}
export function requireLatest(versions, expectedId = FIXED.production, predecessor) {
  must(Array.isArray(versions) && versions.length > 0, 'LISTA_DE_VERSOES_INVALIDA');
  must(versions.every(v => UUID.test(v?.id || '') && Number.isFinite(Date.parse(v?.metadata?.created_on)))
    && new Set(versions.map(v => v.id)).size === versions.length, 'METADADOS_DE_VERSOES_INVALIDOS');
  const sorted = [...versions].sort((a, b) => Date.parse(b.metadata.created_on) - Date.parse(a.metadata.created_on));
  must(sorted[0].id === expectedId, 'OUTRA_VERSAO_FOI_ENVIADA_PARE_PARA_CONFERIR');
  must(sorted.length === 1 || Date.parse(sorted[0].metadata.created_on) !== Date.parse(sorted[1].metadata.created_on),
    'ORDEM_DE_VERSOES_AMBIGUA');
  if (predecessor) must(sorted.length >= 2 && sorted[1].id === predecessor, 'UPLOAD_CONCORRENTE_DETECTADO');
  return sorted.slice(0, 3).map(v => ({ id: v.id, createdOn: v.metadata.created_on }));
}
// O pacote real gerado pelo dry-run precisa cumprir este contrato antes da confirmacao.
export async function inspectMultipart(bytes, config) {
  must(Buffer.isBuffer(bytes) && bytes.length > 0 && bytes.length <= 20 * 1024 * 1024,
    'MULTIPART_TAMANHO_INVALIDO');
  const firstEnd = bytes.indexOf('\r\n');
  must(firstEnd > 2 && firstEnd < 200, 'MULTIPART_SEM_BOUNDARY');
  const first = bytes.subarray(0, firstEnd).toString('ascii');
  must(/^--[A-Za-z0-9_-]+$/.test(first), 'MULTIPART_BOUNDARY_INVALIDO');
  const tail = bytes.subarray(-first.length - 6).toString('ascii');
  must(tail.endsWith(first + '--') || tail.endsWith(first + '--\r\n'), 'MULTIPART_INCOMPLETO');
  let form;
  try { form = await new Response(bytes, { headers: {
    'Content-Type': 'multipart/form-data; boundary=' + first.slice(2),
  } }).formData(); } catch { throw new SafeError('MULTIPART_NAO_RECONHECIDO'); }
  const parts = [...form.entries()];
  const moduleName = path.basename(config.main);
  must(parts.length === 2 && new Set(parts.map(([n]) => n)).size === 2
    && form.has('metadata') && form.has(moduleName), 'MULTIPART_PARTES_FORA_DO_ESCOPO');
  must(typeof form.get('metadata') === 'string', 'METADATA_NAO_E_TEXTO');
  const m = parseJson(form.get('metadata'));
  const permitted = ['main_module', 'bindings', 'compatibility_date', 'compatibility_flags', 'keep_bindings', 'annotations'];
  must(m && !Array.isArray(m) && Object.keys(m).every(k => permitted.includes(k)), 'METADATA_FORA_DO_ESCOPO');
  must(m.main_module === moduleName && moduleName === 'homologation-4d.js', 'MODULO_DIVERGENTE');
  must(m.compatibility_date === config.compatibility_date
    && canonical(m.compatibility_flags ?? []) === canonical(config.compatibility_flags ?? []), 'RUNTIME_MULTIPART_DIVERGENTE');
  must(Array.isArray(m.keep_bindings) && m.keep_bindings.length === 0, 'HERANCA_AMPLA_BLOQUEADA');
  must(canonical(m.annotations) === canonical({
    'workers/alias': FIXED.alias, 'workers/tag': UPLOAD_TAG, 'workers/message': UPLOAD_MESSAGE,
  }), 'ANOTACOES_MULTIPART_DIVERGENTES');
  must(Array.isArray(m.bindings) && m.bindings.length === PUBLIC_NAMES.length + SECRET_NAMES.length + 1,
    'BINDINGS_MULTIPART_DIVERGENTES');
  const seen = new Set();
  for (const b of m.bindings) {
    must(b && typeof b.name === 'string' && !seen.has(b.name), 'BINDING_MULTIPART_DUPLICADO');
    seen.add(b.name);
    if (PUBLIC_NAMES.includes(b.name)) {
      must(keysAre(b, ['name', 'type', 'text']) && b.type === 'plain_text' && b.text === config.vars[b.name],
        'VARIAVEL_MULTIPART_DIVERGENTE');
    } else if (SECRET_NAMES.includes(b.name)) {
      must(keysAre(b, ['name', 'type']) && b.type === 'inherit', 'SEGREDO_MULTIPART_NAO_E_HERANCA_RESTRITA');
    } else if (b.name === 'AUTH_DB') {
      must(keysAre(b, ['name', 'type', 'id']) && b.type === 'd1'
        && b.id === config.d1_databases[0].database_id, 'D1_MULTIPART_DIVERGENTE');
    } else throw new SafeError('BINDING_MULTIPART_FORA_DO_ESCOPO');
  }
  const code = form.get(moduleName);
  must(code && typeof code !== 'string' && code.name === moduleName
    && code.type === 'application/javascript+module' && code.size > 0, 'MODULO_MULTIPART_INVALIDO');
  return { fingerprint: hash(canonical(m) + '\n' + hash(Buffer.from(await code.arrayBuffer()))),
    moduleBytes: code.size, publicBindings: PUBLIC_NAMES.length, inheritedSecrets: SECRET_NAMES.length };
}
export function validatePriorAttempt(previous) {
  must(previous && previous.uploadAttempted === false && previous.uploaded === false
    && previous.newPreviewVersionId === null && previous.configurationVerified === false,
    'ENVIO_JA_TENTADO_OU_ESTADO_INCERTO_NAO_REPETIR');
  must(previous.sourceCommit === FIXED.source && previous.basePreviewVersionId === FIXED.preview
    && previous.controlId === FIXED.control && previous.deadline === FIXED.deadline,
    'REGISTRO_DE_TENTATIVA_DIVERGENTE');
}
// Apenas valores de controle/contagens: nao retorna usuario ou fileId.
export const CONTROL_SQL = `SELECT n.enabled, n.expires_at,
  CAST(strftime('%s','now') AS INTEGER) AS now_epoch,
  CASE WHEN n.allowed_username = a.allowed_username
    AND n.allowed_file_ids_json = a.allowed_file_ids_json
    AND length(trim(n.allowed_username)) > 0 THEN 1 ELSE 0 END AS same_scope,
  CASE WHEN json_valid(n.allowed_file_ids_json) THEN
    CASE WHEN json_type(n.allowed_file_ids_json) = 'array'
      AND json_array_length(n.allowed_file_ids_json) = 1
      AND json_type(n.allowed_file_ids_json,'$[0]') = 'text'
      AND length(trim(json_extract(n.allowed_file_ids_json,'$[0]'))) > 0 THEN 1 ELSE 0 END
    ELSE 0 END AS one_file,
  (SELECT count(*) FROM document_drive_homologation_controls
    WHERE control_id <> '${FIXED.control}' AND enabled = 1
      AND expires_at > CAST(strftime('%s','now') AS INTEGER)) AS other_active_controls,
  (SELECT count(*) FROM document_drive_homologation_sessions
    WHERE control_id = '${FIXED.control}') AS upload_sessions
FROM document_drive_homologation_controls n
JOIN document_drive_homologation_controls a ON a.control_id = '${FIXED.previousControl}'
WHERE n.control_id = '${FIXED.control}';`;
export function validateWindow(value) {
  must(Array.isArray(value) && value.length === 1 && value[0]?.success === true
    && Array.isArray(value[0].results) && value[0].results.length === 1,
    'CONTROLE_D1_NAO_CONFIRMADO');
  const r = value[0].results[0];
  must(r.enabled === 1, 'JANELA_DESATIVADA');
  must(Number.isSafeInteger(r.expires_at) && r.expires_at === Date.parse(FIXED.deadline) / 1000,
    'PRAZO_DA_JANELA_FOI_ALTERADO');
  must(Number.isSafeInteger(r.now_epoch) && r.now_epoch > 0, 'RELOGIO_D1_INVALIDO');
  const remaining = r.expires_at - r.now_epoch;
  must(remaining >= 1200 && remaining <= 7200, 'JANELA_EXPIRADA_OU_COM_MENOS_DE_20_MINUTOS');
  must(r.same_scope === 1 && r.one_file === 1, 'ESCOPO_DA_JANELA_DIVERGENTE');
  must(r.other_active_controls === 0, 'OUTRA_JANELA_ATIVA');
  must(r.upload_sessions === 0, 'SESSOES_DE_UPLOAD_PENDENTES');
  return { expiresAt: r.expires_at, remainingSeconds: remaining, fileCount: 1 };
}
export function verifyUploadedAlias(text) {
  const m = [...strip(text).matchAll(/Version Preview Alias URL:\s*(https:\/\/[^\s]+)/g)];
  must(m.length === 1 && m[0][1] === FIXED.origin, 'URL_DO_ALIAS_NAO_CONFIRMADA');
}
export function uploadedId(text) {
  const m = [...strip(text).matchAll(/Worker Version ID:\s*([a-f0-9-]{36})\b/gi)];
  must(m.length === 1 && UUID.test(m[0][1]), 'ENVIO_SEM_ID_CONFIRMADO');
  must(![FIXED.preview, FIXED.production].includes(m[0][1]), 'ID_NOVO_DIVERGENTE');
  return m[0][1];
}
const quote = value => "'" + String(value).replace(/'/g, "''") + "'";
export function runWrangler(args, cwd, runner = spawnSync) {
  // Comandos usados: consultas GET/SELECT e versions upload, nunca deploy.
  const command = "$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false); & npx.cmd "
    + ['--yes', 'wrangler@4.133.0', ...args].map(quote).join(' ') + '; exit $LASTEXITCODE';
  const result = runner('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], {
    cwd, shell: false, windowsHide: true, encoding: 'utf8', timeout: 180000,
    maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1', FORCE_COLOR: '0', CI: 'true' },
  });
  must(!result.error && result.status === 0, 'WRANGLER_FALHOU_OU_EXCEDEU_PRAZO');
  return result.stdout;
}
// Arquivo novo + fsync + rename: nunca trunca o registro anterior no meio da escrita.
export function writeJson(file, data) {
  const temp = file + '.tmp-' + randomUUID();
  const fd = fs.openSync(temp, 'wx', 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(data, null, 2) + '\n', 'utf8'); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
  try { fs.renameSync(temp, file); } catch (error) { try { fs.unlinkSync(temp); } catch {} throw error; }
}
export function archivePriorAttempt(base, ledgerPath) {
  must(!fs.existsSync(path.join(base, 'envio-escrita-tentado-v3.json')), 'ENVIO_JA_TENTADO_NAO_REPETIR');
  if (!fs.existsSync(ledgerPath)) return;
  const bytes = fs.readFileSync(ledgerPath);
  validatePriorAttempt(parseJson(bytes));
  // O original permanece no lugar ate o primeiro save novo. Copia exata para auditoria local.
  const target = path.join(base, 'tentativa-escrita-anterior-' + randomUUID() + '.json');
  fs.copyFileSync(ledgerPath, target, fs.constants.COPYFILE_EXCL);
  must(hash(fs.readFileSync(target)) === hash(bytes), 'ARQUIVO_HISTORICO_NAO_CONFIRMADO');
}
export function markUploadAttempt(base, record) {
  const file = path.join(base, 'envio-escrita-tentado-v3.json');
  const fd = fs.openSync(file, 'wx', 0o600);
  try { fs.writeFileSync(fd, JSON.stringify({ revision: REVISION, sourceCommit: FIXED.source,
    uploadAttempted: true, startedAt: new Date().toISOString() }) + '\n'); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
  record.uploadAttempted = true;
}
function contained(base, candidate) {
  const realBase = fs.realpathSync(base); const resolved = fs.realpathSync(candidate);
  const rel = path.relative(realBase, resolved);
  must(rel && !rel.startsWith('..') && !path.isAbsolute(rel), 'CAMINHO_LOCAL_FORA_DO_PREPARO');
  return resolved;
}
export function readLocal() {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_O_MESMO_WINDOWS_DO_PREPARO');
  const base = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos4D');
  const record = parseJson(fs.readFileSync(path.join(base, 'ultimo-preview.json'), 'utf8'));
  must(record.sourceCommit === FIXED.source && record.newPreviewVersionId === FIXED.preview
    && record.newControlId === FIXED.control && record.uploaded === true
    && record.configurationVerified === true && record.productionUnchanged === true
    && record.driveWriteEnabled === false, 'REGISTRO_DO_PREVIEW_NAO_CORRESPONDE');
  const configPath = contained(base, record.configPath);
  const config = parseJson(fs.readFileSync(configPath, 'utf8'));
  must(config.name === FIXED.worker && config.account_id === FIXED.account
    && config.vars?.DOCUMENTS_HOMOLOGATION_CONTROL_ID === FIXED.control
    && config.vars?.DOCUMENTS_DRIVE_WRITE_ENABLED === 'false', 'CONFIGURACAO_LOCAL_DIVERGENTE');
  const source = contained(base, record.sourceDirectory);
  const entry = contained(source, path.join(source, 'worker', 'homologation-4d.js'));
  must(fs.statSync(entry).isFile() && path.resolve(config.main) === entry, 'ENTRADA_LOCAL_DIVERGENTE');
  validateHistoricalSnapshot(record.productionBefore);
  const code = fs.readFileSync(entry);
  const blob = createHash('sha1').update('blob ' + code.length + '\0').update(code).digest('hex');
  must(blob === FIXED.entryBlob, 'WRAPPER_LOCAL_NAO_CORRESPONDE_AO_COMMIT');
  return { base, entry, config, productionBefore: record.productionBefore };
}
async function confirm() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('\nUma nova versao do PREVIEW tera escrita true. Nao sera promovida a producao.');
    console.log('Mesmo controle, mesma conta e um PDF descartavel; o prazo NAO sera ampliado.');
    console.log('Depois, editar esse PDF na pagina de homologacao podera salva-lo automaticamente.');
    console.log('Mantenha a aba de teste sem edicoes pendentes durante esta operacao.');
    const answer = await rl.question('Para autorizar, digite LIBERAR TESTE: ');
    must(answer.trim() === 'LIBERAR TESTE', 'CANCELADO_PELO_OPERADOR');
  } finally { rl.close(); }
}
/** Fluxo testavel: mocks substituem exclusivamente transporte, confirmacao e I/O de preparo. */
export async function executeRelease({ local, configPath, query, wrangler, save,
  confirmHuman, markAttempt, inspectPayload, sourceFingerprint, log = console.log }) {
  const record = {
    procedureRevision: REVISION, sourceCommit: FIXED.source, basePreviewVersionId: FIXED.preview,
    controlId: FIXED.control, deadline: FIXED.deadline, configPath,
    uploadAttempted: false, uploaded: false, configurationVerified: false,
    newPreviewVersionId: null, productionUnchanged: false,
    controlDataModified: false, pdfAccessedByScript: false, homologationApproved: false,
  };
  let step = 'CONFERIR_PREVIEW_E_PRODUCAO'; let before;
  const persist = () => save(record);
  const windowRead = () => validateWindow(query(['d1', 'execute', 'AUTH_DB', '--remote', '--command', CONTROL_SQL]));
  const productionRead = () => {
    const raw = query(['deployments', 'status']);
    record.observedProduction = deploymentMetadata(raw); // Apenas UUIDs e percentuais.
    return productionSnapshot(raw);
  };
  try {
    log('1/6 Conferindo historico, preview desarmado e producao...');
    record.historicalProduction = validateHistoricalSnapshot(local.productionBefore);
    before = productionRead(); record.productionBefore = before;
    requireLatest(query(['versions', 'list']));
    const baseVersion = query(['versions', 'view', FIXED.preview]);
    const config = buildConfig(baseVersion, local.entry);
    const baseBindings = inspectBindings(baseVersion);
    must(baseBindings.db === local.config.d1_databases?.[0]?.database_id, 'D1_LOCAL_DIVERGENTE');
    record.dependencies = inspectProductionDependencies(query(['versions', 'view', FIXED.production]), baseBindings);
    writeJson(configPath, config); persist();
    const configDigest = hash(fs.readFileSync(configPath));
    const sourceDigest = sourceFingerprint();
    const verifyFiles = () => {
      must(hash(fs.readFileSync(configPath)) === configDigest, 'CONFIGURACAO_MUDOU_DURANTE_OPERACAO');
      must(sourceFingerprint() === sourceDigest, 'CODIGO_LOCAL_MUDOU_DURANTE_OPERACAO');
    };

    step = 'CONFERIR_CONTROLE_D1';
    log('2/6 Consultando apenas prazo, escopo e contagens...');
    let window = windowRead(); record.expiresAt = window.expiresAt; persist();
    log('Janela valida; um PDF; ' + Math.floor(window.remainingSeconds / 60) + ' minutos restantes.');

    step = 'CONFERIR_MULTIPART';
    log('3/6 Compilando e verificando o pacote real, ainda sem enviar...');
    const flags = ['--preview-alias', FIXED.alias, '--tag', UPLOAD_TAG, '--message', UPLOAD_MESSAGE,
      '--experimental-provision=false', '--experimental-auto-create=false'];
    const payloadPath = path.join(path.dirname(configPath), 'preview-dry-run.multipart');
    const dryRun = async () => {
      verifyFiles();
      wrangler(['versions', 'upload', ...flags, '--dry-run', '--outfile', payloadPath]);
      verifyFiles();
      return inspectPayload(payloadPath, config);
    };
    const firstPayload = await dryRun(); record.payload = firstPayload; persist();

    step = 'CONFIRMACAO_HUMANA';
    log('4/6 Pacote conferido: dez variaveis, AUTH_DB e seis segredos por nome, sem valores.');
    await confirmHuman();

    step = 'REVALIDAR_ANTES_DO_ENVIO';
    // Recompila com os MESMOS argumentos e compara conteudo, sem comparar boundary aleatorio.
    const secondPayload = await dryRun();
    must(firstPayload.fingerprint === secondPayload.fingerprint, 'PACOTE_MUDOU_APOS_CONFIRMACAO');
    sameProduction(before, productionRead());
    requireLatest(query(['versions', 'list']));
    inspectProductionDependencies(query(['versions', 'view', FIXED.production]), baseBindings);
    window = windowRead(); verifyFiles();
    // Marcador persistente vem ANTES do subprocesso; timeout/falha bloqueia reenvio automatico.
    markAttempt(record); persist();

    step = 'ENVIAR_VERSAO_SOMENTE_PREVIEW';
    log('5/6 Enviando somente uma versao do preview; sem promover deployment...');
    const sentPath = path.join(path.dirname(configPath), 'preview-enviado.multipart');
    const output = wrangler(['versions', 'upload', ...flags, '--outfile', sentPath]);
    const id = uploadedId(output); record.newPreviewVersionId = id; record.uploaded = true; persist();
    verifyUploadedAlias(output);
    const actual = await inspectPayload(sentPath, config);
    must(actual.fingerprint === firstPayload.fingerprint, 'PACOTE_ENVIADO_DIVERGENTE');
    verifyFiles();

    step = 'VERIFICAR_ENVIO_E_PRODUCAO';
    log('6/6 Conferindo nova versao, predecessor, prazo e producao...');
    verifyVersion(query(['versions', 'view', id]), config);
    record.configurationVerified = true; persist();
    requireLatest(query(['versions', 'list']), id, FIXED.production);
    const after = productionRead(); sameProduction(before, after);
    record.productionAfter = after; record.productionUnchanged = true;
    windowRead(); record.finishedAt = new Date().toISOString(); persist();
    return { ok: true, record };
  } catch (error) {
    record.failedAtStep = step;
    record.errorCode = error instanceof SafeError ? error.message : 'ERRO_LOCAL_NAO_DETALHADO';
    if (record.uploadAttempted && before) {
      try { const after = productionRead(); sameProduction(before, after);
        record.productionAfter = after; record.productionUnchanged = true;
      } catch { record.productionUnchanged = false; }
    }
    try { persist(); } catch {}
    return { ok: false, record };
  }
}
export function fingerprintSource(entry) {
  // Nao abre .env, .dev.vars, credenciais ou documentos: somente fontes .js/.mjs e package.json do worker.
  const root = path.dirname(entry); const files = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name.startsWith('.') || ['node_modules', 'tests', 'migrations'].includes(item.name)) continue;
      const full = path.join(dir, item.name);
      must(!item.isSymbolicLink(), 'LINK_LOCAL_NAO_PERMITIDO');
      if (item.isDirectory()) walk(full);
      else if (item.isFile() && (/\.m?js$/.test(item.name) || item.name === 'package.json')) {
        files.push([path.relative(root, full).replace(/\\/g, '/'), hash(fs.readFileSync(full))]);
      }
    }
  }
  walk(root); return hash(canonical(files.sort((a, b) => a[0].localeCompare(b[0]))));
}
export function reportOutcome(outcome, log = console.log) {
  const r = outcome.record;
  log(outcome.ok ? '\nPREVIEW_COM_ESCRITA_LIBERADA' : '\nOPERACAO_INTERROMPIDA');
  log('Procedimento: V' + REVISION);
  if (!outcome.ok) { log('Etapa: ' + r.failedAtStep); log('Codigo: ' + r.errorCode); }
  log('Envio tentado: ' + r.uploadAttempted);
  if (r.newPreviewVersionId) log('Versao nova: ' + r.newPreviewVersionId);
  if (r.observedProduction) log('Producao observada (metadados): ' + JSON.stringify(r.observedProduction));
  log('Producao reconfirmada e inalterada: ' + r.productionUnchanged);
  log('Vencimento original: ' + FIXED.deadline + ' (16:10:01 de 17/09 em Eldorado/MS).');
  if (outcome.ok) {
    log('Escrita: true, SOMENTE no preview restrito. Fase 4D NAO aprovada.');
    log('Recarregue a homologacao e envie este resultado antes da primeira edicao.');
    log('Ao encerrar: aguardar operacoes, revogar controle no D1 e desligar gate do preview.');
  } else if (r.uploadAttempted) {
    log('O envio foi tentado; pode existir preview com escrita true. NAO repita e NAO edite o PDF.');
    log('Inspecionar a versao e revogar o controle antes de nova tentativa.');
  } else log('Nenhum comando de envio real foi iniciado. Nao troque UUIDs nem amplie o prazo.');
  log('O script nao acessa PDF nem altera linhas do D1. Compartilhe somente este bloco final.');
}
export function priorAttemptSummary(base) {
  const file = path.join(base, 'ultimo-preview-escrita.json');
  const result = { recordExists: fs.existsSync(file), uploadAttempted: null,
    uploaded: null, newVersionId: null,
    v3MarkerExists: fs.existsSync(path.join(base, 'envio-escrita-tentado-v3.json')),
    lockFileDetected: fs.readdirSync(base).some(n => /(?:\.lock$|^lock$|trava)/i.test(n)),
  };
  if (result.recordExists) {
    try { const p = parseJson(fs.readFileSync(file, 'utf8'));
      result.uploadAttempted = typeof p.uploadAttempted === 'boolean' ? p.uploadAttempted : null;
      result.uploaded = typeof p.uploaded === 'boolean' ? p.uploaded : null;
      result.newVersionId = UUID.test(p.newPreviewVersionId || '') ? p.newPreviewVersionId : null;
    } catch { /* Indeterminado e deliberadamente diferente de false. */ }
  }
  return result;
}
/** Somente GET/SELECT; nao altera ledger, locks ou controle, nao compila nem faz upload. */
export function verifyOnly({ local, query }) {
  const result = { procedure: REVISION, readOnly: true, uploadAttemptedByThisRun: false,
    priorAttempt: priorAttemptSummary(local.base), errors: [] };
  const attempt = (step, fn) => {
    try { fn(); } catch (e) { result.errors.push({ step,
      code: e instanceof SafeError ? e.message : 'CONSULTA_NAO_CONFIRMADA' }); }
  };
  attempt('PRODUCAO', () => {
    const raw = query(['deployments', 'status']);
    result.production = deploymentMetadata(raw);
    try { productionSnapshot(raw); result.matchesReviewedProduction = true; }
    catch { result.matchesReviewedProduction = false; }
  });
  attempt('VERSOES', () => {
    const values = query(['versions', 'list']);
    must(Array.isArray(values) && values.length > 0, 'LISTA_DE_VERSOES_INVALIDA');
    must(values.every(v => UUID.test(v?.id || '') && Number.isFinite(Date.parse(v?.metadata?.created_on))),
      'METADADOS_DE_VERSOES_INVALIDOS');
    result.latestVersions = [...values].sort((a,b) => Date.parse(b.metadata.created_on)-Date.parse(a.metadata.created_on))
      .slice(0,3).map(v => ({ id: v.id, createdOn: new Date(v.metadata.created_on).toISOString() }));
  });
  attempt('PREVIEW_BASE', () => {
    const version = query(['versions', 'view', FIXED.preview]);
    buildConfig(version, local.entry);
    must(inspectBindings(version).db === local.config.d1_databases?.[0]?.database_id, 'D1_LOCAL_DIVERGENTE');
    result.basePreviewMatches = true;
  });
  attempt('JANELA_D1', () => {
    const raw = query(['d1', 'execute', 'AUTH_DB', '--remote', '--command', CONTROL_SQL]);
    must(Array.isArray(raw) && raw.length===1 && raw[0]?.success===true && raw[0]?.results?.length===1,
      'CONTROLE_D1_NAO_CONFIRMADO');
    const r = raw[0].results[0];
    const integer = key => Number.isSafeInteger(r[key]) ? r[key] : null;
    result.window = Object.fromEntries(['enabled','expires_at','now_epoch','same_scope','one_file',
      'other_active_controls','upload_sessions'].map(k => [k,integer(k)]));
    // Colunas selecionadas sao somente numeros/flags. Nenhuma identidade e projetada.
    try { validateWindow(raw); result.windowPasses = true; }
    catch(e) { result.windowPasses = false; result.windowCode = e instanceof SafeError ? e.message : 'CONTROLE_D1_NAO_CONFIRMADO'; }
  });
  attempt('PRODUCAO_FINAL', () => {
    const again = deploymentMetadata(query(['deployments','status']));
    result.productionStableDuringRead = canonical(again) === canonical(result.production);
  });
  // Segunda leitura detecta tentativa iniciada enquanto as consultas remotas estavam em andamento.
  result.priorAttemptAfterRead = priorAttemptSummary(local.base);
  return result;
}
async function runVerification() {
  const local = readLocal();
  const directory = path.join(local.base, 'verificacao-v3-' + randomUUID()); fs.mkdirSync(directory);
  const configPath = path.join(directory, 'wrangler.somente-leitura.json');
  must(local.config.d1_databases?.length === 1 && local.config.d1_databases[0].binding === 'AUTH_DB'
    && UUID.test(local.config.d1_databases[0].database_id || ''), 'D1_LOCAL_DIVERGENTE');
  writeJson(configPath, { name: FIXED.worker, account_id: FIXED.account, send_metrics: false,
    d1_databases: [{ binding:'AUTH_DB', database_name:'portal-regulacao-users',
      database_id:local.config.d1_databases[0].database_id }] });
  const query = args => parseJson(runWrangler([...args, '--json', '--config', configPath], directory));
  const result = verifyOnly({ local, query });
  console.log('\nVERIFICACAO_SOMENTE_LEITURA');
  console.log(JSON.stringify(result, null, 2));
  console.log('Nenhuma escrita foi habilitada. Nao execute liberacao em paralelo com V2-R1 ou outro procedimento.');
  console.log('Envie somente este bloco. Nao envie configuracoes, ledger completo nem credenciais.');
  if (result.errors.length) process.exitCode = 1;
}
export async function main() {
  must(process.argv.length === 3 && ['--verificar', '--liberar-teste'].includes(process.argv[2]), 'USAR_VERIFICAR_OU_LIBERAR_TESTE');
  must(Number(process.versions.node.split('.')[0]) >= 22, 'NODE_22_OU_SUPERIOR_NECESSARIO');
  if (process.argv[2] === '--verificar') return runVerification();
  const local = readLocal();
  must(!priorAttemptSummary(local.base).lockFileDetected, 'OUTRA_EXECUCAO_OU_LOCK_PENDENTE_NAO_REPETIR');
  const lockPath = path.join(local.base, 'liberacao-escrita-v3.lock');
  let lock;
  try { lock = fs.openSync(lockPath, 'wx', 0o600); }
  catch { throw new SafeError('OUTRA_EXECUCAO_OU_LOCK_PENDENTE_NAO_REPETIR'); }
  try {
    const ledgerPath = path.join(local.base, 'ultimo-preview-escrita.json');
    archivePriorAttempt(local.base, ledgerPath);
    const directory = path.join(local.base, 'liberacao-v3-' + randomUUID()); fs.mkdirSync(directory);
    const configPath = path.join(directory, 'wrangler.preview-escrita.json');
    writeJson(configPath, { name: FIXED.worker, account_id: FIXED.account, send_metrics: false });
    const wrangler = args => runWrangler([...args, '--config', configPath], directory);
    const query = args => parseJson(wrangler([...args, '--json']));
    const outcome = await executeRelease({ local, configPath, wrangler, query,
      save: r => writeJson(ledgerPath, r), confirmHuman: confirm,
      markAttempt: r => {
        validatePriorAttempt(parseJson(fs.readFileSync(ledgerPath, 'utf8')));
        markUploadAttempt(local.base, r);
      },
      inspectPayload: (file, config) => inspectMultipart(fs.readFileSync(file), config),
      sourceFingerprint: () => fingerprintSource(local.entry),
    });
    reportOutcome(outcome); if (!outcome.ok) process.exitCode = 1;
  } finally { fs.closeSync(lock); fs.unlinkSync(lockPath); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    console.error('LIBERACAO_NAO_CONCLUIDA');
    console.error(error instanceof SafeError ? error.message : 'REGISTRO_LOCAL_OU_IO_NAO_CONFIRMADO');
    console.error('Nao repita se houver tentativa anterior. Nao execute deploy ou comandos de segredo.');
    console.error('Envie somente estas linhas e eventual bloco OPERACAO_INTERROMPIDA anterior.');
    process.exitCode = 1;
  });
}
