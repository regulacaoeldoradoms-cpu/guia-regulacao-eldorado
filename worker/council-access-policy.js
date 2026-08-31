'use strict';

import { handleCouncilRoute as baseHandleCouncilRoute, isCouncilApi } from './council.js';
import { validatePortalSession } from './auth-management-flex.js';
import { firestoreGet, firestorePatch } from './firebase-gateway.js';

function citizenContext(url) {
  return String(url?.searchParams?.get('as') || '').toLowerCase() === 'citizen';
}

function isCouncilMemberReadOnly(user, institutional) {
  return Boolean(institutional && user?.role !== 'admin' && user?.councilRole === 'membro');
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

function jsonOk(body, status, origin, allowed) {
  return new Response(JSON.stringify(body), {
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

function isDeletedManifestation(item) {
  return Boolean(item && typeof item === 'object' && item.deletedAt);
}

function filterDeletedPayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const safe = { ...payload };
  if (Array.isArray(safe.manifestations)) {
    safe.manifestations = safe.manifestations.filter((item) => !isDeletedManifestation(item));
  }
  return safe;
}

async function filterDeletedResponse(response) {
  if (!response?.ok) return response;
  const contentType = String(response.headers.get('Content-Type') || '');
  if (!contentType.includes('application/json')) return response;
  const payload = await response.clone().json().catch(() => null);
  if (!payload || !Array.isArray(payload.manifestations)) return response;
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(filterDeletedPayload(payload)), {
    status: response.status,
    headers
  });
}

function protocolFromPath(pathname) {
  const match = String(pathname || '').match(/^\/api\/council\/manifestations\/(CMS-\d{4}-\d{6})(?:\/|$)/);
  return match ? match[1] : '';
}

function canDeleteManifestations(user, institutional) {
  return Boolean(institutional && (user?.councilRole === 'presidente' || user?.role === 'admin'));
}

async function safeAudit(env, username, protocol) {
  if (!env?.AUTH_DB) return;
  try {
    await env.AUTH_DB.prepare(
      "INSERT INTO council_audit_log(actor_username, action, protocol) VALUES (?, 'manifestation.deleted', ?)"
    ).bind(String(username || ''), protocol).run();
  } catch (_) {
    // A exclusão já fica registrada no próprio documento do Firestore.
  }
}

async function clearProtocolNotifications(env, protocol) {
  if (!env?.AUTH_DB) return;
  try {
    await env.AUTH_DB.prepare('DELETE FROM portal_notifications WHERE protocol = ?').bind(protocol).run();
  } catch (_) {
    // Não impedir a exclusão caso a tabela de notificações não esteja disponível.
  }
}

async function deleteManifestations(request, env, user, origin, originAllowed) {
  const body = await request.json().catch(() => null);
  const received = Array.isArray(body?.protocols) ? body.protocols : [];
  const protocols = [...new Set(received.map((value) => String(value || '').trim()).filter(Boolean))];

  if (!protocols.length) {
    return jsonError('Selecione ao menos uma manifestação para excluir.', 400, origin, originAllowed, 'NO_MANIFESTATIONS_SELECTED');
  }
  if (protocols.length > 100) {
    return jsonError('É possível excluir no máximo 100 manifestações por vez.', 400, origin, originAllowed, 'DELETE_BATCH_TOO_LARGE');
  }
  if (protocols.some((protocol) => !/^CMS-\d{4}-\d{6}$/.test(protocol))) {
    return jsonError('A lista contém um protocolo inválido.', 400, origin, originAllowed, 'INVALID_PROTOCOL');
  }

  const deleted = [];
  const notFound = [];
  const now = new Date().toISOString();
  const actor = String(user?.username || '');
  const actorRole = user?.role === 'admin' ? 'Desenvolvedor' : 'Presidência do Conselho';

  for (const protocol of protocols) {
    const documentPath = `council_manifestations/${protocol}`;
    const current = await firestoreGet(env, documentPath);
    if (!current || isDeletedManifestation(current)) {
      notFound.push(protocol);
      continue;
    }

    await firestorePatch(env, documentPath, {
      deletedAt: now,
      deletedBy: actor,
      deletedByRole: actorRole,
      deletedReason: 'Exclusão administrativa pelo painel do Conselho',
      updatedAt: now
    });
    await clearProtocolNotifications(env, protocol);
    await safeAudit(env, actor, protocol);
    deleted.push(protocol);
  }

  return jsonOk({ ok: true, deleted, notFound }, 200, origin, originAllowed);
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

export { isCouncilApi, protectMemberPayload, canDeleteManifestations, isCouncilMemberReadOnly };

export async function handleCouncilRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') {
    return baseHandleCouncilRoute(request, env, origin, originAllowed);
  }

  const url = new URL(request.url);
  const user = await validatePortalSession(request, env, []);
  const institutional = !citizenContext(url);
  const isMember = isCouncilMemberReadOnly(user, institutional);
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

  if (url.pathname === '/api/council/manifestations/delete' && request.method === 'POST') {
    if (!canDeleteManifestations(user, institutional)) {
      return jsonError(
        'Somente a Presidência do Conselho e o Desenvolvedor podem excluir manifestações.',
        403,
        origin,
        originAllowed,
        'MANIFESTATION_DELETE_FORBIDDEN'
      );
    }
    return deleteManifestations(request, env, user, origin, originAllowed);
  }

  const protocol = protocolFromPath(url.pathname);
  if (protocol) {
    const current = await firestoreGet(env, `council_manifestations/${protocol}`);
    if (isDeletedManifestation(current)) {
      return jsonError('Esta manifestação foi excluída administrativamente.', 404, origin, originAllowed, 'MANIFESTATION_DELETED');
    }
  }

  // O Desenvolvedor recebe, apenas dentro do painel institucional, a mesma
  // capacidade operacional da Presidência sem alterar o cargo salvo na conta.
  const effectiveEnv = isDeveloper ? developerCouncilEnv(env) : env;
  let response = await baseHandleCouncilRoute(request, effectiveEnv, origin, originAllowed);
  response = await filterDeletedResponse(response);

  if (isMember) return protectMemberResponse(response);
  return response;
}
