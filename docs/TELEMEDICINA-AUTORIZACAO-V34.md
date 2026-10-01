# Telemedicina — autorização lógica e validação em segundo plano V34/V34.1

Decisão permanente registrada em 10/09/2026.

## Problema identificado

O perfil **Técnico em Telemedicina** é um perfil lógico. Por compatibilidade com a autenticação existente, a conta fica armazenada no D1 com papel-base `recepcao`, enquanto a tabela `auth_telemedicine_access` registra a capacidade exclusiva de Telemedicina. A camada flexível apresenta essa combinação ao Portal como `role: telemedicina`.

A interface e o backend da Telemedicina, porém, não podem depender de duas verdades independentes. Uma divergência histórica entre o papel-base e a capacidade lógica pode fazer a interface reconhecer o Técnico em Telemedicina e, ao mesmo tempo, uma rota protegida rejeitar a mesma conta.

## Regra V34

A capacidade registrada em `auth_telemedicine_access` continua sendo a fonte de verdade da função lógica **Técnico em Telemedicina**. O papel-base `recepcao` é um detalhe de compatibilidade e deve permanecer coerente automaticamente.

A V34 mantém esse invariante em dois pontos:

1. ao conceder o acesso à Telemedicina, o backend também normaliza o papel-base da conta para `recepcao`, exceto para o Desenvolvedor;
2. no aquecimento do Worker, uma verificação de consistência repara automaticamente registros históricos que possuam acesso de Telemedicina habilitado, mas tenham ficado com papel-base divergente.

A regra normal não concede acesso com base em nome, cargo textual ou aparência da interface. A capacidade deve existir no backend.

## Complemento V34.1 — capacidade ausente em registro legado explícito

Após a V34, foi identificado um segundo estado histórico possível: uma conta antiga pode ainda possuir no próprio `auth_users.role` o valor explícito `telemedicina`, mas não possuir a linha correspondente em `auth_telemedicine_access`. Nesse estado, o navegador pode continuar exibindo uma sessão previamente armazenada como Telemedicina, enquanto as rotas protegidas recusam gravações corretamente por não encontrarem a capacidade no backend.

A V34.1 acrescenta uma migração conservadora antes das rotas:

1. garante a existência da tabela `auth_telemedicine_access`;
2. considera **somente** `auth_users.role = 'telemedicina'` como marcador legado forte de uma autorização técnica previamente concedida;
3. cria a capacidade faltante com `INSERT OR IGNORE`;
4. normaliza o papel-base para `recepcao`;
5. mantém qualquer linha já existente com `enabled = 0`, portanto uma revogação explícita não é reativada pela migração.

Não é permitido reconstruir autorização usando nome de usuário, nome da pessoa, `job_title`, texto de cargo, conteúdo do perfil ou dados do navegador. A migração também não contém identificadores de usuários específicos.

## Validação e desempenho

Existem dois conceitos diferentes:

- **validação de CI/deploy**: testes automatizados executados no GitHub antes/depois de incorporar mudanças. Eles não rodam quando o usuário clica em um botão e não aumentam o tempo de uso do Portal;
- **autorização de runtime**: conferência feita pelo Worker para garantir que uma requisição protegida realmente pertence a uma sessão válida e a uma conta autorizada.

A autorização de runtime não pode ser eliminada nem confiada apenas ao navegador. Operações que leem ou gravam dados protegidos devem continuar sendo autorizadas no servidor em cada requisição. Isso evita que alguém contorne a interface e chame a API diretamente.

O Portal pode, entretanto, evitar trabalho repetitivo desnecessário. A V34/V34.1 faz isso sem reduzir a segurança:

- a criação/verificação da tabela `auth_telemedicine_access` é memorizada por isolate aquecido, em vez de executar `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS` a cada consulta de permissão;
- a reconciliação histórica é executada uma única vez por isolate depois que as tabelas necessárias existem;
- novas concessões já salvam o papel-base correto imediatamente;
- o frontend continua abrindo a experiência a partir da sessão em cache e revalidando a sessão em segundo plano, conforme a camada de performance já implantada.

