# MISSÃO BANCÁRIA — RODADAS EXPLÍCITAS E CONFIABILIDADE DE SESSÕES

Data: 26/09/2026. Fase ativa: Fase 1.
Base: `f19b1cbb583fee9f38c79cda6538972af825ee72`, merge da PR #507 nesta retomada.
Branch: `fix/missao-bancaria-rodadas-persistentes`.
Estado inicial: código implementado e testes locais executados; CI remoto e publicação não são presumidos.

## 1. Recorte desta entrega

A implementação do primeiro bloco chegou a oito aulas, preparação do Chefe, 27 atividades formativas e 38 questões pontuadas. Antes de ampliar o curso, esta rodada trata a confiabilidade da evidência usada para concluir missões/revisões e da coordenação de requisições no navegador.

O cronômetro tem apenas validação básica de duração e fechamento idempotente nesta entrega. **Pausa por aba oculta, tempo efetivamente ativo, salvamento periódico e retomada após fechar o navegador permanecem pendentes.** Não anunciar que o tempo em segundo plano deixou de ser contado. O trabalho foi subdividido para não misturar uma nova medição de tempo com a correção da pontuação.

## 2. Falhas identificadas no código anterior

- `study_attempts` não tinha vínculo de rodada. O Chefe procurava a sessão ativa mais recente e respostas com horário maior ou igual ao início. Sessões abertas no mesmo segundo ou em abas distintas podiam compartilhar evidência indevidamente.
- A revisão contava questões respondidas depois de `due_at`, sem identificar a sessão ou ciclo que originou a prática. Uma prática podia satisfazer mais de uma revisão vencida.
- Repetir um POST após perda de resposta podia duplicar tentativas e distorcer o percentual de acerto.
- O backend permitia trocar a resposta de uma mesma rodada depois de revelar o comentário, embora a interface já desabilitasse essa troca.
- Respostas de abertura, envio ou conclusão recebidas depois de sair da missão podiam atualizar o estado de uma missão reaberta; um temporizador antigo podia fechá-la.
- Fechamento aceitava duração informada sem confronto com o tempo decorrido no servidor; uma repetição retornava conflito em vez do resultado persistido.
- A revisão era marcada concluída antes de inserir seu XP, sem transação envolvendo as duas gravações.

São constatações do código, não relatos de que esses problemas já ocorreram nos dados pessoais de Wellyton. Não foi feita correção retroativa de notas ou remoção de recompensas.

## 3. Protocolo explícito

Ao abrir uma missão, `POST /api/studies/sessions` cria a sessão e uma rodada vinculada a ela. O cliente envia `missionId` e, somente numa revisão, `reviewId`. O servidor determina o modo: aula, Chefe ou revisão.

A rodada armazena usuário, missão, versão, conjunto de questões e limiar aplicável. Respostas e conclusões enviam explicitamente `sessionId`. Não se escolhe silenciosamente a sessão mais recente nem se infere pertencimento apenas pelo horário.

- Chefe: somente respostas vinculadas àquela rodada. As respostas são exigidas antes de calcular a nota; o limiar de 75% permanece.
- Revisão: somente respostas da rodada ligada àquela revisão. Outro ciclo, outra missão ou outro usuário não pode fornecer sua evidência.
- Aula normal: preserva-se a retomada pelo histórico das questões válidas. Não é necessário refazer uma aula incompleta apenas por fechar a página.
- Resultado final da rodada é persistido e pode ser recuperado depois de uma resposta de rede perdida, sem conceder recompensa duplicada.
- A versão do conteúdo precisa corresponder à rodada. Uma mudança de versão exige reabertura, sem apagar tentativas anteriores.

## 4. Respostas e recompensas

A primeira resposta efetivamente registrada por questão/rodada fica fixa. Reenviar a mesma alternativa recupera o registro, sem inserir outra tentativa. Enviar outra alternativa na mesma rodada é recusado; uma nova tentativa pedagógica requer reabrir a missão.

Isso substitui a política técnica anterior de selecionar a última resposta por horário/rowid. Não troca perguntas, alternativas, gabaritos, XP ou nota mínima; alinha o backend ao bloqueio que a interface já apresentava após corrigir uma resposta. Não há reavaliação retroativa dos registros antigos.

A tentativa e seu vínculo são gravados juntos em `db.batch`. Revisão concluída e evento único de +20 XP também são gravados juntos. Uma falha intermediária provoca rollback dessa transação; a repetição pode reparar uma resposta perdida. Os eventos e conquistas anteriores continuam com suas chaves únicas.

## 5. Alteração de armazenamento — aditiva

São criadas, após o gate de autenticação/autorização, duas tabelas no domínio de estudos:

- `study_rounds`: uma rodada por `session_id`, modo, revisão, versão, questões e resultado.
- `study_round_answers`: vínculo da tentativa com a rodada, único por questão/rodada.

A inicialização usa `CREATE TABLE/INDEX IF NOT EXISTS`. **Não há DROP, exclusão, renomeação de tabelas antigas nem redistribuição de tentativas históricas entre rodadas.** A existência de tabelas novas não deve ser descrita como ausência de alteração de schema. A tabela antiga de tentativas permanece a fonte do histórico de prática.

Rollback: reverter frontend e Worker de forma coordenada, mantendo as tabelas adicionais e todos os dados. A versão anterior ignora essas tabelas; portanto um rollback também retira as novas garantias de isolamento. Não apagar as tabelas para reverter o código.

## 6. Navegador e rede lenta

