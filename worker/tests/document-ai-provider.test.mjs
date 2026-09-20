import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

import { DOCUMENT_AI_EXTRACTION_FIELDS } from '../document-ai.js';
import {
  DOCUMENT_AI_FALLBACK_FREE_MODEL,
  DOCUMENT_AI_FAST_VISION_FREE_MODEL,
  DOCUMENT_AI_FREE_MODELS,
  DOCUMENT_AI_PRIMARY_FREE_MODEL,
  MAX_DOCUMENT_AI_IMAGE_BYTES,
  analyzeDocumentAiPage,
  chatDocumentAi,
  classifyAndExtractDocumentAiPage,
  classifyDocumentAiPage,
  documentAiFreeModelSequence,
  documentAiVisionModelSequence,
  extractDocumentAiPage
} from '../document-ai-provider.js';

function enabledEnv(overrides = {}) {
  return {
    DOCUMENTS_AI_ENABLED: 'true',
    DOCUMENTS_AI_PROCESSING_ENABLED: 'true',
    DOCUMENTS_AI_FREE_ONLY: 'true',
    DOCUMENTS_AI_PRIMARY_MODEL: DOCUMENT_AI_PRIMARY_FREE_MODEL,
    DOCUMENTS_AI_FALLBACK_MODELS: DOCUMENT_AI_FALLBACK_FREE_MODEL,
    AI: { run: async () => ({ response: '{}' }) },
    ...overrides
  };
}

function fieldsFor(pageType, overrides = {}) {
  const fields = Object.fromEntries(
    DOCUMENT_AI_EXTRACTION_FIELDS[pageType].map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ])
  );
  Object.assign(fields, overrides);
  return fields;
}

function workersResponse(value) {
  return { response: JSON.stringify(value) };
}

test('provider documental usa somente Gemma 4 + Qwen aprovados para free-only', () => {
  assert.deepEqual(DOCUMENT_AI_FREE_MODELS, [
    '@cf/google/gemma-4-26b-a4b-it',
    '@cf/qwen/qwen3.8-27b'
  ]);
  assert.deepEqual(documentAiFreeModelSequence(enabledEnv()), DOCUMENT_AI_FREE_MODELS);
  assert.throws(
    () => documentAiFreeModelSequence(enabledEnv({
      DOCUMENTS_AI_PRIMARY_MODEL: '@cf/deepseek-ai/deepseek-v4-pro-0813'
    })),
    (error) => error?.code === 'DOCUMENT_AI_NON_FREE_MODEL_BLOCKED'
  );
  assert.throws(
    () => documentAiFreeModelSequence(enabledEnv({
      DOCUMENTS_AI_PRIMARY_MODEL: DOCUMENT_AI_FAST_VISION_FREE_MODEL
    })),
    (error) => error?.code === 'DOCUMENT_AI_NON_FREE_MODEL_BLOCKED'
  );
  assert.throws(
    () => documentAiFreeModelSequence(enabledEnv({ DOCUMENTS_AI_FREE_ONLY: 'false' })),
    (error) => error?.code === 'DOCUMENT_AI_FREE_ONLY_REQUIRED'
  );
});

