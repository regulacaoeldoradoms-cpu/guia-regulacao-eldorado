// Local visual candidate only: synthetic accounts, intercepted APIs/WebSockets,
// and just Home + Friends documents. This is not an authorization or backend test.
// Run: node testing/citizen-layout/home-social-scenes.mjs
// Optional: WIDTHS=390 THEMES=dark ROLES=cidadao TEXT_SCALE=2 INTERACTIONS=0
// Persistence diagnostic: PERSISTENCE_ONLY=1 SESSION_BRIDGE=blocked|protocol
// Output: .local/social-design-scenes/{summary.json,*.png}; screenshots are viewports.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { createHash, webcrypto } from 'node:crypto';
import { petCatalog } from '../../worker/pet-catalog.js';
import { initialPetState, publicPetState } from '../../worker/pet-domain.js';
import { applyTextScale } from './text-scale.mjs';

const root = await fs.realpath(process.env.PORTAL_ROOT || path.resolve(import.meta.dirname, '../..'));
const output = path.resolve(process.argv[2] || path.join(root, '.local/social-design-scenes'));
const list = (key, fallback) => (process.env[key] || fallback).split(',').map(value => value.trim()).filter(Boolean);
const widths = list('WIDTHS', '320,390').map(Number);
const themes = list('THEMES', 'light,dark');
const roles = list('ROLES', 'cidadao,admin');
const scales = list('TEXT_SCALE', '1,2').map(Number);
if (widths.some(value => !Number.isInteger(value) || value < 280 || value > 900)
    || themes.some(value => !['light', 'dark'].includes(value))
    || roles.some(value => !['cidadao', 'admin'].includes(value))
    || scales.some(value => ![1, 2].includes(value))) throw Error('Use mobile WIDTHS, THEMES=light,dark, ROLES=cidadao,admin and TEXT_SCALE=1,2.');
const height = Number(process.env.HEIGHT || 844);
const interactionWidth = widths.includes(390) ? 390 : widths.at(-1);
const originalScale = process.env.TEXT_SCALE;
const sessionBridgeMode = process.env.SESSION_BRIDGE || 'protocol';
if (!['blocked', 'protocol'].includes(sessionBridgeMode)) throw Error('SESSION_BRIDGE must be blocked or protocol.');
const workerSource = await fs.readFile(path.join(root, 'portal-sw.js'), 'utf8');
const workerSourceSha256 = createHash('sha256').update(workerSource).digest('hex');
// Keep native postMessage delivery and event.waitUntil across page destruction.
// The production source is inserted unchanged. Only its session message handler
// is registered; its cache/fetch/push/warming handlers never execute here.
const sessionWorkerSource = `
'use strict';
const sceneNativeListen = self.addEventListener.bind(self);
const sceneEvents = [], scenePending = new Set(), scenePagehide = new Map();
const sceneSnapshot = s => s ? {panelOpen:s.panelOpen,activeUsername:s.activeUsername,drafts:s.drafts || [],contacts:s.contacts?.length || 0,conversations:(s.conversations || []).map(c=>({username:c.username,messages:c.messages?.length || 0}))} : null;
self.addEventListener = (type, handler) => {
  if(type !== 'message') return;
  sceneNativeListen('message', event => {
    if(event.data?.type === 'SCENE_PAGEHIDE') {const marker={sequence:sceneEvents.length+1,type:'SCENE_PAGEHIDE',route:new URL(event.source.url).pathname};sceneEvents.push(marker);scenePagehide.set(event.source.id,marker.sequence);return;}
    if(!/^PORTAL_CHAT_SESSION_(GET|PUT|CLEAR)$/.test(event.data?.type)) return;
    const started = performance.now();
    const record = {sequence:sceneEvents.length+1,type:event.data.type,route:new URL(event.source.url).pathname,sameOrigin:new URL(event.source.url).origin===self.location.origin};
    if(event.data.type.endsWith('_PUT')) {record.snapshot=sceneSnapshot(event.data.snapshot);record.afterPagehideSequence=scenePagehide.get(event.source.id) || null;}
    if(event.data.type.endsWith('_GET')) scenePagehide.delete(event.source.id);
    sceneEvents.push(record);
    handler({data:event.data,source:event.source,ports:event.ports.map(port=>({postMessage(value){record.hit=value.ok===true;record.snapshot=sceneSnapshot(value.snapshot);port.postMessage(value);}})),waitUntil(promise){
      const tracked=Promise.resolve(promise).then(value=>{if(event.data.type.endsWith('_PUT')) record.committed=value===true;}).catch(error=>{record.error=String(error);}).finally(()=>{record.durationMs=Math.round((performance.now()-started)*10)/10;scenePending.delete(tracked);});
      scenePending.add(tracked);event.waitUntil(tracked);
    }});
  });
};
${workerSource}
self.addEventListener=sceneNativeListen;
sceneNativeListen('install',event=>event.waitUntil(self.skipWaiting()));
sceneNativeListen('activate',event=>event.waitUntil(self.clients.claim()));
self.__sceneSessionEvidence=async()=>{await Promise.allSettled([...scenePending]);return {mode:'native-protocol',source:'portal-sw.js',sourceSha256:'${workerSourceSha256}',counts:Object.fromEntries(['GET','PUT','CLEAR'].map(type=>[type,sceneEvents.filter(e=>e.type.endsWith('_'+type)).length])),committedPuts:sceneEvents.filter(e=>e.committed).length,getHits:sceneEvents.filter(e=>e.hit).length,events:sceneEvents};};
`;
const playwrightPaths = [process.env.PLAYWRIGHT_PATH,
  path.join(root, 'testing/browser/node_modules/playwright/index.mjs'),
  '/workspace/cidadao-perf/testing/browser/node_modules/playwright/index.mjs',
  '/workspace/guia-regulacao-eldorado/testing/browser/node_modules/playwright/index.mjs'].filter(Boolean);
