import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../../agenda/digsaude-agenda-sync.user.js', import.meta.url), 'utf8');
function diagnosticsTools() {
  const output = { textContent: '' };
  const context = { window: { location: new URL('https://example.test/unit/consultas'), setTimeout:resolve=>resolve() },
    document: { getElementById: () => output }, URL, Date, Map, Set };
  vm.runInNewContext(source.slice(0, source.indexOf('  function widget()')) + `
    function setButton() {}
    globalThis.tools = { readPatientPhone, phoneFromRoot, contactError, contactDiagnosticCode,
      safeContactDiagnostics, updateContactDiagnostics, finishContactDiagnostics, enrichSnapshotContacts,
      setKnown(ids) { updateKnownContactIds(ids); },
      overrideCollect(fn) { portalWindow = {closed:false,document:{},location:new URL('https://example.test/unit/consultas')};
        extractContact = record => {portalWindow.location=new URL(consultationUrl(record.sourceId));return fn(record);}; },
      report() { return contactDiagnostics; } };
  })();`, context);
  return { ...context.tools, output };
}
function field(value) {
  return { tagName: 'INPUT', value, getAttribute: key => key === 'name' ? 'telefone' : '' };
}
function patientFields(values) {
  const nodes = values.map(field);
  return { querySelectorAll: selector => selector.startsWith('input[') ? nodes : [] };
}

function delayedContactFlow({ readyAt = 9000, neverReady = false, filledValue, onBackoff } = {}) {
  let tick = 0;
  let navigations = 0;
  let clicked = false;
  let root;
  let location = new URL('https://example.test/unit/consultas/old/view');
  class Clock extends Date { static now() { return tick; } }
  const record = { sourceId:'synthetic-delayed', patient:'Paciente sintético', requestedAt:'2026-10-01', appointmentDate:'2999-01-01' };
  const makeRoot = () => {
    const action = { textContent:'Ver Dados do Paciente', getClientRects:()=>[{}], closest:()=>null,
      click() { clicked = true; } };
    const dialog = { getClientRects:()=>[{}], closest:()=>null, contains:()=>false,
      querySelectorAll:selector => selector.startsWith('h1,') ? [{textContent:'Dados do Paciente'}]
        : patientFields([filledValue ?? (!neverReady && tick >= readyAt ? '(11) 99000-0001' : '')]).querySelectorAll(selector) };
    return {readyState:'complete',querySelectorAll:selector => selector.startsWith('button,') ? [action]
      : selector.includes('dialog') && clicked ? [dialog] : []};
  };
  root = makeRoot();
  const frame = {closed:false,get document(){return root;},get location(){return location;},
    set location(value){navigations++;location=new URL(value);root=makeRoot();clicked=false;}};
  const context = {window:{location:new URL('https://example.test/unit/consultas'),setTimeout(resolve,ms){tick+=ms;
    if(ms===250)onBackoff?.({frame,record,replaceRoot:()=>{root=makeRoot();},changeRoute:()=>{location=new URL('https://example.test/unit/consultas/other/view');}});
    resolve();}},
    document:{getElementById:()=>null},URL,Date:Clock,Map,Set};
  vm.runInNewContext(source.slice(0,source.indexOf('  function widget()'))+`
    function setButton() {}
    portalWindow = globalThis.frame;
    globalThis.tools = {extractContact,enrichSnapshotContacts,report(){return contactDiagnostics;}};
  })();`,Object.assign(context,{frame}));
  return {...context.tools,record,navigations:()=>navigations,elapsed:()=>tick};
}

test('campo preenchido apenas apos 9s excede janela de 8s e uma leitura posterior recupera com novo Document', async () => {
  const flow = delayedContactFlow();
  await assert.rejects(flow.extractContact(flow.record), error => error.contactDiagnosticCode === 'field_unavailable');
  assert.ok(flow.elapsed() >= 8000 && flow.elapsed() < 8500);
  assert.equal(await flow.extractContact(flow.record), '5511990000001');
  assert.equal(flow.navigations(),2);
});

