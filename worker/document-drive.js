'use strict';

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
const OAUTH_STATE_TTL_SECONDS = 10 * 60;
const FILE_REF_TTL_SECONDS = 12 * 60 * 60;
const CONFIRMED_BASELINE_TTL_SECONDS = 30 * 60;
const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';
const DRIVE_SHORTCUT_MIME = 'application/vnd.google-apps.shortcut';
const PDF_MIME = 'application/pdf';
const DRIVE_SYNC_OPERATIONS = new Set(['replace_pdf', 'save_copy']);
const DRIVE_SYNC_FILE_FIELDS = 'id,mimeType,size,modifiedTime,version,md5Checksum,headRevisionId,parents,capabilities(canDownload,canEdit,canModifyContent)';
const DRIVE_SYNC_SESSION_TTL_SECONDS = 6 * 24 * 60 * 60;
const DRIVE_SYNC_CHUNK_BYTES = 4 * 1024 * 1024;
const DRIVE_SYNC_MAX_CHUNK_BYTES = 8 * 1024 * 1024;
const DRIVE_SYNC_MIN_CHUNK_UNIT = 256 * 1024;
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
    await binding.prepare(`CREATE TABLE IF NOT EXISTS document_drive_sync_sessions (
      sync_id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      operation TEXT NOT NULL,
      session_url_cipher TEXT NOT NULL,
      session_url_iv TEXT NOT NULL,
      total_bytes INTEGER NOT NULL,
      next_offset INTEGER NOT NULL DEFAULT 0,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();
    await binding.prepare('CREATE INDEX IF NOT EXISTS idx_document_drive_sync_exp ON document_drive_sync_sessions(expires_at)').run();
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

async function stableDriveCacheKey(env, fileId) {
  const { encryptionSecret } = requireOAuthConfig(env);
  const material = await crypto.subtle.digest('SHA-256', utf8(`central-doc-cache-v1\u0000${encryptionSecret}`));
  const key = await crypto.subtle.importKey(
    'raw',
    material,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    utf8(`drive-file\u0000${String(fileId || '')}`)
  );
  return base64UrlBytes(new Uint8Array(signature)).slice(0, 32);
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
    if (!payload?.nonce || Number(payload.exp || 0) < nowSeconds()) throw new Error('expired');
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

  const state = await signState(env, { nonce, exp });
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
  if (!storedState || Number(storedState.expires_at || 0) < nowSeconds()) {
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

  await storeRefreshToken(env, refresh, tokenPayload.scope || DRIVE_SCOPE, storedState.username);
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

async function sealDriveFileRefPayload(env, id, mimeType, confirmed = null) {
  const fileId = String(id || '').trim();
  if (!fileId || fileId.length > 300) throw new DriveIntegrationError('DRIVE_FILE_REF_INVALID', 'Referência de arquivo inválida.', 400);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const key = await fileRefKey(env);
  const payload = JSON.stringify({
    id: fileId,
    mime: safeMime(mimeType),
    exp: nowSeconds() + FILE_REF_TTL_SECONDS,
    ...(confirmed ? { confirmed } : {})
  });
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: utf8('central-documents-file-ref-v1') },
    key,
    utf8(payload)
  );
  return `${base64UrlBytes(iv)}.${base64UrlBytes(new Uint8Array(cipher))}`;
}

export async function sealDriveFileRef(env, id, mimeType) {
  // Listing/opening a file never certifies that an editor saved its contents.
  return sealDriveFileRefPayload(env, id, mimeType);
}

async function openDriveFileRefPayload(env, ref) {
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
    return {
      id: String(payload.id), mime: safeMime(payload.mime),
      ...(payload.confirmed ? { confirmed: payload.confirmed } : {})
    };
  } catch (error) {
    if (error instanceof DriveIntegrationError) throw error;
    throw new DriveIntegrationError('DRIVE_FILE_REF_INVALID', 'Referência de arquivo inválida ou expirada.', 400);
  }
}

export async function openDriveFileRef(env, ref) {
  const file = await openDriveFileRefPayload(env, ref);
  return { id: file.id, mime: file.mime };
}

function normalizedDriveItem(file, ref, cacheKey, effectiveMime, shortcut = false) {
  return {
    ref,
    cacheKey,
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
    const [ref, cacheKey] = await Promise.all([
      sealDriveFileRef(env, effectiveId, effectiveMime),
      stableDriveCacheKey(env, effectiveId)
    ]);
    output.push(normalizedDriveItem(file, ref, cacheKey, effectiveMime, Boolean(shortcut)));
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
      scope: DRIVE_SCOPE,
      writeEnabled: driveSyncWriteEnabled(env)
    };
  }
  const row = await oauthRow(env);
  return {
    configured: configuration.ready,
    connected: Boolean(row?.refresh_token_cipher && row?.refresh_token_iv),
    databaseReady: true,
    scope: DRIVE_SCOPE,
    writeEnabled: driveSyncWriteEnabled(env),
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

function normalizeDriveVersion(value, { required = false } = {}) {
  const version = String(value || '').trim();
  if (!version) {
    if (required) {
      throw new DriveIntegrationError(
        'DRIVE_BASE_VERSION_REQUIRED',
        'A versão-base do arquivo é obrigatória para substituir o original.',
        400
      );
    }
    return '';
  }
  if (!/^\d{1,40}$/.test(version)) {
    throw new DriveIntegrationError('DRIVE_VERSION_INVALID', 'Versão do Google Drive inválida.', 400);
  }
  return version;
}

async function confirmedBaselineDigest(value) {
  const digest = await crypto.subtle.digest('SHA-256', utf8(JSON.stringify(value)));
  return base64UrlBytes(new Uint8Array(digest));
}

async function confirmedContentIdentity(current) {
  if (!current.id || !String(current.headRevisionId || '').trim()
    || !/^[a-f0-9]{32}$/i.test(String(current.md5Checksum || ''))
    || !Number.isSafeInteger(current.size) || current.size <= 0) return '';
  return confirmedBaselineDigest([
    'central-documents-confirmed-content-v1', current.id, PDF_MIME,
    current.headRevisionId, current.md5Checksum.toLowerCase(), current.size
  ]);
}

async function confirmedBaselineScope(env) {
  const control = String(env.DOCUMENTS_HOMOLOGATION_CONTROL_ID || '').trim();
  const workerOrigin = String(env.DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN || '').trim();
  const preview = Boolean(control || workerOrigin);
  // The normal Worker can also have a Pages CORS origin configured. Only the
  // restricted preview has a control/Worker origin and may share that scope.
  return confirmedBaselineDigest([
    'central-documents-confirmed-scope-v1', preview ? 'preview' : 'core',
    preview ? control : '', preview ? workerOrigin : '',
    preview ? String(env.DOCUMENTS_HOMOLOGATION_ORIGIN || '').trim() : ''
  ]);
}

async function sealConfirmedDriveFileRef(env, current, username) {
  return sealDriveFileRefPayload(env, current.id, PDF_MIME, {
    kind: 1,
    actor: normalizeUsername(username),
    version: current.version,
    identity: await confirmedContentIdentity(current),
    scope: await confirmedBaselineScope(env),
    expiresAt: nowSeconds() + CONFIRMED_BASELINE_TTL_SECONDS
  });
}

async function confirmedBaselineMatches(env, file, current, baseVersion, username) {
  const proof = file.confirmed;
  const actor = normalizeUsername(username);
  if (!proof || proof.kind !== 1 || !actor || proof.actor !== actor
    || file.id !== current.id || proof.version !== baseVersion
    || !Number.isSafeInteger(proof.expiresAt) || proof.expiresAt <= nowSeconds()
    || !/^[A-Za-z0-9_-]{43}$/.test(String(proof.identity || ''))
    || !/^[A-Za-z0-9_-]{43}$/.test(String(proof.scope || ''))
    || BigInt(current.version) <= BigInt(baseVersion)) return false;
  return proof.scope === await confirmedBaselineScope(env)
    && proof.identity === await confirmedContentIdentity(current);
}

async function currentDrivePdfMetadata(env, ref, openedFile = null) {
  const file = openedFile || await openDriveFileRef(env, ref);
  if (file.mime !== PDF_MIME) {
    throw new DriveIntegrationError('DRIVE_PDF_REQUIRED', 'Somente arquivos PDF podem ser sincronizados.', 415);
  }

  const url = new URL(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}`);
  url.searchParams.set('supportsAllDrives', 'true');
  url.searchParams.set('fields', DRIVE_SYNC_FILE_FIELDS);

  const response = await driveFetch(env, url.toString(), { method: 'GET' });
  if (!response.ok) throwDriveResponse(response);

  const metadata = await response.json().catch(() => ({}));
  if (!metadata?.id || metadata.mimeType !== PDF_MIME) {
    throw new DriveIntegrationError('DRIVE_PDF_REQUIRED', 'O arquivo atual não é mais um PDF válido para sincronização.', 409);
  }

  return {
    id: String(metadata.id),
    mimeType: PDF_MIME,
    size: Number.isFinite(Number(metadata.size)) ? Number(metadata.size) : null,
    modifiedTime: String(metadata.modifiedTime || ''),
    version: normalizeDriveVersion(metadata.version, { required: true }),
    md5Checksum: String(metadata.md5Checksum || ''),
    headRevisionId: String(metadata.headRevisionId || ''),
    parents: Array.isArray(metadata.parents) ? metadata.parents.map((item) => String(item || '')).filter(Boolean) : [],
    canEdit: Boolean(metadata.capabilities?.canEdit || metadata.capabilities?.canModifyContent),
    canDownload: Boolean(metadata.capabilities?.canDownload)
  };
}

