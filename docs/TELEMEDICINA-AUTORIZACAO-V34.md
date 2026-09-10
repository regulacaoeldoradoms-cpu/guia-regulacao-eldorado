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
