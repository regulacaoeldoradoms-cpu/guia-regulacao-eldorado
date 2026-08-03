'use strict';

(() => {
  const DATA = window.REFERRAL_PRACTICE_GUIDANCE;
  const PANEL_ID = 'detailPanel';
  const PRACTICE_TITLE = 'Aplicação prática das devoluções analisadas — não é regra universal';
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
    route: '<path d="M4 6h10M14 6l-3-3M14 6l-3 3M20 18H10M10 18l3-3M10 18l3 3"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5M12 7v5l3 2"/>',
    exam: '<path d="M5 3v6a4 4 0 0 0 8 0V3M3 3h4M11 3h4"/><path d="M9 13v2a5 5 0 0 0 10 0v-1"/><circle cx="19" cy="11" r="2"/>',
    treatment: '<path d="M10 2h4v6h-4zM8 8h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z"/><path d="M8 14h8"/>',
    document: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 13h5M10 17h5"/>',
    safety: '<path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    ai: '<path d="M12 3c.7 4.5 3.5 7.3 8 8-4.5.7-7.3 3.5-8 8-.7-4.5-3.5-7.3-8-8 4.5-.7 7.3-3.5 8-8z"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>',
    check: '<path d="m5 12 4 4L19 6"/>'
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

    // A camada extensa fica disponível para a IA, mas não é despejada na tela principal.
    protocol.subprotocolos.push({
      titulo: PRACTICE_TITLE,
      quando: unique([...guidance.history, ...guidance.safety]).slice(0, 14),
      obrigatorias: unique([...guidance.returns, ...guidance.professionalOnly]).slice(0, 16),
      examesObrigatorios: guidance.investigations.slice(0, 14),
      condicionais: guidance.caseDependent.slice(0, 10),
      complementares: unique([
        guidance.methodology.limitation,
        ...guidance.patientReportable,
        ...guidance.examination,
        ...guidance.treatment
      ]).slice(0, 16)
    });

    protocol.fontes = unique([...arr(protocol.fontes), guidance.methodology.sourceLabel]);
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

  function routeFor(protocol) {
    return typeof accessRoute === 'function' ? accessRoute(protocol) : 'Conferir no protocolo';
  }

  function compactSteps(protocol) {
    const route = routeFor(protocol);
    return [
      { id: 'eligibility', icon: 'route', title: 'Destino correto', text: `Especialidade, faixa etária e via: ${route}.` },
      { id: 'history', icon: 'history', title: 'História clínica', text: 'Queixa, início, evolução, intensidade, sintomas associados e impacto funcional.' },
      { id: 'examination', icon: 'exam', title: 'Avaliação profissional', text: 'Exame dirigido, achados objetivos, hipótese e gravidade quando aplicável.' },
      { id: 'treatment', icon: 'treatment', title: 'Tratamento realizado', text: 'Medicamentos com dose e duração, adesão, resposta e abordagem não farmacológica.' },
      { id: 'investigation', icon: 'document', title: 'Exames e documentos', text: 'Nome, data, resultado e laudo; diferencie obrigatório, condicional e disponível.' },
      { id: 'safety', icon: 'safety', title: 'Segurança e objetivo', text: 'Confirme que pode aguardar fila e explique o que se espera da avaliação especializada.' }
    ];
  }

  function compactWorkbench(protocol, guidance) {
    const key = esc(protocol.id || protocol.nome || 'geral');
    const steps = compactSteps(protocol);
    const topReturns = guidance.returns.slice(0, 3);

    return `<section class="compact-referral-guide referral-enhancement" data-protocol-id="${key}">
      <div class="compact-guide-heading">
        <div>
          <span>Checklist rápido</span>
          <h3>Encaminhamento em 6 pontos</h3>
        </div>
        <strong data-compact-progress>0/6</strong>
      </div>

      <div class="compact-step-grid">
        ${steps.map((step, index) => `<label class="compact-step" data-step-card="${step.id}">
          <input type="checkbox" data-referral-step="${step.id}" aria-label="Marcar ${esc(step.title)} como conferido">
          <span class="compact-step-number">${index + 1}</span>
          <span class="compact-step-copy"><b>${svg(ICON[step.icon])}${esc(step.title)}</b><small>${esc(step.text)}</small></span>
        </label>`).join('')}
      </div>

      <div class="gemini-guidance-card">
        <div class="gemini-guidance-copy">
          <span>${svg(ICON.ai)}</span>
          <div><strong>Precisa de detalhes?</strong><small>O Gemini recebeu o protocolo e a base prática de devoluções desta especialidade.</small></div>
        </div>
        <div class="gemini-question-chips">
          <button type="button" data-ai-prefill="O que não pode faltar em um encaminhamento de ${esc(protocol.nome)}?">O que não pode faltar?</button>
          <button type="button" data-ai-prefill="Quais exames e documentos devo conferir para ${esc(protocol.nome)}, separando obrigatório, condicional e recomendado?">Quais exames conferir?</button>
          <button type="button" data-ai-prefill="O que costuma causar devolução em ${esc(protocol.nome)} na prática regulatória?">O que costuma devolver?</button>
          <button type="button" data-ai-prefill="Quais sinais em ${esc(protocol.nome)} não devem aguardar fila ambulatorial?">Quais sinais não podem esperar?</button>
        </div>
      </div>

      ${topReturns.length ? `<details class="compact-return-details">
        <summary>${svg(ICON.chevron)}Ver 3 falhas frequentes</summary>
        <ul>${topReturns.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
        <button type="button" class="compact-ai-link" data-ai-prefill="Explique todos os motivos práticos de devolução em ${esc(protocol.nome)} e como evitá-los.">${svg(ICON.ai)}Perguntar todos os detalhes ao Gemini</button>
      </details>` : ''}
    </section>`;
  }

  function removePracticeDetails(article) {
    article.querySelectorAll('.subprotocols details').forEach((details) => {
      if (details.querySelector('summary')?.textContent.trim() === PRACTICE_TITLE) details.remove();
    });
  }

  function collapseOfficialContent(article, selected) {
    if (article.querySelector('.official-protocol-details')) return;

    const selectors = selected
      ? ['.flow-box', '.content-grid', '.clinical-section', '.subprotocols', '.protocol-metadata']
      : ['.general-intro-grid', '.notice', '.general-rule'];

    const nodes = selectors.flatMap((selector) => [...article.querySelectorAll(selector)])
      .filter((node, index, all) => all.indexOf(node) === index && !node.closest('.official-protocol-details'));

    if (!nodes.length) return;

    const details = document.createElement('details');
    details.className = 'official-protocol-details referral-enhancement';
    details.innerHTML = `<summary><span>${svg(ICON.chevron)}Ver protocolo completo, exames e documentos</span><small>Abra somente quando precisar consultar o detalhamento técnico.</small></summary><div class="official-protocol-body"></div>`;

    nodes[0].before(details);
    const body = details.querySelector('.official-protocol-body');
    nodes.forEach((node) => body.appendChild(node));
  }

  function updateProgress(box) {
    const inputs = [...box.querySelectorAll('[data-referral-step]')];
    const done = inputs.filter((input) => input.checked).length;
    inputs.forEach((input) => input.closest('.compact-step')?.classList.toggle('is-complete', input.checked));
    const label = box.querySelector('[data-compact-progress]');
    if (label) label.textContent = `${done}/${inputs.length}`;
    box.classList.toggle('is-complete', done === inputs.length);
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
    root.querySelectorAll('.compact-referral-guide').forEach((box) => {
      if (box.dataset.bound) return;
      box.dataset.bound = 'true';
      box.addEventListener('change', (event) => {
        if (event.target.matches('[data-referral-step]')) updateProgress(box);
      });
      updateProgress(box);
    });

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
      nome: 'Qualificação geral do encaminhamento',
      faixaEtaria: 'Conforme a especialidade',
      sistemas: {},
      categoria: 'Orientação geral'
    };
    const guidance = selected?.practicalGuidance || { ...DATA.universal, methodology: DATA.methodology, updatedAt: DATA.updatedAt };
    const key = String(protocol.id || protocol.nome).replace(/["\\]/g, '');

    if (article.querySelector(`.compact-referral-guide[data-protocol-id="${key}"]`)) {
      bind(article);
      return;
    }

    article.querySelectorAll('.referral-enhancement').forEach((element) => element.remove());
    removePracticeDetails(article);

    const anchor = article.querySelector('.action-bar') || article.querySelector('.detail-summary') || article.querySelector('.detail-header');
    anchor?.insertAdjacentHTML('afterend', compactWorkbench(protocol, guidance));

    collapseOfficialContent(article, Boolean(selected));
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
