'use strict';

(async () => {
  const OPENING_ASSET = '/assets/portal-opening-v1.mp4?v=20260917-1';
  const OPENING_CACHE = 'portal-opening-media-v1';
  const OPENING_CACHE_PREFIX = 'portal-opening-media-';
  const OPENING_FADE_MS = 450;

  function installOpeningStyles() {
    if (document.getElementById('portalOpeningStyles')) return;
    const style = document.createElement('style');
    style.id = 'portalOpeningStyles';
    style.textContent = `
      body.portal-opening-active { overflow: hidden; background: #000; }
      .portal-opening {
        position: fixed;
        inset: 0;
        z-index: 2147482000;
        display: grid;
        place-items: stretch;
        background: #000;
        opacity: 1;
        transition: opacity ${OPENING_FADE_MS}ms ease;
      }
      .portal-opening.is-leaving { opacity: 0; pointer-events: none; }
      .portal-opening-video {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        background: #000;
      }
      .portal-opening-sound-gate {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(0, 0, 0, .32);
      }
      .portal-opening-sound-gate[hidden] { display: none !important; }
      .portal-opening-sound-button {
        min-height: 54px;
        padding: 14px 22px;
        border: 1px solid rgba(255, 255, 255, .9);
        border-radius: 14px;
        background: rgba(8, 33, 57, .92);
        color: #fff;
        font: 700 1rem/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-shadow: 0 12px 36px rgba(0, 0, 0, .3);
        cursor: pointer;
      }
      .portal-opening-sound-button:focus-visible {
        outline: 3px solid #fff;
        outline-offset: 4px;
      }
      @media (prefers-reduced-motion: reduce) {
        .portal-opening { transition: none; }
      }
      @media (forced-colors: active) {
        .portal-opening-sound-button { border: 2px solid ButtonText; }
      }
    `;
    document.head.appendChild(style);
  }

  function openingRequested() {
    return window.__PORTAL_POST_LOGIN_OPENING_PENDING__ === true;
  }

  function createOpeningSurface() {
    installOpeningStyles();
    const root = document.createElement('section');
    root.className = 'portal-opening';
    root.id = 'portalOpening';
    root.setAttribute('aria-label', 'Abertura do Portal');
    root.setAttribute('aria-live', 'polite');

    const video = document.createElement('video');
    video.className = 'portal-opening-video';
    video.id = 'portalOpeningVideo';
    video.preload = 'auto';
    video.playsInline = true;
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    video.setAttribute('playsinline', '');

    const gate = document.createElement('div');
    gate.className = 'portal-opening-sound-gate';
    gate.id = 'portalOpeningSoundGate';
    gate.hidden = true;

    const startButton = document.createElement('button');
    startButton.className = 'portal-opening-sound-button';
    startButton.id = 'portalOpeningStartWithSound';
    startButton.type = 'button';
    startButton.textContent = 'Iniciar abertura com som';
    gate.appendChild(startButton);

    root.append(video, gate);
    document.body.appendChild(root);
    document.body.classList.add('portal-opening-active');
    return { root, video, gate, startButton };
  }

  async function deleteOldOpeningCaches() {
    if (!('caches' in window)) return;
    try {
      const names = await caches.keys();
      await Promise.all(names
        .filter((name) => name.startsWith(OPENING_CACHE_PREFIX) && name !== OPENING_CACHE)
        .map((name) => caches.delete(name)));
    } catch (_) {
      // Cache é apenas otimização; falhas nunca bloqueiam o Portal.
    }
  }

  async function cachedOpeningBlobUrl() {
    if (!('caches' in window)) return '';
    try {
      const cache = await caches.open(OPENING_CACHE);
      const response = await cache.match(OPENING_ASSET);
      if (!response?.ok) return '';
      const blob = await response.blob();
      if (!blob.size) return '';
      return URL.createObjectURL(blob);
    } catch (_) {
      return '';
    }
  }

  async function cacheOpeningAfterPlayback() {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open(OPENING_CACHE);
      if (await cache.match(OPENING_ASSET)) return;
      const response = await fetch(OPENING_ASSET, {
        credentials: 'same-origin',
        cache: 'force-cache'
      });
      if (response.ok) await cache.put(OPENING_ASSET, response.clone());
      await deleteOldOpeningCaches();
    } catch (_) {
      // O vídeo continua disponível pela rede/HTTP cache se Cache Storage falhar.
    }
  }

  async function evictOpeningCache() {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open(OPENING_CACHE);
      await cache.delete(OPENING_ASSET);
    } catch (_) {
      // Falha de limpeza não deve interferir no fallback visual.
    }
  }

  function startPostLoginOpening() {
    if (!openingRequested()) {
      document.body.classList.remove('post-login-opening-pending');
      return;
    }

    const { root, video, gate, startButton } = createOpeningSurface();
    let objectUrl = '';
    let usingCachedSource = false;
    let retriedNetwork = false;
    let finished = false;

    const releaseObjectUrl = () => {
      if (!objectUrl) return;
      URL.revokeObjectURL(objectUrl);
      objectUrl = '';
    };

    const finalize = () => {
      if (finished) return;
      finished = true;
      root.classList.add('is-leaving');
      const remove = () => {
        releaseObjectUrl();
        video.pause();
        root.remove();
        document.body.classList.remove('portal-opening-active', 'post-login-opening-pending');
        window.__PORTAL_POST_LOGIN_OPENING_PENDING__ = false;
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) remove();
      else window.setTimeout(remove, OPENING_FADE_MS + 40);
    };

    const playWithSound = async () => {
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      try {
        await video.play();
        gate.hidden = true;
        return true;
      } catch (error) {
        if (error?.name === 'NotAllowedError') {
          gate.hidden = false;
          startButton.focus({ preventScroll: true });
          return false;
        }
        finalize();
        return false;
      }
    };

    const useNetworkSource = async () => {
      usingCachedSource = false;
      releaseObjectUrl();
      video.src = OPENING_ASSET;
      video.load();
      await playWithSound();
    };

    startButton.addEventListener('click', () => {
      void playWithSound();
    });

    video.addEventListener('ended', () => {
      void cacheOpeningAfterPlayback();
      finalize();
    }, { once: true });

    video.addEventListener('error', () => {
      if (usingCachedSource && !retriedNetwork) {
        retriedNetwork = true;
        void (async () => {
          await evictOpeningCache();
          await useNetworkSource();
        })();
        return;
      }
      finalize();
    });

    void (async () => {
      await deleteOldOpeningCaches();
      const cachedUrl = await cachedOpeningBlobUrl();
      if (cachedUrl) {
        objectUrl = cachedUrl;
        usingCachedSource = true;
        video.src = cachedUrl;
        video.load();
        await playWithSound();
        return;
      }
      await useNetworkSource();
    })();
  }

  startPostLoginOpening();

  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  // Compatibilidade das suítes históricas: requireRole(['medico', 'recepcao', 'coordenacao', 'telemedicina'])
  // Marcadores preservados do catálogo anterior: href="/medico/" e requireRole(['medico', 'recepcao', 'admin'])
  const user = await auth.requireRole([]);
  if (!user) return;

  if (user.mustChangePassword) {
    location.replace('/seguranca/?primeiro-acesso=1');
    return;
  }

  window.addEventListener('portal:social-config-updated', (event) => {
    const refreshed = event.detail?.config;
    if (refreshed) window.PortalSocialNavigation?.mount(user, refreshed);
  });

  const name = document.getElementById('portalUserName');
  const role = document.getElementById('portalUserRole');
  const logout = document.getElementById('portalLogout');
  if (name) name.textContent = user.name || user.username || 'Usuário';
  if (role) role.textContent = user.preview
    ? 'modo de configuração'
    : (window.PortalTools?.roleLabels?.[user.role] || user.role || '');

  logout?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  const loading = document.getElementById('homeLoading');
  const fallback = document.getElementById('toolsFallback');
  const socialHome = document.getElementById('socialHome');

  function showHomeSurface(surface) {
    if (loading) {
      loading.hidden = surface !== 'loading';
      loading.setAttribute('aria-busy', surface === 'loading' ? 'true' : 'false');
    }
    if (fallback) fallback.hidden = surface !== 'tools';
    if (socialHome) socialHome.hidden = surface !== 'social';
    document.body.classList.toggle('home-loading-active', surface === 'loading');
  }

  function announceLoading(message) {
    if (loading) loading.setAttribute('aria-label', message);
  }

  function showToolsFallback(message = '') {
    const notice = document.getElementById('homeFallbackNotice');
    showHomeSurface('tools');
    if (notice) {
      notice.textContent = message;
      notice.hidden = !message;
    }
    window.PortalTools?.render(document.getElementById('hubGrid'), user);
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function socialErrorIsRetryable(error) {
    const status = Number(error?.status || 0);
    return error?.code === 'SOCIAL_CONFIG_TIMEOUT'
      || error?.code === 'SOCIAL_DATABASE_UNAVAILABLE'
      || error?.code === 'SOCIAL_TEMPORARILY_UNAVAILABLE'
      || [500, 502, 503, 504].includes(status);
  }

  function socialFailureMessage(error) {
    let message = 'A Camada Social está temporariamente indisponível. Suas Ferramentas continuam funcionando normalmente.';
    if (user.role === 'admin') {
      const code = String(error?.code || '').trim();
      const status = Number(error?.status || 0);
      const technical = [code, status ? `HTTP ${status}` : ''].filter(Boolean).join(' · ');
      if (technical) message += ` Diagnóstico: ${technical}.`;
    }
    return message;
  }

  async function loadSocialConfigWithRecovery() {
    try {
      return await social.getConfig(10000);
    } catch (error) {
      if (!socialErrorIsRetryable(error)) throw error;
      announceLoading('Conectando à Camada Social');
      await wait(900);
      return social.getConfig(30000);
    }
  }

  let socialConfig = {
    backendEnabled: false,
    homeEnabled: false,
    available: false,
    toolsPath: '/ferramentas/'
  };
  showHomeSurface('loading');
  try {
    socialConfig = await loadSocialConfigWithRecovery();
  } catch (error) {
    window.PortalSocialNavigation?.mount(user, socialConfig);
    showToolsFallback(socialFailureMessage(error));
    return;
  }

  window.PortalSocialNavigation?.mount(user, socialConfig);
  if (!socialConfig.homeEnabled) {
    showToolsFallback('A nova Home social está em validação controlada. Todas as ferramentas autorizadas permanecem disponíveis aqui e em Ferramentas.');
    return;
  }
  if (!socialConfig.available) {
    const message = socialConfig.gate?.message
      || 'Sua conta ainda precisa concluir a etapa de segurança para abrir a Camada Social.';
    showToolsFallback(message);
    return;
  }
  try {
    await window.PortalSocialHome.mount(user, socialConfig);
    showHomeSurface('social');
  } catch (error) {
    showToolsFallback(socialFailureMessage(error));
  }
})();