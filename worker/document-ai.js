'use strict';

import {
  DOCUMENT_AI_FIELD_STATES,
  DOCUMENT_AI_PAGE_TYPES,
  documentAiRoutineMetadata
} from './document-ai-prompts.js';

export const DOCUMENT_AI_PHASE = '5E';
export const DOCUMENT_AI_VERSION = 'phase5e-v8c2-semantic-json';
const DOCUMENT_AI_RUNTIME_READY = true;

export const DOCUMENT_AI_EXTRACTION_FIELDS = Object.freeze({
  comprovante_atendimento: Object.freeze([
    'nome_paciente',
    'cpf',
    'cns',
    'data_nascimento',
    'nome_mae',
    'telefone',
    'endereco',
    'agente'
  ]),
  pagina_medica_autorizada: Object.freeze([
    'titulo',
    'motivo_encaminhamento',
    'medico',
    'crm_rms',
    'procedimento_solicitado',
    'codigo_procedimento',
    'cid',
    'descricao_cid'
  ])
});

export class DocumentAiError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'DocumentAiError';
    this.code = code;
    this.status = status;
  }
}

function flag(value) {
  return String(value || '').trim().toLowerCase() === 'true';
}

export function documentAiEnabled(env = {}) {
  return flag(env.DOCUMENTS_AI_ENABLED);
}

export function documentAiProcessingEnabled(env = {}) {
  return DOCUMENT_AI_RUNTIME_READY
    && documentAiEnabled(env)
    && flag(env.DOCUMENTS_AI_PROCESSING_ENABLED);
}

export function documentAiPublicConfig(env = {}) {
  return {
    enabled: documentAiEnabled(env),
    processingEnabled: documentAiProcessingEnabled(env),
    phase: DOCUMENT_AI_PHASE,
    version: DOCUMENT_AI_VERSION,
    pageIsolation: true,
    provenanceRequired: true,
    persistence: 'none',
    provider: 'cloudflare-workers-ai',
    freeOnly: true,
    features: {
      classifyPage: true,
      extractPage: true,
      extractDocument: true,
      documentChat: true
    },
    routines: documentAiRoutineMetadata()
  };
}

export function normalizeDocumentAiPageNumber(value) {
  const pageNumber = Number(value);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 5000) {
    throw new DocumentAiError('DOCUMENT_AI_PAGE_INVALID', 'Número de página inválido.', 400);
  }
  return pageNumber;
}

export function normalizeDocumentAiField(value) {
  const state = String(value?.state || '').trim();
  if (!DOCUMENT_AI_FIELD_STATES.includes(state)) {
    throw new DocumentAiError('DOCUMENT_AI_FIELD_STATE_INVALID', 'Estado de campo inválido.', 400);
  }
  const text = state === 'encontrado' ? String(value?.value || '').trim() : '';
  if (state === 'encontrado' && !text) {
    throw new DocumentAiError('DOCUMENT_AI_FIELD_VALUE_REQUIRED', 'Campo encontrado precisa conter valor literal.', 400);
  }
  return { state, value: text };
}

export function normalizeDocumentAiClassification(value) {
  const pageNumber = normalizeDocumentAiPageNumber(value?.pageNumber);
  const pageType = String(value?.pageType || '').trim();
  if (!DOCUMENT_AI_PAGE_TYPES.includes(pageType)) {
    throw new DocumentAiError('DOCUMENT_AI_PAGE_TYPE_INVALID', 'Classificação de página inválida.', 400);
  }
  return { pageNumber, pageType };
}

function normalizeCnsForOutput(value) {
  const source = String(value || '').trim();
  // Normalização autorizada é apenas de separadores. Se houver qualquer
  // caractere alfabético/inesperado, preservamos o literal em vez de "corrigir".
  if (!/^[0-9\s.\/-]+$/.test(source)) return source;
  const digits = source.replace(/\D/g, '');
  return digits || source;
}

function normalizeBirthDateForOutput(value) {
  const source = String(value || '').trim();
  let match = source.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0') + '/' + match[3];
    }
  }
  match = source.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0') + '/' + match[1];
    }
  }
  return source;
}

