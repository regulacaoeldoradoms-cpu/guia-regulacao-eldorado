'use strict';

import { ensureSocialSchema } from './social-schema.js';
import { broadcastChatRealtime } from './chat-realtime.js';
import { notifyUserPush } from './push-notifications.js';

// Independent, additive tables. Direct-message history and permissions are untouched.
export const GROUP_LIMITS = Object.freeze({ members: 20, joined: 100, owned: 20, createsPerDay: 5, message: 2000, page: 80 });
const schemas = new WeakMap();
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const USER = /^[a-z0-9][a-z0-9._-]{0,39}$/;
const CLIENT = /^group-[a-z0-9-]{12,90}$/i;
const VERSION = 'groups-v1';
const ACTOR = `WITH actor AS (
  SELECT u.username, s.social_user_id FROM auth_users u
  JOIN social_users s ON s.auth_username = u.username
  WHERE u.username = ? AND u.session_version = ? AND u.active = 1 AND s.suspended_at IS NULL
    AND u.role IN ('admin','medico','recepcao','coordenacao','telemedicina','cidadao')
)`;
// Membership is independent of friendship AFTER admission; loss of friendship does
// not silently remove members. A new invitation/acceptance always checks the founder.
const ACCESS = `EXISTS (SELECT 1 FROM portal_chat_group_members access
  JOIN actor ON actor.username = access.username
  WHERE access.group_id = g.id AND access.state = 'member')`;
const ADMIN = `EXISTS (SELECT 1 FROM portal_chat_group_members access
  JOIN actor ON actor.username = access.username
  WHERE access.group_id = g.id AND access.state = 'member' AND access.role IN ('owner','admin'))`;
const FRIEND = `(SELECT 1 FROM social_users founder
  JOIN auth_users owner ON owner.username = founder.auth_username AND owner.active = 1
  JOIN social_relationships r ON r.state = 'friends'
    AND (r.pair_low = founder.social_user_id OR r.pair_high = founder.social_user_id)
  JOIN social_users friend ON friend.social_user_id = CASE WHEN r.pair_low = founder.social_user_id THEN r.pair_high ELSE r.pair_low END
  JOIN auth_users eligible_user ON eligible_user.username = friend.auth_username AND eligible_user.active = 1
  WHERE founder.auth_username = g.creator_username AND friend.auth_username = candidate_name
    AND founder.suspended_at IS NULL AND friend.suspended_at IS NULL
    AND eligible_user.role IN ('admin','medico','recepcao','coordenacao','telemedicina','cidadao') LIMIT 1)`;
