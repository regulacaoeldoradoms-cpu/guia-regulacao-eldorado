'use strict';

(() => {
  if (window.PortalSocialNavigation) return;

  let activeNotificationPanel = null;
  let globalListenersReady = false;
  const extraIcons = Object.freeze({
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7a7 7 0 0 0-.7-1.7l.9-1.9-2.1-2.1-1.9.9a7 7 0 0 0-1.7-.7L10.5 2h-3l-.7 2.3a7 7 0 0 0-1.7.7l-1.9-.9-2.1 2.1.9 1.9a7 7 0 0 0-.7 1.7L1 10.5v3l2.3.7a7 7 0 0 0 .7 1.7l-.9 1.9 2.1 2.1 1.9-.9a7 7 0 0 0 1.7.7l.7 2.3h3l.7-2.3a7 7 0 0 0 1.7-.7l1.9.9 2.1-2.1-.9-1.9a7 7 0 0 0 .7-1.7l2.3-.7Z" transform="translate(2.2 0) scale(.82)"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v5a4 4 0 0 1-8 0V3Z"/><path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6"/></svg>'
  });

  function ensureExtendedNavigationStyles() {
    if (document.getElementById('socialExtendedNavigationStyles')) return;
    const style = document.createElement('style');
    style.id = 'socialExtendedNavigationStyles';
    style.textContent = `
      @media (min-width:901px){
        .social-global-nav-inner{width:min(1360px,calc(100% - 32px));overflow-x:auto;scrollbar-width:thin}
        .social-nav-link{min-width:100px;flex:1 1 0;padding-left:9px;padding-right:9px;white-space:nowrap}
      }
      @media (max-width:900px){
        .social-mobile-nav{display:flex;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;overscroll-behavior-x:contain;justify-content:flex-start}
        .social-mobile-nav::-webkit-scrollbar{display:none}
        .social-mobile-nav-link{flex:0 0 84px;min-width:84px}
      }
      body.mobile-home-mode .social-mobile-nav{display:flex!important;overflow-x:auto;overflow-y:hidden;grid-auto-flow:unset;grid-auto-columns:unset;scrollbar-width:none}
      body.mobile-home-mode .social-mobile-nav::-webkit-scrollbar{display:none}
      body.mobile-home-mode .social-mobile-nav-link{flex:0 0 clamp(112px,15vw,150px);min-width:clamp(112px,15vw,150px)}
      @media (forced-colors:active){.social-nav-link,.social-mobile-nav-link{border:1px solid CanvasText}}
    `;
    document.head.appendChild(style);
  }

  function active(path) {
    const current = location.pathname;
    if (path === '/') return current === '/';
    return current === path || current.startsWith(path);
  }

  function appendNavContent(element, label, icon, options = {}) {
    const visual = document.createElement('span');
    visual.className = 'social-nav-icon';
    visual.innerHTML = icon;
    const text = document.createElement('span');
    text.textContent = label;
    element.append(visual, text);
    if (options.badge !== undefined) {
      const badge = document.createElement('span');
      badge.className = 'social-nav-badge';
      badge.dataset.socialNotificationBadge = 'true';
      const value = Number(options.badge || 0);
      badge.textContent = value > 99 ? '99+' : String(value);
      badge.hidden = value < 1;
      element.appendChild(badge);
    }
  }

  function navLink(path, label, icon, options = {}) {
    const link = document.createElement('a');
    link.href = path;
    link.className = options.mobile ? 'social-mobile-nav-link' : 'social-nav-link';
    if (options.social) link.dataset.socialNav = 'true';
    if (active(path)) link.setAttribute('aria-current', 'page');
    appendNavContent(link, label, icon, options);
    return link;
  }

  function setNotificationBadges(value) {
    const count = Math.max(0, Number(value || 0));
    document.querySelectorAll('[data-social-notification-badge="true"]').forEach((badge) => {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.hidden = count < 1;
    });
  }

  function closeNotificationPanel({ restoreFocus = false } = {}) {
    if (!activeNotificationPanel) return;
    const { trigger, panel } = activeNotificationPanel;
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    activeNotificationPanel = null;
    if (restoreFocus && trigger.isConnected) trigger.focus();
  }

  function ensureGlobalListeners() {
    if (globalListenersReady) return;
    globalListenersReady = true;
    document.addEventListener('pointerdown', (event) => {
      if (!activeNotificationPanel) return;
      const { trigger, panel } = activeNotificationPanel;
      if (trigger.contains(event.target) || panel.contains(event.target)) return;
      closeNotificationPanel();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && activeNotificationPanel) closeNotificationPanel({ restoreFocus: true });
    });
    window.addEventListener('resize', () => closeNotificationPanel());
  }

  function notificationPanelId(mobile) {
    return mobile ? 'socialNotificationPanelMobile' : 'socialNotificationPanelDesktop';
  }

  function notificationTriggerId(mobile) {
    return mobile ? 'socialNotificationTriggerMobile' : 'socialNotificationTriggerDesktop';
  }

  function renderNotificationItems(panel, items) {
    const social = window.PortalSocial;
    const list = panel.querySelector('.social-notification-panel-list');
    list.textContent = '';
    const visible = Array.isArray(items) ? items.slice(0, 10) : [];
    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'social-notification-panel-empty';
      const icon = document.createElement('span');
      icon.className = 'social-notification-panel-empty-icon';
      icon.innerHTML = social?.icons?.bell || '';
      const title = document.createElement('strong');
      title.textContent = 'Nenhuma notificação no momento';
      const text = document.createElement('span');
      text.textContent = 'Novos pedidos, aceitações e comentários aparecerão aqui.';
      empty.append(icon, title, text);
      list.appendChild(empty);
      return;
    }

    visible.forEach((item) => {
      const row = document.createElement('article');
      row.className = `social-notification social-notification-panel-item${item.read ? '' : ' unread'}`;
      const avatar = document.createElement('div');
      avatar.className = 'social-avatar';
      if (item.actor) social?.mountAvatar?.(avatar, item.actor);
      else avatar.innerHTML = social?.icons?.bell || '';

      const copy = document.createElement('div');
      const message = document.createElement('p');
      if (item.actor) {
        const link = document.createElement('a');
        link.href = social?.profileUrl?.(item.actor.handle) || '/perfil/';
        link.textContent = item.actor.name || `@${item.actor.handle}`;
        link.className = 'social-notification-panel-actor';
        message.append(link, document.createTextNode(` ${item.text || ''}.`));
      } else {
        message.textContent = item.text || 'Nova notificação social.';
      }
      const time = document.createElement('time');
      time.dateTime = item.createdAt || '';
      time.textContent = social?.formatDate?.(item.createdAt) || '';
      copy.append(message, time);
      row.append(avatar, copy);
      list.appendChild(row);
    });
  }

  async function loadNotificationPanel(panel, force = false) {
    const social = window.PortalSocial;
    if (!social?.api) return;
    const loadedAt = Number(panel.dataset.loadedAt || 0);
    if (!force && loadedAt && Date.now() - loadedAt < 30000) return;

    const list = panel.querySelector('.social-notification-panel-list');
    const status = panel.querySelector('.social-notification-panel-status');
    list.innerHTML = '<div class="social-notification-panel-loading" role="status">Carregando notificações...</div>';
    status.hidden = true;
    try {
      const payload = await social.api('/api/social/notifications');
      renderNotificationItems(panel, payload.notifications || []);
      panel.dataset.loadedAt = String(Date.now());
    } catch (error) {
      list.textContent = '';
      const failed = document.createElement('div');
      failed.className = 'social-notification-panel-empty';
      const title = document.createElement('strong');
      title.textContent = 'Não foi possível carregar as notificações';
      const text = document.createElement('span');
      text.textContent = 'Você ainda pode abrir o histórico completo.';
      failed.append(title, text);
      list.appendChild(failed);
      status.textContent = error?.message || 'Falha ao carregar notificações.';
      status.hidden = false;
    }
  }

  async function markNotificationsRead(panel, button) {
    const social = window.PortalSocial;
    if (!social?.api) return;
    button.disabled = true;
    const status = panel.querySelector('.social-notification-panel-status');
    try {
      await social.api('/api/social/notifications', { method: 'PATCH', body: '{}' });
      document.querySelectorAll('.social-notification.unread').forEach((item) => item.classList.remove('unread'));
      setNotificationBadges(0);
      status.textContent = 'Todas as notificações foram marcadas como lidas.';
      status.className = 'social-notification-panel-status success';
      status.hidden = false;
      panel.dataset.loadedAt = String(Date.now());
    } catch (error) {
      status.textContent = error?.message || 'Não foi possível atualizar as notificações.';
      status.className = 'social-notification-panel-status error';
      status.hidden = false;
    } finally {
      button.disabled = false;
    }
  }

  function createNotificationPanel(trigger, mobile) {
    const panel = document.createElement('section');
    panel.id = notificationPanelId(mobile);
    panel.className = 'social-notification-panel';
    panel.dataset.mobile = mobile ? 'true' : 'false';
    panel.hidden = true;
    panel.tabIndex = -1;
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('aria-label', 'Notificações sociais');

    const heading = document.createElement('div');
    heading.className = 'social-notification-panel-heading';
    const titleWrap = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = 'Notificações';
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Pedidos, aceitações e comentários recentes.';
    titleWrap.append(title, subtitle);
    const markRead = document.createElement('button');
    markRead.type = 'button';
    markRead.className = 'social-notification-panel-read';
    markRead.textContent = 'Marcar como lidas';
    markRead.addEventListener('click', () => markNotificationsRead(panel, markRead));
    heading.append(titleWrap, markRead);

    const list = document.createElement('div');
    list.className = 'social-notification-panel-list';
    list.setAttribute('aria-live', 'polite');

    const status = document.createElement('div');
    status.className = 'social-notification-panel-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;

    const footer = document.createElement('div');
    footer.className = 'social-notification-panel-footer';
    const history = document.createElement('a');
    history.href = '/notificacoes/';
    history.textContent = 'Ver histórico completo';
    footer.appendChild(history);

    panel.append(heading, list, status, footer);
    document.body.appendChild(panel);
    return panel;
  }

  function positionNotificationPanel(trigger, panel, mobile) {
    if (mobile) return;
    const rect = trigger.getBoundingClientRect();
    panel.style.setProperty('--social-notification-panel-top', `${Math.round(rect.bottom + 8)}px`);
    panel.style.setProperty('--social-notification-panel-right', `${Math.max(16, Math.round(window.innerWidth - rect.right))}px`);
  }

  function notificationButton(label, icon, options = {}) {
    const mobile = Boolean(options.mobile);
    const button = document.createElement('button');
    button.type = 'button';
    button.id = notificationTriggerId(mobile);
    button.className = `${mobile ? 'social-mobile-nav-link' : 'social-nav-link'} social-notification-trigger`;
    button.dataset.socialNav = 'true';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', notificationPanelId(mobile));
    if (active('/notificacoes/')) button.setAttribute('aria-current', 'page');
    appendNavContent(button, label, icon, { badge: options.badge });

    const panel = createNotificationPanel(button, mobile);
    button.addEventListener('click', async () => {
      if (activeNotificationPanel?.trigger === button) {
        closeNotificationPanel({ restoreFocus: true });
        return;
      }
      closeNotificationPanel();
      positionNotificationPanel(button, panel, mobile);
      panel.hidden = false;
      panel.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-expanded', 'true');
      activeNotificationPanel = { trigger: button, panel };
      await loadNotificationPanel(panel);
      if (activeNotificationPanel?.panel === panel) panel.focus({ preventScroll: true });
    });
    return button;
  }

  function accountNavigationLinks(icons, mobile) {
    return [
      navLink('/seguranca/', 'Segurança', icons.shield || '', { mobile }),
      navLink('/configuracoes/', 'Configurações', extraIcons.settings, { mobile }),
      navLink('/conquistas/', 'Conquistas', extraIcons.trophy, { mobile })
    ];
  }

  function mount(user, socialConfig = {}) {
    closeNotificationPanel();
    document.querySelectorAll('.social-global-nav,.social-mobile-nav,.social-notification-panel').forEach((item) => item.remove());
    document.body.classList.remove('has-social-navigation');
    ensureGlobalListeners();
    ensureExtendedNavigationStyles();

    const icons = window.PortalSocial?.icons || {};
    const header = document.querySelector('.portal-topbar');
    const socialAvailable = Boolean(socialConfig.backendEnabled && socialConfig.available);
    const unread = Number(socialConfig.unreadSocialNotifications || 0);

    if (socialAvailable) {
      window.PortalSocial?.preloadRelationshipList?.('friends').catch(() => {});
    }

    if (header) {
      const desktop = document.createElement('nav');
      desktop.className = 'social-global-nav';
      desktop.setAttribute('aria-label', 'Navegação principal do Portal');
      const inner = document.createElement('div');
      inner.className = 'social-global-nav-inner';
      const desktopLinks = [navLink('/', 'Início', icons.home || '')];
      if (socialAvailable) desktopLinks.push(navLink('/amigos/', 'Amigos', icons.friends || '', { social: true }));
      desktopLinks.push(navLink('/ferramentas/', 'Ferramentas', icons.tools || ''));
      if (socialAvailable) {
        desktopLinks.push(
          notificationButton('Notificações', icons.bell || '', { badge: unread }),
          navLink('/perfil/', 'Perfil', icons.user || '', { social: true })
        );
      }
      desktopLinks.push(...accountNavigationLinks(icons, false));
      inner.append(...desktopLinks);
      desktop.appendChild(inner);
      header.insertAdjacentElement('afterend', desktop);
    }

    const bottom = document.createElement('nav');
    bottom.className = 'social-mobile-nav';
    bottom.setAttribute('aria-label', 'Navegação principal mobile');
    const mobileLinks = [navLink('/', 'Início', icons.home || '', { mobile: true })];
    if (socialAvailable) mobileLinks.push(navLink('/amigos/', 'Amigos', icons.friends || '', { mobile: true, social: true }));
    mobileLinks.push(navLink('/ferramentas/', 'Ferramentas', icons.tools || '', { mobile: true }));
    if (socialAvailable) {
      mobileLinks.push(
        notificationButton('Avisos', icons.bell || '', { mobile: true, badge: unread }),
        navLink('/perfil/', 'Perfil', icons.user || '', { mobile: true, social: true })
      );
    }
    mobileLinks.push(...accountNavigationLinks(icons, true));
    bottom.append(...mobileLinks);
    document.body.appendChild(bottom);
    document.body.classList.add('has-social-navigation');

    const role = document.getElementById('portalUserRole');
    const labels = window.PortalTools?.roleLabels || {};
    if (role && !role.textContent) role.textContent = labels[user?.role] || user?.role || '';
  }

  window.PortalSocialNavigation = Object.freeze({ mount });
})();
