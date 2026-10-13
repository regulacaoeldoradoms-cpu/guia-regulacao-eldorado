// Two real Settings tabs, reordered synthetic responses, and convergence without Web Locks.
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,chromium,user}=await import('./mobile-profile-refinement.mjs');
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
try {
  for (const mode of ['locks','fallback','fallback-failure']) {
    const result={errors:[]};
    const {page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true,user:{...user,interfaceTheme:'light'}},server.origin,result);
    if(mode!=='locks')await context.addInitScript(()=>Object.defineProperty(navigator,'locks',{value:undefined,configurable:true}));
    const writes=[];let backend='light',lightWrites=0;
    await context.route('**/api/auth/security',async route=>{
      if(route.request().method()!=='PATCH')return route.fallback();
      const payload=JSON.parse(route.request().postData());writes.push(payload.interfaceTheme);
      const lightAttempt=payload.interfaceTheme==='light'?++lightWrites:0;
      await new Promise(resolve=>setTimeout(resolve,payload.interfaceTheme==='dark'?1200:100));
      if(mode==='fallback-failure'&&lightAttempt>1)return route.fulfill({status:503,json:{error:'Synthetic repair failure'}});
      backend=payload.interfaceTheme;audit.user={...audit.user,interfaceTheme:backend};
      return route.fulfill({json:{security:{emailVerified:true,...payload}}});
    });
    await page.goto(server.origin+'/configuracoes/');
    const second=await context.newPage();await second.goto(server.origin+'/configuracoes/');await page.waitForTimeout(600);
    await page.locator('label[for=interfaceThemeDark]').click();await second.waitForFunction(()=>PortalTheme.get()==='dark');
    await second.locator('label[for=interfaceThemeLight]').click();await page.waitForTimeout(1800);
    const states=await Promise.all([page,second].map(target=>target.evaluate(()=>({theme:PortalTheme.get(),pending:PortalTheme.pending(),status:document.getElementById('interfaceThemeStatus').textContent}))));
    for(const state of states)assert.equal(state.theme,'light');
    if(mode==='fallback-failure'){
      assert.equal(backend,'dark');for(const state of states){assert.equal(state.pending,true);assert.match(state.status,/não pôde/);}
      await second.reload();await second.waitForTimeout(700);assert.equal(await second.evaluate(()=>PortalTheme.get()),'light');
    } else {
      assert.equal(backend,'light');for(const state of states){assert.equal(state.pending,false);assert.match(state.status,/Modo claro ativado e sincronizado/);}
    }
    assert.deepEqual(result.errors,[]);console.log(JSON.stringify({mode,backend,writes,states,passed:true}));await context.close();
  }
} finally {await browser.close();await new Promise(resolve=>server.server.close(resolve));}
