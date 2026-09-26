import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { missionById } from '../../worker/studies-content/manifest.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';
const payments = 'banking.sfn.pagamentos-consorcios';
const boss = 'banking.sfn.boss';
function publicMission(id) {
  const mission = missionById(id);
  return structuredClone({ ...mission, sources: [], questions: mission.questions.map(({ id, prompt, options }) => ({ id, prompt, options })) });
}
async function setup(page, id, theme, { history = false, review = false, missing = false } = {}) {
  const mission = publicMission(id);
  if (missing) for (const section of mission.sections) delete section.applicationTasks;
  const payload = {
    user: { username: 'wellyton', name: 'Estudante sintético' }, missions: [mission], progress: {},
    attemptedQuestions: history ? { [mission.topicId]: mission.questions.map((q) => q.id) } : {},
    reviews: review ? [{ id: 'review-fixture', missionId: id, title: 'Pagamentos', cycle: 1, dueAt: '2026-09-25 12:00:00' }] : [],
    metrics: { xp: 0, level: 1, levelTitle: 'Iniciante', nextLevelXp: 150, questions: 0, accuracy: 0, hoursSeconds: 0, reviewsDue: review ? 1 : 0, publishedMissions: 1, plannedMissions: 9, campaignAvailability: 11.1, completedPublished: 0, campaignProgress: 0, availableCompletion: 0, streak: { current: 0, best: 0 } }
  };
  const errors = [], unexpected = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const auth = `window.__payload=${JSON.stringify(payload)};window.__calls=[];
    window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),logout:async()=>{},api:async(route,options={})=>{
      window.__calls.push({route,body:options.body||''});
      if(route.endsWith('/bootstrap'))return structuredClone(window.__payload);
      if(route.endsWith('/sessions'))return {sessionId:'session-fixture'};
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
    if (['/js/studies.js', '/js/studies-reader.js'].includes(name)) return route.fulfill({ contentType: 'text/javascript', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    if (name.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: '' });
    if (name.startsWith('/css/') && name.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    if (name.startsWith('/assets/')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' });
    unexpected.push(name);
    return route.abort();
  });
  await page.goto(`${origin}/estudos/`);
  await expect(page.locator('#continueStudy')).toBeEnabled();
  await page.locator(review ? '#startReview' : '#continueStudy').click();
  await expect.poll(() => page.evaluate(() => window.__calls.some((call) => call.route.endsWith('/sessions')))).toBe(true);
  return { errors, unexpected, mission };
}

for (const [id, sectionId] of [[payments, 'spi'], [boss, 'mapa-monetario']]) {
  for (const theme of ['light', 'dark']) {
    test(`aplicação de ${id} preserva ensino e respostas ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const { errors, unexpected, mission } = await setup(page, id, theme);
      await expect(page.locator('#studyPracticePanel')).toBeHidden();
      const calls = await page.evaluate(() => window.__calls.length);
      await page.locator('#studyPracticeButton').click();
      await expect(page.locator('.study-application-task')).toHaveCount(3);
      const card = page.locator('.study-application-task').first();
      const draft = page.locator('#studyApplicationDraft0');
      await draft.fill('RASCUNHO_PRIVADO_PAGAMENTOS');
      const question = page.locator(`[data-question-id="${mission.questions[0].id}"]`);
      await question.locator('input').first().check();
      await card.locator('summary').click();
      await expect(card.locator('li')).toHaveCount(3);
      await card.locator(`[data-read-section="${sectionId}"]`).click();
      const index = mission.sections.findIndex((s) => s.id === sectionId);
      await expect(page.locator('#studySectionSelect')).toHaveValue(String(index));
      await expect(page.locator('#lessonSections .study-section').nth(index).locator('p')).toHaveText(mission.sections[index].body);
      await page.locator('#studyPracticeButton').click();
      await expect(draft).toHaveValue('RASCUNHO_PRIVADO_PAGAMENTOS');
      await expect(question.locator('input').first()).toBeChecked();
      await expect(page.locator('#completeMission')).toBeDisabled();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
      expect(await page.evaluate(() => window.__calls.length)).toBe(calls);
      for (let i = 0; i < 3; i++) await page.locator('#studyFontLarger').click();
      expect(await page.locator('#studyFocusBody').evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      await question.locator('button').click();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '1');
      await card.locator(`[data-read-section="${sectionId}"]`).click();
      await page.locator('#studyPracticeButton').click();
      await expect(question.locator('input').first()).toBeDisabled();
      await expect(draft).toHaveValue('RASCUNHO_PRIVADO_PAGAMENTOS');
      expect(await page.evaluate(() => JSON.stringify(window.__calls))).not.toContain('RASCUNHO_PRIVADO_PAGAMENTOS');
      expect(await page.evaluate(() => window.__calls.filter((call) => call.route.endsWith('/sessions')).length)).toBe(1);
      expect(errors).toEqual([]);
      expect(unexpected).toEqual([]);
    });
  }
}

