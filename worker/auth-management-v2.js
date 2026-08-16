'use strict';

import {
  firebaseConfigured,
  ensureFirebaseEmailIdentity,
  sendFirebaseVerificationEmail,
  firebaseEmailStatus
} from './firebase-gateway.js';

const AUTH_ROLES = new Set(['medico', 'recepcao', 'coordenacao', 'cidadao', 'admin']);
const COUNCIL_ROLES = new Set(['', 'membro', 'presidente']);
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const PASSWORD_MIN_LENGTH = 8;
const PBKDF2_ITERATIONS = 100000;
const SELF_REGISTER_LIMIT_PER_DAY = 5;

function responseHeaders(origin, allowed = true) {
  const headers = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return headers;
}

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...responseHeaders(origin, allowed), 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const headers = responseHeaders(origin, true);
  headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  headers['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers });
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

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 254);
}

function emailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function bounded(value, max = 120) {
  return String(value || '').trim().slice(0, max);
}

function validatePassword(value) {
  const password = String(value || '');
  if (password.length < PASSWORD_MIN_LENGTH) return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  if (password.length > 160) return 'A senha pode ter no máximo 160 caracteres.';
  return '';
}

function roleCanAccess(role, allowedRoles = []) {
  if (!allowedRoles.length) return true;
  if (role === 'admin') return true;
  if (allowedRoles.includes(role)) return true;
  if (role === 'coordenacao' && allowedRoles.some((item) => item === 'medico' || item === 'recepcao')) return true;
  return false;
}

function assignableRoles(actorRole) {
  if (actorRole === 'admin') return new Set(['coordenacao', 'medico', 'recepcao', 'cidadao']);
  if (actorRole === 'coordenacao') return new Set(['medico', 'recepcao']);
  return new Set();
}

function canManageTarget(actor, target) {
  if (!actor || !target) return false;
  if (actor.role === 'admin') return target.role !== 'admin' || target.username === actor.username;
  return actor.role === 'coordenacao' && ['medico', 'recepcao'].includes(target.role);
}

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

function decodeJson(value) {
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
  const header = base64UrlJson({ alg: 'HS256', typ: 'JWT' });
  const payload = base64UrlJson({
    sub: user.username,
    role: user.role,
    councilRole: user.councilRole || '',
    ver: Number(user.sessionVersion || 1),
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  });
  const unsigned = `${header}.${payload}`;
  const key = await hmacKey(env.AUTH_SESSION_SECRET);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, utf8(unsigned)));
  return `${unsigned}.${base64UrlBytes(signature)}`;
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
    const payload = decodeJson(parts[1]);
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= now || !AUTH_ROLES.has(payload.role)) return null;
    return {
      username: normalizeUsername(payload.sub),
      role: payload.role,
      councilRole: COUNCIL_ROLES.has(payload.councilRole) ? payload.councilRole : '',
      sessionVersion: Number(payload.ver || 1)
    };
  } catch (_) {
    return null;
  }
}

