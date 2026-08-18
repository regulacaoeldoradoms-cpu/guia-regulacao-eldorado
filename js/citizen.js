'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole([], { deniedPath: '/' });
  if (!user) return;

  const endpoint = String((window.REGULATION_AUTH_CONFIG || {}).endpoint || '').replace(/\/$/, '');
  const state = { manifestations: [], notifications: [], security: null, selectedProtocol: '' };
  const statusLabels = {
    recebida: 'Recebida', em_analise: 'Em análise', aguardando_cidadao: 'Aguardando sua resposta',
    encaminhada: 'Encaminhada', aguardando_retorno: 'Aguardando retorno', respondida: 'Respondida',
    concluida: 'Concluída', arquivada: 'Arquivada'
  };
  const typeLabels = { sugestao: 'Sugestão', reclamacao: 'Reclamação', elogio: 'Elogio', denuncia: 'Denúncia' };
  const roleLabels = {
    medico: 'Médico',
    recepcao: 'Recepção',
    coordenacao: 'Coordenação',
    admin: 'Desenvolvedor',
    cidadao: 'Cidadão'
  };
  const isPrimaryCitizen = user.role === 'cidadao';

  document.getElementById('portalUserName').textContent = user.name || user.username;
  const roleBase = roleLabels[user.role] || user.role || 'Usuário';
  const roleJob = !isPrimaryCitizen && user.jobTitle ? ` · ${user.jobTitle}` : '';
  const roleCouncil = user.councilRole ? ` · Conselho: ${user.councilRole === 'presidente' ? 'Presidente' : 'Membro'}` : '';
  document.getElementById('portalUserRole').textContent = `${roleBase}${roleJob}${roleCouncil}`;

  const professionalHomeLink = document.getElementById('professionalHomeLink');
  if (professionalHomeLink) professionalHomeLink.hidden = isPrimaryCitizen;

  const contextNotice = document.getElementById('citizenContextNotice');
  if (contextNotice && !isPrimaryCitizen) {
    const councilExtra = auth.hasCouncilAccess(user)
      ? ' Se você também integra o Conselho, suas ações institucionais continuam disponíveis somente no painel institucional.'
      : '';
    contextNotice.innerHTML = `<strong>Uma conta, o mesmo perfil.</strong> Você continua identificado no portal pelo seu cargo profissional. O Canal do Cidadão é apenas mais um módulo da mesma conta.${councilExtra} Nas manifestações, seu e-mail não é exibido ao Conselho; o texto e os anexos podem revelar sua identidade se você próprio incluir esses dados.`;
    contextNotice.hidden = false;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || '');
    return date.toLocaleString('pt-BR', { timeZone: 'America/Campo_Grande', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  // O parâmetro existe apenas para autorização da operação quando a mesma conta também
  // possui função no Conselho. Ele não representa uma segunda identidade ou um segundo perfil.
  function citizenContextPath(path) {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}as=citizen`;
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function showStatus(el, message, type = 'error') {
    el.textContent = message;
    el.className = `account-status visible ${type}`;
  }

  function privacyText() {
    if (!isPrimaryCitizen) {
      return state.security?.emailVerified
        ? '🔒 Sigilosa · e-mail de segurança protegido'
        : '⚠️ Confirme o e-mail de segurança para enviar manifestações';
    }
    return state.security?.privacyMode === 'sigilosa'
      ? '🔒 Sigilosa · seu e-mail de segurança não é exibido ao Conselho'
      : '🕶️ Anônima · esta conta não possui e-mail ou telefone de identificação';
  }

  async function loadSecurity() {
    state.security = await auth.getSecurity().catch(() => ({ privacyMode: user.privacyMode || 'anonima', emailVerified: user.emailVerified }));
    document.getElementById('privacyChip').textContent = privacyText();
    document.getElementById('newPrivacyNotice').textContent = !isPrimaryCitizen && !state.security?.emailVerified
      ? 'Para enviar uma manifestação com sua conta profissional, confirme primeiro o e-mail de segurança. Depois disso, o protocolo será tratado como sigiloso.'
      : `Privacidade desta manifestação: ${privacyText().replace(/^[^ ]+ /, '')}.`;
  }

  function renderManifestations() {
    const list = document.getElementById('manifestationList');
    if (!state.manifestations.length) {
      list.innerHTML = '<div class="empty-state"><strong>Nenhuma manifestação ainda.</strong><br>Quando você enviar a primeira, ela aparecerá aqui.</div>';
      return;
    }
    list.innerHTML = state.manifestations.map((item) => `<button class="manifestation-item" type="button" data-protocol="${escapeHtml(item.protocol)}">
      <span><strong>${escapeHtml(item.subject || item.protocol)}</strong><small>${escapeHtml(item.protocol)} · ${escapeHtml(typeLabels[item.type] || item.type)} · ${escapeHtml(formatDate(item.createdAt))}</small></span>
      <span class="status-chip ${escapeHtml(item.status)}">${escapeHtml(statusLabels[item.status] || item.status)}</span>
    </button>`).join('');
  }

  async function loadManifestations() {
    const list = document.getElementById('manifestationList');
    list.innerHTML = '<div class="portal-note info">Carregando manifestações...</div>';
    try {
      const payload = await auth.api('/api/council/my', { method: 'GET' });
      state.manifestations = Array.isArray(payload?.manifestations) ? payload.manifestations : [];
      renderManifestations();
      document.getElementById('firebaseNotice').hidden = true;
    } catch (error) {
      if (error.code === 'FIREBASE_PENDING' || error.status === 503) {
        const notice = document.getElementById('firebaseNotice');
        notice.textContent = 'O Canal do Conselho já está instalado no portal, mas o armazenamento Firebase ainda precisa ser conectado para começar a receber manifestações.';
        notice.hidden = false;
      }
      list.innerHTML = `<div class="portal-note warning">${escapeHtml(error.message || 'Não foi possível carregar as manifestações.')}</div>`;
    }
  }

  function renderNotifications() {
    const list = document.getElementById('notificationList');
    const unread = state.notifications.filter((item) => !item.readAt).length;
    const badge = document.getElementById('notificationCount');
    badge.textContent = String(unread);
    badge.hidden = unread === 0;
    if (!state.notifications.length) {
      list.innerHTML = '<div class="empty-state">Nenhuma notificação no momento.</div>';
      return;
    }
    list.innerHTML = state.notifications.map((item) => `<button class="notification ${item.readAt ? '' : 'unread'}" type="button" data-notification="${item.id}" data-protocol="${escapeHtml(item.protocol || '')}">
      <strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.protocol || '')}${item.protocol ? ' · ' : ''}${escapeHtml(formatDate(item.createdAt))}</small>
    </button>`).join('');
  }

  async function loadNotifications() {
    try {
      const payload = await auth.api('/api/council/notifications', { method: 'GET' });
      state.notifications = Array.isArray(payload?.notifications) ? payload.notifications : [];
      renderNotifications();
    } catch (_) {
      document.getElementById('notificationList').innerHTML = '<div class="portal-note warning">Não foi possível carregar as notificações.</div>';
    }
  }

  function renderThread(messages) {
    const el = document.getElementById('messageThread');
    if (!messages.length) {
      el.innerHTML = '<div class="empty-state">Ainda não há mensagens adicionais neste protocolo.</div>';
      return;
    }
    el.innerHTML = messages.map((message) => {
      const label = message.senderType === 'council' ? 'Conselho Municipal de Saúde' : 'Você';
      return `<div class="thread-message ${message.senderType === 'council' ? 'council' : ''}">
        <strong>${escapeHtml(label)} · ${escapeHtml(formatDate(message.createdAt))}</strong>
        <p>${escapeHtml(message.body)}</p>
      </div>`;
    }).join('');
  }

  function renderTimeline(events) {
    const el = document.getElementById('timeline');
    if (!events.length) {
      el.innerHTML = '<div class="empty-state">Histórico ainda não disponível.</div>';
      return;
    }
    el.innerHTML = events.map((event) => {
      let title = event.detail || event.type;
      if (event.type === 'status_changed') title = `Andamento: ${statusLabels[event.fromStatus] || event.fromStatus} → ${statusLabels[event.toStatus] || event.toStatus}`;
      return `<div class="timeline-item"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(formatDate(event.createdAt))}${event.actorLabel ? ` · ${escapeHtml(event.actorLabel)}` : ''}</small></div>`;
    }).join('');
  }

  function renderAttachments(items) {
    const list = document.getElementById('attachmentList');
    if (!items.length) {
      list.innerHTML = '<span style="color:#73889a;font-size:.84rem">Nenhum anexo.</span>';
      return;
    }
    list.innerHTML = items.map((item) => `<button class="attachment-link" type="button" data-attachment="${escapeHtml(item.id)}">📎 ${escapeHtml(item.displayName || 'Anexo')}</button>`).join('');
  }

  async function openDetail(protocol) {
    state.selectedProtocol = protocol;
    openModal('manifestationDetailModal');
    document.getElementById('detailLoading').hidden = false;
    document.getElementById('detailContent').hidden = true;
    try {
      const path = citizenContextPath(`/api/council/manifestations/${encodeURIComponent(protocol)}`);
      const payload = await auth.api(path, { method: 'GET' });
      const item = payload.manifestation;
      document.getElementById('detailProtocol').textContent = item.protocol;
      document.getElementById('detailMeta').textContent = `${typeLabels[item.type] || item.type} · ${formatDate(item.createdAt)}`;
      const chip = document.getElementById('detailStatus');
      chip.textContent = statusLabels[item.status] || item.status;
      chip.className = `status-chip ${item.status}`;
      document.getElementById('detailPrivacy').textContent = item.privacyMode === 'sigilosa' ? '🔒 Sigilosa' : '🕶️ Anônima';
      document.getElementById('detailSubject').textContent = item.subject || '';
      document.getElementById('detailDescription').textContent = item.description || '';
      renderThread(payload.messages || []);
      renderTimeline(payload.events || []);
      renderAttachments(payload.attachments || []);
      document.getElementById('detailLoading').hidden = true;
      document.getElementById('detailContent').hidden = false;
    } catch (error) {
      document.getElementById('detailLoading').textContent = error.message || 'Não foi possível abrir a manifestação.';
    }
  }

  document.getElementById('openNewManifestation').addEventListener('click', () => openModal('newManifestationModal'));
  document.getElementById('focusManifestations').addEventListener('click', () => document.getElementById('manifestationsCard').scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('focusNotifications').addEventListener('click', () => document.getElementById('notificationsCard').scrollIntoView({ behavior: 'smooth' }));
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.closeModal)));
  document.querySelectorAll('.citizen-modal').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal.id); }));

  document.getElementById('newManifestationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = document.getElementById('submitManifestation');
    const status = document.getElementById('newManifestationStatus');
    button.disabled = true;
    button.textContent = 'Enviando...';
    status.className = 'account-status';
    try {
      const payload = await auth.api('/api/council/manifestations', {
        method: 'POST',
        body: JSON.stringify({
          type: document.getElementById('manifestationType').value,
          service: document.getElementById('manifestationService').value,
          subject: document.getElementById('manifestationSubject').value,
          description: document.getElementById('manifestationDescription').value
        })
      });
      event.currentTarget.reset();
      showStatus(status, `Manifestação enviada. Protocolo: ${payload.manifestation.protocol}`, 'success');
      await Promise.all([loadManifestations(), loadNotifications()]);
      window.setTimeout(() => { closeModal('newManifestationModal'); openDetail(payload.manifestation.protocol); }, 650);
    } catch (error) {
      let message = error.message || 'Não foi possível enviar.';
      if (error.status === 429 && error.retryAfterSeconds) {
        const minutes = Math.ceil(error.retryAfterSeconds / 60);
        message += ` Tente novamente em aproximadamente ${minutes} minuto(s).`;
      }
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') {
        message += ' Abra Minha conta para confirmar o e-mail de segurança.';
      }
      showStatus(status, message, 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Enviar manifestação';
    }
  });

  document.getElementById('manifestationList').addEventListener('click', (event) => {
    const item = event.target.closest('[data-protocol]');
    if (item) openDetail(item.dataset.protocol);
  });

  document.getElementById('notificationList').addEventListener('click', async (event) => {
    const item = event.target.closest('[data-notification]');
    if (!item) return;
    await auth.api('/api/council/notifications', { method: 'PATCH', body: JSON.stringify({ id: Number(item.dataset.notification) }) }).catch(() => {});
    if (item.dataset.protocol) openDetail(item.dataset.protocol);
    loadNotifications();
  });

  document.getElementById('markNotificationsRead').addEventListener('click', async () => {
    await auth.api('/api/council/notifications', { method: 'PATCH', body: '{}' }).catch(() => {});
    loadNotifications();
  });

  document.getElementById('refreshManifestations').addEventListener('click', () => loadManifestations());

  document.getElementById('replyForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.selectedProtocol) return;
    const button = document.getElementById('replyButton');
    const status = document.getElementById('replyStatus');
    button.disabled = true;
    try {
      const path = citizenContextPath(`/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/messages`);
      await auth.api(path, {
        method: 'POST', body: JSON.stringify({ body: document.getElementById('replyText').value })
      });
      document.getElementById('replyText').value = '';
      showStatus(status, 'Resposta enviada.', 'success');
      await openDetail(state.selectedProtocol);
    } catch (error) {
      showStatus(status, error.message || 'Não foi possível enviar a resposta.', 'error');
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('attachmentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.selectedProtocol) return;
    const file = document.getElementById('attachmentFile').files?.[0];
    if (!file) return;
    const button = document.getElementById('uploadAttachment');
    button.disabled = true;
    try {
      const form = new FormData();
      form.append('file', file);
      const path = citizenContextPath(`/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/attachments`);
      await auth.api(path, { method: 'POST', body: form });
      document.getElementById('attachmentFile').value = '';
      await openDetail(state.selectedProtocol);
    } catch (error) {
      alert(error.message || 'Não foi possível enviar o anexo.');
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('attachmentList').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-attachment]');
    if (!button || !state.selectedProtocol) return;
    button.disabled = true;
    try {
      const path = citizenContextPath(`/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/attachments/${encodeURIComponent(button.dataset.attachment)}`);
      const response = await fetch(`${endpoint}${path}`, {
        headers: auth.authorizationHeader(), cache: 'no-store'
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
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

  await loadSecurity();
  await Promise.all([loadManifestations(), loadNotifications()]);
})();