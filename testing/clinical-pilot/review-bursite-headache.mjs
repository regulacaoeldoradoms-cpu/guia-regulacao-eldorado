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
report.priorIntactChecks='Independent editorial review: existing 1086 Worker tests, 24 UI scenarios and six native-cache cases retained; only affected checks rerun.';
report.viewportCases=[];report.transcripts=[];
try{
 for(const record of newer)for(const route of ['/medico/','/protocolo/','/recepcao/']){
  const {page,context}=await pageFor(route,{width:320,theme:route==='/protocolo/'?'dark':'light'});
  await choose(page,route,record,record.searchKind==='headache'?'cefaleia':'bursite no ombro');
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  const article=page.locator('[data-clinical-condition-id="'+record.id+'"]');
  const measure=locator=>locator.evaluate(el=>{const r=el.getBoundingClientRect(),x=Math.max(1,Math.min(innerWidth-1,r.x+r.width/2)),y=Math.max(1,Math.min(innerHeight-1,r.y+r.height/2)),hit=document.elementFromPoint(x,y);const overlays=[...document.querySelectorAll('body *')].filter(node=>{const style=getComputedStyle(node),b=node.getBoundingClientRect();return style.position==='fixed'&&style.display!=='none'&&b.width&&b.height&&b.top>innerHeight/2&&b.top<innerHeight;}).map(node=>({tag:node.tagName,id:node.id,class:node.className,top:node.getBoundingClientRect().top,bottom:node.getBoundingClientRect().bottom,text:node.innerText?.slice(0,120)}));return{top:r.top,bottom:r.bottom,height:r.height,centerHit:!!hit&&(hit===el||el.contains(hit)||hit.contains(el)),hitTag:hit?.tagName,hitClass:hit?.className,fullyInsideViewport:r.top>=0&&r.bottom<=innerHeight,overlays};});
  const requirements=[];
  for(const rule of record.rules){const locator=article.locator('[data-clinical-rule="'+rule.id+'"]');await locator.scrollIntoViewIfNeeded();const bounds=await measure(locator),lineCount=await locator.evaluate(el=>el.getClientRects().length),lines=[];for(let i=0;i<lineCount;i++){await locator.evaluate((el,index)=>{const rect=el.getClientRects()[index];window.scrollBy({top:rect.top-180,behavior:"instant"});},i);lines.push(await locator.evaluate((el,index)=>{const r=el.getClientRects()[index],hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{top:r.top,bottom:r.bottom,viewportHeight:innerHeight,uncovered:!!hit&&(hit===el||el.contains(hit)||hit.contains(el)),hitClass:hit?.className};},i));}requirements.push({id:rule.id,...bounds,lineChecks:lines,everyLineReachable:lines.every(line=>line.uncovered&&line.top>=0&&line.bottom<=line.viewportHeight)});}
  const actions=[];
  for(const selector of ['[data-pilot-print]','summary']){const locator=article.locator(selector);await locator.click({trial:true,timeout:4000});await locator.evaluate(el=>{const nav=[...document.querySelectorAll("nav")].find(node=>getComputedStyle(node).position==="fixed"&&node.getBoundingClientRect().top>innerHeight/2);const safeBottom=nav?nav.getBoundingClientRect().top:innerHeight;const r=el.getBoundingClientRect();if(r.bottom>safeBottom-20)window.scrollBy({top:r.bottom-safeBottom+20,behavior:"instant"});});const state=await measure(locator),safeBottom=Math.min(900,...state.overlays.filter(o=>o.tag==="NAV").map(o=>o.top));actions.push({selector,...state,fullyUncovered:state.top>=0&&state.bottom<=safeBottom});}
  await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"}));
  const nav=await page.evaluate(()=>[...document.querySelectorAll('nav')].filter(el=>{const r=el.getBoundingClientRect();return getComputedStyle(el).position==='fixed'&&r.top>innerHeight/2&&r.width>0;}).map(el=>({class:el.className,top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,items:[...el.querySelectorAll('a,button')].map(node=>({text:node.innerText,rect:{x:node.getBoundingClientRect().x,y:node.getBoundingClientRect().y,width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height},labels:[...node.querySelectorAll('span')].filter(s=>s.textContent.trim()).map(s=>({text:s.textContent,x:s.getBoundingClientRect().x,right:s.getBoundingClientRect().right,font:getComputedStyle(s).fontSize}))}))})));
  await page.screenshot({path:path.join(output,'bottom-'+record.searchKind+'-'+route.replaceAll('/','')+'.png'),animations:'disabled'});
  assert.ok(requirements.every(r=>r.everyLineReachable),'Requirement covered: '+JSON.stringify(requirements.filter(r=>!r.everyLineReachable)));
  assert.ok(actions.every(r=>r.centerHit&&r.fullyUncovered),'Essential action covered: '+JSON.stringify(actions));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  report.viewportCases.push({record:record.id,route,width:320,textScale:'200%',requirements,actions,nav,essentialControlsReachable:true});report.scenarios.push({name:'320-200-essential-content-actions',record:record.id,route});await context.close();
 }
 for(const record of newer){
  const {page,context}=await pageFor('/medico/');const question=record.searchKind==='headache'?'Cefaleia pediátrica: quais exames e documentos?':'Bursite no ombro: quais exames?';
  const initial=report.payloads.length,choice=await chat(page,question);assert.match(choice,/escolha/i);assert.equal(report.payloads.length,initial);
  const answer=await chat(page,'DigSaúde');assert.deepEqual(report.payloads.at(-1).protocols.map(p=>p.clinicalConditionRecord),[record]);
  if(record.searchKind==='headache'){assert.match(answer,/Diário de cefaleia/);assert.match(answer,/se houver/);assert.doesNotMatch(answer,/monoterapia|anticrise/);}else{assert.match(answer,/AP e perfil/);assert.match(answer,/Ultrassonografia/);assert.doesNotMatch(answer,/axilar|RM do ombro/);}
  const outOfScope=await chat(page,'E no SISREG?');assert.match(outOfScope,/somente.*DigSaúde|contém somente/s);assert.equal(report.payloads.length,initial+1);
  const next=record.searchKind==='headache'?'Bursite no ombro DigSaúde: exames?':'Cefaleia no DigSaúde: diário e exames?';const switched=await chat(page,next);
  assert.match(switched,new RegExp(record.searchKind==='headache'?'Bursite \/ Tendinite':'Cefaleia'));
  report.transcripts.push({question,choice,answer,outOfScope,next,switched});report.scenarios.push({name:'search-practical-answer-system-and-condition-change',record:record.id});await context.close();
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(error){report.passed=false;report.failure={message:error.message,stack:error.stack};const page=browser.contexts().at(-1)?.pages().at(-1);if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});throw error;}
finally{report.payloads=report.payloads.map(payload=>({originalQuestion:payload.originalQuestion,contextCompression:payload.contextCompression,records:payload.protocols.map(p=>({id:p.id,revision:p.clinicalConditionRecord?.revision,ruleIds:p.clinicalConditionRecord?.rules.map(r=>r.id)}))}));fs.writeFileSync(path.join(output,'browser-verification.json'),JSON.stringify(report,null,2));await browser.close();await new Promise(resolve=>server.close(resolve));console.log(JSON.stringify({passed:report.passed,scenarios:report.scenarios.length,errors:report.errors,output}));}
