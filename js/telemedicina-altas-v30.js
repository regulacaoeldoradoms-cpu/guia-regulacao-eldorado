'use strict';

(() => {
  const COMPLETED_STATUS = 'CONCLUÍDO';

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isNonDischargeClosure(followup) {
    const resolution = normalize(followup?.resolution);
    return /\bDESISTIU\b|\bDESISTENCIA\b|ABANDONO DO TRATAMENTO|ENCAMINHAD[AO].*PRESENCIAL/.test(resolution);
  }

  function isDischargeAchievement(followup) {
    if (!followup || isNonDischargeClosure(followup)) return false;
    const mode = String(followup.followupMode || '').trim().toLowerCase();
    const resolution = normalize(followup.resolution);
    return followup.discharged === true
      || mode === 'discharge'
      || /\bALTA\b/.test(resolution);
  }

  function installDischargeResponseVisibility() {
    const auth = window.RegulationAuth;
    if (!auth || auth.__telemedicineDischargeVisibilityV30 === true) return;
    const baseApi = auth.api.bind(auth);
    auth.api = async (path, options = {}) => {
      const payload = await baseApi(path, options);
      const method = String(options.method || 'GET').toUpperCase();
      if (path === '/api/telemedicina/consultations' && method === 'POST') {
        const followup = payload?.followup;
        if (isDischargeAchievement(followup) && followup.status === COMPLETED_STATUS && followup.active === false) {
          payload.followup = { ...followup, active: true };
        }
      }
      return payload;
    };
    auth.__telemedicineDischargeVisibilityV30 = true;
  }

  function ensureCompletedOption(filter) {
    if (!filter) return;
    let option = filter.querySelector(`option[value="${COMPLETED_STATUS}"]`);
    if (!option) {
      option = document.createElement('option');
      option.value = COMPLETED_STATUS;
      filter.appendChild(option);
    }
    option.textContent = 'Altas';
  }

  function boot() {
    const button = document.getElementById('dischargeQueue');
    const filter = document.getElementById('statusFilter');
    const search = document.getElementById('telemedicineSearch');
    if (!button || !filter) return;

    ensureCompletedOption(filter);

    const syncState = () => {
      const active = filter.value === COMPLETED_STATUS;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.setAttribute(
        'title',
        active
          ? 'Filtro de altas ativo. Clique novamente para voltar.'
          : 'Mostrar somente pacientes com alta'
      );
      button.setAttribute(
        'aria-label',
        active
          ? 'Filtro de altas ativo. Clique novamente para mostrar todas as situações.'
          : 'Mostrar somente pacientes com alta'
      );
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest?.('#dischargeQueue');
      if (!trigger) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const activating = filter.value !== COMPLETED_STATUS;
      if (activating && search?.value) {
        search.value = '';
        search.dispatchEvent(new Event('input', { bubbles: true }));
      }
      filter.value = activating ? COMPLETED_STATUS : '';
      filter.dispatchEvent(new Event('change', { bubbles: true }));
      syncState();
      document.querySelector('.telemedicine-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, true);

    filter.addEventListener('change', syncState);
    syncState();
  }

  installDischargeResponseVisibility();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
