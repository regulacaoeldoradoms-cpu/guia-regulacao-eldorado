import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// In-memory Firestore with atomic preconditions. Synthetic identities only; no credentials/network.
const read = path => fs.readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
const source = read('worker/agenda.js').replace(/import[\s\S]*?from\s+'[^']+';/g, '').replace(/export /g, '');
const CAP = 'patient-details-v2';
const DIRECTORY = 'patient-directory-v1';
const ORG = { AGENDA_ORGANIZATION_ID: 'synthetic-a' };
const row = (overrides = {}) => ({ sourceId: 'synthetic-appointment-a', patientSourceId: 'synthetic-patient-a',
  patient: 'Paciente sintético', requestedAt: '2026-10-01', appointmentDate: '2099-10-01',
  appointmentTime: '10:00', phone: '5511990000001', contactVersion: CAP,
  contactSourceId: 'synthetic-appointment-a', contactPatientSourceId: 'synthetic-patient-a', ...overrides });

function storage(serialized) {
  const documents = new Map(serialized || []);
  let sequence = 100;
  const history = [], reads = [];
  const state = { documents, history, reads, conflicts: 0, beforeCommit: null, listOverride: null, batchOverride: null };
  state.batchGet = async (_env, paths) => {
    reads.push(...paths);
    const override = state.batchOverride?.(paths);
    if (override) return override;
    return paths.filter(path => documents.has(path)).map(path => ({ id: path.split('/').at(-1), ...structuredClone(documents.get(path)) }));
  };
  state.list = async (_env, path, options = {}) => {
    reads.push(path);
    const override = state.listOverride?.(path, options);
    if (override) return override;
    const all = [...documents].filter(([key]) => key.startsWith(path + '/') && !key.slice(path.length + 1).includes('/'));
    const offset = Number(options.pageToken || 0), size = options.pageSize || 100;
    return { documents: all.slice(offset, offset + size).map(([key, value]) => ({ id: key.split('/').at(-1), ...structuredClone(value) })),
      nextPageToken: offset + size < all.length ? String(offset + size) : '' };
  };
  state.get = async (_env, path) => documents.has(path) ? structuredClone(documents.get(path)) : null;
  state.commit = async (_env, writes) => {
    await state.beforeCommit?.(writes);
    for (const write of writes) {
      const previous = documents.get(write.documentPath), condition = write.currentDocument;
      if (condition && (('exists' in condition && condition.exists !== Boolean(previous))
        || (condition.updateTime && condition.updateTime !== previous?._updateTime))) {
        state.conflicts++;
        throw Object.assign(new Error('Synthetic conflict'), { status: 400, code: 'FAILED_PRECONDITION' });
      }
    }
    for (const write of writes) {
      const data = { ...structuredClone(write.data), _updateTime: `synthetic-version-${++sequence}` };
      documents.set(write.documentPath, data);
      history.push(structuredClone(write));
    }
  };
  return state;
}

function backend(db = storage(), preparedDirectory = true) {
  const context = { Date, TextEncoder, crypto: globalThis.crypto, Request, Response, URL,
    firebaseConfigured: () => true,
    validatePortalSession: async () => context.user,
    telemedicineAccessFor: async () => false,
    firestoreList: db.list, firestoreGet: db.get, firestoreBatchGet: db.batchGet, firestoreCommit: db.commit,
    user: { username: 'synthetic-operator', role: 'admin' } };
  // Prepared directory regressions use a synthetic enabled build. Release cases keep the exact false constant.
  const build = preparedDirectory ? source.replace('const PATIENT_DIRECTORY_ENABLED = false;', 'const PATIENT_DIRECTORY_ENABLED = true;') : source;
  vm.runInNewContext(build + '\nglobalThis.api={handleAgendaRoute,syncRecords,contactCollection,agendaCollection,normalizeRecord};', context);
  return { ...context.api, context, db,
    async request(path, body, env = ORG, originAllowed = true) {
      const response = await context.api.handleAgendaRoute(new Request('https://portal.test/api/agenda' + path,
        body === undefined ? {} : { method: 'POST', body: JSON.stringify(body) }), env, 'https://portal.test', originAllowed);
      return { status: response.status, headers: response.headers, body: await response.json() };
    },
    async sync(records, env = ORG, complete = false) {
      return this.request('/sync', { records, totalCount: records.length, complete }, env);
    },
    async list(env = ORG) { return (await this.request('', undefined, env)).body.records; },
    async lookup(records, env = ORG) { return this.request('/contact-state', { records }, env); }
  };
}
const contactEntries = db => [...db.documents].filter(([path]) => path.includes('/contacts/'));

