'use strict';

import { verifyPortalSessionToken } from './auth-management-v2.js';
import { decorateTelemedicineUsers } from './telemedicine-access.js';
import { recordUsageHeartbeat } from './usage-monitor.js';
import { notifyUserPush } from './push-notifications.js';
import { ensureSocialSchema } from './social-schema.js';
import { handleGroupRoute } from './chat-groups.js';
import {
  broadcastChatRealtime,
  configureChatRealtimeContacts,
  createChatRealtimeTicket,
  probeChatRealtime,
  realtimeTicketFromRequest,
  upgradeChatRealtime,
  verifyChatRealtimeTicket
} from './chat-realtime.js';

const MESSAGE_LIMIT = 2000;
const MESSAGE_HISTORY_PAGE_SIZE = 120;
const ONLINE_WINDOW_SECONDS = 75;
const PROFESSIONAL_ROLES = new Set(['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin']);
const CHAT_ROLES = new Set([...PROFESSIONAL_ROLES, 'cidadao']);
const chatSchemaPromises = new WeakMap();

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

async function createChatSchema(env) {
  if (!env.AUTH_DB) return false;
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_chat_presence (
    username TEXT PRIMARY KEY, last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    body TEXT NOT NULL,
    client_id TEXT,
    sent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivered_at TEXT,
    read_at TEXT
  )`).run();
  const messageColumns = await env.AUTH_DB.prepare('PRAGMA table_info(portal_chat_messages)').all();
  const messageColumnNames = new Set((messageColumns.results || []).map((column) => String(column.name || '')));
  if (!messageColumnNames.has('delivered_at')) {
    try {
      await env.AUTH_DB.prepare('ALTER TABLE portal_chat_messages ADD COLUMN delivered_at TEXT').run();
    } catch (error) {
      if (!/duplicate column/i.test(String(error?.message || error))) throw error;
    }
  }
  if (!messageColumnNames.has('client_id')) {
    try {
      await env.AUTH_DB.prepare('ALTER TABLE portal_chat_messages ADD COLUMN client_id TEXT').run();
    } catch (error) {
      if (!/duplicate column/i.test(String(error?.message || error))) throw error;
    }
  }
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_chat_conversation ON portal_chat_messages(from_user, to_user, id)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_chat_unread ON portal_chat_messages(to_user, read_at, from_user)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_chat_undelivered ON portal_chat_messages(to_user, delivered_at, from_user)').run();
  await env.AUTH_DB.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_client_message
    ON portal_chat_messages(from_user, client_id) WHERE client_id IS NOT NULL`).run();
  return true;
}

async function chatSchemaReady(env) {
  try {
    await env.AUTH_DB.prepare(`SELECT m.client_id, m.delivered_at, p.username
      FROM portal_chat_messages m
      LEFT JOIN portal_chat_presence p ON 1 = 0
      WHERE 0`).all();
    return true;
  } catch (_) {
    return false;
  }
}

async function ensureSchema(env) {
  if (!env.AUTH_DB || (typeof env.AUTH_DB !== 'object' && typeof env.AUTH_DB !== 'function')) return false;
  if (!chatSchemaPromises.has(env.AUTH_DB)) {
    const operation = (async () => {
      if (await chatSchemaReady(env)) return true;
      return createChatSchema(env);
    })().catch((error) => {
      chatSchemaPromises.delete(env.AUTH_DB);
      throw error;
    });
    chatSchemaPromises.set(env.AUTH_DB, operation);
  }
  return chatSchemaPromises.get(env.AUTH_DB);
}

async function touchPresence(env, username) {
  await env.AUTH_DB.prepare(`INSERT INTO portal_chat_presence(username, last_seen) VALUES (?, CURRENT_TIMESTAMP)
    ON CONFLICT(username) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`).bind(username).run();
}

async function activeChatUser(env, username) {
  const row = await env.AUTH_DB.prepare(`SELECT username, name, job_title AS jobTitle, role,
      active, session_version AS sessionVersion
    FROM auth_users WHERE username = ? AND active = 1 LIMIT 1`).bind(username).first();
  if (!row || !CHAT_ROLES.has(String(row.role || ''))) return null;
  return row;
}

