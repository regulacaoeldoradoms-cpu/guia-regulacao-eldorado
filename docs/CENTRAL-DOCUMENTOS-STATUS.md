# Central de Documentos — Status

Última atualização: 15/09/2026

## Fase atual

**Fase 3 — Editor PDF essencial**

Subfase atual: **3C.3 — objetos sobre página: Escrever + Colar imagem, tecnicamente validada e aguardando homologação humana final no PR #179**. O Organizar V2 foi aceito visualmente pelo usuário e permanece como checkpoint concluído dentro da Fase 3. Recortar é a próxima unidade (3C.4) somente após homologação da 3C.3; Desenhar/Borracha permanece para 3C.5 e flatten/exportação local para 3C.6. **Não fazer merge nem escrever no Google Drive nesta fase.**

## Handoff para o próximo chat — 3C.3, registro vigente

Este bloco prevalece sobre os handoffs históricos abaixo.

- **Fase atual:** Fase 3 — Editor PDF essencial.
- **Subfase / objetivo atual:** 3C.3 — Escrever + Colar imagem. A implementação está tecnicamente verde; falta somente homologação humana final do fluxo contextual de texto/RGB e dos gestos em aparelho real.
- **Main:** `5859b77fc80e17ffdf98f9e6fb3fa34bc37721c3`, confirmada em 15/09/2026 e mantida intacta.
- **Branch atual:** `codex/central-docs-editor-superficie-unica`.
- **PR atual:** #179 — aberto, mergeável, sem merge.
- **Último commit funcional validado:** `8596a2d92937cae3c0357f123e61ec1f50bbf257`.
- **Última ação concluída:** substituição do seletor nativo de cor por painel RGB/HEX próprio, mantendo a abertura acima da paleta e adicionando movimentação por alça inferior direita, fechamento por × e preservação da posição movida durante a sessão.
- **Paleta contextual:** preto, branco, vermelho, azul, verde e amarelo permanecem como slots iniciais; `+` cria slot novo até o limite de 16; selecionar slot + RGB/HEX substitui exatamente aquele slot; o painel acompanha o slot ativo; duplicatas são permitidas porque a posição do slot é significativa.
- **Escrever / Selecionar:** enquanto uma caixa está em edição, clique nela não cria outra caixa; clique fora confirma e consome o gesto; Selecionar não permite editar o conteúdo, mas mantém cor, A−, A+ e lixeira; clique fora desmarca.
- **Objetos:** texto e imagem overlay continuam vinculados por `pageId`, com mover, resize, transformação SE (escala + rotação), rotação dedicada, opacidade, transferência entre páginas e Undo/Redo local.
- **Miniaturas / desempenho:** Organizar ↔ Escrever preserva lazy loading por `IntersectionObserver`; documento sintético maior comprova que a troca de modo não materializa todas as miniaturas.
- **Checks e testes:** no head funcional `8596a2d...`, **24/24 workflows verdes**. O Playwright concluiu **51 passed / 1 skipped esperado**, incluindo a barra contextual/paleta em desktop e mobile. Não há threads de review não resolvidos.
- **Staging sintético:** deployment imutável do head funcional: `https://b92136d4.portal-regulacao-central-staging.pages.dev/`; alias da branch: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`.
- **Segurança / privacidade:** staging somente com dados fictícios; nenhuma escrita no Drive; nenhum backend novo; nenhuma telemetria de texto, imagem, nome de arquivo, fileId ou coordenadas; nenhum segredo no frontend.
- **Decisões tomadas:** o seletor nativo do navegador foi descartado para esta interação porque sua janela não pode ser reposicionada/arrastada de forma controlada pelo Portal. O painel próprio mantém o mesmo propósito com comportamento previsível e testável.
- **Alternativas descartadas:** deslocar apenas a âncora do picker nativo e manter a janela do navegador; isso não atendia ao requisito de mover livremente a janela e continuava sujeito a sobreposição não controlável.
- **Não feito:** merge, alteração da main, deploy de produção, escrita no Drive, mudança destrutiva, uso de documento real ou implementação de Recortar/Desenhar/flatten.
- **Riscos conhecidos:** Cloudflare Access ainda não protege o staging, portanto somente dados sintéticos; automação mobile não substitui totalmente o teste touch em aparelho físico.
- **Gate:** 3C.4 — Recortar continua bloqueada até o aceite humano da 3C.3.
- **Próxima ação exata:** o usuário deve homologar no preview `b92136d4...` o painel RGB (abrir, mover pelo puxador, fechar/reabrir, editar slot e criar slot com +) e, se possível, repetir abrir/mover/fechar em celular físico. Se aprovado, registrar o aceite e liberar 3C.4.
- **Arquivos e fontes principais:** Guia Mestre V1.1; `docs/CENTRAL-DOCUMENTOS-STATUS.md`; `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-V1.md`; PR #179; `js/document-viewer.js`; `testing/browser/central-docs-objects.spec.mjs`.

## 3C.3 — painel RGB arrastável finalizado tecnicamente — 15/09/2026

A rodada encerrou o adendo visual/funcional da paleta sem Codex e sem ampliar o escopo da fase.

- o picker nativo foi substituído por componente próprio RGB/HEX, permitindo movimento real pelo puxador inferior direito;
- o painel abre acima da paleta, pode ser fechado por × e conserva a posição movida enquanto a barra contextual existir;
- a movimentação usa Pointer Events e limites calculados sobre a área útil do viewer durante o gesto, evitando que o painel seja arrastado para uma posição inacessível;
- selecionar outro slot com o painel aberto sincroniza imediatamente RGB/HEX; `+` cria e seleciona o slot novo; reabrir o painel usa o slot ativo;
- foram corrigidas regressões encontradas pela própria automação durante a implementação, incluindo captura de pointer events, sobreposição de controles e escopo dos helpers de posicionamento;
- o teste foi ajustado para validar comportamento real em desktop/mobile, inclusive fechar o painel antes de acessar controles encobertos e reabrir na posição persistida;
- head funcional final: `8596a2d92937cae3c0357f123e61ec1f50bbf257`;
- CI: **24/24 workflows verdes**;
- navegador: **51 passed / 1 skipped esperado**;
- preview imutável: `https://b92136d4.portal-regulacao-central-staging.pages.dev/`;
- review: nenhum thread não resolvido;
- main permanece em `5859b77fc80e17ffdf98f9e6fb3fa34bc37721c3`;
- nenhuma escrita no Drive, merge ou avanço para 3C.4.

Resultado: a 3C.3 está **tecnicamente pronta para homologação humana final**. A próxima intervenção necessária é somente o aceite visual/touch do usuário; não há outra correção técnica conhecida bloqueando o teste humano.

## 3C.3 — microajuste visual do seletor RGB — 15/09/2026

Durante a homologação humana, o usuário confirmou o funcionamento de `+` e `RGB`, mas observou que o seletor nativo de cor abria sobre a primeira linha da paleta, impedindo selecionar/editar os slots superiores enquanto a janela estivesse aberta.

Correção aplicada:
- a âncora invisível do `input[type="color"]` foi deslocada **52 px acima** da paleta e 10 px da borda direita;
- o seletor nativo continua sendo aberto por `showPicker()`/fallback `click()`, sem substituir o componente do navegador;
- a mudança é apenas de posicionamento da âncora: não altera slots, persistência, histórico, conteúdo do texto ou permissões;
- o teste Playwright da paleta passou a verificar que a âncora do picker fica pelo menos 20 px acima da paleta;
- head funcional `b95914d8d7bf4a7086b280e543abae4a7a0efba2`: **24/24 workflows verdes**, Playwright **51 passed / 1 skipped esperado**;
- preview imutável: `https://547ebcd7.portal-regulacao-central-staging.pages.dev/`;
- nenhuma escrita no Drive, merge, alteração da main ou avanço para 3C.4.

## 3C.3 — correções finais de paleta e P2s — 15/09/2026

Rodada concluída diretamente no PR #179, sem merge e sem tocar a main:

- **Paleta contextual:** o botão `+` agora cria imediatamente um novo slot visível e selecionado, até o limite de 16 slots. O novo slot nasce com a cor atual apenas como valor inicial e fica pronto para ser substituído pelo RGB.
- **RGB/HEX:** o botão `RGB` chama `showPicker()` quando suportado e usa `click()` como fallback. A cor escolhida substitui exatamente o slot selecionado; se o slot veio do `+`, ele é preenchido pela nova cor. Duplicatas de cor são permitidas porque a posição do slot é significativa.
- **Persistência por conta:** gravações de paleta foram serializadas por `editorPaletteWriteChain`; PATCHes de paleta inteira não podem mais concluir fora de ordem. `editorPaletteWriteGeneration` impede que falha antiga substitua o feedback da alteração mais recente.
- **Saída do editor:** `setEditorObjects([], { mode: 'none', selectedObjectId: '' })` é executado antes de descartar a sessão. Isso devolve `data-object-mode=none` e `pointer-events:none` à camada de objetos mesmo ao sair sem mutação.
- **Transparência:** a opacidade passou do wrapper interativo para `--object-opacity`, aplicada somente ao texto/imagem. Borda, handles, rotação e quickbar permanecem 100% visíveis.
- **Quickbar entre caixas:** a barra contextual acompanha a seleção imediatamente e não permanece presa ao objeto anterior.
- **Histórico do seletor de cor:** eventos intermediários de `input` continuam como preview com `commit:false`; o gesto é consolidado em uma única mutação no `change`.
- **Testes:** Playwright passou com **51 casos aprovados e 1 skip esperado**, incluindo os novos cenários em desktop e mobile.
- **CI:** **24/24 workflows verdes** no head funcional `633a568c50a4e87234305d024cc62f1c2d40f1e2`.
- **Review:** todos os cinco threads P2 da rodada foram respondidos com evidência e resolvidos.
- **Staging:** preview imutável funcional `https://a475ca05.portal-regulacao-central-staging.pages.dev/`.
- **Segurança/governança:** nenhuma escrita no Drive, nenhum merge, nenhuma mudança na main, nenhum deploy de produção e nenhum avanço para 3C.4.

Decisão: a 3C.3 volta a depender apenas da **homologação humana final**. Se o fluxo da paleta e os demais pontos acima forem aprovados, registrar o aceite e somente então liberar 3C.4 — Recortar.

## 3C.3 — revisão pós-homologação e fila para Codex — 15/09/2026

- o usuário aprovou visualmente o novo comportamento do modo Selecionar;
- o review encontrou P2 na migração da quickbar entre duas caixas; a implementação atual de `markSelectedObject()` já remove a barra anterior e cria a nova, e foi acrescentada regressão Playwright com duas caixas;
- o review encontrou P2 no seletor RGB da barra superior: eventos `input` enchiam o histórico. O cliente agora faz preview/model update com `commit: false` e consolida uma única mutação no `change`, com `blur` como fallback;
- head `9725a0c`: 24/24 workflows verdes; Playwright 49 passed / 1 skipped esperado;
- surgiu um P2 adicional ainda aberto: persistência da paleta por conta pode sofrer corrida entre PATCHes completos feitos em sequência. A correção deve serializar/coalescer as gravações ou rejeitar conclusões obsoletas por geração;
- o review abriu também um P2 de saída do editor: ao sair sem mutação depois de Select/Write/Image, o viewer pode conservar `data-object-mode` e a camada de objetos continuar interceptando ponteiro/touch. O modo de objetos deve ser limpo antes de descartar `editorSession`;
- esses dois P2s são agora o melhor ponto de retomada pelo Codex. Os dois P2s anteriores (quickbar e histórico do seletor de cor) já têm correção/teste no head funcional `9725a0c`, mas os threads ainda devem ser conferidos e fechados. Não iniciar 3C.4 antes de fechar a revisão da 3C.3.

## 3C.3 — adendo humano: Selecionar protege o conteúdo do texto — 15/09/2026

Durante a homologação humana, foi acrescentado um requisito de interação para a caixa de texto. A 3C.3 foi reaberta tecnicamente sem avançar para Recortar.

- no modo **Selecionar e mover**, clicar na caixa seleciona o objeto, mas não permite editar o conteúdo textual; inclusive duplo clique é ignorado para edição enquanto o modo não for Escrever;
- a caixa selecionada continua expondo os atalhos contextuais já definidos: cor, A−, A+ e lixeira, preservando alterações de aparência e exclusão;
- ao clicar fora da caixa, o estado atual é confirmado e a caixa deixa de ficar selecionada; no modo Escrever esse primeiro clique externo é consumido para não criar outra caixa acidentalmente;
- foi corrigido também o contrato de `selectedObjectId`: valor vazio explícito agora realmente limpa a seleção em vez de reaproveitar a seleção anterior;
- a barra contextual passa a acompanhar a seleção sem reconstruir toda a camada de objetos;
- foi renovado o versionamento dos assets (`document-viewer.js?v=20260915-8`, `documents.js?v=20260915-5`) e do cache do Portal (`20260915-6`) para impedir que o navegador continue servindo o comportamento antigo;
- não houve merge, escrita no Drive, deploy de produção, telemetria de conteúdo ou avanço para 3C.4.

Decisão descartada: não tornar o texto editável no modo Selecionar nem aproveitar o clique externo de confirmação para criar uma nova caixa. A separação é deliberada para evitar alterações acidentais do conteúdo.

Validação desta atualização: os primeiros dois ciclos do Playwright apontaram um falso negativo do próprio teste porque o clique de confirmação era suprimido/medido em coordenadas inadequadas logo após o arraste. O runtime foi ajustado para que a supressão pós-arraste se aplique somente ao clique no objeto, nunca ao clique externo. No head final `29077e4`, o workflow de navegador passou com 47 casos aprovados e 1 skip esperado. Pendência restante: somente homologação humana no preview sintético atual.

## 3C.3 — adiantamento técnico enquanto Codex estava indisponível — 15/09/2026

A rodada foi executada diretamente no PR #179, sem tocar a main:

- corrigido o P2 de performance das miniaturas, preservando o lazy loading baseado em `IntersectionObserver`;
- mantido o fallback completo apenas para navegadores sem `IntersectionObserver`;
- alinhada a interação da imagem ao requisito humano original: a alça inferior direita combina escala + rotação, sem remover o controle dedicado de rotação;
- adicionados testes de regressão para a transformação combinada e para a troca de modo com documento maior;
- a documentação de homologação passou a conter a matriz completa da 3C.3 e a preparação das unidades seguintes, sem autorizar sua implementação antecipada.

Resultado: o CI confirmou a rodada sem regressão conhecida: 24/24 workflows verdes e Playwright 43 passed / 1 skipped (skip exclusivo do teste touch no projeto desktop; mobile aprovado). O deployment imutável `11589904...` foi publicado com sucesso. A fila restante é **homologação humana da 3C.3**; não há justificativa para iniciar Recortar antes desse gate.

## Estado de entrada

