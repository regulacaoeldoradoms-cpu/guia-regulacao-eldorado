'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const rows = document.getElementById('councilRows');
  const toolbar = document.querySelector('.council-toolbar');
  if (!auth || !rows || !toolbar) return;

  const user = await auth.me({ allowCached: false }).catch(() => null);
  const canDelete = Boolean(user && (user.role === 'admin' || user.councilRole === 'presidente'));
  if (!canDelete) return;

  const selected = new Set();
  let pendingProtocols = [];
  let deleting = false;

  const trashSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/></svg>';
  const warningSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 19h18.4z"/><path d="M12 9v4"/><path d="M12 16.5h.01"/></svg>';

  const batchBar = document.createElement('div');
  batchBar.className = 'council-delete-toolbar';
  batchBar.innerHTML = `
    <label class="council-select-all">
      <input id="councilSelectVisible" type="checkbox">
      <span>Selecionar visíveis</span>
    </label>
    <span class="council-selected-count" id="councilSelectedCount">Nenhuma selecionada</span>
    <button class="council-delete-selected" id="councilDeleteSelected" type="button" disabled>
      ${trashSvg}<span>Excluir selecionadas</span>
    </button>`;
  toolbar.insertAdjacentElement('afterend', batchBar);

  const dialog = document.createElement('div');
  dialog.className = 'council-delete-dialog-backdrop';
  dialog.id = 'councilDeleteDialog';
  dialog.hidden = true;
  dialog.setAttribute('aria-hidden', 'true');
  dialog.innerHTML = `
    <div class="council-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="councilDeleteTitle">
      <div class="council-delete-danger">${warningSvg}</div>
      <h2 id="councilDeleteTitle">Excluir manifestação?</h2>
      <p id="councilDeleteText">Esta manifestação deixará de aparecer no painel e na área do cidadão.</p>
      <div class="council-delete-protocols" id="councilDeleteProtocols"></div>
      <div class="council-delete-audit">A exclusão ficará registrada para auditoria, com usuário e data da ação.</div>
      <div class="council-delete-dialog-actions">
        <button class="council-delete-cancel" id="councilDeleteCancel" type="button">Cancelar</button>
        <button class="council-delete-confirm" id="councilDeleteConfirm" type="button">${trashSvg}<span>Excluir</span></button>
      </div>
    </div>`;
  document.body.appendChild(dialog);

  const toast = document.createElement('div');
  toast.className = 'council-delete-toast';
  toast.hidden = true;
  document.body.appendChild(toast);

  const master = document.getElementById('councilSelectVisible');
  const countEl = document.getElementById('councilSelectedCount');
  const batchButton = document.getElementById('councilDeleteSelected');
  const dialogTitle = document.getElementById('councilDeleteTitle');
  const dialogText = document.getElementById('councilDeleteText');
  const protocolList = document.getElementById('councilDeleteProtocols');
  const confirmButton = document.getElementById('councilDeleteConfirm');
  const cancelButton = document.getElementById('councilDeleteCancel');

  function visibleRows() {
    return [...rows.querySelectorAll('tr[data-protocol]')];
  }

  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `council-delete-toast ${type}`;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 4200);
  }

  function syncControls() {
    const total = selected.size;
    countEl.textContent = total === 0 ? 'Nenhuma selecionada' : total === 1 ? '1 selecionada' : `${total} selecionadas`;
    batchButton.disabled = total === 0 || deleting;

    const visible = visibleRows();
    const visibleSelected = visible.filter((row) => selected.has(row.dataset.protocol)).length;
    master.checked = visible.length > 0 && visibleSelected === visible.length;
    master.indeterminate = visibleSelected > 0 && visibleSelected < visible.length;

    visible.forEach((row) => {
      const input = row.querySelector('.council-row-select input');
      if (input) input.checked = selected.has(row.dataset.protocol);
      row.classList.toggle('is-selected-for-delete', selected.has(row.dataset.protocol));
    });
  }

  function rowCheckbox(protocol) {
    const label = document.createElement('label');
    label.className = 'council-row-select';
    label.title = `Selecionar ${protocol}`;
    label.setAttribute('aria-label', `Selecionar manifestação ${protocol}`);
    label.innerHTML = '<input type="checkbox"><span class="council-checkmark" aria-hidden="true"></span>';
    const input = label.querySelector('input');
    input.checked = selected.has(protocol);
    input.addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('change', (event) => {
      event.stopPropagation();
      if (input.checked) selected.add(protocol);
      else selected.delete(protocol);
      syncControls();
    });
    label.addEventListener('click', (event) => event.stopPropagation());
    return label;
  }

  function rowDeleteButton(protocol) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'council-row-delete';
    button.title = `Excluir ${protocol}`;
    button.setAttribute('aria-label', `Excluir manifestação ${protocol}`);
    button.innerHTML = trashSvg;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openConfirmation([protocol]);
    });
    return button;
  }

  function augmentRows() {
    visibleRows().forEach((row) => {
      const protocol = String(row.dataset.protocol || '');
      if (!protocol) return;
      const firstCell = row.cells[0];
      const lastCell = row.cells[row.cells.length - 1];
      if (!firstCell || !lastCell) return;

      firstCell.classList.add('council-protocol-cell');
      if (!firstCell.querySelector('.council-row-select')) firstCell.prepend(rowCheckbox(protocol));

      lastCell.classList.add('council-update-cell');
      if (!lastCell.querySelector('.council-row-delete')) lastCell.appendChild(rowDeleteButton(protocol));
    });
    syncControls();
  }

  function renderProtocolSummary(protocols) {
    const shown = protocols.slice(0, 6);
    protocolList.innerHTML = shown.map((protocol) => `<span>${protocol}</span>`).join('');
    if (protocols.length > shown.length) {
      protocolList.insertAdjacentHTML('beforeend', `<span>+${protocols.length - shown.length} outra(s)</span>`);
    }
  }

  function openConfirmation(protocols) {
    pendingProtocols = [...new Set(protocols)].filter(Boolean);
    if (!pendingProtocols.length) return;
    const plural = pendingProtocols.length > 1;
    dialogTitle.textContent = plural ? 'Excluir manifestações selecionadas?' : 'Excluir manifestação?';
    dialogText.textContent = plural
      ? `${pendingProtocols.length} manifestações deixarão de aparecer no painel e na área dos respectivos cidadãos.`
      : 'Esta manifestação deixará de aparecer no painel e na área do cidadão.';
    confirmButton.querySelector('span').textContent = plural ? `Excluir ${pendingProtocols.length}` : 'Excluir';
    renderProtocolSummary(pendingProtocols);
    dialog.hidden = false;
    dialog.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => dialog.classList.add('open'));
    setTimeout(() => cancelButton.focus(), 30);
  }

  function closeConfirmation() {
    if (deleting) return;
    dialog.classList.remove('open');
    dialog.setAttribute('aria-hidden', 'true');
    setTimeout(() => { dialog.hidden = true; pendingProtocols = []; }, 160);
  }

  async function performDelete() {
    if (deleting || !pendingProtocols.length) return;
    deleting = true;
    confirmButton.disabled = true;
    cancelButton.disabled = true;
    const original = confirmButton.innerHTML;
    confirmButton.innerHTML = '<span>Excluindo...</span>';
    try {
      const payload = await auth.api('/api/council/manifestations/delete', {
        method: 'POST',
        body: JSON.stringify({ protocols: pendingProtocols })
      });
      const deleted = Array.isArray(payload?.deleted) ? payload.deleted : [];
      deleted.forEach((protocol) => selected.delete(protocol));
      const amount = deleted.length;
      dialog.classList.remove('open');
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
      pendingProtocols = [];
      showToast(amount === 1 ? 'Manifestação excluída.' : `${amount} manifestações excluídas.`);
      document.getElementById('refreshCouncil')?.click();
    } catch (error) {
      showToast(error.message || 'Não foi possível excluir a manifestação.', 'error');
    } finally {
      deleting = false;
      confirmButton.disabled = false;
      cancelButton.disabled = false;
      confirmButton.innerHTML = original;
      syncControls();
    }
  }

  master.addEventListener('change', () => {
    visibleRows().forEach((row) => {
      if (master.checked) selected.add(row.dataset.protocol);
      else selected.delete(row.dataset.protocol);
    });
    syncControls();
  });

  batchButton.addEventListener('click', () => openConfirmation([...selected]));
  cancelButton.addEventListener('click', closeConfirmation);
  confirmButton.addEventListener('click', performDelete);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeConfirmation(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden && !deleting) closeConfirmation();
  });

  const observer = new MutationObserver(augmentRows);
  observer.observe(rows, { childList: true, subtree: true });
  augmentRows();
})();
