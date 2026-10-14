import {expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
const base=process.env.DARK_AUDIT_BASE||'origin/main';
const achievementHtml=execFileSync('git',['show',`${base}:conquistas/index.html`],{encoding:'utf8'});
// Preserve the whole prior portal. Project only the exact additions explicitly
// requested by this PR, after checking their contract and recording evidence.
// No pixel/style tolerance, permissions check or comparison is bypassed.
export async function projectTutorialAdditions(page,info,route,current){
 if(route==='/cidadao/'){
  const entry=page.locator('[data-citizen-tutorial-entry]');
  if(!current){expect(await entry.count()).toBe(0);return;}
  await expect(entry).toHaveCount(1);
  await expect(entry.locator('summary')).toHaveAttribute('aria-label','Tutorial do Canal');
  expect(await entry.evaluate(n=>({tag:n.tagName,open:n.open}))).toEqual({tag:'DETAILS',open:false});
  await expect(entry.locator('[data-tutorial-start]')).toHaveText('Aprender usando o Canal');
  await expect(entry.locator('[data-tutorial-start]')).toHaveAttribute('type','button');
  await expect(entry.locator('[data-tutorial-restart]')).toHaveText('Refazer tutorial');
  await expect(entry.locator('[data-tutorial-restart]')).toBeHidden();
  await expect(entry.locator('[data-tutorial-status]')).toHaveText('');
  await expect(entry.locator('[data-tutorial-close-options]')).toHaveText('Fechar ajuda');
  await expect(entry.locator('[data-tutorial-close-options]')).toHaveAttribute('type','button');
  expect(await entry.locator('button').count()).toBe(3);
  expect(await page.locator('dialog.citizen-tutorial').count()).toBe(0);
  await info.attach('approved-tutorial-entry.json',{body:Buffer.from(JSON.stringify(await entry.evaluate(n=>({html:n.outerHTML,buttons:[...n.querySelectorAll('button')].map(b=>({text:b.textContent,type:b.type,hidden:b.hidden}))})))),contentType:'application/json'});
  const before=await page.locator('.portal-hero,.citizen-actions,.citizen-grid').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
  await entry.evaluate(n=>n.remove());
  const after=await page.locator('.portal-hero,.citizen-actions,.citizen-grid').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
  expect(before,'The compact tutorial entry must not move native geometry').toEqual(after);
 }
 if(route==='/conquistas/'){
  const card=page.locator('#citizenTutorialAchievement');
  if(!current){expect(await card.count()).toBe(0);return;}
  await expect(card).toHaveCount(1);
  await expect(card.locator('h3')).toHaveText('Canal do Cidadão');
  await expect(card.locator('.achievement-state')).toHaveText('Disponível');
  await expect(card.locator('[data-citizen-tutorial-achievement]')).toHaveText('Conclua integralmente o tutorial interativo do Canal do Cidadão.');
  await expect(card.locator('a')).toHaveAttribute('href','/cidadao/');
  await expect(card.locator('a')).toHaveText('Aprender usando o Canal');
  expect(await card.locator('a').count()).toBe(1);
  const evidence=await card.evaluate((node,html)=>{
   const old=new DOMParser().parseFromString(html,'text/html');
   const category=doc=>[...doc.querySelectorAll('.account-achievement-category')].find(n=>n.querySelector('h2')?.textContent==='Exploração do Portal');
   const previous=category(old),previousCard=previous.querySelector('.achievement-card'),currentCategory=node.closest('.account-achievement-category');
   const caption=currentCategory.querySelector('header p');
   if(caption.textContent!=='Conquistas por conhecer experiências do Portal, sem alterar permissões da conta.')throw new Error('Unexpected exploration caption');
   if(node.querySelector('.achievement-icon').innerHTML!==previousCard.querySelector('.achievement-icon').innerHTML)throw new Error('Native exploration icon changed');
   const result={approved:node.outerHTML,caption:caption.textContent,previous:previousCard.outerHTML};
   node.replaceWith(document.importNode(previousCard,true));caption.textContent=previous.querySelector('header p').textContent;
   return result;
  },achievementHtml);
  await info.attach('approved-tutorial-achievement.json',{body:Buffer.from(JSON.stringify(evidence)),contentType:'application/json'});
 }
}
