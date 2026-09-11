'use strict';

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
const OAUTH_STATE_TTL_SECONDS = 10 * 60;
const FILE_REF_TTL_SECONDS = 12 * 60 * 60;
const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';
const DRIVE_SHORTCUT_MIME = 'application/vnd.google-apps.shortcut';
const PDF_MIME = 'application/pdf';
const TOKEN_ROW_ID = 'institutional';
const tokenSchemaReady = new WeakSet();
const tokenSchemaPromises = new WeakMap();

let cachedAccessToken = {
  token: '',
  expiresAt: 0
};

function utf8(value) {
  return new TextEncoder().encode(String(value || ''));
}

function base64UrlBytes(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function bytesFromBase64Url(value) {
  const clean = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = clean + '='.repeat((4 - (clean.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function base64UrlJson(value) {
  return base64UrlBytes(utf8(JSON.stringify(value)));
}

function jsonFromBase64Url(value) {
  return JSON.parse(new TextDecoder().decode(bytesFromBase64Url(value)));
}

function randomToken(bytes = 24) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return base64UrlBytes(data);
}

function clampInteger(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

function normalizeUsername(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 40);
}

function safeName(value) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 300);
}

function safeMime(value) {
  return String(value || 'application/octet-stream').slice(0, 160);
}

function escapeDriveQueryLiteral(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export class DriveIntegrationError extends Error {
  constructor(code, message, status = 500) {
    super(message);
    this.name = 'DriveIntegrationError';
    this.code = code;
    this.status = status;
  }
}

export function driveOAuthConfiguration(env) {
  const clientId = String(env.GOOGLE_DRIVE_OAUTH_CLIENT_ID || '').trim();
  const clientSecret = String(env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET || '').trim();
  const redirectUri = String(env.GOOGLE_DRIVE_OAUTH_REDIRECT_URI || '').trim();
  const encryptionKey = String(env.DRIVE_TOKEN_ENCRYPTION_KEY || '').trim();
  return Object.freeze({
    clientId: Boolean(clientId),
    clientSecret: Boolean(clientSecret),
    redirectUri: Boolean(redirectUri),
    encryptionKey: Boolean(encryptionKey),
    ready: Boolean(clientId && clientSecret && redirectUri && encryptionKey)
  });
}

function requireOAuthConfig(env) {
  const clientId = String(env.GOOGLE_DRIVE_OAUTH_CLIENT_ID || '').trim();
  const clientSecret = String(env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET || '').trim();
  const redirectUri = String(env.GOOGLE_DRIVE_OAUTH_REDIRECT_URI || '').trim();
  const encryptionSecret = String(env.DRIVE_TOKEN_ENCRYPTION_KEY || '').trim();
  if (!clientId || !clientSecret || !redirectUri || !encryptionSecret) {
    throw new DriveIntegrationError(
      'DRIVE_OAUTH_NOT_CONFIGURED',
      'A integração Google Drive ainda não foi configurada no ambiente.',
      503
    );
  }
  return { clientId, clientSecret, redirectUri, encryptionSecret };
}

export async function ensureDriveOAuthSchema(env) {
  const binding = env.AUTH_DB;
  if (!binding) return false;
  if (tokenSchemaReady.has(binding)) return true;
  if (tokenSchemaPromises.has(binding)) return tokenSchemaPromises.get(binding);

  const operation = (async () => {
    await binding.prepare(`CREATE TABLE IF NOT EXISTS document_drive_oauth (
      connection_id TEXT PRIMARY KEY,
      refresh_token_cipher TEXT NOT NULL,
      refresh_token_iv TEXT NOT NULL,
      scope TEXT NOT NULL DEFAULT '',
      connected_by TEXT,
      connected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();
    await binding.prepare(`CREATE TABLE IF NOT EXISTS document_drive_oauth_states (
      nonce TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();
    await binding.prepare('CREATE INDEX IF NOT EXISTS idx_document_drive_oauth_states_exp ON document_drive_oauth_states(expires_at)').run();
    tokenSchemaReady.add(binding);
    return true;
  })().catch((error) => {
    tokenSchemaReady.delete(binding);
    throw error;
  }).finally(() => {
    tokenSchemaPromises.delete(binding);
  });

  tokenSchemaPromises.set(binding, operation);
  return operation;
}

async function deriveAesKey(secret, label) {
  const digest = await crypto.subtle.digest('SHA-256', utf8(`${label}\u0000${secret}`));
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function encryptText(secret, label, plaintext) {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const key = await deriveAesKey(secret, label);
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: utf8(label) },
    key,
    utf8(plaintext)
  );
  return {
    cipher: base64UrlBytes(new Uint8Array(cipher)),
    iv: base64UrlBytes(iv)
  };
}

async function decryptText(secret, label, cipherText, ivText) {
  try {
    const key = await deriveAesKey(secret, label);
    const clear = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: bytesFromBase64Url(ivText), additionalData: utf8(label) },
      key,
      bytesFromBase64Url(cipherText)
    );
    return new TextDecoder().decode(clear);
  } catch (_) {
    throw new DriveIntegrationError('DRIVE_TOKEN_DECRYPT_FAILED', 'Não foi possível abrir a credencial do Google Drive.', 503);
  }
}

async function stateHmacKey(env) {
  const secret = String(env.AUTH_SESSION_SECRET || '').trim();
  if (!secret) {
    throw new DriveIntegrationError('DRIVE_STATE_SECRET_MISSING', 'Segredo de sessão indisponível para iniciar o OAuth.', 503);
  }
  return crypto.subtle.importKey('raw', utf8(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function signState(env, payload) {
  const body = base64UrlJson(payload);
  const key = await stateHmacKey(env);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, utf8(`central-documents.${body}`)));
  return `${body}.${base64UrlBytes(signature)}`;
}

async function verifyState(env, value) {
  const parts = String(value || '').split('.');
  if (parts.length !== 2) {
    throw new DriveIntegrationError('DRIVE_OAUTH_STATE_INVALID', 'Estado OAuth inválido.', 400);
  }
  try {
    const key = await stateHmacKey(env);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      bytesFromBase64Url(parts[1]),
      utf8(`central-documents.${parts[0]}`)
    );
    if (!valid) throw new Error('invalid');
    const payload = jsonFromBase64Url(parts[0]);
    if (!payload?.nonce || !payload?.sub || Number(payload.exp || 0) < nowSeconds()) throw new Error('expired');
    return payload;
  } catch (error) {
    if (error instanceof DriveIntegrationError) throw error;
    throw new DriveIntegrationError('DRIVE_OAUTH_STATE_INVALID', 'Estado OAuth inválido ou expirado.', 400);
  }
}

async function oauthRow(env) {
  if (!(await ensureDriveOAuthSchema(env))) return null;
  return env.AUTH_DB.prepare(`SELECT refresh_token_cipher, refresh_token_iv, scope, connected_by, connected_at, updated_at
    FROM document_drive_oauth WHERE connection_id = ?`).bind(TOKEN_ROW_ID).first();
}

async function refreshToken(env) {
  const config = requireOAuthConfig(env);
  const row = await oauthRow(env);
  if (!row?.refresh_token_cipher || !row?.refresh_token_iv) {
    throw new DriveIntegrationError('DRIVE_NOT_CONNECTED', 'A conta institucional do Google Drive ainda não foi conectada.', 409);
  }
  return decryptText(
    config.encryptionSecret,
    'central-documents-refresh-token-v1',
    row.refresh_token_cipher,
    row.refresh_token_iv
  );
}

async function storeRefreshToken(env, token, scope, actor) {
  const config = requireOAuthConfig(env);
  if (!(await ensureDriveOAuthSchema(env))) {
    throw new DriveIntegrationError('DRIVE_DB_UNAVAILABLE', 'Banco técnico indisponível para concluir a conexão.', 503);
  }
  const encrypted = await encryptText(config.encryptionSecret, 'central-documents-refresh-token-v1', token);
  await env.AUTH_DB.prepare(`INSERT INTO document_drive_oauth(
      connection_id, refresh_token_cipher, refresh_token_iv, scope, connected_by
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(connection_id) DO UPDATE SET
      refresh_token_cipher = excluded.refresh_token_cipher,
      refresh_token_iv = excluded.refresh_token_iv,
      scope = excluded.scope,
      connected_by = excluded.connected_by,
      updated_at = CURRENT_TIMESTAMP`)
    .bind(TOKEN_ROW_ID, encrypted.cipher, encrypted.iv, String(scope || DRIVE_SCOPE).slice(0, 1000), normalizeUsername(actor) || null)
    .run();
  cachedAccessToken = { token: '', expiresAt: 0 };
}

export async function createDriveAuthorizationUrl(env, username) {
  const config = requireOAuthConfig(env);
  if (!(await ensureDriveOAuthSchema(env))) {
    throw new DriveIntegrationError('DRIVE_DB_UNAVAILABLE', 'Banco técnico indisponível para iniciar a conexão.', 503);
  }

  const actor = normalizeUsername(username);
  if (!actor) throw new DriveIntegrationError('DRIVE_OAUTH_ACTOR_INVALID', 'Usuário inválido para iniciar a conexão.', 400);

  const nonce = randomToken(24);
  const exp = nowSeconds() + OAUTH_STATE_TTL_SECONDS;
  await env.AUTH_DB.prepare('DELETE FROM document_drive_oauth_states WHERE expires_at < ?').bind(nowSeconds()).run();
  await env.AUTH_DB.prepare(`INSERT INTO document_drive_oauth_states(nonce, username, expires_at)
    VALUES (?, ?, ?)`).bind(nonce, actor, exp).run();

  const state = await signState(env, { sub: actor, nonce, exp });
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('redirect_uri', config.redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', DRIVE_SCOPE);
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('include_granted_scopes', 'true');
  url.searchParams.set('state', state);
  return url.toString();
}

async function exchangeAuthorizationCode(env, code) {
  const config = requireOAuthConfig(env);
  const body = new URLSearchParams({
    code: String(code || ''),
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code'
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!response.ok) {
    throw new DriveIntegrationError('DRIVE_OAUTH_EXCHANGE_FAILED', 'O Google não concluiu a autorização do Drive.', 502);
  }
  const payload = await response.json().catch(() => ({}));
  if (!payload?.access_token) {
    throw new DriveIntegrationError('DRIVE_OAUTH_EXCHANGE_FAILED', 'Resposta OAuth inválida do Google.', 502);
  }
  return payload;
}

export async function completeDriveOAuth(env, code, state) {
  if (!(await ensureDriveOAuthSchema(env))) {
    throw new DriveIntegrationError('DRIVE_DB_UNAVAILABLE', 'Banco técnico indisponível para concluir a conexão.', 503);
  }

  const payload = await verifyState(env, state);
  const storedState = await env.AUTH_DB.prepare(`SELECT username, expires_at FROM document_drive_oauth_states
    WHERE nonce = ?`).bind(String(payload.nonce)).first();
  if (!storedState
    || normalizeUsername(storedState.username) !== normalizeUsername(payload.sub)
    || Number(storedState.expires_at || 0) < nowSeconds()) {
    throw new DriveIntegrationError('DRIVE_OAUTH_STATE_INVALID', 'Esta autorização não é mais válida.', 400);
  }

  const tokenPayload = await exchangeAuthorizationCode(env, code);
  const current = await oauthRow(env);
  let refresh = String(tokenPayload.refresh_token || '').trim();

  if (!refresh && current?.refresh_token_cipher && current?.refresh_token_iv) {
    const config = requireOAuthConfig(env);
    refresh = await decryptText(
      config.encryptionSecret,
      'central-documents-refresh-token-v1',
      current.refresh_token_cipher,
      current.refresh_token_iv
    );
  }

  if (!refresh) {
    throw new DriveIntegrationError(
      'DRIVE_REFRESH_TOKEN_MISSING',
      'O Google não forneceu uma credencial offline. Revogue o acesso anterior e autorize novamente.',
      409
    );
  }

  await storeRefreshToken(env, refresh, tokenPayload.scope || DRIVE_SCOPE, payload.sub);
  await env.AUTH_DB.prepare('DELETE FROM document_drive_oauth_states WHERE nonce = ?').bind(String(payload.nonce)).run();

  cachedAccessToken = {
    token: String(tokenPayload.access_token || ''),
    expiresAt: Date.now() + Math.max(60, Number(tokenPayload.expires_in || 3600) - 90) * 1000
  };

  return { connected: true };
}

async function refreshAccessToken(env, force = false) {
  if (!force && cachedAccessToken.token && cachedAccessToken.expiresAt > Date.now() + 30_000) {
    return cachedAccessToken.token;
  }

  const config = requireOAuthConfig(env);
  const refresh = await refreshToken(env);
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refresh,
    grant_type: 'refresh_token'
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!response.ok) {
    cachedAccessToken = { token: '', expiresAt: 0 };
    throw new DriveIntegrationError('DRIVE_TOKEN_REFRESH_FAILED', 'A conexão com o Google Drive precisa ser renovada.', 502);
  }

  const payload = await response.json().catch(() => ({}));
  if (!payload?.access_token) {
    throw new DriveIntegrationError('DRIVE_TOKEN_REFRESH_FAILED', 'Resposta inválida ao renovar a conexão do Drive.', 502);
  }

  cachedAccessToken = {
    token: String(payload.access_token),
    expiresAt: Date.now() + Math.max(60, Number(payload.expires_in || 3600) - 90) * 1000
  };
  return cachedAccessToken.token;
}

async function driveFetch(env, url, options = {}, retry = true) {
  const token = await refreshAccessToken(env);
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 && retry) {
    cachedAccessToken = { token: '', expiresAt: 0 };
    return driveFetch(env, url, options, false);
  }
  return response;
}

function throwDriveResponse(response) {
  if (response.status === 404) {
    throw new DriveIntegrationError('DRIVE_FILE_NOT_FOUND', 'Arquivo ou pasta não encontrado no Google Drive.', 404);
  }
  if (response.status === 403) {
    throw new DriveIntegrationError('DRIVE_FORBIDDEN', 'A conta conectada não possui acesso a este item do Google Drive.', 403);
  }
  if (response.status === 429) {
    throw new DriveIntegrationError('DRIVE_RATE_LIMITED', 'O Google Drive limitou temporariamente as solicitações. Tente novamente em instantes.', 429);
  }
  throw new DriveIntegrationError('DRIVE_REQUEST_FAILED', 'O Google Drive não respondeu como esperado.', response.status >= 500 ? 503 : 502);
}

async function fileRefKey(env) {
  const secret = String(env.DRIVE_TOKEN_ENCRYPTION_KEY || '').trim();
  if (!secret) {
    throw new DriveIntegrationError('DRIVE_SECURITY_CONFIG_MISSING', 'Chave de proteção das referências do Drive não configurada.', 503);
  }
  return deriveAesKey(secret, 'central-documents-file-ref-v1');
}

export async function sealDriveFileRef(env, id, mimeType) {
  const fileId = String(id || '').trim();
  if (!fileId || fileId.length > 300) throw new DriveIntegrationError('DRIVE_FILE_REF_INVALID', 'Referência de arquivo inválida.', 400);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const key = await fileRefKey(env);
  const payload = JSON.stringify({
    id: fileId,
    mime: safeMime(mimeType),
    exp: nowSeconds() + FILE_REF_TTL_SECONDS
  });
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: utf8('central-documents-file-ref-v1') },
    key,
    utf8(payload)
  );
  return `${base64UrlBytes(iv)}.${base64UrlBytes(new Uint8Array(cipher))}`;
}

