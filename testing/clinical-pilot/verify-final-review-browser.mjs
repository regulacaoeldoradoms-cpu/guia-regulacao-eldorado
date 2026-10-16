// Focused final review: real UI, ambiguous system queries and short follow-up choices.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url)), require = createRequire(import.meta.url);
const { chromium } = require(process.env.CLINICAL_PILOT_PLAYWRIGHT || 'playwright');
const output = path.resolve(process.argv[2] || path.join(root, '.local/clinical-pilots-v2')); fs.mkdirSync(output, { recursive: true });
const sourceStyleFocus = process.argv.includes('--source-style');
const finalFocus = process.argv.includes('--final-focus') || sourceStyleFocus;
const names = ['convulsao-epilepsia-20261016','dor-no-ombro-20261016','ombro-referencias-sisreg-cg-20261016'];
const records = names.map(name => JSON.parse(fs.readFileSync(path.join(root, 'data/clinical-conditions/' + name + '.json'), 'utf8')));
const [np, shoulder, related] = records, source = fs.readFileSync(path.join(root, 'data/protocol-source.html'));
const mime = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2' };
const server = http.createServer((req,res) => {
  if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
  let file = decodeURIComponent(new URL(req.url,'http://local').pathname).slice(1); if (!file || file.endsWith('/')) file += 'index.html';
  const absolute = path.resolve(root,file); if (!absolute.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
  try { const body = fs.readFileSync(absolute); res.writeHead(200,{'Content-Type':(mime[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8','Cache-Control':'no-store'}); res.end(body); }
  catch { res.writeHead(404); res.end('Local fixture: absent'); }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve)); const origin = 'http://127.0.0.1:' + server.address().port;
const report = { scenarios:[], payloads:[], errors:[], blockedExternal:[], externalHttpRequestsSent:0, serviceWorkers:'blocked; cache policy covered by focused VM tests', priorIntactChecks:'The previous 24 tests and six legacy pixel comparisons were not rerun in this lot.' };
const browser = await chromium.launch({ headless:true });
async function pageFor(route,{width=1365,theme='light',failRecord}={}) {
  const context = await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'}), page = await context.newPage();
  page.on('pageerror',error => report.errors.push(error.message));
  await context.addInitScript(theme => {
    localStorage.setItem('regulacao.portal.theme.active.v1',theme);
    const user = { name:'Verificação sintética',username:'pilotos-locais',role:location.pathname.startsWith('/recepcao/')?'recepcao':'medico',interfaceTheme:theme };
    window.RegulationAuth = { enforcementEnabled:false,requireRole:async()=>user,getCachedUser:()=>user,getToken:()=>null,logout:async()=>{} };
    window.print = () => { window.__printCalled = true; };
  },theme);
  await page.route('**/*',async route => {
    const request = route.request(), url = new URL(request.url());
    if (['/js/auth-config.js','/js/auth-client.js','/js/auth-fetch-bridge.js','/js/portal-global-chat.js','/js/pets-bootstrap.js','/js/portal-performance.js','/js/portal-observability.js','/js/portal-pwa.js'].includes(url.pathname)) return route.fulfill({contentType:'text/javascript',body:''});
    if (url.pathname === '/js/ai-config.js') return route.fulfill({contentType:'text/javascript',body:'window.REGULATION_AI_CONFIG={endpoint:location.origin+"/__mock-ai",maxQuestionLength:3000};'});
    if (url.pathname === '/__mock-ai' && request.postDataJSON()?.clinicalConditionProbe) {
      const ids=request.postDataJSON().clinicalConditionProbe,registry=fs.readdirSync(path.join(root,'data/clinical-conditions')).filter(name=>name.endsWith('.json')).map(name=>JSON.parse(fs.readFileSync(path.join(root,'data/clinical-conditions',name),'utf8')));
      (report.compatibilityProbes ||= []).push(ids);return route.fulfill({contentType:'application/json',body:JSON.stringify({clinicalConditionProbe:true,records:ids.map(id=>registry.find(record=>record.id===id))})});
    }
    if (url.pathname === '/__mock-ai') { report.payloads.push(request.postDataJSON()); return route.fulfill({status:503,contentType:'application/json',body:'{"error":"Indisponibilidade estritamente simulada"}'}); }
    if (failRecord && url.pathname.includes(failRecord)) return route.fulfill({status:503,contentType:'application/json',body:'{}'});
    if (url.hostname === 'raw.githubusercontent.com') return route.fulfill({contentType:'text/html',body:source});
    if (url.origin !== origin) { report.blockedExternal.push(url.origin + url.pathname); return route.abort('blockedbyclient'); }
    return route.continue();
  });
  await page.goto(origin+route,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#protocolList .protocol-card, #receptionProtocolList button[data-id]'));
  return { page,context };
}
const field = route => route === '/recepcao/' ? '#receptionSearch' : '#sideSearchInput';
async function choose(page,route,record,query='dor no ombro') {
  await page.locator(field(route)).fill(query); await page.locator(`[data-pilot-system="${record.id}"]`).click();
  await page.locator(`[data-clinical-condition-id="${record.id}"]`).waitFor();
}
async function capture(page,name) {
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(output,name+'.png'),fullPage:true,animations:'disabled'});
  await page.evaluate(()=>{const root=document.querySelector('.clinical-pilot');window.scrollTo({top:scrollY+root.getBoundingClientRect().top-20,behavior:'instant'});});
  await page.screenshot({path:path.join(output,name+'-viewport.png'),animations:'disabled'});
}
async function ask(page,question) {
  await page.locator('#aiLauncher').click(); await page.locator('#aiInput').fill(question); await page.locator('#aiSend').click();
  await page.locator('.ai-message.contingency').waitFor();
  const text = await page.locator('.ai-message.contingency').last().innerText(); await page.locator('#aiClose').click(); return text;
}
async function chat(page,question){
  await page.locator('#aiLauncher').click();const before=await page.locator('.ai-message.assistant:not(.loading)').count();
  await page.locator('#aiInput').fill(question);await page.locator('#aiSend').click();
  await page.waitForFunction(before=>document.querySelectorAll('.ai-message.assistant:not(.loading)').length>before,before);
  const answer=await page.locator('.ai-message.assistant:not(.loading)').last().innerText();await page.locator('#aiClose').click();return answer;
}
report.transcripts=[];
try{
  if(!process.argv.includes('--failure-only')){
  for(const [route,width,theme]of [['/medico/',1365,'light'],['/protocolo/',390,'dark'],['/recepcao/',320,'dark']]){
    const {page,context}=await pageFor(route,{width,theme});await page.locator(field(route)).fill('dor no ombro');
    const pending=page.locator('[data-clinical-system-choice="shoulder"]');await pending.waitFor();
    assert.equal(await page.locator('[data-clinical-rule]').count(),0);assert.equal(await pending.locator('[data-pilot-open]').count(),2);
    assert.doesNotMatch(await pending.innerText(),/AP \+ P \+ axilar|USG de ombro: obrigatório|carimbo e assinatura/);
    await pending.locator('[data-pilot-open="'+shoulder.id+'"]').click();
    let root=page.locator('[data-clinical-condition-id="'+shoulder.id+'"]');await root.waitFor();assert.equal(await root.locator('[data-clinical-rule]').count(),16);
    await root.locator('summary').click();assert.match(await root.innerText(),/não cria dispensa, bloqueio automático ou nova obrigação de obter uma decisão agora/);
    assert.equal(await root.locator('[data-source-note] input').count(),0);assert.equal(await root.locator('input[type=checkbox]').count(),route==='/recepcao/'?6:0);
    assert.equal(await root.locator('[data-source-note]').count(),5);
    if(width===320){await page.evaluate(()=>document.documentElement.style.fontSize='200%');await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.clinical-pilot')).fontSize)>=36);}
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await capture(page,'final-'+route.replaceAll('/','')+'-dig');
    await page.locator('[data-pilot-system="'+related.id+'"]').click();root=page.locator('[data-clinical-condition-id="'+related.id+'"]');await root.waitFor();
    assert.equal(await root.locator('[data-clinical-rule]').count(),11);assert.doesNotMatch(await root.innerText(),/AP \+ P \+ axilar: obrigatório/);
    await root.locator('summary').click();assert.equal(await root.locator('[data-source-note]').count(),4);
    assert.deepEqual(await page.evaluate(()=>window.ClinicalConditionPilot.protocolContext().clinicalConditionRecord),related);
    await capture(page,'final-'+route.replaceAll('/','')+'-sisreg');
    report.scenarios.push({name:'search-choice-'+route,implicitRequirements:0,digRules:16,sisregRules:11,noNoteCheckboxes:true,noHorizontalOverflow:true,width,theme});await context.close();
  }
  {
    const {page,context}=await pageFor('/medico/');let requests=report.payloads.length;
    const first=await chat(page,'Quais exames para dor no ombro?');assert.match(first,/escolha/i);assert.doesNotMatch(first,/AP \+ P \+ axilar|USG de ombro: obrigatório/);assert.equal(report.payloads.length,requests);
    const second=await chat(page,'DigSaúde');assert.match(second,/AP \+ P \+ axilar/);assert.doesNotMatch(second,/RX AP\/perfil|carimbo e assinatura/);
    assert.equal(report.payloads.length,requests+1);const payload=report.payloads.at(-1);assert.match(payload.originalQuestion,/Quais exames para dor no ombro/);assert.deepEqual(payload.protocols.map(p=>p.clinicalConditionRecord),[shoulder]);
    const third=await chat(page,'E a TC?');assert.match(third,/instabilidade ou luxação recidivante, e se houver/);assert.equal(report.payloads.length,requests+1);
    const ambiguous=await chat(page,'Ombro DigSaúde e SISREG: quais exames?');assert.match(ambiguous,/mais de um sistema/);assert.equal(report.payloads.length,requests+1);
    const sisreg=await chat(page,'SISREG');assert.match(sisreg,/RX AP\/perfil e USG/);assert.doesNotMatch(sisreg,/AP \+ P \+ axilar: obrigatório/);
    report.transcripts.push({name:'shoulder-without-system',first,second,third,ambiguous,sisreg});report.scenarios.push({name:'chat-no-system-short-choice-followup',initialAiCalls:0,chosenRecordIntegral:true,originalQuestionPreserved:true,systemsSeparated:true});await context.close();
  }
  {
    const {page,context}=await pageFor('/medico/');const requests=report.payloads.length;
    const first=await chat(page,'Convulsão infantil aos 17 anos: quais exames?');assert.match(first,/escolha/i);assert.equal(report.payloads.length,requests);
    const second=await chat(page,'DigSaúde MS');assert.match(second,/não define outra rota nem transfere/);assert.match(second,/Eletroencefalograma \(EEG\), se houver/);
    const payload=report.payloads.at(-1);assert.deepEqual(payload.protocols.map(p=>p.clinicalConditionRecord),[np]);assert.equal(payload.protocols[0].clinicalAge.years,17);assert.match(payload.originalQuestion,/17 anos: quais exames/);
    assert.doesNotMatch(second,/Relatório Escolar|BERA|M-CHAT|SNAP/);report.transcripts.push({name:'seizure-17',first,second});report.scenarios.push({name:'seizure-17-short-system-choice',ageRetained:true,ageGapAndExamsAnswered:true,integralRules:15});await context.close();
  }
  {
    const {page,context}=await pageFor('/medico/');const answer=await chat(page,'Compare DigSaúde e SISREG para dor no ombro');assert.match(answer,/recorte separado/);
    assert.deepEqual(report.payloads.at(-1).protocols.map(p=>p.clinicalConditionRecord),[shoulder,related]);report.scenarios.push({name:'explicit-comparison',integralRecords:2,ruleCounts:[16,11]});await context.close();
  }
  {
    const {page,context}=await pageFor('/medico/');const requests=report.payloads.length,answer=await chat(page,'Quais exames para ombro no CORE?');assert.match(answer,/nenhuma fonte clínica ambulatorial foi validada/);assert.equal(report.payloads.length,requests);report.scenarios.push({name:'core-source-limit',aiCalls:0});await context.close();
  }
  }
  {
    const {page,context}=await pageFor('/recepcao/',{failRecord:'dor-no-ombro-20261016.json'});await page.locator('#receptionSearch').fill('dor no ombro');await page.locator('[data-pilot-system="'+shoulder.id+'"]').click();await page.locator('[data-clinical-pilot-unavailable]').waitFor();assert.equal(await page.locator('[data-clinical-rule]').count(),0);
    await page.locator('[data-pilot-system="'+related.id+'"]').click();assert.equal(await page.locator('[data-clinical-rule]').count(),11);report.scenarios.push({name:'record-failure-no-general-fallback',otherSystemStillAvailable:true});await context.close();
  }
  assert.deepEqual(report.errors,[]);report.passed=true;
}catch(error){report.passed=false;report.failure={message:error.message,stack:error.stack};const page=browser.contexts().at(-1)?.pages().at(-1);if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});throw error;}
finally{report.payloads=report.payloads.map(payload=>({originalQuestion:payload.originalQuestion,contextCompression:payload.contextCompression,records:payload.protocols.map(p=>({id:p.id,revision:p.clinicalConditionRecord?.revision,ruleIds:p.clinicalConditionRecord?.rules.map(r=>r.id)}))}));fs.writeFileSync(path.join(output,'browser-verification.json'),JSON.stringify(report,null,2));await browser.close();await new Promise(resolve=>server.close(resolve));console.log(JSON.stringify({passed:report.passed,scenarios:report.scenarios.length,errors:report.errors,output}));}
