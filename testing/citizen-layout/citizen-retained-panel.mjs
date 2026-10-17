// Local real Chromium, real controllers, synthetic reads only. Reuses the
// existing network-isolated fixture without changing its guards/tolerances.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium,user}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..');
const output=process.env.RETAINED_OUTPUT||path.join(root,'.local/citizen-retained-panel');
await fs.mkdir(output,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const results=[];
const warm=page=>page.waitForFunction(()=>PortalCitizenShell?.diagnostics().ready.includes('/cidadao/')&&!PortalCitizenShell.diagnostics().prewarming);
const area=(page,url)=>page.waitForFunction(url=>PortalCitizenShell.diagnostics().active===url&&!PortalCitizenShell.diagnostics().navigating,url);
async function go(page,url){await page.evaluate(url=>PortalCitizenShell.navigate(new URL(url,location.href)),url);await area(page,url);}
async function run(id,options,exercise){
 if(process.env.RETAINED_CASES&&!process.env.RETAINED_CASES.split(',').includes(id))return;
 const result={id,errors:[],checks:[]};
 const {page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true,...options},server.origin,result);
 if(process.env.CANCEL_ACTIVE_BASELINE){
  const body=execFileSync('git',['show','948a074:js/citizen-mobile-shell.js'],{cwd:root,encoding:'utf8'});
  await context.route('**/js/citizen-mobile-shell.js*',route=>route.fulfill({contentType:'text/javascript',body}));
 }
 if(process.env.MISSING_ABORT_METHODS)await context.addInitScript(methods=>{for(const method of methods)Object.defineProperty(AbortSignal,method,{configurable:true,value:undefined});},process.env.MISSING_ABORT_METHODS.split(','));
 if(process.env.RETAINED_MOTION)await page.emulateMedia({reducedMotion:process.env.RETAINED_MOTION});
 const reads=[],writes=[];let revision=1,failReads=false;
 await context.route('**/api/council/**',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(req.method()!=='GET'){writes.push(url.pathname);return route.fulfill({status:405,json:{error:'Synthetic fixture forbids mutations'}});}
  reads.push(url.pathname);
  if(failReads)return route.abort('internetdisconnected');
  const item={protocol:'CMS-2026-000001',subject:`Assunto fictício ${revision}`,description:'Descrição inteiramente fictícia',type:'sugestao',privacyMode:'sigilosa',status:revision===1?'recebida':'respondida',createdAt:'2026-10-16T10:00:00Z'};
  const payload=url.pathname==='/api/council/my'?{manifestations:[item]}:url.pathname==='/api/council/notifications'?{notifications:[{id:'synthetic-note',protocol:item.protocol,title:`Aviso fictício ${revision}`,createdAt:item.createdAt}]}:{manifestation:item,messages:[{senderType:'council',body:`Resposta fictícia ${revision}`,createdAt:item.createdAt}],events:[{type:'created',detail:'Histórico fictício',createdAt:item.createdAt}],attachments:[]};
  await route.fulfill({json:payload});
 });
 const check=(name,condition)=>{assert.ok(condition,name);result.checks.push(name);};
 try{
  await exercise({page,context,audit,result,reads,check,rev:()=>revision++,fail:()=>{failReads=true;},recover:()=>{failReads=false;}});
  check('no real or synthetic council mutations',writes.length===0);
  check('no unmapped API',audit.unmappedApiCalls.length===0);
  check('no page errors',result.errors.length===0);
  result.passed=true;
 }catch(error){result.failure=error.stack;result.state=await page.evaluate(()=>({url:location.href,shell:window.PortalCitizenShell?.diagnostics(),notice:document.querySelector('.citizen-route-notice')?.textContent})).catch(()=>null);await page.screenshot({path:path.join(output,id+'-failure.png')}).catch(()=>{});}
 finally{result.reads=reads;result.writes=writes;await context.close();results.push(result);console.log(JSON.stringify(result));await fs.writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2));}
}
async function owners(page){await page.evaluate(()=>{window.__owners={document,nav:document.querySelector('.social-mobile-nav'),chat:document.getElementById('portalChatRoot'),pet:PortalPets.runtime};});}
async function continuity(page,check){check('same document, nav, Chat and mascot runtime',await page.evaluate(()=>{const o=__owners;return document===o.document&&document.querySelector('.social-mobile-nav')===o.nav&&document.getElementById('portalChatRoot')===o.chat&&PortalPets.runtime===o.pet&&document.querySelectorAll('.social-mobile-nav').length===1&&document.querySelectorAll('#portalChatRoot').length===1;}));}
async function startTrace(page){
 if(process.env.RETAINED_TRACE!=='1')return null;
 const session=await page.context().newCDPSession(page);
 await session.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.stack',transferMode:'ReturnAsStream'});
 return session;
}
async function finishTrace(session,label){
 if(!session)return;
 const done=new Promise(resolve=>session.once('Tracing.tracingComplete',resolve));
 await session.send('Tracing.end');const {stream}=await done;let contents='';
 while(true){const part=await session.send('IO.read',{handle:stream});contents+=part.data;if(part.eof)break;}
 await session.send('IO.close',{handle:stream});await session.detach();
 await fs.writeFile(path.join(output,`activation-${label}.trace.json`),contents);
}
try{
 for(const width of [320,360,390,412])for(const theme of ['light','dark'])await run(`prepared-${width}-${theme}`,{width,theme},async({page,audit,result,reads,check})=>{
  await page.goto(server.origin+'/');await ready(page,'/');await owners(page);
  const homeClass=await page.locator('body').getAttribute('class');
  await warm(page);
  // Settle the independent existing idle telemetry owner before measuring
  // route I/O, as the original prewarm regression does. Keep zero script/
  // document/data requests on activation strict; do not filter that owner out.
  await page.waitForFunction(()=>Boolean(window.PortalObservability));
  check('background Citizen does not paint or change Home classes',await page.locator('#socialHome').isVisible()&&await page.locator('body').getAttribute('class')===homeClass);
  check('first data load is complete before ready',reads.includes('/api/council/my')&&reads.includes('/api/council/notifications'));
  await page.evaluate(()=>{
   window.__noticeShown=false;new MutationObserver(()=>{if(!document.querySelector('.citizen-route-notice').hidden)__noticeShown=true;}).observe(document.querySelector('.citizen-route-notice'),{attributes:true});
   window.__preparedStages={};
   document.addEventListener('pointerdown',event=>{if(event.target.closest('a[href="/cidadao/"]'))__preparedStages.pointer=performance.now();},{capture:true});
   addEventListener('portal:citizen-route',event=>{if(event.detail.url==='/cidadao/'){__preparedStages.route=performance.now();performance.mark('citizen-ready-route');}});
   new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1&&node.querySelector('#manifestationList')){__preparedStages.mounted=performance.now();performance.mark('citizen-ready-dom');}}).observe(document.querySelector('.portal-shell'),{childList:true,subtree:true});
   document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link||new URL(link.href).pathname!=='/cidadao/')return;
    const start=performance.now();__preparedStages.click=start;performance.mark('citizen-ready-click');
    const frame=()=>{
     if(PortalCitizenShell.active().url.pathname!=='/cidadao/')return requestAnimationFrame(frame);
     performance.mark('citizen-ready-raf');const ms=performance.now()-start;
     const action=document.getElementById('openNewManifestation'),r=action.getBoundingClientRect();
     window.__preparedPaint={ms,heading:document.querySelector('.portal-hero h2').textContent,headingFont:getComputedStyle(document.querySelector('.portal-hero h2')).fontSize,
      actionReady:!action.disabled&&!action.closest('[inert]')&&action.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)),
      navStable:__owners.nav===document.querySelector('.social-mobile-nav')&&__owners.nav.getBoundingClientRect().height>0,
      stages:{...__preparedStages},runningAnimations:document.getAnimations().filter(a=>a.playState==='running').map(a=>({name:a.animationName||a.transitionProperty,target:a.effect?.target?.id||a.effect?.target?.className,duration:a.effect?.getTiming().duration}))};
    };requestAnimationFrame(frame);
   },{capture:true});
  });
  const assets=audit.resources.length,docs=audit.documents.length,readCount=reads.length;
  const trace=await startTrace(page);
  const timingLabel=`${width}-${theme}-${process.env.RETAINED_MOTION||'reduce'}`;
  const profiler=process.env.RETAINED_PROFILE==='1'?await page.context().newCDPSession(page):null;
  if(profiler){await profiler.send('Profiler.enable');await profiler.send('Profiler.start');}
  const started=Date.now();await page.locator('a[href="/cidadao/"]').first().click();await area(page,'/cidadao/');result.preparedTapMs=Date.now()-started;
  if(profiler)await fs.writeFile(path.join(output,`activation-${timingLabel}.cpuprofile`),JSON.stringify((await profiler.send('Profiler.stop')).profile));
  await finishTrace(trace,timingLabel);
  result.firstPreparedFrame=await page.evaluate(()=>__preparedPaint);
  check('first prepared animation frame has final copy and proportions',result.firstPreparedFrame.heading==='Canal do Cidadão'&&result.firstPreparedFrame.headingFont==='24px');
  check('first prepared frame is interactive with the original visible bar',result.firstPreparedFrame.actionReady&&result.firstPreparedFrame.navStable);
  check('same Home address',new URL(page.url()).pathname==='/'&&!new URL(page.url()).search);
  check('no prepared loading notice',await page.evaluate(()=>!__noticeShown));
  result.activationResources=audit.resources.slice(assets);
  check('prepared switch needs no document, script or initial data',audit.documents.length===docs&&reads.length===readCount&&!audit.resources.slice(assets).some(u=>/^\/js\/|^\/cidadao\//.test(u)));
  check('new presentation and data on first frame',await page.locator('.portal-hero h2').textContent()==='Canal do Cidadão'&&await page.locator('#manifestationList').textContent().then(s=>s.includes('Assunto fictício 1')));
  await page.locator('[data-tutorial-start]').waitFor({state:'attached'});
  check('PR663 compact help retained',await page.locator('.tutorial-help-label').textContent()==='Ajuda'&&await page.locator('[data-tutorial-start]').textContent()==='Iniciar tutorial');
  await page.screenshot({path:path.join(output,`${width}-${theme}-panel.png`)});
  await page.locator('#openNewManifestation').click();
  check('native interaction feedback uses internal Citizen route',await page.locator('#openNewManifestation').evaluate(n=>n.classList.contains('portal-interaction-target')));
  await page.locator('input[value=sugestao]').check();
  await page.locator('#manifestationSubject').fill('Rascunho fictício sem envio');
  await page.locator('#manifestationDescription').fill('Texto fictício preservado na alternância.');
  await page.locator('input[name=manifestationPrivacy][value=identificada]').check();
  await page.locator('#manifestationFiles').setInputFiles({name:'sintetico.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nfixture only')});
  await page.evaluate(()=>{__owners.form=document.getElementById('newManifestationForm');__owners.file=document.getElementById('manifestationFiles').files[0];});
  await page.screenshot({path:path.join(output,`${width}-${theme}-draft.png`)});
  // The native modal covers page controls. Use browser Back/Forward while it
  // is open, without forcing clicks through the existing focus/overlay guard.
  await page.goBack();await area(page,'/');
  await page.goForward();await area(page,'/cidadao/');
  check('open draft, file object, category and privacy retained',await page.evaluate(()=>document.getElementById('newManifestationForm')===__owners.form&&document.getElementById('newManifestationModal').classList.contains('open')&&document.getElementById('manifestationSubject').value==='Rascunho fictício sem envio'&&document.getElementById('manifestationFiles').files[0]===__owners.file&&document.querySelector('input[value=sugestao]').checked&&document.querySelector('input[value=identificada]').checked));
  await page.locator('#newManifestationModal .citizen-modal-close').click();
  await page.locator('.citizen-mobile-tab[data-tab=notifications]').click();await go(page,'/perfil/');await go(page,'/cidadao/');
  check('selected Citizen tab retained',await page.locator('body').getAttribute('data-citizen-tab')==='notifications');
  check('no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));
  await continuity(page,check);check('one navigation document',audit.documents.length===1);
 });
 await run('first-load-slow-and-cancel',{},async({page,context,check})=>{
  let release;const held=new Promise(r=>{release=r;});let started=false;
  await context.route('**/api/council/my',async route=>{started=true;await held;await route.fallback();});
  await page.goto(server.origin+'/');await ready(page,'/');await owners(page);
  await page.waitForFunction(()=>PortalCitizenShell.diagnostics().prepared.includes('/cidadao/'));
  check('Home usable before Citizen data',await page.locator('#socialHome').isVisible());
  await page.locator('a[href="/cidadao/"]').first().click();
  await page.waitForFunction(()=>document.querySelector('.citizen-route-notice').textContent==='Carregando…'&&!document.querySelector('.citizen-route-notice').hidden);
  check('no ready claim before first response',!await page.evaluate(()=>PortalCitizenShell.diagnostics().ready.includes('/cidadao/')));
  await page.locator('.social-mobile-nav a[href="/amigos/"]').click();await area(page,'/amigos/');
  check('can navigate away while data held',started);
  release();await warm(page);await go(page,'/cidadao/');await continuity(page,check);
 });
 for(const outcome of ['success','error'])await run('cancel-active-route-'+outcome,{},async({page,context,check})=>{
  let release;const held=new Promise(r=>{release=r;});
  await context.route('**/api/council/my',async route=>{
   await held;
   if(outcome==='error')await route.fulfill({status:503,json:{error:'Synthetic delayed failure'}}).catch(()=>{});
   else await route.fallback().catch(()=>{});
  });
  try{
   await page.goto(server.origin+'/');await ready(page,'/');
   await page.waitForFunction(()=>{const d=PortalCitizenShell.diagnostics();return d.prepared.includes('/cidadao/')&&d.ready.includes('/perfil/');});
   await go(page,'/perfil/');await go(page,'/');await owners(page);
   const entries=await page.evaluate(()=>{window.__cancelHome=PortalCitizenShell.active();return history.length;});
   await page.locator('a[href="/cidadao/"]').first().click();
   await page.waitForFunction(()=>PortalCitizenShell.diagnostics().navigating);
   await page.locator('.social-mobile-nav a[href="/"]').click();await area(page,'/');
   check('cancelling to active Home creates no history entry',await page.evaluate(()=>history.length)===entries);
   check('cancellation retains the same active Home',await page.evaluate(()=>PortalCitizenShell.active()===__cancelHome));
   check('completed cancellation clears the loading notice',await page.locator('.citizen-route-notice').evaluate(n=>n.hidden&&n.getAttribute('aria-busy')==='false'));
   release();await warm(page);
   check('delayed preparation leaves Home active',await page.evaluate(()=>PortalCitizenShell.diagnostics().active)==='/');
   await page.evaluate(()=>history.back());await area(page,'/perfil/');
   await page.evaluate(()=>history.forward());await area(page,'/');
   check('Back and Forward traverse the previous distinct route',await page.evaluate(()=>history.length)===entries);
   await continuity(page,check);
  }finally{release();}
 });
 await run('prewarm-denied',{},async({page,context,audit,reads,check})=>{
  await context.route('**/api/auth/me',route=>route.fulfill({status:403,json:{error:'Synthetic denied account revalidation'}}));
  await page.goto(server.origin+'/');await ready(page,'/');
  await page.waitForFunction(()=>{const s=PortalCitizenShell.diagnostics();return s.ready.includes('/notificacoes/')&&!s.prewarming;});
  check('failed account revalidation prevents private Citizen preparation',reads.length===0&&!audit.resources.some(p=>p.startsWith('/cidadao/'))&&!await page.evaluate(()=>PortalCitizenShell.diagnostics().ready.includes('/cidadao/')));
  check('denied background keeps Home usable',await page.locator('#socialHome').isVisible());
 });
 await run('logout-during-first-data-load',{},async({page,context,check,result})=>{
  let release,resolveAbort;const held=new Promise(r=>{release=r;}),aborted=new Promise(r=>{resolveAbort=r;}),evidence={};
  await page.exposeFunction('__recordRetainedReadAbort',value=>{Object.assign(evidence,value);if(evidence.signalAborted&&evidence.readRejected)resolveAbort();});
  await page.addInitScript(()=>{
   const nativeFetch=window.fetch;
   window.fetch=function(...args){
    const pending=Reflect.apply(nativeFetch,this,args);
    if(new URL(args[0]?.url||args[0],location.href).pathname==='/api/council/my'){
     const report=value=>{void window.__recordRetainedReadAbort(value).catch(()=>{});};
     const signal=args[1]?.signal||args[0]?.signal;
     signal?.addEventListener('abort',()=>report({signalAborted:true}),{once:true});
     pending.catch(error=>{if(error.name==='AbortError')report({readRejected:true});});
    }
    return pending;
   };
  });
  await context.route('**/api/council/my',async route=>{await held;await route.fallback();});
  let timer;
  try{
   const started=page.waitForRequest(request=>new URL(request.url()).pathname==='/api/council/my');
   await page.goto(server.origin+'/');await ready(page,'/');
   await started;
   await page.evaluate(()=>{void RegulationAuth.logout();});await page.waitForURL('**/login/');
   release();
   // A paused Playwright route need not emit requestfailed on navigation.
   // Require the actual fetch signal and AbortError instead of that proxy event.
   await Promise.race([aborted,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Private read must receive an aborted signal and reject with AbortError')),9000);})]);
   result.abortEvidence=evidence;
   check('private in-flight read aborted and old panel cannot enter Login',evidence.signalAborted&&evidence.readRejected&&await page.locator('#manifestationList').count()===0);
  }finally{clearTimeout(timer);release();}
 });
 await run('resource-failure-and-retry',{},async({page,context,check})=>{
  let failController=true;
  await context.route('**/js/citizen.js*',route=>failController?route.abort('internetdisconnected'):route.fallback());
  await page.goto(server.origin+'/');await ready(page,'/');await owners(page);
  await page.waitForFunction(()=>{const s=PortalCitizenShell.diagnostics();return s.ready.includes('/notificacoes/')&&!s.prewarming;});
  await page.locator('a[href="/cidadao/"]').first().click();await page.locator('.citizen-route-notice button').waitFor();
  check('controller failure leaves current Home and explicit retry',await page.locator('#socialHome').isVisible());
  failController=false;await page.locator('.citizen-route-notice button').click();await area(page,'/cidadao/');
  await continuity(page,check);
 });
 await run('revalidation-detail-offline',{},async({page,context,check,rev,fail,recover})=>{
  await page.goto(server.origin+'/');await ready(page,'/');await warm(page);await go(page,'/cidadao/');
  await page.locator('[data-protocol="CMS-2026-000001"]').first().click();await page.locator('#detailContent:not([hidden])').waitFor();
  await page.locator('#attachmentFile').setInputFiles({name:'acompanhamento-sintetico.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nsynthetic followup')});
  await page.evaluate(()=>{window.__followupFile=document.getElementById('attachmentFile').files[0];});
  const detail=await page.locator('#manifestationDetailModal').elementHandle();await go(page,'/');rev();
  await page.evaluate(()=>{const now=Date.now();Date.now=()=>now+31000;});await go(page,'/cidadao/');
  await page.waitForFunction(()=>document.getElementById('messageThread').textContent.includes('Resposta fictícia 2'));
  check('same open detail with fresh response and history',await detail.evaluate(n=>n.isConnected&&n.classList.contains('open'))&&await page.locator('#timeline').textContent().then(s=>s.includes('Histórico fictício')));
  check('local followup attachment retained during revalidation',await page.evaluate(()=>document.getElementById('attachmentFile').files[0]===__followupFile&&document.getElementById('detailAttachmentSelection').textContent.includes('acompanhamento-sintetico.pdf')));
  await page.locator('#manifestationDetailModal .citizen-modal-close').click();await go(page,'/');
  fail();await context.setOffline(true);await page.evaluate(()=>{const now=Date.now();Date.now=()=>now+31000;});await go(page,'/cidadao/');
  await page.locator('#citizenDataStatus button').waitFor();check('retained data has explicit stale/retry state',await page.locator('#manifestationList').textContent().then(s=>s.includes('Assunto fictício 2')));
  await go(page,'/amigos/');recover();await context.setOffline(false);await go(page,'/cidadao/');
  await page.locator('#citizenDataStatus').waitFor({state:'hidden'});
 });
 for(const action of ['logout','replace'])await run('session-'+action,{},async({page,context,audit,check,result})=>{
  await page.goto(server.origin+'/');await ready(page,'/');await warm(page);await go(page,'/cidadao/');
  await page.locator('#openNewManifestation').click();await page.locator('input[value=sugestao]').check();await page.locator('#manifestationSubject').fill('Rascunho privado fictício');
  await page.locator('#manifestationFiles').setInputFiles({name:'privado-sintetico.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nsynthetic private draft')});
  await page.exposeFunction('__recordDisposal',value=>{result.disposal=value;});
  await page.evaluate(()=>{
   const old=PortalCitizenShell.active();
   addEventListener('portal:session-cleared',()=>{void window.__recordDisposal({ended:PortalCitizenShell.diagnostics().ended,detached:!old.root.isConnected,emptyFields:[...old.root.querySelectorAll('input,textarea')].every(n=>!n.value)});});
  });
  try{
   if(action==='logout')await page.evaluate(()=>{void RegulationAuth.logout();});
   else {const other={...user,id:'synthetic-other',username:'synthetic.other'};audit.user=other;await page.evaluate(other=>{sessionStorage.setItem('regulacao.portal.user',JSON.stringify(other));sessionStorage.setItem('regulacao.portal.session','synthetic-other-token');dispatchEvent(new CustomEvent('portal:session-ready',{detail:{user:other}}));},other);}
  }catch(error){if(!error.message.includes('Execution context was destroyed'))throw error;}
  await page.waitForURL(server.origin+(action==='logout'?'/login/':'/'));
  check('private old root detached and fields cleared before navigation',result.disposal?.ended&&result.disposal.detached&&result.disposal.emptyFields);
 });
 for(const width of [390,1440])await run('direct-'+width,{width},async({page,check})=>{
  await page.goto(server.origin+'/cidadao/');await ready(page,'/cidadao/');
  check('direct Canal data loads',await page.locator('#manifestationList').textContent().then(s=>s.includes('Assunto fictício')));
  if(width<900){check('direct uses same canonical shell address',new URL(page.url()).pathname==='/');await go(page,'/');await go(page,'/cidadao/');}
  else check('desktop native path preserved',new URL(page.url()).pathname==='/cidadao/'&&!await page.evaluate(()=>Boolean(window.PortalCitizenShell)));
  await page.screenshot({path:path.join(output,`${width}-direct.png`)});
  await page.emulateMedia({media:'print'});await page.screenshot({path:path.join(output,`${width}-print.png`)});
  check('print leaves mobile presentation and restores native path',new URL(page.url()).pathname==='/cidadao/'&&!await page.evaluate(()=>document.body.classList.contains('citizen-mobile-shell')||document.body.classList.contains('citizen-mobile-presentation')));
 });
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
if(results.some(r=>!r.passed))process.exitCode=1;
