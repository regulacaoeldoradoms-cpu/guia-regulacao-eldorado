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

    const ocrWords = firstPage.locator('.portal-pdf-text-layer [data-ocr-word="true"]');
    await expect(ocrWords.first()).toBeAttached();
    expect(await ocrWords.count()).toBeGreaterThan(1);

    const recognizedText = (await ocrWords.allTextContents()).join(' ');
    expect(recognizedText).toMatch(/OCR/i);
    expect(recognizedText).toMatch(/TITON/i);

    const firstWordGroup = await ocrWords.first().getAttribute('data-ocr-group');
    expect(firstWordGroup).toBeTruthy();
    await ocrWords.first().dispatchEvent('pointerdown', { bubbles: true, pointerId: 1, pointerType: 'mouse' });
    await expect(firstPage.locator('.portal-pdf-text-layer')).toHaveAttribute('data-ocr-selection-group', firstWordGroup);

    const selectionText = await firstPage.locator('.portal-pdf-text-layer').evaluate((layer) => {
      const target = layer.querySelector('[data-ocr-word="true"]');
      if (!target) return '';
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      return selection.toString();
    });
    expect(selectionText.trim().length).toBeGreaterThan(1);
    expect(selectionText.trim().split(/\s+/).length).toBeLessThanOrEqual(2);

    await expect(firstPage.locator('.portal-pdf-text-layer')).toHaveCSS('cursor', 'text');

    const zoomBefore = (await page.locator('#zoomReset').textContent()) || '';
    await page.locator('#zoomIn').click();
    await expect(page.locator('#zoomReset')).not.toHaveText(zoomBefore);
    await expect(firstPage).toHaveAttribute('data-selectable-text', 'ocr', { timeout: 10_000 });
    await expect(firstPage.locator('.portal-pdf-text-layer [data-ocr-word="true"]').first()).toBeAttached();

    expect(externalRequests).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
