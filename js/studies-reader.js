'use strict';

// Navegação de leitura apenas: não registra notas, tempo, XP ou conclusões.
// O controlador preserva o DOM das questões ao alternar aula/prática.
(() => {
  function partIndex(value, length) {
    const size = Number.isInteger(length) && length > 0 ? length : 0;
    const requested = Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0;
    return size ? Math.max(0, Math.min(size - 1, requested)) : 0;
  }

  function practiceProgress(answered, total) {
    const size = Number.isInteger(total) && total > 0 ? total : 0;
    const count = Number.isFinite(Number(answered))
      ? Math.max(0, Math.min(size, Math.trunc(Number(answered)))) : 0;
    return { count, total: size, percent: size ? Math.round(count / size * 100) : 0 };
  }

  function create(root) {
    if (!root) return null;
    const find = (id) => root.querySelector(`#${id}`);
    const names = [
      'studyReaderNav', 'studyReadButton', 'studyPracticeButton', 'studyLessonPanel',
      'studyPracticePanel', 'studyReaderControls', 'studyReaderFooter', 'studySectionSelect', 'studyPartLabel',
      'studyPreviousPart', 'studyNextPart', 'studyShowAll', 'studyStartPractice',
      'studyReturnLesson', 'studyFontSmaller', 'studyFontLarger', 'studyFontLabel',
      'lessonSections', 'studyPracticeTitle', 'studyFocusBody'
    ];
    const el = Object.fromEntries(names.map((id) => [id, find(id)]));
    if (names.some((id) => !el[id])) return null; // HTML anterior: manter aula linear.
    let sections = [];
    let index = 0;
    let all = false;
    let active = false;
    let font = 0;
    const fontSizes = [1.125, 1.25, 1.375, 1.5];

    function focusAt(target) {
      el.studyFocusBody.scrollTop = 0;
      target?.focus({ preventScroll: true });
    }

    function paintParts(moveFocus = false) {
      const nodes = [...el.lessonSections.children];
      nodes.forEach((node, position) => { node.hidden = !all && position !== index; });
      el.studySectionSelect.value = String(index);
      el.studyPartLabel.textContent = all
        ? `Aula inteira · ${sections.length} partes para consultar`
        : `Parte ${index + 1} de ${sections.length} · leitura`;
      el.studyShowAll.setAttribute('aria-pressed', String(all));
      el.studyPreviousPart.disabled = all || index === 0;
      el.studyNextPart.disabled = all || index === sections.length - 1;
      if (moveFocus) focusAt(nodes[all ? 0 : index]?.querySelector('h2'));
    }

    function setView(view, moveFocus = true) {
      if (!active) return;
      const reading = view !== 'practice';
      el.studyLessonPanel.hidden = !reading;
      el.studyPracticePanel.hidden = reading;
      el.studyReadButton.setAttribute('aria-pressed', String(reading));
      el.studyPracticeButton.setAttribute('aria-pressed', String(!reading));
      if (moveFocus) {
        const heading = reading
          ? el.lessonSections.children[all ? 0 : index]?.querySelector('h2')
          : el.studyPracticeTitle;
        focusAt(heading);
      }
    }

    function fontSize(step) {
      font = Math.max(0, Math.min(fontSizes.length - 1, font + step));
      root.style.setProperty('--study-reading-size', `${fontSizes[font]}rem`);
      el.studyFontLabel.textContent = ['Padrão', 'Maior', 'Grande', 'Extra grande'][font];
      el.studyFontSmaller.disabled = font === 0;
      el.studyFontLarger.disabled = font === fontSizes.length - 1;
    }

    function mount(mission) {
      sections = Array.isArray(mission?.sections) ? mission.sections : [];
      active = sections.length > 0;
      for (const id of ['studyReaderNav', 'studyReaderControls', 'studyReaderFooter', 'studyReturnLesson']) {
        el[id].hidden = !active;
      }
      el.studyLessonPanel.hidden = false;
      el.studyPracticePanel.hidden = false;
      if (!active) return false;
      index = 0;
      all = false;
      const doc = root.ownerDocument;
      const content = doc.createDocumentFragment();
      const options = doc.createDocumentFragment();
      sections.forEach((section, position) => {
        const node = doc.createElement('section');
        node.className = 'study-section';
        // Texto do catálogo é exibido como texto; nunca interpretado como HTML.
        const heading = doc.createElement('h2');
        heading.textContent = String(section.heading || `Parte ${position + 1}`);
        heading.tabIndex = -1;
        node.append(heading);
        for (const paragraph of String(section.body || '').split(/\n\s*\n/)) {
          const p = doc.createElement('p');
          p.textContent = paragraph;
          node.append(p);
        }
        content.append(node);
        const option = doc.createElement('option');
        option.value = String(position);
        option.textContent = heading.textContent;
        options.append(option);
      });
      el.lessonSections.replaceChildren(content);
      el.studySectionSelect.replaceChildren(options);
      paintParts();
      fontSize(0);
      setView('lesson', false);
      focusAt(find('focusTitle'));
      return true;
    }

    el.studyReadButton.addEventListener('click', () => setView('lesson'));
    el.studyPracticeButton.addEventListener('click', () => setView('practice'));
    el.studyStartPractice.addEventListener('click', () => setView('practice'));
    el.studyReturnLesson.addEventListener('click', () => setView('lesson'));
    el.studySectionSelect.addEventListener('change', () => {
      index = partIndex(el.studySectionSelect.value, sections.length);
      all = false;
      paintParts(true);
    });
    el.studyPreviousPart.addEventListener('click', () => {
      index = partIndex(index - 1, sections.length);
      paintParts(true);
    });
    el.studyNextPart.addEventListener('click', () => {
      index = partIndex(index + 1, sections.length);
      paintParts(true);
    });
    el.studyShowAll.addEventListener('click', () => {
      all = !all;
      paintParts();
    });
    el.studyFontSmaller.addEventListener('click', () => fontSize(-1));
    el.studyFontLarger.addEventListener('click', () => fontSize(1));
    return Object.freeze({ mount });
  }

  window.StudyReader = Object.freeze({ create, partIndex, practiceProgress });
})();
