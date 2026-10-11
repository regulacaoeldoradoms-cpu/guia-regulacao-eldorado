// Local-only focused regression harness. Synthetic data; API/WebSocket/DNS isolation.
// Run: node testing/citizen-layout/mobile-profile-refinement.mjs [output-directory]
// Optional: CASES=own-320-light-100 MODE=mobile|preservation|baseline BASELINE_ROOT=/path/to/ac89d0fb
// INTERACTIONS=0 limits mobile cases to profile layout/account/photo/form checks.
// CASES=shared-mascotes runs only the shared Mascotes navigation/close smoke.
// CASES=group-own-390-dark-100 exercises native asynchronous group reopening.
// CASES=mascotes-breakpoints checks mobile-only Chat across desktop/print transitions.
// MODE=preservation also compares fresh desktop/print Mascotes with no native Chat.
// BASELINE_ROOT is required for preservation. No production endpoints or credentials.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { petCatalog } from '../../worker/pet-catalog.js';
import { initialPetState, publicPetState } from '../../worker/pet-domain.js';
import { applyTextScale } from './text-scale.mjs';

const root = await fs.realpath(process.env.PORTAL_ROOT || path.resolve(import.meta.dirname, '../..'));
const output = path.resolve(process.argv[2] || path.join(root, '.local/mobile-profile-refinement'));
const mode = process.env.MODE || 'mobile';
const baselineRoot = process.env.BASELINE_ROOT ? await fs.realpath(process.env.BASELINE_ROOT) : null;
if (!['mobile','preservation','baseline'].includes(mode)) throw Error('Unknown MODE');
if (mode === 'preservation' && !baselineRoot) throw Error('BASELINE_ROOT required');
const height = 844;
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
    const record = {sequence:sceneEvents.length+1,type:event.data.type,clientId:event.source.id,route:new URL(event.source.url).pathname,sameOrigin:new URL(event.source.url).origin===self.location.origin};
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

const ownName = 'Maria Aparecida de Oliveira dos Santos';
const friendName = 'João Antônio de Albuquerque Figueiredo';
const ownHandle = 'fixture.cidadao';
const friendHandle = 'fixture.friend';
const syntheticToken = 'synthetic-refinement-session-20261010-local-only';
// Two generated solid-color PNGs, never account photos or reference images.
const ownAvatar = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGPQK0snCTGMahjVMHw1AAC5+AsQ37MZGwAAAABJRU5ErkJggg==';
const friendAvatar = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGOo9J1LEmIY1TCqYfhqAACW4WMQoiLc0gAAAABJRU5ErkJggg==';
const user = { id: 'synthetic-citizen', username: ownHandle, name: ownName, role: 'cidadao', active: true,
  emailVerified: true, accountLevel: 'prata', avatarDataUrl:'data:image/png;base64,' + ownAvatar,
  documentCapabilities: { view: false, manage: false } };
const commonProfile = { coverTheme: 'aurora', coverPattern: 'waves', moduleOrder: ['about','friends','posts'],
  bio: 'Perfil inteiramente sintético. Gosto de livros, caminhadas e ideias para conversar.',
  status: 'Uma pequena pausa para conversar e compartilhar ideias.', interests: ['Leitura','Jardinagem','Música'],
  counts: { friends: 8, posts: 6 }, avatarAvailable: true, acceptFriendRequests: true };
const ownProfile = { ...commonProfile, name: ownName, handle: ownHandle, isSelf: true,
  defaultPostAudience: 'friends', profileVisibility: 'friends', homePreference: 'feed' };
const friendProfile = { ...commonProfile, name: friendName, handle: friendHandle, isSelf: false, relationship: 'friends' };
const contact = { username: friendHandle, socialHandle: friendHandle, name: friendName, role: 'cidadao',
  jobTitle: 'Cidadão', online: true, unread: 2, firstUnreadId: 2, avatarAvailable: true,
  lastMessageAt: '2026-10-10T12:06:00Z', receivedThroughId: 24, avatarDataUrl:'data:image/png;base64,' + friendAvatar };
const posts = Array.from({ length: 6 }, (_, i) => ({ id: `fixture-post-${i}`, body:
  `Publicação sintética ${i + 1}. Uma história de leitura, jardinagem e boas conversas. Este conteúdo fictício permite conferir a leitura com letras ampliadas.`,
  author: i % 2 ? friendProfile : ownProfile, own: i % 2 === 0, audience: 'friends',
  createdAt: `2026-10-09T${String(12 - i).padStart(2,'0')}:00:00Z`, counts: { comments: 0, reactions: i } }));
const messages = Array.from({ length: 24 }, (_, i) => ({ id: i + 1,
  fromUser: i % 2 ? ownHandle : friendHandle, toUser: i % 2 ? friendHandle : ownHandle,
  body: `Mensagem sintética ${i + 1}. Vamos organizar as ideias para uma conversa sobre livros e jardins imaginários.`,
  sentAt: `2026-10-10T12:${String(i).padStart(2,'0')}:00Z`, readAt: i < 20 ? '2026-10-10T12:30:00Z' : null }));
const group = { id:'fixture-group', name:'Grupo sintético de leitura', description:'Fixture local de grupo permitido',
  state:'member', role:'member', creatorUsername:friendHandle, memberCount:2, closed:false, muted:false,
  unread:0, firstUnreadId:0, lastId:24, avatarAvailable:false };
const groupMessages = messages.map(message => ({ ...message, senderName:message.fromUser === ownHandle ? ownName : friendName }));
const pet = initialPetState();
pet.pet = { typeId: 'cat', variant: 'gray' };
pet.petRevision = 1;
pet.preferences.motionEnabled = false;
const petState = publicPetState(pet, 120, 1, 1791540000);
const documents = new Set(['/', '/home/', '/perfil/', '/amigos/', '/cidadao/', '/ferramentas/', '/mascotes/']);
const mime = { '.js':'text/javascript', '.css':'text/css', '.html':'text/html', '.svg':'image/svg+xml',
  '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2', '.webmanifest':'application/manifest+json' };

for (const route of ['/amigos/', '/notificacoes/', '/seguranca/', '/configuracoes/', '/conquistas/', '/login/']) documents.add(route);

async function serve(sourceRoot) {
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname === '/portal-sw.js') {
        response.writeHead(200, { 'Content-Type':'text/javascript', 'Cache-Control':'no-store', 'Service-Worker-Allowed':'/' });
        response.end(sessionWorkerSource); return;
      }
      const asset = /^\/(js|css|assets|vendor)\//.test(pathname) || /^\/[^/]+\.webmanifest$/.test(pathname);
      if (!documents.has(pathname) && !asset) throw Error('Outside document scope');
      const file = await fs.realpath(path.resolve(sourceRoot, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : '')));
      if (!file.startsWith(sourceRoot + path.sep) || (!documents.has(pathname) && path.extname(file) === '.html')) throw Error('Outside asset scope');
      response.writeHead(200, { 'Content-Type':mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
      response.end(await fs.readFile(file));
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, origin:`http://127.0.0.1:${server.address().port}` };
}

