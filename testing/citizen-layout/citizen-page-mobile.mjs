// Citizen data below is invented. All network remains in the local fixture.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {applyTextScale} from './text-scale.mjs';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,settle,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'),output=process.env.CITIZEN_PAGE_OUTPUT || path.join(root,'.local/citizen-page-mobile');
const item={protocol:'CMS-2026-000001',subject:'Sugestão fictícia sobre o espaço de espera',description:'Relato inteiramente sintético para conferir leitura e acompanhamento.',type:'sugestao',status:'recebida',privacyMode:'sigilosa',createdAt:'2026-10-09T12:00:00Z'};
const rows=[];await fs.mkdir(output,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
async function active(page,route){await page.waitForFunction(route=>PortalCitizenShell.active().url.pathname===route && !PortalCitizenShell.diagnostics().navigating,route);await ready(page,route);await settle(page);}
async function noOverflow(page,selector){const result=await page.locator(selector).evaluate(e=>({scroll:e.scrollWidth,width:e.clientWidth}));assert.ok(result.scroll<=result.width+1,`${selector} overflows: ${JSON.stringify(result)}`);}
async function accountHelp(page,result,entry){
  const help=page.locator('.citizen-account-help'),summary=help.locator(':scope > summary'),notice=help.locator('#accountEvolutionNotice');
  await help.waitFor({state:'visible'});assert.equal(await summary.textContent(),'Sobre sua conta e privacidade');
  assert.equal(await help.evaluate(e=>e.tagName),'DETAILS');assert.equal(await summary.evaluate(e=>e.tagName),'SUMMARY');
  if(await help.evaluate(e=>e.open))await summary.click();
  assert.ok(!await notice.isVisible());
  for(let cycle=0;cycle<3;cycle++){
    await summary.click();assert.ok(await help.evaluate(e=>e.open));await notice.waitFor({state:'visible'});
    assert.match(await notice.textContent(),/Conta Prata.*e-mail.*confirmado.*identidade sigilosa.*identificar ao Conselho.*e-mail continua protegido/s);
    const geometry=await help.evaluate(e=>{const n=e.querySelector('#accountEvolutionNotice'),s=e.querySelector('summary'),r=n.getBoundingClientRect(),h=e.getBoundingClientRect();return{height:r.height,top:r.top,summaryBottom:s.getBoundingClientRect().bottom,bottom:r.bottom,helpBottom:h.bottom,scroll:n.scrollHeight,client:n.clientHeight,overflow:getComputedStyle(e).overflowY};});
    assert.ok(geometry.height>100&&geometry.top>=geometry.summaryBottom-1&&geometry.bottom<=geometry.helpBottom+1,'Full explanation appears below summary inside expanded disclosure');
    assert.ok(geometry.scroll<=geometry.client+1,'Explanation is not vertically clipped');await noOverflow(page,'html');await noOverflow(page,'.citizen-account-help');
    await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
    assert.ok(await notice.evaluate(n=>n.getBoundingClientRect().bottom<=document.querySelector('.social-mobile-nav').getBoundingClientRect().top+1),'Last line remains reachable above persistent navigation at page end');
    if(cycle===0)await page.screenshot({path:path.join(output,`${result.theme}-${result.width}-${entry}-help-${process.env.TEXT_SCALE || 1}.png`),fullPage:true});
    await summary.click();assert.ok(!await help.evaluate(e=>e.open));assert.ok(!await notice.isVisible());
  }
  await summary.focus();assert.ok(await summary.evaluate(e=>e===document.activeElement));await page.keyboard.press('Enter');assert.ok(await help.evaluate(e=>e.open));assert.ok(await notice.isVisible());await page.keyboard.press('Space');assert.ok(!await help.evaluate(e=>e.open));assert.ok(!await notice.isVisible());
  result.accountHelp ||= [];result.accountHelp.push({entry,cycles:3,keyboard:'native Enter opens / Space closes',visibleContent:true});
}
try{
  for(const theme of ['light','dark'])for(const width of (process.env.WIDTHS || '320,360,390').split(',').map(Number)){
    const result={theme,width,errors:[],writes:[]};const {page,context,audit}=await newPage(browser,{theme,width},server.origin,result);
    try{
      await context.route('**/api/council/**',route=>{
        const pathname=new URL(route.request().url()).pathname,method=route.request().method();let payload;
        if(method!=='GET'){result.writes.push({pathname,method});payload={ok:true};}
        else if(pathname==='/api/council/my')payload={manifestations:[item]};
        else if(pathname==='/api/council/notifications')payload={notifications:[{id:1,title:'Resposta fictícia do Conselho',protocol:item.protocol,createdAt:item.createdAt,readAt:null}]};
        else if(pathname==='/api/council/manifestations/'+item.protocol)payload={manifestation:item,messages:[],events:[],attachments:[]};
        else return route.fallback();
        return route.fulfill({contentType:'application/json',body:JSON.stringify(payload)});
      });
      await page.goto(server.origin+'/cidadao/');await active(page,'/cidadao/');await page.locator('body.citizen-mobile-presentation').waitFor();await page.locator('.manifestation-item').waitFor();await applyTextScale(page);await settle(page);
      assert.equal(await page.evaluate(()=>RegulationAuth.getCachedUser().role),'cidadao');
      await noOverflow(page,'html');assert.equal(await page.locator('.portal-topbar h1').textContent(),'Portal da regulação');assert.equal(await page.locator('#homeAccountMenu').count(),1);assert.equal(await page.locator('#profileAccountMenu').count(),0);
      assert.ok(await page.locator('.portal-topbar .portal-symbol').getAttribute('src').then(src=>src.includes('portal-regulacao-header_180x180')));
      await page.evaluate(()=>window.__citizenOwners={document,header:document.querySelector('.portal-topbar'),nav:document.querySelector('.social-mobile-nav'),form:document.getElementById('newManifestationForm'),controller:window[Symbol.for('portal.citizenMobilePresentation')]});
      const action=await page.locator('#openNewManifestation').boundingBox();assert.ok(action.height>=48);if(process.env.TEXT_SCALE!=='2')assert.ok(action.y+action.height<700,'Main action is reachable in the first screen');
      await page.locator('#homeAccountMenu > summary').click();await page.locator('#portalLogout').waitFor({state:'visible'});await page.keyboard.press('Escape');assert.ok(await page.locator('#homeAccountMenu').evaluate(e=>!e.open));
      await page.screenshot({path:path.join(output,`${theme}-${width}-page-${process.env.TEXT_SCALE || 1}.png`),fullPage:true});
      await accountHelp(page,result,'direct');
      await page.locator('#openNewManifestation').click();await page.locator('#newManifestationModal.open').waitFor();await noOverflow(page,'#newManifestationModal .citizen-modal-panel');assert.equal(await page.locator('#newManifestationModal .citizen-modal-head').evaluate(e=>getComputedStyle(e).position),'relative','Header remains outside the scrolling form');
      await page.locator('.manifestation-type-card').filter({has:page.locator('input[value="sugestao"]')}).click();assert.ok(await page.locator('input[name=manifestationType][value=sugestao]').isChecked());
      await page.locator('#manifestationSubject').fill('Rascunho sintético preservado');await page.locator('#manifestationDescription').fill('Relato fictício sem envio de informações ao serviço.');
      assert.ok(await page.locator('#manifestationSubject').evaluate(e=>e.required && e.minLength===3 && e.maxLength===180));assert.ok(await page.locator('#manifestationConfirm').evaluate(e=>e.required && !e.checked));
      assert.match(await page.locator('#composeIdentityWarning').textContent(),/CPF|Cartão SUS/);
      await page.locator('.compose-info summary').click();assert.match(await page.locator('.compose-info').textContent(),/urgência ou emergência/);
      await page.locator('.privacy-option').filter({has:page.locator('input[value=identificada]')}).click();assert.ok(await page.locator('input[name=manifestationPrivacy][value=identificada]').isChecked());
      await page.locator('#newPrivacyNotice').waitFor({state:'visible'});assert.match(await page.locator('#newPrivacyNotice').textContent(),/e-mail.*protegido/);
      assert.ok(await page.locator('#newManifestationForm').evaluate(e=>e.scrollTop>0),'Privacy controls are reachable by scrolling the form');await page.screenshot({path:path.join(output,`${theme}-${width}-form-${process.env.TEXT_SCALE || 1}.png`),fullPage:true});
      await page.locator('#newManifestationModal [data-close-modal]').first().click();await page.locator('.citizen-mobile-tab[data-tab=notifications]').click();assert.equal(await page.locator('.citizen-mobile-tab[data-tab=notifications]').getAttribute('aria-selected'),'true');
      await page.locator('#markNotificationsRead').click();await page.waitForFunction(()=>true);await page.locator('.citizen-mobile-tab[data-tab=manifestations]').click();
      await page.locator('.manifestation-item').click();await page.locator('#detailContent:not([hidden])').waitFor();assert.equal(await page.locator('#detailSubject').textContent(),item.subject);assert.equal(await page.locator('#detailStatus').textContent(),'Recebida');
      await page.locator('#manifestationDetailModal [data-close-modal]').first().click();
      const docs=audit.documents.length;
      await page.locator('.social-mobile-nav a[href="/perfil/"]').click();await active(page,'/perfil/');assert.ok(!await page.locator('body').evaluate(e=>e.classList.contains('citizen-mobile-presentation')));
      await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));await active(page,'/cidadao/');assert.equal(await page.locator('#manifestationSubject').inputValue(),'Rascunho sintético preservado');assert.ok(await page.locator('input[name=manifestationPrivacy][value=identificada]').isChecked());
      assert.equal(await page.evaluate(()=>location.pathname),'/cidadao/');assert.ok(await page.evaluate(()=>{const o=window.__citizenOwners;return o.document===document && o.header===document.querySelector('.portal-topbar') && o.nav===document.querySelector('.social-mobile-nav') && o.form===document.getElementById('newManifestationForm') && o.controller===window[Symbol.for('portal.citizenMobilePresentation')];}));assert.equal(audit.documents.length,docs);
      await applyTextScale(page);await accountHelp(page,result,'shell-return');
      assert.deepEqual(result.writes,[{pathname:'/api/council/notifications',method:'PATCH'}],'Native read action executes once; no manifestation is submitted');assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
      await page.goto(server.origin+'/');await active(page,'/');await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));await active(page,'/cidadao/');await applyTextScale(page);await accountHelp(page,result,'shell-new');assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
      rows.push(result);console.log(JSON.stringify({theme,width,errors:result.errors,writes:result.writes}));
    }finally{await context.close();await fs.writeFile(path.join(output,'results.json'),JSON.stringify(rows,null,2));}
  }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
