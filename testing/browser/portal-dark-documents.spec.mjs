import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { installAuditFixture } from './dark-audit-fixture.mjs';
import { inspectSurfaces } from './dark-audit-surfaces.mjs';

const fixtureSource = readFileSync(new URL('../central-docs/fixture.js', import.meta.url), 'utf8');
const pdf = Buffer.from(fixtureSource.match(/const BASE64 = "([^"]+)"/)[1], 'base64');
const file = { ref:'audit-pdf-local', name:'AUDITORIA DADOS FICTICIOS.pdf', isPdf:true, isFolder:false, mimeType:'application/pdf', size:pdf.length, version:'synthetic-version-1', cacheKey:'synthetic-dark-audit' };
const file2 = { ...file, ref:'audit-pdf-local-2', name:'SEGUNDO PDF FICTICIO.pdf', cacheKey:'synthetic-dark-audit-2' };
const extraExceptions = [
  { selector:'.portal-pdf-page-loading', reason:'Temporary paper placeholder inside the PDF page preserves the white document surface while PDF.js rerenders.' },
  { selector:'.documents-editor-merge-preview-thumb', reason:'Thumbnail paper reproduces the synthetic PDF; the surrounding merge row remains audited.' },
  { selector:'.portal-pdf-object-text, .portal-pdf-object-handle, .portal-pdf-object-rotate', reason:'Authored text and on-paper selection handles intentionally preserve the document editing colors.' },
  { selector:'.portal-pdf-text-palette-color, .portal-pdf-text-quickbar-swatch, .portal-pdf-custom-color-plane, .portal-pdf-custom-color-plane-cursor, .portal-pdf-custom-color-preview', reason:'Color selection data and its two-tone cursor must preserve the chosen color including white.' }
];

async function prepare(context) {
  // Playwright's SW block leaves `.ready` pending. Model a browser without SW
  // so real portal startup uses its existing non-SW path; no product JS changes.
  await context.addInitScript(()=>{ delete Navigator.prototype.serviceWorker; });
  const network = await installAuditFixture(context, { responses:{
    '/api/documents/access':{ capabilities:{view:true,edit:true,extract:true,manage:true}, drive:{connected:true,configured:true,writeEnabled:false} },
    '/api/documents/drive/list':{items:[file,file2],nextPageToken:''},
    '/api/documents/ai/config':{ai:{enabled:true,processingEnabled:true,features:{extractDocument:true,extractPage:true,classifyPage:true,documentChat:true,backgroundPreparation:false},providers:{gemini:{enabled:true,model:'synthetic-local-provider'}},routines:[{id:'Rotina sintética',purpose:'Apenas auditoria visual local.'}]}},
    '/api/documents/preferences':{colorPalette:['#000000','#ffffff','#e53935','#1565c0'],viewerZoomScale:0.7},
    '/api/documents/presence/heartbeat':{presence:{viewers:1,editors:0},sessions:[]},
    '/api/documents/presence':{ok:true},
    '/api/documents/ai/chat':{chat:{answer:'Texto de resposta exclusivamente sintético para a auditoria local.',pages:[1]}}
  }});
  await context.route('**/api/documents/drive/content/*', route => {
    network.calls.push({path:new URL(route.request().url()).pathname,action:'synthetic-pdf-fulfilled-locally'});
    return route.fulfill({status:200,contentType:'application/pdf',body:pdf});
  });
  await context.route(/\/api\/documents\/ai\/page\/(extract|gemini|classify)$/, route => {
    const pageNumber=Number(route.request().headers()['x-document-page-number']||1);
    network.calls.push({path:new URL(route.request().url()).pathname,action:'synthetic-extraction-fulfilled-locally',pageNumber});
    const pageType='pagina_medica_autorizada';
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({classification:{pageNumber,pageType},extraction:{pageNumber,pageType,fields:{nome_paciente:{state:'encontrado',value:'PESSOA FICTÍCIA AUDITORIA'},cns:{state:'nao_consta',value:''},especialidade:{state:'ilegivel',value:''},motivo_encaminhamento:{state:'encontrado',value:'CONTEÚDO FICTÍCIO PARA TESTE VISUAL'}}},provider:{model:'synthetic-local-provider'}})});
  });
  return network;
}

