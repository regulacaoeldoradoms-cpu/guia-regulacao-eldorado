'use strict';

import { PROMPT_ANALISE_REGULACAO_V1 } from './document-ai-prompts.js';
import {
  DocumentAiError,
  DOCUMENT_AI_EXTRACTION_FIELDS,
  TITON_GEMINI_DEFAULT_MODEL,
  documentAiGeminiEnabled,
  documentAiGeminiModel,
  documentAiProcessingEnabled,
  normalizeDocumentAiClassification,
  normalizeDocumentAiExtraction,
  normalizeDocumentAiPageNumber
} from './document-ai.js';
import { MAX_DOCUMENT_AI_IMAGE_BYTES } from './document-ai-provider.js';

const GEMINI_API_ORIGIN = 'https://generativelanguage.googleapis.com';
const GEMINI_API_VERSION = 'v1beta';
const GEMINI_TIMEOUT_MS = 25_000;
const GEMINI_MAX_OUTPUT_TOKENS = 1_500;

function normalizeMimeType(value) {
  const mimeType = String(value || '').split(';')[0].trim().toLowerCase();
  if (!['image/jpeg', 'image/png'].includes(mimeType)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_IMAGE_TYPE_INVALID',
      'Formato de imagem de página não autorizado.',
      415
    );
  }
  return mimeType;
}

function normalizeImageBytes(value) {
  const bytes = value instanceof Uint8Array
    ? value
    : value instanceof ArrayBuffer
      ? new Uint8Array(value)
      : null;
  if (!bytes?.byteLength) {
    throw new DocumentAiError('DOCUMENT_AI_IMAGE_EMPTY', 'Imagem de página vazia.', 400);
  }
  if (bytes.byteLength > MAX_DOCUMENT_AI_IMAGE_BYTES) {
    throw new DocumentAiError(
      'DOCUMENT_AI_IMAGE_TOO_LARGE',
      'Imagem de página maior do que o limite da IA documental.',
      413
    );
  }
  return bytes;
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, Math.min(bytes.length, offset + chunkSize)));
  }
  return btoa(binary);
}

function fieldSchema() {
  return {
    type: 'object',
    properties: {
      state: {
        type: 'string',
        enum: ['encontrado', 'nao_consta', 'ilegivel']
      },
      value: { type: 'string' }
    },
    required: ['state', 'value'],
    additionalProperties: false
  };
}

function exactFieldsSchema(pageType) {
  const keys = DOCUMENT_AI_EXTRACTION_FIELDS[pageType] || [];
  return {
    type: 'object',
    properties: Object.fromEntries(keys.map((key) => [key, fieldSchema()])),
    required: [...keys],
    additionalProperties: false
  };
}

export function titonGeminiResponseJsonSchema() {
  return {
    type: 'object',
    properties: {
      pageType: {
        type: 'string',
        enum: ['comprovante_atendimento', 'pagina_medica_autorizada', 'outro']
      },
      fields: {
        anyOf: [
          exactFieldsSchema('comprovante_atendimento'),
          exactFieldsSchema('pagina_medica_autorizada'),
          {
            type: 'object',
            properties: {},
            additionalProperties: false
          }
        ]
      }
    },
    required: ['pageType', 'fields'],
    additionalProperties: false
  };
}

function geminiThinkingConfig(model) {
  return String(model || '') === 'gemini-3.8-flash'
    ? { thinkingLevel: 'LOW' }
    : { thinkingLevel: 'MINIMAL' };
}

function requireGemini(env = {}) {
  if (!documentAiProcessingEnabled(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROCESSING_DISABLED',
      'O processamento da IA documental está desabilitado.',
      503
    );
  }
  if (!documentAiGeminiEnabled(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_GEMINI_DISABLED',
      'O Gemini não está habilitado como IA documental neste ambiente.',
      503
    );
  }
  const apiKey = String(env.TITON_GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    throw new DocumentAiError(
      'DOCUMENT_AI_GEMINI_NOT_CONFIGURED',
      'A credencial do Gemini não está configurada no backend.',
      503
    );
  }
  const model = documentAiGeminiModel(env);
  if (!model) {
    throw new DocumentAiError(
      'DOCUMENT_AI_GEMINI_MODEL_INVALID',
      'O modelo Gemini configurado não está na lista aprovada do Titon.',
      503
    );
  }
  return { apiKey, model };
}

function responseText(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .filter((part) => part && part.thought !== true && typeof part.text === 'string')
    .map((part) => part.text)
    .join('')
    .trim();
}

function parseResponseJson(payload) {
  const text = responseText(payload);
  if (!text) {
    const blockReason = String(payload?.promptFeedback?.blockReason || '');
    throw new DocumentAiError(
      blockReason ? 'DOCUMENT_AI_GEMINI_BLOCKED' : 'DOCUMENT_AI_GEMINI_INVALID_RESPONSE',
      blockReason
        ? 'O Gemini bloqueou esta página antes da extração.'
        : 'O Gemini não retornou uma resposta estruturada.',
      502
    );
  }
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape');
    return parsed;
  } catch (_) {
    throw new DocumentAiError(
      'DOCUMENT_AI_GEMINI_INVALID_RESPONSE',
      'O Gemini retornou JSON inválido.',
      502
    );
  }
}

function usageMetadata(payload) {
  const usage = payload?.usageMetadata;
  if (!usage || typeof usage !== 'object' || Array.isArray(usage)) return null;
  const number = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : 0;
  };
  return {
    promptTokens: number(usage.promptTokenCount),
    completionTokens: number(usage.candidatesTokenCount),
    thinkingTokens: number(usage.thoughtsTokenCount),
    totalTokens: number(usage.totalTokenCount)
  };
}

