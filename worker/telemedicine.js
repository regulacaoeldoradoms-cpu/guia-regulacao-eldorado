'use strict';

import { validatePortalSession } from './auth-management-v2.js';
import {
  firebaseConfigured,
  firestoreCreate,
  firestoreGet,
  firestoreList,
  firestorePatch
} from './firebase-gateway.js';
import { telemedicineAccessFor } from './telemedicine-access.js';
import {
  clean,
  normalizeText,
  dateValid,
  addDays,
  threeBusinessReminders,
  deriveFollowupStatus,
  reminderMetaFor,
  looksClosed,
  looksRequested,
  returnDueFromRecord,
  returnConditionResolution
} from './telemedicine-rules.js';

const PATIENTS = 'telemedicine_patients';
const FOLLOWUPS = 'telemedicine_followups';
const EVENTS = 'telemedicine_events';
const IMPORT_BATCH_LIMIT = 5;

function headers(origin, allowed = true) {
  const value = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    value['Access-Control-Allow-Origin'] = origin;
    value.Vary = 'Origin';
  }
  return value;
}

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin, allowed) });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const responseHeaders = headers(origin, true);
  responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS';
  responseHeaders['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  responseHeaders['Access-Control-Max-Age'] = '600';
  delete responseHeaders['Content-Type'];
  return new Response(null, { status: 204, headers: responseHeaders });
}

function normalizePatientName(value) {
  return normalizeText(value).slice(0, 160);
}

function normalizeSpecialty(value) {
  return normalizeText(value).slice(0, 120);
}

function localToday() {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Campo_Grande', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());
  } catch (_) {
    return new Date().toISOString().slice(0, 10);
  }
}

function deriveStatus(followup, today = localToday()) {
  return deriveFollowupStatus(followup, today);
}

function reminderMeta(followup, today = localToday()) {
  return reminderMetaFor(followup, today);
}

async function digestId(prefix, value) {
  const bytes = new TextEncoder().encode(`${prefix}:${value}`);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 40);
}

async function patientIdFor(name) {
  return digestId('patient', normalizePatientName(name));
}

async function followupIdFor(patientId, specialty) {
  return digestId('followup', `${patientId}|${normalizeSpecialty(specialty)}`);
}

async function eventIdFor(sourceKey) {
  return digestId('event', sourceKey);
}

async function listAll(env, collectionPath, options = {}) {
  const output = [];
  let pageToken = '';
  let guard = 0;
  do {
    const page = await firestoreList(env, collectionPath, {
      pageSize: 100,
      pageToken,
      orderBy: options.orderBy || ''
    });
    output.push(...(page.documents || []));
    pageToken = page.nextPageToken || '';
    guard += 1;
  } while (pageToken && guard < 100);
  return output;
}

async function upsert(env, collection, id, data) {
  const existing = await firestoreGet(env, `${collection}/${id}`);
  if (existing) return firestorePatch(env, `${collection}/${id}`, data);
  return firestoreCreate(env, collection, id, data);
}

async function authorizedUser(request, env) {
  const user = await validatePortalSession(request, env, []);
  if (!user) return null;
  if (user.role === 'admin') return { ...user, telemedicineAdmin: true };
  if (user.role === 'recepcao' && await telemedicineAccessFor(env, user.username)) {
    return { ...user, telemedicineAdmin: false };
  }
  return null;
}

function publicFollowup(item, today = localToday()) {
  const status = deriveStatus(item, today);
  return {
    ...item,
    status,
    ...reminderMeta(item, today)
  };
}

function statusRank(status) {
  const ranks = { 'ATRASADO': 1, 'SOLICITAR': 2, 'EM AGUARDO': 3, 'SEM PROGRAMAÇÃO': 4, 'SOLICITADO': 5, 'CONCLUÍDO': 6 };
  return ranks[status] || 9;
}