async function validateChatSession(request, env) {
  const tokenUser = await verifyPortalSessionToken(request, env);
  if (!tokenUser || !env.AUTH_DB) return null;
  const row = await env.AUTH_DB.prepare(`SELECT username, name, job_title AS jobTitle, role,
      council_role AS councilRole, email_verified AS emailVerified,
      active, session_version AS sessionVersion
    FROM auth_users WHERE username = ? LIMIT 1`).bind(tokenUser.username).first();
  if (!row || Number(row.active || 0) !== 1) return null;
  if (Number(row.sessionVersion || 0) !== Number(tokenUser.sessionVersion || 0)) return null;
  if (!CHAT_ROLES.has(String(row.role || ''))) return null;
  return {
    username: normalizeUsername(row.username),
    name: row.name || row.username,
    jobTitle: row.jobTitle || '',
    role: String(row.role || ''),
    councilRole: String(row.councilRole || ''),
    emailVerified: Number(row.emailVerified || 0) === 1,
    active: true,
    sessionVersion: Number(row.sessionVersion || 0)
  };
}

function chatEmailVerificationBlocked(env, user) {
  if (String(env.AUTH_REQUIRE_EMAIL_VERIFICATION || '').toLowerCase() !== 'true') return false;
  const professional = PROFESSIONAL_ROLES.has(user?.role);
  const council = ['membro', 'presidente'].includes(user?.councilRole);
  return Boolean((professional || council) && !user?.emailVerified);
}

function runBackground(executionContext, promise) {
  const task = Promise.resolve(promise).catch(() => false);
  if (executionContext?.waitUntil) executionContext.waitUntil(task);
  return task;
}

async function professionalContactAllowed(env, username) {
  const row = await env.AUTH_DB.prepare(`SELECT 1 AS allowed
    FROM auth_users
    WHERE username = ? AND active = 1
      AND role IN ('medico','recepcao','coordenacao','telemedicina','admin')
    LIMIT 1`).bind(username).first();
  return Boolean(row?.allowed);
}

function socialBackendEnabled(env) {
  return String(env.SOCIAL_BACKEND_ENABLED || '').trim().toLowerCase() === 'true';
}

async function professionalContacts(env, currentUsername) {
  let socialReady = false;
  if (socialBackendEnabled(env)) {
    try { socialReady = Boolean(await ensureSocialSchema(env)); } catch (_) { socialReady = false; }
  }
  const socialHandleSelect = socialReady ? "COALESCE(social.handle, '') AS socialHandle," : "'' AS socialHandle,";
  const socialJoin = socialReady ? 'LEFT JOIN social_users social ON social.auth_username = u.username' : '';
  const result = await env.AUTH_DB.prepare(`SELECT
      u.username, u.name, u.job_title AS jobTitle, u.role,
      COALESCE(u.avatar_data, '') AS avatarDataUrl,
      ${socialHandleSelect}
      p.last_seen AS lastSeen,
      CASE WHEN p.last_seen IS NOT NULL AND p.last_seen >= datetime('now', '-' || ? || ' seconds') THEN 1 ELSE 0 END AS online,
      COALESCE((SELECT MAX(m2.sent_at) FROM portal_chat_messages m2
        WHERE (m2.from_user = ? AND m2.to_user = u.username) OR (m2.from_user = u.username AND m2.to_user = ?)), '') AS lastMessageAt,
      COALESCE((SELECT COUNT(*) FROM portal_chat_messages m
        WHERE m.to_user = ? AND m.from_user = u.username AND m.read_at IS NULL), 0) AS unread,
      COALESCE((SELECT MIN(m3.id) FROM portal_chat_messages m3
        WHERE m3.to_user = ? AND m3.from_user = u.username AND m3.read_at IS NULL), 0) AS firstUnreadId
    FROM auth_users u
    LEFT JOIN portal_chat_presence p ON p.username = u.username
    ${socialJoin}
    WHERE u.active = 1 AND u.username <> ? AND u.role IN ('medico','recepcao','coordenacao','admin')
    ORDER BY CASE WHEN lastMessageAt = '' THEN 1 ELSE 0 END, lastMessageAt DESC, online DESC, lower(u.name), u.username`)
    .bind(ONLINE_WINDOW_SECONDS, currentUsername, currentUsername, currentUsername, currentUsername, currentUsername).all();
  const users = await decorateTelemedicineUsers(env, result.results || []);
  return users.filter((candidate) => PROFESSIONAL_ROLES.has(candidate.role)).map((item) => ({
    username: item.username,
    socialHandle: item.socialHandle || '',
    name: item.name || item.username,
    jobTitle: item.jobTitle || '',
    role: item.role,
    avatarDataUrl: item.avatarDataUrl || '',
    online: Number(item.online) === 1,
    lastSeen: item.lastSeen || null,
    lastMessageAt: item.lastMessageAt || null,
    unread: Number(item.unread || 0),
    firstUnreadId: Number(item.firstUnreadId || 0)
  }));
}

