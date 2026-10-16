# Canal persistente mobile — validação local

Base: `b5a0bbfc5cf01b0fb964ad9c76e0ee47222923a3` (PR663).
Branch: `feat/citizen-persistent-mobile-20261016`. Checkout inicial limpo em
`380a40b1`; `origin/main` consultado antes de criar a branch isolada.
Entrega em branch isolada e commit local; sem push, PR, merge ou deploy.
Nenhum acesso real negado.

## Implementação

- Amplia `PortalCitizenShell`: `/cidadao/` usa o endereço `/` no mobile,
  History da conta, factories, áreas retidas e barra existentes. A entrada
  direta continua carregando seu próprio documento, sem redirecionamento
  intermediário para a Home. Desktop e impressão conservam `/cidadao/`.
- Preparação sequencial após Home/documento prontos. O Canal vem depois dos
  destinos existentes; uma consulta de conta sem fallback deve autorizar seu
  preparo. Erro de autorização impede esse preparo; os endpoints continuam
  responsáveis pelas permissões. Conta cidadão institucional mantém seu gate.
- Inicializa DOM, dados e apresentação fora da tela, com atributos de body e
  rótulos da identidade isolados. A apresentação usa o singleton existente.
  `ready` exige conclusão da primeira carga; falhas têm aviso/repetição.
- Primeiro acesso ainda não preparado mantém a tela atual utilizável. Outro
  toque cancela a espera de navegação enquanto o preparo continua. Após pronto,
  o primeiro frame visível usa as proporções/cópias finais, sem buscar novo
  documento, script ou dados iniciais, nem reconstruir barra/Chat/mascote.
- Rascunhos e objetos File ficam na área da sessão. Voltar/avançar preservam
  formulário aberto, categoria, privacidade, aba, arquivos e acompanhamento.
  Revalidação de leituras após 30 s, na retomada e no ciclo já existente;
  atualiza também detalhe/histórico aberto. Falha mantém dados com aviso de
  possível desatualização e botão de repetição. Leituras têm prazo de 15 s.
- Logout/troca de sessão abortam leituras, descartam a área, limpam campos e
  referências privadas e liberam anexos locais. Declaração e anexos de
  acompanhamento também verificam a sessão. Nenhum preparo executa envio.
- Evita reanexar o mesmo mascote ao mesmo pai: preserva colocação e elimina
  layouts redundantes, usando o runtime original intacto.
- Destaca a área antes de restaurar suas posições nativas no callback de saída.
  Evita recompor/refocar repetidamente atalhos ainda conectados à Home; scroll,
  foco, diálogos e rascunhos continuam retidos. Não adiciona espera ou animação.
- O feedback global resolve a rota interna ativa, em vez do endereço `/` do
  shell. Preserva a interação nativa do Canal, inclusive na impressão após abrir
  protocolo. Login referencia o mesmo recurso atualizado para a transição
  existente reutilizar um único owner, sem recarregar seus listeners.
- HTML e controllers afetados recebem `&panel=20261016-1` nos recursos. Mantém
  a versão de origem do PR663 e muda a chave desses assets; namespaces/política
  de SW, tutorial e CSS permanecem intactos. Nenhum novo cache privado persistente.

Não altera Worker, migrações, permissões, chaves, recursos pagos, Guia Médico,
Missão Bancária nem runtime dos mascotes. `AGENTS.md` e o checkpoint foram lidos;
o checkpoint é específico da Missão Bancária, fora deste escopo.

## Evidências

Somente Chromium real `/usr/bin/chromium`, loopback e APIs sintéticas
interceptadas; WebSockets externos bloqueados. Nenhuma captura na Library.

| Verificação | Resultado |
| --- | --- |
| `citizen-retained-panel.mjs` | 17 cenários aprovados: 320/360/390/412 × claro/escuro; carga lenta/cancelamento; negação; recurso indisponível/repetição; logout durante leitura; revalidação/erro de rede; logout/troca; acesso direto mobile/desktop e impressão. Zero mutações do Conselho, APIs não modeladas ou erros de página. |
| `citizen-retained-preservation.mjs` | 360/390/1440 × claro/tela e escuro/impressão: estilos/geometria iguais a b5a0bbfc e **zero pixels diferentes** nos seis casos, capturas estabilizadas independentemente. Reusa o comparador original (2 pixels/1 nível), sem ampliar tolerância. Normaliza apenas a posição ordinal do mesmo estágio global do mascote e verifica unicidade. |
| Node: cache, navegação, segurança da transição Home, tutorial | **69/69** aprovados na rodada inicial; **63/63** testes afetados de cache/interações/transição Home rerodados e aprovados após os ajustes finais. Demais evidências não afetadas reaproveitadas. |
| `mobile-shell.mjs`, intacto | Journeys 320/390, retry/rapid navigation, account replacement, breakpoint/Back e logout aprovados; journeys repetidos após otimização do handoff do mascote. |
| `mobile-shell-prewarm.mjs` | Contrato atualizado para seis áreas preparadas, incluindo Canal, com zero HTML/scripts/dados iniciais na ativação e barra/owners idênticos. Esse caso e slow first tap, background error/retry, session end during preparation e cache admission race passaram; limite original de **16 áreas** preservado. |
| Auditoria original e negativos | Quatro comparações Cidadão contra b5a0bbfc aprovadas: dois desktop reaproveitados e dois mobile rerodados com o helper atualizado. Os dois mobile finais têm **zero diferenças computadas e zero pixels diferentes**, com raster estável. Os dois testes de contrato de rota passaram em desktop e mobile (**4/4**); negativos cobrem rota errada, dados ainda carregando, navegação em andamento, endereço errado, bootstrap pendente e revisão histórica. |
| `citizen-compose-lifecycle.mjs`, intacto | Teclado, eviction e reconstrução aprovados; handlers de viewport/apresentação 1 → 0 → 1. |
| Ajuda/tutorial, intactos | Existing-account 320 direto/1280 direto/390 shell e lifecycle 390/1280 + Bronze/helper indisponível aprovados. Shell/lifecycle 390 e handoff Login → Home rerodados após ajustes de saída/feedback: pausa/retomada, navegação, arquivos, troca, logout e impressão aprovados, sem mutações do Conselho. |
| Sintaxe e diff | `node --check` nos controllers/testes afetados e `git diff --check` aprovados. |

