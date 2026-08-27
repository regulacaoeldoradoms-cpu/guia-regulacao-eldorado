'use strict';

(() => {
  function init() {
    if (!document.body.classList.contains('mobile-council-mode')) return;

    const modal = document.getElementById('councilDetailModal');
    const panel = modal?.querySelector('.citizen-modal-panel');
    const loading = document.getElementById('detailLoading');
    const detailContent = document.getElementById('detailContent');
    const statusBox = document.getElementById('statusBox');
    if (!modal || !panel || !loading || !detailContent) return;

    let nav = document.getElementById('councilMobileDetailNav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.id = 'councilMobileDetailNav';
      nav.className = 'council-mobile-detail-nav';
      nav.setAttribute('aria-label', 'Atalhos da manifestação');
      nav.hidden = true;
      nav.innerHTML = [
        '<button type="button" data-council-scroll="detailSubject">Relato</button>',
        '<button type="button" data-council-scroll="messageThread">Conversa</button>',
        '<button type="button" class="president-only" data-council-scroll="statusBox">Andamento</button>',
        '<button type="button" data-council-scroll="timeline">Histórico</button>'
      ].join('');
      loading.insertAdjacentElement('afterend', nav);
    }

    const statusShortcut = nav.querySelector('[data-council-scroll="statusBox"]');

    function syncNav() {
      nav.hidden = detailContent.hidden || !modal.classList.contains('open');
      if (statusShortcut) statusShortcut.hidden = Boolean(statusBox?.hidden || document.body.classList.contains('council-member-readonly'));
    }

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-council-scroll]');
      if (!button) return;
      const target = document.getElementById(button.dataset.councilScroll);
      if (!target || target.hidden) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const detailObserver = new MutationObserver(syncNav);
    detailObserver.observe(detailContent, { attributes: true, attributeFilter: ['hidden'] });
    if (statusBox) detailObserver.observe(statusBox, { attributes: true, attributeFilter: ['hidden', 'style'] });

    const modalObserver = new MutationObserver(() => {
      const opened = modal.classList.contains('open');
      if (opened) panel.scrollTop = 0;
      syncNav();
    });
    modalObserver.observe(modal, { attributes: true, attributeFilter: ['class', 'aria-hidden'] });

    /* A política de membro é aplicada após o carregamento; sincroniza novamente. */
    window.addEventListener('load', syncNav);
    window.setTimeout(syncNav, 300);
    window.setTimeout(syncNav, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
