# Menu compacto de ajuda do Canal do Cidadão

Candidata local de 16/10/2026 na branch `feat/citizen-help-compact-20261016`, baseada na `origin/main` `380a40b1a5e58c309151b066fef0b79ec9313489`. A base e os PRs recentes foram conferidos antes do isolamento. Em 16/10 o usuário autorizou criar PR, integrar e publicar após todos os gates; a main remota foi reconferida inalterada. [PR #663](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/663) aberto; integração/publicação aguardam os checks do head corrigido.

## Resultado e escopo

O menu inicial ocupa **232 × 62 px**, ao lado do `?`, com **Iniciar tutorial** em destaque e fechamento por `×` com nome acessível “Fechar ajuda”. Os controles têm pelo menos 44 × 44 px. Em 320/360/390/412 px e desktop, a apresentação inicial deixa livres a ação principal e os atalhos, sem deslocar os componentes da página. Retomar, refazer, registrar conclusão e mensagens de segurança continuam disponíveis. Esses estados também usam o espaço acima da ação principal quando cabe uma linha de controle, com rolagem interna para mensagens longas. Texto ampliado pode aumentar a altura; a região mantém limites e rolagem próprios.

O posicionamento usa a geometria do controle e a viewport visível, inclusive ao rolar, redimensionar e ampliar. Abertura síncrona permite Enter/Tab imediato; fechar ou sair do tutorial devolve o foco. Escape e toque externo funcionam; a carga alternativa também fecha por toque externo. A folha substitui o CSS anterior do painel. O painel fechado não pinta; o aberto só aparece após posicionamento, sem transição de visibilidade que atrase o foco.

Arquivos de produto:

- `css/citizen-tutorial.css`: apresentação somente da entrada/painel de ajuda; estilos do diálogo e destaque amarelo preservados.
- `js/citizen.js`: apresentação inicial, posição/foco/fechamento e versão do carregador.
- `js/citizen-tutorial.js`: marcação/rótulo da entrada, compatibilidade do carregador v5 e callback de reposicionamento antes de devolver foco. Versão de progresso, etapas, segurança, demonstração, persistência e conquista preservadas.
- `js/citizen-mobile-shell.js`: somente a URL versionada do controlador cidadão.
- `cidadao/index.html`: URLs dos recursos afetados e marcador exclusivo da rota.
- `portal-sw.js`: somente esse marcador de HTML; namespaces, política, fallback e demais rotas preservados.
- `scripts/verify-login-publication.mjs`: o smoke público existente compara também HTML, CSS e três controladores da ajuda, nas URLs versionadas desta entrega. Mantém todos os checks antigos e não usa APIs nem sessão.
- `worker/tests/post-login-opening.test.mjs`: dois testes sintéticos do smoke público, incluindo rejeição de CSS anterior; sem rede real.
- `index.html`, `amigos/index.html`, `configuracoes/index.html`, `conquistas/index.html`, `ferramentas/index.html`, `mascotes/index.html`, `notificacoes/index.html`, `perfil/index.html`, `seguranca/index.html`: apenas URL do shell, para navegação interna carregar o controlador novo.

Testes atualizados: `testing/browser/citizen-tutorial-preservation.mjs`, `testing/citizen-cache/cache-policy.test.mjs`, `testing/citizen-layout/citizen-help-existing-account.mjs`, `citizen-html-first-paint.mjs`, `citizen-tutorial-entry.mjs`, `citizen-tutorial-lifecycle.mjs`. Os contratos passam a exigir os novos rótulos/versões exatos. Nenhuma tolerância, máscara, comparação ou asserção de segurança foi relaxada.

## Verificação local

| Verificação | Resultado |
| --- | --- |
| Gate Node direcionado do workflow de tutorial | 89/89 |
| Smoke público ampliado, sucesso e rejeição de CSS antigo, com respostas locais sintéticas | 2/2 |
| Menu: 320/360/390/412/1280, claro/escuro, texto 100/200% | 20/20; repetidos após o ajuste de posição dos estados expandidos |
| Regressão de fonte mais larga, 320 px/200%, claro/escuro, incluindo fonte normal | 4/4; a variante larga falhava antes da correção |
| Refinamento final de espaçamento: 320, texto 200%, claro/escuro | 2/2 adicionais |
| Contas existentes, rota interna, leituras pendentes, falha/repetição do módulo e módulo anterior v4 | 10/10 |
| Tutorial completo, pausa/retomada, rascunho/anexo preservados, conquista somente após 16 etapas, 320/1280 nos dois temas | 4/4 |
| Interrupções, viewport baixa, zoom, teclado, impressão, reload, histórico, troca de conta, logout e helper indisponível | 4/4 |
| Service worker nativo: HTML/menu anterior → recursos novos, claro/escuro | 2/2; zero frames inválidos, assets antigos preservados |
| Controles na investigação local: seis pares de código idêntico, seis entre versões e controle negativo | 13/13 com redesenho; insuficiente no Chromium 140, portanto não libera integração |
| Comparação com main da página nativa: desktop/mobile, tela clara/impressão escura | 4/4; PNGs exatamente idênticos, zero pixels diferentes |
| Renderizações adicionais por toque/clique, incluindo retomada e registro de conclusão com texto 200% | 17/17; contraste mínimo dos controles 10,30:1 |
| Sintaxe dos arquivos JS alterados e `git diff --check` | aprovados |

44 cenários distintos de navegador aprovados; as 17 renderizações adicionais são evidência visual e geométrica. Após a última mudança de posicionamento foram repetidos os 20 casos afetados de geometria, as 17 renderizações e o cenário de recuperação de módulo. O ajuste final reduz o padding horizontal dos botões em 2 px por lado: a palavra “conclusão” inteira passa a caber a 200%. Não muda largura do painel, lógica ou componentes nativos. A posição dos estados expandidos e a rolagem interna foram verificadas também nas renderizações finais. Os resultados de progresso, segurança, histórico e comparação nativa permanecem aplicáveis aos caminhos inalterados; não foram repetidos por ajustes geométricos.

Capturas reais do Chromium foram inspecionadas, incluindo antes/depois, cinco larguras, claro/escuro, foco, texto 200%, viewport curta, retomada, conclusão e carga alternativa. A amostragem de pinturas rejeita painel visível fechado, antes de posicionado, acima da largura contratada ou sem ícone. Os testes geométricos verificam limites da viewport, clipping do cabeçalho, alvos por hit-test, foco e ausência de sobreposição com ações na apresentação inicial e nos estados expandidos quando há espaço para uma linha de controle.

A correção do PR #662 permanece byte a byte intacta em `dark-audit-base-comparison.mjs` e `playwright-dark-audit.config.mjs`. `check-capture-preparation.mjs` mantém preparação, assertivas e tolerâncias; acrescenta somente metadados de falha e um pequeno recorte exato dos PNGs originais ao log, sem mudar aceitação ou artefatos integrais.

## Estado do PR e bloqueio de integração

O PR #663 foi criado após autorização do usuário. A correção funcional de Ajuda passou no Chromium 140 do CI: 22 casos de geometria/fontes, contas existentes, percursos completos, progressão automática e ciclo de vida. Os demais gates aplicáveis foram aprovados nos heads anteriores, exceto a auditoria visual; confirmar a contagem do último head no próprio PR.

O primeiro gate encontrou sobreposição em 320 px/200%. A transição global de 1 ms afetava o `margin-top` do rótulo: a medição podia ler uma posição intermediária. Uma fonte sintética mais larga reproduziu a falha local sem relaxar a asserção. `transition:none!important` somente em `.tutorial-help-label` estabilizou a margem (0 px incorreto → 41 px) e eliminou as interseções. Os quatro casos dirigidos passaram localmente e a matriz obrigatória de 22 passou no CI.

**Integração e publicação continuam bloqueadas pelo controle de repetibilidade de `/medico/` com código idêntico.** O diagnóstico do CI mostra 755 pixels com delta máximo de 1 canal, zero diferenças de estilo/layout e snapshots estáveis, restritos ao blur do botão de IA. Os pixels limitados do log foram inspecionados. Uma reprodução local também mostrou divergência no mesmo blur entre versões (até 5.386 pixels/delta 3). Não há alteração de produto em `/medico/`.

Uma preparação por rolagem/readback passou nos 13 controles locais, incluindo os 12 PNGs positivos exatos e a rejeição da alteração vermelha (93 pixels/delta 255), mas não resolveu o Chromium 140 do CI. Foi retirada. Fixar sRGB e desativar PaintHolding também falhou localmente e foi retirado. A configuração e o comparador do PR #662 foram restaurados integralmente. Não houve mudança de thresholds, máscaras, efeitos, viewports, controle negativo ou asserções para obter aprovação.

O proxy bloqueia o download local do Chromium 140 (403), dos ZIPs de artefatos e o acesso HTTP direto ao domínio público. O diagnóstico por log permitiu investigar a falha, mas o bloqueio de repetibilidade permanece real; não foi dispensado nem repetido até obter um verde fortuito. A main remota permaneceu em `380a40b1` durante a investigação. Nenhum merge ou deploy produtivo foi realizado.

O smoke público existente foi ampliado para exigir os cinco recursos críticos da ajuda, com hashes exatos e sem sessão. Duas regressões sintéticas confirmam sucesso e recusa de CSS antigo. Após uma futura integração aprovada, o workflow existente o executará no push da main; nenhuma permissão/configuração de publicação mudou. O recibo `PUBLICATION_OK` permanece obrigatório para declarar os recursos entregues.

## Evidências e reprodução

Artefatos ignorados pelo Git, no workspace:

- `.local/citizen-help-review/citizen-help-review.pdf`: seleção de capturas sem edição dos pixels das screenshots.
- `.local/citizen-help-review/review.html`, `renders.json` e `render.mjs`: galeria, medidas/contraste e captura reproduzível.
- `.local/citizen-help-review/logs/`: logs das execuções.
- `.local/citizen-help-before/`: reprodução da main antes da alteração.
- `.local/citizen-help-final/entry.json`: matriz final, com amostras de pinturas; `.local/citizen-help-final-padding/entry.json` preserva a checagem dirigida anterior de texto ampliado.
- `.local/citizen-help-recovery-final/existing-account.json`, `.local/citizen-help-existing/existing-account.json`, `.local/citizen-help-completion/results.json`, `.local/citizen-help-lifecycle/lifecycle.json`, `.local/citizen-help-cache/results.json`.
- `testing/browser/test-results-citizen-help/`: PNGs, snapshots e relatórios das quatro comparações com main.

Comandos executados a partir da raiz (Chromium local em `/usr/bin/chromium`):

```bash
node --test worker/tests/portal-tutorials.test.mjs worker/tests/portal-performance.test.mjs worker/tests/home-transition-security.test.mjs worker/tests/account-first-access-ui.test.mjs worker/tests/portal-interactions.test.mjs testing/citizen-cache/cache-policy.test.mjs
TUTORIAL_OUTPUT=.local/citizen-help-final node testing/citizen-layout/citizen-tutorial-entry.mjs
ENTRY_WIDTHS=320 ENTRY_SCALES=2 TUTORIAL_OUTPUT=.local/citizen-help-final-padding node testing/citizen-layout/citizen-tutorial-entry.mjs
HELP_CASES=module-failure-retry TUTORIAL_OUTPUT=.local/citizen-help-recovery-final node testing/citizen-layout/citizen-help-existing-account.mjs
TUTORIAL_OUTPUT=.local/citizen-help-existing node testing/citizen-layout/citizen-help-existing-account.mjs
WIDTHS=320,1280 SCALES=1 TUTORIAL_OUTPUT=.local/citizen-help-completion node testing/citizen-layout/citizen-tutorial.mjs
TUTORIAL_OUTPUT=.local/citizen-help-lifecycle node testing/citizen-layout/citizen-tutorial-lifecycle.mjs
HTML_CACHE_MODES=pre-help STARTUP_OUTPUT=.local/citizen-help-cache node testing/citizen-layout/citizen-html-first-paint.mjs
node .local/citizen-help-review/render.mjs
```

A comparação estrita foi executada em `testing/browser` com `DARK_AUDIT_ROUTES=/cidadao/ DARK_AUDIT_COMPARE_BASE=1 DARK_AUDIT_OUTPUT_DIR=test-results-citizen-help` e `playwright test -c playwright-dark-audit.config.mjs portal-dark-preservation.spec.mjs --grep 'preserve.* /cidadao/'`. `PLAYWRIGHT_BROWSERS_PATH` apontou a um diretório temporário contendo link para o Chromium instalado, sem editar a configuração do gate.

## Limites e próxima ação

Todos os usuários, textos, arquivos e respostas de API são sintéticos/interceptados. Sem SQL em banco, alteração de permissões, manifestação real ou upload de anexo ao servidor. Sem credenciais produtivas. A imagem da Library não foi necessária: a descrição fornecida foi reproduzida na main local.

Validação em Chromium Linux; não substitui aparelho físico nem validação de Safari/Firefox. A autorização de integração/publicação está registrada no PR #663. Próximo passo: resolver o controle de repetibilidade preservando a sensibilidade do gate, exigir todos os checks do head final, e somente então integrar e confirmar os recibos/recursos públicos. O acesso HTTP direto ao domínio produtivo foi bloqueado pelo proxy do executor (CONNECT 403); registrar esse limite se persistir após a implantação.
