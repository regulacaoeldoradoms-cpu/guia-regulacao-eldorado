/* Canal do Cidadão — recursos de interface compartilhados e navegação mobile. */
(() => {
  const setupPrivacyCompactHelp = () => {
    const privacyNotice = document.getElementById('newPrivacyNotice');
    if (!privacyNotice || document.getElementById('privacyCompactHelp')) return;

    const warningNotice = privacyNotice.nextElementSibling;
    const channelNotice = warningNotice?.nextElementSibling;
    if (!warningNotice?.classList.contains('form-alert') || !channelNotice?.classList.contains('form-alert')) return;

    const shell = document.createElement('div');
    shell.className = 'privacy-compact-help';
    shell.id = 'privacyCompactHelp';
    shell.innerHTML = `
      <div class="privacy-help-actions" role="group" aria-label="Informações importantes sobre o envio">
        <button type="button" class="privacy-help-button" data-help="privacy" aria-expanded="false" aria-controls="privacyHelpPrivacy">
          <span class="privacy-help-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>
          <span>Privacidade</span>
        </button>
        <button type="button" class="privacy-help-button" data-help="warning" aria-expanded="false" aria-controls="privacyHelpWarning">
          <span class="privacy-help-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 2.5 20h19L12 3z"/><path d="M12 9v5M12 17h.01"/></svg></span>
          <span>Atenção</span>
        </button>
        <button type="button" class="privacy-help-button" data-help="channel" aria-expanded="false" aria-controls="privacyHelpChannel">
          <span class="privacy-help-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></span>
          <span>Canal</span>
        </button>
      </div>
      <div class="privacy-help-panels" aria-live="polite">
        <div class="privacy-help-panel" id="privacyHelpPrivacy" hidden></div>
        <div class="privacy-help-panel" id="privacyHelpWarning" hidden></div>
        <div class="privacy-help-panel" id="privacyHelpChannel" hidden></div>
      </div>`;

    privacyNotice.parentNode.insertBefore(shell, privacyNotice);
    shell.querySelector('#privacyHelpPrivacy').appendChild(privacyNotice);
    shell.querySelector('#privacyHelpWarning').appendChild(warningNotice);
    shell.querySelector('#privacyHelpChannel').appendChild(channelNotice);

    const buttons = Array.from(shell.querySelectorAll('.privacy-help-button'));
    const panels = Array.from(shell.querySelectorAll('.privacy-help-panel'));

    const closeAll = () => {
      buttons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
      panels.forEach((panel) => { panel.hidden = true; });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const wasOpen = button.getAttribute('aria-expanded') === 'true';
        const target = document.getElementById(button.getAttribute('aria-controls'));
        closeAll();
        if (wasOpen || !target) return;
        button.setAttribute('aria-expanded', 'true');
        target.hidden = false;
      });
    });
  };

  /* Este acordeão faz parte do formulário em qualquer tamanho de tela. */
  setupPrivacyCompactHelp();

  /* A partir daqui, somente a navegação tipo aplicativo é exclusiva do mobile. */
  if (!document.body.classList.contains('mobile-citizen-mode')) return;

  const setupDetailAttachmentMobile = () => {
    const form = document.getElementById('attachmentForm');
    const pickerInput = document.getElementById('attachmentFile');
    const uploadButton = document.getElementById('uploadAttachment');
    const attachmentList = document.getElementById('attachmentList');
    if (!form || !pickerInput || !uploadButton || !attachmentList || form.dataset.mobileAttachmentReady === 'true') return;

    form.dataset.mobileAttachmentReady = 'true';
    pickerInput.classList.add('detail-attachment-native-input');
    pickerInput.hidden = true;
    pickerInput.tabIndex = -1;

    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.id = 'attachmentCamera';
    cameraInput.accept = 'image/jpeg,image/png';
    cameraInput.setAttribute('capture', 'environment');
    cameraInput.className = 'detail-attachment-native-input';
    cameraInput.hidden = true;
    cameraInput.tabIndex = -1;

    const sourceActions = document.createElement('div');
    sourceActions.className = 'detail-attachment-source-actions';
    sourceActions.setAttribute('role', 'group');
    sourceActions.setAttribute('aria-label', 'Escolha como adicionar o anexo');
    sourceActions.innerHTML = `
      <button class="detail-attachment-source-button detail-attachment-source-button--camera" id="takeAttachmentPhoto" type="button">
        <span class="detail-attachment-source-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 7.5h3l1.4-2h7.2l1.4 2h3a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="4"/></svg>
        </span>
        <span><strong>Tirar foto</strong><small>Usar a câmera agora</small></span>
      </button>
      <button class="detail-attachment-source-button detail-attachment-source-button--device" id="chooseAttachmentFile" type="button">
        <span class="detail-attachment-source-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M3 6.5h7l2 2h9v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 9h18"/></svg>
        </span>
        <span><strong>Escolher do dispositivo</strong><small>Foto, imagem ou PDF</small></span>
      </button>`;

    const selection = document.createElement('div');
    selection.className = 'detail-attachment-selection';
    selection.id = 'detailAttachmentSelection';
    selection.hidden = true;

    const status = document.createElement('div');
    status.className = 'account-status detail-attachment-status';
    status.id = 'detailAttachmentStatus';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    form.insertBefore(cameraInput, pickerInput);
    form.insertBefore(sourceActions, pickerInput);
    form.insertBefore(selection, uploadButton);
    uploadButton.insertAdjacentElement('afterend', status);

    uploadButton.textContent = 'Enviar anexo';
    uploadButton.hidden = true;
    uploadButton.disabled = true;

    let selectedFile = null;

    const showStatus = (message, type = 'error') => {
      status.textContent = message;
      status.className = `account-status detail-attachment-status visible ${type}`;
    };

    const clearStatus = () => {
      status.textContent = '';
      status.className = 'account-status detail-attachment-status';
    };

    const validateFile = (file) => {
      if (!file) return 'Escolha um arquivo ou tire uma foto primeiro.';
      if (file.type && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) return 'Use uma imagem JPG/PNG ou um arquivo PDF.';
      if (file.size > 5 * 1024 * 1024) return 'O arquivo ultrapassa o limite de 5 MB.';
      return '';
    };

    const resetSelection = () => {
      selectedFile = null;
      pickerInput.value = '';
      cameraInput.value = '';
      selection.hidden = true;
      selection.innerHTML = '';
      uploadButton.hidden = true;
      uploadButton.disabled = true;
    };

    const selectFile = (file, sourceLabel) => {
      clearStatus();
      const error = validateFile(file);
      if (error) {
        resetSelection();
        showStatus(error, 'error');
        return;
      }
      selectedFile = file;
      const sizeMb = (file.size / 1024 / 1024).toFixed(2);
      selection.innerHTML = `
        <div class="detail-attachment-selection-copy">
          <span class="detail-attachment-selection-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 12.5l6.7-6.7a3 3 0 0 1 4.3 4.2l-8.6 8.6a5 5 0 0 1-7.1-7.1l8-8"/></svg></span>
          <span><strong>${String(file.name || 'Arquivo selecionado').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}</strong><small>${sourceLabel} · ${sizeMb} MB</small></span>
        </div>
        <button type="button" class="detail-attachment-remove" id="removeSelectedAttachment">Remover</button>`;
      selection.hidden = false;
      uploadButton.hidden = false;
      uploadButton.disabled = false;
      selection.querySelector('#removeSelectedAttachment')?.addEventListener('click', resetSelection, { once: true });
    };

    sourceActions.querySelector('#takeAttachmentPhoto')?.addEventListener('click', () => {
      clearStatus();
      cameraInput.value = '';
      cameraInput.click();
    });

    sourceActions.querySelector('#chooseAttachmentFile')?.addEventListener('click', () => {
      clearStatus();
      pickerInput.value = '';
      pickerInput.click();
    });

    cameraInput.addEventListener('change', () => selectFile(cameraInput.files?.[0], 'Foto tirada agora'));
    pickerInput.addEventListener('change', () => selectFile(pickerInput.files?.[0], 'Arquivo do dispositivo'));

    const attachmentIcon = () => '<span class="attachment-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 12.5l6.7-6.7a3 3 0 0 1 4.3 4.2l-8.6 8.6a5 5 0 0 1-7.1-7.1l8-8"/></svg></span>';
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

    const renderAttachments = (items) => {
      if (!Array.isArray(items) || !items.length) {
        attachmentList.innerHTML = '<span style="color:#73889a">Nenhum anexo.</span>';
        return;
      }
      attachmentList.innerHTML = items.map((item) => `<button class="attachment-link" type="button" data-attachment="${escapeHtml(item.id)}">${attachmentIcon()}${escapeHtml(item.displayName || 'Anexo')}</button>`).join('');
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      clearStatus();

      const protocol = String(document.getElementById('detailProtocol')?.textContent || '').trim();
      if (!protocol || protocol === 'Manifestação') return showStatus('Não foi possível identificar o protocolo desta manifestação.', 'error');
      if (!selectedFile) return showStatus('Escolha um arquivo ou tire uma foto primeiro.', 'error');
      if (attachmentList.querySelectorAll('[data-attachment]').length >= 5) return showStatus('Esta manifestação já possui o máximo de 5 anexos.', 'error');

      const fileError = validateFile(selectedFile);
      if (fileError) return showStatus(fileError, 'error');

      const auth = window.RegulationAuth;
      if (!auth?.api) return showStatus('Não foi possível acessar o serviço de anexos.', 'error');

      uploadButton.disabled = true;
      uploadButton.textContent = 'Enviando anexo...';
      try {
        const payload = new FormData();
        payload.append('file', selectedFile);
        await auth.api(`/api/council/manifestations/${encodeURIComponent(protocol)}/attachments?as=citizen`, { method: 'POST', body: payload });

        const detail = await auth.api(`/api/council/manifestations/${encodeURIComponent(protocol)}?as=citizen`, { method: 'GET' });
        renderAttachments(detail?.attachments || []);
        resetSelection();
        showStatus('Anexo enviado com sucesso.', 'success');
      } catch (error) {
        showStatus(error?.message || 'Não foi possível enviar o anexo.', 'error');
        uploadButton.disabled = false;
      } finally {
        uploadButton.textContent = 'Enviar anexo';
        if (selectedFile) uploadButton.disabled = false;
      }
    }, true);
  };

  setupDetailAttachmentMobile();

  const waitForCitizen = () => {
    const role = document.getElementById('portalUserRole');
    const homeLink = document.getElementById('professionalHomeLink');
    const manifestationsCard = document.getElementById('manifestationsCard');
    const notificationsCard = document.getElementById('notificationsCard');
    const grid = document.querySelector('.citizen-grid');
    const notificationList = document.getElementById('notificationList');
    const manifestationList = document.getElementById('manifestationList');
    const privacyChip = document.getElementById('privacyChip');
    const heroTitle = document.querySelector('.portal-hero h2');
    const heroText = document.querySelector('.portal-hero-copy p');

    if (!role || !manifestationsCard || !notificationsCard || !grid || !notificationList || !manifestationList) {
      requestAnimationFrame(waitForCitizen);
      return;
    }
    if (!role.textContent || /Carregando/i.test(role.textContent)) {
      setTimeout(waitForCitizen, 50);
      return;
    }

    const isPrimaryCitizen = /^Cidadão(?:\b|\s|·)/i.test(role.textContent.trim()) && (!homeLink || homeLink.hidden);
    document.body.classList.add('citizen-mobile-app');
    if (isPrimaryCitizen) document.body.classList.add('citizen-primary-mobile');
    document.body.dataset.citizenTab = 'manifestations';

    if (isPrimaryCitizen) {
      const eyebrow = document.querySelector('.portal-eyebrow');
      if (eyebrow) eyebrow.textContent = 'Canal do Cidadão';
      if (heroTitle) heroTitle.textContent = 'Acompanhe suas manifestações.';
      if (heroText) heroText.textContent = 'Envie sugestões, reclamações, elogios ou denúncias e acompanhe as respostas do Conselho por aqui.';
    }

    if (homeLink) homeLink.textContent = 'Portal';

    const nav = document.createElement('nav');
    nav.className = 'citizen-mobile-tabs';
    nav.setAttribute('aria-label', 'Áreas do Canal do Cidadão');
    nav.innerHTML = `
      <button type="button" class="citizen-mobile-tab" data-tab="manifestations" aria-selected="true">
        <span>Manifestações</span><b class="citizen-mobile-tab-count" data-count="manifestations">0</b>
      </button>
      <button type="button" class="citizen-mobile-tab" data-tab="notifications" aria-selected="false">
        <span>Notificações</span><b class="citizen-mobile-tab-count" data-count="notifications">0</b>
      </button>`;
    grid.parentNode.insertBefore(nav, grid);

    const tabButtons = Array.from(nav.querySelectorAll('.citizen-mobile-tab'));
    const selectTab = (tab) => {
      document.body.dataset.citizenTab = tab;
      tabButtons.forEach((button) => button.setAttribute('aria-selected', String(button.dataset.tab === tab)));
      const target = tab === 'notifications' ? notificationsCard : manifestationsCard;
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    tabButtons.forEach((button) => button.addEventListener('click', () => selectTab(button.dataset.tab)));

    const updateCounts = () => {
      const manifestationCount = manifestationList.querySelectorAll('.manifestation-item').length;
      const notificationItems = notificationList.querySelectorAll('.notification');
      const notificationCount = notificationItems.length;
      const unreadCount = notificationList.querySelectorAll('.notification.unread').length;

      const manifestationBadge = nav.querySelector('[data-count="manifestations"]');
      const notificationBadge = nav.querySelector('[data-count="notifications"]');
      if (manifestationBadge) manifestationBadge.textContent = String(manifestationCount);
      if (notificationBadge) {
        notificationBadge.textContent = String(notificationCount);
        notificationBadge.classList.toggle('unread', unreadCount > 0);
        notificationBadge.setAttribute('aria-label', unreadCount > 0 ? `${unreadCount} notificações não lidas` : `${notificationCount} notificações`);
      }
    };

    const observer = new MutationObserver(updateCounts);
    observer.observe(manifestationList, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    observer.observe(notificationList, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    updateCounts();

    /* O texto original é correto, mas muito comprido para um chip no telefone. */
    if (privacyChip) {
      const shortenPrivacy = () => {
        if (/e-mail de segurança confirmado/i.test(privacyChip.textContent || '')) {
          privacyChip.textContent = 'E-mail confirmado · privacidade à escolha';
        } else if (/identificação opcional/i.test(privacyChip.textContent || '')) {
          privacyChip.textContent = 'Privacidade à escolha';
        } else if (/e-mail de segurança ainda não verificado/i.test(privacyChip.textContent || '')) {
          privacyChip.textContent = 'Privacidade à escolha';
        }
      };
      new MutationObserver(shortenPrivacy).observe(privacyChip, { childList: true, subtree: true, characterData: true });
      shortenPrivacy();
    }
  };

  waitForCitizen();
})();