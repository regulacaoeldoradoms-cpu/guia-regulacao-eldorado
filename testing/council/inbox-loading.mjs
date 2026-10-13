// Cold navigation, warm reload and Home reentry: synthetic identities and records only.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {openVisual} from './visual-fixtures.mjs';
const out=process.argv[2]||'.local/inbox-loading';await fs.mkdir(out,{recursive:true});const results=[];
for(const width of [320,390])for(const theme of ['light','dark']){
 const scene=await openVisual(process.cwd(),{width,theme,count:253,seedOnce:true}),{page}=scene;
 try{
  // Delayed cold assets, then exactly the same bytes from a retained synthetic
  // asset cache. Routing disables Chromium HTTP cache, so this explicitly tests
  // warm asset availability plus the retained browser/session, not cache hit claims.
  const assets=new Map();let cacheHits=0,cacheMisses=0;
  await scene.context.route('**/*',async route=>{const url=new URL(route.request().url());if(url.origin!==scene.origin||!/^\/(js|css)\//.test(url.pathname)||!/[.](js|css)$/.test(url.pathname))return route.fallback();let body=assets.get(url.pathname);if(!body){cacheMisses++;body=await fs.readFile(path.resolve(process.cwd(),'.'+url.pathname));assets.set(url.pathname,body);await new Promise(r=>setTimeout(r,500));}else cacheHits++;return route.fulfill({body,contentType:url.pathname.endsWith('.css')?'text/css':'text/javascript',headers:{'Cache-Control':'public,max-age=3600'}});});
  await scene.context.addInitScript(()=>{
   window.__inboxPaints=[];
   const visible=n=>Boolean(n?.getClientRects().length)&&getComputedStyle(n).display!=='none'&&getComputedStyle(n).visibility==='visible';
   const sample=()=>{
    const main=document.querySelector('.portal-main'),head=document.querySelector('.portal-brand h1');
    if(visible(main)&&head){const type=document.getElementById('councilType'),bulk=document.querySelector('.council-delete-group>summary'),summary=document.getElementById('councilSummary');window.__inboxPaints.push({at:performance.now(),pending:document.body.hasAttribute('data-council-inbox-pending'),active:document.body.hasAttribute('data-council-inbox'),hero:visible(document.querySelector('.portal-hero')),legacyFilter:visible(type)&&!type.closest('.council-inbox-filters'),legacyBulk:visible(bulk)&&bulk.textContent.includes('excluir'),legacySummary:visible(summary)&&!summary.closest('.council-inbox-more'),headerFont:getComputedStyle(head).fontSize,headerPosition:getComputedStyle(document.querySelector('.portal-topbar')).position});}
    requestAnimationFrame(sample);
   };requestAnimationFrame(sample);
  });
  for(const stage of ['cold','warm','reentry']){
   const previousCacheHits=cacheHits;
   if(stage==='cold')await page.goto(scene.origin+'/conselho/painel/');
   else if(stage==='warm')await page.reload();
   else{await page.locator('.social-mobile-nav a[href="/"]').click();await page.waitForURL(scene.origin+'/');await page.goto(scene.origin+'/conselho/painel/');}
   await page.waitForFunction(()=>document.body.hasAttribute('data-council-inbox')&&!document.body.hasAttribute('data-council-inbox-pending'));
   await page.locator('#councilRows tr[data-protocol]').first().waitFor();
   const paints=await page.evaluate(()=>window.__inboxPaints);assert(paints.length>0);
   assert(paints.every(p=>!p.hero&&!p.legacyFilter&&!p.legacyBulk&&!p.legacySummary&&p.headerFont==='16px'&&p.headerPosition==='relative'),JSON.stringify({width,theme,stage,bad:paints.filter(p=>p.hero||p.legacyFilter||p.legacyBulk||p.legacySummary||p.headerFont!=='16px'||p.headerPosition!=='relative')}));
   if(stage==='cold')assert(paints.some(p=>p.pending),JSON.stringify({width,theme,stage,reason:'missing measured loading frame'}));else assert(cacheHits>previousCacheHits,'Warm stages must actually use retained asset bytes');
   for(const selector of ['.council-inbox-account','.council-inbox-controls','#councilSearch','#councilType','#councilStatus','#portalLogout'])assert.equal(await page.locator(selector).count(),1);
   assert(await page.locator('#councilInboxLoading').isHidden());assert.equal(scene.result.errors.length,0);assert.equal(scene.mutations.length,0);
   await page.screenshot({path:`${out}/${width}-${theme}-${stage}.png`});results.push({width,theme,stage,frames:paints.length,cacheHits,cacheMisses,oldLayoutFrames:0,duplicates:0,passed:true});console.log(JSON.stringify(results.at(-1)));
  }
 }finally{await scene.close();}
}
// A failed presentation asset must release the native list in bounded time.
for(const theme of ['light','dark']){
 const scene=await openVisual(process.cwd(),{width:390,theme,count:1}),{page}=scene;
 try{await scene.context.route('**/js/council-inbox-mobile.js?*',r=>r.fulfill({status:404,body:''}));await page.goto(scene.origin+'/conselho/painel/');assert(await page.locator('#refreshCouncil').isVisible());assert(await page.locator('#councilInboxLoading').isVisible());await page.waitForFunction(()=>document.body.hasAttribute('data-council-inbox-fallback')&&!document.body.hasAttribute('data-council-inbox-pending'),null,{timeout:7000});await page.locator('#councilRows tr[data-protocol]').first().waitFor();assert(await page.locator('#councilSearch').isVisible());assert.match(await page.locator('#councilInboxLoading').textContent(),/controles originais/);assert.equal(scene.mutations.length,0);results.push({theme,assetFailure:true,boundedFallbackMs:5000,refreshAvailable:true,nativeListVisible:true,passed:true});console.log(JSON.stringify(results.at(-1)));}finally{await scene.close();}
}
await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