test('contato durável sobrevive recarga, outra sessão e mais de 24h sem armazenar telefone no snapshot', async () => {
  const w = backend();
  assert.equal((await w.sync([row()])).status, 200);
  assert.equal(contactEntries(w.db).length, 1);
  const [path, contact] = contactEntries(w.db)[0];
  assert.ok(!path.includes('synthetic-patient-a') && !path.includes(ORG.AGENDA_ORGANIZATION_ID));
  assert.equal([...w.db.documents].find(([key]) => key.includes('/records/'))[1].phone, '');
  contact.verifiedAt = '2020-01-01T00:00:00.000Z';
  const reloaded = backend(storage(JSON.parse(JSON.stringify([...w.db.documents]))));
  reloaded.context.user = { username: 'synthetic-other-session', role: 'admin' };
  assert.equal((await reloaded.list())[0].phone, row().phone);
  const result = await reloaded.request('/contact-state');
  assert.equal(result.body.known, 1);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  for (const secret of [row().phone, row().patient, row().patientSourceId]) assert.ok(!JSON.stringify(result.body).includes(secret));
});

test('snapshot completo vazio, parcial e nova consulta do mesmo paciente conservam contato', async () => {
  const w = backend();
  await w.sync([row()], ORG, true);
  await w.sync([], ORG, true);
  assert.equal(contactEntries(w.db).length, 1);
  assert.equal((await w.list())[0].active, false);
  assert.equal((await w.list())[0].phone, '');
  const next = row({ sourceId: 'synthetic-appointment-b', patient: 'Nome sintético corrigido',
    requestedAt: '2027-01-01', phone: undefined, contactVersion: undefined });
  const lookup = await w.lookup([next]);
  assert.deepEqual(lookup.body.knownSourceIds, [next.sourceId]);
  await w.sync([next]);
  assert.equal((await w.list()).find(item => item.sourceId === next.sourceId).phone, row().phone);
  assert.equal(contactEntries(w.db).length, 1);
});

test('vazio, falha, dado inválido e repetição são idempotentes e não sobrescrevem contato válido', async () => {
  const w = backend();
  await w.sync([row()]);
  const original = structuredClone(contactEntries(w.db)[0][1]);
  for (const phone of ['', undefined, 'CPF 11990000001', '5521990000002']) {
    await w.sync([row({ phone })]);
    assert.equal((await w.list())[0].phone, row().phone);
  }
  assert.deepEqual(contactEntries(w.db)[0][1], original);
  assert.equal(w.db.history.filter(item => item.documentPath.includes('/contacts/')).length, 1);
});

test('identidade técnica separa homônimos, associação alterada e organizações inclusive consultas/leitura', async () => {
  const w = backend();
  await w.sync([row()]);
  const otherPatient = row({ patientSourceId: 'synthetic-patient-b', phone: undefined });
  assert.deepEqual((await w.lookup([otherPatient])).body.knownSourceIds, []);
  const otherOrg = { AGENDA_ORGANIZATION_ID: 'synthetic-b' };
  assert.deepEqual(await w.list(otherOrg), []);
  assert.deepEqual((await w.lookup([row()], otherOrg)).body.knownSourceIds, []);
  assert.equal((await w.request('/contact', { action: 'delete', patientSourceId: row().patientSourceId,
    expectedRevision: contactEntries(w.db)[0][1].revision }, otherOrg)).status, 404);
  await w.sync([row({ phone: '5521990000002' })], otherOrg);
  assert.equal((await w.list(otherOrg))[0].phone, '5521990000002');
  assert.equal((await w.list())[0].phone, row().phone);
  await w.request('/read', { sourceId: row().sourceId }, otherOrg);
  assert.equal((await w.list())[0].readAt, '');
  assert.ok((await w.list(otherOrg))[0].readAt);
  assert.equal((await w.sync([row()], { AGENDA_ORGANIZATION_ID: '../invalid' })).status, 503);
});

test('correção/exclusão explícitas exigem sessão e versão e exclusão impede ressurreição por snapshot', async () => {
  const w = backend();
  await w.sync([row()]);
  const mutate = (action, expectedRevision, phone) => w.request('/contact', { action, expectedRevision, phone,
    patientSourceId: row().patientSourceId });
  const initial = (await w.list())[0].contactRevision;
  assert.equal((await mutate('correct', initial, '')).status, 400);
  const corrected = await mutate('correct', initial, '5521990000002');
  assert.equal(corrected.status, 200);
  assert.equal((await mutate('delete', initial)).status, 409);
  assert.equal((await w.list())[0].phone, '5521990000002');
  const deleted = await mutate('delete', corrected.body.revision);
  assert.equal(deleted.status, 200);
  await w.sync([row()]); // A stale capture/old browser cache is never an authorized restoration.
  const next = row({ sourceId: 'synthetic-new-appointment' });
  const state = (await w.lookup([next])).body;
  assert.deepEqual(state.knownSourceIds, []);
  assert.deepEqual(state.blockedSourceIds, [next.sourceId]);
  assert.equal((await w.list())[0].phone, '');
  assert.equal(contactEntries(w.db)[0][1].phone, '');
  assert.equal((await w.list())[0].contactBlocked, true);
  const restored = await mutate('correct', deleted.body.revision, row().phone);
  assert.equal(restored.status, 200);
  assert.equal((await w.list())[0].phone, row().phone);
  w.context.user = null;
  const reads = w.db.reads.length;
  assert.equal((await mutate('delete', restored.body.revision)).status, 401);
  assert.equal((await w.lookup([next])).status, 401);
  assert.equal(w.db.reads.length, reads);
  w.context.user = { username: 'synthetic-unauthorized', role: 'recepcao' };
  assert.equal((await mutate('delete', restored.body.revision)).status, 403);
  assert.equal((await w.request('/contact-state', undefined, ORG, false)).status, 403);
});

