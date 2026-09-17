'use strict';

(() => {
  const OPENING_ASSET = '/assets/portal-opening-v1.mp4?v=20260917-1';
  const OPENING_CACHE = 'portal-opening-media-v1';
  const OPENING_EXPECTED_BYTES = 2393970;
  const OPENING_FADE_MS = 450;
  const OPENING_RETRY_MS = 2500;
  const OPENING_SAFETY_MS = 20000;

  const form = document.getElementById('loginForm');
  const submit = document.getElementById('loginSubmit');
  const status = document.getElementById('loginStatus');
  const auth = window.RegulationAuth;

  if (!form || !submit || !auth?.login) return;

  let openingVideo = null;
  let openingObjectUrl = '';
  let openingReady = false;
  let openingPreparing = null;
  let openingRetryTimer = 0;
  let openingPrimePromise = null;
  let openingTransitionActive = false;

  function setSubmitPreparing() {
    submit.disabled = true;
    submit.setAttribute('aria-disabled', 'true');
    if (!openingTransitionActive) submit.textContent = 'Preparando abertura...';
  }

  function setSubmitReady() {
    if (!openingReady || openingTransitionActive) return;
    submit.disabled = false;
    submit.setAttribute('aria-disabled', 'false');
    submit.textContent = 'Entrar';
  }

  function showPreparationStatus(message) {
    if (!status) return;
    status.dataset.openingPreparation = 'true';
    status.textContent = message;
    status.className = 'login-status visible info';
  }

  function clearPreparationStatus() {
    if (!status || status.dataset.openingPreparation !== 'true') return;
    delete status.dataset.openingPreparation;
    status.textContent = '';
    status.className = 'login-status';
  }

  function installOpeningStyles() {
    if (document.getElementById('portalLoginOpeningStyles')) return;
    const style = document.createElement('style');
    style.id = 'portalLoginOpeningStyles';
    style.textContent = `
      body.login-opening-active{overflow:hidden!important;background:#000!important}
      .portal-login-opening{
        position:fixed;
        inset:0;
        z-index:2147482000;
        display:grid;
        place-items:stretch;
        background:#000;
        opacity:1;
        transition:opacity ${OPENING_FADE_MS}ms ease;
      }
      .portal-login-opening.is-leaving{opacity:0;pointer-events:none}
      .portal-login-opening-video{
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
        background:#000;
      }
      @media(prefers-reduced-motion:reduce){.portal-login-opening{transition:none}}
    `;
    document.head.appendChild(style);
  }

  async function cacheResponse(response) {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open(OPENING_CACHE);
      await cache.put(OPENING_ASSET, response.clone());
    } catch (_) {
      // Cache é otimização. O Blob já baixado continua válido para esta sessão.
    }
  }

  async function cachedResponse() {
    if (!('caches' in window)) return null;
    try {
      const cache = await caches.open(OPENING_CACHE);
      const response = await cache.match(OPENING_ASSET);
      return response?.ok ? response : null;
    } catch (_) {
      return null;
    }
  }

  async function evictCachedResponse() {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open(OPENING_CACHE);
      await cache.delete(OPENING_ASSET);
    } catch (_) {}
  }

  async function responseToValidatedBlob(response) {
    const blob = await response.blob();
    if (blob.size !== OPENING_EXPECTED_BYTES) {
      throw new Error(`opening_size_mismatch:${blob.size}`);
    }
    return blob;
  }

  async function fetchOpeningResponse() {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(OPENING_ASSET, {
        credentials: 'same-origin',
        cache: 'force-cache',
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`opening_http_${response.status}`);
      return response;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function loadOpeningBlob() {
    const cached = await cachedResponse();
    if (cached) {
      try {
        return await responseToValidatedBlob(cached);
      } catch (_) {
        await evictCachedResponse();
      }
    }

    const response = await fetchOpeningResponse();
    const cacheCopy = response.clone();
    const blob = await responseToValidatedBlob(response);
    void cacheResponse(cacheCopy);
    return blob;
  }

  function waitForMediaReady(video) {
    return new Promise((resolve, reject) => {
      if (video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0) {
        resolve();
        return;
      }
      const timer = window.setTimeout(() => reject(new Error('opening_media_timeout')), 12000);
      const cleanup = () => {
        window.clearTimeout(timer);
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('error', onError);
      };
      const onReady = () => {
        if (video.readyState < 2 || !Number.isFinite(video.duration)) return;
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error('opening_media_error'));
      };
      video.addEventListener('loadeddata', onReady);
      video.addEventListener('canplay', onReady);
      video.addEventListener('error', onError, { once: true });
    });
  }

  async function prepareOpeningMedia() {
    if (openingReady && openingVideo) return true;
    if (openingPreparing) return openingPreparing;

    setSubmitPreparing();
    openingPreparing = (async () => {
      try {
        const blob = await loadOpeningBlob();
        if (openingObjectUrl) URL.revokeObjectURL(openingObjectUrl);
        openingObjectUrl = URL.createObjectURL(blob);

        openingVideo?.remove();
        const video = document.createElement('video');
        video.id = 'portalOpeningVideo';
        video.className = 'portal-login-opening-video';
        video.preload = 'auto';
        video.playsInline = true;
        video.controls = false;
        video.loop = false;
        video.muted = false;
        video.defaultMuted = false;
        video.volume = 1;
        video.setAttribute('playsinline', '');
        video.src = openingObjectUrl;
        video.hidden = true;
        document.body.appendChild(video);
        video.load();
        await waitForMediaReady(video);

        openingVideo = video;
        openingReady = true;
        clearPreparationStatus();
        setSubmitReady();
        return true;
      } catch (_) {
        openingReady = false;
        setSubmitPreparing();
        showPreparationStatus('Preparando a abertura do Portal. O vídeo ainda não terminou de carregar; uma nova tentativa será feita automaticamente.');
        window.clearTimeout(openingRetryTimer);
        openingRetryTimer = window.setTimeout(() => void prepareOpeningMedia(), OPENING_RETRY_MS);
        return false;
      } finally {
        openingPreparing = null;
      }
    })();

    return openingPreparing;
  }

  async function primeOpeningPlayback() {
    if (!openingReady || !openingVideo) return false;
    if (openingPrimePromise) return openingPrimePromise;

    openingPrimePromise = (async () => {
      const video = openingVideo;
      try {
        video.muted = false;
        video.defaultMuted = false;
        video.volume = 0;
        video.currentTime = 0;
        await video.play();
        video.pause();
        video.currentTime = 0;
        return true;
      } catch (_) {
        return false;
      } finally {
        video.volume = 1;
        openingPrimePromise = null;
      }
    })();

    return openingPrimePromise;
  }

  async function playOpeningForAuthenticatedUser(user) {
    if (!openingReady || !openingVideo) return false;

    window.PortalPerformance?.warmForUser?.(user, { immediate: true });
    installOpeningStyles();

    const root = document.createElement('section');
    root.className = 'portal-login-opening';
    root.id = 'portalOpening';
    root.setAttribute('aria-label', 'Abertura do Portal');
    root.setAttribute('aria-live', 'off');

    const video = openingVideo;
    video.hidden = false;
    video.currentTime = 0;
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    root.appendChild(video);
    document.body.appendChild(root);
    document.body.classList.add('login-opening-active');
    openingTransitionActive = true;

    let settled = false;
    const finish = (played) => new Promise((resolve) => {
      if (settled) {
        resolve(played);
        return;
      }
      settled = true;
      root.classList.add('is-leaving');
      const remove = () => {
        video.pause();
        video.hidden = true;
        document.body.appendChild(video);
        root.remove();
        document.body.classList.remove('login-opening-active');
        resolve(played);
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) remove();
      else window.setTimeout(remove, OPENING_FADE_MS + 40);
    });

    const endedPromise = new Promise((resolve) => {
      const safety = window.setTimeout(() => resolve('timeout'), OPENING_SAFETY_MS);
      video.addEventListener('ended', () => {
        window.clearTimeout(safety);
        resolve('ended');
      }, { once: true });
      video.addEventListener('error', () => {
        window.clearTimeout(safety);
        resolve('error');
      }, { once: true });
    });

    try {
      await video.play();
    } catch (_) {
      // Não exibe botão extra. Se a política do navegador ainda bloquear o áudio,
      // o fluxo segue para a Home e o loader legado permanece como fallback.
      return finish(false);
    }

    const result = await endedPromise;
    return finish(result === 'ended');
  }

  const originalLogin = auth.login.bind(auth);
  auth.login = async (...args) => {
    const user = await originalLogin(...args);
    try {
      if (openingPrimePromise) await openingPrimePromise;
      await playOpeningForAuthenticatedUser(user);
    } catch (_) {
      // A autenticação nunca é perdida por uma falha visual da abertura.
    }
    try {
      sessionStorage.setItem('portal-opening-played-v2', '1');
    } catch (_) {}
    return user;
  };

  const primeFromGesture = () => {
    if (!openingReady || openingTransitionActive) return;
    void primeOpeningPlayback();
  };

  submit.addEventListener('pointerdown', primeFromGesture, { capture: true, passive: true });
  submit.addEventListener('click', primeFromGesture, { capture: true, passive: true });
  form.addEventListener('submit', primeFromGesture, { capture: true });

  window.addEventListener('pagehide', () => {
    window.clearTimeout(openingRetryTimer);
    if (openingObjectUrl) URL.revokeObjectURL(openingObjectUrl);
  }, { once: true });

  setSubmitPreparing();
  void prepareOpeningMedia();
})();
