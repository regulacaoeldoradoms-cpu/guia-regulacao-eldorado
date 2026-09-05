'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['telemedicina']);
  if (!user) return;

  const state = {
    today: '',
    patients: [],
    followups: [],
    selectedFollowup: null,
    selectedPatientId: '',
    isAdmin: user.role === 'admin'
  };

  const roleLabels = { telemedicina: 'Técnico em Telemedicina', admin: 'Desenvolvedor · acesso técnico' };
  document.getElementById('portalUserName').textContent = user.name || user.username;
  document.getElementById('portalUserRole').textContent = roleLabels[user.role] || user.role;
  document.getElementById('openImport').hidden = !state.isAdmin;
  document.getElementById('normalizeSpecialties').hidden = !state.isAdmin;

  const listEl = document.getElementById('followupList');
  const searchEl = document.getElementById('telemedicineSearch');
  const filterEl = document.getElementById('statusFilter');
  const noticeEl = document.getElementById('systemNotice');
  const patientSuggestions = document.getElementById('patientSuggestions');
  const specialtySuggestions = document.getElementById('specialtySuggestions');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;' }[char]));
  }

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function formatDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return value || '—';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  function addDays(value, amount) {
    const date = new Date(`${value}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + amount);
    return date.toISOString().slice(0, 10);
  }

  function isBusinessDay(value) {
    const day = new Date(`${value}T12:00:00Z`).getUTCDay();
    return day !== 0 && day !== 6;
  }

  function nextBusinessDay(value) {
    let cursor = value;
    while (!isBusinessDay(cursor)) cursor = addDays(cursor, 1);
    return cursor;
  }

  function reminderDates(returnDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(returnDate || ''))) return [];
    let cursor = addDays(returnDate, -15);
    while (!isBusinessDay(cursor)) cursor = addDays(cursor, 1);
    const dates = [];
    while (dates.length < 3) {
      if (isBusinessDay(cursor)) dates.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return dates;
  }

  function showStatus(el, message, type = 'error') {
    if (!el) return;
    el.textContent = message;
    el.className = `account-status visible ${type}`;
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
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

  function latestPatientName(id) {
    return state.patients.find((item) => item.id === id)?.name || '';
  }

  function filteredFollowups() {
    const query = normalize(searchEl.value);
    const status = filterEl.value;
    return state.followups.filter((item) => {
      if (status && item.status !== status) return false;
      if (!query) return true;
      return [item.patientName, item.specialty, item.resolution, item.notes].some((value) => normalize(value).includes(query));
    });
  }

  function renderSummary(items) {
    const filterSummary = document.getElementById('filterSummary');
    const parts = [`${items.length} acompanhamento(s) exibido(s)`];
    if (filterEl.value) parts.push(`situação: ${filterEl.value}`);
    if (searchEl.value.trim()) parts.push(`busca: “${searchEl.value.trim()}”`);
    filterSummary.textContent = parts.join(' · ');
  }

  function renderList() {
    const items = filteredFollowups();
    renderSummary(items);
    if (!items.length) {
      listEl.innerHTML = '<div class="telemedicine-empty"><strong>Nenhum acompanhamento encontrado.</strong><br>Altere os filtros ou registre uma nova consulta.</div>';
      return;
    }
    listEl.innerHTML = items.map((item) => {
      const actions = actionButtons(item);
      return `<article class="telemedicine-row" data-followup-row="${escapeHtml(item.id)}" data-status="${escapeHtml(statusClass(item.status))}">
        <div class="telemedicine-patient">
          <span class="telemedicine-zone-label">Paciente</span>
          <button type="button" data-action="patient" data-patient="${escapeHtml(item.patientId)}">${escapeHtml(item.patientName || latestPatientName(item.patientId) || 'Paciente')}</button>
          ${item.alertToday ? '<span class="telemedicine-alert-marker">HOJE</span>' : ''}
          <span class="telemedicine-zone-label telemedicine-condition-label">Conduta</span>
          <small>${escapeHtml(item.resolution || 'Sem conduta registrada')}</small>
        </div>
        <div class="telemedicine-specialty-block"><div><strong>${escapeHtml(item.specialty || 'Especialidade não informada')}</strong><small>Última consulta: ${escapeHtml(formatDate(item.lastConsultationDate))}</small></div><span class="telemedicine-status ${statusClass(item.status)}">${escapeHtml(statusText(item))}</span></div>
        <div class="telemedicine-date-block"><span class="telemedicine-zone-label">Retorno e avisos</span><strong>${item.returnDueDate ? `Retorno: ${escapeHtml(formatDate(item.returnDueDate))}` : 'Retorno sem data'}</strong>${reminderMarkup(item)}</div>
        <div class="telemedicine-actions" data-action-count="${actions.length}" aria-label="Ações do acompanhamento">${actions.join('')}</div>
      </article>`;
    }).join('');
  }

  function renderStats(counts = {}) {
    document.getElementById('statSolicitar').textContent = String(counts.solicitar || 0);
    document.getElementById('statAtrasado').textContent = String(counts.atrasado || 0);
    document.getElementById('statAguardo').textContent = String(counts.emAguardo || 0);
    document.getElementById('statSemProgramacao').textContent = String(counts.semProgramacao || 0);
    const alerts = Number(counts.alertasHoje || 0);
    document.getElementById('todayAlerts').textContent = alerts ? `${alerts} aviso(s) programado(s) para hoje` : 'Nenhum aviso programado para hoje';
  }

  function renderSuggestions() {
    const names = [...new Set(state.patients.map((item) => item.name).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    patientSuggestions.innerHTML = names.map((name) => `<option value="${escapeHtml(name)}"></option>`).join('');
    const specialties = [...new Set(state.followups.map((item) => item.specialty).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    specialtySuggestions.innerHTML = specialties.map((name) => `<option value="${escapeHtml(name)}"></option>`).join('');
  }

  async function notifyDueItems(items) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const due = items.filter((item) => item.alertToday && !item.requestedAt);
    if (!due.length) return;
    const key = `telemedicine-notified-${state.today}`;
    try {
      if (sessionStorage.getItem(key)) return;
      const body = due.length === 1
        ? `${due[0].patientName} · ${due[0].specialty} · aviso ${due[0].reminderNumber || 1}/3`
        : `${due.length} retornos de telemedicina precisam da sua atenção hoje.`;
      new Notification('Regulação Eldorado · Telemedicina', { body, icon: '/assets/portal-regulacao-header.png' });
      sessionStorage.setItem(key, '1');
    } catch (_) {}
  }

  async function loadDashboard({ preserveNotice = false } = {}) {
    if (!preserveNotice) noticeEl.hidden = true;
    listEl.innerHTML = '<div class="portal-note info">Carregando acompanhamentos...</div>';
    try {
      const payload = await auth.api('/api/telemedicina/dashboard', { method: 'GET' });
      state.today = payload.today || new Date().toISOString().slice(0, 10);
      state.patients = Array.isArray(payload.patients) ? payload.patients : [];
      state.followups = Array.isArray(payload.followups) ? payload.followups : [];
      state.isAdmin = Boolean(payload.actor?.admin) || user.role === 'admin';
      document.getElementById('openImport').hidden = !state.isAdmin;
      document.getElementById('normalizeSpecialties').hidden = !state.isAdmin;
      document.getElementById('todayLabel').textContent = formatDate(state.today);
      renderStats(payload.counts || {});
      renderSuggestions();
      renderList();
      await notifyDueItems(state.followups);
    } catch (error) {
      const message = error.code === 'FIREBASE_PENDING'
        ? 'O módulo está instalado, mas o Firestore ainda não está disponível para armazenar os acompanhamentos.'
        : (error.message || 'Não foi possível carregar a Telemedicina.');
      listEl.innerHTML = `<div class="portal-note warning">${escapeHtml(message)}</div>`;
    }
  }

  async function openPatient(patientId) {
    state.selectedPatientId = patientId;
    document.getElementById('patientDetail').innerHTML = '<div class="portal-note info">Carregando histórico...</div>';
    openModal('patientModal');
    try {
      const payload = await auth.api(`/api/telemedicina/patients/${encodeURIComponent(patientId)}`, { method: 'GET' });
      const patient = payload.patient || {};
      document.getElementById('patientModalTitle').textContent = patient.name || 'Histórico do paciente';
      document.getElementById('patientModalMeta').textContent = patient.needsReview ? 'Cadastro sinalizado para revisão' : 'Histórico longitudinal de teleconsultas';
      const followups = Array.isArray(payload.followups) ? payload.followups : [];
      const events = Array.isArray(payload.events) ? payload.events : [];
      const current = followups.length ? `<div class="telemedicine-current"><strong>Situação atual</strong><div class="telemedicine-current-grid">${followups.map((item) => `<div><small>${escapeHtml(item.specialty || 'Especialidade')}</small><strong>${escapeHtml(item.status || '—')}</strong><span>${item.returnDueDate ? `Retorno ${escapeHtml(formatDate(item.returnDueDate))}` : 'Sem data-alvo definida'}</span></div>`).join('')}</div></div>` : '';
      const timeline = events.length ? `<div class="telemedicine-timeline">${events.map((event) => `<article class="telemedicine-event"><small>${escapeHtml(formatDate(event.eventDate))} · ${escapeHtml(event.specialty || '')}</small><h4>${escapeHtml(event.eventType === 'solicitacao' ? 'Solicitação registrada' : event.eventType === 'programacao' ? 'Retorno programado' : 'Teleconsulta')}</h4><p>${escapeHtml(event.resolution || '')}</p>${event.notes ? `<p><strong>Observação:</strong> ${escapeHtml(event.notes)}</p>` : ''}${event.returnDueDate ? `<small>Retorno-alvo: ${escapeHtml(formatDate(event.returnDueDate))}</small>` : ''}</article>`).join('')}</div>` : '<div class="telemedicine-empty">Nenhum evento histórico encontrado.</div>';
      document.getElementById('patientDetail').innerHTML = current + timeline;
    } catch (error) {
      document.getElementById('patientDetail').innerHTML = `<div class="portal-note warning">${escapeHtml(error.message || 'Não foi possível abrir o histórico.')}</div>`;
    }
  }

  function findFollowup(id) {
    return state.followups.find((item) => item.id === id) || null;
  }

  function openSchedule(item) {
    state.selectedFollowup = item;
    document.getElementById('scheduleMeta').textContent = `${item.patientName} · ${item.specialty}`;
    document.getElementById('scheduleReturnDate').value = item.returnDueDate || '';
    document.getElementById('scheduleStatus').className = 'account-status';
    updateSchedulePreview();
    openModal('scheduleModal');
  }

  function openRequested(item) {
    state.selectedFollowup = item;
    document.getElementById('requestedMeta').textContent = `${item.patientName} · ${item.specialty}`;
    document.getElementById('requestedDate').value = state.today || new Date().toISOString().slice(0, 10);
    document.getElementById('requestedNote').value = '';
    document.getElementById('requestedStatus').className = 'account-status';
    openModal('requestedModal');
  }

  function launchDischargeCelebration() {
    const layer = document.getElementById('dischargeCelebration');
    if (!layer) return;
    layer.replaceChildren();
    layer.classList.remove('active');
    void layer.offsetWidth;
    layer.classList.add('active');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const colors = ['#0d8f87', '#17a8d4', '#ffd166', '#ef476f', '#7b61ff', '#43aa8b'];
      for (let index = 0; index < 54; index += 1) {
        const piece = document.createElement('i');
        piece.className = 'telemedicine-confetti';
        piece.style.setProperty('--x', `${5 + Math.random() * 90}vw`);
        piece.style.setProperty('--delay', `${Math.random() * 0.35}s`);
        piece.style.setProperty('--duration', `${1.45 + Math.random() * 1.1}s`);
        piece.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
        piece.style.setProperty('--color', colors[index % colors.length]);
        layer.appendChild(piece);
      }
      for (let burst = 0; burst < 3; burst += 1) {
        const firework = document.createElement('b');
        firework.className = 'telemedicine-firework';
        firework.style.setProperty('--fx', `${22 + burst * 28}vw`);
        firework.style.setProperty('--fy', `${18 + (burst % 2) * 14}vh`);
        firework.style.setProperty('--firework-color', colors[(burst + 2) % colors.length]);
        layer.appendChild(firework);
      }
    }
    window.setTimeout(() => {
      layer.classList.remove('active');
      layer.replaceChildren();
    }, 3000);
  }

  document.addEventListener('telemedicine:celebrate-discharge', launchDischargeCelebration);

  const conditionLabels = {
    exams: 'exames',
    physiotherapy: 'fisioterapia',
    procedure: 'procedimento ou cirurgia',
    treatment: 'conclusão do tratamento',
    other: 'outra condição'
  };

  function selectedConsultMode() {
    return document.querySelector('input[name="consultOutcome"]:checked')?.value || 'scheduled';
  }

  function syncConditionDetailRequirement() {
    const type = document.getElementById('consultConditionType').value;
    const detail = document.getElementById('consultConditionDetail');
    detail.required = selectedConsultMode() === 'conditional' && type === 'other';
    detail.placeholder = type === 'other' ? 'Descreva a condição necessária' : 'Ex.: ressonância da coluna';
  }

  function syncConsultOutcome({ celebrate = false } = {}) {
    const mode = selectedConsultMode();
    const discharged = mode === 'discharge';
    const fields = document.getElementById('consultFollowupFields');
    const scheduled = document.getElementById('consultScheduledFields');
    const conditional = document.getElementById('consultConditionalFields');
    fields.hidden = discharged;
    fields.setAttribute('aria-hidden', discharged ? 'true' : 'false');
    scheduled.hidden = mode !== 'scheduled';
    conditional.hidden = mode !== 'conditional';
    if (discharged) {
      document.getElementById('consultReturnDays').value = '';
      document.getElementById('consultReturnDate').value = '';
      document.getElementById('consultConditionDetail').value = '';
      document.getElementById('consultNotes').value = '';
      if (celebrate) launchDischargeCelebration();
    } else if (mode === 'conditional') {
      document.getElementById('consultReturnDays').value = '';
      document.getElementById('consultReturnDate').value = '';
    }
    syncConditionDetailRequirement();
    updateConsultPreview();
  }

  function updateConsultPreview() {
    const mode = selectedConsultMode();
    const preview = document.getElementById('consultPreview');
    if (mode === 'conditional') {
      const type = document.getElementById('consultConditionType').value;
      const detail = document.getElementById('consultConditionDetail').value.trim();
      const condition = type === 'other' && detail ? detail : conditionLabels[type] || 'uma condição';
      preview.innerHTML = `<strong>Retorno sem data definida:</strong> após ${escapeHtml(condition)}.<br>Nenhum lembrete será criado; o registro ficará no histórico como “SEM PROGRAMAÇÃO”.`;
      return;
    }
    if (mode === 'discharge') {
      preview.textContent = '';
      return;
    }
    const consultDate = document.getElementById('consultDate').value;
    const days = Number(document.getElementById('consultReturnDays').value || 0);
    let target = document.getElementById('consultReturnDate').value;
    if (!target && consultDate && Number.isInteger(days) && days > 0) target = addDays(consultDate, days);
    if (!target) {
      preview.textContent = 'Sem data-alvo definida. O acompanhamento ficará em “SEM PROGRAMAÇÃO” até a data ser informada.';
      return;
    }
    target = nextBusinessDay(target);
    const dates = reminderDates(target);
    preview.innerHTML = `<strong>Retorno-alvo:</strong> ${escapeHtml(formatDate(target))}<br><strong>Lembretes:</strong> ${dates.map(formatDate).join(' · ')}`;
  }

  function updateSchedulePreview() {
    let value = document.getElementById('scheduleReturnDate').value;
    const preview = document.getElementById('schedulePreview');
    if (!value) {
      preview.textContent = 'Informe a data-alvo para calcular os lembretes.';
      return;
    }
    value = nextBusinessDay(value);
    const dates = reminderDates(value);
    preview.innerHTML = `<strong>Retorno:</strong> ${escapeHtml(formatDate(value))}<br><strong>3 avisos úteis:</strong> ${dates.map(formatDate).join(' · ')}`;
  }

  listEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'patient') return openPatient(button.dataset.patient);
    const item = findFollowup(button.dataset.followup);
    if (!item) return;
    if (button.dataset.action === 'schedule') openSchedule(item);
    if (button.dataset.action === 'requested') openRequested(item);
    if (button.dataset.action === 'copy-justification') window.TelemedicineJustification?.copyFromButton(button, item);
  });

  document.querySelectorAll('[data-status-filter]').forEach((button) => button.addEventListener('click', () => {
    filterEl.value = button.dataset.statusFilter || '';
    renderList();
    document.querySelector('.telemedicine-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  searchEl.addEventListener('input', renderList);
  filterEl.addEventListener('change', renderList);

  document.getElementById('openConsultation').addEventListener('click', () => {
    document.getElementById('consultationForm').reset();
    document.getElementById('consultOutcomeScheduled').checked = true;
    document.getElementById('consultDate').value = state.today || new Date().toISOString().slice(0, 10);
    document.getElementById('consultationStatus').className = 'account-status full';
    syncConsultOutcome();
    openModal('consultationModal');
  });

  document.getElementById('consultDate').addEventListener('input', updateConsultPreview);
  document.getElementById('consultReturnDays').addEventListener('input', (event) => {
    if (event.target.value) document.getElementById('consultReturnDate').value = '';
    updateConsultPreview();
  });
  document.getElementById('consultReturnDate').addEventListener('input', (event) => {
    if (event.target.value) document.getElementById('consultReturnDays').value = '';
    updateConsultPreview();
  });
  document.getElementById('consultReturnDate').addEventListener('change', (event) => {
    if (event.target.value) event.target.value = nextBusinessDay(event.target.value);
    updateConsultPreview();
  });
  document.querySelectorAll('input[name="consultOutcome"]').forEach((input) => input.addEventListener('change', (event) => {
    syncConsultOutcome({ celebrate: event.target.value === 'discharge' && event.target.checked });
  }));
  document.getElementById('consultConditionType').addEventListener('change', () => {
    syncConditionDetailRequirement();
    updateConsultPreview();
  });
  document.getElementById('consultConditionDetail').addEventListener('input', updateConsultPreview);
  document.getElementById('scheduleReturnDate').addEventListener('input', updateSchedulePreview);
  document.getElementById('scheduleReturnDate').addEventListener('change', (event) => {
    if (event.target.value) event.target.value = nextBusinessDay(event.target.value);
    updateSchedulePreview();
  });

  document.getElementById('consultationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('consultationStatus');
    const button = document.getElementById('saveConsultation');
    button.disabled = true;
    try {
      const followupMode = selectedConsultMode();
      const discharged = followupMode === 'discharge';
      const conditional = followupMode === 'conditional';
      const returnDueDate = followupMode === 'scheduled' ? document.getElementById('consultReturnDate').value : '';
      const returnDays = followupMode === 'scheduled' && !returnDueDate
        ? Number(document.getElementById('consultReturnDays').value || 0)
        : 0;
      const conditionType = conditional ? document.getElementById('consultConditionType').value : '';
      const conditionDetail = conditional ? document.getElementById('consultConditionDetail').value.trim() : '';
      if (conditional && conditionType === 'other' && !conditionDetail) {
        document.getElementById('consultConditionDetail').focus();
        throw new Error('Descreva a condição necessária para o retorno.');
      }
      const resolution = discharged
        ? 'ALTA DO EPISÓDIO'
        : conditional
          ? `RETORNO APÓS ${conditionType === 'other' ? conditionDetail : conditionLabels[conditionType].toUpperCase()}`
          : returnDueDate
            ? `RETORNO PROGRAMADO PARA ${formatDate(returnDueDate)}`
            : returnDays > 0
              ? `RETORNO COM ${returnDays} DIAS`
              : 'ACOMPANHAMENTO SEM DATA DEFINIDA';
      await auth.api('/api/telemedicina/consultations', {
        method: 'POST',
        body: JSON.stringify({
          patientName: document.getElementById('consultPatient').value.trim(),
          consultationDate: document.getElementById('consultDate').value,
          specialty: document.getElementById('consultSpecialty').value.trim(),
          resolution,
          followupMode,
          discharged,
          needsReturn: !discharged,
          returnDays,
          returnDueDate,
          conditionType,
          conditionDetail,
          notes: discharged ? '' : document.getElementById('consultNotes').value.trim()
        })
      });
      showStatus(status, 'Teleconsulta registrada no histórico do paciente.', 'success');
      await loadDashboard({ preserveNotice: true });
      setTimeout(() => closeModal('consultationModal'), 650);
    } catch (error) {
      showStatus(status, error.message || 'Não foi possível salvar a consulta.', 'error');
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('scheduleForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('scheduleStatus');
    if (!state.selectedFollowup) return;
    try {
      await auth.api(`/api/telemedicina/followups/${encodeURIComponent(state.selectedFollowup.id)}/schedule`, {
        method: 'PATCH', body: JSON.stringify({ returnDueDate: document.getElementById('scheduleReturnDate').value })
      });
      showStatus(status, 'Retorno e três lembretes úteis programados.', 'success');
      await loadDashboard({ preserveNotice: true });
      setTimeout(() => closeModal('scheduleModal'), 600);
    } catch (error) {
      showStatus(status, error.message || 'Não foi possível programar o retorno.', 'error');
    }
  });

  document.getElementById('requestedForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('requestedStatus');
    if (!state.selectedFollowup) return;
    try {
      await auth.api(`/api/telemedicina/followups/${encodeURIComponent(state.selectedFollowup.id)}/requested`, {
        method: 'POST',
        body: JSON.stringify({ requestedDate: document.getElementById('requestedDate').value, note: document.getElementById('requestedNote').value.trim() })
      });
      showStatus(status, 'Solicitação registrada. Os lembretes deste retorno foram encerrados.', 'success');
      await loadDashboard({ preserveNotice: true });
      setTimeout(() => closeModal('requestedModal'), 650);
    } catch (error) {
      showStatus(status, error.message || 'Não foi possível confirmar a solicitação.', 'error');
    }
  });

  document.getElementById('enableNotifications').addEventListener('click', async () => {
    const button = document.getElementById('enableNotifications');
    if (!('Notification' in window)) {
      button.textContent = 'Notificações não suportadas';
      button.disabled = true;
      return;
    }
    if (Notification.permission === 'denied') {
      button.textContent = 'Notificações bloqueadas';
      return;
    }
    const permission = await Notification.requestPermission();
    button.textContent = permission === 'granted' ? 'Notificações ativas' : 'Ativar notificações';
    if (permission === 'granted') await notifyDueItems(state.followups);
  });

  document.getElementById('openImport').addEventListener('click', () => {
    document.getElementById('importForm').reset();
    document.getElementById('importStatus').className = 'account-status';
    document.getElementById('importProgress').hidden = true;
    openModal('importModal');
  });

  document.getElementById('importForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.isAdmin) return;
    const status = document.getElementById('importStatus');
    const file = document.getElementById('importFile').files?.[0];
    const runButton = document.getElementById('runImport');
    if (!file) return showStatus(status, 'Selecione o arquivo JSON de migração.', 'error');
    runButton.disabled = true;
    try {
      const parsed = JSON.parse(await file.text());
      const records = Array.isArray(parsed) ? parsed : Array.isArray(parsed.records) ? parsed.records : [];
      if (!records.length) throw new Error('O arquivo não contém a lista de registros esperada.');
      const progress = document.getElementById('importProgress');
      const bar = document.getElementById('importProgressBar');
      const percentEl = document.getElementById('importProgressPercent');
      const textEl = document.getElementById('importProgressText');
      progress.hidden = false;
      const total = { imported: 0, duplicates: 0, invalid: 0, needsReview: 0 };
      const batchSize = 5;
      for (let offset = 0; offset < records.length; offset += batchSize) {
        const batch = records.slice(offset, offset + batchSize);
        const payload = await auth.api('/api/telemedicina/import', { method: 'POST', body: JSON.stringify({ records: batch }) });
        const summary = payload.summary || {};
        Object.keys(total).forEach((key) => { total[key] += Number(summary[key] || 0); });
        const done = Math.min(records.length, offset + batch.length);
        const pct = Math.round((done / records.length) * 100);
        bar.value = pct;
        percentEl.textContent = `${pct}%`;
        textEl.textContent = `${done} de ${records.length} registros processados`;
      }
      showStatus(status, `Importação concluída: ${total.imported} novos, ${total.duplicates} já existentes, ${total.invalid} inválidos e ${total.needsReview} sinalizados para revisão.`, 'success');
      await loadDashboard({ preserveNotice: true });
    } catch (error) {
      showStatus(status, error.message || 'Não foi possível importar o histórico.', 'error');
    } finally {
      runButton.disabled = false;
    }
  });

  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.closeModal)));
  document.querySelectorAll('.modal-backdrop').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal.id); }));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach((modal) => closeModal(modal.id)); });

  document.getElementById('portalLogout').addEventListener('click', async () => { await auth.logout(); location.replace('/login/'); });

  if ('Notification' in window && Notification.permission === 'granted') document.getElementById('enableNotifications').textContent = 'Notificações ativas';
  await loadDashboard();
})();
