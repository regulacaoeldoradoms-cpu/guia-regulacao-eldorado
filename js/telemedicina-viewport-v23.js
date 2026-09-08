'use strict';

(() => {
  if (!/^\/telemedicina\/?$/.test(window.location.pathname)) return;

  const MAX_HOLD_MS = 8000;
  const QUIET_MS = 950;
  const MIN_HOLD_MS = 900;
  const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
  const startedAt = performance.now();

  let locked = true;
  let userScrollIntent = false;
  let windowLoaded = document.readyState === 'complete';
  let observer = null;
  let quietTimer = 0;
  let maxTimer = 0;
  let scrollFrame = 0;

  document.documentElement.classList.add('tm-viewport-v23-lock');

  try {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  } catch (_) {}

  function rawTop() {
    window.scrollTo(0, 0);
  }

  function pinViewport() {
    if (!locked || userScrollIntent) return;
    if (window.scrollX === 0 && window.scrollY === 0) return;
    rawTop();
  }

  function dashboardHydrated() {
    const today = document.getElementById('todayLabel');
    const list = document.getElementById('followupList');
    if (!today || !list) return false;

    const dateText = today.textContent.trim();
    const dateLoaded = Boolean(dateText) && dateText !== '—';
    const listLoading = (list.textContent || '').includes('Carregando acompanhamentos');
    return dateLoaded && !listLoading;
  }

  function clearQuietTimer() {
    if (!quietTimer) return;
    window.clearTimeout(quietTimer);
    quietTimer = 0;
  }

  function cleanup() {
    observer?.disconnect();
    observer = null;
    clearQuietTimer();
    if (maxTimer) window.clearTimeout(maxTimer);
    maxTimer = 0;
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    window.removeEventListener('scroll', onAutomaticScroll);
    window.removeEventListener('wheel', markUserScrollIntent);
    window.removeEventListener('touchmove', markUserScrollIntent);
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('load', onWindowLoad);
    window.removeEventListener('pageshow', onPageShow);
    document.removeEventListener('focusin', onFocusIn, true);
  }

  function finishRelease() {
    if (!locked || userScrollIntent) return;
    rawTop();
    document.documentElement.classList.remove('tm-viewport-v23-lock');
    document.documentElement.classList.add('tm-viewport-v23-ready');
    locked = false;
    cleanup();

    // Neutraliza qualquer restauração tardia já enfileirada pelo navegador.
    requestAnimationFrame(() => {
      rawTop();
      requestAnimationFrame(rawTop);
    });
  }

  function releaseWhenQuiet() {
    quietTimer = 0;
    if (!locked || userScrollIntent) return;
    if (!windowLoaded || !dashboardHydrated()) {
      scheduleQuietRelease();
      return;
    }
    pinViewport();
    finishRelease();
  }

  function scheduleQuietRelease() {
    if (!locked || userScrollIntent) return;
    clearQuietTimer();
    if (!windowLoaded || !dashboardHydrated()) return;

    const elapsed = performance.now() - startedAt;
    const wait = Math.max(QUIET_MS, MIN_HOLD_MS - elapsed);
    quietTimer = window.setTimeout(releaseWhenQuiet, wait);
  }

  function noteAutomaticActivity() {
    if (!locked || userScrollIntent) return;
    pinViewport();
    scheduleQuietRelease();
  }

  function onAutomaticScroll() {
    if (!locked || userScrollIntent) return;
    clearQuietTimer();
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      pinViewport();
      scheduleQuietRelease();
    });
  }

  function onFocusIn() {
    if (!locked || userScrollIntent) return;
    noteAutomaticActivity();
  }

  function markUserScrollIntent() {
    if (!locked) return;
    userScrollIntent = true;
    document.documentElement.classList.remove('tm-viewport-v23-lock');
    document.documentElement.classList.add('tm-viewport-v23-ready');
    locked = false;
    cleanup();
  }

  function onKeydown(event) {
    if (SCROLL_KEYS.has(event.key)) markUserScrollIntent();
  }

  function onWindowLoad() {
    windowLoaded = true;
    noteAutomaticActivity();
  }

  function onPageShow() {
    noteAutomaticActivity();
  }

  function observeDashboardHydration() {
    const today = document.getElementById('todayLabel');
    const list = document.getElementById('followupList');
    if (!today || !list) return;

    observer = new MutationObserver(() => {
      // A lista ainda recebe decorações assíncronas (editar/excluir) depois do
      // primeiro render. Cada mutação reinicia a janela de silêncio.
      noteAutomaticActivity();
    });
    observer.observe(today, { childList: true, subtree: true, characterData: true });
    observer.observe(list, { childList: true, subtree: true, characterData: true });
    noteAutomaticActivity();
  }

  window.addEventListener('scroll', onAutomaticScroll, { passive: true });
  window.addEventListener('wheel', markUserScrollIntent, { passive: true });
  window.addEventListener('touchmove', markUserScrollIntent, { passive: true });
  window.addEventListener('keydown', onKeydown, { passive: true });
  window.addEventListener('load', onWindowLoad, { once: true });
  window.addEventListener('pageshow', onPageShow);
  document.addEventListener('focusin', onFocusIn, true);

  rawTop();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeDashboardHydration, { once: true });
  } else {
    observeDashboardHydration();
  }

  maxTimer = window.setTimeout(() => {
    if (!locked || userScrollIntent) return;
    finishRelease();
  }, MAX_HOLD_MS);

  window.TelemedicineViewportV23 = Object.freeze({
    pin: pinViewport,
    release: finishRelease,
    isLocked: () => locked,
    hasUserScrollIntent: () => userScrollIntent
  });
})();