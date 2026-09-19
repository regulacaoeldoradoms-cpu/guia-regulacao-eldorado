import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DOCUMENT_AI_EXTRACTION_FIELDS,
  DOCUMENT_AI_PHASE,
  DOCUMENT_AI_VERSION,
  documentAiEnabled,
  documentAiProcessingEnabled,
  documentAiPublicConfig,
  normalizeDocumentAiClassification,
  normalizeDocumentAiExtraction,
  normalizeDocumentAiField,
  normalizeDocumentAiQuestion,
  normalizeDocumentAiEvidence,
  normalizeDocumentAiChatResponse,
  documentAiTechnicalEvent
} from '../document-ai.js';

test('IA documental 5E só processa quando os dois gates estão ligados', () => {
  assert.equal(documentAiEnabled({}), false);
  assert.equal(documentAiProcessingEnabled({ DOCUMENTS_AI_PROCESSING_ENABLED: 'true' }), false);
  assert.equal(documentAiEnabled({ DOCUMENTS_AI_ENABLED: 'true' }), true);
  assert.equal(documentAiProcessingEnabled({
    DOCUMENTS_AI_ENABLED: 'true',
    DOCUMENTS_AI_PROCESSING_ENABLED: 'true'
  }), true);
});

test('configuração pública não expõe segredos nem conteúdo', () => {
  const config = documentAiPublicConfig({
    DOCUMENTS_AI_ENABLED: 'true',
    DOCUMENTS_AI_PROCESSING_ENABLED: 'false',
    GEMINI_API_KEY: 'segredo-nao-pode-sair',
    DRIVE_TOKEN_ENCRYPTION_KEY: 'outro-segredo',
    AUTH_SESSION_SECRET: 'sessao'
  });

  assert.equal(config.phase, DOCUMENT_AI_PHASE);
  assert.equal(config.version, DOCUMENT_AI_VERSION);
  assert.equal(config.phase, '5E');
  assert.equal(config.version, 'phase5e-v3-workers-ai-free');
  assert.equal(config.enabled, true);
  assert.equal(config.processingEnabled, false);
  assert.equal(config.pageIsolation, true);
  assert.equal(config.provenanceRequired, true);
  assert.equal(config.persistence, 'none');
  assert.equal(config.provider, 'cloudflare-workers-ai');
  assert.equal(config.freeOnly, true);
  assert.equal(config.features.classifyPage, true);
  assert.equal(config.features.extractPage, true);
  assert.equal(config.features.extractDocument, true);
  assert.equal(config.features.documentChat, true);
  assert.equal(Array.isArray(config.routines), true);
  const serialized = JSON.stringify(config);
  assert.doesNotMatch(serialized, /segredo-nao-pode-sair|outro-segredo|GEMINI_API_KEY|AUTH_SESSION_SECRET/);
  assert.equal(config.routines.every((routine) => !('system' in routine)), true);
});

test('classificação exige uma página válida e um tipo fechado', () => {
  assert.deepEqual(
    normalizeDocumentAiClassification({ pageNumber: 3, pageType: 'pagina_medica_autorizada' }),
    { pageNumber: 3, pageType: 'pagina_medica_autorizada' }
  );
  assert.throws(
    () => normalizeDocumentAiClassification({ pageNumber: 0, pageType: 'outro' }),
    /Número de página inválido/
  );
  assert.throws(
    () => normalizeDocumentAiClassification({ pageNumber: 2, pageType: 'qualquer_coisa' }),
    /Classificação de página inválida/
  );
});

test('campos estruturados distinguem encontrado, NÃO CONSTA e ILEGÍVEL', () => {
  assert.deepEqual(normalizeDocumentAiField({ state: 'encontrado', value: 'Texto literal' }), {
    state: 'encontrado',
    value: 'Texto literal'
  });
  assert.deepEqual(normalizeDocumentAiField({ state: 'nao_consta', value: 'não deve sobreviver' }), {
    state: 'nao_consta',
    value: ''
  });
  assert.deepEqual(normalizeDocumentAiField({ state: 'ilegivel', value: 'tentativa' }), {
    state: 'ilegivel',
    value: ''
  });
  assert.throws(() => normalizeDocumentAiField({ state: 'encontrado', value: '' }), /valor literal/);
});

