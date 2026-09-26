# MISSÃO BANCÁRIA — FASE 1 — RETOMADA PARCIAL DE MISSÃO

Data: 26/09/2026  
Estado: **IMPLEMENTADA EM BRANCH EMPILHADA; HOMOLOGAÇÃO PENDENTE**

Branch:
`feat/missao-bancaria-fase1-retomar-missao`

Base:
`feat/missao-bancaria-fase1-fechar-mundo1-sfn`

## Objetivo

Cumprir de forma prática o requisito da Fase 1 de poder:
- iniciar uma missão;
- sair;
- voltar;
- encontrar o progresso preservado.

Antes desta entrega, as tentativas já eram persistidas no D1, mas a interface não reconhecia visualmente as questões já respondidas quando a missão era reaberta.

## Comportamento

Para **aulas normais**:
1. o bootstrap retorna somente os IDs das questões que já tiveram tentativa;
2. o navegador reconhece essas questões ao reabrir a missão;
3. elas contam para a barra de progresso da missão;
4. aparece a mensagem:
   **Respondida em sessão anterior. Você pode continuar ou responder novamente para revisar.**
5. o usuário pode seguir adiante sem refazer o que já respondeu;
6. se quiser, pode clicar em **Responder novamente**.

## Proteção pedagógica

Tentativas históricas **não** são reaproveitadas em:
- revisões espaçadas;
- Chefe do SFN.

Essas experiências sempre começam com a rodada vazia.

Motivo:
- revisão precisa medir nova recuperação da memória;
- Chefe precisa medir a rodada corrente;
- respostas antigas não podem virar aprovação automática.

## Gabarito

O bootstrap de retomada retorna somente:
- `topicId`;
- `questionId`.

Não retorna:
- alternativa correta;
- `correctOption`;
- explicação;
- indicador de acerto/erro.

O gabarito continua protegido no backend e só é devolvido após uma tentativa real.

## Persistência

Fonte:
`study_attempts`

O backend agrupa por:
- `topic_id`;
- `question_id`.

A UI filtra os IDs contra as questões que ainda pertencem à missão vigente.

## Cache

Assets da rota `/estudos/` recebem nova versão para evitar que dispositivos mantenham o cliente anterior em cache.

## Critério de homologação

A retomada será considerada homologada quando Wellyton:
1. abrir uma missão;
2. responder apenas parte das questões;
3. sair;
4. recarregar ou voltar mais tarde;
5. confirmar que as questões respondidas aparecem reconhecidas;
6. continuar da parte faltante;
7. concluir a missão normalmente;
8. confirmar que revisão e Chefe continuam começando do zero.

A Fase 1 permanece aberta.
