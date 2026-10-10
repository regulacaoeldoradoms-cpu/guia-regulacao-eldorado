import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY = '1';
const { serve, newPage, ready, chromium } = await import('./mobile-profile-refinement.mjs');
const root = path.resolve(import.meta.dirname, '../..');
const output = path.join(root, '.local/mobile-shell-prewarm');
await fs.mkdir(output, { recursive:true });
const server = await serve(root);
const browser = await chromium.launch({ executablePath:process.env.CHROMIUM_PATH || await fs.access('/usr/bin/chromium').then(()=>'/usr/bin/chromium',()=>chromium.executablePath()), args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] });
const results = [];
let releaseFriends, friendRequestStarted;
const warm = page => page.waitForFunction(() => {
  const state = window.PortalCitizenShell?.diagnostics();
  return state && !state.prewarming && ['/amigos/', '/perfil/', '/mascotes/', '/notificacoes/'].every(path => state.ready.includes(path));
});
async function run(id, start, setup, exercise) {
  if (process.env.WARM_CASES && !process.env.WARM_CASES.split(',').includes(id)) return;
  const result = { id, checks:[], errors:[] };
  const { page, context, audit } = await newPage(browser, { width:390, theme:'dark', seedOnce:true }, server.origin, result);
  const requests = [];
  page.on('request', request => requests.push({ url:new URL(request.url()).pathname, type:request.resourceType() }));
  const check = (label, condition) => { assert.ok(condition, label); result.checks.push(label); };
  try {
    if (process.env.WARM_CPU_THROTTLE) await (await context.newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate:Number(process.env.WARM_CPU_THROTTLE) });
    await setup?.(page, context);
    await page.goto(server.origin + start, { waitUntil:'domcontentloaded' });
    await ready(page, start);
    await exercise(page, audit, requests, check);
    check('no page errors', result.errors.length === 0);
    check('only synthetic mapped APIs', audit.unmappedApiCalls.length === 0);
  } catch (error) { result.failure = error.stack; }
  finally { await context.close(); results.push(result); console.log(JSON.stringify(result)); }
}
try {
  await run('prepared-first-switch', '/', null, async (page, audit, requests, check) => {
    await warm(page);
    await page.evaluate(() => {
      window.__preparedOwners = { document, nav:document.querySelector('.social-mobile-nav'), chat:document.getElementById('portalChatRoot'), pet:window.PortalPets.runtime };
      window.__loadingShown = false;
      new MutationObserver(() => { if (!document.querySelector('.citizen-route-notice').hidden) window.__loadingShown = true; }).observe(document.querySelector('.citizen-route-notice'), { attributes:true });
    });
    const before = requests.length;
    for (const path of ['/amigos/', '/perfil/', '/mascotes/', '/notificacoes/', '/']) {
      await page.evaluate(path => window.PortalCitizenShell.navigate(new URL(path, location.href)), path);
      check(path + ' keeps real History URL', new URL(page.url()).pathname === path);
      if (path === '/amigos/') check('friend content prepared without skeleton', await page.locator('#relationshipList .social-skeleton').count() === 0);
      if (path === '/perfil/') check('own profile already visible', await page.locator('#socialProfile').isVisible());
    }
    const later = requests.slice(before);
    await fs.writeFile(path.join(output, 'activation-requests.json'), JSON.stringify(later, null, 2));
    const unexpectedLoads = later.filter(request => request.type === 'script' || !request.url.includes('.') && !request.url.startsWith('/api/'));
    check('no HTML or script fetch on first prepared activation: '+JSON.stringify(unexpectedLoads), unexpectedLoads.length === 0);
    check('no first-activation profile identity/feed fetch', !later.some(request => /^\/api\/(citizen\/identity|social\/me$|social\/profiles\/[^/]+\/posts)/.test(request.url)));
    check('no loading notice after preparation', await page.evaluate(() => !window.__loadingShown));
    check('single document and shared owners retained', audit.documents.length === 1 && await page.evaluate(() => {
      const saved = window.__preparedOwners;
      return document === saved.document && saved.nav === document.querySelector('.social-mobile-nav') && saved.chat === document.getElementById('portalChatRoot') && saved.pet === window.PortalPets.runtime;
    }));
    check('no professional or arbitrary profile preloading', !requests.some(request => /^\/(medico|recepcao|coordenacao|telemedicina)\//.test(request.url) || /^\/api\/social\/profiles\/[^/]+$/.test(request.url)));
    check('bounded core cache', await page.evaluate(() => window.PortalCitizenShell.diagnostics().routes === 5));
  });
  await run('slow-first-tap', '/', async page => {
    await page.route('**/amigos/', async route => { await new Promise(resolve => setTimeout(resolve, 1500)); await route.fallback(); });
  }, async (page, audit, requests, check) => {
    await page.waitForFunction(() => window.PortalCitizenShell.diagnostics().prewarming);
    await page.locator('.social-mobile-nav a[href="/amigos/"]').click();
    await page.locator('.citizen-route-notice:not([hidden])').waitFor();
    check('initial Home remains visible during slow preparation', await page.locator('#socialHome').isVisible());
    await page.waitForFunction(() => location.pathname === '/amigos/' && !window.PortalCitizenShell.diagnostics().navigating);
    check('tap shares one in-flight HTML request', requests.filter(request => request.url === '/amigos/').length === 1);
    check('slow preparation does not reload', audit.documents.length === 1);
  });
  await run('background-error-retry', '/', async page => {
    await page.route('**/amigos/', route => route.fulfill({ status:503, body:'synthetic unavailable' }));
  }, async (page, audit, requests, check) => {
    await page.waitForFunction(() => window.PortalCitizenShell.diagnostics().ready.includes('/perfil/') && !window.PortalCitizenShell.diagnostics().prewarming);
    check('background failure leaves Home usable and no notice', await page.locator('#socialHome').isVisible() && await page.locator('.citizen-route-notice').isHidden());
    await page.locator('.social-mobile-nav a[href="/amigos/"]').click();
    await page.locator('.citizen-route-notice button').waitFor();
    await page.unroute('**/amigos/');
    await page.locator('.citizen-route-notice button').click();
    await page.waitForFunction(() => location.pathname === '/amigos/' && !window.PortalCitizenShell.diagnostics().navigating);
    check('failed preparation remains retryable without reload', audit.documents.length === 1);
  });
  await run('deep-link-own-profile', '/perfil/?u=fixture.friend', null, async (page, audit, requests, check) => {
    await warm(page);
    check('background preparation keeps requested deep-link URL', new URL(page.url()).search === '?u=fixture.friend');
    const before = requests.length;
    await page.evaluate(() => window.PortalCitizenShell.navigate(new URL('/perfil/', location.href)));
    check('own profile preparation ignores deep-link search', await page.locator('#profileName').textContent() === 'Maria Aparecida de Oliveira dos Santos');
    check('prepared own profile uses no new route/script fetch', !requests.slice(before).some(request => request.type === 'script' || request.url === '/perfil/'));
    check('deep-link bootstrap retains one document', audit.documents.length === 1);
  });
  await run('background-profile-data-error', '/', async page => {
    await page.route('**/api/social/me', route => route.fulfill({ status:503, contentType:'application/json', body:JSON.stringify({ error:'synthetic unavailable' }) }));
  }, async (page, audit, requests, check) => {
    await page.waitForFunction(() => window.PortalCitizenShell.diagnostics().ready.includes('/notificacoes/') && !window.PortalCitizenShell.diagnostics().prewarming);
    check('failed profile data is not marked ready', await page.evaluate(() => !window.PortalCitizenShell.diagnostics().ready.includes('/perfil/')));
    await page.unroute('**/api/social/me');
    await page.evaluate(() => window.PortalCitizenShell.navigate(new URL('/perfil/', location.href)));
    check('normal activation retries profile data', await page.locator('#socialProfile').isVisible());
    check('profile data failure does not reload', audit.documents.length === 1);
  });
  await run('session-end-during-preparation', '/', async page => {
    await page.route('**/amigos/', async route => { await new Promise(resolve => setTimeout(resolve, 800)); await route.fallback().catch(() => {}); });
  }, async (page, audit, requests, check) => {
    await page.waitForFunction(() => window.PortalCitizenShell.diagnostics().prewarming);
    check('logout clears prepared roots immediately', await page.evaluate(() => {
      const shell = window.PortalCitizenShell;
      window.RegulationAuth.clearSession();
      return shell.diagnostics().ended && shell.diagnostics().routes === 0 && document.querySelectorAll('.citizen-route-area').length === 0;
    }));
    await page.waitForURL('**/login/**');
    check('old pending preparation cannot mount into Login', await page.locator('.citizen-route-area').count() === 0);
  });
  await run('cache-admission-race', '/', async page => {
    let started;
    friendRequestStarted = new Promise(resolve => { started = resolve; });
    const held = new Promise(resolve => { releaseFriends = resolve; });
    await page.route('**/amigos/', async route => { started(); await held; await route.fallback().catch(() => {}); });
  }, async (page, audit, requests, check) => {
    await friendRequestStarted;
    for (let n=0;n<17;n++) await page.evaluate(n => window.PortalCitizenShell.navigate(new URL('/perfil/?clean='+n, location.href)), n);
    check('foreground fills strict16slot cache', await page.evaluate(() => window.PortalCitizenShell.diagnostics().routes === 16));
    releaseFriends();
    await page.waitForFunction(() => !window.PortalCitizenShell.diagnostics().prewarming);
    const size = await page.evaluate(() => window.PortalCitizenShell.diagnostics().routes);
    check('late background admission retains strict16slot bound: '+size, size === 16);
    check('active profile survives concurrent admission', await page.locator('#socialProfile').isVisible() && new URL(page.url()).search === '?clean=16');
    check('admission race retains document', audit.documents.length === 1);
  });
  await run('background-retains-reading-position', '/', async page => {
    await page.route('**/perfil/', async route => { await new Promise(resolve => setTimeout(resolve, 600)); await route.fallback(); });
  }, async (page, audit, requests, check) => {
    await page.evaluate(() => {
      scrollTo(0,240);
      window.__readingBeforePreparation = {y:scrollY,nav:document.querySelector('.social-mobile-nav'),body:document.body.className};
    });
    await warm(page);
    check('background preparation preserves current scroll', await page.evaluate(() => Math.abs(scrollY-window.__readingBeforePreparation.y)<3));
    check('background preparation preserves active body and bar', await page.evaluate(() => document.body.className===window.__readingBeforePreparation.body&&document.querySelector('.social-mobile-nav')===window.__readingBeforePreparation.nav));
    check('background content never mounts over Home', await page.locator('.citizen-route-area').count()===1&&await page.locator('#socialHome').isVisible());
  });
} finally { await browser.close(); await new Promise(resolve => server.server.close(resolve)); }
await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
if (results.some(result => result.failure)) process.exitCode = 1;