function providerError(status, payload) {
  const code = Number(status || 0);
  const providerStatus = String(payload?.error?.status || '');
  if (code === 429) {
    return new DocumentAiError(
      'DOCUMENT_AI_GEMINI_QUOTA',
      'O Gemini atingiu um limite temporário de uso.',
      429
    );
  }
  if (code === 401 || code === 403) {
    return new DocumentAiError(
      'DOCUMENT_AI_GEMINI_AUTH',
      'O Gemini recusou a credencial configurada no backend.',
      503
    );
  }
  if (code === 404) {
    return new DocumentAiError(
      'DOCUMENT_AI_GEMINI_MODEL_UNAVAILABLE',
      'O modelo Gemini configurado não está disponível para este projeto.',
      503
    );
  }
  if (code === 400) {
    const providerMessage = String(payload?.error?.message || '');
    const detail = /thinkingLevel/i.test(providerMessage)
      ? ' (nível de raciocínio)'
      : /mimeType|responseFormat/i.test(providerMessage)
        ? ' (formato de resposta)'
        : /schema/i.test(providerMessage)
          ? ' (schema estruturado)'
          : '';
    return new DocumentAiError(
      'DOCUMENT_AI_GEMINI_REQUEST_INVALID',
      `O Gemini recusou a estrutura da solicitação${detail}.`,
      502
    );
  }
  if (code >= 500 || /UNAVAILABLE|INTERNAL|DEADLINE_EXCEEDED/i.test(providerStatus)) {
    return new DocumentAiError(
      'DOCUMENT_AI_GEMINI_UNAVAILABLE',
      'O Gemini está temporariamente indisponível.',
      503
    );
  }
  return new DocumentAiError(
    'DOCUMENT_AI_GEMINI_ERROR',
    'O Gemini não concluiu a extração desta página.',
    502
  );
}

function normalizeGeminiResult(parsed, pageNumber) {
  const pageType = String(parsed?.pageType || '').trim();
  const classification = normalizeDocumentAiClassification({ pageNumber, pageType });

  if (classification.pageType === 'outro') {
    const fields = parsed?.fields;
    if (
      fields != null
      && (
        typeof fields !== 'object'
        || Array.isArray(fields)
        || Object.keys(fields).length > 0
      )
    ) {
      throw new DocumentAiError(
        'DOCUMENT_AI_GEMINI_SCHEMA_INVALID',
        'Página não autorizada retornou campos indevidos.',
        502
      );
    }
    return { classification, extraction: null };
  }

  const extraction = normalizeDocumentAiExtraction({
    pageNumber,
    pageType: classification.pageType,
    fields: parsed?.fields
  }, {
    pageNumber,
    pageType: classification.pageType
  });

  return { classification, extraction };
}

export async function analyzeDocumentAiPageWithGemini(env, input = {}, options = {}) {
  const { apiKey, model } = requireGemini(env);
  const pageNumber = normalizeDocumentAiPageNumber(input.pageNumber);
  const mimeType = normalizeMimeType(input.mimeType);
  const bytes = normalizeImageBytes(input.bytes);
  const fetcher = options.fetcher || fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('timeout'), GEMINI_TIMEOUT_MS);
  const started = Date.now();

  const prompt = [
    'Analise somente esta página.',
    'Classifique e extraia em uma única resposta.',
    'Use exatamente o JSON definido pelo schema de resposta.',
    'Não inclua pageNumber; a proveniência é aplicada pelo backend.',
    'Não explique o resultado fora do JSON.'
  ].join('\n');

  const body = {
    systemInstruction: {
      parts: [{ text: PROMPT_ANALISE_REGULACAO_V1.system }]
    },
    contents: [{
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType,
            data: bytesToBase64(bytes)
          }
        },
        { text: prompt }
      ]
    }],
    generationConfig: {
      maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
      thinkingConfig: geminiThinkingConfig(model),
      responseFormat: {
        text: {
          mimeType: 'APPLICATION_JSON',
          schema: titonGeminiResponseJsonSchema()
        }
      }
    }
  };

  let response;
  let payload = {};
  try {
    response = await fetcher(
      `${GEMINI_API_ORIGIN}/${GEMINI_API_VERSION}/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(body),
        cache: 'no-store',
        signal: controller.signal
      }
    );
    payload = await response.json().catch(() => ({}));
  } catch (error) {
    if (controller.signal.aborted || error?.name === 'AbortError') {
      throw new DocumentAiError(
        'DOCUMENT_AI_GEMINI_TIMEOUT',
        'O Gemini excedeu o tempo máximo desta tentativa.',
        504
      );
    }
    throw new DocumentAiError(
      'DOCUMENT_AI_GEMINI_NETWORK',
      'Falha de rede ao consultar o Gemini.',
      502
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response?.ok) throw providerError(response?.status, payload);

  const parsed = parseResponseJson(payload);
  const normalized = normalizeGeminiResult(parsed, pageNumber);

  return {
    ...normalized,
    provider: {
      kind: 'google-gemini-api',
      model,
      durationMs: Math.max(0, Date.now() - started),
      usage: usageMetadata(payload)
    },
    routine: {
      id: PROMPT_ANALISE_REGULACAO_V1.id,
      version: PROMPT_ANALISE_REGULACAO_V1.version
    }
  };
}

export const TITON_GEMINI_COMPARISON = Object.freeze({
  defaultModel: TITON_GEMINI_DEFAULT_MODEL,
  timeoutMs: GEMINI_TIMEOUT_MS,
  maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS
});
