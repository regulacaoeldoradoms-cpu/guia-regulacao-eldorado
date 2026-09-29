import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const origin='http://127.0.0.1:8777';

const first={
  id:'fixture.resume',topicId:'fixture.resume',order:1,contentVersion:2,
  title:'Sessão sintética retomável',shortTitle:'Retomada',estimatedMinutes:20,xp:100,
  objective:'Validar retomada sem duplicar sessão.',
  sections:[{id:'ensino',heading:'Ensino',body:'Texto sintético de retomada.'}],
  recall:['Explique o conceito.'],sources:[],
  questions:[0,1].map(i=>({id:`q.resume.${i}`,prompt:`Pergunta ${i}`,options:['A','B']}))
};
const next={...first,id:'fixture.next',topicId:'fixture.next',order:2,title:'Próxima missão',shortTitle:'Próxima',
  questions:[0,1].map(i=>({id:`q.next.${i}`,prompt:`Próxima ${i}`,options:['A','B']}))};

test('sessão ativa é retomada com tempo/respostas e impede rodada paralela',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.clock.install({time:new Date('2026-09-28T12:00:00Z')});
  const payload={
    roundProtocol:1,timeProtocol:1,resumeProtocol:1,
    user:{username:'wellyton',name:'Estudante sintético'},
    missions:[first,next],
    progress:{'fixture.resume':{coverageState:3,masteryScore:100}},
    attemptedQuestions:{},reviews:[],
    resumableSession:{
      sessionId:'resume-session',missionId:first.id,mode:'lesson',reviewId:null,
      startedAt:'2026-09-28 11:50:00',durationSeconds:125,
      answeredQuestionIds:['q.resume.0']
    },
    metrics:{xp:100,level:1,levelTitle:'Iniciante',nextLevelXp:150,questions:1,accuracy:100,hoursSeconds:125,reviewsDue:0,
      publishedMissions:2,plannedMissions:2,campaignAvailability:100,completedPublished:1,campaignProgress:50,availableCompletion:50,
      streak:{current:1,best:1}}
  };
  const errors=[],unexpected=[];
  page.on('pageerror',e=>errors.push(e.message));
  const auth=`window.__calls=[];const payload=${JSON.stringify(payload)};
    window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),logout:async()=>{},api:async(route,options={})=>{
      const body=options.body?JSON.parse(options.body):null;window.__calls.push({route,method:options.method,body});
      if(route.endsWith('/bootstrap'))return structuredClone(payload);
      if(route.endsWith('/sessions'))throw new Error('não deveria criar nova sessão');
      if(route.endsWith('/checkpoint'))return {checkpointed:true,timeProtocol:1,sessionId:'resume-session',durationSeconds:body.durationSeconds,finished:false};
      if(route.endsWith('/attempts'))return {correct:true,explanation:'Comentário sintético',recorded:true};
      if(options.method==='PATCH')return {finished:true,durationSeconds:body.durationSeconds};
      throw new Error('Endpoint não simulado: '+route);
    }};`;

  await page.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.origin!==origin){unexpected.push(url.origin+url.pathname);return route.abort();}
    const name=url.pathname;
    if(name==='/estudos/')return route.fulfill({contentType:'text/html',body:(await readFile(path.join(root,'estudos/index.html'),'utf8')).replace(/<link rel="preconnect"[^>]*>/g,'')});
    if(name==='/js/auth-client.js')return route.fulfill({contentType:'text/javascript',body:auth});
    if(['/js/studies.js','/js/studies-reader.js','/js/studies-clock.js'].includes(name))return route.fulfill({contentType:'text/javascript',body:await readFile(path.join(root,name.slice(1)),'utf8')});
    if(name.endsWith('.js'))return route.fulfill({contentType:'text/javascript',body:''});
    if(name.startsWith('/css/')&&name.endsWith('.css'))return route.fulfill({contentType:'text/css',body:await readFile(path.join(root,name.slice(1)),'utf8')});
    if(name.startsWith('/assets/'))return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'});
    unexpected.push(name);return route.abort();
  });

  await page.goto(origin+'/estudos/');
  await expect(page.locator('#continueStudy')).toHaveText('Retomar: Retomada');
  const cards=page.locator('[data-mission-id]');
  await expect(cards.nth(0).locator('.state')).toHaveText('Sessão em andamento');
  await expect(cards.nth(1)).toBeDisabled();
  await expect(cards.nth(1).locator('.state')).toHaveText('Retome a sessão atual');

  await page.locator('#continueStudy').click();
  await expect(page.locator('#studyFocus')).toBeVisible();
  await expect(page.locator('#studyTimer')).toHaveText('02:05');
  await page.locator('#studyPracticeButton').click();

  const answered=page.locator('[data-question-id="q.resume.0"]');
  await expect(answered.locator('button')).toBeDisabled();
  await expect(answered.locator('[data-feedback]')).toContainText('já registrada nesta sessão');
  await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow','1');
  expect(await page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/sessions')).length)).toBe(0);

  await page.clock.runFor(5000);
  await page.locator('#pauseStudy').click();
  await expect(page.locator('#studyTimer')).toHaveText('02:10');
  await expect.poll(()=>page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/checkpoint')).length)).toBe(1);
  expect(await page.evaluate(()=>window.__calls.find(c=>c.route.endsWith('/checkpoint')).body.durationSeconds)).toBe(130);

  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});
