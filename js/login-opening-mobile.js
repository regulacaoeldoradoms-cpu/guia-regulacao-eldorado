'use strict';

// Mobile presentation only. Authentication and Home readiness remain in their
// existing controllers; no cycle duration or image download gates navigation.
(() => {
  if (document.documentElement.dataset.portalOpeningMode !== 'mobile') return;
  const ASSET = '/assets/portal-opening-mobile-v1.webp?v=20261015-1';
  const FALLBACK = '/assets/portal-regulacao-icon.webp';
  const FADE_MS = 420;
  const HOME_LIMIT_MS = 21000;
  let inFlight = null;

  function installStyles() {
    if (document.getElementById('portalMobileOpeningStyles')) return;
    const style = document.createElement('style');
    style.id = 'portalMobileOpeningStyles';
    style.textContent = `
      body.login-opening-active{overflow:hidden!important}
      .portal-mobile-opening{position:fixed;inset:0;z-index:2147482000;
        display:grid;place-items:center;overflow:hidden;background:#000;
        isolation:isolate;opacity:1;transition:opacity ${FADE_MS}ms ease;
        -webkit-tap-highlight-color:transparent;touch-action:none}
      .portal-mobile-opening.is-leaving{opacity:0;pointer-events:none}
      .portal-mobile-opening__logo{position:relative;width:min(91vw,78vh,35rem);
        width:min(91vw,78dvh,35rem);aspect-ratio:1;margin:0;isolation:isolate}
      .portal-mobile-opening__logo img,.portal-mobile-opening__logo canvas{
        position:absolute;inset:0;display:block;width:100%;height:100%;
        object-fit:contain;pointer-events:none;user-select:none;-webkit-user-select:none}
      .portal-mobile-opening__logo canvas{mix-blend-mode:screen}
      @media(prefers-reduced-motion:reduce){
        #portalOpening.portal-mobile-opening{transition:none!important}
        .portal-mobile-opening__logo canvas{display:none}}
      @media print{.portal-mobile-opening{display:none}}
    `;
    document.head.appendChild(style);
  }

  // Lighting geometry/timing from the approved standalone preview, unchanged.
  // Only lifecycle management and graphics-error isolation are integration code.
  function animate(figure, image, canvas, motion) {
    const PERIOD = 8;
    const DESIGN = 1254;
    const FRAME_MS = 1000 / 30;
    let ctx, maskCtx;
    const mask = document.createElement('canvas');
    let disposed = false;
    let observer = null;
    const state = { ready:false, elapsed:0, epoch:null, frame:0,
      lastPaint:-Infinity, resizeFrame:0 };
    try {
      ctx = canvas.getContext('2d', { alpha:true });
      maskCtx = mask.getContext('2d', { willReadFrequently:true });
    } catch (_) {}
    const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
    const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
    const lerp = (a, b, p) => a + (b - a) * p;
    const envelope = (t, start, end, fade = 0.42) =>
      smooth((t - start) / fade) * smooth((end - t) / fade);

    // All light is clipped to pixels of the supplied logo, not a redrawn shape.
    function glow(x, y, rx, ry, amount, color = [190, 238, 255]) {
      if (amount <= 0.0001) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(rx, ry);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      const [r, g, b] = color;
      gradient.addColorStop(0, `rgba(${r},${g},${b},${amount})`);
      gradient.addColorStop(0.24, `rgba(${r},${g},${b},${amount * 0.70})`);
      gradient.addColorStop(0.64, `rgba(${r},${g},${b},${amount * 0.19})`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
    }
    function bezier(a, b, c, p) {
      const q = 1 - p;
      return { x: q*q*a.x + 2*q*p*b.x + p*p*c.x,
               y: q*q*a.y + 2*q*p*b.y + p*p*c.y };
    }
    function draw(t) {
      if (!state.ready || !ctx) return;
      t = ((t % PERIOD) + PERIOD) % PERIOD;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (motion.matches || disposed) return;
      const scale = canvas.width / DESIGN;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.globalCompositeOperation = 'screen';
      const bridge = envelope(t, 0.25, 2.75, 0.58);
      const bp = smooth((t - 0.25) / 2.5);
      glow(630, lerp(1170, 786, bp), lerp(340, 150, bp), 116,
           0.56 * bridge, [174, 233, 255]);
      glow(lerp(244, 573, bp), lerp(1056, 781, bp), 86, 93,
           0.31 * bridge, [147, 225, 255]);
      glow(lerp(1018, 695, bp), lerp(1056, 781, bp), 86, 93,
           0.31 * bridge, [147, 225, 255]);
      const road = envelope(t, 2.05, 4.72, 0.56);
      const rp = smooth((t - 2.05) / 2.67);
      const r = bezier({x:596,y:858}, {x:565,y:574}, {x:867,y:442}, rp);
      glow(r.x, r.y, 137, 158, 0.44 * road, [222, 255, 241]);
      glow(630, 442, 199, 192,
           0.18 * envelope(t, 3.35, 5.25, 0.70), [185, 238, 255]);
      const orbit = envelope(t, 3.67, 7.54, 0.53);
      const op = (t - 3.67) / 3.87;
      const a = lerp(141, 387, clamp(op)) * Math.PI / 180;
      const x = 631 + 474 * Math.cos(a);
      const y = 620 + 490 * Math.sin(a);
      glow(x, y, 159, 169, 0.55 * orbit, [179, 237, 255]);
      glow(631 + 410 * Math.cos(a), 620 + 425 * Math.sin(a),
           123, 143, 0.17 * orbit, [203, 255, 226]);
      const nodes = [
        {x:166, y:500, at:4.50, rx:78, ry:78, c:[183,255,193]},
        {x:632, y:148, at:5.67, rx:111,ry:113,c:[182,238,255]},
        {x:1039,y:379, at:6.61, rx:75, ry:75, c:[185,255,193]},
        {x:1050,y:828, at:7.06, rx:65, ry:65, c:[173,230,255]}
      ];
      for (const n of nodes) {
        const e = envelope(t, n.at - 0.39, n.at + 0.49, 0.39);
        glow(n.x, n.y, n.rx, n.ry, 0.16 * e, n.c);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    }
    function elapsedNow() {
      return state.elapsed + (state.epoch === null ? 0 : (performance.now() - state.epoch) / 1000);
    }
    function stopClock() {
      state.elapsed = elapsedNow();
      state.epoch = null;
      cancelAnimationFrame(state.frame);
      state.frame = 0;
    }
    function disableGraphics() {
      dispose();
      canvas.hidden = true;
      canvas.style.display = 'none';
    }
    function tick(now) {
      state.frame = 0;
      if (disposed || document.hidden || motion.matches || !figure.isConnected) return;
      try {
        if (now - state.lastPaint >= FRAME_MS - 0.5) {
          draw(elapsedNow());
          state.lastPaint = now;
        }
        state.frame = requestAnimationFrame(tick);
      } catch (_) { disableGraphics(); }
    }
    function startClock() {
      if (!state.ready || disposed || document.hidden || motion.matches) return;
      if (state.epoch === null) state.epoch = performance.now();
      if (!state.frame) state.frame = requestAnimationFrame(tick);
    }
    function resize() {
      state.resizeFrame = 0;
      if (!state.ready || disposed || !ctx || !maskCtx) return;
      try {
        const size = Math.min(1120, Math.max(1, Math.round(
          figure.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 2))));
        if (size !== canvas.width || size !== canvas.height) {
          canvas.width = mask.width = size;
          canvas.height = mask.height = size;
          maskCtx.clearRect(0, 0, size, size);
          maskCtx.drawImage(image, 0, 0, size, size);
          const pixels = maskCtx.getImageData(0, 0, size, size);
          const d = pixels.data;
          for (let i = 0; i < d.length; i += 4) {
            const alpha = smooth((Math.max(d[i], d[i + 1], d[i + 2]) - 15) / 95);
            d[i] = d[i + 1] = d[i + 2] = 255;
            d[i + 3] = Math.round(alpha * 255);
          }
          maskCtx.putImageData(pixels, 0, 0);
        }
        draw(elapsedNow());
      } catch (_) { disableGraphics(); }
    }
    function scheduleResize() {
      if (disposed) return;
      cancelAnimationFrame(state.resizeFrame);
      state.resizeFrame = requestAnimationFrame(resize);
    }
    function onVisibility() { document.hidden ? stopClock() : startClock(); }
    function onMotion() { stopClock(); resize(); startClock(); }
    function onReady() {
      if (state.ready || disposed || !ctx || !maskCtx || !image.naturalWidth) return;
      state.ready = true;
      resize();
      startClock();
    }
    function dispose() {
      if (disposed) return;
      stopClock();
      disposed = true;
      cancelAnimationFrame(state.resizeFrame);
      observer?.disconnect();
      image.removeEventListener('load', onReady);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', scheduleResize);
      if (motion.removeEventListener) motion.removeEventListener('change', onMotion);
      else motion.removeListener?.(onMotion);
    }
    if (!ctx || !maskCtx) { disableGraphics(); return dispose; }
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', scheduleResize);
    if (motion.addEventListener) motion.addEventListener('change', onMotion);
    else motion.addListener?.(onMotion);
    if (typeof ResizeObserver === 'function') {
      try { observer = new ResizeObserver(scheduleResize); observer.observe(figure); } catch (_) {}
    }
    if (image.complete && image.naturalWidth) onReady();
    else image.addEventListener('load', onReady);
    return dispose;
  }

  async function transition(options) {
    // Reuse the exact same-origin Home allowlist, authorization and 20 s bound.
    const home = window.PortalHomeTransition?.prepare?.(options.destination);
    if (!home) return false; // Security, email verification and other next routes.
    let cover, image, canvas, stopAnimation = () => {};
    let timer, fadeTimer, cancelled = false, handled = false;
    let resolveCancellation;
    const interrupted = new Promise(resolve => { resolveCancellation = resolve; });
    const cancel = () => {
      cancelled = true;
      stopAnimation();
      home.cancel();
      resolveCancellation(false);
    };
    const fallbackImage = () => {
      stopAnimation();
      canvas?.remove();
      image.src = FALLBACK; // Ordinary static image; never a substitute video.
    };
    window.addEventListener('pagehide', cancel);
    window.addEventListener('portal:session-cleared', cancel);
    try {
      installStyles();
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      cover = document.createElement('section');
      cover.id = 'portalOpening';
      cover.className = 'portal-mobile-opening';
      cover.setAttribute('role', 'status');
      cover.setAttribute('aria-label', 'Carregando o Portal da Regulação');
      cover.setAttribute('aria-live', 'off');
      const figure = document.createElement('figure');
      figure.className = 'portal-mobile-opening__logo';
      figure.setAttribute('aria-hidden', 'true');
      image = document.createElement('img');
      image.alt = '';
      image.width = image.height = 768;
      image.decoding = 'async';
      image.addEventListener('error', fallbackImage, { once:true });
      image.src = ASSET;
      canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      figure.append(image, canvas);
      cover.appendChild(figure);
      document.body.appendChild(cover);
      document.body.classList.add('login-opening-active');
      // Start mounting before any pixel processing, decode or animation work.
      const homeReady = Promise.resolve(home.mount(cover)).catch(() => false);
      try { stopAnimation = animate(figure, image, canvas, motion); } catch (_) { canvas.remove(); }
      timer = window.setTimeout(cancel, HOME_LIMIT_MS);
      const ready = await Promise.race([homeReady, interrupted]);
      window.clearTimeout(timer);
      if (!ready || cancelled) return false;
      stopAnimation();
      cover.classList.add('is-leaving');
      if (!motion.matches) await Promise.race([
        new Promise(resolve => { fadeTimer = window.setTimeout(resolve, FADE_MS + 30); }),
        interrupted
      ]);
      if (cancelled) return false;
      home.reveal();
      cover.remove();
      document.body.classList.remove('login-opening-active');
      handled = true;
      return { handled:true };
    } finally {
      window.clearTimeout(timer);
      window.clearTimeout(fadeTimer);
      stopAnimation();
      image?.removeEventListener('error', fallbackImage);
      window.removeEventListener('pagehide', cancel);
      window.removeEventListener('portal:session-cleared', cancel);
      if (!handled) {
        home.cancel();
        // The existing login controller navigates normally on false/failure.
        // Keep an opaque cover until that navigation; never flash an inert Home.
        cover?.classList.remove('is-leaving');
      }
    }
  }

  function beforeNavigate(options = {}) {
    if (!inFlight) inFlight = transition(options).catch(() => false).finally(() => { inFlight = null; });
    return inFlight;
  }
  window.PortalMobileLoginOpening = Object.freeze({
    prepare: () => Promise.resolve(true), // The HTML preloads the logo; no media gate.
    primeFromGesture() {}, // Silent Canvas requires no audio/autoplay permission.
    beforeNavigate
  });
})();
