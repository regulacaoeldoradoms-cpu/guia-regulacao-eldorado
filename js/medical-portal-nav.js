'use strict';

(() => {
  function applyPortalNav() {
    const nav = document.querySelector('.top-nav');
    if (!nav || nav.querySelector('[data-portal-home]')) return;
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyPortalNav, { once: true });
  else applyPortalNav();
})();
