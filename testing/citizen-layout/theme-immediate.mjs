import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,chromium,user,friendHandle}=await import('./mobile-profile-refinement.mjs');
const server=await serve(process.cwd()), browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium'});
try {
 for(const mode of ['rapid','failure']) {
  const result={errors:[]};const {page,context}=await newPage(browser,{width:390,theme:'light',seedOnce:true,user:{...user,interfaceTheme:'light'}},server.origin,result);
  const writes=[];
  await context.route('**/api/auth/security',async r=>{
   if(r.request().method()!=='PATCH')return r.fallback();
   const body=JSON.parse(r.request().postData());writes.push(body.interfaceTheme);
   await new Promise(resolve=>setTimeout(resolve,700));
   return r.fulfill(mode==='failure'?{status:503,json:{error:'synthetic failure'}}:{json:{security:{emailVerified:true,...body}}});
  });
  await page.goto(server.origin+'/');await page.waitForFunction(()=>document.body.classList.contains('shared-mobile-navigation'));
  await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/configuracoes/',location.href)));
  await page.waitForFunction(()=>PortalCitizenShell.active().url.pathname==='/configuracoes/'&&!PortalCitizenShell.diagnostics().navigating);
  await page.waitForTimeout(400);
  await page.locator('#portalChatLauncher').click();
  await page.locator('#portalChatRoot.open').waitFor();
  await page.locator(`[data-chat-user="${friendHandle}"]`).first().click();
  await page.locator('#portalChatInput').fill('Rascunho de chat sintético');
  await page.locator('#socialProfileVisibility').selectOption('portal');
  const beforePalette = await page.evaluate(() => Object.fromEntries(['body','.portal-topbar','.portal-chat-panel'].map(selector => [selector,['backgroundColor','backgroundImage','color'].map(property => getComputedStyle(document.querySelector(selector))[property]).join('|')])));
  await page.evaluate(()=>{window.themeDocument=document;window.themeChat=document.getElementById('portalChatRoot');const input=document.createElement('textarea');input.id='themePreservedDraft';input.value='rascunho sintético';document.body.append(input);const frame=document.createElement('iframe');frame.id='themeFrame';frame.srcdoc='<html><body>fixture</body></html>';document.body.append(frame);});
  await page.waitForTimeout(40);
  await page.locator('#interfaceThemeDark').evaluate(input => { input.checked = true; input.dispatchEvent(new Event('change', {bubbles:true})); });
  const instant=await page.evaluate(()=>({html:document.documentElement.dataset.portalTheme,body:document.body.dataset.portalTheme,frame:document.getElementById('themeFrame').contentDocument.documentElement.dataset.portalTheme}));
  assert.deepEqual(instant,{html:'dark',body:'dark',frame:'dark'});
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const darkPalette = await page.evaluate(() => Object.fromEntries(['body','.portal-topbar','.portal-chat-panel'].map(selector => [selector,['backgroundColor','backgroundImage','color'].map(property => getComputedStyle(document.querySelector(selector))[property]).join('|')])));
  for (const selector of Object.keys(beforePalette)) assert.notEqual(darkPalette[selector],beforePalette[selector], selector);
  assert.equal(await page.locator('#portalChatInput').inputValue(),'Rascunho de chat sintético');
  assert.equal(await page.locator('#socialProfileVisibility').inputValue(),'portal');
  if(mode==='rapid')await page.locator('#interfaceThemeLight').evaluate(input => { input.checked = true; input.dispatchEvent(new Event('change', {bubbles:true})); });
  await page.waitForTimeout(1800);
  const after=await page.evaluate(()=>({theme:PortalTheme.get(),user:RegulationAuth.getCachedUser(),status:document.getElementById('interfaceThemeStatus')?.textContent,sameDocument:document===window.themeDocument,sameChat:document.getElementById('portalChatRoot')===window.themeChat,draft:document.getElementById('themePreservedDraft')?.value}));
  assert.equal(after.sameDocument,true);assert.equal(after.sameChat,true);assert.equal(after.draft,'rascunho sintético');
  assert.equal(after.theme,mode==='failure'?'dark':'light');
  if(mode==='rapid'){assert.deepEqual(writes,['dark','light']);assert.equal(after.user.interfaceTheme,'light');assert.match(after.status,/Modo claro/);}
  if(mode==='failure'){assert.match(after.status,/não pôde/);await page.reload();await page.waitForTimeout(900);assert.equal(await page.evaluate(()=>PortalTheme.get()),'dark');}
  assert.deepEqual(result.errors,[]);console.log(JSON.stringify({mode,instant,writes,theme:after.theme,status:after.status,errors:result.errors}));await context.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.server.close(resolve));}
