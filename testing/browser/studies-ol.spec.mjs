import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadOlEditorial, compileOlCandidate } from '../../worker/scripts/studies-ol-candidate.mjs';
import { OA_MISSIONS } from '../../worker/studies-content/portuguese-accentuation-v1.js';
import { PT_MISSIONS } from '../../worker/studies-content/portuguese-text-v1.js';
import { LP_MISSIONS } from '../../worker/studies-content/portuguese-reading-v1.js';
import { IS_MISSIONS } from '../../worker/studies-content/banking-institution-specific-v1.js';
import { DP_MISSIONS } from '../../worker/studies-content/banking-digital-payments-v1.js';
import { PUBLISHED_MISSIONS } from '../../worker/studies-content/manifest.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';
const candidate = compileOlCandidate(await loadOlEditorial());
// Fixture exclusiva de UI: inclui drafts para exercitar apresentação futura. Nenhuma ativação no runtime.
const all = [...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...LP_MISSIONS, ...PT_MISSIONS, ...OA_MISSIONS, ...candidate.missions];
const boss = candidate.missions.at(-1);
const publicMissions = all.map(mission => ({ ...mission, sources: [],
  questions: mission.questions.map(({ id, prompt, options, presentation }) => ({ id, prompt, options, ...(presentation ? { presentation } : {}) })) }));

async function setup(page, { theme = 'light', resume = false, username = 'wellyton' } = {}) {
  const payload = {
    roundProtocol: 1, resumeProtocol: 1,
    user: { username, name: 'Estudante sintético' }, missions: publicMissions,
    progress: Object.fromEntries(all.filter(mission => mission.id !== boss.id).map(mission => [mission.topicId, { coverageState: 3, masteryScore: 0 }])),
    attemptedQuestions: {}, reviews: [],
    resumableSession: resume ? { sessionId: 'ol-resume', missionId: boss.id, mode: 'boss', reviewId: null,
      durationSeconds: 30, answeredQuestionIds: [boss.questions[10].id] } : null,
    metrics: { xp: 100, level: 1, levelTitle: 'Estudante', nextLevelXp: 150, questions: 1, accuracy: 0, hoursSeconds: 30,
      reviewsDue: 0, publishedMissions: 86, plannedMissions: 86, completedPublished: 85, campaignProgress: 98,
      availableCompletion: 98, campaignAvailability: 100, streak: { current: 1, best: 1 } }
  };
  const errors = [], unexpected = [];
  page.on('pageerror', error => errors.push(error.message));
  const auth = `window.__calls=[];window.__attemptRecords={};window.__payload=${JSON.stringify(payload)};
    const questions=${JSON.stringify(boss.questions)};const coverage=${JSON.stringify(boss.teaching.questionCoverage)};
    window.RegulationAuth={requireRole:async()=>({username:${JSON.stringify(username)}}),logout:async()=>{},api:async(route,options={})=>{
      const body=options.body?JSON.parse(options.body):null;window.__calls.push({route,method:options.method,body});
      if(route.endsWith('/bootstrap'))return structuredClone(window.__payload);
      if(route.endsWith('/sessions'))return {sessionId:'ol-local-session'};
      if(route.endsWith('/attempts')){
        const question=questions.find(q=>q.id===body.questionId);
        const recorded=!window.__attemptRecords[body.questionId];window.__attemptRecords[body.questionId]=body.selectedOption+1;
        if(window.__delayAnswer)await new Promise(resolve=>{window.__releaseAnswer=resolve});
        if(window.__failNextAnswer){window.__failNextAnswer=false;throw Error('Resposta perdida na rede sintética');}
        return {correct:body.selectedOption===question.answer,recorded,correctOption:question.answer,
          explanation:question.explanation,selectedFeedback:question.optionRationales[body.selectedOption],reviewRefs:coverage[question.id]};
      }
      if(options.method==='PATCH')return {finished:true,durationSeconds:body.durationSeconds};
      if(route.endsWith('/complete'))throw Error('Conclusão não esperada neste teste');
      return {finished:true};
    }};`;
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) { unexpected.push(url.origin + url.pathname); return route.abort(); }
    const file = url.pathname;
    if (file === '/estudos/') return route.fulfill({ contentType: 'text/html', body: (await readFile(path.join(root, 'estudos/index.html'), 'utf8'))
      .replace('<html lang="pt-BR">', `<html lang="pt-BR" data-portal-theme="${theme}">`).replace(/<link rel="preconnect"[^>]*>/g, '') });
    if (file === '/ferramentas/') return route.fulfill({ contentType: 'text/html', body: '<p>Ferramentas sintéticas</p>' });
    if (file === '/js/auth-client.js') return route.fulfill({ contentType: 'text/javascript', body: auth });
    if (['/js/studies.js', '/js/studies-reader.js'].includes(file)) return route.fulfill({ contentType: 'text/javascript', body: await readFile(path.join(root, file.slice(1)), 'utf8') });
    if (file.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: '' });
    if (file.startsWith('/css/') && file.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: await readFile(path.join(root, file.slice(1)), 'utf8') });
    if (file.startsWith('/assets/')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg"/>' });
    unexpected.push(file); return route.abort();
  });
  await page.goto(`${origin}/estudos/`);
  if (username !== 'wellyton') return { errors, unexpected };
  await expect(page.locator('#continueStudy')).toBeEnabled();
  await page.locator('#continueStudy').click();
  await expect(page.locator('#focusTitle')).toContainText(boss.title);
  await page.getByRole('button', { name: 'Aula inteira', exact: true }).click();
  return { errors, unexpected };
}

