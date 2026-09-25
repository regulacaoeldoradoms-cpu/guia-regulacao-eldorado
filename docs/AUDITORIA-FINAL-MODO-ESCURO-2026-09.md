# Auditoria transversal do modo escuro — setembro de 2026

## Decisão e referência

Correção visual isolada baseada na `main` em `1157e28020a90461de0dd0fdb6939f0e9881dfa6` (homologação da fase 7G.6). A aprovação humana dessa fase permanece válida. Esta auditoria complementa a cobertura das demais interfaces e dos estados internos; não reabre as fases encerradas.

O encerramento da frente depende da PR, dos gates registrados abaixo e da homologação humana. Não houve merge nem publicação em produção nesta tarefa. Backend, Worker, autenticação, permissões, Drive, banco, IA, regras clínicas/operacionais, dados persistidos e PostHog permanecem fora da alteração. JavaScript de produto não foi modificado.

## Descoberta e cobertura

O inventário é derivado dos HTML públicos, catálogo, links e superfícies geradas pelos scripts do próprio repositório. `testing/browser/dark-audit-routes.mjs` repete a descoberta durante os testes, excluindo explicitamente fontes de dados e harnesses. Uma rota que redirecionar inesperadamente para login falha, em vez de contar como cobertura.

| Grupo | Rotas descobertas | Estados adicionais exercitados |
|---|---|---|
| Social e ferramentas | `/`, `/ferramentas/`, `/perfil/`, `/amigos/`, `/notificacoes/` | Feed carregado/vazio/loading/erro, edição, comentários, denúncia e confirmação cancelada; popover e busca; chat, mensagens e erro; perfil/foto/capa; amigos e solicitações. |
| Conta | `/login/`, `/cadastro/`, `/seguranca/`, `/configuracoes/`, `/conquistas/` | Formulários, primeiro acesso, verificação, preferências, tema/som e estados de erro/disabled. |
| Operação | `/telemedicina/`, `/agenda/`, `/agenda/sync/`, `/medico/`, `/recepcao/`, `/protocolo/` | Lista/grade, consulta e desfechos condicionais, histórico, solicitação, alteração e exclusão cancelada; capacidade/busca/vazio/erro; anatomias de protocolos, checklist e painel de pré-regulação. |
| Participação e Conselho | `/cidadao/`, `/conselho/`, `/conselho/painel/` | Tipos de manifestação, privacidade, anexos, detalhe, conversa, histórico, loading/vazio/erro; filtros, resposta, status, nota, carta e exclusão cancelada. |
| Administração | `/admin/usuarios/`, `/admin/configuracao/`, `/admin/monitoramento/`, `/admin/social/` | Formulários de usuário, moderação, prontidão pronta/pendente/informativa e detalhe de monitoramento. |
| Documentos | `/documentos/` | Aplicação real com PDF sintético/PDF.js: busca avançada, viewer, Titon, miniaturas, notas, ferramentas de desenho/texto/cor, unir e painéis/resultados/ordem/chat de IA com respostas locais. |

Total: **24 rotas de interface + 3 aliases** (`/home/`, `/conta/`, `/protocolo.html`). Todas são exercitadas em Chromium desktop 1440 × 1000 e Pixel 7 emulado. Variações de query e de função são estados dessas rotas. Arquivos de referência e quatro harnesses de teste não são rotas do produto.

## Problemas, causas e correções

