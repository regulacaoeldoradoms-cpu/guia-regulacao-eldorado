import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const origin='http://127.0.0.1:8778';
const lessonIds=[
  'banking.sfn.introducao','banking.sfn.cmn','banking.sfn.bacen','banking.sfn.copom',
  'banking.sfn.cvm','banking.sfn.operadores','banking.sfn.seguros-previdencia',
  'banking.sfn.pagamentos-consorcios','banking.sfn.boss'
];
const questions=Array.from({length:16},(_,index)=>({
  id:`eval.sfn.a${String(index+1).padStart(2,'0')}`,
  prompt:`Questão independente sintética ${index+1}. Qual alternativa deve ser registrada?`,
  options:['Alternativa A','Alternativa B','Alternativa C','Alternativa D'],
  primaryLessonId:lessonIds[index%8],
  competencyIds:[`competencia.${index%8+1}`]
}));

async function setup(page,{assessmentUnavailable=false,resumableSession=null,legacyWorker=false}={}){
  const errors=[],unexpected=[];
  page.on('pageerror',error=>errors.push(error.message));
  const payload={
    user:{username:'wellyton',name:'Estudante sintético'},
    assessmentProtocol:1,
    metrics:{xp:0,level:1,levelTitle:'Recruta',nextLevelXp:150,hoursSeconds:0,questions:0,accuracy:0,reviewsDue:0,
      publishedMissions:9,plannedMissions:9,campaignAvailability:100,completedPublished:9,availableCompletion:100,
      streak:{current:1,best:1}},
    progress:Object.fromEntries(lessonIds.map(id=>[id,{coverageState:3,masteryScore:80}])),
    learningEvidence:{},attemptedQuestions:{},reviews:[],curriculum:null,
    missions:lessonIds.map((id,index)=>({id,topicId:id,order:index+1,title:`Missão ${index+1}`,shortTitle:`Missão ${index+1}`,
      estimatedMinutes:10,xp:100,kind:id.endsWith('.boss')?'boss':'lesson',passScore:id.endsWith('.boss')?75:0,questions:[]})),
    resumableSession:structuredClone(resumableSession)
  };
  if(legacyWorker)delete payload.assessmentProtocol;
  const auth=`
    window.__assessmentAnswers=new Set();
    window.__assessmentUnavailable=${JSON.stringify(assessmentUnavailable)};
    window.__assessmentState={
      blockId:'banking.sfn-foundation',assessmentVersion:2,contentVersion:2,
      prerequisitesComplete:true,availableForm:'A',nextEligibleAt:'',completed:[],active:null
    };
    window.__assessmentQuestions=${JSON.stringify(questions)};
    window.__studyCalls=[];
    window.RegulationAuth={
      requireRole:async()=>({username:'wellyton',name:'Estudante sintético'}),
      logout:async()=>{},
      api:async(route,options={})=>{
        window.__studyCalls.push({route,method:options.method||'GET',body:options.body||''});
        if(route==='/api/studies/bootstrap')return structuredClone(${JSON.stringify(payload)});
        if(route==='/api/studies/assessments/banking.sfn-foundation'){
          if(window.__assessmentUnavailable)throw new Error('Falha sintética do estado da avaliação');
          return structuredClone(window.__assessmentState);
        }
        if(route==='/api/studies/assessments/banking.sfn-foundation/start'){
          window.__assessmentState.active={assessmentId:'11111111-1111-1111-1111-111111111111',formId:'A',startedAt:'2026-09-29T12:00:00Z',
            answeredCount:window.__assessmentAnswers.size,total:16};
          return {assessmentId:'11111111-1111-1111-1111-111111111111',blockId:'banking.sfn-foundation',formId:'A',
            assessmentVersion:2,contentVersion:2,startedAt:'2026-09-29T12:00:00Z',
            answeredQuestionIds:[...window.__assessmentAnswers],questions:structuredClone(window.__assessmentQuestions)};
        }
        if(/\\/answers$/.test(route)){
          const body=JSON.parse(options.body);
          const before=window.__assessmentAnswers.size;
          window.__assessmentAnswers.add(body.questionId);
          if(window.__assessmentState.active)window.__assessmentState.active.answeredCount=window.__assessmentAnswers.size;
          return {assessmentId:'11111111-1111-1111-1111-111111111111',questionId:body.questionId,
            recorded:window.__assessmentAnswers.size>before,answeredCount:window.__assessmentAnswers.size,total:16};
        }
        if(/\\/complete$/.test(route)){
          if(window.__assessmentAnswers.size!==16)throw new Error('Responda todos os itens');
          const items=window.__assessmentQuestions.map((question,index)=>({
            questionId:question.id,selectedOption:0,correct:index<12,correctOption:index<12?0:1,
            explanation:'Explicação sintética pós-rodada '+(index+1)+'.',primaryLessonId:question.primaryLessonId,
            teaches:['Trecho sintético'],competencyIds:question.competencyIds,sourceIds:['fonte.sintetica']
          }));
          window.__assessmentState.active=null;
          window.__assessmentState.availableForm=null;
          window.__assessmentState.nextEligibleAt='2026-10-06T12:00:00.000Z';
          window.__assessmentState.completed=[{assessmentId:'11111111-1111-1111-1111-111111111111',formId:'A',
            startedAt:'2026-09-29T12:00:00Z',completedAt:'2026-09-29T12:20:00Z',score:75,total:16}];
          return {assessmentId:'11111111-1111-1111-1111-111111111111',blockId:'banking.sfn-foundation',formId:'A',
            assessmentVersion:2,contentVersion:2,startedAt:'2026-09-29T12:00:00Z',completedAt:'2026-09-29T12:20:00Z',
            total:16,correct:12,score:75,
            diagnostics:[{competencyId:'competencia.1',total:2,correct:1,accuracy:50,lessonIds:['banking.sfn.introducao']}],
            recommendedLessonIds:['banking.sfn.introducao'],items};
        }
        return {finished:true};
      }
    };`;

  await page.addInitScript(auth);

  await page.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.origin!==origin){unexpected.push(url.origin+url.pathname);return route.abort();}
    const pathname=url.pathname;
    if(pathname==='/estudos/'){
      let html=await readFile(path.join(root,'estudos/index.html'),'utf8');
      html=html.replace(/<link rel="preconnect"[^>]*>/g,'');
      return route.fulfill({contentType:'text/html',body:html});
    }
    if(pathname==='/js/auth-client.js')return route.fulfill({contentType:'text/javascript',body:''});
    if(pathname==='/js/studies.js'){
      return route.fulfill({contentType:'text/javascript',body:await readFile(path.join(root,'js/studies.js'),'utf8')});
    }
    if(pathname.endsWith('.js'))return route.fulfill({contentType:'text/javascript',body:''});
    if(pathname.startsWith('/css/')&&pathname.endsWith('.css')){
      return route.fulfill({contentType:'text/css',body:await readFile(path.join(root,pathname.slice(1)),'utf8')});
    }
    if(pathname.startsWith('/assets/'))return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'});
    if(pathname==='/ferramentas/')return route.fulfill({contentType:'text/html',body:'<p>Ferramentas</p>'});
    unexpected.push(pathname);return route.abort();
  });
  await page.goto(origin+'/estudos/');
  if(legacyWorker)await expect(page.locator('#assessmentPanel')).toBeHidden();
  else await expect(page.locator('#assessmentPanel')).toBeVisible();
  return {errors,unexpected};
}

