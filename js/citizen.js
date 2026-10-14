(() => {
'use strict';

// An already-rendered mobile shell can keep its previous dependency list.
// Resolve this controller's optional preview dependency independently of it.
let composeHelperPromise;
function ensureComposeHelper() {
  if (globalThis.PortalCitizenComposeAttachments?.create) return Promise.resolve(globalThis.PortalCitizenComposeAttachments);
  if (!composeHelperPromise) composeHelperPromise=new Promise((resolve,reject)=>{
    const script=globalThis.document.createElement('script');
    script.src='/js/citizen-compose-attachments.js?v=20261014-citizen-compose-5';
    const finish=error=>{clearTimeout(timer);script.onload=script.onerror=null;if(error){script.remove();reject(error);}else resolve(globalThis.PortalCitizenComposeAttachments);};
    const timer=setTimeout(()=>finish(new Error('Prévia local indisponível')),8000);
    script.onload=()=>finish(globalThis.PortalCitizenComposeAttachments?.create?null:new Error('Prévia local indisponível'));
    script.onerror=()=>finish(new Error('Prévia local indisponível'));
    globalThis.document.head.append(script);
  }).catch(error=>{composeHelperPromise=null;throw error;});
  return composeHelperPromise;
}

const initializeCitizenArea = async (context) => {
  const window = context?.window || globalThis;
  const document = context?.document || globalThis.document;
  const auth = window.RegulationAuth;
  const user = await auth.requireRole([], { deniedPath: '/' });
  if (!user) return;
  const hasPreviewMarkup=Boolean(document.getElementById('composeChooseFiles')&&document.getElementById('composeFilePreview'));
  const composeHelper=hasPreviewMarkup?await ensureComposeHelper().catch(()=>null):null;
  if(context?.disposed)return;
  const initialCompose=document.getElementById('newManifestationModal');
  initialCompose.dataset.composeRuntime='current';
  document.getElementById('manifestationFiles').hidden=Boolean(composeHelper);
  const initialPicker=document.getElementById('composeChooseFiles');if(initialPicker)initialPicker.hidden=!composeHelper;
  if(hasPreviewMarkup&&!composeHelper){const help=document.getElementById('composeFileHelp');if(help)help.textContent+=' As prévias não estão disponíveis agora.';}
  if(!document.getElementById('composeSubmitHint')){
    const hint=document.createElement('p');hint.id='composeSubmitHint';hint.className='compose-submit-hint';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');
    document.getElementById('newManifestationStatus').before(hint);
    document.getElementById('submitManifestation').setAttribute('aria-describedby','composeSubmitHint');
  }

  const endpoint = String((window.REGULATION_AUTH_CONFIG || {}).endpoint || '').replace(/\/$/, '');
  const state = { manifestations: [], notifications: [], security: null, selectedProtocol: '' };
  const statusLabels = {
    recebida: 'Recebida', em_analise: 'Em análise', aguardando_cidadao: 'Aguardando sua resposta',
    encaminhada: 'Encaminhada', aguardando_retorno: 'Aguardando retorno', respondida: 'Respondida',
    concluida: 'Concluída', arquivada: 'Arquivada'
  };
  const typeLabels = { sugestao: 'Sugestão', reclamacao: 'Reclamação', elogio: 'Elogio', denuncia: 'Denúncia' };
  const privacyLabels = { anonima: 'Anônima', sigilosa: 'Sigilosa', identificada: 'Identificada' };
  const roleLabels = {
    medico: 'Médico(a)', recepcao: 'Recepção', coordenacao: 'Coordenação', admin: 'Desenvolvedor', cidadao: 'Cidadão'
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
    if(id==='newManifestationModal' && !modal.classList.contains('open'))composeOpener=document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if(id==='newManifestationModal'){modal.setAttribute('aria-modal','true');syncCompose();modal.querySelector('.citizen-modal-close')?.focus({preventScroll:true});}
    if(id==='manifestationDetailModal')focusDetailDialog();
  }

  function closeModal(id, {restoreFocus = true} = {}) {
    if(id==='composeFilePreview')return composeAttachmentManager?.closePreview({restoreFocus});
    const modal = document.getElementById(id);
    if (!modal || (id==='newManifestationModal' && sendingManifestation)) return;
    if(id==='newManifestationModal')composeAttachmentManager?.closePreview({restoreFocus:false});
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if(id==='newManifestationModal'){modal.setAttribute('aria-modal','false');if(restoreFocus&&composeOpener?.isConnected)composeOpener.focus({preventScroll:true});}
  }

  function showStatus(el, message, type = 'error') {
    if (!el) return;
    el.textContent = message;
    el.className = `account-status visible ${type}`;
    if (el.id === 'newManifestationStatus' && document.getElementById('newManifestationModal')?.classList.contains('open')) {
      requestAnimationFrame(() => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    }
  }

  function selectedPrivacyMode() {
    const requested = document.querySelector('input[name="manifestationPrivacy"]:checked')?.value || '';
    if (requested === 'identificada') return 'identificada';
    return state.security?.emailVerified === true ? 'sigilosa' : 'anonima';
  }

  function privacyText() {
    return state.security?.emailVerified
      ? 'Privacidade à escolha · e-mail de segurança confirmado'
      : 'Privacidade à escolha · identificação opcional';
  }

  function renderPrivacyNotice() {
    const notice = document.getElementById('newPrivacyNotice');
    if (!notice) return;
    const mode = selectedPrivacyMode();
    if (mode === 'identificada') {
      notice.innerHTML = '<strong>Você será identificado ao Conselho.</strong> Seu nome, @ e cargo aparecem, se houver. Seu e-mail permanece protegido.';
      return;
    }
    if (mode === 'sigilosa') {
      notice.innerHTML = '<strong>Envio sigiloso.</strong> Seu nome e perfil não aparecem ao Conselho. O protocolo fica nesta conta; seu e-mail permanece protegido.';
      return;
    }
    notice.innerHTML = '<strong>Envio anônimo.</strong> Seu nome, @ e perfil não aparecem ao Conselho. Você acompanha o protocolo nesta conta; seu e-mail permanece protegido.';
  }

  async function loadSecurity() {
    state.security = await auth.getSecurity().catch(() => ({ emailVerified: user.emailVerified, privacyMode: user.privacyMode || 'anonima' }));
    const privacyChip = document.getElementById('privacyChip');
    const verifiedOptions = document.getElementById('verifiedPrivacyOptions');
    const verified = state.security?.emailVerified === true;
    if (privacyChip) privacyChip.textContent = privacyText();
    if (verifiedOptions) verifiedOptions.hidden = false;

    const identifiedInput = document.querySelector('input[name="manifestationPrivacy"][value="identificada"]');
    if (identifiedInput) {
      identifiedInput.disabled = false;
      identifiedInput.closest('.privacy-option')?.setAttribute('aria-disabled', 'false');
    }

    const protectedInput = document.querySelector('input[name="manifestationPrivacy"][value="sigilosa"], input[name="manifestationPrivacy"][value="anonima"]');
    const protectedOption = protectedInput?.closest('.privacy-option');
    const protectedTitle = protectedOption?.querySelector('strong');
    const protectedDescription = protectedOption?.querySelector('small');

    if (protectedInput) {
      if (state.security?.emailVerified) {
        protectedInput.value = 'sigilosa';
        if (protectedTitle) protectedTitle.textContent = 'Enviar com sigilo';
        if (protectedDescription) protectedDescription.textContent = 'O Conselho recebe o relato, mas seu nome, @ e perfil não são exibidos na manifestação.';
      } else {
        protectedInput.value = 'anonima';
        if (protectedTitle) protectedTitle.textContent = 'Enviar anonimamente';
        if (protectedDescription) protectedDescription.textContent = 'O Conselho recebe o relato, mas seu nome, @ e perfil não são exibidos. Você pode optar por se identificar ao lado.';
      }
      if (!document.querySelector('input[name="manifestationPrivacy"]:checked')) protectedInput.checked = true;
    }

    const choiceHead = verifiedOptions?.querySelector('.privacy-choice-head span');
    if (choiceHead) {
      choiceHead.textContent = verified
        ? 'Escolha se prefere manter sua identidade protegida ou se identificar para o Conselho.'
        : 'Escolha se prefere enviar anonimamente ou se identificar usando os dados do seu perfil no portal.';
    }

    renderPrivacyNotice();
  }

  function renderManifestations() {
    const list = document.getElementById('manifestationList');
    if (!state.manifestations.length) {
      list.innerHTML = '<div class="empty-state"><strong>Nenhuma manifestação ainda.</strong><br>Quando você enviar a primeira, ela aparecerá aqui.</div>';
      return;
    }
    list.innerHTML = state.manifestations.map((item) => `<button class="manifestation-item" type="button" data-protocol="${escapeHtml(item.protocol)}" data-manifestation-type="${escapeHtml(item.type)}">
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
    const desired = document.getElementById('manifestationDesiredOutcome').value.trim();
    const sections = [main];
    const context = [];
    if (dateValue) context.push(`${composeKinds[document.querySelector('input[name=manifestationType]:checked')?.value]?.[3] || 'Data do fato'}: ${dateValue.split('-').reverse().join('/')}`);
    if (locationValue) context.push(`Local específico: ${locationValue}`);
    if (context.length) sections.push(`Informações complementares:\n${context.join('\n')}`);
    if (desired) sections.push(`O que espera do Conselho:\n${desired}`);
    return sections.filter(Boolean).join('\n\n');
  }

  function validateFiles(files) {
    const list = Array.from(files || []);
    if (list.length > 5) return 'Selecione no máximo 5 anexos.';
    for (const file of list) {
      if (file.type && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) return `O arquivo ${file.name} não está em formato JPG, PNG ou PDF.`;
      if (!file.type && !/\.(jpe?g|png|pdf)$/i.test(file.name)) return `O arquivo ${file.name} não está em formato JPG, PNG ou PDF.`;
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

  const composeForm = document.getElementById('newManifestationForm');
  const composeModal = document.getElementById('newManifestationModal');
  const composeDetails = document.getElementById('composeDetails');
  const detailModal = document.getElementById('manifestationDetailModal');
  const previewModal = document.getElementById('composeFilePreview');
  let composeAttachmentManager = null;
  let detailFocusFrame = 0;
  function focusDetailDialog(attempts = 12) {
    if (!detailModal?.isConnected || !detailModal.classList.contains('open')) return;
    const close = detailModal.querySelector('.citizen-modal-close');
    if (close && getComputedStyle(close).visibility==='visible') close.focus({preventScroll:true});
    if (!detailModal.contains(document.activeElement) && attempts>0) detailFocusFrame=globalThis.requestAnimationFrame(()=>focusDetailDialog(attempts-1));
  }
  context?.addController?.({dispose:()=>globalThis.cancelAnimationFrame(detailFocusFrame)});
  const composeKinds = {
    sugestao: ['Conte sua sugestão','Qual melhoria você propõe e como ela pode ajudar?','Escreva a melhoria que você gostaria de propor.','Data de referência'],
    reclamacao: ['Conte o que aconteceu','Descreva o problema, o atendimento ou o serviço e como isso afetou você.','Explique o problema e o que aconteceu.','Data do fato'],
    elogio: ['Conte o que foi positivo','Qual atendimento, equipe ou serviço você gostaria de reconhecer?','Conte o que foi bem e por que você quer agradecer.','Data do atendimento'],
    denuncia: ['Relate a possível irregularidade','Descreva os fatos que conhece e o que precisa ser apurado. Evite dados pessoais desnecessários.','Conte os fatos e o que você sabe sobre a situação.','Data do fato']
  };
  const detailIds = ['manifestationDate','manifestationService','manifestationLocation','manifestationDesiredOutcome'];
  let currentComposeKind = '', sendingManifestation = false, composeOpener = null;
  function resizeComposeReport() {
    const input = document.getElementById('manifestationDescription');
    if (!input || document.getElementById('composeReport')?.hidden) return;
    input.style.height = 'auto';
    input.style.height = Math.max(150,input.scrollHeight + 2) + 'px';
  }
  function fitComposeActions() {
    if (!composeModal?.classList.contains('open')) return;
    const panel = composeModal.querySelector('.citizen-modal-panel');
    const head = composeModal.querySelector('.citizen-modal-head');
    const footer = composeModal.querySelector('.manifestation-form-footer');
    const remaining = panel.clientHeight - head.offsetHeight - footer.offsetHeight;
    const inline = remaining < 120;
    composeModal.toggleAttribute('data-compose-inline-actions', inline);
    composeForm.style.scrollPaddingBottom = `${inline ? 12 : footer.offsetHeight + 12}px`;
  }
  if (globalThis.ResizeObserver) {
    const observer = new globalThis.ResizeObserver(fitComposeActions);
    for (const node of [composeModal.querySelector('.citizen-modal-panel'),composeModal.querySelector('.citizen-modal-head'),composeModal.querySelector('.manifestation-form-footer')]) observer.observe(node);
    context?.addController?.({ dispose: () => observer.disconnect() });
  }
  function syncCompose(change = false) {
    if (!composeModal?.hasAttribute('data-compose-refinement')) return;
    const kind = document.querySelector('input[name=manifestationType]:checked')?.value || '';
    const config = composeKinds[kind];
    const report = document.getElementById('composeReport');
    if (report) report.hidden = !config;
    composeForm.querySelectorAll('[data-compose-followup]').forEach(node=>{node.hidden=!config;});
    if (!sendingManifestation) {
      for (const id of ['manifestationSubject', 'manifestationDescription']) document.getElementById(id).disabled = !config;
      document.getElementById('manifestationConfirm').disabled = !config;
      const picker=document.getElementById('composeChooseFiles');if(picker)picker.disabled=!config;
    }
    if (config) {
      document.getElementById('composeReportTitle').textContent = config[0];
      document.getElementById('composeGuidance').textContent = config[1];
      document.getElementById('manifestationDescription').placeholder = config[2];
      document.getElementById('composeDateLabel').firstChild.textContent = config[3] + ' ';
    }
    const count = detailIds.filter(id => document.getElementById(id)?.value.trim()).length;
    document.getElementById('composeDetailsCount').textContent = count ? `${count} detalhe(s) incluído(s)` : '4 campos opcionais';
    const hasDraft = document.getElementById('manifestationDescription')?.value.trim() || document.getElementById('manifestationSubject')?.value.trim() || count;
    if (change && currentComposeKind && kind !== currentComposeKind && hasDraft) document.getElementById('composeDraftNotice').textContent = 'Categoria alterada. Seu rascunho foi mantido; revise o relato e os detalhes.';
    currentComposeKind = kind;
    updateComposeReadiness(config);
    composeAttachmentManager?.sync();
    fitComposeActions();
    requestAnimationFrame(() => {resizeComposeReport();fitComposeActions();});
  }
  function updateComposeReadiness(config) {
    const subject=document.getElementById('manifestationSubject'),description=document.getElementById('manifestationDescription');
    const date=document.getElementById('manifestationDate'),confirm=document.getElementById('manifestationConfirm');
    const files=composeAttachmentManager?.getFiles() || Array.from(document.getElementById('manifestationFiles')?.files || []);
    let message='';
    if(!config)message='Escolha o tipo de mensagem para continuar.';
    else if(subject.value.trim().length<3||!subject.validity.valid)message='Preencha o assunto com pelo menos 3 caracteres.';
    else if(description.value.trim().length<10||!description.validity.valid)message='Escreva seu relato com pelo menos 10 caracteres.';
    else if(!date.validity.valid)message='Corrija a data em Adicionar detalhes.';
    else if(buildDescription().length>8000)message='Reduza o relato ou a expectativa: o total passou de 8.000 caracteres.';
    else if(validateFiles(files))message=validateFiles(files);
    else if(!confirm.checked)message='Revise as informações e marque a confirmação para enviar.';
    document.getElementById('submitManifestation').disabled=sendingManifestation||isPresident||Boolean(message);
    const hint=document.getElementById('composeSubmitHint');if(hint.textContent!==message)hint.textContent=message;
  }
  composeForm?.addEventListener('change', event => syncCompose(event.target.name === 'manifestationType'));
  composeForm?.addEventListener('input', event => {if(event.target.name !== 'manifestationType')syncCompose();});
  composeForm?.addEventListener('reset', () => queueMicrotask(() => {currentComposeKind='';if(composeDetails)composeDetails.open=false;const attachments=document.getElementById('composeAttachments');if(attachments)attachments.open=false;composeAttachmentManager?.clear();document.getElementById('composeDraftNotice').textContent='';syncCompose();}));
  composeForm?.addEventListener('invalid', event => {if(composeDetails?.contains(event.target))composeDetails.open=true;},true);
  function containDialogKeyboard(event, modal = event.currentTarget) {
    if (event.defaultPrevented || !modal?.classList.contains('open')) return;
    if (event.key === 'Escape' && !(modal===composeModal && sendingManifestation)) {event.preventDefault();closeModal(modal.id);return;}
    if (event.key !== 'Tab') return;
    const nodes=[...modal.querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(node=>!node.disabled && node.tabIndex>=0 && node.getClientRects().length && getComputedStyle(node).visibility==='visible');
    const first=nodes[0],last=nodes.at(-1);
    if(!modal.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first)?.focus({preventScroll:true});return;}
    if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
  composeModal?.addEventListener('keydown',containDialogKeyboard);
  detailModal?.addEventListener('keydown',containDialogKeyboard);
  document.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const modal=previewModal?.classList.contains('open')?previewModal:detailModal?.classList.contains('open')?detailModal:composeModal;
    if(modal?.classList.contains('open')&&!modal.contains(document.activeElement))containDialogKeyboard(event,modal);
  },true);
  const composeViewport = window.visualViewport;
  composeViewport?.addEventListener('resize',resizeComposeReport);
  context?.addController?.({dispose:()=>composeViewport?.removeEventListener('resize',resizeComposeReport)});
  syncCompose();

  const descriptionInput = document.getElementById('manifestationDescription');
  const descriptionCounter = document.getElementById('descriptionCounter');
  descriptionInput?.addEventListener('input', () => { if (descriptionCounter) descriptionCounter.textContent = `${descriptionInput.value.length}/6500`; });

  const dateInput = document.getElementById('manifestationDate');
  if (dateInput) dateInput.max = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Campo_Grande' }).format(new Date());

  const manifestationFiles = document.getElementById('manifestationFiles');
  const manifestationFileList = document.getElementById('manifestationFileList');
  let composeFileError='';
  const attachmentOptions={
    input:manifestationFiles,list:manifestationFileList,picker:document.getElementById('composeChooseFiles'),
    disclosure:document.getElementById('composeAttachments'),count:document.getElementById('composeAttachmentCount'),
    preview:previewModal,compose:composeModal,validate:validateFiles,isBusy:()=>sendingManifestation,
    onChange:({validated=false}={})=>{if(validated&&composeFileError){const status=document.getElementById('newManifestationStatus');if(status.textContent===composeFileError){status.textContent='';status.className='account-status';}composeFileError='';}syncCompose();},
    onError:message=>{composeFileError=message;showStatus(document.getElementById('newManifestationStatus'),message,'error');}
  };
  // Old cached HTML or an unavailable preview script retains the native picker
  // and the same validated upload source. A reload is never required to send.
  function nativeAttachments({input,list,count,onChange,onError,validate,isBusy}) {
    let files=Array.from(input.files||[]);
    function render(){list.replaceChildren();for(const file of files){const row=document.createElement('div');row.className='selected-file';row.textContent=`${file.name} · ${Math.ceil(file.size/1024)} KB`;list.append(row);}list.hidden=!files.length;if(count)count.textContent=files.length?`${files.length} arquivo(s)`:'opcional';}
    function restore(){try{const transfer=new DataTransfer();files.forEach(file=>transfer.items.add(file));input.files=transfer.files;}catch(_){input.value='';}}
    function changed(){if(isBusy()){restore();return;}const selected=Array.from(input.files||[]),error=validate(selected);if(error){restore();onError(error+(files.length?' Os anexos anteriores foram mantidos.':''));onChange();return;}files=selected;render();onChange({validated:true});}
    function clear(){files=[];input.value='';render();}
    function hidden(event){if(!event.persisted)clear();}
    input.addEventListener('change',changed);globalThis.addEventListener('pagehide',hidden);render();
    return {getFiles:()=>[...files],sync:()=>{},clear,closePreview:()=>{},dispose(){clear();input.removeEventListener('change',changed);globalThis.removeEventListener('pagehide',hidden);}};
  }
  composeAttachmentManager=composeHelper?composeHelper.create(attachmentOptions):nativeAttachments(attachmentOptions);
  context?.addController?.({dispose:()=>composeAttachmentManager.dispose()});

  document.querySelectorAll('input[name="manifestationPrivacy"]').forEach((input) => input.addEventListener('change', renderPrivacyNotice));

  createButton?.addEventListener('click', () => { if (!isPresident) openModal('newManifestationModal'); });
  document.getElementById('focusManifestations').addEventListener('click', () => document.getElementById('manifestationsCard').scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('focusNotifications').addEventListener('click', () => document.getElementById('notificationsCard').scrollIntoView({ behavior: 'smooth' }));
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.closeModal)));
  document.querySelectorAll('.citizen-modal').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal.id); }));

  document.getElementById('newManifestationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const submittedForm = event.currentTarget;
    if (sendingManifestation) return;
    if (previewModal?.classList.contains('open')) return;
    syncCompose();
    const button = document.getElementById('submitManifestation');
    const status = document.getElementById('newManifestationStatus');
    if (isPresident) return showStatus(status, 'A Presidência do Conselho não pode abrir nova manifestação.', 'error');
    if (!submittedForm.reportValidity()) return;
    if(document.getElementById('manifestationSubject').value.trim().length<3 || document.getElementById('manifestationDescription').value.trim().length<10)return showStatus(status,document.getElementById('composeSubmitHint').textContent,'error');
    const files = composeAttachmentManager.getFiles();
    const fileError = validateFiles(files);
    if (fileError) return showStatus(status, fileError, 'error');
    const description = buildDescription();
    if (description.length > 8000) return showStatus(status, 'O conteúdo total ficou muito extenso. Reduza um pouco o relato ou o campo sobre o que espera do Conselho.', 'error');
    const selectedType = document.querySelector('input[name="manifestationType"]:checked')?.value || '';
    const privacyMode = selectedPrivacyMode();
    sendingManifestation = true;
    composeForm.setAttribute('aria-busy','true');
    composeForm.querySelectorAll('input,textarea,select,button,summary').forEach(node=>{node.dataset.composeWasDisabled=String(Boolean(node.disabled));if('disabled' in node)node.disabled=true;});
    composeModal.querySelector('.citizen-modal-close').disabled=true;
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
      const protectedMode = document.querySelector(`input[name="manifestationPrivacy"][value="${state.security?.emailVerified ? 'sigilosa' : 'anonima'}"]`);
      if (protectedMode) protectedMode.checked = true;
      renderPrivacyNotice();
      if (descriptionCounter) descriptionCounter.textContent = '0/6500';
      if (manifestationFileList) { manifestationFileList.hidden = true; manifestationFileList.innerHTML = ''; }
      composeAttachmentManager.clear();
      const attachmentMessage = failedUploads ? ` ${failedUploads} anexo(s) não puderam ser enviados e podem ser adicionados depois no protocolo.` : '';
      showStatus(status, `Manifestação enviada. Protocolo: ${protocol}.${attachmentMessage}`, failedUploads ? 'error' : 'success');
      await Promise.all([loadManifestations(), loadNotifications()]);
      window.setTimeout(() => { closeModal('newManifestationModal',{restoreFocus:false}); openDetail(protocol); }, failedUploads ? 1800 : 700);
    } catch (error) {
      let message = error.message || 'Não foi possível enviar.';
      if (error.status === 429 && error.retryAfterSeconds) message += ` Tente novamente em aproximadamente ${Math.ceil(error.retryAfterSeconds / 60)} minuto(s).`;
      if (error.code === 'COUNCIL_PRESIDENT_CANNOT_SUBMIT' && createButton) createButton.hidden = true;
      showStatus(status, message, 'error');
    } finally {
      sendingManifestation=false;
      composeForm.removeAttribute('aria-busy');
      composeForm.querySelectorAll('[data-compose-was-disabled]').forEach(node=>{if('disabled' in node)node.disabled=node.dataset.composeWasDisabled==='true';delete node.dataset.composeWasDisabled;});
      composeModal.querySelector('.citizen-modal-close').disabled=false;
      button.disabled = false;
      button.textContent = 'Enviar manifestação';
      syncCompose();
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

  if (!context) document.getElementById('portalLogout').addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  if (globalThis.matchMedia('screen and (max-width: 900px)').matches) {
    // Lists need authenticated access, already checked above, not the privacy
    // lookup. Keep every read fresh while removing one sequential network wait.
    await Promise.all([loadSecurity(), loadManifestations(), loadNotifications()]);
  } else {
    await loadSecurity();
    await Promise.all([loadManifestations(), loadNotifications()]);
  }
};
if (window.PortalCitizenShell) window.PortalCitizenShell.register('citizen', initializeCitizenArea);
else initializeCitizenArea();
})();
