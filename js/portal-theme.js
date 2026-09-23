'use strict';

(() => {
  if (window.PortalTheme) return;

  const VERSION = '1.0.0';
  const STORAGE_KEY = 'regulacao.portal.theme.active.v1';
  const LIGHT = 'light';
  const DARK = 'dark';

  function normalize(value, fallback = LIGHT) {
    const theme = String(value || '').trim().toLowerCase();
    return theme === DARK || theme === LIGHT ? theme : fallback;
  }

  function stored() {
    try { return normalize(localStorage.getItem(STORAGE_KEY) || LIGHT); }
    catch (_) { return LIGHT; }
  }

  function store(theme) {
    try { localStorage.setItem(STORAGE_KEY, normalize(theme)); }
    catch (_) {}
  }

  function updateMeta(theme) {
    const meta = document.querySelector?.('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === DARK ? '#081a29' : '#0d3157');
  }

  function apply(value, options = {}) {
    const theme = normalize(value);
    document.documentElement.dataset.portalTheme = theme;
    document.documentElement.style.colorScheme = theme;
    if (document.body) document.body.dataset.portalTheme = theme;
    updateMeta(theme);
    if (options.persist !== false) store(theme);
    return theme;
  }

  function cachedAccountTheme() {
    try {
      const user = window.RegulationAuth?.getCachedUser?.();
      if (!user || !Object.prototype.hasOwnProperty.call(user, 'interfaceTheme')) return '';
      return normalize(user.interfaceTheme, '');
    } catch (_) {
      return '';
    }
  }

  function hydrateCachedAccount() {
    const accountTheme = cachedAccountTheme();
    if (accountTheme) apply(accountTheme);
    else apply(stored(), { persist: false });
  }

  const initial = apply(stored(), { persist: false });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    apply(stored(), { persist: false });
  });

  const onReady = () => {
    if (document.body) document.body.dataset.portalTheme = document.documentElement.dataset.portalTheme || initial;
    updateMeta(document.documentElement.dataset.portalTheme || initial);
    hydrateCachedAccount();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady, { once: true });
  else onReady();

  window.PortalTheme = Object.freeze({
    version: VERSION,
    key: STORAGE_KEY,
    normalize,
    get: () => normalize(document.documentElement.dataset.portalTheme || stored()),
    apply,
    hydrateCachedAccount
  });
})();
