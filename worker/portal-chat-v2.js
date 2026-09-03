'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import { decorateTelemedicineUser, decorateTelemedicineUsers } from './telemedicine-access.js';
import { recordUsageHeartbeat } from './usage-monitor.js';

const MESSAGE_LIMIT = 2000;
const ONLINE_WINDOW_SECONDS = 75;
const PROFESSIONAL_ROLES = new Set(['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin']);

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

async function contacts(env, currentUsername) {
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
  return users.filter((item) => PROFESSIONAL_ROLES.has(item.role)).map((item) => ({
    username: item.username,
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

export async function handleChatRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const user = await validatePortalSession(request, env, ['medico', 'recepcao', 'telemedicina']);
  if (!user || !PROFESSIONAL_ROLES.has(user.role)) {
    return json({ error: 'O chat direto é restrito aos profissionais autorizados.' }, 403, origin);
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
    return json({ users: await contacts(env, username) }, 200, origin);
  }

  if (url.pathname === '/api/chat/messages' && request.method === 'GET') {
    const otherUsername = normalizeUsername(url.searchParams.get('with'));
    const other = await professionalContact(env, otherUsername);
    if (!other || otherUsername === username) return json({ error: 'Contato profissional não encontrado.' }, 404, origin);
    const afterId = Math.max(0, Number.parseInt(url.searchParams.get('after') || '0', 10) || 0);
    const rows = await messages(env, username, otherUsername, afterId);
    await env.AUTH_DB.prepare(`UPDATE portal_chat_messages SET read_at = CURRENT_TIMESTAMP
      WHERE to_user = ? AND from_user = ? AND read_at IS NULL`).bind(username, otherUsername).run();
    return json({ messages: rows }, 200, origin);
  }

  if (url.pathname === '/api/chat/messages' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const to = normalizeUsername(body.to);
    const message = String(body.body || '').trim();
    if (!message) return json({ error: 'Digite uma mensagem.' }, 400, origin);
    if (message.length > MESSAGE_LIMIT) return json({ error: `A mensagem pode ter no máximo ${MESSAGE_LIMIT} caracteres.` }, 400, origin);
    if (to === username) return json({ error: 'Escolha outro usuário para conversar.' }, 400, origin);
    if (!(await professionalContact(env, to))) return json({ error: 'Contato profissional não encontrado.' }, 404, origin);
    const inserted = await env.AUTH_DB.prepare('INSERT INTO portal_chat_messages(from_user, to_user, body) VALUES (?, ?, ?)')
      .bind(username, to, message).run();
    const id = Number(inserted.meta?.last_row_id || 0);
    const row = id ? await env.AUTH_DB.prepare(`SELECT id, from_user AS fromUser, to_user AS toUser, body,
      sent_at AS sentAt, read_at AS readAt FROM portal_chat_messages WHERE id = ?`).bind(id).first() : null;
    return json({ message: row || { id, fromUser: username, toUser: to, body: message } }, 201, origin);
  }

  return json({ error: 'Rota do chat não encontrada.' }, 404, origin);
}
