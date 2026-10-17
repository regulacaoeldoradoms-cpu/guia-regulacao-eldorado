// Security settings change in another retained area; all traffic is synthetic.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium,user}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'.local/citizen-retained-security-race');
await fs.mkdir(out,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const results=[];
const within=async(label,pending)=>{let timer;try{return await Promise.race([pending,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Security fixture timed out: '+label)),15000);})]);}finally{clearTimeout(timer);}};
try{
 for(const timing of ['after-return','while-away'])for(const outcome of ['success','error']){
  const id=timing+'-'+outcome;if(process.env.SECURITY_RACE_CASES&&!process.env.SECURITY_RACE_CASES.split(',').includes(id))continue;
  const result={id,errors:[],writes:[]},{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true,user:{...user,emailVerified:true,accountLevel:'prata',strongAuthEnabled:false,mfaEnabled:false}},server.origin,result);
  let changed=false,armed=false,release,reached,readsAfterChange=0;
  const held=new Promise(r=>{release=r;}),started=new Promise(r=>{reached=r;});
  if(process.env.SECURITY_RACE_BASELINE==='1'){
   const body=execFileSync('git',['show','009271d:js/citizen.js'],{cwd:root,encoding:'utf8'});
   await context.route('**/js/citizen.js*',r=>r.fulfill({contentType:'text/javascript',body}));
  }
  if(process.env.ACCOUNT_LEVEL_BASELINE==='1'){
   const body=execFileSync('git',['show','5fa412b:js/citizen-account-level.js'],{cwd:root,encoding:'utf8'});
   await context.route('**/js/citizen-account-level.js*',r=>r.fulfill({contentType:'text/javascript',body}));
  }
  const security=()=>({emailVerified:!changed,email:changed?'new@example.invalid':'old@example.invalid',privacyMode:changed?'anonima':'sigilosa',firebaseReady:true});
  await context.route('**/api/auth/security',async route=>{
   const request=route.request();
   if(request.method()==='PATCH'){
    assert.equal(request.postDataJSON().email,'new@example.invalid');changed=true;
    audit.user={...audit.user,emailVerified:false,accountLevel:'bronze',privacyMode:'anonima'};result.writes.push({method:'PATCH',pathname:'/api/auth/security'});
    return route.fulfill({json:{security:security()}});
   }
   assert.equal(request.method(),'GET');if(changed)readsAfterChange++;
   if(armed){armed=false;const previous=security();reached();await held;return route.fulfill(outcome==='error'?{status:503,json:{error:'Falha anterior fictícia'}}:{json:{security:previous}}).catch(()=>{});}
   return route.fulfill({json:{security:security()}});
  });
  try{
   await page.goto(server.origin+'/');await ready(page,'/');
   await page.waitForFunction(()=>PortalCitizenShell.diagnostics().ready.includes('/cidadao/')&&!PortalCitizenShell.diagnostics().prewarming);
   await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));
   assert.equal(await page.locator('#accountLevelBadge').textContent(),'Conta Prata');
   await page.locator('#openNewManifestation').click();await page.locator('input[value=sugestao]').check();
   await page.locator('#manifestationSubject').fill('Rascunho sintético preservado');
   await page.locator('#newManifestationModal [data-close-modal]').first().click();
   await page.evaluate(()=>{window.__securityCitizen=PortalCitizenShell.active();});armed=true;
   const refreshing=page.evaluate(()=>PortalCitizenShell.active().controllers.find(c=>c.revalidate).revalidate({force:true}));
   await within('old security read',started);
   await within('open Security',page.evaluate(()=>PortalCitizenShell.navigate(new URL('/seguranca/',location.href))));
   await page.locator('#securityEmail').fill('new@example.invalid');
   await page.locator('#securityEmailForm button[type=submit]').click();
   await page.waitForFunction(()=>document.getElementById('securityStatus')?.textContent.includes('E-mail salvo'));
   if(timing==='while-away'){release();await refreshing;}
   await within('return to Citizen',page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href))));
   result.stage='privacy after confirmed security change';
   await page.waitForFunction(()=>document.querySelector('input[name=manifestationPrivacy][value=anonima]')&&!document.querySelector('input[name=manifestationPrivacy][value=sigilosa]'));
   result.stage='account level after confirmed security change';
   await page.waitForFunction(()=>document.getElementById('accountLevelBadge')?.textContent==='Conta Bronze');
   assert.equal(await page.locator('#accountLevelBadge').textContent(),'Conta Bronze');
   assert.match(await page.locator('#accountEvolutionNotice').textContent(),/Bronze/);
   assert.match(await page.locator('#accountEvolutionNotice').textContent(),/Sem e-mail verificado/);
   release();await refreshing;
   await page.waitForFunction(()=>document.getElementById('citizenDataStatus').hidden);
   assert(readsAfterChange>0,'Activation requires a security read after the confirmed change');
   assert(await page.evaluate(()=>PortalCitizenShell.active()===__securityCitizen));
   assert.equal(await page.locator('#manifestationSubject').inputValue(),'Rascunho sintético preservado');
   assert.equal(await page.locator('input[name=manifestationPrivacy][value=sigilosa]').count(),0);
   assert.deepEqual(result.writes,[{method:'PATCH',pathname:'/api/auth/security'}]);
   assert(!audit.apiCalls.some(x=>/^(POST|PATCH|PUT|DELETE) \/api\/council\//.test(x)));
   assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);result.passed=true;
  }catch(error){result.failure=error.stack;throw error;}
  finally{release();await context.close();results.push(result);console.log(JSON.stringify(result));await fs.writeFile(path.join(out,process.env.SECURITY_RACE_BASELINE==='1'?'baseline.json':process.env.ACCOUNT_LEVEL_BASELINE==='1'?'level-baseline.json':'results.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>{server.server.close(r);server.server.closeAllConnections();});}
