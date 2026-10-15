# Cadastro privado e Gnomo — candidata local de 15/10/2026

Branch `feat/private-account-demographics-20261015`, worktree `/workspace/guia-account-demographics`, base `eab5fb3b`. Sem push, PR, integração, publicação, D1 remoto ou dados reais. Tutorial e ponte DigSaúde preservados.

## Comportamento

- Cadastro público de cidadão exige nascimento válido e escolha explícita de Masculino ou Feminino, sem opção preenchida. Conta, nascimento e gênero são gravados no mesmo `AUTH_DB.batch`; falha em qualquer tabela desfaz o cadastro inteiro.
- `pet_private_age` continua sendo a fonte única de nascimento. `account_private_registration` guarda gênero privado e a marca de legado; nenhum deles entra em `auth_users`, JWT, projeções sociais/chat ou logs. Não há uso do gênero para permissões nem funcionalidade futura implementada.
- A regra 18+ continua autodeclarada, sem verificação de identidade, no calendário `America/Campo_Grande`: libera no aniversário exato; 29/02 libera em 01/03 nos anos não bissextos. Mantido o limite inicial de 01/01/1900; datas impossíveis/futuras são recusadas no servidor e na interface. Menores podem criar conta e usar gatos.
- Conforme a orientação final, **contas antigas sem data mantêm o formulário na adoção**. A migração faz um snapshot dessas contas; apenas a marca persistida autoriza `POST /api/pets/age`. `GET` retorna `canDeclareBirthDate`, sem retornar a data ou o gênero. Reaplicar a migração não amplia o grupo legado.
- Contas novas do cadastro têm nascimento e marca de legado desativada. O formulário não aparece para elas, nem para menores com data salva. Mesmo se a data de uma conta nova desaparecer, a API de mascotes não aceita uma declaração substituta. Campos forjados de elegibilidade/legado não são aceitos. Se uma conta do cadastro público perder a linha de nascimento, também não pode substituir a declaração pela área privada: o servidor usa `self_registered` e a marca de legado, e exige recuperação autorizada nesse caso.
- A declaração continua imutável por autoatendimento, inclusive em abas concorrentes. Não foi criado endpoint de correção nem alterada autorização operacional existente. Correções autorizadas no armazenamento continuam sujeitas à elegibilidade em cada leitura/adoção/fala, sem exclusão de mascotes.

## Mascotes existentes e outros caminhos

Nenhum mascote, inventário, saldo, conquista ou histórico é removido ou migrado. O comportamento conservador existente foi preservado: Gnomo sem elegibilidade fica oculto/bloqueado até haver data elegível; o companheiro Gnomo não acumula cuidados no intervalo bloqueado, e o gato continua utilizável. Um Gnomo primário bloqueia sua interface/API de cuidados, preservando o registro integral para retomada. Os testes incluem correção sintética autorizada e retomada.

Login por usuário/@, criação administrativa, primeiro acesso, troca de senha, verificação de e-mail, foto, perfis sociais, chat e permissões foram preservados. O primeiro acesso oferece a conclusão privada após as etapas de segurança existentes, sem conceder ou bloquear permissões gerais em função do gênero. Não foi encontrado login social: Firebase atende confirmação de e-mail, e o OAuth Google existente pertence a documentos, não ao cadastro/login do Portal.

**Contas administrativas novas e bootstrap:** a criação mantém os formulários administrativos e não aceita declaração de nascimento/gênero pelo administrador. A conta e uma linha privada com `gender=NULL` e `legacy_birth_date_allowed=0` são inseridas atomicamente. O próprio titular completa os campos ausentes em `/seguranca/#privateRegistrationCard`, depois de trocar a senha temporária e cumprir a confirmação de e-mail quando ela já for exigida. O novo endpoint `GET/PATCH /api/auth/registration-details` valida sessão/primeiro acesso/origem e sempre usa o proprietário do token; não recebe username/target, não expõe os valores salvos e só permite preencher dados ausentes. Repetição e concorrência não substituem declarações. A adoção oferece apenas um link para essa área quando a conta nova está sem data; não há campo de nascimento na adoção para essas contas.

No mobile, a renovação do token na Segurança continua descartando o contexto antigo e reabre um documento novo na própria Segurança. A troca para outra conta e o logout conservam seus destinos anteriores. Não há novo gate geral de acesso por nascimento/gênero; sem nascimento elegível, o Gnomo continua bloqueado. O fluxo legado na adoção e as correções operacionais autorizadas no armazenamento foram preservados.

