// Opening frames and retained reopening; local assets and synthetic APIs only.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const output=process.argv[2]||'.local/compose-paint';await fs.mkdir(output,{recursive:true});
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
try {
  for(const theme of ['light','dark'])for(const mode of ['cold','warm','slow-css']) {
    const errors={errors:[]}, {page,context}=await newPage(browser,{width:390,theme,seedOnce:true},server.origin,errors);let delayed=0;
    if(mode==='slow-css')await context.route('**/css/citizen-compose-refinement.css*',async r=>{delayed++;await new Promise(resolve=>setTimeout(resolve,1600));return r.fallback();});
    await context.addInitScript(()=>{
      window.__composeFrames=[];window.__composePhase='idle';
      const frame=()=>{
        const m=document.getElementById('newManifestationModal');
        if(m?.classList.contains('open')&&m.getClientRects().length&&window.__composePhase!=='idle') {
          const grid=m.querySelector('.manifestation-type-grid'),panel=m.querySelector('.citizen-modal-panel'),form=document.getElementById('newManifestationForm');
          window.__composeFrames.push({phase:window.__composePhase,at:performance.now(),title:m.querySelector('h2').textContent,columns:getComputedStyle(grid).gridTemplateColumns,cardHeight:grid.firstElementChild.getBoundingClientRect().height,panel:panel.getBoundingClientRect().toJSON(),overflow:panel.scrollWidth-panel.clientWidth,formOverflow:getComputedStyle(form).overflowY,details:document.getElementById('composeDetails').open,refined:m.hasAttribute('data-compose-refinement')});
        }
        requestAnimationFrame(frame);
      };requestAnimationFrame(frame);
    });
    await page.goto(server.origin+(mode==='warm'?'/':'/cidadao/'));
    if(mode==='warm') {
      await ready(page,'/');await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));await ready(page,'/cidadao/');
      await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/',location.href)));await ready(page,'/');await page.evaluate(()=>PortalCitizenShell.navigate(new URL('/cidadao/',location.href)));
    }
    await ready(page,'/cidadao/');
    const cdp=await context.newCDPSession(page);await cdp.send('Page.enable');let phase='idle';const counts={opening:0,reopening:0},images=[],pending=[];
    cdp.on('Page.screencastFrame',frame=>{
      if(phase!=='idle'&&counts[phase]<10){const file=`${output}/${mode}-${theme}-${phase}-${counts[phase]++}.jpg`;images.push(file);pending.push(fs.writeFile(file,Buffer.from(frame.data,'base64')));}
      cdp.send('Page.screencastFrameAck',{sessionId:frame.sessionId}).catch(()=>{});
    });
    await cdp.send('Page.startScreencast',{format:'jpeg',quality:90,maxWidth:390,maxHeight:844,everyNthFrame:1});
    for(const step of ['opening','reopening']) {
      phase=step;await page.evaluate(s=>{window.__composePhase=s;},step);await page.locator('#openNewManifestation').click();await page.locator('#newManifestationModal.open').waitFor();await page.waitForTimeout(350);await page.screenshot({path:`${output}/${mode}-${theme}-${step}-settled.png`});
      await page.locator('#newManifestationModal .citizen-modal-close').click();await page.locator('#newManifestationModal').waitFor({state:'hidden'});phase='idle';await page.evaluate(()=>window.__composePhase='idle');
    }
    await cdp.send('Page.stopScreencast');await Promise.all(pending);
    const frames=await page.evaluate(()=>window.__composeFrames);assert(frames.length>0);
    for(const step of ['opening','reopening'])assert(frames.some(f=>f.phase===step));
    const bad=frames.filter(f=>!f.refined||f.title!=='Escrever ao Conselho'||f.columns.split(' ').length!==2||f.cardHeight>80||f.overflow>1||f.formOverflow!=='auto'||f.details);
    assert.deepEqual(bad,[]);assert.deepEqual(errors.errors,[]);if(mode==='slow-css')assert(delayed>0);
    const row={theme,mode,delayed,frames,badFrames:bad.length,images,errors:errors.errors};results.push(row);console.log(JSON.stringify({theme,mode,delayed,frames:frames.length,badFrames:bad.length,images:images.length,passed:true}));await context.close();
  }
  await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
} finally {await browser.close();await new Promise(r=>server.server.close(r));}
