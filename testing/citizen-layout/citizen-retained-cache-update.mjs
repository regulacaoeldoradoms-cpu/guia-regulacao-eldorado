// Native service worker and exact PR663 public markup/assets; synthetic account only.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {newPage,chromium}=await import('./mobile-profile-refinement.mjs');
const root=path.resolve(import.meta.dirname,'../..'),output=path.join(root,'.local/citizen-retained-cache-update');
await fs.mkdir(output,{recursive:true});
const base='b5a0bbfc5cf01b0fb964ad9c76e0ee47222923a3';
const historical=file=>execFileSync('git',['show',base+':'+file],{cwd:root,encoding:'utf8'});
const oldHtml=historical('cidadao/index.html');
const changed=['citizen-layout','citizen-mobile-shell','citizen','citizen-declaration','citizen-account-level','citizen-mobile-app','portal-interactions'];
const oldAssets=[...oldHtml.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]).filter(url=>changed.includes(new URL(url,'https://fixture.invalid').pathname.split('/').pop().replace('.js','')));
oldAssets.push('/js/citizen-mobile-presentation.js?v=20261015-citizen-tutorial-1');
const cachedAssets=oldAssets.map(url=>({url,body:historical(new URL(url,'https://fixture.invalid').pathname.slice(1))}));
const routes=new Set(['/','/cidadao/','/amigos/','/perfil/','/mascotes/','/notificacoes/','/ferramentas/','/conquistas/','/seguranca/','/configuracoes/','/login/']);
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/__retained_cache_fixture__/'){res.writeHead(200,{'Content-Type':'text/html'});return res.end('<!doctype html><title>Synthetic cache setup</title>');}
  const rel=routes.has(url.pathname)?url.pathname+'index.html':url.pathname;
  const file=path.resolve(root,'.'+rel);
  if(!file.startsWith(root+path.sep)||!routes.has(url.pathname)&&!/^\/(js|css|assets|vendor)\//.test(rel)&&!['/portal-sw.js','/portal.webmanifest'].includes(rel)){res.writeHead(404);return res.end();}
  const bytes=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.svg')?'image/svg+xml':'application/octet-stream','Cache-Control':'public,max-age=600','Service-Worker-Allowed':'/'});res.end(bytes);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const results=[];
try{
 for(const theme of ['light','dark']){
  const result={theme,base,errors:[]},{page,context,audit}=await newPage(browser,{width:390,theme,seedOnce:true},origin,result);
  try{
   await page.goto(origin+'/__retained_cache_fixture__/');
   await page.evaluate(async()=>{await navigator.serviceWorker.register('/portal-sw.js',{scope:'/'});await navigator.serviceWorker.ready;});
   await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
   await page.evaluate(async({oldHtml,cachedAssets})=>{
    const pages=await caches.open('portal-pages-20261009-pets-combined-8'),assets=await caches.open('portal-static-20261009-pets-combined-8');
    await pages.put('/cidadao/',new Response(oldHtml,{headers:{'Content-Type':'text/html'}}));
    for(const {url,body}of cachedAssets)await assets.put(url,new Response(body,{headers:{'Content-Type':'text/javascript'}}));
    await assets.put('/js/retained-cache-sentinel.js?v=1',new Response('UNCHANGED-SENTINEL'));
    localStorage.setItem('retained-cache-sentinel','preserve');
   },{oldHtml,cachedAssets});
   assert.deepEqual(await page.evaluate(async urls=>{const cache=await caches.open('portal-static-20261009-pets-combined-8');return Promise.all(urls.map(async url=>(await cache.match(url)).text()));},oldAssets),cachedAssets.map(x=>x.body),'The first navigation starts with the exact old modules cached');
   await page.goto(origin+'/cidadao/');
   assert.equal(await page.locator('meta[name="portal-citizen-first-paint"]').getAttribute('content'),'20261017-1');
   await page.waitForFunction(()=>PortalCitizenShell?.active().loaded&&!PortalCitizenShell.diagnostics().navigating);
   assert.equal(await page.evaluate(()=>PortalCitizenShell.version),'20261016-citizen-retained-1');
   assert.equal(await page.evaluate(()=>typeof window[Symbol.for('portal.citizenMobilePresentation')]?.activate),'function','Direct entry must use the revised presenter even with old versioned modules cached');
   assert.equal(new URL(page.url()).pathname,'/');
   await page.locator('#openNewManifestation').click();await page.locator('input[value=sugestao]').check();
   await page.locator('#manifestationSubject').fill('Rascunho sintético após atualização');
   await page.locator('#manifestationFiles').setInputFiles({name:'cache-sintetico.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nsynthetic')});
   await page.evaluate(()=>{window.__cacheFile=document.getElementById('manifestationFiles').files[0];});
   for(const route of ['/','/cidadao/'])await page.evaluate(route=>PortalCitizenShell.navigate(new URL(route,location.href)),route);
   assert.equal(await page.locator('#manifestationSubject').inputValue(),'Rascunho sintético após atualização');
   assert(await page.evaluate(()=>document.getElementById('manifestationFiles').files[0]===__cacheFile));
   assert(await page.evaluate(async urls=>{const cache=await caches.open('portal-static-20261009-pets-combined-8');return(await Promise.all(urls.map(url=>cache.match(url)))).every(Boolean);},oldAssets),'Existing public cache entries remain available after normal warming');
   assert.equal(await page.evaluate(async()=>{const cache=await caches.open('portal-static-20261009-pets-combined-8');return(await cache.match('/js/retained-cache-sentinel.js?v=1')).text();}),'UNCHANGED-SENTINEL');
   assert.equal(await page.evaluate(()=>localStorage.getItem('retained-cache-sentinel')),'preserve');
   assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
   assert(!audit.apiCalls.some(x=>/^(POST|PUT|PATCH|DELETE) \/api\/council\//.test(x)));
   result.passed=true;await page.screenshot({path:path.join(output,theme+'.png')});
  }finally{await context.close();results.push(result);await fs.writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>server.close(r));}
console.log(JSON.stringify({nativeServiceWorker:true,syntheticOnly:true,results}));
