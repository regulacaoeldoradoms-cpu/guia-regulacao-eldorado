import assert from 'node:assert/strict';
import test from 'node:test';

import {
  analyzeDocumentAiPageWithGemini,
  titonGeminiResponseJsonSchema,
  TITON_GEMINI_COMPARISON
} from '../document-ai-gemini.js';

function env(overrides = {}) {
  return {
    DOCUMENTS_AI_ENABLED: 'true',
    DOCUMENTS_AI_PROCESSING_ENABLED: 'true',
    DOCUMENTS_AI_FREE_ONLY: 'true',
    TITON_GEMINI_COMPARISON_ENABLED: 'true',
    TITON_GEMINI_MODEL: 'gemini-2.5-flash',
    TITON_GEMINI_API_KEY: 'secret-test-only',
    ...overrides
  };
}

function field(value = '', state = 'nao_consta') {
  return { state, value };
}

function medicalPayload() {
  return {
    pageType: 'pagina_medica_autorizada',
    fields: {
      titulo: field('ENCAMINHAMENTO', 'encontrado'),
      motivo_encaminhamento: field('DOR HÁ 3 DIAS', 'encontrado'),
      medico: field('DRA TESTE', 'encontrado'),
      crm_rms: field('CRM 1234', 'encontrado'),
      procedimento_solicitado: field('', 'nao_consta'),
      codigo_procedimento: field('', 'nao_consta'),
      cid: field('R52', 'encontrado'),
      descricao_cid: field('', 'nao_consta')
    }
  };
}

function geminiResponse(value, usage = {}) {
  return new Response(JSON.stringify({
    candidates: [{
      content: {
        role: 'model',
        parts: [{ text: JSON.stringify(value) }]
      }
    }],
    usageMetadata: {
      promptTokenCount: 700,
      candidatesTokenCount: 120,
      totalTokenCount: 820,
      ...usage
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

test('schema Gemini mantém três tipos de página e campos estritos', () => {
  const schema = titonGeminiResponseJsonSchema();
  assert.equal(Array.isArray(schema.oneOf), true);
  assert.equal(schema.oneOf.length, 3);
  for (const variant of schema.oneOf) {
    assert.equal(variant.additionalProperties, false);
    assert.deepEqual(variant.required, ['pageType', 'fields']);
    assert.equal(variant.properties.fields.additionalProperties, false);
  }
});

test('Gemini é provider comparativo separado e preserva proveniência da página', async () => {
  let request = null;
  const result = await analyzeDocumentAiPageWithGemini(env(), {
    pageNumber: 2,
    mimeType: 'image/png',
    bytes: new Uint8Array([1, 2, 3, 4])
  }, {
    fetcher: async (url, options) => {
      request = { url, options };
      return geminiResponse(medicalPayload());
    }
  });

  assert.match(request.url, /gemini-2\.5-flash:generateContent$/);
  assert.equal(request.options.headers['x-goog-api-key'], 'secret-test-only');
  assert.equal(request.options.method, 'POST');

  const body = JSON.parse(request.options.body);
  assert.equal(body.generationConfig.responseMimeType, 'application/json');
  assert.equal(body.generationConfig.thinkingConfig.thinkingBudget, 0);
  assert.ok(body.generationConfig.responseJsonSchema);
  assert.equal(body.contents[0].parts[0].inlineData.mimeType, 'image/png');
  assert.doesNotMatch(request.options.body, /fileName|driveId|username|patient_name/i);

  assert.equal(result.classification.pageNumber, 2);
  assert.equal(result.classification.pageType, 'pagina_medica_autorizada');
  assert.equal(result.extraction.pageNumber, 2);
  assert.equal(result.extraction.fields.cid.value, 'R52');
  assert.equal(result.provider.kind, 'google-gemini-api');
  assert.equal(result.provider.model, 'gemini-2.5-flash');
  assert.equal(result.provider.usage.totalTokens, 820);
  assert.equal(result.routine.id, 'PROMPT_ANALISE_REGULACAO_V1');
});

test('Gemini aceita página não autorizada somente sem campos', async () => {
  const result = await analyzeDocumentAiPageWithGemini(env(), {
    pageNumber: 1,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([9, 8, 7])
  }, {
    fetcher: async () => geminiResponse({ pageType: 'outro', fields: {} })
  });
  assert.equal(result.classification.pageType, 'outro');
  assert.equal(result.extraction, null);
});

test('Gemini falha fechado sem secret ou com modelo não aprovado', async () => {
  await assert.rejects(
    () => analyzeDocumentAiPageWithGemini(env({ TITON_GEMINI_API_KEY: '' }), {
      pageNumber: 1,
      mimeType: 'image/png',
      bytes: new Uint8Array([1])
    }),
    /comparação com Gemini não está habilitada|credencial/i
  );

  await assert.rejects(
    () => analyzeDocumentAiPageWithGemini(env({ TITON_GEMINI_MODEL: 'gemini-preview-nao-aprovado' }), {
      pageNumber: 1,
      mimeType: 'image/png',
      bytes: new Uint8Array([1])
    }),
    /comparação com Gemini não está habilitada|modelo Gemini/i
  );
});

test('configuração comparativa usa modelo estável aprovado', () => {
  assert.equal(TITON_GEMINI_COMPARISON.defaultModel, 'gemini-2.5-flash');
  assert.equal(TITON_GEMINI_COMPARISON.timeoutMs, 25_000);
});
