'use strict';

(() => {
  const root = typeof window === 'object' ? window : globalThis;
  const ABSENCE_RESOLUTION = 'FALTA DO PACIENTE';
  const followups = new Map();
  const copyFeedbackTimers = new WeakMap();

  function clean(value) {
    return String(value ?? '')
      .replace(/[\u0000-\u001f\u007f]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalize(value) {
    return clean(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  function formatDate(value) {
    const text = clean(value);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : (text || 'não informada');
  }

  function sentenceDetail(value) {
    return clean(value).replace(/[.!?;:,\s]+$/g, '').trim();
  }

  function isAbsence(item) {
    const mode = clean(item?.followupMode).toLowerCase();
    return item?.absence === true
      || mode === 'absence'
      || normalize(item?.resolution) === ABSENCE_RESOLUTION;
  }

  function absenceReasonFor(item) {
    return sentenceDetail(item?.absenceReason) || sentenceDetail(item?.notes);
  }

  function defaultAbsenceReason() {
    return 'Nova solicitação de retorno devido ao não comparecimento do paciente no atendimento anterior.';
  }

  function buildAbsenceText(item, baseJustification = root.TelemedicineJustification) {
    const reason = clean(baseJustification?.reasonFor?.(item)) || defaultAbsenceReason();
    const justification = absenceReasonFor(item) || 'não informada';
    return `Data da última consulta: ${formatDate(item?.lastConsultationDate)}. ${reason} Justificativa: ${justification}.`;
  }

  function cacheItem(item) {
    if (!item?.id) return;
    followups.set(String(item.id), item);
  }

  function cachePayload(payload) {
    if (!payload || typeof payload !== 'object') return;
    if (Array.isArray(payload.followups)) payload.followups.forEach(cacheItem);
    if (payload.followup && typeof payload.followup === 'object') cacheItem(payload.followup);
    if (payload.id && payload.patientId && payload.specialty) cacheItem(payload);
  }

  function installApiCache() {
    const baseAuth = root.RegulationAuth;
    if (!baseAuth || baseAuth.__telemedicineAbsenceReasonV27 === true) return;

    const wrappedApi = async (path, options = {}) => {
      const payload = await baseAuth.api(path, options);
      if (String(path || '').startsWith('/api/telemedicina/')) cachePayload(payload);
      return payload;
    };

    root.RegulationAuth = Object.freeze({
      ...baseAuth,
      api: wrappedApi,
      __telemedicineAbsenceReasonV27: true
    });
  }

  async function write(text) {
    const clipboard = root.navigator?.clipboard;
    if (clipboard?.writeText) {
      try {
        await clipboard.writeText(text);
        return;
      } catch (_) {}
    }

    const documentRef = root.document;
    if (!documentRef?.body || typeof documentRef.execCommand !== 'function') {
      throw new Error('A cópia não está disponível neste navegador.');
    }

    const textarea = documentRef.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.setAttribute('aria-hidden', 'true');
    textarea.style.position = 'fixed';
    textarea.style.inset = '-9999px auto auto -9999px';
    documentRef.body.appendChild(textarea);
    let copied = false;
    try {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      copied = documentRef.execCommand('copy');
    } finally {
      textarea.remove();
    }
    if (!copied) throw new Error('Não foi possível copiar a justificativa.');
  }

  function restoreButton(button) {
    if (!button?.isConnected) return;
    button.textContent = button.dataset.copyLabel || 'Copiar motivo';
    button.setAttribute('aria-label', button.dataset.copyAriaLabel || 'Copiar justificativa da solicitação');
    button.classList.remove('is-copied', 'is-copy-error');
  }

  function installCopyAdapter() {
    const base = root.TelemedicineJustification;
    if (!base || base.__telemedicineAbsenceReasonV27 === true) return;

    const build = (item) => isAbsence(item) ? buildAbsenceText(item, base) : base.build(item);
    const copyFromButton = async (button, item) => {
      if (!isAbsence(item)) return base.copyFromButton(button, item);
      if (!button || !base.isAvailable(item)) return false;

      const existingTimer = copyFeedbackTimers.get(button);
      if (existingTimer) root.clearTimeout(existingTimer);
      if (!button.dataset.copyLabel) button.dataset.copyLabel = clean(button.textContent) || 'Copiar motivo';
      if (!button.dataset.copyAriaLabel) button.dataset.copyAriaLabel = button.getAttribute('aria-label') || 'Copiar justificativa da solicitação';

      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.classList.remove('is-copied', 'is-copy-error');
      button.textContent = 'Copiando…';
      try {
        await write(build(item));
        button.textContent = 'Copiado';
        button.setAttribute('aria-label', 'Justificativa copiada');
        button.classList.add('is-copied');
        root.PortalInteractions?.notify?.('copy', 'Justificativa copiada.', button);
        return true;
      } catch (_) {
        button.textContent = 'Tente novamente';
        button.setAttribute('aria-label', 'Não foi possível copiar; tente novamente');
        button.classList.add('is-copy-error');
        root.PortalInteractions?.notify?.('error', 'Não foi possível copiar a justificativa.', button);
        return false;
      } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        const timer = root.setTimeout(() => restoreButton(button), 2400);
        copyFeedbackTimers.set(button, timer);
      }
    };

    root.TelemedicineJustification = Object.freeze({
      ...base,
      build,
      copyFromButton,
      absenceReasonFor,
      __telemedicineAbsenceReasonV27: true
    });
  }

  function decorateRow(row) {
    if (!(row instanceof Element) || !row.matches('[data-followup-row]')) return;
    const item = followups.get(String(row.getAttribute('data-followup-row') || ''));
    const existing = row.querySelector('[data-tm-absence-reason-v27]');

    if (!item || !isAbsence(item)) {
      existing?.remove();
      return;
    }

    const reason = absenceReasonFor(item) || 'Não informada';
    const patientBlock = row.querySelector('.telemedicine-patient');
    const resolution = patientBlock?.querySelector(':scope > small');
    if (!patientBlock || !resolution) return;

    let box = existing;
    if (!box) {
      box = document.createElement('div');
      box.className = 'tm-absence-reason-v27';
      box.setAttribute('data-tm-absence-reason-v27', '');
      resolution.insertAdjacentElement('afterend', box);
    }

    const desired = `Justificativa: ${reason}`;
    if (box.textContent.trim() === desired) return;
    box.replaceChildren();
    const label = document.createElement('strong');
    label.textContent = 'Justificativa:';
    box.append(label, document.createTextNode(` ${reason}`));
  }

  function decorateAll(container = root.document) {
    if (!container?.querySelectorAll) return;
    container.querySelectorAll('[data-followup-row]').forEach(decorateRow);
  }

  function inspectElement(element) {
    if (!(element instanceof Element)) return;
    if (element.matches('[data-followup-row]')) decorateRow(element);
    element.querySelectorAll?.('[data-followup-row]').forEach(decorateRow);
  }

  function boot() {
    decorateAll();
    const list = root.document?.getElementById('followupList');
    if (!list || typeof MutationObserver !== 'function') return;
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => inspectElement(node));
        const row = record.target instanceof Element ? record.target.closest?.('[data-followup-row]') : null;
        if (row) decorateRow(row);
      });
    });
    observer.observe(list, { childList: true, subtree: true });
  }

  root.TelemedicineAbsenceReasonV27 = Object.freeze({
    absenceReasonFor,
    buildAbsenceText,
    cachePayload,
    isAbsence
  });

  installApiCache();
  installCopyAdapter();

  if (!root.document) return;
  if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
