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
  const priorContactLabels = {
    nao: 'Não',
    sim_sem_resolucao: 'Sim, mas não foi resolvido',
    sim_parcial: 'Sim, houve solução parcial',
    nao_se_aplica: 'Não se aplica'
  };
  const privacyLabels = { anonima: 'Anônima', sigilosa: 'Sigilosa', identificada: 'Identificada' };
  const roleLabels = {
    medico: 'Médico', recepcao: 'Recepção', coordenacao: 'Coordenação', admin: 'Desenvolvedor', cidadao: 'Cidadão'
  };
  const isPrimaryCitizen = user.role === 'cidadao';
  const isPresident = user.councilRole === 'presidente';

  document.getElementById('portalUserName').textContent = user.name || user.username;
  const roleBase = roleLabels[user.role] || user.role || 'Usuário';
  const roleJob = !isPrimaryCitizen && user.jobTitle ? ` · ${user.jobTitle}` : '';
  const roleCouncil = user.councilRole ? ` · Conselho: ${user.councilRole === 'presidente' ? 'Presidente' : 'Membro'}` : '';
  document.getElementById('portalUserRole').textContent = `${roleBase}${roleJob}${roleCouncil}`;

  const professionalHomeLink = document.getElementById('professionalHomeLink');
  if (professionalHomeLink) professionalHomeLink.hidden = isPrimaryCitizen;

  const contextNotice = document.getElementById('citizenContextNotice');
  const createButton = document.getElementById('openNewManifestation');
  if (isPresident) {
    if (createButton) createButton.hidden = true;
    if (contextNotice) {
      contextNotice.innerHTML = '<strong>Presidência do Conselho.</strong> Enquanto esta conta estiver vinculada à Presidência, ela pode acompanhar protocolos próprios anteriores, mas não pode abrir nova manifestação.';
      contextNotice.hidden = false;
    }
  } else if (contextNotice && !isPrimaryCitizen) {
    const councilExtra = auth.hasCouncilAccess(user)
      ? ' As ações institucionais do Conselho permanecem disponíveis somente no painel institucional.'
      : '';
    contextNotice.innerHTML = `<strong>Uma conta, o mesmo perfil.</strong> Você continua identificado no portal pelo seu cargo profissional. O Canal do Cidadão é mais um módulo da mesma conta.${councilExtra} A privacidade é definida no momento de cada envio.`;
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

  function citizenContextPath(path) {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}as=citizen`;
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

  function showStatus(el, message, type = 'error') {
    if (!el) return;
    el.textContent = message;
    el.className = `account-status visible ${type}`;
  }

  function selectedPrivacyMode() {
    if (!state.security?.emailVerified) return 'anonima';
    return document.querySelector('input[name="manifestationPrivacy"]:checked')?.value === 'identificada'
      ? 'identificada'
      : 'sigilosa';
  }

  function privacyText() {
    return state.security?.emailVerified
      ? 'Privacidade à escolha · e-mail de segurança confirmado'
      : 'Anônima · e-mail de segurança ainda não verificado';
  }

  function renderPrivacyNotice() {
    const notice = document.getElementById('newPrivacyNotice');
    if (!notice) return;
    const mode = selectedPrivacyMode();
    if (mode === 'identificada') {
      notice.innerHTML = '<strong>Manifestação identificada.</strong> O Conselho verá seu nome de perfil, @ e cargo ou função quando houver. Seu e-mail de segurança continua protegido e não é exibido na manifestação.';
      return;
    }
    if (mode === 'sigilosa') {
      notice.innerHTML = '<strong>Manifestação sigilosa.</strong> Sua identidade de perfil não será exibida ao Conselho nesta manifestação. Seu e-mail de segurança permanece protegido.';
      return;
    }
    notice.innerHTML = '<strong>Manifestação anônima.</strong> Como o e-mail desta conta ainda não foi verificado, esta nova manifestação será registrada como anônima. O texto e os anexos ainda podem revelar sua identidade.';
  }

  async function loadSecurity() {
    state.security = await auth.getSecurity().catch(() => ({ emailVerified: user.emailVerified, privacyMode: user.privacyMode || 'anonima' }));
    const privacyChip = document.getElementById('privacyChip');
    const verifiedOptions = document.getElementById('verifiedPrivacyOptions');
    if (privacyChip) privacyChip.textContent = privacyText();
    if (verifiedOptions) verifiedOptions.hidden = !state.security?.emailVerified;
    if (state.security?.emailVerified) {
      const sigilosa = document.querySelector('input[name="manifestationPrivacy"][value="sigilosa"]');
      if (sigilosa && !document.querySelector('input[name="manifestationPrivacy"]:checked')) sigilosa.checked = true;
    }
    renderPrivacyNotice();
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
        notice.textContent = 'O Canal do Conselho está instalado, mas o armazenamento Firebase ainda não está disponível.';
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
      return `<div class="thread-message ${message.senderType === 'council' ? 'council' : ''}"><strong>${escapeHtml(label)} · ${escapeHtml(formatDate(message.createdAt))}</strong><p>${escapeHtml(message.body)}</p></div>`;
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

  function attachmentIcon() {
    return '<span class="attachment-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 12.5l6.7-6.7a3 3 0 0 1 4.3 4.2l-8.6 8.6a5 5 0 0 1-7.1-7.1l8-8"/></svg></span>';
  }

  function renderAttachments(items) {
    const list = document.getElementById('attachmentList');
    if (!items.length) {
      list.innerHTML = '<span style="color:#73889a;font-size:.84rem">Nenhum anexo.</span>';
      return;
    }
    list.innerHTML = items.map((item) => `<button class="attachment-link" type="button" data-attachment="${escapeHtml(item.id)}">${attachmentIcon()}${escapeHtml(item.displayName || 'Anexo')}</button>`).join('');
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
      const privacyChip = document.getElementById('detailPrivacy');
      privacyChip.textContent = privacyLabels[item.privacyMode] || item.privacyMode || 'Privacidade não informada';
      privacyChip.classList.toggle('identified', item.privacyMode === 'identificada');
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

  function buildDescription() {
    const main = document.getElementById('manifestationDescription').value.trim();
    const locationValue = document.getElementById('manifestationLocation').value.trim();
    const dateValue = document.getElementById('manifestationDate').value;
    const priorValue = document.getElementById('manifestationPriorContact').value;
    const desired = document.getElementById('manifestationDesiredOutcome').value.trim();
    const sections = [main];
    const context = [];
    if (dateValue) context.push(`Data do fato: ${dateValue.split('-').reverse().join('/')}`);
    if (locationValue) context.push(`Local específico: ${locationValue}`);
    if (priorValue) context.push(`Contato prévio com o serviço: ${priorContactLabels[priorValue] || priorValue}`);
    if (context.length) sections.push(`Informações complementares:\n${context.join('\n')}`);
    if (desired) sections.push(`O que espera do Conselho:\n${desired}`);
    return sections.filter(Boolean).join('\n\n');
  }

  function validateFiles(files) {
    const list = Array.from(files || []);
    if (list.length > 5) return 'Selecione no máximo 5 anexos.';
    for (const file of list) {
      if (file.type && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) return `O arquivo ${file.name} não está em formato JPG, PNG ou PDF.`;
      if (file.size > 5 * 1024 * 1024) return `O arquivo ${file.name} ultrapassa 5 MB.`;
    }
    return '';
  }

  async function uploadFiles(protocol, files) {
    let failed = 0;
    for (const file of Array.from(files || [])) {
      try {
        const form = new FormData();
        form.append('file', file);
        await auth.api(citizenContextPath(`/api/council/manifestations/${encodeURIComponent(protocol)}/attachments`), { method: 'POST', body: form });
      } catch (_) {
        failed += 1;
      }
    }
    return failed;
  }

  const descriptionInput = document.getElementById('manifestationDescription');
  const descriptionCounter = document.getElementById('descriptionCounter');
  descriptionInput?.addEventListener('input', () => { if (descriptionCounter) descriptionCounter.textContent = `${descriptionInput.value.length}/6500`; });

  const dateInput = document.getElementById('manifestationDate');
  if (dateInput) dateInput.max = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Campo_Grande' }).format(new Date());

  const manifestationFiles = document.getElementById('manifestationFiles');
  const manifestationFileList = document.getElementById('manifestationFileList');
  manifestationFiles?.addEventListener('change', () => {
    const files = Array.from(manifestationFiles.files || []);
    const error = validateFiles(files);
    if (error) {
      manifestationFiles.value = '';
      manifestationFileList.hidden = true;
      manifestationFileList.innerHTML = '';
      showStatus(document.getElementById('newManifestationStatus'), error, 'error');
      return;
    }
    manifestationFileList.hidden = files.length === 0;
    manifestationFileList.innerHTML = files.map((file) => `<div class="selected-file"><span>${escapeHtml(file.name)}</span><span>${(file.size / 1024 / 1024).toFixed(2)} MB</span></div>`).join('');
  });

  document.querySelectorAll('input[name="manifestationPrivacy"]').forEach((input) => input.addEventListener('change', renderPrivacyNotice));

  createButton?.addEventListener('click', () => { if (!isPresident) openModal('newManifestationModal'); });
  document.getElementById('focusManifestations').addEventListener('click', () => document.getElementById('manifestationsCard').scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('focusNotifications').addEventListener('click', () => document.getElementById('notificationsCard').scrollIntoView({ behavior: 'smooth' }));
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.closeModal)));
  document.querySelectorAll('.citizen-modal').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal.id); }));

  document.getElementById('newManifestationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const submittedForm = event.currentTarget;
    const button = document.getElementById('submitManifestation');
    const status = document.getElementById('newManifestationStatus');
    if (isPresident) return showStatus(status, 'A Presidência do Conselho não pode abrir nova manifestação.', 'error');
    const files = Array.from(manifestationFiles?.files || []);
    const fileError = validateFiles(files);
    if (fileError) return showStatus(status, fileError, 'error');
    const description = buildDescription();
    if (description.length > 8000) return showStatus(status, 'O conteúdo total ficou muito extenso. Reduza um pouco o relato ou o campo sobre o que espera do Conselho.', 'error');
    const selectedType = document.querySelector('input[name="manifestationType"]:checked')?.value || '';
    const privacyMode = selectedPrivacyMode();
    button.disabled = true;
    button.textContent = 'Enviando...';
    status.className = 'account-status';
    try {
      const payload = await auth.api('/api/council/manifestations', {
        method: 'POST',
        body: JSON.stringify({
          type: selectedType,
          service: document.getElementById('manifestationService').value,
          subject: document.getElementById('manifestationSubject').value,
          description,
          privacyMode
        })
      });
      const protocol = payload.manifestation.protocol;
      button.textContent = files.length ? 'Enviando anexos...' : 'Finalizando...';
      const failedUploads = files.length ? await uploadFiles(protocol, files) : 0;
      submittedForm.reset();
      if (state.security?.emailVerified) {
        const sigilosa = document.querySelector('input[name="manifestationPrivacy"][value="sigilosa"]');
        if (sigilosa) sigilosa.checked = true;
      }
      renderPrivacyNotice();
      if (descriptionCounter) descriptionCounter.textContent = '0/6500';
      if (manifestationFileList) { manifestationFileList.hidden = true; manifestationFileList.innerHTML = ''; }
      const attachmentMessage = failedUploads ? ` ${failedUploads} anexo(s) não puderam ser enviados e podem ser adicionados depois no protocolo.` : '';
      showStatus(status, `Manifestação enviada. Protocolo: ${protocol}.${attachmentMessage}`, failedUploads ? 'error' : 'success');
      await Promise.all([loadManifestations(), loadNotifications()]);
      window.setTimeout(() => { closeModal('newManifestationModal'); openDetail(protocol); }, failedUploads ? 1800 : 700);
    } catch (error) {
      let message = error.message || 'Não foi possível enviar.';
      if (error.status === 429 && error.retryAfterSeconds) message += ` Tente novamente em aproximadamente ${Math.ceil(error.retryAfterSeconds / 60)} minuto(s).`;
      if (error.code === 'COUNCIL_PRESIDENT_CANNOT_SUBMIT' && createButton) createButton.hidden = true;
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

  document.getElementById('refreshManifestations').addEventListener('click', loadManifestations);

  document.getElementById('replyForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.selectedProtocol) return;
    const button = document.getElementById('replyButton');
    const status = document.getElementById('replyStatus');
    button.disabled = true;
    try {
      await auth.api(citizenContextPath(`/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/messages`), {
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
    const fileError = validateFiles([file]);
    if (fileError) return window.alert(fileError);
    const button = document.getElementById('uploadAttachment');
    button.disabled = true;
    try {
      const form = new FormData();
      form.append('file', file);
      await auth.api(citizenContextPath(`/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/attachments`), { method: 'POST', body: form });
      document.getElementById('attachmentFile').value = '';
      await openDetail(state.selectedProtocol);
    } catch (error) {
      window.alert(error.message || 'Não foi possível enviar o anexo.');
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
      const response = await fetch(`${endpoint}${path}`, { headers: auth.authorizationHeader(), cache: 'no-store' });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Não foi possível abrir o anexo.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      window.alert(error.message || 'Não foi possível abrir o anexo.');
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