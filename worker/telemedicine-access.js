'use strict';

const TELEMEDICINE_ROLE = 'telemedicina';
const UNDERLYING_ROLE = 'recepcao';
const DEFAULT_JOB_TITLE = 'Técnico em Telemedicina';
const EXPLICIT_REVOCATION_REASON = 'profile-change';
const ENABLED_AUDIT_ACTIONS = new Set(['baseline_enabled', 'granted', 'auto_repaired']);
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

function normalizedActor(value) {
  return normalizeUsername(value) || 'system';
}

async function ensureTargetUser(env, normalized) {
  const row = await env.AUTH_DB.prepare('SELECT username FROM auth_users WHERE username = ?')
    .bind(normalized).first();
  if (!row?.username) throw new Error('Usuário não encontrado para acesso à Telemedicina.');
}

async function latestAuditAction(env, normalized) {
  const row = await env.AUTH_DB.prepare(`SELECT action
    FROM auth_telemedicine_access_audit
    WHERE username = ?
    ORDER BY id DESC
    LIMIT 1`).bind(normalized).first();
  return String(row?.action || '');
}

async function repairTelemedicineAccess(env, normalized, reason = 'state-mismatch') {
  await ensureTargetUser(env, normalized);
  await env.AUTH_DB.batch([
    env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_access(username, enabled, created_by)
      VALUES (?, 1, 'system-integrity')
      ON CONFLICT(username) DO UPDATE SET enabled = 1, updated_at = CURRENT_TIMESTAMP`)
      .bind(normalized),
    env.AUTH_DB.prepare(`UPDATE auth_users
      SET role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE username = ? AND role <> 'admin' AND role <> ?`)
      .bind(UNDERLYING_ROLE, normalized, UNDERLYING_ROLE),
    env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_access_audit(username, action, actor, reason)
      VALUES (?, 'auto_repaired', 'system-integrity', ?)`)
      .bind(normalized, String(reason || 'state-mismatch').slice(0, 80))
  ]);
  return true;
}

