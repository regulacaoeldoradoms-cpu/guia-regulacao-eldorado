// Synthetic citizen journeys through the existing account links. No API writes.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {applyTextScale} from './text-scale.mjs';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,settle,chromium}=await import('./mobile-profile-refinement.mjs');
const root=process.env.PORTAL_ROOT || path.resolve(import.meta.dirname,'../..');
const output=process.env.HEADER_OUTPUT || path.join(root,'.local/shared-account-header');
const secondary=['/configuracoes/','/seguranca/','/conquistas/','/ferramentas/','/cidadao/'];
const primary=['/','/amigos/','/perfil/','/mascotes/'];
const rows=[];
await fs.mkdir(output,{recursive:true});
const server=await serve(root);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
async function active(page,route){
  await page.waitForFunction(route=>window.PortalCitizenShell?.active().url.pathname===route && !window.PortalCitizenShell.diagnostics().navigating,route);
  await ready(page,route); await applyTextScale(page); await settle(page);
}
async function visit(page,route){
  if(await page.evaluate(()=>PortalCitizenShell.active().url.pathname)===route)return;
  if(route==='/cidadao/'){
    await visit(page,'/ferramentas/');
    await page.locator('#toolsGrid a[href="/cidadao/"]').click();
  }else if(primary.includes(route))await page.locator(`.social-mobile-nav a[href="${route}"]`).click();
  else{
    if(route==='/ferramentas/') await visit(page,'/');
    await page.locator('#homeAccountMenu > summary').click();
    await page.locator(`#homeAccountPanel a[href="${route}"]`).click();
  }
  await active(page,route);
}
async function inspect(page){
  return page.evaluate(()=>{
    const header=document.querySelector('.portal-topbar'),title=header.querySelector('h1'),menu=document.getElementById('homeAccountMenu'),summary=menu.querySelector('summary');
    const rect=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const box=getComputedStyle(header),inner=getComputedStyle(header.querySelector('.portal-topbar-inner'));
    return {headerBox:{top:box.borderTopWidth,bottom:box.borderBottomWidth,paddingTop:box.paddingTop,paddingBottom:box.paddingBottom,innerHeight:inner.height,innerTop:inner.borderTopWidth,innerBottom:inner.borderBottomWidth},text:title.textContent,header:rect(header),title:rect(title),account:rect(summary),fits:title.scrollWidth<=title.clientWidth+1,menuVisible:!menu.hidden,menuOpen:menu.open,headers:document.querySelectorAll('.portal-topbar').length,menus:document.querySelectorAll('#homeAccountMenu').length,oldMenus:document.querySelectorAll('#profileAccountMenu').length,logout:document.querySelectorAll('#portalLogout').length,navTools:document.querySelectorAll('.social-mobile-nav a[href="/ferramentas/"]').length,profileTools:document.querySelectorAll('#socialProfile a[href="/ferramentas/"]').length,nav:[...document.querySelectorAll('.social-mobile-nav > *')].map(e=>e.id || e.getAttribute('href')),address:location.pathname,same:!window.__accountHeaderOwners || window.__accountHeaderOwners.every((node,i)=>node===[document,header,menu,document.querySelector('.social-mobile-nav'),document.getElementById('portalLogout'),window[Symbol.for('portal.citizenMobileHeader')]][i])};
  });
}
async function verify(page,result,reference){
  const state=await inspect(page);result.states.push(state);
  assert.equal(state.text,'Portal da regulação');assert.equal(state.headers,1);assert.equal(state.menus,1);assert.equal(state.oldMenus,0);assert.equal(state.logout,1);assert.ok(state.menuVisible);assert.ok(!state.menuOpen);assert.ok(state.same);assert.ok(state.fits);assert.equal(state.navTools,0);assert.equal(state.profileTools,0);
  assert.deepEqual(state.header,reference.header,JSON.stringify({route:await page.evaluate(()=>PortalCitizenShell.active().url.pathname),state:state.headerBox,reference:reference.headerBox}));assert.deepEqual(state.title,reference.title);assert.deepEqual(state.account,reference.account);assert.deepEqual(state.nav,reference.nav);
  assert.ok(state.title.right<=result.width && state.account.right<=result.width);assert.ok(state.title.right<=state.account.x || state.title.bottom<=state.account.y || state.account.bottom<=state.title.y);
  const route=await page.evaluate(()=>PortalCitizenShell.active().url.pathname);
  assert.equal(state.address,primary.includes(route)?'/':route,'Preserve the existing public URL policy');
  await page.locator('#homeAccountMenu > summary').click();await page.locator('#portalLogout').waitFor({state:'visible'});
  assert.ok(await page.locator('#homeAccountPanel').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && e.scrollWidth<=e.clientWidth+1;}));
  await page.keyboard.press('Escape');assert.ok(await page.locator('#homeAccountMenu').evaluate(e=>!e.open && e.querySelector('summary')===document.activeElement));
}
try{
  for(const theme of ['light','dark'])for(const width of (process.env.WIDTHS || '320,390').split(',').map(Number))for(const entry of (process.env.ENTRIES || ['/',...secondary].join(',')).split(',')){
    const result={theme,width,entry,errors:[],states:[]};const {page,context,audit}=await newPage(browser,{theme,width},server.origin,result);
    try{
      await page.goto(server.origin+entry);await active(page,entry);
      await page.evaluate(()=>window.__accountHeaderOwners=[document,document.querySelector('.portal-topbar'),document.getElementById('homeAccountMenu'),document.querySelector('.social-mobile-nav'),document.getElementById('portalLogout'),window[Symbol.for('portal.citizenMobileHeader')]]);
      const reference=await inspect(page);await verify(page,result,reference);
      const docs=audit.documents.length;
      if(entry==='/'){
        await page.locator('.home-composer-trigger').click();
        await page.locator('#socialComposerText').fill('Rascunho sintético preservado');
        const profileToolsBefore=await page.locator('#socialProfile a[href="/ferramentas/"]').count();
        for(const route of [...secondary,'/perfil/','/amigos/','/mascotes/','/',...secondary,'/']){await visit(page,route);await verify(page,result,reference);}
        assert.equal(await page.locator('#socialComposerText').inputValue(),'Rascunho sintético preservado');
        assert.equal(await page.locator('#socialProfile a[href="/ferramentas/"]').count(),profileToolsBefore);
        await visit(page,'/configuracoes/');await page.locator('#socialProfileVisibility').selectOption('friends');
        await visit(page,'/seguranca/');await page.locator('#newPassword').fill('Synthetic unsent password');
        await page.evaluate(()=>window.scrollTo(0,150));const scroll=await page.evaluate(()=>scrollY);
        await visit(page,'/');await visit(page,'/seguranca/');assert.equal(await page.locator('#newPassword').inputValue(),'Synthetic unsent password');assert.equal(await page.evaluate(()=>scrollY),scroll);
        await visit(page,'/configuracoes/');assert.equal(await page.locator('#socialProfileVisibility').inputValue(),'friends');
        await visit(page,'/');
      }else{
        // The native Perfil link works from direct entry; Home supplies its
        // existing preference links when visited, without adding new accesses.
        await page.locator('#homeAccountMenu > summary').click();await page.locator('#homeAccountPanel .portal-account-area').click();await active(page,'/perfil/');await verify(page,result,reference);
        await visit(page,'/');await verify(page,result,reference);await visit(page,entry);await verify(page,result,reference);
        await page.screenshot({path:path.join(output,`${theme}-${width}-${entry.slice(1,-1)}-${process.env.TEXT_SCALE || 1}.png`)});
      }
      assert.equal(audit.documents.length,docs,'All later area switches retain the document');assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);assert.ok(!audit.apiCalls.some(call=>/^(POST|PATCH|PUT|DELETE) \/api\/(auth\/security|social\/me|auth\/password)/.test(call)),'Draft checks do not write account data');
      rows.push(result);console.log(JSON.stringify({theme,width,entry,states:result.states.length,documents:docs,errors:result.errors}));
    }finally{await context.close();await fs.writeFile(path.join(output,'results.json'),JSON.stringify(rows,null,2));}
  }
}finally{await browser.close();await new Promise(resolve=>server.server.close(resolve));}
