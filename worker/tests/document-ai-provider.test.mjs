import test from 'node:test';
import assert from 'node:assert/strict';

import { DOCUMENT_AI_EXTRACTION_FIELDS } from '../document-ai.js';

import {
  MAX_DOCUMENT_AI_IMAGE_BYTES,
  classifyAndExtractDocumentAiPage,
  classifyDocumentAiPage,
  extractDocumentAiPage
} from '../document-ai-provider.js';

function enabledEnv() {
  return {
    DOCUMENTS_AI_ENABLED: 'true',
    DOCUMENTS_AI_PROCESSING_ENABLED: 'true',
    GEMINI_API_KEY: 'test-key-not-secret',
    DOCUMENTS_AI_MODEL: 'gemini-test-model'
  };
}

function extractionPayload(pageNumber, pageType, overrides = {}) {
  const fields = Object.fromEntries(
    DOCUMENT_AI_EXTRACTION_FIELDS[pageType].map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ])
  );
  Object.assign(fields, overrides);
  return { pageNumber, pageType, fields };
}

function extractionResponse(extraction) {
  return okResponse(extraction);
}

function okResponse(classification) {
  return new Response(JSON.stringify({
    candidates: [{
      content: {
        parts: [{ text: JSON.stringify(classification) }]
      }
    }]
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

test('gate false impede qualquer chamada ao provedor', async () => {
  let called = false;
  await assert.rejects(
    () => classifyDocumentAiPage({
      ...enabledEnv(),
      DOCUMENTS_AI_PROCESSING_ENABLED: 'false'
    }, {
      pageNumber: 1,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([1, 2, 3])
    }, {
      fetchImpl: async () => {
        called = true;
        return okResponse({ pageNumber: 1, pageType: 'outro' });
      }
    }),
    (error) => error?.code === 'DOCUMENT_AI_PROCESSING_DISABLED'
  );
  assert.equal(called, false);
});

test('classificação envia exatamente uma imagem e somente o número técnico da página', async () => {
  const calls = [];
  const result = await classifyDocumentAiPage(enabledEnv(), {
    pageNumber: 7,
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([1, 2, 3, 4])
  }, {
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return okResponse({ pageNumber: 7, pageType: 'comprovante_atendimento' });
    }
  });

  assert.deepEqual(result.classification, {
    pageNumber: 7,
    pageType: 'comprovante_atendimento'
  });
  assert.equal(calls.length, 1);

  const body = JSON.parse(calls[0].options.body);
  const parts = body.contents?.[0]?.parts || [];
  const images = parts.filter((part) => part?.inlineData);
  const texts = parts.filter((part) => typeof part?.text === 'string');

  assert.equal(images.length, 1);
  assert.equal(images[0].inlineData.mimeType, 'image/jpeg');
  assert.equal(typeof images[0].inlineData.data, 'string');
  assert.equal(texts.length, 1);
  assert.match(texts[0].text, /página: 7/i);

  const serialized = JSON.stringify(body);
  assert.doesNotMatch(serialized, /filename|fileId|drive[-_ ]?id|item\.ref|patient|cpf|cns/i);
  assert.match(body.systemInstruction.parts[0].text, /exatamente UMA página/i);
});

test('proveniência divergente do provedor é rejeitada', async () => {
  await assert.rejects(
    () => classifyDocumentAiPage(enabledEnv(), {
      pageNumber: 2,
      mimeType: 'image/png',
      bytes: new Uint8Array([9, 8, 7])
    }, {
      fetchImpl: async () => okResponse({
        pageNumber: 3,
        pageType: 'pagina_medica_autorizada'
      })
    }),
    (error) => error?.code === 'DOCUMENT_AI_PAGE_PROVENANCE_MISMATCH'
  );
});

test('tipo MIME inválido e imagem acima do limite falham antes do fetch', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return okResponse({ pageNumber: 1, pageType: 'outro' });
  };

  await assert.rejects(
    () => classifyDocumentAiPage(enabledEnv(), {
      pageNumber: 1,
      mimeType: 'application/pdf',
      bytes: new Uint8Array([1])
    }, { fetchImpl }),
    (error) => error?.code === 'DOCUMENT_AI_IMAGE_TYPE_INVALID'
  );

  await assert.rejects(
    () => classifyDocumentAiPage(enabledEnv(), {
      pageNumber: 1,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array(MAX_DOCUMENT_AI_IMAGE_BYTES + 1)
    }, { fetchImpl }),
    (error) => error?.code === 'DOCUMENT_AI_IMAGE_TOO_LARGE'
  );

  assert.equal(calls, 0);
});

test('erro HTTP do provedor é sanitizado e não reproduz resposta upstream', async () => {
  const upstreamSecret = 'conteudo-upstream-nao-pode-vazar';
  await assert.rejects(
    () => classifyDocumentAiPage(enabledEnv(), {
      pageNumber: 4,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([4, 4, 4])
    }, {
      fetchImpl: async () => new Response(JSON.stringify({
        error: { message: upstreamSecret }
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }),
    (error) => {
      assert.equal(error?.code, 'DOCUMENT_AI_PROVIDER_HTTP_ERROR');
      assert.equal(error?.status, 429);
      assert.equal(String(error?.message || '').includes(upstreamSecret), false);
      return true;
    }
  );
});

test('source do provider não registra conteúdo documental', async () => {
  const fs = await import('node:fs/promises');
  const source = await fs.readFile(new URL('../document-ai-provider.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /console\.(?:log|warn|error)/);
  assert.doesNotMatch(source, /JSON\.stringify\(payload\)/);
});


test('extração envia uma única imagem e preserva literalidade no schema autorizado', async () => {
  const calls = [];
  const result = await extractDocumentAiPage(enabledEnv(), {
    pageNumber: 5,
    pageType: 'pagina_medica_autorizada',
    mimeType: 'image/jpeg',
    bytes: new Uint8Array([5, 4, 3, 2])
  }, {
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return extractionResponse(extractionPayload(5, 'pagina_medica_autorizada', {
        medico: { state: 'encontrado', value: 'DR. TEXTO LITERAL' },
        cid: { state: 'ilegivel', value: '' }
      }));
    }
  });

  assert.equal(calls.length, 1);
  assert.equal(result.extraction.pageNumber, 5);
  assert.equal(result.extraction.pageType, 'pagina_medica_autorizada');
  assert.deepEqual(result.extraction.fields.medico, {
    state: 'encontrado',
    value: 'DR. TEXTO LITERAL'
  });
  assert.deepEqual(result.extraction.fields.cid, { state: 'ilegivel', value: '' });

  const body = JSON.parse(calls[0].options.body);
  const parts = body.contents?.[0]?.parts || [];
  assert.equal(parts.filter((part) => part?.inlineData).length, 1);
  assert.match(parts[0].text, /Número técnico da página: 5/);
  assert.match(parts[0].text, /pagina_medica_autorizada/);
  assert.match(parts[0].text, /motivo_encaminhamento/);
  assert.doesNotMatch(JSON.stringify(body), /filename|fileId|drive[-_ ]?id|item\.ref/i);
  assert.match(body.systemInstruction.parts[0].text, /Nunca complete um campo com informação de outra página/i);
});

test('extração rejeita proveniência, tipo e campo fora do schema', async () => {
  await assert.rejects(
    () => extractDocumentAiPage(enabledEnv(), {
      pageNumber: 6,
      pageType: 'comprovante_atendimento',
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([1, 6])
    }, {
      fetchImpl: async () => extractionResponse(
        extractionPayload(7, 'comprovante_atendimento')
      )
    }),
    (error) => error?.code === 'DOCUMENT_AI_PAGE_PROVENANCE_MISMATCH'
  );

  await assert.rejects(
    () => extractDocumentAiPage(enabledEnv(), {
      pageNumber: 6,
      pageType: 'comprovante_atendimento',
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([1, 6])
    }, {
      fetchImpl: async () => extractionResponse(
        extractionPayload(6, 'pagina_medica_autorizada')
      )
    }),
    (error) => error?.code === 'DOCUMENT_AI_PAGE_TYPE_MISMATCH'
  );

  const invalid = extractionPayload(6, 'comprovante_atendimento');
  invalid.fields.campo_extra = { state: 'encontrado', value: 'X' };
  await assert.rejects(
    () => extractDocumentAiPage(enabledEnv(), {
      pageNumber: 6,
      pageType: 'comprovante_atendimento',
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([1, 6])
    }, {
      fetchImpl: async () => extractionResponse(invalid)
    }),
    (error) => error?.code === 'DOCUMENT_AI_FIELDS_UNEXPECTED'
  );
});

test('pipeline 5C reclassifica a mesma página antes de extrair e bloqueia tipo outro', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return okResponse({ pageNumber: 8, pageType: 'outro' });
  };

  await assert.rejects(
    () => classifyAndExtractDocumentAiPage(enabledEnv(), {
      pageNumber: 8,
      mimeType: 'image/jpeg',
      bytes: new Uint8Array([8, 8])
    }, { fetchImpl }),
    (error) => error?.code === 'DOCUMENT_AI_PAGE_NOT_AUTHORIZED'
  );
  assert.equal(calls, 1);
});

test('pipeline 5C usa duas chamadas na mesma página e devolve classificação + extração coerentes', async () => {
  const replies = [
    okResponse({ pageNumber: 9, pageType: 'comprovante_atendimento' }),
    extractionResponse(extractionPayload(9, 'comprovante_atendimento', {
      nome_paciente: { state: 'encontrado', value: 'PESSOA TESTE' }
    }))
  ];
  const seenBodies = [];

  const result = await classifyAndExtractDocumentAiPage(enabledEnv(), {
    pageNumber: 9,
    mimeType: 'image/png',
    bytes: new Uint8Array([9, 1, 9])
  }, {
    fetchImpl: async (_url, options) => {
      seenBodies.push(JSON.parse(options.body));
      return replies.shift();
    }
  });

  assert.equal(seenBodies.length, 2);
  assert.deepEqual(result.classification, {
    pageNumber: 9,
    pageType: 'comprovante_atendimento'
  });
  assert.equal(result.extraction.pageNumber, 9);
  assert.equal(result.extraction.pageType, 'comprovante_atendimento');
  assert.equal(result.extraction.fields.nome_paciente.value, 'PESSOA TESTE');
  assert.equal(seenBodies.every((body) =>
    (body.contents?.[0]?.parts || []).filter((part) => part?.inlineData).length === 1
  ), true);
});
