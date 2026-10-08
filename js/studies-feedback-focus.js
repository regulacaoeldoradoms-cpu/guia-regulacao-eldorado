'use strict';
// Called only for a fresh confirmed attempt in the current study session.
(() => {
  function capture(card, button) {
    const doc = card.ownerDocument;
    const startedHere = doc.activeElement === button;
    let moved = false;
    const track = event => { if (event.target !== button && event.target !== doc.body) moved = true; };
    doc.addEventListener('focusin', track);
    const cancel = () => doc.removeEventListener('focusin', track);
    return {
      cancel,
      confirm() {
        cancel();
        const feedback = card.querySelector('[data-feedback]');
        if (!startedHere || moved || !card.isConnected || !feedback?.getClientRects().length) return;
        feedback.tabIndex = -1;
        feedback.setAttribute('role', 'region');
        feedback.setAttribute('aria-label', 'Resultado da resposta confirmada');
        feedback.focus({ preventScroll: true });
        feedback.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      }
    };
  }
  window.StudyFeedbackFocus = Object.freeze({ capture });
})();
