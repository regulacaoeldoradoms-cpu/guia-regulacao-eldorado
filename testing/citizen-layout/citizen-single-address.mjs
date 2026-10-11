import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'), output=path.join(root,'.local/citizen-single-address');
await fs.mkdir(output,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const results=[];
const prepared=page=>page.waitForFunction(()=>{const s=window.PortalCitizenShell?.diagnostics();return s&&!s.navigating&&!s.prewarming&&['/','/amigos/','/perfil/','/mascotes/'].every(p=>s.ready.includes(p));});
const area=async(page,route)=>page.waitForFunction(route=>window.PortalCitizenShell?.active().url.pathname+window.PortalCitizenShell?.active().url.search===route&&!window.PortalCitizenShell.diagnostics().navigating,route);
async function run(id,width,entry,auth,exercise){
 if(process.env.CASES&&!process.env.CASES.split(',').includes(id))return;
 const result={id,checks:[],errors:[]},{page,context,audit}=await newPage(browser,{width,theme:id.includes('light')?'light':'dark',seedOnce:true},server.origin,result);
 const check=(name,value)=>{assert.ok(value,name);result.checks.push(name);};
 try{
  if(auth==='late'){
   const source=await fs.readFile(path.join(root,'js/auth-client.js'),'utf8');
   await page.route('**/js/auth-client.js*',r=>r.fulfill({contentType:'text/javascript',body:"if(!sessionStorage.getItem('__lateFixture')){sessionStorage.removeItem('regulacao.portal.user');sessionStorage.setItem('__lateFixture','1');}\n"+source}));
   await page.route('**/api/auth/me',async r=>{await new Promise(z=>setTimeout(z,700));await r.fallback();});
  }
  await page.goto(server.origin+entry,{waitUntil:'domcontentloaded'});
  await ready(page,entry);
  await exercise(page,context,audit,check,result);
  check('only mapped synthetic APIs',!audit.unmappedApiCalls.length);
  check('no page errors',!result.errors.length);
 }catch(e){result.failure=e.stack;result.state=await page.evaluate(()=>({href:location.href,shell:window.PortalCitizenShell?.diagnostics(),notice:document.querySelector('.citizen-route-notice')?.textContent})).catch(()=>null);}
 finally{await context.close();results.push(result);console.log(JSON.stringify(result));await fs.writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2));}
}
async function owners(page){await page.evaluate(()=>{
 window.__owners={document,bar:document.querySelector('.social-mobile-nav'),chat:document.getElementById('portalChatRoot'),icon:document.querySelector('#portalChatLauncher svg'),pet:window.PortalPets.runtime,removed:0,empty:0,track:true};
 new MutationObserver(records=>{for(const r of records)for(const n of r.removedNodes)if(n===window.__owners.bar||n.contains?.(window.__owners.bar))window.__owners.removed++;}).observe(document.body,{childList:true,subtree:true});
 const frame=()=>{if(!window.__owners.track)return;if(!document.querySelector('.social-mobile-nav'))window.__owners.empty++;requestAnimationFrame(frame);};requestAnimationFrame(frame);
 document.addEventListener('click',e=>{const link=e.target.closest('.social-mobile-nav a[href]');if(!e.isTrusted||!link)return;const route=new URL(link.href).pathname,started=performance.now();window.__paintMs=null;const paint=()=>{const s=window.PortalCitizenShell.diagnostics();if(s.active===route&&!s.navigating)requestAnimationFrame(()=>{window.__paintMs=Math.round((performance.now()-started)*10)/10;});else requestAnimationFrame(paint);};requestAnimationFrame(paint);},true);
});}
async function continuity(page,check){check('same document/bar/Chat/SVG/pet; no removed bar or empty animation frames',await page.evaluate(()=>{const o=window.__owners;return o.document===document&&o.bar===document.querySelector('.social-mobile-nav')&&o.chat===document.getElementById('portalChatRoot')&&o.icon===document.querySelector('#portalChatLauncher svg')&&o.pet===window.PortalPets.runtime&&!o.removed&&!o.empty;}));}
try{
 for(const width of [320,390,900])for(const auth of ['cached','late'])await run(`bar-${width}-${auth}`,width,'/',auth,async(page,context,audit,check,result)=>{
  await prepared(page);await page.waitForLoadState('networkidle');await owners(page);const docs=audit.documents.length,resources=audit.resources.length,calls=audit.apiCalls.length;result.clickToPaint=[];
  for(let cycle=0;cycle<3;cycle++)for(const route of ['/amigos/','/perfil/','/mascotes/','/']){
   await page.locator(`.social-mobile-nav a[href="${route}"]`).click();await area(page,route);
   await page.waitForFunction(()=>window.__paintMs!==null);result.clickToPaint.push({route,ms:await page.evaluate(()=>window.__paintMs)});
   check('canonical address after '+route,new URL(page.url()).pathname==='/'&&new URL(page.url()).search==='');
   check('outlined Chat SVG after '+route,await page.evaluate(()=>{const c=getComputedStyle(document.querySelector('#portalChatLauncher svg'));return c.fill==='none'&&c.stroke===c.color&&c.strokeWidth==='1.8px';}));
  }
  await continuity(page,check);check('zero new document requests',audit.documents.length===docs);
  result.laterResources=audit.resources.slice(resources);check('zero route/script requests after preparation',!audit.resources.slice(resources).some(u=>/\/js\/|\/(?:amigos|perfil|mascotes)\/(?:\?|$)/.test(u)));
  check('zero own initial data reads after preparation',!audit.apiCalls.slice(calls).some(u=>/GET \/api\/(?:citizen\/identity|social\/me$|social\/relationships|social\/profiles\/[^/]+\/posts)/.test(u)));
  await context.setOffline(true);await page.locator('.social-mobile-nav a[href="/perfil/"]').click();await area(page,'/perfil/');await continuity(page,check);check('prepared offline switch has no document request',audit.documents.length===docs);
 });
 for(const entry of ['/amigos/','/perfil/','/perfil/?u=fixture.friend','/mascotes/'])await run('legacy-'+entry.replaceAll('/','_'),390,entry,'cached',async(page,context,audit,check)=>{
  await prepared(page);await area(page,entry);check('legacy link restores intended area at Home address',new URL(page.url()).pathname==='/');check('only one initial compatibility redirect',audit.documents.length===2);
  await owners(page);const docs=audit.documents.length;await page.locator('.social-mobile-nav a[href="/amigos/"]').click();await area(page,'/amigos/');await page.locator('.social-mobile-nav a[href="/mascotes/"]').click();await area(page,'/mascotes/');
  await page.goBack();await area(page,'/amigos/');await page.goForward();await area(page,'/mascotes/');await continuity(page,check);check('Back/Forward retain document',audit.documents.length===docs);
  await page.reload({waitUntil:'domcontentloaded'});await ready(page,'/mascotes/');await area(page,'/mascotes/');check('refresh restores area through account-scoped History',new URL(page.url()).pathname==='/'&&audit.documents.length===docs+1);
 });
 await run('account-scoped-history',390,'/','cached',async(page,context,audit,check)=>{await prepared(page);await page.evaluate(()=>history.replaceState({...history.state,__portalCitizenRoute:'/perfil/?u=obsolete.synthetic',__portalCitizenAccount:'obsolete.synthetic'},'', '/'));await page.reload({waitUntil:'domcontentloaded'});await ready(page,'/');await prepared(page);check('mismatched account cannot restore old profile',await page.evaluate(()=>window.PortalCitizenShell.active().url.pathname==='/')&&!audit.apiCalls.some(u=>u.includes('obsolete.synthetic')));});
 for(const width of [901,1440])await run('desktop-'+width,width,'/','cached',async(page,context,audit,check)=>{
  check('desktop has no mobile shell',await page.evaluate(()=>!window.PortalCitizenShell));await page.locator('.social-global-nav a[href="/amigos/"]').click();await page.waitForURL('**/amigos/');check('desktop retains native URL/document navigation',audit.documents.length===2);
 });
 for(const theme of ['light','dark'])await run('chat-controls-'+theme,390,'/','cached',async(page,context,audit,check)=>{
  await prepared(page);await owners(page);const docs=audit.documents.length;
  for(const conversation of [false,true])for(const target of ['/','/amigos/','/mascotes/','/perfil/','avisos']){
   await page.evaluate(()=>window.PortalCitizenShell.navigate(new URL('/mascotes/',location.href)));await area(page,'/mascotes/');
   await page.locator('#portalChatLauncher').click();await page.locator('#portalChatRoot.open').waitFor();
   if(conversation){if(!await page.locator('#portalChatConversationView').evaluate(n=>n.classList.contains('active')))await page.locator('[data-chat-user="fixture.friend"]').first().click();await page.locator('#portalChatConversationView.active').waitFor();await page.locator('#portalChatInput').fill('Rascunho sintético '+target);}
   else if(await page.locator('#portalChatConversationView').evaluate(n=>n.classList.contains('active'))){await page.locator('#portalChatBack').click();await page.locator('#portalChatContactsView.active').waitFor();}
   await page.locator(target==='avisos'?'#socialNotificationTriggerMobile':`.social-mobile-nav a[href="${target}"]`).click();await page.locator('#portalChatRoot.open').waitFor({state:'hidden'});await page.waitForFunction(()=>!history.state?.__portalHomeDirect);
   await area(page,target==='/'||target==='avisos'?'/mascotes/':target);
   if(target==='avisos'){await page.locator('.social-notification-panel:not([hidden])').waitFor();await page.locator('#socialNotificationTriggerMobile').click();}
   await continuity(page,check);check('Chat closes before '+target+' and document retained',audit.documents.length===docs);
   if(conversation){await page.locator('#portalChatLauncher').click();await page.locator('#portalChatConversationView.active').waitFor();check('conversation draft retained for '+target,await page.locator('#portalChatInput').inputValue()==='Rascunho sintético '+target);await page.locator('.social-mobile-nav a[href="/"]').click();await page.locator('#portalChatRoot.open').waitFor({state:'hidden'});await page.waitForFunction(()=>!history.state?.__portalHomeDirect);}
  }
  await page.locator('#portalChatLauncher').click();await page.locator('#portalChatRoot.open').waitFor();await page.evaluate(()=>{for(const p of ['/amigos/','/perfil/','/mascotes/'])document.querySelector(`.social-mobile-nav a[href="${p}"]`).click();});await area(page,'/mascotes/');await page.locator('#portalChatRoot.open').waitFor({state:'hidden'});await continuity(page,check);check('rapid bar intent settles once without reload',audit.documents.length===docs);
  await page.locator('.social-mobile-nav').screenshot({path:path.join(output,'chat-icon-'+theme+'.png')});
 });
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
if(results.some(r=>r.failure))process.exitCode=1;
