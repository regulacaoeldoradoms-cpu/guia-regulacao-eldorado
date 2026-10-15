// Synthetic accounts and intercepted APIs; verify the added help keeps the native layout.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const {applyTextScale}=await import('./text-scale.mjs');
const output=path.resolve(process.env.TUTORIAL_OUTPUT||'.local/citizen-tutorial');await fs.mkdir(output,{recursive:true});
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
try{
 for(const width of (process.env.ENTRY_WIDTHS||'320,1280').split(',').map(Number))for(const theme of (process.env.ENTRY_THEMES||'light,dark').split(','))for(const scale of (process.env.ENTRY_SCALES||'1,2').split(',').map(Number)){
  const result={width,theme,scale,errors:[]},{page,context,audit}=await newPage(browser,{width,theme,seedOnce:true},server.origin,result);
  try{
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
   assert(await page.locator('[data-tutorial-start]').isVisible());await page.screenshot({timeout:30000,path:path.join(output,`${width}-${theme}-${scale}-options.png`)});
   await page.locator('[data-tutorial-close-options]').click();assert.equal(await page.locator('[data-citizen-tutorial-entry]').evaluate(n=>n.open),false);assert(await page.locator('[data-tutorial-options]').evaluate(n=>n===document.activeElement));
   await page.keyboard.press('Enter');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-citizen-tutorial-entry]').evaluate(n=>n.open),false);
   await page.keyboard.press('Enter');await page.locator('[data-tutorial-start]').click();await page.locator('dialog.citizen-tutorial').waitFor();await page.locator('[data-tutorial-skip]').click();
   assert(await page.locator('[data-tutorial-start]').isVisible());assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);result.passed=true;result.geometry=geometry;results.push(result);console.log(`${width}/${theme}/${scale}: help entry passed`);
  }catch(error){await page.screenshot({timeout:30000,path:path.join(output,`${width}-${theme}-${scale}-entry-failure.png`)});throw error;}finally{await context.close();await fs.writeFile(path.join(output,'entry.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
