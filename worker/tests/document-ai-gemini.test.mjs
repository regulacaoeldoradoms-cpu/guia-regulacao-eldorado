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
    TITON_GEMINI_ENABLED: 'true',
    TITON_GEMINI_COMPARISON_ENABLED: 'false',
    TITON_GEMINI_MODEL: 'gemini-3.5-flash-lite',
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
      especialidade: field('CARDIOLOGIA', 'encontrado'),
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

test('schema Gemini usa subset suportado e mantém três formatos de fields estritos', () => {
  const schema = titonGeminiResponseJsonSchema();
  assert.equal(schema.type, 'object');
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['pageType', 'fields']);
  assert.deepEqual(schema.properties.pageType.enum, [
    'comprovante_atendimento',
    'pagina_medica_autorizada',
    'outro'
  ]);
  assert.equal(Array.isArray(schema.properties.fields.anyOf), true);
  assert.equal(schema.properties.fields.anyOf.length, 3);
  assert.equal(
    schema.properties.fields.anyOf.every((variant) => variant.additionalProperties === false),
    true
  );
  assert.equal(Object.prototype.hasOwnProperty.call(schema, 'oneOf'), false);
  const medical = schema.properties.fields.anyOf.find((variant) => variant.properties?.especialidade);
  assert.ok(medical, 'schema médico deve conter especialidade');
  assert.ok(medical.required.includes('especialidade'));
});

test('Gemini canônico preserva proveniência da página', async () => {
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

  assert.match(request.url, /gemini-3\.5-flash-lite:generateContent$/);
  assert.equal(request.options.headers['x-goog-api-key'], 'secret-test-only');
  assert.equal(request.options.method, 'POST');

  const body = JSON.parse(request.options.body);
  assert.equal(body.generationConfig.thinkingConfig.thinkingLevel, 'MINIMAL');
  assert.equal(body.generationConfig.responseFormat.text.mimeType, 'APPLICATION_JSON');
  assert.ok(body.generationConfig.responseFormat.text.schema);
  assert.equal(body.generationConfig.temperature, undefined);
  assert.equal(body.generationConfig.topP, undefined);
  assert.equal(body.generationConfig.seed, undefined);
  assert.equal(body.contents[0].parts[0].inlineData.mimeType, 'image/png');
  const systemInstruction = body.systemInstruction.parts[0].text;
  assert.match(systemInstruction, /LAUDO PARA SOLICITAÇÃO\/AUTORIZAÇÃO DE PROCEDIMENTO AMBULATORIAL/);
  assert.match(systemInstruction, /LAUDO MÉDICO PARA PROCEDIMENTO DE ALTA COMPLEXIDADE/);
  assert.match(systemInstruction, /diagnóstico\/CID, resumo da anamnese, justificativa e blocos de autorização/i);
  assert.match(systemInstruction, /título\/cabeçalho PRINCIPAL/i);
  assert.match(systemInstruction, /DADOS.*seção interna.*NÃO transforma/is);
  assert.doesNotMatch(request.options.body, /fileName|driveId|username|patient_name/i);

  assert.equal(result.classification.pageNumber, 2);
  assert.equal(result.classification.pageType, 'pagina_medica_autorizada');
  assert.equal(result.extraction.fields.especialidade.value, 'CARDIOLOGIA');
  assert.equal(result.extraction.pageNumber, 2);
  assert.equal(result.extraction.fields.cid.value, 'R52');
  assert.equal(result.provider.kind, 'google-gemini-api');
  assert.equal(result.provider.model, 'gemini-3.5-flash-lite');
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
    /Gemini não está habilitado|credencial/i
  );

  await assert.rejects(
    () => analyzeDocumentAiPageWithGemini(env({ TITON_GEMINI_MODEL: 'gemini-preview-nao-aprovado' }), {
      pageNumber: 1,
      mimeType: 'image/png',
      bytes: new Uint8Array([1])
    }),
    /Gemini não está habilitado|modelo Gemini/i
  );
});

test('Gemini usa enums REST válidos no GenerateContent atual', async () => {
  let request = null;
  await analyzeDocumentAiPageWithGemini(env(), {
    pageNumber: 1,
    mimeType: 'image/png',
    bytes: new Uint8Array([1, 2, 3])
  }, {
    fetcher: async (_url, options) => {
      request = JSON.parse(options.body);
      return geminiResponse({ pageType: 'outro', fields: {} });
    }
  });
  assert.equal(request.generationConfig.thinkingConfig.thinkingLevel, 'MINIMAL');
  assert.equal(request.generationConfig.responseFormat.text.mimeType, 'APPLICATION_JSON');
});

test('Gemini informa indisponibilidade de modelo em vez de erro genérico', async () => {
  await assert.rejects(
    () => analyzeDocumentAiPageWithGemini(env(), {
      pageNumber: 1,
      mimeType: 'image/png',
      bytes: new Uint8Array([1, 2])
    }, {
      fetcher: async () => new Response(JSON.stringify({
        error: { status: 'NOT_FOUND', message: 'model not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }),
    (error) => error?.code === 'DOCUMENT_AI_GEMINI_MODEL_UNAVAILABLE'
      && /não está disponível para este projeto/i.test(error?.message || '')
  );
});

test('configuração Gemini usa modelo estável aprovado', () => {
  assert.equal(TITON_GEMINI_COMPARISON.defaultModel, 'gemini-3.5-flash-lite');
  assert.equal(TITON_GEMINI_COMPARISON.timeoutMs, 25_000);
});
