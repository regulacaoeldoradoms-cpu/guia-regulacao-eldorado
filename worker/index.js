'use strict';

import aiWorker from './gemini-assistant.js';
import { handlePortalRoute, isPortalApi, validatePortalSession } from './auth-management-flex.js';
import { handleProfileRoute, isProfileApi } from './profile-photo.js';
import { handleChatRoute, isChatApi } from './portal-chat-v2.js';
import { handleUsageRoute, isUsageApi } from './usage-monitor-v2.js';
import { handleCouncilRoute, isCouncilApi } from './council.js';
import { enforceDeveloperSeparation } from './role-migration.js';
import {
  augmentAuthResponse,
  enforceProfessionalEmailGate,
  guardDeveloperSelfMutation,
  portalEnvForAuthRoute,
  sanitizeCitizenRegistrationRequest
} from './portal-safety.js';
import {
  guardSecurityEmailRemoval,
  syncCitizenPrivacyAfterSecurityPatch
} from './citizen-privacy.js';

function allowedOrigins(env) {
  const configured = String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured.length ? configured : [
    'https://regulacaoeldoradoms.com.br',
    'https://www.regulacaoeldoradoms.com.br'
  ];
}

function jsonError(message, status, origin, allowed, code = '') {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify({ error: message, ...(code ? { code } : {}) }), { status, headers });
}

export default {
  async fetch(request, env, ctx) {
    await enforceDeveloperSeparation(env);
    request = await sanitizeCitizenRegistrationRequest(request);

    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const originAllowed = !origin || allowedOrigins(env).includes(origin);
    const securityPatchSnapshot = url.pathname === '/api/auth/security' && request.method === 'PATCH' ? request.clone() : null;

    const selfMutationBlock = await guardDeveloperSelfMutation(request, env, validatePortalSession, origin, originAllowed);
    if (selfMutationBlock) return selfMutationBlock;

    const emailRemovalBlock = await guardSecurityEmailRemoval(request, env, validatePortalSession, origin, originAllowed);
    if (emailRemovalBlock) return emailRemovalBlock;

    const emailGate = await enforceProfessionalEmailGate(request, env, validatePortalSession, origin, originAllowed);
    if (emailGate) return emailGate;

    if (isCouncilApi(url.pathname)) {
      try { return await handleCouncilRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no módulo do Conselho.', 500, origin, originAllowed); }
    }
    if (isChatApi(url.pathname)) {
      try { return await handleChatRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no chat interno.', 500, origin, originAllowed); }
    }
    if (isProfileApi(url.pathname)) {
      try { return await handleProfileRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha ao atualizar o perfil.', 500, origin, originAllowed); }
    }
    if (isUsageApi(url.pathname)) {
      try { return await handleUsageRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no monitoramento de uso.', 500, origin, originAllowed); }
    }
    if (isPortalApi(url.pathname)) {
      try {
        const response = await handlePortalRoute(request, portalEnvForAuthRoute(env, url.pathname), origin, originAllowed);
        if (url.pathname === '/api/auth/login' || url.pathname === '/api/auth/me') {
          return augmentAuthResponse(response, env);
        }
        if (securityPatchSnapshot) {
          return syncCitizenPrivacyAfterSecurityPatch(securityPatchSnapshot, response, env, validatePortalSession);
        }
        return response;
      } catch (error) {
        return jsonError(error?.message || 'Falha no serviço de autenticação.', 500, origin, originAllowed);
      }
    }

    if (url.pathname === '/api/ia' && request.method !== 'OPTIONS' && String(env.AUTH_ENFORCE_AI || '').toLowerCase() === 'true') {
      const user = await validatePortalSession(request, env, ['medico']);
      if (!user) return jsonError('Acesso profissional necessário para utilizar a pré-regulação.', 403, origin, originAllowed);
    }
    return aiWorker.fetch(request, env, ctx);
  }
};
