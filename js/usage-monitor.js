'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const config = window.REGULATION_AUTH_CONFIG || {};
  const endpoint = String(config.endpoint || '').replace(/\/$/, '');
  const currentUser = await auth.requireRole(['admin']);
  if (!currentUser || currentUser.role !== 'admin' || !endpoint) return;

  const state = {
    doctors: [],
    selected: '',
    period: 'day',
    timer: null
  };

  document.getElementById('portalUserName').textContent = currentUser.name || currentUser.username;
  document.getElementById('portalUserRole').textContent = 'Desenvolvedor · acesso total';

  const listEl = document.getElementById('doctorList');
  const searchEl = document.getElementById('doctorSearch');
  const historyBody = document.getElementById('usageHistoryBody');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function parseServerDate(value) {
    if (!value) return null;
    const parsed = new Date(`${String(value).replace(' ', 'T')}Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function localDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Campo_Grande', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date).reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function dateKeyDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return localDateKey(date);
  }

  function formatDateKey(value) {
    const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value || '');
  }

  function formatClock(value) {
    const parsed = parseServerDate(value);
    if (!parsed) return '—';
    return parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Campo_Grande' });
  }

  function formatDateTime(value) {
    const parsed = parseServerDate(value);
    if (!parsed) return '—';
    return parsed.toLocaleString('pt-BR', {
      timeZone: 'America/Campo_Grande', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function lastSeenText(value) {
    const parsed = parseServerDate(value);
    if (!parsed) return 'Nunca registrado';
    const dateKey = localDateKey(parsed);
    const today = localDateKey();
    const yesterday = dateKeyDaysAgo(1);
    const time = parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Campo_Grande' });
    if (dateKey === today) return `Hoje às ${time}`;
    if (dateKey === yesterday) return `Ontem às ${time}`;
    return formatDateTime(value);
  }

  function rowsSince(doctor, days) {
    const threshold = dateKeyDaysAgo(days - 1);
    return (doctor.history || []).filter((row) => row.usageDate >= threshold);
  }

  function sum(rows, key) {
    return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
  }

  function activeDays(rows) {
    return new Set(rows.filter((row) => Number(row.heartbeatCount || 0) > 0).map((row) => row.usageDate)).size;
  }

  function renderSummary() {
    const activeDoctors = state.doctors.filter((doctor) => doctor.active !== false);
    const today = localDateKey();
    document.getElementById('metricDoctors').textContent = String(state.doctors.length);
    document.getElementById('metricOnline').textContent = String(activeDoctors.filter((doctor) => doctor.online).length);
    document.getElementById('metricToday').textContent = String(activeDoctors.filter((doctor) => (doctor.history || []).some((row) => row.usageDate === today)).length);
    document.getElementById('metricWeek').textContent = String(activeDoctors.filter((doctor) => rowsSince(doctor, 7).length > 0).length);
    document.getElementById('doctorsCount').textContent = `${state.doctors.length} médico(s) · ${activeDoctors.length} ativo(s)`;
  }

  function filteredDoctors() {
    const q = String(searchEl.value || '').trim().toLowerCase();
    if (!q) return state.doctors;
    return state.doctors.filter((doctor) => `${doctor.name} ${doctor.username} ${doctor.jobTitle}`.toLowerCase().includes(q));
  }

  function renderDoctors() {
    const doctors = filteredDoctors();
    if (!doctors.length) {
      listEl.innerHTML = '<div class="portal-note info">Nenhum médico encontrado.</div>';
      return;
    }

    listEl.innerHTML = doctors.map((doctor) => {
      const recent30 = rowsSince(doctor, 30);
      const guide30 = sum(recent30, 'guideVisits');
      const presence = doctor.online ? 'online agora' : lastSeenText(doctor.lastSeen);
      return `<button class="usage-doctor ${state.selected === doctor.username ? 'active' : ''}" type="button" data-doctor="${escapeHtml(doctor.username)}">
        <span class="usage-doctor-main">
          <strong>${escapeHtml(doctor.name || doctor.username)}</strong>
          <small>${escapeHtml(doctor.jobTitle || `@${doctor.username}`)}</small>
          <span class="usage-doctor-presence ${doctor.online ? 'online' : ''}"><span class="usage-presence-dot"></span>${escapeHtml(presence)}</span>
        </span>
        <span class="usage-doctor-metric"><strong>${guide30}</strong><span>Guia · 30 dias</span></span>
      </button>`;
    }).join('');
  }

  function weekStartKey(dateKey) {
    const date = new Date(`${dateKey}T12:00:00Z`);
    const day = date.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setUTCDate(date.getUTCDate() + diff);
    return date.toISOString().slice(0, 10);
  }

  function weekLabel(startKey) {
    const start = new Date(`${startKey}T12:00:00Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);
    const startLabel = start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
    const endLabel = end.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
    return `${startLabel} – ${endLabel}`;
  }

  function monthLabel(monthKey) {
    const [year, month] = monthKey.split('-').map(Number);
    if (!year || !month) return monthKey;
    const label = new Date(Date.UTC(year, month - 1, 15)).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function aggregateHistory(rows, period) {
    const groups = new Map();
    rows.forEach((row) => {
      const key = period === 'month'
        ? row.usageDate.slice(0, 7)
        : period === 'week'
          ? weekStartKey(row.usageDate)
          : row.usageDate;
      if (!groups.has(key)) groups.set(key, { key, rows: [], visits: 0, guideVisits: 0, activeSeconds: 0, firstSeen: null, lastSeen: null });
      const group = groups.get(key);
      group.rows.push(row);
      group.visits += Number(row.visits || 0);
      group.guideVisits += Number(row.guideVisits || 0);
      group.activeSeconds += Number(row.activeSeconds || 0);
      if (!group.firstSeen || String(row.firstSeen || '') < group.firstSeen) group.firstSeen = row.firstSeen || group.firstSeen;
      if (!group.lastSeen || String(row.lastSeen || '') > group.lastSeen) group.lastSeen = row.lastSeen || group.lastSeen;
    });

    return [...groups.values()].sort((a, b) => b.key.localeCompare(a.key)).map((group) => ({
      ...group,
      label: period === 'month' ? monthLabel(group.key) : period === 'week' ? weekLabel(group.key) : formatDateKey(group.key),
      activeDays: activeDays(group.rows)
    }));
  }

  function renderHistory(doctor) {
    const groups = aggregateHistory(doctor.history || [], state.period);
    if (!groups.length) {
      historyBody.innerHTML = '<tr><td colspan="6" class="zero">Ainda não há histórico detalhado registrado para este profissional.</td></tr>';
      return;
    }

    historyBody.innerHTML = groups.map((group) => `<tr>
      <td><strong>${escapeHtml(group.label)}</strong></td>
      <td>${group.activeDays}</td>
      <td>${group.guideVisits || '<span class="zero">0</span>'}</td>
      <td>${group.visits || '<span class="zero">0</span>'}</td>
      <td>${state.period === 'day' ? escapeHtml(formatClock(group.firstSeen)) : escapeHtml(formatDateTime(group.firstSeen))}</td>
      <td>${state.period === 'day' ? escapeHtml(formatClock(group.lastSeen)) : escapeHtml(formatDateTime(group.lastSeen))}</td>
    </tr>`).join('');
  }

  function selectedDoctor() {
    return state.doctors.find((doctor) => doctor.username === state.selected) || null;
  }

  function renderSelected() {
    const doctor = selectedDoctor();
    const empty = document.getElementById('usageEmptyState');
    const selected = document.getElementById('usageSelected');
    if (!doctor) {
      empty.hidden = false;
      selected.hidden = true;
      return;
    }

    empty.hidden = true;
    selected.hidden = false;
    document.getElementById('selectedDoctorName').textContent = doctor.name || doctor.username;
    document.getElementById('selectedDoctorMeta').textContent = `${doctor.jobTitle || 'Médico'} · @${doctor.username}${doctor.active === false ? ' · acesso desativado' : ''}`;
    const presence = document.getElementById('selectedPresence');
    presence.textContent = doctor.online ? '● Online agora' : `○ ${lastSeenText(doctor.lastSeen)}`;
    presence.classList.toggle('online', Boolean(doctor.online));

    const rows7 = rowsSince(doctor, 7);
    const rows30 = rowsSince(doctor, 30);
    document.getElementById('selectedGuide7').textContent = String(sum(rows7, 'guideVisits'));
    document.getElementById('selectedDays30').textContent = String(activeDays(rows30));
    document.getElementById('selectedGuide30').textContent = String(sum(rows30, 'guideVisits'));
    document.getElementById('selectedLastSeen').textContent = lastSeenText(doctor.lastSeen);
    renderHistory(doctor);
  }

  function renderAll() {
    renderSummary();
    renderDoctors();
    renderSelected();
  }

  async function loadUsage({ quiet = false } = {}) {
    if (!quiet) listEl.innerHTML = '<div class="portal-note info">Carregando profissionais...</div>';
    try {
      const response = await fetch(`${endpoint}/api/admin/usage?days=370`, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', ...auth.authorizationHeader() }
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Falha ao carregar monitoramento (${response.status}).`);
      state.doctors = Array.isArray(payload.doctors) ? payload.doctors : [];
      if (!state.selected && state.doctors.length) {
        state.selected = (state.doctors.find((doctor) => doctor.online) || state.doctors[0]).username;
      }
      if (state.selected && !state.doctors.some((doctor) => doctor.username === state.selected)) state.selected = state.doctors[0]?.username || '';
      renderAll();
    } catch (error) {
      if (!quiet) listEl.innerHTML = `<div class="portal-note warning">${escapeHtml(error.message || 'Não foi possível carregar o monitoramento.')}</div>`;
    }
  }

  listEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-doctor]');
    if (!button) return;
    state.selected = button.dataset.doctor || '';
    renderDoctors();
    renderSelected();
  });

  searchEl.addEventListener('input', renderDoctors);

  document.querySelectorAll('[data-period]').forEach((button) => {
    button.addEventListener('click', () => {
      state.period = button.dataset.period || 'day';
      document.querySelectorAll('[data-period]').forEach((item) => item.classList.toggle('active', item === button));
      renderSelected();
    });
  });

  document.getElementById('portalLogout')?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  await loadUsage();
  state.timer = window.setInterval(() => loadUsage({ quiet: true }), 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loadUsage({ quiet: true }); });
})();
