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

async function drawCropSelection(page, layer, start = { x: .18, y: .16 }, end = { x: .76, y: .68 }) {
  await layer.scrollIntoViewIfNeeded();
  await expect(layer).toBeVisible();
  const box = await layer.boundingBox();
  expect(box).not.toBeNull();

  const from = {
    x: box.x + box.width * start.x,
    y: box.y + box.height * start.y
  };
  const to = {
    x: box.x + box.width * end.x,
    y: box.y + box.height * end.y
  };

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-gesture', 'create');
  await page.mouse.move(to.x, to.y, { steps: 8 });
  await page.mouse.up();
}

test.describe('Central de Documentos — 3C.4 Recortar', () => {
  test('não recorta por padrão; cria uma única seleção por página com preview, histórico e semântica por pageId', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await page.locator('#editorCrop').click();

    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-editor-workspace-mode', 'crop');
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-mode', 'crop');

    const layer = page.locator('.portal-pdf-crop-layer').first();
    await expect(layer).toHaveCSS('pointer-events', 'auto');
    await expect(layer).toHaveAttribute('data-has-crop', 'false');
    await expect(layer).toHaveAttribute('data-awaiting-selection', 'true');
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');
    expect(parseCrop(await page.locator('html').getAttribute('data-page-crops'))).toBeNull();

    // The first deliberate drag creates the only crop selection for this page.
    await drawCropSelection(page, layer);
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-count', '1');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');

    const frame = layer.locator('[data-crop-frame]');
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute('data-committed', 'true');
    await expect(layer).toHaveAttribute('data-has-crop', 'true');
    await expect(layer).toHaveAttribute('data-awaiting-selection', 'false');

    const initialCrop = parseCrop(await page.locator('html').getAttribute('data-page-crops'));
    expect(initialCrop.width).toBeLessThan(.7);
    expect(initialCrop.height).toBeLessThan(.65);

    // A second drag outside the existing frame cannot create another crop.
    const pageBox = await layer.boundingBox();
    expect(pageBox).not.toBeNull();
    const beforeSecondAttempt = await page.locator('html').getAttribute('data-page-crops');
    await page.mouse.move(pageBox.x + 4, pageBox.y + 4);
    await page.mouse.down();
    await page.mouse.move(pageBox.x + pageBox.width * .12, pageBox.y + pageBox.height * .12, { steps: 4 });
    await page.mouse.up();
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    expect(await page.locator('html').getAttribute('data-page-crops')).toBe(beforeSecondAttempt);
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(1);

    // Existing selection remains editable by its handles.
    const handle = frame.locator('[data-crop-resize="se"]');
    await handle.scrollIntoViewIfNeeded();
    await expect(handle).toBeVisible();
    await handle.hover();
    const handleBox = await handle.boundingBox();
    expect(handleBox).not.toBeNull();
    await page.mouse.down();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-gesture', 'resize');
    await page.mouse.move(handleBox.x - 54, handleBox.y - 66, { steps: 7 });
    await page.mouse.up();

    const resizedCrop = parseCrop(await page.locator('html').getAttribute('data-page-crops'));
    expect(resizedCrop.width).toBeLessThan(initialCrop.width);
    expect(resizedCrop.height).toBeLessThan(initialCrop.height);

    // First undo reverts resize; second undo removes the selection entirely.
    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    expectCropClose(parseCrop(await page.locator('html').getAttribute('data-page-crops')), initialCrop);

    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');
    expect(parseCrop(await page.locator('html').getAttribute('data-page-crops'))).toBeNull();

    await page.locator('#editorRedo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    expectCropClose(parseCrop(await page.locator('html').getAttribute('data-page-crops')), initialCrop);

    await page.locator('#editorRedo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    expectCropClose(parseCrop(await page.locator('html').getAttribute('data-page-crops')), resizedCrop);

    // Leaving crop mode keeps one non-interactive visual preview.
    await page.locator('#editorSelect').click();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-mode', 'none');
    await expect(layer).toHaveCSS('pointer-events', 'none');
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(1);
    await expect(layer.locator('[data-crop-frame]')).toHaveAttribute('data-interactive', 'false');

    // Rotation transforms the normalized crop with the page through all four orientations.
    await page.locator('#editorOrganize').click();
    let expected = resizedCrop;
    for (const rotation of [90, 180, 270, 0]) {
      await organizerAction(page, 0, 'rotate-right');
      expected = rotatedRight(expected);
      const crop = parseCrop(await page.locator('html').getAttribute('data-page-crops'));
      expectCropClose(crop, expected);
      const rotations = (await page.locator('html').getAttribute('data-page-rotations')).split(',');
      expect(Number(rotations[0])).toBe(rotation);
    }

    // Duplicate clones the single crop onto the new pageId; deleting original preserves the clone.
    await organizerAction(page, 0, 'duplicate');
    const duplicated = (await page.locator('html').getAttribute('data-page-crops')).split(',');
    expect(duplicated[0]).not.toBe('full');
    expect(duplicated[1]).toBe(duplicated[0]);
    await organizerAction(page, 0, 'delete');
    const afterDelete = (await page.locator('html').getAttribute('data-page-crops')).split(',');
    expect(afterDelete[0]).toBe(duplicated[1]);

    expect(errors).toEqual([]);
  });

  test('CropBox não padrão começa inteiro, aceita seleção explícita e acompanha reordenação da página', async ({ page }) => {
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

    const layer = page.locator('.portal-pdf-crop-layer').nth(1);
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(0);
    await expect(layer).toHaveAttribute('data-has-crop', 'false');

    await drawCropSelection(page, layer, { x: .14, y: .18 }, { x: .72, y: .7 });
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(1);

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

  test('touch cria a única área de recorte no perfil mobile', async ({ page, context, isMobile }) => {
    test.skip(!isMobile, 'Gesto touch específico validado no perfil mobile.');
    await openEditor(page);
    await page.locator('#editorCrop').click();

    const layer = page.locator('.portal-pdf-crop-layer').first();
    await layer.scrollIntoViewIfNeeded();
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(0);
    const box = await layer.boundingBox();
    expect(box).not.toBeNull();

    const start = { x: box.x + box.width * .18, y: box.y + box.height * .16 };
    const end = { x: box.x + box.width * .7, y: box.y + box.height * .62 };
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start.x, y: start.y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: end.x, y: end.y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(1);
    const crop = parseCrop(await page.locator('html').getAttribute('data-page-crops'));
    expect(crop.width).toBeLessThan(.65);
    expect(crop.height).toBeLessThan(.6);
  });
});
