'use strict';

(() => {
  const root = typeof window === 'object' ? window : globalThis;
  const copyFeedbackTimers = new WeakMap();

  function clean(value) {
    return String(value ?? '')
      .replace(/[\u0000-\u001f\u007f]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalize(value) {
    return clean(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  function formatDate(value) {
    const text = clean(value);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : (text || 'não informada');
  }

  function lowerDetail(value) {
    const text = clean(value).replace(/[.;:,\s]+$/g, '');
    return text ? text.toLocaleLowerCase('pt-BR') : '';
  }

  function intervalFrom(item) {
    const explicitDays = Number(item?.returnDays || 0);
    if (Number.isInteger(explicitDays) && explicitDays > 0 && explicitDays <= 730) {
      return `${explicitDays} ${explicitDays === 1 ? 'dia' : 'dias'}`;
    }

    const text = normalize(item?.resolution);
    const units = [
      { pattern: /\b(\d{1,3})\s+DIAS?\b/, singular: 'dia', plural: 'dias' },
      { pattern: /\b(\d{1,3})\s+SEMANAS?\b/, singular: 'semana', plural: 'semanas' },
      { pattern: /\b(\d{1,2})\s+MES(?:ES)?\b/, singular: 'mês', plural: 'meses' },
      { pattern: /\b(\d{1,2})\s+ANOS?\b/, singular: 'ano', plural: 'anos' }
    ];
    for (const unit of units) {
      const match = text.match(unit.pattern);
      if (!match) continue;
      const amount = Number(match[1]);
      if (Number.isInteger(amount) && amount > 0) return `${amount} ${amount === 1 ? unit.singular : unit.plural}`;
    }
    return '';
  }

  function inferredCondition(item) {
    const explicitType = clean(item?.returnConditionType).toLowerCase();
    if (['exams', 'physiotherapy', 'procedure', 'treatment', 'other'].includes(explicitType)) return explicitType;

    const resolution = normalize(item?.resolution);
    if (/\bEXAM(?:E|ES)?\b/.test(resolution)) return 'exams';
    if (/\bFISIO(?:TERAPIA)?\b/.test(resolution)) return 'physiotherapy';
    if (/\bPROCEDIMENTO\b|\bCIRURGIA\b|\bOPERACAO\b/.test(resolution)) return 'procedure';
    if (/\bTRATAMENTO\b/.test(resolution)) return 'treatment';
    return '';
  }

  function detailFrom(item) {
    const explicit = lowerDetail(item?.returnConditionDetail);
    if (explicit) return explicit;
    const resolution = clean(item?.resolution);
    const separated = resolution.match(/\s[-–—]\s(.+)$/u);
    return separated ? lowerDetail(separated[1]) : '';
  }

  function appendContext(base, detail, interval) {
    let sentence = base;
    if (detail) sentence += `: ${detail}`;
    if (interval) sentence += `, no prazo de ${interval}`;
    return `${sentence}.`;
  }

  function customConditionFromResolution(resolution) {
    const text = clean(resolution);
    if (!text) return '';
    const match = text.match(/^RET(?:ORNO)?\s+AP[ÓO]S\s+(.+)$/iu);
    if (!match) return '';
    return lowerDetail(match[1].replace(/\s[-–—]\s.*$/u, ''));
  }

  function reasonFor(item) {
    const resolution = normalize(item?.resolution);
    const interval = intervalFrom(item);
    const condition = inferredCondition(item);
    const detail = detailFrom(item);

    if (condition === 'exams') {
      return appendContext('Retorno solicitado para apresentar os exames solicitados', detail, interval);
    }
    if (condition === 'physiotherapy') {
      return appendContext('Retorno solicitado após a conclusão das sessões de fisioterapia', detail, interval);
    }
    if (condition === 'procedure') {
      return appendContext('Retorno solicitado após a realização do procedimento ou cirurgia indicada', detail, interval);
    }
    if (condition === 'treatment') {
      return appendContext('Retorno solicitado após a conclusão do tratamento indicado', detail, interval);
    }
    if (condition === 'other') {
      const conditionDetail = detail || customConditionFromResolution(item?.resolution);
      return conditionDetail
        ? appendContext('Retorno solicitado após o cumprimento da condição registrada', conditionDetail, interval)
        : 'Retorno solicitado após o cumprimento da condição registrada.';
    }
    if (/\bRETORNO SE NECESSARIO\b/.test(resolution)) {
      return 'Retorno solicitado pela especialidade conforme necessidade clínica registrada.';
    }
    if (interval) return `Retorno solicitado pela especialidade após ${interval}.`;

    const customCondition = customConditionFromResolution(item?.resolution);
    if (customCondition) return `Retorno solicitado após ${customCondition}.`;
    if (/\bACOMPANHAMENTO\b/.test(resolution)) {
      return 'Retorno solicitado pela especialidade para continuidade do acompanhamento.';
    }
    return 'Retorno solicitado pela especialidade para reavaliação na data indicada.';
  }

  function build(item) {
    return `Data da última consulta: ${formatDate(item?.lastConsultationDate)}. ${reasonFor(item)} Previsão de retorno: ${formatDate(item?.returnDueDate)}.`;
  }

  function isAvailable(item) {
    return item?.active !== false
      && !item?.requestedAt
      && item?.requestedHistorical !== true
      && ['SOLICITAR', 'ATRASADO'].includes(clean(item?.status).toUpperCase());
  }

  async function write(text) {
    const clipboard = root.navigator?.clipboard;
    if (clipboard?.writeText) {
      try {
        await clipboard.writeText(text);
        return;
      } catch (_) {}
    }

    const documentRef = root.document;
    if (!documentRef?.body || typeof documentRef.execCommand !== 'function') {
      throw new Error('A cópia não está disponível neste navegador.');
    }
    const textarea = documentRef.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.setAttribute('aria-hidden', 'true');
    textarea.style.position = 'fixed';
    textarea.style.inset = '-9999px auto auto -9999px';
    documentRef.body.appendChild(textarea);
    let copied = false;
    try {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      copied = documentRef.execCommand('copy');
    } finally {
      textarea.remove();
    }
    if (!copied) throw new Error('Não foi possível copiar a justificativa.');
  }

  function restoreButton(button) {
    if (!button?.isConnected) return;
    button.textContent = button.dataset.copyLabel || 'Copiar motivo';
    button.setAttribute('aria-label', button.dataset.copyAriaLabel || 'Copiar justificativa da solicitação');
    button.classList.remove('is-copied', 'is-copy-error');
  }

  async function copyFromButton(button, item) {
    if (!button || !isAvailable(item)) return false;
    const existingTimer = copyFeedbackTimers.get(button);
    if (existingTimer) root.clearTimeout(existingTimer);
    if (!button.dataset.copyLabel) button.dataset.copyLabel = clean(button.textContent) || 'Copiar motivo';
    if (!button.dataset.copyAriaLabel) button.dataset.copyAriaLabel = button.getAttribute('aria-label') || 'Copiar justificativa da solicitação';

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.classList.remove('is-copied', 'is-copy-error');
    button.textContent = 'Copiando…';
    try {
      await write(build(item));
      button.textContent = 'Copiado';
      button.setAttribute('aria-label', 'Justificativa copiada');
      button.classList.add('is-copied');
      return true;
    } catch (_) {
      button.textContent = 'Tente novamente';
      button.setAttribute('aria-label', 'Não foi possível copiar; tente novamente');
      button.classList.add('is-copy-error');
      return false;
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      const timer = root.setTimeout(() => restoreButton(button), 2400);
      copyFeedbackTimers.set(button, timer);
    }
  }

  root.TelemedicineJustification = Object.freeze({
    build,
    formatDate,
    intervalFrom,
    isAvailable,
    reasonFor,
    copyFromButton
  });
})();
