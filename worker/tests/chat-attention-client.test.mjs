import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

// Real client and Durable Object code, with synthetic DOM/socket adapters only.
// No browser session, network, D1, notifications or persistent storage is used.
// CHAT_ATTENTION_SOURCE_DIR permits the same assertions against a frozen baseline.
const sourceRoot = process.env.CHAT_ATTENTION_SOURCE_DIR || fileURLToPath(new URL('../../', import.meta.url));
const read = name => readFileSync(resolve(sourceRoot, name), 'utf8');
const clientSource = read('js/portal-chat.js').replace('  window.PortalChat = Object.freeze({', `
  window.attentionFixture = {
    start, connectRealtime, sendAttention, handleRealtimeEvent, updateAttentionButton,
    prepare(user, people) { mounted = true; currentUser = user; contacts = people; },
    select(contact) { activeContact = contact; updateAttentionButton(); }
  };
  window.PortalChat = Object.freeze({`);

function clock() {
  let now = Date.parse('2026-10-03T02:00:00Z'), sequence = 0;
  const jobs = new Map();
  const schedule = (fn, delay, interval = false) => {
    const id = ++sequence;
    jobs.set(id, { fn, at: now + Number(delay || 0), interval: interval ? Number(delay) : 0 });
    return id;
  };
  return {
    Date: class extends Date { static now() { return now; } },
    now: () => now,
    setTimeout: (fn, delay) => schedule(fn, delay),
    setInterval: (fn, delay) => schedule(fn, delay, true),
    clear: id => jobs.delete(id),
    advance(ms) {
      const end = now + ms;
      for (;;) {
        const next = [...jobs].filter(([, job]) => job.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        const [id, job] = next;
        now = job.at;
        if (job.interval) job.at += job.interval;
        else jobs.delete(id);
        job.fn();
      }
      now = end;
    }
  };
}

function node() {
  const classes = new Set(), attrs = new Map();
  return {
    textContent: '', innerHTML: '', value: '', hidden: false, disabled: false, title: '', dataset: {},
    offsetWidth: 220, scrollHeight: 0, scrollTop: 0, clientHeight: 300,
    classList: {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      contains: name => classes.has(name),
      toggle(name, force) { const on = force ?? !classes.has(name); if (on) classes.add(name); else classes.delete(name); return on; }
    },
    setAttribute: (name, value) => attrs.set(name, String(value)),
    getAttribute: name => attrs.get(name),
    querySelector: () => null, appendChild() {}, insertBefore() {}, focus() {}, addEventListener() {}
  };
}

async function microtasks() { for (let i = 0; i < 25; i++) await Promise.resolve(); }

function client(username, peer, { holdTickets = false } = {}) {
  const time = clock(), nodes = new Map(), listeners = new Map(), sockets = [], calls = [], ticketResolvers = [];
  const user = { username, name: 'Pessoa fictícia ' + username, role: 'medico' };
  const contact = { username: peer, name: 'Pessoa fictícia ' + peer, role: 'medico', online: true, unread: 0 };
  const get = id => { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); };
  const document = {
    readyState: 'loading', hidden: false,
    getElementById: get,
    querySelector: selector => selector === '.portal-chat-panel' ? get('panel') : null,
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(fn); }
  };
  class Socket {
    static CONNECTING = 0; static OPEN = 1; static CLOSING = 2; static CLOSED = 3;
    readyState = 0; handlers = new Map(); outbound = []; relay = null;
    constructor() { sockets.push(this); }
    addEventListener(type, fn) { if (!this.handlers.has(type)) this.handlers.set(type, []); this.handlers.get(type).push(fn); }
    emit(type, event = {}) { for (const fn of this.handlers.get(type) || []) fn(event); }
    open() { this.readyState = 1; this.emit('open'); }
    close() { this.readyState = 3; this.emit('close'); }
    receive(event) { this.emit('message', { data: JSON.stringify(event) }); }
    send(raw) { assert.equal(this.readyState, 1); this.outbound.push(raw); this.relay?.(raw); }
  }
  const window = {
    REGULATION_AUTH_CONFIG: { endpoint: 'https://chat-fixture.invalid' },
    RegulationAuth: { me: async () => user, authorizationHeader: () => ({}) },
    WebSocket: Socket,
    setTimeout: time.setTimeout, setInterval: time.setInterval, clearTimeout: time.clear, clearInterval: time.clear,
    addEventListener() {}, requestAnimationFrame: fn => time.setTimeout(fn, 16)
  };
  const scope = {
    window, document, navigator: {}, WebSocket: Socket, Date: time.Date,
    URL, URLSearchParams, Event, location: { pathname: '/', search: '', href: 'https://chat-fixture.invalid/' },
    fetch: async (url, options = {}) => {
      const path = new URL(url).pathname;
      calls.push({ path, method: options.method || 'GET' });
      if (path.endsWith('/ticket') && holdTickets) await new Promise(resolveTicket => ticketResolvers.push(resolveTicket));
      const payload = path.endsWith('/ticket') ? { ticket: 'synthetic-ticket', protocol: 'portal-chat-v1' }
        : path.endsWith('/users') ? { users: [contact] } : path.endsWith('/messages') ? { messages: [] } : { ok: true };
      return { ok: true, json: async () => payload };
    }
  };
  runInNewContext(clientSource, scope, { filename: 'portal-chat.js' });
  window.attentionFixture.prepare(user, [contact]);
  return {
    time, get, sockets, calls, contact, ticketResolvers, api: window.attentionFixture, document,
    async boot() {
      await window.attentionFixture.start();
      await microtasks();
      sockets.at(-1).open();
      await microtasks();
      window.attentionFixture.select(contact);
    },
    async visible(value) {
      document.hidden = !value;
      for (const fn of listeners.get('visibilitychange') || []) fn();
      await microtasks();
    }
  };
}

