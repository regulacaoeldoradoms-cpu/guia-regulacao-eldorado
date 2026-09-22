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
      const layerRect = layer.getBoundingClientRect();
      const splitX = layerRect.left + (layerRect.width * .52);
      const lowerY = layerRect.top + (layerRect.height * .46);
      const words = Array.from(layer.querySelectorAll('[data-ocr-word="true"]'))
        .map((word) => ({ word, rect: word.getBoundingClientRect() }));

      const right = words.filter(({ rect }) => (
        rect.top >= lowerY
        && ((rect.left + rect.right) / 2) > splitX
      ));
      const left = words.filter(({ rect }) => (
        rect.top >= lowerY
        && ((rect.left + rect.right) / 2) < (layerRect.left + (layerRect.width * .45))
      ));
      if (right.length < 3 || left.length < 1) return null;

      right.sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
      const startWord = right[0];
      const minLeft = Math.min(...right.map(({ rect }) => rect.left));
      const maxRight = Math.max(...right.map(({ rect }) => rect.right));
      const maxBottom = Math.max(...right.map(({ rect }) => rect.bottom));

      return {
        total: words.length,
        splitX,
        start: {
          x: Math.max(startWord.rect.left + 1, minLeft + 1),
          y: startWord.rect.top + Math.max(1, startWord.rect.height * .5)
        },
        end: {
          x: maxRight - 1,
          y: maxBottom - 1
        }
      };
    });
    expect(drag).toBeTruthy();

    await page.mouse.move(drag.start.x, drag.start.y);
    await page.mouse.down();
    await page.mouse.move(drag.end.x, drag.end.y, { steps: 12 });
    await page.mouse.up();

    await expect(textLayer).toHaveAttribute('data-ocr-selection-mode', 'rectangle');
    const selectedWords = textLayer.locator('[data-ocr-word="true"].ocr-custom-selected');
    const selectedCount = await selectedWords.count();
    expect(selectedCount).toBeGreaterThan(0);
    expect(selectedCount).toBeLessThan(drag.total);

    const selectedGeometry = await selectedWords.evaluateAll((nodes, splitX) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { centerX: (rect.left + rect.right) / 2, text: node.dataset.ocrText || '' };
    }), drag.splitX);
    expect(selectedGeometry.every(({ centerX }) => centerX > drag.splitX)).toBe(true);

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