test('telemetria descarta propriedades documentais e identificáveis', () => {
  const event = documentAiTechnicalEvent('document_ai_extraction_completed', {
    duration_ms: 1234.4,
    operation: 'extraction',
    result: 'success',
    size_bucket: 'small',
    page_count_bucket: 3,
    filename: 'paciente.pdf',
    fileId: 'drive-id',
    patient_name: 'Pessoa',
    cpf: '00000000000',
    page_text: 'conteúdo'
  });
  assert.deepEqual(event, {
    name: 'document_ai_extraction_completed',
    properties: {
      duration_ms: 1234,
      operation: 'extraction',
      result: 'success',
      size_bucket: 'small',
      page_count_bucket: 3
    }
  });
  assert.equal(documentAiTechnicalEvent('evento_nao_autorizado', { duration_ms: 1 }), null);
});


test('extração restritiva exige todos os campos e recusa campos inesperados', () => {
  const fields = Object.fromEntries(
    DOCUMENT_AI_EXTRACTION_FIELDS.comprovante_atendimento.map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ])
  );
  fields.nome_paciente = { state: 'encontrado', value: 'NOME LITERAL' };
  fields.cpf = { state: 'ilegivel', value: 'não deve sobreviver' };

  const normalized = normalizeDocumentAiExtraction({
    pageNumber: 4,
    pageType: 'comprovante_atendimento',
    fields
  }, {
    pageNumber: 4,
    pageType: 'comprovante_atendimento'
  });

  assert.equal(normalized.pageNumber, 4);
  assert.equal(normalized.fields.nome_paciente.value, 'NOME LITERAL');
  assert.deepEqual(normalized.fields.cpf, { state: 'ilegivel', value: '' });
  assert.equal(Object.keys(normalized.fields).length, DOCUMENT_AI_EXTRACTION_FIELDS.comprovante_atendimento.length);

  assert.throws(() => normalizeDocumentAiExtraction({
    pageNumber: 4,
    pageType: 'comprovante_atendimento',
    fields: { ...fields, campo_inventado: { state: 'encontrado', value: 'X' } }
  }), /fora do schema autorizado/);

  const missing = { ...fields };
  delete missing.cns;
  assert.throws(() => normalizeDocumentAiExtraction({
    pageNumber: 4,
    pageType: 'comprovante_atendimento',
    fields: missing
  }), /todos os campos obrigatórios/);
});


test('comprovante aplica somente normalizações autorizadas de CNS e data', () => {
  const fields = Object.fromEntries(
    DOCUMENT_AI_EXTRACTION_FIELDS.comprovante_atendimento.map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ])
  );
  fields.cns = { state: 'encontrado', value: '123 4567 8901 2345' };
  fields.data_nascimento = { state: 'encontrado', value: '1-2-2000' };
  fields.endereco = { state: 'encontrado', value: 'RUA Teste, 10 - Centro' };

  const normalized = normalizeDocumentAiExtraction({
    pageNumber: 1,
    pageType: 'comprovante_atendimento',
    fields
  });

  assert.equal(normalized.fields.cns.value, '123456789012345');
  assert.equal(normalized.fields.data_nascimento.value, '01/02/2000');
  assert.equal(normalized.fields.endereco.value, 'RUA Teste, 10 - Centro');

  fields.cns = { state: 'encontrado', value: '1234X6789012345' };
  let preserved = normalizeDocumentAiExtraction({
    pageNumber: 1,
    pageType: 'comprovante_atendimento',
    fields
  });
  assert.equal(preserved.fields.cns.value, '1234X6789012345');

  fields.cns = { state: 'encontrado', value: '123 4567 8901 2345' };
  fields.data_nascimento = { state: 'encontrado', value: 'texto não normalizável' };
  preserved = normalizeDocumentAiExtraction({
    pageNumber: 1,
    pageType: 'comprovante_atendimento',
    fields
  });
  assert.equal(preserved.fields.data_nascimento.value, 'texto não normalizável');
});

