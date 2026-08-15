'use strict';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FIRESTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';
const IDENTITY_SCOPE = 'https://www.googleapis.com/auth/identitytoolkit';
const STORAGE_SCOPE = 'https://www.googleapis.com/auth/devstorage.read_write';
const tokenCache = new Map();

function utf8(value) {
  return new TextEncoder().encode(String(value));
}

function base64UrlBytes(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlJson(value) {
  return base64UrlBytes(utf8(JSON.stringify(value)));
}

function pemBytes(value) {
  const pem = String(value || '').replace(/\\n/g, '\n');
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
  if (!base64) throw new Error('FIREBASE_PRIVATE_KEY não configurada.');
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function configured(env) {
  return Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);
}

async function googleAccessToken(env, scopes) {
  if (!configured(env)) throw new Error('Integração Firebase ainda não configurada.');
  const scope = Array.isArray(scopes) ? scopes.join(' ') : String(scopes || '');
  const cacheKey = `${env.FIREBASE_CLIENT_EMAIL}|${scope}`;
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60000) return cached.token;

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlJson({ alg: 'RS256', typ: 'JWT' });
  const claims = base64UrlJson({
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600
  });
  const unsigned = `${header}.${claims}`;
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemBytes(env.FIREBASE_PRIVATE_KEY),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, utf8(unsigned)));
  const assertion = `${unsigned}.${base64UrlBytes(signature)}`;
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion
  });
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || 'Não foi possível autenticar a conta de serviço do Firebase.');
  }
  const token = String(payload.access_token);
  const expiresIn = Number(payload.expires_in || 3600);
  tokenCache.set(cacheKey, { token, expiresAt: Date.now() + expiresIn * 1000 });
  return token;
}

function fsValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (Number.isInteger(value)) return { integerValue: String(value) };
  if (typeof value === 'number') return { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(fsValue) } };
  if (typeof value === 'object') {
    const fields = {};
    for (const [key, item] of Object.entries(value)) fields[key] = fsValue(item);
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function fsFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data || {})) fields[key] = fsValue(value);
  return fields;
}

function fromFsValue(value) {
  if (!value || typeof value !== 'object') return null;
  if ('nullValue' in value) return null;
  if ('booleanValue' in value) return Boolean(value.booleanValue);
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('stringValue' in value) return String(value.stringValue);
  if ('timestampValue' in value) return String(value.timestampValue);
  if ('arrayValue' in value) return (value.arrayValue?.values || []).map(fromFsValue);
  if ('mapValue' in value) return fromFsFields(value.mapValue?.fields || {});
  return null;
}

function fromFsFields(fields) {
  const result = {};
  for (const [key, value] of Object.entries(fields || {})) result[key] = fromFsValue(value);
  return result;
}

function firestoreRoot(env) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/databases/(default)/documents`;
}

async function firestoreRequest(env, path, options = {}) {
  const token = await googleAccessToken(env, FIRESTORE_SCOPE);
  const response = await fetch(`${firestoreRoot(env)}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || `Falha no Firestore (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export function firebaseConfigured(env) {
  return configured(env);
}

export async function firestoreCreate(env, collectionPath, documentId, data) {
  const query = new URLSearchParams({ documentId: String(documentId) });
  const payload = await firestoreRequest(env, `${collectionPath}?${query}`, {
    method: 'POST',
    body: JSON.stringify({ fields: fsFields(data) })
  });
  return { id: documentId, ...fromFsFields(payload.fields || {}) };
}

export async function firestoreGet(env, documentPath) {
  try {
    const payload = await firestoreRequest(env, documentPath, { method: 'GET' });
    const id = String(payload.name || '').split('/').pop();
    return { id, ...fromFsFields(payload.fields || {}) };
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function firestorePatch(env, documentPath, data) {
  const params = new URLSearchParams();
  Object.keys(data || {}).forEach((key) => params.append('updateMask.fieldPaths', key));
  const payload = await firestoreRequest(env, `${documentPath}?${params}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: fsFields(data) })
  });
  const id = String(payload.name || '').split('/').pop();
  return { id, ...fromFsFields(payload.fields || {}) };
}

export async function firestoreList(env, collectionPath, options = {}) {
  const params = new URLSearchParams();
  params.set('pageSize', String(Math.min(100, Math.max(1, Number(options.pageSize || 50)))));
  if (options.orderBy) params.set('orderBy', String(options.orderBy));
  if (options.pageToken) params.set('pageToken', String(options.pageToken));
  const payload = await firestoreRequest(env, `${collectionPath}?${params}`, { method: 'GET' });
  return {
    documents: (payload.documents || []).map((doc) => ({
      id: String(doc.name || '').split('/').pop(),
      ...fromFsFields(doc.fields || {})
    })),
    nextPageToken: payload.nextPageToken || ''
  };
}

export async function firestoreDelete(env, documentPath) {
  const token = await googleAccessToken(env, FIRESTORE_SCOPE);
  const response = await fetch(`${firestoreRoot(env)}/${documentPath}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Falha ao excluir documento do Firestore (${response.status}).`);
  return true;
}

function identityBase(env) {
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_WEB_API_KEY) {
    throw new Error('Firebase Authentication ainda não configurado.');
  }
  return `https://identitytoolkit.googleapis.com/v1`;
}

