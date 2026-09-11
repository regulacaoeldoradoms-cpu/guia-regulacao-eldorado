'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import { decorateTelemedicineUser } from './telemedicine-access.js';
import { notifyUserPush } from './push-notifications.js';
import {
  ensureCouncilSocialProfiles,
  ensureInitialProfessionalFriendships,
  ensureSocialSchema,
  resolveSocialUser,
  socialMigrationStatus,
  socialPair,
  socialUserById,
  syncSocialUser
} from './social-schema.js';
import {
  canCreateManualRelationship,
  canDiscoverSocialProfile,
  canViewSocialProfile,
  relationshipStateFor,
  rolePresentation,
  socialAccountLevel,
  socialGate
} from './social-policy.js';

const PAGE_SIZE = 20;
const SEARCH_SIZE = 12;
const POST_LIMIT = 2000;
const COMMENT_LIMIT = 600;
const REPORT_DETAIL_LIMIT = 500;
const THEMES = new Set(['aurora', 'oceano', 'serra', 'ipê']);
const PATTERNS = new Set(['waves', 'rings', 'grid', 'none']);
const MODULES = new Set(['about', 'friends', 'posts']);
const VISIBILITIES = new Set(['portal', 'friends']);
const AUDIENCES = new Set(['friends', 'self']);
const REPORT_REASONS = new Set(['spam', 'assedio', 'falsidade', 'inadequado', 'privacidade', 'outro']);
const RATE_LIMITS = Object.freeze({
  search: { limit: 60, windowSeconds: 600 },
  friend_request: { limit: 30, windowSeconds: 86400 },
  post: { limit: 10, windowSeconds: 3600 },
  comment: { limit: 40, windowSeconds: 3600 },
  reaction: { limit: 120, windowSeconds: 3600 },
  report: { limit: 20, windowSeconds: 86400 }
});

function responseHeaders(origin, allowed = true) {
  const headers = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return headers;
}

function json(body, status, origin, allowed = true, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...responseHeaders(origin, allowed),
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders
    }
  });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const headers = responseHeaders(origin, true);
  headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  headers['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers });
}

function flag(value) {
  return String(value || '').trim().toLowerCase() === 'true';
}

export function socialBackendEnabled(env) {
  return flag(env.SOCIAL_BACKEND_ENABLED);
}

export function socialHomeEnabled(env) {
  return socialBackendEnabled(env) && flag(env.SOCIAL_HOME_ENABLED);
}

function randomId(prefix) {
  const id = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${prefix}_${id}`;
}

function cleanText(value, maximum) {
  return String(value || '').replace(/\u0000/g, '').trim().slice(0, maximum);
}

function safeJson(value, fallback) {
  try {
    const parsed = JSON.parse(String(value || ''));
    return parsed === null ? fallback : parsed;
  } catch (_) {
    return fallback;
  }
}

function encodeCursor(value) {
  const jsonValue = JSON.stringify(value || {});
  const bytes = new TextEncoder().encode(jsonValue);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeCursor(value) {
  try {
    const raw = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
    const padded = raw + '==='.slice((raw.length + 3) % 4);
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_) {
    return null;
  }
}

async function decorateSocialRow(env, row) {
  if (!row) return null;
  const decorated = await decorateTelemedicineUser(env, {
    username: row.username || row.auth_username,
    role: row.role,
    name: row.name,
    jobTitle: row.jobTitle || row.job_title || ''
  });
  return {
    ...row,
    username: decorated.username,
    role: decorated.role,
    name: decorated.name,
    jobTitle: decorated.jobTitle || ''
  };
}

async function relationshipRow(env, firstId, secondId) {
  if (!firstId || !secondId || firstId === secondId) return null;
  const [pairLow, pairHigh] = socialPair(firstId, secondId);
  return env.AUTH_DB.prepare('SELECT * FROM social_relationships WHERE pair_low = ? AND pair_high = ? LIMIT 1')
    .bind(pairLow, pairHigh).first();
}

async function requestContext(request, env, authenticatedUser = null) {
  const user = authenticatedUser || await validatePortalSession(request, env, []);
  if (!user) return { error: 'Sessão inválida ou expirada.', status: 401, code: 'SESSION_REQUIRED' };
  if (!socialBackendEnabled(env)) return { user, disabled: true };
  if (!(await ensureSocialSchema(env))) {
    return { error: 'Banco social ainda não disponível.', status: 503, code: 'SOCIAL_DATABASE_UNAVAILABLE' };
  }
  await ensureInitialProfessionalFriendships(env);
  const synced = await syncSocialUser(env, user.username);
  if (!synced) return { error: 'Identidade social indisponível.', status: 503, code: 'SOCIAL_IDENTITY_UNAVAILABLE' };
  const social = await decorateSocialRow(env, {
    ...synced,
    username: user.username,
    name: user.name,
    jobTitle: user.jobTitle,
    role: user.role,
    councilRole: user.councilRole || '',
    active: user.active === false ? 0 : 1,
    emailVerified: user.emailVerified ? 1 : 0,
    selfRegistered: user.selfRegistered ? 1 : 0,
    acceptFriendRequests: user.acceptFriendRequests ? 1 : 0,
    avatarAvailable: Boolean(user.avatarDataUrl) ? 1 : 0,
    avatarVersion: String(user.avatarVersion || '')
  });
  return { user, social };
}

function gateResponse(gate, origin) {
  return json({
    error: gate.message,
    code: gate.code,
    ...(gate.requiredLevel ? { requiredLevel: gate.requiredLevel } : {})
  }, gate.code === 'SOCIAL_SUSPENDED' ? 403 : 403, origin);
}

function publicSummary(row) {
  return {
    handle: row.handle,
    name: row.name || row.handle,
    status: row.status_text || '',
    avatarAvailable: Boolean(Number(row.avatarAvailable || row.avatar_available || 0)),
    avatarVersion: String(row.avatarVersion || row.avatar_version || ''),
    professional: rolePresentation(row)
  };
}

async function friendCount(env, socialUserId) {
  const row = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total
    FROM social_relationships relationship
    JOIN social_users friend ON friend.social_user_id = CASE
      WHEN relationship.pair_low = ? THEN relationship.pair_high ELSE relationship.pair_low END
    JOIN auth_users friend_auth ON friend_auth.username = friend.auth_username
    WHERE relationship.state = 'friends' AND (relationship.pair_low = ? OR relationship.pair_high = ?)
      AND friend_auth.active = 1 AND friend.suspended_at IS NULL`)
    .bind(socialUserId, socialUserId, socialUserId).first();
  return Number(row?.total || 0);
}

async function postCount(env, socialUserId) {
  const row = await env.AUTH_DB.prepare("SELECT COUNT(*) AS total FROM social_posts WHERE author_id = ? AND status = 'active'")
    .bind(socialUserId).first();
  return Number(row?.total || 0);
}

async function profilePayload(env, viewer, target, relationship) {
  const isSelf = viewer.social_user_id === target.social_user_id;
  const profile = {
    handle: target.handle,
    canonicalHandle: target.handle,
    name: target.name || target.handle,
    bio: target.bio || '',
    status: target.status_text || '',
    interests: safeJson(target.interests_json, []).slice(0, 10),
    coverTheme: THEMES.has(target.cover_theme) ? target.cover_theme : 'aurora',
    coverPattern: PATTERNS.has(target.cover_pattern) ? target.cover_pattern : 'waves',
    moduleOrder: safeJson(target.modules_order_json, ['about', 'friends', 'posts']).filter((item) => MODULES.has(item)),
    avatarAvailable: Boolean(Number(target.avatarAvailable || 0)),
    avatarVersion: String(target.avatarVersion || target.avatar_version || ''),
    professional: rolePresentation(target),
    relationship: relationshipStateFor(viewer.social_user_id, target.social_user_id, relationship),
    acceptFriendRequests: Number(target.acceptFriendRequests || 0) === 1,
    isSelf,
    counts: {
      friends: await friendCount(env, target.social_user_id),
      posts: await postCount(env, target.social_user_id)
    }
  };
  if (isSelf) {
    profile.profileVisibility = target.profile_visibility === 'friends' ? 'friends' : 'portal';
    profile.defaultPostAudience = target.default_post_audience === 'self' ? 'self' : 'friends';
    profile.homePreference = 'feed';
  }
  return profile;
}

