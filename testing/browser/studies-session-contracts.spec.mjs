import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'),origin='http://127.0.0.1:8777';
const session='28500000-0000-4000-8000-000000000001';
const nextSession='28500000-0000-4000-8000-000000000002';
const mission={id:'fixture.reading',topicId:'fixture.reading',order:1,kind:'lesson',contentVersion:2,
 title:'Leitura sintética',shortTitle:'Leitura',estimatedMinutes:20,xp:100,objective:'Teste local de posição e confirmação.',
 sections:[0,1,2].map(i=>({id:'part-'+i,heading:'Parte '+(i+1),body:'Conteúdo sintético.'})),recall:[],sources:[],
 questions:[0,1].map(i=>({id:'q.reading.'+i,prompt:'Pergunta '+i,options:['A','B']}))};
function payload(confirmed=false,protocol=true){return {roundProtocol:1,resumeProtocol:1,pedagogyProtocol:1,
 readingReceiptProtocol:protocol?1:undefined,user:{username:'wellyton',name:'Sintético'},missions:[mission],
 progress:{[mission.topicId]:{coverageState:3,masteryScore:100}},attemptedQuestions:{},reviews:[],
 resumableSession:{sessionId:session,missionId:mission.id,contentVersion:2,mode:'lesson',reviewId:null,
  durationSeconds:0,answeredQuestionIds:[],readingReceiptProtocol:protocol?1:undefined,
  readingComplete:confirmed,readingConfirmedAt:confirmed?'2026-10-08 01:00:00':null},
 metrics:{xp:100,level:1,levelTitle:'Iniciante',nextLevelXp:150,questions:0,accuracy:0,hoursSeconds:0,reviewsDue:0,
 publishedMissions:1,plannedMissions:1,campaignAvailability:100,completedPublished:1,campaignProgress:100,
 availableCompletion:100,streak:{current:0,best:0}}};}
async function setup(page,{confirmed=false,mode='success',protocol=true,storageFails=false,history=false}={}){
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 if(storageFails)await page.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new Error('storage blocked');}});});
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());if(url.origin!==origin)return route.abort();
  const name=url.pathname;
  if(name==='/estudos/')return route.fulfill({contentType:'text/html',body:(await fs.readFile(root+'/estudos/index.html','utf8')).replace(/<link rel="preconnect"[^>]*>/g,'')});
  if(name==='/js/auth-client.js')return route.fulfill({contentType:'text/javascript',body:`
   window.__payload=${JSON.stringify(payload(confirmed,protocol))};if(${history})window.__payload.attemptedQuestions['fixture.reading']=['q.reading.0','q.reading.1'];window.__mode=${JSON.stringify(mode)};window.__calls=[];
   const confirmedReceipt={readingReceiptProtocol:1,readingComplete:true,readingConfirmedAt:'2026-10-08 01:00:00',coverageState:3};
   window.RegulationAuth={requireRole:async()=>({username:'wellyton',name:'Sintético'}),logout:async()=>{},api:async(route,options={})=>{
    window.__calls.push({route,method:options.method});
    if(route.endsWith('/bootstrap'))return structuredClone(window.__payload);
    if(route.endsWith('/sessions'))return {sessionId:'${nextSession}'};
    if(route.endsWith('/reading-complete')){
     if(window.__mode==='fail')throw new Error('storage unavailable');
     if(window.__mode==='delay')return new Promise(resolve=>{window.__resolveReading=()=>resolve(confirmedReceipt);});
     if(window.__mode==='invalid')return {readingReceiptProtocol:1,readingComplete:true,readingConfirmedAt:null,coverageState:3};
     return confirmedReceipt;
    }
    if(options.method==='PATCH'){if(window.__finishDelay)return new Promise(resolve=>{window.__resolveFinish=()=>resolve({finished:true});});window.__payload.resumableSession=null;return {finished:true};}
    if(route.endsWith('/attempts'))return {correct:true,recorded:true,explanation:'Comentário sintético'};
    if(route.endsWith('/complete')){if(window.__completionFail)throw new Error('Conclusão não confirmada');if(window.__completionDelay)return new Promise(resolve=>{window.__resolveCompletion=()=>resolve(window.__completionResponse||{});});return window.__completionResponse||{};}
    return {};
   }};`});
  if(name.startsWith('/js/studies')&&name.endsWith('.js'))return route.fulfill({contentType:'text/javascript',body:await fs.readFile(root+name,'utf8')});
  if(name.endsWith('.js'))return route.fulfill({contentType:'text/javascript',body:''});
  if(name.startsWith('/css/')&&name.endsWith('.css'))return route.fulfill({contentType:'text/css',body:await fs.readFile(root+name,'utf8')});
  return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg"/>'});
 });
 await page.goto(origin+'/estudos/');await page.locator('#continueStudy').click();
 await expect(page.locator('#studyFocus')).toBeVisible();return errors;
}
const key='study-reading-position-v1:wellyton:'+mission.id;
const saved={protocol:1,username:'wellyton',sessionId:session,missionId:mission.id,contentVersion:2,sectionId:'part-2',all:false,view:'practice'};
async function seed(page,record=saved){await page.evaluate(({key,record})=>sessionStorage.setItem(key,JSON.stringify(record)),{key,record});}
async function reloadResume(page){await page.reload();await page.locator('#continueStudy').click();await expect(page.locator('#studyFocus')).toBeVisible();}

