'use strict';

import { validatePortalSession } from './auth-management-v2.js';
import {
  firebaseConfigured,
  firestoreBatchGet,
  firestoreCommit,
  firestoreGet,
  firestoreList
} from './firebase-gateway.js';
import { telemedicineAccessFor, ensureTelemedicineUnderlyingRole } from './telemedicine-access.js';

const CONTACT_VERSION = 'patient-details-v2';
const CONTACT_TTL_MS = 24 * 60 * 60 * 1000;
const CONTACT_DIRECTORY_VERSION = 'patient-directory-v1';
const PORTAL_ORGANIZATION = 'eldorado-ms';

const COLLECTION = 'telemedicine_digsaude_agenda';
const READ_STATE_COLLECTION = 'telemedicine_digsaude_agenda_read_state';
const MAX_RECORDS_PER_SYNC = 250;
const MAX_LIST_PAGES = 20;
const FIRESTORE_COMMIT_CHUNK = 450;

function responseHeaders(origin, allowed = true) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return headers;
}

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(origin, allowed) });
}

function clean(value, max = 160) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanSourceId(value) {
  const sourceId = clean(value, 80);
  return /^[A-Za-z0-9_-]{1,80}$/.test(sourceId) ? sourceId : '';
}

function patientSourceId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(value) ? value : '';
}

function organizationId(env) {
  // Deployment-owned scope; neither payload nor query string can select another organization.
  const value = env.AGENDA_ORGANIZATION_ID ?? PORTAL_ORGANIZATION;
  if (typeof value !== 'string' || !/^[a-z0-9_-]{1,80}$/.test(value)) {
    throw Object.assign(new Error('Organização da Agenda indisponível.'), { status: 503 });
  }
  return value;
}

async function agendaCollection(env) {
  const org = organizationId(env);
  // Preserve this portal's existing appointments. Other deployments never read the legacy namespace.
  return org === PORTAL_ORGANIZATION ? COLLECTION
    : `${COLLECTION}_organizations/${await digestId('organization:' + org)}/records`;
}

async function contactCollection(env) {
  return `${COLLECTION}_organizations/${await digestId('organization:' + organizationId(env))}/contacts`;
}

function conflict(error) {
  return [409, 412].includes(Number(error?.status))
    || ['FAILED_PRECONDITION', 'ALREADY_EXISTS', 'ABORTED'].includes(error?.code);
}

function normalizeBrazilPhone(value) {
  const source = String(value ?? '').trim();
  if (!/^\+?[\d\s().-]+$/.test(source)) return '';
  let digits = source.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10 || digits.length === 11) digits = '55' + digits;
  const match = digits.match(/^55(\d{2})([2-5]\d{7}|9\d{8})$/);
  const ddds = /^(?:1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])$/;
  return match && ddds.test(match[1]) ? digits : '';
}


function normalizeRecord(input = {}) {
  const sourceId = cleanSourceId(input.sourceId);
  if (!sourceId) throw Object.assign(new Error('Identificador do agendamento inválido.'), { status: 400 });
  const contactChecked = input.contactVersion === CONTACT_VERSION
    && cleanSourceId(input.contactSourceId) === sourceId;
  return {
    sourceId,
    patientSourceId: patientSourceId(input.patientSourceId),
    requestedAt: clean(input.requestedAt, 40),
    specialty: clean(input.specialty, 120),
    returnStatus: clean(input.returnStatus, 20),
    devolucaoStatus: clean(input.devolucaoStatus, 20),
    classification: clean(input.classification, 500),
    appointmentDate: clean(input.appointmentDate, 20),
    appointmentTime: clean(input.appointmentTime, 12),
    specialist: clean(input.specialist, 180),
    patient: clean(input.patient, 180),
    municipality: clean(input.municipality, 120),
    appointmentType: clean(input.appointmentType, 120),
    facility: clean(input.facility, 180),
    status: clean(input.status, 120),
    phone: contactChecked
      ? normalizeBrazilPhone(input.phone) : '',
    contactVersion: contactChecked
      ? CONTACT_VERSION : '',
    contactSourceId: sourceId,
    contactPatientSourceId: contactChecked ? patientSourceId(input.contactPatientSourceId) : '',
    contactPatient: clean(input.patient, 180),
    contactRequestedAt: clean(input.requestedAt, 40),
    contactVerifiedAt: contactChecked
      ? new Date().toISOString() : ''
  };
}

