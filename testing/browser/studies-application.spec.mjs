import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { missionById } from '../../worker/studies-content/manifest.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';

function publicFixture(missionId) {
  const original = missionById(missionId);
  return structuredClone({
    ...original,
    // Mesmo contrato público: não enviar gabaritos da prova para o navegador.
    questions: original.questions.map(({ id, prompt, options }) => ({ id, prompt, options })),
    sources: []
  });
}

async function setup(page, theme = 'light', missingContent = false, missionId = 'banking.sfn.introducao') {
  const mission = publicFixture(missionId);
  if (missingContent) for (const section of mission.sections) delete section.applicationTasks;
  const payload = {
    user: { username: 'wellyton', name: 'Estudante sintético' }, missions: [mission], progress: {},
    attemptedQuestions: {}, reviews: [],
    metrics: { xp: 0, level: 1, levelTitle: 'Iniciante', nextLevelXp: 150, hoursSeconds: 0, questions: 0, accuracy: 0, reviewsDue: 0, publishedMissions: 1, plannedMissions: 9, campaignAvailability: 11.1, completedPublished: 0, campaignProgress: 0, availableCompletion: 0, streak: { current: 0, best: 0 } }
  };
  const errors = [];
  const unexpected = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const auth = `window.__studyCalls=[];window.__payload=${JSON.stringify(payload)};
    window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),logout:async()=>{},api:async(route,options={})=>{
      window.__studyCalls.push({route,body:options.body||''});
      if(route.endsWith('/bootstrap'))return structuredClone(window.__payload);
      if(route.endsWith('/sessions'))return {sessionId:'session-synthetic'};
      if(route.endsWith('/attempts'))return {correct:true,explanation:'Correção sintética do teste.'};
      return {finished:true};
    }};`;
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) { unexpected.push(url.origin + url.pathname); return route.abort(); }
    const name = url.pathname;
    if (name === '/estudos/') {
      const html = (await readFile(path.join(root, 'estudos/index.html'), 'utf8'))
        .replace('<html lang="pt-BR">', `<html lang="pt-BR" data-portal-theme="${theme}">`)
        .replace(/<link rel="preconnect"[^>]*>/g, '');
      return route.fulfill({ contentType: 'text/html', body: html });
    }
    if (name === '/js/auth-client.js') return route.fulfill({ contentType: 'text/javascript', body: auth });
    if (['/js/studies.js', '/js/studies-reader.js'].includes(name)) {
      return route.fulfill({ contentType: 'text/javascript', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    }
    if (name.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: '' });
    if (name.startsWith('/css/') && name.endsWith('.css')) {
      return route.fulfill({ contentType: 'text/css', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    }
    if (name.startsWith('/assets/')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' });
    unexpected.push(name);
    return route.abort();
  });
  await page.goto(`${origin}/estudos/`);
  await expect(page.locator('#continueStudy')).toBeEnabled();
  await page.locator('#continueStudy').click();
  await expect(page.locator('#studyFocus')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__studyCalls.some((call) => call.route.endsWith('/sessions')))).toBe(true);
  return { errors, unexpected };
}