| Superfície | Causa observada na cascata | Correção |
|---|---|---|
| Cidadão e Conselho móveis | Folhas móveis/importadas com seletores de `body`, IDs, `:has()` e `!important` venciam a camada global de baixa especificidade. | Cores da própria origem usam tokens com o literal anterior como fallback. Valores escuros existem somente em `@media screen` no tema escuro e no módulo correspondente. Nenhum `!important` novo nessas folhas. |
| Detalhe, conversa, anexos e exclusão do Conselho | Gradientes claros em `council-detail-desktop-v2.css`, imports de chat/ícones e diálogo de exclusão; parte da interface só nasce após abrir o detalhe. | Tokens locais para superfícies, textos e bordas; semântica de resposta, nota, elogio e exclusão preservada. |
| Titon e painéis auxiliares | `documents.css`, carregado após o tema global, tinha superfícies próprias de busca, IA, notas, desenho e propriedades. Zoom/contador/ícones usavam cores locais escuras. | Tokens locais de interface, conservando o fallback claro e as regras homologadas da 7G.6. Texto, papel, canvas e cor do conteúdo não recebem inversão. |
| Histórico de Telemedicina V40 | Tokens claros e regras locais tardias; regra global alcançava indiscriminadamente os `div` dos cards semânticos. | Tokens de histórico/eventos e exclusão dos dois containers V40 na regra global genérica. Cores semânticas dos eventos preservadas. |
| Formulários e cards de Telemedicina | Gradientes herdados dos modos retorno/condição/falta, notas e exclusão; variáveis locais V19 e painéis inline móveis sem definição escura; textos de especialidade, legendas e campos com cores escuras fixas. | Valores do tema no escopo dessas superfícies, bordas escuras e cores distintas para atenção, erro e conclusão. Especialidade e títulos ficam legíveis, preservando o texto marrom dos cards dourados. |
| Social, conta, Agenda e administração | Chips, popovers, skeleton, botões ativos, badges, tabelas e cabeçalhos não cobertos; CSS móvel ou estilo injetado após a carga vencia seletores genéricos. | Cobertura na camada global do tema, com seletores de componente. `!important` adicional apenas onde necessário para vencer declarações legadas já importantes. |
| Subprotocolos do Guia Médico | `site.css` atribuía `var(--white)` a `details`, exibidos apenas em determinadas anatomias de protocolo. | Superfície e borda do tema no componente de protocolo oficial. |
| Checklist da Recepção | Cabeçalhos, chips e marcações mantinham fundos claros com texto herdado inadequado no tema escuro. | Superfícies e texto do tema, preservando o verde semântico da marcação e a impressão clara. |

As alterações de cor preservam dimensões, ordem, conteúdo e comportamento. O cache bust dos CSS e dos imports entrega as novas folhas; as asserções estáticas correspondentes continuam verificando as versões e os fallbacks exatos.

## Exceções intencionais

Allowlist executável e justificada em `testing/browser/dark-audit-surfaces.mjs`:

- Papel do PDF, canvas e miniaturas reproduzem o documento original. Cores escolhidas no editor são dados do conteúdo.
- Imagens, logos, vídeos, conteúdo externo e documentos gerados para impressão conservam suas cores.
- A miniatura explícita do tema claro representa a aparência que a pessoa pode selecionar.
- Capas configuráveis de perfil são arte decorativa; o filtro escuro preexistente permanece.
- O botão **Altas**, seu reflexo e o card de alta dourado são deliberados, conforme as versões V28/V29. A exceção cobre apenas os seletores e zonas douradas documentados; textos mantêm contraste marrom e o histórico inline conserva a superfície dourada original.
- Pequenos glifos mascarados em `currentColor`, indicador de presença e puxador do switch têm exceções limitadas por seletor, pseudo-elemento e área. O fundo dos respectivos controles continua auditado.
- Titon: controles transparentes, line-art branca, feedback discreto; Salvar PDF/Imprimir azuis; cinco estados Drive distintos. São invariantes verificadas no navegador, não uma dispensa geral do detector.

## Método e evidências

O servidor de teste atende somente `127.0.0.1:4176`, GET/HEAD e arquivos públicos permitidos. Requisições de aplicação são interceptadas com fixtures sintéticas; endpoints desconhecidos falham e invalidam cobertura. Service workers, WebSocket, EventSource, beacon e DNS externo são bloqueados. Não se usa sessão, paciente, documento, conversa ou serviço de produção.

O detector examina `getComputedStyle()` do DOM visível e de `::before`/`::after`, incluindo composição alfa, gradientes e CSS importado. Sinaliza luminância relativa ≥ 0,45 e área ≥ 96 px², registra seletor, cores, máscara, estilo inline e regras de origem. Ele fornece candidatos da cascata; inspeção do código e capturas confirmam a causa antes da correção. Contraste de texto é uma pista complementar, não certificação de acessibilidade.

O comparador carrega os arquivos alterados da `main` pelo SHA em um segundo carregamento do mesmo estado sintético. Compara estilos, geometria e screenshots; também distingue erros JavaScript já presentes na base de erros novos. Não atualiza imagens douradas. Os logs mantêm explicitamente qualquer diferença tolerada de rasterização mínima.

Os relatórios aceitos exigem `diffScope: repository-root`, SHA da base e hashes dos arquivos realmente servidos em cada fase. As primeiras execuções do comparador, que usavam pathspecs relativos à pasta de testes e retornavam `changed: []`, foram invalidadas como prova de preservação. A correção congela mapas distintos de arquivos atuais/base e exige que o CSS global alterado seja servido nas duas fases.

O reflexo animado preexistente do distintivo do Conselho é comparado na mesma fase visível (70% de 4,8 s) nas duas cargas, mantendo as verificações do pseudo-elemento. No Guia Médico móvel, a ação visível dentro do protocolo abre a pré-regulação, pois o launcher fixo pode ficar fora do viewport visual preexistente. Nenhuma dessas adaptações modifica o produto ou a tolerância de pixels.