function relay(clients) {
  const pending = new Set(), objects = new Map(), forbidden = [];
  const reject = operation => () => { forbidden.push(operation); throw new Error('Unexpected ' + operation); };
  const scope = {
    URL, Request, Response, Date: clients[0].time.Date, WebSocket: { OPEN: 1 },
    WebSocketRequestResponsePair: class {},
    DurableObject: class { constructor(ctx, env) { this.ctx = ctx; this.env = env; } },
    realtimeProtocol: () => 'portal-chat-v1', persistAtomicChatMessage: reject('message'), notifyUserPush: reject('push')
  };
  runInNewContext(read('worker/chat-realtime-do.js').replace(/^import .*;$/gm, '')
    .replace('export class PortalChatRealtime', 'class PortalChatRealtime') + '\nthis.PortalChatRealtime = PortalChatRealtime;', scope);
  const env = {
    AUTH_DB: { prepare: reject('D1') },
    CHAT_REALTIME: { getByName: username => ({ fetch: (url, options) => objects.get(username).fetch(new Request(url, options)) }) }
  };
  for (const c of clients) {
    const username = c.contact.username === 'recipient' ? 'sender' : 'recipient';
    const socket = c.sockets.at(-1);
    let attachment = { username, sessionVersion: 1 };
    const serverSocket = {
      get readyState() { return socket.readyState; },
      send: raw => socket.receive(JSON.parse(raw)),
      deserializeAttachment: () => structuredClone(attachment), serializeAttachment: value => { attachment = structuredClone(value); }
    };
    const stored = new Map([['username', username], ['contacts', [c.contact.username]]]);
    const ctx = {
      setWebSocketAutoResponse() {}, getWebSockets: () => [serverSocket],
      storage: { get: async keys => new Map(keys.map(key => [key, stored.get(key)])), put: reject('storage write') }
    };
    const object = new scope.PortalChatRealtime(ctx, env);
    objects.set(username, object);
    socket.relay = raw => {
      const task = object.webSocketMessage(serverSocket, raw);
      pending.add(task);
      task.finally(() => pending.delete(task));
    };
  }
  return { forbidden, async flush() { while (pending.size) await Promise.all([...pending]); await microtasks(); } };
}

async function pair() {
  const sender = client('sender', 'recipient'), recipient = client('recipient', 'sender');
  await sender.boot(); await recipient.boot();
  return { sender, recipient, link: relay([sender, recipient]) };
}