async function driveSyncPreflightState(env, input = {}, username = '') {
  const operation = String(input.operation || '').trim();
  if (!DRIVE_SYNC_OPERATIONS.has(operation)) {
    throw new DriveIntegrationError('DRIVE_SYNC_OPERATION_INVALID', 'Operação de sincronização inválida.', 400);
  }

  const ref = String(input.ref || '').trim();
  if (!ref) {
    throw new DriveIntegrationError('DRIVE_FILE_REF_INVALID', 'Referência de arquivo ausente.', 400);
  }

  const baseVersion = normalizeDriveVersion(input.baseVersion, { required: operation === 'replace_pdf' });
  const file = await openDriveFileRefPayload(env, ref);
  const current = await currentDrivePdfMetadata(env, ref, file);
  let conflict = Boolean(baseVersion && current.version !== baseVersion);

  if (operation === 'replace_pdf') {
    if (!current.canEdit) {
      throw new DriveIntegrationError(
        'DRIVE_FILE_NOT_EDITABLE',
        'A conta institucional não possui permissão para substituir este arquivo.',
        403
      );
    }
    // Only a receipt minted after our own confirmed upload can reconcile a
    // later metadata version. Another head remains a conflict even with equal bytes.
    if (conflict && await confirmedBaselineMatches(env, file, current, baseVersion, username)) {
      conflict = false;
    }
    if (conflict) {
      throw new DriveIntegrationError(
        'DRIVE_VERSION_CONFLICT',
        'O arquivo foi alterado no Google Drive depois que esta edição começou. Reabra o documento antes de substituir o original.',
        409
      );
    }
  }

  return {
    operation,
    ref,
    baseVersion,
    current,
    publicResult: {
      operation,
      conflict,
      blocking: operation === 'replace_pdf' && conflict,
      baseVersion,
      currentVersion: current.version,
      modifiedTime: current.modifiedTime,
      size: current.size,
      canEditOriginal: current.canEdit
    }
  };
}

