'use strict';

import { ensureTelemedicineAccessSchema } from './telemedicine-access.js';

const SOCIAL_SCHEMA_VERSION = 'social-v1-20260906';
const PROFESSIONAL_SEED_VERSION = 'professional-friendships-v1';
const schemaPromises = new WeakMap();

function randomId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function normalizeSocialHandle(value) {
  return String(value || '')
    .replace(/^@+/, '')
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

export function socialPair(firstId, secondId) {
  const first = String(firstId || '');
  const second = String(secondId || '');
  return first < second ? [first, second] : [second, first];
}

async function ensureAuthIdentityColumns(env) {
  const columns = await env.AUTH_DB.prepare('PRAGMA table_info(auth_users)').all();
  const names = new Set((columns.results || []).map((item) => String(item.name || '')));
  if (!names.has('public_handle')) {
    await env.AUTH_DB.prepare("ALTER TABLE auth_users ADD COLUMN public_handle TEXT NOT NULL DEFAULT ''").run();
  }
  if (!names.has('handle_changed_at')) {
    await env.AUTH_DB.prepare('ALTER TABLE auth_users ADD COLUMN handle_changed_at TEXT').run();
  }
  await env.AUTH_DB.prepare("UPDATE auth_users SET public_handle = username WHERE role = 'cidadao' AND (public_handle IS NULL OR public_handle = '')").run();
  await env.AUTH_DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_users_public_handle ON auth_users(public_handle) WHERE public_handle <> ''").run();
}

async function createSocialSchema(env) {
  if (!env.AUTH_DB) return false;
  const authTable = await env.AUTH_DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'auth_users'").first();
  if (!authTable?.name) return false;
  await ensureAuthIdentityColumns(env);
  await ensureTelemedicineAccessSchema(env);

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_schema_migrations (
    version TEXT PRIMARY KEY,
    details TEXT NOT NULL DEFAULT '',
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_users (
    social_user_id TEXT PRIMARY KEY,
    auth_username TEXT NOT NULL UNIQUE,
    handle TEXT NOT NULL COLLATE NOCASE UNIQUE,
    bio TEXT NOT NULL DEFAULT '',
    status_text TEXT NOT NULL DEFAULT '',
    interests_json TEXT NOT NULL DEFAULT '[]',
    cover_theme TEXT NOT NULL DEFAULT 'aurora',
    cover_pattern TEXT NOT NULL DEFAULT 'waves',
    modules_order_json TEXT NOT NULL DEFAULT '["about","friends","posts"]',
    profile_visibility TEXT NOT NULL DEFAULT 'portal',
    default_post_audience TEXT NOT NULL DEFAULT 'friends',
    home_preference TEXT NOT NULL DEFAULT 'feed',
    suspended_at TEXT,
    suspended_reason TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_users_handle ON social_users(handle)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_users_auth ON social_users(auth_username)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_users_suspension ON social_users(suspended_at, auth_username)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_handle_aliases (
    handle TEXT PRIMARY KEY COLLATE NOCASE,
    social_user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_alias_user ON social_handle_aliases(social_user_id)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_relationships (
    pair_low TEXT NOT NULL,
    pair_high TEXT NOT NULL,
    state TEXT NOT NULL,
    initiated_by TEXT,
    blocked_by TEXT,
    origin TEXT NOT NULL DEFAULT 'manual',
    tombstone INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pair_low, pair_high),
    CHECK (pair_low <> pair_high),
    CHECK (state IN ('pending','friends','removed','blocked'))
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_relationship_state ON social_relationships(state, updated_at DESC)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_relationship_low ON social_relationships(pair_low, state, updated_at DESC)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_relationship_high ON social_relationships(pair_high, state, updated_at DESC)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    body TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT 'friends',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    CHECK (audience IN ('friends','self')),
    CHECK (status IN ('active','hidden','deleted'))
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_posts_feed ON social_posts(status, created_at DESC, id DESC)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_posts_author ON social_posts(author_id, status, created_at DESC, id DESC)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    CHECK (status IN ('active','hidden','deleted'))
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_comments_post ON social_comments(post_id, status, created_at ASC, id ASC)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_comments_author ON social_comments(author_id, status, created_at DESC)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_reactions (
    post_id TEXT NOT NULL,
    social_user_id TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'like',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, social_user_id),
    CHECK (kind = 'like')
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_reactions_post ON social_reactions(post_id, created_at DESC)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_id TEXT NOT NULL,
    type TEXT NOT NULL,
    actor_id TEXT,
    entity_type TEXT NOT NULL DEFAULT '',
    entity_id TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TEXT
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_notifications_recipient ON social_notifications(recipient_id, read_at, id DESC)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_reports (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open',
    resolution_action TEXT NOT NULL DEFAULT '',
    reviewed_by TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TEXT,
    CHECK (target_type IN ('profile','post','comment')),
    CHECK (status IN ('open','resolved','dismissed'))
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_reports_queue ON social_reports(status, created_at ASC, id)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_reports_target ON social_reports(target_type, target_id, status)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_moderation_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_username TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    metadata_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_audit_created ON social_moderation_audit(created_at DESC, id DESC)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_audit_target ON social_moderation_audit(target_type, target_id, created_at DESC)').run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS social_rate_limits (
    rate_key TEXT PRIMARY KEY,
    social_user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    window_started_at INTEGER NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_social_rate_actor ON social_rate_limits(social_user_id, action, window_started_at DESC)').run();

  await env.AUTH_DB.prepare(`INSERT INTO social_schema_migrations(version, details)
    VALUES (?, 'Estruturas sociais aditivas e idempotentes')
    ON CONFLICT(version) DO NOTHING`).bind(SOCIAL_SCHEMA_VERSION).run();
  return true;
}

export async function ensureSocialSchema(env) {
  if (String(env?.SOCIAL_BACKEND_ENABLED || '').trim().toLowerCase() !== 'true') return false;
  if (!env.AUTH_DB || (typeof env.AUTH_DB !== 'object' && typeof env.AUTH_DB !== 'function')) return false;
  if (!schemaPromises.has(env.AUTH_DB)) {
    const operation = createSocialSchema(env).catch((error) => {
      schemaPromises.delete(env.AUTH_DB);
      throw error;
    });
    schemaPromises.set(env.AUTH_DB, operation);
  }
  return schemaPromises.get(env.AUTH_DB);
}

async function authRecord(env, username) {
  return env.AUTH_DB.prepare(`SELECT username, role, name, job_title AS jobTitle, active,
      email_verified AS emailVerified, self_registered AS selfRegistered,
      COALESCE(public_handle, '') AS publicHandle
    FROM auth_users WHERE username = ? LIMIT 1`).bind(String(username || '')).first();
}

async function handleOwnedByAnother(env, handle, socialUserId) {
  const direct = await env.AUTH_DB.prepare('SELECT social_user_id FROM social_users WHERE handle = ? COLLATE NOCASE LIMIT 1')
    .bind(handle).first();
  if (direct && direct.social_user_id !== socialUserId) return true;
  const alias = await env.AUTH_DB.prepare('SELECT social_user_id FROM social_handle_aliases WHERE handle = ? COLLATE NOCASE LIMIT 1')
    .bind(handle).first();
  return Boolean(alias && alias.social_user_id !== socialUserId);
}

async function availableHandle(env, desired, socialUserId = '') {
  const base = normalizeSocialHandle(desired) || `perfil-${randomId().slice(0, 8)}`;
  if (!(await handleOwnedByAnother(env, base, socialUserId))) return base;
  for (let suffix = 2; suffix <= 30; suffix += 1) {
    const candidate = `${base.slice(0, Math.max(3, 40 - String(suffix).length - 1))}.${suffix}`;
    if (!(await handleOwnedByAnother(env, candidate, socialUserId))) return candidate;
  }
  return `${base.slice(0, 31)}.${randomId().slice(0, 8)}`;
}

export async function syncSocialUser(env, userOrUsername) {
  if (!(await ensureSocialSchema(env))) return null;
  const username = typeof userOrUsername === 'string' ? userOrUsername : userOrUsername?.username;
  const auth = await authRecord(env, username);
  if (!auth) return null;
  let social = await env.AUTH_DB.prepare('SELECT * FROM social_users WHERE auth_username = ? LIMIT 1')
    .bind(auth.username).first();
  const desiredHandle = normalizeSocialHandle(auth.role === 'cidadao' ? (auth.publicHandle || auth.username) : auth.username);

  if (!social) {
    const socialUserId = randomId();
    const handle = await availableHandle(env, desiredHandle, socialUserId);
    await env.AUTH_DB.prepare(`INSERT INTO social_users(social_user_id, auth_username, handle)
      VALUES (?, ?, ?)`).bind(socialUserId, auth.username, handle).run();
    social = await env.AUTH_DB.prepare('SELECT * FROM social_users WHERE social_user_id = ?').bind(socialUserId).first();
  } else if (desiredHandle && desiredHandle !== normalizeSocialHandle(social.handle)) {
    const handle = await availableHandle(env, desiredHandle, social.social_user_id);
    await env.AUTH_DB.prepare(`INSERT INTO social_handle_aliases(handle, social_user_id)
      VALUES (?, ?) ON CONFLICT(handle) DO NOTHING`).bind(social.handle, social.social_user_id).run();
    await env.AUTH_DB.prepare('UPDATE social_users SET handle = ?, updated_at = CURRENT_TIMESTAMP WHERE social_user_id = ?')
      .bind(handle, social.social_user_id).run();
    social = await env.AUTH_DB.prepare('SELECT * FROM social_users WHERE social_user_id = ?').bind(social.social_user_id).first();
  }
  return { ...social, auth };
}

export async function resolveSocialUser(env, handleOrUsername) {
  if (!(await ensureSocialSchema(env))) return null;
  const requested = normalizeSocialHandle(handleOrUsername);
  if (!requested) return null;
  let social = await env.AUTH_DB.prepare(`SELECT su.*, au.username, au.role, au.name, au.job_title AS jobTitle,
      au.active, au.email_verified AS emailVerified, au.self_registered AS selfRegistered,
      au.accept_friend_requests AS acceptFriendRequests,
      COALESCE(au.avatar_data, '') <> '' AS avatarAvailable
    FROM social_users su JOIN auth_users au ON au.username = su.auth_username
    WHERE su.handle = ? COLLATE NOCASE LIMIT 1`).bind(requested).first();
  if (!social) {
    social = await env.AUTH_DB.prepare(`SELECT su.*, au.username, au.role, au.name, au.job_title AS jobTitle,
        au.active, au.email_verified AS emailVerified, au.self_registered AS selfRegistered,
        au.accept_friend_requests AS acceptFriendRequests,
        COALESCE(au.avatar_data, '') <> '' AS avatarAvailable
      FROM social_handle_aliases sha
      JOIN social_users su ON su.social_user_id = sha.social_user_id
      JOIN auth_users au ON au.username = su.auth_username
      WHERE sha.handle = ? COLLATE NOCASE LIMIT 1`).bind(requested).first();
  }
  if (social) return social;

  const auth = await env.AUTH_DB.prepare(`SELECT username FROM auth_users
    WHERE username = ? OR public_handle = ? COLLATE NOCASE LIMIT 1`).bind(requested, requested).first();
  if (!auth?.username) return null;
  const synced = await syncSocialUser(env, auth.username);
  return synced ? socialUserById(env, synced.social_user_id) : null;
}

export async function socialUserById(env, socialUserId) {
  if (!(await ensureSocialSchema(env))) return null;
  return env.AUTH_DB.prepare(`SELECT su.*, au.username, au.role, au.name, au.job_title AS jobTitle,
      au.active, au.email_verified AS emailVerified, au.self_registered AS selfRegistered,
      au.accept_friend_requests AS acceptFriendRequests,
      COALESCE(au.avatar_data, '') <> '' AS avatarAvailable
    FROM social_users su JOIN auth_users au ON au.username = su.auth_username
    WHERE su.social_user_id = ? LIMIT 1`).bind(String(socialUserId || '')).first();
}

export async function isSocialHandleOwnedByAnother(env, handle, authUsername) {
  if (!(await ensureSocialSchema(env))) return false;
  const normalized = normalizeSocialHandle(handle);
  const row = await env.AUTH_DB.prepare(`SELECT su.auth_username
    FROM social_users su WHERE su.handle = ? COLLATE NOCASE
    UNION ALL
    SELECT su.auth_username FROM social_handle_aliases sha
      JOIN social_users su ON su.social_user_id = sha.social_user_id
      WHERE sha.handle = ? COLLATE NOCASE
    LIMIT 1`).bind(normalized, normalized).first();
  return Boolean(row?.auth_username && row.auth_username !== authUsername);
}

async function eligibleProfessionalRows(env) {
  await ensureTelemedicineAccessSchema(env);
  const result = await env.AUTH_DB.prepare(`SELECT DISTINCT u.username
    FROM auth_users u
    LEFT JOIN auth_users creator ON creator.username = u.created_by
    LEFT JOIN auth_telemedicine_access tele ON tele.username = u.username AND tele.enabled = 1
    WHERE u.active = 1
      AND COALESCE(u.self_registered, 0) = 0
      AND (u.role IN ('medico','recepcao','coordenacao','admin') OR tele.username IS NOT NULL)
      AND (u.created_by = 'bootstrap' OR creator.role = 'admin')
    ORDER BY u.username`).all();
  return result.results || [];
}

export async function provisionProfessionalSocialGraph(env, onlyUsername = '') {
  if (!(await ensureSocialSchema(env))) return { users: 0, pairs: 0 };
  const professionals = await eligibleProfessionalRows(env);
  const socialUsers = [];
  for (const professional of professionals) {
    const social = await syncSocialUser(env, professional.username);
    if (social) socialUsers.push(social);
  }
  const target = String(onlyUsername || '');
  let pairs = 0;
  for (let first = 0; first < socialUsers.length; first += 1) {
    for (let second = first + 1; second < socialUsers.length; second += 1) {
      const left = socialUsers[first];
      const right = socialUsers[second];
      if (target && left.auth_username !== target && right.auth_username !== target) continue;
      const [pairLow, pairHigh] = socialPair(left.social_user_id, right.social_user_id);
      const result = await env.AUTH_DB.prepare(`INSERT INTO social_relationships
        (pair_low, pair_high, state, initiated_by, origin, tombstone)
        VALUES (?, ?, 'friends', ?, 'professional_seed', 0)
        ON CONFLICT(pair_low, pair_high) DO NOTHING`)
        .bind(pairLow, pairHigh, left.social_user_id).run();
      pairs += Number(result.meta?.changes || 0);
    }
  }
  return { users: socialUsers.length, pairs };
}

export async function retireProfessionalSeededRelationships(env, username) {
  if (!(await ensureSocialSchema(env))) return 0;
  const social = await syncSocialUser(env, username);
  if (!social) return 0;
  const result = await env.AUTH_DB.prepare(`UPDATE social_relationships
    SET state = 'removed', initiated_by = NULL, blocked_by = NULL, tombstone = 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE origin = 'professional_seed' AND state = 'friends'
      AND (pair_low = ? OR pair_high = ?)`)
    .bind(social.social_user_id, social.social_user_id).run();
  return Number(result.meta?.changes || 0);
}

export async function ensureInitialProfessionalFriendships(env) {
  if (!(await ensureSocialSchema(env))) return { applied: false, users: 0, pairs: 0 };
  const applied = await env.AUTH_DB.prepare('SELECT version, details, applied_at AS appliedAt FROM social_schema_migrations WHERE version = ?')
    .bind(PROFESSIONAL_SEED_VERSION).first();
  if (applied) return { applied: true, existing: true, details: applied.details || '', appliedAt: applied.appliedAt || null };
  const result = await provisionProfessionalSocialGraph(env);
  const details = JSON.stringify(result);
  await env.AUTH_DB.prepare(`INSERT INTO social_schema_migrations(version, details)
    VALUES (?, ?) ON CONFLICT(version) DO NOTHING`).bind(PROFESSIONAL_SEED_VERSION, details).run();
  return { applied: true, existing: false, ...result };
}

export async function socialMigrationStatus(env) {
  if (!(await ensureSocialSchema(env))) return [];
  const result = await env.AUTH_DB.prepare('SELECT version, details, applied_at AS appliedAt FROM social_schema_migrations ORDER BY applied_at, version').all();
  return result.results || [];
}

export const SOCIAL_SCHEMA = Object.freeze({
  version: SOCIAL_SCHEMA_VERSION,
  professionalSeedVersion: PROFESSIONAL_SEED_VERSION
});