test('dois clientes recebem o efeito correto e o clique respeita cooldown sem gravar mensagem', async () => {
  const { sender, recipient, link } = await pair();
  sender.api.sendAttention(); await link.flush();
  assert.equal(recipient.get('portalChatLauncher').classList.contains('attention-hit'), true);
  assert.equal(recipient.get('panel').classList.contains('attention-hit'), false);
  assert.equal(sender.get('portalChatStatus').textContent, 'Atenção enviada.');
  assert.equal(sender.get('portalChatAttention').disabled, true);
  sender.api.sendAttention(); await link.flush();
  assert.equal(sender.sockets[0].outbound.filter(raw => JSON.parse(raw).type === 'attention').length, 1);
  recipient.time.advance(1801);
  assert.equal(recipient.get('portalChatLauncher').classList.contains('attention-hit'), false);
  assert.deepEqual(link.forbidden, []);
  assert.equal(sender.calls.some(call => call.path.endsWith('/messages') && call.method !== 'GET'), false);
});

test('painel aberto recebe destaque no cabeçalho e nome do remetente, sem sacudir launcher', async () => {
  const { sender, recipient, link } = await pair();
  recipient.get('portalChatRoot').classList.add('open');
  sender.api.sendAttention(); await link.flush();
  assert.equal(recipient.get('panel').classList.contains('attention-hit'), true);
  assert.equal(recipient.get('portalChatLauncher').classList.contains('attention-hit'), false);
  assert.match(recipient.get('portalChatStatus').textContent, /Pessoa fictícia sender chamou sua atenção/);
});

test('destinatário desconectado apresenta indisponibilidade ao remetente sem falso sucesso', async () => {
  const { sender, recipient, link } = await pair();
  recipient.sockets[0].readyState = 3;
  sender.api.sendAttention(); await link.flush();
  assert.match(sender.get('portalChatStatus').textContent, /sem conexão/);
  assert.equal(recipient.get('portalChatLauncher').classList.contains('attention-hit'), false);
  assert.deepEqual(link.forbidden, []);
});

test('atenção recebida em aba oculta aparece quando voltar antes de 15 segundos', async () => {
  const { sender, recipient, link } = await pair();
  await recipient.visible(false);
  sender.api.sendAttention(); await link.flush();
  recipient.time.advance(2200);
  await recipient.visible(true);
  assert.equal(recipient.get('portalChatLauncher').classList.contains('attention-hit'), true);
});

test('atenção recebida em aba oculta expira e não reaparece depois de 15 segundos', async () => {
  const { sender, recipient, link } = await pair();
  await recipient.visible(false);
  sender.api.sendAttention(); await link.flush();
  recipient.time.advance(15001);
  await recipient.visible(true);
  assert.equal(recipient.get('portalChatLauncher').classList.contains('attention-hit'), false);
});

test('resposta de outra tentativa é ignorada e ausência de ACK resolve em erro após 4 segundos', async () => {
  const sender = client('sender', 'recipient'); await sender.boot();
  sender.api.sendAttention();
  sender.sockets[0].receive({ type: 'attention-ack', with: 'recipient', requestId: 'attention-obsolete', cooldownMs: 5000 });
  assert.doesNotMatch(sender.get('portalChatStatus').textContent, /Atenção enviada/);
  sender.time.advance(4001);
  assert.match(sender.get('portalChatStatus').textContent, /Não foi possível confirmar/);
  sender.time.advance(1050);
  assert.equal(sender.get('portalChatAttention').disabled, false);
});

test('fechamento de socket antigo não desativa chamar atenção no socket atual', async () => {
  const sender = client('sender', 'recipient', { holdTickets: true });
  sender.api.select(sender.contact);
  const first = sender.api.connectRealtime(), second = sender.api.connectRealtime();
  assert.equal(sender.ticketResolvers.length, 2);
  sender.ticketResolvers[0](); await first;
  sender.sockets[0].open();
  sender.ticketResolvers[1](); await second;
  sender.sockets[1].open();
  sender.sockets[0].close();
  assert.equal(sender.get('portalChatAttention').disabled, false);
  sender.api.sendAttention();
  assert.equal(sender.sockets[1].outbound.filter(raw => JSON.parse(raw).type === 'attention').length, 1);
});