async function intercept(context, origin, audit) {
  await context.routeWebSocket('**/*', socket => { audit.webSocketsBlocked++; socket.close(); });
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url()), method = request.method();
    if (request.isNavigationRequest() && request.frame() === request.frame().page().mainFrame()) audit.documents.push(url.pathname + url.search);
    if (!url.pathname.startsWith('/api/')) {
      audit.resources.push(url.pathname + url.search);
      if (url.origin === origin) return route.continue();
      audit.blockedResources.push(url.origin + url.pathname);
      return route.fulfill({ status:204, body:'' });
    }
    audit.apiCalls.push(`${method} ${url.pathname}${url.search}`);
    if (method === 'OPTIONS') return route.fulfill({ status:204, body:'' });
    let data, status = 200;
    if (url.pathname === '/api/auth/me') data = { user };
    else if (url.pathname === '/api/auth/logout') data = { ok:true };
    else if (url.pathname === '/api/social/config') data = { backendEnabled:true, homeEnabled:true, available:true, profile:ownProfile };
    else if (url.pathname === '/api/social/me') data = { profile:ownProfile };
    else if (url.pathname.startsWith('/api/social/avatars/')) return route.fulfill({ contentType:'image/png', body:Buffer.from(url.pathname.includes(friendHandle) ? friendAvatar : ownAvatar, 'base64') });
    else if (url.pathname === `/api/social/profiles/${friendHandle}`) data = { profile:friendProfile };
    else if (url.pathname === `/api/social/profiles/${ownHandle}`) data = { profile:ownProfile };
    else if (url.pathname === `/api/social/profiles/${friendHandle}/posts`) data = { posts:posts.map(post => ({ ...post, author:friendProfile, own:false })), nextCursor:'' };
    else if (url.pathname === `/api/social/profiles/${ownHandle}/posts`) data = { posts:posts.map(post => ({ ...post, author:ownProfile, own:true })), nextCursor:'' };
    else if (/^\/api\/social\/profiles\//.test(url.pathname) && !url.pathname.endsWith('/feed')) { status = 404; data = { error:'Perfil social não encontrado.' }; }
    else if (url.pathname.includes('/feed')) data = { posts, nextCursor:'' };
    else if (url.pathname.includes('/notifications')) data = { notifications:[], unreadCount:0 };
    else if (url.pathname.includes('/relationships')) data = { profiles:url.searchParams.get('type') === 'friends' ? [friendProfile] : [], nextCursor:'' };
    else if (url.pathname === '/api/chat/users') data = { users:[contact] };
    else if (url.pathname === '/api/chat/contacts') data = { contacts:[contact] };
    else if (url.pathname === '/api/chat/groups') data = { enabled:true, protocol:'groups-v1', groups:audit.groupFixture ? [group] : [] };
    else if (audit.groupFixture && url.pathname === `/api/chat/groups/${group.id}/messages`) {
      if (url.searchParams.get('after') === '0') {
        audit.groupMessageRequests++;
        if (audit.groupMessageRequests === 2) await new Promise(resolve => { audit.releaseGroupReload = resolve; audit.notifyGroupReload(); });
      }
      data = { group, messages:groupMessages.filter(message => message.id > Number(url.searchParams.get('after') || 0)), pageSize:50, senders:[] };
    }
    else if (audit.groupFixture && url.pathname === `/api/chat/groups/${group.id}/receipt` && method === 'POST') data = { ok:true };
    else if (audit.groupFixture && url.pathname === `/api/chat/groups/${group.id}`) data = { group, members:[
      { username:ownHandle, name:ownName, state:'member', role:'member', accountRole:'cidadao', avatarAvailable:false },
      { username:friendHandle, name:friendName, state:'member', role:'owner', accountRole:'cidadao', avatarAvailable:false }
    ] };
    else if (url.pathname === '/api/chat/messages') data = { messages:messages.filter(message => message.id > Number(url.searchParams.get('after') || 0)), pageSize:50, receipt:{} };
    else if (url.pathname === '/api/chat/realtime/ticket') data = { ticket:'synthetic-ticket' };
    else if (['/api/chat/presence','/api/chat/delivery','/api/chat/read','/api/chat/typing'].includes(url.pathname)) data = { ok:true };
    else if (url.pathname === '/api/auth/security') data = { security:{ emailVerified:true, email:'fixture@example.invalid', privacyMode:'anonima' } };
    else if (url.pathname === '/api/citizen/identity') data = { identity:{ displayName:ownName, handle:ownHandle, canChangeHandle:true } };
    else if (url.pathname === '/api/council/my') data = { manifestations:[] };
    else if (url.pathname === '/api/pets/me') data = { state:petState };
    else if (url.pathname === '/api/pets/catalog') data = petCatalog();
    else if (url.pathname === '/api/pets/achievements') data = { achievements:[] };
    else if (url.pathname === '/api/observability' && method === 'POST') data = { ok:true };
    else { audit.unmappedApiCalls.push(`${method} ${url.pathname}`); status = 501; data = { error:'Unmapped synthetic API' }; }
    await route.fulfill({ status, contentType:'application/json', body:JSON.stringify(data) });
  });
}

