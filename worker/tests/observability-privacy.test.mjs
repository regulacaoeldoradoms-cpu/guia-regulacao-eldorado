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
