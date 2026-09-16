import { test, expect } from '@playwright/test';

const ONE_PIXEL_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z6K0AAAAASUVORK5CYII=', 'base64');

function monitorPage(page) {
  const consoleErrors = [];
  const requests = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error?.message || error)));
  page.on('request', (request) => requests.push(request.url()));

  return () => {
    const unsafe = requests.filter((value) => {
      const url = new URL(value);
      return /yellow-wave-d0a1guia-regulacao-ia\.regulacaoeldoradoms\.workers\.dev/i.test(url.hostname)
        || /(^|\.)googleapis\.com$/i.test(url.hostname)
        || /(^|\.)googleusercontent\.com$/i.test(url.hostname)
        || /(^|\.)accounts\.google\.com$/i.test(url.hostname)
        || /(^|\.)drive\.google\.com$/i.test(url.hostname)
        || /portal-regulacao-users/i.test(value)
        || url.pathname.startsWith('/api/');
    });
    expect(consoleErrors).toEqual([]);
    expect(unsafe).toEqual([]);
  };
}

async function openLab(page) {
  await page.goto('/');
  await expect(page.locator('#labStatus')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('html')).toHaveAttribute('data-viewer-state', 'ready');
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
  await expect(page.locator('html')).toHaveAttribute('data-editor-mode', 'readonly');
  await expect(page.locator('.portal-pdf-page')).toHaveCount(3);
  await expect(page.locator('.portal-pdf-thumb')).toHaveCount(3);
  await expect(page.locator('.portal-pdf-page').first()).toHaveClass(/rendered/);
  await expect(page.locator('.portal-pdf-thumb').first()).toHaveClass(/rendered/);
}

async function enterEditor(page) {
  await page.locator('#enterEditor').click();
  await expect(page.locator('html')).toHaveAttribute('data-editor-mode', 'editor');
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
  await expect(page.locator('#editorControls')).toBeVisible();
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-organizer-mode', 'true');
  await expect(page.locator('#pdfRoot')).toHaveAttribute('data-editor-workspace-mode', 'organize');
  await expect(page.locator('#scrollRoot')).toBeHidden();
  await expect(page.locator('.portal-pdf-thumb-actions')).toHaveCount(3);
  await expect(page.locator('[data-thumbnail-drag]')).toHaveCount(3);
  await expect(page.locator('[data-thumbnail-action]')).toHaveCount(12);
  await expect(page.locator('[data-thumbnail-action="up"], [data-thumbnail-action="down"]')).toHaveCount(0);
  for (const action of ['rotate-left', 'rotate-right', 'duplicate', 'delete']) {
    await expect(page.locator(`[data-thumbnail-action="${action}"]`)).toHaveCount(3);
  }
  await expect.poll(() => page.locator('#thumbnails .portal-pdf-thumb.rendered').count()).toBe(3);
  expect(await page.locator('#thumbnails').evaluate((node) => getComputedStyle(node).display)).toBe('grid');
}

async function waitForOrder(page, value) {
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
  await expect(page.locator('html')).toHaveAttribute('data-viewer-state', 'ready');
  await expect(page.locator('html')).toHaveAttribute('data-page-order', value);
}

async function dragThumbnail(page, fromIndex, toIndex) {
  const source = page.locator('.portal-pdf-thumb').nth(fromIndex);
  const target = page.locator('.portal-pdf-thumb').nth(toIndex);
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error('Miniatura não disponível para arraste.');
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    targetBox.x + targetBox.width * (fromIndex < toIndex ? 0.85 : 0.15),
    targetBox.y + Math.max(4, targetBox.height * 0.2),
    { steps: 8 }
  );
  await page.mouse.up();
}