function verifiedContactPhone(record, now = Date.now()) {
  if (record?.contactVersion === CONTACT_DIRECTORY_VERSION) {
    return record.active !== false && patientSourceId(record.patientSourceId)
      && record.contactPatientSourceId === record.patientSourceId
      ? normalizeBrazilPhone(record.phone) : '';
  }
  const age = now - Date.parse(record?.contactVerifiedAt || '');
  if (record?.contactVersion !== CONTACT_VERSION
    || record.contactSourceId !== record.sourceId
    || record.contactPatient !== record.patient
    || record.contactRequestedAt !== record.requestedAt
    || !Number.isFinite(age) || age < 0 || age >= CONTACT_TTL_MS) return '';
  return normalizeBrazilPhone(record.phone);
}

function contactForSync(record, existing) {
  // Collection failures are not authorized erasure. Association checks still apply.
  if (record.contactVersion === CONTACT_VERSION && record.phone) return record;
  const savedPhone = existing && normalizeBrazilPhone(existing.phone);
  if (existing && record.patient === existing.patient
    && record.requestedAt === existing.requestedAt && savedPhone) {
    return {
      ...record,
      phone: savedPhone,
      // Keep the original proof, including absent/expired/invalid proof. Retention is not permission to use.
      contactVersion: existing.contactVersion === CONTACT_VERSION ? CONTACT_VERSION : '',
      contactVerifiedAt: existing.contactVerifiedAt || '',
      contactSourceId: existing.contactSourceId || '',
      contactPatient: existing.contactPatient || '',
      contactRequestedAt: existing.contactRequestedAt || '',
      contactPatientSourceId: existing.contactPatientSourceId || ''
    };
  }
  return { ...record, phone: '', contactVersion: '', contactVerifiedAt: '' };
}

function comparable(record = {}) {
  return JSON.stringify({
    requestedAt: record.requestedAt || '',
    specialty: record.specialty || '',
    returnStatus: record.returnStatus || '',
    devolucaoStatus: record.devolucaoStatus || '',
    classification: record.classification || '',
    appointmentDate: record.appointmentDate || '',
    appointmentTime: record.appointmentTime || '',
    specialist: record.specialist || '',
    patient: record.patient || '',
    patientSourceId: record.patientSourceId || '',
    municipality: record.municipality || '',
    appointmentType: record.appointmentType || '',
    facility: record.facility || '',
    status: record.status || ''
  });
}

function parseBody(request) {
  return request.json().catch(() => {
    throw Object.assign(new Error('Corpo JSON inválido.'), { status: 400 });
  });
}

async function digestId(value) {
  const bytes = new TextEncoder().encode(`digsaude-agenda:${value}`);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 40);
}

async function listCollection(env, collectionPath) {
  const output = [];
  let pageToken = '';
  let guard = 0;
  do {
    const page = await firestoreList(env, collectionPath, { pageSize: 100, pageToken, withMetadata: true });
    output.push(...(page.documents || []));
    pageToken = page.nextPageToken || '';
    guard += 1;
  } while (pageToken && guard < MAX_LIST_PAGES);
  if (pageToken) throw Object.assign(new Error('A leitura da Agenda excedeu o limite seguro.'), { status: 503 });
  return output;
}

async function listAll(env) {
  return listCollection(env, await agendaCollection(env));
}

async function directory(env, appointments) {
  const ids = [...new Set(appointments.map(item => patientSourceId(item.patientSourceId)).filter(Boolean))];
  const collection = await contactCollection(env);
  const records = [];
  for (let index = 0; index < ids.length; index += MAX_RECORDS_PER_SYNC) {
    const paths = await Promise.all(ids.slice(index, index + MAX_RECORDS_PER_SYNC)
      .map(async id => `${collection}/${await digestId('patient:' + id)}`));
    try {
      records.push(...await firestoreBatchGet(env, paths));
    } catch (_) {
      throw Object.assign(new Error('Não foi possível consultar contatos.'), { status: 503 });
    }
  }
  return new Map(records.filter(item => item.organizationId === organizationId(env)
    && patientSourceId(item.patientSourceId)).map(item => [item.patientSourceId, item]));
}

