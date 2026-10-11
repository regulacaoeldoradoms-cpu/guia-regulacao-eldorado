import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,chromium}=await import('./mobile-profile-refinement.mjs');
const server=await serve(process.cwd());const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const results=[];
try{for(const width of [390,1440])for(const available of [true,false]){
 const result={width,available,checks:[],errors:[]};const {page,context,audit}=await newPage(browser,{width,theme:'light',seedOnce:true},server.origin,result);
 const check=(name,value)=>{assert.ok(value,name);result.checks.push(name);};let release;const held=new Promise(r=>release=r);
 await page.route('**/js/home-social-presentation.js*',async route=>{await held;await route.fallback().catch(()=>{});});
 if(!available)await page.route('**/api/social/config',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({homeEnabled:true,available:false,gate:{message:'Gate sintético indisponível'}})}));
 try{
  await page.goto(server.origin+'/',{waitUntil:'domcontentloaded'});
  if(available){
   await page.waitForFunction(()=>document.querySelector('#socialFeedList [data-post-id]'));
   check('feed data rendered while presentation is held',await page.locator('#socialFeedList [data-post-id]').count()>0);
   check('surface remains gated until presentation completes',await page.locator('#socialHome').isHidden());
   check('one initial feed request',audit.apiCalls.filter(p=>p==='GET /api/social/feed').length===1);
   if(width===390){
    check('updater waits for complete initial Home',await page.evaluate(()=>!window.PortalCitizenShell.diagnostics().updateScheduled&&!window.PortalCitizenShell.diagnostics().updateRunning));
    await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
    await page.waitForFunction(()=>!window.PortalCitizenShell.diagnostics().updateRunning);
    check('focus during startup does not repeat feed',audit.apiCalls.filter(p=>p==='GET /api/social/feed').length===1);
   }
  }
  release();await page.evaluate(()=>window.PortalHomeReady);
  if(width===390){
   check('Home direct CSS fetched once',audit.resources.filter(p=>p.startsWith('/css/home-mobile-direct.css')).length===1);
   check('mobile navigation CSS fetched once',audit.resources.filter(p=>p.startsWith('/css/citizen-mobile-navigation.css')).length===1);
  }
  check('expected final surface visible',await page.locator(available?'#socialHome':'#toolsFallback').isVisible());
  if(!available)check('unavailable gate fetches no private feed/profile',!audit.apiCalls.some(p=>/^GET \/api\/social\/(me|feed)$/.test(p)));
  check('no page errors',result.errors.length===0);check('all API responses synthetic',audit.unmappedApiCalls.length===0);
 }catch(e){result.failure=e.stack;}finally{release();await context.close();results.push(result);console.log(JSON.stringify(result));}
}}finally{await browser.close();await new Promise(r=>server.server.close(r));}
await fs.mkdir('.local',{recursive:true});await fs.writeFile('.local/home-startup-results.json',JSON.stringify(results,null,2));if(results.some(r=>r.failure))process.exitCode=1;
