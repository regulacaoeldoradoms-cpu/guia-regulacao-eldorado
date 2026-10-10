import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from '../browser/node_modules/playwright/index.mjs';
import { petCatalog } from '../../worker/pet-catalog.js';
import { initialPetState, publicPetState } from '../../worker/pet-domain.js';

const root = path.resolve(import.meta.dirname, '../..');
const pre = '709444b29e4f88c66c952f505e7572d9237560bd';
const pageCache = 'portal-pages-20261009-pets-combined-8';
const assetCache = 'portal-static-20261009-pets-combined-8';
const shared = new Set(['/', '/cidadao/', '/amigos/', '/ferramentas/', '/perfil/', '/seguranca/', '/conquistas/', '/configuracoes/', '/notificacoes/', '/mascotes/']);
const historical = new Map();
function oldFile(file) {
  if (!historical.has(file)) historical.set(file, execFileSync('git', ['show', `${pre}:${file}`], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }));
  return historical.get(file);
}
let upgraded = false, delay = 0, apiProbes = 0, networkOffline = false;
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/cache-probe') { apiProbes++; res.setHeader('Content-Type', 'application/json'); res.end('{"fixture":true}'); return; }
    // Context offline emulation alone does not consistently reach Chromium SW targets.
    // Close the upstream connection too, proving that the HTML fetch really fails.
    if (upgraded && networkOffline && shared.has(url.pathname)) { res.destroy(); return; }
    if (!shared.has(url.pathname) && url.pathname !== '/portal-sw.js' && !/^\/(js|css|assets|vendor)\//.test(url.pathname)) throw Error('out of scope');
    const file = (url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname).slice(1);
    const body = upgraded ? await fs.readFile(path.join(root, file)) : oldFile(file);
    const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.png') ? 'image/png' : file.endsWith('.webp') ? 'image/webp' : file.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream';
    const pause = upgraded && shared.has(url.pathname) ? delay : 0;
    if (pause) await new Promise(r => setTimeout(r, pause));
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' }); res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost'] });
const reports = [];

async function mockAccount(context, role) {
  const user = { id: 'fixture-cache', username: 'fixture.cache', name: 'Conta fictícia', role, interfaceTheme: 'dark', active: true, emailVerified: true, accountLevel: 'prata', documentCapabilities: { view: false, manage: false } };
  const profile = { name: user.name, handle: user.username, isSelf: true, avatarAvailable: false };
  const state = initialPetState(); state.pet = { typeId: 'cat', variant: 'gray' }; state.petRevision = 1; state.preferences.motionEnabled = false;
  const pet = publicPetState(state, 120, 1, 1791540000);
  await context.addInitScript(({ user }) => {
    sessionStorage.setItem('regulacao.portal.session', 'synthetic-cache-token');
    sessionStorage.setItem('regulacao.portal.user', JSON.stringify(user));
    sessionStorage.setItem('regulacao.portal.user.validatedAt', String(Date.now()));
    localStorage.setItem('fixture.preferences', '{"preserved":true}');
    delete window.PushManager;
  }, { user });
  await context.routeWebSocket('**/*', socket => socket.close());
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    if (route.request().method() !== 'GET' && !['/api/chat/presence', '/api/chat/read', '/api/observability'].includes(url.pathname)) return route.abort();
    let data = { ok: true };
    if (url.pathname === '/api/auth/me') data = { user };
    else if (url.pathname === '/api/social/config') data = { backendEnabled: true, homeEnabled: true, available: true, profile };
    else if (url.pathname === '/api/social/me') data = { profile };
    else if (url.pathname.includes('/feed')) data = { posts: [], nextCursor: '' };
    else if (url.pathname.includes('/notifications')) data = { notifications: [], unreadCount: 0 };
    else if (url.pathname.includes('/relationships')) data = { profiles: [], nextCursor: '' };
    else if (url.pathname === '/api/chat/contacts') data = { contacts: [] };
    else if (url.pathname === '/api/chat/groups') data = { enabled: true, groups: [] };
    else if (url.pathname === '/api/chat/messages') data = { messages: [] };
    else if (url.pathname === '/api/pets/me') data = { state: pet };
    else if (url.pathname === '/api/pets/catalog') data = petCatalog();
    else if (url.pathname === '/api/pets/achievements') data = { achievements: [] };
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
  });
}