export async function openDriveFileRef(env, ref) {
  const parts = String(ref || '').split('.');
  if (parts.length !== 2 || parts[0].length > 80 || parts[1].length > 1000) {
    throw new DriveIntegrationError('DRIVE_FILE_REF_INVALID', 'Referência de arquivo inválida.', 400);
  }
  try {
    const key = await fileRefKey(env);
    const clear = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: bytesFromBase64Url(parts[0]),
        additionalData: utf8('central-documents-file-ref-v1')
      },
      key,
      bytesFromBase64Url(parts[1])
    );
    const payload = JSON.parse(new TextDecoder().decode(clear));
    if (!payload?.id || Number(payload.exp || 0) < nowSeconds()) throw new Error('expired');
    return { id: String(payload.id), mime: safeMime(payload.mime) };
  } catch (error) {
    if (error instanceof DriveIntegrationError) throw error;
    throw new DriveIntegrationError('DRIVE_FILE_REF_INVALID', 'Referência de arquivo inválida ou expirada.', 400);
  }
}

function normalizedDriveItem(file, ref, effectiveMime, shortcut = false) {
  return {
    ref,
    name: safeName(file.name || 'Sem nome'),
    mimeType: safeMime(effectiveMime || file.mimeType),
    originalMimeType: safeMime(file.mimeType),
    isFolder: effectiveMime === DRIVE_FOLDER_MIME,
    isPdf: effectiveMime === PDF_MIME,
    isShortcut: shortcut,
    size: Number.isFinite(Number(file.size)) ? Number(file.size) : null,
    modifiedTime: String(file.modifiedTime || ''),
    version: String(file.version || ''),
    canDownload: Boolean(file.capabilities?.canDownload),
    canEdit: Boolean(file.capabilities?.canEdit || file.capabilities?.canModifyContent)
  };
}