function normalizeDocumentAiFieldForSchema(pageType, key, value) {
  const field = normalizeDocumentAiField(value);
  if (field.state !== 'encontrado' || pageType !== 'comprovante_atendimento') return field;
  if (key === 'cns') return { ...field, value: normalizeCnsForOutput(field.value) };
  if (key === 'data_nascimento') return { ...field, value: normalizeBirthDateForOutput(field.value) };
  return field;
}

export function normalizeDocumentAiExtraction(value, expected = {}) {
  const pageNumber = normalizeDocumentAiPageNumber(value?.pageNumber);
  const pageType = String(value?.pageType || '').trim();
  const allowedFields = DOCUMENT_AI_EXTRACTION_FIELDS[pageType];
  if (!allowedFields) {
    throw new DocumentAiError(
      'DOCUMENT_AI_EXTRACTION_TYPE_INVALID',
      'Esta página não possui rotina de extração autorizada.',
      422
    );
  }

  if (expected.pageNumber != null && pageNumber !== normalizeDocumentAiPageNumber(expected.pageNumber)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PAGE_PROVENANCE_MISMATCH',
      'A extração perdeu a proveniência da página.',
      502
    );
  }
  if (expected.pageType && pageType !== String(expected.pageType)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PAGE_TYPE_MISMATCH',
      'A extração não corresponde à classificação autorizada.',
      502
    );
  }

  const sourceFields = value?.fields;
  if (!sourceFields || typeof sourceFields !== 'object' || Array.isArray(sourceFields)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_FIELDS_INVALID',
      'A extração não retornou campos estruturados.',
      502
    );
  }

  const unknown = Object.keys(sourceFields).filter((key) => !allowedFields.includes(key));
  if (unknown.length) {
    throw new DocumentAiError(
      'DOCUMENT_AI_FIELDS_UNEXPECTED',
      'A extração retornou campos fora do schema autorizado.',
      502
    );
  }

  const fields = {};
  for (const key of allowedFields) {
    if (!(key in sourceFields)) {
      throw new DocumentAiError(
        'DOCUMENT_AI_FIELD_MISSING',
        'A extração não retornou todos os campos obrigatórios do schema.',
        502
      );
    }
    fields[key] = normalizeDocumentAiFieldForSchema(pageType, key, sourceFields[key]);
  }

  return { pageNumber, pageType, fields };
}


const DOCUMENT_AI_MAX_EVIDENCE_PAGES = 12;
const DOCUMENT_AI_MAX_QUESTION_CHARS = 1200;
const DOCUMENT_AI_MAX_FIELD_CHARS = 4000;
const DOCUMENT_AI_MAX_ANSWER_CHARS = 6000;

export function normalizeDocumentAiQuestion(value) {
  const question = String(value || '').trim();
  if (!question) {
    throw new DocumentAiError('DOCUMENT_AI_QUESTION_REQUIRED', 'Digite uma pergunta sobre as evidências extraídas.', 400);
  }
  if (question.length > DOCUMENT_AI_MAX_QUESTION_CHARS) {
    throw new DocumentAiError('DOCUMENT_AI_QUESTION_TOO_LONG', 'Pergunta maior do que o limite da IA documental.', 413);
  }
  return question;
}

export function normalizeDocumentAiEvidence(value) {
  if (!Array.isArray(value) || value.length < 1) {
    throw new DocumentAiError('DOCUMENT_AI_EVIDENCE_REQUIRED', 'Extraia ao menos uma página antes de perguntar.', 400);
  }
  if (value.length > DOCUMENT_AI_MAX_EVIDENCE_PAGES) {
    throw new DocumentAiError('DOCUMENT_AI_EVIDENCE_TOO_LARGE', 'Há páginas demais nesta consulta documental.', 413);
  }

  const seen = new Set();
  return value.map((item) => {
    const normalized = normalizeDocumentAiExtraction(item);
    if (seen.has(normalized.pageNumber)) {
      throw new DocumentAiError('DOCUMENT_AI_EVIDENCE_DUPLICATE_PAGE', 'A mesma página não pode aparecer duas vezes nas evidências.', 400);
    }
    seen.add(normalized.pageNumber);
    const fields = Object.fromEntries(Object.entries(normalized.fields).map(([key, field]) => [
      key,
      field.state === 'encontrado'
        ? { state: field.state, value: String(field.value).slice(0, DOCUMENT_AI_MAX_FIELD_CHARS) }
        : { state: field.state, value: '' }
    ]));
    return {
      pageNumber: normalized.pageNumber,
      pageType: normalized.pageType,
      fields
    };
  });
}