A checagem que permanece em cada chamada protegida deve ser pequena: validar a sessão assinada e confirmar a capacidade necessária. Ela não equivale a revalidar todo o Portal.

## Segurança

- não confiar em cargo visual, botão oculto ou estado de JavaScript como autorização;
- não conceder Telemedicina com base em nome, `job_title` ou conteúdo do perfil;
- aceitar como exceção de migração apenas o valor técnico legado `auth_users.role = 'telemedicina'`, sem sobrescrever revogação explícita;
- não publicar usuários, credenciais, tokens ou dados de pacientes no repositório;
- preservar a revogação imediata quando a capacidade for explicitamente removida;
- manter as operações de Telemedicina protegidas no Worker.

## Arquivos

- `worker/telemedicine-access.js`: cache do schema, manutenção do papel-base e concessão coerente do perfil lógico;
- `worker/role-migration.js`: reconciliação de registros históricos e recuperação conservadora de marcador legado explícito;
- `worker/tests/telemedicine-access-v34.test.mjs`: regressões da V34/V34.1;
- `.github/workflows/validate-telemedicine-access-v34.yml`: validação automatizada dedicada.

## Complemento V34.2 — autorização resiliente a divergência criada durante isolate aquecido

Decisão registrada em 22/09/2026 após recorrência de `403` ao registrar teleconsulta para uma conta que já possuía a capacidade de Telemedicina concedida.

A causa estrutural era a autorização das rotas exigir simultaneamente duas condições: capacidade ativa em `auth_telemedicine_access` e papel-base já igual a `recepcao`. Isso contrariava a própria regra V34 de que a capacidade explícita é a fonte de verdade e permitia uma janela de falha quando o papel-base divergisse depois que a reconciliação única do isolate já tivesse rodado.

Regra V34.2:

1. Desenvolvedor continua autorizado diretamente.
2. Para demais usuários, a rota protegida valida a sessão e consulta obrigatoriamente `auth_telemedicine_access`.
3. Capacidade ausente ou revogada continua retornando acesso negado.
4. Capacidade ativa autoriza a função lógica, independentemente de uma divergência transitória do papel-base.
5. Se o papel-base estiver diferente de `recepcao`, a própria rota executa `ensureTelemedicineUnderlyingRole` antes de prosseguir, autocorrigindo o D1.
6. A mesma regra é aplicada ao backend principal da Telemedicina, ao roteador V2 e à Agenda espelhada.

Não há concessão por nome, cargo textual, frontend ou sessão antiga. A fonte de verdade continua sendo exclusivamente a capacidade server-side.

## Complemento V34.3 — persistência da autorização e revogação explícita

Decisão permanente registrada em 28/09/2026 após nova recorrência de `403 — Acesso exclusivo da Telemedicina ou do Desenvolvedor` em uma conta operacional já destinada ao módulo.

### Diagnóstico da recorrência

A correção V34.2 continua válida: as rotas protegidas usam `auth_telemedicine_access` como fonte de verdade e autocorrigem o papel-base `recepcao`. Portanto, quando uma sessão válida chega à tela da Telemedicina, mas uma gravação recebe o `403` acima, o problema não é mais a divergência transitória do papel-base: a capacidade persistida está ausente ou desabilitada.

A revisão do código encontrou uma via de revogação acidental no fluxo administrativo. O formulário de edição enviava `role` em toda gravação, mesmo quando o operador alterava apenas nome, cargo textual ou estado da conta. O backend interpretava qualquer `PATCH` cujo `role` não fosse `telemedicina` como ordem para gravar `auth_telemedicine_access.enabled = 0`. Como o papel-base de uma conta de Telemedicina é internamente `recepcao`, uma edição administrativa comum podia derrubar a capacidade lógica sem intenção de revogá-la.

A interface ainda podia permanecer aberta por alguns instantes porque a sessão do navegador mantém o perfil lógico em cache e faz revalidação em segundo plano. Nesse intervalo, a API já consultava o D1 em tempo real e recusava a gravação, produzindo exatamente a combinação "tela aberta + 403 ao salvar".

