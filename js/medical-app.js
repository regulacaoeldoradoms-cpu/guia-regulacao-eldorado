'use strict';

const DATA_SOURCE = 'https://raw.githubusercontent.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/3c09e13f343ddb4995910d02b349fb164dc08256/index.html';
const GUIDE_META = {
  versao: '3.1',
  ultimaConferencia: '28/07/2026',
  publico: 'Médicos da Atenção Primária',
  situacao: 'Vigente'
};

const EXTRA_PROTOCOLS = [
  {
    id: 'reumatologia-pediatrica',
    nome: 'Reumatologia Pediátrica',
    categoria: 'Pediatria',
    faixaEtaria: 'Menores de 18 anos, conforme disponibilidade da regulação presencial.',
    sistemas: { sisreg: true, digsus: false, digsusStatus: 'nao_consta', local: false },
    prioridade: 8,
    resumo: 'Avaliação regulada de crianças e adolescentes com suspeita de doença reumatológica.',
    fluxoLocal: 'Utilizar o fluxo presencial regulado. Não aguardar exames quando houver suspeita clínica relevante, perda funcional ou sinais sistêmicos.',
    quandoSolicitar: [
      'Artrite persistente, edema articular, rigidez matinal ou limitação funcional.',
      'Suspeita de artrite idiopática juvenil, lúpus, vasculite ou outra doença inflamatória sistêmica.',
      'Febre prolongada ou recorrente associada a manifestações articulares, cutâneas ou sistêmicas.',
      'Uveíte, fenômeno de Raynaud, fraqueza importante ou alterações sugestivas de doença autoimune.'
    ],
    informacoesObrigatorias: [
      'Idade, história clínica, tempo de evolução e articulações acometidas.',
      'Presença de rigidez matinal, febre, alterações cutâneas, perda de peso e limitação funcional.',
      'Exame físico das articulações, pele, mucosas e demais achados sistêmicos.',
      'Tratamentos realizados, medicamentos em uso, resposta terapêutica e comorbidades.',
      'Hipótese diagnóstica e motivo objetivo do encaminhamento.'
    ],
    examesObrigatorios: ['Não retardar o encaminhamento por ausência de exames quando a suspeita clínica for relevante.'],
    examesCondicionais: [
      'Hemograma, VHS, PCR, urina tipo I, função renal e hepática, FAN e fator reumatoide, quando já realizados.',
      'Radiografia, ultrassonografia ou outro exame de imagem da articulação, quando disponível.'
    ],
    complementares: ['Relatórios de atendimentos anteriores e laudo oftalmológico quando houver uveíte.'],
    ajudaPriorizacao: ['Perda funcional, artrite persistente, sinais sistêmicos, suspeita de vasculite ou lúpus e uveíte.'],
    alertas: ['Suspeita de artrite séptica, sepse ou comprometimento sistêmico grave deve seguir fluxo de urgência.'],
    subprotocolos: [],
    modelo: 'Paciente pediátrico(a), [idade], com [sinais e sintomas] há [tempo]. Exame físico: [achados]. Tratamentos realizados: [dados]. Exames disponíveis: [resultados]. Hipótese diagnóstica: [hipótese]. Solicito avaliação em Reumatologia Pediátrica devido a [justificativa clínica].',
    fontes: ['Fluxo presencial SISREG/CORE'],
    tags: ['reumatologia pediatrica', 'reumatologia infantil', 'artrite idiopatica juvenil', 'lupus infantil', 'vasculite infantil']
  }
];

const ICONS = {
  medical: '<path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  building: '<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6M9 9h.01M15 9h.01M9 12h.01M15 12h.01"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M8 15h8"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/>',
  priority: '<path d="m12 3 2.5 5.2 5.5.8-4 4 .9 5.7-4.9-2.6-4.9 2.6.9-5.7-4-4 5.5-.8z"/>',
  alert: '<path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  printer: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  stethoscope: '<path d="M5 3v6a4 4 0 0 0 8 0V3M3 3h4M11 3h4"/><path d="M9 13v2a5 5 0 0 0 10 0v-1"/><circle cx="19" cy="11" r="2"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/>'
};

