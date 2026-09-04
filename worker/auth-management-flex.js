'use strict';

import {
  handlePortalRoute as handlePortalRouteBase,
  isPortalApi,
  validatePortalSession as validatePortalSessionBase,
  ensureAuthSchema
} from './auth-management-v2.js';
import {
  handleEmailVerificationRoute,
  isEmailVerificationRoute
} from './email-verification-route.js';
import {
  decorateTelemedicineUser,
  decorateTelemedicineUsers,
  setTelemedicineAccess,
  telemedicineAccessFor,
  telemedicineUnderlyingRole,
  telemedicineDefaultJobTitle
} from './telemedicine-access.js';
import {
  councilViceAccessFor,
  councilViceDefaultJobTitle,
  councilViceOfficeName,
  councilViceUnderlyingRole,
  decorateCouncilViceUser,
  decorateCouncilViceUsers,
  setCouncilViceAccess
} from './council-vice-access.js';

export { isPortalApi, ensureAuthSchema };

function responseWithPayload(response, payload) {
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(payload), { status: response.status, headers });
}

function jsonError(message, status, origin) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify({ error: message }), { status, headers });
}

function roleCanAccess(role, allowedRoles = []) {
  if (!allowedRoles.length) return true;
  if (role === 'admin') return true;
  if (allowedRoles.includes(role)) return true;
  return role === 'coordenacao' && allowedRoles.some((item) => item === 'medico' || item === 'recepcao');
}

async function decoratePortalUser(env, user) {
  if (!user) return user;
  const telemedicine = await decorateTelemedicineUser(env, user);
  return decorateCouncilViceUser(env, telemedicine);
}

async function decoratePortalUsers(env, users) {
  const telemedicine = await decorateTelemedicineUsers(env, users);
  return decorateCouncilViceUsers(env, telemedicine);
}

export async function validatePortalSession(request, env, allowedRoles = []) {
  const baseUser = await validatePortalSessionBase(request, env, []);
  if (!baseUser) return null;
  const user = await decoratePortalUser(env, baseUser);
  return roleCanAccess(user.role, allowedRoles) ? user : null;
}

async function normalizeSecurityPrivacy(response) {
  if (!response?.ok) return response;
  const type = response.headers.get('Content-Type') || '';
  if (!type.includes('application/json')) return response;
  const payload = await response.clone().json().catch(() => null);
  if (!payload?.security) return response;
  payload.security.privacyMode = payload.security.emailVerified === true ? 'sigilosa' : 'anonima';
  return responseWithPayload(response, payload);
}

async function decorateAuthUserResponse(response, env) {
  if (!response?.ok) return response;
  const payload = await response.clone().json().catch(() => null);
  if (!payload?.user) return response;
  payload.user = await decoratePortalUser(env, payload.user);
  return responseWithPayload(response, payload);
}

function adminTargetUsername(pathname) {
  const match = pathname.match(/^\/api\/admin\/users\/([a-z0-9._-]+)(?:\/reset-password)?$/);
  return match ? match[1] : '';
}

async function rewrittenAdminRequest(request, { role = '', councilRole = '' } = {}) {
  const body = await request.clone().json().catch(() => ({}));
  let changed = false;

  if (role) {
    body.role = role;
    changed = true;
    if (role === telemedicineUnderlyingRole() && !String(body.jobTitle || '').trim()) {
      body.jobTitle = telemedicineDefaultJobTitle();
    }
  }

  if (councilRole) {
    body.councilRole = councilRole;
    changed = true;
    if (councilRole === councilViceUnderlyingRole() && !String(body.jobTitle || '').trim()) {
      body.jobTitle = councilViceDefaultJobTitle();
    }
  }

  if (!changed) return request;
  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(body)
  });
}

