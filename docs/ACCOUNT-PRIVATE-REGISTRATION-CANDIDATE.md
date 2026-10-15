# Cadastro e dados privados — candidata de 15/10/2026

Branch `feat/private-account-demographics-20261015`, worktree `/workspace/guia-account-demographics`, PR draft [#660](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/660), base `eab5fb3b`. Sem integração, publicação, migração remota, credenciais/permissões alteradas ou acesso a registros pessoais reais. Tutorial aprovado e ponte DigSaúde (#659) preservados.

## Comportamento atual

- O nascimento é obrigatório no cadastro e gravado privadamente em `pet_private_age`, junto com a conta, no mesmo `AUTH_DB.batch`. Não é verificação de identidade. O cadastro contém apenas a explicação curta de que a data é autodeclarada e privada; não há texto associando-a ao Gnomo/mascotes 18+.
- **Gênero opcional, sem pré-seleção:** Mulher (`mulher`), Homem (`homem`), Pessoa não binária (`pessoa_nao_binaria`), Outra identidade de gênero (`outra_identidade`), Prefiro não informar (`prefiro_nao_informar`). Omissão, vazio ou `null` gravam `NULL`; a opção explícita Prefiro não informar é distinta de deixar em branco. Não há texto livre nem inferência a partir do nome.
- O próprio titular pode **editar ou remover o gênero** em Segurança. O endpoint protegido `GET/PATCH /api/auth/registration-details` sempre usa o proprietário do token. Somente essa área privada recebe o gênero salvo para edição; nunca retorna a data de nascimento. Nenhum valor entra em `auth_users`, JWT, perfis públicos, chat, manifestações, armazenamento de sessão/local do navegador ou logs.
- Gênero não concede nem bloqueia permissões, elegibilidade ou redirecionamento obrigatório. As etapas existentes de senha temporária, verificação de e-mail profissional, sessão/revogação e origem continuam exigidas. Administrador/bootstrap não declaram dados por terceiros: criam metadados privados com gênero `NULL` e legado=0; o titular completa seu nascimento na área privada.
- O nascimento salvo **não pode ser substituído** por esse endpoint nem pela adoção. Correção autorizada operacional existente foi preservada. Contas do cadastro público que perderem a linha de nascimento precisam de recuperação autorizada; editar o gênero nessa situação continua possível e não recupera nem desbloqueia a idade.
- A regra 18+ usa somente a data salva e o calendário `America/Campo_Grande`: aniversário exato; 29/02 permanece bloqueado até 01/03 em ano não bissexto. Datas anteriores a 01/01/1900, impossíveis ou futuras são recusadas no servidor e na interface. Menores podem criar conta sem gênero e usar gatos.
- Conforme orientação anterior preservada, **contas legadas sem data mantêm a declaração na adoção**. Apenas a marca de legado do servidor autoriza esse caminho. Contas novas não recebem coleta de data na adoção; quando necessário, recebem o link para Segurança.

## Layout e formulários

No celular, o cabeçalho mostra a marca compacta, sem repetir o grande bloco de apresentação e os cartões de níveis. O formulário conserva as informações essenciais de privacidade, Conta Bronze/e-mail opcional e o consentimento integral, com textos menores e sem repetição do bloco Bronze. No desktop, continuam as duas colunas e a apresentação completa. Usuário, senha e confirmação permanecem controles distintos e únicos; a aparente confirmação duplicada em captura não foi tratada como bug.

A grade mobile usa `minmax(0,1fr)` e os controles usam largura mínima zero, evitando alargar o viewport com texto ampliado/opções longas. Consentimento mantém altura natural, controles acessíveis e clique real. Campos obrigatórios/formatos originais de autenticação foram preservados; somente gênero deixou de ser obrigatório, conforme o modelo aprovado.

## Mascotes e dados existentes

Nenhum mascote, inventário, saldo, conquista ou histórico é removido ou migrado. Gnomo sem elegibilidade fica oculto/bloqueado, preservando seus registros para retomada; companheiro não acumula cuidados no intervalo bloqueado, e gatos continuam utilizáveis. Gnomo primário sem elegibilidade bloqueia cuidados na interface e API. Os testes incluem correção sintética autorizada e retomada.

Não foi encontrado login social: Firebase atende confirmação de e-mail; o OAuth Google existente é de documentos. Login usuário/@, criação administrativa, primeiro acesso, foto/perfil, social, chat e permissões continuam cobertos.

## Migração aditiva exata

Arquivo: [`worker/migrations/account-private-registration.sql`](../worker/migrations/account-private-registration.sql). **Ainda não aplicado em produção.** O CHECK já contém o modelo de cinco opções e admite `NULL`. Não há alteração ou exclusão de tabelas/dados existentes.

| Objeto | Contrato |
| --- | --- |
| `account_private_registration` (nova tabela) | `auth_username TEXT PRIMARY KEY`, FK para `auth_users(username)` com `ON DELETE CASCADE`; `gender TEXT` anulável com CHECK das cinco opções acima; `legacy_birth_date_allowed INTEGER NOT NULL DEFAULT 0 CHECK(0/1)`. |
| `account_private_registration_cutover` (nova tabela) | `singleton INTEGER PRIMARY KEY CHECK(singleton=1)`, `completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP`; conclusão única do snapshot. |
| `account_private_registration_legacy_bridge` (novo trigger) | Instalado antes do snapshot. Marca provisoriamente inserts de `auth_users` com legado=1 para contas aceitas pelo Worker anterior durante a troca. A criação atual força a própria linha para legado=0 no mesmo batch da conta. |
| `pet_private_age` (pré-requisito existente) | Criada por `pets-private-age.sql`: `auth_username` PK/FK, `birth_date TEXT NOT NULL`, `declared_at` e check de formato. Não é alterada pela migração nova. |

O snapshot inicial marca somente contas existentes sem nascimento. Reexecução não amplia esse snapshot nem sobrescreve gêneros, datas ou marcas já gravadas. O bridge cobre inserts durante as etapas de preparação; contas do contrato atual recebem legado=0 atomicamente. Papéis, sessões e dados de mascotes existentes não são tocados. Edição de gênero não modifica a marca de legado nem o nascimento.

`GET /api/auth/registration-capabilities` anuncia **v3**, `birthDateRequired:true`, `genderRequired:false` somente após verificar as três tabelas, o trigger, o marcador e o CHECK técnico das cinco opções. Schema com o enum anterior não é anunciado como compatível. São apenas metadados públicos, sem dados de pessoas, com `no-store`. O frontend confirma esse contrato antes do POST com dados pessoais; em 404/503 preserva o formulário para tentativa posterior, sem criar conta parcial.

Os namespaces do SW permanecem `20261009-pets-combined-8`. Só URLs conhecidas dos seis controladores alterados são atualizadas para `20261015-account-private-4`; caches, rascunhos, versões futuras e fallback offline são preservados. Cadastro busca HTML atual com prazo limitado; HTML antigo incompleto pede atualização sem POST nem erro JS. Tutorial não foi refeito.

## Evidência sintética

Somente identidades fictícias, SQLite real em memória, D1 local e Chromium; nenhum dado real ou D1 remoto. O navegador intercepta APIs e bloqueia rede externa. O stub do Node substitui apenas a classe base `DurableObject`, não a lógica de autenticação/pets.

- **1.002 testes da suíte completa do Worker aprovados**, sem falhas/skip, e sintaxe aprovada. Logs `/tmp/account-inclusive-final-worker.log` e `/tmp/account-inclusive-final-syntax.log`. Inclui a recusa do schema com enum antigo. Cobertura de datas/calendário, transações, cinco opções/omissão/edição/remoção, sessão/origem/primeiro acesso, privacidade e preservação de idade/mascotes.
- **24 cenários nativos** (cadastro, legado, adulto e menor × 320/390/1440 × claro/escuro), **6 de cadastro sem gênero** e **24 de contas gerenciadas/recuperação**. Nascimento pode ser completado sem gênero; depois o gênero é editado e removido sem mudar a data ou o papel. As cinco escolhas são exercitadas em 390 px. Capturas/relatórios sob `.local/account-registration/inclusive-*`.
- **16 cenários com texto 200%**, mais **12 da área privada em 200%**, em 320/1440 px e ambos os temas, com Chromium 140. Zero violações axe WCAG A/AA nos controles alterados, zero erros JS e reflow medido contra a largura configurada do viewport. Senha/confirmação e consentimento foram exercitados com cliques reais, sem `force`.
- **8 comparações focadas de preservação** de cadastro/Segurança em desktop/mobile, claro/impressão: afirma primeiro as alterações aprovadas e depois projeta apenas essas adições/textos para comparar controles e pixels anteriores. Os limites originais de raster/layout não foram aumentados; nenhuma rota foi removida. `/tmp/account-inclusive-preservation.log`.
- **37 testes de política de cache + 9 cenários Chromium de cliente instalado** aprovados (pré-621, cidadão/admin, rascunho, rede lenta/offline). `/tmp/account-inclusive-cache.log` e `/tmp/account-inclusive-installed-cache.log`.
- **D1 local/Wrangler 4.135.0:** SQL completo, trigger, cinco opções, edição e remoção exercitados em banco novo. Agregados esperados: 2 linhas privadas, 1 legada, 2 gêneros vazios após remoção e 1 nascimento preservado. `/tmp/account-d1-inclusive/result.json`.
- Capturas reais abertas e inspecionadas: `inclusive-first/signup-390-light.png`, `inclusive-optional/signup-1440-dark.png`, `inclusive-managed/managed-birth-saved-complete-390-dark.png`, além das variantes finais com texto 200%. Evidências anteriores de campos imutáveis de nascimento, gatos e recuperação são reaproveitadas quando não afetadas.

A matriz completa também é executada no workflow `Cadastro privado — servidor e renderização sintética`. Evidência é de navegador sintético, não de aparelho físico ou homologação produtiva.

## Implantação bloqueada

1. Confirmar produção única/100%, o binding exato `AUTH_DB` e apenas schema/contagens agregadas do banco autorizado, pelo procedimento de `WORKER-SAFE-DEPLOY.md`, sem exibir secrets ou registros pessoais.
2. Confirmar `pets-private-age.sql` e aplicar o arquivo aditivo completo com o CHECK atual das cinco opções. Verificar tabelas, trigger, marcador, CHECK e contagens; se houver schema anterior inesperado, interromper e planejar correção preservando dados, sem DROP/limpeza.
3. Somente com migração produtiva confirmada, revisão e checks aprovados integrar/publicar pelo gate existente. Main dispara publicação, por isso não foi integrada. Não alterar credenciais/permissões nem misturar DigSaúde. O preflight PC cancelado não é retomado por esta tarefa.
4. Conferir versões/assets e contrato v3; smoke anônimo de autenticação/CORS, Agenda, admin/chat/tutorial e rotas de conta, sem criar contas ou consultar registros pessoais em produção.
5. Preservar schema/dados em eventual rollback; voltar somente para código compatível com a coleta de nascimento e a distinção de legado.

**Bloqueio observado:** Wrangler recusou até `deployments status --json` porque `CLOUDFLARE_API_TOKEN` não está disponível neste ambiente não interativo. Mensagem: “In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable for wrangler to work.” Nenhuma tentativa de contornar por CI ou modificar credenciais/permissões. É necessária execução por operador autorizado ou acesso já autorizado por canal seguro. PR permanece draft, sem merge, migração remota ou deploy.