const state = { protocols: [], selected: null, topFilter: 'todos' };
const $ = (id) => document.getElementById(id);
const arr = (value) => Array.isArray(value) ? value : (value ? [value] : []);
const escapeHtml = (value) => (value ?? '').toString().replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const normalize = (value) => (value ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function icon(name) {
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${ICONS[name] || ICONS.info}</svg>`;
}

function extractProtocolArray(source) {
  const start = source.indexOf('const PROTOCOLOS');
  if (start < 0) throw new Error('A base de protocolos não foi localizada.');
  const arrayStart = source.indexOf('[', start);
  const endings = ['];\n  const FOOTER_IMG', '];\r\n  const FOOTER_IMG', '];\nconst FOOTER_IMG', '];\r\nconst FOOTER_IMG'];
  let arrayEnd = -1;
  for (const ending of endings) {
    const position = source.indexOf(ending, arrayStart);
    if (position >= 0 && (arrayEnd < 0 || position < arrayEnd)) arrayEnd = position;
  }
  if (arrayEnd < 0) throw new Error('O final da base de protocolos não foi localizado.');
  return source.slice(arrayStart, arrayEnd + 1);
}

function isNeuropediatrics(protocol) {
  const id = normalize(protocol.id || '').trim();
  const name = normalize(protocol.nome || '').trim();
  return id === 'neuropediatria'
    || id === 'neurologia-pediatrica'
    || name === 'neuropediatria'
    || name === 'neurologia pediatrica';
}

function applyOperationalOverrides(protocol) {
  const updated = {
    ...protocol,
    sistemas: { ...(protocol.sistemas || {}) },
    solicitante: protocol.solicitante || 'Médico',
    origemAceita: protocol.origemAceita || 'Atenção Primária',
    vigencia: protocol.vigencia || GUIDE_META.situacao,
    ultimaConferencia: protocol.ultimaConferencia || GUIDE_META.ultimaConferencia
  };

  if (isNeuropediatrics(updated)) {
    updated.nome = 'Neuropediatria';
    updated.faixaEtaria = 'Até 16 anos, 11 meses e 29 dias.';
    updated.sistemas.digsus = true;
    updated.sistemas.digsusStatus = 'disponivel';
    updated.sistemas.local = true;
    updated.resumo = 'Especialidade disponível no DigSaúde MS para avaliação de condições neurológicas pediátricas previstas no protocolo.';
    updated.fluxoLocal = 'Solicitar pelo DigSaúde MS. Registrar o quadro clínico atual, anexar ou descrever os documentos exigidos e orientar a presença de familiar ou responsável no atendimento.';
    updated.fontes = [...new Set([...arr(updated.fontes), 'Atualização operacional do Setor de Regulação de Eldorado/MS — julho de 2026'])];
    updated.tags = [...new Set([...arr(updated.tags), 'neuropediatria', 'neurologia pediatrica', 'neuroped', 'tea', 'tdah', 'convulsao infantil', 'atraso do desenvolvimento'])];
  }

  updated._searchText = buildSearchText(updated);
  return updated;
}

function buildSearchText(protocol) {
  const values = [
    protocol.id, protocol.nome, protocol.categoria, protocol.faixaEtaria, protocol.resumo,
    protocol.fluxoLocal, protocol.modelo, protocol.solicitante, protocol.origemAceita,
    ...arr(protocol.fontes), ...arr(protocol.tags), ...arr(protocol.quandoSolicitar),
    ...arr(protocol.informacoesObrigatorias), ...arr(protocol.examesObrigatorios),
    ...arr(protocol.examesCondicionais), ...arr(protocol.complementares),
    ...arr(protocol.ajudaPriorizacao), ...arr(protocol.alertas)
  ];
  arr(protocol.subprotocolos).forEach((subprotocol) => {
    values.push(subprotocol.titulo, ...arr(subprotocol.quando), ...arr(subprotocol.obrigatorias),
      ...arr(subprotocol.examesObrigatorios), ...arr(subprotocol.condicionais), ...arr(subprotocol.complementares));
  });
  return normalize(values.join(' '));
}

async function loadProtocols() {
  const response = await fetch(`${DATA_SOURCE}?medical-guide=3.1`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Falha ao carregar a base técnica (${response.status}).`);
  const source = await response.text();
  const parsed = JSON.parse(extractProtocolArray(source));
  const combined = [...parsed, ...EXTRA_PROTOCOLS].map(applyOperationalOverrides);
  const unique = new Map();
  combined.forEach((protocol) => unique.set(protocol.id || normalize(protocol.nome), protocol));
  return [...unique.values()].sort((a, b) => (a.prioridade || 99) - (b.prioridade || 99) || (a.nome || '').localeCompare(b.nome || '', 'pt-BR'));
}