try {
  for (const role of ['cidadao', 'admin']) {
    upgraded = false; delay = 0; networkOffline = false;
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, serviceWorkers: 'allow' });
    await mockAccount(context, role);
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin + '/');
    await page.waitForFunction(() => !!navigator.serviceWorker.controller && !!document.querySelector('.social-mobile-nav'));
    const storage = await page.evaluate(() => ({ token: sessionStorage.getItem('regulacao.portal.session'), user: sessionStorage.getItem('regulacao.portal.user'), preferences: localStorage.getItem('fixture.preferences') }));
    await page.locator('#socialComposerText').fill('Rascunho exclusivamente fictício');
    await page.evaluate(() => { window.__oldController = navigator.serviceWorker.controller; });
    upgraded = true;
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration()).update(); });
    await page.waitForFunction(() => navigator.serviceWorker.controller !== window.__oldController);
    assert.equal(await page.locator('#socialComposerText').inputValue(), 'Rascunho exclusivamente fictício', 'activation must not discard an open draft');
    assert.equal(await page.evaluate(() => document.querySelector('script[src*="/js/home.js"]').getAttribute('src')), '/js/home.js?v=20261009-citizen-layout-1', 'activation does not force navigation');
    await page.evaluate(async ({ assetCache }) => { await (await caches.open(assetCache)).put('/js/cache-sentinel.js?v=1', new Response('ASSET-SENTINEL')); }, { assetCache });
    const seed = async () => page.evaluate(async ({ html, pageCache }) => { await (await caches.open(pageCache)).put('/', new Response(html, { headers: { 'Content-Type': 'text/html' } })); }, { html: oldFile('index.html').toString(), pageCache });
    const version = () => page.evaluate(() => document.querySelector('script[src*="/js/home.js"]').getAttribute('src'));
    const current = async () => {
      await page.waitForFunction(() => document.body.classList.contains('citizen-readable-layout') && !!document.querySelector('.social-mobile-nav a[href="/mascotes/"] svg'));
      assert.equal(await version(), '/js/home.js?v=20261009-citizen-layout-2');
    };
    await seed();
    await page.goto(origin + '/?upgrade=fixture#section'); await current();
    reports.push({ role, scenario: 'good network replaces cached pre621 HTML on first navigation', passed: true });
    await seed(); delay = 3300;
    const start = Date.now(); const response = await page.goto(origin + '/?slow=fixture', { waitUntil: 'commit' });
    assert.ok(Date.now() - start < 3200, 'deadline returns cached document before slow upstream');
    assert.ok((await response.text()).includes('home.js?v=20261009-citizen-layout-1'));
    await page.waitForFunction(async pageCache => (await (await caches.open(pageCache)).match('/')).text().then(html => html.includes('home.js?v=20261009-citizen-layout-2')), pageCache);
    delay = 0; await page.reload(); await current();
    reports.push({ role, scenario: 'slow response uses deadline fallback, updates cache, normal reload converges', passed: true });
    await seed(); networkOffline = true; await context.setOffline(true);
    const offline = await page.goto(origin + '/?offline=fixture#reply');
    assert.ok((await offline.text()).includes('home.js?v=20261009-citizen-layout-1'));
    networkOffline = false; await context.setOffline(false); await page.reload(); await current();
    reports.push({ role, scenario: 'offline cache retained; online normal reload updates', passed: true });
    const after = await page.evaluate(() => ({ token: sessionStorage.getItem('regulacao.portal.session'), user: sessionStorage.getItem('regulacao.portal.user'), preferences: localStorage.getItem('fixture.preferences') }));
    assert.deepEqual(after, storage, 'session and preferences preserved');
    const probes = apiProbes;
    assert.deepEqual(await page.evaluate(async () => (await fetch('/api/cache-probe')).json()), { fixture: true });
    assert.equal(apiProbes, probes + 1, 'API reaches server without page-cache interception');
    const keys = await page.evaluate(async ({ pageCache, assetCache }) => ({ pages: (await (await caches.open(pageCache)).keys()).map(r => r.url), asset: await (await (await caches.open(assetCache)).match('/js/cache-sentinel.js?v=1')).text() }), { pageCache, assetCache });
    assert.ok(keys.pages.every(url => !new URL(url).search && !new URL(url).hash));
    assert.equal(keys.asset, 'ASSET-SENTINEL');
    assert.deepEqual(errors, [], 'no JavaScript errors');
    reports.push({ role, scenario: 'activation preserves draft, storage, assets, normalized keys and API routing', passed: true });
    await context.close();
  }
  // Validate the user instruction using ordinary reloads, with no explicit update API.
  upgraded = false; delay = 0; networkOffline = false;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'allow' });
  await mockAccount(context, 'admin');
  const page = await context.newPage();
  await page.goto(origin + '/');
  await page.waitForFunction(() => !!navigator.serviceWorker.controller && !!document.querySelector('.social-mobile-nav'));
  upgraded = true;
  const worker = context.waitForEvent('serviceworker');
  await page.reload();
  await worker;
  await page.waitForFunction(async () => { const r = await navigator.serviceWorker.getRegistration(); return !r.installing && !r.waiting && r.active?.state === 'activated'; });
  await page.reload();
  await page.waitForFunction(() => document.body.classList.contains('citizen-readable-layout') && !!document.querySelector('.social-mobile-nav a[href="/mascotes/"] svg'));
  assert.equal(await page.evaluate(() => document.querySelector('script[src*="/js/home.js"]').getAttribute('src')), '/js/home.js?v=20261009-citizen-layout-2');
  reports.push({ role: 'admin', scenario: 'normal reload discovers update; next normal reload shows new layout without clearing data', passed: true });
  await context.close();
  await fs.writeFile(process.argv[2] || '/tmp/citizen-cache-update.json', JSON.stringify({ syntheticOnly: true, emulation: 'Chromium mobile viewport/touch; not actual Android hardware', pre, reports }, null, 2));
  console.log(`${reports.length} installed-client cache scenarios passed`);
} finally { await browser.close(); await new Promise(r => server.close(r)); }
