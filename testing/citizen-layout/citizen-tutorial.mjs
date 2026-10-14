// Only synthetic accounts/files and intercepted APIs. Never use a live endpoint.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium,user}=await import('./mobile-profile-refinement.mjs');
const {applyTextScale}=await import('./text-scale.mjs');
const output=path.resolve(process.env.TUTORIAL_OUTPUT||'.local/citizen-tutorial');await fs.mkdir(output,{recursive:true});
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
const steps=['open','sugestao','reclamacao','elogio','denuncia','report','details','files','preview','remove','identified','protected','send','track','reply','notice'];
async function open(page){await page.locator('[data-tutorial-start]').click();await page.locator('dialog.citizen-tutorial').waitFor();await page.locator('dialog #openNewManifestation').waitFor();return page.locator('dialog.citizen-tutorial');}
async function advance(d){if(await d.locator('[data-tutorial-next]').isDisabled())console.log('Pending stage:',await d.locator('[data-tutorial-progress]').textContent(),await d.locator('[data-tutorial-feedback]').textContent());await d.locator('[data-tutorial-next]').click();}
async function screenshot(page,label){await applyTextScale(page);await page.screenshot({path:path.join(output,label+'.png')});}
async function finish(d,page,label){
 await d.locator('#openNewManifestation').click();assert.equal(await d.locator('.citizen-modal[aria-modal=true]').count(),0);await advance(d);
 for(const type of ['sugestao','reclamacao','elogio','denuncia']){await d.locator(`input[value=${type}]`).check();await advance(d);}
 await d.locator('[data-tutorial-example]').click();await screenshot(page,label+'-report');await advance(d);
 await d.locator('[data-tutorial-example]').click();await advance(d);
 await d.locator('#composeAttachments summary').click();await d.locator('#composeChooseFiles').click();await advance(d);
 await d.locator('.compose-file-thumb.has-preview').waitFor();await d.locator('.compose-file-thumb').click();assert.equal(await d.locator('.citizen-modal[aria-modal=true]').count(),0);await screenshot(page,label+'-preview');await page.keyboard.press('Escape');await advance(d);
 await d.locator('.compose-file-remove').click();await advance(d);
 await d.locator('input[value=identificada]').check();await advance(d);
 await d.locator('input[name=manifestationPrivacy]:not([value=identificada])').check();await advance(d);
 await screenshot(page,label+'-privacy');
 await d.locator('#manifestationConfirm').check();await d.locator('#submitManifestation').focus();await page.keyboard.press('Enter');
 // Additional submit paths are safe, including native submit(), Enter, and a
 // burst of programmatic duplicate events through the same native controller.
 await d.locator('#newManifestationForm').evaluate(n=>{n.submit();n.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});
 await d.locator('#detailContent').waitFor({state:'visible'});await advance(d);
 await d.locator('#manifestationDetailModal [data-close-modal]').click();await d.locator('#manifestationList [data-protocol]').click();await advance(d);
 await d.locator('[data-tutorial-example]').click();await d.locator('#replyButton').click();await advance(d);
 await d.locator('#manifestationDetailModal [data-close-modal]').click();await d.locator('#notificationList [data-notification]').click();
 await screenshot(page,label+'-complete');await advance(d);await page.locator('dialog.citizen-tutorial').waitFor({state:'detached'});
}
try{
 for(const width of (process.env.WIDTHS||'320,360,390,412,1280').split(',').map(Number))for(const theme of ['light','dark'])for(const scale of (process.env.SCALES||'1,2').split(',').map(Number)){
  const result={width,theme,scale,errors:[],completionRequests:0},label=`${width}-${theme}-${scale}`;
  const {page,context,audit}=await newPage(browser,{width,theme,seedOnce:true},server.origin,result);
  try{
   await context.addInitScript(()=>{
    window.__tutorialNetwork=[];const native=window.fetch;
    window.fetch=function(input,options){const url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);window.__tutorialNetwork.push({path:url.pathname,method:options?.method||input?.method||'GET',demo:Boolean(document.querySelector('dialog.citizen-tutorial[open]'))});return native.call(this,input,options);};
   });
   await context.route('**/api/portal-tutorials/**',async route=>{
    if(route.request().method()==='POST'){result.completionRequests++;assert.deepEqual(route.request().postDataJSON(),{version:1,steps});assert.equal(await page.locator('dialog.citizen-tutorial').count(),0);return route.fulfill({json:{completion:{version:1,completedAt:'2026-01-01T12:00:00Z'}}});}
    return route.fulfill({json:{completion:null}});
   });
   await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded',timeout:30000});await ready(page,'/cidadao/');await page.locator('[data-tutorial-start]').waitFor();
   await page.locator('#openNewManifestation').click();await page.locator('input[value=sugestao]').check();await page.locator('#manifestationSubject').fill('Rascunho sintético preservado');await page.locator('#manifestationDescription').fill('Relato sintético que nunca deve entrar na demonstração nem no registro de progresso.');await page.locator('#manifestationConfirm').check();
   await page.locator('#manifestationFiles').setInputFiles({name:'rascunho-sintetico.png',mimeType:'image/png',buffer:png});await page.locator('.compose-file-thumb.has-preview').waitFor();
   const nativeForm=await page.locator('#newManifestationForm').elementHandle(),nativeFiles=await page.locator('#manifestationFiles').elementHandle(),nativeNotice=await page.locator('#markNotificationsRead').elementHandle();
   await page.locator('#newManifestationModal .citizen-modal-close').click();
   const before=await nativeForm.evaluate(n=>({subject:n.querySelector('#manifestationSubject').value,text:n.querySelector('#manifestationDescription').value,confirm:n.querySelector('#manifestationConfirm').checked}));
   let d=await open(page);
   process.env.TEXT_SCALE=scale===2?'2':'';await applyTextScale(page);
   assert.equal(await page.locator('#newManifestationForm').count(),1);assert(!(await d.textContent()).includes(before.text));assert(await nativeForm.evaluate(n=>!n.isConnected));
   // Original live handlers, detached nodes and all global network transports.
   await nativeForm.evaluate(n=>{n.requestSubmit();n.submit();n.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});await nativeNotice.evaluate(n=>{n.click();n.click();});
   const barriers=await page.evaluate(async()=>{
    const caught=[];for(const method of ['POST','PATCH','DELETE','GET'])try{await fetch('/api/synthetic-forbidden',{method});}catch(e){caught.push(e.name);}
    let ws=false;try{new WebSocket('wss://example.invalid/demo');}catch(e){ws=e.name==='AbortError';}
    let xhr=false;try{const x=new XMLHttpRequest();x.open('POST','/api/synthetic-forbidden');x.send('synthetic');}catch(e){xhr=e.name==='AbortError';}
    return {caught,xhr,ws,beacon:navigator.sendBeacon('/api/synthetic-forbidden','synthetic'),webSocket:WebSocket.prototype.send.call({},'synthetic')};
   });assert.deepEqual(barriers,{caught:['AbortError','AbortError','AbortError','AbortError'],xhr:true,ws:true,beacon:false,webSocket:undefined});
   await d.locator('#openNewManifestation').click();assert.equal(await d.locator('.citizen-modal[aria-modal=true]').count(),0);await advance(d);await d.locator('input[value=sugestao]').check();await advance(d);
   await d.locator('[data-tutorial-back]').click();await d.locator('input[value=sugestao]').check();await advance(d);
   await d.locator('[data-tutorial-pause]').click();assert.equal(result.completionRequests,0);
   assert.deepEqual(await nativeForm.evaluate(n=>({subject:n.querySelector('#manifestationSubject').value,text:n.querySelector('#manifestationDescription').value,confirm:n.querySelector('#manifestationConfirm').checked})),before);
   assert.equal(await nativeFiles.evaluate(n=>n.files[0].name),'rascunho-sintetico.png');
   d=await open(page);assert.match(await d.locator('[data-tutorial-progress]').textContent(),/Etapa 3 de/);await d.locator('[data-tutorial-skip]').click();assert.equal(result.completionRequests,0);
   await page.locator('[data-tutorial-restart]').click();d=page.locator('dialog.citizen-tutorial');await d.locator('#openNewManifestation').waitFor();await applyTextScale(page);await finish(d,page,label);
   await page.locator('[data-tutorial-status]').filter({hasText:'Tutorial concluído.'}).waitFor();assert.equal(result.completionRequests,1);
   assert(await nativeForm.evaluate(n=>n.isConnected));assert.deepEqual(await nativeForm.evaluate(n=>({subject:n.querySelector('#manifestationSubject').value,text:n.querySelector('#manifestationDescription').value,confirm:n.querySelector('#manifestationConfirm').checked})),before);assert.equal(await nativeFiles.evaluate(n=>n.files[0].name),'rascunho-sintetico.png');
   const network=await page.evaluate(()=>__tutorialNetwork.filter(n=>n.demo&&n.path.startsWith('/api/')));assert.deepEqual(network,[]);
   const persistence=await page.evaluate(()=>Object.entries(localStorage).filter(([k])=>k.startsWith('portal.citizen.tutorial.')).map(([,v])=>JSON.parse(v)));assert.deepEqual(persistence,[{version:1,steps}]);
   await page.locator('[data-tutorial-restart]').click();await page.locator('dialog [data-tutorial-skip]').click();assert.equal(result.completionRequests,1);
   await page.locator('#openNewManifestation').click();assert.equal(await page.locator('#manifestationDescription').inputValue(),before.text);await page.locator('#newManifestationModal .citizen-modal-close').click();
   const wire=await page.evaluate(()=>__tutorialNetwork);assert(!wire.some(n=>n.path.includes('synthetic-forbidden')));assert(!wire.some(n=>n.method==='POST'&&n.path.startsWith('/api/council/')));
   assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);result.passed=true;result.zeroDemoApiRequests=true;results.push(result);console.log(JSON.stringify(result));
  }catch(error){await screenshot(page,label+'-failure');console.log(result.errors);throw error;}finally{await context.close();await fs.writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
