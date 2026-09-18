import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

import { createHomologation5eWorker } from '../homologation-5e.js';

const workerOrigin = 'https://central-docs-phase5e-yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';
const pagesOrigin = 'https://example.portal-regulacao-central-staging.pages.dev';

function env(overrides = {}) {
  return {
    DOCUMENTS_AI_HOMOLOGATION_WORKER_ORIGIN: workerOrigin,
    DOCUMENTS_AI_HOMOLOGATION_ORIGIN: pagesOrigin,
    DOCUMENTS_AI_HOMOLOGATION_RELEASE: 'a'.repeat(40),
    DOCUMENTS_AI_HOMOLOGATION_CONTROL_ID: 'phase5e_' + '1'.repeat(32),
    DOCUMENTS_AI_ENABLED: 'true',
    DOCUMENTS_AI_PROCESSING_ENABLED: 'true',
    DOCUMENTS_DRIVE_WRITE_ENABLED: 'false',
    ...overrides
  };
}

function control(overrides = {}) {
  return {
    id: 'phase5e_' + '1'.repeat(32),
    username: 'documentos.ia',
    expiresAt: Math.floor(Date.now() / 1000) + 1800,
    ...overrides
  };
}

function request(path, options = {}) {
  const headers = new Headers({
    Origin: options.origin || pagesOrigin,
    ...(options.token ? { Authorization: 'Bearer test-token' } : {}),
    ...(options.fixture ? { 'X-Document-Ai-Homologation': 'phase5e-synthetic-v1' } : {}),
    ...(options.headers || {})
  });
  return new Request(workerOrigin + path, {
    method: options.method || 'GET',
    headers,
    body: options.body
  });
}

function user(overrides = {}) {
  return {
    username: 'documentos.ia',
    role: 'admin',
    documentCapabilities: {
      view: true,
      extract: true,
      edit: true,
      manage: true
    },
    ...overrides
  };
}

function dependencies(overrides = {}) {
  return {
    authFetch: async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
    documentsFetch: async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
    validateSession: async () => user(),
    readControl: async () => control(),
    ...overrides
  };
}

test('5E bloqueia origem diferente e nunca alcança backend', async () => {
  let downstream = 0;
  const worker = createHomologation5eWorker(dependencies({
    documentsFetch: async () => {
      downstream += 1;
      return new Response('{}');
    }
  }));
  const response = await worker.fetch(
    request('/api/documents/ai/config', {
      origin: 'https://malicioso.example',
      token: true
    }),
    env()
  );
  assert.equal(response.status, 403);
  assert.equal(downstream, 0);
});

test('5E bloqueia controle ausente ou revogado', async () => {
  let downstream = 0;
  const worker = createHomologation5eWorker(dependencies({
    readControl: async () => null,
    documentsFetch: async () => {
      downstream += 1;
      return new Response('{}');
    }
  }));
  const response = await worker.fetch(
    request('/api/documents/ai/config', { token: true }),
    env()
  );
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, 'AI_HOMOLOGATION_DISABLED');
  assert.equal(downstream, 0);
});

test('login 5E só encaminha o usuário autorizado e não persiste credenciais', async () => {
  const bodies = [];
  const worker = createHomologation5eWorker(dependencies({
    authFetch: async (req) => {
      bodies.push(await req.json());
      return new Response(JSON.stringify({ token: 'session', user: user() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }));

  const denied = await worker.fetch(request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'outro.usuario', password: 'segredo' })
  }), env());
  assert.equal(denied.status, 403);
  assert.equal(bodies.length, 0);

  const allowed = await worker.fetch(request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'documentos.ia', password: 'segredo' })
  }), env());
  assert.equal(allowed.status, 200);
  assert.equal(bodies.length, 1);
  assert.deepEqual(bodies[0], { username: 'documentos.ia', password: 'segredo' });
});

