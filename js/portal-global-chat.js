'use strict';

(() => {
  if (window.PortalGlobalChat?.version === '20261002-d1guard-1') return;

  const VERSION = '20261002-d1guard-1';
  const TOKEN_KEY = 'regulacao.portal.session';
  const AUTH_CONFIG = '/js/auth-config.js?v=20260815-1';
  const AUTH_CLIENT = '/js/auth-client.js?v=20261001-v34-8';
  const CHAT_CSS = '/css/portal-chat.css?v=20261002-d1guard-1';
  const CHAT_SCRIPT = '/js/portal-chat.js?v=20261002-d1guard-1';
  const CHAT_OPTIMIZER = '/js/portal-chat-switch-optimizer.js?v=20260928-global-1';
  let started = false;
  let running = null;

  function storedToken() {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || '';
    } catch (_) {
      return '';
    }
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

  function script(src, globalName, id) {
    if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
    const path = src.split('?')[0];
    const existing = document.getElementById(id)
      || [...document.scripts].find((item) => item.src.includes(path));
    if (existing) return new Promise((resolve) => {
      if (globalName && window[globalName]) return resolve(window[globalName]);
      const done = () => resolve(globalName ? window[globalName] || null : true);
      existing.addEventListener('load', done, { once: true });
      existing.addEventListener('error', done, { once: true });
      window.setTimeout(done, 1800);
    });
    return new Promise((resolve) => {
      const element = document.createElement('script');
      element.id = id;
      element.src = src;
      element.async = false;
      const done = () => resolve(globalName ? window[globalName] || null : true);
      element.addEventListener('load', done, { once: true });
      element.addEventListener('error', done, { once: true });
      document.head.appendChild(element);
    });
  }

  async function ensureAuth() {
    if (window.RegulationAuth) return window.RegulationAuth;
    if (!storedToken()) return null;
    await script(AUTH_CONFIG, 'REGULATION_AUTH_CONFIG', 'portalGlobalChatAuthConfig');
    await script(AUTH_CLIENT, 'RegulationAuth', 'portalGlobalChatAuthClient');
    return window.RegulationAuth || null;
  }

  async function mount() {
    const auth = await ensureAuth();
    if (!auth || (auth.enforcementEnabled && !auth.getToken?.())) return false;
    const user = auth.getCachedUser?.() || await auth.me?.({ allowCached: true }).catch(() => null);
    if (!user || user.mustChangePassword) return false;

    await stylesheet(CHAT_CSS, 'portalGlobalChatStyle');
    await script(CHAT_SCRIPT, 'PortalChat', 'portalGlobalChatScript');
    await script(CHAT_OPTIMIZER, 'PortalChatSwitchOptimizer', 'portalGlobalChatOptimizer');
    document.documentElement.dataset.portalGlobalChat = VERSION;
    return Boolean(window.PortalChat);
  }

  function start() {
    if (started) return running || Promise.resolve(Boolean(window.PortalChat));
    started = true;
    running = mount().finally(() => { running = null; });
    return running;
  }

  window.PortalGlobalChat = Object.freeze({ version: VERSION, start, mount });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