test('retry unico recupera inicializacao tardia, contabiliza tempo e navega novamente sem mudar normalizacao', async () => {
  const flow = delayedContactFlow();
  await flow.enrichSnapshotContacts({records:[flow.record],totalCount:1,complete:true});
  const report=flow.report();
  assert.equal(flow.record.phone,'5511990000001');
  assert.equal(flow.navigations(),2);
  assert.equal(report.readAttempts,2);
  assert.equal(report.retries,1);
  assert.equal(report.recovered,1);
  assert.equal(report.attemptFailures.field_unavailable,1);
  assert.equal(report.failures.field_unavailable,0);
  assert.ok(report.maxFailureMs.field_unavailable>=8000);
  assert.ok(report.elapsedMsTotal>=8000);
});

test('retry nao passa de duas leituras e nao repete formato invalido', async () => {
  const stuck=delayedContactFlow({neverReady:true});
  await stuck.enrichSnapshotContacts({records:[stuck.record],totalCount:1});
  assert.equal(stuck.navigations(),2);
  assert.equal(stuck.report().readAttempts,2);
  assert.equal(stuck.report().failures.field_unavailable,1);
  assert.equal(stuck.report().attemptFailures.field_unavailable,2);
  assert.equal(stuck.record.phone,'');
  const invalid=delayedContactFlow({filledValue:'incompatível'});
  await invalid.enrichSnapshotContacts({records:[invalid.record],totalCount:1});
  assert.equal(invalid.navigations(),1);
  assert.equal(invalid.report().retries,0);
  assert.equal(invalid.report().failures.normalization_rejected,1);
  assert.equal(invalid.record.phone,'');
});

test('retry cancela antes da segunda leitura se ficha, Document, rota ou janela mudar', async () => {
  for(const [onBackoff,code] of [
    [({record})=>{record.patient='Outro paciente sintético';},'record_changed'],
    [({replaceRoot})=>replaceRoot(),'document_changed'],
    [({changeRoute})=>changeRoute(),'route_changed'],
    [({frame})=>{frame.closed=true;},'cancelled']]) {
    const flow=delayedContactFlow({neverReady:true,onBackoff});
    await flow.enrichSnapshotContacts({records:[flow.record],totalCount:1});
    assert.equal(flow.navigations(),1);
    assert.equal(flow.report().retries,0);
    assert.equal(flow.report().failures[code],1);
    assert.equal(flow.record.phone,'');
  }
});

test('diagnostico distingue captura ausente, vazia, formato rejeitado e ambiguidade sem alterar telefone aceito', () => {
  const tools = diagnosticsTools();
  for (const [values, reason] of [[[], 'field_unreadable'], [[''], 'field_unavailable'],
    [['preenchido mas incompatível'], 'normalization_rejected'],
    [['(11) 99000-0001', '(21) 99000-0002'], 'ambiguous_phone']]) {
    assert.equal(tools.readPatientPhone(patientFields(values)).reason, reason);
    assert.equal(tools.phoneFromRoot(patientFields(values)), '');
  }
  assert.equal(tools.phoneFromRoot(patientFields(['(11) 99000-0001'])), '5511990000001');
});

test('extracao real classifica fase de falha observada sem inventar motivo para o cadastro', async () => {
  for (const [mode, expected] of [['navigation-failed', 'navigation_failed'], ['navigation', 'navigation_timeout'], ['menu', 'menu_unavailable'],
    ['dialog', 'dialog_timeout'], ['field', 'field_unreadable'], ['empty', 'field_unavailable'],
    ['invalid', 'normalization_rejected'], ['ambiguous', 'ambiguous_phone']]) {
    let tick = 0;
    class Clock extends Date { static now() { return tick; } }
    let clicked = false;
    const values = mode === 'field' ? [] : mode === 'empty' ? [''] : mode === 'ambiguous'
      ? ['(11) 99000-0001', '(21) 99000-0002'] : ['incompatível'];
    const phoneRoot = patientFields(values);
    const dialog = { getClientRects: () => [{}], closest: () => null, contains: () => false,
      querySelectorAll: selector => selector.startsWith('h1,') ? [{ textContent: 'Dados do Paciente' }] : phoneRoot.querySelectorAll(selector) };
    const action = { textContent: 'Ver Dados do Paciente', getClientRects: () => mode === 'menu' ? [] : [{}],
      closest: () => null, click() { clicked = true; } };
    const makeRoot = () => ({ readyState: 'complete', querySelectorAll: selector => selector.startsWith('button,')
      ? [action] : selector.includes('dialog') && clicked && mode !== 'dialog' ? [dialog] : [] });
    let root = makeRoot();
    let location = new URL('https://example.test/unit/consultas/old/view');
    const frame = { closed: false, get document() { return root; }, get location() { return location; },
      set location(value) { if (mode === 'navigation-failed') throw new Error('Synthetic navigation rejected');
        if (mode !== 'navigation') { location = new URL(value); root = makeRoot(); } } };
    const context = { window: { location: new URL('https://example.test/unit/consultas'),
      setTimeout(resolve, ms) { tick += ms; resolve(); } }, document: {}, URL, Date: Clock, Map, Set };
    vm.runInNewContext(source.slice(0, source.indexOf('  function widget()')) + `
      function setButton() {}
      globalThis.run = async frame => { portalWindow = frame;
        return extractContact({ sourceId:'synthetic-test', patient:'Paciente sintético', requestedAt:'2026-10-01' }); };
    })();`, context);
    await assert.rejects(context.run(frame), error => error.contactDiagnosticCode === expected, mode);
  }
});

