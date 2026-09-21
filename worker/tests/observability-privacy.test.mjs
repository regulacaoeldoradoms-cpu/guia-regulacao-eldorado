import assert from 'node:assert/strict';
import test from 'node:test';
import {
  handleObservabilityRoute,
  sanitizeObservabilityEvent
} from '../observability.js';

const origin = 'https://regulacaoeldoradoms.com.br';

function validEvent(overrides = {}) {
  return {
    event: 'portal_web_vital',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/telemedicina/',
      metric: 'LCP',
      value: 412.75
    },
    ...overrides
  };
}

function requestFor(events, requestOrigin = origin) {
  return new Request('https://worker.example/api/observability', {
    method: 'POST',
    headers: {
      Origin: requestOrigin,
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    body: JSON.stringify({ events })
  });
}

test('aceita somente eventos e propriedades da allowlist', () => {
  const clean = sanitizeObservabilityEvent(validEvent());
  assert.ok(clean);
  assert.equal(clean.event, 'portal_web_vital');
  assert.deepEqual(clean.properties, {
    route: '/telemedicina/',
    metric: 'LCP',
    value: 412.75
  });

  assert.equal(sanitizeObservabilityEvent(validEvent({
    properties: {
      route: '/telemedicina/',
      metric: 'LCP',
      value: 412.75,
      patient_name: 'conteudo proibido'
    }
  })), null);

  assert.equal(sanitizeObservabilityEvent(validEvent({
    properties: {
      route: '/perfil/usuario-identificavel/',
      metric: 'LCP',
      value: 412.75
    }
  })), null);
});

test('não aceita identidade persistente nem campos extras no envelope', () => {
  assert.equal(sanitizeObservabilityEvent({
    ...validEvent(),
    user_id: '123'
  }), null);

  assert.equal(sanitizeObservabilityEvent({
    event: 'portal_web_vital',
    page_id: 'curto',
    properties: { route: '/', metric: 'LCP', value: 100 }
  }), null);
});

test('encaminha ao PostHog somente o payload técnico sanitizado', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), body: JSON.parse(options.body) });
    return new Response(null, { status: 200 });
  };

  try {
    const pending = [];
    const response = await handleObservabilityRoute(
      requestFor([validEvent()]),
      {
        POSTHOG_PROJECT_TOKEN: 'test-write-only-token',
        POSTHOG_HOST: 'https://us.i.posthog.com'
      },
      { waitUntil(promise) { pending.push(promise); } },
      origin,
      true
    );
    await Promise.all(pending);

    assert.equal(response.status, 204);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://us.i.posthog.com/capture/');
    assert.equal(calls[0].body.api_key, 'test-write-only-token');
    assert.equal(calls[0].body.event, 'portal_web_vital');
    assert.equal(calls[0].body.properties.distinct_id, 'page:123e4567-e89b-12d3-a456-426614174000');
    assert.equal(calls[0].body.properties.$process_person_profile, false);
    assert.equal(calls[0].body.properties.$geoip_disable, true);
    assert.equal(calls[0].body.properties.route, '/telemedicina/');
    assert.equal(calls[0].body.properties.metric, 'LCP');
    assert.equal(calls[0].body.properties.value, 412.75);
    assert.equal(Object.prototype.hasOwnProperty.call(calls[0].body.properties, '$current_url'), false);
    assert.equal(Object.prototype.hasOwnProperty.call(calls[0].body.properties, 'username'), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('rejeita origem ausente ou não autorizada sem consultar o PostHog', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(null, { status: 200 });
  };

  try {
    const response = await handleObservabilityRoute(
      requestFor([validEvent()], 'https://example.com'),
      { POSTHOG_PROJECT_TOKEN: 'test-token' },
      {},
      'https://example.com',
      false
    );
    assert.equal(response.status, 403);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('sem token configurado a telemetria não vaza nem bloqueia o Portal', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(null, { status: 200 });
  };

  try {
    const response = await handleObservabilityRoute(
      requestFor([validEvent()]),
      {},
      {},
      origin,
      true
    );
    assert.equal(response.status, 204);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('aceita métrica de primeira página somente com propriedades técnicas', () => {
  const clean = sanitizeObservabilityEvent({
    event: 'pdf_first_page_visible',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 318.4,
      source: 'drive',
      size_bucket: 'medium',
      cache_state: 'bypass'
    }
  });

  assert.ok(clean);
  assert.equal(clean.event, 'pdf_first_page_visible');
  assert.deepEqual(clean.properties, {
    route: '/documentos/',
    duration_ms: 318.4,
    source: 'drive',
    size_bucket: 'medium',
    cache_state: 'bypass'
  });

  assert.equal(sanitizeObservabilityEvent({
    event: 'pdf_first_page_visible',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 318.4,
      source: 'drive',
      size_bucket: 'medium',
      cache_state: 'bypass',
      file_name: 'proibido.pdf'
    }
  }), null);
});


test('aceita edição PDF somente com operação técnica allowlisted', () => {
  const clean = sanitizeObservabilityEvent({
    event: 'pdf_edit_completed',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 42,
      operation: 'delete_page',
      size_bucket: 'small'
    }
  });

  assert.ok(clean);
  assert.deepEqual(clean.properties, {
    route: '/documentos/',
    duration_ms: 42,
    operation: 'delete_page',
    size_bucket: 'small'
  });

  assert.equal(sanitizeObservabilityEvent({
    event: 'pdf_edit_completed',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 42,
      operation: 'merge_pdf',
      size_bucket: 'medium',
      page_number: 2
    }
  }), null);
});