### Regra V34.3

1. Editar nome, cargo textual, status ativo ou funções independentes não altera a capacidade de Telemedicina.
2. O frontend administrativo somente envia `role` quando o perfil realmente foi alterado.
3. Sair do perfil lógico `telemedicina` envia também `telemedicineAccess: false`.
4. O backend somente grava `enabled = 0` quando recebe essa revogação explícita de um Desenvolvedor.
5. Se uma conta com capacidade ativa receber pedido de mudança de perfil sem revogação explícita, a alteração é recusada em vez de remover silenciosamente o acesso.
6. Selecionar explicitamente o perfil `telemedicina` continua concedendo a capacidade e normalizando o papel-base.
7. A autorização das APIs permanece server-side; nenhuma confiança é transferida para cache, botão, cargo textual ou nome do usuário.

Com essa regra, uma conta destinada permanentemente à operação da Telemedicina permanece autorizada até que o Desenvolvedor execute uma mudança de perfil que contenha revogação explícita.

## Complemento V34.4 — o rótulo visual não substitui a capacidade server-side

Decisão permanente registrada em 28/09/2026 após confirmação de um estado incoerente no painel administrativo: a conta podia aparecer com **Perfil de acesso: Técnico em Telemedicina** e **Acesso ativo**, mas a API de registro de consulta ainda retornar `403 — Acesso exclusivo da Telemedicina ou do Desenvolvedor`.

### Causa

O perfil exibido no painel e a capacidade `auth_telemedicine_access.enabled` são informações relacionadas, mas não eram apresentadas de forma suficientemente explícita quando havia uma inconsistência histórica. Uma conta legada podia manter o rótulo lógico `telemedicina` enquanto a capacidade server-side permanecia desabilitada. Nesse caso, o seletor visual parecia correto, porém a API fazia corretamente a validação da capacidade persistida e bloqueava a gravação.

### Regra V34.4

1. O painel administrativo passa a distinguir o rótulo lógico da autorização técnica real.
2. Se a conta aparecer como `telemedicina` mas `telemedicineAccess !== true`, a interface mostra **Telemedicina: autorização técnica pendente**.
3. Abrir a edição nessa condição exibe aviso de inconsistência.
4. Manter **Técnico em Telemedicina** selecionado e clicar em **Salvar alterações** passa a ser uma concessão explícita: o frontend envia `role: telemedicina` e `telemedicineAccess: true`.
5. O backend aceita a concessão somente quando o papel solicitado também é `telemedicina`; `telemedicineAccess: true` isolado é rejeitado.
6. A concessão executa o fluxo canônico `setTelemedicineAccess(..., true)`, que grava a capacidade server-side e normaliza o papel-base interno para `recepcao`.
7. Sair do perfil continua exigindo `telemedicineAccess: false`, conforme V34.3.

Assim, o Desenvolvedor consegue reparar com uma única gravação uma conta antiga cujo seletor já mostrava Telemedicina, sem depender de manipulação direta do D1 e sem reativar automaticamente contas revogadas.

## Complemento V34.5 — resiliência de rede no painel de usuários

Decisão registrada em 28/09/2026 após o painel `/admin/usuarios/` exibir `Failed to fetch` ao carregar **Contas cadastradas**.

A mensagem é produzida pelo navegador quando a requisição não recebe uma resposta HTTP utilizável; portanto ela é tratada como falha de transporte, não como decisão de autorização.

Regra V34.5:

1. somente a leitura `GET /api/admin/users` recebe repetição automática;
2. a tentativa inicial pode ser seguida por no máximo duas repetições, após 350 ms e 900 ms;
3. somente erros de rede compatíveis com `TypeError: Failed to fetch`, `NetworkError`, `Load failed` ou equivalentes são repetidos;
4. respostas HTTP reais, inclusive 401, 403, 409, 429, 500 e 503, não são repetidas;
5. operações de criação, edição, troca de senha e demais gravações não entram no retry, evitando duplicidade;
6. se as três tentativas falharem, o painel mostra mensagem operacional clara e botão **Tentar novamente**;
7. o arquivo administrativo recebe nova URL versionada para evitar reutilização do JavaScript anterior pelo cache.

