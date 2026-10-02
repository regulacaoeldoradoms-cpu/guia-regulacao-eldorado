import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  createChatRealtimeTicket,
  verifyChatRealtimeTicket,
  realtimeTicketFromRequest,
  realtimeProtocol
} from '../chat-realtime.js';

const read = (path) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
const env = { AUTH_SESSION_SECRET: 'unit-test-key-00000000000000000000' };

test('ticket realtime é curto, assinado, vinculado ao usuário e expira', async () => {
  const now = Date.parse('2026-10-02T20:00:00Z');
  const issued = await createChatRealtimeTicket(env, 'Usuario Teste', now);
  assert.equal(issued.protocol, 'portal-chat-v1');
  assert.ok(issued.ticket.includes('.'));
  const verified = await verifyChatRealtimeTicket(env, issued.ticket, now + 1000);
  assert.equal(verified.username, 'usuario.teste');

  const tampered = issued.ticket.slice(0, -1) + (issued.ticket.endsWith('a') ? 'b' : 'a');
  assert.equal(await verifyChatRealtimeTicket(env, tampered, now + 1000), null);
  assert.equal(await verifyChatRealtimeTicket(env, issued.ticket, now + 20000), null);
});

test('ticket realtime viaja em subprotocolo WebSocket sem colocar a sessão principal na URL', () => {
  const request = new Request('https://worker.example/api/chat/realtime', {
    headers: {
      Upgrade: 'websocket',
      'Sec-WebSocket-Protocol': realtimeProtocol() + ', ticket.assinado'
    }
  });
  assert.equal(realtimeTicketFromRequest(request), 'ticket.assinado');
  assert.equal(realtimeTicketFromRequest(new Request('https://worker.example/api/chat/realtime')), '');
});

test('Durable Object usa hibernação e não persiste conteúdo de mensagens', () => {
  const source = read('worker/chat-realtime-do.js');
  const wrangler = read('worker/wrangler.toml');
  assert.match(source, /extends DurableObject/);
  assert.match(source, /ctx\.acceptWebSocket/);
  assert.match(source, /ctx\.getWebSockets/);
  assert.match(source, /serializeAttachment/);
  assert.match(source, /webSocketMessage/);
  assert.match(source, /webSocketClose/);
  assert.match(source, /storage\.setAlarm/);
  assert.doesNotMatch(source, /storage\.put\([^\n]*(?:message|body|content)/i);
  assert.match(wrangler, /name = "CHAT_REALTIME"/);
  assert.match(wrangler, /class_name = "PortalChatRealtime"/);
  assert.match(wrangler, /new_sqlite_classes = \["PortalChatRealtime"\]/);
});

test('backend mantém autenticação REST e usa ticket separado no upgrade realtime', () => {
  const backend = read('worker/portal-chat-v2.js');
  assert.match(backend, /\/api\/chat\/realtime\/ticket/);
  assert.match(backend, /realtimeTicketFromRequest/);
  assert.match(backend, /verifyChatRealtimeTicket/);
  assert.match(backend, /activeChatUser/);
  assert.match(backend, /chatContact\(env/);
  assert.match(backend, /\/api\/chat\/typing/);
  assert.match(backend, /\/api\/chat\/read/);
  assert.match(backend, /broadcastChatRealtime/);
});
