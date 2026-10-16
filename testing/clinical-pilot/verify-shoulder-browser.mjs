// Focused verification of the new shoulder paths and revised shared renderer.
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
try {
  const cases = [
    {route:'/medico/',record:shoulder,width:1365,theme:'light',age:'52 anos'},
    {route:'/protocolo/',record:shoulder,width:390,theme:'dark',age:'17 anos'},
    {route:'/recepcao/',record:shoulder,width:390,theme:'light',age:'18 anos'},
    {route:'/medico/',record:related,width:1365,theme:'dark',age:'18 anos'},
    {route:'/protocolo/',record:related,width:390,theme:'light',age:'18 anos'},
    {route:'/recepcao/',record:related,width:390,theme:'dark',age:'52 anos'},
    {route:'/medico/',record:np,width:390,theme:'light',age:'17 anos'}
  ];
  const printed = new Set();
  for (const entry of cases.filter(entry => sourceStyleFocus ? entry.record === related : !finalFocus || entry.record === np || (entry.record === shoulder && entry.route === '/protocolo/')).map(entry => sourceStyleFocus ? {...entry,theme:'dark'} : entry)) {
    const {page,context} = await pageFor(entry.route,entry);
    await choose(page,entry.route,entry.record,(entry.record === np ? 'convulsão infantil ' : 'dor no ombro ') + entry.age);
    if(finalFocus && !sourceStyleFocus && entry.route === '/protocolo/') {
      await page.reload({waitUntil:'networkidle'});
      await page.locator(`[data-clinical-condition-id="${entry.record.id}"]`).waitFor();
      await page.locator('[data-pilot-age]').fill(entry.age);
    }
    const root = page.locator('[data-clinical-condition-id]'), ids = await root.locator('[data-clinical-rule]').evaluateAll(nodes=>nodes.map(n=>n.dataset.clinicalRule));
    assert.deepEqual(ids.sort(),entry.record.rules.map(r=>r.id).sort());
    const text = await root.innerText(), projection = await page.evaluate(()=>window.ClinicalConditionPilot.protocolContext());
    assert.deepEqual(projection.clinicalConditionRecord,entry.record);
    if (entry.record === shoulder) {
      assert.match(text,/AP \+ P \+ axilar/); assert.match(text,/6 meses ou importante prejuízo/); assert.match(text,/e se houver o exame/);
      assert.equal(projection.examesObrigatorios.length,2); assert.equal(projection.examesCondicionais.length,1);
      assert.doesNotMatch(text,/Exame neurológico|Eletroencefalograma/);
      if(entry.age==='17 anos')assert.match(await page.locator('[data-pilot-age-notice]').innerText(),/A partir de 18 anos/);
    } else if (entry.record === related) {
      assert.match(text,/não constituem protocolo específico|Não constituem protocolo específico/i);
      assert.equal(projection.examesObrigatorios.length,0); assert.match(text,/RX AP\/perfil e USG/);
      if(entry.age==='18 anos')assert.match(await page.locator('[data-pilot-age-notice]').innerText(),/sobreposição/);
    } else {
      assert.match(text,/Epilepsia prévia com efeitos adversos intoleráveis da medicação/);
      await root.locator('summary').click(); assert.match(await root.innerText(),new RegExp(np.sources[0].fileHash));
      assert.match(await root.innerText(),/não comprova origem institucional nem vigência/);
      await root.locator('summary').click();
    }
    const printBefore = await page.evaluate(()=>window.ClinicalConditionPilot.printDocument());
    if(entry.route==='/recepcao/') {
      assert.equal(await root.locator('input[type=checkbox]').count(),entry.record===shoulder?6:0);
      if(entry.record===shoulder)await root.locator('input[type=checkbox]').first().check();
      assert.equal(await page.evaluate(()=>window.ClinicalConditionPilot.printDocument()),printBefore);
    }
    const metrics = await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,font:getComputedStyle(document.querySelector('.clinical-pilot')).fontSize}));
    assert.equal(metrics.width<=metrics.viewport+1,true,JSON.stringify(metrics));
    const name=entry.route.replaceAll('/','')+'-'+(entry.record===np?'convulsao':entry.record===shoulder?'ombro-dig':'ombro-sisreg')+'-'+entry.width+'-'+entry.theme;
    if(sourceStyleFocus) {
      await root.locator('summary').click();
      const colors=await root.locator('.cp-sources').evaluate(element=>({background:getComputedStyle(element).backgroundColor,text:getComputedStyle(element.querySelector('summary')).color}));
      const luminance=value=>value.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
      const a=luminance(colors.background),b=luminance(colors.text),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      assert.ok(ratio>=4.5,JSON.stringify({colors,ratio}));
      await root.locator('.cp-sources').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,name+'-fontes.png'),animations:'disabled'});
      report.scenarios.push({name:name+'-fontes',sourcePanelOpen:true,contrastRatio:ratio,colors});
    }
    await capture(page,name);
    if(!sourceStyleFocus&&entry.route==='/medico/'&&!printed.has(entry.record.id)) {
      const popupPromise=page.waitForEvent('popup'); await root.locator('[data-pilot-print]').click(); const popup=await popupPromise;
      await popup.waitForLoadState('domcontentloaded'); assert.equal(await popup.locator('[data-clinical-rule]').count(),entry.record.rules.length);
      const printName=entry.record===np?'convulsao-v2':entry.record===shoulder?'ombro-dig':'ombro-sisreg';
      await popup.pdf({path:path.join(output,'impressao-'+printName+'.pdf'),format:'A4'}); printed.add(entry.record.id); await popup.close();
    }
    if(entry.record===shoulder&&entry.route==='/medico/') {
      const reply=await ask(page,'Quais exames são obrigatórios para dor no ombro?');assert.match(reply,/AP \+ P \+ axilar/);assert.match(reply,/TC do ombro apenas se houver/);
      assert.deepEqual(report.payloads.at(-1).protocols[0].clinicalConditionRecord,shoulder);
    }
    if(!sourceStyleFocus)report.scenarios.push({name,record:entry.record.id,revision:entry.record.revision,ruleIds:ids,metrics,ageNotice:await page.locator('[data-pilot-age-notice]').innerText()});
    console.log('OK '+name); await context.close();
  }
  if(!finalFocus) {
    const {page,context}=await pageFor('/medico/'); await choose(page,'/medico/',shoulder);
    const reply=await ask(page,'Compare as diferenças entre DigSaúde e SISREG para ombro.');
    const sent=report.payloads.at(-1);assert.deepEqual(sent.protocols.map(p=>p.clinicalConditionRecord),[shoulder,related]);
    assert.match(reply,/DigSaúde MS/);assert.match(reply,/SISREG \/ Campo Grande/);assert.match(reply,/RX AP\/perfil/);
    report.scenarios.push({name:'comparacao-ia-contingencia',completeRecords:2,localSystemSeparation:true});await context.close();
  }
  if(!finalFocus) {
    const {page,context}=await pageFor('/medico/');await page.locator('#sideSearchInput').fill('dor no ombro');assert.equal(await page.locator('[data-pilot-system]').count(),2);
    await page.locator('[data-filter=digsus]').click();assert.equal(await page.locator('[data-pilot-system]').count(),1);await page.locator('[data-pilot-system]').click();
    await page.locator('[data-filter=sisreg]').click();assert.equal(await page.locator('[data-clinical-condition-id]').count(),0);
    assert.equal(await page.locator(`[data-pilot-system="${related.id}"]`).count(),1);await page.locator('[data-pilot-system]').click();
    assert.equal(await page.locator(`[data-clinical-condition-id="${related.id}"]`).count(),1);
    await page.locator('#sideSearchInput').fill('ombro CORE');assert.equal(await page.locator('[data-pilot-system]').count(),0);await page.getByText('CORE: fonte clínica ambulatorial não validada neste recorte.').waitFor();
    report.scenarios.push({name:'selecao-sistema-filtros-core',noImplicitTransfer:true});await context.close();
  }
  if(!finalFocus) {
    const {page,context}=await pageFor('/recepcao/',{failRecord:'dor-no-ombro-20261016.json'});await page.locator('#receptionSearch').fill('dor no ombro');await page.locator(`[data-pilot-system="${shoulder.id}"]`).click();
    await page.getByText(/Nenhuma lista geral foi usada como substituta/).waitFor();await page.locator(`[data-pilot-system="${related.id}"]`).click();assert.equal(await page.locator('[data-clinical-rule]').count(),11);
    report.scenarios.push({name:'falha-ombro-isolada',otherRecordStillWorks:true});await context.close();
  }
  if(!finalFocus) {
    const {page,context}=await pageFor('/medico/',{width:320});await choose(page,'/medico/',shoulder,'ombro DigSaúde 17 anos');await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.clinical-pilot')).fontSize)>=36);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await capture(page,'ombro-320-texto200');
    report.scenarios.push({name:'ombro-320-texto200',noHorizontalOverflow:true});await context.close();
  }
  if(finalFocus&&!sourceStyleFocus) {
    const {page,context}=await pageFor('/medico/');await choose(page,'/medico/',shoulder);
    const reply=await ask(page,'Quais exames no SISREG para dor no ombro?');
    assert.deepEqual(report.payloads.at(-1).protocols.map(p=>p.clinicalConditionRecord),[related]);
    assert.match(reply,/SISREG \/ Campo Grande/);assert.doesNotMatch(reply,/AP \+ P \+ axilar: obrigatório/);
    report.scenarios.push({name:'sistema-explicito-na-pergunta',completeSelectedSystemRecord:true});
    const requests=report.payloads.length;
    await page.locator('#aiLauncher').click();await page.locator('#aiInput').fill('E quais exames para ombro no CORE?');await page.locator('#aiSend').click();
    await page.locator('.ai-message.assistant').filter({hasText:/CORE: nenhuma fonte clínica ambulatorial foi validada/}).waitFor();
    assert.equal(report.payloads.length,requests);report.scenarios.push({name:'core-sem-inferencia-ou-chamada-remota',extraAiRequests:0});await context.close();
  }
  assert.deepEqual(report.errors,[]);report.passed=true;
} catch(error) {
  report.passed=false;report.failure={message:error.message,stack:error.stack};const page=browser.contexts().at(-1)?.pages().at(-1);if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});throw error;
} finally {
  report.payloads=report.payloads.map(payload=>({contextCompression:payload.contextCompression,records:payload.protocols.map(p=>({id:p.id,revision:p.clinicalConditionRecord?.revision,ruleIds:p.clinicalConditionRecord?.rules.map(r=>r.id)}))}));
  fs.writeFileSync(path.join(output,'browser-verification.json'),JSON.stringify(report,null,2));await browser.close();await new Promise(resolve=>server.close(resolve));console.log(JSON.stringify({passed:report.passed,scenarios:report.scenarios.length,errors:report.errors,output}));
}