async function enforceRateLimit(env, socialUserId, action) {
  const policy = RATE_LIMITS[action];
  if (!policy) return { allowed: true };
  const now = Math.floor(Date.now() / 1000);
  const windowStartedAt = Math.floor(now / policy.windowSeconds) * policy.windowSeconds;
  const rateKey = `${socialUserId}:${action}:${windowStartedAt}`;
  await env.AUTH_DB.prepare(`INSERT INTO social_rate_limits(rate_key, social_user_id, action, window_started_at, count)
    VALUES (?, ?, ?, ?, 1)
    ON CONFLICT(rate_key) DO UPDATE SET count = count + 1, updated_at = CURRENT_TIMESTAMP`)
    .bind(rateKey, socialUserId, action, windowStartedAt).run();
  const row = await env.AUTH_DB.prepare('SELECT count FROM social_rate_limits WHERE rate_key = ?').bind(rateKey).first();
  const retryAfterSeconds = Math.max(1, windowStartedAt + policy.windowSeconds - now);
  return { allowed: Number(row?.count || 0) <= policy.limit, retryAfterSeconds, limit: policy.limit };
}

function rateLimitResponse(result, origin) {
  return json({
    error: 'Muitas ações sociais em pouco tempo. Aguarde antes de tentar novamente.',
    code: 'SOCIAL_RATE_LIMITED',
    retryAfterSeconds: result.retryAfterSeconds
  }, 429, origin, true, { 'Retry-After': String(result.retryAfterSeconds) });
}

async function createNotification(env, recipientId, type, actorId, entityType = '', entityId = '', executionContext = null) {
  if (!recipientId || recipientId === actorId) return;
  await env.AUTH_DB.prepare(`INSERT INTO social_notifications(recipient_id, type, actor_id, entity_type, entity_id)
    VALUES (?, ?, ?, ?, ?)`).bind(recipientId, type, actorId || null, entityType, entityId).run();
  const recipient = await env.AUTH_DB.prepare(
    'SELECT auth_username AS username FROM social_users WHERE social_user_id = ? LIMIT 1'
  ).bind(recipientId).first();
  if (!recipient?.username) return;
  const pushTask = notifyUserPush(env, recipient.username).catch(() => ({ attempted: 0, accepted: 0 }));
  if (executionContext?.waitUntil) executionContext.waitUntil(pushTask);
  else await pushTask;
}

export function isSocialApi(pathname) {
  return String(pathname || '').startsWith('/api/social/');
}

async function handleConfig(request, env, origin) {
  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.', code: 'SESSION_REQUIRED' }, 401, origin);
  if (!socialBackendEnabled(env)) {
    return json({
      backendEnabled: false,
      homeEnabled: false,
      available: false,
      accountLevel: socialAccountLevel(user),
      toolsPath: '/ferramentas/'
    }, 200, origin);
  }
  const context = await requestContext(request, env, user);
  if (context.error) return json({ error: context.error, code: context.code }, context.status, origin);
  const gate = socialGate(context.user, context.social);
  const [unread, ownProfile] = await Promise.all([
    env.AUTH_DB.prepare(`SELECT COUNT(*) AS total FROM social_notifications
      WHERE recipient_id = ? AND read_at IS NULL`).bind(context.social.social_user_id).first(),
    socialUserById(env, context.social.social_user_id)
  ]);
  return json({
    backendEnabled: true,
    homeEnabled: socialHomeEnabled(env),
    available: gate.allowed,
    accountLevel: socialAccountLevel(context.user),
    gate: gate.allowed ? null : { code: gate.code, message: gate.message, requiredLevel: gate.requiredLevel || '' },
    profile: {
      handle: context.social.handle,
      name: context.social.name || context.social.handle,
      homePreference: 'feed',
      avatarAvailable: Boolean(Number(ownProfile?.avatarAvailable || 0)),
      avatarVersion: String(ownProfile?.avatarVersion || '')
    },
    unreadSocialNotifications: Number(unread?.total || 0),
    toolsPath: '/ferramentas/',
    moderation: context.user.role === 'admin'
  }, 200, origin);
}

async function handleMyProfile(request, env, context, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const target = await decorateSocialRow(env, await socialUserById(env, context.social.social_user_id));
  const relation = null;

  if (request.method === 'GET') {
    return json({ profile: await profilePayload(env, context.social, target, relation) }, 200, origin);
  }

  if (request.method !== 'PATCH') return json({ error: 'Método não permitido.' }, 405, origin);
  const body = await request.json().catch(() => ({}));
  const fields = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(body, 'bio')) {
    fields.push('bio = ?'); values.push(cleanText(body.bio, 240));
  }
  if (Object.prototype.hasOwnProperty.call(body, 'status')) {
    fields.push('status_text = ?'); values.push(cleanText(body.status, 100));
  }
  if (Object.prototype.hasOwnProperty.call(body, 'interests')) {
    const interests = Array.isArray(body.interests)
      ? [...new Set(body.interests.map((item) => cleanText(item, 32)).filter(Boolean))].slice(0, 10)
      : [];
    fields.push('interests_json = ?'); values.push(JSON.stringify(interests));
  }
  if (Object.prototype.hasOwnProperty.call(body, 'coverTheme')) {
    if (!THEMES.has(body.coverTheme)) return json({ error: 'Tema de perfil inválido.' }, 400, origin);
    fields.push('cover_theme = ?'); values.push(body.coverTheme);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'coverPattern')) {
    if (!PATTERNS.has(body.coverPattern)) return json({ error: 'Padrão de perfil inválido.' }, 400, origin);
    fields.push('cover_pattern = ?'); values.push(body.coverPattern);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'moduleOrder')) {
    const order = Array.isArray(body.moduleOrder)
      ? [...new Set(body.moduleOrder.filter((item) => MODULES.has(item)))].slice(0, 3)
      : [];
    if (!order.length) return json({ error: 'Mantenha ao menos um módulo no perfil.' }, 400, origin);
    fields.push('modules_order_json = ?'); values.push(JSON.stringify(order));
  }
  if (Object.prototype.hasOwnProperty.call(body, 'profileVisibility')) {
    if (!VISIBILITIES.has(body.profileVisibility)) return json({ error: 'Visibilidade de perfil inválida.' }, 400, origin);
    fields.push('profile_visibility = ?'); values.push(body.profileVisibility);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'defaultPostAudience')) {
    if (!AUDIENCES.has(body.defaultPostAudience)) return json({ error: 'Audiência padrão inválida.' }, 400, origin);
    fields.push('default_post_audience = ?'); values.push(body.defaultPostAudience);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'homePreference')) {
    if (!['feed', 'tools'].includes(body.homePreference)) return json({ error: 'Página inicial preferida inválida.' }, 400, origin);
    fields.push('home_preference = ?'); values.push('feed');
  }
  if (Object.prototype.hasOwnProperty.call(body, 'acceptFriendRequests')) {
    await env.AUTH_DB.prepare('UPDATE auth_users SET accept_friend_requests = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?')
      .bind(body.acceptFriendRequests ? 1 : 0, context.user.username).run();
  }
  if (fields.length) {
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(context.social.social_user_id);
    await env.AUTH_DB.prepare(`UPDATE social_users SET ${fields.join(', ')} WHERE social_user_id = ?`).bind(...values).run();
  }
  const updated = await decorateSocialRow(env, await socialUserById(env, context.social.social_user_id));
  updated.acceptFriendRequests = Object.prototype.hasOwnProperty.call(body, 'acceptFriendRequests')
    ? (body.acceptFriendRequests ? 1 : 0)
    : context.social.acceptFriendRequests;
  return json({ profile: await profilePayload(env, updated, updated, null) }, 200, origin);
}

async function handleProfileGet(env, context, requestedHandle, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const target = await decorateSocialRow(env, await resolveSocialUser(env, requestedHandle));
  if (!target) return json({ error: 'Perfil social não encontrado.' }, 404, origin);
  const relation = await relationshipRow(env, context.social.social_user_id, target.social_user_id);
  if (!canViewSocialProfile(context.social, target, relation)) {
    return json({ error: 'Perfil social não encontrado.' }, 404, origin);
  }
  return json({ profile: await profilePayload(env, context.social, target, relation) }, 200, origin);
}

