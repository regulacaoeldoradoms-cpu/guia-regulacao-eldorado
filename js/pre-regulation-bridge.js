'use strict';

(() => {
  const CONFIG = window.REGULATION_AI_CONFIG || {};
  const endpoint = String(CONFIG.endpoint || '');
  if (!endpoint || window.__PRE_REGULATION_BRIDGE__) return;

  const nativeFetch = window.fetch.bind(window);
  const MODE_TITLE = 'MODO DE PRÉ-REGULAÇÃO CONVERSACIONAL — ORIENTAÇÃO DE RESPOSTA, NÃO PROTOCOLO CLÍNICO';
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

  function originalQuestion(payload) {
    if (payload.originalQuestion) return String(payload.originalQuestion).trim();
    const value = String(payload.question || '');
    const marker = 'MENSAGEM DO MÉDICO:\n';
    const index = value.lastIndexOf(marker);
    return (index >= 0 ? value.slice(index + marker.length) : value).trim();
  }

  function splitChunks(value, size = 1000, maximumChunks = 3) {
    const text = String(value || '').trim();
    const chunks = [];
    for (let offset = 0; offset < text.length && chunks.length < maximumChunks; offset += size) {
      chunks.push(text.slice(offset, offset + size));
    }
    return chunks;
  }

  function historyForWorker(history, question) {
    const previous = Array.isArray(history) ? history.slice(0, -1).slice(-3) : [];
    const chunks = splitChunks(question);
    const current = chunks.map((text, index) => ({
      role: 'user',
      text: chunks.length > 1 ? `[CASO ATUAL ${index + 1}/${chunks.length}] ${text}` : text
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

  function protocolsForWorker(protocols) {
    if (!Array.isArray(protocols)) return [];
    return protocols.map((protocol) => ({
      ...protocol,
      subprotocolos: [behaviorSubprotocol(), ...(Array.isArray(protocol.subprotocolos) ? protocol.subprotocolos : [])]
    }));
  }

  function transformBody(body) {
    const payload = { ...body };
    const question = originalQuestion(payload);
    payload.originalQuestion = question;
    payload.question = `${question}\n\nModo: pré-regulação conversacional. Use o histórico e o contexto do protocolo para continuar a análise sem repetir perguntas já respondidas.`;
    payload.history = historyForWorker(payload.history, question);
    payload.protocols = protocolsForWorker(payload.protocols);
    payload.assistantMode = 'pre_regulation_simulator';
    return payload;
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
