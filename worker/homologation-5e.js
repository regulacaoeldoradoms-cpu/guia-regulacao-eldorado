'use strict';

// Preview-only entrypoint for Fase 5E. Production never imports this module.
import { handlePortalRoute, validateDocumentSession } from './auth-management-flex.js';
import { verifyPortalSessionToken } from './auth-management-v2.js';
import { handleDocumentsRoute } from './documents-router.js';
import { augmentAuthResponse, portalEnvForAuthRoute } from './portal-safety.js';

const PRODUCTION_ORIGIN = 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';
const MAX_LOGIN_BODY_BYTES = 8 * 1024;
const FIXTURE_HEADER = 'X-Document-Ai-Homologation';
const FIXTURE_VALUE = 'phase5e-synthetic-v1';

const SIMPLE_ROUTES = new Map([
  ['POST /api/auth/login', 'login'],
  ['GET /api/auth/me', 'read'],
  ['POST /api/auth/logout', 'read'],
  ['GET /api/documents/ai/config', 'read'],
  ['POST /api/documents/ai/page/classify', 'ai'],
  ['POST /api/documents/ai/page/extract', 'ai'],
  ['POST /api/documents/ai/chat', 'ai']
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

function blocked(origin, code = 'AI_HOMOLOGATION_DISABLED', status = 403) {
  return reply({
    error: 'Solicitação indisponível nesta homologação controlada.',
    code
  }, status, origin);
}

function exactOrigin(value, suffix) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:'
      && url.hostname.endsWith(suffix)
      && !url.username
      && !url.password
      && !url.port
      && url.pathname === '/'
      && !url.search
      && !url.hash
      ? url.origin
      : '';
  } catch (_) {
    return '';
  }
}

function routeFor(method, pathname) {
  const kind = SIMPLE_ROUTES.get(`${method} ${pathname}`);
  return kind ? { kind } : null;
}

async function controlFor(env) {
  const id = String(env.DOCUMENTS_AI_HOMOLOGATION_CONTROL_ID || '').trim();
  if (!/^phase5e_[a-f0-9]{32}$/i.test(id) || !env.AUTH_DB) return null;

  const row = await env.AUTH_DB.prepare(`SELECT control_id, enabled, expires_at, allowed_username
    FROM document_drive_homologation_controls WHERE control_id = ? LIMIT 1`).bind(id).first();

  if (
    !row
    || Number(row.enabled) !== 1
    || !Number.isSafeInteger(Number(row.expires_at))
    || Number(row.expires_at) <= Math.floor(Date.now() / 1000)
    || !/^[a-z0-9._-]{3,40}$/.test(String(row.allowed_username || ''))
  ) return null;

  return {
    id,
    username: String(row.allowed_username),
    expiresAt: Number(row.expires_at)
  };
}

