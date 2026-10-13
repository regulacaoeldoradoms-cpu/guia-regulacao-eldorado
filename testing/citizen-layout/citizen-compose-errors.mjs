// Synthetic protocols and intercepted requests only; no production submission.
import assert from 'node:assert/strict';
process.env.PORTAL_FIXTURES_ONLY='1';
const {serve,newPage,ready,chromium,user}=await import('./mobile-profile-refinement.mjs');
const server=await serve(process.cwd()),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
try {
  for(const scenario of ['attachment-failure','rate-limit','president']) {
    const result={errors:[]};let posts=0,uploads=0;
    const {page,context}=await newPage(browser,{width:scenario==='president'?1280:430,theme:'light',seedOnce:true,user:{...user,councilRole:scenario==='president'?'presidente':null}},server.origin,result);
    await context.route('**/conselho/painel/',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Destino sintético restrito</title>'}));
    const item={protocol:'CMS-2026-009999',type:'denuncia',subject:'Assunto sintético',description:'Relato sintético para verificar o envio.',status:'recebida',privacyMode:'sigilosa',createdAt:'2026-10-13T00:00:00Z'};
    await context.route('**/api/council/**',r=>{
      const path=new URL(r.request().url()).pathname;
      if(r.request().method()==='POST') {
        if(path.endsWith('/attachments')) {uploads++;return r.fulfill({status:500,json:{error:'Anexo sintético indisponível'}});}
        posts++;
        if(scenario==='rate-limit')return r.fulfill({status:429,headers:{'Retry-After':'120'},json:{error:'Limite sintético',retryAfterSeconds:120}});
        return r.fulfill({json:{manifestation:item}});
      }
      return r.fulfill({json:path.endsWith(item.protocol)?{manifestation:item,messages:[],events:[],attachments:[]}:{manifestations:posts?[item]:[],notifications:[]}});
    });
    await page.goto(server.origin+'/cidadao/');if(scenario==='president')await page.waitForURL('**/conselho/painel/');else await ready(page,'/cidadao/');
    if(scenario==='president') {
      assert.equal(new URL(page.url()).pathname,'/conselho/painel/');assert.equal(posts,0);
    } else {
      await page.locator('#openNewManifestation').click();await page.locator('input[name=manifestationType][value=denuncia]').check();
      await page.locator('#manifestationSubject').fill(item.subject);await page.locator('#manifestationDescription').fill(item.description);await page.locator('#manifestationConfirm').check();
      for(const invalid of [Array.from({length:6},(_,i)=>({name:`fixture${i}.pdf`,mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4')})),{name:'large.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(5*1024*1024+1)}]) {
        await page.locator('#manifestationFiles').setInputFiles(invalid);assert.equal(await page.locator('#manifestationFiles').evaluate(n=>n.files.length),0);assert.equal(posts,0);
      }
      await page.locator('#manifestationFiles').setInputFiles({name:'fixture.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% synthetic')});await page.locator('#submitManifestation').click();
      if(scenario==='attachment-failure') {
        await page.locator('#newManifestationStatus').filter({hasText:'podem ser adicionados depois'}).waitFor();assert.match(await page.locator('#newManifestationStatus').textContent(),new RegExp(item.protocol));assert.equal(posts,1);assert.equal(uploads,1);await page.locator('#manifestationDetailModal.open').waitFor();
      } else {
        await page.locator('#newManifestationStatus').filter({hasText:'Limite sintético'}).waitFor();assert.equal(await page.locator('#manifestationDescription').inputValue(),item.description);assert.equal(await page.locator('#manifestationFiles').evaluate(n=>n.files.length),1);assert(!(await page.locator('#submitManifestation').isDisabled()));assert.equal(uploads,0);
      }
    }
    assert.deepEqual(result.errors,[]);console.log(JSON.stringify({scenario,posts,uploads,passed:true}));await context.close();
  }
} finally {await browser.close();await new Promise(r=>server.server.close(r));}
