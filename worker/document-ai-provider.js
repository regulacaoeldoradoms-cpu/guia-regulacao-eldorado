'use strict';

import {
  PROMPT_ANALISE_REGULACAO_V1,
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
export const DOCUMENT_AI_PRIMARY_FREE_MODEL = '@cf/google/gemma-4-26b-a4b-it';
export const DOCUMENT_AI_FALLBACK_FREE_MODEL = '@cf/qwen/qwen3.8-27b';
export const DOCUMENT_AI_FREE_MODELS = Object.freeze([
  DOCUMENT_AI_PRIMARY_FREE_MODEL,
  DOCUMENT_AI_FALLBACK_FREE_MODEL
]);

const DEFAULT_REQUEST_TIMEOUT_MS = 6000;
const DEFAULT_TOTAL_TIMEOUT_MS = 10000;
const FREE_MODEL_SET = new Set(DOCUMENT_AI_FREE_MODELS);
const TRANSIENT_CODES = new Set([
  'DOCUMENT_AI_PROVIDER_TIMEOUT',
  'DOCUMENT_AI_PROVIDER_NETWORK_ERROR',
  'DOCUMENT_AI_PROVIDER_INVALID_RESPONSE',
  'DOCUMENT_AI_PROVIDER_SCHEMA_INVALID',
  'DOCUMENT_AI_PROVIDER_UNAVAILABLE'
]);

function boundedInteger(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
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

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, Math.min(bytes.length, offset + chunkSize)));
  }
  return btoa(binary);
}

function dataUri(bytes, mimeType) {
  return `data:${mimeType};base64,${bytesToBase64(bytes)}`;
}

function contentText(value) {
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return '';
  return value.map((part) => (
    typeof part === 'string'
      ? part
      : typeof part?.text === 'string'
        ? part.text
        : ''
  )).join('');
}

function candidateValue(payload) {
  if (payload && typeof payload.response === 'object' && !Array.isArray(payload.response)) {
    return payload.response;
  }
  if (typeof payload?.response === 'string') return payload.response;
  if (payload && typeof payload.result === 'object' && !Array.isArray(payload.result)) {
    return payload.result;
  }
  if (typeof payload?.result === 'string') return payload.result;

  const choiceContent = payload?.choices?.[0]?.message?.content;
  const choiceText = contentText(choiceContent);
  if (choiceText) return choiceText;

  const text = String(payload?.text || '').trim();
  if (text) return text;
  return '';
}

