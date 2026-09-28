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
