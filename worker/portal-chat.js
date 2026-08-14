'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import { recordUsageHeartbeat } from './usage-monitor.js';

const MESSAGE_LIMIT = 2000;
const ONLINE_WINDOW_SECONDS = 75;

function headers(origin, allowed = true) {
  const result = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    result['Access-Control-Allow-Origin'] = origin;
    result.Vary = 'Origin';
  }
  return result;
}

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers(origin, allowed), 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const responseHeaders = headers(origin, true);
  responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  responseHeaders['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  responseHeaders['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers: responseHeaders });
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

function bootstrapUsers(env) {
  if (!env.AUTH_USERS_JSON) return [];
  try {
    const parsed = JSON.parse(env.AUTH_USERS_JSON);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      username: normalizeUsername(item.username),
      name: String(item.name || item.username || '').trim().slice(0, 120),
      jobTitle: String(item.jobTitle || '').trim().slice(0, 120),
      role: String(item.role || '').trim(),
      active: item.active !== false
    })).filter((item) => item.username && item.active);
  } catch (_) {
    return [];
  }
}

async function ensureSchema(env) {
  if (!env.AUTH_DB) return false;

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_chat_presence (
    username TEXT PRIMARY KEY,
    last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    body TEXT NOT NULL,
    sent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TEXT
  )`).run();

  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_chat_conversation ON portal_chat_messages(from_user, to_user, id)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_chat_unread ON portal_chat_messages(to_user, read_at, from_user)').run();

  const columns = await env.AUTH_DB.prepare('PRAGMA table_info(auth_users)').all();
  const names = new Set((columns.results || []).map((column) => String(column.name || '')));
  if (!names.has('avatar_data')) {
    await env.AUTH_DB.prepare("ALTER TABLE auth_users ADD COLUMN avatar_data TEXT NOT NULL DEFAULT ''").run();
  }
  return true;
}

async function touchPresence(env, username) {
  await env.AUTH_DB.prepare(`INSERT INTO portal_chat_presence(username, last_seen)
    VALUES (?, CURRENT_TIMESTAMP)
    ON CONFLICT(username) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`)
    .bind(username)
    .run();
}

async function dbContacts(env, currentUsername) {
  const result = await env.AUTH_DB.prepare(`SELECT
      u.username,
      u.name,
      u.job_title AS jobTitle,
      u.role,
      COALESCE(u.avatar_data, '') AS avatarDataUrl,
      p.last_seen AS lastSeen,
      CASE WHEN p.last_seen IS NOT NULL AND p.last_seen >= datetime('now', '-' || ? || ' seconds') THEN 1 ELSE 0 END AS online,
      COALESCE((SELECT COUNT(*) FROM portal_chat_messages m
        WHERE m.to_user = ? AND m.from_user = u.username AND m.read_at IS NULL), 0) AS unread
    FROM auth_users u
    LEFT JOIN portal_chat_presence p ON p.username = u.username
    WHERE u.active = 1 AND u.username <> ?
    ORDER BY online DESC, lower(u.name), u.username`)
    .bind(ONLINE_WINDOW_SECONDS, currentUsername, currentUsername)
    .all();
  return result.results || [];
}

async function unreadFrom(env, currentUsername, otherUsername) {
  const row = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total FROM portal_chat_messages
    WHERE to_user = ? AND from_user = ? AND read_at IS NULL`)
    .bind(currentUsername, otherUsername)
    .first();
  return Number(row?.total || 0);
}

async function listContacts(env, currentUsername) {
  const contacts = await dbContacts(env, currentUsername);
  const known = new Set(contacts.map((item) => item.username));

  for (const item of bootstrapUsers(env)) {
    if (item.username === currentUsername || known.has(item.username)) continue;
    const presence = await env.AUTH_DB.prepare('SELECT last_seen AS lastSeen FROM portal_chat_presence WHERE username = ?')
      .bind(item.username)
      .first();
    const online = presence?.lastSeen
      ? Boolean((await env.AUTH_DB.prepare("SELECT CASE WHEN ? >= datetime('now', '-' || ? || ' seconds') THEN 1 ELSE 0 END AS online")
        .bind(presence.lastSeen, ONLINE_WINDOW_SECONDS)
        .first())?.online)
      : false;
    contacts.push({
      ...item,
      avatarDataUrl: '',
      lastSeen: presence?.lastSeen || null,
      online: online ? 1 : 0,
      unread: await unreadFrom(env, currentUsername, item.username)
    });
  }

  contacts.sort((a, b) => Number(b.online) - Number(a.online)
    || String(a.name || a.username).localeCompare(String(b.name || b.username), 'pt-BR'));

  return contacts.map((item) => ({
    username: item.username,
    name: item.name || item.username,
    jobTitle: item.jobTitle || '',
    role: item.role || '',
    avatarDataUrl: item.avatarDataUrl || '',
    online: Number(item.online) === 1,
    lastSeen: item.lastSeen || null,
    unread: Number(item.unread || 0)
  }));
}

