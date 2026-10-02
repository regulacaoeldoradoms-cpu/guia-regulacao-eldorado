'use strict';

import { DurableObject } from 'cloudflare:workers';
import { realtimeProtocol } from './chat-realtime.js';

const PRESENCE_GRACE_MS = 4000;
const MAX_CONTACTS = 300;
const INTERNAL_BASE = 'https://portal-chat-realtime.internal';

function normalizeUsername(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
    .replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '').replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '').slice(0, 40);
}

function serverTimestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function safeEvent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const type = String(value.type || '').slice(0, 32);
  if (!['message', 'receipt', 'typing', 'presence', 'contact-refresh'].includes(type)) return null;
  return { ...value, type };
}

export class PortalChatRealtime extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  async configuration() {
    const stored = await this.ctx.storage.get(['username', 'contacts']);
    return {
      username: normalizeUsername(stored.get('username') || ''),
      contacts: Array.isArray(stored.get('contacts'))
        ? stored.get('contacts').map(normalizeUsername).filter(Boolean).slice(0, MAX_CONTACTS)
        : []
    };
  }

  openSockets() {
    return this.ctx.getWebSockets().filter((socket) => socket.readyState === WebSocket.OPEN);
  }

  sendLocal(event) {
    const payload = JSON.stringify(event);
    let sent = 0;
    for (const socket of this.ctx.getWebSockets()) {
      if (socket.readyState !== WebSocket.OPEN) continue;
      try {
        socket.send(payload);
        sent += 1;
      } catch (_) {}
    }
    return sent;
  }

  async sendToUser(username, event) {
    const normalized = normalizeUsername(username);
    if (!normalized || !this.env?.CHAT_REALTIME?.getByName) return false;
    try {
      const stub = this.env.CHAT_REALTIME.getByName(normalized);
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

  async broadcastPresence(online) {
    const { username, contacts } = await this.configuration();
    if (!username || !contacts.length) return;
    const event = {
      type: 'presence',
      username,
      online: Boolean(online),
      lastSeen: serverTimestamp()
    };
    await Promise.allSettled(contacts.map((contact) => this.sendToUser(contact, event)));
  }

  async configure(request) {
    const body = await request.json().catch(() => ({}));
    const username = normalizeUsername(body.username);
    const contacts = Array.from(new Set(
      (Array.isArray(body.contacts) ? body.contacts : [])
        .map(normalizeUsername)
        .filter(Boolean)
        .filter((value) => value !== username)
    )).slice(0, MAX_CONTACTS);
    if (!username) return new Response('Invalid user', { status: 400 });
    await this.ctx.storage.put({ username, contacts });
    return new Response(null, { status: 204 });
  }

  async connect(request) {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }
    const username = normalizeUsername(request.headers.get('X-Portal-Chat-User'));
    const config = await this.configuration();
    if (!username || !config.username || username !== config.username) {
      return new Response('Realtime identity mismatch', { status: 403 });
    }

    const hadOpenSockets = this.openSockets().length > 0;
    await this.ctx.storage.deleteAlarm().catch(() => {});
    await this.ctx.storage.delete('offlinePendingAt').catch(() => {});

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server, ['portal-chat']);
    server.serializeAttachment({ username, connectedAt: Date.now() });

    server.send(JSON.stringify({
      type: 'ready',
      protocol: realtimeProtocol(),
      at: serverTimestamp()
    }));

    if (!hadOpenSockets) {
      await this.broadcastPresence(true);
    }

    return new Response(null, {
      status: 101,
      webSocket: client,
      headers: { 'Sec-WebSocket-Protocol': realtimeProtocol() }
    });
  }

  async receiveEvent(request) {
    const event = safeEvent(await request.json().catch(() => null));
    if (!event) return new Response('Invalid event', { status: 400 });
    const sent = this.sendLocal(event);
    return Response.json({ ok: true, sent });
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/health' && request.method === 'GET') {
      return Response.json({ ok: true, protocol: realtimeProtocol() });
    }
    if (url.pathname === '/contacts' && request.method === 'POST') return this.configure(request);
    if (url.pathname === '/event' && request.method === 'POST') return this.receiveEvent(request);
    if (url.pathname === '/connect' && request.method === 'GET') return this.connect(request);
    return new Response('Not found', { status: 404 });
  }

  async webSocketMessage(_socket, message) {
    if (message === 'ping') return;
    // O canal é servidor -> cliente. Mensagens funcionais continuam nas APIs autenticadas.
  }

  async scheduleOfflineIfEmpty() {
    if (this.openSockets().length > 0) return;
    const pendingAt = Date.now() + PRESENCE_GRACE_MS;
    await this.ctx.storage.put('offlinePendingAt', pendingAt);
    await this.ctx.storage.setAlarm(pendingAt);
  }

  async webSocketClose(_socket, _code, _reason, _wasClean) {
    await this.scheduleOfflineIfEmpty();
  }

  async webSocketError(_socket, _error) {
    await this.scheduleOfflineIfEmpty();
  }

  async alarm() {
    if (this.openSockets().length > 0) {
      await this.ctx.storage.delete('offlinePendingAt').catch(() => {});
      return;
    }
    const pendingAt = Number(await this.ctx.storage.get('offlinePendingAt') || 0);
    if (!pendingAt) return;
    await this.ctx.storage.delete('offlinePendingAt').catch(() => {});

    const { username } = await this.configuration();
    if (username && this.env?.AUTH_DB) {
      await this.env.AUTH_DB.prepare(`UPDATE portal_chat_presence
        SET last_seen = datetime('now', '-120 seconds')
        WHERE username = ?`).bind(username).run().catch(() => {});
    }
    await this.broadcastPresence(false);
  }
}