test('histórico não confirma leitura; seção permanece e prática exige recibo na retomada',async({page})=>{
 const errors=await setup(page,{mode:'fail'});await page.locator('#studySectionSelect').selectOption('2');
 await page.locator('#studyPracticeButton').click();await expect(page.locator('#studyReadingConfirmation')).toContainText('ainda não confirmada');
 const record=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),key);
 expect(Object.keys(record).sort()).toEqual(['protocol','username','sessionId','missionId','contentVersion','sectionId','all','view'].sort());
 expect(record.sectionId).toBe('part-2');expect(record.view).toBe('practice');
 await reloadResume(page);await expect(page.locator('#studySectionSelect')).toHaveValue('2');
 await expect(page.locator('#studyPracticePanel')).toBeHidden();await expect(page.locator('#studyReadingBookmarkNotice')).toContainText('Posição retomada');expect(errors).toEqual([]);
});
test('recibo confirmado permite restaurar prática sem novo POST e sem perder respostas',async({page})=>{
 const errors=await setup(page,{confirmed:true});await seed(page);await reloadResume(page);
 await expect(page.locator('#studyPracticePanel')).toBeVisible();await expect(page.locator('#studyReadingConfirmation')).toHaveText('Conclusão da leitura confirmada nesta sessão.');
 await page.locator('[data-question-id="q.reading.1"] input[value="1"]').check();
 await page.locator('#studyReadButton').click();await page.locator('#studyPracticeButton').click();
 await expect(page.locator('[data-question-id="q.reading.1"] input[value="1"]')).toBeChecked();
 expect(await page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/reading-complete')).length)).toBe(0);expect(errors).toEqual([]);
});
test('falha permite nova tentativa; sucesso confirma somente após resposta e é idempotente no cliente',async({page})=>{
 const errors=await setup(page,{mode:'fail'});await page.locator('#studyPracticeButton').click();
 await expect(page.locator('#studyReadingConfirmation')).toContainText('Use Praticar');
 await page.evaluate(()=>window.__mode='success');await page.locator('#studyPracticeButton').click();
 await expect(page.locator('#studyReadingConfirmation')).toHaveText('Conclusão da leitura confirmada nesta sessão.');
 await page.locator('#studyPracticeButton').click();expect(await page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/reading-complete')).length)).toBe(2);expect(errors).toEqual([]);
});
test('recibo malformado e requisição pendente não produzem confirmação',async({page})=>{
 const errors=await setup(page,{mode:'invalid'});await page.locator('#studyPracticeButton').click();await expect(page.locator('#studyReadingConfirmation')).toContainText('Use Praticar');
 await page.evaluate(()=>window.__mode='delay');await page.locator('#studyPracticeButton').click();await expect(page.locator('#studyReadingConfirmation')).toContainText('Confirmando');
 await page.locator('#studyPracticeButton').click();expect(await page.evaluate(()=>window.__calls.filter(c=>c.route.endsWith('/reading-complete')).length)).toBe(2);
 await page.evaluate(()=>window.__resolveReading());await expect(page.locator('#studyReadingConfirmation')).toHaveText('Conclusão da leitura confirmada nesta sessão.');expect(errors).toEqual([]);
});
test('resposta atrasada da sessão anterior não confirma a nova rodada',async({page})=>{
 const errors=await setup(page,{mode:'delay'});await page.locator('#studyPracticeButton').click();await expect(page.locator('#studyReadingConfirmation')).toContainText('Confirmando');
 await page.locator('#leaveFocus').click();await expect(page.locator('#studyDashboard')).toBeVisible();
 await page.locator('[data-mission-id="fixture.reading"]').click();await expect(page.locator('#studyFocus')).toBeVisible();
 await page.evaluate(()=>window.__resolveReading());await page.locator('#studyPracticeButton').click();
 await expect(page.locator('#studyReadingConfirmation')).toContainText('Confirmando');
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('study-reading-position-v1:wellyton:fixture.reading')).sessionId)).toBe(nextSession);expect(errors).toEqual([]);
});
for(const change of [{sessionId:nextSession},{username:'outro'},{missionId:'fixture.other'},{contentVersion:3},{sectionId:'missing'}]){
 test('marcador incompatível ignorado: '+Object.keys(change)[0],async({page})=>{
  const errors=await setup(page,{confirmed:true});await seed(page,{...saved,...change});await reloadResume(page);
  await expect(page.locator('#studySectionSelect')).toHaveValue('0');await expect(page.locator('#studyPracticePanel')).toBeHidden();expect(errors).toEqual([]);
 });
}
test('storage indisponível mantém navegação e confirmação funcionais',async({page})=>{
 const errors=await setup(page,{storageFails:true});await expect(page.locator('#studyReadingBookmarkNotice')).toContainText('Não foi possível guardar');
 await page.locator('#studySectionSelect').selectOption('2');await page.locator('#studyPracticeButton').click();
 await expect(page.locator('#studyReadingConfirmation')).toHaveText('Conclusão da leitura confirmada nesta sessão.');expect(errors).toEqual([]);
});
test('backend antigo mantém navegação sem marcador nem afirmação de recibo',async({page})=>{
 const errors=await setup(page,{protocol:false});await expect(page.locator('#studyReadingBookmarkNotice')).toHaveCount(0);
 await page.locator('#studyPracticeButton').click();await expect(page.locator('#studyPracticePanel')).toBeVisible();
 await expect(page.locator('#studyReadingConfirmation')).toHaveCount(0);expect(errors).toEqual([]);
});

