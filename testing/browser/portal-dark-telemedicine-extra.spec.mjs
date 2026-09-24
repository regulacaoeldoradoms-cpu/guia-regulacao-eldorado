import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { installAuditFixture, auditPatient, auditFollowup } from './dark-audit-fixture.mjs';
import { inspectSurfaces } from './dark-audit-surfaces.mjs';

test.use({ trace: 'off' });

test('Telemedicina complementar: cadastro, programação, filtro nativo, alta real e histórico vazio/erro', async ({ page, context, isMobile }, info) => {
  test.setTimeout(120_000);
  const unscheduled = { ...auditFollowup, status:'SEM PROGRAMAÇÃO', returnDueDate:'', reminderDates:[], alertToday:false, reminderNumber:0, needsReview:true };
  const dashboard = { today:'2026-09-24', actor:{ admin:true }, patients:[auditPatient], followups:[unscheduled], counts:{semProgramacao:1} };
  const responses = {
    '/api/telemedicina/dashboard':dashboard,
    [`/api/telemedicina/patients/${auditPatient.id}`]:{patient:auditPatient,followups:[],events:[]}
  };
  const network = await installAuditFixture(context, { responses });
  const submissions = [];
  await context.route('**/api/telemedicina/consultations', async route => {
    const request=route.request();
    expect(request.method()).toBe('POST');
    const body=request.postDataJSON();
    submissions.push(body);
    expect(body.followupMode).toBe('discharge');
    expect(body.discharged).toBe(true);
    const completed={...unscheduled,status:'CONCLUÍDO',discharged:true,active:false,needsReview:false,resolution:'ALTA FICTÍCIA DO EPISÓDIO'};
    dashboard.followups=[completed];
    dashboard.counts={concluido:1};
    network.calls.push({method:'POST',path:'/api/telemedicina/consultations',host:new URL(request.url()).hostname,action:'fulfilled-locally'});
    await route.fulfill({contentType:'application/json',body:JSON.stringify({patientId:auditPatient.id,followup:completed})});
  });
  const reports=[];
  const record=async(name,{delay=180}={})=>{
    if(delay)await page.waitForTimeout(delay);
    const report=await inspectSurfaces(page);
    reports.push({name,bright:report.bright,contrast:report.contrast});
    await writeFile(info.outputPath(`${name}.json`),JSON.stringify(report,null,2));
    await info.attach(`${name}.json`,{body:Buffer.from(JSON.stringify(report)),contentType:'application/json'});
    await page.screenshot({path:info.outputPath(`${name}.png`),fullPage:true,animations:'disabled'});
  };
  const open=async()=>{
    await page.goto('/telemedicina/');
    await expect(page.locator('[data-followup-row]')).toHaveCount(1);
    await expect(page.locator('.telemedicine-inline-edit')).toHaveCount(2);
  };
  await open();

  // The current admin/developer markup is a display:none span, not an accessible
  // import trigger. Do not force-click it or manufacture the modal's open state.
  await expect(page.locator('#openImport')).toBeHidden();
  await expect(page.locator('#importModal')).toHaveAttribute('aria-hidden','true');
  const inaccessibleImport=await page.locator('#openImport').evaluate(el=>({tag:el.tagName,ariaHidden:el.getAttribute('aria-hidden'),display:getComputedStyle(el).display,inline:el.getAttribute('style')}));

  for(const kind of ['patient','specialty']) {
    await page.locator(`[data-telemedicine-edit="${kind}"]`).click();
    await expect(page.locator('#telemedicineEditModal')).toHaveAttribute('aria-hidden','false');
    await page.locator('#telemedicineEditValue').fill('AB');
    await page.locator('#telemedicineEditSave').click();
    await expect(page.locator('#telemedicineEditStatus')).toContainText('Informe um valor completo');
    await record(`edit-${kind}-validation`);
    await page.locator('[data-telemedicine-edit-close]').last().click();
  }

  await page.locator('[data-action="schedule"]').click();
  const scheduleForm=page.locator(isMobile?'.tm-inline-schedule-form':'#scheduleForm');
  await expect(scheduleForm).toBeVisible();
  await record('schedule-empty');
  await scheduleForm.locator('input[type="date"]').fill('2026-10-05');
  await expect(scheduleForm.locator(isMobile?'.tm-inline-preview':'#schedulePreview')).toContainText('2026');
  await record('schedule-preview');
  await open();

  const filter=page.locator('#statusFilter');
  await filter.focus();
  await record('status-select-focus');
  const options=await filter.locator('option').evaluateAll(els=>els.map(el=>({value:el.value,text:el.textContent,color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor})));
  // SelectOption uses the native control. The OS/browser popup lies outside the
  // page's CSS scanner and is not claimed as pixel-verified by these screenshots.
  for(let index=0;index<options.length;index++) {
    await filter.selectOption(options[index].value);
    await expect(filter).toHaveValue(options[index].value);
    await record(`status-option-${index}`);
  }
  await filter.selectOption('');

  await page.locator('#openConsultation').click();
  const consultation=page.locator(isMobile?'.tm-inline-consult-form':'#consultationForm');
  await expect(consultation).toBeVisible();
  await consultation.locator(isMobile?'[name="patientName"]':'#consultPatient').fill(auditPatient.name);
  await consultation.locator(isMobile?'[name="consultationDate"]':'#consultDate').fill('2026-09-24');
  await consultation.locator(isMobile?'[name="specialty"]':'#consultSpecialty').fill('Cardiologia');
  const discharge=consultation.locator('input[type="radio"][value="discharge"]');
  await discharge.locator('..').click();
  await expect(discharge).toBeChecked();
  // The celebration must originate in the real UI change handler, never a
  // dispatched test event or synthetic class toggle.
  await expect(page.locator('#dischargeCelebration')).toHaveClass(/active/);
  // V23 deliberately keeps confetti/fireworks hidden even when the genuine
  // handler activates the layer (docs/TELEMEDICINA-SEM-ANIMACOES-V23.md).
  await expect(page.locator('#dischargeCelebration')).toHaveCSS('display','none');
  const celebration=await page.locator('#dischargeCelebration').evaluate(el=>({active:el.classList.contains('active'),display:getComputedStyle(el).display,visibility:getComputedStyle(el).visibility,pieces:el.querySelectorAll('.telemedicine-confetti').length,fireworks:el.querySelectorAll('.telemedicine-firework').length,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,visualEffectVisible:el.getClientRects().length>0}));
  await record('discharge-ui-celebration',{delay:0});
  await consultation.locator('button[type="submit"]').click();
  await expect.poll(()=>submissions.length).toBe(1);
  if(isMobile) {
    await expect(consultation.locator('.tm-inline-status')).toContainText('salva');
    await page.locator('[data-tm-consult-close]').click();
  } else await expect(page.locator('#consultationModal')).toHaveAttribute('aria-hidden','true');
  // Existing V30 tries to replace frozen auth.api and cannot convert the saved
  // active:false response for mobile upsert. Reload the real dashboard to audit
  // the persisted synthetic Altas state; immediate mobile upsert is not claimed.
  await open();
  await expect(page.locator('[data-followup-row][data-achievement="discharge"]')).toHaveCount(1);
  await page.locator('#dischargeQueue').click();
  await expect(filter).toHaveValue('CONCLUÍDO');
  await expect(page.locator('.telemedicine-status')).toHaveText('ALTA');
  await record('discharge-list');
  await page.locator('[data-telemedicine-view="grid"]').click();
  await record('discharge-card');
  // V29 explicitly preserves the gold card, crown and dark lettering. Surrounding
  // editor/history UI remains subject to the strict scan (no descendant exemption).
  const goldCard=page.locator('.telemedicine-row.is-discharge-achievement');
  await expect(goldCard).toHaveCSS('background-color','rgb(255, 242, 184)');
  await expect(goldCard.locator(':scope > .telemedicine-patient')).toHaveCSS('background-color','rgb(255, 248, 215)');
  await expect(goldCard.locator(':scope > .telemedicine-specialty-block')).toHaveCSS('background-color','rgb(255, 248, 215)');
  await expect(goldCard.locator(':scope > .telemedicine-date-block')).toHaveCSS('background-color','rgb(255, 244, 198)');
  await expect(goldCard.locator('.telemedicine-patient > [data-action="patient"]')).toHaveCSS('color','rgb(102, 68, 0)');
  await expect(goldCard.locator(':scope > .telemedicine-date-block > strong')).toHaveCSS('color','rgb(109, 73, 0)');
  await expect(goldCard.locator(':scope > .telemedicine-date-block > strong')).toHaveCSS('background-color',isMobile?'rgba(0, 0, 0, 0)':'rgba(255, 255, 255, 0.44)');

  await open();
  await page.locator('[data-action="patient"]').first().click();
  await expect(page.getByText('Nenhum evento histórico encontrado.')).toBeVisible();
  await expect(goldCard).toHaveCSS('background-color','rgb(255, 242, 184)');
  await expect(goldCard).toHaveCSS('background-image','none');
  await record('history-empty');
  responses[`/api/telemedicina/patients/${auditPatient.id}`]={status:503,body:{error:'ERRO FICTÍCIO DE HISTÓRICO',code:'SYNTHETIC_HISTORY_ERROR'}};
  await open();
  await page.locator('[data-action="patient"]').first().click();
  await expect(page.getByText('ERRO FICTÍCIO DE HISTÓRICO')).toBeVisible();
  await expect(goldCard).toHaveCSS('background-color','rgb(255, 242, 184)');
  await expect(goldCard).toHaveCSS('background-image','none');
  await record('history-error');

  // Known origin/main 1157e280 limitation; auth-client.js and altas-v30.js are
  // unchanged from that commit: V30 assigns frozen RegulationAuth.api.
  // Retain all errors in network evidence and fail any different error message.
  const knownBaselineError="Cannot assign to read only property 'api' of object '#<Object>'";
  const coverage={inaccessibleImport:{...inaccessibleImport,reason:'Production markup has no visible/keyboard-operable import trigger; modal not forced or claimed tested.'},nativeStatusSelect:{options,nativePopupPixelsVerified:false},celebration,submissions,baselineLimitation:{error:knownBaselineError,knownErrors:network.errors.filter(error=>error===knownBaselineError),afterSaveReload:true,immediateMobileUpsertValidated:false},states:reports.map(r=>r.name)};
  await writeFile(info.outputPath('telemedicine-extra-coverage.json'),JSON.stringify(coverage,null,2));
  await writeFile(info.outputPath('telemedicine-extra-summary.json'),JSON.stringify(reports,null,2));
  await writeFile(info.outputPath('network-coverage.json'),JSON.stringify(network,null,2));
  await info.attach('network-coverage.json',{body:Buffer.from(JSON.stringify(network)),contentType:'application/json'});
  expect(network.unexpected).toEqual([]);
  expect(network.errors.filter(error=>error!==knownBaselineError)).toEqual([]);
  expect(network.calls.some(call=>/import/.test(call.path))).toBe(false);
  if(process.env.DARK_AUDIT_REPORT_ONLY!=='1')expect(reports.filter(r=>r.bright.length).map(r=>({name:r.name,bright:r.bright.map(({selector,pseudo,background})=>({selector,pseudo,background}))}))).toEqual([]);
});