## Migração privada exata

Arquivo novo: [`worker/migrations/account-private-registration.sql`](../worker/migrations/account-private-registration.sql). É **aditivo**: não contém `ALTER`, `UPDATE`, `DELETE` ou `DROP` sobre tabelas existentes.

| Tabela | Colunas e finalidade |
| --- | --- |
| `account_private_registration` (nova) | `auth_username TEXT PRIMARY KEY`, FK para `auth_users(username)` com `ON DELETE CASCADE`; `gender TEXT` anulável, `CHECK` para `masculino`/`feminino`; `legacy_birth_date_allowed INTEGER NOT NULL DEFAULT 0`, limitado a 0/1. |
| `account_private_registration_cutover` (nova) | `singleton INTEGER PRIMARY KEY CHECK(singleton=1)`; `completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP`. Registra a conclusão única do snapshot. |
| `pet_private_age` (pré-requisito existente) | Criada pela migração anterior `pets-private-age.sql`: `auth_username TEXT PRIMARY KEY`/FK, `birth_date TEXT NOT NULL`, `declared_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP` e check de formato. A migração nova não altera esta tabela nem seus valores. |

Na primeira execução, insere na tabela nova apenas o `username` das contas já presentes em `auth_users` **sem linha em `pet_private_age`**, marcando-as com legado=1; o gênero permanece `NULL`, sem inferência. Depois grava o marcador singleton. `ON CONFLICT DO NOTHING` e a condição do marcador impedem sobrescrever linhas existentes ou ampliar o grupo legado em uma reexecução. Não usa idade, gênero, data de corte ou flag informada pelo cliente. Novas contas recebem marca 0 pelo servidor. Nenhuma data existente é copiada para tabela pública, corrigida ou substituída; nenhum valor de gênero existente é modificado por essa migração. Papéis, sessões, dados de mascotes e inventários existentes não são tocados.


## Evidência local

Somente identidades sintéticas, SQL real em memória e Chromium local, com APIs interceptadas e rede externa bloqueada no navegador. Os testes do roteador principal usam um substituto apenas para a classe base `DurableObject`, ausente no Node; não instanciam DO nem substituem a lógica de autenticação/pets.

- **358 testes de regressão aprovados**, sem falhas/skip. Cobertura: cadastro, calendário, legado e replay da migração, transações/rollback, sessão/revogação/primeiro acesso/origem, adoção/cuidados/companhia, perfil/chat/privacidade, documentos, cache/PWA e tutorial. Logs em `.local/account-registration/worker-tests.log` e `syntax.log`.
- Matriz de renderização: **24 cenários** (cadastro, legado sem data, conta nova adulta, conta nova menor × 320/390/1440 px × claro/escuro), mais **16 cenários com texto 200%** (320/1440 px × ambos os temas). Zero violações axe WCAG A/AA nos formulários alterados; gênero operado por teclado, foco/descrições, controles de pelo menos 44 px, termos e confirmação de senha preservados, sem rolagem horizontal. Home↔Mascotes no shell também exercitado.
- A ampliação administrativa acrescenta **18 cenários** (conta nova sem dados, primeiro acesso, nascimento já salvo × 320/390/1440 px × claro/escuro) e **12 com texto 200%**. Inclui criação pela API administrativa, login real, renovação/invalidação do token antigo, preenchimento pelo titular, nascimento salvo não solicitado novamente, gênero sem pré-seleção, dados limpos do formulário/armazenamento e Gnomo liberado ou bloqueado conforme a data. Zero violações axe no cartão privado e zero erros de JavaScript; relatórios `results-managed.json` e `results-managed-text200.json`.
- Uma checagem posterior exercitou **8 cenários de preservação** (cadastro, legado, adulto e menor em 390 px, claro/escuro) no código ampliado, além de **8 cenários da área privada e recuperação**: inclui duas renderizações de conta autodeclarada com data ausente, sem formulário substituto e com PATCH recusado. Relatórios em `preservation/results.json` e `results-managed-guards.json`.
- Dois cenários adicionais confirmam gatos utilizáveis durante consulta de idade retida ou indisponível. Não equivalem a homologação em aparelho físico ou em produção.
- Respostas reais de cadastro/login/me/security/foto/perfil social/chat/catálogo e JWT não contêm nascimento/gênero. O navegador não grava os dados privados em localStorage/sessionStorage. Cadastro inválido, formulário manipulado e declaração repetida não liberam o Gnomo.
- Imagens revisadas diretamente, sem mockup: `.local/account-registration/signup-{320,390,1440}-{light,dark}.png`, `legacy-*.png`, `new-adult-*.png`, `new-minor-*.png` e variantes `-text200.png`. Relatórios `results.json`, `results-text200.json` e `results-signup.json`. Contraste do texto introdutório e do link de login corrigido com CSS limitado ao cadastro.

