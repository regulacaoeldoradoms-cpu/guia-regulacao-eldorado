import assert from 'node:assert/strict';
import test from 'node:test';
import aiWorker from '../gemini-assistant.js';
import portalWorker from '../index.js';

const origin = 'https://regulacaoeldoradoms.com.br';

function aiRequest(question = 'Quais informações clínicas são obrigatórias?', additions = {}) {
  return new Request('https://worker.example/api/ia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({
      originalQuestion: question,
      assistantMode: 'pre_regulation_simulator',
      catalog: [{ nome: 'Neurologia', faixaEtaria: 'Todas as idades', viaAcesso: 'SISREG/CORE' }],
      ...additions
    })
  });
}

function workerEnv(overrides = {}) {
  return {
    ALLOWED_ORIGINS: origin,
    AUTH_ENFORCE_AI: 'false',
    GEMINI_API_KEY: 'test-only-key',
    GEMINI_MODEL: 'test-model',
    GEMINI_REQUEST_TIMEOUT_MS: '1000',
    GEMINI_TOTAL_TIMEOUT_MS: '2500',
    CLOUDFLARE_AI_FALLBACK_ENABLED: 'true',
    CLOUDFLARE_AI_MODEL: '@cf/meta/llama-3.1-8b-instruct-fast',
    CLOUDFLARE_AI_FALLBACK_MODELS: '@cf/zai-org/glm-4.7-flash',
    CLOUDFLARE_AI_TIMEOUT_MS: '2000',
    CLOUDFLARE_AI_TOTAL_TIMEOUT_MS: '4000',
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
    assert.equal(payload.provider, 'Gemini');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('envia a restrição de Psicologia para TEA como regra operacional pertinente', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    const requestBody = JSON.parse(options.body);
    const systemPrompt = requestBody.systemInstruction.parts[0].text;
    const userPrompt = requestBody.contents[0].parts[0].text;
    assert.match(systemPrompt, /REGRAS OPERACIONAIS PERTINENTES/);
    assert.match(systemPrompt, /não deve ser generalizada/);
    assert.match(userPrompt, /Psicologia/);
    assert.match(userPrompt, /não aceita pacientes com TEA\/autismo/);
    assert.match(userPrompt, /28\/08\/2026/);
    assert.match(userPrompt, /restrição é específica da Psicologia/);
    return Response.json({
      candidates: [{ content: { parts: [{ text: 'Psicologia no DigSaúde não aceita TEA.' }] } }]
    });
  };

  try {
    const response = await aiWorker.fetch(aiRequest('DigSaúde aceita autismo?', {
      operationalFacts: [{
        id: 'digsus-psicologia-tea',
        sistema: 'DigSaúde MS',
        especialidade: 'Psicologia',
        restricao: 'A teleconsulta de Psicologia do DigSaúde MS não aceita pacientes com TEA/autismo.',
        orientacao: 'Seguir o fluxo psicológico municipal/local aplicável.',
        ressalva: 'A restrição é específica da Psicologia.',
        fonte: 'Confirmação operacional do suporte DigSaúde MS',
        dataConferencia: '28/08/2026'
      }]
    }), workerEnv());
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.answer, 'Psicologia no DigSaúde não aceita TEA.');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('usa a Cloudflare como segundo provedor quando os dois modelos Gemini falham', async () => {
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
    let cloudflareCalls = 0;
    const response = await portalWorker.fetch(aiRequest(), workerEnv({
      GEMINI_MODEL: 'primary-model',
      GEMINI_FALLBACK_MODELS: 'fallback-model',
      GEMINI_REQUEST_TIMEOUT_MS: '1000',
      GEMINI_TOTAL_TIMEOUT_MS: '2500',
      AI: {
        async run(model, input, options) {
          cloudflareCalls += 1;
          assert.equal(model, '@cf/meta/llama-3.1-8b-instruct-fast');
          assert.equal(input.messages[0].role, 'system');
          assert.equal(input.messages[1].role, 'user');
          assert.equal(input.max_tokens, 1300);
          assert.ok(options.signal instanceof AbortSignal);
          return { response: 'Resposta da contingência independente.' };
        }
      }
    }), {});
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.answer, 'Resposta da contingência independente.');
    assert.equal(payload.provider, 'Cloudflare Workers AI');
    assert.equal(payload.model, '@cf/meta/llama-3.1-8b-instruct-fast');
    assert.equal(payload.groundedInProtocols, true);
    assert.equal(cloudflareCalls, 1);
    assert.equal(upstreamUrls.length, 2);
    assert.equal(upstreamUrls.filter((url) => url.includes('/primary-model:')).length, 1);
    assert.equal(upstreamUrls.filter((url) => url.includes('/fallback-model:')).length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  }
});

test('tenta um segundo modelo Cloudflare quando o modelo rápido falha', async () => {
  const originalFetch = globalThis.fetch;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  globalThis.fetch = async () => Response.json({ error: { message: 'temporarily unavailable' } }, { status: 503 });
  console.warn = () => {};
  console.error = () => {};
  const models = [];

  try {
    const response = await portalWorker.fetch(aiRequest(), workerEnv({
      GEMINI_FALLBACK_MODELS: '',
      AI: {
        async run(model, input) {
          models.push(model);
          if (model.includes('/llama-')) throw new Error('Modelo rápido indisponível');
          assert.equal(input.max_completion_tokens, 1800);
          assert.equal(input.reasoning_effort, 'low');
          return { choices: [{ message: { content: 'Resposta do segundo modelo Cloudflare.' } }] };
        }
      }
    }), {});
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.answer, 'Resposta do segundo modelo Cloudflare.');
    assert.equal(payload.model, '@cf/zai-org/glm-4.7-flash');
    assert.deepEqual(models, [
      '@cf/meta/llama-3.1-8b-instruct-fast',
      '@cf/zai-org/glm-4.7-flash'
    ]);
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  }
});

