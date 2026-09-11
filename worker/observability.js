'use strict';

const OBSERVABILITY_PATH = '/api/observability';
const MAX_BODY_BYTES = 32768;
const MAX_BATCH_SIZE = 20;
const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com';
const ALLOWED_POSTHOG_HOSTS = new Set([
  'https://us.i.posthog.com',
  'https://eu.i.posthog.com'
]);

const SAFE_ROUTES = new Set([
  '/', '/home/', '/login/', '/cadastro/', '/ferramentas/', '/perfil/',
  '/amigos/', '/notificacoes/', '/seguranca/', '/configuracoes/', '/conquistas/',
  '/conta/', '/medico/', '/protocolo/', '/recepcao/', '/telemedicina/',
  '/cidadao/', '/conselho/', '/conselho/painel/', '/admin/usuarios/',
  '/admin/monitoramento/', '/admin/configuracao/', '/admin/social/',
  '/documentos/', 'unknown'
]);

const EVENT_PROPERTIES = Object.freeze({
  portal_page_ready: new Set(['route', 'duration_ms', 'navigation_type', 'connection']),
  portal_navigation_ready: new Set(['route', 'duration_ms', 'source']),
  portal_web_vital: new Set(['route', 'metric', 'value']),
  api_request_timing: new Set(['route', 'duration_ms', 'status_code', 'operation', 'source']),
  api_request_failed: new Set(['route', 'duration_ms', 'status_code', 'operation', 'source']),
  drive_folder_opened: new Set(['route', 'duration_ms', 'source', 'cache_state']),
  drive_search_completed: new Set(['route', 'duration_ms', 'source', 'result_count_bucket']),
  pdf_open_started: new Set(['route', 'source', 'size_bucket', 'cache_state']),
  pdf_first_page_visible: new Set(['route', 'duration_ms', 'source', 'size_bucket', 'cache_state']),
  pdf_ready: new Set(['route', 'duration_ms', 'source', 'size_bucket', 'cache_state']),
  pdf_edit_completed: new Set(['route', 'duration_ms', 'operation', 'size_bucket']),
  drive_sync_started: new Set(['route', 'operation', 'size_bucket']),
  drive_sync_completed: new Set(['route', 'duration_ms', 'operation', 'size_bucket']),
  drive_sync_failed: new Set(['route', 'duration_ms', 'operation', 'size_bucket', 'status_code']),
  document_ai_started: new Set(['route', 'operation', 'size_bucket', 'source']),
  document_ai_completed: new Set(['route', 'duration_ms', 'operation', 'size_bucket', 'source']),
  document_ai_failed: new Set(['route', 'duration_ms', 'operation', 'size_bucket', 'source', 'status_code'])
});

const REQUIRED = Object.freeze({
  portal_page_ready: new Set(['route', 'duration_ms']),
  portal_web_vital: new Set(['route', 'metric', 'value']),
  pdf_first_page_visible: new Set(['route', 'duration_ms']),
  drive_sync_completed: new Set(['route', 'duration_ms', 'operation']),
  drive_sync_failed: new Set(['route', 'operation']),
  document_ai_completed: new Set(['route', 'duration_ms', 'operation']),
  document_ai_failed: new Set(['route', 'operation'])
});

const ENUMS = Object.freeze({
  navigation_type: new Set(['navigate', 'reload', 'back_forward', 'prerender', 'unknown']),
  connection: new Set(['slow-2g', '2g', '3g', '4g', 'unknown']),
  metric: new Set(['FCP', 'LCP', 'CLS', 'INP']),
  source: new Set(['portal', 'drive', 'cache', 'network', 'local', 'worker', 'gemini', 'cloudflare', 'unknown']),
  cache_state: new Set(['hit', 'miss', 'stale', 'bypass', 'unknown']),
  size_bucket: new Set(['tiny', 'small', 'medium', 'large', 'very_large', 'unknown']),
  result_count_bucket: new Set(['0', '1-5', '6-20', '21-100', '100+', 'unknown']),
  operation: new Set([
    'open_folder', 'search', 'open_pdf', 'delete_page', 'reorder_page', 'rotate_page',
    'merge_pdf', 'save_copy', 'replace_pdf', 'extract', 'document_chat', 'request', 'unknown'
  ])
});

function responseHeaders(origin = '') {
  const headers = {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function jsonResponse(payload, status, origin = '') {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders(origin) });
}

function noContent(origin = '') {
  const headers = responseHeaders(origin);
  delete headers['Content-Type'];
  return new Response(null, { status: 204, headers });
}

function finiteNumber(value, maximum = 600000) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > maximum) return null;
  return Math.round(number * 100) / 100;
}