test('duas sessões concorrentes criam uma única entrada; CAS repete snapshot sem perder contato', async () => {
  const w = backend();
  const results = await Promise.all([w.sync([row()]), w.sync([row({ phone: '5521990000002' })])]);
  assert.deepEqual(results.map(item => item.status), [200, 200]);
  assert.equal(contactEntries(w.db).length, 1);
  assert.equal(w.db.history.filter(item => item.documentPath.includes('/contacts/')).length, 1);
  assert.ok(w.db.conflicts > 0);
  assert.equal((await w.list())[0].phone, contactEntries(w.db)[0][1].phone);
});

test('falha do snapshot após gravar contato não descarta captura e a próxima sessão a reutiliza', async () => {
  const w = backend();
  let fail = true;
  w.db.beforeCommit = async writes => {
    if (fail && writes.some(write => write.documentPath.includes('/records/'))) {
      fail = false;
      throw Error('Synthetic snapshot failure');
    }
  };
  assert.equal((await w.sync([row()])).status, 500);
  assert.equal(contactEntries(w.db).length, 1);
  assert.deepEqual((await w.lookup([row()])).body.knownSourceIds, [row().sourceId]);
  assert.equal((await w.sync([row({ phone: undefined, contactVersion: undefined })])).status, 200);
  assert.equal((await w.list())[0].phone, row().phone);
  assert.equal(w.db.history.filter(write => write.documentPath.includes('/contacts/')).length, 1);
});

test('correção/exclusão vencem coleta que leu ausência antes de uma gravação concorrente', async () => {
  for (const action of ['correct', 'delete']) {
    const w = backend();
    await w.sync([row()]);
    let hide = true;
    w.db.batchOverride = () => hide ? (hide = false, []) : null;
    let mutated = false;
    w.db.beforeCommit = async writes => {
      if (mutated || !writes.some(item => item.documentPath.includes('/contacts/') && item.currentDocument?.exists === false)) return;
      mutated = true;
      const revision = contactEntries(w.db)[0][1].revision;
      const result = await w.request('/contact', { action, patientSourceId: row().patientSourceId,
        expectedRevision: revision, phone: '5521990000002' });
      assert.equal(result.status, 200);
    };
    assert.equal((await w.sync([row()])).status, 200);
    assert.ok(mutated && w.db.conflicts > 0);
    assert.equal((await w.list())[0].phone, action === 'delete' ? '' : '5521990000002');
  }
});

test('correções concorrentes com mesma revisão têm um único vencedor', async () => {
  const w = backend();
  await w.sync([row()]);
  const expectedRevision = (await w.list())[0].contactRevision;
  const results = await Promise.all(['5521990000002', '5531990000003'].map(phone => w.request('/contact', {
    action: 'correct', phone, expectedRevision, patientSourceId: row().patientSourceId })));
  assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
});

test('perda de identidade estabelecida não restaura contato excluído nem associa legado homônimo', async () => {
  const w = backend();
  await w.sync([row()]);
  const legacyCopy = row({ sourceId: 'synthetic-unbound-copy', contactSourceId: 'synthetic-unbound-copy',
    patientSourceId: undefined, contactPatientSourceId: undefined });
  w.db.documents.set((await w.agendaCollection(ORG)) + '/synthetic-unbound-copy', {
    ...w.normalizeRecord(legacyCopy), _updateTime: 'synthetic-legacy-version' });
  await w.request('/contact', { action: 'delete', patientSourceId: row().patientSourceId,
    expectedRevision: (await w.list()).find(item => item.sourceId === row().sourceId).contactRevision });
  await w.sync([row({ patientSourceId: undefined, contactPatientSourceId: undefined,
    patient: 'Nome sintético antigo', requestedAt: '2020-01-01' })]);
  await w.sync([row({ patientSourceId: undefined, contactPatientSourceId: undefined,
    patient: 'Nome sintético antigo', requestedAt: '2020-01-01' })]);
  assert.equal((await w.list()).find(item => item.sourceId === row().sourceId).phone, '');
  assert.equal((await w.list()).find(item => item.sourceId === legacyCopy.sourceId).phone, row().phone);
  assert.equal(contactEntries(w.db)[0][1].status, 'deleted');
});

