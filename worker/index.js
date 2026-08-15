'use strict';

import aiWorker from './gemini-assistant.js';
import { handlePortalRoute, isPortalApi, validatePortalSession } from './auth-management-flex.js';
import { handleProfileRoute, isProfileApi } from './profile-photo.js';
import { handleChatRoute, isChatApi } from './portal-chat-v2.js';
import { handleUsageRoute, isUsageApi } from './usage-monitor-v2.js';
import { handleCouncilRoute, isCouncilApi } from './council.js';

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

function jsonError(message, status, origin, allowed) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify({ error: message }), { status, headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const originAllowed = !origin || allowedOrigins(env).includes(origin);

    if (isCouncilApi(url.pathname)) {
      try {
        return await handleCouncilRoute(request, env, origin, originAllowed);
      } catch (error) {
        return jsonError(error?.message || 'Falha no módulo do Conselho.', 500, origin, originAllowed);
      }
    }

    if (isChatApi(url.pathname)) {
      try {
        return await handleChatRoute(request, env, origin, originAllowed);
      } catch (error) {
        return jsonError(error?.message || 'Falha no chat interno.', 500, origin, originAllowed);
      }
    }

    if (isProfileApi(url.pathname)) {
      try {
        return await handleProfileRoute(request, env, origin, originAllowed);
      } catch (error) {
        return jsonError(error?.message || 'Falha ao atualizar o perfil.', 500, origin, originAllowed);
      }
    }

    if (isUsageApi(url.pathname)) {
      try {
        return await handleUsageRoute(request, env, origin, originAllowed);
      } catch (error) {
        return jsonError(error?.message || 'Falha no monitoramento de uso.', 500, origin, originAllowed);
      }
    }

    if (isPortalApi(url.pathname)) {
      try {
        return await handlePortalRoute(request, env, origin, originAllowed);
      } catch (error) {
        return jsonError(error?.message || 'Falha no serviço de autenticação.', 500, origin, originAllowed);
      }
    }

    if (
      url.pathname === '/api/ia'
      && request.method !== 'OPTIONS'
      && String(env.AUTH_ENFORCE_AI || '').toLowerCase() === 'true'
    ) {
      const user = await validatePortalSession(request, env, ['medico']);
      if (!user) return jsonError('Acesso profissional necessário para utilizar a pré-regulação.', 403, origin, originAllowed);
    }

    return aiWorker.fetch(request, env, ctx);
  }
};
