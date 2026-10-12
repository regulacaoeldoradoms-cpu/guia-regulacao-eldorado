import assert from 'node:assert/strict';import {openDetails} from './detail-fixtures.mjs';
for(const mode of ['bfcache','missing-cache-asset']){
 const scene=await openDetails(process.cwd(),{seedOnce:true,rtt:50}),{page}=scene;
 try{
  if(mode==='missing-cache-asset')await scene.context.route('**/js/council-detail-cache.js*',route=>route.abort('failed'));
  await page.goto(scene.origin+'/conselho/painel/');await page.locator('#councilRows tr[data-protocol]').first().waitFor();await page.waitForFunction(()=>document.body.classList.contains('council-navigation-ready'));
  await page.locator('#councilSearch').fill('000001');await page.locator('#councilRows .council-open-detail').first().evaluate(node=>node.click());await page.locator('#detailContent:not([hidden])').waitFor();await page.locator('#officialReply').fill('Rascunho fictício durante retorno à lista.');
  if(mode==='bfcache'){
   const hidden=await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));return getComputedStyle(document.getElementById('councilRows')).opacity;});assert.equal(hidden,'0');assert(await page.locator('#detailContent').isHidden());assert.equal(await page.locator('#councilRows').evaluate(n=>getComputedStyle(n).opacity),'0');
   await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await page.waitForFunction(()=>document.querySelector('#councilRows')?.style.opacity==='');await page.locator('#councilRows tr[data-protocol]').first().waitFor();assert.equal(await page.locator('#councilSearch').inputValue(),'000001');
  }else await page.locator('#councilDetailModal [data-close-modal]').click();
  await page.locator('#councilRows .council-open-detail').first().evaluate(node=>node.click());await page.locator('#detailContent:not([hidden])').waitFor();assert.equal(await page.locator('#officialReply').inputValue(),'Rascunho fictício durante retorno à lista.');assert.equal(scene.mutations.length,0);console.log('PASS '+mode);
 }finally{await scene.close();}
}
