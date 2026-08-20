/* Navegação mobile do Canal do Cidadão. Mantém desktop intacto. */
(() => {
  if (!document.body.classList.contains('mobile-citizen-mode')) return;

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
        } else if (/e-mail de segurança ainda não verificado/i.test(privacyChip.textContent || '')) {
          privacyChip.textContent = 'Privacidade anônima · e-mail não confirmado';
        }
      };
      new MutationObserver(shortenPrivacy).observe(privacyChip, { childList: true, subtree: true, characterData: true });
      shortenPrivacy();
    }
  };

  waitForCitizen();
})();
