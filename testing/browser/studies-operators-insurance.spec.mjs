import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { missionById } from '../../worker/studies-content/manifest.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';
function publicMission(id) {
  const mission = missionById(id);
  return structuredClone({ ...mission, sources: [], questions: mission.questions.map(({ id, prompt, options }) => ({ id, prompt, options })) });
}
async function setup(page, missionId, theme) {
  const mission = publicMission(missionId);
  const payload = {
    user: { username: 'wellyton', name: 'Estudante sintético' }, missions: [mission], progress: {}, attemptedQuestions: {}, reviews: [],
    metrics: { xp: 0, level: 1, levelTitle: 'Iniciante', nextLevelXp: 150, questions: 0, accuracy: 0, hoursSeconds: 0, reviewsDue: 0, publishedMissions: 1, plannedMissions: 9, campaignAvailability: 11.1, completedPublished: 0, campaignProgress: 0, availableCompletion: 0, streak: { current: 0, best: 0 } }
  };
  const errors = [], unexpected = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const auth = `window.__payload=${JSON.stringify(payload)};window.__calls=[];
    window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),logout:async()=>{},api:async(route,options={})=>{
      window.__calls.push({route,body:options.body||''});
      if(route.endsWith('/bootstrap'))return structuredClone(window.__payload);
      if(route.endsWith('/sessions'))return {sessionId:'session-fixture'};
      if(route.endsWith('/attempts'))return {correct:true,explanation:'Feedback sintético.'};
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
    if (['/js/studies.js', '/js/studies-reader.js'].includes(name)) return route.fulfill({ contentType: 'text/javascript', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    if (name.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: '' });
    if (name.startsWith('/css/') && name.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    if (name.startsWith('/assets/')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' });
    unexpected.push(name);
    return route.abort();
  });
  await page.goto(`${origin}/estudos/`);
  await expect(page.locator('#continueStudy')).toBeEnabled();
  await page.locator('#continueStudy').click();
  await expect.poll(() => page.evaluate(() => window.__calls.some((call) => call.route.endsWith('/sessions')))).toBe(true);
  return { errors, unexpected, mission };
}

for (const [missionId, sectionId] of [
  ['banking.sfn.operadores', 'carteira'],
  ['banking.sfn.seguros-previdencia', 'seguro']
]) {
  for (const theme of ['light', 'dark']) {
    test(`consulta e aplicação de ${missionId} sem enviar rascunho ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const { errors, unexpected, mission } = await setup(page, missionId, theme);
      await expect(page.locator('#studyPracticePanel')).toBeHidden();
      const initialCalls = await page.evaluate(() => window.__calls.length);
      await page.locator('#studyPracticeButton').click();
      const tasks = page.locator('.study-application-task');
      await expect(tasks).toHaveCount(3);
      await expect(page.locator('#studyApplicationPanel')).toContainText('sem nota ou XP');
      const draft = page.locator('#studyApplicationDraft0');
      await draft.fill('RASCUNHO_PRIVADO_OPERACOES');
      const question = page.locator(`[data-question-id="${mission.questions[0].id}"]`);
      await question.locator('input').first().check();
      await expect(tasks.first().locator('details')).not.toHaveAttribute('open', '');
      await tasks.first().locator('summary').click();
      await expect(tasks.first().locator('li')).toHaveCount(3);
      await tasks.first().locator(`[data-read-section="${sectionId}"]`).click();
      await expect(page.locator('#studyPracticePanel')).toBeHidden();
      const part = mission.sections.findIndex((section) => section.id === sectionId);
      await expect(page.locator('#studySectionSelect')).toHaveValue(String(part));
      await expect(page.locator('#lessonSections .study-section').nth(part).locator('p')).toHaveText(mission.sections[part].body);
      await page.locator('#studyPracticeButton').click();
      await expect(draft).toHaveValue('RASCUNHO_PRIVADO_OPERACOES');
      await expect(question.locator('input').first()).toBeChecked();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
      await expect(page.locator('#completeMission')).toBeDisabled();
      expect(await page.evaluate(() => window.__calls.length)).toBe(initialCalls);
      for (let i = 0; i < 3; i++) await page.locator('#studyFontLarger').click();
      expect(await page.locator('#studyFocusBody').evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      await question.locator('button').click();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '1');
      await tasks.first().locator(`[data-read-section="${sectionId}"]`).click();
      await page.locator('#studyPracticeButton').click();
      await expect(question.locator('input').first()).toBeDisabled();
      await expect(draft).toHaveValue('RASCUNHO_PRIVADO_OPERACOES');
      expect(await page.evaluate(() => JSON.stringify(window.__calls))).not.toContain('RASCUNHO_PRIVADO_OPERACOES');
      expect(await page.evaluate(() => window.__calls.filter((call) => call.route.endsWith('/sessions')).length)).toBe(1);
      expect(errors).toEqual([]);
      expect(unexpected).toEqual([]);
    });
  }
}

test('trocar Operadores por Seguros limpa somente rascunhos temporários', async ({ page }) => {
  const { errors, unexpected } = await setup(page, 'banking.sfn.operadores', 'dark');
  await page.locator('#studyPracticeButton').click();
  await page.locator('#studyApplicationDraft0').fill('RASCUNHO_DA_MISSAO_ANTERIOR');
  await page.locator('.study-application-task').first().locator('summary').click();
  await page.evaluate((mission) => { window.__payload.missions = [mission]; }, publicMission('banking.sfn.seguros-previdencia'));
  await page.locator('#leaveFocus').click();
  await expect(page.locator('#studyDashboard')).toBeVisible();
  await page.locator('#continueStudy').click();
  await page.locator('#studyPracticeButton').click();
  await expect(page.locator('[data-application-id^="apply.oper."]')).toHaveCount(0);
  await expect(page.locator('[data-application-id^="apply.segprev."]')).toHaveCount(3);
  await expect(page.locator('#studyApplicationDraft0')).toHaveValue('');
  await expect(page.locator('.study-application-task').first().locator('details')).not.toHaveAttribute('open', '');
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
  expect(await page.evaluate(() => JSON.stringify(window.__calls))).not.toContain('RASCUNHO_DA_MISSAO_ANTERIOR');
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});
