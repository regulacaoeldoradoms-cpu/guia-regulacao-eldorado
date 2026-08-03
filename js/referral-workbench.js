'use strict';

(() => {
  const DATA = window.REFERRAL_PRACTICE_GUIDANCE;
  const PANEL_ID = 'detailPanel';
  const PRACTICE_TITLE = 'Aplicação prática das devoluções analisadas — uso exclusivo do assistente';
  if (!DATA) return;

  let observer;
  let applying = false;

  const arr = (value) => Array.isArray(value) ? value : (value ? [value] : []);
  const norm = (value) => (value ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const esc = (value) => (value ?? '').toString().replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const unique = (values) => [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
  const svg = (path) => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${path}</svg>`;

  const ICON = {
    ai: '<path d="M12 3c.7 4.5 3.5 7.3 8 8-4.5.7-7.3 3.5-8 8-.7-4.5-3.5-7.3-8-8 4.5-.7 7.3-3.5 8-8z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.5 2.1c-.9.5-1.3 1-1.3 2M12 17h.01"/>'
  };

  function matches(profile, protocol) {
    const text = norm([protocol.id, protocol.nome, protocol.categoria, protocol.resumo, ...arr(protocol.tags)].join(' '));
    return arr(profile.matchAny).some((term) => text.includes(norm(term)))
      && !arr(profile.excludeAny).some((term) => text.includes(norm(term)));
  }

  function guidanceFor(protocol) {
    const profiles = DATA.profiles.filter((profile) => matches(profile, protocol));
    const merge = (field, universalFirst = false) => unique(universalFirst
      ? [...arr(DATA.universal[field]), ...profiles.flatMap((profile) => arr(profile[field]))]
      : [...profiles.flatMap((profile) => arr(profile[field])), ...arr(DATA.universal[field])]);

    return {
      labels: profiles.map((profile) => profile.label),
      returns: merge('returns'),
      history: merge('history', true),
      examination: merge('examination', true),
      treatment: merge('treatment', true),
      investigations: merge('investigations', true),
      safety: merge('safety'),
      patientReportable: merge('patientReportable', true),
      professionalOnly: merge('professionalOnly', true),
      caseDependent: merge('caseDependent'),
      methodology: DATA.methodology,
      updatedAt: DATA.updatedAt
    };
  }

  window.getReferralPracticalGuidance = guidanceFor;

  function enrich(protocol) {
    if (!protocol || protocol.__practiceEnriched) return;
    const guidance = guidanceFor(protocol);
    protocol.practicalGuidance = guidance;
    protocol.subprotocolos = arr(protocol.subprotocolos).filter((item) => item?.titulo !== PRACTICE_TITLE);

    // Esta estrutura alimenta o Gemini, mas é removida da apresentação visual do protocolo.
    protocol.subprotocolos.push({
      titulo: PRACTICE_TITLE,
      quando: unique([...guidance.history, ...guidance.safety]).slice(0, 16),
      obrigatorias: unique([...guidance.returns, ...guidance.professionalOnly]).slice(0, 18),
      examesObrigatorios: guidance.investigations.slice(0, 16),
      condicionais: guidance.caseDependent.slice(0, 12),
      complementares: unique([
        guidance.methodology.limitation,
        ...guidance.patientReportable,
        ...guidance.examination,
        ...guidance.treatment
      ]).slice(0, 18)
    });

    protocol._searchText = norm([
      protocol._searchText,
      ...guidance.labels,
      ...guidance.returns,
      ...guidance.history,
      ...guidance.examination,
      ...guidance.treatment,
      ...guidance.investigations,
      ...guidance.safety,
      'devolucao pratica regulatoria formular encaminhamento'
    ].join(' '));

    Object.defineProperty(protocol, '__practiceEnriched', { value: true, enumerable: false });
  }

  function enrichAll() {
    if (typeof state === 'undefined' || !Array.isArray(state.protocols)) return;
    state.protocols.forEach(enrich);
    if (state.selected) enrich(state.selected);
  }

  function removePracticeDetails(article) {
    article.querySelectorAll('.subprotocols details').forEach((details) => {
      if (details.querySelector('summary')?.textContent.trim() === PRACTICE_TITLE) details.remove();
    });
    article.querySelectorAll('.subprotocols').forEach((container) => {
      if (!container.querySelector('details')) container.remove();
    });
  }

  function identifyOfficialSections(article, selected) {
    if (!selected) {
      article.querySelector('.general-intro-grid')?.setAttribute('id', 'protocolCriteria');
      article.querySelector('.notice')?.setAttribute('id', 'protocolAlerts');
      article.querySelectorAll('.general-rule').forEach((section) => section.classList.add('official-protocol-section'));
      return;
    }

    const flow = article.querySelector('.flow-box');
    if (flow) {
      flow.id = 'protocolFlow';
      flow.classList.add('official-protocol-section');
    }

    article.querySelectorAll('.content-block').forEach((block) => {
      if (block.closest('.subprotocols')) return;
      block.classList.add('official-protocol-section');
      const title = norm(block.querySelector('h3')?.textContent || '');
      if (title.includes('criterios para encaminhar')) block.id = 'protocolCriteria';
      else if (title.includes('informacoes clinicas obrigatorias')) block.id = 'protocolClinicalInfo';
      else if (title.includes('exames obrigatorios para solicitar')) block.id = 'protocolMandatoryExams';
      else if (title.includes('exames obrigatorios conforme o caso')) block.id = 'protocolConditionalExams';
      else if (title.includes('recomendados quando disponiveis') || title.includes('documentos recomendados')) block.id = 'protocolDocuments';
      else if (title.includes('priorizacao')) block.id = 'protocolPriority';
    });

    article.querySelectorAll('.subprotocols').forEach((section) => section.classList.add('official-protocol-section'));

    const alert = article.querySelector('.clinical-alert');
    if (alert) {
      alert.id = 'protocolAlerts';
      alert.classList.add('official-protocol-section');
    }

    const checklist = article.querySelector('.clinical-section');
    const metadata = article.querySelector('.protocol-metadata');
    if (checklist && metadata && checklist.nextElementSibling !== metadata) metadata.before(checklist);
    if (checklist) checklist.classList.add('final-clinical-check');
  }

  function officialNavigation(article) {
    const entries = [
      ['protocolCriteria', 'Quando encaminhar'],
      ['protocolClinicalInfo', 'O que informar'],
      ['protocolMandatoryExams', 'Exames obrigatórios'],
      ['protocolConditionalExams', 'Conforme o caso'],
      ['protocolPriority', 'Priorização'],
      ['protocolAlerts', 'Alertas']
    ].filter(([id]) => article.querySelector(`#${id}`));

    if (!entries.length) return '';
    return `<nav class="official-protocol-nav" aria-label="Seções do protocolo oficial">
      ${entries.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('')}
    </nav>`;
  }

  function officialHeading(protocol, article) {
    return `<section class="official-protocol-heading referral-enhancement" data-protocol-id="${esc(protocol.id || protocol.nome || 'geral')}">
      <div class="official-protocol-title">
        <span>${svg(ICON.book)}</span>
        <div><small>Protocolo oficial</small><h3>Critérios e requisitos para ${esc(protocol.nome)}</h3></div>
      </div>
      <p>As informações abaixo vêm da base protocolar cadastrada no guia. Consulte os blocos por tipo de exigência.</p>
      ${officialNavigation(article)}
    </section>`;
  }

  function geminiCard(protocol) {
    const name = esc(protocol.nome);
    return `<aside class="practical-ai-card referral-enhancement">
      <div class="practical-ai-copy">
        <span>${svg(ICON.ai)}</span>
        <div><small>Aplicação prática</small><strong>Converse com o Gemini sobre devoluções reais</strong><p>A experiência regulatória fica na IA para não misturar prática local com requisito oficial na tela.</p></div>
      </div>
      <div class="practical-ai-actions">
        <button type="button" data-ai-prefill="O que costuma causar devolução em ${name} na prática regulatória e como posso evitar?">O que costuma devolver?</button>
        <button type="button" data-ai-prefill="Como qualificar um encaminhamento de ${name} sem inventar informações e respeitando o protocolo oficial?">Como qualificar?</button>
        <button type="button" data-ai-prefill="Em ${name}, o que pode ser perguntado diretamente ao paciente e o que exige avaliação profissional?">Paciente ou profissional?</button>
        <button type="button" data-ai-prefill="Quais pontos de ${name} dependem do caso e não devem ser tratados como exigência universal?">O que depende do caso?</button>
      </div>
    </aside>`;
  }

  function openGeminiWith(question) {
    document.getElementById('aiLauncher')?.click();
    window.setTimeout(() => {
      const input = document.getElementById('aiInput');
      if (!input) return;
      input.value = question;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }, 180);
  }

  function bind(root) {
    root.querySelectorAll('[data-ai-prefill]').forEach((button) => {
      if (button.dataset.bound) return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => openGeminiWith(button.dataset.aiPrefill));
    });
  }

  function enhance() {
    const panel = document.getElementById(PANEL_ID);
    const article = panel?.querySelector('article');
    if (!panel || !article) return;

    enrichAll();

    const selected = typeof state !== 'undefined' ? state.selected : null;
    const protocol = selected || {
      id: 'orientacoes-gerais',
      nome: 'qualificação geral do encaminhamento',
      faixaEtaria: 'Conforme a especialidade',
      sistemas: {},
      categoria: 'Orientação geral'
    };
    const key = String(protocol.id || protocol.nome).replace(/["\\]/g, '');

    removePracticeDetails(article);
    identifyOfficialSections(article, Boolean(selected));

    if (!article.querySelector(`.official-protocol-heading[data-protocol-id="${key}"]`)) {
      article.querySelectorAll('.referral-enhancement').forEach((element) => element.remove());

      const firstOfficial = article.querySelector('#protocolFlow, #protocolCriteria, .general-intro-grid, .general-rule');
      if (firstOfficial) firstOfficial.insertAdjacentHTML('beforebegin', officialHeading(protocol, article));

      const overview = article.querySelector('.clinical-overview');
      const actionBar = article.querySelector('.action-bar');
      const summary = article.querySelector('.detail-summary');
      const anchor = overview || actionBar || summary || article.querySelector('.detail-header');
      anchor?.insertAdjacentHTML('afterend', geminiCard(protocol));
    }

    bind(article);
  }

  function safeEnhance() {
    if (applying) return;
    applying = true;
    observer?.disconnect();
    try {
      enhance();
    } finally {
      const panel = document.getElementById(PANEL_ID);
      if (panel) observer?.observe(panel, { childList: true, subtree: true });
      applying = false;
    }
  }

  function start() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;

    observer = new MutationObserver(() => queueMicrotask(safeEnhance));
    observer.observe(panel, { childList: true, subtree: true });

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      enrichAll();
      safeEnhance();
      if ((typeof state !== 'undefined' && state.protocols?.length && state.protocols.every((protocol) => protocol.__practiceEnriched)) || attempts > 200) {
        window.clearInterval(timer);
      }
    }, 50);

    safeEnhance();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
