# MISSÃO BANCÁRIA — PRÉ-REQUISITOS DE PROGRESSÃO NO BACKEND

Data: 27/09/2026.  
Fase ativa: Fase 1.  
Branch inicial: `fix/missao-bancaria-prerequisitos-backend`, empilhada sobre o mapa curricular.

## Problema

A interface já bloqueava uma missão até que a anterior fosse concluída, mas `POST /api/studies/sessions` aceitava diretamente qualquer `missionId` publicado. Assim, um cliente modificado ou uma chamada direta à API poderia iniciar uma etapa futura sem cumprir a sequência pedagógica.

Esse comportamento era incompatível com a ideia de pré-requisito real. Um bloqueio visual não deve ser tratado como regra de progressão.

## Regra implementada

Antes de criar uma sessão/rodada normal:

1. a primeira missão publicada pode iniciar;
2. uma missão já concluída pelo mesmo usuário pode ser reaberta para consulta/prática;
3. uma missão ainda não concluída exige `coverage_state >= 3` da missão publicada imediatamente anterior;
4. se o pré-requisito faltar, a API responde HTTP 409 com código `STUDY_PREREQUISITE_REQUIRED`;
5. nenhuma sessão/rodada é criada nesse caso;
6. o mesmo pré-requisito é revalidado no fechamento da missão, impedindo que uma sessão antiga criada antes deste gate conclua uma etapa que continua bloqueada.

A mensagem informa qual missão anterior deve ser concluída.

## Revisões

Uma revisão já possui autorização própria por `review_id`, tópico, estado `pending` e vencimento. Ela é criada somente após conclusão da missão correspondente.

Por isso, uma abertura com `reviewId` não reaplica a sequência linear das missões; continua sujeita às validações específicas de revisão já implementadas em `startStudyRound`.

## Preservação

- Não altera ordem, títulos ou conteúdo das missões.
- Não muda perguntas, respostas, XP, conquistas ou revisões existentes.
- Não cria tabela, coluna ou migração.
- Não apaga progresso.
- Não impede reabrir conteúdo já concluído.
- Não confia em uma sessão antiga como prova de que o pré-requisito continua satisfeito.
- Não altera acesso exclusivo de `wellyton`.
- Não antecipa novos mundos.

A sequência continua sendo a ordem do catálogo publicado no primeiro bloco. Quando novos blocos/mundos forem introduzidos, seus pré-requisitos deverão ser modelados explicitamente; não assumir que uma única fila linear será adequada ao curso inteiro.

## Teste comportamental

O roteador real é executado em fixture com duas missões:

- primeira missão: disponível;
- Chefe: segunda missão.

O teste prova:

1. abrir o Chefe antes do pré-requisito retorna 409 e `STUDY_PREREQUISITE_REQUIRED`;
2. nenhuma sessão é criada pelo pedido bloqueado;
3. a primeira missão é iniciada, respondida e concluída;
4. depois disso, o backend aceita iniciar o Chefe;
5. uma sessão sintética de Chefe criada como legado antes do gate continua bloqueada no fechamento e não altera cobertura.

O teste existente do Chefe foi ajustado para cumprir o pré-requisito antes de testar reprovação/aprovação. Isso evita que a própria suíte contorne a nova regra.

## Limite

Esta entrega protege a sequência das missões publicadas, mas **não define ainda toda a árvore de pré-requisitos dos 43 blocos curriculares**. O mapa curricular é mais amplo que a fila atual de nove missões.

Ao construir Português, Matemática, Informática, Vendas e demais áreas, os pré-requisitos deverão ser expressos por bloco/competência quando necessário, permitindo trilhas paralelas sem forçar terminar uma disciplina inteira antes de iniciar outra.

## Continuidade

Depois de validar e integrar:
- preservar esta regra no backend;
- desenvolver pré-requisitos curriculares explícitos junto com os novos blocos;
- não usar apenas CSS/HTML como mecanismo de desbloqueio;
- não confundir “desbloqueado” com “dominado”.

A Fase 1 permanece aberta para avaliação humana; desbloqueio técnico não comprova aprendizagem.
