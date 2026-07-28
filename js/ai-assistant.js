'use strict';

(() => {
  const CONFIG = window.REGULATION_AI_CONFIG || {};
  const MAX_QUESTION_LENGTH = Number(CONFIG.maxQuestionLength) || 800;
  const MAX_HISTORY_MESSAGES = Number(CONFIG.maxHistoryMessages) || 6;
  const history = [];
  let initialized = false;
  let busy = false;

  const SVG = {
    chat: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></svg>',
    close: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    send: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>',
    assistant: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="13" rx="3"/><path d="M9 10h.01M15 10h.01M8 15h8M12 3v3"/></svg>'
  };

  const STOP_WORDS = new Set([
    'para', 'com', 'sem', 'uma', 'uns', 'das', 'dos', 'que', 'qual', 'quais', 'como', 'pelo', 'pela',
    'esta', 'estao', 'está', 'estão', 'pode', 'deve', 'ser', 'tem', 'ter', 'sobre', 'entre', 'quando',
    'precisa', 'necessario', 'necessaria', 'solicitar', 'encaminhar', 'encaminhamento', 'paciente'
  ]);

  const normalizeText = (value) => (value ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const protocols = () => typeof state !== 'undefined' && Array.isArray(state.protocols) ? state.protocols : [];
  const asArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
  const textItems = (value, limit = 16, length = 700) => asArray(value).slice(0, limit).map((item) => String(item).slice(0, length));

  function routeFor(protocol) {
    if (typeof accessRoute === 'function') return accessRoute(protocol);
    const systems = protocol.sistemas || {};
    const routes = [];
    if (systems.sisreg) routes.push('SISREG/CORE');
    if (systems.digsusStatus === 'disponivel') routes.push('DigSaúde MS');
    if (systems.digsusStatus === 'assincrona') routes.push('Discussão de conduta');
    if (systems.digsusStatus === 'indisponivel_local' && routes.length === 0) routes.push('Teleatendimento indisponível');
    return routes.join(' e ') || 'Conferir disponibilidade';
  }

  function teleconsultStatus(protocol) {
    const status = protocol.sistemas?.digsusStatus;
    if (status === 'disponivel') return 'Disponível no DigSaúde MS';
    if (status === 'assincrona') return 'Disponível somente para discussão de conduta';
    if (status === 'indisponivel_local') return 'Teleconsulta indisponível no momento';
    if (status === 'nao_consta') return 'Sem oferta cadastrada no teleatendimento';
    return protocol.sistemas?.digsus ? 'Conferir disponibilidade operacional' : 'Não disponível no DigSaúde MS';
  }

  function containsSensitiveData(value) {
    const text = String(value || '').trim();
    return [
      /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
      /\b\d{15}\b/,
      /\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}\b/,
      /[^\s@]+@[^\s@]+\.[^\s@]+/,
      /\b(?:cpf|cns|cart[aã]o\s+sus|telefone|celular|prontu[aá]rio|endere[cç]o)\b\s*[:\-]?\s*[\dA-Za-z]/i,
      /\b(?:paciente|nome)\s*:\s*[A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})+/i
    ].some((pattern) => pattern.test(text));
  }

  function termsFor(question) {
    return normalizeText(question).split(/[^a-z0-9]+/).filter((term) => term.length > 2 && !STOP_WORDS.has(term));
  }

  function rankProtocols(question) {
    const terms = termsFor(question);
    const selectedId = typeof state !== 'undefined' ? state.selected?.id : null;
    return protocols().map((protocol) => {
      const name = normalizeText(protocol.nome);
      const category = normalizeText(protocol.categoria);
      const tags = normalizeText(asArray(protocol.tags).join(' '));
      const searchText = protocol._searchText || normalizeText(JSON.stringify(protocol));
      let score = protocol.id === selectedId ? 18 : 0;
      for (const term of terms) {
        if (name === term) score += 20;
        else if (name.includes(term)) score += 12;
        if (category.includes(term)) score += 5;
        if (tags.includes(term)) score += 8;
        if (searchText.includes(term)) score += 2;
      }
      return { protocol, score };
    }).sort((a, b) => b.score - a.score || (a.protocol.prioridade || 99) - (b.protocol.prioridade || 99));
  }

  function subprotocolContext(value) {
    return asArray(value).slice(0, 10).map((subprotocol) => ({
      titulo: String(subprotocol.titulo || 'Condição específica').slice(0, 300),
      criterios: textItems(subprotocol.quando, 14),
      informacoesObrigatorias: textItems(subprotocol.obrigatorias, 16),
      examesObrigatorios: textItems(subprotocol.examesObrigatorios, 16),
      examesCondicionais: textItems(subprotocol.condicionais, 16),
      recomendadosQuandoDisponiveis: textItems(subprotocol.complementares, 16)
    }));
  }

  function protocolContext(protocol) {
    return {
      id: protocol.id,
      nome: protocol.nome,
      categoria: protocol.categoria,
      faixaEtaria: protocol.faixaEtaria,
      viaAcesso: routeFor(protocol),
      situacaoTeleconsulta: teleconsultStatus(protocol),
      resumo: protocol.resumo,
      fluxoLocal: protocol.fluxoLocal,
      criteriosParaEncaminhar: textItems(protocol.quandoSolicitar),
      informacoesClinicasObrigatorias: textItems(protocol.informacoesObrigatorias),
      examesObrigatorios: textItems(protocol.examesObrigatorios),
      examesCondicionais: textItems(protocol.examesCondicionais),
      recomendadosQuandoDisponiveis: textItems(protocol.complementares),
      elementosPriorizacao: textItems(protocol.ajudaPriorizacao),
      alertas: textItems(protocol.alertas),
      subprotocolos: subprotocolContext(protocol.subprotocolos),
      fontes: textItems(protocol.fontes, 8, 500),
      ultimaConferencia: protocol.ultimaConferencia || '28/07/2026'
    };
  }

  function requestContext(question) {
    const ranked = rankProtocols(question);
    let selected = ranked.filter((item) => item.score > 0).slice(0, 4).map((item) => item.protocol);
    if (!selected.length) selected = ranked.slice(0, 2).map((item) => item.protocol);
    return {
      protocols: selected.map(protocolContext),
      catalog: protocols().map((protocol) => ({
        nome: protocol.nome,
        faixaEtaria: protocol.faixaEtaria,
        viaAcesso: routeFor(protocol),
        situacaoTeleconsulta: teleconsultStatus(protocol),
        ultimaConferencia: protocol.ultimaConferencia || '28/07/2026'
      })),
      selectedProtocolId: typeof state !== 'undefined' ? state.selected?.id || null : null
    };
  }

  function bulletSection(title, values) {
    return values.length ? `\n\n${title}\n${values.map((item) => `- ${item}`).join('\n')}` : '';
  }

  function matchingSubprotocols(protocol, question) {
    const terms = termsFor(question);
    const ranked = asArray(protocol.subprotocolos).map((subprotocol) => {
      const text = normalizeText(JSON.stringify(subprotocol));
      const score = terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
      return { subprotocol, score };
    }).sort((a, b) => b.score - a.score);
    const matched = ranked.filter((item) => item.score > 0).slice(0, 3);
    return matched.length ? matched.map((item) => item.subprotocol) : ranked.slice(0, 3).map((item) => item.subprotocol);
  }

  function localAnswer(question, connectionMissing = !CONFIG.endpoint) {
    const ranked = rankProtocols(question);
    const match = ranked.find((item) => item.score > 0)?.protocol || ranked[0]?.protocol;
    if (!match) return 'Os protocolos ainda estão carregando. Tente novamente em alguns segundos.';

    const normalizedQuestion = normalizeText(question);
    let answer = `${match.nome}\n`;
    if (/dispon|teleconsulta|digsus|via|sistema/.test(normalizedQuestion)) {
      answer += `Situação da teleconsulta: ${teleconsultStatus(match)}.\nVia de acesso: ${routeFor(match)}.`;
    } else if (/idade|etaria|anos|faixa/.test(normalizedQuestion)) {
      answer += `Faixa etária: ${match.faixaEtaria || 'não informada no protocolo'}.\nVia de acesso: ${routeFor(match)}.`;
    } else {
      answer += `${match.resumo || ''}\nVia de acesso: ${routeFor(match)}.\nFaixa etária: ${match.faixaEtaria || 'não informada'}.`;
      if (/exame|laudo|imagem|radiografia|ultrassom|ressonancia|tomografia/.test(normalizedQuestion)) {
        answer += bulletSection('Exames obrigatórios', textItems(match.examesObrigatorios));
        answer += bulletSection('Exames condicionais, somente quando aplicável', textItems(match.examesCondicionais));
        answer += bulletSection('Recomendados quando disponíveis', textItems(match.complementares));
      } else {
        answer += bulletSection('Informações clínicas obrigatórias', textItems(match.informacoesObrigatorias, 8));
        answer += bulletSection('Exames obrigatórios', textItems(match.examesObrigatorios, 8));
        answer += bulletSection('Exames condicionais', textItems(match.examesCondicionais, 6));
      }

      for (const subprotocol of matchingSubprotocols(match, question)) {
        const details = [
          ...textItems(subprotocol.obrigatorias, 8),
          ...textItems(subprotocol.examesObrigatorios, 8),
          ...textItems(subprotocol.condicionais, 6)
        ];
        if (details.length) answer += bulletSection(subprotocol.titulo || 'Condição específica', details);
      }
    }

    answer += bulletSection('Atenção: situações que não devem aguardar fila ambulatorial', textItems(match.alertas, 4));
    const sources = textItems(match.fontes, 4, 500).join(' · ') || 'base de protocolos do guia';
    answer += `\n\nFonte consultada: ${sources}. Última conferência: ${match.ultimaConferencia || '28/07/2026'}.`;
    if (connectionMissing) answer += '\n\nResposta local automática. A conexão com o Gemini ainda não está ativada.';
    return answer.trim();
  }

  function addMessage(role, text, extraClass = '') {
    const messages = document.getElementById('aiMessages');
    if (!messages) return null;
    const element = document.createElement('div');
    element.className = `ai-message ${role} ${extraClass}`.trim();
    element.textContent = text;
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
    return element;
  }

  function setBusy(value) {
    busy = value;
    const send = document.getElementById('aiSend');
    const input = document.getElementById('aiInput');
    if (send) send.disabled = value;
    if (input) input.disabled = value;
  }

  async function askGemini(question, context) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          question,
          protocols: context.protocols,
          catalog: context.catalog,
          selectedProtocolId: context.selectedProtocolId,
          history: history.slice(-MAX_HISTORY_MESSAGES)
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Falha na consulta (${response.status}).`);
      if (!payload.answer) throw new Error('A IA não retornou uma resposta válida.');
      return payload.answer;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function submitQuestion(question) {
    if (busy) return;
    const cleanQuestion = String(question || '').trim().slice(0, MAX_QUESTION_LENGTH);
    if (!cleanQuestion) return;
    if (containsSensitiveData(cleanQuestion)) {
      addMessage('assistant', 'Não envie nome, CPF, Cartão SUS, telefone, endereço, prontuário ou outros dados que identifiquem o paciente. Reformule a pergunta de forma anônima.', 'error');
      return;
    }

    addMessage('user', cleanQuestion);
    history.push({ role: 'user', text: cleanQuestion });
    setBusy(true);
    const loading = addMessage('assistant', CONFIG.endpoint ? 'Consultando os protocolos com o Gemini...' : 'Consultando os protocolos locais...', 'loading');
    try {
      const context = requestContext(cleanQuestion);
      const answer = CONFIG.endpoint ? await askGemini(cleanQuestion, context) : localAnswer(cleanQuestion, true);
      loading?.remove();
      addMessage('assistant', answer);
      history.push({ role: 'assistant', text: answer.slice(0, 4000) });
    } catch (error) {
      loading?.remove();
      const fallback = localAnswer(cleanQuestion, false);
      addMessage('assistant', `${fallback}\n\nA conexão com o Gemini falhou: ${error.message}`, 'error');
    } finally {
      setBusy(false);
      document.getElementById('aiInput')?.focus();
    }
  }

  function openChat() {
    const chat = document.getElementById('aiChat');
    if (!chat) return;
    chat.hidden = false;
    document.getElementById('aiLauncher')?.setAttribute('aria-expanded', 'true');
    document.getElementById('aiInput')?.focus();
  }

  function closeChat() {
    const chat = document.getElementById('aiChat');
    if (!chat) return;
    chat.hidden = true;
    const launcher = document.getElementById('aiLauncher');
    launcher?.setAttribute('aria-expanded', 'false');
    launcher?.focus();
  }

  function createInterface() {
    if (initialized) return;
    initialized = true;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <button class="ai-launcher" id="aiLauncher" type="button" aria-label="Abrir assistente dos protocolos" aria-controls="aiChat" aria-expanded="false">${SVG.chat}<span>Consultar protocolos</span></button>
      <section class="ai-chat" id="aiChat" role="dialog" aria-modal="false" aria-labelledby="aiChatTitle" hidden>
        <header class="ai-chat-header">
          <div class="ai-chat-title">${SVG.assistant}<div><h2 id="aiChatTitle">Assistente dos Protocolos</h2><p>Respostas limitadas à base técnica cadastrada</p></div></div>
          <button class="ai-close" id="aiClose" type="button" aria-label="Fechar assistente">${SVG.close}</button>
        </header>
        <div class="ai-privacy-note">Não informe nome, CPF, Cartão SUS, telefone, endereço ou número de prontuário. Use somente perguntas gerais ou casos anonimizados.</div>
        <span class="ai-mode ${CONFIG.endpoint ? 'connected' : ''}" id="aiMode">${CONFIG.endpoint ? 'Gemini conectado' : 'Consulta local'}</span>
        <div class="ai-messages" id="aiMessages" aria-live="polite">
          <div class="ai-suggestions" id="aiSuggestions">
            <button class="ai-suggestion" type="button">Dermatologia está disponível por teleconsulta?</button>
            <button class="ai-suggestion" type="button">Qual a idade máxima para Neuropediatria?</button>
            <button class="ai-suggestion" type="button">Quais exames são exigidos para Ortopedia de ombro?</button>
          </div>
        </div>
        <form class="ai-form" id="aiForm">
          <div class="ai-input-wrap">
            <textarea class="ai-input" id="aiInput" rows="1" maxlength="${MAX_QUESTION_LENGTH}" placeholder="Pergunte sobre especialidade, idade, exames ou via de acesso" aria-label="Pergunta para o assistente"></textarea>
            <div class="ai-counter"><span id="aiCounter">0</span>/${MAX_QUESTION_LENGTH}</div>
          </div>
          <button class="ai-send" id="aiSend" type="submit" aria-label="Enviar pergunta">${SVG.send}</button>
        </form>
      </section>`;
    document.body.append(...wrapper.children);

    addMessage('assistant', 'Consulte requisitos, exames, faixa etária, disponibilidade e via de acesso. As respostas não substituem avaliação clínica nem análise regulatória.');
    document.getElementById('aiLauncher')?.addEventListener('click', openChat);
    document.getElementById('aiClose')?.addEventListener('click', closeChat);
    document.getElementById('aiSuggestions')?.addEventListener('click', (event) => {
      const button = event.target.closest('.ai-suggestion');
      if (button) submitQuestion(button.textContent || '');
    });

    const input = document.getElementById('aiInput');
    input?.addEventListener('input', () => {
      const counter = document.getElementById('aiCounter');
      if (counter) counter.textContent = String(input.value.length);
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
    });
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('aiForm')?.requestSubmit();
      }
    });
    document.getElementById('aiForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!input) return;
      const question = input.value;
      input.value = '';
      input.dispatchEvent(new Event('input'));
      submitQuestion(question);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !document.getElementById('aiChat')?.hidden) closeChat();
    });
  }

  function initialize() {
    createInterface();
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (protocols().length || attempts > 150) window.clearInterval(timer);
    }, 100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
