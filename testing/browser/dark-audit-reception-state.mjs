import { expect } from '@playwright/test';

// The unchanged reception-ux and reception-clinical-checklist initializers use
// different empty-summary wording. Wait for the fetched clinical section before
// using the real "Desmarcar tudo" action, so both source versions reach the same
// user-controlled state instead of comparing whichever initializer ran last.
export async function prepareReceptionChecklist(page, info) {
  await page.locator('#receptionProtocolList button').first().click();
  await expect(page.locator('[data-clinical-checklist="1"]')).toBeVisible();
  const clear = page.locator('#clearReceptionChecklistBottom');
  await expect(clear).toHaveText('Desmarcar tudo');
  const before = await page.locator('#receptionSummaryText').textContent();
  await clear.click();
  await expect(page.locator('#receptionDetail .fast-check input:checked')).toHaveCount(0);
  await expect(page.locator('#receptionSummaryTitle')).toHaveText('Pode imprimir a lista completa');
  await expect(page.locator('#receptionSummaryText')).toHaveText('Nenhuma caixa marcada. A impressão mostrará tudo que deve ser conferido para esta solicitação.');
  // Clicking the bottom action scrolls a mobile viewport. A full-page capture
  // still places fixed controls relative to that scroll position, so restore
  // the same capture origin explicitly after exercising the actual UI.
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => [window.scrollX, window.scrollY])).toEqual([0, 0]);
  const state = await page.evaluate(() => ({
    action: 'Clicked the visible Desmarcar tudo control after the clinical section loaded',
    protocol: document.querySelector('#receptionProtocolList button.active')?.dataset.id,
    clinicalSignature: document.querySelector('[data-clinical-checklist="1"]')?.dataset.signature,
    rows: document.querySelectorAll('#receptionDetail .reception-item').length,
    checked: document.querySelectorAll('#receptionDetail .fast-check input:checked').length,
    viewport: { width: window.innerWidth, height: window.innerHeight, scrollX: window.scrollX, scrollY: window.scrollY,
      visualWidth: window.visualViewport?.width, visualHeight: window.visualViewport?.height, visualOffsetTop: window.visualViewport?.offsetTop },
    title: document.querySelector('#receptionSummaryTitle')?.textContent,
    text: document.querySelector('#receptionSummaryText')?.textContent
  }));
  await info.attach('reception-preparation.json', {
    body: Buffer.from(JSON.stringify({ before, ...state }, null, 2)), contentType: 'application/json'
  });
}
