import { test, expect, devices } from '@playwright/test';

const cover = page => page.locator('#portalOpening');
async function syntheticPortal(page, options = {}) {
  await page.addInitScript(() => { delete window.PushManager; });
  const calls = [];
  let loggedIn = !!options.activeSession;
  let assetFailed = false;
  const user = {id:'fixture-mobile',username:'fixture',name:'Usuário fictício',role:options.role || 'admin',emailVerified:true,accountLevel:'prata',mustChangePassword:!!options.mustChangePassword};
  if (options.activeSession) await page.addInitScript(({user, recent}) => {
    if (location.pathname !== '/login/') return;
    sessionStorage.setItem('regulacao.portal.session', 'fixture-only-' + 'x'.repeat(100));
    sessionStorage.setItem('regulacao.portal.user', JSON.stringify(user));
    sessionStorage.setItem('regulacao.portal.user.validatedAt', String(recent ? Date.now() : 1));
  }, {user, recent:options.activeSession === 'cached'});
  const profile = {name:'Perfil carregado',handle:'fixture',professional:{label:'Desenvolvedor'},avatarAvailable:false,defaultPostAudience:'friends'};
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    calls.push({path:url.pathname,search:url.search,navigation:request.isNavigationRequest(),at:Date.now()});
    if (url.hostname === '127.0.0.1') {
      if (url.pathname === '/assets/portal-opening-mobile-v1.webp') {
        if (options.holdLogo) await options.holdLogo;
        if (options.brokenLogo) return route.fulfill({status:404,body:'missing fixture image'});
      }
      if (options.missingMobileController && url.pathname === '/js/login-opening-mobile.js') return route.abort('blockedbyclient');
      if (options.failHomeAsset && !assetFailed && url.pathname === '/js/home.js') {
        assetFailed = true; return route.abort('blockedbyclient');
      }
      if (url.pathname === '/seguranca/') return route.fulfill({contentType:'text/html',body:'<h1>Segurança fictícia</h1>'});
      return route.continue();
    }
    // No external request leaves this fixture: no real users, APIs or telemetry.
    let data = {};
    if (url.pathname === '/api/auth/login') {
      if (options.badCredentials) return route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({error:'Credenciais inválidas.'})});
      loggedIn = true; data = {token:'fixture-only-' + 'x'.repeat(100),user};
    } else if (url.pathname === '/api/auth/me') data = {user:loggedIn ? user : null};
    else if (url.pathname === '/api/social/config') data = {backendEnabled:true,homeEnabled:true,available:true,profile,toolsPath:'/ferramentas/'};
    else if (url.pathname === '/api/social/me') { if (options.holdProfile) await options.holdProfile; data = {profile}; }
    else if (url.pathname === '/api/social/feed') data = {posts:[],nextCursor:''};
    else if (url.pathname === '/api/chat/contacts') data = {contacts:[]};
    else if (url.pathname.includes('/notifications')) data = {notifications:[],unreadCount:0};
    else if (url.pathname.includes('/relationships')) data = {profiles:[],nextCursor:''};
    return route.fulfill({contentType:'application/json',body:JSON.stringify(data)});
  });
  await page.goto('/login/', {waitUntil:'domcontentloaded'});
  if (options.activeSession) return calls;
  await page.locator('#loginUsername').fill('fixture');
  await page.locator('#loginPassword').fill('senha-ficticia');
  await page.evaluate(() => {
    window.__mobileDocument = 'same-document'; window.__mobileFlashes = [];
    let started = false;
    const inspect = () => {
      const root = document.getElementById('portalOpening');
      if (root) started = true;
      if (started && (!root || Number(getComputedStyle(root).opacity) < 0.99)) {
        const loader = document.getElementById('homeLoading');
        if (document.getElementById('loginForm') || (loader && !loader.hidden)) window.__mobileFlashes.push('unready-surface');
      }
      window.__inspectMobile = requestAnimationFrame(inspect);
    };
    inspect();
  });
  return calls;
}
async function expectReady(page, calls) {
  // Wait for the actual shell/reveal, not absence of a cover before login resolves.
  await expect(page.locator('#socialHome')).toBeVisible();
  await expect(page.locator('.portal-shell')).toHaveJSProperty('inert', false);
  await expect(cover(page)).toHaveCount(0);
  await expect(page.locator('#homeLoading')).toBeHidden();
  expect(await page.evaluate(() => window.__mobileDocument)).toBe('same-document');
  expect(await page.evaluate(() => window.__mobileFlashes)).toEqual([]);
  expect(await page.locator('.portal-shell').evaluate(el => el.inert)).toBe(false);
  expect(calls.filter(call => call.path === '/api/auth/login')).toHaveLength(1);
  expect(calls.filter(call => call.navigation)).toHaveLength(1);
  expect(calls.filter(call => call.path.endsWith('.mp4'))).toHaveLength(0);
  await expect(page.locator('#portalOpeningVideo')).toHaveCount(0);
}
async function expectCentered(page) {
  const root = await cover(page).boundingBox();
  const logo = await page.locator('.portal-mobile-opening__logo').boundingBox();
  const viewport = page.viewportSize();
  expect(Math.abs(root.width - viewport.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(root.height - viewport.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(logo.x + logo.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
  expect(Math.abs(logo.y + logo.height / 2 - viewport.height / 2)).toBeLessThanOrEqual(1);
  expect(Math.abs(logo.width - logo.height)).toBeLessThanOrEqual(1);
  expect(await cover(page).innerText()).toBe('');
  await expect(cover(page)).toHaveCSS('background-color', 'rgb(0, 0, 0)');
}

test('ready Home removes mobile layer without waiting for the eight-second cycle', async ({page}) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const calls = await syntheticPortal(page);
  const start = Date.now();
  await page.locator('#loginSubmit').click();
  await expectReady(page, calls);
  expect(Date.now() - start).toBeLessThan(8000);
  expect(errors).toEqual([]);
});

test('slow Home really mounts under an opaque, centered logo in portrait and landscape, beyond one cycle', async ({page}, info) => {
  let release;
  const holdProfile = new Promise(resolve => { release = resolve; });
  const calls = await syntheticPortal(page, {holdProfile});
  const start = Date.now();
  await page.locator('#loginSubmit').click();
  try {
    await expect(cover(page)).toBeVisible();
    await expect(page.locator('#socialFeedList')).toBeAttached();
    await expect(page.locator('#loginForm')).toHaveCount(0);
    expect(await page.locator('.portal-shell').evaluate(el => el.inert)).toBe(true);
    await page.waitForTimeout(1200);
    await expectCentered(page);
    const light = await page.locator('.portal-mobile-opening__logo canvas').evaluate(canvas => {
      const pixels = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
      return pixels.some((value,index) => index % 4 === 3 && value > 0);
    });
    expect(light).toBe(true);
    await page.screenshot({path:info.outputPath('mobile-portrait.png')});
    await page.setViewportSize({width:844,height:390});
    await expectCentered(page);
    await page.screenshot({path:info.outputPath('mobile-landscape.png')});
    await page.waitForTimeout(Math.max(0, 8200 - (Date.now() - start)));
    await expect(cover(page)).toHaveCSS('opacity','1');
    expect(await page.evaluate(() => window.__mobileFlashes)).toEqual([]);
    const readyAt = Date.now(); release();
    await expectReady(page, calls);
    expect(Date.now() - readyAt).toBeLessThan(5000);
    await page.screenshot({path:info.outputPath('mobile-home-ready.png')});
  } finally { release(); }
});

test('a blocked logo download never delays the real Home', async ({page}) => {
  let release;
  const holdLogo = new Promise(resolve => { release = resolve; });
  const calls = await syntheticPortal(page, {holdLogo});
  try {
    await page.locator('#loginSubmit').click();
    await expectReady(page, calls);
  } finally { release(); await page.waitForLoadState('load'); }
});

test('image failure has a static fallback and still reveals Home', async ({page}) => {
  let release;
  const holdProfile = new Promise(resolve => { release = resolve; });
  const calls = await syntheticPortal(page, {holdProfile,brokenLogo:true});
  await page.locator('#loginSubmit').click();
  try {
    await expect(page.locator('.portal-mobile-opening__logo img')).toHaveAttribute('src','/assets/portal-regulacao-icon.webp');
    await expect(page.locator('.portal-mobile-opening__logo canvas')).toHaveCount(0);
  } finally { release(); }
  await expectReady(page, calls);
});

test('Canvas failure does not become a login or Home failure', async ({page}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(...args) {
      if (this.closest('.portal-mobile-opening')) throw Error('synthetic graphics failure');
      return original.apply(this,args);
    };
  });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const calls = await syntheticPortal(page);
  await page.locator('#loginSubmit').click();
  await expectReady(page,calls);
  expect(errors).toEqual([]);
});

test('reduced motion keeps the static logo and avoids the fade delay', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  let release;
  const holdProfile = new Promise(resolve => { release = resolve; });
  const calls = await syntheticPortal(page,{holdProfile});
  await page.locator('#loginSubmit').click();
  try {
    await expect(cover(page)).toBeVisible();
    await expect(page.locator('.portal-mobile-opening__logo canvas')).toHaveCSS('display','none');
    await expect(cover(page)).toHaveCSS('transition-duration','0s');
    await expectCentered(page);
  } finally { release(); }
  await expectReady(page,calls);
});

