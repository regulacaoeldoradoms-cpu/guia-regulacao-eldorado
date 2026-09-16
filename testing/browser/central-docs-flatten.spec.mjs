import { test, expect } from '@playwright/test';

async function openEditor(page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-viewer-state', 'ready');
  await page.locator('#enterEditor').click();
  await expect(page.locator('html')).toHaveAttribute('data-operation-state', 'ready');
}

test.describe('Central de Documentos — 3C.6 flatten/exportação local', () => {
  test('PDF final incorpora texto, imagem, desenho e crop sem contaminar o preview estrutural', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await openEditor(page);
    await page.evaluate(() => window.CentralDocsEditorHarness.seedFlattenFixture());

    const diagnostics = await page.evaluate(() => window.CentralDocsEditorHarness.flattenDiagnostics());

    expect(diagnostics.revisionAfter).toBe(diagnostics.revisionBefore);
    expect(diagnostics.structural.header).toBe('%PDF');
    expect(diagnostics.flattened.header).toBe('%PDF');
    expect(diagnostics.flattened.pageCount).toBe(3);

    expect(diagnostics.structural.pages[0].text).not.toContain('FLATTEN 3C6');
    expect(diagnostics.structural.pages[0].imageOps).toBe(0);

    expect(diagnostics.flattened.pages[0].text).toContain('FLATTEN 3C6');
    expect(diagnostics.flattened.pages[0].imageOps).toBeGreaterThan(0);
    expect(diagnostics.flattened.pages[0].pathOps).toBeGreaterThan(diagnostics.structural.pages[0].pathOps);

    expect(diagnostics.flattened.pages[1].width).toBeLessThan(diagnostics.structural.pages[1].width * .8);
    expect(diagnostics.flattened.pages[1].height).toBeLessThan(diagnostics.structural.pages[1].height * .8);

    expect(diagnostics.flattened.pages[2].rotation).toBe(180);

    await expect(page.locator('html')).toHaveAttribute('data-flatten-state', 'ready');
    expect(Number(await page.locator('html').getAttribute('data-flatten-size'))).toBeGreaterThan(500);
    expect(errors).toEqual([]);
  });

  test('botão Exportar gera download local sem sair do editor', async ({ page }) => {
    await openEditor(page);
    await page.evaluate(() => window.CentralDocsEditorHarness.seedFlattenFixture());

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#editorExport').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('synthetic-3-pages-editado.pdf');
    await expect(page.locator('html')).toHaveAttribute('data-flatten-state', 'downloaded');
    await expect(page.locator('html')).toHaveAttribute('data-editor-mode', 'editor');
    expect(Number(await page.locator('html').getAttribute('data-flatten-size'))).toBeGreaterThan(500);
  });
});
