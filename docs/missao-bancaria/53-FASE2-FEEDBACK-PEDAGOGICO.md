# MISSÃO BANCÁRIA — FASE 2 — RECORTE B
## Feedback pedagógico pós-resposta

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Estado: piloto em implementação/validação; não encerra a fase.

## Objetivo

Cumprir progressivamente o requisito de Feedback da Fase 2:

- mostrar a resposta correta;
- explicar por que ela é correta;
- explicar por que a escolha do estudante falhou;
- apontar o conceito/trecho que deve ser relido.

O feedback só pode aparecer **depois** da tentativa. O bootstrap continua sem gabarito, explicação, motivos de distratores ou referências de correção.

## Piloto

O contrato V1 cobre inicialmente as nove questões das três primeiras missões:
- Introdução ao SFN;
- CMN;
- Banco Central.

Cada uma das quatro alternativas recebe uma justificativa editorial específica no backend, em `question-feedback-v1.js`.

A explicação da alternativa correta continua vindo do item original. O novo catálogo complementa apenas o motivo da escolha selecionada.

## Releitura orientada

O backend já possui `mission.teaching.questionCoverage`, que liga cada questão ao ensino anterior.

Depois da tentativa, a resposta da API pode incluir:
- `selectedFeedback`;
- `reviewRefs`.

O frontend usa somente referências da missão atualmente aberta para criar botões **Rever conceito**. O botão volta ao trecho correspondente pelo leitor existente; não cria sessão nova nem altera XP.

## Compatibilidade

Questões ainda não enriquecidas:
- continuam funcionando com a explicação antiga;
- recebem referências de revisão quando o mapeamento de ensino existir;
- não são bloqueadas por ausência de `selectedFeedback`.

Worker antigo ou resposta antiga sem os campos novos continua utilizável pelo frontend.

## Segurança pedagógica

`publicMission()` permanece sem:
- `answer`;
- `correctOption`;
- `explanation`;
- `selectedFeedback`;
- `optionReasons`;
- `reviewRefs`.

O catálogo de motivos não é serializado no bootstrap.

## Testes

O recorte deve provar:
1. nove questões do piloto com quatro justificativas não vazias;
2. nenhum campo de correção novo no bootstrap;
3. roteador real continua compatível com questões sem feedback enriquecido;
4. navegador mostra motivo da escolha incorreta, alternativa correta, explicação e botão de releitura;
5. clicar em releitura abre o trecho da aula sem iniciar nova rodada;
6. suítes existentes continuam verdes.

## Próxima expansão

Depois do piloto validado:
- ampliar o mesmo contrato para Copom, CVM, Operadores, Seguros/Previdência, Pagamentos/Consórcios e Chefe;
- não criar um segundo renderer;
- não aumentar XP nem alterar cobertura por causa do feedback.

A Fase 2 só poderá ser encerrada após o motor reutilizável cumprir integralmente seus critérios, inclusive publicação incremental e preservação de histórico.
