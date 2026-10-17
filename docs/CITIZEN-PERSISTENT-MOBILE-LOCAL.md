# Canal persistente mobile — validação local

O corpo original abaixo registra a entrega local no ambiente cloud. A seção
"Integração para publicação" atualiza seu estado em 17/10/2026. Os artefatos
originais citados no corpo não fazem parte do bundle Git transferido.

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

## Integração para publicação - 17/10/2026

A autorização humana para PR e publicação foi fornecida em 16/10/2026. O pacote
foi recuperado pelo conteúdo exportado da conversa, sem modificar as restrições
de rede do cloud. Bundle: 23.469 bytes, SHA-256
`b17a8d58b5c198422743786937455a04a118e882bb34ee05a2c951ca6e6cc093`.
Tamanho, hash, cabeça `4a4621e4c9aa7d1a2c3afaea238b9b9a593b2833`, base e
`git bundle verify` conferidos antes de importar. Nenhum código do pacote foi
executado antes da revisão de seu diff.

Integração em nova worktree isolada com a main publicada
`d8c34e9cfc6971c1ab92684e8ea9c9a30430d197`, sem conflitos. Os pilotos clínicos
dos PRs 664 e 665 permanecem idênticos. A implementação funcional do bundle foi
preservada. Nenhum código produtivo do Worker, SQL, configuração de permissão ou namespace global de
cache foi alterado por esta integração. O marcador público do HTML do Canal e
sua constante no service worker foram atualizados juntos para `20261017-1`.

Validação sintética independente neste computador Windows, Chromium real:

- 86/86 testes Node de cache, navegação, segurança, interações e tutorial após a
  regressão de atualização de PR663 acrescentada durante a revisão.
- 17/17 cenários do painel retido, sem mutações do Conselho, APIs não modeladas
  ou erros de página; rascunho, objetos File, privacidade, aba e sessão cobertos.
- Seis comparações visuais contra PR663: 360/390/1440 px, tela clara e impressão
  escura, estilos/geometria iguais e zero pixels diferentes em todos os casos.
- Shell e preparo em segundo plano aprovados; ciclo do formulário comprova
  remoção e reconstrução dos handlers após eviction, sem duplicação.
- Ajuda em contas existentes aprovada em acesso direto e pelo shell, sem
  chamadas de demonstração ou mutações, preservando rascunho e anexo.
- Nove cenários do atualizador de clientes instalados aprovados. Dois cenários
  adicionais com service worker nativo, HTML e módulos exatos de PR663 em cache
  comprovam a primeira entrada direta atualizada em claro/escuro e a retenção
  de rascunho/anexo após alternar áreas, sem limpar o cache existente.

O comparador foi corrigido para representar como 404 arquivos que não existiam
na base histórica, adicionados pelos pilotos posteriores. Ambas as capturas
agora aguardam a mesma primeira carga sintética do Chat antes de medir estilos.
O comparador de pixels e seus limites originais permanecem intactos.

Limitação local reproduzida: o teste original e inalterado de lifecycle do
tutorial passa no percurso mobile, mas sua comparação PNG de impressão desktop
falha neste Windows tanto na candidata quanto em uma worktree limpa da main
`d8c34e9`. O recorte anterior/posterior muda a largura em 16 px. Isso não foi
tratado como regressão introduzida pelo pacote, nem como teste aprovado; o gate
original do tutorial em CI Linux continua obrigatório, sem alteração ou waiver.
Uma diferença de largura do título no teste de cabeçalho com texto normal
também foi reproduzida na main limpa deste Windows (155,625 contra 163,09375 px).
Os 24 percursos locais com texto ampliado passaram. As asserções geométricas do
cabeçalho permanecem estritas no CI, sem tolerância nova.

O primeiro CI identificou duas asserções que ainda esperavam `/cidadao/` no
mobile. Foram atualizadas para o endereço `/`, mantendo exigência de controller
correto/carregado, identidade dos nós, rascunhos, privacidade e geometria. As
matrizes da página passaram localmente em texto normal e ampliado.

A revisão também identificou que o marcador antigo permitia servir o HTML de
PR663 na primeira visita. Um novo teste unitário falhou antes da correção e
passou depois. A chave `panel=20261016-1` agora cobre também a cadeia alterada
Home/account-section-shell → citizen-layout → presenter; CSS e outros assets
mantêm suas versões anteriores. O teste de consistência exige a mesma chave dos
owners alterados em todas as entradas. Janelas de refresh, comportamento offline,
dados privados e namespaces globais não foram alterados.

A observação de logout exige o AbortSignal entregue ao fetch realmente abortado
e sua rejeição com `AbortError`, além da ausência do painel antigo no Login.
Isso substitui somente o evento de interceptação `requestfailed`, que pode não
ser emitido enquanto uma rota sintética está pausada. A exigência de cancelamento
efetivo e o prazo de falha continuam explícitos.