Artefatos locais: `.local/citizen-retained-panel/verified-17-results.json`
consolida a matriz completa; a pasta também contém painéis,
formulários e acesso direto. `.local/citizen-retained-preservation/` contém pares
base/atual e resultados. Ajuda/tutorial estão em `.local/citizen-tutorial/` e
`.local/citizen-help-evidence/`. Logs completos estão em `.local/citizen-retained-validation/`.
Os dois relatórios da auditoria original mobile final estão em
`.local/citizen-original-audit-final/`.
Pixels de painéis claro/escuro, formulário e desktop/impressão foram inspecionados.
Em 360 px, o rótulo Ajuda pode ficar recortado pelo hero nativo; a comparação
adicional contra b5a0bbfc confirmou esse comportamento preexistente (zero pixels
de diferença). O botão e seu painel continuam funcionais; não se redesenhou PR663.
O formulário conserva sua cobertura modal nativa: Back/Forward exercitam a
troca enquanto está aberto, sem forçar cliques através dessa proteção.

### Precisão da medição e atraso removido

Os 292–392 ms iniciais eram do `click` capturado até o primeiro callback de
`requestAnimationFrame` com o Canal ativo. Não incluíam a espera do Playwright
antes do clique; também não medem apresentação física dos pixels no aparelho.
O trace instrumentado de 516 ms mostrou 406 ms de recálculo de estilo e 73 ms de
layout, sobretudo ao restaurar/refocar atalhos conectados em
`home-mobile-composition.move`. Não havia espera por transição de documento ou
timer; a restauração redundante foi removida do DOM conectado.

Depois do ajuste, a mesma coleta instrumentada marcou 107 ms. Na matriz final
320/360/390/412 × claro/escuro, o callback foi observado em **75–127 ms**; botão
habilitado/desobstruído e barra original visível já nesse frame. O fixture padrão
usa movimento reduzido; também se testou `no-preference`: **93 ms** sem profiling
e 167 ms com trace, sem espera por animações. As únicas transições normais ativas
na amostra eram sombra/filtro de hover do botão (150 ms), sem bloquear a ação.
O trace não registrou evento de ViewTransition ou TimerFire antes desse frame;
o timer PWA de 700 ms foi apenas agendado, sem ser aguardado.

São amostras locais, sensíveis a CPU/trace/composição; não são SLA, latência zero
nem homologação física. Os testes mantêm zero HTML/scripts/dados iniciais na
ativação. Como no teste original de prewarm, o owner de telemetria idle já
existente é estabilizado antes da janela de medição; nenhum request é filtrado
para fazê-la passar. Cargas públicas opcionais, como imagem de fechar, não são
confundidas com documento, scripts ou dados do Canal.

Reprodução na raiz, com dependências de `testing/browser` e Chromium instalados:

```sh
node testing/citizen-layout/citizen-retained-panel.mjs
node testing/citizen-layout/citizen-retained-preservation.mjs
PRESERVE_WIDTHS=360 node testing/citizen-layout/citizen-retained-preservation.mjs
node --test testing/citizen-cache/cache-policy.test.mjs worker/tests/global-navigation.test.mjs worker/tests/home-transition-security.test.mjs worker/tests/portal-tutorials.test.mjs
```

## Contratos resolvidos e próxima ação

Os dois contratos substituídos foram atualizados após autorização específica:
`routes === 6` e `/` para o Canal mobile preparado. O helper exige a área correta,
carregada e fora de navegação; somente a revisão histórica exata
`20261011-citizen-entry-1` usa `/cidadao/` na comparação da base. A revisão atual
rejeita esse endereço quando o shell mobile está habilitado. Entrada direta,
desktop e bootstrap pendente continuam cobertos; os negativos anteriores foram
preservados e ampliados, sem mudança nos limites de memória ou critérios visuais.

A impressão original revelou uma diferença real de classe de feedback: a rota
era escolhida pelo endereço `/` e não pelo controller Canal ativo. Corrigiu-se
o produto; não se normalizou nem ignorou essa classe na auditoria.

O bundle Chromium do Playwright não estava instalado; usou-se configuração
temporária com `/usr/bin/chromium`, preservando flags, testes e gates originais.
As evidências iniciais não afetadas (desktop, CSS/tutoriais e políticas de cache)
foram reaproveitadas; somente contratos/fluxos afetados e dependentes foram
rerodados. Nenhum teste ficou pendente por expectativa antiga.

Próxima ação: autorizar criação de PR a partir do commit local e executar os
gates usuais de CI/publicação. Não foram utilizados conta real nem dispositivo
físico. Push, PR, merge e deploy continuam dependentes de autorização específica.
