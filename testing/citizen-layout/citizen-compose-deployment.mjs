// Real previously published shell/controller bytes, current markup, synthetic APIs.
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import cp from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const git=process.env.GIT_PATH||'git',previous='0385388f05daee43e46dec2b872281999ca29751';
const old=path=>cp.execFileSync(git,['-c','safe.directory='+process.cwd().replaceAll('\\','/'),'show',previous+':'+path],{encoding:'utf8',maxBuffer:3*1024*1024});
const oldScripts=new Map(['home','citizen-layout','citizen-mobile-shell','account-section-shell','citizen-mobile-app','citizen-mobile-presentation'].map(name=>['/js/'+name+'.js',old('js/'+name+'.js')]));
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),reports=[];
const output='.local/compose-deployment';await fs.mkdir(output,{recursive:true});
try {for(const mode of (process.env.DEPLOY_CASE||'cached-controller,current-controller,legacy-markup,helper-unavailable,current-shell-unavailable').split(',')) {
 const result={errors:[]},{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true},server.origin,result),writes=[],resources=[];
 const protocol='CMS-2026-000071',item={protocol,type:'reclamacao',subject:'Transição sintética',description:'Relato sintético de transição de versões.',status:'recebida',privacyMode:'sigilosa',createdAt:'2026-10-14T00:00:00Z'};
 await context.route(server.origin+'/**',async route=>{const u=new URL(route.request().url());resources.push(u.pathname+u.search);
  if(u.pathname==='/')return route.fulfill({contentType:'text/html',body:mode==='current-shell-unavailable'?await fs.readFile('index.html','utf8'):old('index.html')});
  if(u.pathname==='/cidadao/')return route.fulfill({contentType:'text/html',body:mode==='legacy-markup'?old('cidadao/index.html'):await fs.readFile('cidadao/index.html','utf8')});
  if(oldScripts.has(u.pathname)&&mode!=='current-shell-unavailable')return route.fulfill({contentType:'text/javascript',body:oldScripts.get(u.pathname)});
  if(u.pathname==='/js/citizen.js')return route.fulfill({contentType:'text/javascript',body:mode==='cached-controller'?old('js/citizen.js'):await fs.readFile('js/citizen.js','utf8')});
  if(u.pathname==='/js/citizen-compose-attachments.js'&&['helper-unavailable','current-shell-unavailable'].includes(mode))return route.fulfill({status:503,body:'Synthetic unavailable helper'});
  return route.fallback();
 });
 await context.route('**/api/council/**',r=>{const p=new URL(r.request().url()).pathname;if(r.request().method()==='POST'){writes.push(p);return r.fulfill({json:p.endsWith('/attachments')?{ok:true}:{manifestation:item}});}return r.fulfill({json:p.endsWith(protocol)?{manifestation:item,messages:[],events:[],attachments:[]}:{manifestations:writes.length?[item]:[],notifications:[]}});});
 try {
  await page.goto(server.origin+'/');await ready(page,'/');await page.evaluate(()=>window.__oldOwners={document,shell:PortalCitizenShell});
  await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));await ready(page,'/cidadao/');
  assert(await page.evaluate(()=>__oldOwners.document===document&&__oldOwners.shell===PortalCitizenShell),'Deployment must not force a reload or replace the active shell');
  await page.locator('#openNewManifestation').click();await page.locator('input[name=manifestationType][value=reclamacao]').check();
  assert(await page.locator('#composeDetails').isVisible(),'The old cached controller must reveal optional fields in new markup');assert(await page.locator('.compose-privacy').isVisible());
  await page.locator('#manifestationSubject').fill(item.subject);await page.locator('#manifestationDescription').fill(item.description);
  if(mode!=='cached-controller')assert(await page.locator('#submitManifestation').isDisabled());
  await page.locator('#newManifestationForm').evaluate(form=>form.requestSubmit());assert.equal(writes.length,0,'Native consent validation must survive the deployment transition');
  await page.locator('#manifestationConfirm').check();assert(await page.locator('#submitManifestation').isEnabled());
  if(await page.locator('#composeAttachments').count())await page.locator('#composeAttachments').evaluate(n=>n.open=true);
  assert.equal(await page.locator('#manifestationFiles').isHidden(),mode==='current-controller');
  if(mode!=='legacy-markup')assert.equal(await page.locator('#composeChooseFiles').isVisible(),mode==='current-controller');
  await page.locator('#manifestationFiles').setInputFiles({name:'transicao-sintetica.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% synthetic\n%%EOF')});
  assert.equal(writes.length,0);assert.match(await page.locator('#manifestationFileList').textContent(),/transicao-sintetica.pdf/);
  await page.screenshot({path:output+'/'+mode+'.png'});await page.locator('#newManifestationModal [data-close-modal]').first().click();
  await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/perfil/',location.href)));await ready(page,'/perfil/');await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));await ready(page,'/cidadao/');await page.locator('#openNewManifestation').click();
  assert.equal(await page.locator('#manifestationDescription').inputValue(),item.description);assert(await page.locator('#manifestationConfirm').isChecked());
  await page.locator('#submitManifestation').click();await page.locator('#newManifestationStatus').filter({hasText:'Manifestação enviada'}).waitFor();assert.equal(writes.filter(p=>p.endsWith('/attachments')).length,1);assert.equal(writes.filter(p=>p.endsWith('/manifestations')).length,1);
  assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
  const report={mode,oldShellRetained:true,withoutReload:true,filesPreserved:true,protocol,posts:1,uploads:1,helperLoaded:await page.evaluate(()=>Boolean(globalThis.PortalCitizenComposeAttachments)),resources:resources.filter(s=>s.includes('citizen.js')||s.includes('attachments.js')),errors:result.errors,passed:true};reports.push(report);console.log(JSON.stringify(report));
 }finally{await context.close();await fs.writeFile(output+'/results.json',JSON.stringify(reports,null,2));}
}}finally{await browser.close();await new Promise(r=>server.server.close(r));}