test('não promove legado por nome; falha de upgrade preserva válido; captura vinculada faz transição', async () => {
  const w = backend();
  const legacy = row({ patientSourceId: undefined, contactPatientSourceId: undefined });
  const legacyPath = (await w.agendaCollection(ORG)) + '/synthetic-legacy-document';
  w.db.documents.set(legacyPath, { ...w.normalizeRecord(legacy), _updateTime: 'synthetic-legacy-version' });
  assert.equal((await w.list())[0].phone, row().phone);
  assert.equal(w.db.documents.get(legacyPath).phone, row().phone);
  await w.sync([row({ phone: '' })]);
  assert.equal(contactEntries(w.db).length, 0);
  assert.equal((await w.list())[0].phone, row().phone);
  assert.equal(w.db.documents.get(legacyPath).phone, row().phone);
  await w.sync([row()]);
  assert.equal(contactEntries(w.db).length, 1);
  assert.equal((await w.list())[0].phone, row().phone);
  const expired = backend();
  expired.db.documents.set(legacyPath, { ...expired.normalizeRecord(legacy), _updateTime: 'synthetic-legacy-version' });
  const stored = [...expired.db.documents.values()][0];
  stored.contactVerifiedAt = '2020-01-01T00:00:00.000Z';
  await expired.sync([row({ phone: '' })]);
  assert.equal([...expired.db.documents.values()][0].phone, row().phone);
  assert.equal((await expired.list())[0].phone, row().phone); // Confirmed proof is durable; missing proof below is still refused.
  const unverifiedStored = [...expired.db.documents.values()][0];
  unverifiedStored.contactVersion = '';
  unverifiedStored.contactVerifiedAt = '';
  await expired.sync([row({ phone: '' })]);
  assert.equal([...expired.db.documents.values()][0].phone, row().phone);
  assert.equal((await expired.list())[0].phone, '');
});

test('legado v2 continua disponível no vínculo original após recarga e snapshots sem mapeamento global', async () => {
  const w = backend();
  const legacy = row({ patientSourceId: '', contactPatientSourceId: '' });
  assert.equal((await w.sync([legacy])).status, 200);
  assert.equal((await w.list())[0].phone, legacy.phone);
  assert.equal(contactEntries(w.db).length, 0);
  const reloaded = backend(storage(JSON.parse(JSON.stringify([...w.db.documents]))));
  assert.equal((await reloaded.list())[0].phone, legacy.phone);
  assert.deepEqual((await reloaded.request('/contact-state')).body.knownSourceIds, [legacy.sourceId]);
  for (const phone of ['', undefined, 'CPF 11990000001']) {
    await reloaded.sync([{ ...legacy, phone }]);
    assert.equal((await reloaded.list())[0].phone, legacy.phone);
  }
  // An unconfirmed proposed patient ID neither blocks the old consultation nor seeds a new patient entry.
  assert.deepEqual((await reloaded.lookup([{ ...legacy, patientSourceId: 'synthetic-proposed-patient' }])).body.knownSourceIds, [legacy.sourceId]);
  assert.deepEqual((await reloaded.lookup([{ ...legacy, sourceId: 'synthetic-other-consultation' }])).body.knownSourceIds, []);
  assert.deepEqual((await reloaded.lookup([{ ...legacy, patient: 'Outro nome sintético' }])).body.knownSourceIds, []);
  assert.deepEqual((await reloaded.lookup([{ ...legacy, requestedAt: '2027-01-01' }])).body.knownSourceIds, []);
  await reloaded.sync([], ORG, true);
  await reloaded.sync([{ ...legacy, phone: '', contactVersion: undefined }]);
  assert.equal((await reloaded.list())[0].phone, legacy.phone);
  assert.equal(contactEntries(reloaded.db).length, 0);
  for (const [changes, expected] of [
    [{ contactVersion: '' }, ''], [{ contactSourceId: 'synthetic-other-source' }, ''],
    [{ contactPatient: 'Outro nome sintético' }, ''], [{ contactRequestedAt: '2020-01-01' }, ''],
    [{ contactVerifiedAt: 'invalid' }, ''],
    [{ contactVerifiedAt: new Date(Date.now() + 3600000).toISOString() }, '']]) {
    const isolated = backend(storage(JSON.parse(JSON.stringify([...reloaded.db.documents]))));
    Object.assign([...isolated.db.documents.values()][0], changes);
    assert.equal((await isolated.list())[0].phone, expected);
  }
});

