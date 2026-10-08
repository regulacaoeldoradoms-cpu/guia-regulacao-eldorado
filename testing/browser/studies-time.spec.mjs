import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';
async function setup(page, { theme = 'light', mode = '', width = 390 } = {}) {
  await page.setViewportSize({ width, height: 844 });
  await page.clock.install({ time: new Date('2026-09-26T12:00:00Z') });
  const mission = { id: 'fixture.time', topicId: 'fixture.time', order: 1, contentVersion: 2,
    title: 'Leitura sintética para medir tempo visível', shortTitle: 'Leitura', estimatedMinutes: 20, xp: 100,
    objective: 'Não confundir tempo visível com aprendizagem.',
    sections: [{ id: 'ensino', heading: 'Ensino sintético', body: 'Texto de teste que permanece disponível durante a pausa.' }],
    recall: ['Explique com suas palavras.'], sources: [],
    questions: [{ id: 'q.time.1', prompt: 'Pergunta sintética', options: ['A', 'B'] }]
  };
  const payload = { roundProtocol: 1, timeProtocol: 1,
    user: { username: 'wellyton', name: 'Estudante sintético' }, missions: [mission], progress: {}, attemptedQuestions: {}, reviews: [],
    metrics: { xp: 0, level: 1, levelTitle: 'Iniciante', nextLevelXp: 150, questions: 0, accuracy: 0, hoursSeconds: 0, reviewsDue: 0,
      publishedMissions: 1, plannedMissions: 9, campaignAvailability: 11.1, completedPublished: 0, campaignProgress: 0,
      availableCompletion: 0, streak: { current: 0, best: 0 } }
  };
  const errors = [], unexpected = [];
  page.on('pageerror', error => errors.push(error.message));
  const auth = `window.__calls=[];let starts=0,checkpoints=0;const payload=${JSON.stringify(payload)},mode=${JSON.stringify(mode)};
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.__hidden===true});
    window.__setHidden=value=>{window.__hidden=value;document.dispatchEvent(new Event('visibilitychange'));};
    window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),logout:async()=>{},api:async(route,options={})=>{
      const body=options.body?JSON.parse(options.body):null;window.__calls.push({route,method:options.method,body});
      if(route.endsWith('/bootstrap'))return structuredClone(payload);
      if(route.endsWith('/sessions'))return {sessionId:'session-'+(++starts),roundProtocol:1,...(mode==='oldServer'?{}:{timeProtocol:1})};
      if(route.endsWith('/checkpoint')){
        checkpoints++;const id=route.split('/').at(-2);
        const receipt={checkpointed:true,timeProtocol:1,sessionId:id,durationSeconds:body.durationSeconds,finished:false};
        if(mode==='failOnce'&&checkpoints===1)throw new Error('Falha sintética');
        if(mode==='holdFirst'&&checkpoints===1)return new Promise(resolve=>window.__releaseCheckpoint=()=>resolve(receipt));
        return receipt;
      }
      if(options.method==='PATCH')return {finished:true,durationSeconds:body.durationSeconds};
      if(route.endsWith('/attempts'))return {correct:true,explanation:'Resposta sintética'};
      throw new Error('Endpoint não simulado: '+route);
    }};`;
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) { unexpected.push(url.origin + url.pathname); return route.abort(); }
    const name = url.pathname;
    if (name === '/estudos/') return route.fulfill({ contentType: 'text/html', body:
      (await readFile(path.join(root, 'estudos/index.html'), 'utf8'))
        .replace('<html lang="pt-BR">', `<html lang="pt-BR" data-portal-theme="${theme}">`)
        .replace(/<link rel="preconnect"[^>]*>/g, '') });
    if (name === '/js/auth-client.js') return route.fulfill({ contentType: 'text/javascript', body: auth });
    if (['/js/studies.js', '/js/studies-reader.js', '/js/studies-clock.js'].includes(name)) {
      const body = mode === 'missingClock' && name.endsWith('studies-clock.js') ? '' : await readFile(path.join(root, name.slice(1)), 'utf8');
      return route.fulfill({ contentType: 'text/javascript', body });
    }
    if (name.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: ["/js/studies-tables.js","/js/studies-feedback-focus.js","/js/studies-question-accessibility.js","/js/studies-reread-return.js","/js/studies-pending-navigation.js"].includes(name) ? await readFile(path.join(root, name.slice(1)), 'utf8') : '' });
    if (name.startsWith('/css/') && name.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: await readFile(path.join(root, name.slice(1)), 'utf8') });
    if (name.startsWith('/assets/')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' });
    unexpected.push(name);return route.abort();
  });
  await page.goto(origin + '/estudos/');
  await expect(page.locator('#continueStudy')).toBeEnabled();
  // O relógio é pausado antes de abrir qualquer sessão, sem acrescentar tempo.
  await page.clock.pauseAt(new Date('2026-09-26T12:05:00Z'));
  const open = async () => {
    await page.locator('#continueStudy').click();
    await expect(page.locator('#focusStatus')).toHaveText('');
  };
  await open();
  return { open,
    checkpoints: () => page.evaluate(() => window.__calls.filter(call => call.route.endsWith('/checkpoint'))),
    clean: () => { expect(errors).toEqual([]); expect(unexpected).toEqual([]); } };
}

