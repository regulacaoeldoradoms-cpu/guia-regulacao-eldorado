import assert from 'node:assert/strict';
import test from 'node:test';
import aiWorker from '../gemini-assistant.js';
import portalWorker from '../index.js';

const origin = 'https://regulacaoeldoradoms.com.br';

function aiRequest() {
  return new Request('https://worker.example/api/ia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({
      originalQuestion: 'Quais informações clínicas são obrigatórias?',
      assistantMode: 'pre_regulation_simulator',
      catalog: [{ nome: 'Neurologia', faixaEtaria: 'Todas as idades', viaAcesso: 'SISREG/CORE' }]
    })
  });
}

function workerEnv(overrides = {}) {
  return {
    ALLOWED_ORIGINS: origin,
    AUTH_ENFORCE_AI: 'false',
    GEMINI_API_KEY: 'test-only-key',
    GEMINI_MODEL: 'test-model',
    GEMINI_REQUEST_TIMEOUT_MS: '25',
    ...overrides
  };
}

test('interrompe uma chamada Gemini pendente e retorna um erro estruturado', async () => {
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  const keepEventLoopAlive = setTimeout(() => {}, 1500);
  globalThis.fetch = (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  });
  console.error = () => {};

  try {
    const response = await aiWorker.fetch(aiRequest(), workerEnv());
    const payload = await response.json();
    assert.equal(response.status, 504);
    assert.equal(payload.code, 'GEMINI_UPSTREAM_TIMEOUT');
    assert.match(payload.error, /limite de segurança/);
  } finally {
    clearTimeout(keepEventLoopAlive);
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
  }
});

test('mantém a resposta normal quando o Gemini responde dentro do prazo', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({
    candidates: [{ content: { parts: [{ text: 'Resposta fundamentada no protocolo.' }] } }]
  });

  try {
    const response = await aiWorker.fetch(aiRequest(), workerEnv({ GEMINI_REQUEST_TIMEOUT_MS: '500' }));
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.answer, 'Resposta fundamentada no protocolo.');
    assert.equal(payload.model, 'test-model');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('limita a contingência a duas tentativas no modelo principal e uma no alternativo', async () => {
  const originalFetch = globalThis.fetch;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  const upstreamUrls = [];
  globalThis.fetch = async (url) => {
    upstreamUrls.push(String(url));
    return Response.json({ error: { message: 'temporarily unavailable' } }, { status: 503 });
  };
  console.warn = () => {};
  console.error = () => {};

  try {
    const response = await portalWorker.fetch(aiRequest(), workerEnv({
      GEMINI_MODEL: 'primary-model',
      GEMINI_FALLBACK_MODELS: 'fallback-model',
      GEMINI_REQUEST_TIMEOUT_MS: '1000',
      GEMINI_TOTAL_TIMEOUT_MS: '5000'
    }), {});
    const payload = await response.json();
    assert.equal(response.status, 503);
    assert.equal(payload.code, 'GEMINI_TEMPORARILY_UNAVAILABLE');
    assert.equal(upstreamUrls.length, 3);
    assert.equal(upstreamUrls.filter((url) => url.includes('/primary-model:')).length, 2);
    assert.equal(upstreamUrls.filter((url) => url.includes('/fallback-model:')).length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  }
});
