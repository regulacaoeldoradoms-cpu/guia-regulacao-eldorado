import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {openVisual} from './visual-fixtures.mjs';
const output=process.argv[2]||'.local/council-navigation-frames';await fs.mkdir(output,{recursive:true});const results=[];
for(const developer of [false,true])for(const theme of ['light','dark']){
 const s=await openVisual(process.cwd(),{width:320,theme,count:3,slow:true,developer,role:developer?'':'presidente'}),{page}=s;
 try{
  await s.context.addInitScript(()=>{window.__councilBars=[];const sample=()=>{const nav=document.querySelector('.social-mobile-nav'),visible=node=>{const r=node.getBoundingClientRect(),c=getComputedStyle(node);return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility==='visible'&&Number(c.opacity)>0;};if(nav){const names=[...nav.querySelectorAll(':scope > .social-mobile-nav-link')].filter(visible).map(n=>n.getAttribute('aria-label')||n.textContent.trim());if(names.length)window.__councilBars.push({names,chatInBar:nav.contains(document.getElementById('portalChatLauncher')),marker:nav.dataset.homeIconNavigation});}requestAnimationFrame(sample);};requestAnimationFrame(sample);});
  await page.goto(s.origin+'/conselho/painel/');await page.waitForFunction(()=>document.body.classList.contains('council-navigation-ready')&&document.querySelector('.social-mobile-nav a[href="/mascotes/"]'));await page.waitForTimeout(100);
  await page.locator('#portalChatLauncher').click();await page.locator('#portalChatRoot.open').waitFor();await page.locator('.social-mobile-nav a[href="/amigos/"]').click();await page.waitForURL(s.origin+'/amigos/');assert.equal(await page.locator('#portalChatRoot.open').count(),0);await page.goto(s.origin+'/conselho/painel/');await page.waitForFunction(()=>document.body.classList.contains('council-navigation-ready'));await page.reload();await page.waitForFunction(()=>document.body.classList.contains('council-navigation-ready'));await page.waitForTimeout(100);
  const frames=await page.evaluate(()=>window.__councilBars);assert(frames.length>0);for(const f of frames){assert(!f.names.includes('Ferramentas'));assert(f.chatInBar);assert.equal(f.marker,'true');assert.deepEqual(f.names.filter(n=>n!=='Mascotes'),['Início','Amigos','Chat','Avisos','Perfil']);}
  assert.equal(await page.locator('#portalChatLauncher').count(),1);assert.equal(s.result.errors.length,0);results.push({developer,theme,frames:frames.length});console.log(JSON.stringify({developer,theme,passed:true}));
 }finally{await s.close();}
}
await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