test('bad credentials never show the opening or mount Home', async ({page}) => {
  const calls = await syntheticPortal(page,{badCredentials:true});
  await page.locator('#loginSubmit').click();
  await expect(page.locator('#loginStatus')).toBeVisible();
  await expect(page.locator('#loginSubmit')).toBeEnabled();
  await expect(cover(page)).toHaveCount(0);
  expect(calls.some(call => call.path.startsWith('/api/social/'))).toBe(false);
});

test('mandatory password change preserves its destination without an opening or social reads', async ({page}) => {
  const calls = await syntheticPortal(page,{mustChangePassword:true});
  await page.locator('#loginSubmit').click();
  await expect(page).toHaveURL(/\/seguranca\/\?primeiro-acesso=1$/);
  expect(calls.some(call => call.path.startsWith('/api/social/'))).toBe(false);
  expect(calls.some(call => call.path.endsWith('.mp4'))).toBe(false);
});

test('failed Home asset uses ordinary navigation once, without waiting for a cycle', async ({page}) => {
  const calls = await syntheticPortal(page,{failHomeAsset:true});
  await page.locator('#loginSubmit').click();
  await page.waitForFunction(() => window.__mobileDocument === undefined);
  await expect(page.locator('#socialIdentityName')).toHaveText('Perfil carregado');
  expect(calls.filter(call => call.path === '/api/auth/login')).toHaveLength(1);
  expect(calls.filter(call => call.navigation)).toHaveLength(2);
});

