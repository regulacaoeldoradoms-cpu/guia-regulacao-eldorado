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
  await page.evaluate(()=>{const root=document.querySelector('.clinical-pilot');window.scrollTo({top:scrollY+root.getBoundingClientRect().top-110,behavior:'instant'});});
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

const newer=['bursite-tendinite-20261016','cefaleia-neuropediatria-20261016'].map(name=>JSON.parse(fs.readFileSync(path.join(root,'data/clinical-conditions/'+name+'.json'),'utf8')));
report.priorIntactChecks='PR664 regressions run separately; all five records use the same renderer and canonical API projection.';
report.transcripts=[];
try{
 for(const record of newer)for(const [route,width,theme]of [['/medico/',1365,'light'],['/medico/',390,'dark'],['/protocolo/',1365,'dark'],['/recepcao/',320,'light']]){
  const {page,context}=await pageFor(route,{width,theme}),headache=record.searchKind==='headache',query=headache?'cefaleia pediátrica':'bursite no ombro';
  await page.locator(field(route)).fill(query);await page.locator('[data-clinical-system-choice]').waitFor();
  assert.equal(await page.locator('[data-clinical-rule]').count(),0);assert.equal(await page.locator('[data-pilot-system]').count(),1);assert.equal(await page.locator('#protocolList > .empty').count(),0);
  await page.locator('[data-pilot-system="'+record.id+'"]').click();const article=page.locator('[data-clinical-condition-id="'+record.id+'"]');await article.waitFor();
  assert.equal(await article.locator('[data-clinical-rule]').count(),record.rules.length);
  const text=await article.innerText();
  if(headache){assert.match(text,/Registro obrigatório/);assert.match(text,/Diário de cefaleia/);assert.doesNotMatch(text,/monoterapia|anticrise|febril simples/);}
  else{assert.match(text,/não farmacológico/);assert.match(text,/AP e perfil/);assert.match(text,/Ultrassonografia/);assert.doesNotMatch(text,/axilar|Ruptura total|RM do ombro/);}
  const projected=await page.evaluate(()=>window.ClinicalConditionPilot.protocolContext());assert.deepEqual(projected.clinicalConditionRecord,record);
  if(headache){assert.equal(projected.examesObrigatorios.length,0);assert.equal(projected.registrosObrigatorios.length,1);assert.equal(projected.recomendadosQuandoDisponiveis.length,2);}else assert.equal(projected.examesObrigatorios.length,2);
  assert.equal(await article.locator('input[type=checkbox]').count(),route==='/recepcao/'?(headache?3:7):0);
  await article.locator('[data-pilot-age]').fill(headache?'17 anos':'17 anos');await article.locator('[data-pilot-age-notice] .cp-alert').waitFor();assert.match(await article.locator('[data-pilot-age-notice]').innerText(),headache?/17 anos.*faixa não explicitada/s:/fora da faixa/);
  if(!headache)await article.locator('[data-pilot-age]').fill('18 anos');
  await article.locator('summary').click();assert.equal(await article.locator('[data-source-note] input').count(),0);
  if(headache)assert.match(await article.innerText(),/Ambos foram preservados.*não gera elegibilidade automática/s);
  if(width===320){await page.evaluate(()=>document.documentElement.style.fontSize='200%');await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.clinical-pilot')).fontSize)>=36);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await capture(page,record.searchKind+'-'+route.replaceAll('/','')+'-'+width+'-'+theme);
  report.scenarios.push({condition:record.id,route,width,theme,rules:record.rules.length,integralProjection:true,noMixedRequirements:true,noHorizontalOverflow:true});await context.close();
 }
 for(const record of newer){
  const {page,context}=await pageFor('/medico/');const before=report.payloads.length,question=record.searchKind==='headache'?'Cefaleia aos 17 anos: quais exames?':'Tendinite no ombro: quais exames?';
  const first=await chat(page,question);assert.match(first,/escolha/i);assert.equal(report.payloads.length,before);
  const second=await chat(page,'Teleatendimento');assert.equal(report.payloads.length,before+1);const payload=report.payloads.at(-1);assert.deepEqual(payload.protocols.map(p=>p.clinicalConditionRecord),[record]);assert.match(payload.originalQuestion,new RegExp(record.searchKind==='headache'?'Cefaleia aos 17':'Tendinite no ombro'));
  if(record.searchKind==='headache'){assert.match(second,/Diário de cefaleia/);assert.match(second,/17 anos/);}else assert.match(second,/AP e perfil/);
  const next=await chat(page,'E quais documentos?');assert.match(next,new RegExp(record.searchKind==='headache'?'Diário de cefaleia':'AP e perfil'));assert.equal(report.payloads.length,before+1);
  report.transcripts.push({condition:record.id,first,second,next});report.scenarios.push({name:'chat-short-choice-followup',condition:record.id,initialProviderCalls:0,integralRecord:true});await context.close();
 }
 for(const record of newer){const {page,context}=await pageFor('/medico/');await choose(page,'/medico/',record,record.searchKind==='headache'?'cefaleia':'bursite no ombro');
  const answer=await chat(page,'Quais exames para diabetes?');assert.doesNotMatch(answer,/Bursite \/ Tendinite|Neuropediatria - Cefaleia/);assert.ok(report.payloads.at(-1).protocols.every(p=>!p.clinicalConditionRecord));assert.ok(report.payloads.at(-1).protocols.some(p=>p.id==='endocrinologia'));
  report.scenarios.push({name:'unrelated-topic-after-new-pilot',condition:record.id,legacyRankingRestored:true});await context.close();}
 for(const record of newer){const file=record.searchKind==='headache'?'cefaleia-neuropediatria':'bursite-tendinite';const {page,context}=await pageFor('/medico/',{failRecord:file+'-20261016.json'});await page.locator('#sideSearchInput').fill(record.searchKind==='headache'?'cefaleia':'bursite');await page.locator('[data-pilot-system="'+record.id+'"]').click();await page.locator('[data-clinical-pilot-unavailable]').waitFor();assert.equal(await page.locator('[data-clinical-rule]').count(),0);
  await chat(page,'Quais exames para diabetes?');assert.ok(report.payloads.at(-1).protocols.every(p=>!p.clinicalConditionRecord));report.scenarios.push({name:'failed-new-pilot-isolated',condition:record.id,legacyStillAvailable:true});await context.close();}
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(error){report.passed=false;report.failure={message:error.message,stack:error.stack};const page=browser.contexts().at(-1)?.pages().at(-1);if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});throw error;}
finally{report.payloads=report.payloads.map(payload=>({originalQuestion:payload.originalQuestion,contextCompression:payload.contextCompression,records:payload.protocols.map(p=>({id:p.id,revision:p.clinicalConditionRecord?.revision,ruleIds:p.clinicalConditionRecord?.rules.map(r=>r.id)}))}));fs.writeFileSync(path.join(output,'browser-verification.json'),JSON.stringify(report,null,2));await browser.close();await new Promise(resolve=>server.close(resolve));console.log(JSON.stringify({passed:report.passed,scenarios:report.scenarios.length,errors:report.errors,output}));}