const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
function check(result, name, passed, detail) { result.checks.push({ name, passed:Boolean(passed), ...(detail === undefined ? {} : { detail }) }); }
async function ready(page, route, candidate = true) {
  if (candidate && mode !== 'baseline' && /^\/(?:perfil|amigos|mascotes)\//.test(route) && page.viewportSize().width <= 900) await page.waitForFunction(route => window.PortalCitizenShell?.active().url.pathname + (window.PortalCitizenShell?.active().url.search || '') === route && !window.PortalCitizenShell.diagnostics().navigating, route);
  if (route.startsWith('/perfil/')) { await page.locator('#socialProfile:not([hidden])').waitFor(); await page.locator('#profilePosts [data-post-id]').first().waitFor(); }
  if (route === '/') { await page.waitForFunction(() => Boolean(window.PortalHomeReady)); await page.evaluate(() => window.PortalHomeReady); }
  await page.locator('#portalChatLauncher').waitFor({ state:'attached' });
  await page.locator('.social-mobile-nav').waitFor({ state:'attached' });
  if (candidate && mode !== 'baseline') {
    await page.waitForFunction(() => Boolean(window.PortalCitizenMobileReady));
    await page.evaluate(() => window.PortalCitizenMobileReady);
  }
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
}

async function newPage(browser, scenario, origin, result) {
  const audit = { apiCalls:[], documents:[], resources:[], blockedResources:[], unmappedApiCalls:[], webSocketsBlocked:0 };
  if (scenario.group) {
    audit.groupFixture = true;
    audit.groupMessageRequests = 0;
    audit.groupReloadReached = new Promise(resolve => { audit.notifyGroupReload = resolve; });
  }
  const context = await browser.newContext({ viewport:{ width:scenario.width, height }, screen:{ width:scenario.width, height },
    hasTouch:scenario.width <= 900, isMobile:scenario.width <= 900, deviceScaleFactor:1, reducedMotion:'reduce',
    colorScheme:scenario.theme, locale:'pt-BR', timezoneId:'UTC', serviceWorkers:'allow' });
  context.on('serviceworker', worker => { audit.worker = worker; });
  await context.addInitScript(({ user, theme, syntheticToken, seedOnce }) => {
    if (location.protocol !== 'http:') return;
    localStorage.setItem('regulacao.portal.theme.active.v1', theme);
    if (!seedOnce || !sessionStorage.getItem('__shellFixtureSeeded')) {
      sessionStorage.setItem('regulacao.portal.session', syntheticToken);
      sessionStorage.setItem('regulacao.portal.user', JSON.stringify(user));
      sessionStorage.setItem('regulacao.portal.user.validatedAt', String(Date.now()));
      if (seedOnce) sessionStorage.setItem('__shellFixtureSeeded', 'true');
    }
    window.__refinementDocument = crypto.randomUUID();
    window.__refinementPagehides = 0;
    window.addEventListener('pagehide', () => { window.__refinementPagehides++; navigator.serviceWorker?.controller?.postMessage({ type:'SCENE_PAGEHIDE' }); }, { capture:true });
    delete window.PushManager;
    if (window.Notification) {
      Object.defineProperty(window.Notification, 'permission', { get:() => 'default' });
      window.Notification.requestPermission = async () => 'default';
    }
    window.__originalRefinementNodes = {};
    const ids = ['portalChatRoot','portalChatLauncher','portalChatInput','portalChatUnread','profileEditorForm','profilePhotoCamera','profileAvatar'];
    new MutationObserver(() => ids.forEach(id => {
      const node = document.getElementById(id);
      if (node && !window.__originalRefinementNodes[id]) window.__originalRefinementNodes[id] = node;
    })).observe(document, { childList:true, subtree:true });
  }, { user, theme:scenario.theme, syntheticToken, seedOnce:scenario.seedOnce });
  await intercept(context, origin, audit);
  const page = await context.newPage();
  page.setDefaultTimeout(9000);
  page.on('pageerror', error => result.errors.push(`${page.url()}: ${error.stack || error.message}`));
  return { page, context, audit };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const visible = node => Boolean(node?.getClientRects().length) && getComputedStyle(node).visibility !== 'hidden';
    const rect = node => {
      if (!visible(node)) return null;
      const r = node.getBoundingClientRect();
      return Object.fromEntries(['x','y','width','height','right','bottom'].map(key => [key, Math.round(r[key] * 10) / 10]));
    };
    const nav = document.querySelector('.social-mobile-nav');
    const items = [...(nav?.querySelectorAll('.social-mobile-nav-link') || [])].map(node => ({
      id:node.id, href:node.getAttribute('href'), label:node.getAttribute('aria-label'), rect:rect(node),
      avatar:node.querySelector('.home-nav-profile-avatar')?.getAttribute('style') || null,
      textLabels:[...node.querySelectorAll(':scope > span')].filter(span => !/icon|badge|avatar|dot|count/.test(span.className) && visible(span) && span.getBoundingClientRect().width > 2).map(span => span.textContent.trim())
    }));
    const input = document.getElementById('portalChatInput'), messages = document.getElementById('portalChatMessages');
    return { url:(window.PortalCitizenShell?.active().url || location).pathname + (window.PortalCitizenShell?.active().url || location).search, document:window.__refinementDocument,
      pagehides:window.__refinementPagehides, scrollY:window.scrollY, width:innerWidth, height:innerHeight,
      overflow:Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      nav:{ rect:rect(nav), items }, rootCount:document.querySelectorAll('#portalChatRoot').length,
      launcherCount:document.querySelectorAll('#portalChatLauncher').length,
      chat:{ open:Boolean(document.getElementById('portalChatRoot')?.classList.contains('open')),
        conversation:Boolean(document.getElementById('portalChatConversationView')?.classList.contains('active')),
        selected:new URL(document.getElementById('portalChatProfileLink')?.href || location.href).searchParams.get('u'),
        draft:input?.value, selection:[input?.selectionStart,input?.selectionEnd], messageScroll:messages?.scrollTop,
        close:rect(document.getElementById('portalChatClose')), panel:rect(document.querySelector('.portal-chat-panel')),
        back:rect(document.getElementById('portalChatBack')), input:rect(input), send:rect(document.getElementById('portalChatSend')) },
      profile:{ name:document.getElementById('profileName')?.textContent, avatar:rect(document.getElementById('profileAvatar')),
        camera:rect(document.getElementById('profilePhotoCamera')), editorVisible:visible(document.getElementById('profileEditor')),
        modules:[...document.querySelectorAll('#profileModules > [data-profile-module]')].filter(visible).map(node => node.dataset.profileModule) },
      focus:document.activeElement?.id || document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName,
      nodeIdentity:Object.entries(window.__originalRefinementNodes || {}).every(([id,node]) => !node.isConnected || document.getElementById(id) === node),
      rootAtBody:document.getElementById('portalChatRoot')?.parentElement === document.body };
  });
}

async function capture(page, result, name) {
  process.env.TEXT_SCALE = String(result.scale || 1);
  await applyTextScale(page, result.scale || 1);
  await settle(page);
  const state = await snapshot(page), filename = `${result.id}-${name}.png`;
  await page.screenshot({ path:path.join(output, filename), fullPage:false });
  result.scenes.push({ name, screenshot:filename, ...state });
  return state;
}

async function navChecks(page, result, name) {
  const state = await snapshot(page), items = state.nav.items;
  check(result, `${name}: original native root and launcher remain unique`, state.rootCount === 1 && state.launcherCount === 1 && state.rootAtBody && state.nodeIdentity);
  check(result, `${name}: exact six navigation targets`, JSON.stringify(items.map(item => item.href || item.id)) === JSON.stringify(['/', '/amigos/', 'portalChatLauncher', 'socialNotificationTriggerMobile', '/mascotes/', '/perfil/']));
  check(result, `${name}: named icon targets and own avatar last`, items.length === 6 && items.every(item => item.label && item.textLabels.length === 0) && items.at(-1).avatar !== null, items);
  check(result, `${name}: nav avatar comes from authenticated account`, await page.evaluate(() => {
    const source = document.querySelector('.portal-topbar .portal-profile-avatar:not(.home-nav-profile-avatar)');
    const clone = document.querySelector('.social-mobile-nav .home-nav-profile-avatar');
    return Boolean(source && clone && source.style.backgroundImage !== 'none' && source.style.backgroundImage && source.style.backgroundImage === clone.style.backgroundImage);
  }));
  check(result, `${name}: navigation fits with reachable touch targets`, items.length === 6 && items.every(item => item.rect && item.rect.width >= 43.9 && item.rect.height >= 44 && item.rect.x >= -1 && item.rect.right <= state.width + 1 && item.rect.y >= 0 && item.rect.bottom <= state.height + 1));
  check(result, `${name}: no horizontal page overflow`, state.overflow <= 1, state.overflow);
  const blocked = [];
  for (const item of await page.locator('.social-mobile-nav .social-mobile-nav-link').all()) {
    try { await item.click({ trial:true, timeout:1200 }); } catch { blocked.push(await item.getAttribute('aria-label')); }
  }
  check(result, `${name}: every navigation control receives pointer input`, blocked.length === 0, blocked);
}

