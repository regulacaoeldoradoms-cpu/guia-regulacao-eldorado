// Real fetch cancellation/deadline with optional AbortSignal statics absent.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'.local/citizen-retained-abort-compat');
await fs.mkdir(out,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const results=[];
try{
 for(const missing of [['any'],['timeout'],['any','timeout']]){
  if(process.env.ABORT_COMPAT_BASELINE==='1'&&missing.length!==2)continue;
  const result={missing,errors:[]},{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true},server.origin,result);
  let hold=false,release,reached;const held=new Promise(r=>{release=r;}),started=new Promise(r=>{reached=r;});
  await context.addInitScript(methods=>{
   for(const method of methods)Object.defineProperty(AbortSignal,method,{configurable:true,value:undefined});
   const original=fetch.bind(window);window.__compatReads=[];
   window.fetch=(input,init={})=>{
    const pathname=new URL(typeof input==='string'?input:input.url,location.href).pathname;
    if(pathname!=='/api/council/my')return original(input,init);
    const row={signal:!!init.signal,aborted:false,rejected:false,start:performance.now()};__compatReads.push(row);
    init.signal?.addEventListener('abort',()=>{row.aborted=true;row.elapsed=performance.now()-row.start;},{once:true});
    return original(input,init).catch(error=>{row.rejected=true;row.error=error.name;throw error;});
   };
  },missing);
  if(process.env.ABORT_COMPAT_BASELINE==='1'){
   const body=execFileSync('git',['show','b33eb58:js/citizen.js'],{cwd:root,encoding:'utf8'});
   await context.route('**/js/citizen.js*',r=>r.fulfill({contentType:'text/javascript',body}));
  }
  await context.route('**/api/council/my',async route=>{assert.equal(route.request().method(),'GET');if(hold){hold=false;reached();await held;}return route.fulfill({json:{manifestations:[]}}).catch(()=>{});});
  try{
   await page.goto(server.origin+'/');await ready(page,'/');
   await page.waitForFunction(()=>PortalCitizenShell.diagnostics().ready.includes('/cidadao/')&&!PortalCitizenShell.diagnostics().prewarming);
   assert(await page.evaluate(()=>__compatReads.length>0&&__compatReads.every(x=>x.signal)),'Retained Citizen GET must reach fetch with a cancellation signal');
   await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));
   if(missing.length===2){
    hold=true;const refreshing=page.evaluate(()=>PortalCitizenShell.active().controllers.find(c=>c.revalidate).revalidate({force:true}));
    let timer;try{await Promise.race([started,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Held compatibility read never started')),15000);})]);}finally{clearTimeout(timer);}
    await page.waitForFunction(()=>__compatReads.at(-1)?.aborted&&__compatReads.at(-1)?.rejected,null,{timeout:23000});
    const evidence=await page.evaluate(()=>({first:__compatReads[0],held:__compatReads.at(-1)}));
    assert(!evidence.first.aborted,'Completed fallback reads must release their deadline');
    assert(evidence.held.elapsed>=14000,'Fallback keeps the real 15-second deadline');
    assert(['AbortError','TimeoutError'].includes(evidence.held.error));
    release();await refreshing;
    assert(await page.locator('#citizenDataStatus').isVisible(),'Timed-out data must remain explicitly stale');
    result.deadline=evidence.held;
   }
   assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
   assert(!audit.apiCalls.some(x=>/^(POST|PATCH|PUT|DELETE) \/api\/council\//.test(x)));result.passed=true;
  }catch(error){result.failure=error.stack;throw error;}
  finally{release();await context.close();results.push(result);console.log(JSON.stringify(result));await fs.writeFile(path.join(out,process.env.ABORT_COMPAT_BASELINE==='1'?'baseline.json':'results.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>{server.server.close(r);server.server.closeAllConnections();});}