async function socialFriendContacts(env, currentUsername, options = {}) {
  if (!socialBackendEnabled(env) || !(await ensureSocialSchema(env))) return [];
  const citizenOnlyClause = options.citizenOnly === true ? " AND u.role = 'cidadao'" : '';
  const result = await env.AUTH_DB.prepare(`SELECT
      u.username, u.name, u.job_title AS jobTitle, u.role,
      COALESCE(u.avatar_data, '') AS avatarDataUrl,
      friend.handle AS socialHandle,
      p.last_seen AS lastSeen,
      CASE WHEN p.last_seen IS NOT NULL AND p.last_seen >= datetime('now', '-' || ? || ' seconds') THEN 1 ELSE 0 END AS online,
      COALESCE((SELECT MAX(m2.sent_at) FROM portal_chat_messages m2
        WHERE (m2.from_user = ? AND m2.to_user = u.username) OR (m2.from_user = u.username AND m2.to_user = ?)), '') AS lastMessageAt,
      COALESCE((SELECT COUNT(*) FROM portal_chat_messages m
        WHERE m.to_user = ? AND m.from_user = u.username AND m.read_at IS NULL), 0) AS unread,
      COALESCE((SELECT MIN(m3.id) FROM portal_chat_messages m3
        WHERE m3.to_user = ? AND m3.from_user = u.username AND m3.read_at IS NULL), 0) AS firstUnreadId
    FROM social_users viewer
    JOIN social_relationships relationship
      ON relationship.state = 'friends'
      AND (relationship.pair_low = viewer.social_user_id OR relationship.pair_high = viewer.social_user_id)
    JOIN social_users friend ON friend.social_user_id = CASE
      WHEN relationship.pair_low = viewer.social_user_id THEN relationship.pair_high ELSE relationship.pair_low END
    JOIN auth_users u ON u.username = friend.auth_username
    LEFT JOIN portal_chat_presence p ON p.username = u.username
    WHERE viewer.auth_username = ? AND viewer.suspended_at IS NULL
      AND friend.suspended_at IS NULL AND u.active = 1${citizenOnlyClause}
    ORDER BY CASE WHEN lastMessageAt = '' THEN 1 ELSE 0 END, lastMessageAt DESC, online DESC, lower(u.name), u.username`)
    .bind(ONLINE_WINDOW_SECONDS, currentUsername, currentUsername, currentUsername, currentUsername, currentUsername).all();
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
    unread: Number(item.unread || 0),
    firstUnreadId: Number(item.firstUnreadId || 0)
  }));
}