async function profileActions(page, result, own) {
  await page.locator('#profileAccountMenu > summary').click();
  await page.locator('#profileAccountPanel').waitFor({ state:'visible' });
  await capture(page, result, 'account');
  check(result, 'expanded profile account has no visible Tools access', await page.locator('a[href="/ferramentas/"]:visible').count() === 0);
  const blocked = [];
  for (const action of await page.locator('#profileAccountPanel a, #profileAccountPanel button').all()) {
    try { await action.click({ trial:true, timeout:1200 }); } catch { blocked.push(await action.innerText()); }
  }
  check(result, 'account actions remain reachable at current scale', !blocked.length, blocked);
  await page.keyboard.press('Escape');
  check(result, 'Escape closes account and returns visible trigger focus', await page.locator('#profileAccountMenu').evaluate(node => !node.open && node.querySelector('summary') === document.activeElement));
  const brokenWords = await page.locator('#profileActions').evaluate(container => {
    const failures = [];
    for (const button of container.querySelectorAll('button')) {
      const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) for (const match of walker.currentNode.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(walker.currentNode, match.index); range.setEnd(walker.currentNode, match.index + match[0].length);
        if (new Set([...range.getClientRects()].map(rect => Math.round(rect.y))).size > 1) failures.push(match[0]);
      }
    }
    return failures;
  });
  check(result, 'profile action labels preserve whole words', brokenWords.length === 0, brokenWords);
  const blockedProfile = [];
  for (const action of await page.locator('#profileActions button:enabled').all()) {
    try { await action.click({ trial:true, timeout:1500 }); } catch { blockedProfile.push(await action.innerText()); }
  }
  check(result, 'profile actions remain reachable at current scale', !blockedProfile.length, blockedProfile);
  if (own) {
    await page.locator('#profilePhotoCamera').click();
    await page.locator('#profilePhotoDialog[open]').waitFor();
    await capture(page, result, 'photo-dialog');
    await page.getByRole('button', { name:'Escolher foto', exact:true }).click({ trial:true });
    await page.locator('#profilePhotoDialog').getByRole('button', { name:'Cancelar', exact:true }).click();
    check(result, 'native photo dialog closes to original camera', await page.locator('#profilePhotoCamera').evaluate(node => document.activeElement === node));
    await page.getByRole('button', { name:'Personalizar perfil', exact:true }).click();
    await page.locator('#profileEditBio').fill('Bio sintética ainda não salva.');
    const form = await page.evaluate(() => ({ id:document.getElementById('profileEditorForm') === window.__originalRefinementNodes.profileEditorForm, value:document.getElementById('profileEditBio').value }));
    check(result, 'original profile form accepts an unsaved draft', form.id && form.value === 'Bio sintética ainda não salva.');
  }
  await page.evaluate(() => scrollTo(0, 0));
}

async function chatExercise(page, result, audit, origin, profileRoute) {
  await page.evaluate(() => scrollTo(0, 360));
  const before = await snapshot(page), documentsBefore = audit.documents.length;
  await page.locator('#portalChatLauncher').click();
  await page.locator('#portalChatRoot.open').waitFor();
  await page.locator(`[data-chat-user="${friendHandle}"]`).first().click();
  await page.locator('#portalChatConversationView.active').waitFor();
  await page.locator('#portalChatMessages .portal-chat-message').first().waitFor();
  const draft = `Rascunho fresco ${result.id}: último caractere antes de fechar.`;
  await page.locator('#portalChatInput').fill(draft);
  await page.locator('#portalChatInput').evaluate(node => { node.setSelectionRange(5, 13); document.getElementById('portalChatMessages').scrollTop = 70; });
  const conversation = await capture(page, result, 'conversation');
  check(result, 'mobile X is absent from the visible interface', conversation.chat.close === null);
  check(result, 'native Back remains visible in conversation', conversation.chat.back?.width > 0);
  for (const selector of ['#portalChatInput','#portalChatSend','#portalChatBack']) {
    try { await page.locator(selector).click({ trial:true, timeout:1500 }); check(result, `${selector} receives input at current text scale`, true); }
    catch { check(result, `${selector} receives input at current text scale`, false); }
  }
  await page.locator('.social-mobile-nav a[href="/"]').click();
  await page.locator('#portalChatRoot.open').waitFor({ state:'hidden' });
  await page.waitForFunction(() => !history.state?.__portalHomeDirect);
  await settle(page);
  const closed = await snapshot(page);
  check(result, 'open-chat Início closes without navigation or pagehide', closed.document === before.document && closed.url === profileRoute && closed.pagehides === 0 && audit.documents.length === documentsBefore, { before, closed, documents:audit.documents });
  check(result, 'closing restores underlying page scroll', Math.abs(closed.scrollY - before.scrollY) <= 1, { before:before.scrollY, after:closed.scrollY });
  check(result, 'closing restores the prior underlying focus', closed.focus === before.focus && await page.evaluate(() => document.activeElement.getBoundingClientRect().height > 0), { before:before.focus, after:closed.focus });
  check(result, 'Perfil has no visible Tools access after closing Chat', await page.locator('a[href="/ferramentas/"]:visible').count() === 0);
  await page.locator('#portalChatLauncher').click();
  await page.locator('#portalChatConversationView.active').waitFor();
  await page.waitForFunction(() => history.state?.__portalHomeDirect?.depth === 2);
  await settle(page);
  const reopened = await snapshot(page);
  check(result, 'reopen automatically restores selected conversation and fresh draft', reopened.chat.selected === friendHandle && reopened.chat.draft === draft, reopened.chat);
  check(result, 'reopen retains message scroll and input selection', Math.abs(reopened.chat.messageScroll - conversation.chat.messageScroll) <= 2 && JSON.stringify(reopened.chat.selection) === JSON.stringify(conversation.chat.selection), { before:conversation.chat, after:reopened.chat });
  await page.locator('#portalChatBack').click();
  await page.locator('#portalChatContactsView.active').waitFor();
  await settle(page);
  check(result, 'native internal Back returns to list and focuses a contact', await page.evaluate(() => Boolean(document.activeElement?.closest('[data-chat-user]'))));
  await page.locator(`[data-chat-user="${friendHandle}"]`).first().click();
  await page.locator('#portalChatConversationView.active').waitFor();
  await page.waitForFunction(() => history.state?.__portalHomeDirect?.depth === 2);
  check(result, 'internal Back and reselect keep draft', await page.locator('#portalChatInput').inputValue() === draft);
  await page.goBack();
  await page.locator('#portalChatContactsView.active').waitFor();
  await page.waitForFunction(() => history.state?.__portalHomeDirect?.depth === 1);
  await page.goBack();
  await page.locator('#portalChatRoot.open').waitFor({ state:'hidden' });
  check(result, 'browser Back handles list then closed without leaving profile', await page.evaluate(route => (window.PortalCitizenShell?.active().url || location).pathname + (window.PortalCitizenShell?.active().url || location).search === route, profileRoute) && await page.evaluate(() => window.__refinementDocument) === before.document);
  await page.locator('#portalChatLauncher').click();
  if (!(await page.locator('#portalChatConversationView').evaluate(node => node.classList.contains('active')))) await page.locator(`[data-chat-user="${friendHandle}"]`).first().click();
  await page.locator('#portalChatConversationView.active').waitFor();
  const retainedNavigation = await page.evaluate(() => Boolean(window.PortalCitizenShell));
  result.retainedNavigation = retainedNavigation;
  const departure = draft + ' Edição imediata antes de Amigos.';
  await page.locator('#portalChatInput').fill(departure);
  await page.locator('.social-mobile-nav a[href="/amigos/"]').click();
  await page.waitForFunction(() => (window.PortalCitizenShell?.active().url || location).pathname === '/amigos/' && !window.PortalCitizenShell?.diagnostics().navigating);
  await ready(page, '/amigos/');
  if (retainedNavigation) {
    check(result, 'retained Friends route closes Direct without a new document', audit.documents.length === documentsBefore && !await page.locator('#portalChatRoot').evaluate(node => node.classList.contains('open')));
    await page.locator('#portalChatLauncher').click();
  }
  await page.locator('#portalChatConversationView.active').waitFor();
  const friends = await capture(page, result, 'friends-restored');
  check(result, 'native worker restores fresh draft and selection after section navigation', friends.chat.open && friends.chat.selected === friendHandle && friends.chat.draft === departure, friends.chat);
  await navChecks(page, result, 'Friends while Chat open');
  const returning = departure + ' Edição feita em Amigos.';
  await page.locator('#portalChatInput').fill(returning);
  await page.locator('.social-mobile-nav a[href="/perfil/"]').click();
  await page.waitForFunction(() => (window.PortalCitizenShell?.active().url || location).pathname === '/perfil/' && !window.PortalCitizenShell?.diagnostics().navigating);
  await ready(page, '/perfil/');
  if (retainedNavigation) await page.locator('#portalChatLauncher').click();
  await page.locator('#portalChatConversationView.active').waitFor();
  check(result, 'native worker restores draft when returning to own Perfil', await page.locator('#portalChatInput').inputValue() === returning);
  result.persistedDrafts = retainedNavigation ? [returning] : [departure, returning];
  if (retainedNavigation) {
    await page.reload({ waitUntil:'domcontentloaded' }); await ready(page, '/perfil/');
    await page.locator('#portalChatConversationView.active').waitFor();
    check(result, 'explicit reload restores fresh retained-route draft through native SW', await page.locator('#portalChatInput').inputValue() === returning);
  }
  await page.locator('.social-mobile-nav a[href="/"]').click();
  await page.locator('#portalChatRoot.open').waitFor({ state:'hidden' });
  await page.waitForFunction(() => !history.state?.__portalHomeDirect);
  await settle(page);
  await page.locator('.social-mobile-nav a[href="/"]').click();
  await page.waitForFunction(() => (window.PortalCitizenShell?.active().url || location).pathname === '/' && !window.PortalCitizenShell?.diagnostics().navigating);
  await ready(page, '/');
  check(result, 'closed-chat Início follows its normal Home href', new URL(page.url()).pathname === '/' && (retainedNavigation ? audit.documents.length === documentsBefore + 1 : audit.documents.at(-1) === '/'));
  await capture(page, result, 'home');
  await navChecks(page, result, 'Home');
}

