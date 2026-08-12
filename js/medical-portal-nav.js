'use strict';

(() => {
  function ensureChatAssets() {
    if (!document.querySelector('link[data-portal-chat-style]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = '/css/portal-chat.css?v=20260812-1';
      style.dataset.portalChatStyle = 'true';
      document.head.appendChild(style);
    }
    if (!document.querySelector('script[data-portal-chat-script]')) {
      const script = document.createElement('script');
      script.src = '/js/portal-chat.js?v=20260812-1';
      script.defer = true;
      script.dataset.portalChatScript = 'true';
      document.body.appendChild(script);
    }
  }

  function applyPortalNav() {
    const nav = document.querySelector('.top-nav');
    if (nav && !nav.querySelector('[data-portal-home]')) {
      const link = document.createElement('a');
      link.href = '/home/';
      link.className = 'nav-button';
      link.dataset.portalHome = 'true';
      link.textContent = 'HUB';
      nav.prepend(link);

      if (window.RegulationAuth?.enforcementEnabled) {
        const logout = document.createElement('button');
        logout.type = 'button';
        logout.className = 'nav-button';
        logout.textContent = 'Sair';
        logout.addEventListener('click', async () => {
          await window.RegulationAuth.logout();
          location.replace('/login/');
        });
        nav.appendChild(logout);
      }
    }
    ensureChatAssets();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyPortalNav, { once: true });
  else applyPortalNav();
})();
