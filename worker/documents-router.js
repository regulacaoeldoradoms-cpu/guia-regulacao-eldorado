'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import {
  hasDocumentCapability,
  setDocumentCapabilities
} from './document-access.js';
import {
  DocumentAiError,
  documentAiProcessingEnabled,
  documentAiPublicConfig,
  normalizeDocumentAiPageNumber
} from './document-ai.js';
import {
  MAX_DOCUMENT_AI_IMAGE_BYTES,
  classifyAndExtractDocumentAiPage,
  classifyDocumentAiPage,
  chatDocumentAi
} from './document-ai-provider.js';
import { analyzeDocumentAiPageWithGemini } from './document-ai-gemini.js';
import {
  DriveIntegrationError,
  cancelDriveSync,
  completeDriveOAuth,
  createDriveAuthorizationUrl,
  disconnectDrive,
  driveConnectionStatus,
  fetchDrivePdf,
  listDriveFolder,
  preflightDriveSync,
  queryDriveSyncStatus,
  renameDrivePdf,
  searchDrive,
  startDriveSync,
  uploadDriveSyncChunk
} from './document-drive.js';
import {
  heartbeatDocumentPresence,
  releaseDocumentPresence
} from './document-presence.js';

const API_PREFIX = '/api/documents/';
const OAUTH_CALLBACK = '/api/documents/oauth/callback';
const MAX_JSON_BODY_BYTES = 16 * 1024;
const MAX_DOCUMENT_AI_CHAT_BODY_BYTES = 64 * 1024;
const DEFAULT_EDITOR_COLOR_PALETTE = Object.freeze([
  '#000000', '#ffffff', '#e53935', '#1565c0', '#2e7d32', '#f9a825'
]);
const editorPreferencesSchemaReady = new WeakSet();
const editorPreferencesSchemaPromises = new WeakMap();
const viewerPreferencesSchemaReady = new WeakSet();
const viewerPreferencesSchemaPromises = new WeakMap();
const documentAiPreferencesSchemaReady = new WeakSet();
const documentAiPreferencesSchemaPromises = new WeakMap();
const DEFAULT_DOCUMENT_AI_FIELD_ORDER = Object.freeze([
  'nome_paciente', 'cns', 'cpf', 'data_nascimento', 'nome_mae', 'telefone', 'endereco', 'agente',
  'motivo_encaminhamento', 'cid', 'descricao_cid',
  'titulo', 'procedimento_solicitado', 'codigo_procedimento',
  'medico', 'crm_rms'
]);

function normalizeEditorColorPalette(value, { strict = false } = {}) {
  if (!Array.isArray(value)) {
    if (strict) throw new DriveIntegrationError('DOCUMENTS_EDITOR_PALETTE_INVALID', 'Paleta de cores inválida.', 400);
    return [...DEFAULT_EDITOR_COLOR_PALETTE];
  }
  if (strict && (value.length < 1 || value.length > 16)) {
    throw new DriveIntegrationError('DOCUMENTS_EDITOR_PALETTE_INVALID', 'A paleta deve ter entre 1 e 16 cores.', 400);
  }
  const colors = [];
  for (const item of value) {
    const color = String(item || '').trim().toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(color)) {
      if (strict) throw new DriveIntegrationError('DOCUMENTS_EDITOR_PALETTE_INVALID', 'Use cores no formato hexadecimal #RRGGBB.', 400);
      continue;
    }
    colors.push(color);
    if (colors.length >= 16) break;
  }
  if (!colors.length) {
    if (strict) throw new DriveIntegrationError('DOCUMENTS_EDITOR_PALETTE_INVALID', 'A paleta precisa ter ao menos uma cor válida.', 400);
    return [...DEFAULT_EDITOR_COLOR_PALETTE];
  }
  return colors;
}

