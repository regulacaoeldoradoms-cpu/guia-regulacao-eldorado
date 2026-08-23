'use strict';

import aiWorker from './gemini-assistant.js';
import { handlePortalRoute, isPortalApi, validatePortalSession } from './auth-management-flex.js';
import { handleProfileRoute, isProfileApi } from './profile-photo.js';
import { handleChatRoute, isChatApi } from './portal-chat-v2.js';
import { handleUsageRoute, isUsageApi } from './usage-monitor-v2.js';
import { handleCouncilRoute, isCouncilApi } from './council-access-policy.js';
import { handleSystemReadinessRoute, isSystemReadinessApi } from './system-readiness.js';
import { enforceDeveloperSeparation } from './role-migration.js';
import {
  handleCitizenIdentityRoute,
  isCitizenIdentityApi,
  prepareCitizenHandleLogin
} from './citizen-identity.js';
import {
  augmentAuthResponse,
  enforceProfessionalEmailGate,
  guardCitizenLevelMutation,
  guardCitizenRegistrationBasics,
  guardCitizenRegistrationUsername,
  guardDeveloperSelfMutation,
  portalEnvForAuthRoute,
  sanitizeCitizenRegistrationRequest
} from './portal-safety.js';
import {
  guardSecurityEmailRemoval,
  normalizeSecurityPrivacyResponse,
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

const AUTH_RESPONSES_WITH_USER = new Set([
  '/api/auth/login',
  '/api/auth/me',
  '/api/auth/register',
  '/api/auth/change-password'
]);

const TRANSIENT_AI_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function geminiModels(env) {
  const primary = String(env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();
  const fallbacks = String(env.GEMINI_FALLBACK_MODELS || 'gemini-3.6-flash')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);
  return [...new Set([primary, ...fallbacks].filter(Boolean))];
}

function envForGeminiModel(env, model) {
  return new Proxy(env, {
    get(target, property) {
      if (property === 'GEMINI_MODEL') return model;
      return target[property];
    }
  });
}

async function isTransientAiResponse(response) {
  if (!TRANSIENT_AI_STATUSES.has(response.status)) return false;
  if (response.status === 408 || response.status === 429 || [502, 503, 504].includes(response.status)) return true;

  const payload = await response.clone().json().catch(() => ({}));
  const message = String(payload?.error || '').toLowerCase();
  return /high demand|temporar|unavailable|overload|capacity|timeout|timed out|service unavailable/.test(message);
}

async function fetchAiResilient(request, env, ctx, origin, originAllowed) {
  const models = geminiModels(env);
  let lastResponse = null;

  for (let modelIndex = 0; modelIndex < models.length; modelIndex += 1) {
    const model = models[modelIndex];
    const modelEnv = envForGeminiModel(env, model);
    const attempts = 2;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const response = await aiWorker.fetch(request.clone(), modelEnv, ctx);
      if (!(await isTransientAiResponse(response))) return response;

      lastResponse = response;
      if (attempt < attempts - 1) {
        const baseDelay = 500 * (2 ** attempt);
        const jitter = Math.floor(Math.random() * 250);
        await wait(baseDelay + jitter);
      }
    }
  }

  if (lastResponse) {
    return jsonError(
      'O Gemini está temporariamente sobrecarregado ou indisponível. O sistema já repetiu a tentativa e testou um modelo de contingência. Tente novamente em instantes.',
      503,
      origin,
      originAllowed,
      'GEMINI_TEMPORARILY_UNAVAILABLE'
    );
  }

  return jsonError('Falha ao consultar o assistente.', 502, origin, originAllowed, 'GEMINI_ERROR');
}

export default {
  async fetch(request, env, ctx) {
    await enforceDeveloperSeparation(env);

    let url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const originAllowed = !origin || allowedOrigins(env).includes(origin);

    const preparedLogin = await prepareCitizenHandleLogin(request, env, origin, originAllowed);
    if (preparedLogin instanceof Response) return preparedLogin;
    request = preparedLogin;
    url = new URL(request.url);

    const invalidRegistrationBlock = await guardCitizenRegistrationBasics(request, origin, originAllowed);
    if (invalidRegistrationBlock) return invalidRegistrationBlock;

    const reservedUsernameBlock = await guardCitizenRegistrationUsername(request, origin, originAllowed);
    if (reservedUsernameBlock) return reservedUsernameBlock;

    request = await sanitizeCitizenRegistrationRequest(request);
    url = new URL(request.url);
    const securityPatchSnapshot = url.pathname === '/api/auth/security' && request.method === 'PATCH' ? request.clone() : null;

    const selfMutationBlock = await guardDeveloperSelfMutation(request, env, validatePortalSession, origin, originAllowed);
    if (selfMutationBlock) return selfMutationBlock;

    const citizenLevelBlock = await guardCitizenLevelMutation(request, env, validatePortalSession, origin, originAllowed);
    if (citizenLevelBlock) return citizenLevelBlock;

    const emailRemovalBlock = await guardSecurityEmailRemoval(request, env, validatePortalSession, origin, originAllowed);
    if (emailRemovalBlock) return emailRemovalBlock;

    const emailGate = await enforceProfessionalEmailGate(request, env, validatePortalSession, origin, originAllowed);
    if (emailGate) return emailGate;

    if (isSystemReadinessApi(url.pathname)) {
      try { return await handleSystemReadinessRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no diagnóstico técnico.', 500, origin, originAllowed); }
    }
    if (isCouncilApi(url.pathname)) {
      try { return await handleCouncilRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no módulo do Conselho.', 500, origin, originAllowed); }
    }
    if (isChatApi(url.pathname)) {
      try { return await handleChatRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no chat interno.', 500, origin, originAllowed); }
    }
    if (isCitizenIdentityApi(url.pathname)) {
      try { return await handleCitizenIdentityRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha ao atualizar a identidade do perfil.', 500, origin, originAllowed); }
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
        if (AUTH_RESPONSES_WITH_USER.has(url.pathname)) {
          return augmentAuthResponse(response, env);
        }
        if (url.pathname === '/api/auth/security') {
          if (securityPatchSnapshot) {
            return syncCitizenPrivacyAfterSecurityPatch(securityPatchSnapshot, response, env, validatePortalSession);
          }
          return normalizeSecurityPrivacyResponse(response);
        }
        return response;
      } catch (error) {
        return jsonError(error?.message || 'Falha no serviço de autenticação.', 500, origin, originAllowed);
      }
    }

    if (url.pathname === '/api/ia' && request.method !== 'OPTIONS' && String(env.AUTH_ENFORCE_AI || '').toLowerCase() === 'true') {
      const user = await validatePortalSession(request, env, ['medico', 'coordenacao']);
      if (!user) return jsonError('Acesso médico ou de coordenação necessário para utilizar a pré-regulação.', 403, origin, originAllowed);
    }

    if (url.pathname === '/api/ia' && request.method === 'POST') {
      return fetchAiResilient(request, env, ctx, origin, originAllowed);
    }

    return aiWorker.fetch(request, env, ctx);
  }
};