O segundo CI encontrou uma expectativa exata antiga da URL de `home.js` no
teste compartilhado `social-ui.test.mjs`; foi atualizada para a URL versionada,
mantendo a exigência de uma única instância. A suíte completa local do Worker
executou 1.090 testes: 1.089 aprovados e uma falha em `registration-rollout`
(`snapshot > 0`), reproduzida também na main limpa deste Windows. Esse teste
permanece inalterado e obrigatório no CI Linux. A suíte social afetada passou
após a atualização da expectativa.

O gate da Home expôs uma corrida da fixture de feed: seu evento `online` podia
coincidir com uma leitura anterior, que o produto deve agrupar. O teste agora
aguarda essa leitura antes de trocar o snapshot sintético e também exige uma
requisição do snapshot novo, preservando aviso, inclusão somente após toque e
rascunho. As pré-condições de preparo completo incluem o Canal. Os três scripts
`mobile-shell`, `mobile-shell-prewarm` e `mobile-shell-regressions` passaram
integralmente após o ajuste; os limites de memória, polling e coalescência do
produto não mudaram.

Os dois P2 de concorrência foram corrigidos com ownership das leituras de
manifestações, avisos e detalhe. Respostas e erros superados não podem renderizar;
a revalidação acompanha o resultado da leitura mais recente. O upload mobile
usa o mesmo owner do detalhe, incluindo anexos, mensagens e histórico, sem
reconstruir o formulário. O dispose elimina os owners e referências associados.
Oito cenários sintéticos controlam uma resposta anterior retida durante envio,
leitura de aviso, resposta e anexo; cobrem sucesso e erro atrasados. Todos passaram,
assim como os 17 cenários retidos e os 86 testes Node afetados. O caso de aviso
reproduziu a regressão contra `b9fe86f` antes de passar na correção. Nenhum método
ou endpoint de mutação mudou; os testes exigem exatamente a ação sintética prevista.

A inicialização mobile pendente agora retoma na ativação da área, com uma guarda
que impede montar abas/listeners novamente. O teste de entrada direta mantém o
rótulo sintético de identidade pendente e segura a primeira leitura GET; sai para a
Home antes de concluir a carga, deixa a tentativa de 50 ms expirar fora da área
e retorna após liberar a carga. Contra `e7cf38e`, esse percurso reproduziu zero
abas no retorno. Na correção, passou com uma única montagem, mesma área retida
e aba Notificações preservada após duas alternâncias. O controle do rótulo é
restrito à fixture; não altera autenticação, temporizadores ou código produtivo.
Uma primeira fixture que segurava o script opcional ficou pendente no CI Linux.
O cenário foi isolado do carregamento de scripts: pausa somente a leitura GET
sintética e limita as esperas do próprio teste, mantendo todas as asserções.
Essa fixture também reproduziu a falha no código anterior e passou na correção.

O novo workflow `validate-citizen-persistent-panel.yml` executa a matriz retida e
as seis comparações históricas em um job separado. Os gates anteriores e seus
limites permanecem intactos. Logs, capturas e recibos desta rodada estão na
worktree em `.local/` e no relatório separado `diagnostico-canal-20261017/` do
workspace, sem dados reais.

O CI do head `2d43587` encontrou uma expectativa antiga no lifecycle de compose:
depois da expulsão, a preparação automática podia já ter criado outro Canal.
Uma reprodução com navegação mais espaçada confirmou o formulário antigo fora
do documento, os dois handlers antigos ausentes e exatamente um par novo, com
o Canal preparado. A fixture agora pausa somente a admissão automática durante
a janela de expulsão, mantendo as exigências de zero handlers; depois restaura
a admissão, exige um único par novo e confirma a reutilização das mesmas funções
na ativação. Teclado, 18 navegações, limite de memória e zero envios permanecem.
O teste afetado passou localmente; nenhum código de produto mudou nessa correção.

A leitura de segurança também passou a usar ownership por geração. Ao sair do
Canal com uma leitura/atualização em curso, o owner antigo é invalidado e o
retorno exige segurança atual, inclusive se a resposta terminou fora da tela.
Se a atualização antiga ainda está em curso, ela acompanha o novo resultado;
não renova a janela de frescor com a verificação anterior. As ativações normais
continuam usando a janela existente de 30 s. Quatro cenários novos mudam o e-mail
na área Segurança por um único PATCH sintético e soltam a leitura anterior com
sucesso/erro, antes/depois do retorno. Todos passaram, preservando rascunho,
identidade da área e zero envios ao Conselho. O caso de retorno com resposta
anterior tardia reproduziu a falha em `009271d` antes de passar na correção.

O limite de 30 s da ficha de nível também reconhece alterações relevantes na
conta em cache. Bronze/Prata e a explicação de privacidade atualizam no retorno
rápido de Segurança; uma mudança durante leitura pendente agenda uma única nova
renderização. Sem mudança, a janela anterior é preservada. Os quatro cenários
de segurança agora exigem selo e explicação Bronze após partir de Prata, com
rascunho intacto. O código anterior `5fa412b` reproduziu a ficha desatualizada;
os quatro casos corrigidos, 17 percursos retidos (incluindo logout/troca) e 86
testes Node passaram. Os elementos opcionais de texto da ação não existem no
HTML atual; nenhum novo bloco visual foi introduzido para atender a revisão.

