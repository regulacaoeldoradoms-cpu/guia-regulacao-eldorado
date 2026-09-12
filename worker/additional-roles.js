'use strict';

const ROLE_CATALOG = Object.freeze({
  documentos: Object.freeze({
    id: 'documentos',
    label: 'Regulador(a)',
    description: 'Acesso à Central de Documentos e leitura de documentos autorizados no Google Drive institucional.'
  })
});

const schemaReady = new WeakSet();
const schemaPromises = new WeakMap();

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

function normalizeRoleId(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
}

export function additionalRoleCatalog() {
  return Object.values(ROLE_CATALOG).map((item) => ({ ...item }));
}

export async function ensureAdditionalRolesSchema(env) {
  const binding = env.AUTH_DB;
  if (!binding) return false;
  if (schemaReady.has(binding)) return true;
  if (schemaPromises.has(binding)) return schemaPromises.get(binding);

  const operation = (async () => {
    await binding.prepare(`CREATE TABLE IF NOT EXISTS auth_user_additional_roles (
      username TEXT NOT NULL,
      role_id TEXT NOT NULL,
      assigned_by TEXT,
      assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (username, role_id)
    )`).run();
    await binding.prepare('CREATE INDEX IF NOT EXISTS idx_auth_user_additional_roles_role ON auth_user_additional_roles(role_id, username)').run();
    schemaReady.add(binding);
    return true;
  })().catch((error) => {
    schemaReady.delete(binding);
    throw error;
  }).finally(() => {
    schemaPromises.delete(binding);
  });

  schemaPromises.set(binding, operation);
  return operation;
}

export async function additionalRolesFor(env, userOrUsername) {
  if (!(await ensureAdditionalRolesSchema(env))) return [];
  const username = normalizeUsername(typeof userOrUsername === 'object' ? userOrUsername?.username : userOrUsername);
  if (!username) return [];
  const result = await env.AUTH_DB.prepare(`SELECT role_id
    FROM auth_user_additional_roles
    WHERE username = ?
    ORDER BY role_id`).bind(username).all();
  return (result.results || [])
    .map((row) => normalizeRoleId(row.role_id))
    .filter((roleId) => Object.prototype.hasOwnProperty.call(ROLE_CATALOG, roleId));
}

export async function setAdditionalRoles(env, username, roleIds = [], actor = '') {
  if (!(await ensureAdditionalRolesSchema(env))) throw new Error('Banco de autenticação indisponível.');
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error('Usuário inválido para funções adicionais.');

  const target = await env.AUTH_DB.prepare('SELECT username FROM auth_users WHERE username = ?')
    .bind(normalized).first();
  if (!target) throw new Error('Usuário não encontrado.');

  const requested = [...new Set((Array.isArray(roleIds) ? roleIds : [])
    .map(normalizeRoleId)
    .filter(Boolean))];

  const invalid = requested.find((roleId) => !Object.prototype.hasOwnProperty.call(ROLE_CATALOG, roleId));
  if (invalid) throw new Error('Função adicional inválida.');

  await env.AUTH_DB.prepare('DELETE FROM auth_user_additional_roles WHERE username = ?')
    .bind(normalized).run();

  for (const roleId of requested) {
    await env.AUTH_DB.prepare(`INSERT INTO auth_user_additional_roles(
      username, role_id, assigned_by
    ) VALUES (?, ?, ?)`).bind(
      normalized,
      roleId,
      normalizeUsername(actor) || null
    ).run();
  }

  return additionalRolesFor(env, normalized);
}

export async function decorateAdditionalRolesUser(env, user) {
  if (!user || typeof user !== 'object') return user;
  const additionalRoles = await additionalRolesFor(env, user.username);
  return {
    ...user,
    additionalRoles,
    effectiveRoles: [...new Set([String(user.role || ''), ...additionalRoles].filter(Boolean))]
  };
}

export async function decorateAdditionalRolesUsers(env, users) {
  const list = Array.isArray(users) ? users : [];
  if (!(await ensureAdditionalRolesSchema(env)) || !list.length) {
    return list.map((user) => ({
      ...user,
      additionalRoles: [],
      effectiveRoles: [String(user?.role || '')].filter(Boolean)
    }));
  }

  const result = await env.AUTH_DB.prepare(`SELECT username, role_id
    FROM auth_user_additional_roles
    ORDER BY username, role_id`).all();
  const byUser = new Map();
  for (const row of result.results || []) {
    const username = normalizeUsername(row.username);
    const roleId = normalizeRoleId(row.role_id);
    if (!username || !Object.prototype.hasOwnProperty.call(ROLE_CATALOG, roleId)) continue;
    if (!byUser.has(username)) byUser.set(username, []);
    byUser.get(username).push(roleId);
  }

  return list.map((user) => {
    const additionalRoles = [...new Set(byUser.get(normalizeUsername(user?.username)) || [])];
    return {
      ...user,
      additionalRoles,
      effectiveRoles: [...new Set([String(user?.role || ''), ...additionalRoles].filter(Boolean))]
    };
  });
}

export function hasAdditionalRole(user, roleId) {
  const normalized = normalizeRoleId(roleId);
  return Array.isArray(user?.additionalRoles) && user.additionalRoles.includes(normalized);
}
