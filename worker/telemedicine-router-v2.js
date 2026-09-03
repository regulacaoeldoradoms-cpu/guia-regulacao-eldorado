'use strict';

import { validatePortalSession } from './auth-management-v2.js';
import {
  firebaseConfigured,
  firestoreCreate,
  firestoreDelete,
  firestoreGet,
  firestoreList,
  firestorePatch,
  firestoreReplace
} from './firebase-gateway.js';
import { telemedicineAccessFor } from './telemedicine-access.js';
import { clean, normalizeText, canonicalSpecialtyName } from './telemedicine-rules.js';
import {
  handleTelemedicineRoute as handleLegacyTelemedicineRoute,
  isTelemedicineApi as isLegacyTelemedicineApi
} from './telemedicine.js';

const PATIENTS = 'telemedicine_patients';
const FOLLOWUPS = 'telemedicine_followups';
const EVENTS = 'telemedicine_events';
const MAX_CORRECTION_HISTORY = 12;

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

function normalizePatientName(value) {
  return normalizeText(value).slice(0, 160);
}

function normalizeSpecialty(value) {
  return normalizeText(value).slice(0, 120);
}

function localToday() {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Campo_Grande',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  } catch (_) {
    return new Date().toISOString().slice(0, 10);
  }
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

async function listAll(env, collectionPath) {
  const output = [];
  let pageToken = '';
  let guard = 0;
  do {
    const page = await firestoreList(env, collectionPath, { pageSize: 100, pageToken });
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

function withoutId(document) {
  if (!document || typeof document !== 'object') return {};
  const { id: _id, ...data } = document;
  return data;
}

function appendCorrectionHistory(current, entry) {
  const previous = Array.isArray(current) ? current : [];
  return [...previous.slice(-(MAX_CORRECTION_HISTORY - 1)), entry];
}

function mergeCorrectionHistory(first, second, entry) {
  const combined = [
    ...(Array.isArray(first) ? first : []),
    ...(Array.isArray(second) ? second : []),
    entry
  ];
  combined.sort((a, b) => String(a?.correctedAt || '').localeCompare(String(b?.correctedAt || '')));
  return combined.slice(-MAX_CORRECTION_HISTORY);
}

function newerFollowup(first, second) {
  const firstDate = String(first?.lastConsultationDate || '');
  const secondDate = String(second?.lastConsultationDate || '');
  if (firstDate !== secondDate) return firstDate > secondDate ? first : second;

  const firstUpdated = String(first?.updatedAt || first?.createdAt || '');
  const secondUpdated = String(second?.updatedAt || second?.createdAt || '');
  return firstUpdated >= secondUpdated ? first : second;
}

function earliestCreatedAt(first, second) {
  const values = [first?.createdAt, second?.createdAt].filter(Boolean).map(String).sort();
  return values[0] || '';
}

async function correctPatientName(env, user, patientId, input = {}) {
  const patient = await firestoreGet(env, `${PATIENTS}/${patientId}`);
  if (!patient) throw Object.assign(new Error('Paciente não encontrado.'), { status: 404 });

  const newName = clean(input.name, 160);
  if (newName.length < 3) throw Object.assign(new Error('Informe o nome completo do paciente.'), { status: 400 });

  const oldName = clean(patient.name, 160);
  const oldNormalized = normalizePatientName(oldName);
  const newNormalized = normalizePatientName(newName);
  if (!newNormalized) throw Object.assign(new Error('Informe um nome válido.'), { status: 400 });

  const targetPatientId = await patientIdFor(newName);
  if (targetPatientId !== patientId) {
    const collision = await firestoreGet(env, `${PATIENTS}/${targetPatientId}`);
    if (collision) {
      throw Object.assign(new Error('Já existe outro cadastro com esse nome. Abra o histórico antes de corrigir para evitar juntar pacientes diferentes.'), { status: 409 });
    }
  }

  const [followups, events] = await Promise.all([listAll(env, FOLLOWUPS), listAll(env, EVENTS)]);
  const patientFollowups = followups.filter((item) => item.patientId === patientId);
  const migration = new Map();

  for (const followup of patientFollowups) {
    const targetFollowupId = await followupIdFor(targetPatientId, followup.specialty || '');
    if (targetFollowupId !== followup.id) {
      const collision = await firestoreGet(env, `${FOLLOWUPS}/${targetFollowupId}`);
      if (collision) {
        throw Object.assign(new Error('A correção criaria um acompanhamento duplicado para este paciente e especialidade. Revise o histórico antes de continuar.'), { status: 409 });
      }
    }
    migration.set(followup.id, targetFollowupId);
  }

  const now = new Date().toISOString();
  const correction = {
    field: 'patientName',
    previousValue: oldName,
    newValue: newName,
    correctedAt: now,
    correctedBy: user.username
  };

  await upsert(env, PATIENTS, targetPatientId, {
    ...withoutId(patient),
    name: newName,
    normalizedName: newNormalized,
    needsReview: false,
    updatedAt: now,
    correctedAt: now,
    correctedBy: user.username,
    correctionHistory: appendCorrectionHistory(patient.correctionHistory, correction)
  });

  for (const followup of patientFollowups) {
    const targetFollowupId = migration.get(followup.id) || followup.id;
    await upsert(env, FOLLOWUPS, targetFollowupId, {
      ...withoutId(followup),
      patientId: targetPatientId,
      patientName: newName,
      updatedAt: now,
      correctedAt: now,
      correctedBy: user.username
    });
    if (targetFollowupId !== followup.id) {
      await firestorePatch(env, `${FOLLOWUPS}/${followup.id}`, {
        active: false,
        replacedBy: targetFollowupId,
        updatedAt: now
      });
    }
  }

  for (const event of events) {
    if (event.patientId !== patientId) continue;
    const patch = {
      patientId: targetPatientId,
      patientName: newName
    };
    const targetFollowupId = migration.get(event.followupId);
    if (targetFollowupId) patch.followupId = targetFollowupId;
    await firestorePatch(env, `${EVENTS}/${event.id}`, patch);
  }

  if (targetPatientId !== patientId) {
    await firestorePatch(env, `${PATIENTS}/${patientId}`, {
      active: false,
      mergedInto: targetPatientId,
      name: newName,
      updatedAt: now
    });
    for (const followup of patientFollowups) {
      const targetFollowupId = migration.get(followup.id);
      if (targetFollowupId && targetFollowupId !== followup.id) {
        await firestoreDelete(env, `${FOLLOWUPS}/${followup.id}`).catch(() => false);
      }
    }
    await firestoreDelete(env, `${PATIENTS}/${patientId}`).catch(() => false);
  }

  return {
    patientId: targetPatientId,
    name: newName,
    previousName: oldName,
    normalizedChanged: oldNormalized !== newNormalized,
    migratedFollowups: patientFollowups.length,
    correctedAt: now
  };
}

async function mergeSpecialtyFollowups(env, user, sourceId, targetId, source, target, newSpecialty, newSpecialtyKey, correction, eventsOverride = null) {
  const now = correction.correctedAt;
  const current = newerFollowup(source, target);
  const createdAt = earliestCreatedAt(source, target) || String(current?.createdAt || now);
  const mergedFromFollowups = Array.from(new Set([
    ...(Array.isArray(target.mergedFromFollowups) ? target.mergedFromFollowups : []),
    ...(Array.isArray(source.mergedFromFollowups) ? source.mergedFromFollowups : []),
    sourceId
  ])).filter((id) => id && id !== targetId).slice(-20);

  await firestoreReplace(env, `${FOLLOWUPS}/${targetId}`, {
    ...withoutId(current),
    patientId: source.patientId,
    patientName: current.patientName || target.patientName || source.patientName,
    specialty: newSpecialty,
    specialtyKey: newSpecialtyKey,
    createdAt,
    updatedAt: now,
    correctedAt: now,
    correctedBy: user.username,
    correctionHistory: mergeCorrectionHistory(target.correctionHistory, source.correctionHistory, correction),
    mergedFromFollowups
  });

  const events = Array.isArray(eventsOverride) ? eventsOverride : await listAll(env, EVENTS);
  for (const event of events) {
    if (event.followupId !== sourceId && event.followupId !== targetId) continue;
    await firestorePatch(env, `${EVENTS}/${event.id}`, {
      followupId: targetId,
      specialty: newSpecialty
    });
    event.followupId = targetId;
    event.specialty = newSpecialty;
  }

  await firestorePatch(env, `${FOLLOWUPS}/${sourceId}`, {
    active: false,
    replacedBy: targetId,
    mergedInto: targetId,
    updatedAt: now
  });
  await firestoreDelete(env, `${FOLLOWUPS}/${sourceId}`).catch(() => false);

  return {
    followupId: targetId,
    patientId: source.patientId,
    specialty: newSpecialty,
    previousSpecialty: clean(source.specialty, 120),
    merged: true,
    mergedFromFollowupId: sourceId,
    correctedAt: now
  };
}

async function correctSpecialty(env, user, followupId, input = {}, options = {}) {
  const followup = options.followup || await firestoreGet(env, `${FOLLOWUPS}/${followupId}`);
  if (!followup) throw Object.assign(new Error('Acompanhamento não encontrado.'), { status: 404 });

  const newSpecialty = canonicalSpecialtyName(input.specialty);
  if (newSpecialty.length < 3) throw Object.assign(new Error('Informe o nome da especialidade por extenso.'), { status: 400 });

  const oldSpecialty = clean(followup.specialty, 120);
  const newSpecialtyKey = normalizeSpecialty(newSpecialty);
  if (!newSpecialtyKey) throw Object.assign(new Error('Informe uma especialidade válida.'), { status: 400 });

  const now = new Date().toISOString();
  const correction = {
    field: 'specialty',
    previousValue: oldSpecialty,
    newValue: newSpecialty,
    correctedAt: now,
    correctedBy: user.username
  };

  const targetFollowupId = await followupIdFor(followup.patientId, newSpecialty);
  if (targetFollowupId !== followupId) {
    const collision = await firestoreGet(env, `${FOLLOWUPS}/${targetFollowupId}`);
    if (collision) {
      return mergeSpecialtyFollowups(
        env,
        user,
        followupId,
        targetFollowupId,
        followup,
        collision,
        newSpecialty,
        newSpecialtyKey,
        correction,
        options.events
      );
    }
  }

  await upsert(env, FOLLOWUPS, targetFollowupId, {
    ...withoutId(followup),
    specialty: newSpecialty,
    specialtyKey: newSpecialtyKey,
    updatedAt: now,
    correctedAt: now,
    correctedBy: user.username,
    correctionHistory: appendCorrectionHistory(followup.correctionHistory, correction)
  });

  const events = Array.isArray(options.events) ? options.events : await listAll(env, EVENTS);
  for (const event of events) {
    if (event.followupId !== followupId) continue;
    await firestorePatch(env, `${EVENTS}/${event.id}`, {
      followupId: targetFollowupId,
      specialty: newSpecialty
    });
    event.followupId = targetFollowupId;
    event.specialty = newSpecialty;
  }

  if (targetFollowupId !== followupId) {
    await firestorePatch(env, `${FOLLOWUPS}/${followupId}`, {
      active: false,
      replacedBy: targetFollowupId,
      updatedAt: now
    });
    await firestoreDelete(env, `${FOLLOWUPS}/${followupId}`).catch(() => false);
  }

  return {
    followupId: targetFollowupId,
    patientId: followup.patientId,
    specialty: newSpecialty,
    previousSpecialty: oldSpecialty,
    merged: false,
    correctedAt: now
  };
}


function specialtyCandidate(document) {
  const previous = clean(document?.specialty, 120);
  const canonical = canonicalSpecialtyName(previous);
  if (!document?.id || !previous || canonical === previous) return null;
  return { document, previous, canonical };
}

function summarizeSpecialtyCandidates(candidates) {
  const groups = new Map();
  for (const candidate of candidates) {
    const key = `${candidate.previous}\u0000${candidate.canonical}`;
    const current = groups.get(key) || {
      previous: candidate.previous,
      canonical: candidate.canonical,
      count: 0
    };
    current.count += 1;
    groups.set(key, current);
  }
  return Array.from(groups.values()).sort((first, second) =>
    second.count - first.count
    || first.canonical.localeCompare(second.canonical, 'pt-BR')
    || first.previous.localeCompare(second.previous, 'pt-BR')
  );
}

async function specialtyMaintenanceAudit(env) {
  const [followups, events] = await Promise.all([
    listAll(env, FOLLOWUPS),
    listAll(env, EVENTS)
  ]);
  const followupCandidates = followups.map(specialtyCandidate).filter(Boolean);
  const eventCandidates = events.map(specialtyCandidate).filter(Boolean);
  return {
    complete: followupCandidates.length === 0 && eventCandidates.length === 0,
    followups: {
      total: followups.length,
      needsNormalization: followupCandidates.length,
      groups: summarizeSpecialtyCandidates(followupCandidates)
    },
    events: {
      total: events.length,
      needsNormalization: eventCandidates.length,
      groups: summarizeSpecialtyCandidates(eventCandidates)
    }
  };
}

async function normalizeSpecialtiesBatch(env, user, input = {}) {
  const requestedLimit = Number(input.limit);
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(10, Math.max(1, requestedLimit))
    : 8;
  const [followups, events] = await Promise.all([
    listAll(env, FOLLOWUPS),
    listAll(env, EVENTS)
  ]);
  const followupCandidates = followups.map(specialtyCandidate).filter(Boolean);

  if (followupCandidates.length) {
    const selected = followupCandidates.slice(0, limit);
    let changed = 0;
    let merged = 0;
    const errors = [];

    for (const candidate of selected) {
      try {
        const result = await correctSpecialty(
          env,
          user,
          candidate.document.id,
          { specialty: candidate.canonical },
          { followup: candidate.document, events }
        );
        changed += 1;
        if (result.merged) merged += 1;
      } catch (error) {
        errors.push({
          previous: candidate.previous,
          canonical: candidate.canonical,
          error: error?.message || 'Falha ao padronizar a especialidade.'
        });
      }
    }

    return {
      phase: 'followups',
      changed,
      merged,
      eventsChanged: 0,
      remaining: Math.max(0, followupCandidates.length - changed),
      complete: false,
      errors
    };
  }

  const eventCandidates = events.map(specialtyCandidate).filter(Boolean);
  const selectedEvents = eventCandidates.slice(0, limit);
  let eventsChanged = 0;
  const errors = [];

  for (const candidate of selectedEvents) {
    try {
      await firestorePatch(env, `${EVENTS}/${candidate.document.id}`, {
        specialty: candidate.canonical
      });
      candidate.document.specialty = candidate.canonical;
      eventsChanged += 1;
    } catch (error) {
      errors.push({
        previous: candidate.previous,
        canonical: candidate.canonical,
        error: error?.message || 'Falha ao padronizar o evento histórico.'
      });
    }
  }

  const remaining = Math.max(0, eventCandidates.length - eventsChanged);
  return {
    phase: 'events',
    changed: 0,
    merged: 0,
    eventsChanged,
    remaining,
    complete: remaining === 0 && errors.length === 0,
    errors
  };
}

export function isTelemedicineApi(pathname) {
  return isLegacyTelemedicineApi(pathname);
}

export async function handleTelemedicineRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') {
    return handleLegacyTelemedicineRoute(request, env, origin, originAllowed);
  }

  const url = new URL(request.url);
  const patientNameMatch = url.pathname.match(/^\/api\/telemedicina\/patients\/([a-f0-9]{20,64})\/name$/);
  const specialtyMatch = url.pathname.match(/^\/api\/telemedicina\/followups\/([a-f0-9]{20,64})\/specialty$/);
  const specialtyMaintenance = url.pathname === '/api/telemedicina/maintenance/specialties';
  const correctionRoute = Boolean(patientNameMatch || specialtyMatch) && request.method === 'PATCH';
  const maintenanceRoute = specialtyMaintenance && (request.method === 'GET' || request.method === 'POST');

  if (!correctionRoute && !maintenanceRoute) {
    return handleLegacyTelemedicineRoute(request, env, origin, originAllowed);
  }

  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const user = await authorizedUser(request, env);
  if (!user) return json({ error: 'Acesso exclusivo da Telemedicina ou do Desenvolvedor.' }, 403, origin);
  if (!firebaseConfigured(env)) {
    return json({ error: 'Firebase/Firestore ainda não está disponível para o módulo de Telemedicina.', code: 'FIREBASE_PENDING' }, 503, origin);
  }

  try {
    if (specialtyMaintenance) {
      if (!user.telemedicineAdmin) {
        return json({ error: 'Somente o Desenvolvedor pode unificar todas as especialidades.' }, 403, origin);
      }
      if (request.method === 'GET') {
        return json(await specialtyMaintenanceAudit(env), 200, origin);
      }
      const body = await request.json().catch(() => ({}));
      return json(await normalizeSpecialtiesBatch(env, user, body), 200, origin);
    }

    const body = await request.json().catch(() => ({}));
    if (patientNameMatch) {
      return json({ patient: await correctPatientName(env, user, patientNameMatch[1], body) }, 200, origin);
    }
    return json({ followup: await correctSpecialty(env, user, specialtyMatch[1], body) }, 200, origin);
  } catch (error) {
    return json({ error: error?.message || 'Não foi possível corrigir o cadastro.' }, Number(error?.status || 500), origin);
  }
}
