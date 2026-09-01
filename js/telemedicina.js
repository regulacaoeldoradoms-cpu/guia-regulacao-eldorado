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

  const listEl = document.getElementById('followupList');
  const searchEl = document.getElementById('telemedicineSearch');
  const filterEl = document.getElementById('statusFilter');
  const noticeEl = document.getElementById('systemNotice');
  const patientSuggestions = document.getElementById('patientSuggestions');
  const specialtySuggestions = document.getElementById('specialtySuggestions');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
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
      const reminder = Array.isArray(item.reminderDates) && item.reminderDates.length
        ? `Avisos: ${item.reminderDates.map(formatDate).join(' · ')}`
        : 'Sem lembretes calculados';
      const actionPrimary = ['SOLICITAR', 'ATRASADO', 'EM AGUARDO'].includes(item.status) && !item.requestedAt
        ? `<button class="portal-button primary" type="button" data-action="requested" data-followup="${escapeHtml(item.id)}">Solicitado</button>` : '';
      const scheduleAction = item.status === 'SEM PROGRAMAÇÃO' || item.needsReview
        ? `<button class="portal-button secondary" type="button" data-action="schedule" data-followup="${escapeHtml(item.id)}">Programar</button>` : '';
      return `<article class="telemedicine-row" data-followup-row="${escapeHtml(item.id)}">
        <div class="telemedicine-patient">
          <button type="button" data-action="patient" data-patient="${escapeHtml(item.patientId)}">${escapeHtml(item.patientName || latestPatientName(item.patientId) || 'Paciente')}</button>
          ${item.alertToday ? '<span class="telemedicine-alert-marker">HOJE</span>' : ''}
          <small>${escapeHtml(item.resolution || 'Sem conduta registrada')}</small>
        </div>
        <div class="telemedicine-specialty-block"><div><strong>${escapeHtml(item.specialty || 'Especialidade não informada')}</strong><small>Última consulta: ${escapeHtml(formatDate(item.lastConsultationDate))}</small></div><span class="telemedicine-status ${statusClass(item.status)}">${escapeHtml(statusText(item))}</span></div>
        <div class="telemedicine-date-block"><strong>${item.returnDueDate ? `Retorno: ${escapeHtml(formatDate(item.returnDueDate))}` : 'Retorno sem data'}</strong><small>${escapeHtml(reminder)}</small></div>
        <div class="telemedicine-actions">${scheduleAction}${actionPrimary}<button class="portal-button secondary" type="button" data-action="patient" data-patient="${escapeHtml(item.patientId)}">Histórico</button></div>
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

  function updateConsultPreview() {
    const consultDate = document.getElementById('consultDate').value;
    const days = Number(document.getElementById('consultReturnDays').value || 0);
    let target = document.getElementById('consultReturnDate').value;
    if (!target && consultDate && Number.isInteger(days) && days > 0) target = addDays(consultDate, days);
    const preview = document.getElementById('consultPreview');
    if (!document.getElementById('consultNeedsReturn').checked) {
      preview.textContent = 'Este registro será salvo sem acompanhamento pendente.';
      return;
    }
    if (!target) {
      preview.textContent = 'Sem data-alvo definida. O acompanhamento ficará em “SEM PROGRAMAÇÃO” até a data ser informada.';
      return;
    }
    const dates = reminderDates(target);
    preview.innerHTML = `<strong>Retorno-alvo:</strong> ${escapeHtml(formatDate(target))}<br><strong>Lembretes:</strong> ${dates.map(formatDate).join(' · ')}`;
  }

  function updateSchedulePreview() {
    const value = document.getElementById('scheduleReturnDate').value;
    const preview = document.getElementById('schedulePreview');
    if (!value) {
      preview.textContent = 'Informe a data-alvo para calcular os lembretes.';
      return;
    }
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
    document.getElementById('consultNeedsReturn').checked = true;
    document.getElementById('consultDate').value = state.today || new Date().toISOString().slice(0, 10);
    document.getElementById('consultationStatus').className = 'account-status full';
    updateConsultPreview();
    openModal('consultationModal');
  });

  ['consultDate', 'consultReturnDays', 'consultReturnDate', 'consultNeedsReturn'].forEach((id) => document.getElementById(id).addEventListener('input', updateConsultPreview));
  document.getElementById('scheduleReturnDate').addEventListener('input', updateSchedulePreview);

  document.getElementById('consultationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('consultationStatus');
    const button = document.getElementById('saveConsultation');
    button.disabled = true;
    try {
      await auth.api('/api/telemedicina/consultations', {
        method: 'POST',
        body: JSON.stringify({
          patientName: document.getElementById('consultPatient').value.trim(),
          consultationDate: document.getElementById('consultDate').value,
          specialty: document.getElementById('consultSpecialty').value.trim(),
          resolution: document.getElementById('consultResolution').value.trim(),
          needsReturn: document.getElementById('consultNeedsReturn').checked,
          returnDays: Number(document.getElementById('consultReturnDays').value || 0),
          returnDueDate: document.getElementById('consultReturnDate').value,
          notes: document.getElementById('consultNotes').value.trim()
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
      const batchSize = 60;
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
