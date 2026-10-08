'use strict';
(() => {
  let dispose = () => {};
  function clear() { dispose(); dispose = () => {}; }
  function offer(reader, root, context) {
    clear();
    const title = root.querySelector('#studyPracticeTitle');
    if (!reader || !title || !context()) return;
    const panel = root.ownerDocument.createElement('section'); panel.id = 'studyPendingNavigation';
    const notice = root.ownerDocument.createElement('p'); notice.id = 'studyPendingNotice';
    notice.setAttribute('role', 'status'); notice.setAttribute('aria-live', 'polite');
    notice.style.fontSize = 'var(--study-reading-size, 1.125rem)';
    panel.append(notice); title.after(panel);
    let key = '', action = null;
    const observer = new MutationObserver(render);
    function render() {
      const current = context();
      if (!current) { clear(); return; }
      const confirmed = new Set(current.confirmed);
      const index = current.questions.findIndex(id => !confirmed.has(id));
      const nextKey = index < 0 ? 'complete' : current.questions[index];
      const message = index < 0 ? 'Todas as respostas desta rodada estão confirmadas. Revise as justificativas e conclua quando quiser.'
        : `${confirmed.size} de ${current.questions.length} respostas confirmadas nesta rodada. Continue pela questão ${index + 1}, ou consulte as anteriores.`;
      if (notice.textContent !== message) notice.textContent = message;
      if (nextKey !== key) {
        key = nextKey; action?.remove(); action = root.ownerDocument.createElement('button');
        action.type = 'button'; action.className = 'study-reader-back';
        action.id = index < 0 ? 'studyGoConclusion' : 'studyGoPending';
        action.textContent = index < 0 ? 'Ir à conclusão' : `Ir para a primeira questão pendente (questão ${index + 1})`;
        Object.assign(action.style, { fontSize: 'var(--study-reading-size, 1.125rem)', width: '100%', marginBottom: '16px' });
        action.addEventListener('click', () => {
          const latest = context(); if (!latest || latest.busy) return;
          const ids = new Set(latest.confirmed), pending = latest.questions.find(id => !ids.has(id));
          reader.showPractice();
          const target = pending ? [...root.querySelectorAll('[data-question-id]')].find(n => n.dataset.questionId === pending)?.querySelector('[data-question-prompt] strong') : root.querySelector('#completeMission');
          if (!target || target.disabled) return;
          target.tabIndex = -1; target.focus({ preventScroll: true });
          target.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        }); panel.append(action);
      }
      if (action.disabled !== current.busy) action.disabled = current.busy;
    }
    dispose = () => { observer.disconnect(); panel.remove(); };
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'hidden'] });
    render();
  }
  window.StudyPendingNavigation = Object.freeze({ offer, clear });
})();
