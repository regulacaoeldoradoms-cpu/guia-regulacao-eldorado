import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function read(path) {
  return fs.readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
}

function contactTools(windowOverrides = {}, clock = Date, candidate = false) {
  let source = read('agenda/digsaude-agenda-sync.user.js');
  if (candidate) source = navigationCandidateSource(source);
  const window = { location: new URL('https://example.test/unidade/consultas'), ...windowOverrides };
  const context = { window, URL, Date: clock, document: {}, Map, Set };
  vm.runInNewContext(source.slice(0, source.indexOf('  function widget()')) + `
    function setButton() {}
    globalThis.tools = { normalizePhone, phoneCandidate, phoneFromNode, phoneFromRoot,
      readPatientPhone, contactCoverage, fingerprint, patientDetailsRoot, navigateContactWindow, extractContact, enrichSnapshotContacts,
      report() { return contactDiagnostics; }, setKnown(ids) { updateKnownContactIds(ids); },
      setWindow(value) { portalWindow = value; } };
  })();`, context);
  return context.tools;
}

function backendContactTools(existing = []) {
  const writes = [];
  const context = {
    Date, TextEncoder, crypto: globalThis.crypto,
    firestoreList: async () => ({ documents: existing }),
    firestoreCommit: async (_env, batch) => { writes.push(...batch); }
  };
  const source = read('worker/agenda.js').replace(/import[\s\S]*?from\s+'[^']+';/g, '').replace(/export /g, '');
  vm.runInNewContext(source + '\nglobalThis.tools = { normalizeBrazilPhone, normalizeRecord, publicRecord, contactState, syncRecords, contactForSync };', context);
  return { ...context.tools, writes };
}

function reminderTools() {
  const source = read('js/agenda.js');
  const context = { formatDate: (value) => value };
  vm.runInNewContext(source.slice(source.indexOf('  function normalizedPatientPhone('), source.indexOf('  async function markRead('))
    + '\nglobalThis.tools = { normalizedPatientPhone, patientWhatsappUrl };', context);
  return context.tools;
}

function phoneInput(value, attributes = {}) {
  return { tagName: 'INPUT', value, textContent: '', getAttribute: (key) => ({ name: 'data.telefonecel', ...attributes })[key] || null };
}
function patientDialog(inputs = [], labels = []) {
  return {
    getClientRects: () => [{}], closest: () => null,
    querySelectorAll(selector) {
      if (selector.startsWith('h1,')) return [{ textContent: 'Dados do Paciente' }];
      if (selector.startsWith('label,')) return labels;
      if (selector.includes('telefonecel')) return inputs;
      return [];
    },
    contains: (node) => inputs.includes(node)
  };
}

function syntheticConsultationFlow({ candidate = false, pollDelayMs = 0, phone = '(11) 99000-0001', dialogDelay = 0, menuClosed = false, menuAmbiguous = false, menuTriggerAmbiguous = false, menuNeverOpens = false, onMenu, onAction, onPoll } = {}) {
  const fixture = read('worker/tests/fixtures/agenda-patient-dialog.html');
  const fieldId = fixture.match(/<input class="fi-input" id="([^"]+)"/)[1];
  let tick = Date.now();
  class FlowClock extends Date { static now() { return tick; } }
  let location = new URL('https://example.test/unidade/consultas');
  let root = { readyState: 'complete' };
  let clicked = false;
  let polls = 0;
  let navigations = 0;
  let menuOpen = !menuClosed;
  let menuClicks = 0;
  let actionClicks = 0;
  let otherClicks = 0;
  let tools;
  const dialogFor = (value) => {
    const values = Array.isArray(value) ? value : [value];
    const inner = patientDialog(values.map((item) => phoneInput(item, { name: '', id: fieldId })));
    const outer = { ...patientDialog(), querySelectorAll: inner.querySelectorAll, contains: (node) => node === inner };
    return [outer, inner];
  };
  const makeRoot = (value) => {
    const dropdown = { getClientRects: () => [{}], closest: () => null, contains: (node) => node === action,
      querySelectorAll: () => menuTriggerAmbiguous ? [trigger, { ...trigger }] : [trigger] };
    const panel = { closest: () => dropdown };
    const trigger = { textContent: 'Ações', disabled: false, getClientRects: () => [{}], closest: (selector) => selector === '.fi-dropdown' ? dropdown : null,
      click() { menuClicks++; if (!menuNeverOpens) menuOpen = true;
        onMenu?.({ frame, tools, action, replaceDocument: () => { root = makeRoot(value); } }); } };
    const otherAction = { textContent: 'Responder Critérios', getClientRects: () => [{}], click() { otherClicks++; } };
    const action = { textContent: 'Ver Dados do Paciente', getClientRects: () => menuOpen ? [{}] : [],
      closest: (selector) => selector === '.fi-dropdown-panel' ? panel : selector === '.fi-dropdown' ? dropdown : null,
      click() {
      actionClicks++;
      clicked = true;
      onAction?.({ frame, tools, replaceDocument: (otherPhone) => { root = makeRoot(otherPhone); } });
    } };
    return { readyState: 'complete', querySelectorAll(selector) {
    if (selector.startsWith('button,')) return menuAmbiguous ? [trigger, otherAction, action, { ...action }] : [trigger, otherAction, action];
    if (selector.includes('dialog')) return clicked && polls >= dialogDelay ? dialogFor(value) : [];
    return [];
  } };
  };
  const frame = { closed: false, get document() { return root; }, get location() { return location; }, set location(value) {
    navigations++; location = new URL(value); clicked = false; menuOpen = !menuClosed; polls = 0; root = makeRoot(phone);
  } };
  tools = contactTools({ setTimeout(resolve, ms) {
    tick += pollDelayMs || ms; polls++; onPoll?.({ frame, tools, polls }); resolve();
  } }, FlowClock, candidate);
  tools.setWindow(frame);
  return { tools, frame, setPhone(value) { phone = value; }, navigations: () => navigations, polls: () => polls,
    menuClicks: () => menuClicks, actionClicks: () => actionClicks, otherClicks: () => otherClicks };
}

