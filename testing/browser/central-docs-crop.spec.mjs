import { test, expect } from '@playwright/test';

async function openEditor(page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-viewer-state', 'ready');
  await page.locator('#enterEditor').click();
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
}

async function organizerAction(page, index, action) {
  await page.locator('#thumbnails .portal-pdf-thumb').nth(index).click();
  await page.locator('#thumbnails .portal-pdf-thumb-wrap').nth(index)
    .locator(`[data-thumbnail-action="${action}"]`).click();
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
}

function parseCrop(serialized, index = 0) {
  const item = String(serialized || '').split(',')[index];
  if (!item || item === 'full') return null;
  const [x, y, width, height] = item.split(':').map(Number);
  return { x, y, width, height };
}

function rotatedRight(rect) {
  return {
    x: 1 - (rect.y + rect.height),
    y: rect.x,
    width: rect.height,
    height: rect.width
  };
}

function expectCropClose(actual, expected, precision = 3) {
  expect(actual).not.toBeNull();
  expect(actual.x).toBeCloseTo(expected.x, precision);
  expect(actual.y).toBeCloseTo(expected.y, precision);
  expect(actual.width).toBeCloseTo(expected.width, precision);
  expect(actual.height).toBeCloseTo(expected.height, precision);
}

test.describe('Central de Documentos — 3C.4 Recortar', () => {
  test('moldura recorta com preview imediato, histórico e semântica por pageId', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await page.locator('#editorCrop').click();

    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-editor-workspace-mode', 'crop');
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-mode', 'crop');

    const layer = page.locator('.portal-pdf-crop-layer').first();
    await expect(layer).toHaveCSS('pointer-events', 'auto');
    const frame = layer.locator('[data-crop-frame]');
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute('data-committed', 'false');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');

    const handle = frame.locator('[data-crop-resize="se"]');
    await handle.scrollIntoViewIfNeeded();
    await expect(handle).toBeVisible();
    await handle.hover();
    const box = await handle.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.down();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-gesture', 'resize');
    await page.mouse.move(box.x - 74, box.y - 96, { steps: 7 });
    await page.mouse.up();

    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-count', '1');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    await expect(frame).toHaveAttribute('data-committed', 'true');
    const initialCrop = parseCrop(await page.locator('html').getAttribute('data-page-crops'));
    expect(initialCrop.width).toBeLessThan(.92);
    expect(initialCrop.height).toBeLessThan(.92);

    // Leaving crop mode keeps a non-interactive visual preview.
    await page.locator('#editorSelect').click();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-mode', 'none');
    await expect(layer).toHaveCSS('pointer-events', 'none');
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(1);
    await expect(layer.locator('[data-crop-frame]')).toHaveAttribute('data-interactive', 'false');

    // Undo/Redo restore exactly the page crop.
    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');
    expect(parseCrop(await page.locator('html').getAttribute('data-page-crops'))).toBeNull();

    await page.locator('#editorRedo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    expectCropClose(parseCrop(await page.locator('html').getAttribute('data-page-crops')), initialCrop);

    // Rotation transforms the normalized crop with the page through all four orientations.
    await page.locator('#editorOrganize').click();
    let expected = initialCrop;
    for (const rotation of [90, 180, 270, 0]) {
      await organizerAction(page, 0, 'rotate-right');
      expected = rotatedRight(expected);
      const crop = parseCrop(await page.locator('html').getAttribute('data-page-crops'));
      expectCropClose(crop, expected);
      const rotations = (await page.locator('html').getAttribute('data-page-rotations')).split(',');
      expect(Number(rotations[0])).toBe(rotation);
    }

    // Duplicate clones the crop onto a new pageId; deleting the original leaves the clone intact.
    await organizerAction(page, 0, 'duplicate');
    const duplicated = (await page.locator('html').getAttribute('data-page-crops')).split(',');
    expect(duplicated[0]).not.toBe('full');
    expect(duplicated[1]).toBe(duplicated[0]);
    await organizerAction(page, 0, 'delete');
    const afterDelete = (await page.locator('html').getAttribute('data-page-crops')).split(',');
    expect(afterDelete[0]).toBe(duplicated[1]);

    expect(errors).toEqual([]);
  });

  test('CropBox não padrão usa a superfície visível e acompanha reordenação da página', async ({ page }) => {
    await openEditor(page);
    await page.locator('#editorCrop').click();

    // Page 2 has MediaBox 842×595 but a deliberately different CropBox 642×435.
    // PDF.js must expose the CropBox viewport to the same normalized crop overlay.
    const pageTwo = page.locator('.portal-pdf-page').nth(1);
    await pageTwo.scrollIntoViewIfNeeded();
    await expect(pageTwo).toHaveClass(/rendered/);
    const pageBox = await pageTwo.boundingBox();
    expect(pageBox).not.toBeNull();
    expect(pageBox.width / pageBox.height).toBeGreaterThan(1.45);
    expect(pageBox.width / pageBox.height).toBeLessThan(1.50);

    const frame = page.locator('.portal-pdf-crop-layer').nth(1).locator('[data-crop-frame]');
    await expect(frame).toBeVisible();
    const handle = frame.locator('[data-crop-resize="se"]');
    await handle.scrollIntoViewIfNeeded();
    await expect(handle).toBeVisible();
    await handle.hover();
    const handleBox = await handle.boundingBox();
    expect(handleBox).not.toBeNull();

    await page.mouse.down();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-gesture', 'resize');
    await page.mouse.move(handleBox.x - 62, handleBox.y - 52, { steps: 6 });
    await page.mouse.up();
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');

    const beforeReorder = (await page.locator('html').getAttribute('data-page-crops')).split(',');
    expect(beforeReorder[0]).toBe('full');
    expect(beforeReorder[1]).not.toBe('full');
    const cropToken = beforeReorder[1];

    await page.locator('#editorOrganize').click();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-organizer-mode', 'true');

    const cards = page.locator('#thumbnails .portal-pdf-thumb');
    await cards.nth(1).scrollIntoViewIfNeeded();
    await expect(cards.nth(1)).toHaveClass(/rendered/);
    const source = await cards.nth(1).boundingBox();
    const start = { x: source.x + source.width * .4, y: source.y + source.height * .55 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 14, start.y, { steps: 3 });
    await expect(page.locator('.portal-pdf-drag-ghost')).toBeVisible();
    const target = await cards.nth(0).boundingBox();
    await page.mouse.move(target.x + 12, target.y + target.height * .6, { steps: 6 });
    await page.mouse.up();

    await expect(page.locator('html')).toHaveAttribute('data-page-order', '0:1,0:0,0:2');
    const afterReorder = (await page.locator('html').getAttribute('data-page-crops')).split(',');
    expect(afterReorder[0]).toBe(cropToken);
    expect(afterReorder[1]).toBe('full');
  });

  test('touch move a alça de recorte no perfil mobile', async ({ page, context, isMobile }) => {
    test.skip(!isMobile, 'Gesto touch específico validado no perfil mobile.');
    await openEditor(page);
    await page.locator('#editorCrop').click();

    const frame = page.locator('.portal-pdf-crop-frame').first();
    await frame.scrollIntoViewIfNeeded();
    const handle = frame.locator('[data-crop-resize="se"]');
    await expect(handle).toBeVisible();
    const box = await handle.boundingBox();
    expect(box).not.toBeNull();
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const end = { x: start.x - 56, y: start.y - 72 };
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start.x, y: start.y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: end.x, y: end.y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    const crop = parseCrop(await page.locator('html').getAttribute('data-page-crops'));
    expect(crop.width).toBeLessThan(.92);
    expect(crop.height).toBeLessThan(.92);
  });
});