test('frontend novo mantém aulas utilizáveis com Worker antigo sem assessmentProtocol',async({page})=>{
  const {errors,unexpected}=await setup(page,{assessmentUnavailable:true,legacyWorker:true});
  await expect(page.locator('#assessmentPanel')).toBeHidden();
  await expect(page.locator('#missionGrid [data-mission-id]').first()).toBeEnabled();
  await expect(page.locator('#studyStatus')).not.toContainText('aulas permanecem bloqueadas');
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('falha ao confirmar estado da avaliação bloqueia aulas em vez de abrir consulta',async({page})=>{
  const {errors,unexpected}=await setup(page,{assessmentUnavailable:true});
  await expect(page.locator('#assessmentPanel')).toBeVisible();
  await expect(page.locator('#startAssessment')).toBeDisabled();
  await expect(page.locator('#continueStudy')).toBeDisabled();
  await expect(page.locator('#continueStudy')).toHaveText('Aguardando confirmação da avaliação');
  for (const button of await page.locator('#missionGrid [data-mission-id]').all()) {
    await expect(button).toBeDisabled();
  }
  await expect(page.locator('#studyStatus')).toContainText('aulas permanecem bloqueadas');
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('sessão de estudo retomável impede iniciar avaliação em paralelo',async({page})=>{
  const {errors,unexpected}=await setup(page,{resumableSession:{
    sessionId:'22222222-2222-2222-2222-222222222222',
    missionId:'banking.sfn.introducao',
    mode:'lesson',
    reviewId:null,
    startedAt:'2026-09-29T13:00:00Z',
    durationSeconds:90,
    answeredQuestionIds:[]
  }});
  await expect(page.locator('#assessmentPanel')).toBeVisible();
  await expect(page.locator('#startAssessment')).toBeDisabled();
  await expect(page.locator('#startAssessment')).toHaveText('Sessão de estudo em andamento');
  await expect(page.locator('#assessmentMeta')).toContainText('Finalize ou encerre primeiro');
  await expect(page.locator('#continueStudy')).toContainText('Retomar:');
  const calls=await page.evaluate(()=>window.__studyCalls.map(item=>item.route));
  expect(calls.filter(route=>route==='/api/studies/assessments/banking.sfn-foundation/start')).toEqual([]);
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('Forma A abre sem consulta e resposta individual não revela correção',async({page})=>{
  const {errors,unexpected}=await setup(page);
  await expect(page.locator('#startAssessment')).toHaveText('Iniciar Forma A');
  await page.locator('#startAssessment').click();
  await expect(page.locator('#studyAssessmentFocus')).toBeVisible();
  await expect(page.locator('#studyDashboard')).toBeHidden();
  await expect(page.locator('#studyFocus')).toBeHidden();
  await expect(page.locator('[data-assessment-question-id]')).toHaveCount(16);

  const first=page.locator('[data-assessment-question-id]').first();
  await first.locator('input').first().check();
  await first.locator('[data-assessment-answer]').click();
  await expect(first.locator('[data-assessment-feedback]')).toContainText('correção só aparece');
  await expect(first.locator('[data-assessment-feedback]')).not.toContainText(/Correto|Errado|explicação/i);
  await expect(page.locator('#assessmentProgress')).toHaveAttribute('aria-valuenow','1');

  await page.locator('#leaveAssessment').click();
  await expect(page.locator('#studyDashboard')).toBeVisible();
  await expect(page.locator('#startAssessment')).toHaveText('Retomar Forma A');
  await expect(page.locator('#continueStudy')).toHaveText('Retomar avaliação: Forma A');
  await expect(page.locator('#missionGrid [data-mission-id]')).toHaveCount(9);
  for (const button of await page.locator('#missionGrid [data-mission-id]').all()) {
    await expect(button).toBeDisabled();
  }
  const calls=await page.evaluate(()=>window.__studyCalls.map(item=>item.route));
  expect(calls.filter(route=>route==='/api/studies/sessions')).toEqual([]);
  await page.locator('#startAssessment').click();
  await expect(page.locator('[data-assessment-question-id]').first().locator('input').first()).toBeDisabled();
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('correção e diagnóstico só aparecem depois das 16 respostas',async({page})=>{
  const {errors,unexpected}=await setup(page);
  await page.locator('#startAssessment').click();
  const cards=page.locator('[data-assessment-question-id]');
  for(let index=0;index<16;index++){
    const card=cards.nth(index);
    await card.locator('input').first().check();
    await card.locator('[data-assessment-answer]').click();
  }
  await expect(page.locator('#completeAssessment')).toBeEnabled();
  await expect(page.locator('#assessmentResult')).toBeHidden();
  await page.locator('#completeAssessment').click();
  await expect(page.locator('#assessmentResult')).toBeVisible();
  await expect(page.locator('#assessmentResultSummary')).toContainText('75%');
  await expect(page.locator('#assessmentReviewList .study-assessment-review-item')).toHaveCount(16);
  await expect(page.locator('#assessmentReviewList')).toContainText('Explicação sintética pós-rodada');
  await expect(page.locator('#assessmentDiagnostics')).toContainText('Revisar:');
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});
