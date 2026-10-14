import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium,user}=await import('./mobile-profile-refinement.mjs');
const output=path.resolve(process.env.TUTORIAL_OUTPUT||'.local/citizen-tutorial');await fs.mkdir(output,{recursive:true});
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
async function entry(page){await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded',timeout:30000});await ready(page,'/cidadao/');await page.locator('[data-tutorial-start]').waitFor();}
async function start(page){await page.locator('[data-tutorial-start]').focus();await page.keyboard.press('Enter');await page.locator('dialog.citizen-tutorial #tutorialTitle').waitFor();return page.locator('dialog.citizen-tutorial');}
async function stop(page,d){await d.locator('[data-tutorial-pause]').click();await page.locator('dialog.citizen-tutorial').waitFor({state:'detached'});}
try{
 for(const width of (process.env.LIFECYCLE_WIDTHS||'390,1280').split(',').map(Number)){
  const result={width,errors:[],passed:false},{page,context,audit}=await newPage(browser,{width,theme:'dark',seedOnce:true},server.origin,result);
  let completions=0;await context.route('**/api/portal-tutorials/**',route=>{if(route.request().method()==='POST')completions++;return route.fulfill({json:{completion:null}});});
  try{
   console.log(`${width}: prepare`);await entry(page);
   let releaseFlight,flightReached;const reached=new Promise(resolve=>{flightReached=resolve;});await context.route('**/api/synthetic-inflight',async route=>{flightReached();await new Promise(resolve=>{releaseFlight=resolve;});await route.fulfill({headers:{'Access-Control-Allow-Origin':server.origin},json:{ok:true}});});
   await page.evaluate(()=>{window.__inflight=fetch('https://tutorial-synthetic.invalid/api/synthetic-inflight',{method:'POST',body:'synthetic'}).catch(()=>{});});let reachTimer;try{await Promise.race([reached,new Promise((_,reject)=>{reachTimer=setTimeout(()=>reject(new Error('Synthetic in-flight request was not intercepted.')),8000);})]);}finally{clearTimeout(reachTimer);}await page.locator('[data-tutorial-start]').click();assert.equal(await page.locator('dialog.citizen-tutorial').count(),0);assert.equal(await page.locator('[data-tutorial-start]').textContent(),'Cancelar preparação');releaseFlight();await page.locator('dialog.citizen-tutorial').waitFor();let d=page.locator('dialog.citizen-tutorial');
   const contrast=await d.locator('.tutorial-mode,[data-tutorial-explanation],.tutorial-controls button').evaluateAll(nodes=>nodes.map(node=>{const rgb=v=>v.match(/[\d.]+/g)?.map(Number)||[];let parent=node,bg;while(parent){bg=rgb(getComputedStyle(parent).backgroundColor);if(bg.length===3||bg[3]>0)break;parent=parent.parentElement;}const fg=rgb(getComputedStyle(node).color),light=c=>{const a=c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return a[0]*.2126+a[1]*.7152+a[2]*.0722;},a=light(fg),b=light(bg);return {text:node.textContent,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};}));assert(contrast.every(item=>item.ratio>=4.5),JSON.stringify(contrast));
   console.log(`${width}: keyboard`);assert.match(await d.ariaSnapshot(),/DEMONSTRAÇÃO/);assert.match(await d.ariaSnapshot(),/Comece pelo botão/);
   for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert(await d.evaluate(n=>n.contains(document.activeElement)));}
   await d.locator('#openNewManifestation').click();await d.locator('[data-tutorial-next]').click();await d.locator('input[value=sugestao]').focus();await page.keyboard.press('Space');await d.locator('[data-tutorial-next]').click();
   await page.keyboard.press('Escape');await page.locator('dialog.citizen-tutorial').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-tutorial-start')),true);
   d=await start(page);assert.match(await d.locator('[data-tutorial-progress]').textContent(),/Etapa 3 de/);
   await d.locator('#newManifestationModal [data-close-modal]').first().click();assert.equal(await page.locator('dialog.citizen-tutorial').count(),0);assert.equal(completions,0);
   console.log(`${width}: reduced viewport`);d=await start(page);await page.setViewportSize({width:320,height:350});await page.waitForFunction(()=>document.querySelector('dialog').getBoundingClientRect().bottom<=innerHeight+1);
   assert(await d.evaluate(n=>n.scrollWidth<=n.clientWidth+1));await page.screenshot({path:path.join(output,`${width}-reduced-viewport.png`)});
   await stop(page,d);await page.setViewportSize({width,height:844});
   if(width===1280){console.log(`${width}: zoom`);
    const cdp=await context.newCDPSession(page);d=await start(page);await cdp.send('Emulation.setDeviceMetricsOverride',{width:640,height:422,deviceScaleFactor:2,mobile:false});await page.screenshot({path:path.join(output,'zoom200-reflow.png')});assert(await d.evaluate(n=>n.scrollWidth<=n.clientWidth+1));await stop(page,d);await cdp.send('Emulation.clearDeviceMetricsOverride');
    console.log(`${width}: print`);await page.mouse.move(0,0);await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});await page.emulateMedia({media:'print'});const beforePrint=await page.locator('main').screenshot({path:path.join(output,'native-print-before.png'),animations:'disabled',style:'#portalChatRoot,#portalChatLauncher {visibility:hidden!important}'});await page.emulateMedia({media:'screen'});d=await start(page);await stop(page,d);await page.mouse.move(0,0);await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});await page.emulateMedia({media:'print'});const afterPrint=await page.locator('main').screenshot({path:path.join(output,'native-print.png'),animations:'disabled',style:'#portalChatRoot,#portalChatLauncher {visibility:hidden!important}'});assert(afterPrint.equals(beforePrint),'Native print rendering changed after tutorial; compare before/after PNGs.');await page.emulateMedia({media:'screen'});
   }
   console.log(`${width}: reload`);
   // Full document interruption preserves only ordered metadata, never forms.
   await entry(page);d=await start(page);assert.match(await d.locator('[data-tutorial-progress]').textContent(),/Etapa 3 de/);await stop(page,d);
   if(width===390){
    d=await start(page);await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/perfil/',location.href)));await page.waitForFunction(()=>PortalCitizenShell.diagnostics().active==='/perfil/'&&!PortalCitizenShell.diagnostics().navigating);assert.equal(await page.locator('dialog.citizen-tutorial').count(),0);
    await page.goBack({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>PortalCitizenShell.diagnostics().active==='/cidadao/'&&!PortalCitizenShell.diagnostics().navigating);await page.locator('[data-tutorial-start]').waitFor();d=await start(page);assert.match(await d.locator('[data-tutorial-progress]').textContent(),/Etapa 3 de/);await stop(page,d);
    await page.goForward({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>PortalCitizenShell.diagnostics().active==='/perfil/'&&!PortalCitizenShell.diagnostics().navigating);
    await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));await page.waitForFunction(()=>PortalCitizenShell.diagnostics().active==='/cidadao/'&&!PortalCitizenShell.diagnostics().navigating);
   }
   await page.locator('[data-tutorial-restart]').click();d=page.locator('dialog.citizen-tutorial');await d.locator('#openNewManifestation').evaluate(n=>n.remove());await page.setViewportSize({width:width-1,height:844});assert(await d.locator('[data-tutorial-next]').isDisabled());await d.locator('[data-tutorial-skip]').click();assert.equal(completions,0);
   // Corrupt and out-of-order persistence cannot resume near completion.
   await page.evaluate(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('portal.citizen.tutorial.'));localStorage.setItem(k,JSON.stringify({version:1,steps:['notice']}));});await entry(page);d=await start(page);assert.match(await d.locator('[data-tutorial-progress]').textContent(),/Etapa 1 de/);await stop(page,d);
   // A replacement account never inherits this account's progression.
   d=await start(page);await d.locator('#openNewManifestation').click();await d.locator('[data-tutorial-next]').click();await stop(page,d);
   console.log(`${width}: account`);const other={...user,id:'synthetic-other',username:'fixture.other'};audit.user=other;
   const priorDocument=await page.evaluate(()=>window.__refinementDocument);
   await page.evaluate(other=>{sessionStorage.setItem('regulacao.portal.user',JSON.stringify(other));sessionStorage.setItem('regulacao.portal.session','synthetic-other-token');window.dispatchEvent(new CustomEvent('portal:session-ready',{detail:{user:other}}));},other);
   await page.waitForFunction(previous=>window.__refinementDocument!==previous,priorDocument);await page.waitForLoadState('domcontentloaded');
   await entry(page);d=await start(page);assert.match(await d.locator('[data-tutorial-progress]').textContent(),/Etapa 1 de/);await stop(page,d);
   console.log(`${width}: logout`);d=await start(page);await page.evaluate(()=>document.getElementById('portalLogout').click());await page.waitForURL('**/login/');assert.equal(await page.locator('dialog.citizen-tutorial').count(),0);assert.equal(completions,0);
   assert.deepEqual(result.errors,[]);assert(!audit.unmappedApiCalls.some(call=>call.includes('council')||call.includes('tutorial')));result.passed=true;results.push(result);console.log(JSON.stringify(result));
  }catch(error){await page.screenshot({path:path.join(output,`${width}-lifecycle-failure.png`)});console.log(result.errors);throw error;}finally{await context.close();}
 }
 // The native account's real privacy option is retained, even for Bronze.
 const result={case:'bronze-privacy-and-unavailable-helper',errors:[]},{page,context}=await newPage(browser,{width:1280,theme:'light',seedOnce:true,user:{...user,emailVerified:false,accountLevel:'bronze'}},server.origin,result);
 try{
  await context.route('**/api/auth/security',route=>route.fulfill({json:{security:{emailVerified:false,privacyMode:'anonima'}}}));
  await entry(page);const d=await start(page);await d.locator('#openNewManifestation').click();assert.equal(await d.locator('input[name=manifestationPrivacy]:not([value=identificada])').getAttribute('value'),'anonima');await stop(page,d);
  assert.deepEqual(result.errors,[]);result.passed=true;results.push(result);
 }finally{await context.close();}
 const failed={case:'unavailable-helper',errors:[]},fixture=await newPage(browser,{width:1280,theme:'light',seedOnce:true},server.origin,failed);
 try{await fixture.context.route('**/js/citizen-compose-attachments.js*',r=>r.fulfill({status:503,body:'synthetic unavailable'}));await entry(fixture.page);await fixture.page.locator('[data-tutorial-start]').click();await fixture.page.locator('[data-tutorial-status]').filter({hasText:'Tutorial indisponível'}).waitFor();assert.equal(await fixture.page.locator('dialog.citizen-tutorial').count(),0);assert(await fixture.page.locator('#openNewManifestation').isEnabled());assert.deepEqual(failed.errors,[]);failed.passed=true;results.push(failed);}finally{await fixture.context.close();}
 await fs.writeFile(path.join(output,'lifecycle.json'),JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