test('Fase 6 aceita somente telemetria técnica de background', () => {
  const clean = sanitizeObservabilityEvent({
    event: 'document_background_task',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 85,
      operation: 'prepare_page',
      source: 'local',
      cache_state: 'unknown',
      background_state: 'prepared',
      cancel_reason: 'none',
      result_count_bucket: '1-5'
    }
  });

  assert.ok(clean);
  assert.equal(clean.event, 'document_background_task');
  assert.deepEqual(clean.properties, {
    route: '/documentos/',
    duration_ms: 85,
    operation: 'prepare_page',
    source: 'local',
    cache_state: 'unknown',
    background_state: 'prepared',
    cancel_reason: 'none',
    result_count_bucket: '1-5'
  });

  assert.equal(sanitizeObservabilityEvent({
    event: 'document_background_task',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 85,
      operation: 'preextract_page',
      source: 'cloudflare',
      cache_state: 'hit',
      background_state: 'used',
      cancel_reason: 'none',
      result_count_bucket: '1-5',
      file_name: 'proibido.pdf'
    }
  }), null);
});

test('Fase 7E aceita decomposição técnica do Drive sem consulta, nome ou identificador', () => {
  const search = sanitizeObservabilityEvent({
    event: 'drive_search_completed',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 4100,
      source: 'drive',
      result_count_bucket: '1-5',
      drive_token_ms: 120,
      drive_api_ms: 3300,
      drive_map_ms: 540,
      viewport_class: 'desktop'
    }
  });
  assert.ok(search);
  assert.equal(search.properties.drive_api_ms, 3300);

  const sync = sanitizeObservabilityEvent({
    event: 'drive_sync_completed',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 11323,
      operation: 'replace_pdf',
      size_bucket: 'small',
      build_ms: 480,
      drive_start_ms: 3500,
      drive_upload_ms: 7200,
      viewport_class: 'desktop'
    }
  });
  assert.ok(sync);
  assert.equal(sync.properties.drive_upload_ms, 7200);

  assert.equal(sanitizeObservabilityEvent({
    event: 'drive_search_completed',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 4100,
      source: 'drive',
      result_count_bucket: '1-5',
      drive_api_ms: 3300,
      search_query: 'nome sensivel'
    }
  }), null);

  assert.equal(sanitizeObservabilityEvent({
    event: 'drive_sync_completed',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 11323,
      operation: 'replace_pdf',
      size_bucket: 'small',
      build_ms: 700000
    }
  }), null);
});

test('Fase 7A aceita viewport coarse sem identificador de dispositivo', () => {
  const clean = sanitizeObservabilityEvent({
    event: 'pdf_ready',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 520,
      source: 'cache',
      size_bucket: 'small',
      cache_state: 'hit',
      viewport_class: 'desktop'
    }
  });

  assert.ok(clean);
  assert.equal(clean.properties.viewport_class, 'desktop');
  assert.equal(sanitizeObservabilityEvent({
    event: 'pdf_ready',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 520,
      source: 'cache',
      size_bucket: 'small',
      cache_state: 'hit',
      viewport_class: 'desktop-1920x1080'
    }
  }), null);
});

test('Fase 7A aceita apenas categorias técnicas de falha e modo textual', () => {
  const failedSync = sanitizeObservabilityEvent({
    event: 'drive_sync_failed',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 3000,
      operation: 'replace_pdf',
      size_bucket: 'small',
      status_code: 409,
      failure_kind: 'conflict',
      viewport_class: 'desktop'
    }
  });
  assert.ok(failedSync);
  assert.equal(failedSync.properties.failure_kind, 'conflict');

  const textReady = sanitizeObservabilityEvent({
    event: 'document_text_layer_ready',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 840,
      text_mode: 'ocr',
      source: 'local',
      viewport_class: 'mobile'
    }
  });
  assert.ok(textReady);
  assert.equal(textReady.properties.text_mode, 'ocr');

  const textFailed = sanitizeObservabilityEvent({
    event: 'document_text_layer_failed',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 420,
      text_mode: 'none',
      source: 'local',
      failure_kind: 'no_text',
      viewport_class: 'desktop'
    }
  });
  assert.ok(textFailed);

  assert.equal(sanitizeObservabilityEvent({
    event: 'document_text_layer_ready',
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    properties: {
      route: '/documentos/',
      duration_ms: 840,
      text_mode: 'ocr',
      source: 'local',
      extracted_text: 'conteudo proibido'
    }
  }), null);
});