async function consult(page, missionId) {
  await page.locator(`#lessonSections [data-study-reference="${missionId}"]`).first().click();
  await expect(page.locator('#studyReferencePanel')).toBeVisible();
}
async function assertNoOverflow(page) {
  expect(await page.locator('#studyFocusBody').evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  for (const chart of await page.locator('.study-chart-scroll:visible').all()) {
    expect(await chart.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  }
}

for (const [width,height,theme] of [[320,568,'light'],[390,844,'dark']]) {
  test('retomadas OL com fonte ampliada '+width+' '+theme, async ({page}) => {
    await page.setViewportSize({width,height});
    const {errors,unexpected}=await setup(page,{theme});
    for(let i=0;i<3;i++)await page.locator('#studyFontLarger').click();
    const reference=page.locator('#studyReferencePanel');
    for(const mission of candidate.missions.slice(0,-1)){
      await consult(page,mission.id);
      await expect(page.locator('#studyReferenceTitle')).toContainText(mission.shortTitle);
      await expect(reference).not.toContainText('](ol-');
      await assertNoOverflow(page);
      await page.locator('#studyCloseReference').click();
    }
    expect(await page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/sessions')).length)).toBe(1);
    expect(errors).toEqual([]);expect(unexpected).toEqual([]);
  });
}
test('consulta, erro de rede e repetição preservam escolha, rodada e resposta única', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { errors, unexpected } = await setup(page);
  await page.locator('#studyPracticeButton').click();
  const question = page.locator('[data-question-id="q.olchefe.q11"]');
  await question.locator('input').first().check();
  await page.locator('#studyReturnLesson').click();
  await consult(page, 'portuguese.spelling.letters.vogais');
  await page.locator('#studyCloseReference').click();
  await page.locator('#studyPracticeButton').click();
  await expect(question.locator('input').first()).toBeChecked();
  await page.evaluate(() => { window.__failNextAnswer = true; });
  await question.locator('[data-answer-question]').click();
  await expect(question.locator('[data-answer-question]')).toHaveText('Tentar registrar novamente');
  await expect(question.locator('input').first()).toBeDisabled();
  await question.locator('[data-answer-question]').click();
  await expect(question.locator('[data-answer-question]')).toHaveText('Respondida');
  const link = question.getByRole('button', { name: /Consultar OL-03:/ }).first();
  for (let i = 0; i < 3; i++) {
    await link.click();
    await expect(page.locator('#studyReferenceTitle')).toHaveText('Consulta · OL-03');
    await expect(page.locator('#studyPracticePanel')).toBeHidden();
    await page.locator('#studyCloseReference').click();
    await expect(page.locator('#studyPracticePanel')).toBeVisible();
    await expect(link).toBeFocused();
    await expect(question.locator('input').first()).toBeChecked();
  }
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '1');
  await expect(page.locator('#completeMission')).toBeDisabled();
  expect(await page.evaluate(() => Object.keys(window.__attemptRecords).length)).toBe(1);
  expect(await page.evaluate(() => window.__calls.filter(call => call.route.endsWith('/attempts')).length)).toBe(2);
  expect(await page.evaluate(() => window.__calls.filter(call => call.route.endsWith('/sessions')).length)).toBe(1);
  expect(errors).toEqual([]); expect(unexpected).toEqual([]);
});

test('resposta pendente termina durante consulta sem perder DOM e saída limpa a consulta', async ({ page }) => {
  const { errors, unexpected } = await setup(page);
  await page.locator('#studyPracticeButton').click();
  const question = page.locator('[data-question-id="q.olchefe.q11"]');
  await question.locator('input').first().check();
  await page.evaluate(() => { window.__delayAnswer = true; });
  await question.locator('[data-answer-question]').click();
  await expect.poll(() => page.evaluate(() => typeof window.__releaseAnswer)).toBe('function');
  await page.locator('#studyReturnLesson').click();
  await consult(page, 'portuguese.spelling.letters.vogais');
  await page.evaluate(() => window.__releaseAnswer());
  await expect(question.locator('[data-answer-question]')).toHaveText('Respondida');
  await page.locator('#studyCloseReference').click();
  await page.locator('#studyPracticeButton').click();
  await expect(question.locator('input').first()).toBeDisabled();
  await question.getByRole('button', { name: /Consultar OL-03:/ }).first().click();
  await page.locator('#leaveFocus').click();
  await expect(page.locator('#studyDashboard')).toBeVisible();
  await page.locator('#continueStudy').click();
  await expect(page.locator('#studyReferencePanel')).toBeHidden();
  await expect(page.locator('#studyLessonPanel')).toBeVisible();
  expect(errors).toEqual([]); expect(unexpected).toEqual([]);
});

test('retomada mantém questão OL respondida sem criar rodada', async ({ page }) => {
  const { errors, unexpected } = await setup(page, { resume: true });
  await consult(page, 'portuguese.spelling.letters.vogais');
  await page.locator('#studyCloseReference').click();
  await page.locator('#studyPracticeButton').click();
  const question = page.locator('[data-question-id="q.olchefe.q11"]');
  await expect(question).toContainText(boss.questions[10].prompt);
  await expect(question.locator('[data-answer-question]')).toBeDisabled();
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '1');
  expect(await page.evaluate(() => window.__calls.filter(call => call.route.endsWith('/sessions')).length)).toBe(0);
  expect(errors).toEqual([]); expect(unexpected).toEqual([]);
});

test('conteúdo candidato não amplia acesso frontend além de wellyton', async ({ page }) => {
  const { errors } = await setup(page, { username: 'outro' });
  await expect(page).toHaveURL(`${origin}/ferramentas/?estudos=acesso-negado`);
  expect(errors).toEqual([]);
});
