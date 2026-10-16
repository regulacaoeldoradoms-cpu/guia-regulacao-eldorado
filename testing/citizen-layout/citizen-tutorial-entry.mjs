// Synthetic accounts and intercepted APIs; verify the added help keeps the native layout.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const {applyTextScale}=await import('./text-scale.mjs');
const output=path.resolve(process.env.TUTORIAL_OUTPUT||'.local/citizen-tutorial');await fs.mkdir(output,{recursive:true});
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
async function panelGeometry(page,{compact=false,scale=1}={}){
 const geometry=await page.evaluate(()=>{
  const rect=n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
  const entry=document.querySelector('[data-citizen-tutorial-entry]'),panel=entry.querySelector('.tutorial-entry-panel');
  const box=rect(panel),anchor=rect(entry),viewport=visualViewport;
  const controls=[...panel.querySelectorAll('button:not([hidden])')].map(n=>{
   const r=rect(n);return {...r,hit:n.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)),label:n.textContent||n.getAttribute('aria-label')};
  });
  const native=[...document.querySelectorAll('#openNewManifestation,.citizen-mobile-tabs,.social-mobile-nav')].filter(n=>n.getClientRects().length).map(n=>({id:n.id||n.className,...rect(n)}));
  return {box,anchor,controls,native,viewport:{left:viewport.offsetLeft,top:viewport.offsetTop,right:viewport.offsetLeft+viewport.width,bottom:viewport.offsetTop+viewport.height},pageFits:document.documentElement.scrollWidth<=document.documentElement.clientWidth,position:getComputedStyle(panel).position,bottomVisible:panel.contains(document.elementFromPoint(box.left+box.width/2,box.bottom-2))};
 });
 const {box,viewport}=geometry;
 assert(box.left>=viewport.left+7.5&&box.right<=viewport.right-7.5,JSON.stringify(geometry));
 assert(box.top>=viewport.top+7.5&&box.bottom<=viewport.bottom-7.5,JSON.stringify(geometry));
 assert.equal(geometry.position,'fixed');assert(geometry.pageFits);assert(geometry.bottomVisible,'Panel must escape the hero clipping');
 assert(geometry.controls.every(n=>n.width>=44&&n.height>=44&&n.hit),JSON.stringify(geometry));
 for(const n of geometry.native.filter(n=>n.id==='openNewManifestation'&&n.top>=viewport.top+78&&n.top<viewport.bottom))assert(box.bottom<=n.top-7.5,'Expanded help must keep the primary action free: '+JSON.stringify(geometry));
 if(compact){
  assert(box.width<=232.1);assert(Math.abs(box.right-(geometry.anchor.left-8))<1);
  if(scale===1)for(const n of geometry.native)assert(!(box.left<n.right&&box.right>n.left&&box.top<n.bottom&&box.bottom>n.top),'Initial compact help covers a native action: '+JSON.stringify(geometry));
 }
 return geometry;
}
try{
 for(const width of (process.env.ENTRY_WIDTHS||'320,360,390,412,1280').split(',').map(Number))for(const theme of (process.env.ENTRY_THEMES||'light,dark').split(','))for(const scale of (process.env.ENTRY_SCALES||'1,2').split(',').map(Number)){
  const result={width,theme,scale,errors:[]},{page,context,audit}=await newPage(browser,{width,theme,seedOnce:true},server.origin,result);
  try{
   await context.addInitScript(()=>{
    window.__helpPaints=[];
    const sample=()=>{
     const entry=document.querySelector('[data-citizen-tutorial-entry]'),panel=entry?.querySelector('.tutorial-entry-panel');
     if(panel){const r=panel.getBoundingClientRect(),visible=Boolean(r.width&&r.height)&&getComputedStyle(panel).visibility==='visible';window.__helpPaints.push({open:entry.open,visible,width:r.width,position:getComputedStyle(panel).position,icon:Boolean(entry.querySelector('summary svg')),ready:panel.hasAttribute('data-tutorial-positioned')});}
     requestAnimationFrame(sample);
    };requestAnimationFrame(sample);
   });
   await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});await ready(page,'/cidadao/');await page.locator('[data-tutorial-start]').waitFor({state:'attached'});assert.equal(await page.locator('[data-tutorial-options]').textContent().then(x=>x.trim()),'Ajuda');
   process.env.TEXT_SCALE=scale===2?'2':'';await applyTextScale(page);
   const geometry=await page.evaluate(()=>{
    const entry=document.querySelector('[data-citizen-tutorial-entry]'),summary=entry.querySelector('summary'),rects=[...summary.children].flatMap(n=>{const range=document.createRange();range.selectNodeContents(n);return [n.getBoundingClientRect(),...range.getClientRects()];});
    const intersect=a=>rects.some(r=>a.left<r.right&&a.right>r.left&&a.top<r.bottom&&a.bottom>r.top);
    const hits=[];for(const node of document.querySelectorAll('.portal-hero-copy *'))for(const child of node.childNodes){if(child.nodeType!==Node.TEXT_NODE||!child.textContent.trim()||!node.getClientRects().length)continue;const range=document.createRange();range.selectNodeContents(child);for(const a of range.getClientRects())if(intersect(a))hits.push(child.textContent);}
    const native=()=>[...document.querySelectorAll('.portal-hero,.citizen-actions,.citizen-grid')].map(n=>{const a=n.getBoundingClientRect();return {x:a.x,y:a.y,width:a.width,height:a.height};});
    const before=native(),marker=document.createComment('entry-layout-test');entry.before(marker);entry.remove();const after=native();marker.replaceWith(entry);
    return {before,after,hits,helpRects:rects.map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom})),target:{width:summary.getBoundingClientRect().width,height:summary.getBoundingClientRect().height}};
   });
   assert.deepEqual(geometry.before,geometry.after);assert.deepEqual(geometry.hits,[],'Help must not cover native text: '+JSON.stringify(geometry));assert(geometry.target.width>=44&&geometry.target.height>=44);
   await page.screenshot({timeout:30000,path:path.join(output,`${width}-${theme}-${scale}-entry.png`)});
   await page.locator('[data-tutorial-options]').focus();await page.keyboard.press('Enter');await page.locator('[data-tutorial-start]').waitFor();
   assert.equal(await page.locator('[data-tutorial-start]').textContent(),'Iniciar tutorial');
   const nativeBefore=await page.locator('.portal-hero,.citizen-actions,.citizen-grid').evaluateAll(nodes=>nodes.map(n=>({x:n.offsetLeft,y:n.offsetTop,width:n.offsetWidth,height:n.offsetHeight})));
   result.panel=await panelGeometry(page,{compact:true,scale});
   assert.equal(await page.locator('[data-tutorial-close-options]').getAttribute('aria-label'),'Fechar ajuda');
   await page.keyboard.press('Tab');assert(await page.locator('[data-tutorial-start]').evaluate(n=>n===document.activeElement));
   assert.notEqual(await page.locator('[data-tutorial-start]').evaluate(n=>getComputedStyle(n).outlineStyle),'none');
   await page.keyboard.press('Tab');assert(await page.locator('[data-tutorial-close-options]').evaluate(n=>n===document.activeElement));
   await page.screenshot({timeout:30000,path:path.join(output,`${width}-${theme}-${scale}-options.png`)});
   await page.locator('[data-tutorial-close-options]').click();assert.equal(await page.locator('[data-citizen-tutorial-entry]').evaluate(n=>n.open),false);assert(await page.locator('[data-tutorial-options]').evaluate(n=>n===document.activeElement));
   await page.keyboard.press('Enter');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-citizen-tutorial-entry]').evaluate(n=>n.open),false);
   assert.deepEqual(await page.locator('.portal-hero,.citizen-actions,.citizen-grid').evaluateAll(nodes=>nodes.map(n=>({x:n.offsetLeft,y:n.offsetTop,width:n.offsetWidth,height:n.offsetHeight}))),nativeBefore);
   await page.keyboard.press('Enter');
   // A real outside click also reaches the unobstructed native action.
   if(width<=900)await page.locator('#openNewManifestation').tap();else await page.locator('#openNewManifestation').click();
   assert.equal(await page.locator('[data-citizen-tutorial-entry]').evaluate(n=>n.open),false);
   await page.locator('#newManifestationModal').waitFor();await page.locator('#newManifestationModal .citizen-modal-close').click();
   await page.locator('[data-tutorial-options]').focus();
   await page.keyboard.press('Enter');await page.locator('[data-tutorial-start]').click();await page.locator('dialog.citizen-tutorial').waitFor();await page.locator('[data-tutorial-skip]').click();
   assert(await page.locator('[data-tutorial-start]').isVisible());
   assert(await page.locator('[data-tutorial-start]').evaluate(n=>n===document.activeElement),'Tutorial exit must return focus immediately');
   await panelGeometry(page);
   await page.setViewportSize({width:320,height:300});await page.waitForTimeout(100);await panelGeometry(page);
   await page.screenshot({timeout:30000,path:path.join(output,`${width}-${theme}-${scale}-short-viewport.png`)});
   await page.evaluate(()=>window.scrollTo(0,120));await page.waitForTimeout(100);await panelGeometry(page);
   result.paints=await page.evaluate(()=>__helpPaints);
   assert(result.paints.length>0);assert(result.paints.some(p=>p.visible));
   assert(result.paints.every(p=>p.icon&&(!p.visible||p.open&&p.ready&&p.width<=232.1&&p.position==='fixed')),'Invalid first paint: '+JSON.stringify(result.paints));
   assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);result.passed=true;result.geometry=geometry;results.push(result);console.log(`${width}/${theme}/${scale}: help entry passed`);
  }catch(error){await page.screenshot({timeout:30000,path:path.join(output,`${width}-${theme}-${scale}-entry-failure.png`)});throw error;}finally{await context.close();await fs.writeFile(path.join(output,'entry.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
