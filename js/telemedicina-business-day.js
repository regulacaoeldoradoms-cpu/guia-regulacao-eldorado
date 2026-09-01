'use strict';

(() => {
  function dateValid(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
  }

  function addDays(value, amount) {
    const date = new Date(`${value}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + Number(amount || 0));
    return date.toISOString().slice(0, 10);
  }

  function isBusinessDay(value) {
    if (!dateValid(value)) return false;
    const weekday = new Date(`${value}T12:00:00Z`).getUTCDay();
    return weekday !== 0 && weekday !== 6;
  }

  function nextBusinessDay(value) {
    if (!dateValid(value)) return '';
    let cursor = value;
    while (!isBusinessDay(cursor)) cursor = addDays(cursor, 1);
    return cursor;
  }

  function syncConsultationTarget() {
    const consultation = document.getElementById('consultDate');
    const daysInput = document.getElementById('consultReturnDays');
    const dueInput = document.getElementById('consultReturnDate');
    if (!consultation || !daysInput || !dueInput) return;
    const days = Number(daysInput.value || 0);
    if (!consultation.value || !Number.isInteger(days) || days <= 0) return;
    const target = nextBusinessDay(addDays(consultation.value, days));
    if (target && dueInput.value !== target) {
      dueInput.value = target;
      dueInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function normalizeDateInput(input) {
    if (!input?.value) return;
    const normalized = nextBusinessDay(input.value);
    if (normalized && normalized !== input.value) {
      input.value = normalized;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  window.TelemedicineBusinessDay = { addDays, isBusinessDay, nextBusinessDay };

  document.addEventListener('DOMContentLoaded', () => {
    const consultation = document.getElementById('consultDate');
    const daysInput = document.getElementById('consultReturnDays');
    const dueInput = document.getElementById('consultReturnDate');
    const scheduleInput = document.getElementById('scheduleReturnDate');

    consultation?.addEventListener('input', syncConsultationTarget);
    daysInput?.addEventListener('input', syncConsultationTarget);
    dueInput?.addEventListener('change', () => normalizeDateInput(dueInput));
    scheduleInput?.addEventListener('change', () => normalizeDateInput(scheduleInput));

    document.getElementById('consultationForm')?.addEventListener('submit', () => {
      if (Number(daysInput?.value || 0) > 0) syncConsultationTarget();
      else normalizeDateInput(dueInput);
    }, true);

    document.getElementById('scheduleForm')?.addEventListener('submit', () => normalizeDateInput(scheduleInput), true);
  });
})();
