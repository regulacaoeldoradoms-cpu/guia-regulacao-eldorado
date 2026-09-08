'use strict';

(() => {
  if (!/^\/telemedicina\/?$/.test(window.location.pathname)) return;

  const ABSENCE_MODE = 'absence';
  const WITHDRAWN_MODE = 'withdrawn';
  const IN_PERSON_MODE = 'in_person';
  const READY_SENTINEL = '__TM_ALREADY_DONE_V25__';
  const ABSENCE_RESOLUTION = 'FALTA DO PACIENTE';
  const WITHDRAWN_RESOLUTION = 'PACIENTE DESISTIU DO TRATAMENTO';
  const IN_PERSON_RESOLUTION = 'ENCAMINHADO PARA ATENDIMENTO PRESENCIAL';

  const ICONS = Object.freeze({
    absence: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h14a2 2 0 0 1 2 2v13H3v-13a2 2 0 0 1 2-2Z"/><path d="M7 2v5M17 2v5M3 9h18"/><path d="m8.5 12.5 7 7m0-7-7 7"/></svg>',
    withdrawn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h11"/><path d="m9 7-5 5 5 5"/><path d="M13 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6"/></svg>',
    inPerson: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16"/><path d="M6 20V8l6-4 6 4v12"/><path d="M9 11h6M9 14h6M11 20v-3h2v3"/><path d="m15.5 6.5 3 0m-1.5-1.5 1.5 1.5L17 8"/></svg>',
    ready: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 8.5"/></svg>'
  });

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function setLabelText(label, text) {
    if (!label) return;
    const node = [...label.childNodes].find((item) => item.nodeType === Node.TEXT_NODE && item.textContent.trim());
    if (node) node.textContent = text;
  }

  function showOperationalError(target, message, className) {
    if (!target) return;
    target.textContent = message;
    target.className = className;
  }

  function safeJsonBody(options) {
    if (!options || typeof options.body !== 'string') return null;
    try { return JSON.parse(options.body); } catch (_) { return null; }
  }

  function installApiAdapter() {
    const baseAuth = window.RegulationAuth;
    if (!baseAuth || baseAuth.__telemedicineOutcomesV25 === true) return;

    const wrappedApi = async (path, options = {}) => {
      if (path === '/api/telemedicina/consultations' && String(options.method || 'GET').toUpperCase() === 'POST') {
        const body = safeJsonBody(options);
        if (body) {
          const mode = String(body.followupMode || '').trim().toLowerCase();
          if (mode === WITHDRAWN_MODE) {
            Object.assign(body, {
              followupMode: 'withdrawn-record-v25',
              discharged: true,
              needsReturn: false,
              resolution: WITHDRAWN_RESOLUTION,
              returnDays: 0,
              returnDueDate: '',
              conditionType: '',
              conditionDetail: '',
              notes: ''
            });
          } else if (mode === IN_PERSON_MODE) {
            Object.assign(body, {
              followupMode: 'in-person-record-v25',
              discharged: true,
              needsReturn: false,
              resolution: IN_PERSON_RESOLUTION,
              returnDays: 0,
              returnDueDate: '',
              conditionType: '',
              conditionDetail: '',
              notes: ''
            });
          } else if (mode === 'conditional' && body.conditionDetail === READY_SENTINEL) {
            const baseResolution = String(body.resolution || 'RETORNO APÓS CONDIÇÃO').replace(/\s+-\s+JÁ REALIZADO\s*$/i, '').trim();
            Object.assign(body, {
              followupMode: 'conditional-ready-v25',
              discharged: false,
              needsReturn: true,
              resolution: `${baseResolution} - JÁ REALIZADO`,
              returnDays: 0,
              returnDueDate: '',
              conditionType: '',
              conditionDetail: ''
            });
          }
          options = { ...options, body: JSON.stringify(body) };
        }
      }
      return baseAuth.api(path, options);
    };

    window.RegulationAuth = Object.freeze({
      ...baseAuth,
      api: wrappedApi,
      __telemedicineOutcomesV25: true
    });
  }

  function choiceMarkup(name, mode, title, detail, icon, id = '') {
    return `<input${id ? ` id="${id}"` : ''} name="${name}" type="radio" value="${mode}"><span class="telemedicine-choice-icon" aria-hidden="true">${icon}</span><span><strong>${title}</strong><small>${detail}</small></span>`;
  }

  function dateLabelFor(mode) {
    if (mode === ABSENCE_MODE) return 'Data da falta';
    if (mode === WITHDRAWN_MODE) return 'Data da desistência';
    if (mode === IN_PERSON_MODE) return 'Data do encaminhamento';
    return 'Data da última consulta';
  }

  function isClosedMode(mode) {
    return mode === 'discharge' || mode === WITHDRAWN_MODE || mode === IN_PERSON_MODE;
  }

  function desktopMode(form) {
    return form?.querySelector('input[name="consultOutcome"]:checked')?.value || 'scheduled';
  }

  function setReadyState(button, detailInput, ready) {
    if (detailInput) detailInput.value = ready ? READY_SENTINEL : '';
    if (button) {
      button.setAttribute('aria-pressed', ready ? 'true' : 'false');
      button.classList.toggle('is-ready', ready);
      const label = button.querySelector('[data-tm-ready-label]');
      if (label) label.textContent = ready ? 'Já realizado' : 'Já realizado';
      const hint = button.querySelector('[data-tm-ready-hint]');
      if (hint) hint.textContent = ready ? 'Entrará em Solicitar agora' : 'Marque se a condição já foi concluída';
    }
  }

  function readyButtonMarkup(id = '') {
    return `<button${id ? ` id="${id}"` : ''} class="tm-condition-ready-toggle" type="button" aria-pressed="false">${ICONS.ready}<span><strong data-tm-ready-label>Já realizado</strong><small data-tm-ready-hint>Marque se a condição já foi concluída</small></span></button>`;
  }

  function syncDesktopForm(form) {
    if (!form) return;
    const mode = desktopMode(form);
    const absence = mode === ABSENCE_MODE;
    const conditional = mode === 'conditional';
    const closed = isClosedMode(mode);
    const fields = document.getElementById('consultFollowupFields');
    const scheduled = document.getElementById('consultScheduledFields');
    const conditionalPanel = document.getElementById('consultConditionalFields');
    const absencePanel = document.getElementById('consultAbsenceFields');
    const reason = document.getElementById('consultAbsenceReason');
    const notesField = form.querySelector('.telemedicine-notes-field');
    const preview = document.getElementById('consultPreview');
    const dateLabel = form.querySelector('label[for="consultDate"]');
    const detailInput = document.getElementById('consultConditionDetail');
    const readyButton = document.getElementById('consultConditionReady');

    if (dateLabel) dateLabel.textContent = dateLabelFor(mode);
    if (absencePanel) {
      absencePanel.hidden = !absence;
      absencePanel.setAttribute('aria-hidden', absence ? 'false' : 'true');
    }
    if (reason) reason.required = absence;

    if (fields) {
      const hideAll = closed && !absence;
      fields.hidden = hideAll;
      fields.setAttribute('aria-hidden', hideAll ? 'true' : 'false');
    }
    if (scheduled) scheduled.hidden = mode !== 'scheduled';
    if (conditionalPanel) conditionalPanel.hidden = !conditional;
    if (notesField) notesField.hidden = closed || absence;
    if (preview) preview.hidden = closed || absence;

    if (!conditional) setReadyState(readyButton, detailInput, false);

    if (absence) {
      const returnDays = document.getElementById('consultReturnDays');
      const returnDate = document.getElementById('consultReturnDate');
      if (returnDays) returnDays.value = '';
      if (returnDate) returnDate.value = '';
      setReadyState(readyButton, detailInput, false);
      return;
    }

    if (closed) {
      const returnDays = document.getElementById('consultReturnDays');
      const returnDate = document.getElementById('consultReturnDate');
      const notes = document.getElementById('consultNotes');
      if (returnDays) returnDays.value = '';
      if (returnDate) returnDate.value = '';
      if (notes) notes.value = '';
      setReadyState(readyButton, detailInput, false);
      return;
    }

    if (conditional && detailInput?.value === READY_SENTINEL && preview) {
      preview.hidden = false;
      preview.innerHTML = '<strong>Condição já realizada:</strong> este registro entrará imediatamente em “Solicitar agora”, sem criar data ou lembretes artificiais.';
    }
  }

  function installDesktopForm() {
    const form = document.getElementById('consultationForm');
    const grid = form?.querySelector('.telemedicine-choice-grid');
    const fields = document.getElementById('consultFollowupFields');
    if (!form || !grid || !fields || form.dataset.tmOutcomesV25 === 'true') return;
    form.dataset.tmOutcomesV25 = 'true';

    const legend = form.querySelector('.telemedicine-outcome-picker legend');
    if (legend) legend.textContent = 'Qual foi o resultado deste atendimento?';

    if (!document.getElementById('consultOutcomeAbsence')) {
      const choice = document.createElement('label');
      choice.className = 'telemedicine-choice absence';
      choice.innerHTML = choiceMarkup('consultOutcome', ABSENCE_MODE, 'Falta', 'Paciente não compareceu e precisa ser solicitado novamente.', ICONS.absence, 'consultOutcomeAbsence');
      grid.appendChild(choice);
    }

    if (!document.getElementById('consultOutcomeWithdrawn')) {
      const choice = document.createElement('label');
      choice.className = 'telemedicine-choice withdrawn';
      choice.innerHTML = choiceMarkup('consultOutcome', WITHDRAWN_MODE, 'Desistiu', 'Registra o encerramento por desistência, sem alertas.', ICONS.withdrawn, 'consultOutcomeWithdrawn');
      grid.appendChild(choice);
    }

    if (!document.getElementById('consultOutcomeInPerson')) {
      const choice = document.createElement('label');
      choice.className = 'telemedicine-choice in-person';
      choice.innerHTML = choiceMarkup('consultOutcome', IN_PERSON_MODE, 'Encaminhado para presencial', 'Registra que o acompanhamento não pôde ser concluído por telemedicina.', ICONS.inPerson, 'consultOutcomeInPerson');
      grid.appendChild(choice);
    }

    let absencePanel = document.getElementById('consultAbsenceFields');
    if (!absencePanel) {
      absencePanel = document.createElement('div');
      absencePanel.className = 'telemedicine-mode-panel absence';
      absencePanel.id = 'consultAbsenceFields';
      absencePanel.hidden = true;
      absencePanel.setAttribute('aria-hidden', 'true');
      absencePanel.innerHTML = '<div class="portal-field"><label for="consultAbsenceReason">Justificativa da falta</label><textarea id="consultAbsenceReason" maxlength="1500" rows="4" placeholder="Informe por que o paciente não compareceu"></textarea><small>Obrigatório. Esta informação ficará registrada no histórico.</small></div>';
      document.getElementById('consultConditionalFields')?.insertAdjacentElement('afterend', absencePanel);
    }

    const conditionSelect = document.getElementById('consultConditionType');
    conditionSelect?.querySelector('option[value="other"]')?.remove();
    const detailInput = document.getElementById('consultConditionDetail');
    const detailField = detailInput?.closest('.portal-field');
    if (detailInput) {
      detailInput.type = 'hidden';
      detailInput.required = false;
      detailInput.value = '';
    }
    if (detailField) detailField.hidden = true;

    if (!document.getElementById('consultConditionReady')) {
      const readyField = document.createElement('div');
      readyField.className = 'portal-field tm-condition-ready-field';
      readyField.innerHTML = `<span class="tm-condition-ready-title">Condição concluída?</span>${readyButtonMarkup('consultConditionReady')}`;
      document.getElementById('consultConditionalFields')?.appendChild(readyField);
      readyField.querySelector('button')?.addEventListener('click', () => {
        const button = document.getElementById('consultConditionReady');
        const ready = button?.getAttribute('aria-pressed') !== 'true';
        setReadyState(button, detailInput, ready);
        syncDesktopForm(form);
      });
    }

    form.addEventListener('change', (event) => {
      if (event.target?.id === 'consultConditionType') {
        setReadyState(document.getElementById('consultConditionReady'), detailInput, false);
      }
      if (event.target?.name === 'consultOutcome' || event.target?.id === 'consultConditionType') {
        queueMicrotask(() => syncDesktopForm(form));
      }
    });

    form.addEventListener('submit', (event) => {
      if (desktopMode(form) !== ABSENCE_MODE) return;
      const reason = document.getElementById('consultAbsenceReason');
      const value = reason?.value.trim() || '';
      if (value.length < 3) {
        event.preventDefault();
        event.stopImmediatePropagation();
        reason?.focus({ preventScroll: true });
        showOperationalError(document.getElementById('consultationStatus'), 'Justifique a falta do paciente.', 'account-status full visible error');
        return;
      }
      const notes = document.getElementById('consultNotes');
      if (notes) notes.value = value;
    }, true);

    document.getElementById('openConsultation')?.addEventListener('click', () => {
      queueMicrotask(() => {
        const reason = document.getElementById('consultAbsenceReason');
        if (reason) reason.value = '';
        setReadyState(document.getElementById('consultConditionReady'), detailInput, false);
        syncDesktopForm(form);
      });
    });

    syncDesktopForm(form);
  }

  function mobileMode(form) {
    return form?.elements?.followupMode?.value || 'scheduled';
  }

  function syncMobileForm(form) {
    if (!form) return;
    const mode = mobileMode(form);
    const absence = mode === ABSENCE_MODE;
    const conditional = mode === 'conditional';
    const closed = isClosedMode(mode);
    const absenceField = form.querySelector('[data-tm-absence-field]');
    const absenceReason = form.elements.absenceReason;
    const dateLabel = form.elements.consultationDate?.closest('label');
    const detailInput = form.elements.conditionDetail;
    const readyButton = form.querySelector('.tm-condition-ready-toggle');
    const preview = form.querySelector('.tm-inline-preview');

    setLabelText(dateLabel, dateLabelFor(mode));
    if (absenceField) {
      absenceField.hidden = !absence;
      absenceField.setAttribute('aria-hidden', absence ? 'false' : 'true');
    }
    if (absenceReason) absenceReason.required = absence;

    form.querySelectorAll('[data-tm-scheduled-field]').forEach((field) => {
      field.hidden = mode !== 'scheduled';
      field.setAttribute('aria-hidden', mode === 'scheduled' ? 'false' : 'true');
    });
    form.querySelectorAll('[data-tm-conditional-field]').forEach((field) => {
      field.hidden = !conditional;
      field.setAttribute('aria-hidden', conditional ? 'false' : 'true');
    });
    form.querySelectorAll('[data-tm-active-field]').forEach((field) => {
      const hide = closed || absence;
      field.hidden = hide;
      field.setAttribute('aria-hidden', hide ? 'true' : 'false');
    });

    if (!conditional) setReadyState(readyButton, detailInput, false);

    if (absence || closed) {
      if (form.elements.returnDays) form.elements.returnDays.value = '';
      if (form.elements.returnDueDate) form.elements.returnDueDate.value = '';
      setReadyState(readyButton, detailInput, false);
      return;
    }

    if (conditional && detailInput?.value === READY_SENTINEL && preview) {
      preview.hidden = false;
      preview.innerHTML = '<strong>Condição já realizada:</strong> este registro entrará imediatamente em “Solicitar agora”, sem criar data ou lembretes artificiais.';
    }
  }

  function installMobileForm(panel) {
    if (!(panel instanceof Element) || panel.id !== 'tmInlineConsultation' || panel.dataset.tmOutcomesV25 === 'true') return;
    const form = panel.querySelector('form');
    const grid = form?.querySelector('.telemedicine-choice-grid');
    if (!form || !grid) return;
    panel.dataset.tmOutcomesV25 = 'true';

    const legend = form.querySelector('.telemedicine-outcome-picker legend');
    if (legend) legend.textContent = 'Qual foi o resultado deste atendimento?';

    const choices = [
      ['absence', ABSENCE_MODE, 'Falta', 'Paciente não compareceu e precisa ser solicitado novamente.', ICONS.absence],
      ['withdrawn', WITHDRAWN_MODE, 'Desistiu', 'Registra o encerramento por desistência, sem alertas.', ICONS.withdrawn],
      ['in-person', IN_PERSON_MODE, 'Encaminhado para presencial', 'Registra que não foi possível concluir por telemedicina.', ICONS.inPerson]
    ];
    choices.forEach(([className, mode, title, detail, icon]) => {
      if (grid.querySelector(`input[value="${mode}"]`)) return;
      const choice = document.createElement('label');
      choice.className = `telemedicine-choice ${className}`;
      choice.innerHTML = choiceMarkup('followupMode', mode, title, detail, icon);
      grid.appendChild(choice);
    });

    let absenceField = form.querySelector('[data-tm-absence-field]');
    if (!absenceField) {
      absenceField = document.createElement('label');
      absenceField.className = 'tm-span-2';
      absenceField.dataset.tmAbsenceField = '';
      absenceField.hidden = true;
      absenceField.setAttribute('aria-hidden', 'true');
      absenceField.innerHTML = 'Justificativa da falta<textarea name="absenceReason" maxlength="1500" rows="4" placeholder="Informe por que o paciente não compareceu"></textarea><small>Obrigatório. Esta informação ficará registrada no histórico.</small>';
      const notes = form.querySelector('label[data-tm-active-field]');
      if (notes) notes.insertAdjacentElement('beforebegin', absenceField);
      else grid.parentElement?.appendChild(absenceField);
    }

    const conditionSelect = form.elements.conditionType;
    conditionSelect?.querySelector('option[value="other"]')?.remove();
    const detailInput = form.elements.conditionDetail;
    const detailField = detailInput?.closest('label');
    if (detailInput) {
      detailInput.type = 'hidden';
      detailInput.required = false;
      detailInput.value = '';
    }
    if (detailField) {
      detailField.removeAttribute('data-tm-conditional-field');
      detailField.hidden = true;
      detailField.setAttribute('aria-hidden', 'true');
    }

    if (!form.querySelector('.tm-condition-ready-field')) {
      const readyField = document.createElement('div');
      readyField.className = 'tm-condition-ready-field';
      readyField.dataset.tmConditionalField = '';
      readyField.setAttribute('data-tm-conditional-field', '');
      readyField.hidden = true;
      readyField.setAttribute('aria-hidden', 'true');
      readyField.innerHTML = `<span class="tm-condition-ready-title">Condição concluída?</span>${readyButtonMarkup()}`;
      const conditionField = conditionSelect?.closest('label');
      conditionField?.insertAdjacentElement('afterend', readyField);
      readyField.querySelector('button')?.addEventListener('click', () => {
        const button = readyField.querySelector('.tm-condition-ready-toggle');
        const ready = button?.getAttribute('aria-pressed') !== 'true';
        setReadyState(button, detailInput, ready);
        syncMobileForm(form);
      });
    }

    form.addEventListener('change', (event) => {
      if (event.target?.name === 'conditionType') {
        setReadyState(form.querySelector('.tm-condition-ready-toggle'), detailInput, false);
      }
      if (event.target?.name === 'followupMode' || event.target?.name === 'conditionType') {
        queueMicrotask(() => syncMobileForm(form));
      }
    });

    form.addEventListener('submit', (event) => {
      if (mobileMode(form) !== ABSENCE_MODE) return;
      const reason = form.elements.absenceReason?.value.trim() || '';
      if (reason.length < 3) {
        event.preventDefault();
        event.stopImmediatePropagation();
        form.elements.absenceReason?.focus({ preventScroll: true });
        showOperationalError(form.querySelector('.tm-inline-status'), 'Justifique a falta do paciente.', 'tm-inline-status error');
        return;
      }
      if (form.elements.notes) form.elements.notes.value = reason;
    }, true);

    syncMobileForm(form);
  }

  function rowResolution(row) {
    return normalize(row?.querySelector('.telemedicine-patient > small')?.textContent);
  }

  function decorateFollowupRow(row) {
    if (!(row instanceof Element) || !row.matches('[data-followup-row]')) return;
    const resolution = rowResolution(row);
    const absence = resolution === ABSENCE_RESOLUTION || resolution === 'FALTA';
    const ready = /\bRETORNO APOS\b.*\bJA REALIZADO\b/.test(resolution);
    if (!absence && !ready) return;

    const lastDate = row.querySelector('.telemedicine-specialty-block small');
    const status = row.querySelector('.telemedicine-status');
    const dateBlock = row.querySelector('.telemedicine-date-block');
    const zoneLabel = dateBlock?.querySelector('.telemedicine-zone-label');
    const mainText = dateBlock?.querySelector(':scope > strong');
    const reminders = dateBlock?.querySelector('.telemedicine-reminders');

    if (absence) {
      row.classList.add('tm-absence-card');
      if (lastDate && !lastDate.textContent.startsWith('Falta em:')) lastDate.textContent = lastDate.textContent.replace(/^Última consulta:/, 'Falta em:');
      const pending = status?.classList.contains('solicitar');
      const requested = status?.classList.contains('solicitado');
      if (status) {
        status.classList.toggle('tm-absence-status', Boolean(pending));
        if (pending && status.textContent !== 'SOLICITAR NOVAMENTE') status.textContent = 'SOLICITAR NOVAMENTE';
      }
      if (zoneLabel && zoneLabel.textContent !== 'Falta e solicitação') zoneLabel.textContent = 'Falta e solicitação';
      if (mainText) {
        const desired = requested ? 'Nova solicitação confirmada' : 'Nova solicitação necessária';
        if (mainText.textContent !== desired) mainText.textContent = desired;
      }
      if (reminders) {
        const desired = 'Falta registrada · sem lembretes programados';
        if (reminders.textContent.trim() !== desired) {
          reminders.classList.add('is-empty');
          reminders.innerHTML = `<span class="telemedicine-reminder-empty">${desired}</span>`;
        }
      }
      return;
    }

    row.classList.add('tm-condition-ready-card');
    if (status?.classList.contains('solicitar') && status.textContent !== 'SOLICITAR') status.textContent = 'SOLICITAR';
    if (zoneLabel && zoneLabel.textContent !== 'Condição concluída') zoneLabel.textContent = 'Condição concluída';
    if (mainText && mainText.textContent !== 'Nova solicitação necessária') mainText.textContent = 'Nova solicitação necessária';
    if (reminders) {
      const desired = 'Já realizado · sem lembretes programados';
      if (reminders.textContent.trim() !== desired) {
        reminders.classList.add('is-empty');
        reminders.innerHTML = `<span class="telemedicine-reminder-empty">${desired}</span>`;
      }
    }
  }

  function decorateHistory(container) {
    if (!(container instanceof Element || container instanceof Document)) return;
    container.querySelectorAll('.telemedicine-timeline .telemedicine-event, .tm-inline-timeline article').forEach((event) => {
      const paragraphs = event.querySelectorAll('p');
      if (!paragraphs.length) return;
      const resolution = normalize(paragraphs[0].textContent);
      const title = event.querySelector('h4');
      if (resolution === ABSENCE_RESOLUTION || resolution === 'FALTA') {
        if (title && title.textContent !== 'Falta registrada') title.textContent = 'Falta registrada';
        const detailLabel = paragraphs[1]?.querySelector('strong');
        if (detailLabel && detailLabel.textContent !== 'Justificativa:') detailLabel.textContent = 'Justificativa:';
      } else if (resolution === WITHDRAWN_RESOLUTION) {
        if (title && title.textContent !== 'Desistência registrada') title.textContent = 'Desistência registrada';
      } else if (resolution === IN_PERSON_RESOLUTION) {
        if (title && title.textContent !== 'Encaminhado para presencial') title.textContent = 'Encaminhado para presencial';
      } else if (/\bRETORNO APOS\b.*\bJA REALIZADO\b/.test(resolution)) {
        if (title && title.textContent !== 'Condição já realizada') title.textContent = 'Condição já realizada';
      }
    });
  }

  function inspectElement(element) {
    if (!(element instanceof Element)) return;
    if (element.id === 'tmInlineConsultation') installMobileForm(element);
    if (element.matches('[data-followup-row]')) decorateFollowupRow(element);
    element.querySelectorAll?.('#tmInlineConsultation').forEach(installMobileForm);
    element.querySelectorAll?.('[data-followup-row]').forEach(decorateFollowupRow);
    decorateHistory(element);
  }

  function installObserver() {
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.target instanceof Element) {
          const row = record.target.closest?.('[data-followup-row]');
          if (row) decorateFollowupRow(row);
          const history = record.target.closest?.('.telemedicine-timeline, .tm-inline-timeline');
          if (history) decorateHistory(history);
        }
        record.addedNodes.forEach((node) => inspectElement(node));
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function boot() {
    installDesktopForm();
    document.querySelectorAll('[data-followup-row]').forEach(decorateFollowupRow);
    decorateHistory(document);
    const inline = document.getElementById('tmInlineConsultation');
    if (inline) installMobileForm(inline);
    installObserver();
  }

  installApiAdapter();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