async function groupExercise(page, result, audit, route) {
  await page.locator('#profileEditBio').fill('Bio sintética antes do grupo.');
  await page.evaluate(() => scrollTo(0, 320));
  const before = await snapshot(page), loads = audit.documents.length;
  await page.locator('#portalChatLauncher').click();
  await page.locator(`[data-group-open="${group.id}"]`).click();
  await page.locator('#portalChatGroupView.active').waitFor();
  await page.locator('#portalGroupMessages [data-group-message="24"]').waitFor();
  await page.waitForFunction(() => history.state?.__portalHomeDirect?.depth === 2);
  const draft = 'Rascunho sintético do grupo, mantido sem enviar.';
  await page.locator('#portalGroupInput').fill(draft);
  await page.locator('#portalGroupInput').evaluate(input => { input.setSelectionRange(7,19); document.getElementById('portalGroupMessages').scrollTop = 140; });
  const groupState = () => page.evaluate(() => ({
    open:document.getElementById('portalChatRoot').classList.contains('open'),
    group:document.getElementById('portalChatRoot').classList.contains('group-open'),
    active:document.getElementById('portalChatGroupView').classList.contains('active'),
    name:document.getElementById('portalChatHeaderName').textContent,
    draft:document.getElementById('portalGroupInput').value,
    selection:[document.getElementById('portalGroupInput').selectionStart,document.getElementById('portalGroupInput').selectionEnd],
    scroll:document.getElementById('portalGroupMessages').scrollTop,
    count:document.querySelectorAll('#portalGroupMessages [data-group-message]').length
  }));
  const initial = await groupState();
  await capture(page, result, 'group-conversation');
  check(result, 'native group view hides mobile X and retains internal Back', await page.locator('#portalChatClose').isHidden() && await page.locator('#portalChatBack').isVisible());
  await page.locator('.social-mobile-nav a[href="/"]').click();
  await page.locator('#portalChatRoot.open').waitFor({ state:'hidden' });
  await page.waitForFunction(() => !history.state?.__portalHomeDirect);
  await settle(page);
  const closed = await snapshot(page);
  check(result, 'group Início closes without navigation/pagehide and restores page context', closed.document === before.document && closed.url === route && closed.pagehides === 0 && audit.documents.length === loads && closed.focus === before.focus && Math.abs(closed.scrollY - before.scrollY) <= 1, { before, closed });
  await page.locator('#portalChatLauncher').click();
  await page.locator('#portalChatGroupView.active').waitFor();
  let reloadTimeout;
  try { await Promise.race([audit.groupReloadReached, new Promise((_, reject) => { reloadTimeout = setTimeout(() => reject(Error('Native group reload was not requested')), 9000); })]); }
  finally { clearTimeout(reloadTimeout); }
  const pending = await groupState();
  check(result, 'reopen enters same native group while messages await response', pending.group && pending.active && pending.name === group.name && pending.count === 0 && audit.groupMessageRequests === 2, pending);
  audit.releaseGroupReload();
  await page.locator('#portalGroupMessages [data-group-message="24"]').waitFor();
  await page.waitForFunction(() => history.state?.__portalHomeDirect?.depth === 2);
  await settle(page);
  const reopened = await groupState();
  check(result, 'asynchronous group reopen retains exact draft, selection and message scroll', reopened.draft === draft && reopened.count === 24 && JSON.stringify(reopened.selection) === JSON.stringify(initial.selection) && Math.abs(reopened.scroll - initial.scroll) <= 2, { initial, reopened });
  await capture(page, result, 'group-reopened');
  await page.locator('#portalChatBack').click();
  await page.locator('#portalChatContactsView.active').waitFor();
  await page.waitForFunction(() => history.state?.__portalHomeDirect?.depth === 1);
  check(result, 'native group Back returns to contact list on the same page', await page.evaluate(route => (window.PortalCitizenShell?.active().url || location).pathname + (window.PortalCitizenShell?.active().url || location).search === route, route) && await page.locator('#portalChatRoot').evaluate(node => node.classList.contains('open') && !node.classList.contains('group-open')));
  await page.locator(`[data-group-open="${group.id}"]`).click();
  await page.locator('#portalGroupMessages [data-group-message="24"]').waitFor();
  check(result, 'group draft survives native Back and manual reselection', await page.locator('#portalGroupInput').inputValue() === draft);
  result.group = { initial, pending, reopened, scope:'Same-document native group memory; no claim of group worker persistence.' };
}