async function ensureEditorPreferencesSchema(env) {
  const binding = env.AUTH_DB;
  if (!binding) return false;
  if (editorPreferencesSchemaReady.has(binding)) return true;
  if (editorPreferencesSchemaPromises.has(binding)) return editorPreferencesSchemaPromises.get(binding);

  const operation = (async () => {
    await binding.prepare(`CREATE TABLE IF NOT EXISTS auth_document_editor_preferences (
      username TEXT PRIMARY KEY,
      color_palette_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();
    editorPreferencesSchemaReady.add(binding);
    return true;
  })().catch((error) => {
    editorPreferencesSchemaReady.delete(binding);
    throw error;
  }).finally(() => {
    editorPreferencesSchemaPromises.delete(binding);
  });

  editorPreferencesSchemaPromises.set(binding, operation);
  return operation;
}

async function editorPreferencesFor(env, username) {
  if (!(await ensureEditorPreferencesSchema(env))) {
    return { colorPalette: [...DEFAULT_EDITOR_COLOR_PALETTE] };
  }
  const row = await env.AUTH_DB.prepare(
    'SELECT color_palette_json FROM auth_document_editor_preferences WHERE username = ? LIMIT 1'
  ).bind(String(username || '')).first();
  let palette = null;
  try { palette = JSON.parse(String(row?.color_palette_json || '')); } catch (_) {}
  return { colorPalette: normalizeEditorColorPalette(palette) };
}

async function setEditorPreferences(env, username, input = {}) {
  if (!(await ensureEditorPreferencesSchema(env))) {
    throw new DriveIntegrationError('DOCUMENTS_PREFERENCES_UNAVAILABLE', 'Preferências do editor indisponíveis.', 503);
  }
  const colorPalette = normalizeEditorColorPalette(input.colorPalette, { strict: true });
  await env.AUTH_DB.prepare(`INSERT INTO auth_document_editor_preferences(username, color_palette_json)
    VALUES (?, ?)
    ON CONFLICT(username) DO UPDATE SET
      color_palette_json = excluded.color_palette_json,
      updated_at = CURRENT_TIMESTAMP`)
    .bind(String(username || ''), JSON.stringify(colorPalette)).run();
  return { colorPalette };
}

const DEFAULT_VIEWER_ZOOM_SCALE = 1.14;
const MIN_VIEWER_ZOOM_SCALE = 0.45;
const MAX_VIEWER_ZOOM_SCALE = 3;

function normalizeViewerZoomScale(value, { strict = false } = {}) {
  if (value == null || value === '') {
    if (strict) throw new DriveIntegrationError('DOCUMENTS_VIEWER_ZOOM_INVALID', 'Zoom do visualizador inválido.', 400);
    return null;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    if (strict) throw new DriveIntegrationError('DOCUMENTS_VIEWER_ZOOM_INVALID', 'Zoom do visualizador inválido.', 400);
    return null;
  }
  if (strict && (numeric < MIN_VIEWER_ZOOM_SCALE || numeric > MAX_VIEWER_ZOOM_SCALE)) {
    throw new DriveIntegrationError('DOCUMENTS_VIEWER_ZOOM_INVALID', 'O zoom deve ficar entre 45% e 300%.', 400);
  }
  const clamped = Math.min(MAX_VIEWER_ZOOM_SCALE, Math.max(MIN_VIEWER_ZOOM_SCALE, numeric));
  return Math.round(clamped * 100) / 100;
}

async function ensureViewerPreferencesSchema(env) {
  const binding = env.AUTH_DB;
  if (!binding) return false;
  if (viewerPreferencesSchemaReady.has(binding)) return true;
  if (viewerPreferencesSchemaPromises.has(binding)) return viewerPreferencesSchemaPromises.get(binding);

  const operation = (async () => {
    await binding.prepare(`CREATE TABLE IF NOT EXISTS auth_document_viewer_preferences (
      username TEXT PRIMARY KEY,
      zoom_scale REAL NOT NULL DEFAULT 1.14,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();
    viewerPreferencesSchemaReady.add(binding);
    return true;
  })().catch((error) => {
    viewerPreferencesSchemaReady.delete(binding);
    throw error;
  }).finally(() => {
    viewerPreferencesSchemaPromises.delete(binding);
  });

  viewerPreferencesSchemaPromises.set(binding, operation);
  return operation;
}

async function viewerPreferencesFor(env, username) {
  if (!(await ensureViewerPreferencesSchema(env))) {
    return { viewerZoomScale: null };
  }
  const row = await env.AUTH_DB.prepare(
    'SELECT zoom_scale FROM auth_document_viewer_preferences WHERE username = ? LIMIT 1'
  ).bind(String(username || '')).first();
  return {
    viewerZoomScale: normalizeViewerZoomScale(row?.zoom_scale)
  };
}

async function setViewerPreferences(env, username, input = {}) {
  if (!(await ensureViewerPreferencesSchema(env))) {
    throw new DriveIntegrationError('DOCUMENTS_PREFERENCES_UNAVAILABLE', 'Preferências do visualizador indisponíveis.', 503);
  }
  const viewerZoomScale = normalizeViewerZoomScale(input.viewerZoomScale, { strict: true });
  await env.AUTH_DB.prepare(`INSERT INTO auth_document_viewer_preferences(username, zoom_scale)
    VALUES (?, ?)
    ON CONFLICT(username) DO UPDATE SET
      zoom_scale = excluded.zoom_scale,
      updated_at = CURRENT_TIMESTAMP`)
    .bind(String(username || ''), viewerZoomScale).run();
  return { viewerZoomScale };
}

function normalizeDocumentAiFieldOrder(value, { strict = false } = {}) {
  if (!Array.isArray(value)) {
    if (strict) throw new DriveIntegrationError('DOCUMENTS_AI_FIELD_ORDER_INVALID', 'Ordem dos campos inválida.', 400);
    return [...DEFAULT_DOCUMENT_AI_FIELD_ORDER];
  }
  const allowed = new Set(DEFAULT_DOCUMENT_AI_FIELD_ORDER);
  const seen = new Set();
  const normalized = [];
  for (const item of value) {
    const key = String(item || '');
    if (!allowed.has(key) || seen.has(key)) {
      if (strict) throw new DriveIntegrationError('DOCUMENTS_AI_FIELD_ORDER_INVALID', 'A ordem contém campo inválido ou repetido.', 400);
      continue;
    }
    seen.add(key);
    normalized.push(key);
  }
  if (strict && normalized.length !== DEFAULT_DOCUMENT_AI_FIELD_ORDER.length) {
    throw new DriveIntegrationError('DOCUMENTS_AI_FIELD_ORDER_INVALID', 'A ordem deve conter todos os tipos de campo permitidos.', 400);
  }
  for (const key of DEFAULT_DOCUMENT_AI_FIELD_ORDER) {
    if (!seen.has(key)) normalized.push(key);
  }
  return normalized;
}

async function ensureDocumentAiPreferencesSchema(env) {
  const binding = env.AUTH_DB;
  if (!binding) return false;
  if (documentAiPreferencesSchemaReady.has(binding)) return true;
  if (documentAiPreferencesSchemaPromises.has(binding)) return documentAiPreferencesSchemaPromises.get(binding);

  const operation = (async () => {
    await binding.prepare(`CREATE TABLE IF NOT EXISTS auth_document_ai_preferences (
      username TEXT PRIMARY KEY,
      field_order_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();
    documentAiPreferencesSchemaReady.add(binding);
    return true;
  })().catch((error) => {
    documentAiPreferencesSchemaReady.delete(binding);
    throw error;
  }).finally(() => {
    documentAiPreferencesSchemaPromises.delete(binding);
  });

  documentAiPreferencesSchemaPromises.set(binding, operation);
  return operation;
}

async function documentAiPreferencesFor(env, username) {
  if (!(await ensureDocumentAiPreferencesSchema(env))) {
    return { fieldOrder: [...DEFAULT_DOCUMENT_AI_FIELD_ORDER] };
  }
  const row = await env.AUTH_DB.prepare(
    'SELECT field_order_json FROM auth_document_ai_preferences WHERE username = ? LIMIT 1'
  ).bind(String(username || '')).first();
  let fieldOrder = null;
  try { fieldOrder = JSON.parse(String(row?.field_order_json || '')); } catch (_) {}
  return { fieldOrder: normalizeDocumentAiFieldOrder(fieldOrder) };
}

async function setDocumentAiPreferences(env, username, input = {}) {
  if (!(await ensureDocumentAiPreferencesSchema(env))) {
    throw new DriveIntegrationError('DOCUMENTS_PREFERENCES_UNAVAILABLE', 'Preferências documentais indisponíveis.', 503);
  }
  const fieldOrder = normalizeDocumentAiFieldOrder(input.fieldOrder, { strict: true });
  await env.AUTH_DB.prepare(`INSERT INTO auth_document_ai_preferences(username, field_order_json)
    VALUES (?, ?)
    ON CONFLICT(username) DO UPDATE SET
      field_order_json = excluded.field_order_json,
      updated_at = CURRENT_TIMESTAMP`)
    .bind(String(username || ''), JSON.stringify(fieldOrder)).run();
  return { fieldOrder };
}

async function documentsPreferencesFor(env, username) {
  const [editor, viewer, documentAi] = await Promise.all([
    editorPreferencesFor(env, username),
    viewerPreferencesFor(env, username),
    documentAiPreferencesFor(env, username)
  ]);
  return { ...editor, ...viewer, ...documentAi };
}

async function setDocumentsPreferences(env, username, input = {}) {
  const hasPalette = Object.prototype.hasOwnProperty.call(input, 'colorPalette');
  const hasViewerZoom = Object.prototype.hasOwnProperty.call(input, 'viewerZoomScale');
  const hasFieldOrder = Object.prototype.hasOwnProperty.call(input, 'fieldOrder');
  if (!hasPalette && !hasViewerZoom && !hasFieldOrder) {
    throw new DriveIntegrationError('DOCUMENTS_PREFERENCES_INVALID', 'Nenhuma preferência reconhecida foi enviada.', 400);
  }
  if (hasPalette) await setEditorPreferences(env, username, input);
  if (hasViewerZoom) await setViewerPreferences(env, username, input);
  if (hasFieldOrder) await setDocumentAiPreferences(env, username, input);
  return documentsPreferencesFor(env, username);
}

function headers(origin = '', allowed = true) {
  const value = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (origin && allowed) {
    value['Access-Control-Allow-Origin'] = origin;
    value.Vary = 'Origin';
  }
  return value;
}

function json(body, status, origin = '', allowed = true) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers(origin, allowed),
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const value = headers(origin, true);
  value['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
  value['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Range, Content-Range, X-Document-Page-Number';
  value['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers: value });
}

function genericError(error, origin, allowed = true) {
  if (error instanceof DriveIntegrationError || error instanceof DocumentAiError) {
    return json({ error: error.message, code: error.code }, error.status || 500, origin, allowed);
  }
  return json({ error: 'Falha temporária na Central de Documentos.', code: 'DOCUMENTS_TEMPORARILY_UNAVAILABLE' }, 500, origin, allowed);
}

async function safeJson(request, maximumBytes = MAX_JSON_BODY_BYTES) {
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > maximumBytes) {
    throw new DriveIntegrationError('DOCUMENTS_BODY_TOO_LARGE', 'Solicitação maior do que o permitido.', 413);
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maximumBytes) {
    throw new DriveIntegrationError('DOCUMENTS_BODY_TOO_LARGE', 'Solicitação maior do que o permitido.', 413);
  }
  if (!text.trim()) return {};
  try { return JSON.parse(text); }
  catch (_) { throw new DriveIntegrationError('DOCUMENTS_JSON_INVALID', 'Solicitação inválida.', 400); }
}

function portalReturnUrl(env, state) {
  const configured = String(env.DOCUMENTS_PORTAL_RETURN_URL || '').trim();
  const base = configured || 'https://regulacaoeldoradoms.com.br/documentos/';
  const url = new URL(base);
  if (state === 'connected') url.searchParams.set('oauth', 'connected');
  else if (state) url.searchParams.set('oauth', 'error');
  return url.toString();
}

async function handleOAuthCallback(request, env) {
  const url = new URL(request.url);
  if (request.method !== 'GET') return json({ error: 'Método não permitido.' }, 405);
  if (url.searchParams.get('error')) {
    return Response.redirect(portalReturnUrl(env, 'error'), 302);
  }

  const code = String(url.searchParams.get('code') || '');
  const state = String(url.searchParams.get('state') || '');
  if (!code || !state) return Response.redirect(portalReturnUrl(env, 'error'), 302);

  try {
    await completeDriveOAuth(env, code, state);
    return Response.redirect(portalReturnUrl(env, 'connected'), 302);
  } catch (_) {
    return Response.redirect(portalReturnUrl(env, 'error'), 302);
  }
}

function requireCapability(user, capability, origin) {
  if (!user) return json({ error: 'Sessão inválida ou expirada.', code: 'AUTH_REQUIRED' }, 401, origin);
  if (!hasDocumentCapability(user, capability)) {
    return json({ error: 'Sua conta não possui esta permissão na Central de Documentos.', code: 'DOCUMENTS_ACCESS_DENIED' }, 403, origin);
  }
  return null;
}

async function contentResponse(request, env, origin, ref) {
  const upstream = await fetchDrivePdf(env, ref, request.headers.get('Range') || '');
  const out = headers(origin, true);
  out['Content-Type'] = 'application/pdf';
  const length = upstream.headers.get('Content-Length');
  const contentRange = upstream.headers.get('Content-Range');
  const acceptRanges = upstream.headers.get('Accept-Ranges');
  if (length) out['Content-Length'] = length;
  if (contentRange) out['Content-Range'] = contentRange;
  if (acceptRanges) out['Accept-Ranges'] = acceptRanges;
  return new Response(upstream.body, { status: upstream.status, headers: out });
}

export function isDocumentsApi(pathname) {
  return String(pathname || '').startsWith(API_PREFIX);
}

export function isDocumentsOAuthCallback(pathname) {
  return String(pathname || '') === OAUTH_CALLBACK;
}

export async function handleDocumentsRoute(request, env, origin, originAllowed = true, options = {}) {
  const url = new URL(request.url);

  if (url.pathname === OAUTH_CALLBACK) return handleOAuthCallback(request, env);
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);

  const user = options?.prevalidatedUser || await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.', code: 'AUTH_REQUIRED' }, 401, origin);

  try {
    if (url.pathname === '/api/documents/access' && request.method === 'GET') {
      return json({
        capabilities: user.documentCapabilities || { view: false, extract: false, edit: false, manage: user.role === 'admin' },
        drive: await driveConnectionStatus(env)
      }, 200, origin);
    }

    if (url.pathname === '/api/documents/preferences' && request.method === 'GET') {
      const denied = requireCapability(user, 'view', origin);
      if (denied) return denied;
      return json(await documentsPreferencesFor(env, user.username), 200, origin);
    }

    if (url.pathname === '/api/documents/ai/config' && request.method === 'GET') {
      const denied = requireCapability(user, 'extract', origin);
      if (denied) return denied;
      return json({ ai: documentAiPublicConfig(env) }, 200, origin);
    }

    if (url.pathname === '/api/documents/ai/page/classify' && request.method === 'POST') {
      const denied = requireCapability(user, 'extract', origin);
      if (denied) return denied;
      if (!documentAiProcessingEnabled(env)) {
        return json({
          error: 'O processamento da IA documental ainda não está habilitado neste ambiente.',
          code: 'DOCUMENT_AI_PROCESSING_DISABLED'
        }, 503, origin);
      }

      const declared = Number(request.headers.get('Content-Length') || 0);
      if (declared > MAX_DOCUMENT_AI_IMAGE_BYTES) {
        throw new DocumentAiError(
          'DOCUMENT_AI_IMAGE_TOO_LARGE',
          'Imagem de página maior do que o limite da IA documental.',
          413
        );
      }

      const pageNumber = normalizeDocumentAiPageNumber(
        request.headers.get('X-Document-Page-Number')
      );
      const mimeType = String(request.headers.get('Content-Type') || '');
      const body = new Uint8Array(await request.arrayBuffer());
      if (body.byteLength > MAX_DOCUMENT_AI_IMAGE_BYTES) {
        throw new DocumentAiError(
          'DOCUMENT_AI_IMAGE_TOO_LARGE',
          'Imagem de página maior do que o limite da IA documental.',
          413
        );
      }

      const result = await classifyDocumentAiPage(env, {
        pageNumber,
        mimeType,
        bytes: body
      });
      return json(result, 200, origin);
    }

    if (url.pathname === '/api/documents/ai/page/extract' && request.method === 'POST') {
      const denied = requireCapability(user, 'extract', origin);
      if (denied) return denied;
      if (!documentAiProcessingEnabled(env)) {
        return json({
          error: 'O processamento da IA documental ainda não está habilitado neste ambiente.',
          code: 'DOCUMENT_AI_PROCESSING_DISABLED'
        }, 503, origin);
      }

      const declared = Number(request.headers.get('Content-Length') || 0);
      if (declared > MAX_DOCUMENT_AI_IMAGE_BYTES) {
        throw new DocumentAiError(
          'DOCUMENT_AI_IMAGE_TOO_LARGE',
          'Imagem de página maior do que o limite da IA documental.',
          413
        );
      }

      const pageNumber = normalizeDocumentAiPageNumber(
        request.headers.get('X-Document-Page-Number')
      );
      const mimeType = String(request.headers.get('Content-Type') || '');
      const body = new Uint8Array(await request.arrayBuffer());
      if (body.byteLength > MAX_DOCUMENT_AI_IMAGE_BYTES) {
        throw new DocumentAiError(
          'DOCUMENT_AI_IMAGE_TOO_LARGE',
          'Imagem de página maior do que o limite da IA documental.',
          413
        );
      }

      const result = await classifyAndExtractDocumentAiPage(env, {
        pageNumber,
        mimeType,
        bytes: body
      });
      return json(result, 200, origin);
    }

    if (url.pathname === '/api/documents/ai/page/gemini' && request.method === 'POST') {
      const denied = requireCapability(user, 'extract', origin);
      if (denied) return denied;
      if (!documentAiProcessingEnabled(env)) {
        return json({
          error: 'O processamento da IA documental ainda não está habilitado neste ambiente.',
          code: 'DOCUMENT_AI_PROCESSING_DISABLED'
        }, 503, origin);
      }

      const declared = Number(request.headers.get('Content-Length') || 0);
      if (declared > MAX_DOCUMENT_AI_IMAGE_BYTES) {
        throw new DocumentAiError(
          'DOCUMENT_AI_IMAGE_TOO_LARGE',
          'Imagem de página maior do que o limite da IA documental.',
          413
        );
      }

      const pageNumber = normalizeDocumentAiPageNumber(
        request.headers.get('X-Document-Page-Number')
      );
      const mimeType = String(request.headers.get('Content-Type') || '');
      const body = new Uint8Array(await request.arrayBuffer());
      if (body.byteLength > MAX_DOCUMENT_AI_IMAGE_BYTES) {
        throw new DocumentAiError(
          'DOCUMENT_AI_IMAGE_TOO_LARGE',
          'Imagem de página maior do que o limite da IA documental.',
          413
        );
      }

      const result = await analyzeDocumentAiPageWithGemini(env, {
        pageNumber,
        mimeType,
        bytes: body
      });
      return json(result, 200, origin);
    }

    if (url.pathname === '/api/documents/ai/chat' && request.method === 'POST') {
      const denied = requireCapability(user, 'extract', origin);
      if (denied) return denied;
      if (!documentAiProcessingEnabled(env)) {
        return json({
          error: 'O processamento da IA documental ainda não está habilitado neste ambiente.',
          code: 'DOCUMENT_AI_PROCESSING_DISABLED'
        }, 503, origin);
      }

      const body = await safeJson(request, MAX_DOCUMENT_AI_CHAT_BODY_BYTES);
      const result = await chatDocumentAi(env, {
        question: body.question,
        evidence: body.evidence
      });
      return json(result, 200, origin);
    }

    if (url.pathname.startsWith('/api/documents/ai/') && request.method !== 'GET') {
      const denied = requireCapability(user, 'extract', origin);
      if (denied) return denied;
      return json({
        error: 'O processamento da IA documental ainda não está habilitado nesta etapa.',
        code: 'DOCUMENT_AI_PROCESSING_DISABLED'
      }, 503, origin);
    }

    if (url.pathname === '/api/documents/preferences' && request.method === 'PATCH') {
      const denied = requireCapability(user, 'view', origin);
      if (denied) return denied;
      const body = await safeJson(request);
      return json(await setDocumentsPreferences(env, user.username, body), 200, origin);
    }

    const accessMatch = url.pathname.match(/^\/api\/documents\/admin\/access\/([a-z0-9._-]{3,40})$/);
    if (accessMatch && request.method === 'PATCH') {
      if (user.role !== 'admin' || !hasDocumentCapability(user, 'manage')) {
        return json({ error: 'Acesso de Desenvolvedor necessário.', code: 'DOCUMENTS_MANAGE_REQUIRED' }, 403, origin);
      }
      const body = await safeJson(request);
      const capabilities = await setDocumentCapabilities(env, accessMatch[1], {
        view: body.view === true,
        extract: body.extract === true,
        edit: body.edit === true,
        manage: body.manage === true
      }, user.username);
      return json({ username: accessMatch[1], capabilities }, 200, origin);
    }

    if (url.pathname === '/api/documents/oauth/start' && request.method === 'POST') {
      const denied = requireCapability(user, 'manage', origin);
      if (denied) return denied;
      const authorizationUrl = await createDriveAuthorizationUrl(env, user.username);
      return json({ authorizationUrl }, 200, origin);
    }

    if (url.pathname === '/api/documents/oauth/disconnect' && request.method === 'POST') {
      const denied = requireCapability(user, 'manage', origin);
      if (denied) return denied;
      await disconnectDrive(env);
      return json({ connected: false }, 200, origin);
    }

    if (url.pathname === '/api/documents/drive/status' && request.method === 'GET') {
      if (!hasDocumentCapability(user, 'view') && !hasDocumentCapability(user, 'manage')) {
        return json({ error: 'Acesso documental não autorizado.', code: 'DOCUMENTS_ACCESS_DENIED' }, 403, origin);
      }
      return json({ drive: await driveConnectionStatus(env) }, 200, origin);
    }

    if (url.pathname === '/api/documents/drive/list' && request.method === 'POST') {
      const denied = requireCapability(user, 'view', origin);
      if (denied) return denied;
      const body = await safeJson(request);
      const result = await listDriveFolder(env, {
        parentRef: String(body.parentRef || ''),
        pageToken: String(body.pageToken || ''),
        pageSize: body.pageSize
      });
      return json(result, 200, origin);
    }

    if (url.pathname === '/api/documents/drive/search' && request.method === 'POST') {
      const denied = requireCapability(user, 'view', origin);
      if (denied) return denied;
      const body = await safeJson(request);
      const filters = body.filters && typeof body.filters === 'object' ? body.filters : {};
      const result = await searchDrive(env, {
        query: String(body.query || ''),
        pageToken: String(body.pageToken || ''),
        pageSize: body.pageSize,
        titleOnly: body.titleOnly === true,
        filters: {
          type: String(filters.type || ''),
          owner: String(filters.owner || ''),
          ownerEmail: String(filters.ownerEmail || ''),
          words: String(filters.words || ''),
          itemName: String(filters.itemName || ''),
          location: String(filters.location || ''),
          parentRef: String(filters.parentRef || ''),
          starred: filters.starred === true,
          trashed: filters.trashed === true,
          modifiedAfter: String(filters.modifiedAfter || ''),
          modifiedBefore: String(filters.modifiedBefore || ''),
          sharedWith: String(filters.sharedWith || '')
        }
      });
      return json(result, 200, origin);
    }

    if (url.pathname === '/api/documents/drive/rename' && request.method === 'PATCH') {
      const denied = requireCapability(user, 'edit', origin);
      if (denied) return denied;
      const body = await safeJson(request);
      const result = await renameDrivePdf(env, {
        ref: String(body.ref || ''),
        baseVersion: String(body.baseVersion || ''),
        baseName: String(body.baseName || ''),
        name: String(body.name || '')
      }, user.username);
      return json(result, 200, origin);
    }

    if (url.pathname === '/api/documents/presence/heartbeat' && request.method === 'POST') {
      const denied = requireCapability(user, 'view', origin);
      if (denied) return denied;
      const body = await safeJson(request);
      const mode = String(body.mode || '').trim().toLowerCase();
      if (mode === 'edit' && !hasDocumentCapability(user, 'edit')) {
        return json({
          error: 'Sua conta não possui permissão de edição na Central de Documentos.',
          code: 'DOCUMENTS_ACCESS_DENIED'
        }, 403, origin);
      }
      return json(await heartbeatDocumentPresence(env, user, {
        ref: String(body.ref || ''),
        sessionId: String(body.sessionId || ''),
        mode
      }), 200, origin);
    }

    if (url.pathname === '/api/documents/presence' && request.method === 'DELETE') {
      const denied = requireCapability(user, 'view', origin);
      if (denied) return denied;
      const body = await safeJson(request);
      return json(await releaseDocumentPresence(env, user, {
        ref: String(body.ref || ''),
        sessionId: String(body.sessionId || '')
      }), 200, origin);
    }

    if (url.pathname === '/api/documents/drive/sync/preflight' && request.method === 'POST') {
      const denied = requireCapability(user, 'edit', origin);
      if (denied) return denied;
      const body = await safeJson(request);
      const result = await preflightDriveSync(env, {
        operation: String(body.operation || ''),
        ref: String(body.ref || ''),
        baseVersion: String(body.baseVersion || '')
      }, user.username);
      return json(result, 200, origin);
    }

    if (url.pathname === '/api/documents/drive/sync/start' && request.method === 'POST') {
      const denied = requireCapability(user, 'edit', origin);
      if (denied) return denied;
      const body = await safeJson(request);
      const result = await startDriveSync(env, user.username, {
        operation: String(body.operation || ''),
        ref: String(body.ref || ''),
        baseVersion: String(body.baseVersion || ''),
        totalBytes: body.totalBytes,
        copyName: String(body.copyName || ''),
        preserveRevision: body.preserveRevision !== false
      });
      return json(result, 201, origin);
    }

    const uploadMatch = url.pathname.match(/^\/api\/documents\/drive\/sync\/upload\/([A-Za-z0-9_-]{20,80})$/);
    if (uploadMatch && request.method === 'PUT') {
      const denied = requireCapability(user, 'edit', origin);
      if (denied) return denied;
      const result = await uploadDriveSyncChunk(env, user.username, uploadMatch[1], request);
      return json(result, result.completed ? 200 : 202, origin);
    }

    const statusMatch = url.pathname.match(/^\/api\/documents\/drive\/sync\/status\/([A-Za-z0-9_-]{20,80})$/);
    if (statusMatch && request.method === 'POST') {
      const denied = requireCapability(user, 'edit', origin);
      if (denied) return denied;
      const result = await queryDriveSyncStatus(env, user.username, statusMatch[1]);
      return json(result, result.completed ? 200 : 202, origin);
    }

    const cancelMatch = url.pathname.match(/^\/api\/documents\/drive\/sync\/([A-Za-z0-9_-]{20,80})$/);
    if (cancelMatch && request.method === 'DELETE') {
      const denied = requireCapability(user, 'edit', origin);
      if (denied) return denied;
      return json(await cancelDriveSync(env, user.username, cancelMatch[1]), 200, origin);
    }

    const contentMatch = url.pathname.match(/^\/api\/documents\/drive\/content\/([A-Za-z0-9._-]{20,1200})$/);
    if (contentMatch && request.method === 'GET') {
      const denied = requireCapability(user, 'view', origin);
      if (denied) return denied;
      return contentResponse(request, env, origin, contentMatch[1]);
    }

    return json({ error: 'Rota documental não encontrada.' }, 404, origin);
  } catch (error) {
    return genericError(error, origin, true);
  }
}