async function handleSearch(url, env, context, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  await ensureCouncilSocialProfiles(env);
  const limited = await enforceRateLimit(env, context.social.social_user_id, 'search');
  if (!limited.allowed) return rateLimitResponse(limited, origin);
  const query = cleanText(url.searchParams.get('q'), 60).toLowerCase();
  if (query.length < 3) return json({ error: 'Digite ao menos 3 caracteres para pesquisar.' }, 400, origin);
  const cursor = decodeCursor(url.searchParams.get('cursor'));
  const afterHandle = cleanText(cursor?.handle, 40);
  const escapedQuery = query.replace(/[\\%_]/g, '\\$&');
  const like = `%${escapedQuery}%`;
  const result = await env.AUTH_DB.prepare(`SELECT su.*, au.username, au.role, au.name,
      au.job_title AS jobTitle, au.active, au.council_role AS councilRole,
      au.email_verified AS emailVerified,
      au.accept_friend_requests AS acceptFriendRequests,
      COALESCE(au.avatar_data, '') <> '' AS avatarAvailable,
      COALESCE(au.avatar_version, '') AS avatarVersion,
      tele.enabled AS telemedicineEnabled
    FROM social_users su
    JOIN auth_users au ON au.username = su.auth_username
    LEFT JOIN auth_telemedicine_access tele ON tele.username = au.username AND tele.enabled = 1
    WHERE su.social_user_id <> ? AND au.active = 1 AND su.suspended_at IS NULL
      AND su.handle > ? COLLATE NOCASE
      AND (
        lower(su.handle) LIKE ? ESCAPE '\\'
        OR lower(au.name) LIKE ? ESCAPE '\\'
        OR lower(COALESCE(au.job_title, '')) LIKE ? ESCAPE '\\'
        OR lower(COALESCE(au.council_role, '')) LIKE ? ESCAPE '\\'
      )
      AND NOT EXISTS (
        SELECT 1 FROM social_relationships block
        WHERE block.pair_low = CASE WHEN su.social_user_id < ? THEN su.social_user_id ELSE ? END
          AND block.pair_high = CASE WHEN su.social_user_id < ? THEN ? ELSE su.social_user_id END
          AND block.state = 'blocked'
      )
    ORDER BY su.handle COLLATE NOCASE ASC
    LIMIT ?`)
    .bind(
      context.social.social_user_id,
      afterHandle,
      like,
      like,
      like,
      like,
      context.social.social_user_id,
      context.social.social_user_id,
      context.social.social_user_id,
      context.social.social_user_id,
      SEARCH_SIZE + 1
    ).all();
  const rows = [];
  for (const raw of result.results || []) {
    const target = await decorateSocialRow(env, raw);
    const relation = await relationshipRow(env, context.social.social_user_id, target.social_user_id);
    if (canDiscoverSocialProfile(context.social, target, relation)) {
      rows.push({
        ...publicSummary(target),
        relationship: relationshipStateFor(context.social.social_user_id, target.social_user_id, relation),
        acceptFriendRequests: Number(target.acceptFriendRequests || 0) === 1
      });
    }
  }
  const hasMore = rows.length > SEARCH_SIZE;
  const items = rows.slice(0, SEARCH_SIZE);
  return json({
    profiles: items,
    nextCursor: hasMore && items.length ? encodeCursor({ handle: items[items.length - 1].handle }) : ''
  }, 200, origin);
}

async function targetForRelationship(env, context, targetHandle) {
  const target = await decorateSocialRow(env, await resolveSocialUser(env, targetHandle));
  if (!target || Number(target.active) !== 1 || target.suspended_at) return null;
  if (!canCreateManualRelationship(context.social, target)) return null;
  return target;
}

async function handleRelationshipAction(request, env, context, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const body = await request.json().catch(() => ({}));
  const action = cleanText(body.action, 24);
  const target = await targetForRelationship(env, context, body.targetHandle);
  if (!target) return json({ error: 'Perfil social não disponível para esta ação.' }, 404, origin);

  const actorId = context.social.social_user_id;
  const targetId = target.social_user_id;
  const [pairLow, pairHigh] = socialPair(actorId, targetId);
  const current = await relationshipRow(env, actorId, targetId);
  const knownRelationship = Boolean(current && ['pending', 'friends', 'blocked'].includes(current.state));
  if (!knownRelationship && !canViewSocialProfile(context.social, target, current)) {
    return json({ error: 'Perfil social não disponível para esta ação.' }, 404, origin);
  }
  if (current?.state === 'blocked') {
    if (current.blocked_by !== actorId) {
      return json({ error: 'Perfil social não disponível para esta ação.' }, 404, origin);
    }
    if (!['block', 'unblock'].includes(action)) {
      return json({ error: 'Desbloqueie o perfil antes de iniciar outra ação social.' }, 409, origin);
    }
  }
  if (['request', 'accept'].includes(action)) {
    const targetGate = socialGate({ ...target, emailVerified: Number(target.emailVerified) === 1 }, target);
    if (!targetGate.allowed) return json({ error: 'Este perfil ainda não pode receber interações sociais.' }, 409, origin);
  }

  if (action === 'request') {
    const limited = await enforceRateLimit(env, actorId, 'friend_request');
    if (!limited.allowed) return rateLimitResponse(limited, origin);
    if (current?.state === 'friends' || (current?.state === 'pending' && current.initiated_by === actorId)) {
      return json({ relationship: relationshipStateFor(actorId, targetId, current) }, 200, origin);
    }
    if (current?.state === 'pending' && current.initiated_by === targetId) {
      return json({ error: 'Você já recebeu um pedido desta pessoa.', code: 'FRIEND_REQUEST_RECEIVED' }, 409, origin);
    }
    if (Number(target.acceptFriendRequests || 0) !== 1) {
      return json({ error: 'Este perfil não está aceitando novos pedidos de amizade.' }, 409, origin);
    }
    await env.AUTH_DB.prepare(`INSERT INTO social_relationships
      (pair_low, pair_high, state, initiated_by, blocked_by, origin, tombstone)
      VALUES (?, ?, 'pending', ?, NULL, 'manual', 0)
      ON CONFLICT(pair_low, pair_high) DO UPDATE SET
        state = 'pending', initiated_by = excluded.initiated_by, blocked_by = NULL,
        origin = 'manual', updated_at = CURRENT_TIMESTAMP`)
      .bind(pairLow, pairHigh, actorId).run();
    await createNotification(env, targetId, 'friend_request', actorId, 'profile', actorId, context.executionContext);
  } else if (action === 'cancel') {
    if (current?.state === 'pending' && current.initiated_by === actorId) {
      await env.AUTH_DB.prepare(`UPDATE social_relationships SET state = 'removed', initiated_by = NULL,
        origin = 'manual', updated_at = CURRENT_TIMESTAMP WHERE pair_low = ? AND pair_high = ?`)
        .bind(pairLow, pairHigh).run();
    }
  } else if (action === 'accept') {
    if (!(current?.state === 'pending' && current.initiated_by === targetId)) {
      return json({ error: 'Não há pedido recebido para aceitar.' }, 409, origin);
    }
    await env.AUTH_DB.prepare(`UPDATE social_relationships SET state = 'friends', blocked_by = NULL,
      updated_at = CURRENT_TIMESTAMP WHERE pair_low = ? AND pair_high = ?`).bind(pairLow, pairHigh).run();
    await createNotification(env, targetId, 'friend_accepted', actorId, 'profile', actorId, context.executionContext);
  } else if (action === 'decline') {
    if (current?.state === 'pending' && current.initiated_by === targetId) {
      await env.AUTH_DB.prepare(`UPDATE social_relationships SET state = 'removed', initiated_by = NULL,
        origin = 'manual', updated_at = CURRENT_TIMESTAMP WHERE pair_low = ? AND pair_high = ?`)
        .bind(pairLow, pairHigh).run();
    }
  } else if (action === 'remove') {
    if (current?.state === 'friends') {
      await env.AUTH_DB.prepare(`UPDATE social_relationships SET state = 'removed', initiated_by = NULL,
        blocked_by = NULL, tombstone = 1, updated_at = CURRENT_TIMESTAMP
        WHERE pair_low = ? AND pair_high = ?`).bind(pairLow, pairHigh).run();
    }
  } else if (action === 'block') {
    await env.AUTH_DB.prepare(`INSERT INTO social_relationships
      (pair_low, pair_high, state, initiated_by, blocked_by, origin, tombstone)
      VALUES (?, ?, 'blocked', NULL, ?, 'manual', 1)
      ON CONFLICT(pair_low, pair_high) DO UPDATE SET
        state = 'blocked', initiated_by = NULL, blocked_by = excluded.blocked_by,
        origin = 'manual', tombstone = 1, updated_at = CURRENT_TIMESTAMP`)
      .bind(pairLow, pairHigh, actorId).run();
  } else if (action === 'unblock') {
    if (!(current?.state === 'blocked' && current.blocked_by === actorId)) {
      return json({ error: 'Não há bloqueio seu para remover.' }, 409, origin);
    }
    await env.AUTH_DB.prepare(`UPDATE social_relationships SET state = 'removed', initiated_by = NULL,
      blocked_by = NULL, tombstone = 1, updated_at = CURRENT_TIMESTAMP
      WHERE pair_low = ? AND pair_high = ?`).bind(pairLow, pairHigh).run();
  } else {
    return json({ error: 'Ação de amizade inválida.' }, 400, origin);
  }

  const updated = await relationshipRow(env, actorId, targetId);
  return json({ relationship: relationshipStateFor(actorId, targetId, updated) }, 200, origin);
}

