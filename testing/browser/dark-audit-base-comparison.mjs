import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { inspectSurfaces } from './dark-audit-surfaces.mjs';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const { PNG }=createRequire(import.meta.url)('playwright-core/lib/utilsBundle');
const baselineSources=new Map();

// Chromium rasterization can change one channel by one unit at a rounded edge.
// This bound is absolute (not a percentage) and never relaxes computed/layout checks.
export function comparePngPixels(current,baseline) {
  const a=PNG.sync.read(current),b=PNG.sync.read(baseline);
  if(a.width!==b.width||a.height!==b.height)return{accepted:false,withinTolerance:false,dimensionsCurrent:[a.width,a.height],dimensionsBase:[b.width,b.height],differentPixels:null,maxChannelDelta:null};
  let differentPixels=0,maxChannelDelta=0,left=a.width,top=a.height,right=-1,bottom=-1;
  for(let i=0;i<a.data.length;i+=4){
    let changed=false;
    for(let c=0;c<4;c++){const delta=Math.abs(a.data[i+c]-b.data[i+c]);if(delta)changed=true;if(delta>maxChannelDelta)maxChannelDelta=delta;}
    if(changed){differentPixels++;const pixel=i/4,x=pixel%a.width,y=Math.floor(pixel/a.width);left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
  }
  const accepted=differentPixels<=2&&maxChannelDelta<=1;
  return{accepted,withinTolerance:accepted,differentPixels,maxChannelDelta,dimensions:[a.width,a.height],bounds:differentPixels?{left,top,right,bottom}:null,limit:{pixels:2,channelDelta:1}};
}

// Compare the exact real DOM/state against tracked product files from one commit.
// Changes to an injected <style> in JS are included, not only linked CSS files.
export async function compareAgainstBase({ page, context, info, route, theme='light', media='screen', prepare=async()=>{}, base=process.env.DARK_AUDIT_BASE||'origin/main' }) {
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
  const git=(args)=>execFileSync('git',['-c','core.safecrlf=false',...args],{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024}).trimEnd();
  const baseCommit=git(['rev-parse','--verify',`${base}^{commit}`]);
  const changed=git(['diff','--name-only',baseCommit,'--','*.css','*.js','*.html']).split(/\r?\n/).filter(Boolean);
  const original=new Map(changed.map(file=>{const key=`${baseCommit}:${file}`;if(!baselineSources.has(key))baselineSources.set(key,git(['show',key]));return[file,baselineSources.get(key)];}));
  const working=new Map(await Promise.all(changed.map(async file=>[file,await readFile(path.join(root,file),'utf8')])));
  const load=async()=>{
    const errors=[];
    const captureError=error=>errors.push(error.message);
    page.on('pageerror',captureError);
    // Reset before BOTH navigations. Open real controls on screen first: print
    // intentionally hides their launchers, but an already-open view can print.
    await page.emulateMedia({media:'screen'});
    // A pointer left by the first preparation can hover a different card after
    // the second navigation/scroll. Both phases compare the same resting state.
    await page.mouse.move(-100,-100);
    await page.goto(route,{waitUntil:'load'});
    await page.evaluate(theme=>window.PortalTheme?.apply(theme),theme);
    await prepare(page);
    // Auth hydration during preparation may reapply the synthetic account's
    // stored theme. Select the requested theme after the real view is ready.
    await page.evaluate(theme=>window.PortalTheme?.apply(theme),theme);
    await page.emulateMedia({media});
    await page.mouse.move(-100,-100);
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(700);
    // Full-page capture itself can settle native font metrics/compositor layers.
    // The Linux artifact proved identical admin PNGs with different pre-capture
    // monospace metrics. Require independent stability inside EACH source phase,
    // never choose a frame based on whether it resembles the other source.
    const firstReport=await inspectSurfaces(page);
    const captures=[];
    let report=firstReport,screenshot,previousScreenshot,previousSnapshot;
    for(let attempt=1;attempt<=5;attempt++){
      screenshot=await page.screenshot({fullPage:true,animations:'disabled',caret:'hide'});
      report=await inspectSurfaces(page);
      const snapshot=JSON.stringify(report.snapshot);
      const pngStable=previousScreenshot?.equals(screenshot)||false;
      const snapshotStable=previousSnapshot===snapshot;
      captures.push({attempt,sha256:createHash('sha256').update(screenshot).digest('hex'),pngStable,snapshotStable});
      if(pngStable&&snapshotStable)break;
      if(attempt===5)throw new Error(`Unstable ${route} ${theme}/${media} capture: ${JSON.stringify(captures)}`);
      previousScreenshot=screenshot;previousSnapshot=snapshot;
      await page.waitForTimeout(150);
    }
    page.off('pageerror',captureError);
    if(report.theme!==theme||report.media!==media)throw new Error(`Capture mode changed: expected ${theme}/${media}, got ${report.theme}/${report.media}`);
    const captureStability={theme:report.theme,media:report.media,captures,initialSnapshotChanged:JSON.stringify(firstReport.snapshot)!==JSON.stringify(report.snapshot)};
    return {report,screenshot,errors,captureStability,hash:createHash('sha256').update(screenshot).digest('hex')};
  };
  const pattern='http://127.0.0.1:4176/**';
  let assets=working;
  const fulfilledCurrent=new Set(),fulfilledBase=new Set();
  const handler=async request=>{
    const pathname=decodeURIComponent(new URL(request.request().url()).pathname);
    const name=pathname==='/'?'index.html':pathname.replace(/^\//,'').replace(/\/$/,'/index.html');
    if(!assets.has(name))return request.fallback();
    (assets===working?fulfilledCurrent:fulfilledBase).add(name);
    const contentType=name.endsWith('.css')?'text/css':name.endsWith('.js')?'text/javascript':'text/html';
    return request.fulfill({contentType,body:assets.get(name)});
  };
  await context.route(pattern,handler);
  let current,baseline;
  try { current=await load();assets=original;baseline=await load(); } finally { await context.unroute(pattern,handler); }
  if(changed.includes('css/portal-interactions.css')&&(!fulfilledCurrent.has('css/portal-interactions.css')||!fulfilledBase.has('css/portal-interactions.css')))throw new Error('Changed global theme stylesheet was not served from both current and base source maps');
  for(const [label,report]of[['current',current.report],['base',baseline.report]])if(new Set(report.snapshot.map(item=>item.selector)).size!==report.snapshot.length)throw new Error(`Non-unique snapshot selectors invalidate ${label} comparison`);
  const baselineMap=new Map(baseline.report.snapshot.map(item=>[item.selector,item]));
  const differences=[];
  for(const item of current.report.snapshot) {
    const before=baselineMap.get(item.selector); baselineMap.delete(item.selector);
    if(JSON.stringify(before)!==JSON.stringify(item)) differences.push({selector:item.selector,before,after:item});
  }
  for(const [selector,before] of baselineMap)differences.push({selector,before,after:null});
  const pixelComparison=comparePngPixels(current.screenshot,baseline.screenshot);
  const sourceEvidence=(files,sources)=>[...files].sort().map(file=>({path:file,sha256:createHash('sha256').update(sources.get(file)).digest('hex')}));
  const report={route,theme,media,preparationMedia:'screen',diffScope:'repository-root',baseCommit,changed,productChanges:changed.filter(file=>!file.startsWith('testing/')),servedCurrentFiles:sourceEvidence(fulfilledCurrent,working),servedBaseFiles:sourceEvidence(fulfilledBase,original),hashCurrent:current.hash,hashBase:baseline.hash,screenshotsIdentical:current.hash===baseline.hash,pixelComparison,differences,captureStability:{current:current.captureStability,base:baseline.captureStability},errorsCurrent:current.errors,errorsBase:baseline.errors,newErrors:current.errors.filter(error=>!baseline.errors.includes(error))};
  const name=`${theme}-${media}-base-comparison`;
  await info.attach(`${name}.json`,{body:Buffer.from(JSON.stringify(report,null,2)),contentType:'application/json'});
  await writeFile(info.outputPath(`${name}.json`),JSON.stringify(report,null,2));
  await info.attach(`${name}-current.png`,{body:current.screenshot,contentType:'image/png'});
  await info.attach(`${name}-base.png`,{body:baseline.screenshot,contentType:'image/png'});
  return report;
}