async function contactExists(env, username) {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;
  const stored = await env.AUTH_DB.prepare('SELECT username, name, job_title AS jobTitle, role, active FROM auth_users WHERE username = ?')
    .bind(normalized)
    .first();
  if (stored && Number(stored.active) === 1) return stored;
  return bootstrapUsers(env).find((item) => item.username === normalized) || null;
}

async function loadMessages(env, currentUsername, otherUsername, afterId) {
  if (afterId > 0) {
    const result = await env.AUTH_DB.prepare(`SELECT id, from_user AS fromUser, to_user AS toUser, body, sent_at AS sentAt, read_at AS readAt
      FROM portal_chat_messages
      WHERE id > ? AND ((from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?))
      ORDER BY id ASC LIMIT 200`)
      .bind(afterId, currentUsername, otherUsername, otherUsername, currentUsername)
      .all();
    return result.results || [];
  }

  const result = await env.AUTH_DB.prepare(`SELECT * FROM (
      SELECT id, from_user AS fromUser, to_user AS toUser, body, sent_at AS sentAt, read_at AS readAt
      FROM portal_chat_messages
      WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)
      ORDER BY id DESC LIMIT 120
    ) ORDER BY id ASC`)
    .bind(currentUsername, otherUsername, otherUsername, currentUsername)
    .all();
  return result.results || [];
}

async function markConversationRead(env, currentUsername, otherUsername) {
  await env.AUTH_DB.prepare(`UPDATE portal_chat_messages
    SET read_at = CURRENT_TIMESTAMP
    WHERE to_user = ? AND from_user = ? AND read_at IS NULL`)
    .bind(currentUsername, otherUsername)
    .run();
}

export function isChatApi(pathname) {
  return String(pathname || '').startsWith('/api/chat/');
}

export async function handleChatRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);

  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  if (!(await ensureSchema(env))) return json({ error: 'Banco do chat ainda não disponível.' }, 503, origin);

  const username = normalizeUsername(user.username);
  await touchPresence(env, username);
  const url = new URL(request.url);

  if (url.pathname === '/api/chat/presence' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    await recordUsageHeartbeat(env, username, body).catch(() => {});
    return json({ ok: true }, 200, origin);
  }

  if (url.pathname === '/api/chat/users' && request.method === 'GET') {
    return json({ users: await listContacts(env, username) }, 200, origin);
  }

  if (url.pathname === '/api/chat/messages' && request.method === 'GET') {
    const otherUsername = normalizeUsername(url.searchParams.get('with'));
    const other = await contactExists(env, otherUsername);
    if (!other || otherUsername === username) return json({ error: 'Usuário do chat não encontrado.' }, 404, origin);
    const afterId = Math.max(0, Number.parseInt(url.searchParams.get('after') || '0', 10) || 0);
    const messages = await loadMessages(env, username, otherUsername, afterId);
    await markConversationRead(env, username, otherUsername);
    return json({ messages }, 200, origin);
  }

  if (url.pathname === '/api/chat/messages' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const to = normalizeUsername(body.to);
    const message = String(body.body || '').trim();
    if (!message) return json({ error: 'Digite uma mensagem.' }, 400, origin);
    if (message.length > MESSAGE_LIMIT) return json({ error: `A mensagem pode ter no máximo ${MESSAGE_LIMIT} caracteres.` }, 400, origin);
    if (to === username) return json({ error: 'Escolha outro usuário para conversar.' }, 400, origin);
    const target = await contactExists(env, to);
    if (!target) return json({ error: 'Usuário do chat não encontrado.' }, 404, origin);

    const inserted = await env.AUTH_DB.prepare(`INSERT INTO portal_chat_messages(from_user, to_user, body)
      VALUES (?, ?, ?)`)
      .bind(username, to, message)
      .run();
    const id = Number(inserted.meta?.last_row_id || 0);
    const row = id
      ? await env.AUTH_DB.prepare('SELECT id, from_user AS fromUser, to_user AS toUser, body, sent_at AS sentAt, read_at AS readAt FROM portal_chat_messages WHERE id = ?').bind(id).first()
      : null;
    return json({ message: row || { id, fromUser: username, toUser: to, body: message } }, 201, origin);
  }

  return json({ error: 'Rota do chat não encontrada.' }, 404, origin);
}