function relationshipListCondition(type) {
  if (type === 'incoming') return "rel.state = 'pending' AND rel.initiated_by <> ?";
  if (type === 'outgoing') return "rel.state = 'pending' AND rel.initiated_by = ?";
  if (type === 'blocked') return "rel.state = 'blocked' AND rel.blocked_by = ?";
  return "rel.state = 'friends' AND ? <> ''";
}

async function handleRelationshipList(url, env, context, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const type = ['friends', 'incoming', 'outgoing', 'blocked'].includes(url.searchParams.get('type'))
    ? url.searchParams.get('type')
    : 'friends';
  const cursor = decodeCursor(url.searchParams.get('cursor'));
  const beforeAt = cleanText(cursor?.updatedAt, 40) || '9999-12-31 23:59:59';
  const beforePair = cleanText(cursor?.pair, 90) || 'zzzzzzzz';
  const viewerId = context.social.social_user_id;
  const result = await env.AUTH_DB.prepare(`SELECT rel.*,
      su.*, au.username, au.role, au.name, au.job_title AS jobTitle, au.active,
      au.email_verified AS emailVerified, au.accept_friend_requests AS acceptFriendRequests,
      COALESCE(au.avatar_data, '') <> '' AS avatarAvailable,
      COALESCE(au.avatar_version, '') AS avatarVersion
    FROM social_relationships rel
    JOIN social_users su ON su.social_user_id = CASE WHEN rel.pair_low = ? THEN rel.pair_high ELSE rel.pair_low END
    JOIN auth_users au ON au.username = su.auth_username
    WHERE (rel.pair_low = ? OR rel.pair_high = ?)
      AND au.active = 1 AND su.suspended_at IS NULL
      AND ${relationshipListCondition(type)}
      AND (rel.updated_at < ? OR (rel.updated_at = ? AND (rel.pair_low || ':' || rel.pair_high) < ?))
    ORDER BY rel.updated_at DESC, (rel.pair_low || ':' || rel.pair_high) DESC
    LIMIT ?`)
    .bind(viewerId, viewerId, viewerId, viewerId, beforeAt, beforeAt, beforePair, PAGE_SIZE + 1).all();
  const decorated = [];
  for (const row of result.results || []) {
    const target = await decorateSocialRow(env, row);
    if (Number(target.active) !== 1 || target.suspended_at) continue;
    decorated.push({
      ...publicSummary(target),
      relationship: relationshipStateFor(viewerId, target.social_user_id, row),
      updatedAt: row.updated_at,
      pair: `${row.pair_low}:${row.pair_high}`
    });
  }
  const hasMore = decorated.length > PAGE_SIZE;
  const items = decorated.slice(0, PAGE_SIZE);
  const last = items[items.length - 1];
  return json({
    type,
    profiles: items.map(({ pair, ...item }) => item),
    nextCursor: hasMore && last ? encodeCursor({ updatedAt: last.updatedAt, pair: last.pair }) : ''
  }, 200, origin);
}

function feedCursor(url) {
  const cursor = decodeCursor(url.searchParams.get('cursor'));
  return {
    createdAt: cleanText(cursor?.createdAt, 40) || '9999-12-31 23:59:59',
    id: cleanText(cursor?.id, 80) || 'zzzzzzzz'
  };
}

function postFromRow(row) {
  return {
    id: row.id,
    body: row.body,
    audience: row.audience,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    edited: row.updated_at !== row.created_at,
    author: publicSummary(row),
    counts: {
      comments: Number(row.commentCount || 0),
      reactions: Number(row.reactionCount || 0)
    },
    reacted: Number(row.viewerReacted || 0) === 1,
    own: Number(row.own || 0) === 1
  };
}

async function feedRows(env, viewerId, cursor, authorId = '') {
  const authorClause = authorId ? 'AND p.author_id = ?' : '';
  const audienceClause = authorId
    ? `AND (p.author_id = ? OR (p.audience = 'friends' AND EXISTS (
        SELECT 1 FROM social_relationships audience_rel
        WHERE audience_rel.pair_low = CASE WHEN p.author_id < ? THEN p.author_id ELSE ? END
          AND audience_rel.pair_high = CASE WHEN p.author_id < ? THEN ? ELSE p.author_id END
          AND audience_rel.state = 'friends'
      )))`
    : `AND (p.author_id = ? OR (p.audience = 'friends' AND EXISTS (
        SELECT 1 FROM social_relationships audience_rel
        WHERE audience_rel.pair_low = CASE WHEN p.author_id < ? THEN p.author_id ELSE ? END
          AND audience_rel.pair_high = CASE WHEN p.author_id < ? THEN ? ELSE p.author_id END
          AND audience_rel.state = 'friends'
      )))`;
  const sql = `SELECT p.*, su.handle, su.status_text, au.username, au.role, au.name,
      au.job_title AS jobTitle, COALESCE(au.avatar_data, '') <> '' AS avatarAvailable,
      COALESCE(au.avatar_version, '') AS avatarVersion,
      CASE WHEN p.author_id = ? THEN 1 ELSE 0 END AS own,
      (SELECT COUNT(*) FROM social_comments c
        JOIN social_users comment_author ON comment_author.social_user_id = c.author_id
        JOIN auth_users comment_auth ON comment_auth.username = comment_author.auth_username
        WHERE c.post_id = p.id AND c.status = 'active'
          AND comment_auth.active = 1 AND comment_author.suspended_at IS NULL) AS commentCount,
      (SELECT COUNT(*) FROM social_reactions reaction
        JOIN social_users reaction_author ON reaction_author.social_user_id = reaction.social_user_id
        JOIN auth_users reaction_auth ON reaction_auth.username = reaction_author.auth_username
        WHERE reaction.post_id = p.id
          AND reaction_auth.active = 1 AND reaction_author.suspended_at IS NULL) AS reactionCount,
      EXISTS(SELECT 1 FROM social_reactions mine WHERE mine.post_id = p.id AND mine.social_user_id = ?) AS viewerReacted
    FROM social_posts p
    JOIN social_users su ON su.social_user_id = p.author_id
    JOIN auth_users au ON au.username = su.auth_username
    WHERE p.status = 'active' AND au.active = 1 AND su.suspended_at IS NULL
      ${authorClause}
      ${audienceClause}
      AND (p.created_at < ? OR (p.created_at = ? AND p.id < ?))
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT ?`;
  const binds = [viewerId, viewerId];
  if (authorId) binds.push(authorId);
  binds.push(viewerId, viewerId, viewerId, viewerId, viewerId, cursor.createdAt, cursor.createdAt, cursor.id, PAGE_SIZE + 1);
  return env.AUTH_DB.prepare(sql).bind(...binds).all();
}