let chromium;
for (const candidate of playwrightPaths) {
  try { await fs.access(candidate); ({ chromium } = await import(pathToFileURL(candidate).href)); break; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
if (!chromium) throw Error('Playwright unavailable; set PLAYWRIGHT_PATH to its index.mjs.');

const citizenName = 'Maria Aparecida de Oliveira dos Santos';
const chatDraft = 'Rascunho sintético mantido ao voltar e trocar de seção.';
const contact = {
  username: 'fixture.friend', name: 'João Antônio de Albuquerque Figueiredo',
  socialHandle: 'fixture.friend', role: 'cidadao', jobTitle: 'Cidadão',
  online: true, unread: 2, firstUnreadId: 2, lastMessageAt: '2026-10-09T12:06:00Z',
  avatarAvailable: false, receivedThroughId: 3,
};
const friendProfile = { name: contact.name, handle: contact.socialHandle, avatarAvailable: false,
  relationship: 'friends', acceptFriendRequests: true, isSelf: false };
const pet = initialPetState();
pet.pet = { typeId: 'cat', variant: 'gray' };
pet.petRevision = 1;
pet.preferences.motionEnabled = false;
const petState = publicPetState(pet, 120, 1, 1791540000);
const documents = new Set(['/', '/amigos/']);
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === '/portal-sw.js' && sessionBridgeMode === 'protocol') {
      response.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store', 'Service-Worker-Allowed': '/' });
      response.end(sessionWorkerSource);
      return;
    }
    const isAsset = /^\/(js|css|assets|vendor)\//.test(pathname) || /^\/[^/]+\.webmanifest$/.test(pathname);
    if (!documents.has(pathname) && !isAsset) throw Error('Route outside scene scope');
    const file = await fs.realpath(path.resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : '')));
    if (!file.startsWith(root + path.sep)) throw Error('Outside workspace');
    const canonicalAsset = ['js', 'css', 'assets', 'vendor'].some(directory => file.startsWith(path.join(root, directory) + path.sep))
      && path.extname(file).toLowerCase() !== '.html';
    const canonicalManifest = path.dirname(file) === root && path.extname(file) === '.webmanifest';
    if (!documents.has(pathname) && !canonicalAsset && !canonicalManifest) throw Error('Outside canonical asset scope');
    const body = await fs.readFile(file);
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(body);
  } catch { response.writeHead(404); response.end(); }
});
await fs.mkdir(output, { recursive: true });
await new Promise(resolve => server.listen(Number(process.env.AUDIT_PORT || 0), '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// Probe auth/origin/CLEAR with the unchanged worker source in an isolated VM.
// Only session messages run here; the navigation fixture above uses a real SW.
function createSessionWorker() {
  const listeners = new Map(), events = [], pending = new Set();
  const sandbox = { URL, TextEncoder, crypto: webcrypto,
    self: { location: { origin }, addEventListener(type, handler) { listeners.set(type, handler); } },
    fetch() { throw Error('Network is forbidden in the synthetic session worker'); } };
  new vm.Script(workerSource, { filename: 'portal-sw.js' }).runInNewContext(sandbox);
  const summarize = snapshot => snapshot ? { panelOpen: snapshot.panelOpen, activeUsername: snapshot.activeUsername,
    drafts: (snapshot.drafts || []).map(({ username, body }) => ({ username, body })),
    contacts: snapshot.contacts?.length || 0,
    conversations: (snapshot.conversations || []).map(item => ({ username: item.username, messages: item.messages?.length || 0 })) } : null;
  async function dispatch(sourceUrl, data) {
    if (!/^PORTAL_CHAT_SESSION_(GET|PUT|CLEAR)$/.test(data?.type)) return { ignored: true };
    const start = performance.now(), work = [];
    let reply = null;
    const entry = { sequence: events.length + 1, type: data.type, route: new URL(sourceUrl).pathname,
      sameOrigin: new URL(sourceUrl).origin === origin,
      ...(data.type.endsWith('_PUT') ? { snapshot: summarize(data.snapshot) } : {}) };
    events.push(entry);
    listeners.get('message')({ data: structuredClone(data), source: { url: sourceUrl },
      ports: data.type.endsWith('_GET') ? [{ postMessage(value) { reply = structuredClone(value); } }] : [],
      waitUntil(promise) { work.push(Promise.resolve(promise)); } });
    const completion = Promise.all(work);
    pending.add(completion);
    try {
      const outcomes = await completion;
      entry.durationMs = Math.round((performance.now() - start) * 10) / 10;
      if (data.type.endsWith('_PUT')) entry.committed = outcomes[0] === true;
      if (data.type.endsWith('_GET')) { entry.hit = reply?.ok === true; entry.snapshot = summarize(reply?.snapshot); }
      return { reply };
    } finally { pending.delete(completion); }
  }
  return { dispatch, events, async flush() { await Promise.allSettled([...pending]); },
    evidence() { return { mode: 'protocol', source: 'portal-sw.js', sourceSha256: workerSourceSha256,
      counts: Object.fromEntries(['GET', 'PUT', 'CLEAR'].map(type => [type, events.filter(event => event.type.endsWith('_' + type)).length])),
      committedPuts: events.filter(event => event.committed).length,
      getHits: events.filter(event => event.hit).length, events }; } };
}

async function sessionContractProbe() {
  const worker = createSessionWorker();
  const request = async (type, authorization, snapshot, source = origin + '/') =>
    (await worker.dispatch(source, { type: `PORTAL_CHAT_SESSION_${type}`, authorization, snapshot })).reply;
  const tokenA = 'Bearer synthetic-contract-account-a-20261010';
  const tokenB = 'Bearer synthetic-contract-account-b-20261010';
  const snapshot = { panelOpen: true, activeUsername: 'fixture.friend', drafts: [{ username: 'fixture.friend', body: 'Rascunho sintético do contrato.' }] };
  await request('PUT', tokenA, snapshot);
  const sameToken = await request('GET', tokenA), otherToken = await request('GET', tokenB);
  const foreignOrigin = await request('GET', tokenA, undefined, 'https://fixture.invalid/');
  await request('PUT', tokenB, snapshot);
  const populatedB = await request('GET', tokenB);
  await request('CLEAR', undefined, undefined, 'https://fixture.invalid/');
  const afterForeignClear = await request('GET', tokenA);
  await request('PUT', 'Bearer short', snapshot);
  const shortToken = await request('GET', 'Bearer short');
  await request('CLEAR');
  const clearedA = await request('GET', tokenA), clearedB = await request('GET', tokenB);
  return { sourceSha256: workerSourceSha256,
    sameTokenRoundTrip: sameToken?.snapshot?.drafts[0]?.body === snapshot.drafts[0].body,
    differentTokenMisses: otherToken?.ok === false,
    foreignOriginMisses: foreignOrigin?.ok === false,
    foreignOriginCannotClear: afterForeignClear?.ok === true,
    shortTokenRejected: shortToken?.ok === false,
    secondTokenWasPopulated: populatedB?.ok === true,
    sameOriginClearRemovesBothTokens: clearedA?.ok === false && clearedB?.ok === false };
}
const sessionContract = sessionBridgeMode === 'protocol' ? await sessionContractProbe() : null;

async function installSessionBridge(context, audit) {
  if (sessionBridgeMode === 'blocked') return;
  context.on('serviceworker', worker => { audit.nativeSessionWorker = worker; });
  await context.addInitScript(() => {
    // Telemetry only: this marker precedes the application's own pagehide PUT.
    // The harness never writes a snapshot or changes the original message.
    // Init scripts also run in about:blank, which has no serviceWorker API.
    window.addEventListener('pagehide', () => navigator.serviceWorker?.controller?.postMessage({ type: 'SCENE_PAGEHIDE' }), { capture: true });
  });
}

function fixtures(role) {
  const user = { id: `synthetic-${role}`, username: `fixture.${role}`, name: citizenName,
    role, active: true, emailVerified: true, accountLevel: 'prata',
    documentCapabilities: { view: false, manage: false } };
  const profile = { name: citizenName, handle: user.username, isSelf: true, avatarAvailable: false,
    defaultPostAudience: 'friends', bio: 'Perfil inteiramente sintético para avaliação local.' };
  const bodies = [
    'Hoje encontrei uma nova receita de pão e resolvi experimentar. O resultado merece uma segunda tentativa! 🌿',
    'Uma ideia para o fim de semana: trocar livros que já lemos. Tenho histórias curtas, um caderno de desenhos e muita vontade de conhecer novas leituras.\n\nQual foi o último livro que surpreendeu você?',
    'Pequenas pausas também fazem parte do dia. ☀️',
    'Organizei as fotos de uma viagem imaginária e reencontrei boas lembranças. Este texto de exemplo ocupa algumas linhas para conferir a leitura no celular, inclusive quando o tamanho das letras aumenta.',
    'Alguém mais gosta de caminhar bem cedo e observar as mudanças de cor no céu?',
    'Rascunhei uma lista de ideias para nossa próxima conversa: música, jardinagem, receitas e projetos criativos. Tudo aqui é conteúdo fictício.',
  ];
  const posts = bodies.map((body, index) => ({ id: `fixture-post-${index}`, body,
    author: index % 2 ? friendProfile : profile, own: index % 2 === 0, audience: 'friends',
    createdAt: `2026-10-09T${String(12 - index).padStart(2, '0')}:00:00Z`,
    counts: { comments: index % 3, reactions: index * 3 } }));
  const messages = [
    { id: 1, fromUser: user.username, toUser: contact.username, body: 'Olá! Separei algumas ideias para nossa troca de livros.', sentAt: '2026-10-09T12:00:00Z', readAt: '2026-10-09T12:01:00Z' },
    { id: 2, fromUser: contact.username, toUser: user.username, body: 'Gostei da ideia. Podemos começar pelas histórias curtas e depois combinar uma conversa sobre as leituras.', sentAt: '2026-10-09T12:05:00Z' },
    { id: 3, fromUser: contact.username, toUser: user.username, body: 'Tenho uma sugestão para levar também. 📚', sentAt: '2026-10-09T12:06:00Z' },
  ];
  return { user, profile, posts, messages };
}

async function intercept(context, fixture, audit) {
  await context.routeWebSocket('**/*', socket => { audit.webSocketsBlocked++; socket.close(); });
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url()), method = request.method();
    if (!url.pathname.startsWith('/api/')) {
      if (url.origin === origin) return route.continue();
      audit.externalResourcesBlocked.push(url.origin + url.pathname);
      return route.fulfill({ status: 204, body: '' });
    }
    audit.apiCalls.push(`${method} ${url.pathname}${url.search}`);
    if (method === 'OPTIONS') return route.fulfill({ status: 204, body: '' });
    let data;
    const { user, profile, posts, messages } = fixture;
    if (url.pathname === '/api/auth/me') data = { user };
    else if (url.pathname === '/api/social/config') data = { backendEnabled: true, homeEnabled: true, available: true, profile };
    else if (url.pathname === '/api/social/me') data = { profile };
    else if (url.pathname === '/api/social/posts' && method === 'POST') {
      const payload = request.postDataJSON();
      audit.publications.push(payload);
      data = { post: { id: `fixture-created-${audit.publications.length}`, author: profile, own: true,
        body: payload.body, audience: payload.audience, createdAt: '2026-10-10T01:00:00Z', counts: { comments: 0, reactions: 0 } } };
    } else if (url.pathname.includes('/feed')) data = { posts, nextCursor: '' };
    else if (url.pathname.includes('/notifications')) data = { notifications: [], unreadCount: 0 };
    else if (url.pathname.includes('/relationships')) data = { profiles: url.searchParams.get('type') === 'friends' ? [friendProfile] : [], nextCursor: '' };
    else if (url.pathname === '/api/chat/users') data = { users: [contact] };
    else if (url.pathname === '/api/chat/contacts') data = { contacts: [contact] };
    else if (url.pathname === '/api/chat/groups') data = { enabled: true, protocol: 'groups-v1', groups: [] };
    else if (url.pathname === '/api/chat/messages') data = { messages: messages.filter(message => message.id > Number(url.searchParams.get('after') || 0)), pageSize: 50, receipt: {} };
    else if (url.pathname === '/api/chat/realtime/ticket') data = { ticket: 'synthetic-ticket' };
    else if (['/api/chat/presence', '/api/chat/delivery', '/api/chat/read', '/api/chat/typing'].includes(url.pathname)) data = { ok: true };
    else if (url.pathname === '/api/auth/security') data = { security: { emailVerified: true, email: 'fixture@example.invalid', privacyMode: 'anonima' } };
    else if (url.pathname === '/api/citizen/identity') data = { identity: {} };
    else if (url.pathname === '/api/council/my') data = { manifestations: [] };
    else if (url.pathname === '/api/pets/me') data = { state: petState };
    else if (url.pathname === '/api/pets/catalog') data = petCatalog();
    else if (url.pathname === '/api/pets/achievements') data = { achievements: [] };
    else { audit.unmappedApiCalls.push(`${method} ${url.pathname}`); data = { ok: true }; }
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
  });
}

