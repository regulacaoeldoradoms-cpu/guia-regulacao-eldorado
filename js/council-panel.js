'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.me({ allowCached: false }).catch(() => null);
  if (!user) {
    location.replace(`/login/?next=${encodeURIComponent(location.pathname)}`);
    return;
  }
  if (!auth.hasCouncilAccess(user)) {
    location.replace(user.role === 'cidadao' ? '/cidadao/' : '/');
    return;
  }
  if (user.emailVerificationRequired) {
    const next = encodeURIComponent('/conselho/painel/');
    location.replace(`/conta/?verificar-email=1&next=${next}`);
    return;
  }

  const endpoint = String((window.REGULATION_AUTH_CONFIG || {}).endpoint || '').replace(/\/$/, '');
  const state = { manifestations: [], selectedProtocol: '', detail: null };
  const isPresident = user.councilRole === 'presidente';
  const statusLabels = {
    recebida: 'Recebida', em_analise: 'Em análise', aguardando_cidadao: 'Aguardando cidadão',
    encaminhada: 'Encaminhada', aguardando_retorno: 'Aguardando retorno', respondida: 'Respondida',
    concluida: 'Concluída', arquivada: 'Arquivada'
  };
  const typeLabels = { sugestao: 'Sugestão', reclamacao: 'Reclamação', elogio: 'Elogio', denuncia: 'Denúncia' };

  document.getElementById('portalUserName').textContent = user.name || user.username;
  document.getElementById('portalUserRole').textContent = isPresident ? 'Presidente do Conselho' : 'Membro do Conselho';
  document.getElementById('councilRoleBadge').textContent = isPresident ? '🏛️ Presidência do Conselho' : '🏛️ Membro do Conselho';
  document.getElementById('backHome').href = user.role === 'cidadao' ? '/cidadao/' : '/';
  document.querySelectorAll('.president-only').forEach((element) => { element.hidden = !isPresident; });

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || '');
    return date.toLocaleString('pt-BR', { timeZone: 'America/Campo_Grande', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function showStatus(el, message, type = 'error') {
    el.textContent = message;
    el.className = `account-status visible ${type}`;
  }

  function openModal() {
    const modal = document.getElementById('councilDetailModal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    const modal = document.getElementById('councilDetailModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function filtered() {
    const query = document.getElementById('councilSearch').value.trim().toLowerCase();
    const type = document.getElementById('councilType').value;
    const status = document.getElementById('councilStatus').value;
    return state.manifestations.filter((item) => {
      if (type && item.type !== type) return false;
      if (status && item.status !== status) return false;
      if (!query) return true;
      return `${item.protocol} ${item.subject} ${item.service} ${item.description}`.toLowerCase().includes(query);
    });
  }

  function renderMetrics() {
    const items = state.manifestations;
    document.getElementById('metricTotal').textContent = String(items.length);
    document.getElementById('metricNew').textContent = String(items.filter((item) => item.status === 'recebida').length);
    document.getElementById('metricAnalysis').textContent = String(items.filter((item) => item.status === 'em_analise').length);
    document.getElementById('metricWaiting').textContent = String(items.filter((item) => ['aguardando_cidadao', 'aguardando_retorno', 'encaminhada'].includes(item.status)).length);
    document.getElementById('metricDone').textContent = String(items.filter((item) => item.status === 'concluida').length);
  }

  function renderRows() {
    const rows = document.getElementById('councilRows');
    const items = filtered();
    if (!items.length) {
      rows.innerHTML = '<tr><td colspan="5">Nenhuma manifestação corresponde aos filtros.</td></tr>';
      return;
    }
    rows.innerHTML = items.map((item) => `<tr data-protocol="${escapeHtml(item.protocol)}">
      <td><strong>${escapeHtml(item.protocol)}</strong><small>${escapeHtml(formatDate(item.createdAt))}</small></td>
      <td><strong>${escapeHtml(item.subject || 'Sem assunto')}</strong><small>${escapeHtml(item.service || item.authorLabel || 'Identidade protegida')}</small></td>
      <td>${escapeHtml(typeLabels[item.type] || item.type)}</td>
      <td><span class="status-chip ${escapeHtml(item.status)}">${escapeHtml(statusLabels[item.status] || item.status)}</span></td>
      <td>${escapeHtml(formatDate(item.lastActivityAt || item.updatedAt || item.createdAt))}</td>
    </tr>`).join('');
  }

  async function loadAll() {
    document.getElementById('councilRows').innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
    try {
      const payload = await auth.api('/api/council/all', { method: 'GET' });
      state.manifestations = Array.isArray(payload?.manifestations) ? payload.manifestations : [];
      renderMetrics();
      renderRows();
      document.getElementById('firebaseNotice').hidden = true;
    } catch (error) {
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') {
        location.replace(error.verificationPath || `/conta/?verificar-email=1&next=${encodeURIComponent('/conselho/painel/')}`);
        return;
      }
      if (error.code === 'FIREBASE_PENDING' || error.status === 503) {
        const notice = document.getElementById('firebaseNotice');
        notice.textContent = 'O painel já está instalado, mas o projeto Firebase do Conselho ainda precisa ser conectado para começar a armazenar manifestações.';
        notice.hidden = false;
      }
      document.getElementById('councilRows').innerHTML = `<tr><td colspan="5">${escapeHtml(error.message || 'Não foi possível carregar as manifestações.')}</td></tr>`;
    }
  }

  function renderMessages(messages) {
    const el = document.getElementById('messageThread');
    if (!messages.length) {
      el.innerHTML = '<div class="empty-state">Ainda não há mensagens adicionais.</div>';
      return;
    }
    el.innerHTML = messages.map((message) => `<div class="thread-message ${message.senderType === 'council' ? 'council' : ''}">
      <strong>${escapeHtml(message.senderLabel || (message.senderType === 'council' ? 'Conselho Municipal de Saúde' : 'Cidadão'))} · ${escapeHtml(formatDate(message.createdAt))}</strong>
      <p>${escapeHtml(message.body)}</p>
    </div>`).join('');
  }

  function renderTimeline(events) {
    const el = document.getElementById('timeline');
    if (!events.length) {
      el.innerHTML = '<div class="empty-state">Sem movimentações registradas.</div>';
      return;
    }
    el.innerHTML = events.map((event) => {
      let title = event.detail || event.type;
      if (event.type === 'status_changed') title = `Andamento: ${statusLabels[event.fromStatus] || event.fromStatus} → ${statusLabels[event.toStatus] || event.toStatus}${event.detail ? ` · ${event.detail}` : ''}`;
      return `<div class="timeline-item"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(formatDate(event.createdAt))}${event.actorLabel ? ` · ${escapeHtml(event.actorLabel)}` : ''}</small></div>`;
    }).join('');
  }

  function renderNotes(notes) {
    const el = document.getElementById('internalNotes');
    if (!notes.length) {
      el.innerHTML = '<div style="font-size:.82rem;color:#708596;margin-bottom:10px">Nenhuma observação interna.</div>';
      return;
    }
    el.innerHTML = notes.map((note) => `<div class="internal-note"><strong>${escapeHtml(note.authorLabel || 'Conselho')} · ${escapeHtml(formatDate(note.createdAt))}</strong><p>${escapeHtml(note.body)}</p></div>`).join('');
  }

  function renderAttachments(items) {
    const list = document.getElementById('attachmentList');
    if (!items.length) {
      list.innerHTML = '<span style="color:#73889a;font-size:.84rem">Nenhum anexo.</span>';
      return;
    }
    list.innerHTML = items.map((item) => `<button class="attachment-link" type="button" data-attachment="${escapeHtml(item.id)}">📎 ${escapeHtml(item.fileName || 'Anexo')}</button>`).join('');
  }

  async function openDetail(protocol) {
    state.selectedProtocol = protocol;
    state.detail = null;
    openModal();
    document.getElementById('detailLoading').hidden = false;
    document.getElementById('detailLoading').textContent = 'Carregando...';
    document.getElementById('detailContent').hidden = true;
    try {
      const payload = await auth.api(`/api/council/manifestations/${encodeURIComponent(protocol)}`, { method: 'GET' });
      state.detail = payload;
      const item = payload.manifestation;
      document.getElementById('detailProtocol').textContent = item.protocol;
      document.getElementById('detailMeta').textContent = `${typeLabels[item.type] || item.type} · ${formatDate(item.createdAt)} · ${item.authorLabel || 'Identidade protegida'}`;
      const chip = document.getElementById('detailStatus');
      chip.textContent = statusLabels[item.status] || item.status;
      chip.className = `status-chip ${item.status}`;
      document.getElementById('detailPrivacy').textContent = item.privacyMode === 'sigilosa' ? '🔒 Sigilosa' : '🕶️ Anônima';
      document.getElementById('detailSubject').textContent = item.subject || '';
      document.getElementById('detailService').textContent = item.service ? `Serviço/unidade informado: ${item.service}` : 'Serviço/unidade não informado.';
      document.getElementById('detailDescription').textContent = item.description || '';
      document.getElementById('statusSelect').value = item.status || 'recebida';
      document.getElementById('statusDetail').value = '';
      renderMessages(payload.messages || []);
      renderTimeline(payload.events || []);
      renderNotes(payload.internalNotes || []);
      renderAttachments(payload.attachments || []);
      document.getElementById('detailLoading').hidden = true;
      document.getElementById('detailContent').hidden = false;
    } catch (error) {
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') {
        location.replace(error.verificationPath || `/conta/?verificar-email=1&next=${encodeURIComponent('/conselho/painel/')}`);
        return;
      }
      document.getElementById('detailLoading').textContent = error.message || 'Não foi possível abrir a manifestação.';
    }
  }

  document.getElementById('councilRows').addEventListener('click', (event) => {
    const row = event.target.closest('[data-protocol]');
    if (row) openDetail(row.dataset.protocol);
  });
  ['councilSearch', 'councilType', 'councilStatus'].forEach((id) => document.getElementById(id).addEventListener(id === 'councilSearch' ? 'input' : 'change', renderRows));
  document.getElementById('refreshCouncil').addEventListener('click', loadAll);
  document.querySelector('[data-close-modal]').addEventListener('click', closeModal);
  document.getElementById('councilDetailModal').addEventListener('click', (event) => { if (event.target.id === 'councilDetailModal') closeModal(); });

  document.getElementById('internalNoteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.selectedProtocol) return;
    const status = document.getElementById('internalNoteStatus');
    try {
      await auth.api(`/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/internal-notes`, {
        method: 'POST', body: JSON.stringify({ body: document.getElementById('internalNoteText').value })
      });
      document.getElementById('internalNoteText').value = '';
      showStatus(status, 'Observação interna registrada.', 'success');
      await openDetail(state.selectedProtocol);
    } catch (error) {
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') return location.replace(error.verificationPath || '/conta/?verificar-email=1');
      showStatus(status, error.message || 'Não foi possível registrar.', 'error');
    }
  });

  document.getElementById('saveStatus').addEventListener('click', async () => {
    if (!isPresident || !state.selectedProtocol) return;
    const statusEl = document.getElementById('statusUpdateMessage');
    try {
      await auth.api(`/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}`, {
        method: 'PATCH', body: JSON.stringify({ status: document.getElementById('statusSelect').value, detail: document.getElementById('statusDetail').value })
      });
      showStatus(statusEl, 'Andamento atualizado.', 'success');
      await Promise.all([openDetail(state.selectedProtocol), loadAll()]);
    } catch (error) {
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') return location.replace(error.verificationPath || '/conta/?verificar-email=1');
      showStatus(statusEl, error.message || 'Não foi possível atualizar.', 'error');
    }
  });

  document.getElementById('officialReplyForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isPresident || !state.selectedProtocol) return;
    const button = document.getElementById('officialReplyButton');
    const statusEl = document.getElementById('officialReplyStatus');
    button.disabled = true;
    try {
      await auth.api(`/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/messages`, {
        method: 'POST', body: JSON.stringify({ body: document.getElementById('officialReply').value })
      });
      document.getElementById('officialReply').value = '';
      showStatus(statusEl, 'Resposta enviada ao cidadão.', 'success');
      await Promise.all([openDetail(state.selectedProtocol), loadAll()]);
    } catch (error) {
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') return location.replace(error.verificationPath || '/conta/?verificar-email=1');
      showStatus(statusEl, error.message || 'Não foi possível enviar.', 'error');
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('attachmentList').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-attachment]');
    if (!button || !state.selectedProtocol) return;
    button.disabled = true;
    try {
      const response = await fetch(`${endpoint}/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/attachments/${encodeURIComponent(button.dataset.attachment)}`, {
        headers: auth.authorizationHeader(), cache: 'no-store'
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        if (payload.code === 'EMAIL_VERIFICATION_REQUIRED') {
          location.replace(payload.verificationPath || '/conta/?verificar-email=1');
          return;
        }
        throw new Error(payload.error || 'Não foi possível abrir o anexo.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      alert(error.message || 'Não foi possível abrir o anexo.');
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('portalLogout').addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  await loadAll();
})();