async function handleFeed(url, env, context, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const cursor = feedCursor(url);
  const result = await feedRows(env, context.social.social_user_id, cursor);
  const rows = [];
  for (const row of result.results || []) rows.push(postFromRow(await decorateSocialRow(env, row)));
  const hasMore = rows.length > PAGE_SIZE;
  const posts = rows.slice(0, PAGE_SIZE);
  const last = posts[posts.length - 1];
  return json({
    order: 'chronological',
    posts,
    nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, id: last.id }) : ''
  }, 200, origin);
}

async function handleProfilePosts(url, env, context, targetHandle, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const target = await decorateSocialRow(env, await resolveSocialUser(env, targetHandle));
  if (!target) return json({ error: 'Perfil social não encontrado.' }, 404, origin);
  const relation = await relationshipRow(env, context.social.social_user_id, target.social_user_id);
  if (!canViewSocialProfile(context.social, target, relation)) return json({ error: 'Perfil social não encontrado.' }, 404, origin);
  const result = await feedRows(env, context.social.social_user_id, feedCursor(url), target.social_user_id);
  const rows = [];
  for (const row of result.results || []) rows.push(postFromRow(await decorateSocialRow(env, row)));
  const hasMore = rows.length > PAGE_SIZE;
  const posts = rows.slice(0, PAGE_SIZE);
  const last = posts[posts.length - 1];
  return json({
    posts,
    nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, id: last.id }) : ''
  }, 200, origin);
}

async function handlePostCreate(request, env, context, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const limited = await enforceRateLimit(env, context.social.social_user_id, 'post');
  if (!limited.allowed) return rateLimitResponse(limited, origin);
  const body = await request.json().catch(() => ({}));
  const text = cleanText(body.body, POST_LIMIT);
  const audience = AUDIENCES.has(body.audience) ? body.audience : context.social.default_post_audience;
  if (!text) return json({ error: 'Escreva algo antes de publicar.' }, 400, origin);
  const id = randomId('post');
  await env.AUTH_DB.prepare('INSERT INTO social_posts(id, author_id, body, audience) VALUES (?, ?, ?, ?)')
    .bind(id, context.social.social_user_id, text, AUDIENCES.has(audience) ? audience : 'friends').run();
  const row = await postById(env, id, context.social.social_user_id);
  return json({ post: postFromRow(await decorateSocialRow(env, row)) }, 201, origin);
}

async function postById(env, postId, viewerId) {
  return env.AUTH_DB.prepare(`SELECT p.*, su.handle, su.status_text, au.username, au.role, au.name,
      au.job_title AS jobTitle, au.active, su.suspended_at,
      COALESCE(au.avatar_data, '') <> '' AS avatarAvailable,
      COALESCE(au.avatar_version, '') AS avatarVersion,
      CASE WHEN p.author_id = ? THEN 1 ELSE 0 END AS own,
      (SELECT COUNT(*) FROM social_comments c
        JOIN social_users comment_author ON comment_author.social_user_id = c.author_id
        JOIN auth_users comment_auth ON comment_auth.username = comment_author.auth_username
        WHERE c.post_id = p.id AND c.status = 'active'
          AND comment_auth.active = 1 AND comment_author.suspended_at IS NULL) AS commentCount,
      (SELECT COUNT(*) FROM social_reactions reaction
        JOIN social_users reaction_author ON reaction_author.social_user_id = reaction.social_user_id
        JOIN auth_users reaction_auth ON reaction_auth.username = reaction_author.auth_username
        WHERE reaction.post_id = p.id
          AND reaction_auth.active = 1 AND reaction_author.suspended_at IS NULL) AS reactionCount,
      EXISTS(SELECT 1 FROM social_reactions mine WHERE mine.post_id = p.id AND mine.social_user_id = ?) AS viewerReacted
    FROM social_posts p
    JOIN social_users su ON su.social_user_id = p.author_id
    JOIN auth_users au ON au.username = su.auth_username
    WHERE p.id = ? LIMIT 1`).bind(viewerId, viewerId, postId).first();
}

async function visiblePost(env, context, postId) {
  const raw = await postById(env, postId, context.social.social_user_id);
  if (!raw || raw.status !== 'active' || Number(raw.active) !== 1 || raw.suspended_at) return null;
  if (raw.author_id === context.social.social_user_id) return decorateSocialRow(env, raw);
  const relation = await relationshipRow(env, context.social.social_user_id, raw.author_id);
  if (raw.audience !== 'friends' || relation?.state !== 'friends') return null;
  return decorateSocialRow(env, raw);
}

async function handlePostMutation(request, env, context, postId, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const current = await postById(env, postId, context.social.social_user_id);
  if (!current || current.author_id !== context.social.social_user_id || current.status === 'deleted') {
    return json({ error: 'Publicação não encontrada.' }, 404, origin);
  }
  if (request.method === 'DELETE') {
    await env.AUTH_DB.prepare(`UPDATE social_posts SET status = 'deleted', body = '',
      deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND author_id = ?`)
      .bind(postId, context.social.social_user_id).run();
    await env.AUTH_DB.prepare(`UPDATE social_comments SET status = 'deleted', body = '',
      deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE post_id = ? AND status <> 'deleted'`).bind(postId).run();
    await env.AUTH_DB.prepare('DELETE FROM social_reactions WHERE post_id = ?').bind(postId).run();
    return json({ ok: true }, 200, origin);
  }
  if (request.method !== 'PATCH') return json({ error: 'Método não permitido.' }, 405, origin);
  const body = await request.json().catch(() => ({}));
  const fields = [];
  const values = [];
  if (Object.prototype.hasOwnProperty.call(body, 'body')) {
    const text = cleanText(body.body, POST_LIMIT);
    if (!text) return json({ error: 'A publicação não pode ficar vazia.' }, 400, origin);
    fields.push('body = ?'); values.push(text);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'audience')) {
    if (!AUDIENCES.has(body.audience)) return json({ error: 'Audiência inválida.' }, 400, origin);
    fields.push('audience = ?'); values.push(body.audience);
  }
  if (!fields.length) return json({ post: postFromRow(await decorateSocialRow(env, current)) }, 200, origin);
  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(postId, context.social.social_user_id);
  await env.AUTH_DB.prepare(`UPDATE social_posts SET ${fields.join(', ')} WHERE id = ? AND author_id = ?`).bind(...values).run();
  return json({ post: postFromRow(await decorateSocialRow(env, await postById(env, postId, context.social.social_user_id))) }, 200, origin);
}

async function handleCommentsGet(url, env, context, postId, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  if (!(await visiblePost(env, context, postId))) return json({ error: 'Publicação não encontrada.' }, 404, origin);
  const cursor = decodeCursor(url.searchParams.get('cursor'));
  const afterAt = cleanText(cursor?.createdAt, 40) || '';
  const afterId = cleanText(cursor?.id, 80) || '';
  const result = await env.AUTH_DB.prepare(`SELECT c.*, su.handle, su.status_text, au.username, au.role, au.name,
      au.job_title AS jobTitle, COALESCE(au.avatar_data, '') <> '' AS avatarAvailable,
      COALESCE(au.avatar_version, '') AS avatarVersion,
      CASE WHEN c.author_id = ? THEN 1 ELSE 0 END AS own
    FROM social_comments c
    JOIN social_users su ON su.social_user_id = c.author_id
    JOIN auth_users au ON au.username = su.auth_username
    WHERE c.post_id = ? AND c.status = 'active' AND au.active = 1 AND su.suspended_at IS NULL
      AND (c.created_at > ? OR (c.created_at = ? AND c.id > ?))
    ORDER BY c.created_at ASC, c.id ASC
    LIMIT ?`).bind(context.social.social_user_id, postId, afterAt, afterAt, afterId, PAGE_SIZE + 1).all();
  const rows = [];
  for (const raw of result.results || []) {
    const row = await decorateSocialRow(env, raw);
    rows.push({
      id: row.id,
      body: row.body,
      createdAt: row.created_at,
      author: publicSummary(row),
      own: Number(row.own) === 1
    });
  }
  const hasMore = rows.length > PAGE_SIZE;
  const comments = rows.slice(0, PAGE_SIZE);
  const last = comments[comments.length - 1];
  return json({
    comments,
    nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, id: last.id }) : ''
  }, 200, origin);
}

