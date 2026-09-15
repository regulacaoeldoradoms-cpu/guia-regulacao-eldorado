import { test, expect } from '@playwright/test';

async function openEditor(page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-viewer-state', 'ready');
  await page.locator('#enterEditor').click();
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-organizer-mode', 'true');
}

test.describe('Central de Documentos — objetos sobre página', () => {
  test('Escrever cria texto editável, movível, redimensionável e reversível', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await page.locator('#editorWrite').click();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-editor-workspace-mode', 'write');
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-organizer-mode', 'false');
    await expect(page.locator('#scrollRoot')).toBeVisible();

    const layer = page.locator('.portal-pdf-object-layer').first();
    const box = await layer.boundingBox();
    await page.mouse.click(box.x + box.width * .35, box.y + box.height * .28);
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('data-object-count', '1');
    await expect(page.locator('#editorObjectToolbar')).toBeVisible();

    const text = page.locator('.portal-pdf-object-text').first();
    await expect(text).toHaveAttribute('contenteditable', 'true');
    await text.fill('Texto sintético editado');
    await page.locator('#editorStatus').click();
    await expect(text).toHaveText('Texto sintético editado');

    await page.locator('#editorObjectFont').selectOption('Courier New');
    await page.locator('#editorObjectFontSize').fill('24');
    await page.locator('#editorObjectFontSize').press('Enter');
    await page.locator('#editorObjectColor').evaluate((node) => {
      node.value = '#cc0000';
      node.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(text).toHaveCSS('font-family', /Courier New/);
    await expect(text).toHaveCSS('color', 'rgb(204, 0, 0)');

    const object = page.locator('.portal-pdf-object--text').first();
    const before = await object.boundingBox();
    await page.mouse.move(before.x + before.width / 2, before.y + 4);
    await page.mouse.down();
    await page.mouse.move(before.x + before.width / 2 + 45, before.y + 34, { steps: 5 });
    await page.mouse.up();
    const moved = await object.boundingBox();
    expect(moved.x).toBeGreaterThan(before.x + 20);

    const handle = object.locator('[data-object-resize="se"]');
    await expect(handle).toBeVisible();
    const handleBox = await handle.boundingBox();
    const handleCenter = { x: handleBox.x + handleBox.width / 2, y: handleBox.y + handleBox.height / 2 };
    await page.mouse.move(handleCenter.x, handleCenter.y);
    await page.mouse.down();
    await page.mouse.move(handleCenter.x + 48, handleCenter.y + 36, { steps: 6 });
    await expect.poll(async () => (await object.boundingBox()).width).toBeGreaterThan(moved.width + 20);
    await page.mouse.up();
    const resized = await object.boundingBox();
    expect(resized.width).toBeGreaterThan(moved.width + 20);

    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('imagem overlay é local, selecionável, redimensionável e removível com undo', async ({ page }) => {
    await openEditor(page);
    await page.locator('.portal-pdf-thumb').nth(1).click();
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');
    await page.locator('#editorOverlayImage').click();

    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-editor-workspace-mode', 'image');
    await expect(page.locator('.portal-pdf-object--image')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('data-object-count', '1');
    const image = page.locator('.portal-pdf-object--image');
    await expect(image).toHaveClass(/selected/);
    await expect(image.locator('img')).toHaveAttribute('src', /^blob:/);

    await page.locator('#editorObjectOpacity').fill('60');
    await page.locator('#editorObjectOpacity').dispatchEvent('change');
    await expect(image).toHaveCSS('opacity', '0.6');

    const rotate = image.locator('[data-object-rotate]');
    await expect(rotate).toBeVisible();
    const rotateBox = await rotate.boundingBox();
    const imageBeforeRotate = await image.evaluate((node) => getComputedStyle(node).transform);
    await page.mouse.move(rotateBox.x + rotateBox.width / 2, rotateBox.y + rotateBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(rotateBox.x + 48, rotateBox.y - 24, { steps: 5 });
    await page.mouse.up();
    await expect.poll(() => image.evaluate((node) => getComputedStyle(node).transform)).not.toBe(imageBeforeRotate);

    const secondLayer = page.locator('.portal-pdf-object-layer').nth(1);
    const imageBox = await image.boundingBox();
    const secondBox = await secondLayer.boundingBox();
    await page.mouse.move(imageBox.x + imageBox.width / 2, imageBox.y + imageBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(secondBox.x + secondBox.width * .5, secondBox.y + secondBox.height * .35, { steps: 8 });
    await page.mouse.up();
    await expect(page.locator('.portal-pdf-object-layer').nth(1).locator('.portal-pdf-object--image')).toHaveCount(1);

    await page.locator('#editorObjectDelete').click();
    await expect(page.locator('.portal-pdf-object--image')).toHaveCount(0);
    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await page.locator('#editorSelect').click();
    await expect(page.locator('.portal-pdf-object--image')).toHaveCount(1);
    await expect(page.locator('iframe, embed, object')).toHaveCount(0);
  });
});
