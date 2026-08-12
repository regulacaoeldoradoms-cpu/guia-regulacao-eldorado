'use strict';

(() => {
  const detail = document.getElementById('receptionDetail');
  if (!detail) return;

  let applying = false;

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

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function isClinicalOnly(text) {
    const value = cleanText(text);
    return clinicalOnlyPatterns.some((pattern) => pattern.test(value));
  }

  function simplifyItem(text) {
    let value = cleanText(text);

    value = value
      .replace(/^AR\/Artrite psori[aá]sica\s*:\s*/i, 'Se o encaminhamento for por artrite reumatoide ou artrite psoriásica: ')
      .replace(/^Gota\s*:\s*/i, 'Se o encaminhamento for por gota: ')
      .replace(/^LES\s*:\s*/i, 'Se o encaminhamento for por lúpus (LES): ')
      .replace(/^Osteoartrite\s*:\s*/i, 'Se o encaminhamento for por osteoartrite: ')
      .replace(/\s+e\s+IMC\.?$/i, '.')
      .replace(/\bRX\b/gi, 'Raio-X')
      .replace(/\bR-X\b/gi, 'Raio-X');

    return value;
  }

  function setText(selector, text) {
    const element = detail.querySelector(selector);
    if (element && element.textContent !== text) element.textContent = text;
  }

  function simplifyRows() {
    detail.querySelectorAll('.reception-item').forEach((row) => {
      const textElement = row.querySelector('.reception-item-text');
      if (!textElement) return;

      const sourceText = row.dataset.item || textElement.childNodes?.[0]?.textContent || textElement.textContent;
      if (isClinicalOnly(sourceText)) {
        row.remove();
        return;
      }

      const simple = simplifyItem(sourceText);
      row.dataset.item = simple;
      const firstTextNode = [...textElement.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
      if (firstTextNode) firstTextNode.textContent = simple;
      else textElement.prepend(document.createTextNode(simple));

      textElement.querySelectorAll('small').forEach((small) => small.remove());
    });

    detail.querySelectorAll('.reception-group').forEach((group) => {
      if (!group.querySelector('.reception-item')) group.remove();
    });
  }

  function simplifyInterface() {
    setText('.reception-kicker', 'Conferência na recepção');

    const subLabel = detail.querySelector('label[for="receptionSubprotocol"]');
    if (subLabel) subLabel.textContent = 'Escolha o motivo que está escrito no encaminhamento';
    const firstSubOption = detail.querySelector('#receptionSubprotocol option[value="-1"]');
    if (firstSubOption) firstSubOption.textContent = 'Não sei / conferir lista geral';

    const mandatory = detail.querySelector('.reception-group[data-group="mandatory"]');
    if (mandatory) {
      const h3 = mandatory.querySelector('h3');
      const p = mandatory.querySelector('header p');
      if (h3) h3.textContent = 'O que precisa estar junto';
      if (p) p.textContent = 'Marque a caixinha quando o paciente trouxe o item ou quando ele já está anexado no pedido.';
    }

    const conditional = detail.querySelector('.reception-group[data-group="conditional"]');
    if (conditional) {
      const h3 = conditional.querySelector('h3');
      const p = conditional.querySelector('header p');
      if (h3) h3.textContent = 'Só se for para este caso';
      if (p) p.textContent = 'Confira somente se esse item tiver relação com o motivo escrito no encaminhamento.';
    }

    const available = detail.querySelector('.reception-group[data-group="available"]');
    if (available) {
      const h3 = available.querySelector('h3');
      const p = available.querySelector('header p');
      if (h3) h3.textContent = 'Se o paciente já tiver';
      if (p) p.textContent = 'Se ele já tiver esse documento ou exame, marque. Não precisa mandar buscar só por aparecer nesta parte.';
    }

    const scope = detail.querySelector('.reception-scope-note');
    if (scope) {
      scope.innerHTML = '<strong>Importante:</strong> aqui você só confere se o papel, exame, laudo, imagem ou relatório foi apresentado. <strong>Não precisa entender o resultado, avaliar o paciente ou decidir se o caso é urgente.</strong> Se tiver dúvida, peça ajuda ao Setor de Regulação.';
    }

    const existing = detail.querySelector('.reception-simple-guide');
    if (!existing && detail.querySelector('.reception-title')) {
      const guide = document.createElement('div');
      guide.className = 'portal-note info reception-simple-guide';
      guide.innerHTML = '<strong>Como usar:</strong> 1) escolha a especialidade; 2) marque o que o paciente trouxe; 3) se faltar alguma coisa, imprima a orientação para ele providenciar.';
      const meta = detail.querySelector('.reception-meta');
      meta?.insertAdjacentElement('afterend', guide);
    }
  }

  function apply() {
    if (applying) return;
    applying = true;
    observer.disconnect();
    try {
      simplifyRows();
      simplifyInterface();
    } finally {
      observer.observe(detail, { childList: true, subtree: true });
      applying = false;
    }
  }

  const observer = new MutationObserver(() => window.queueMicrotask(apply));
  observer.observe(detail, { childList: true, subtree: true });
  apply();
})();