async function authorizeAiSession(request, env) {
  const tokenUser = await verifyPortalSessionToken(request, env);
  if (!tokenUser) return { state: 'auth_required' };

  const controlId = String(env.DOCUMENTS_AI_HOMOLOGATION_CONTROL_ID || '').trim();
  if (!/^phase5e_[a-f0-9]{32}$/i.test(controlId) || !env.AUTH_DB) {
    return { state: 'disabled' };
  }

  // Uma única consulta consistente ao primário substitui as múltiplas leituras
  // sequenciais de usuário, roles, capability e controle. Isso preserva
  // revogação imediata do controle e reduz round-trips D1 no caminho quente.
  const db = typeof env.AUTH_DB.withSession === 'function'
    ? env.AUTH_DB.withSession('first-primary')
    : env.AUTH_DB;

  const row = await db.prepare(`SELECT
      u.username,
      u.role,
      u.active,
      u.session_version,
      COALESCE(d.can_view, 0) AS can_view,
      COALESCE(d.can_extract, 0) AS can_extract,
      COALESCE(d.can_edit, 0) AS can_edit,
      COALESCE(d.can_manage, 0) AS can_manage,
      EXISTS(
        SELECT 1 FROM auth_user_additional_roles ar
        WHERE ar.username = u.username AND ar.role_id = 'documentos'
      ) AS has_document_role,
      c.control_id,
      c.enabled,
      c.expires_at,
      c.allowed_username
    FROM auth_users u
    LEFT JOIN auth_document_access d ON d.username = u.username
    LEFT JOIN document_drive_homologation_controls c ON c.control_id = ?
    WHERE u.username = ?
    LIMIT 1`).bind(controlId, tokenUser.username).first();

  const now = Math.floor(Date.now() / 1000);
  if (
    !row
    || Number(row.active) !== 1
    || Number(row.session_version || 1) !== Number(tokenUser.sessionVersion)
  ) return { state: 'auth_required' };

  if (
    String(row.control_id || '') !== controlId
    || Number(row.enabled) !== 1
    || !Number.isSafeInteger(Number(row.expires_at))
    || Number(row.expires_at) <= now
    || String(row.allowed_username || '') !== tokenUser.username
  ) return { state: 'disabled' };

  const view = Number(row.can_view || 0) === 1 || Number(row.has_document_role || 0) === 1;
  const extract = view && Number(row.can_extract || 0) === 1;
  if (!extract) return { state: 'denied' };

  return {
    state: 'ok',
    user: {
      username: tokenUser.username,
      role: String(row.role || tokenUser.role || ''),
      documentCapabilities: {
        view,
        extract: true,
        edit: view && Number(row.can_edit || 0) === 1,
        manage: String(row.role || '') === 'admin' || Number(row.can_manage || 0) === 1
      }
    },
    control: {
      id: controlId,
      username: tokenUser.username,
      expiresAt: Number(row.expires_at)
    }
  };
}

async function boundedJson(request, maximum = MAX_LOGIN_BODY_BYTES) {
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > maximum) throw new Error('body');

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength > maximum) throw new Error('body');

  const value = bytes.byteLength
    ? JSON.parse(new TextDecoder().decode(bytes))
    : {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('body');
  return value;
}

function withJson(request, body) {
  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'application/json');
  headers.delete('Content-Length');
  return new Request(request.url, {
    method: request.method,
    headers,
    body: JSON.stringify(body)
  });
}

async function forwardAuth(request, env, origin) {
  const path = new URL(request.url).pathname;
  const response = await handlePortalRoute(
    request,
    portalEnvForAuthRoute(env, path),
    origin,
    true
  );
  return path === '/api/auth/login' || path === '/api/auth/me'
    ? augmentAuthResponse(response, env)
    : response;
}

async function forwardDocuments(request, env, origin, user) {
  return handleDocumentsRoute(request, env, origin, true, { prevalidatedUser: user });
}

