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

  // Blocos produzidos do conteúdo revisado durante o preparo. Texto sempre via DOM;
  // sem HTML, Markdown executável, recursos externos ou mudanças no estado da rodada.
  function renderContent(parent, blocks, onReference) {
    if (!Array.isArray(blocks) || !blocks.length) return false;
    const doc = parent.ownerDocument;
    const make = (tag, text, className) => {
      const node = doc.createElement(tag);
      if (text !== undefined) node.textContent = String(text);
      if (className) node.className = className;
      return node;
    };
    for (const block of blocks) {
      if (block.type === 'paragraph') {
        const paragraph = make('p');
        for (const run of block.runs) {
          if (run.missionId && onReference) {
            const button = make('button', run.text, 'study-inline-reference');
            button.type = 'button';
            button.dataset.studyReference = run.missionId;
            button.addEventListener('click', () => onReference(run));
            paragraph.append(button);
          } else if (typeof run.href === 'string' && run.href.startsWith('https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/blob/')) {
            const link = make('a', run.text); link.href = run.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; paragraph.append(link);
          } else paragraph.append(doc.createTextNode(run.text));
        }
        parent.append(paragraph);
      } else if (block.type === 'table') {
        const wrapper = make('div', undefined, 'study-table-scroll');
        wrapper.tabIndex = 0;
        wrapper.setAttribute('role', 'region');
        wrapper.setAttribute('aria-label', `Tabela: ${block.headers.join(' e ')}`);
        const table = make('table', undefined, 'study-content-table');
        const head = make('thead'), row = make('tr'), body = make('tbody');
        for (const label of block.headers) { const th = make('th', label); th.scope = 'col'; row.append(th); }
        head.append(row);
        for (const values of block.rows) { const tr = make('tr'); for (const value of values) tr.append(make('td', value)); body.append(tr); }
        table.append(head, body); wrapper.append(table); parent.append(wrapper);
      } else if (block.type === 'flow') {
        const figure = make('figure', undefined, 'study-flow');
        figure.setAttribute('aria-label', 'Fluxos de recursos entre os participantes');
        for (const edge of block.edges) {
          const step = make('div', undefined, 'study-flow-step');
          step.append(make('div', edge.from, 'study-flow-node'), make('div', `↓ ${edge.label} ↓`, 'study-flow-arrow'), make('div', edge.to, 'study-flow-node'));
          figure.append(step);
        }
        parent.append(figure);
      } else if (block.type === 'boxplot') {
        // Explicit minimum–maximum convention. No fences or inferred outliers.
        const groups = block.groups;
        if (!Number.isFinite(block.min) || !Number.isFinite(block.max) || block.min >= block.max
          || !Array.isArray(groups) || !groups.length || groups.length > 10
          || groups.some(group => {
            const values = [group.min, group.q1, group.median, group.q3, group.max];
            return values.some((value, index) => !Number.isFinite(value)
              || value < block.min || value > block.max || (index > 0 && value < values[index - 1]));
          })) return false;
        const figure = make('figure', undefined, 'study-chart');
        figure.append(make('figcaption', block.title), make('p', 'Bigodes no mínimo e máximo; escala em ' + block.unit + '. Valores também descritos abaixo.', 'study-reader-caption'));
        const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const height = 75 + groups.length * 60;
        svg.setAttribute('viewBox', '0 0 360 ' + height); svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', String(block.title));
        const element = (tag, attrs, text) => {
          const node = doc.createElementNS('http://www.w3.org/2000/svg', tag);
          for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
          if (text !== undefined) node.textContent = String(text);
          svg.append(node); return node;
        };
        const x = value => 40 + (value - block.min) / (block.max - block.min) * 285;
        groups.forEach((group, index) => {
          const y = 35 + index * 60;
          element('text', { x: 8, y: y + 6 }, group.label);
          element('line', { x1: x(group.min), x2: x(group.max), y1: y, y2: y, class: 'study-chart-line' });
          element('rect', { x: x(group.q1), y: y - 13, width: x(group.q3) - x(group.q1), height: 26, fill: 'var(--reader-surface, #ffffff)', stroke: 'currentColor', 'stroke-width': 2 });
          for (const value of [group.min, group.median, group.max]) element('line', { x1: x(value), x2: x(value), y1: y - 15, y2: y + 15, stroke: 'currentColor', 'stroke-width': 2 });
          figure.append(make('p', group.label + ': mínimo ' + group.min + ', Q1 ' + group.q1 + ', mediana ' + group.median + ', Q3 ' + group.q3 + ', máximo ' + group.max + ' ' + block.unit + '.', 'study-reader-caption'));
        });
        for (let i = 0; i <= 4; i++) {
          const value = block.min + (block.max - block.min) * i / 4;
          element('text', { x: x(value), y: height - 18, 'text-anchor': 'middle' }, value.toLocaleString('pt-BR'));
        }
        figure.insertBefore(svg, figure.children[2] || null); parent.append(figure);
      } else if (block.type === 'line-chart') {
        const figure = make('figure', undefined, 'study-chart');
        figure.append(make('figcaption', block.title), make('p', `Horizontal: ${block.xLabel}. Vertical: ${block.yLabel}.`, 'study-reader-caption'));
        const scroll = make('div', undefined, 'study-chart-scroll');
        scroll.tabIndex = 0;
        scroll.setAttribute('role', 'region');
        scroll.setAttribute('aria-label', 'Gráfico; dados também disponíveis na tabela anterior');
        const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 360 260'); svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', `${block.title}. ${block.x.map((value, i) => `${value} anos: ${block.y[i]}% a.a.`).join('; ')}`);
        const element = (tag, attrs, text) => {
          const node = doc.createElementNS('http://www.w3.org/2000/svg', tag);
          for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
          if (text !== undefined) node.textContent = String(text);
          svg.append(node); return node;
        };
        const x = value => 55 + (value - block.x[0]) / (block.x.at(-1) - block.x[0]) * 260;
        const y = value => 210 - (value - block.yMin) / (block.yMax - block.yMin) * 180;
        for (let index = 0; index <= 4; index++) {
          const value = block.yMin + (block.yMax - block.yMin) * index / 4;
          element('line', { x1: 55, x2: 315, y1: y(value), y2: y(value), class: 'study-chart-grid' });
          element('text', { x: 43, y: y(value) + 6, 'text-anchor': 'end' }, `${value.toLocaleString('pt-BR')}%`);
        }
        element('path', { d: 'M55 30V210H315', class: 'study-chart-axis' });
        element('polyline', { points: block.x.map((value, i) => `${x(value)},${y(block.y[i])}`).join(' '), class: 'study-chart-line' });
        for (const [index, value] of block.x.entries()) {
          element('text', { x: x(value), y: 240, 'text-anchor': 'middle' }, `${value} ano${value === 1 ? '' : 's'}`);
          element('circle', { cx: x(value), cy: y(block.y[index]), r: 5, class: 'study-chart-point' });
        }
        scroll.append(svg); figure.append(scroll); parent.append(figure);
      }
    }
    return true;
  }

  function renderApplications(root, mission, openSection) {
    const practice = root?.querySelector('#studyPracticePanel');
    const quiz = practice?.querySelector('.study-quiz');
    if (!quiz) return 0; // Compatibilidade com a página anterior.
    const doc = root.ownerDocument;
    const make = (tag, text, className) => {
      const node = doc.createElement(tag);
      if (text !== undefined) node.textContent = String(text);
      if (className) node.className = className;
      return node;
    };
    let panel = practice.querySelector('#studyApplicationPanel');
    if (!panel) {
      panel = make('section', undefined, 'study-application-panel');
      panel.id = 'studyApplicationPanel';
      panel.setAttribute('aria-labelledby', 'studyApplicationTitle');
      practice.insertBefore(panel, quiz);
    }
    panel.replaceChildren();
    const sections = Array.isArray(mission?.sections) ? mission.sections : [];
    const items = sections.flatMap((section) => Array.isArray(section.applicationTasks) ? section.applicationTasks : [])
      .filter((item) => typeof item?.id === 'string' && typeof item.title === 'string'
        && typeof item.prompt === 'string' && typeof item.model === 'string'
        && Array.isArray(item.criteria) && item.criteria.every((value) => typeof value === 'string')
        && Array.isArray(item.sectionIds));
    panel.hidden = items.length === 0;
    if (!items.length) return 0;
    const title = make('h2', 'Aplique com suas palavras');
    title.id = 'studyApplicationTitle';
    const notice = make('p', 'Autoavaliação opcional, sem nota ou XP. Tente explicar antes de consultar o comentário. Não há correção automática do seu texto.', 'study-reader-caption');
    const privacy = make('p', 'Rascunho temporário: não é enviado nem salvo na conta. Recarregar a página ou abrir outra missão apaga o texto.', 'study-reader-caption');
    privacy.id = 'studyApplicationPrivacy';
    panel.append(title, notice, privacy);
    items.forEach((item, position) => {
      const card = make('article', undefined, 'study-application-task');
      card.dataset.applicationId = item.id;
      card.append(make('h3', `${position + 1}. ${item.title}`), make('p', item.prompt));
      const label = make('label', 'Minha explicação (opcional)');
      const input = make('textarea');
      input.id = `studyApplicationDraft${position}`;
      input.rows = 4;
      input.maxLength = 3000;
      input.autocomplete = 'off';
      input.setAttribute('aria-describedby', 'studyApplicationPrivacy');
      label.htmlFor = input.id;
      card.append(label, input);
      const feedback = make('details', undefined, 'study-application-feedback');
      feedback.append(make('summary', 'Comparar com uma explicação possível'), make('p', item.model));
      feedback.append(make('h4', 'Confira seu raciocínio'));
      const checklist = make('ul');
      for (const criterion of item.criteria) checklist.append(make('li', criterion));
      feedback.append(checklist, make('p', 'Compare as ideias, não as palavras exatas. Se algum ponto faltou, releia a explicação e tente novamente.', 'study-reader-caption'));
      card.append(feedback);
      const links = make('div', undefined, 'study-application-links');
      for (const sectionId of [...new Set(item.sectionIds)]) {
        const section = sections.find((entry) => entry.id === sectionId);
        if (!section) continue;
        const button = make('button', `Reler: ${section.heading}`, 'study-reader-back');
        button.type = 'button';
        button.dataset.readSection = sectionId;
        button.addEventListener('click', () => openSection(sectionId));
        links.append(button);
      }
      card.append(links);
      panel.append(card);
    });
    return items.length;
  }

  function create(root, onReference) {
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
    let view = 'lesson';
    let positionObserver = null;
    function position() { return active ? { sectionId: sections[index]?.id, all, view } : null; }
    function notifyPosition() { positionObserver?.(position()); }
    let font = 0;
    const fontSizes = [1.125, 1.25, 1.375, 1.5];
    let referencePanel = null;
    let referenceReturn = null;

    function closeReference() {
      if (!referenceReturn) return;
      for (const [node, hidden] of referenceReturn.panels) node.hidden = hidden;
      referencePanel.hidden = true;
      const target = referenceReturn.focus;
      referenceReturn = null;
      focusAt(target);
    }

    function showReference(mission, sectionId, wholeLesson = false) {
      const selected = wholeLesson ? mission.sections : mission.sections?.filter(section => section.id === sectionId);
      if (!active || !selected?.length) return false;
      const doc = root.ownerDocument;
      if (!referencePanel) {
        referencePanel = doc.createElement('section');
        referencePanel.id = 'studyReferencePanel';
        referencePanel.className = 'study-reference-panel';
        referencePanel.setAttribute('aria-labelledby', 'studyReferenceTitle');
        el.studyLessonPanel.before(referencePanel);
      }
      if (!referenceReturn) referenceReturn = {
        focus: doc.activeElement,
        panels: ['studyReaderNav', 'studyReaderControls', 'studyReaderFooter', 'studyLessonPanel', 'studyPracticePanel'].map(id => [el[id], el[id].hidden])
      };
      for (const [node] of referenceReturn.panels) node.hidden = true;
      referencePanel.replaceChildren(); referencePanel.hidden = false;
      const title = doc.createElement('h2'); title.id = 'studyReferenceTitle'; title.tabIndex = -1;
      title.textContent = `Consulta · ${mission.shortTitle || mission.title}`;
      const back = doc.createElement('button'); back.type = 'button'; back.className = 'study-reader-back';
      back.id = 'studyCloseReference'; back.textContent = 'Voltar à atividade'; back.addEventListener('click', closeReference);
      referencePanel.append(title, back);
      for (const section of selected) {
        const node = doc.createElement('section'); node.className = 'study-section';
        const heading = doc.createElement('h3'); heading.textContent = section.heading; node.append(heading);
        if (!renderContent(node, section.presentation, onReference)) {
          for (const text of String(section.body || '').split(/\n\s*\n/)) { const p = doc.createElement('p'); p.textContent = text; node.append(p); }
        }
        referencePanel.append(node);
      }
      focusAt(title);
      return true;
    }

    function focusAt(target) {
      el.studyFocusBody.scrollTop = 0;
      target?.focus({ preventScroll: true });
      // Em telas baixas, o índice/objetivo pode deixar o título fora da área visível.
      if (target && el.studyFocusBody.contains(target)) {
        const viewport = el.studyFocusBody.getBoundingClientRect();
        const bounds = target.getBoundingClientRect();
        if (bounds.top < viewport.top || bounds.bottom > viewport.bottom) {
          target.scrollIntoView({ block: 'start', behavior: 'auto' });
        }
      }
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
      notifyPosition();
    }

    function setView(nextView, moveFocus = true) {
      if (!active) return;
      const reading = nextView !== 'practice';
      view = reading ? 'lesson' : 'practice';
      el.studyLessonPanel.hidden = !reading;
      el.studyPracticePanel.hidden = reading;
      el.studyReadButton.setAttribute('aria-pressed', String(reading));
      el.studyPracticeButton.setAttribute('aria-pressed', String(!reading));
      notifyPosition();
      if (moveFocus) {
        const heading = reading
          ? el.lessonSections.children[all ? 0 : index]?.querySelector('h2')
          : el.studyPracticeTitle;
        focusAt(heading);
      }
    }

    function openSection(sectionId) {
      if (!active || typeof sectionId !== 'string') return false;
      const next = sections.findIndex((section) => section.id === sectionId);
      if (next < 0) return false;
      index = next;
      all = false;
      paintParts();
      setView('lesson');
      return true;
    }

    function fontSize(step) {
      font = Math.max(0, Math.min(fontSizes.length - 1, font + step));
      root.style.setProperty('--study-reading-size', `${fontSizes[font]}rem`);
      el.studyFontLabel.textContent = ['Padrão', 'Maior', 'Grande', 'Extra grande'][font];
      el.studyFontSmaller.disabled = font === 0;
      el.studyFontLarger.disabled = font === fontSizes.length - 1;
    }

    function mount(mission) {
      positionObserver = null;
      closeReference();
      sections = Array.isArray(mission?.sections) ? mission.sections : [];
      active = sections.length > 0;
      for (const id of ['studyReaderNav', 'studyReaderControls', 'studyReaderFooter', 'studyReturnLesson']) {
        el[id].hidden = !active;
      }
      el.studyLessonPanel.hidden = false;
      el.studyPracticePanel.hidden = false;
      // Somente dados didáticos: rascunhos nunca deixam o DOM da missão aberta.
      renderApplications(root, mission, openSection);
      if (!active) return false;
      index = 0;
      all = false;
      const doc = root.ownerDocument;
      const content = doc.createDocumentFragment();
      const options = doc.createDocumentFragment();
      sections.forEach((section, position) => {
        const node = doc.createElement('section');
        node.className = 'study-section';
        const heading = doc.createElement('h2');
        heading.textContent = String(section.heading || `Parte ${position + 1}`);
        heading.tabIndex = -1;
        node.append(heading);
        if (!renderContent(node, section.presentation, onReference)) for (const paragraph of String(section.body || '').split(/\n\s*\n/)) {
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
    return Object.freeze({ mount, openSection, showReference, position,
      observePosition(callback) { positionObserver = typeof callback === 'function' ? callback : null; },
      restorePosition(saved) {
        if (!active || !saved || !['lesson', 'practice'].includes(saved.view) || typeof saved.all !== 'boolean') return false;
        const found = sections.findIndex(section => section.id === saved.sectionId);
        if (found < 0) return false;
        index = found; all = saved.all; paintParts(); setView(saved.view, false); return true;
      },
      showPractice() { closeReference(); setView('practice'); }
    });
  }

  window.StudyReader = Object.freeze({ create, partIndex, practiceProgress, renderContent });
})();