test('não consulta a contingência quando o Gemini responde', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({
    candidates: [{ content: { parts: [{ text: 'Resposta do provedor principal.' }] } }]
  });
  let cloudflareCalls = 0;

  try {
    const response = await portalWorker.fetch(aiRequest(), workerEnv({
      AI: { async run() { cloudflareCalls += 1; return {}; } }
    }), {});
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.provider, 'Gemini');
    assert.equal(cloudflareCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('retorna contingência local somente quando ambos os provedores falham', async () => {
  const originalFetch = globalThis.fetch;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  globalThis.fetch = async () => Response.json({ error: { message: 'temporarily unavailable' } }, { status: 503 });
  console.warn = () => {};
  console.error = () => {};

  try {
    let cloudflareCalls = 0;
    const response = await portalWorker.fetch(aiRequest(), workerEnv({
      GEMINI_MODEL: 'primary-model',
      GEMINI_FALLBACK_MODELS: 'fallback-model',
      AI: { async run() { cloudflareCalls += 1; throw new Error('Cloudflare indisponível'); } }
    }), {});
    const payload = await response.json();
    assert.equal(response.status, 503);
    assert.equal(payload.code, 'AI_PROVIDERS_TEMPORARILY_UNAVAILABLE');
    assert.match(payload.error, /protocolos locais continuam disponíveis/);
    assert.equal(cloudflareCalls, 2);
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  }
});

test('bloqueia dados identificáveis antes de consultar qualquer provedor', async () => {
  const originalFetch = globalThis.fetch;
  let geminiCalls = 0;
  let cloudflareCalls = 0;
  globalThis.fetch = async () => {
    geminiCalls += 1;
    return Response.json({});
  };

  try {
    const response = await portalWorker.fetch(
      aiRequest('Paciente: Maria da Silva, CPF 123.456.789-09.'),
      workerEnv({ AI: { async run() { cloudflareCalls += 1; return {}; } } }),
      {}
    );
    const payload = await response.json();
    assert.equal(response.status, 400);
    assert.match(payload.error, /dados pessoais identificáveis/);
    assert.equal(geminiCalls, 0);
    assert.equal(cloudflareCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
