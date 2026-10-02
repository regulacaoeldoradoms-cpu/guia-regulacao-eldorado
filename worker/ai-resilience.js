'use strict';

import aiWorker from './gemini-assistant.js';

const TRANSIENT_AI_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const DEFAULT_GEMINI_REQUEST_TIMEOUT_MS = 5000;
const DEFAULT_GEMINI_TOTAL_TIMEOUT_MS = 11000;

function boundedInteger(value, fallback, minimum, maximum) {
  const number = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function jsonError(message, status, origin, allowed, code = '') {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify({ error: message, ...(code ? { code } : {}) }), { status, headers });
}

function logAiEvent(level, event, details = {}) {
  const entry = JSON.stringify({ event, ...details });
  if (level === 'error') console.error(entry);
  else console.warn(entry);
}

function geminiModels(env) {
  const primary = String(env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();
  const fallbacks = String(env.GEMINI_FALLBACK_MODELS || 'gemini-3.6-flash')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);
  return [...new Set([primary, ...fallbacks].filter(Boolean))];
}

function envForGeminiModel(env, model, requestTimeoutMs) {
  return new Proxy(env, {
    get(target, property) {
      if (property === 'GEMINI_MODEL') return model;
      if (property === 'GEMINI_REQUEST_TIMEOUT_MS') return String(requestTimeoutMs);
      return target[property];
    }
  });
}

function envForCloudflareAi(env) {
  return new Proxy(env, {
    get(target, property) {
      if (property === 'AI_PROVIDER') return 'cloudflare';
      return target[property];
    }
  });
}

export async function fetchAiResilient(request, env, ctx, origin, originAllowed) {
  const models = geminiModels(env);
  const requestTimeoutMs = boundedInteger(
    env.GEMINI_REQUEST_TIMEOUT_MS,
    DEFAULT_GEMINI_REQUEST_TIMEOUT_MS,
    1000,
    15000
  );
  const totalTimeoutMs = boundedInteger(
    env.GEMINI_TOTAL_TIMEOUT_MS,
    DEFAULT_GEMINI_TOTAL_TIMEOUT_MS,
    requestTimeoutMs,
    40000
  );
  const startedAt = Date.now();
  let lastResponse = null;
  const geminiConfigured = Boolean(String(env.GEMINI_API_KEY || '').trim());

  if (geminiConfigured) {
    for (const model of models) {
      const remainingMs = totalTimeoutMs - (Date.now() - startedAt);
      if (remainingMs < 1000) break;

      const modelEnv = envForGeminiModel(env, model, Math.min(requestTimeoutMs, remainingMs));
      const response = await aiWorker.fetch(request.clone(), modelEnv, ctx);
      if (!TRANSIENT_AI_STATUSES.has(response.status)) return response;

      lastResponse = response;
      logAiEvent('warn', 'gemini_model_failed', {
        model,
        status: response.status,
        elapsedMs: Date.now() - startedAt
      });
    }

    logAiEvent('warn', 'gemini_resilience_exhausted', {
      status: lastResponse?.status || 0,
      elapsedMs: Date.now() - startedAt,
      modelsAttempted: models.length
    });
  } else {
    logAiEvent('warn', 'gemini_not_configured_skipping_to_cloudflare', {
      elapsedMs: Date.now() - startedAt
    });
  }

  if (String(env.CLOUDFLARE_AI_FALLBACK_ENABLED || '').toLowerCase() === 'true') {
    logAiEvent('warn', 'cloudflare_ai_fallback_started', {
      elapsedMs: Date.now() - startedAt
    });
    const cloudflareResponse = await aiWorker.fetch(request.clone(), envForCloudflareAi(env), ctx);
    if (cloudflareResponse.ok) {
      logAiEvent('warn', 'cloudflare_ai_fallback_succeeded', {
        elapsedMs: Date.now() - startedAt
      });
      return cloudflareResponse;
    }
    lastResponse = cloudflareResponse;
    logAiEvent('error', 'cloudflare_ai_fallback_failed', {
      status: cloudflareResponse.status,
      elapsedMs: Date.now() - startedAt
    });
  }

  return jsonError(
    'Os provedores de IA estão temporariamente indisponíveis. Os protocolos locais continuam disponíveis.',
    503,
    origin,
    originAllowed,
    'AI_PROVIDERS_TEMPORARILY_UNAVAILABLE'
  );
}
