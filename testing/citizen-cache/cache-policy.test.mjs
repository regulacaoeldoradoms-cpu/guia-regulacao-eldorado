import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const origin = 'https://portal.example.invalid';
const namespace = 'portal-pages-20261009-pets-combined-8';
const shared = ['/', '/cidadao/', '/amigos/', '/ferramentas/', '/perfil/', '/seguranca/', '/conquistas/', '/configuracoes/', '/notificacoes/', '/mascotes/'];
const source = fs.readFileSync(new URL('../../portal-sw.js', import.meta.url), 'utf8');

function fixture(network) {
  const stores = new Map(), handlers = new Map(), calls = [], timers = new Map();
  let nextTimer = 0;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async match(key) { return store.get(new URL(key.url || key, origin).href)?.clone(); },
        async put(key, response) { store.set(new URL(key.url || key, origin).href, response.clone()); }
      };
    }
  };
  const self = { location: { origin }, addEventListener(type, handler) { handlers.set(type, handler); } };
  const context = vm.createContext({
    self, caches, Request, Response, Headers, URL, Map, Set, Promise,
    fetch(request) { calls.push(request); return network(request); },
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  vm.runInContext(source, context);
  return {
    calls, timers, stores, caches,
    async seed(path, body = 'OLD') { await (await caches.open(namespace)).put(origin + path, new Response(body)); },
    dispatch(path, options = {}) {
      const request = new Request(origin + path, options);
      if (!options.method) Object.defineProperty(request, 'mode', { value: 'navigate' });
      const waits = [];
      let response;
      handlers.get('fetch')({ request, preloadResponse: Promise.resolve(new Response('PRELOAD-OLD')), waitUntil(p) { waits.push(p); }, respondWith(p) { response = p; } });
      return { response, waits };
    }
  };
}

async function until(predicate) {
  for (let i = 0; i < 30; i++) { if (predicate()) return; await new Promise(r => setImmediate(r)); }
  assert.ok(predicate(), 'fixture reaches requested phase');
}

for (const path of shared) test(`fresh shared HTML replaces old cache: ${path}`, async () => {
  const f = fixture(async () => new Response('NEW'));
  await f.seed(path);
  const event = f.dispatch(path + '?filter=fixture#section');
  assert.equal(await (await event.response).text(), 'NEW');
  assert.equal(f.calls[0].cache, 'no-cache');
  assert.equal(new URL(f.calls[0].url).search, '?filter=fixture');
  assert.equal(await (await (await f.caches.open(namespace)).match(origin + path)).text(), 'NEW');
  assert.equal(f.timers.size, 0);
  assert.deepEqual([...f.stores.keys()], [namespace], 'namespace retained');
});

test('slow network returns old HTML at deadline and refreshes cache later', async () => {
  let resolve;
  const f = fixture(() => new Promise(r => { resolve = r; }));
  await f.seed('/');
  const event = f.dispatch('/');
  await until(() => f.timers.size === 1 && !!resolve);
  const timer = [...f.timers.values()][0];
  assert.equal(timer.delay, 2500);
  timer.callback();
  assert.equal(await (await event.response).text(), 'OLD');
  resolve(new Response('NEW'));
  await Promise.all(event.waits);
  assert.equal(await (await (await f.caches.open(namespace)).match(origin + '/')).text(), 'NEW');
});

test('offline and HTTP errors preserve cached HTML', async () => {
  for (const response of [null, new Response('ERROR', { status: 503 })]) {
    const f = fixture(async () => { if (!response) throw Error('offline'); return response; });
    await f.seed('/mascotes/');
    assert.equal(await (await f.dispatch('/mascotes/').response).text(), 'OLD');
    assert.equal(await (await (await f.caches.open(namespace)).match(origin + '/mascotes/')).text(), 'OLD');
  }
});

test('cold slow client is bounded and existing Home fallback is retained', async () => {
  for (const withFallback of [true, false]) {
    const f = fixture(() => new Promise(() => {}));
    if (withFallback) await f.seed('/', 'HOME-FALLBACK');
    const event = f.dispatch('/perfil/');
    await until(() => f.timers.size === 1);
    [...f.timers.values()][0].callback();
    const response = await event.response;
    if (withFallback) assert.equal(await response.text(), 'HOME-FALLBACK');
    else { assert.equal(response.status, 503); assert.equal(response.headers.get('Cache-Control'), 'no-store'); }
  }
});

test('index aliases and query/hash use one canonical cache key', async () => {
  const f = fixture(async () => new Response('NEW'));
  await f.seed('/cidadao/');
  assert.equal(await (await f.dispatch('/cidadao/index.html?filter=fixture#reply').response).text(), 'NEW');
  assert.deepEqual([...f.stores.get(namespace).keys()], [origin + '/cidadao/']);
});

test('canonical redirects remain redirects rather than cached fallback', async () => {
  const f = fixture(async () => new Response(null, { status: 301, headers: { Location: '/cidadao/' } }));
  await f.seed('/cidadao/');
  const response = await f.dispatch('/cidadao').response;
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('Location'), '/cidadao/');
  assert.equal(await (await (await f.caches.open(namespace)).match(origin + '/cidadao/')).text(), 'OLD');
});

test('professional HTML retains stale-first navigation preload behavior', async () => {
  const f = fixture(async () => { throw Error('not used: preload remains valid'); });
  await f.seed('/medico/', 'PROFESSIONAL-OLD');
  const event = f.dispatch('/medico/');
  assert.equal(await (await event.response).text(), 'PROFESSIONAL-OLD');
  await Promise.all(event.waits);
  assert.equal(f.calls.length, 0);
  assert.equal(await (await (await f.caches.open(namespace)).match(origin + '/medico/')).text(), 'PRELOAD-OLD');
});

test('APIs, authorized navigation and non-GET requests are not intercepted', () => {
  const f = fixture(async () => { throw Error('must not fetch'); });
  for (const [path, options] of [['/api/auth/me', {}], ['/', { headers: { Authorization: 'fixture-only' } }], ['/', { method: 'POST', body: 'fixture-only' }]])
    assert.equal(f.dispatch(path, options).response, undefined);
  assert.equal(f.calls.length, 0);
});

test('versioned asset caching retains its previous behavior', async () => {
  const f = fixture(async () => new Response('ASSET-NEW'));
  const cache = await f.caches.open('portal-static-20261009-pets-combined-8');
  await cache.put(origin + '/js/fixture.js?v=1', new Response('ASSET-OLD'));
  const event = f.dispatch('/js/fixture.js?v=1', { method: 'GET' });
  assert.equal(await (await event.response).text(), 'ASSET-OLD');
});
