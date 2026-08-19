'use strict';

import {
  handlePortalRoute as handlePortalRouteBase,
  isPortalApi,
  validatePortalSession,
  ensureAuthSchema
} from './auth-management-v2.js';
import {
  handleEmailVerificationRoute,
  isEmailVerificationRoute
} from './email-verification-route.js';

export { isPortalApi, validatePortalSession, ensureAuthSchema };

async function normalizeSecurityPrivacy(response) {
  if (!response?.ok) return response;
  const type = response.headers.get('Content-Type') || '';
  if (!type.includes('application/json')) return response;
  const payload = await response.clone().json().catch(() => null);
  if (!payload?.security) return response;
  payload.security.privacyMode = payload.security.emailVerified === true ? 'sigilosa' : 'anonima';
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(payload), { status: response.status, headers });
}

export async function handlePortalRoute(request, env, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (originAllowed && request.method === 'POST' && isEmailVerificationRoute(url.pathname)) {
    return handleEmailVerificationRoute(request, env, origin);
  }
  const response = await handlePortalRouteBase(request, env, origin, originAllowed);
  if (url.pathname === '/api/auth/security' && (request.method === 'GET' || request.method === 'PATCH')) {
    return normalizeSecurityPrivacy(response);
  }
  return response;
}