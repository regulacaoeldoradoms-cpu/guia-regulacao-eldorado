'use strict';

(() => {
  if (!/^\/telemedicina\/?$/.test(window.location.pathname)) return;

  /*
   * V23 — decisão permanente de estabilidade:
   * a Telemedicina não executa mais qualquer camada de movimento,
   * sonificação ou manipulação automática de viewport.
   *
   * Este arquivo continua carregado por compatibilidade e cache-busting,
   * mas a implementação V22 abaixo fica deliberadamente inativa.
   */
  document.documentElement.classList.remove('tm-viewport-v22', 'tm-viewport-v22-ready');
  try {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'auto';
  } catch (_) {}

  const noop = () => {};
  if (!window.PortalInteractions) {
    window.PortalInteractions = Object.freeze({
      version: 'disabled-telemedicina-v23',
      disabled: true,
      emit: () => false,
      notify: () => false,
      announce: noop,
      beginTask: () => noop,
      endTask: noop,
      transition: (update) => {
        if (typeof update === 'function') update();
        return Promise.resolve();
      },
      register: () => noop,
      getPreferences: () => ({ soundsEnabled: false, volume: 0, muted: true }),
      setPreferences: () => Promise.resolve({ localOnly: true }),
      prefersReducedMotion: () => true,
      start: noop,
      destroy: noop,
      sounds: Object.freeze({
        play: () => false,
        preload: noop,
        unlock: () => false,
        update: noop
      })
    });
  }

  window.TelemedicineViewportV22 = Object.freeze({
    pin: noop,
    release: noop,
    isLocked: () => false
  });
  return;

  const MAX_HOLD_MS = 15000;
  const STABILIZE_MS = 320;
  const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
  const target = { x: 0, y: 0 };

  let locked = true;
  let userScrollIntent = false;
  let scrollFrame = 0;
  let releaseTimer = 0;
  let maxTimer = 0;
  let observer = null;

  document.documentElement.classList.add('tm-viewport-v22');

  try {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  } catch (_) {}

  function pinViewport() {
    if (!locked || userScrollIntent) return;
    if (window.scrollX === target.x && window.scrollY === target.y) return;
    window.scrollTo({ left: target.x, top: target.y, behavior: 'auto' });
  }

  function onAutomaticScroll() {
    if (!locked || userScrollIntent) return;
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(pinViewport);
  }

  function cleanup() {
    observer?.disconnect();
    observer = null;
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    if (releaseTimer) clearTimeout(releaseTimer);
    if (maxTimer) clearTimeout(maxTimer);
    window.removeEventListener('scroll', onAutomaticScroll);
    window.removeEventListener('wheel', markUserScrollIntent);
    window.removeEventListener('touchmove', markUserScrollIntent);
    window.removeEventListener('keydown', onKeydown);
  }

  function releaseViewport() {
    if (!locked) return;
    pinViewport();
    locked = false;
    cleanup();
    document.documentElement.classList.add('tm-viewport-v22-ready');
  }

  function markUserScrollIntent() {
    if (!locked) return;
    userScrollIntent = true;
    locked = false;
    cleanup();
    document.documentElement.classList.add('tm-viewport-v22-ready');
  }

  function onKeydown(event) {
    if (SCROLL_KEYS.has(event.key)) markUserScrollIntent();
  }

  function dashboardHydrated() {
    const today = document.getElementById('todayLabel');
    const list = document.getElementById('followupList');
    if (!today || !list) return false;

    const dateLoaded = Boolean(today.textContent.trim()) && today.textContent.trim() !== '—';
    const listText = list.textContent || '';
    const listLoading = listText.includes('Carregando acompanhamentos');
    return dateLoaded && !listLoading;
  }

  function scheduleReleaseAfterHydration() {
    if (!locked || userScrollIntent || releaseTimer) return;
    pinViewport();
    requestAnimationFrame(() => {
      pinViewport();
      requestAnimationFrame(() => {
        pinViewport();
        releaseTimer = window.setTimeout(releaseViewport, STABILIZE_MS);
      });
    });
  }

  function inspectDashboardState() {
    pinViewport();
    if (dashboardHydrated()) scheduleReleaseAfterHydration();
  }

  function observeDashboardHydration() {
    const today = document.getElementById('todayLabel');
    const list = document.getElementById('followupList');
    if (!today || !list) return;

    observer = new MutationObserver(inspectDashboardState);
    observer.observe(today, { childList: true, subtree: true, characterData: true });
    observer.observe(list, { childList: true, subtree: true, characterData: true });
    inspectDashboardState();
  }

  window.addEventListener('scroll', onAutomaticScroll, { passive: true });
  window.addEventListener('wheel', markUserScrollIntent, { passive: true });
  window.addEventListener('touchmove', markUserScrollIntent, { passive: true });
  window.addEventListener('keydown', onKeydown, { passive: true });
  window.addEventListener('pageshow', pinViewport);

  pinViewport();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeDashboardHydration, { once: true });
  } else {
    observeDashboardHydration();
  }

  maxTimer = window.setTimeout(releaseViewport, MAX_HOLD_MS);

  window.TelemedicineViewportV22 = Object.freeze({
    pin: pinViewport,
    release: releaseViewport,
    isLocked: () => locked
  });
})();
