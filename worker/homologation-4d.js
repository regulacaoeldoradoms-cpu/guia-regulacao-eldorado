'use strict';

// Preview-only entrypoint. The production entrypoint never imports this module.
import { handlePortalRoute, validatePortalSession } from './auth-management-flex.js';
import { handleDocumentsRoute } from './documents-router.js';
import { handleObservabilityRoute } from './observability.js';
import { augmentAuthResponse, enforceProfessionalEmailGate, portalEnvForAuthRoute } from './portal-safety.js';
import { openDriveFileRef, preflightDriveSync, sealDriveFileRef } from './document-drive.js';

const PRODUCTION_ORIGIN = 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';
const PDF_MIME = 'application/pdf';
const MAX_JSON_BYTES = 16 * 1024;
const SIMPLE_ROUTES = new Map([
  ['POST /api/auth/login', 'login'],
  ['GET /api/auth/me', 'read'],
  ['POST /api/auth/logout', 'read'],
  ['GET /api/documents/access', 'read'],
  ['GET /api/documents/drive/status', 'read'],
  ['GET /api/documents/preferences', 'read'],
  ['POST /api/documents/drive/list', 'list'],
  ['POST /api/documents/drive/search', 'list'],
  ['POST /api/documents/drive/sync/preflight', 'preflight'],
  ['POST /api/documents/drive/sync/start', 'start'],
  ['POST /api/observability', 'telemetry']
]);

function reply(body, status, origin = '') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {})
    }
  });
}

function blocked(origin, code = 'HOMOLOGATION_DISABLED', status = 403) {
  return reply({ error: 'Solicitação indisponível nesta homologação controlada.', code }, status, origin);
}

function exactOrigin(value, suffix) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' && url.hostname.endsWith(suffix)
      && !url.username && !url.password && !url.port
      && url.pathname === '/' && !url.search && !url.hash
      ? url.origin : '';
  } catch (_) { return ''; }
}

function routeFor(method, path) {
  const simple = SIMPLE_ROUTES.get(`${method} ${path}`);
  if (simple) return { kind: simple };
  const content = path.match(/^\/api\/documents\/drive\/content\/([A-Za-z0-9._-]{20,1200})$/);
  if (method === 'GET' && content) return { kind: 'content', ref: content[1] };
  const upload = path.match(/^\/api\/documents\/drive\/sync\/upload\/([A-Za-z0-9_-]{20,80})$/);
  const status = path.match(/^\/api\/documents\/drive\/sync\/status\/([A-Za-z0-9_-]{20,80})$/);
  const cancel = path.match(/^\/api\/documents\/drive\/sync\/([A-Za-z0-9_-]{20,80})$/);
  if (method === 'PUT' && upload) return { kind: 'upload', syncId: upload[1] };
  if (method === 'POST' && status) return { kind: 'status', syncId: status[1] };
  if (method === 'DELETE' && cancel) return { kind: 'cancel', syncId: cancel[1] };
  return null;
}

async function controlFor(env) {
  const id = String(env.DOCUMENTS_HOMOLOGATION_CONTROL_ID || '');
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(id) || !env.AUTH_DB) return null;
  // Direct D1 queries go to the primary; do not cache this revocation check.
  // No CREATE TABLE or permissive fallback: provisioning is an explicit operation.
  const row = await env.AUTH_DB.prepare(`SELECT control_id, enabled, expires_at,
    allowed_username, allowed_file_ids_json FROM document_drive_homologation_controls
    WHERE control_id = ? LIMIT 1`).bind(id).first();
  if (!row || Number(row.enabled) !== 1 || !Number.isSafeInteger(Number(row.expires_at))
    || Number(row.expires_at) <= Math.floor(Date.now() / 1000)
    || !/^[a-z0-9._-]{3,40}$/.test(String(row.allowed_username || ''))) return null;
  const fileIds = JSON.parse(String(row.allowed_file_ids_json || ''));
  if (!Array.isArray(fileIds) || !fileIds.length || fileIds.length > 5
    || fileIds.some((id) => typeof id !== 'string' || !/^[A-Za-z0-9_-]{10,300}$/.test(id))) return null;
  return { id, username: row.allowed_username, expiresAt: Number(row.expires_at), fileIds };
}

