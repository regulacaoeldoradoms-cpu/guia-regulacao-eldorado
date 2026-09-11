'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import { decorateTelemedicineUser, decorateTelemedicineUsers } from './telemedicine-access.js';
import { recordUsageHeartbeat } from './usage-monitor.js';
import { notifyUserPush } from './push-notifications.js';
import { ensureSocialSchema } from './social-schema.js';

const MESSAGE_LIMIT = 2000;
const ONLINE_WINDOW_SECONDS = 75;
const PROFESSIONAL_ROLES = new Set(['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin']);
const CHAT_ROLES = new Set([...PROFESSIONAL_ROLES, 'cidadao']);

function headers(origin, allowed = true) {
  const result = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
  if (allowed && origin) {
    result['Access-Control-Allow-Origin'] = origin;
    result.Vary = 'Origin';
  }
  return result;
}

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers(origin, allowed), 'Content-Type': 'application/json; charset=utf-8' } });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const h = headers(origin, true);
  h['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  h['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  h['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers: h });
}

function normalizeUsername(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
    .replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '').replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '').slice(0, 40);
}

async function ensureSchema(env) {
  if (!env.AUTH_DB) return false;
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_chat_presence (
    username TEXT PRIMARY KEY, last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
  return true;
}

async function touchPresence(env, username) {
  await env.AUTH_DB.prepare(`INSERT INTO portal_chat_presence(username, last_seen) VALUES (?, CURRENT_TIMESTAMP)
    ON CONFLICT(username) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`).bind(username).run();
}

async function professionalContact(env, username) {
  const row = await env.AUTH_DB.prepare(`SELECT username, name, job_title AS jobTitle, role, active,
      COALESCE(avatar_data, '') AS avatarDataUrl
    FROM auth_users WHERE username = ?`).bind(username).first();
  if (!row || Number(row.active) !== 1) return null;
  const user = await decorateTelemedicineUser(env, row);
  if (!PROFESSIONAL_ROLES.has(user.role)) return null;
  return user;
}

function socialBackendEnabled(env) {
  return String(env.SOCIAL_BACKEND_ENABLED || '').trim().toLowerCase() === 'true';
}

async function socialHandleForUsername(env, username) {
  if (!socialBackendEnabled(env)) return '';
  try {
    if (!(await ensureSocialSchema(env))) return '';
    const row = await env.AUTH_DB.prepare('SELECT handle FROM social_users WHERE auth_username = ? LIMIT 1')
      .bind(username).first();
    return String(row?.handle || '');
  } catch (_) {
    return '';
  }
}

async function professionalContacts(env, currentUsername) {
  const result = await env.AUTH_DB.prepare(`SELECT
      u.username, u.name, u.job_title AS jobTitle, u.role,
      COALESCE(u.avatar_data, '') AS avatarDataUrl,
      p.last_seen AS lastSeen,
      CASE WHEN p.last_seen IS NOT NULL AND p.last_seen >= datetime('now', '-' || ? || ' seconds') THEN 1 ELSE 0 END AS online,
      COALESCE((SELECT MAX(m2.sent_at) FROM portal_chat_messages m2
        WHERE (m2.from_user = ? AND m2.to_user = u.username) OR (m2.from_user = u.username AND m2.to_user = ?)), '') AS lastMessageAt,
      COALESCE((SELECT COUNT(*) FROM portal_chat_messages m
        WHERE m.to_user = ? AND m.from_user = u.username AND m.read_at IS NULL), 0) AS unread
    FROM auth_users u
    LEFT JOIN portal_chat_presence p ON p.username = u.username
    WHERE u.active = 1 AND u.username <> ? AND u.role IN ('medico','recepcao','coordenacao','admin')
    ORDER BY CASE WHEN lastMessageAt = '' THEN 1 ELSE 0 END, lastMessageAt DESC, online DESC, lower(u.name), u.username`)
    .bind(ONLINE_WINDOW_SECONDS, currentUsername, currentUsername, currentUsername, currentUsername).all();
  const users = await decorateTelemedicineUsers(env, result.results || []);
  const output = [];
  for (const item of users.filter((candidate) => PROFESSIONAL_ROLES.has(candidate.role))) {
    output.push({
      username: item.username,
      socialHandle: await socialHandleForUsername(env, item.username),
      name: item.name || item.username,
      jobTitle: item.jobTitle || '',
      role: item.role,
      avatarDataUrl: item.avatarDataUrl || '',
      online: Number(item.online) === 1,
      lastSeen: item.lastSeen || null,
      lastMessageAt: item.lastMessageAt || null,
      unread: Number(item.unread || 0)
    });
  }
  return output;
}

async function socialFriendContacts(env, currentUsername) {
  if (!socialBackendEnabled(env) || !(await ensureSocialSchema(env))) return [];
  const result = await env.AUTH_DB.prepare(`SELECT
      u.username, u.name, u.job_title AS jobTitle, u.role,
      COALESCE(u.avatar_data, '') AS avatarDataUrl,
      friend.handle AS socialHandle,
      p.last_seen AS lastSeen,
      CASE WHEN p.last_seen IS NOT NULL AND p.last_seen >= datetime('now', '-' || ? || ' seconds') THEN 1 ELSE 0 END AS online,
      COALESCE((SELECT MAX(m2.sent_at) FROM portal_chat_messages m2
        WHERE (m2.from_user = ? AND m2.to_user = u.username) OR (m2.from_user = u.username AND m2.to_user = ?)), '') AS lastMessageAt,
      COALESCE((SELECT COUNT(*) FROM portal_chat_messages m
        WHERE m.to_user = ? AND m.from_user = u.username AND m.read_at IS NULL), 0) AS unread
    FROM social_users viewer
    JOIN social_relationships relationship
      ON relationship.state = 'friends'
      AND (relationship.pair_low = viewer.social_user_id OR relationship.pair_high = viewer.social_user_id)
    JOIN social_users friend ON friend.social_user_id = CASE
      WHEN relationship.pair_low = viewer.social_user_id THEN relationship.pair_high ELSE relationship.pair_low END
    JOIN auth_users u ON u.username = friend.auth_username
    LEFT JOIN portal_chat_presence p ON p.username = u.username
    WHERE viewer.auth_username = ? AND viewer.suspended_at IS NULL
      AND friend.suspended_at IS NULL AND u.active = 1
    ORDER BY CASE WHEN lastMessageAt = '' THEN 1 ELSE 0 END, lastMessageAt DESC, online DESC, lower(u.name), u.username`)
    .bind(ONLINE_WINDOW_SECONDS, currentUsername, currentUsername, currentUsername, currentUsername).all();
  const users = await decorateTelemedicineUsers(env, result.results || []);
  return users.filter((item) => CHAT_ROLES.has(item.role)).map((item) => ({
    username: item.username,
    socialHandle: item.socialHandle || '',
    name: item.name || item.username,
    jobTitle: item.jobTitle || '',
    role: item.role,
    avatarDataUrl: item.avatarDataUrl || '',
    online: Number(item.online) === 1,
    lastSeen: item.lastSeen || null,
    lastMessageAt: item.lastMessageAt || null,
    unread: Number(item.unread || 0)
  }));
}

async function socialFriendContact(env, currentUsername, targetUsername) {
  if (!socialBackendEnabled(env) || !(await ensureSocialSchema(env))) return null;
  const row = await env.AUTH_DB.prepare(`SELECT
      u.username, u.name, u.job_title AS jobTitle, u.role, u.active,
      COALESCE(u.avatar_data, '') AS avatarDataUrl,
      friend.handle AS socialHandle
    FROM social_users viewer
    JOIN social_relationships relationship
      ON relationship.state = 'friends'
      AND (relationship.pair_low = viewer.social_user_id OR relationship.pair_high = viewer.social_user_id)
    JOIN social_users friend ON friend.social_user_id = CASE
      WHEN relationship.pair_low = viewer.social_user_id THEN relationship.pair_high ELSE relationship.pair_low END
    JOIN auth_users u ON u.username = friend.auth_username
    WHERE viewer.auth_username = ? AND u.username = ?
      AND viewer.suspended_at IS NULL AND friend.suspended_at IS NULL
      AND u.active = 1
    LIMIT 1`).bind(currentUsername, targetUsername).first();
  if (!row) return null;
  const decorated = await decorateTelemedicineUser(env, row);
  return CHAT_ROLES.has(decorated.role) ? { ...decorated, socialHandle: row.socialHandle || '' } : null;
}

function mergeContacts(...groups) {
  const merged = new Map();
  for (const group of groups) {
    for (const item of group || []) {
      const key = normalizeUsername(item.username);
      if (!key) continue;
      const previous = merged.get(key);
      merged.set(key, previous
        ? { ...previous, ...item, socialHandle: item.socialHandle || previous.socialHandle || '' }
        : item);
    }
  }
  return Array.from(merged.values()).sort((first, second) => {
    const firstMessage = String(first.lastMessageAt || '');
    const secondMessage = String(second.lastMessageAt || '');
    if (firstMessage !== secondMessage) return secondMessage.localeCompare(firstMessage);
    if (Boolean(first.online) !== Boolean(second.online)) return Number(Boolean(second.online)) - Number(Boolean(first.online));
    return String(first.name || first.username).localeCompare(String(second.name || second.username), 'pt-BR');
  });
}

async function contacts(env, currentUser) {
  const socialFriends = await socialFriendContacts(env, currentUser.username);
  if (PROFESSIONAL_ROLES.has(currentUser.role)) {
    return mergeContacts(await professionalContacts(env, currentUser.username), socialFriends);
  }
  if (currentUser.role === 'cidadao') return socialFriends;
  return [];
}

async function chatContact(env, currentUser, targetUsername) {
  if (PROFESSIONAL_ROLES.has(currentUser.role)) {
    const institutional = await professionalContact(env, targetUsername);
    if (institutional) return institutional;
  }
  if (CHAT_ROLES.has(currentUser.role)) return socialFriendContact(env, currentUser.username, targetUsername);
  return null;
}

async function messages(env, current, other, afterId) {
  if (afterId > 0) {
    const result = await env.AUTH_DB.prepare(`SELECT id, from_user AS fromUser, to_user AS toUser, body,
        sent_at AS sentAt, read_at AS readAt FROM portal_chat_messages
      WHERE id > ? AND ((from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?))
      ORDER BY id ASC LIMIT 200`).bind(afterId, current, other, other, current).all();
    return result.results || [];
  }
  const result = await env.AUTH_DB.prepare(`SELECT * FROM (
      SELECT id, from_user AS fromUser, to_user AS toUser, body, sent_at AS sentAt, read_at AS readAt
      FROM portal_chat_messages WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)
      ORDER BY id DESC LIMIT 120
    ) ORDER BY id ASC`).bind(current, other, other, current).all();
  return result.results || [];
}

export function isChatApi(pathname) {
  return String(pathname || '').startsWith('/api/chat/');
}

export async function handleChatRoute(request, env, origin, originAllowed = true, executionContext = null) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const sessionUser = await validatePortalSession(request, env, []);
  const user = sessionUser ? await decorateTelemedicineUser(env, sessionUser) : null;
  if (!user || !CHAT_ROLES.has(user.role)) {
    return json({ error: 'O chat não está disponível para esta conta.' }, 403, origin);
  }
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
    return json({ users: await contacts(env, { ...user, username }) }, 200, origin);
  }

  if (url.pathname === '/api/chat/messages' && request.method === 'GET') {
    const otherUsername = normalizeUsername(url.searchParams.get('with'));
    const other = await chatContact(env, { ...user, username }, otherUsername);
    if (!other || otherUsername === username) return json({ error: 'Contato não disponível para chat.' }, 404, origin);
    const afterId = Math.max(0, Number.parseInt(url.searchParams.get('after') || '0', 10) || 0);
    const peekOnly = url.searchParams.get('peek') === '1';
    const rows = await messages(env, username, otherUsername, afterId);
    if (!peekOnly) {
      await env.AUTH_DB.prepare(`UPDATE portal_chat_messages SET read_at = CURRENT_TIMESTAMP
        WHERE to_user = ? AND from_user = ? AND read_at IS NULL`).bind(username, otherUsername).run();
    }
    return json({ messages: rows }, 200, origin);
  }

  if (url.pathname === '/api/chat/messages' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const to = normalizeUsername(body.to);
    const message = String(body.body || '').trim();
    if (!message) return json({ error: 'Digite uma mensagem.' }, 400, origin);
    if (message.length > MESSAGE_LIMIT) return json({ error: `A mensagem pode ter no máximo ${MESSAGE_LIMIT} caracteres.` }, 400, origin);
    if (to === username) return json({ error: 'Escolha outro usuário para conversar.' }, 400, origin);
    if (!(await chatContact(env, { ...user, username }, to))) return json({ error: 'Contato não disponível para chat.' }, 404, origin);
    const inserted = await env.AUTH_DB.prepare('INSERT INTO portal_chat_messages(from_user, to_user, body) VALUES (?, ?, ?)')
      .bind(username, to, message).run();
    const id = Number(inserted.meta?.last_row_id || 0);
    const row = id ? await env.AUTH_DB.prepare(`SELECT id, from_user AS fromUser, to_user AS toUser, body,
      sent_at AS sentAt, read_at AS readAt FROM portal_chat_messages WHERE id = ?`).bind(id).first() : null;
    const pushTask = notifyUserPush(env, to).catch(() => ({ attempted: 0, accepted: 0 }));
    if (executionContext?.waitUntil) executionContext.waitUntil(pushTask);
    else await pushTask;
    return json({ message: row || { id, fromUser: username, toUser: to, body: message } }, 201, origin);
  }

  return json({ error: 'Rota do chat não encontrada.' }, 404, origin);
}
