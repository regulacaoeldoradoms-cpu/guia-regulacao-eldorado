import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import './agenda-contact-diagnostics.cases.mjs';

function read(path) {
  return fs.readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
}

function toolsCatalog() {
  const window = {
    RegulationAuth: { hasCouncilAccess() { return false; } }
  };
  vm.runInNewContext(read('js/tools-catalog.js'), { window });
  return window.PortalTools;
}

test('Agenda aparece somente para Telemedicina e Desenvolvedor', () => {
  const tools = toolsCatalog();
  const ids = (user) => tools.cardsFor({ emailVerified: true, ...user }).map((card) => card.id);

  assert.ok(ids({ role: 'telemedicina' }).includes('agenda'));
  assert.ok(ids({ role: 'admin' }).includes('agenda'));
  assert.ok(!ids({ role: 'recepcao' }).includes('agenda'));
  assert.ok(!ids({ role: 'medico' }).includes('agenda'));
  assert.ok(!ids({ role: 'coordenacao' }).includes('agenda'));
  assert.ok(!ids({ role: 'cidadao' }).includes('agenda'));
});

test('Agenda e Central de Documentos usam os ícones próprios do catálogo', () => {
  const tools = toolsCatalog();
  const cards = tools.cardsFor({
    role: 'admin',
    emailVerified: true,
    documentCapabilities: { view: true, manage: true }
  });
  const agenda = cards.find((card) => card.id === 'agenda');
  const documents = cards.find((card) => card.id === 'central-documents');

  assert.match(agenda?.icon || '', /\/assets\/AGENDA\.png\?v=20260923-1/);
  assert.match(documents?.icon || '', /\/assets\/CENTRAL_DOCUMENTOS\.png\?v=20260923-1/);
});

