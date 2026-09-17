import { expect, test } from '@playwright/test';

const OPENING_ASSET = '/assets/portal-opening-v1.mp4?v=20260917-1';
const OPENING_CACHE = 'portal-opening-media-v1';

async function waitForLoginReady(page) {
  const submit = page.locator('#loginSubmit');
  await expect(submit).toBeEnabled();
  await expect(submit).toHaveText('Entrar');
  return submit;
}

async function waitForMetadata(video) {
  await video.evaluate((element) => new Promise((resolve, reject) => {
    if (element.readyState >= 1 && Number.isFinite(element.duration)) {
      resolve();
      return;
    }
    const timer = setTimeout(() => reject(new Error('metadata_timeout')), 10000);
    element.addEventListener('loadedmetadata', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
    element.addEventListener('error', () => {
      clearTimeout(timer);
      reject(new Error('media_error'));
    }, { once: true });
  }));
}

async function submitSyntheticLogin(page) {
  const submit = await waitForLoginReady(page);
  await submit.click();
  await expect(page.locator('#portalOpening')).toBeVisible();
}

test('login só libera após o MP4 completo e a abertura começa sem botão extra', async ({ page }) => {
  await page.goto('/opening/');

  const submit = await waitForLoginReady(page);
  expect(await page.evaluate(async ({ cacheName, asset }) => {
    const cache = await caches.open(cacheName);
    const response = await cache.match(asset);
    if (!response) return 0;
    return (await response.blob()).size;
  }, { cacheName: OPENING_CACHE, asset: OPENING_ASSET })).toBe(2393970);

  await submit.click();

  const root = page.locator('#portalOpening');
  const video = page.locator('#portalOpeningVideo');
  await expect(root).toBeVisible();
  await waitForMetadata(video);
  await expect(page.locator('#portalOpeningStartWithSound')).toHaveCount(0);

  const metadata = await video.evaluate((element) => ({
    duration: element.duration,
    muted: element.muted,
    defaultMuted: element.defaultMuted,
    volume: element.volume,
    src: element.currentSrc || element.src,
    paused: element.paused
  }));

  expect(metadata.duration).toBeGreaterThan(9.9);
  expect(metadata.duration).toBeLessThan(10.1);
  expect(metadata.muted).toBe(false);
  expect(metadata.defaultMuted).toBe(false);
  expect(metadata.volume).toBe(1);
  expect(metadata.src.startsWith('blob:')).toBe(true);
  expect(metadata.paused).toBe(false);
  expect(await page.evaluate(() => window.__LAB_WARMED__)).toBe(true);

  const box = await root.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(Math.abs(box.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.width - viewport.width)).toBeLessThanOrEqual(2);
  expect(Math.abs(box.height - viewport.height)).toBeLessThanOrEqual(2);

  await video.evaluate((element) => element.dispatchEvent(new Event('ended')));
  await expect(page).toHaveURL(/\/opening\/complete\.html$/);
});

test('segunda preparação usa Cache Storage mesmo com a rede do MP4 bloqueada', async ({ page }) => {
  await page.goto('/opening/');
  await waitForLoginReady(page);

  expect(await page.evaluate(async ({ cacheName, asset }) => {
    const cache = await caches.open(cacheName);
    return Boolean(await cache.match(asset));
  }, { cacheName: OPENING_CACHE, asset: OPENING_ASSET })).toBe(true);

  await page.route('**/assets/portal-opening-v1.mp4*', (route) => route.abort());
  await page.reload();
  await submitSyntheticLogin(page);

  const video = page.locator('#portalOpeningVideo');
  await expect.poll(() => video.evaluate((element) => element.src.startsWith('blob:'))).toBe(true);
  await expect(page.locator('#portalOpeningStartWithSound')).toHaveCount(0);

  await video.evaluate((element) => element.dispatchEvent(new Event('ended')));
  await expect(page).toHaveURL(/\/opening\/complete\.html$/);
});

test('bloqueio excepcional de autoplay não cria botão adicional e cai para o loader/navegação', async ({ page }) => {
  await page.addInitScript(() => {
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function patchedPlay(...args) {
      if (this.id === 'portalOpeningVideo' && this.volume === 1 && !this.hidden) {
        return Promise.reject(new DOMException('Autoplay bloqueado para o teste', 'NotAllowedError'));
      }
      return originalPlay.apply(this, args);
    };
  });

  await page.goto('/opening/');
  const submit = await waitForLoginReady(page);
  await expect(page.locator('#portalOpeningStartWithSound')).toHaveCount(0);
  await submit.click();

  await expect(page).toHaveURL(/\/opening\/complete\.html$/);
  await expect(page.locator('#portalOpeningStartWithSound')).toHaveCount(0);
});

test('sem MP4 completo o botão de login permanece bloqueado e nenhuma abertura inicia', async ({ page }) => {
  await page.route('**/assets/portal-opening-v1.mp4*', (route) => route.abort());
  await page.goto('/opening/');

  const submit = page.locator('#loginSubmit');
  await expect(submit).toBeDisabled();
  await expect(submit).toHaveText('Preparando abertura...');
  await expect(page.locator('#loginStatus')).toContainText('ainda não terminou de carregar');
  await expect(page.locator('#portalOpening')).toHaveCount(0);
  expect(await page.evaluate(() => window.__LAB_LOGIN_CALLS__)).toBe(0);
});
