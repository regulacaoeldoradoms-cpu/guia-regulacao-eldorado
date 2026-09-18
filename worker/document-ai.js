'use strict';

import {
  DOCUMENT_AI_FIELD_STATES,
  DOCUMENT_AI_PAGE_TYPES,
  documentAiRoutineMetadata
} from './document-ai-prompts.js';

export const DOCUMENT_AI_PHASE = '5B';
export const DOCUMENT_AI_VERSION = 'phase5b-v1';
const DOCUMENT_AI_RUNTIME_READY = true;

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
    features: {
      classifyPage: true,
      extractPage: false,
      documentChat: false
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

export function documentAiTechnicalEvent(name, properties = {}) {
  const allowedNames = new Set([
    'document_ai_panel_opened',
    'document_ai_classification_started',
    'document_ai_classification_completed',
    'document_ai_classification_failed',
    'document_ai_extraction_started',
    'document_ai_extraction_completed',
    'document_ai_extraction_failed'
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