async function preservationState(page) {
  return page.evaluate(() => {
    const selectors = ['.portal-topbar','#profileCover','#profileAvatar','#profileName','#profileHandle','#profileActions','#profileModules','#profileModuleAbout','#profileModuleFriends','#profileModulePosts','#profileEditor','#profileEditorForm','#profileIdentityForm','#profilePhotoCamera','.social-global-nav','.social-mobile-nav','#portalChatLauncher','#portalChatRoot','.portal-chat-panel','#portalChatClose','#portalChatBack','#portalChatInput'];
    return Object.fromEntries(selectors.map(selector => {
      const node = document.querySelector(selector);
      if (!node) return [selector,null];
      const r = node.getBoundingClientRect(), style = getComputedStyle(node);
      return [selector, { text:node.getClientRects().length ? node.innerText.trim().replace(/\s+/g,' ') : '', parent:node.parentElement.id || node.parentElement.className,
        rect:['x','y','width','height'].map(key => Math.round(r[key] * 10) / 10), hidden:node.hidden,
        ariaHidden:node.getAttribute('aria-hidden'), tabIndex:node.getAttribute('tabindex'), label:node.getAttribute('aria-label'),
        style:Object.fromEntries(['display','position','fontSize','color','backgroundColor','padding','margin','borderRadius'].map(key => [key,style[key]])) }];
    }));
  });
}

async function openPreservedConversation(page, print) {
  if (print) { await page.emulateMedia({ media:'screen' }); await settle(page); }
  await page.locator('#portalChatLauncher').click();
  await page.locator('#portalChatRoot.open').waitFor();
  await page.locator(`[data-chat-user="${friendHandle}"]`).first().click();
  await page.locator('#portalChatConversationView.active').waitFor();
  await page.locator('#portalChatMessages .portal-chat-message').first().waitFor();
  if (print) await printReady(page);
  await settle(page);
}

async function printReady(page) {
  await page.emulateMedia({ media:'print' });
  // matchMedia listeners restore original nodes asynchronously. Then wait for
  // actual finite CSS transitions; do not remove CSS or loosen comparison.
  await page.waitForFunction(() => matchMedia('print').matches
    && !document.body.classList.contains('shared-mobile-navigation')
    && !document.body.classList.contains('profile-mobile-layout'));
  await page.evaluate(async () => {
    void document.body.offsetHeight;
    await Promise.allSettled(document.getAnimations().filter(animation =>
      Number.isFinite(animation.effect?.getComputedTiming().endTime)).map(animation => animation.finished));
  });
  await settle(page);
}

async function mascotesReady(page, candidate) {
  await page.locator('#petGallery .pet-choice').first().waitFor({ state:'attached' });
  await page.waitForFunction(() => document.getElementById('petMessage')?.textContent === 'Seu gato está com você.');
  await page.locator('.social-mobile-nav').waitFor({ state:'attached' });
  if (candidate) {
    await page.waitForFunction(() => Boolean(window.PortalCitizenMobileReady));
    await page.evaluate(() => window.PortalCitizenMobileReady);
  }
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
}

function nativeChatRequests(audit) {
  return {
    api:audit.apiCalls.filter(call => / \/api\/chat(?:\/|\?)/.test(call)),
    assets:audit.resources.filter(url => /^\/js\/portal-(?:global-chat|chat(?:-groups|-switch-optimizer)?)\.js(?:\?|$)/.test(url)
      || /^\/css\/portal-chat(?:[-.]|\/)/.test(url)),
    sockets:audit.webSocketsBlocked
  };
}

async function mascotesPreservationState(page) {
  return page.evaluate(() => {
    const selectors = ['.portal-topbar','.pet-page','#petMessage','#petGallery','#petHome','#petLives','#petNeeds','#petShop','#petSettings','.social-global-nav','.social-mobile-nav','#portalChatRoot','#portalChatLauncher'];
    return Object.fromEntries(selectors.map(selector => {
      const node = document.querySelector(selector);
      if (!node) return [selector,null];
      const rect = node.getBoundingClientRect(), style = getComputedStyle(node);
      return [selector, { text:node.getClientRects().length ? node.innerText.trim().replace(/\s+/g,' ') : '',
        rect:['x','y','width','height'].map(key => Math.round(rect[key] * 10) / 10), hidden:node.hidden,
        style:Object.fromEntries(['display','position','fontSize','color','backgroundColor','padding','margin','borderRadius'].map(key => [key,style[key]])) }];
    }));
  });
}

async function mascotesFreshComparison(page, result, audit, scenario, browser, baselineOrigin) {
  const original = await newPage(browser, scenario, baselineOrigin, result);
  try {
    const bootstrap = await page.evaluate(async () => ({
      mounted:Boolean(window[Symbol.for('portal.citizenMobileChatBootstrap')]),
      readyPromise:typeof window.PortalCitizenMobileChatReady?.then === 'function',
      started:await window.PortalCitizenMobileChatReady
    }));
    check(result, 'mobile-only bootstrap executes but declines fresh desktop/print Chat', bootstrap.mounted && bootstrap.readyPromise && bootstrap.started === false, bootstrap);
    // Print is selected before navigation in both contexts: this tests fresh
    // print entry, never a mobile-first page whose Chat already initialized.
    if (scenario.print) await original.page.emulateMedia({ media:'print' });
    await original.page.goto(baselineOrigin + '/mascotes/', { waitUntil:'load' });
    await mascotesReady(original.page, false);
    if (scenario.print) { await printReady(page); await printReady(original.page); }
    const candidate = await mascotesPreservationState(page), base = await mascotesPreservationState(original.page);
    check(result, 'fresh desktop/print Mascotes matches ac89d0fb presentation', JSON.stringify(candidate) === JSON.stringify(base), Object.keys(candidate).filter(key => JSON.stringify(candidate[key]) !== JSON.stringify(base[key])));
    check(result, 'fresh Mascotes has no native Chat root or visible launcher in either source', await page.locator('#portalChatRoot').count() === 0
      && await original.page.locator('#portalChatRoot').count() === 0
      && await page.locator('#portalChatLauncher:visible').count() === 0
      && await original.page.locator('#portalChatLauncher:visible').count() === 0);
    await capture(original.page, result, 'baseline');
    await capture(page, result, 'candidate');
    // Observe requests through completed rendering/captures, rather than taking
    // an early empty request list before the bootstrap has run.
    const candidateRequests = nativeChatRequests(audit), baseRequests = nativeChatRequests(original.audit);
    check(result, 'fresh desktop/print Mascotes requests no native Chat assets, APIs or sockets',
      [candidateRequests,baseRequests].every(requests => !requests.api.length && !requests.assets.length && requests.sockets === 0), { candidate:candidateRequests, baseline:baseRequests });
    check(result, 'baseline Mascotes APIs are explicitly synthetic', original.audit.unmappedApiCalls.length === 0, original.audit.unmappedApiCalls);
    result.mascotesComparison = { baselineRoot, bootstrap, candidate, baseline:base, candidateRequests, baseRequests,
      freshPrint:scenario.print || false, baselineApiCalls:original.audit.apiCalls };
  } finally { await original.context.close(); }
}

