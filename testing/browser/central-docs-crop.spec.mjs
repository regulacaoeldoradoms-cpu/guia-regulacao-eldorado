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
  return { x: 1 - (rect.y + rect.height), y: rect.x, width: rect.height, height: rect.width };
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
  const box = await layer.boundingBox();
  expect(box).not.toBeNull();
  const from = { x: box.x + box.width * start.x, y: box.y + box.height * start.y };
  const to = { x: box.x + box.width * end.x, y: box.y + box.height * end.y };
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-crop-gesture', 'create');
  await page.mouse.move(to.x, to.y, { steps: 8 });
  await page.mouse.up();
}

test.describe('Central de Documentos — 3C.4 Recortar', () => {
  test('seleção é provisória; cancelar não altera histórico e confirmar aplica o viewport recortado', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await page.locator('#editorCrop').click();

    const root = page.locator('#pdfRoot');
    const layer = page.locator('.portal-pdf-crop-layer').first();
    const article = page.locator('.portal-pdf-page').first();
    const fullBox = await article.boundingBox();
    expect(fullBox).not.toBeNull();

    await expect(layer.locator('[data-crop-frame]')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');

    await drawCropSelection(page, layer);
    await expect(layer).toHaveAttribute('data-has-draft', 'true');
    await expect(root).toHaveAttribute('data-crop-draft-count', '1');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');
    expect(parseCrop(await page.locator('html').getAttribute('data-page-crops'))).toBeNull();

    const frame = layer.locator('[data-crop-frame]');
    await expect(frame.locator('[data-crop-confirm]')).toBeVisible();
    await expect(frame.locator('[data-crop-cancel]')).toBeVisible();

    await frame.locator('[data-crop-cancel]').click();
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(0);
    await expect(root).toHaveAttribute('data-crop-draft-count', '0');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');
    expect(parseCrop(await page.locator('html').getAttribute('data-page-crops'))).toBeNull();
    await expect(article).toHaveAttribute('data-crop-applied', 'false');

    await drawCropSelection(page, layer);
    const draftFrame = layer.locator('[data-crop-frame]');
    const draftRect = {
      x: Number(await draftFrame.getAttribute('data-crop-x')),
      y: Number(await draftFrame.getAttribute('data-crop-y')),
      width: Number(await draftFrame.getAttribute('data-crop-width')),
      height: Number(await draftFrame.getAttribute('data-crop-height'))
    };
    await draftFrame.locator('[data-crop-confirm]').click();

    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    await expect(root).toHaveAttribute('data-crop-draft-count', '0');
    const committed = parseCrop(await page.locator('html').getAttribute('data-page-crops'));
    expectCropClose(committed, draftRect);
    await expect(article).toHaveAttribute('data-crop-applied', 'true');
    const croppedBox = await article.boundingBox();
    expect(croppedBox.width).toBeLessThan(fullBox.width * .8);
    expect(croppedBox.height).toBeLessThan(fullBox.height * .8);
    await expect(layer.locator('[data-crop-frame]')).toHaveCount(0);
    await expect(layer.locator('[data-crop-adjust]')).toBeVisible();
    await expect(layer.locator('[data-crop-reset]')).toBeVisible();

    await layer.locator('[data-crop-adjust]').click();
    await expect(article).toHaveAttribute('data-crop-applied', 'false');
    const editFrame = layer.locator('[data-crop-frame]');
    const handle = editFrame.locator('[data-crop-resize="se"]');
    await handle.hover();
    const handleBox = await handle.boundingBox();
    expect(handleBox).not.toBeNull();
    await page.mouse.down();
    await page.mouse.move(handleBox.x - 45, handleBox.y - 52, { steps: 6 });
    await page.mouse.up();
    await editFrame.locator('[data-crop-cancel]').click();
    await expect(article).toHaveAttribute('data-crop-applied', 'true');
    expectCropClose(parseCrop(await page.locator('html').getAttribute('data-page-crops')), committed);

    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');

    await page.locator('#editorRedo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    expectCropClose(parseCrop(await page.locator('html').getAttribute('data-page-crops')), committed);

    expect(errors).toEqual([]);
  });

  test('crop confirmado acompanha CropBox, reordenação e rotações', async ({ page }) => {
    await openEditor(page);
    await page.locator('#editorCrop').click();

    const pageTwo = page.locator('.portal-pdf-page').nth(1);
    await pageTwo.scrollIntoViewIfNeeded();
    await expect(pageTwo).toHaveClass(/rendered/);
    const layer = page.locator('.portal-pdf-crop-layer').nth(1);

    await drawCropSelection(page, layer, { x: .14, y: .18 }, { x: .72, y: .7 });
    await layer.locator('[data-crop-confirm]').click();
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');

    const beforeReorder = (await page.locator('html').getAttribute('data-page-crops')).split(',');
    expect(beforeReorder[0]).toBe('full');
    expect(beforeReorder[1]).not.toBe('full');
    const cropToken = beforeReorder[1];

    await page.locator('#editorOrganize').click();
    const cards = page.locator('#thumbnails .portal-pdf-thumb');
    await cards.nth(1).scrollIntoViewIfNeeded();
    const source = await cards.nth(1).boundingBox();
    const start = { x: source.x + source.width * .4, y: source.y + source.height * .55 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 14, start.y, { steps: 3 });
    await expect(page.locator('.portal-pdf-drag-ghost')).toBeVisible();
    const target = await cards.nth(0).boundingBox();
    await page.mouse.move(target.x + 12, target.y + target.height * .6, { steps: 6 });
    await page.mouse.up();

    const afterReorder = (await page.locator('html').getAttribute('data-page-crops')).split(',');
    expect(afterReorder[0]).toBe(cropToken);
    expect(afterReorder[1]).toBe('full');

    let expected = parseCrop(cropToken);
    for (const rotation of [90, 180, 270, 0]) {
      await organizerAction(page, 0, 'rotate-right');
      expected = rotatedRight(expected);
      expectCropClose(parseCrop(await page.locator('html').getAttribute('data-page-crops')), expected);
      const rotations = (await page.locator('html').getAttribute('data-page-rotations')).split(',');
      expect(Number(rotations[0])).toBe(rotation);
    }
  });

  test('touch cria draft e só confirma após toque no botão', async ({ page, context, isMobile }) => {
    test.skip(!isMobile, 'Gesto touch específico validado no perfil mobile.');
    await openEditor(page);
    await page.locator('#editorCrop').click();

    const root = page.locator('#pdfRoot');
    const layer = page.locator('.portal-pdf-crop-layer').first();
    await layer.scrollIntoViewIfNeeded();
    const box = await layer.boundingBox();
    expect(box).not.toBeNull();

    const start = { x: box.x + box.width * .18, y: box.y + box.height * .16 };
    const end = { x: box.x + box.width * .7, y: box.y + box.height * .62 };
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start.x, y: start.y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: end.x, y: end.y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

    await expect(root).toHaveAttribute('data-crop-draft-count', '1');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '0');
    await layer.locator('[data-crop-confirm]').tap();
    await expect(root).toHaveAttribute('data-crop-draft-count', '0');
    await expect(page.locator('html')).toHaveAttribute('data-crop-count', '1');
    await expect(page.locator('.portal-pdf-page').first()).toHaveAttribute('data-crop-applied', 'true');
  });
});