- A leitura fica disponível enquanto a abertura da rodada é confirmada. Sem uma sessão registrada, não se envia resposta nem conclusão.
- Clique repetido na abertura não inicia duas sessões na mesma instância da página.
- Cada operação captura seu identificador e a geração da missão aberta.
- Se uma abertura chega depois da saída, o cliente tenta encerrar somente aquela sessão antiga, com duração zero, sem substituir a sessão atual.
- Respostas e erros atrasados de outra geração não marcam questões da nova missão.
- Após uma falha de envio, o cliente mantém a alternativa e permite repetir o mesmo pedido; não pressupõe que a primeira tentativa tenha sido perdida no servidor.
- Conclusão atrasada ou seu temporizador não fecham uma missão reaberta.
- Fechamento repete no máximo uma vez o mesmo identificador/duração; falha persistente é informada, não apresentada como tempo salvo.

Rascunhos formativos continuam temporários, sem envio. Nenhuma mudança no leitor, CSS, material de ensino ou nas atividades formativas foi necessária.

## 7. Duração — proteção básica, não medição de atenção

O backend aceita apenas número finito não negativo e limita a duração a seis horas e ao intervalo decorrido desde a abertura no servidor. Fechar a mesma sessão novamente retorna a duração já gravada, sem recalcular ou somar outra vez.

O cliente ainda mede tempo decorrido com o mecanismo atual. Uma aba visível não comprova atenção, e uma aba oculta ainda não é descontada nesta etapa. Também não há fila durável para sincronização depois de perda completa de conexão, nem restauração automática da rodada após recarregar. Sessões abandonadas podem permanecer ativas sem tempo contabilizado. Essas limitações são tarefas próprias, não resultados concluídos por este patch.

## 8. Compatibilidade de publicação

O bootstrap e a resposta de abertura passam a anunciar `roundProtocol: 1`; o cliente envia o ID explícito nos fluxos alterados. Assets de `studies.js` recebem nova versão na URL.

Um cliente antigo sem `sessionId` recebe erro explícito, pedindo atualizar/reabrir a missão, em vez de vincular sua resposta por adivinhação. As respostas históricas não são apagadas por esse bloqueio. Um frontend novo falando com um Worker antigo ainda depende do comportamento antigo: **verificar as duas publicações**, não declarar isolamento produtivo somente pelo deploy do HTML.

A implantação deve seguir o gate existente, preservando bindings, secrets e `AUTH_DB`. Esta rodada não executa manualmente migração produtiva nem usa a sessão pessoal de Wellyton.

## 9. Testes efetivamente executados

### Local: SQL real em banco descartável

**24 testes do serviço** executados com SQLite em memória e transações reais, usando adaptador da interface D1. Incluem duas sessões no mesmo segundo, prática dividida em abas, proprietário/missão incorretos, repetição concorrente, alteração após resposta, falhas injetadas e rollback, revisão de outro ciclo, nota de 75%, duração e preservação do histórico.

**Sete fluxos do roteador real** executados com o texto do módulo sem reescrevê-lo. Autenticação e catálogo são simulados; SQL e lógica das rotas são reais. Verificados gates antes do schema, bootstrap sem gabarito, envio/conclusão, reprovação/aprovação do Chefe, revisão com XP único, cliente antigo e fechamento idempotente. O wrapper do teste verifica o resultado das sete execuções, não apenas que um processo terminou.

Os módulos enviados foram comparados pelos hashes Git aos arquivos locais testados. Os comandos de sintaxe também passaram. Não foi usada base produtiva, credencial pessoal ou instância distribuída real do D1.

### CI preparado

Os testes anteriores de estrutura que exigiam a consulta defeituosa por timestamp/rowid foram substituídos por verificações do vínculo explícito, acompanhadas dos testes comportamentais. Os demais testes de conteúdo, acesso, progresso e ensino foram mantidos. O workflow continua cobrindo isolamento e inclui o novo módulo; a verificação de XP acompanha o módulo para o qual a regra foi movida.

Foram acrescentados **dez cenários de navegador**, mantendo os 45 anteriores, total previsto de **55**. Usam HTML/CSS reais do repositório e API simulada com respostas controladamente atrasadas/falhas. Não foram executados localmente nesta rodada; o resultado remoto deve ser consultado antes de declará-los aprovados.

### Referências técnicas consultadas

- Cloudflare D1, `D1Database.batch`, execução sequencial e rollback transacional: https://developers.cloudflare.com/d1/worker-api/d1-database/
- Node.js, SQLite `DatabaseSync`, usado apenas nos testes: https://nodejs.org/api/sqlite.html

Essas referências não equivalem a afirmar que uma simulação local certifica toda a infraestrutura Cloudflare. O novo módulo de produção não importa SQLite do Node; apenas os testes o fazem.

## 10. Estado e continuidade

A PR #507 foi incorporada em `f19b1cbb583fee9f38c79cda6538972af825ee72` após 24 execuções de GitHub Actions concluídas com sucesso. Ela conclui o recorte das 27 atividades formativas; não encerra a Fase 1 ou o curso.

Esta nova entrega permanece sujeita ao CI e à integração. Próxima etapa: medição de tempo com pausa/visibilidade e recuperação controlada, seguida da sequência histórica além dos 500 eventos. Pré-requisitos/desbloqueio no backend e homologação humana continuam pendentes quando não cobertos pelos testes desta rodada.

Nenhuma nova aula, pergunta ou recompensa foi criada. O ensino não foi reduzido. Não solicitar acesso imediato de Wellyton nem afirmar aprendizado observado; sua autorização permite prosseguir nas entregas tecnicamente elegíveis.