async function metrics(page) {
  return page.evaluate(() => {
    const round = value => Math.round(value * 10) / 10;
    const visible = element => !!element && !!element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
    const rect = element => {
      if (!visible(element)) return null;
      const r = element.getBoundingClientRect();
      return Object.fromEntries(['x', 'y', 'width', 'height', 'right', 'bottom'].map(key => [key, round(r[key])]));
    };
    const one = selector => rect(document.querySelector(selector));
    const control = element => ({ name: element.getAttribute('aria-label') || element.textContent.trim().replace(/\s+/g, ' ').slice(0, 75),
      id: element.id || undefined, href: element.getAttribute('href') || undefined,
      rect: rect(element), expanded: element.getAttribute('aria-expanded') || undefined });
    const nav = document.querySelector('.social-mobile-nav');
    const navItems = [...(nav?.querySelectorAll('.social-mobile-nav-link') || [])].map(element => ({ ...control(element),
      accessibleLabel: element.getAttribute('aria-label') || '',
      visibleTextLabels: [...element.querySelectorAll(':scope > span:not(.social-nav-icon):not(.social-nav-badge):not(.portal-chat-launcher-icon):not(.chat-online-dot):not(.portal-chat-count)')]
        .filter(node => !node.className.includes('avatar') && node.textContent.trim() && visible(node)
          && node.getBoundingClientRect().width > 2 && node.getBoundingClientRect().height > 2).map(node => node.textContent.trim()),
      avatar: Boolean(element.querySelector('img, .social-avatar, [class*="avatar"]')) }));
    const cards = [...document.querySelectorAll('#socialShortcutGrid .hub-card')].map(element => ({
      href: element.getAttribute('href'), name: element.querySelector('h3')?.textContent || element.textContent.trim().slice(0, 60),
      rect: rect(element), ratio: round(element.getBoundingClientRect().width / element.getBoundingClientRect().height),
    }));
    const panel = document.querySelector('.portal-chat-panel');
    const chatOpen = document.querySelector('#portalChatRoot')?.classList.contains('open');
    const overflow = [...document.body.querySelectorAll('*')].filter(element => {
      if (!visible(element)) return false;
      const r = element.getBoundingClientRect();
      if (!r.width || (r.left >= -1 && r.right <= innerWidth + 1)) return false;
      // Cards may intentionally extend within the horizontal tools scroller.
      return !element.closest('#socialShortcutGrid, .portal-chat-messages');
    }).slice(0, 8).map(element => ({ tag: element.tagName, id: element.id, class: String(element.className).slice(0, 95), rect: rect(element) }));
    return {
      route: location.pathname, role: window.RegulationAuth?.getCachedUser()?.role,
      viewport: { width: innerWidth, height: innerHeight, visualHeight: round(visualViewport?.height || innerHeight) },
      header: one('.portal-topbar'), composer: one('.social-composer'), tools: one('.social-shortcuts'),
      firstPost: one('#socialFeedList .social-post'), feedCount: document.querySelectorAll('#socialFeedList .social-post').length,
      nav: { rect: rect(nav), count: navItems.length, destinations: navItems,
        rows: new Set(navItems.filter(item => item.rect).map(item => Math.round(item.rect.y))).size },
      squares: cards, authorizedCards: window.PortalTools?.cardsFor(window.RegulationAuth?.getCachedUser())?.map(card => card.href),
      pageOverflow: { pixels: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth), elements: overflow },
      controls: ['#homeAccountMenu > summary', '#homeComposerTrigger', '#homeComposerCollapse', '#portalChatLauncher'].map(selector => document.querySelector(selector)).filter(visible).map(control),
      focus: document.activeElement?.id || document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName,
      chat: chatOpen ? { panel: rect(panel), header: one('.portal-chat-header'), messages: one('#portalChatMessages'),
        input: one('#portalChatInput'), send: one('#portalChatSend'), contacts: one('#portalChatList'),
        conversation: document.querySelector('#portalChatConversationView')?.classList.contains('active'),
        contactName: document.querySelector('#portalChatHeaderName')?.textContent } : null,
    };
  });
}

