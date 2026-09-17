import { expect, test } from '@playwright/test';

const OPENING_ASSET = '/assets/portal-opening-v1.mp4?v=20260917-1';
const OPENING_CACHE = 'portal-opening-media-v1';

async function waitForMetadata(page) {
  await page.locator('#portalOpeningVideo').evaluate((video) => new Promise((resolve, reject) => {
    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      resolve();
      return;
    }
    const timer = setTimeout(() => reject(new Error('metadata_timeout')), 10000);
    video.addEventListener('loadedmetadata', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
    video.addEventListener('error', () => {
      clearTimeout(timer);
      reject(new Error('media_error'));
    }, { once: true });
  }));
}

test('abertura oficial usa o MP4 real, tela inteira e áudio ativo', async ({ page }) => {
  await page.goto('/opening/index.html');
  const root = page.locator('#portalOpening');
  const video = page.locator('#portalOpeningVideo');

  await expect(root).toBeVisible();
  await waitForMetadata(page);

  const metadata = await video.evaluate((element) => ({
    duration: element.duration,
    muted: element.muted,
    defaultMuted: element.defaultMuted,
    volume: element.volume,
    src: element.currentSrc || element.src
  }));

  expect(metadata.duration).toBeGreaterThan(9.9);
  expect(metadata.duration).toBeLessThan(10.1);
  expect(metadata.muted).toBe(false);
  expect(metadata.defaultMuted).toBe(false);
  expect(metadata.volume).toBe(1);
  expect(metadata.src).toContain('/assets/portal-opening-v1.mp4');

  const box = await root.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(Math.abs(box.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.width - viewport.width)).toBeLessThanOrEqual(2);
  expect(Math.abs(box.height - viewport.height)).toBeLessThanOrEqual(2);

  await expect.poll(() => video.evaluate((element) => element.paused)).toBe(false);
});

test('segunda abertura usa a cópia local do Cache Storage mesmo sem rede para o MP4', async ({ page }) => {
  await page.goto('/opening/index.html');
  await waitForMetadata(page);

  await page.locator('#portalOpeningVideo').evaluate((video) => {
    video.dispatchEvent(new Event('ended'));
  });

  await expect.poll(() => page.evaluate(async ({ cacheName, asset }) => {
    const cache = await caches.open(cacheName);
    return Boolean(await cache.match(asset));
  }, { cacheName: OPENING_CACHE, asset: OPENING_ASSET })).toBe(true);

  await page.route('**/assets/portal-opening-v1.mp4*', (route) => route.abort());
  await page.reload();

  const video = page.locator('#portalOpeningVideo');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((element) => element.src.startsWith('blob:'))).toBe(true);
  await expect(page.locator('#portalOpening')).toBeVisible();
});

test('bloqueio de autoplay com som exibe gesto explícito sem silenciar o vídeo', async ({ page }) => {
  await page.addInitScript(() => {
    const originalPlay = HTMLMediaElement.prototype.play;
    let firstAttempt = true;
    HTMLMediaElement.prototype.play = function patchedPlay(...args) {
      if (firstAttempt) {
        firstAttempt = false;
        return Promise.reject(new DOMException('Autoplay bloqueado para o teste', 'NotAllowedError'));
      }
      return originalPlay.apply(this, args);
    };
  });

  await page.goto('/opening/index.html');
  const gate = page.locator('#portalOpeningSoundGate');
  const button = page.locator('#portalOpeningStartWithSound');
  const video = page.locator('#portalOpeningVideo');

  await expect(gate).toBeVisible();
  await expect(button).toBeVisible();
  expect(await video.evaluate((element) => element.muted)).toBe(false);

  await button.click();
  await expect(gate).toBeHidden();
  expect(await video.evaluate((element) => element.muted)).toBe(false);
});

test('falha da mídia remove a abertura e devolve a experiência ao loader legado', async ({ page }) => {
  await page.route('**/assets/portal-opening-v1.mp4*', (route) => route.abort());
  await page.goto('/opening/index.html');

  await expect(page.locator('#portalOpening')).toHaveCount(0, { timeout: 10000 });
  await expect(page.locator('#homeLoading')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.classList.contains('portal-opening-active'))).toBe(false);
});