- Branch da Fase 1 criada da `main` pós-Fase 0 em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A main já contém a observabilidade segura do PostHog para o Portal.
- No estado de entrada da Fase 1 ainda não existia integração Google Drive funcional; ela passou a ser implementada nesta branch.
- O arquivo de status foi criado na Fase 0 e agora é o ponto obrigatório de continuidade.
- Há PR antigo de Telemedicina aberto (#107), sem relação com a Central; não deve ser misturado a este trabalho.
- PR #133 da Fase 0 foi validado com 21 workflows sem falhas e mesclado na main em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A arquitetura da Fase 0 está encerrada. O código read-only da Fase 1 foi validado e mesclado na `main` pelo PR #134 em `3dc50afd3ba902d36ebe806176ad0939d71c9379`.

## Branch / PR

Branch atual: `codex/central-docs-editor-superficie-unica`, inicialmente criada de `7c25797d2a5c73aa389f064c35b95a3b67b6e0ba` e atualizada por rebase sobre a `origin/main` real `5859b77fc80e17ffdf98f9e6fb3fa34bc37721c3`.

PR atual: [#179 — Central de Documentos: unificar visualizador e editor PDF](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/179), aberto e sem merge. PR #175 (infraestrutura de staging) e PR #173 (compatibilidade do visualizador) permanecem como histórico já publicado.

## 3C.1 — P1 corrigido e validação pós-rebase — 14/09/2026

Este registro substitui as referências de base, contagens e preview da homologação anterior para a revisão final do PR #179.

P1 encontrado no review:

- [comentário Codex #4006168373](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/179#discussion_r4006168373): uma abertura antiga podia terminar a conversão de Blob ou o carregamento do PDF.js depois de uma nova e reassumir `active`, misturando título/estado do documento novo com canvases antigos;
- a causa estava dentro de `PortalPdfViewer.open()`: a sessão ativa era fechada antes da preparação assíncrona, mas a atribuição posterior de `active` não verificava qual chamada ainda era atual;
- a correção foi publicada no commit `0d0782d94534e6e376205e86952868f06254e874`.

Correção generation-aware:

- cada chamada de `open()` recebe geração/token próprio e um sinal de cancelamento;
- os awaits do módulo PDF.js, de `Blob.arrayBuffer()` e da loading task competem com esse sinal; uma chamada obsoleta retorna `null` e não assume `active`;
- o encerramento de uma sessão antiga cancela somente suas render/loading tasks, desconecta seus observers/listeners e zera seus canvases; os roots compartilhados só são limpos quando a sessão ainda é proprietária da superfície;
- `close()` invalida também aberturas pendentes, e renderizações, observers, timers, callbacks e eventos de miniatura revalidam a sessão;
- exceções síncronas de `getDocument()` passam pelo mesmo cleanup;
- o visualizador continua sem criar Blob URLs próprias; a propriedade das URLs permanece com o chamador;
- o versionamento do asset passou a `document-viewer.js?v=20260914-4`; `.gitattributes` conserva os bytes de `pdf-lib.min.js` para evitar quebra do SRI por conversão de fim de linha no Windows.

Sincronização com a main:

- `git fetch origin` executado; `origin/main` confirmada novamente em `5859b77fc80e17ffdf98f9e6fb3fa34bc37721c3` (Telemedicina: histórico longitudinal visual V40);
- rebase concluído, com essa main como ancestral; o conteúdo publicado pela API GitHub foi conferido pelo tree SHA `473dc4ccb39c79b57dd129a65add5223881f047b`, idêntico à árvore local testada;
- conflitos de cache resolvidos preservando `20260914-4`, que já vinha da main;
- `account-first-access-ui.test.mjs` permaneceu idêntico à main; `portal-sw.js`, `documents-ui.test.mjs` e `portal-performance.test.mjs` preservam integralmente as mudanças recentes de Telemedicina;
- as correções auxiliares de caminho nos testes usam `fileURLToPath` para executar a suíte no Windows, sem alterar comportamento do Portal.

Validações pós-rebase:

- suíte Worker completa: **135/135 aprovada**, incluindo Telemedicina V40; `npm run check`, sintaxe JavaScript e `git diff --check` aprovados;
- Playwright local: **12/12 aprovado**, sem retry, em Chromium desktop e Pixel 7;
- os dez cenários anteriores de visualizador/editor permanecem **10/10**; a corrida acrescenta **2/2** (desktop/mobile);
- teste determinístico A → B: A é retido durante a conversão do Blob, B termina primeiro e A é liberado depois; A retorna `null`, sem alterar identidade ou pixels dos canvases/miniaturas de B, página ativa, zoom ou callbacks;
- teste B → C: B é retido em uma loading task, C vence e B é cancelado; C permanece proprietário da superfície, sem callbacks obsoletos;
- os snapshots aguardam a renderização preguiçosa e o scroll do vencedor estabilizarem antes de liberar a abertura antiga;
- build `node scripts/build-central-docs-staging.mjs` aprovado;
- GitHub Actions do commit funcional: **24/24 workflows concluídos com sucesso**;
- Playwright remoto no novo deployment imutável abaixo: **12/12 aprovado**, sem retry;
- inspeção visual real em desktop `1440 × 900` e mobile `412 × 915`: selo **DADOS FICTÍCIOS**, três páginas/miniaturas, entrada e saída na mesma superfície, mover, excluir, adicionar imagem, unir PDF, navegação e zoom;
- no mobile, zoom passou de `52%` para `67%`; Ajustar largura retornou a `52%`; a miniatura 2 mostrou a página paisagem;
- o DOM confirmou `editorInsideViewer: true`, `nativeViewers: 0` e `textualEditorLists: 0`; console sem warning/error.

Preview Cloudflare Pages pós-rebase:

- projeto: `portal-regulacao-central-staging`;
- deployment imutável funcional: [f23269b1](https://f23269b1.portal-regulacao-central-staging.pages.dev/);
- ID: `f23269b1-a1c2-4bd2-84d6-26c9a4f7c6d4`;
- commit: `0d0782d94534e6e376205e86952868f06254e874`;
- alias da branch: [preview da 3C.1](https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/);
- ambiente `preview`, clone/build/deploy em `success`, `uses_functions: false` e `env_vars: {}`;
- HTTP 200, `Cache-Control: no-store`, `X-Robots-Tag: noindex, nofollow, noarchive` e `robots.txt` com `Disallow: /`;
- CSP preserva `connect-src 'self'`, `script-src 'self'`, `frame-src 'none'`, `object-src 'none'` e `frame-ancestors 'none'`;
- manifesto confirma `syntheticOnly: true`, `productionApisIncluded: false` e o SHA exato do deployment;
- nenhuma requisição ao Worker de produção, Google APIs/Drive/OAuth ou `/api/`; nenhum D1, documento clínico ou dado institucional no bundle.

Review, riscos e próximo passo:

- o P1 foi respondido com causa, correção e evidências e a thread `PRRT_kwDOSN6RU86iJZI4` foi efetivamente marcada como resolvida no GitHub;
- PR #179 permanece aberto, aguardando **revisão final humana antes do merge**; nenhuma operação de merge foi executada;
- produção, Worker `yellow-wave-d0a1guia-regulacao-ia` e D1 `portal-regulacao-users` permaneceram intocados;
- Access e domínio personalizado continuam pendentes; o preview público só pode conter dados sintéticos;
- o laboratório usa os componentes reais com orquestração sintética; o fluxo institucional completo ainda exige reteste autorizado após eventual merge/deploy;
- **não iniciar 3C.2** até o aceite explícito da integração visual da 3C.1.

## Histórico: 3C.1 — primeira homologação da superfície única — 14/09/2026

Controle de versão e escopo:

- `origin/main` foi atualizada e confirmada em `7c25797d2a5c73aa389f064c35b95a3b67b6e0ba` antes das alterações; esse commit é descendente da referência esperada `313101db4b6fb34ea503205e6cfa55a1c71864f8`;
- implementação isolada na branch `codex/central-docs-editor-superficie-unica`;
- nenhum merge, deploy ou alteração de configuração foi feito na produção;
- Worker `yellow-wave-d0a1guia-regulacao-ia` e D1 `portal-regulacao-users` permaneceram intocados;
- a 3C.2 e qualquer drag-and-drop de páginas não foram iniciados.

Implementação funcional:

- `#documentsEditor` passou a ficar dentro de `#documentsCustomViewer`, na mesma superfície controlada pelo Portal;
- entrar no editor preserva o mesmo root, os mesmos canvases de página, as mesmas miniaturas, a página ativa, o zoom e o modo Ajustar largura;
- ações de mover para cima/baixo e excluir ficam associadas às próprias miniaturas;
- excluir, mover, unir PDF e adicionar imagem reconstroem o PDF local na mesma superfície PDF.js;
- a lista textual paralela deixou de existir como editor principal;
- sair sem alterações apenas remove os controles; sair depois de alterações restaura o PDF original no mesmo root e em modo somente leitura;
- não existe fallback para `iframe`, `embed`, `object` ou visualizador nativo;
- `pdf-lib` 1.17.1 passou a ser self-hosted em `vendor/pdf-lib/`, mantendo SRI e eliminando a dependência de CDN;
- operações assíncronas são bloqueadas/serializadas durante a reconstrução, ciclos obsoletos não podem fechar um visualizador mais novo e o foco volta à miniatura pertinente depois de mover/excluir.

Laboratório e isolamento:

- o laboratório remoto usa somente o PDF sintético de três páginas e uma imagem sintética gerada em memória;
- não inclui `documents.js`, autenticação, Pages Functions, bindings, variáveis ou secrets; essa separação evita qualquer acesso acidental a backend institucional;
- o builder rejeita referências ao Worker/D1 de produção, `/api/documents/`, Google APIs, Google Drive, Google OAuth e CDN do `pdf-lib`;
- `staging-manifest.json` agora usa `CF_PAGES_COMMIT_SHA` no Pages, com fallback para `GITHUB_SHA` no CI.

Preview Cloudflare Pages aprovado:

- projeto: `portal-regulacao-central-staging`;
- branch: `codex/central-docs-editor-superficie-unica`;
- alias: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`;
- deployment funcional imutável: `https://dfe80b5e.portal-regulacao-central-staging.pages.dev/`;
- ID: `dfe80b5e-810b-45e2-acc4-638adbdc1391`;
- commit do deployment: `67c9544ce22a849e60af20a245f76550aae61974`;
- clone, build e deploy concluíram com sucesso; `uses_functions: false` e `env_vars: {}` confirmados pela API Cloudflare.

Testes automatizados:

- suíte completa do Worker: **133/133 aprovada**;
- `npm run check`: aprovado;
- Playwright local: **10/10 aprovado** em Chromium desktop e mobile;
- primeira execução remota: **7/10**, revelando que um callback já agendado do `ResizeObserver` podia sobrescrever o zoom manual;
- correção aplicada: o callback revalida `fitMode`, sessão ativa e ciclo antes de executar Ajustar largura;
- segunda execução no deployment corrigido: **10/10 aprovada** em desktop e mobile, sem retry;
- cobertura: abertura do PDF, entrada/saída do editor, identidade da superfície, ausência de lista textual/viewer nativo, zoom, Ajustar largura, miniaturas, mover, excluir, undo/redo, adicionar imagem, unir PDF, restauração do original e bloqueio de rede proibida.

Validação visual real no preview:

- selo **DADOS FICTÍCIOS** visível e PDF.js 6.3.289 pronto com exatamente três páginas;
- página principal e três miniaturas renderizadas;
- modo editor exibido dentro do mesmo `pdfRoot`, sem segundo visualizador;
- zoom mobile alterado de `47%` para `62%` e Ajustar largura retornou a `47%`;
- navegação pela miniatura 2 mostrou a página sintética paisagem;
- mover a página 2 para o início atualizou miniatura e página principal;
- excluir reduziu página principal/miniaturas de três para duas;
- adicionar imagem voltou a três páginas e mostrou a página azul **DADOS FICTÍCIOS**;
- sair do editor restaurou leitura, três páginas originais e miniaturas sem controles de edição;
- breakpoint desktop validado em `1440 x 900` e mobile validado no viewport estreito do navegador de homologação;
- DOM real confirmou `editorInsideViewer: true`, `nativeViewers: 0` e `textualEditorLists: 0`;
- nenhum erro ou warning foi registrado no console durante a inspeção.

Headers e rede no deployment corrigido:

- HTTP `200`, `Cache-Control: no-store` e `X-Robots-Tag: noindex, nofollow, noarchive`;
- `robots.txt`: `User-agent: *` e `Disallow: /`;
- CSP: `connect-src 'self'`, `script-src 'self'`, `frame-src 'none'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'` e `frame-ancestors 'none'`;
- `staging-manifest.json`: `syntheticOnly: true`, `productionApisIncluded: false` e `sourceSha: 67c9544ce22a849e60af20a245f76550aae61974`;
- nenhuma requisição para o Worker de produção, Google APIs/Drive/OAuth, rota `/api/` ou recurso D1;
- nenhum dado institucional ou documento clínico foi usado.

Riscos e pendências:

- Cloudflare Access continua pendente; o preview é público e deve permanecer restrito a validação técnica com dados sintéticos;
- domínio personalizado continua pendente porque a zona `regulacaoeldoradoms.com.br` não está acessível nesta conexão;
- o laboratório testa os componentes reais `PortalPdfViewer` e `PortalPdfEditor`, mas usa uma orquestração sintética própria para não carregar autenticação/Drive; o controlador `documents.js` tem cobertura estática e de modelo, e ainda exige reteste real autorizado após merge/deploy;
- a aceitação da 3C.1 não autoriza iniciar 3C.2 automaticamente.

Próximo passo exato:

1. abrir a PR desta branch e aguardar os workflows obrigatórios;
2. revisar o preview pelo alias acima e registrar o aceite humano da superfície única;
3. somente após merge/deploy, fazer reteste real autorizado com PDF institucional, incluindo entrada/saída do editor e todas as mutações da 3C.1;
4. manter a 3C.2 bloqueada até esse aceite explícito;
5. tratar Access e domínio personalizado em tarefa separada, com as decisões humanas já registradas.

## Homologação remota Cloudflare Pages criada e validada — 14/09/2026

Controle de versão confirmado antes da criação:

- repositório: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`;
- `main` remota confirmada duas vezes em `313101db4b6fb34ea503205e6cfa55a1c71864f8`;
- o primeiro deployment de produção do projeto de staging foi construído exatamente desse commit.

Projeto Cloudflare criado:

- nome: `portal-regulacao-central-staging`;
- ID do projeto: `f9937ede-dc00-42a0-8207-581d39a04de9`;
- URL canônica: `https://portal-regulacao-central-staging.pages.dev/`;
- deployment inicial imutável: `https://fbb103cb.portal-regulacao-central-staging.pages.dev/`;
- ID do deployment inicial: `fbb103cb-e043-4c8a-9fa0-226dadc5a0c9`;
- origem GitHub: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`;
- branch de produção deste projeto de staging: `main`;
- build command: `node scripts/build-central-docs-staging.mjs`;
- output directory: `dist-staging`;
- deployments de produção e previews habilitados;
- previews configurados para todas as branches, com comentários em Pull Requests habilitados.

Isolamento confirmado:

- nenhuma variável de ambiente, secret ou binding foi configurado nos ambientes de produção ou preview do projeto Pages;
- bindings de D1, KV, R2, Service e Workers AI permanecem vazios;
- o projeto não usa Pages Functions;
- o Worker de produção `yellow-wave-d0a1guia-regulacao-ia` e o D1 de produção `portal-regulacao-users` não foram modificados, reiniciados, redeployados ou vinculados;
- não foi criado Worker nem D1 de staging porque o bundle é integralmente estático e sintético.

Cloudflare Access e domínio:

- **Access: pendente**. Os endpoints específicos retornaram `access.api.error.not_enabled`; habilitar Access exigiria inicializar a organização da conta e decidir `auth_domain`, provedor de identidade, pessoas/domínios autorizados, duração de sessão e eventual MFA;
- nenhuma dessas decisões foi improvisada e nenhuma configuração Zero Trust/Access foi alterada;
- enquanto Access permanecer pendente, a URL `pages.dev` está pública e deve ser usada somente para validação técnica do conteúdo sintético;
- **domínio personalizado: pendente**. A conexão não possui zona acessível para `regulacaoeldoradoms.com.br`; nenhum DNS externo foi tentado.

Validação obrigatória executada na URL canônica:

- resposta HTTP `200` e selo visível **DADOS FICTÍCIOS**;
- PDF sintético identificado como pronto no PDF.js 6.3.289, com exatamente **3 páginas**;
- página principal, três miniaturas e canvases renderizados;
- zoom validado em desktop (`182%` para `197%`) e mobile (`57%` para `72%`);
- **Ajustar largura** validado em desktop (`182%`) e mobile (`57%`);
- navegação pela miniatura da página 2 validada;
- layout validado em `1440 x 1000` e `412 x 915`;
- `robots.txt` respondeu `User-agent: *` e `Disallow: /`;
- `X-Robots-Tag: noindex, nofollow, noarchive` confirmado;
- `Cache-Control: no-store` confirmado;
- CSP restritiva confirmada, incluindo `connect-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'` e `frame-ancestors 'none'`;
- captura de rede registrou somente seis requisições GET, todas para `portal-regulacao-central-staging.pages.dev`;
- nenhuma requisição foi feita para `yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev`, Google APIs, Google Drive ou qualquer rota `/api/`;
- nenhum erro de console ou de página foi observado;
- ausência de D1 e dados institucionais confirmada pelo bundle estático, pela inexistência de Functions/bindings e pela captura de rede.

Preview não destrutivo comprovado:

- branch de teste/registro: `codex/central-docs-staging-registro`, criada do mesmo SHA confirmado da `main`;
- o push da branch disparou automaticamente um deployment `preview` pelo GitHub, sem merge e sem alterar produção;
- ID: `d4b0ac1e-dae2-43b1-b5cc-7975082af17f`;
- URL imutável: `https://d4b0ac1e.portal-regulacao-central-staging.pages.dev/`;
- alias da branch: `https://codex-central-docs-staging-r.portal-regulacao-central-staging.pages.dev/`;
- clone, build e deploy do preview concluíram com sucesso;
- o alias respondeu `200`, com selo sintético e os mesmos cabeçalhos de não indexação, não armazenamento e CSP.

Riscos e limitações:

- o staging permanece público até uma decisão humana habilitar e configurar Access;
- o subdomínio `staging.regulacaoeldoradoms.com.br` depende de acesso à zona/DNS;
- no deployment histórico inicial, `staging-manifest.json` registrou `sourceSha: null`; a 3C.1 corrigiu o builder para ler `CF_PAGES_COMMIT_SHA`, preservando `GITHUB_SHA` como fallback de CI;
- o ambiente valida apenas o laboratório sintético e não substitui a pendência funcional de integração visual do editor.

Próximo passo exato:

1. revisar e mesclar a PR documental desta branch;
2. um responsável humano definir `auth_domain`, IdP, público autorizado, duração de sessão e MFA para habilitar Cloudflare Access;
3. depois da proteção, repetir o smoke test autenticado antes de compartilhar o staging;
4. quando a zona estiver acessível, associar `staging.regulacaoeldoradoms.com.br` e repetir os testes de DNS/TLS/cabeçalhos;
5. manter a 3C.2 bloqueada; esta tarefa não inicia a integração visual do editor.

## Entregas concluídas nesta unidade

- Fase 0 encerrada com PR #133 mesclado;
- 21 workflows do PR #133 concluídos com sucesso;
- branch da Fase 1 criada diretamente da main pós-merge;
- leitura do Guia Mestre V1.1 e aplicação do protocolo de continuidade;
- inspeção da main, arquitetura, autenticação, catálogo de ferramentas e política de observabilidade;
- confirmação de que a Central de Documentos ainda não foi implementada;
- pesquisa das regras atuais do Google Drive API/OAuth em documentação oficial;
- criação de `docs/CENTRAL-DOCUMENTOS-ARQUITETURA-V1.md`;
- criação deste arquivo de estado;
- `worker/document-access.js`: tabela e capabilities documentais independentes do cargo;
- autenticação flexível passou a devolver `documentCapabilities` na sessão e na gestão de usuários;
- `worker/document-drive.js`: OAuth web-server, refresh token AES-GCM, access token efêmero, referências opacas, listagem, busca e PDF read-only;
- estado OAuth deixou de transportar username para o Google; identidade fica apenas no D1 temporário;
- `worker/documents-router.js` e integração no `worker/index.js`;
- `/documentos/`, `css/documents.css` e `js/documents.js` com navegação, busca, breadcrumbs, gestão de leitura e visualizador PDF;
- catálogo de ferramentas passou a mostrar a Central somente por capability documental;
- Service Worker reconhece a página estática da Central, mantendo `/api/*` e Range fora do cache; cache global renovado para V10;
- prontidão técnica passou a indicar apenas presença/ausência das configurações OAuth, sem exibir valores;
- redirect URI e URL de retorno públicos foram documentados no `wrangler.toml`; credenciais permanecem externas;
- testes `documents-phase1.test.mjs` e `documents-ui.test.mjs` adicionados;
- workflow `Validar Central de Documentos — Fase 1` adicionado;
- documentação `docs/CENTRAL-DOCUMENTOS-FASE-1.md` criada e arquitetura geral atualizada.

## Decisões tomadas

21. A nomenclatura institucional aprovada para a função adicional `documentos` é **Regulador(a)**; o nome **Central de Documentos** fica reservado à ferramenta.
22. O perfil `medico` passa a ser exibido como **Médico(a)** nas superfícies do Portal, preservando o identificador técnico `medico` e todas as permissões existentes.
23. Nomes futuros de cargos, perfis e funções institucionais devem ser confirmados pelo usuário antes de serem adotados como nomenclatura oficial.


15. O acesso operacional à Central deixa de ser administrado por uma lista enorme dentro de `/documentos/`.
16. O Portal passa a suportar **funções adicionais acumuláveis** sem substituir o perfil principal.
17. A primeira função adicional é `documentos` — **Regulador(a)** — e concede acesso à Central de Documentos e leitura do Drive institucional.
18. A gestão dessa função fica em `/admin/usuarios/`; exemplo válido: **Médico(a) + Regulador(a)**.
19. `auth_document_access` permanece para capabilities documentais finas/compatibilidade, enquanto `auth_user_additional_roles` registra funções acumuláveis.
20. A página `/documentos/` mantém apenas operação documental e configuração institucional compacta; administração de usuários sai da tela operacional.


1. Google Drive continua sendo a fonte institucional; PDFs não serão copiados para D1/Firebase como repositório paralelo.
2. Integração usa Google Drive API v3 através do Cloudflare Worker.
3. A conta institucional é autorizada uma vez; usuários do Portal usam sessão/capabilities do próprio Portal.
4. Escopo previsto: `https://www.googleapis.com/auth/drive`, pois o requisito é navegar pelo Meu Drive completo e editar em fases posteriores.
5. Refresh token será armazenado criptografado no backend; navegador nunca recebe token permanente.
6. Capabilities documentais serão independentes dos cargos: `documents_view`, `documents_extract`, `documents_edit`, `documents_manage`.
7. Conteúdo documental terá `no-store` e cache somente efêmero em memória da sessão nesta versão.
8. Conflitos futuros serão detectados com a `version` do Drive antes da escrita.
9. Substituição futura só será considerada salva após confirmação real do Google Drive e preservará revisão recuperável.
10. A IA documental será separada da pré-regulação atual e não reutilizará automaticamente o endpoint existente.
11. A Fase 1 usa referência opaca AES-GCM para que o fileId bruto do Drive não chegue ao navegador.
12. Lista e pesquisa usam POST no Portal para evitar termos/referências em query string local.
13. O visualizador da Fase 1 usa Blob efêmero + iframe nativo; medição confiável de primeira página fica para a Fase 2.
14. A interface da Fase 1 concede somente Leitura; IA/Edição permanecem capabilities reservadas e não são expostas como funcionalidade ativa.

## Justificativas

- O escopo `drive.file` não satisfaz o acesso a todo o acervo preexistente.
- Service account exigiria compartilhamento/migração do acervo e não representa o Meu Drive integral atual.
- Persistir PDFs localmente aumentaria risco de divergência e exposição.
- Capabilities independentes evitam conceder acesso documental apenas por associação a um cargo.
- Worker mantém tokens e regras de autorização fora do navegador.
- Cache efêmero reduz risco de persistência de documentos clínicos no dispositivo.

## Alternativas descartadas

- `drive.file` como escopo principal.
- service account + compartilhamento manual de todo o acervo.
- cópia do acervo para banco/Firebase.
- PostHog SDK/autocapture em páginas documentais.
- cache persistente de PDFs no navegador.

## Ações externas concluídas

- OAuth institucional concluído: a tela real da Central exibiu **Drive conectado**.
- A raiz do Meu Drive foi carregada com sucesso no Portal e exibiu pastas reais em modo somente leitura.
- A integração Google Drive está funcional no ambiente real para listagem inicial; pesquisa e abertura de PDF ainda precisam de validação final explícita.


- Client ID OAuth corrigido no Cloudflare após diagnóstico de valor ausente; configuração esperada agora contém Client ID, Client Secret, redirect URI e chave de criptografia.

- Conta institucional adicionada como usuário de teste no Google Auth Platform; tela confirma 1 usuário de teste ativo.

- Cloudflare: credenciais OAuth e chave de criptografia configuradas pelo usuário, sem exposição dos valores no chat ou repositório.

- Google Drive API ativada no projeto Google Cloud.
- Tela de consentimento OAuth configurada como **Externo** em modo de testes.
- OAuth Client do tipo Web criado no Google Cloud para a Central de Documentos.
- Client ID e Client Secret foram gerados pelo Google; os valores não foram enviados ao chat nem versionados.
- JSON de credenciais foi baixado localmente pelo usuário; deve ser tratado como segredo e não entrar no repositório.

- PostHog seguro já implantado e validado no Portal antes do início desta fase.
- `POSTHOG_PROJECT_TOKEN` já configurado externamente e eventos técnicos validados.

## Decisão futura registrada — histórico de atividade do Drive

O usuário confirmou que deseja, em fase posterior, consultar o histórico de atividade de arquivos e pastas dentro da Central de Documentos.

Diretriz registrada:
- avaliar integração com a **Google Drive Activity API** após a navegação read-only principal estar validada;
- objetivo: exibir eventos como renomeação, movimentação, criação, exclusão/restauração, alterações de compartilhamento e outras ações suportadas pela API;
- isso **não entra na Fase 1** e não deve atrasar a conexão inicial com o Google Drive API;
- antes de implementar, definir escopo OAuth adicional, política de retenção, modelo de exibição e quais eventos podem aparecer sem expor conteúdo clínico;
- qualquer telemetria desse histórico continua proibida de enviar nome de arquivo, usuário, identificadores do Drive ou conteúdo ao PostHog.

## Descoberta técnica na validação real

- O bloco `Acessos à Central` ocupava espaço excessivo e misturava administração de usuários com a operação documental. Foi decidido removê-lo da rota operacional e centralizar a concessão em **Usuários e acessos**.
- O modelo anterior de um único perfil principal não atendia ao requisito novo de acumular funções. Foi criada uma camada adicional, sem quebrar os perfis existentes, para permitir combinações como Médico(a) + Regulador(a).
- A tela real já comprovou OAuth conectado e listagem da raiz do Meu Drive.


- Durante o consentimento real, o Google exibiu aviso de **app não verificado**. Isso é esperado nesta etapa porque o OAuth está em modo de testes e a conta institucional foi cadastrada como usuário de teste. O fluxo deve continuar apenas com essa conta autorizada até a futura verificação/publicação.

- Revisão visual do Cloudflare mostrou que a linha da variável `GOOGLE_DRIVE_OAUTH_CLIENT_ID` está presente, porém o campo **Value** aparece vazio; `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET` está como Secret, `GOOGLE_DRIVE_OAUTH_REDIRECT_URI` possui URL e `DRIVE_TOKEN_ENCRYPTION_KEY` está como Secret. A ausência do valor do Client ID explica o estado `Integração aguardando configuração` mostrado pela Central.
- Validação real em `/documentos/` mostrou **Integração aguardando configuração** mesmo após o usuário informar que cadastrou as três variáveis no Cloudflare.
- Isso comprova que o Worker em produção não está enxergando pelo menos uma das quatro configurações exigidas por `driveOAuthConfiguration`: `GOOGLE_DRIVE_OAUTH_CLIENT_ID`, `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET`, `GOOGLE_DRIVE_OAUTH_REDIRECT_URI` ou `DRIVE_TOKEN_ENCRYPTION_KEY`.
- O frontend e as rotas da Central estão publicados e funcionais, pois a página, capabilities e lista de usuários carregaram normalmente.
- Próxima verificação deve ser feita no Cloudflare em Variables and Secrets, sem expor valores: conferir nomes exatos, ambiente correto e se houve Save/Deploy.

## Pendências e bloqueios

- PR #134 foi validado com 26 workflows sem falhas e mesclado na `main`.
- Google Cloud/OAuth da Central configurado e consentimento institucional concluído.
- Produção com escopo `drive` exige tratar o status de escopo restrito e requisitos de verificação aplicáveis.
- Nenhum bloqueio impede concluir a documentação da Fase 0.
- Fase 1 encerrada: pesquisa global, abertura de PDF e telemetria documental foram comprovadas em produção sem propriedades sensíveis observadas.
- A alteração de UX/cargos acumuláveis desta subfase ainda precisa passar por PR/checks antes de ir para a main.

## Encerramento formal da Fase 2 — 12/09/2026

Validação real do cache criptografado após reaberturas em produção:

- `pdf_ready` hit: 7 eventos; média 107 ms; mediana 90 ms; p95 167,5 ms;
- `pdf_ready` miss: 9 eventos; média 5.461,3 ms (~5,46 s); mediana 5.177 ms; p95 6.878,2 ms;
- `pdf_first_page_visible` hit: 7 eventos; média 127,6 ms; mediana 110 ms; p95 193 ms;
- `pdf_first_page_visible` miss: 7 eventos; média 5.506,7 ms (~5,51 s); mediana 5.212 ms; p95 7.026,6 ms.

Ganho:
- `pdf_ready`: redução média de ~98,0%, cerca de 51x;
- primeira página: redução média de ~97,7%, cerca de 43x.

O PostHog mostrou eventos reais `cache_state=hit` com `source=cache` e eventos `miss` com `source=drive`. A telemetria continuou sem nomes de arquivos, IDs do Drive, paciente, CPF, CNS, CID ou conteúdo de PDF.

Conclusão: **Fase 2 encerrada**. O critério do Guia Mestre foi cumprido: métricas confiáveis, cache/pré-carregamento funcionando e reabertura sem espera desnecessária. A próxima fase é **Fase 3 — Editor PDF essencial**.

## Validação real da Fase 2A e decisão de cache — 12/09/2026

Teste real após o PR #140:
- PDF abriu em produção, mas a experiência continuou perceptivelmente lenta;
- PostHog nas últimas duas horas registrou 2 `pdf_open_started` e 2 `pdf_ready`;
- a abertura mais recente apresentou `pdf_ready.duration_ms` de aproximadamente **5.914 ms (~5,9 s)**; a abertura anterior havia ficado em aproximadamente **4.830 ms (~4,8 s)**;
- `pdf_first_page_visible` permaneceu em **0** nessa validação;
- o valor real de `pdf_ready.cache_state` observado foi `miss`.

Conclusão: stream progressivo isolado não entregou o ganho esperado no navegador testado. A Fase 2 permanece aberta.

Nova decisão aprovada pelo usuário:
- PDFs podem ser mantidos em cache local para acelerar o fluxo;
- a proteção por cargo continua obrigatória, porém não é usada como única proteção dos bytes persistidos;
- para preservar privacidade mesmo em disco local, o cache aprovado será IndexedDB **criptografado** e segregado pela sessão;
- cache em texto puro no Service Worker/Cache Storage continua proibido.

Unidade 2B implementada na branch:
- Worker devolve `cacheKey` estável e opaco por HMAC, sem expor fileId;
- `js/document-cache.js` cifra bytes com AES-GCM e chave derivada via HKDF da sessão atual;
- cache usa `version` do Drive para invalidar conteúdo antigo;
- TTL inicial 12 h, limite total 256 MB, limite por PDF 50 MB;
- pré-aquecimento automático até 12 MB para os primeiros PDFs prováveis;
- hover/foco em PDF também inicia aquecimento;
- uma abertura reutiliza aquecimento já em curso por até 350 ms antes de cair para rede;
- logout e desconexão do Drive solicitam limpeza;
- mudança de fingerprint de sessão limpa o cache anterior;
- `pdf_ready`/`pdf_first_page_visible` passam a distinguir `cache_state=hit|miss` sem identificadores.

## Fase 2 — implementação em andamento

Unidade 2A implementada na branch:
- documento `docs/CENTRAL-DOCUMENTOS-FASE-2.md` criado;
- Service Worker ganhou rota virtual efêmera `/__portal_document_pdf/<viewId>`;
- a página registra referência opaca + sessão apenas em memória do Service Worker, com TTL curto e heartbeat;
- requisições `Range` do visualizador são encaminhadas ao endpoint documental protegido;
- respostas continuam `no-store` e não entram em Cache Storage;
- endpoint virtual não contém fileId, nome de arquivo ou token;
- modo progressivo usa iframe nativo diretamente sobre o stream;
- fallback Blob integral da Fase 1 permanece automático;
- `pdf_first_page_visible` passa a ser emitido somente no modo progressivo após `load` + confirmação de área visível;
- testes estáticos e de privacidade foram ampliados;
- cache do Service Worker avançou para V11.

Decisões desta unidade:
- não usar CDN de terceiros/PDF.js remoto em página clínica;
- não colocar token de sessão ou ticket bearer na URL do PDF, evitando exposição em histórico/logs;
- não persistir sessão/referência em IndexedDB/Cache Storage;
- usar memória efêmera do Service Worker e reidratação por heartbeat;
- manter fallback Blob para compatibilidade e rollback funcional.

Alternativas descartadas:
- biblioteca PDF remota via CDN, por ampliar superfície de supply chain em tela com documentos sensíveis;
- URL temporária com credencial no path/query, por risco de registro em logs/histórico;
- cache persistente do PDF para acelerar reaberturas;
- considerar o `load` do Blob integral como `pdf_first_page_visible`, pois isso não mede primeira página com confiabilidade.

## Correção de sessão validada e mesclada — 12/09/2026

PR #148:
- 23 workflows concluídos sem falhas;
- teste funcional confirmou que o Desenvolvedor pode salvar a própria conta e, com o mesmo token, conceder `edit=true`;
- teste separado confirmou que mudança crítica do próprio papel continua invalidando a sessão;
- merge concluído em `49d86934831577884e68c90f5758239df2a2f341`.

Próxima validação real:
- como a tentativa anterior ocorreu com o comportamento antigo, a sessão atualmente aberta no navegador pode já estar invalidada;
- após o deploy, relogar uma vez é suficiente;
- salvar novamente Regulador(a) + **Permitir editor de PDF** deve concluir as duas operações sem derrubar a sessão.

## Correção CORS validada e mesclada — 12/09/2026

PR #150:
- 22 workflows do Pull Request concluídos com sucesso e sem falhas;
- teste de regressão confirmou preflight `OPTIONS /api/admin/users` com status 204 e cabeçalhos CORS permitidos;
- merge concluído na `main` em `2d8d429e7ff5cb0ef91bd2aae526220e80086483`;
- após o merge, 23 workflows de validação funcional da `main` concluíram com sucesso; o deploy estático do GitHub Pages ainda estava em fila na última consulta;
- a mudança não altera cargos, permissões ou capabilities; corrige exclusivamente o caminho CORS.

Próxima validação real:
- abrir novamente `/admin/usuarios/` após a propagação do deploy;
- confirmar que **Contas cadastradas** carrega normalmente;
- em seguida manter Regulador(a), marcar **Permitir editor de PDF** e salvar;
- continuar os testes funcionais do editor da Fase 3.

## Regressão de CORS em Usuários e acessos — 12/09/2026

Após o merge do PR #148, a lista **Contas cadastradas** passou a exibir `Failed to fetch` mesmo após `Ctrl+F5` e novo login.

Causa raiz confirmada no código:
- o PR #148 adicionou retorno 401 explícito quando `handleAdminUsers` não encontra ator autenticado;
- o roteador flexível encaminhava também o `OPTIONS` de preflight CORS para `handleAdminUsers`;
- preflight CORS não envia Bearer token;
- por isso o `OPTIONS /api/admin/users` passou a receber 401 antes do handler base de CORS;
- o navegador bloqueava a requisição GET real e mostrava apenas `TypeError: Failed to fetch`.

Correção na branch `fix/admin-users-cors-preflight` / PR #150:
- `OPTIONS` de `/api/admin/users*` é resolvido pelo handler base antes da autenticação;
- requisições reais continuam exigindo sessão válida e preservam o 401 explícito;
- teste de regressão verifica status 204 e os cabeçalhos `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` e `Access-Control-Allow-Headers`;
- nenhuma permissão, cargo, capability documental ou regra do editor foi ampliada.

Alternativas descartadas:
- remover a validação 401 adicionada no PR #148, porque isso reintroduziria a mensagem enganosa de falta de papel;
- contornar no frontend com retry, porque o navegador bloqueia a requisição antes do GET real e o problema é do preflight.

## Bloqueio encontrado na concessão do editor — 12/09/2026

Durante a tentativa real de habilitar **Permitir editor de PDF** na própria conta Desenvolvedor/Regulador(a), a interface exibiu incorretamente:

`Somente o Desenvolvedor pode conceder funções adicionais.`

Diagnóstico:
- a tela considerava a sessão como Desenvolvedor a partir do usuário em cache;
- ao salvar alterações da própria conta, `updateManagedUser` sempre incrementava `session_version`, mesmo quando papel e estado ativo não mudavam;
- isso invalidava imediatamente o token da própria sessão;
- a operação seguinte de capability documental ocorria com token já invalidado;
- em uma nova tentativa, `auth-management-flex` recebia ator nulo e devolvia a mensagem de permissão de Desenvolvedor, mascarando o problema real de sessão expirada.

Correção implementada na branch `fix/developer-self-edit-session`:
- edição da própria conta preserva a sessão quando apenas dados não críticos mudam;
- mudança do próprio papel ou estado ativo continua incrementando `session_version` por segurança;
- alterações em contas de terceiros continuam invalidando as sessões do alvo como antes;
- sessão inválida agora retorna 401 com mensagem explícita de sessão expirada, em vez de falsa mensagem de falta de papel;
- `/admin/usuarios/` força revalidação da sessão antes de permitir gestão;
- versão de `admin-users.js` avançou para evitar cache do cliente antigo;
- teste de regressão cobre exatamente o fluxo: salvar a própria conta Desenvolvedor + conceder capability `edit` na segunda requisição com o mesmo token.

Impacto observado:
- a tentativa anterior pode ter deixado a sessão atual do navegador já invalidada. Após o deploy da correção, será necessário entrar novamente **uma vez** se essa sessão antiga continuar aberta.

## Aprovação explícita de edição — 12/09/2026

O usuário aprovou explicitamente **“Permitir editor de PDF”** para a conta Regulador(a) usada nos testes da Central.

Estado técnico:
- o PR #146 já foi mesclado na main em `b3665ed9`;
- a UI administrativa agora possui o controle separado `Permitir editor de PDF`;
- a capability `edit` continua opt-in e não é herdada automaticamente de Regulador(a);
- a concessão ainda depende de uma ação autenticada no Portal em `/admin/usuarios/`, pois esta conversa não possui uma sessão administrativa do Portal para executar a alteração diretamente.

A aprovação está registrada e não precisa ser solicitada novamente. A próxima ação humana é somente efetivar o checkbox na conta de teste autorizada após o deploy.

## Correção visual do botão Editar PDF validada e mesclada — 12/09/2026

PR #152:
- 21 workflows do Pull Request concluídos com sucesso e sem falhas;
- correção visual mesclada na `main` em `e432ba54e92992e61bff7898933da57f5e44538a`;
- o título do PDF agora encolhe e recebe elipse dentro do espaço disponível;
- **Editar PDF** e o botão de fechar permanecem como ações não encolhíveis no cabeçalho;
- regra equivalente foi preservada em telas estreitas;
- cache-bust de `documents.css` avançou para `20260912-4`;
- a mudança é exclusivamente de layout e não altera permissões, OAuth, cache, conteúdo do PDF ou escrita no Drive.

Próxima validação real:
- recarregar `/documentos/` após a propagação do deploy;
- abrir PDF com título longo e confirmar que **Editar PDF** aparece totalmente visível;
- iniciar o editor e validar excluir/reordenar/undo/redo/unir/prévia.

## Validação real da capability `edit` e regressão visual — 12/09/2026

A validação em produção avançou após a correção de CORS:
- a Central voltou a carregar normalmente;
- a conta de teste autorizada possui capability `edit` efetiva, comprovada pelo aparecimento real do botão **Editar PDF** ao abrir um PDF;
- portanto, os bloqueios anteriores de sessão/CORS não impedem mais o início do editor.

Novo problema visual observado:
- em desktop com o visualizador na coluna direita, o botão **Editar PDF** aparece parcialmente cortado no canto superior direito;
- causa raiz no CSS: o bloco do título era um flex item sem `min-width: 0` e o título usava `max-width: min(54vw, 640px)`, largura calculada pela viewport e não pelo espaço realmente disponível no cabeçalho;
- com título longo + ações fixas, o conteúdo ultrapassava a largura da coluna e era recortado pelo `overflow: hidden` do visualizador.

Correção implementada na branch `fix/document-viewer-edit-button-layout`:
- o bloco de título passou a `min-width: 0; flex: 1 1 auto`;
- o título usa a largura real disponível e elipse dentro desse bloco;
- o bloco de ações passou a `flex: 0 0 auto`, preservando **Editar PDF** e fechar;
- a regra mobile também deixa de reservar largura por viewport para o título;
- cache-bust de `documents.css` avançou para `20260912-4`;
- teste de regressão em `documents-ui.test.mjs` protege essa composição.

Alternativas descartadas:
- reduzir apenas o texto ou fonte do botão, pois não corrige a causa estrutural;
- esconder o título, pois ele é informação útil;
- permitir overflow horizontal no cabeçalho, pois degradaria desktop e mobile.

## Ação explícita Unir outro PDF validada e mesclada — 12/09/2026

PR #154:
- a primeira rodada de checks detectou apenas uma falha no próprio teste de cache-bust, causada por regex com escape excessivo;
- a regex foi corrigida sem alterar o comportamento funcional;
- a rodada final concluiu 21 workflows com sucesso e sem falhas;
- merge concluído na `main` em `187d631be7e639d6ba7ea957d75b4abca7a1279e`;
- o editor agora exibe **Unir outro PDF** diretamente na barra;
- ao entrar no editor, a lista muda **Abrir PDF** para **Unir ao editor** ou **Já no editor**;
- os rótulos permanecem sincronizados após merge, exclusão, desfazer, refazer e saída;
- nenhuma escrita no Google Drive foi adicionada.

Próxima validação real:
- após o deploy, abrir um PDF, entrar no editor e clicar em **Unir outro PDF**;
- escolher outro PDF da lista e confirmar que suas páginas entram no resultado;
- testar desfazer/refazer da união e a prévia final.

## UX das funções do editor — 12/09/2026

Durante a validação real, o usuário questionou onde estavam as demais funções do editor, especialmente **unir outro documento ao PDF atual**.

Diagnóstico:
- a função de união já existia no núcleo da Fase 3;
- tecnicamente, enquanto o editor estava aberto, clicar em outro PDF da lista chamava `mergePdfIntoEditor`;
- porém a interface não deixava isso evidente: a barra do editor não possuía botão de união e a lista continuava exibindo **Abrir PDF** porque seus rótulos não eram atualizados ao entrar no editor;
- portanto o recurso existia, mas estava praticamente oculto na experiência real.

Melhoria implementada na branch `feat/document-editor-merge-action`:
- novo botão **Unir outro PDF** na barra do editor;
- ao acioná-lo, o Portal orienta a escolher outro PDF na lista e desloca o foco para um candidato disponível;
- enquanto o editor está ativo, PDFs disponíveis passam a exibir **Unir ao editor**;
- PDFs que já fazem parte do resultado exibem **Já no editor**;
- os rótulos são sincronizados após união, exclusão, desfazer, refazer e ao sair do editor;
- o comportamento existente de união local foi preservado, sem adicionar escrita no Google Drive;
- cache-bust de `documents.js` avançou para `20260912-3`;
- teste de regressão cobre a nova ação explícita e os rótulos contextuais.

Decisão:
- funções centrais do editor não devem depender de comportamento implícito ou de instrução textual escondida;
- ações como união devem possuir controle visível e feedback contextual.

## Imagens e Ctrl+V validados e mesclados — 12/09/2026

PR #156:
- rodada final do Pull Request com 21 workflows aprovados e 0 falhas;
- merge concluído na `main` em `c84f13e9dedc5d6b1b1ca5ff3b4e6aa0a07fd4bd`;
- validações pós-merge da `main` também concluíram sem falhas;
- editor aceita imagens como novas páginas locais e permite seleção múltipla;
- prints/imagens no clipboard podem ser inseridos com **Ctrl+V** quando o evento de paste chega à página do Portal;
- nenhum byte de imagem é enviado ao Worker/PostHog/Google Drive nesta fase.

Próxima unidade aprovada:
- substituir o visualizador nativo por uma superfície própria do Portal;
- miniaturas de páginas renderizadas/controladas pelo Portal;
- reorganização por arrastar e soltar;
- paste global confiável durante a edição, sem perder o evento para o plugin PDF do navegador.

### Correção de CI — 13/09/2026

A primeira execução do PR #163 apresentou falhas em workflows amplos por **uma única asserção incorreta do teste novo**, não por regressão funcional:
- o teste procurava `data.thumbnailAction`;
- o código real e correto usa a propriedade DOM `dataset.thumbnailAction`;
- a asserção foi corrigida para refletir a API usada pela implementação;
- nenhuma lógica do editor, permissão, cache ou Drive foi alterada por essa correção.

## 3C.1e validada, mesclada e publicada — 13/09/2026

PR #170:
- **21/21 workflows do Pull Request concluíram com sucesso** e 0 falhas;
- merge funcional concluído na `main` em `a13b9f91b60a59ecb5cd6f612fdd3cdfa1a2c3ea`;
- no pós-merge, **23/23 workflows associados ao commit concluíram com sucesso**, incluindo **Central de Documentos — Fases 1–3**, **governança Central de Documentos**, **site**, **gestão de usuários** e **pages build and deployment**;
- a publicação estática da correção de renderização foi concluída com sucesso.

Resultado publicado:
- primeira página e primeira miniatura terminam antes da ativação dos `IntersectionObserver`;
- renderizações duplicadas da mesma página/geração aguardam o task já em andamento;
- rerenders necessários cancelam e aguardam o task anterior antes da reutilização do canvas;
- finalizadores só limpam `record.renderTask` quando ainda estão finalizando o mesmo task;
- a chamada de renderização usa o parâmetro `canvas` da API atual do PDF.js;
- o asset `document-viewer.js` recebeu nova versão para furar cache;
- nenhuma escrita no Drive, capability ou telemetria sensível foi alterada.

Critério restante:
- validar em produção a renderização real da página 1 e da miniatura;
- abrir um segundo PDF;
- testar zoom, **Ajustar largura** e entrada no editor;
- somente após aceite real iniciar 3C.2.

## Validação real da 3C.1d revelou falha do PDF.js — 13/09/2026

Evidência real:
- o visualizador nativo do navegador deixou de aparecer, confirmando o aceite da remoção do iframe;
- a superfície própria do Portal foi exibida, mas o PDF não chegou a renderizar e a interface mostrou a mensagem controlada de falha;
- a evidência em vídeo confirma o problema sem necessidade de registrar nome de arquivo, conteúdo clínico ou identificadores documentais.

Principal falha técnica encontrada no código:
- `installObservers(session)` era ativado **antes** da renderização inicial da página 1;
- o `IntersectionObserver` podia disparar `renderMainPage()` para a mesma página enquanto a chamada inicial também estava renderizando o mesmo canvas;
- `renderMainPage()` cancelava qualquer `renderTask` existente e iniciava outro imediatamente, permitindo concorrência/cancelamento no mesmo canvas;
- o `finally` antigo ainda atribuía `record.renderTask = null` sem conferir se aquele task continuava sendo o atual, podendo apagar a referência de uma renderização mais nova;
- a miniatura tinha o mesmo risco de renderização concorrente;
- esse desenho é incompatível com a exigência do PDF.js de não manter renderizações concorrentes sobre o mesmo canvas.

Decisão 3C.1e:
- a primeira página e a primeira miniatura devem terminar antes de os observadores de lazy-render serem ativados;
- renderizações repetidas da mesma página/geração passam a aguardar a tarefa já em andamento em vez de cancelá-la e iniciar outra;
- quando um rerender for realmente necessário, o task anterior é cancelado e aguardado antes da reutilização do canvas;
- finalizadores só limpam `record.renderTask` se ainda estiverem finalizando o mesmo task;
- a chamada do PDF.js passa a usar o parâmetro moderno `canvas` em vez de `canvasContext`, mantendo a implementação alinhada à API atual;
- nenhuma escrita no Drive, capability ou telemetria sensível é alterada.

Critério de aceite 3C.1e:
1. abrir um PDF real e renderizar página 1 + miniatura no visualizador próprio;
2. abrir outro PDF e repetir;
3. testar zoom e **Ajustar largura** sem erro;
4. entrar no editor e confirmar que a mesma superfície continua operacional;
5. somente após aceite real retomar 3C.2.

## 3C.1d validada, mesclada e publicada — 13/09/2026

PR #168:
- a primeira execução de CI encontrou referências legadas de `compatibility-mode` e duas asserções históricas incompatíveis com a decisão de remover o iframe; os testes e chamadas mortas foram corrigidos sem reintroduzir fallback nativo;
- após os ajustes, **21/21 workflows do Pull Request concluíram com sucesso** e 0 falhas;
- merge funcional concluído na `main` em `eb991901a047cc8f5eb7083cc44e9d9ffabc4c91`;
- no pós-merge, **23/23 workflows associados ao commit concluíram com sucesso**, incluindo **Central de Documentos — Fases 1–3**, **governança Central de Documentos**, **site**, **gestão de usuários** e **pages build and deployment**;
- o deploy estático da versão sem visualizador nativo foi concluído com sucesso.

Resultado publicado:
- `documentsPdfFrame` foi removido do HTML;
- `frame-src` foi removido da CSP da Central;
- `showIframeViewerSurface()`, `els.frame` e observadores específicos do iframe foram removidos do cliente;
- cache hit e cache miss usam exclusivamente PDF.js;
- no caminho progressivo, uma falha tenta novamente com Blob completo e PDF.js, sem recorrer ao plugin do navegador;
- falha definitiva exibe erro controlado dentro da superfície própria;
- estilos e referências legadas de `compatibility-mode` foram removidos;
- nenhuma escrita no Google Drive, capability ou telemetria sensível foi alterada.

Critério restante:
- validação real em produção da visualização normal e do editor;
- confirmar ausência total da toolbar nativa do navegador tanto em cache hit quanto em cache miss;
- somente após aceite real iniciar 3C.2.

## Ajuste de CI da 3C.1d — 13/09/2026

- a primeira execução do PR #168 apontou falha no teste novo de ausência de `compatibility-mode`;
- a causa era exclusivamente três chamadas mortas de `classList.remove('compatibility-mode')` em `js/documents.js`, remanescentes das versões anteriores;
- essas referências foram removidas; nenhum fluxo adicionava mais essa classe e os estilos correspondentes já haviam sido eliminados;
- as falhas em workflows de outras áreas ocorreram porque eles executam a mesma suíte compartilhada e atingiram a mesma asserção, não por regressões próprias dessas áreas;
- uma segunda execução revelou duas asserções históricas ainda incompatíveis com a decisão 3C.1d: uma exigia `frame-src 'self' blob:` e outra exigia a antiga assinatura literal de `markViewerReady` para cache hit;
- os testes foram atualizados para exigir a **ausência** de `frame-src` e validar semanticamente `cacheState: 'hit'` + `sourceLabel: 'cache'`;
- o PR deve ser revalidado integralmente antes do merge.

## Validação real revelou fallback nativo remanescente na visualização — 13/09/2026

Evidência real:
- o usuário enviou nova captura de `/documentos/` mostrando a toolbar do visualizador PDF do navegador dentro da área **Visualização**;
- a captura foi feita **antes de entrar no editor**, portanto o problema remanescente não era a prévia do editor corrigida em 3C.1c;
- nenhum nome de arquivo ou conteúdo documental dessa evidência deve ser reproduzido em status, logs ou telemetria.

Causa exata no código:
- 3C.1c eliminou o fallback nativo **durante a edição**, mas o fluxo somente leitura ainda mantinha `documentsPdfFrame`, `showIframeViewerSurface()` e três caminhos que abriam o iframe;
- cache hit com falha do PDF.js abria o iframe;
- falha da URL progressiva abria o iframe;
- falha do retry por Blob em `loadPdfBlobFallback()` abria o iframe;
- portanto a presença da toolbar nativa observada era comportamento ainda permitido pelo código, não cache antigo.

Decisão 3C.1d:
- o visualizador nativo do navegador deixa de existir na Central, inclusive como fallback;
- o `iframe` será removido do HTML e `frame-src` será removido da CSP da rota documental;
- estilos legados de `compatibility-mode` também serão removidos;
- o fallback de transporte continua existindo, mas muda de **progressivo → Blob completo → PDF.js**, sempre dentro do visualizador próprio;
- se PDF.js falhar mesmo com Blob completo, o Portal mostra erro controlado na própria superfície, sem abrir plugin do navegador;
- nenhuma escrita no Drive, permissão ou telemetria sensível é alterada.

Critério de aceite:
1. abrir PDF em modo somente leitura e confirmar toolbar/miniaturas próprias do Portal;
2. não existir toolbar de Chrome/Edge, download/impressão nativos ou nome interno de Blob;
3. entrar no editor e permanecer na mesma superfície controlada pelo Portal;
4. validar cache hit e miss;
5. somente após aceite real iniciar 3C.2.

## 3C.1c validada, mesclada e publicada — 13/09/2026

PR #166:
- a primeira execução de CI revelou um erro exclusivamente no teste novo (`editor is not defined`), sem regressão funcional; a variável de leitura de `js/document-editor.js` foi adicionada ao teste;
- após a correção, **21/21 workflows do Pull Request concluíram com sucesso** e 0 falhas;
- merge concluído na `main` em `dd9a7253e6d75ef4d80161208a2084f6c81079cd`;
- no pós-merge, **23/23 workflows associados ao commit concluíram com sucesso**, incluindo **Central de Documentos — Fases 1–3**, **governança Central de Documentos**, **site**, **gestão de usuários** e **pages build and deployment**;
- portanto a correção está publicada e pronta para reteste real.

Resultado técnico publicado:
- `pdf-lib` passa a gerar a prévia intermediária com `useObjectStreams: false`;
- o fluxo de edição não possui mais `showEditorIframeFallback()`;
- se o PDF.js falhar durante edição, o Portal permanece na superfície própria e mostra erro controlado;
- `buildEditorPreview()` envia o Blob editado diretamente ao `PortalPdfViewer`;
- ao sair do editor, a restauração tenta permanecer no visualizador próprio e não cai automaticamente no iframe;
- cache-bust de `document-editor.js` e `documents.js` foi renovado;
- nenhuma escrita no Google Drive, alteração de permissões ou nova telemetria sensível foi adicionada.

Critério restante:
- reteste real em produção com um PDF que anteriormente acionou “modo de compatibilidade”;
- a sessão de edição deve permanecer integralmente no visualizador PDF.js do Portal;
- a toolbar nativa do navegador e a mensagem “modo de compatibilidade” não podem aparecer;
- somente após esse aceite iniciar 3C.2.

## Validação real falhou novamente — editor caiu no modo de compatibilidade — 13/09/2026

Evidência do usuário em produção:
- após o deploy da 3C.1b, o editor ainda exibiu a lista textual de páginas separada e o PDF no visualizador nativo do navegador;
- a própria UI informou **“Prévia atualizada em modo de compatibilidade”**, provando que o caminho `showEditorIframeFallback()` foi acionado;
- portanto 3C.1b não atende ao requisito de um editor controlado integralmente pelo Portal.

Diagnóstico técnico:
- o fallback ocorreu na **prévia gerada pelo editor**, não por ausência do código novo;
- `document-editor.js` gerava o PDF intermediário com `pdf-lib 1.17.1` e `useObjectStreams: true`;
- existe incompatibilidade conhecida nessa versão do pdf-lib para alguns PDFs quando salvos com object streams, enquanto `useObjectStreams: false` evita esse tipo de saída problemática;
- a velocidade do fallback observada na UI é compatível com falha imediata de abertura/renderização da prévia gerada, e não com timeout de download;
- o código também ainda permitia que qualquer falha do PDF.js trocasse automaticamente para o iframe, contrariando a decisão de ter controle total do editor.

Decisão aprovada pela nova evidência:
- criar **3C.1c**;
- prévias do editor passam a ser geradas com `useObjectStreams: false`;
- o editor **não pode mais abrir o iframe nativo como fallback**;
- se o PDF.js falhar, a superfície continua sendo a do Portal e mostra erro controlado, sem separar editor e visualizador;
- ao sair do editor, a restauração também não deve cair automaticamente no iframe;
- o fallback nativo geral de visualização somente leitura fica fora desta correção e não será usado pelo editor;
- nenhuma escrita no Google Drive é adicionada.

Critério de aceite 3C.1c:
1. entrar em **Editar PDF** e permanecer no PDF.js do Portal;
2. atualizar a visualização após uma alteração sem aparecer “modo de compatibilidade”;
3. miniaturas e ações de páginas continuam na mesma superfície;
4. nenhum iframe nativo é usado durante a sessão de edição;
5. somente após validação real iniciar 3C.2.

## Publicação confirmada da correção 3C.1b — 13/09/2026

Evidência de deploy:
- o workflow dinâmico **pages build and deployment** associado à `main` `6b2b2d8d346fc699bea10acf2e58da2d2d371d88` concluiu com **success**;
- esse deploy contém a correção funcional do PR #163 porque o commit documental é descendente direto de `478f32952b4b2c0cd3294cb249222dc37eef3409`;
- portanto o novo fluxo do editor visual já pode ser validado em produção.

Reteste real agora exigido:
1. atualizar `/documentos/` com recarga forçada;
2. abrir um PDF;
3. entrar em **Editar PDF**;
4. confirmar que não aparece a toolbar nativa do navegador;
5. confirmar miniaturas visuais com ações ↑, ↓ e excluir;
6. testar união, adicionar imagem, atualizar visualização e sair do editor;
7. se o Portal entrar em **modo de compatibilidade**, registrar a ocorrência porque isso indica fallback real do PDF.js.

A 3C.2 continua bloqueada até esse reteste real ser aceito.

## 3C.1b validada em CI e mesclada — 13/09/2026

PR #163:
- primeira execução expôs apenas um erro de asserção no teste novo (`data.thumbnailAction` vs. `dataset.thumbnailAction`); a implementação funcional não precisou ser alterada por essa falha;
- após a correção do teste, **21/21 workflows do Pull Request concluíram com sucesso**, sem falhas;
- merge concluído na `main` em `478f32952b4b2c0cd3294cb249222dc37eef3409`;
- na validação pós-merge consultada, **22/22 workflows disponíveis para o commit concluíram com sucesso**, incluindo Central de Documentos — Fases 1–3, governança, site e gestão de usuários;
- posteriormente, o deploy de GitHub Pages foi confirmado com sucesso no commit documental descendente `6b2b2d8d346fc699bea10acf2e58da2d2d371d88`, publicando também a correção funcional do PR #163.

Resultado técnico:
- modo **Editar PDF** deixa de trocar deliberadamente para o visualizador nativo;
- Blob original/editado é aberto na mesma superfície `PortalPdfViewer`/PDF.js do Portal;
- miniaturas visuais passam a concentrar mover para cima, mover para baixo e excluir;
- lista textual separada de páginas fica restrita ao modo de compatibilidade;
- iframe permanece exclusivamente como fallback quando o visualizador próprio realmente não puder ser usado;
- sair do editor tenta restaurar o documento original no visualizador próprio;
- nenhuma escrita no Drive e nenhuma ampliação de dados sensíveis em observabilidade.

Critério pendente:
- confirmar o deploy/publicação do commit;
- repetir em produção o cenário que gerou a captura anterior e verificar que a barra nativa do navegador não aparece no fluxo normal do editor.

## Implementação 3C.1b — superfície visual unificada do editor — 13/09/2026

Implementado na branch `fix/document-editor-unified-viewer-3c1b`:
- `startEditor()` deixou de abrir o iframe como caminho normal;
- `buildEditorPreview()` agora envia o Blob editado diretamente ao `PortalPdfViewer`;
- a prévia editada permanece no PDF.js self-hosted do Portal;
- o iframe foi preservado somente em `showEditorIframeFallback()`, acionado quando o visualizador próprio não está disponível ou falha;
- ao sair do editor, o documento original volta para a superfície própria pelo `restoreOriginalPortalViewer()`;
- miniaturas do visualizador receberam ações visuais de mover para cima, mover para baixo e excluir;
- a lista textual separada de páginas fica oculta no fluxo normal e reaparece apenas no modo de compatibilidade;
- isso prepara a mesma trilha de miniaturas para a próxima unidade 3C.2, onde as setas serão complementadas/substituídas por drag-and-drop;
- nenhuma escrita no Google Drive foi adicionada e nenhuma telemetria sensível nova foi criada.

Critérios de aceite desta correção:
1. entrar no editor sem aparecer a barra nativa do navegador;
2. ver PDF e miniaturas controlados pelo Portal;
3. excluir/reordenar página pelas miniaturas e continuar na mesma superfície;
4. unir PDF/adicionar imagem e a visualização atualizar no PDF.js;
5. sair do editor e voltar à visualização própria;
6. iframe somente se houver falha real de compatibilidade.

Pendências:
- checks automatizados da branch/PR;
- merge/deploy;
- nova validação real do usuário em produção.

## Validação real — editor ainda separado do visualizador próprio — 13/09/2026

Evidência do usuário em produção:
- ao entrar em **Editar PDF**, a metade inferior ainda exibe a barra/viewport do visualizador PDF nativo do navegador dentro do iframe;
- o editor permanece em um painel separado acima, com a lista textual de páginas e controles ↑/↓/Excluir;
- portanto a experiência ainda não é um **editor visual único controlado pelo Portal**.

Diagnóstico de código:
- isso não é cache nem falha de deploy;
- a implementação 3C.1 substituiu o iframe no fluxo de visualização somente leitura, porém `startEditor()` e `buildEditorPreview()` ainda chamam explicitamente `showIframeViewerSurface()`;
- essa decisão provisória havia sido registrada como fallback durante 3C.1, mas a validação real mostrou que ela não pode permanecer como fluxo principal do editor;
- o próprio documento de arquitetura já descarta o iframe nativo como editor principal, porque o Portal não controla miniaturas, DOM interno, drag-and-drop nem clipboard de forma confiável.

Decisão:
- **3C.1 não será considerada aceita para avanço direto à 3C.2 enquanto o editor continuar voltando ao iframe**;
- criar a correção **3C.1b — superfície visual unificada do editor**;
- no modo de edição, a prévia deve ser renderizada no mesmo `PortalPdfViewer`/PDF.js self-hosted usado pela visualização;
- o iframe ficará somente como fallback automático de compatibilidade quando o PDF.js realmente falhar, nunca como caminho normal;
- a lista textual separada de páginas deve deixar de ser a superfície principal de edição; as miniaturas visuais serão a base para a próxima unidade de drag-and-drop;
- nenhuma escrita no Google Drive será adicionada.

Próximo critério de aceite:
1. abrir PDF;
2. entrar em **Editar PDF**;
3. continuar vendo o visualizador próprio do Portal, sem barra nativa do navegador;
4. atualizar a prévia após excluir/reordenar/unir/adicionar imagem e permanecer na mesma superfície;
5. iframe só pode aparecer em fallback de erro real;
6. depois disso iniciar 3C.2 (drag-and-drop das miniaturas).

## 3C.1 validado em CI, mesclado e publicado — 12/09/2026

PR #161:
- **21/21 workflows do Pull Request concluídos com sucesso**, sem falhas;
- merge concluído na `main` em `12a86c024a4acf2edffa1e4404589ad001075fa9`;
- validações pós-merge relevantes concluídas com sucesso: **Central de Documentos — Fases 1–3**, **governança Central de Documentos**, **site**, **gestão de usuários** e **pages build and deployment**;
- o deploy estático da versão contendo o visualizador próprio foi concluído com sucesso.

Entregue na produção:
- PDF.js 6.3.289 self-hosted;
- páginas renderizadas pelo Portal em canvas;
- trilho de miniaturas próprio;
- zoom + reset + ajuste à largura;
- renderização preguiçosa e liberação de canvases distantes;
- abertura por cache criptografado preservada;
- caminho progressivo/Range pelo Service Worker preservado;
- iframe nativo mantido como fallback automático e como prévia temporária do editor;
- segurança explícita com `enableScripting:false` e `isEvalSupported:false`;
- nenhuma escrita no Google Drive e nenhuma ampliação da telemetria sensível.

Critério ainda pendente para encerrar 3C.1:
- validação real pelo usuário em produção, porque os checks automatizados comprovam integridade/código, mas não substituem a verificação visual e de desempenho com PDFs reais no navegador/dispositivo operacional.

Teste real solicitado:
1. recarregar `/documentos/`;
2. abrir um PDF;
3. confirmar que aparece o visualizador do Portal com **miniaturas à esquerda no desktop** (ou trilho horizontal no mobile);
4. testar **− / percentual / + / Ajustar largura**;
5. clicar em miniaturas e confirmar navegação;
6. testar um PDF já aberto anteriormente (cache hit) e um PDF ainda não aberto (miss);
7. informar qualquer diferença de renderização, lentidão ou queda para o visualizador compatível.

## Implementação 3C.1 — visualizador próprio + miniaturas — 12/09/2026

Estado desta branch:
- PDF.js **6.3.289** foi vendorizado e passou a ser servido pelo próprio Portal em `vendor/pdfjs/`;
- o vendor inclui módulo principal, worker, CMaps, fontes padrão, WASM, ICCs e licença;
- a vendorização foi realizada por workflow temporário restrito à branch, executado com sucesso, evitando CDN em runtime e sem inserir conteúdo documental no processo;
- `js/document-viewer.js` carrega o módulo local sob demanda e fixa o worker local;
- `enableScripting: false` e `isEvalSupported: false` permanecem explícitos;
- a interface ganhou visualizador próprio com trilho de miniaturas, páginas em canvas, zoom, reset e ajuste à largura;
- páginas principais e miniaturas usam renderização preguiçosa por `IntersectionObserver`;
- canvases distantes são liberados para limitar memória e há teto de pixels por canvas;
- abertura por cache criptografado reutiliza o Blob local;
- abertura sem cache reutiliza a URL virtual progressiva do Service Worker, permitindo ao PDF.js continuar usando stream/Range autorizado;
- o iframe nativo permanece como **fallback de compatibilidade** e também continua servindo a prévia do editor nesta unidade;
- `pdf_ready` e `pdf_first_page_visible` continuam com o schema técnico já aprovado, sem página exata, nome, fileId ou conteúdo;
- nenhuma escrita no Google Drive foi adicionada.

Decisões:
- não usar CDN para PDF.js;
- não remover o iframe antes da validação real, pois ele é o rollback funcional da unidade;
- não antecipar drag-and-drop ou overlays para 3C.1;
- não usar APIs internas da AnnotationEditorLayer;
- preservar anotações visuais do PDF no canvas, sem criar camada interativa de scripts.

Pendências desta unidade:
- concluir testes automatizados;
- workflow temporário de vendorização removido após confirmar os assets self-hosted;
- abrir PR e validar todos os checks;
- depois do deploy, validar PDFs reais em desktop e mobile, incluindo documento grande, páginas rotacionadas e cache hit/miss;
- somente após essa validação avançar para 3C.2.

## Pesquisa/arquitetura do visualizador-editor validada e mesclada — 12/09/2026

PR #158:
- alteração exclusivamente documental;
- 21 workflows concluídos com sucesso e 0 falhas;
- merge concluído na `main` em `5fa0ec5a1ebea0b6c6a0dc11a0a7ba429879791f`;
- `docs/CENTRAL-DOCUMENTOS-EDITOR-VISUAL-V1.md` passa a ser o detalhamento técnico autoritativo das unidades 3C.1–3C.5, subordinado ao Guia Mestre e às decisões mais recentes do projeto.

Estado encerrado nesta unidade:
- diferença funcional entre **Adicionar imagem como página** e **Colar imagem** definida;
- stack definida: PDF.js Display Layer + pdf-lib + DOM overlay/Pointer Events;
- modelo normalizado de geometria, estratégia de undo/redo, cross-page drag e flatten definidos;
- segurança do PDF.js, privacidade, performance e matriz mínima de testes registradas;
- Fabric.js/Konva.js ficam como contingência, não como dependência inicial.

Próxima unidade funcional autorizada:
- **3C.1 — visualizador próprio somente leitura + miniaturas**, mantendo o iframe atual como fallback até validação real.

## Pesquisa técnica do visualizador/editor próprio — 12/09/2026

Documento novo: `docs/CENTRAL-DOCUMENTOS-EDITOR-VISUAL-V1.md`.

Escopo pesquisado:
- visualização própria de PDF;
- miniaturas e drag-and-drop de páginas;
- diferença entre **Adicionar imagem como página** e **Colar imagem**;
- imagem como objeto sobre página existente;
- mover objeto dentro/entre páginas;
- quatro alças de transformação;
- resize + rotação pela alça inferior direita;
- undo/redo;
- exportação/flatten local;
- desempenho, segurança e privacidade.

Decisões principais:
- **Adicionar imagem como página** continua criando página independente e o Ctrl+V já aprovado continua associado a esse fluxo;
- **Colar imagem** é função separada: abre seletor do armazenamento do dispositivo e insere a imagem como objeto sobre a página atual;
- PDF.js será usado pela **Display Layer** para renderização, thumbnails, zoom e geometria;
- o iframe/visualizador nativo será removido progressivamente, mas mantido como fallback até a validação real;
- a `AnnotationEditorLayer` interna do PDF.js não será a base do editor porque não oferece uma API externa genérica/estável adequada ao Portal;
- `pdf-lib` permanece responsável por montagem/exportação binária e flatten dos overlays;
- o motor de interação escolhido para overlays é **DOM overlay + Pointer Events**, evitando um segundo scene graph pesado por página;
- Fabric.js e Konva.js foram avaliados e permanecem contingência, mas não são a base inicial;
- SortableJS é contingência para thumbnails caso Pointer Events próprios não entreguem touch/autoscroll suficientemente robustos;
- coordenadas dos overlays serão normalizadas pela página, não armazenadas em pixels de tela;
- mover overlay para outra página troca `pageId` e reconverte posição/tamanho relativos;
- a alça inferior direita executará transformação combinada: distância ao centro controla escala e ângulo controla rotação;
- gestos contínuos geram um único snapshot de histórico em `pointerup`;
- ao gerar o PDF final, overlays serão flattened com `pdf-lib drawImage`, preservando o PDF vetorial/textual de base;
- reeditabilidade do overlay após salvar/reabrir fica fora da Fase 3.

Segurança pesquisada:
- PDF.js teve advisories relevantes em 2024 e 2026;
- implementação deve usar versão corrigida e fixada, self-hosted;
- `enableScripting: false`;
- `isEvalSupported: false`;
- CSP sem script remoto na superfície documental;
- worker PDF.js self-hosted;
- limites de canvas/imagem para reduzir exaustão de memória;
- advisories devem ser revisados antes de cada upgrade.

Privacidade:
- imagem, coordenadas, tamanho, página, nome de arquivo e conteúdo permanecem fora do PostHog;
- somente operação genérica, duração, faixa de tamanho e status técnico podem ser observados.

Alternativas descartadas:
- continuar com iframe nativo como editor;
- rasterizar a página inteira para “simplificar” edição;
- basear o Portal em APIs internas do AnnotationEditorLayer;
- usar Fabric/Konva como primeira arquitetura sem provar necessidade.

Riscos/pontos de validação:
- conversão entre espaço visual e coordenadas PDF deve ser testada em 0/90/180/270 graus e CropBox não padrão;
- cross-page drag precisa de auto-scroll e testes touch;
- o PDF.js deve ser integrado sem reintroduzir execução de JavaScript de PDFs;
- overlay final é flattened; não ficará selecionável após reabrir o arquivo salvo.

Plano incremental definido:
- 3C.1: visualizador próprio somente leitura + thumbnails;
- 3C.2: reordenação por drag-and-drop;
- 3C.3: **Colar imagem** como overlay com mover/resize/rotação;
- 3C.4: mover overlay entre páginas;
- 3C.5: exportação/flatten integrada.

## Decisão aprovada — visualizador/editor próprio + imagens — 12/09/2026

O usuário aprovou duas mudanças estruturais para a Fase 3:

1. substituir progressivamente o visualizador PDF nativo do navegador por uma superfície própria do Portal, para permitir miniaturas controladas pelo sistema e reorganização por arrastar e soltar;
2. permitir imagens como novas páginas do PDF, incluindo captura de tela colada diretamente com **Ctrl+V**.

Justificativa:
- o iframe do visualizador nativo não permite controle confiável das miniaturas internas nem interação consistente com drag-and-drop/clipboard do Portal;
- essas funções pertencem ao escopo real de reorganização/união do editor e melhoram diretamente o fluxo operacional.

Unidade implementada nesta branch:
- `document-editor.js` aceita PNG/JPEG como fonte de página;
- a imagem é convertida localmente em página A4, com orientação automática e ajuste proporcional sem corte;
- outros formatos de imagem que o navegador consiga decodificar são convertidos localmente para PNG antes da inserção;
- novo botão **Adicionar imagem** aceita uma ou várias imagens;
- enquanto o editor está ativo, colar imagem/print com **Ctrl+V** cria nova página;
- nenhuma imagem é enviada a servidor/terceiro;
- telemetria usa apenas a operação genérica `insert_image`, sem nome, conteúdo ou dimensões clínicas;
- cache-bust de `document-editor.js` e `documents.js` atualizado.

Limitação temporária:
- enquanto o iframe nativo ainda existir, eventos de clipboard podem não chegar ao Portal se o foco estiver dentro do próprio plugin PDF do navegador;
- a substituição pelo visualizador próprio é o próximo passo arquitetural e elimina essa limitação.

## Fase 3 — implementação em andamento

Unidades 3A/3B implementadas na branch:
- `docs/CENTRAL-DOCUMENTOS-FASE-3.md` criado com escopo e critérios;
- núcleo `js/document-editor.js` com plano de páginas, histórico de até 50 snapshots, undo/redo e geração de Blob PDF;
- excluir página com trava para impedir resultado sem páginas;
- mover página para cima/baixo;
- unir outro PDF permitido à sessão local;
- visualização do resultado editado no iframe existente;
- sair do editor descarta prévia e restaura o documento original;
- clicar em outro PDF enquanto o editor está ativo oferece união ao resultado atual;
- o editor não possui rota de escrita/salvamento no Drive;
- `pdf_edit_completed` registra apenas operação, duração, faixa de tamanho e rota genérica;
- capability `edit` passa a ser administrável explicitamente em **Usuários e acessos**;
- marcar Regulador(a) **não** concede edição automaticamente;
- remover Regulador(a) revoga `view/extract/edit` explícitos associados à Central, evitando acesso residual;
- `pdf-lib 1.17.1` é carregado somente ao iniciar o editor, com URL versionada, SRI, crossorigin anônimo e no-referrer;
- CSP da Central permite somente o host fixo do jsDelivr para esse script;
- testes unitários do plano do editor foram adicionados com motor PDF simulado, incluindo exclusão, reordenação, undo/redo, união e verificação do cabeçalho `%PDF`.

Decisões:
- editor continua estritamente local na Fase 3;
- capability de edição é fina e separada do cargo Regulador(a), pois concedê-la automaticamente ampliaria permissão sem decisão individual;
- biblioteca externa não foi necessária na Fase 2 e por isso foi descartada lá; na Fase 3 a decisão foi reavaliada por necessidade de manipulação binária, mantendo versão fixa + SRI;
- falha da biblioteca afeta somente o editor; visualização/cache da Fase 2 permanecem disponíveis;
- a união usa PDFs já autorizados pela mesma navegação do Drive; nenhum seletor externo é introduzido;
- após undo de uma união, a presença do PDF é derivada do plano atual, evitando bloquear nova união por estado residual.

Alternativas descartadas:
- habilitar editor para todo Regulador(a) automaticamente;
- criar endpoints de save/upload antecipando a Fase 4;
- enviar PDF ao Worker/terceiro apenas para excluir/reordenar páginas;
- manter nome/fileId/número exato de página na telemetria;
- remover o fallback/read-only da Fase 2.

## Riscos conhecidos

- refresh token de OAuth externo em status Testing expira em prazo curto segundo Google; não usar Testing como solução de produção;
- escopo `drive` é restrito e exige processo de conformidade apropriado;
- nomes de arquivos podem conter dados identificáveis, portanto não entram em PostHog/logs;
- cache persistente ou service worker mal configurado poderia reter documento clínico; explicitamente proibido;
- o registro progressivo do Service Worker é volátil e pode desaparecer se o processo reiniciar; heartbeat de 5 s e fallback Blob mitigam esse risco;
- o comportamento do visualizador PDF nativo com Range varia entre navegadores; o teste real da Fase 2A mostrou latência de ~5,9 s e ausência de `pdf_first_page_visible`, motivando a unidade 2B;
- cache local cifrado pode consumir armazenamento do navegador; limites de 256 MB/50 MB, TTL de 12 h e LRU mitigam o risco;
- escrita concorrente futura pode sobrescrever versão externa se a comparação de `version` for omitida.

## Encerramento formal da Fase 1 — 11/09/2026

Critério do Guia Mestre: usuário autorizado consegue encontrar e abrir qualquer PDF permitido da conta sem sair do Portal.

Evidências reais:
- OAuth institucional conectado;
- navegação por Meu Drive e subpastas comprovada;
- pesquisa global comprovada pelo usuário em produção;
- abertura de PDF real autorizada comprovada dentro do Portal;
- PostHog confirmou 1 evento `drive_search_completed`, 1 `pdf_open_started` e 1 `pdf_ready` após os testes;
- propriedades observadas ficaram limitadas a metadados técnicos allowlisted: rota genérica, duração, origem, faixa de quantidade/tamanho, cache state, versão de observabilidade e propriedades técnicas do próprio PostHog;
- não foram observados nome de arquivo, fileId, nome de paciente, CPF, CNS, CID, conteúdo clínico ou conteúdo do PDF.

Conclusão: **Fase 1 encerrada**. A ausência inicial dos três eventos era atraso de ingestão/indexação, não falha funcional do pipeline. Não foi necessária correção de código para esse ponto.

Próxima fase autorizada pelo Guia Mestre: **Fase 2 — Visualização de alta performance**.

## Validação real de PDF — 11/09/2026

- Abertura de PDF real autorizada foi confirmada visualmente em produção dentro de `/documentos/`.
- O visualizador exibiu múltiplas páginas no navegador e permaneceu em modo somente leitura.
- Nenhuma escrita no Drive foi necessária para a validação.
- Imediatamente após o teste, o schema do PostHog ainda não apresentava `pdf_open_started` nem `pdf_ready`. Isso não invalida a abertura funcional do PDF, mas mantém a telemetria documental como pendência de validação.
- Não registrar nome de arquivo, conteúdo do PDF ou qualquer dado identificável no status, logs ou telemetria.

## Auditoria real de observabilidade — 11/09/2026

Consulta direta ao projeto PostHog confirmou tráfego real da Central e do Portal nas últimas 24 horas:

- `drive_folder_opened`: 12 eventos;
- `portal_page_ready`: 32 eventos;
- `portal_web_vital`: 108 eventos.

Propriedades reais observadas em `drive_folder_opened`: `duration_ms`, `cache_state`, `portal_observability_version`, `route`, `source`, `$geoip_disable` e propriedades virtuais de classificação de bot do próprio PostHog. Não foram observados nome de arquivo, fileId do Drive, nome de paciente, CPF, CNS, CID, conteúdo clínico ou conteúdo de PDF.

Propriedades reais observadas em `portal_page_ready`: `duration_ms`, `route`, `connection`, `navigation_type`, `portal_observability_version` e propriedades técnicas virtuais do PostHog.

Propriedades reais observadas em `portal_web_vital`: `value`, `metric`, `route`, `portal_observability_version` e propriedades técnicas virtuais do PostHog.

O schema real ainda não apresenta `drive_search_completed`, `pdf_open_started` nem `pdf_ready`. Isso é evidência de que pesquisa e abertura de PDF ainda não foram comprovadas em uso real nesta validação; esses dois testes continuam obrigatórios para encerrar a Fase 1.

## Métricas / observabilidade

A observabilidade-base já está operacional. A Fase 1 passa a emitir apenas `drive_folder_opened`, `drive_search_completed`, `pdf_open_started` e `pdf_ready` quando houver uso real.

`pdf_first_page_visible` não será emitido nesta fase porque o iframe nativo não oferece medição confiável da primeira página; isso fica para a Fase 2.

Nenhum conteúdo real de Drive foi enviado ao PostHog até este registro.

## Reteste real em produção — visualizador aprovado, editor ainda separado — 14/09/2026

Evidência real do usuário:
- o visualizador próprio do Portal abriu corretamente um PDF institucional;
- página principal renderizou em canvas pelo Portal;
- miniaturas próprias apareceram e renderizaram corretamente;
- o navegador não voltou ao visualizador nativo no fluxo de leitura;
- o resultado do visualizador foi considerado satisfatório pelo usuário.

Pendência observada:
- o **editor ainda permanece visualmente separado** da superfície principal;
- portanto o objetivo maior de uma experiência única de visualização + edição ainda não está concluído;
- a 3C.1 não será encerrada apenas porque a leitura PDF.js passou: a integração visual do editor continua sendo critério de aceite.

Decisão:
- considerar encerrada a investigação de compatibilidade do visualizador PDF.js iniciada na 3C.1e/3C.1f;
- manter a Fase 3 aberta;
- não iniciar 3C.2 enquanto a experiência do editor continuar separada;
- continuar a preparação do ambiente de homologação automatizado em paralelo, pois ele é infraestrutura de suporte e não substitui o critério funcional do editor.

## Staging automatizado preparado no repositório — 14/09/2026

PR #175:
- adicionou o builder `scripts/build-central-docs-staging.mjs`;
- adicionou o workflow `Validar bundle de staging da Central`;
- adicionou a documentação operacional `docs/CENTRAL-DOCUMENTOS-STAGING-OPERACIONAL-V1.md`;
- o bundle gerado contém apenas laboratório sintético, PDF.js e arquivos mínimos;
- nenhuma integração com Google Drive, D1 de produção ou documentos clínicos é incluída;
- referências explícitas ao Worker de produção e nomes de segredos críticos fazem o build falhar;
- `robots.txt`, `X-Robots-Tag`, `no-store` e CSP restritiva são aplicados;
- o smoke test HTTP do bundle foi aprovado.

Validação:
- **22/22 workflows do PR #175 concluíram com sucesso**;
- merge squash concluído na `main` em `3793d61307d0c55b7b5cdf37bcddc4995e6cdce5`.

Estado real do ambiente de homologação:
- **camada de código e CI: pronta**;
- **bundle sintético isolado: pronto e validado**;
- **Cloudflare Pages: criado e validado** em `https://portal-regulacao-central-staging.pages.dev/`;
- **preview remoto por branch: criado e validado** sem merge experimental;
- **Cloudflare Access: pendente**, pois Access não está habilitado na conta e sua inicialização exige decisões humanas de identidade e política;
- **subdomínio de staging: pendente**, pois a zona `regulacaoeldoradoms.com.br` não está acessível nesta conexão;
- **Worker/D1 staging: não necessários nesta primeira versão e continuam não criados**.

Próximo passo exato desta infraestrutura:

1. concluir a PR documental de registro;
2. obter a decisão humana sobre identidade e política do Cloudflare Access;
3. habilitar Access e repetir o smoke test autenticado;
4. associar o domínio personalizado quando a zona estiver acessível.

## Preparação do staging remoto sintético — 14/09/2026

Objetivo:
- permitir validação visual/remota sem expor o Portal completo nem conectar Google Drive, D1 ou documentos clínicos;
- preparar o código agora e deixar apenas a criação dos recursos Cloudflare para o Work/Codex.

Entregas na branch `infra/central-docs-staging-bundle`:
- `scripts/build-central-docs-staging.mjs` cria `dist-staging` com **somente** o laboratório sintético, CSS, visualizador e assets PDF.js necessários;
- o bundle exclui deliberadamente frontend autenticado, endpoints do Worker de produção e segredos;
- `robots.txt`, `X-Robots-Tag`, `no-store` e CSP restritiva são gerados para o ambiente;
- o builder falha se detectar origem do Worker de produção ou nomes de segredos críticos;
- workflow `Validar bundle de staging da Central` constrói o bundle, valida isolamento e executa smoke test HTTP;
- `docs/CENTRAL-DOCUMENTOS-STAGING-OPERACIONAL-V1.md` registra a configuração exata a aplicar no Cloudflare Pages.

Resultado remoto posterior:

- o projeto isolado `portal-regulacao-central-staging` foi criado no Cloudflare Pages;
- a integração GitHub, o build de `main` e o preview separado por branch foram comprovados;
- cabeçalhos, noindex, três páginas, controles e isolamento de rede foram validados em desktop e mobile;
- Access e domínio personalizado permanecem pendentes pelas limitações registradas na seção autoritativa de homologação remota acima.

Esta infraestrutura é de suporte e não encerra a pendência funcional da integração visual do editor. A 3C.2 continua bloqueada.

## 3C.1f validada em navegador, mesclada e publicada — 14/09/2026

PR #173:
- causa da falha real reproduzida automaticamente: o build moderno do PDF.js 6.3.289 exigia `Map.prototype.getOrInsertComputed`, indisponível no Chromium operacional/testado;
- PDF.js permaneceu na versão **6.3.289**, mas módulo principal e worker passaram ao **build legacy oficial da mesma versão**;
- módulo e worker legacy estão self-hosted em `vendor/pdfjs-legacy/`;
- CMaps, fontes padrão, WASM e ICCs continuam self-hosted e pareados na mesma versão;
- o caminho novo evita reaproveitar cache do build moderno incompatível;
- `enableScripting:false` e `isEvalSupported:false` foram preservados;
- não foi introduzido polyfill global;
- laboratório Playwright com PDF 100% sintético foi adicionado para Chromium desktop e mobile;
- testes cobrem Blob e URL, primeira página, miniatura, canvas real, zoom, Ajustar largura, callback de primeira página visível e navegação por miniaturas;
- falhas futuras geram trace, screenshot e vídeo sem usar dados clínicos.

Validação:
- **22/22 workflows do PR #173 concluíram com sucesso**;
- o novo workflow **Validar Central de Documentos — navegador** passou em desktop e mobile;
- merge squash concluído na `main` em `a22ddbdd85302a3c2635b5656715cb9af74e1561`;
- **23/23 workflows pós-merge concluíram com sucesso**, incluindo `pages build and deployment`;
- a correção já está publicada.

Governança:
- a 3C.1 ainda não está formalmente encerrada até o reteste real em produção;
- 3C.2 permanece bloqueada;
- o ambiente remoto de homologação Cloudflare ainda não foi criado; a camada local/CI já está pronta e a continuação remota deve usar o MCP oficial `cloudflare-api` autenticado no Work/Codex, com dados exclusivamente fictícios e isolamento de produção.

Próxima ação exata:
1. fazer `Ctrl+F5` em `/documentos/`;
2. abrir um PDF real autorizado;
3. confirmar página 1 e miniatura no visualizador próprio;
4. testar zoom e **Ajustar largura**;
5. abrir um segundo PDF;
6. entrar no editor;
7. se passar, registrar aceite da 3C.1 e então completar staging remoto/preview antes de iniciar 3C.2.

## Diagnóstico automatizado da falha 3C.1e — 14/09/2026

O novo laboratório reproduziu a falha do visualizador sem usar qualquer documento clínico.

Evidência:
- Chromium desktop e mobile falharam antes da primeira página com `this[#Yr].getOrInsertComputed is not a function`;
- os assets PDF.js self-hosted estavam presentes e carregaram, portanto a falha não era ausência do módulo/worker;
- a exceção ocorre no build moderno do PDF.js 6.3.289, que usa uma API de `Map` mais nova que o Chromium operacional/testado;
- isso explica por que os checks estáticos anteriores ficaram verdes enquanto o navegador real falhou.

Decisão técnica:
- manter PDF.js **6.3.289**, preservando a versão de segurança já aprovada;
- substituir somente o módulo principal e o worker pelo **build legacy oficial da mesma versão**, destinado pelo próprio PDF.js a navegadores anteriores;
- manter CMaps, fontes padrão, WASM e ICCs self-hosted da mesma versão;
- usar caminhos novos `/vendor/pdfjs-legacy/` para não reutilizar cache do build moderno incompatível;
- manter `enableScripting:false` e `isEvalSupported:false`;
- não adicionar polyfill global ao Portal enquanto o build legacy oficial resolver a compatibilidade, evitando ampliar comportamento global desnecessariamente.

Implementação na branch:
- build legacy oficial 6.3.289 vendorizado a partir do pacote `pdfjs-dist@6.3.289`;
- `js/document-viewer.js` aponta para módulo e worker legacy;
- cache-bust do visualizador renovado;
- CI de navegador cobre fonte Blob e fonte URL sintética em desktop e mobile.

Estado:
- o primeiro laboratório reproduziu a exceção `getOrInsertComputed` do build moderno;
- após a troca para o build legacy oficial e correção da própria fixture/harness de teste, o workflow **Validar Central de Documentos — navegador** concluiu com sucesso em Chromium desktop e mobile;
- foram validadas fonte Blob e fonte URL sintética, página 1, miniatura, canvases reais, zoom, Ajustar largura, callback de primeira página visível e navegação por miniatura;
- o workflow temporário usado apenas para vendorização do build legacy foi removido após os assets ficarem versionados;
- a correção está tecnicamente validada em navegador automatizado, mas **3C.1 ainda depende do reteste real em produção após merge/deploy**;
- 3C.2 continua bloqueada até esse aceite real.

## Infraestrutura de laboratório de navegador iniciada — 14/09/2026

Motivação:
- o reteste real da 3C.1e falhou mesmo com CI anterior verde;
- os checks existentes não reproduziam o PDF.js real em navegador;
- a 3C.2 continua bloqueada até a 3C.1 ser corrigida e aceita.

Branch de suporte atual:
- `infra/central-docs-browser-lab`, criada diretamente da `main` em `1878fdf4331dc1a8566822d9ac442799d931b0d9`;
- PR #173 aberto para laboratório + correção de compatibilidade;
- nenhuma alteração desta branch está em produção.

Entregas desta unidade:
- laboratório `testing/central-docs/viewer-harness.html` usando o mesmo `js/document-viewer.js` e os assets PDF.js self-hosted;
- fixture PDF 100% sintética, com três páginas e variações de orientação/rotação;
- Playwright configurado para Chromium desktop e perfil mobile;
- teste E2E verifica página 1, miniatura, canvas real, callback de visibilidade, zoom, Ajustar largura e navegação por miniatura;
- erros geram trace, screenshot e vídeo como artefatos de CI;
- workflow `Validar Central de Documentos — navegador` criado sem deploy;
- documentação `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-V1.md` registra arquitetura, privacidade e próximos passos.

Privacidade e segurança:
- o laboratório não acessa Google Drive, D1 de produção ou documentos clínicos;
- não usa nomes, identificadores ou conteúdo real;
- não contém segredos e não publica nada em produção.

Próximo passo desta infraestrutura:
- abrir PR da branch e executar o novo workflow;
- corrigir qualquer falha do próprio laboratório até obter um baseline verde;
- quando o ambiente Cloudflare estiver disponível no Work/Codex, criar staging remoto isolado e previews por branch/PR com dados exclusivamente fictícios;
- depois usar o laboratório para diagnosticar/corrigir a falha atual da 3C.1e.

## Próximo passo

1. concluir a revisão da PR da branch `codex/central-docs-editor-superficie-unica` e aguardar os checks obrigatórios;
2. registrar o aceite humano do preview sintético da superfície única;
3. somente após merge/deploy, executar reteste real autorizado com PDF institucional, incluindo entrada/saída do editor, zoom, **Ajustar largura**, navegação por miniatura e todas as mutações da 3C.1;
4. confirmar novamente que o visualizador nativo continua ausente;
5. manter **3C.2 — drag-and-drop das páginas** bloqueada até o aceite explícito desse reteste.

## Arquivos e fontes principais

- `docs/CENTRAL-DOCUMENTOS-ARQUITETURA-V1.md`
- `docs/CENTRAL-DOCUMENTOS-EDITOR-VISUAL-V1.md`
- `docs/CENTRAL-DOCUMENTOS-STATUS.md`
- `docs/CENTRAL-DOCUMENTOS-FASE-1.md`
- `documentos/index.html`
- `js/documents.js`
- `worker/document-access.js`
- `worker/document-drive.js`
- `worker/documents-router.js`
- `PORTAL-ARQUITETURA.md`
- `docs/PORTAL-OBSERVABILIDADE-POSTHOG-V1.md`
- `js/tools-catalog.js`
- `worker/auth-management-flex.js`
- `worker/index.js`
- `worker/wrangler.toml`
- Guia Mestre — Central de Documentos V1.1

## Handoff para o próximo chat

**Fase atual:** Fase 3 — Editor PDF essencial.

**Subfase:** 3C.1 — superfície única do visualizador/editor implementada e aprovada no staging sintético; aceite humano, merge e reteste real pós-deploy ainda pendentes. A 3C.2 continua bloqueada.

**Main confirmada antes desta unidade:** `7c25797d2a5c73aa389f064c35b95a3b67b6e0ba`, descendente da referência esperada `313101db4b6fb34ea503205e6cfa55a1c71864f8`.

**Staging:** `portal-regulacao-central-staging` em `https://portal-regulacao-central-staging.pages.dev/`, com bundle sintético e sem bindings, Functions ou secrets.

**Preview:** branch separada validada automaticamente em `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`; deployment funcional imutável `https://dfe80b5e.portal-regulacao-central-staging.pages.dev/`, sem merge experimental.

**Access:** pendente; staging público até definição humana de identidade/política.

**Domínio personalizado:** pendente por ausência de acesso à zona.

**Produção:** Worker `yellow-wave-d0a1guia-regulacao-ia` e D1 `portal-regulacao-users` permaneceram intocados.

**Próxima ação exata:** revisar a PR funcional e registrar o aceite humano; após merge/deploy, executar o reteste real autorizado da 3C.1. Tratar Access e domínio personalizado em tarefa separada e manter a 3C.2 bloqueada até o aceite explícito.


## 3C.1 — P2 de preservação do estado vivo em rebuild — 14/09/2026

Descoberta:
- a revisão automática do PR #179 encontrou um P2 após a correção da corrida P1;
- `buildEditorPreview()` priorizava `state.editorViewState` (snapshot do `onReady`) antes de `currentViewerState()`;
- após o usuário navegar ou alterar zoom dentro do editor, um rebuild sem estado explícito poderia regressar para página/zoom antigos.

Correção aplicada na própria branch do PR #179:
- estado explícito continua tendo prioridade;
- sem estado explícito, o rebuild passa a priorizar `currentViewerState()` e usa `state.editorViewState` apenas como fallback;
- o laboratório sintético foi alinhado à mesma ordem de prioridade;
- o botão de atualização do laboratório passa a exercitar o fallback real, sem injetar estado explícito;
- teste Playwright cobre preservação de página ativa e zoom após atualização e após uma edição que dispara rebuild;
- teste estático impede regressão da ordem de fallback no cliente real.

Estado desta unidade:
- alteração preparada no PR #179 sem merge;
- produção permanece inalterada;
- CI, novo preview remoto e revisão final ainda precisam concluir antes de qualquer merge;
- 3C.2 continua bloqueada.

Próximo passo exato:
1. aguardar GitHub Actions do novo head;
2. confirmar preview Cloudflare automático da branch;
3. executar/confirmar Playwright remoto no novo deployment;
4. obter nova revisão sem P1/P2;
5. somente então submeter o PR #179 à revisão humana final e eventual merge.


## 3C.1 — correção das próprias asserções de homologação do P2 — 14/09/2026

Resultado do primeiro CI do head `1161fe46f4be6f8966c06a5e012a2a335750eccc`:
- a implementação do P2 estava presente no cliente real, mas a asserção estática adicionada usou uma expressão regular excessivamente escapada e produziu falso negativo;
- os workflows que executam a suíte Worker completa herdaram a mesma única falha, por isso cinco checks não relacionados apareceram vermelhos sem regressão funcional nesses módulos;
- o Playwright novo chegou ao rebuild de união, mas a expectativa de `data-page-order` usou índice de documento `2`; o harness real identifica o segundo PDF sintético como documento `1`, portanto a expectativa correta é `0:0,0:1,0:2,1:0,1:1,1:2`;
- os 12 cenários anteriores do navegador passaram; somente o cenário novo do P2 falhou por essa expectativa incorreta, em desktop e mobile.

Correção:
- o teste estático passou a comparar strings literais, evitando ambiguidade de escaping;
- o teste Playwright passou a esperar a ordem efetivamente gerada pelo editor sintético;
- nenhuma mudança adicional foi feita no comportamento de produção nesta correção de CI.

Próximo passo:
1. aguardar a nova rodada completa de GitHub Actions;
2. confirmar o novo deployment de preview da branch;
3. se tudo ficar verde, manter o PR aberto até revisão final/aceite humano;
4. a revisão automática Codex permanece indisponível apenas por limite de uso, não por falha técnica do PR.


## 3C.1 — restauração robusta de página ativa após rebuild — 14/09/2026

Descoberta no CI após a correção do P2:
- o teste de preservação de página/zoom deixou de falhar por expectativa incorreta e revelou um comportamento real do visualizador;
- `PortalPdfViewer.open()` aplicava `initialViewState.activePage`, porém instalava os `IntersectionObserver` antes de restaurar a posição de rolagem;
- como o novo DOM começava no topo, o observer podia promover a página 1 a ativa antes do `requestAnimationFrame` que tentava rolar para a página solicitada;
- em rebuilds como união de PDF, a página ativa podia portanto regressar para 1 mesmo com `initialViewState.activePage = 2`.

Correção:
- a posição inicial do scroll passa a ser restaurada **antes** da instalação dos observers;
- o mesmo viewport é reaplicado no próximo frame para absorver ajuste de layout;
- a página ativa solicitada é reafirmada junto com a restauração do scroll;
- página 1 também força `scrollTop = 0`, evitando herdar posição da sessão anterior;
- o marcador interno do visualizador foi avançado para `phase3c1i`;
- nenhuma API, permissão, escrita no Drive ou integração de produção foi alterada.

Validação pendente desta microcorreção:
- nova rodada do workflow de navegador em desktop/mobile;
- confirmação de que o teste de página/zoom passa após `Atualizar PDF` e após união/rebuild;
- demais checks devem permanecer verdes;
- PR #179 continua sem merge e 3C.2 continua bloqueada.


## 3C.1 — segunda rodada P2: paridade do harness + guarda de página inicial — 14/09/2026

Evidência do workflow de navegador após o head `7dfc0d9`:
- os checks estáticos e as suítes gerais ficaram verdes, mas o navegador revelou que a primeira tentativa de restaurar o viewport ainda não era determinística;
- em rebuilds, `data-active-page` podia voltar para 1 ao atualizar, inserir imagem ou unir PDF;
- o teste de corrida também ficou instável em alguns cenários após a tentativa anterior de reposicionar o scroll diretamente.

Causas reconciliadas:
1. o **harness** não reproduzia exatamente o cliente real: calculava o fallback `viewer.getViewState()` somente depois de `editor.buildBlob()`; o cliente real captura o estado antes do await;
2. no **visualizador**, o `IntersectionObserver` de página ativa podia emitir callbacks durante a restauração inicial do scroll e sobrescrever temporariamente a página solicitada.

Correção desta rodada:
- o harness captura `preservedViewState` antes do build assíncrono, igualando a ordem do cliente real;
- o visualizador mantém uma guarda `initialPageTarget` durante a montagem inicial;
- os observers continuam coletando interseções, mas não podem trocar a página ativa enquanto a guarda está vigente;
- o alvo inicial usa `scrollIntoView({ behavior: 'auto' })` e é reafirmado por dois frames;
- ao finalizar a restauração, os ratios transitórios são limpos e a guarda é liberada;
- marcador interno avançado para `phase3c1j`.

Alternativa descartada:
- apenas escrever `scrollTop` antes/depois da instalação dos observers. O CI mostrou que isso não estabilizava todos os layouts e ainda introduzia flakiness no teste de concorrência.

Estado:
- PR #179 continua aberto e sem merge;
- produção permanece inalterada;
- nova rodada completa de CI/navegador é obrigatória;
- 3C.2 continua bloqueada.


## 3C.1 — terceira rodada P2: neutralização do scroll suave no restore — 14/09/2026

Evidência do head `dacf9494`:
- as suítes gerais permaneceram verdes e o workflow de navegador reduziu para **uma única falha**: preservação de página/zoom após rebuild no desktop;
- o estado ainda regressava de página 2 para página 1 após `Atualizar PDF`;
- a causa remanescente foi localizada no CSS: `.documents-pdf-scroll` usa `scroll-behavior: smooth`. Assim, `scrollIntoView({ behavior: 'auto' })` continuava sujeito ao comportamento suave computado do contêiner; a guarda era liberada antes de o deslocamento terminar.

Correção:
- durante a restauração inicial, o visualizador neutraliza temporariamente o `scroll-behavior` inline para `auto`;
- calcula o deslocamento da página-alvo em relação ao viewport rolável e aplica `scrollTop`/ `scrollLeft` de forma imediata;
- restaura em seguida o estilo inline anterior, preservando a navegação suave normal do usuário;
- mantém a guarda `initialPageTarget` e as reafirmações em dois frames;
- marcador interno avançado para `phase3c1k`.

Risco controlado:
- a mudança afeta somente a montagem/restauração de uma sessão do visualizador; cliques normais em miniaturas continuam usando a navegação suave existente.

Próximo passo:
- repetir o workflow de navegador em desktop/mobile; não fazer merge até a matriz ficar integralmente verde.


## Consolidação 3C.1 antes do aceite humano — 14/09/2026

Estado funcional validado no head `b02f2addf6eba16f383cc8ff7804c6eaee0b7879` do PR #179:

- base confirmada: `main` em `5859b77fc80e17ffdf98f9e6fb3fa34bc37721c3`;
- PR mergeável e mantido **sem merge**;
- **24/24 workflows GitHub verdes**;
- workflow `Validar Central de Documentos — navegador`: **14/14**, Chromium desktop + Pixel 7;
- P1 de concorrência de abertura: corrigido, testado e thread resolvida;
- P2 de preservação de estado vivo: corrigido, testado e thread resolvida;
- o P2 levou à descoberta adicional de interação entre `IntersectionObserver` e `scroll-behavior: smooth`; a solução final neutraliza o scroll suave somente durante o restore inicial e preserva o comportamento suave normal do usuário;
- preview Cloudflare do head funcional: `https://cd41605e.portal-regulacao-central-staging.pages.dev/`;
- alias da branch: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`;
- produção, Worker `yellow-wave-d0a1guia-regulacao-ia`, D1 `portal-regulacao-users` e Google Drive permaneceram intocados.

Revisão manual complementar:
- PDF.js e PDF-lib permanecem self-hosted;
- CSP da Central não depende de CDN externa para o editor;
- `can_edit` continua explícito e separado do cargo/papel Regulador(a);
- não foi introduzida rota de upload/update/replace nem evento de save/sync para o Drive;
- o staging continua sintético, sem bindings, Functions, secrets ou dados clínicos;
- não foi identificado bloqueador adicional no diff após a matriz automatizada final.

Limitação externa:
- a nova revisão automática Codex do head final não pôde ser executada porque a cota de code review foi atingida. Isso é indisponibilidade temporária da ferramenta, não evidência técnica contra o PR;
- a última revisão automática disponível encontrou o P2; ele foi endereçado e sua thread está resolvida com evidência 14/14.

Decisão:
- **não fazer merge ainda**;
- aguardar o aceite humano visual do preview e, quando a cota restaurar, solicitar revisão automática final do head corrente;
- 3C.2 permanece bloqueada.

## Handoff autoritativo atual — 14/09/2026

**Fase:** Fase 3 — Editor PDF essencial.

**Subfase:** 3C.1 — superfície única implementada e tecnicamente homologada em ambiente sintético; faltam aceite humano do preview, revisão final disponível e reteste institucional pós-merge/deploy.

**Main/base confirmada:** `5859b77fc80e17ffdf98f9e6fb3fa34bc37721c3`.

**PR:** #179, branch `codex/central-docs-editor-superficie-unica`, aberto e sem merge.

**Head funcional homologado:** `b02f2addf6eba16f383cc8ff7804c6eaee0b7879`. A consolidação documental posterior não altera runtime; ao retomar, consultar o head corrente do PR no GitHub.

**Staging:** `portal-regulacao-central-staging`; alias da branch `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`.

**Evidência imutável do runtime homologado:** `https://cd41605e.portal-regulacao-central-staging.pages.dev/`.

**Access:** pendente; enquanto isso, staging deve permanecer estritamente sintético.

**Domínio personalizado:** pendente por ausência de acesso à zona.

**P1/P2:** ambos corrigidos e threads resolvidas.

**Próxima ação humana exata:** abrir o alias da branch em desktop e, se possível, celular; confirmar visualmente que **Editar PDF** mantém o usuário na mesma superfície PDF.js, que miniaturas/controles aparecem integrados e que não existe editor textual separado. Não usar documento real no staging.

**Depois do aceite:** solicitar revisão automática final quando a cota Codex voltar; com revisão/checks limpos, considerar merge. Após deploy, executar o roteiro institucional de smoke test. Somente o aceite pós-produção encerra 3C.1 e libera 3C.2.


## Revisão de aceite do usuário — drag-and-drop + rotação de páginas — 14/09/2026

Evidência humana no preview do PR #179:
- a superfície única foi confirmada visualmente, porém o usuário **não aceitou o editor como concluído**;
- a reorganização ainda estava exposta por setas ↑/↓, enquanto o requisito original era clicar/arrastar a miniatura para a posição desejada;
- foi identificada ausência de comando para girar página; o caso concreto foi a página sintética em paisagem que precisa poder ser girada para retrato.

Decisão de escopo:
- o Guia Mestre define na Fase 3 a capacidade de **reorganizar páginas**; a forma de interação agora fica explicitamente fixada pelo requisito humano mais recente como **drag-and-drop**, não setas;
- a antiga separação local que tratava drag-and-drop como “3C.2 futura” é revista: não faz sentido declarar a experiência do editor aceita sem a interação já solicitada;
- rotação de página entra como operação essencial do editor por necessidade operacional demonstrada no próprio preview;
- PR #179 permanece aberto e sem merge até novo aceite visual.

Implementação desta rodada:
- setas de mover são removidas da interface;
- miniaturas passam a ser arrastáveis no desktop; um grip de arraste também suporta Pointer Events para interação touch;
- drop antes/depois de outra miniatura calcula a posição final exata e aciona `movePageTo()`;
- botão ↻ gira a página selecionada em incrementos de 90° para a direita;
- rotação passa a integrar o plano reversível do editor e portanto participa de Desfazer/Refazer;
- `buildBlob()` aplica a rotação via PDF-lib ao PDF gerado;
- telemetria técnica usa apenas `reorder_page` e `rotate_page`, sem conteúdo documental;
- nenhum salvamento no Drive é introduzido.

Critérios de aceite adicionais:
1. não existir mais ↑/↓ para reordenar;
2. arrastar página 2 para antes da página 1 deve alterar ordem visual e PDF gerado;
3. ↻ deve trocar orientação visível em 90°;
4. Desfazer/Refazer deve restaurar/aplicar rotação e reordenação;
5. desktop e mobile devem permanecer sem erros de console;
6. nenhuma operação pode escrever no Google Drive nesta fase.

Próximo passo:
- executar CI completo e gerar novo preview Cloudflare;
- solicitar novo reteste humano de arrastar e girar;
- manter o merge bloqueado até esse aceite.


## CI do primeiro drag/rotate — correção de interação de teste — 14/09/2026

Resultado do head `ae22ad9`:
- suíte estática/Worker e Fases 1–3: aprovadas;
- navegador: 13 cenários passaram e 3 falharam;
- rotação unitária passou; a falha visual de rotação ocorreu porque o teste tentava medir a página 3 antes de ela entrar na janela de renderização progressiva;
- drag-and-drop não foi acionado por `Locator.dragTo()` no ambiente emulado, embora a UI já tivesse listeners nativos.

Ajuste:
- o teste de rotação agora navega para a página 3 antes de medir orientação;
- o visualizador passa a aceitar Pointer Events no corpo da miniatura para mouse/pen com limiar de 7 px, além do grip já usado para touch;
- o teste de arraste passa a usar gesto real de mouse (down → move em etapas → up), cobrindo a interação solicitada pelo usuário;
- o drag HTML5 permanece como fallback;
- nenhuma mudança de backend, Drive ou produção.

Próximo passo:
- repetir CI completo e só apresentar novo preview ao usuário após a matriz de navegador ficar verde.


## CI do drag/rotate — conflito drag HTML5 × Pointer Events — 14/09/2026

Resultado do head `d1b37ad`:
- rotação passou no navegador após a página-alvo ser renderizada;
- 14/16 cenários passaram;
- as duas falhas restantes foram exclusivamente o gesto de reordenação em desktop/mobile;
- o plano/editor e os testes unitários de `movePageTo()` já estavam aprovados, isolando o defeito na camada de interação.

Diagnóstico:
- a miniatura estava simultaneamente marcada como `draggable=true` (drag HTML5) e submetida a `pointerdown/move/up` com pointer capture;
- o navegador pode promover o gesto para drag nativo e cancelar/interromper a sequência de Pointer Events antes do drop calculado;
- isso explica a ausência de alteração no `data-page-order` sem erro no editor.

Correção:
- drag HTML5 deixa de ser o mecanismo ativo da miniatura;
- a reordenação passa a usar exclusivamente Pointer Events no desktop/mouse/pen;
- no touch, o grip ⠿ continua sendo o ponto de arraste com `touch-action:none`;
- o comportamento de clique para navegar continua separado pelo limiar de movimento de 7 px.

Próximo passo:
- repetir a matriz de navegador; merge continua bloqueado.


## Drag-and-drop + rotação — homologação técnica concluída — 14/09/2026

Head funcional validado: `ec518dc024ec79ea5ab52012082bcc68cdb99d36`.

Resultado:
- **24/24 workflows GitHub verdes**;
- `Validar Central de Documentos — navegador`: **16/16 testes aprovados em 34,3 s**;
- matriz executada em Chromium desktop e perfil Pixel 7;
- drag-and-drop por Pointer Events aprovado em desktop e mobile emulado;
- setas ↑/↓ não são mais o mecanismo de reorganização;
- botão ↻ aprovado para giro de 90°;
- rotação participa corretamente de Desfazer/Refazer;
- excluir, imagem, união, preservação de página/zoom e corrida A → B → C continuam aprovados;
- Fases 1–3, governança, bundle de staging e demais checks permaneceram verdes;
- produção e Google Drive não foram alterados.

Cloudflare Pages:
- deployment do head funcional: sucesso;
- URL imutável: `https://7c94b5a6.portal-regulacao-central-staging.pages.dev/`;
- alias da branch: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`;
- staging continua exclusivamente sintético e sem bindings/secrets.

Aceite:
- **homologação técnica automatizada concluída para este incremento**;
- aceite humano ainda pendente: o usuário deve testar visualmente arrastar página para posição diferente e girar a página paisagem;
- PR #179 continua aberto e sem merge;
- nenhum avanço para sincronização com Drive ocorre antes do aceite humano da experiência atual.

Próximo passo exato:
1. usuário abrir o preview imutável `7c94b5a6...`;
2. entrar no editor;
3. arrastar uma miniatura para outra posição e confirmar a ordem;
4. usar ↻ na página 3 e confirmar paisagem → retrato;
5. testar Desfazer/Refazer;
6. registrar aceite ou nova correção;
7. somente depois decidir merge/deploy e executar reteste institucional real.


## Aceite humano parcial do drag-and-drop — 14/09/2026

Evidência do preview `7c94b5a6.portal-regulacao-central-staging.pages.dev`:
- o usuário confirmou que agora consegue **mover a posição das páginas arrastando**;
- a interação foi considerada conceitualmente correta e superior às antigas setas;
- o usuário observou, porém, que o arraste **ainda não parece suficientemente fluido**;
- por preferência operacional, o usuário enviará capturas do Lumin como referência de comportamento/UX para o refinamento.

Interpretação:
- a capacidade funcional de reordenação por arraste está aceita;
- a experiência de interação ainda não está aceita como final;
- não fazer merge com base apenas na funcionalidade atual; primeiro comparar a dinâmica de arraste, feedback visual, alvo de inserção e sensação de movimentação com as referências fornecidas pelo usuário;
- a referência externa deve orientar comportamento e ergonomia, sem copiar identidade visual proprietária.

Próximo passo exato:
1. receber as capturas/etapas do Lumin;
2. decompor o comportamento observado em estados de interação: repouso, início do drag, deslocamento, indicador de inserção, auto-scroll, soltura e animação pós-drop;
3. implementar somente os refinamentos compatíveis com a arquitetura atual;
4. repetir Playwright e novo aceite visual humano;
5. PR #179 permanece aberto e sem merge.


## Editor UX V2 autorizado — referência Lumin convertida em requisitos — 15/09/2026

Decisão humana:
- o usuário aprovou iniciar a reformulação do editor usando o Lumin como referência de ergonomia, **sem copiar identidade visual**;
- visualização normal continua com páginas grandes;
- ao editar estrutura, a superfície deve mudar para **grade de páginas**, com drag-and-drop fluido;
- ações por página ficam contextuais em hover/foco: girar esquerda, girar direita, duplicar e excluir;
- Unir deve permitir inserir antes do documento, depois do documento ou após página específica;
- inserir página em branco passa a integrar o organizador;
- ferramentas futuras da mesma experiência: Escrever, Colar imagem, Recortar e Desenhar;
- a borracha de Desenhar apaga exclusivamente traços feitos pela caneta, nunca conteúdo original do PDF;
- botões devem migrar para ícones compactos com tooltip sempre que isso reduzir ocupação visual.

Arquitetura/escopo:
- criada a especificação `docs/CENTRAL-DOCUMENTOS-EDITOR-UX-V2.md`;
- a Fase 3 permanece local/reversível e **sem escrita no Google Drive**;
- a antiga ideia de considerar o editor aceito apenas com miniaturas laterais foi superada pelo aceite humano mais recente;
- PR #179 continua aberto e sem merge.

Implementação iniciada:
- motor do editor passa a aceitar posição de inserção ao unir documentos;
- adicionadas primitivas locais para página em branco e duplicação de página;
- essas APIs ainda precisam ser conectadas à nova superfície visual e homologadas antes de qualquer merge.

Próximo passo exato:
1. implementar shell compacto + modo Organizar em grade;
2. conectar drag, girar esquerda/direita, duplicar, excluir e página em branco;
3. implementar painel de Unir com posição de inserção;
4. atualizar laboratório e Playwright;
5. publicar novo preview Cloudflare;
6. solicitar novo aceite visual antes de avançar para Escrever/Imagem/Recortar/Desenhar.


## Organizar V2 — primeira implementação funcional em branch — 15/09/2026

Implementado no PR #179, ainda sem merge:
- shell compacto por ícones e acesso lateral **Editar**;
- modo Organizar altera a representação principal para grade responsiva;
- miniaturas maiores, drag ghost, indicador de inserção e drop horizontal na grade;
- ações contextuais por página: girar esquerda, girar direita, duplicar e excluir;
- página em branco local/reversível;
- motor de união aceita posição de inserção;
- painel de união oferece antes do documento, depois do documento e após página específica;
- Recortar, Escrever, Colar imagem overlay e Desenhar aparecem apenas como próximos modos desabilitados; ainda não são declarados implementados;
- Service Worker/cache versionado para evitar servir a UI antiga após futura promoção.

Testes foram atualizados para a UX V2; CI completo deve ficar verde antes de gerar o preview candidato a aceite humano.


## Organizar V2 — refinamento de fluidez do arraste — 15/09/2026

Ajuste aplicado antes do primeiro preview V2:
- o ghost de arraste agora copia os pixels reais do canvas da miniatura; `cloneNode()` sozinho não preserva bitmap de canvas e poderia produzir um cartão fantasma vazio;
- a página de origem recebe feedback de escala/opacidade enquanto é movida;
- o ghost acompanha o ponteiro sem capturar eventos;
- clicar numa página no modo grade apenas seleciona a página; não tenta rolar a superfície grande que está oculta;
- o botão legado **Editar PDF** do cabeçalho deixa de ser visualmente redundante; o acesso principal passa a ser o ícone lateral Editar, preservando o nó legado por compatibilidade interna.


## Homologação humana do Organizar V2 — correção de posicionamento do drag e escopo do editor — 15/09/2026

Feedback humano no preview imutável `198c6ffe.portal-regulacao-central-staging.pages.dev`:
- a grade e o arraste estão funcionais, porém o cartão flutuante fica deslocado do cursor/dedo; o ponteiro aparece no canto superior esquerdo do ghost em vez de ficar centralizado sobre a página arrastada;
- o usuário também rejeitou tratar o Organizar V2 isolado como editor final, pois ainda espera as ferramentas já definidas: **Escrever, Colar imagem sobre página, Recortar e Desenhar**;
- **Inserir página em branco já existe tecnicamente no Organizar V2**, mas o fato de não ter sido reconhecida no preview evidencia problema de descobribilidade do ícone/tooltips, que deverá ser refinado junto da barra final.

Correção aplicada ao drag:
- o ghost passa a usar metade da largura/altura do cartão como offset, mantendo cursor/dedo no centro visual da página durante o arraste;
- offsets do ghost são limpos em todo cancelamento/drop/close;
- Playwright passa a verificar geometricamente que o centro do ghost coincide com o ponteiro dentro de tolerância pequena.

Decisão de aceite atualizada:
- o Organizar V2 continua sendo uma unidade técnica necessária, mas **não é mais um ponto de parada para declarar o editor aceito**;
- a Fase 3 só poderá receber aceite visual global depois que Escrever, Colar imagem overlay, Recortar e Desenhar/Borracha estiverem implementados e integrados na mesma experiência;
- a borracha permanece restrita aos traços feitos por Desenhar;
- PR #179 permanece aberto; sem merge e sem escrita no Drive.

Próximo passo:
1. validar a centralização do ghost em desktop/mobile;
2. manter o Organizar estável;
3. avançar dentro da própria Fase 3 para os objetos sobre página (Escrever + Colar imagem);
4. depois Recortar;
5. depois Desenhar/Borracha;
6. só então solicitar homologação visual do editor como conjunto.


## Aceite humano do arraste centralizado — Organizar V2 — 15/09/2026

Feedback humano no preview `18f60df9.portal-regulacao-central-staging.pages.dev`:
- o usuário confirmou que o novo posicionamento do drag ficou bom;
- a correção que mantém o ghost centralizado sob o cursor/dedo foi aceita visualmente;
- a observação anterior sobre “faltar página em branco” foi retirada pelo próprio usuário: a função já está presente;
- o usuário também reconheceu como correto que **Escrever, Colar imagem sobre página, Recortar e Desenhar** permaneçam para as próximas subetapas da mesma Fase 3, conforme o plano UX V2.

Validação técnica do head anterior `3e99d71b2ade084bde0255f57779b0832b5ef494`:
- 24/24 workflows GitHub verdes;
- `Validar Central de Documentos — navegador`: sucesso;
- `Validar Central de Documentos — Fases 1–3`: sucesso;
- PR #179 segue aberto, mergeável e sem merge;
- `main` permanece em `5859b77fc80e17ffdf98f9e6fb3fa34bc37721c3`;
- nenhuma escrita no Google Drive foi introduzida.

Decisão:
- o arraste do Organizar V2 está aceito visualmente;
- o Organizar V2 pode ser tratado como checkpoint técnico/humano suficiente para avançar dentro da Fase 3;
- a próxima unidade passa a ser **3C.3 — objetos sobre página: Escrever + Colar imagem**, mantendo o PR #179 aberto e sem merge;
- Recortar permanece para 3C.4 e Desenhar/Borracha para 3C.5;
- o aceite global da Fase 3 continua pendente até essas unidades e a consolidação/exportação local estarem concluídas.

Próximo passo exato:
1. implementar Escrever sobre páginas grandes em lista;
2. implementar Colar imagem sobre página existente;
3. garantir seleção, mover, resize, rotação e undo/redo;
4. validar desktop/mobile no staging sintético;
5. solicitar homologação humana dessa nova unidade antes de seguir para Recortar.


## 3C.3 — Escrever + Colar imagem: implementação iniciada — 15/09/2026

Estado real:
- Organizar V2 aceito visualmente e tecnicamente;
- PR #179 segue aberto, sem merge;
- a próxima unidade da Fase 3 é 3C.3 — objetos sobre página.

Implementado nesta rodada:
- o plano de páginas ganhou identidade estável por `pageId`, permitindo que objetos acompanhem a página ao reordenar;
- sessão do editor ganhou modelo local de objetos com histórico integrado;
- texto e imagem overlay possuem posição, tamanho, rotação e opacidade;
- textos também guardam fonte, tamanho relativo e cor;
- duplicar página duplica seus objetos com novos IDs; excluir página remove os objetos daquela página;
- Undo/Redo restaura plano + objetos;
- visualizador ganhou camada de objetos sobre o canvas PDF, seleção, movimento, quatro pontos de resize, rotação e edição direta de texto por duplo clique;
- toolbar habilita **Selecionar**, **Escrever** e **Colar imagem sobre a página**;
- Recortar e Desenhar continuam bloqueados para as unidades seguintes;
- laboratório sintético recebeu os mesmos modos, usando somente texto/imagem fictícios;
- objetos continuam locais; `buildBlob()` ainda não faz flatten desses objetos — isso permanece explicitamente para 3C.6.

Segurança:
- nenhuma escrita no Drive;
- nenhuma chamada nova de backend;
- nenhum conteúdo textual/imagem é enviado para observabilidade;
- staging permanece sintético.

Próximo passo:
1. validar testes unitários/estáticos e Playwright da nova camada;
2. corrigir qualquer regressão de gesto/zoom/rebuild;
3. publicar preview sintético de 3C.3;
4. homologar Escrever e Colar imagem antes de avançar para Recortar.
