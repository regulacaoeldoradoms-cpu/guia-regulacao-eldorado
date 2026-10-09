"use strict";
// Presentation only: authorization continues to be enforced by RegulationAuth.
(() => {
  let observedNav = null;
  const measure = document.createElement("canvas").getContext("2d");
  const updateNavLayout = () => {
    const nav = observedNav;
    if (!nav || !document.body.classList.contains("citizen-readable-layout")) return;
    const links = [...nav.querySelectorAll(".social-mobile-nav-link")];
    nav.style.setProperty("--citizen-nav-columns", links.map((_, i) => i < 3 ? "minmax(44px,max-content)" : "minmax(44px,1fr)").join(" "));
    const style = getComputedStyle(nav);
    const available = nav.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const required = links.reduce((sum, link) => {
      const label = link.querySelector(":scope > span:not(.social-nav-icon):not(.social-nav-badge)");
      if (!label) return sum + 44;
      const font = getComputedStyle(label);
      measure.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
      const text = label.textContent.trim();
      const spacing = (parseFloat(font.letterSpacing) || 0) * Math.max(0, [...text].length - 1);
      return sum + Math.max(44, measure.measureText(text).width + spacing);
    }, 0);
    nav.classList.toggle("citizen-nav-reflow", required > available + 0.5);
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
        if (link.dataset.citizenPaw === "true") return;
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
  const apply = (user) => {
    document.body?.classList.toggle(
      "citizen-readable-layout",
      Boolean(user) && sharedRoutes.has(location.pathname),
    );
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
  apply(window.RegulationAuth?.getCachedUser?.() || cached());
  new MutationObserver(petNavigation).observe(document.body, {
    childList: true,
    subtree: true,
  });
  window.addEventListener("portal:session-ready", (event) =>
    apply(event.detail?.user),
  );
  window.addEventListener("portal:session-cleared", () => apply(null));
})();