export async function preflightDriveSync(env, input = {}, username = '') {
  return (await driveSyncPreflightState(env, input, username)).publicResult;
}

function driveSyncWriteEnabled(env) {
  return String(env.DOCUMENTS_DRIVE_WRITE_ENABLED || '').trim().toLowerCase() === 'true';
}

function requireDriveSyncWriteEnabled(env) {
  if (!driveSyncWriteEnabled(env)) {
    throw new DriveIntegrationError(
      'DRIVE_SYNC_WRITE_DISABLED',
      'A escrita no Google Drive ainda não foi habilitada para este ambiente.',
      503
    );
  }
}

function normalizeSyncTotalBytes(value) {
  const total = Number(value);
  if (!Number.isSafeInteger(total) || total <= 0) {
    throw new DriveIntegrationError('DRIVE_SYNC_SIZE_INVALID', 'Tamanho do PDF inválido para sincronização.', 400);
  }
  return total;
}

function normalizeCopyName(value) {
  let name = safeName(value).trim();
  if (!name) {
    throw new DriveIntegrationError('DRIVE_COPY_NAME_REQUIRED', 'Informe o nome do novo PDF.', 400);
  }
  if (!/\.pdf$/i.test(name)) name += '.pdf';
  if (name.length > 300) name = name.slice(0, 296) + '.pdf';
  return name;
}

function validDriveResumableUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:'
      && url.hostname === 'www.googleapis.com'
      && url.pathname.startsWith('/upload/drive/v3/files');
  } catch (_) {
    return false;
  }
}

function syncSessionLabel(syncId) {
  return `central-documents-sync-session-v1:${String(syncId || '')}`;
}

async function cleanDriveSyncSessions(env) {
  if (!(await ensureDriveOAuthSchema(env))) {
    throw new DriveIntegrationError('DRIVE_DB_UNAVAILABLE', 'Banco técnico indisponível para sincronização.', 503);
  }
  await env.AUTH_DB.prepare('DELETE FROM document_drive_sync_sessions WHERE expires_at < ?').bind(nowSeconds()).run();
}

async function storeDriveSyncSession(env, input) {
  await cleanDriveSyncSessions(env);
  const config = requireOAuthConfig(env);
  const syncId = randomToken(24);
  const encrypted = await encryptText(
    config.encryptionSecret,
    syncSessionLabel(syncId),
    String(input.sessionUrl || '')
  );
  const username = normalizeUsername(input.username);
  if (!username) throw new DriveIntegrationError('DRIVE_SYNC_ACTOR_INVALID', 'Usuário inválido para sincronização.', 400);
  await env.AUTH_DB.prepare(`INSERT INTO document_drive_sync_sessions(
      sync_id, username, operation, session_url_cipher, session_url_iv,
      total_bytes, next_offset, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`)
    .bind(
      syncId,
      username,
      input.operation,
      encrypted.cipher,
      encrypted.iv,
      input.totalBytes,
      nowSeconds() + DRIVE_SYNC_SESSION_TTL_SECONDS
    )
    .run();
  return syncId;
}

async function driveSyncSession(env, syncId, username) {
  await cleanDriveSyncSessions(env);
  const id = String(syncId || '').trim();
  const actor = normalizeUsername(username);
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(id) || !actor) {
    throw new DriveIntegrationError('DRIVE_SYNC_SESSION_INVALID', 'Sessão de sincronização inválida.', 400);
  }
  const row = await env.AUTH_DB.prepare(`SELECT sync_id, username, operation, session_url_cipher,
      session_url_iv, total_bytes, next_offset, expires_at
    FROM document_drive_sync_sessions WHERE sync_id = ? LIMIT 1`).bind(id).first();
  if (!row || row.username !== actor || Number(row.expires_at || 0) < nowSeconds()) {
    throw new DriveIntegrationError('DRIVE_SYNC_SESSION_NOT_FOUND', 'Sessão de sincronização expirada ou indisponível.', 404);
  }
  const config = requireOAuthConfig(env);
  let sessionUrl = '';
  try {
    sessionUrl = await decryptText(
      config.encryptionSecret,
      syncSessionLabel(id),
      row.session_url_cipher,
      row.session_url_iv
    );
  } catch (_) {
    throw new DriveIntegrationError('DRIVE_SYNC_SESSION_INVALID', 'Sessão de sincronização inválida.', 409);
  }
  if (!validDriveResumableUrl(sessionUrl)) {
    throw new DriveIntegrationError('DRIVE_SYNC_SESSION_INVALID', 'Sessão de sincronização inválida.', 409);
  }
  return {
    syncId: id,
    username: actor,
    operation: String(row.operation || ''),
    sessionUrl,
    totalBytes: Number(row.total_bytes || 0),
    nextOffset: Number(row.next_offset || 0)
  };
}