function bearerToken(request) {
  const match = String(request.headers.get('Authorization') || '').match(/^Bearer\s+(.+)$/i);
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
  const material = await crypto.subtle.importKey('raw', utf8(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2', hash: 'SHA-256', salt: hexBytes(saltHex), iterations: PBKDF2_ITERATIONS
  }, material, 256);
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

async function ensureColumn(env, name, sqlType) {
  const columns = await env.AUTH_DB.prepare('PRAGMA table_info(auth_users)').all();
  const names = new Set((columns.results || []).map((item) => String(item.name || '')));
  if (!names.has(name)) await env.AUTH_DB.prepare(`ALTER TABLE auth_users ADD COLUMN ${name} ${sqlType}`).run();
}

export async function ensureAuthSchema(env) {
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
  await ensureColumn(env, 'council_role', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn(env, 'email', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn(env, 'email_verified', 'INTEGER NOT NULL DEFAULT 0');
  await ensureColumn(env, 'firebase_uid', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn(env, 'accept_friend_requests', 'INTEGER NOT NULL DEFAULT 0');
  await ensureColumn(env, 'self_registered', 'INTEGER NOT NULL DEFAULT 0');
  await ensureColumn(env, 'avatar_data', "TEXT NOT NULL DEFAULT ''");
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_auth_users_active_role ON auth_users(active, role)').run();
  await env.AUTH_DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email) WHERE email <> ''").run();
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS auth_registration_limits (
    actor_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_auth_registration_limits ON auth_registration_limits(actor_hash, created_at)').run();
  return true;
}

function mapDbUser(row) {
  if (!row) return null;
  return {
    username: row.username,
    name: row.name,
    jobTitle: row.job_title || '',
    role: AUTH_ROLES.has(row.role) ? row.role : '',
    councilRole: COUNCIL_ROLES.has(row.council_role) ? row.council_role : '',
    email: row.email || '',
    emailVerified: Number(row.email_verified) === 1,
    firebaseUid: row.firebase_uid || '',
    acceptFriendRequests: Number(row.accept_friend_requests) === 1,
    selfRegistered: Number(row.self_registered) === 1,
    active: Number(row.active) === 1,
    mustChangePassword: Number(row.must_change_password) === 1,
    sessionVersion: Number(row.session_version || 1),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    source: 'database'
  };
}

function publicUser(user, options = {}) {
  const result = {
    username: user.username,
    name: user.name || user.username,
    jobTitle: user.jobTitle || '',
    role: user.role,
    councilRole: user.councilRole || '',
    active: user.active !== false,
    mustChangePassword: Boolean(user.mustChangePassword),
    emailConfigured: Boolean(user.email),
    emailVerified: Boolean(user.emailVerified),
    privacyMode: user.email ? 'sigilosa' : 'anonima',
    acceptFriendRequests: Boolean(user.acceptFriendRequests),
    selfRegistered: Boolean(user.selfRegistered)
  };
  if (options.includeEmail) result.email = user.email || '';
  return result;
}

function configuredUsers(env) {
  if (!env.AUTH_USERS_JSON) return [];
  let parsed;
  try { parsed = JSON.parse(env.AUTH_USERS_JSON); }
  catch (_) { return []; }
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item) => ({
    username: normalizeUsername(item.username),
    password: String(item.password || ''),
    name: bounded(item.name || item.username),
    jobTitle: bounded(item.jobTitle),
    role: AUTH_ROLES.has(item.role) ? item.role : '',
    councilRole: COUNCIL_ROLES.has(item.councilRole) ? item.councilRole : '',
    active: item.active !== false,
    mustChangePassword: Boolean(item.mustChangePassword),
    email: normalizeEmail(item.email),
    emailVerified: Boolean(item.emailVerified),
    acceptFriendRequests: Boolean(item.acceptFriendRequests),
    selfRegistered: false,
    sessionVersion: 1,
    source: 'bootstrap'
  })).filter((item) => item.username && item.password && item.role && item.active);
}

async function getDbUser(env, username) {
  if (!(await ensureAuthSchema(env))) return null;
  const row = await env.AUTH_DB.prepare('SELECT * FROM auth_users WHERE username = ?').bind(normalizeUsername(username)).first();
  return mapDbUser(row);
}

async function createDbUser(env, input, createdBy) {
  const salt = randomHex(16);
  const hash = await passwordHash(input.password, salt);
  await env.AUTH_DB.prepare(`INSERT INTO auth_users
    (username, name, job_title, role, council_role, email, email_verified, firebase_uid,
     accept_friend_requests, self_registered, password_hash, password_salt, active,
     must_change_password, session_version, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`)
    .bind(
      input.username,
      input.name || input.username,
      input.jobTitle || '',
      input.role,
      input.councilRole || '',
      input.email || '',
      input.emailVerified ? 1 : 0,
      input.firebaseUid || '',
      input.acceptFriendRequests ? 1 : 0,
      input.selfRegistered ? 1 : 0,
      hash,
      salt,
      input.active === false ? 0 : 1,
      input.mustChangePassword ? 1 : 0,
      createdBy || null
    ).run();
  return getDbUser(env, input.username);
}

async function migrateBootstrap(env, bootstrap, password) {
  const existing = await getDbUser(env, bootstrap.username);
  if (existing) return existing;
  return createDbUser(env, { ...bootstrap, password }, 'bootstrap');
}

async function authenticate(env, username, password) {
  const stored = await getDbUser(env, username);
  if (stored) {
    if (!stored.active || !(await passwordMatches(password, stored))) return null;
    return stored;
  }
  const bootstrap = configuredUsers(env).find((item) => item.username === username && item.active && item.password === password);
  if (!bootstrap) return null;
  return migrateBootstrap(env, bootstrap, password);
}

export async function validatePortalSession(request, env, allowedRoles = []) {
  const tokenUser = await verifySessionToken(bearerToken(request), env);
  if (!tokenUser || !env.AUTH_DB) return null;
  const current = await getDbUser(env, tokenUser.username);
  if (!current || !current.active || Number(current.sessionVersion) !== Number(tokenUser.sessionVersion)) return null;
  if (!roleCanAccess(current.role, allowedRoles)) return null;
  return current;
}

async function login(request, env, origin) {
  if (!env.AUTH_DB) return json({ error: 'Banco de usuários ainda não disponível.' }, 503, origin);
  const body = await request.json().catch(() => ({}));
  const username = normalizeUsername(body.username);
  const password = String(body.password || '');
  const user = await authenticate(env, username, password);
  if (!user) return json({ error: 'Usuário ou senha inválidos.' }, 401, origin);

  const requireProfessionalEmail = String(env.AUTH_REQUIRE_EMAIL_VERIFICATION || '').toLowerCase() === 'true';
  if (requireProfessionalEmail && ['medico', 'recepcao', 'coordenacao', 'admin'].includes(user.role) && !user.emailVerified) {
    return json({ error: 'Confirme o e-mail de segurança da sua conta antes de continuar.', code: 'EMAIL_VERIFICATION_REQUIRED' }, 403, origin);
  }

  const token = await createSessionToken(user, env);
  return json({ token, user: publicUser(user), expiresIn: SESSION_TTL_SECONDS }, 200, origin);
}

async function me(request, env, origin) {
  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  return json({ user: publicUser(user) }, 200, origin);
}

async function changePassword(request, env, origin) {
  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  const body = await request.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  const validation = validatePassword(newPassword);
  if (validation) return json({ error: validation }, 400, origin);
  if (!(await passwordMatches(currentPassword, user))) return json({ error: 'Senha atual incorreta.' }, 401, origin);
  if (currentPassword === newPassword) return json({ error: 'A nova senha deve ser diferente da atual.' }, 400, origin);

  const salt = randomHex(16);
  const hash = await passwordHash(newPassword, salt);
  await env.AUTH_DB.prepare(`UPDATE auth_users SET password_hash = ?, password_salt = ?,
    must_change_password = 0, session_version = session_version + 1, updated_at = CURRENT_TIMESTAMP
    WHERE username = ?`).bind(hash, salt, user.username).run();
  const updated = await getDbUser(env, user.username);
  const token = await createSessionToken(updated, env);
  return json({ ok: true, token, user: publicUser(updated), expiresIn: SESSION_TTL_SECONDS }, 200, origin);
}

async function hashActor(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const secret = env.AUTH_RATE_LIMIT_SECRET || env.AUTH_SESSION_SECRET || 'portal';
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', utf8(`${secret}|${ip}`)));
  return base64UrlBytes(digest);
}

async function enforceRegistrationLimit(request, env) {
  const actor = await hashActor(request, env);
  await env.AUTH_DB.prepare("DELETE FROM auth_registration_limits WHERE created_at < datetime('now', '-2 days')").run();
  const row = await env.AUTH_DB.prepare("SELECT COUNT(*) AS total FROM auth_registration_limits WHERE actor_hash = ? AND created_at >= datetime('now', '-1 day')")
    .bind(actor).first();
  if (Number(row?.total || 0) >= SELF_REGISTER_LIMIT_PER_DAY) return false;
  await env.AUTH_DB.prepare('INSERT INTO auth_registration_limits(actor_hash) VALUES (?)').bind(actor).run();
  return true;
}

async function registerCitizen(request, env, origin) {
  if (!env.AUTH_DB) return json({ error: 'Banco de usuários ainda não disponível.' }, 503, origin);
  await ensureAuthSchema(env);
  if (!(await enforceRegistrationLimit(request, env))) {
    return json({ error: 'Muitas contas foram criadas recentemente desta conexão. Tente novamente mais tarde.' }, 429, origin);
  }
  const body = await request.json().catch(() => ({}));
  const username = normalizeUsername(body.username);
  const password = String(body.password || '');
  const validation = validatePassword(password);
  if (!usernameValid(username)) return json({ error: 'O usuário deve ter entre 3 e 40 caracteres.' }, 400, origin);
  if (validation) return json({ error: validation }, 400, origin);
  if (await getDbUser(env, username) || configuredUsers(env).some((item) => item.username === username)) {
    return json({ error: 'Este nome de usuário já está em uso.' }, 409, origin);
  }
  const displayName = bounded(body.displayName || username, 60) || username;
  const created = await createDbUser(env, {
    username,
    name: displayName,
    jobTitle: 'Cidadão',
    role: 'cidadao',
    councilRole: '',
    password,
    active: true,
    mustChangePassword: false,
    selfRegistered: true,
    acceptFriendRequests: false
  }, 'self');
  const token = await createSessionToken(created, env);
  return json({ token, user: publicUser(created), expiresIn: SESSION_TTL_SECONDS }, 201, origin);
}

async function securityGet(request, env, origin) {
  let user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  if (user.email && firebaseConfigured(env)) {
    try {
      const status = await firebaseEmailStatus(env, user.email);
      if (status && status.emailVerified !== user.emailVerified) {
        await env.AUTH_DB.prepare('UPDATE auth_users SET email_verified = ?, firebase_uid = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?')
          .bind(status.emailVerified ? 1 : 0, status.localId || user.firebaseUid || '', user.username).run();
        user = await getDbUser(env, user.username);
      }
    } catch (_) {}
  }
  return json({
    security: {
      email: user.email || '',
      emailVerified: Boolean(user.emailVerified),
      privacyMode: user.email ? 'sigilosa' : 'anonima',
      acceptFriendRequests: Boolean(user.acceptFriendRequests),
      firebaseReady: firebaseConfigured(env)
    }
  }, 200, origin);
}

async function securityPatch(request, env, origin) {
  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  const body = await request.json().catch(() => ({}));
  const updates = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(body, 'acceptFriendRequests')) {
    updates.push('accept_friend_requests = ?');
    values.push(body.acceptFriendRequests ? 1 : 0);
  }

  if (Object.prototype.hasOwnProperty.call(body, 'email')) {
    const email = normalizeEmail(body.email);
    if (email && !emailValid(email)) return json({ error: 'Informe um e-mail válido.' }, 400, origin);
    if (email !== user.email) {
      updates.push('email = ?', 'email_verified = 0', "firebase_uid = ''");
      values.push(email);
    }
  }

  if (!updates.length) return securityGet(request, env, origin);
  values.push(user.username);
  try {
    await env.AUTH_DB.prepare(`UPDATE auth_users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE username = ?`).bind(...values).run();
  } catch (error) {
    if (/unique/i.test(String(error?.message || ''))) return json({ error: 'Este e-mail já está vinculado a outra conta.' }, 409, origin);
    throw error;
  }
  return securityGet(request, env, origin);
}

async function sendEmailVerification(request, env, origin) {
  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  if (!user.email) return json({ error: 'Adicione um e-mail antes de solicitar a verificação.' }, 400, origin);
  if (!firebaseConfigured(env) || !env.FIREBASE_WEB_API_KEY) {
    return json({ error: 'A verificação por e-mail está preparada, mas o Firebase ainda precisa ser conectado pelo desenvolvedor.', code: 'FIREBASE_PENDING' }, 503, origin);
  }
  const identity = await ensureFirebaseEmailIdentity(env, user.username, user.email);
  await env.AUTH_DB.prepare('UPDATE auth_users SET firebase_uid = ?, email_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?')
    .bind(identity.localId || '', identity.emailVerified ? 1 : 0, user.username).run();
  if (!identity.emailVerified) await sendFirebaseVerificationEmail(env, user.email);
  return json({ ok: true, alreadyVerified: Boolean(identity.emailVerified), message: identity.emailVerified ? 'E-mail já confirmado.' : 'E-mail de verificação enviado.' }, 200, origin);
}

async function listUsers(request, env, origin) {
  const actor = await validatePortalSession(request, env, ['coordenacao']);
  if (!actor || !['admin', 'coordenacao'].includes(actor.role)) return json({ error: 'Acesso de coordenação necessário.' }, 403, origin);
  await ensureAuthSchema(env);
  const result = await env.AUTH_DB.prepare(`SELECT username, name, job_title, role, council_role, active,
      must_change_password, email, email_verified, self_registered, created_at, updated_at
    FROM auth_users ORDER BY active DESC, role, lower(name)`).all();
  let users = (result.results || []).map((row) => ({
    username: row.username,
    name: row.name,
    jobTitle: row.job_title || '',
    role: row.role,
    councilRole: row.council_role || '',
    active: Number(row.active) === 1,
    mustChangePassword: Number(row.must_change_password) === 1,
    emailConfigured: Boolean(row.email),
    emailVerified: Number(row.email_verified) === 1,
    selfRegistered: Number(row.self_registered) === 1,
    managed: true,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
  if (actor.role === 'coordenacao') users = users.filter((item) => ['medico', 'recepcao'].includes(item.role));
  return json({ users, actor: { role: actor.role, assignableRoles: [...assignableRoles(actor.role)] } }, 200, origin);
}

async function createManagedUser(request, env, origin) {
  const actor = await validatePortalSession(request, env, ['coordenacao']);
  if (!actor || !['admin', 'coordenacao'].includes(actor.role)) return json({ error: 'Acesso de coordenação necessário.' }, 403, origin);
  const body = await request.json().catch(() => ({}));
  const username = normalizeUsername(body.username);
  const name = bounded(body.name);
  const jobTitle = bounded(body.jobTitle);
  const role = bounded(body.role, 30);
  const password = String(body.password || '');
  const validation = validatePassword(password);
  if (!usernameValid(username)) return json({ error: 'Informe um usuário válido com 3 a 40 caracteres.' }, 400, origin);
  if (name.length < 3) return json({ error: 'Informe o nome da pessoa.' }, 400, origin);
  if (!assignableRoles(actor.role).has(role)) return json({ error: 'Você não pode conceder este perfil de acesso.' }, 403, origin);
  if (validation) return json({ error: validation }, 400, origin);
  if (await getDbUser(env, username) || configuredUsers(env).some((item) => item.username === username)) return json({ error: 'Já existe uma conta com esse usuário.' }, 409, origin);
  const councilRole = actor.role === 'admin' && COUNCIL_ROLES.has(body.councilRole) ? body.councilRole : '';
  const created = await createDbUser(env, {
    username, name, jobTitle, role, councilRole, password,
    active: body.active !== false,
    mustChangePassword: body.mustChangePassword !== false,
    selfRegistered: false
  }, actor.username);
  return json({ user: publicUser(created) }, 201, origin);
}

async function updateManagedUser(request, env, url, origin) {
  const actor = await validatePortalSession(request, env, ['coordenacao']);
  if (!actor || !['admin', 'coordenacao'].includes(actor.role)) return json({ error: 'Acesso de coordenação necessário.' }, 403, origin);
  const match = url.pathname.match(/^\/api\/admin\/users\/([a-z0-9._-]+)$/);
  if (!match) return null;
  const target = await getDbUser(env, match[1]);
  if (!target) return json({ error: 'Usuário não encontrado.' }, 404, origin);
  if (!canManageTarget(actor, target)) return json({ error: 'Você não pode gerenciar esta conta.' }, 403, origin);
  const body = await request.json().catch(() => ({}));
  const fields = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(body, 'name')) {
    const name = bounded(body.name);
    if (name.length < 3) return json({ error: 'Informe o nome da pessoa.' }, 400, origin);
    fields.push('name = ?'); values.push(name);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'jobTitle')) {
    fields.push('job_title = ?'); values.push(bounded(body.jobTitle));
  }
  if (Object.prototype.hasOwnProperty.call(body, 'active')) {
    fields.push('active = ?'); values.push(body.active ? 1 : 0);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'role') && body.role !== target.role) {
    const nextRole = bounded(body.role, 30);
    if (!assignableRoles(actor.role).has(nextRole)) return json({ error: 'Você não pode conceder este perfil de acesso.' }, 403, origin);
    fields.push('role = ?'); values.push(nextRole);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'councilRole')) {
    if (actor.role !== 'admin') return json({ error: 'Somente o Desenvolvedor pode atribuir funções do Conselho.' }, 403, origin);
    const councilRole = bounded(body.councilRole, 30);
    if (!COUNCIL_ROLES.has(councilRole)) return json({ error: 'Função do Conselho inválida.' }, 400, origin);
    fields.push('council_role = ?'); values.push(councilRole);
  }
  if (!fields.length) return json({ user: publicUser(target) }, 200, origin);
  fields.push('session_version = session_version + 1', 'updated_at = CURRENT_TIMESTAMP');
  values.push(target.username);
  await env.AUTH_DB.prepare(`UPDATE auth_users SET ${fields.join(', ')} WHERE username = ?`).bind(...values).run();
  return json({ user: publicUser(await getDbUser(env, target.username)) }, 200, origin);
}

