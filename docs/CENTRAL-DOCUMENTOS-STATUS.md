# Central de Documentos — Status

Última atualização: 29/09/2026.

## Central de Documentos — recuperação de falhas transitórias de conexão — PUBLICADA — 29/09/2026

Relato de produção: o Titon exibiu em momentos diferentes **“Falha temporária na Central de Documentos.”** e **“Failed to fetch”** enquanto o PDF já permanecia visível. A segunda mensagem é a exceção nativa de transporte do navegador quando `fetch` não recebe resposta HTTP; a primeira é a resposta genérica usada pelo Worker para falhas documentais não classificadas. Não foi atribuída uma causa interna específica ao Worker sem log que a comprove.

Diagnóstico confirmado no código: as leituras da Central encerravam na primeira oscilação de rede/edge. A correção ficou restrita ao mecanismo observável e reversível: leituras seguras passam a repetir no máximo duas vezes, após **350 ms** e **900 ms**, para falhas transitórias de transporte e respostas 500/502/503/504 elegíveis. Cobertura: acesso à Central, preferências, configuração de IA, listagem/pesquisa do Drive, download local do PDF e aquecimento privado do Service Worker.

Proteção contra duplicidade preservada: **renomear, sincronizar, substituir PDF, salvar cópia, OAuth e demais gravações não recebem retry automático**. O fluxo de Drive continua considerando salvamento concluído somente depois da confirmação real do backend/Google Drive. O erro de transporte persistente deixa de expor `Failed to fetch` cru e informa que a reconexão automática não conseguiu concluir a leitura.

Observabilidade: novo evento técnico `documents_read_retry` contém somente rota, classe de operação, número da tentativa e classe `network/server`; não inclui nome de arquivo, ID do Drive, nome de paciente ou conteúdo documental.

Entrega efetiva: PR **#536** mesclada em `9c18b14729821ac1ac98c4fade24596d58feeace`. Arquivos funcionais publicados: `js/documents.js`, `portal-sw.js` e `documentos/index.html`; teste focal em `worker/tests/documents-ui.test.mjs`. O candidato foi reconciliado com a `main` antes do merge. Uma hipótese inicial de alterar a preparação de preferências no Worker foi descartada por falta de evidência direta e removida antes da liberação; o reparo final **não altera o runtime do Worker**.

Validação do merge: **Validar Central de Documentos — Fases 1–6** success (run `36600526823`); GitHub Pages **pages build and deployment** success (run `36600524175`, concluído 16:50:20 UTC); Cloudflare Pages success; **Workers Builds: yellow-wave-d0a1guia-regulacao-ia** success no merge, confirmando que a falha de build observada em heads intermediários não permaneceu na versão integrada. Auditorias Chromium pesadas ainda em execução no momento deste registro não são declaradas aprovadas antecipadamente.

Risco residual: retry reduz falhas transitórias, mas não corrige uma indisponibilidade persistente do Worker, Google Drive ou rede. Se o banner reaparecer após esta versão, a próxima investigação deve capturar somente endpoint técnico/status/classe de erro, sem dados do documento, para localizar a origem exata.

**Próxima ação exata:** revisão humana em produção de listagem/pesquisa, abertura de PDFs e operações locais do Titon. Se houver novo erro, registrar horário e ação que o precedeu; não repetir gravações destrutivas e não considerar sincronização concluída sem confirmação do Drive.

## Chat global em todos os módulos — IMPLEMENTADO E PUBLICADO — 28/09/2026

Pedido concluído: o **chat interno está disponível em todos os módulos autenticados**, sem exigir retorno à Home e sem criar uma implementação diferente por página.

Entrega efetiva: PR **#520** mesclada em `6227311f460b73ae575f38912f17bd75c3829110`, head validado `de45ca3dc18b31fb68da03bd2b9eee2a794e7f99`. O novo bootstrap `js/portal-global-chat.js` é o ponto único de carregamento: valida sessão, respeita `mustChangePassword`, carrega autenticação sob demanda quando necessário e injeta `portal-chat.css`, `portal-chat.js` e o otimizador.

Cobertura publicada: Home, Ferramentas, Amigos, Notificações, Perfil, Segurança, Configurações, Conquistas, Estudos, Guia Médico, Fontes técnicas, Recepção, Telemedicina, Central de Documentos, Agenda, ponte de sincronização da Agenda, Canal do Cidadão, Painel do Conselho e Administração (Usuários, Monitoramento, Configuração e Social). Login, Cadastro e a página pública do Conselho permanecem sem chat.