async function mascotesBreakpoints(page, result, audit) {
  await navChecks(page, result, 'Mascotes mobile before transition');
  await page.locator('#petStart').focus();
  await page.evaluate(() => scrollTo(0, 300));
  const before = await snapshot(page), documentLoads = audit.documents.length;
  await page.locator('#portalChatLauncher').click();
  await page.locator(`[data-chat-user="${friendHandle}"]`).first().click();
  await page.locator('#portalChatConversationView.active').waitFor();
  await page.locator('#portalChatMessages [data-message-id="24"]').waitFor();
  await page.waitForFunction(() => history.state?.__portalHomeDirect?.depth === 2);
  const draft = 'Rascunho sintético Mascotes: preservar ao mudar desktop e impressão.';
  await page.locator('#portalChatInput').fill(draft);
  await page.locator('#portalChatInput').evaluate(node => { node.setSelectionRange(5,17); document.getElementById('portalChatMessages').scrollTop = 140; });
  const conversation = await capture(page, result, 'mobile-conversation');
  check(result, 'initial native conversation has a nonzero scroll position to preserve', Math.abs(conversation.chat.messageScroll - 140) <= 2
    && await page.locator('#portalChatMessages').evaluate(node => node.scrollHeight > node.clientHeight), conversation.chat.messageScroll);
  await page.evaluate(() => {
    window.__mascotesTransitionNodes = Object.fromEntries(['portalChatRoot','portalChatLauncher','portalChatInput','portalChatUnread'].map(id => [id,document.getElementById(id)]));
  });
  const intactNodes = () => page.evaluate(() => Object.entries(window.__mascotesTransitionNodes).every(([id,node]) => document.getElementById(id) === node)
    && document.querySelectorAll('#portalChatRoot').length === 1 && document.querySelectorAll('#portalChatLauncher').length === 1);
  await page.setViewportSize({ width:1440, height });
  await page.waitForFunction(() => !document.body.classList.contains('shared-mobile-navigation')
    && !document.getElementById('portalChatRoot')?.classList.contains('open') && !history.state?.__portalHomeDirect);
  await settle(page);
  const desktop = await capture(page, result, 'desktop-after-mobile');
  check(result, 'leaving mobile closes native conversation and hides Chat controls', !desktop.chat.open && !desktop.chat.conversation
    && await page.locator('#portalChatRoot').isHidden() && await page.locator('#portalChatLauncher').isHidden());
  check(result, 'desktop transition retains native nodes and page context', await intactNodes() && desktop.document === before.document
    && desktop.pagehides === 0 && desktop.focus === before.focus && Math.abs(desktop.scrollY - before.scrollY) <= 1,
  { before:{ focus:before.focus, scrollY:before.scrollY }, desktop:{ focus:desktop.focus, scrollY:desktop.scrollY } });
  await printReady(page);
  const printed = await capture(page, result, 'print-after-mobile');
  check(result, 'print keeps native Chat closed, hidden and attached', await intactNodes() && !printed.chat.open && !printed.chat.conversation
    && await page.locator('#portalChatRoot').isHidden() && await page.locator('#portalChatLauncher').isHidden());
  check(result, 'retained hidden Chat does not create desktop or print page overflow', desktop.overflow <= 1 && printed.overflow <= 1,
    { desktop:desktop.overflow, print:printed.overflow });
  await page.setViewportSize({ width:390, height });
  await page.emulateMedia({ media:'screen' });
  await page.waitForFunction(() => document.body.classList.contains('shared-mobile-navigation'));
  await settle(page);
  check(result, 'returning to mobile leaves Chat closed until requested', await intactNodes() && await page.locator('#portalChatRoot').evaluate(node => !node.classList.contains('open')));
  await navChecks(page, result, 'Mascotes mobile after transition');
  await page.locator('#portalChatLauncher').click();
  await page.locator('#portalChatConversationView.active').waitFor();
  await page.waitForFunction(() => history.state?.__portalHomeDirect?.depth === 2);
  await settle(page);
  const returned = await capture(page, result, 'mobile-reopened');
  check(result, 'reopen restores original conversation, fresh draft, scroll and selection', await intactNodes()
    && returned.chat.selected === friendHandle && returned.chat.draft === draft
    && JSON.stringify(returned.chat.selection) === JSON.stringify(conversation.chat.selection)
    && Math.abs(returned.chat.messageScroll - conversation.chat.messageScroll) <= 2,
  { before:conversation.chat, returned:returned.chat });
  check(result, 'breakpoint cycle never reloads or leaves Mascotes', returned.document === before.document
    && returned.url === '/mascotes/' && returned.pagehides === 0 && audit.documents.length === documentLoads);
  result.mascotesBreakpoints = { before, conversation, desktop, printed, returned,
    scope:'Native close occurs outside mobile. No claim that an initialized native Chat stops all background contact polling.' };
}

async function sourceHashes() {
  const files = ['js/citizen-layout.js','js/citizen-mobile-navigation.js','css/citizen-mobile-navigation.css',
    'js/profile-mobile-presentation.js','css/profile-mobile-presentation.css','js/home-mobile-direct.js',
    'css/home-mobile-direct.css','js/home-mobile-composition.js','css/home-tools-carousel.css',
    'js/home.js','perfil/index.html','mascotes/index.html','js/citizen-mobile-chat-bootstrap.js'];
  return Object.fromEntries(await Promise.all(files.map(async file => [file, await fs.readFile(path.join(root,file)).then(source => createHash('sha256').update(source).digest('hex')).catch(() => null)])));
}

if (!process.env.PORTAL_FIXTURES_ONLY) {
const scenarios = [
  { id:'own-320-light-100', profile:'own', width:320, theme:'light', scale:1 },
  { id:'own-390-dark-100', profile:'own', width:390, theme:'dark', scale:1 },
  { id:'own-320-light-200', profile:'own', width:320, theme:'light', scale:2 },
  { id:'own-390-dark-200', profile:'own', width:390, theme:'dark', scale:2 },
  { id:'other-320-dark-200', profile:'other', width:320, theme:'dark', scale:2 },
  { id:'other-390-light-200', profile:'other', width:390, theme:'light', scale:2 },
];
const selected = process.env.CASES?.split(',');
if (selected?.includes('shared-mascotes')) scenarios.push({ id:'shared-mascotes', route:'/mascotes/', width:390, theme:'dark', scale:2, quick:true });
if (selected?.includes('group-own-390-dark-100')) scenarios.push({ id:'group-own-390-dark-100', profile:'own', width:390, theme:'dark', scale:1, group:true });
if (selected?.includes('mascotes-breakpoints')) scenarios.push({ id:'mascotes-breakpoints', route:'/mascotes/', width:390, theme:'dark', scale:1, mascotesBreakpoints:true });
const runCases = mode === 'preservation' ? [
  { id:'desktop-own-light', profile:'own', width:1440, theme:'light' },
  { id:'desktop-other-dark', profile:'other', width:1440, theme:'dark' },
  { id:'print-own-light', profile:'own', width:390, theme:'light', print:true },
  { id:'print-other-dark', profile:'other', width:390, theme:'dark', print:true },
  { id:'desktop-mascotes-light', route:'/mascotes/', width:1440, theme:'light', mascotesFresh:true },
  { id:'print-mascotes-light', route:'/mascotes/', width:390, theme:'light', print:true, mascotesFresh:true },
] : scenarios;
await fs.mkdir(output, { recursive:true });
const current = await serve(root), baseline = baselineRoot ? await serve(baselineRoot) : null;
const browser = await chromium.launch({ executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless:true,
  args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] });
