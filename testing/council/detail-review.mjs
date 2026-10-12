import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
import {openVisual} from './visual-fixtures.mjs';
const output=process.argv[2]||'.local/detail-review';await fs.mkdir(output,{recursive:true});const results=[];
for(const width of [320,360,390])for(const theme of ['light','dark']){
 const scene=await openVisual(process.cwd(),{width,theme,count:253,slow:true}),{page}=scene,reads=[],views=[];let active=0,maxActive=0,deny=false;
 await scene.context.route('**/api/council/**',async route=>{
  const url=new URL(route.request().url());if(url.pathname==='/api/council/config')return route.fulfill({json:{detailPrefetch:true}});
  const match=url.pathname.match(/^\/api\/council\/manifestations\/(CMS-\d{4}-\d{6})(?:\/prefetch)?$/);if(!match||route.request().method()!=='GET')return route.fallback();
  const protocol=match[1],prefetch=url.pathname.endsWith('/prefetch');reads.push({protocol,prefetch,query:url.search,at:Date.now()});if(prefetch){active++;maxActive=Math.max(maxActive,active);}else views.push(protocol);
  try{
   await new Promise(resolve=>setTimeout(resolve,450));if(deny)return route.fulfill({status:403,json:{error:'Permissão sintética revogada.'}});
   const item=scene.items.find(item=>item.protocol===protocol);const payload={manifestation:{...item},messages:[],events:[{type:'created',detail:'Histórico inteiramente sintético.',createdAt:item.createdAt}],internalNotes:[],attachments:[{id:'synthetic-attachment',displayName:'Arquivo fictício.pdf'}]};
   const detailRevision=createHash('sha256').update(JSON.stringify(payload)).digest('hex');const data=url.searchParams.get('cacheRevision')===detailRevision?{notModified:true,detailRevision,protocol}:{...payload,detailRevision};
   return await route.fulfill({json:data});
  }finally{if(prefetch)active--;}
 });
 try{
  await page.goto(scene.origin+'/conselho/painel/');await page.locator('#councilRows tr[data-protocol]').first().waitFor();await page.waitForFunction(()=>document.body.classList.contains('council-navigation-ready'));await page.evaluate(()=>document.fonts.ready);
  // Background readiness, not an assumption that every listed case was loaded.
  await page.waitForTimeout(1300);assert(reads.some(item=>item.prefetch));assert.equal(views.length,0);assert(maxActive<=2);assert(reads.filter(item=>item.prefetch).length<=8);
  const start=Date.now();await page.locator('#councilRows .council-open-detail').first().click();await page.locator('#detailContent:not([hidden])').waitFor();const elapsed=Date.now()-start;
  assert.equal(await page.locator('#detailProtocol').textContent(),'CMS-2026-000001');assert(reads.some(item=>!item.prefetch&&item.query.includes('cacheRevision=')));
  const geometry=await page.evaluate(()=>({subject:document.getElementById('detailSubject').getBoundingClientRect().top,description:document.getElementById('detailDescription').getBoundingClientRect().top,reply:document.getElementById('officialReply').getBoundingClientRect().top,headHeight:document.querySelector('#councilDetailModal .citizen-modal-head').getBoundingClientRect().height,navRows:new Set([...document.querySelectorAll('#councilMobileDetailNav button:not([hidden])')].map(n=>Math.round(n.getBoundingClientRect().top))).size}));
  await page.screenshot({path:`${output}/${width}-${theme}.png`});assert(await page.locator('#councilDetailModal .citizen-modal-panel').evaluate(node=>node.scrollWidth<=node.clientWidth+1));assert.equal(geometry.navRows,1);
  if(await page.locator('#councilActionsRegion').count())assert.equal(await page.locator('#councilMobileDetailNav [data-council-region="councilActionsRegion"]').textContent(),'Ações');else assert.equal(await page.locator('#councilMobileDetailNav [data-council-scroll="detailConversation"]').textContent(),'Responder');
  assert(await page.locator('#exportManifestationPdf').isHidden());await page.locator('.council-detail-document > summary').click();assert(await page.locator('#exportManifestationPdf').isVisible());
  await page.locator('#officialReply').fill('Rascunho inteiramente fictício.');assert(await page.locator('#councilMobileDetailNav').isHidden());await page.keyboard.press('Escape');assert.equal(await page.locator('#councilDetailModal').getAttribute('aria-hidden'),'true');
  await page.locator('#councilRows .council-open-detail').first().click();await page.locator('#detailContent:not([hidden])').waitFor();assert.equal(await page.locator('#officialReply').inputValue(),'Rascunho inteiramente fictício.');
  await page.locator('#councilDetailModal [data-close-modal]').click();
  // Faster second click must never paint the previous case or its draft.
  await page.locator('#councilRows .council-open-detail').nth(1).evaluate(node=>node.click());await page.locator('#councilRows .council-open-detail').nth(2).evaluate(node=>node.click());assert.equal(await page.locator('#detailProtocol').textContent(),'CMS-2026-000003');assert(await page.locator('#detailContent').isHidden());await page.locator('#detailContent:not([hidden])').waitFor();assert.equal(await page.locator('#detailSubject').textContent(),scene.items[2].subject);assert.equal(await page.locator('#officialReply').inputValue(),'');
  assert.equal(scene.mutations.length,0);assert(!scene.requests.some(item=>/attachments\//.test(item.path)));assert.equal(scene.result.errors.length,0);results.push({width,theme,elapsed,geometry,maxBackgroundRequests:maxActive,prefetches:reads.filter(item=>item.prefetch).length});
 }finally{await scene.close();}
}
await fs.writeFile(output+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
