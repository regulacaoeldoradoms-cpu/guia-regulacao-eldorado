'use strict';

(() => {
  if (window.PortalGlobalNavigation) return;

  const VERSION = '1.0.1';
  const SOCIAL_CSS = '/css/social.css?v=20260922-2';
  const NOTIFICATION_CSS = '/css/social-notification-panel.css?v=20260910-1';
  const SOCIAL_API = '/js/social-api.js?v=20260910-4';
  const AUTH_CONFIG = '/js/auth-config.js?v=20260815-1';
  const AUTH_CLIENT = '/js/auth-client.js?v=20261001-v34-8';
  const SOCIAL_NAVIGATION = '/js/social-navigation.js?v=20261009-pets-1';
  let started = false;
  let running = null;

  function eligibleSurface() {
    return Boolean(
      document.querySelector('.portal-topbar, .site-header')
      && !document.body?.matches?.('[data-portal-global-navigation="off"]')
    );
  }

  function stylesheet(href, id) {
    const path = href.split('?')[0];
    const existing = document.getElementById(id)
      || [...document.querySelectorAll('link[rel="stylesheet"]')].find((link) => link.href.includes(path));
    if (existing?.sheet) return Promise.resolve(existing);
    if (existing) return new Promise((resolve) => {
      const done = () => resolve(existing);
      existing.addEventListener('load', done, { once: true });
      existing.addEventListener('error', done, { once: true });
      window.setTimeout(done, 1500);
    });
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      const done = () => resolve(link);
      link.addEventListener('load', done, { once: true });
      link.addEventListener('error', done, { once: true });
      document.head.appendChild(link);
    });
  }

  function script(src, globalName, id, options = {}) {
    const force = options.force === true;
    if (window[globalName] && !force) return Promise.resolve(window[globalName]);
    const path = src.split('?')[0];
    const existing = force
      ? null
      : (document.getElementById(id) || [...document.scripts].find((item) => item.src.includes(path)));
    if (existing) return new Promise((resolve) => {
      if (window[globalName]) return resolve(window[globalName]);
      const done = () => resolve(window[globalName] || null);
      existing.addEventListener('load', done, { once: true });
      existing.addEventListener('error', done, { once: true });
      window.setTimeout(done, 1800);
    });
    return new Promise((resolve) => {
      const element = document.createElement('script');
      element.id = id;
      element.src = src;
      element.async = false;
      const done = () => resolve(window[globalName] || null);
      element.addEventListener('load', done, { once: true });
      element.addEventListener('error', done, { once: true });
      document.head.appendChild(element);
    });
  }

  function storedToken() {
    try {
      return sessionStorage.getItem('regulacao.portal.session')
        || localStorage.getItem('regulacao.portal.session')
        || '';
    } catch (_) {
      return '';
    }
  }

  async function ensureAuthClient() {
    if (window.RegulationAuth) return window.RegulationAuth;
    if (!storedToken()) return null;
    await script(AUTH_CONFIG, 'REGULATION_AUTH_CONFIG', 'portalGlobalNavigationAuthConfig');
    await script(AUTH_CLIENT, 'RegulationAuth', 'portalGlobalNavigationAuthClient');
    return window.RegulationAuth || null;
  }

  async function resolveUser() {
    const auth = await ensureAuthClient();
    if (!auth) return null;
    if (auth.enforcementEnabled && !auth.getToken?.()) return null;
    const cached = auth.getCachedUser?.();
    if (cached) return cached;
    if (!auth.enforcementEnabled) return auth.requireRole?.([]) || null;
    return auth.me?.({ allowCached: true }) || null;
  }

  async function mount() {
    if (!eligibleSurface()) return false;
    const user = await resolveUser();
    if (!user || user.mustChangePassword) return false;

    await Promise.all([
      stylesheet(SOCIAL_CSS, 'portalGlobalNavigationSocialCss'),
      stylesheet(NOTIFICATION_CSS, 'portalGlobalNavigationNotificationCss')
    ]);
    await script(SOCIAL_API, 'PortalSocial', 'portalGlobalNavigationSocialApi');
    const navigationIsCurrent = window.PortalSocialNavigation?.version === '20261009-pets-1';
    await script(
      SOCIAL_NAVIGATION,
      'PortalSocialNavigation',
      'portalGlobalNavigationScript',
      { force: !navigationIsCurrent }
    );

    const navigation = window.PortalSocialNavigation;
    if (!navigation?.mount) return false;

    let config = { backendEnabled: false, available: false, unreadSocialNotifications: 0 };
    navigation.mount(user, config);
    try {
      if (window.PortalSocial?.getConfig) config = await window.PortalSocial.getConfig(8000);
    } catch (_) {}
    navigation.mount(user, config || {});
    // Authenticated public guides also share the account companion, independently of social availability.
    import('/js/pets-bootstrap.js').then(async (pets) => {
      const session = await pets.petSession();
      session?.runtime.layout();
    }).catch(() => {});
    document.documentElement.dataset.portalGlobalNavigation = 'v1';
    return true;
  }

  function start() {
    if (started) return running || Promise.resolve(false);
    started = true;
    running = mount().finally(() => { running = null; });
    return running;
  }

  window.addEventListener('portal:social-config-updated', (event) => {
    const user = window.RegulationAuth?.getCachedUser?.();
    const config = event.detail?.config;
    if (user && config && eligibleSurface()) window.PortalSocialNavigation?.mount?.(user, config);
  });

  window.PortalGlobalNavigation = Object.freeze({ version: VERSION, start, mount });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
