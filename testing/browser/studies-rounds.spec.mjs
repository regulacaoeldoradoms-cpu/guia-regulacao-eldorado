import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';
const mission = {
  id: 'fixture.lesson', topicId: 'fixture.lesson', order: 1, contentVersion: 2,
  title: 'Leitura sintética', shortTitle: 'Leitura', xp: 100, estimatedMinutes: 20,
  objective: 'Testar a coordenação de requisições sem dados pessoais.',
  sections: [{ id: 'ensino', heading: 'Explicação', body: 'Material sintético para os testes.' }],
  recall: ['Explique o conceito.'], sources: [],
  questions: [0, 1].map(i => ({ id: `q.fixture.${i}`, prompt: `Pergunta sintética ${i}`, options: ['A', 'B'] }))
};
async function setup(page, mode = '') {
  const payload = {
    roundProtocol: 1, user: { username: 'wellyton', name: 'Estudante sintético' }, missions: [mission],
    progress: {}, attemptedQuestions: {}, reviews: mode === 'review' ? [{ id: 'review-fixture', missionId: mission.id, title: 'Revisão sintética', cycle: 1, dueAt: '2026-09-25 12:00:00' }] : [],
    metrics: { xp: 0, level: 1, levelTitle: 'Iniciante', nextLevelXp: 150, questions: 0, accuracy: 0, hoursSeconds: 0, reviewsDue: 0, publishedMissions: 1, plannedMissions: 9, campaignAvailability: 11.1, completedPublished: 0, campaignProgress: 0, availableCompletion: 0, streak: { current: 0, best: 0 } }
  };
  const errors = [], unexpected = [];
  page.on('pageerror', e => errors.push(e.message));
  const auth = `window.__calls=[];let starts=0,attempts=0,finishes=0;
    const payload=${JSON.stringify(payload)}, mode=${JSON.stringify(mode)};
    window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),logout:async()=>{},api:async(route,options={})=>{
      window.__calls.push({route,method:options.method,body:options.body?JSON.parse(options.body):null});
      if(route.endsWith('/bootstrap')) return structuredClone(payload);
      if(route.endsWith('/sessions')) {
        const id='session-'+(++starts);
        if(mode==='failStart')throw new Error('Falha simulada na abertura');
        if(mode==='holdStart' && starts===1)return new Promise(resolve=>window.__releaseStart=()=>resolve({sessionId:id}));
        return {sessionId:id,roundProtocol:1};
      }
      if(options.method==='PATCH'){
        if(mode==='failFinishOnce' && ++finishes===1)throw new Error('Resposta perdida no fechamento');
        return {finished:true};
      }
      if(route.endsWith('/attempts')){
        attempts++;
        if(mode==='holdAttempt' && attempts===1)return new Promise(resolve=>window.__releaseAttempt=()=>resolve({correct:true,explanation:'Resposta antiga'}));
        if(mode==='failAttemptOnce' && attempts===1)throw new Error('Resposta perdida');
        return {correct:true,explanation:'Comentário sintético',recorded:true};
      }
      if(route.endsWith('/complete')){
        if(mode==='holdComplete')return new Promise(resolve=>window.__releaseComplete=()=>resolve({completed:true,xpGranted:100}));
        return {completed:true,xpGranted:0,newAchievements:[]};
      }
      throw new Error('Endpoint não simulado: '+route);
    }};`;
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) { unexpected.push(url.origin + url.pathname); return route.abort(); }
    const name = url.pathname;
    if (name === '/estudos/') return route.fulfill({ contentType: 'text/html', body: (await readFile(path.join(root, 'estudos/index.html'), 'utf8')).replace(/<link rel="preconnect"[^>]*>/g, '') });
    if (name === '/js/auth-client.js') return route.fulfill({ contentType: 'text/javascript', body: auth });
    if (['/js/studies.js', '/js/studies-reader.js'].includes(name)) return route.fulfill({ contentType: 'text/javascript', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    if (name.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: '' });
    if (name.startsWith('/css/') && name.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    if (name.startsWith('/assets/')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' });
    unexpected.push(name); return route.abort();
  });
  await page.goto(origin + '/estudos/');
  await expect(page.locator('#continueStudy')).toBeEnabled();
  const open = async () => {
    await page.locator(mode === 'review' ? '#startReview' : '#continueStudy').click();
    await expect(page.locator('#studyFocus')).toBeVisible();
    await page.locator('#studyPracticeButton').click();
  };
  const answer = async i => {
    const card = page.locator(`[data-question-id="q.fixture.${i}"]`);
    await card.locator('input').first().check();
    await card.locator('button').click();
    return card;
  };
  const clean = () => { expect(errors).toEqual([]); expect(unexpected).toEqual([]); };
  return { open, answer, clean };
}