async function boundedJson(request) {
  if (Number(request.headers.get('Content-Length') || 0) > MAX_JSON_BYTES) throw new Error('body');
  const reader = request.body?.getReader();
  if (!reader) return {};
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      length += part.value.byteLength;
      if (length > MAX_JSON_BYTES) {
        await reader.cancel();
        throw new Error('body');
      }
      chunks.push(part.value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  const value = length ? JSON.parse(new TextDecoder().decode(bytes)) : {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('body');
  return value;
}

function withJson(request, body) {
  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'application/json');
  headers.delete('Content-Length');
  return new Request(request.url, { method: request.method, headers, body: JSON.stringify(body) });
}

async function forwardPortalRoute(request, env, ctx) {
  const path = new URL(request.url).pathname;
  const origin = request.headers.get('Origin');
  if (path === '/api/observability') return handleObservabilityRoute(request, env, ctx, origin, true);
  const emailGate = await enforceProfessionalEmailGate(request, env, validatePortalSession, origin, true);
  if (emailGate) return emailGate;
  if (path.startsWith('/api/documents/')) return handleDocumentsRoute(request, env, origin, true);
  const response = await handlePortalRoute(request, portalEnvForAuthRoute(env, path), origin, true);
  return path === '/api/auth/login' || path === '/api/auth/me' ? augmentAuthResponse(response, env) : response;
}

async function homologationCacheKey(env, controlId, fileId) {
  const secret = String(env.DRIVE_TOKEN_ENCRYPTION_KEY || '').trim();
  if (!secret) throw new Error('cache-key-configuration');
  const bytes = new TextEncoder().encode(JSON.stringify(['homologation-4d', controlId, fileId]));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, bytes));
  return 'homologation-4d:' + Array.from(digest, (value) => value.toString(16).padStart(2, '0')).join('');
}