const results = [];
try {
  for (const scenario of runCases.filter(item => !selected || selected.includes(item.id))) {
    const result = { ...scenario, sourceHashes:await sourceHashes(), checks:[], errors:[], scenes:[] };
    const route = scenario.route || (scenario.profile === 'other' ? `/perfil/?u=${friendHandle}` : '/perfil/');
    const { page, context, audit } = await newPage(browser, scenario, current.origin, result);
    try {
      if (scenario.mascotesFresh && scenario.print) await page.emulateMedia({ media:'print' });
      await page.goto(current.origin + route, { waitUntil:scenario.mascotesFresh ? 'load' : 'domcontentloaded' });
      if (scenario.mascotesFresh) await mascotesReady(page, true);
      else await ready(page, route, mode !== 'baseline');
      if (scenario.mascotesFresh) {
        await mascotesFreshComparison(page, result, audit, scenario, browser, baseline.origin);
      } else if (scenario.mascotesBreakpoints) {
        await mascotesBreakpoints(page, result, audit);
      } else if (scenario.group) {
        await navChecks(page, result, 'Perfil before group');
        await groupExercise(page, result, audit, route);
      } else if (scenario.quick) {
        await capture(page, result, 'route');
        await navChecks(page, result, route);
        const before = await snapshot(page), documentLoads = audit.documents.length;
        await page.locator('#portalChatLauncher').click();
        await page.locator('#portalChatRoot.open').waitFor();
        const open = await capture(page, result, 'chat');
        check(result, 'shared-route Chat hides mobile X', open.chat.close === null);
        await page.locator('.social-mobile-nav a[href="/"]').click();
        await page.locator('#portalChatRoot.open').waitFor({ state:'hidden' });
        await page.waitForFunction(() => !history.state?.__portalHomeDirect);
        const after = await snapshot(page);
        check(result, 'shared-route Início closes without reload or leaving route', after.document === before.document && after.url === route && audit.documents.length === documentLoads && after.pagehides === 0);
      } else if (mode === 'preservation') {
        if (scenario.print) await printReady(page);
        const candidate = await preservationState(page);
        const base = await newPage(browser, scenario, baseline.origin, result);
        try {
          await base.page.goto(baseline.origin + route, { waitUntil:'domcontentloaded' });
          await ready(base.page, route, false);
          if (scenario.print) await printReady(base.page);
          const original = await preservationState(base.page);
          result.comparison = { baselineRoot, original, candidate };
          check(result, 'desktop/print profile matches ac89d0fb baseline', JSON.stringify(candidate) === JSON.stringify(original), Object.keys(candidate).filter(key => JSON.stringify(candidate[key]) !== JSON.stringify(original[key])));
          await capture(base.page, result, 'baseline');
          await capture(page, result, 'candidate');
          await openPreservedConversation(page, scenario.print);
          await openPreservedConversation(base.page, scenario.print);
          const chatCandidate = await preservationState(page), chatOriginal = await preservationState(base.page);
          result.chatComparison = { original:chatOriginal, candidate:chatCandidate };
          check(result, 'desktop/print open native Chat controls match baseline', JSON.stringify(chatCandidate) === JSON.stringify(chatOriginal), Object.keys(chatCandidate).filter(key => JSON.stringify(chatCandidate[key]) !== JSON.stringify(chatOriginal[key])));
          await capture(base.page, result, 'chat-baseline');
          await capture(page, result, 'chat-candidate');
        } finally { await base.context.close(); }
      } else {
        const profile = await capture(page, result, 'profile');
        if (mode !== 'baseline') {
          await navChecks(page, result, 'Perfil');
          check(result, 'profile uses original permitted identity', profile.profile.name === (scenario.profile === 'own' ? ownName : friendName));
          check(result, 'profile camera remains exclusive to own profile', Boolean(profile.profile.camera) === (scenario.profile === 'own'));
          check(result, 'Perfil has no visible Tools access', await page.locator('a[href="/ferramentas/"]:visible').count() === 0);
          check(result, 'other profile does not expose own editor or identity fields', scenario.profile === 'own' || await page.locator('#profileEditor').isHidden() && await page.locator('#profileIdentityEditor').isHidden());
          await profileActions(page, result, scenario.profile === 'own');
          if (process.env.INTERACTIONS !== '0') await chatExercise(page, result, audit, current.origin, route);
          if (scenario.id === 'own-320-light-100' && process.env.INTERACTIONS !== '0') {
            for (const section of ['/cidadao/','/ferramentas/']) {
              await page.goto(current.origin + section, { waitUntil:'domcontentloaded' });
              await ready(page, section);
              await capture(page, result, section.slice(1,-1));
              await navChecks(page, result, section);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(error.stack || String(error));
      await page.screenshot({ path:path.join(output, `${result.id}-failure.png`), fullPage:false }).catch(() => {});
    } finally {
      audit.releaseGroupReload?.();
      if (mode === 'mobile') check(result, 'native session worker was installed', Boolean(audit.worker));
      if (audit.worker) {
        result.session = await audit.worker.evaluate(() => self.__sceneSessionEvidence()).catch(error => ({ error:String(error) }));
        check(result, 'native session transport has no handler errors', !result.session.error && !result.session.events.some(event => event.error));
        if (result.persistedDrafts) check(result, 'native pagehide PUT commits fresh drafts on document departures', result.persistedDrafts.every(body => result.session.events.some(event => event.committed && event.afterPagehideSequence && event.snapshot?.drafts.some(item => item.body === body))));
        if (result.persistedDrafts) check(result, 'native GET restores saved snapshots across both sections', result.session.getHits >= (result.retainedNavigation ? 1 : 2) && result.session.committedPuts >= (result.retainedNavigation ? 1 : 2), { hits:result.session.getHits, committed:result.session.committedPuts });
      }
      check(result, 'no page or harness errors', result.errors.length === 0);
      check(result, 'all exercised API routes have explicit synthetic fixtures', audit.unmappedApiCalls.length === 0, audit.unmappedApiCalls);
      result.network = { apiCalls:audit.apiCalls, documents:audit.documents, blockedResources:audit.blockedResources,
        resources:audit.resources,
        unmappedApiCalls:audit.unmappedApiCalls, webSocketsBlocked:audit.webSocketsBlocked,
        ...(audit.groupFixture ? { groupMessageRequests:audit.groupMessageRequests } : {}) };
      result.failedChecks = result.checks.filter(item => !item.passed).map(item => item.name);
      results.push(result);
      await fs.writeFile(path.join(output, 'summary.json'), JSON.stringify({ synthetic:true, mode,
        sessionSourceSha256:workerSourceSha256, notes:[
          'Only allowlisted local citizen documents and assets are served; all APIs and WebSockets are synthetic/intercepted. DNS blocks external preconnects.',
          'The unchanged portal-sw.js session message handler uses native MessageChannel/postMessage/waitUntil; cache, fetch and push handlers are suppressed.',
          'Allowed-other profile fixture is returned by a synthetic API, not an authorization proof. No real names, account photos or user reference images are used.',
          'Text 200 is synthetic font scaling, not device OS zoom. Worker restart/production cache behavior remain outside scope.'
        ], results }, null, 2) + '\n');
      console.log(JSON.stringify({ id:result.id, checks:result.checks.length, failed:result.failedChecks, errors:result.errors }));
      await context.close();
    }
  }
} finally {
  await browser.close();
  await Promise.all([current,baseline].filter(Boolean).map(item => new Promise(resolve => item.server.close(resolve))));
}
if (!results.length || results.some(result => result.failedChecks.length)) process.exitCode = 1;
console.log(`Refinement evidence: ${path.join(output, 'summary.json')}`);

}
export { serve, newPage, ready, settle, user, posts, ownHandle, friendHandle, chromium };