async function resetManagedPassword(request, env, url, origin) {
  const actor = await validatePortalSession(request, env, ['coordenacao']);
  if (!actor || !['admin', 'coordenacao'].includes(actor.role)) return json({ error: 'Acesso de coordenação necessário.' }, 403, origin);
  const match = url.pathname.match(/^\/api\/admin\/users\/([a-z0-9._-]+)\/reset-password$/);
  if (!match) return null;
  const target = await getDbUser(env, match[1]);
  if (!target) return json({ error: 'Usuário não encontrado.' }, 404, origin);
  if (!canManageTarget(actor, target)) return json({ error: 'Você não pode gerenciar esta conta.' }, 403, origin);
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || '');
  const validation = validatePassword(password);
  if (validation) return json({ error: validation }, 400, origin);
  const salt = randomHex(16);
  const hash = await passwordHash(password, salt);
  await env.AUTH_DB.prepare(`UPDATE auth_users SET password_hash = ?, password_salt = ?, must_change_password = ?,
    session_version = session_version + 1, updated_at = CURRENT_TIMESTAMP WHERE username = ?`)
    .bind(hash, salt, body.mustChangePassword === false ? 0 : 1, target.username).run();
  return json({ ok: true }, 200, origin);
}

export function isPortalApi(pathname) {
  const path = String(pathname || '');
  return path.startsWith('/api/auth/') || path.startsWith('/api/admin/users');
}