test('even an unexpectedly stuck mount has a finite fallback', async ({page}) => {
  const calls = await syntheticPortal(page);
  await page.evaluate(() => {
    window.PortalHomeTransition = {prepare:() => ({mount:() => new Promise(() => {}),reveal(){},cancel(){}})};
    const original = window.setTimeout;
    window.setTimeout = (fn,ms,...args) => original(fn,ms === 21000 ? 200 : ms,...args);
  });
  await page.locator('#loginSubmit').click();
  await page.waitForFunction(() => window.__mobileDocument === undefined);
  expect(calls.filter(call => call.path === '/api/auth/login')).toHaveLength(1);
  expect(calls.filter(call => call.navigation)).toHaveLength(2);
});

test('narrow desktop still plays the existing video and ignores the mobile layer', async ({browser}) => {
  const context = await browser.newContext({...devices['Desktop Chrome'],viewport:{width:640,height:800},serviceWorkers:'block',baseURL:'http://127.0.0.1:4174'});
  try {
    const page = await context.newPage();
    const calls = await syntheticPortal(page);
    await page.locator('#loginSubmit').click();
    await expect(page.locator('#portalOpeningVideo')).toBeVisible();
    await expect(page.locator('.portal-mobile-opening')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => window.PortalHomeReady)).toBe(true);
    expect(calls.some(call => call.path.endsWith('.mp4'))).toBe(true);
    await page.locator('#portalOpeningVideo').evaluate(video => video.dispatchEvent(new Event('ended')));
    await expect(cover(page)).toHaveCount(0);
  } finally { await context.close(); }
});


test('missing optional mobile controller preserves normal login and never prepares a video', async ({page}) => {
  const calls = await syntheticPortal(page,{missingMobileController:true});
  await page.locator('#loginSubmit').click();
  await page.waitForFunction(() => window.__mobileDocument === undefined);
  await expect(page.locator('#socialIdentityName')).toHaveText('Perfil carregado');
  expect(calls.filter(call => call.path === '/api/auth/login')).toHaveLength(1);
  expect(calls.some(call => call.path.endsWith('.mp4'))).toBe(false);
});

test('citizen role uses its existing mobile Home under the same visual-only layer', async ({page}) => {
  const calls = await syntheticPortal(page,{role:'cidadao'});
  await page.locator('#loginSubmit').click();
  await expectReady(page,calls);
});

