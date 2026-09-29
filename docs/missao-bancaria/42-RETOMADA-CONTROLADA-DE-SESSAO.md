# MISSÃO BANCÁRIA — RETOMADA CONTROLADA DE SESSÃO

Data: 28/09/2026.  
Fase ativa: Fase 1.  
Branch: `feat/missao-bancaria-retomada-sessao`, empilhada sobre a evidência de retenção.

## Problema

Se o navegador recarregasse, fechasse abruptamente ou a pessoa voltasse à rota depois de uma interrupção, o backend podia continuar com uma sessão/rodada ativa, mas o frontend não possuía marcador para retomá-la. Abrir a missão novamente criava outra rodada, fragmentando tempo e respostas.

## Regra implementada

O bootstrap passa a anunciar `resumeProtocol: 1` e, quando existir uma rodada elegível, retornar `resumableSession`.

Uma sessão é oferecida para retomada somente quando:
- pertence ao usuário autenticado;
- `study_sessions.status='active'`;
- `study_rounds.status='active'`;
- a missão ainda existe no catálogo;
- a versão do conteúdo é exatamente a mesma da rodada;
- foi iniciada há no máximo 12 horas;
- se for revisão, o `review_id` ainda está pendente e vencido/disponível.

O servidor retorna apenas:
- ID da sessão;
- ID da missão;
- modo;
- `reviewId`, quando houver;
- início;
- segundos já confirmados;
- IDs das questões já registradas naquela rodada.

Não retorna alternativa escolhida, gabarito ou explicação no bootstrap.

## Frontend

Quando há sessão recuperável, o botão principal do dashboard troca de “Continuar” para **“Retomar: <missão>”**.

Enquanto existir uma sessão elegível para retomada, o backend recusa a abertura de uma nova rodada com HTTP 409 e código `STUDY_SESSION_RESUME_REQUIRED`. Isso impede fragmentação por cliente modificado ou outra aba.

Ao retomar:
- nenhuma nova sessão é criada;
- a mesma `sessionId` volta a ser usada;
- respostas daquela rodada são marcadas como já registradas;
- elas não podem ser reenviadas acidentalmente;
- o cronômetro parte dos segundos já confirmados pelo servidor;
- checkpoints seguintes permanecem cumulativos e idempotentes.

Para revisão, a retomada não depende de ela estar entre as dez revisões exibidas no painel; o `reviewId` validado pelo servidor acompanha a própria sessão.

## Limite de segurança temporal

Sessões ativas com mais de 12 horas não são retomadas automaticamente. Elas não são apagadas nem concluídas silenciosamente nesta entrega.

Isso evita ressuscitar uma rodada antiga sem contexto e preserva o histórico para eventual política posterior de limpeza/abandono explícito.

## Preservação

- Não cria tabela nova.
- Não muda XP, conquistas, cobertura ou prontidão.
- Não altera respostas já gravadas.
- Não encerra sessões antigas automaticamente.
- Não transforma sessão ativa em evidência de aprendizado.
- Mantém acesso exclusivo de `wellyton`.
- Não mistura dados institucionais.

## Testes

A suíte do roteador real passa a cobrir:
1. bootstrap devolve a rodada ativa, o tempo confirmado e os IDs já respondidos;
2. uma segunda rodada é recusada enquanto a primeira estiver elegível para retomada;
3. sessão encerrada deixa de aparecer como retomável;
4. sessão ativa com mais de 12 horas não é oferecida automaticamente e continua preservada no banco.

O teste do cronômetro também prova que uma sessão retomada parte do tempo previamente confirmado sem duplicá-lo no checkpoint seguinte.

## Continuidade

Esta entrega resolve o marcador/retomada controlada citado no documento 37 e no STATUS. Ainda permanecem separados:
- política explícita para sessões antigas abandonadas;
- sequência histórica sem truncamento de 500 eventos;
- avaliação independente;
- homologação humana da Fase 1.
