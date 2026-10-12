// Synthetic, isolated browser evidence for mobile profile and authorized tools.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,settle,chromium,friendHandle}=await import('./mobile-profile-refinement.mjs');
const {applyTextScale}=await import('./text-scale.mjs');
const output=process.argv[2] || '.local/profile-tools-evidence';await fs.mkdir(output,{recursive:true});
const server=await serve(process.cwd());const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium'});const results=[];
try {
for(const width of [320,360,390])for(const theme of ['light','dark'])for(const scale of [1,2]){
 const result={width,theme,scale,checks:[]};const {page,context,audit}=await newPage(browser,{width,theme},server.origin,result);
 await context.route(`${server.origin}/**/*`,async route=>{const url=new URL(route.request().url());if(/\.(css|js)$/.test(url.pathname))await new Promise(r=>setTimeout(r,url.pathname.endsWith('.css')?150:300));await route.fallback();});
 await context.addInitScript(()=>{window.__profileFrames=[];const sample=()=>{const profile=document.querySelector('[data-profile-mobile-layout] #socialProfile:not([hidden])');const tools=document.querySelector('[data-tools-mobile-layout] #toolsGrid .hub-card');if(profile&&!window.__intentionalEdit)window.__profileFrames.push({editorVisible:!document.querySelector('#profileEditor').hidden,font:getComputedStyle(document.querySelector('#profileName')).fontSize});if(tools)window.__profileFrames.push({icon:getComputedStyle(tools.querySelector('.hub-card-icon')).width});requestAnimationFrame(sample);};requestAnimationFrame(sample);});
 await page.goto(server.origin+'/perfil/');await ready(page,'/perfil/');
 assert.equal(await page.locator('#profileEditor').isVisible(),false);
 const firstFrames=await page.evaluate(()=>window.__profileFrames);assert(firstFrames.length);assert(firstFrames.every(f=>f.editorVisible!==true&&(!f.font||f.font==='26px')));
 const documentId=await page.evaluate(()=>window.__refinementDocument);
 process.env.TEXT_SCALE=scale===2?'2':'';await applyTextScale(page);
 await page.screenshot({path:`${output}/profile-${width}-${theme}-${scale}.png`,fullPage:true});
 const checkFit=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await checkFit();
 const profile=await page.evaluate(async()=> (await window.PortalSocial.api('/api/social/me')).profile);
 let fail=true;await context.route('**/api/social/me',async route=>{if(route.request().method()!=='PATCH')return route.fallback();const body=route.request().postDataJSON();if(fail)return route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({error:'Falha sintética de validação.'})});Object.assign(profile,body);return route.fulfill({contentType:'application/json',body:JSON.stringify({profile})});});
 await page.evaluate(()=>{window.__intentionalEdit=true;window.__profileFrames=[];});
 await page.locator('#profileEditToggle').focus();await page.keyboard.press('Enter');await page.locator('#profileEditStatus').waitFor({state:'visible'});
 assert.equal(await page.locator('#profileEditToggle').getAttribute('aria-expanded'),'true');
 await page.locator('#profileEditBio').fill('Rascunho sintético intencional.');
 await page.evaluate(()=>window.PortalCitizenShell.navigate(new URL('/',location.href))) ;await ready(page,'/');
 await page.evaluate(()=>window.PortalCitizenShell.navigate(new URL('/perfil/',location.href)));await ready(page,'/perfil/');
 assert.equal(await page.locator('#profileEditBio').inputValue(),'Rascunho sintético intencional.');assert(await page.locator('#profileEditor').isVisible());assert.equal(await page.evaluate(()=>window.__refinementDocument),documentId);
 await page.locator('#profileEditorForm [type=submit]').click();await page.locator('#socialStatus').filter({hasText:'Falha sintética'}).waitFor();assert(await page.locator('#profileEditor').isVisible());assert.equal(await page.locator('#profileEditBio').inputValue(),'Rascunho sintético intencional.');
 fail=false;await page.locator('#profileEditorForm [type=submit]').click();await page.locator('#profileEditor').waitFor({state:'hidden'});assert.equal(await page.locator('#profileBio').textContent(),'Rascunho sintético intencional.');assert(await page.locator('#profileEditToggle').evaluate(n=>n===document.activeElement));
 await page.locator('#profileEditToggle').click();await page.locator('#profileEditBio').fill('Descartar.');await page.locator('#profileEditCancel').click();assert(await page.locator('#profileEditor').isHidden());await page.locator('#profileEditToggle').click();assert.equal(await page.locator('#profileEditBio').inputValue(),'Rascunho sintético intencional.');await page.locator('#profileEditCancel').click();
 await page.locator('#homeAccountMenu summary').click();assert.equal(await page.locator('a[href="/ferramentas/"]:visible').count(),0);await page.keyboard.press('Escape');
 await page.evaluate(()=>window.PortalCitizenShell.navigate(new URL('/perfil/?u=fixture.friend',location.href)));await ready(page,'/perfil/?u='+friendHandle);assert(await page.locator('#profileEditor').isHidden());assert(await page.locator('#profilePhotoCamera').isHidden());assert.equal(await page.locator('#profileEditToggle').count(),0);
 await page.evaluate(()=>{window.__intentionalEdit=false;window.__profileFrames=[];return window.PortalCitizenShell.navigate(new URL('/ferramentas/',location.href));});await ready(page,'/ferramentas/');await applyTextScale(page);await checkFit();
 const tools=await page.evaluate(()=>({cards:[...document.querySelectorAll('#toolsGrid a')].map(a=>({id:a.dataset.module,text:a.textContent,href:a.getAttribute('href'),height:a.getBoundingClientRect().height})),bottom:document.querySelector('.portal-section').getBoundingClientRect().bottom+scrollY,icons:[...document.querySelectorAll('#toolsGrid .hub-card-icon')].map(n=>n.getBoundingClientRect().width)}));assert(tools.cards.length>0);assert(tools.cards.every(c=>c.height>=48));assert(tools.icons.every(w=>w===44));
 await page.screenshot({path:`${output}/tools-${width}-${theme}-${scale}.png`,fullPage:true});
 const toolsFrames=await page.evaluate(()=>window.__profileFrames.filter(f=>f.icon));assert(toolsFrames.length);assert(toolsFrames.every(f=>f.icon==='44px'));
 for(let n=0;n<2;n++){await page.evaluate(()=>window.PortalCitizenShell.navigate(new URL('/',location.href)));await ready(page,'/');await page.evaluate(()=>window.PortalCitizenShell.navigate(new URL('/ferramentas/',location.href)));await ready(page,'/ferramentas/');assert(await page.locator('#toolsGrid .hub-card-icon').first().evaluate(n=>getComputedStyle(n).width==='44px'));}
 await page.goto(server.origin+'/perfil/');await ready(page,'/perfil/');assert(await page.locator('#profileEditor').isHidden());
 results.push({...result,firstFrames:firstFrames.length,toolsFrames:toolsFrames.length,tools,entries:8,unmappedApiCalls:audit.unmappedApiCalls});await context.close();console.log(JSON.stringify({width,theme,scale,passed:true}));
}
await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