for (const activeSession of ['cached', 'revalidate']) {
  test(`an active ${activeSession} session keeps ordinary Home navigation without replaying the opening`, async ({page}) => {
    const calls = await syntheticPortal(page,{activeSession});
    await expect(page.locator('#socialIdentityName')).toHaveText('Perfil carregado');
    await expect(page.locator('.portal-shell')).toHaveJSProperty('inert', false);
    await expect(cover(page)).toHaveCount(0);
    expect(calls.filter(call => call.navigation)).toHaveLength(2);
    expect(calls.filter(call => call.path === '/api/auth/login')).toHaveLength(0);
    expect(calls.some(call => call.search.includes('portal-home-shell'))).toBe(false);
    expect(calls.some(call => call.path.endsWith('.mp4'))).toBe(false);
  });
}

async function trackOpeningResources(page) {
  await page.addInitScript(() => {
    const resources = window.__openingResources = {listeners:new Set(),frames:new Set(),timers:new Set(),observers:new Set()};
    // Attribute resources to their direct caller, excluding the Home helper's
    // independent AbortSignal and modules invoked by the transition.
    const fromOpening = () => new Error().stack.split('\n')
      .find(line => /https?:\/\/\S+\/js\//.test(line))?.includes('/js/login-opening-mobile.js');
    const add = EventTarget.prototype.addEventListener;
    const remove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function(type,fn,...args) {
      if (fromOpening()) resources.listeners.add({target:this,type,fn});
      return add.call(this,type,fn,...args);
    };
    EventTarget.prototype.removeEventListener = function(type,fn,...args) {
      for (const entry of resources.listeners) {
        if (entry.target === this && entry.type === type && entry.fn === fn) resources.listeners.delete(entry);
      }
      return remove.call(this,type,fn,...args);
    };
    const raf = window.requestAnimationFrame;
    const cancelRaf = window.cancelAnimationFrame;
    window.requestAnimationFrame = fn => {
      const tracked = fromOpening();
      const id = raf.call(window,now => { resources.frames.delete(id); fn(now); });
      if (tracked) resources.frames.add(id);
      return id;
    };
    window.cancelAnimationFrame = id => { resources.frames.delete(id); return cancelRaf.call(window,id); };
    const timeout = window.setTimeout;
    const clear = window.clearTimeout;
    window.setTimeout = (fn,ms,...args) => {
      const tracked = fromOpening();
      const id = timeout(() => { resources.timers.delete(id); fn(...args); },ms);
      if (tracked) resources.timers.add(id);
      return id;
    };
    window.clearTimeout = id => { resources.timers.delete(id); return clear(id); };
    const Observer = window.ResizeObserver;
    window.ResizeObserver = class extends Observer {
      constructor(fn) { super(fn); if (fromOpening()) resources.observers.add(this); }
      disconnect() { resources.observers.delete(this); super.disconnect(); }
    };
  });
}

test('mobile graphics and transition release their listeners, frames, observer and timers', async ({page}) => {
  await trackOpeningResources(page);
  let release;
  const holdProfile = new Promise(resolve => { release = resolve; });
  const calls = await syntheticPortal(page,{holdProfile});
  await page.locator('#loginSubmit').click();
  try {
    await expect.poll(() => page.evaluate(() => Object.values(window.__openingResources).every(set => set.size > 0))).toBe(true);
  } finally { release(); }
  await expectReady(page,calls);
  await expect.poll(() => page.evaluate(() => Object.values(window.__openingResources).map(set => set.size))).toEqual([0,0,0,0]);
  await expect(page.locator('.portal-mobile-opening__logo canvas')).toHaveCount(0);
});

test('cancelling a pending transition releases graphics and leaves the fallback cover opaque', async ({page}) => {
  await trackOpeningResources(page);
  await syntheticPortal(page);
  await page.evaluate(() => {
    window.PortalHomeTransition = {prepare:() => ({mount:() => new Promise(() => {}),reveal(){throw Error('cancelled Home revealed');},cancel(){}})};
    window.__openingCancelled = window.PortalMobileLoginOpening.beforeNavigate({destination:'/'});
  });
  await expect(cover(page)).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('portal:session-cleared')));
  expect(await page.evaluate(() => window.__openingCancelled)).toBe(false);
  await expect(cover(page)).toHaveCSS('opacity','1');
  expect(await page.evaluate(() => Object.values(window.__openingResources).map(set => set.size))).toEqual([0,0,0,0]);
});
