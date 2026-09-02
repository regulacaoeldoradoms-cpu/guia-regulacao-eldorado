'use strict';

(() => {
  const STORAGE_KEY = 'telemedicine-mobile-view-v7';
  const MOBILE_QUERY = '(max-width: 860px), (pointer: coarse) and (max-device-width: 900px)';

  function isMobileContext() {
    try { return window.matchMedia(MOBILE_QUERY).matches; } catch (_) { return false; }
  }

  function savedView() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'grid' ? 'grid' : 'list';
    } catch (_) {
      return 'list';
    }
  }

  function applyView(view, persist = true) {
    const normalized = view === 'grid' ? 'grid' : 'list';
    const body = document.body;
    if (!body) return;
    body.classList.toggle('tm-view-grid', normalized === 'grid');
    body.classList.toggle('tm-view-list', normalized === 'list');
    body.dataset.mobileView = normalized;

    document.querySelectorAll('[data-telemedicine-view]').forEach((button) => {
      const active = button.dataset.telemedicineView === normalized;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, normalized); } catch (_) {}
    }
  }

  function installSwitch() {
    const toolbar = document.querySelector('.telemedicine-toolbar');
    if (!toolbar || document.getElementById('telemedicineViewSwitch')) return;

    const switcher = document.createElement('div');
    switcher.id = 'telemedicineViewSwitch';
    switcher.className = 'telemedicine-view-switch';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Visualização dos acompanhamentos');
    switcher.innerHTML = `
      <button type="button" data-telemedicine-view="list" aria-pressed="false">☰ Lista</button>
      <button type="button" data-telemedicine-view="grid" aria-pressed="false">▦ Grade 2×2</button>`;

    toolbar.appendChild(switcher);
    switcher.addEventListener('click', (event) => {
      const button = event.target.closest('[data-telemedicine-view]');
      if (!button) return;
      applyView(button.dataset.telemedicineView || 'list');
    });
  }

  function boot() {
    if (!isMobileContext()) return;
    installSwitch();
    applyView(savedView(), false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();

  try {
    const media = window.matchMedia(MOBILE_QUERY);
    media.addEventListener?.('change', (event) => {
      if (event.matches) boot();
    });
  } catch (_) {}
})();
