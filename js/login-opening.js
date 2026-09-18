'use strict';

(() => {
  const OPENING_ASSET = '/assets/portal-opening-v1.mp4?v=20260918-1';
  const OPENING_CACHE = 'portal-opening-media-v1';
  const OPENING_EXPECTED_BYTES = 3275007;
  const OPENING_FADE_MS = 450;
  const OPENING_PREPARE_TIMEOUT_MS = 20000;
  const OPENING_PLAYBACK_TIMEOUT_MS = 20000;

  if (!document.getElementById('loginForm')) return;

  let video = null;
  let objectUrl = '';
  let preparation = null;
  let prepared = false;
  let transitioning = false;
  let primePromise = null;
  let preparationController = null;
  let cancelPlayback = null;

  // A mídia nunca controla o botão, as credenciais ou a sessão do usuário.
  function bounded(promise, milliseconds, fallback = null) {
    let timer;
    return Promise.race([
      Promise.resolve(promise).catch(() => fallback),
      new Promise((resolve) => { timer = window.setTimeout(() => resolve(fallback), milliseconds); })
    ]).finally(() => window.clearTimeout(timer));
  }

  async function mediaCache() {
    try {
      if (!('caches' in window)) return null;
      return await bounded(caches.open(OPENING_CACHE), 1000);
    } catch (_) { return null; }
  }

  async function evict(cache) {
    try { if (cache) await bounded(cache.delete(OPENING_ASSET), 1000); } catch (_) {}
  }

  function releaseMedia() {
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
      video = null;
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = '';
    prepared = false;
  }

  async function validatedBlob(response) {
    if (!response?.ok || response.status === 206) throw new Error('opening_incomplete_response');
    const blob = await response.blob();
    if (blob.size !== OPENING_EXPECTED_BYTES) throw new Error('opening_incomplete_media');
    // Alguns hosts entregam MP4 como octet-stream. O binário oficial não é alterado.
    return blob.type === 'video/mp4' ? blob : new Blob([blob], { type: 'video/mp4' });
  }

  function waitForMediaReady(element, signal) {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        element.removeEventListener('loadeddata', onReady);
        element.removeEventListener('canplay', onReady);
        element.removeEventListener('error', onError);
        signal.removeEventListener('abort', onError);
      };
      const onError = () => { cleanup(); reject(new Error('opening_media_unavailable')); };
      const onReady = () => {
        if (signal.aborted) return onError();
        if (element.readyState < 2 || !Number.isFinite(element.duration) || element.duration <= 0) return;
        cleanup();
        resolve();
      };
      element.addEventListener('loadeddata', onReady);
      element.addEventListener('canplay', onReady);
      element.addEventListener('error', onError);
      signal.addEventListener('abort', onError, { once: true });
      if (element.error || signal.aborted) onError();
      else onReady();
    });
  }

  async function prepareBlob(blob, signal) {
    if (signal.aborted) throw new Error('opening_cancelled');
    releaseMedia();
    objectUrl = URL.createObjectURL(blob);
    video = document.createElement('video');
    video.id = 'portalOpeningVideo';
    video.className = 'portal-login-opening-video';
    video.preload = 'auto';
    video.playsInline = true;
    video.controls = false;
    video.loop = false;
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    video.hidden = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    document.body.appendChild(video);
    const ready = waitForMediaReady(video, signal);
    video.src = objectUrl;
    video.load();
    await ready;
    if (signal.aborted) throw new Error('opening_cancelled');
    prepared = true;
  }

  function prepareOpeningMedia() {
    if (preparation) return preparation;
    preparationController = new AbortController();
    const { signal } = preparationController;
    // O prazo cobre cache, cabeçalhos, corpo INTEIRO e decodificação — não só fetch().
    const timer = window.setTimeout(() => preparationController.abort(), OPENING_PREPARE_TIMEOUT_MS);
    const aborted = new Promise((resolve) => signal.addEventListener('abort', () => resolve(false), { once: true }));
    const work = (async () => {
      const cache = await mediaCache();
      const cached = cache ? await bounded(cache.match(OPENING_ASSET), 1000) : null;
      if (cached) {
        try {
          await prepareBlob(await validatedBlob(cached), signal);
          return true;
        } catch (_) {
          await evict(cache);
          if (signal.aborted) return false;
        }
      }
      const response = await fetch(OPENING_ASSET, {
        credentials: 'same-origin', cache: 'no-cache', signal
      });
      const blob = await validatedBlob(response);
      await prepareBlob(blob, signal);
      // Persistência é opcional e nunca atrasa a disponibilidade da mídia.
      if (cache && !signal.aborted) {
        void bounded(cache.put(OPENING_ASSET, new Response(blob, {
          headers: { 'Content-Type': 'video/mp4' }
        })), 1000);
      }
      return true;
    })();
    preparation = Promise.race([work.catch(() => false), aborted]).then((ready) => {
      if (!ready) {
        preparationController.abort();
        releaseMedia();
      }
      return ready;
    }).finally(() => window.clearTimeout(timer));
    return preparation;
  }

  function primeFromGesture() {
    if (!prepared || !video || transitioning || primePromise) return;
    const element = video;
    element.volume = 0;
    // Chamado sincronamente pelo submit real (mouse, toque ou teclado).
    try {
      primePromise = bounded(element.play(), 1000, false).finally(() => {
        if (!transitioning && video === element) {
          element.pause();
          element.currentTime = 0;
          element.volume = 1;
        }
        primePromise = null;
      });
    } catch (_) { element.volume = 1; }
  }

  function installOpeningStyles() {
    if (document.getElementById('portalLoginOpeningStyles')) return;
    const style = document.createElement('style');
    style.id = 'portalLoginOpeningStyles';
    style.textContent = `
      body.login-opening-active{overflow:hidden!important;background:#000!important}
      .portal-login-opening{position:fixed;inset:0;z-index:2147482000;display:grid;
        place-items:stretch;background:#000;opacity:1;transition:opacity ${OPENING_FADE_MS}ms ease}
      .portal-login-opening.is-leaving{opacity:0;pointer-events:none}
      .portal-login-opening-video{width:100%;height:100%;display:block;object-fit:cover;background:#000}
      .portal-login-opening-video[hidden]{display:none!important}
      @media(prefers-reduced-motion:reduce){.portal-login-opening{transition:none}}
    `;
    document.head.appendChild(style);
  }

  async function playOpening(home) {
    if (!prepared || !video) return false;
    installOpeningStyles();
    transitioning = true;
    const element = video;
    const root = document.createElement('section');
    root.id = 'portalOpening';
    root.className = 'portal-login-opening';
    root.setAttribute('aria-label', 'Abertura do Portal');
    root.setAttribute('aria-live', 'off');
    element.hidden = false;
    element.removeAttribute('aria-hidden');
    element.currentTime = 0;
    element.muted = false;
    element.defaultMuted = false;
    element.volume = 1;
    root.appendChild(element);
    document.body.appendChild(root);
    document.body.classList.add('login-opening-active');
    // A Home real monta DOM, perfil e feed DURANTE a reprodução, sob a camada opaca.
    const homeReady = home ? home.mount(root) : Promise.resolve(false);

    const played = await new Promise((resolve) => {
      let settled = false;
      let timer;
      const finish = (success) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        element.removeEventListener('ended', onEnded);
        element.removeEventListener('error', onError);
        cancelPlayback = null;
        resolve(success);
      };
      const onEnded = () => finish(true);
      const onError = () => finish(false);
      cancelPlayback = onError;
      element.addEventListener('ended', onEnded);
      element.addEventListener('error', onError);
      // Também termina se play() nunca resolver (prompt, mídia ou navegador travados).
      timer = window.setTimeout(onError, OPENING_PLAYBACK_TIMEOUT_MS);
      try { Promise.resolve(element.play()).catch(onError); } catch (_) { onError(); }
    });
    element.pause();
    if (played && await homeReady) {
      // O último quadro permanece até interface, estilos e primeira pintura estarem prontos.
      root.classList.add('is-leaving');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await new Promise((resolve) => window.setTimeout(resolve, OPENING_FADE_MS + 40));
      }
      root.remove();
      document.body.classList.remove('login-opening-active');
      releaseMedia();
      transitioning = false;
      home.reveal();
      return { handled: true };
    }
    home?.cancel();
    // Fallback/rotas especiais: manter cobertura OPACA até a navegação, nunca fazer fade para login.
    releaseMedia();
    return false;
  }

  async function beforeNavigate(options = {}) {
    let home;
    try {
      home = window.PortalHomeTransition?.prepare?.(options.destination);
      if (!await prepareOpeningMedia()) { home?.cancel(); return false; }
      if (primePromise) await primePromise;
      return await playOpening(home);
    } catch (_) {
      // Falha visual não muda credenciais. Cobertura existente permanece até o fallback navegar.
      home?.cancel();
      cancelPlayback?.();
      releaseMedia();
      transitioning = false;
      return false;
    }
  }

  window.PortalLoginOpening = Object.freeze({ prepare: prepareOpeningMedia, primeFromGesture, beforeNavigate });
  window.addEventListener('pagehide', () => {
    preparationController?.abort();
    cancelPlayback?.();
    releaseMedia();
  });
  void prepareOpeningMedia();
})();