const canonical = '5567990000001';
const base = {sourceId:'synthetic-a',patient:'Paciente sintético A',requestedAt:'2026-10-01',specialty:'Psicólogo',appointmentDate:'2999-10-15',appointmentTime:'07:30'};
for (const [label,value] of [['space','67 99000-0001'],['parentheses','(67) 99000-0001'],['plain','67990000001'],['international','+55 67 99000-0001'],['NBSP','67\u00a099000-0001'],['narrow NBSP','67\u202f99000-0001'],['tabs','67\t99000-0001'],['leading zero','067 99000-0001']]) {
 test('synthetic Brazilian format: '+label,()=>{
  assert.equal(contactTools().normalizePhone(value),canonical);
  assert.equal(backendContactTools().normalizeBrazilPhone(value),canonical);
  assert.equal(reminderTools().normalizedPatientPhone(canonical),canonical);
 });
}
test('Unicode hyphen and zero-width separator currently reject valid digit structure',()=>{
 for(const value of ['67 99000\u20110001','67\u200b99000-0001']){
  assert.equal(value.replace(/\D/g,''),'67990000001');
  assert.equal(contactTools().normalizePhone(value),'');
  assert.equal(backendContactTools().normalizeBrazilPhone(value),'');
 }
});
for(const attribute of ['data.telefonecel','mountedActionsData.0.telefonecel','data.telefone','data.celular','data.telefone_celular','data.telefonePaciente']){
 test('DOM attribute coverage: '+attribute,()=>{
  const node=phoneInput('67 99000-0001',{name:attribute});
  const reading=contactTools().readPatientPhone(patientDialog([node]));
  assert.equal(reading.phone,['data.telefonePaciente'].includes(attribute)?'':canonical);
 });
}
for(const text of ['Telefone','Telefone:','Telefone celular','Celular','Telefone celular:*','WhatsApp']){
 test('DOM label coverage: '+text,()=>{
  const node=phoneInput('67 99000-0001',{name:'generic'});
  const wrapper={querySelectorAll:()=>[node]};
  const label={textContent:text,getAttribute:()=>null,closest:()=>wrapper};
  const reading=contactTools().readPatientPhone(patientDialog([], [label]));
  assert.equal(reading.phone,['Telefone celular:*','WhatsApp'].includes(text)?'':canonical);
 });
}
test('valid associated target works; dangling for bypasses valid wrapper',()=>{
 const node=phoneInput('67 99000-0001',{name:'generic'});
 const label={textContent:'Telefone',getAttribute:()=> 'synthetic-field',closest:()=>({querySelectorAll:()=>[node]})};
 for(const resolved of [node,null]){
  const root=patientDialog([], [label]); root.contains=value=>value===node;
  root.ownerDocument={getElementById:()=>resolved};
  assert.equal(contactTools().readPatientPhone(root).phone,resolved?canonical:'');
 }
});
test('same specialty and appointment do not deduplicate contacts',async()=>{
 const flow=syntheticConsultationFlow({phone:'67 99000-0001',menuClosed:true});
 const records=[{...base},{...base,sourceId:'synthetic-b',patient:'Paciente sintético B'}];
 await flow.tools.enrichSnapshotContacts({records,totalCount:2,complete:true});
 assert.ok(records.every(r=>r.phone===canonical)); assert.equal(flow.navigations(),2);
 assert.equal(flow.tools.report().collected,2);
});
test('known ID skip can delay changed identity by one cycle; Worker revokes safely',async()=>{
 const flow=syntheticConsultationFlow({phone:'67 99000-0001'});
 const backend=backendContactTools();
 const saved=backend.normalizeRecord({...base,phone:canonical,contactVersion:'patient-details-v2',contactSourceId:base.sourceId});
 const changed={...base,patient:'Paciente sintético B'};
 flow.tools.setKnown([base.sourceId]);
 await flow.tools.enrichSnapshotContacts({records:[changed],totalCount:1});
 assert.equal(flow.navigations(),0);
 assert.equal(backend.contactForSync(backend.normalizeRecord(changed),saved).phone,'');
 flow.tools.setKnown([]);
 await flow.tools.enrichSnapshotContacts({records:[changed],totalCount:1});
 assert.equal(changed.phone,canonical);
});
test('menu readiness failure with correct phone does not get single retry',async()=>{
 const flow=syntheticConsultationFlow({phone:'67 99000-0001',menuClosed:true,menuNeverOpens:true});
 await flow.tools.enrichSnapshotContacts({records:[{...base}],totalCount:1});
 assert.equal(flow.tools.report().failures.menu_timeout,1);
 assert.equal(flow.tools.report().retries,0); assert.equal(flow.menuClicks(),1);
});
test('menu plus dialog share 8s budget: delayed dialog fails even with correct phone',async()=>{
 const flow=syntheticConsultationFlow({phone:'67 99000-0001',dialogDelay:50,menuClosed:true});
 await flow.tools.enrichSnapshotContacts({records:[{...base}],totalCount:1});
 assert.equal(flow.tools.report().failures.dialog_timeout,1);
 assert.equal(flow.tools.report().retries,1); assert.equal(flow.navigations(),2);
});
test('missing contact updates bypass same fingerprint and coverage uses IDs not snapshot phone',()=>{
 const tools=contactTools(); const a={...base}, b={...base,phone:canonical,contactVersion:'patient-details-v2',contactSourceId:base.sourceId};
 assert.equal(tools.fingerprint({records:[a]}),tools.fingerprint({records:[b]}));
 assert.equal(tools.contactCoverage({records:[b]}).missing,1);
 tools.setKnown([base.sourceId]); assert.equal(tools.contactCoverage({records:[a]}).available,1);
 const source=read('agenda/digsaude-agenda-sync.user.js');
 assert.match(source,/const hasContactUpdates = contactResult.requested > 0/);
 assert.match(source,/nextFingerprint === lastFingerprint && !hasContactUpdates/);
});