const GROUP_COLUMNS = `g.id, g.name, g.description, g.creator_username AS creatorUsername,
  (g.avatar_data <> '') AS avatarAvailable, g.avatar_version AS avatarVersion, g.closed, g.created_at AS createdAt, g.updated_at AS updatedAt`;
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS portal_chat_groups (
    id TEXT PRIMARY KEY, creator_username TEXT NOT NULL, client_id TEXT NOT NULL,
    name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 80), description TEXT NOT NULL DEFAULT '',
    avatar_data TEXT NOT NULL DEFAULT '', avatar_version TEXT NOT NULL DEFAULT '', closed INTEGER NOT NULL DEFAULT 0 CHECK(closed IN (0,1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(creator_username, client_id))`,
  `CREATE TABLE IF NOT EXISTS portal_chat_group_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT, group_id TEXT NOT NULL REFERENCES portal_chat_groups(id),
    username TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('owner','admin','member')),
    state TEXT NOT NULL CHECK(state IN ('invited','member','left','removed','declined')),
    joined_after INTEGER NOT NULL DEFAULT 0, departed_after INTEGER, joined_at TEXT,
    delivered_through INTEGER NOT NULL DEFAULT 0, read_through INTEGER NOT NULL DEFAULT 0,
    muted INTEGER NOT NULL DEFAULT 0 CHECK(muted IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_group_current_member ON portal_chat_group_members(group_id,username) WHERE state IN ('invited','member')`,
  `CREATE INDEX IF NOT EXISTS idx_chat_groups_for_user ON portal_chat_group_members(username,state,group_id)`,
  `CREATE INDEX IF NOT EXISTS idx_chat_group_member_history ON portal_chat_group_members(group_id,joined_after,departed_after)`,
  `CREATE TABLE IF NOT EXISTS portal_chat_group_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, group_id TEXT NOT NULL REFERENCES portal_chat_groups(id),
    from_user TEXT NOT NULL, client_id TEXT NOT NULL, body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 2000),
    sent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(group_id,from_user,client_id))`,
  `CREATE INDEX IF NOT EXISTS idx_chat_group_history ON portal_chat_group_messages(group_id,id)`,
  `CREATE INDEX IF NOT EXISTS idx_chat_group_send_rate ON portal_chat_group_messages(from_user,sent_at)`,
  `CREATE INDEX IF NOT EXISTS idx_chat_group_create_rate ON portal_chat_groups(creator_username,created_at)`
];

export async function ensureGroupSchema(env) {
  if (String(env.CHAT_GROUPS_ENABLED).toLowerCase() !== 'true' || !(await ensureSocialSchema(env))) return false;
  if (!schemas.has(env.AUTH_DB)) {
    const pending = (async () => {
      const done = await env.AUTH_DB.prepare('SELECT version FROM social_schema_migrations WHERE version=?').bind(VERSION).first();
      if (!done) await env.AUTH_DB.batch([...SCHEMA.map(sql => env.AUTH_DB.prepare(sql)), env.AUTH_DB.prepare('INSERT OR IGNORE INTO social_schema_migrations(version,details) VALUES (?,?)').bind(VERSION,'Grupos privados do chat')]);
      return true;
    })().catch(error => { schemas.delete(env.AUTH_DB); throw error; });
    schemas.set(env.AUTH_DB, pending);
  }
  return schemas.get(env.AUTH_DB);
}
function query(env, user, sql, ...args) {
  return env.AUTH_DB.prepare(ACTOR + '\n' + sql).bind(user.username, user.sessionVersion, ...args);
}
function rows(result) { return result?.results || []; }
function failure(code, message, status = 400) { throw Object.assign(new Error(message), { code, status }); }
function number(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 0) failure('GROUP_CURSOR_INVALID', 'Marcador de histórico inválido.');
  return n;
}
function members(value) {
  if (!Array.isArray(value) || !value.length || value.length >= GROUP_LIMITS.members || value.some(v => typeof v !== 'string' || !USER.test(v))) {
    failure('GROUP_MEMBERS_INVALID', 'Selecione de 1 a 19 amigos para convidar.');
  }
  return [...new Set(value)];
}
function details(value) {
  if (typeof value.name !== 'string' || !value.name.trim() || value.name.trim().length > 80) failure('GROUP_NAME_INVALID', 'Informe um nome de até 80 caracteres.');
  if (typeof value.description !== 'string' || value.description.length > 500) failure('GROUP_DESCRIPTION_INVALID', 'A descrição deve ter até 500 caracteres.');
  const photo = value.avatarDataUrl || '';
  if (typeof photo !== 'string' || photo.length > 180000 || (photo && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(photo))) failure('GROUP_PHOTO_INVALID', 'Use uma foto JPG, PNG ou WebP pequena.');
  if (photo) {
    let bytes;
    try { bytes = atob(photo.split(',')[1]); } catch (_) { failure('GROUP_PHOTO_INVALID', 'Foto inválida.'); }
    const valid = photo.startsWith('data:image/png;') ? bytes.startsWith('\x89PNG\r\n\x1a\n')
      : photo.startsWith('data:image/jpeg;') ? bytes.startsWith('\xff\xd8\xff')
        : bytes.startsWith('RIFF') && bytes.slice(8, 12) === 'WEBP';
    if (!valid) failure('GROUP_PHOTO_INVALID', 'O conteúdo da foto não corresponde ao formato.');
  }
  return [value.name.trim(), value.description.trim(), photo];
}
async function input(request) {
  if (Number(request.headers.get('Content-Length') || 0) > 200000) failure('GROUP_BODY_TOO_LARGE', 'Solicitação muito grande.', 413);
  const reader = request.body?.getReader();
  if (!reader) failure('GROUP_BODY_INVALID', 'Solicitação inválida.');
  let size = 0, text = ''; const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 200000) { await reader.cancel(); failure('GROUP_BODY_TOO_LARGE', 'Solicitação muito grande.', 413); }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
  } finally { reader.releaseLock(); }
  let result;
  try { result = JSON.parse(text); } catch (_) { failure('GROUP_BODY_INVALID', 'Solicitação inválida.'); }
  if (!result || typeof result !== 'object' || Array.isArray(result)) failure('GROUP_BODY_INVALID', 'Solicitação inválida.');
  return result;
}
async function group(env, user, id, pending = false) {
  const row = await query(env, user, `SELECT ${GROUP_COLUMNS}, m.state, m.role, m.muted,
    m.joined_after AS joinedAfter, m.read_through AS readThrough, m.delivered_through AS deliveredThrough
    FROM portal_chat_groups g JOIN portal_chat_group_members m ON m.group_id = g.id
    JOIN actor ON actor.username = m.username
    WHERE g.id = ? AND m.state IN (${pending ? "'invited','member'" : "'member'"})`, id).first();
  if (!row) failure('GROUP_UNAVAILABLE', 'Este grupo não está disponível para sua conta.', 404);
  return row;
}
async function signals(env, id, sender, { extra = [], push = false, message = false, pushTo = null } = {}) {
  const audience = rows(await env.AUTH_DB.prepare(`SELECT DISTINCT m.username,m.muted,m.state FROM portal_chat_group_members m
    JOIN auth_users u ON u.username = m.username AND u.active = 1
    JOIN social_users s ON s.auth_username = u.username AND s.suspended_at IS NULL
    WHERE m.group_id = ? AND m.state IN ('member','invited')`).bind(id).all());
  // Events contain invalidation only, never content or identities. Every subsequent
  // content read revalidates membership/session; an in-flight removal cannot leak text.
  await Promise.allSettled([...new Set([...audience.map(m => m.username), ...extra])].map(async username => {
    await broadcastChatRealtime(env, username, { type: 'group-refresh', groupId: id });
    const member = audience.find(m => m.username === username);
    if (push && member && !member.muted && username !== sender && (!message || member.state === 'member') && (!pushTo || pushTo.includes(username))) await notifyUserPush(env, username);
  }));
}
function background(ctx, task) { if (ctx?.waitUntil) ctx.waitUntil(task.catch(() => {})); else return task; }

export async function handleGroupRoute(request, env, user, origin, ctx) {
  const reply = (body, status = 200) => Response.json(body, { status, headers: {
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
    ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {})
  } });
  try {
    const url = new URL(request.url), tail = url.pathname.slice('/api/chat/groups'.length);
    if (!(await ensureGroupSchema(env))) {
      if (!tail && request.method === 'GET') return reply({ enabled: false, groups: [], protocol: VERSION });
      failure('GROUP_DISABLED', 'Os grupos estão temporariamente desativados.', 503);
    }
    if (!['GET','POST'].includes(request.method)) return reply({ error: 'Método não permitido.' }, 405);
    const active = await query(env, user, 'SELECT username FROM actor').first();
    if (!active) failure('GROUP_SOCIAL_UNAVAILABLE', 'A participação social não está disponível para esta conta.', 403);
    if (!tail && request.method === 'GET') {
      const list = rows(await query(env, user, `SELECT ${GROUP_COLUMNS}, m.state,m.role,m.muted,
        (SELECT COUNT(*) FROM portal_chat_group_members p WHERE p.group_id=g.id AND p.state='member') AS memberCount,
        COALESCE((SELECT MAX(id) FROM portal_chat_group_messages msg WHERE msg.group_id=g.id),0) AS lastId,
        (SELECT COUNT(*) FROM portal_chat_group_messages msg WHERE msg.group_id=g.id
          AND msg.id>MAX(m.joined_after,m.read_through) AND msg.from_user<>m.username AND m.state='member') AS unread,
        (SELECT MIN(id) FROM portal_chat_group_messages msg WHERE msg.group_id=g.id
          AND msg.id>MAX(m.joined_after,m.read_through) AND msg.from_user<>m.username AND m.state='member') AS firstUnreadId
        FROM portal_chat_groups g JOIN portal_chat_group_members m ON m.group_id=g.id JOIN actor ON actor.username=m.username
        WHERE m.state IN ('invited','member') ORDER BY g.updated_at DESC,g.id LIMIT ${GROUP_LIMITS.joined}`).all());
      return reply({ enabled: true, protocol: VERSION, limits: GROUP_LIMITS, groups: list });
    }
    if (tail === '/friends' && request.method === 'GET') {
      const id = url.searchParams.get('groupId');
      let founder = user.username;
      if (id) { const current = await group(env,user,id); if (!['owner','admin'].includes(current.role) || current.closed) failure('GROUP_ADMIN_REQUIRED','Somente administradores podem convidar.',403); founder = current.creatorUsername; }
      const list = rows(await query(env,user, `SELECT u.username,u.name,u.role,u.job_title AS jobTitle
        FROM auth_users u JOIN social_users s ON s.auth_username=u.username,
          (SELECT ? AS creator_username) g
        WHERE EXISTS(SELECT 1 FROM actor) AND u.username<>g.creator_username
          AND EXISTS ${FRIEND.replaceAll('candidate_name','u.username')}
          AND NOT EXISTS(SELECT 1 FROM portal_chat_group_members m WHERE m.group_id=? AND m.username=u.username AND m.state IN ('member','invited'))
          AND (?='' OR EXISTS(SELECT 1 FROM portal_chat_groups scoped WHERE scoped.id=? AND scoped.closed=0 AND ${ADMIN.replaceAll('g.id','scoped.id')}))
        ORDER BY u.name,u.username LIMIT 300`, founder, id || '', id || '', id || '').all());
      return reply({ friends: list });
    }
    if (!tail && request.method === 'POST') {
      const body = await input(request), invited = members(body.members), meta = details(body);
      if (!CLIENT.test(body.clientId || '')) failure('GROUP_CLIENT_INVALID','Identificador inválido.');
      const id = crypto.randomUUID();
      const created = await env.AUTH_DB.batch([
        query(env,user, `INSERT OR IGNORE INTO portal_chat_groups(id,creator_username,client_id,name,description,avatar_data,avatar_version)
          SELECT ?,actor.username,?,?,?,?,? FROM actor
          WHERE (SELECT COUNT(*) FROM portal_chat_group_members WHERE username=actor.username AND state IN ('member','invited'))<${GROUP_LIMITS.joined}
            AND (SELECT COUNT(*) FROM portal_chat_groups WHERE creator_username=actor.username AND closed=0)<${GROUP_LIMITS.owned}
            AND (SELECT COUNT(*) FROM portal_chat_groups WHERE creator_username=actor.username AND created_at>=datetime('now','-1 day'))<${GROUP_LIMITS.createsPerDay}
            AND NOT EXISTS(SELECT 1 FROM json_each(?) wanted, (SELECT actor.username AS creator_username) g
              WHERE wanted.value=actor.username
                OR (SELECT COUNT(*) FROM portal_chat_group_members capacity WHERE capacity.username=wanted.value AND capacity.state IN ('member','invited'))>=${GROUP_LIMITS.joined}
                OR NOT EXISTS ${FRIEND.replaceAll('candidate_name','wanted.value')})`, id,body.clientId,...meta,crypto.randomUUID(),JSON.stringify(invited)),
        query(env,user, `INSERT INTO portal_chat_group_members(group_id,username,role,state,joined_at)
          SELECT g.id,actor.username,'owner','member',CURRENT_TIMESTAMP FROM portal_chat_groups g,actor WHERE g.id=? AND g.creator_username=actor.username`,id),
        query(env,user, `INSERT INTO portal_chat_group_members(group_id,username,state)
          SELECT g.id,wanted.value,'invited' FROM portal_chat_groups g,actor,json_each(?) wanted
          WHERE g.id=? AND g.creator_username=actor.username`,JSON.stringify(invited),id)
      ]);
      const found = await query(env,user, `SELECT g.id FROM portal_chat_groups g,actor WHERE g.creator_username=actor.username AND g.client_id=?`,body.clientId).first();
      if (!found) failure('GROUP_INVITATION_DENIED','Não foi possível criar. Confirme as amizades aceitas e o limite de grupos.',409);
      if (created[0].meta?.changes) await background(ctx, signals(env,found.id,user.username,{push:true,pushTo:invited}));
      return reply({ group: await group(env,user,found.id) },created[0].meta?.changes ? 201 : 200);
    }
    const match = tail.match(/^\/([^/]+)(?:\/(members|invite|accept|decline|leave|close|settings|messages|receipt|info|avatar))?$/);
    if (!match || !UUID.test(match[1])) failure('GROUP_UNAVAILABLE','Grupo não encontrado.',404);
    const id = match[1], action = match[2] || '', current = await group(env,user,id,['accept','decline','','avatar'].includes(action));
    if (action === 'avatar' && request.method === 'GET') {
      const avatar = await query(env,user,`SELECT g.avatar_data AS avatarDataUrl, g.avatar_version AS avatarVersion
        FROM portal_chat_groups g JOIN portal_chat_group_members m ON m.group_id=g.id
        JOIN actor ON actor.username=m.username
        WHERE g.id=? AND m.state IN ('member','invited')`,id).first();
      if (!avatar) failure('GROUP_UNAVAILABLE','Grupo indisponível.',404);
      return reply(avatar);
    }
    if (!action && request.method === 'GET') {
      const people = current.state === 'member' ? rows(await query(env,user, `SELECT m.username,m.role,m.state,u.name,u.job_title AS jobTitle,u.role AS accountRole,u.avatar_data AS avatarDataUrl
        FROM portal_chat_group_members m JOIN auth_users u ON u.username=m.username JOIN portal_chat_groups g ON g.id=m.group_id
        WHERE g.id=? AND ${ACCESS} AND (m.state='member' OR (m.state='invited' AND ${ADMIN})) ORDER BY m.id`,id).all()) : [];
      return reply({ group: current, members: people });
    }
    if (action === 'messages' && request.method === 'GET') {
      const after = number(url.searchParams.get('after')), before = number(url.searchParams.get('before'));
      if (after && before) failure('GROUP_CURSOR_INVALID','Use apenas um marcador.');
      const messages = rows(await query(env,user, `SELECT * FROM (SELECT msg.id,msg.from_user AS fromUser,msg.client_id AS clientId,msg.body,msg.sent_at AS sentAt,
        u.name AS senderName,u.role AS senderRole,u.job_title AS jobTitle
        FROM portal_chat_group_messages msg JOIN portal_chat_groups g ON g.id=msg.group_id
        JOIN portal_chat_group_members m ON m.group_id=g.id JOIN actor ON actor.username=m.username
        JOIN auth_users u ON u.username=msg.from_user
        WHERE g.id=? AND m.state='member' AND msg.id>m.joined_after AND msg.id>?
          ${before ? 'AND msg.id<?' : ''} ORDER BY msg.id ${after ? 'ASC' : 'DESC'} LIMIT ${GROUP_LIMITS.page}) ORDER BY id ASC`,id,after,...(before?[before]:[])).all());
      // Return each profile photo once per history page, never once per message.
      // Revalidate the requesting member in this query as well as the message query.
      const senders = messages.length ? rows(await query(env,user, `SELECT DISTINCT u.username,u.avatar_data AS avatarDataUrl
        FROM auth_users u JOIN portal_chat_group_messages msg ON msg.from_user=u.username
        JOIN portal_chat_groups g ON g.id=msg.group_id
        JOIN portal_chat_group_members m ON m.group_id=g.id JOIN actor ON actor.username=m.username
        WHERE g.id=? AND m.state='member' AND msg.id>m.joined_after
          AND msg.id IN (SELECT value FROM json_each(?))`,id,JSON.stringify(messages.map(msg=>msg.id))).all()) : [];
      return reply({ messages, senders, pageSize: GROUP_LIMITS.page, group: current });
    }
    if (action === 'info' && request.method === 'GET') {
      const mid = number(url.searchParams.get('messageId'));
      const receipts = rows(await query(env,user, `SELECT m.username,u.name,
        m.delivered_through>=msg.id AS delivered,m.read_through>=msg.id AS viewed
        FROM portal_chat_group_messages msg JOIN portal_chat_groups g ON g.id=msg.group_id
        JOIN portal_chat_group_members viewer ON viewer.group_id=g.id JOIN actor ON actor.username=viewer.username
        JOIN portal_chat_group_members m ON m.group_id=g.id
        JOIN auth_users u ON u.username=m.username
        WHERE g.id=? AND msg.id=? AND viewer.state='member' AND msg.id>viewer.joined_after AND msg.from_user=actor.username
          AND m.joined_at IS NOT NULL AND msg.id>m.joined_after AND (m.departed_after IS NULL OR msg.id<=m.departed_after)
          AND m.username<>msg.from_user ORDER BY m.id`,id,mid).all());
      return reply({ receipts });
    }
    if (request.method !== 'POST') failure('GROUP_UNAVAILABLE','Rota não encontrada.',404);
    const body = await input(request);
    if (action === 'messages') {
      const text = typeof body.body === 'string' ? body.body.trim() : '';
      if (!text || text.length>GROUP_LIMITS.message || !CLIENT.test(body.clientId||'')) failure('GROUP_MESSAGE_INVALID','Digite uma mensagem de até 2.000 caracteres.');
      const result = await env.AUTH_DB.batch([
        query(env,user, `INSERT OR IGNORE INTO portal_chat_group_messages(group_id,from_user,body,client_id)
          SELECT g.id,actor.username,?,? FROM portal_chat_groups g,actor WHERE g.id=? AND g.closed=0 AND ${ACCESS}
          AND (SELECT COUNT(*) FROM portal_chat_group_messages WHERE from_user=actor.username AND sent_at>=datetime('now','-1 minute'))<60`,text,body.clientId,id),
        query(env,user, `UPDATE portal_chat_groups AS g SET updated_at=CURRENT_TIMESTAMP WHERE g.id=? AND ${ACCESS}
          AND EXISTS(SELECT 1 FROM portal_chat_group_messages msg,actor WHERE msg.group_id=g.id AND msg.from_user=actor.username AND msg.client_id=?)`,id,body.clientId)
      ]);
      const message = await query(env,user, `SELECT msg.id,msg.from_user AS fromUser,msg.body,msg.client_id AS clientId,msg.sent_at AS sentAt
        FROM portal_chat_group_messages msg JOIN portal_chat_groups g ON g.id=msg.group_id,actor
        WHERE g.id=? AND ${ACCESS} AND msg.from_user=actor.username AND msg.client_id=?
          AND EXISTS(SELECT 1 FROM portal_chat_group_members self WHERE self.group_id=g.id
            AND self.username=actor.username AND self.state='member' AND msg.id>self.joined_after)`,id,body.clientId).first();
      if (!message) failure(current.closed ? 'GROUP_CLOSED' : 'GROUP_SEND_REJECTED',current.closed ? 'Este grupo foi encerrado.' : 'O envio não foi autorizado. Confira o acesso e tente novamente.',409);
      if (result[0].meta?.changes) await background(ctx,signals(env,id,user.username,{push:true,message:true}));
      return reply({ message, duplicate: !result[0].meta?.changes },result[0].meta?.changes?201:200);
    }
    if (action === 'receipt') {
      const through = number(body.throughId), field = body.kind === 'read' ? 'read_through' : 'delivered_through';
      if (!['read','delivered'].includes(body.kind)) failure('GROUP_RECEIPT_INVALID','Recibo inválido.');
      const result = await query(env,user, `UPDATE portal_chat_group_members AS m
        SET ${field}=MAX(${field},?), delivered_through=MAX(delivered_through,?)
        WHERE m.group_id=? AND m.username=(SELECT username FROM actor) AND m.state='member'
          AND EXISTS(SELECT 1 FROM portal_chat_group_messages msg WHERE msg.group_id=m.group_id AND msg.id=? AND msg.id>m.joined_after)`,through,through,id,through).run();
      return reply({ ok: true, changed: Boolean(result.meta?.changes) });
    }
    if (action === 'accept' || action === 'decline') {
      const result = await query(env,user, `UPDATE portal_chat_group_members AS m
        SET state='${action==='accept'?'member':'declined'}', joined_at=${action==='accept'?'CURRENT_TIMESTAMP':'NULL'},
          joined_after=COALESCE((SELECT MAX(id) FROM portal_chat_group_messages WHERE group_id=m.group_id),0)
        WHERE m.group_id=? AND m.username=(SELECT username FROM actor) AND m.state='invited'
          AND EXISTS(SELECT 1 FROM portal_chat_groups g WHERE g.id=m.group_id ${action==='accept'?'AND g.closed=0':''}
            ${action==='accept' ? 'AND EXISTS '+FRIEND.replaceAll('candidate_name','m.username') : ''})`,id).run();
      if (!result.meta?.changes) failure('GROUP_INVITATION_INVALID','Convite indisponível ou amizade não confirmada.',409);
    } else if (action === 'leave') {
      if (current.state!=='member') failure('GROUP_UNAVAILABLE','Grupo indisponível.',404);
      const result = await query(env,user, `UPDATE portal_chat_group_members AS m SET state='left',
        departed_after=COALESCE((SELECT MAX(id) FROM portal_chat_group_messages WHERE group_id=m.group_id),0)
        WHERE m.group_id=? AND m.username=(SELECT username FROM actor) AND m.state='member'
          AND (m.role='member' OR EXISTS(SELECT 1 FROM portal_chat_group_members other WHERE other.group_id=m.group_id
            AND other.username<>m.username AND other.state='member' AND other.role IN ('owner','admin'))
            OR EXISTS(SELECT 1 FROM portal_chat_groups g WHERE g.id=m.group_id AND g.closed=1))`,id).run();
      if (!result.meta?.changes) failure('GROUP_LAST_ADMIN','Nomeie outro administrador ou encerre o grupo antes de sair.',409);
    } else if (action === 'invite') {
      const invited = members(body.members);
      const result = await query(env,user, `INSERT INTO portal_chat_group_members(group_id,username,state)
        SELECT g.id,wanted.value,'invited' FROM portal_chat_groups g,json_each(?) wanted WHERE g.id=? AND g.closed=0 AND ${ADMIN}
          AND (SELECT COUNT(*) FROM portal_chat_group_members WHERE group_id=g.id AND state IN ('member','invited'))+?<=${GROUP_LIMITS.members}
          AND NOT EXISTS(SELECT 1 FROM json_each(?) candidate WHERE candidate.value=g.creator_username
            OR (SELECT COUNT(*) FROM portal_chat_group_members capacity WHERE capacity.username=candidate.value AND capacity.state IN ('member','invited'))>=${GROUP_LIMITS.joined}
            OR NOT EXISTS ${FRIEND.replaceAll('candidate_name','candidate.value')}
            OR EXISTS(SELECT 1 FROM portal_chat_group_members m WHERE m.group_id=g.id AND m.username=candidate.value AND m.state IN ('invited','member')))`,JSON.stringify(invited),id,invited.length,JSON.stringify(invited)).run();
      if (!result.meta?.changes) failure('GROUP_INVITATION_DENIED','Convite recusado. Confira a amizade com o criador e os limites de participantes e grupos por conta.',409);
      await background(ctx,signals(env,id,user.username,{push:true,pushTo:invited}));
      return reply({ok:true});
    } else if (action === 'members') {
      if (!USER.test(body.username||'') || !['remove','promote','demote'].includes(body.action)) failure('GROUP_MEMBER_INVALID','Participante inválido.');
      const self = body.username === user.username;
      if (self || body.username===current.creatorUsername) failure('GROUP_OWNER_PROTECTED','Use Sair do grupo para sua conta. O criador original não pode ser removido.',409);
      const result = await query(env,user, `UPDATE portal_chat_group_members AS m SET
          ${body.action==='remove' ? "state='removed',departed_after=COALESCE((SELECT MAX(id) FROM portal_chat_group_messages WHERE group_id=m.group_id),0)" : "role='"+(body.action==='promote'?'admin':'member')+"'"}
        WHERE m.group_id=? AND m.username=? AND m.state IN (${body.action==='remove'?"'member','invited'":"'member'"})
          AND EXISTS(SELECT 1 FROM portal_chat_groups g WHERE g.id=m.group_id AND g.closed=0 AND ${ADMIN}
            AND (g.creator_username=(SELECT username FROM actor) OR m.role='member'))`,id,body.username).run();
      if (!result.meta?.changes) failure('GROUP_ADMIN_REQUIRED','Ação não permitida para sua conta.',403);
      await background(ctx,signals(env,id,user.username,{extra:[body.username]}));
      return reply({ ok:true });
    } else if (action === 'close') {
      const result = await query(env,user, `UPDATE portal_chat_groups AS g SET closed=1,updated_at=CURRENT_TIMESTAMP WHERE g.id=? AND g.closed=0 AND ${ADMIN}`,id).run();
      if (!result.meta?.changes) failure('GROUP_ADMIN_REQUIRED','Ação não permitida.',403);
    } else if (action === 'settings') {
      if (Object.keys(body).length===1 && typeof body.muted==='boolean') {
        await query(env,user, `UPDATE portal_chat_group_members SET muted=? WHERE group_id=? AND username=(SELECT username FROM actor) AND state='member'`,body.muted?1:0,id).run();
      } else {
        const meta = details(body);
        const result = await query(env,user, `UPDATE portal_chat_groups AS g SET name=?,description=?,avatar_data=CASE WHEN ? THEN ? ELSE avatar_data END, avatar_version=CASE WHEN ? THEN ? ELSE avatar_version END,updated_at=CURRENT_TIMESTAMP WHERE g.id=? AND g.closed=0 AND ${ADMIN}`,meta[0],meta[1],Object.hasOwn(body,'avatarDataUrl')?1:0,meta[2],Object.hasOwn(body,'avatarDataUrl')?1:0,crypto.randomUUID(),id).run();
        if (!result.meta?.changes) failure('GROUP_ADMIN_REQUIRED','Somente administradores podem editar.',403);
      }
    } else failure('GROUP_UNAVAILABLE','Rota não encontrada.',404);
    await background(ctx,signals(env,id,user.username,{extra:[user.username]}));
    return reply({ ok:true });
  } catch (error) {
    // Do not return SQL, content, identifiers or upstream exception details.
    return reply({ error: error.status ? error.message : 'Não foi possível concluir a operação do grupo. Tente novamente.', code: error.code || 'GROUP_UNAVAILABLE' }, error.status || 503);
  }
}
