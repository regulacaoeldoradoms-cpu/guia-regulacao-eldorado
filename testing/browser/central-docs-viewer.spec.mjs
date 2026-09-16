import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureSource = fs.readFileSync(path.resolve(here, '../central-docs/fixture.js'), 'utf8');
const fixtureBase64 = fixtureSource.match(/const BASE64 = "([^"]+)"/)?.[1] || '';
const fixtureBytes = Buffer.from(fixtureBase64, 'base64');

async function assertViewer(page, url) {
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error?.message || error)));

  await page.goto(url);

  await expect(page.locator('#labStatus')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('html')).toHaveAttribute('data-page-count', '3');
  await expect(page.locator('.portal-pdf-page')).toHaveCount(3);
  await expect(page.locator('.portal-pdf-thumb')).toHaveCount(3);

  const firstPage = page.locator('.portal-pdf-page').first();
  const firstThumb = page.locator('.portal-pdf-thumb').first();
  await expect(firstPage).toHaveClass(/rendered/);
  await expect(firstThumb).toHaveClass(/rendered/);

  const mainCanvasSize = await firstPage.locator('canvas').evaluate((canvas) => ({
    width: canvas.width,
    height: canvas.height
  }));
  const thumbCanvasSize = await firstThumb.locator('canvas').evaluate((canvas) => ({
    width: canvas.width,
    height: canvas.height
  }));
  expect(mainCanvasSize.width).toBeGreaterThan(10);
  expect(mainCanvasSize.height).toBeGreaterThan(10);
  expect(thumbCanvasSize.width).toBeGreaterThan(10);
  expect(thumbCanvasSize.height).toBeGreaterThan(10);

  await expect(page.locator('html')).toHaveAttribute('data-first-page-visible', 'true');

  const initialZoom = await page.locator('#zoomReset').textContent();
  const viewport = page.viewportSize();
  if (viewport.width > 720) {
    expect((initialZoom || '').trim()).toBe('114%');
  } else {
    expect(Number.parseInt(initialZoom || '0', 10)).toBeLessThanOrEqual(114);
  }
  await page.locator('#zoomIn').click();
  await expect(page.locator('#zoomReset')).not.toHaveText(initialZoom || '');
  await page.locator('#fitWidth').click();
  await expect(page.locator('#zoomReset')).toContainText('%');

  await page.locator('.portal-pdf-thumb').nth(1).click();
  await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');

  expect(consoleErrors).toEqual([]);
}

test.describe('Central de Documentos — visualizador PDF.js', () => {
  test('renderiza fonte Blob sintética', async ({ page }) => {
    await assertViewer(page, '/testing/central-docs/viewer-harness.html');
    await expect(page.locator('html')).toHaveAttribute('data-source-mode', 'blob');
  });

  test('renderiza fonte URL sintética', async ({ page }) => {
    expect(fixtureBytes.length).toBeGreaterThan(100);
    await page.route('**/testing/central-docs/_fixture.pdf', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        headers: {
          'Cache-Control': 'no-store',
          'Accept-Ranges': 'bytes'
        },
        body: fixtureBytes
      });
    });

    await assertViewer(page, '/testing/central-docs/viewer-harness.html?source=url');
    await expect(page.locator('html')).toHaveAttribute('data-source-mode', 'url');
  });
});
