import test from 'node:test';
import assert from 'node:assert/strict';

import { evaluateDeveloperTask, isDeveloperJevApi } from '../developer-jev.js';

function response(overrides = {}) {
  return {
    model: 'jev-1.13.0',
    answers: {
      complexity: { type: 'choice', choice: 'low', confidence: 0.94 },
      risk: { type: 'choice', choice: 'low', confidence: 0.93 },
      scope: { type: 'choice', choice: 'frontend', confidence: 0.91 },
      model_tier: { type: 'choice', choice: 'economical', confidence: 0.89 },
      reasoning_effort: { type: 'choice', choice: 'low', confidence: 0.92 },
      test_scope: { type: 'choice', choice: 'focal', confidence: 0.9 },
      escalate_to_astra: { type: 'noul', noul: 0.08 },
      ...overrides
    },
    usage: { input_tokens: 420, output_tokens: 60 }
  };
}

test('Jev roteia tarefa simples sem enviar segredos do ambiente', async () => {
  let captured = null;
  const env = {
    AUTH_SESSION_SECRET: 'nao-pode-sair',
    AI: {
      async run(model, input) {
        captured = { model, input };
        return response();
      }
    }
  };

  const result = await evaluateDeveloperTask(env, 'Trocar a cor de um botão.');
  assert.equal(captured.model, 'typesafe/jev');
  assert.equal(captured.input.state.task, 'Trocar a cor de um botão.');
  assert.equal(JSON.stringify(captured.input).includes('nao-pode-sair'), false);
  assert.equal(result.routing.modelTier, 'economical');
  assert.equal(result.routing.testScope, 'focal');
  assert.match(result.preparedPrompt, /Trocar a cor de um botão/);
  assert.equal(result.usage.inputTokens, 420);
  assert.equal(isDeveloperJevApi('/api/admin/jev/evaluate'), true);
});

test('Jev força Astra quando a avaliação pede escalonamento forte', async () => {
  const env = {
    AI: {
      async run() {
        return response({
          complexity: { type: 'choice', choice: 'high', confidence: 0.87 },
          risk: { type: 'choice', choice: 'high', confidence: 0.9 },
          model_tier: { type: 'choice', choice: 'sol', confidence: 0.78 },
          reasoning_effort: { type: 'choice', choice: 'high', confidence: 0.85 },
          test_scope: { type: 'choice', choice: 'integration', confidence: 0.88 },
          escalate_to_astra: { type: 'noul', noul: 0.91 }
        });
      }
    }
  };

  const result = await evaluateDeveloperTask(env, 'Alterar autenticação e migração de dados.');
  assert.equal(result.routing.modelTier, 'astra');
  assert.equal(result.routing.modelLabel, 'GPT-6 Astra');
  assert.equal(result.routing.testScope, 'integration');
  assert.equal(result.routing.astraProbability, 0.91);
});
