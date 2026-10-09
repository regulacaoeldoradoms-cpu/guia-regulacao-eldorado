"use strict";
// Presentation only: authorization continues to be enforced by RegulationAuth.
(() => {
  let observedNav = null;
  const navSize = new ResizeObserver((entries) => {
    const height = entries[0]?.target.getBoundingClientRect().height || 0;
    if (height)
      document.body.style.setProperty(
        "--citizen-bottom-space",
        `${Math.ceil(height) + 12}px`,
      );
  });
  function petNavigation() {
    if (!document.body?.classList.contains("citizen-readable-layout")) return;
    const nav = document.querySelector(".social-mobile-nav");
    if (nav && nav !== observedNav) {
      navSize.disconnect();
      observedNav = nav;
      navSize.observe(nav);
    }
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
  }
  const apply = (user) => {
    document.body?.classList.toggle(
      "citizen-readable-layout",
      user?.role === "cidadao",
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
