# Telemedicina — autorização lógica e validação em segundo plano V34

Decisão permanente registrada em 10/09/2026.

## Problema identificado

O perfil **Técnico em Telemedicina** é um perfil lógico. Por compatibilidade com a autenticação existente, a conta fica armazenada no D1 com papel-base `recepcao`, enquanto a tabela `auth_telemedicine_access` registra a capacidade exclusiva de Telemedicina. A camada flexível apresenta essa combinação ao Portal como `role: telemedicina`.

A interface e o backend da Telemedicina, porém, não podiam depender de duas verdades independentes. Uma divergência histórica entre o papel-base e a capacidade lógica podia fazer a interface reconhecer o Técnico em Telemedicina e, ao mesmo tempo, uma rota protegida rejeitar a mesma conta.

## Regra V34

A capacidade registrada em `auth_telemedicine_access` continua sendo a fonte de verdade da função lógica **Técnico em Telemedicina**. O papel-base `recepcao` é um detalhe de compatibilidade e deve permanecer coerente automaticamente.

A V34 passa a manter esse invariante em dois pontos:

1. ao conceder o acesso à Telemedicina, o backend também normaliza o papel-base da conta para `recepcao`, exceto para o Desenvolvedor;
2. no aquecimento do Worker, uma verificação de consistência repara automaticamente registros históricos que possuam acesso de Telemedicina habilitado, mas tenham ficado com papel-base divergente.

A correção não cria acesso para quem não possui a capacidade habilitada. Ela apenas torna coerentes as duas partes técnicas de uma autorização já existente.

## Validação e desempenho

Existem dois conceitos diferentes:

- **validação de CI/deploy**: testes automatizados executados no GitHub antes/depois de incorporar mudanças. Eles não rodam quando o usuário clica em um botão e não aumentam o tempo de uso do Portal;
- **autorização de runtime**: conferência feita pelo Worker para garantir que uma requisição protegida realmente pertence a uma sessão válida e a uma conta autorizada.

A autorização de runtime não pode ser eliminada nem confiada apenas ao navegador. Operações que leem ou gravam dados protegidos devem continuar sendo autorizadas no servidor em cada requisição. Isso evita que alguém contorne a interface e chame a API diretamente.

O Portal pode, entretanto, evitar trabalho repetitivo desnecessário. A V34 faz isso sem reduzir a segurança:

- a criação/verificação da tabela `auth_telemedicine_access` é memorizada por isolate aquecido do Worker, em vez de executar `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS` a cada consulta de permissão;
- a correção do invariante histórico é executada uma única vez por isolate depois que as tabelas existem;
- novas concessões já salvam o papel-base correto imediatamente;
- o frontend continua abrindo a experiência a partir da sessão em cache e revalidando a sessão em segundo plano, conforme a camada de performance já implantada.

A checagem que permanece em cada chamada protegida deve ser pequena: validar a sessão assinada e confirmar a capacidade necessária. Ela não equivale a revalidar todo o Portal.

## Segurança

- não confiar em cargo, botão oculto ou estado de JavaScript como autorização;
- não conceder Telemedicina com base em nome, cargo textual ou conteúdo do perfil;
- não publicar usuários, credenciais, tokens ou dados de pacientes no repositório;
- preservar a revogação imediata quando a capacidade for explicitamente removida;
- manter as operações de Telemedicina protegidas no Worker.

## Arquivos

- `worker/telemedicine-access.js`: cache do schema, manutenção do papel-base e concessão coerente do perfil lógico;
- `worker/role-migration.js`: reparo de consistência de registros históricos uma vez por isolate;
- `worker/tests/telemedicine-access-v34.test.mjs`: regressões da V34;
- `.github/workflows/validate-telemedicine-access-v34.yml`: validação automatizada dedicada.