async function socialFriendAllowed(env, currentUsername, targetUsername) {
  if (!socialBackendEnabled(env) || !(await ensureSocialSchema(env))) return false;
  const row = await env.AUTH_DB.prepare(`SELECT 1 AS allowed
    FROM social_users viewer
    JOIN social_relationships relationship
      ON relationship.state = 'friends'
      AND (relationship.pair_low = viewer.social_user_id OR relationship.pair_high = viewer.social_user_id)
    JOIN social_users friend ON friend.social_user_id = CASE
      WHEN relationship.pair_low = viewer.social_user_id THEN relationship.pair_high ELSE relationship.pair_low END
    JOIN auth_users target ON target.username = friend.auth_username
    WHERE viewer.auth_username = ? AND friend.auth_username = ?
      AND viewer.suspended_at IS NULL AND friend.suspended_at IS NULL
      AND target.active = 1
    LIMIT 1`).bind(currentUsername, targetUsername).first();
  return Boolean(row?.allowed);
}

async function chatContactAllowed(env, currentUser, targetUsername) {
  const target = normalizeUsername(targetUsername);
  if (!target || target === normalizeUsername(currentUser?.username)) return false;
  if (PROFESSIONAL_ROLES.has(currentUser?.role) && await professionalContactAllowed(env, target)) return true;
  if (CHAT_ROLES.has(currentUser?.role)) return socialFriendAllowed(env, currentUser.username, target);
  return false;
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
  if (PROFESSIONAL_ROLES.has(currentUser.role)) {
    const [institutional, citizenFriends] = await Promise.all([
      professionalContacts(env, currentUser.username),
      socialFriendContacts(env, currentUser.username, { citizenOnly: true })
    ]);
    return mergeContacts(institutional, citizenFriends);
  }
  if (currentUser.role === 'cidadao') return socialFriendContacts(env, currentUser.username);
  return [];
}


async function receiptState(env, current, other) {
  const row = await env.AUTH_DB.prepare(`SELECT
      COALESCE(MAX(CASE WHEN from_user = ? AND to_user = ? AND delivered_at IS NOT NULL THEN id END), 0) AS deliveredThroughId,
      COALESCE(MAX(CASE WHEN from_user = ? AND to_user = ? AND read_at IS NOT NULL THEN id END), 0) AS readThroughId
    FROM portal_chat_messages`).bind(current, other, current, other).first();
  return {
    deliveredThroughId: Number(row?.deliveredThroughId || 0),
    readThroughId: Number(row?.readThroughId || 0)
  };
}

async function markChatDelivered(env, username) {
  const pending = await env.AUTH_DB.prepare(`SELECT from_user AS fromUser, MAX(id) AS deliveredThroughId
    FROM portal_chat_messages
    WHERE to_user = ? AND delivered_at IS NULL
    GROUP BY from_user`).bind(username).all();
  const result = await env.AUTH_DB.prepare(`UPDATE portal_chat_messages
    SET delivered_at = CURRENT_TIMESTAMP
    WHERE to_user = ? AND delivered_at IS NULL`).bind(username).run();
  return {
    changed: Number(result.meta?.changes || 0),
    receipts: (pending.results || []).map((row) => ({
      fromUser: normalizeUsername(row.fromUser),
      deliveredThroughId: Number(row.deliveredThroughId || 0)
    })).filter((row) => row.fromUser && row.deliveredThroughId > 0)
  };
}

async function unreadThroughId(env, username, otherUsername, throughId = 0) {
  const limitClause = throughId > 0 ? ' AND id <= ?' : '';
  const statement = env.AUTH_DB.prepare(`SELECT COALESCE(MAX(id), 0) AS maxId
    FROM portal_chat_messages
    WHERE to_user = ? AND from_user = ? AND read_at IS NULL${limitClause}`);
  const row = throughId > 0
    ? await statement.bind(username, otherUsername, throughId).first()
    : await statement.bind(username, otherUsername).first();
  return Number(row?.maxId || 0);
}

async function markConversationRead(env, username, otherUsername, throughId = 0) {
  const maxId = await unreadThroughId(env, username, otherUsername, throughId);
  if (!maxId) return 0;
  await env.AUTH_DB.prepare(`UPDATE portal_chat_messages
    SET delivered_at = COALESCE(delivered_at, CURRENT_TIMESTAMP),
        read_at = CURRENT_TIMESTAMP
    WHERE to_user = ? AND from_user = ? AND id <= ? AND read_at IS NULL`)
    .bind(username, otherUsername, maxId).run();
  return maxId;
}

