import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,posts,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'), out=path.join(root,'.local/mobile-shell-regressions');
await fs.mkdir(out,{recursive:true});
const server=await serve(root), browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || await fs.access('/usr/bin/chromium').then(()=>'/usr/bin/chromium',()=>chromium.executablePath()),args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const results=[];
const until=async fn=>{for(let n=0;n<300;n++){try{if(await fn())return;}catch(error){if(!/Execution context was destroyed|Cannot find context/.test(error.message))throw error;}await new Promise(r=>setTimeout(r,10));}throw Error('condition timeout');};
const go=async(page,route)=>{await page.evaluate(route=>window.PortalCitizenShell.navigate(new URL(route,location.href)),route);assert.equal(await page.evaluate(()=>(window.PortalCitizenShell?.active().url || location).pathname+(window.PortalCitizenShell?.active().url || location).search),route);};
async function run(id,setup,exercise){
 if(process.env.CASES&&!process.env.CASES.split(',').includes(id))return;
 const result={id,checks:[],errors:[]}, {page,context,audit}=await newPage(browser,{width:390,theme:'dark',seedOnce:true},server.origin,result);
 const check=(label,ok)=>{assert.ok(ok,label);result.checks.push(label);};
 try{await setup?.(page,context,audit);await page.goto(server.origin+'/',{waitUntil:'domcontentloaded'});await ready(page,'/');await exercise(page,context,audit,check,result);check('no page errors',!result.errors.length);check('no unmapped API calls',!audit.unmappedApiCalls.length);}
 catch(e){result.failure=e.stack;}
 finally{result.documents=audit.documents;await context.close();results.push(result);await fs.writeFile(path.join(out,id+'.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({id,checks:result.checks.length,failure:result.failure,errors:result.errors}));}
}
try{
 await run('cache-protected',null,async(page,context,audit,check)=>{
  // Prepared Mascotes and Home reserve two protected slots; remaining clean
  // prepared areas must be evicted before any edited profile can be lost.
  await page.waitForFunction(()=>window.PortalCitizenShell.diagnostics().ready.includes('/mascotes/')&&!window.PortalCitizenShell.diagnostics().prewarming);
  for(let i=0;i<14;i++){await go(page,'/perfil/?draft='+i);await page.locator('#profileEditBio').fill('draft-'+i);}
  check('cache reaches16 including protected Home and Mascotes',await page.evaluate(()=>window.PortalCitizenShell.diagnostics().routes===16));
  await page.evaluate(()=>window.PortalCitizenShell.navigate(new URL('/perfil/?draft=overflow',location.href)));
  check('overflow explicitly refused without changing area',await page.evaluate(()=>(window.PortalCitizenShell?.active().url || location).search==='?draft=13'&&window.PortalCitizenShell.diagnostics().routes===16&&document.querySelector('.citizen-route-notice').textContent.includes('Conclua os rascunhos')));
  for(let i=0;i<14;i++){await go(page,'/perfil/?draft='+i);check('protected draft '+i+' retained',await page.locator('#profileEditBio').inputValue()==='draft-'+i);}
  check('no document reload under saturation',audit.documents.length===1);
 });
 await run('cache-clean-eviction',null,async(page,context,audit,check)=>{
  await go(page,'/amigos/');await page.locator('#socialSearchInput').fill('protected friend search');
  for(let i=0;i<17;i++)await go(page,'/perfil/?clean='+i);
  check('clean eviction keeps16area bound',await page.evaluate(()=>window.PortalCitizenShell.diagnostics().routes===16));
  await go(page,'/amigos/');check('dirty view survives clean evictions',await page.locator('#socialSearchInput').inputValue()==='protected friend search');
 });
 await run('empty-feed',async page=>{await page.route('**/api/social/feed*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({posts:[],nextCursor:''})}));},async(page,context,audit,check)=>{
  await until(()=>page.evaluate(()=>Boolean(document.querySelector('#socialFeedList .social-empty'))));
  await page.route('**/api/social/feed*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({posts:[posts[0]],nextCursor:''})}));
  await page.evaluate(()=>window.PortalSocialFeed.checkNew(window.PortalCitizenShell.active().root));
  check('empty arrival waits for tap',await page.locator('#socialFeedList [data-post-id]').count()===0);
  await page.locator('.social-new-posts').click();check('empty placeholder replaced once',await page.locator('#socialFeedList [data-post-id]').count()===1&&await page.locator('#socialFeedList .social-empty').count()===0);
 });
 await run('feed-long-gap',null,async(page,context,audit,check)=>{
  await until(()=>page.locator('#socialFeedList [data-post-id]').count().then(n=>n>0));
  const arrivals=Array.from({length:16},(_,i)=>({...posts[0],id:'gap-'+i,body:'synthetic gap '+i,createdAt:new Date(Date.UTC(2026,9,10,16)-i*60000).toISOString()}));
  let calls=0;
  await page.route('**/api/social/feed*',route=>{calls++;const index=Number(new URL(route.request().url()).searchParams.get('cursor')||0);return route.fulfill({contentType:'application/json',body:JSON.stringify({posts:arrivals.slice(index*2,index*2+2).concat(index===7?[posts[0]]:[]),nextCursor:index<7?String(index+1):''})});});
  await page.locator('#homeComposerTrigger').click();await page.locator('#socialComposerText').fill('feed draft retained');await page.locator('#homeComposerCollapse').click();
  await page.evaluate(()=>window.scrollTo(0,400));
  const anchor=await page.evaluate(()=>{const node=[...document.querySelectorAll('#socialFeedList [data-post-id]')].find(n=>n.getBoundingClientRect().bottom>0);return {id:node.dataset.postId,top:node.getBoundingClientRect().top};});
  await page.evaluate(()=>window.PortalSocialFeed.checkNew(window.PortalCitizenShell.active().root));
  check('gap detection makes one request without inserting',calls===1&&await page.locator('[data-post-id^="gap-"]').count()===0);
  // Programmatic click keeps the pre-existing reading anchor in view.
  await page.locator('.social-new-posts').evaluate(node=>node.click());
  await until(()=>page.locator('[data-post-id^="gap-"]').count().then(n=>n===12));
  check('first tap bounded to5extra pages and leaves continuation',calls===6&&!await page.locator('.social-new-posts').isHidden());
  check('reading anchor unchanged after first insertion',await page.evaluate(a=>Math.abs(document.querySelector('[data-post-id="'+a.id+'"]').getBoundingClientRect().top-a.top)<2,anchor));
  await page.locator('.social-new-posts').evaluate(node=>node.click());
  await until(()=>page.locator('[data-post-id^="gap-"]').count().then(n=>n===16));
  const ids=await page.locator('[data-post-id^="gap-"]').evaluateAll(nodes=>nodes.map(n=>n.dataset.postId));
  check('continuation covers entire gap exactly once in order',calls===8&&JSON.stringify(ids)===JSON.stringify(arrivals.map(p=>p.id)));
  check('draft retained and notice cleared',await page.locator('#socialComposerText').inputValue()==='feed draft retained'&&await page.locator('.social-new-posts').isHidden());
 });
 await run('updater-timing',async page=>{
  await page.addInitScript(()=>{
   const nativeSet=window.setTimeout,nativeClear=window.clearTimeout,hidden=Object.getOwnPropertyDescriptor(Document.prototype,'hidden');let now=0,serial=-1;const jobs=new Map();
   Object.defineProperty(document,'hidden',{get:()=>window.__hiddenTest??hidden.get.call(document)});
   window.setTimeout=(fn,delay,...args)=>{if(fn.name!=='updates')return nativeSet(fn,delay,...args);const id=serial--;jobs.set(id,{fn,due:now+delay});return id;};
   window.clearTimeout=id=>{if(jobs.has(id))jobs.delete(id);else nativeClear(id);};
   window.__updaterClock={advance:async ms=>{const end=now+ms;while(true){const next=[...jobs].filter(([,job])=>job.due<=end).sort((a,b)=>a[1].due-b[1].due)[0];if(!next)break;jobs.delete(next[0]);now=next[1].due;await next[1].fn();}now=end;},pending:()=>[...jobs.values()].map(j=>j.due-now)};
  });
 },async(page,context,audit,check)=>{
  // Route startup also reads social/config. Finish the independent preparation
  // before counting the updater's requests; its synthetic clock has not moved.
  await page.waitForFunction(()=>{
   const state=window.PortalCitizenShell.diagnostics();
   return !state.prewarming&&['/amigos/','/perfil/','/mascotes/','/notificacoes/'].every(path=>state.ready.includes(path));
  });
  await page.waitForLoadState('networkidle');
  let calls=0,fail=false,hold=false,release;
  await page.route('**/api/social/config',async route=>{calls++;if(hold){hold=false;await new Promise(resolve=>{release=resolve;});}return route.fulfill({status:fail?503:200,contentType:'application/json',body:JSON.stringify(fail?{error:'synthetic failure'}:{available:true,backendEnabled:true,homeEnabled:true,unreadSocialNotifications:0})});});
  await page.evaluate(()=>window.__updaterClock.advance(999));check('initial updater does not run before1s',calls===0);
  await page.evaluate(()=>window.__updaterClock.advance(1));check('initial updater runs at1s',calls===1);
  await page.evaluate(()=>window.__updaterClock.advance(29999));check('no early30s poll',calls===1);
  await page.evaluate(()=>window.__updaterClock.advance(1));check('30s poll after completion',calls===2);
  fail=true;await page.evaluate(()=>window.__updaterClock.advance(30000));check('first failure schedules60s',calls===3&&await page.evaluate(()=>window.__updaterClock.pending()[0]===60000));
  await page.evaluate(()=>window.__updaterClock.advance(59999));check('no poll before backoff expiry',calls===3);
  await page.evaluate(()=>window.__updaterClock.advance(1));check('second failure schedules120s',calls===4&&await page.evaluate(()=>window.__updaterClock.pending()[0]===120000));
  await page.evaluate(()=>window.__updaterClock.advance(120000));check('backoff capped120s',calls===5&&await page.evaluate(()=>window.__updaterClock.pending()[0]===120000));
  await page.evaluate(()=>{window.__hiddenTest=true;document.dispatchEvent(new Event('visibilitychange'));});
  await page.evaluate(()=>window.__updaterClock.advance(240000));check('hidden portal cancels updater',calls===5&&await page.evaluate(()=>window.__updaterClock.pending().length===0));
  fail=false;await page.evaluate(()=>{window.__hiddenTest=false;document.dispatchEvent(new Event('visibilitychange'));});await until(()=>page.evaluate(()=>!window.PortalCitizenShell.diagnostics().updateRunning));check('visible recovery updates immediately and resets interval',calls===6&&await page.evaluate(()=>window.__updaterClock.pending()[0]===30000));
  await context.setOffline(true);await until(()=>page.evaluate(()=>!navigator.onLine));await page.evaluate(()=>window.__updaterClock.advance(120000));check('offline portal pauses',calls===6);
  await context.setOffline(false);await until(()=>page.evaluate(()=>!window.PortalCitizenShell.diagnostics().updateRunning&&navigator.onLine));check('online recovery performs one immediate update',calls===7&&await page.evaluate(()=>window.__updaterClock.pending().length===1));
  hold=true;await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await until(()=>calls===8);
  await page.evaluate(()=>{window.dispatchEvent(new Event('online'));window.dispatchEvent(new Event('focus'));});await page.evaluate(()=>window.__updaterClock.advance(120000));
  check('slow request does not overlap or accumulate repeated event polls',calls===8&&await page.evaluate(()=>window.PortalCitizenShell.diagnostics().updateRunning&&!window.PortalCitizenShell.diagnostics().updateScheduled));
  release();await until(()=>page.evaluate(()=>!window.PortalCitizenShell.diagnostics().updateRunning));
  await page.evaluate(()=>window.__updaterClock.advance(29999));check('interval starts after slow response completion',calls===8);
  await page.evaluate(()=>window.__updaterClock.advance(1));check('one poll follows slow response after30s',calls===9);
 });
 for(const mode of ['logout','replacement'])await run('sw-'+mode,null,async(page,context,audit,check,result)=>{
  await page.locator('#portalChatLauncher').click();await page.locator('[data-chat-user="fixture.friend"]').first().click();await page.locator('#portalChatConversationView.active').waitFor();
  console.log('sw '+mode+' conversation open');await page.locator('#portalChatInput').fill('private old account draft '+mode);
  await until(()=>Boolean(audit.worker));
  await until(async()=>Boolean((await audit.worker.evaluate(()=>self.__sceneSessionEvidence())).events.find(e=>e.type==='PORTAL_CHAT_SESSION_PUT'&&e.snapshot?.drafts.some(d=>d.body==='private old account draft '+mode))));
  console.log('sw '+mode+' positive PUT');const before=await audit.worker.evaluate(()=>self.__sceneSessionEvidence());result.before=before;
  const oldClient=before.events.findLast(e=>e.type==='PORTAL_CHAT_SESSION_PUT').clientId;
  if(mode==='replacement')await page.route('**/api/auth/me',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({user:{username:'replacement.synthetic',role:'cidadao',emailVerified:true}})}));
  await page.evaluate(mode=>{
   if(mode==='logout')window.RegulationAuth.clearSession();
   else{sessionStorage.setItem('regulacao.portal.session','replacement-synthetic-token');sessionStorage.setItem('regulacao.portal.user',JSON.stringify({username:'replacement.synthetic',role:'cidadao'}));window.dispatchEvent(new CustomEvent('portal:session-ready',{detail:{user:{username:'replacement.synthetic',role:'cidadao'}}}));}
   // Repeated ready events can arrive from native owners already awaiting auth.
   if(mode==='replacement')window.dispatchEvent(new CustomEvent('portal:session-ready',{detail:{user:{username:'replacement.synthetic',role:'cidadao'}}}));
   // Explicit late persistence triggers in addition to real navigation pagehide.
   window.dispatchEvent(new Event('pagehide'));window.dispatchEvent(new Event('online'));document.dispatchEvent(new Event('visibilitychange'));
  },mode);
  console.log('sw '+mode+' boundary dispatched');if(mode==='logout'){await page.waitForURL('**/login/');await page.locator('#loginForm').waitFor();}
  else{await until(()=>page.evaluate(()=>window.RegulationAuth?.getCachedUser()?.username==='replacement.synthetic'&&window.PortalCitizenShell&&!window.PortalCitizenShell.diagnostics().ended));await ready(page,'/');}
  console.log('sw '+mode+' new document ready');const evidence=await audit.worker.evaluate(()=>self.__sceneSessionEvidence());result.after=evidence;
  const events=evidence.events.filter(e=>e.sequence>before.events.length);
  check('boundary creates only one replacement document',audit.documents.length===2);
  check('native session CLEAR delivered',events.some(e=>e.type==='PORTAL_CHAT_SESSION_CLEAR'));
  check('old document sends no PUT after session boundary',!events.some(e=>e.type==='PORTAL_CHAT_SESSION_PUT'&&e.clientId===oldClient));
  check('no old draft PUT after session boundary including pagehide',!events.some(e=>e.type==='PORTAL_CHAT_SESSION_PUT'&&e.snapshot?.drafts.some(d=>d.body==='private old account draft '+mode)));
  check('new document contains no old input',await page.evaluate(mode=>document.getElementById('portalChatInput')?.value!=='private old account draft '+mode,mode));
 });
}finally{await browser.close();await new Promise(r=>server.server.close(r));await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));}
if(results.some(r=>r.failure))process.exitCode=1;
