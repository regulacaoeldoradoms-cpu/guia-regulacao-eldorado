// Synthetic files and intercepted APIs only. These captures contain no real people.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const {applyTextScale}=await import('./text-scale.mjs');
const output=path.resolve(process.env.COMPOSE_FINAL_OUTPUT||'.local/compose-final');
await fs.mkdir(output,{recursive:true});
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),results=[];
async function picture(page,mime,width,height,label){
  const data=await page.evaluate(({mime,width,height,label})=>{const c=document.createElement('canvas');c.width=width;c.height=height;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,width,height);g.addColorStop(0,'#107e88');g.addColorStop(1,'#a4d6b2');x.fillStyle=g;x.fillRect(0,0,width,height);x.fillStyle='#fff';x.beginPath();x.moveTo(0,height);x.lineTo(width*.45,height*.35);x.lineTo(width,height);x.fill();x.fillStyle='#173b5d';x.font='bold 26px sans-serif';x.fillText(label,24,52);return c.toDataURL(mime,.8);},{mime,width,height,label});
  return Buffer.from(data.split(',')[1],'base64');
}
async function bounds(page,selector){return page.locator(selector).evaluateAll(nodes=>nodes.map(n=>({id:n.id,width:n.clientWidth,scroll:n.scrollWidth,height:n.clientHeight,scrollHeight:n.scrollHeight})));}
try{
 for(const width of (process.env.WIDTHS||'320,360,390,412').split(',').map(Number))for(const theme of ['light','dark'])for(const scale of (process.env.SCALES||'1,2').split(',').map(Number)){
  const result={width,theme,scale,errors:[],posts:0,uploads:0};const{page,context,audit}=await newPage(browser,{width,theme,seedOnce:true},server.origin,result);
  try{
   await context.addInitScript(()=>{window.__attachmentURLs=new Map();const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);window.__attachmentURLs.set(url,{local:new Error().stack.includes('citizen-compose-attachments'),revoked:false});return url;};URL.revokeObjectURL=url=>{const r=window.__attachmentURLs.get(url);if(r)r.revoked=true;return revoke(url);};});
   await context.route('**/api/council/**',r=>{if(r.request().method()==='POST'){if(new URL(r.request().url()).pathname.endsWith('/attachments'))result.uploads++;else result.posts++;return r.fulfill({status:422,json:{error:'Erro sintético; não existe envio real'}});}return r.fulfill({json:{manifestations:[],notifications:[]}});});
   await page.goto(server.origin+'/cidadao/');await ready(page,'/cidadao/');await page.locator('#openNewManifestation').click();
   process.env.TEXT_SCALE=scale===2?'2':'';await applyTextScale(page);
   assert(await page.locator('#submitManifestation').isDisabled());
   assert(await page.locator('#composeDetails').isHidden());assert(await page.locator('#composeAttachments').isHidden());assert(await page.locator('.compose-privacy').isHidden());
   await page.screenshot({path:path.join(output,`${width}-${theme}-${scale}-initial.png`)});
   await page.locator('input[name=manifestationType][value=sugestao]').check();
   await page.locator('#manifestationSubject').fill('Sugestão de teste para melhorar a recepção');await page.locator('#manifestationDescription').fill('Relato inteiramente sintético para conferir a apresentação do formulário.');
   assert(await page.locator('#submitManifestation').isDisabled());await page.locator('#manifestationConfirm').check();assert(await page.locator('#submitManifestation').isEnabled());
   await page.screenshot({path:path.join(output,`${width}-${theme}-${scale}-report.png`)});
   const png=await picture(page,'image/png',640,400,'ANEXO SINTÉTICO 1'),jpg=await picture(page,'image/jpeg',360,640,'TESTE 2');
   await page.locator('#manifestationFiles').setInputFiles([{name:'imagem-de-teste.png',mimeType:'image/png',buffer:png},{name:'imagem-vertical-de-teste.jpg',mimeType:'image/jpeg',buffer:jpg},{name:'documento-de-teste.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% arquivo sintético\n%%EOF')}]);
   await page.waitForFunction(()=>document.querySelectorAll('.compose-file-thumb.has-preview').length===2);await applyTextScale(page);
   assert.equal(await page.locator('.compose-file-row').count(),3);assert.equal(await page.locator('.compose-file-meta strong').count(),3);
   assert(await page.locator('#manifestationFiles').isHidden());assert.equal(result.posts,0);assert.equal(result.uploads,0);
   const activeURLs=()=>page.evaluate(()=>[...__attachmentURLs.values()].filter(r=>r.local&&!r.revoked).length);
   assert.equal(await activeURLs(),2);
   await page.locator('#composeAttachments').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`${width}-${theme}-${scale}-files.png`)});
   assert((await bounds(page,'.compose-file-row')).every(n=>n.scroll<=n.width+1));
   await page.getByRole('button',{name:'Ampliar imagem imagem-de-teste.png',exact:true}).click();
   await page.keyboard.press('Tab');assert(await page.locator('#composeFilePreview').evaluate(n=>n.contains(document.activeElement)),JSON.stringify(await page.evaluate(()=>({active:document.activeElement?.tagName,activeId:document.activeElement?.id,preview:document.getElementById('composeFilePreview').className,close:getComputedStyle(document.querySelector('#composeFilePreview button')).visibility,root:getComputedStyle(document.getElementById('composeFilePreview')).visibility,composeInert:document.getElementById('newManifestationModal').inert}))));
   await applyTextScale(page);
   await page.waitForFunction(()=>document.querySelector('#composeFilePreview img').naturalWidth===640);
   assert(await page.locator('#newManifestationModal').evaluate(n=>n.inert));
   await page.screenshot({path:path.join(output,`${width}-${theme}-${scale}-preview.png`)});
   for(let i=0;i<4;i++){await page.keyboard.press('Tab');assert(await page.locator('#composeFilePreview').evaluate(n=>n.contains(document.activeElement)),JSON.stringify(await page.evaluate(()=>({active:document.activeElement?.outerHTML,preview:document.getElementById('composeFilePreview').className,composeInert:document.getElementById('newManifestationModal').inert}))));}
   await page.locator('#newManifestationForm').evaluate(n=>n.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));assert.equal(result.posts,0);
   await page.keyboard.press('Escape');
   assert(await page.locator('#composeFilePreview').isHidden());assert(!(await page.locator('#newManifestationModal').evaluate(n=>n.inert)));
   assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Ampliar imagem imagem-de-teste.png');
   await page.locator('#composeAttachments summary').click();await page.locator('#composeAttachments summary').click();assert.equal(await activeURLs(),2);
   await page.locator('input[name=manifestationType][value=denuncia]').check();assert.equal(await page.locator('#manifestationFiles').evaluate(n=>n.files.length),3);
   await page.getByRole('button',{name:'Remover anexo imagem-de-teste.png',exact:true}).click();assert.equal(await activeURLs(),1);assert.equal(await page.locator('#manifestationFiles').evaluate(n=>n.files.length),2);
   await page.locator('#newManifestationModal .citizen-modal-close').click();await page.locator('#openNewManifestation').click();assert.equal(await activeURLs(),1);assert.equal(await page.locator('.compose-file-row').count(),2);
   await page.locator('#manifestationFiles').setInputFiles({name:'imagem-substituída.png',mimeType:'image/png',buffer:png});await page.waitForFunction(()=>document.querySelectorAll('.compose-file-thumb.has-preview').length===1);assert.equal(await activeURLs(),1);assert.equal(await page.locator('.compose-file-row').count(),1);
   await page.locator('#manifestationFiles').setInputFiles({name:'invalido.txt',mimeType:'text/plain',buffer:Buffer.from('fixture')});assert.equal(await activeURLs(),1);assert.match(await page.locator('#newManifestationStatus').textContent(),/anteriores foram mantidos/);
   await page.setViewportSize({width,height:400});await page.locator('#submitManifestation').scrollIntoViewIfNeeded();
   const reachable=await page.locator('#submitManifestation').evaluate(n=>{const r=n.getBoundingClientRect();return n.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});assert(reachable);
   await page.screenshot({path:path.join(output,`${width}-${theme}-${scale}-keyboard.png`)});
   await page.locator('#newManifestationForm').evaluate(n=>n.reset());await page.waitForFunction(()=>document.querySelectorAll('.compose-file-row').length===0);assert.equal(await activeURLs(),0);assert(await page.locator('#submitManifestation').isDisabled());
   assert.equal(result.posts,0);assert.equal(result.uploads,0);assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);results.push(result);console.log(JSON.stringify({...result,passed:true}));
  }finally{await context.close();await fs.writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2));}
 }
}finally{await browser.close();await new Promise(r=>server.server.close(r));}
