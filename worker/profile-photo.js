'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import { accountProgressFor, minimumLevelMet } from './account-levels.js';

const MAX_AVATAR_DATA_URL = 220000;

function baseHeaders(origin, allowed = true) {
  const headers = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return headers;
}

function jsonResponse(body, status, origin, allowed = true) {
  const headers = { ...baseHeaders(origin, allowed), 'Content-Type': 'application/json; charset=utf-8' };
  return new Response(JSON.stringify(body), { status, headers });
}

function preflight(origin, allowed) {
  if (!allowed) return jsonResponse({ error: 'Origem não autorizada.' }, 403, origin, false);
  const headers = baseHeaders(origin, true);
  headers['Access-Control-Allow-Methods'] = 'GET, PATCH, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  headers['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers });
}

async function ensureAvatarColumns(env) {
  if (!env.AUTH_DB) return false;
  const columns = await env.AUTH_DB.prepare('PRAGMA table_info(auth_users)').all();
  const names = new Set((columns.results || []).map((column) => String(column.name || '')));
  if (!names.has('avatar_data')) {
    await env.AUTH_DB.prepare("ALTER TABLE auth_users ADD COLUMN avatar_data TEXT NOT NULL DEFAULT ''").run();
  }
  if (!names.has('avatar_version')) {
    await env.AUTH_DB.prepare("ALTER TABLE auth_users ADD COLUMN avatar_version TEXT NOT NULL DEFAULT ''").run();
    await env.AUTH_DB.prepare(`UPDATE auth_users
      SET avatar_version = COALESCE(NULLIF(updated_at, ''), CURRENT_TIMESTAMP)
      WHERE avatar_data <> '' AND avatar_version = ''`).run();
  }
  return true;
}

function nextAvatarVersion() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function validAvatar(value) {
  const avatar = String(value || '');
  if (!avatar) return true;
  if (avatar.length > MAX_AVATAR_DATA_URL) return false;
  return /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(avatar);
}

async function avatarFor(env, username) {
  if (!(await ensureAvatarColumns(env))) return { avatarDataUrl: '', avatarVersion: '' };
  const row = await env.AUTH_DB.prepare('SELECT avatar_data, avatar_version FROM auth_users WHERE username = ?').bind(username).first();
  return {
    avatarDataUrl: String(row?.avatar_data || ''),
    avatarVersion: String(row?.avatar_version || '')
  };
}

export function isProfileApi(pathname) {
  return pathname === '/api/auth/profile';
}

export async function handleProfileRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return jsonResponse({ error: 'Origem não autorizada.' }, 403, origin, false);

  const user = await validatePortalSession(request, env, []);
  if (!user) return jsonResponse({ error: 'Sessão inválida ou expirada.' }, 401, origin, originAllowed);
  if (!env.AUTH_DB) return jsonResponse({ error: 'Banco de usuários ainda não disponível.' }, 503, origin, originAllowed);

  const progress = accountProgressFor(user);
  const photoUnlocked = minimumLevelMet(user, 'prata');

  if (request.method === 'GET') {
    const avatar = photoUnlocked ? await avatarFor(env, user.username) : { avatarDataUrl: '', avatarVersion: '' };
    return jsonResponse({
      avatarDataUrl: avatar.avatarDataUrl,
      avatarVersion: avatar.avatarVersion,
      locked: !photoUnlocked,
      requiredLevel: !photoUnlocked ? 'prata' : '',
      accountLevel: progress.level
    }, 200, origin, originAllowed);
  }

  if (request.method === 'PATCH') {
    if (!photoUnlocked) {
      return jsonResponse({
        error: 'Confirme seu e-mail para alcançar o nível Prata e desbloquear a foto de perfil.',
        code: 'ACCOUNT_LEVEL_REQUIRED',
        requiredLevel: 'prata'
      }, 403, origin, originAllowed);
    }

    const body = await request.json().catch(() => ({}));
    const avatarDataUrl = String(body.avatarDataUrl || '');
    if (!validAvatar(avatarDataUrl)) {
      return jsonResponse({ error: 'A foto de perfil enviada é inválida ou muito grande.' }, 400, origin, originAllowed);
    }
    await ensureAvatarColumns(env);
    const avatarVersion = nextAvatarVersion();
    await env.AUTH_DB.prepare(`UPDATE auth_users
      SET avatar_data = ?, avatar_version = ?, updated_at = CURRENT_TIMESTAMP
      WHERE username = ?`)
      .bind(avatarDataUrl, avatarVersion, user.username)
      .run();
    return jsonResponse({ ok: true, avatarDataUrl, avatarVersion, accountLevel: progress.level }, 200, origin, originAllowed);
  }

  return jsonResponse({ error: 'Método não permitido.' }, 405, origin, originAllowed);
}