Segurança/autorização preservadas: a interface estar presente em todos os módulos **não amplia quem pode conversar com quem**. O chat profissional continua restrito no Worker por `PROFESSIONAL_ROLES` (`medico`, `recepcao`, `coordenacao`, `telemedicina`, `admin`). `cidadao` permanece fora do diretório profissional e usa apenas contatos sociais permitidos; conversa social continua exigindo amizade atual em estado `friends`. Primeiro acesso com troca obrigatória de senha não monta o chat até concluir a etapa de segurança.

Carregamentos manuais antigos de `portal-chat.js` e `portal-chat-switch-optimizer.js` foram removidos das páginas que os possuíam, evitando duas instâncias, polling ou timers duplicados. O Guia Médico mantém somente seu observador de posicionamento da ferramenta flutuante. O preload Login→Home também deixou o chat sob responsabilidade do bootstrap global.

Cache: `portal-chat.js` e otimizador versionados como `20260928-global-1`; Service Worker em `20260928-3`, aquecendo bootstrap, script, otimizador e CSS. As asserções antigas de cache e carregamento manual foram reconciliadas sem retirar validações de autorização.

Validação pré-merge: **Validar chat interno do portal**, **Validar Camada Social V1**, **Validar Canal do Conselho V1**, **Validar interações do Portal V1**, **Validar Barra Global do Portal**, governança e demais checks rápidos pertinentes concluíram com success no candidato final. O teste focal `worker/tests/global-chat.test.mjs` verifica cobertura dos módulos, ausência em superfícies públicas, ausência de scripts manuais duplicados, sessão/primeiro acesso e matriz de autorização.

Publicação: GitHub Pages run **36420891455**, job `deploy` **108923279238**, **success** às 12:18:25 UTC de 28/09/2026; deployment `6709665051`, ambiente `github-pages`.

As auditorias Chromium pesadas que ainda estavam executando no momento do merge não foram declaradas aprovadas antecipadamente. O Worker Build separado continua uma frente independente e não foi alterado por esta entrega.

Reversão, se necessária: preparar branch da main atual e reverter somente o merge `6227311f460b73ae575f38912f17bd75c3829110` por PR; não resetar/forçar a main e não desfazer entregas não relacionadas.

**Próxima ação exata:** revisão visual humana do launcher e da conversa em módulos representativos (Telemedicina, Documentos, Agenda, Guia Médico, Conselho e Configurações). Se houver sobreposição ou diferença de posicionamento, corrigir somente o CSS/integração daquela superfície sem criar um segundo chat.

## Barra Global — correção específica da Telemedicina — PUBLICADA — 28/09/2026

Relato confirmado: `/telemedicina/` não exibiu a Barra Global após #513/#515. A rota dependia exclusivamente da injeção indireta pelo `portal-interactions.js`; em navegador com recurso anterior em cache, a barra podia não ser montada.

Correção efetiva: PR **#517** mesclada em `ff382eba69ee807435ba15fe5ea2ef8d8b992d38`, head `20c8819e31f754df958f47458ca460529f5a527a`. `/telemedicina/` passou a carregar diretamente `portal-global-navigation.js?v=20260928-2`, preservando `portal-interactions.js?v=20260923-2` e, portanto, o contrato compartilhado da camada de interações. Não foi criada segunda implementação da barra.

A primeira tentativa de também versionar `portal-interactions.js` foi descartada após os checks mostrarem quebra do teste de versão única. O ajuste foi revertido antes do merge; a solução final toca somente o HTML da Telemedicina, teste focal e documentação.

Validação pertinente: Barra Global, Social V1, interações e governança concluíram com success no candidato final. GitHub Pages run **36418789550**, job `deploy` **108916437973**, **success** às 11:58:34 UTC de 28/09/2026; deployment `6709288689`.

Sem alteração de dados clínicos, permissões, Worker, IA, Drive ou regras da Telemedicina.

**Próxima ação exata:** revisão visual humana em `/telemedicina/`; se a barra ainda não aparecer, tratar como evidência de cache/navegador ou CSS específico e diagnosticar a partir do comportamento real sem reimplementar o componente.

## Barra Global do Portal — COBERTURA COMPLETA PUBLICADA — 28/09/2026

A Barra Global do Portal está publicada tanto nos cabeçalhos padrão `.portal-topbar` quanto nas duas exceções estruturais do Portal, `/medico/` e `/protocolo/`, que usam `.site-header`.

Complemento técnico: PR **#515** mesclada em `0398b4663a740fea89953027165fa87be109610e`, head `d7f5220c33f6c307f683809337f8038cf8d96c21`. O loader e a navegação compartilhada aceitam `.portal-topbar, .site-header`; o Início legado do Guia Médico é ocultado depois que a Barra Global monta, enquanto **Sair** e **Voltar ao guia médico** permanecem por serem ações próprias. Em `/protocolo/`, o cliente de autenticação é carregado sob demanda somente quando já existe token de sessão; sem token não há login forçado nem ampliação de acesso.

