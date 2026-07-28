'use strict';

function applyLearningMode(detailPanel) {
  detailPanel.querySelectorAll('#copyModelButton, #copyChecklistButton, .model-box').forEach((element) => element.remove());

  const checklistSection = detailPanel.querySelector('.clinical-section');
  if (checklistSection) {
    const title = checklistSection.querySelector('h3');
    const expectedTitle = 'Conferência durante o preenchimento';
    if (title && title.textContent.trim() !== expectedTitle) {
      title.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>Conferência durante o preenchimento';
    }

    const intro = checklistSection.querySelector('.section-intro');
    const expectedIntro = 'Marque os itens enquanto redige o encaminhamento. A finalidade é conferir e incorporar os requisitos ao raciocínio clínico, sem gerar texto pronto.';
    if (intro && intro.textContent !== expectedIntro) intro.textContent = expectedIntro;

    if (!checklistSection.querySelector('.learning-note')) {
      const note = document.createElement('p');
      note.className = 'learning-note';
      note.textContent = 'Use o protocolo como referência de aprendizagem. O encaminhamento deve ser escrito pelo médico de forma individualizada, conforme a história, o exame e a necessidade clínica de cada paciente.';
      const checklist = checklistSection.querySelector('.medical-checklist');
      checklistSection.insertBefore(note, checklist || null);
    }

    const clearButton = checklistSection.querySelector('#clearChecklistButton');
    if (clearButton && clearButton.textContent !== 'Desmarcar todos') clearButton.textContent = 'Desmarcar todos';
  }

  const printButton = detailPanel.querySelector('#printGuidanceButton');
  const expectedPrintLabel = 'Imprimir orientação ao paciente';
  if (printButton && printButton.textContent.trim() !== expectedPrintLabel) {
    printButton.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>Imprimir orientação ao paciente';
  }

  const actionBar = detailPanel.querySelector('.action-bar');
  if (actionBar && !actionBar.querySelector('button')) actionBar.remove();
}

const detailPanel = document.getElementById('detailPanel');
if (detailPanel) {
  let applying = false;
  const observer = new MutationObserver(() => {
    if (applying) return;
    applying = true;
    observer.disconnect();
    try {
      applyLearningMode(detailPanel);
    } finally {
      observer.observe(detailPanel, { childList: true, subtree: true });
      applying = false;
    }
  });

  observer.observe(detailPanel, { childList: true, subtree: true });
  applyLearningMode(detailPanel);
}
