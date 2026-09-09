'use strict';

(() => {
  const COMPLETED_STATUS = 'CONCLUÍDO';
  const MOBILE_ALERTS_QUERY = '(max-width: 860px), (pointer: coarse) and (max-device-width: 900px)';

  function installDischargeResponseVisibility() {
    const auth = window.RegulationAuth;
    if (!auth || auth.__telemedicineDischargeVisibilityV30 === true) return;
    const baseApi = auth.api.bind(auth);
    auth.api = async (path, options = {}) => {
      const payload = await baseApi(path, options);
      const method = String(options.method || 'GET').toUpperCase();
      if (path === '/api/telemedicina/consultations' && method === 'POST') {
        const followup = payload?.followup;
        if (followup?.discharged === true && followup.status === COMPLETED_STATUS && followup.active === false) {
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

  function isMobileAlertsControl() {
    try {
      return typeof window.matchMedia === 'function' && window.matchMedia(MOBILE_ALERTS_QUERY).matches;
    } catch (_) {
      return false;
    }
  }

  function boot() {
    const button = document.getElementById('dischargeQueue');
    const alertsButton = document.getElementById('enableNotifications');
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

      if (alertsButton) {
        if (active && isMobileAlertsControl()) {
          alertsButton.dataset.returnFromAltas = 'true';
          alertsButton.setAttribute('title', 'Voltar aos avisos');
          alertsButton.setAttribute('aria-label', 'Voltar aos avisos da Telemedicina');
        } else {
          delete alertsButton.dataset.returnFromAltas;
          alertsButton.removeAttribute('title');
          alertsButton.removeAttribute('aria-label');
        }
      }
    };

    const clearSearch = () => {
      if (!search?.value) return;
      search.value = '';
      search.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const showAllSituations = () => {
      clearSearch();
      filter.value = '';
      filter.dispatchEvent(new Event('change', { bubbles: true }));
      syncState();
      document.querySelector('.telemedicine-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('click', (event) => {
      const dischargeTrigger = event.target.closest?.('#dischargeQueue');
      if (dischargeTrigger) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const activating = filter.value !== COMPLETED_STATUS;
        if (activating) clearSearch();
        filter.value = activating ? COMPLETED_STATUS : '';
        filter.dispatchEvent(new Event('change', { bubbles: true }));
        syncState();
        document.querySelector('.telemedicine-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      const alertsTrigger = event.target.closest?.('#enableNotifications');
      if (!alertsTrigger || filter.value !== COMPLETED_STATUS || !isMobileAlertsControl()) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      showAllSituations();
    }, true);

    filter.addEventListener('change', syncState);
    syncState();
  }

  installDischargeResponseVisibility();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
