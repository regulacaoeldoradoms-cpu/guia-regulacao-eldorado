'use strict';

(() => {
  const COMPLETED_STATUS = 'CONCLUÍDO';

  function installDischargeResponseVisibility() {
    const auth = window.RegulationAuth;
    if (!auth || auth.__telemedicineDischargeVisibilityV29 === true) return;
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
    auth.__telemedicineDischargeVisibilityV29 = true;
  }

  function ensureCompletedOption(filter) {
    if (!filter || filter.querySelector(`option[value="${COMPLETED_STATUS}"]`)) return;
    const option = document.createElement('option');
    option.value = COMPLETED_STATUS;
    option.textContent = 'Altas / conquistas';
    filter.appendChild(option);
  }

  function boot() {
    const button = document.getElementById('dischargeQueue');
    const filter = document.getElementById('statusFilter');
    if (!button || !filter) return;

    ensureCompletedOption(filter);

    const syncState = () => {
      const active = filter.value === COMPLETED_STATUS;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.setAttribute('title', active ? 'Voltar para todas as situações' : 'Mostrar somente pacientes com alta');
    };

    button.addEventListener('click', () => {
      filter.value = filter.value === COMPLETED_STATUS ? '' : COMPLETED_STATUS;
      filter.dispatchEvent(new Event('change', { bubbles: true }));
      syncState();
      document.querySelector('.telemedicine-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    filter.addEventListener('change', syncState);
    syncState();
  }

  installDischargeResponseVisibility();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
