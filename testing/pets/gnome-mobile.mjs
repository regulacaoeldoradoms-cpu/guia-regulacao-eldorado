// Actual native UI plus production pet router, SQLite synthetic accounts only.
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium,user}=await import('../citizen-layout/mobile-profile-refinement.mjs');
const {fixture}=await import('./fixture.mjs');const {createPetRouter}=await import('../../worker/pets.js');const {declarePrivatePetAge}=await import('../../worker/private-pet-age-store.js');
const {applyTextScale}=await import('../citizen-layout/text-scale.mjs');
const output=process.argv[2]||'.local/gnome-mobile';await fs.mkdir(output,{recursive:true});
const server=await serve(process.cwd()),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
try{
 const cases=[{age:'unknown',width:390,theme:'dark',scale:1},{age:'underage',width:390,theme:'dark',scale:1},...[320,360,390].flatMap(width=>['light','dark'].flatMap(theme=>[1,2].map(scale=>({age:'adult',width,theme,scale}))))];
 for(const {age,width,theme,scale} of cases){
  const f=fixture();f.sql.exec(await fs.readFile(new URL('../../worker/migrations/pets-private-age.sql',import.meta.url),'utf8'));f.sql.prepare('INSERT INTO auth_users(username) VALUES(?)').run(user.username);f.user={username:user.username,sessionVersion:1};
  if(age!=='unknown')await declarePrivatePetAge(f.db,f.user,age==='adult'?'1990-01-01':'2015-01-01');
  const result={age,width,theme,scale,errors:[],writes:[],requests:[],assets:[]};const {page,context}=await newPage(browser,{width,theme},server.origin,result);await page.emulateMedia({reducedMotion:'no-preference'});page.on('request',request=>{if(new URL(request.url()).pathname.includes('gnome-sheet'))result.assets.push(request.url());});
  let releaseSprite;
  if(age==='adult'&&width===320&&theme==='light'&&scale===1){const gate=new Promise(resolve=>releaseSprite=resolve);await page.route('**/assets/pets/gnome-sheet.png*',async route=>{await gate;return route.fallback();});}
  const router=createPetRouter({validateSession:async request=>request.headers.get('Authorization')?f.user:null});
  await context.route('**/api/pets/**',async route=>{
   const request=route.request(),pathname=new URL(request.url()).pathname;result.requests.push(pathname);if(request.method()==='POST')result.writes.push(pathname);
   const response=await router(new Request(request.url(),{method:request.method(),headers:request.headers(),...(['GET','HEAD'].includes(request.method())?{}:{body:request.postData()})}),{AUTH_DB:f.db,PETS_ENABLED:'true'});
   return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()});
  });
  try{
   await page.goto(server.origin+'/mascotes/',{waitUntil:'domcontentloaded'});await ready(page,'/mascotes/');await page.getByRole('button',{name:'Gato dourado',exact:true}).waitFor();assert.equal(await page.evaluate(()=>RegulationAuth.getCachedUser().role),'cidadao');
   if(releaseSprite){assert(await page.getByRole('button',{name:'Gnomo · 18+',exact:true}).isDisabled());result.catsReadyBeforeGnomeAsset=true;releaseSprite();}
   process.env.TEXT_SCALE=scale===2?'2':'';await applyTextScale(page);
   if(age!=='adult'){
    assert.equal(await page.getByRole('button',{name:'Gnomo · 18+',exact:true}).count(),0);assert(!result.requests.includes('/api/pets/gnome-speech'));assert.equal(result.assets.length,0);
    if(age==='unknown'){
     await page.locator('#petAgeDisclosure > summary').click();await page.locator('#petAgeBirthDate').fill('1990-01-01');await page.locator('#petAgeSubmit').click();await page.getByRole('button',{name:'Gnomo · 18+',exact:true}).waitFor();assert.equal(await page.locator('#petAgeBirthDate').inputValue(),'');assert(await page.locator('#petAgeDisclosure').isHidden());
    }else assert(await page.locator('#petAgeDisclosure').isHidden());
   }
   if(age==='adult'||age==='unknown'){
    await page.getByRole('button',{name:'Gnomo · 18+',exact:true}).click();await page.locator('#petAdopt').click();await page.waitForFunction(()=>PortalPets?.runtime.state.pet?.typeId==='gnome'&&PortalPets.runtime.speech.catalog?.phrases?.length===54);
    assert.equal(await page.locator('.pet-stage[data-pet-type=gnome]').count(),1);assert(await page.locator('#petAdopt').isDisabled());
    const hashes=await page.evaluate(async()=>{
     const {GNOME_ACTIONS}=await import('/js/gnome-frames.js?v=20261012-gnome-2');const runtime=PortalPets.runtime,ctx=runtime.cat.getContext('2d'),saved={action:runtime.action,actionStarted:runtime.actionStarted,until:runtime.until};cancelAnimationFrame(runtime.frame);
     const rows=[];try{for(const action of GNOME_ACTIONS){const frames=[];for(let i=0;i<8;i++){runtime.action=action;runtime.actionStarted=performance.now()-(i+.1)*160;runtime.until=performance.now()+10000;runtime.render();const pixels=ctx.getImageData(0,0,64,64).data;const hash=await crypto.subtle.digest('SHA-256',pixels);frames.push([...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join(''));}rows.push({action,frames});}}finally{Object.assign(runtime,saved);runtime.start();}return rows;
    });
    for(const row of hashes)assert(new Set(row.frames).size>=3,`${row.action} must have multiple actually drawn frames`);
    result.animationFrames=hashes;await applyTextScale(page);assert(await page.locator('.pet-page').evaluate(n=>n.scrollWidth<=n.clientWidth+1));await page.screenshot({path:`${output}/${age}-${width}-${theme}-${scale}.png`});
    const speech=await page.evaluate(()=>{const r=PortalPets.runtime;r.speech.nextAt=Date.now();r.speech.advance();r.render();return {text:r.bubble.textContent,until:r.speech.bubbleUntil,now:Date.now()};});assert(speech.until-speech.now>=5900);assert(speech.text);
    await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/',location.href)));await ready(page,'/');await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/mascotes/',location.href)));await ready(page,'/mascotes/');assert.equal(await page.locator('.pet-stage[data-pet-type=gnome]').count(),1);
    await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/',location.href)));await ready(page,'/');await page.emulateMedia({media:'print'});assert.equal(await page.locator('.pet-stage-global').evaluate(n=>getComputedStyle(n).display),'none');await page.emulateMedia({media:'screen'});
   }
   assert.equal(result.errors.length,0);results.push(result);console.log(JSON.stringify({age,width,theme,scale,passed:true}));
  }catch(error){releaseSprite?.();console.log(JSON.stringify({age,error:String(error),requests:result.requests,errors:result.errors,page:await page.evaluate(()=>({message:document.getElementById('petMessage')?.textContent,pet:window.PortalPets?.runtime.state.pet,speechCount:window.PortalPets?.runtime.speech?.catalog?.phrases.length,epoch:window.PortalPets?.runtime.speechEpoch}))}));throw error;}finally{await context.close();f.close();}
 }
 await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
