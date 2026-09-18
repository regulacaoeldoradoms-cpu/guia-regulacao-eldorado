'use strict';

import {
  PROMPT_CLASSIFICACAO_PAGINAS_V1,
  PROMPT_EXTRACAO_REGULACAO_V1,
  PROMPT_DOCUMENT_CHAT_V1
} from './document-ai-prompts.js';
import {
  DocumentAiError,
  DOCUMENT_AI_EXTRACTION_FIELDS,
  documentAiProcessingEnabled,
  normalizeDocumentAiClassification,
  normalizeDocumentAiExtraction,
  normalizeDocumentAiPageNumber,
  normalizeDocumentAiQuestion,
  normalizeDocumentAiEvidence,
  normalizeDocumentAiChatResponse
} from './document-ai.js';

export const MAX_DOCUMENT_AI_IMAGE_BYTES = 3 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 12000;

function boundedInteger(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, Math.min(bytes.length, offset + chunkSize)));
  }
  return btoa(binary);
}

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

function candidateText(payload) {
  return String(
    payload?.candidates?.[0]?.content?.parts
      ?.map((part) => typeof part?.text === 'string' ? part.text : '')
      .join('') || ''
  ).trim();
}

function parseJsonCandidate(text) {
  const cleaned = String(text || '')
    .replace(/^\s*\`\`\`(?:json)?\s*/i, '')
    .replace(/\s*\`\`\`\s*$/i, '')
    .trim();
  if (!cleaned) {
    throw new DocumentAiError(
      'DOCUMENT_AI_EMPTY_RESPONSE',
      'A IA documental não retornou classificação.',
      502
    );
  }
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    throw new DocumentAiError(
      'DOCUMENT_AI_INVALID_RESPONSE',
      'A IA documental retornou classificação inválida.',
      502
    );
  }
}

export async function classifyDocumentAiPage(env, input = {}, options = {}) {
  if (!documentAiProcessingEnabled(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROCESSING_DISABLED',
      'O processamento da IA documental está desabilitado.',
      503
    );
  }
  if (!env.GEMINI_API_KEY) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_NOT_CONFIGURED',
      'O provedor da IA documental não está configurado.',
      503
    );
  }

  const pageNumber = normalizeDocumentAiPageNumber(input.pageNumber);
  const mimeType = normalizeMimeType(input.mimeType);
  const bytes = normalizeImageBytes(input.bytes);
  const model = String(env.DOCUMENTS_AI_MODEL || env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();
  const timeoutMs = boundedInteger(env.DOCUMENTS_AI_TIMEOUT_MS, DEFAULT_TIMEOUT_MS, 2000, 30000);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const fetchImpl = options.fetchImpl || fetch;
  const signal = options.signal || AbortSignal.timeout(timeoutMs);

  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: PROMPT_CLASSIFICACAO_PAGINAS_V1.system }]
        },
        contents: [{
          role: 'user',
          parts: [
            { text: `Número técnico da página: ${pageNumber}. Classifique somente esta página.` },
            {
              inlineData: {
                mimeType,
                data: bytesToBase64(bytes)
              }
            }
          ]
        }],
        generationConfig: {
          maxOutputTokens: 180,
          responseMimeType: 'application/json'
        }
      })
    });
  } catch (cause) {
    const timedOut = signal?.aborted || ['AbortError', 'TimeoutError'].includes(cause?.name);
    throw new DocumentAiError(
      timedOut ? 'DOCUMENT_AI_PROVIDER_TIMEOUT' : 'DOCUMENT_AI_PROVIDER_NETWORK_ERROR',
      timedOut
        ? 'A classificação da página excedeu o tempo seguro desta tentativa.'
        : 'Não foi possível acessar o provedor da IA documental nesta tentativa.',
      timedOut ? 504 : 502
    );
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_HTTP_ERROR',
      'O provedor da IA documental não concluiu a classificação nesta tentativa.',
      [408, 429, 500, 502, 503, 504].includes(response.status) ? response.status : 502
    );
  }

  const parsed = parseJsonCandidate(candidateText(payload));
  const classification = normalizeDocumentAiClassification(parsed);
  if (classification.pageNumber !== pageNumber) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PAGE_PROVENANCE_MISMATCH',
      'A classificação perdeu a proveniência da página.',
      502
    );
  }

  return {
    classification,
    routine: {
      id: PROMPT_CLASSIFICACAO_PAGINAS_V1.id,
      version: PROMPT_CLASSIFICACAO_PAGINAS_V1.version
    }
  };
}


function extractionTemplate(pageType) {
  const keys = DOCUMENT_AI_EXTRACTION_FIELDS[pageType];
  if (!keys) {
    throw new DocumentAiError(
      'DOCUMENT_AI_EXTRACTION_TYPE_INVALID',
      'Esta página não possui rotina de extração autorizada.',
      422
    );
  }
  return {
    pageNumber: 0,
    pageType,
    fields: Object.fromEntries(keys.map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ]))
  };
}

export async function extractDocumentAiPage(env, input = {}, options = {}) {
  if (!documentAiProcessingEnabled(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROCESSING_DISABLED',
      'O processamento da IA documental está desabilitado.',
      503
    );
  }
  if (!env.GEMINI_API_KEY) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_NOT_CONFIGURED',
      'O provedor da IA documental não está configurado.',
      503
    );
  }

  const pageNumber = normalizeDocumentAiPageNumber(input.pageNumber);
  const pageType = String(input.pageType || '').trim();
  const template = extractionTemplate(pageType);
  template.pageNumber = pageNumber;
  const mimeType = normalizeMimeType(input.mimeType);
  const bytes = normalizeImageBytes(input.bytes);
  const model = String(env.DOCUMENTS_AI_MODEL || env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();
  const timeoutMs = boundedInteger(env.DOCUMENTS_AI_TIMEOUT_MS, DEFAULT_TIMEOUT_MS, 2000, 30000);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const fetchImpl = options.fetchImpl || fetch;
  const signal = options.signal || AbortSignal.timeout(timeoutMs);

  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: PROMPT_EXTRACAO_REGULACAO_V1.system }]
        },
        contents: [{
          role: 'user',
          parts: [
            {
              text: [
                `Número técnico da página: ${pageNumber}.`,
                `Tipo autorizado: ${pageType}.`,
                'Retorne TODOS os campos deste schema, sem adicionar outros:',
                JSON.stringify(template)
              ].join('\n')
            },
            {
              inlineData: {
                mimeType,
                data: bytesToBase64(bytes)
              }
            }
          ]
        }],
        generationConfig: {
          maxOutputTokens: 1800,
          responseMimeType: 'application/json'
        }
      })
    });
  } catch (cause) {
    const timedOut = signal?.aborted || ['AbortError', 'TimeoutError'].includes(cause?.name);
    throw new DocumentAiError(
      timedOut ? 'DOCUMENT_AI_PROVIDER_TIMEOUT' : 'DOCUMENT_AI_PROVIDER_NETWORK_ERROR',
      timedOut
        ? 'A extração da página excedeu o tempo seguro desta tentativa.'
        : 'Não foi possível acessar o provedor da IA documental nesta tentativa.',
      timedOut ? 504 : 502
    );
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_HTTP_ERROR',
      'O provedor da IA documental não concluiu a extração nesta tentativa.',
      [408, 429, 500, 502, 503, 504].includes(response.status) ? response.status : 502
    );
  }

  const parsed = parseJsonCandidate(candidateText(payload));
  const extraction = normalizeDocumentAiExtraction(parsed, { pageNumber, pageType });
  return {
    extraction,
    routine: {
      id: PROMPT_EXTRACAO_REGULACAO_V1.id,
      version: PROMPT_EXTRACAO_REGULACAO_V1.version
    }
  };
}

export async function classifyAndExtractDocumentAiPage(env, input = {}, options = {}) {
  const classified = await classifyDocumentAiPage(env, input, options);
  const pageType = classified.classification.pageType;
  if (!DOCUMENT_AI_EXTRACTION_FIELDS[pageType]) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PAGE_NOT_AUTHORIZED',
      'Esta página não foi classificada para extração institucional.',
      422
    );
  }

  const extracted = await extractDocumentAiPage(env, {
    ...input,
    pageType
  }, options);

  return {
    classification: classified.classification,
    extraction: extracted.extraction,
    routines: {
      classification: classified.routine,
      extraction: extracted.routine
    }
  };
}


export async function chatDocumentAi(env, input = {}, options = {}) {
  if (!documentAiProcessingEnabled(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROCESSING_DISABLED',
      'O processamento da IA documental está desabilitado.',
      503
    );
  }
  if (!env.GEMINI_API_KEY) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_NOT_CONFIGURED',
      'O provedor da IA documental não está configurado.',
      503
    );
  }

  const question = normalizeDocumentAiQuestion(input.question);
  const evidence = normalizeDocumentAiEvidence(input.evidence);
  const model = String(env.DOCUMENTS_AI_MODEL || env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();
  const timeoutMs = boundedInteger(env.DOCUMENTS_AI_TIMEOUT_MS, DEFAULT_TIMEOUT_MS, 2000, 30000);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const fetchImpl = options.fetchImpl || fetch;
  const signal = options.signal || AbortSignal.timeout(timeoutMs);

  const evidencePayload = evidence.map((item) => ({
    pageNumber: item.pageNumber,
    pageType: item.pageType,
    fields: item.fields
  }));

  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: PROMPT_DOCUMENT_CHAT_V1.system }]
        },
        contents: [{
          role: 'user',
          parts: [{
            text: [
              `PERGUNTA: ${question}`,
              '',
              'EVIDÊNCIAS ESTRUTURADAS POR PÁGINA:',
              JSON.stringify(evidencePayload),
              '',
              'Responda JSON no formato {"answer":"texto com [p. N]","pages":[N]}.',
              'Se não constar, use exatamente {"answer":"NÃO CONSTA","pages":[]}.',
              'Se a evidência pertinente estiver ilegível, use exatamente {"answer":"ILEGÍVEL","pages":[]}.'
            ].join('\n')
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1200,
          responseMimeType: 'application/json'
        }
      })
    });
  } catch (cause) {
    const timedOut = signal?.aborted || ['AbortError', 'TimeoutError'].includes(cause?.name);
    throw new DocumentAiError(
      timedOut ? 'DOCUMENT_AI_PROVIDER_TIMEOUT' : 'DOCUMENT_AI_PROVIDER_NETWORK_ERROR',
      timedOut
        ? 'A pergunta documental excedeu o tempo seguro desta tentativa.'
        : 'Não foi possível acessar o provedor da IA documental nesta tentativa.',
      timedOut ? 504 : 502
    );
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_HTTP_ERROR',
      'O provedor da IA documental não concluiu a pergunta nesta tentativa.',
      [408, 429, 500, 502, 503, 504].includes(response.status) ? response.status : 502
    );
  }

  const parsed = parseJsonCandidate(candidateText(payload));
  const chat = normalizeDocumentAiChatResponse(parsed, evidence);
  return {
    chat,
    routine: {
      id: PROMPT_DOCUMENT_CHAT_V1.id,
      version: PROMPT_DOCUMENT_CHAT_V1.version
    }
  };
}
