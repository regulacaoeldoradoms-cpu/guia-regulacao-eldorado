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
  const issued = await createChatRealtimeTicket(env, 'Usuario Teste', 7, now);
  assert.equal(issued.protocol, 'portal-chat-v1');
  assert.ok(issued.ticket.includes('.'));
  const verified = await verifyChatRealtimeTicket(env, issued.ticket, now + 1000);
  assert.equal(verified.username, 'usuario.teste');
  assert.equal(verified.sessionVersion, 7);

  const tampered = issued.ticket.slice(0, -1) + (issued.ticket.endsWith('a') ? 'b' : 'a');
  assert.equal(await verifyChatRealtimeTicket(env, tampered, now + 1000), null);
  assert.equal(await verifyChatRealtimeTicket(env, issued.ticket, now + 20000), null);
  assert.equal(await createChatRealtimeTicket(env, 'Usuario Teste', 0, now), null);
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
  assert.match(source, /url\.pathname === '\/health'/);
  assert.doesNotMatch(source, /storage\.put\([^\n]*(?:message|body|content)/i);
  assert.match(wrangler, /name = "CHAT_REALTIME"/);
  assert.match(wrangler, /class_name = "PortalChatRealtime"/);
  assert.match(wrangler, /new_sqlite_classes = \["PortalChatRealtime"\]/);
});

test('backend mantém autenticação REST e usa ticket separado no upgrade realtime', () => {
  const backend = read('worker/portal-chat-v2.js');
  assert.match(backend, /\/api\/chat\/realtime\/health/);
  assert.match(backend, /\/api\/chat\/realtime\/ticket/);
  assert.match(backend, /realtimeTicketFromRequest/);
  assert.match(backend, /verifyChatRealtimeTicket/);
  assert.match(backend, /activeChatUser/);
  assert.match(backend, /verifyPortalSessionToken/);
  assert.match(backend, /validateChatSession/);
  assert.match(backend, /chatContactAllowed\(env/);
  assert.match(backend, /\/api\/chat\/typing/);
  assert.match(backend, /\/api\/chat\/read/);
  assert.match(backend, /broadcastChatRealtime/);
  assert.match(backend, /verified\.sessionVersion/);
  assert.match(backend, /upgradeChatRealtime\(request, env, username, verified\.sessionVersion\)/);
});

test('Durable Object recebe envio, confirma antes das tarefas secundárias e mantém fallback fora do socket', () => {
  const durable = read('worker/chat-realtime-do.js');
  const bridge = read('worker/chat-realtime.js');
  const atomic = read('worker/chat-send-atomic.js');

  assert.match(durable, /payload\?\.type === 'send'/);
  assert.match(durable, /persistAtomicChatMessage/);
  assert.match(durable, /type: 'send-ack'/);
  assert.match(durable, /type: 'send-error'/);
  assert.match(durable, /notifyUserPush/);
  assert.match(durable, /sendToUser\(result\.message\.toUser/);
  assert.match(durable, /deserializeAttachment/);
  assert.match(durable, /sessionVersion/);
  const ackAt = durable.indexOf("type: 'send-ack'");
  const secondaryAt = durable.indexOf('Promise.allSettled([');
  assert.ok(ackAt >= 0 && secondaryAt > ackAt, 'ACK deve ser enviado antes de push e entrega ao destinatário');

  assert.match(bridge, /X-Portal-Chat-Session-Version/);
  assert.match(bridge, /sv: version/);
  assert.match(atomic, /INSERT OR IGNORE INTO portal_chat_messages/);
  assert.match(atomic, /sender\.session_version = \?/);
  assert.match(atomic, /target\.active = 1/);
  assert.match(atomic, /relationship\.state = 'friends'/);
  assert.match(atomic, /CASE\s+WHEN sender\.role IN/s);
});


test('chamar atenção é evento efêmero do WebSocket com cooldown hibernável e sem D1', () => {
  const durable = read('worker/chat-realtime-do.js');

  assert.match(durable, /ATTENTION_COOLDOWN_MS = 5000/);
  assert.match(durable, /'attention'/);
  assert.match(durable, /payload\?\.type === 'attention'/);
  assert.match(durable, /type: 'attention-ack'/);
  assert.match(durable, /type: 'attention-cooldown'/);
  assert.match(durable, /deserializeAttachment/);
  assert.match(durable, /serializeAttachment\(\{ \.\.\.attachment, attentionCooldowns: cooldowns \}\)/);

  const start = durable.indexOf("if (payload?.type === 'attention')");
  const end = durable.indexOf("if (payload?.type !== 'typing')", start);
  const block = durable.slice(start, end);
  assert.match(block, /sendToUser\(target/);
  assert.doesNotMatch(block, /AUTH_DB|prepare\(|portal_chat_messages/);
  assert.doesNotMatch(block, /storage\.put|storage\.get/);
});
