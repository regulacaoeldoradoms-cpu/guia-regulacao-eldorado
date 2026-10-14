// Synthetic local files, real DOM and intercepted Council APIs only.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium}=await import('./mobile-profile-refinement.mjs');
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
const out='.local/compose-files-errors';await fs.mkdir(out,{recursive:true});
try {
 const result={errors:[]},posts=[],uploads=[],{page,context,audit}=await newPage(browser,{width:390,theme:'light',seedOnce:true},server.origin,result);
 await context.addInitScript(()=>{
  const read=Blob.prototype.arrayBuffer;
  Blob.prototype.arrayBuffer=function(){if(window.__failRead)return Promise.reject(Error('synthetic read failure'));if(window.__holdRead)return new Promise(resolve=>{window.__releaseRead=()=>read.call(this).then(resolve);});return read.call(this);};
  window.__fileURLs=new Map();const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);
  URL.createObjectURL=blob=>{const url=create(blob);window.__fileURLs.set(url,{local:new Error().stack.includes('citizen-compose-attachments'),revoked:false});return url;};
  URL.revokeObjectURL=url=>{const r=window.__fileURLs.get(url);if(r)r.revoked=true;return revoke(url);};
 });
 const protocol='CMS-2026-000009',item={protocol,type:'elogio',subject:'Assunto sintético',description:'Relato inteiramente sintético.',status:'recebida',privacyMode:'sigilosa',createdAt:'2026-10-14T00:00:00Z'};
 await context.route('**/api/council/**',r=>{
  const p=new URL(r.request().url()).pathname;
  if(r.request().method()==='POST'){if(p.endsWith('/attachments')){uploads.push(r.request().postData());return r.fulfill({json:{ok:true}});}posts.push(r.request().postData());return r.fulfill({json:{manifestation:item}});}
  return r.fulfill({json:p.endsWith(protocol)?{manifestation:item,messages:[],events:[],attachments:[]}:{manifestations:posts.length?[item]:[],notifications:[]}});
 });
 await page.goto(server.origin+'/cidadao/');await ready(page,'/cidadao/');await page.locator('#openNewManifestation').click();
 await page.locator('input[name=manifestationType][value=elogio]').check();await page.locator('#manifestationSubject').fill(item.subject);await page.locator('#manifestationDescription').fill(item.description);await page.locator('#manifestationConfirm').check();
 const picker=page.locator('#manifestationFiles'),active=()=>page.evaluate(()=>[...__fileURLs.values()].filter(r=>r.local&&!r.revoked).length);
 const png=Buffer.from(await page.evaluate(()=>{const c=document.createElement('canvas');c.width=80;c.height=50;c.getContext('2d').fillRect(0,0,80,50);return c.toDataURL('image/png').split(',')[1];}),'base64');
 const file=(name='synthetic.png',buffer=png)=>({name,mimeType:'image/png',buffer});
 await page.evaluate(()=>window.__failRead=true);await picker.setInputFiles(file());await page.locator('.preview-unavailable').waitFor();assert.match(await page.locator('.compose-file-row').textContent(),/arquivo foi mantido/);assert.equal(await picker.evaluate(n=>n.files.length),1);assert.equal(await active(),0);await page.evaluate(()=>window.__failRead=false);
 await picker.setInputFiles(file('fake.png',Buffer.from('<svg onload="alert(1)"></svg>')));await page.locator('.preview-unavailable').waitFor();assert.equal(await active(),0);assert.equal(await picker.evaluate(n=>n.files.length),1);
 await page.evaluate(()=>window.__holdRead=true);await picker.setInputFiles(file('pending.png'));await page.waitForFunction(()=>Boolean(window.__releaseRead));await page.evaluate(()=>window.__holdRead=false);
 await picker.setInputFiles({name:'safe.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% synthetic\n%%EOF')});await page.evaluate(async()=>{await window.__releaseRead();await new Promise(resolve=>requestAnimationFrame(resolve));});assert.equal(await active(),0);assert.equal(await page.locator('.compose-file-meta strong').textContent(),'safe.pdf');
 await picker.setInputFiles([file('same.png'),file('same.png')]);await page.waitForFunction(()=>document.querySelectorAll('.has-preview').length===2);assert.deepEqual(await page.locator('.compose-file-meta strong').allTextContents(),['same.png','same.png (2)']);assert.equal(await active(),2);
 await picker.setInputFiles(Array.from({length:6},(_,i)=>file('limit-'+i+'.png')));assert.match(await page.locator('#newManifestationStatus').textContent(),/máximo 5/);assert.equal(await picker.evaluate(n=>n.files.length),2);assert.equal(await active(),2);
 await picker.setInputFiles(file('large.png',Buffer.alloc(5*1024*1024+1)));assert.match(await page.locator('#newManifestationStatus').textContent(),/5 MB/);assert.equal(await picker.evaluate(n=>n.files.length),2);assert.equal(await active(),2);
 await page.getByRole('button',{name:'Ampliar imagem same.png',exact:true}).click();await page.locator('#composeFilePreview').click({position:{x:2,y:2}});assert(await page.locator('#composeFilePreview').isHidden());assert.equal(await active(),2);
 await page.getByRole('button',{name:'Ampliar imagem same.png',exact:true}).click();await page.emulateMedia({media:'print'});await page.locator('#composeFilePreview').waitFor({state:'hidden'});assert(await page.locator('#composeFilePreview').isHidden());await page.emulateMedia({media:'screen'});assert.equal(await active(),2);
 assert.equal(posts.length,0);assert.equal(uploads.length,0);
 await page.evaluate(()=>window.DataTransfer=class{constructor(){throw Error('synthetic unsupported DataTransfer');}});
 await page.getByRole('button',{name:'Remover anexo same.png',exact:true}).click();assert.equal(await active(),1);assert.equal(await picker.evaluate(n=>n.files.length),0);assert.equal(await page.locator('.compose-file-row').count(),1);
 await page.locator('#submitManifestation').click();await page.locator('#newManifestationStatus').filter({hasText:'Manifestação enviada'}).waitFor();assert.equal(posts.length,1);assert.equal(uploads.length,1);assert.match(uploads[0],/filename="same.png"/);assert.equal(await active(),0);
 await page.locator('#manifestationDetailModal.open').waitFor();await page.locator('#manifestationDetailModal .citizen-modal-close').click();await page.locator('#openNewManifestation').click();await page.locator('input[name=manifestationType][value=elogio]').check();await picker.setInputFiles(file('cleanup.png'));await page.waitForFunction(()=>document.querySelectorAll('.has-preview').length===1);assert.equal(await active(),1);
 await page.evaluate(()=>PortalCitizenShell.active().dispose());assert.equal(await active(),0);assert.equal(await page.locator('#newManifestationForm').count(),0);
 assert.deepEqual(result.errors,[]);assert.deepEqual(audit.unmappedApiCalls,[]);
 const report={readError:true,falseImage:true,staleRead:true,duplicateNames:true,limitsPreserveFiles:true,printAndBackdrop:true,unsupportedDataTransfer:true,onlyRetainedFileUploaded:true,disposedURLs:0,posts:posts.length,uploads:uploads.length,errors:result.errors,passed:true};await fs.writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));await context.close();
} finally {await browser.close();await new Promise(r=>server.server.close(r));}
