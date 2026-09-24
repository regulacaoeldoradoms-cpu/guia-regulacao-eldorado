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
| Formulários e cards de Telemedicina | Gradientes herdados dos modos retorno/condição/falta, notas e exclusão; variáveis locais V19 e painéis inline móveis sem definição escura. | Valores do tema no escopo dessas superfícies, bordas escuras e cores distintas para atenção, erro e conclusão. |
| Social, conta, Agenda e administração | Chips, popovers, skeleton, botões ativos, badges, tabelas e cabeçalhos não cobertos; CSS móvel ou estilo injetado após a carga vencia seletores genéricos. | Cobertura na camada global do tema, com seletores de componente. `!important` adicional apenas onde necessário para vencer declarações legadas já importantes. |
| Subprotocolos do Guia Médico | `site.css` atribuía `var(--white)` a `details`, exibidos apenas em determinadas anatomias de protocolo. | Superfície e borda do tema no componente de protocolo oficial. |

As alterações de cor preservam dimensões, ordem, conteúdo e comportamento. O cache bust dos CSS e dos imports entrega as novas folhas; as asserções estáticas correspondentes continuam verificando as versões e os fallbacks exatos.

## Exceções intencionais

Allowlist executável e justificada em `testing/browser/dark-audit-surfaces.mjs`:

- Papel do PDF, canvas e miniaturas reproduzem o documento original. Cores escolhidas no editor são dados do conteúdo.
- Imagens, logos, vídeos, conteúdo externo e documentos gerados para impressão conservam suas cores.
- A miniatura explícita do tema claro representa a aparência que a pessoa pode selecionar.
- Capas configuráveis de perfil são arte decorativa; o filtro escuro preexistente permanece.
- O botão **Altas** e seu reflexo dourado são deliberados, conforme `docs/TELEMEDICINA-SALVAMENTO-ATOMICO-E-ALTAS-V29.md`.
- Pequenos glifos mascarados em `currentColor`, indicador de presença e puxador do switch têm exceções limitadas por seletor, pseudo-elemento e área. O fundo dos respectivos controles continua auditado.
- Titon: controles transparentes, line-art branca, feedback discreto; Salvar PDF/Imprimir azuis; cinco estados Drive distintos. São invariantes verificadas no navegador, não uma dispensa geral do detector.

## Método e evidências

O servidor de teste atende somente `127.0.0.1:4176`, GET/HEAD e arquivos públicos permitidos. Requisições de aplicação são interceptadas com fixtures sintéticas; endpoints desconhecidos falham e invalidam cobertura. Service workers, WebSocket, EventSource, beacon e DNS externo são bloqueados. Não se usa sessão, paciente, documento, conversa ou serviço de produção.

O detector examina `getComputedStyle()` do DOM visível e de `::before`/`::after`, incluindo composição alfa, gradientes e CSS importado. Sinaliza luminância relativa ≥ 0,45 e área ≥ 96 px², registra seletor, cores, máscara, estilo inline e regras de origem. Ele fornece candidatos da cascata; inspeção do código e capturas confirmam a causa antes da correção. Contraste de texto é uma pista complementar, não certificação de acessibilidade.

O comparador carrega os arquivos alterados da `main` pelo SHA em um segundo carregamento do mesmo estado sintético. Compara estilos, geometria e screenshots; também distingue erros JavaScript já presentes na base de erros novos. Não atualiza imagens douradas. Os logs mantêm explicitamente qualquer diferença tolerada de rasterização mínima.

**Resultados finais:** aguardando consolidação das execuções estritas. Não interpretar este marcador como gate aprovado.

Execução e CI: `testing/browser/DARK_AUDIT.md` e `.github/workflows/portal-dark-audit.yml`. As evidências por rota/estado, rede e comparação ficam em `test-results-*`, ignorados pelo Git; o workflow publica artefatos sintéticos por sete dias.

## Limites e próximo passo

A cobertura usa Chromium e emulação de viewport, sem aparelho físico, WebKit/Firefox ou leitura de popup nativo do sistema. O detector não interpreta pixels de imagens, conteúdo PDF, shadow DOM ou todos os gradientes como um renderizador. Estados combinatórios futuros e funções novas exigem novos cenários. Mocks validam apresentação e navegação; não atestam serviços, integrações ou publicação.

Há erros de mutação de propriedades congeladas de `RegulationAuth` já presentes na `main` em alguns fluxos legados; são registrados e comparados com a base, sem modificar autenticação nesta PR visual.

Após gates verdes, revisar e homologar visualmente a PR. Só então considerar encerrada a frente de desenvolvimento do modo escuro. Reabrir por regressão comprovada ou nova funcionalidade; manter a regressão transversal como proteção.
