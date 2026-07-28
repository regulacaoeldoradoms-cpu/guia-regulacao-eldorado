'use strict';

function applyLearningMode() {
  const detailPanel = document.getElementById('detailPanel');
  if (!detailPanel) return;

  detailPanel.querySelectorAll('#copyModelButton, #copyChecklistButton, .model-box').forEach((element) => element.remove());

  const checklistSection = detailPanel.querySelector('.clinical-section');
  if (!checklistSection) return;

  const title = checklistSection.querySelector('h3');
  if (title) title.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>Conferência durante o preenchimento';

  const intro = checklistSection.querySelector('.section-intro');
  if (intro) intro.textContent = 'Marque os itens enquanto redige o encaminhamento. A finalidade é conferir e incorporar os requisitos ao raciocínio clínico, sem gerar texto pronto.';

  if (!checklistSection.querySelector('.learning-note')) {
    const note = document.createElement('p');
    note.className = 'learning-note';
    note.textContent = 'Use o protocolo como referência de aprendizagem. O encaminhamento deve ser escrito pelo médico de forma individualizada, conforme a história, o exame e a necessidade clínica de cada paciente.';
    const checklist = checklistSection.querySelector('.medical-checklist');
    checklistSection.insertBefore(note, checklist || null);
  }

  const clearButton = checklistSection.querySelector('#clearChecklistButton');
  if (clearButton) clearButton.textContent = 'Desmarcar todos';

  const actionBar = detailPanel.querySelector('.action-bar');
  if (actionBar && !actionBar.querySelector('button')) actionBar.remove();
}

const detailPanel = document.getElementById('detailPanel');
if (detailPanel) {
  new MutationObserver(applyLearningMode).observe(detailPanel, { childList: true, subtree: true });
  applyLearningMode();
}
