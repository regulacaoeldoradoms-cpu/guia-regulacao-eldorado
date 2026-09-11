'use strict';

(() => {
  if (window.PortalPWA) return;

  const MANIFEST_URL = '/portal.webmanifest?v=20260910-2';
  const STYLE_URL = '/css/portal-pwa.css?v=20260910-1';
  const ICON_URL = '/assets/portal-regulacao-icon.webp?v=20260909-1';
  const INSTALL_DISMISS_KEY = 'regulacao.portal.pwa.install.dismissedAt';
  const PUSH_DISMISS_KEY = 'regulacao.portal.pwa.push.dismissedAt';
  const DISMISS_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

  let deferredInstallPrompt = null;
  let pushActive = false;
  let syncPromise = null;

  function addHeadLink(selector, attributes) {
    if (document.querySelector(selector)) return;
    const element = document.createElement('link');
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }

  function addMeta(name, content) {
    if (document.querySelector(`meta[name="${name}"]`)) return;
    const element = document.createElement('meta');
    element.name = name;
    element.content = content;
    document.head.appendChild(element);
  }

  function ensurePortalManifest() {
    const manifests = Array.from(document.querySelectorAll('link[rel="manifest"]'));
    let manifest = manifests.shift();
    if (!manifest) {
      manifest = document.createElement('link');
      manifest.rel = 'manifest';
      document.head.appendChild(manifest);
    }
    manifest.href = MANIFEST_URL;
    manifests.forEach((item) => item.remove());
  }

  function ensurePwaHead() {
    ensurePortalManifest();
    addHeadLink('link[rel="apple-touch-icon"]', { rel: 'apple-touch-icon', href: ICON_URL });
    addHeadLink('link[data-portal-pwa-style]', { rel: 'stylesheet', href: STYLE_URL, 'data-portal-pwa-style': 'true' });
    addMeta('theme-color', '#0d3157');
    addMeta('apple-mobile-web-app-capable', 'yes');
    addMeta('apple-mobile-web-app-status-bar-style', 'default');
    addMeta('apple-mobile-web-app-title', 'Portal Regulação');
  }

  function installed() {
    return Boolean(
      window.matchMedia?.('(display-mode: standalone)').matches
      || window.navigator.standalone === true
    );
  }

  function iosDevice() {
    return /iPad|iPhone|iPod/i.test(navigator.userAgent || '')
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function browserSupportsPush() {
    return 'serviceWorker' in navigator
      && 'PushManager' in window
      && 'Notification' in window;
  }

  function dismissedRecently(key) {
    try {
      const value = Number(localStorage.getItem(key) || 0);
      return value > 0 && Date.now() - value < DISMISS_WINDOW_MS;
    } catch (_) {
      return false;
    }
  }

  function dismiss(key) {
    try { localStorage.setItem(key, String(Date.now())); } catch (_) {}
    document.getElementById('portalPwaPrompt')?.remove();
  }

  function clearPrompt() {
    document.getElementById('portalPwaPrompt')?.remove();
  }

  function button(label, className, action) {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = `portal-pwa-action ${className}`;
    element.textContent = label;
    element.addEventListener('click', action);
    return element;
  }

  function renderPrompt({ title, text, primaryLabel = '', primaryAction = null, secondaryLabel = 'Agora não', dismissKey }) {
    clearPrompt();

    const card = document.createElement('aside');
    card.className = 'portal-pwa-card';
    card.id = 'portalPwaPrompt';
    card.setAttribute('role', 'status');
    card.setAttribute('aria-live', 'polite');

    const icon = document.createElement('img');
    icon.className = 'portal-pwa-icon';
    icon.src = ICON_URL;
    icon.alt = '';

    const copy = document.createElement('div');
    copy.className = 'portal-pwa-copy';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const description = document.createElement('p');
    description.textContent = text;
    copy.append(heading, description);

    const actions = document.createElement('div');
    actions.className = 'portal-pwa-actions';
    if (secondaryLabel) actions.appendChild(button(secondaryLabel, 'secondary', () => dismiss(dismissKey)));
    if (primaryLabel && primaryAction) {
      actions.appendChild(button(primaryLabel, 'primary', async (event) => {
        const target = event.currentTarget;
        target.disabled = true;
        try { await primaryAction(); }
        finally { if (target.isConnected) target.disabled = false; }
      }));
    }

    card.append(icon, copy, actions);
    document.body.appendChild(card);
  }

  function authState() {
    const auth = window.RegulationAuth;
    const config = window.REGULATION_AUTH_CONFIG || {};
    const endpoint = String(config.endpoint || '').replace(/\/$/, '');
    return { auth, endpoint };
  }

  async function api(path, options = {}) {
    const { auth, endpoint } = authState();
    if (!auth || !endpoint) throw new Error('Sessão do Portal ainda não disponível.');
    const headers = {
      'Content-Type': 'application/json',
      ...auth.authorizationHeader?.(),
      ...(options.headers || {})
    };
    const response = await fetch(`${endpoint}${path}`, {
      ...options,
      cache: 'no-store',
      headers
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || `Falha no Web Push (${response.status}).`);
      error.status = response.status;
      error.code = payload.code || '';
      throw error;
    }
    return payload;
  }

  function decodeApplicationServerKey(value) {
    const raw = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
    const padded = raw + '='.repeat((4 - (raw.length % 4 || 4)) % 4);
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  }

  function keysMatch(subscription, publicKey) {
    const current = subscription?.options?.applicationServerKey;
    if (!current) return false;
    const expected = decodeApplicationServerKey(publicKey);
    const actual = new Uint8Array(current);
    if (actual.length !== expected.length) return false;
    return actual.every((value, index) => value === expected[index]);
  }

  async function serviceWorkerRegistration() {
    const fromPerformance = await window.PortalPerformance?.register?.();
    if (fromPerformance) return fromPerformance;
    if (!('serviceWorker' in navigator)) return null;
    return navigator.serviceWorker.ready;
  }

  async function registerSubscription(subscription) {
    if (!subscription?.endpoint) return false;
    await api('/api/push/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime || null
      })
    });
    pushActive = true;
    return true;
  }

  async function syncPush({ createIfPermitted = false } = {}) {
    if (syncPromise) return syncPromise;
    syncPromise = (async () => {
      if (!browserSupportsPush() || Notification.permission !== 'granted') {
        pushActive = false;
        return false;
      }
      if (!window.RegulationAuth?.getCachedUser?.()) return false;

      const registration = await serviceWorkerRegistration();
      if (!registration?.pushManager) return false;

      const config = await api('/api/push/config', { method: 'GET' });
      if (!config?.enabled || !config.publicKey) return false;

      let subscription = await registration.pushManager.getSubscription();
      if (subscription && !keysMatch(subscription, config.publicKey)) {
        await subscription.unsubscribe().catch(() => false);
        subscription = null;
      }

      if (!subscription && createIfPermitted) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decodeApplicationServerKey(config.publicKey)
        });
      }

      if (!subscription) {
        pushActive = false;
        return false;
      }
      return registerSubscription(subscription);
    })().catch(() => {
      pushActive = false;
      return false;
    }).finally(() => {
      syncPromise = null;
    });
    return syncPromise;
  }

  async function enablePush({ requestPermission = true } = {}) {
    if (!browserSupportsPush()) return { ok: false, reason: 'unsupported' };
    if (iosDevice() && !installed()) {
      showIosInstallPrompt();
      return { ok: false, reason: 'ios-install-required' };
    }

    let permission = Notification.permission;
    if (permission === 'default' && requestPermission) permission = await Notification.requestPermission();
    if (permission !== 'granted') return { ok: false, reason: permission };

    const ok = await syncPush({ createIfPermitted: true });
    if (ok) {
      clearPrompt();
      try { localStorage.removeItem(PUSH_DISMISS_KEY); } catch (_) {}
      window.PortalInteractions?.notify?.('success', 'Notificações em segundo plano ativadas.');
    }
    return { ok, reason: ok ? '' : 'subscription-failed' };
  }

  async function detachCurrentSubscription() {
    if (!browserSupportsPush()) {
      pushActive = false;
      return true;
    }
    const registration = await serviceWorkerRegistration().catch(() => null);
    const subscription = registration?.pushManager
      ? await registration.pushManager.getSubscription().catch(() => null)
      : null;
    if (!subscription?.endpoint) {
      pushActive = false;
      return true;
    }

    const endpoint = subscription.endpoint;
    const locallyDetached = await subscription.unsubscribe().catch(() => false);
    pushActive = false;

    try {
      await api('/api/push/subscriptions', {
        method: 'DELETE',
        keepalive: true,
        body: JSON.stringify({ endpoint })
      });
      return true;
    } catch (_) {
      return locallyDetached;
    }
  }

  async function installApp() {
    if (!deferredInstallPrompt) return false;
    const prompt = deferredInstallPrompt;
    deferredInstallPrompt = null;
    await prompt.prompt();
    const choice = await prompt.userChoice.catch(() => null);
    if (choice?.outcome === 'accepted') {
      clearPrompt();
      return true;
    }
    return false;
  }

  function showInstallPrompt() {
    if (installed() || !deferredInstallPrompt || dismissedRecently(INSTALL_DISMISS_KEY)) return;
    renderPrompt({
      title: 'Instalar Portal Regulação',
      text: 'Abra como aplicativo, sem a barra do navegador, e deixe o Portal pronto para notificações em segundo plano.',
      primaryLabel: 'Instalar',
      primaryAction: installApp,
      secondaryLabel: 'Agora não',
      dismissKey: INSTALL_DISMISS_KEY
    });
  }

  function showIosInstallPrompt() {
    if (installed() || !iosDevice() || dismissedRecently(INSTALL_DISMISS_KEY)) return;
    renderPrompt({
      title: 'Adicionar o Portal à Tela de Início',
      text: 'No iPhone/iPad, toque em Compartilhar e depois em “Adicionar à Tela de Início”. Após abrir pelo ícone, ative as notificações.',
      secondaryLabel: 'Entendi',
      dismissKey: INSTALL_DISMISS_KEY
    });
  }

  function showPushPrompt() {
    if (!browserSupportsPush() || Notification.permission !== 'default') return;
    if (!window.RegulationAuth?.getCachedUser?.()) return;
    if (iosDevice() && !installed()) return;
    if (dismissedRecently(PUSH_DISMISS_KEY)) return;

    renderPrompt({
      title: 'Ativar notificações',
      text: 'Receba avisos do Portal mesmo quando ele estiver fechado. O alerta não exibe dados de pacientes nem conteúdo clínico.',
      primaryLabel: 'Ativar',
      primaryAction: () => enablePush({ requestPermission: true }),
      secondaryLabel: 'Agora não',
      dismissKey: PUSH_DISMISS_KEY
    });
  }

  function afterSessionReady() {
    if ('Notification' in window && Notification.permission === 'granted') {
      syncPush({ createIfPermitted: true });
      return;
    }
    if (installed()) window.setTimeout(showPushPrompt, 700);
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    window.setTimeout(showInstallPrompt, 80);
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    clearPrompt();
    try { localStorage.removeItem(INSTALL_DISMISS_KEY); } catch (_) {}
    window.setTimeout(showPushPrompt, 700);
  });

  window.addEventListener('portal:session-ready', afterSessionReady);
  window.addEventListener('portal:session-cleared', () => {
    pushActive = false;
    clearPrompt();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type !== 'PORTAL_PUSH_RECEIVED') return;
      window.dispatchEvent(new CustomEvent('portal:background-refresh', {
        detail: { source: 'push' }
      }));
    });
  }

  ensurePwaHead();

  window.PortalPWA = Object.freeze({
    install: installApp,
    enablePush,
    syncPush,
    detachCurrentSubscription,
    isInstalled: installed,
    hasActivePush: () => pushActive,
    __test: Object.freeze({
      decodeApplicationServerKey,
      keysMatch
    })
  });

  const start = () => {
    if (!installed() && iosDevice()) window.setTimeout(showIosInstallPrompt, 900);
    const user = window.RegulationAuth?.getCachedUser?.() || null;
    if (user) afterSessionReady();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
