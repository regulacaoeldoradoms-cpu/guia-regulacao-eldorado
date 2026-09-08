'use strict';

(() => {
  if (!/^\/telemedicina\/?$/.test(window.location.pathname)) return;

  const READY_SENTINEL = '__TM_ALREADY_DONE_V25__';
  const OTHER_FALLBACK_DETAIL = 'OUTRA CONDIÇÃO';
  const OTHER_RESOLUTION = 'RETORNO APÓS OUTRA CONDIÇÃO';

  function safeJsonBody(options) {
    if (!options || typeof options.body !== 'string') return null;
    try { return JSON.parse(options.body); } catch (_) { return null; }
  }

  function installApiAdapter() {
    const baseAuth = window.RegulationAuth;
    if (!baseAuth || baseAuth.__telemedicineOtherConditionV26 === true) return;

    const wrappedApi = async (path, options = {}) => {
      if (path === '/api/telemedicina/consultations' && String(options.method || 'GET').toUpperCase() === 'POST') {
        const body = safeJsonBody(options);
        if (body) {
          const mode = String(body.followupMode || '').trim().toLowerCase();
          const conditionType = String(body.conditionType || '').trim().toLowerCase();
          if (mode === 'conditional' && conditionType === 'other') {
            const ready = body.conditionDetail === READY_SENTINEL;
            body.resolution = OTHER_RESOLUTION;
            if (!ready) body.conditionDetail = OTHER_FALLBACK_DETAIL;
            options = { ...options, body: JSON.stringify(body) };
          }
        }
      }
      return baseAuth.api(path, options);
    };

    window.RegulationAuth = Object.freeze({
      ...baseAuth,
      api: wrappedApi,
      __telemedicineOtherConditionV26: true
    });
  }

  function ensureOtherOption(select) {
    if (!(select instanceof HTMLSelectElement)) return;
    if (select.querySelector('option[value="other"]')) return;
    const option = document.createElement('option');
    option.value = 'other';
    option.textContent = 'Outra condição';
    select.appendChild(option);
  }

  function removeDetailUi(input) {
    if (!(input instanceof HTMLInputElement)) return;
    input.type = 'hidden';
    input.required = false;
    input.removeAttribute('placeholder');
    input.setAttribute('aria-hidden', 'true');

    const field = input.closest('.portal-field, label');
    if (!field || field === input) return;
    const parent = field.parentElement;
    if (!parent) return;
    parent.insertBefore(input, field);
    field.remove();
  }

  function adaptConditionalUi(root = document) {
    const scope = root instanceof Document || root instanceof Element ? root : document;
    scope.querySelectorAll('select#consultConditionType, select[name="conditionType"]').forEach(ensureOtherOption);
    scope.querySelectorAll('#consultConditionDetail, input[name="conditionDetail"]').forEach(removeDetailUi);
  }

  function selectedMode(form) {
    return form.querySelector('input[name="consultOutcome"]:checked')?.value
      || form.elements?.followupMode?.value
      || '';
  }

  function prepareOtherCondition(form) {
    if (!(form instanceof HTMLFormElement) || selectedMode(form) !== 'conditional') return;
    const select = form.querySelector('#consultConditionType, select[name="conditionType"]');
    const detail = form.querySelector('#consultConditionDetail, input[name="conditionDetail"]');
    if (!select || !detail || select.value !== 'other') return;
    detail.required = false;
    if (detail.value !== READY_SENTINEL) detail.value = OTHER_FALLBACK_DETAIL;
  }

  document.addEventListener('submit', (event) => {
    prepareOtherCondition(event.target);
  }, true);

  function inspectElement(element) {
    if (!(element instanceof Element)) return;
    adaptConditionalUi(element);
  }

  function installObserver() {
    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => inspectElement(node)));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function boot() {
    adaptConditionalUi(document);
    installObserver();
  }

  installApiAdapter();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
