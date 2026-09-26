# MISSÃO BANCÁRIA — FASE 1 — SEQUÊNCIA DE ESTUDO V1

Data: 26/09/2026  
Estado: **IMPLEMENTADA EM BRANCH; HOMOLOGAÇÃO PENDENTE**

## Objetivo

Completar o indicador mínimo de **sequência de estudo** previsto para o dashboard da Fase 1 sem criar recompensa artificial por simples abertura do módulo.

## O que conta como dia de estudo

Um dia entra na sequência quando existe pelo menos uma atividade pedagógica persistida:

- questão respondida em `study_attempts`;
- sessão encerrada com pelo menos 60 segundos em `study_sessions`;
- evento pedagógico persistido em `study_xp_events`, como conclusão de missão ou revisão.

Abrir `/estudos/` e sair sem atividade não conta.

## Regra da sequência atual

- datas são agrupadas no fuso local do Portal: `America/Campo_Grande`;
- várias atividades no mesmo dia contam como um único dia;
- se o último estudo foi hoje, a sequência permanece ativa;
- se o último estudo foi ontem, a sequência também permanece ativa durante o dia atual;
- se houver uma lacuna de dois dias ou mais até a data atual, a sequência atual é zero;
- o dashboard também mostra a melhor sequência histórica.

## Gamificação responsável

A sequência:
- não concede XP;
- não desbloqueia conteúdo;
- não pune ausência;
- não reduz domínio;
- não apaga conquistas;
- não exige estudo diário.

Ela é somente um indicador de constância.

## Interface

O dashboard recebe um quinto cartão:

**Sequência**

Exemplo:
- `3 dias`
- `Melhor: 7 dias`

## Implementação

Backend:
- função pura `computeStudyStreak`;
- consulta somente às tabelas `study_*`;
- até 500 timestamps recentes de atividade;
- sem telemetria externa.

Frontend:
- `metricStreak`;
- `metricBestStreak`;
- versão de assets atualizada para evitar cache antigo.

## Testes

Cobertura:
- dias duplicados contam uma vez;
- sequência de hoje/ontem;
- lacuna quebra sequência atual;
- melhor sequência permanece calculável;
- lista vazia resulta em zero;
- atividade vem de tentativas, sessões reais ou eventos pedagógicos.

## Estado da Fase 1

Com esta entrega, os itens técnicos do dashboard mínimo da Fase 1 ficam implementados.

A Fase 1 ainda **não deve ser encerrada** sem homologação humana dos fluxos reais já documentados.
