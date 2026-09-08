'use strict';

(() => {
  const auth = window.RegulationAuth;
  const MODAL_SELECTOR = '.telemedicine-page .modal-backdrop.open';
  const inertState = new Map();
  let pendingDelete = null;

  function activeModal() {
    const open = document.querySelectorAll(MODAL_SELECTOR);
    return open.length ? open[open.length - 1] : null;
  }

  function restoreElement(element) {
    if (!inertState.has(element)) return;
    const previous = inertState.get(element);
    if (previous) element.setAttribute('inert', '');
    else element.removeAttribute('inert');
    if ('inert' in element) element.inert = Boolean(previous);
    element.removeAttribute('data-tm-modal-inert');
    inertState.delete(element);
  }

  function isolateBackground() {
    const modal = activeModal();
    document.documentElement.classList.toggle('tm-telemedicine-modal-active', Boolean(modal));

    [...inertState.keys()].forEach((element) => {
      if (!modal || element === modal || !element.isConnected) restoreElement(element);
    });

    if (!modal || !document.body) return;
    [...document.body.children].forEach((element) => {
      if (!(element instanceof HTMLElement) || element === modal || element.tagName === 'SCRIPT') return;
      if (inertState.has(element)) return;
      inertState.set(element, element.hasAttribute('inert') || Boolean(element.inert));
      element.setAttribute('inert', '');
      if ('inert' in element) element.inert = true;
      element.setAttribute('data-tm-modal-inert', 'true');
    });
  }

  function guardOutsideInteraction(event) {
    const modal = activeModal();
    if (!modal) return;
    const target = event.target;
    if (target instanceof Node && modal.contains(target)) return;
    if (event.cancelable) event.preventDefault();
    event.stopImmediatePropagation();
  }

  function focusables(modal) {
    return [...modal.querySelectorAll('button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
  }

  function keepFocusInside(event) {
    const modal = activeModal();
    if (!modal || modal.contains(event.target)) return;
    event.stopImmediatePropagation();
    focusables(modal)[0]?.focus?.({ preventScroll: true });
  }

  function trapTab(event) {
    if (event.key !== 'Tab') return;
    const modal = activeModal();
    if (!modal) return;
    const items = focusables(modal);
    if (!items.length) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  ['pointerdown', 'mousedown', 'mouseup', 'touchstart', 'click'].forEach((type) => {
    document.addEventListener(type, guardOutsideInteraction, { capture: true });
  });
  document.addEventListener('focusin', keepFocusInside, { capture: true });
  document.addEventListener('keydown', trapTab, { capture: true });

  function trashIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/></svg>';
  }

  function ensureDeleteModal() {
    let modal = document.getElementById('deleteFollowupModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'deleteFollowupModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('data-portal-interaction-ignore', 'true');
    modal.innerHTML = `<section class="portal-modal telemedicine-modal compact tm-delete-modal" role="dialog" aria-modal="true" aria-labelledby="deleteFollowupTitle">
      <div class="portal-modal-header">
        <div><h2 id="deleteFollowupTitle">Excluir registro</h2><div class="user-meta" id="deleteFollowupMeta"></div></div>
        <button class="portal-modal-close" type="button" data-tm-delete-cancel aria-label="Fechar confirmação">×</button>
      </div>
      <p class="tm-delete-copy"><strong>Confirma a exclusão deste acompanhamento?</strong> Ele deixará de aparecer nos cards e nos retornos ativos.</p>
      <p class="tm-delete-note">Este acompanhamento será removido da lista de retornos ativos. As informações já registradas no histórico serão preservadas.</p>
      <div class="account-actions">
        <button class="portal-button secondary" type="button" data-tm-delete-cancel>Cancelar</button>
        <button class="portal-button danger tm-delete-confirm-button" id="confirmDeleteFollowup" type="button">${trashIcon()}<span>Excluir registro</span></button>
      </div>
      <div class="account-status tm-delete-status" id="deleteFollowupStatus" aria-live="polite"></div>
    </section>`;
    document.body.appendChild(modal);

    modal.querySelectorAll('[data-tm-delete-cancel]').forEach((button) => button.addEventListener('click', closeDeleteModal));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeDeleteModal();
    });
    modal.querySelector('#confirmDeleteFollowup')?.addEventListener('click', deletePendingFollowup);
    return modal;
  }

  function openDeleteModal(row) {
    const id = row?.dataset.followupRow || '';
    if (!id) return;
    const patient = row.querySelector('.telemedicine-patient > button[data-action="patient"]')?.textContent?.trim() || 'Paciente';
    const specialty = row.querySelector('.telemedicine-specialty-block strong')?.textContent?.trim() || 'Especialidade não informada';
    pendingDelete = { id, row, patient, specialty };
    const modal = ensureDeleteModal();
    const meta = modal.querySelector('#deleteFollowupMeta');
    if (meta) meta.textContent = `${patient} · ${specialty}`;
    const status = modal.querySelector('#deleteFollowupStatus');
    if (status) status.className = 'account-status tm-delete-status';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    isolateBackground();
    window.setTimeout(() => modal.querySelector('[data-tm-delete-cancel]')?.focus?.({ preventScroll: true }), 0);
  }

  function closeDeleteModal() {
    const modal = document.getElementById('deleteFollowupModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    pendingDelete = null;
    isolateBackground();
  }

  async function deletePendingFollowup() {
    if (!pendingDelete?.id || !auth?.api) return;
    const modal = document.getElementById('deleteFollowupModal');
    const status = modal?.querySelector('#deleteFollowupStatus');
    const button = modal?.querySelector('#confirmDeleteFollowup');
    if (!button) return;
    button.disabled = true;
    if (status) {
      status.textContent = 'Excluindo registro…';
      status.className = 'account-status visible info tm-delete-status';
    }
    try {
      await auth.api(`/api/telemedicina/followups/${encodeURIComponent(pendingDelete.id)}`, { method: 'DELETE' });
      pendingDelete.row?.remove();
      if (status) {
        status.textContent = 'Registro excluído da lista de acompanhamentos.';
        status.className = 'account-status visible success tm-delete-status';
      }
      window.setTimeout(() => location.reload(), 420);
    } catch (error) {
      if (status) {
        status.textContent = error?.message || 'Não foi possível excluir o registro.';
        status.className = 'account-status visible error tm-delete-status';
      }
      button.disabled = false;
    }
  }

  function appendDeleteButton(row) {
    if (!(row instanceof Element) || row.querySelector('[data-telemedicine-delete]')) return;
    const id = row.getAttribute('data-followup-row');
    const actions = row.querySelector(':scope > .telemedicine-actions');
    if (!id || !actions) return;
    const button = document.createElement('button');
    button.className = 'portal-button telemedicine-delete-button';
    button.type = 'button';
    button.setAttribute('data-telemedicine-delete', id);
    button.setAttribute('aria-label', 'Excluir este registro de acompanhamento');
    button.innerHTML = `${trashIcon()}<span>Excluir</span>`;
    actions.appendChild(button);
    actions.dataset.actionCount = String(actions.querySelectorAll('button').length);
  }

  function scanDeleteButtons(root = document) {
    if (root instanceof Element && root.matches?.('#followupList .telemedicine-row')) appendDeleteButton(root);
    root.querySelectorAll?.('#followupList .telemedicine-row').forEach(appendDeleteButton);
  }

  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-telemedicine-delete]') : null;
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openDeleteModal(button.closest('[data-followup-row]'));
  }, { capture: true });

  function markTelemedicineModalsAsStable(root = document) {
    if (root instanceof Element && root.matches?.('.telemedicine-page .modal-backdrop')) {
      root.setAttribute('data-portal-interaction-ignore', 'true');
    }
    root.querySelectorAll?.('.telemedicine-page .modal-backdrop').forEach((modal) => {
      modal.setAttribute('data-portal-interaction-ignore', 'true');
    });
  }

  function modalStateMutation(mutation) {
    if (mutation.type === 'attributes') {
      return mutation.target instanceof Element && mutation.target.classList.contains('modal-backdrop');
    }
    if (mutation.type !== 'childList') return false;
    return [...mutation.addedNodes].some((node) => node instanceof Element && (
      node.classList.contains('modal-backdrop') || Boolean(node.querySelector?.('.modal-backdrop'))
    ));
  }

  function boot() {
    markTelemedicineModalsAsStable();
    ensureDeleteModal();
    scanDeleteButtons();
    isolateBackground();
    const observer = new MutationObserver((mutations) => {
      let needsIsolation = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            scanDeleteButtons(node);
            markTelemedicineModalsAsStable(node);
          });
        }
        if (modalStateMutation(mutation)) needsIsolation = true;
      });
      if (needsIsolation) isolateBackground();
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'aria-hidden', 'hidden']
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
