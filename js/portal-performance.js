'use strict';

(() => {
  if (window.PortalPerformance) return;

  const WORKER_URL = '/portal-sw.js';
  const WORKER_SCOPE = '/';
  const PWA_CLIENT_URL = '/js/portal-pwa.js?v=20260922-3';
  const OBSERVABILITY_CLIENT_URL = '/js/portal-observability.js?v=20260921-2';
  const DOCUMENTS_ROUTE = '/documentos/';
  const DOCUMENTS_WARM_REFRESH_MS = 30 * 1000;
  const DOCUMENTS_WARM_GET_TIMEOUT_MS = 6000;
  const CORE_ROUTES = Object.freeze(['/', '/ferramentas/', '/seguranca/', '/configuracoes/', '/conquistas/']);
  const SOCIAL_ROUTES = Object.freeze(['/amigos/', '/notificacoes/', '/perfil/']);
  const KNOWN_ROUTES = new Set([
    '/', '/home/', '/login/', '/cadastro/', '/ferramentas/', '/perfil/',
    '/amigos/', '/notificacoes/', '/seguranca/', '/configuracoes/', '/conquistas/', '/conta/', '/estudos/', '/medico/', '/protocolo/',
    '/recepcao/', '/telemedicina/', '/documentos/', '/cidadao/', '/conselho/',
    '/conselho/painel/', '/admin/usuarios/', '/admin/monitoramento/',
    '/admin/configuracao/', '/admin/social/'
  ]);
  const warmedRoutes = new Set();
  let registrationPromise = null;
  let observer = null;
  let pwaClientStarted = false;
  let observabilityClientStarted = false;
  let documentsWarmTimer = null;

  function ensurePwaClient() {
    if (window.PortalPWA || pwaClientStarted || document.querySelector?.('script[data-portal-pwa]')) return;
    if (typeof document.createElement !== 'function' || !document.head?.appendChild) return;
    pwaClientStarted = true;
    const script = document.createElement('script');
    script.src = PWA_CLIENT_URL;
    script.async = false;
    script.dataset.portalPwa = 'true';
    script.addEventListener('error', () => { pwaClientStarted = false; }, { once: true });
    document.head.appendChild(script);
  }

  function ensureObservabilityClient() {
    if (window.PortalObservability || observabilityClientStarted || document.querySelector?.('script[data-portal-observability]')) return;
    if (typeof document.createElement !== 'function' || !document.head?.appendChild) return;
    observabilityClientStarted = true;
    const script = document.createElement('script');
    script.src = OBSERVABILITY_CLIENT_URL;
    script.async = true;
    script.dataset.portalObservability = 'true';
    script.addEventListener('error', () => { observabilityClientStarted = false; }, { once: true });
    document.head.appendChild(script);
  }

  function portalRoute(value) {
    if (!value) return '';
    try {
      const url = new URL(value, location.origin);
      if (url.origin !== location.origin) return '';
      let path = url.pathname || '/';
      if (path.endsWith('/index.html')) path = path.slice(0, -10) || '/';
      if (!path.endsWith('/') && path !== '/') path += '/';
      return KNOWN_ROUTES.has(path) ? path : '';
    } catch (_) {
      return '';
    }
  }

  function connectionIsConstrained() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return false;
    return Boolean(connection.saveData || /(^|-)2g$/.test(String(connection.effectiveType || '')));
  }

  function idle(callback, delay = 0) {
    window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout: 2500 });
      } else {
        window.setTimeout(callback, 32);
      }
    }, Math.max(0, delay));
  }

  async function register() {
    if (!('serviceWorker' in navigator)) return null;
    if (location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) return null;
    if (registrationPromise) return registrationPromise;

    registrationPromise = (async () => {
      const registration = await navigator.serviceWorker.register(WORKER_URL, {
        scope: WORKER_SCOPE,
        updateViaCache: 'none'
      });
      const ready = await navigator.serviceWorker.ready;
      idle(() => registration.update().catch(() => {}), 4000);
      return ready || registration;
    })().catch(() => {
      registrationPromise = null;
      return null;
    });

    return registrationPromise;
  }

  function postWarm(routes) {
    if (!routes.length) return Promise.resolve(false);
    return register().then((registration) => {
      const worker = navigator.serviceWorker.controller
        || registration?.active
        || registration?.waiting
        || registration?.installing;
      if (!worker) return false;
      worker.postMessage({ type: 'PORTAL_WARM_ROUTES', routes });
      return true;
    }).catch(() => false);
  }

  function warmRoutes(values, options = {}) {
    const immediate = options.immediate === true;
    const force = options.force === true;
    let routes = Array.from(new Set((values || []).map(portalRoute).filter(Boolean)))
      .filter((route) => !warmedRoutes.has(route));

    if (!force && connectionIsConstrained()) {
      routes = routes.filter((route) => CORE_ROUTES.includes(route) || route === portalRoute(location.pathname));
    }
    if (!routes.length) return Promise.resolve(false);
    routes.forEach((route) => warmedRoutes.add(route));

    if (immediate) return postWarm(routes);
    return new Promise((resolve) => idle(() => postWarm(routes).then(resolve), Number(options.delay || 900)));
  }

  function documentsAccessAllowed(user) {
    const capabilities = user?.documentCapabilities || {};
    return Boolean(
      user
      && !user.mustChangePassword
      && !user.emailVerificationRequired
      && (capabilities.view === true || capabilities.manage === true)
    );
  }

  function documentsEndpoint() {
    try {
      return String(window.REGULATION_AUTH_CONFIG?.endpoint || '').replace(/\/$/, '');
    } catch (_) {
      return '';
    }
  }

  function documentsAuthorization() {
    const token = String(window.RegulationAuth?.getToken?.() || '');
    return token ? `Bearer ${token}` : '';
  }

  function activeWorker(registration) {
    return navigator.serviceWorker.controller
      || registration?.active
      || registration?.waiting
      || registration?.installing
      || null;
  }

  function clearDocumentsWarmTimer() {
    if (documentsWarmTimer) window.clearTimeout(documentsWarmTimer);
    documentsWarmTimer = null;
  }

  function scheduleDocumentsWarmRefresh() {
    clearDocumentsWarmTimer();
    documentsWarmTimer = window.setTimeout(() => {
      documentsWarmTimer = null;
      const user = window.RegulationAuth?.getCachedUser?.() || null;
      if (!documentsAccessAllowed(user)) return;
      warmDocumentsForUser(user, { scheduleRefresh: true }).catch(() => {});
    }, DOCUMENTS_WARM_REFRESH_MS);
  }

  async function warmDocumentsForUser(user, options = {}) {
    if (!documentsAccessAllowed(user)) {
      clearDocumentsWarmTimer();
      return false;
    }

    warmRoutes([DOCUMENTS_ROUTE], { immediate: true, force: true }).catch(() => {});
    const endpoint = documentsEndpoint();
    const authorization = documentsAuthorization();
    if (!endpoint || !authorization) return false;

    const registration = await register();
    const worker = activeWorker(registration);
    if (!worker) return false;

    worker.postMessage({
      type: 'PORTAL_WARM_DOCUMENTS',
      endpoint,
      authorization
    });

    if (options.scheduleRefresh !== false) scheduleDocumentsWarmRefresh();
    return true;
  }

  async function getDocumentWarmPayload(options = {}) {
    const user = window.RegulationAuth?.getCachedUser?.() || null;
    if (!documentsAccessAllowed(user) || typeof MessageChannel !== 'function') return null;

    const endpoint = documentsEndpoint();
    const authorization = documentsAuthorization();
    if (!endpoint || !authorization) return null;

    const registration = await register();
    const worker = activeWorker(registration);
    if (!worker) return null;

    const timeoutMs = Math.max(200, Math.min(15000, Number(options.timeoutMs || DOCUMENTS_WARM_GET_TIMEOUT_MS)));
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      let settled = false;
      const finish = (payload) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        try { channel.port1.close(); } catch (_) {}
        resolve(payload || null);
      };
      const timer = window.setTimeout(() => finish(null), timeoutMs);
      channel.port1.onmessage = (event) => finish(event.data?.ok === true ? event.data.payload : null);
      try {
        worker.postMessage({
          type: 'PORTAL_DOCUMENTS_WARM_GET',
          endpoint,
          authorization
        }, [channel.port2]);
      } catch (_) {
        finish(null);
      }
    });
  }

  function clearDocumentsWarm() {
    clearDocumentsWarmTimer();
    register().then((registration) => {
      const worker = activeWorker(registration);
      worker?.postMessage?.({ type: 'PORTAL_DOCUMENTS_WARM_CLEAR' });
    }).catch(() => {});
  }

  function routesForUser(user) {
    const routes = [...CORE_ROUTES];
    if (!user) return routes;

    if (!user.mustChangePassword && !user.emailVerificationRequired) routes.push(...SOCIAL_ROUTES);
    try {
      const cards = window.PortalTools?.cardsFor?.(user) || [];
      cards.forEach((card) => {
        const route = portalRoute(card?.href);
        if (route) routes.push(route);
      });
    } catch (_) {}
    return Array.from(new Set(routes));
  }

  function warmForUser(user, options = {}) {
    const all = routesForUser(user);
    const current = portalRoute(location.pathname);
    const first = Array.from(new Set([current, '/', '/ferramentas/'].filter(Boolean)));
    const rest = all.filter((route) => !first.includes(route));
    warmRoutes(first, { immediate: true, force: true });
    if (documentsAccessAllowed(user)) {
      warmDocumentsForUser(user, { scheduleRefresh: true }).catch(() => {});
    } else {
      clearDocumentsWarmTimer();
    }
    return warmRoutes(rest, {
      immediate: options.immediate === true,
      force: false,
      delay: options.immediate === true ? 0 : 900
    });
  }

  function eligibleLink(target) {
    const link = target?.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || link.target === '_blank') return null;
    return portalRoute(link.href);
  }

  function warmLink(event) {
    const route = eligibleLink(event.target);
    if (route) warmRoutes([route], { immediate: true, force: true });
  }

  function observeVisibleLinks() {
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const route = portalRoute(entry.target.href);
        if (route) warmRoutes([route], { delay: 300 });
      });
    }, { rootMargin: '320px 0px' });
    document.querySelectorAll('a[href]').forEach((link) => observer.observe(link));
  }

  function start() {
    ensurePwaClient();
    register();
    idle(ensureObservabilityClient, 900);
    const cachedUser = window.RegulationAuth?.getCachedUser?.() || null;
    if (cachedUser) warmForUser(cachedUser);
    else warmRoutes([location.pathname, '/login/', '/'], { delay: 250 });

    document.addEventListener('pointerover', warmLink, { capture: true, passive: true });
    document.addEventListener('focusin', warmLink, { capture: true });
    document.addEventListener('touchstart', warmLink, { capture: true, passive: true });
    idle(observeVisibleLinks, 350);

    window.addEventListener('pageshow', () => {
      const user = window.RegulationAuth?.getCachedUser?.() || null;
      if (user) warmForUser(user);
      window.dispatchEvent(new CustomEvent('portal:background-refresh'));
    });
  }

  window.addEventListener('portal:session-ready', (event) => {
    if (event.detail?.user) warmForUser(event.detail.user);
  });

  window.addEventListener('portal:session-cleared', () => {
    warmedRoutes.clear();
    clearDocumentsWarm();
  });

  window.PortalPerformance = Object.freeze({
    register,
    routesForUser,
    warmForUser,
    warmDocumentsForUser,
    getDocumentWarmPayload,
    warmRoute(value) {
      return warmRoutes([value], { immediate: true, force: true });
    },
    __test: Object.freeze({ portalRoute, connectionIsConstrained, documentsAccessAllowed })
  });

  ensurePwaClient();
  register();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
