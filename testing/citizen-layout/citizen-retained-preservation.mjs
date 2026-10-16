// Current and b5a0bbfc native Citizen in real Chromium, same isolated fixture.
// Keeps the existing pixel comparator and strict computed/layout equality.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const {comparePngPixels}=await import('../browser/dark-audit-base-comparison.mjs');
const {inspectSurfaces}=await import('../browser/dark-audit-surfaces.mjs');
const root=path.resolve(import.meta.dirname,'../..'),output=path.join(root,'.local/citizen-retained-preservation'),base='b5a0bbfc';
await fs.mkdir(output,{recursive:true});
const changed=execFileSync('git',['diff','--name-only',base,'--','*.js','*.css','*.html'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(Boolean);
const baseline=new Map(changed.map(file=>['/'+file,execFileSync('git',['show',base+':'+file],{cwd:root,encoding:'utf8'})]));
const server=await serve(root),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-gpu','--disable-skia-runtime-opts','--disable-lcd-text','--font-render-hinting=none','--disable-font-subpixel-positioning','--run-all-compositor-stages-before-draw','--disable-partial-raster','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']});
const results=[];
async function capture(width,theme,media,isBase){
 const result={errors:[]},{page,context,audit}=await newPage(browser,{width,theme,seedOnce:true},server.origin,result);
 if(isBase)await context.route('**/*',route=>{
  const url=new URL(route.request().url()),file=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
  if(url.origin===server.origin&&baseline.has(file))return route.fulfill({contentType:file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'text/javascript',body:baseline.get(file)});
  return route.fallback();
 });
 try{
  await page.goto(server.origin+'/cidadao/');await ready(page,'/cidadao/');
  await page.locator('[data-tutorial-start]').waitFor({state:'attached'});
  if(width<900)await page.waitForFunction(()=>PortalCitizenShell.active().loaded);
  await page.evaluate(()=>PortalCitizenLayout.enterRoute());
  await page.emulateMedia({media});await page.mouse.move(-100,-100);
  await page.evaluate(async()=>{document.activeElement?.blur();scrollTo(0,0);await document.fonts.ready;});
  await page.waitForTimeout(350);
  // A non-painted body sibling can change the mascot's positional selector
  // as background bootstrap settles. Normalize that identity only; keep every
  // property/rectangle and ensure no two elements collapse to one identity.
  const snapshot=(await inspectSurfaces(page)).snapshot.map(item=>({...item,selector:item.selector.replace(/ > div\.pet-stage\.pet-stage-global:nth-of-type\(\d+\)/g,' > div.pet-stage.pet-stage-global')})).sort((a,b)=>a.selector.localeCompare(b.selector));
  assert.equal(new Set(snapshot.map(item=>item.selector)).size,snapshot.length);
  let before,buffer,stable=false;
  for(let i=0;i<6;i++){
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   buffer=await page.screenshot({fullPage:true,animations:'disabled',caret:'hide'});
   if(before?.equals(buffer)){stable=true;break;}before=buffer;
  }
  assert(stable,'Independent source capture must stabilize');
  await fs.writeFile(path.join(output,`${width}-${theme}-${media}-${isBase?'base':'current'}.png`),buffer);
  assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
  return {snapshot,buffer,stable};
 }finally{await context.close();}
}
try{
 for(const width of (process.env.PRESERVE_WIDTHS||'390,1440').split(',').map(Number))for(const [theme,media]of [['light','screen'],['dark','print']]){
  const current=await capture(width,theme,media,false),original=await capture(width,theme,media,true);
  const pixels=comparePngPixels(current.buffer,original.buffer),computed=JSON.stringify(current.snapshot)===JSON.stringify(original.snapshot);
  if(!computed)await fs.writeFile(path.join(output,`${width}-${theme}-${media}-computed.json`),JSON.stringify({current:current.snapshot,base:original.snapshot},null,2));
  const result={width,theme,media,base,computedEqual:computed,pixels,stable:current.stable&&original.stable};
  results.push(result);console.log(JSON.stringify(result));await fs.writeFile(path.join(output,process.env.PRESERVE_WIDTHS?'results-'+process.env.PRESERVE_WIDTHS+'.json':'results.json'),JSON.stringify(results,null,2));
  assert(computed,'Native computed styles and layout must match b5a0bbfc');assert(pixels.accepted,'Original pixel tolerance must pass');
 }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