test('consulta confirmada não expira após 24h, outra sessão e saída/retorno; consulta desconhecida continua ausente', async () => {
  const w = backend(storage(), false);
  const legacy = row({ patientSourceId: '', contactPatientSourceId: '' });
  await w.sync([legacy]);
  const stored = [...w.db.documents.values()][0];
  stored.contactVerifiedAt = '2020-01-01T00:00:00.000Z';
  const revision = stored.contactRevision;
  const reloaded = backend(storage(JSON.parse(JSON.stringify([...w.db.documents]))), false);
  reloaded.context.user = { username: 'synthetic-new-session', role: 'admin' };
  assert.equal((await reloaded.list())[0].phone, legacy.phone);
  assert.deepEqual((await reloaded.lookup([legacy])).body.knownSourceIds, [legacy.sourceId]);
  const unknown = { ...legacy, sourceId: 'synthetic-new-consultation' };
  assert.deepEqual((await reloaded.lookup([unknown])).body.knownSourceIds, []);
  await reloaded.sync([{ ...legacy, phone: '5521990000002' }]); // stale/automatic capture is not correction
  await reloaded.sync([{ ...legacy, phone: '' }]);
  await reloaded.sync([], ORG, true);
  assert.equal([...reloaded.db.documents.values()][0].phone, legacy.phone);
  await reloaded.sync([{ ...legacy, phone: undefined, contactVersion: undefined }]);
  assert.equal((await reloaded.list())[0].phone, legacy.phone);
  assert.deepEqual((await reloaded.request('/contact-state')).body.knownSourceIds, [legacy.sourceId]);
  const persisted = [...reloaded.db.documents.values()][0];
  assert.equal(persisted.contactVerifiedAt, '2020-01-01T00:00:00.000Z');
  assert.equal(persisted.contactRevision, revision);
  assert.equal(contactEntries(reloaded.db).length, 0); // no patient association/migration
});

test('correção/exclusão por consulta são explícitas, versionadas e resistem a replay, recarga e snapshot vazio', async () => {
  const w = backend(storage(), false);
  const legacy = row({ patientSourceId: '', contactPatientSourceId: '' });
  await w.sync([legacy]);
  const oldStored = [...w.db.documents.values()][0];
  delete oldStored.contactRevision; // pre-candidate row: no schema/backfill is required
  oldStored.contactVerifiedAt = '2020-01-01T00:00:00.000Z';
  const revise = (action, expectedRevision, phone, env = ORG) => w.request('/contact', {
    sourceId: legacy.sourceId, action, expectedRevision, phone }, env);
  const initial = (await w.list())[0].contactRevision;
  assert.equal(initial, '2020-01-01T00:00:00.000Z');
  assert.equal((await w.request('/contact', { sourceId: ' ' + legacy.sourceId, action: 'delete', expectedRevision: initial })).status, 400);
  assert.equal((await revise('correct', initial, '')).status, 400);
  assert.equal((await revise('delete', initial, undefined, { AGENDA_ORGANIZATION_ID: 'synthetic-b' })).status, 404);
  assert.equal((await w.request('/contact', { sourceId: legacy.sourceId, patientSourceId: 'synthetic-other',
    action: 'delete', expectedRevision: initial })).status, 400);
  const corrected = await revise('correct', initial, '5521990000002');
  assert.equal(corrected.status, 200);
  await w.sync([legacy]);
  assert.equal((await w.list())[0].phone, '5521990000002');
  assert.equal((await revise('delete', initial)).status, 409);
  const deleted = await revise('delete', corrected.body.revision);
  assert.equal(deleted.status, 200);
  await w.sync([legacy]);
  await w.sync([{ ...legacy, patientSourceId: 'synthetic-proposed-patient', contactPatientSourceId: 'synthetic-proposed-patient' }]);
  await w.sync([], ORG, true);
  await w.sync([legacy]);
  const reloaded = backend(storage(JSON.parse(JSON.stringify([...w.db.documents]))), false);
  assert.equal((await reloaded.list())[0].phone, '');
  assert.equal((await reloaded.list())[0].contactBlocked, true);
  assert.equal([...reloaded.db.documents.values()][0].contactProvenance, 'authorized-correction');
  assert.ok([...reloaded.db.documents.values()][0].contactVerifiedAt);
  assert.deepEqual((await reloaded.lookup([legacy])).body.blockedSourceIds, [legacy.sourceId]);
  assert.equal(contactEntries(reloaded.db).length, 0);
  const restored = await reloaded.request('/contact', { sourceId: legacy.sourceId, action: 'correct',
    expectedRevision: (await reloaded.list())[0].contactRevision, phone: legacy.phone });
  assert.equal(restored.status, 200);
  assert.equal((await reloaded.list())[0].phone, legacy.phone);
  reloaded.context.user = null;
  assert.equal((await reloaded.request('/contact', { sourceId: legacy.sourceId, action: 'delete',
    expectedRevision: restored.body.revision })).status, 401);
});

