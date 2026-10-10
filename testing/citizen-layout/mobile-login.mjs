import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY='1';
const { serve, chromium } = await import('./mobile-profile-refinement.mjs');
const { applyTextScale } = await import('./text-scale.mjs');
const root = path.resolve(import.meta.dirname,'../..');
const phase = process.env.LOGIN_PHASE || 'after';
const out = path.join(root,'.local/mobile-login',phase);
await fs.mkdir(out,{recursive:true});
const server=await serve(root), browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||await fs.access('/usr/bin/chromium').then(()=>'/usr/bin/chromium',()=>chromium.executablePath()),args:['--no-sandbox','--disable-background-networking']});
const results=[];
try {
  for(const width of [320,390,1440]) for(const theme of ['light','dark']) for(const scale of width===1440?[1]:[1,2]) {
    const id=`${width}-${theme}-${scale}`, context=await browser.newContext({viewport:{width,height:820},reducedMotion:'reduce'});
    const network={unexpected:[],errors:[]};
    await context.addInitScript(theme=>localStorage.setItem('regulacao.portal.theme.active.v1',theme),theme);
    await context.route('**/*',route=>{
      const url=new URL(route.request().url());
      if(url.origin===server.origin&&!url.pathname.startsWith('/api/'))return route.continue();
      if(url.pathname==='/api/auth/login')return route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({error:'Credenciais sintéticas inválidas.'})});
      network.unexpected.push(url.pathname);return route.abort('blockedbyclient');
    });
    const page=await context.newPage(), result={id,checks:[]};
    page.on('pageerror',error=>network.errors.push(error.message));
    const check=(label,ok)=>{assert.ok(ok,label);result.checks.push(label);};
    try {
      await page.goto(server.origin+'/login/',{waitUntil:'networkidle'});
      if(scale===2){process.env.TEXT_SCALE='2';await applyTextScale(page);} else process.env.TEXT_SCALE='1';
      await page.evaluate(()=>scrollTo(0,0));
      result.metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,formY:document.getElementById('loginForm').getBoundingClientRect().top,submitY:document.getElementById('loginSubmit').getBoundingClientRect().bottom,headingSize:getComputedStyle(document.querySelector('.login-card h2')).fontSize,inputHeight:document.getElementById('loginUsername').getBoundingClientRect().height}));
      await page.screenshot({path:path.join(out,id+'.png'),fullPage:true});
      if(phase==='before')continue;
      check('no horizontal overflow',result.metrics.scrollWidth<=width+1);
      if(width<900&&scale===1)check('form and primary action visible at entry',result.metrics.formY<250&&result.metrics.submitY<=820);
      check('username and password labels preserved',await page.getByLabel('Usuário',{exact:true}).count()===1&&await page.getByLabel('Senha',{exact:true}).count()===1);
      await page.locator('#loginUsername').fill('synthetic.invalid');
      await page.locator('#loginPassword').fill('synthetic-password');
      await page.locator('#loginPasswordToggle').click();
      check('password visibility accessible',await page.locator('#loginPassword').getAttribute('type')==='text'&&await page.locator('#loginPasswordToggle').getAttribute('aria-label')==='Ocultar senha');
      await page.locator('#loginPasswordToggle').click();
      await page.locator('#loginPassword').focus();await page.keyboard.press('Tab');
      check('keyboard reaches password action',await page.evaluate(()=>document.activeElement.id==='loginPasswordToggle'));
      if(width<900){
        await page.setViewportSize({width,height:420});
        await page.locator('#loginPassword').focus();await page.locator('#loginPassword').scrollIntoViewIfNeeded();
        check('password reachable in reduced keyboard viewport',await page.locator('#loginPassword').evaluate(node=>{const r=node.getBoundingClientRect();return document.activeElement===node&&r.top>=0&&r.bottom<=innerHeight;}));
        await page.setViewportSize({width,height:820});
      }
      await page.locator('#loginSubmit').click();
      await page.locator('#loginStatus.visible.error').waitFor();
      check('synthetic error remains readable and retry enabled',await page.locator('#loginStatus').textContent()==='Credenciais sintéticas inválidas.'&&await page.locator('#loginSubmit').isEnabled());
      await page.locator('a[href="/cadastro/"]').scrollIntoViewIfNeeded();
      check('registration and authorization notice reachable',await page.locator('a[href="/cadastro/"]').isVisible()&&await page.locator('.login-card > div:last-child small').isVisible());
      check('error creates no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      check('all requests synthetic and no runtime errors',network.unexpected.length===0&&network.errors.length===0);
      await page.screenshot({path:path.join(out,id+'-error.png'),fullPage:true});
    }catch(error){result.failure=error.stack;}
    finally{await context.close();results.push(result);console.log(JSON.stringify(result));}
  }
}finally{await browser.close();await new Promise(resolve=>server.server.close(resolve));}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));
if(results.some(result=>result.failure))process.exitCode=1;
