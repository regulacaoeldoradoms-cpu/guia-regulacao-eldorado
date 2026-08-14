'use strict';

(() => {
  let chatRootObserver = null;
  let chatInsertObserver = null;

  function syncFloatingTools() {
    const root = document.getElementById('portalChatRoot');
    document.body.classList.toggle('portal-chat-present', Boolean(root));
    document.body.classList.toggle('portal-chat-open', Boolean(root?.classList.contains('open')));
  }

  function attachChatRootObserver() {
    const root = document.getElementById('portalChatRoot');
    if (!root) return false;

    syncFloatingTools();
    if (chatRootObserver) chatRootObserver.disconnect();
    chatRootObserver = new MutationObserver(syncFloatingTools);
    chatRootObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
    return true;
  }

  function watchFloatingTools() {
    if (attachChatRootObserver()) return;

    if (chatInsertObserver) chatInsertObserver.disconnect();
    chatInsertObserver = new MutationObserver(() => {
      if (!attachChatRootObserver()) return;
      chatInsertObserver.disconnect();
      chatInsertObserver = null;
    });
    chatInsertObserver.observe(document.body, { childList: true });
  }

  function ensureChatAssets() {
    if (!document.querySelector('link[data-portal-chat-style]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = '/css/portal-chat.css?v=20260814-1';
      style.dataset.portalChatStyle = 'true';
      document.head.appendChild(style);
    }
    if (!document.querySelector('script[data-portal-chat-script]')) {
      const script = document.createElement('script');
      script.src = '/js/portal-chat.js?v=20260814-1';
      script.defer = true;
      script.dataset.portalChatScript = 'true';
      document.body.appendChild(script);
    }
    if (!document.querySelector('script[data-portal-chat-switch-optimizer]')) {
      const optimizer = document.createElement('script');
      optimizer.src = '/js/portal-chat-switch-optimizer.js?v=20260812-1';
      optimizer.defer = true;
      optimizer.dataset.portalChatSwitchOptimizer = 'true';
      document.body.appendChild(optimizer);
    }
  }

  function applyPortalNav() {
    const nav = document.querySelector('.top-nav');
    if (nav && !nav.querySelector('[data-portal-home]')) {
      const link = document.createElement('a');
      link.href = '/';
      link.className = 'nav-button';
      link.dataset.portalHome = 'true';
      link.textContent = 'Início';
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
    watchFloatingTools();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyPortalNav, { once: true });
  else applyPortalNav();
})();
