'use strict';

import { validatePortalSession } from './auth-management-v2.js';
import {
  firebaseConfigured,
  firestoreCommit,
  firestoreGet,
  firestoreList
} from './firebase-gateway.js';
import { telemedicineAccessFor, ensureTelemedicineUnderlyingRole } from './telemedicine-access.js';

const COLLECTION = 'telemedicine_digsaude_agenda';
const READ_STATE_COLLECTION = 'telemedicine_digsaude_agenda_read_state';
const MAX_RECORDS_PER_SYNC = 250;
const MAX_LIST_PAGES = 20;
const FIRESTORE_COMMIT_CHUNK = 450;
const CONTACT_REFRESH_MS = 24 * 60 * 60 * 1000;

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

function normalizePatientPhone(value) {
  let digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0') && digits.length > 11) digits = digits.replace(/^0+/, '');
  if (digits.startsWith('55')) return digits.length >= 12 && digits.length <= 13 ? digits : '';
  if (digits.length === 10 || digits.length === 11) return '55' + digits;
  return '';
}

function contactNeedsRefresh(record, nowMs = Date.now()) {
  const phone = normalizePatientPhone(record?.patientPhone);
  const syncedAt = Date.parse(clean(record?.patientPhoneSyncedAt, 40));
  if (!phone || !Number.isFinite(syncedAt)) return true;
  return nowMs - syncedAt >= CONTACT_REFRESH_MS;
}

function normalizeRecord(input = {}) {
  const sourceId = cleanSourceId(input.sourceId);
  if (!sourceId) throw Object.assign(new Error('Identificador do agendamento inválido.'), { status: 400 });
  return {
    sourceId,
    requestedAt: clean(input.requestedAt, 40),
    specialty: clean(input.specialty, 120),
    returnStatus: clean(input.returnStatus, 20),
    devolucaoStatus: clean(input.devolucaoStatus, 20),
    classification: clean(input.classification, 500),
    appointmentDate: clean(input.appointmentDate, 20),
    appointmentTime: clean(input.appointmentTime, 12),
    specialist: clean(input.specialist, 180),
    patient: clean(input.patient, 180),
    patientPhone: normalizePatientPhone(input.patientPhone),
    municipality: clean(input.municipality, 120),
    appointmentType: clean(input.appointmentType, 120),
    facility: clean(input.facility, 180),
    status: clean(input.status, 120)
  };
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
    const page = await firestoreList(env, collectionPath, { pageSize: 100, pageToken });
    output.push(...(page.documents || []));
    pageToken = page.nextPageToken || '';
    guard += 1;
  } while (pageToken && guard < MAX_LIST_PAGES);
  return output;
}

async function listAll(env) {
  return listCollection(env, COLLECTION);
}

async function readUserKey(username) {
  const bytes = new TextEncoder().encode(`digsaude-agenda-read-user:${clean(username, 80)}`);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 40);
}

async function readReceiptCollection(username) {
  return `${READ_STATE_COLLECTION}/${await readUserKey(username)}/records`;
}