function summary(items=[]){return {protocol:1,sessionId:session,missionId:mission.id,contentVersion:2,mode:'lesson',
 total:2,answered:items.length,correct:items.filter(item=>item.correct).length,completionMayUseHistory:true,items};}
test('resumo conta zero respostas atuais quando conclusão usa histórico; permanece até voltar ao painel',async({page})=>{
 const errors=await setup(page,{history:true});await page.locator('#studyPracticeButton').click();
 await page.evaluate(s=>window.__completionResponse={completed:true,xpGranted:0,studySummary:s},summary());
 await page.locator('#completeMission').click();await expect(page.locator('#studySessionSummary')).toBeVisible();
 await expect(page.locator('#studySessionSummary')).toContainText('0 de 2 respostas confirmadas nesta sessão; 0 corretas e 0 incorretas.');
 await expect(page.locator('#studySessionSummary')).toContainText('2 questões não têm resposta confirmada');
 await expect(page.locator('#studySessionSummary')).toContainText('pode aproveitar respostas anteriores');
 await expect(page.locator('#studySessionSummary')).toContainText('não comprova domínio');
 await expect(page.locator('#studySessionSummaryTitle')).toBeFocused();
 await page.locator('#studySessionSummary button').click();await expect(page.locator('#studyDashboard')).toBeVisible();expect(errors).toEqual([]);
});
test('resumo de erros apresenta comentário privado como texto e preserva zero acertos',async({page})=>{
 const errors=await setup(page,{history:true});await page.locator('#studyPracticeButton').click();
 const s=summary([{questionId:'q.reading.0',correct:false,prompt:'Pergunta 0',explanation:'<img src=x onerror=alert(1)>',selectedFeedback:'Reveja seu raciocínio.'}]);
 await page.evaluate(s=>window.__completionResponse={completed:true,xpGranted:0,studySummary:s},s);
 await page.locator('#completeMission').click();await expect(page.locator('#studySessionSummary')).toContainText('1 de 2 respostas confirmadas nesta sessão; 0 corretas e 1 incorretas.');
 await page.locator('#studySessionSummary summary').click();await expect(page.locator('#studySessionSummary')).toContainText('<img src=x onerror=alert(1)>');
 await expect(page.locator('#studySessionSummary img')).toHaveCount(0);expect(errors).toEqual([]);
});
test('resumo de outra sessão é recusado e mantém fechamento compatível',async({page})=>{
 const errors=await setup(page,{history:true});await page.locator('#studyPracticeButton').click();
 await page.evaluate(s=>window.__completionResponse={completed:true,xpGranted:0,studySummary:s},{...summary(),sessionId:nextSession});
 await page.locator('#completeMission').click();await expect(page.locator('#studySessionSummary')).toHaveCount(0);
 await expect(page.locator('#studyDashboard')).toBeVisible();expect(errors).toEqual([]);
});
test('conclusão que falhou não exibe resumo nem encerra a sessão',async({page})=>{
 const errors=await setup(page,{history:true});await page.locator('#studyPracticeButton').click();await page.evaluate(()=>window.__completionFail=true);
 await page.locator('#completeMission').click();await expect(page.locator('#focusStatus')).toHaveText('Conclusão não confirmada');
 await expect(page.locator('#studySessionSummary')).toHaveCount(0);await expect(page.locator('#studyFocus')).toBeVisible();await expect(page.locator('#completeMission')).toBeEnabled();expect(errors).toEqual([]);
});