A medida não altera permissões nem concede acesso. Ela apenas torna a leitura administrativa tolerante a falhas transitórias de conectividade.

## Complemento V34.6 — integridade permanente da autorização

Decisão permanente registrada em 29/09/2026 após confirmação de que a conta operacional voltou a funcionar depois do reparo V34.4/V34.5. O objetivo desta etapa é impedir que uma nova regressão silenciosa volte a desabilitar a capacidade de Telemedicina.

### Defesa em profundidade

A partir da V34.6, a capacidade `auth_telemedicine_access` recebe três camadas adicionais:

1. **Concessão e revogação deixam de compartilhar um setter genérico.** O backend passa a expor caminhos distintos: `grantTelemedicineAccess` e `revokeTelemedicineAccess`.
2. **Revogar exige intenção explícita.** A revogação só é aceita com o motivo técnico `profile-change`, emitido pelo fluxo administrativo quando o Desenvolvedor realmente troca o perfil.
3. **O D1 passa a bloquear revogações acidentais no próprio banco.** Triggers recusam transição `enabled=1 -> enabled=0`, inserção já desabilitada e exclusão da linha de capacidade sem uma intenção de revogação válida.
4. **A intenção de revogação existe somente dentro do mesmo batch transacional.** A intenção temporária, a mudança para `enabled=0`, o registro de auditoria e a limpeza da intenção são executados juntos.
5. **Toda capacidade ativa recebe uma âncora de auditoria.** Contas que já estavam habilitadas quando a V34.6 entrou em produção recebem `baseline_enabled`; contas historicamente desabilitadas não são reativadas por inferência.
6. **O runtime autorrepara divergências incompatíveis com a última intenção.** Se a linha estiver ausente/desabilitada, mas a última ação persistida continuar sendo `baseline_enabled`, `granted` ou `auto_repaired`, o backend restaura a capacidade e o papel-base antes de negar a operação.
7. **Revogação legítima sempre prevalece.** Quando a última ação é `revoked`, não há autorreparo.

A trilha `auth_telemedicine_access_audit` armazena somente identidade operacional da conta, ator técnico, ação, motivo e data; não contém dados de pacientes nem conteúdo clínico.

### Resultado esperado

Uma conta cuja última decisão administrativa seja **Técnico em Telemedicina** não deve perder o acesso por edição comum, código legado, exclusão acidental da linha ou escrita `enabled=0` sem intenção explícita. Mesmo se uma divergência física for introduzida por regressão futura, a primeira verificação server-side deve restaurar o estado coerente antes de retornar 403.

## Complemento V34.7 — conexão do painel administrativo sem N+1 D1

Decisão permanente registrada em 29/09/2026 após `/admin/usuarios/` continuar exibindo falha de conexão mesmo com conectividade geral disponível.

### Diagnóstico técnico

O painel não fazia apenas uma leitura de usuários. Depois de obter a lista-base, a camada flexível decorava cada conta individualmente com a capacidade de Telemedicina. Após a V34.6, cada conta sem capacidade ativa podia exigir também uma leitura da última intenção de auditoria. Isso criava um padrão **N+1** de consultas D1: quanto mais contas existissem, mais leituras sequenciais eram executadas dentro de uma única requisição administrativa.

Além disso, o `OPTIONS` CORS necessário ao navegador passava pela reconciliação global antes de chegar ao preflight específico do painel. Em um cold start, essa etapa podia tocar D1 antes mesmo de o navegador obter autorização para enviar o GET autenticado. Quando a camada de transporte era interrompida nesse ponto, o navegador expunha apenas `TypeError: Failed to fetch`.

### Regra V34.7

