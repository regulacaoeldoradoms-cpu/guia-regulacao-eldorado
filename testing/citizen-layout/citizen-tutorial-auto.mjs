// Observable task completion, synthetic accounts and local intercepted APIs only.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium,user}=await import('./mobile-profile-refinement.mjs');
const {stage}=await import('./citizen-tutorial-actions.mjs');
const output=path.resolve(process.env.TUTORIAL_OUTPUT||'.local/citizen-tutorial');await fs.mkdir(output,{recursive:true});
const steps=['open','sugestao','reclamacao','elogio','denuncia','report','details','files','preview','remove','identified','protected','send','track','reply','notice'];
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
const frames=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
async function run(name,width,prefix,exercise){
 if(process.env.AUTO_CASES&&!process.env.AUTO_CASES.split(',').includes(name))return;
 const result={name,width,errors:[],completionRequests:0},{page,context,audit}=await newPage(browser,{width,theme:width===1280?'dark':'light',seedOnce:true},server.origin,result);
 page.setDefaultTimeout(30000);
 try{
  await context.addInitScript(({prefix,user})=>{
   if(prefix)localStorage.setItem('portal.citizen.tutorial.v1:'+encodeURIComponent(user.id+'|'+user.username),JSON.stringify({version:1,steps:prefix}));
   window.__autoDemoApi=[];const native=window.fetch;window.fetch=function(...args){if(document.querySelector('dialog.citizen-tutorial[open]'))window.__autoDemoApi.push(String(args[0]));return native.apply(this,args);};
  },{prefix:prefix?steps.slice(0,prefix):null,user});
  await context.route('**/api/portal-tutorials/**',route=>{if(route.request().method()==='POST')result.completionRequests++;return route.fulfill({json:{completion:null}});});
  await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});await ready(page,'/cidadao/');await page.locator('[data-tutorial-start]').waitFor({state:'attached'});
  await page.locator('[data-tutorial-options]').click();await page.locator('[data-tutorial-start]').click();const d=page.locator('dialog.citizen-tutorial');await stage(d,(prefix||0)+1);
  assert.equal(await d.locator('#tutorialTitle').getAttribute('aria-describedby'),'tutorialProgress tutorialExplanation');
  await frames(page);
  assert(await d.locator('#tutorialTitle').evaluate(n=>n===document.activeElement),await page.evaluate(()=>JSON.stringify({active:document.activeElement?.outerHTML?.slice(0,600)})));
  await exercise({page,d,result});
  if(await d.count())await d.locator('[data-tutorial-pause]').click();
  await frames(page);assert.equal(result.completionRequests,0);
  assert.deepEqual(await page.evaluate(()=>__autoDemoApi.filter(x=>x.includes('/api/'))),[]);
  assert(!audit.apiCalls.some(x=>/^(POST|PATCH|DELETE|PUT) .*\/api\/council\//.test(x)));
  assert.deepEqual(audit.unmappedApiCalls,[]);assert.deepEqual(result.errors,[]);
  result.zeroDemoApiCalls=true;result.passed=true;results.push(result);console.log(JSON.stringify(result));
 }catch(error){await page.screenshot({path:path.join(output,name+'-'+width+'-failure.png')});throw error;}
 finally{await context.close();await fs.writeFile(path.join(output,'auto.json'),JSON.stringify(results,null,2));}
}
try{
 for(const width of (process.env.AUTO_WIDTHS||'390,1280').split(',').map(Number)){
  await run('actions-fields-back',width,0,async({page,d,result})=>{
   await d.locator('#openNewManifestation').evaluate(n=>{n.click();n.click();});await stage(d,2);await frames(page);await stage(d,2);
   await d.locator('input[value=sugestao]').evaluate(n=>{n.click();n.dispatchEvent(new Event('change',{bubbles:true}));n.click();});await stage(d,3);
   await d.locator('input[value=denuncia]').click();await frames(page);await stage(d,3);
   // A burst can never count several propagated options as several tasks.
   await d.evaluate(n=>{for(const type of ['reclamacao','elogio','denuncia'])n.querySelector(`input[value=${type}]`).click();});await frames(page);await stage(d,3);
   for(const [index,type] of ['reclamacao','elogio','denuncia'].entries()){await d.locator(`input[value=${type}]`).click();await stage(d,index+4);}
   await d.locator('#manifestationSubject').fill('Assunto sintético');await d.locator('#manifestationDescription').focus();await page.keyboard.type('Relato fictício para praticar sem dados pessoais.');
   await frames(page);await stage(d,6);result.noCharacterAdvance=true;
   await d.evaluate(n=>{n.querySelector('#manifestationDescription').blur();n.querySelector('[data-tutorial-back]').click();});await stage(d,5);
   await d.locator('input[value=denuncia]').focus();await page.keyboard.press('Space');await stage(d,6);await frames(page);await stage(d,6);
   await d.locator('#manifestationDescription').focus();await page.keyboard.press('Tab');await stage(d,7);
   await d.locator('#composeDetails summary').click();await d.locator('#manifestationService').fill('Unidade fictícia');await frames(page);await stage(d,7);
   await page.screenshot({path:path.join(output,width+'-typed-details.png')});await page.keyboard.press('Tab');await stage(d,8);await frames(page);await stage(d,8);
   await d.locator('[data-tutorial-back]').click();await stage(d,7);
   await d.locator('#manifestationService').focus();await page.keyboard.press('Tab');await stage(d,8);
   result.existingFieldsReviewed=true;result.oneStagePerBurst=true;
  });
  await run('double-example-and-pending-exit',width,5,async({page,d,result})=>{
   await d.locator('[data-tutorial-example]').dblclick();await stage(d,7);await frames(page);await stage(d,7);
   await page.screenshot({path:path.join(output,width+'-after-double-example.png')});result.doubleClickAdvancesOnce=true;
   await d.locator('[data-tutorial-example]').evaluate(n=>{n.click();document.querySelector('dialog [data-tutorial-pause]').click();});
   await d.waitFor({state:'detached'});await frames(page);
   await page.locator('[data-tutorial-start]').click();await stage(d,7);result.exitCanceledPendingAdvance=true;
  });
  await run('previous-progress-protected-option',width,11,async({page,d,result})=>{
   const input=d.locator('input[name=manifestationPrivacy]:not([value=identificada])');assert(await input.isChecked());
   await frames(page);await stage(d,12);assert.match(await d.locator('[data-tutorial-explanation]').textContent(),/ligado à conta; não há anonimato perante o sistema/);
   await page.screenshot({path:path.join(output,width+'-protected-existing-choice.png')});await input.click();await stage(d,13);
   await d.locator('#newManifestationForm').evaluate(n=>n.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await frames(page);await stage(d,13);
   result.checkedOptionReplayed=true;result.invalidSubmissionCannotAdvance=true;
  });
  await run('last-action-skip',width,15,async({page,d,result})=>{
   await d.evaluate(n=>{n.querySelector('#notificationList [data-notification]').click();n.querySelector('[data-tutorial-skip]').click();});
   await d.waitFor({state:'detached'});await frames(page);
   const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('portal.citizen.tutorial.')))));
   assert.deepEqual(saved,{version:1,steps:steps.slice(0,15)});assert(await page.locator('main').isVisible());
   await page.locator('[data-tutorial-start]').click();await stage(d,16);result.skipDuringLastActionNoAchievement=true;
  });
 }
}finally{await browser.close();await new Promise(resolve=>server.server.close(resolve));}
