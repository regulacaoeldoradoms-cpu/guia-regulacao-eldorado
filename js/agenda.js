'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['telemedicina']);
  if (!user) return;

  const DIGSAUDE_BASE = 'https://teleatendimento.saude.ms.gov.br/N%C3%BAcleo%20de%20Telessa%C3%BAde%20-%20SES-Fiocruz/consultas/';
  const els = {
    userName: document.getElementById('portalUserName'),
    userRole: document.getElementById('portalUserRole'),
    logout: document.getElementById('portalLogout'),
    status: document.getElementById('agendaStatus'),
    syncState: document.getElementById('agendaSyncState'),
    lastSync: document.getElementById('agendaLastSync'),
    list: document.getElementById('agendaList'),
    resultCount: document.getElementById('agendaResultCount'),
    search: document.getElementById('agendaSearch'),
    specialty: document.getElementById('agendaSpecialty'),
    order: document.getElementById('agendaOrder'),
    includeInactive: document.getElementById('agendaIncludeInactive'),
    refresh: document.getElementById('agendaRefresh'),
    unread: document.getElementById('agendaUnreadCount'),
    today: document.getElementById('agendaTodayCount'),
    tomorrow: document.getElementById('agendaTomorrowCount'),
    week: document.getElementById('agendaWeekCount'),
    active: document.getElementById('agendaActiveCount')
  };

  const state = {
    records: [],
    scope: 'all',
    justRead: new Set()
  };

  els.userName.textContent = user.name || user.username || 'Usuário';
  els.userRole.textContent = window.PortalTools?.roleLabels?.[user.role] || user.jobTitle || user.role || '';
  els.logout?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  function showStatus(message, tone = '') {
    if (!els.status) return;
    els.status.textContent = message;
    els.status.className = `agenda-status ${tone}`.trim();
    els.status.hidden = !message;
  }

  function localIsoDate(offsetDays = 0) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offsetDays);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDate(value) {
    const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value || '—');
  }

  function formatDateTime(value) {
    const source = String(value || '');
    if (!source) return 'Nenhuma sincronização registrada.';
    const date = new Date(source);
    if (Number.isNaN(date.getTime())) return source;
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  }

  function normalized(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function futureWithin(dateValue, days) {
    const date = String(dateValue || '');
    const today = localIsoDate(0);
    const end = localIsoDate(days);
    return date >= today && date <= end;
  }

  function recordMatchesScope(record) {
    if (!record.active && !els.includeInactive.checked) return false;
    if (state.scope === 'unread') return record.active && (record.unread || state.justRead.has(record.sourceId));
    if (state.scope === 'today') return record.active && record.appointmentDate === localIsoDate(0);
    if (state.scope === 'tomorrow') return record.active && record.appointmentDate === localIsoDate(1);
    if (state.scope === 'week') return record.active && futureWithin(record.appointmentDate, 7);
    return record.active || els.includeInactive.checked;
  }

  function compareAppointment(left, right) {
    const direction = els.order?.value === 'desc' ? -1 : 1;
    const leftDate = String(left?.appointmentDate || '');
    const rightDate = String(right?.appointmentDate || '');

    if (!leftDate && !rightDate) return String(left?.patient || '').localeCompare(String(right?.patient || ''), 'pt-BR');
    if (!leftDate) return 1;
    if (!rightDate) return -1;

    if (leftDate !== rightDate) return leftDate.localeCompare(rightDate) * direction;

    const leftTime = String(left?.appointmentTime || '');
    const rightTime = String(right?.appointmentTime || '');
    if (!leftTime && !rightTime) return String(left?.patient || '').localeCompare(String(right?.patient || ''), 'pt-BR');
    if (!leftTime) return 1;
    if (!rightTime) return -1;
    if (leftTime !== rightTime) return leftTime.localeCompare(rightTime) * direction;

    return String(left?.patient || '').localeCompare(String(right?.patient || ''), 'pt-BR');
  }

  function filteredRecords() {
    const query = normalized(els.search.value);
    const specialty = els.specialty.value;
    return state.records.filter((record) => {
      if (!recordMatchesScope(record)) return false;
      if (specialty && record.specialty !== specialty) return false;
      if (!query) return true;
      return [
        record.patient,
        record.specialty,
        record.specialist,
        record.municipality,
        record.facility,
        record.status,
        record.appointmentType
      ].some((value) => normalized(value).includes(query));
    }).sort(compareAppointment);
  }

  function metaBlock(label, value, className = '') {
    const wrap = document.createElement('div');
    wrap.className = `agenda-meta ${className}`.trim();
    const small = document.createElement('span');
    small.textContent = label;
    const strong = document.createElement('strong');
    strong.textContent = value || '—';
    wrap.append(small, strong);
    return wrap;
  }

  async function markRead(record, silent = false) {
    if (!record?.sourceId || !record.unread) return true;
    try {
      const result = await auth.api('/api/agenda/read', {
        method: 'POST',
        body: JSON.stringify({ sourceId: record.sourceId })
      });
      record.unread = false;
      record.readAt = result?.readAt || new Date().toISOString();
      state.justRead.add(record.sourceId);
      render();
      return true;
    } catch (error) {
      if (!silent) showStatus(error.message || 'Não foi possível marcar o agendamento como visualizado.', 'error');
      return false;
    }
  }

  function createCard(record) {
    const card = document.createElement('article');
    card.className = [
      'agenda-card',
      record.unread ? 'is-unread' : (record.active ? 'is-read' : ''),
      record.active ? '' : 'is-inactive'
    ].filter(Boolean).join(' ');
    card.dataset.sourceId = record.sourceId;

    const patient = document.createElement('div');
    patient.className = 'agenda-patient';
    if (record.unread) {
      const chip = document.createElement('span');
      chip.className = 'agenda-new-chip';
      chip.textContent = 'NOVO / ALTERADO';
      patient.appendChild(chip);
    }
    const name = document.createElement('strong');
    name.textContent = record.patient || 'Paciente não informado';
    const sub = document.createElement('small');
    const requested = record.requestedAt ? `Solicitado em ${record.requestedAt}` : 'Data da solicitação não informada';
    sub.textContent = requested;
    patient.append(name, sub);

    const specialty = metaBlock('Especialidade', record.specialty);
    const schedule = metaBlock('Agendamento', `${formatDate(record.appointmentDate)} · ${record.appointmentTime || 'horário não informado'}`, 'agenda-date');
    const specialist = metaBlock('Especialista', record.specialist);

    const actions = document.createElement('div');
    actions.className = 'agenda-card-actions';

    const open = document.createElement('a');
    open.href = DIGSAUDE_BASE + encodeURIComponent(record.sourceId) + '/view';
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = 'Abrir no DigSaúde';
    open.addEventListener('click', () => { markRead(record, true); });

    const read = document.createElement('button');
    read.type = 'button';
    read.textContent = record.unread ? 'Marcar como visto' : 'Visualizado';
    read.disabled = !record.unread;
    read.addEventListener('click', () => markRead(record));

    if (!record.active) {
      const inactive = document.createElement('span');
      inactive.className = 'agenda-status-chip';
      inactive.textContent = 'Saiu de Agendados';
      patient.appendChild(inactive);
    } else if (record.status) {
      const status = document.createElement('span');
      status.className = 'agenda-status-chip';
      status.textContent = record.status;
      patient.appendChild(status);
    }

    actions.append(open, read);
    card.append(patient, specialty, schedule, specialist, actions);
    return card;
  }

  function fillSpecialties() {
    const current = els.specialty.value;
    const specialties = [...new Set(state.records.filter((record) => record.active).map((record) => record.specialty).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
    els.specialty.replaceChildren(new Option('Todas as especialidades', ''));
    specialties.forEach((name) => els.specialty.appendChild(new Option(name, name)));
    if (specialties.includes(current)) els.specialty.value = current;
  }

  function renderSummary() {
    const active = state.records.filter((record) => record.active);
    els.unread.textContent = String(active.filter((record) => record.unread).length);
    els.today.textContent = String(active.filter((record) => record.appointmentDate === localIsoDate(0)).length);
    els.tomorrow.textContent = String(active.filter((record) => record.appointmentDate === localIsoDate(1)).length);
    els.week.textContent = String(active.filter((record) => futureWithin(record.appointmentDate, 7)).length);
    els.active.textContent = String(active.length);
  }

  function render() {
    renderSummary();
    fillSpecialties();
    const records = filteredRecords();
    els.resultCount.textContent = `${records.length} agendamento${records.length === 1 ? '' : 's'} nesta visualização`;
    els.list.replaceChildren();
    if (!records.length) {
      const empty = document.createElement('div');
      empty.className = 'agenda-empty';
      empty.textContent = state.scope === 'unread'
        ? 'Nenhum agendamento novo ou alterado aguardando sua visualização.'
        : 'Nenhum agendamento corresponde aos filtros atuais.';
      els.list.appendChild(empty);
      return;
    }
    records.forEach((record) => els.list.appendChild(createCard(record)));
  }

  async function load() {
    els.refresh.disabled = true;
    showStatus('');
    try {
      const payload = await auth.api('/api/agenda', { method: 'GET' });
      state.records = Array.isArray(payload?.records) ? payload.records : [];
      state.justRead.clear();
      const lastSync = payload?.summary?.lastSyncAt || '';
      els.lastSync.textContent = lastSync
        ? `Última sincronização: ${formatDateTime(lastSync)}`
        : 'Nenhuma sincronização registrada.';
      els.syncState.textContent = lastSync
        ? `${payload?.summary?.active || 0} ativos · ${payload?.summary?.unread || 0} novos para você`
        : 'Aguardando primeira sincronização';
      render();
    } catch (error) {
      els.list.innerHTML = '<div class="agenda-empty">Não foi possível carregar a Agenda.</div>';
      els.syncState.textContent = 'Falha ao consultar a Agenda';
      showStatus(error.message || 'Não foi possível carregar a Agenda.', 'error');
    } finally {
      els.refresh.disabled = false;
    }
  }

  document.querySelectorAll('[data-agenda-scope]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextScope = button.dataset.agendaScope || 'all';
      if (nextScope !== state.scope) state.justRead.clear();
      state.scope = nextScope;
      document.querySelectorAll('[data-agenda-scope]').forEach((item) => item.classList.toggle('is-active', item === button));
      render();
    });
  });

  els.search.addEventListener('input', render);
  els.specialty.addEventListener('change', render);
  els.order.addEventListener('change', render);
  els.includeInactive.addEventListener('change', render);
  els.refresh.addEventListener('click', load);

  const query = new URLSearchParams(location.search);
  if (query.get('sincronizado') === '1') {
    showStatus('Sincronização recebida. A Agenda foi atualizada.', 'success');
    history.replaceState({}, '', '/agenda/');
  }

  await load();
})();