async function mapDriveFiles(env, files) {
  const output = [];
  for (const file of Array.isArray(files) ? files : []) {
    const shortcut = file.mimeType === DRIVE_SHORTCUT_MIME && file.shortcutDetails?.targetId;
    const effectiveId = shortcut ? file.shortcutDetails.targetId : file.id;
    const effectiveMime = shortcut ? file.shortcutDetails.targetMimeType : file.mimeType;
    if (!effectiveId) continue;
    const ref = await sealDriveFileRef(env, effectiveId, effectiveMime);
    output.push(normalizedDriveItem(file, ref, effectiveMime, Boolean(shortcut)));
  }
  return output;
}

async function parseDriveList(response, env) {
  if (!response.ok) throwDriveResponse(response);
  const payload = await response.json().catch(() => ({}));
  return {
    items: await mapDriveFiles(env, payload.files),
    nextPageToken: String(payload.nextPageToken || '')
  };
}

export async function driveConnectionStatus(env) {
  const configuration = driveOAuthConfiguration(env);
  if (!(await ensureDriveOAuthSchema(env))) {
    return {
      configured: configuration.ready,
      connected: false,
      databaseReady: false,
      scope: DRIVE_SCOPE
    };
  }
  const row = await oauthRow(env);
  return {
    configured: configuration.ready,
    connected: Boolean(row?.refresh_token_cipher && row?.refresh_token_iv),
    databaseReady: true,
    scope: DRIVE_SCOPE,
    connectedAt: row?.connected_at || '',
    updatedAt: row?.updated_at || ''
  };
}

