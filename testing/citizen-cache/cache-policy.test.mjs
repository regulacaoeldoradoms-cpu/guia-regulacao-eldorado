import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const origin = 'https://portal.example.invalid';
const namespace = 'portal-pages-20261009-pets-combined-8';
const shared = ['/', '/cidadao/', '/amigos/', '/ferramentas/', '/perfil/', '/seguranca/', '/conquistas/', '/configuracoes/', '/notificacoes/', '/mascotes/'];
const source = fs.readFileSync(new URL('../../portal-sw.js', import.meta.url), 'utf8');

test('shared entries use one released citizen loader and matching dependency URLs',()=>{
  const read=path=>fs.readFileSync(new URL('../../'+path,import.meta.url),'utf8');
  const citizen=read('cidadao/index.html');
  const version=citizen.match(/\/js\/citizen-layout\.js\?v=([^"']+)/)?.[1];
  assert.ok(version);
  for(const route of shared){
    const html=read(route==='/'?'index.html':route.slice(1)+'index.html');
    for(const name of ['citizen-layout','citizen-mobile-shell','account-section-shell','home']){
      for(const url of html.matchAll(new RegExp('/js/'+name+'\\.js\\?v=([^"\']+)','g'))){
        assert.equal(url[1],version,`${route}: ${name} must not reuse an obsolete cached owner`);
      }
    }
  }
  for(const path of ['js/home.js','js/account-section-shell.js'])assert.ok(read(path).includes(`/js/citizen-layout.js?v=${version}`));
  const layout=read('js/citizen-layout.js'),shell=read('js/citizen-mobile-shell.js');
  assert.ok(!citizen.includes('<script src="/js/citizen-compose-attachments.js'),'Optional previews must not block HTML parsing');
  assert.ok(citizen.includes(`/css/citizen-compose-refinement.css?v=${version}`));
  assert.ok(layout.includes(`'${version}'`));
  assert.ok(read('js/citizen.js').includes(`/js/citizen-compose-attachments.js?v=${version}`));
  assert.ok(!shell.includes('citizen-compose-attachments.js'),'Optional previews must not become a mandatory route dependency');
  assert.ok(layout.includes(`/js/citizen-mobile-presentation.js?v=${version}`));
  assert.ok(layout.includes(`path === '/css/citizen-mobile-presentation.css' ? '${version}'`));
  assert.ok(shell.includes(`/js/account-section-shell.js?v=${version}`));
  for(const entry of ['citizen-mobile-app','home','citizen'])assert.ok(shell.includes(`entry === '${entry}' ? '${version}'`));
});

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

const citizenMarker = '<meta name="portal-citizen-first-paint" content="20261014-7">';
test('published Citizen HTML and service worker agree on the current release marker',()=>{
  assert.ok(source.includes(`CITIZEN_HTML_MARKER = '${citizenMarker}'`));
  assert.ok(fs.readFileSync(new URL('../../cidadao/index.html',import.meta.url),'utf8').includes(citizenMarker));
});
test('only obsolete Citizen HTML gets the bounded refresh window', async () => {
  for(const [path,body,expected] of [['/cidadao/','OLD',8000],['/perfil/','OLD',2500]]){
    let resolve;const f=fixture(()=>new Promise(r=>{resolve=r;}));await f.seed(path,body);await f.seed('/perfil/','PROFILE-UNCHANGED');await f.seed('/mascotes/','PETS-UNCHANGED');
    const event=f.dispatch(path);await until(()=>f.timers.size===1&&!!resolve);assert.equal([...f.timers.values()][0].delay,expected);
    resolve(new Response(citizenMarker));assert.equal(await(await event.response).text(),citizenMarker);await Promise.all(event.waits);
    assert.equal(await(await(await f.caches.open(namespace)).match(origin+'/mascotes/')).text(),'PETS-UNCHANGED');assert.deepEqual([...f.stores.keys()],[namespace]);
  }
});
test('pre-theme modern Citizen HTML refreshes new script references without replacing global caches', async()=>{
  const previous='<meta name="portal-citizen-first-paint" content="20261013-1"><script src="/js/portal-theme.js?v=20260923-1"></script>';
  const current=citizenMarker+'<script src="/js/portal-theme.js?v=20261013-theme-immediate-1"></script>';
  let resolve;const f=fixture(()=>new Promise(r=>{resolve=r;}));await f.seed('/cidadao/',previous);await f.seed('/perfil/','PROFILE-UNCHANGED');
  const event=f.dispatch('/cidadao/');await until(()=>f.timers.size===1&&!!resolve);assert.equal([...f.timers.values()][0].delay,8000);
  resolve(new Response(current));assert.equal(await(await event.response).text(),current);await Promise.all(event.waits);
  assert.equal(await(await(await f.caches.open(namespace)).match(origin+'/perfil/')).text(),'PROFILE-UNCHANGED');assert.deepEqual([...f.stores.keys()],[namespace]);
});
test('obsolete Citizen HTML keeps offline and deadline recovery without deleting content', async()=>{
  for(const unavailable of ['offline','http','slow']){
    let resolve;const f=fixture(()=>unavailable==='offline'?Promise.reject(Error('offline')):unavailable==='http'?Promise.resolve(new Response('ERROR',{status:503})):new Promise(r=>{resolve=r;}));
    await f.seed('/cidadao/','OLD-CONTENT');const event=f.dispatch('/cidadao/');
    if(unavailable==='slow'){await until(()=>f.timers.size===1&&!!resolve);assert.equal([...f.timers.values()][0].delay,8000);[...f.timers.values()][0].callback();}
    assert.equal(await(await event.response).text(),'OLD-CONTENT');assert.equal(await(await(await f.caches.open(namespace)).match(origin+'/cidadao/')).text(),'OLD-CONTENT');
    if(resolve){resolve(new Response(citizenMarker));await Promise.all(event.waits);}
  }
});


test('current public Citizen HTML is immediate while slow refresh continues', async()=>{
  let resolve;const f=fixture(()=>new Promise(r=>{resolve=r;}));await f.seed('/cidadao/',citizenMarker+'CURRENT-SHELL');
  const event=f.dispatch('/cidadao/');assert.equal(await(await event.response).text(),citizenMarker+'CURRENT-SHELL');assert.equal(f.timers.size,0,'no foreground deadline for current shell');assert.equal(f.calls[0].cache,'no-cache');
  resolve(new Response(citizenMarker+'UPDATED-SHELL'));await Promise.all(event.waits);assert.equal(await(await(await f.caches.open(namespace)).match(origin+'/cidadao/')).text(),citizenMarker+'UPDATED-SHELL');
});
test('updated Citizen public shell remains modern offline', async()=>{
  let offline=false;const f=fixture(async()=>{if(offline)throw Error('offline');return new Response(citizenMarker+'MODERN-SHELL');});await f.seed('/cidadao/','LEGACY');
  const first=f.dispatch('/cidadao/');assert.equal(await(await first.response).text(),citizenMarker+'MODERN-SHELL');await Promise.all(first.waits);offline=true;
  const next=f.dispatch('/cidadao/');assert.equal(await(await next.response).text(),citizenMarker+'MODERN-SHELL');await Promise.all(next.waits);assert.equal(f.timers.size,0);
});
test('account-specific responses cannot populate the public Citizen HTML cache', async()=>{
  for(const headers of [{'Cache-Control':'private'}, {'Cache-Control':'no-store'}, {'Set-Cookie':'fixture-only=1'}]){
    const f=fixture(async()=>new Response('ACCOUNT-SPECIFIC-FIXTURE',{headers}));const event=f.dispatch('/cidadao/');await event.response;await Promise.all(event.waits);
    assert.equal(await(await f.caches.open(namespace)).match(origin+'/cidadao/'),undefined);
  }
});

test('a current Citizen cache does not swallow the canonical redirect', async()=>{
  const f=fixture(async()=>new Response(null,{status:301,headers:{Location:'/cidadao/'}}));await f.seed('/cidadao/',citizenMarker+'PUBLIC');
  const response=await f.dispatch('/cidadao').response;assert.equal(response.status,301);assert.equal(response.headers.get('Location'),'/cidadao/');
});
