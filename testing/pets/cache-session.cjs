const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),base='c10773fba8010bf2f2c8f42433976cefffe64315';
const out=process.env.PETS_CACHE_ARTIFACT_DIR||path.join(__dirname,'artifacts/cache-session');fs.mkdirSync(out,{recursive:true});
let release='old',router,fixture,apiReads=0,mutations=0;
const harness='<!doctype html><html><head><meta charset="utf-8"></head><body>cache harness</body></html>';
const report={scope:'Local loopback, synthetic SQLite and tokens; actual base/new service workers and source assets',checks:[]};
const note=(name,detail)=>{report.checks.push({name,detail});console.log(name,JSON.stringify(detail));};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');res.setHeader('Cache-Control','no-store');
  if(url.pathname==='/harness.html'){res.setHeader('Content-Type','text/html');res.end(harness);return;}
  if(url.pathname==='/js/auth-config.js'){res.setHeader('Content-Type','text/javascript');res.end('window.REGULATION_AUTH_CONFIG={endpoint:location.origin,enforcement:true};');return;}
  if(url.pathname==='/api/auth/me'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({user:{username:req.headers.authorization==='Bearer pet-demo-b'?'demo-b':'demo-a',name:'Synthetic',role:'cidadao',active:true,emailVerified:true,sessionVersion:1}}));return;}
  if(url.pathname==='/api/social/config'){res.setHeader('Content-Type','application/json');res.end('{"backendEnabled":false,"available":false,"homeEnabled":false}');return;}
  if(url.pathname.startsWith('/api/pets/')){
   apiReads++;if(req.method==='POST')mutations++;let body='';for await(const chunk of req)body+=chunk;
   const response=await router(new Request('http://127.0.0.1'+req.url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body})}),{PETS_ENABLED:'true',AUTH_DB:fixture.db});
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  if(url.pathname.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end('{}');return;}
  let relative=decodeURIComponent(url.pathname).replace(/^\//,'');if(!relative||relative.endsWith('/'))relative+='index.html';
  const filename=path.resolve(root,relative);if(!filename.startsWith(root+'/')){res.writeHead(400);res.end();return;}
  let data;
  if(release==='old'){try{data=execFileSync('git',['show',base+':'+relative],{cwd:root,stdio:['ignore','pipe','ignore']});}catch{res.writeHead(404);res.end();return;}}
  else{if(!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404);res.end();return;}data=fs.readFileSync(filename);}
  res.setHeader('Content-Type',({'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[path.extname(filename)]||'application/octet-stream');
  if(relative!=='portal-sw.js')res.setHeader('Cache-Control','public,max-age=0');res.end(data);
 }catch{res.writeHead(500);res.end('Synthetic fixture error');}
});
(async()=>{
 const {fixture:makeFixture}=await import(root+'/testing/pets/fixture.mjs');fixture=makeFixture();
 const {createPetRouter}=await import(root+'/worker/pets.js');router=createPetRouter({validateSession:async r=>{const t=r.headers.get('Authorization');return ['Bearer pet-demo-a','Bearer pet-demo-b'].includes(t)?{username:t.endsWith('-b')?'demo-b':'demo-a',sessionVersion:1,mustChangePassword:false}:null;}});
 const {persistPetCommand}=await import(root+'/worker/pet-store.js');await persistPetCommand(fixture.db,fixture.user,'adopt',{operationId:crypto.randomUUID(),typeId:'cat',variant:'gray',expectedPetRevision:0});fixture.sql.exec("UPDATE pet_accounts SET balance=77 WHERE auth_username='demo-a'");
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.PETS_BROWSER_EXECUTABLE||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
 await context.addInitScript(()=>{if(!sessionStorage.getItem('regulacao.portal.session'))sessionStorage.setItem('regulacao.portal.session','pet-demo-a');sessionStorage.setItem('regulacao.portal.user',JSON.stringify({username:sessionStorage.getItem('regulacao.portal.session').endsWith('-b')?'demo-b':'demo-a',name:'Synthetic',role:'cidadao',emailVerified:true,sessionVersion:1}));sessionStorage.setItem('regulacao.portal.user.validatedAt',String(Date.now()));});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 try{
  await page.goto(origin+'/harness.html');await page.evaluate(async()=>{await navigator.serviceWorker.register('/portal-sw.js');await navigator.serviceWorker.ready;});await page.waitForFunction(()=>navigator.serviceWorker.controller);
  await page.evaluate(async()=>{const c=await caches.open('portal-static-20261008-chat-groups-1');await c.put('/js/portal-global-navigation.js?v=20260928-2',new Response('/* LEGACY-CACHE-MARKER */',{headers:{'Content-Type':'text/javascript'}}));const unrelated=await caches.open('unrelated-fixture-cache');await unrelated.put('/keep',new Response('keep'));window.changed=false;navigator.serviceWorker.addEventListener('controllerchange',()=>window.changed=true);});
  await page.waitForFunction(async()=>{const r=await navigator.serviceWorker.getRegistration();return r?.active?.state==='activated';});
  await page.evaluate(()=>{window.changed=false;});
  release='new';await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();const activated=new Promise(resolve=>{r.addEventListener('updatefound',()=>{const next=r.installing;next.addEventListener('statechange',()=>{if(next.state==='activated')resolve();});},{once:true});});await r.update();await activated;});await page.waitForFunction(()=>window.changed,null,{timeout:30000});
  await page.waitForFunction(async()=>{const r=await navigator.serviceWorker.getRegistration();return r?.active?.state==='activated';},null,{timeout:30000});
  await page.waitForFunction(async()=>!(await caches.keys()).includes('portal-static-20261008-chat-groups-1'),null,{timeout:30000});
  await page.waitForFunction(async()=>{const r=await navigator.serviceWorker.getRegistration();return !r.installing&&!r.waiting&&r.active?.state==='activated';},null,{timeout:30000});
  const cache=await page.evaluate(async()=>{const names=await caches.keys();const legacy=await caches.match('/js/portal-global-navigation.js?v=20260928-2');return {names,legacyMarker:legacy?(await legacy.text()).includes('LEGACY-CACHE-MARKER'):false,unrelatedPreserved:!!await caches.match('/keep')};});note('existing-cache update',cache);
  {assert.equal(cache.legacyMarker,false);assert(cache.names.includes('portal-static-20261009-pets-3'));assert(!cache.names.includes('portal-static-20261008-chat-groups-1'));}assert.equal(cache.unrelatedPreserved,true);
  await page.goto(origin+'/mascotes/');await page.waitForFunction(()=>window.PortalPets?.runtime.state.balance===77);await page.waitForFunction(()=>document.getElementById('petWallet').textContent.includes('77'));
  await context.setOffline(true);await page.getByRole('button',{name:'Dar água · grátis'}).click();await page.waitForTimeout(500);const offlineBalance=fixture.sql.prepare("SELECT balance FROM pet_accounts WHERE auth_username='demo-a'").get().balance;assert.equal(offlineBalance,77);note('offline command keeps server state',{balance:offlineBalance});
  await page.evaluate(()=>{window.RegulationAuth.clearSession();sessionStorage.setItem('regulacao.portal.session','pet-demo-b');sessionStorage.setItem('regulacao.portal.user',JSON.stringify({username:'demo-b',name:'Synthetic B',role:'cidadao',emailVerified:true,sessionVersion:1}));window.dispatchEvent(new CustomEvent('portal:session-ready',{detail:{user:{username:'demo-b'}}}));});await page.waitForTimeout(300);
  const switchState=await page.evaluate(()=>({runtime:!!window.PortalPets,stageCount:document.querySelectorAll('.pet-stage').length,wallet:document.getElementById('petWallet').textContent,homeVisible:!document.getElementById('petHome').hidden}));note('offline session switch',switchState);
  {assert.equal(switchState.runtime,false);assert.equal(switchState.stageCount,0);assert.equal(switchState.wallet,'');assert.equal(switchState.homeVisible,false);}
  await context.setOffline(false);await page.evaluate(()=>window.dispatchEvent(new CustomEvent('portal:background-refresh')));await page.waitForFunction(()=>window.PortalPets&&window.PortalPets.runtime.state.pet===null);assert.equal(await page.locator('#petHome').isVisible(),false);note('same-page online recovery belongs to B',{pet:null});
  await context.setOffline(true);await page.reload();const offlineReload=await page.locator('h1').innerText();assert.equal(offlineReload,'Adotar mascote');assert.equal(await page.locator('#petHome').isVisible(),false);note('offline reload uses public shell without private state',{heading:offlineReload});
  await context.setOffline(false);await page.reload();await page.waitForFunction(()=>window.PortalPets&&window.PortalPets.runtime.state.pet===null);assert.equal(await page.locator('#petHome').isVisible(),false);note('online recovery belongs to B',{pet:null});
  await page.evaluate(()=>{window.RegulationAuth.clearSession();sessionStorage.setItem('regulacao.portal.session','pet-demo-a');sessionStorage.setItem('regulacao.portal.user',JSON.stringify({username:'demo-a',name:'Synthetic A',role:'cidadao',emailVerified:true,sessionVersion:1}));window.dispatchEvent(new CustomEvent('portal:session-ready'));});await page.waitForFunction(()=>document.getElementById('petWallet').textContent.includes('77'));assert.equal(await page.locator('#petGallery button').count(),2);assert.equal(await page.locator('#petDays input').count(),7);note('same-page return to A rebuilds controls once',{balance:77,choices:2,days:7});
  const race=await context.newPage(),raceErrors=[];race.on('pageerror',e=>raceErrors.push(e.message));let releaseResponse,receivedResponse;const held=new Promise(r=>releaseResponse=r),received=new Promise(r=>receivedResponse=r);let intercepted=false;
  await race.route('**/api/pets/me',async route=>{if(intercepted||route.request().headers().authorization!=='Bearer pet-demo-a')return route.continue();intercepted=true;const response=await route.fetch();receivedResponse();await held;await route.fulfill({response}).catch(()=>{});});
  await race.goto(origin+'/mascotes/',{waitUntil:'domcontentloaded'});await received;
  await race.evaluate(()=>{window.RegulationAuth.clearSession();sessionStorage.setItem('regulacao.portal.session','pet-demo-b');sessionStorage.setItem('regulacao.portal.user',JSON.stringify({username:'demo-b',name:'Synthetic B',role:'cidadao',emailVerified:true,sessionVersion:1}));window.dispatchEvent(new CustomEvent('portal:session-ready'));});
  await race.waitForFunction(()=>window.PortalPets&&window.PortalPets.runtime.state.pet===null);releaseResponse();await race.waitForFunction(()=>document.getElementById('petGallery').children.length===2);assert.equal(await race.locator('#petHome').isVisible(),false);assert.equal(await race.locator('#petWallet').innerText().then(t=>t.includes('77')),false);assert.deepEqual(raceErrors,[]);note('late A response cannot replace active B session',{pet:null,pageErrors:raceErrors});await race.close();
  const cachedPrivate=await page.evaluate(async()=>{const hits=[];for(const name of await caches.keys()){const c=await caches.open(name);for(const request of await c.keys())if(new URL(request.url).pathname.startsWith('/api/'))hits.push(request.url);}return hits;});assert.deepEqual(cachedPrivate,[]);note('CacheStorage contains no API responses',{count:cachedPrivate.length});
  fs.writeFileSync(path.join(out,'after.json'),JSON.stringify(report,null,2)+'\n');
 }finally{await context.close();await browser.close();server.close();fixture.close();}
})().catch(e=>{console.error(e.stack);fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({...report,failure:e.message},null,2));server.close();process.exitCode=1;});
