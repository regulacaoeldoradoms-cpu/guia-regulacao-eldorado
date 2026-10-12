import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {openDetails} from './detail-fixtures.mjs';
const baselineRoot=process.env.COUNCIL_DETAIL_BASELINE_ROOT;if(!baselineRoot)throw new Error('Defina COUNCIL_DETAIL_BASELINE_ROOT com um checkout da versão anterior.');
const out=process.argv[2]||'.local/detail-performance';await fs.mkdir(out,{recursive:true});const samples=[];
for(let repeat=0;repeat<5;repeat++)for(const mode of ['baseline-cold','new-cold','new-prefetched']){
 const root=mode==='baseline-cold'?baselineRoot:process.cwd();
 const scene=await openDetails(root,{width:390,rtt:100,throughput:50*1024,longMessages:true,capability:mode==='new-prefetched'}),{page}=scene;
 try{
  const start=Date.now();await page.goto(scene.origin+'/conselho/painel/');await page.locator('#councilRows tr[data-protocol]').first().waitFor();const listReady=Date.now()-start;
  await page.waitForFunction(()=>document.body.classList.contains('council-navigation-ready'));await page.evaluate(()=>document.fonts.ready);
  if(mode==='new-prefetched'){while(!scene.reads.some(r=>r.protocol==='CMS-2026-000001'&&r.prefetch&&r.finished))await page.waitForTimeout(50);await page.waitForTimeout(100);}
  const before=scene.reads.length,at=Date.now();await page.locator('#councilRows .council-open-detail').first().evaluate(node=>node.click());await page.locator('#detailContent:not([hidden])').waitFor();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const clickToPaint=Date.now()-at;
  const read=scene.reads.slice(before).find(r=>!r.prefetch);assert(read);assert.equal(scene.views.length,1);assert.equal(scene.mutations.length,0);if(mode==='new-prefetched')assert(read.query.includes('cacheRevision='));
  const record={repeat,mode,listReady,clickToPaint,responseBytes:read.bytes,simulatedResponseTime:read.finished-read.started};samples.push(record);console.log(JSON.stringify(record));
 }finally{await scene.close();}
}
const median=values=>values.sort((a,b)=>a-b)[Math.floor(values.length/2)];const summary=Object.fromEntries(['baseline-cold','new-cold','new-prefetched'].map(mode=>{const data=samples.filter(s=>s.mode===mode);return[mode,{listReadyMedian:median(data.map(s=>s.listReady)),clickToPaintMedian:median(data.map(s=>s.clickToPaint)),responseBytes:data[0].responseBytes}];}));
await fs.writeFile(out+'/results.json',JSON.stringify({conditions:{syntheticOnly:true,rttMs:100,throughputBytesPerSecond:50*1024,messages:50,repeat:5,serverReadLatency:'not modeled; real server revalidates collections on every open',timing:'native click handler to visible content plus two browser animation frames'},samples,summary},null,2));console.log(JSON.stringify(summary));
