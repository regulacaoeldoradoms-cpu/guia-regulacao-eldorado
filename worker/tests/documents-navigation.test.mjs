import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import { centralFixture, read, deferred, flush } from '../../testing/central-docs/navigation-fixture.mjs';

const source = read('js/documents.js');
const list = '/api/documents/drive/list';
const search = '/api/documents/drive/search';
const options = (body = {}) => ({ method: 'POST', body: JSON.stringify(body) });
const payload = (name = 'Synthetic item') => ({ items: [{ name }], nextPageToken: 'synthetic-next' });

function cacheFixture(extra = {}) {
  let scope = 'synthetic-a', now = 0, allowed = true, fail = false;
  const calls = [], cleared = [];
  const sandbox = { window: {} };
  vm.runInNewContext(read('js/document-navigation.js'), sandbox);
  const cache = sandbox.window.PortalDocumentNavigation.create({
    getSession: () => scope, now: () => now, onClear: (reason) => cleared.push(reason),
    request: async (route) => {
      calls.push(route);
      if (fail) throw Object.assign(new Error('Synthetic failure'), { status: 503 });
      return route.endsWith('/access') ? { capabilities: { view: allowed }, drive: { connected: true } } : payload();
    }, ...extra
  });
  return { cache, calls, cleared, advance: (ms) => { now += ms; }, deny: () => { allowed = false; },
    switch: (value) => { scope = value; cache.syncSession(); }, fail: () => { fail = true; } };
}

test('RAM cache reuses folder/search pages only after live access and expires after 20 seconds', async () => {
  const f = cacheFixture();
  await f.cache.read(list, options({ parentRef: 'synthetic-folder', pageToken: '', pageSize: 20 }));
  assert.equal((await f.cache.read(list, options({ pageSize: 20, pageToken: '', parentRef: 'synthetic-folder' }))).navigationCacheState, 'hit');
  await f.cache.read(search, options({ query: 'synthetic', titleOnly: false, filters: {} }));
  assert.equal((await f.cache.read(search, options({ query: 'synthetic', titleOnly: false, filters: {} }))).navigationCacheState, 'hit');
  assert.equal(f.calls.filter((route) => route.endsWith('/access')).length, 4);
  assert.equal(f.calls.filter((route) => route !== '/api/documents/access').length, 2);
  f.advance(20000);
  assert.equal((await f.cache.read(list, options({ parentRef: 'synthetic-folder', pageToken: '', pageSize: 20 }))).navigationCacheState, 'miss');
});

test('cache keys distinguish page, sort, name/content mode and advanced filters', async () => {
  const f = cacheFixture();
  for (const body of [{ pageToken: 'one' }, { pageToken: 'two' }, { sortOrder: 'modified_desc' },
    { titleOnly: true }, { titleOnly: false }, { filters: { type: 'pdf' } }]) {
    assert.equal((await f.cache.read(search, options({ query: 'synthetic', ...body }))).navigationCacheState, 'miss');
  }
  assert.equal(f.calls.filter((route) => route === search).length, 6);
});

test('concurrent identical reads share access and one Drive request; forced refresh shares pending read', async () => {
  const wait = deferred();
  let driveCalls = 0, accessCalls = 0;
  const f = cacheFixture({ request: async (route) => {
    if (route.endsWith('/access')) { accessCalls++; return { capabilities: { view: true }, drive: { connected: true } }; }
    driveCalls++;
    return wait.promise;
  } });
  const one = f.cache.read(list, options());
  const two = f.cache.read(list, options(), { force: true });
  await flush();
  assert.equal(driveCalls, 1);
  assert.equal(accessCalls, 1);
  wait.resolve(payload());
  await Promise.all([one, two]);
});

