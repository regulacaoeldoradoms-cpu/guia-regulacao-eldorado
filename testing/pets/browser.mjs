import {createRequire} from 'node:module';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
const out=process.env.PETS_ARTIFACT_DIR||decodeURIComponent(new URL('./artifacts/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));fs.mkdirSync(out,{recursive:true});
process.env.PLAYWRIGHT_BROWSERS_PATH=path.resolve(out,'../../../.local/playwright');
const {chromium}=createRequire(import.meta.url)('playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.PETS_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const context=await browser.newContext({viewport:{width:1280,height:900},...(process.env.PETS_DISABLE_VIDEO==='1'?{}:{recordVideo:{dir:out,size:{width:1280,height:900}}})}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));let adoptRequests=0;page.on('request',r=>{if(r.url().includes('/api/pets/adopt'))adoptRequests++;});
const evidence=[];
const note=s=>{evidence.push(s);console.log('PASS',s);};
try{
 await page.request.post('http://127.0.0.1:8793/__fixture',{data:{reset:true}});
 await page.goto('http://127.0.0.1:8793/mascotes/?demo=a');await page.getByRole('button',{name:'Gato dourado',exact:true}).waitFor();
 const initial=await page.evaluate(()=>window.PortalPets.runtime.state);
 if(!initial.pet){
  assert.equal(await page.locator('#petAdopt').isDisabled(),true);
  await page.getByRole('button',{name:'Gato dourado',exact:true}).click();assert.equal(await page.locator('#petHome').isVisible(),false);
  await page.evaluate(()=>{document.getElementById('petAdopt').click();document.getElementById('petAdopt').click();});
  await page.waitForFunction(()=>window.PortalPets.runtime.state.pet?.variant==='ginger');assert.equal(adoptRequests,1);note('selection is not adoption; repeated click gives one request');
 }
 await page.getByRole('button',{name:'Gato cinza',exact:true}).click();await page.locator('#petAdopt').click();await page.waitForFunction(()=>window.PortalPets.runtime.state.pet.variant==='gray');note('switch works after first adoption');
 await page.reload();await page.waitForFunction(()=>window.PortalPets?.runtime.state.pet?.variant==='gray');note('account state persists across close/reload');
 await page.request.post('http://127.0.0.1:8793/__fixture',{data:{account:'a',balance:60}});
 await page.evaluate(()=>window.PortalPets.runtime.refresh());
 const bed=page.locator('.pet-item').filter({has:page.getByRole('heading',{name:'Caminha nuvem',exact:true})});
 if(!(await page.evaluate(()=>window.PortalPets.runtime.state.inventory['bed-cloud']))){
  await bed.getByRole('button',{name:'Comprar',exact:true}).click();await page.waitForFunction(()=>window.PortalPets.runtime.state.inventory['bed-cloud']===1);
 }
 await bed.getByRole('button',{name:'Colocar caminha'}).click();await page.waitForFunction(()=>window.PortalPets.runtime.state.placement?.itemId==='bed-cloud');
 await page.locator('#bedX').evaluate(el=>{el.value='.95';el.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.locator('#bedY').evaluate(el=>{el.value='.9';el.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.getByRole('button',{name:'Salvar posição'}).click();await page.waitForFunction(()=>window.PortalPets.runtime.state.placement.x===.95);
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});note('bed purchased, placed and position saved');
 const second=await context.newPage();await second.goto('http://127.0.0.1:8793/mascotes/');
 await second.waitForFunction(()=>window.PortalPets);
 // Separate tab with the same account: only the lease owner accrues.
 const a=await page.evaluate(()=>window.PortalPets.api.command('activity',{tabId:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',sequence:1,visible:true,focused:true,recentlyInteracted:true}));
 const busy=await second.evaluate(async()=>{try{await window.PortalPets.api.command('activity',{tabId:'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',sequence:1,visible:true,focused:true,recentlyInteracted:true});return '';}catch(e){return e.code;}});
 assert.equal(busy,'ACTIVITY_LEASE_BUSY');note('second tab cannot duplicate active credit');
 await second.close();
 const bContext=await browser.newContext(),b=await bContext.newPage();await b.goto('http://127.0.0.1:8793/mascotes/?demo=b');await b.waitForFunction(()=>window.PortalPets);
 assert.equal(await b.evaluate(()=>window.PortalPets.runtime.state.pet),null);note('second account has no inherited pet, inventory or balance');await bContext.close();
 await page.request.post('http://127.0.0.1:8793/__fixture',{data:{account:'a',hunger:80,thirst:85,awakeSeconds:2700}});
 await page.evaluate(()=>window.PortalPets.runtime.refresh());await page.setViewportSize({width:390,height:844});
 await page.locator('#petHabitat').scrollIntoViewIfNeeded();
 await page.locator('.pet-bubble').waitFor();assert.match(await page.locator('.pet-bubble').innerText(),/sede/);
 await page.screenshot({path:path.join(out,'mobile-alert.png'),fullPage:true});note('soft thirst alert on mobile');
 const rect=await page.locator('.pet-bed').boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=390);
 const cat=await page.locator('.pet-cat').boundingBox();assert.equal(cat.width,128);assert.equal(cat.height,96);
 assert.equal(await page.locator('.pet-stage').evaluate(e=>getComputedStyle(e).pointerEvents),'none');note('fixed frame size, bed inside viewport and pointer pass-through');
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(250);const p1=await page.locator('.pet-cat').boundingBox();await page.waitForTimeout(500);const p2=await page.locator('.pet-cat').boundingBox();assert.equal(p1.x,p2.x);assert.equal(p1.y,p2.y);note('reduced motion stops travel');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>{const r=window.PortalPets.runtime;r.x=r.bedPoint.x-30;r.y=r.bedPoint.y-12;r.until=0;r.queue=[];r.start();});
 await page.waitForFunction(()=>window.PortalPets.runtime.action==='sleep',null,{timeout:15000});await page.waitForTimeout(500);
 await page.screenshot({path:path.join(out,'bed-sleep.png')});note('sleepy cat travels to bed and sleeps');
 await page.evaluate(()=>window.PortalPets.api.command('preferences',{expectedRevision:window.PortalPets.runtime.state.revision,visible:false,motionEnabled:false,needsPaused:true,schedule:null}).then(p=>window.PortalPets.runtime.update(p.state)));
 assert.equal(await page.locator('.pet-stage').isVisible(),false);note('hide/disable animation persisted');
 await page.evaluate(()=>window.PortalPets.api.command('preferences',{expectedRevision:window.PortalPets.runtime.state.revision,visible:true,motionEnabled:true,needsPaused:true,schedule:null}).then(p=>window.PortalPets.runtime.update(p.state)));
 await page.setViewportSize({width:1280,height:900});
 await page.evaluate(async()=>{
  const {drawCat,CAT_ACTIONS}=await import('/js/pet-cat-frames.js');
  const panel=document.createElement('section');panel.style.cssText='position:relative;z-index:200;background:#edf4fa;padding:24px;display:flex;flex-wrap:wrap;gap:15px';panel.id='pose-sheet';
  for(const action of CAT_ACTIONS){const cell=document.createElement('div'),canvas=document.createElement('canvas');canvas.width=64;canvas.height=48;canvas.style.cssText='width:128px;height:96px;image-rendering:pixelated';drawCat(canvas.getContext('2d'),action,2,'ginger');cell.append(canvas,document.createTextNode(action));panel.append(cell);}
  document.body.prepend(panel);
 });
 await page.locator('#pose-sheet').screenshot({path:path.join(out,'pose-sheet.png')});note('comparable poses share logical grid and display scale');
 assert.deepEqual(errors,[]);note('no uncaught page errors');
 fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({evidence,errors},null,2));
}catch(error){await page.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({evidence,errors,failure:error.stack},null,2));throw error;}
finally{await context.close();await browser.close();}
