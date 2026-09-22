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

    const textLayer = firstPage.locator('.portal-pdf-text-layer');
    const drag = await textLayer.evaluate((layer) => {
      const words = Array.from(layer.querySelectorAll('[data-ocr-word="true"]'));
      const groups = new Map();
      for (const word of words) {
        const key = word.dataset.ocrGroup || '';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(word);
      }
      const candidates = Array.from(groups.entries()).find(([, items]) => items.length >= 2)
        || Array.from(groups.entries())[0];
      if (!candidates) return null;
      const [groupId, items] = candidates;
      const start = items[0];
      const end = items[Math.min(1, items.length - 1)];
      const a = start.getBoundingClientRect();
      const b = end.getBoundingClientRect();
      return {
        groupId,
        total: words.length,
        start: { x: a.left + Math.max(1, a.width * .35), y: a.top + Math.max(1, a.height * .5) },
        end: { x: b.left + Math.max(1, b.width * .65), y: b.top + Math.max(1, b.height * .5) }
      };
    });
    expect(drag).toBeTruthy();

    await page.mouse.move(drag.start.x, drag.start.y);
    await page.mouse.down();
    await page.mouse.move(drag.end.x, drag.end.y, { steps: 8 });
    await page.mouse.up();

    await expect(textLayer).toHaveAttribute('data-ocr-selection-group', drag.groupId);
    const selectedWords = textLayer.locator('[data-ocr-word="true"].ocr-custom-selected');
    const selectedCount = await selectedWords.count();
    expect(selectedCount).toBeGreaterThan(0);
    expect(selectedCount).toBeLessThan(drag.total);

    const selectionText = await page.evaluate(() => window.getSelection()?.toString() || '');
    expect(selectionText.trim().length).toBeGreaterThan(1);
    expect(selectionText.trim().length).toBeLessThan(recognizedText.trim().length);

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
