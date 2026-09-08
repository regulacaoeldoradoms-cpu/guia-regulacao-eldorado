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
      /*
       * O valor foi calculado pelo prazo em dias, não digitado manualmente.
       * A Telemedicina limpa o campo de dias em eventos input da data-alvo;
       * por isso a atualização automática usa change, preservando valores
       * com mais de um dígito (30, 60, 120 etc.) e atualizando a prévia.
       */
      dueInput.dispatchEvent(new Event('change', { bubbles: true }));
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

  function bindNativeDatePicker(input) {
    if (!input || input.type !== 'date' || typeof input.showPicker !== 'function') return;

    input.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
      if (input.disabled || input.readOnly) return;
      try {
        input.focus({ preventScroll: true });
        input.showPicker();
        /* Evita uma segunda tentativa do controle nativo no mesmo gesto. */
        event.preventDefault();
      } catch (_) {
        /* Em navegadores sem autorização para showPicker, mantém o fallback nativo. */
      }
    });
  }

  function installStableModalRendering() {
    if (document.getElementById('telemedicineFormStabilityStyle')) return;
    const style = document.createElement('style');
    style.id = 'telemedicineFormStabilityStyle';
    style.textContent = `
      @media (min-width: 861px) {
        html[data-portal-interactions="v1"] body.telemedicine-page.tm-context-desktop #consultationModal {
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
        }
        html[data-portal-interactions="v1"] body.telemedicine-page.tm-context-desktop #consultationModal > .portal-modal {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
          will-change: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  window.TelemedicineBusinessDay = { addDays, isBusinessDay, nextBusinessDay };

  document.addEventListener('DOMContentLoaded', () => {
    const consultation = document.getElementById('consultDate');
    const daysInput = document.getElementById('consultReturnDays');
    const dueInput = document.getElementById('consultReturnDate');
    const scheduleInput = document.getElementById('scheduleReturnDate');
    const requestedInput = document.getElementById('requestedDate');

    installStableModalRendering();
    [consultation, dueInput, scheduleInput, requestedInput].forEach(bindNativeDatePicker);

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
