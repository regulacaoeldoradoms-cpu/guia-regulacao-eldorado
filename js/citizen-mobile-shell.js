'use strict';

// Explicit route lifecycles. Fetched HTML supplies markup/styles, never scripts.
(() => {
  if (window.PortalCitizenShell) return;
  const screen = matchMedia('screen and (max-width: 900px)');
  const print = matchMedia('print');
  const user = window.RegulationAuth?.getCachedUser?.();
  if (!screen.matches || print.matches || user?.role !== 'cidadao') return;
  const KEY = '__portalCitizenRoute';
  const entries = {
    '/': ['social-home', 'home'],
    '/amigos/': ['social-friends'],
    '/mascotes/': ['pets-page'],
    '/perfil/': ['social-profile'],
    '/ferramentas/': ['tools'],
    '/notificacoes/': ['social-notifications'],
    '/seguranca/': ['security'],
    '/configuracoes/': ['settings'],
    '/conquistas/': ['achievements', 'pets-achievements'],
    '/cidadao/': ['citizen', 'citizen-declaration', 'citizen-account-level', 'citizen-mobile-app']
  };
  const sharedStyles = new Set(['portal', 'profile-account-link', 'portal-chat', 'portal-interactions',
    'social', 'social-notification-panel', 'citizen-readable-layout', 'citizen-mobile-navigation',
    'home-mobile-direct', 'pets', 'citizen-mobile-shell']);
  const factories = new Map(), areas = new Map(), resources = new Map(), preparations = new Map();
  const preparationAbort = new AbortController();
  const primaryRoutes = ['/', '/amigos/', '/perfil/', '/mascotes/', '/notificacoes/'];
  const backgroundControllers = new Set(['/amigos/', '/perfil/', '/notificacoes/', '/mascotes/']);
  let prewarming = false, prewarmTimer = 0;
  const sessionToken = window.RegulationAuth.getToken();
  const sessionIdentity = String(user.id || user.username || '');
  let active, ended = false, navigating = false, wanted = null;
  const valid = () => !ended && window.RegulationAuth?.getToken?.() === sessionToken;
  const enabled = () => valid() && screen.matches && !print.matches;
  const routeKey = url => url.pathname + url.search;
  const bodyState = () => [...document.body.attributes].filter(attr => attr.name === 'class' || ['data-portal-home-bootstrap', 'data-citizen-mobile-chat-only', 'data-citizen-tab'].includes(attr.name)).map(attr => [attr.name, attr.value]);
  const initialUrl = new URL(location.href);
  if (!entries[initialUrl.pathname]) return;
  const chrome = selector => /portal-topbar|portal-user|portal-brand|social-(mobile|global)-nav|social-nav-badge|social(?:Confirm|Report)Dialog/.test(selector);

  function context(url, root) {
    const state = { url, root, active: true, disposed: false, listeners: [], timers: new Set(), frames: new Set(), controllers: [], ready: Promise.resolve(), scroll: [0, 0], styles: [], requests: new Set(), abort: new AbortController() };
    const eventAPI = target => ({
      addEventListener(type, handler, options) {
        const wrapped = event => {
          if (valid() && !state.disposed && state.active) {
            if (typeof handler === 'function') handler.call(target, event); else handler.handleEvent(event);
          }
        };
        state.listeners.push([target, type, handler, wrapped, options]);
        target.addEventListener(type, wrapped, options);
      },
      removeEventListener(type, handler, options) {
        for (const item of state.listeners.filter(item => item[0] === target && item[1] === type && item[2] === handler)) {
          target.removeEventListener(type, item[3], options);
          state.listeners.splice(state.listeners.indexOf(item), 1);
        }
      }
    });
    const docEvents = eventAPI(document), winEvents = eventAPI(window);
    state.document = new Proxy(document, { get(target, key) {
      if (key in docEvents) return docEvents[key];
      if (key === 'getElementById') return id => root.querySelector(`#${CSS.escape(id)}`)
        || (/^(portalUserName|portalUserRole|portalLogout|homeAccountMenu|homeAccountPanel|socialShortcutLimit|socialShortcutLimitControl)$/.test(id) ? target.getElementById(id) : null);
      if (key === 'querySelector') return selector => root.querySelector(selector) || (chrome(selector) ? target.querySelector(selector) : null);
      if (key === 'querySelectorAll') return selector => chrome(selector) ? target.querySelectorAll(selector) : root.querySelectorAll(selector);
      const value = Reflect.get(target, key, target);
      return typeof value === 'function' ? value.bind(target) : value;
    } });
    state.social = { ...window.PortalSocial,
      status: (message, type, node) => window.PortalSocial.status(message, type, node || root.querySelector('#socialStatus')),
      api: async (...args) => {
        if (!valid() || state.disposed) throw new DOMException('Sessão encerrada', 'AbortError');
        const pending = window.PortalSocial.api(args[0], { ...args[1], signal: state.abort.signal });
        state.requests.add(pending);
        let value;
        try { value = await pending; } finally { state.requests.delete(pending); }
        if (!valid() || state.disposed) throw new DOMException('Sessão encerrada', 'AbortError');
        return value;
      }
    };
    state.window = new Proxy(window, { get(target, key) {
      if (key in winEvents) return winEvents[key];
      if (key === 'PortalSocial') return state.social;
      if (key === 'PortalSocialNavigation' && target[key]) return { ...target[key], mount: (...args) => { if (state.active && valid()) return target[key].mount(...args); } };
      if (key === 'PortalAccountSection' && target[key]) return { ...target[key], mount: options => target[key].mount({ ...options, navigation: state.active && !document.querySelector('.social-mobile-nav') ? options?.navigation : false, root, document: state.document, route: state.url, isCurrent: () => !state.disposed && valid() }) };
      if (key === 'setTimeout') return (fn, delay, ...args) => {
        const id = target.setTimeout(() => { state.timers.delete(id); if (valid() && !state.disposed && state.active) fn(...args); }, delay);
        state.timers.add(id); return id;
      };
      if (key === 'requestAnimationFrame') return fn => {
        const id = target.requestAnimationFrame(time => { state.frames.delete(id); if (valid() && !state.disposed && state.active) fn(time); });
        state.frames.add(id); return id;
      };
      const value = Reflect.get(target, key, target);
      return typeof value === 'function' ? value.bind(target) : value;
    }, set(target, key, value) { target[key] = value; return true; } });
    state.addController = controller => { if (controller) state.controllers.push(controller); };
    state.MutationObserver = class extends MutationObserver {
      constructor(callback) { super((records, observer) => { if (valid() && !state.disposed && state.active) callback(records, observer); }); state.controllers.push({ dispose: () => this.disconnect() }); }
    };
    state.dispose = () => {
      state.disposed = true; state.active = false;
      state.abort.abort();
      window.PortalSocialFeed?.release?.(root);
      state.listeners.forEach(([target, type, , handler, options]) => target.removeEventListener(type, handler, options));
      state.timers.forEach(clearTimeout);
      state.frames.forEach(cancelAnimationFrame);
      state.controllers.forEach(controller => controller.dispose?.());
      root.remove();
      root.querySelectorAll('input, textarea').forEach(node => { node.value = ''; });
      Promise.allSettled([state.ready, ...state.requests]).then(() => root.replaceChildren());
    };
    return state;
  }

  function adopt(doc) {
    const root = document.createElement('div');
    root.className = 'citizen-route-area';
    const nodes = [...doc.querySelectorAll('main, dialog, .citizen-modal')].filter(node => !node.parentElement?.closest('main, dialog, .citizen-modal'));
    for (const node of nodes) root.append(node);
    return root;
  }
  const firstMain = document.querySelector('main');
  const sharedBrand = document.querySelector('.portal-topbar .portal-brand');
  const brandMarker = document.createComment('Persistent mobile brand');
  sharedBrand?.before(brandMarker);
  const marker = document.createComment('Citizen active area');
  firstMain.before(marker);
  const firstRoot = adopt(document);
  marker.after(firstRoot);
  if (initialUrl.pathname === '/' && firstRoot.querySelector('#socialHome')) document.body.dataset.portalHomeBootstrap = '1';
  active = context(initialUrl, firstRoot);
  active.title = document.title;
  active.desktopBrand = sharedBrand?.cloneNode(true);
  active.attributes = bodyState();
  areas.set(routeKey(initialUrl), active);
  document.body.classList.add('citizen-mobile-shell');
  history.replaceState({ ...history.state, [KEY]: routeKey(initialUrl) }, '', location.href);
  history.scrollRestoration = 'manual';

  const name = href => new URL(href, location.href).pathname.split('/').pop().replace(/\.css$/, '');
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (!sharedStyles.has(name(link.href))) active.styles.push(link);
  }
  function loadScript(path, module = false) {
    if (resources.has(path)) return resources.get(path);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const finish = error => {
        clearTimeout(timeout);
        preparationAbort.signal.removeEventListener('abort', aborted);
        if (error) { script.remove(); reject(error); } else resolve();
      };
      const aborted = () => finish(new DOMException('Sessão encerrada', 'AbortError'));
      const timeout = setTimeout(() => finish(new Error('Não foi possível carregar esta área.')), 15000);
      preparationAbort.signal.addEventListener('abort', aborted, { once:true });
      if (module) script.type = 'module';
      script.src = path; script.onload = () => finish();
      script.onerror = () => finish(new Error('Não foi possível carregar esta área.'));
      document.head.append(script);
    }).catch(error => { resources.delete(path); throw error; });
    resources.set(path, promise); return promise;
  }
  async function styles(doc, area) {
    await Promise.all([...doc.querySelectorAll('link[rel="stylesheet"]')].map(async source => {
      if (sharedStyles.has(name(source.href))) return;
      const href = new URL(source.getAttribute('href'), location.origin).href;
      let link = [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href === href);
      if (!link) {
        link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href; link.media = 'not all';
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => { link.remove(); reject(new Error('Não foi possível carregar o visual desta área.')); }, 15000);
          link.onload = () => { clearTimeout(timeout); resolve(); };
          link.onerror = () => { clearTimeout(timeout); link.remove(); reject(new Error('Não foi possível carregar o visual desta área.')); };
          document.head.append(link);
        });
        link.disabled = true;
        link.removeAttribute('media');
      }
      area.styles.push(link);
    }));
  }
  async function prepare(url) {
    const key = routeKey(url);
    if (areas.has(key)) return areas.get(key);
    if (preparations.has(key)) return preparations.get(key);
    const pending = buildArea(url).finally(() => preparations.delete(key));
    preparations.set(key, pending);
    return pending;
  }
  async function buildArea(url) {
    const key = routeKey(url);
    if (areas.size >= 16) {
      const removable = [...areas.values()].find(area => area !== active && !area.dirty && !['/', '/mascotes/'].includes(area.url.pathname));
      if (!removable) throw new Error('Conclua os rascunhos abertos antes de abrir outro perfil.');
      areas.delete(routeKey(removable.url)); removable.dispose();
    }
    const controller = new AbortController();
    const abort = () => controller.abort();
    preparationAbort.signal.addEventListener('abort', abort, { once:true });
    const timeout = setTimeout(abort, 15000);
    let markup;
    try {
      if (!valid()) throw new DOMException('Sessão encerrada', 'AbortError');
      const response = await fetch(url.pathname + url.search, { credentials: 'same-origin', signal: controller.signal });
      if (!response.ok || !valid()) throw new Error('Não foi possível abrir esta área. Tente novamente.');
      markup = await response.text();
    } finally { clearTimeout(timeout); preparationAbort.signal.removeEventListener('abort', abort); }
    const doc = new DOMParser().parseFromString(markup, 'text/html');
    const root = adopt(doc);
    // Only known repository markup is mounted. Executable attributes/scripts are excluded.
    root.querySelectorAll('script, iframe, object, embed').forEach(node => node.remove());
    root.querySelectorAll('*').forEach(node => [...node.attributes].forEach(attr => {
      if (/^on/i.test(attr.name) || /^(href|src)$/i.test(attr.name) && /^javascript:/i.test(attr.value)) node.removeAttribute(attr.name);
    }));
    const area = context(url, root); area.active = false; area.title = doc.title;
    area.desktopBrand = doc.querySelector('.portal-topbar .portal-brand')?.cloneNode(true);
    root.addEventListener('input', () => { area.dirty = true; });
    area.attributes = [...doc.body.attributes].filter(attr => attr.name !== 'style').map(attr => [attr.name, attr.value]);
    try {
    await styles(doc, area);
    const dependencies = ['/js/account-section-shell.js?v=20261010-citizen-prewarm-1'];
    if (['/', '/perfil/'].includes(url.pathname)) dependencies.push('/js/social-feed.js?v=20261010-mobile-shell-1');
    if (['/cidadao/', '/conquistas/'].includes(url.pathname)) dependencies.push('/js/account-levels.js?v=20261010-mobile-shell-1');
    for (const path of dependencies) {
      const api = path.includes('account-section-shell') ? window.PortalAccountSection : path.includes('social-feed') ? window.PortalSocialFeed : window.AccountLevels;
      if (!api) await loadScript(path);
    }
    for (const entry of entries[url.pathname]) {
      if (!factories.has(entry)) await loadScript(`/js/${entry}.js?v=20261010-citizen-prewarm-1`, entry.startsWith('pets-'));
    }
    if (!valid()) { area.dispose(); throw new DOMException('Sessão encerrada', 'AbortError'); }
    areas.set(key, area); return area;
    } catch (error) { area.dispose(); throw error; }
  }

  function initialize(area) {
    if (area.initialized) return area.ready;
    area.initialized = true;
    area.ready = (async () => {
      for (const entry of entries[area.url.pathname]) {
        const pending = factories.get(entry)?.(area);
        if (entry === 'home') window.PortalHomeReady = Promise.resolve(pending);
        await pending;
      }
      area.loaded = true;
    })().catch(error => { area.failed = true; throw error; });
    return area.ready;
  }

  // One background area at a time, only after the initial document is ready.
  // This is session memory; it never expands access or visits arbitrary profiles.
  async function prewarm() {
    prewarmTimer = 0;
    if (prewarming || !enabled() || document.hidden || !navigator.onLine || navigating) return;
    prewarming = true;
    try {
      if (!entries[initialUrl.pathname].every(entry => factories.has(entry))) return;
      await active.ready;
      active.loaded = true;
      const user = await window.RegulationAuth.requireRole([]);
      if (!valid() || user?.role !== 'cidadao' || user.mustChangePassword) return;
      for (const path of primaryRoutes) {
        if (!enabled() || document.hidden || !navigator.onLine || navigating) break;
        let area;
        try {
          area = await prepare(new URL(path, location.origin));
          await window.PortalCitizenLayout?.prepareRoute?.(path);
          if (area !== active && backgroundControllers.has(path)) await initialize(area);
        } catch (_) {
          // Background failure is silent. A tap retains the normal retry path.
          if (area?.failed && area !== active) { areas.delete(path); area.dispose(); }
        }
      }
    } catch (_) { /* Session/access failure leaves the current native gate in charge. */ }
    finally { prewarming = false; }
  }
  function schedulePrewarm() {
    if (!valid() || document.readyState !== 'complete' || prewarmTimer || prewarming) return;
    prewarmTimer = setTimeout(prewarm, 250);
  }

  function activate(area) {
    const preserved = ['citizen-readable-layout', 'shared-mobile-navigation', 'has-social-navigation'];
    const previous = preserved.filter(cls => document.body.classList.contains(cls));
    document.body.removeAttribute('data-portal-home-bootstrap');
    document.body.removeAttribute('data-citizen-mobile-chat-only');
    document.body.removeAttribute('data-citizen-tab');
    const attrs = Object.fromEntries(area.attributes);
    document.body.className = attrs.class || 'portal-page';
    document.body.classList.add(...previous);
    document.body.classList.toggle('citizen-mobile-shell', enabled());
    if (area.url.pathname === '/' && screen.matches) document.body.classList.add('mobile-home-mode');
    if (area.url.pathname === '/cidadao/' && screen.matches) document.body.classList.add('mobile-citizen-mode');
    for (const [key, value] of area.attributes) if (key.startsWith('data-')) document.body.setAttribute(key, value);
    document.title = area.title;
    syncBrand();
    area.styles.forEach(link => { link.disabled = false; });
    area.active = true; marker.after(area.root);
    window.PortalPets?.runtime?.attachHabitat?.(area.root.querySelector('#petHabitat'));
    area.dialogs?.forEach(dialog => { if (dialog.isConnected && !dialog.open) dialog.showModal(); });
    area.controllers.forEach(controller => controller.activate?.());
    updateNavigation();
    window.dispatchEvent(new CustomEvent('portal:citizen-route', { detail: { url: area.url.pathname + area.url.search } }));
  }
  function deactivate(area) {
    area.scroll = [scrollX, scrollY];
    area.focus = area.root.contains(document.activeElement) ? document.activeElement : null;
    area.controllers.forEach(controller => controller.deactivate?.());
    area.attributes = bodyState();
    area.dialogs = [...area.root.querySelectorAll('dialog[open]')];
    area.dialogs.forEach(dialog => dialog.close());
    if (area.root.contains(window.PortalPets?.runtime?.root)) window.PortalPets.runtime.attachHabitat(null);
    window.PortalSocialFeed?.suspend?.(area.root.querySelector('#socialFeedMore, #profilePostsMore'));
    area.active = false; area.root.remove();
    area.styles.forEach(link => { link.disabled = true; });
  }
  function updateNavigation() {
    document.querySelectorAll('.social-mobile-nav a, .social-global-nav a').forEach(link => {
      if (new URL(link.href).pathname === location.pathname) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    window.PortalCitizenLayout?.apply(window.RegulationAuth.getCachedUser());
  }
  async function gate(url) {
    const user = await window.RegulationAuth.requireRole([], { deniedPath: '/' });
    if (!user || !valid()) return false;
    if (url.pathname === '/cidadao/' && user.role === 'cidadao' && ['presidente', 'membro'].includes(user.councilRole)) {
      location.replace('/conselho/painel/'); return false;
    }
    return true;
  }
  const notice = document.createElement('div'); notice.className = 'citizen-route-notice'; notice.hidden = true;
  notice.setAttribute('role', 'status'); notice.setAttribute('aria-live', 'polite'); marker.before(notice);
  async function navigate(url, pop = false) {
    if (!entries[url.pathname] || !valid() || !pop && !enabled()) return false;
    if (navigating) { wanted = { url, pop }; return true; }
    navigating = true;
    const retained = areas.get(routeKey(url));
    notice.hidden = Boolean(retained?.loaded && !retained.failed); notice.textContent = 'Carregando…';
    notice.setAttribute('aria-busy', 'true');
    const previous = active;
    let previousHistory;
    try {
      await previous.ready;
      if (!(await gate(url))) return true;
      const direct = window[Symbol.for('portal.homeMobileDirect')];
      if (document.getElementById('portalChatRoot')?.classList.contains('open')) await direct?.closeToPage?.();
      previousHistory = { ...history.state, [KEY]:routeKey(previous.url), __portalHomeDirect:undefined };
      const area = await prepare(url);
      if (!valid()) return true;
      if (wanted) return true;
      if (area !== active) deactivate(active);
      active = area;
      // Give native route gates/controllers the intended URL while mounting,
      // and add the new Back entry only after initialization succeeds.
      history.replaceState({ ...history.state, [KEY]:routeKey(url), __portalHomeDirect:undefined }, '', url.pathname + url.search + url.hash);
      activate(area);
      await window.PortalCitizenLayout?.enterRoute?.();
      await initialize(area);
      const destination = active.url;
      const destinationState = { ...history.state, [KEY]:routeKey(destination) };
      if (!pop && !wanted?.pop) {
        history.replaceState(previousHistory, '', previous.url.pathname + previous.url.search + previous.url.hash);
        history.pushState(destinationState, '', destination.pathname + destination.search + destination.hash);
      }
      window.PortalSocialFeed?.resume?.(area.root.querySelector('#socialFeedMore, #profilePostsMore'));
      window.PortalPets?.runtime?.attachHabitat?.(area.root.querySelector('#petHabitat'));
      await new Promise(requestAnimationFrame);
      window.scrollTo(...area.scroll);
      const focus = area.focus?.isConnected ? area.focus : area.root.querySelector('h1, h2');
      if (focus) { if (!focus.hasAttribute('tabindex')) focus.tabIndex = -1; focus.focus({ preventScroll: true }); }
      notice.hidden = true;
      startUpdates();
    } catch (error) {
      if (!valid()) return true;
      if (active !== previous) {
        const failed = active;
        deactivate(failed);
        if (failed.failed) { areas.delete(routeKey(failed.url)); failed.dispose(); }
        active = previous;
        history.replaceState(previousHistory, '', previous.url.pathname + previous.url.search + previous.url.hash);
        activate(previous);
        window.scrollTo(...previous.scroll);
      }
      notice.textContent = error.message || 'Não foi possível abrir esta área.';
      const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Tentar novamente';
      retry.addEventListener('click', () => navigate(url, pop), { once: true }); notice.append(retry);
    } finally {
      notice.setAttribute('aria-busy', 'false'); navigating = false;
      const next = wanted; wanted = null; if (next && valid()) void navigate(next.url, next.pop);
      else schedulePrewarm();
    }
    return true;
  }

  // Bubble phase allows native Chat's capture handler to consume Início first.
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!enabled() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || !link || link.hasAttribute('download') || link.target && link.target !== '_self') return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !entries[url.pathname] || url.hash && routeKey(url) === routeKey(active.url)) return;
    event.preventDefault(); if (routeKey(url) !== routeKey(active.url)) void navigate(url);
  });
  window.addEventListener('popstate', () => {
    if (!valid()) return;
    const url = new URL(location.href);
    if (routeKey(url) !== routeKey(active.url) && entries[url.pathname]) void navigate(url, true);
  });
  function syncBrand() {
    if (!sharedBrand || !brandMarker.parentNode) return;
    const next = screen.matches && !print.matches ? sharedBrand : active.desktopBrand;
    if (!next) return;
    const current = brandMarker.nextSibling;
    if (current !== next) { current?.remove(); brandMarker.after(next); }
  }
  const syncMedia = () => { document.body.classList.toggle('citizen-mobile-shell', enabled()); syncBrand(); };
  screen.addEventListener('change', syncMedia);
  print.addEventListener('change', syncMedia);
  window.addEventListener('beforeprint', () => document.body.classList.remove('citizen-mobile-shell'));
  window.addEventListener('afterprint', syncMedia);
  function dispose() {
    if (ended) return; ended = true; wanted = null;
    clearTimeout(prewarmTimer); preparationAbort.abort();
    areas.forEach(area => area.dispose()); areas.clear(); notice.remove();
    window.PortalSocialFeed?.clear?.();
    clearTimeout(updateTimer); updateController?.abort();
  }
  window.addEventListener('portal:session-cleared', event => {
    if (ended) return;
    dispose();
    // A replacement token already exists: create a fresh gated Home document
    // directly instead of sending it through Login's authenticated redirect.
    location.replace(event.detail?.replacementSession ? '/' : '/login/');
  });
  window.addEventListener('portal:session-ready', event => {
    if (ended) return;
    const user = event.detail?.user || window.RegulationAuth.getCachedUser();
    if (!valid() || String(user?.id || user?.username || '') !== sessionIdentity) {
      // Native owners must clear old drafts before pagehide can persist a
      // snapshot under the replacement account's credentials.
      window.dispatchEvent(new CustomEvent('portal:session-cleared', { detail:{ replacementSession:Boolean(window.RegulationAuth.getToken()) } }));
    }
  });
  window.PortalCitizenShell = Object.freeze({
    enabled, active: () => active, updateNavigation, navigate,
    canonicalize(path) {
      const url = new URL(path, location.href);
      if (!entries[url.pathname] || url.origin !== location.origin) return;
      areas.delete(routeKey(active.url)); active.url = url; areas.set(routeKey(url), active);
      history.replaceState({ ...history.state, [KEY]: routeKey(url) }, '', url.pathname + url.search + url.hash);
    },
    register(entry, initialize) {
      if (!valid()) return Promise.resolve();
      factories.set(entry, initialize);
      if (entries[initialUrl.pathname].includes(entry)) {
        const ready = Promise.resolve().then(() => initialize(active));
        active.ready = Promise.all([active.ready, ready]); active.initialized = true;
        active.ready.then(schedulePrewarm, () => {});
        return ready;
      }
      return Promise.resolve();
    },
    diagnostics: () => ({ routes: areas.size, active: routeKey(active.url), navigating, ended, prewarming,
      prepared: primaryRoutes.filter(path => areas.has(path)), ready: primaryRoutes.filter(path => areas.get(path)?.loaded && !areas.get(path)?.failed),
      updateScheduled: Boolean(updateTimer), updateRunning })
  });
  const logout = document.getElementById('portalLogout');
  if (logout) {
    logout.dataset.accountSectionBound = 'true';
    // session-cleared owns the single native login navigation.
    logout.addEventListener('click', async () => { await window.RegulationAuth.logout(); });
  }
  active.root.addEventListener('input', () => { active.dirty = true; });
  let updateTimer = 0, updateRunning = false, updateController = null, failures = 0;
  async function updates() {
    updateTimer = 0;
    if (!valid() || document.hidden || !navigator.onLine || updateRunning) return;
    updateRunning = true; updateController = new AbortController();
    try {
      const config = await window.PortalSocial.api('/api/social/config', { signal: updateController.signal });
      if (!valid()) return;
      if (config.available) {
        if (!document.querySelector('.social-mobile-nav')) window.PortalSocialNavigation?.mount(window.RegulationAuth.getCachedUser(), config);
        window.PortalSocialNavigation?.setNotificationBadges(config.unreadSocialNotifications || 0);
        const panel = document.querySelector('.social-notification-panel:not([hidden])');
        if (panel || active.url.pathname === '/notificacoes/') {
          const payload = await window.PortalSocial.api('/api/social/notifications', { signal: updateController.signal });
          if (!valid()) return;
          if (panel?.isConnected && !panel.hidden) window.PortalSocialNavigation.renderNotificationItems(panel, payload.notifications || [], true);
          window.dispatchEvent(new CustomEvent('portal:citizen-notifications', { detail: payload }));
        }
        const home = areas.get('/');
        if (home?.root.querySelector('#socialFeedList')) await window.PortalSocialFeed?.checkNew?.(home.root, { signal: updateController.signal });
      }
      failures = 0;
    } catch (error) { if (error.name !== 'AbortError') failures++; }
    finally {
      updateRunning = false; updateController = null;
      if (valid() && !document.hidden && navigator.onLine) updateTimer = setTimeout(updates, Math.min(120000, 30000 * 2 ** Math.min(failures, 2)));
    }
  }
  function startUpdates() { if (!updateTimer && !updateRunning && valid()) updateTimer = setTimeout(updates, 1000); }
  function resumeUpdates() {
    clearTimeout(updateTimer); updateTimer = 0;
    if (document.hidden || !navigator.onLine) { updateController?.abort(); return; }
    if (!updateRunning) void updates();
  }
  document.addEventListener('visibilitychange', resumeUpdates);
  window.addEventListener('online', resumeUpdates);
  window.addEventListener('offline', resumeUpdates);
  window.addEventListener('focus', resumeUpdates);
  active.ready.then(startUpdates);
  if (document.readyState === 'complete') schedulePrewarm();
  else window.addEventListener('load', schedulePrewarm, { once: true });
  document.addEventListener('visibilitychange', schedulePrewarm);
  window.addEventListener('online', schedulePrewarm);
})();
