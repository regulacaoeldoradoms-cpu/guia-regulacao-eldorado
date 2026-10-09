const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
let playwright;try{playwright=require('playwright');}catch{playwright=require('node:module').createRequire(path.resolve(__dirname,'../browser/package.json'))('playwright');}const {chromium}=playwright;
const root=path.resolve(__dirname,'../..'),baseline=process.env.PETS_GLOBAL_BASELINE;
const out=process.env.PETS_GLOBAL_ARTIFACT_DIR||'/tmp/pets-global-evidence';fs.mkdirSync(out,{recursive:true});
const checks=[],petErrors=[],mutations=[];
(async()=>{
 const {fixture}=await import(root+'/testing/pets/fixture.mjs');const f=fixture();
 const {createPetRouter}=await import(root+'/worker/pets.js');
 const router=createPetRouter({validateSession:async r=>{const t=r.headers.get('Authorization');return ['Bearer pet-demo-a','Bearer pet-demo-b'].includes(t)?{username:t.endsWith('-b')?'demo-b':'demo-a',sessionVersion:1,mustChangePassword:false}:null;}});
 const {persistPetCommand}=await import(root+'/worker/pet-store.js');
 await persistPetCommand(f.db,f.user,'adopt',{operationId:crypto.randomUUID(),typeId:'cat',variant:'gray',expectedPetRevision:0});
 const original=JSON.parse(f.sql.prepare("SELECT state_json FROM pet_accounts WHERE auth_username='demo-a'").get().state_json);
 const server=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://127.0.0.1');res.setHeader('Cache-Control','no-store');
   if(url.pathname.startsWith('/api/pets/')){
    if(req.method==='POST')mutations.push(url.pathname);let body='';for await(const chunk of req)body+=chunk;
    const response=await router(new Request(url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body})}),{PETS_ENABLED:'true',AUTH_DB:f.db});
    res.writeHead(response.status,Object.fromEntries(response.headers));return res.end(await response.text());
   }
   if(url.pathname==='/js/auth-config.js'){res.setHeader('Content-Type','text/javascript');return res.end('window.REGULATION_AUTH_CONFIG={endpoint:location.origin,enforcement:true};');}
   if(url.pathname.startsWith('/api/')){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(url.pathname==='/api/social/config'?{backendEnabled:false,available:false,homeEnabled:false}:url.pathname==='/api/auth/me'?{user:{username:req.headers.authorization?.endsWith('-b')?'demo-b':'demo-a',name:'Synthetic',role:'admin',active:true,emailVerified:true,sessionVersion:1}}:{}));}
   let relative=url.pathname.slice(1);if(!relative||relative.endsWith('/'))relative+='index.html';
   const filename=path.resolve(root,relative);if(!filename.startsWith(root+'/')){res.writeHead(400);return res.end();}
   let data;
   try{data=baseline?execFileSync('git',['show',baseline+':'+relative],{cwd:root,stdio:['ignore','pipe','ignore']}):fs.readFileSync(filename);}catch{res.writeHead(404);return res.end();}
   res.setHeader('Content-Type',({'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'})[path.extname(filename)]||'application/octet-stream');res.end(data);
  }catch{res.writeHead(500);res.end('Synthetic fixture error');}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({...(process.env.PETS_BROWSER_EXECUTABLE?{executablePath:process.env.PETS_BROWSER_EXECUTABLE}:{}),headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'}),page=await context.newPage();
 await context.addInitScript(()=>{if(!sessionStorage.getItem('regulacao.portal.session'))sessionStorage.setItem('regulacao.portal.session','pet-demo-a');sessionStorage.setItem('regulacao.portal.user',JSON.stringify({username:sessionStorage.getItem('regulacao.portal.session').endsWith('-b')?'demo-b':'demo-a',name:'Synthetic',role:'admin',active:true,emailVerified:true,sessionVersion:1}));sessionStorage.setItem('regulacao.portal.user.validatedAt',String(Date.now()));});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 page.on('pageerror',e=>{if(/pets-|pet-cat/.test(e.stack||''))petErrors.push(e.message);});
 const note=(name,detail)=>{checks.push({name,detail});console.log('PASS',name,JSON.stringify(detail));};
 async function state(){await page.waitForFunction(()=>window.PortalPets?.runtime.state.pet?.variant==='gray');assert.equal(await page.locator('.pet-stage').count(),1);return page.evaluate(()=>window.PortalPets.runtime.state);}
 async function geometry(){return page.locator('.pet-stage').evaluate(e=>{const r=e.getBoundingClientRect();return {position:getComputedStyle(e).position,events:getComputedStyle(e).pointerEvents,top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:innerWidth,height:innerHeight,global:e.classList.contains('pet-stage-global')};});}
 try{
  await page.goto(origin+'/mascotes/');await state();assert.equal((await geometry()).position,'relative');note('care page keeps its inline habitat',{});
  for(const route of ['/ferramentas/','/medico/','/recepcao/','/agenda/','/telemedicina/','/documentos/','/cidadao/','/estudos/','/perfil/','/amigos/','/notificacoes/','/seguranca/','/configuracoes/','/conquistas/','/admin/usuarios/','/admin/monitoramento/','/admin/configuracao/','/admin/social/','/conselho/painel/','/protocolo/','/']){
   await page.goto(origin+route);const s=await state();assert.deepEqual(s.pet,original.pet);assert.deepEqual(s.preferences,original.preferences);
   const before=await geometry();assert.equal(before.position,'fixed',route);assert.equal(before.events,'none');assert(before.top>=0&&before.bottom<=before.height&&before.left>=0&&before.right<=before.width+1,route);
   await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));const after=await geometry();assert.equal(after.top,before.top);assert.equal(after.bottom,before.bottom);if(route==='/'){assert.equal(await page.locator('#homeLoading').isVisible(),false);assert.equal(await page.locator('.pet-stage').evaluate(e=>e.parentElement===document.body&&!e.closest('[hidden]')),true);}
   note('companion follows '+route,{pet:s.pet,position:after.position});
  }
  await page.goto(origin+'/ferramentas/');await state();await page.reload();await state();await page.goto(origin+'/perfil/');await state();await page.goBack();await state();await page.goForward();await state();note('round trip, reload and history preserve one companion',{});
  for(const [width,height]of [[320,700],[390,844],[844,390]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(600);const g=await geometry();assert(g.left>=0&&g.right<=width+1&&g.top>=0&&g.bottom<=height);assert.equal(g.events,'none');
   const cat=await page.locator('.pet-cat').boundingBox();assert.equal(cat.width,128);assert.equal(cat.height,96);note('viewport companion '+width+'x'+height,g);
  }
  await page.evaluate(()=>{const r=window.PortalPets.runtime;r.x=r.bounds.left;r.y=r.bounds.bottom;r.target={x:r.bounds.right,y:r.y};r.action='walk';r.until=performance.now()+5000;r.queue=[];r.render();r.start();});
  const before=await page.locator('.pet-cat').boundingBox();await page.waitForTimeout(500);const after=await page.locator('.pet-cat').boundingBox();assert(after.x>before.x);note('walking animation remains active',{});
  const controls=await page.locator('.pet-global-controls').evaluate(e=>!e.closest('[aria-hidden=true]'));assert(controls);assert((await page.getByRole('button',{name:'Ocultar mascote',exact:true}).boundingBox()).height>=44);
  await page.evaluate(()=>{const cat=document.querySelector('.pet-cat').getBoundingClientRect();const button=document.createElement('button');button.id='under-companion';button.textContent='Synthetic underlying control';button.style.cssText='position:fixed;z-index:11999;left:'+cat.left+'px;top:'+cat.top+'px;width:128px;height:96px';document.body.append(button);});assert.equal(await page.evaluate(()=>{const r=document.querySelector('.pet-cat').getBoundingClientRect();return document.elementFromPoint(r.left+64,r.top+48)?.id;}),'under-companion');await page.locator('#under-companion').evaluate(e=>e.remove());note('graphics pass clicks through and controls stay accessible',{});
  await page.screenshot({path:path.join(out,'global-mobile.png')});
  await page.emulateMedia({reducedMotion:'reduce'});const still=await page.locator('.pet-cat').boundingBox();await page.waitForTimeout(500);assert.deepEqual(await page.locator('.pet-cat').boundingBox(),still);await page.emulateMedia({reducedMotion:'no-preference'});note('reduced motion stops travel without changing preferences',{});
  await page.getByRole('link',{name:'Cuidar do mascote',exact:true}).click();await page.waitForURL('**/mascotes/');await state();await page.goBack();await state();note('accessible care control returns to the same pet',{});
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.pet-stage-global').isVisible(),false);await page.emulateMedia({media:'screen'});note('companion omitted from printing',{});
  await page.getByRole('button',{name:'Ocultar mascote',exact:true}).click();await page.waitForFunction(()=>window.PortalPets.runtime.state.preferences.visible===false);assert.equal(await page.locator('.pet-stage').isVisible(),false);await page.reload();await page.waitForFunction(()=>window.PortalPets?.runtime.state.preferences.visible===false);assert.equal(await page.locator('.pet-global-controls').isVisible(),false);const hidden=await page.evaluate(()=>window.PortalPets.runtime.state.preferences);assert.deepEqual(hidden,{...original.preferences,visible:false});note('explicit hide persists and preserves other preferences',{});
  await page.evaluate(()=>{window.RegulationAuth.clearSession();sessionStorage.setItem('regulacao.portal.session','pet-demo-b');window.dispatchEvent(new CustomEvent('portal:session-ready'));});await page.waitForFunction(()=>window.PortalPets?.runtime.state.pet===null);assert.equal(await page.locator('.pet-stage').isVisible(),false);note('account switch does not inherit the cat',{});
  await page.evaluate(()=>window.RegulationAuth.clearSession());await page.waitForFunction(()=>!window.PortalPets);assert.equal(await page.locator('.pet-stage').count(),0);note('logout removes global companion',{});
  assert.deepEqual(mutations,['/api/pets/preferences']);assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM pet_accounts').get().n,1);assert.equal(f.sql.prepare("SELECT COUNT(*) n FROM pet_operations WHERE kind='adopt'").get().n,1);assert.deepEqual(petErrors,[]);note('only the explicit hide writes preferences; navigation never adopts or cares',{});
 }catch(e){await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,petErrors,mutations,failure:e.stack},null,2));throw e;}
 finally{await context.close();await browser.close();server.close();f.close();}
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,petErrors,mutations},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