Assets da Barra Global/Social Navigation e Service Worker estão em `20260928-2`. Testes de cache foram atualizados apenas na asserção `CACHE_VERSION`. Checks pertinentes do complemento — Barra Global, Social V1, interações, governança e demais suítes rápidas — concluíram com success. O Worker Build separado voltou a falhar e continua registrado como pendência externa não atribuída a esta navegação; auditorias Chromium pesadas estavam em execução no merge e não foram declaradas aprovadas antecipadamente.

Publicação do complemento: GitHub Pages run **36416967807**, job `deploy` **108910469068**, **success** às 11:40:21 UTC de 28/09/2026; deployment `6708957122`.

Estado funcional consolidado: desktop autenticado mantém **Início, Amigos, Ferramentas, Notificações, Perfil e Pesquisar usuários** ao navegar entre módulos. Mobile preserva a navegação principal adaptada. Controles contextuais dos módulos permanecem independentes da Barra Global. Nenhum dado, regra clínica, permissão, Drive, IA ou observabilidade foi alterado.

Reversão, se necessária: tratar #513 e #515 como unidades separadas e reversíveis por branch/PR; não resetar a main nem desfazer entregas não relacionadas.

**Próxima ação exata:** revisão visual humana diretamente no Portal, especialmente Agenda, Central de Documentos, Recepção, Telemedicina, Guia Médico e Fontes técnicas. Se houver divergência de posição, largura, item ativo ou cache, corrigir pontualmente sem recriar barras locais.

## Barra Global do Portal — IMPLEMENTADA E PUBLICADA — 28/09/2026

Decisão consolidada: **Barra Global do Portal** é o nome oficial do componente de navegação que mantém **Início, Amigos, Ferramentas, Notificações, Perfil e Pesquisar usuários** entre os módulos autenticados. A implementação reaproveita `js/social-navigation.js`; não cria menu paralelo e não amplia permissões.

Entrega efetiva: PR **#513** mesclada em `ba85adc975eb7c9d608fcfdfc9e9e772eff7a095` a partir do head `71d1f1e2f972e0e610a193f1282451c253e5d1ec`. `js/portal-interactions.js` carrega `js/portal-global-navigation.js` nas superfícies com cabeçalho autenticado e logout; o bootstrap reutiliza a sessão, a API social, estilos e navegação existentes. A pesquisa de usuários deixou de ser exclusiva da Home e acompanha a barra desktop quando a Camada Social está disponível. Atalhos legados diretos **Início/Ferramentas** no cabeçalho são ocultados somente depois que a Barra Global monta, evitando duplicidade e preservando os controles próprios de cada módulo. O componente versionado reconcilia páginas que já haviam carregado uma instância antiga de `PortalSocialNavigation`.

Mobile mantém os destinos principais de navegação, sem os atalhos secundários Segurança/Configurações/Conquistas dentro da Barra Global. Ausência de token não provoca login forçado por esse bootstrap. Não houve alteração de autenticação, cargos, permissões, protocolos, dados clínicos, Google Drive, IA ou observabilidade. A pesquisa continua usando somente a API social já autorizada.

Cache: Service Worker renovado para `20260928-1` e novos assets da Barra Global incluídos no aquecimento. Três testes que fixavam a geração antiga foram atualizados **somente** na asserção `CACHE_VERSION`; referências de outros assets foram restauradas após uma alteração inicialmente ampla demais.

Validação pertinente pré-merge: **Validar Barra Global do Portal**, **Validar Camada Social V1**, **Validar interações do Portal V1**, governança e as demais suítes rápidas aplicáveis concluíram com success no candidato final. A falha do `Workers Builds: yellow-wave-d0a1guia-regulacao-ia` permaneceu separada e não foi atribuída à navegação sem evidência; esta entrega não altera Worker. Auditorias pesadas de navegador ainda estavam em execução no momento do merge e não foram declaradas aprovadas antecipadamente.

Publicação: GitHub Pages run **36416124069**, job `deploy` **108907732250**, concluído com **success** às 11:32:16 UTC de 28/09/2026; deployment `6708809391`, ambiente `github-pages`. A evidência de publicação é do Portal no GitHub Pages, não do laboratório Cloudflare da Central.

Reversão, se necessária: preparar branch da main atual e reverter somente o merge `ba85adc975eb7c9d608fcfdfc9e9e772eff7a095` por PR; não resetar/forçar a main nem desfazer entregas anteriores. Não executada.

**Próxima ação exata:** receber revisão visual do operador em Agenda, Central de Documentos, Recepção, Telemedicina e Guia Médico; corrigir qualquer divergência concreta da Barra Global. Consultar os resultados finais das auditorias pesadas já iniciadas sem reiniciá-las e manter o diagnóstico do Worker como frente separada.