test('diagnostico permite somente chaves e codigos fixos, nunca copia dados ou mensagens de erro', () => {
  const tools = diagnosticsTools();
  const report = tools.updateContactDiagnostics({ snapshotRows: 4, patient: 'SYNTHETIC_PRIVATE_NAME',
    sourceId: 'SYNTHETIC_PRIVATE_ID', phone: '5511990000001', attempted: '5511990000001',
    failures: { normalization_rejected: 2, SYNTHETIC_PRIVATE_ID: 1 }, persistence: 'SYNTHETIC_PRIVATE_NAME' });
  assert.equal(report.attempted, 0);
  assert.equal(report.failures.normalization_rejected, 2);
  for (const value of ['SYNTHETIC_PRIVATE_NAME', 'SYNTHETIC_PRIVATE_ID', '5511990000001']) {
    assert.equal(JSON.stringify(report).includes(value), false);
    assert.equal(tools.output.textContent.includes(value), false);
  }
  assert.equal(tools.contactDiagnosticCode(new Error('SYNTHETIC_PRIVATE_NAME')), 'unexpected_failure');
  assert.equal(tools.contactDiagnosticCode({ contactDiagnosticCode: 'SYNTHETIC_PRIVATE_ID' }), 'unexpected_failure');
});

test('diagnostico preserva 19 ja conhecidos e separa 3 passados de 8 tentativas sinteticas', async () => {
  const tools = diagnosticsTools();
  const known = Array.from({ length: 19 }, (_, index) => ({ sourceId: 'known-' + index, patient: 'Teste conhecido', appointmentDate: '2999-01-01' }));
  const past = Array.from({ length: 3 }, (_, index) => ({ sourceId: 'past-' + index, appointmentDate: '2000-01-01' }));
  const pending = Array.from({ length: 8 }, (_, index) => ({ sourceId: 'pending-' + index, appointmentDate: '2999-01-01' }));
  const before = JSON.stringify(known);
  const called = [];
  tools.setKnown(known.map(record => record.sourceId));
  tools.overrideCollect(async record => { called.push(record.sourceId); throw tools.contactError('dialog_timeout', 'SYNTHETIC_PRIVATE_NAME'); });
  await tools.enrichSnapshotContacts({ records: [...known, ...past, ...pending], totalCount: 30, complete: true });
  const report = tools.report();
  assert.equal(JSON.stringify(known), before);
  assert.deepEqual(called, pending.flatMap(record => [record.sourceId,record.sourceId]));
  assert.equal(report.alreadyKnown, 19);
  assert.equal(report.pastUncollected, 3);
  assert.equal(report.attempted, 8);
  assert.equal(report.failures.dialog_timeout, 8);
  assert.equal(JSON.stringify(report).includes('pending-'), false);
});