async function dashboard(env) {
  const today = localToday();
  const [patients, followups] = await Promise.all([
    listAll(env, PATIENTS),
    listAll(env, FOLLOWUPS)
  ]);
  const visible = followups
    .map((item) => publicFollowup(item, today))
    .filter((item) => item.active !== false)
    .sort((a, b) => statusRank(a.status) - statusRank(b.status)
      || String(a.reminderDates?.[0] || a.returnDueDate || '9999').localeCompare(String(b.reminderDates?.[0] || b.returnDueDate || '9999'))
      || String(a.patientName || '').localeCompare(String(b.patientName || ''), 'pt-BR'));

  const counts = { total: visible.length, solicitar: 0, atrasado: 0, emAguardo: 0, semProgramacao: 0, solicitado: 0, alertasHoje: 0 };
  visible.forEach((item) => {
    if (item.status === 'SOLICITAR') counts.solicitar += 1;
    if (item.status === 'ATRASADO') counts.atrasado += 1;
    if (item.status === 'EM AGUARDO') counts.emAguardo += 1;
    if (item.status === 'SEM PROGRAMAÇÃO') counts.semProgramacao += 1;
    if (item.status === 'SOLICITADO') counts.solicitado += 1;
    if (item.alertToday) counts.alertasHoje += 1;
  });

  return { today, counts, patients, followups: visible };
}

