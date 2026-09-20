import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DOCUMENT_AI_ROUTINES,
  PROMPT_CLASSIFICACAO_PAGINAS_V1,
  PROMPT_EXTRACAO_REGULACAO_V1,
  PROMPT_ANALISE_REGULACAO_V1,
  PROMPT_ANALISE_REGULACAO_COMPACTA_V1,
  PROMPT_DOCUMENT_CHAT_V1,
  PROMPT_VALIDACAO_V1
} from '../document-ai-prompts.js';

test('prompts da Fase 5 são artefatos separados e versionados', () => {
  assert.equal(DOCUMENT_AI_ROUTINES.length, 6);
  const ids = new Set(DOCUMENT_AI_ROUTINES.map((routine) => routine.id));
  assert.equal(ids.size, 6);
  assert.equal([...ids].every((id) => /_V1$/.test(id)), true);
  assert.equal(PROMPT_CLASSIFICACAO_PAGINAS_V1.version, 'v2');
  assert.equal(PROMPT_EXTRACAO_REGULACAO_V1.version, 'v2');
  assert.equal(PROMPT_ANALISE_REGULACAO_V1.version, 'v2');
  assert.equal(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.version, 'v1');
  assert.equal(PROMPT_DOCUMENT_CHAT_V1.version, 'v1');
  assert.equal(PROMPT_VALIDACAO_V1.version, 'v1');
});

test('classificação e extração impõem isolamento de uma página e títulos autorizados', () => {
  assert.match(PROMPT_CLASSIFICACAO_PAGINAS_V1.system, /exatamente UMA página/i);
  assert.match(PROMPT_CLASSIFICACAO_PAGINAS_V1.system, /DADO NÃO CONFIÁVEL/i);
  for (const title of [
    'COMPROVANTE DE ATENDIMENTO',
    'CONTROLE DE ATENDIMENTO',
    'DADOS',
    'GUIA DE ENCAMINHAMENTO',
    'RECEITA SIMPLES',
    'LAUDO MÉDICO',
    'RECEITUÁRIO MÉDICO',
    'SOLICITAÇÃO DE EXAMES',
    'SOLICITAÇÃO DE AGENDAMENTO',
    'SOLICITAÇÃO DE AGENDAMENTO RETORNO'
  ]) {
    assert.match(PROMPT_CLASSIFICACAO_PAGINAS_V1.system, new RegExp(title));
  }

  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /exatamente UMA página/i);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /Nunca complete um campo com informação de outra página/i);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /nao_consta/);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /ilegivel/);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /EXATA E INTEGRALMENTE/);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /CNS será normalizado/);
  assert.match(PROMPT_EXTRACAO_REGULACAO_V1.system, /dd\/mm\/aaaa/);
});

test('análise integrada combina tipo e campos sem pedir pageNumber ao modelo', () => {
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /exatamente UMA página/i);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /pageType/);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /fields/);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /Não inclua pageNumber/);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /CONTROLE DE ATENDIMENTO/);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /RECEITA SIMPLES/);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /NÃO CONFIÁVEL/i);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /rótulo.*visível.*ilegivel/is);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /caractere por caractere/i);
  assert.match(PROMPT_ANALISE_REGULACAO_V1.system, /NÃO DEVE SER INFERIDA/);
});

test('V8C mantém as regras da análise integrada e troca apenas o transporte interno por JSON compacto', () => {
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /exatamente UMA página/i);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /DADO NÃO CONFIÁVEL/i);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /FORMATO INTERNO COMPACTO/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /t=c/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /t=m/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /t=o/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /s=e/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /s=n/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /s=i/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /nome_paciente, cpf, cns/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /titulo, motivo_encaminhamento, medico/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /não inferência/i);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /NÃO DEVE SER INFERIDA/);
  assert.match(PROMPT_ANALISE_REGULACAO_COMPACTA_V1.system, /Não use as chaves pageType, fields, state, value ou pageNumber/);
});

test('chat exige origem por página e validação não inventa correções', () => {
  assert.match(PROMPT_DOCUMENT_CHAT_V1.system, /\[p\. N\]/);
  assert.match(PROMPT_DOCUMENT_CHAT_V1.system, /NÃO CONSTA/);
  assert.match(PROMPT_DOCUMENT_CHAT_V1.system, /ILEGÍVEL/);
  assert.match(PROMPT_VALIDACAO_V1.system, /Não corrija, complete, reescreva ou infira/);
});
