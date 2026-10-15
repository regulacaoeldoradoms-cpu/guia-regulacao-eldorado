// Synthetic rendering/network only. Warm assets are reused by the local fixture.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,chromium}=await import('./mobile-profile-refinement.mjs');
const root=process.env.STARTUP_ROOT || path.resolve(import.meta.dirname,'../..');
const output=process.env.STARTUP_OUTPUT || path.join(root,'.local/citizen-first-paint');
const old=process.env.EXPECT_OLD==='1';await fs.mkdir(output,{recursive:true});
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
// Exercise a real parser boundary without changing any product HTML bytes.
// A visible button can precede its label when the response arrives in chunks.
const streamHtml=process.env.STARTUP_STREAM_HTML==='1';
if(streamHtml){
 const html=await fs.readFile(path.join(root,'cidadao/index.html'),'utf8');
 const action=html.indexOf('id="openNewManifestation"'),split=html.indexOf('<strong',action);
 assert.ok(action>=0&&split>action,'Stream fixture splits the native action before its label');
 const [handleRequest]=server.server.listeners('request');
 server.server.removeListener('request',handleRequest);
 server.server.on('request',(req,res)=>{
  if(new URL(req.url,server.origin).pathname!=='/cidadao/')return handleRequest(req,res);
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Length':Buffer.byteLength(html)});
  res.write(html.slice(0,split));setTimeout(()=>res.end(html.slice(split)),1200);
 });
}
const rows=[];
const rgb=s=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
const lum=s=>rgb(s).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
try{for(const width of (process.env.WIDTHS || '320,360,390').split(',').map(Number))for(const theme of ['light','dark']){
 const result={errors:[]};const {page,context,audit}=await newPage(browser,{theme,width},server.origin,result);let warm=false,closing=false;const assets=new Map();let reused=0;
 await context.route('**/api/council/notifications',route=>route.fulfill({contentType:'application/json',body:'{"notifications":[]}'}));
 await context.route(/\/(?:js|css)\//,async route=>{
  try { const key=route.request().url();if(warm&&assets.has(key)){reused++;return await route.fulfill(assets.get(key));}
  await new Promise(r=>setTimeout(r,key.includes('/js/')?350:150));const response=await route.fetch();const body=await response.body();const data={status:response.status(),headers:response.headers(),body};assets.set(key,data);return await route.fulfill(data); } catch(error) { if(!closing)throw error; }
 });
 await context.addInitScript(()=>{window.__startupFrames=[];const tick=()=>{const b=document.getElementById('openNewManifestation'),label=b?.querySelector('strong');const root=b?.closest('.citizen-route-area')||document;const h=root.querySelector('.portal-hero h2');if(b&&h&&label&&b.getBoundingClientRect().width>0){const r=b.getBoundingClientRect(),s=getComputedStyle(b);window.__startupFrames.push({ms:performance.now(),headerHeight:document.querySelector('.portal-topbar')?.getBoundingClientRect().height,classes:document.body.className,heading:h.textContent,headingFont:parseFloat(getComputedStyle(h).fontSize),actionFont:parseFloat(getComputedStyle(label).fontSize),height:r.height,top:r.y,background:s.backgroundColor,color:s.color,pageWidth:document.documentElement.scrollWidth,viewport:innerWidth});}requestAnimationFrame(tick);};requestAnimationFrame(tick);});
 const cdp=await context.newCDPSession(page);await cdp.send('Page.enable');let images=[],capture='';cdp.on('Page.screencastFrame',async frame=>{if(capture&&images.length<12){const file=path.join(output,`${theme}-${width}-${capture}-${images.length}.jpg`);images.push(file);await fs.writeFile(file,Buffer.from(frame.data,'base64'));}await cdp.send('Page.screencastFrameAck',{sessionId:frame.sessionId}).catch(()=>{});});
 async function observe(mode,action){capture=mode;images=[];await page.evaluate(()=>{window.__startupFrames=[];}).catch(()=>{});await cdp.send('Page.startScreencast',{format:'jpeg',quality:75,maxWidth:width,maxHeight:900,everyNthFrame:1});await action();await page.waitForFunction(()=>PortalCitizenShell?.active()?.url.pathname==='/cidadao/'&&!PortalCitizenShell.diagnostics().navigating&&document.body.classList.contains('citizen-mobile-presentation'));await page.waitForTimeout(250);await cdp.send('Page.stopScreencast');capture='';const frames=await page.evaluate(()=>window.__startupFrames);assert.ok(frames.length>0);const bad=frames.filter(f=>f.headingFont!==24||f.actionFont!==20||f.heading!=='Canal do Cidadão'||f.pageWidth>f.viewport+1||f.headerHeight>58);if(!old)assert.deepEqual(bad,[],`${theme}/${width}/${mode}: first and subsequent visible frames use approved proportions/copy`);rows.push({theme,width,mode,first:frames[0],last:frames.at(-1),badFrames:bad.length,frames,images:[...images],reusedAssets:reused});console.log(JSON.stringify({theme,width,mode,first:frames[0],badFrames:bad.length,reusedAssets:reused}));}
 await observe('cold',()=>page.goto(server.origin+'/cidadao/'));warm=true;await observe('warm',()=>page.reload());
 if(!old){
  const button=page.locator('#openNewManifestation');await page.evaluate(()=>PortalTheme.apply('dark'));const contrasts={};for(const state of ['normal','hover','active','focus-visible','disabled']){
   await button.evaluate((b,state)=>{b.disabled=state==='disabled';b.style.setProperty('transition','none','important');},state);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root:dom}=await cdp.send('DOM.getDocument');const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:dom.nodeId,selector:'#openNewManifestation'});await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:state==='normal'||state==='disabled'?[]:[state]});await page.waitForTimeout(250);const colors=await button.evaluate(b=>{const s=getComputedStyle(b),t=getComputedStyle(b.querySelector('strong')),hint=getComputedStyle(b.querySelector('span:not(.icon)'));return{background:s.backgroundColor,text:t.color,hint:hint.color,border:s.borderColor,outline:s.outlineColor,outlineWidth:s.outlineWidth};});contrasts[state]={...colors,textRatio:contrast(colors.text,colors.background),hintRatio:contrast(colors.hint,colors.background)};assert.ok(contrasts[state].textRatio>=4.5&&contrasts[state].hintRatio>=4.5);if(state==='focus-visible'){assert.equal(colors.outlineWidth,'3px');contrasts[state].focusRatio=contrast(colors.outline,colors.background);assert.ok(contrasts[state].focusRatio>=3,'Focus ring contrasts with the button');}
  }
  await button.evaluate(b=>{b.disabled=false;b.style.removeProperty('transition');});await page.evaluate(()=>PortalTheme.apply('light'));await page.waitForTimeout(200);assert.notEqual(await button.evaluate(b=>getComputedStyle(b).backgroundColor),'rgb(28, 122, 145)');await page.evaluate(()=>PortalTheme.apply('dark'));await page.waitForTimeout(200);assert.equal(await button.evaluate(b=>getComputedStyle(b).backgroundColor),'rgb(28, 122, 145)');rows.at(-1).contrasts=contrasts;await page.evaluate(theme=>PortalTheme.apply(theme),theme);
  await page.locator('.social-mobile-nav a[href="/perfil/"]').click();await page.waitForFunction(()=>PortalCitizenShell.active().url.pathname==='/perfil/'&&!PortalCitizenShell.diagnostics().navigating);await observe('shell-return',()=>page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href))));
  warm=false;await page.goto(server.origin+'/');await page.waitForFunction(()=>document.body.classList.contains('shared-mobile-navigation'));await observe('shell-new',()=>page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href))));
 }
 assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);closing=true;await context.close();await fs.writeFile(path.join(output,'results.json'),JSON.stringify({syntheticOnly:true,warmModel:'local asset reuse; API reads remain fresh',htmlDelivery:streamHtml?'split before native action label':'complete',rows},null,2));
}}finally{await browser.close();await new Promise(r=>server.server.close(r));}
