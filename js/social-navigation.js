'use strict';

(() => {
  if (window.PortalSocialNavigation) return;

  function active(path) {
    const current = location.pathname;
    if (path === '/') return current === '/';
    return current === path || current.startsWith(path);
  }

  function navLink(path, label, icon, options = {}) {
    const link = document.createElement('a');
    link.href = path;
    link.className = options.mobile ? 'social-mobile-nav-link' : 'social-nav-link';
    if (options.social) link.dataset.socialNav = 'true';
    if (active(path)) link.setAttribute('aria-current', 'page');
    const visual = document.createElement('span');
    visual.className = 'social-nav-icon';
    visual.innerHTML = icon;
    const text = document.createElement('span');
    text.textContent = label;
    link.append(visual, text);
    if (options.badge) {
      const badge = document.createElement('span');
      badge.className = 'social-nav-badge';
      badge.textContent = options.badge > 99 ? '99+' : String(options.badge);
      badge.hidden = options.badge < 1;
      link.appendChild(badge);
    }
    return link;
  }

  function mount(user, socialConfig = {}) {
    document.querySelectorAll('.social-global-nav,.social-mobile-nav').forEach((item) => item.remove());
    document.body.classList.remove('has-social-navigation');
    const icons = window.PortalSocial?.icons || {};
    const header = document.querySelector('.portal-topbar');
    const socialAvailable = Boolean(socialConfig.backendEnabled && socialConfig.available);

    if (header) {
      const desktop = document.createElement('nav');
      desktop.className = 'social-global-nav';
      desktop.setAttribute('aria-label', 'Navegação principal do Portal');
      const inner = document.createElement('div');
      inner.className = 'social-global-nav-inner';
      const desktopLinks = [navLink('/', 'Início', icons.home || '')];
      if (socialAvailable) {
        desktopLinks.push(
          navLink('/perfil/', 'Meu perfil', icons.user || '', { social: true }),
          navLink('/amigos/', 'Amigos', icons.friends || '', { social: true })
        );
      }
      desktopLinks.push(navLink('/ferramentas/', 'Ferramentas', icons.tools || ''));
      if (socialAvailable) {
        desktopLinks.push(navLink('/notificacoes/', 'Notificações', icons.bell || '', {
          social: true,
          badge: Number(socialConfig.unreadSocialNotifications || 0)
        }));
      }
      desktopLinks.push(navLink('/conta/', 'Conta', icons.user || ''));
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
      mobileLinks.push(navLink('/notificacoes/', 'Avisos', icons.bell || '', {
        mobile: true,
        social: true,
        badge: Number(socialConfig.unreadSocialNotifications || 0)
      }));
    }
    mobileLinks.push(navLink('/conta/', 'Conta', icons.user || '', { mobile: true }));
    bottom.append(...mobileLinks);
    document.body.appendChild(bottom);
    document.body.classList.add('has-social-navigation');

    const role = document.getElementById('portalUserRole');
    const labels = window.PortalTools?.roleLabels || {};
    if (role && !role.textContent) role.textContent = labels[user?.role] || user?.role || '';
  }

  window.PortalSocialNavigation = Object.freeze({ mount });
})();
