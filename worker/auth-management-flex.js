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

export async function handlePortalRoute(request, env, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (originAllowed && request.method === 'POST' && isEmailVerificationRoute(url.pathname)) {
    return handleEmailVerificationRoute(request, env, origin);
  }
  return handlePortalRouteBase(request, env, origin, originAllowed);
}
