# MISSÃO BANCÁRIA — FASE 1 — REVISÃO ESPAÇADA V1

Data: 26/09/2026  
Estado: **IMPLEMENTADA EM BRANCH; HOMOLOGAÇÃO PENDENTE**

Branch:
`feat/missao-bancaria-fase1-expansao-sfn-v2`

## Objetivo

Transformar as revisões de 1, 7 e 30 dias em uma experiência realmente utilizável, em vez de manter apenas um contador no dashboard.

## Fluxo

Ao concluir uma missão:
1. o backend agenda revisões em +1 dia, +7 dias e +30 dias;
2. quando uma revisão vence, ela aparece no dashboard;
3. Wellyton abre a revisão pelo botão **Revisar agora**;
4. a missão reaparece em modo foco;
5. as questões precisam ser respondidas novamente;
6. o backend só aceita a revisão se houver nova prática após `due_at`;
7. a revisão é marcada como concluída;
8. o evento de XP `review_complete` concede 20 XP uma única vez;
9. a próxima revisão futura permanece agendada.

## Persistência e segurança

- revisão pertence ao mesmo `username`;
- revisão só pode ser concluída se estiver vencida;
- revisão concluída não pode ser concluída novamente;
- XP usa `study_xp_events` com chave única por evento/referência;
- tentativas antigas não bastam: a conclusão exige respostas feitas após o vencimento;
- nenhum dado institucional entra no fluxo.

## Interface

O dashboard passa a exibir, quando necessário:
- título da revisão;
- ciclo;
- momento em que venceu;
- botão **Revisar agora**.

O modo foco é reutilizado:
- título muda para **Revisão · <missão>**;
- botão final muda para **Concluir revisão**;
- leitura, recordação ativa, questões e fontes permanecem disponíveis.

## Testes

Cobertura adicionada:
- `topicId` resolve a missão correta;
- rota de revisão existe;
- prática nova após `due_at` é exigida;
- XP de revisão é idempotente;
- revisão concluída é bloqueada em tentativa repetida.

## Critério de homologação

A revisão V1 será considerada homologada quando uma revisão real vencer e Wellyton:
1. visualizar o aviso no dashboard;
2. abrir a revisão;
3. responder novamente;
4. concluir;
5. receber XP uma única vez;
6. recarregar a página e confirmar que a revisão não reaparece como pendente.