function directoryRecord(record, contacts) {
  const id = patientSourceId(record.patientSourceId);
  // Unbound legacy copies cannot be checked against patient-level corrections/deletions.
  if (!id) return { ...record, phone: '', contactVersion: '' };
  const contact = contacts.get(id);
  const valid = contact?.status === 'active' && contact.revision
    && [CONTACT_VERSION, 'authorized-correction'].includes(contact.provenance)
    && Number.isFinite(Date.parse(contact.verifiedAt));
  // A stable identity never falls back to a stale phone embedded in a snapshot.
  return { ...record, phone: valid ? normalizeBrazilPhone(contact.phone) : '',
    contactVersion: CONTACT_DIRECTORY_VERSION, contactPatientSourceId: id,
    contactRevision: contact?.revision || '', contactBlocked: contact?.status === 'deleted' };
}

async function collectMissingContacts(env, records) {
  const phones = new Map();
  for (const record of records) {
    if (!record.patientSourceId || !record.phone || record.contactPatientSourceId !== record.patientSourceId) continue;
    if (phones.has(record.patientSourceId) && phones.get(record.patientSourceId) !== record.phone) {
      throw Object.assign(new Error('Contatos conflitantes para o mesmo paciente.'), { status: 400 });
    }
    phones.set(record.patientSourceId, record.phone);
  }
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const contacts = await directory(env, records);
    const writes = [];
    for (const record of records) {
      const id = patientSourceId(record.patientSourceId);
      if (!id || contacts.has(id) || !record.phone || record.contactVersion !== CONTACT_VERSION
        || record.contactPatientSourceId !== id) continue;
      const data = { organizationId: organizationId(env), patientSourceId: id,
        phone: record.phone, status: 'active', revision: crypto.randomUUID(),
        verifiedAt: record.contactVerifiedAt, provenance: CONTACT_VERSION };
      // Insert only: retries, stale snapshots and concurrent sessions cannot undo corrections/deletions.
      contacts.set(id, data);
      writes.push({ documentPath: `${await contactCollection(env)}/${await digestId('patient:' + id)}`,
        data, currentDocument: { exists: false } });
    }
    try {
      await commitWrites(env, writes);
      return;
    } catch (error) {
      if (!conflict(error) || attempt === 2) throw error;
    }
  }
}

async function updateContact(env, payload) {
  const id = patientSourceId(payload?.patientSourceId);
  const action = payload?.action;
  const phone = normalizeBrazilPhone(payload?.phone);
  if (!id || !['correct', 'delete'].includes(action) || (action === 'correct' && !phone)) {
    throw Object.assign(new Error('Correção de contato inválida.'), { status: 400 });
  }
  const documentPath = `${await contactCollection(env)}/${await digestId('patient:' + id)}`;
  const existing = await firestoreGet(env, documentPath, { withMetadata: true });
  if (!existing || existing.organizationId !== organizationId(env)) {
    throw Object.assign(new Error('Contato não encontrado.'), { status: 404 });
  }
  if (!existing._updateTime || !payload.expectedRevision || payload.expectedRevision !== existing.revision) {
    throw Object.assign(new Error('O contato mudou. Recarregue antes de corrigir.'), { status: 409 });
  }
  const data = { organizationId: organizationId(env), patientSourceId: id,
    phone: action === 'delete' ? '' : phone, status: action === 'delete' ? 'deleted' : 'active',
    revision: crypto.randomUUID(), verifiedAt: new Date().toISOString(), provenance: 'authorized-correction' };
  try {
    await firestoreCommit(env, [{ documentPath, data, currentDocument: { updateTime: existing._updateTime } }]);
  } catch (error) {
    if (conflict(error)) throw Object.assign(new Error('O contato mudou. Recarregue antes de corrigir.'), { status: 409 });
    throw error;
  }
  return { revision: data.revision, status: data.status };
}

async function readUserKey(username) {
  const bytes = new TextEncoder().encode(`digsaude-agenda-read-user:${clean(username, 80)}`);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 40);
}

