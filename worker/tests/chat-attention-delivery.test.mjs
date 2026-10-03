import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const durableSource = readFileSync(new URL('../chat-realtime-do.js', import.meta.url), 'utf8')
  .replace(/^import .*;$/gm, '')
  .replace('export class PortalChatRealtime', 'class PortalChatRealtime')
  + '\nthis.PortalChatRealtime = PortalChatRealtime;';

function fixture() {
  let now = Date.parse('2026-10-03T02:00:00Z');
  const forbiddenCalls = [];
  const forbid = (operation) => () => {
    forbiddenCalls.push(operation);
    throw new Error('Unexpected ' + operation);
  };
  const scope = {
    URL, Request, Response,
    Date: class extends Date { static now() { return now; } },
    WebSocket: { OPEN: 1 },
    WebSocketRequestResponsePair: class {},
    DurableObject: class { constructor(ctx, env) { this.ctx = ctx; this.env = env; } },
    realtimeProtocol: () => 'portal-chat-v1',
    persistAtomicChatMessage: forbid('message persistence'),
    notifyUserPush: forbid('Web Push')
  };
  runInNewContext(durableSource, scope, { filename: 'chat-realtime-do.js' });

  const objects = new Map();
  const failures = new Map();
  const forwarded = [];
  const env = {
    AUTH_DB: { prepare: forbid('D1') },
    CHAT_REALTIME: {
      getByName(username) {
        return {
          async fetch(url, options) {
            forwarded.push(username);
            if (failures.has(username)) return failures.get(username)();
            return objects.get(username).fetch(new Request(url, options));
          }
        };
      }
    }
  };

  const addUser = (username, contacts = []) => {
    const socket = {
      readyState: 1,
      events: [],
      attachment: { username, sessionVersion: 1 },
      send(message) { this.events.push(JSON.parse(message)); },
      deserializeAttachment() { return structuredClone(this.attachment); },
      serializeAttachment(value) { this.attachment = structuredClone(value); }
    };
    const stored = new Map([['username', username], ['contacts', contacts]]);
    const ctx = {
      setWebSocketAutoResponse() {},
      getWebSockets: () => [socket],
      storage: {
        async get(keys) {
          return Array.isArray(keys) ? new Map(keys.map((key) => [key, stored.get(key)])) : stored.get(keys);
        },
        put: forbid('Durable Object storage write')
      }
    };
    const user = { socket, ctx, object: new scope.PortalChatRealtime(ctx, env) };
    objects.set(username, user.object);
    return user;
  };

  return {
    addUser, failures, forwarded, forbiddenCalls,
    advance(ms) { now += ms; },
    rehydrate(user) { user.object = new scope.PortalChatRealtime(user.ctx, env); },
    send(user, target, requestId) {
      return user.object.webSocketMessage(user.socket, JSON.stringify({ type: 'attention', with: target, requestId }));
    }
  };
}

test('atenção percorre dois Durable Objects e confirma somente após alcançar socket do destinatário', async () => {
  const f = fixture();
  const sender = f.addUser('sender', ['recipient']);
  const recipient = f.addUser('recipient', ['sender']);
  await f.send(sender, 'recipient');

  assert.equal(recipient.socket.events.length, 1);
  assert.equal(recipient.socket.events[0].type, 'attention');
  assert.equal(recipient.socket.events[0].username, 'sender');
  assert.deepEqual(sender.socket.events, [{ type: 'attention-ack', with: 'recipient', cooldownMs: 5000 }]);
  assert.deepEqual(f.forbiddenCalls, []);
});

test('atenção informa contato desconectado sem confirmar uma entrega inexistente', async () => {
  const f = fixture();
  const sender = f.addUser('sender', ['recipient']);
  const recipient = f.addUser('recipient', ['sender']);
  recipient.socket.readyState = 3;
  await f.send(sender, 'recipient');

  assert.deepEqual(recipient.socket.events, []);
  assert.equal(sender.socket.events.length, 1);
  assert.equal(sender.socket.events[0].type, 'attention-error');
  assert.equal(sender.socket.events[0].code, 'CHAT_ATTENTION_OFFLINE');
  assert.equal(sender.socket.events[0].with, 'recipient');
  assert.equal(sender.socket.events[0].cooldownMs, 5000);
  assert.deepEqual(f.forbiddenCalls, []);
});

