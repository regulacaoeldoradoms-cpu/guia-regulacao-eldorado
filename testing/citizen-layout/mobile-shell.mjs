import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY = '1';
const { serve, newPage, ready, settle, posts, chromium } = await import('./mobile-profile-refinement.mjs');
const root = path.resolve(import.meta.dirname, '../..');
const output = path.join(root, '.local/mobile-shell-tests');
await fs.mkdir(output, { recursive:true });
const server = await serve(root);
const browser = await chromium.launch({ executablePath:process.env.CHROMIUM_PATH || await fs.access('/usr/bin/chromium').then(()=>'/usr/bin/chromium',()=>chromium.executablePath()), headless:true,
  args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] });
const results = [];
async function run(id, width, start, exercise) {
  if (process.env.SHELL_CASES && !process.env.SHELL_CASES.split(',').includes(id)) return;
  const result = { id, checks:[], errors:[] };
  const { page, context, audit } = await newPage(browser, { width, theme:'dark', seedOnce:true }, server.origin, result);
  const check = (label, condition) => { assert.ok(condition, label); result.checks.push(label); };
  try {
    await page.goto(server.origin + start, { waitUntil:'domcontentloaded' });
    await ready(page, start);
    let deadline;
    try { await Promise.race([exercise(page, audit, check), new Promise((_, reject) => { deadline = setTimeout(() => reject(Error('Scenario deadline 45s')), 45000); })]); }
    finally { clearTimeout(deadline); }
    check('no page errors', result.errors.length === 0);
    check('only mapped synthetic APIs', audit.unmappedApiCalls.length === 0);
    await page.screenshot({ path:path.join(output, id + '.png') });
  } catch (error) {
    result.failure = error.stack || String(error);
    result.state = await page.evaluate(() => ({ url:location.href, shell:window.PortalCitizenShell?.diagnostics(), notice:document.querySelector('.citizen-route-notice')?.textContent, body:document.body.className, text:document.body.innerText.slice(0,1200) })).catch(() => null);
    await page.screenshot({ path:path.join(output, id + '-failure.png') }).catch(() => {});
  } finally {
    result.documents = audit.documents;
    result.unmapped = audit.unmappedApiCalls;
    result.apiCalls = audit.apiCalls;
    await context.close(); results.push(result);
    await fs.writeFile(path.join(output, id + '.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ id, checks:result.checks.length, failure:result.failure, errors:result.errors, state:result.state }));
  }
}
const go = async (page, route) => {
  console.log('route ' + route);
  await page.evaluate(route => window.PortalCitizenShell.navigate(new URL(route, location.href)), route);
  await page.waitForFunction(route => !window.PortalCitizenShell.diagnostics().navigating && (window.PortalCitizenShell?.active().url || location).pathname + (window.PortalCitizenShell?.active().url || location).search === route, route);
  await settle(page);
};
try {
  for (const width of [320,390]) await run('journey-' + width, width, '/', async (page, audit, check) => {
    await page.waitForFunction(() => Boolean(window.PortalPets));
    await page.evaluate(() => {
      window.__shellNodes = { nav:document.querySelector('.social-mobile-nav'), chat:document.getElementById('portalChatRoot'), launcher:document.getElementById('portalChatLauncher'), pet:window.PortalPets.runtime, root:window.PortalPets.runtime.root, tabId:window.PortalPets.runtime.tabId, document:window.__refinementDocument };
      document.getElementById('socialComposerText').value = 'Rascunho sintético preservado';
      window.scrollTo(0, 240); window.__homeY = scrollY;
      document.addEventListener('click', () => { window.__leave = {y:scrollY,body:document.body.className,nav:getComputedStyle(document.querySelector('.social-mobile-nav')).position}; }, {capture:true,once:true});
    });
    await page.locator('.social-mobile-nav a[href="/amigos/"]').click();
    await page.waitForFunction(() => !window.PortalCitizenShell.diagnostics().navigating && (window.PortalCitizenShell?.active().url || location).pathname === '/amigos/');
    check('friends native controller loaded', await page.locator('#socialSearchForm').count() === 1);
    await page.locator('#socialSearchInput').fill('Busca sem enviar');
    await go(page, '/mascotes/');
    await page.locator('#petDays input').first().waitFor();
    await page.locator('#petTimezone').selectOption('America/Sao_Paulo');
    await page.evaluate(() => document.getElementById('petPreferences').dataset.editing = 'true');
    check('pet occupies active habitat', await page.evaluate(() => window.PortalPets.runtime.root.parentNode === document.getElementById('petHabitat')));
    await go(page, '/');
    check('home feed draft retained', await page.locator('#socialComposerText').inputValue() === 'Rascunho sintético preservado');
    const scroll = await page.evaluate(() => ({actual:scrollY,saved:window.__homeY,retained:window.PortalCitizenShell.active().scroll,leave:window.__leave}));
    check('home scroll restored '+JSON.stringify(scroll), Math.abs(scroll.actual-scroll.saved) < 3);
    check('shared document/bar/chat/pet identity', await page.evaluate(() => {
      const old = window.__shellNodes;
      return old.document === window.__refinementDocument && old.nav === document.querySelector('.social-mobile-nav') && old.chat === document.getElementById('portalChatRoot') && old.launcher === document.getElementById('portalChatLauncher') && old.pet === window.PortalPets.runtime && old.root === window.PortalPets.runtime.root && old.tabId === window.PortalPets.runtime.tabId;
    }));
    check('same document network count', audit.documents.length === 1);
    await go(page, '/amigos/');
    check('friend search draft retained', await page.locator('#socialSearchInput').inputValue() === 'Busca sem enviar');
    await page.goBack();
    await page.waitForFunction(() => (window.PortalCitizenShell?.active().url || location).pathname === '/' && !window.PortalCitizenShell.diagnostics().navigating);
    await page.goForward();
    await page.waitForFunction(() => (window.PortalCitizenShell?.active().url || location).pathname === '/amigos/' && !window.PortalCitizenShell.diagnostics().navigating);
    check('Back/Forward kept document', audit.documents.length === 1);
    await go(page, '/mascotes/');
    check('pet preference draft retained', await page.locator('#petTimezone').inputValue() === 'America/Sao_Paulo');
    await page.locator('#portalChatLauncher').click();
    await page.locator('#portalChatRoot.open').waitFor();
    await page.locator('.social-mobile-nav a[href="/"]').click();
    await page.waitForFunction(() => !document.getElementById('portalChatRoot').classList.contains('open') && !history.state?.__portalHomeDirect);
    check('Início closes Chat within Mascotes', await page.evaluate(() => window.PortalCitizenShell.active().url.pathname === '/mascotes/' && location.pathname === '/') && audit.documents.length === 1);
    await page.locator('#portalChatLauncher').click();
    await page.locator('#portalChatRoot.open').waitFor();
    await go(page, '/amigos/');
    check('route waits for Chat history unwind', await page.evaluate(() => (window.PortalCitizenShell?.active().url || location).pathname === '/amigos/' && !history.state?.__portalHomeDirect && !document.getElementById('portalChatRoot').classList.contains('open')));
    await go(page, '/');
    const newest = { ...posts[0], id:'fixture-new-post', body:'Nova publicação sintética', createdAt:'2026-10-10T16:00:00Z' };
    await contextRouteFeed(page, [newest, ...posts]);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.locator('.social-new-posts:not([hidden])').waitFor();
    check('new post waits for tap', await page.locator('[data-post-id="fixture-new-post"]').count() === 0);
    await page.locator('.social-new-posts').click();
    check('new post applied once', await page.locator('[data-post-id="fixture-new-post"]').count() === 1);
    check('feed draft survives applying notice', await page.locator('#socialComposerText').inputValue() === 'Rascunho sintético preservado');
    check('unique connected IDs', await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(node => node.id); return new Set(ids).size === ids.length; }));
    const disposed = await page.evaluate(() => {
      window.RegulationAuth.clearSession();
      return window.PortalCitizenShell.diagnostics().ended && document.querySelectorAll('.citizen-route-area').length === 0;
    });
    check('session end discards retained areas', disposed);
  });
  await run('shared-routes', 390, '/', async (page, audit, check) => {
    for (const route of ['/perfil/', '/configuracoes/', '/conquistas/', '/notificacoes/', '/seguranca/', '/ferramentas/', '/cidadao/', '/']) {
      await go(page, route);
      check(route + ' active area', await page.evaluate(() => document.querySelectorAll('.citizen-route-area').length === 1));
    }
    check('all shared routes stayed in document', audit.documents.length === 1);
  });
  await run('mascotes-deep-link', 390, '/mascotes/', async (page, audit, check) => {
    await go(page, '/'); await go(page, '/amigos/'); await go(page, '/mascotes/');
    check('Mascotes direct entry supports return journey after one initial Home handoff', audit.documents.length === 2);
  });
  await run('desktop-native', 1440, '/', async (page, audit, check) => {
    check('desktop shell inactive', await page.evaluate(() => !window.PortalCitizenShell));
    await page.locator('.social-global-nav a[href="/amigos/"]').click();
    await page.waitForURL('**/amigos/');
    check('desktop retains document navigation', audit.documents.length === 2);
  });
  await run('retry-and-rapid-navigation', 390, '/', async (page, audit, check) => {
    let fail = true;
    await page.route('**/amigos/', route => {
      if (fail) { fail = false; return route.fulfill({ status:503, body:'Synthetic unavailable' }); }
      return route.fallback();
    });
    await page.locator('.social-mobile-nav a[href="/amigos/"]').click();
    await page.locator('.citizen-route-notice button').waitFor();
    check('failed route keeps Home and URL', await page.evaluate(() => (window.PortalCitizenShell?.active().url || location).pathname === '/' && Boolean(document.getElementById('socialFeedList'))));
    await page.locator('.citizen-route-notice button').click();
    await page.waitForFunction(() => (window.PortalCitizenShell?.active().url || location).pathname === '/amigos/' && !window.PortalCitizenShell.diagnostics().navigating);
    check('explicit retry works without document navigation', audit.documents.length === 1);
    await page.evaluate(() => {
      void window.PortalCitizenShell.navigate(new URL('/mascotes/', location.href));
      void window.PortalCitizenShell.navigate(new URL('/perfil/', location.href));
      void window.PortalCitizenShell.navigate(new URL('/', location.href));
    });
    await page.waitForFunction(() => (window.PortalCitizenShell?.active().url || location).pathname === '/' && !window.PortalCitizenShell.diagnostics().navigating);
    check('latest rapid intent wins', await page.locator('#socialFeedList').count() === 1);
    // The superseded preparation loads factories but intentionally never mounts
    // its route presenters. Count repeat loads only after the first real visit.
    await go(page, '/mascotes/');
    await page.evaluate(() => window.PortalCitizenMobileChatReady);
    await page.locator('#petDays input').first().waitFor();
    await go(page, '/');
    // Optional global PWA/observability owners can start later independently.
    // Measure the explicit route/runtime assets after their first real mount.
    const routeAsset = /\/js\/(?:social-friends|pets-page|pets-runtime|pets-bootstrap|citizen-mobile-chat-bootstrap|account-section-shell|home|social-home|social-feed|citizen-layout|home-mobile-direct|home-mobile-composition|home-social-presentation)\.js/;
    const before = audit.resources.filter(resource => routeAsset.test(resource)).length;
    for (const route of ['/amigos/', '/mascotes/', '/', '/amigos/', '/mascotes/', '/']) await go(page, route);
    const later = audit.resources.filter(resource => routeAsset.test(resource));
    check('returning areas loads no new route/runtime scripts: ' + JSON.stringify(later.slice(before)), later.length === before);
    check('bar remains six native controls', await page.locator('.social-mobile-nav > .social-mobile-nav-link').count() === 6);
  });
  await run('notifications-and-offline', 390, '/', async (page, audit, check) => {
    let unread = 0, notifications = [], configRequests = 0;
    await page.route('**/api/social/config', route => {
      configRequests++;
      return route.fulfill({ contentType:'application/json', body:JSON.stringify({ backendEnabled:true, available:true, homeEnabled:true, unreadSocialNotifications:unread }) });
    });
    await page.route('**/api/social/notifications*', route => route.fulfill({ contentType:'application/json', body:JSON.stringify({ notifications, nextCursor:'' }) }));
    await go(page, '/notificacoes/');
    // The updater has its own offline contract. Finish route startup reads
    // before measuring it; an already preparing area may still settle its data.
    await page.waitForFunction(() => {
      const state = window.PortalCitizenShell.diagnostics();
      return !state.prewarming && ['/amigos/', '/perfil/', '/mascotes/', '/notificacoes/'].every(path => state.ready.includes(path));
    });
    await page.waitForLoadState('networkidle');
    notifications = [{ id:900, type:'relationship_requested', text:'há uma atualização sintética', createdAt:'2026-10-10T16:00:00Z', read:false }]; unread = 1;
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.locator('#socialNotificationList [data-notification-id="900"]').waitFor();
    check('open portal refreshes notice and badge', await page.locator('#socialNotificationTriggerMobile .social-nav-badge').textContent() === '1');
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForFunction(() => !window.PortalCitizenShell.diagnostics().updateRunning);
    check('notification deduplicated', await page.locator('#socialNotificationList [data-notification-id="900"]').count() === 1);
    await page.context().setOffline(true);
    await page.waitForFunction(() => !navigator.onLine && !window.PortalCitizenShell.diagnostics().updateRunning);
    const count = configRequests;
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    check('offline updater paused', configRequests === count && await page.evaluate(() => !window.PortalCitizenShell.diagnostics().updateScheduled));
    unread = 2;
    await page.context().setOffline(false);
    await page.waitForFunction(() => document.querySelector('#socialNotificationTriggerMobile .social-nav-badge')?.textContent === '2');
    check('online reconnection updates badge', configRequests > count);
  });
  await run('other-profile-deep-link', 390, '/perfil/?u=fixture.friend', async (page, audit, check) => {
    await go(page, '/amigos/'); await go(page, '/perfil/?u=fixture.friend');
    check('profile query URL preserved', await page.evaluate(() => window.PortalCitizenShell.active().url.search === '?u=fixture.friend' && location.pathname === '/'));
    check('other profile remains without own identity editor', await page.locator('#profileIdentityEditor').isHidden());
    await page.reload({ waitUntil:'domcontentloaded' }); await ready(page, '/perfil/?u=fixture.friend');
    check('direct reload remains functional', await page.locator('#socialProfile:not([hidden])').count() === 1);
  });
  await run('late-auth-response', 1440, '/', async (page, audit, check) => {
    let release, reached;
    const received = new Promise(resolve => { reached = resolve; });
    await page.route('**/api/auth/me', async route => {
      reached(); await new Promise(resolve => { release = resolve; });
      await route.fulfill({ contentType:'application/json', body:JSON.stringify({ user:{ username:'obsolete.synthetic', role:'cidadao', emailVerified:true } }) });
    });
    await page.evaluate(() => { window.__lateMe = window.RegulationAuth.me({ allowCached:false }); });
    await received;
    await page.evaluate(() => {
      sessionStorage.setItem('regulacao.portal.session', 'replacement-synthetic-token');
      sessionStorage.setItem('regulacao.portal.user', JSON.stringify({ username:'replacement.synthetic', role:'cidadao' }));
    });
    release();
    const state = await page.evaluate(async () => ({ result:await window.__lateMe, token:window.RegulationAuth.getToken(), user:window.RegulationAuth.getCachedUser().username }));
    check('late /me cannot restore obsolete account', state.result === null && state.token === 'replacement-synthetic-token' && state.user === 'replacement.synthetic');
  });
  await run('account-replacement', 390, '/', async (page, audit, check) => {
    await go(page, '/amigos/');
    const documentId = await page.evaluate(() => window.__refinementDocument);
    await page.route('**/api/auth/me', route => route.fulfill({contentType:'application/json',body:JSON.stringify({user:{username:'replacement.synthetic',role:'cidadao',emailVerified:true}})}));
    await page.evaluate(() => {
      sessionStorage.setItem('regulacao.portal.session', 'replacement-synthetic-token');
      sessionStorage.setItem('regulacao.portal.user', JSON.stringify({ username:'replacement.synthetic', role:'cidadao' }));
      window.dispatchEvent(new CustomEvent('portal:session-ready', { detail:{user:{username:'replacement.synthetic',role:'cidadao'}} }));
    });
    await page.waitForFunction(old => window.__refinementDocument !== old && Boolean(window.PortalCitizenShell) && !window.PortalCitizenShell.diagnostics().ended, documentId);
    await ready(page, '/');
    check('replacement account discards previous document once', audit.documents.length === 2 && await page.evaluate(old => window.__refinementDocument !== old, documentId));
    check('replacement starts with only its new Home area', await page.evaluate(() => window.PortalCitizenShell.diagnostics().routes === 1 && window.RegulationAuth.getCachedUser().username === 'replacement.synthetic'));
  });
  await run('breakpoint-back', 390, '/', async (page, audit, check) => {
    await go(page, '/amigos/');
    await page.setViewportSize({width:1440,height:900});
    await page.goBack();
    await page.waitForFunction(() => (window.PortalCitizenShell?.active().url || location).pathname === '/' && !window.PortalCitizenShell.diagnostics().navigating);
    check('Back after desktop resize activates Home', await page.locator('#socialFeedList').count() === 1);
    check('desktop breakpoint removes mobile shell marker', await page.evaluate(() => !document.body.classList.contains('citizen-mobile-shell')));
    await page.setViewportSize({width:390,height:844});
    await go(page, '/mascotes/'); await go(page, '/');
    check('mobile reentry stays in original document', audit.documents.length === 1);
  });
  await run('logout', 390, '/', async (page, audit, check) => {
    await go(page, '/amigos/'); await go(page, '/mascotes/'); await go(page, '/perfil/');
    await page.evaluate(() => document.getElementById('portalLogout').click());
    await page.waitForURL('**/login/');
    await page.locator('#loginForm').waitFor();
    check('logout returns to native login without retained session', await page.evaluate(() => !window.RegulationAuth.getToken()));
    check('logout has one native request', audit.apiCalls.filter(call => call === 'POST /api/auth/logout').length === 1);
    check('login document contains no retained route/pet/chat data', await page.evaluate(() => !window.PortalCitizenShell && !window.PortalPets && !document.getElementById('portalChatRoot')));
  });
  await run('login-home-handoff', 390, '/', async (page, audit, check) => {
    const seed = await page.evaluate(() => ({token:window.RegulationAuth.getToken(),user:window.RegulationAuth.getCachedUser()}));
    // End through the native session boundary before mounting Login. Removing
    // storage directly races the real background auth gate's login redirect.
    await page.evaluate(() => window.RegulationAuth.clearSession());
    await page.waitForURL('**/login/**', { waitUntil:'domcontentloaded' });
    await page.locator('#loginForm').waitFor();
    const result = await page.evaluate(async seed => {
      sessionStorage.setItem('regulacao.portal.session',seed.token); sessionStorage.setItem('regulacao.portal.user',JSON.stringify(seed.user));
      const before=window.__refinementDocument, cover=document.createElement('div'); document.body.append(cover);
      const transition=window.PortalHomeTransition.prepare('/');
      const mounted=await transition.mount(cover); transition.reveal(); cover.remove();
      return {mounted,sameDocument:before===window.__refinementDocument};
    },seed);
    check('allowlisted login handoff mounts citizen Home', result.mounted && result.sameDocument);
    await ready(page,'/'); await go(page,'/amigos/'); await go(page,'/');
    check('handoff supports retained Home journey', audit.documents.length===2);
  });
} finally {
  await browser.close(); await new Promise(resolve => server.server.close(resolve));
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
}
if (results.some(result => result.failure)) process.exitCode = 1;
async function contextRouteFeed(page, feed) {
  await page.route('**/api/social/feed*', route => route.fulfill({ contentType:'application/json', body:JSON.stringify({ posts:feed, nextCursor:'' }) }));
}
