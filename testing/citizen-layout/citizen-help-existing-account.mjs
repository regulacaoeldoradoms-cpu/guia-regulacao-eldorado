// Local synthetic accounts only. Every API and external resource is intercepted.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium,user}=await import('./mobile-profile-refinement.mjs');
const {stage}=await import('./citizen-tutorial-actions.mjs');
const output=path.resolve(process.env.TUTORIAL_OUTPUT||'.local/citizen-help-evidence');
await fs.mkdir(output,{recursive:true});
const existing={...user,createdAt:'2025-01-01T00:00:00Z',mustChangePassword:false};
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
async function options(page){if(!await page.locator('[data-citizen-tutorial-entry]').evaluate(n=>n.open))await page.locator('[data-tutorial-options]').click();}
async function start(page){await options(page);await page.locator('[data-tutorial-start]').click();await page.locator('dialog.citizen-tutorial').waitFor();return page.locator('dialog.citizen-tutorial');}
async function draft(page){
 await page.locator('#openNewManifestation').click();await page.locator('input[value=sugestao]').check();
 await page.locator('#manifestationSubject').fill('Rascunho sintético da conta existente');
 await page.locator('#manifestationDescription').fill('Texto sintético privado: não deve entrar na demonstração.');
 await page.locator('#manifestationFiles').setInputFiles({name:'anexo-sintetico.png',mimeType:'image/png',buffer:png});
 await page.locator('.compose-file-thumb.has-preview').waitFor();
 const form=await page.locator('#newManifestationForm').elementHandle(),files=await page.locator('#manifestationFiles').elementHandle();
 await page.locator('#newManifestationModal .citizen-modal-close').click();
 return {form,files};
}
async function preserved(handles){
 assert(await handles.form.evaluate(n=>n.isConnected));
 assert.equal(await handles.form.evaluate(n=>n.querySelector('#manifestationSubject').value),'Rascunho sintético da conta existente');
 assert.equal(await handles.files.evaluate(n=>n.files[0].name),'anexo-sintetico.png');
}
async function run(name,scenario,exercise){
 if(process.env.HELP_CASES&&!process.env.HELP_CASES.split(',').includes(name))return;
 const result={name,errors:[]},{page,context,audit}=await newPage(browser,{seedOnce:true,user:existing,...scenario},server.origin,result);
 page.setDefaultTimeout(30000);
 try{
  await exercise({page,context,audit,result});
  assert.equal(await page.locator('[data-citizen-tutorial-entry]').count(),1);
  assert.equal(await page.locator('[data-tutorial-options]').textContent().then(x=>x.trim()),'Ajuda');
  assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
  result.mutatingCouncilOrCompletion=audit.apiCalls.filter(x=>!/^(GET|OPTIONS) /.test(x)&&/\/api\/(council|portal-tutorials)\//.test(x));
  assert.deepEqual(result.mutatingCouncilOrCompletion,[]);
  result.passed=true;results.push(result);console.log(JSON.stringify(result));
 }catch(error){await page.screenshot({path:path.join(output,name+'-failure.png'),timeout:30000});throw error;}
 finally{await context.close();await fs.writeFile(path.join(output,'existing-account.json'),JSON.stringify(results,null,2));}
}
try{
 for(const [width,shell,role] of [[320,false,'cidadao'],[390,false,'cidadao'],[1280,false,'cidadao'],[390,true,'cidadao'],[390,false,'medico'],[1280,false,'medico']]){
  const name=`existing-${role}-${width}-${shell?'shell':'direct'}`;
  await run(name,{width,theme:width===1280?'dark':'light',user:{...existing,role}},async({page,context,result})=>{
   await context.addInitScript(()=>{
    window.__helpDemoNetwork=[];const native=window.fetch;
    window.fetch=function(...args){if(document.querySelector('dialog.citizen-tutorial[open]'))window.__helpDemoNetwork.push(String(args[0]));return native.apply(this,args);};
   });
   if(shell){await page.goto(server.origin+'/',{waitUntil:'domcontentloaded'});await ready(page,'/');await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));}
   else await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});
   await ready(page,'/cidadao/');await page.locator('[data-tutorial-start]').waitFor({state:'attached'});
   const handles=await draft(page);let d=await start(page);
   assert(!(await d.textContent()).includes('Texto sintético privado'));
   await d.locator('#openNewManifestation').click();await stage(d,2);
   await d.locator('input[value=sugestao]').check();await stage(d,3);
   await d.locator('[data-tutorial-pause]').click();await preserved(handles);
   d=await start(page);assert.match(await d.locator('[data-tutorial-progress]').textContent(),/Etapa 3 de/);await d.locator('[data-tutorial-skip]').click();
   await page.locator('[data-tutorial-restart]').click();d=page.locator('dialog.citizen-tutorial');assert.match(await d.locator('[data-tutorial-progress]').textContent(),/Etapa 1 de/);
   await d.locator('[data-tutorial-skip]').click();await preserved(handles);
   assert.deepEqual(await page.evaluate(()=>__helpDemoNetwork.filter(x=>x.includes('/api/'))),[]);
   await page.locator('[data-tutorial-close-options]').click();
   await page.locator('.portal-hero').screenshot({path:path.join(output,name+'-help.png')});
   await options(page);await page.screenshot({path:path.join(output,name+'-options.png')});
   result.zeroDemoApiCalls=true;result.draftAndFilePreserved=true;
  });
 }
 await run('pending-initial-read',{width:390,theme:'light'},async({page,context,result})=>{
  let release;const gate=new Promise(resolve=>release=resolve);let reached;const observed=new Promise(resolve=>reached=resolve);
  await context.route('**/api/council/my*',async route=>{reached();await gate;await route.fulfill({json:{manifestations:[]}});});
  try{
   await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});await observed;
   await page.locator('[data-tutorial-start]').waitFor({state:'attached'});await options(page);
   await page.locator('[data-tutorial-start]').click();assert.equal(await page.locator('dialog.citizen-tutorial').count(),0);
   assert.match(await page.locator('[data-tutorial-status]').textContent(),/Aguarde a ação/);
   await page.screenshot({path:path.join(output,'pending-read-help.png')});result.visibleWhileReadPending=true;
  }finally{release();}
  await ready(page,'/cidadao/');const d=await start(page);await d.locator('[data-tutorial-skip]').click();
 });
 await run('module-failure-retry',{width:390,theme:'dark'},async({page,context,result})=>{
  let failed=true,loads=0;
  await context.route('**/js/citizen-tutorial.js*',route=>{loads++;return failed?route.fulfill({status:503,body:'Synthetic module unavailable'}):route.continue();});
  await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});await ready(page,'/cidadao/');await options(page);
  await page.locator('[data-tutorial-load-status]').filter({hasText:'A ajuda não carregou'}).waitFor();
  await page.locator('[data-tutorial-load]').focus();await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-citizen-tutorial-entry]').evaluate(n=>n.open),false);
  assert(await page.locator('[data-tutorial-options]').evaluate(n=>n===document.activeElement));
  const handles=await draft(page);await preserved(handles);
  await options(page);
  await page.locator('[data-tutorial-bootstrap-close]').click();assert.equal(await page.locator('[data-citizen-tutorial-entry]').evaluate(n=>n.open),false);
  await options(page);await page.locator('[data-tutorial-load]').click();await page.locator('[data-tutorial-load-status]').filter({hasText:'A ajuda não carregou'}).waitFor();
  await page.screenshot({path:path.join(output,'module-retry-help.png')});
  failed=false;await page.locator('[data-tutorial-load]').focus();await page.keyboard.press('Enter');await page.locator('[data-tutorial-start]').waitFor();
  assert(await page.locator('[data-tutorial-start]').evaluate(n=>n===document.activeElement));
  const d=await start(page);await d.locator('[data-tutorial-skip]').click();await preserved(handles);
  assert.equal(loads,3);result.retryLoads=loads;result.draftAndFilePreserved=true;
 });
 await run('pending-security-privacy',{width:390,theme:'light',user:{...existing,emailVerified:false}},async({page,context,result})=>{
  let release;const gate=new Promise(resolve=>release=resolve);let reached;const observed=new Promise(resolve=>reached=resolve);
  await context.route('**/api/auth/security',async route=>{reached();await gate;await route.fulfill({json:{security:{emailVerified:true,privacyMode:'sigilosa'}}});});
  try{
   await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});await observed;
   await page.locator('[data-tutorial-start]').waitFor({state:'attached'});await options(page);await page.locator('[data-tutorial-start]').click();
   assert.equal(await page.locator('dialog.citizen-tutorial').count(),0);assert.match(await page.locator('[data-tutorial-status]').textContent(),/Aguarde a ação/);
  }finally{release();}
  await ready(page,'/cidadao/');await page.waitForFunction(()=>document.querySelector('#privacyChip').textContent.includes('confirmado'));
  const d=await start(page);await d.locator('#openNewManifestation').click();
  assert.equal(await d.locator('input[name=manifestationPrivacy]:not([value=identificada])').getAttribute('value'),'sigilosa');
  await d.locator('[data-tutorial-skip]').click();result.latestPrivacyAfterPendingRead=true;
 });
 await run('cached-old-module',{width:390,theme:'light'},async({page,context,audit,result})=>{
  await context.addInitScript(()=>window.PortalCitizenTutorial={version:1,launcherVersion:2,mount(){throw new Error('Obsolete launcher must be replaced');}});
  await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});await ready(page,'/cidadao/');await page.locator('[data-tutorial-start]').waitFor({state:'attached'});
  assert.equal(await page.evaluate(()=>PortalCitizenTutorial.launcherVersion),3);
  assert(audit.resources.includes('/js/citizen-tutorial.js?v=20261014-citizen-auto-1'));
  const d=await start(page);await d.locator('[data-tutorial-skip]').click();result.obsoleteModuleReplaced=true;
 });
}finally{await browser.close();await new Promise(resolve=>server.server.close(resolve));}