export async function listDriveFolder(env, input = {}) {
  const pageSize = clampInteger(input.pageSize, 80, 20, 100);
  const pageToken = String(input.pageToken || '').trim().slice(0, 2000);
  let parentId = 'root';

  if (input.parentRef) {
    const parent = await openDriveFileRef(env, input.parentRef);
    if (parent.mime !== DRIVE_FOLDER_MIME) {
      throw new DriveIntegrationError('DRIVE_NOT_A_FOLDER', 'O item selecionado não é uma pasta.', 400);
    }
    parentId = parent.id;
  }

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', `'${escapeDriveQueryLiteral(parentId)}' in parents and trashed = false`);
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('orderBy', 'folder,name_natural');
  url.searchParams.set('spaces', 'drive');
  url.searchParams.set('supportsAllDrives', 'true');
  url.searchParams.set('includeItemsFromAllDrives', 'true');
  url.searchParams.set('fields', 'nextPageToken,files(id,name,mimeType,size,modifiedTime,version,capabilities(canDownload,canEdit,canModifyContent),shortcutDetails(targetId,targetMimeType))');
  if (pageToken) url.searchParams.set('pageToken', pageToken);

  const response = await driveFetch(env, url.toString(), { method: 'GET' });
  return parseDriveList(response, env);
}