function systemStatus(protocol) {
  const systems = protocol.sistemas || {};
  const telehealthAvailable = systems.digsus && systems.digsusStatus === 'disponivel';
  const asynchronous = systems.digsus && systems.digsusStatus === 'assincrona';
  const unavailable = systems.digsusStatus === 'indisponivel_local' || systems.digsusStatus === 'nao_consta';
  return { systems, telehealthAvailable, asynchronous, unavailable };
}

function badgeHtml(protocol, includeAge = false) {
  const { systems, telehealthAvailable, asynchronous, unavailable } = systemStatus(protocol);
  const badges = [];
  if (systems.sisreg) badges.push(`<span class="badge presencial">${icon('building')}SISREG/CORE</span>`);
  if (telehealthAvailable) badges.push(`<span class="badge telehealth">${icon('monitor')}DigSaúde</span>`);
  if (asynchronous) badges.push(`<span class="badge async">${icon('message')}Discussão de conduta</span>`);
  if (unavailable) badges.push(`<span class="badge unavailable">${icon('ban')}Sem oferta no teleatendimento</span>`);
  if (includeAge && protocol.faixaEtaria) badges.push(`<span class="badge age">${icon('user')}${escapeHtml(protocol.faixaEtaria)}</span>`);
  return `<div class="badges">${badges.join('')}</div>`;
}

function accessRoute(protocol) {
  const { systems, telehealthAvailable, asynchronous, unavailable } = systemStatus(protocol);
  const routes = [];
  if (systems.sisreg) routes.push('SISREG/CORE');
  if (telehealthAvailable) routes.push('DigSaúde MS');
  if (asynchronous) routes.push('Discussão de conduta');
  if (unavailable && routes.length === 0) routes.push('Sem oferta no teleatendimento');
  return routes.join(' e ') || 'Conferir disponibilidade';
}

function protocolMatchesTopFilter(protocol) {
  const { systems, telehealthAvailable, asynchronous, unavailable } = systemStatus(protocol);
  switch (state.topFilter) {
    case 'sisreg': return Boolean(systems.sisreg);
    case 'digsus': return telehealthAvailable;
    case 'assincrona': return asynchronous;
    case 'ambos': return Boolean(systems.sisreg && (telehealthAvailable || asynchronous));
    case 'indisponivel': return unavailable;
    default: return true;
  }
}

function protocolMatchesControls(protocol) {
  if (!protocolMatchesTopFilter(protocol)) return false;
  const category = $('categoryFilter')?.value || 'todos';
  if (category !== 'todos' && (protocol.categoria || 'Sem categoria') !== category) return false;
  const terms = normalize($('sideSearchInput')?.value || '').split(/\s+/).filter(Boolean);
  return terms.length === 0 || terms.every((term) => protocol._searchText.includes(term));
}

function searchScore(protocol) {
  const query = normalize($('sideSearchInput')?.value || '').trim();
  if (!query) return (protocol.prioridade || 99) * 1000;
  const name = normalize(protocol.nome);
  const category = normalize(protocol.categoria);
  const tags = normalize(arr(protocol.tags).join(' '));
  const criteria = normalize(arr(protocol.quandoSolicitar).join(' '));
  const exams = normalize([...arr(protocol.examesObrigatorios), ...arr(protocol.examesCondicionais)].join(' '));
  let score = 10000;
  if (name === query) score -= 9000;
  else if (name.startsWith(query)) score -= 7600;
  else if (name.includes(query)) score -= 6500;
  if (category.includes(query)) score -= 1400;
  if (tags.includes(query)) score -= 1800;
  if (criteria.includes(query)) score -= 1100;
  if (exams.includes(query)) score -= 700;
  if (isNeuropediatrics(protocol) && ['neuropediatria', 'neurologia pediatrica', 'neuroped'].includes(query)) score -= 2200;
  return score + (protocol.prioridade || 99);
}

