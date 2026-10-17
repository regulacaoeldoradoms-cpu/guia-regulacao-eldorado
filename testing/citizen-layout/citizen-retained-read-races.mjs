// Real retained controllers; only intercepted synthetic mutations and reads.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'.local/citizen-retained-read-races');
await fs.mkdir(out,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const protocol='CMS-2026-000001',createdAt='2026-10-16T10:00:00Z';
const item={protocol,subject:'Assunto anterior fictício',description:'Descrição inteiramente sintética',type:'sugestao',privacyMode:'sigilosa',status:'recebida',createdAt};
const added={...item,protocol:'CMS-2026-000002',subject:'Manifestação nova fictícia'};
const results=[];
try{
 for(const kind of ['notifications','manifestations','reply','attachment'])for(const outcome of ['success','error']){
  const id=kind+'-'+outcome;if(process.env.RACE_CASES&&!process.env.RACE_CASES.split(',').includes(id))continue;
  const result={id,errors:[],writes:[]},{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true},server.origin,result);
  let stage=1,armed=false,release,reached;
  const held=new Promise(r=>{release=r;}),started=new Promise(r=>{reached=r;});
  if(process.env.RACE_BASELINE==='1')for(const file of ['citizen.js','citizen-mobile-app.js']){
   const body=execFileSync('git',['show','b9fe86f:js/'+file],{cwd:root,encoding:'utf8'});
   await context.route('**/js/'+file+'*',route=>route.fulfill({contentType:'text/javascript',body}));
  }
  const payload=(pathname,revision)=>pathname==='/api/council/my'?{manifestations:revision===2?[item,added]:[item]}
   :pathname==='/api/council/notifications'?{notifications:[{id:1,protocol,title:'Aviso fictício',createdAt,readAt:revision===2?createdAt:null}]}
   :{manifestation:item,messages:[{senderType:'council',body:revision===2?'Resposta nova fictícia':'Resposta anterior fictícia',createdAt}],events:[{type:'created',detail:revision===2?'Histórico novo fictício':'Histórico anterior fictício',createdAt}],attachments:revision===2?[{id:'synthetic-file',displayName:'novo-anexo-sintetico.pdf'}]:[]};
  await context.route('**/api/council/**',async route=>{
   const request=route.request(),pathname=new URL(request.url()).pathname;
   if(request.method()!=='GET'){
    result.writes.push({method:request.method(),pathname});stage=2;
    return route.fulfill({json:pathname==='/api/council/manifestations'?{manifestation:added}:{ok:true}});
   }
   const target=kind==='notifications'?'/api/council/notifications':kind==='manifestations'?'/api/council/my':'/api/council/manifestations/'+protocol;
   if(armed&&pathname===target){armed=false;const previous=payload(pathname,stage);reached();await held;return route.fulfill(outcome==='error'?{status:503,json:{error:'Falha anterior fictícia'}}:{json:previous}).catch(()=>{});}
   return route.fulfill({json:payload(pathname,stage)});
  });
  try{
   await page.goto(server.origin+'/');await ready(page,'/');
   await page.waitForFunction(()=>PortalCitizenShell.diagnostics().ready.includes('/cidadao/')&&!PortalCitizenShell.diagnostics().prewarming);
   await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));
   if(kind==='notifications')await page.locator('.citizen-mobile-tab[data-tab=notifications]').click();
   if(kind==='reply'||kind==='attachment'){await page.locator('[data-protocol="'+protocol+'"]').first().click();await page.locator('#detailContent:not([hidden])').waitFor();}
   armed=true;
   const refreshing=page.evaluate(()=>PortalCitizenShell.active().controllers.find(c=>c.revalidate).revalidate({force:true}));
   await started;
   if(kind==='notifications'){
    await page.locator('#markNotificationsRead').click();
    await page.waitForFunction(()=>document.querySelectorAll('#notificationList .notification').length===1&&!document.querySelector('#notificationList .unread'));
   }else if(kind==='manifestations'){
    await page.locator('#openNewManifestation').click();await page.locator('input[value=sugestao]').check();
    await page.locator('#manifestationSubject').fill(added.subject);await page.locator('#manifestationDescription').fill('Relato exclusivamente fictício para o teste de concorrência.');
    await page.locator('#manifestationConfirm').check();await page.locator('#submitManifestation').click();
    await page.waitForFunction(()=>document.getElementById('manifestationList').textContent.includes('Manifestação nova fictícia'));
   }else if(kind==='reply'){
    await page.locator('#replyText').fill('Resposta nova fictícia');await page.locator('#replyButton').click();
    await page.waitForFunction(()=>document.getElementById('messageThread').textContent.includes('Resposta nova fictícia'));
   }else{
    await page.locator('#attachmentFile').setInputFiles({name:'novo-anexo-sintetico.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nsynthetic')});
    await page.locator('#uploadAttachment').click();await page.waitForFunction(()=>document.getElementById('attachmentList').textContent.includes('novo-anexo-sintetico.pdf'));
   }
   release();await refreshing;
   if(kind==='notifications'){assert.equal(await page.locator('#notificationList .notification').count(),1);assert.equal(await page.locator('#notificationList .unread').count(),0);}
   if(kind==='manifestations'){assert.match(await page.locator('#manifestationList').textContent(),/Manifestação nova fictícia/);assert(await page.locator('#firebaseNotice').isHidden());}
   if(kind==='reply'){assert.match(await page.locator('#messageThread').textContent(),/Resposta nova fictícia/);assert.match(await page.locator('#timeline').textContent(),/Histórico novo fictício/);}
   if(kind==='attachment')assert.match(await page.locator('#attachmentList').textContent(),/novo-anexo-sintetico.pdf/);
   if(kind==='reply'||kind==='attachment')assert(await page.locator('#detailLoading').isHidden());
   assert(await page.locator('#citizenDataStatus').isHidden(),'Superseded refresh follows the latest read outcome');
   const expectedMutation={method:kind==='notifications'?'PATCH':'POST',pathname:kind==='notifications'?'/api/council/notifications':kind==='manifestations'?'/api/council/manifestations':'/api/council/manifestations/'+protocol+(kind==='reply'?'/messages':'/attachments')};
   assert.deepEqual(result.writes,[expectedMutation],'Exactly the intended synthetic mutation, with its original method and path');
   assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
   result.passed=true;
  }catch(error){result.failure=error.stack;throw error;}
  finally{release();await context.close();results.push(result);console.log(JSON.stringify(result));await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