test('diagnostico agrega codigos tecnicos distintos e trata escrita sem confirmacao como indeterminada', async () => {
  const tools = diagnosticsTools();
  const codes = ['navigation_failed', 'navigation_timeout', 'menu_unavailable', 'menu_timeout', 'dialog_timeout',
    'field_unreadable', 'field_unavailable', 'normalization_rejected', 'ambiguous_phone',
    'route_changed', 'document_changed', 'action_changed', 'cancelled'];
  const records = codes.map((code, index) => ({ sourceId: 'test-' + index, appointmentDate: '2999-01-01', code }));
  tools.overrideCollect(async record => { throw tools.contactError(record.code, 'SYNTHETIC_PRIVATE_NAME'); });
  await tools.enrichSnapshotContacts({ records, totalCount: records.length });
  for (const code of codes) assert.equal(tools.report().failures[code], 1);
  tools.updateContactDiagnostics({ collected: 2, persistence: 'pending' });
  const report = tools.finishContactDiagnostics({ records: [] }, { ok: false });
  assert.equal(report.persistence, 'unconfirmed');
  assert.equal(report.persistenceUnconfirmed, 2);
  assert.equal(report.outsideSnapshotMissing, null);
});

test('ACK confirma persistencia separadamente da captura e calcula ausentes fora do snapshot sem classificar causa antiga', () => {
  const tools = diagnosticsTools();
  const records = [{ sourceId: 'test-a', phone: '5511990000001', contactVersion: 'patient-details-v2' },
    { sourceId: 'test-b', phone: '' }];
  tools.updateContactDiagnostics({ collected: 1, attempted: 2 });
  const report = tools.finishContactDiagnostics({ records }, { ok: true, received: 2,
    contactsAvailable: 1, contactsMissing: 3, knownSourceIds: ['test-a'] });
  assert.equal(report.persisted, 1);
  assert.equal(report.persistenceUnconfirmed, 0);
  assert.equal(report.outsideSnapshotMissing, 2);
  assert.equal(report.unclassifiedMirrorMissing, 0);
  assert.equal(report.failures.field_unavailable, 0);
  const legacy = tools.finishContactDiagnostics({ records }, { ok: true,
    contactsAvailable: 1, contactsMissing: 3, knownSourceIds: ['test-a'] });
  assert.equal(legacy.outsideSnapshotMissing, null);
  assert.equal(legacy.unclassifiedMirrorMissing, 3);
});

test('contato capturado mas nao presente no estado pos-escrita continua sem confirmacao de persistencia', () => {
  const tools = diagnosticsTools();
  const records = [{ sourceId: 'test-a', phone: '5511990000001', contactVersion: 'patient-details-v2' }];
  tools.updateContactDiagnostics({ collected: 1 });
  const report = tools.finishContactDiagnostics({ records }, { ok: true, received: 1,
    contactsAvailable: 0, contactsMissing: 1, knownSourceIds: [] });
  assert.equal(report.persisted, 0);
  assert.equal(report.persistenceUnconfirmed, 1);
  assert.equal(report.failures.normalization_rejected, 0);
});

test('ponte acrescenta somente contagem recebida ao ACK e mantem recusa por capacidade ausente', async () => {
  const bridgeSource = fs.readFileSync(new URL('../../js/agenda-sync-bridge.js', import.meta.url), 'utf8');
  for (const capability of ['patient-details-v2', undefined]) {
    const replies = [];
    let receive;
    let posts = 0;
    const opener = { closed:false, postMessage:message => replies.push(message) };
    const context = { Date, document:{getElementById:()=>({textContent:'',hidden:true})},
      window:{opener, addEventListener:(_name,fn)=>{receive=fn;}, RegulationAuth:{requireRole:async()=>({role:'admin'}),
        api:async route => route.endsWith('/sync') ? (posts++, {contactCapability:capability,received:2})
          : {contactCapability:capability,known:1,missing:1,knownSourceIds:['synthetic-a']} }} };
    await vm.runInNewContext(bridgeSource,context);
    await receive({origin:'https://teleatendimento.saude.ms.gov.br',source:opener,
      data:{type:'PORTAL_AGENDA_DIGSAUDE_SYNC',syncId:'synthetic-sync',snapshot:{records:[]}}});
    if (capability) { assert.equal(posts,1); assert.equal(replies.at(-1).received,2); assert.equal(replies.at(-1).ok,true); }
    else { assert.equal(posts,0); assert.equal(replies.at(-1).ok,false); }
  }
});
