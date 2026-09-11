'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import {
  hasDocumentCapability,
  setDocumentCapabilities
} from './document-access.js';
import {
  DriveIntegrationError,
  completeDriveOAuth,
  createDriveAuthorizationUrl,
  disconnectDrive,
  driveConnectionStatus,
  fetchDrivePdf,
  listDriveFolder,
  searchDrive
} from './document-drive.js';

const API_PREFIX = '/api/documents/';
const OAUTH_CALLBACK = '/api/documents/oauth/callback';
const MAX_JSON_BODY_BYTES = 16 * 1024;

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
  value['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS';
  value['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Range';
  value['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers: value });
}

function genericError(error, origin, allowed = true) {
  if (error instanceof DriveIntegrationError) {
    return json({ error: error.message, code: error.code }, error.status || 500, origin, allowed);
  }
  return json({ error: 'Falha temporária na Central de Documentos.', code: 'DOCUMENTS_TEMPORARILY_UNAVAILABLE' }, 500, origin, allowed);
}

async function safeJson(request) {
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > MAX_JSON_BODY_BYTES) {
    throw new DriveIntegrationError('DOCUMENTS_BODY_TOO_LARGE', 'Solicitação maior do que o permitido.', 413);
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BODY_BYTES) {
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

export async function handleDocumentsRoute(request, env, origin, originAllowed = true) {
  const url = new URL(request.url);

  if (url.pathname === OAUTH_CALLBACK) return handleOAuthCallback(request, env);
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);

  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.', code: 'AUTH_REQUIRED' }, 401, origin);

  try {
    if (url.pathname === '/api/documents/access' && request.method === 'GET') {
      return json({
        capabilities: user.documentCapabilities || { view: false, extract: false, edit: false, manage: user.role === 'admin' },
        drive: await driveConnectionStatus(env)
      }, 200, origin);
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
      const result = await searchDrive(env, {
        query: String(body.query || ''),
        pageToken: String(body.pageToken || ''),
        pageSize: body.pageSize
      });
      return json(result, 200, origin);
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
