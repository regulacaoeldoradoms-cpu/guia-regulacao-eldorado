'use strict';

const TELEMEDICINE_ROLE = 'telemedicina';
const UNDERLYING_ROLE = 'recepcao';
const DEFAULT_JOB_TITLE = 'Técnico em Telemedicina';

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

export async function ensureTelemedicineAccessSchema(env) {
  if (!env.AUTH_DB) return false;
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS auth_telemedicine_access (
    username TEXT PRIMARY KEY,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_auth_telemedicine_enabled ON auth_telemedicine_access(enabled, username)').run();
  return true;
}

export async function telemedicineAccessFor(env, username) {
  if (!(await ensureTelemedicineAccessSchema(env))) return false;
  const normalized = normalizeUsername(username);
  if (!normalized) return false;
  const row = await env.AUTH_DB.prepare('SELECT enabled FROM auth_telemedicine_access WHERE username = ?')
    .bind(normalized).first();
  return Number(row?.enabled || 0) === 1;
}

export async function setTelemedicineAccess(env, username, enabled, actor = '') {
  if (!(await ensureTelemedicineAccessSchema(env))) throw new Error('Banco de autenticação indisponível.');
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error('Usuário inválido para acesso à Telemedicina.');
  if (enabled) {
    await env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_access(username, enabled, created_by)
      VALUES (?, 1, ?)
      ON CONFLICT(username) DO UPDATE SET enabled = 1, updated_at = CURRENT_TIMESTAMP, created_by = excluded.created_by`)
      .bind(normalized, actor || null).run();
  } else {
    await env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_access(username, enabled, created_by)
      VALUES (?, 0, ?)
      ON CONFLICT(username) DO UPDATE SET enabled = 0, updated_at = CURRENT_TIMESTAMP, created_by = excluded.created_by`)
      .bind(normalized, actor || null).run();
  }
  return telemedicineAccessFor(env, normalized);
}

export async function decorateTelemedicineUser(env, user) {
  if (!user || typeof user !== 'object') return user;
  if (user.role === 'admin') return { ...user, telemedicineAccess: true };
  const enabled = await telemedicineAccessFor(env, user.username);
  if (!enabled) return { ...user, telemedicineAccess: false };
  return {
    ...user,
    role: TELEMEDICINE_ROLE,
    jobTitle: user.jobTitle || DEFAULT_JOB_TITLE,
    telemedicineAccess: true
  };
}

export async function decorateTelemedicineUsers(env, users) {
  const output = [];
  for (const user of Array.isArray(users) ? users : []) output.push(await decorateTelemedicineUser(env, user));
  return output;
}

export function telemedicineRoleName() {
  return TELEMEDICINE_ROLE;
}

export function telemedicineUnderlyingRole() {
  return UNDERLYING_ROLE;
}

export function telemedicineDefaultJobTitle() {
  return DEFAULT_JOB_TITLE;
}
