import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DOCUMENT_AI_PHASE,
  DOCUMENT_AI_VERSION,
  documentAiEnabled,
  documentAiProcessingEnabled,
  documentAiPublicConfig,
  normalizeDocumentAiClassification,
  normalizeDocumentAiField,
  documentAiTechnicalEvent
} from '../document-ai.js';

test('IA documental 5A permanece fail-closed mesmo se flags forem ligadas por engano', () => {
  assert.equal(documentAiEnabled({}), false);
  assert.equal(documentAiProcessingEnabled({ DOCUMENTS_AI_PROCESSING_ENABLED: 'true' }), false);
  assert.equal(documentAiEnabled({ DOCUMENTS_AI_ENABLED: 'true' }), true);
  assert.equal(documentAiProcessingEnabled({
    DOCUMENTS_AI_ENABLED: 'true',
    DOCUMENTS_AI_PROCESSING_ENABLED: 'true'
  }), false);
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
  assert.equal(config.enabled, true);
  assert.equal(config.processingEnabled, false);
  assert.equal(config.pageIsolation, true);
  assert.equal(config.provenanceRequired, true);
  assert.equal(config.persistence, 'none');
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