async function readReceiptCollection(username, env = {}) {
  const org = organizationId(env);
  const key = org === PORTAL_ORGANIZATION ? await readUserKey(username)
    : await digestId('read-user:' + JSON.stringify([org, clean(username, 80)]));
  return `${READ_STATE_COLLECTION}/${key}/records`;
}

async function listReadMemory(env, username) {
  const collectionPath = await readReceiptCollection(username, env);
  const receipts = await listCollection(env, collectionPath);
  const memory = new Map();
  for (const receipt of receipts) {
    const sourceId = cleanSourceId(receipt.sourceId);
    const readAt = clean(receipt.readAt, 40);
    if (!sourceId || !readAt) continue;
    const previous = memory.get(sourceId) || '';
    if (readAt > previous) memory.set(sourceId, readAt);
  }
  return { collectionPath, memory };
}

async function authorizedUser(request, env) {
  const user = await validatePortalSession(request, env, []);
  if (!user) {
    return {
      authorizationDenied: true,
      status: 401,
      error: 'Sessão inválida ou expirada. Entre novamente.'
    };
  }
  if (user.role === 'admin') return { ...user, agendaAdmin: true };
  if (!(await telemedicineAccessFor(env, user.username))) {
    return {
      authorizationDenied: true,
      status: 403,
      error: 'Acesso exclusivo da Telemedicina ou do Desenvolvedor.'
    };
  }
  if (user.role !== 'recepcao') await ensureTelemedicineUnderlyingRole(env, user.username);
  return { ...user, role: 'recepcao', agendaAdmin: false };
}

function readAtFor(record, username) {
  const readBy = record?.readBy && typeof record.readBy === 'object' ? record.readBy : {};
  return clean(readBy[username], 40);
}

function effectiveReadAt(record, username, readMemory) {
  const embedded = readAtFor(record, username);
  const dedicated = clean(readMemory?.get(cleanSourceId(record?.sourceId)), 40);
  return dedicated > embedded ? dedicated : embedded;
}

function isUnreadFor(record, readAt) {
  if (record?.active === false) return false;
  const changedAt = clean(record?.lastChangedAt || record?.firstSeenAt, 40);
  return !readAt || (changedAt && readAt < changedAt);
}

function publicRecord(record, username, readMemory) {
  const readAt = effectiveReadAt(record, username, readMemory);
  return {
    sourceId: cleanSourceId(record.sourceId),
    patientSourceId: patientSourceId(record.patientSourceId),
    contactRevision: record.contactRevision || '',
    contactBlocked: record.contactBlocked === true,
    requestedAt: clean(record.requestedAt, 40),
    specialty: clean(record.specialty, 120),
    returnStatus: clean(record.returnStatus, 20),
    devolucaoStatus: clean(record.devolucaoStatus, 20),
    classification: clean(record.classification, 500),
    appointmentDate: clean(record.appointmentDate, 20),
    appointmentTime: clean(record.appointmentTime, 12),
    specialist: clean(record.specialist, 180),
    patient: clean(record.patient, 180),
    municipality: clean(record.municipality, 120),
    appointmentType: clean(record.appointmentType, 120),
    facility: clean(record.facility, 180),
    status: clean(record.status, 120),
    phone: verifiedContactPhone(record),
    firstSeenAt: clean(record.firstSeenAt, 40),
    lastSeenAt: clean(record.lastSeenAt, 40),
    lastChangedAt: clean(record.lastChangedAt, 40),
    removedAt: clean(record.removedAt, 40),
    active: record.active !== false,
    readAt,
    unread: isUnreadFor(record, readAt)
  };
}

function contactState(records = []) {
  const active = [];
  const knownSourceIds = [];
  const blockedSourceIds = [];
  for (const record of records) {
    if (record?.active === false) continue;
    const sourceId = cleanSourceId(record?.sourceId);
    if (!sourceId) continue;
    active.push(sourceId);
    if (verifiedContactPhone(record)) knownSourceIds.push(sourceId);
    if (record.contactBlocked) blockedSourceIds.push(sourceId);
  }
  return {
    contactCapability: CONTACT_DIRECTORY_VERSION,
    contactDirectoryCapability: CONTACT_DIRECTORY_VERSION,
    active: active.length,
    known: knownSourceIds.length,
    missing: Math.max(0, active.length - knownSourceIds.length),
    knownSourceIds,
    blockedSourceIds
  };
}