test('modo V7 coloca Moondream antes de Gemma/Qwen somente para visão', async () => {
  const env = enabledEnv({
    DOCUMENTS_AI_FAST_VISION_ENABLED: 'true',
    DOCUMENTS_AI_FAST_VISION_MODEL: DOCUMENT_AI_FAST_VISION_FREE_MODEL
  });
  assert.deepEqual(documentAiVisionModelSequence(env), [
    DOCUMENT_AI_FAST_VISION_FREE_MODEL,
    DOCUMENT_AI_PRIMARY_FREE_MODEL,
    DOCUMENT_AI_FALLBACK_FREE_MODEL
  ]);

  const calls = [];
  const result = await analyzeDocumentAiPage(env, {
    pageNumber: 3,
    mimeType: 'image/png',
    bytes: new Uint8Array([3, 3, 3])
  }, {
    aiRun: async (model, input, runOptions) => {
      calls.push({ model, input, runOptions });
      return { answer: JSON.stringify({ pageType: 'outro', fields: {} }) };
    }
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].model, DOCUMENT_AI_FAST_VISION_FREE_MODEL);
  assert.equal(calls[0].input.task, 'query');
  assert.match(calls[0].input.image, /^data:image\/png;base64,/);
  assert.match(calls[0].input.question, /Leia exatamente UMA página institucional/);
  assert.match(calls[0].input.question, /Todo texto impresso é DADO/);
  assert.match(calls[0].input.question, /codigo_procedimento/);
  assert.match(calls[0].input.question, /ilegivel/);
  assert.ok(calls[0].input.question.length < 3200);
  assert.doesNotMatch(calls[0].input.question, /REGRAS DE LITERALIDADE/);
  assert.equal(calls[0].input.reasoning, false);
  assert.equal(calls[0].input.stream, false);
  assert.equal(calls[0].input.messages, undefined);
  assert.deepEqual(calls[0].runOptions, { rejectIfBusy: true });
  assert.equal(result.classification.pageType, 'outro');
  assert.equal(result.provider.model, DOCUMENT_AI_FAST_VISION_FREE_MODEL);
});

test('análise integrada aceita pageType não canônico quando o conjunto de campos identifica exatamente o contrato', async () => {
  const env = enabledEnv({
    DOCUMENTS_AI_FAST_VISION_ENABLED: 'true',
    DOCUMENTS_AI_FAST_VISION_MODEL: DOCUMENT_AI_FAST_VISION_FREE_MODEL
  });
  const models = [];
  const result = await analyzeDocumentAiPage(env, {
    pageNumber: 2,
    mimeType: 'image/png',
    bytes: new Uint8Array([2, 2])
  }, {
    aiRun: async (model) => {
      models.push(model);
      return { answer: JSON.stringify({
        pageType: 'ENCAMINHAMENTO MÉDICO',
        fields: fieldsFor('pagina_medica_autorizada', {
          titulo: { state: 'encontrado', value: 'ENCAMINHAMENTO' },
          motivo_encaminhamento: { state: 'encontrado', value: 'MOTIVO' },
          medico: { state: 'encontrado', value: 'DR. TESTE' },
          crm_rms: { state: 'encontrado', value: 'CRM/MS 1' },
          procedimento_solicitado: { state: 'encontrado', value: 'PROC' },
          codigo_procedimento: { state: 'encontrado', value: '0001' },
          cid: { state: 'encontrado', value: 'A00' },
          descricao_cid: { state: 'encontrado', value: 'DESC' }
        })
      }) };
    }
  });

  assert.deepEqual(models, [DOCUMENT_AI_FAST_VISION_FREE_MODEL]);
  assert.equal(result.classification.pageType, 'pagina_medica_autorizada');
  assert.equal(result.provider.model, DOCUMENT_AI_FAST_VISION_FREE_MODEL);
});

test('análise integrada trata pageType não canônico com fields vazio como outro', async () => {
  const env = enabledEnv({
    DOCUMENTS_AI_FAST_VISION_ENABLED: 'true',
    DOCUMENTS_AI_FAST_VISION_MODEL: DOCUMENT_AI_FAST_VISION_FREE_MODEL
  });
  let calls = 0;
  const result = await analyzeDocumentAiPage(env, {
    pageNumber: 3,
    mimeType: 'image/png',
    bytes: new Uint8Array([3, 3])
  }, {
    aiRun: async (model) => {
      calls += 1;
      assert.equal(model, DOCUMENT_AI_FAST_VISION_FREE_MODEL);
      return { answer: JSON.stringify({
        pageType: 'AVISO ADMINISTRATIVO',
        fields: {}
      }) };
    }
  });

  assert.equal(calls, 1);
  assert.equal(result.classification.pageType, 'outro');
  assert.equal(result.extraction, null);
  assert.equal(result.provider.model, DOCUMENT_AI_FAST_VISION_FREE_MODEL);
});

