'use strict';

const AUTH_ROLES = new Set(['medico', 'recepcao', 'admin']);
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const PASSWORD_MIN_LENGTH = 8;
const PBKDF2_ITERATIONS = 120000;

function jsonResponse(body, status, origin, allowed = true) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function boundedString(value, maximum) {
  return String(value || '').trim().slice(0, maximum);
}

function normalizeUsername(value) {
  return boundedString(value, 80).toLowerCase();
}

function usernameValid(value) {
  return /^[a-z0-9._-]{3,40}$/.test(value);
}

function configuredUsers(env) {
  if (!env.AUTH_USERS_JSON) return [];
  let parsed;
  try { parsed = JSON.parse(env.AUTH_USERS_JSON); }
  catch (_) { throw new Error('AUTH_USERS_JSON inválido.'); }
  if (!Array.isArray(parsed)) throw new Error('AUTH_USERS_JSON deve ser uma lista.');
  return parsed.map((user) => ({
    username: normalizeUsername(user.username),
    password: String(user.password || ''),
    name: boundedString(user.name || user.username, 120),
    jobTitle: boundedString(user.jobTitle || '', 120),
    role: AUTH_ROLES.has(user.role) ? user.role : '',
    active: user.active !== false,
    mustChangePassword: Boolean(user.mustChangePassword),
    sessionVersion: 1,
    source: 'bootstrap'
  })).filter((user) => user.username && user.password && user.role && user.active);
}

function publicUser(user) {
  return {
    username: user.username,
    name: user.name,
    jobTitle: user.jobTitle || '',
    role: user.role,
    active: user.active !== false,
    mustChangePassword: Boolean(user.mustChangePassword)
  };
}

function utf8(value) {
  return new TextEncoder().encode(String(value));
}

function base64UrlEncodeBytes(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlEncodeJson(value) {
  return base64UrlEncodeBytes(utf8(JSON.stringify(value)));
}

function base64UrlDecodeJson(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function hmacKey(secret) {
  if (!secret) throw new Error('AUTH_SESSION_SECRET não configurado.');
  return crypto.subtle.importKey('raw', utf8(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function createSessionToken(user, env) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncodeJson({ alg: 'HS256', typ: 'JWT' });
  const payload = base64UrlEncodeJson({
    sub: user.username,
    name: user.name,
    jobTitle: user.jobTitle || '',
    role: user.role,
    ver: Number(user.sessionVersion || 1),
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  });
  const unsigned = `${header}.${payload}`;
  const key = await hmacKey(env.AUTH_SESSION_SECRET);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, utf8(unsigned)));
  return `${unsigned}.${base64UrlEncodeBytes(signature)}`;
}

async function verifySessionToken(token, env) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  try {
    const key = await hmacKey(env.AUTH_SESSION_SECRET);
    const unsigned = `${parts[0]}.${parts[1]}`;
    const padded = parts[2].replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((parts[2].length + 3) % 4);
    const binary = atob(padded);
    const signature = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, signature, utf8(unsigned));
    if (!valid) return null;
    const payload = base64UrlDecodeJson(parts[1]);
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= now || !AUTH_ROLES.has(payload.role)) return null;
    return {
      username: normalizeUsername(payload.sub),
      name: boundedString(payload.name, 120),
      jobTitle: boundedString(payload.jobTitle, 120),
      role: payload.role,
      sessionVersion: Number(payload.ver || 1),
      active: true
    };
  } catch (_) {
    return null;
  }
}