export function normalizeDocumentAiChatResponse(value, evidence) {
  const normalizedEvidence = normalizeDocumentAiEvidence(evidence);
  const allowedPages = new Set(normalizedEvidence.map((item) => item.pageNumber));
  const answer = String(value?.answer || '').trim();
  if (!answer || answer.length > DOCUMENT_AI_MAX_ANSWER_CHARS) {
    throw new DocumentAiError(
      'DOCUMENT_AI_CHAT_ANSWER_INVALID',
      'A resposta documental retornou formato inválido.',
      502
    );
  }

  const pages = Array.isArray(value?.pages)
    ? [...new Set(value.pages.map((page) => normalizeDocumentAiPageNumber(page)))]
    : [];
  if (pages.some((page) => !allowedPages.has(page))) {
    throw new DocumentAiError(
      'DOCUMENT_AI_CHAT_PROVENANCE_MISMATCH',
      'A resposta citou página fora das evidências fornecidas.',
      502
    );
  }

  const citations = [...answer.matchAll(/\[p\.\s*(\d+)\]/gi)]
    .map((match) => Number(match[1]))
    .filter(Number.isInteger);
  if (citations.some((page) => !allowedPages.has(page))) {
    throw new DocumentAiError(
      'DOCUMENT_AI_CHAT_PROVENANCE_MISMATCH',
      'A resposta textual citou página fora das evidências fornecidas.',
      502
    );
  }

  const terminal = /^(NÃO CONSTA|ILEGÍVEL)[.!]?$/iu.test(answer);
  if (terminal) {
    if (pages.length || citations.length) {
      throw new DocumentAiError(
        'DOCUMENT_AI_CHAT_PROVENANCE_MISMATCH',
        'Resposta terminal não deve declarar páginas contraditórias.',
        502
      );
    }
  } else {
    if (!pages.length || !citations.length) {
      throw new DocumentAiError(
        'DOCUMENT_AI_CHAT_PROVENANCE_REQUIRED',
        'A resposta documental perdeu a citação de página obrigatória.',
        502
      );
    }
    const declared = [...pages].sort((a, b) => a - b);
    const cited = [...new Set(citations)].sort((a, b) => a - b);
    if (declared.length !== cited.length || declared.some((page, index) => page !== cited[index])) {
      throw new DocumentAiError(
        'DOCUMENT_AI_CHAT_PROVENANCE_MISMATCH',
        'A resposta e a lista de páginas possuem proveniência divergente.',
        502
      );
    }
  }

  return { answer, pages };
}

export function documentAiTechnicalEvent(name, properties = {}) {
  const allowedNames = new Set([
    'document_ai_panel_opened',
    'document_ai_classification_started',
    'document_ai_classification_completed',
    'document_ai_classification_failed',
    'document_ai_extraction_started',
    'document_ai_extraction_completed',
    'document_ai_extraction_failed',
    'document_ai_chat_started',
    'document_ai_chat_completed',
    'document_ai_chat_failed'
  ]);
  if (!allowedNames.has(String(name || ''))) return null;

  const safe = {};
  if (Number.isFinite(Number(properties.duration_ms))) {
    safe.duration_ms = Math.max(0, Math.round(Number(properties.duration_ms)));
  }
  if (['classification', 'extraction', 'chat', 'validation'].includes(properties.operation)) {
    safe.operation = properties.operation;
  }
  if (['success', 'failed', 'disabled'].includes(properties.result)) {
    safe.result = properties.result;
  }
  if (['tiny', 'small', 'medium', 'large', 'very_large', 'unknown'].includes(properties.size_bucket)) {
    safe.size_bucket = properties.size_bucket;
  }
  if (Number.isInteger(Number(properties.page_count_bucket))) {
    safe.page_count_bucket = Math.max(0, Math.min(20, Number(properties.page_count_bucket)));
  }
  return { name: String(name), properties: safe };
}
