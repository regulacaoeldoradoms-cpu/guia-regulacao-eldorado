// Real Chromium controls for the capture harness, with synthetic APIs only.
// Run identical-code controls BEFORE trusting a comparison between versions.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './playwright-dark-audit.config.mjs';
import { installAuditFixture } from './dark-audit-fixture.mjs';
import { compareAgainstBase } from './dark-audit-base-comparison.mjs';

const directory=path.dirname(fileURLToPath(import.meta.url));
const output=path.resolve(directory,'test-results-capture-preparation');
const cases=[
  {name:'medico-desktop-light',project:'dark-desktop',route:'/medico/',theme:'light',media:'screen'},
  {name:'perfil-mobile-print',project:'dark-mobile',route:'/perfil/',theme:'dark',media:'print'}
];
const evidence=[];
await mkdir(output,{recursive:true});

async function capture(spec,phase,iteration,base,{negative=false}={}) {
  const project=config.projects.find(project=>project.name===spec.project);
  const {channel,defaultBrowserType,...device}=project.use;
  const browser=await chromium.launch({channel,headless:true,...config.use.launchOptions});
  const context=await browser.newContext({...device,baseURL:config.use.baseURL,serviceWorkers:config.use.serviceWorkers});
  const destination=path.join(output,`${phase}-${spec.name}-${iteration}`);
  await mkdir(destination,{recursive:true});
  const info={
    outputPath:name=>path.join(destination,name),
    attach:async(name,options)=>options.path
      ?copyFile(options.path,path.join(destination,name))
      :writeFile(path.join(destination,name),options.body)
  };
  try {
    // Match the real Playwright fixture order: its initial Page exists before
    // context routes/init scripts are installed; the baseline Page is new.
    const page=await context.newPage();
    const network=await installAuditFixture(context,{theme:spec.theme});
    const prepare=async target=>{
      if(negative&&target===page){
        // Change visible SVG paint, keeping its dimensions and DOM intact.
        // Stroke is deliberately absent from the computed-snapshot projection:
        // this verifies the PIXEL gate independently of layout/style assertions.
        await target.locator('.brand-mark svg path').evaluate(node=>node.style.stroke='rgb(230, 0, 0)');
      }
    };
    const report=await compareAgainstBase({page,context,info,...spec,base,prepare});
    assert.deepEqual(network.unexpected,[],'Unknown APIs invalidate this control');
    assert.deepEqual(report.newErrors,[],'New JavaScript errors invalidate this control');
    assert.deepEqual(report.differences,[],'Computed/layout snapshots must be exact');
    assert.equal(report.captureStability.current.snapshotStable,true);
    assert.equal(report.captureStability.base.snapshotStable,true);
    assert.equal(report.captureStability.current.rasterStable,true);
    assert.equal(report.captureStability.base.rasterStable,true);
    assert.deepEqual(report.pixelComparison.limit,{pixels:2,channelDelta:1});
    if(negative){
      assert.equal(report.pixelComparison.accepted,false,'Intentional SVG paint change must exceed the unchanged pixel tolerance');
      assert.equal(report.pixelComparison.gateAccepted,false,'Intentional visible paint must be rejected by the real gate');
    }else{
      assert.equal(report.pixelComparison.accepted,true,'Unchanged routes must satisfy the original two-pixel/one-channel tolerance');
      assert.equal(report.pixelComparison.gateAccepted,true);
    }
    const result={phase,case:spec.name,iteration,baseCommit:report.baseCommit,
      hashCurrent:report.hashCurrent,hashBase:report.hashBase,
      pixelComparison:report.pixelComparison,servedCurrentFiles:report.servedCurrentFiles,
      servedBaseFiles:report.servedBaseFiles,negative,passed:true};
    evidence.push(result);console.log(JSON.stringify(result));
  }catch(error){
    const result={phase,case:spec.name,iteration,negative,passed:false,error:error.message};
    evidence.push(result);console.error(JSON.stringify(result));
  }finally{
    await context.close();await browser.close();
    await writeFile(path.join(output,'summary.json'),JSON.stringify(evidence,null,2));
  }
}

for(const phase of ['same-code','versions']){
  for(const spec of cases)for(let iteration=1;iteration<=3;iteration++)
    await capture(spec,phase,iteration,phase==='same-code'?'HEAD':process.env.DARK_AUDIT_BASE||'origin/main');
  assert.equal(evidence.filter(result=>!result.passed).length,0,`${phase}: capture preparation is not repeatable; do not trust later comparisons`);
}
await capture(cases[0],'negative-paint',1,'HEAD',{negative:true});
assert.equal(evidence.filter(result=>!result.passed).length,0,'Intentional visual change was not detected');
console.log('CAPTURE_PREPARATION_CONTROLS_PASSED');