async function listReadMemory(env, username) {
  const collectionPath = await readReceiptCollection(username);
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
    requestedAt: clean(record.requestedAt, 40),
    specialty: clean(record.specialty, 120),
    returnStatus: clean(record.returnStatus, 20),
    devolucaoStatus: clean(record.devolucaoStatus, 20),
    classification: clean(record.classification, 500),
    appointmentDate: clean(record.appointmentDate, 20),
    appointmentTime: clean(record.appointmentTime, 12),
    specialist: clean(record.specialist, 180),
    patient: clean(record.patient, 180),
    contactAvailable: Boolean(normalizePatientPhone(record.patientPhone)),
    municipality: clean(record.municipality, 120),
    appointmentType: clean(record.appointmentType, 120),
    facility: clean(record.facility, 180),
    status: clean(record.status, 120),
    firstSeenAt: clean(record.firstSeenAt, 40),
    lastSeenAt: clean(record.lastSeenAt, 40),
    lastChangedAt: clean(record.lastChangedAt, 40),
    removedAt: clean(record.removedAt, 40),
    active: record.active !== false,
    readAt,
    unread: isUnreadFor(record, readAt)
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

async function syncRecords(env, input, user) {
  const rows = Array.isArray(input?.records) ? input.records : [];
  const declaredComplete = input?.complete === true;
  const contactPass = input?.contactPass === true;
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
  const existingBySourceId = new Map();
  for (const existing of existingRecords) {
    const sourceId = cleanSourceId(existing.sourceId);
    if (sourceId) existingBySourceId.set(sourceId, existing);
  }

  const writes = [];
  const contactRefreshSourceIds = [];
  let contactsUpdated = 0;
  let created = 0;
  let changed = 0;
  let unchanged = 0;

  for (const record of normalized) {
    const documentId = await digestId(record.sourceId);
    const existing = existingBySourceId.get(record.sourceId) || null;

    if (!existing) {
      const patientPhone = normalizePatientPhone(record.patientPhone);
      writes.push({
        documentPath: `${COLLECTION}/${documentId}`,
        data: {
          ...record,
          patientPhone,
          patientPhoneSyncedAt: patientPhone ? now : '',
          firstSeenAt: now,
          lastSeenAt: now,
          lastChangedAt: now,
          active: true,
          removedAt: '',
          readBy: {},
          lastSyncedBy: clean(user.username, 80)
        }
      });
      if (patientPhone) contactsUpdated += 1;
      else if (!contactPass) contactRefreshSourceIds.push(record.sourceId);
      created += 1;
      continue;
    }

    const didChange = comparable(existing) !== comparable(record);
    const stateChanged = didChange || existing.active === false;
    const incomingPhone = normalizePatientPhone(record.patientPhone);
    const existingPhone = normalizePatientPhone(existing.patientPhone);
    const patientPhone = incomingPhone || existingPhone;
    const patientPhoneSyncedAt = incomingPhone
      ? now
      : clean(existing.patientPhoneSyncedAt, 40);
    const { id: _existingId, ...existingData } = existing;
    writes.push({
      documentPath: `${COLLECTION}/${existing.id || documentId}`,
      data: {
        ...existingData,
        ...record,
        patientPhone,
        patientPhoneSyncedAt,
        firstSeenAt: clean(existing.firstSeenAt, 40) || now,
        lastSeenAt: now,
        lastChangedAt: stateChanged ? now : (clean(existing.lastChangedAt, 40) || now),
        active: true,
        removedAt: '',
        readBy: existing.readBy && typeof existing.readBy === 'object' ? existing.readBy : {},
        lastSyncedBy: clean(user.username, 80)
      }
    });

    if (incomingPhone) contactsUpdated += 1;
    if (!contactPass && !incomingPhone && contactNeedsRefresh({ ...existing, patientPhone, patientPhoneSyncedAt })) {
      contactRefreshSourceIds.push(record.sourceId);
    }

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
      const { id: _existingId, ...existingData } = existing;
      writes.push({
        documentPath: `${COLLECTION}/${existing.id}`,
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

  await commitWrites(env, writes);

  return {
    synchronizedAt: now,
    received: normalized.length,
    totalCount: expectedTotal || normalized.length,
    complete,
    created,
    changed,
    unchanged,
    deactivated,
    contactsUpdated,
    contactRefreshSourceIds: contactPass ? [] : contactRefreshSourceIds.slice(0, MAX_RECORDS_PER_SYNC)
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
  const existing = await firestoreGet(env, `${COLLECTION}/${documentId}`);
  if (!existing) throw Object.assign(new Error('Agendamento não encontrado.'), { status: 404 });

  const collectionPath = await readReceiptCollection(username);
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

async function patientContact(env, sourceId) {
  const validSourceId = cleanSourceId(sourceId);
  if (!validSourceId) throw Object.assign(new Error('Agendamento inválido.'), { status: 400 });

  const documentId = await digestId(validSourceId);
  const existing = await firestoreGet(env, `${COLLECTION}/${documentId}`);
  if (!existing || existing.active === false) {
    throw Object.assign(new Error('Agendamento ativo não encontrado.'), { status: 404 });
  }

  const phone = normalizePatientPhone(existing.patientPhone);
  if (!phone) {
    throw Object.assign(new Error('O contato deste paciente ainda não foi sincronizado.'), {
      status: 409,
      code: 'AGENDA_CONTACT_NOT_SYNCED'
    });
  }

  return { sourceId: validSourceId, phone };
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

  if (url.pathname === '/api/agenda' && request.method === 'GET') {
    const sourceRecords = await listAll(env);
    const { collectionPath, memory } = await listReadMemory(env, user.username);
    await migrateEmbeddedReadMemory(env, user.username, sourceRecords, collectionPath, memory);

    const records = sourceRecords
      .map((item) => publicRecord(item, user.username, memory))
      .filter((item) => item.sourceId)
      .sort(agendaSort);
    const active = records.filter((item) => item.active);
    return json({
      records,
      summary: {
        active: active.length,
        unread: active.filter((item) => item.unread).length,
        lastSyncAt: records.reduce((latest, item) => item.lastSeenAt > latest ? item.lastSeenAt : latest, '')
      }
    }, 200, origin, originAllowed);
  }

  if (url.pathname === '/api/agenda/sync' && request.method === 'POST') {
    try {
      const payload = await parseBody(request);
      const result = await syncRecords(env, payload, user);
      return json({ ok: true, ...result }, 200, origin, originAllowed);
    } catch (error) {
      return json({ error: error?.message || 'Falha ao sincronizar a Agenda.' }, Number(error?.status || 500), origin, originAllowed);
    }
  }

  if (url.pathname === '/api/agenda/contact' && request.method === 'POST') {
    try {
      const payload = await parseBody(request);
      const result = await patientContact(env, payload?.sourceId);
      return json({ ok: true, ...result }, 200, origin, originAllowed);
    } catch (error) {
      return json({
        error: error?.message || 'Falha ao consultar o contato do paciente.',
        ...(error?.code ? { code: error.code } : {})
      }, Number(error?.status || 500), origin, originAllowed);
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
