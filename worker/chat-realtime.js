'use strict';

const REALTIME_PROTOCOL = 'portal-chat-v1';
const REALTIME_TICKET_TTL_MS = 15000;
const INTERNAL_BASE = 'https://portal-chat-realtime.internal';

function utf8(value) {
  return new TextEncoder().encode(String(value || ''));
}

function base64UrlEncodeBytes(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecodeBytes(value) {
  const input = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = input + '='.repeat((4 - (input.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function base64UrlEncodeJson(value) {
  return base64UrlEncodeBytes(utf8(JSON.stringify(value)));
}

function base64UrlDecodeJson(value) {
  return JSON.parse(new TextDecoder().decode(base64UrlDecodeBytes(value)));
}

function normalizeRealtimeUsername(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
    .replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '').replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '').slice(0, 40);
}

async function ticketKey(env) {
  const secret = String(env?.AUTH_SESSION_SECRET || '').trim();
  if (!secret) return null;
  return crypto.subtle.importKey(
    'raw',
    utf8('portal-chat-realtime-v1\0' + secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export function realtimeProtocol() {
  return REALTIME_PROTOCOL;
}

export function realtimeTicketFromRequest(request) {
  const values = String(request?.headers?.get?.('Sec-WebSocket-Protocol') || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (!values.includes(REALTIME_PROTOCOL)) return '';
  return values.find((value) => value !== REALTIME_PROTOCOL) || '';
}

export async function createChatRealtimeTicket(env, username, sessionVersion = 0, now = Date.now()) {
  const normalized = normalizeRealtimeUsername(username);
  const version = Math.max(0, Number.parseInt(String(sessionVersion || '0'), 10) || 0);
  const key = await ticketKey(env);
  if (!normalized || !version || !key) return null;
  const payload = base64UrlEncodeJson({
    v: 2,
    scope: 'portal-chat-realtime',
    u: normalized,
    sv: version,
    iat: now,
    exp: now + REALTIME_TICKET_TTL_MS
  });
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, utf8(payload)));
  return {
    ticket: payload + '.' + base64UrlEncodeBytes(signature),
    expiresAt: now + REALTIME_TICKET_TTL_MS,
    protocol: REALTIME_PROTOCOL
  };
}

export async function verifyChatRealtimeTicket(env, ticket, now = Date.now()) {
  const parts = String(ticket || '').split('.');
  if (parts.length !== 2) return null;
  const key = await ticketKey(env);
  if (!key) return null;
  let signature;
  let payload;
  try {
    signature = base64UrlDecodeBytes(parts[1]);
    payload = base64UrlDecodeJson(parts[0]);
  } catch (_) {
    return null;
  }
  const valid = await crypto.subtle.verify('HMAC', key, signature, utf8(parts[0])).catch(() => false);
  if (!valid) return null;
  const username = normalizeRealtimeUsername(payload?.u);
  if (
    payload?.v !== 2
    || payload?.scope !== 'portal-chat-realtime'
    || !username
    || !Number(payload?.sv || 0)
    || Number(payload?.exp || 0) < now
    || Number(payload?.iat || 0) > now + 5000
    || Number(payload?.exp || 0) - Number(payload?.iat || 0) > REALTIME_TICKET_TTL_MS + 1000
  ) return null;
  return {
    username,
    sessionVersion: Math.max(0, Number.parseInt(String(payload.sv || '0'), 10) || 0),
    expiresAt: Number(payload.exp)
  };
}

function realtimeStub(env, username) {
  const normalized = normalizeRealtimeUsername(username);
  if (!normalized || !env?.CHAT_REALTIME?.getByName) return null;
  try {
    return env.CHAT_REALTIME.getByName(normalized);
  } catch (_) {
    return null;
  }
}

export async function probeChatRealtime(env) {
  const stub = realtimeStub(env, '__portal_chat_health__');
  if (!stub) return false;
  try {
    const response = await stub.fetch(INTERNAL_BASE + '/health', { method: 'GET' });
    if (!response.ok) return false;
    const payload = await response.json().catch(() => ({}));
    return payload?.ok === true && payload?.protocol === REALTIME_PROTOCOL;
  } catch (_) {
    return false;
  }
}

export async function configureChatRealtimeContacts(env, username, contactUsernames) {
  const stub = realtimeStub(env, username);
  if (!stub) return false;
  const contacts = Array.from(new Set(
    (Array.isArray(contactUsernames) ? contactUsernames : [])
      .map(normalizeRealtimeUsername)
      .filter(Boolean)
      .filter((value) => value !== normalizeRealtimeUsername(username))
  )).slice(0, 300);
  try {
    const response = await stub.fetch(INTERNAL_BASE + '/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalizeRealtimeUsername(username), contacts })
    });
    return response.ok;
  } catch (_) {
    return false;
  }
}

export async function broadcastChatRealtime(env, username, event) {
  const stub = realtimeStub(env, username);
  if (!stub || !event || typeof event !== 'object') return false;
  try {
    const response = await stub.fetch(INTERNAL_BASE + '/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    return response.ok;
  } catch (_) {
    return false;
  }
}

export async function upgradeChatRealtime(request, env, username, sessionVersion) {
  const stub = realtimeStub(env, username);
  const version = Math.max(0, Number.parseInt(String(sessionVersion || '0'), 10) || 0);
  if (!stub || !version) return new Response('Tempo real indisponível.', { status: 503 });
  const headers = new Headers();
  headers.set('Upgrade', 'websocket');
  headers.set('Sec-WebSocket-Protocol', REALTIME_PROTOCOL);
  headers.set('X-Portal-Chat-User', normalizeRealtimeUsername(username));
  headers.set('X-Portal-Chat-Session-Version', String(version));
  const forwarded = new Request(INTERNAL_BASE + '/connect', {
    method: 'GET',
    headers
  });
  return stub.fetch(forwarded);
}

export const CHAT_REALTIME_TEST = Object.freeze({
  protocol: REALTIME_PROTOCOL,
  ticketTtlMs: REALTIME_TICKET_TTL_MS,
  normalizeRealtimeUsername
});
