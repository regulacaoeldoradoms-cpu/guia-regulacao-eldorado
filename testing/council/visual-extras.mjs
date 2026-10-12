import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {openVisual} from './visual-fixtures.mjs';import {applyTextScale} from '../citizen-layout/text-scale.mjs';
const output=process.argv[2]||'.local/council-visual-extras';await fs.mkdir(output,{recursive:true});const results=[];
const cases=[...[0,3].flatMap(count=>[320,360,390].flatMap(width=>['light','dark'].map(theme=>({count,width,theme,scale:1})))),...[320,360,390].flatMap(width=>['light','dark'].map(theme=>({count:253,width,theme,scale:2}))),{count:253,width:390,theme:'dark',scale:1,role:'membro'},{count:253,width:390,theme:'dark',scale:1,role:'',developer:true}];
for(const scenario of cases){
 const scene=await openVisual(process.cwd(),scenario),{page}=scene;try{
  await page.goto(scene.origin+'/conselho/painel/');await page.waitForFunction(()=>document.body.classList.contains('council-navigation-ready'));await page.locator('#councilPager:not([hidden])').waitFor();
  process.env.TEXT_SCALE=scenario.scale===2?'2':'';await applyTextScale(page);assert(await page.locator('.portal-main').evaluate(n=>n.scrollWidth<=n.clientWidth+1));assert.equal(await page.locator('.social-mobile-nav a[href="/ferramentas/"]').count(),0);assert.equal(await page.locator('.social-mobile-nav #portalChatLauncher').count(),1);
  if(scenario.count){assert.equal(await page.locator('#councilRows tr[data-protocol]').count(),Math.min(20,scenario.count));await page.locator('.council-open-detail').first().click();await page.locator('#detailContent:not([hidden])').waitFor();await applyTextScale(page);assert(await page.locator('#councilDetailModal .citizen-modal-panel').evaluate(n=>n.scrollWidth<=n.clientWidth+1));
   if(scenario.role==='membro'){assert(await page.locator('#saveStatus').isHidden());assert.equal(await page.locator('.council-row-delete').count(),0);}else assert(await page.locator('#saveStatus').isEnabled());
   await page.screenshot({path:`${output}/${scenario.count}-${scenario.width}-${scenario.theme}-${scenario.scale}-${scenario.role||'president'}-detail.png`});await page.locator('#councilDetailModal [data-close-modal]').click();
  }else assert.equal(await page.locator('#councilRows tr[data-protocol]').count(),0);
  await page.screenshot({path:`${output}/${scenario.count}-${scenario.width}-${scenario.theme}-${scenario.scale}-${scenario.role||'president'}-list.png`});assert.equal(scene.result.errors.length,0);results.push(scenario);console.log(JSON.stringify({...scenario,passed:true}));
 }finally{await scene.close();}
}
await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
