import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const {chromium}=createRequire(import.meta.url)('playwright');
const preview=process.env.PETS_PREVIEW_URL||'http://127.0.0.1:8793';
const out=process.env.PETS_ARTIFACT_DIR||new URL('./artifacts/mobile-safe-area/',import.meta.url).pathname;
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PETS_BROWSER_EXECUTABLE||'/usr/bin/chromium',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
const note=(name,detail)=>{checks.push({name,detail});console.log('PASS',name,JSON.stringify(detail));};
async function geometry(){
 return page.evaluate(()=>{
  const scene=document.querySelector('.pet-stage'),bounds=scene.getBoundingClientRect();
  const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
  const intersect=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  const visible=e=>!e.hidden&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;
  const figures=[...scene.children].filter(visible).map(e=>({name:e.className,...rect(e)}));
  const ui=[...document.querySelectorAll('.pet-needs,.pet-actions,.pet-items,#petGallery,#petPlacement,#petPreferences,#petAchievement,h2,.social-mobile-nav')].filter(visible);
  return {position:getComputedStyle(scene).position,scene:rect(scene),figures,overlaps:ui.filter(e=>intersect(bounds,e.getBoundingClientRect())).map(e=>e.id||e.className||e.tagName),overflow:document.documentElement.scrollWidth>innerWidth};
 });
}
function assertSafe(g){
 assert.equal(g.position,'relative');assert.deepEqual(g.overlaps,[]);assert.equal(g.overflow,false);
 for(const figure of g.figures){assert(figure.left>=g.scene.left-1&&figure.right<=g.scene.right+1,figure.name);assert(figure.top>=g.scene.top-1&&figure.bottom<=g.scene.bottom+1,figure.name);}
 const cat=g.figures.find(e=>e.name==='pet-cat');assert.equal(cat.width,128);assert.equal(cat.height,96);
}
try{
 await page.request.post(preview+'/__fixture',{data:{reset:true}});
 await page.goto(preview+'/mascotes/?demo=a');await page.waitForFunction(()=>window.PortalPets);
 await page.evaluate(async()=>{const s=window.PortalPets;const p=await s.api.command('adopt',{typeId:'cat',variant:'gray',expectedPetRevision:s.runtime.state.petRevision});s.runtime.update(p.state);});
 await page.request.post(preview+'/__fixture',{data:{account:'a',balance:60}});
 await page.evaluate(async()=>{const s=window.PortalPets;await s.runtime.refresh();let p=await s.api.command('purchase',{itemId:'bed-cloud',catalogVersion:s.catalog.version});s.runtime.update(p.state);p=await s.api.command('placement',{itemId:'bed-cloud',x:.95,y:.9,expectedPetRevision:s.runtime.state.petRevision,expectedPlacementRevision:s.runtime.state.placementRevision});s.runtime.update(p.state);});
 await page.request.post(preview+'/__fixture',{data:{account:'a',hunger:80,thirst:85}});
 await page.evaluate(()=>window.PortalPets.runtime.refresh());
 for(const [width,height]of [[320,700],[390,844],[600,844],[844,390],[1280,900]]){
  await page.setViewportSize({width,height});await page.locator('#petHabitat').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>window.PortalPets.runtime.root.clientWidth>0);await page.waitForTimeout(100);
  const g=await geometry();assertSafe(g);note('reserved scene '+width+'x'+height,g);
 }
 await page.setViewportSize({width:390,height:844});await page.locator('#petHabitat').scrollIntoViewIfNeeded();
 for(const x of [0,1])for(const y of [0,1]){await page.evaluate(({x,y})=>{const r=window.PortalPets.runtime;r.preview({...r.state.placement,x,y});r.x=r.bedPoint.x;r.y=r.bedPoint.y-12;r.action='sleep';r.render();},{x,y});assertSafe(await geometry());}
 note('all four bed-placement corners stay inside the reserved scene',{corners:4});
 await page.evaluate(()=>{const r=window.PortalPets.runtime;r.preview(null);r.action='walk';r.until=performance.now()+5000;r.queue=[];r.goingToBed=false;r.x=r.bounds.left;r.y=r.bounds.bottom;r.target={x:r.bounds.right,y:r.y};r.render();r.start();});
 const before=await page.locator('.pet-cat').boundingBox();await page.waitForTimeout(500);const after=await page.locator('.pet-cat').boundingBox();assert(after.x>before.x);assertSafe(await geometry());note('animation remains active inside the reserved scene',{});
 await page.getByRole('button',{name:'Dar água · grátis'}).click();await page.waitForFunction(()=>window.PortalPets.runtime.state.thirst===0);await page.getByRole('button',{name:'Dar comida · grátis'}).click();await page.waitForFunction(()=>window.PortalPets.runtime.state.hunger===0);note('free care buttons remain unobstructed and usable',{});
 await page.locator('#bedX').scrollIntoViewIfNeeded();await page.locator('#bedX').evaluate(e=>{e.value='.5';e.dispatchEvent(new Event('input',{bubbles:true}));});await page.getByRole('button',{name:'Salvar posição'}).click();await page.waitForFunction(()=>window.PortalPets.runtime.state.placement.x===.5);assertSafe(await geometry());note('bed sliders and save remain usable',{});
 await page.locator('#petStart').focus();await page.setViewportSize({width:390,height:500});await page.waitForTimeout(100);assertSafe(await geometry());note('short viewport while editing preferences does not overlay controls',{});
 await page.setViewportSize({width:390,height:844});await page.locator('#petHabitat').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'mobile-safe-area.png')});
 await page.evaluate(()=>{window.RegulationAuth.clearSession();});await page.waitForFunction(()=>!window.PortalPets);assert.equal(await page.locator('.pet-stage').count(),0);assert.equal(await page.locator('#petHabitat').isVisible(),false);note('session clear removes the scene and hides the reserved host',{});
 await page.goto(preview+'/ferramentas/?demo=a');await page.waitForFunction(()=>window.PortalPets?.runtime.state.pet);assert.equal(await page.getByRole('link',{name:'Cuidar do mascote',exact:true}).isVisible(),true);const outside=await page.locator('.pet-stage').evaluate(e=>({position:getComputedStyle(e).position,withinBody:e.parentElement===document.body}));assert.equal(outside.position,'fixed');assert.equal(outside.withinBody,true);await page.getByRole('link',{name:'Cuidar do mascote',exact:true}).click();await page.waitForURL('**/mascotes/');await page.getByRole('button',{name:'Dar água · grátis'}).waitFor();note('other modules use a viewport companion with a working care control',outside);
 assert.deepEqual(errors,[]);note('no uncaught browser errors',{});
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2)+'\n');
}catch(error){fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors,failure:error.stack},null,2));await page.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});throw error;}
finally{await context.close();await browser.close();}