test('backend da Agenda exige sessão e capacidade Telemedicina', () => {
  const source = read('worker/agenda.js');
  assert.match(source, /validatePortalSession/);
  assert.match(source, /telemedicineAccessFor/);
  assert.match(source, /Acesso exclusivo da Telemedicina ou do Desenvolvedor/);
  assert.match(source, /Cache-Control': 'no-store'/);
  assert.match(source, /\/api\/agenda\/sync/);
  assert.match(source, /\/api\/agenda\/contact-state/);
  assert.match(source, /\/api\/agenda\/read/);
  assert.doesNotMatch(source, /console\.(log|info|warn|error)/);
});

test('Agenda não carrega observabilidade em uma tela que contém nomes de pacientes', () => {
  const html = read('agenda/index.html');
  assert.match(html, /Agenda DigSaúde/);
  assert.match(html, /js\/agenda\.js\?v=20261005-contact-2/);
  assert.doesNotMatch(html, /portal-observability|posthog|umami/i);
  assert.doesNotMatch(html, /portal-performance\.js/);
});

test('sincronizador lê Agendados e consulta somente o contato necessário na sessão autenticada do DigSaúde', () => {
  const source = read('agenda/digsaude-agenda-sync.user.js');
  assert.match(source, /fi-ta-row/);
  assert.match(source, /\.table\.records\./);
  assert.match(source, /Agendados/);
  assert.match(source, /consultationUrl/);
  assert.match(source, /ver dados do paciente/);
  assert.match(source, /telefonecel/);
  assert.match(source, /function phoneCandidate/);
  assert.doesNotMatch(source, /source\.split|source\.matchAll/);
  assert.match(source, /normalizeSearch\(node\.textContent\)/);
  assert.match(source, /phoneFieldWrapper/);
  assert.match(source, /knownContactIds/);
  assert.match(source, /window\.open\(/);
  assert.match(source, /portal-agenda-contact-bridge/);
  assert.match(source, /navigateContactWindow/);
  assert.match(source, /patientAction\(root\)/);
  assert.match(source, /action\.click\(\)/);
  assert.doesNotMatch(source, /document\.createElement\('iframe'\)/);
  assert.match(source, /CONTACT_CONCURRENCY = 1/);
  assert.doesNotMatch(source, /\/livewire\/update|csrf-token/);
  assert.match(source, /contactCache = new Map\(\)/);
  assert.match(source, /postMessage/);
  assert.doesNotMatch(source, /document\.cookie|localStorage|sessionStorage|Authorization|Bearer/);
});

test('ponte aceita mensagens somente da origem oficial do DigSaúde', () => {
  const source = read('js/agenda-sync-bridge.js');
  assert.match(source, /https:\/\/teleatendimento\.saude\.ms\.gov\.br/);
  assert.match(source, /event\.origin !== DIGSAUDE_ORIGIN/);
  assert.match(source, /event\.source !== window\.opener/);
  assert.match(source, /RegulationAuth/);
  assert.match(source, /loadContactState/);
  assert.match(source, /knownSourceIds/);
});


test('sincronização da Agenda usa leitura única e commits em lote para não estourar subrequests', () => {
  const source = read('worker/agenda.js');
  const block = source.slice(
    source.indexOf('async function syncRecords'),
    source.indexOf('async function markRead')
  );
  assert.match(source, /firestoreCommit/);
  assert.match(block, /existingRecords = await listAll\(env\)/);
  assert.match(block, /await commitWrites\(env, writes\)/);
  assert.doesNotMatch(block, /firestoreGet\(/);
  assert.doesNotMatch(block, /firestoreCreate\(/);
  assert.doesNotMatch(block, /firestorePatch\(/);

  const gateway = read('worker/firebase-gateway.js');
  assert.match(gateway, /export async function firestoreCommit/);
  assert.match(gateway, /documents:commit/);
  assert.match(gateway, /500 gravações por commit/);
});


test('sincronizador automático consulta Agendados em segundo plano a cada 15 minutos', () => {
  const source = read('agenda/digsaude-agenda-sync.user.js');
  assert.match(source, /@version\s+1\.2\.7/);
  assert.match(source, /AUTO_INTERVAL_MS = 15 \* 60 \* 1000/);
  assert.match(source, /fetch\(agendadosUrl\(\)/);
  assert.match(source, /credentials: 'include'/);
  assert.match(source, /cache: 'no-store'/);
  assert.match(source, /new DOMParser\(\)/);
  assert.match(source, /Ativar sincronização automática/);
  assert.match(source, /@updateURL\s+https:\/\/regulacaoeldoradoms\.com\.br\/agenda\/digsaude-agenda-sync\.user\.js/);
  assert.doesNotMatch(source, /document\.cookie|localStorage|sessionStorage|Authorization|Bearer|csrf-token/);
  assert.match(source, /window\.open\(\s*BRIDGE_URL/);
  assert.match(source, /waitForBridgeReady/);
  assert.match(source, /portalWindow\.location = BRIDGE_URL/);
  assert.match(source, /updateKnownContactIds/);
  assert.match(source, /!knownContactIds\.has\(record\.sourceId\)/);
});

test('sincronizador confirma cobertura persistida, ignora passados e não repete contatos já salvos', () => {
  const source = read('agenda/digsaude-agenda-sync.user.js');
  const bridge = read('js/agenda-sync-bridge.js');
  const backend = read('worker/agenda.js');

  assert.match(source, /knownContactIds = new Set\(\)/);
  assert.match(source, /function contactEligible/);
  assert.match(source, /appointmentDate/);
  assert.match(source, /!knownContactIds\.has\(record\.sourceId\)/);
  assert.match(source, /contato\(s\) úteis disponíveis/);
  assert.match(source, /hasContactUpdates/);
  assert.match(bridge, /\/api\/agenda\/contact-state/);
  assert.match(bridge, /knownSourceIds/);
  assert.match(backend, /function contactState/);
  assert.match(backend, /phoneReceived/);
});

test('Agenda usa contato protegido para abrir lembrete diretamente no WhatsApp do paciente', () => {
  const frontend = read('js/agenda.js');
  const backend = read('worker/agenda.js');
  const css = read('css/agenda.css');

  assert.match(backend, /normalizeBrazilPhone/);
  assert.match(backend, /phone:\s*verifiedContactPhone\(record\)/);
  assert.match(backend, /contactForSync\(record, existing\)/);
  assert.match(frontend, /Avisar por WhatsApp/);
  assert.match(frontend, /Data já passou/);
  assert.match(frontend, /function isPastAppointment/);
  assert.match(frontend, /Este é um lembrete da sua consulta agendada:/);
  assert.match(frontend, /Data:/);
  assert.match(frontend, /Horário:/);
  assert.match(frontend, /Especialidade:/);
  assert.match(frontend, /Médico Psiquiatra/);
  assert.match(frontend, /https:\/\/wa\.me\//);
  assert.doesNotMatch(frontend, /Abrir no DigSaúde|DIGSAUDE_BASE/);
  assert.match(css, /agenda-whatsapp-patient-button/);
});

test('ponte da Agenda permanece aberta e aceita sincronizações repetidas com deduplicação', () => {
  const source = read('js/agenda-sync-bridge.js');
  assert.match(source, /lastSyncId/);
  assert.match(source, /syncId === lastSyncId/);
  assert.match(source, /Sincronização automática conectada/);
  assert.doesNotMatch(source, /window\.close\(/);
  assert.doesNotMatch(source, /completed\s*=\s*true/);
});

test('backend aceita snapshot completo vazio sem aceitar vazio ambíguo', () => {
  const source = read('worker/agenda.js');
  assert.match(source, /verifiedEmptySnapshot/);
  assert.match(source, /declaredComplete && expectedTotal === 0 && rows\.length === 0/);
  assert.match(source, /!rows\.length && !verifiedEmptySnapshot/);
});


test('sincronizador automático usa chip compacto no canto inferior esquerdo após ativação', () => {
  const source = read('agenda/digsaude-agenda-sync.user.js');
  assert.match(source, /WIDGET_ID = 'portal-agenda-sync-widget'/);
  assert.match(source, /'left:18px'/);
  assert.match(source, /'bottom:18px'/);
  assert.match(source, /compactMode \? '⟳' : 'Ativar sync'/);
  assert.match(source, /showDetails/);
  assert.match(source, /mouseenter/);
  assert.match(source, /Verificar agora/);
  assert.doesNotMatch(source, /'right:22px'/);
});


test('visualização da Agenda permanece na lista e recebe borda de visualizado', () => {
  const source = read('js/agenda.js');
  const html = read('agenda/index.html');
  const css = read('css/agenda.css');

  assert.match(source, /scope: 'all'/);
  assert.match(source, /justRead: new Set\(\)/);
  assert.match(source, /record\.unread \? 'is-unread' : \(record\.active \? 'is-read' : ''\)/);
  assert.match(source, /state\.justRead\.add\(record\.sourceId\)/);
  assert.match(source, /record\.active && \(record\.unread \|\| state\.justRead\.has\(record\.sourceId\)\)/);
  assert.match(html, /class="agenda-stat is-active" type="button" data-agenda-scope="all"/);
  assert.match(css, /\.agenda-card\.is-read/);
  assert.match(css, /border-color: #79b7a0/);
});

test('memória de visualização é persistida fora do documento sincronizado', () => {
  const source = read('worker/agenda.js');
  const syncBlock = source.slice(
    source.indexOf('async function syncRecords'),
    source.indexOf('async function migrateEmbeddedReadMemory')
  );
  const markBlock = source.slice(
    source.indexOf('async function markRead'),
    source.indexOf('export function isAgendaApi')
  );

  assert.match(source, /READ_STATE_COLLECTION = 'telemedicine_digsaude_agenda_read_state'/);
  assert.match(source, /readReceiptCollection/);
  assert.match(source, /listReadMemory/);
  assert.match(source, /migrateEmbeddedReadMemory/);
  assert.match(source, /effectiveReadAt/);
  assert.match(markBlock, /firestoreCommit/);
  assert.match(markBlock, /readAt: now/);
  assert.doesNotMatch(markBlock, /readBy:/);
  assert.doesNotMatch(syncBlock, /READ_STATE_COLLECTION/);
});


test('Agenda acompanha somente itens ainda presentes em Agendados por padrão', () => {
  const frontend = read('js/agenda.js');
  const backend = read('worker/agenda.js');
  const html = read('agenda/index.html');

  assert.match(frontend, /if \(!record\.active && !els\.includeInactive\.checked\) return false/);
  assert.match(backend, /if \(complete\) \{/);
  assert.match(backend, /active: false/);
  assert.match(backend, /removedAt: now/);
  assert.match(html, /Mostrar removidos da aba Agendados/);
});


test('Agenda permite ordenar agendamentos do mais próximo ao mais distante e vice-versa', () => {
  const html = read('agenda/index.html');
  const source = read('js/agenda.js');

  assert.match(html, /id="agendaOrder"/);
  assert.match(html, /Agendamento mais próximo/);
  assert.match(html, /Agendamento mais distante/);
  assert.match(source, /function compareAppointment/);
  assert.match(source, /els\.order\?\.value === 'desc' \? -1 : 1/);
  assert.match(source, /appointmentDate/);
  assert.match(source, /appointmentTime/);
  assert.match(source, /\.sort\(compareAppointment\)/);
  assert.match(source, /els\.order\.addEventListener\('change', render\)/);
});

// All contacts and identities below are synthetic; no network or real storage is used.
function contactTools(windowOverrides = {}, clock = Date) {
  const source = read('agenda/digsaude-agenda-sync.user.js');
  const window = { location: new URL('https://example.test/unidade/consultas'), ...windowOverrides };
  const context = { window, URL, Date: clock, document: {}, Map, Set };
  vm.runInNewContext(source.slice(0, source.indexOf('  function widget()')) + `
    function setButton() {}
    globalThis.tools = { normalizePhone, phoneCandidate, phoneFromNode, phoneFromRoot,
      patientDetailsRoot, navigateContactWindow, extractContact, enrichSnapshotContacts,
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

const syntheticContact = {
  sourceId: 'synthetic-a', patient: 'Paciente de teste A', requestedAt: '2026-10-01',
  phone: '5511990000001', contactVersion: 'patient-details-v2', contactSourceId: 'synthetic-a'
};

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

test('normalização aceita somente campo inteiro válido e mantém DDD e nono dígito', () => {
  const collector = contactTools();
  const backend = backendContactTools();
  for (const value of ['(11) 99000-0001', '+55 (11) 99000-0001', '011990000001']) {
    assert.equal(collector.phoneCandidate(value), syntheticContact.phone);
    assert.equal(backend.normalizeBrazilPhone(value), syntheticContact.phone);
  }
  // DDD 55 is a domestic area code too, not necessarily the country prefix.
  assert.equal(backend.normalizeBrazilPhone('(55) 99000-0001'), '5555990000001');
  for (const value of ['', 'CPF 11990000001', 'ID=11990000001', '00000000000',
    '00990000001', '(11) 8900-0001', '11990000001 / 21990000002', '551199000000100']) {
    assert.equal(collector.phoneCandidate(value), '');
    assert.equal(backend.normalizeBrazilPhone(value), '');
  }
  assert.equal(collector.phoneCandidate('(11) 3000-0001'), '551130000001');
  assert.equal(collector.phoneFromNode(phoneInput('', { placeholder: '(11) 99000-0001', value: '(11) 99000-0001' })), '');
});

test('extração rejeita ausente ou ambíguo e ignora identificadores genéricos', () => {
  const tools = contactTools();
  assert.equal(tools.phoneFromRoot(patientDialog([phoneInput('(11) 99000-0001')])), syntheticContact.phone);
  assert.equal(tools.phoneFromRoot(patientDialog([phoneInput('(11) 99000-0001'), phoneInput('(21) 99000-0002')])), '');
  assert.equal(tools.phoneFromRoot(patientDialog([])), '');
  assert.equal(tools.phoneFromRoot(patientDialog([phoneInput('(21) 99000-0002', { name: 'profissional.telefone' })])), '');
  assert.equal(tools.phoneFromRoot(patientDialog([phoneInput('(21) 99000-0002', { name: 'unidade.telefone' })])), '');
  const genericId = phoneInput('11990000001');
  const root = patientDialog();
  const original = root.querySelectorAll;
  root.querySelectorAll = (selector) => selector === 'input, textarea' ? [genericId] : original(selector);
  assert.equal(tools.phoneFromRoot(root), '');
  const wrapper = { querySelectorAll: () => [genericId] };
  const broadLabel = { textContent: 'Telefone CPF', getAttribute: () => null, closest: () => wrapper };
  assert.equal(tools.phoneFromRoot(patientDialog([], [broadLabel])), '');
});

test('coleta fica no único diálogo visível Dados do Paciente', () => {
  const tools = contactTools();
  const patient = patientDialog([phoneInput('(11) 99000-0001')]);
  const professional = { ...patientDialog([phoneInput('(21) 99000-0002')]), querySelectorAll: () => [{ textContent: 'Profissional / Unidade' }] };
  const hidden = { ...patientDialog(), getClientRects: () => [] };
  assert.equal(tools.patientDetailsRoot({ querySelectorAll: () => [professional, hidden, patient] }), patient);
  assert.equal(tools.patientDetailsRoot({ querySelectorAll: () => [professional] }), null);
  assert.equal(tools.patientDetailsRoot({ querySelectorAll: () => [patient, patientDialog()] }), null);
});

test('navegação aguarda rota exata e novo Document antes de ler outra ficha', async () => {
  let waits = 0;
  const oldRoot = { readyState: 'complete' };
  const newRoot = { readyState: 'complete' };
  let currentRoot = oldRoot;
  let currentUrl = new URL('https://example.test/unidade/consultas/synthetic-a/view');
  const frame = {
    closed: false, get document() { return currentRoot; },
    get location() { return currentUrl; }, set location(_value) { /* navigation is pending */ }
  };
  const tools = contactTools({ setTimeout(resolve) {
    waits++;
    currentUrl = new URL('https://example.test/unidade/consultas/synthetic-b/view');
    if (waits === 2) currentRoot = newRoot; // URL alone is insufficient.
    resolve();
  } });
  tools.setWindow(frame);
  const result = await tools.navigateContactWindow('https://example.test/unidade/consultas/synthetic-b/view');
  assert.equal(waits, 2);
  assert.equal(result.root, newRoot);
});

test('fichas sintéticas percorrem coleta → espelho → href sem trocar destinos', async () => {
  const tools = contactTools({ setTimeout(resolve) { resolve(); } });
  let currentRoot = { readyState: 'complete' };
  let currentUrl = new URL('https://example.test/unidade/consultas');
  const phones = { 'synthetic-a': '(11) 99000-0001', 'synthetic-b': '(21) 99000-0002' };
  const frame = {
    closed: false, get document() { return currentRoot; }, get location() { return currentUrl; },
    set location(value) {
      currentUrl = new URL(value);
      let clicked = false;
      const sourceId = currentUrl.pathname.split('/').at(-2);
      const dialog = patientDialog([phoneInput(phones[sourceId])]);
      const action = { textContent: 'Ver Dados do Paciente', getClientRects: () => [{}], click() { clicked = true; } };
      currentRoot = { readyState: 'complete', querySelectorAll(selector) {
        if (selector.startsWith('button,')) return [action];
        if (selector.includes('dialog')) return clicked ? [dialog] : [];
        // Even a professional phone in the consultation page must never be read.
        return [phoneInput('(31) 99000-0003')];
      } };
    }
  };
  tools.setWindow(frame);
  const backend = backendContactTools();
  const frontend = reminderTools();
  for (const [sourceId, patient] of [['synthetic-a', 'Paciente de teste A'], ['synthetic-b', 'Paciente de teste B']]) {
    const record = { sourceId, patient, requestedAt: '2026-10-01' };
    const result = await tools.enrichSnapshotContacts({ records: [record] });
    assert.equal(result.found, 1);
    assert.equal(record.contactSourceId, sourceId);
    assert.equal(record.contactVersion, 'patient-details-v2');
    await backend.syncRecords({}, { records: [record] }, { username: 'synthetic-operator' });
    const saved = backend.writes.at(-1).data;
    const published = backend.publicRecord(saved, 'synthetic-operator', new Map());
    const url = new URL(frontend.patientWhatsappUrl(published));
    assert.equal(url.pathname.slice(1), sourceId === 'synthetic-a' ? '5511990000001' : '5521990000002');
    assert.ok(url.searchParams.get('text').includes(patient));
  }
});

test('contato legado não gera href nem permanece marcado como conhecido', () => {
  const backend = backendContactTools();
  const legacy = { ...syntheticContact, contactVersion: undefined };
  const published = backend.publicRecord(legacy, 'synthetic-operator', new Map());
  assert.equal(published.phone, '');
  assert.equal(reminderTools().patientWhatsappUrl(published), '');
  assert.equal(backend.contactState([legacy]).known, 0);
});

test('contato conferido expira e perde validade ao mudar associação da ficha', () => {
  const backend = backendContactTools();
  const verified = backend.normalizeRecord(syntheticContact);
  assert.equal(backend.contactState([verified]).known, 1);
  for (const changed of [
    { ...verified, patient: 'Paciente de teste C' },
    { ...verified, requestedAt: '2026-10-02' },
    { ...verified, sourceId: 'synthetic-c' },
    { ...verified, contactVerifiedAt: new Date(Date.now() - 25 * 3600000).toISOString() },
    { ...verified, contactVerifiedAt: 'invalid' }
  ]) {
    assert.equal(backend.publicRecord(changed, '', new Map()).phone, '');
    assert.equal(backend.contactState([changed]).known, 0);
  }
});

test('rechecagem vazia revoga destino salvo; versão antiga não restaura telefone legado', async () => {
  const initial = backendContactTools().normalizeRecord(syntheticContact);
  for (const incoming of [
    { ...syntheticContact, phone: '' },
    { ...syntheticContact, phone: 'CPF 11990000001' },
    { ...syntheticContact, contactSourceId: 'synthetic-b', patient: 'Paciente de teste B' }
  ]) {
    const backend = backendContactTools([{ ...initial, id: 'synthetic-doc' }]);
    await backend.syncRecords({}, { records: [incoming] }, { username: 'synthetic-operator' });
    assert.equal(backend.writes[0].data.phone, '');
  }
  const legacyBackend = backendContactTools([{ ...syntheticContact, id: 'synthetic-doc' }]);
  await legacyBackend.syncRecords({}, { records: [{ ...syntheticContact, contactVersion: undefined }] }, { username: 'synthetic-operator' });
  assert.equal(legacyBackend.writes[0].data.phone, '');
  const backend = backendContactTools();
  const unattempted = backend.normalizeRecord({ ...syntheticContact, phone: undefined, contactVersion: undefined });
  assert.equal(backend.contactForSync(unattempted, initial).phone, initial.phone);
});

test('frontend recusa destino inválido sem fabricar nono dígito', () => {
  const frontend = reminderTools();
  for (const phone of ['', undefined, '551189000001', '5500990000001', 'CPF 11990000001']) {
    assert.equal(frontend.patientWhatsappUrl({ ...syntheticContact, phone }), '');
  }
});

test('falha de coleta segue ao espelho como contato vazio e revoga destino anterior', async () => {
  let tick = Date.now();
  class TestClock extends Date { static now() { tick += 2000; return tick; } }
  const tools = contactTools({ setTimeout(resolve) { resolve(); } }, TestClock);
  let root = { readyState: 'complete' };
  let location = new URL('https://example.test/unidade/consultas');
  const frame = {
    closed: false, get document() { return root; }, get location() { return location; },
    set location(value) { location = new URL(value); root = { readyState: 'complete', querySelectorAll: () => [] }; }
  };
  tools.setWindow(frame);
  const record = { sourceId: syntheticContact.sourceId, patient: syntheticContact.patient, requestedAt: syntheticContact.requestedAt };
  const result = await tools.enrichSnapshotContacts({ records: [record] });
  assert.equal(result.failed, 1);
  assert.equal(result.requested, 1);
  assert.equal(record.phone, '');
  assert.equal(record.contactVersion, 'patient-details-v2');
  const existing = backendContactTools().normalizeRecord(syntheticContact);
  const backend = backendContactTools([{ ...existing, id: 'synthetic-doc' }]);
  await backend.syncRecords({}, { records: [record] }, { username: 'synthetic-operator' });
  assert.equal(backend.publicRecord(backend.writes[0].data, '', new Map()).phone, '');
});

test('Filament homologado trata role=dialog e fi-modal-window aninhados como um diálogo', () => {
  const fixture = read('worker/tests/fixtures/agenda-patient-dialog.html');
  assert.match(fixture, /class="fi-modal fi-modal-open" role="dialog"/);
  assert.match(fixture, /class="fi-modal-window(?:\s|")/);
  assert.match(fixture, /for="mountedActionsData\.0\.telefonecel"/);
  assert.match(fixture, /id="mountedActionsData\.0\.telefonecel"[^>]+disabled/);
  const input = phoneInput('(11) 99000-0001', { name: '', id: 'mountedActionsData.0.telefonecel' });
  input.disabled = true;
  const inner = patientDialog([input]);
  const outer = { ...patientDialog([input]), contains: (node) => node === inner || node === input };
  const tools = contactTools();
  const selected = tools.patientDetailsRoot({ querySelectorAll: () => [outer, inner] });
  assert.equal(selected, inner);
  assert.equal(tools.phoneFromRoot(selected), syntheticContact.phone);
  assert.equal(tools.patientDetailsRoot({ querySelectorAll: () => [outer, inner, patientDialog()] }), null);
});

test('homologação do diálogo exige título exato e não amplia para outro contêiner', () => {
  const tools = contactTools();
  const unrelated = { ...patientDialog(), querySelectorAll: () => [{ textContent: 'Outros dados do paciente e unidade' }] };
  assert.equal(tools.patientDetailsRoot({ querySelectorAll: () => [unrelated] }), null);
});

function syntheticConsultationFlow({ phone = '(11) 99000-0001', dialogDelay = 0, menuClosed = false, menuAmbiguous = false, menuTriggerAmbiguous = false, menuNeverOpens = false, onMenu, onAction, onPoll } = {}) {
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
    tick += ms; polls++; onPoll?.({ frame, tools, polls }); resolve();
  } }, FlowClock);
  tools.setWindow(frame);
  return { tools, frame, setPhone(value) { phone = value; }, navigations: () => navigations, polls: () => polls,
    menuClicks: () => menuClicks, actionClicks: () => actionClicks, otherClicks: () => otherClicks };
}

async function hrefAfterSyntheticCollection(flow, record = { sourceId: 'synthetic-a', patient: 'Paciente de teste A', requestedAt: '2026-10-01' }) {
  const result = await flow.tools.enrichSnapshotContacts({ records: [record] });
  const backend = backendContactTools();
  await backend.syncRecords({}, { records: [record] }, { username: 'synthetic-operator' });
  const published = backend.publicRecord(backend.writes[0].data, '', new Map());
  return { result, record, href: reminderTools().patientWhatsappUrl(published) };
}

test('fluxo sintético aborta quando janela fecha após abrir o diálogo', async () => {
  const flow = syntheticConsultationFlow({ onAction: ({ frame }) => { frame.closed = true; } });
  const outcome = await hrefAfterSyntheticCollection(flow);
  assert.equal(outcome.href, '');
  assert.equal(outcome.result.failed, 1);
});

test('fluxo sintético aborta resposta que troca Document durante a coleta', async () => {
  const flow = syntheticConsultationFlow({ onAction: ({ replaceDocument }) => replaceDocument('(21) 99000-0002') });
  assert.equal((await hrefAfterSyntheticCollection(flow)).href, '');
});

function automaticSourceFlow({ autoReady = true } = {}) {
  const fixtureFlow = syntheticConsultationFlow();
  const frame = fixtureFlow.frame;
  const listeners = new Map();
  const timers = new Map();
  const sent = [];
  let timerId = 0;
  const portal = 'https://regulacaoeldoradoms.com.br';
  const window = {
    location: new URL('https://example.test/unidade/consultas'),
    addEventListener: (name, listener) => listeners.set(name, listener),
    setTimeout(fn, ms) { const id = ++timerId; if (ms === 160 || ms === 180) queueMicrotask(fn); else timers.set(id, { fn, ms }); return id; },
    clearTimeout: (id) => timers.delete(id),
    setInterval(fn, ms) { const id = ++timerId; timers.set(id, { fn, ms }); return id; },
    clearInterval: (id) => timers.delete(id), open: () => frame, focus() {}
  };
  const locationProperty = Object.getOwnPropertyDescriptor(frame, 'location');
  Object.defineProperty(frame, 'location', { ...locationProperty, set(value) {
    locationProperty.set(value);
    if (autoReady && String(value).startsWith(portal)) queueMicrotask(() => listeners.get('message')?.({
      origin: portal, source: frame, data: { type: 'PORTAL_AGENDA_DIGSAUDE_READY', contactCapability: 'patient-details-v2', knownSourceIds: [] }
    }));
  } });
  frame.postMessage = (message) => sent.push(structuredClone(message));
  const document = { getElementById: () => null, addEventListener() {}, hidden: false };
  const context = { window, document, URL, Date, Map, Set };
  const source = read('agenda/digsaude-agenda-sync.user.js');
  vm.runInNewContext(source.slice(0, source.indexOf('  function mountWidget()')) + `
    autoEnabled = true; contactCapabilityVerified = true; portalWindow = window.open();
    globalThis.tools = { runAutomaticSync, pauseAutomatic,
      activateAutomaticSync: () => { activateAutomaticSync(); contactCapabilityVerified = true; },
      setFetcher(fn) { fetchSnapshot = fn; },
      state() { return { pendingSyncId, syncInFlight, lastFingerprint }; },
      retry() { sendSnapshot(); } };
  })();`, context);
  return { ...context.tools, sent, frame, timers,
    reply(data) { listeners.get('message')({ origin: portal, source: frame, data }); } };
}

const syntheticSnapshot = () => ({ complete: true, totalCount: 1, records: [{ sourceId: 'synthetic-a', patient: 'Paciente de teste A', requestedAt: '2026-10-01' }] });

test('automático sintético descarta fetch antigo após pausar e reativar', async () => {
  const flow = automaticSourceFlow();
  let finishOld;
  flow.setFetcher(() => new Promise((resolve) => { finishOld = resolve; }));
  const oldRun = flow.runAutomaticSync();
  flow.pauseAutomatic();
  flow.activateAutomaticSync();
  finishOld(syntheticSnapshot());
  await oldRun;
  assert.equal(flow.sent.length, 0);
  assert.equal(flow.state().pendingSyncId, '');
});

test('fluxo sintético aguarda diálogo atrasado e rejeita fechado, ausente ou ambíguo', async () => {
  const delayed = syntheticConsultationFlow({ dialogDelay: 4 });
  const outcome = await hrefAfterSyntheticCollection(delayed);
  assert.equal(new URL(outcome.href).pathname, '/5511990000001');
  assert.ok(delayed.polls() >= 4);
  for (const options of [{ dialogDelay: Infinity }, { phone: '' }, { phone: ['(11) 99000-0001', '(21) 99000-0002'] }]) {
    const result = await hrefAfterSyntheticCollection(syntheticConsultationFlow(options));
    assert.equal(result.href, '');
    assert.equal(result.result.failed, 1);
  }
});

test('ação do paciente em menu inicialmente fechado abre somente seu trigger e mantém destino por ficha', async () => {
  const menuFixture = read('worker/tests/fixtures/agenda-patient-menu.html');
  assert.match(menuFixture, /class="fi-dropdown-panel" style="display:none"/);
  assert.match(menuFixture, /class="fi-dropdown-trigger"/);
  const flow = syntheticConsultationFlow({ menuClosed: true });
  const outcome = await hrefAfterSyntheticCollection(flow);
  assert.equal(outcome.href && new URL(outcome.href).pathname, '/5511990000001');
  assert.equal(flow.menuClicks(), 1);
  assert.equal(flow.actionClicks(), 1);
  assert.equal(flow.otherClicks(), 0);
});

test('menu de paciente ambíguo ou trigger ambíguo não gera cliques nem destino', async () => {
  for (const options of [{ menuAmbiguous: true }, { menuTriggerAmbiguous: true }]) {
    const flow = syntheticConsultationFlow({ menuClosed: true, ...options });
    const outcome = await hrefAfterSyntheticCollection(flow);
    assert.equal(outcome.href, '');
    assert.equal(flow.menuClicks(), 0);
    assert.equal(flow.actionClicks(), 0);
  }
});

test('menu que não abre não é clicado repetidamente e não gera destino', async () => {
  const flow = syntheticConsultationFlow({ menuClosed: true, menuNeverOpens: true });
  assert.equal((await hrefAfterSyntheticCollection(flow)).href, '');
  assert.equal(flow.menuClicks(), 1);
  assert.equal(flow.actionClicks(), 0);
});

test('fechamento ou troca de Document após abrir menu cancela antes da ação e do telefone', async () => {
  for (const onMenu of [({ frame }) => { frame.closed = true; }, ({ replaceDocument }) => replaceDocument()]) {
    const flow = syntheticConsultationFlow({ menuClosed: true, onMenu });
    assert.equal((await hrefAfterSyntheticCollection(flow)).href, '');
    assert.equal(flow.menuClicks(), 1);
    assert.equal(flow.actionClicks(), 0);
  }
});

test('ação que muda de dropdown após abertura é recusada sem destino', async () => {
  const flow = syntheticConsultationFlow({ menuClosed: true, onMenu: ({ action }) => { action.closest = () => ({}); } });
  assert.equal((await hrefAfterSyntheticCollection(flow)).href, '');
  assert.equal(flow.menuClicks(), 1);
  assert.equal(flow.actionClicks(), 0);
});

test('fluxo sintético repete contato só para mesma associação e cancela cache com janela fechada', async () => {
  const flow = syntheticConsultationFlow();
  const first = await hrefAfterSyntheticCollection(flow);
  assert.equal(new URL(first.href).pathname, '/5511990000001');
  assert.equal((await hrefAfterSyntheticCollection(flow)).href, first.href);
  assert.equal(flow.navigations(), 1);
  flow.setPhone('(21) 99000-0002');
  const changed = await hrefAfterSyntheticCollection(flow, { sourceId: 'synthetic-a', patient: 'Paciente de teste B', requestedAt: '2026-10-02' });
  assert.equal(new URL(changed.href).pathname, '/5521990000002');
  assert.equal(flow.navigations(), 2);
  flow.frame.closed = true;
  assert.equal((await hrefAfterSyntheticCollection(flow)).href, '');
});

test('automático sintético cancela espera da ponte sem enviar snapshot', async () => {
  const flow = automaticSourceFlow({ autoReady: false });
  flow.setFetcher(async () => syntheticSnapshot());
  const run = flow.runAutomaticSync();
  await new Promise(setImmediate);
  assert.notEqual(flow.state().pendingSyncId, '');
  flow.pauseAutomatic();
  await run;
  flow.retry();
  assert.equal(flow.sent.length, 0);
  assert.equal(flow.state().pendingSyncId, '');
});

test('automático sintético ignora erro antigo sem limpar envio da nova sessão', async () => {
  const flow = automaticSourceFlow();
  let rejectOld;
  flow.setFetcher(() => new Promise((_resolve, reject) => { rejectOld = reject; }));
  const oldRun = flow.runAutomaticSync();
  flow.pauseAutomatic(); flow.activateAutomaticSync();
  flow.setFetcher(async () => syntheticSnapshot());
  await flow.runAutomaticSync();
  const currentId = flow.state().pendingSyncId;
  assert.notEqual(currentId, '');
  rejectOld(new Error('synthetic stale failure'));
  await oldRun;
  assert.equal(flow.state().pendingSyncId, currentId);
  assert.equal(flow.sent.length, 1);
});

async function syntheticBridgeFlow() {
  const records = [];
  const backend = backendContactTools(records);
  const replies = [];
  const opener = { closed: false, postMessage: (message) => replies.push(structuredClone(message)) };
  let receive;
  let syncCalls = 0;
  const context = {
    document: { getElementById: () => ({ textContent: '', hidden: true }) },
    window: { opener, addEventListener: (_name, fn) => { receive = fn; }, RegulationAuth: {
      requireRole: async () => ({ role: 'telemedicina' }),
      async api(path, options) {
        if (path.endsWith('/contact-state')) return backend.contactState(records);
        assert.equal(path, '/api/agenda/sync');
        syncCalls++;
        const result = await backend.syncRecords({}, JSON.parse(options.body), { username: 'synthetic-operator' });
        for (const write of backend.writes) {
          const row = { ...write.data, id: write.documentPath.split('/').at(-1) };
          const index = records.findIndex((item) => item.sourceId === row.sourceId);
          if (index < 0) records.push(row); else records[index] = row;
        }
        return result;
      }
    } }, Date
  };
  await vm.runInNewContext(read('js/agenda-sync-bridge.js'), context);
  return { records, backend, replies, syncCalls: () => syncCalls,
    accept(data) { return receive({ origin: 'https://teleatendimento.saude.ms.gov.br', source: opener, data }); } };
}

test('automático sintético atravessa ponte real, ignora resposta antiga e deduplica repetição até href', async () => {
  const source = automaticSourceFlow();
  source.setFetcher(async () => syntheticSnapshot());
  await source.runAutomaticSync();
  const currentId = source.state().pendingSyncId;
  source.reply({ type: 'PORTAL_AGENDA_DIGSAUDE_RESULT', syncId: 'synthetic-old-sync', ok: true, knownSourceIds: ['synthetic-b'] });
  assert.equal(source.state().pendingSyncId, currentId);
  source.retry();
  assert.equal(source.sent.length, 2);
  assert.equal(source.sent[0].syncId, source.sent[1].syncId);
  const bridge = await syntheticBridgeFlow();
  await bridge.accept(source.sent[0]);
  await bridge.accept(source.sent[1]);
  assert.equal(bridge.syncCalls(), 1);
  const results = bridge.replies.filter((message) => message.type === 'PORTAL_AGENDA_DIGSAUDE_RESULT');
  assert.equal(results.length, 2);
  source.reply(results[0]); source.reply(results[1]);
  assert.equal(source.state().pendingSyncId, '');
  const published = bridge.backend.publicRecord(bridge.records[0], '', new Map());
  assert.equal(new URL(reminderTools().patientWhatsappUrl(published)).pathname, '/5511990000001');
  assert.equal(bridge.records[0].sourceId, 'synthetic-a');
});
