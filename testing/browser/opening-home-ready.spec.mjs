import { test, expect } from '@playwright/test';

async function syntheticPortal(page, { holdProfile = null, badCredentials = false, mustChangePassword = false } = {}) {
  const calls = [];
  let loggedIn = false;
  const user = { id:'fixture-user', username:'fixture', name:'Usuário fictício', role:'admin', emailVerified:true, accountLevel:'prata', mustChangePassword };
  const profile = { name:'Perfil carregado', handle:'fixture', professional:{ label:'Desenvolvedor' }, avatarAvailable:false, defaultPostAudience:'friends' };
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    calls.push({ path:url.pathname, navigation:request.isNavigationRequest(), at:Date.now() });
    if (url.hostname === '127.0.0.1') {
      if (url.pathname === '/seguranca/') return route.fulfill({ contentType:'text/html', body:'<h1>Segurança fictícia</h1>' });
      return route.continue();
    }
    // Todo acesso não local é interceptado: nenhuma conta real, backend ou telemetria.
    let data = {};
    if (url.pathname === '/api/auth/login') {
      if (badCredentials) return route.fulfill({ status:401, contentType:'application/json', body:JSON.stringify({ error:'Credenciais inválidas.' }) });
      loggedIn = true; data = { token:'fixture-only-' + 'x'.repeat(100), user };
    } else if (url.pathname === '/api/auth/me') data = { user:loggedIn ? user : null };
    else if (url.pathname === '/api/social/config') data = { backendEnabled:true, homeEnabled:true, available:true, profile, toolsPath:'/ferramentas/' };
    else if (url.pathname === '/api/social/me') { if (holdProfile) await holdProfile; data = { profile }; }
    else if (url.pathname === '/api/social/feed') data = { posts:[], nextCursor:'' };
    else if (url.pathname === '/api/chat/contacts') data = { contacts:[] };
    else if (url.pathname === '/api/auth/logout') { loggedIn = false; data = { ok:true }; }
    else if (url.pathname.includes('/notifications')) data = { notifications:[], unreadCount:0 };
    else if (url.pathname.includes('/relationships')) data = { profiles:[], nextCursor:'' };
    return route.fulfill({ contentType:'application/json', body:JSON.stringify(data) });
  });
  await page.goto('/login/');
  await page.locator('#loginUsername').fill('fixture');
  await page.locator('#loginPassword').fill('senha-ficticia');
  await page.evaluate(() => { window.__openingDocument = 'same-document'; window.__visibleFlashes = []; });
  return calls;
}

async function observeTransition(page) {
  await page.evaluate(() => {
    let started = false;
    const frame = () => {
      const cover = document.getElementById('portalOpening');
      if (cover) started = true;
      if (started) {
        const uncovered = !cover || Number(getComputedStyle(cover).opacity) < 0.99;
        const login = document.getElementById('loginForm');
        const loading = document.getElementById('homeLoading');
        if (uncovered && (login || (loading && !loading.hidden))) window.__visibleFlashes.push('login-or-loader');
      }
      window.__openingFrame = requestAnimationFrame(frame);
    };
    frame();
  });
}

test('Home REAL inicia durante os 10 s; revela o mesmo documento sem flash nem reinicialização', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  const calls = await syntheticPortal(page);
  await observeTransition(page);
  const started = Date.now();
  await page.locator('#loginSubmit').click();
  await expect(page.locator('#portalOpening')).toBeVisible();
  await expect(page.locator('#socialIdentityName')).toHaveText('Perfil carregado');
  await expect.poll(() => page.evaluate(() => window.PortalHomeReady)).toBe(true);
  const during = await page.locator('#portalOpeningVideo').evaluate((video) => ({ time:video.currentTime, ended:video.ended, muted:video.muted }));
  expect(during.time).toBeLessThan(10); expect(during.ended).toBe(false); expect(during.muted).toBe(false);
  expect(calls.some((call) => call.path === '/api/social/feed')).toBe(true);
  await expect(page.locator('#portalOpening')).toHaveCount(0, { timeout:15000 });
  expect(Date.now() - started).toBeGreaterThanOrEqual(9900);
  expect(await page.evaluate(() => window.__openingDocument)).toBe('same-document');
  expect(await page.evaluate(() => window.__visibleFlashes)).toEqual([]);
  await expect(page.locator('#loginForm')).toHaveCount(0);
  await expect(page.locator('#homeLoading')).toBeHidden();
  await expect(page.locator('#socialHome')).toBeVisible();
  expect(await page.locator('.portal-shell').evaluate((shell) => shell.inert)).toBe(false);
  expect(calls.filter((call) => call.path === '/api/auth/login')).toHaveLength(1);
  expect(calls.filter((call) => call.navigation)).toHaveLength(1);
  expect(errors).toEqual([]);
  await page.locator('#portalLogout').click();
  await expect(page).toHaveURL(/\/login\/$/);
});

test('Home lenta mantém último quadro; não revela login/loader enquanto perfil está pendente', async ({ page }) => {
  let release;
  const pending = new Promise((resolve) => { release = resolve; });
  await syntheticPortal(page, { holdProfile:pending });
  await observeTransition(page);
  await page.locator('#loginSubmit').click();
  await expect(page.locator('#portalOpening')).toBeVisible();
  await expect(page.locator('#socialFeedList')).toBeAttached();
  await expect(page.locator('#socialFeedList .social-skeleton')).toHaveCount(0);
  await page.locator('#portalOpeningVideo').evaluate((video) => { video.currentTime = video.duration - 0.08; });
  await expect.poll(() => page.locator('#portalOpeningVideo').evaluate((video) => video.ended)).toBe(true);
  await expect(page.locator('#portalOpening')).toHaveCSS('opacity', '1');
  await expect(page.locator('#loginForm')).toHaveCount(0);
  expect(await page.evaluate(() => window.__visibleFlashes)).toEqual([]);
  release();
  await expect(page.locator('#portalOpening')).toHaveCount(0);
  await expect(page.locator('#socialIdentityName')).toHaveText('Perfil carregado');
  expect(await page.evaluate(() => window.__visibleFlashes)).toEqual([]);
});

test('credenciais inválidas não iniciam Home nem retiram controle do login', async ({ page }) => {
  const calls = await syntheticPortal(page, { badCredentials:true });
  await page.locator('#loginSubmit').click();
  await expect(page.locator('#loginStatus')).toBeVisible();
  await expect(page.locator('#loginSubmit')).toBeEnabled();
  await expect(page.locator('#portalOpening')).toHaveCount(0);
  expect(calls.some((call) => call.path.startsWith('/api/social/'))).toBe(false);
  expect(calls.filter((call) => call.path === '/')).toHaveLength(0);
});

test('troca obrigatória de senha preserva destino sem iniciar Home ou APIs sociais', async ({ page }) => {
  const calls = await syntheticPortal(page, { mustChangePassword:true });
  await page.locator('#loginSubmit').click();
  await expect(page.locator('#portalOpening')).toBeVisible();
  await page.locator('#portalOpeningVideo').evaluate((video) => video.dispatchEvent(new Event('ended')));
  await expect(page).toHaveURL(/\/seguranca\/\?primeiro-acesso=1$/);
  expect(calls.some((call) => call.path.startsWith('/api/social/'))).toBe(false);
});
