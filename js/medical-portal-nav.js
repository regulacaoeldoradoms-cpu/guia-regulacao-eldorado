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
    watchFloatingTools();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyPortalNav, { once: true });
  else applyPortalNav();
})();
