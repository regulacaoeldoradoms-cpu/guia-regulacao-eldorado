import { test, expect } from '@playwright/test';
import { auditUser, installAuditFixture } from './dark-audit-fixture.mjs';
import { inspectSurfaces } from './dark-audit-surfaces.mjs';
import { compareAgainstBase } from './dark-audit-base-comparison.mjs';
import { writeFileSync } from 'node:fs';

const protocol='AUDITORIA-SINTETICA-001';
const detailPath=`/api/council/manifestations/${protocol}`;
const manifestation={protocol,type:'elogio',status:'recebida',privacyMode:'sigilosa',subject:'Registro fictício para auditoria visual',description:'Texto de teste sintético. Não descreve atendimento nem pessoa real.',service:'Unidade fictícia de teste',createdAt:'2026-09-24T12:00:00Z',updatedAt:'2026-09-24T12:00:00Z'};
const detail={manifestation,messages:[{senderType:'citizen',body:'Mensagem sintética do cidadão.',createdAt:'2026-09-24T12:00:00Z'},{senderType:'council',body:'Resposta sintética do Conselho.',createdAt:'2026-09-24T12:01:00Z'}],events:[{type:'created',detail:'Registro exclusivamente sintético.',createdAt:'2026-09-24T12:00:00Z'},{type:'status_changed',fromStatus:'recebida',toStatus:'em_analise',createdAt:'2026-09-24T12:01:00Z',actorLabel:'Conta fictícia'}],internalNotes:[{body:'Observação sintética para auditar a superfície.',authorLabel:'Conta fictícia',createdAt:'2026-09-24T12:01:00Z'}],attachments:[{id:'synthetic-file',displayName:'anexo-sintetico.pdf'}]};
const syntheticPdf={name:'anexo-sintetico.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% Synthetic attachment for visual validation only.\n%%EOF\n')};

async function setup(context,{citizen=false,theme='dark',empty=false}={}){
  const user={...auditUser,role:citizen?'cidadao':'admin',councilRole:citizen?null:'presidente',interfaceTheme:theme};
  const responses={
    '/api/auth/me':{user},'/api/auth/security':{security:{user,email:'audit@example.invalid',emailVerified:true,privacyMode:'sigilosa'}},
    '/api/council/my':{manifestations:empty?[]:[manifestation]},'/api/council/all':{manifestations:empty?[]:[manifestation]},
    '/api/council/notifications':{notifications:empty?[]:[{id:1,title:'Notificação sintética',protocol,createdAt:'2026-09-24T12:00:00Z',readAt:null}]},
    [detailPath]:detail,
    [`${detailPath}/messages`]:{status:422,body:{error:'Erro sintético da auditoria; nenhum envio real.'}},
    [`${detailPath}/attachments`]:{status:422,body:{error:'Anexo sintético recusado pela fixture.'}},
    [`${detailPath}/internal-notes`]:{status:422,body:{error:'Nota sintética recusada pela fixture.'}},
    '/api/council/manifestations':{status:422,body:{error:'Envio sintético bloqueado para validar o estado de erro.'}}
  };
  // authenticated:false prevents the shared init script from overwriting our explicit role fixture.
  const network=await installAuditFixture(context,{theme,authenticated:false,responses});
  await context.addInitScript(user=>{
    sessionStorage.setItem('regulacao.portal.session','synthetic-audit-token-no-backend');
    sessionStorage.setItem('regulacao.portal.user',JSON.stringify(user));
    sessionStorage.setItem('regulacao.portal.user.validatedAt',String(Date.now()));
  },user);
  return {network,responses};
}
async function capture(page,info,name){
  await page.waitForTimeout(220);
  const report=await inspectSurfaces(page);
  const file=info.outputPath(`${name}.json`);
  writeFileSync(file,JSON.stringify(report,null,2));
  await info.attach(`${name}.json`,{path:file,contentType:'application/json'});
  await page.screenshot({path:info.outputPath(`${name}.png`),fullPage:true,animations:'disabled',caret:'hide'});
  expect.soft(report.bright.map(({selector,pseudo,background})=>({selector,pseudo,background})),`${name}: confirmed UI state must contain no accidental bright surface; see attached CSS evidence`).toEqual([]);
  return report;
}
async function finishNetwork(info,network,{council=false}={}){
  await info.attach('network-coverage.json',{body:Buffer.from(JSON.stringify(network,null,2)),contentType:'application/json'});
  expect(network.unexpected).toEqual([]);
  // Verified unchanged on origin/main by the light/print comparison below.
  // The legacy Council script assigns Auth.me after Auth has been frozen.
  const inheritedCouncilError="Cannot assign to read only property 'me' of object '#<Object>'";
  expect(network.errors.filter(message=>!(council&&message===inheritedCouncilError))).toEqual([]);
}
async function openDetail(page,citizen){
  await page.locator(citizen?'#manifestationList [data-protocol]':'#councilRows [data-protocol]').first().click();
  await expect(page.locator('#detailContent')).toBeVisible();
  await expect(page.locator('#detailSubject')).toHaveText(manifestation.subject);
}
async function holdApi(context,path){
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pattern=url=>url.pathname===path;
  const handler=async route=>{await gate;await route.fallback();};
  await context.route(pattern,handler);
  return {release,dispose:()=>context.unroute(pattern,handler)};
}
async function openDetailWithLoading(page,context,info,citizen){
  const held=await holdApi(context,detailPath);
  try{
    await page.locator(citizen?'#manifestationList [data-protocol]':'#councilRows [data-protocol]').first().click();
    await expect(page.locator('#detailLoading')).toContainText('Carregando');
    await capture(page,info,`${citizen?'citizen':'council'}-detail-loading`);
  }finally{held.release();}
  await expect(page.locator('#detailSubject')).toHaveText(manifestation.subject);
  await expect(page.locator('#detailContent')).toBeVisible();
  await held.dispose();
}