**Inspeção efetiva das imagens:** os PNGs foram abertos com o visualizador de imagens e examinados, além das asserções automáticas. Foram conferidos cadastro com placeholder vazio, contraste/foco, formulário legado e ausência de formulário nas contas novas. Na ampliação, foram inspecionados diretamente `managed-empty-390-light.png`, `managed-empty-1440-dark.png`, `managed-first-access-320-dark.png`, `managed-first-access-complete-390-light.png`, `managed-birth-saved-1440-light.png`, `managed-empty-320-dark-text200.png` e `managed-birth-saved-complete-1440-dark.png`: opções sem seleção, data existente oculta, controles utilizáveis e confirmação sem valores pessoais. Capturas de página inteira incluem as barras fixas na posição real do viewport; a rolagem/clique dos campos também foi exercitada no navegador.

Os 40 cenários visuais iniciais permanecem evidência dos componentes de cadastro/legado inalterados; o complemento e a checagem de preservação validam a área nova, os fluxos originais afetados e a renovação de sessão no código atual. Não é homologação em dispositivo físico nem CI/deploy produtivo.

Reprodução da matriz (dependências de teste podem ficar em `/tmp`, fora do repositório):

```sh
npm install --prefix /tmp/account-browser --cache /tmp/account-npm-cache playwright@1.55.0 @axe-core/playwright@4.10.2
PLAYWRIGHT_PATH=/tmp/account-browser/node_modules/playwright/index.mjs node testing/account-registration/browser.mjs
ACCOUNT_TEXT_SCALE=2 ACCOUNT_WIDTHS=320,1440 PLAYWRIGHT_PATH=/tmp/account-browser/node_modules/playwright/index.mjs node testing/account-registration/browser.mjs
ACCOUNT_MANAGED_ONLY=1 PLAYWRIGHT_PATH=/tmp/account-browser/node_modules/playwright/index.mjs node testing/account-registration/browser.mjs
ACCOUNT_MANAGED_ONLY=1 ACCOUNT_TEXT_SCALE=2 ACCOUNT_WIDTHS=320,1440 PLAYWRIGHT_PATH=/tmp/account-browser/node_modules/playwright/index.mjs node testing/account-registration/browser.mjs
```

## Implantação futura — depende de autorização

1. Confirmar a migração prévia `worker/migrations/pets-private-age.sql` e aplicar **`worker/migrations/account-private-registration.sql`** em janela coordenada com o Worker. O snapshot inicial deve representar as contas existentes antes do corte de cadastro; não deixar o Worker antigo continuar criando contas sem os novos dados durante a troca. O marcador de conclusão torna reexecuções seguras, mas não substitui a coordenação do corte.
2. Publicar Worker e frontend compatíveis, pelos gates de `WORKER-SAFE-DEPLOY.md`. Código novo sem as tabelas recusa cadastros e novas contas gerenciadas/bootstrap sem criar conta parcial; a conclusão privada retorna erro genérico sem expor SQL ou valores pessoais. Frontend antigo sem gênero será recusado, portanto a atualização deve ser coordenada.
3. A versão do cache estático foi incrementada para `20261015-account-private-2`, pois assets versionados são imutáveis no SW. A lógica do tutorial não foi alterada; a renovação de sessão na Segurança mantém a limpeza e volta à própria área privada. Os demais destinos de sessão permanecem os mesmos. Verificar atualização do SW e fluxos de cadastro/legado após o deploy autorizado.
4. Não apagar tabelas ou dados privados em rollback. Reverter apenas para código compatível com coleta obrigatória e a marca de legado; o Worker anterior aceita cadastro sem data e não aplica a nova distinção. Reversão antiga reabre o comportamento substituído.

Nenhuma dessas ações foi executada. Gates de publicação/CI e smoke no ambiente publicado permanecem pendentes de autorização; a evidência acima é local.