test('correção ou exclusão concorrente vence snapshot obsoleto da consulta', async () => {
  for (const action of ['correct', 'delete']) {
    const w = backend(storage(), false);
    const legacy = row({ patientSourceId: '', contactPatientSourceId: '' });
    await w.sync([legacy]);
    const revision = (await w.list())[0].contactRevision;
    let mutated = false;
    w.db.beforeCommit = async writes => {
      if (mutated || !writes.some(write => write.documentPath.includes('/records/'))) return;
      mutated = true;
      assert.equal((await w.request('/contact', { sourceId: legacy.sourceId, action,
        expectedRevision: revision, phone: '5521990000002' })).status, 200);
    };
    assert.equal((await w.sync([legacy])).status, 200);
    assert.ok(mutated && w.db.conflicts > 0);
    assert.equal((await w.list())[0].phone, action === 'delete' ? '' : '5521990000002');
  }
});

test('duas correções da consulta com mesma revisão têm somente um vencedor', async () => {
  const w = backend(storage(), false);
  const legacy = row({ patientSourceId: '', contactPatientSourceId: '' });
  await w.sync([legacy]);
  const expectedRevision = (await w.list())[0].contactRevision;
  const results = await Promise.all(['5521990000002', '5531990000003'].map(phone => w.request('/contact', {
    sourceId: legacy.sourceId, action: 'correct', phone, expectedRevision })));
  assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
});

test('build publicado bloqueia reuso por paciente na API mesmo com payload/configuração propondo ativação', async () => {
  assert.match(source, /const PATIENT_DIRECTORY_ENABLED = false;/);
  const prepared = backend();
  await prepared.sync([row()]);
  const w = backend(prepared.db, false);
  const changes = w.db.history.length;
  w.db.reads.length = 0;
  assert.equal((await w.list())[0].phone, '');
  const next = row({ sourceId: 'synthetic-new-patient-appointment' });
  assert.deepEqual((await w.lookup([next])).body.knownSourceIds, []);
  assert.equal((await w.sync([next], { ...ORG, PATIENT_DIRECTORY_ENABLED: true })).status, 409);
  assert.equal((await w.request('/contact', { patientSourceId: row().patientSourceId,
    action: 'correct', expectedRevision: 'synthetic', phone: row().phone })).status, 409);
  assert.ok(w.db.reads.every(path => !path.includes('/contacts/')));
  assert.equal(w.db.history.length, changes);
});

test('ID ausente/inválido ou vínculo de coleta divergente não cria diretório e conflito não escolhe telefone arbitrário', async () => {
  const w = backend();
  for (const invalid of ['', '../patient', 'a'.repeat(81), 12]) {
    await w.sync([row({ patientSourceId: invalid })]);
  }
  await w.sync([row({ contactPatientSourceId: 'synthetic-other-patient' })]);
  assert.equal(contactEntries(w.db).length, 0);
  assert.equal((await w.list())[0].phone, row().phone);
  const result = await w.sync([row(), row({ sourceId: 'synthetic-b', contactSourceId: 'synthetic-b', phone: '5521990000002' })]);
  assert.equal(result.status, 400);
  assert.equal(contactEntries(w.db).length, 0);
});

test('falha de leitura em lote não é ausência e não expõe dados; agenda paginada falha fechada', async () => {
  const w = backend();
  w.db.batchOverride = () => { throw Error('Synthetic incomplete read'); };
  const result = await w.sync([row()]);
  assert.equal(result.status, 503);
  assert.equal(contactEntries(w.db).length, 0);
  assert.deepEqual(result.body, { error: 'Falha ao sincronizar a Agenda.' });
  assert.equal((await w.sync([row({ patientSourceId: undefined, contactPatientSourceId: undefined })])).status, 200);
  assert.deepEqual((await w.lookup([row({ patientSourceId: undefined, sourceId: 'synthetic-unpersisted',
    contactSourceId: 'synthetic-unpersisted' })])).body.knownSourceIds, []);
  w.db.listOverride = () => ({ documents: [], nextPageToken: 'synthetic-next' });
  assert.equal((await w.request('/contact-state')).status, 503);
});

