'use strict';

(() => {
  const CONFIG = window.REGULATION_AI_CONFIG || {};
  const MAX_QUESTION_LENGTH = Number(CONFIG.maxQuestionLength) || 3000;
  const MAX_HISTORY_MESSAGES = Number(CONFIG.maxHistoryMessages) || 12;
  const history = [];
  let initialized = false;
  let busy = false;

  const SVG = {
    chat: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></svg>',
    close: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    send: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>',
    assistant: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3c.7 4.5 3.5 7.3 8 8-4.5.7-7.3 3.5-8 8-.7-4.5-3.5-7.3-8-8 4.5-.7 7.3-3.5 8-8z"/></svg>'
  };

  const REGULATOR_MODE_INSTRUCTION = [
    'MODO DE PRÉ-REGULAÇÃO CONVERSACIONAL DO GUIA MÉDICO.',
    'Você é um SIMULADOR DE RACIOCÍNIO REGULATÓRIO para apoiar médicos na qualificação de encaminhamentos. Converse como um médico regulador experiente faria durante uma pré-análise, mas nunca se apresente como regulador oficial e nunca emita autorização, negativa oficial ou classificação de risco real.',
    'Use prioritariamente a base protocolar oficial enviada no contexto. A experiência de devoluções reais aparece como práticaRegulatoria ou em blocos identificados como aplicação prática/não normativa: use-a para antecipar dúvidas e devoluções, mas nunca transforme uma exigência isolada em regra universal.',
    'Antes de perguntar qualquer coisa, reconheça o que o médico JÁ informou. Não repita perguntas respondidas na mensagem atual ou no histórico da conversa.',
    'Se o médico trouxer um caso ou encaminhamento: identifique especialidade/procedimento e sistema quando possível; verifique elegibilidade, suficiência clínica, exames/documentos, fluxo correto e segurança clínica. Se o sistema fizer diferença e não estiver claro, pergunte qual é.',
    'Conduza a conversa em etapas. Quando faltarem dados essenciais, faça no máximo 3 perguntas objetivas por resposta e aguarde. Não despeje uma lista longa de requisitos de uma vez.',
    'Separe sempre: (1) protocolo oficial; (2) prática regulatória observada; (3) informação que pode ser relatada pelo paciente/responsável; (4) informação que exige avaliação profissional, quando isso for relevante.',
    'Informações como exame físico/neurológico, estado mental formal, hipótese diagnóstica, lesão elementar, medida precisa, suspeita de câncer, indicação cirúrgica, interpretação de exames, mudança de tratamento e classificação de risco exigem profissional habilitado. Não invente nem peça que o paciente produza esses dados.',
    'Se houver sinal potencialmente incompatível com fila eletiva, destaque ATENÇÃO CLÍNICA e diga que a segurança de aguardar precisa ser avaliada imediatamente pela equipe responsável. Não determine sozinho uma classificação de risco.',
    'Em solicitações devolvidas, leia a cronologia: a justificativa mais recente prevalece; pendências anteriores já corrigidas não devem reaparecer como faltantes, salvo nova exigência.',
    'Não recomende cancelamento e reinserção automaticamente. Se houver troca de fluxo, lembre que é preciso verificar perda de data, posição ou classificação.',
    'Quando houver informação suficiente para uma síntese, use um PARECER SIMULADO com apenas uma destas categorias: 🟢 Encaminhamento bem qualificado; 🟡 Necessita complementação; 🟠 Conferir fluxo/procedimento; 🔴 Atenção clínica. Nunca escreva APROVADO, AUTORIZADO, NEGADO ou RECUSADO como decisão da IA.',
    'Se o caso estiver bem qualificado, diga apenas que não identificou pendência evidente na base consultada; não garanta que o regulador real aceitará.',
    'Se a pergunta for apenas factual (idade, disponibilidade, exame obrigatório, via de acesso), responda diretamente e de forma curta, sem forçar uma entrevista.',
    'Mantenha continuidade entre as mensagens: trate respostas curtas do médico como complementação do caso em andamento e não reinicie a análise.',
    'Não exponha dados identificáveis. Se houver dado pessoal, oriente a anonimizar.'
  ].join('\n');

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
      let score = protocol.id === selectedId ? 30 : 0;
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
    return asArray(value).slice(0, 12).map((subprotocol) => ({
      titulo: String(subprotocol.titulo || 'Condição específica').slice(0, 300),
      criterios: textItems(subprotocol.quando, 16),
      informacoesObrigatorias: textItems(subprotocol.obrigatorias, 18),
      examesObrigatorios: textItems(subprotocol.examesObrigatorios, 18),
      examesCondicionais: textItems(subprotocol.condicionais, 18),
      recomendadosQuandoDisponiveis: textItems(subprotocol.complementares, 18)
    }));
  }

  function practicalContext(protocol) {
    let guidance = protocol?.practicalGuidance;
    if (!guidance && typeof window.getReferralPracticalGuidance === 'function') {
      try { guidance = window.getReferralPracticalGuidance(protocol); } catch (_) { guidance = null; }
    }
    if (!guidance) return null;
    return {
      natureza: 'Camada prática não normativa derivada de devoluções regulatórias anonimizadas.',
      perfisRelacionados: textItems(guidance.labels, 10, 300),
      motivosRecorrentesDeDevolucao: textItems(guidance.returns, 14),
      qualificacaoDaHistoria: textItems(guidance.history, 12),
      exameEAvaliacaoProfissional: textItems(guidance.examination, 10),
      tratamentoEMedicamentos: textItems(guidance.treatment, 10),
      examesEDocumentosNaPratica: textItems(guidance.investigations, 12),
      alertasDeSeguranca: textItems(guidance.safety, 10),
      podeVirDoPacienteOuResponsavel: textItems(guidance.patientReportable, 10),
      exigeProfissionalHabilitado: textItems(guidance.professionalOnly, 10),
      dependeDoCasoNaoUniversalizar: textItems(guidance.caseDependent, 12),
      politicaDeResposta: textItems(guidance.methodology?.responsePolicy, 14),
      limitacao: String(guidance.methodology?.limitation || '').slice(0, 1000),
      atualizadaEm: guidance.updatedAt || null
    };
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
      praticaRegulatoria: practicalContext(protocol),
      fontes: textItems(protocol.fontes, 8, 500),
      ultimaConferencia: protocol.ultimaConferencia || '28/07/2026'
    };
  }

  function requestContext(question) {
    const ranked = rankProtocols(question);
    const current = typeof state !== 'undefined' ? state.selected : null;
    let selected = ranked.filter((item) => item.score > 0).slice(0, 4).map((item) => item.protocol);
    if (current && !selected.some((protocol) => protocol.id === current.id)) selected.unshift(current);
    if (!selected.length) selected = ranked.slice(0, 2).map((item) => item.protocol);
    selected = selected.slice(0, 4);
    return {
      protocols: selected.map(protocolContext),
      catalog: protocols().map((protocol) => ({
        nome: protocol.nome,
        faixaEtaria: protocol.faixaEtaria,
        viaAcesso: routeFor(protocol),
        situacaoTeleconsulta: teleconsultStatus(protocol),
        ultimaConferencia: protocol.ultimaConferencia || '28/07/2026'
      })),
      selectedProtocolId: current?.id || null,
      selectedProtocolName: current?.nome || null,
      practiceKnowledgeVersion: window.REFERRAL_PRACTICE_GUIDANCE?.version || null
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

    const practical = practicalContext(match);
    if (/devol|regulad|analise|análise|qualificar|falt/.test(normalizedQuestion) && practical) {
      answer += bulletSection('Prática regulatória observada — não normativa', practical.motivosRecorrentesDeDevolucao.slice(0, 5));
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

  function regulatorQuestion(question, context) {
    const selected = context.selectedProtocolName ? `\nPROTOCOLO ATUALMENTE ABERTO NO GUIA: ${context.selectedProtocolName}.` : '';
    return `${REGULATOR_MODE_INSTRUCTION}${selected}\n\nMENSAGEM DO MÉDICO:\n${question}`;
  }

  async function askGemini(question, context) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          question: regulatorQuestion(question, context),
          originalQuestion: question,
          assistantMode: CONFIG.mode || 'pre_regulation_simulator',
          protocols: context.protocols,
          catalog: context.catalog,
          selectedProtocolId: context.selectedProtocolId,
          selectedProtocolName: context.selectedProtocolName,
          practiceKnowledgeVersion: context.practiceKnowledgeVersion,
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
      addMessage('assistant', 'Não envie nome, CPF, Cartão SUS, telefone, endereço, prontuário ou outros dados que identifiquem o paciente. Remova os identificadores e envie apenas o conteúdo clínico necessário.', 'error');
      return;
    }

    addMessage('user', cleanQuestion);
    history.push({ role: 'user', text: cleanQuestion });
    setBusy(true);
    const loading = addMessage('assistant', CONFIG.endpoint ? 'Fazendo a pré-análise regulatória com o Gemini...' : 'Consultando os protocolos locais...', 'loading');
    try {
      const context = requestContext(cleanQuestion);
      const answer = CONFIG.endpoint ? await askGemini(cleanQuestion, context) : localAnswer(cleanQuestion, true);
      loading?.remove();
      addMessage('assistant', answer);
      history.push({ role: 'assistant', text: answer.slice(0, 7000) });
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
      <button class="ai-launcher" id="aiLauncher" type="button" aria-label="Abrir pré-regulação com inteligência artificial" aria-controls="aiChat" aria-expanded="false">${SVG.chat}<span>Pré-regulação com IA</span></button>
      <section class="ai-chat" id="aiChat" role="dialog" aria-modal="false" aria-labelledby="aiChatTitle" hidden>
        <header class="ai-chat-header">
          <div class="ai-chat-title">${SVG.assistant}<div><h2 id="aiChatTitle">Pré-regulação com Gemini</h2><p>Simulação baseada em protocolo + prática regulatória</p></div></div>
          <button class="ai-close" id="aiClose" type="button" aria-label="Fechar assistente">${SVG.close}</button>
        </header>
        <div class="ai-privacy-note">Use casos anonimizados. Não informe nome, CPF, Cartão SUS, telefone, endereço, prontuário ou outro identificador.</div>
        <span class="ai-mode ${CONFIG.endpoint ? 'connected' : ''}" id="aiMode">${CONFIG.endpoint ? 'Gemini · modo pré-regulação' : 'Consulta local'}</span>
        <div class="ai-messages" id="aiMessages" aria-live="polite">
          <div class="ai-suggestions" id="aiSuggestions">
            <button class="ai-suggestion" type="button">Quero fazer uma pré-análise de um encaminhamento. Me conduza como regulador.</button>
            <button class="ai-suggestion" type="button">Vou colar um encaminhamento anonimizado. Analise o que já está adequado e pergunte só o que faltar.</button>
            <button class="ai-suggestion" type="button">Quero conferir se escolhi a especialidade e o fluxo corretos.</button>
          </div>
        </div>
        <form class="ai-form" id="aiForm">
          <div class="ai-input-wrap">
            <textarea class="ai-input" id="aiInput" rows="1" maxlength="${MAX_QUESTION_LENGTH}" placeholder="Descreva o caso ou cole o encaminhamento anonimizado" aria-label="Mensagem para a pré-regulação"></textarea>
            <div class="ai-counter"><span id="aiCounter">0</span>/${MAX_QUESTION_LENGTH}</div>
          </div>
          <button class="ai-send" id="aiSend" type="submit" aria-label="Enviar mensagem">${SVG.send}</button>
        </form>
      </section>`;
    document.body.append(...wrapper.children);

    addMessage('assistant', 'Posso fazer uma pré-análise como um regulador faria: reconheço o que já está adequado, confiro protocolo e fluxo, uso as devoluções reais como experiência prática e faço poucas perguntas por vez sobre o que realmente faltar. A decisão regulatória oficial continua sendo do profissional responsável.');
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
      input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
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
