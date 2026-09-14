import { test, expect } from '@playwright/test';

test.describe('Central de Documentos — visualizador PDF.js', () => {
  test('renderiza página 1, miniatura, navegação e zoom com PDF sintético', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(String(error?.message || error)));

    await page.goto('/testing/central-docs/viewer-harness.html');

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
    await page.locator('#zoomIn').click();
    await expect(page.locator('#zoomReset')).not.toHaveText(initialZoom || '');
    await page.locator('#fitWidth').click();
    await expect(page.locator('#zoomReset')).toContainText('%');

    await page.locator('.portal-pdf-thumb').nth(1).click();
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');

    expect(consoleErrors).toEqual([]);
  });
});