async function patientDetail(env, patientId) {
  const patient = await firestoreGet(env, `${PATIENTS}/${patientId}`);
  if (!patient) return null;
  const [followups, events] = await Promise.all([listAll(env, FOLLOWUPS), listAll(env, EVENTS)]);
  const patientFollowups = followups
    .filter((item) => item.patientId === patientId)
    .map((item) => publicFollowup(item))
    .sort((a, b) => String(b.lastConsultationDate || '').localeCompare(String(a.lastConsultationDate || '')));
  const patientEvents = events
    .filter((item) => item.patientId === patientId)
    .sort((a, b) => String(b.eventDate || b.createdAt || '').localeCompare(String(a.eventDate || a.createdAt || ''))
      || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  return { patient, followups: patientFollowups, events: patientEvents };
}

async function recordConsultation(env, user, input) {
  const patientName = clean(input.patientName, 160);
  const specialty = clean(input.specialty, 120);
  const consultationDate = clean(input.consultationDate, 10);
  const requestedMode = clean(input.followupMode, 20).toLowerCase();
  const hasExplicitMode = ['discharge', 'scheduled', 'conditional'].includes(requestedMode);
  const followupMode = hasExplicitMode ? requestedMode : (input.discharged === true ? 'discharge' : 'scheduled');
  const discharged = followupMode === 'discharge';
  const conditional = followupMode === 'conditional';
  const inputResolution = clean(input.resolution, 2500);
  const notes = discharged ? '' : clean(input.notes, 1500);
  const needsReturn = hasExplicitMode ? !discharged : (discharged ? false : input.needsReturn !== false);
  const explicitDue = followupMode === 'scheduled' ? clean(input.returnDueDate, 10) : '';
  const returnDays = followupMode === 'scheduled' && !dateValid(explicitDue) ? Number(input.returnDays || 0) : 0;
  const returnConditionType = conditional ? clean(input.conditionType, 40).toLowerCase() : '';
  const returnConditionDetail = conditional ? clean(input.conditionDetail, 300) : '';
  const conditionalResolution = conditional
    ? returnConditionResolution(returnConditionType, returnConditionDetail)
    : '';
  if (conditional && !conditionalResolution) {
    throw Object.assign(new Error('Informe a condição necessária para o retorno.'), { status: 400 });
  }
  const generatedResolution = discharged
    ? 'ALTA DO EPISÓDIO'
    : conditional
      ? conditionalResolution
      : dateValid(explicitDue)
        ? `RETORNO PROGRAMADO PARA ${explicitDue}`
        : Number.isInteger(returnDays) && returnDays > 0
          ? `RETORNO COM ${returnDays} DIAS`
          : 'ACOMPANHAMENTO SEM DATA DEFINIDA';
  const resolution = hasExplicitMode ? generatedResolution : (inputResolution || generatedResolution);

  if (patientName.length < 3) throw Object.assign(new Error('Informe o nome do paciente.'), { status: 400 });
  if (!dateValid(consultationDate)) throw Object.assign(new Error('Informe a data da consulta.'), { status: 400 });
  if (specialty.length < 2) throw Object.assign(new Error('Informe a especialidade.'), { status: 400 });
  if (!resolution) throw Object.assign(new Error('Informe a resolutividade/conduta registrada na teleconsulta.'), { status: 400 });

  let returnDueDate = '';
  if (needsReturn) {
    if (dateValid(explicitDue)) returnDueDate = explicitDue;
    else if (Number.isInteger(returnDays) && returnDays > 0 && returnDays <= 730) returnDueDate = addDays(consultationDate, returnDays);
    else returnDueDate = returnDueFromRecord(consultationDate, resolution);
  }
  const reminderDates = needsReturn && returnDueDate ? threeBusinessReminders(returnDueDate) : [];
  const patientId = await patientIdFor(patientName);
  const followupId = await followupIdFor(patientId, specialty);
  const now = new Date().toISOString();
  const sourceKey = `manual|${patientId}|${normalizeSpecialty(specialty)}|${consultationDate}|${now}`;
  const eventId = await eventIdFor(sourceKey);

  await upsert(env, PATIENTS, patientId, {
    name: patientName,
    normalizedName: normalizePatientName(patientName),
    updatedAt: now,
    createdAt: now,
    needsReview: /\.\.\.|\bSAN\s*$|\bDOS\s*$/.test(patientName.toUpperCase())
  });

  const event = {
    patientId, patientName, followupId, eventType: 'consulta', eventDate: consultationDate,
    specialty, resolution, notes, followupMode, discharged, needsReturn, returnDueDate,
    returnDays: Number.isInteger(returnDays) ? returnDays : 0,
    returnConditionType, returnConditionDetail,
    reminderDates, source: 'manual', createdAt: now, createdBy: user.username
  };
  await firestoreCreate(env, EVENTS, eventId, event);

  const followup = {
    patientId,
    patientName,
    specialty,
    specialtyKey: normalizeSpecialty(specialty),
    lastConsultationDate: consultationDate,
    resolution,
    notes,
    followupMode,
    discharged,
    returnConditionType,
    returnConditionDetail,
    returnDueDate,
    reminderDates,
    requestedAt: '',
    requestedBy: '',
    active: Boolean(needsReturn),
    source: 'manual',
    updatedAt: now,
    createdBy: user.username
  };
  await upsert(env, FOLLOWUPS, followupId, followup);
  return { patientId, followupId, eventId, followup: publicFollowup({ id: followupId, ...followup }) };
}

async function markRequested(env, user, followupId, input = {}) {
  const current = await firestoreGet(env, `${FOLLOWUPS}/${followupId}`);
  if (!current) throw Object.assign(new Error('Acompanhamento não encontrado.'), { status: 404 });
  const today = localToday();
  const now = new Date().toISOString();
  const requestedDate = dateValid(input.requestedDate) ? input.requestedDate : today;
  const note = clean(input.note, 1200);
  await firestorePatch(env, `${FOLLOWUPS}/${followupId}`, {
    requestedAt: requestedDate,
    requestedBy: user.username,
    requestedHistorical: false,
    requestNote: note,
    updatedAt: now
  });
  const eventId = await eventIdFor(`request|${followupId}|${requestedDate}|${now}`);
  await firestoreCreate(env, EVENTS, eventId, {
    patientId: current.patientId,
    patientName: current.patientName,
    followupId,
    eventType: 'solicitacao',
    eventDate: requestedDate,
    specialty: current.specialty,
    resolution: 'SOLICITADO',
    notes: note,
    source: 'manual',
    createdAt: now,
    createdBy: user.username
  });
  return publicFollowup({ ...current, id: followupId, requestedAt: requestedDate, requestedHistorical: false, requestedBy: user.username, requestNote: note, updatedAt: now });
}

async function updateSchedule(env, user, followupId, input = {}) {
  const current = await firestoreGet(env, `${FOLLOWUPS}/${followupId}`);
  if (!current) throw Object.assign(new Error('Acompanhamento não encontrado.'), { status: 404 });
  const returnDueDate = clean(input.returnDueDate, 10);
  if (!dateValid(returnDueDate)) throw Object.assign(new Error('Informe uma data válida para o retorno.'), { status: 400 });
  const now = new Date().toISOString();
  const reminderDates = threeBusinessReminders(returnDueDate);
  await firestorePatch(env, `${FOLLOWUPS}/${followupId}`, {
    returnDueDate,
    reminderDates,
    requestedAt: '',
    requestedBy: '',
    requestedHistorical: false,
    active: true,
    updatedAt: now
  });
  const eventId = await eventIdFor(`schedule|${followupId}|${returnDueDate}|${now}`);
  await firestoreCreate(env, EVENTS, eventId, {
    patientId: current.patientId,
    patientName: current.patientName,
    followupId,
    eventType: 'programacao',
    eventDate: localToday(),
    specialty: current.specialty,
    resolution: `RETORNO PROGRAMADO PARA ${returnDueDate}`,
    returnDueDate,
    reminderDates,
    source: 'manual',
    createdAt: now,
    createdBy: user.username
  });
  return publicFollowup({ ...current, id: followupId, returnDueDate, reminderDates, requestedAt: '', requestedHistorical: false, requestedBy: '', active: true, updatedAt: now });
}

async function importRecord(env, user, record) {
  const patientName = clean(record.patientName || record.patient, 160);
  const consultationDate = clean(record.consultationDate || record.date, 10);
  const specialty = clean(record.specialty, 120);
  const resolution = clean(record.resolution || record.observation, 2500);
  const comment = clean(record.comment || record.operationalComment, 1500);
  if (patientName.length < 3) {
    return { imported: false, reason: 'invalid' };
  }
  const dateKnown = dateValid(consultationDate);
  const specialtyKnown = specialty.length >= 2;
  const patientId = await patientIdFor(patientName);
  const followupId = await followupIdFor(patientId, specialty);
  const sourceKey = clean(record.sourceKey, 500) || `${consultationDate}|${normalizePatientName(patientName)}|${normalizeSpecialty(specialty)}|${normalizeText(resolution)}|${normalizeText(comment)}`;
  const eventId = await eventIdFor(`legacy|${sourceKey}`);
  const existingEvent = await firestoreGet(env, `${EVENTS}/${eventId}`);

  const now = new Date().toISOString();
  const due = returnDueFromRecord(consultationDate, resolution, clean(record.returnDueDate, 10));
  const reminderDates = due ? threeBusinessReminders(due) : [];
  const requested = looksRequested(resolution, comment);
  const closed = looksClosed(resolution);
  const active = !closed && (Boolean(due) || /RETORNO|RET\b|EM ESPERA|EM AGUARDO|AGUARDANDO RETORNO|SOLICITAR|REAGENDAR|REMARCAR/.test(normalizeText(`${resolution} ${comment}`)));
  const requestedAt = requested && dateValid(record.requestedDate) ? record.requestedDate : '';
  const requestedHistorical = requested && !requestedAt;
  const sourceDate = clean(record.sourceDate, 40);
  const dateInferred = record.dateInferred === true;
  const needsReview = /\.\.\.|\bSAN\s*$|\bDOS\s*$/.test(patientName.toUpperCase())
    || !dateKnown || !specialtyKnown || dateInferred
    || (active && !due && !requested);

  const existingPatient = await firestoreGet(env, `${PATIENTS}/${patientId}`);
  await upsert(env, PATIENTS, patientId, {
    name: existingPatient?.name || patientName,
    normalizedName: normalizePatientName(patientName),
    createdAt: existingPatient?.createdAt || now,
    updatedAt: now,
    needsReview: Boolean(existingPatient?.needsReview || needsReview),
    source: existingPatient?.source || 'legacy'
  });

  const existingFollowup = await firestoreGet(env, `${FOLLOWUPS}/${followupId}`);
  const newer = !existingFollowup
    || (!existingFollowup.lastConsultationDate && dateKnown)
    || (dateKnown && consultationDate >= String(existingFollowup.lastConsultationDate || ''));
  const duplicateNeedsRepair = Boolean(existingEvent) && (
    !existingFollowup
    || (String(existingEvent.createdAt || '') && String(existingFollowup.updatedAt || '') < String(existingEvent.createdAt || ''))
  );
  if (newer && (!existingEvent || duplicateNeedsRepair)) {
    await upsert(env, FOLLOWUPS, followupId, {
      patientId,
      patientName,
      specialty,
      specialtyKey: normalizeSpecialty(specialty),
      lastConsultationDate: consultationDate,
      resolution,
      notes: comment,
      returnDueDate: due,
      reminderDates,
      requestedAt,
      requestedHistorical,
      requestedBy: requested ? 'migração histórica' : '',
      active: requested ? true : active,
      needsReview,
      source: 'legacy',
      updatedAt: now,
      createdBy: user.username
    });
  }

  if (!existingEvent) {
    await firestoreCreate(env, EVENTS, eventId, {
      patientId, patientName, followupId, eventType: 'consulta', eventDate: consultationDate,
      specialty, resolution, notes: comment, needsReturn: active, returnDueDate: due,
      reminderDates, source: 'legacy', sourceKey, createdAt: now, createdBy: user.username,
      legacyOperationalStatus: clean(record.operationalStatus, 120),
      sourceRow: Number(record.sourceRow || 0) || 0, sourceDate, dateInferred, needsReview
    });
  }

  return {
    imported: !existingEvent,
    reason: existingEvent ? 'duplicate' : '',
    patientId,
    followupId,
    eventId,
    needsReview
  };
}

async function importBatch(env, user, input) {
  if (user.role !== 'admin') throw Object.assign(new Error('Somente o Desenvolvedor pode executar a migração inicial.'), { status: 403 });
  const records = Array.isArray(input.records) ? input.records.slice(0, IMPORT_BATCH_LIMIT) : [];
  if (!records.length) throw Object.assign(new Error('Nenhum registro válido foi enviado para importação.'), { status: 400 });
  const summary = { received: records.length, imported: 0, duplicates: 0, invalid: 0, needsReview: 0 };
  for (const record of records) {
    const result = await importRecord(env, user, record);
    if (result.imported) summary.imported += 1;
    else if (result.reason === 'duplicate') summary.duplicates += 1;
    else summary.invalid += 1;
    if (result.needsReview) summary.needsReview += 1;
  }
  return summary;
}

export function isTelemedicineApi(pathname) {
  return String(pathname || '').startsWith('/api/telemedicina');
}

export async function handleTelemedicineRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const user = await authorizedUser(request, env);
  if (!user) return json({ error: 'Acesso exclusivo da Telemedicina ou do Desenvolvedor.' }, 403, origin);
  if (!firebaseConfigured(env)) return json({ error: 'Firebase/Firestore ainda não está disponível para o módulo de Telemedicina.', code: 'FIREBASE_PENDING' }, 503, origin);

  const url = new URL(request.url);
  try {
    if (url.pathname === '/api/telemedicina/dashboard' && request.method === 'GET') {
      return json({ ...(await dashboard(env)), actor: { username: user.username, admin: Boolean(user.telemedicineAdmin) } }, 200, origin);
    }
    const patientMatch = url.pathname.match(/^\/api\/telemedicina\/patients\/([a-f0-9]{20,64})$/);
    if (patientMatch && request.method === 'GET') {
      const detail = await patientDetail(env, patientMatch[1]);
      return detail ? json(detail, 200, origin) : json({ error: 'Paciente não encontrado.' }, 404, origin);
    }
    if (url.pathname === '/api/telemedicina/consultations' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      return json(await recordConsultation(env, user, body), 201, origin);
    }
    const requestedMatch = url.pathname.match(/^\/api\/telemedicina\/followups\/([a-f0-9]{20,64})\/requested$/);
    if (requestedMatch && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      return json({ followup: await markRequested(env, user, requestedMatch[1], body) }, 200, origin);
    }
    const scheduleMatch = url.pathname.match(/^\/api\/telemedicina\/followups\/([a-f0-9]{20,64})\/schedule$/);
    if (scheduleMatch && request.method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      return json({ followup: await updateSchedule(env, user, scheduleMatch[1], body) }, 200, origin);
    }
    if (url.pathname === '/api/telemedicina/import' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      return json({ summary: await importBatch(env, user, body) }, 200, origin);
    }
    return json({ error: 'Rota de Telemedicina não encontrada.' }, 404, origin);
  } catch (error) {
    return json({ error: error?.message || 'Falha no módulo de Telemedicina.' }, Number(error?.status || 500), origin);
  }
}
