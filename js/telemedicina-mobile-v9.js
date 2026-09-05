'use strict';

(() => {
  const MOBILE_QUERY = '(max-width: 860px), (pointer: coarse) and (max-device-width: 900px)';
  const auth = window.RegulationAuth;
  if (!auth) return;

  const cache = {
    loaded: false,
    loading: null,
    today: '',
    followups: new Map(),
    patients: new Map()
  };

  function isMobileContext() {
    try { return window.matchMedia(MOBILE_QUERY).matches; } catch (_) { return false; }
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;' }[char]));
  }

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function dateValid(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
  }

  function formatDate(value) {
    if (!dateValid(value)) return value || '—';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  function addDays(value, amount) {
    const helper = window.TelemedicineBusinessDay;
    if (helper?.addDays) return helper.addDays(value, amount);
    const date = new Date(`${value}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + Number(amount || 0));
    return date.toISOString().slice(0, 10);
  }

  function nextBusinessDay(value) {
    const helper = window.TelemedicineBusinessDay;
    if (helper?.nextBusinessDay) return helper.nextBusinessDay(value);
    let cursor = value;
    while (dateValid(cursor)) {
      const weekday = new Date(`${cursor}T12:00:00Z`).getUTCDay();
      if (weekday !== 0 && weekday !== 6) return cursor;
      cursor = addDays(cursor, 1);
    }
    return value;
  }

  function reminderDates(returnDate) {
    if (!dateValid(returnDate)) return [];
    let cursor = nextBusinessDay(addDays(returnDate, -15));
    const output = [];
    while (output.length < 3) {
      const weekday = new Date(`${cursor}T12:00:00Z`).getUTCDay();
      if (weekday !== 0 && weekday !== 6) output.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return output;
  }

  function statusClass(status) {
    return normalize(status).replace(/\s+/g, '-');
  }

  function statusText(item) {
    if (item.status === 'SOLICITAR' && item.alertToday && item.reminderNumber) return `SOLICITAR · aviso ${item.reminderNumber}/3`;
    return item.status || '—';
  }

  function reminderMarkup(item) {
    const dates = Array.isArray(item.reminderDates) ? item.reminderDates.filter(Boolean) : [];
    if (!dates.length) {
      return '<small class="telemedicine-reminders is-empty"><span class="telemedicine-reminder-empty">Sem lembretes calculados</span></small>';
    }
    const chips = dates.map((date, index) => {
      const formatted = formatDate(date);
      return `<span class="telemedicine-reminder-chip" aria-label="Aviso ${index + 1}: ${escapeHtml(formatted)}"><span class="telemedicine-reminder-number" aria-hidden="true">${index + 1}</span><span>${escapeHtml(formatted)}</span></span>`;
    }).join('');
    return `<small class="telemedicine-reminders"><span class="telemedicine-reminders-label" aria-hidden="true">Avisos programados</span>${chips}</small>`;
  }

  function actionButtons(item) {
    const actions = [];
    if (['SOLICITAR', 'ATRASADO', 'EM AGUARDO'].includes(item.status) && !item.requestedAt) {
      actions.push(`<button class="portal-button primary" type="button" data-action="requested" data-followup="${escapeHtml(item.id)}">Solicitado</button>`);
    }
    if (window.TelemedicineJustification?.isAvailable(item)) {
      actions.push(`<button class="portal-button secondary" type="button" data-action="copy-justification" data-followup="${escapeHtml(item.id)}" aria-label="Copiar justificativa da solicitação" aria-live="polite" title="Copiar justificativa da solicitação">Copiar motivo</button>`);
    }
    if (item.status === 'SEM PROGRAMAÇÃO' || item.needsReview) {
      actions.push(`<button class="portal-button secondary" type="button" data-action="schedule" data-followup="${escapeHtml(item.id)}">Programar</button>`);
    }
    actions.push(`<button class="portal-button secondary" type="button" data-action="patient" data-patient="${escapeHtml(item.patientId)}">Histórico</button>`);
    return actions;
  }

  function cardHtml(item) {
    const actions = actionButtons(item);
    return `<article class="telemedicine-row" data-followup-row="${escapeHtml(item.id)}" data-status="${escapeHtml(statusClass(item.status))}">
      <div class="telemedicine-patient">
        <span class="telemedicine-zone-label">Paciente</span>
        <button type="button" data-action="patient" data-patient="${escapeHtml(item.patientId)}">${escapeHtml(item.patientName || 'Paciente')}</button>
        ${item.alertToday ? '<span class="telemedicine-alert-marker">HOJE</span>' : ''}
        <span class="telemedicine-zone-label telemedicine-condition-label">Conduta</span>
        <small>${escapeHtml(item.resolution || 'Sem conduta registrada')}</small>
      </div>
      <div class="telemedicine-specialty-block"><div><strong>${escapeHtml(item.specialty || 'Especialidade não informada')}</strong><small>Última consulta: ${escapeHtml(formatDate(item.lastConsultationDate))}</small></div><span class="telemedicine-status ${statusClass(item.status)}">${escapeHtml(statusText(item))}</span></div>
      <div class="telemedicine-date-block"><span class="telemedicine-zone-label">Retorno e avisos</span><strong>${item.returnDueDate ? `Retorno: ${escapeHtml(formatDate(item.returnDueDate))}` : 'Retorno sem data'}</strong>${reminderMarkup(item)}</div>
      <div class="telemedicine-actions" data-action-count="${actions.length}" aria-label="Ações do acompanhamento">${actions.join('')}</div>
    </article>`;
  }

  async function ensureDashboard(force = false) {
    if (cache.loaded && !force) return cache;
    if (cache.loading && !force) return cache.loading;
    cache.loading = auth.api('/api/telemedicina/dashboard', { method: 'GET' }).then((payload) => {
      cache.today = payload.today || new Date().toISOString().slice(0, 10);
      cache.followups = new Map((Array.isArray(payload.followups) ? payload.followups : []).map((item) => [item.id, item]));
      cache.patients = new Map((Array.isArray(payload.patients) ? payload.patients : []).map((item) => [item.id, item]));
      cache.loaded = true;
      return cache;
    }).finally(() => { cache.loading = null; });
    return cache.loading;
  }

  function setCachedFollowup(item) {
    if (!item?.id) return;
    if (item.active === false) cache.followups.delete(item.id);
    else cache.followups.set(item.id, item);
    updateStats();
  }

  function setCachedPatient(id, name) {
    if (!id || !name) return;
    cache.patients.set(id, { ...(cache.patients.get(id) || {}), id, name });
    const list = document.getElementById('patientSuggestions');
    if (list && ![...list.options].some((option) => option.value === name)) {
      const option = document.createElement('option');
      option.value = name;
      list.appendChild(option);
    }
  }

  function updateStats() {
    if (!cache.loaded) return;
    const counts = { solicitar: 0, atrasado: 0, emAguardo: 0, semProgramacao: 0, alertasHoje: 0 };
    cache.followups.forEach((item) => {
      if (item.active === false) return;
      if (item.status === 'SOLICITAR') counts.solicitar += 1;
      if (item.status === 'ATRASADO') counts.atrasado += 1;
      if (item.status === 'EM AGUARDO') counts.emAguardo += 1;
      if (item.status === 'SEM PROGRAMAÇÃO') counts.semProgramacao += 1;
      if (item.alertToday) counts.alertasHoje += 1;
    });
    const values = [
      ['statSolicitar', counts.solicitar], ['statAtrasado', counts.atrasado],
      ['statAguardo', counts.emAguardo], ['statSemProgramacao', counts.semProgramacao]
    ];
    values.forEach(([id, value]) => { const el = document.getElementById(id); if (el) el.textContent = String(value); });
    const todayAlerts = document.getElementById('todayAlerts');
    if (todayAlerts) todayAlerts.textContent = counts.alertasHoje ? `${counts.alertasHoje} aviso(s) programado(s) para hoje` : 'Nenhum aviso programado para hoje';
  }

  function syncRowSummary(row, item) {
    if (!row || !item) return;
    if (item.active === false) {
      row.remove();
      updateFilterSummary();
      return;
    }
    const patientButton = row.querySelector('.telemedicine-patient > button[data-action="patient"]');
    const patientSmall = row.querySelector('.telemedicine-patient > small');
    const specialty = row.querySelector('.telemedicine-specialty-block strong');
    const lastDate = row.querySelector('.telemedicine-specialty-block small');
    const status = row.querySelector('.telemedicine-status');
    const returnDate = row.querySelector('.telemedicine-date-block strong');
    const reminders = row.querySelector('.telemedicine-date-block .telemedicine-reminders');
    const actions = row.querySelector('.telemedicine-actions');
    if (patientButton) { patientButton.textContent = item.patientName || 'Paciente'; patientButton.dataset.patient = item.patientId || ''; }
    if (patientSmall) patientSmall.textContent = item.resolution || 'Sem conduta registrada';
    if (specialty) specialty.textContent = item.specialty || 'Especialidade não informada';
    if (lastDate) lastDate.textContent = `Última consulta: ${formatDate(item.lastConsultationDate)}`;
    row.dataset.status = statusClass(item.status);
    if (status) { status.className = `telemedicine-status ${statusClass(item.status)}`; status.textContent = statusText(item); }
    if (returnDate) returnDate.textContent = item.returnDueDate ? `Retorno: ${formatDate(item.returnDueDate)}` : 'Retorno sem data';
    if (reminders) reminders.outerHTML = reminderMarkup(item);
    if (actions) {
      const buttons = actionButtons(item);
      actions.dataset.actionCount = String(buttons.length);
      actions.innerHTML = buttons.join('');
    }
    const alert = row.querySelector('.telemedicine-alert-marker');
    if (item.alertToday && !alert) {
      patientButton?.insertAdjacentHTML('afterend', '<span class="telemedicine-alert-marker">HOJE</span>');
    } else if (!item.alertToday && alert) alert.remove();
  }

  function upsertVisibleRow(item) {
    const list = document.getElementById('followupList');
    if (!list || !item?.id) return;
    const existing = list.querySelector(`[data-followup-row="${CSS.escape(item.id)}"]`);
    if (existing) return syncRowSummary(existing, item);
    if (item.active === false) return;
    const template = document.createElement('template');
    template.innerHTML = cardHtml(item).trim();
    const row = template.content.firstElementChild;
    list.prepend(row);
    applyFilters();
  }

  function matchesCurrentFilter(item) {
    const filter = document.getElementById('statusFilter')?.value || '';
    const query = normalize(document.getElementById('telemedicineSearch')?.value || '');
    if (filter && item.status !== filter) return false;
    if (!query) return true;
    return [item.patientName, item.specialty, item.resolution, item.notes].some((value) => normalize(value).includes(query));
  }

  async function applyFilters() {
    await ensureDashboard().catch(() => null);
    const list = document.getElementById('followupList');
    if (!list) return;
    let visible = 0;
    list.querySelectorAll('[data-followup-row]').forEach((row) => {
      const item = cache.followups.get(row.dataset.followupRow || '');
      const show = item ? matchesCurrentFilter(item) : true;
      row.hidden = !show;
      if (show) visible += 1;
    });
    updateFilterSummary(visible);
  }

  function updateFilterSummary(explicitCount = null) {
    const summary = document.getElementById('filterSummary');
    const list = document.getElementById('followupList');
    if (!summary || !list) return;
    const count = explicitCount ?? [...list.querySelectorAll('[data-followup-row]')].filter((row) => !row.hidden).length;
    const filter = document.getElementById('statusFilter')?.value || '';
    const search = document.getElementById('telemedicineSearch')?.value?.trim() || '';
    const parts = [`${count} acompanhamento(s) exibido(s)`];
    if (filter) parts.push(`situação: ${filter}`);
    if (search) parts.push(`busca: “${search}”`);
    summary.textContent = parts.join(' · ');
  }

  function panelShell(mode, title, meta) {
    const panel = document.createElement('section');
    panel.className = 'tm-inline-panel';
    panel.dataset.tmInlineMode = mode;
    panel.innerHTML = `<div class="tm-inline-panel-head"><div><strong>${escapeHtml(title)}</strong>${meta ? `<span>${escapeHtml(meta)}</span>` : ''}</div><button type="button" class="tm-inline-close" data-tm-inline-close aria-label="Recolher painel">Recolher</button></div><div class="tm-inline-panel-body"></div>`;
    panel.querySelector('[data-tm-inline-close]').addEventListener('click', () => closeRowPanel(panel.closest('.telemedicine-row')));
    return panel;
  }

  function closeRowPanel(row) {
    if (!row) return;
    row.querySelector(':scope > .tm-inline-panel')?.remove();
    row.classList.remove('tm-inline-open');
    row.querySelectorAll('[data-action]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  }

  function activateRowPanel(row, mode, panel, trigger) {
    const existing = row.querySelector(':scope > .tm-inline-panel');
    if (existing?.dataset.tmInlineMode === mode) {
      closeRowPanel(row);
      return false;
    }
    existing?.remove();
    row.classList.add('tm-inline-open');
    row.querySelectorAll('[data-action]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    trigger?.setAttribute('aria-expanded', 'true');
    row.appendChild(panel);
    return true;
  }

  function setInlineStatus(el, message, type = '') {
    if (!el) return;
    el.textContent = message;
    el.className = `tm-inline-status${type ? ` ${type}` : ''}`;
  }

  function schedulePreviewHtml(value) {
    if (!dateValid(value)) return 'Informe a data-alvo para calcular os lembretes.';
    const due = nextBusinessDay(value);
    return `<strong>Retorno:</strong> ${escapeHtml(formatDate(due))}<br><strong>3 avisos úteis:</strong> ${reminderDates(due).map(formatDate).join(' · ')}`;
  }

  async function openScheduleInline(row, item, trigger) {
    const panel = panelShell('schedule', 'Programar retorno', `${item.patientName || 'Paciente'} · ${item.specialty || ''}`);
    if (!activateRowPanel(row, 'schedule', panel, trigger)) return;
    const body = panel.querySelector('.tm-inline-panel-body');
    body.innerHTML = `<form class="tm-inline-form tm-inline-schedule-form"><label>Data-alvo do retorno<input name="returnDueDate" type="date" required value="${escapeHtml(item.returnDueDate || '')}"></label><div class="tm-inline-preview"></div><div class="tm-inline-form-actions"><button class="portal-button primary" type="submit">Programar lembretes</button></div><div class="tm-inline-status" aria-live="polite"></div></form>`;
    const form = body.querySelector('form');
    const input = form.elements.returnDueDate;
    const preview = body.querySelector('.tm-inline-preview');
    const status = body.querySelector('.tm-inline-status');
    const update = () => { preview.innerHTML = schedulePreviewHtml(input.value); };
    input.addEventListener('input', update);
    input.addEventListener('change', () => { if (input.value) input.value = nextBusinessDay(input.value); update(); });
    update();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const due = nextBusinessDay(input.value);
      input.value = due;
      button.disabled = true;
      button.textContent = 'Salvando…';
      setInlineStatus(status, 'Salvando em segundo plano…');
      try {
        const payload = await auth.api(`/api/telemedicina/followups/${encodeURIComponent(item.id)}/schedule`, { method: 'PATCH', body: JSON.stringify({ returnDueDate: due }) });
        const updated = payload.followup;
        if (updated) { setCachedFollowup(updated); syncRowSummary(row, updated); }
        setInlineStatus(status, 'Retorno e três lembretes programados. Você pode continuar trabalhando nos outros cards.', 'success');
      } catch (error) {
        setInlineStatus(status, error.message || 'Não foi possível programar o retorno.', 'error');
      } finally {
        button.disabled = false;
        button.textContent = 'Programar lembretes';
      }
    });
  }

  async function openRequestedInline(row, item, trigger) {
    const panel = panelShell('requested', 'Confirmar solicitação', `${item.patientName || 'Paciente'} · ${item.specialty || ''}`);
    if (!activateRowPanel(row, 'requested', panel, trigger)) return;
    const body = panel.querySelector('.tm-inline-panel-body');
    const today = cache.today || new Date().toISOString().slice(0, 10);
    body.innerHTML = `<form class="tm-inline-form tm-inline-requested-form"><label>Data da solicitação no DigSUS<input name="requestedDate" type="date" required value="${escapeHtml(today)}"></label><label>Observação<textarea name="note" rows="3" maxlength="1200" placeholder="Opcional"></textarea></label><div class="tm-inline-form-actions"><button class="portal-button primary" type="submit">Marcar como solicitado</button></div><div class="tm-inline-status" aria-live="polite"></div></form>`;
    const form = body.querySelector('form');
    const status = body.querySelector('.tm-inline-status');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Salvando…';
      setInlineStatus(status, 'Salvando em segundo plano…');
      try {
        const payload = await auth.api(`/api/telemedicina/followups/${encodeURIComponent(item.id)}/requested`, {
          method: 'POST',
          body: JSON.stringify({ requestedDate: form.elements.requestedDate.value, note: form.elements.note.value.trim() })
        });
        const updated = payload.followup;
        if (updated) { setCachedFollowup(updated); syncRowSummary(row, updated); }
        setInlineStatus(status, 'Solicitação registrada. Os lembretes deste retorno foram encerrados.', 'success');
      } catch (error) {
        setInlineStatus(status, error.message || 'Não foi possível confirmar a solicitação.', 'error');
      } finally {
        button.disabled = false;
        button.textContent = 'Marcar como solicitado';
      }
    });
  }

  async function openHistoryInline(row, patientId, trigger) {
    const panel = panelShell('history', 'Histórico do paciente', 'Carregando histórico longitudinal…');
    if (!activateRowPanel(row, 'history', panel, trigger)) return;
    const body = panel.querySelector('.tm-inline-panel-body');
    body.innerHTML = '<div class="tm-inline-loading">Carregando histórico…</div>';
    try {
      const payload = await auth.api(`/api/telemedicina/patients/${encodeURIComponent(patientId)}`, { method: 'GET' });
      const patient = payload.patient || {};
      const followups = Array.isArray(payload.followups) ? payload.followups : [];
      const events = Array.isArray(payload.events) ? payload.events : [];
      const head = panel.querySelector('.tm-inline-panel-head span');
      if (head) head.textContent = patient.name || 'Histórico longitudinal';
      const current = followups.length ? `<div class="tm-inline-current"><strong>Situação atual</strong><div class="tm-inline-current-grid">${followups.map((followup) => `<div><small>${escapeHtml(followup.specialty || 'Especialidade')}</small><strong>${escapeHtml(followup.status || '—')}</strong><span>${followup.returnDueDate ? `Retorno ${escapeHtml(formatDate(followup.returnDueDate))}` : 'Sem data-alvo definida'}</span></div>`).join('')}</div></div>` : '';
      const timeline = events.length ? `<div class="tm-inline-timeline">${events.map((event) => `<article><small>${escapeHtml(formatDate(event.eventDate))} · ${escapeHtml(event.specialty || '')}</small><h4>${escapeHtml(event.eventType === 'solicitacao' ? 'Solicitação registrada' : event.eventType === 'programacao' ? 'Retorno programado' : 'Teleconsulta')}</h4><p>${escapeHtml(event.resolution || '')}</p>${event.notes ? `<p><strong>Observação:</strong> ${escapeHtml(event.notes)}</p>` : ''}${event.returnDueDate ? `<small>Retorno-alvo: ${escapeHtml(formatDate(event.returnDueDate))}</small>` : ''}</article>`).join('')}</div>` : '<div class="tm-inline-loading">Nenhum evento histórico encontrado.</div>';
      body.innerHTML = current + timeline;
    } catch (error) {
      body.innerHTML = `<div class="tm-inline-status error">${escapeHtml(error.message || 'Não foi possível carregar o histórico.')}</div>`;
    }
  }

  const conditionLabels = {
    exams: 'exames',
    physiotherapy: 'fisioterapia',
    procedure: 'procedimento ou cirurgia',
    treatment: 'conclusão do tratamento',
    other: 'outra condição'
  };

  function consultationPreview(form) {
    const mode = form.elements.followupMode.value || 'scheduled';
    if (mode === 'discharge') return '';
    if (mode === 'conditional') {
      const type = form.elements.conditionType.value;
      const detail = form.elements.conditionDetail.value.trim();
      const condition = type === 'other' && detail ? detail : conditionLabels[type] || 'uma condição';
      return `<strong>Retorno sem data definida:</strong> após ${escapeHtml(condition)}.<br>Nenhum lembrete será criado; o registro ficará no histórico como “SEM PROGRAMAÇÃO”.`;
    }
    const consultDate = form.elements.consultationDate.value;
    const days = Number(form.elements.returnDays.value || 0);
    let target = form.elements.returnDueDate.value;
    if (!target && consultDate && Number.isInteger(days) && days > 0) target = nextBusinessDay(addDays(consultDate, days));
    if (!target) return 'Sem data-alvo definida. O acompanhamento ficará em “SEM PROGRAMAÇÃO” até a data ser informada.';
    target = nextBusinessDay(target);
    return `<strong>Retorno-alvo:</strong> ${escapeHtml(formatDate(target))}<br><strong>Lembretes:</strong> ${reminderDates(target).map(formatDate).join(' · ')}`;
  }

  function closeConsultationInline() {
    document.getElementById('tmInlineConsultation')?.remove();
    document.getElementById('openConsultation')?.setAttribute('aria-expanded', 'false');
  }

  async function toggleConsultationInline() {
    const existing = document.getElementById('tmInlineConsultation');
    if (existing) return closeConsultationInline();
    await ensureDashboard().catch(() => null);
    const toolbar = document.querySelector('.telemedicine-toolbar');
    if (!toolbar) return;
    const panel = document.createElement('section');
    panel.id = 'tmInlineConsultation';
    panel.className = 'tm-inline-consultation';
    panel.innerHTML = `<div class="tm-inline-panel-head"><div><strong>Registrar teleconsulta</strong><span>O formulário fica aberto sem bloquear os demais pacientes.</span></div><button type="button" class="tm-inline-close" data-tm-consult-close>Recolher</button></div><form class="tm-inline-form tm-inline-consult-form">
      <label class="tm-span-2">Paciente<input name="patientName" required maxlength="160" list="patientSuggestions" autocomplete="off" placeholder="Nome completo"></label>
      <label>Data da última consulta<input name="consultationDate" required type="date" value="${escapeHtml(cache.today || new Date().toISOString().slice(0, 10))}"></label>
      <label>Especialidade<input name="specialty" required maxlength="120" list="specialtySuggestions" placeholder="Ex.: Psiquiatria"></label>
      <fieldset class="tm-span-2 telemedicine-outcome-picker">
        <legend>Qual foi a conduta desta consulta?</legend>
        <div class="telemedicine-choice-grid">
          <label class="telemedicine-choice success"><input name="followupMode" type="radio" value="discharge"><span class="telemedicine-choice-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.4-8.35C.55 9.22 2.1 5 6.15 5c2.08 0 3.22 1.22 3.85 2.18C10.63 6.22 11.77 5 13.85 5c4.05 0 5.6 4.22 3.55 7.65C15 16.65 12 21 12 21Z"/><path d="m8.2 12.1 2.15 2.15 4.1-4.35"/></svg></span><span><strong>Alta do episódio</strong><small>Problema resolvido, sem retorno.</small></span></label>
          <label class="telemedicine-choice schedule"><input name="followupMode" type="radio" value="scheduled" checked><span class="telemedicine-choice-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 4.5h14a2 2 0 0 1 2 2v13H3v-13a2 2 0 0 1 2-2Z"/><path d="M7 2v5M17 2v5M3 9h18M12 12v3l2 1"/></svg></span><span><strong>Retorno com prazo ou data</strong><small>Calcula a data e os três avisos.</small></span></label>
          <label class="telemedicine-choice condition"><input name="followupMode" type="radio" value="conditional"><span class="telemedicine-choice-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v5l-5 9a2.5 2.5 0 0 0 2.2 3.7h9.6A2.5 2.5 0 0 0 19 17l-5-9V3"/><path d="M7.4 16h9.2M9.2 12h5.6"/></svg></span><span><strong>Retorno após uma condição</strong><small>Exames, fisioterapia ou tratamento.</small></span></label>
        </div>
      </fieldset>
      <label data-tm-scheduled-field>Prazo para retorno em dias<input name="returnDays" type="number" min="1" max="730" placeholder="Ex.: 60"><small>Preencher limpa a data manual.</small></label>
      <label data-tm-scheduled-field>Ou data-alvo do retorno<input name="returnDueDate" type="date"><small>Preencher limpa o prazo em dias.</small></label>
      <label data-tm-conditional-field hidden>Retornar após<select name="conditionType"><option value="exams">Exames</option><option value="physiotherapy">Fisioterapia</option><option value="procedure">Procedimento ou cirurgia</option><option value="treatment">Conclusão do tratamento</option><option value="other">Outra condição</option></select></label>
      <label data-tm-conditional-field hidden>Detalhe da condição<input name="conditionDetail" maxlength="300" placeholder="Ex.: ressonância da coluna"><small>Opcional, exceto em “Outra condição”.</small></label>
      <label class="tm-span-2" data-tm-active-field>Observação operacional<textarea name="notes" maxlength="1500" rows="3" placeholder="Opcional"></textarea></label>
      <div class="tm-span-2 tm-inline-preview" data-tm-active-field></div>
      <div class="tm-span-2 tm-inline-form-actions"><button class="portal-button primary" type="submit">Salvar consulta</button></div>
      <div class="tm-span-2 tm-inline-status" aria-live="polite"></div>
    </form>`;
    toolbar.insertAdjacentElement('afterend', panel);
    document.getElementById('openConsultation')?.setAttribute('aria-expanded', 'true');
    panel.querySelector('[data-tm-consult-close]').addEventListener('click', closeConsultationInline);
    const form = panel.querySelector('form');
    const preview = panel.querySelector('.tm-inline-preview');
    const status = panel.querySelector('.tm-inline-status');
    const updatePreview = () => { preview.innerHTML = consultationPreview(form); };
    const syncConditionRequirement = () => {
      form.elements.conditionDetail.required = form.elements.followupMode.value === 'conditional' && form.elements.conditionType.value === 'other';
      form.elements.conditionDetail.placeholder = form.elements.conditionType.value === 'other'
        ? 'Descreva a condição necessária'
        : 'Ex.: ressonância da coluna';
    };
    const syncOutcome = ({ celebrate = false } = {}) => {
      const mode = form.elements.followupMode.value || 'scheduled';
      const discharged = mode === 'discharge';
      form.querySelectorAll('[data-tm-active-field]').forEach((field) => {
        field.hidden = discharged;
        field.setAttribute('aria-hidden', discharged ? 'true' : 'false');
      });
      form.querySelectorAll('[data-tm-scheduled-field]').forEach((field) => {
        field.hidden = mode !== 'scheduled';
        field.setAttribute('aria-hidden', mode === 'scheduled' ? 'false' : 'true');
      });
      form.querySelectorAll('[data-tm-conditional-field]').forEach((field) => {
        field.hidden = mode !== 'conditional';
        field.setAttribute('aria-hidden', mode === 'conditional' ? 'false' : 'true');
      });
      if (discharged) {
        form.elements.returnDays.value = '';
        form.elements.returnDueDate.value = '';
        form.elements.conditionDetail.value = '';
        form.elements.notes.value = '';
        if (celebrate) document.dispatchEvent(new CustomEvent('telemedicine:celebrate-discharge'));
      } else if (mode === 'conditional') {
        form.elements.returnDays.value = '';
        form.elements.returnDueDate.value = '';
      }
      syncConditionRequirement();
      updatePreview();
    };
    form.elements.consultationDate.addEventListener('input', updatePreview);
    form.elements.returnDays.addEventListener('input', () => {
      if (form.elements.returnDays.value) form.elements.returnDueDate.value = '';
      updatePreview();
    });
    form.elements.returnDueDate.addEventListener('input', () => {
      if (form.elements.returnDueDate.value) form.elements.returnDays.value = '';
      updatePreview();
    });
    form.elements.returnDueDate.addEventListener('change', () => {
      if (form.elements.returnDueDate.value) form.elements.returnDueDate.value = nextBusinessDay(form.elements.returnDueDate.value);
      updatePreview();
    });
    [...form.elements.followupMode].forEach((input) => input.addEventListener('change', (event) => {
      syncOutcome({ celebrate: event.target.value === 'discharge' && event.target.checked });
    }));
    form.elements.conditionType.addEventListener('change', () => {
      syncConditionRequirement();
      updatePreview();
    });
    form.elements.conditionDetail.addEventListener('input', updatePreview);
    syncOutcome();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const patientName = form.elements.patientName.value.trim();
      const followupMode = form.elements.followupMode.value || 'scheduled';
      const discharged = followupMode === 'discharge';
      const conditional = followupMode === 'conditional';
      let due = followupMode === 'scheduled' ? form.elements.returnDueDate.value : '';
      const days = followupMode === 'scheduled' && !due ? Number(form.elements.returnDays.value || 0) : 0;
      if (due) due = nextBusinessDay(due);
      const conditionType = conditional ? form.elements.conditionType.value : '';
      const conditionDetail = conditional ? form.elements.conditionDetail.value.trim() : '';
      if (conditional && conditionType === 'other' && !conditionDetail) {
        form.elements.conditionDetail.focus();
        setInlineStatus(status, 'Descreva a condição necessária para o retorno.', 'error');
        return;
      }
      const resolution = discharged
        ? 'ALTA DO EPISÓDIO'
        : conditional
          ? `RETORNO APÓS ${conditionType === 'other' ? conditionDetail : conditionLabels[conditionType].toUpperCase()}`
          : due
            ? `RETORNO PROGRAMADO PARA ${formatDate(due)}`
            : days > 0
              ? `RETORNO COM ${days} DIAS`
              : 'ACOMPANHAMENTO SEM DATA DEFINIDA';
      button.disabled = true;
      button.textContent = 'Salvando…';
      setInlineStatus(status, 'Salvando em segundo plano…');
      try {
        const payload = await auth.api('/api/telemedicina/consultations', {
          method: 'POST',
          body: JSON.stringify({
            patientName,
            consultationDate: form.elements.consultationDate.value,
            specialty: form.elements.specialty.value.trim(),
            resolution,
            followupMode,
            discharged,
            needsReturn: !discharged,
            returnDays: days,
            returnDueDate: due,
            conditionType,
            conditionDetail,
            notes: discharged ? '' : form.elements.notes.value.trim()
          })
        });
        const updated = payload.followup;
        if (updated) { setCachedFollowup(updated); upsertVisibleRow(updated); }
        setCachedPatient(payload.patientId, patientName);
        setInlineStatus(status, `Consulta de ${patientName} salva. O formulário continua disponível para o próximo registro.`, 'success');
        form.elements.patientName.value = '';
        form.elements.specialty.value = '';
        form.elements.returnDays.value = '';
        form.elements.returnDueDate.value = '';
        form.elements.notes.value = '';
        form.elements.conditionType.value = 'exams';
        form.elements.conditionDetail.value = '';
        form.elements.followupMode.value = 'scheduled';
        syncOutcome();
        form.elements.patientName.focus({ preventScroll: true });
      } catch (error) {
        setInlineStatus(status, error.message || 'Não foi possível salvar a consulta.', 'error');
      } finally {
        button.disabled = false;
        button.textContent = 'Salvar consulta';
      }
    });
  }

  async function handleRowAction(button) {
    const row = button.closest('[data-followup-row]');
    if (!row) return;
    if (button.dataset.action === 'patient') return openHistoryInline(row, button.dataset.patient || '', button);
    await ensureDashboard();
    const item = cache.followups.get(button.dataset.followup || '');
    if (!item) return;
    if (button.dataset.action === 'schedule') return openScheduleInline(row, item, button);
    if (button.dataset.action === 'requested') return openRequestedInline(row, item, button);
    if (button.dataset.action === 'copy-justification') return window.TelemedicineJustification?.copyFromButton(button, item);
  }

  function installCaptureHandlers() {
    document.addEventListener('click', (event) => {
      if (!isMobileContext()) return;
      const consultation = event.target.closest('#openConsultation');
      if (consultation) {
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleConsultationInline();
        return;
      }
      const stat = event.target.closest('[data-status-filter]');
      if (stat) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const filter = document.getElementById('statusFilter');
        if (filter) filter.value = stat.dataset.statusFilter || '';
        applyFilters();
        document.querySelector('.telemedicine-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const action = event.target.closest('#followupList [data-action]');
      if (action) {
        event.preventDefault();
        event.stopImmediatePropagation();
        handleRowAction(action).catch(() => null);
      }
    }, true);

    document.addEventListener('input', (event) => {
      if (!isMobileContext() || event.target?.id !== 'telemedicineSearch') return;
      event.stopImmediatePropagation();
      applyFilters();
    }, true);

    document.addEventListener('change', (event) => {
      if (!isMobileContext() || event.target?.id !== 'statusFilter') return;
      event.stopImmediatePropagation();
      applyFilters();
    }, true);
  }

  async function boot() {
    if (!isMobileContext()) return;
    document.body.classList.add('tm-inline-mobile-v9');
    document.body.dataset.mobileInteraction = 'v9';
    installCaptureHandlers();
    await ensureDashboard().catch(() => null);
    updateStats();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
