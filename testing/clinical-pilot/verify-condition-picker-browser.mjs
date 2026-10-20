// Clinical pages with synthetic auth; only public assets from the selected origin.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const require=createRequire(new URL('../browser/package.json',import.meta.url));
const {chromium}=require(process.env.CLINICAL_PILOT_PLAYWRIGHT||'playwright');
const output=path.resolve(process.argv[2]||path.join(root,'.local/condition-picker'));
fs.mkdirSync(output,{recursive:true});
const source=fs.readFileSync(path.join(root,'data/protocol-source.html'));
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
  const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(req.method!=='GET'||!file.startsWith(root)){res.writeHead(403);res.end();return;}
  try{res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8'});res.end(fs.readFileSync(file));}
  catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=process.env.CLINICAL_PICKER_ORIGIN||'http://127.0.0.1:'+server.address().port;
let browser;
const report=[];
try{
  browser=await chromium.launch({headless:true,...(process.env.CLINICAL_PILOT_BROWSER?{executablePath:process.env.CLINICAL_PILOT_BROWSER}:{})});
  for(const width of [390,1366])for(const theme of ['light','dark']){
    if(process.env.CLINICAL_PICKER_CASE&&process.env.CLINICAL_PICKER_CASE!==`${width}-${theme}`)continue;
    const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await context.addInitScript(theme=>{
      localStorage.setItem('regulacao.portal.theme.active.v1',theme);
      const user={name:'Teste sintético',username:'teste-local',role:'medico',interfaceTheme:theme};
      window.RegulationAuth={enforcementEnabled:false,requireRole:async()=>user,getCachedUser:()=>user,getToken:()=>null,logout:async()=>{}};
    },theme);
    await page.route('**/*',async route=>{
      const url=new URL(route.request().url());
      if(['/js/auth-config.js','/js/auth-client.js','/js/auth-fetch-bridge.js','/js/portal-global-chat.js','/js/pets-bootstrap.js','/js/portal-performance.js','/js/portal-observability.js','/js/portal-pwa.js'].includes(url.pathname))return route.fulfill({contentType:'text/javascript',body:''});
      if(url.hostname==='raw.githubusercontent.com')return route.fulfill({contentType:'text/html',body:source});
      if(url.origin!==origin)return route.abort();
      if(route.request().method()!=='GET'||url.pathname.startsWith('/api/'))return route.abort();
      return route.continue();
    });
    await page.goto(origin+'/medico/',{waitUntil:'networkidle'});
    await page.evaluate(()=>window.ClinicalConditionPilot.ready);
    const select=async id=>{
      await page.locator('#sideSearchInput').fill('');
      await page.locator('#protocolList [data-id="'+id+'"]').click();
    };
    await select('neuropediatria');
    const general=page.locator('[data-pilot-general-protocol="neuropediatria"]');
    assert.equal(await general.isVisible(),true);
    assert.ok(await general.locator('.medical-checklist input').count()>=3);
    for(let i=0;i<3;i++)await general.locator('.medical-checklist input').nth(i).check();
    await general.evaluate(node=>{window.__generalNode=node;window.__generalText=node.textContent;window.__generalChecks=[...node.querySelectorAll('.medical-checklist input')];});
    const restored=async()=>{
      assert.equal(await general.isVisible(),true);
      const preserved=await page.evaluate(()=>{const node=document.querySelector('[data-pilot-general-protocol="neuropediatria"]'),checks=[...node.querySelectorAll('.medical-checklist input')];return window.__generalNode===node&&window.__generalText===node.textContent&&checks.length===window.__generalChecks.length&&checks.every((input,i)=>input===window.__generalChecks[i]);});
      assert.equal(preserved,true);
      assert.equal(await general.locator('.medical-checklist input:checked').count(),3);
      assert.equal(await page.evaluate(()=>window.ClinicalConditionPilot.active()),null);
      assert.equal(new URL(page.url()).searchParams.has('condicao'),false);
      assert.equal(new URL(page.url()).searchParams.get('protocolo'),'neuropediatria');
    };
    const toggle=page.locator('.cp-condition-toggle'),grid=page.locator('.cp-condition-grid');
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    assert.equal(await grid.isVisible(),false);
    assert.equal(await grid.locator('button').count(),8);
    assert.equal(await toggle.getAttribute('aria-controls'),await grid.getAttribute('id'));
    // Tab must skip all concealed cards.
    await toggle.focus();await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>Boolean(document.activeElement.closest('.cp-condition-grid'))),false);
    await toggle.focus();await page.keyboard.press('Enter');
    assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    assert.equal(await grid.isVisible(),true);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.condition),'digsaude.neuropediatria.convulsao-epilepsia');
    await toggle.focus();
    assert.equal(await toggle.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
    await page.keyboard.press('Space');assert.equal(await grid.isVisible(),false);
    await toggle.click();assert.equal(await grid.isVisible(),true);
    const geometry=await grid.evaluate(el=>({width:el.getBoundingClientRect().width,scroll:el.scrollWidth,columns:getComputedStyle(el).gridTemplateColumns.split(' ').length}));
    assert.ok(geometry.scroll<=geometry.width+1,'cards sem overflow');
    assert.equal(geometry.columns,width<900?1:2);
    assert.equal(await page.locator('.cp-condition-card svg,.cp-condition-card img,.cp-condition-card .cp-condition-chevron').count(),0);
    const picker=page.locator('.cp-condition-picker');
    const bounds=await picker.boundingBox();
    assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width+1,'seletor contido no viewport');
    const cards=grid.locator('[data-condition]'),ids=await cards.evaluateAll(nodes=>nodes.map(node=>node.dataset.condition));
    const criteria=page.locator('[data-pilot-criteria-content]');
    const choose=async id=>{
      const card=grid.locator('[data-condition="'+id+'"]');
      await card.click();
      assert.equal(await grid.isVisible(),true);
      assert.equal(await page.locator('[data-clinical-condition-id]').count(),1);
      assert.equal(await card.getAttribute('aria-expanded'),'true');
      assert.equal(await card.getAttribute('data-selected'),'true');
      assert.equal(await criteria.isVisible(),true);
      assert.equal(await general.isVisible(),false);
      const result=await page.evaluate(()=>{
        const api=window.ClinicalConditionPilot,ctx=api.active(),record=api.record(ctx.record.id);
        const print=new DOMParser().parseFromString(api.printDocument(),'text/html');
        return {id:ctx.record.id,rules:[...document.querySelectorAll('[data-pilot-criteria-content] [data-clinical-rule]')].map(node=>node.dataset.clinicalRule).sort(),printRules:[...print.querySelectorAll('[data-clinical-rule]')].map(node=>node.dataset.clinicalRule).sort(),expected:record.rules.map(rule=>rule.id).sort(),context:JSON.stringify(api.protocolContext(ctx).clinicalConditionRecord)===JSON.stringify(record),print:api.printDocument().includes(record.reference)};
      });
      assert.equal(result.id,id);assert.deepEqual(result.rules,result.expected);assert.deepEqual(result.printRules,result.expected);assert.ok(result.context&&result.print);
      assert.equal(new URL(page.url()).searchParams.get('protocolo'),'neuropediatria');
      assert.equal(new URL(page.url()).searchParams.get('condicao'),id);
      assert.equal(await page.locator('#protocolList [data-id="neuropediatria"]').getAttribute('class').then(c=>c.includes('active')),true);
    };
    await choose(ids[0]);
    const firstCard=cards.first();
    assert.equal(await page.locator('[data-pilot-age]').count(),0);
    // An age supplied by the existing query/context still works without an input.
    await page.evaluate(id=>window.ClinicalConditionPilot.render({id:'neuropediatria'},{conditionId:id,query:'convulsão 17 anos'}),ids[0]);
    await page.locator('[data-pilot-criteria-toggle]').first().click();
    assert.equal(await criteria.isVisible(),false);assert.equal(await grid.isVisible(),true);
    assert.equal(await page.locator('[data-clinical-condition-id]').count(),1);
    assert.equal(await firstCard.getAttribute('aria-expanded'),'false');
    await restored();
    // Reopening preserves the age already supplied by the query.
    await firstCard.focus();await page.keyboard.press('Space');
    assert.equal(await criteria.isVisible(),true);assert.equal(await page.evaluate(()=>window.ClinicalConditionPilot.active().age.years),17);
    await firstCard.focus();await page.keyboard.press('Enter');assert.equal(await criteria.isVisible(),false);
    await restored();
    await firstCard.click();
    await page.locator('[data-pilot-criteria-bottom]').click();
    assert.equal(await criteria.isVisible(),false);assert.equal(await firstCard.evaluate(node=>node===document.activeElement),true);
    assert.equal(await grid.isVisible(),true);
    await restored();
    // Same stable cards survive repeated changes; no duplicate content or listeners.
    for(const id of ids){await choose(id);await page.locator('[data-pilot-criteria-toggle]').first().click();await restored();}
    await choose(ids[0]);await choose(ids[1]);await choose(ids[3]);
    assert.equal(await page.locator('[data-pilot-print]').count(),0);
    if(width===390&&theme==='dark')await picker.screenshot({path:path.join(output,'mobile-dark-selected.png')});
    await toggle.click();assert.equal(await grid.isVisible(),false);assert.equal(await criteria.isVisible(),false);
    await restored();
    await toggle.click();assert.equal(await grid.isVisible(),true);assert.equal(await criteria.isVisible(),false);
    if(width===1366&&theme==='light')await general.locator('.final-clinical-check').screenshot({path:path.join(output,'desktop-checklist-restored.png')});
    await general.locator('#clearChecklistButton').click();
    assert.equal(await general.locator('.medical-checklist input:checked').count(),0);
    await select('ortopedia');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    await toggle.click();assert.equal(await grid.locator('button').count(),3);
    await grid.locator('[data-condition="sisreg-campo-grande.ortopedia.referencias-ombro"]').click();
    await page.locator('[data-clinical-condition-id="sisreg-campo-grande.ortopedia.referencias-ombro"]').waitFor();
    await select('neuropediatria');assert.equal(await grid.isVisible(),false);
    // Direct links reveal both the condition and its available siblings, also on reload.
    await page.goto(origin+'/medico/?protocolo=neuropediatria&condicao=digsaude.neuropediatria.tea',{waitUntil:'networkidle'});
    await page.locator('[data-clinical-condition-id="digsaude.neuropediatria.tea"]').waitFor();
    assert.equal(await grid.isVisible(),true);assert.equal(await criteria.isVisible(),true);
    assert.equal(await general.isVisible(),false);
    await page.locator('[data-pilot-criteria-toggle]').first().click();
    assert.equal(await general.isVisible(),true);assert.equal(new URL(page.url()).searchParams.has('condicao'),false);
    for(let i=0;i<3;i++)await general.locator('.medical-checklist input').nth(i).check();
    await grid.locator('[data-condition="digsaude.neuropediatria.cefaleia"]').click();
    await page.locator('[data-pilot-criteria-toggle]').first().click();
    assert.equal(await general.locator('.medical-checklist input:checked').count(),3);
    await grid.locator('[data-condition="digsaude.neuropediatria.tea"]').click();
    await page.reload({waitUntil:'networkidle'});
    await page.locator('[data-clinical-condition-id="digsaude.neuropediatria.tea"]').waitFor();
    assert.equal(await grid.isVisible(),true);assert.equal(await criteria.isVisible(),true);
    await page.locator('[data-pilot-criteria-toggle]').first().click();
    assert.equal(await general.isVisible(),true);assert.equal(new URL(page.url()).searchParams.has('condicao'),false);
    if(width===1366&&theme==='light'){
      await page.goto(origin+'/protocolo/?protocolo=neuropediatria&condicao=digsaude.neuropediatria.tea',{waitUntil:'networkidle'});
      await page.locator('[data-pilot-criteria-toggle]').first().click();
      assert.equal(await general.isVisible(),true);assert.equal(new URL(page.url()).searchParams.has('condicao'),false);
    }
    await page.goto(origin+'/recepcao/',{waitUntil:'networkidle'});
    await page.evaluate(()=>window.ClinicalConditionPilot.ready);
    await page.locator('#receptionProtocolList [data-id="neuropediatria"]').click();
    assert.equal(await toggle.count(),0);assert.equal(await grid.isVisible(),true);
    assert.equal(await grid.locator('button').count(),8);
    await grid.locator('[data-condition="digsaude.neuropediatria.tea"]').click();
    await page.locator('#receptionDetail [data-clinical-condition-id="digsaude.neuropediatria.tea"]').waitFor();
    await page.locator('[data-pilot-age]').fill('17 anos');
    assert.equal(await page.evaluate(()=>window.ClinicalConditionPilot.active().age.years),17);
    await page.evaluate(()=>{window.__didPrint=false;window.open=()=>({document:{open(){},write(html){window.__printedHtml=html;},close(){}},focus(){},print(){window.__didPrint=true;}});});
    await page.locator('[data-pilot-print]').click();
    assert.equal(await page.evaluate(()=>window.__didPrint&&window.__printedHtml===window.ClinicalConditionPilot.printDocument()),true);
    assert.deepEqual(errors,[]);
    report.push({width,theme,keyboard:true,collapsed:true,allEightConditions:true,singleContent:true,generalDomAndChecklistPreserved:true,clearChecklist:true,printAndAiContext:true,bottomCollapseFocus:true,directLinkAndReload:true,receptionPreserved:true});
    await context.close();
  }
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:report.length,scenarios:report}));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
