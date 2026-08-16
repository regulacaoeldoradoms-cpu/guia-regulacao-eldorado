'use strict';

import { firebaseConfigured, firestorePatch } from './firebase-gateway.js';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 254);
}

function json(body, status, origin, originAllowed = true) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (originAllowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

async function councilIndexExists(env) {
  if (!env.AUTH_DB) return false;
  const row = await env.AUTH_DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='council_manifestation_index'").first();
  return Boolean(row);
}

export async function guardSecurityEmailRemoval(request, env, validatePortalSession, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/auth/security' || request.method !== 'PATCH') return null;
  const body = await request.clone().json().catch(() => ({}));
  if (!Object.prototype.hasOwnProperty.call(body, 'email')) return null;

  const requestedEmail = normalizeEmail(body.email);
  if (requestedEmail) return null;

  const user = await validatePortalSession(request, env, []).catch(() => null);
  if (!user?.email) return null;

  // Depois que um e-mail é vinculado, a conta/protocolos podem ter sido associados a
  // esse identificador. Na V1 não fingimos que o histórico volta a ser anônimo.
  return json({
    error: 'Depois de vinculado, o e-mail de segurança não pode ser simplesmente removido pela conta. Você pode substituí-lo por outro endereço e confirmá-lo.',
    code: 'SECURITY_EMAIL_REMOVAL_BLOCKED'
  }, 409, origin, originAllowed);
}

export async function syncCitizenPrivacyAfterSecurityPatch(requestSnapshot, response, env, validatePortalSession) {
  if (!requestSnapshot || !response?.ok) return response;
  const url = new URL(requestSnapshot.url);
  if (url.pathname !== '/api/auth/security' || requestSnapshot.method !== 'PATCH') return response;

  const body = await requestSnapshot.clone().json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  if (!email) return response;

  const user = await validatePortalSession(requestSnapshot, env, []).catch(() => null);
  if (!user || user.role !== 'cidadao' || !(await councilIndexExists(env))) return response;

  await env.AUTH_DB.prepare("UPDATE council_manifestation_index SET privacy_mode = 'sigilosa' WHERE author_username = ?")
    .bind(user.username)
    .run();

  const result = await env.AUTH_DB.prepare('SELECT protocol FROM council_manifestation_index WHERE author_username = ?')
    .bind(user.username)
    .all();

  if (firebaseConfigured(env)) {
    for (const row of result.results || []) {
      const protocol = String(row.protocol || '');
      if (!/^CMS-\d{4}-\d{6}$/.test(protocol)) continue;
      await firestorePatch(env, `council_manifestations/${protocol}`, { privacyMode: 'sigilosa' }).catch(() => null);
    }
  }

  return response;
}
