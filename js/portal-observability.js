'use strict';

(() => {
  if (window.PortalObservability) return;

  const FALLBACK_WORKER_ORIGIN = 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';
  const FLUSH_DELAY_MS = 1200;
  const MAX_BATCH_SIZE = 20;

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
      'merge_pdf', 'insert_image', 'save_copy', 'replace_pdf', 'extract', 'document_chat', 'request', 'unknown'
    ])
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

  const queue = [];
  const sentVitals = new Set();
  const interactionDurations = new Map();
  let flushTimer = null;
  let largestContentfulPaint = 0;
  let cumulativeLayoutShift = 0;
  let started = false;

  function ephemeralPageId() {
    try {
      if (crypto.randomUUID) return crypto.randomUUID();
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
    } catch (_) {
      return 'page-' + Math.round(performance.now()).toString(16) + '-' + Math.random().toString(16).slice(2);
    }
  }

  const pageId = ephemeralPageId();

  function safeRoute() {
    try {
      let path = location.pathname || '/';
      if (path === '/protocolo.html') path = '/protocolo/';
      if (path.endsWith('/index.html')) path = path.slice(0, -10) || '/';
      if (!path.endsWith('/') && path !== '/') path += '/';
      return SAFE_ROUTES.has(path) ? path : 'unknown';
    } catch (_) {
      return 'unknown';
    }
  }

  function workerEndpoint() {
    const configured = String(window.REGULATION_AUTH_CONFIG?.endpoint || '').replace(/\/$/, '');
    return (configured || FALLBACK_WORKER_ORIGIN) + '/api/observability';
  }

  function connectionType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const value = String(connection?.effectiveType || 'unknown');
    return ENUMS.connection.has(value) ? value : 'unknown';
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

  function sanitizeEvent(event, properties = {}) {
    const allowedKeys = EVENT_PROPERTIES[event];
    if (!allowedKeys || !properties || Array.isArray(properties) || typeof properties !== 'object') return null;

    const keys = Object.keys(properties);
    if (keys.some((key) => !allowedKeys.has(key))) return null;

    const clean = {};
    for (const key of keys) {
      const value = sanitizeValue(key, properties[key]);
      if (value === null) return null;
      clean[key] = value;
    }

    if (allowedKeys.has('route') && !Object.prototype.hasOwnProperty.call(clean, 'route')) {
      clean.route = safeRoute();
    }

    const required = REQUIRED[event];
    if (required && Array.from(required).some((key) => !Object.prototype.hasOwnProperty.call(clean, key))) return null;

    return { event, page_id: pageId, properties: clean };
  }

  function scheduleFlush() {
    if (flushTimer || !queue.length) return;
    flushTimer = window.setTimeout(() => {
      flushTimer = null;
      flush(false);
    }, FLUSH_DELAY_MS);
  }

  function flush(preferBeacon = false) {
    if (!queue.length) return;
    const events = queue.splice(0, MAX_BATCH_SIZE);
    const body = JSON.stringify({ events });
    const endpoint = workerEndpoint();

    if (preferBeacon && typeof navigator.sendBeacon === 'function') {
      try {
        const payload = new Blob([body], { type: 'text/plain;charset=UTF-8' });
        if (navigator.sendBeacon(endpoint, payload)) {
          if (queue.length) scheduleFlush();
          return;
        }
      } catch (_) {}
    }

    fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body
    }).catch(() => {});

    if (queue.length) scheduleFlush();
  }

  function capture(event, properties = {}) {
    const sanitized = sanitizeEvent(event, properties);
    if (!sanitized) return false;
    queue.push(sanitized);
    if (queue.length >= MAX_BATCH_SIZE) flush(false);
    else scheduleFlush();
    return true;
  }

  function emitVital(metric, value) {
    if (sentVitals.has(metric)) return;
    const clean = finiteNumber(value, 1000000);
    if (clean === null) return;
    sentVitals.add(metric);
    capture('portal_web_vital', { route: safeRoute(), metric, value: clean });
  }

  function percentile98(values) {
    if (!values.length) return 0;
    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.max(0, Math.ceil(sorted.length * 0.98) - 1);
    return sorted[index] || 0;
  }

  function finalizeVitals() {
    if (largestContentfulPaint > 0) emitVital('LCP', largestContentfulPaint);
    emitVital('CLS', cumulativeLayoutShift);
    const inp = percentile98(Array.from(interactionDurations.values()));
    if (inp > 0) emitVital('INP', inp);
  }

  function observeVitals() {
    try {
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp) emitVital('FCP', fcp.startTime);
      else {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              emitVital('FCP', entry.startTime);
              paintObserver.disconnect();
              break;
            }
          }
        });
        paintObserver.observe({ type: 'paint', buffered: true });
      }
    } catch (_) {}

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) largestContentfulPaint = Math.max(largestContentfulPaint, entry.startTime || 0);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (_) {}

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) cumulativeLayoutShift += Number(entry.value || 0);
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (_) {}

    try {
      const eventObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = Number(entry.duration || 0);
          if (!(duration > 0)) continue;
          const interactionId = Number(entry.interactionId || 0);
          const key = interactionId > 0 ? String(interactionId) : entry.name + ':' + Math.round(entry.startTime || 0);
          interactionDurations.set(key, Math.max(interactionDurations.get(key) || 0, duration));
        }
      });
      eventObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
    } catch (_) {}
  }

  function emitPageReady() {
    if (started) return;
    started = true;
    let navigationType = 'unknown';
    try {
      const navigation = performance.getEntriesByType('navigation')[0];
      const candidate = String(navigation?.type || 'unknown');
      if (ENUMS.navigation_type.has(candidate)) navigationType = candidate;
    } catch (_) {}
    capture('portal_page_ready', {
      route: safeRoute(),
      duration_ms: finiteNumber(performance.now()) || 0,
      navigation_type: navigationType,
      connection: connectionType()
    });
  }

  window.PortalObservability = Object.freeze({
    capture,
    flush() { flush(false); },
    route: safeRoute,
    __test: Object.freeze({ sanitizeEvent, safeRoute })
  });

  observeVitals();

  if (document.readyState === 'complete') emitPageReady();
  else window.addEventListener('load', emitPageReady, { once: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return;
    finalizeVitals();
    flush(true);
  });

  window.addEventListener('pagehide', () => {
    finalizeVitals();
    flush(true);
  }, { capture: true });
})();