test('rotas após login exigem sessão, mesmo usuário e capability extract', async () => {
  for (const invalidUser of [
    null,
    user({ username: 'outro.usuario' }),
    user({ documentCapabilities: { view: true, extract: false } })
  ]) {
    let downstream = 0;
    const worker = createHomologation5eWorker(dependencies({
      validateSession: async () => invalidUser,
      documentsFetch: async () => {
        downstream += 1;
        return new Response('{}');
      }
    }));
    const response = await worker.fetch(
      request('/api/documents/ai/config', { token: true }),
      env()
    );
    assert.equal(response.status, invalidUser ? 403 : 401);
    assert.equal(downstream, 0);
  }
});

test('rotas de IA exigem marcador sintético e gates corretos', async () => {
  let downstream = 0;
  const worker = createHomologation5eWorker(dependencies({
    documentsFetch: async () => {
      downstream += 1;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
  }));

  const noFixture = await worker.fetch(request('/api/documents/ai/chat', {
    method: 'POST',
    token: true,
    headers: { 'Content-Type': 'application/json' },
    body: '{}'
  }), env());
  assert.equal(noFixture.status, 403);

  const aiOff = await worker.fetch(request('/api/documents/ai/chat', {
    method: 'POST',
    token: true,
    fixture: true,
    headers: { 'Content-Type': 'application/json' },
    body: '{}'
  }), env({ DOCUMENTS_AI_PROCESSING_ENABLED: 'false' }));
  assert.equal(aiOff.status, 503);

  const driveOn = await worker.fetch(request('/api/documents/ai/chat', {
    method: 'POST',
    token: true,
    fixture: true,
    headers: { 'Content-Type': 'application/json' },
    body: '{}'
  }), env({ DOCUMENTS_DRIVE_WRITE_ENABLED: 'true' }));
  assert.equal(driveOn.status, 503);
  assert.equal(downstream, 0);
});

test('revogação entre autenticação e chamada de IA vence antes do provider', async () => {
  let reads = 0;
  let downstream = 0;
  const worker = createHomologation5eWorker(dependencies({
    readControl: async () => {
      reads += 1;
      return reads === 1 ? control() : null;
    },
    documentsFetch: async () => {
      downstream += 1;
      return new Response('{}');
    }
  }));

  const response = await worker.fetch(request('/api/documents/ai/page/classify', {
    method: 'POST',
    token: true,
    fixture: true,
    headers: {
      'Content-Type': 'image/png',
      'X-Document-Page-Number': '1'
    },
    body: new Uint8Array([1, 2, 3])
  }), env());

  assert.equal(response.status, 403);
  assert.equal(reads, 2);
  assert.equal(downstream, 0);
});

test('rotas Drive e demais APIs permanecem indisponíveis no wrapper 5E', async () => {
  const worker = createHomologation5eWorker(dependencies());
  for (const path of [
    '/api/documents/drive/list',
    '/api/documents/drive/content/opaque',
    '/api/documents/drive/sync/start',
    '/api/social/feed'
  ]) {
    const response = await worker.fetch(request(path, {
      method: path.includes('/list') || path.includes('/start') ? 'POST' : 'GET',
      token: true
    }), env());
    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, 'AI_HOMOLOGATION_ROUTE_DENIED');
  }
});

test('preflight CORS 5E permite apenas cabeçalhos técnicos necessários', async () => {
  const worker = createHomologation5eWorker(dependencies());
  const response = await worker.fetch(new Request(workerOrigin + '/api/documents/ai/chat', {
    method: 'OPTIONS',
    headers: {
      Origin: pagesOrigin,
      'Access-Control-Request-Method': 'POST'
    }
  }), env());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), pagesOrigin);
  assert.match(response.headers.get('Access-Control-Allow-Headers') || '', /X-Document-Ai-Homologation/);
  assert.equal(response.headers.get('Access-Control-Max-Age'), '0');
});

test('fonte do wrapper 5E não registra conteúdo ou segredos', async () => {
  const source = await fs.readFile(new URL('../homologation-5e.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /console\.(?:log|warn|error)/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(source, /GEMINI_API_KEY\s*=|AUTH_SESSION_SECRET\s*=/);
  assert.match(source, /DOCUMENTS_DRIVE_WRITE_ENABLED/);
  assert.match(source, /DOCUMENTS_AI_PROCESSING_ENABLED/);
});