for (const [width, height] of [[320, 568], [390, 844], [1280, 800]]) {
  for (const theme of ['light', 'dark']) {
    test(`aplicação guiada preserva leitura e respostas ${width} ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      const { errors, unexpected } = await setup(page, theme);
      await expect(page.locator('#studyPracticePanel')).toBeHidden();
      const callsBefore = await page.evaluate(() => window.__studyCalls.length);
      await page.locator('#studyPracticeButton').click();
      await expect(page.locator('.study-application-task')).toHaveCount(3);
      await expect(page.locator('#studyApplicationPanel')).toContainText('sem nota ou XP');
      const draft = page.locator('#studyApplicationDraft0');
      await draft.fill('Rascunho PRIVADO de teste, que não deve ser enviado.');
      const scored = page.locator('[data-question-id="q.sfn.01"]');
      await scored.locator('input').nth(1).check();
      const task = page.locator('.study-application-task').first();
      await expect(task.locator('details')).not.toHaveAttribute('open', '');
      await task.locator('summary').click();
      await expect(task.locator('details')).toHaveAttribute('open', '');
      await expect(task.locator('li')).toHaveCount(3);
      await task.locator('[data-read-section="bcb"]').click();
      await expect(page.locator('#studyPracticePanel')).toBeHidden();
      await expect(page.locator('#studyPartLabel')).toContainText('Parte 8 de 15');
      await page.locator('#studyPracticeButton').click();
      await expect(draft).toHaveValue('Rascunho PRIVADO de teste, que não deve ser enviado.');
      await expect(scored.locator('input').nth(1)).toBeChecked();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
      await expect(page.locator('#completeMission')).toBeDisabled();
      expect(await page.evaluate(() => window.__studyCalls.length)).toBe(callsBefore);
      expect(await page.evaluate(() => JSON.stringify(window.__studyCalls))).not.toContain('PRIVADO');
      for (let i = 0; i < 3; i++) await page.locator('#studyFontLarger').click();
      expect(await page.locator('#studyFocusBody').evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      await scored.locator('button').click();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '1');
      await task.locator('[data-read-section="cmn"]').click();
      await page.locator('#studyPracticeButton').click();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '1');
      await expect(draft).toHaveValue('Rascunho PRIVADO de teste, que não deve ser enviado.');
      expect(await page.evaluate(() => window.__studyCalls.filter((call) => call.route.endsWith('/sessions')).length)).toBe(1);
      expect(errors).toEqual([]);
      expect(unexpected).toEqual([]);
    });
  }
}

test('bootstrap anterior sem suplemento continua utilizável', async ({ page }) => {
  const { errors, unexpected } = await setup(page, 'light', true);
  await page.locator('#studyPracticeButton').click();
  await expect(page.locator('#studyApplicationPanel')).toBeHidden();
  await expect(page.locator('[data-question-id]')).toHaveCount(3);
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('rascunhos são temporários e não viram texto executável', async ({ page }) => {
  const { errors, unexpected } = await setup(page);
  await page.locator('#studyPracticeButton').click();
  await page.locator('#studyApplicationDraft0').fill('<img src=x onerror="window.injected=true">');
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  expect(await page.evaluate(() => JSON.stringify(window.__studyCalls))).not.toContain('onerror');
  await page.locator('#leaveFocus').click();
  await expect(page.locator('#studyDashboard')).toBeVisible();
  await page.locator('#continueStudy').click();
  await page.locator('#studyPracticeButton').click();
  await expect(page.locator('#studyApplicationDraft0')).toHaveValue('');
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

for (const [missionId, sectionId, part, questionId] of [
  ['banking.sfn.cmn', 'composicao', 5, 'q.cmn.01'],
  ['banking.sfn.bacen', 'politicas', 4, 'q.bc.01']
]) {
  for (const theme of ['light', 'dark']) {
    test(`aplicação de ${missionId} reutiliza o leitor sem pontuar o rascunho ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const { errors, unexpected } = await setup(page, theme, false, missionId);
      const calls = await page.evaluate(() => window.__studyCalls.length);
      await expect(page.locator('#studyPracticePanel')).toBeHidden();
      await page.locator('#studyPracticeButton').click();
      await expect(page.locator('.study-application-task')).toHaveCount(3);
      const activity = page.locator('.study-application-task').nth(1);
      const draft = page.locator('#studyApplicationDraft1');
      await draft.fill('EXPLICACAO_PRIVADA_APENAS_NO_DOM');
      const scored = page.locator(`[data-question-id="${questionId}"]`);
      await scored.locator('input').first().check();
      await expect(activity.locator('details')).not.toHaveAttribute('open', '');
      await activity.locator('summary').click();
      await expect(activity.locator('li')).toHaveCount(3);
      await activity.locator(`[data-read-section="${sectionId}"]`).click();
      await expect(page.locator('#studySectionSelect')).toHaveValue(String(part - 1));
      await expect(page.locator('#studyPracticePanel')).toBeHidden();
      await page.locator('#studyPracticeButton').click();
      await expect(draft).toHaveValue('EXPLICACAO_PRIVADA_APENAS_NO_DOM');
      await expect(scored.locator('input').first()).toBeChecked();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
      await expect(page.locator('#completeMission')).toBeDisabled();
      expect(await page.evaluate(() => window.__studyCalls.length)).toBe(calls);
      expect(await page.evaluate(() => JSON.stringify(window.__studyCalls))).not.toContain('EXPLICACAO_PRIVADA');
      for (let index = 0; index < 3; index++) await page.locator('#studyFontLarger').click();
      expect(await page.locator('#studyFocusBody').evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      expect(errors).toEqual([]);
      expect(unexpected).toEqual([]);
    });
  }
}

test('trocar de CMN para Banco Central não mistura casos nem rascunhos', async ({ page }) => {
  const { errors, unexpected } = await setup(page, 'light', false, 'banking.sfn.cmn');
  await page.locator('#studyPracticeButton').click();
  await page.locator('#studyApplicationDraft0').fill('RASCUNHO_DA_AULA_ANTERIOR');
  const next = publicFixture('banking.sfn.bacen');
  await page.evaluate((mission) => { window.__payload.missions = [mission]; }, next);
  await page.locator('#leaveFocus').click();
  await expect(page.locator('#studyDashboard')).toBeVisible();
  await page.locator('#continueStudy').click();
  await page.locator('#studyPracticeButton').click();
  await expect(page.locator('[data-application-id^="apply.cmn."]')).toHaveCount(0);
  await expect(page.locator('[data-application-id^="apply.bcb."]')).toHaveCount(3);
  await expect(page.locator('#studyApplicationDraft0')).toHaveValue('');
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
  expect(await page.evaluate(() => JSON.stringify(window.__studyCalls))).not.toContain('RASCUNHO_DA_AULA_ANTERIOR');
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});