test('resposta e conclusão usam o identificador da sessão aberta', async ({ page }) => {
  const {open,answer,clean}=await setup(page);await open();await answer(0);await answer(1);
  await expect(page.locator('#completeMission')).toBeEnabled();await page.locator('#completeMission').click();
  await expect.poll(()=>page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/complete')).length)).toBe(1);
  const calls=await page.evaluate(()=>window.__calls.filter(c=>/attempts|complete/.test(c.route)));
  expect(calls).toHaveLength(3);for(const c of calls)expect(c.body.sessionId).toBe('session-1');clean();
});

test('aula continua legível enquanto a sessão não foi confirmada', async ({ page }) => {
  const {open,answer,clean}=await setup(page,'holdStart');await open();await answer(0);
  expect(await page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/attempts')).length)).toBe(0);
  await expect(page.locator('#completeMission')).toBeDisabled();
  await page.locator('#studyReadButton').click();await expect(page.locator('#lessonSections')).toContainText('Material sintético');
  await page.evaluate(()=>window.__releaseStart());await page.locator('#studyPracticeButton').click();await answer(0);
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow','1');clean();
});

test('clique duplo não cria duas sessões', async ({ page }) => {
  const {clean}=await setup(page,'holdStart');
  await page.locator('#continueStudy').evaluate(button=>{button.click();button.click();});
  await expect.poll(()=>page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/sessions')).length)).toBe(1);
  await page.evaluate(()=>window.__releaseStart());clean();
});

test('abertura atrasada não substitui a sessão de uma missão reaberta', async ({ page }) => {
  const {open,answer,clean}=await setup(page,'holdStart');await open();
  await page.locator('#leaveFocus').click();await expect(page.locator('#studyDashboard')).toBeVisible();await open();
  await page.evaluate(()=>window.__releaseStart());
  await expect.poll(()=>page.evaluate(()=>window.__calls.filter(c=>c.method==='PATCH').length)).toBe(1);
  await answer(0);await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow','1');
  const calls=await page.evaluate(()=>window.__calls);
  expect(calls.find(c=>c.method==='PATCH')).toMatchObject({route:'/api/studies/sessions/session-1',body:{durationSeconds:0}});
  expect(calls.find(c=>c.route.endsWith('/attempts')).body.sessionId).toBe('session-2');clean();
});

test('resposta atrasada não marca uma questão da missão seguinte', async ({ page }) => {
  const {open,answer,clean}=await setup(page,'holdAttempt');await open();await answer(0);
  await page.locator('#leaveFocus').click();await expect(page.locator('#studyDashboard')).toBeVisible();await open();
  await page.evaluate(()=>window.__releaseAttempt());
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow','0');
  await expect(page.locator('[data-question-id="q.fixture.0"] input').first()).toBeEnabled();
  await answer(0);await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow','1');clean();
});

test('repetir envio após falha mantém a mesma resposta e sessão', async ({ page }) => {
  const {open,answer,clean}=await setup(page,'failAttemptOnce');await open();const card=await answer(0);
  await expect(card.locator('button')).toHaveText('Tentar registrar novamente');
  await expect(card.locator('input').first()).toBeDisabled();await card.locator('button').click();
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow','1');
  const calls=await page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/attempts')));
  expect(calls).toHaveLength(2);expect(calls[0].body).toEqual(calls[1].body);clean();
});

test('conclusão tardia não fecha a nova missão nem exibe seu resultado', async ({ page }) => {
  const {open,answer,clean}=await setup(page,'holdComplete');await open();await answer(0);await answer(1);
  await page.locator('#completeMission').click();
  await expect.poll(()=>page.evaluate(()=>typeof window.__releaseComplete)).toBe('function');
  await page.locator('#leaveFocus').click();await expect(page.locator('#studyDashboard')).toBeVisible();await open();
  await page.evaluate(()=>window.__releaseComplete());
  // Aguarda o intervalo em que a versão anterior fechava outra missão por engano.
  await page.waitForTimeout(1100);
  await expect(page.locator('#studyFocus')).toBeVisible();
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow','0');
  await expect(page.locator('#focusStatus')).not.toContainText('Missão concluída');clean();
});

test('revisão envia seu ID na abertura e sua sessão na conclusão', async ({ page }) => {
  const {open,answer,clean}=await setup(page,'review');await open();await answer(0);await answer(1);
  await page.locator('#completeMission').click();
  await expect.poll(()=>page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/complete')).length)).toBe(1);
  const calls=await page.evaluate(()=>window.__calls);
  expect(calls.find(c=>c.route.endsWith('/sessions')).body.reviewId).toBe('review-fixture');
  expect(calls.find(c=>c.route.endsWith('/complete'))).toMatchObject({route:'/api/studies/reviews/review-fixture/complete',body:{sessionId:'session-1'}});clean();
});

test('falha de abertura não permite pontuar, mas não bloqueia o ensino', async ({ page }) => {
  const {open,answer,clean}=await setup(page,'failStart');await open();
  await expect(page.locator('#focusStatus')).toContainText('A rodada não foi registrada');await answer(0);
  expect(await page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/attempts')).length)).toBe(0);
  await page.locator('#studyReadButton').click();await expect(page.locator('#lessonSections')).toContainText('Material sintético');clean();
});

test('fechamento repetido após perda de resposta usa os mesmos dados', async ({ page }) => {
  const {open,clean}=await setup(page,'failFinishOnce');await open();
  await page.locator('#leaveFocus').click();await expect(page.locator('#studyDashboard')).toBeVisible();
  const calls=await page.evaluate(()=>window.__calls.filter(c=>c.method==='PATCH'));
  expect(calls).toHaveLength(2);expect(calls[0]).toEqual(calls[1]);clean();
});
