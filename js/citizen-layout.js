"use strict";
// Presentation only: authorization continues to be enforced by RegulationAuth.
(() => {
  const instance = Symbol.for('portal.citizenLayout');
  if (window[instance]) return;
  window[instance] = true;
  let observedNav = null;
  const mobileScreen = matchMedia("screen and (max-width: 900px)");
  const originalPaws = new WeakMap();
  const measure = document.createElement("canvas").getContext("2d");
  const updateNavLayout = () => {
    const nav = observedNav;
    if (!nav || !document.body.classList.contains("citizen-readable-layout")) return;
    if (!mobileScreen.matches) {
      document.body.classList.remove('home-nav-in-flow');
      nav.classList.remove("citizen-nav-reflow");
      nav.style.removeProperty("--citizen-nav-columns");
      document.body.style.removeProperty("--citizen-bottom-space");
      return;
    }
    const links = [...nav.querySelectorAll(".social-mobile-nav-link")];
    const home = document.body.hasAttribute('data-portal-home-bootstrap');
    // Measure the normal row so returning from enlarged text can restore it.
    const iconNavigation = nav.dataset.homeIconNavigation === "true";
    if (home || iconNavigation) nav.classList.remove('citizen-nav-reflow');
    nav.style.setProperty("--citizen-nav-columns", links.map((_, i) => i < 3 ? "minmax(44px,max-content)" : "minmax(44px,1fr)").join(" "));
    const style = getComputedStyle(nav);
    const available = nav.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const required = iconNavigation ? links.length * 44 : links.reduce((sum, link) => {
      const label = link.querySelector(":scope > span:not(.social-nav-icon):not(.social-nav-badge)");
      if (!label) return sum + 44;
      const font = getComputedStyle(label);
      measure.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
      const text = label.textContent.trim();
      const spacing = (parseFloat(font.letterSpacing) || 0) * Math.max(0, [...text].length - 1);
      const padding = getComputedStyle(link);
      return sum + Math.max(44, measure.measureText(text).width + spacing + (parseFloat(padding.paddingLeft) || 0) + (parseFloat(padding.paddingRight) || 0));
    }, 0);
    if (home)
      nav.style.setProperty('--home-nav-gap', `${Math.max(0, Math.min(3, (available - required) / Math.max(1, links.length - 1)))}px`);
    const gaps = (parseFloat(getComputedStyle(nav).columnGap) || 0) * Math.max(0, links.length - 1);
    nav.classList.toggle("citizen-nav-reflow", required + gaps > available + 0.5);
    document.body.classList.toggle('home-nav-in-flow', home && required + gaps > available + 0.5);
    const height = nav.getBoundingClientRect().height || 0;
    if (height)
      document.body.style.setProperty(
        "--citizen-bottom-space",
        `${Math.ceil(height) + 12}px`,
      );
  };
  const navSize = new ResizeObserver(updateNavLayout);
  function petNavigation() {
    if (!document.body?.classList.contains("citizen-readable-layout")) return;
    const nav = document.querySelector(".social-mobile-nav");
    if (nav && nav !== observedNav) {
      navSize.disconnect();
      observedNav = nav;
      navSize.observe(nav);
    }
    nav?.querySelectorAll(".social-mobile-nav-link, .social-mobile-nav-link > span:not(.social-nav-icon):not(.social-nav-badge)").forEach(link => navSize.observe(link));
    document
      .querySelectorAll('.social-mobile-nav a[href="/mascotes/"]')
      .forEach((link) => {
        if (!mobileScreen.matches) {
          const original = originalPaws.get(link);
          if (original) {
            originalPaws.delete(link);
            delete link.dataset.citizenPaw;
            link.replaceChildren(...original);
          }
          return;
        }
        if (link.dataset.citizenPaw === "true") return;
        originalPaws.set(link, [...link.childNodes]);
        link.dataset.citizenPaw = "true";
        link.setAttribute("aria-label", "Mascotes");
        link.title = "Mascotes";
        if (location.pathname === "/mascotes/")
          link.setAttribute("aria-current", "page");
        const icon = document.createElement("span");
        icon.className = "social-nav-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="16" rx="6" ry="4"/><circle cx="5" cy="8" r="2"/><circle cx="10" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="20" cy="8" r="2"/></svg>';
        link.replaceChildren(icon);
      });
    updateNavLayout();
  }
  const sharedRoutes = new Set(["/", "/cidadao/", "/amigos/", "/ferramentas/", "/perfil/", "/seguranca/", "/conquistas/", "/configuracoes/", "/notificacoes/", "/mascotes/"]);
  const version = '20261010-mobile-shell-1';
  let presentationStarted = false;
  let finishPresentation;
  // Defined before initial apply, so Home and synthetic route fixtures can wait
  // for the same single mount without owning a second navigation controller.
  window.PortalCitizenMobileReady = new Promise(resolve => { finishPresentation = resolve; });
  function loadStyle(path) {
    const href = new URL(`${path}?v=${version}`, location.href).href;
    const existing = [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href === href);
    if (existing?.sheet) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const link = existing || document.createElement('link');
      const complete = (error) => {
        clearTimeout(timeout);
        link.removeEventListener('load', loaded);
        link.removeEventListener('error', failed);
        if (error) { link.remove(); reject(error); } else resolve();
      };
      const loaded = () => complete();
      const failed = () => complete(new Error(`Stylesheet unavailable: ${path}`));
      const timeout = setTimeout(failed, 15000);
      link.addEventListener('load', loaded, { once: true });
      link.addEventListener('error', failed, { once: true });
      if (!existing) {
        link.rel = 'stylesheet';
        link.href = href;
        document.head.append(link);
      }
    });
  }
  async function mountPresentation() {
    if (presentationStarted) return;
    presentationStarted = true;
    const profileRoute = location.pathname === '/perfil/';
    const mobileChatOnly = location.pathname === '/mascotes/'
      && document.body.hasAttribute('data-citizen-mobile-chat-only');
    try {
      const [navigation, direct, profile, mobileChat] = await Promise.all([
        import(`/js/citizen-mobile-navigation.js?v=${version}`),
        import(`/js/home-mobile-direct.js?v=${version}`),
        profileRoute ? import(`/js/profile-mobile-presentation.js?v=${version}`) : null,
        mobileChatOnly ? import(`/js/citizen-mobile-chat-bootstrap.js?v=20261010-citizen-prewarm-1`) : null,
        loadStyle('/css/citizen-mobile-navigation.css'),
        loadStyle('/css/home-mobile-direct.css'),
        profileRoute ? loadStyle('/css/profile-mobile-presentation.css') : null
      ]);
      const profileController = profile?.mountProfileMobilePresentation();
      const directController = direct.mountHomeMobileDirect();
      // This final mount exposes the shared marker only after all resources and
      // the direct controller are ready; failed loads keep native navigation.
      navigation.mountCitizenMobileNavigation();
      mobileChat?.mountCitizenMobileChatBootstrap(directController);
      profileController?.sync();
      petNavigation();
      finishPresentation(true);
    } catch (error) {
      console.warn('Shared mobile presentation unavailable', error);
      finishPresentation(false);
    }
  }
  const apply = (user) => {
    document.body?.classList.toggle(
      "citizen-readable-layout",
      Boolean(user) && sharedRoutes.has(location.pathname),
    );
    if (user && sharedRoutes.has(location.pathname)) mountPresentation();
    petNavigation();
  };
  const cached = () => {
    try {
      const config = window.REGULATION_AUTH_CONFIG || {};
      const key = config.userStorageKey || "regulacao.portal.user";
      const tokenKey = config.tokenStorageKey || "regulacao.portal.session";
      if (!(sessionStorage.getItem(tokenKey) || localStorage.getItem(tokenKey)))
        return null;
      return JSON.parse(
        sessionStorage.getItem(key) || localStorage.getItem(key) || "null",
      );
    } catch (_) {
      return null;
    }
  };
  // Home already has the authenticated (or configured preview) user before it
  // imports this script; accepting that result avoids depending on a past event.
  async function enterRoute() {
    await window.PortalCitizenMobileReady;
    if (location.pathname === '/perfil/') {
      const profile = await import(`/js/profile-mobile-presentation.js?v=${version}`);
      await loadStyle('/css/profile-mobile-presentation.css');
      profile.mountProfileMobilePresentation()?.sync();
    } else window[Symbol.for('portal.profileMobilePresentation')]?.sync();
    if (location.pathname === '/mascotes/') {
      const chat = await import(`/js/citizen-mobile-chat-bootstrap.js?v=20261010-citizen-prewarm-1`);
      chat.mountCitizenMobileChatBootstrap(window[Symbol.for('portal.homeMobileDirect')]);
    }
  }
  async function prepareRoute(path) {
    await window.PortalCitizenMobileReady;
    if (path === '/perfil/') await Promise.all([
      import(`/js/profile-mobile-presentation.js?v=${version}`),
      loadStyle('/css/profile-mobile-presentation.css')
    ]);
    if (path === '/mascotes/') await import(`/js/citizen-mobile-chat-bootstrap.js?v=20261010-citizen-prewarm-1`);
  }
  window.PortalCitizenLayout = Object.freeze({ apply, enterRoute, prepareRoute });
  apply(window.RegulationAuth?.getCachedUser?.() || cached());
  new MutationObserver(petNavigation).observe(document.body, {
    childList: true,
    subtree: true,
  });
  mobileScreen.addEventListener("change", petNavigation);
  window.addEventListener("portal:session-ready", (event) =>
    apply(event.detail?.user),
  );
  window.addEventListener("portal:session-cleared", () => apply(null));
})();