async function handleAdminUsers(request, env, origin) {
  const url = new URL(request.url);
  const actorBase = await validatePortalSessionBase(request, env, []);
  const actor = actorBase ? await decoratePortalUser(env, actorBase) : null;
  const targetUsername = adminTargetUsername(url.pathname);

  if (actor?.role === 'coordenacao' && targetUsername && await telemedicineAccessFor(env, targetUsername)) {
    return jsonError('O perfil Técnico em Telemedicina é gerenciado somente pelo Desenvolvedor.', 403, origin);
  }
  if (actor?.role === 'coordenacao' && targetUsername && await councilViceAccessFor(env, targetUsername)) {
    return jsonError('O cargo Vice-Presidente do Conselho é gerenciado somente pelo Desenvolvedor.', 403, origin);
  }

  let requestedRole = '';
  let requestedCouncilRole = null;
  let baseRequest = request;

  if ((request.method === 'POST' || request.method === 'PATCH') && url.pathname.startsWith('/api/admin/users')) {
    const body = await request.clone().json().catch(() => ({}));
    requestedRole = String(body.role || '').trim();
    if (Object.prototype.hasOwnProperty.call(body, 'councilRole')) {
      requestedCouncilRole = String(body.councilRole || '').trim();
    }

    let rewrittenRole = '';
    let rewrittenCouncilRole = '';

    if (requestedRole === 'telemedicina') {
      if (actor?.role !== 'admin') return jsonError('Somente o Desenvolvedor pode conceder o perfil Técnico em Telemedicina.', 403, origin);
      rewrittenRole = telemedicineUnderlyingRole();
    }

    if (requestedCouncilRole === councilViceOfficeName()) {
      if (actor?.role !== 'admin') return jsonError('Somente o Desenvolvedor pode conceder o cargo Vice-Presidente do Conselho.', 403, origin);
      rewrittenCouncilRole = councilViceUnderlyingRole();
    }

    if (rewrittenRole || rewrittenCouncilRole) {
      baseRequest = await rewrittenAdminRequest(request, {
        role: rewrittenRole,
        councilRole: rewrittenCouncilRole
      });
    }
  }

  const response = await handlePortalRouteBase(baseRequest, env, origin, true);
  if (!response?.ok) return response;
  const payload = await response.clone().json().catch(() => null);
  if (!payload) return response;

  if (url.pathname === '/api/admin/users' && request.method === 'GET' && Array.isArray(payload.users)) {
    let users = await decoratePortalUsers(env, payload.users);
    if (payload.actor?.role === 'coordenacao') {
      users = users.filter((item) => item.role !== 'telemedicina' && item.councilOffice !== councilViceOfficeName());
    }
    payload.users = users;
    if (payload.actor?.role === 'admin') {
      const roles = Array.isArray(payload.actor.assignableRoles) ? payload.actor.assignableRoles : [];
      payload.actor.assignableRoles = [...new Set([...roles, 'telemedicina'])];
    }
    return responseWithPayload(response, payload);
  }

  if (payload.user?.username) {
    if (request.method === 'POST' && url.pathname === '/api/admin/users' && requestedRole === 'telemedicina') {
      await setTelemedicineAccess(env, payload.user.username, true, actor?.username || 'admin');
    } else if (request.method === 'PATCH' && targetUsername && requestedRole) {
      await setTelemedicineAccess(env, targetUsername, requestedRole === 'telemedicina', actor?.username || 'admin');
    }

    if (actor?.role === 'admin') {
      if (request.method === 'POST' && url.pathname === '/api/admin/users') {
        if (requestedCouncilRole === councilViceOfficeName()) {
          await setCouncilViceAccess(env, payload.user.username, true, actor.username || 'admin');
        }
      } else if (request.method === 'PATCH' && targetUsername && requestedCouncilRole !== null) {
        await setCouncilViceAccess(env, targetUsername, requestedCouncilRole === councilViceOfficeName(), actor.username || 'admin');
      }
    }

    payload.user = await decoratePortalUser(env, payload.user);
    return responseWithPayload(response, payload);
  }

  return response;
}

export async function handlePortalRoute(request, env, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (originAllowed && request.method === 'POST' && isEmailVerificationRoute(url.pathname)) {
    return handleEmailVerificationRoute(request, env, origin);
  }

  if (url.pathname.startsWith('/api/admin/users')) {
    if (!originAllowed) return jsonError('Origem não autorizada.', 403, origin);
    return handleAdminUsers(request, env, origin);
  }

  const response = await handlePortalRouteBase(request, env, origin, originAllowed);
  if (url.pathname === '/api/auth/security' && (request.method === 'GET' || request.method === 'PATCH')) {
    return normalizeSecurityPrivacy(response);
  }
  if (['/api/auth/login', '/api/auth/me', '/api/auth/change-password'].includes(url.pathname)) {
    return decorateAuthUserResponse(response, env);
  }
  return response;
}
