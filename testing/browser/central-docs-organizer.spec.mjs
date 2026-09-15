import { test, expect } from '@playwright/test';

const original = '0:0,0:1,0:2';
const cards = (page) => page.locator('#thumbnails .portal-pdf-thumb');
async function ready(page) {
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-organizer-mode', 'true');
}
async function order(page, value) {
  await expect(page.locator('html')).toHaveAttribute('data-page-order', value);
  await ready(page);
  await expect(cards(page)).toHaveCount(value.split(',').length);
}
async function action(page, index, name) {
  await cards(page).nth(index).click();
  await page.locator('#thumbnails .portal-pdf-thumb-wrap').nth(index).locator(`[data-thumbnail-action="${name}"]`).click();
  await ready(page);
}
async function merge(page, position, after = '2') {
  await page.locator('#editorMerge').click();
  await page.locator('#editorMergePosition').selectOption(position);
  if (position === 'after-page') await page.locator('#editorMergeAfterPage').fill(after);
  await page.locator('#editorMergeConfirm').click();
  await ready(page);
}
async function startDrag(page, index = 0) {
  await cards(page).nth(index).scrollIntoViewIfNeeded();
  await expect(cards(page).nth(index)).toHaveClass(/rendered/);
  const box = await cards(page).nth(index).boundingBox();
  const point = { x: box.x + box.width * .4, y: box.y + box.height * .55 };
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.mouse.move(point.x + 12, point.y, { steps: 3 });
  await expect(page.locator('.portal-pdf-drag-ghost')).toBeVisible();
  return point;
}

test.beforeEach(async ({ page, baseURL }) => {
  const errors = [];
  const unsafe = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== new URL(baseURL).origin || url.pathname.startsWith('/api/')) unsafe.push(url.href);
  });
  page.__organizerAudit = () => { expect(errors).toEqual([]); expect(unsafe).toEqual([]); };
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-viewer-state', 'ready');
  await page.locator('#enterEditor').click();
  await ready(page);
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-editor-workspace-mode', 'organize');
  await expect(page.locator('#scrollRoot')).toBeHidden();
});
test.afterEach(async ({ page }) => {
  page.__organizerAudit();
  await expect(page.locator('iframe, embed, object')).toHaveCount(0);
});

for (const [position, expected] of [
  ['before-document', '1:0,1:1,1:2,0:0,0:1,0:2'],
  ['after-document', '0:0,0:1,0:2,1:0,1:1,1:2'],
  ['after-page', '0:0,0:1,1:0,1:1,1:2,0:2']
]) {
  test(`união ${position}: ordem, rebuild, undo e redo`, async ({ page }) => {
    await merge(page, position);
    await order(page, expected);
    await page.locator('#editorRefresh').click();
    await order(page, expected);
    await page.locator('#editorUndo').click();
    await order(page, original);
    await page.locator('#editorRedo').click();
    await order(page, expected);
  });
}

test('rotação L/R, duplicação e branco preservam PDF e histórico', async ({ page }) => {
  await action(page, 0, 'rotate-left');
  await expect(page.locator('html')).toHaveAttribute('data-page-rotations', '270,0,0');
  await expect(cards(page).first()).toHaveClass(/rendered/);
  const canvas = page.locator('#thumbnails canvas').first();
  expect(await canvas.evaluate(c => c.width > c.height)).toBe(true);
  await page.locator('#editorRefresh').click();
  await ready(page);
  await expect(cards(page).first()).toHaveClass(/rendered/);
  expect(await canvas.evaluate(c => c.width > c.height)).toBe(true);
  await action(page, 0, 'rotate-right');
  await expect(page.locator('html')).toHaveAttribute('data-page-rotations', '0,0,0');
  await action(page, 0, 'duplicate');
  await order(page, '0:0,0:0,0:1,0:2');
  await page.locator('#editorBlank').click();
  await order(page, '0:0,0:0,1:0,0:1,0:2');
  await page.locator('#editorUndo').click();
  await order(page, '0:0,0:0,0:1,0:2');
  await page.locator('#editorUndo').click();
  await order(page, original);
  await page.locator('#editorRedo').click();
  await order(page, '0:0,0:0,0:1,0:2');
  await page.locator('#editorRedo').click();
  await order(page, '0:0,0:0,1:0,0:1,0:2');
});

