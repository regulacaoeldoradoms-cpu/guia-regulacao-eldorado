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

  function checkboxControl(className, checked, ariaLabel) {
    const label = document.createElement('label');
    label.className = `fast-check ${className}`;
    label.title = ariaLabel;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    input.setAttribute('aria-label', ariaLabel);

    const mark = document.createElement('span');
    mark.className = 'fast-check-mark';
    mark.setAttribute('aria-hidden', 'true');

    label.append(input, mark);
    return { label, input };
  }

  function transformRow(row) {
    if (row.dataset.fastChecklist === '2') return;
    const select = row.querySelector('.reception-status');
    if (!select) return;

    row.dataset.fastChecklist = '2';
    select.classList.add('fast-check-hidden');

    row.querySelector('.fast-check-controls')?.remove();

    const controls = document.createElement('div');
    controls.className = 'fast-check-controls';
    const type = row.dataset.type;

    const presented = checkboxControl(
      type === 'mandatory' ? 'fast-check-primary' : 'fast-check-optional',
      select.value === 'ok',
      type === 'mandatory' ? 'Marcar item como apresentado' : 'Marcar item como apresentado, se disponível'
    );
    controls.appendChild(presented.label);

    presented.input.addEventListener('change', () => {
      if (type === 'mandatory') setSelectState(select, presented.input.checked ? 'ok' : 'missing');
      else setSelectState(select, presented.input.checked ? 'ok' : 'na');
      window.requestAnimationFrame(refreshSummary);
    });

    if (type === 'mandatory' && select.value !== 'ok') setSelectState(select, 'missing');
    if (type !== 'mandatory' && select.value !== 'ok') setSelectState(select, 'na');

    row.appendChild(controls);
  }

  function updateGroupText() {
    const mandatory = detail.querySelector('.reception-group[data-group="mandatory"] > header p');
    const conditional = detail.querySelector('.reception-group[data-group="conditional"] > header p');
    const available = detail.querySelector('.reception-group[data-group="available"] > header p');
    if (mandatory) mandatory.textContent = 'Marque a caixa somente quando o paciente trouxe o item ou ele já está anexado.';
    if (conditional) conditional.textContent = 'Marque somente quando o item se aplicar ao caso e tiver sido apresentado. Desmarcado não gera pendência automática.';
    if (available) available.textContent = 'Marque somente se o paciente já possuir ou tiver apresentado. Estes itens não são cobrados automaticamente.';
  }

  function buttonLabels() {
    const top = document.getElementById('clearReceptionChecklist');
    const bottom = document.getElementById('clearReceptionChecklistBottom');
    if (top) top.textContent = '✓ Marcar obrigatórios';
    if (bottom) bottom.textContent = 'Desmarcar tudo';
  }

  function currentFastState() {
    const rows = [...detail.querySelectorAll('.reception-item')];
    const mandatory = rows.filter((row) => row.dataset.type === 'mandatory');
    const checked = rows.filter((row) => row.querySelector('.fast-check input')?.checked);
    const missingMandatory = mandatory.filter((row) => !row.querySelector('.fast-check input')?.checked);
    return {
      rows,
      mandatory,
      checked,
      missingMandatory,
      anyMarked: checked.length > 0,
      presentedMandatory: mandatory.length - missingMandatory.length
    };
  }

  function refreshSummary() {
    const summary = document.getElementById('receptionSummary');
    if (!summary) return;

    const title = document.getElementById('receptionSummaryTitle');
    const text = document.getElementById('receptionSummaryText');
    const printButton = document.getElementById('printMissingItems');
    const state = currentFastState();

    summary.classList.toggle('has-missing', state.anyMarked && state.missingMandatory.length > 0);

    if (!state.anyMarked) {
      title.textContent = 'Orientação completa disponível';
      text.textContent = 'Nenhum item marcado. A impressão incluirá a lista completa para conferência, separando obrigatórios e itens conforme o caso.';
      if (printButton) {
        printButton.disabled = false;
        printButton.textContent = 'Imprimir orientação completa';
      }
      return;
    }

    if (state.missingMandatory.length) {
      title.textContent = `${state.missingMandatory.length} item(ns) obrigatório(s) ainda não marcado(s)`;
      text.textContent = `${state.presentedMandatory} de ${state.mandatory.length} item(ns) obrigatório(s) apresentados.`;
      if (printButton) {
        printButton.disabled = false;
        printButton.textContent = 'Imprimir orientação do que falta';
      }
      return;
    }

    title.textContent = 'Conferência concluída';
    text.textContent = 'Todos os itens obrigatórios foram marcados como apresentados.';
    if (printButton) {
      printButton.disabled = true;
      printButton.textContent = 'Nenhum obrigatório faltando';
    }
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
      const checkbox = row.querySelector('.fast-check input');
      const select = row.querySelector('.reception-status');
      if (checkbox) checkbox.checked = true;
      setSelectState(select, 'ok');
    });
    refreshSummary();
  }

  function clearAll() {
    detail.querySelectorAll('.reception-item').forEach((row) => {
      const select = row.querySelector('.reception-status');
      const checkbox = row.querySelector('.fast-check input');
      if (checkbox) checkbox.checked = false;
      setSelectState(select, row.dataset.type === 'mandatory' ? 'missing' : 'na');
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