test('Cidadão: tipos, privacidade, campos, anexo e erro sintéticos',async({page,context},info)=>{
  test.setTimeout(90_000);
  const {network}=await setup(context,{citizen:true});
  await page.goto('/cidadao/');
  await expect(page.locator('#openNewManifestation')).toBeVisible();
  await capture(page,info,'citizen-dashboard');
  await page.locator('#openNewManifestation').click();
  await expect(page.locator('#newManifestationModal')).toHaveClass(/open/);
  for(const type of ['sugestao','reclamacao','elogio','denuncia']){
    await page.locator(`.manifestation-type-card:has(input[value="${type}"])`).click();
    await capture(page,info,`new-${type}`);
  }
  await page.locator('#manifestationSubject').fill('Assunto fictício para a auditoria');
  await page.locator('#manifestationDescription').fill('Descrição totalmente sintética para testar a aparência do formulário.');
  await page.locator('#manifestationService').fill('Unidade fictícia');
  await page.locator('#manifestationPriorContact').selectOption('nao_se_aplica');
  await page.locator('#manifestationFiles').setInputFiles(syntheticPdf);
  await expect(page.locator('#manifestationFileList')).toContainText(syntheticPdf.name);
  for(const privacy of ['identificada','sigilosa']){
    await page.locator(`.privacy-option:has(input[value="${privacy}"])`).click();
    await page.locator('[data-help="privacy"]').click();
    await capture(page,info,`privacy-${privacy}`);
    await page.locator('[data-help="privacy"]').click();
  }
  for(const help of ['warning','channel']){
    await page.locator(`[data-help="${help}"]`).click();
    await capture(page,info,`help-${help}`);
    await page.locator(`[data-help="${help}"]`).click();
  }
  await page.locator('#manifestationConfirm').check();
  const submission=await holdApi(context,'/api/council/manifestations');
  try{
    await page.locator('#submitManifestation').click();
    await expect(page.locator('#submitManifestation')).toBeDisabled();
    await capture(page,info,'new-submit-disabled');
  }finally{submission.release();}
  await expect(page.locator('#newManifestationStatus')).toContainText('Envio sintético bloqueado');
  await submission.dispose();
  await capture(page,info,'new-submit-error');
  await page.locator('#newManifestationModal [data-close-modal]').first().click();
  await finishNetwork(info,network);
});

test('Cidadão: detalhe, conversa, timeline, anexo e resposta',async({page,context},info)=>{
  test.setTimeout(90_000);
  const {network,responses}=await setup(context,{citizen:true});
  await page.goto('/cidadao/');
  await openDetailWithLoading(page,context,info,true);
  await capture(page,info,'citizen-detail');
  await page.locator('#replyText').fill('Mensagem fictícia usada apenas nesta fixture.');
  await page.locator('#replyText').focus();
  await capture(page,info,'citizen-reply-focus');
  await page.locator('#replyButton').click();
  await expect(page.locator('#replyStatus')).toContainText('Erro sintético');
  await capture(page,info,'citizen-reply-error');
  await page.locator('#attachmentFile').setInputFiles(syntheticPdf);
  await capture(page,info,'citizen-attachment-selected');
  await page.locator('#manifestationDetailModal [data-close-modal]').click();
  responses[detailPath]={...detail,messages:[],events:[],attachments:[]};
  await openDetail(page,true);
  await expect(page.locator('#messageThread')).toContainText('Ainda não há mensagens');
  await capture(page,info,'citizen-detail-empty');
  await page.locator('#manifestationDetailModal [data-close-modal]').click();
  responses[detailPath]={status:503,body:{error:'Falha sintética de carregamento do detalhe.'}};
  await page.locator('#manifestationList [data-protocol]').click();
  await expect(page.locator('#detailLoading')).toContainText('Falha sintética');
  await capture(page,info,'citizen-detail-error');
  await finishNetwork(info,network);
});