test('última página não pode ser excluída', async ({ page }) => {
  await action(page, 0, 'delete');
  await order(page, '0:1,0:2');
  await action(page, 0, 'delete');
  await order(page, '0:2');
  await expect(page.locator('[data-thumbnail-action="delete"]')).toBeDisabled();
  await page.locator('#editorRefresh').click();
  await order(page, '0:2');
});

test('ghost real, drop início/fim e histórico sem mutação durante drag', async ({ page }) => {
  const revision = await page.locator('html').getAttribute('data-editor-revision');
  await startDrag(page, 1);
  expect(await page.evaluate(() => {
    const source = document.querySelector('#thumbnails .dragging canvas');
    const ghost = document.querySelector('.portal-pdf-drag-ghost canvas');
    return source.width > 0 && source.toDataURL() === ghost.toDataURL();
  })).toBe(true);
  const first = await cards(page).first().boundingBox();
  await page.mouse.move(first.x + 15, first.y + first.height * .6, { steps: 5 });
  await expect(page.locator('#thumbnails .drag-before')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-editor-revision', revision);
  await page.mouse.up();
  await order(page, '0:1,0:0,0:2');
  await expect(page.locator('.portal-pdf-drag-ghost')).toHaveCount(0);
  await page.locator('#editorUndo').click();
  await order(page, original);
  await page.locator('#editorRedo').click();
  await order(page, '0:1,0:0,0:2');
  await startDrag(page, 0);
  await cards(page).nth(2).scrollIntoViewIfNeeded();
  const last = await cards(page).nth(2).boundingBox();
  await page.mouse.move(last.x + last.width * .85, last.y + last.height * .6, { steps: 8 });
  await expect(page.locator('#thumbnails .drag-after')).toHaveCount(1);
  await page.mouse.up();
  await order(page, '0:0,0:2,0:1');
  await expect(page.locator('.portal-pdf-drag-ghost')).toHaveCount(0);
  await page.waitForTimeout(150);
  const stopped = await page.locator('#thumbnails').evaluate(node => node.scrollTop);
  await page.waitForTimeout(200);
  expect(await page.locator('#thumbnails').evaluate(node => node.scrollTop)).toBe(stopped);
});

test('trocas rápidas de modo não deixam miniaturas vazias ou de resolução antiga', async ({ page }) => {
  await page.evaluate(async () => {
    const viewer = window.PortalPdfViewer;
    for (let i = 0; i < 8; i++) {
      viewer.setOrganizerMode(false);
      await new Promise(requestAnimationFrame);
      viewer.setOrganizerMode(true);
    }
  });
  await ready(page);
  await expect.poll(() => page.locator('#thumbnails .portal-pdf-thumb.rendered').count()).toBe(3);
  const widths = await page.locator('#thumbnails canvas').evaluateAll(nodes => nodes.map(c => ({ width: c.width, height: c.height, cssWidth: parseFloat(c.style.width) })));
  expect(widths.every(c => c.width >= 210 && c.height > 0 && c.cssWidth >= 210)).toBe(true);
  await order(page, original);
});

test('auto-scroll continua com ponteiro parado e para ao cancelar', async ({ page }) => {
  await merge(page, 'after-document');
  await merge(page, 'after-document');
  await page.locator('#thumbnails').evaluate(node => { node.scrollTop = 0; });
  await startDrag(page);
  await page.locator('#thumbnails').evaluate(node => node.scrollIntoView({ block: 'end', behavior: 'instant' }));
  const box = await page.locator('#thumbnails').boundingBox();
  // Keep the scrolling viewport on screen even on the mobile profile.
  const y = Math.min(box.y + box.height - 8, (await page.evaluate(() => innerHeight)) - 8);
  await page.mouse.move(box.x + box.width * .6, y, { steps: 5 });
  const start = await page.locator('#thumbnails').evaluate(node => node.scrollTop);
  await expect.poll(() => page.locator('#thumbnails').evaluate(node => node.scrollTop)).toBeGreaterThan(start + 60);
  await page.locator('#thumbnails').dispatchEvent('pointercancel', { pointerId: 1 });
  await page.mouse.up();
  await expect(page.locator('.portal-pdf-drag-ghost')).toHaveCount(0);
  const stopped = await page.locator('#thumbnails').evaluate(node => node.scrollTop);
  await page.waitForTimeout(200);
  expect(await page.locator('#thumbnails').evaluate(node => node.scrollTop)).toBe(stopped);
  await expect(page.locator('#thumbnails .dragging, #thumbnails .drag-before, #thumbnails .drag-after')).toHaveCount(0);
});

test('touch nativo: scroll comum, lift pelo grip e drop com ghost', async ({ page, context, isMobile }) => {
  test.skip(!isMobile, 'Gesto nativo validado no perfil Pixel touch.');
  const cdp = await context.newCDPSession(page);
  const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', {
    type, touchPoints: type === 'touchEnd' || type === 'touchCancel' ? [] : [{ x, y, id: 1 }]
  });
  await page.locator('#thumbnails').evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
  let box = await cards(page).first().boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height * .65;
  await touch('touchStart', x, y);
  for (let i = 1; i <= 5; i++) await touch('touchMove', x, y - i * 24);
  await touch('touchEnd');
  await expect.poll(() => page.locator('#thumbnails').evaluate(node => node.scrollTop)).toBeGreaterThan(30);
  await expect(page.locator('.portal-pdf-drag-ghost')).toHaveCount(0);
  await order(page, original);
  await page.waitForTimeout(350);
  await page.locator('#thumbnails').evaluate(node => { node.scrollTop = 0; });
  await cards(page).first().scrollIntoViewIfNeeded();
  const handle = page.locator('#thumbnails [data-thumbnail-drag]').first();
  box = await handle.boundingBox();
  await touch('touchStart', box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('.portal-pdf-drag-ghost')).toBeVisible();
  expect(await page.evaluate(() => document.querySelector('#thumbnails .dragging canvas').toDataURL() === document.querySelector('.portal-pdf-drag-ghost canvas').toDataURL())).toBe(true);
  const target = await cards(page).nth(1).boundingBox();
  await touch('touchMove', target.x + target.width * .85, target.y + 100);
  await expect(page.locator('#thumbnails .drag-after')).toHaveCount(1);
  await touch('touchEnd');
  await order(page, '0:1,0:0,0:2');
  await expect(page.locator('.portal-pdf-drag-ghost')).toHaveCount(0);
  await page.locator('#editorUndo').click();
  await order(page, original);
  await cards(page).first().scrollIntoViewIfNeeded();
  box = await cards(page).first().boundingBox();
  await touch('touchStart', box.x + box.width * .5, box.y + box.height * .6);
  await expect(page.locator('.portal-pdf-drag-ghost')).toBeVisible();
  const heldTarget = await cards(page).nth(1).boundingBox();
  await touch('touchMove', heldTarget.x + heldTarget.width * .85, heldTarget.y + 100);
  await touch('touchEnd');
  await order(page, '0:1,0:0,0:2');
  await expect(page.locator('.portal-pdf-drag-ghost')).toHaveCount(0);
  await cdp.detach();
});

test('fechar durante drag remove ghost e não deixa RAF órfão', async ({ page }) => {
  await startDrag(page);
  await page.evaluate(() => window.PortalPdfViewer.close());
  await page.mouse.up();
  await expect(page.locator('.portal-pdf-drag-ghost')).toHaveCount(0);
  await expect(cards(page)).toHaveCount(0);
});