test('Moondream com texto curto envolvendo JSON não cai para fallback', async () => {
  const env = enabledEnv({
    DOCUMENTS_AI_FAST_VISION_ENABLED: 'true',
    DOCUMENTS_AI_FAST_VISION_MODEL: DOCUMENT_AI_FAST_VISION_FREE_MODEL
  });
  const models = [];
  const result = await analyzeDocumentAiPage(env, {
    pageNumber: 3,
    mimeType: 'image/png',
    bytes: new Uint8Array([3, 3])
  }, {
    aiRun: async (model) => {
      models.push(model);
      return { answer: 'Resultado: {"pageType":"outro","fields":{}}.' };
    }
  });

  assert.deepEqual(models, [DOCUMENT_AI_FAST_VISION_FREE_MODEL]);
  assert.equal(result.classification.pageType, 'outro');
  assert.equal(result.provider.model, DOCUMENT_AI_FAST_VISION_FREE_MODEL);
});

test('Moondream que reconhece ilegível encerra no fast path sem revisão sequencial', async () => {
  const env = enabledEnv({
    DOCUMENTS_AI_FAST_VISION_ENABLED: 'true',
    DOCUMENTS_AI_FAST_VISION_MODEL: DOCUMENT_AI_FAST_VISION_FREE_MODEL
  });
  let calls = 0;
  const result = await analyzeDocumentAiPage(env, {
    pageNumber: 6,
    mimeType: 'image/png',
    bytes: new Uint8Array([6, 6])
  }, {
    aiRun: async (model) => {
      calls += 1;
      assert.equal(model, DOCUMENT_AI_FAST_VISION_FREE_MODEL);
      return { answer: JSON.stringify({
        pageType: 'pagina_medica_autorizada',
        fields: fieldsFor('pagina_medica_autorizada', {
          titulo: { state: 'encontrado', value: 'ENCAMINHAMENTO' },
          motivo_encaminhamento: { state: 'encontrado', value: 'MOTIVO' },
          medico: { state: 'encontrado', value: 'DR. TESTE' },
          crm_rms: { state: 'encontrado', value: 'CRM/MS 1' },
          procedimento_solicitado: { state: 'encontrado', value: 'PROC' },
          codigo_procedimento: { state: 'encontrado', value: '0001' },
          cid: { state: 'ilegivel', value: '' },
          descricao_cid: { state: 'encontrado', value: 'DESCRIÇÃO LITERAL' }
        })
      }) };
    }
  });

  assert.equal(calls, 1);
  assert.equal(result.provider.reviewed, false);
  assert.equal(result.extraction.fields.cid.state, 'ilegivel');
});

test('fast path de visão não substitui Gemma no chat textual', async () => {
  const env = enabledEnv({
    DOCUMENTS_AI_FAST_VISION_ENABLED: 'true',
    DOCUMENTS_AI_FAST_VISION_MODEL: DOCUMENT_AI_FAST_VISION_FREE_MODEL
  });
  const fields = fieldsFor('pagina_medica_autorizada', {
    procedimento_solicitado: { state: 'encontrado', value: 'PROC' }
  });
  let modelUsed = '';
  const result = await chatDocumentAi(env, {
    question: 'Qual procedimento consta?',
    evidence: [{ pageNumber: 2, pageType: 'pagina_medica_autorizada', fields }]
  }, {
    aiRun: async (model) => {
      modelUsed = model;
      return workersResponse({ answer: 'PROC [p. 2]', pages: [2] });
    }
  });
  assert.equal(modelUsed, DOCUMENT_AI_PRIMARY_FREE_MODEL);
  assert.equal(result.chat.answer, 'PROC [p. 2]');
});

test('gate false impede qualquer chamada ao Workers AI', async () => {
  let called = 0;
  await assert.rejects(
    () => classifyDocumentAiPage(enabledEnv({
      DOCUMENTS_AI_PROCESSING_ENABLED: 'false'
    }), {
      pageNumber: 1,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([1, 2, 3])
    }, {
      aiRun: async () => {
        called += 1;
        return workersResponse({ pageType: 'outro' });
      }
    }),
    (error) => error?.code === 'DOCUMENT_AI_PROCESSING_DISABLED'
  );
  assert.equal(called, 0);
});

