'use strict';

import { validatePortalSession } from './auth-management-flex.js';

const MAX_SUBSCRIPTIONS_PER_USER = 8;
const PUSH_TIMEOUT_MS = 3500;
const VAPID_TTL_SECONDS = 12 * 60 * 60;
const VAPID_SUBJECT_FALLBACK = 'https://regulacaoeldoradoms.com.br/';
const schemaPromises = new WeakMap();

function responseHeaders(origin, allowed = true) {
  const headers = {
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

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...responseHeaders(origin, allowed),
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const headers = responseHeaders(origin, true);
  headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  headers['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers });
}

function normalizeUsername(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 40);
}

function base64UrlEncode(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const raw = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = raw + '='.repeat((4 - (raw.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function encodeJson(value) {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(value)));
}

function endpointUrl(value) {
  const text = String(value || '').trim();
  if (!text || text.length > 4096) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== 'https:') return null;
    return url;
  } catch (_) {
    return null;
  }
}

export function pushEndpointAudience(value) {
  const url = endpointUrl(value);
  return url ? url.origin : '';
}

function publicKeyFromJwk(jwk) {
  const x = base64UrlDecode(jwk?.x);
  const y = base64UrlDecode(jwk?.y);
  if (x.length !== 32 || y.length !== 32) throw new Error('Chave pública VAPID inválida.');
  const bytes = new Uint8Array(65);
  bytes[0] = 4;
  bytes.set(x, 1);
  bytes.set(y, 33);
  return base64UrlEncode(bytes);
}

async function createSchema(env) {
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_push_vapid (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    public_key TEXT NOT NULL,
    private_jwk TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_push_subscriptions (
    endpoint TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    expiration_time INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_success_at TEXT,
    last_failure_at TEXT,
    failure_count INTEGER NOT NULL DEFAULT 0
  )`).run();

  await env.AUTH_DB.prepare(
    'CREATE INDEX IF NOT EXISTS idx_portal_push_username ON portal_push_subscriptions(username, updated_at DESC)'
  ).run();

  return true;
}

export async function ensurePushSchema(env) {
  const db = env?.AUTH_DB;
  if (!db || (typeof db !== 'object' && typeof db !== 'function')) return false;
  if (schemaPromises.has(db)) return schemaPromises.get(db);

  const operation = createSchema(env).catch((error) => {
    schemaPromises.delete(db);
    throw error;
  });
  schemaPromises.set(db, operation);
  return operation;
}

async function vapidRow(env) {
  await ensurePushSchema(env);
  let row = await env.AUTH_DB.prepare(
    'SELECT public_key AS publicKey, private_jwk AS privateJwk FROM portal_push_vapid WHERE id = 1'
  ).first();
  if (row?.publicKey && row?.privateJwk) return row;

  const pair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );
  const [privateJwk, publicJwk] = await Promise.all([
    crypto.subtle.exportKey('jwk', pair.privateKey),
    crypto.subtle.exportKey('jwk', pair.publicKey)
  ]);
  const publicKey = publicKeyFromJwk(publicJwk);

  await env.AUTH_DB.prepare(
    'INSERT OR IGNORE INTO portal_push_vapid(id, public_key, private_jwk) VALUES (1, ?, ?)'
  ).bind(publicKey, JSON.stringify(privateJwk)).run();

  row = await env.AUTH_DB.prepare(
    'SELECT public_key AS publicKey, private_jwk AS privateJwk FROM portal_push_vapid WHERE id = 1'
  ).first();

  if (!row?.publicKey || !row?.privateJwk) throw new Error('Não foi possível inicializar Web Push.');
  return row;
}

async function vapidAuthorization(env, endpoint, row = null) {
  const audience = pushEndpointAudience(endpoint);
  if (!audience) throw new Error('Endpoint Web Push inválido.');
  const config = row || await vapidRow(env);
  const privateJwk = JSON.parse(config.privateJwk);
  const key = await crypto.subtle.importKey(
    'jwk',
    privateJwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const now = Math.floor(Date.now() / 1000);
  const header = encodeJson({ typ: 'JWT', alg: 'ES256' });
  const payload = encodeJson({
    aud: audience,
    exp: now + VAPID_TTL_SECONDS,
    sub: String(env.PUSH_VAPID_SUBJECT || VAPID_SUBJECT_FALLBACK).trim() || VAPID_SUBJECT_FALLBACK
  });
  const unsigned = `${header}.${payload}`;
  const signature = new Uint8Array(await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(unsigned)
  ));

  if (signature.length !== 64) throw new Error('Assinatura VAPID incompatível.');
  return `vapid t=${unsigned}.${base64UrlEncode(signature)}, k=${config.publicKey}`;
}

async function markPushResult(env, endpoint, response) {
  if (response?.ok) {
    await env.AUTH_DB.prepare(`UPDATE portal_push_subscriptions
      SET last_success_at = CURRENT_TIMESTAMP, last_failure_at = NULL, failure_count = 0
      WHERE endpoint = ?`).bind(endpoint).run();
    return true;
  }

  const status = Number(response?.status || 0);
  if (status === 404 || status === 410) {
    await env.AUTH_DB.prepare('DELETE FROM portal_push_subscriptions WHERE endpoint = ?').bind(endpoint).run();
    return false;
  }

  await env.AUTH_DB.prepare(`UPDATE portal_push_subscriptions
    SET last_failure_at = CURRENT_TIMESTAMP, failure_count = MIN(failure_count + 1, 999)
    WHERE endpoint = ?`).bind(endpoint).run();
  return false;
}

async function sendEmptyPush(env, subscription, config) {
  const endpoint = endpointUrl(subscription?.endpoint);
  if (!endpoint) {
    if (subscription?.endpoint) {
      await env.AUTH_DB.prepare('DELETE FROM portal_push_subscriptions WHERE endpoint = ?')
        .bind(subscription.endpoint).run();
    }
    return false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PUSH_TIMEOUT_MS);
  try {
    const authorization = await vapidAuthorization(env, endpoint.toString(), config);
    const response = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: {
        Authorization: authorization,
        TTL: '300',
        Urgency: 'normal'
      },
      signal: controller.signal
    });
    return markPushResult(env, subscription.endpoint, response);
  } catch (_) {
    await markPushResult(env, subscription.endpoint, null).catch(() => {});
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function pruneSubscriptions(env, username) {
  await env.AUTH_DB.prepare(`DELETE FROM portal_push_subscriptions
    WHERE username = ? AND endpoint NOT IN (
      SELECT endpoint FROM portal_push_subscriptions
      WHERE username = ?
      ORDER BY updated_at DESC
      LIMIT ?
    )`).bind(username, username, MAX_SUBSCRIPTIONS_PER_USER).run();
}

export async function notifyUserPush(env, username) {
  const normalized = normalizeUsername(username);
  if (!normalized || !(await ensurePushSchema(env))) return { attempted: 0, accepted: 0 };

  const now = Date.now();
  await env.AUTH_DB.prepare(
    'DELETE FROM portal_push_subscriptions WHERE expiration_time IS NOT NULL AND expiration_time > 0 AND expiration_time <= ?'
  ).bind(now).run();

  const result = await env.AUTH_DB.prepare(`SELECT endpoint
    FROM portal_push_subscriptions
    WHERE username = ?
    ORDER BY updated_at DESC
    LIMIT ?`).bind(normalized, MAX_SUBSCRIPTIONS_PER_USER).all();
  const subscriptions = result.results || [];
  if (!subscriptions.length) return { attempted: 0, accepted: 0 };

  const config = await vapidRow(env);
  const settled = await Promise.allSettled(
    subscriptions.map((subscription) => sendEmptyPush(env, subscription, config))
  );
  const accepted = settled.filter((item) => item.status === 'fulfilled' && item.value === true).length;
  return { attempted: subscriptions.length, accepted };
}

export function isPushApi(pathname) {
  return String(pathname || '').startsWith('/api/push/');
}

export async function handlePushRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);

  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.', code: 'SESSION_REQUIRED' }, 401, origin);
  if (!(await ensurePushSchema(env))) {
    return json({ error: 'Banco de notificações ainda não disponível.' }, 503, origin);
  }

  const username = normalizeUsername(user.username);
  const url = new URL(request.url);

  if (url.pathname === '/api/push/config' && request.method === 'GET') {
    const config = await vapidRow(env);
    return json({
      enabled: true,
      publicKey: config.publicKey,
      maxSubscriptionsPerUser: MAX_SUBSCRIPTIONS_PER_USER
    }, 200, origin);
  }

  if (url.pathname === '/api/push/subscriptions' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const endpoint = endpointUrl(body.endpoint);
    if (!endpoint) return json({ error: 'Assinatura Web Push inválida.' }, 400, origin);

    const expiration = Number(body.expirationTime);
    const expirationTime = Number.isFinite(expiration) && expiration > 0 ? Math.trunc(expiration) : null;
    await env.AUTH_DB.prepare(`INSERT INTO portal_push_subscriptions(endpoint, username, expiration_time)
      VALUES (?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET
        username = excluded.username,
        expiration_time = excluded.expiration_time,
        updated_at = CURRENT_TIMESTAMP,
        last_failure_at = NULL,
        failure_count = 0`)
      .bind(endpoint.toString(), username, expirationTime).run();
    await pruneSubscriptions(env, username);
    return json({ ok: true }, 200, origin);
  }

  if (url.pathname === '/api/push/subscriptions' && request.method === 'DELETE') {
    const body = await request.json().catch(() => ({}));
    const endpoint = endpointUrl(body.endpoint);
    if (!endpoint) return json({ ok: true }, 200, origin);
    await env.AUTH_DB.prepare(
      'DELETE FROM portal_push_subscriptions WHERE username = ? AND endpoint = ?'
    ).bind(username, endpoint.toString()).run();
    return json({ ok: true }, 200, origin);
  }

  return json({ error: 'Rota Web Push não encontrada.' }, 404, origin);
}

export const PUSH_LIMITS = Object.freeze({
  maxSubscriptionsPerUser: MAX_SUBSCRIPTIONS_PER_USER,
  timeoutMs: PUSH_TIMEOUT_MS
});
