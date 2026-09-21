'use strict';

import { DriveIntegrationError, drivePresenceKey } from './document-drive.js';

const PRESENCE_TTL_SECONDS = 75;
const PRESENCE_SESSION_PATTERN = /^[A-Za-z0-9_-]{16,80}$/;
const PRESENCE_MODES = new Set(['view', 'edit']);
const presenceSchemaReady = new WeakSet();
const presenceSchemaPromises = new WeakMap();

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
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

function safeDisplayName(value, fallback = '') {
  const text = String(value || fallback || '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, 100) || String(fallback || 'Usuário').slice(0, 100);
}

function normalizeSessionId(value) {
  const sessionId = String(value || '').trim();
  if (!PRESENCE_SESSION_PATTERN.test(sessionId)) {
    throw new DriveIntegrationError(
      'DOCUMENT_PRESENCE_SESSION_INVALID',
      'Sessão de presença inválida.',
      400
    );
  }
  return sessionId;
}

function normalizeMode(value) {
  const mode = String(value || '').trim().toLowerCase();
  if (!PRESENCE_MODES.has(mode)) {
    throw new DriveIntegrationError(
      'DOCUMENT_PRESENCE_MODE_INVALID',
      'Estado de presença inválido.',
      400
    );
  }
  return mode;
}

async function ensurePresenceSchema(env) {
  const binding = env.AUTH_DB;
  if (!binding) return false;
  if (presenceSchemaReady.has(binding)) return true;
  if (presenceSchemaPromises.has(binding)) return presenceSchemaPromises.get(binding);

  const operation = (async () => {
    await binding.prepare(`CREATE TABLE IF NOT EXISTS document_titon_presence (
      document_key TEXT NOT NULL,
      session_id TEXT NOT NULL,
      username TEXT NOT NULL,
      display_name TEXT NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('view', 'edit')),
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(document_key, session_id)
    )`).run();
    await binding.prepare(
      'CREATE INDEX IF NOT EXISTS idx_document_titon_presence_document_exp ON document_titon_presence(document_key, expires_at)'
    ).run();
    await binding.prepare(
      'CREATE INDEX IF NOT EXISTS idx_document_titon_presence_exp ON document_titon_presence(expires_at)'
    ).run();
    presenceSchemaReady.add(binding);
    return true;
  })().catch((error) => {
    presenceSchemaReady.delete(binding);
    throw error;
  }).finally(() => {
    presenceSchemaPromises.delete(binding);
  });

  presenceSchemaPromises.set(binding, operation);
  return operation;
}

async function cleanExpiredPresence(env, now = nowSeconds()) {
  if (!(await ensurePresenceSchema(env))) {
    throw new DriveIntegrationError(
      'DOCUMENT_PRESENCE_UNAVAILABLE',
      'Presença simultânea indisponível.',
      503
    );
  }
  await env.AUTH_DB.prepare(
    'DELETE FROM document_titon_presence WHERE expires_at < ?'
  ).bind(now).run();
}

function publicPresenceRow(row) {
  return {
    name: safeDisplayName(row?.display_name, row?.username),
    mode: String(row?.mode || '') === 'edit' ? 'edit' : 'view'
  };
}

export async function heartbeatDocumentPresence(env, user, input = {}) {
  const username = normalizeUsername(user?.username);
  if (!username) {
    throw new DriveIntegrationError(
      'DOCUMENT_PRESENCE_ACTOR_INVALID',
      'Usuário inválido para presença documental.',
      400
    );
  }

  const ref = String(input.ref || '').trim();
  if (!ref) {
    throw new DriveIntegrationError('DRIVE_FILE_REF_INVALID', 'Referência de arquivo ausente.', 400);
  }

  const sessionId = normalizeSessionId(input.sessionId);
  const mode = normalizeMode(input.mode);
  const documentKey = await drivePresenceKey(env, ref);
  const now = nowSeconds();
  const expiresAt = now + PRESENCE_TTL_SECONDS;
  const displayName = safeDisplayName(user?.name, username);

  await cleanExpiredPresence(env, now);
  await env.AUTH_DB.prepare(`INSERT INTO document_titon_presence(
      document_key, session_id, username, display_name, mode, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(document_key, session_id) DO UPDATE SET
      username = excluded.username,
      display_name = excluded.display_name,
      mode = excluded.mode,
      expires_at = excluded.expires_at,
      updated_at = CURRENT_TIMESTAMP`)
    .bind(documentKey, sessionId, username, displayName, mode, expiresAt)
    .run();

  const rows = await env.AUTH_DB.prepare(`SELECT
      MAX(display_name) AS display_name,
      username,
      CASE WHEN MAX(CASE WHEN mode = 'edit' THEN 1 ELSE 0 END) = 1 THEN 'edit' ELSE 'view' END AS mode
    FROM document_titon_presence
    WHERE document_key = ? AND username <> ? AND expires_at >= ?
    GROUP BY username
    ORDER BY
      CASE WHEN MAX(CASE WHEN mode = 'edit' THEN 1 ELSE 0 END) = 1 THEN 0 ELSE 1 END,
      MAX(display_name)
    LIMIT 12`)
    .bind(documentKey, username, now)
    .all();

  const others = (rows.results || []).map(publicPresenceRow);
  return {
    active: true,
    mode,
    others,
    otherCount: others.length,
    editingCount: others.filter((item) => item.mode === 'edit').length,
    ttlSeconds: PRESENCE_TTL_SECONDS
  };
}

export async function releaseDocumentPresence(env, user, input = {}) {
  const username = normalizeUsername(user?.username);
  if (!username) return { released: false };

  const ref = String(input.ref || '').trim();
  const sessionId = normalizeSessionId(input.sessionId);
  if (!ref) return { released: false };

  const documentKey = await drivePresenceKey(env, ref);
  if (!(await ensurePresenceSchema(env))) return { released: false };
  const result = await env.AUTH_DB.prepare(`DELETE FROM document_titon_presence
    WHERE document_key = ? AND session_id = ? AND username = ?`)
    .bind(documentKey, sessionId, username)
    .run();

  return {
    released: Number(result?.meta?.changes || 0) > 0
  };
}

export const documentPresenceConstants = Object.freeze({
  ttlSeconds: PRESENCE_TTL_SECONDS
});
