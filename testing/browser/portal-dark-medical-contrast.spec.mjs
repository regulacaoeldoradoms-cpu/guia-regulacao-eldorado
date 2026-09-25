import { test, expect } from '@playwright/test';
import { installAuditFixture } from './dark-audit-fixture.mjs';

const white = 'rgb(255, 255, 255)';
const fields = ['quandoSolicitar', 'informacoesObrigatorias', 'examesObrigatorios',
  'examesCondicionais', 'complementares', 'ajudaPriorizacao'];
const blocks = '#detailPanel .content-grid > .content-block';

// Real product renderer and styles, with synthetic content and intercepted APIs.
for (const empty of [false, true]) {
  test(`medical content contrast: ${empty ? 'empty states' : 'six populated blocks'}`, async ({ page, context }) => {
    const network = await installAuditFixture(context, { theme: 'dark' });
    await page.goto('/medico/');
    await expect(page.locator('.protocol-card').first()).toBeVisible();
    await page.waitForFunction(() => typeof window.renderProtocol === 'function');
    await page.evaluate(({ fields, empty }) => {
      const protocol = {
        id: 'medical-contrast-synthetic', nome: 'PROTOCOLO FICTÍCIO DE CONTRASTE',
        categoria: 'Teste sintético', faixaEtaria: 'Faixa fictícia',
        sistemas: { sisreg: true, digsus: false, local: false },
        resumo: 'Conteúdo sintético; nenhum dado de paciente.',
        alertas: ['AVISO FICTÍCIO PARA PRESERVAR COR SEMÂNTICA.'],
        subprotocolos: [], fontes: ['Fonte sintética']
      };
      for (const field of fields) protocol[field] = empty ? [] : ['TEXTO FICTÍCIO PARA TESTE DE CONTRASTE.'];
      window.renderProtocol(protocol, { preserveUrl: true });
    }, { fields, empty });

    await expect(page.locator('html')).toHaveAttribute('data-portal-theme', 'dark');
    await expect(page.locator(blocks)).toHaveCount(6);
    const texts = page.locator(`${blocks} ${empty ? 'p.empty' : 'li'}`);
    await expect(texts).toHaveCount(6);
    for (const item of await texts.all()) await expect(item).toHaveCSS('color', white);
    if (!empty) {
      expect(await texts.evaluateAll(nodes => nodes.map(node => getComputedStyle(node, '::marker').color)))
        .toEqual(Array(6).fill(white));
    }
    // The text fix must not recolor the headings or the independent warning.
    await expect(page.locator(`${blocks} h3`).first()).not.toHaveCSS('color', white);
    await expect(page.locator('#detailPanel .clinical-alert li')).not.toHaveCSS('color', white);

    const colors = () => texts.evaluateAll(nodes => nodes.map(node => getComputedStyle(node).color));
    await page.evaluate(() => document.documentElement.dataset.portalTheme = 'light');
    for (const item of await texts.all()) await expect(item).not.toHaveCSS('color', white);
    const lightColors = await colors();
    await page.evaluate(() => document.documentElement.dataset.portalTheme = 'dark');
    await page.emulateMedia({ media: 'print' });
    // Screen-only override: printing retains the original light text colors.
    expect(await colors()).toEqual(lightColors);
    expect(network.unexpected, 'No unknown endpoint may escape synthetic coverage').toEqual([]);
  });
}