async function identityAdminRequest(env, path, body, method = 'POST') {
  const base = identityBase(env);
  const token = await googleAccessToken(env, IDENTITY_SCOPE);
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${base}/${path}${separator}key=${encodeURIComponent(env.FIREBASE_WEB_API_KEY)}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
      'X-Firebase-Locale': 'pt-BR'
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || `Falha no Firebase Authentication (${response.status}).`;
    const error = new Error(String(message));
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function identityPublicRequest(env, path, body) {
  const base = identityBase(env);
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${base}/${path}${separator}key=${encodeURIComponent(env.FIREBASE_WEB_API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Firebase-Locale': 'pt-BR' },
    body: JSON.stringify(body || {})
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || `Falha no Firebase Authentication (${response.status}).`;
    const error = new Error(String(message));
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function stableFirebaseUid(username) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', utf8(`portal:${username}`)));
  return `portal_${base64UrlBytes(digest).slice(0, 48)}`;
}

function randomPassword() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `${base64UrlBytes(bytes)}A9!`;
}

async function lookupFirebaseUsers(env, criteria) {
  const project = encodeURIComponent(env.FIREBASE_PROJECT_ID || '');
  const payload = await identityAdminRequest(env, `projects/${project}/accounts:lookup`, criteria);
  return Array.isArray(payload.users) ? payload.users : [];
}

export async function ensureFirebaseEmailIdentity(env, username, email) {
  const project = encodeURIComponent(env.FIREBASE_PROJECT_ID || '');
  const localId = await stableFirebaseUid(username);
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const byUid = await lookupFirebaseUsers(env, { localId: [localId] });
  const existing = byUid[0] || null;

  if (existing) {
    const sameEmail = String(existing.email || '').toLowerCase() === normalizedEmail;
    if (sameEmail && Boolean(existing.emailVerified)) {
      return { localId, emailVerified: true, verificationPassword: '' };
    }
    const verificationPassword = randomPassword();
    const updated = await identityAdminRequest(env, `projects/${project}/accounts:update`, {
      localId,
      email: normalizedEmail,
      password: verificationPassword,
      emailVerified: sameEmail ? Boolean(existing.emailVerified) : false
    });
    return {
      localId: updated.localId || localId,
      emailVerified: Boolean(updated.emailVerified),
      verificationPassword
    };
  }

  const byEmail = await lookupFirebaseUsers(env, { email: [normalizedEmail] });
  if (byEmail.length) {
    const error = new Error('Este e-mail já está vinculado a outra conta de segurança.');
    error.status = 409;
    throw error;
  }

  const verificationPassword = randomPassword();
  const created = await identityAdminRequest(env, `projects/${project}/accounts`, {
    localId,
    email: normalizedEmail,
    password: verificationPassword,
    emailVerified: false,
    displayName: `Portal ${username}`
  });
  return {
    localId: created.localId || localId,
    emailVerified: Boolean(created.emailVerified),
    verificationPassword
  };
}

export async function sendFirebaseVerificationEmail(env, email, verificationPassword) {
  if (!verificationPassword) throw new Error('Não foi possível preparar a verificação deste e-mail.');
  const signIn = await identityPublicRequest(env, 'accounts:signInWithPassword', {
    email: String(email),
    password: verificationPassword,
    returnSecureToken: true
  });
  if (!signIn.idToken) throw new Error('O Firebase não retornou o token necessário para a verificação.');
  return identityPublicRequest(env, 'accounts:sendOobCode', {
    requestType: 'VERIFY_EMAIL',
    idToken: signIn.idToken,
    continueUrl: 'https://regulacaoeldoradoms.com.br/conta/?email-verificado=1',
    canHandleCodeInApp: false
  });
}

export async function firebaseEmailStatus(env, email) {
  const users = await lookupFirebaseUsers(env, { email: [String(email).trim().toLowerCase()] });
  const user = users[0] || null;
  return user ? { localId: user.localId || '', emailVerified: Boolean(user.emailVerified) } : null;
}

export async function storageUpload(env, objectName, bytes, contentType) {
  if (!env.FIREBASE_STORAGE_BUCKET) throw new Error('FIREBASE_STORAGE_BUCKET não configurado.');
  const token = await googleAccessToken(env, STORAGE_SCOPE);
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(env.FIREBASE_STORAGE_BUCKET)}/o?uploadType=media&name=${encodeURIComponent(objectName)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': contentType || 'application/octet-stream' },
    body: bytes
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || `Falha ao armazenar anexo (${response.status}).`);
  return {
    name: payload.name || objectName,
    bucket: payload.bucket || env.FIREBASE_STORAGE_BUCKET,
    size: Number(payload.size || 0),
    contentType: payload.contentType || contentType || ''
  };
}

export async function storageDownload(env, objectName) {
  if (!env.FIREBASE_STORAGE_BUCKET) throw new Error('FIREBASE_STORAGE_BUCKET não configurado.');
  const token = await googleAccessToken(env, STORAGE_SCOPE);
  const url = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(env.FIREBASE_STORAGE_BUCKET)}/o/${encodeURIComponent(objectName)}?alt=media`;
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } });
}
