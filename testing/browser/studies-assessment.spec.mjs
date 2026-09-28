import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';
const assessmentId = 'assessment.sfn-foundation.transfer.v1';
const questions = Array.from({length:12},(_,i)=>({
  id:`eval.browser.${i+1}`,
  prompt:`Questão independente sintética ${i+1}?`,
  options:['Alternativa A','Alternativa B','Alternativa C','Alternativa D']
}));
const corrections = questions.map((q,i)=>({
  questionId:q.id,prompt:q.prompt,options:q.options,selectedOption:i%4,correctOption:i%4,correct:true,
  explanation:`Explicação sintética ${i+1}.`,
  reviewTargets:[{missionId:'banking.sfn.cmn',sectionId:'papel',missionTitle:'CMN',sectionTitle:'2. Papel do CMN'}]
}));

async function setup(page,{unlocked=false,attempts=0,theme='light'}={}) {
  await page.setViewportSize({width:390,height:844});
  const errors=[],unexpected=[];
  page.on('pageerror',error=>errors.push(error.message));

  const bootstrap = {
    user:{username:'wellyton',name:'Estudante sintético'},
    roundProtocol:1,timeProtocol:1,
    metrics:{xp:240,level:2,levelTitle:'Explorador',nextLevelXp:400,hoursSeconds:120,
      questions:38,correctQuestions:30,accuracy:78.9,reviewsDue:0,
      streak:{current:1,best:2,lastStudyDay:'2026-09-28'},
      publishedMissions:9,plannedMissions:9,campaignAvailability:100,completedPublished:9,
      availableCompletion:100,campaignProgress:100,availableProgress:100},
    progress:{},learningEvidence:{},reviews:[],attemptedQuestions:{},missions:[],
    curriculum:{version:1,basis:'fixture',totalAreas:12,startedAreas:1,completedAreas:0,totalBlocks:43,
      publishedBlocks:1,completedBlocks:1,availabilityPercent:2.3,progressPercent:2.3,
      readiness:{status:'not_measured',label:'Ainda não medida',explanation:'Fixture de prontidão.'},
      areas:[]},
    assessments:[{id:assessmentId,version:1,blockId:'banking.sfn-foundation',
      title:'Avaliação independente — fundamentos do SFN',
      description:'Questões novas para verificar aplicação sem reutilizar a prática.',
      questionCount:12,unlocked,
      evidence:{attempts,firstScore:attempts?75:null,latestScore:attempts?83.3:null,
        formsSeen:attempts?['A']:[],firstCompletedAt:attempts?'2026-09-27 12:00:00':'',
        latestCompletedAt:attempts?'2026-09-27 12:00:00':''}}]
  };

  const auth = `window.__calls=[];window.__answered={};window.__bootstrap=${JSON.stringify(bootstrap)};
    const questions=${JSON.stringify(questions)},corrections=${JSON.stringify(corrections)};
    window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),logout:async()=>{},api:async(route,options={})=>{
      const body=options.body?JSON.parse(options.body):null;window.__calls.push({route,method:options.method||'GET',body});
      if(route.endsWith('/bootstrap'))return structuredClone(window.__bootstrap);
      if(route.endsWith('/latest'))return {completed:true,runId:'run-completed',score:83.3,questionCount:12,corrections:structuredClone(corrections),
        evidence:structuredClone(window.__bootstrap.assessments[0].evidence)};
      if(route.endsWith('/runs'))return {assessment:{id:'assessment.sfn-foundation.transfer.v1',title:'Avaliação independente — fundamentos do SFN',questionCount:12},
        runId:'run-active',resumed:Object.keys(window.__answered).length>0,formId:'A',questions:structuredClone(questions),answered:structuredClone(window.__answered)};
      if(route.endsWith('/answers')){window.__answered[body.questionId]=body.selectedOption;return {recorded:true,answered:Object.keys(window.__answered).length,total:12};}
      if(route.endsWith('/complete')){
        if(Object.keys(window.__answered).length<12)throw new Error('Responda todas as 12 questões antes de concluir a avaliação.');
        window.__bootstrap.assessments[0].evidence={attempts:1,firstScore:75,latestScore:75,formsSeen:['A'],firstCompletedAt:'2026-09-28 12:00:00',latestCompletedAt:'2026-09-28 12:00:00'};
        return {completed:true,runId:'run-active',score:75,questionCount:12,corrections:structuredClone(corrections),
          evidence:structuredClone(window.__bootstrap.assessments[0].evidence)};
      }
      throw new Error('Endpoint não simulado: '+route);
    }};`;

  await page.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.origin!==origin){unexpected.push(url.origin+url.pathname);return route.abort();}
    const name=url.pathname;
    if(name==='/estudos/'){
      const html=(await readFile(path.join(root,'estudos/index.html'),'utf8'))
        .replace('<html lang="pt-BR">',`<html lang="pt-BR" data-portal-theme="${theme}">`)
        .replace(/<link rel="preconnect"[^>]*>/g,'');
      return route.fulfill({contentType:'text/html',body:html});
    }
    if(name==='/js/auth-client.js')return route.fulfill({contentType:'text/javascript',body:auth});
    if(['/js/studies.js','/js/studies-reader.js','/js/studies-clock.js','/js/studies-assessment.js'].includes(name))
      return route.fulfill({contentType:'text/javascript',body:await readFile(path.join(root,name.slice(1)),'utf8')});
    if(name.endsWith('.js'))return route.fulfill({contentType:'text/javascript',body:''});
    if(name.startsWith('/css/')&&name.endsWith('.css'))
      return route.fulfill({contentType:'text/css',body:await readFile(path.join(root,name.slice(1)),'utf8')});
    if(name.startsWith('/assets/'))return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'});
    unexpected.push(name);return route.abort();
  });
  await page.goto(origin+'/estudos/');
  await expect(page.locator('#assessmentPanel')).toBeVisible();
  return {
    clean(){expect(errors).toEqual([]);expect(unexpected).toEqual([]);},
    calls:()=>page.evaluate(()=>window.__calls)
  };
}

