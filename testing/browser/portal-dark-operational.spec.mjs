import {test,expect} from '@playwright/test';
import {installAuditFixture,auditPatient,auditFollowup} from './dark-audit-fixture.mjs';
import {inspectSurfaces} from './dark-audit-surfaces.mjs';
import {compareAgainstBase} from './dark-audit-base-comparison.mjs';
import {finishAuditNetwork} from './dark-audit-network.mjs';
import {prepareReceptionChecklist} from './dark-audit-reception-state.mjs';
import {writeFile} from 'node:fs/promises';
// Per-state JSON and screenshots are the evidence. Avoid recording the whole
// large protocol catalogue repeatedly in a trace during its UI traversal.
test.use({trace:'off'});

function recorder(page,info) {
  const findings=[];
  return {async take(name){
    await page.waitForTimeout(220);
    const report=await inspectSurfaces(page);
    findings.push(...report.bright.map(item=>({state:name,...item})));
    await writeFile(info.outputPath(`${name}.json`),JSON.stringify(report,null,2));
    await info.attach(`${name}.json`,{body:Buffer.from(JSON.stringify(report)),contentType:'application/json'});
    await page.screenshot({path:info.outputPath(`${name}.png`),fullPage:true,animations:'disabled'});
  }, finish(){expect([...new Set(findings.map(({state,selector,pseudo,background})=>JSON.stringify({state,selector,pseudo,background})))]).toEqual([]);}};
}
async function settle(page,route){await page.goto(route);await page.waitForTimeout(650);}
async function openPreRegulation(page,isMobile){
  // On the existing mobile layout the fixed launcher can fall outside the
  // visual viewport. The protocol's visible action opens the same dialog.
  const button=page.locator(isMobile?'[data-ai-prefill]':'#aiLauncher').first();
  if(isMobile){await button.focus();await button.press('Enter');}
  else await button.click();
  await expect(page.locator('#aiChat')).toBeVisible();
}

test('Telemedicina: formulário, desfechos, histórico, edição, exclusão cancelada e estados de controles',async({page,context,isMobile},info)=>{
  test.setTimeout(120000);
  const network=await installAuditFixture(context,{responses:{
    '/api/telemedicina/patients/audit-patient':{patient:auditPatient,followups:[auditFollowup],events:[
      {id:'event-audit',type:'consultation',specialty:'Cardiologia',consultationDate:'2026-09-01',createdAt:'2026-09-01T12:00:00Z',resolution:'REGISTRO FICTÍCIO DE INTERFACE',notes:'NOTA FICTÍCIA',returnDueDate:'2026-10-01'},
      {id:'event-audit-2',type:'requested',specialty:'Cardiologia',createdAt:'2026-09-16T12:00:00Z',resolution:'EVENTO FICTÍCIO'}
    ]}
  }});
  const r=recorder(page,info);
  await settle(page,'/telemedicina/');await expect(page.locator('.telemedicine-row')).toHaveCount(1);
  const specialty=page.locator('.telemedicine-row:not(.is-discharge-achievement) .telemedicine-specialty-block strong').first();
  await expect(specialty).toHaveCSS('color','rgb(229, 238, 245)');
  await page.locator('button[data-telemedicine-view="grid"]').click();await r.take('grid');
  await expect(specialty).toHaveCSS('color','rgb(229, 238, 245)');
  await page.locator('button[data-telemedicine-view="list"]').click();
  await page.locator('#openConsultation').click();
  const form=page.locator(isMobile?'.tm-inline-consult-form':'#consultationForm');
  await expect(form).toBeVisible();await r.take('consultation');
  const outcomes=form.locator('input[type=radio]');
  for(let i=0;i<await outcomes.count();i++){
    await outcomes.nth(i).locator('..').click();
    await expect(outcomes.nth(i)).toBeChecked();await r.take(`outcome-${i}`);
  }
  const target=form.locator('textarea:visible').first();
  if(await target.count()){await target.focus();await r.take('focus-textarea');}
  await settle(page,'/telemedicina/');
  await page.locator('[data-action="patient"]').first().click();await r.take('history');
  await settle(page,'/telemedicina/');
  const requested=page.locator('[data-action="requested"]').first();
  if(isMobile){
    // origin/main 1157e280 has five nowrap actions: the neighbouring label
    // intercepts this button's centre. Audit its panel through real keyboard
    // activation; this does not claim the pre-existing touch overlap is fixed.
    await expect(requested).toBeVisible();await requested.focus();await requested.press('Enter');
  }else await requested.click();
  await expect(page.locator(isMobile?'.tm-inline-requested-form':'#requestedModal')).toBeVisible();await r.take('requested');
  await settle(page,'/telemedicina/');
  await page.locator('[data-action="change-outcome"]').first().click();await r.take('change-outcome');
  await settle(page,'/telemedicina/');
  await page.locator('.telemedicine-delete-button').first().click();await r.take('delete-confirmation');
  await page.locator('[data-tm-delete-cancel]').first().click();
  await page.locator('#telemedicineSearch').fill('SEM RESULTADO FICTÍCIO');await r.take('empty');
  await page.locator('#telemedicineSearch').fill('');
  const button=page.locator('#openConsultation');
  await button.focus();await r.take('focus');
  if(!isMobile){await button.hover();await r.take('hover');await page.mouse.down();await r.take('active');await page.mouse.up();}
  await button.evaluate(el=>el.disabled=true);await r.take('disabled');
  // telemedicina-altas-v30.js already tries to replace frozen RegulationAuth.api
  // in origin/main 1157e280. Keep the exact legacy error and fail all others.
  const knownBaselineError="Cannot assign to read only property 'api' of object '#<Object>'";
  const coverage={...network,baselineLimitations:{baseCommit:'1157e28020a90461de0dd0fdb6939f0e9881dfa6',requestedActivation:isMobile?'keyboard: existing five-action mobile overlap':'pointer',knownPageError:knownBaselineError}};
  await writeFile(info.outputPath('network-coverage.json'),JSON.stringify(coverage,null,2));
  await info.attach('network-coverage.json',{body:Buffer.from(JSON.stringify(coverage)),contentType:'application/json'});
  expect(network.unexpected).toEqual([]);expect(network.errors.filter(error=>error!==knownBaselineError)).toEqual([]);r.finish();
});

