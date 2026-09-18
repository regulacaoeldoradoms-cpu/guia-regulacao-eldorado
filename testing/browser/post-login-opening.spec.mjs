import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const ASSET = '/assets/portal-opening-v1.mp4?v=20260918-1';
const CACHE = 'portal-opening-media-v1';
const MP4 = await readFile(new URL('../../assets/portal-opening-v1.mp4', import.meta.url));
const root = (page) => page.locator('#portalOpening');
const video = (page) => page.locator('#portalOpeningVideo');
const submit = (page) => page.locator('#loginSubmit');
const calls = (page) => page.evaluate(() => window.__LAB_LOGIN_CALLS__);
const prepare = (page) => page.evaluate(() => window.PortalLoginOpening.prepare());
const complete = (page) => expect(page).toHaveURL(/\/opening\/complete\.html$/);
const cacheSize = (page) => page.evaluate(async ({ CACHE, ASSET }) => {
  const response = await (await caches.open(CACHE)).match(ASSET);
  return response ? (await response.blob()).size : 0;
}, { CACHE, ASSET });

async function assertPlaying(page) {
  await expect(root(page)).toBeVisible();
  await expect(page.locator('#portalOpeningStartWithSound')).toHaveCount(0);
  await expect.poll(() => video(page).evaluate((v) => !v.paused && v.currentTime > 0)).toBe(true);
  const data = await video(page).evaluate((v) => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight, muted: v.muted, volume: v.volume, src: v.currentSrc }));
  expect(data.duration).toBeGreaterThan(9.9);
  expect(data.duration).toBeLessThan(10.1);
  expect(data.width).toBe(1280);
  expect(data.height).toBe(720);
  expect(data.muted).toBe(false);
  expect(data.volume).toBe(1);
  expect(data.src.startsWith('blob:')).toBe(true);
}

async function finishQuickly(page) {
  await video(page).evaluate((v) => v.dispatchEvent(new Event('ended')));
  await complete(page);
}

test('regressão: clique imediato autentica uma vez; somente a transição espera o download lento', async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route('**/assets/portal-opening-v1.mp4*', async (route) => {
    await held;
    await route.fulfill({ status: 200, contentType: 'video/mp4', body: MP4 });
  });
  await page.goto('/opening/', { waitUntil: 'domcontentloaded' });
  await expect(submit(page)).toBeEnabled();
  await expect(submit(page)).toHaveText('Entrar');
  await expect(page.locator('#loginStatus')).toHaveText('');
  await submit(page).click();
  await expect.poll(() => calls(page), { timeout: 1000 }).toBe(1);
  await expect.poll(() => page.evaluate(() => window.__LAB_WARMED__)).toBe(true);
  await page.evaluate(() => document.getElementById('loginForm').requestSubmit());
  // Excede a ativação transitória: download lento não pode descartar o primeiro clique.
  await page.waitForTimeout(6000);
  await expect(page).toHaveURL(/\/opening\/$/);
  await expect(root(page)).toHaveCount(0);
  expect(await calls(page)).toBe(1);
  release();
  await assertPlaying(page);
  await finishQuickly(page);
});

test('MP4 preparado toca os 10 segundos reais com som, tela inteira e fade', async ({ page }) => {
  await page.goto('/opening/');
  expect(await prepare(page)).toBe(true);
  const started = Date.now();
  await submit(page).click();
  await assertPlaying(page);
  const box = await root(page).boundingBox();
  const viewport = page.viewportSize();
  expect(Math.abs(box.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.width - viewport.width)).toBeLessThanOrEqual(2);
  expect(Math.abs(box.height - viewport.height)).toBeLessThanOrEqual(2);
  // Aqui não se injeta ended; o navegador precisa concluir o vídeo de verdade.
  await complete(page);
  expect(Date.now() - started).toBeGreaterThanOrEqual(9900);
});

test('segunda preparação reutiliza Cache Storage sem baixar o MP4', async ({ page }) => {
  await page.goto('/opening/');
  expect(await prepare(page)).toBe(true);
  await expect.poll(() => cacheSize(page)).toBe(3275007);
  await page.route('**/assets/portal-opening-v1.mp4*', (route) => route.abort());
  await page.reload();
  await submit(page).click();
  await assertPlaying(page);
  await finishQuickly(page);
});