function parseJsonCandidate(payload) {
  const candidate = candidateValue(payload);
  if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) return candidate;

  const cleaned = String(candidate || '')
    .replace(/^\s*\`\`\`(?:json)?\s*/i, '')
    .replace(/\s*\`\`\`\s*$/i, '')
    .trim();

  if (!cleaned) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_INVALID_RESPONSE',
      'A IA documental não retornou JSON válido.',
      502
    );
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error('shape');
    return parsed;
  } catch (_) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_INVALID_RESPONSE',
      'A IA documental não retornou JSON válido.',
      502
    );
  }
}

function freeOnly(env = {}) {
  const value = String(env.DOCUMENTS_AI_FREE_ONLY ?? 'true').trim().toLowerCase();
  return value === 'true';
}

function parseModelList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function documentAiFreeModelSequence(env = {}) {
  if (!freeOnly(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_FREE_ONLY_REQUIRED',
      'O Titon está configurado para usar somente modelos dentro da política sem cobrança.',
      503
    );
  }

  const configuredPrimary = String(
    env.DOCUMENTS_AI_PRIMARY_MODEL || DOCUMENT_AI_PRIMARY_FREE_MODEL
  ).trim();
  const configuredFallbacks = parseModelList(
    env.DOCUMENTS_AI_FALLBACK_MODELS || DOCUMENT_AI_FALLBACK_FREE_MODEL
  );

  const requested = [configuredPrimary, ...configuredFallbacks];
  if (requested.some((model) => !FREE_MODEL_SET.has(model))) {
    throw new DocumentAiError(
      'DOCUMENT_AI_NON_FREE_MODEL_BLOCKED',
      'Modelo fora da lista gratuita aprovada do Titon.',
      503
    );
  }

  return [...new Set(requested)];
}

function requireWorkersAi(env = {}) {
  if (!env.AI || typeof env.AI.run !== 'function') {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROVIDER_NOT_CONFIGURED',
      'Workers AI não está disponível neste ambiente.',
      503
    );
  }
}

function errorText(error) {
  return [
    error?.message,
    error?.cause?.message,
    error?.stack
  ].filter(Boolean).join(' ').slice(0, 5000);
}

function isFreeLimitError(error) {
  return /(?:\b3036\b|daily free allocation|10,?000 neurons|account limited)/i.test(errorText(error));
}

function isPaidModelError(error) {
  return /(?:\b5035\b|requires (?:a )?workers paid plan|paid billing method|prepaid ai gateway)/i.test(errorText(error));
}

function normalizeProviderError(error, operation) {
  if (error instanceof DocumentAiError) return error;
  if (isFreeLimitError(error)) {
    return new DocumentAiError(
      'DOCUMENT_AI_FREE_LIMIT_REACHED',
      'Limite gratuito diário da IA atingido. Tente novamente após a renovação da franquia.',
      429
    );
  }
  if (isPaidModelError(error)) {
    return new DocumentAiError(
      'DOCUMENT_AI_PAID_MODEL_BLOCKED',
      'O Titon recusou um modelo que exige faturamento.',
      503
    );
  }

  const name = String(error?.name || '');
  const timedOut = ['AbortError', 'TimeoutError'].includes(name)
    || /timeout|timed out|request timeout|\b3007\b|\b3008\b/i.test(errorText(error));
  return new DocumentAiError(
    timedOut ? 'DOCUMENT_AI_PROVIDER_TIMEOUT' : 'DOCUMENT_AI_PROVIDER_UNAVAILABLE',
    timedOut
      ? `A ${operation} excedeu o tempo seguro desta tentativa.`
      : 'Workers AI não concluiu esta tentativa.',
    timedOut ? 504 : 502
  );
}

function providerTimeouts(env = {}) {
  return {
    request: boundedInteger(
      env.DOCUMENTS_AI_TIMEOUT_MS,
      DEFAULT_REQUEST_TIMEOUT_MS,
      2000,
      12000
    ),
    total: boundedInteger(
      env.DOCUMENTS_AI_TOTAL_TIMEOUT_MS,
      DEFAULT_TOTAL_TIMEOUT_MS,
      3000,
      20000
    )
  };
}

function visionInput(system, prompt, image, maxTokens = 1800) {
  return {
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt }
    ],
    image,
    temperature: 0,
    top_p: 0.1,
    seed: 1,
    max_tokens: maxTokens,
    store: false
  };
}

function textInput(system, prompt, maxTokens = 1200) {
  return {
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt }
    ],
    temperature: 0,
    top_p: 0.1,
    seed: 1,
    max_tokens: maxTokens,
    store: false
  };
}

async function withLocalTimeout(promise, timeoutMs, operation) {
  let timer = null;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new DocumentAiError(
            'DOCUMENT_AI_PROVIDER_LOCAL_TIMEOUT',
            `A ${operation} excedeu o limite local de tempo desta tentativa.`,
            504
          ));
        }, timeoutMs);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function runWorkersAi(env, makeInput, validate, options = {}, operation = 'extração') {
  requireWorkersAi(env);
  const models = documentAiFreeModelSequence(env);
  const timeouts = providerTimeouts(env);
  const started = Date.now();
  const run = options.aiRun || ((model, input, runOptions) => env.AI.run(model, input, runOptions));
  let lastError = null;

  for (const model of models) {
    const remaining = timeouts.total - (Date.now() - started);
    if (remaining <= 0) break;
    const timeoutMs = Math.max(1000, Math.min(timeouts.request, remaining));

    try {
      const payload = await withLocalTimeout(
        run(model, makeInput(model), { rejectIfBusy: true }),
        timeoutMs,
        operation
      );
      const parsed = parseJsonCandidate(payload);
      const value = validate(parsed);
      return { value, model };
    } catch (error) {
      const normalized = normalizeProviderError(error, operation);
      if (
        normalized.code === 'DOCUMENT_AI_FREE_LIMIT_REACHED'
        || normalized.code === 'DOCUMENT_AI_PAID_MODEL_BLOCKED'
        || normalized.code === 'DOCUMENT_AI_FREE_ONLY_REQUIRED'
        || normalized.code === 'DOCUMENT_AI_NON_FREE_MODEL_BLOCKED'
        || normalized.code === 'DOCUMENT_AI_PROVIDER_LOCAL_TIMEOUT'
      ) {
        throw normalized;
      }

      lastError = normalized;
      if (
        normalized instanceof DocumentAiError
        && !TRANSIENT_CODES.has(normalized.code)
        && ![
          'DOCUMENT_AI_PAGE_TYPE_INVALID',
          'DOCUMENT_AI_FIELDS_INVALID',
          'DOCUMENT_AI_FIELDS_UNEXPECTED',
          'DOCUMENT_AI_FIELD_MISSING',
          'DOCUMENT_AI_FIELD_STATE_INVALID',
          'DOCUMENT_AI_FIELD_VALUE_REQUIRED',
          'DOCUMENT_AI_CHAT_ANSWER_INVALID',
          'DOCUMENT_AI_CHAT_PROVENANCE_MISMATCH',
          'DOCUMENT_AI_CHAT_PROVENANCE_REQUIRED'
        ].includes(normalized.code)
      ) {
        throw normalized;
      }
      // Próximo modelo aprovado funciona como fallback somente da mesma operação.
    }
  }

  if (lastError) throw lastError;
  throw new DocumentAiError(
    'DOCUMENT_AI_PROVIDER_TIMEOUT',
    `A ${operation} excedeu o tempo total permitido.`,
    504
  );
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
    fields: Object.fromEntries(keys.map((key) => [
      key,
      { state: 'nao_consta', value: '' }
    ]))
  };
}

function analysisTemplate() {
  return {
    pageType: 'comprovante_atendimento | pagina_medica_autorizada | outro',
    fields: {
      observacao: 'Para outro, use {}. Para página autorizada, use exatamente o schema do tipo.'
    }
  };
}

export async function analyzeDocumentAiPage(env, input = {}, options = {}) {
  if (!documentAiProcessingEnabled(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROCESSING_DISABLED',
      'O processamento da IA documental está desabilitado.',
      503
    );
  }

  const pageNumber = normalizeDocumentAiPageNumber(input.pageNumber);
  const mimeType = normalizeMimeType(input.mimeType);
  const bytes = normalizeImageBytes(input.bytes);
  const image = dataUri(bytes, mimeType);

  const prompt = [
    'Analise somente esta página.',
    'Retorne JSON no formato exato:',
    JSON.stringify(analysisTemplate()),
    '',
    'Schemas de fields permitidos:',
    'comprovante_atendimento:',
    JSON.stringify(extractionTemplate('comprovante_atendimento')),
    'pagina_medica_autorizada:',
    JSON.stringify(extractionTemplate('pagina_medica_autorizada')),
    'outro: {}'
  ].join('\n');

  const result = await runWorkersAi(
    env,
    () => visionInput(PROMPT_ANALISE_REGULACAO_V1.system, prompt, image, 1700),
    (parsed) => {
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
            'DOCUMENT_AI_PROVIDER_SCHEMA_INVALID',
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
    },
    options,
    'análise da página'
  );

  return {
    ...result.value,
    provider: { kind: 'workers-ai', model: result.model },
    routines: {
      analysis: {
        id: PROMPT_ANALISE_REGULACAO_V1.id,
        version: PROMPT_ANALISE_REGULACAO_V1.version
      }
    }
  };
}

export async function classifyDocumentAiPage(env, input = {}, options = {}) {
  if (!documentAiProcessingEnabled(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROCESSING_DISABLED',
      'O processamento da IA documental está desabilitado.',
      503
    );
  }

  const pageNumber = normalizeDocumentAiPageNumber(input.pageNumber);
  const mimeType = normalizeMimeType(input.mimeType);
  const bytes = normalizeImageBytes(input.bytes);
  const image = dataUri(bytes, mimeType);

  const result = await runWorkersAi(
    env,
    () => visionInput(
      PROMPT_CLASSIFICACAO_PAGINAS_V1.system,
      'Classifique somente esta página. Retorne JSON apenas como {"pageType":"..."}.',
      image,
      180
    ),
    (parsed) => normalizeDocumentAiClassification({
      pageNumber,
      pageType: String(parsed?.pageType || '')
    }),
    options,
    'classificação da página'
  );

  return {
    classification: result.value,
    provider: { kind: 'workers-ai', model: result.model },
    routine: {
      id: PROMPT_CLASSIFICACAO_PAGINAS_V1.id,
      version: PROMPT_CLASSIFICACAO_PAGINAS_V1.version
    }
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

  const pageNumber = normalizeDocumentAiPageNumber(input.pageNumber);
  const pageType = String(input.pageType || '').trim();
  const template = extractionTemplate(pageType);
  const mimeType = normalizeMimeType(input.mimeType);
  const bytes = normalizeImageBytes(input.bytes);
  const image = dataUri(bytes, mimeType);

  const prompt = [
    `Tipo autorizado: ${pageType}.`,
    'Retorne SOMENTE JSON com o objeto fields abaixo, contendo todos os campos:',
    JSON.stringify(template)
  ].join('\n');

  const result = await runWorkersAi(
    env,
    () => visionInput(PROMPT_EXTRACAO_REGULACAO_V1.system, prompt, image, 1600),
    (parsed) => normalizeDocumentAiExtraction({
      pageNumber,
      pageType,
      fields: parsed?.fields
    }, { pageNumber, pageType }),
    options,
    'extração da página'
  );

  return {
    extraction: result.value,
    provider: { kind: 'workers-ai', model: result.model },
    routine: {
      id: PROMPT_EXTRACAO_REGULACAO_V1.id,
      version: PROMPT_EXTRACAO_REGULACAO_V1.version
    }
  };
}

export async function classifyAndExtractDocumentAiPage(env, input = {}, options = {}) {
  return analyzeDocumentAiPage(env, input, options);
}

export async function chatDocumentAi(env, input = {}, options = {}) {
  if (!documentAiProcessingEnabled(env)) {
    throw new DocumentAiError(
      'DOCUMENT_AI_PROCESSING_DISABLED',
      'O processamento da IA documental está desabilitado.',
      503
    );
  }

  const question = normalizeDocumentAiQuestion(input.question);
  const evidence = normalizeDocumentAiEvidence(input.evidence);
  const evidencePayload = evidence.map((item) => ({
    pageNumber: item.pageNumber,
    pageType: item.pageType,
    fields: item.fields
  }));

  const prompt = [
    `PERGUNTA: ${question}`,
    '',
    'EVIDÊNCIAS ESTRUTURADAS POR PÁGINA:',
    JSON.stringify(evidencePayload),
    '',
    'Responda SOMENTE JSON no formato {"answer":"texto com [p. N]","pages":[N]}.',
    'Se não constar, use exatamente {"answer":"NÃO CONSTA","pages":[]}.',
    'Se a evidência pertinente estiver ilegível, use exatamente {"answer":"ILEGÍVEL","pages":[]}.'
  ].join('\n');

  const result = await runWorkersAi(
    env,
    () => textInput(PROMPT_DOCUMENT_CHAT_V1.system, prompt, 1000),
    (parsed) => normalizeDocumentAiChatResponse(parsed, evidence),
    options,
    'pergunta documental'
  );

  return {
    chat: result.value,
    provider: { kind: 'workers-ai', model: result.model },
    routine: {
      id: PROMPT_DOCUMENT_CHAT_V1.id,
      version: PROMPT_DOCUMENT_CHAT_V1.version
    }
  };
}
