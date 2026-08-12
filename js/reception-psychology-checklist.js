'use strict';

(() => {
  const detail = document.getElementById('receptionDetail');
  if (!detail) return;

  const ITEMS = [
    'O encaminhamento informa um breve histórico clínico do paciente.',
    'O encaminhamento informa há quanto tempo os sintomas começaram e como evoluíram.',
    'O encaminhamento descreve os sintomas e o estado emocional atual.',
    'O encaminhamento informa o nível de impacto dos sintomas na qualidade de vida.',
    'O encaminhamento informa se há diagnóstico psiquiátrico ou transtorno mental prévio e, se houver, qual.',
    'O encaminhamento informa se o paciente faz ou já fez uso de medicações e, se sim, quais.',
    'O encaminhamento informa se há histórico de uso de substâncias psicoativas.'
  ];

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function isPsychology() {
    const title = detail.querySelector('.reception-title')?.textContent || '';
    const normalized = normalize(title);
    return normalized === 'psicologia' || normalized === 'psicologo' || normalized.includes('psicologia');
  }

  function rowHtml(item, index) {
    return `
      <div class="reception-item" data-type="mandatory" data-index="psych-${index}" data-item="${escapeHtml(item)}">
        <div class="reception-item-text">${escapeHtml(item)}</div>
        <select class="reception-status" aria-label="Situação do item">
          <option value="pending">Não conferido</option>
          <option value="ok">Consta no encaminhamento</option>
          <option value="missing">Não consta / precisa complementar</option>
        </select>
      </div>`;
  }

  function ensurePsychologyChecklist() {
    if (!isPsychology()) return;
    if (detail.querySelector('[data-psychology-reception-checklist="1"]')) return;

    const summary = detail.querySelector('.reception-summary');
    if (!summary) return;

    const section = document.createElement('section');
    section.className = 'reception-group reception-psychology-checklist';
    section.dataset.group = 'psychology-required';
    section.dataset.psychologyReceptionChecklist = '1';
    section.innerHTML = `
      <header>
        <h3>Informações obrigatórias no encaminhamento de Psicologia</h3>
        <p>A recepção deve apenas conferir se estas informações estão registradas. Não é necessário avaliar o conteúdo clínico.</p>
      </header>
      <div class="reception-items">
        ${ITEMS.map(rowHtml).join('')}
      </div>`;

    summary.insertAdjacentElement('beforebegin', section);
  }

  let queued = false;
  function scheduleEnsure() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      ensurePsychologyChecklist();
    });
  }

  const observer = new MutationObserver(scheduleEnsure);
  observer.observe(detail, { childList: true, subtree: true });
  scheduleEnsure();
})();