for (const theme of ['light', 'dark']) {
  test(`cronômetro salva 30 segundos visíveis sem pontuar ${theme}`, async ({ page }) => {
    const { checkpoints, clean } = await setup(page, { theme, width: 320 });
    await page.clock.runFor(30000);
    await expect(page.locator('#studyTimer')).toHaveText('00:30');
    await expect(page.locator('#studyTimeSync')).toContainText('Tempo salvo até 00:30');
    expect(await checkpoints()).toEqual([{ route: '/api/studies/sessions/session-1/checkpoint', method: 'POST', body: { durationSeconds: 30 } }]);
    expect(await page.evaluate(() => window.__calls.filter(call => /attempts|complete/.test(call.route)))).toEqual([]);
    expect(await page.locator('#studyFocusBody').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    expect(await page.locator('.study-focus-header').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    clean();
  });
}

test('aba oculta não acrescenta tempo; voltar retoma sem criar sessão', async ({ page }) => {
  const { clean } = await setup(page);
  await page.clock.runFor(12000);
  await page.evaluate(() => window.__setHidden(true));
  await expect(page.locator('#studyTimerStatus')).toHaveText('Pausado em segundo plano');
  await page.clock.runFor(60000);
  await expect(page.locator('#studyTimer')).toHaveText('00:12');
  await page.evaluate(() => window.__setHidden(false));
  await page.clock.runFor(8000);
  await expect(page.locator('#studyTimer')).toHaveText('00:20');
  expect(await page.evaluate(() => window.__calls.filter(c => c.route.endsWith('/sessions')).length)).toBe(1);
  clean();
});

test('pausa manual continua após esconder e mostrar e preserva a prática', async ({ page }) => {
  const { clean } = await setup(page);
  await page.clock.runFor(7000);
  await page.locator('#studyPracticeButton').click();
  const choice = page.locator('[data-question-id="q.time.1"] input').first();
  await choice.check();
  await page.locator('#pauseStudy').click();
  await expect(page.locator('#pauseStudy')).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => window.__setHidden(true));
  await page.clock.runFor(15000);
  await page.evaluate(() => window.__setHidden(false));
  await page.clock.runFor(15000);
  await expect(page.locator('#studyTimer')).toHaveText('00:07');
  await expect(page.locator('#studyTimerStatus')).toHaveText('Pausado por você');
  await page.locator('#studyReadButton').click();
  await expect(page.locator('#lessonSections')).toContainText('permanece disponível durante a pausa');
  await page.locator('#studyPracticeButton').click();await expect(choice).toBeChecked();
  await page.locator('#pauseStudy').click();await page.clock.runFor(3000);
  await expect(page.locator('#studyTimer')).toHaveText('00:10');
  await page.locator('#leaveFocus').click();await expect(page.locator('#studyDashboard')).toBeVisible();
  expect(await page.evaluate(() => window.__calls.find(c => c.method === 'PATCH').body.durationSeconds)).toBe(10);
  clean();
});

test('checkpoint perdido recebe nova tentativa cumulativa ao voltar online', async ({ page }) => {
  const { checkpoints, clean } = await setup(page, { mode: 'failOnce' });
  await page.clock.runFor(30000);
  await expect(page.locator('#studyTimeSync')).toContainText('Tempo ainda não confirmado');
  await page.clock.runFor(5000);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect(page.locator('#studyTimeSync')).toContainText('Tempo salvo até 00:35');
  expect((await checkpoints()).map(c => c.body.durationSeconds)).toEqual([30, 35]);
  clean();
});

test('confirmação atrasada da sessão anterior não altera contador novo', async ({ page }) => {
  const { open, clean } = await setup(page, { mode: 'holdFirst' });
  await page.clock.runFor(30000);
  await expect.poll(() => page.evaluate(() => typeof window.__releaseCheckpoint)).toBe('function');
  await page.locator('#leaveFocus').click();await expect(page.locator('#studyDashboard')).toBeVisible();
  await open();await page.evaluate(() => window.__releaseCheckpoint());
  await page.clock.runFor(2000);
  await expect(page.locator('#studyTimer')).toHaveText('00:02');
  await expect(page.locator('#studyTimeSync')).not.toContainText('00:30');
  clean();
});

test('suspensão longa não é convertida em minutos de leitura', async ({ page }) => {
  const { clean } = await setup(page);
  await page.clock.runFor(4000);
  await page.clock.fastForward(600000);
  await expect(page.locator('#studyTimer')).toHaveText('00:04');
  await page.clock.runFor(2000);
  await expect(page.locator('#studyTimer')).toHaveText('00:06');
  clean();
});

test('servidor anterior não recebe checkpoint incompatível ou falso aviso de salvo', async ({ page }) => {
  const { checkpoints, clean } = await setup(page, { mode: 'oldServer' });
  await page.clock.runFor(31000);
  expect(await checkpoints()).toEqual([]);
  await expect(page.locator('#studyTimeSync')).toContainText('Salvamento parcial indisponível');
  await expect(page.locator('#studyTimer')).toHaveText('00:31');
  clean();
});

test('falta do script de tempo não bloqueia ensino nem inventa duração', async ({ page }) => {
  const { checkpoints, clean } = await setup(page, { mode: 'missingClock' });
  await expect(page.locator('#studyTimerStatus')).toContainText('Cronômetro indisponível');
  await expect(page.locator('#lessonSections')).toContainText('Texto de teste');
  await page.clock.runFor(31000);expect(await checkpoints()).toEqual([]);
  await expect(page.locator('#studyTimer')).toHaveText('—');
  clean();
});
