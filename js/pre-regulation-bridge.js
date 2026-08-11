'use strict';

(() => {
  const CONFIG = window.REGULATION_AI_CONFIG || {};
  const endpoint = String(CONFIG.endpoint || '');
  if (!endpoint || window.__PRE_REGULATION_BRIDGE__) return;

  const nativeFetch = window.fetch.bind(window);
  const encoder = new TextEncoder();
  const MAX_REQUEST_BYTES = 76000;
  const MODE_TITLE = 'MODO DE PRÉ-REGULAÇÃO CONVERSACIONAL — ORIENTAÇÃO DE RESPOSTA, NÃO PROTOCOLO CLÍNICO';
  const PRACTICE_TITLE = 'PRÁTICA REGULATÓRIA ANONIMIZADA — NÃO NORMATIVA';
  const MODE_RULES = [
    'Atue como simulador de raciocínio regulatório para apoiar o médico, sem se apresentar como regulador oficial e sem emitir autorização, negativa ou classificação de risco real.',
    'Antes de perguntar, reconheça o que já foi informado na conversa. Não peça novamente dados já presentes.',
    'Se faltarem dados essenciais, faça no máximo 3 perguntas objetivas por resposta e aguarde a complementação. Mantenha continuidade entre as mensagens.',
    'Verifique, nesta ordem: sistema e fluxo; elegibilidade; suficiência clínica; exames e documentos; segurança para fila eletiva.',
    'O protocolo oficial prevalece. A experiência de devoluções é prática regulatória não normativa e não transforma exigência isolada em regra universal.',
    'Separe relato do paciente/responsável de exame físico, hipótese, interpretação de exames, indicação cirúrgica, estado mental e avaliação de gravidade, que exigem profissional habilitado.',
    'Se houver possível incompatibilidade com fila eletiva, destaque atenção clínica e oriente avaliação profissional da segurança de aguardar, sem classificar risco por conta própria.',
    'Quando houver dados suficientes, use um parecer simulado: Encaminhamento bem qualificado; Necessita complementação; Conferir fluxo/procedimento; ou Atenção clínica. Nunca use aprovado, autorizado, negado ou recusado como decisão da IA.',
    'Em devoluções, considere a justificativa mais recente e não reabra pendências antigas já resolvidas. Não recomende cancelamento e reinserção automaticamente.'
  ];

  const text = (value, maximum = 420) => String(value || '').trim().slice(0, maximum);
  const list = (value, maximumItems = 6, maximumLength = 360) => Array.isArray(value)
    ? value.slice(0, maximumItems).map((item) => text(item, maximumLength)).filter(Boolean)
    : [];
  const byteSize = (value) => encoder.encode(JSON.stringify(value)).length;

  function originalQuestion(payload) {
    if (payload.originalQuestion) return String(payload.originalQuestion).trim();
    const value = String(payload.question || '');
    const marker = 'MENSAGEM DO MÉDICO:\n';
    const index = value.lastIndexOf(marker);
    return (index >= 0 ? value.slice(index + marker.length) : value).trim();
  }

  function splitChunks(value, size = 900, maximumChunks = 3) {
    const source = String(value || '').trim();
    const chunks = [];
    for (let offset = 0; offset < source.length && chunks.length < maximumChunks; offset += size) {
      chunks.push(source.slice(offset, offset + size));
    }
    return chunks;
  }

  function historyForWorker(history, question) {
    const previous = Array.isArray(history)
      ? history.slice(0, -1).slice(-3).map((item) => ({ role: item.role, text: text(item.text, 900) }))
      : [];
    const chunks = splitChunks(question);
    const current = chunks.map((chunk, index) => ({
      role: 'user',
      text: chunks.length > 1 ? `[CASO ATUAL ${index + 1}/${chunks.length}] ${chunk}` : chunk
    }));
    return [...previous, ...current].slice(-6);
  }

  function behaviorSubprotocol() {
    return {
      titulo: MODE_TITLE,
      criterios: MODE_RULES,
      informacoesObrigatorias: [],
      examesObrigatorios: [],
      examesCondicionais: [],
      recomendadosQuandoDisponiveis: []
    };
  }

  function compactPractice(practice) {
    if (!practice || typeof practice !== 'object') return null;
    return {
      natureza: text(practice.natureza, 220),
      motivosRecorrentesDeDevolucao: list(practice.motivosRecorrentesDeDevolucao, 5, 300),
      qualificacaoDaHistoria: list(practice.qualificacaoDaHistoria, 4, 300),
      exameEAvaliacaoProfissional: list(practice.exameEAvaliacaoProfissional, 3, 280),
      tratamentoEMedicamentos: list(practice.tratamentoEMedicamentos, 3, 280),
      examesEDocumentosNaPratica: list(practice.examesEDocumentosNaPratica, 4, 300),
      alertasDeSeguranca: list(practice.alertasDeSeguranca, 3, 300),
      podeVirDoPacienteOuResponsavel: list(practice.podeVirDoPacienteOuResponsavel, 3, 260),
      exigeProfissionalHabilitado: list(practice.exigeProfissionalHabilitado, 3, 280),
      dependeDoCasoNaoUniversalizar: list(practice.dependeDoCasoNaoUniversalizar, 3, 300),
      atualizadaEm: text(practice.atualizadaEm, 40)
    };
  }

  function practiceSubprotocol(practice) {
    if (!practice) return null;
    const criteria = [
      ...practice.motivosRecorrentesDeDevolucao.slice(0, 3).map((item) => `Devolução observada: ${item}`),
      ...practice.qualificacaoDaHistoria.slice(0, 2).map((item) => `Qualificação clínica: ${item}`),
      ...practice.examesEDocumentosNaPratica.slice(0, 2).map((item) => `Exames/documentos: ${item}`),
      ...practice.alertasDeSeguranca.slice(0, 2).map((item) => `Segurança: ${item}`),
      ...practice.dependeDoCasoNaoUniversalizar.slice(0, 2).map((item) => `Depende do caso: ${item}`)
    ].map((item) => text(item, 300));
    const complementary = [
      ...practice.podeVirDoPacienteOuResponsavel.slice(0, 2).map((item) => `Pode ser relatado: ${item}`),
      ...practice.exigeProfissionalHabilitado.slice(0, 2).map((item) => `Exige profissional: ${item}`),
      ...practice.tratamentoEMedicamentos.slice(0, 2).map((item) => `Tratamento: ${item}`)
    ].map((item) => text(item, 280));
    return {
      titulo: PRACTICE_TITLE,
      criterios: criteria.slice(0, 10),
      informacoesObrigatorias: [],
      examesObrigatorios: [],
      examesCondicionais: [],
      recomendadosQuandoDisponiveis: complementary.slice(0, 6)
    };
  }

  function isEmbeddedPractice(subprotocol) {
    const title = String(subprotocol?.titulo || '').toLowerCase();
    return title.includes('aplicação prática das devoluções analisadas')
      || title.includes('prática regulatória anonimizada')
      || title.includes('modo de pré-regulação conversacional');
  }

  function compactOfficialSubprotocol(subprotocol) {
    return {
      titulo: text(subprotocol?.titulo || 'Condição específica', 180),
      criterios: list(subprotocol?.criterios, 2, 220),
      informacoesObrigatorias: list(subprotocol?.informacoesObrigatorias, 2, 220),
      examesObrigatorios: list(subprotocol?.examesObrigatorios, 2, 220),
      examesCondicionais: list(subprotocol?.examesCondicionais, 2, 220),
      recomendadosQuandoDisponiveis: list(subprotocol?.recomendadosQuandoDisponiveis, 2, 220)
    };
  }

  function compactProtocol(protocol) {
    const practice = compactPractice(protocol?.praticaRegulatoria);
    const officialSubprotocols = Array.isArray(protocol?.subprotocolos)
      ? protocol.subprotocolos.filter((item) => !isEmbeddedPractice(item)).slice(0, 5).map(compactOfficialSubprotocol)
      : [];
    return {
      id: text(protocol?.id, 80),
      nome: text(protocol?.nome, 150),
      categoria: text(protocol?.categoria, 100),
      faixaEtaria: text(protocol?.faixaEtaria, 220),
      viaAcesso: text(protocol?.viaAcesso, 180),
      situacaoTeleconsulta: text(protocol?.situacaoTeleconsulta, 180),
      resumo: text(protocol?.resumo, 650),
      fluxoLocal: text(protocol?.fluxoLocal, 700),
      criteriosParaEncaminhar: list(protocol?.criteriosParaEncaminhar, 8, 320),
      informacoesClinicasObrigatorias: list(protocol?.informacoesClinicasObrigatorias, 9, 320),
      examesObrigatorios: list(protocol?.examesObrigatorios, 9, 300),
      examesCondicionais: list(protocol?.examesCondicionais, 7, 300),
      recomendadosQuandoDisponiveis: list(protocol?.recomendadosQuandoDisponiveis, 6, 280),
      elementosPriorizacao: list(protocol?.elementosPriorizacao, 6, 300),
      alertas: list(protocol?.alertas, 6, 300),
      subprotocolos: [behaviorSubprotocol(), practiceSubprotocol(practice), ...officialSubprotocols].filter(Boolean).slice(0, 7),
      praticaRegulatoria: practice,
      fontes: list(protocol?.fontes, 4, 260),
      ultimaConferencia: text(protocol?.ultimaConferencia, 60)
    };
  }

  function compactCatalog(catalog) {
    if (!Array.isArray(catalog)) return [];
    return catalog.slice(0, 120).map((item) => ({
      nome: text(item?.nome, 120),
      faixaEtaria: text(item?.faixaEtaria, 120),
      viaAcesso: text(item?.viaAcesso, 100),
      situacaoTeleconsulta: text(item?.situacaoTeleconsulta, 100)
    }));
  }

  function protocolsForWorker(protocols) {
    if (!Array.isArray(protocols)) return [];
    return protocols.slice(0, 2).map(compactProtocol);
  }

  function fitPayload(payload) {
    if (byteSize(payload) <= MAX_REQUEST_BYTES) return payload;

    payload.protocols = payload.protocols.slice(0, 1);
    payload.history = payload.history.slice(-4);
    if (byteSize(payload) <= MAX_REQUEST_BYTES) return payload;

    payload.catalog = payload.catalog.map((item) => ({ nome: item.nome, viaAcesso: item.viaAcesso, situacaoTeleconsulta: item.situacaoTeleconsulta }));
    if (byteSize(payload) <= MAX_REQUEST_BYTES) return payload;

    payload.catalog = payload.catalog.slice(0, 60);
    if (payload.protocols[0]) {
      payload.protocols[0].subprotocolos = payload.protocols[0].subprotocolos.slice(0, 4);
      payload.protocols[0].criteriosParaEncaminhar = payload.protocols[0].criteriosParaEncaminhar.slice(0, 6);
      payload.protocols[0].informacoesClinicasObrigatorias = payload.protocols[0].informacoesClinicasObrigatorias.slice(0, 6);
      payload.protocols[0].examesObrigatorios = payload.protocols[0].examesObrigatorios.slice(0, 6);
      payload.protocols[0].examesCondicionais = payload.protocols[0].examesCondicionais.slice(0, 4);
    }
    return payload;
  }

  function transformBody(body) {
    const payload = { ...body };
    const question = originalQuestion(payload);
    payload.originalQuestion = question;
    const shortQuestion = text(question, 560);
    payload.question = `${shortQuestion}\n\nModo: pré-regulação conversacional. Considere o CASO ATUAL completo registrado no histórico e não repita perguntas já respondidas.`;
    payload.history = historyForWorker(payload.history, question);
    payload.protocols = protocolsForWorker(payload.protocols);
    payload.catalog = compactCatalog(payload.catalog);
    payload.assistantMode = 'pre_regulation_simulator';
    payload.contextCompression = 'pre_regulation_compact_v2';
    return fitPayload(payload);
  }

  window.fetch = function preRegulationFetch(input, init) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = String(init?.method || 'GET').toUpperCase();
    if (url !== endpoint || method !== 'POST' || typeof init?.body !== 'string') {
      return nativeFetch(input, init);
    }

    try {
      const body = JSON.parse(init.body);
      const transformed = transformBody(body);
      return nativeFetch(input, { ...init, body: JSON.stringify(transformed) });
    } catch (_) {
      return nativeFetch(input, init);
    }
  };

  Object.defineProperty(window, '__PRE_REGULATION_BRIDGE__', {
    value: true,
    enumerable: false
  });
})();
