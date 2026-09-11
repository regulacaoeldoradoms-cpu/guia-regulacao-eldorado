'use strict';

const accessSchemaReady = new WeakSet();
const accessSchemaPromises = new WeakMap();

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

function flags(row = null, role = '') {
  const view = Number(row?.can_view || 0) === 1;
  return Object.freeze({
    view,
    extract: view && Number(row?.can_extract || 0) === 1,
    edit: view && Number(row?.can_edit || 0) === 1,
    manage: role === 'admin' || Number(row?.can_manage || 0) === 1
  });
}

export async function ensureDocumentAccessSchema(env) {
  const binding = env.AUTH_DB;
  if (!binding) return false;
  if (accessSchemaReady.has(binding)) return true;
  if (accessSchemaPromises.has(binding)) return accessSchemaPromises.get(binding);

  const operation = (async () => {
    await binding.prepare(`CREATE TABLE IF NOT EXISTS auth_document_access (
      username TEXT PRIMARY KEY,
      can_view INTEGER NOT NULL DEFAULT 0,
      can_extract INTEGER NOT NULL DEFAULT 0,
      can_edit INTEGER NOT NULL DEFAULT 0,
      can_manage INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT
    )`).run();
    await binding.prepare('CREATE INDEX IF NOT EXISTS idx_auth_document_access_view ON auth_document_access(can_view, username)').run();
    accessSchemaReady.add(binding);
    return true;
  })().catch((error) => {
    accessSchemaReady.delete(binding);
    throw error;
  }).finally(() => {
    accessSchemaPromises.delete(binding);
  });

  accessSchemaPromises.set(binding, operation);
  return operation;
}

export async function documentCapabilitiesFor(env, userOrUsername, roleHint = '') {
  if (!(await ensureDocumentAccessSchema(env))) return flags(null, roleHint);
  const username = normalizeUsername(typeof userOrUsername === 'object' ? userOrUsername?.username : userOrUsername);
  const role = String(typeof userOrUsername === 'object' ? userOrUsername?.role : roleHint || '').trim();
  if (!username) return flags(null, role);
  const row = await env.AUTH_DB.prepare(`SELECT can_view, can_extract, can_edit, can_manage
    FROM auth_document_access WHERE username = ?`).bind(username).first();
  return flags(row, role);
}

export async function documentCapabilitiesForUsername(env, username) {
  if (!(await ensureDocumentAccessSchema(env))) return { active: false, role: '', capabilities: flags() };
  const normalized = normalizeUsername(username);
  if (!normalized) return { active: false, role: '', capabilities: flags() };
  const user = await env.AUTH_DB.prepare('SELECT role, active FROM auth_users WHERE username = ?')
    .bind(normalized).first();
  if (!user || Number(user.active || 0) !== 1) {
    return { active: false, role: String(user?.role || ''), capabilities: flags(null, String(user?.role || '')) };
  }
  return {
    active: true,
    role: String(user.role || ''),
    capabilities: await documentCapabilitiesFor(env, normalized, String(user.role || ''))
  };
}

function normalizeInput(input = {}) {
  const edit = input.edit === true;
  const extract = input.extract === true;
  const view = input.view === true || edit || extract;
  return {
    view,
    extract: view && extract,
    edit: view && edit,
    manage: input.manage === true
  };
}

export async function setDocumentCapabilities(env, username, input = {}, actor = '') {
  if (!(await ensureDocumentAccessSchema(env))) throw new Error('Banco de autenticação indisponível.');
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error('Usuário inválido para acesso documental.');
  const target = await env.AUTH_DB.prepare('SELECT username, role, active FROM auth_users WHERE username = ?')
    .bind(normalized).first();
  if (!target) throw new Error('Usuário não encontrado.');

  const caps = normalizeInput(input);
  await env.AUTH_DB.prepare(`INSERT INTO auth_document_access(
      username, can_view, can_extract, can_edit, can_manage, updated_by
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET
      can_view = excluded.can_view,
      can_extract = excluded.can_extract,
      can_edit = excluded.can_edit,
      can_manage = excluded.can_manage,
      updated_at = CURRENT_TIMESTAMP,
      updated_by = excluded.updated_by`)
    .bind(
      normalized,
      caps.view ? 1 : 0,
      caps.extract ? 1 : 0,
      caps.edit ? 1 : 0,
      caps.manage ? 1 : 0,
      normalizeUsername(actor) || null
    ).run();

  return documentCapabilitiesFor(env, normalized, String(target.role || ''));
}

export async function decorateDocumentUser(env, user) {
  if (!user || typeof user !== 'object') return user;
  return {
    ...user,
    documentCapabilities: await documentCapabilitiesFor(env, user)
  };
}

export async function decorateDocumentUsers(env, users) {
  const list = Array.isArray(users) ? users : [];
  if (!(await ensureDocumentAccessSchema(env)) || !list.length) {
    return list.map((user) => ({
      ...user,
      documentCapabilities: flags(null, String(user?.role || ''))
    }));
  }

  const rows = await env.AUTH_DB.prepare(`SELECT username, can_view, can_extract, can_edit, can_manage
    FROM auth_document_access`).all();
  const byUser = new Map((rows.results || []).map((row) => [normalizeUsername(row.username), row]));
  return list.map((user) => ({
    ...user,
    documentCapabilities: flags(byUser.get(normalizeUsername(user?.username)), String(user?.role || ''))
  }));
}

export function hasDocumentCapability(user, capability) {
  const key = String(capability || '').trim();
  return Boolean(user?.documentCapabilities && user.documentCapabilities[key] === true);
}
