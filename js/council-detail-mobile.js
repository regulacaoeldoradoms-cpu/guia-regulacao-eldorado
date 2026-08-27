'use strict';

(() => {
  function init() {
    if (!document.body.classList.contains('mobile-council-mode')) return;

    const modal = document.getElementById('councilDetailModal');
    const panel = modal?.querySelector('.citizen-modal-panel');
    const detailContent = document.getElementById('detailContent');
    const main = detailContent?.querySelector('.council-detail-main');
    const statusBox = document.getElementById('statusBox');
    const historySection = document.getElementById('historySection');
    const notesSection = document.getElementById('internalNotesSection');
    const replyButton = document.getElementById('officialReplyButton');
    const saveStatus = document.getElementById('saveStatus');
    if (!modal || !panel || !detailContent) return;

    /* No celular, ações de gestão entram no fluxo principal. Desktop permanece em duas colunas. */
    if (main && statusBox && historySection) main.insertBefore(statusBox, historySection);
    if (main && notesSection && historySection) historySection.insertAdjacentElement('afterend', notesSection);

    /* Texto real dos botões: evita duplicações causadas por CSS legado. */
    if (replyButton) replyButton.textContent = 'Enviar mensagem';
    if (saveStatus) saveStatus.textContent = 'Atualizar andamento';

    let nav = document.getElementById('councilMobileDetailNav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.id = 'councilMobileDetailNav';
      nav.className = 'council-mobile-detail-nav';
      nav.setAttribute('aria-label', 'Atalhos da manifestação');
      nav.hidden = true;
    }

    nav.innerHTML = [
      '<button type="button" data-council-scroll="detailStory">Relato</button>',
      '<button type="button" data-council-scroll="detailConversation">Conversa</button>',
      '<button type="button" class="president-only" data-council-scroll="statusBox">Andamento</button>',
      '<button type="button" data-council-scroll="historySection">Histórico</button>'
    ].join('');
    panel.appendChild(nav);

    const statusShortcut = nav.querySelector('[data-council-scroll="statusBox"]');
    const buttons = [...nav.querySelectorAll('[data-council-scroll]')];

    function syncNav() {
      const opened = modal.classList.contains('open');
      nav.hidden = detailContent.hidden || !opened;
      if (statusShortcut) {
        statusShortcut.hidden = Boolean(statusBox?.hidden || document.body.classList.contains('council-member-readonly'));
      }
    }

    function scrollToTarget(id) {
      const target = document.getElementById(id);
      if (!target || target.hidden) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.councilScroll === id));
    }

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-council-scroll]');
      if (!button) return;
      scrollToTarget(button.dataset.councilScroll);
    });

    const detailObserver = new MutationObserver(syncNav);
    detailObserver.observe(detailContent, { attributes: true, attributeFilter: ['hidden'] });
    if (statusBox) detailObserver.observe(statusBox, { attributes: true, attributeFilter: ['hidden', 'style'] });

    const modalObserver = new MutationObserver(() => {
      const opened = modal.classList.contains('open');
      if (opened) {
        panel.scrollTop = 0;
        buttons.forEach((button) => button.classList.remove('is-active'));
        buttons[0]?.classList.add('is-active');
      }
      syncNav();
    });
    modalObserver.observe(modal, { attributes: true, attributeFilter: ['class', 'aria-hidden'] });

    /* Marca no dock a seção que está sendo visualizada. */
    const observedIds = ['detailStory', 'detailConversation', 'statusBox', 'historySection'];
    const sections = observedIds.map((id) => document.getElementById(id)).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      const sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && !entry.target.hidden)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.councilScroll === visible.target.id));
      }, { root: panel, rootMargin: '-90px 0px -45% 0px', threshold: [0.15, 0.35, 0.6] });
      sections.forEach((section) => sectionObserver.observe(section));
    }

    window.addEventListener('load', syncNav);
    window.setTimeout(syncNav, 250);
    window.setTimeout(syncNav, 900);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