function check(result, name, passed, detail) {
  result.checks.push({ name, passed: Boolean(passed), ...(detail === undefined ? {} : { detail }) });
}
async function reachableActions(locator) {
  const blocked = [];
  for (const item of await locator.all()) {
    const label = await item.getAttribute('aria-label') || (await item.innerText()).trim();
    try { await item.click({ trial: true, timeout: 1500 }); }
    catch { blocked.push(label); }
  }
  return blocked;
}
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
async function nativeHistoryAction(page, selector) {
  await page.evaluate(() => {
    window.__scenePopstateSeen = false;
    window.addEventListener('popstate', () => { window.__scenePopstateSeen = true; }, { once: true });
  });
  await page.locator(selector).click();
  await page.waitForFunction(() => window.__scenePopstateSeen);
  await settle(page);
}
async function capture(page, result, name) {
  await applyTextScale(page, result.textScale);
  await page.evaluate(() => document.fonts.ready);
  const file = `${result.id}-${name}.png`;
  await page.screenshot({ path: path.join(output, file), fullPage: false });
  const state = await metrics(page);
  result.scenes.push({ name, screenshot: file, ...state });
  check(result, `${name}: no page overflow`, state.pageOverflow.pixels <= 1, state.pageOverflow.pixels);
  if (state.route === '/') {
    check(result, `${name}: six navigation targets fit one visible row`, state.nav.count === 6 && state.nav.rows === 1
      && state.nav.destinations.every(item => item.rect && item.rect.width >= 43.9 && item.rect.height >= 44
        && item.rect.x >= -1 && item.rect.right <= state.viewport.width + 1
        && item.rect.y >= -1 && item.rect.bottom <= state.viewport.height + 1));
  }
  return state;
}

