'use strict';

import aiWorker from './gemini-assistant.js';
import { fetchAiResilient } from './ai-resilience.js';
import { handleObservabilityRoute, isObservabilityApi } from './observability.js';
import { handlePortalRoute, isPortalApi, validatePortalSession } from './auth-management-flex.js';
import { handleProfileRoute, isProfileApi } from './profile-photo.js';
import { handleChatRoute, isChatApi } from './portal-chat-v2.js';
export { PortalChatRealtime } from './chat-realtime-do.js';
import { handleSocialRoute, isSocialApi } from './social.js';
import { handleUsageRoute, isUsageApi } from './usage-monitor-v2.js';
import { handleCouncilRoute, isCouncilApi } from './council-access-policy.js';
import { handleSystemReadinessRoute, isSystemReadinessApi } from './system-readiness.js';
import { handlePushRoute, isPushApi } from './push-notifications.js';
import { handleTelemedicineRoute, isTelemedicineApi } from './telemedicine-router-v2.js';
import { handleAgendaRoute, isAgendaApi } from './agenda.js';
import { handleStudiesRoute, isStudiesApi } from './studies.js';
import { handleDocumentsRoute, isDocumentsApi, isDocumentsOAuthCallback } from './documents-router.js';
import { handleGmailJudicialBridge, isGmailJudicialBridgeApi } from './gmail-judicial-bridge.js';
import { enforceDeveloperSeparation } from './role-migration.js';
import {
  handleCitizenIdentityRoute,
  isCitizenIdentityApi,
  prepareCitizenHandleLogin
} from './citizen-identity.js';
import {
  augmentAuthResponse,
  enforceProfessionalEmailGate,
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

function isD1DailyReadLimitError(error) {
  const text = String(error?.message || error || '');
  return /exceeded D1(?:'s)? free tier daily row read limit|daily D1.*row read limit|\b7500\b/i.test(text);
}

function d1DailyReadLimitResponse(origin, allowed) {
  return jsonError(
    'O banco do Portal atingiu temporariamente o limite diário de leitura. As áreas dependentes serão retomadas após a renovação da cota.',
    503,
    origin,
    allowed,
    'D1_DAILY_READ_LIMIT_EXCEEDED'
  );
}

const AUTH_RESPONSES_WITH_USER = new Set([
  '/api/auth/login',
  '/api/auth/me',
  '/api/auth/register',
  '/api/auth/change-password'
]);


export default {
  async fetch(request, env, ctx) {
    let url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const originAllowed = !origin || allowedOrigins(env).includes(origin);

    if (isObservabilityApi(url.pathname)) {
      try { return await handleObservabilityRoute(request, env, ctx, origin, originAllowed); }
      catch (_) { return jsonError('Falha temporária na telemetria técnica.', 503, origin, originAllowed, 'OBSERVABILITY_TEMPORARILY_UNAVAILABLE'); }
    }

    // V34.7: preflight do painel de usuários deve responder sem tocar D1,
    // Firebase ou migrações. O navegador depende deste OPTIONS para liberar
    // o GET autenticado; atrasá-lo pode aparecer apenas como "Failed to fetch".
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/admin/users')) {
      return handlePortalRoute(request, env, origin, originAllowed);
    }

    // Fase 7: o preflight documental também precisa ser resolvido antes de
    // migrações, D1 ou qualquer guard global. Se um desses passos oscilar,
    // o navegador mascara a chamada real como erro CORS/Failed to fetch.
    if (request.method === 'OPTIONS' && isDocumentsApi(url.pathname)) {
      return handleDocumentsRoute(request, env, origin, originAllowed);
    }

    // Chat tem validação própria de sessão, e-mail e autorização de contato.
    // Mantemos o caminho fora das migrações/guards globais para que o ACK
    // da mensagem não espere verificações alheias ao envio.
    if (isChatApi(url.pathname)) {
      try { return await handleChatRoute(request, env, origin, originAllowed, ctx); }
      catch (error) {
        if (isD1DailyReadLimitError(error)) return d1DailyReadLimitResponse(origin, originAllowed);
        return jsonError(error?.message || 'Falha no chat interno.', 500, origin, originAllowed);
      }
    }

    await enforceDeveloperSeparation(env);

    if (isGmailJudicialBridgeApi(url.pathname)) {
      try { return await handleGmailJudicialBridge(request, env, ctx); }
      catch (error) {
        console.error(JSON.stringify({ event: 'gmail_judicial_bridge_failed', kind: error?.name || 'Error' }));
        return jsonError('Falha temporária na ponte judicial do Gmail.', 500, origin, originAllowed, 'GMAIL_JUDICIAL_BRIDGE_FAILED');
      }
    }

    if (isDocumentsOAuthCallback(url.pathname)) {
      try { return await handleDocumentsRoute(request, env, origin, originAllowed); }
      catch (_) { return jsonError('Falha temporária na conexão com o Google Drive.', 503, origin, originAllowed, 'DOCUMENTS_OAUTH_TEMPORARILY_UNAVAILABLE'); }
    }

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

    const emailRemovalBlock = await guardSecurityEmailRemoval(request, env, validatePortalSession, origin, originAllowed);
    if (emailRemovalBlock) return emailRemovalBlock;

    const emailGate = await enforceProfessionalEmailGate(request, env, validatePortalSession, origin, originAllowed);
    if (emailGate) return emailGate;

    if (isDocumentsApi(url.pathname)) {
      try { return await handleDocumentsRoute(request, env, origin, originAllowed); }
      catch (_) { return jsonError('Falha temporária na Central de Documentos.', 503, origin, originAllowed, 'DOCUMENTS_TEMPORARILY_UNAVAILABLE'); }
    }

    if (isPushApi(url.pathname)) {
      try { return await handlePushRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no serviço de notificações.', 500, origin, originAllowed); }
    }
    if (isSystemReadinessApi(url.pathname)) {
      try { return await handleSystemReadinessRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no diagnóstico técnico.', 500, origin, originAllowed); }
    }
    if (isAgendaApi(url.pathname)) {
      try { return await handleAgendaRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha na Agenda.', Number(error?.status || 500), origin, originAllowed); }
    }
    if (isStudiesApi(url.pathname)) {
      try { return await handleStudiesRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha temporária na Missão Bancária.', Number(error?.status || 500), origin, originAllowed, 'STUDIES_TEMPORARILY_UNAVAILABLE'); }
    }
    if (isTelemedicineApi(url.pathname)) {
      try { return await handleTelemedicineRoute(request, env, origin, originAllowed); }
      catch (error) { return jsonError(error?.message || 'Falha no módulo de Telemedicina.', 500, origin, originAllowed); }
    }
    if (isCouncilApi(url.pathname)) {
      try { return await handleCouncilRoute(request, env, origin, originAllowed, ctx); }
      catch (error) { return jsonError(error?.message || 'Falha no módulo do Conselho.', 500, origin, originAllowed); }
    }
    if (isSocialApi(url.pathname)) {
      try { return await handleSocialRoute(request, env, origin, originAllowed, ctx); }
      catch (error) {
        console.error(JSON.stringify({ event: 'social_route_failed', path: url.pathname, kind: error?.name || 'Error' }));
        if (isD1DailyReadLimitError(error)) return d1DailyReadLimitResponse(origin, originAllowed);
        return jsonError('Falha temporária na Camada Social. As Ferramentas continuam disponíveis.', 500, origin, originAllowed, 'SOCIAL_TEMPORARILY_UNAVAILABLE');
      }
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
