// Synthetic loopback only. Cold=new context; session-warm=reload with same session caches.
// HTTP cache is disabled by interception/no-store fixtures; this does not benchmark warm CDN/browser cache.
// Limited: CDP 150ms RTT,200kB/s download,100kB/s upload; fulfilled synthetic APIs add150ms.
import fs from 'node:fs/promises';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,chromium}=await import('./mobile-profile-refinement.mjs');
const server=await serve(process.env.SOURCE_ROOT||process.cwd());
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const rows=[];const samples=Number(process.env.SAMPLES||2);
try{for(const width of (process.env.WIDTHS||'390,1440').split(',').map(Number))for(const mode of (process.env.MODES||'local,limited').split(','))for(let sample=0;sample<samples;sample++){
 const result={errors:[]};const {page,context,audit}=await newPage(browser,{width,theme:'light',seedOnce:true},server.origin,result);
 page.setDefaultTimeout(60000);page.setDefaultNavigationTimeout(60000);
 const cdp=await context.newCDPSession(page);
 if(mode==='limited'){
 await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
 await page.route('**/api/**',async route=>{await new Promise(r=>setTimeout(r,150));await route.fallback();});
 }
 for(const cache of ['cold','session-warm']){
 const start=performance.now(),before=audit.apiCalls.length;
 await page.goto(server.origin+'/',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>{const h=document.querySelector('#socialHome');return h&&!h.hidden&&document.querySelector('#socialFeedList [data-post-id]');},{},{timeout:60000});const contentMs=performance.now()-start;await page.evaluate(()=>window.PortalHomeReady);const homeMs=performance.now()-start;const initialApi=audit.apiCalls.slice(before);const resourceTimings=await page.evaluate(()=>performance.getEntriesByType("resource").map(r=>({url:new URL(r.name).pathname,start:Math.round(r.startTime),end:Math.round(r.responseEnd),duration:Math.round(r.duration),bytes:r.transferSize})));
 if(width===390)await page.waitForFunction(()=>{const s=window.PortalCitizenShell?.diagnostics();return s&&['/amigos/','/perfil/','/mascotes/'].every(p=>s.ready.includes(p));},{},{timeout:60000});
 const preparedMs=performance.now()-start;
 const switches=[];if(width===390)for(const route of ['/amigos/','/perfil/','/mascotes/','/']){const t=performance.now(),n=audit.apiCalls.length;await page.evaluate(p=>window.PortalCitizenShell.navigate(new URL(p,location.href)),route);switches.push({route,ms:Math.round(performance.now()-t),api:audit.apiCalls.slice(n)});}
 rows.push({width,mode,cache,sample,contentMs:Math.round(contentMs),homeMs:Math.round(homeMs),initialApi,resourceTimings,switches,preparedMs:Math.round(preparedMs),api:audit.apiCalls.slice(before),errors:result.errors,unmapped:audit.unmappedApiCalls});
 if(result.errors.length||audit.unmappedApiCalls.length)throw Error('Synthetic coverage/page error: '+JSON.stringify({errors:result.errors,unmapped:audit.unmappedApiCalls}));
 console.log(JSON.stringify(rows.at(-1)));await fs.writeFile(process.env.RESULT_FILE||'.local/home-load-measurements.json',JSON.stringify(rows,null,2));
 }
 await context.close();
}}finally{await browser.close();await new Promise(r=>server.server.close(r));}
await fs.writeFile(process.env.RESULT_FILE||'.local/home-load-measurements.json',JSON.stringify(rows,null,2));