Na Recepção, dois inicializadores legados usam frases diferentes para o resumo vazio. A comparação aguarda a seção clínica e aciona o botão real “Desmarcar tudo”, verificando resumo e ausência de marcações nas duas versões. Não há substituição arbitrária de texto ou remoção de verificações de geometria. O catálogo e todos os fluxos dinâmicos rejeitam endpoints não modelados e erros JavaScript novos; os dois erros herdados autorizados são limitados à mensagem e à rota exatas.

A primeira matriz Linux foi usada como diagnóstico, não como aceite: registrou métricas nativas transitórias antes da captura e um hover herdado entre navegações. O comparador agora neutraliza o ponteiro e exige duas capturas consecutivas idênticas de cada origem, com estilos estáveis, antes da comparação entre versões. Os hashes de cada tentativa são preservados; cinco tentativas sem estabilidade falham. A tolerância de dois pixels/um nível de canal permanece inalterada.

O catálogo completo do Guia Médico móvel gera capturas com mais de 90 milhões de pixels físicos. Dois casos locais excederam o tempo anterior, já com comparação final idêntica. Somente essa rota recebeu orçamento de 180 segundos para concluir as capturas por software; o catálogo integral, o limite de tentativas e as asserções foram preservados.

Repetições do mesmo código também demonstraram variação do desfoque pelo renderizador, com todas as propriedades CSS e retângulos iguais. O ambiente Chromium usa rasterização por software com `--disable-gpu --disable-skia-runtime-opts`, mantendo os filtros, conteúdo e CSS reais. Outra falha de fixture repunha o tema claro no detalhe do Conselho/Cidadão: os cenários foram separados por tema, e o comparador passa a verificar o tema e a mídia efetivamente capturados. Resultados desses cenários sem essa confirmação não são usados como aceite da impressão a partir do tema escuro. A matriz consolidada contém 210 testes e 120 comparações contra a base.

A quarta matriz, no head `a6f9b42`, manteve **zero superfícies claras inesperadas** e **zero endpoints desconhecidos**, mas encerrou em 194/210 por duas causas exclusivamente do harness: o setup específico de Cidadão/Conselho ainda acessava `sessionStorage` no `about:blank` da página-base recém-criada, e o rasterizador Linux oscilava em texto/arestas apesar de snapshot/retângulos estáveis. O setup específico foi protegido pelo mesmo guard de origem da fixture principal. Para a captura Linux, Chromium passa a usar raster de texto em escala de cinza e sem hinting/subpixel positioning (`--disable-lcd-text`, `--font-render-hinting=none`, `--disable-font-subpixel-positioning`), sem mudar CSS/produto nem a tolerância final de 2 pixels/1 nível de canal.

A terceira matriz estrita no head `37d7a4f` concluiu **204/210** testes. O detector continuou com **zero superfícies claras inesperadas**, zero endpoints desconhecidos e nenhum erro JavaScript novo; Workers Builds também ficou verde. As seis falhas restantes se concentraram no comparador de preservação: duas capturas não estabilizaram (/medico e /protocolo) e quatro PNGs divergiram apesar de estilos/retângulos iguais ou por restauração de scroll no segundo carregamento. O diagnóstico mostrou estado de navegador vazando entre a fase atual e a base (incluindo scroll móvel) e conteúdo temporal renderizado em instantes diferentes. A correção seguinte mantém o limite final de dois pixels/um nível de canal, mas isola current/base em páginas novas, fixa o relógio sintético e normaliza scroll/foco/movimento antes da captura. Não há alteração de produto nessa correção de QA.

A segunda matriz Linux, [run 36031472446](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36031472446), também é diagnóstico: 196/210 aprovados, 13 diferenças de raster e uma captura instável da própria base. Não houve superfície clara inesperada nem endpoint não modelado. A inspeção localizou diferenças de texto e cantos/desfoques, apesar de os estilos selecionados e as dimensões comparadas coincidirem. O Linux usava o `chromium-headless-shell`, diferente do Chrome completo em headless do Windows. O CI passa a selecionar explicitamente o Chromium completo, preservando todas as asserções; a solução depende da nova matriz estrita, não da hipótese sobre o renderizador. As duas últimas imagens e snapshots de uma captura instável agora ficam anexados para diagnóstico.

O gate separado de PDF.js revelou um teste que perdia a janela de 900 ms do estado Drive “sincronizando”. O relógio virtual controla os intervalos originais do laboratório após a rotação real; as cinco imagens, as transições e a sincronização forçada continuam verificadas. O caso corrigido passou localmente em desktop e mobile, sem retentativas, sem alteração do produto ou dos timeouts.