function sanitizeValue(key, value) {
  if (key === 'route') {
    const route = String(value || '');
    return SAFE_ROUTES.has(route) ? route : null;
  }
  if (key === 'duration_ms') return finiteNumber(value);
  if (key === 'value') return finiteNumber(value, 1000000);
  if (key === 'status_code') {
    const status = Number(value);
    return Number.isInteger(status) && status >= 100 && status <= 599 ? status : null;
  }
  const allowed = ENUMS[key];
  if (allowed) {
    const normalized = String(value || '');
    return allowed.has(normalized) ? normalized : null;
  }
  return null;
}

function validPageId(value) {
  const id = String(value || '');
  return /^[a-z0-9-]{16,80}$/i.test(id) && !/\s/.test(id);
}

export function sanitizeObservabilityEvent(value) {
  if (!value || Array.isArray(value) || typeof value !== 'object') return null;
  const topKeys = Object.keys(value);
  if (topKeys.some((key) => !['event', 'page_id', 'properties'].includes(key))) return null;

  const event = String(value.event || '');
  const allowedKeys = EVENT_PROPERTIES[event];
  if (!allowedKeys || !validPageId(value.page_id)) return null;

  const properties = value.properties;
  if (!properties || Array.isArray(properties) || typeof properties !== 'object') return null;
  const keys = Object.keys(properties);
  if (keys.length > 10 || keys.some((key) => !allowedKeys.has(key))) return null;

  const clean = {};
  for (const key of keys) {
    const sanitized = sanitizeValue(key, properties[key]);
    if (sanitized === null) return null;
    clean[key] = sanitized;
  }

  const required = REQUIRED[event];
  if (required && Array.from(required).some((key) => !Object.prototype.hasOwnProperty.call(clean, key))) return null;

  return Object.freeze({
    event,
    page_id: String(value.page_id),
    properties: Object.freeze(clean)
  });
}

function posthogHost(env) {
  const configured = String(env.POSTHOG_HOST || DEFAULT_POSTHOG_HOST).replace(/\/+$/, '');
  return ALLOWED_POSTHOG_HOSTS.has(configured) ? configured : DEFAULT_POSTHOG_HOST;
}

async function deliverEvent(event, env) {
  const token = String(env.POSTHOG_PROJECT_TOKEN || '').trim();
  if (!token) return;

  const properties = {
    distinct_id: 'page:' + event.page_id,
    '$process_person_profile': false,
    '$geoip_disable': true,
    portal_observability_version: '1',
    ...event.properties
  };

  const response = await fetch(posthogHost(env) + '/capture/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: token,
      event: event.event,
      properties
    })
  });

  if (!response.ok) throw new Error('PostHog ingestion failed with status ' + response.status);
}

async function deliverBatch(events, env) {
  const results = await Promise.allSettled(events.map((event) => deliverEvent(event, env)));
  if (results.some((result) => result.status === 'rejected')) {
    throw new Error('One or more observability events failed to ingest.');
  }
}

export function isObservabilityApi(pathname) {
  return pathname === OBSERVABILITY_PATH;
}

export async function handleObservabilityRoute(request, env, ctx, origin, originAllowed) {
  if (!origin || !originAllowed) {
    return jsonResponse({ error: 'Origem não autorizada.' }, 403, originAllowed ? origin : '');
  }

  if (request.method === 'OPTIONS') return noContent(origin);
  if (request.method !== 'POST') return jsonResponse({ error: 'Método não permitido.' }, 405, origin);

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'Lote de telemetria excede o limite permitido.' }, 413, origin);
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'Lote de telemetria excede o limite permitido.' }, 413, origin);
  }

  let payload;
  try { payload = JSON.parse(text); }
  catch (_) { return jsonResponse({ error: 'Telemetria inválida.' }, 400, origin); }

  if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
    return jsonResponse({ error: 'Telemetria inválida.' }, 400, origin);
  }
  if (Object.keys(payload).some((key) => key !== 'events')) {
    return jsonResponse({ error: 'Campos não permitidos no lote.' }, 400, origin);
  }
  if (!Array.isArray(payload.events) || payload.events.length < 1 || payload.events.length > MAX_BATCH_SIZE) {
    return jsonResponse({ error: 'Quantidade de eventos inválida.' }, 400, origin);
  }

  const events = payload.events.map(sanitizeObservabilityEvent);
  if (events.some((event) => !event)) {
    return jsonResponse({ error: 'Evento ou propriedade não permitida.' }, 400, origin);
  }

  const delivery = deliverBatch(events, env).catch((error) => {
    console.error(JSON.stringify({
      event: 'posthog_delivery_failed',
      count: events.length,
      kind: error?.name || 'Error'
    }));
  });

  if (ctx?.waitUntil) ctx.waitUntil(delivery);
  else await delivery;

  return noContent(origin);
}
