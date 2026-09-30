import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';
const originMission = {
  id: 'fixture.origin', topicId: 'fixture.origin', order: 1, contentVersion: 2,
  title: 'Fundamento anterior', shortTitle: 'Fundamento', xp: 80, estimatedMinutes: 10,
  objective: 'Servir como origem sintética de revisão cumulativa.',
  sections: [{ id: 'base', heading: 'Conceito de origem', body: 'Fundamento anterior para revisão.' }],
  recall: [], sources: [], questions: []
};
const mission = {
  id: 'fixture.lesson', topicId: 'fixture.lesson', order: 2, contentVersion: 2,
  title: 'Leitura sintética', shortTitle: 'Leitura', xp: 100, estimatedMinutes: 20,
  objective: 'Testar a coordenação de requisições sem dados pessoais.',
  sections: [{ id: 'ensino', heading: 'Explicação', body: 'Material sintético para os testes.' }],
  recall: ['Explique o conceito.'], sources: [],
  questions: [0, 1].map(i => ({ id: `q.fixture.${i}`, prompt: `Pergunta sintética ${i}`, options: ['A', 'B'] }))
};
async function setup(page, mode = '') {
  const payload = {
    roundProtocol: 1, pedagogyProtocol: mode === 'pedagogy' ? 1 : 0,
    errorPatternProtocol: mode === 'recurringErrors' ? 1 : 0,
    domainProtocol: mode === 'domain' ? 1 : 0,
    user: { username: 'wellyton', name: 'Estudante sintético' }, missions: [originMission, mission],
    progress: { [originMission.topicId]: { coverageState: 3 } },
    recurringErrors: mode === 'recurringErrors'
      ? { [originMission.topicId]: { count:0,items:[] }, [mission.topicId]: { count:1,items:[{questionId:'q.fixture.0',wrongAttempts:2,totalAttempts:2,lastAttemptAt:'2026-09-29 22:00:00'}] } }
      : {},
    recentDomain: mode === 'domain'
      ? {
          overallScore:74.3,observedTopics:1,totalTopics:2,
          byTopic:{
            [originMission.topicId]:{score:null,immediateScore:null,retentionScore:null,attemptCount:0,status:'not_observed',label:'Ainda não medido'},
            [mission.topicId]:{score:74.3,immediateScore:71.9,retentionScore:80,attemptCount:3,status:'review_observed',label:'Com revisão posterior'}
          }
        }
      : {overallScore:null,observedTopics:0,totalTopics:2,byTopic:{}},
    attemptedQuestions: {}, reviews: mode === 'review' ? [{ id: 'review-fixture', missionId: mission.id, title: 'Revisão sintética', cycle: 1, dueAt: '2026-09-25 12:00:00' }] : [],
    metrics: { xp: 0, level: 1, levelTitle: 'Iniciante', nextLevelXp: 150, questions: 0, accuracy: 0, hoursSeconds: 0, reviewsDue: 0, recurringErrors: mode === 'recurringErrors' ? 1 : 0, publishedMissions: 2, plannedMissions: 9, campaignAvailability: 22.2, completedPublished: 1, campaignProgress: 0, availableCompletion: 50, streak: { current: 0, best: 0 } }
  };
  const errors = [], unexpected = [];
  page.on('pageerror', e => errors.push(e.message));
  const auth = `window.__calls=[];let starts=0,attempts=0,finishes=0;
    const payload=${JSON.stringify(payload)}, mode=${JSON.stringify(mode)};
    window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),logout:async()=>{},api:async(route,options={})=>{
      window.__calls.push({route,method:options.method,body:options.body?JSON.parse(options.body):null});
      if(route.endsWith('/bootstrap')) return structuredClone(payload);
      if(route.endsWith('/reading-complete')) {
        if(mode!=='pedagogy')throw new Error('reading-complete não esperado sem protocolo');
        return {recorded:true,coverageState:1,pedagogyProtocol:1};
      }
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
        if(mode==='richFeedback')return {
          correct:false,correctOption:1,explanation:'B representa a resposta correta neste cenário sintético.',
          selectedFeedback:'A representa a confusão simulada que o aluno precisa corrigir.',
          reviewRefs:[
            {missionId:'fixture.lesson',sectionId:'ensino'},
            {missionId:'fixture.origin',sectionId:'base'}
          ],recorded:true
        };
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


test('feedback rico explica o erro e leva ao trecho que precisa ser relido', async ({ page }) => {
  const {open,answer,clean}=await setup(page,'richFeedback');await open();
  const card=await answer(0);
  const feedback=card.locator('[data-feedback]');
  await expect(feedback).toContainText('Ainda não.');
  await expect(feedback).toContainText('Por que sua escolha não funciona:');
  await expect(feedback).toContainText('A representa a confusão simulada');
  await expect(feedback).toContainText('Resposta correta: B');
  await expect(feedback).toContainText('Por que é correta:');
  const review=feedback.locator('.study-feedback-review');
  await expect(review).toHaveCount(1);
  await expect(review).toHaveText('Explicação');
  await expect(feedback).toContainText('Revisar depois:');
  await expect(feedback).toContainText('Fundamento: Conceito de origem');
  await review.click();
  await expect(page.locator('#studyLessonPanel')).toBeVisible();
  await expect(page.locator('#lessonSections')).toContainText('Material sintético para os testes.');
  clean();
});


test('protocolo pedagógico registra leitura concluída ao entrar na prática sem criar nova sessão', async ({ page }) => {
  const {open,clean}=await setup(page,'pedagogy');await open();
  const calls=await page.evaluate(()=>window.__calls);
  const reading=calls.filter(c=>c.route.endsWith('/reading-complete'));
  expect(reading).toHaveLength(1);
  expect(reading[0].route).toBe('/api/studies/sessions/session-1/reading-complete');
  expect(calls.filter(c=>c.route.endsWith('/sessions'))).toHaveLength(1);
  await expect(page.locator('#studyPracticePanel')).toBeVisible();
  clean();
});


test('dashboard mostra somente erros recorrentes ativos quando o protocolo existe', async ({ page }) => {
  const {clean}=await setup(page,'recurringErrors');
  await expect(page.locator('#metricRecurringErrorsCard')).toBeVisible();
  await expect(page.locator('#metricRecurringErrors')).toHaveText('1');
  const card=page.locator('[data-mission-id="fixture.lesson"]');
  await expect(card).toContainText('Erros recorrentes ativos: 1');
  clean();
});


test('dashboard separa domínio recente de acerto acumulado quando o protocolo existe', async ({ page }) => {
  const {clean}=await setup(page,'domain');
  await expect(page.locator('#metricRecentDomainCard')).toBeVisible();
  await expect(page.locator('#metricRecentDomain')).toHaveText('74.3%');
  await expect(page.locator('#metricRecentDomainMeta')).toContainText('1/2 tópicos com evidência');
  const card=page.locator('[data-mission-id="fixture.lesson"]');
  await expect(card).toContainText('Domínio recente: 74.3% · Com revisão posterior');
  clean();
});