async function ready(page, home = true) {
  if (home) {
    await page.waitForFunction(() => Boolean(window.PortalHomeReady));
    await page.evaluate(() => window.PortalHomeReady);
    await page.locator('body.home-social-mobile').waitFor();
    await page.locator('#homeComposerTrigger').waitFor();
    await page.locator('#socialFeedList .social-post').first().waitFor();
  }
  await page.locator('#portalChatLauncher').waitFor({ state: 'attached' });
  await page.waitForFunction(() => Boolean(window.PortalCitizenMobileReady));
  await page.evaluate(() => window.PortalCitizenMobileReady);
  await page.waitForFunction(() => document.querySelectorAll('.social-mobile-nav .social-mobile-nav-link').length === 6);
}

async function presentationInteractions(page, result, audit) {
  await page.locator('#homeAccountMenu > summary').click();
  await page.locator('#homeAccountPanel').waitFor({ state: 'visible' });
  const account = await capture(page, result, 'account');
  check(result, 'native account details is expanded', await page.locator('#homeAccountMenu').evaluate(element => element.open));
  check(result, 'account panel has usable actions', await page.locator('#homeAccountPanel a, #homeAccountPanel button').count() > 0);
  const blockedAccountActions = await reachableActions(page.locator('#homeAccountPanel a, #homeAccountPanel button'));
  check(result, 'every account action is visible and receives pointer input', blockedAccountActions.length === 0, blockedAccountActions);
  await page.keyboard.press('Escape');
  await settle(page);
  check(result, 'Escape closes account and restores trigger focus', await page.locator('#homeAccountPanel').isHidden()
    && await page.locator('#homeAccountMenu > summary').evaluate(element => document.activeElement === element), account.focus);

  await page.locator('#homeComposerTrigger').click();
  await page.locator('#homeComposerPanel').waitFor({ state: 'visible' });
  check(result, 'composer opens with textarea focus', await page.locator('#socialComposerText').evaluate(element => document.activeElement === element));
  const draft = 'Rascunho sintético: uma ideia de leitura para compartilhar depois.';
  await page.locator('#socialComposerText').fill(draft);
  await page.locator('#socialComposerAudience').selectOption('self');
  await capture(page, result, 'composer');
  await page.locator('#homeComposerCollapse').click();
  check(result, 'collapse closes composer and restores trigger focus', await page.locator('#homeComposerPanel').isHidden()
    && await page.locator('#homeComposerTrigger').evaluate(element => document.activeElement === element));
  await page.locator('#homeComposerTrigger').click();
  check(result, 'composer retains draft and selected audience', await page.locator('#socialComposerText').inputValue() === draft
    && await page.locator('#socialComposerAudience').inputValue() === 'self');
  check(result, 'original form, textarea and audience nodes survive', await page.evaluate(() =>
    ['socialComposerForm', 'socialComposerText', 'socialComposerAudience'].every(id => window.__sceneOriginalNodes[id] === document.getElementById(id))));
  await page.locator('#socialComposerForm button[type="submit"]').click();
  await page.locator('[data-post-id="fixture-created-1"]').waitFor();
  check(result, 'existing form submits original body and audience once', audit.publications.length === 1
    && audit.publications[0].body === draft && audit.publications[0].audience === 'self');
  check(result, 'successful submit clears textarea', await page.locator('#socialComposerText').inputValue() === '');
  if (await page.locator('#homeComposerCollapse').isVisible()) await page.locator('#homeComposerCollapse').click();
  const menu = page.locator('[data-post-id="fixture-post-0"] .home-post-menu').first();
  if (await menu.count()) {
    const toggle = menu.locator('summary, button').first();
    await toggle.click();
    check(result, 'post menu preserves accessible original actions', await menu.getByRole('button', { name: 'Editar', exact: true }).isVisible()
      && await menu.getByRole('button', { name: 'Excluir', exact: true }).isVisible());
    await menu.getByRole('button', { name: 'Excluir', exact: true }).click();
    await page.locator('dialog[open]').waitFor();
    await page.setViewportSize({ width: 1024, height });
    await settle(page);
    await page.setViewportSize({ width: result.width, height });
    await settle(page);
    await page.locator('dialog[open]').getByRole('button', { name: 'Cancelar', exact: true }).click();
    await settle(page);
    check(result, 'cancel after mobile-desktop-mobile modal restores visible menu trigger', await toggle.evaluate(element => document.activeElement === element)
      && await toggle.isVisible());
    if (await menu.evaluate(element => element.open)) await toggle.click();
  } else check(result, 'post menu is present', false);
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function chatSessionState(page) {
  return page.evaluate(() => ({ route: window.PortalCitizenShell?.active().url.pathname || location.pathname,
    panelOpen: Boolean(document.getElementById('portalChatRoot')?.classList.contains('open')),
    conversationOpen: Boolean(document.getElementById('portalChatConversationView')?.classList.contains('active')),
    selectedHandle: new URL(document.getElementById('portalChatProfileLink')?.href || location.href).searchParams.get('u') || '',
    contactName: document.getElementById('portalChatHeaderName')?.textContent || '',
    draft: document.getElementById('portalChatInput')?.value || '' }));
}

async function verifySectionPersistence(page, result, audit, captureViews) {
  const departureDraft = chatDraft + ' Última edição antes de sair.';
  // A fresh user edit immediately before navigation exercises native pagehide
  // delivery, without awaiting the 140ms debounce or issuing a harness PUT.
  await page.locator('#portalChatInput').fill(departureDraft);
  const before = await chatSessionState(page);
  const retainedNavigation = await page.evaluate(() => Boolean(window.PortalCitizenShell));
  await page.locator('.social-mobile-nav a[href="/amigos/"]').click();
  await page.waitForFunction(() => (window.PortalCitizenShell?.active().url.pathname || location.pathname) === '/amigos/' && !window.PortalCitizenShell?.diagnostics().navigating);
  await ready(page, false);
  if (retainedNavigation) {
    check(result, 'retained Friends navigation closes Direct overlay', !(await chatSessionState(page)).panelOpen);
    await page.locator('#portalChatLauncher').click();
    await page.waitForFunction(() => document.getElementById('portalChatConversationView')?.classList.contains('active'));
    await page.waitForFunction(expected => document.getElementById('portalChatInput')?.value === expected, departureDraft);
  }
  if (sessionBridgeMode === 'protocol') await page.locator('[data-chat-user]').first().waitFor({ state: 'attached' });
  await settle(page);
  const friends = await chatSessionState(page);
  check(result, 'citizen Friends navigation succeeds', friends.route === '/amigos/');
  // Assert native restoration before any manual launcher/contact action.
  check(result, 'section navigation preserves chat draft', friends.draft === departureDraft);
  check(result, 'section navigation restores the open selected conversation', friends.panelOpen && friends.conversationOpen
    && friends.selectedHandle === contact.socialHandle && friends.contactName === contact.name);
  if (captureViews) await capture(page, result, 'friends-chat');
  const returnDraft = departureDraft + ' Edição feita em Amigos.';
  if (friends.conversationOpen) await page.locator('#portalChatInput').fill(returnDraft);
  // Início now closes an open mobile Chat in place. An explicit browser
  // navigation still exercises the native pagehide snapshot with Chat open.
  await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(origin + '/');
  await ready(page);
  if (sessionBridgeMode === 'protocol') await page.locator('[data-chat-user]').first().waitFor({ state: 'attached' });
  await settle(page);
  const returned = await chatSessionState(page);
  check(result, 'returning Home preserves chat draft', returned.draft === returnDraft);
  check(result, 'returning Home restores the open selected conversation', returned.panelOpen && returned.conversationOpen
    && returned.selectedHandle === contact.socialHandle && returned.contactName === contact.name);
  result.persistence = { mode: sessionBridgeMode, before, friends, returned,
    retainedNavigation, manualReopenAfterNavigation: retainedNavigation, awaitedDebounceBeforeNavigation: false, harnessGeneratedPuts: 0 };
}

async function persistenceDiagnostic(page, result, audit) {
  await page.locator('#portalChatLauncher').click();
  await page.locator(`[data-chat-user="${encodeURIComponent(contact.username)}"]`).click();
  await page.locator('#portalChatMessages [data-message-id="3"]').waitFor();
  await page.locator('#portalChatInput').fill(chatDraft);
  await verifySectionPersistence(page, result, audit, false);
}

async function chatInteractions(page, result, audit) {
  const peer = page.locator(`[data-chat-user="${encodeURIComponent(contact.username)}"]`);
  const launcher = page.locator('#portalChatLauncher');
  const input = page.locator('#portalChatInput');
  const draft = chatDraft;
  const openList = async () => {
    await launcher.click();
    await page.locator('#portalChatRoot.open').waitFor();
    await peer.waitFor();
    await settle(page);
  };
  const openConversation = async () => {
    await peer.click();
    await page.locator('#portalChatConversationView.active').waitFor();
    await page.locator('#portalChatMessages [data-message-id="3"]').waitFor();
    await settle(page);
  };
  await page.evaluate(() => { window.__sceneChatPriorFocus = document.activeElement; });
  await openList();
  await capture(page, result, 'chat-list');
  await openConversation();
  check(result, 'opening conversation focuses original input', await input.evaluate(element => document.activeElement === element));
  await input.fill(draft);
  const conversation = await capture(page, result, 'chat-conversation');
  check(result, 'long synthetic contact is displayed', conversation.chat?.contactName === contact.name);
  await page.setViewportSize({ width: result.width, height: 480 });
  await input.focus();
  const keyboard = await capture(page, result, 'chat-keyboard');
  const r = keyboard.chat?.input;
  check(result, 'keyboard-sized viewport keeps focused compose control visible', await input.evaluate(element => document.activeElement === element)
    && r && r.y >= -1 && r.bottom <= keyboard.viewport.height + 1, r);
  check(result, 'keyboard-sized Direct leaves bottom navigation visible', keyboard.nav.rect && keyboard.chat?.panel
    && keyboard.nav.rect.bottom <= keyboard.viewport.height + 1 && keyboard.chat.panel.bottom <= keyboard.nav.rect.y + 1,
  { panel: keyboard.chat?.panel, nav: keyboard.nav.rect });
  const blockedChatActions = await reachableActions(page.locator('#portalChatSend, .social-mobile-nav .social-mobile-nav-link'));
  check(result, 'keyboard-sized Send and all six nav controls receive pointer input', blockedChatActions.length === 0, blockedChatActions);
  await page.setViewportSize({ width: result.width, height });
  await nativeHistoryAction(page, '#portalChatBack');
  await page.locator('#portalChatContactsView.active').waitFor();
  await settle(page);
  await openConversation();
  check(result, 'UI Back preserves per-contact draft', await input.inputValue() === draft);
  check(result, 'mobile X is hidden while native close handler remains installed', await page.locator('#portalChatClose').isHidden());
  await nativeHistoryAction(page, '.social-mobile-nav a[href="/"]');
  await page.waitForFunction(() => !document.querySelector('#portalChatRoot')?.classList.contains('open'));
  await settle(page);
  check(result, 'Início closes Chat on the same Home route and restores prior focus', new URL(page.url()).pathname === '/'
    && await page.evaluate(() => document.activeElement === window.__sceneChatPriorFocus
      || (window.__sceneChatPriorFocus === document.body && document.activeElement === document.querySelector('.social-mobile-nav a[href="/"]'))));
  await launcher.click();
  await page.locator('#portalChatConversationView.active').waitFor();
  await settle(page);
  check(result, 'Início close and automatic reopen preserve selected conversation and draft', await input.inputValue() === draft
    && (await chatSessionState(page)).selectedHandle === contact.socialHandle);
  check(result, 'original chat nodes survive repeated opens', await page.evaluate(() =>
    ['portalChatRoot', 'portalChatLauncher', 'portalChatUnread', 'portalChatInput'].every(id => window.__sceneOriginalNodes[id] === document.getElementById(id))
    && document.querySelectorAll('#portalChatRoot').length === 1 && document.querySelectorAll('#portalChatLauncher').length === 1
    && document.getElementById('portalChatRoot').parentElement === document.body));
  check(result, 'Direct mount is idempotent', await page.evaluate(async () => {
    const { mountHomeMobileDirect } = await import('/js/home-mobile-direct.js');
    const before = document.getElementById('portalChatRoot');
    const first = mountHomeMobileDirect(), second = mountHomeMobileDirect();
    return first === second && before === document.getElementById('portalChatRoot')
      && document.querySelectorAll('#portalChatLauncher').length === 1;
  }));
  await page.goBack();
  await page.locator('#portalChatContactsView.active').waitFor();
  await settle(page);
  check(result, 'browser Back returns conversation to list', new URL(page.url()).pathname === '/'
    && await page.locator('#portalChatRoot').evaluate(element => element.classList.contains('open')));
  await page.goBack();
  await page.waitForFunction(() => !document.querySelector('#portalChatRoot')?.classList.contains('open'));
  await settle(page);
  check(result, 'browser Back closes list on Home', new URL(page.url()).pathname === '/');
  await openList();
  await openConversation();
  check(result, 'browser Back and reopen preserve draft', await input.inputValue() === draft);
  await verifySectionPersistence(page, result, audit, true);
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true,
  // Routes fulfill API calls before DNS. Resolver isolation also blocks HTML
  // preconnect hints, which are not regular Playwright-intercepted requests.
  args: ['--no-sandbox', '--disable-background-networking', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] });