function privateSummary(){return {protocol:1,sessionId:session,missionId:mission.id,contentVersion:2,mode:'lesson',total:2,answered:1,correct:0,completionMayUseHistory:true,items:[{questionId:'q.reading.0',correct:false,prompt:'Resposta privada sintética',explanation:'Detalhe privado desta rodada'}]};}
test('same identity refresh preserves the owned summary and session',async({page})=>{
 const errors=await setup(page,{history:true});await page.locator('#studyPracticeButton').click();
 await page.evaluate(s=>window.__completionResponse={completed:true,xpGranted:0,studySummary:s},privateSummary());
 await page.locator('#completeMission').click();await expect(page.locator('#studySessionSummary')).toBeVisible();
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('portal:session-ready',{detail:{user:{username:'WELLYTON'}}})));
 await expect(page.locator('#studySessionSummary')).toContainText('Detalhe privado desta rodada');await expect(page.locator('#studyFocus')).toBeVisible();expect(errors).toEqual([]);
});
async function revoke(page,type){await page.evaluate(type=>window.dispatchEvent(new CustomEvent(type,{detail:{user:{username:'other-user'}}})),type);}
async function assertCleared(page){await expect(page.locator('#studySessionSummary')).toHaveCount(0);await expect(page.locator('#studyFocus')).toBeHidden();await expect(page.locator('#studyDashboard')).toBeHidden();await expect(page.locator('body')).not.toContainText('Detalhe privado desta rodada');}
for(const event of ['portal:session-cleared','portal:session-ready'])test('private summary is cleared after '+event,async({page})=>{
 const errors=await setup(page,{history:true});await page.locator('#studyPracticeButton').click();
 await page.evaluate(s=>window.__completionResponse={completed:true,xpGranted:0,studySummary:s},privateSummary());
 await page.locator('#completeMission').click();await expect(page.locator('#studySessionSummary')).toBeVisible();
 const before=await page.evaluate(()=>sessionStorage.getItem('study-reading-position-v1:wellyton:fixture.reading'));
 await revoke(page,event);await assertCleared(page);
 expect(await page.evaluate(()=>sessionStorage.getItem('study-reading-position-v1:wellyton:fixture.reading'))).toBe(before);expect(errors).toEqual([]);
});
test('late reading receipt cannot restore private UI after session clear',async({page})=>{
 const errors=await setup(page,{mode:'delay'});await page.locator('#studyPracticeButton').click();await expect(page.locator('#studyReadingConfirmation')).toContainText('Confirmando');
 await revoke(page,'portal:session-cleared');await page.evaluate(()=>window.__resolveReading());await assertCleared(page);await expect(page.locator('#studyReadingConfirmation')).toHaveCount(0);expect(errors).toEqual([]);
});
test('late completion cannot paint private summary after identity switch',async({page})=>{
 const errors=await setup(page,{history:true});await page.locator('#studyPracticeButton').click();
 await page.evaluate(s=>{window.__completionResponse={completed:true,xpGranted:0,studySummary:s};window.__completionDelay=true;},privateSummary());
 await page.locator('#completeMission').click();await expect(page.locator('#completeMission')).toBeDisabled();
 await revoke(page,'portal:session-ready');await page.evaluate(()=>window.__resolveCompletion());await assertCleared(page);expect(errors).toEqual([]);
});

for(const event of ['portal:session-cleared','portal:session-ready'])test('late leave cannot reopen private dashboard after '+event,async({page})=>{
 const errors=await setup(page);await page.evaluate(()=>window.__finishDelay=true);
 await page.locator('#leaveFocus').click();await expect.poll(()=>page.evaluate(()=>typeof window.__resolveFinish)).toBe('function');
 await revoke(page,event);await page.evaluate(()=>window.__resolveFinish());
 await expect(page.locator('#studyStatus')).toContainText('Reabra a página');await assertCleared(page);expect(errors).toEqual([]);
});
