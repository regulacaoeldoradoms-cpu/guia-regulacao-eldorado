'use strict';

(() => {
  const detail = document.getElementById('receptionDetail');
  if (!detail) return;

  let applying = false;
  let queued = false;

  const clinicalOnlyPatterns = [
    /^exame\s+(f[ií]sico|neurol[oó]gico|do estado mental)\b/i,
    /^hist[oó]ria\s+cl[ií]nica\b/i,
    /^quadro\s+cl[ií]nico\b/i,
    /^hip[oó]tese\s+diagn[oó]stica\b/i,
    /^sinais?\s+e\s+sintomas?\b/i,
    /^sintomas?\b/i,
    /^sinais?\s+flog[ií]sticos\b/i,
    /^palpa[cç][aã]o\b/i,
    /^ausculta\b/i,
    /^restri[cç][aã]o\s+de\s+movimento\b/i,
    /^crepita[cç][aã]o\b/i,
    /^estado\s+mental\b/i,
    /^classifica[cç][aã]o\s+de\s+risco\b/i,
    /^indica[cç][aã]o\s+cir[uú]rgica\b/i,
    /^suspeita\s+de\s+c[aâ]ncer\b/i,
    /^tratamentos?\b/i,
    /^medicamentos?\b/i,
    /^tempo\s+de\s+evolu[cç][aã]o\b/i,
    /^dor\b/i,
    /^fadiga\b/i,
    /^sono\b/i,
    /^comorbidades?\b/i
  ];

  const cleanText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  function isClinicalOnly(text) {
    const value = cleanText(text);
    return clinicalOnlyPatterns.some((pattern) => pattern.test(value));
  }

  function simplifyItem(text) {
    return cleanText(text)
      .replace(/^AR\/Artrite psori[aá]sica\s*:\s*/i, 'Se o encaminhamento for por artrite reumatoide ou artrite psoriásica: ')
      .replace(/^Gota\s*:\s*/i, 'Se o encaminhamento for por gota: ')
      .replace(/^LES\s*:\s*/i, 'Se o encaminhamento for por lúpus (LES): ')
      .replace(/^Osteoartrite\s*:\s*/i, 'Se o encaminhamento for por osteoartrite: ')
      .replace(/\s+e\s+IMC\.?$/i, '.')
      .replace(/\bRX\b/gi, 'Raio-X')
      .replace(/\bR-X\b/gi, 'Raio-X');
  }

  function setText(element, text) {
    if (element && element.textContent !== text) element.textContent = text;
  }

  function setSelectState(select, value, notify = false) {
    if (!select) return;
    const changed = select.value !== value || select.dataset.state !== value;
    if (!changed) return;
    select.value = value;
    select.dataset.state = value;
    if (notify) select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function checkboxControl(type, checked) {
    const label = document.createElement('label');
    label.className = `fast-check ${type === 'mandatory' ? 'fast-check-primary' : 'fast-check-optional'}`;
    if (type === 'mandatory') label.title = 'Marcar quando este item obrigatório está presente';
    else if (type === 'conditional') label.title = 'Marcar quando este item se aplica ao caso e foi apresentado';
    else label.title = 'Marcar quando este item complementar estiver disponível';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    input.setAttribute('aria-label', label.title);

    const mark = document.createElement('span');
    mark.className = 'fast-check-mark';
    mark.setAttribute('aria-hidden', 'true');

    label.append(input, mark);
    return { label, input };
  }

  function transformRow(row) {
    if (row.dataset.receptionUxReady === '1') return;

    const textElement = row.querySelector('.reception-item-text');
    const select = row.querySelector('.reception-status');
    if (!textElement || !select) return;

    const sourceText = row.dataset.item || textElement.childNodes?.[0]?.textContent || textElement.textContent;
    if (isClinicalOnly(sourceText)) {
      row.remove();
      return;
    }

    const simple = simplifyItem(sourceText);
    row.dataset.item = simple;
    const firstTextNode = [...textElement.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (firstTextNode) {
      if (firstTextNode.textContent !== simple) firstTextNode.textContent = simple;
    } else {
      textElement.prepend(document.createTextNode(simple));
    }
    textElement.querySelectorAll('small').forEach((small) => small.remove());

    row.dataset.receptionUxReady = '1';
    select.classList.add('fast-check-hidden');
    row.querySelector('.fast-check-controls')?.remove();

    const type = row.dataset.type || 'mandatory';
    const presented = checkboxControl(type, select.value === 'ok');
    const controls = document.createElement('div');
    controls.className = 'fast-check-controls';
    controls.appendChild(presented.label);
    row.appendChild(controls);

    if (type === 'mandatory') setSelectState(select, presented.input.checked ? 'ok' : 'missing');
    else setSelectState(select, presented.input.checked ? 'ok' : 'na');

    presented.input.addEventListener('change', () => {
      if (type === 'mandatory') setSelectState(select, presented.input.checked ? 'ok' : 'missing', true);
      else setSelectState(select, presented.input.checked ? 'ok' : 'na', true);
      refreshSummary();
    });
  }

  function ensureLegend() {
    if (detail.querySelector('.reception-checklist-legend') || !detail.querySelector('.reception-title')) return;
    const legend = document.createElement('div');
    legend.className = 'reception-checklist-legend';
    legend.setAttribute('aria-label', 'Legenda do checklist');
    legend.innerHTML = `
      <span data-kind="mandatory">Obrigatório por padrão</span>
      <span data-kind="conditional">Depende do caso</span>
      <span data-kind="available">Complementar</span>`;
    const guide = detail.querySelector('.reception-simple-guide');
    if (guide) guide.insertAdjacentElement('afterend', legend);
    else detail.querySelector('.reception-meta')?.insertAdjacentElement('afterend', legend);
  }

  function simplifyInterface() {
    setText(detail.querySelector('.reception-kicker'), 'Conferência na recepção');

    const subLabel = detail.querySelector('label[for="receptionSubprotocol"]');
    setText(subLabel, 'Escolha o motivo que está escrito no encaminhamento');
    const firstSubOption = detail.querySelector('#receptionSubprotocol option[value="-1"]');
    setText(firstSubOption, 'Não sei / conferir lista geral');

    const mandatory = detail.querySelector('.reception-group[data-group="mandatory"]');
    if (mandatory) {
      setText(mandatory.querySelector('h3'), 'Exames e documentos obrigatórios por padrão');
      setText(mandatory.querySelector('header p'), 'Estes itens são exigidos de forma padrão para esta solicitação. Marque quando o paciente apresentou ou quando já estiverem anexados.');
    }

    const conditional = detail.querySelector('.reception-group[data-group="conditional"]');
    if (conditional) {
      setText(conditional.querySelector('h3'), 'Itens que dependem do caso');
      setText(conditional.querySelector('header p'), 'Só devem ser cobrados quando a condição descrita no protocolo realmente se aplicar ao paciente.');
    }

    const available = detail.querySelector('.reception-group[data-group="available"]');
    if (available) {
      setText(available.querySelector('h3'), 'Itens complementares');
      setText(available.querySelector('header p'), 'São úteis quando já existem ou estão disponíveis, mas não devem ser tratados como obrigatórios por padrão.');
    }

    detail.querySelectorAll('.reception-group').forEach((group) => {
      if (!group.querySelector('.reception-item')) group.remove();
    });

    const scope = detail.querySelector('.reception-scope-note');
    if (scope) {
      const html = '<strong>Importante:</strong> a recepção confere se as informações exigidas estão escritas no encaminhamento e se os documentos, exames, laudos ou imagens foram apresentados. <strong>Não precisa interpretar o conteúdo, avaliar o paciente ou decidir se o caso é urgente.</strong> Se tiver dúvida, peça ajuda ao Setor de Regulação.';
      if (scope.innerHTML !== html) scope.innerHTML = html;
    }

    if (!detail.querySelector('.reception-simple-guide') && detail.querySelector('.reception-title')) {
      const guide = document.createElement('div');
      guide.className = 'portal-note info reception-simple-guide';
      guide.innerHTML = '<strong>Como usar:</strong> 1) escolha a especialidade e, quando houver, o motivo; 2) confira primeiro os itens vermelhos, que são obrigatórios; 3) depois verifique os itens que dependem do caso e os complementares; 4) marque o que já está presente e imprima a orientação se faltar algo obrigatório.';
      detail.querySelector('.reception-meta')?.insertAdjacentElement('afterend', guide);
    }

    ensureLegend();

    const top = document.getElementById('clearReceptionChecklist');
    const bottom = document.getElementById('clearReceptionChecklistBottom');
    setText(top, 'Marcar obrigatórios presentes');
    setText(bottom, 'Desmarcar tudo');
  }

  function currentState() {
    const rows = [...detail.querySelectorAll('.reception-item')];
    const mandatory = rows.filter((row) => row.dataset.type === 'mandatory');
    const checked = rows.filter((row) => row.querySelector('.fast-check input')?.checked);
    const missingMandatory = mandatory.filter((row) => !row.querySelector('.fast-check input')?.checked);
    return {
      rows,
      mandatory,
      checked,
      missingMandatory,
      anyMarked: checked.length > 0,
      presentedMandatory: mandatory.length - missingMandatory.length
    };
  }

  function refreshSummary() {
    const summary = document.getElementById('receptionSummary');
    if (!summary) return;

    const title = document.getElementById('receptionSummaryTitle');
    const text = document.getElementById('receptionSummaryText');
    const printButton = document.getElementById('printMissingItems');
    const state = currentState();

    summary.classList.toggle('has-missing', state.anyMarked && state.missingMandatory.length > 0);

    if (!state.anyMarked) {
      setText(title, 'Pode imprimir a lista completa');
      setText(text, 'Nenhuma caixa marcada. A impressão mostrará tudo que deve ser conferido para esta solicitação.');
      if (printButton) {
        printButton.disabled = false;
        setText(printButton, 'Imprimir orientação completa');
      }
      return;
    }

    if (state.missingMandatory.length) {
      setText(title, `${state.missingMandatory.length} item(ns) obrigatório(s) ainda não apresentado(s)`);
      setText(text, `${state.presentedMandatory} de ${state.mandatory.length} item(ns) obrigatório(s) já foram marcados.`);
      if (printButton) {
        printButton.disabled = false;
        setText(printButton, 'Imprimir o que falta');
      }
      return;
    }

    setText(title, 'Obrigatórios conferidos');
    setText(text, 'Todos os itens obrigatórios por padrão foram marcados como presentes. Confira separadamente os itens que dependem do caso.');
    if (printButton) {
      printButton.disabled = true;
      setText(printButton, 'Nada obrigatório faltando');
    }
  }

  function markMandatoryPresented() {
    detail.querySelectorAll('.reception-item[data-type="mandatory"]').forEach((row) => {
      const checkbox = row.querySelector('.fast-check input');
      const select = row.querySelector('.reception-status');
      if (checkbox) checkbox.checked = true;
      setSelectState(select, 'ok');
    });
    refreshSummary();
  }

  function clearAll() {
    detail.querySelectorAll('.reception-item').forEach((row) => {
      const checkbox = row.querySelector('.fast-check input');
      const select = row.querySelector('.reception-status');
      if (checkbox) checkbox.checked = false;
      setSelectState(select, row.dataset.type === 'mandatory' ? 'missing' : 'na');
    });
    refreshSummary();
  }

  function applyEnhancements() {
    queued = false;
    if (applying) return;
    applying = true;
    observer.disconnect();
    try {
      detail.querySelectorAll('.reception-item').forEach(transformRow);
      simplifyInterface();
      refreshSummary();
    } finally {
      observer.observe(detail, { childList: true });
      applying = false;
    }
  }

  function scheduleApply() {
    if (queued || applying) return;
    queued = true;
    requestAnimationFrame(applyEnhancements);
  }

  document.addEventListener('click', (event) => {
    const top = event.target.closest('#clearReceptionChecklist');
    const bottom = event.target.closest('#clearReceptionChecklistBottom');
    if (!top && !bottom) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (top) markMandatoryPresented();
    else clearAll();
  }, true);

  const observer = new MutationObserver(scheduleApply);
  observer.observe(detail, { childList: true });
  scheduleApply();
})();