async function handleCommentCreate(request, env, context, postId, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const post = await visiblePost(env, context, postId);
  if (!post) return json({ error: 'Publicação não encontrada.' }, 404, origin);
  const limited = await enforceRateLimit(env, context.social.social_user_id, 'comment');
  if (!limited.allowed) return rateLimitResponse(limited, origin);
  const body = await request.json().catch(() => ({}));
  const text = cleanText(body.body, COMMENT_LIMIT);
  if (!text) return json({ error: 'Escreva um comentário.' }, 400, origin);
  const id = randomId('comment');
  await env.AUTH_DB.prepare('INSERT INTO social_comments(id, post_id, author_id, body) VALUES (?, ?, ?, ?)')
    .bind(id, postId, context.social.social_user_id, text).run();
  await createNotification(env, post.author_id, 'comment', context.social.social_user_id, 'post', postId, context.executionContext);
  return json({
    comment: {
      id,
      body: text,
      createdAt: new Date().toISOString(),
      author: publicSummary(context.social),
      own: true
    }
  }, 201, origin);
}

async function handleCommentDelete(env, context, commentId, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const comment = await env.AUTH_DB.prepare('SELECT id, author_id AS authorId, status FROM social_comments WHERE id = ? LIMIT 1')
    .bind(commentId).first();
  if (!comment || comment.authorId !== context.social.social_user_id || comment.status === 'deleted') {
    return json({ error: 'Comentário não encontrado.' }, 404, origin);
  }
  await env.AUTH_DB.prepare(`UPDATE social_comments SET status = 'deleted', body = '',
    deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND author_id = ?`)
    .bind(commentId, context.social.social_user_id).run();
  return json({ ok: true }, 200, origin);
}

