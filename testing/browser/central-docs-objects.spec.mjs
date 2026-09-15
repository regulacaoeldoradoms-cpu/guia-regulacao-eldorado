import { test, expect } from '@playwright/test';

async function openEditor(page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-viewer-state', 'ready');
  await page.locator('#enterEditor').click();
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-organizer-mode', 'true');
}

test.describe('Central de Documentos — objetos sobre página', () => {
  test('Escrever mantém uma única caixa durante edição, permite arrastar e confirma no primeiro clique externo', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await page.locator('#editorWrite').click();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-editor-workspace-mode', 'write');
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-organizer-mode', 'false');

    const layer = page.locator('.portal-pdf-object-layer').first();
    const layerBox = await layer.boundingBox();
    await page.mouse.click(layerBox.x + layerBox.width * .35, layerBox.y + layerBox.height * .28);
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('data-object-count', '1');

    let object = page.locator('.portal-pdf-object--text').first();
    let text = object.locator('.portal-pdf-object-text');
    await expect(text).toHaveAttribute('contenteditable', 'true');
    await text.fill('Texto sintético editado');

    // Clicking in the text again must keep editing the same object, never create a box behind it.
    const textBox = await text.boundingBox();
    await page.mouse.click(textBox.x + Math.min(24, textBox.width / 3), textBox.y + Math.min(16, textBox.height / 3));
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(1);
    await expect(text).toHaveAttribute('contenteditable', 'true');

    // Drag the box while contenteditable is still active. Keep the object inside
    // the viewport first so the synthetic mouse gesture reaches the DOM.
    await object.scrollIntoViewIfNeeded();
    const before = await object.boundingBox();
    await page.mouse.move(before.x + before.width * .55, before.y + before.height * .55);
    await page.mouse.down();
    await page.mouse.move(before.x + before.width * .55 + 58, before.y + before.height * .55 + 30, { steps: 7 });
    await page.mouse.up();
    const moved = await object.boundingBox();
    expect(moved.x).toBeGreaterThan(before.x + 25);
    await expect(text).toHaveAttribute('contenteditable', 'true');
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(1);

    // First outside click only confirms the active edit. Click a known empty
    // corner of the page layer so the gesture is unambiguously outside the object.
    await layer.click({ position: { x: 12, y: 12 } });
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(1);
    object = page.locator('.portal-pdf-object--text').first();
    text = object.locator('.portal-pdf-object-text');
    await expect(text).toHaveAttribute('contenteditable', 'false');
    await expect(text).toHaveText('Texto sintético editado');
    await expect(object).not.toHaveClass(/selected/);
    await expect(object.locator('[data-text-quickbar]')).toHaveCount(0);

    // A later, distinct click at the same empty point may create the next box because editing is finished.
    await page.waitForTimeout(450);
    await layer.click({ position: { x: 12, y: 12 } });
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(2);

    // Switching to Select also finalizes an active edit without creating anything.
    const secondText = page.locator('.portal-pdf-object--text').nth(1).locator('.portal-pdf-object-text');
    await expect(secondText).toHaveAttribute('contenteditable', 'true');
    await secondText.fill('Segunda caixa');
    await page.locator('#editorSelect').click();
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(2);
    await expect(page.locator('.portal-pdf-object--text').nth(1).locator('.portal-pdf-object-text')).toHaveAttribute('contenteditable', 'false');

    expect(errors).toEqual([]);
  });

  test('Selecionar protege o conteúdo do texto, mantém ajustes contextuais e desmarca ao clicar fora', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await page.locator('#editorWrite').click();
    const layer = page.locator('.portal-pdf-object-layer').first();
    const layerBox = await layer.boundingBox();
    await page.mouse.click(layerBox.x + layerBox.width * .44, layerBox.y + layerBox.height * .30);

    let object = page.locator('.portal-pdf-object--text').first();
    let text = object.locator('.portal-pdf-object-text');
    await text.fill('Conteúdo protegido no modo selecionar');
    await page.locator('#editorSelect').click();

    object = page.locator('.portal-pdf-object--text').first();
    text = object.locator('.portal-pdf-object-text');
    await expect(text).toHaveAttribute('contenteditable', 'false');
    await text.dblclick();
    await expect(text).toHaveAttribute('contenteditable', 'false');
    await expect(text).toHaveText('Conteúdo protegido no modo selecionar');

    await text.click();
    await expect(object).toHaveClass(/selected/);
    const quickbar = object.locator('[data-text-quickbar]');
    await expect(quickbar).toBeVisible();
    await expect(quickbar.locator('[data-text-quick-color]')).toBeVisible();
    await expect(quickbar.locator('[data-text-quick-size="smaller"]')).toBeVisible();
    await expect(quickbar.locator('[data-text-quick-size="larger"]')).toBeVisible();
    await expect(quickbar.locator('[data-text-quick-delete] svg')).toHaveCount(1);

    const sizeBefore = parseFloat(await text.evaluate((node) => getComputedStyle(node).fontSize));
    await quickbar.locator('[data-text-quick-size="larger"]').click();
    await expect.poll(async () => parseFloat(await text.evaluate((node) => getComputedStyle(node).fontSize))).toBeGreaterThan(sizeBefore);
    await expect(text).toHaveText('Conteúdo protegido no modo selecionar');

    await quickbar.locator('[data-text-quick-color]').click();
    const palette = quickbar.locator('[data-text-palette]');
    await expect(palette).toBeVisible();
    await palette.locator('[data-text-palette-index="3"]').click();
    await expect(text).toHaveCSS('color', 'rgb(21, 101, 192)');
    await expect(text).toHaveText('Conteúdo protegido no modo selecionar');

    await object.scrollIntoViewIfNeeded();
    await layer.click({ position: { x: 12, y: 12 } });
    await expect(object).not.toHaveClass(/selected/);
    await expect(object.locator('[data-text-quickbar]')).toHaveCount(0);
    await expect(text).toHaveAttribute('contenteditable', 'false');
    await expect(text).toHaveText('Conteúdo protegido no modo selecionar');

    expect(errors).toEqual([]);
  });

  test('barra contextual acompanha a seleção ao alternar entre duas caixas de texto', async ({ page }) => {
    await openEditor(page);
    await page.locator('#editorWrite').click();
    const layer = page.locator('.portal-pdf-object-layer').first();
    const layerBox = await layer.boundingBox();

    await page.mouse.click(layerBox.x + layerBox.width * .28, layerBox.y + layerBox.height * .26);
    let texts = page.locator('.portal-pdf-object--text');
    await expect(texts).toHaveCount(1);
    await texts.first().locator('.portal-pdf-object-text').fill('Caixa A');
    await layer.click({ position: { x: 12, y: 12 } });
    await page.waitForTimeout(450);

    await layer.click({
      position: {
        x: Math.round(layerBox.width * .68),
        y: Math.round(layerBox.height * .48)
      }
    });
    texts = page.locator('.portal-pdf-object--text');
    await expect(texts).toHaveCount(2);
    await texts.nth(1).locator('.portal-pdf-object-text').fill('Caixa B');
    await page.locator('#editorSelect').click();

    const first = texts.nth(0);
    const second = texts.nth(1);
    await first.locator('.portal-pdf-object-text').click();
    await expect(first).toHaveClass(/selected/);
    await expect(first.locator('[data-text-quickbar]')).toHaveCount(1);
    await expect(second.locator('[data-text-quickbar]')).toHaveCount(0);

    // Pointerdown selects before click; the quickbar must still migrate to B.
    await second.locator('.portal-pdf-object-text').click();
    await expect(second).toHaveClass(/selected/);
    await expect(second.locator('[data-text-quickbar]')).toHaveCount(1);
    await expect(first.locator('[data-text-quickbar]')).toHaveCount(0);
  });

  test('barra contextual do texto oferece tamanho, paleta editável e exclusão reversível', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await page.locator('#editorWrite').click();
    const layer = page.locator('.portal-pdf-object-layer').first();
    const layerBox = await layer.boundingBox();
    await page.mouse.click(layerBox.x + layerBox.width * .42, layerBox.y + layerBox.height * .30);

    const object = page.locator('.portal-pdf-object--text').first();
    const text = object.locator('.portal-pdf-object-text');
    const quickbar = object.locator('[data-text-quickbar]');
    await expect(quickbar).toBeVisible();
    await expect(quickbar.locator('[data-text-quick-color]')).toBeVisible();
    await expect(quickbar.locator('[data-text-quick-size="smaller"]')).toBeVisible();
    await expect(quickbar.locator('[data-text-quick-size="larger"]')).toBeVisible();
    await expect(quickbar.locator('[data-text-quick-delete] svg')).toHaveCount(1);

    const sizeBefore = parseFloat(await text.evaluate((node) => getComputedStyle(node).fontSize));
    await quickbar.locator('[data-text-quick-size="larger"]').click();
    await expect.poll(async () => parseFloat(await text.evaluate((node) => getComputedStyle(node).fontSize))).toBeGreaterThan(sizeBefore);

    // Open compact predefined palette and select the red slot.
    await quickbar.locator('[data-text-quick-color]').click();
    const palette = quickbar.locator('[data-text-palette]');
    await expect(palette).toBeVisible();
    await expect(palette.locator('[data-text-palette-index]')).toHaveCount(6);
    await palette.locator('[data-text-palette-index="2"]').click();
    await expect(text).toHaveCSS('color', 'rgb(229, 57, 53)');

    // RGB opens a Portal-controlled panel in the old position, directly above the palette.
    await palette.locator('[data-text-palette-custom]').click();
    const panel = palette.locator('[data-text-custom-color-panel]');
    await expect(panel).toBeVisible();
    const paletteBox = await palette.boundingBox();
    const panelBefore = await panel.boundingBox();
    expect(panelBefore.y + panelBefore.height).toBeLessThanOrEqual(paletteBox.y + 2);

    // The lower-right grip moves the panel freely without closing it.
    const dragHandle = panel.locator('[data-color-drag-handle]');
    const handleBox = await dragHandle.boundingBox();
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox.x + handleBox.width / 2 + 72, handleBox.y + handleBox.height / 2 + 36, { steps: 6 });
    await page.mouse.up();
    const panelAfter = await panel.boundingBox();
    expect(panelAfter.x).toBeGreaterThan(panelBefore.x + 45);
    expect(panelAfter.y).toBeGreaterThan(panelBefore.y + 20);
    await expect(panel).toBeVisible();

    // RGB/HEX replaces the selected predefined slot, preserving its position.
    const hex = panel.locator('[data-color-hex]');
    await hex.fill('#7B1FA2');
    await hex.dispatchEvent('change');
    await expect(text).toHaveCSS('color', 'rgb(123, 31, 162)');
    await expect(page.locator('html')).toHaveAttribute('data-editor-palette', /#000000,#ffffff,#7b1fa2,#1565c0,#2e7d32,#f9a825/);
    await expect(palette.locator('[data-text-palette-index="2"]')).toHaveCSS('background-color', 'rgb(123, 31, 162)');

    // + creates a visible slot immediately and selects it for the next RGB choice.
    await palette.locator('[data-text-palette-add]').click();
    await expect(palette.locator('[data-text-palette-index]')).toHaveCount(7);
    await expect(palette.locator('[data-text-palette-index="6"]')).toHaveClass(/active/);

    // RGB fills the newly-created slot from the same movable panel.
    await palette.locator('[data-text-palette-custom]').click();
    await expect(panel).toBeHidden();
    await palette.locator('[data-text-palette-custom]').click();
    await expect(panel).toBeVisible();
    await panel.locator('[data-color-hex]').fill('#00838F');
    await panel.locator('[data-color-hex]').dispatchEvent('change');
    await expect(palette.locator('[data-text-palette-index="6"]')).toHaveCSS('background-color', 'rgb(0, 131, 143)');
    await expect(page.locator('html')).toHaveAttribute('data-editor-palette', /#00838f$/);

    // Quick delete is reversible through the shared history.
    await quickbar.locator('[data-text-quick-delete]').click();
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(0);
    await page.locator('#editorUndo').click();
    await expect(page.locator('.portal-pdf-object--text')).toHaveCount(1);

    expect(errors).toEqual([]);
  });

  test('sair do editor sem mutação limpa object mode e devolve a superfície ao visualizador', async ({ page }) => {
    await openEditor(page);
    await page.locator('#editorSelect').click();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-object-mode', 'select');
    const layer = page.locator('.portal-pdf-object-layer').first();
    await expect(layer).toHaveCSS('pointer-events', 'auto');

    await page.locator('#editorExit').click();
    await expect(page.locator('html')).toHaveAttribute('data-editor-mode', 'readonly');
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-object-mode', 'none');
    await expect(layer).toHaveCSS('pointer-events', 'none');
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
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();

    await page.locator('#editorObjectOpacity').fill('60');
    await page.locator('#editorObjectOpacity').dispatchEvent('change');
    await expect(image).toHaveCSS('opacity', '1');
    await expect(image.locator('img')).toHaveCSS('opacity', '0.6');
    await expect(image.locator('[data-object-rotate]')).toHaveCSS('opacity', '1');

    const rotate = image.locator('[data-object-rotate]');
    await expect(rotate).toBeVisible();
    const rotateBox = await rotate.boundingBox();
    const imageBeforeRotate = await image.evaluate((node) => getComputedStyle(node).transform);
    await page.mouse.move(rotateBox.x + rotateBox.width / 2, rotateBox.y + rotateBox.height / 2);
    await page.mouse.down();
    await expect(page.locator('#pdfRoot')).toHaveAttribute('data-object-gesture', 'rotate');
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