test('autoavaliação cumulativa e histórico não vencem o Chefe', async ({ page }) => {
  const { errors, unexpected } = await setup(page, boss, 'dark', { history: true });
  await page.locator('#studyPracticeButton').click();
  for (let index = 0; index < 3; index++) {
    await page.locator(`#studyApplicationDraft${index}`).fill('Explicação sem envio');
    await page.locator('.study-application-task').nth(index).locator('summary').click();
  }
  await expect(page.locator('[data-question-id]')).toHaveCount(12);
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
  await expect(page.locator('#completeMission')).toBeDisabled();
  expect(await page.evaluate(() => window.__calls.filter((call) => /attempts|complete/.test(call.route)))).toEqual([]);
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('revisão de Pagamentos exige prática nova apesar do suplemento', async ({ page }) => {
  const { errors, unexpected } = await setup(page, payments, 'light', { history: true, review: true });
  await page.locator('#studyPracticeButton').click();
  await expect(page.locator('.study-application-task')).toHaveCount(3);
  await page.locator('#studyApplicationDraft0').fill('Explicação temporária da revisão');
  await page.locator('.study-application-task').first().locator('summary').click();
  await expect(page.locator('[data-question-id]')).toHaveCount(4);
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
  await expect(page.locator('#completeMission')).toBeDisabled();
  expect(await page.evaluate(() => window.__calls.filter((call) => /attempts|complete/.test(call.route)))).toEqual([]);
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('trocar Pagamentos pelo Chefe não carrega o rascunho anterior', async ({ page }) => {
  const { errors, unexpected } = await setup(page, payments, 'dark');
  await page.locator('#studyPracticeButton').click();
  await page.locator('#studyApplicationDraft0').fill('RASCUNHO_ANTERIOR');
  await page.locator('.study-application-task').first().locator('summary').click();
  await page.evaluate((mission) => { window.__payload.missions = [mission]; }, publicMission(boss));
  await page.locator('#leaveFocus').click();
  await expect(page.locator('#studyDashboard')).toBeVisible();
  await page.locator('#continueStudy').click();
  await page.locator('#studyPracticeButton').click();
  await expect(page.locator('[data-application-id^="apply.pag."]')).toHaveCount(0);
  await expect(page.locator('[data-application-id^="apply.boss."]')).toHaveCount(3);
  await expect(page.locator('#studyApplicationDraft0')).toHaveValue('');
  await expect(page.locator('.study-application-task').first().locator('details')).not.toHaveAttribute('open', '');
  expect(await page.evaluate(() => JSON.stringify(window.__calls))).not.toContain('RASCUNHO_ANTERIOR');
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('Chefe sem novo suplemento mantém preparação e 12 questões', async ({ page }) => {
  const { errors, unexpected, mission } = await setup(page, boss, 'light', { missing: true });
  await expect(page.locator('#lessonSections .study-section')).toHaveCount(mission.sections.length);
  await page.locator('#studyPracticeButton').click();
  await expect(page.locator('#studyApplicationPanel')).toBeHidden();
  await expect(page.locator('[data-question-id]')).toHaveCount(12);
  await expect(page.locator('#completeMission')).toBeDisabled();
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});
