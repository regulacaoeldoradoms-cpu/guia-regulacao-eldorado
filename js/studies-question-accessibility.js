'use strict';
// Question semantics. Existing DOM contains only server-approved public/confirmed text.
(() => {
  let sequence = 0;
  function update(card) {
    const title = card.querySelector('[data-question-prompt] strong');
    const group = card.querySelector('fieldset');
    const button = card.querySelector('[data-answer-question]');
    const feedback = card.querySelector('[data-feedback]');
    if (!title || !group || !button || !feedback) return;
    let notice = card.querySelector('[data-study-question-status]');
    if (!notice) {
      const id = 'studyQuestion' + ++sequence;
      if (!title.id) title.id = id + 'Title';
      if (!feedback.id) feedback.id = id + 'Feedback';
      notice = document.createElement('p'); notice.id = id + 'Status';
      notice.dataset.studyQuestionStatus = '1';
      notice.setAttribute('role', 'status'); notice.setAttribute('aria-live', 'polite');
      notice.setAttribute('aria-atomic', 'true');
      Object.assign(notice.style, { position: 'absolute', width: '1px', height: '1px',
        padding: '0', margin: '-1px', overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' });
      card.append(notice);
    }
    group.setAttribute('aria-labelledby', title.id);
    const confirmed = button.disabled && button.textContent === 'Respondida';
    const pending = button.disabled && !confirmed;
    group.setAttribute('aria-busy', String(pending));
    group.setAttribute('aria-describedby', notice.id + (!pending && !feedback.hidden && feedback.textContent ? ' ' + feedback.id : ''));
    let message = pending ? 'Registrando resposta.' : confirmed ? 'Resposta confirmada.'
      : !feedback.hidden && button.textContent === 'Tentar registrar novamente'
        ? 'Resposta ainda não confirmada. Use Tentar registrar novamente.'
        : !feedback.hidden && feedback.textContent === 'Escolha uma alternativa antes de responder.'
          ? feedback.textContent : '';
    const number = title.textContent.match(/^(\d+)\./)?.[1];
    if (message && number) message = 'Questão ' + number + ': ' + message;
    if (notice.textContent !== message) notice.textContent = message;
  }
  const observer = new MutationObserver(records => {
    const cards = new Set();
    for (const record of records) {
      const node = record.target instanceof Element ? record.target : record.target.parentElement;
      const current = node?.closest('.study-question'); if (current) cards.add(current);
      for (const added of record.addedNodes) if (added instanceof Element) {
        if (added.matches('.study-question')) cards.add(added);
        added.querySelectorAll('.study-question').forEach(card => cards.add(card));
      }
    }
    cards.forEach(card => { if (card.isConnected) update(card); });
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true,
    attributeFilter: ['class', 'hidden', 'disabled'] });
  document.querySelectorAll('.study-question').forEach(update);
})();