function bearerToken(request) {
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function randomHex(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function hexBytes(hex) {
  const clean = String(hex || '').replace(/[^0-9a-f]/gi, '');
  const bytes = new Uint8Array(Math.floor(clean.length / 2));
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function passwordHash(password, saltHex) {
  const keyMaterial = await crypto.subtle.importKey('raw', utf8(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: hexBytes(saltHex),
    iterations: PBKDF2_ITERATIONS
  }, keyMaterial, 256);
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function passwordMatches(password, user) {
  if (!user?.passwordHash || !user?.passwordSalt) return false;
  const candidate = await passwordHash(password, user.passwordSalt);
  if (candidate.length !== user.passwordHash.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) diff |= candidate.charCodeAt(i) ^ user.passwordHash.charCodeAt(i);
  return diff === 0;
}

async function ensureAuthSchema(env) {
  if (!env.AUTH_DB) return false;
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS auth_users (
    username TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    job_title TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    must_change_password INTEGER NOT NULL DEFAULT 0,
    session_version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_auth_users_active ON auth_users(active, role)').run();
  return true;
}

function mapDbUser(row) {
  if (!row) return null;
  return {
    username: normalizeUsername(row.username),
    name: boundedString(row.name, 120),
    jobTitle: boundedString(row.job_title, 120),
    role: row.role,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    active: Number(row.active) === 1,
    mustChangePassword: Number(row.must_change_password) === 1,
    sessionVersion: Number(row.session_version || 1),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    source: 'database'
  };
}

async function getDbUser(env, username) {
  if (!env.AUTH_DB) return null;
  await ensureAuthSchema(env);
  const row = await env.AUTH_DB.prepare('SELECT * FROM auth_users WHERE username = ?').bind(normalizeUsername(username)).first();
  return mapDbUser(row);
}

async function createDbUser(env, input, createdBy = '') {
  await ensureAuthSchema(env);
  const salt = randomHex(16);
  const hash = await passwordHash(input.password, salt);
  await env.AUTH_DB.prepare(`INSERT INTO auth_users
    (username, name, job_title, role, password_hash, password_salt, active, must_change_password, session_version, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`)
    .bind(input.username, input.name, input.jobTitle || '', input.role, hash, salt, input.active === false ? 0 : 1, input.mustChangePassword ? 1 : 0, createdBy || null)
    .run();
  return getDbUser(env, input.username);
}

async function migrateBootstrapUser(env, bootstrap, password) {
  if (!env.AUTH_DB) return bootstrap;
  const existing = await getDbUser(env, bootstrap.username);
  if (existing) return existing;
  return createDbUser(env, {
    username: bootstrap.username,
    name: bootstrap.name,
    jobTitle: bootstrap.jobTitle || '',
    role: bootstrap.role,
    password,
    active: true,
    mustChangePassword: bootstrap.mustChangePassword
  }, 'bootstrap');
}

async function authenticateCredentials(env, username, password) {
  if (env.AUTH_DB) {
    const stored = await getDbUser(env, username);
    if (stored) {
      if (!stored.active || !(await passwordMatches(password, stored))) return null;
      return stored;
    }
  }
  const bootstrap = configuredUsers(env).find((user) => user.username === username && user.active);
  if (!bootstrap || bootstrap.password !== password) return null;
  return migrateBootstrapUser(env, bootstrap, password);
}

async function authenticatedUser(request, env, allowedRoles = []) {
  const tokenUser = await verifySessionToken(bearerToken(request), env);
  if (!tokenUser) return null;
  let current = tokenUser;
  if (env.AUTH_DB) {
    const stored = await getDbUser(env, tokenUser.username);
    if (stored) {
      if (!stored.active || Number(stored.sessionVersion) !== Number(tokenUser.sessionVersion || 1)) return null;
      current = stored;
    }
  }
  if (allowedRoles.length && current.role !== 'admin' && !allowedRoles.includes(current.role)) return null;
  return current;
}

async function requireAdmin(request, env) {
  return authenticatedUser(request, env, ['admin']);
}

function validateNewPassword(password) {
  if (String(password || '').length < PASSWORD_MIN_LENGTH) return `A nova senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  if (String(password).length > 160) return 'Senha muito longa.';
  return '';
}

async function changeOwnPassword(request, env, user, origin) {
  const body = await request.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  const validation = validateNewPassword(newPassword);
  if (validation) return jsonResponse({ error: validation }, 400, origin);
  if (!currentPassword) return jsonResponse({ error: 'Informe a senha atual.' }, 400, origin);
  if (currentPassword === newPassword) return jsonResponse({ error: 'A nova senha deve ser diferente da atual.' }, 400, origin);

  let stored = env.AUTH_DB ? await getDbUser(env, user.username) : null;
  if (!stored) {
    const bootstrap = configuredUsers(env).find((item) => item.username === user.username);
    if (!bootstrap || bootstrap.password !== currentPassword) return jsonResponse({ error: 'Senha atual incorreta.' }, 401, origin);
    stored = await migrateBootstrapUser(env, bootstrap, currentPassword);
  } else if (!(await passwordMatches(currentPassword, stored))) {
    return jsonResponse({ error: 'Senha atual incorreta.' }, 401, origin);
  }
  if (!env.AUTH_DB) return jsonResponse({ error: 'Banco de usuários ainda não disponível.' }, 503, origin);

  const salt = randomHex(16);
  const hash = await passwordHash(newPassword, salt);
  await env.AUTH_DB.prepare(`UPDATE auth_users
    SET password_hash = ?, password_salt = ?, must_change_password = 0, session_version = session_version + 1, updated_at = CURRENT_TIMESTAMP
    WHERE username = ?`)
    .bind(hash, salt, user.username).run();
  const updated = await getDbUser(env, user.username);
  const token = await createSessionToken(updated, env);
  return jsonResponse({ ok: true, token, user: publicUser(updated), expiresIn: SESSION_TTL_SECONDS }, 200, origin);
}

async function listUsers(env) {
  await ensureAuthSchema(env);
  const result = await env.AUTH_DB.prepare(`SELECT username, name, job_title, role, active, must_change_password, created_at, updated_at
    FROM auth_users ORDER BY active DESC, role, name`).all();
  const users = (result.results || []).map((row) => ({
    username: row.username,
    name: row.name,
    jobTitle: row.job_title || '',
    role: row.role,
    active: Number(row.active) === 1,
    mustChangePassword: Number(row.must_change_password) === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    managed: true
  }));
  const existing = new Set(users.map((user) => user.username));
  for (const bootstrap of configuredUsers(env)) {
    if (!existing.has(bootstrap.username)) users.unshift({ ...publicUser(bootstrap), managed: false, source: 'bootstrap' });
  }
  return users;
}

async function handleAdmin(request, env, url, origin) {
  const admin = await requireAdmin(request, env);
  if (!admin) return jsonResponse({ error: 'Acesso administrativo necessário.' }, 403, origin);
  if (!env.AUTH_DB) return jsonResponse({ error: 'Banco de usuários ainda não provisionado.' }, 503, origin);

  if (url.pathname === '/api/admin/users' && request.method === 'GET') {
    return jsonResponse({ users: await listUsers(env) }, 200, origin);
  }

  if (url.pathname === '/api/admin/users' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const username = normalizeUsername(body.username);
    const name = boundedString(body.name, 120);
    const jobTitle = boundedString(body.jobTitle, 120);
    const role = boundedString(body.role, 30);
    const password = String(body.password || '');
    if (!usernameValid(username)) return jsonResponse({ error: 'Usuário deve ter 3 a 40 caracteres e usar apenas letras minúsculas, números, ponto, hífen ou sublinhado.' }, 400, origin);
    if (name.length < 3) return jsonResponse({ error: 'Informe o nome da pessoa.' }, 400, origin);
    if (!AUTH_ROLES.has(role)) return jsonResponse({ error: 'Perfil de acesso inválido.' }, 400, origin);
    const validation = validateNewPassword(password);
    if (validation) return jsonResponse({ error: validation }, 400, origin);
    if (await getDbUser(env, username) || configuredUsers(env).some((item) => item.username === username)) {
      return jsonResponse({ error: 'Já existe uma conta com esse usuário.' }, 409, origin);
    }
    const created = await createDbUser(env, {
      username, name, jobTitle, role, password,
      active: body.active !== false,
      mustChangePassword: body.mustChangePassword !== false
    }, admin.username);
    return jsonResponse({ user: publicUser(created) }, 201, origin);
  }

  const match = url.pathname.match(/^\/api\/admin\/users\/([a-z0-9._-]+)(\/reset-password)?$/);
  if (!match) return jsonResponse({ error: 'Rota administrativa não encontrada.' }, 404, origin);
  const targetUsername = normalizeUsername(match[1]);
  const resetRoute = Boolean(match[2]);
  const target = await getDbUser(env, targetUsername);
  if (!target) return jsonResponse({ error: 'Usuário não encontrado ou ainda não migrado para a base gerenciável.' }, 404, origin);

  if (resetRoute && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const password = String(body.password || '');
    const validation = validateNewPassword(password);
    if (validation) return jsonResponse({ error: validation }, 400, origin);
    const salt = randomHex(16);
    const hash = await passwordHash(password, salt);
    await env.AUTH_DB.prepare(`UPDATE auth_users
      SET password_hash = ?, password_salt = ?, must_change_password = ?, session_version = session_version + 1, updated_at = CURRENT_TIMESTAMP
      WHERE username = ?`)
      .bind(hash, salt, body.mustChangePassword === false ? 0 : 1, targetUsername).run();
    return jsonResponse({ ok: true }, 200, origin);
  }

  if (!resetRoute && request.method === 'PATCH') {
    const body = await request.json().catch(() => ({}));
    const name = body.name === undefined ? target.name : boundedString(body.name, 120);
    const jobTitle = body.jobTitle === undefined ? target.jobTitle : boundedString(body.jobTitle, 120);
    const role = body.role === undefined ? target.role : boundedString(body.role, 30);
    const active = body.active === undefined ? target.active : Boolean(body.active);
    if (name.length < 3) return jsonResponse({ error: 'Informe o nome da pessoa.' }, 400, origin);
    if (!AUTH_ROLES.has(role)) return jsonResponse({ error: 'Perfil de acesso inválido.' }, 400, origin);
    if (targetUsername === admin.username && (!active || role !== 'admin')) {
      return jsonResponse({ error: 'Sua própria conta administrativa não pode ser desativada nem rebaixada por esta tela.' }, 400, origin);
    }
    await env.AUTH_DB.prepare(`UPDATE auth_users SET name = ?, job_title = ?, role = ?, active = ?,
      session_version = CASE WHEN role <> ? OR active <> ? THEN session_version + 1 ELSE session_version END,
      updated_at = CURRENT_TIMESTAMP WHERE username = ?`)
      .bind(name, jobTitle, role, active ? 1 : 0, role, active ? 1 : 0, targetUsername).run();
    const updated = await getDbUser(env, targetUsername);
    return jsonResponse({ user: publicUser(updated) }, 200, origin);
  }

  return jsonResponse({ error: 'Método não permitido.' }, 405, origin);
}

export function isPortalApi(pathname) {
  return pathname.startsWith('/api/auth/') || pathname.startsWith('/api/admin/');
}

export async function validatePortalSession(request, env, allowedRoles = []) {
  return authenticatedUser(request, env, allowedRoles);
}

export async function handlePortalRoute(request, env, origin, originAllowed = true) {
  if (!originAllowed) return jsonResponse({ error: 'Origem não autorizada.' }, 403, origin, false);
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin'
      }
    });
  }

  if (url.pathname.startsWith('/api/admin/')) return handleAdmin(request, env, url, origin);

  if (url.pathname === '/api/auth/status' && request.method === 'GET') {
    const dbReady = Boolean(env.AUTH_DB);
    return jsonResponse({ configured: Boolean(env.AUTH_SESSION_SECRET && (env.AUTH_USERS_JSON || dbReady)), database: dbReady }, 200, origin);
  }

  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    if (!env.AUTH_SESSION_SECRET || (!env.AUTH_USERS_JSON && !env.AUTH_DB)) {
      return jsonResponse({ error: 'Autenticação ainda não configurada no servidor.' }, 503, origin);
    }
    const body = await request.json().catch(() => ({}));
    const username = normalizeUsername(body.username);
    const password = String(body.password || '').slice(0, 160);
    if (!username || !password) return jsonResponse({ error: 'Informe usuário e senha.' }, 400, origin);
    const user = await authenticateCredentials(env, username, password);
    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return jsonResponse({ error: 'Usuário ou senha inválidos.' }, 401, origin);
    }
    const token = await createSessionToken(user, env);
    return jsonResponse({ token, user: publicUser(user), expiresIn: SESSION_TTL_SECONDS }, 200, origin);
  }

  if (url.pathname === '/api/auth/me' && request.method === 'GET') {
    const user = await authenticatedUser(request, env);
    return user ? jsonResponse({ user: publicUser(user) }, 200, origin) : jsonResponse({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  }

  if (url.pathname === '/api/auth/change-password' && request.method === 'POST') {
    const user = await authenticatedUser(request, env);
    if (!user) return jsonResponse({ error: 'Sessão inválida ou expirada.' }, 401, origin);
    return changeOwnPassword(request, env, user, origin);
  }

  if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
    return jsonResponse({ ok: true }, 200, origin);
  }

  return jsonResponse({ error: 'Rota de autenticação não encontrada.' }, 404, origin);
}
