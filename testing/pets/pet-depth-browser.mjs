import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {serve,chromium,pairScene} from './coexist-browser-fixture.mjs';
const out=process.argv[2]||'.local/depth-browser';await fs.mkdir(out,{recursive:true});
const server=await serve(process.cwd()),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
try{for(const [width,height]of [[320,844],[390,844],[1440,1000]]){const scene=await pairScene(browser,server,{width,height});try{
 await scene.load();await scene.page.emulateMedia({reducedMotion:'no-preference'});await scene.page.locator('#petHabitat').scrollIntoViewIfNeeded();
 const result=await scene.page.evaluate(()=>{const p=PortalPets.runtime,g=p.gnomeRuntime;for(const r of [p,g])cancelAnimationFrame(r.frame);const rows=[];
 p.state.preferences.motionEnabled=g.state.preferences.motionEnabled=true;p.speech={text:()=>'',setSuppressed:()=>{}};g.speech={text:()=> 'Fala inteiramente sintética.',bubbleUntil:Date.now()+1e6,nextAt:Infinity,setSuppressed:()=>{}};p.coordinator.current=null;p.coordinator.gapUntil=0;p.coordinator.entries.clear();
 for(const mode of ['inline','global']){p.attachHabitat(mode==='inline'?document.getElementById('petHabitat'):null);for(const action of ['run','trip','sleep']){p.action=g.action=action;p.actionStarted=g.actionStarted=performance.now();p.until=g.until=Infinity;
 for(const [py,gy,want]of [[240,235,'primary'],[235,240,'gnome'],[240,240,'gnome'],[245,240,'primary'],[240,240,'primary']]){p.x=g.x=(p.bounds.left+p.bounds.right)/2;p.y=py;g.y=gy;p.render();g.render();const expected=want==='primary'?p:g,other=want==='primary'?g:p;
 rows.push({mode,action,py,gy,front:p.frontPet,expected:want,correct:Number(expected.root.style.zIndex)>Number(other.root.style.zIndex),pointer:getComputedStyle(g.bubble).pointerEvents,bubbleGroup:g.bubble.parentElement===g.root,activeBubble:!g.bubble.hidden});}
 }}return rows;});assert(result.every(r=>r.front===r.expected&&r.correct&&r.pointer==='none'&&r.bubbleGroup&&r.activeBubble));
 await scene.page.screenshot({path:`${out}/${width}-crossing.png`});assert.equal(scene.result.errors.length,0);console.log(JSON.stringify({width,crossings:result.length,passed:true}));
 }finally{await scene.close();}}}finally{await browser.close();await new Promise(r=>server.server.close(r));}
