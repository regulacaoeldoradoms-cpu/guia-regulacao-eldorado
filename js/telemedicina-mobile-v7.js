'use strict';

(() => {
  const MOBILE_STORAGE_KEY = 'telemedicine-mobile-view-v7';
  const DESKTOP_STORAGE_KEY = 'telemedicine-desktop-view-v16';
  const MOBILE_QUERY = '(max-width: 860px), (pointer: coarse) and (max-device-width: 900px)';

  function isMobileContext() {
    try { return window.matchMedia(MOBILE_QUERY).matches; } catch (_) { return false; }
  }

  function currentContext() {
    return isMobileContext() ? 'mobile' : 'desktop';
  }

  function storageKey(context) {
    return context === 'mobile' ? MOBILE_STORAGE_KEY : DESKTOP_STORAGE_KEY;
  }

  function savedView(context) {
    try {
      const value = localStorage.getItem(storageKey(context));
      return value === 'grid' ? 'grid' : 'list';
    } catch (_) {
      return 'list';
    }
  }

  function viewLabel(view, context) {
    if (view === 'list') return '☰ Lista';
    return context === 'mobile' ? '▦ Grade 2×2' : '▦ Grade 3×3';
  }

  function updateSwitch(context) {
    const switcher = document.getElementById('telemedicineViewSwitch');
    if (!switcher) return;
    switcher.dataset.viewContext = context;
    switcher.setAttribute(
      'aria-label',
      context === 'mobile'
        ? 'Visualização dos acompanhamentos: Lista ou Grade 2×2'
        : 'Visualização dos acompanhamentos: Lista ou Grade 3×3'
    );
    switcher.querySelectorAll('[data-telemedicine-view]').forEach((button) => {
      const view = button.dataset.telemedicineView === 'grid' ? 'grid' : 'list';
      button.textContent = viewLabel(view, context);
    });
  }

  function applyView(view, persist = true, context = currentContext()) {
    const normalized = view === 'grid' ? 'grid' : 'list';
    const body = document.body;
    if (!body) return;

    body.classList.toggle('tm-context-mobile', context === 'mobile');
    body.classList.toggle('tm-context-desktop', context === 'desktop');
    body.classList.toggle('tm-view-grid', normalized === 'grid');
    body.classList.toggle('tm-view-list', normalized === 'list');
    body.dataset.viewContext = context;
    body.dataset.telemedicineView = normalized;
    body.dataset.mobileView = context === 'mobile' ? normalized : '';

    updateSwitch(context);
    document.querySelectorAll('#telemedicineViewSwitch [data-telemedicine-view]').forEach((button) => {
      const active = button.dataset.telemedicineView === normalized;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (persist) {
      try { localStorage.setItem(storageKey(context), normalized); } catch (_) {}
    }
  }

  function installSwitch() {
    const toolbar = document.querySelector('.telemedicine-toolbar');
    if (!toolbar) return null;
    const existing = document.getElementById('telemedicineViewSwitch');
    if (existing) return existing;

    const switcher = document.createElement('div');
    switcher.id = 'telemedicineViewSwitch';
    switcher.className = 'telemedicine-view-switch';
    switcher.setAttribute('role', 'group');
    switcher.innerHTML = [
      '<button type="button" data-telemedicine-view="list" aria-pressed="false"></button>',
      '<button type="button" data-telemedicine-view="grid" aria-pressed="false"></button>'
    ].join('');

    toolbar.appendChild(switcher);
    switcher.addEventListener('click', (event) => {
      const button = event.target.closest('[data-telemedicine-view]');
      if (!button) return;
      applyView(button.dataset.telemedicineView || 'list');
    });
    return switcher;
  }

  function boot() {
    if (!installSwitch()) return;
    const context = currentContext();
    applyView(savedView(context), false, context);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  try {
    const media = window.matchMedia(MOBILE_QUERY);
    const handleContextChange = () => {
      const context = currentContext();
      applyView(savedView(context), false, context);
    };
    if (typeof media.addEventListener === 'function') media.addEventListener('change', handleContextChange);
    else if (typeof media.addListener === 'function') media.addListener(handleContextChange);
  } catch (_) {}
})();