async function record(page,info,name,reports) {
  const report=await inspectSurfaces(page);
  for (const finding of [...report.bright]) {
    const match = await page.locator(finding.selector).first().evaluate((el, list)=>list.find(e=>el.matches(e.selector))||null,extraExceptions).catch(()=>null);
    if(match) {
      report.allowed.push({...finding,reason:match.reason});
      report.bright.splice(report.bright.indexOf(finding),1);
    }
  }
  reports.push({name,bright:report.bright});
  writeFileSync(info.outputPath(name+'.json'),JSON.stringify(report,null,2));
  await info.attach(name+'.json',{body:Buffer.from(JSON.stringify(report,null,2)),contentType:'application/json'});
  await page.screenshot({path:info.outputPath(name+'.png'),fullPage:true,animations:'disabled',caret:'hide'});
}

test('real Documents UI: viewer, auxiliary panels, AI and Titon baseline',async({page,context},info)=>{
  test.setTimeout(150_000);
  const network=await prepare(context),reports=[];
  page.on('pageerror',error=>network.errors.push(error.message));
  await page.goto('/documentos/',{waitUntil:'load'});
  await expect(page.locator('.documents-item')).toHaveCount(2,{timeout:30_000}).catch(async error=>{
    await info.attach('startup-network.json',{body:Buffer.from(JSON.stringify(network,null,2)),contentType:'application/json'});
    console.log('Synthetic documents startup:',JSON.stringify(network));
    throw error;
  });
  await page.locator('#documentsAdvancedSearchButton').click();
  await expect(page.locator('#documentsAdvancedSearchDialog')).toBeVisible();
  await record(page,info,'advanced-search',reports);
  await page.locator('#documentsAdvancedSearchCloseButton').click();
  await page.locator('.documents-item').first().press('Enter');
  await expect.poll(()=>page.evaluate(()=>window.PortalPdfViewer?.getPageCount?.()||0)).toBe(3);
  await expect(page.locator('.portal-pdf-page-canvas').first()).toBeVisible();
  await expect(page.locator('.portal-pdf-page').first()).toHaveCSS('background-color','rgb(255, 255, 255)');
  await expect(page.locator('#pdfZoomLabel')).toHaveCSS('color','rgb(229, 238, 245)');
  await expect(page.locator('#pdfPageCountLabel')).toHaveCSS('color','rgb(159, 178, 193)');
  await record(page,info,'viewer',reports);

  await page.locator('#documentNotepadButton').click();
  await expect(page.locator('#documentsNotepadPanel')).toBeVisible();
  await page.locator('#documentNotepadText').fill('Rascunho exclusivamente sintético.');
  await record(page,info,'notepad',reports);
  await page.locator('#documentNotepadCloseButton').click();

  await page.locator('#documentAiButton').click();
  await expect(page.locator('#documentsAiPanel')).toBeVisible();
  await page.locator('#documentsAiInfoButton').click();
  await page.locator('#documentsAiRoutinesTitle').click();
  await expect(page.locator('.documents-ai-routine')).toBeVisible();
  await record(page,info,'ai-information',reports);
  await page.locator('#documentsAiInfoButton').click();
  await page.locator('#documentsAiExtractDocumentButton').click();
  await expect(page.locator('.documents-ai-result-card')).toHaveCount(3,{timeout:60_000});
  await record(page,info,'ai-results',reports);
  await page.locator('#documentsAiOrderFieldsButton').click();
  await expect(page.locator('#documentsAiFieldOrderPanel')).toBeVisible();
  await expect(page.locator('.documents-ai-order-row')).toHaveCount(17);
  await record(page,info,'ai-field-order',reports);
  await page.locator('#documentsAiFieldOrderDoneButton').click();
  await page.locator('#documentsAiChatTitle').click();
  await page.locator('#documentsAiChatQuestion').fill('Pergunta sintética sobre o documento fictício.');
  await page.locator('#documentsAiChatSendButton').click();
  await expect(page.locator('.documents-ai-chat-message')).toHaveCount(1);
  await record(page,info,'ai-chat',reports);
  await page.locator('#documentsAiCloseButton').click();

  await page.locator('#editorRailEditButton').click();
  await expect(page.locator('#documentsEditor')).toBeVisible();
  await expect(page.locator('#editorWriteButton')).toBeEnabled();
  await record(page,info,'editor-organizer',reports);
  const protectedStyles = await page.evaluate(()=>{
    const s=id=>{const el=document.getElementById(id),v=getComputedStyle(el);return {background:v.backgroundColor,image:v.backgroundImage,color:v.color,filter:v.filter,border:v.borderColor};};
    const states={}; const drive=document.getElementById('editorSyncButton'),before=drive.dataset.syncState;
    for(const state of ['normal','pending','syncing','success','failed']){drive.dataset.syncState=state;states[state]=getComputedStyle(drive).backgroundImage;}
    drive.dataset.syncState=before;
    return {write:s('editorWriteButton'),rail:s('documentNotepadButton'),zoom:s('pdfZoomInButton'),grid:s('editorOrganizeButton'),save:s('editorExportButton'),print:s('editorPrintButton'),drive:states};
  });
  expect(protectedStyles.write.background).toBe('rgba(0, 0, 0, 0)');
  expect(protectedStyles.write.color).toBe('rgb(245, 251, 255)');
  expect(protectedStyles.write.filter).toBe('brightness(0) invert(1)');
  expect(protectedStyles.rail.background).toBe('rgba(0, 0, 0, 0)');
  expect(protectedStyles.zoom.image).toContain('zoom-mais-dark.svg');
  expect(protectedStyles.grid.image).toContain('grade-dark.svg');
  expect(protectedStyles.save.image).toContain('salvar-pdf.svg');
  expect(protectedStyles.print.image).toContain('imprimir-normal.svg');
  for(const [state,asset] of Object.entries({normal:'Drive_normal.png',pending:'Drive_pendente.png',syncing:'Drive_sincronizando.png',success:'Drive_sincronizado_1seg.png',failed:'Drive_falha.png'}))expect(protectedStyles.drive[state]).toContain(asset);
  await info.attach('titon-7g6-preservation.json',{body:Buffer.from(JSON.stringify({scope:'computed styles of actual controls; Drive attribute states only, no sync action',...protectedStyles},null,2)),contentType:'application/json'});

  await page.locator('#editorMergeButton').click();
  await expect(page.locator('#editorMergePanel')).toBeVisible();
  await page.locator('#editorMergeLocalInput').setInputFiles({name:'PDF-FICTICIO-LOCAL.pdf',mimeType:'application/pdf',buffer:pdf});
  await expect(page.locator('.documents-editor-merge-preview-item')).toHaveCount(1);
  await record(page,info,'merge-local-preview',reports);
  await page.locator('#editorMergeCancelButton').click();
  await page.locator('#editorDrawButton').click();
  await expect(page.locator('#editorDrawToolbar')).toBeVisible();
  await record(page,info,'drawing-toolbar',reports);
  await page.locator('#editorWriteButton').click();
  const layer=page.locator('.portal-pdf-object-layer').first();
  await layer.scrollIntoViewIfNeeded();
  await layer.click({position:{x:110,y:125}});
  const text=page.locator('.portal-pdf-object-text').first();
  await expect(text).toHaveAttribute('contenteditable','true');
  await text.fill('TEXTO FICTÍCIO');
  await expect(page.locator('.portal-pdf-text-quickbar')).toBeVisible();
  await record(page,info,'text-object-toolbar',reports);
  await page.locator('.portal-pdf-text-quickbar-color').click();
  await expect(page.locator('.portal-pdf-text-palette')).toBeVisible();
  await page.locator('[data-text-palette-custom]').click();
  await expect(page.locator('.portal-pdf-custom-color-panel')).toBeVisible();
  await record(page,info,'text-custom-color',reports);

  await info.attach('network-coverage.json',{body:Buffer.from(JSON.stringify(network,null,2)),contentType:'application/json'});
  writeFileSync(info.outputPath('network-coverage.json'),JSON.stringify(network,null,2));
  writeFileSync(info.outputPath('documents-state-summary.json'),JSON.stringify(reports,null,2));
  await info.attach('documents-state-summary.json',{body:Buffer.from(JSON.stringify(reports,null,2)),contentType:'application/json'});
  expect(network.unexpected,'Every request must use a modeled synthetic fixture').toEqual([]);
  expect(network.errors,'Product JavaScript errors').toEqual([]);
  if(process.env.DARK_AUDIT_REPORT_ONLY!=='1')expect(reports.filter(r=>r.bright.length).map(r=>({name:r.name,findings:r.bright.map(f=>({selector:f.selector,background:f.background,pseudo:f.pseudo}))})),'Bright UI surfaces in real Documents states').toEqual([]);
});
