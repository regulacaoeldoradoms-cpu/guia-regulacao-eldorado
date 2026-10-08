'use strict';
// No network, storage, answers or progression. Native region scrolling.
(() => {
  let sequence = 0;
  const observations = new WeakMap();
  function enhance(wrapper) {
    if (wrapper.dataset.studyTable === '1') return;
    const table = wrapper.querySelector('.study-content-table');
    if (!table) return;
    wrapper.dataset.studyTable = '1';
    const hint = document.createElement('p');
    hint.id = 'studyTableHint' + ++sequence;
    hint.className = 'study-table-hint';
    hint.textContent = 'A tabela tem mais colunas que a tela. Deslize a tabela ou use as setas esquerda/direita quando ela estiver em foco. Tab segue para o próximo controle.';
    wrapper.before(hint);
    const update = () => {
      const scrollable = wrapper.clientWidth > 0 && wrapper.scrollWidth > wrapper.clientWidth + 1;
      hint.hidden = !scrollable;
      wrapper.tabIndex = scrollable ? 0 : -1;
      if (scrollable) wrapper.setAttribute('aria-describedby', hint.id);
      else wrapper.removeAttribute('aria-describedby');
    };
    const observer = new ResizeObserver(() => {
      if (!wrapper.isConnected) { observer.disconnect(); return; }
      update();
    });
    observations.set(wrapper, { observer, hint });
    observer.observe(wrapper); observer.observe(table); update();
  }
  function scan(node) {
    if (!(node instanceof Element)) return;
    if (node.matches('.study-table-scroll')) enhance(node);
    node.querySelectorAll('.study-table-scroll').forEach(enhance);
  }
  function release(node) {
    if (!(node instanceof Element) || node.isConnected) return;
    const wrappers = [...node.querySelectorAll('.study-table-scroll')];
    if (node.matches('.study-table-scroll')) wrappers.push(node);
    for (const wrapper of wrappers) {
      const entry = observations.get(wrapper);
      entry?.observer.disconnect(); entry?.hint.remove();
      observations.delete(wrapper); delete wrapper.dataset.studyTable;
    }
  }
  new MutationObserver(records => records.forEach(record => {
    record.removedNodes.forEach(release); record.addedNodes.forEach(scan);
  }))
    .observe(document.body, { childList: true, subtree: true });
  scan(document.body);
})();
