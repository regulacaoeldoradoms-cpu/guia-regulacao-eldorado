'use strict';

(() => {
  if (window.PortalHomeTransition) return;
  // Entrada controlada na Home, não um roteador genérico nem um iframe permanente.
  const HOME_PATHS = new Set(['/', '/home/', '/index.html']);
  const SCRIPT_GLOBALS = new Map([
    ['/js/portal-performance.js', 'PortalPerformance'],
    ['/js/auth-config.js', 'REGULATION_AUTH_CONFIG'],
    ['/js/auth-client.js', 'RegulationAuth'],
    ['/js/portal-interactions.js', 'PortalInteractions'],
    ['/js/tools-catalog.js', 'PortalTools'],
    ['/js/social-api.js', 'PortalSocial'],
    ['/js/social-navigation.js', 'PortalSocialNavigation'],
    ['/js/social-feed.js', 'PortalSocialFeed'],
    ['/js/social-home.js', 'PortalSocialHome'],
    ['/js/home.js', 'PortalHomeReady'],
    ['/js/portal-chat.js', 'PortalChat'],
    ['/js/portal-chat-switch-optimizer.js', '']
  ]);
  const REQUIRED = ['/js/social-api.js', '/js/social-home.js', '/js/home.js'];
  const HOME_TIMEOUT_MS = 20000;

  function homeDestination(value) {
    try {
      const url = new URL(value, location.origin);
      if (!value || url.origin !== location.origin || !HOME_PATHS.has(url.pathname)) return null;
      return url;
    } catch (_) { return null; }
  }

  function prepare(destination) {
    const target = homeDestination(destination);
    if (!target) return null; // Segurança, Conselho e outros next mantêm navegação normal.
    const controller = new AbortController();
    const { signal } = controller;
    const timer = window.setTimeout(() => controller.abort(), HOME_TIMEOUT_MS);
    let mounted = false;
    let shell = null;
    const aborted = new Promise((resolve) => signal.addEventListener('abort', () => resolve(false), { once: true }));
    const stop = () => { window.clearTimeout(timer); controller.abort(); };
    window.addEventListener('portal:session-cleared', stop, { once: true, signal });

    function assetUrl(value, kind) {
      const url = new URL(value, location.origin);
      const allowed = kind === 'script'
        ? SCRIPT_GLOBALS.has(url.pathname)
        : /^\/css\/[a-z0-9-]+\.css$/i.test(url.pathname);
      if (url.origin !== location.origin || !allowed) throw new Error('home_asset_not_allowed');
      return url;
    }

    function loadAsset(node) {
      return new Promise((resolve, reject) => {
        const cleanup = () => {
          node.removeEventListener('load', done);
          node.removeEventListener('error', failed);
          signal.removeEventListener('abort', failed);
        };
        const done = () => { cleanup(); resolve(); };
        const failed = () => { cleanup(); reject(new Error('home_asset_unavailable')); };
        if (signal.aborted) { failed(); return; }
        node.addEventListener('load', done, { once: true });
        node.addEventListener('error', failed, { once: true });
        signal.addEventListener('abort', failed, { once: true });
        document.head.appendChild(node);
      });
    }

    const page = (async () => {
      // GET de HTML público fixo; não lê nem persiste respostas de APIs privadas.
      const response = await fetch('/?portal-home-shell=20260917-3', {
        credentials: 'same-origin', cache: 'no-cache', redirect: 'error', signal
      });
      if (!response.ok || !response.headers.get('Content-Type')?.includes('text/html')) return null;
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (signal.aborted || doc.body.dataset.portalHomeBootstrap !== '1') return null;
      const content = doc.querySelector('.portal-shell');
      if (!content || !content.querySelector('#homeLoading') || !content.querySelector('#socialHome')) return null;
      if (content.querySelector('script,iframe,object,embed,base')) return null;
      // Não executar inline scripts/handlers da resposta: somente módulos locais allowlisted.
      for (const node of content.querySelectorAll('*')) {
        if (Array.from(node.attributes).some((attr) => /^on/i.test(attr.name))) return null;
      }
      const scripts = Array.from(doc.querySelectorAll('script[src]')).map((node) => assetUrl(node.getAttribute('src'), 'script'));
      if (!REQUIRED.every((path) => scripts.some((url) => url.pathname === path))) return null;
      const styles = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map((node) => assetUrl(node.getAttribute('href'), 'style'));
      return { doc, content, scripts, styles };
    })().catch(() => null);

    async function mount(cover) {
      const work = (async () => {
        const source = await page;
        if (!source || signal.aborted || !cover?.isConnected || mounted) return false;
        mounted = true;
        const styleLoads = source.styles.map((url) => {
          if (Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some((link) => link.href === url.href && link.sheet)) return Promise.resolve();
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = url.href;
          return loadAsset(link);
        });
        // Instalar um handler antes de aguardar os scripts, evitando rejeições órfãs de CSS.
        const stylesReady = Promise.all(styleLoads).then(() => true, () => false);
        const csp = source.doc.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (csp) document.head.appendChild(document.importNode(csp, true));
        shell = document.importNode(source.content, true);
        shell.inert = true;
        document.body.insertBefore(shell, cover);
        document.getElementById('loginForm')?.closest('main')?.remove();
        document.body.classList.remove('login-page', 'mobile-login-mode', 'login-intro-collapsed');
        document.body.classList.add('portal-page', 'home-loading-active');
        if (/Android|iPhone|iPad|iPod|Mobile|webOS|IEMobile|Opera Mini/i.test(navigator.userAgent)
          || (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) <= 700)
          || window.matchMedia('(max-width: 860px)').matches) {
          document.body.classList.add('mobile-home-mode');
        }
        document.getElementById('mobile-login-height-fill')?.remove();
        document.title = source.doc.title;
        window.scrollTo(0, 0); // Não herdar a rolagem do formulário mobile na Home revelada.
        // Os módulos existentes enxergam a rota correta e mantêm suas próprias autorizações.
        history.replaceState(history.state, '', target.pathname + target.search + target.hash);
        for (const url of source.scripts) {
          if (signal.aborted) return false;
          const global = SCRIPT_GLOBALS.get(url.pathname);
          if (global && window[global]) continue;
          const script = document.createElement('script');
          script.src = url.href;
          script.async = false;
          await loadAsset(script);
        }
        if (!await stylesReady || !window.PortalHomeReady || !await window.PortalHomeReady || signal.aborted) return false;
        if (!document.getElementById('homeLoading')?.hidden) return false;
        const images = Array.from(shell.querySelectorAll('img')).filter((image) => {
          const box = image.getBoundingClientRect();
          return box.width > 0 && box.height > 0 && box.top < innerHeight;
        });
        const paint = Promise.allSettled([
          ...images.map((image) => image.decode?.()),
          document.fonts?.ready
        ]);
        // Imagens opcionais quebradas não podem prender uma Home funcional.
        let paintTimer;
        await Promise.race([paint, new Promise((resolve) => { paintTimer = setTimeout(resolve, 1200); })]);
        clearTimeout(paintTimer);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return !signal.aborted;
      })().catch(() => false);
      const ready = await Promise.race([work, aborted]);
      window.clearTimeout(timer);
      if (!ready) stop();
      return ready;
    }

    function reveal() {
      if (shell) shell.inert = false;
      window.clearTimeout(timer);
      window.removeEventListener('portal:session-cleared', stop);
      const heading = shell?.querySelector('h1');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
    return Object.freeze({ mount, reveal, cancel: stop });
  }

  window.PortalHomeTransition = Object.freeze({ prepare });
})();