test('binding Workers AI é obrigatório e GEMINI_API_KEY não é necessário', async () => {
  const env = enabledEnv({ AI: null, GEMINI_API_KEY: undefined });
  await assert.rejects(
    () => classifyDocumentAiPage(env, {
      pageNumber: 1,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([1])
    }),
    (error) => error?.code === 'DOCUMENT_AI_PROVIDER_NOT_CONFIGURED'
  );

  const result = await classifyDocumentAiPage(enabledEnv({ GEMINI_API_KEY: undefined }), {
    pageNumber: 1,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([1])
  }, {
    aiRun: async () => workersResponse({ pageType: 'outro' })
  });
  assert.equal(result.classification.pageNumber, 1);
  assert.equal(result.classification.pageType, 'outro');
});

test('classificação envia uma imagem data URI sem identidade do arquivo', async () => {
  const calls = [];
  const result = await classifyDocumentAiPage(enabledEnv(), {
    pageNumber: 7,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([1, 2, 3, 4])
  }, {
    aiRun: async (model, input, runOptions) => {
      calls.push({ model, input, runOptions });
      return workersResponse({ pageType: 'comprovante_atendimento' });
    }
  });

  assert.deepEqual(result.classification, {
    pageNumber: 7,
    pageType: 'comprovante_atendimento'
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].model, DOCUMENT_AI_PRIMARY_FREE_MODEL);
  assert.equal(calls[0].input.image, undefined);
  const userContent = calls[0].input.messages[1].content;
  assert.ok(Array.isArray(userContent));
  assert.equal(userContent[0].type, 'image_url');
  assert.match(userContent[0].image_url.url, /^data:image\/jpeg;base64,/);
  assert.equal(userContent[1].type, 'text');
  assert.match(userContent[1].text, /Classifique somente esta página/);
  assert.equal(calls[0].input.temperature, 0);
  assert.equal(calls[0].input.store, false);
  assert.equal(calls[0].input.reasoning_effort, null);
  assert.deepEqual(calls[0].input.chat_template_kwargs, {
    enable_thinking: false,
    clear_thinking: true
  });
  assert.equal('max_tokens' in calls[0].input, false);
  assert.equal(calls[0].input.max_completion_tokens, 120);
  assert.deepEqual(calls[0].input.response_format, { type: 'json_object' });
  assert.deepEqual(calls[0].runOptions, { rejectIfBusy: true });

  const serialized = JSON.stringify(calls[0].input);
  assert.doesNotMatch(serialized, /filename|fileId|drive[-_ ]?id|item\.ref|patient|cpf|cns/i);
});

test('análise integrada classifica e extrai página autorizada em uma única inferência', async () => {
  const calls = [];
  const result = await analyzeDocumentAiPage(enabledEnv(), {
    pageNumber: 2,
    mimeType: 'image/png',
    bytes: new Uint8Array([2, 2, 2])
  }, {
    aiRun: async (model, input) => {
      calls.push({ model, input });
      return workersResponse({
        pageType: 'pagina_medica_autorizada',
        fields: fieldsFor('pagina_medica_autorizada', {
          titulo: { state: 'encontrado', value: 'ENCAMINHAMENTO' },
          motivo_encaminhamento: { state: 'encontrado', value: 'TEXTO LITERAL' },
          medico: { state: 'encontrado', value: 'DR. TESTE' }
        })
      });
    }
  });

  assert.equal(calls.length, 1);
  assert.equal(result.classification.pageNumber, 2);
  assert.equal(result.classification.pageType, 'pagina_medica_autorizada');
  assert.equal(result.extraction.pageNumber, 2);
  assert.equal(result.extraction.fields.motivo_encaminhamento.value, 'TEXTO LITERAL');
  assert.equal(result.provider.model, DOCUMENT_AI_PRIMARY_FREE_MODEL);

  const serialized = JSON.stringify(calls[0].input);
  assert.match(serialized, /PROMPT|Analise somente esta página|pageType/i);
  const multimodal = calls[0].input.messages[1].content;
  assert.equal(multimodal[0].type, 'image_url');
  assert.match(multimodal[0].image_url.url, /^data:image\/png;base64,/);
  assert.equal(multimodal[1].type, 'text');
  assert.equal(calls[0].input.max_completion_tokens, 700);
});

