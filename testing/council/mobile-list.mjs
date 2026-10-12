// Council mobile: synthetic authorization and cases only; never contacts production.
import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {open} from './mobile-fixtures.mjs';import {applyTextScale} from '../citizen-layout/text-scale.mjs';
const output=process.argv[2]||'.local/council-mobile-evidence';await fs.mkdir(output,{recursive:true});const results=[];
for(const width of (process.env.COUNCIL_EXTRA_ONLY==='1'?[]:[320,360,390]))for(const theme of ['light','dark'])for(const scale of [1,2]){
 const s=await open(process.cwd(),width,theme,true);const {page,context}=s;
 try{
 await context.addInitScript(()=>{window.__councilFrames=[];new MutationObserver(()=>{if(!window.__councilUseful&&document.querySelector('#councilRows tr[data-protocol]'))window.__councilUseful=performance.now();}).observe(document,{subtree:true,childList:true});const sample=()=>{if(document.querySelector('#councilRows tr[data-protocol]')&&!window.__councilScaled)window.__councilFrames.push({font:getComputedStyle(document.querySelector('.council-open-detail')).fontSize,summary:document.querySelector('#councilSummary').open});requestAnimationFrame(sample);};requestAnimationFrame(sample);});
 await page.goto(s.origin+'/conselho/painel/');await page.locator('#councilRows tr[data-protocol]').first().waitFor();await page.waitForFunction(()=>window.__councilFrames.length);
 assert(await page.evaluate(()=>Object.isFrozen(window.RegulationAuth)));assert.equal(s.result.errors.length,0);assert(await page.locator('#councilSummary').evaluate(n=>!n.open));
 const frames=await page.evaluate(()=>window.__councilFrames);assert(frames.every(f=>f.font==='18px'&&!f.summary));
 const useful=await page.evaluate(()=>window.__councilUseful);await page.evaluate(()=>window.__councilScaled=true);process.env.TEXT_SCALE=scale===2?'2':'';await applyTextScale(page);
 const fit=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await fit();
 assert.equal(await page.locator('#councilRows tr[data-protocol]').count(),20);await page.locator('#councilSummary > summary').focus();await page.keyboard.press('Enter');assert(await page.locator('#metricTotal').isVisible());assert.equal(await page.locator('#metricTotal').textContent(),'20');await page.keyboard.press('Space');assert(await page.locator('#metricTotal').isHidden());
 await page.locator('#councilType').selectOption('sugestao');assert.equal(await page.locator('#councilRows tr[data-protocol]').count(),10);await page.locator('#councilType').selectOption('');await page.locator('#councilStatus').selectOption('recebida');assert.equal(await page.locator('#councilRows tr[data-protocol]').count(),10);await page.locator('#councilStatus').selectOption('');await page.locator('#councilSearch').fill('000001');assert.equal(await page.locator('#councilRows tr[data-protocol]').count(),1);await page.locator('#councilSearch').fill('');await applyTextScale(page);
 assert(await page.locator('.council-protocol-cell').first().evaluate(n=>{const a=n.querySelector('.council-row-select').getBoundingClientRect(),b=n.querySelector('strong').getBoundingClientRect();return a.width>=48&&a.height>=48&&a.right<=b.left;}));
 await page.screenshot({path:`${output}/list-${width}-${theme}-${scale}.png`,fullPage:true});
 const geometry=await page.locator('#councilRows tr[data-protocol]').first().evaluate(n=>({top:n.getBoundingClientRect().top+scrollY,height:n.getBoundingClientRect().height}));
 for(let i=0;i<2;i++){
  await page.locator('.council-open-detail').first().focus();await page.keyboard.press('Enter');await page.locator('#detailContent:not([hidden])').waitFor();assert.equal(await page.locator('#detailProtocol').textContent(),'CMS-2026-000001');await applyTextScale(page);await fit();
  if(!i){await page.screenshot({path:`${output}/detail-${width}-${theme}-${scale}.png`});await page.locator('#statusDetail').fill('Providência inteiramente sintética.');await page.locator('#statusSelect').selectOption('em_analise');await page.locator('#saveStatus').click();await page.locator('#statusUpdateMessage').filter({hasText:'Andamento atualizado'}).waitFor();await page.locator('#detailContent:not([hidden])').waitFor();
   await page.locator('#internalNoteText').fill('Nota sintética de teste.');await page.locator('#internalNoteForm [type=submit]').click();await page.locator('#internalNoteStatus').filter({hasText:'registrada'}).waitFor();await page.locator('#detailContent:not([hidden])').waitFor();
  }
  await page.locator('#councilDetailModal [data-close-modal]').click();await page.locator('#councilDetailModal').waitFor({state:'hidden'});
 }
 await page.locator('#councilSearch').fill('000001');await page.locator('.council-row-select input').check();assert(await page.locator('#councilDeleteSelected').isEnabled());await page.locator('#councilDeleteSelected').click();await page.locator('#councilDeleteDialog').waitFor({state:'visible'});await page.locator('#councilDeleteCancel').click();assert.equal(s.requests.filter(r=>r.method==='DELETE').length,0);assert.equal(await page.locator('#councilSearch').inputValue(),'000001');
 await page.locator('#refreshCouncil').click();await page.locator('#councilRows tr[data-protocol]').first().waitFor();assert.equal(await page.locator('#councilSearch').inputValue(),'000001');
 await page.reload();await page.locator('#councilRows tr[data-protocol]').first().waitFor();assert(await page.locator('#councilSummary').evaluate(n=>!n.open));assert.equal(await page.locator('#councilRows tr[data-protocol]').count(),20);
 assert.equal(s.result.errors.length,0);results.push({width,theme,scale,useful,firstFrames:frames.length,geometry,requests:s.requests,errors:s.result.errors});console.log(JSON.stringify({width,theme,scale,passed:true}));
 }finally{await s.close();}
}
// Read-only member: fresh role still owns UI authorization and protected identity.
for(const office of ['membro','vice']){const s=await open(process.cwd(),390,'dark',false,'membro');try{await s.context.route('**/api/auth/me',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({user:{...s.audit.user,councilOffice:office==='vice'?'vice_presidente':undefined}})}));await s.page.goto(s.origin+'/conselho/painel/');await s.page.locator('#councilRows tr[data-protocol]').first().waitFor();await s.page.locator('.council-open-detail').first().click();await s.page.locator('#detailContent:not([hidden])').waitFor();assert(await s.page.locator('#saveStatus').isHidden());assert(await s.page.locator('#officialReplyForm').isHidden());assert.equal(await s.page.locator('.council-row-delete').count(),0);assert.equal(s.result.errors.length,0);}finally{await s.close();}}
// A fast preloaded list cannot become visible after fresh permission revocation.
{
 const s=await open(process.cwd(),390,'light',false);const exposures=[];
 try {
  await s.context.exposeBinding('syntheticCouncilExposure',(_,value)=>exposures.push(value));
  await s.context.addInitScript(()=>new MutationObserver(()=>{if(document.querySelector('#councilRows tr[data-protocol]'))window.syntheticCouncilExposure(true);}).observe(document,{subtree:true,childList:true}));
  await s.context.route('**/api/auth/me',async route=>{await new Promise(r=>setTimeout(r,300));return route.fulfill({contentType:'application/json',body:JSON.stringify({user:{...s.audit.user,councilRole:''}})});});
  await s.context.route(s.origin+'/cidadao/',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><p>Acesso não autorizado à listagem institucional.</p>'}));
  await s.page.goto(s.origin+'/conselho/painel/');await s.page.waitForURL('**/cidadao/');assert.equal(exposures.length,0);
 }finally{await s.close();}
}
// Errors retain an explicit retry; filters survive the native refresh action.
{
 const s=await open(process.cwd(),390,'light',false);let failing=true;
 try {
  await s.context.route('**/api/council/all',route=>failing?route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Indisponibilidade sintética.'})}):route.fallback());
  await s.page.goto(s.origin+'/conselho/painel/');await s.page.locator('#councilRows').filter({hasText:'Indisponibilidade sintética.'}).waitFor();assert.equal(await s.page.locator('#councilRows tr[data-protocol]').count(),0);
  await s.page.locator('#councilSearch').fill('000001');failing=false;await s.page.locator('#refreshCouncil').click();await s.page.locator('#councilRows tr[data-protocol]').first().waitFor();assert.equal(await s.page.locator('#councilSearch').inputValue(),'000001');assert.equal(await s.page.locator('#councilRows tr[data-protocol]').count(),1);
 }finally{await s.close();}
}
console.log(JSON.stringify({additional:['member','vice','fresh-permission-revoked','error-retry'],passed:true}));
await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