function agendaSort(a, b) {
  if (a.active !== b.active) return a.active ? -1 : 1;
  const left = `${a.appointmentDate || '9999-99-99'} ${a.appointmentTime || '99:99'}`;
  const right = `${b.appointmentDate || '9999-99-99'} ${b.appointmentTime || '99:99'}`;
  if (left !== right) return left.localeCompare(right);
  return String(b.lastChangedAt || '').localeCompare(String(a.lastChangedAt || ''));
}

async function commitWrites(env, writes) {
  for (let index = 0; index < writes.length; index += FIRESTORE_COMMIT_CHUNK) {
    await firestoreCommit(env, writes.slice(index, index + FIRESTORE_COMMIT_CHUNK));
  }
}

async function syncRecords(env, input, user, attempt = 0) {
  const rows = Array.isArray(input?.records) ? input.records : [];
  const declaredComplete = input?.complete === true;
  const expectedTotal = Math.max(0, Number.parseInt(String(input?.totalCount ?? ''), 10) || 0);
  const verifiedEmptySnapshot = declaredComplete && expectedTotal === 0 && rows.length === 0;

  if (!rows.length && !verifiedEmptySnapshot) {
    throw Object.assign(new Error('Nenhum agendamento foi recebido.'), { status: 400 });
  }
  if (rows.length > MAX_RECORDS_PER_SYNC) throw Object.assign(new Error('Quantidade de agendamentos acima do limite de segurança.'), { status: 413 });

  const normalized = [];
  const seen = new Set();
  for (const item of rows) {
    const record = normalizeRecord(item);
    if (seen.has(record.sourceId)) continue;
    seen.add(record.sourceId);
    normalized.push(record);
  }

  const now = new Date().toISOString();
  const existingRecords = await listAll(env);
  const collectionPath = await agendaCollection(env);
  const existingBySourceId = new Map();
  for (const existing of existingRecords) {
    const sourceId = cleanSourceId(existing.sourceId);
    if (sourceId) existingBySourceId.set(sourceId, existing);
  }

  const writes = [];
  let created = 0;
  let changed = 0;
  let unchanged = 0;

  for (const record of normalized) {
    const documentId = await digestId(record.sourceId);
    const existing = existingBySourceId.get(record.sourceId) || null;
    // Older collectors must not drop a previously explicit patient association.
    if (!record.patientSourceId && existing?.patientSourceId && record.patient === existing.patient
      && record.requestedAt === existing.requestedAt) record.patientSourceId = existing.patientSourceId;
    if (!record.patientSourceId) {
      // A new unbound capture could bypass a patient's deletion marker under another appointment ID.
      record.phone = '';
      record.contactVersion = '';
      record.contactVerifiedAt = '';
    }
    if (record.patientSourceId && !existing?.patientSourceId && existing
      && record.patient === existing.patient && record.requestedAt === existing.requestedAt
      && normalizeBrazilPhone(existing.phone)
      && !(record.phone && record.contactPatientSourceId === record.patientSourceId)) {
      // A failed identity upgrade must neither erase nor promote an unbound legacy contact.
      record.patientSourceId = '';
    }

    if (!existing) {
      writes.push({
        documentPath: `${collectionPath}/${documentId}`,
        currentDocument: { exists: false },
        data: {
          ...record,
          firstSeenAt: now,
          lastSeenAt: now,
          lastChangedAt: now,
          active: true,
          removedAt: '',
          readBy: {},
          lastSyncedBy: clean(user.username, 80)
        }
      });
      created += 1;
      continue;
    }

    const didChange = comparable(existing) !== comparable(record);
    const stateChanged = didChange || existing.active === false;
    const { id: _existingId, _updateTime, ...existingData } = existing;
    writes.push({
      documentPath: `${collectionPath}/${existing.id || documentId}`,
      currentDocument: _updateTime ? { updateTime: _updateTime } : { exists: true },
      data: {
        ...existingData,
        ...contactForSync(record, existing),
        firstSeenAt: clean(existing.firstSeenAt, 40) || now,
        lastSeenAt: now,
        lastChangedAt: stateChanged ? now : (clean(existing.lastChangedAt, 40) || now),
        active: true,
        removedAt: '',
        readBy: existing.readBy && typeof existing.readBy === 'object' ? existing.readBy : {},
        lastSyncedBy: clean(user.username, 80)
      }
    });

    if (stateChanged) changed += 1;
    else unchanged += 1;
  }

  let deactivated = 0;
  const complete = declaredComplete && expectedTotal === normalized.length;

  if (complete) {
    for (const existing of existingRecords) {
      if (existing.active === false) continue;
      const sourceId = cleanSourceId(existing.sourceId);
      if (!sourceId || seen.has(sourceId)) continue;
      const { id: _existingId, _updateTime, ...existingData } = existing;
      writes.push({
        documentPath: `${collectionPath}/${existing.id}`,
        currentDocument: _updateTime ? { updateTime: _updateTime } : { exists: true },
        data: {
          ...existingData,
          active: false,
          removedAt: now,
          lastChangedAt: now,
          lastSeenAt: clean(existing.lastSeenAt, 40) || now,
          lastSyncedBy: clean(user.username, 80)
        }
      });
      deactivated += 1;
    }
  }

  // No durable phone is copied into mutable appointment snapshots.
  if (normalized.some(record => record.patientSourceId)) {
    await collectMissingContacts(env, normalized);
    for (const write of writes) {
      if (write.data.patientSourceId) {
        write.data.phone = '';
        write.data.contactVersion = '';
        write.data.contactVerifiedAt = '';
      }
    }
  }
  try {
    await commitWrites(env, writes);
  } catch (error) {
    if (conflict(error) && attempt < 2) return syncRecords(env, input, user, attempt + 1);
    throw error;
  }

  const phoneReceived = normalized.filter((record) => normalizeBrazilPhone(record.phone)).length;
  return {
    contactCapability: CONTACT_DIRECTORY_VERSION,
    contactDirectoryCapability: CONTACT_DIRECTORY_VERSION,
    synchronizedAt: now,
    received: normalized.length,
    totalCount: expectedTotal || normalized.length,
    complete,
    created,
    changed,
    unchanged,
    deactivated,
    phoneReceived
  };
}