test('Conselho: detalhe, status, nota, carta e exclusão cancelada',async({page,context},info)=>{
  test.setTimeout(90_000);
  const {network,responses}=await setup(context);
  await page.goto('/conselho/painel/');
  await expect(page.locator('#councilRows [data-protocol]')).toHaveCount(1);
  await capture(page,info,'council-dashboard');
  await page.locator('#councilType').selectOption('denuncia');
  await capture(page,info,'council-filter-empty');
  await page.locator('#councilType').selectOption('elogio');
  await openDetailWithLoading(page,context,info,false);
  await capture(page,info,'council-detail');
  await page.locator('#officialReply').fill('Resposta institucional inteiramente sintética.');
  await page.locator('#officialReply').focus();
  await capture(page,info,'council-reply-focus');
  await page.locator('#officialReplyButton').click();
  await expect(page.locator('#officialReplyStatus')).toContainText('Erro sintético');
  await page.locator('#statusSelect').selectOption('encaminhada');
  await page.locator('#statusDetail').fill('Observação sintética do andamento.');
  await page.locator('#internalNoteText').fill('Nota interna totalmente sintética.');
  await page.locator('#internalNoteForm button[type="submit"]').click();
  await expect(page.locator('#internalNoteStatus')).toContainText('Nota sintética recusada');
  responses[detailPath]={status:422,body:{error:'Andamento sintético recusado pela fixture.'}};
  await page.locator('#saveStatus').click();
  await expect(page.locator('#statusUpdateMessage')).toContainText('Andamento sintético recusado');
  responses[detailPath]=detail;
  await capture(page,info,'council-form-error-status');
  await page.locator('#exportManifestationPdf').click();
  await expect(page.locator('#praiseRecipientDialog')).toHaveClass(/open/);
  await page.locator('#praiseRecipientName').fill('Equipe fictícia de auditoria');
  await page.locator('#praiseRecipientRole').fill('Função fictícia');
  await capture(page,info,'council-praise-dialog');
  await page.locator('#cancelPraiseRecipient').click();
  await page.locator('#councilDetailModal [data-close-modal]').click();
  await page.locator('.council-row-delete').click();
  await expect(page.locator('#councilDeleteDialog')).toBeVisible();
  await capture(page,info,'council-delete-dialog');
  await page.locator('#councilDeleteCancel').click();
  responses[detailPath]={...detail,messages:[],events:[],attachments:[],internalNotes:[]};
  await openDetail(page,false);
  await capture(page,info,'council-detail-empty');
  await page.locator('#councilDetailModal [data-close-modal]').click();
  responses[detailPath]={status:503,body:{error:'Falha sintética ao carregar manifestação.'}};
  await page.locator('#councilRows [data-protocol]').click();
  await expect(page.locator('#detailLoading')).toContainText('Falha sintética');
  await capture(page,info,'council-detail-error');
  await finishNetwork(info,network,{council:true});
});

for(const citizen of [true,false])test(`${citizen?'Cidadão':'Conselho'}: light e impressão preservados contra main`,async({page,context},info)=>{
  test.setTimeout(90_000);
  const {network}=await setup(context,{citizen,theme:'light'});
  const route=citizen?'/cidadao/':'/conselho/painel/';
  for(const [theme,media]of [['light','screen'],['dark','print']]){
    const result=await compareAgainstBase({page,context,info,route,theme,media,prepare:async page=>{
      await openDetail(page,citizen);
      await page.evaluate(()=>document.fonts.ready);
      await page.mouse.move(0,0);
    }});
    expect(result.differences,`${theme}/${media} computed styles must remain identical to main`).toEqual([]);
    expect(result.pixelComparison.accepted,`${theme}/${media}: screenshots must match within the documented absolute raster bound (at most two pixels, one channel level)`).toBe(true);
    expect(result.newErrors).toEqual([]);
  }
  await finishNetwork(info,network,{council:!citizen});
});
