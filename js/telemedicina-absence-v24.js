'use strict';

(() => {
  if (!/^\/telemedicina\/?$/.test(window.location.pathname)) return;

  const ABSENCE_MODE = 'absence';
  const ABSENCE_RESOLUTION = 'FALTA DO PACIENTE';
  const ABSENCE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h14a2 2 0 0 1 2 2v13H3v-13a2 2 0 0 1 2-2Z"/><path d="M7 2v5M17 2v5M3 9h18"/><path d="m8.5 12.5 7 7m0-7-7 7"/></svg>';

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

  function absenceChoiceMarkup(name, id = '') {
    return `<input${id ? ` id="${id}"` : ''} name="${name}" type="radio" value="${ABSENCE_MODE}"><span class="telemedicine-choice-icon" aria-hidden="true">${ABSENCE_ICON}</span><span><strong>Falta</strong><small>Paciente não compareceu e precisa ser solicitado novamente.</small></span>`;
  }

  function desktopMode(form) {
    return form?.querySelector('input[name="consultOutcome"]:checked')?.value || 'scheduled';
  }

  function syncDesktopForm(form) {
    if (!form) return;
    const mode = desktopMode(form);
    const absence = mode === ABSENCE_MODE;
    const discharged = mode === 'discharge';
    const fields = document.getElementById('consultFollowupFields');
    const scheduled = document.getElementById('consultScheduledFields');
    const conditional = document.getElementById('consultConditionalFields');
    const absencePanel = document.getElementById('consultAbsenceFields');
    const reason = document.getElementById('consultAbsenceReason');
    const notesField = form.querySelector('.telemedicine-notes-field');
    const preview = document.getElementById('consultPreview');
    const dateLabel = form.querySelector('label[for="consultDate"]');

    if (dateLabel) dateLabel.textContent = absence ? 'Data da falta' : 'Data da última consulta';
    if (absencePanel) {
      absencePanel.hidden = !absence;
      absencePanel.setAttribute('aria-hidden', absence ? 'false' : 'true');
    }
    if (reason) reason.required = absence;

    if (absence) {
      if (fields) {
        fields.hidden = false;
        fields.setAttribute('aria-hidden', 'false');
      }
      if (scheduled) scheduled.hidden = true;
      if (conditional) conditional.hidden = true;
      if (notesField) notesField.hidden = true;
      if (preview) preview.hidden = true;
      const returnDays = document.getElementById('consultReturnDays');
      const returnDate = document.getElementById('consultReturnDate');
      const conditionDetail = document.getElementById('consultConditionDetail');
      if (returnDays) returnDays.value = '';
      if (returnDate) returnDate.value = '';
      if (conditionDetail) {
        conditionDetail.value = '';
        conditionDetail.required = false;
      }
      return;
    }

    if (fields) {
      fields.hidden = discharged;
      fields.setAttribute('aria-hidden', discharged ? 'true' : 'false');
    }
    if (scheduled) scheduled.hidden = mode !== 'scheduled';
    if (conditional) conditional.hidden = mode !== 'conditional';
    if (notesField) notesField.hidden = discharged;
    if (preview) preview.hidden = discharged;
    const baseNotes = document.getElementById('consultNotes');
    if (baseNotes?.dataset.tmAbsenceSynced === 'true') {
      baseNotes.value = '';
      delete baseNotes.dataset.tmAbsenceSynced;
    }
  }

  function installDesktopForm() {
    const form = document.getElementById('consultationForm');
    const grid = form?.querySelector('.telemedicine-choice-grid');
    const fields = document.getElementById('consultFollowupFields');
    if (!form || !grid || !fields || form.dataset.tmAbsenceV24 === 'true') return;
    form.dataset.tmAbsenceV24 = 'true';

    const legend = form.querySelector('.telemedicine-outcome-picker legend');
    if (legend) legend.textContent = 'Qual foi o resultado deste atendimento?';

    const choice = document.createElement('label');
    choice.className = 'telemedicine-choice absence';
    choice.innerHTML = absenceChoiceMarkup('consultOutcome', 'consultOutcomeAbsence');
    grid.appendChild(choice);

    const panel = document.createElement('div');
    panel.className = 'telemedicine-mode-panel absence';
    panel.id = 'consultAbsenceFields';
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = '<div class="portal-field"><label for="consultAbsenceReason">Justificativa da falta</label><textarea id="consultAbsenceReason" maxlength="1500" rows="4" placeholder="Informe por que o paciente não compareceu"></textarea><small>Obrigatório. Esta informação ficará registrada no histórico.</small></div>';
    document.getElementById('consultConditionalFields')?.insertAdjacentElement('afterend', panel);

    form.addEventListener('change', (event) => {
      if (event.target?.name === 'consultOutcome') syncDesktopForm(form);
    });

    form.addEventListener('submit', (event) => {
      const absence = desktopMode(form) === ABSENCE_MODE;
      form.dataset.tmAbsenceSubmitting = absence ? 'true' : 'false';
      if (!absence) return;
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
      if (notes) {
        notes.value = value;
        notes.dataset.tmAbsenceSynced = 'true';
      }
      const returnDays = document.getElementById('consultReturnDays');
      const returnDate = document.getElementById('consultReturnDate');
      const conditionDetail = document.getElementById('consultConditionDetail');
      if (returnDays) returnDays.value = '';
      if (returnDate) returnDate.value = '';
      if (conditionDetail) conditionDetail.value = '';
    }, true);

    const status = document.getElementById('consultationStatus');
    if (status) {
      new MutationObserver(() => {
        if (form.dataset.tmAbsenceSubmitting !== 'true' || !status.classList.contains('success')) return;
        status.textContent = 'Falta registrada. O acompanhamento foi incluído em Solicitar agora.';
        form.dataset.tmAbsenceSubmitting = 'false';
      }).observe(status, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    document.getElementById('openConsultation')?.addEventListener('click', () => {
      form.dataset.tmAbsenceSubmitting = 'false';
      const reason = document.getElementById('consultAbsenceReason');
      if (reason) reason.value = '';
      const notes = document.getElementById('consultNotes');
      if (notes) delete notes.dataset.tmAbsenceSynced;
      queueMicrotask(() => syncDesktopForm(form));
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
    const discharged = mode === 'discharge';
    const absenceField = form.querySelector('[data-tm-absence-field]');
    const absenceReason = form.elements.absenceReason;
    const dateLabel = form.elements.consultationDate?.closest('label');

    setLabelText(dateLabel, absence ? 'Data da falta' : 'Data da última consulta');
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
      field.hidden = mode !== 'conditional';
      field.setAttribute('aria-hidden', mode === 'conditional' ? 'false' : 'true');
    });
    form.querySelectorAll('[data-tm-active-field]').forEach((field) => {
      field.hidden = discharged || absence;
      field.setAttribute('aria-hidden', discharged || absence ? 'true' : 'false');
    });

    if (absence) {
      form.elements.returnDays.value = '';
      form.elements.returnDueDate.value = '';
      form.elements.conditionDetail.value = '';
      form.elements.conditionDetail.required = false;
      return;
    }

    if (form.elements.notes?.dataset.tmAbsenceSynced === 'true') {
      form.elements.notes.value = '';
      delete form.elements.notes.dataset.tmAbsenceSynced;
    }
  }

  function installMobileForm(panel) {
    if (!(panel instanceof Element) || panel.id !== 'tmInlineConsultation' || panel.dataset.tmAbsenceV24 === 'true') return;
    const form = panel.querySelector('form');
    const grid = form?.querySelector('.telemedicine-choice-grid');
    if (!form || !grid) return;
    panel.dataset.tmAbsenceV24 = 'true';

    const legend = form.querySelector('.telemedicine-outcome-picker legend');
    if (legend) legend.textContent = 'Qual foi o resultado deste atendimento?';

    const choice = document.createElement('label');
    choice.className = 'telemedicine-choice absence';
    choice.innerHTML = absenceChoiceMarkup('followupMode');
    grid.appendChild(choice);

    const absenceField = document.createElement('label');
    absenceField.className = 'tm-span-2';
    absenceField.dataset.tmAbsenceField = '';
    absenceField.hidden = true;
    absenceField.setAttribute('aria-hidden', 'true');
    absenceField.innerHTML = 'Justificativa da falta<textarea name="absenceReason" maxlength="1500" rows="4" placeholder="Informe por que o paciente não compareceu"></textarea><small>Obrigatório. Esta informação ficará registrada no histórico.</small>';
    const notes = form.querySelector('label[data-tm-active-field]');
    if (notes) notes.insertAdjacentElement('beforebegin', absenceField);
    else grid.parentElement?.appendChild(absenceField);

    form.addEventListener('change', (event) => {
      if (event.target?.name === 'followupMode') syncMobileForm(form);
    });

    form.addEventListener('submit', (event) => {
      const absence = mobileMode(form) === ABSENCE_MODE;
      form.dataset.tmAbsenceSubmitting = absence ? 'true' : 'false';
      if (!absence) return;
      const reason = form.elements.absenceReason?.value.trim() || '';
      if (reason.length < 3) {
        event.preventDefault();
        event.stopImmediatePropagation();
        form.elements.absenceReason?.focus({ preventScroll: true });
        showOperationalError(form.querySelector('.tm-inline-status'), 'Justifique a falta do paciente.', 'tm-inline-status error');
        return;
      }
      form.elements.notes.value = reason;
      form.elements.notes.dataset.tmAbsenceSynced = 'true';
      form.elements.returnDays.value = '';
      form.elements.returnDueDate.value = '';
      form.elements.conditionDetail.value = '';
    }, true);

    const status = form.querySelector('.tm-inline-status');
    if (status) {
      new MutationObserver(() => {
        if (form.dataset.tmAbsenceSubmitting !== 'true' || !status.classList.contains('success')) return;
        status.textContent = 'Falta registrada. O acompanhamento foi incluído em Solicitar agora.';
        form.dataset.tmAbsenceSubmitting = 'false';
        if (form.elements.absenceReason) form.elements.absenceReason.value = '';
        syncMobileForm(form);
      }).observe(status, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    syncMobileForm(form);
  }

  function rowIsAbsence(row) {
    const resolution = normalize(row?.querySelector('.telemedicine-patient > small')?.textContent);
    return resolution === ABSENCE_RESOLUTION || resolution === 'FALTA';
  }

  function decorateAbsenceRow(row) {
    if (!(row instanceof Element) || !row.matches('[data-followup-row]') || !rowIsAbsence(row)) return;
    row.classList.add('tm-absence-card');

    const lastDate = row.querySelector('.telemedicine-specialty-block small');
    if (lastDate && !lastDate.textContent.startsWith('Falta em:')) {
      lastDate.textContent = lastDate.textContent.replace(/^Última consulta:/, 'Falta em:');
    }

    const status = row.querySelector('.telemedicine-status');
    const pending = status?.classList.contains('solicitar');
    const requested = status?.classList.contains('solicitado');
    if (status) {
      status.classList.toggle('tm-absence-status', Boolean(pending));
      if (pending && status.textContent !== 'SOLICITAR NOVAMENTE') status.textContent = 'SOLICITAR NOVAMENTE';
    }

    const dateBlock = row.querySelector('.telemedicine-date-block');
    const zoneLabel = dateBlock?.querySelector('.telemedicine-zone-label');
    const mainText = dateBlock?.querySelector(':scope > strong');
    const reminders = dateBlock?.querySelector('.telemedicine-reminders');
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
  }

  function decorateHistory(container) {
    if (!(container instanceof Element || container instanceof Document)) return;
    container.querySelectorAll('.telemedicine-timeline .telemedicine-event, .tm-inline-timeline article').forEach((event) => {
      const paragraphs = event.querySelectorAll('p');
      if (!paragraphs.length || ![ABSENCE_RESOLUTION, 'FALTA'].includes(normalize(paragraphs[0].textContent))) return;
      const title = event.querySelector('h4');
      if (title && title.textContent !== 'Falta registrada') title.textContent = 'Falta registrada';
      const detailLabel = paragraphs[1]?.querySelector('strong');
      if (detailLabel && detailLabel.textContent !== 'Justificativa:') detailLabel.textContent = 'Justificativa:';
    });
  }

  function inspectElement(element) {
    if (!(element instanceof Element)) return;
    if (element.id === 'tmInlineConsultation') installMobileForm(element);
    if (element.matches('[data-followup-row]')) decorateAbsenceRow(element);
    element.querySelectorAll?.('#tmInlineConsultation').forEach(installMobileForm);
    element.querySelectorAll?.('[data-followup-row]').forEach(decorateAbsenceRow);
    decorateHistory(element);
  }

  function installObserver() {
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.target instanceof Element) {
          const row = record.target.closest?.('[data-followup-row]');
          if (row) decorateAbsenceRow(row);
          const history = record.target.closest?.('.telemedicine-timeline, .tm-inline-timeline');
          if (history) decorateHistory(history);
        }
        record.addedNodes.forEach((node) => inspectElement(node));
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function boot() {
    installDesktopForm();
    document.querySelectorAll('[data-followup-row]').forEach(decorateAbsenceRow);
    decorateHistory(document);
    document.getElementById('tmInlineConsultation') && installMobileForm(document.getElementById('tmInlineConsultation'));
    installObserver();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
