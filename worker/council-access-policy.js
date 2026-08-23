'use strict';

import { handleCouncilRoute as baseHandleCouncilRoute, isCouncilApi } from './council.js';
import { validatePortalSession } from './auth-management-flex.js';

function citizenContext(url) {
  return String(url?.searchParams?.get('as') || '').toLowerCase() === 'citizen';
}

function responseHeaders(origin, allowed = true) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return headers;
}

function jsonError(message, status, origin, allowed, code) {
  return new Response(JSON.stringify({ error: message, code }), {
    status,
    headers: responseHeaders(origin, allowed)
  });
}

function wrapStatement(statement, elevateDeveloper) {
  return new Proxy(statement, {
    get(target, property) {
      if (property === 'bind') {
        return (...args) => wrapStatement(target.bind(...args), elevateDeveloper);
      }
      if (property === 'first' && elevateDeveloper) {
        return async (...args) => {
          const row = await target.first(...args);
          if (row && row.role === 'admin') {
            return { ...row, council_role: 'presidente' };
          }
          return row;
        };
      }
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    }
  });
}

function developerCouncilEnv(env) {
  if (!env?.AUTH_DB) return env;
  const db = env.AUTH_DB;
  const dbProxy = new Proxy(db, {
    get(target, property) {
      if (property === 'prepare') {
        return (sql) => {
          const text = String(sql || '');
          const elevateDeveloper = /select\s+\*\s+from\s+auth_users\s+where\s+username\s*=\s*\?/i.test(text);
          return wrapStatement(target.prepare(text), elevateDeveloper);
        };
      }
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    }
  });

  return new Proxy(env, {
    get(target, property) {
      if (property === 'AUTH_DB') return dbProxy;
      return Reflect.get(target, property, target);
    }
  });
}

function protectManifestationForMember(item) {
  if (!item || typeof item !== 'object') return item;
  const safe = { ...item };
  delete safe.authorIdentity;
  delete safe.authorUsername;
  safe.authorLabel = 'Manifestante anônimo';
  safe.privacyMode = 'anonima';
  return safe;
}

function protectMemberPayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const safe = { ...payload };

  if (Array.isArray(safe.manifestations)) {
    safe.manifestations = safe.manifestations.map(protectManifestationForMember);
  }
  if (safe.manifestation) {
    safe.manifestation = protectManifestationForMember(safe.manifestation);
  }
  if (Array.isArray(safe.messages)) {
    safe.messages = safe.messages.map((message) => message?.senderType === 'citizen'
      ? { ...message, senderLabel: 'Manifestante anônimo' }
      : message);
  }
  if (Array.isArray(safe.events)) {
    safe.events = safe.events.map((event) => event?.actorType === 'user'
      ? { ...event, actorLabel: event.actorLabel ? 'Manifestante anônimo' : '' }
      : event);
  }

  // Observações internas e anexos podem conter dados que revelem a autoria.
  if (Array.isArray(safe.internalNotes)) safe.internalNotes = [];
  if (Array.isArray(safe.attachments)) safe.attachments = [];

  safe.accessPolicy = {
    mode: 'read_only_anonymous',
    canIdentifyAuthor: false,
    canInteract: false,
    canViewAttachments: false,
    canViewInternalNotes: false
  };
  return safe;
}

async function protectMemberResponse(response) {
  if (!response?.ok) return response;
  const contentType = String(response.headers.get('Content-Type') || '');
  if (!contentType.includes('application/json')) return response;
  const payload = await response.clone().json().catch(() => null);
  if (!payload) return response;
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(protectMemberPayload(payload)), {
    status: response.status,
    headers
  });
}

function isInstitutionalManifestationMutation(url, request) {
  return !citizenContext(url)
    && url.pathname.startsWith('/api/council/manifestations')
    && !['GET', 'OPTIONS'].includes(request.method);
}

function isInstitutionalAttachmentDownload(url, request) {
  return !citizenContext(url)
    && request.method === 'GET'
    && /^\/api\/council\/manifestations\/CMS-\d{4}-\d{6}\/attachments\/[A-Za-z0-9_-]+$/.test(url.pathname);
}

export { isCouncilApi };

export async function handleCouncilRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') {
    return baseHandleCouncilRoute(request, env, origin, originAllowed);
  }

  const url = new URL(request.url);
  const user = await validatePortalSession(request, env, []);
  const institutional = !citizenContext(url);
  const isMember = institutional && user?.councilRole === 'membro';
  const isDeveloper = institutional && user?.role === 'admin';

  if (isMember && isInstitutionalManifestationMutation(url, request)) {
    return jsonError(
      'Membros do Conselho possuem acesso somente para leitura das manifestações.',
      403,
      origin,
      originAllowed,
      'COUNCIL_MEMBER_READ_ONLY'
    );
  }

  if (isMember && isInstitutionalAttachmentDownload(url, request)) {
    return jsonError(
      'Anexos ficam restritos à Presidência e ao Desenvolvedor para preservar a identidade do manifestante.',
      403,
      origin,
      originAllowed,
      'COUNCIL_MEMBER_ATTACHMENT_RESTRICTED'
    );
  }

  // O Desenvolvedor recebe, apenas dentro do painel institucional, a mesma
  // capacidade operacional da Presidência sem alterar o cargo salvo na conta.
  const effectiveEnv = isDeveloper ? developerCouncilEnv(env) : env;
  const response = await baseHandleCouncilRoute(request, effectiveEnv, origin, originAllowed);

  if (isMember) return protectMemberResponse(response);
  return response;
}