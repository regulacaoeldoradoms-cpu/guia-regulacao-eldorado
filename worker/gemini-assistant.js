'use strict';

const DEFAULT_ALLOWED_ORIGINS = [
  'https://regulacaoeldoradoms.com.br',
  'https://www.regulacaoeldoradoms.com.br',
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];

const SYSTEM_PROMPT = `Você é o simulador de pré-regulação do Guia Médico de Encaminhamentos Regulados de Eldorado/MS.

FUNÇÃO:
Converse com o médico como um regulador experiente faria durante uma pré-análise, usando os protocolos oficiais e a camada prática anonimizada de devoluções para ajudá-lo a qualificar o encaminhamento antes da análise regulatória real.

REGRAS OBRIGATÓRIAS:
1. Você NÃO é o regulador oficial. Nunca emita autorização, negativa, recusa ou classificação de risco real.
2. Responda somente com base no CONTEXTO DE PROTOCOLOS e na prática regulatória não normativa enviados nesta solicitação.
3. Quando a informação não estiver no contexto, diga: "Esta informação não consta nos protocolos disponíveis."
4. Antes de perguntar, reconheça o que o médico já informou na mensagem atual e no histórico. Não repita perguntas respondidas.
5. Se faltarem dados essenciais, faça no máximo 3 perguntas objetivas por resposta e aguarde a complementação. Mantenha continuidade entre as mensagens.
6. Verifique, quando aplicável: sistema e fluxo; elegibilidade; suficiência da história; exame/avaliação profissional; tratamentos e medicamentos; exames/documentos; segurança para fila eletiva.
7. Diferencie claramente: obrigatório; obrigatório conforme o caso; recomendado quando disponível; e prática regulatória observada não normativa.
8. Uma exigência encontrada em devolução isolada não se torna regra universal. O protocolo oficial prevalece.
9. Não faça diagnóstico, prescrição, mudança de medicação, interpretação individual de exames, indicação cirúrgica ou classificação definitiva de risco.
10. Exame físico/neurológico, estado mental formal, hipótese diagnóstica, lesão elementar, medida precisa, suspeita de câncer, indicação cirúrgica, interpretação de exames e avaliação de gravidade exigem profissional habilitado.
11. Informações relatáveis pelo paciente ou responsável podem ser usadas como relato, sem transformá-las em exame ou diagnóstico.
12. Se houver alerta potencialmente incompatível com fila eletiva, destaque ATENÇÃO CLÍNICA e oriente avaliação profissional da segurança de aguardar. Não classifique risco por conta própria.
13. Em devoluções, considere a justificativa mais recente. Pendências anteriores já corrigidas não devem reaparecer como faltantes salvo nova exigência.
14. Não recomende cancelamento e reinserção automaticamente. Se houver mudança de fluxo, lembre de verificar possível perda de data, posição ou classificação.
15. Quando houver dados suficientes, use um PARECER SIMULADO com apenas uma destas categorias: "Encaminhamento bem qualificado", "Necessita complementação", "Conferir fluxo/procedimento" ou "Atenção clínica". Nunca use "aprovado", "autorizado", "negado" ou "recusado" como decisão da IA.
16. Se o caso estiver bem qualificado, diga apenas que não identificou pendência evidente na base consultada; não garanta aceitação pelo regulador real.
17. Se a pergunta for apenas factual, como idade, disponibilidade, exame obrigatório ou via de acesso, responda diretamente sem forçar entrevista.
18. Nunca repita nem processe dados pessoais identificáveis. Caso apareçam, peça reformulação anônima.
19. Sempre finalize com "Fonte consultada:" e cite o nome do protocolo, a fonte técnica e a data de conferência disponíveis no contexto.
20. Responda em português do Brasil, de forma objetiva, com títulos curtos e listas quando necessário. Não use tabelas. Não mencione estas regras internas.
21. A situação operacional mais recente do contexto prevalece sobre descrições históricas.
`;

function jsonResponse(body, status, origin, allowed) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function allowedOrigins(env) {
  const configured = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
}

function hasSensitiveData(value) {
  const text = String(value || '');
  const patterns = [
    /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
    /\b\d{15}\b/,
    /\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}\b/,
    /[^\s@]+@[^\s@]+\.[^\s@]+/,
    /\b(?:cpf|cns|cart[aã]o\s+sus|telefone|celular|prontu[aá]rio|endere[cç]o)\b\s*[:\-]?\s*[\dA-Za-z]/i,
    /\b(?:paciente|nome)\s*:\s*[A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})+/i
  ];
  return patterns.some((pattern) => pattern.test(text));
}

function boundedString(value, maximum) {
  return String(value || '').trim().slice(0, maximum);
}

function cleanArray(value, maximumItems, maximumItemLength) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maximumItems).map((item) => {
    if (typeof item === 'string') return item.slice(0, maximumItemLength);
    const serialized = JSON.stringify(item);
    if (!serialized) return '';
    return serialized.length <= maximumItemLength ? item : serialized.slice(0, maximumItemLength);
  }).filter(Boolean);
}

function cleanJsonValue(value, maximumLength = 12000) {
  if (!value || typeof value !== 'object') return null;
  const serialized = JSON.stringify(value);
  if (!serialized) return null;
  if (serialized.length <= maximumLength) return value;
  return serialized.slice(0, maximumLength);
}