function listHtml(items) {
  return arr(items).length
    ? `<ul>${arr(items).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '<p class="empty">Não informado ou não aplicável.</p>';
}

function blockHtml(title, items, type = '', iconName = 'clipboard') {
  return `<section class="content-block ${type}"><h3>${icon(iconName)}${escapeHtml(title)}</h3>${listHtml(items)}</section>`;
}

function subprotocolHtml(protocol) {
  if (!arr(protocol.subprotocolos).length) return '';
  return `<div class="subprotocols">${arr(protocol.subprotocolos).map((subprotocol, index) => `
    <details ${index === 0 ? 'open' : ''}>
      <summary>${escapeHtml(subprotocol.titulo || 'Condição específica')}</summary>
      <div class="content-grid">
        ${blockHtml('Critérios para encaminhar', subprotocol.quando, '', 'clipboard')}
        ${blockHtml('Informações clínicas obrigatórias', subprotocol.obrigatorias, 'required', 'stethoscope')}
        ${blockHtml('Exames obrigatórios para solicitar', subprotocol.examesObrigatorios, 'required', 'flask')}
        ${blockHtml('Exames obrigatórios conforme o caso', subprotocol.condicionais, 'conditional', 'flask')}
        ${blockHtml('Recomendados quando disponíveis', subprotocol.complementares, 'complementary', 'image')}
      </div>
    </details>`).join('')}</div>`;
}

function checklistItems(protocol) {
  const clinicalText = normalize([...arr(protocol.informacoesObrigatorias), protocol.modelo].join(' '));
  const mandatoryExams = arr(protocol.examesObrigatorios).filter((item) => !normalize(item).includes('nao aguardar') && !normalize(item).includes('nao retardar'));
  const items = [
    'Faixa etária e elegibilidade para a especialidade conferidas.',
    'Queixa principal, início, tempo de evolução e evolução clínica descritos.'
  ];
  if (/exame fisico|exame neurologico|achados|lesao/.test(clinicalText)) items.push('Exame físico pertinente e achados clínicos registrados.');
  if (/tratamento|medicamento|dose|resposta/.test(clinicalText)) items.push('Tratamentos, medicamentos, doses, duração e resposta informados.');
  if (mandatoryExams.length) items.push('Exames obrigatórios conferidos e anexados ou transcritos na solicitação.');
  items.push('Hipótese diagnóstica e justificativa clínica objetiva registradas.');
  if (arr(protocol.alertas).length) items.push('Sinais de gravidade avaliados; o caso não necessita fluxo de urgência.');
  return items;
}

function checklistText(protocol) {
  return `CHECKLIST — ${protocol.nome.toUpperCase()}\n\n${checklistItems(protocol).map((item) => `[ ] ${item}`).join('\n')}`;
}

function overviewCard(label, value, iconName) {
  return `<div class="overview-card"><span class="overview-label">${icon(iconName)}${escapeHtml(label)}</span><span class="overview-value">${escapeHtml(value)}</span></div>`;
}

function metadataItem(label, value, className = '') {
  return `<div class="metadata-item"><span class="metadata-label">${escapeHtml(label)}</span><span class="metadata-value ${className}">${escapeHtml(value)}</span></div>`;
}

function updateProtocolUrl(protocol) {
  const url = new URL(window.location.href);
  url.searchParams.set('protocolo', protocol.id || normalize(protocol.nome).replace(/\s+/g, '-'));
  history.replaceState(null, '', url);
}

function renderProtocol(protocol, options = {}) {
  state.selected = protocol;
  document.querySelectorAll('.protocol-card').forEach((card) => card.classList.toggle('active', card.dataset.id === protocol.id));
  if (!options.preserveUrl) updateProtocolUrl(protocol);

  const checklist = checklistItems(protocol);
  const sourceText = arr(protocol.fontes).join(' · ') || 'Fonte não informada na base atual.';

  $('detailPanel').innerHTML = `
    <article>
      <div class="detail-header">
        <div class="detail-title">
          ${badgeHtml(protocol, false)}
          <h2>${escapeHtml(protocol.nome)}</h2>
          <div class="detail-meta">${escapeHtml(protocol.categoria || 'Sem categoria')}</div>
        </div>
      </div>

      <p class="detail-summary">${escapeHtml(protocol.resumo || '')}</p>

      <div class="action-bar">
        <button class="button primary" type="button" id="copyModelButton">${icon('copy')}Copiar modelo de encaminhamento</button>
        <button class="button ghost" type="button" id="copyChecklistButton">${icon('check')}Copiar checklist clínico</button>
        <button class="button secondary" type="button" id="printGuidanceButton">${icon('printer')}Imprimir protocolo</button>
      </div>

      <div class="clinical-overview">
        ${overviewCard('Faixa etária', protocol.faixaEtaria || 'Não informada', 'user')}
        ${overviewCard('Via de acesso', accessRoute(protocol), 'layers')}
        ${overviewCard('Profissional solicitante', protocol.solicitante || 'Médico', 'stethoscope')}
        ${overviewCard('Situação do protocolo', protocol.vigencia || GUIDE_META.situacao, 'check')}
      </div>

      ${protocol.fluxoLocal ? `<section class="flow-box"><h3>${icon('layers')}Fluxo de solicitação</h3><p>${escapeHtml(protocol.fluxoLocal)}</p></section>` : ''}

      <div class="content-grid">
        ${blockHtml('Critérios para encaminhar', protocol.quandoSolicitar, '', 'clipboard')}
        ${blockHtml('Informações clínicas obrigatórias', protocol.informacoesObrigatorias, 'required', 'stethoscope')}
      </div>

      <section class="clinical-section">
        <h3>${icon('check')}Checklist antes de enviar</h3>
        <p class="section-intro">Use esta conferência para reduzir devoluções por ausência de informações clínicas ou exames.</p>
        <div class="medical-checklist">
          ${checklist.map((item, index) => `<label class="check-item"><input type="checkbox" data-check-index="${index}"><span>${escapeHtml(item)}</span></label>`).join('')}
        </div>
        <div class="checklist-actions">
          <button class="button ghost" type="button" id="clearChecklistButton">Limpar marcações</button>
        </div>
      </section>

      <div class="content-grid" style="margin-top:14px">
        ${blockHtml('Exames obrigatórios para solicitar', protocol.examesObrigatorios, 'required', 'flask')}
        ${blockHtml('Exames obrigatórios conforme o caso', protocol.examesCondicionais, 'conditional', 'flask')}
        ${blockHtml('Exames e documentos recomendados quando disponíveis', protocol.complementares, 'complementary', 'image')}
        ${blockHtml('Elementos que auxiliam a priorização', protocol.ajudaPriorizacao, 'priority', 'priority')}
      </div>

      ${subprotocolHtml(protocol)}

      ${arr(protocol.alertas).length ? `<section class="clinical-alert"><h3>${icon('alert')}Não aguardar a fila ambulatorial quando houver</h3>${listHtml(protocol.alertas)}</section>` : ''}

      ${protocol.modelo ? `<section class="model-box"><div class="copy-row"><h3>${icon('clipboard')}Modelo de encaminhamento</h3><button class="button ghost" type="button" id="copyModelInlineButton">${icon('copy')}Copiar</button></div><p class="model-guidance">Substitua os campos entre colchetes pelas informações clínicas do paciente. Não mantenha campos sem preenchimento.</p><p class="model-text">${escapeHtml(protocol.modelo)}</p></section>` : ''}

      <div class="protocol-metadata">
        ${metadataItem('Fonte técnica', sourceText)}
        ${metadataItem('Última conferência', protocol.ultimaConferencia || GUIDE_META.ultimaConferencia)}
        ${metadataItem('Versão do guia', `V${GUIDE_META.versao} — ${protocol.vigencia || GUIDE_META.situacao}`, 'status-current')}
      </div>
    </article>`;

  $('copyModelButton')?.addEventListener('click', () => copyText(protocol.modelo || '', 'Modelo de encaminhamento copiado.'));
  $('copyModelInlineButton')?.addEventListener('click', () => copyText(protocol.modelo || '', 'Modelo de encaminhamento copiado.'));
  $('copyChecklistButton')?.addEventListener('click', () => copyText(checklistText(protocol), 'Checklist clínico copiado.'));
  $('printGuidanceButton')?.addEventListener('click', () => printProtocol(protocol));
  $('clearChecklistButton')?.addEventListener('click', () => document.querySelectorAll('.medical-checklist input').forEach((input) => { input.checked = false; }));
}

function renderGeneralRules() {
  state.selected = null;
  document.querySelectorAll('.protocol-card').forEach((card) => card.classList.remove('active'));
  const url = new URL(window.location.href);
  url.searchParams.delete('protocolo');
  history.replaceState(null, '', url);

  $('detailPanel').innerHTML = `
    <article>
      <div class="detail-title"><span class="badge age">${icon('stethoscope')}Orientação médica</span><h2>Como qualificar o encaminhamento</h2></div>
      <p class="detail-summary">O encaminhamento deve permitir que o regulador e o especialista compreendam o problema clínico, o que já foi investigado e por que a avaliação especializada é necessária.</p>
      <div class="general-intro-grid">
        <div class="general-intro-card"><strong>Elegibilidade</strong><span>Confirme faixa etária, especialidade correta e via de acesso antes de solicitar.</span></div>
        <div class="general-intro-card"><strong>Informação clínica</strong><span>Registre história, exame físico pertinente, hipótese e justificativa objetiva.</span></div>
        <div class="general-intro-card"><strong>Investigação prévia</strong><span>Confira os exames obrigatórios e descreva tratamentos, doses, duração e resposta.</span></div>
      </div>
      <div class="notice">Casos com risco imediato, instabilidade clínica ou necessidade de avaliação urgente não devem permanecer na fila ambulatorial.</div>
      <section class="general-rule"><h3>Conteúdo mínimo</h3><ul><li>Queixa principal, início, tempo de evolução e evolução do quadro.</li><li>Exame físico pertinente à hipótese clínica.</li><li>Hipótese diagnóstica ou problema clínico bem definido.</li><li>Tratamentos realizados, medicamentos, doses, duração e resposta.</li><li>Resultados dos exames já realizados.</li><li>Motivo objetivo para avaliação especializada.</li></ul></section>
      <section class="general-rule"><h3>Exames</h3><p>“Obrigatório para solicitar” indica requisito prévio. “Obrigatório conforme o caso” aplica-se somente às situações descritas. “Recomendado quando disponível” não deve ser interpretado como impedimento automático para encaminhar.</p></section>
      <section class="general-rule"><h3>Classificação de risco</h3><p>A prioridade deve ser fundamentada por sinais, sintomas, limitações, achados do exame físico e resultados objetivos. A classificação final permanece sujeita à análise regulatória.</p></section>
    </article>`;
}

function renderList(options = {}) {
  const filtered = state.protocols.filter(protocolMatchesControls).sort((a, b) => searchScore(a) - searchScore(b) || a.nome.localeCompare(b.nome, 'pt-BR'));
  $('resultCount').textContent = `${filtered.length} protocolo(s) encontrado(s)`;
  $('protocolList').innerHTML = filtered.length ? filtered.map((protocol) => `
    <button type="button" class="protocol-card ${state.selected?.id === protocol.id ? 'active' : ''}" data-id="${escapeHtml(protocol.id)}">
      <h4>${escapeHtml(protocol.nome)}</h4>
      <div class="protocol-category">${escapeHtml(protocol.categoria || 'Sem categoria')}</div>
      <p>${escapeHtml(protocol.resumo || '')}</p>
      ${badgeHtml(protocol, true)}
    </button>`).join('') : '<p class="empty">Nenhum protocolo corresponde aos filtros informados.</p>';

  document.querySelectorAll('.protocol-card').forEach((card) => {
    card.addEventListener('click', () => {
      const protocol = state.protocols.find((item) => item.id === card.dataset.id);
      if (protocol) renderProtocol(protocol);
    });
  });

  const requestedId = options.requestedId || new URL(window.location.href).searchParams.get('protocolo');
  const requested = requestedId ? filtered.find((protocol) => protocol.id === requestedId) : null;
  if (requested) renderProtocol(requested, { preserveUrl: true });
  else if (filtered.length && (!state.selected || !filtered.some((protocol) => protocol.id === state.selected.id))) renderProtocol(filtered[0], { preserveUrl: Boolean(options.preserveUrl) });
  if (!filtered.length) $('detailPanel').innerHTML = '<div class="loading">Ajuste a pesquisa ou os filtros para consultar outro protocolo.</div>';
}

function populateCategories() {
  const categories = [...new Set(state.protocols.map((protocol) => protocol.categoria || 'Sem categoria'))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  $('categoryFilter').innerHTML = '<option value="todos">Todas as áreas</option>' + categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
}

function bindControls() {
  $('sideSearchInput')?.addEventListener('input', () => renderList());
  $('categoryFilter')?.addEventListener('change', () => renderList());
  $('generalBtn')?.addEventListener('click', renderGeneralRules);
  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      state.topFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((candidate) => candidate.classList.toggle('active', candidate === button));
      renderList();
    });
  });
}

async function copyText(text, successMessage) {
  if (!text) return showToast('Não há conteúdo disponível para copiar.');
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  showToast(successMessage);
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function printSection(title, values) {
  if (!arr(values).length) return '';
  return `<section class="print-section"><h2>${escapeHtml(title)}</h2>${listHtml(values)}</section>`;
}

function printProtocol(protocol) {
  $('printArea').innerHTML = `
    <article class="print-document">
      <h1>${escapeHtml(protocol.nome)}</h1>
      <div class="print-meta">Faixa etária: ${escapeHtml(protocol.faixaEtaria || 'não informada')} · Via: ${escapeHtml(accessRoute(protocol))} · Solicitante: ${escapeHtml(protocol.solicitante || 'Médico')}</div>
      ${protocol.fluxoLocal ? `<section class="print-section"><h2>Fluxo de solicitação</h2><p>${escapeHtml(protocol.fluxoLocal)}</p></section>` : ''}
      ${printSection('Critérios para encaminhar', protocol.quandoSolicitar)}
      ${printSection('Informações clínicas obrigatórias', protocol.informacoesObrigatorias)}
      ${printSection('Exames obrigatórios para solicitar', protocol.examesObrigatorios)}
      ${printSection('Exames obrigatórios conforme o caso', protocol.examesCondicionais)}
      ${printSection('Recomendados quando disponíveis', protocol.complementares)}
      ${printSection('Sinais que não devem aguardar fila ambulatorial', protocol.alertas)}
      <section class="print-section"><h2>Checklist antes de enviar</h2>${listHtml(checklistItems(protocol))}</section>
      <p class="print-note">Fonte: ${escapeHtml(arr(protocol.fontes).join(' · ') || 'não informada')} · Última conferência: ${escapeHtml(protocol.ultimaConferencia || GUIDE_META.ultimaConferencia)} · Guia V${GUIDE_META.versao}</p>
    </article>`;
  window.print();
}

async function initialize() {
  bindControls();
  try {
    state.protocols = await loadProtocols();
    populateCategories();
    const requestedId = new URL(window.location.href).searchParams.get('protocolo');
    renderList({ requestedId, preserveUrl: true });
  } catch (error) {
    $('resultCount').textContent = 'Falha no carregamento';
    $('protocolList').innerHTML = '';
    $('detailPanel').innerHTML = `<div class="error-state"><strong>Não foi possível carregar os protocolos.</strong><br>${escapeHtml(error.message)}</div>`;
  }
}

initialize();
