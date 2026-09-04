'use strict';

const COUNCIL_VICE_OFFICE = 'vice_presidente';
const UNDERLYING_COUNCIL_ROLE = 'membro';
const DEFAULT_JOB_TITLE = 'Vice-Presidente do Conselho Municipal de Saúde';

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

export async function ensureCouncilViceAccessSchema(env) {
  if (!env.AUTH_DB) return false;
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS auth_council_vice_access (
    username TEXT PRIMARY KEY,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_auth_council_vice_enabled ON auth_council_vice_access(enabled, username)').run();
  return true;
}

export async function councilViceAccessFor(env, username) {
  if (!(await ensureCouncilViceAccessSchema(env))) return false;
  const normalized = normalizeUsername(username);
  if (!normalized) return false;
  const row = await env.AUTH_DB.prepare('SELECT enabled FROM auth_council_vice_access WHERE username = ?')
    .bind(normalized).first();
  return Number(row?.enabled || 0) === 1;
}

export async function setCouncilViceAccess(env, username, enabled, actor = '') {
  if (!(await ensureCouncilViceAccessSchema(env))) throw new Error('Banco de autenticação indisponível.');
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error('Usuário inválido para a Vice-Presidência do Conselho.');

  await env.AUTH_DB.prepare(`INSERT INTO auth_council_vice_access(username, enabled, created_by)
    VALUES (?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET enabled = excluded.enabled, updated_at = CURRENT_TIMESTAMP, created_by = excluded.created_by`)
    .bind(normalized, enabled ? 1 : 0, actor || null).run();

  return councilViceAccessFor(env, normalized);
}

function withCouncilOffice(user, enabled) {
  if (!user || typeof user !== 'object') return user;
  if (!enabled || user.councilRole !== UNDERLYING_COUNCIL_ROLE) {
    return { ...user, councilOffice: '', councilOfficeLabel: '' };
  }
  return {
    ...user,
    councilOffice: COUNCIL_VICE_OFFICE,
    councilOfficeLabel: 'Vice-Presidente do Conselho'
  };
}

export async function decorateCouncilViceUser(env, user) {
  if (!user || typeof user !== 'object') return user;
  const enabled = await councilViceAccessFor(env, user.username);
  return withCouncilOffice(user, enabled);
}

export async function decorateCouncilViceUsers(env, users) {
  const list = Array.isArray(users) ? users : [];
  if (!(await ensureCouncilViceAccessSchema(env))) return list.map((user) => withCouncilOffice(user, false));
  const result = await env.AUTH_DB.prepare('SELECT username FROM auth_council_vice_access WHERE enabled = 1').all();
  const enabled = new Set((result.results || []).map((row) => normalizeUsername(row.username)).filter(Boolean));
  return list.map((user) => withCouncilOffice(user, enabled.has(normalizeUsername(user?.username))));
}

export function councilViceOfficeName() {
  return COUNCIL_VICE_OFFICE;
}

export function councilViceUnderlyingRole() {
  return UNDERLYING_COUNCIL_ROLE;
}

export function councilViceDefaultJobTitle() {
  return DEFAULT_JOB_TITLE;
}
