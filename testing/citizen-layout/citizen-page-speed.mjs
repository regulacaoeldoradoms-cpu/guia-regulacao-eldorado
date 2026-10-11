// Comparable synthetic cold entries; fixed API latency, same cached citizen.
import fs from 'node:fs/promises';
import path from 'node:path';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,chromium}=await import('./mobile-profile-refinement.mjs');
const root=process.env.PORTAL_ROOT || path.resolve(import.meta.dirname,'../..');
const output=process.env.SPEED_OUTPUT || '/tmp/citizen-page-speed.json';
const delay=Number(process.env.API_DELAY_MS || 180),samples=Number(process.env.SAMPLES || 5);
const sources=process.env.SPEED_BASE_ROOT ? [{label:'before',root:process.env.SPEED_BASE_ROOT},{label:'after',root}] : [{label:'current',root}];
for(const source of sources)source.server=await serve(source.root);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
const rows=[];
try{
  for(let sample=0;sample<samples;sample++)for(const source of sources){
    const server=source.server;
    const result={errors:[]};const {page,context,audit}=await newPage(browser,{theme:'light',width:390},server.origin,result);
    try{
      await context.route('**/api/**',async route=>{await new Promise(r=>setTimeout(r,delay));if(new URL(route.request().url()).pathname==='/api/council/notifications')return route.fulfill({contentType:'application/json',body:'{"notifications":[]}'});return route.fallback();});
      await context.addInitScript(()=>{
        window.__citizenUseful={};new MutationObserver(()=>{
          const list=document.querySelector('#manifestationList > .empty-state,#manifestationList > .manifestation-item');
          if(list && !window.__citizenUseful.dataMs)window.__citizenUseful.dataMs=performance.now();
          const action=document.getElementById('openNewManifestation');
          if(action && !action.hidden && !action.disabled && !/Carregando/.test(document.getElementById('portalUserName')?.textContent || 'Carregando') && !window.__citizenUseful.actionMs)window.__citizenUseful.actionMs=performance.now();
        }).observe(document,{childList:true,subtree:true,attributes:true});
      });
      await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.__citizenUseful.dataMs>0);
      await page.waitForTimeout(1500);
      const timings=await page.evaluate(()=>({...window.__citizenUseful,domContentLoadedMs:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd}));
      const apiCounts={};for(const call of audit.apiCalls)apiCounts[call]=(apiCounts[call] || 0)+1;
      const resources=audit.resources.map(u=>new URL(u,server.origin).pathname);let assetBytes=0;
      for(const resource of resources){if(!/^\/(js|css|assets|vendor)\//.test(resource))continue;try{assetBytes+=(await fs.stat(path.join(source.root,resource))).size;}catch{}}
      rows.push({label:source.label,root:source.root,sample,...timings,apiCounts,resources:resources.length,requestedAssetSourceBytes:assetBytes,errors:result.errors,unmapped:audit.unmappedApiCalls});
      if(sample===0 && process.env.SPEED_SCREENSHOT && source.label!=='before')await page.screenshot({path:process.env.SPEED_SCREENSHOT,fullPage:true});
      console.log(JSON.stringify(rows.at(-1)));
    }finally{await context.close();}
  }
}finally{await browser.close();for(const source of sources)await new Promise(r=>source.server.server.close(r));}
const median=(key,label)=>{const a=rows.filter(r=>!label || r.label===label).map(r=>r[key]).sort((a,b)=>a-b);return a[Math.floor(a.length/2)];};
await fs.writeFile(output,JSON.stringify({root,syntheticOnly:true,apiDelayMs:delay,width:390,samples,summary:sources.map(source=>({label:source.label,usefulDataMedianMs:median('dataMs',source.label),actionMedianMs:median('actionMs',source.label),requestedAssetSourceBytesMedian:median('requestedAssetSourceBytes',source.label)})),rows},null,2));
