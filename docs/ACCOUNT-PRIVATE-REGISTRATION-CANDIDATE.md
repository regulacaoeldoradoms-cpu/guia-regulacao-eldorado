# Cadastro privado e Gnomo — candidata local de 15/10/2026

Branch `feat/private-account-demographics-20261015`, worktree `/workspace/guia-account-demographics`, base `eab5fb3b`. Sem push, PR, integração, publicação, D1 remoto ou dados reais. Tutorial e ponte DigSaúde preservados.

## Comportamento

- Cadastro público de cidadão exige nascimento válido e escolha explícita de Masculino ou Feminino, sem opção preenchida. Conta, nascimento e gênero são gravados no mesmo `AUTH_DB.batch`; falha em qualquer tabela desfaz o cadastro inteiro.
- `pet_private_age` continua sendo a fonte única de nascimento. `account_private_registration` guarda gênero privado e a marca de legado; nenhum deles entra em `auth_users`, JWT, projeções sociais/chat ou logs. Não há uso do gênero para permissões nem funcionalidade futura implementada.
- A regra 18+ continua autodeclarada, sem verificação de identidade, no calendário `America/Campo_Grande`: libera no aniversário exato; 29/02 libera em 01/03 nos anos não bissextos. Mantido o limite inicial de 01/01/1900; datas impossíveis/futuras são recusadas no servidor e na interface. Menores podem criar conta e usar gatos.
- Conforme a orientação final, **contas antigas sem data mantêm o formulário na adoção**. A migração faz um snapshot dessas contas; apenas a marca persistida autoriza `POST /api/pets/age`. `GET` retorna `canDeclareBirthDate`, sem retornar a data ou o gênero. Reaplicar a migração não amplia o grupo legado.
- Contas novas do cadastro têm nascimento e marca de legado desativada. O formulário não aparece para elas, nem para menores com data salva. Mesmo se a data de uma conta nova desaparecer, a API de mascotes não aceita uma declaração substituta. Campos forjados de elegibilidade/legado não são aceitos.
- A declaração continua imutável por autoatendimento, inclusive em abas concorrentes. Não foi criado endpoint de correção nem alterada autorização operacional existente. Correções autorizadas no armazenamento continuam sujeitas à elegibilidade em cada leitura/adoção/fala, sem exclusão de mascotes.

## Mascotes existentes e outros caminhos

Nenhum mascote, inventário, saldo, conquista ou histórico é removido ou migrado. O comportamento conservador existente foi preservado: Gnomo sem elegibilidade fica oculto/bloqueado até haver data elegível; o companheiro Gnomo não acumula cuidados no intervalo bloqueado, e o gato continua utilizável. Um Gnomo primário bloqueia sua interface/API de cuidados, preservando o registro integral para retomada. Os testes incluem correção sintética autorizada e retomada.

Login por usuário/@, criação administrativa, primeiro acesso, troca de senha, verificação de e-mail, foto, perfis sociais, chat e permissões mantêm os contratos existentes. Não foi encontrado login social: Firebase atende confirmação de e-mail, e o OAuth Google existente pertence a documentos, não ao cadastro/login do Portal.

**Limite de escopo a considerar antes de ampliar o lançamento:** uma conta criada administrativamente após o snapshot, sem nascimento, não é legado e não pode usar o formulário de adoção. Esse caminho de criação foi preservado; o Gnomo permanece bloqueado sem data. Coleta privada adicional no primeiro acesso/administração exige definir esse escopo, não transformar a conta em legado ou contornar a regra.

## Evidência local

Somente identidades sintéticas, SQL real em memória e Chromium local, com APIs interceptadas e rede externa bloqueada no navegador. Os testes do roteador principal usam um substituto apenas para a classe base `DurableObject`, ausente no Node; não instanciam DO nem substituem a lógica de autenticação/pets.

- **296 testes de regressão aprovados**, sem falhas/skip. Cobertura: cadastro, calendário, legado e replay da migração, transações/rollback, sessão/revogação/primeiro acesso/origem, adoção/cuidados/companhia, perfil/chat/privacidade, documentos, cache/PWA e tutorial. Logs em `.local/account-registration/worker-tests.log` e `syntax.log`.
- Matriz de renderização: **24 cenários** (cadastro, legado sem data, conta nova adulta, conta nova menor × 320/390/1440 px × claro/escuro), mais **16 cenários com texto 200%** (320/1440 px × ambos os temas). Zero violações axe WCAG A/AA nos formulários alterados; gênero operado por teclado, foco/descrições, controles de pelo menos 44 px, termos e confirmação de senha preservados, sem rolagem horizontal. Home↔Mascotes no shell também exercitado.
- Dois cenários adicionais confirmam gatos utilizáveis durante consulta de idade retida ou indisponível. Não equivalem a homologação em aparelho físico ou em produção.
- Respostas reais de cadastro/login/me/security/foto/perfil social/chat/catálogo e JWT não contêm nascimento/gênero. O navegador não grava os dados privados em localStorage/sessionStorage. Cadastro inválido, formulário manipulado e declaração repetida não liberam o Gnomo.
- Imagens revisadas diretamente, sem mockup: `.local/account-registration/signup-{320,390,1440}-{light,dark}.png`, `legacy-*.png`, `new-adult-*.png`, `new-minor-*.png` e variantes `-text200.png`. Relatórios `results.json`, `results-text200.json` e `results-signup.json`. Contraste do texto introdutório e do link de login corrigido com CSS limitado ao cadastro.

Reprodução da matriz (dependências de teste podem ficar em `/tmp`, fora do repositório):

```sh
npm install --prefix /tmp/account-browser --cache /tmp/account-npm-cache playwright@1.55.0 @axe-core/playwright@4.10.2
PLAYWRIGHT_PATH=/tmp/account-browser/node_modules/playwright/index.mjs node testing/account-registration/browser.mjs
ACCOUNT_TEXT_SCALE=2 ACCOUNT_WIDTHS=320,1440 PLAYWRIGHT_PATH=/tmp/account-browser/node_modules/playwright/index.mjs node testing/account-registration/browser.mjs
```

## Implantação futura — depende de autorização

1. Confirmar a migração prévia `worker/migrations/pets-private-age.sql` e aplicar **`worker/migrations/account-private-registration.sql`** em janela coordenada com o Worker. O snapshot inicial deve representar as contas existentes antes do corte de cadastro; não deixar o Worker antigo continuar criando contas sem os novos dados durante a troca. O marcador de conclusão torna reexecuções seguras, mas não substitui a coordenação do corte.
2. Publicar Worker e frontend compatíveis, pelos gates de `WORKER-SAFE-DEPLOY.md`. Código novo sem as tabelas recusa o cadastro sem criar conta parcial. Frontend antigo sem gênero será recusado, portanto a atualização deve ser coordenada.
3. A versão do cache estático foi incrementada para `20261015-account-private-1`, pois assets versionados são imutáveis no SW. Roteamento, armazenamento da sessão e lógica do tutorial não foram alterados. Verificar atualização do SW e fluxos de cadastro/legado após o deploy autorizado.
4. Não apagar tabelas ou dados privados em rollback. Reverter apenas para código compatível com coleta obrigatória e a marca de legado; o Worker anterior aceita cadastro sem data e não aplica a nova distinção. Reversão antiga reabre o comportamento substituído.

Nenhuma dessas ações foi executada. Gates de publicação/CI e smoke no ambiente publicado permanecem pendentes de autorização; a evidência acima é local.