test('logout/account change and delayed response cannot repopulate or return old metadata', async () => {
  const wait = deferred();
  const f = cacheFixture({ request: async (route) => route.endsWith('/access')
    ? { capabilities: { view: true }, drive: { connected: true } } : wait.promise });
  const pending = f.cache.read(list, options());
  const rejected = assert.rejects(pending, { code: 'DOCUMENTS_STALE_READ' });
  await flush();
  f.switch('synthetic-b');
  wait.resolve(payload('Old synthetic metadata'));
  await rejected;
  const gate = await f.cache.authorize();
  f.cache.seed(list, options(), payload('New synthetic metadata'), gate);
  assert.equal((await f.cache.read(list, options())).items[0].name, 'New synthetic metadata');
  f.switch('');
  await assert.rejects(f.cache.read(list, options()), { code: 'DOCUMENTS_STALE_READ' });
});

test('revoked access and access errors purge cached metadata and never fall back to stale results', async () => {
  for (const action of ['deny', 'fail']) {
    const f = cacheFixture();
    await f.cache.read(list, options());
    f[action]();
    await assert.rejects(f.cache.read(list, options()));
    assert.ok(f.cleared.includes(action === 'deny' ? 'denied' : 'access-error'));
    assert.equal(f.calls.filter((route) => route === list).length, 1);
  }
});

test('mutation invalidation rejects late reads, clears keys and prevents fresh seed from expired warmup', async () => {
  const wait = deferred();
  let hold = true, count = 0;
  const f = cacheFixture({ request: async (route) => {
    if (route.endsWith('/access')) return { capabilities: { view: true }, drive: { connected: true } };
    count++;
    return hold ? wait.promise : payload();
  } });
  const pending = f.cache.read(list, options());
  const rejected = assert.rejects(pending, { code: 'DOCUMENTS_STALE_READ' });
  await flush();
  f.cache.clear('mutation');
  hold = false;
  const newer = await f.cache.read(list, options());
  wait.resolve(payload('Stale synthetic item'));
  await rejected;
  assert.equal((await f.cache.read(list, options())).items[0].name, newer.items[0].name);
  f.cache.clear('mutation');
  const gate = await f.cache.authorize();
  f.cache.seed(list, options(), payload(), gate, 20000);
  assert.equal((await f.cache.read(list, options())).navigationCacheState, 'miss');
  assert.equal(count, 3);
});