test('pipeline público classifyAndExtract usa a análise integrada de uma chamada', async () => {
  let calls = 0;
  const result = await classifyAndExtractDocumentAiPage(enabledEnv(), {
    pageNumber: 9,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([9, 9])
  }, {
    aiRun: async () => {
      calls += 1;
      return workersResponse({
        pageType: 'comprovante_atendimento',
        fields: fieldsFor('comprovante_atendimento', {
          nome_paciente: { state: 'encontrado', value: 'PESSOA TESTE' }
        })
      });
    }
  });

  assert.equal(calls, 1);
  assert.equal(result.classification.pageType, 'comprovante_atendimento');
  assert.equal(result.extraction.fields.nome_paciente.value, 'PESSOA TESTE');
});

test('página outro retorna classificação sem extração e sem inventar campos', async () => {
  const result = await analyzeDocumentAiPage(enabledEnv(), {
    pageNumber: 3,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([3])
  }, {
    aiRun: async () => workersResponse({ pageType: 'outro', fields: {} })
  });

  assert.equal(result.classification.pageType, 'outro');
  assert.equal(result.extraction, null);

  await assert.rejects(
    () => analyzeDocumentAiPage(enabledEnv(), {
      pageNumber: 3,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([3])
    }, {
      aiRun: async () => workersResponse({
        pageType: 'outro',
        fields: { cpf: { state: 'encontrado', value: 'inventado' } }
      })
    }),
    (error) => ['DOCUMENT_AI_PROVIDER_SCHEMA_INVALID', 'DOCUMENT_AI_PROVIDER_UNAVAILABLE'].includes(error?.code)
  );
});

test('Qwen entra somente como fallback quando Gemma não produz resposta válida', async () => {
  const models = [];
  const result = await analyzeDocumentAiPage(enabledEnv(), {
    pageNumber: 4,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([4])
  }, {
    aiRun: async (model) => {
      models.push(model);
      if (model === DOCUMENT_AI_PRIMARY_FREE_MODEL) return { response: 'não é json' };
      return workersResponse({
        pageType: 'comprovante_atendimento',
        fields: fieldsFor('comprovante_atendimento')
      });
    }
  });

  assert.deepEqual(models, [
    DOCUMENT_AI_PRIMARY_FREE_MODEL,
    DOCUMENT_AI_FALLBACK_FREE_MODEL
  ]);
  assert.equal(result.provider.model, DOCUMENT_AI_FALLBACK_FREE_MODEL);
});

test('capacidade ocupada no Gemma cai imediatamente para Qwen sem fila paga', async () => {
  const models = [];
  const result = await analyzeDocumentAiPage(enabledEnv(), {
    pageNumber: 4,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([4])
  }, {
    aiRun: async (model) => {
      models.push(model);
      if (model === DOCUMENT_AI_PRIMARY_FREE_MODEL) {
        const error = new Error('Capacity temporarily exceeded, please try again.');
        error.code = 3040;
        error.status = 429;
        throw error;
      }
      return workersResponse({
        pageType: 'comprovante_atendimento',
        fields: fieldsFor('comprovante_atendimento')
      });
    }
  });

  assert.deepEqual(models, [
    DOCUMENT_AI_PRIMARY_FREE_MODEL,
    DOCUMENT_AI_FALLBACK_FREE_MODEL
  ]);
  assert.equal(result.provider.model, DOCUMENT_AI_FALLBACK_FREE_MODEL);
  assert.equal(result.provider.attempts[0].result, 'DOCUMENT_AI_PROVIDER_BUSY');
  assert.equal(result.provider.attempts[1].result, 'success');
});