test('gateway transmite precondição CAS sem alterar chamadas legadas e metadados são opt-in', async () => {
  const sent = [];
  const context = { URLSearchParams, Response,
    fetch: async (_url, options) => { sent.push(JSON.parse(options.body)); return new Response('{}'); } };
  vm.runInNewContext(read('worker/firebase-gateway.js').replace(/export /g, '') + `
    googleAccessToken = async () => 'synthetic-no-network';
    firestoreRequest = async () => ({name:'synthetic/doc',fields:{phone:{stringValue:'synthetic'}},
      updateTime:'synthetic-version',documents:[{name:'synthetic/doc',fields:{},updateTime:'synthetic-version'}]});
    globalThis.api={firestoreCommit,firestoreGet,firestoreList};`, context);
  await context.api.firestoreCommit({ FIREBASE_PROJECT_ID: 'synthetic-project' }, [
    { documentPath: 'synthetic/a', data: { status: 'active' }, currentDocument: { exists: false } },
    { documentPath: 'synthetic/b', data: { status: 'deleted' }, currentDocument: { updateTime: 'synthetic-version' } },
    { documentPath: 'synthetic/c', data: { status: 'legacy' } }]);
  assert.deepEqual(sent[0].writes[0].currentDocument, { exists: false });
  assert.deepEqual(sent[0].writes[1].currentDocument, { updateTime: 'synthetic-version' });
  assert.equal(sent[0].writes[2].currentDocument, undefined);
  assert.equal((await context.api.firestoreGet({}, 'synthetic/a'))._updateTime, undefined);
  assert.equal((await context.api.firestoreGet({}, 'synthetic/a', { withMetadata: true }))._updateTime, 'synthetic-version');
  assert.equal((await context.api.firestoreList({}, 'synthetic', { withMetadata: true })).documents[0]._updateTime, 'synthetic-version');
  context.fetch = async () => new Response(JSON.stringify({ error: { status: 'FAILED_PRECONDITION', message: 'Synthetic conflict' } }), { status: 400 });
  await assert.rejects(() => context.api.firestoreCommit({ FIREBASE_PROJECT_ID: 'synthetic' }, [
    { documentPath: 'synthetic/a', data: {} }]), error => error.status === 400 && error.code === 'FAILED_PRECONDITION');
});

test('batchGet é limitado, deduplicado e confere respostas fora de ordem, ausências explícitas e resposta incompleta', async () => {
  const sent = [];
  let response;
  const context = { Response, fetch: async (_url, options) => {
    sent.push(JSON.parse(options.body)); return response;
  } };
  vm.runInNewContext(read('worker/firebase-gateway.js').replace(/export /g, '') + `
    googleAccessToken=async()=>'synthetic-no-network';globalThis.api={firestoreBatchGet};`, context);
  const prefix = 'projects/synthetic/databases/(default)/documents/';
  response = new Response(JSON.stringify([{ missing: prefix + 'synthetic/b' },
    { found: { name: prefix + 'synthetic/a', fields: { status: { stringValue: 'active' } } } }]));
  const documents = await context.api.firestoreBatchGet({ FIREBASE_PROJECT_ID: 'synthetic' }, ['synthetic/a', 'synthetic/b', 'synthetic/a']);
  assert.equal(documents.length, 1);
  assert.equal(documents[0].status, 'active');
  assert.equal(sent[0].documents.length, 2);
  for (const payload of [[], {}, [{ missing: prefix + 'synthetic/b' }], [{ missing: prefix + 'unrequested/a' }]]) {
    response = new Response(JSON.stringify(payload));
    await assert.rejects(() => context.api.firestoreBatchGet({ FIREBASE_PROJECT_ID: 'synthetic' }, ['synthetic/a']));
  }
  assert.equal((await context.api.firestoreBatchGet({}, [])).length, 0);
  await assert.rejects(() => context.api.firestoreBatchGet({}, Array.from({ length: 251 }, (_, i) => 'synthetic/' + i)));
});