export function createHomologation5eWorker({
  authFetch = forwardAuth,
  documentsFetch = forwardDocuments,
  validateSession = validateDocumentSession,
  authorizeAi = authorizeAiSession,
  readControl = controlFor
} = {}) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const workerOrigin = exactOrigin(
        env.DOCUMENTS_AI_HOMOLOGATION_WORKER_ORIGIN,
        '.workers.dev'
      );
      const pagesOrigin = exactOrigin(
        env.DOCUMENTS_AI_HOMOLOGATION_ORIGIN,
        '.pages.dev'
      );
      const origin = request.headers.get('Origin') || '';

      if (
        !workerOrigin
        || workerOrigin === PRODUCTION_ORIGIN
        || url.origin !== workerOrigin
        || !pagesOrigin
        || origin !== pagesOrigin
      ) return blocked('');

      const method = request.method === 'OPTIONS'
        ? String(request.headers.get('Access-Control-Request-Method') || '')
        : request.method;
      const route = routeFor(method, url.pathname);
      if (!route || url.search) return blocked(origin, 'AI_HOMOLOGATION_ROUTE_DENIED');

      if (request.method === 'OPTIONS') {
        // Preflight não acessa dados nem provider. A operação real continua
        // validando sessão, controle revogável e gates antes de qualquer IA.
        const response = reply({}, 200, origin);
        response.headers.set('Access-Control-Allow-Methods', method);
        response.headers.set(
          'Access-Control-Allow-Headers',
          'Authorization, Content-Type, X-Document-Page-Number, ' + FIXTURE_HEADER
        );
        response.headers.set('Access-Control-Max-Age', '600');
        return response;
      }

      if (
        String(env.DOCUMENTS_DRIVE_WRITE_ENABLED || '').trim().toLowerCase() !== 'false'
      ) return blocked(origin, 'AI_HOMOLOGATION_DRIVE_GATE_INVALID', 503);

      if (route.kind === 'login') {
        let control;
        try {
          control = await readControl(env);
        } catch (_) {
          return blocked(origin, 'AI_HOMOLOGATION_UNAVAILABLE', 503);
        }
        if (!control) return blocked(origin);

        try {
          const body = await boundedJson(request);
          if (
            String(body.username || '').trim().toLowerCase() !== control.username
          ) return blocked(origin, 'AI_HOMOLOGATION_USER_DENIED');

          return await authFetch(withJson(request, body), env, origin);
        } catch (_) {
          return blocked(origin, 'AI_HOMOLOGATION_LOGIN_INVALID', 400);
        }
      }

      if (route.kind === 'ai') {
        if (request.headers.get(FIXTURE_HEADER) !== FIXTURE_VALUE) {
          return blocked(origin, 'AI_HOMOLOGATION_FIXTURE_REQUIRED');
        }
        if (
          String(env.DOCUMENTS_AI_ENABLED || '').trim().toLowerCase() !== 'true'
          || String(env.DOCUMENTS_AI_PROCESSING_ENABLED || '').trim().toLowerCase() !== 'true'
        ) return blocked(origin, 'DOCUMENT_AI_PROCESSING_DISABLED', 503);

        let authorization;
        try {
          authorization = await authorizeAi(request, env);
        } catch (_) {
          return blocked(origin, 'AI_HOMOLOGATION_UNAVAILABLE', 503);
        }
        if (authorization?.state === 'auth_required') {
          return blocked(origin, 'AUTH_REQUIRED', 401);
        }
        if (authorization?.state !== 'ok') {
          return blocked(
            origin,
            authorization?.state === 'denied'
              ? 'AI_HOMOLOGATION_USER_DENIED'
              : 'AI_HOMOLOGATION_DISABLED'
          );
        }

        try {
          return await documentsFetch(request, env, origin, authorization.user);
        } catch (_) {
          return blocked(origin, 'AI_HOMOLOGATION_UNAVAILABLE', 503);
        }
      }

      // Rotas de leitura preservam a semântica operacional da homologação:
      // controle desabilitado => 403 antes da autenticação; controle ativo =>
      // autenticação obrigatória => 401 quando não há sessão.
      let control;
      try {
        control = await readControl(env);
      } catch (_) {
        return blocked(origin, 'AI_HOMOLOGATION_UNAVAILABLE', 503);
      }
      if (!control) return blocked(origin);

      let user;
      try {
        user = await validateSession(request, env);
      } catch (_) {
        user = null;
      }
      if (!user) return blocked(origin, 'AUTH_REQUIRED', 401);
      if (
        user.username !== control.username
        || user.documentCapabilities?.extract !== true
      ) return blocked(origin, 'AI_HOMOLOGATION_USER_DENIED');

      try {
        return url.pathname.startsWith('/api/documents/')
          ? await documentsFetch(request, env, origin, user)
          : await authFetch(request, env, origin);
      } catch (_) {
        return blocked(origin, 'AI_HOMOLOGATION_UNAVAILABLE', 503);
      }
    }
  };
}

const worker = createHomologation5eWorker();

export default {
  async fetch(request, env) {
    const response = await worker.fetch(request, env);
    const release = String(env.DOCUMENTS_AI_HOMOLOGATION_RELEASE || '').trim();
    if (!/^[a-f0-9]{40}$/i.test(release)) return response;
    const headers = new Headers(response.headers);
    headers.set('X-Central-Docs-AI-Preview-Release', release.toLowerCase());
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