## Recepção — correção de contraste #486 — 25/09/2026

**IMPLEMENTADA E PUBLICADA PELO GITHUB PAGES; REVISÃO VISUAL HUMANA PENDENTE.** Pedido explícito do operador: corrigir e implementar as superfícies claras e o texto ilegível de `/recepcao/` no modo escuro. Fase 7, sem reabrir fases encerradas. Base `2a67acd503ff42e3cd3496088615528e3e4eda37`; head funcional `8841708815ec4753a81d3db56061a5c802d8fecc`; PR #486; merge `a039c08497c4b1eb92e23a11ae72461a658847cf`. GitHub Pages do merge: run `36171385857`, job `108191891604`, success. A publicação não foi confundida com o laboratório PDF.js.

Escopo concluído: cabeçalhos dos quatro grupos escuros; títulos, descrições, itens e resumo brancos; bordas semânticas de obrigatório/condicional/complementar preservadas. Regra limitada a `@media screen`, tema dark e `#receptionDetail`. Modo claro, impressão, conteúdo dos protocolos e JavaScript de produto não foram alterados; nenhum dado, permissão, segredo, IA, Drive ou observabilidade mudou. #481 segue separada.

Diagnóstico: `reception.css` continha cores claras/azuis locais; a main já possuía cobertura global para parte das superfícies, ausente na captura do operador. Cache é hipótese, não causa comprovada no navegador real. O reparo reforça o escopo local e renova `reception.css?v=20260925-1`. O tema global, sem mudança de conteúdo, mantém a versão canônica `v=20260924-dark-final-1` e recebe `refresh=recepcao-20260925` somente nessa rota. O pin do CSS local no check de orientações condicionais foi atualizado; nenhuma asserção foi retirada.

**Aceite focado:** 6/6 cenários Chromium locais e CI focal `36171225634` / job `108190955414` aprovados. Larguras 1440/412; quatro grupos, texto branco, cabeçalhos/caixas escuros, legendas distintas com contraste >=4,5:1, marcar/desmarcar, troca de condição, comparação exata de estilos/layout claro e print com CSS anterior e identidade do documento de impressão gerado. HTML, CSS e cinco renderers reais foram montados em memória com protocolo sintético, autenticação simulada, popup de impressão capturado e rede bloqueada. Não é homologação de backend, dispositivo físico ou navegação autenticada. Capturas sintéticas desktop/mobile foram inspecionadas.

A primeira execução focal `36170771944` passou o contraste, mas capturou a transição de um botão antes de terminar (diferença de altura de 0,000122px). O teste agora limpa hover/foco e aguarda animações finitas reais, mantendo comparação exata, sem arredondamento ou relaxamento. A nova query inicialmente trocava a versão global; isso violou o check de versão única. Corrigiu-se a URL para separar versão canônica e renovação de cache, preservando o teste existente. A validação local de interações passou 13/13.

**Pendência ampla reconciliada:** o run anterior da #484 `36167184456` terminou com **210/214 aprovados e 4 falhas**, não está mais pendente de execução. Três falhas foram na troca manual de dataset para light do spec médico; reconciliação da preferência de conta é hipótese a investigar. Uma falha social recebeu aviso de notificações bloqueadas em vez do erro sintético de envio. As 120 comparações contra baseline passaram. Não marcar o conjunto como aprovado nem suprimir testes. A auditoria transversal desta PR, `36171225531`, foi deixada sob o workflow existente, sem aguardar sua matriz inteira para liberar o reparo validado especificamente. Seu resultado final deve ser consultado; não há aprovação antecipada. Os builds Worker históricos continuam sem causa diagnosticada.

Alternativas descartadas: recolorir todo o Portal, mudar a paleta clara, recolorir por JavaScript, relaxar comparações, desativar a auditoria, pedir outra autorização já concedida ou reverter toda a #480. A liberação é pontual, amparada na validação específica e na revisão produtiva autorizada; não cria dispensa permanente de testes.

Reversão, somente se necessária: branch da main atual e `git revert -m 1 a039c08497c4b1eb92e23a11ae72461a658847cf` por PR, preservando os demais trabalhos; não executada. Próximo passo: receber revisão da Recepção no site, consultar a auditoria ampla já iniciada e tratar suas falhas em frente separada, além do diagnóstico autorizado do Worker. Confirmar a integração documental de `docs/reception-dark-release-20260925` antes de criar duplicata.

Os registros abaixo preservam o estado conhecido em suas respectivas execuções; esta seção e o handoff prevalecem para o estado atual.

## Publicação do reparo de contraste #484 — 25/09/2026