test('extração recusa troca de página, troca de tipo e tipo outro', () => {
  const fields = Object.fromEntries(
    DOCUMENT_AI_EXTRACTION_FIELDS.pagina_medica_autorizada.map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ])
  );

  assert.throws(() => normalizeDocumentAiExtraction({
    pageNumber: 3,
    pageType: 'pagina_medica_autorizada',
    fields
  }, { pageNumber: 2, pageType: 'pagina_medica_autorizada' }), /proveniência/);

  assert.throws(() => normalizeDocumentAiExtraction({
    pageNumber: 3,
    pageType: 'pagina_medica_autorizada',
    fields
  }, { pageNumber: 3, pageType: 'comprovante_atendimento' }), /classificação autorizada/);

  assert.throws(() => normalizeDocumentAiExtraction({
    pageNumber: 3,
    pageType: 'outro',
    fields: {}
  }), /não possui rotina de extração autorizada/);
});


test('chat 5D aceita somente evidências estruturadas por página e rejeita duplicidade', () => {
  const fields = Object.fromEntries(
    DOCUMENT_AI_EXTRACTION_FIELDS.comprovante_atendimento.map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ])
  );
  fields.nome_paciente = { state: 'encontrado', value: 'PESSOA SINTÉTICA' };
  const evidence = normalizeDocumentAiEvidence([{
    pageNumber: 2,
    pageType: 'comprovante_atendimento',
    fields
  }]);

  assert.equal(evidence.length, 1);
  assert.equal(evidence[0].pageNumber, 2);
  assert.equal(evidence[0].fields.nome_paciente.value, 'PESSOA SINTÉTICA');
  assert.throws(() => normalizeDocumentAiEvidence([...evidence, ...evidence]), /mesma página/i);
  assert.throws(() => normalizeDocumentAiQuestion('   '), /Digite uma pergunta/);
});

test('chat 5D exige citações dentro das páginas de evidência', () => {
  const fields = Object.fromEntries(
    DOCUMENT_AI_EXTRACTION_FIELDS.pagina_medica_autorizada.map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ])
  );
  fields.procedimento_solicitado = { state: 'encontrado', value: 'PROCEDIMENTO TESTE' };
  const evidence = [{
    pageNumber: 4,
    pageType: 'pagina_medica_autorizada',
    fields
  }];

  assert.deepEqual(
    normalizeDocumentAiChatResponse({
      answer: 'Consta PROCEDIMENTO TESTE [p. 4].',
      pages: [4]
    }, evidence),
    { answer: 'Consta PROCEDIMENTO TESTE [p. 4].', pages: [4] }
  );
  assert.throws(() => normalizeDocumentAiChatResponse({
    answer: 'Resposta sem citação.',
    pages: [4]
  }, evidence), /citação de página/i);
  assert.throws(() => normalizeDocumentAiChatResponse({
    answer: 'Página indevida [p. 5].',
    pages: [5]
  }, evidence), /fora das evidências/i);
  assert.throws(() => normalizeDocumentAiChatResponse({
    answer: 'Lista divergente [p. 4].',
    pages: []
  }, evidence), /citação de página|proveniência/i);
  assert.deepEqual(
    normalizeDocumentAiChatResponse({ answer: 'NÃO CONSTA', pages: [] }, evidence),
    { answer: 'NÃO CONSTA', pages: [] }
  );
  assert.deepEqual(
    normalizeDocumentAiChatResponse({ answer: 'ILEGÍVEL', pages: [] }, evidence),
    { answer: 'ILEGÍVEL', pages: [] }
  );
  assert.throws(() => normalizeDocumentAiChatResponse({
    answer: 'NÃO CONSTA',
    pages: [4]
  }, evidence), /não deve declarar páginas/i);
});
