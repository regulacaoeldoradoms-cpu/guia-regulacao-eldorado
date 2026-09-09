'use strict';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FIRESTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';
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
  return Boolean(env?.FIREBASE_PROJECT_ID && env?.FIREBASE_CLIENT_EMAIL && env?.FIREBASE_PRIVATE_KEY);
}

async function accessToken(env) {
  if (!configured(env)) throw new Error('Integração Firebase ainda não configurada.');
  const cacheKey = `${env.FIREBASE_CLIENT_EMAIL}|${FIRESTORE_SCOPE}`;
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60000) return cached.token;

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlJson({ alg: 'RS256', typ: 'JWT' });
  const claims = base64UrlJson({
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope: FIRESTORE_SCOPE,
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

function databaseRoot(env) {
  return `projects/${env.FIREBASE_PROJECT_ID}/databases/(default)`;
}

function documentName(env, path) {
  const normalizedPath = String(path || '').replace(/^\/+|\/+$/g, '');
  if (!normalizedPath || !normalizedPath.includes('/')) throw new Error('Caminho de documento inválido para commit atômico.');
  return `${databaseRoot(env)}/documents/${normalizedPath}`;
}

export function buildFirestoreCommitWrites(env, writes = []) {
  if (!env?.FIREBASE_PROJECT_ID) throw new Error('FIREBASE_PROJECT_ID não configurado.');
  if (!Array.isArray(writes) || !writes.length) throw new Error('Nenhuma gravação foi informada para o commit atômico.');
  if (writes.length > 20) throw new Error('O commit atômico excedeu o limite interno de segurança.');

  return writes.map((entry) => {
    const mode = String(entry?.mode || '').toLowerCase();
    if (!['create', 'update'].includes(mode)) throw new Error('Modo de gravação atômica inválido.');
    const data = entry?.data && typeof entry.data === 'object' ? entry.data : {};
    const write = {
      update: {
        name: documentName(env, entry?.path),
        fields: fsFields(data)
      },
      currentDocument: { exists: mode === 'update' }
    };
    if (mode === 'update') {
      const fieldPaths = Object.keys(data);
      if (!fieldPaths.length) throw new Error('Atualização atômica sem campos.');
      write.updateMask = { fieldPaths };
    }
    return write;
  });
}

export async function firestoreAtomicCommit(env, writes = []) {
  const commitWrites = buildFirestoreCommitWrites(env, writes);
  const token = await accessToken(env);
  const project = encodeURIComponent(env.FIREBASE_PROJECT_ID);
  const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:commit`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({ writes: commitWrites })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || `Falha no commit atômico do Firestore (${response.status}).`;
    const error = new Error(String(message));
    error.status = response.status;
    throw error;
  }
  return payload;
}
