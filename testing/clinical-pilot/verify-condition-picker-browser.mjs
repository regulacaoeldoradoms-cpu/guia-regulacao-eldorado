// Real clinical pages with synthetic auth and no external traffic.
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
const origin='http://127.0.0.1:'+server.address().port;
let browser;
const report=[];
try{
  browser=await chromium.launch({headless:true,...(process.env.CLINICAL_PILOT_BROWSER?{executablePath:process.env.CLINICAL_PILOT_BROWSER}:{})});
  for(const width of [320,390,1366])for(const theme of ['light','dark']){
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
      return route.continue();
    });
    await page.goto(origin+'/medico/',{waitUntil:'networkidle'});
    await page.evaluate(()=>window.ClinicalConditionPilot.ready);
    const select=async id=>{
      await page.locator('#sideSearchInput').fill('');
      await page.locator('#protocolList [data-id="'+id+'"]').click();
    };
    await select('neuropediatria');
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
    await picker.screenshot({path:path.join(output,`guide-${width}-${theme}-open.png`)});
    await grid.locator('[data-condition="digsaude.neuropediatria.tea"]').click();
    await page.locator('[data-clinical-condition-id="digsaude.neuropediatria.tea"]').waitFor();
    assert.ok(new URL(page.url()).searchParams.get('condicao').endsWith('.tea'));
    await select('ortopedia');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    await toggle.click();assert.equal(await grid.locator('button').count(),3);
    await grid.locator('[data-condition="sisreg-campo-grande.ortopedia.referencias-ombro"]').click();
    await page.locator('[data-clinical-condition-id="sisreg-campo-grande.ortopedia.referencias-ombro"]').waitFor();
    await select('neuropediatria');assert.equal(await grid.isVisible(),false);
    await picker.screenshot({path:path.join(output,`guide-${width}-${theme}-closed.png`)});
    // Direct condition links bypass the picker as before.
    await page.goto(origin+'/medico/?protocolo=neuropediatria&condicao=digsaude.neuropediatria.tea',{waitUntil:'networkidle'});
    await page.locator('[data-clinical-condition-id="digsaude.neuropediatria.tea"]').waitFor();
    assert.equal(await toggle.count(),0);
    await page.goto(origin+'/recepcao/',{waitUntil:'networkidle'});
    await page.evaluate(()=>window.ClinicalConditionPilot.ready);
    await page.locator('#receptionProtocolList [data-id="neuropediatria"]').click();
    assert.equal(await toggle.count(),0);assert.equal(await grid.isVisible(),true);
    assert.equal(await grid.locator('button').count(),8);
    await grid.locator('[data-condition="digsaude.neuropediatria.tea"]').click();
    await page.locator('#receptionDetail [data-clinical-condition-id="digsaude.neuropediatria.tea"]').waitFor();
    assert.deepEqual(errors,[]);
    report.push({width,theme,keyboard:true,collapsed:true,conditionSelection:true,directLink:true,receptionPreserved:true});
    await context.close();
  }
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:report.length,scenarios:report}));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