async function messages(env, current, other, afterId, beforeId = 0) {
  if (afterId > 0) {
    const result = await env.AUTH_DB.prepare(`SELECT id, from_user AS fromUser, to_user AS toUser, body, client_id AS clientId,
        sent_at AS sentAt, delivered_at AS deliveredAt, read_at AS readAt FROM portal_chat_messages
      WHERE id > ? AND ((from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?))
      ORDER BY id ASC LIMIT 200`).bind(afterId, current, other, other, current).all();
    return result.results || [];
  }
  if (beforeId > 0) {
    const result = await env.AUTH_DB.prepare(`SELECT * FROM (
        SELECT id, from_user AS fromUser, to_user AS toUser, body, client_id AS clientId, sent_at AS sentAt, delivered_at AS deliveredAt, read_at AS readAt
        FROM portal_chat_messages
        WHERE id < ? AND ((from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?))
        ORDER BY id DESC LIMIT ${MESSAGE_HISTORY_PAGE_SIZE}
      ) ORDER BY id ASC`).bind(beforeId, current, other, other, current).all();
    return result.results || [];
  }
  const result = await env.AUTH_DB.prepare(`SELECT * FROM (
      SELECT id, from_user AS fromUser, to_user AS toUser, body, client_id AS clientId, sent_at AS sentAt, delivered_at AS deliveredAt, read_at AS readAt
      FROM portal_chat_messages WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)
      ORDER BY id DESC LIMIT ${MESSAGE_HISTORY_PAGE_SIZE}
    ) ORDER BY id ASC`).bind(current, other, other, current).all();
  return result.results || [];
}

export function isChatApi(pathname) {
  return String(pathname || '').startsWith('/api/chat/');
}