test('ponte real consulta snapshot atual e coletor só visita desconhecidos, respeitando exclusão', { timeout: 5000 }, async () => {
  const w = backend();
  await w.sync([row()]);
  const agedLegacy = row({ sourceId: 'synthetic-known-legacy', contactSourceId: 'synthetic-known-legacy',
    patientSourceId: '', contactPatientSourceId: '' });
  await w.sync([agedLegacy]);
  [...w.db.documents.values()].find(record => record.sourceId === agedLegacy.sourceId).contactVerifiedAt = '2020-01-01T00:00:00.000Z';
  const deletedRow = row({ sourceId: 'synthetic-deleted-appointment', contactSourceId: 'synthetic-deleted-appointment',
    patientSourceId: 'synthetic-deleted-patient', contactPatientSourceId: 'synthetic-deleted-patient' });
  await w.sync([deletedRow]);
  await w.request('/contact', { action: 'delete', patientSourceId: deletedRow.patientSourceId,
    expectedRevision: (await w.list()).find(item => item.sourceId === deletedRow.sourceId).contactRevision });
  const snapshot = { records: [row({ sourceId: 'synthetic-new-appointment' }), deletedRow,
    row({ sourceId: 'synthetic-unknown', patientSourceId: 'synthetic-unknown-patient' }),
    row({ sourceId: 'synthetic-homonym', patientSourceId: 'synthetic-homonym-patient' }),
    row({ sourceId: 'synthetic-same-unknown-patient', patientSourceId: 'synthetic-unknown-patient' }),
    row({ sourceId: 'synthetic-unidentified', patientSourceId: '' }), agedLegacy] };
  let receiveBridge;
  const listeners = new Map(), visited = [], posted = [], replies = [];
  const frame = { closed: false, postMessage: message => { posted.push(message); return receiveBridge({
    origin: 'https://teleatendimento.saude.ms.gov.br', source: opener, data: message }); } };
  const window = { location: new URL('https://source.test/synthetic/consultas'),
    addEventListener: (name, callback) => listeners.set(name, callback),
    setTimeout, clearTimeout, setInterval, clearInterval };
  const context = { window, document: { getElementById: () => null, addEventListener() {} },
    URL, Date, Map, Set, visited };
  const producer = read('agenda/digsaude-agenda-sync.user.js');
  vm.runInNewContext(producer.slice(0, producer.indexOf('  function mountWidget()')) + `
    globalThis.api={lookupSnapshotContacts,enrichSnapshotContacts,patientSourceIdFor,
      prepare(frame,enabled=false){portalWindow=frame;autoEnabled=enabled;},
      pending:()=>Boolean(contactLookup),pause:pauseAutomatic};
    extractContactWithRetry=async(record)=>{visited.push(record.sourceId);return '5531990000003';};
  })();`, context);
  context.api.prepare(frame);
  const opener = { closed: false, postMessage: message => {
    replies.push(message); listeners.get('message')({ origin: 'https://regulacaoeldoradoms.com.br', source: frame, data: message }); } };
  await vm.runInNewContext(read('js/agenda-sync-bridge.js'), {
    Date, document: { getElementById: () => ({ textContent: '', hidden: true }) },
    window: { opener, addEventListener: (_name, callback) => { receiveBridge = callback; },
      RegulationAuth: { requireRole: async () => ({ role: 'admin' }),
        api: async (path, options) => {
          const response = await w.request(path.slice('/api/agenda'.length), options?.body ? JSON.parse(options.body) : undefined);
          if (response.status !== 200) throw Error('Synthetic API error');
          return response.body;
        } } } });
  context.api.prepare(frame, true);
  // READY would normally start the timer; tests invoke the exact lookup/enrichment functions directly.
  await context.api.lookupSnapshotContacts(snapshot);
  const result = await context.api.enrichSnapshotContacts(snapshot);
  assert.equal(result.requested, 4);
  assert.deepEqual(visited, ['synthetic-unknown', 'synthetic-homonym', 'synthetic-unidentified']);
  assert.equal(snapshot.records.find(item => item.sourceId === 'synthetic-same-unknown-patient').phone, '5531990000003');
  assert.equal(context.api.pending(), false);
  const lookupReply = replies.find(item => item.type === 'PORTAL_AGENDA_DIGSAUDE_CONTACT_STATE');
  assert.equal(lookupReply.contactDirectoryCapability, DIRECTORY);
  assert.ok(!JSON.stringify(lookupReply).includes(row().phone));
  const links = paths => ({ querySelectorAll: () => paths.map(path => ({ getAttribute: () => path })) });
  assert.equal(context.api.patientSourceIdFor(links(['/synthetic/pacientes/synthetic-patient-a/view'])), '');
  assert.equal(context.api.patientSourceIdFor(links(['/synthetic/pacientes/synthetic-patient-a/view']), 'patient-resource-link-v1'), 'synthetic-patient-a');
  for (const paths of [[], ['/synthetic/consultas/synthetic-patient-a/view'],
    ['https://untrusted.test/synthetic/pacientes/synthetic-patient-a/view'],
    ['/another/pacientes/synthetic-patient-a/view'],
    ['/synthetic/pacientes/a/view', '/synthetic/pacientes/b/view']]) {
    assert.equal(context.api.patientSourceIdFor(links(paths), 'patient-resource-link-v1'), '');
  }
  let finish;
  w.db.batchOverride = () => new Promise(resolve => { finish = resolve; });
  const pending = context.api.lookupSnapshotContacts(snapshot);
  while (!finish) await new Promise(resolve => setImmediate(resolve));
  context.api.pause();
  await assert.rejects(pending, /pausada/);
  assert.equal(context.api.pending(), false);
  finish([]); // A late reply from the cancelled lookup is ignored.
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(context.api.pending(), false);
  frame.postMessage = () => { throw Error('Synthetic closed window'); };
  await assert.rejects(context.api.lookupSnapshotContacts(snapshot), /closed window/);
  assert.equal(context.api.pending(), false);
});
