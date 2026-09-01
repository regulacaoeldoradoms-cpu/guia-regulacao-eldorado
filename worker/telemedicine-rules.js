'use strict';

export function clean(value, max = 500) {
  return String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);
}

export function normalizeText(value) {
  return clean(value, 500)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\.{3,}/g, ' ')
    .replace(/[^A-Z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function dateValid(value) {
  const text = String(value || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const date = new Date(`${text}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === text;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(value, amount) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Number(amount || 0));
  return isoDate(date);
}

export function isBusinessDay(value) {
  const date = new Date(`${value}T12:00:00Z`);
  const weekday = date.getUTCDay();
  return weekday !== 0 && weekday !== 6;
}

export function nextBusinessDay(value) {
  let cursor = value;
  while (!isBusinessDay(cursor)) cursor = addDays(cursor, 1);
  return cursor;
}

export function normalizeReturnDueDate(value) {
  if (!dateValid(value)) return '';
  return nextBusinessDay(value);
}

export function threeBusinessReminders(returnDueDate) {
  if (!dateValid(returnDueDate)) return [];
  const normalizedDueDate = normalizeReturnDueDate(returnDueDate);
  const target = addDays(normalizedDueDate, -15);
  const reminders = [];
  let cursor = nextBusinessDay(target);
  while (reminders.length < 3) {
    if (isBusinessDay(cursor)) reminders.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return reminders;
}

export function deriveFollowupStatus(followup, today) {
  if (followup?.active === false) return 'CONCLUÍDO';
  if (followup?.requestedAt || followup?.requestedHistorical === true) return 'SOLICITADO';
  const dueDate = clean(followup?.returnDueDate, 10);
  if (!dateValid(dueDate)) return 'SEM PROGRAMAÇÃO';
  const reminders = Array.isArray(followup?.reminderDates) && followup.reminderDates.length === 3
    ? followup.reminderDates
    : threeBusinessReminders(dueDate);
  if (!reminders.length) return 'SEM PROGRAMAÇÃO';
  if (today < reminders[0]) return 'EM AGUARDO';
  if (today > reminders[2]) return 'ATRASADO';
  return 'SOLICITAR';
}

export function reminderMetaFor(followup, today) {
  const reminders = Array.isArray(followup?.reminderDates) ? followup.reminderDates : [];
  const exact = reminders.indexOf(today);
  return {
    alertToday: exact >= 0 && !followup?.requestedAt && followup?.requestedHistorical !== true,
    reminderNumber: exact >= 0 ? exact + 1 : 0,
    remindersRemaining: reminders.filter((date) => date >= today).length,
    reminderDates: reminders
  };
}

export function looksClosed(resolution) {
  const text = normalizeText(resolution);
  if (!text) return false;
  return /\bCONCLUID[AO]\b|\bALTA\b|RETORNO SE NECESSARIO|NAO NECESSITA RETORNO|TRATAMENTO FINALIZADO|FINALIZOU TRATAMENTO|ENCAMINHAD[AO].*PRESENCIAL/.test(text);
}

export function looksRequested(resolution, comment = '') {
  if (looksClosed(resolution)) return false;
  const text = `${normalizeText(resolution)} ${normalizeText(comment)}`;
  return /\bSOLICITAD[AO]\b|REALIZADA NOVA SOLICITACAO|REAGENDAMENTO SOLICITADO/.test(text);
}

export function explicitReturnDays(resolution) {
  const text = normalizeText(resolution);
  const patterns = [
    /RETORNO(?:\s+APOS|\s+COM|\s+EM)?\s+(\d{1,3})\s+DIAS?\b/,
    /RET(?:ORNO)?(?:\s+APOS|\s+COM|\s+EM)?\s+(\d{1,3})\s+DIAS?\b/,
    /RETORNAR\s+(?:APOS|COM|EM)?\s*(\d{1,3})\s+DIAS?\b/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const days = Number(match[1]);
      if (Number.isInteger(days) && days > 0 && days <= 730) return days;
    }
  }
  return 0;
}

export function returnDueFromRecord(date, resolution, explicitDueDate = '') {
  if (dateValid(explicitDueDate)) return normalizeReturnDueDate(explicitDueDate);
  if (!dateValid(date)) return '';
  const days = explicitReturnDays(resolution);
  return days ? normalizeReturnDueDate(addDays(date, days)) : '';
}