As chamadas do Canal detectam `AbortSignal.any` e `AbortSignal.timeout` antes
de usá-los. Sem um desses métodos, um AbortController combina sessão/sinal do
chamador, preserva o prazo real de 15 s para GET e remove listeners/timer no
fim da chamada; mutações continuam sem esse prazo de leitura. A versão anterior
`b33eb58` reproduziu a falha sem os métodos. Três combinações de ausência
passaram; no caso pendente o fetch foi efetivamente rejeitado com TimeoutError
após 15,1 s, mantendo aviso de dados desatualizados e sem abortar leitura já
concluída. Os oito cenários de corrida/mutação e os três de cancelamento/logout/
troca também passaram sem os dois métodos. Fixtures e artefatos desses casos
ficam separados dos resultados normais. Nenhum método global é alterado no
produto, nenhuma dependência ou regra de autorização foi acrescentada.

O retorno de Segurança também compara o estado relevante da conta em cache com
o snapshot da última leitura de segurança. Uma alteração invalida a janela de
30 s mesmo sem leitura anterior em curso; o snapshot é associado ao início da
requisição. A revalidação mais nova é a única que pode marcar dados como frescos
ou liberar o owner pendente. O quinto cenário mantém o relógio de frescor dentro
da janela, sem forçar leitura prévia e sem alterar timers reais: reproduziu a
falha em `b8ce892` e passou na correção, assim como os quatro cenários anteriores.

O CI de `5c34d8f` encontrou uma regressão na abertura do tutorial: o snapshot
de segurança tentava usar `getCachedUser`, ausente no adaptador deliberadamente
isolado da demonstração. O caminho da demonstração agora dispensa esse snapshot;
não recebe referência ao cache nem à API real. O percurso de abertura de ajuda
que falhou no CI passou nas 22 combinações locais após a correção.

A comparação nativa também aguardava apenas o Chat, que pode ficar pronto
antes da montagem independente da configuração social. O artefato Linux tinha
posições diferentes dos itens Avisos/Perfil. Uma reprodução controlada atrasou
a configuração em 0/80/400/1.000 ms nos dois códigos: a preparação antiga podia
capturar a barra ainda incompleta. A fixture agora espera os mesmos quatro
links nativos e o processamento dos observers antes de entrar em impressão.
Os oito percursos com atrasos passaram com a barra completa; não houve mudança
na base histórica, nos estilos, snapshots, comparador ou tolerância de pixels.
Na mesma investigação, capturas desktop com estilos idênticos mostraram o
mascote em duas posições: seu construtor nativo pode medir a cena antes do CSS
e limitar a posição ao tamanho provisório. A fixture carrega o CSS nativo
inalterado e só então libera a resposta sintética de estado do mascote nas duas
fontes. Não modifica posição, canvas, controlador ou propriedades do mascote.
Os gates Linux completos continuam obrigatórios para o novo SHA.

Um envio confirmado agora mantém o protocolo pendente até poder concluir sua
transição na área ativa. Se Voltar desativa o Canal e descarta o timer de
fechamento, a ativação seguinte fecha o formulário já enviado e abre o mesmo
protocolo; a conclusão em segundo plano não tira o usuário da Home. O descarte
da sessão limpa esse protocolo pendente. Cinco cenários novos usam Voltar do
histórico durante POST, upload, recarga, atraso de fechamento e falha de envio.
Todos passaram; o código `d7ddfc4` reproduziu o formulário enviado ainda aberto.
Cada cenário exige exatamente o envio sintético planejado e, quando previsto,
um upload sintético. O caso com erro exige rascunho e formulário preservados.

Cancelar uma navegação lenta tocando na rota já visível encerra a fila sem
reativar essa mesma rota ou criar outra entrada de histórico. O aviso de carga
também é encerrado; a preparação autorizada pode continuar em segundo plano.
Dois cenários deixam a preparação terminar com sucesso/erro, exigem o tamanho
original do histórico e percorrem Voltar/Avançar pela rota distinta anterior.
O código `948a074` reproduziu a entrada duplicada; os cenários corrigidos
mantêm o mesmo documento, Home, barra, Chat e mascote, sem mutações do Conselho.

As URLs Blob de anexos abertos usam o timer global de limpeza de 60 s, que não
é descartado quando o Canal fica inativo. A área acompanha essas URLs e revoga
todas no descarte da sessão, inclusive antes da navegação de logout. A versão
`dd5364a` reproduziu a ausência de revogação após sair da área. Quatro cenários
com PDF fictício passaram: expiração ativa, expiração fora da tela, descarte
com duas URLs e logout real da sessão sintética. Observam chamadas às funções
nativas de criação/revogação; a expiração de 60 s é disparada manualmente no
teste, sem alterar o relógio ou o prazo no produto. Nenhum popup real é aberto.

Próxima ação: publicar a branch/PR autorizado e acompanhar os gates de CI e a
revisão. Mesclar somente o SHA validado após todos os checks passarem; depois
confirmar os arquivos públicos, versões dos assets e deploy seguro produtivo.
Não foram utilizados conta real nem dispositivo físico.