test('404 da mídia não bloqueia o botão nem impede login válido pelo fallback', async ({ page }) => {
  await page.route('**/assets/portal-opening-v1.mp4*', (route) => route.fulfill({ status: 404, body: 'Not found' }));
  await page.goto('/opening/');
  await expect(submit(page)).toBeEnabled();
  await submit(page).click();
  await complete(page);
});

test('MP4 incompleto nunca vira abertura, mas também não bloqueia autenticação', async ({ page }) => {
  await page.route('**/assets/portal-opening-v1.mp4*', (route) => route.fulfill({ contentType: 'video/mp4', body: MP4.subarray(0, 500) }));
  await page.goto('/opening/');
  await expect(submit(page)).toBeEnabled();
  expect(await prepare(page)).toBe(false);
  await submit(page).click();
  await complete(page);
});

test('senha incorreta responde sem esperar o vídeo e permite corrigir a senha', async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route('**/assets/portal-opening-v1.mp4*', async (route) => { await held; await route.abort(); });
  await page.goto('/opening/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const login = window.RegulationAuth.login;
    window.RegulationAuth.login = async (...args) => {
      window.RegulationAuth.login = login;
      throw new Error('Usuário ou senha incorretos.');
    };
  });
  await submit(page).click();
  await expect(page.locator('#loginStatus')).toHaveText('Usuário ou senha incorretos.');
  await expect(submit(page)).toBeEnabled();
  await expect(root(page)).toHaveCount(0);
  release();
  await submit(page).click();
  await complete(page);
});

test('teclado Enter funciona com mídia ainda pendente', async ({ page }) => {
  await page.route('**/assets/portal-opening-v1.mp4*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.fulfill({ contentType: 'video/mp4', body: MP4 });
  });
  await page.goto('/opening/', { waitUntil: 'domcontentloaded' });
  await page.locator('#loginPassword').press('Enter');
  await expect.poll(() => calls(page), { timeout: 1000 }).toBe(1);
  await assertPlaying(page);
  await finishQuickly(page);
});

test('bloqueio de áudio não cria segundo botão e usa o loader legado', async ({ page }) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (this.id === 'portalOpeningVideo' && !this.hidden) return Promise.reject(new DOMException('blocked', 'NotAllowedError'));
      return play.apply(this, args);
    };
  });
  await page.goto('/opening/');
  await submit(page).click();
  await complete(page);
  await expect(page.locator('#portalOpeningStartWithSound')).toHaveCount(0);
});

test('play que nunca resolve tem saída finita sem repetir o clique', async ({ page }) => {
  await page.goto('/opening/');
  expect(await prepare(page)).toBe(true);
  await page.evaluate(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (this.id === 'portalOpeningVideo' && !this.hidden) return new Promise(() => {});
      return play.apply(this, args);
    };
    const schedule = window.setTimeout;
    window.setTimeout = (fn, ms, ...args) => schedule(fn, ms === 20000 ? 150 : ms, ...args);
  });
  await submit(page).click();
  await complete(page);
});

test('rede travada tem prazo total e não deixa Entrar preso para sempre', async ({ page }) => {
  await page.addInitScript(() => {
    const fetchOriginal = window.fetch;
    window.fetch = (...args) => String(args[0]).includes('portal-opening-v1.mp4') ? new Promise(() => {}) : fetchOriginal(...args);
    const schedule = window.setTimeout;
    window.setTimeout = (fn, ms, ...args) => schedule(fn, ms === 20000 ? 1500 : ms, ...args);
  });
  await page.goto('/opening/', { waitUntil: 'domcontentloaded' });
  await expect(submit(page)).toBeEnabled();
  await submit(page).click();
  await expect.poll(() => calls(page), { timeout: 1000 }).toBe(1);
  await complete(page);
});

test('controlador da abertura indisponível não desabilita o login', async ({ page }) => {
  await page.route('**/js/login-opening.js*', (route) => route.abort());
  await page.goto('/opening/');
  await expect(submit(page)).toBeEnabled();
  await submit(page).click();
  await complete(page);
});

test('Cache Storage bloqueado não impede a preparação por rede', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'caches', { configurable: true, get() { throw new DOMException('denied', 'SecurityError'); } }));
  await page.goto('/opening/');
  expect(await prepare(page)).toBe(true);
  await submit(page).click();
  await assertPlaying(page);
  await finishQuickly(page);
});