export async function searchDrive(env, input = {}) {
  const query = String(input.query || '').trim().slice(0, 120);
  if (query.length < 2) {
    throw new DriveIntegrationError('DRIVE_SEARCH_TOO_SHORT', 'Digite pelo menos dois caracteres para pesquisar.', 400);
  }
  const pageSize = clampInteger(input.pageSize, 80, 20, 100);
  const pageToken = String(input.pageToken || '').trim().slice(0, 2000);

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', `trashed = false and name contains '${escapeDriveQueryLiteral(query)}'`);
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('orderBy', 'folder,name_natural');
  url.searchParams.set('spaces', 'drive');
  url.searchParams.set('corpora', 'user');
  url.searchParams.set('supportsAllDrives', 'true');
  url.searchParams.set('includeItemsFromAllDrives', 'true');
  url.searchParams.set('fields', 'nextPageToken,files(id,name,mimeType,size,modifiedTime,version,capabilities(canDownload,canEdit,canModifyContent),shortcutDetails(targetId,targetMimeType))');
  if (pageToken) url.searchParams.set('pageToken', pageToken);

  const response = await driveFetch(env, url.toString(), { method: 'GET' });
  return parseDriveList(response, env);
}

export async function fetchDrivePdf(env, ref, rangeHeader = '') {
  const file = await openDriveFileRef(env, ref);
  if (file.mime !== PDF_MIME) {
    throw new DriveIntegrationError('DRIVE_PDF_REQUIRED', 'Somente arquivos PDF podem ser abertos nesta fase.', 415);
  }

  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?alt=media&supportsAllDrives=true`;
  const headers = new Headers();
  const range = String(rangeHeader || '').trim();
  if (range && /^bytes=\d*-\d*(?:,\d*-\d*)*$/i.test(range)) headers.set('Range', range);

  const response = await driveFetch(env, url, { method: 'GET', headers });
  if (!response.ok && response.status !== 206) throwDriveResponse(response);
  return response;
}

export async function disconnectDrive(env) {
  let token = '';
  try { token = await refreshToken(env); }
  catch (_) {}

  if (token) {
    try {
      await fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ token })
      });
    } catch (_) {}
  }

  if (env.AUTH_DB && await ensureDriveOAuthSchema(env)) {
    await env.AUTH_DB.prepare('DELETE FROM document_drive_oauth WHERE connection_id = ?').bind(TOKEN_ROW_ID).run();
    await env.AUTH_DB.prepare('DELETE FROM document_drive_oauth_states').run();
  }
  cachedAccessToken = { token: '', expiresAt: 0 };
  return { connected: false };
}

export const driveConstants = Object.freeze({
  scope: DRIVE_SCOPE,
  folderMime: DRIVE_FOLDER_MIME,
  pdfMime: PDF_MIME
});
