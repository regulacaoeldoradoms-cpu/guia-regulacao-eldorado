'use strict';

import {
  handlePortalRoute as handleBasePortalRoute,
  isPortalApi as isBasePortalApi,
  validatePortalSession as validateBasePortalSession
} from './auth-management-fixed.js';

const AUTH_ROLES = new Set(['medico', 'recepcao', 'admin']);
const PBKDF2_ITERATIONS = 100000;
const SESSION_TTL_SECONDS = 8 * 60 * 60;

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

function usernameValid(value) {
  return /^[a-z0-9._-]{3,40}$/.test(value);
}

function validatePassword(value) {
  const password = String(value ?? '');
  if (!password.length) return 'Informe uma senha.';
  if (password.length > 160) return 'A senha pode ter no máximo 160 caracteres.';
  return '';
}

function configuredUsers(env) {
  if (!env.AUTH_USERS_JSON) return [];
  let parsed;
  try { parsed = JSON.parse(env.AUTH_USERS_JSON); }
  catch (_) { return []; }
  if (!Array.isArray(parsed)) return [];
  return parsed.map((user) => ({
    username: normalizeUsername(user.username),
    password: String(user.password ?? ''),
    name: String(user.name || user.username || '').slice(0, 120),
    jobTitle: String(user.jobTitle || '').slice(0, 120),
    role: AUTH_ROLES.has(user.role) ? user.role : '',
    active: user.active !== false,
    mustChangePassword: Boolean(user.mustChangePassword)
  })).filter((user) => user.username && user.password && user.role);
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

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', utf8(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
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
  if (!user?.password_hash || !user?.password_salt) return false;
  const candidate = await passwordHash(password, user.password_salt);
  if (candidate.length !== user.password_hash.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) diff |= candidate.charCodeAt(i) ^ user.password_hash.charCodeAt(i);
  return diff === 0;
}

async function ensureSchema(env) {
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
  return true;
}

async function dbUser(env, username) {
  if (!env.AUTH_DB) return null;
  await ensureSchema(env);
  return env.AUTH_DB.prepare('SELECT * FROM auth_users WHERE username = ?').bind(normalizeUsername(username)).first();
}

function publicDbUser(row) {
  return {
    username: row.username,
    name: row.name,
    jobTitle: row.job_title || '',
    role: row.role,
    active: Number(row.active) === 1,
    mustChangePassword: Number(row.must_change_password) === 1,
    sessionVersion: Number(row.session_version || 1)
  };
}

async function createStoredUser(env, input, createdBy = '') {
  const salt = randomHex(16);
  const hash = await passwordHash(input.password, salt);
  await env.AUTH_DB.prepare(`INSERT INTO auth_users
    (username, name, job_title, role, password_hash, password_salt, active, must_change_password, session_version, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`)
    .bind(
      input.username,
      input.name,
      input.jobTitle || '',
      input.role,
      hash,
      salt,
      input.active === false ? 0 : 1,
      input.mustChangePassword ? 1 : 0,
      createdBy || null
    ).run();
  return dbUser(env, input.username);
}

async function normalizedLogin(request, env, origin, originAllowed) {
  const body = await request.clone().json().catch(() => ({}));
  const forwarded = new Request(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify({ ...body, username: normalizeUsername(body.username) })
  });
  return handleBasePortalRoute(forwarded, env, origin, originAllowed);
}

async function createUser(request, env, origin) {
  const admin = await validateBasePortalSession(request, env, ['admin']);
  if (!admin) return jsonResponse({ error: 'Acesso administrativo necessário.' }, 403, origin);
  if (!env.AUTH_DB) return jsonResponse({ error: 'Banco de usuários ainda não disponível.' }, 503, origin);

  const body = await request.json().catch(() => ({}));
  const username = normalizeUsername(body.username);
  const name = String(body.name || '').trim().slice(0, 120);
  const jobTitle = String(body.jobTitle || '').trim().slice(0, 120);
  const role = String(body.role || '').trim();
  const password = String(body.password ?? '');
  const passwordError = validatePassword(password);

  if (!usernameValid(username)) return jsonResponse({ error: 'Informe um usuário com pelo menos 3 caracteres.' }, 400, origin);
  if (name.length < 3) return jsonResponse({ error: 'Informe o nome da pessoa.' }, 400, origin);
  if (!AUTH_ROLES.has(role)) return jsonResponse({ error: 'Perfil de acesso inválido.' }, 400, origin);
  if (passwordError) return jsonResponse({ error: passwordError }, 400, origin);

  const bootstrapExists = configuredUsers(env).some((user) => user.username === username);
  if (await dbUser(env, username) || bootstrapExists) {
    return jsonResponse({ error: 'Já existe uma conta com esse usuário.' }, 409, origin);
  }

  const created = await createStoredUser(env, {
    username,
    name,
    jobTitle,
    role,
    password,
    active: body.active !== false,
    mustChangePassword: body.mustChangePassword !== false
  }, admin.username);

  return jsonResponse({ user: publicDbUser(created) }, 201, origin);
}