function navigationCandidateSource(source) {
 const navigation=source.slice(source.indexOf('  async function navigateContactWindow('),source.indexOf('  async function extractContact('));
 if (navigation.includes('while (true)')) return source;
 return source.replace('while (Date.now() - startedAt < CONTACT_WINDOW_TIMEOUT_MS) {','while (true) {')
 .replace('      await new Promise((resolve) => window.setTimeout(resolve, 160));','      if (Date.now() - startedAt >= CONTACT_WINDOW_TIMEOUT_MS) break;\n      await new Promise((resolve) => window.setTimeout(resolve, 160));');
}
function navigationPollingFlow({candidate=false,mode='ready',late=false}={}) {
 const original=read('agenda/digsaude-agenda-sync.user.js');
 let source=original;
 if(candidate) source=navigationCandidateSource(source);
 else source=source.replace('while (true) {','while (Date.now() - startedAt < CONTACT_WINDOW_TIMEOUT_MS) {')
  .replace('      if (Date.now() - startedAt >= CONTACT_WINDOW_TIMEOUT_MS) break;\n','');
 let tick=0,polls=0;class Clock extends Date{static now(){return tick;}}
 const prior={readyState:'complete'},next={readyState:'loading'};
 let root=prior,location=new URL('https://example.test/unit/consultas/old/view');
 const frame={closed:false,get document(){if(mode==='inaccessible')throw Error('synthetic cross-origin');return root;},get location(){return location;},set location(value){location=new URL(value);}};
 const context={window:{location:new URL('https://example.test/unit/consultas'),setTimeout(resolve){polls++;tick+=late?160:60014;
  if(mode!=='same-document') root=next;
  if(mode==='ready'||mode==='wrong-path'||mode==='wrong-origin'||mode==='closed')next.readyState='complete';
  if(late&&polls===1)next.readyState='loading';
  if(mode==='wrong-path')location=new URL('https://example.test/unit/consultas/other/view');
  if(mode==='wrong-origin')location=new URL('https://elsewhere.test/unit/consultas/synthetic-a/view');
  if(mode==='closed')frame.closed=true;
  if(mode==='generation-changed')context.cancelGeneration();
  if(mode==='window-replaced')context.replaceWindow();
  resolve();}},document:{},URL,Date:Clock,Map,Set};
 vm.runInNewContext(source.slice(0,source.indexOf('  function widget()'))+`
  portalWindow=globalThis.frame;
  globalThis.navigate=()=>navigateContactWindow(consultationUrl('synthetic-a'));
  globalThis.cancelGeneration=()=>{sessionGeneration+=1;};
  globalThis.replaceWindow=()=>{portalWindow={closed:false};};
 })();`,Object.assign(context,{frame}));
 return {run:context.navigate,elapsed:()=>tick,polls:()=>polls,next};
}
test('legacy navigation defect: delayed poll reports navigation_timeout although exact fresh Document is ready',async()=>{
 const flow=navigationPollingFlow();
 await assert.rejects(flow.run(),e=>e.contactDiagnosticCode==='navigation_timeout');
 assert.equal(flow.elapsed(),60014);assert.equal(flow.next.readyState,'complete');assert.equal(flow.polls(),1);
});
test('candidate evaluates guarded navigation readiness on wake before rejecting elapsed deadline',async()=>{
 const flow=navigationPollingFlow({candidate:true});
 const result=await flow.run();assert.equal(result.root,flow.next);assert.equal(flow.elapsed(),60014);
});
for(const mode of ['same-document','loading','wrong-path','wrong-origin','inaccessible','closed','generation-changed','window-replaced']){
 test('candidate stays closed after throttled poll: '+mode,async()=>{
  const flow=navigationPollingFlow({candidate:true,mode});
  await assert.rejects(flow.run(),e=>e.contactDiagnosticCode===(['closed','generation-changed','window-replaced'].includes(mode)?'cancelled':'navigation_timeout'));
  assert.equal(flow.elapsed(),60014);
 });
}
test('candidate tolerates normal 160ms polling with loading then ready Document',async()=>{
 const flow=navigationPollingFlow({candidate:true,late:true});
 assert.equal((await flow.run()).root,flow.next);assert.equal(flow.elapsed(),320);
});

