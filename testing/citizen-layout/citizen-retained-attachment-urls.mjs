// Real native Blob URLs, a fictitious intercepted PDF and manual timer expiry.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'.local/citizen-retained-attachment-urls'+(process.env.ATTACHMENT_URL_BASELINE?'-baseline':''));
await fs.mkdir(out,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const protocol='CMS-2026-000001',item={protocol,type:'sugestao',subject:'Protocolo fictício',description:'Documento sem dados pessoais',privacyMode:'sigilosa',status:'recebida',createdAt:'2026-10-16T10:00:00Z'},results=[];
try{
 for(const phase of ['expiry-active','expiry-away','dispose','session-logout']){
  if(process.env.ATTACHMENT_URL_CASES&&!process.env.ATTACHMENT_URL_CASES.split(',').includes(phase))continue;
  const result={phase,errors:[],writes:[]},{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true},server.origin,result);
  if(process.env.ATTACHMENT_URL_BASELINE){const body=execFileSync('git',['show','dd5364a:js/citizen.js'],{cwd:root,encoding:'utf8'});await context.route('**/js/citizen.js*',route=>route.fulfill({contentType:'text/javascript',body}));}
  await context.addInitScript(()=>{
   const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL),set=window.setTimeout.bind(window),clear=window.clearTimeout.bind(window);
   window.__attachmentUrls={created:[],revoked:[],opened:[],timers:[]};
   URL.createObjectURL=blob=>{const url=create(blob);if(blob.type==='application/pdf')__attachmentUrls.created.push(url);return url;};
   URL.revokeObjectURL=url=>{if(__attachmentUrls.created.includes(url))__attachmentUrls.revoked.push(url);revoke(url);};
   window.open=url=>{__attachmentUrls.opened.push(url);return null;};
   window.setTimeout=(fn,delay,...args)=>{const id=set(fn,delay,...args);if(delay===60000&&new Error().stack.includes('/js/citizen.js'))__attachmentUrls.timers.push({id,fn,args});return id;};
   window.__expireAttachmentLease=()=>{for(const t of __attachmentUrls.timers){clear(t.id);t.fn(...t.args);}};
  });
  await context.route('**/api/council/**',route=>{
   const request=route.request(),pathname=new URL(request.url()).pathname;
   if(request.method()!=='GET'){result.writes.push({method:request.method(),pathname});return route.fulfill({status:405,json:{error:'No synthetic writes allowed'}});}
   if(pathname.endsWith('/attachments/synthetic-file'))return route.fulfill({contentType:'application/pdf',body:'%PDF-1.4\nFictitious attachment; no personal data.'});
   const json=pathname==='/api/council/my'?{manifestations:[item]}:pathname==='/api/council/notifications'?{notifications:[]}:{manifestation:item,messages:[],events:[],attachments:[{id:'synthetic-file',displayName:'ficticio.pdf'}]};
   return route.fulfill({json});
  });
  try{
   await page.goto(server.origin+'/');await ready(page,'/');
   await page.waitForFunction(()=>PortalCitizenShell.diagnostics().ready.includes('/cidadao/')&&!PortalCitizenShell.diagnostics().prewarming);
   await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));
   await page.locator('[data-protocol="'+protocol+'"]').first().click();
   await page.locator('#attachmentList [data-attachment]').click();
   await page.waitForFunction(()=>__attachmentUrls.created.length===1&&__attachmentUrls.timers.length===1);
   if(phase==='dispose'){
    await page.locator('#attachmentList [data-attachment]').click();
    await page.waitForFunction(()=>__attachmentUrls.created.length===2&&__attachmentUrls.timers.length===2);
   }
   if(phase==='expiry-away'){
    await page.evaluate(()=>history.back());
    await page.waitForFunction(()=>PortalCitizenShell.diagnostics().active==='/'&&!PortalCitizenShell.diagnostics().navigating);
   }
   let evidence;
   if(phase==='session-logout'){
    await page.exposeFunction('__recordAttachmentDisposal',value=>{result.disposal=value;});
    await page.evaluate(()=>{
     addEventListener('portal:session-cleared',()=>{const {created,revoked,opened}=__attachmentUrls;void __recordAttachmentDisposal({created,revoked,opened});},{once:true});
     void RegulationAuth.logout();
    });
    await page.waitForURL(server.origin+'/login/');evidence=result.disposal;
    assert(evidence,'Capture native revocations during session disposal, before navigation');
   }else{
    if(phase==='dispose')await page.evaluate(()=>PortalCitizenShell.active().dispose());
    else await page.evaluate(()=>__expireAttachmentLease());
    // Observe native revocation directly; the page CSP blocks fetch(blob:).
    evidence=await page.evaluate(()=>{
    const {created,revoked,opened}=__attachmentUrls;
    return {created,revoked,opened};
    });
   }
   assert.deepEqual(evidence.revoked,evidence.created,'Native Blob URL must be revoked after expiry or area disposal');
   assert.deepEqual(evidence.opened,evidence.created);
   assert.deepEqual(result.writes,[]);assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
   result.passed=true;result.nativeBlobUrlRevoked=true;
  }catch(error){result.failure=error.stack;result.state=await page.evaluate(()=>({urlCounts:{created:__attachmentUrls?.created.length,opened:__attachmentUrls?.opened.length,timers:__attachmentUrls?.timers.length},attachments:document.getElementById('attachmentList')?.innerHTML})).catch(()=>null);throw error;}
  finally{await context.close();results.push(result);console.log(JSON.stringify(result));await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