// Dependency injection is for synthetic tests only; the default uses the real
// Portal authentication and Drive implementation, never a preview-issued token.
export function createHomologation4dWorker({
  portalFetch = forwardPortalRoute,
  validateSession = validatePortalSession,
  openRef = openDriveFileRef,
  sealRef = sealDriveFileRef,
  preflight = preflightDriveSync
} = {}) {
  return {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const workerOrigin = exactOrigin(env.DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN, '.workers.dev');
      const pagesOrigin = exactOrigin(env.DOCUMENTS_HOMOLOGATION_ORIGIN, '.pages.dev');
      const origin = request.headers.get('Origin') || '';
      if (!workerOrigin || workerOrigin === PRODUCTION_ORIGIN || url.origin !== workerOrigin
        || !pagesOrigin || origin !== pagesOrigin) return blocked('');

      const method = request.method === 'OPTIONS'
        ? request.headers.get('Access-Control-Request-Method') : request.method;
      const route = routeFor(method, url.pathname);
      if (!route || url.search) return blocked(origin, 'HOMOLOGATION_ROUTE_DENIED');

      try {
        let control = await controlFor(env);
        if (!control) return blocked(origin);
        if (request.method === 'OPTIONS') {
          const response = reply({}, 200, origin);
          response.headers.set('Access-Control-Allow-Methods', method);
          response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Range, Content-Range');
          response.headers.set('Access-Control-Max-Age', '0');
          return response;
        }

        if (route.kind === 'telemetry') return await portalFetch(request, env, ctx);
        if (route.kind === 'login') {
          const body = await boundedJson(request);
          if (String(body.username || '').trim().toLowerCase() !== control.username) {
            return blocked(origin, 'HOMOLOGATION_USER_DENIED');
          }
          return await portalFetch(withJson(request, body), env, ctx);
        }

        const user = await validateSession(request, env, []);
        if (!user) return blocked(origin, 'AUTH_REQUIRED', 401);
        if (user.username !== control.username || user.documentCapabilities?.view !== true) {
          return blocked(origin, 'HOMOLOGATION_USER_DENIED');
        }
        const writes = ['start', 'upload', 'status', 'cancel'].includes(route.kind);
        if ((writes || route.kind === 'preflight') && user.documentCapabilities?.edit !== true) {
          return blocked(origin, 'DOCUMENTS_ACCESS_DENIED');
        }
        if (writes && String(env.DOCUMENTS_DRIVE_WRITE_ENABLED || '').trim().toLowerCase() !== 'true') {
          return blocked(origin, 'DRIVE_SYNC_WRITE_DISABLED', 503);
        }

        let fileId = '';
        if (route.kind === 'content') {
          const file = await openRef(env, route.ref);
          if (file.mime !== PDF_MIME || !control.fileIds.includes(file.id)) {
            return blocked(origin, 'HOMOLOGATION_FILE_DENIED');
          }
        }
        if (route.kind === 'preflight' || route.kind === 'start') {
          const body = await boundedJson(request);
          if (body.operation !== 'replace_pdf') return blocked(origin, 'HOMOLOGATION_OPERATION_DENIED');
          const file = await openRef(env, String(body.ref || ''));
          if (file.mime !== PDF_MIME || !control.fileIds.includes(file.id)) {
            return blocked(origin, 'HOMOLOGATION_FILE_DENIED');
          }
          fileId = file.id;
          // Every controlled replacement must preserve its previous revision,
          // including retries and callers explicitly asking to skip preservation.
          if (route.kind === 'start') body.preserveRevision = true;
          request = withJson(request, body);
          if (route.kind === 'start') {
            // Check the session registry exists before any Google-side mutation.
            await env.AUTH_DB.prepare('SELECT sync_id FROM document_drive_homologation_sessions LIMIT 1').first();
          }
        }
        if (route.syncId) {
          const session = await env.AUTH_DB.prepare(`SELECT username, file_id, expires_at
            FROM document_drive_homologation_sessions WHERE control_id = ? AND sync_id = ? LIMIT 1`)
            .bind(control.id, route.syncId).first();
          if (!session || session.username !== user.username || !control.fileIds.includes(session.file_id)
            || !Number.isSafeInteger(Number(session.expires_at))
            || Number(session.expires_at) <= Math.floor(Date.now() / 1000)) {
            return blocked(origin, 'HOMOLOGATION_SESSION_DENIED');
          }
          fileId = session.file_id;
        }

        if (route.kind === 'list') {
          const emailGate = await enforceProfessionalEmailGate(request, env, validatePortalSession, origin, true);
          if (emailGate) return emailGate;
          const body = await boundedJson(request);
          if (body.parentRef || body.pageToken) return blocked(origin, 'HOMOLOGATION_FILE_DENIED');
          const items = [];
          for (const [index, id] of control.fileIds.entries()) {
            const ref = await sealRef(env, id, PDF_MIME);
            const metadata = await preflight(env, { operation: 'save_copy', ref });
            items.push({
              ref, cacheKey: await homologationCacheKey(env, control.id, id),
              name: `PDF descartável 4D ${index + 1}.pdf`, mimeType: PDF_MIME,
              originalMimeType: PDF_MIME, isFolder: false, isPdf: true, isShortcut: false,
              version: metadata.currentVersion, size: metadata.size, modifiedTime: metadata.modifiedTime,
              canEdit: metadata.canEditOriginal, canDownload: true
            });
          }
          return reply({ items, nextPageToken: '' }, 200, origin);
        }

        // Re-read after authentication/body processing, before forwarding a write.
        if (writes) {
          control = await controlFor(env);
          if (!control || control.username !== user.username
            || (fileId && !control.fileIds.includes(fileId))) return blocked(origin);
        }
        const response = await portalFetch(request, env, ctx);
        if (route.kind === 'start' && response.ok) {
          const payload = await response.clone().json();
          if (!/^[A-Za-z0-9_-]{20,80}$/.test(String(payload.syncId || ''))) return blocked(origin, 'HOMOLOGATION_SESSION_DENIED');
          await env.AUTH_DB.prepare(`INSERT INTO document_drive_homologation_sessions
            (control_id, sync_id, username, file_id, expires_at) VALUES (?, ?, ?, ?, ?)`)
            .bind(control.id, payload.syncId, user.username, fileId, control.expiresAt).run();
        }
        if (route.syncId && response.ok) {
          const payload = await response.clone().json();
          if (payload.completed === true) {
            // List and completion must identify the same controlled PDF in cache.
            payload.cacheKey = await homologationCacheKey(env, control.id, fileId);
          }
          if (payload.completed === true || payload.cancelled === true) {
            await env.AUTH_DB.prepare(`DELETE FROM document_drive_homologation_sessions
              WHERE control_id = ? AND sync_id = ?`).bind(control.id, route.syncId).run();
          }
          if (payload.completed === true) {
            const headers = new Headers(response.headers);
            headers.delete('Content-Length');
            return new Response(JSON.stringify(payload), { status: response.status, headers });
          }
        }
        return response;
      } catch (_) {
        // Includes missing D1 table, malformed control, registry errors and bad refs.
        // Do not log queries, file IDs, tokens, PDF content or opaque references.
        return blocked(origin, 'HOMOLOGATION_UNAVAILABLE', 503);
      }
    }
  };
}

const homologationWorker = createHomologation4dWorker();

export default {
  async fetch(request, env, ctx) {
    const response = await homologationWorker.fetch(request, env, ctx);
    const release = String(env.DOCUMENTS_HOMOLOGATION_RELEASE || '').trim();
    if (!/^[a-f0-9]{40}$/i.test(release)) return response;
    const headers = new Headers(response.headers);
    headers.set('X-Central-Docs-Preview-Release', release.toLowerCase());
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