export async function handleChatRoute(request, env, origin, originAllowed = true, executionContext = null) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const url = new URL(request.url);
  const requestStartedAt = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

  if (url.pathname === '/api/chat/realtime/health' && request.method === 'GET') {
    const ok = await probeChatRealtime(env);
    return json({ ok }, ok ? 200 : 503, origin);
  }

  if (url.pathname === '/api/chat/realtime' && request.method === 'GET') {
    if (String(request.headers.get('Upgrade') || '').toLowerCase() !== 'websocket') {
      return json({ error: 'Conexão em tempo real requer WebSocket.' }, 426, origin);
    }
    const ticket = realtimeTicketFromRequest(request);
    const verified = await verifyChatRealtimeTicket(env, ticket);
    if (!verified) return json({ error: 'Sessão de tempo real inválida ou expirada.' }, 401, origin);
    if (!(await ensureSchema(env))) return json({ error: 'Banco do chat ainda não disponível.' }, 503, origin);

    const realtimeUser = await activeChatUser(env, verified.username);
    if (!realtimeUser) return json({ error: 'O chat não está disponível para esta conta.' }, 403, origin);
    if (Number(realtimeUser.sessionVersion || 0) !== Number(verified.sessionVersion || 0)) {
      return json({ error: 'Sessão de tempo real inválida ou expirada.' }, 401, origin);
    }
    const username = normalizeUsername(realtimeUser.username);
    await touchPresence(env, username);
    return upgradeChatRealtime(request, env, username, verified.sessionVersion);
  }

  const user = await validateChatSession(request, env);
  if (!user) {
    return json({ error: 'O chat não está disponível para esta conta.' }, 403, origin);
  }
  if (chatEmailVerificationBlocked(env, user)) {
    return json({
      error: 'Confirme o e-mail de segurança da sua conta para continuar.',
      code: 'EMAIL_VERIFICATION_REQUIRED',
      verificationPath: '/seguranca/?verificar-email=1'
    }, 403, origin);
  }
  if (!(await ensureSchema(env))) return json({ error: 'Banco do chat ainda não disponível.' }, 503, origin);

  const username = normalizeUsername(user.username);

  if (url.pathname === '/api/chat/groups' || url.pathname.startsWith('/api/chat/groups/')) {
    return handleGroupRoute(request, env, user, origin, executionContext);
  }

  if (url.pathname === '/api/chat/presence' && request.method === 'POST') {
    await touchPresence(env, username);
    const body = await request.json().catch(() => ({}));
    await recordUsageHeartbeat(env, username, body).catch(() => {});
    return json({ ok: true }, 200, origin);
  }

  if (url.pathname === '/api/chat/realtime/ticket' && request.method === 'POST') {
    const issued = await createChatRealtimeTicket(env, username, user.sessionVersion);
    if (!issued) return json({ error: 'Tempo real temporariamente indisponível.' }, 503, origin);
    return json(issued, 200, origin);
  }

  if (url.pathname === '/api/chat/users' && request.method === 'GET') {
    await touchPresence(env, username);
    const users = await contacts(env, { ...user, username });
    await configureChatRealtimeContacts(env, username, users.map((item) => item.username)).catch(() => false);
    return json({ users }, 200, origin);
  }

  if (url.pathname === '/api/chat/typing' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const otherUsername = normalizeUsername(body.with);
    if (!otherUsername || otherUsername === username || !(await chatContactAllowed(env, { ...user, username }, otherUsername))) {
      return json({ error: 'Contato não disponível para chat.' }, 404, origin);
    }
    const active = Boolean(body.active);
    runBackground(executionContext, broadcastChatRealtime(env, otherUsername, {
      type: 'typing',
      username,
      active,
      expiresAt: active ? Date.now() + 4000 : Date.now()
    }));
    return json({ ok: true }, 200, origin);
  }

  if (url.pathname === '/api/chat/delivery' && request.method === 'POST') {
    await touchPresence(env, username);
    const delivered = await markChatDelivered(env, username);
    for (const receipt of delivered.receipts) {
      runBackground(executionContext, broadcastChatRealtime(env, receipt.fromUser, {
        type: 'receipt',
        with: username,
        deliveredThroughId: receipt.deliveredThroughId
      }));
    }
    return json({ ok: true, delivered: delivered.changed }, 200, origin);
  }

  if (url.pathname === '/api/chat/read' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const otherUsername = normalizeUsername(body.with);
    const throughId = Math.max(0, Number.parseInt(String(body.throughId || '0'), 10) || 0);
    if (!otherUsername || otherUsername === username || !(await chatContactAllowed(env, { ...user, username }, otherUsername))) {
      return json({ error: 'Contato não disponível para chat.' }, 404, origin);
    }
    const readThroughId = await markConversationRead(env, username, otherUsername, throughId);
    if (readThroughId > 0) {
      runBackground(executionContext, broadcastChatRealtime(env, otherUsername, {
        type: 'receipt',
        with: username,
        deliveredThroughId: readThroughId,
        readThroughId
      }));
    }
    return json({ ok: true, readThroughId }, 200, origin);
  }

  if (url.pathname === '/api/chat/messages' && request.method === 'GET') {
    const otherUsername = normalizeUsername(url.searchParams.get('with'));
    const allowed = await chatContactAllowed(env, { ...user, username }, otherUsername);
    if (!allowed || otherUsername === username) return json({ error: 'Contato não disponível para chat.' }, 404, origin);
    const afterId = Math.max(0, Number.parseInt(url.searchParams.get('after') || '0', 10) || 0);
    const beforeId = Math.max(0, Number.parseInt(url.searchParams.get('before') || '0', 10) || 0);
    const peekOnly = url.searchParams.get('peek') === '1';
    const rows = await messages(env, username, otherUsername, afterId, beforeId);
    if (!peekOnly) {
      const readThroughId = await markConversationRead(env, username, otherUsername);
      if (readThroughId > 0) {
        runBackground(executionContext, broadcastChatRealtime(env, otherUsername, {
          type: 'receipt',
          with: username,
          deliveredThroughId: readThroughId,
          readThroughId
        }));
      }
    }
    const receipt = await receiptState(env, username, otherUsername);
    return json({ messages: rows, pageSize: MESSAGE_HISTORY_PAGE_SIZE, receipt }, 200, origin);
  }

  if (url.pathname === '/api/chat/messages' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const to = normalizeUsername(body.to);
    const message = String(body.body || '').trim();
    const clientId = String(body.clientId || '').trim().slice(0, 96);
    if (!message) return json({ error: 'Digite uma mensagem.' }, 400, origin);
    if (message.length > MESSAGE_LIMIT) return json({ error: `A mensagem pode ter no máximo ${MESSAGE_LIMIT} caracteres.` }, 400, origin);
    if (clientId && !/^chat-[a-z0-9-]{12,90}$/i.test(clientId)) return json({ error: 'Identificador de envio inválido.' }, 400, origin);
    if (to === username) return json({ error: 'Escolha outro usuário para conversar.' }, 400, origin);
    if (!(await chatContactAllowed(env, { ...user, username }, to))) return json({ error: 'Contato não disponível para chat.' }, 404, origin);

    const sentAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const writeStartedAt = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    let row = null;
    let created = true;

    if (clientId) {
      const inserted = await env.AUTH_DB.prepare(`INSERT OR IGNORE INTO portal_chat_messages
        (from_user, to_user, body, client_id, sent_at)
        VALUES (?, ?, ?, ?, ?)`).bind(username, to, message, clientId, sentAt).run();
      const changed = Number(inserted.meta?.changes || 0);
      const id = Number(inserted.meta?.last_row_id || 0);
      if (changed > 0 && id > 0) {
        row = {
          id,
          fromUser: username,
          toUser: to,
          body: message,
          clientId,
          sentAt,
          deliveredAt: null,
          readAt: null
        };
      } else {
        row = await env.AUTH_DB.prepare(`SELECT id, from_user AS fromUser, to_user AS toUser, body,
          client_id AS clientId, sent_at AS sentAt, delivered_at AS deliveredAt, read_at AS readAt
          FROM portal_chat_messages WHERE from_user = ? AND client_id = ? LIMIT 1`).bind(username, clientId).first();
        created = false;
      }
    } else {
      const inserted = await env.AUTH_DB.prepare(`INSERT INTO portal_chat_messages
        (from_user, to_user, body, sent_at) VALUES (?, ?, ?, ?)`)
        .bind(username, to, message, sentAt).run();
      const id = Number(inserted.meta?.last_row_id || 0);
      row = id ? {
        id,
        fromUser: username,
        toUser: to,
        body: message,
        clientId: '',
        sentAt,
        deliveredAt: null,
        readAt: null
      } : null;
    }

    const confirmed = row || { id: 0, fromUser: username, toUser: to, body: message, clientId, sentAt, deliveredAt: null, readAt: null };
    const writeFinishedAt = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    const pushTask = created ? notifyUserPush(env, to).catch(() => ({ attempted: 0, accepted: 0 })) : Promise.resolve({ attempted: 0, accepted: 0 });
    const realtimeTask = confirmed.id
      ? broadcastChatRealtime(env, to, { type: 'message', message: confirmed })
      : Promise.resolve(false);
    if (executionContext?.waitUntil) {
      executionContext.waitUntil(Promise.allSettled([pushTask, realtimeTask]));
    } else {
      await Promise.allSettled([pushTask, realtimeTask]);
    }

    const finishedAt = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    const ackMs = Math.max(0, finishedAt - requestStartedAt);
    const writeMs = Math.max(0, writeFinishedAt - writeStartedAt);
    console.log(JSON.stringify({
      event: 'chat_send_ack',
      created,
      ackMs: Math.round(ackMs),
      writeMs: Math.round(writeMs)
    }));
    const response = json({ message: confirmed, duplicate: !created }, created ? 201 : 200, origin);
    response.headers.set('Server-Timing', `chat_ack;dur=${ackMs.toFixed(1)}, d1_write;dur=${writeMs.toFixed(1)}`);
    response.headers.set('X-Portal-Chat-Ack-Ms', String(Math.round(ackMs)));
    return response;
  }

  return json({ error: 'Rota do chat não encontrada.' }, 404, origin);
}