1. `decorateTelemedicineUsers` deve carregar capacidades de Telemedicina em lote, não executar `decorateTelemedicineUser` sequencialmente para cada conta.
2. A última intenção de auditoria também é obtida em uma consulta agregada por usuário.
3. Somente contas realmente inconsistentes entram no autorreparo V34.6; contas comuns não geram leituras adicionais individuais.
4. O `OPTIONS /api/admin/users*` deve ser respondido antes de qualquer migração, D1, Firebase ou outra inicialização de backend.
5. O endpoint continua validando sessão e permissões normalmente no GET/PATCH/POST real; nenhuma autorização foi transferida ao frontend.
6. O retry V34.5 continua sendo apenas contingência de transporte. Ele não é a solução principal para sobrecarga do endpoint.

A lista administrativa passa, portanto, a ter custo de leitura praticamente constante em relação ao número de usuários, preservando a mesma regra de autorização.

## Complemento V34.8 — sessão operacional não pode cair por edição administrativa comum

Decisão permanente registrada em 01/10/2026 após nova ocorrência em que uma conta operacional de Telemedicina recebia `403 — Acesso exclusivo da Telemedicina ou do Desenvolvedor` apesar de a capacidade server-side continuar ativa.

### Diagnóstico da recorrência

A inspeção do D1 confirmou que, no momento do incidente:

- a conta permanecia ativa;
- `auth_telemedicine_access.enabled = 1`;
- a última intenção de auditoria continuava sendo de acesso habilitado;
- o papel-base permanecia `recepcao`, conforme o desenho V34;
- a `session_version` da conta havia sido incrementada recentemente.

O painel administrativo envia `name`, `jobTitle` e `active` quando salva uma edição. O backend-base iniciava toda edição de uma conta de terceiro com `invalidatesSessions = true`. Assim, alterar apenas nome/cargo textual — ou simplesmente salvar os mesmos metadados — podia incrementar `session_version` e invalidar imediatamente o Bearer token do profissional.

A Telemedicina ainda convertia dois estados diferentes no mesmo `403`: sessão inválida e ausência real da capacidade. Por isso o incidente parecia uma nova perda da autorização V34, embora a capacidade estivesse íntegra no D1.

### Regra V34.8

1. Alterações administrativas de nome e cargo textual não invalidam sessões.
2. Campos enviados sem mudança real não geram escrita nem incremento de `session_version`.
3. Alterações de segurança/autorização — ativação/desativação, mudança de perfil-base ou função do Conselho — continuam invalidando sessões.
4. Redefinição de senha continua invalidando sessões anteriores.
5. As APIs de Telemedicina e Agenda retornam `401` com orientação para entrar novamente quando a sessão estiver inválida ou expirada.
6. O `403 — Acesso exclusivo da Telemedicina ou do Desenvolvedor` fica reservado para sessão válida sem capacidade de Telemedicina.
7. O cliente remove localmente um token obsoleto quando uma API protegida confirma `401`, evitando manter interface autenticada com credencial já inválida.
8. A capacidade `auth_telemedicine_access` permanece a fonte de verdade e não é alterada por esta correção.

Uma sessão que já tenha sido invalidada antes da publicação da V34.8 precisa autenticar novamente uma única vez. Não é necessário reconceder a capacidade de Telemedicina quando ela já está ativa no D1.

### Arquivos e regressão

- `worker/auth-management-v2.js`: invalidação de sessão passa a ocorrer somente em mudanças sensíveis;
- `worker/telemedicine-router-v2.js`, `worker/telemedicine.js` e `worker/agenda.js`: separação entre 401 de sessão e 403 de capacidade;
- `js/auth-client.js`: limpeza de token obsoleto em 401 protegido;
- `worker/tests/developer-self-edit-session.test.mjs`: reproduz o salvamento administrativo de uma conta de Telemedicina e exige que a sessão continue válida;
- `worker/tests/telemedicine-access-v34.test.mjs`: valida a distinção 401/403;
- `.github/workflows/validate-telemedicine-edit.yml`: atualizado para a nova forma explícita de negação.

