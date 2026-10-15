// Native HTML/CSS/JS, real auth/pet routers and SQLite; every API intercepted.
// PLAYWRIGHT_PATH=/tmp/account-browser/node_modules/playwright/index.mjs node testing/account-registration/browser.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {GroupTestD1} from '../../worker/tests/helpers/chat-group-fixture.mjs';
import {prepareRegistrationFixture,syntheticRegistrationDetails} from '../../worker/tests/helpers/private-registration-fixture.mjs';
import {handlePortalRoute} from '../../worker/auth-management-v2.js';
import {sanitizeCitizenRegistrationRequest} from '../../worker/portal-safety.js';
import {createPetRouter} from '../../worker/pets.js';
import {fixture} from '../pets/fixture.mjs';
import {declarePrivatePetAge} from '../../worker/private-pet-age-store.js';
import {privateRegistrationStatement} from '../../worker/account-private-registration.js';
process.env.PORTAL_FIXTURES_ONLY='1';
const {applyTextScale}=await import('../citizen-layout/text-scale.mjs');
const scale=Number(process.env.ACCOUNT_TEXT_SCALE||1);process.env.TEXT_SCALE=scale===2?'2':'';
const {newPage,ready,chromium,user}=await import('../citizen-layout/mobile-profile-refinement.mjs');
const {default:AxeBuilder}=await import(pathToFileURL(process.env.AXE_PATH||'/tmp/account-browser/node_modules/@axe-core/playwright/dist/index.mjs').href);
const root=process.cwd(),output=path.resolve(process.argv[2]||'.local/account-registration');await fs.mkdir(output,{recursive:true});
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json','.wav':'audio/wav','.mp4':'video/mp4','.webmanifest':'application/manifest+json'};
const server=http.createServer(async(req,res)=>{
 try{
  assert.equal(req.method,'GET');const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  assert(/^\/(?:js|css|assets|vendor|data)\//.test(name)||['/','/cadastro/','/login/','/mascotes/','/perfil/','/seguranca/','/ferramentas/','/portal.webmanifest'].includes(name));
  const file=await fs.realpath(path.join(root,name,name.endsWith('/')?'index.html':''));assert(file.startsWith(root+path.sep));
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end();}
});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost']}),results=[];
async function screenshot(page,name){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,name+(scale===2?'-text200':'')+'.png'),fullPage:true});}
async function audit(page,selector){
 const result=await new AxeBuilder({page}).include(selector).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
 return {violations:0,passes:result.passes.length};
}
async function privateStorage(page){
 const stored=await page.evaluate(()=>JSON.stringify([...Object.entries(localStorage),...Object.entries(sessionStorage)]));
 assert(!/1990-01-01|1993-07-19|2015-01-01|"gender"|"birthDate"|masculino|feminino/.test(stored));
}
const asRequest=req=>new Request(req.url(),{method:req.method(),headers:req.headers(),...(['GET','HEAD'].includes(req.method())?{}:{body:req.postData()})});
async function fulfill(route,response){return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()});}
try{
 for(const width of (process.env.ACCOUNT_WIDTHS||'320,390,1440').split(',').map(Number))for(const theme of ['light','dark']){
  const state={errors:[]},{page,context,audit:network}=await newPage(browser,{width,theme,seedOnce:true},origin,state);
  const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-browser-account-secret',AUTH_RATE_LIMIT_SECRET:'synthetic-browser-rate'};await prepareRegistrationFixture(env);const posts=[];
  await context.route('**/api/auth/register',async route=>{posts.push(route.request().postDataJSON());return fulfill(route,await handlePortalRoute(await sanitizeCitizenRegistrationRequest(asRequest(route.request())),env,''));});
  try{
   await page.goto(origin+'/cadastro/');await applyTextScale(page);const birth=page.locator('#signupBirthDate'),gender=page.getByLabel('Gênero',{exact:true});
   assert.equal(await gender.inputValue(),'');assert.equal(await gender.evaluate(n=>n.selectedOptions[0].disabled),true);
   await page.locator('#signupUsername').fill('synthetic.browser');await page.locator('#signupPassword').fill('Synthetic-Registration-2026');await page.locator('#signupConfirm').fill('Synthetic-Registration-2026');await page.locator('#signupTerms').check();
   await page.locator('#signupSubmit').click();assert.equal(posts.length,0);
   await birth.fill('2100-01-01');await page.locator('#signupSubmit').click();assert.equal(posts.length,0);assert(await birth.evaluate(n=>!n.validity.valid));
   await birth.fill('1899-12-31');await page.locator('#signupSubmit').click();assert.equal(posts.length,0);
   await birth.fill('1993-07-19');await page.locator('#signupSubmit').click();assert.equal(posts.length,0);
   await page.locator('#signupForm h2').click();await screenshot(page,`signup-${width}-${theme}`);
   await gender.focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert.equal(await gender.inputValue(),'masculino');
   assert.equal(await birth.getAttribute('min'),'1900-01-01');assert(await birth.getAttribute('max'));assert(await birth.getAttribute('aria-describedby'));assert(await gender.getAttribute('aria-describedby'));
   for(const field of [birth,gender]){const box=await field.boundingBox();assert(box.height>=44);}
   const accessibility=await audit(page,'#signupForm');
   // Existing confirmation/terms validation stays active.
   await page.locator('#signupConfirm').fill('Different-Synthetic-2026');await page.locator('#signupSubmit').click();assert.equal(posts.length,0);assert.match(await page.locator('#signupStatus').textContent(),/confirmação/);
   await page.locator('#signupConfirm').fill('Synthetic-Registration-2026');await page.locator('#signupTerms').uncheck();await page.locator('#signupSubmit').click();assert.equal(posts.length,0);await page.locator('#signupTerms').check();
   await page.locator('#signupSubmit').click();await page.waitForFunction(()=>document.getElementById('signupStatus')?.textContent.includes('Conta Bronze criada'));
   assert.deepEqual(posts,[{username:'synthetic.browser',password:'Synthetic-Registration-2026',birthDate:'1993-07-19',gender:'masculino'}]);await privateStorage(page);
   assert.equal(env.AUTH_DB.database.prepare('SELECT gender FROM account_private_registration').get().gender,'masculino');
   assert.equal(state.errors.length,0);results.push({scene:'signup',width,theme,scale,accessibility,success:true,privateStorage:true});
  }finally{await context.close();env.AUTH_DB.database.close();}
  if(process.env.ACCOUNT_SIGNUP_ONLY==='1')continue;
  for(const kind of ['legacy-missing','new-adult','new-minor']){
   const f=fixture();f.sql.prepare('INSERT INTO auth_users(username) VALUES(?)').run(user.username);f.user={username:user.username,sessionVersion:1};
   f.sql.exec(await fs.readFile('worker/migrations/pets-private-age.sql','utf8'));
   f.sql.exec(await fs.readFile('worker/migrations/account-private-registration.sql','utf8'));
   if(kind!=='legacy-missing'){
    f.sql.prepare('DELETE FROM account_private_registration WHERE auth_username=?').run(user.username);
    await privateRegistrationStatement(f.db,user.username,'feminino').run();f.sql.prepare('INSERT INTO pet_private_age(auth_username,birth_date) VALUES(?,?)').run(user.username,kind==='new-adult'?'1993-07-19':'2015-01-01');
   }
   const scene={errors:[]},{page,context,audit:network}=await newPage(browser,{width,theme,seedOnce:true},origin,scene);
   const router=createPetRouter({validateSession:async req=>req.headers.get('Authorization')?f.user:null});const writes=[];
   await context.route('**/api/pets/**',async route=>{if(route.request().method()==='POST')writes.push(new URL(route.request().url()).pathname);return fulfill(route,await router(asRequest(route.request()),{AUTH_DB:f.db,PETS_ENABLED:'true'}));});
   try{
    await page.goto(origin+'/mascotes/');if(width<=900)await ready(page,'/mascotes/');else await page.waitForFunction(()=>Boolean(window.PortalPets?.runtime));await page.getByRole('button',{name:'Gato dourado',exact:true}).waitFor();await applyTextScale(page);
    if(kind==='legacy-missing'){
     await page.waitForFunction(()=>!document.getElementById('petAgeDisclosure').hidden);
     const gallery=page.locator('.pet-gallery-disclosure');if(await gallery.count()&&(await gallery.getAttribute('open'))===null)await gallery.locator(':scope > summary').click();
     await page.locator('#petAgeDisclosure > summary').click();await page.locator('#petAgeBirthDate').fill('1990-01-01');
     const accessibility=await audit(page,'#petAgeForm');await page.locator('#petAgeDisclosure').scrollIntoViewIfNeeded();await screenshot(page,`legacy-${width}-${theme}`);
     await page.locator('#petAgeSubmit').click();await page.getByRole('button',{name:'Gnomo · 18+',exact:true}).waitFor();assert(await page.locator('#petAgeDisclosure').isHidden());assert.equal(await page.locator('#petAgeBirthDate').inputValue(),'');
     assert(writes.includes('/api/pets/age'));results.push({scene:kind,width,theme,scale,accessibility,success:true});
    }else{
     await page.waitForFunction(()=>document.getElementById('petMessage').textContent==='Escolha seu companheiro.');assert(await page.locator('#petAgeDisclosure').isHidden());assert(!writes.includes('/api/pets/age'));
     assert.equal(await page.getByRole('button',{name:'Gnomo · 18+',exact:true}).count(),kind==='new-adult'?1:0);await screenshot(page,`${kind}-${width}-${theme}`);
     results.push({scene:kind,width,theme,scale,success:true});
    }
    await privateStorage(page);assert.equal(scene.errors.length,0,scene.errors.join('\n'));assert.equal(network.unmappedApiCalls.length,0);
    // New/adult and completed legacy use only stored dates for adoption.
    if(kind!=='new-minor'){
     const gallery=page.locator('.pet-gallery-disclosure');if(await gallery.count()&&(await gallery.getAttribute('open'))===null)await gallery.locator(':scope > summary').click();
     await page.getByRole('button',{name:'Gnomo · 18+',exact:true}).click();await page.locator('#petAdopt').click();await page.waitForFunction(()=>PortalPets?.runtime.state.pet?.typeId==='gnome');assert(await page.locator('#petAgeDisclosure').isHidden());
    }
    // Exercise the existing SPA route loader, whose script URL was updated.
    if(width===390){await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/',location.href)));await ready(page,'/');await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/mascotes/',location.href)));await ready(page,'/mascotes/');assert(await page.locator('#petAgeDisclosure').isHidden());}
   }finally{await context.close();f.close();}
  }
 }
 await fs.writeFile(path.join(output,process.env.ACCOUNT_SIGNUP_ONLY==='1'?'results-signup.json':scale===2?'results-text200.json':'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({passed:results.length,output}));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