test('timeout nativo do provider pode cair para o fallback gratuito', async () => {
  const models = [];
  const result = await analyzeDocumentAiPage(enabledEnv(), {
    pageNumber: 1,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([1])
  }, {
    aiRun: async (model) => {
      models.push(model);
      if (model === DOCUMENT_AI_PRIMARY_FREE_MODEL) {
        const error = new Error('3007 Request timeout');
        error.code = 3007;
        error.status = 408;
        throw error;
      }
      return workersResponse({
        pageType: 'comprovante_atendimento',
        fields: fieldsFor('comprovante_atendimento')
      });
    }
  });

  assert.deepEqual(models, DOCUMENT_AI_FREE_MODELS);
  assert.equal(result.provider.model, DOCUMENT_AI_FALLBACK_FREE_MODEL);
  assert.equal(result.provider.attempts[0].result, 'DOCUMENT_AI_PROVIDER_TIMEOUT');
});

test('limite gratuito diário interrompe sem tentar modelo pago ou fallback inútil', async () => {
  const models = [];
  await assert.rejects(
    () => analyzeDocumentAiPage(enabledEnv(), {
      pageNumber: 1,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([1])
    }, {
      aiRun: async (model) => {
        models.push(model);
        throw new Error('3036 Account limited: used up daily free allocation of 10,000 neurons');
      }
    }),
    (error) => error?.code === 'DOCUMENT_AI_FREE_LIMIT_REACHED' && error?.status === 429
  );
  assert.deepEqual(models, [DOCUMENT_AI_PRIMARY_FREE_MODEL]);
});

test('modelo que exigir plano pago é bloqueado fail-closed', async () => {
  await assert.rejects(
    () => analyzeDocumentAiPage(enabledEnv(), {
      pageNumber: 1,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([1])
    }, {
      aiRun: async () => {
        throw new Error('5035 This model requires a Workers Paid plan');
      }
    }),
    (error) => error?.code === 'DOCUMENT_AI_PAID_MODEL_BLOCKED'
  );
});

test('página médica com campo ilegível recebe revisão focal gratuita no Qwen', async () => {
  const calls = [];
  const initialFields = fieldsFor('pagina_medica_autorizada', {
    titulo: { state: 'encontrado', value: 'ENCAMINHAMENTO' },
    motivo_encaminhamento: { state: 'encontrado', value: 'MOTIVO' },
    medico: { state: 'encontrado', value: 'DR. TESTE' },
    crm_rms: { state: 'encontrado', value: 'CRM/MS 1' },
    procedimento_solicitado: { state: 'encontrado', value: 'PROC' },
    codigo_procedimento: { state: 'encontrado', value: '0001' },
    cid: { state: 'ilegivel', value: '' },
    descricao_cid: { state: 'encontrado', value: 'DESCRIÇÃO LITERAL' }
  });
  const reviewedFields = {
    titulo: { state: 'encontrado', value: 'ENCAMINHAMENTO' },
    cid: { state: 'ilegivel', value: '' },
    descricao_cid: { state: 'encontrado', value: 'DESCRIÇÃO LITERAL CORRETA' }
  };

  const result = await analyzeDocumentAiPage(enabledEnv(), {
    pageNumber: 6,
    mimeType: 'image/png',
    bytes: new Uint8Array([6, 6])
  }, {
    aiRun: async (model, input) => {
      calls.push({ model, input });
      if (calls.length === 1) {
        return workersResponse({
          pageType: 'pagina_medica_autorizada',
          fields: initialFields
        });
      }
      assert.equal(model, DOCUMENT_AI_FALLBACK_FREE_MODEL);
      assert.match(input.messages[1].content[1].text, /REVISÃO FOCAL DE PRECISÃO/);
      assert.match(input.messages[1].content[1].text, /cid/);
      assert.match(input.messages[1].content[1].text, /titulo/);
      assert.equal(input.max_completion_tokens, 350);
      return workersResponse({ fields: reviewedFields });
    }
  });

  assert.equal(calls.length, 2);
  assert.equal(result.provider.reviewed, true);
  assert.equal(result.provider.model, DOCUMENT_AI_FALLBACK_FREE_MODEL);
  assert.deepEqual(result.provider.reviewChangedKeys, ['descricao_cid']);
  assert.equal(result.extraction.fields.cid.state, 'ilegivel');
  assert.equal(result.extraction.fields.descricao_cid.value, 'DESCRIÇÃO LITERAL CORRETA');
  assert.equal(result.provider.attempts.length, 2);
});

