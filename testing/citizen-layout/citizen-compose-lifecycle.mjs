// Real retained-area eviction with synthetic profiles and intercepted APIs only.
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
try {
 const result={errors:[]},{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true},server.origin,result);
 await context.addInitScript(()=>{
   const viewport=window.visualViewport;if(!viewport)return;
   window.__composeViewportHandlers=new Set();window.__composePresentationHandlers=new Set();
   const add=viewport.addEventListener.bind(viewport),remove=viewport.removeEventListener.bind(viewport);
   viewport.addEventListener=(type,handler,...rest)=>{if(type==='resize'&&handler.name==='resizeComposeReport')window.__composeViewportHandlers.add(handler);if(type==='resize'&&handler.name==='viewportChanged')window.__composePresentationHandlers.add(handler);return add(type,handler,...rest);};
   viewport.removeEventListener=(type,handler,...rest)=>{if(type==='resize'&&handler.name==='resizeComposeReport')window.__composeViewportHandlers.delete(handler);if(type==='resize'&&handler.name==='viewportChanged')window.__composePresentationHandlers.delete(handler);return remove(type,handler,...rest);};
 });
 await page.goto(server.origin+'/cidadao/');await ready(page,'/cidadao/');assert.equal(await page.evaluate(()=>__composeViewportHandlers.size),1);assert.equal(await page.evaluate(()=>__composePresentationHandlers.size),1);
 await page.locator('#openNewManifestation').focus();await page.keyboard.press('Enter');
 assert(await page.evaluate(()=>document.getElementById('newManifestationModal').contains(document.activeElement)),JSON.stringify(await page.evaluate(()=>({active:document.activeElement.id,open:document.getElementById('newManifestationModal').className,visible:getComputedStyle(document.getElementById('newManifestationModal')).visibility,closeVisible:getComputedStyle(document.querySelector('#newManifestationModal .citizen-modal-close')).visibility}))));
 await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.getElementById('newManifestationModal').contains(document.activeElement)),JSON.stringify(await page.evaluate(()=>({active:document.activeElement.id,open:document.getElementById('newManifestationModal').className,visible:getComputedStyle(document.getElementById('newManifestationModal')).visibility,closeVisible:getComputedStyle(document.querySelector('#newManifestationModal .citizen-modal-close')).visibility}))));
 await page.keyboard.press('Escape');await page.locator('#newManifestationModal').waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>document.activeElement.id),'openNewManifestation');
 const owner=await page.evaluateHandle(()=>document.getElementById('newManifestationForm'));
 for(let i=0;i<18;i++) {
   const route=`/perfil/?compose-eviction=${i}`;
   await page.evaluate(path=>PortalCitizenShell.navigate(new URL(path,location.href)),route);
   await page.waitForFunction(path=>PortalCitizenShell.diagnostics().active===path,route);
 }
 assert.equal(await owner.evaluate(n=>n.isConnected),false);assert.equal(await page.evaluate(()=>__composeViewportHandlers.size),0);assert.equal(await page.evaluate(()=>__composePresentationHandlers.size),0);
 await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));await page.waitForFunction(()=>PortalCitizenShell.diagnostics().active==='/cidadao/'&&!PortalCitizenShell.diagnostics().navigating).catch(async error=>{console.log(await page.evaluate(()=>({diagnostics:PortalCitizenShell.diagnostics(),notice:document.querySelector('.citizen-route-notice')?.textContent,handlers:__composeViewportHandlers.size})));console.log(result.errors);throw error;});await page.evaluate(()=>PortalCitizenShell.active().ready);await ready(page,'/cidadao/');
 assert.equal(await page.evaluate(()=>__composeViewportHandlers.size),1);assert.equal(await page.evaluate(()=>__composePresentationHandlers.size),1);
 await page.locator('#openNewManifestation').focus();await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.getElementById('newManifestationModal').contains(document.activeElement)),JSON.stringify(await page.evaluate(()=>({active:document.activeElement.id,open:document.getElementById('newManifestationModal').className,visible:getComputedStyle(document.getElementById('newManifestationModal')).visibility,closeVisible:getComputedStyle(document.querySelector('#newManifestationModal .citizen-modal-close')).visibility}))));
 assert.deepEqual(result.errors,[]);assert.equal(audit.apiCalls.filter(s=>s.startsWith('POST /api/council/')).length,0);
 console.log(JSON.stringify({keyboardOpening:true,evicted:true,resizeHandlersAfterEviction:0,resizeHandlersAfterRebuild:1,presentationHandlersAfterEviction:0,presentationHandlersAfterRebuild:1,errors:result.errors,passed:true}));await context.close();
} finally {await browser.close();await new Promise(r=>server.server.close(r));}