async function deleteDriveSyncSession(env, syncId) {
  if (!env.AUTH_DB) return;
  await env.AUTH_DB.prepare('DELETE FROM document_drive_sync_sessions WHERE sync_id = ?').bind(String(syncId || '')).run();
}

async function updateDriveSyncOffset(env, syncId, nextOffset) {
  await env.AUTH_DB.prepare(`UPDATE document_drive_sync_sessions
    SET next_offset = ?, updated_at = CURRENT_TIMESTAMP WHERE sync_id = ?`)
    .bind(Number(nextOffset || 0), String(syncId || '')).run();
}

async function preserveDriveRevision(env, current) {
  if (!current.headRevisionId) {
    throw new DriveIntegrationError(
      'DRIVE_REVISION_UNAVAILABLE',
      'O Google Drive não informou uma revisão recuperável do arquivo atual.',
      409
    );
  }
  const url = new URL(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(current.id)}/revisions/${encodeURIComponent(current.headRevisionId)}`
  );
  url.searchParams.set('fields', 'id,keepForever');
  const response = await driveFetch(env, url.toString(), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ keepForever: true })
  });
  if (!response.ok) throwDriveResponse(response);
  const payload = await response.json().catch(() => ({}));
  if (payload.keepForever !== true) {
    throw new DriveIntegrationError(
      'DRIVE_REVISION_PRESERVE_FAILED',
      'Não foi possível confirmar a preservação da revisão anterior.',
      502
    );
  }
}

async function initiateDriveResumableUpload(env, input) {
  const current = input.current;
  let url;
  let metadata;
  let method;

  if (input.operation === 'replace_pdf') {
    if (input.preserveRevision !== false) {
      await preserveDriveRevision(env, current);
    }
    url = new URL(`https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(current.id)}`);
    method = 'PATCH';
    metadata = {};
  } else {
    url = new URL('https://www.googleapis.com/upload/drive/v3/files');
    method = 'POST';
    metadata = {
      name: normalizeCopyName(input.copyName),
      mimeType: PDF_MIME
    };
    if (current.parents.length) metadata.parents = [current.parents[0]];
  }

  url.searchParams.set('uploadType', 'resumable');
  url.searchParams.set('supportsAllDrives', 'true');
  url.searchParams.set('fields', DRIVE_SYNC_FILE_FIELDS);

  const response = await driveFetch(env, url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': PDF_MIME,
      'X-Upload-Content-Length': String(input.totalBytes)
    },
    body: JSON.stringify(metadata)
  });
  if (!response.ok) throwDriveResponse(response);

  const sessionUrl = String(response.headers.get('Location') || '');
  if (!validDriveResumableUrl(sessionUrl)) {
    throw new DriveIntegrationError(
      'DRIVE_SYNC_SESSION_MISSING',
      'O Google Drive não iniciou uma sessão de upload válida.',
      502
    );
  }
  return sessionUrl;
}

export async function startDriveSync(env, username, input = {}) {
  requireDriveSyncWriteEnabled(env);
  const totalBytes = normalizeSyncTotalBytes(input.totalBytes);
  const prepared = await driveSyncPreflightState(env, input, username);
  const sessionUrl = await initiateDriveResumableUpload(env, {
    operation: prepared.operation,
    current: prepared.current,
    totalBytes,
    copyName: input.copyName,
    preserveRevision: input.preserveRevision !== false
  });
  const syncId = await storeDriveSyncSession(env, {
    username,
    operation: prepared.operation,
    sessionUrl,
    totalBytes
  });
  return {
    syncId,
    operation: prepared.operation,
    totalBytes,
    chunkSize: DRIVE_SYNC_CHUNK_BYTES,
    conflictDetected: prepared.publicResult.conflict === true,
    safetyRevisionPreserved: prepared.operation === 'replace_pdf' && input.preserveRevision !== false
  };
}

function nextOffsetFromRange(value, totalBytes) {
  const range = String(value || '').trim();
  if (!range) return 0;
  const match = /^bytes=0-(\d+)$/.exec(range);
  if (!match) return 0;
  const next = Number(match[1]) + 1;
  return Number.isSafeInteger(next) && next >= 0 && next <= totalBytes ? next : 0;
}

async function completedDriveSyncResult(env, session, response) {
  const payload = await response.json().catch(() => ({}));
  const version = normalizeDriveVersion(payload.version, { required: true });
  const size = Number(payload.size);
  if (!payload?.id || payload.mimeType !== PDF_MIME
    || !String(payload.headRevisionId || '').trim()
    || !/^[a-f0-9]{32}$/i.test(String(payload.md5Checksum || ''))
    || !Number.isSafeInteger(size) || size !== session.totalBytes) {
    throw new DriveIntegrationError(
      'DRIVE_SYNC_CONFIRMATION_INVALID',
      'O Google Drive concluiu a solicitação sem metadados suficientes para confirmar o salvamento.',
      502
    );
  }
  const [ref, cacheKey] = await Promise.all([
    sealDriveFileRef(env, String(payload.id), PDF_MIME),
    stableDriveCacheKey(env, String(payload.id))
  ]);
  // Drive's version includes metadata changes, not only binary revisions. Re-read
  // it after the resumable receipt so the next queued edit starts from the current
  // version, but never adopt a different head (even with identical PDF bytes).
  const current = await currentDrivePdfMetadata(env, ref);
  if (current.id !== String(payload.id)
    || current.headRevisionId !== String(payload.headRevisionId)
    || current.md5Checksum.toLowerCase() !== String(payload.md5Checksum).toLowerCase()
    || current.size !== size) {
    throw new DriveIntegrationError(
      'DRIVE_VERSION_CONFLICT',
      'O arquivo foi alterado no Google Drive durante a confirmação do salvamento. Reabra o documento antes de substituir o original.',
      409
    );
  }
  if (BigInt(current.version) < BigInt(version)) {
    throw new DriveIntegrationError(
      'DRIVE_SYNC_INTERRUPTED',
      'O Google Drive ainda não confirmou a versão atual do upload. Consulte o status antes de retomar.',
      503
    );
  }
  const confirmedRef = await sealConfirmedDriveFileRef(env, current, session.username);
  await deleteDriveSyncSession(env, session.syncId);
  return {
    completed: true,
    operation: session.operation,
    currentVersion: current.version,
    modifiedTime: current.modifiedTime,
    size: current.size,
    ref: confirmedRef,
    cacheKey
  };
}

function validateDriveSyncChunk(request, session) {
  const contentType = String(request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  if (contentType !== PDF_MIME) {
    throw new DriveIntegrationError('DRIVE_SYNC_PDF_REQUIRED', 'O bloco de sincronização deve ser PDF.', 415);
  }
  const range = String(request.headers.get('Content-Range') || '').trim();
  const match = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(range);
  if (!match) {
    throw new DriveIntegrationError('DRIVE_SYNC_RANGE_INVALID', 'Faixa de upload inválida.', 400);
  }
  const start = Number(match[1]);
  const end = Number(match[2]);
  const total = Number(match[3]);
  const length = end - start + 1;
  if (
    !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || !Number.isSafeInteger(total)
    || start < 0 || end < start || total !== session.totalBytes || end >= total
    || start !== session.nextOffset || length > DRIVE_SYNC_MAX_CHUNK_BYTES
  ) {
    throw new DriveIntegrationError('DRIVE_SYNC_RANGE_INVALID', 'Faixa de upload incompatível com a sessão.', 409);
  }
  const isFinal = end === total - 1;
  if (!isFinal && length % DRIVE_SYNC_MIN_CHUNK_UNIT !== 0) {
    throw new DriveIntegrationError(
      'DRIVE_SYNC_CHUNK_INVALID',
      'Blocos intermediários devem usar múltiplos de 256 KB.',
      400
    );
  }
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared && declared !== length) {
    throw new DriveIntegrationError('DRIVE_SYNC_LENGTH_INVALID', 'Tamanho do bloco não corresponde à faixa informada.', 400);
  }
  return { start, end, total, length };
}

async function handleDriveSessionResponse(env, session, response) {
  if (response.status === 308) {
    const nextOffset = nextOffsetFromRange(response.headers.get('Range'), session.totalBytes);
    await updateDriveSyncOffset(env, session.syncId, nextOffset);
    return {
      completed: false,
      operation: session.operation,
      nextOffset,
      totalBytes: session.totalBytes
    };
  }
  if (response.status === 200 || response.status === 201) {
    return completedDriveSyncResult(env, session, response);
  }
  if (response.status === 404) {
    await deleteDriveSyncSession(env, session.syncId);
    throw new DriveIntegrationError('DRIVE_SYNC_SESSION_EXPIRED', 'A sessão de upload expirou. Inicie a sincronização novamente.', 410);
  }
  if (response.status >= 500) {
    throw new DriveIntegrationError(
      'DRIVE_SYNC_INTERRUPTED',
      'O Google Drive interrompeu temporariamente o upload. Consulte o status antes de retomar.',
      503
    );
  }
  await deleteDriveSyncSession(env, session.syncId);
  throw new DriveIntegrationError(
    'DRIVE_SYNC_SESSION_RESTART_REQUIRED',
    'A sessão de upload não pode continuar. Inicie a sincronização novamente.',
    409
  );
}

export async function uploadDriveSyncChunk(env, username, syncId, request) {
  requireDriveSyncWriteEnabled(env);
  const session = await driveSyncSession(env, syncId, username);
  const range = validateDriveSyncChunk(request, session);
  if (!request.body) {
    throw new DriveIntegrationError('DRIVE_SYNC_BODY_REQUIRED', 'Bloco de PDF ausente.', 400);
  }

  let uploadBody = request.body;
  if (range.start === 0) {
    const firstChunk = new Uint8Array(await request.arrayBuffer());
    if (firstChunk.byteLength !== range.length) {
      throw new DriveIntegrationError('DRIVE_SYNC_LENGTH_INVALID', 'Tamanho real do primeiro bloco não corresponde à faixa informada.', 400);
    }
    const signature = new TextDecoder('ascii').decode(firstChunk.slice(0, 5));
    if (signature !== '%PDF-') {
      throw new DriveIntegrationError('DRIVE_SYNC_PDF_INVALID', 'O arquivo final não possui assinatura PDF válida.', 415);
    }
    uploadBody = firstChunk;
  }

  const response = await driveFetch(env, session.sessionUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': PDF_MIME,
      'Content-Length': String(range.length),
      'Content-Range': `bytes ${range.start}-${range.end}/${range.total}`
    },
    body: uploadBody
  }, false);
  return handleDriveSessionResponse(env, session, response);
}

export async function queryDriveSyncStatus(env, username, syncId) {
  requireDriveSyncWriteEnabled(env);
  const session = await driveSyncSession(env, syncId, username);
  const response = await driveFetch(env, session.sessionUrl, {
    method: 'PUT',
    headers: {
      'Content-Length': '0',
      'Content-Range': `bytes */${session.totalBytes}`
    }
  }, false);
  return handleDriveSessionResponse(env, session, response);
}

export async function cancelDriveSync(env, username, syncId) {
  const session = await driveSyncSession(env, syncId, username);
  await deleteDriveSyncSession(env, session.syncId);
  return { cancelled: true, operation: session.operation };
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
    await env.AUTH_DB.prepare('DELETE FROM document_drive_sync_sessions').run();
  }
  cachedAccessToken = { token: '', expiresAt: 0 };
  return { connected: false };
}

export const driveConstants = Object.freeze({
  scope: DRIVE_SCOPE,
  folderMime: DRIVE_FOLDER_MIME,
  pdfMime: PDF_MIME
});