const results = [];
try {
  for (const role of roles) for (const width of widths) for (const theme of themes) for (const textScale of scales) {
    // Admin is a separate shared-Home catalogue illustration, never citizen-access evidence.
    if (role === 'admin' && process.env.FULL_ADMIN_MATRIX !== '1'
      && (width !== interactionWidth || theme !== themes[0] || textScale !== scales[0])) continue;
    process.env.TEXT_SCALE = String(textScale);
    const result = { id: `${role}-${width}-${theme}-text${textScale * 100}`, role, width, theme, textScale,
      scope: role === 'admin' ? 'synthetic shared-Home catalogue illustration only' : 'synthetic citizen Home and Friends presentation',
      scenes: [], checks: [], errors: [] };
    if (sessionContract) check(result, 'native session token, origin and CLEAR contract holds',
      Object.values(sessionContract).filter(value => typeof value === 'boolean').every(Boolean), sessionContract);
    const audit = { apiCalls: [], publications: [], externalResourcesBlocked: [], unmappedApiCalls: [], webSocketsBlocked: 0 };
    const fixture = fixtures(role);
    const syntheticToken = `synthetic-scene-session-${role}-20261010-local-only`;
    const context = await browser.newContext({ viewport: { width, height }, screen: { width, height },
      hasTouch: true, isMobile: true, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: theme,
      locale: 'pt-BR', timezoneId: 'UTC', serviceWorkers: sessionBridgeMode === 'protocol' ? 'allow' : 'block',
      userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36' });
    await installSessionBridge(context, audit);
    await context.addInitScript(({ user, theme, syntheticToken }) => {
      localStorage.setItem('regulacao.portal.theme.active.v1', theme);
      sessionStorage.setItem('regulacao.portal.session', syntheticToken);
      sessionStorage.setItem('regulacao.portal.user', JSON.stringify(user));
      sessionStorage.setItem('regulacao.portal.user.validatedAt', String(Date.now()));
      delete window.PushManager;
      if (window.Notification) {
        Object.defineProperty(window.Notification, 'permission', { get: () => 'default' });
        window.Notification.requestPermission = async () => 'default';
      }
      window.__sceneOriginalNodes = {};
      const ids = ['socialComposerForm', 'socialComposerText', 'socialComposerAudience', 'portalChatRoot', 'portalChatLauncher', 'portalChatUnread', 'portalChatInput'];
      new MutationObserver(() => ids.forEach(id => {
        const node = document.getElementById(id);
        if (node && !window.__sceneOriginalNodes[id]) window.__sceneOriginalNodes[id] = node;
      })).observe(document, { childList: true, subtree: true });
    }, { user: fixture.user, theme, syntheticToken });
    await intercept(context, fixture, audit);
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    page.on('pageerror', error => result.errors.push(`${page.url()}: ${error.stack || error.message}`));
    try {
      await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
      await ready(page);
      if (process.env.PERSISTENCE_ONLY === '1') {
        await persistenceDiagnostic(page, result, audit);
      } else {
      const home = await capture(page, result, 'home');
      check(result, 'fixture role is retained', home.role === role, home.role);
      check(result, 'six icon navigation controls retain accessible labels', home.nav.count === 6
        && home.nav.destinations.every(item => item.accessibleLabel), home.nav.destinations.map(item => item.href || item.name));
      check(result, 'Chat is third and profile avatar is last', home.nav.destinations[2]?.id === 'portalChatLauncher'
        && home.nav.destinations.at(-1)?.href === '/perfil/' && home.nav.destinations.at(-1)?.avatar);
      check(result, 'navigation matches authorized six-icon order', JSON.stringify(home.nav.destinations.map(item => item.href || item.id))
        === JSON.stringify(['/', '/amigos/', 'portalChatLauncher', 'socialNotificationTriggerMobile', '/mascotes/', '/perfil/']));
      check(result, 'navigation text labels are visually hidden', home.nav.destinations.every(item => item.visibleTextLabels.length === 0));
      check(result, 'composer precedes tools and feed', home.composer && home.tools && home.firstPost
        && home.composer.y < home.tools.y && home.tools.y < home.firstPost.y);
      check(result, 'shortcut cards have square proportions', home.squares.length > 0
        && home.squares.every(card => card.ratio >= 0.95 && card.ratio <= 1.05), home.squares.map(card => card.ratio));
      check(result, 'rendered shortcuts belong to actual role catalogue', home.squares.every(card => home.authorizedCards.includes(card.href)));
      if (role === 'cidadao') check(result, 'citizen catalogue only contains citizen channel', JSON.stringify(home.authorizedCards) === JSON.stringify(['/cidadao/']), home.authorizedCards);
      else check(result, 'separate admin fixture demonstrates multiple shortcuts', home.squares.length > 1, home.squares.length);
      await page.locator('#socialFeedList .social-post').first().scrollIntoViewIfNeeded();
      await capture(page, result, 'feed');
      await page.evaluate(() => window.scrollTo(0, 0));
      const representative = width === interactionWidth && ((theme === themes[0] && textScale === scales[0])
        || (theme === themes.at(-1) && textScale === scales.at(-1)));
      if (role === 'cidadao' && representative && process.env.INTERACTIONS !== '0') {
        await presentationInteractions(page, result, audit);
        await chatInteractions(page, result, audit);
      }
      }
    } catch (error) {
      result.errors.push(error.stack?.split('\n').slice(0, 4).join('\n') || String(error));
      await page.screenshot({ path: path.join(output, `${result.id}-failure.png`), fullPage: false }).catch(() => {});
    } finally {
      if (audit.nativeSessionWorker) {
        result.sessionBridge = await audit.nativeSessionWorker.evaluate(() => self.__sceneSessionEvidence());
        check(result, 'native session worker has no handler errors', !result.sessionBridge.events.some(event => event.error));
        if (result.persistence) check(result, 'native pagehide PUT saves fresh edits on document departures',
          (result.persistence.retainedNavigation ? [result.persistence.returned.draft] : [result.persistence.friends.draft, result.persistence.returned.draft]).every(body => body
            && result.sessionBridge.events.some(event => event.committed && event.afterPagehideSequence
              && event.snapshot?.drafts.some(draft => draft.body === body))));
      } else result.sessionBridge = { mode: sessionBridgeMode, counts: { GET: 0, PUT: 0, CLEAR: 0 } };
      check(result, 'no page or harness errors', result.errors.length === 0);
      result.network = { allApiIntercepted: true, allWebSocketsIntercepted: true, webSocketsBlocked: audit.webSocketsBlocked,
        apiCalls: [...new Set(audit.apiCalls)], publications: audit.publications.length,
        unmappedApiCalls: [...new Set(audit.unmappedApiCalls)], externalResourcesBlocked: [...new Set(audit.externalResourcesBlocked)] };
      result.failedChecks = result.checks.filter(item => !item.passed).map(item => item.name);
      results.push(result);
      await fs.writeFile(path.join(output, 'summary.json'), JSON.stringify({ synthetic: true, sessionContract,
        notes: ['Only Home and Friends documents are served; every other route returns local 404.',
          'A real local worker runs the unchanged source session handler; native postMessage, MessageChannel and waitUntil carry navigation snapshots.',
          'Only session messages are registered; cache, fetch, route warming and push are suppressed. Worker restart and production cache behavior are outside this fixture.',
          'Auth/origin/CLEAR probes execute the same exact source handler in an isolated VM. Blocked mode reproduces the old fixture.',
          'Session state remains an in-memory Map; this is native token-store separation evidence, not end-to-end account-switch authorization.',
          'Text 200 is synthetic CSS font scaling, not a device OS zoom claim.',
          'Keyboard view uses a 480px viewport, not real keyboard emulation.',
          'Admin scenes show the shared Home layout and do not establish citizen access.'], results }, null, 2) + '\n');
      console.log(JSON.stringify({ id: result.id, screenshots: result.scenes.length, failedChecks: result.failedChecks, errors: result.errors }));
      await context.close();
    }
  }
} finally {
  if (originalScale === undefined) delete process.env.TEXT_SCALE; else process.env.TEXT_SCALE = originalScale;
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
console.log(`Scene evidence: ${path.join(output, 'summary.json')}`);
if (results.some(result => result.failedChecks.length)) process.exitCode = 1;
