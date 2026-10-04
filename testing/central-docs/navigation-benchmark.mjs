import assert from 'node:assert/strict';
import vm from 'node:vm';
import { read, baseline, centralFixture, clock, flush } from './navigation-fixture.mjs';

const before = baseline('js/documents.js'), after = read('js/documents.js');
const rows = [];
const driveCount = (calls) => calls.filter((call) => /\/drive\/(list|search)$/.test(call.route)).length;
async function operation(source, setup, action) {
  const fixture = centralFixture(source, setup);
  if (action) await fixture.timer.settle(fixture.start());
  const start = fixture.timer.now(), calls = fixture.calls.length;
  if (action) await fixture.timer.settle(action(fixture));
  else {
    const startup = fixture.start();
    await fixture.timer.until(() => fixture.painted.length > 0);
    // The measured boundary is first visible list, including access validation.
    startup.catch(() => {});
  }
  return { ms: fixture.timer.now() - start, driveRequests: driveCount(fixture.calls.slice(calls)) };
}
async function compare(scenario, setup = {}, action = null) {
  rows.push({ scenario, before: await operation(before, setup, action), after: await operation(after, setup, action) });
}
await compare('cold opening');
await compare('warm root, preferences/AI unavailable in snapshot', {
  warm: { ageMs: 0, folder: { items: [{ name: 'Synthetic folder', ref: 'synthetic-root', isFolder: true }], nextPageToken: '' } }
});
await compare('complete warm snapshot', {
  warm: { ageMs: 0, folder: { items: [{ name: 'Synthetic folder', ref: 'synthetic-root', isFolder: true }], nextPageToken: '' },
    preferences: { colorPalette: ['#000000'] }, aiConfig: { ai: { enabled: false } } }
});
await compare('first entry into uncached folder', {}, (f) => f.folder('synthetic-folder'));
await compare('folder entry then return to cached root', {}, async (f) => {
  await f.folder('synthetic-folder');
  await f.folder('');
});
await compare('search then repeat identical search', {}, async (f) => {
  await f.search('synthetic');
  await f.search('synthetic');
});
await compare('concurrent root refresh and navigation', {}, async (f) => {
  await Promise.all([f.sandbox.refreshWarmedRootFolderInBackground(), f.folder('')]);
});

async function inProgress(documentSource, swSource) {
  const timer = clock();
  const calls = [];
  const sandbox = { self: { location: { origin: 'https://synthetic.invalid' }, addEventListener() {} },
    crypto: { subtle: { digest: async () => new Uint8Array(32).buffer } }, URL, Headers, TextEncoder,
    Date: class extends Date { static now() { return timer.now(); } },
    setTimeout, clearTimeout, fetch: async (url) => {
      calls.push(url);
      await timer.delay(url.endsWith('/access') ? 25 : url.endsWith('/preferences') ? 1000 : 300);
      return { ok: true, status: 200, json: async () => url.endsWith('/access')
        ? { capabilities: { view: true }, drive: { connected: true } }
        : url.endsWith('/preferences') ? { colorPalette: ['#000000'] }
        : { items: [{ name: 'Synthetic folder', ref: 'synthetic-root', isFolder: true }], nextPageToken: '' } };
    } };
  vm.runInNewContext(swSource + '\nself.api = { warmDocumentsPrivate, getDocumentsWarmPayload };', sandbox);
  const data = { endpoint: 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev',
    authorization: 'Bearer synthetic-authorization-long-enough' };
  sandbox.self.api.warmDocumentsPrivate(data).catch(() => {});
  await flush();
  const getter = sandbox.self.api.getDocumentsWarmPayload(data);
  const f = centralFixture(documentSource, { timer, warm: getter });
  f.start().catch(() => {});
  await timer.until(() => f.painted.length > 0);
  return { ms: f.painted[0].at, driveRequests: calls.filter((url) => url.endsWith('/list')).length + driveCount(f.calls) };
}
rows.push({ scenario: 'warmup pending, root ready before preferences',
  before: await inProgress(before, baseline('portal-sw.js')),
  after: await inProgress(after, read('portal-sw.js')) });

assert.equal(rows[0].after.ms, 325);
assert.equal(rows[1].after.ms, 25);
assert.equal(rows.at(-1).after.ms, 325);
assert.equal(rows.find((row) => row.scenario.startsWith('concurrent')).after.driveRequests, 1);
console.log(JSON.stringify({ baseline: '6c4fcd86198103ad6e1e8adc07901219c7957c92',
  method: 'Real startup/navigation/Service Worker functions in Node VM; synthetic DOM, virtual clock and mocked APIs. No browser/production latency claim.',
  delaysMs: { access: 25, drive: 300, preferences: 100, ai: 180, pendingWarmPreferences: 1000 }, rows }, null, 2));