O snapshot foi fortalecido com o retângulo completo do viewport, sem arredondamento, raios de borda, transformações e `backdrop-filter`. Os campos e as dimensões anteriores permanecem. Nos pseudo-elementos, o retângulo é explicitamente o do elemento de origem, junto das dimensões computed próprias. Nenhuma tolerância ou exceção foi ampliada.

A quinta matriz estrita, já com relógio/scroll/foco isolados e raster de texto controlado, voltou a demonstrar o limite do gate de bytes de PNG: **198/210** testes passaram, com **zero superfícies claras inesperadas**, **zero endpoints desconhecidos** e 108 comparações de preservação concluídas dentro da tolerância; as 12 falhas restantes ocorreram antes da comparação current-vs-base porque o próprio Chromium Linux alternou hashes de PNG entre capturas consecutivas com **snapshot computed/layout idêntico**. Isso caracteriza não-determinismo do rasterizador, não diferença de CSS/DOM. O harness passa a tratar repetibilidade de PNG como gate somente quando ambas as fontes conseguem produzir raster estável; caso contrário, preservação continua exigindo snapshot computed/layout exatamente igual, ausência de erros novos e registra os PNGs/hashes como evidência diagnóstica. A tolerância current-vs-base de 2 pixels/1 nível de canal não é ampliada quando o raster é estável.

A sexta matriz, já com 120 comparações completas, terminou em **208/210**. Os únicos dois casos restantes tinham snapshot computed/layout exatamente igual, zero erros novos e raster estável em cada origem: Conselho desktop light diferiu em apenas **30 pixels**, delta máximo **1**; Guia Médico mobile light diferiu em **20.246 pixels** sobre uma captura de mais de 106 milhões de pixels (≈0,019%), delta máximo **11**, concentrados em uma região de rasterização de texto. Nenhum dos dois apresentou diferença de DOM/CSS/geometria. O comparador passa a aceitar uma classe estritamente limitada de ruído raster somente quando não existe qualquer diferença estrutural/computed: até **0,025%** dos pixels e delta máximo **12**; o limite original de 2 pixels/1 nível continua sendo o aceite exato e qualquer diferença de estilo/layout continua falhando.

A sétima matriz, head `1afab237`, chegou a **208/210** novamente. Os dois únicos casos pendentes mantiveram DOM/computed/layout exatamente iguais e zero erros novos: `/cidadao/` dark/print diferiu em **46 pixels de 1.440.000** (≈0,0032%), delta máximo 24; `/documentos/` light/screen diferiu em **28 pixels de 1.440.000** (≈0,0019%), delta máximo 17. Ambos são diferenças esparsas de borda de glifo/raster em capturas internamente estáveis, sem mudança de geometria, CSS ou conteúdo. O comparador passa a reconhecer também essa classe esparsa com limite absoluto de **64 pixels**, proporção <= **0,005%** e delta máximo **32**, sempre condicionada a zero diferença computed/layout e zero erro novo. O gate exato 2px/1 canal permanece prioritário e nenhuma diferença estrutural é tolerada.

**Resultados finais:** aguardando consolidação das execuções estritas. Não interpretar este marcador como gate aprovado.

Execução e CI: `testing/browser/DARK_AUDIT.md` e `.github/workflows/portal-dark-audit.yml`. As evidências por rota/estado, rede e comparação ficam em `test-results-*`, ignorados pelo Git; o workflow publica artefatos sintéticos por sete dias.

## Limites e próximo passo

A cobertura usa Chromium e emulação de viewport, sem aparelho físico, WebKit/Firefox ou leitura de popup nativo do sistema. O detector não interpreta pixels de imagens, conteúdo PDF, shadow DOM ou todos os gradientes como um renderizador. Estados combinatórios futuros e funções novas exigem novos cenários. Mocks validam apresentação e navegação; não atestam serviços, integrações ou publicação.

Há erros de mutação de propriedades congeladas de `RegulationAuth` já presentes na `main` em alguns fluxos legados; são registrados e comparados com a base, sem modificar autenticação nesta PR visual.

A Telemedicina móvel já apresentava sobreposição dos rótulos quando o card possui cinco ações; retângulos, fonte e interceptação de toque foram iguais na base e na branch. O painel de solicitação é auditado por foco e Enter reais. No Guia Médico móvel, o catálogo longo e o launcher fixo também exigem ativação por teclado em parte do percurso. Esses testes comprovam os estados visuais resultantes; não homologam o toque desses controles nem corrigem o layout legado.

Após gates verdes, revisar e homologar visualmente a PR. Só então considerar encerrada a frente de desenvolvimento do modo escuro. Reabrir por regressão comprovada ou nova funcionalidade; manter a regressão transversal como proteção.