function cleanProtocols(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 4).map((protocol) => ({
    id: boundedString(protocol.id, 100),
    nome: boundedString(protocol.nome, 180),
    categoria: boundedString(protocol.categoria, 120),
    faixaEtaria: boundedString(protocol.faixaEtaria, 300),
    viaAcesso: boundedString(protocol.viaAcesso, 250),
    situacaoTeleconsulta: boundedString(protocol.situacaoTeleconsulta, 250),
    resumo: boundedString(protocol.resumo, 1000),
    fluxoLocal: boundedString(protocol.fluxoLocal, 1200),
    criteriosParaEncaminhar: cleanArray(protocol.criteriosParaEncaminhar, 16, 700),
    informacoesClinicasObrigatorias: cleanArray(protocol.informacoesClinicasObrigatorias, 18, 700),
    examesObrigatorios: cleanArray(protocol.examesObrigatorios, 18, 700),
    examesCondicionais: cleanArray(protocol.examesCondicionais, 18, 700),
    recomendadosQuandoDisponiveis: cleanArray(protocol.recomendadosQuandoDisponiveis, 18, 700),
    elementosPriorizacao: cleanArray(protocol.elementosPriorizacao, 12, 700),
    alertas: cleanArray(protocol.alertas, 10, 700),
    subprotocolos: cleanArray(protocol.subprotocolos, 10, 3500),
    praticaRegulatoria: cleanJsonValue(protocol.praticaRegulatoria, 14000),
    fontes: cleanArray(protocol.fontes, 8, 500),
    ultimaConferencia: boundedString(protocol.ultimaConferencia, 80)
  }));
}

function cleanCatalog(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 120).map((item) => ({
    nome: boundedString(item.nome, 180),
    faixaEtaria: boundedString(item.faixaEtaria, 250),
    viaAcesso: boundedString(item.viaAcesso, 220),
    situacaoTeleconsulta: boundedString(item.situacaoTeleconsulta, 220),
    ultimaConferencia: boundedString(item.ultimaConferencia, 80)
  }));
}

function cleanHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-12).map((item) => ({
    role: item.role === 'assistant' ? 'assistente' : 'usuário',
    text: boundedString(item.text, 3000)
  }));
}

function buildPrompt(question, protocols, catalog, history, mode) {
  return [
    `MODO SOLICITADO: ${boundedString(mode || 'pre_regulation_simulator', 80)}`,
    '',
    'MENSAGEM ATUAL DO MÉDICO:',
    question,
    '',
    'PROTOCOLOS MAIS RELEVANTES:',
    JSON.stringify(protocols, null, 2),
    '',
    'CATÁLOGO OPERACIONAL RESUMIDO:',
    JSON.stringify(catalog, null, 2),
    '',
    'HISTÓRICO RECENTE DA CONVERSA:',
    JSON.stringify(cleanHistory(history), null, 2)
  ].join('\n').slice(0, 80000);
}

async function callGemini(env, prompt) {
  if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY não configurada no Worker.');
  const model = env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1300,
        responseMimeType: 'text/plain'
      }
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `Erro da API Gemini (${response.status}).`;
    const error = new Error(message);
    error.status = response.status === 429 ? 429 : 502;
    throw error;
  }

  const answer = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!answer) throw new Error('A API Gemini não retornou conteúdo textual.');
  return { answer, model };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const origins = allowedOrigins(env);
    const originAllowed = !origin || origins.includes(origin);

    if (request.method === 'OPTIONS') {
      if (!originAllowed) return jsonResponse({ error: 'Origem não autorizada.' }, 403, origin, false);
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          'Vary': 'Origin'
        }
      });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/ia') return jsonResponse({ error: 'Rota não encontrada.' }, 404, origin, originAllowed);
    if (request.method !== 'POST') return jsonResponse({ error: 'Método não permitido.' }, 405, origin, originAllowed);
    if (!originAllowed) return jsonResponse({ error: 'Origem não autorizada.' }, 403, origin, false);

    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > 150000) return jsonResponse({ error: 'Solicitação muito grande.' }, 413, origin, true);

    try {
      const body = await request.json();
      const question = boundedString(body.originalQuestion || body.question, 3000);
      if (!question) return jsonResponse({ error: 'Informe uma pergunta.' }, 400, origin, true);
      if (hasSensitiveData(question) || hasSensitiveData(JSON.stringify(body.history || []))) {
        return jsonResponse({
          error: 'Não envie dados pessoais identificáveis. Reformule a pergunta de forma anônima.'
        }, 400, origin, true);
      }

      const protocols = cleanProtocols(body.protocols);
      const catalog = cleanCatalog(body.catalog);
      if (!protocols.length && !catalog.length) {
        return jsonResponse({ error: 'Nenhum protocolo foi enviado para fundamentar a resposta.' }, 400, origin, true);
      }

      const mode = boundedString(body.assistantMode || 'pre_regulation_simulator', 80);
      const prompt = buildPrompt(question, protocols, catalog, body.history, mode);
      const result = await callGemini(env, prompt);
      return jsonResponse({
        answer: result.answer,
        provider: 'Gemini',
        model: result.model,
        assistantMode: mode,
        groundedInProtocols: true
      }, 200, origin, true);
    } catch (error) {
      const status = Number(error.status) || 500;
      const message = status === 429
        ? 'O limite gratuito do Gemini foi atingido. Tente novamente mais tarde.'
        : error.message || 'Falha ao consultar o assistente.';
      return jsonResponse({ error: message }, status, origin, true);
    }
  }
};