test('avaliação fica visível porém bloqueada antes do Chefe',async({page})=>{
  const {clean,calls}=await setup(page,{unlocked:false});
  await expect(page.locator('#startAssessment')).toBeDisabled();
  await expect(page.locator('#startAssessment')).toHaveText('Conclua o Chefe');
  await expect(page.locator('#assessmentEvidence')).toContainText('Bloqueada até concluir o Chefe');
  await expect(page.locator('#reviewAssessment')).toBeHidden();
  expect((await calls()).filter(c=>c.route.includes('/assessments/'))).toEqual([]);
  clean();
});

test('tentativa não mostra gabarito e retoma resposta registrada',async({page})=>{
  const {clean,calls}=await setup(page,{unlocked:true,theme:'dark'});
  await page.locator('#startAssessment').click();
  await expect(page.locator('#studyAssessmentFocus')).toBeVisible();
  await expect(page.locator('.study-assessment-question')).toHaveCount(12);
  const first=page.locator('.study-assessment-question').first();
  await first.locator('input').nth(2).check();
  await first.locator('button').click();
  await expect(first.locator('.study-feedback')).toContainText('gabarito será mostrado somente');
  await expect(first.locator('.study-feedback')).not.toContainText(/correto|incorreto|acertou/i);
  const answerCall=(await calls()).find(c=>c.route.endsWith('/answers'));
  expect(answerCall.body).toEqual({questionId:'eval.browser.1',selectedOption:2});
  await page.locator('#leaveAssessment').click();
  await expect(page.locator('#studyAssessmentFocus')).toBeHidden();

  await page.locator('#startAssessment').click();
  await expect(page.locator('#assessmentFocusMeta')).toContainText('Tentativa retomada');
  const resumed=page.locator('.study-assessment-question').first();
  await expect(resumed.locator('input').nth(2)).toBeChecked();
  await expect(resumed.locator('input').first()).toBeDisabled();
  expect(await page.locator('.study-assessment-shell').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  clean();
});

test('conclusão só ocorre após 12 respostas e não altera XP/questões do dashboard',async({page})=>{
  const {clean,calls}=await setup(page,{unlocked:true});
  await page.locator('#startAssessment').click();
  for(let i=0;i<12;i++){
    const card=page.locator('.study-assessment-question').nth(i);
    await card.locator('input').nth(i%4).check();
    await card.locator('button').click();
  }
  await expect(page.locator('#completeAssessment')).toBeEnabled();
  await page.locator('#completeAssessment').click();
  await expect(page.locator('#assessmentCorrection')).toBeVisible();
  await expect(page.locator('#assessmentCorrectionSummary')).toContainText('Resultado desta forma: 75%');
  await expect(page.locator('.study-assessment-correction')).toHaveCount(12);
  await expect(page.locator('.study-assessment-review-target').first()).toContainText('CMN');
  const all=await calls();
  expect(all.filter(c=>c.route.endsWith('/complete'))).toHaveLength(1);
  expect(all.some(c=>/\/attempts$|\/missions\/.+\/complete$/.test(c.route))).toBe(false);
  await page.locator('#leaveAssessment').click();
  await expect(page.locator('#metricXp')).toHaveText('240');
  await expect(page.locator('#metricQuestions')).toHaveText('38');
  await expect(page.locator('#assessmentEvidence')).toContainText('primeira: 75%');
  clean();
});

test('último diagnóstico pode ser revisto sem iniciar nova forma',async({page})=>{
  const {clean,calls}=await setup(page,{unlocked:true,attempts:1,theme:'dark'});
  await expect(page.locator('#reviewAssessment')).toBeVisible();
  await page.locator('#reviewAssessment').click();
  await expect(page.locator('#studyAssessmentFocus')).toBeVisible();
  await expect(page.locator('#assessmentFocusTitle')).toContainText('Último diagnóstico');
  await expect(page.locator('#assessmentCorrectionSummary')).toContainText('83.3%');
  await expect(page.locator('.study-assessment-correction')).toHaveCount(12);
  const assessmentCalls=(await calls()).filter(c=>c.route.includes('/assessments/'));
  expect(assessmentCalls.some(c=>c.route.endsWith('/latest')&&c.method==='GET')).toBe(true);
  expect(assessmentCalls.some(c=>c.route.endsWith('/runs')&&c.method==='POST')).toBe(false);
  clean();
});
