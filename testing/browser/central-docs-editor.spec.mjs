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
    await page.clock.install({ time: new Date('2026-09-24T12:00:00Z') });
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
      '/assets/Drive_normal.png',
      '/assets/Drive_pendente.png',
      '/assets/Drive_sincronizando.png',
      '/assets/Drive_sincronizado_1seg.png',
      '/assets/Drive_falha.png'
    ];

    for (const asset of assets) {
      const response = await request.get(asset);
      expect(response.ok()).toBe(true);
      expect((await response.body()).byteLength).toBeGreaterThan(100);
    }

    for (const selector of ['#zoomOut', '#zoomIn', '#fitWidth', '#editorOrganize', '#editorExport', '#editorPrint', '#editorExit']) {
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

    const driveStates = [
      ['normal', 'Drive_normal.png'],
      ['pending', 'Drive_pendente.png'],
      ['syncing', 'Drive_sincronizando.png'],
      ['success', 'Drive_sincronizado_1seg.png'],
      ['failed', 'Drive_falha.png']
    ];
    for (const [state, filename] of driveStates) {
      await page.evaluate((value) => window.CentralDocsEditorHarness.setSyncStateForTest(value), state);
      await expect(page.locator('#editorSync')).toHaveAttribute('data-sync-state', state);
      const background = await page.locator('#editorSync').evaluate((node) => getComputedStyle(node).backgroundImage);
      expect(background).toContain('/assets/' + filename);
    }

    await page.evaluate(() => window.CentralDocsEditorHarness.setSyncStateForTest('normal'));
    await expect(page.locator('#editorSync')).toHaveAttribute('title', 'Forçar sincronização com Google Drive');

    // O autosync do laboratório usa timers locais, sem resposta de rede. Pause
    // antes da ação para que o polling do CI não pule os 900 ms de "syncing".
    // Avance os intervalos reais do harness sem ampliar timeouts ou forçar estados.
    await page.clock.pauseAt(new Date('2026-09-24T13:00:00Z'));
    // Este cenário valida o estado visual do autosync; o clique forçado evita
    // flutuação de hit-test entre o botão de ação da miniatura e o canvas no desktop.
    await page.locator('.portal-pdf-thumb-wrap').first().locator('[data-thumbnail-action="rotate-right"]').click({ force: true });
    // PDF.js needs animation frames while rebuilding after the real rotation.
    // Advance only short frame intervals until the harness schedules autosync.
    await expect.poll(async () => {
      await page.clock.runFor(50);
      return page.locator('#editorSync').getAttribute('data-sync-state');
    }).toBe('pending');
    await page.clock.runFor(1000);
    await expect(page.locator('#editorSync')).toHaveAttribute('data-sync-state', 'syncing', { timeout: 3500 });
    await page.clock.runFor(900);
    await expect(page.locator('#editorSync')).toHaveAttribute('data-sync-state', 'success', { timeout: 3500 });
    await page.clock.runFor(1000);
    await expect(page.locator('#editorSync')).toHaveAttribute('data-sync-state', 'normal', { timeout: 3500 });

    await page.locator('#editorSync').click();
    await expect(page.locator('html')).toHaveAttribute('data-sync-preview', 'force-visible');
    await expect(page.locator('#editorSync')).toHaveAttribute('data-sync-state', 'syncing');

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

    // O canvas da miniatura pode interceptar o hit-test no Chromium desktop;
    // aqui validamos a ação sintética, não a geometria do clique.
    await page.locator('.portal-pdf-thumb-wrap').first().locator('[data-thumbnail-action="duplicate"]').click({ force: true });
    await waitForOrder(page, '0:0,0:0,0:1,0:2');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(4);
    await page.locator('#editorUndo').click();
    await waitForOrder(page, '0:0,0:1,0:2');
    await page.locator('#editorRedo').click();
    await waitForOrder(page, '0:0,0:0,0:1,0:2');

    await page.locator('#editorBlank').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(5);
    const blankIndex = await page.locator('html').getAttribute('data-page-kinds');
    expect(blankIndex).toContain('blank');
    await page.locator('#editorUndo').click();
    await expect(page.locator('.portal-pdf-page')).toHaveCount(4);
    await page.locator('#editorRedo').click();
    await expect(page.locator('.portal-pdf-page')).toHaveCount(5);

    finishMonitoring();
  });

  test('adicionar imagem e unir PDF atualizam o PDF na mesma superfície', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    await page.locator('#editorAddImage').click();
    await page.locator('#editorAddImageInput').setInputFiles({
      name: 'teste.png',
      mimeType: 'image/png',
      buffer: ONE_PIXEL_PNG
    });
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(4);
    expect(await page.locator('html').getAttribute('data-page-kinds')).toContain('image');

    await page.locator('#editorMerge').click();
    await expect(page.locator('#editorMergePanel')).toBeVisible();
    await page.locator('#editorMergeConfirm').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(7);
    await expect(page.locator('#editorMergePanel')).toBeHidden();

    finishMonitoring();
  });

  test('painel Unir mostra preview local e força novas páginas para a linha seguinte sem sobreposição', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    await page.locator('#editorMerge').click();
    await expect(page.locator('#editorMergePanel')).toBeVisible();
    await expect(page.locator('#editorMergeSelectionLab')).toContainText('Segundo PDF sintético de 3 páginas');
    await expect(page.locator('#editorMergeConfirm')).toBeEnabled();

    await page.locator('#editorMergeFileInput').setInputFiles([
      { name: 'local-a.png', mimeType: 'image/png', buffer: ONE_PIXEL_PNG },
      { name: 'local-b.png', mimeType: 'image/png', buffer: ONE_PIXEL_PNG }
    ]);
    await expect(page.locator('#editorMergeConfirm')).toBeEnabled();
    await expect(page.locator('#editorMergeSelectionLab')).toContainText('2 arquivos do dispositivo selecionados');
    await expect(page.locator('#editorMergePreviewLab .documents-editor-merge-preview-item')).toHaveCount(2);
    await expect(page.locator('#editorMergePreviewLab .documents-editor-merge-preview-thumb img')).toHaveCount(2);
    await page.waitForFunction(() => [...document.querySelectorAll('#editorMergePreviewLab img')]
      .every((image) => image.complete && image.naturalWidth > 0));

    const panelBox = await page.locator('#editorMergePanel').boundingBox();
    const previewBoxes = await page.locator('#editorMergePreviewLab .documents-editor-merge-preview-item').evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom };
    }));
    const editorBox = await page.locator('#pdfRoot').boundingBox();
    expect(panelBox).not.toBeNull();
    expect(editorBox).not.toBeNull();
    expect(previewBoxes).toHaveLength(2);
    for (const box of previewBoxes) {
      expect(box.left).toBeGreaterThanOrEqual((panelBox?.x || 0) - 1);
      expect(box.right).toBeLessThanOrEqual((panelBox?.x || 0) + (panelBox?.width || 0) + 1);
      expect(box.bottom).toBeLessThanOrEqual((editorBox?.y || 0) + (editorBox?.height || 0) + 1);
    }

    const currentThumbs = await page.locator('.portal-pdf-thumb').count();
    const currentRects = await page.locator('.portal-pdf-thumb').evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom };
    }));
    expect(currentRects.length).toBe(currentThumbs);
    if (currentRects.length > 1) {
      const distinctRows = [...new Set(currentRects.map((rect) => Math.round(rect.top)))];
      const viewport = page.viewportSize();
      if ((viewport?.width || 0) <= 720) {
        expect(distinctRows.length).toBeGreaterThan(1);
      } else {
        expect(distinctRows.length).toBe(1);
      }
    }

    finishMonitoring();
  });

  test('atalhos de teclado desfazem/refazem sem capturar campos de edição', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);
    await enterEditor(page);

    await page.locator('#editorBlank').click();
    await expect(page.locator('.portal-pdf-page')).toHaveCount(4);
    await page.keyboard.press('Control+Z');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(3);
    await page.keyboard.press('Control+Shift+Z');
    await expect(page.locator('.portal-pdf-page')).toHaveCount(4);

    await page.locator('#editorMerge').click();
    await page.locator('#editorMergePosition').selectOption('after-page');
    await expect(page.locator('#editorMergePageField')).toBeVisible();
    await page.locator('#editorMergeAfterPage').fill('2');
    await page.locator('#editorMergeAfterPage').press('Control+Z');
    await expect(page.locator('#editorMergeAfterPage')).toHaveValue('2');

    finishMonitoring();
  });

  test('preserva página e zoom vivos ao atualizar e após rebuild de edição', async ({ page }) => {
    const finishMonitoring = monitorPage(page);
    await openLab(page);

    // Em Organizar a toolbar do visualizador é intencionalmente ocultada;
    // portanto o estado vivo de zoom/página é estabelecido antes de entrar no editor.
    await page.locator('#zoomIn').click();
    const zoomBefore = await page.locator('#zoomReset').textContent();
    await page.locator('.portal-pdf-thumb').nth(1).click();
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');

    await enterEditor(page);
    await expect(page.locator('#zoomReset')).toHaveText(zoomBefore || '');
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');

    await page.evaluate(() => window.CentralDocsEditorHarness.refreshForTest());
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('#zoomReset')).toHaveText(zoomBefore || '');
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '2');

    await page.locator('#editorBlank').click();
    await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
    await expect(page.locator('#zoomReset')).toHaveText(zoomBefore || '');
    await expect(page.locator('html')).toHaveAttribute('data-active-page', '3');

    finishMonitoring();
  });
});
