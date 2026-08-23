/* Navegação mobile do Canal do Cidadão. Mantém desktop intacto. */
(() => {
  if (!document.body.classList.contains('mobile-citizen-mode')) return;

  const privacyStyles = document.createElement('link');
  privacyStyles.rel = 'stylesheet';
  privacyStyles.href = '/css/citizen-privacy-accordion.css?v=20260822-2317';
  privacyStyles.dataset.citizenPrivacyAccordion = 'true';
  document.head.appendChild(privacyStyles);

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
          <span class="privacy-help-icon" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></span>
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

    setupPrivacyCompactHelp();
  };

  waitForCitizen();
})();