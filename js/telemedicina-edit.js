'use strict';

(() => {
  const auth = window.RegulationAuth;
  if (!auth) return;

  const style = document.createElement('style');
  style.textContent = `
    .telemedicine-inline-edit {
      appearance: none !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 30px !important;
      height: 30px !important;
      min-width: 30px !important;
      min-height: 30px !important;
      margin-left: 6px !important;
      padding: 0 !important;
      border: 1px solid #bfd5e1 !important;
      border-radius: 999px !important;
      background: #fff !important;
      color: #245a79 !important;
      font: 800 1rem/1 system-ui, sans-serif !important;
      text-decoration: none !important;
      vertical-align: middle !important;
      cursor: pointer !important;
      box-shadow: 0 2px 7px rgba(19, 58, 88, .08) !important;
    }
    .telemedicine-inline-edit:hover,
    .telemedicine-inline-edit:focus-visible {
      background: #eaf5fa !important;
      border-color: #7fb4cf !important;
      color: #0d4f79 !important;
      outline: none !important;
    }
    .telemedicine-inline-edit svg {
      width: 15px;
      height: 15px;
      pointer-events: none;
    }
    .telemedicine-specialty-block > div > .telemedicine-inline-edit {
      margin-left: 5px !important;
      transform: translateY(1px);
    }
    .telemedicine-edit-modal .portal-field input {
      text-transform: none;
    }
    .telemedicine-edit-help {
      margin: -4px 0 2px;
      color: #647c8f;
      font-size: .8rem;
      line-height: 1.4;
    }
    @media (max-width: 860px), (pointer: coarse) and (max-device-width: 900px) {
      .telemedicine-inline-edit {
        width: 34px !important;
        height: 34px !important;
        min-width: 34px !important;
        min-height: 34px !important;
        margin-left: 7px !important;
      }
      .telemedicine-page.tm-view-grid .telemedicine-patient > button[data-action="patient"] {
        display: inline !important;
        -webkit-line-clamp: unset !important;
        -webkit-box-orient: initial !important;
        white-space: normal !important;
        overflow: visible !important;
        text-overflow: clip !important;
        min-height: 0 !important;
        overflow-wrap: anywhere !important;
      }
      .telemedicine-page.tm-view-grid .telemedicine-patient {
        min-height: 0 !important;
      }
      .telemedicine-page.tm-view-grid .telemedicine-specialty-block > div {
        min-width: 0 !important;
      }
      .telemedicine-page.tm-view-grid .telemedicine-specialty-block strong {
        overflow-wrap: anywhere !important;
      }
    }
  `;
  document.head.appendChild(style);

  const pencilIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.96 1.96 3.75 3.75 2.13-1.79Z"/></svg>';

  let editContext = null;

  function escapeSelector(value) {
    if (window.CSS?.escape) return CSS.escape(String(value || ''));
    return String(value || '').replace(/(["\\])/g, '\\$1');
  }

  function createEditButton(kind, row, currentValue) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'telemedicine-inline-edit';
    button.dataset.telemedicineEdit = kind;
    button.dataset.currentValue = currentValue || '';
    button.dataset.followup = row.dataset.followupRow || '';
    const patientButton = row.querySelector('.telemedicine-patient > button[data-action="patient"]');
    button.dataset.patient = patientButton?.dataset.patient || '';
    button.setAttribute('aria-label', kind === 'patient' ? 'Corrigir nome do paciente' : 'Corrigir especialidade');
    button.title = kind === 'patient' ? 'Corrigir nome do paciente' : 'Corrigir especialidade';
    button.innerHTML = pencilIcon;
    return button;
  }

  function decorateRow(row) {
    if (!(row instanceof HTMLElement)) return;
    const patientBlock = row.querySelector('.telemedicine-patient');
    const patientButton = patientBlock?.querySelector(':scope > button[data-action="patient"]');
    if (patientBlock && patientButton && !patientBlock.querySelector(':scope > [data-telemedicine-edit="patient"]')) {
      patientButton.insertAdjacentElement('afterend', createEditButton('patient', row, patientButton.textContent.trim()));
    }

    const specialtyHost = row.querySelector('.telemedicine-specialty-block > div');
    const specialty = specialtyHost?.querySelector(':scope > strong');
    if (specialtyHost && specialty && !specialtyHost.querySelector(':scope > [data-telemedicine-edit="specialty"]')) {
      specialty.insertAdjacentElement('afterend', createEditButton('specialty', row, specialty.textContent.trim()));
    }
  }

  function decorateAll() {
    document.querySelectorAll('#followupList [data-followup-row]').forEach(decorateRow);
  }

  function buildModal() {
    if (document.getElementById('telemedicineEditModal')) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'telemedicineEditModal';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML = `
      <form class="portal-modal telemedicine-modal compact telemedicine-edit-modal" id="telemedicineEditForm">
        <div class="portal-modal-header">
          <div><h2 id="telemedicineEditTitle">Corrigir cadastro</h2><div class="user-meta" id="telemedicineEditMeta"></div></div>
          <button class="portal-modal-close" type="button" data-telemedicine-edit-close>×</button>
        </div>
        <div class="telemedicine-form-grid one-column">
          <div class="portal-field">
            <label for="telemedicineEditValue" id="telemedicineEditLabel">Novo valor</label>
            <input id="telemedicineEditValue" required maxlength="160" autocomplete="off">
          </div>
          <p class="telemedicine-edit-help" id="telemedicineEditHelp"></p>
          <div class="account-actions">
            <button class="portal-button primary" id="telemedicineEditSave" type="submit">Salvar correção</button>
            <button class="portal-button secondary" type="button" data-telemedicine-edit-close>Cancelar</button>
          </div>
          <div class="account-status" id="telemedicineEditStatus" aria-live="polite"></div>
        </div>
      </form>`;
    document.body.appendChild(backdrop);

    backdrop.querySelectorAll('[data-telemedicine-edit-close]').forEach((button) => button.addEventListener('click', closeEditModal));
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) closeEditModal(); });
    backdrop.querySelector('#telemedicineEditForm').addEventListener('submit', saveCorrection);
  }

  function showStatus(message, type = 'error') {
    const el = document.getElementById('telemedicineEditStatus');
    if (!el) return;
    el.textContent = message;
    el.className = `account-status visible ${type}`;
  }

  function openEditModal(button) {
    buildModal();
    const kind = button.dataset.telemedicineEdit;
    const row = button.closest('[data-followup-row]');
    if (!row || !['patient', 'specialty'].includes(kind)) return;

    const patientButton = row.querySelector('.telemedicine-patient > button[data-action="patient"]');
    const specialty = row.querySelector('.telemedicine-specialty-block strong');
    const currentValue = kind === 'patient' ? patientButton?.textContent.trim() : specialty?.textContent.trim();
    editContext = {
      kind,
      patientId: patientButton?.dataset.patient || button.dataset.patient || '',
      followupId: row.dataset.followupRow || button.dataset.followup || '',
      currentValue: currentValue || button.dataset.currentValue || ''
    };

    const title = document.getElementById('telemedicineEditTitle');
    const meta = document.getElementById('telemedicineEditMeta');
    const label = document.getElementById('telemedicineEditLabel');
    const input = document.getElementById('telemedicineEditValue');
    const help = document.getElementById('telemedicineEditHelp');
    const status = document.getElementById('telemedicineEditStatus');

    status.className = 'account-status';
    status.textContent = '';
    input.maxLength = kind === 'patient' ? 160 : 120;
    input.value = editContext.currentValue;
    title.textContent = kind === 'patient' ? 'Corrigir nome do paciente' : 'Corrigir especialidade';
    label.textContent = kind === 'patient' ? 'Nome completo correto' : 'Nome da especialidade por extenso';
    meta.textContent = kind === 'patient' ? 'A correção vale para todo o histórico agrupado deste paciente.' : (patientButton?.textContent.trim() || 'Acompanhamento de Telemedicina');
    help.textContent = kind === 'patient'
      ? 'Se o nome já estiver completo neste campo, os “...” vistos na grade eram apenas corte visual. Corrija somente quando o cadastro realmente estiver abreviado ou incorreto.'
      : 'Evite abreviações como “REUMATO”. Prefira o nome por extenso, por exemplo “REUMATOLOGIA”.';

    const backdrop = document.getElementById('telemedicineEditModal');
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => { input.focus(); input.select(); });
  }

  function closeEditModal() {
    const backdrop = document.getElementById('telemedicineEditModal');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    editContext = null;
  }

  async function saveCorrection(event) {
    event.preventDefault();
    if (!editContext) return;
    const input = document.getElementById('telemedicineEditValue');
    const saveButton = document.getElementById('telemedicineEditSave');
    const value = input.value.trim();
    if (value.length < 3) return showStatus('Informe um valor completo antes de salvar.', 'error');
    if (value === editContext.currentValue) return showStatus('Nenhuma alteração foi feita.', 'error');

    saveButton.disabled = true;
    saveButton.textContent = 'Salvando…';
    try {
      if (editContext.kind === 'patient') {
        await auth.api(`/api/telemedicina/patients/${encodeURIComponent(editContext.patientId)}/name`, {
          method: 'PATCH',
          body: JSON.stringify({ name: value })
        });
      } else {
        await auth.api(`/api/telemedicina/followups/${encodeURIComponent(editContext.followupId)}/specialty`, {
          method: 'PATCH',
          body: JSON.stringify({ specialty: value })
        });
      }
      showStatus('Correção salva. Atualizando os acompanhamentos…', 'success');
      setTimeout(() => location.reload(), 550);
    } catch (error) {
      showStatus(error.message || 'Não foi possível salvar a correção.', 'error');
      saveButton.disabled = false;
      saveButton.textContent = 'Salvar correção';
    }
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-telemedicine-edit]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    openEditModal(button);
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById('telemedicineEditModal')?.classList.contains('open')) closeEditModal();
  });

  const list = document.getElementById('followupList');
  if (list) {
    const observer = new MutationObserver(() => decorateAll());
    observer.observe(list, { childList: true, subtree: true, characterData: true });
  }

  buildModal();
  decorateAll();
})();