export async function handlePortalRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const url = new URL(request.url);

  if (url.pathname === '/api/auth/login' && request.method === 'POST') return login(request, env, origin);
  if (url.pathname === '/api/auth/logout' && request.method === 'POST') return json({ ok: true }, 200, origin);
  if (url.pathname === '/api/auth/me' && request.method === 'GET') return me(request, env, origin);
  if (url.pathname === '/api/auth/register' && request.method === 'POST') return registerCitizen(request, env, origin);
  if (url.pathname === '/api/auth/change-password' && request.method === 'POST') return changePassword(request, env, origin);
  if (url.pathname === '/api/auth/security' && request.method === 'GET') return securityGet(request, env, origin);
  if (url.pathname === '/api/auth/security' && request.method === 'PATCH') return securityPatch(request, env, origin);
  if (url.pathname === '/api/auth/email/send-verification' && request.method === 'POST') return sendEmailVerification(request, env, origin);

  if (url.pathname === '/api/admin/users' && request.method === 'GET') return listUsers(request, env, origin);
  if (url.pathname === '/api/admin/users' && request.method === 'POST') return createManagedUser(request, env, origin);
  if (/^\/api\/admin\/users\/[a-z0-9._-]+$/.test(url.pathname) && request.method === 'PATCH') return updateManagedUser(request, env, url, origin);
  if (/^\/api\/admin\/users\/[a-z0-9._-]+\/reset-password$/.test(url.pathname) && request.method === 'POST') return resetManagedPassword(request, env, url, origin);

  return json({ error: 'Rota de autenticação não encontrada.' }, 404, origin);
}
