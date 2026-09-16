import { test, expect } from '@playwright/test';

async function openEditor(page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-viewer-state', 'ready');
  await page.locator('#enterEditor').click();
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
  await page.locator('#editorDraw').click();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-draw-mode', 'draw');
}

async function visibleGesturePoints(page, layer, start, end) {
  await layer.scrollIntoViewIfNeeded();
  const box = await layer.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize() || { width: 1280, height: 900 };
  const inset = 18;
  const left = Math.max(box.x + inset, inset);
  const right = Math.min(box.x + box.width - inset, viewport.width - inset);
  const top = Math.max(box.y + inset, inset);
  const bottom = Math.min(box.y + box.height - inset, viewport.height - inset);
  expect(right - left).toBeGreaterThan(80);
  expect(bottom - top).toBeGreaterThan(80);
  return {
    box,
    from: { x: left + (right - left) * start.x, y: top + (bottom - top) * start.y },
    to: { x: left + (right - left) * end.x, y: top + (bottom - top) * end.y }
  };
}

async function drawGesture(page, pageIndex, start, end) {
  const layer = page.locator('.portal-pdf-draw-layer').nth(pageIndex);
  const { box, from, to } = await visibleGesturePoints(page, layer, start, end);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-draw-gesture', 'draw');
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await page.mouse.up();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-draw-gesture', '');
  return { layer, box, from, to };
}

async function eraseGesture(page, pageIndex, start, end) {
  // A borracha é uma subferramenta de Desenhar. Se o teste veio de Escrever,
  // reabre primeiro o modo Desenhar para tornar os controles contextuais visíveis.
  await page.locator('#editorDraw').click();
  await page.locator('#editorDrawEraser').click();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-draw-mode', 'erase');
  const layer = page.locator('.portal-pdf-draw-layer').nth(pageIndex);
  const { from, to } = await visibleGesturePoints(page, layer, start, end);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-draw-gesture', 'erase');
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await page.mouse.up();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-draw-gesture', '');
}

async function organizerAction(page, index, action) {
  await page.locator('#editorOrganize').click();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-organizer-mode', 'true');
  await page.locator('#thumbnails .portal-pdf-thumb').nth(index).click();
  await page.locator('#thumbnails .portal-pdf-thumb-wrap').nth(index)
    .locator(`[data-thumbnail-action="${action}"]`).click();
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
}

test.describe('Central de Documentos — 3C.5 Desenhar/Borracha', () => {
  test('caneta preserva cor/espessura, histórico por gesto e borracha remove somente traços', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await expect(page.locator('#editorDrawToolbar')).toBeVisible();

    await page.locator('#editorDrawColor').evaluate((node) => {
      node.value = '#e53935';
      node.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.locator('#editorDrawWidth').evaluate((node) => {
      node.value = '10';
      node.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await drawGesture(page, 0, { x: .18, y: .24 }, { x: .62, y: .30 });
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '1');

    let paths = page.locator('.portal-pdf-draw-layer').first().locator('[data-stroke-id]');
    await expect(paths).toHaveCount(1);
    await expect(paths.first()).toHaveAttribute('stroke', '#e53935');
    const strokeWidth = Number(await paths.first().getAttribute('stroke-width'));
    expect(strokeWidth).toBeGreaterThan(10);

    await drawGesture(page, 0, { x: .20, y: .70 }, { x: .72, y: .76 });
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '2');

    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '1');

    await page.locator('#editorRedo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '2');

    // Cria um objeto de texto para comprovar que a borracha não toca em outras ferramentas.
    await page.locator('#editorWrite').click();
    const objectLayer = page.locator('.portal-pdf-object-layer').first();
    await objectLayer.scrollIntoViewIfNeeded();
    const objectBox = await objectLayer.boundingBox();
    expect(objectBox).not.toBeNull();
    await page.mouse.click(objectBox.x + objectBox.width * .35, objectBox.y + objectBox.height * .28);
    await expect(page.locator('html')).toHaveAttribute('data-object-count', '1');

    await eraseGesture(page, 0, { x: .17, y: .25 }, { x: .64, y: .30 });
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '1');
    await expect(page.locator('html')).toHaveAttribute('data-object-count', '1');
    expect(await page.locator('.portal-pdf-page-canvas').first().evaluate((canvas) => canvas.width > 0 && canvas.height > 0)).toBe(true);

    // A exclusão pela borracha é uma única mutação reversível.
    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '2');
    await expect(page.locator('html')).toHaveAttribute('data-object-count', '1');

    await page.locator('#editorRedo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '1');

    expect(errors).toEqual([]);
  });

  test('traço acompanha rotação, duplicação e exclusão por pageId', async ({ page }) => {
    await openEditor(page);
    await drawGesture(page, 0, { x: .22, y: .22 }, { x: .55, y: .46 });
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '1');

    const beforePath = await page.locator('.portal-pdf-draw-layer').first().locator('[data-stroke-id]').getAttribute('d');
    expect(beforePath).toBeTruthy();

    await organizerAction(page, 0, 'rotate-right');
    await page.locator('#editorDraw').click();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-draw-mode', 'draw');
    const afterPath = await page.locator('.portal-pdf-draw-layer').first().locator('[data-stroke-id]').getAttribute('d');
    expect(afterPath).toBeTruthy();
    expect(afterPath).not.toBe(beforePath);

    await organizerAction(page, 0, 'duplicate');
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '2');
    const ids = String(await page.locator('html').getAttribute('data-stroke-ids')).split(',').filter(Boolean);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);

    await page.locator('#editorDraw').click();
    await expect(page.locator('.portal-pdf-draw-layer').nth(0).locator('[data-stroke-id]')).toHaveCount(1);
    await expect(page.locator('.portal-pdf-draw-layer').nth(1).locator('[data-stroke-id]')).toHaveCount(1);

    await organizerAction(page, 0, 'delete');
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '1');
    await page.locator('#editorDraw').click();
    await expect(page.locator('.portal-pdf-draw-layer').first().locator('[data-stroke-id]')).toHaveCount(1);
  });

  test('touch desenha e apaga traço no perfil mobile', async ({ page, context, isMobile }) => {
    test.skip(!isMobile, 'Gesto touch específico validado no perfil mobile.');

    await openEditor(page);
    const layer = page.locator('.portal-pdf-draw-layer').first();
    await layer.scrollIntoViewIfNeeded();
    const box = await layer.boundingBox();
    expect(box).not.toBeNull();

    const start = { x: box.x + box.width * .2, y: box.y + box.height * .25 };
    const end = { x: box.x + box.width * .68, y: box.y + box.height * .42 };
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start.x, y: start.y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: end.x, y: end.y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '1');

    await page.locator('#editorDrawEraser').click();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-draw-mode', 'erase');
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start.x, y: start.y, id: 2 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: end.x, y: end.y, id: 2 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page.locator('html')).toHaveAttribute('data-stroke-count', '0');
  });
});