**IMPLEMENTADO E PUBLICADO PELO GITHUB PAGES; REVISÃO HUMANA E RESULTADO DA AUDITORIA INTEGRAL AINDA PENDENTES.** O operador reiterou a implementação (“então implemente ué”), mantendo a revisão diretamente no site já autorizada. A Fase 7 permanece ativa; nenhuma fase encerrada foi reiniciada.

- PR [#484](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/484): merged às **17:36:00 UTC**. Head conferido `29b7ffc72aec03d00bd3ce5dec31832bbe7bc1b4`; base anterior `54c1e74dd5724879b492924cbbe93f90d75234cc`.
- Merge real: **`1085ab80587a565056b262a23ab8903df9988ef2`**, integrado com verificação do SHA esperado. `0f58bf62ad6e3984e1b06c658b28a2cfb9c860c7` era somente o merge sintético.
- [GitHub Pages run 36168144829](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36168144829): build, report-build-status e deploy **success**. Job `deploy` **108181078769**, concluído às **17:37:45 UTC**, deployment `6666571287`, ambiente `github-pages`, associado ao merge `1085ab8`.
- O CSS publicado é `medical.css?v=20260925-1`: texto, listas e marcadores dos seis blocos brancos em dark/screen, incluindo a mensagem vazia. Títulos, avisos, modo claro e impressão ficam fora da regra. Sem novo código de produto nesta retomada.

**Base da decisão técnica de liberação:** prova focal local 8/8 já registrada, revisão do patch restrito e **23 workflows GitHub Actions concluídos com success**. O workflow transversal **Auditar modo escuro do Portal**, run **36167184456**, job **108177679089**, ainda estava em execução quando o merge foi realizado e na conferência deste registro. A liberação ocorreu antes do resultado integral; não deve ser descrita como aprovação de todos os checks ou do novo spec completo. A prova local é reduzida e não comprova backend. Nenhum teste, workflow, proteção ou gate foi desativado, cancelado ou relaxado. Essa decisão pontual não cria dispensa permanente de validação.

A revisão automática Codex não ocorreu por limite informado pelo bot; não constitui aprovação. O build separado do Worker no candidato, **`10cb15fe-2a46-4a93-9819-772cf0a8236f`**, também reportou failure, conforme comentário da #484. A causa não foi obtida. Não há alteração de Worker ou JavaScript funcional no patch; isso permite distinguir a publicação estática, mas não comprova a saúde operacional do backend. A pendência histórica `d8be41f4` e o diagnóstico dos builds continuam abertos. Não contornar o deploy seguro.

A tentativa de leitura HTTP de `/medico/` pela ferramenta web voltou a não acessar a URL. A publicação foi confirmada pelo deploy GitHub Pages, não por navegação autenticada ou inspeção visual do domínio. Essa limitação não é evidência de indisponibilidade global. O laboratório Cloudflare não foi usado como prova de publicação do Portal.

Alternativa descartada nesta retomada: encerrar novamente apenas com uma PR aberta e transferir outra confirmação de implementação ao operador. A autorização já existia; a correção pontual foi integrada sem modificar seu código. O risco residual de a auditoria ampla encontrar regressão permanece explícito.

**Reversão específica:** partir da main atual e preparar `git revert -m 1 1085ab80587a565056b262a23ab8903df9988ef2` em branch/PR somente se houver regressão atribuível à #484. Não reverter toda a #480, não resetar/forçar a main e não alterar dados. O comando não foi executado.

**Próxima ação exata:** consultar o resultado final do run `36167184456` já iniciado, sem reiniciá-lo. Se falhar, examinar a causa e corrigir ou reverter o ajuste conforme a regressão; se aprovar, registrar a evidência. Receber a revisão visual dos seis blocos em `/medico/`; não declarar homologação humana antecipadamente. Conferir a integração da atualização documental da branch `docs/medical-dark-contrast-release-20260925`. As demais pendências abaixo continuam preservadas.

## Ajuste pós-homologação — texto dos blocos do Guia Médico — registro inicial de validação — 25/09/2026

Este registro preserva o diagnóstico e a preparação anteriores ao merge. Para o estado operacional atual, prevalecem a seção de publicação acima e o handoff ao final.

Pedido aprovado: tornar branco o texto abaixo dos títulos em **Critérios para encaminhar**, **Informações clínicas obrigatórias**, **Exames obrigatórios para solicitar**, **Exames obrigatórios conforme o caso**, **Exames e documentos recomendados quando disponíveis** e **Elementos que auxiliam a priorização**, somente no modo escuro de `/medico/`.

Estado recuperado: `main` em `54c1e74dd5724879b492924cbbe93f90d75234cc`, com #480 e #483 integradas. A PR aberta #481 é uma frente distinta de Telemedicina e não foi alterada. A Fase 7 permanece ativa; este é um reparo visual concreto encontrado na revisão em produção, não uma reabertura da 7G.6.

Diagnóstico confirmado no código:
- os seis blocos são gerados por `blockHtml()` / `renderProtocol()` em `js/medical-app.js`, com classe real `.content-block`;
- `css/site.css` define `.content-block ul { color: var(--slate-700); }`, mantendo a lista escura mesmo quando o contêiner recebe o fundo dark;
- `p.empty` recebe a cor secundária global; também precisa do branco solicitado;
- o seletor real de tema é `html[data-portal-theme="dark"]`, não o `data-theme` ilustrativo sugerido na resposta anterior;
- a auditoria anterior bloqueava superfícies claras, mas relatava baixo contraste textual apenas para revisão manual. Por isso seu sucesso não substituía esta homologação humana.

Implementação na branch `fix/medical-dark-content-contrast-20260925`:
- sobrescrita pequena em `css/medical.css`, condicionada a `@media screen`, tema dark, `body[data-role-view="medico"]`, `#detailPanel` e `.content-block:not(.alert)`;
- listas, itens, marcadores e parágrafos desses blocos recebem `#fff`, inclusive **Não informado ou não aplicável.**;
- títulos, fundos, bordas, alerta clínico e demais módulos não são recoloridos;
- modo claro e impressão permanecem fora da regra;
- `/medico/` passa a carregar `medical.css?v=20260925-1` para invalidar a folha antiga sem rebustar o tema global;
- regressão `testing/browser/portal-dark-medical-contrast.spec.mjs` usa a rota e o renderer reais com conteúdo sintético e APIs interceptadas, cobrindo os seis blocos preenchidos/vazios, marcadores, títulos/alerta e preservação claro/print em desktop e mobile;
- nenhum workflow, gate, permissão, dado, protocolo clínico, IA, Drive ou telemetria foi alterado.

Validação já executada antes deste commit: sintaxe Node do novo spec aprovada; prova focal de cascata em Chromium local com **8/8 cenários** (1440/412 px; dark, light, print e outro perfil) aprovada. Essa prova usa um fixture reduzido com as regras CSS relevantes e **não é apresentada como teste integral da rota ou backend**. A regressão integral da rota e os checks da PR ainda precisam concluir no CI existente; a auditoria completa não foi desativada nem marcada como aprovada por antecipação.

Alternativas descartadas: tornar todo o Portal branco com seletor global; mudar variáveis claras compartilhadas; alterar conteúdo clínico; reverter toda a #480 por uma lacuna pontual de contraste. A correção usa o CSS próprio do componente, preservando o mecanismo global de tema e evitando alterações desnecessárias em outras rotas.

**Próxima ação exata:** abrir/conferir a PR desta branch, avaliar checks e a regressão Chromium, corrigir eventual falha e integrar somente após validação pertinente. Confirmar o deploy estático antes de pedir nova revisão em `/medico/`. Até essa evidência, não declarar o ajuste publicado. Reversão desta unidade, se necessária, deve desfazer somente sua PR, preservando #480 e demais mudanças. A homologação global dark e a pendência separada de Worker abaixo não são encerradas por este reparo.

## Estado atual e histórico preservado

**Fase 7 — Robustez e otimização contínua.** A Fase 0 e as Fases 1–6 não são reiniciadas. A 7G.6 permanece homologada e encerrada. A auditoria transversal de modo escuro da **PR #480 foi integrada à main**, com publicação estática confirmada pelo GitHub Pages e **homologação visual humana pendente em produção**, por decisão explícita do operador.

O histórico integral anterior foi preservado, sem editar seu conteúdo, em [CENTRAL-DOCUMENTOS-STATUS-HISTORICO-ATE-2026-09-25-PR480.md](CENTRAL-DOCUMENTOS-STATUS-HISTORICO-ATE-2026-09-25-PR480.md). Blob preservado: `28712da4976e07f4a536bcb7bec9d05f93f12f59`, correspondente ao status no merge `76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2` antes desta atualização. Esse histórico continua sendo fonte de decisões, justificativas, deltas e pendências das demais frentes; elas não são encerradas por omissão neste registro. Âncoras históricas devem ser procuradas no arquivo preservado.

A separação entre estado ativo e histórico evita leituras truncadas do documento acumulado e o uso de tarefas históricas como instruções atuais. Não houve exclusão do histórico nem alteração do Guia Mestre, Dossiê Mestre ou documentos de decisão específicos.

## Publicação da PR #480 — 25/09/2026

### Decisão humana

Após esclarecer que o staging informado era somente o laboratório PDF.js, o operador autorizou publicar a alteração e revisar diretamente no site, com possibilidade de reversão: “se o modo escuro já está pronto então pode implementar, aí eu reviso ele diretamente no site, qualquer coisa é só reverter”.

Essa decisão substitui, exclusivamente para esta entrega visual já validada tecnicamente, a exigência anterior de homologação humana no preview antes do merge. **Autorização de publicação não significa homologação visual concluída.** A revisão ocorrerá em produção. Não houve autorização para reduzir testes, modificar permissões, expor dados ou mudar integrações.

Preparar outro preview completo deixou de ser pré-requisito desta entrega. A alternativa de continuar bloqueando o merge pela indisponibilidade do preview foi descartada após a escolha explícita do operador. Uma publicação experimental sem aceite técnico não foi autorizada.

### Integração efetiva e escopo

- PR [#480](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/480): **merged**, às 16:59:58 UTC de 25/09/2026.
- Branch funcional: `fix/portal-dark-final-audit-20260924`.
- Head validado: `d1c63922473cb17053f8625b843d69a251a99647`.
- Main anterior: `5f632d71229582f87b1a7288757f178b1f34f02d`.
- Merge real: **`76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2`**. O merge usou verificação do SHA esperado.
- `478028ed2c9c3660709fac40fc55890e8ec43584` era somente o merge sintético do CI, não o merge real.

A entrega cobre 24 rotas de interface e 3 aliases. O escopo é CSS, referências versionadas de assets, testes e documentação. A PR não altera JavaScript funcional de produto, Worker runtime, autenticação, permissões, banco, Drive, IA ou regras clínicas.

Permanecem os controles transparentes/line-art branca do Titon 7G.6; Salvar PDF/Imprimir azuis; estados semânticos do Drive; dourado intencional de Altas; mostrar/ocultar senha da #482; modo claro e impressão. Papel do PDF, canvas, miniaturas e conteúdo documental conservam suas cores: o tema não inverte o documento.

### Aceite técnico pré-merge

- **54/54 checks success** no head `d1c6392`: 52 workflows GitHub Actions, Cloudflare Pages e Workers Builds.
- Auditoria: [run 36156810522](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36156810522), job `108143633296`, concluído às 16:15:37 UTC de 25/09/2026.
- **210/210 testes**, zero skips, flaky ou falhas; **404 estados**, 296 dark; 103.370 elementos visíveis e 1.705 pseudo-elementos.
- Zero superfícies claras inesperadas e zero endpoints sintéticos desconhecidos.
- 120 comparações contra main com proveniência de raiz; 111 PNG-exatas/dentro da tolerância de raster registrada.
- Diferenças estruturais/computed/layout e erros JavaScript novos continuam bloqueantes. Exceções limitadas de rasterização Linux estão documentadas; não houve ampliação de allowlist funcional para esconder defeitos.
- Evidência anterior preservada: head `6f027235b134cf798e3d3be80ce94c21011f2727`, run `36153569515`.

Os testes usam Chromium desktop 1440×1000 e Pixel 7 emulado, fixtures sintéticas e rede interceptada. Não comprovam backend real, aparelho físico, Firefox/WebKit ou aprovação humana.

### Publicação e pendências pós-merge

O [run 36164321273 do GitHub Pages](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36164321273) publicou o merge `76648e3`: job `deploy` `108168444240` **success**, concluído às 17:00:47 UTC; deployment `6665919188`, ambiente `github-pages`. O `CNAME` versionado aponta para `regulacaoeldoradoms.com.br`.

Cloudflare Pages também concluiu o deploy `3932ff3b-fc48-4a63-a67a-7a6a8310d6d1`, mas esse projeto é o laboratório da Central, não a comprovação de publicação do Portal completo.

**Pendência técnica:** o build automático separado do Worker `yellow-wave-d0a1guia-regulacao-ia`, ID `d8be41f4-d1fe-4b85-8677-df76bf7f2bcc`, reportou `failure` às 17:03:03 UTC, check `108169352943`. O check apresenta o link do console, não a causa. A integração GitHub disponível não retornou o log Cloudflare; a busca de conector Cloudflare não encontrou ferramenta utilizável nesta sessão. Não atribuir a falha ao CSS nem declarar o pós-merge 100% verde sem investigar. A ausência de alterações no backend nesta PR não comprova, sozinha, sua saúde operacional. Não contornar o gate de deploy seguro nem recriar segredos para forçar publicação.

A leitura HTTP independente do domínio nesta conversa não foi concluída: a ferramenta web não acessou a URL e a resolução de nome falhou no container. Isso limita a verificação às evidências de deploy; **não demonstra indisponibilidade global do site**. Não houve navegação autenticada, leitura de dados reais ou homologação visual pelo assistente.

## Correção da orientação sobre staging

`https://d9ef40fe.portal-regulacao-central-staging.pages.dev/` abre o laboratório sintético PDF.js. `scripts/build-central-docs-staging.mjs` copia `testing/central-docs/viewer-harness.html` como entrada; a página tem estilos claros próprios e não é o preview das 24 rotas. A indicação anterior desse endereço como Portal completo estava incorreta. A auditoria foi executada no servidor local do CI, que não é publicado automaticamente pelo bundle da Central.

Não pedir limpeza de cache, login de produção no laboratório, reabertura de gates 4D/5E, credenciais novas ou mudança de endpoints para resolver essa diferença. A revisão visual foi transferida para produção por escolha explícita do operador.

## Plano de reversão

Baseline anterior: `5f632d71229582f87b1a7288757f178b1f34f02d`. Mudança a reverter, se necessário: merge `76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2` da #480.

Se houver regressão atribuível à entrega, criar branch da main atual e preparar a reversão específica do merge (`git revert -m 1 76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2`), revisar conflitos e documentação, executar checks pertinentes e publicar via PR. O comando é referência de recuperação e **não foi executado**. Não usar reset/force-push da main: alterações posteriores devem ser preservadas. Reversão de código não desfaz operações legítimas dos usuários no banco ou Drive.

## Demais frentes — continuidade sem reinício

As pendências, métricas e fontes completas permanecem no histórico preservado e nos documentos de cada frente. Esta publicação não altera seu estado por inferência. Em particular: Fase 6 encerrada; Fase 7 ativa; 7G.6 homologada e encerrada; defeito de renomear após sincronizar e OCR retangular têm aprovações humanas registradas. Não repetir testes encerrados sem novo relato.

As decisões recentes de IA canônica, execução antecipatória, busca e pré-carregamento prevalecem sobre registros antigos de laboratório. A 7H.1 de especialidade pela Solicitação foi rejeitada e revertida na #469; não reintroduzir essa inferência em trabalho visual. 7A/observabilidade/SLOs e homologações específicas de #482 e Telemedicina V42 não foram encerradas nesta unidade; consultar suas seções antes de retomá-las.

## Handoff para o próximo chat

| Campo | Estado persistente |
|---|---|
| Fase atual | Fase 7 — Robustez e otimização contínua; Fases 0–6 e 7G.6 não reiniciadas. |
| Subfase / objetivo atual | Reparar recorrência de falhas transitórias da Central/Titon; correção #536 integrada e publicada, revisão humana em produção pendente. |
| Última ação concluída | PR #536 mesclada em `9c18b147`; GitHub Pages run `36600524175` success; Worker Build do merge success. |
| Branch atual | Funcional `fix/documents-transient-fetch-retry-20260929` integrada; registro final em `docs/documents-network-retry-release-20260929`. |
| PR atual | #536 merged; PR documental desta branch deve consolidar este handoff. |
| Último commit relevante | Merge funcional `9c18b14729821ac1ac98c4fade24596d58feeace`; head funcional `46f1e36a`. |
| Checks e testes | Central Fases 1–6 e bundle de staging success; GitHub Pages e Cloudflare Pages success; Worker Build do merge success. Auditorias Chromium pesadas ainda em execução no registro e não antecipadas como aprovadas. |
| Decisões tomadas | Retry automático somente para leituras seguras; no máximo duas repetições (350/900 ms); gravações Drive/OAuth continuam sem retry automático; hipótese de D1/preferências não comprovada foi removida. |
| Justificativas | Os relatos reais mostraram falha transitória de transporte e erro genérico da Central; recuperar leitura é seguro, enquanto repetir gravação pode duplicar efeitos. |
| Alternativas descartadas | Retry global em `auth.api`; repetir mutações; alterar Worker sem evidência; mascarar erro persistente indefinidamente. |
| Ações externas concluídas | #536 integrada; publicação estática e build Worker do merge confirmados. Nenhum segredo, OAuth, permissão, conteúdo de PDF ou dado clínico foi alterado. |
| Pendências e bloqueios | Revisão humana no navegador produtivo e resultado final das auditorias pesadas já iniciadas. |
| Riscos conhecidos | Falha persistente de rede/Worker/Drive continuará visível após duas tentativas; sincronizações só valem após confirmação real do Drive. |
| Métricas / observabilidade | `documents_read_retry` registra apenas operação/tentativa/classe de falha; sem identificadores ou conteúdo sensível. |
| Próxima ação exata | Testar produção normalmente. Se reaparecer falha, correlacionar horário + ação + endpoint técnico/status, sem dados do documento, antes de nova alteração. |
| Arquivos e fontes principais | `js/documents.js`; `portal-sw.js`; `documentos/index.html`; `worker/tests/documents-ui.test.mjs`; PR #536; merge `9c18b147`; Pages run `36600524175`; este status; Guia Mestre 1.1. |