async function handleReaction(request, env, context, postId, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  if (!(await visiblePost(env, context, postId))) return json({ error: 'Publicação não encontrada.' }, 404, origin);
  const limited = await enforceRateLimit(env, context.social.social_user_id, 'reaction');
  if (!limited.allowed) return rateLimitResponse(limited, origin);
  if (request.method === 'PUT') {
    await env.AUTH_DB.prepare(`INSERT INTO social_reactions(post_id, social_user_id, kind)
      VALUES (?, ?, 'like') ON CONFLICT(post_id, social_user_id) DO NOTHING`)
      .bind(postId, context.social.social_user_id).run();
  } else if (request.method === 'DELETE') {
    await env.AUTH_DB.prepare('DELETE FROM social_reactions WHERE post_id = ? AND social_user_id = ?')
      .bind(postId, context.social.social_user_id).run();
  } else {
    return json({ error: 'Método não permitido.' }, 405, origin);
  }
  const count = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total FROM social_reactions reaction
    JOIN social_users reaction_author ON reaction_author.social_user_id = reaction.social_user_id
    JOIN auth_users reaction_auth ON reaction_auth.username = reaction_author.auth_username
    WHERE reaction.post_id = ? AND reaction_auth.active = 1 AND reaction_author.suspended_at IS NULL`)
    .bind(postId).first();
  return json({ reacted: request.method === 'PUT', reactions: Number(count?.total || 0) }, 200, origin);
}

async function handleNotifications(request, url, env, context, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  if (request.method === 'PATCH') {
    const body = await request.json().catch(() => ({}));
    const id = Math.max(0, Number.parseInt(String(body.id || '0'), 10) || 0);
    if (id) {
      await env.AUTH_DB.prepare(`UPDATE social_notifications SET read_at = CURRENT_TIMESTAMP
        WHERE id = ? AND recipient_id = ?`).bind(id, context.social.social_user_id).run();
    } else {
      await env.AUTH_DB.prepare(`UPDATE social_notifications SET read_at = CURRENT_TIMESTAMP
        WHERE recipient_id = ? AND read_at IS NULL`).bind(context.social.social_user_id).run();
    }
    return json({ ok: true }, 200, origin);
  }
  if (request.method !== 'GET') return json({ error: 'Método não permitido.' }, 405, origin);
  const cursor = decodeCursor(url.searchParams.get('cursor'));
  const beforeId = Math.max(0, Number(cursor?.id || 0)) || Number.MAX_SAFE_INTEGER;
  const result = await env.AUTH_DB.prepare(`SELECT notification.id, notification.type, notification.entity_type AS entityType,
      notification.entity_id AS entityId, notification.created_at AS createdAt,
      notification.read_at AS readAt, actor.handle, au.name, au.role,
      au.job_title AS jobTitle, COALESCE(au.avatar_data, '') <> '' AS avatarAvailable,
      COALESCE(au.avatar_version, '') AS avatarVersion
    FROM social_notifications notification
    LEFT JOIN social_users actor ON actor.social_user_id = notification.actor_id
    LEFT JOIN auth_users au ON au.username = actor.auth_username
    WHERE notification.recipient_id = ? AND notification.id < ?
      AND (notification.actor_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM social_relationships block
        WHERE block.pair_low = CASE WHEN notification.actor_id < ? THEN notification.actor_id ELSE ? END
          AND block.pair_high = CASE WHEN notification.actor_id < ? THEN ? ELSE notification.actor_id END
          AND block.state = 'blocked'
      ))
    ORDER BY notification.id DESC LIMIT ?`)
    .bind(
      context.social.social_user_id,
      beforeId,
      context.social.social_user_id,
      context.social.social_user_id,
      context.social.social_user_id,
      context.social.social_user_id,
      PAGE_SIZE + 1
    ).all();
  const labels = {
    friend_request: 'enviou um pedido de amizade',
    friend_accepted: 'aceitou seu pedido de amizade',
    comment: 'comentou em uma publicação sua'
  };
  const rows = [];
  for (const raw of result.results || []) {
    const row = await decorateSocialRow(env, raw);
    rows.push({
      id: Number(row.id),
      type: row.type,
      text: labels[row.type] || 'há uma nova atualização social',
      actor: row.handle ? publicSummary(row) : null,
      entityType: row.entityType,
      entityId: row.entityId,
      createdAt: row.createdAt,
      read: Boolean(row.readAt)
    });
  }
  const hasMore = rows.length > PAGE_SIZE;
  const notifications = rows.slice(0, PAGE_SIZE);
  const last = notifications[notifications.length - 1];
  return json({
    notifications,
    nextCursor: hasMore && last ? encodeCursor({ id: last.id }) : ''
  }, 200, origin);
}

function dataUrlResponse(dataUrl, origin, avatarVersion = '') {
  const match = String(dataUrl || '').match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return json({ error: 'Foto de perfil não encontrada.' }, 404, origin);
  const binary = atob(match[2]);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Response(bytes, {
    status: 200,
    headers: {
      ...responseHeaders(origin, true),
      'Content-Type': `image/${match[1]}`,
      'Cache-Control': 'private, max-age=300',
      ...(avatarVersion ? { 'ETag': `"avatar-${avatarVersion}"`, 'X-Portal-Avatar-Version': avatarVersion } : {}),
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Content-Length': String(bytes.byteLength)
    }
  });
}

async function handleAvatar(env, context, handle, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const target = await decorateSocialRow(env, await resolveSocialUser(env, handle));
  if (!target) return json({ error: 'Foto de perfil não encontrada.' }, 404, origin);
  const relation = await relationshipRow(env, context.social.social_user_id, target.social_user_id);
  if (!canViewSocialProfile(context.social, target, relation)) return json({ error: 'Foto de perfil não encontrada.' }, 404, origin);
  const row = await env.AUTH_DB.prepare(`SELECT avatar_data AS avatarData,
      COALESCE(avatar_version, '') AS avatarVersion
    FROM auth_users WHERE username = ? AND active = 1`)
    .bind(target.auth_username).first();
  return dataUrlResponse(row?.avatarData || '', origin, String(row?.avatarVersion || ''));
}

async function reportTarget(env, context, targetType, targetValue) {
  if (targetType === 'profile') {
    const target = await decorateSocialRow(env, await resolveSocialUser(env, targetValue));
    if (!target) return null;
    const relation = await relationshipRow(env, context.social.social_user_id, target.social_user_id);
    if (!canViewSocialProfile(context.social, target, relation) || target.social_user_id === context.social.social_user_id) return null;
    return { id: target.social_user_id, authorId: target.social_user_id };
  }
  if (targetType === 'post') {
    const post = await visiblePost(env, context, targetValue);
    if (!post || post.author_id === context.social.social_user_id) return null;
    return { id: post.id, authorId: post.author_id };
  }
  if (targetType === 'comment') {
    const comment = await env.AUTH_DB.prepare(`SELECT c.id, c.author_id AS authorId, c.post_id AS postId
      FROM social_comments c WHERE c.id = ? AND c.status = 'active' LIMIT 1`).bind(targetValue).first();
    if (!comment || comment.authorId === context.social.social_user_id) return null;
    if (!(await visiblePost(env, context, comment.postId))) return null;
    return { id: comment.id, authorId: comment.authorId };
  }
  return null;
}

async function handleReportCreate(request, env, context, origin) {
  const gate = socialGate(context.user, context.social);
  if (!gate.allowed) return gateResponse(gate, origin);
  const limited = await enforceRateLimit(env, context.social.social_user_id, 'report');
  if (!limited.allowed) return rateLimitResponse(limited, origin);
  const body = await request.json().catch(() => ({}));
  const targetType = cleanText(body.targetType, 20);
  const target = await reportTarget(env, context, targetType, cleanText(body.target, 100));
  if (!target) return json({ error: 'Conteúdo social não disponível para denúncia.' }, 404, origin);
  const reason = cleanText(body.reason, 30);
  if (!REPORT_REASONS.has(reason)) return json({ error: 'Selecione um motivo de denúncia válido.' }, 400, origin);
  const details = cleanText(body.details, REPORT_DETAIL_LIMIT);
  const existing = await env.AUTH_DB.prepare(`SELECT id FROM social_reports
    WHERE reporter_id = ? AND target_type = ? AND target_id = ? AND status = 'open' LIMIT 1`)
    .bind(context.social.social_user_id, targetType, target.id).first();
  if (existing?.id) return json({ ok: true, reportId: existing.id }, 200, origin);
  const id = randomId('report');
  await env.AUTH_DB.prepare(`INSERT INTO social_reports
    (id, reporter_id, target_type, target_id, reason, details)
    VALUES (?, ?, ?, ?, ?, ?)`).bind(id, context.social.social_user_id, targetType, target.id, reason, details).run();
  return json({ ok: true, reportId: id }, 201, origin);
}

function requireModerator(context, origin) {
  if (context.user?.role !== 'admin') {
    return json({ error: 'Acesso exclusivo do Desenvolvedor.', code: 'SOCIAL_MODERATOR_REQUIRED' }, 403, origin);
  }
  const gate = socialGate(context.user, context.social);
  return gate.allowed ? null : gateResponse(gate, origin);
}

async function moderationAudit(env, actorUsername, action, targetType, targetId, metadata = {}) {
  const safeMetadata = {
    reportId: cleanText(metadata.reportId, 90),
    status: cleanText(metadata.status, 24),
    reasonCode: cleanText(metadata.reasonCode, 40)
  };
  await env.AUTH_DB.prepare(`INSERT INTO social_moderation_audit
    (actor_username, action, target_type, target_id, metadata_json)
    VALUES (?, ?, ?, ?, ?)`).bind(actorUsername, action, targetType, targetId, JSON.stringify(safeMetadata)).run();
}

async function targetAuthorId(env, targetType, targetId) {
  if (targetType === 'profile') return targetId;
  if (targetType === 'post') {
    const row = await env.AUTH_DB.prepare('SELECT author_id AS authorId FROM social_posts WHERE id = ?').bind(targetId).first();
    return row?.authorId || '';
  }
  if (targetType === 'comment') {
    const row = await env.AUTH_DB.prepare('SELECT author_id AS authorId FROM social_comments WHERE id = ?').bind(targetId).first();
    return row?.authorId || '';
  }
  return '';
}

async function moderationTargetSummary(env, targetType, targetId) {
  if (targetType === 'profile') {
    const row = await decorateSocialRow(env, await socialUserById(env, targetId));
    if (!row) return null;
    return {
      type: 'profile',
      status: row.suspended_at ? 'suspended' : 'active',
      text: [row.status_text, row.bio].filter(Boolean).join(' — ').slice(0, 380),
      author: publicSummary(row),
      authorSocialUserId: row.social_user_id,
      authorSuspended: Boolean(row.suspended_at)
    };
  }
  const table = targetType === 'post' ? 'social_posts' : targetType === 'comment' ? 'social_comments' : '';
  if (!table) return null;
  const row = await env.AUTH_DB.prepare(`SELECT content.id, content.body, content.status,
      content.author_id AS authorSocialUserId, su.handle, su.status_text,
      su.suspended_at, au.username, au.name, au.role, au.job_title AS jobTitle,
      COALESCE(au.avatar_data, '') <> '' AS avatarAvailable,
      COALESCE(au.avatar_version, '') AS avatarVersion
    FROM ${table} content
    JOIN social_users su ON su.social_user_id = content.author_id
    JOIN auth_users au ON au.username = su.auth_username
    WHERE content.id = ? LIMIT 1`).bind(targetId).first();
  if (!row) return null;
  const decorated = await decorateSocialRow(env, row);
  return {
    type: targetType,
    status: decorated.status,
    text: decorated.body || '',
    author: publicSummary(decorated),
    authorSocialUserId: decorated.authorSocialUserId,
    authorSuspended: Boolean(decorated.suspended_at)
  };
}

async function hideModeratedContent(env, targetType, targetId) {
  if (targetType === 'post') {
    const result = await env.AUTH_DB.prepare(`UPDATE social_posts SET status = 'hidden', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status <> 'deleted'`).bind(targetId).run();
    return Number(result.meta?.changes || 0) > 0;
  }
  if (targetType === 'comment') {
    const result = await env.AUTH_DB.prepare(`UPDATE social_comments SET status = 'hidden', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status <> 'deleted'`).bind(targetId).run();
    return Number(result.meta?.changes || 0) > 0;
  }
  return false;
}

async function handleModerationReports(request, url, env, context, origin) {
  const denied = requireModerator(context, origin);
  if (denied) return denied;
  const reportMatch = url.pathname.match(/^\/api\/social\/moderation\/reports\/([A-Za-z0-9_-]+)$/);
  if (reportMatch && request.method === 'PATCH') {
    const report = await env.AUTH_DB.prepare('SELECT * FROM social_reports WHERE id = ? LIMIT 1').bind(reportMatch[1]).first();
    if (!report) return json({ error: 'Denúncia não encontrada.' }, 404, origin);
    const body = await request.json().catch(() => ({}));
    const status = ['resolved', 'dismissed'].includes(body.status) ? body.status : '';
    const action = ['none', 'hide_content', 'suspend_user'].includes(body.action) ? body.action : '';
    if (!status || !action) return json({ error: 'Resolução de moderação inválida.' }, 400, origin);
    if (action === 'hide_content' && !(await hideModeratedContent(env, report.target_type, report.target_id))) {
      return json({ error: 'O alvo desta denúncia não pode ser ocultado.' }, 409, origin);
    }
    if (action === 'suspend_user') {
      const authorId = await targetAuthorId(env, report.target_type, report.target_id);
      if (!authorId || authorId === context.social.social_user_id) return json({ error: 'A suspensão solicitada não é permitida.' }, 409, origin);
      await env.AUTH_DB.prepare(`UPDATE social_users SET suspended_at = CURRENT_TIMESTAMP,
        suspended_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE social_user_id = ?`)
        .bind(`Denúncia ${report.id}: ${report.reason}`, authorId).run();
    }
    await env.AUTH_DB.prepare(`UPDATE social_reports SET status = ?, resolution_action = ?, reviewed_by = ?,
      resolved_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(status, action, context.user.username, report.id).run();
    await moderationAudit(env, context.user.username, `report_${action}`, report.target_type, report.target_id, {
      reportId: report.id,
      status,
      reasonCode: report.reason
    });
    return json({ ok: true }, 200, origin);
  }

  if (request.method !== 'GET' || url.pathname !== '/api/social/moderation/reports') {
    return json({ error: 'Rota de moderação não encontrada.' }, 404, origin);
  }
  const status = ['open', 'resolved', 'dismissed'].includes(url.searchParams.get('status')) ? url.searchParams.get('status') : 'open';
  const cursor = decodeCursor(url.searchParams.get('cursor'));
  const afterAt = cleanText(cursor?.createdAt, 40) || '';
  const afterId = cleanText(cursor?.id, 90) || '';
  const result = await env.AUTH_DB.prepare(`SELECT report.*, reporter.handle AS reporterHandle,
      reporter_auth.name AS reporterName
    FROM social_reports report
    JOIN social_users reporter ON reporter.social_user_id = report.reporter_id
    JOIN auth_users reporter_auth ON reporter_auth.username = reporter.auth_username
    WHERE report.status = ?
      AND (report.created_at > ? OR (report.created_at = ? AND report.id > ?))
    ORDER BY report.created_at ASC, report.id ASC LIMIT ?`)
    .bind(status, afterAt, afterAt, afterId, PAGE_SIZE + 1).all();
  const rows = [];
  for (const row of result.results || []) {
    rows.push({
      id: row.id,
      targetType: row.target_type,
      targetId: row.target_id,
      reason: row.reason,
      details: row.details,
      status: row.status,
      createdAt: row.created_at,
      reporter: { handle: row.reporterHandle, name: row.reporterName || row.reporterHandle },
      target: await moderationTargetSummary(env, row.target_type, row.target_id)
    });
  }
  const hasMore = rows.length > PAGE_SIZE;
  const reports = rows.slice(0, PAGE_SIZE);
  const last = reports[reports.length - 1];
  return json({
    reports,
    nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, id: last.id }) : ''
  }, 200, origin);
}

