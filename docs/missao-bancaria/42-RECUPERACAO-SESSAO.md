# MISSÃO BANCÁRIA — RECUPERAÇÃO CONTROLADA DA SESSÃO ATIVA

Data: 28/09/2026.  
Fase ativa: Fase 1.  
Branch: `feat/missao-bancaria-recuperacao-sessao`, empilhada sobre a evidência de retenção.

## Problema

O salvamento parcial preserva o tempo confirmado quando a aba ou o aplicativo é fechado, mas a versão anterior não sabia reabrir a mesma rodada. Ao voltar para `/estudos/`, o usuário podia iniciar uma nova sessão enquanto a antiga permanecia ativa no banco.

Isso tinha três efeitos ruins:
- o último checkpoint ficava salvo, mas sem caminho explícito de retomada;
- uma nova rodada podia ser criada desnecessariamente;
- questões já respondidas na rodada interrompida não eram reconstruídas na interface.

## Recorte desta entrega

Esta entrega recupera a **rodada ativa mais recente** sem criar outra sessão.

O bootstrap passa a informar uma sessão recuperável quando existe uma combinação ainda ativa em `study_sessions` + `study_rounds`.

São restaurados:
- identificador da mesma sessão;
- missão e modo da rodada;
- revisão correspondente, quando aplicável;
- último tempo confirmado;
- alternativas já registradas naquela rodada;
- resultado e explicação das questões que já haviam sido respondidas.

Nenhuma resposta ainda não enviada é inventada ou recuperada do navegador.

## Regra de abertura

Enquanto houver uma rodada ativa recuperável:
- a interface oferece **Retomar sessão**;
- o botão principal aponta para a retomada;
- as demais missões ficam indisponíveis para abertura;
- a API também recusa uma nova sessão com HTTP 409 / `STUDY_ACTIVE_SESSION_EXISTS`.

O bloqueio não depende apenas do frontend.

O usuário também pode escolher **Encerrar sessão**. Nesse caso, o fechamento usa a duração já confirmada e preserva respostas, tentativas e tempo; não concede XP nem conclui a missão.

## Compatibilidade com atualização de conteúdo

Uma sessão só é marcada como recuperável se:
- a missão ainda existir;
- a `contentVersion` da rodada coincidir com a missão atual;
- a rodada ainda estiver em estado `active`;
- em revisão, o `review_id` ainda estiver pendente e corresponder ao tópico.

Se a sessão ainda estiver aberta mas a rodada já tiver resultado (`passed` ou `failed`), ela continua bloqueando uma nova abertura, porém não é retomada como se ainda aceitasse respostas. O painel oferece encerramento explícito para liberar a próxima rodada. Isso cobre recarga/fechamento no pequeno intervalo entre o resultado da missão e o PATCH normal de encerramento.

Quando isso não for verdade, o painel explica que a sessão precisa ser encerrada. O sistema não tenta encaixar respostas antigas em conteúdo diferente.

## Tempo

`StudyClock.start` aceita um valor inicial correspondente ao último checkpoint confirmado.

Exemplo:
- 42 segundos confirmados antes do fechamento;
- página reaberta;
- cronômetro volta em 00:42;
- os próximos segundos são acumulados sobre esse total;
- sair normalmente fecha a mesma sessão com o total cumulativo.

O valor confirmado inicial também é tratado como já salvo, evitando reenviar 42 segundos como se fossem tempo novo.

## Respostas

As respostas recuperadas vêm de `study_round_answers` vinculadas à sessão e às tentativas persistidas.

A interface:
- restaura a alternativa selecionada;
- mantém a questão como respondida;
- mostra o mesmo feedback que já havia sido liberado após a resposta original;
- não cria nova tentativa apenas por recarregar a página.

Questões não respondidas continuam livres para tentativa.

## Segurança e preservação

- acesso continua exclusivo a `wellyton`;
- não cria novo cargo, binding ou segredo;
- não armazena dados institucionais;
- não muda gabaritos, XP, conquistas ou cobertura;
- não transforma sessão retomada em conclusão;
- não apaga tentativas antigas;
- não altera as regras de revisão ou Chefe;
- uma sessão de conteúdo incompatível não é retomada silenciosamente.

## Testes

O roteador real com SQLite cobre:
1. criação de sessão;
2. uma resposta registrada;
3. checkpoint de tempo;
4. bootstrap devolvendo a mesma sessão e a resposta;
5. bloqueio de abertura paralela;
6. fechamento da sessão;
7. desaparecimento do marcador ativo;
8. nova sessão permitida somente depois do fechamento.

O navegador sintético cobre:
- painel de sessão interrompida;
- retomada sem novo POST de criação de sessão;
- restauração da alternativa/feedback;
- cronômetro reiniciando do checkpoint;
- continuidade do tempo;
- fechamento da mesma sessão com o total acumulado.

## Limites

Esta entrega recupera **rodada, respostas e tempo**. Ela ainda não persiste a parte exata da aula em que o leitor estava aberto. O marcador de seção/leitura permanece como recorte posterior e deve ser implementado sem considerar mudança de parte como prova de aprendizagem.

Também não cria exclusão distribuída entre múltiplos dispositivos. Duas chamadas de abertura exatamente concorrentes ainda dependem das garantias atuais do banco e serão tratadas em recorte próprio se o uso real mostrar necessidade.

## Continuidade

Depois desta entrega:
1. integrar somente após a cadeia #510–#512 estar estável;
2. marcador de leitura/parte atual: implementado no documento 43, sem conceder progresso;
3. remover o truncamento histórico dos 500 eventos usado na sequência;
4. manter avaliação independente como recorte separado.

A Fase 1 continua aberta até validação humana e aceite formal.
