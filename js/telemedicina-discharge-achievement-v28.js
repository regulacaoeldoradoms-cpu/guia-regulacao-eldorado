'use strict';

(() => {
  const root = typeof window === 'object' ? window : globalThis;

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isDischargeAchievementRow(row) {
    if (!(row instanceof Element) || !row.matches('[data-followup-row]')) return false;
    return row.getAttribute('data-status') === 'concluido';
  }

  function crownBadge() {
    const badge = document.createElement('span');
    badge.className = 'telemedicine-achievement-badge';
    badge.setAttribute('data-tm-discharge-achievement-v28', '');
    badge.setAttribute('aria-label', 'Alta do episódio');
    badge.innerHTML = '<svg class="telemedicine-achievement-crown" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5 8.2 11l3.8-6 3.8 6 4.7-3.5-1.7 9.2H5.2L3.5 7.5Z"/><path d="M6 19h12"/></svg><span>Alta</span>';
    return badge;
  }

  function decorateRow(row) {
    if (!isDischargeAchievementRow(row)) return;

    row.classList.add('is-discharge-achievement');
    row.setAttribute('data-achievement', 'discharge');

    const patientBlock = row.querySelector('.telemedicine-patient');
    if (patientBlock && !patientBlock.querySelector('[data-tm-discharge-achievement-v28]')) {
      const badge = crownBadge();
      const conditionLabel = patientBlock.querySelector('.telemedicine-condition-label');
      if (conditionLabel) patientBlock.insertBefore(badge, conditionLabel);
      else patientBlock.appendChild(badge);
    }

    const status = row.querySelector('.telemedicine-status');
    if (status) {
      status.textContent = 'ALTA';
      status.classList.add('is-achievement-status');
      status.setAttribute('aria-label', 'Alta do episódio concluída');
    }

    const dateBlock = row.querySelector('.telemedicine-date-block');
    if (dateBlock && dateBlock.getAttribute('data-tm-discharge-achievement-v28') !== '1') {
      dateBlock.setAttribute('data-tm-discharge-achievement-v28', '1');
      dateBlock.replaceChildren();

      const label = document.createElement('span');
      label.className = 'telemedicine-zone-label';
      label.textContent = 'Desfecho';

      const title = document.createElement('strong');
      title.textContent = 'Alta registrada';

      const note = document.createElement('small');
      note.className = 'telemedicine-achievement-note';
      note.textContent = 'Atendimento concluído no DigSaúde';

      dateBlock.append(label, title, note);
    }
  }

  function decorateAll(container = document) {
    container.querySelectorAll?.('[data-followup-row]').forEach(decorateRow);
  }

  function installCompletedFilter() {
    const filter = document.getElementById('statusFilter');
    if (!filter) return;
    let option = filter.querySelector('option[value="CONCLUÍDO"]');
    if (!option) {
      option = document.createElement('option');
      option.value = 'CONCLUÍDO';
      filter.appendChild(option);
    }
    option.textContent = 'Altas';
  }

  function boot() {
    installCompletedFilter();
    decorateAll();

    const list = document.getElementById('followupList');
    if (!list || typeof MutationObserver !== 'function') return;

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches('[data-followup-row]')) decorateRow(node);
          decorateAll(node);
        });
      });
    });
    observer.observe(list, { childList: true, subtree: true });
  }

  root.TelemedicineDischargeAchievementV28 = Object.freeze({
    decorateAll,
    isDischargeAchievementRow
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