export async function ensureTelemedicineAccessSchema(env) {
  const binding = env.AUTH_DB;
  if (!binding) return false;
  if (accessSchemaReady.has(binding)) return true;
  if (accessSchemaPromises.has(binding)) return accessSchemaPromises.get(binding);

  const operation = (async () => {
    await binding.prepare(`CREATE TABLE IF NOT EXISTS auth_telemedicine_access (
      username TEXT PRIMARY KEY,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )`).run();

    await binding.prepare(`CREATE TABLE IF NOT EXISTS auth_telemedicine_revocation_intent (
      username TEXT PRIMARY KEY,
      actor TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();

    await binding.prepare(`CREATE TABLE IF NOT EXISTS auth_telemedicine_access_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('baseline_enabled','granted','revoked','auto_repaired')),
      actor TEXT,
      reason TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();

    await binding.prepare('CREATE INDEX IF NOT EXISTS idx_auth_telemedicine_enabled ON auth_telemedicine_access(enabled, username)').run();
    await binding.prepare('CREATE INDEX IF NOT EXISTS idx_auth_telemedicine_audit_user ON auth_telemedicine_access_audit(username, id DESC)').run();

    await binding.prepare(`CREATE TRIGGER IF NOT EXISTS trg_auth_telemedicine_revoke_update_guard
      BEFORE UPDATE OF enabled ON auth_telemedicine_access
      WHEN OLD.enabled = 1 AND NEW.enabled = 0
      BEGIN
        SELECT CASE WHEN NOT EXISTS (
          SELECT 1
          FROM auth_telemedicine_revocation_intent
          WHERE username = NEW.username
            AND reason = 'profile-change'
        ) THEN RAISE(ABORT, 'TELEMEDICINE_REVOCATION_REQUIRES_INTENT') END;
      END`).run();

    await binding.prepare(`CREATE TRIGGER IF NOT EXISTS trg_auth_telemedicine_revoke_insert_guard
      BEFORE INSERT ON auth_telemedicine_access
      WHEN NEW.enabled = 0
      BEGIN
        SELECT CASE WHEN NOT EXISTS (
          SELECT 1
          FROM auth_telemedicine_revocation_intent
          WHERE username = NEW.username
            AND reason = 'profile-change'
        ) THEN RAISE(ABORT, 'TELEMEDICINE_REVOCATION_REQUIRES_INTENT') END;
      END`).run();

    await binding.prepare(`CREATE TRIGGER IF NOT EXISTS trg_auth_telemedicine_delete_guard
      BEFORE DELETE ON auth_telemedicine_access
      BEGIN
        SELECT RAISE(ABORT, 'TELEMEDICINE_ACCESS_DELETE_FORBIDDEN');
      END`).run();

    await binding.prepare(`CREATE TRIGGER IF NOT EXISTS trg_auth_telemedicine_initial_enabled_audit
      AFTER INSERT ON auth_telemedicine_access
      WHEN NEW.enabled = 1
        AND NOT EXISTS (
          SELECT 1 FROM auth_telemedicine_access_audit WHERE username = NEW.username
        )
      BEGIN
        INSERT INTO auth_telemedicine_access_audit(username, action, actor, reason)
        VALUES (NEW.username, 'baseline_enabled', 'system', 'automatic-enabled-baseline');
      END`).run();

    // V34.6: toda capacidade já habilitada na implantação ganha uma âncora
    // de intenção. Linhas desabilitadas permanecem intocadas para não
    // reativar revogações históricas por inferência.
    await binding.prepare(`INSERT INTO auth_telemedicine_access_audit(username, action, actor, reason)
      SELECT access.username, 'baseline_enabled', 'system', 'v34.6-enabled-baseline'
      FROM auth_telemedicine_access access
      WHERE access.enabled = 1
        AND NOT EXISTS (
          SELECT 1
          FROM auth_telemedicine_access_audit audit
          WHERE audit.username = access.username
        )`).run();

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

export async function ensureTelemedicineUnderlyingRole(env, username) {
  if (!env.AUTH_DB) return false;
  const normalized = normalizeUsername(username);
  if (!normalized) return false;
  await env.AUTH_DB.prepare(`UPDATE auth_users
    SET role = ?, updated_at = CURRENT_TIMESTAMP
    WHERE username = ? AND role <> 'admin' AND role <> ?`)
    .bind(UNDERLYING_ROLE, normalized, UNDERLYING_ROLE)
    .run();
  return true;
}

export async function telemedicineAccessFor(env, username) {
  if (!(await ensureTelemedicineAccessSchema(env))) return false;
  const normalized = normalizeUsername(username);
  if (!normalized) return false;

  const row = await env.AUTH_DB.prepare('SELECT enabled FROM auth_telemedicine_access WHERE username = ?')
    .bind(normalized).first();
  if (Number(row?.enabled || 0) === 1) return true;

  // Defesa em profundidade V34.6: se o estado físico sumir ou for
  // desabilitado, mas a última intenção registrada continuar sendo de
  // acesso ativo, reparar antes de negar a operação. Uma revogação
  // explícita sempre grava action=revoked na mesma transação.
  const action = await latestAuditAction(env, normalized);
  if (ENABLED_AUDIT_ACTIONS.has(action)) {
    return repairTelemedicineAccess(env, normalized, 'audit-intent-enabled');
  }
  return false;
}

export async function grantTelemedicineAccess(env, username, actor = '') {
  if (!(await ensureTelemedicineAccessSchema(env))) throw new Error('Banco de autenticação indisponível.');
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error('Usuário inválido para acesso à Telemedicina.');
  await ensureTargetUser(env, normalized);
  const by = normalizedActor(actor);

  // D1 batch é transacional: capacidade, papel-base e trilha de intenção
  // avançam juntos ou são revertidos juntos.
  await env.AUTH_DB.batch([
    env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_access(username, enabled, created_by)
      VALUES (?, 1, ?)
      ON CONFLICT(username) DO UPDATE SET enabled = 1, updated_at = CURRENT_TIMESTAMP, created_by = excluded.created_by`)
      .bind(normalized, by),
    env.AUTH_DB.prepare(`UPDATE auth_users
      SET role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE username = ? AND role <> 'admin' AND role <> ?`)
      .bind(UNDERLYING_ROLE, normalized, UNDERLYING_ROLE),
    env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_access_audit(username, action, actor, reason)
      VALUES (?, 'granted', ?, 'admin-profile-assignment')`)
      .bind(normalized, by)
  ]);
  return true;
}

export async function revokeTelemedicineAccess(env, username, actor = '', reason = '') {
  if (!(await ensureTelemedicineAccessSchema(env))) throw new Error('Banco de autenticação indisponível.');
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error('Usuário inválido para acesso à Telemedicina.');
  if (reason !== EXPLICIT_REVOCATION_REASON) {
    throw new Error('A revogação da Telemedicina exige mudança explícita de perfil.');
  }
  await ensureTargetUser(env, normalized);
  const by = normalizedActor(actor);

  // A intenção temporária existe somente dentro do mesmo batch transacional.
  // Os triggers do D1 recusam qualquer enabled=0 sem essa intenção.
  await env.AUTH_DB.batch([
    env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_revocation_intent(username, actor, reason)
      VALUES (?, ?, ?)
      ON CONFLICT(username) DO UPDATE SET actor = excluded.actor, reason = excluded.reason, created_at = CURRENT_TIMESTAMP`)
      .bind(normalized, by, EXPLICIT_REVOCATION_REASON),
    env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_access(username, enabled, created_by)
      VALUES (?, 0, ?)
      ON CONFLICT(username) DO UPDATE SET enabled = 0, updated_at = CURRENT_TIMESTAMP, created_by = excluded.created_by`)
      .bind(normalized, by),
    env.AUTH_DB.prepare(`INSERT INTO auth_telemedicine_access_audit(username, action, actor, reason)
      VALUES (?, 'revoked', ?, ?)`)
      .bind(normalized, by, EXPLICIT_REVOCATION_REASON),
    env.AUTH_DB.prepare('DELETE FROM auth_telemedicine_revocation_intent WHERE username = ?')
      .bind(normalized)
  ]);
  return false;
}

export async function decorateTelemedicineUser(env, user) {
  if (!user || typeof user !== 'object') return user;
  if (user.role === 'admin') return { ...user, telemedicineAccess: true };
  const enabled = await telemedicineAccessFor(env, user.username);
  if (!enabled) return { ...user, telemedicineAccess: false };
  if (user.role !== UNDERLYING_ROLE) await ensureTelemedicineUnderlyingRole(env, user.username);
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