test('Guia Médico e Recepção: conteúdo dinâmico, pré-regulação, formulário e impressão',async({page,context,isMobile},info)=>{
  test.setTimeout(180000);const network=await installAuditFixture(context);
  const r=recorder(page,info);
  await settle(page,'/medico/');await expect(page.locator('.protocol-card').first()).toBeVisible();
  // Discover every protocol rendered by the repository, grouping equal DOM anatomy.
  const anatomy=new Set();
  const cards=page.locator('.protocol-card');
  for(let i=0;i<await cards.count();i++){
    // Keyboard activation avoids repeatedly traversing the long mobile list's
    // existing smooth scroll; native button events still drive the real UI.
    if(isMobile){await cards.nth(i).focus();await cards.nth(i).press('Enter');}
    else await cards.nth(i).click();
    await expect(cards.nth(i)).toHaveClass(/active/);
    const signature=await page.locator('#detailPanel').evaluate(el=>[...new Set([...el.querySelectorAll('*')].map(n=>n.tagName+'.'+n.className))].sort().join('|'));
    if(!anatomy.has(signature)){anatomy.add(signature);await r.take(`protocol-anatomy-${anatomy.size}`);}
  }
  expect(anatomy.size).toBeGreaterThan(0);
  await openPreRegulation(page,isMobile);await r.take('pre-regulation-dialog');
  await page.locator('#aiInput').focus();await r.take('pre-regulation-focus');
  if(isMobile){await page.locator('#aiClose').focus();await page.locator('#aiClose').press('Enter');}
  else await page.locator('#aiClose').click();
  await settle(page,'/recepcao/');
  await page.locator('#receptionProtocolList button').first().click();await r.take('reception-checklist');
  // The current reception UI replaces its hidden native select with a real
  // checklist. Exercise the visible control rather than forcing a hidden input.
  const checks=page.locator('input[type="checkbox"]:visible');
  if(await checks.count()){
    await checks.first().locator('..').click();await expect(checks.first()).toBeChecked();await r.take('reception-checked');
    await checks.first().locator('..').click();await expect(checks.first()).not.toBeChecked();await r.take('reception-unchecked');
  }
  const select=page.locator('.reception-status:visible').first();
  if(await select.count()){
    const options=await select.locator('option').evaluateAll(els=>els.map(el=>el.value));
    for(const option of options){await select.selectOption(option);await r.take(`reception-${option||'default'}`);}
  }
  await page.locator('#receptionSearch').fill('SEM RESULTADO FICTÍCIO');await r.take('reception-empty');
  await finishAuditNetwork(info,network,{route:'/medico/'});r.finish();
});

test('Agenda: capacidade, busca, filtros, vazio e erro sintético',async({page,context},info)=>{
  const network=await installAuditFixture(context);const r=recorder(page,info);
  await settle(page,'/agenda/');await expect(page.locator('.agenda-card')).toHaveCount(3);
  await r.take('agenda-capacity');
  const search=page.locator('input[type="search"]').first();
  await search.fill('FICTÍCIO');await r.take('agenda-matches');
  await search.fill('SEM RESULTADO');await r.take('agenda-empty');
  await context.route('**/api/agenda*',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'ERRO FICTÍCIO PARA TESTE'})}));
  await settle(page,'/agenda/');await r.take('agenda-error');
  await finishAuditNetwork(info,network,{route:'/agenda/'});r.finish();
});

for(const route of ['/telemedicina/','/medico/','/recepcao/','/agenda/'])for(const [theme,media] of [['light','screen'],['dark','print']]){
  test(`operational preserve ${theme} ${media} ${route}`,async({page,context,isMobile},info)=>{
    test.setTimeout(90000);const network=await installAuditFixture(context,{theme});
    const prepare=async p=>{
      if(route==='/telemedicina/')await p.locator('#openConsultation').click();
      if(route==='/medico/')await openPreRegulation(p,isMobile);
      if(route==='/recepcao/')await prepareReceptionChecklist(p,info);
    };
    const comparison=await compareAgainstBase({page,context,info,route,theme,media,prepare});
    expect(network.unexpected).toEqual([]);expect(comparison.newErrors).toEqual([]);
    expect(comparison.differences).toEqual([]);expect(comparison.pixelComparison.withinTolerance).toBe(true);
  });
}
