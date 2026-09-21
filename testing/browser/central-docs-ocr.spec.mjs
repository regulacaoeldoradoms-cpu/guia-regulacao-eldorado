import { test, expect } from '@playwright/test';

test.describe('Central de Documentos — OCR local de PDF digitalizado', () => {
  test('transforma scan sem texto nativo em camada selecionável sem tráfego externo', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Matriz OCR pesada é validada uma vez em Chromium desktop.');
    test.setTimeout(90_000);

    const externalRequests = [];
    page.on('request', (request) => {
      try {
        const url = new URL(request.url());
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
            externalRequests.push(request.url());
          }
        }
      } catch (_) {}
    });

    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(String(error?.message || error)));

    await page.goto('/testing/central-docs/viewer-harness.html?source=scan');
    await expect(page.locator('#labStatus')).toHaveAttribute('data-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-source-mode', 'scan');

    const firstPage = page.locator('.portal-pdf-page').first();
    await expect(firstPage).toHaveClass(/rendered/);
    await expect(firstPage).toHaveAttribute('data-selectable-text', 'ocr', { timeout: 60_000 });
    await expect(firstPage).toHaveAttribute('data-ocr-state', 'ready');

    const ocrLines = firstPage.locator('.portal-pdf-text-layer [data-ocr-line="true"]');
    await expect(ocrLines.first()).toBeAttached();
    expect(await ocrLines.count()).toBeGreaterThan(0);

    const recognizedText = (await ocrLines.allTextContents()).join(' ');
    expect(recognizedText).toMatch(/OCR/i);
    expect(recognizedText).toMatch(/TITON/i);

    const selectionText = await firstPage.locator('.portal-pdf-text-layer').evaluate((layer) => {
      const target = layer.querySelector('[data-ocr-line="true"]');
      if (!target) return '';
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      return selection.toString();
    });
    expect(selectionText.trim().length).toBeGreaterThan(3);

    await expect(firstPage.locator('.portal-pdf-text-layer')).toHaveCSS('cursor', 'text');

    const zoomBefore = (await page.locator('#zoomReset').textContent()) || '';
    await page.locator('#zoomIn').click();
    await expect(page.locator('#zoomReset')).not.toHaveText(zoomBefore);
    await expect(firstPage).toHaveAttribute('data-selectable-text', 'ocr', { timeout: 10_000 });
    await expect(firstPage.locator('.portal-pdf-text-layer [data-ocr-line="true"]').first()).toBeAttached();

    expect(externalRequests).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
