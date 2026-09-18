'use strict';

import {
  DOCUMENT_AI_FIELD_STATES,
  DOCUMENT_AI_PAGE_TYPES,
  documentAiRoutineMetadata
} from './document-ai-prompts.js';

export const DOCUMENT_AI_PHASE = '5A';
export const DOCUMENT_AI_VERSION = 'phase5a-v1';

function flag(value) {
  return String(value || '').trim().toLowerCase() === 'true';
}

export function documentAiEnabled(env = {}) {
  return flag(env.DOCUMENTS_AI_ENABLED);
}

export function documentAiProcessingEnabled(env = {}) {
  return documentAiEnabled(env) && flag(env.DOCUMENTS_AI_PROCESSING_ENABLED);
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
    routines: documentAiRoutineMetadata()
  };
}

export function normalizeDocumentAiPageNumber(value) {
  const pageNumber = Number(value);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 5000) {
    const error = new Error('Número de página inválido.');
    error.code = 'DOCUMENT_AI_PAGE_INVALID';
    error.status = 400;
    throw error;
  }
  return pageNumber;
}

export function normalizeDocumentAiField(value) {
  const state = String(value?.state || '').trim();
  if (!DOCUMENT_AI_FIELD_STATES.includes(state)) {
    const error = new Error('Estado de campo inválido.');
    error.code = 'DOCUMENT_AI_FIELD_STATE_INVALID';
    error.status = 400;
    throw error;
  }
  const text = state === 'encontrado' ? String(value?.value || '').trim() : '';
  if (state === 'encontrado' && !text) {
    const error = new Error('Campo encontrado precisa conter valor literal.');
    error.code = 'DOCUMENT_AI_FIELD_VALUE_REQUIRED';
    error.status = 400;
    throw error;
  }
  return { state, value: text };
}

export function normalizeDocumentAiClassification(value) {
  const pageNumber = normalizeDocumentAiPageNumber(value?.pageNumber);
  const pageType = String(value?.pageType || '').trim();
  if (!DOCUMENT_AI_PAGE_TYPES.includes(pageType)) {
    const error = new Error('Classificação de página inválida.');
    error.code = 'DOCUMENT_AI_PAGE_TYPE_INVALID';
    error.status = 400;
    throw error;
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
