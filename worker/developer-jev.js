'use strict';

import { validatePortalSession } from './auth-management-flex.js';

const ROUTE = '/api/admin/jev/evaluate';
const DEFAULT_MODEL = 'typesafe/jev';
const MAX_TASK_CHARS = 12000;

function json(body, status, origin, allowed = true) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '600',
    'Cache-Control': 'no-store',
    Vary: 'Origin'
  };
  return new Response(null, { status: 204, headers });
}

function enabled(value) {
  return String(value ?? '').trim().toLowerCase() === 'true';
}

function safeChoice(answer, allowed, fallback) {
  const choice = String(answer?.choice || '').trim().toLowerCase();
  return allowed.includes(choice) ? choice : fallback;
}

function answerConfidence(answer) {
  const value = Number(answer?.confidence);
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : null;
}

function astraProbability(answer) {
  const value = Number(answer?.noul);
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

function modelLabel(tier) {
  if (tier === 'astra') return 'GPT-6 Astra';
  if (tier === 'sol') return 'GPT-5.6 Sol';
  return 'Modelo Codex econômico';
}

function testLabel(scope) {
  if (scope === 'integration') return 'Integração / regressão';
  if (scope === 'standard') return 'Padrão';
  return 'Focal';
}

function buildPreparedPrompt(task, routing) {
  return [
    'ROTEAMENTO JEV — PORTAL DA REGULAÇÃO',
    `Modelo sugerido: ${routing.modelLabel}`,
    `Esforço de raciocínio: ${routing.reasoningEffort}`,
    `Complexidade: ${routing.complexity}`,
    `Risco: ${routing.risk}`,
    `Escopo provável: ${routing.scope}`,
    `Testes: ${routing.testLabel}`,
    '',
    'Instruções de execução:',
    '- Preserve as regras de negócio e o código atual do Portal.',
    '- Leia o contexto do módulo afetado antes de editar.',
    '- Não amplie o escopo sem necessidade.',
    '- Faça os testes proporcionais ao risco indicado acima.',
    '- Em autenticação, dados, Drive, Firebase, Cloudflare ou deploy, mantenha comportamento fail-closed.',
    '',
    'TAREFA:',
    task
  ].join('\n');
}

export function isDeveloperJevApi(pathname) {
  return String(pathname || '') === ROUTE;
}

export async function evaluateDeveloperTask(env, task) {
  if (!env.AI || typeof env.AI.run !== 'function') {
    const error = new Error('Workers AI não está disponível neste ambiente.');
    error.status = 503;
    error.code = 'JEV_AI_BINDING_UNAVAILABLE';
    throw error;
  }

  const model = String(env.DEVELOPER_JEV_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL;
  const response = await env.AI.run(model, {
    state: {
      task,
      project: {
        name: 'Portal da Regulação de Saúde de Eldorado/MS',
        stack: ['Cloudflare Workers', 'Workers AI', 'GitHub', 'web frontend', 'D1', 'Firebase', 'Google Drive'],
        routingGoal: 'Usar o menor nível de modelo que execute a tarefa com segurança, reservando GPT-6 Astra para trabalho realmente complexo ou de alto risco.',
        constraints: [
          'Não reduzir segurança, autorização ou integridade de dados para economizar tokens.',
          'Mudanças localizadas de interface, texto ou estilo tendem a aceitar modelo econômico.',
          'Mudanças multi-arquivo, debugging e lógica de negócio moderada tendem a usar GPT-5.6 Sol.',
          'Arquitetura profunda, autenticação, migrações, integridade de dados, incidentes, deploy crítico ou coordenação complexa entre sistemas tendem a usar GPT-6 Astra.',
          'Testes devem ser proporcionais ao risco, evitando suites excessivas para mudanças localizadas.'
        ]
      }
    },
    questions: {
      complexity: {
        type: 'choice',
        instructions: 'Classifique a complexidade técnica real da tarefa.',
        criteria: {
          low: 'Mudança pequena, localizada e previsível.',
          medium: 'Mudança comum de desenvolvimento, possivelmente multi-arquivo, mas bem delimitada.',
          high: 'Mudança complexa, com arquitetura, debugging difícil ou vários subsistemas.',
          critical: 'Mudança excepcionalmente complexa ou crítica, com alto custo de erro.'
        }
      },
      risk: {
        type: 'choice',
        instructions: 'Classifique o risco de regressão ou dano operacional.',
        criteria: {
          low: 'Sem autenticação, dados persistentes, infraestrutura crítica ou risco de perda.',
          medium: 'Pode afetar lógica de negócio ou mais de um módulo, mas possui rollback simples.',
          high: 'Afeta autenticação, dados, Drive, Firebase, Cloudflare, deploy ou integração crítica.',
          critical: 'Pode causar perda/corrupção de dados, indisponibilidade ampla ou falha grave de segurança.'
        }
      },
      scope: {
        type: 'choice',
        instructions: 'Qual é o escopo técnico predominante?',
        criteria: {
          frontend: 'Interface, interação, layout ou comportamento no navegador.',
          backend: 'API, Worker, persistência ou regra de negócio no servidor.',
          fullstack: 'Mudança coordenada de frontend e backend.',
          infrastructure: 'Deploy, Cloudflare, CI/CD, observabilidade ou infraestrutura.'
        }
      },
      model_tier: {
        type: 'choice',
        instructions: 'Escolha o menor nível de modelo adequado para executar a tarefa com segurança.',
        criteria: {
          economical: 'Tarefa simples e localizada; um modelo Codex econômico deve ser suficiente.',
          sol: 'Tarefa de desenvolvimento normal ou complexa moderada; GPT-5.6 Sol é adequado.',
          astra: 'A tarefa justifica GPT-6 Astra por complexidade, risco, arquitetura profunda ou investigação difícil.'
        }
      },
      reasoning_effort: {
        type: 'choice',
        instructions: 'Escolha o esforço de raciocínio proporcional.',
        criteria: {
          low: 'Pouco raciocínio; alteração direta.',
          medium: 'Raciocínio moderado e validação normal.',
          high: 'Análise profunda necessária.',
          xhigh: 'Investigação excepcionalmente difícil ou crítica.'
        }
      },
      test_scope: {
        type: 'choice',
        instructions: 'Escolha o menor escopo de testes seguro.',
        criteria: {
          focal: 'Teste apenas o comportamento alterado e verificações sintáticas relevantes.',
          standard: 'Testes do módulo e regressões próximas.',
          integration: 'Testes integrados, segurança, persistência ou deploy são necessários.'
        }
      },
      escalate_to_astra: {
        type: 'noul',
        instructions: 'A tarefa realmente precisa de GPT-6 Astra em vez de um modelo mais econômico?',
        criteria: {
          true: 'A complexidade ou o risco justificam o modelo mais avançado.',
          false: 'Sol ou um modelo econômico são suficientes com segurança.'
        }
      }
    }
  });

  const answers = response?.answers || {};
  const complexity = safeChoice(answers.complexity, ['low', 'medium', 'high', 'critical'], 'medium');
  const risk = safeChoice(answers.risk, ['low', 'medium', 'high', 'critical'], 'medium');
  const scope = safeChoice(answers.scope, ['frontend', 'backend', 'fullstack', 'infrastructure'], 'fullstack');
  const reasoningEffort = safeChoice(answers.reasoning_effort, ['low', 'medium', 'high', 'xhigh'], 'medium');
  const testScope = safeChoice(answers.test_scope, ['focal', 'standard', 'integration'], 'standard');
  const astra = astraProbability(answers.escalate_to_astra);

  let modelTier = safeChoice(answers.model_tier, ['economical', 'sol', 'astra'], 'sol');
  if (complexity === 'critical' || risk === 'critical' || astra >= 0.72) modelTier = 'astra';
  else if ((complexity === 'high' || risk === 'high') && modelTier === 'economical') modelTier = 'sol';

  const confidences = [
    answers.complexity,
    answers.risk,
    answers.scope,
    answers.model_tier,
    answers.reasoning_effort,
    answers.test_scope
  ].map(answerConfidence).filter((value) => value !== null);

  const routing = {
    complexity,
    risk,
    scope,
    modelTier,
    modelLabel: modelLabel(modelTier),
    reasoningEffort,
    testScope,
    testLabel: testLabel(testScope),
    astraProbability: astra,
    confidence: confidences.length ? Math.min(...confidences) : null
  };

  return {
    model: response?.model || model,
    routing,
    preparedPrompt: buildPreparedPrompt(task, routing),
    usage: {
      inputTokens: Number(response?.usage?.input_tokens || 0),
      outputTokens: Number(response?.usage?.output_tokens || 0)
    }
  };
}

export async function handleDeveloperJevRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405, origin);

  const user = await validatePortalSession(request, env, []);
  if (!user || user.role !== 'admin') return json({ error: 'Acesso de Desenvolvedor necessário.' }, 403, origin);
  if (!enabled(env.DEVELOPER_JEV_ENABLED)) return json({ error: 'Roteador Jev está desativado.' }, 503, origin);

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json({ error: 'Corpo JSON inválido.' }, 400, origin);
  }

  const task = String(body?.task || '').trim();
  if (!task) return json({ error: 'Informe a tarefa que será enviada ao Jev.' }, 400, origin);
  if (task.length > MAX_TASK_CHARS) {
    return json({ error: `A tarefa excede o limite de ${MAX_TASK_CHARS.toLocaleString('pt-BR')} caracteres. Resuma o pedido antes de rotear.` }, 413, origin);
  }

  const startedAt = Date.now();
  try {
    const result = await evaluateDeveloperTask(env, task);
    console.warn(JSON.stringify({
      event: 'developer_jev_evaluated',
      elapsedMs: Date.now() - startedAt,
      modelTier: result.routing.modelTier,
      risk: result.routing.risk,
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens
    }));
    return json({ ...result, generatedAt: new Date().toISOString() }, 200, origin);
  } catch (error) {
    console.error(JSON.stringify({
      event: 'developer_jev_failed',
      elapsedMs: Date.now() - startedAt,
      code: error?.code || 'JEV_EVALUATION_FAILED'
    }));
    return json({
      error: 'Jev não conseguiu avaliar esta tarefa agora.',
      code: error?.code || 'JEV_EVALUATION_FAILED'
    }, Number(error?.status || 503), origin);
  }
}