test('atenção distingue falha de transporte e resposta inválida de contato offline', async () => {
  const responses = [
    () => { throw new Error('Network failure'); },
    () => new Response('Unavailable', { status: 503 }),
    () => Response.json({ ok: true }),
    () => Response.json({ ok: false, sent: 1 })
  ];
  for (const response of responses) {
    const f = fixture();
    const sender = f.addUser('sender', ['recipient']);
    f.failures.set('recipient', response);
    await f.send(sender, 'recipient');
    assert.equal(sender.socket.events.length, 1);
    assert.equal(sender.socket.events[0].type, 'attention-error');
    assert.equal(sender.socket.events[0].code, 'CHAT_ATTENTION_DELIVERY_FAILED');
    assert.equal(sender.socket.events[0].with, 'recipient');
    assert.deepEqual(f.forbiddenCalls, []);
  }
});

test('atenção recusa explicitamente contato não autorizado e envio para si mesmo sem encaminhar', async () => {
  for (const target of ['outsider', 'sender']) {
    const f = fixture();
    const sender = f.addUser('sender', ['recipient']);
    await f.send(sender, target);
    assert.equal(sender.socket.events.length, 1);
    assert.equal(sender.socket.events[0].type, 'attention-error');
    assert.equal(sender.socket.events[0].code, 'CHAT_ATTENTION_NOT_ALLOWED');
    assert.equal(sender.socket.events[0].with, target);
    assert.deepEqual(f.forwarded, []);
    assert.deepEqual(f.forbiddenCalls, []);
  }
});

test('cooldown de atenção sobrevive à hibernação, dura 5 segundos e permanece separado por destinatário', async () => {
  const f = fixture();
  const sender = f.addUser('sender', ['recipient', 'other']);
  const recipient = f.addUser('recipient');
  const other = f.addUser('other');
  await f.send(sender, 'recipient');
  f.rehydrate(sender);
  await f.send(sender, 'recipient');
  assert.equal(recipient.socket.events.length, 1);
  assert.deepEqual(sender.socket.events.at(-1), { type: 'attention-cooldown', with: 'recipient', retryAfterMs: 5000 });

  await f.send(sender, 'other');
  assert.equal(other.socket.events.length, 1);
  f.advance(5000);
  await f.send(sender, 'recipient');
  assert.equal(recipient.socket.events.length, 2);
  assert.equal(sender.socket.events.at(-1).type, 'attention-ack');
  assert.deepEqual(f.forbiddenCalls, []);
});

test('ponte de eventos preserva retorno booleano para os callers existentes', async () => {
  const f = fixture();
  const sender = f.addUser('sender', ['recipient']);
  const recipient = f.addUser('recipient');
  recipient.socket.readyState = 3;
  assert.equal(await sender.object.sendToUser('recipient', { type: 'typing', username: 'sender', active: true }), true);
  f.failures.set('recipient', () => new Response(null, { status: 503 }));
  assert.equal(await sender.object.sendToUser('recipient', { type: 'typing', username: 'sender', active: true }), false);
  assert.deepEqual(f.forbiddenCalls, []);
});

test('atenção correlaciona ACK, cooldown e erros com requestId limitado sem encaminhá-lo ao destinatário', async () => {
  const f = fixture();
  const sender = f.addUser('sender', ['recipient', 'offline']);
  const recipient = f.addUser('recipient');
  const offline = f.addUser('offline');
  offline.socket.readyState = 3;
  await f.send(sender, 'recipient', 'attention-request-1');
  assert.equal(sender.socket.events.at(-1).requestId, 'attention-request-1');
  assert.equal(recipient.socket.events[0].requestId, undefined);

  await f.send(sender, 'recipient', 'attention-request-2');
  assert.equal(sender.socket.events.at(-1).type, 'attention-cooldown');
  assert.equal(sender.socket.events.at(-1).requestId, 'attention-request-2');

  await f.send(sender, 'offline', 'attention-request-3');
  assert.equal(sender.socket.events.at(-1).code, 'CHAT_ATTENTION_OFFLINE');
  assert.equal(sender.socket.events.at(-1).requestId, 'attention-request-3');

  await f.send(sender, 'outsider', 'attention-request-4');
  assert.equal(sender.socket.events.at(-1).code, 'CHAT_ATTENTION_NOT_ALLOWED');
  assert.equal(sender.socket.events.at(-1).requestId, 'attention-request-4');

  await f.send(sender, 'outsider', '<unsafe>!' + 'x'.repeat(100));
  assert.match(sender.socket.events.at(-1).requestId, /^[a-zA-Z0-9_-]{80}$/);
  assert.deepEqual(f.forbiddenCalls, []);
});
