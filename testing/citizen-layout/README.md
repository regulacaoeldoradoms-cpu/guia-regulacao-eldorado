# Layout legível para cidadão

Base atual: `01535782ef41ccf42ce9c4fc3ef8d3b4466f78ab` (main com #618 e #619). Medidas iniciais e comparação de desktop/paleta foram coletadas em `bd7dad38`; estilos profissionais não foram alterados pela reconciliação. Branch `perf/cidadao-diagnostico`, worktree `/workspace/cidadao-perf`. O primeiro diagnóstico usou `491ae932`; a comparação final usa a base atual. Runtime e cache de mascotes foram preservados; na página Mascotes, somente a versão da referência ao shell da conta mudou. #618 está integrado na base; esta preparação preserva sua implementação, além das falas de #619.

## Escopo comprovado no código

| Entrada | Evidência e condição |
| --- | --- |
| `/`, `/home/` | Home usa `requireRole([])` em `js/home.js`; `/home/` é compatibilidade. Social depende de configuração e gate da conta. |
| `/ferramentas/` | `js/tools.js` usa `requireRole([])`. `PortalTools.cardsFor` dá somente Canal do Cidadão à fixture comum. |
| `/cidadao/` | `js/citizen.js` usa `requireRole([])`; formulário, protocolos próprios, histórico, anexos e notificações. |
| `/perfil/`, `/amigos/`, `/notificacoes/` | Clientes sociais usam `requireRole([])`. `worker/social-policy.js` permite cidadão ativo; suspensão social e privacidade continuam limitando operações e visibilidade. |
| `/seguranca/`, `/configuracoes/`, `/conquistas/` | `PortalAccountSection.mount`; primeiro acesso e confirmação de e-mail mantêm redirecionamentos. |
| `/mascotes/` e acompanhante | Conta autenticada, feature flag, gate de primeiro acesso; `worker/pets.js` valida sessão com lista vazia de cargos. |
| `/conta/` | Compatibilidade que redistribui para seções especializadas; sem redesenho neste lote. |
| `/conselho/painel/` | Condicional a `councilRole`; conta cidadão exclusiva do Conselho é redirecionada para lá por `auth-config.js`. Sem otimização institucional neste lote. |
| `/documentos/` | Condicional a concessão explícita ou cargo adicional, não ao cargo cidadão sozinho (`worker/document-access.js`). Sem conteúdo institucional/clínico consultado. |
| `/estudos/` | Exclusivo de `wellyton`, não consequência do cargo cidadão; excluído. |
| Login, cadastro e Conselho público | Entradas públicas, separadas do recorte autenticado testado. Não alteradas neste lote. |

Guia Médico, Recepção, Agenda, Telemedicina e administração ficam fora do lote. `auth-client.js` distingue lista vazia de roles de lista restrita; conta privilegiada não foi usada para demonstrar acesso cidadão. Fixtures não provam flags nem concessões reais de produção.

## Achados e mudanças

Prioridade acordada: layout de celular, legibilidade e simplicidade; velocidade secundária. Meta viewport já era `device-width`; o problema observado não era ausência de viewport. Estilos e contratos de cores existentes foram lidos em `citizen-mobile-app.css`, `citizen-manifestation-mobile.css`, `citizen-detail-mobile-v4.css`, `citizen-privacy-accordion.css`, `social.css` e seções de conta.

| Medida em 320 px | Antes | Preparação |
| --- | --- | --- |
| Largura rolável do Canal | 379 px | 320 px |
| Conteúdo interno do formulário | 339 px em painel de 304 px | 304 / 304 px |
| Navegação fora da Home | 10,4 px | 14 px |
| Editar / Excluir post | 11,52 px | 16 px |
| Mostrar atalhos | 11,52 px; label 15 px de altura | 16 px; label 48 px |
| Subir / Descer no perfil | 11,52 px; botão 36 px | 16 px; botão 48 px |
| Chat aberto | Sobreposição com barra | Limite inferior acima da barra |

A barra **permanece fixa embaixo**, em uma linha com seis destinos visíveis, nomes completos a 14 px e alvos de pelo menos 44 px. Mascotes usa somente uma patinha SVG com nome acessível. Com texto ampliado, a barra reflui para mais linhas, preservando rótulos e área de toque; o espaço reservado e o chat acompanham sua altura. O harness verifica uma linha em tamanho normal, rótulos inteiros, todos os destinos na tela e refluxo a 200%.

O cabeçalho deixa de comprimir marca/conta numa linha; abas de manifestações ficam empilhadas; campos e legendas usam tamanho legível; botões de ordenação do perfil passam a linhas próprias. Cartões e progresso da conta refluem. O formulário distribui fechar/título e os passos sem invadir a largura. Com altura reduzida, cabeçalhos de formulário deixam de ser sticky para não cobrir campos.

No tema escuro, ações sociais ainda não ativadas reutilizam o token existente de texto para melhorar legibilidade; estado ativo e cores semânticas não são redesenhados. Dez telas escuras em 390 px também foram verificadas com fixture e seus pixels inspecionados.

As regras novas são condicionadas à classe de apresentação do cidadão e a `max-width:900px`. Permissões, endpoints, operações, dados, paleta semântica, cores de tipo/privacidade/status, ícones funcionais e estados são preservados. A Home importa a apresentação pelo controlador já autorizado, sem ampliar a lista exata de scripts da transição pós-login. A ativação separada em `account-section-shell.js` aplica o mesmo estilo à página Mascotes sem editar os arquivos concorrentes. O observador ajusta espaço da barra conforme sua altura e troca a entrada Mascotes criada pelos scripts existentes. Não há dependência ou serviço novo em produção.

## Evidência e reprodução

Conta, perfil, post, gato e protocolo são inteiramente fictícios. HTTP externo é interceptado; WebSockets externos são fechados; SW é bloqueado. Servidor permite somente páginas em escopo e assets públicos locais. Não há acesso a D1, Firebase, pacientes, contas reais ou APIs de produção.

- Matriz: dez rotas × 320/360/390/412/844×390 landscape/1440 px: 60 cenários passaram. Comparação incluiu geometria do desktop e cores semânticas, iguais à base.
- Texto 200%: dez rotas em 320 px passaram. Fixture dobra tamanhos computados de texto e mede refluxo; não equivale a todos os mecanismos de zoom do sistema operacional.
- Detalhe fictício: cinco tamanhos passaram, mais revisão a 200% em 320 px.
- Janela reduzida: formulário focalizado com viewport menor e landscape, dois cenários passaram. Simulação de altura, não teclado físico/IME de aparelho real.
- 902 testes completos do Worker passaram antes da integração de #618, após ajuste de carregamento da Home; essa evidência não conta os testes novos de vidas. O CI da base reconciliada valida a suíte atual; sintaxe e `git diff --check` passaram. Abertura real pós-login com fixture cidadão passou em dois projetos (desktop/mobile): mesmo documento, sem flash/reinicialização; lista exata de scripts preservada.
- `evidence.json` guarda medidas sanitizadas. Imagens e JSON completos locais estão em `/tmp/citizen-*`. Workflow `validate-citizen-layout.yml` repete a matriz, texto ampliado e detalhes com artefatos, sem deploy.

```bash
cd testing/browser
npm install --no-package-lock --cache /tmp/cidadao-npm
cd ../..
CHROMIUM_PATH=/usr/bin/chromium node testing/citizen-layout/audit.mjs /tmp/citizen-layout.json
node testing/citizen-layout/verify.mjs /tmp/citizen-layout.json
TEXT_SCALE=2 WIDTHS=320 node testing/citizen-layout/audit.mjs /tmp/citizen-text200.json
node testing/citizen-layout/verify.mjs /tmp/citizen-text200.json
DETAIL_FIXTURE=1 KEYBOARD_FIXTURE=1 ROUTES=/cidadao/ WIDTHS=320,360,390,412,844 node testing/citizen-layout/audit.mjs /tmp/citizen-detail.json
node testing/citizen-layout/verify.mjs /tmp/citizen-detail.json
```

`PORTAL_ROOT` permite servir uma worktree limpa da base; o segundo argumento de `verify.mjs` compara cores e geometria do desktop. `CHROMIUM_PATH` deve apontar ao navegador instalado. O download Playwright foi bloqueado neste executor; os testes usaram `/usr/bin/chromium` já disponível.

## Velocidade: gargalos medidos, próximos lotes

Tamanhos de arquivos públicos do checkout, não estimativas de transferência comprimida em produção:

- Ícone Canal: 1.461.693 bytes, exibido em poucos pixels no cabeçalho/cards.
- Ícone Fechar: 1.040.664 bytes, usado pelos estilos de diálogos.
- Medalhas Bronze/Prata/Ouro: 1.478.896 / 1.373.110 / 1.545.036 bytes.
- Vídeo de abertura: 3.275.007 bytes e espera deliberada de aproximadamente dez segundos, conforme contrato de abertura existente. Não alterado unilateralmente.
- `portal-chat.js`: 89.717 bytes; Canal usa várias folhas CSS, inclusive imports encadeados e estilos de formulário/detalhe. Carregamento tardio para telas ainda fechadas merece lote separado.

Prioridade secundária sugerida: formatos/resoluções menores mantendo pixel/cores, revisão do carregamento de assets dos diálogos e coleta real de CWV/LCP/INP em ambiente autorizado. Assets de produção não foram substituídos; a camada nova adiciona cerca de 14 KB de CSS/JS crus. Requests/tempos da fixture local com cache desativado não representam rede móvel nem Core Web Vitals de produção. Cache global não foi reescrito.

## Reconciliação com #618

Rebase sem conflitos sobre `01535782`; diff relativo ao novo main mantém `pets-runtime.js`, `pets-bootstrap.js`, `pet-phrases.js`, `css/pets.css` e `portal-sw.js` sem alterações deste PR; `/mascotes/` muda somente a versão da referência ao shell da conta. Home e as três alternativas foram retestadas em 320/390 px; chat ampliado e Mascotes usam a fixture atual de sete vidas. Capturas de navegação e chat foram atualizadas na nova base. CI anterior tinha 25/26 workflows aprovados e somente auditoria escura ativa; seu monitor foi encerrado porque o head foi substituído.

## Comparações adicionais

[VISUAL-REVIEW.md](VISUAL-REVIEW.md) reúne screenshots da barra atual e alternativas de uma linha, chat acima do mascote, dimensões/proveniência dos cinco assets e candidatos WebP de 229.528 bytes totais (96,67% menores em disco). A opção de uma linha com nomes foi aplicada; as outras alternativas e os candidatos WebP continuam apenas no harness.

## Limites e entrega

As duas screenshots reais da Library não puderam ser materializadas neste executor: preparação resolvida, download falhou e uma repetição limitada também falhou. Elas não foram inspecionadas localmente nem copiadas para fixtures/repo. Foram vistos os pixels das capturas locais sintéticas antes e depois. Consulta anônima ao domínio também retornou bloqueio de rede (403 do ambiente); nenhuma análise ao vivo foi alegada.

Próximo gate: CI do head final e revisão visual da barra em uma linha com nomes. Rebase sobre o main que integrou #618 concluído; conferir a base novamente antes de publicação. Login/cadastro, acessos condicionais e aparelhos reais continuam recortes adicionais, não declarados concluídos. Publicação exige coordenação da versão de cache com a tarefa de mascotes e os gates usuais; nenhuma alteração de cache, merge ou deploy foi executada aqui.

Cache: `account-section-shell.js` recebe referência versionada nova somente na página Mascotes. O SW existente mantém assets versionados; HTML usa atualização em segundo plano. Uma sessão já em cache pode precisar de uma nova navegação após receber o HTML atualizado. O PR preserva o cache global e as versões `pets-combined-v8`.
