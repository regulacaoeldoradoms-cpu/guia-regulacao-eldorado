// Direct entry, pending identity/data, retained exit and return. Synthetic only.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'.local/citizen-retained-startup');
await fs.mkdir(out,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const result={errors:[]},{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true},server.origin,result);
// The shared account header can publish its fixture label before Citizen's own
// startup. Keep only that label pending until the held startup is released, so
// the test deterministically exercises the controller's real 50ms retry path.
await context.addInitScript(()=>{
 const descriptor=Object.getOwnPropertyDescriptor(Node.prototype,'textContent'),pending=new Map();
 let held=true;
 Object.defineProperty(Node.prototype,'textContent',{...descriptor,set(value){
  if(held&&this.nodeType===1&&this.id==='portalUserRole'){
   pending.set(this,value);return descriptor.set.call(this,'Carregando…');
  }
  return descriptor.set.call(this,value);
 }});
 window.__releaseStartupRole=()=>{
  held=false;Object.defineProperty(Node.prototype,'textContent',descriptor);
  for(const [node,value]of pending)descriptor.set.call(node,value);pending.clear();
 };
});
let release,reached;const held=new Promise(r=>{release=r;}),started=new Promise(r=>{reached=r;});
const within=async(label,pending)=>{
 result.stage=label;let timer;
 try{return await Promise.race([pending,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Startup fixture timed out: '+label)),15000);})]);}
 finally{clearTimeout(timer);}
};
if(process.env.STARTUP_BASELINE==='1'){
 const body=execFileSync('git',['show','e7cf38e:js/citizen-mobile-app.js'],{cwd:root,encoding:'utf8'});
 await context.route('**/js/citizen-mobile-app.js*',r=>r.fulfill({contentType:'text/javascript',body}));
}
// Pause an asynchronous data read, not a script that can also hold document
// load and shared presentation readiness on a different Chromium revision.
await context.route('**/api/council/my',async route=>{assert.equal(route.request().method(),'GET');reached();await held;await route.fallback();});
try{
 await page.goto(server.origin+'/cidadao/',{waitUntil:'domcontentloaded'});await within('initial data read',started);
 await page.waitForFunction(()=>document.getElementById('attachmentForm')?.dataset.mobileAttachmentReady==='true');
 assert.equal(await page.locator('.citizen-mobile-tabs').count(),0);
 await page.evaluate(()=>{window.__startupCitizen=PortalCitizenShell.active();});
 assert(!await page.evaluate(()=>__startupCitizen.loaded));
 await within('leave pending Citizen',page.evaluate(()=>PortalCitizenShell.navigate(new URL('/',location.href))));await within('Home ready',ready(page,'/'));
 await page.waitForTimeout(100); // Let the original 50ms retry be discarded while inactive.
 await page.evaluate(()=>__releaseStartupRole());release();await page.waitForFunction(()=>__startupCitizen.loaded);
 await within('return to Citizen',page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href))));
 assert.equal(await page.locator('.citizen-mobile-tabs').count(),1,'Pending direct-entry setup must resume on activation');
 await page.locator('.citizen-mobile-tab[data-tab=notifications]').click();
 for(let cycle=0;cycle<2;cycle++){
  await within('repeat Home '+cycle,page.evaluate(()=>PortalCitizenShell.navigate(new URL('/',location.href))));
  await within('repeat Citizen '+cycle,page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href))));
  assert.equal(await page.locator('.citizen-mobile-tabs').count(),1,'Resume cannot duplicate tabs/listeners');
  assert.equal(await page.locator('body').getAttribute('data-citizen-tab'),'notifications','Resume preserves the selected tab');
 }
 assert(await page.evaluate(()=>PortalCitizenShell.active()===__startupCitizen));
 assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
 assert(!audit.apiCalls.some(x=>/^(POST|PATCH|PUT|DELETE) \/api\/council\//.test(x)));
 result.passed=true;
}catch(error){result.failure=error.stack;throw error;}
finally{release();await context.close();await browser.close();await new Promise(r=>{server.server.close(r);server.server.closeAllConnections();});console.log(JSON.stringify(result));await fs.writeFile(path.join(out,process.env.STARTUP_BASELINE==='1'?'baseline.json':'results.json'),JSON.stringify(result,null,2));}
