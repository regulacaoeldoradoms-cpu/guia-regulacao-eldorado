import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DOCUMENT_AI_ROUTINES,
  PROMPT_CLASSIFICACAO_PAGINAS_V1,
  PROMPT_EXTRACAO_REGULACAO_V1,
  PROMPT_DOCUMENT_CHAT_V1,
  PROMPT_VALIDACAO_V1
} from '../document-ai-prompts.js';

test('prompts da Fase 5 são artefatos separados e versionados', () => {
  assert.equal(DOCUMENT_AI_ROUTINES.length, 4);
  const ids = new Set(DOCUMENT_AI_ROUTINES.map((routine) => routine.id));
  assert.equal(ids.size, 4);
  assert.equal([...ids].every((id) => /_V1$/.test(id)), true);
  assert.equal(DOCUMENT_AI_ROUTINES.every((routine) => routine.version === 'v1'), true);
});

test('classificação e extração impõem isolamento de uma página', () => {
  assert.match(PROMPT_CLASSIFICACAO_PAGINAS_V1.system, /exatamente UMA página/i);
  assert.match(PROMPT_CLASSIFICACAO_PAGINAS_V1.system, /DADO NÃO CONFIÁVEL/i);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /exatamente UMA página/i);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /Nunca complete um campo com informação de outra página/i);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /nao_consta/);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /ilegivel/);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /valor literal/i);
});

test('chat exige origem por página e validação não inventa correções', () => {
  assert.match(PROMPT_DOCUMENT_CHAT_V1.system, /\[p\. N\]/);
  assert.match(PROMPT_DOCUMENT_CHAT_V1.system, /NÃO CONSTA/);
  assert.match(PROMPT_DOCUMENT_CHAT_V1.system, /ILEGÍVEL/);
  assert.match(PROMPT_VALIDACAO_V1.system, /Não corrija, complete, reescreva ou infira/);
});