test.describe('Central de Documentos — superfície única do editor', () => {
  test('entra e sai do editor preservando a mesma superfície PDF.js', async ({ page, request }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);

    await page.locator('#zoomIn').click();
    const zoomBeforeEditor = await page.locator('#zoomReset').textContent();
    await page.locator('.portal-pdf-thumb').nth(1).click();
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');

    await page.evaluate(() => {
      window.__centralDocsNodes = {
        root: document.getElementById('pdfRoot'),
        firstPage: document.querySelector('.portal-pdf-page'),
        firstThumb: document.querySelector('.portal-pdf-thumb')
      };
    });

    await enterEditor(page);

    expect(await page.evaluate(() => (
      window.__centralDocsNodes.root === document.getElementById('pdfRoot')
      && window.__centralDocsNodes.firstPage === document.querySelector('.portal-pdf-page')
      && window.__centralDocsNodes.firstThumb === document.querySelector('.portal-pdf-thumb')
    ))).toBe(true);
    await expect(page.locator('#zoomReset')).toHaveText(zoomBeforeEditor || '');
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');
    await expect(page.locator('#documentsEditorPages, .documents-editor-pages, [data-editor-index]')).toHaveCount(0);
    await expect(page.locator('iframe, embed, object')).toHaveCount(0);

    await expect(page.locator('#scrollRoot')).toBeHidden();
    await page.locator('#editorExit').click();
    await expect(page.locator('html')).toHaveAttribute('data-editor-mode', 'readonly');
    await expect(page.locator('#editorControls')).toBeHidden();
    await expect(page.locator('[data-thumbnail-action]')).toHaveCount(0);
    expect(await page.evaluate(() => (
      window.__centralDocsNodes.root === document.getElementById('pdfRoot')
      && window.__centralDocsNodes.firstPage === document.querySelector('.portal-pdf-page')
      && window.__centralDocsNodes.firstThumb === document.querySelector('.portal-pdf-thumb')
    ))).toBe(true);

    const manifestResponse = await request.get('/staging-manifest.json');
    expect(manifestResponse.ok()).toBe(true);
    const manifest = await manifestResponse.json();
    expect(manifest.syntheticOnly).toBe(true);
    expect(manifest.productionApisIncluded).toBe(false);
    finishMonitoring();
  });

  test('assets visuais dos botões carregam no navegador', async ({ page, request }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    const assets = [
      '/assets/editor-pdf-buttons/zoom-menos.svg',
      '/assets/editor-pdf-buttons/zoom-mais.svg',
      '/assets/editor-pdf-buttons/ajustar-largura.svg',
      '/assets/editor-pdf-buttons/grade-ativa.svg',
      '/assets/editor-pdf-buttons/grade-inativa.svg',
      '/assets/Unir_PDF.png',
      '/assets/Inserir_pagina_branca.png',
      '/assets/Adicionar_imagem.png',
      '/assets/Recortar_pagina.png',
      '/assets/Selecionar_mover.png',
      '/assets/Escrever.png',
      '/assets/Colar_imagem.png',
      '/assets/Desenhar.png',
      '/assets/editor-pdf-buttons/salvar-pdf.svg',
      '/assets/editor-pdf-buttons/imprimir-normal.svg',
      '/assets/editor-pdf-buttons/fechar.svg',
      '/assets/editor-pdf-buttons/atualizar.svg'
    ];

    for (const asset of assets) {
      const response = await request.get(asset);
      expect(response.ok()).toBe(true);
      expect((await response.body()).byteLength).toBeGreaterThan(100);
    }

    for (const selector of ['#zoomOut', '#zoomIn', '#fitWidth', '#editorOrganize', '#editorSync', '#editorExport', '#editorPrint', '#editorExit']) {
      const background = await page.locator(selector).evaluate((node) => getComputedStyle(node).backgroundImage);
      expect(background).toContain('/assets/editor-pdf-buttons/');
    }

    const toolIcons = [
      ['#editorMerge', 'Unir_PDF.png'],
      ['#editorBlank', 'Inserir_pagina_branca.png'],
      ['#editorAddImage', 'Adicionar_imagem.png'],
      ['#editorCrop', 'Recortar_pagina.png'],
      ['#editorSelect', 'Selecionar_mover.png'],
      ['#editorWrite', 'Escrever.png'],
      ['#editorOverlayImage', 'Colar_imagem.png'],
      ['#editorDraw', 'Desenhar.png']
    ];
    for (const [selector, filename] of toolIcons) {
      const background = await page.locator(selector).evaluate((node) => getComputedStyle(node).backgroundImage);
      expect(background).toContain('/assets/' + filename);
    }
    await expect(page.locator('#editorRefresh')).toHaveCount(0);
    await expect(page.locator('#editorSync')).toBeVisible();
    await expect(page.locator('#editorSync')).toHaveAttribute('title', 'Forçar sincronização com Google Drive');
    await page.locator('#editorSync').click();
    await expect(page.locator('html')).toHaveAttribute('data-sync-preview', 'force-visible');
    await expect(page.locator('#editorStatus')).toContainText('não grava no Drive');

    const organizeBackground = await page.locator('#editorOrganize').evaluate((node) => getComputedStyle(node).backgroundImage);
    expect(organizeBackground).toContain('grade-ativa.svg');
    finishMonitoring();
  });

  test('arrastar e excluir atualizam a ordem visual e as miniaturas sem setas', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);
    await page.evaluate(() => { window.__centralDocsRoot = document.getElementById('pdfRoot'); });
    const firstThumbBefore = await page.locator('.portal-pdf-thumb-canvas').first().evaluate((canvas) => canvas.toDataURL());

    await dragThumbnail(page, 1, 0);
    await waitForOrder(page, '0:1,0:0,0:2');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(3);
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(3);
    await expect(page.locator('.portal-pdf-thumb').first()).toHaveClass(/rendered/);
    const firstThumbSize = await page.locator('.portal-pdf-thumb-canvas').first().evaluate((canvas) => ({ width: canvas.width, height: canvas.height }));
    expect(firstThumbSize.width).toBeGreaterThan(firstThumbSize.height);
    const firstThumbAfter = await page.locator('.portal-pdf-thumb-canvas').first().evaluate((canvas) => canvas.toDataURL());
    expect(firstThumbAfter).not.toBe(firstThumbBefore);

    await page.locator('.portal-pdf-thumb-wrap').first().locator('[data-thumbnail-action="delete"]').click();
    await waitForOrder(page, '0:0,0:2');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(2);
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(2);
    await expect(page.locator('#pageCount')).toHaveText('2 página(s)');
    expect(await page.evaluate(() => window.__centralDocsRoot === document.getElementById('pdfRoot'))).toBe(true);

    await page.locator('#editorUndo').click();
    await waitForOrder(page, '0:1,0:0,0:2');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(3);
    await page.locator('#editorRedo').click();
    await waitForOrder(page, '0:0,0:2');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(2);
    finishMonitoring();
  });

  test('gira uma página 90 graus e mantém rotação no desfazer/refazer', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    await page.locator('.portal-pdf-thumb').nth(2).click();
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '3');
    const lastCanvas = page.locator('.portal-pdf-thumb-canvas').nth(2);
    await expect(page.locator('.portal-pdf-thumb').nth(2)).toHaveClass(/rendered/);
    const before = await lastCanvas.evaluate((canvas) => ({ width: canvas.width, height: canvas.height }));
    const revisionBefore = await page.locator('html').getAttribute('data-editor-revision');

    await page.locator('.portal-pdf-thumb-wrap').nth(2).locator('[data-thumbnail-action="rotate-right"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).not.toHaveAttribute('data-editor-revision', revisionBefore || '');
    const rotated = await lastCanvas.evaluate((canvas) => ({ width: canvas.width, height: canvas.height }));
    expect(Math.sign(before.width - before.height)).toBe(-Math.sign(rotated.width - rotated.height));

    await page.locator('#editorUndo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    const undone = await lastCanvas.evaluate((canvas) => ({ width: canvas.width, height: canvas.height }));
    expect(Math.sign(undone.width - undone.height)).toBe(Math.sign(before.width - before.height));

    await page.locator('#editorRedo').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    const redone = await lastCanvas.evaluate((canvas) => ({ width: canvas.width, height: canvas.height }));
    expect(Math.sign(redone.width - redone.height)).toBe(Math.sign(rotated.width - rotated.height));

    finishMonitoring();
  });


  test('duplicar e inserir página em branco participam do histórico', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    await page.locator('.portal-pdf-thumb').first().click();
    await page.locator('.portal-pdf-thumb-wrap').first().locator('[data-thumbnail-action="duplicate"]').click();
    await waitForOrder(page, '0:0,0:0,0:1,0:2');
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(4);

    await page.locator('#editorBlank').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(5);

    await page.locator('#editorUndo').click();
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(4);
    await page.locator('#editorUndo').click();
    await waitForOrder(page, '0:0,0:1,0:2');

    finishMonitoring();
  });

  test('adicionar imagem e unir PDF atualizam o PDF na mesma superfície', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);
    await page.evaluate(() => { window.__centralDocsRoot = document.getElementById('pdfRoot'); });

    const imageChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#editorAddImage').click();
    const imageChooser = await imageChooserPromise;
    await imageChooser.setFiles({
      name: 'imagem-sintetica.png',
      mimeType: 'image/png',
      buffer: ONE_PIXEL_PNG
    });
    await waitForOrder(page, '0:0,0:1,0:2,1:0');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(4);
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(4);
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '4');
    // Organizar V2 deliberately hides/releases the large reading canvas.
    // The page's real rendered representation is now the grid card.
    await expect(page.locator('#scrollRoot')).toBeHidden();
    await expect(page.locator('.portal-pdf-thumb').nth(3)).toHaveClass(/rendered/);
    expect(await page.locator('#thumbnails .portal-pdf-thumb-canvas').nth(3).evaluate((canvas) => canvas.width > 0 && canvas.height > 0)).toBe(true);

    await page.locator('#editorMerge').click();
    await page.locator('#editorMergeConfirm').click();
    await waitForOrder(page, '0:0,0:1,0:2,1:0,2:0,2:1,2:2');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(7);
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(7);
    expect(await page.evaluate(() => window.__centralDocsRoot === document.getElementById('pdfRoot'))).toBe(true);

    await page.locator('#editorExit').click();
    await expect(page.locator('html')).toHaveAttribute('data-editor-mode', 'readonly');
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(3);
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(3);
    await expect(page.locator('[data-thumbnail-action]')).toHaveCount(0);
    expect(await page.evaluate(() => window.__centralDocsRoot === document.getElementById('pdfRoot'))).toBe(true);
    finishMonitoring();
  });

  test('painel Unir mostra preview local e força novas páginas para a linha seguinte sem sobreposição', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    // Cria páginas suficientes para provar que o painel não apenas deixa o
    // primeiro cartão livre: a grade inteira precisa recalcular as colunas.
    await page.locator('#editorBlank').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await page.locator('#editorBlank').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-thumb-wrap')).toHaveCount(5);

    await page.locator('#editorMerge').click();
    await expect(page.locator('#editorMergePanel')).toBeVisible();
    await expect(page.locator('#editorMergeFileButton')).toBeVisible();

    await expect(page.locator('#editorMergePageField')).toBeHidden();
    await page.locator('#editorMergePosition').selectOption('after-page');
    await expect(page.locator('#editorMergePageField')).toBeVisible();
    await page.locator('#editorMergePosition').selectOption('after-document');
    await expect(page.locator('#editorMergePageField')).toBeHidden();

    const panel = await page.locator('#editorMergePanel').boundingBox();
    const thumbs = await page.locator('.portal-pdf-thumb-wrap').evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }));
    const viewport = page.viewportSize();
    if (viewport.width <= 720) {
      const firstTop = Math.min(...thumbs.map((box) => box.y));
      expect(panel.y + panel.height).toBeLessThanOrEqual(firstTop + 2);
    } else {
      for (const box of thumbs) {
        expect(box.x + box.width).toBeLessThanOrEqual(panel.x + 2);
      }
      const firstRowY = Math.min(...thumbs.map((box) => box.y));
      expect(thumbs.some((box) => box.y > firstRowY + 20)).toBe(true);
    }

    const chooserPromise = page.waitForEvent('filechooser');
    await page.locator('#editorMergeFileButton').click();
    const chooser = await chooserPromise;
    await chooser.setFiles({
      name: 'imagem-para-unir.png',
      mimeType: 'image/png',
      buffer: ONE_PIXEL_PNG
    });

    await expect(page.locator('#editorMergeSelectionLab')).toContainText('1 arquivo do dispositivo selecionado');
    await expect(page.locator('#editorMergePreviewLab')).toBeVisible();
    await expect(page.locator('#editorMergePreviewLab .documents-editor-merge-preview-item')).toHaveCount(1);
    await expect(page.locator('#editorMergePreviewLab .documents-editor-merge-preview-name')).toHaveText('imagem-para-unir.png');
    await expect(page.locator('#editorMergePreviewLab img')).toHaveCount(1);

    await page.locator('#editorMergeConfirm').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('#editorMergePanel')).toBeHidden();
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(6);
    finishMonitoring();
  });

  test('atalhos de teclado desfazem/refazem sem capturar campos de edição', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(3);
    await page.locator('#editorBlank').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(4);

    await page.keyboard.press('Control+z');
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(3);

    await page.keyboard.press('Control+Shift+z');
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(4);

    await page.keyboard.press('Control+z');
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(3);
    await page.keyboard.press('Control+y');
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(4);

    await page.locator('#editorMerge').click();
    await page.locator('#editorMergePosition').selectOption('after-page');
    const pageField = page.locator('#editorMergeAfterPage');
    await pageField.fill('2');
    await pageField.press('Control+z');
    await expect(page.locator('.portal-pdf-thumb')).toHaveCount(4);

    finishMonitoring();
  });

  test('preserva página e zoom vivos ao atualizar e após rebuild de edição', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    await page.locator('.portal-pdf-thumb').nth(1).click();
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');
    await page.evaluate(() => window.PortalPdfViewer.zoomIn());
    const zoomBefore = (await page.locator('#zoomReset').textContent())?.trim() || '';
    expect(zoomBefore).toMatch(/%/);

    await page.evaluate(() => window.CentralDocsEditorHarness.refreshForTest());
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');
    await expect(page.locator('#zoomReset')).toHaveText(zoomBefore);

    await page.locator('.portal-pdf-thumb').nth(1).click();
    await page.locator('.portal-pdf-thumb-wrap').nth(1).locator('[data-thumbnail-action="rotate-left"]').click();
    await waitForOrder(page, '0:0,0:1,0:2');
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');
    await expect(page.locator('#zoomReset')).toHaveText(zoomBefore);

    finishMonitoring();
  });

});
