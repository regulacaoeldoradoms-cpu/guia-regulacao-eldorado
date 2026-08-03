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
  const esc = (value) => (value ?? '').toString().replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const unique = (values) => [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
  const svg = (path) => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${path}</svg>`;
  const ICON = {
    route: '<path d="M4 6h10M14 6l-3-3M14 6l-3 3M20 18H10M10 18l3-3M10 18l3 3"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5M12 7v5l3 2"/>',
    exam: '<path d="M5 3v6a4 4 0 0 0 8 0V3M3 3h4M11 3h4"/><path d="M9 13v2a5 5 0 0 0 10 0v-1"/><circle cx="19" cy="11" r="2"/>',
    treatment: '<path d="M10 2h4v6h-4zM8 8h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z"/><path d="M8 14h8"/>',
    document: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 13h5M10 17h5"/>',
    safety: '<path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    return: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v5"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    professional: '<path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    ai: '<path d="M12 3c.7 4.5 3.5 7.3 8 8-4.5.7-7.3 3.5-8 8-.7-4.5-3.5-7.3-8-8 4.5-.7 7.3-3.5 8-8z"/>'
  };

  function matches(profile, protocol) {
    const text = norm([protocol.id, protocol.nome, protocol.categoria, protocol.resumo, ...arr(protocol.tags)].join(' '));
    return arr(profile.matchAny).some((term) => text.includes(norm(term))) && !arr(profile.excludeAny).some((term) => text.includes(norm(term)));
  }

  function guidanceFor(protocol) {
    const profiles = DATA.profiles.filter((profile) => matches(profile, protocol));
    const merge = (field, universalFirst = false) => unique(universalFirst
      ? [...arr(DATA.universal[field]), ...profiles.flatMap((profile) => arr(profile[field]))]
      : [...profiles.flatMap((profile) => arr(profile[field])), ...arr(DATA.universal[field])]);
    return {
      labels: profiles.map((profile) => profile.label),
      returns: merge('returns'), history: merge('history', true), examination: merge('examination', true),
      treatment: merge('treatment', true), investigations: merge('investigations', true), safety: merge('safety'),
      patientReportable: merge('patientReportable', true), professionalOnly: merge('professionalOnly', true),
      caseDependent: merge('caseDependent'), methodology: DATA.methodology, updatedAt: DATA.updatedAt
    };
  }
  window.getReferralPracticalGuidance = guidanceFor;

  function enrich(protocol) {
    if (!protocol || protocol.__practiceEnriched) return;
    const guidance = guidanceFor(protocol);
    protocol.practicalGuidance = guidance;
    protocol.subprotocolos = arr(protocol.subprotocolos).filter((item) => item?.titulo !== PRACTICE_TITLE);
    protocol.subprotocolos.push({
      titulo: PRACTICE_TITLE,
      quando: guidance.history.slice(0, 8).map((item) => `Foco de formulação: ${item}`),
      obrigatorias: guidance.returns.slice(0, 10).map((item) => `Motivo observado de devolução: ${item}`),
      examesObrigatorios: [],
      condicionais: guidance.caseDependent.slice(0, 7).map((item) => `Aplicação condicionada ao caso: ${item}`),
      complementares: [guidance.methodology.limitation, ...guidance.examination.slice(0, 4), ...guidance.investigations.slice(0, 4)]
    });
    protocol.fontes = unique([...arr(protocol.fontes), guidance.methodology.sourceLabel]);
    protocol._searchText = norm([protocol._searchText, ...guidance.labels, ...guidance.returns, ...guidance.history, ...guidance.examination, ...guidance.treatment, ...guidance.investigations, ...guidance.safety, 'devolucao pratica regulatoria formular encaminhamento'].join(' '));
    Object.defineProperty(protocol, '__practiceEnriched', { value: true, enumerable: false });
  }

  function enrichAll() {
    if (typeof state === 'undefined' || !Array.isArray(state.protocols)) return;
    state.protocols.forEach(enrich);
    if (state.selected) enrich(state.selected);
  }

  function list(items, limit = 7) {
    const values = unique(arr(items)).slice(0, limit);
    return values.length ? `<ul>${values.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : '<p class="referral-empty">Sem achado prático adicional específico.</p>';
  }

  function step(id, number, title, iconName, instruction, items, why) {
    return `<label class="formulation-step" data-step-card="${id}">
      <span class="formulation-step-control"><input type="checkbox" data-referral-step="${id}" aria-label="Marcar ${esc(title)} como revisado"><span>${number}</span></span>
      <span class="formulation-step-content"><strong>${svg(ICON[iconName])}${esc(title)}</strong><em>${esc(instruction)}</em>${list(items, 6)}<small><b>Por que isso importa:</b> ${esc(why)}</small></span>
    </label>`;
  }

  function steps(protocol, guidance) {
    const route = typeof accessRoute === 'function' ? accessRoute(protocol) : 'Conferir no protocolo';
    return [
      step('eligibility', 1, 'Confirme indicação, faixa etária e via', 'route', `${protocol.nome}. Faixa etária: ${protocol.faixaEtaria || 'não informada'}. Via: ${route}.`, [
        'Confirme que especialidade e procedimento correspondem ao problema clínico.',
        'Diferencie consulta, exame, indicação cirúrgica, retorno e revisão pós-operatória.',
        'Confira faixa etária e disponibilidade no sistema antes de formular o pedido.'
      ], 'Incompatibilidade de fluxo impede a continuidade mesmo com história clínica completa.'),
      step('history', 2, 'Construa a história clínica', 'history', 'Permita compreender o problema, sua cronologia e repercussão.', guidance.history, 'Sem evolução, intensidade e impacto funcional, não é possível estimar pertinência e prioridade.'),
      step('examination', 3, 'Registre a avaliação profissional', 'exam', 'Inclua exame dirigido e achados que sustentam a hipótese.', guidance.examination, 'Relato do paciente não substitui exame físico, estado mental, hipótese ou avaliação de gravidade.'),
      step('treatment', 4, 'Documente o que já foi tentado', 'treatment', 'Mostre abordagem, adesão, resposta e motivo do encaminhamento.', guidance.treatment, 'Dose, duração e resposta são necessárias para demonstrar falha ou insuficiência da abordagem inicial.'),
      step('investigation', 5, 'Confira exames e documentos', 'document', 'Separe obrigatório, condicionado ao caso e recomendado quando disponível.', guidance.investigations, 'Citar um exame sem data, resultado ou laudo frequentemente não permite análise regulatória.'),
      step('safety', 6, 'Avalie segurança e justifique', 'safety', 'Confirme que o caso pode aguardar fila e finalize com objetivo clínico claro.', [...guidance.safety.slice(0, 4), 'Explique qual avaliação ou decisão especializada é necessária neste momento.'], 'Casos agudos não pertencem à fila eletiva e a prioridade deve ser sustentada por dados objetivos.')
    ].join('');
  }

  function navigation() {
    return `<nav class="referral-navigation referral-enhancement" aria-label="Navegação no protocolo">
      <a href="#referralWorkbench">Formular</a><a href="#practicalReturns">Evitar devolução</a><a href="#officialProtocolRequirements">Protocolo oficial</a><a href="#protocolExams">Exames</a><a href="#clinicalSafety">Segurança</a><a href="#finalClinicalCheck">Conferência final</a>
    </nav>`;
  }

  function workbench(protocol, guidance) {
    const key = esc(protocol.id || protocol.nome || 'geral');
    return `<section class="referral-workbench referral-enhancement" id="referralWorkbench" data-protocol-id="${key}">
      <header class="workbench-header"><div><span>Roteiro de formulação clínica</span><h3>Construa um encaminhamento que possa ser analisado e priorizado</h3><p>Marque cada bloco somente após registrar as informações pertinentes ao caso. O roteiro não gera texto pronto.</p></div><span class="workbench-badge">Protocolo + prática regulatória</span></header>
      <div class="workbench-progress"><div><strong data-progress-label>0 de 6 blocos revisados</strong><span>Conclua após registrar as informações no encaminhamento.</span></div><div class="workbench-progress-track"><span data-progress-bar></span></div></div>
      <div class="formulation-steps">${steps(protocol, guidance)}</div>
      <div class="workbench-actions"><button type="button" class="button ghost" data-reset-workbench>Reiniciar conferência</button><button type="button" class="button secondary" data-ai-prefill="O que mais costuma causar devolução em ${esc(protocol.nome)} e o que preciso conferir antes de enviar?">${svg(ICON.ai)}Perguntar à IA sobre devoluções</button></div>
    </section>`;
  }

  function practical(guidance) {
    return `<section class="practical-guidance referral-enhancement" id="practicalReturns">
      <header><div><span>Experiência regulatória local</span><h3>O que mais impede o encaminhamento de avançar na prática</h3></div><b>Síntese anonimizada</b></header>
      <p>${esc(guidance.methodology.limitation)}</p>
      <div class="practical-grid"><article class="returns"><h4>${svg(ICON.return)}Motivos frequentes de devolução</h4>${list(guidance.returns, 9)}</article><article class="conditional"><h4>${svg(ICON.info)}O que depende do caso</h4>${list(guidance.caseDependent, 6)}</article><article class="safety"><h4>${svg(ICON.safety)}Quando a fila pode ser inadequada</h4>${list(guidance.safety, 6)}</article></div>
      <small>Base prática atualizada em ${esc(guidance.updatedAt)}. ${esc(guidance.methodology.sourceLabel)}</small>
    </section>`;
  }

  function informationSource(guidance) {
    return `<section class="information-source-panel referral-enhancement"><header><span>Origem da informação</span><h3>Separe relato do paciente de avaliação profissional</h3><p>Informações relatadas podem ser incorporadas quando identificadas como relato. Exame e julgamento clínico exigem profissional habilitado.</p></header><div><article><h4>${svg(ICON.person)}Pode ser confirmado com paciente ou responsável</h4>${list(guidance.patientReportable, 8)}</article><article><h4>${svg(ICON.professional)}Exige avaliação profissional</h4>${list(guidance.professionalOnly, 8)}</article></div></section>`;
  }

  function removePracticeDetails(article) {
    article.querySelectorAll('.subprotocols details').forEach((details) => {
      if (details.querySelector('summary')?.textContent.trim() === PRACTICE_TITLE) details.remove();
    });
  }

  function assignIds(article) {
    const grids = [...article.querySelectorAll('.content-grid')];
    if (grids[0]) grids[0].id = 'officialProtocolRequirements';
    if (grids[1]) grids[1].id = 'protocolExams';
    const checklist = article.querySelector('.clinical-section');
    if (checklist) checklist.id = 'finalClinicalCheck';
    const alert = article.querySelector('.clinical-alert');
    if (alert) alert.id = 'clinicalSafety';
  }

  function updateProgress(box) {
    const inputs = [...box.querySelectorAll('[data-referral-step]')];
    const done = inputs.filter((input) => input.checked).length;
    inputs.forEach((input) => input.closest('.formulation-step')?.classList.toggle('is-complete', input.checked));
    box.querySelector('[data-progress-label]').textContent = `${done} de ${inputs.length} blocos revisados`;
    box.querySelector('[data-progress-bar]').style.width = `${Math.round(done / inputs.length * 100)}%`;
    box.classList.toggle('is-complete', done === inputs.length);
  }

  function bind(root) {
    root.querySelectorAll('.referral-workbench').forEach((box) => {
      if (box.dataset.bound) return;
      box.dataset.bound = 'true';
      box.addEventListener('change', (event) => { if (event.target.matches('[data-referral-step]')) updateProgress(box); });
      box.querySelector('[data-reset-workbench]')?.addEventListener('click', () => { box.querySelectorAll('[data-referral-step]').forEach((input) => { input.checked = false; }); updateProgress(box); });
      updateProgress(box);
    });
    root.querySelectorAll('[data-ai-prefill]').forEach((button) => {
      if (button.dataset.bound) return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => {
        document.getElementById('aiLauncher')?.click();
        setTimeout(() => { const input = document.getElementById('aiInput'); if (input) { input.value = button.dataset.aiPrefill; input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); } }, 180);
      });
    });
  }

  function enhance() {
    const panel = document.getElementById(PANEL_ID);
    const article = panel?.querySelector('article');
    if (!panel || !article) return;
    enrichAll();
    const selected = typeof state !== 'undefined' ? state.selected : null;
    const protocol = selected || { id: 'orientacoes-gerais', nome: 'Qualificação geral do encaminhamento', faixaEtaria: 'Conforme a especialidade', sistemas: {}, categoria: 'Orientação geral' };
    const guidance = selected?.practicalGuidance || { ...DATA.universal, methodology: DATA.methodology, updatedAt: DATA.updatedAt };
    const key = String(protocol.id || protocol.nome);
    if (article.querySelector(`.referral-workbench[data-protocol-id="${key.replace(/["\\]/g, '')}"]`)) { bind(article); return; }
    article.querySelectorAll('.referral-enhancement').forEach((element) => element.remove());
    removePracticeDetails(article);
    assignIds(article);
    const anchor = article.querySelector('.action-bar') || article.querySelector('.detail-summary') || article.querySelector('.detail-header');
    anchor?.insertAdjacentHTML('afterend', navigation() + workbench(protocol, guidance) + practical(guidance));
    const metadata = article.querySelector('.protocol-metadata');
    if (metadata) metadata.insertAdjacentHTML('beforebegin', informationSource(guidance));
    else article.insertAdjacentHTML('beforeend', informationSource(guidance));
    bind(article);
  }

  function safeEnhance() {
    if (applying) return;
    applying = true;
    observer?.disconnect();
    try { enhance(); } finally { const panel = document.getElementById(PANEL_ID); if (panel) observer?.observe(panel, { childList: true, subtree: true }); applying = false; }
  }

  function start() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    observer = new MutationObserver(() => queueMicrotask(safeEnhance));
    observer.observe(panel, { childList: true, subtree: true });
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1; enrichAll(); safeEnhance();
      if ((typeof state !== 'undefined' && state.protocols?.length && state.protocols.every((protocol) => protocol.__practiceEnriched)) || attempts > 200) clearInterval(timer);
    }, 50);
    safeEnhance();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