test('RAM cache is bounded by entries and item count and returns isolated copies', async () => {
  const f = cacheFixture({ maxEntries: 2, maxItems: 2 });
  const result = await f.cache.read(list, options({ parentRef: 'one' }));
  result.items[0].name = 'Changed by caller';
  assert.equal((await f.cache.read(list, options({ parentRef: 'one' }))).items[0].name, 'Synthetic item');
  await f.cache.read(list, options({ parentRef: 'two' }));
  await f.cache.read(list, options({ parentRef: 'three' }));
  assert.equal((await f.cache.read(list, options({ parentRef: 'one' }))).navigationCacheState, 'miss');
  assert.doesNotMatch(read('js/document-navigation.js'), /localStorage|sessionStorage|indexedDB|capture\(/);
});

test('real Central startup paints warm root without waiting for preferences/AI and avoids duplicate refresh', async () => {
  const f = centralFixture(source, { warm: { ageMs: 0, folder: payload() }, preferencesMs: 1000, aiMs: 2000 });
  await f.timer.settle(f.start());
  assert.equal(f.painted[0].at, 25);
  assert.equal(f.calls.filter((call) => call.route === list).length, 0);
  assert.equal(f.calls.filter((call) => call.route.endsWith('/access')).length, 1);
});

test('real navigation caches return to folder and repeated search but clears UI on denied access', async () => {
  const f = centralFixture(source);
  await f.timer.settle(f.start());
  await f.timer.settle(f.folder('synthetic-folder'));
  await f.timer.settle(f.folder(''));
  await f.timer.settle(f.search('synthetic'));
  await f.timer.settle(f.search('synthetic'));
  assert.equal(f.calls.filter((call) => call.route === list).length, 2);
  assert.equal(f.calls.filter((call) => call.route === search).length, 1);
  f.deny();
  await f.timer.settle(f.folder('synthetic-folder'));
  assert.equal(f.els.workspace.hidden, true);
  assert.equal(f.state.items.length, 0);
  assert.equal(f.state.loading, false);
});

test('real UI cannot paint a delayed response after account switch or access error', async () => {
  const f = centralFixture(source);
  await f.timer.settle(f.start());
  const count = f.painted.length;
  const pending = f.folder('synthetic-folder');
  await f.timer.until(() => f.calls.some((call) => call.body.parentRef === 'synthetic-folder'));
  f.setSession('synthetic-b');
  await f.timer.settle(pending);
  assert.equal(f.painted.length, count);
  assert.equal(f.state.items.length, 0);
  f.fail();
  await f.timer.settle(f.folder(''));
  assert.equal(f.els.workspace.hidden, true);
});

test('Drive errors are not cached and a subsequent successful read can retry', async () => {
  let count = 0;
  const f = cacheFixture({ request: async (route) => {
    if (route.endsWith('/access')) return { capabilities: { view: true }, drive: { connected: true } };
    if (++count === 1) throw Object.assign(new Error('Synthetic failure'), { status: 503 });
    return payload();
  } });
  await assert.rejects(f.cache.read(list, options()));
  assert.equal((await f.cache.read(list, options())).navigationCacheState, 'miss');
  assert.equal(count, 2);
});

test('real rename path invalidates both folder and search cache even when the mutation fails', async () => {
  for (const fail of [false, true]) {
    const f = centralFixture(source);
    await f.timer.settle(f.start());
    await f.timer.settle(f.search('synthetic'));
    if (fail) f.fail();
    const mutation = f.sandbox.api('/api/documents/drive/rename', { method: 'PATCH', body: '{}' });
    if (fail) await assert.rejects(f.timer.settle(mutation));
    else await f.timer.settle(mutation);
    await f.timer.settle(f.folder(''));
    await f.timer.settle(f.search('synthetic'));
    assert.equal(f.calls.filter((call) => call.route === list).length, 2);
    assert.equal(f.calls.filter((call) => call.route === search).length, 2);
  }
});

test('warmup releases existing waiter on root readiness before preferences finish, and clears delayed state', async () => {
  const preferences = deferred(), folder = deferred();
  const handlers = {};
  const sandbox = { self: { location: { origin: 'https://synthetic.invalid' },
    addEventListener: (type, callback) => { handlers[type] = callback; } }, crypto: webcrypto,
    URL, Headers, TextEncoder, setTimeout, clearTimeout,
    fetch: async (url) => ({ ok: true, status: 200, json: async () => {
      if (url.endsWith('/access')) return { capabilities: { view: true }, drive: { connected: true } };
      return url.endsWith('/preferences') ? preferences.promise : folder.promise;
    } }) };
  vm.runInNewContext(read('portal-sw.js') + '\nself.__test = {warmDocumentsPrivate, getDocumentsWarmPayload, clearDocumentsWarm};', sandbox);
  const api = sandbox.self.__test;
  const data = { endpoint: 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev',
    authorization: 'Bearer synthetic-authorization-long-enough' };
  const warming = api.warmDocumentsPrivate(data);
  // SHA-256 is asynchronous; yield the native event loop without a timing assertion.
  for (let i = 0; i < 5; i++) await new Promise(setImmediate);
  const getting = api.getDocumentsWarmPayload(data);
  for (let i = 0; i < 5; i++) await new Promise(setImmediate);
  folder.resolve(payload());
  const result = await getting;
  assert.equal(result.folder.items[0].name, 'Synthetic item');
  assert.equal(result.preferences, null);
  api.clearDocumentsWarm();
  preferences.resolve({ colorPalette: ['#000000'] });
  await warming;
  assert.equal(await api.getDocumentsWarmPayload(data), null);
});
