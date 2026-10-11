import { applyTextScale } from './text-scale.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY = '1';
const {serve, newPage, ready, chromium} = await import('./mobile-profile-refinement.mjs');
const root = process.env.PORTAL_ROOT || path.resolve(import.meta.dirname, '../..');
const output = process.env.HEADER_OUTPUT || path.join(root, '.local/shared-header');
await fs.mkdir(output, {recursive:true});
const server = await serve(root);
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
const rows = [];
try {
  for (const theme of ['light','dark']) for (const width of (process.env.WIDTHS || '320,390,900,1440').split(',').map(Number)) {
    const result = {theme,width,errors:[],states:[]};
    const {page,context,audit} = await newPage(browser,{width,theme},server.origin,result);
    try {
      await page.goto(server.origin + '/'); await ready(page,'/');
      await page.waitForFunction(() => !window.PortalCitizenShell || !window.PortalCitizenShell.diagnostics().prewarming);
      await page.evaluate(() => { window.__headerNodes={doc:document,header:document.querySelector('.portal-topbar'),brand:document.querySelector('.portal-brand'),menu:document.querySelector('#homeAccountMenu'),nav:document.querySelector('.social-mobile-nav'),logout:document.querySelector('#portalLogout'),controller:window[Symbol.for('portal.citizenMobileHeader')]}; });
      for (const route of ['/', '/amigos/', '/perfil/', '/mascotes/', '/perfil/', '/', '/mascotes/', '/amigos/', '/']) {
        if (route !== (await page.evaluate(() => window.PortalCitizenShell?.active().url.pathname || location.pathname))) {
          if (width<=900) await page.locator(`.social-mobile-nav a[href="${route}"]`).click();
          else await page.goto(server.origin+route);
          if (width<=900) await ready(page,route);
          else await page.waitForFunction(()=>document.querySelector('.portal-account-area') && !/Carregando/.test(document.querySelector('#portalUserName')?.textContent || ''));

        }
        await applyTextScale(page);
        const state = await page.evaluate(() => {
          const header=document.querySelector('.portal-topbar'); const title=header.querySelector('.portal-brand-copy h1');
          const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
          const visible=[...header.querySelectorAll('details')].filter(e=>!e.hidden && e.getBoundingClientRect().height>0);
          const summary=visible[0]?.querySelector('summary');
          return {menuCount:document.querySelectorAll('#homeAccountMenu').length,profileMenus:document.querySelectorAll('#profileAccountMenu').length,text:title?.textContent,headers:document.querySelectorAll('.portal-topbar').length,visibleMenus:visible.map(e=>e.id),title:title?rect(title):null,account:summary?rect(summary):null,header:rect(header),font:title?getComputedStyle(title).fontSize:null,titleFits:!title || title.scrollWidth<=title.clientWidth+1,width:document.documentElement.scrollWidth,address:location.pathname,same:!!window.__headerNodes && document===window.__headerNodes.doc && header===window.__headerNodes.header && header.querySelector('.portal-brand')===window.__headerNodes.brand && document.querySelector('#homeAccountMenu')===window.__headerNodes.menu && document.querySelector('.social-mobile-nav')===window.__headerNodes.nav && document.querySelector('#portalLogout')===window.__headerNodes.logout && window[Symbol.for('portal.citizenMobileHeader')]===window.__headerNodes.controller};
        });
        result.states.push({route,...state});
        if (!process.env.HEADER_BASELINE && width<=900) {
          assert.equal(state.text,'Portal da regulação'); assert.equal(state.headers,1);
          const first=result.states[0]; assert.deepEqual(state.header,first.header,'Header geometry remains Home geometry'); assert.deepEqual(state.title,first.title,'Title geometry remains Home geometry'); assert.deepEqual(state.account,first.account,'Conta geometry remains Home geometry'); assert.deepEqual(state.visibleMenus,['homeAccountMenu']); assert.equal(state.menuCount,1); assert.equal(state.profileMenus,0);
          assert.ok(state.same,'Document/header/brand/menu/logout/navigation retain identity'); assert.equal(state.address,'/'); assert.equal(state.width,width); assert.ok(state.titleFits);
          const t=state.title,a=state.account; assert.ok(t.right<=width && a.right<=width && a.height>=44); assert.ok(t.right<=a.x || t.bottom<=a.y || a.bottom<=t.y,'Title and Conta do not overlap');
          await page.locator('#homeAccountMenu > summary').click(); assert.ok(await page.locator('#homeAccountMenu').evaluate(e=>e.open));
          await page.locator('#portalLogout').waitFor({state:'visible'});
          assert.ok(await page.locator('#homeAccountPanel').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && e.scrollWidth<=e.clientWidth+1;}),'Expanded account fits viewport');
          assert.equal(await page.locator('#portalLogout').count(),1);
          await page.keyboard.press('Escape');
          assert.ok(await page.locator('#homeAccountMenu').evaluate(e=>!e.open && e.querySelector('summary')===document.activeElement),'Escape closes one shared menu and restores focus');
          assert.deepEqual(await page.locator('#homeAccountMenu > summary').evaluate(e=>{const s=getComputedStyle(e);return {width:s.outlineWidth,offset:s.outlineOffset};}),{width:'3px',offset:'3px'},'Conta keeps the approved Home keyboard focus');
          if (route==='/amigos/' || route==='/mascotes/' || route==='/perfil/') await page.screenshot({path:path.join(output,`${theme}-${width}-${route.slice(1,-1)}-${process.env.TEXT_SCALE || 1}.png`)});
        }
      }
      assert.deepEqual(result.errors,[]); assert.deepEqual(audit.unmappedApiCalls,[]);
      if (!process.env.HEADER_BASELINE && width<=900) assert.equal(audit.documents.length,1,'No document reload across shared views');
      rows.push(result); console.log(JSON.stringify({theme,width,states:result.states.length,errors:result.errors}));
    } finally { await context.close(); await fs.writeFile(path.join(output,'results.json'),JSON.stringify(rows,null,2)); }
  }
} finally { await browser.close(); await new Promise(r=>server.server.close(r)); }
