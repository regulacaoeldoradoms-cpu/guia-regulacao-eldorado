'use strict';
// Keep a confirmed question as the return point; no storage/network/answer changes.
(() => {
  function install(reader, root, context) {
    if (!reader || !root) return;
    let captured = null, button = null;
    const same = (a, b) => a && b && a.generation === b.generation
      && a.sessionId === b.sessionId && a.missionId === b.missionId;
    const clear = () => { captured = null; button?.remove(); button = null; };
    root.addEventListener('click', event => {
      const link = event.target.closest?.('.study-feedback-review');
      const card = link?.closest('.study-question');
      const feedback = card?.querySelector('[data-feedback]');
      const current = context();
      if (!card || !current?.sessionId || !feedback || feedback.hidden
        || root.querySelector('#studyLessonPanel')?.hidden) return;
      clear(); captured = { ...current, card, feedback };
      button = root.ownerDocument.createElement('button');
      button.type = 'button'; button.id = 'studyReturnToQuestion'; button.className = 'study-reader-back';
      Object.assign(button.style, { fontSize: 'var(--study-reading-size, 1.125rem)', width: '100%', marginBottom: '12px' });
      const number = card.querySelector('[data-question-prompt] strong')?.textContent.match(/^(\d+)\./)?.[1];
      button.textContent = 'Voltar à questão' + (number ? ' ' + number : '') + ' e à justificativa';
      button.addEventListener('click', () => {
        const saved = captured;
        if (!same(saved, context()) || !saved.card.isConnected) { clear(); return; }
        clear(); reader.showPractice();
        saved.feedback.tabIndex = -1;
        saved.feedback.setAttribute('role', 'region');
        saved.feedback.setAttribute('aria-label', 'Resultado da resposta confirmada');
        saved.feedback.focus({ preventScroll: true });
        saved.feedback.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      });
      root.querySelector('#studyReaderFooter')?.prepend(button);
    });
    new MutationObserver(() => {
      if (captured && (!same(captured, context()) || !captured.card.isConnected)) clear();
    }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }
  window.StudyRereadReturn = Object.freeze({ install });
})();