async function resetPassword(request, env, url, origin) {
  const admin = await validateBasePortalSession(request, env, ['admin']);
  if (!admin) return jsonResponse({ error: 'Acesso administrativo necessário.' }, 403, origin);
  if (!env.AUTH_DB) return jsonResponse({ error: 'Banco de usuários ainda não disponível.' }, 503, origin);

  const match = url.pathname.match(/^\/api\/admin\/users\/([a-z0-9._-]+)\/reset-password$/);
  if (!match) return null;
  const username = normalizeUsername(match[1]);
  const target = await dbUser(env, username);
  if (!target) return jsonResponse({ error: 'Usuário não encontrado.' }, 404, origin);

  const body = await request.json().catch(() => ({}));
  const password = String(body.password ?? '');
  const passwordError = validatePassword(password);
  if (passwordError) return jsonResponse({ error: passwordError }, 400, origin);

  const salt = randomHex(16);
  const hash = await passwordHash(password, salt);
  await env.AUTH_DB.prepare(`UPDATE auth_users
    SET password_hash = ?, password_salt = ?, must_change_password = ?, session_version = session_version + 1, updated_at = CURRENT_TIMESTAMP
    WHERE username = ?`)
    .bind(hash, salt, body.mustChangePassword === false ? 0 : 1, username).run();
  return jsonResponse({ ok: true }, 200, origin);
}

async function changeOwnPassword(request, env, origin) {
  const user = await validateBasePortalSession(request, env, []);
  if (!user) return jsonResponse({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  if (!env.AUTH_DB) return jsonResponse({ error: 'Banco de usuários ainda não disponível.' }, 503, origin);

  const body = await request.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword ?? '');
  const newPassword = String(body.newPassword ?? '');
  const passwordError = validatePassword(newPassword);
  if (passwordError) return jsonResponse({ error: passwordError }, 400, origin);
  if (!currentPassword.length) return jsonResponse({ error: 'Informe a senha atual.' }, 400, origin);
  if (currentPassword === newPassword) return jsonResponse({ error: 'A nova senha deve ser diferente da atual.' }, 400, origin);

  let stored = await dbUser(env, user.username);
  if (stored) {
    if (!(await passwordMatches(currentPassword, stored))) {
      return jsonResponse({ error: 'Senha atual incorreta.' }, 401, origin);
    }
    const salt = randomHex(16);
    const hash = await passwordHash(newPassword, salt);
    await env.AUTH_DB.prepare(`UPDATE auth_users
      SET password_hash = ?, password_salt = ?, must_change_password = 0, session_version = session_version + 1, updated_at = CURRENT_TIMESTAMP
      WHERE username = ?`)
      .bind(hash, salt, user.username).run();
  } else {
    const bootstrap = configuredUsers(env).find((item) => item.username === user.username && item.password === currentPassword && item.active);
    if (!bootstrap) return jsonResponse({ error: 'Senha atual incorreta.' }, 401, origin);
    stored = await createStoredUser(env, {
      username: bootstrap.username,
      name: bootstrap.name,
      jobTitle: bootstrap.jobTitle,
      role: bootstrap.role,
      password: newPassword,
      active: true,
      mustChangePassword: false
    }, 'bootstrap');
  }

  const updated = await dbUser(env, user.username);
  const publicUser = publicDbUser(updated);
  const token = await createSessionToken(publicUser, env);
  return jsonResponse({ ok: true, token, user: publicUser, expiresIn: SESSION_TTL_SECONDS }, 200, origin);
}

export function isPortalApi(pathname) {
  return isBasePortalApi(pathname);
}

export async function validatePortalSession(request, env, allowedRoles = []) {
  return validateBasePortalSession(request, env, allowedRoles);
}

export async function handlePortalRoute(request, env, origin, originAllowed = true) {
  const url = new URL(request.url);

  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    return normalizedLogin(request, env, origin, originAllowed);
  }
  if (url.pathname === '/api/auth/change-password' && request.method === 'POST') {
    return changeOwnPassword(request, env, origin);
  }
  if (url.pathname === '/api/admin/users' && request.method === 'POST') {
    return createUser(request, env, origin);
  }
  if (/^\/api\/admin\/users\/[a-z0-9._-]+\/reset-password$/.test(url.pathname) && request.method === 'POST') {
    return resetPassword(request, env, url, origin);
  }

  return handleBasePortalRoute(request, env, origin, originAllowed);
}
