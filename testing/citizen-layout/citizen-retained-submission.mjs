// Browser Back during intercepted synthetic sends; never use a live Council.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'.local/citizen-retained-submission'+(process.env.SUBMISSION_BASELINE?'-baseline':''));
await fs.mkdir(out,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const item={protocol:'CMS-2026-000003',type:'sugestao',subject:'Sugestão inteiramente fictícia',description:'Relato fictício para conferir a conclusão após Voltar.',privacyMode:'sigilosa',status:'recebida',createdAt:'2026-10-16T10:00:00Z'},results=[];
try{
 for(const phase of ['post','upload','reload','timer','failure']){
  if(process.env.SUBMISSION_CASES&&!process.env.SUBMISSION_CASES.split(',').includes(phase))continue;
  const result={phase,errors:[],writes:[]},{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true},server.origin,result);
  let created=false,release,reached,heldOnce=false;
  const held=new Promise(r=>{release=r;}),started=new Promise(r=>{reached=r;});
  if(process.env.SUBMISSION_BASELINE){
   const body=execFileSync('git',['show','d7ddfc4:js/citizen.js'],{cwd:root,encoding:'utf8'});
   await context.route('**/js/citizen.js*',route=>route.fulfill({contentType:'text/javascript',body}));
  }
  await context.route('**/api/council/**',async route=>{
   const request=route.request(),pathname=new URL(request.url()).pathname,method=request.method();
   if(method!=='GET')result.writes.push({method,pathname});
   const target=(phase==='post'||phase==='failure')&&method==='POST'&&pathname==='/api/council/manifestations'
    ||phase==='upload'&&method==='POST'&&pathname.endsWith('/attachments')
    ||phase==='reload'&&created&&method==='GET'&&pathname==='/api/council/my';
   if(target&&!heldOnce){heldOnce=true;reached();await held;}
   if(method==='POST'&&pathname==='/api/council/manifestations'){
    if(phase==='failure')return route.fulfill({status:503,json:{error:'Envio fictício indisponível'}}).catch(()=>{});
    created=true;return route.fulfill({json:{manifestation:item}}).catch(()=>{});
   }
   if(method==='POST'&&pathname.endsWith('/attachments'))return route.fulfill({json:{ok:true}}).catch(()=>{});
   if(method!=='GET')return route.fulfill({status:405,json:{error:'Unplanned synthetic mutation'}});
   const json=pathname==='/api/council/my'?{manifestations:created?[item]:[]}:pathname==='/api/council/notifications'?{notifications:[]}:{manifestation:item,messages:[],events:[],attachments:phase==='upload'?[{id:'synthetic-file',displayName:'anexo-ficticio.pdf'}]:[]};
   return route.fulfill({json}).catch(()=>{});
  });
  try{
   await page.goto(server.origin+'/');await ready(page,'/');
   await page.waitForFunction(()=>PortalCitizenShell.diagnostics().ready.includes('/cidadao/')&&!PortalCitizenShell.diagnostics().prewarming);
   await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));
   await page.evaluate(()=>{window.__submittedArea=PortalCitizenShell.active();});
   await page.locator('#openNewManifestation').click();await page.locator('input[value=sugestao]').check();
   await page.locator('#manifestationSubject').fill(item.subject);await page.locator('#manifestationDescription').fill(item.description);
   if(phase==='upload')await page.locator('#manifestationFiles').setInputFiles({name:'anexo-ficticio.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nsynthetic')});
   await page.locator('#manifestationConfirm').check();await page.locator('#submitManifestation').click();
   if(phase==='timer')await page.waitForFunction(()=>!document.querySelector('#newManifestationForm').hasAttribute('aria-busy'));
   else {
    let holdTimer;
    try{await Promise.race([started,new Promise((_,reject)=>{holdTimer=setTimeout(()=>reject(Error('Synthetic hold was not reached')),10000);})]);}
    finally{clearTimeout(holdTimer);}
   }
   await page.evaluate(()=>history.back());
   await page.waitForFunction(()=>PortalCitizenShell.diagnostics().active==='/'&&!PortalCitizenShell.diagnostics().navigating);
   release();
   await page.waitForFunction(()=>!__submittedArea.root.querySelector('#newManifestationForm').hasAttribute('aria-busy'));
   await page.waitForTimeout(950);
   assert.equal(await page.evaluate(()=>PortalCitizenShell.diagnostics().active),'/','Completion must leave Home active');
   await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));
   assert(await page.evaluate(()=>PortalCitizenShell.active()===__submittedArea),'Reuse the submitted area');
   if(phase==='failure'){
    assert(await page.locator('#newManifestationModal.open').isVisible(),'Failed send keeps its form');
    assert.equal(await page.locator('#manifestationSubject').inputValue(),item.subject);
    assert.equal(await page.locator('#manifestationDescription').inputValue(),item.description);
   }else{
    assert.equal(await page.locator('#newManifestationModal').getAttribute('aria-hidden'),'true','Confirmed submission must close compose on return');
    await page.locator('#manifestationDetailModal.open').waitFor();
    await page.waitForFunction(protocol=>document.getElementById('detailProtocol').textContent.includes(protocol),item.protocol);
    assert.equal(await page.locator('#manifestationSubject').inputValue(),'');
   }
   const expected=[{method:'POST',pathname:'/api/council/manifestations'}];
   if(phase==='upload')expected.push({method:'POST',pathname:'/api/council/manifestations/'+item.protocol+'/attachments'});
   assert.deepEqual(result.writes,expected,'Exactly one intended synthetic submission and optional upload');
   assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);result.passed=true;
  }catch(error){result.failure=error.stack;throw error;}
  finally{release();await context.close();results.push(result);console.log(JSON.stringify(result));await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