test('revisão focal indisponível preserva extração inicial válida', async () => {
  let calls = 0;
  const initialFields = fieldsFor('pagina_medica_autorizada', {
    titulo: { state: 'encontrado', value: 'ENCAMINHAMENTO' },
    motivo_encaminhamento: { state: 'encontrado', value: 'MOTIVO' },
    medico: { state: 'encontrado', value: 'DR. TESTE' },
    crm_rms: { state: 'encontrado', value: 'CRM/MS 1' },
    procedimento_solicitado: { state: 'encontrado', value: 'PROC' },
    codigo_procedimento: { state: 'encontrado', value: '0001' },
    cid: { state: 'ilegivel', value: '' },
    descricao_cid: { state: 'encontrado', value: 'DESCRIÇÃO' }
  });

  const result = await analyzeDocumentAiPage(enabledEnv(), {
    pageNumber: 6,
    mimeType: 'image/png',
    bytes: new Uint8Array([6])
  }, {
    aiRun: async () => {
      calls += 1;
      if (calls === 1) {
        return workersResponse({
          pageType: 'pagina_medica_autorizada',
          fields: initialFields
        });
      }
      throw new Error('3040 Capacity temporarily exceeded');
    }
  });

  assert.equal(calls, 2);
  assert.equal(result.provider.reviewed, false);
  assert.equal(result.extraction.fields.cid.state, 'ilegivel');
  assert.equal(result.extraction.fields.descricao_cid.value, 'DESCRIÇÃO');
});

test('CID ausente com descrição presente também ativa revisão focal', async () => {
  const models = [];
  const initialFields = fieldsFor('pagina_medica_autorizada', {
    titulo: { state: 'encontrado', value: 'ENCAMINHAMENTO' },
    motivo_encaminhamento: { state: 'encontrado', value: 'MOTIVO' },
    medico: { state: 'encontrado', value: 'DR. TESTE' },
    crm_rms: { state: 'encontrado', value: 'CRM/MS 1' },
    procedimento_solicitado: { state: 'encontrado', value: 'PROC' },
    codigo_procedimento: { state: 'encontrado', value: '0001' },
    cid: { state: 'nao_consta', value: '' },
    descricao_cid: { state: 'encontrado', value: 'DESCRIÇÃO' }
  });
  const reviewedFields = {
    titulo: { state: 'encontrado', value: 'ENCAMINHAMENTO' },
    cid: { state: 'ilegivel', value: '' },
    descricao_cid: { state: 'encontrado', value: 'DESCRIÇÃO' }
  };

  const result = await analyzeDocumentAiPage(enabledEnv(), {
    pageNumber: 6,
    mimeType: 'image/png',
    bytes: new Uint8Array([6])
  }, {
    aiRun: async (model) => {
      models.push(model);
      if (models.length === 1) {
        return workersResponse({
          pageType: 'pagina_medica_autorizada',
          fields: initialFields
        });
      }
      return workersResponse({ fields: reviewedFields });
    }
  });

  assert.deepEqual(models, [
    DOCUMENT_AI_PRIMARY_FREE_MODEL,
    DOCUMENT_AI_FALLBACK_FREE_MODEL
  ]);
  assert.equal(result.extraction.fields.cid.state, 'ilegivel');
});

test('extração explícita recebe tipo autorizado e usa uma única imagem', async () => {
  let call;
  const result = await extractDocumentAiPage(enabledEnv(), {
    pageNumber: 5,
    pageType: 'pagina_medica_autorizada',
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([5, 4, 3, 2])
  }, {
    aiRun: async (model, input) => {
      call = { model, input };
      return workersResponse({
        fields: fieldsFor('pagina_medica_autorizada', {
          medico: { state: 'encontrado', value: 'DR. TEXTO LITERAL' },
          cid: { state: 'ilegivel', value: '' }
        })
      });
    }
  });

  assert.equal(result.extraction.pageNumber, 5);
  assert.equal(result.extraction.pageType, 'pagina_medica_autorizada');
  assert.equal(result.extraction.fields.medico.value, 'DR. TEXTO LITERAL');
  assert.deepEqual(result.extraction.fields.cid, { state: 'ilegivel', value: '' });
  assert.equal(call.input.image, undefined);
  assert.equal(call.input.messages[1].content[0].type, 'image_url');
  assert.match(call.input.messages[1].content[0].image_url.url, /^data:image\/jpeg;base64,/);
});