async function handleModerationUser(request, env, context, socialUserId, origin) {
  const denied = requireModerator(context, origin);
  if (denied) return denied;
  if (request.method !== 'PATCH') return json({ error: 'Método não permitido.' }, 405, origin);
  const target = await socialUserById(env, socialUserId);
  if (!target) return json({ error: 'Perfil social não encontrado.' }, 404, origin);
  if (target.social_user_id === context.social.social_user_id) return json({ error: 'Não é permitido suspender sua própria participação social.' }, 409, origin);
  const body = await request.json().catch(() => ({}));
  const suspended = Boolean(body.suspended);
  const reason = cleanText(body.reason, 180);
  if (suspended && !reason) return json({ error: 'Informe um motivo objetivo para a suspensão.' }, 400, origin);
  await env.AUTH_DB.prepare(`UPDATE social_users SET suspended_at = ?, suspended_reason = ?,
    updated_at = CURRENT_TIMESTAMP WHERE social_user_id = ?`)
    .bind(suspended ? new Date().toISOString() : null, suspended ? reason : '', target.social_user_id).run();
  await moderationAudit(env, context.user.username, suspended ? 'social_suspend' : 'social_restore', 'profile', target.social_user_id, {
    reasonCode: suspended ? 'manual' : 'restore'
  });
  return json({ ok: true, suspended }, 200, origin);
}

async function handleModerationContent(request, env, context, targetType, targetId, origin) {
  const denied = requireModerator(context, origin);
  if (denied) return denied;
  if (request.method !== 'PATCH' || !['post', 'comment'].includes(targetType)) return json({ error: 'Método não permitido.' }, 405, origin);
  const body = await request.json().catch(() => ({}));
  const hidden = body.hidden !== false;
  const table = targetType === 'post' ? 'social_posts' : 'social_comments';
  const current = await env.AUTH_DB.prepare(`SELECT status FROM ${table} WHERE id = ? LIMIT 1`).bind(targetId).first();
  if (!current || current.status === 'deleted') return json({ error: 'Conteúdo social não encontrado.' }, 404, origin);
  await env.AUTH_DB.prepare(`UPDATE ${table} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(hidden ? 'hidden' : 'active', targetId).run();
  await moderationAudit(env, context.user.username, hidden ? 'content_hide' : 'content_restore', targetType, targetId);
  return json({ ok: true, hidden }, 200, origin);
}

async function handleMigrationStatus(env, context, origin) {
  const denied = requireModerator(context, origin);
  if (denied) return denied;
  return json({ migrations: await socialMigrationStatus(env) }, 200, origin);
}

export async function handleSocialRoute(request, env, origin, originAllowed = true, executionContext = null) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const url = new URL(request.url);

  if (url.pathname === '/api/social/config' && request.method === 'GET') {
    return handleConfig(request, env, origin);
  }

  const context = await requestContext(request, env);
  context.executionContext = executionContext;
  if (context.error) return json({ error: context.error, code: context.code }, context.status, origin);
  if (context.disabled) {
    return json({ error: 'Camada Social ainda não ativada.', code: 'SOCIAL_DISABLED' }, 503, origin);
  }

  if (url.pathname === '/api/social/me') return handleMyProfile(request, env, context, origin);
  if (url.pathname === '/api/social/search' && request.method === 'GET') return handleSearch(url, env, context, origin);
  if (url.pathname === '/api/social/relationships' && request.method === 'POST') return handleRelationshipAction(request, env, context, origin);
  if (url.pathname === '/api/social/relationships' && request.method === 'GET') return handleRelationshipList(url, env, context, origin);
  if (url.pathname === '/api/social/feed' && request.method === 'GET') return handleFeed(url, env, context, origin);
  if (url.pathname === '/api/social/posts' && request.method === 'POST') return handlePostCreate(request, env, context, origin);
  if (url.pathname === '/api/social/notifications') return handleNotifications(request, url, env, context, origin);
  if (url.pathname === '/api/social/reports' && request.method === 'POST') return handleReportCreate(request, env, context, origin);
  if (url.pathname === '/api/social/migrations/status' && request.method === 'GET') return handleMigrationStatus(env, context, origin);

  const profileMatch = url.pathname.match(/^\/api\/social\/profiles\/([A-Za-z0-9._@-]+)$/);
  if (profileMatch && request.method === 'GET') return handleProfileGet(env, context, decodeURIComponent(profileMatch[1]), origin);
  const profilePostsMatch = url.pathname.match(/^\/api\/social\/profiles\/([A-Za-z0-9._@-]+)\/posts$/);
  if (profilePostsMatch && request.method === 'GET') {
    return handleProfilePosts(url, env, context, decodeURIComponent(profilePostsMatch[1]), origin);
  }
  const avatarMatch = url.pathname.match(/^\/api\/social\/avatars\/([A-Za-z0-9._@-]+)$/);
  if (avatarMatch && request.method === 'GET') return handleAvatar(env, context, decodeURIComponent(avatarMatch[1]), origin);
  const postMatch = url.pathname.match(/^\/api\/social\/posts\/(post_[A-Za-z0-9_-]+)$/);
  if (postMatch && ['PATCH', 'DELETE'].includes(request.method)) {
    return handlePostMutation(request, env, context, postMatch[1], origin);
  }
  const commentsMatch = url.pathname.match(/^\/api\/social\/posts\/(post_[A-Za-z0-9_-]+)\/comments$/);
  if (commentsMatch && request.method === 'GET') return handleCommentsGet(url, env, context, commentsMatch[1], origin);
  if (commentsMatch && request.method === 'POST') return handleCommentCreate(request, env, context, commentsMatch[1], origin);
  const reactionMatch = url.pathname.match(/^\/api\/social\/posts\/(post_[A-Za-z0-9_-]+)\/reaction$/);
  if (reactionMatch) return handleReaction(request, env, context, reactionMatch[1], origin);
  const commentMatch = url.pathname.match(/^\/api\/social\/comments\/(comment_[A-Za-z0-9_-]+)$/);
  if (commentMatch && request.method === 'DELETE') return handleCommentDelete(env, context, commentMatch[1], origin);

  if (url.pathname.startsWith('/api/social/moderation/reports')) return handleModerationReports(request, url, env, context, origin);
  const moderationUser = url.pathname.match(/^\/api\/social\/moderation\/users\/([A-Za-z0-9-]+)$/);
  if (moderationUser) return handleModerationUser(request, env, context, moderationUser[1], origin);
  const moderationContent = url.pathname.match(/^\/api\/social\/moderation\/content\/(post|comment)\/([A-Za-z0-9_-]+)$/);
  if (moderationContent) return handleModerationContent(request, env, context, moderationContent[1], moderationContent[2], origin);

  return json({ error: 'Rota social não encontrada.' }, 404, origin);
}

export const SOCIAL_LIMITS = Object.freeze({
  pageSize: PAGE_SIZE,
  searchSize: SEARCH_SIZE,
  postLength: POST_LIMIT,
  commentLength: COMMENT_LIMIT,
  rateLimits: RATE_LIMITS
});
