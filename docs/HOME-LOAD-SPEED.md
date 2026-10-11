# Abertura da Home e áreas do cidadão

Escopo: Home/feed em celular e desktop; Amigos, Perfil próprio e Mascotes como áreas secundárias. Configurações e rotas comuns recebem somente referências atualizadas aos mesmos assets compartilhados. Módulos profissionais, permissões, backend, cache do SW e runtime dos mascotes permanecem fora da otimização.

A Home iniciava configuração e dados depois de aguardar módulos de apresentação. Agora essas tarefas independentes se sobrepõem; a superfície final continua aguardando dados, gates e apresentação. Três módulos que já eram sempre carregados são antecipados com modulepreload. O CSS móvel da Home usava duas URLs de versão para o mesmo arquivo: a referência foi alinhada ao carregador. O CSS da navegação móvel é antecipado com media apropriado, sem novo download necessário no desktop.

Os controladores cidadão reaproveitam configuração já obtida por até cinco segundos durante o startup. A opção é limitada a cinco segundos; chamadas normais e forçadas continuam revalidando. Usa o cache de sessão existente, isolado por conta e limpo no logout; não adiciona cache privado persistente de feed/perfil. Feed e perfil próprios continuam consultando os endpoints existentes. Identidade e publicações do Perfil são lidas em paralelo depois de resolver o perfil. Para as quatro áreas, CSS e registro de factories podem carregar juntos, antes de inicializar a área; a fila continua preparando uma área por vez.

O updater agora espera o registro e a conclusão dos inicializadores reais da área inicial. Verificação de novidades não consulta uma Home ainda não inicializada. Seus intervalos, backoff e retomada permanecem os mesmos. O aviso de carregamento ficava no fluxo e acrescentava 75px ao feed durante uma troca ainda não preparada. Agora permanece visível sobre a página, acima da barra, sem deslocar a leitura. Retry e anúncios acessíveis são preservados.

## Medição reproduzível

`testing/citizen-layout/home-load-speed.mjs` usa Chromium de sistema e fixtures de cidadão no loopback. Executar da raiz com `RESULT_FILE=.local/home-speed.json node testing/citizen-layout/home-load-speed.mjs`. `SOURCE_ROOT` permite servir a árvore anterior; `SAMPLES`, `WIDTHS` e `MODES` restringem repetições/cenários. O controle é a árvore publicada 4e8c2d91 (mesmos arquivos de produto que e30f9d7e).

Cold significa contexto novo com uma sessão sintética já autenticada e sem caches sociais. Session-warm significa recarregar no mesmo contexto, preservando caches de sessão. Interceptação e no-store dos fixtures impedem medir cache HTTP/CDN quente; estes resultados não afirmam uma latência de produção ou de primeiro login. Rede limited usa 150ms de latência e 200000 B/s de download/100000 B/s de upload para assets; as respostas de API sintéticas acrescentam 150ms. O servidor local não aplica compressão. Chat usa o protocolo de sessão nativo com sockets bloqueados. Duas repetições por combinação são evidência exploratória, não uma estimativa estatística populacional.

Tempo de conteúdo útil termina quando a Home social e publicações estão disponíveis. A preparação termina quando Amigos, Perfil e Mascotes estão prontas. Cada retorno preparado conserva o documento e registra o tempo da troca e suas consultas; polling global pode continuar. O benchmark não é gate de milissegundos. Reabertura mobile é variável neste modelo de reload; não há promessa de ganho estável de cache quente.

Médias centrais (medianas de duas repetições), rede limited:

| Cenário | Antes | Depois | Redução |
| --- | ---: | ---: | ---: |
| Mobile · cold | 6.30s | 5.65s | 10.3% |
| Mobile · session-warm | 9.66s | 12.18s | -26.1% |
| Desktop · cold | 6.28s | 5.61s | 10.8% |
| Desktop · session-warm | 6.28s | 5.64s | 10.1% |

No reload mobile aquecido, as amostras variaram cerca de 6–13 s; a mediana não demonstra um ganho confiável nesse cenário. Uma repetição diagnóstica registrou cerca de 6,7 s antes do primeiro asset tanto no controle publicado quanto na candidata; essa espera de navegação entra no tempo total e antecede o startup otimizado. O controle também apresentou reloads de cerca de 12,8 s. Não foi isolada a causa dessa espera, e estes dados não sustentam uma promessa para reload móvel. Em rede local as diferenças são pequenas e variáveis. As trocas preparadas permanecem na ordem de dezenas de milissegundos, sem novos arquivos ou consultas iniciais próprias. O inventário da Home contém 31 assets JS/CSS declarados, aproximadamente 501 kB brutos/117 kB gzip estimado; não é medição de bytes transferidos em produção. Nenhuma área/dado extra foi incluído para obter o ganho.

## Verificações

`home-startup.mjs` segura a apresentação para provar que dados avançam em paralelo, mas a superfície permanece gated. Cobre celular/desktop, indisponibilidade sem consultar feed privado, consulta inicial única, foco durante startup e CSS solicitado uma vez. É executado pelo workflow Home tools carousel. Contratos da configuração verificam limite de freshness, refresh normal/forçado, troca de conta e logout. Os gates existentes mantêm navegação, rascunhos, rolagem, limite 16, updater, identidade de Chat/pet e retry. O cenário lento verifica que o aviso não desloca a leitura. A publicação depende dos checks obrigatórios do SHA final.