test('tipo MIME inválido e imagem acima do limite falham antes do provider', async () => {
  let calls = 0;
  const aiRun = async () => {
    calls += 1;
    return workersResponse({ pageType: 'outro' });
  };

  await assert.rejects(
    () => analyzeDocumentAiPage(enabledEnv(), {
      pageNumber: 1,
      mimeType: 'application/pdf',
      bytes: new Uint8Array([1])
    }, { aiRun }),
    (error) => error?.code === 'DOCUMENT_AI_IMAGE_TYPE_INVALID'
  );

  await assert.rejects(
    () => analyzeDocumentAiPage(enabledEnv(), {
      pageNumber: 1,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array(MAX_DOCUMENT_AI_IMAGE_BYTES + 1)
    }, { aiRun }),
    (error) => error?.code === 'DOCUMENT_AI_IMAGE_TOO_LARGE'
  );

  assert.equal(calls, 0);
});

test('chat usa somente evidências estruturadas e não envia imagem', async () => {
  const fields = fieldsFor('pagina_medica_autorizada', {
    procedimento_solicitado: { state: 'encontrado', value: 'PROCEDIMENTO TESTE' }
  });
  let call;

  const result = await chatDocumentAi(enabledEnv(), {
    question: 'Qual procedimento consta?',
    evidence: [{ pageNumber: 3, pageType: 'pagina_medica_autorizada', fields }]
  }, {
    aiRun: async (model, input) => {
      call = { model, input };
      return workersResponse({
        answer: 'PROCEDIMENTO TESTE [p. 3].',
        pages: [3]
      });
    }
  });

  assert.equal(result.chat.answer, 'PROCEDIMENTO TESTE [p. 3].');
  assert.deepEqual(result.chat.pages, [3]);
  assert.equal(call.input.image, undefined);
  assert.match(JSON.stringify(call.input), /PROCEDIMENTO TESTE/);
  assert.doesNotMatch(JSON.stringify(call.input), /filename|fileId|drive[-_ ]?id|item\.ref|searchQuery/i);
});

test('source do provider não registra conteúdo, não chama Gemini API e não usa AI Gateway', async () => {
  const source = await fs.readFile(new URL('../document-ai-provider.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /console\.(?:log|warn|error)/);
  assert.doesNotMatch(source, /generativelanguage\.googleapis\.com/);
  assert.doesNotMatch(source, /GEMINI_API_KEY/);
  assert.doesNotMatch(source, /gateway\.ai\.cloudflare\.com/);
  assert.match(source, /env\.AI\.run/);
  assert.match(source, /type: 'image_url'/);
  assert.match(source, /image_url: \{ url: image \}/);
  assert.doesNotMatch(source, /messages:\s*\[[\s\S]{0,300}\{ role: 'user', content: prompt \}[\s\S]{0,200}\]\s*,\s*image,/);
  assert.match(source, /rejectIfBusy: true/);
  assert.match(source, /enable_thinking: false/);
  assert.match(source, /reasoning_effort: null/);
  assert.match(source, /REVISÃO FOCAL DE PRECISÃO DA MESMA PÁGINA MÉDICA/);
  assert.match(source, /\[DOCUMENT_AI_FALLBACK_FREE_MODEL\]/);
  assert.match(source, /focus\.includes\('cid'\).*descricao_cid/s);
  assert.doesNotMatch(source, /DOCUMENT_AI_PROVIDER_LOCAL_TIMEOUT/);
  assert.doesNotMatch(source, /function withLocalTimeout|return await Promise\.race|new Promise\(\(_, reject\)/);
  assert.doesNotMatch(source, /setTimeout\(/);
  assert.doesNotMatch(source, /\{ signal \}/);
});