test('navigation-only candidate still times out on ready menu after a delayed detail poll',async()=>{
 const flow=syntheticConsultationFlow({candidate:true,phone:'67 99000-0001',menuClosed:true,pollDelayMs:60014});
 await flow.tools.enrichSnapshotContacts({records:[{...base}],totalCount:1});
 assert.equal(flow.tools.report().failures.menu_timeout,1);
 assert.equal(flow.menuClicks(),1);assert.equal(flow.actionClicks(),0);assert.equal(flow.tools.report().retries,0);
});
test('navigation-only candidate still times out on ready dialog after a delayed detail poll',async()=>{
 const flow=syntheticConsultationFlow({candidate:true,phone:'67 99000-0001',pollDelayMs:60014});
 await flow.tools.enrichSnapshotContacts({records:[{...base}],totalCount:1});
 assert.equal(flow.tools.report().failures.dialog_timeout,1);
 assert.equal(flow.actionClicks(),2);assert.equal(flow.tools.report().retries,1);assert.equal(flow.tools.report().collected,0);
});
test('navigation-only candidate does not change two-phone ambiguity after normal readiness',async()=>{
 const flow=syntheticConsultationFlow({candidate:true,phone:['67 99000-0001','67 99000-0002']});
 await flow.tools.enrichSnapshotContacts({records:[{...base}],totalCount:1});
 assert.equal(flow.tools.report().failures.ambiguous_phone,1);assert.equal(flow.tools.report().collected,0);
});

test('shipped navigation checks current guarded readiness before elapsed deadline and exposes 1.2.8',()=>{
 const source=read('agenda/digsaude-agenda-sync.user.js');
 const navigation=source.slice(source.indexOf('  async function navigateContactWindow('),source.indexOf('  async function extractContact('));
 assert.match(navigation,/while \(true\)/);
 assert.ok(navigation.indexOf('return { root, frameWindow: contactWindow }') < navigation.indexOf('if (Date.now() - startedAt >= CONTACT_WINDOW_TIMEOUT_MS) break;'));
 assert.match(source,/@version      1\.2\.8/);
 assert.match(source,/@updateURL.*20261009-navigation-1/);
 assert.match(source,/@downloadURL.*20261009-navigation-1/);
 assert.match(read('agenda/index.html'),/digsaude-agenda-sync\.user\.js\?v=20261009-navigation-1/);
});