async function migrateEmbeddedReadMemory(env, username, records, collectionPath, memory) {
  const writes = [];

  for (const record of records) {
    const sourceId = cleanSourceId(record?.sourceId);
    const embeddedReadAt = readAtFor(record, username);
    if (!sourceId || !embeddedReadAt) continue;
    const dedicatedReadAt = clean(memory.get(sourceId), 40);
    if (dedicatedReadAt >= embeddedReadAt) continue;

    const receiptId = await digestId(sourceId);
    writes.push({
      documentPath: `${collectionPath}/${receiptId}`,
      data: { sourceId, readAt: embeddedReadAt }
    });
    memory.set(sourceId, embeddedReadAt);
  }

  if (writes.length) await commitWrites(env, writes);
}

async function markRead(env, sourceId, username) {
  const validSourceId = cleanSourceId(sourceId);
  if (!validSourceId) throw Object.assign(new Error('Agendamento inválido.'), { status: 400 });

  const documentId = await digestId(validSourceId);
  const existing = await firestoreGet(env, `${await agendaCollection(env)}/${documentId}`);
  if (!existing) throw Object.assign(new Error('Agendamento não encontrado.'), { status: 404 });

  const collectionPath = await readReceiptCollection(username, env);
  const receiptId = await digestId(validSourceId);
  const now = new Date().toISOString();

  await firestoreCommit(env, [{
    documentPath: `${collectionPath}/${receiptId}`,
    data: {
      sourceId: validSourceId,
      readAt: now
    }
  }]);

  return { sourceId: validSourceId, readAt: now };
}

export function isAgendaApi(pathname) {
  return pathname === '/api/agenda' || pathname.startsWith('/api/agenda/');
}

