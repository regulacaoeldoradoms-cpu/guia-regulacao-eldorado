'use strict';

(() => {
  const detail = document.getElementById('receptionDetail');
  if (!detail) return;

  let applying = false;

  function setSelectState(select, value) {
    if (!select) return;
    select.value = value;
    select.dataset.state = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function checkboxControl(text, className, checked = false) {
    const label = document.createElement('label');
    label.className = `fast-check ${className}`;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    const mark = document.createElement('span');
    mark.className = 'fast-check-mark';
    mark.setAttribute('aria-hidden', 'true');
    const caption = document.createElement('span');
    caption.className = 'fast-check-label';
    caption.textContent = text;
    label.append(input, mark, caption);
    return { label, input };
  }

  function syncConditional(applies, brought, select) {
    if (!applies.checked) {
      brought.checked = false;
      setSelectState(select, 'na');
      return;
    }
    setSelectState(select, brought.checked ? 'ok' : 'missing');
  }

  function transformRow(row) {
    if (row.dataset.fastChecklist === '1') return;
    const select = row.querySelector('.reception-status');
    if (!select) return;

    row.dataset.fastChecklist = '1';
    select.classList.add('fast-check-hidden');

    const controls = document.createElement('div');
    controls.className = 'fast-check-controls';
    const type = row.dataset.type;

    if (type === 'mandatory') {
      const brought = checkboxControl('Trouxe / anexado', 'fast-check-primary', select.value === 'ok');
      controls.appendChild(brought.label);
      brought.input.addEventListener('change', () => {
        setSelectState(select, brought.input.checked ? 'ok' : 'missing');
        window.requestAnimationFrame(refreshSummary);
      });
      if (select.value === 'pending') setSelectState(select, 'missing');
    } else if (type === 'conditional') {
      const applies = checkboxControl('Aplica-se', 'fast-check-secondary', select.value === 'ok' || select.value === 'missing');
      const brought = checkboxControl('Trouxe', 'fast-check-primary', select.value === 'ok');
      controls.append(applies.label, brought.label);

      applies.input.addEventListener('change', () => {
        syncConditional(applies.input, brought.input, select);
        window.requestAnimationFrame(refreshSummary);
      });
      brought.input.addEventListener('change', () => {
        if (brought.input.checked) applies.input.checked = true;
        syncConditional(applies.input, brought.input, select);
        window.requestAnimationFrame(refreshSummary);
      });
      if (select.value === 'pending') setSelectState(select, 'na');
    } else {
      const brought = checkboxControl('Trouxe / disponível', 'fast-check-optional', select.value === 'ok');
      controls.appendChild(brought.label);
      brought.input.addEventListener('change', () => {
        setSelectState(select, brought.input.checked ? 'ok' : 'na');
        window.requestAnimationFrame(refreshSummary);
      });
      if (select.value === 'pending') setSelectState(select, 'na');
    }

    row.appendChild(controls);
  }

  function updateGroupText() {
    const mandatory = detail.querySelector('.reception-group[data-group="mandatory"] > header p');
    const conditional = detail.querySelector('.reception-group[data-group="conditional"] > header p');
    const available = detail.querySelector('.reception-group[data-group="available"] > header p');
    if (mandatory) mandatory.textContent = 'Marque o que o paciente trouxe ou o que já está anexado. O que ficar desmarcado será considerado faltando.';
    if (conditional) conditional.textContent = 'Marque “Aplica-se” somente quando necessário para este caso. Depois marque “Trouxe” se o item foi apresentado.';
    if (available) available.textContent = 'Marque se o paciente trouxe. Estes itens não entram automaticamente como pendência.';
  }

  function buttonLabels() {
    const top = document.getElementById('clearReceptionChecklist');
    const bottom = document.getElementById('clearReceptionChecklistBottom');
    if (top) top.textContent = '✓ Marcar obrigatórios como apresentados';
    if (bottom) bottom.textContent = 'Desmarcar tudo';
  }

  function currentFastState() {
    const mandatory = [...detail.querySelectorAll('.reception-item[data-type="mandatory"]')];
    const conditional = [...detail.querySelectorAll('.reception-item[data-type="conditional"]')];
    const missingMandatory = mandatory.filter((row) => !row.querySelector('.fast-check-primary input')?.checked);
    const applicableConditional = conditional.filter((row) => row.querySelector('.fast-check-secondary input')?.checked);
    const missingConditional = applicableConditional.filter((row) => !row.querySelector('.fast-check-primary input')?.checked);
    const presentedMandatory = mandatory.length - missingMandatory.length;
    const presentedConditional = applicableConditional.length - missingConditional.length;
    return {
      mandatory,
      conditional,
      missing: [...missingMandatory, ...missingConditional],
      applicableConditional,
      presented: presentedMandatory + presentedConditional,
      totalRequired: mandatory.length + applicableConditional.length
    };
  }

  function refreshSummary() {
    const summary = document.getElementById('receptionSummary');
    if (!summary) return;
    const title = document.getElementById('receptionSummaryTitle');
    const text = document.getElementById('receptionSummaryText');
    const printButton = document.getElementById('printMissingItems');
    const state = currentFastState();

    summary.classList.toggle('has-missing', state.missing.length > 0);
    if (state.missing.length) {
      title.textContent = `${state.missing.length} item(ns) faltando`;
      text.textContent = `${state.presented} de ${state.totalRequired} item(ns) necessários marcados como apresentados.`;
    } else if (state.totalRequired) {
      title.textContent = 'Conferência concluída';
      text.textContent = 'Todos os itens necessários foram marcados como apresentados.';
    } else {
      title.textContent = 'Conferência rápida';
      text.textContent = 'Marque apenas os itens apresentados pelo paciente.';
    }
    if (printButton) printButton.disabled = state.missing.length === 0;
  }

  function applyFastChecklist() {
    if (applying) return;
    applying = true;
    observer.disconnect();
    try {
      detail.querySelectorAll('.reception-item').forEach(transformRow);
      updateGroupText();
      buttonLabels();
      refreshSummary();
    } finally {
      observer.observe(detail, { childList: true, subtree: true });
      applying = false;
    }
  }

  function markMandatoryPresented() {
    detail.querySelectorAll('.reception-item[data-type="mandatory"]').forEach((row) => {
      const checkbox = row.querySelector('.fast-check-primary input');
      const select = row.querySelector('.reception-status');
      if (checkbox) checkbox.checked = true;
      setSelectState(select, 'ok');
    });
    refreshSummary();
  }

  function clearAll() {
    detail.querySelectorAll('.reception-item').forEach((row) => {
      const select = row.querySelector('.reception-status');
      const type = row.dataset.type;
      const primary = row.querySelector('.fast-check-primary input');
      const secondary = row.querySelector('.fast-check-secondary input');
      if (primary) primary.checked = false;
      if (secondary) secondary.checked = false;
      setSelectState(select, type === 'mandatory' ? 'missing' : 'na');
    });
    refreshSummary();
  }

  document.addEventListener('click', (event) => {
    const top = event.target.closest('#clearReceptionChecklist');
    const bottom = event.target.closest('#clearReceptionChecklistBottom');
    if (!top && !bottom) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (top) markMandatoryPresented();
    else clearAll();
  }, true);

  const observer = new MutationObserver(() => window.queueMicrotask(applyFastChecklist));
  observer.observe(detail, { childList: true, subtree: true });
  applyFastChecklist();
})();