export async function handleAgendaRoute(request, env, origin = '', originAllowed = true) {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...responseHeaders(origin, originAllowed),
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type',
        'Access-Control-Max-Age': '600'
      }
    });
  }

  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  if (!firebaseConfigured(env)) return json({ error: 'Armazenamento da Agenda indisponível.' }, 503, origin, originAllowed);

  const user = await authorizedUser(request, env);
  if (user?.authorizationDenied) return json({ error: user.error }, user.status, origin, originAllowed);

  if (url.pathname === '/api/agenda/contact-state' && ['GET', 'POST'].includes(request.method)) {
    try {
      const sourceRecords = await listAll(env);
      let records = sourceRecords;
      if (request.method === 'POST') {
        const payload = await parseBody(request);
        if (!Array.isArray(payload?.records) || payload.records.length > MAX_RECORDS_PER_SYNC) {
          return json({ error: 'Consulta de contatos inválida.' }, 400, origin, originAllowed);
        }
        const bySource = new Map(sourceRecords.map(record => [record.sourceId, record]));
        records = payload.records.map(item => {
          const normalized = normalizeRecord({ sourceId: item?.sourceId, patientSourceId: item?.patientSourceId,
            patient: item?.patient, requestedAt: item?.requestedAt });
          const existing = bySource.get(normalized.sourceId);
          const same = existing && normalized.patient === existing.patient
            && normalized.requestedAt === existing.requestedAt
            && (!normalized.patientSourceId || normalized.patientSourceId === existing.patientSourceId);
          return same ? { ...existing, active: true } : { ...normalized, active: true };
        });
      }
      const contacts = records.some(record => record.patientSourceId) ? await directory(env, records) : new Map();
      return json(contactState(records.map(record => directoryRecord(record, contacts))), 200, origin, originAllowed);
    } catch (_) {
      return json({ error: 'Não foi possível consultar contatos.' }, 503, origin, originAllowed);
    }
  }

  if (url.pathname === '/api/agenda/contact' && request.method === 'POST') {
    try {
      return json({ ok: true, ...await updateContact(env, await parseBody(request)) }, 200, origin, originAllowed);
    } catch (error) {
      const status = Number(error?.status || 500);
      return json({ error: status < 500 ? error.message : 'Não foi possível corrigir o contato.' }, status, origin, originAllowed);
    }
  }

  if (url.pathname === '/api/agenda' && request.method === 'GET') {
    try {
      const sourceRecords = await listAll(env);
      const contacts = sourceRecords.some(record => record.patientSourceId) ? await directory(env, sourceRecords) : new Map();
      const { collectionPath, memory } = await listReadMemory(env, user.username);
      await migrateEmbeddedReadMemory(env, user.username, sourceRecords, collectionPath, memory);

      const records = sourceRecords
        .map((item) => publicRecord(directoryRecord(item, contacts), user.username, memory))
        .filter((item) => item.sourceId)
        .sort(agendaSort);
      const active = records.filter((item) => item.active);
      return json({
        contactCapability: CONTACT_DIRECTORY_VERSION,
        contactDirectoryCapability: CONTACT_DIRECTORY_VERSION,
        records,
        summary: {
          active: active.length,
          unread: active.filter((item) => item.unread).length,
          lastSyncAt: records.reduce((latest, item) => item.lastSeenAt > latest ? item.lastSeenAt : latest, '')
        }
      }, 200, origin, originAllowed);
    } catch (_) {
      return json({ error: 'Não foi possível carregar a Agenda.' }, 503, origin, originAllowed);
    }
  }

  if (url.pathname === '/api/agenda/sync' && request.method === 'POST') {
    try {
      const payload = await parseBody(request);
      const result = await syncRecords(env, payload, user);
      return json({ ok: true, ...result }, 200, origin, originAllowed);
    } catch (error) {
      return json({ error: 'Falha ao sincronizar a Agenda.' }, Number(error?.status || 500), origin, originAllowed);
    }
  }

  if (url.pathname === '/api/agenda/read' && request.method === 'POST') {
    try {
      const payload = await parseBody(request);
      const result = await markRead(env, payload?.sourceId, clean(user.username, 80));
      return json({ ok: true, ...result }, 200, origin, originAllowed);
    } catch (error) {
      return json({ error: error?.message || 'Falha ao marcar o agendamento como visualizado.' }, Number(error?.status || 500), origin, originAllowed);
    }
  }

  return json({ error: 'Rota da Agenda não encontrada.' }, 404, origin, originAllowed);
}
