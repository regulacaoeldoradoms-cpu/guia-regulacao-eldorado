# Central de Documentos — Status

Última atualização: 24/09/2026.

## Fase 7H — ordem operacional da IA documental + Especialidade — PUBLICADA TECNICAMENTE; HOMOLOGAÇÃO HUMANA PENDENTE — 23/09/2026

Pedido aprovado: os dados extraídos no Titon devem priorizar a sequência operacional **Nome do paciente → CNS → CPF → Data de nascimento → Telefone → Nome da mãe → Endereço → Nome do(a) médico(a) → CRM / RMS → Agente → CID → Código do procedimento → Especialidade → Motivo do encaminhamento**.

Diagnóstico: a `main` já possuía ordem personalizável por conta, porém o padrão não correspondia à sequência solicitada e o schema médico ainda não possuía `especialidade`. A unidade foi implementada na branch `feat/titon-ai-field-order-20260923`, sem reabrir fases encerradas e preservando a publicação anterior da 7G.4.

Implementação publicada:
- ordem canônica de frontend e backend alinhada à sequência aprovada;
- rótulos visíveis **Telefone**, **Nome do(a) médico(a)** e **CRM / RMS**;
- novo campo `especialidade` no schema médico, Gemini e fallback Workers AI;
- `especialidade` voltou ao contrato anterior da 7H: somente rótulo explícito na própria página pode preencher o campo; solicitação, procedimento, exame, CID, diagnóstico, motivo, sintomas e título não são usados como fonte;
- prompts restaurados ao baseline anterior: extração `v3`, análise `v5`, transporte compacto `v5`; versão técnica `phase5e-v8c3-specialty-order`;
- preferências antigas de 16 campos migram para o novo shape de 17 campos sem SQL destrutivo;
- **Título**, **Procedimento solicitado** e **Descrição do CID** permanecem como campos complementares depois da sequência solicitada, evitando perda de informação já suportada;
- resultados continuam separados por página, preservando proveniência; não houve consolidação artificial entre páginas;
- nenhuma telemetria com conteúdo clínico ou identificadores documentais foi adicionada.

Integração:
- PR funcional **#463 — “Titon: ordenar dados da IA e incluir Especialidade”**;
- head final da PR: `c6622a1013e23652910129359a171cefcb7d3d30`;
- merge na `main`: **`29741b9914fff08f962630864373900bfd865dd1`**.

Validação:
- CI final da PR: **24/24 workflows concluídos sem falhas**, incluindo **Validar Central de Documentos — navegador**;
- o primeiro ciclo revelou contratos obsoletos de versão em testes compartilhados e no workflow da Central; foram atualizados para os prompts `v3/v5/v5` e versão `phase5e-v8c3-specialty-order`, sem alterar o requisito funcional;
- pós-merge da `main`: **22/22 workflows de push concluídos com success**, incluindo Central de Documentos Fases 1–6, governança e site;
- GitHub Pages build/deploy run **35895563616**: **success**, para o merge `29741b99`;
- o primeiro e o segundo Workers Builds pós-merge funcional falharam sem promover versão; o gate seguro permaneceu fail-closed;
- no head posterior `ca6714e062649de41bf70f43fe062ed316121091`, que contém integralmente a implementação da #463, **Workers Builds concluiu com success** (build `64027adc-c613-47a2-80cf-2c83b70e533e`) e publicou a versão **`6214244a-b6b4-4dd9-8e3e-74fe2e1466e0`** do Worker institucional;
- Cloudflare Pages no mesmo head `ca6714e`: **success**.

### 7H.1 — especialidade pela Solicitação — REPROVADA NA HOMOLOGAÇÃO; ROLLBACK EM ANDAMENTO — 24/09/2026

A alteração publicada pela PR #467 foi reprovada na homologação humana. O comportamento que permitia usar **Solicitação** como fallback para **Especialidade** produziu resultado operacional insatisfatório e deve ser removido.

Decisão aprovada:
- voltar exatamente ao comportamento anterior à 7H.1;
- `especialidade` volta a aceitar somente rótulo explícito de especialidade na própria página;
- remover a regra que aceitava `Solicitação`, `Solicitação de agendamento`, `Solicitação médica` ou `Serviço solicitado` como fonte alternativa;
- restaurar prompts, testes, matriz sintética e contrato de CI ao estado anterior da 7H.1;
- não alterar a ordem dos campos, o campo `especialidade` em si, permissões, Drive, Gemini canônico, dados persistidos ou observabilidade.

Alternativa descartada: tentar ajustar a heurística da Solicitação. Motivo: a solicitação humana é de **voltar ao comportamento anterior**, não de fazer nova calibração nessa abordagem.

Rollback preparado na branch `revert/titon-specialty-request-20260924`, restaurando os arquivos funcionais ao estado da `main` imediatamente anterior à PR #467 (`2fe0b47a598198e985bf268b6935e632709e5319`), preservando este registro histórico no status.


Estado: **implementação, merge, frontend e Worker institucional publicados tecnicamente**. Resta a homologação humana de uma extração real autorizada no Titon. A pendência visual separada da 7G.4 continua válida e não foi absorvida por esta unidade.

**Próxima ação exata:** em `/documentos/`, executar Ctrl+F5, abrir um PDF real autorizado no Titon, acionar a extração e conferir a ordem/rótulos; validar especialmente que **Especialidade** só seja preenchida quando estiver explicitamente indicada na própria página e que **NÃO CONSTA/ILEGÍVEL** continuem corretos.

## Refinamento transversal do modo escuro — PUBLICADO; HOMOLOGAÇÃO VISUAL PENDENTE — 23/09/2026

A PR funcional **#456 — UI: concluir cobertura geral do modo escuro** foi mesclada na `main` pelo commit **`3a528eb5116fa86ec0e52a2b09d2e7f1988fb743`**.

A implementação preservou o escopo definido: somente apresentação do modo escuro, centralizada em `css/portal-interactions.css`, com cache-buster `portal-interactions.css?v=20260923-2`. Não houve mudança de backend, autenticação, permissões, regras clínicas/operacionais, conteúdo do chat ou observabilidade.

Durante o primeiro CI da PR, dois workflows falharam pelo **mesmo contrato de teste obsoleto**, não por regressão funcional: `worker/tests/social-ui.test.mjs` ainda exigia `portal-interactions.css?v=20260923-1`. O contrato foi alinhado ao novo cache-buster no commit `a2d7134937759f36a43b36d86cd1289808ea6329`. Depois disso, a PR concluiu **50/50 workflows com success**, sem falhas.

Após o merge, o push da `main` também concluiu **50/50 workflows com success**, incluindo:
- `pages build and deployment`, run **35885862244**: success;
- `Validar abertura pós-login — navegador`, run **35885865345**: success;
- `Validar interações do Portal V1`: success;
- `Validar Camada Social V1`: success;
- `Validar pré-regulação conversacional`: success;
- validações de Telemedicina, Recepção, Central de Documentos e demais rotas afetadas: success.

Estado: código e publicação técnica estão concluídos. Resta somente a **homologação visual humana em produção** das superfícies mostradas nos prints: `/perfil/`, `/telemedicina/`, `/conquistas/`, `/recepcao/` e `/medico/`. O chat interno já foi aprovado antes desta unidade.

Próxima ação exata: no modo escuro, executar Ctrl+F5 e revisar as cinco rotas acima. Se aprovadas, registrar a homologação e retomar a pendência separada **7G.1 da Central de Documentos em `/documentos/`**.


## Refinamento transversal do modo escuro — EM PR — 23/09/2026

A homologação humana do refinamento do **chat interno em modo escuro foi aprovada**: o operador confirmou que “o chat ficou ótimo”. Na mesma homologação, prints reais revelaram superfícies claras residuais em **Perfil, Telemedicina, Conquistas, Recepção e Guia Médico**, inclusive no assistente de pré-regulação.

Foi criada a branch `fix/portal-dark-mode-general-polish-20260923` diretamente da `main` `097f92f9f5b273d8f35a25599bee8d7a8708b652` e aberta a PR **#456 — UI: concluir cobertura geral do modo escuro**.

Implementação:
- a correção permanece centralizada em `css/portal-interactions.css`, sem recoloração por JavaScript;
- Perfil: cards do perfil, editor de módulos, chips e botões secundários;
- Conquistas: painel Bronze/Prata/Ouro, trilha, medalhas, blocos explicativos e textos auxiliares;
- Recepção: lista lateral de especialidades/exames, hover e seleção;
- Guia Médico: hero, etapas, protocolo oficial, aplicação prática, checklist, alertas e assistente Gemini/pré-regulação;
- Telemedicina: Data operacional, quatro indicadores, workspace, toolbar, filtros, alternância Lista/Grade, cards, subblocos, modais e formulários;
- seletores da Telemedicina ganharam especificidade suficiente para prevalecer sobre as camadas visuais V12/V16 sem alterar lógica funcional;
- impressão continua clara porque a cobertura complementar está em `@media screen`;
- o modo claro permanece inalterado;
- cache-buster global renovado para `portal-interactions.css?v=20260923-2` nas rotas visuais.

Segurança e escopo: **nenhum backend, permissão, autenticação, conteúdo clínico, regra de negócio ou telemetria foi alterado**. A correção é exclusivamente visual e transversal à Fase 7. O head funcional antes desta atualização documental é `4772410d`.

Validação automatizada: regressão adicionada em `worker/tests/portal-interactions.test.mjs` para exigir cobertura das superfícies homologadas e o novo cache-buster. CI da PR #456 ainda deve concluir antes de merge.

Próxima ação: aguardar todos os checks da PR #456; corrigir qualquer regressão se houver; com CI integralmente verde, mesclar e confirmar publicação. Depois, homologar visualmente em produção `/perfil/`, `/telemedicina/`, `/conquistas/`, `/recepcao/` e `/medico/`. A homologação 7G.1 da Central permanece separada e deve ser retomada após esta unidade transversal.


## Publicação do novo vídeo de abertura — CONCLUÍDA — 18/09/2026

A mudança transversal foi encerrada com sucesso. A PR **#212** integrou o novo MP4 à `main` no merge `9b409e4c59470c4b37ab9d5e3d1a8a16ed735e82`; a PR **#213** corrigiu exclusivamente o verificador público e foi mesclada em `87b88c0e7e37df1c56a25933f2f27aad2795e35c`.

Evidências finais de publicação:

- GitHub Pages build/deploy `35323249977`: **success**;
- abertura pós-login em `main`, run `35323251451`: **success**;
- no mesmo run, o passo **Confirmar publicação estática em produção sem autenticar**: **success**, comparando hashes dos arquivos públicos em `regulacaoeldoradoms.com.br` com o commit;
- Fases 1–4 `35323251417`: **success**;
- governança `35323251482`: **success**;
- site `35323251448`: **success**.

O MP4 oficial permanece com **3.275.007 bytes**, SHA-256 `21aae188af40d816ef392380d5ae6b775453571e2c413c31ec0c7b8efb07b489`, URL `/assets/portal-opening-v1.mp4?v=20260918-1` e controlador `login-opening.js?v=20260918-1`. Os testes reais confirmaram aproximadamente 10 segundos, áudio habilitado, 1280×720, desktop/mobile, cache e fallbacks.

A PR antiga **#211** foi fechada sem merge; nenhum histórico obsoleto daquela branch entrou na `main`. O run pós-merge anterior `35322605460`, baseado no verificador ainda antigo, é histórico e foi substituído pela correção #213 e pela confirmação verde `35323251451`.

Conclusão: **nenhuma pendência do vídeo de abertura**. A Central permanece na **Fase 5 — IA documental**; a próxima frente deve ser criada em branch separada conforme o Guia Mestre.

## Publicação do novo vídeo — merge concluído; verificador público em correção — 18/09/2026

A PR **#212** foi mesclada na `main` pelo commit `9b409e4c59470c4b37ab9d5e3d1a8a16ed735e82`. O GitHub Pages concluiu build/deploy com sucesso no run `35322604005`, e os checks de site, governança e Fases 1–4 do merge também ficaram verdes.

Durante a verificação pós-merge foi detectado um bloqueio **somente no smoke público**: `scripts/verify-login-publication.mjs` ainda procurava `login-opening.js?v=20260917-3`, embora o HTML oficial agora use `20260918-1`. Isso não reverte o MP4 nem o deploy; torna apenas impossível o próprio verificador reconhecer a nova versão. Foi criada a branch `fix/opening-publication-verifier-20260918` para alinhar o smoke à versão atual. O run pós-merge antigo `35322605460` pode falhar por essa asserção histórica e não deve ser interpretado como regressão do vídeo.

Próxima ação: validar e mesclar o ajuste do verificador; no push seguinte à `main`, exigir sucesso do passo **Confirmar publicação estática em produção sem autenticar** antes de encerrar esta mudança transversal. A Fase 5 continua sendo a fase corrente da Central.

## Mudança transversal — novo vídeo oficial de abertura pós-login — 18/09/2026

Sem alterar a fase corrente da Central de Documentos, foi aberta a PR **#212** na branch `feat/post-login-opening-video-refresh-20260918`, criada diretamente da `main` atual `b962e124ea69a7d1136c608f716dc978aa047192`. A branch antiga `feat/post-login-opening-video` não será mesclada; dela foi reaproveitado somente o blob do novo `assets/portal-opening-v1.mp4`.

Metadados do candidato oficial: **3.275.007 bytes**, SHA-256 `21aae188af40d816ef392380d5ae6b775453571e2c413c31ec0c7b8efb07b489`. O cache-buster da mídia foi renovado para `20260918-1`, o controlador para `login-opening.js?v=20260918-1`, e o Service Worker passou a remover pontualmente a versão anterior do controlador sem apagar sessão, documentos ou o cache independente de mídia.

Contratos preservados: Entrar continua autenticando no primeiro clique; o vídeo não controla credenciais; Home continua sendo preparada durante a reprodução; fallback legado permanece disponível; áudio permanece habilitado; o teste real exige ~10 s e 1280×720. Esta tarefa é transversal ao Portal e **não reabre a Fase 4** nem inicia por conta própria a Fase 5.

Validação direcionada aprovada no run `35321759169`: **11/11 contratos Node**, **24/24 cenários Chromium da abertura** (desktop/mobile) e **8/8 cenários de Home durante o vídeo**, todos verdes. Esses testes confirmaram 1280×720, duração real próxima de 10 s, áudio habilitado, reprodução integral, cache local, fallback e ausência de regressão no primeiro clique. Fases 1–4 também passaram no run `35321759254` e a governança passou no run `35321759083`.

Um check transversal de bundle de staging (`35321759063`) revelou uma asserção obsoleta do próprio workflow: ele ainda exigia que `worker/wrangler.toml` contivesse o antigo hostname `codex-central-docs-drive-syn...`, embora a publicação final da Fase 4 tenha neutralizado corretamente `DOCUMENTS_HOMOLOGATION_ORIGIN=""`. A PR #212 corrige somente essa asserção para exigir o valor vazio em produção; o teste com `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL` explícito continua validando a materialização segura do preview. Isso não foi causado pelo MP4 nem altera a configuração produtiva.

## Reconciliação com a main atual — concluída em 18/09/2026

A branch da Fase 4 incorporou a main `cd71ad566a443cd2f89b1d98285856c22baf73d7` por merge de dois pais no commit `b28999c6d0f0fb415783f7d3c85abf3cad82edf7`. O PR #201 foi colocado em **draft** para impedir integração acidental antes da homologação real 4D. Depois da reconciliação, a branch ficou **0 commits atrás da main**, o PR tornou-se tecnicamente mergeável, mas continua deliberadamente sem merge.

A comparação desde a base comum mostrou somente três arquivos alterados nos dois lados: `docs/CENTRAL-DOCUMENTOS-STATUS.md`, `portal-sw.js` e `scripts/build-central-docs-staging.mjs`. A resolução preservou simultaneamente a Fase 4 e a abertura/Home já publicada na main: cache/versionamento da Central + aquecimento/invalidação seletiva da abertura no Service Worker; bundle 4D + harness/vídeo/scripts da abertura no staging. Para `/opening/*`, a CSP da main foi preservada de forma específica, sem afrouxar os caminhos sintéticos/4D existentes.

A primeira execução após o merge detectou uma regressão **somente de contrato automatizado**: a invalidação da abertura usava o mesmo cache por meio da variável `staticCache`, mas o teste oficial exige a forma incorporada na main com `loginCache`. O código foi alinhado exatamente ao contrato da main em `1d4decd03e0047a1bad678d60cee36ba6822d5b5`, sem mudar escopo, cache apagado ou permissões.

Validação do head funcional `1d4decd`:
- Fases 1–4: run `35314098073`, **285/285 testes**, zero falhas.
- Bundle de staging: run `35314098147`, sucesso.
- Governança: run `35314098169`, sucesso.
- Procedimento operacional V3: run `35314098114`, sucesso.
- PDF.js real em Chromium: run `35314098112`, **75 passed / 3 skipped esperados**, sem falha.
- Abertura pós-login: run `35314098062`; **11/11 contratos**, **24/24** cenários de abertura e **8/8** de Home real aprovados.

A mudança transversal da main também permanece preservada: PR #207 incorporou Home inicializada durante o vídeo no merge `702471c7b180e31faa8e281ee0fefe04ee759474`, e PR #208 registrou a conclusão/publicação. Não restaurar o bloqueio antigo do botão Entrar nem remover o handoff `PortalHomeReady + ended`.

Não houve merge em main, escrita no Drive, nova janela Cloudflare, SQL, OAuth ou alteração de segredo nesta reconciliação. A janela 4D antiga continua revogada e não deve ser reutilizada.

## Descoberta operacional — config local antigo ausente

Na tentativa de reconferir a produção antes da nova janela 4D, o arquivo local `%LOCALAPPDATA%\\CentralDocumentos4D\\ultimo-preview.json` foi encontrado, porém o `configPath` referenciado por ele já não existe no Windows do operador. O resultado foi `PRODUCAO_4D_LEITURA=CONFIG_NAO_ENCONTRADA`.

Isso **não alterou Cloudflare, D1, Drive, OAuth ou o repositório**: a checagem parou antes de executar `wrangler deployments status`. A configuração ausente era um artefato local transitório de uma execução anterior e não deve ser reconstruída a partir da janela 4D revogada.

**Decisão:** para a reconferência produtiva, usar uma configuração Wrangler efêmera e mínima, somente com `name`, `account_id` e `send_metrics=false`, criada em arquivo temporário e apagada ao final. Não copiar segredos, bindings, D1, controle antigo ou variáveis da homologação. Essa consulta será somente leitura e utilizará a autenticação Wrangler já existente do operador.

## Produção reconfirmada e preparo V4 — 18/09/2026

O operador executou a consulta Wrangler efêmera e somente leitura criada após o `configPath` antigo ter desaparecido. Resultado sanitizado e atual:

- `deployment=250b3d7b-9012-4073-9986-de36dd14bc3d`;
- `version=91eae913-ebaa-4550-8e88-f701f6cef777`;
- `percentage=100`.

A produção permanece exatamente no snapshot já revisado. A consulta não continha D1, segredos, controle 4D nem comando de escrita; o arquivo temporário foi removido ao final.

Com essa pré-condição confirmada, foi criado `scripts/central-docs/preparar-nova-janela-4d-v4.mjs`. O V4 **não reutiliza** controle, prazo ou gate da janela antiga. Ele:

- reconfirma a produção imediatamente antes de qualquer alteração;
- baixa o runtime Worker do commit funcional validado `1d4decd03e0047a1bad678d60cee36ba6822d5b5` e verifica 15 blobs Git alcançáveis pelo entrypoint;
- valida o preview-base antigo apenas como template de bindings/origens, mantendo o gate em `false`;
- copia no D1 o mesmo escopo autorizado sem imprimir usuário ou fileId;
- cria identificador novo e prazo de 90 minutos somente após confirmação humana;
- cria primeiro o controle **desabilitado**;
- gera e inspeciona dry-run multipart com herança restrita de segredos;
- envia somente uma nova **versão preview**, sem deployment de produção;
- confirma alias/versão e somente então ativa o controle da janela, ainda com `DOCUMENTS_DRIVE_WRITE_ENABLED=false`;
- em falha após criação do controle, tenta revogá-lo automaticamente e bloqueia repetição cega se o upload já tiver sido tentado.

Artefato de teste: `scripts/central-docs/preparar-nova-janela-4d-v4.test.mjs`. Workflow `Central de Documentos — Procedimentos operacionais 4D`, run `35315648867`, job `105506595777`: **87/87 V3 + 9/9 V4, zero falhas**, além de sintaxe V4 aprovada. Commit CI-validado para download do V4: `886b02a24f7f2848739d3476bde80d51d428f8dd`.

Nenhuma janela nova foi criada ainda; não houve INSERT/UPDATE D1, upload de versão, alteração de alias, Drive ou produção nesta preparação de código.

## Nova janela 4D preparada — 18/09/2026

O operador executou o V4 CI-validado no Windows autenticado no Wrangler. Resultado sanitizado:

- preview version: `16ebdf23-f3a6-403a-88f7-972996d83df1`;
- controle novo: `phase4d_d28ac0d37fe3409f8751fac02007e777`;
- expiração: `2026-09-18T08:11:26.000Z`;
- release servido esperado: `1d4decd03e0047a1bad678d60cee36ba6822d5b5`;
- `DOCUMENTS_DRIVE_WRITE_ENABLED=false`;
- produção reconfirmada imediatamente antes: versão `91eae913-ebaa-4550-8e88-f701f6cef777`, deployment `250b3d7b-9012-4073-9986-de36dd14bc3d`, 100%.

O V4 concluiu as sete etapas: runtime fixo e blobs conferidos; produção/preview-base reconfirmados; controle novo criado desabilitado; dry-run inspecionado; versão preview enviada sem deployment de produção; controle da janela ativado com gate de escrita ainda desligado; alias/release/barreira de autenticação confirmados.

**Estado de segurança:** a nova janela existe e está ativa no D1, mas a escrita no Google Drive continua bloqueada pelo feature gate. Nenhum PDF foi alterado por esta preparação. O próximo passo é validar login e leitura real no frontend de homologação com o gate ainda `false`; somente depois deve existir nova confirmação humana para habilitar escrita temporária.

## Salvaguardas preparadas antes da escrita — 18/09/2026

Enquanto o gate permanece `false`, foram preparados e validados dois procedimentos adicionais, sem execução remota:

- `scripts/central-docs/habilitar-escrita-nova-janela-4d-v4.mjs`: somente poderá publicar uma versão preview com gate `true` depois de reconfirmar produção, preview preparado, controle D1 ativo, ausência de sessão de upload, tempo mínimo restante e confirmação humana explícita de que a leitura sem escrita foi validada. Não altera deployment de produção.
- `scripts/central-docs/encerrar-janela-4d-v4.mjs`: encerramento fail-closed; revoga primeiro o controle D1 e, se a escrita tiver sido ligada, tenta recolocar o alias em uma versão com gate `false`, confirmando bloqueio HTTP final.

Workflow `Central de Documentos — Procedimentos operacionais 4D`, run `35316410717`, job `105508900999`: sintaxe aprovada e **87/87 V3 + 9/9 preparo V4 + 5/5 habilitação V4 + 4/4 encerramento V4**, zero falhas.

Nenhum desses dois procedimentos foi executado contra Cloudflare/D1. A janela preparada continua com `DOCUMENTS_DRIVE_WRITE_ENABLED=false`.

## Login e leitura real validados com gate false — 18/09/2026

O operador validou no frontend real de homologação, mantendo `DOCUMENTS_DRIVE_WRITE_ENABLED=false`:

- autenticação concluída;
- listagem do único PDF descartável autorizado exibida com nome genérico `PDF descartável 4D 1.pdf`;
- interface marcou o ambiente como `Somente leitura`;
- PDF abriu no visualizador próprio com 3 páginas e miniaturas;
- conteúdo exibido era sintético de homologação, sem dados pessoais ou clínicos.

Esta evidência confirma o requisito intermediário de **login + listagem + abertura/leitura antes de habilitar escrita**. Não foi executada edição, sincronização ou upload nesta validação.

Próxima ação: usar o procedimento V4 de habilitação de escrita, já testado no run `35316410717`, que reconfirma produção/janela/sessões e exige confirmação humana explícita antes de publicar uma versão preview com `DOCUMENTS_DRIVE_WRITE_ENABLED=true`.

## Incidente controlado na habilitação de escrita V4 — 18/09/2026

A primeira tentativa de habilitar a escrita temporária foi interrompida na etapa **3/6 — dry-run**, com `ANOTACOES_MULTIPART_DIVERGENTES`.

Impacto: **nenhum upload de versão com gate true foi executado**. O procedimento falhou antes da etapa que grava o marcador de tentativa e antes de `versions upload` real. O ledger da janela permaneceu com `writeGateEnabled=false`; o controle D1 continuou ativo e a preview preparada permaneceu em somente leitura.

Causa identificada no código: o helper `inspectMultipart()` do preparo V4 validava por padrão as anotações do preview de preparação (`central-docs-phase4d-v4` / mensagem de escrita bloqueada). O procedimento de habilitação usa intencionalmente tag/mensagem próprias (`central-docs-phase4d-v4-write` / escrita temporária controlada), mas reutilizava o helper sem informar essas anotações. O mesmo defeito potencial existia no procedimento de encerramento.

Correção: `inspectMultipart()` passou a aceitar o conjunto de anotações esperado como parâmetro; habilitação e encerramento agora passam explicitamente alias/tag/mensagem próprios. Foram adicionados testes de regressão para impedir o retorno desse erro.

Validação: workflow `Central de Documentos — Procedimentos operacionais 4D`, run `35317193310`, job `105511336507`: **87/87 V3 + 9/9 preparo V4 + 5/5 habilitação V4 + 5/5 encerramento V4**, zero falhas e sintaxe aprovada. Head funcional corrigido: `cf241735415a3e527bb285e82983edce50818bcd`.

Próxima ação: repetir somente a habilitação V4 corrigida; não recriar a janela, não repetir o preparo V4 e não alterar o PDF até receber `ESCRITA_4D_LIBERADA`.

## Escrita temporária 4D habilitada — 18/09/2026

O operador executou o procedimento V4 corrigido de habilitação. Resultado sanitizado:

- preview com escrita: `7a3418c6-af84-4709-b361-bf185f49bdea`;
- controle: `phase4d_d28ac0d37fe3409f8751fac02007e777`;
- expiração preservada: `2026-09-18T08:11:26.000Z`;
- release: `1d4decd03e0047a1bad678d60cee36ba6822d5b5`;
- `DOCUMENTS_DRIVE_WRITE_ENABLED=true` somente no preview;
- produção permaneceu em `91eae913-ebaa-4550-8e88-f701f6cef777` / `250b3d7b-9012-4073-9986-de36dd14bc3d` / 100%.

O procedimento concluiu as seis etapas, incluindo reconfirmação da produção, janela/controle e ausência de sessão de upload antes de publicar a versão preview com escrita temporária. A matriz real 4D pode agora começar. Não alterar produção, não reutilizar a janela antiga e não prolongar o prazo.

Próxima ação operacional: recarregar o frontend de homologação para obter capabilities/gate atualizados e executar primeiro um autosync normal isolado, sem edição concorrente, observando `pending → syncing → success → normal`. Depois validar ausência de reenvio sem mudança antes de avançar para edição durante upload.

## Primeiro autosync real aprovado — 18/09/2026

O operador realizou uma única alteração reversível no PDF descartável (rotação da página 1), sem edição concorrente. O autosync percorreu os estados visuais e concluiu com a mensagem `Sincronizado com o Google Drive.`; a listagem refletiu novo horário de modificação no arquivo descartável.

Resultado: **primeiro salvamento real isolado aprovado**. A interface não declarou sucesso antes da confirmação final visível do Drive.

Observação de desempenho: o intervalo entre `syncing` e `success` foi percebido como mais lento que no Lumin. Por decisão do operador, essa otimização **não bloqueia a publicação atual** e deve ser tratada depois como trabalho de desempenho/robustez (Fase 7), sem reduzir validação, integridade ou confirmação real do Drive.

Para acelerar a publicação sem remover salvaguardas, a matriz real será reduzida ao caminho crítico de aceite da Fase 4: (1) ausência de reenvio sem mudança + segundo salvamento consecutivo; (2) fechamento/reabertura confirmando persistência; (3) conflito externo verdadeiro sem sobrescrita silenciosa; (4) encerramento fail-closed da janela. Casos adicionais de edição durante upload, falha/retry e refinamento de latência permanecem registrados como hardening posterior, cobertos por testes automatizados nesta versão.

## Segundo autosync e ausência de reenvio aprovados — 18/09/2026

O operador confirmou duas evidências reais consecutivas no frontend de homologação:

- sem interação com o PDF, **não ocorreu nova sincronização**;
- uma segunda alteração simples provocou novo autosync e terminou novamente com sucesso.

Resultado: aprovados os critérios reais de **ausência de reenvio sem mudança** e **salvamentos consecutivos**. O autosync está reagindo à revisão do editor, não a tempo/zoom/navegação isolados.

Próxima ação crítica: fechar o editor/visualização de forma normal, reabrir o mesmo PDF descartável e confirmar que as alterações persistiram no documento carregado do Drive. Não fazer nova edição antes dessa conferência.

## Fechar/reabrir e persistência aprovados — 18/09/2026

O operador fechou normalmente o editor/visualização e reabriu o mesmo PDF descartável após dois autosyncs consecutivos. As duas alterações permaneceram exatamente no estado salvo anteriormente.

Resultado: aprovada a evidência real de **persistência após fechamento e reabertura**, confirmando que o estado exibido como sincronizado foi recuperado novamente do Drive e não era apenas estado local da sessão.

Próxima ação crítica: provocar um conflito externo controlado usando duas sessões/abas do mesmo PDF descartável. Uma aba deve manter uma referência antiga enquanto a outra cria e confirma uma nova revisão; a primeira então tenta salvar uma alteração e deve receber conflito sem sobrescrever a revisão mais recente.

## Conflito externo real aprovado — 18/09/2026

O operador executou o conflito controlado com duas abas do mesmo PDF descartável. Uma aba criou e confirmou uma nova revisão no Drive; a outra permaneceu com referência anterior e, ao tentar autosync depois de nova edição local, recebeu a mensagem:

`Conflito detectado: o arquivo foi alterado no Google Drive. Reabra o documento antes de substituir o original.`

Resultado: aprovado o critério real de **detecção de conflito externo antes de sobrescrita silenciosa**. A aba com baseline antiga não declarou sucesso e exigiu reabertura do documento.

Próxima verificação mínima: confirmar em uma sessão atualizada que a alteração salva pela aba que venceu o conflito permaneceu no Drive. A aba em conflito não deve ser forçada a sincronizar novamente.

## Revisão vencedora confirmada após conflito — 18/09/2026

Após o conflito externo real, o operador fechou/reabriu a sessão que havia criado a revisão vencedora e confirmou que a alteração salva por essa sessão permaneceu no Drive.

Resultado: aprovada a evidência de que o conflito bloqueou a aba com baseline antiga **sem desfazer nem sobrescrever** a revisão mais recente. O caminho crítico funcional da 4D está concluído.

Próxima ação: encerrar imediatamente a janela V4 pelo procedimento fail-closed, revogando primeiro o controle D1 e depois recolocando o alias em gate `false`, com bloqueio HTTP final confirmado.

## Encerramento da nova janela 4D e aceite da Fase 4 — 18/09/2026

O procedimento V4 de encerramento foi executado depois da matriz real. Resultado sanitizado:

- controle `phase4d_d28ac0d37fe3409f8751fac02007e777` revogado (`controlEnabled=false`);
- preview final bloqueado `1864a072-a76a-4a7d-8709-23c5b9045b73`;
- `DOCUMENTS_DRIVE_WRITE_ENABLED=false` confirmado;
- release `1d4decd03e0047a1bad678d60cee36ba6822d5b5`;
- bloqueio HTTP final confirmado (`httpBlocked=true`).

A matriz real desta janela aprovou o caminho crítico de substituição segura:

- login/listagem/leitura com gate false;
- primeiro autosync real com confirmação visual após resposta do Drive;
- ausência de reenvio sem alteração;
- segundo autosync consecutivo;
- persistência depois de fechar/reabrir;
- conflito externo real entre duas abas, sem sobrescrita silenciosa;
- revisão vencedora preservada após reabertura;
- encerramento fail-closed com revogação D1, gate false e bloqueio HTTP.

Observabilidade: a instrumentação permanece restrita a `drive_sync_started`, `drive_sync_completed` e `drive_sync_failed`, com propriedades técnicas allowlisted. A homologação real anterior já comprovou recepção desses três eventos no PostHog (2 started, 1 completed e 1 failed) sem campos clínicos/documentais sensíveis; a nova janela também exercitou sucesso e conflito real. Não foi feita nova consulta ao PostHog nesta sessão porque o conector disponível não corresponde ao projeto do Portal.

Limitação aceita e registrada: `save_copy` permanece validado sinteticamente e bloqueado pelo wrapper restrito da 4D; o caminho real homologado foi `replace_pdf`. Isso não reduz as proteções do fluxo de substituição publicado. A latência percebida entre `syncing` e `success` ficou maior que no Lumin e foi explicitamente adiada para a Fase 7; não será mascarada por sucesso otimista.

**Decisão de aceite:** a Fase 4 é considerada concluída para publicação do fluxo atual da Central de Documentos. O PR #201 pode sair de draft, ser mesclado e publicado. Após confirmar produção, a próxima fase do Guia Mestre é a **Fase 5 — IA documental**, que deve começar como frente separada, sem reabrir a Fase 4 por pendências de hardening não bloqueantes.

## Ajuste final de configuração produtiva — 18/09/2026

Após o merge do PR #201, foi identificado que `worker/wrangler.toml` ainda carregava dois resíduos temporários da homologação 4D: a origem Pages de staging em `ALLOWED_ORIGINS` e `DOCUMENTS_HOMOLOGATION_ORIGIN` apontando para o preview. Como `keep_vars=true` preserva variáveis omitidas, apenas remover a chave poderia deixar o valor antigo no Worker.

Correção preparada em branch separada `fix/central-docs-production-phase4-release`:

- `ALLOWED_ORIGINS` volta a conter somente os domínios oficiais;
- `DOCUMENTS_DRIVE_WRITE_ENABLED="true"` passa a ativar a sincronização da Fase 4 em produção;
- `DOCUMENTS_HOMOLOGATION_ORIGIN=""` neutraliza explicitamente a origem de preview mesmo com `keep_vars=true`;
- teste `documents-production-config.test.mjs` impede regressão dessa configuração.

Esse ajuste não muda código de edição nem permissões; apenas conclui a configuração de release produtiva já aprovada pela homologação 4D. Próxima ação: validar CI, mesclar o PR de configuração e confirmar novo deployment do Worker e publicação do site.

## Publicação produtiva da Fase 4 confirmada — 18/09/2026

PR #201 foi mesclado em `98d1a073d5c131c61b8d045e822ec650098178d1`, incorporando a Fase 4 à `main`. Em seguida, o ajuste final de release produtiva foi concluído no PR #209, merge `8f49c12e35e09def3ff1fe34eaeae6dd2ac05096`.

Evidências de publicação do merge final:

- Cloudflare Worker build **success**, check `Workers Builds: yellow-wave-d0a1guia-regulacao-ia`, versão produtiva `a08c7135-76cd-4f0d-a376-a9e495f031a6`;
- GitHub Pages build/deploy **success**, run `35319720667`; build, report e deploy concluídos;
- Cloudflare Pages staging **success** no mesmo commit, preview `74b9cffd.portal-regulacao-central-staging.pages.dev`;
- validação Fases 1–4 em `main`: run `35319722008`, sucesso;
- governança Central: run `35319722072`, sucesso.

Configuração produtiva final do Worker:

- `DOCUMENTS_DRIVE_WRITE_ENABLED=true`;
- `ALLOWED_ORIGINS` contém somente os domínios oficiais do Portal;
- `DOCUMENTS_HOMOLOGATION_ORIGIN=""`, neutralizando explicitamente o preview apesar de `keep_vars=true`;
- nenhum segredo foi adicionado ao repositório.

Conclusão: **Fase 4 publicada em produção**. A Central de Documentos pode ser usada com sincronização segura no fluxo `replace_pdf`. `save_copy` permanece coberto por testes sintéticos e deve ser tratado como limitação conhecida até uma homologação real própria. A latência percebida maior que no Lumin permanece adiada para a Fase 7.

Próxima fase pelo Guia Mestre: **Fase 5 — IA documental**, em branch/PR separados. Não reabrir a Fase 4 por hardening não bloqueante.

## Fase 5 iniciada — IA documental — 18/09/2026

A Fase 4 permanece encerrada e publicada. Antes de abrir esta frente, o ajuste transversal da abertura pós-login foi finalizado: PR #213 passou nos checks e foi mesclado em `87b88c0e7e37df1c56a25933f2f27aad2795e35c`. A branch da Fase 5 foi criada diretamente desse `main`.

Branch atual: `feat/central-docs-phase5-document-ai`.

Subfase inicial: **5A — fundação segura**. Documento de escopo: `docs/CENTRAL-DOCUMENTOS-FASE-5.md`.

Decisões de arquitetura recuperadas e confirmadas:

- não reutilizar nem enfraquecer `worker/gemini-assistant.js`, que continua reservado à pré-regulação anonimizada;
- IA documental terá módulo backend próprio e usará a capability documental `extract`, já existente;
- rotinas restritivas trabalham por página isolada, com proveniência obrigatória;
- prompts serão artefatos independentes e versionados;
- saída institucional será estruturada antes da formatação visual;
- conteúdo documental/PII não entra no PostHog, D1, cache estático ou logs técnicos;
- 5A não habilita processamento real de PDFs clínicos; primeiro serão construídos contratos, feature gate, painel lateral e testes sintéticos.

Limitações remanescentes da Fase 4 continuam registradas, mas não reabrem a fase: `save_copy` sem homologação real própria e latência de sync reservada para Fase 7.

Próxima ação exata: implementar a fundação 5A em código e testes, mantendo a IA documental desabilitada por padrão até existir homologação sintética e configuração explícita.

## Fase 5A — fundação segura concluída — 18/09/2026

A subfase 5A foi implementada sem habilitar processamento real de documentos clínicos. O escopo concluído inclui:

- módulo backend próprio `worker/document-ai.js`, separado da pré-regulação anonimizada;
- prompts independentes/versionados em `worker/document-ai-prompts.js`;
- endpoint `/api/documents/ai/config` protegido pela capability `extract`;
- feature gates produtivos `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`;
- hard lock interno `DOCUMENT_AI_RUNTIME_READY=false`, impedindo processamento mesmo se as flags forem ligadas por engano nesta versão;
- painel lateral da IA no visualizador, oculto enquanto o gate estiver desligado e sem envio de conteúdo;
- contratos estruturados de página, classificação e estados `encontrado`, `nao_consta` e `ilegivel`;
- allowlist de telemetria técnica que descarta nome de arquivo, IDs, paciente, CPF/CNS e conteúdo;
- suíte e CI atualizados sem criar workflow duplicado.

Validação:

- run `35325260057`: **298/298 testes**, zero falhas/skips;
- staging bundle `35325260581`: sucesso;
- governança `35325260069`: sucesso;
- site `35325260628`: sucesso;
- navegador/PDF.js no frontend equivalente anterior à trava backend final: run `35324925407`, sucesso. O commit final de hardening alterou somente `worker/document-ai.js` e seu teste, sem tocar HTML/CSS/JS.

A primeira execução de CI da 5A encontrou apenas contratos antigos de cache-buster do HTML; os testes foram alinhados ao novo `20260918-1`. Não houve falha funcional de IA, autorização ou privacidade.

**Decisão:** 5A aceita para merge. Nenhum PDF/imagem/texto foi enviado a provedor de IA. A próxima subfase é **5B — classificação isolada por página**, ainda fail-closed em produção até homologação própria.

## Fase 5B em implementação — classificação isolada por página — 18/09/2026

A Fase 5A foi mesclada na `main` pelo PR #215, merge `04c09c74236545d068116109809f5236646e622c`. A 5B foi aberta em branch própria `feat/central-docs-phase5b-page-classification` diretamente desse estado.

Implementação preparada nesta branch:

- PDF.js exporta somente a página ativa para um Blob efêmero JPEG/PNG, sem persistência;
- frontend envia ao backend somente o Blob da página + `X-Document-Page-Number`; nome do arquivo, ref/ID do Drive e demais páginas não acompanham a requisição;
- rota `POST /api/documents/ai/page/classify` exige capability `extract`, limita imagem a 3 MiB e continua bloqueada enquanto o gate produtivo estiver false;
- provider multimodal separado usa exclusivamente `PROMPT_CLASSIFICACAO_PAGINAS_V1`, exige JSON fechado e rejeita proveniência divergente;
- tipos permitidos: `comprovante_atendimento`, `pagina_medica_autorizada`, `outro`;
- UI 5B mostra classificação e página de origem, sem persistir resultado;
- produção permanece com `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`.

Nenhum PDF clínico ou imagem real foi enviado a provedor nesta etapa. Os testes do provider usam transporte simulado e payloads sintéticos.

Próxima ação: executar a suíte integrada/CI da 5B, corrigir regressões de contrato se houver e só então avaliar aceite sintético/merge. Habilitação real do provedor continua fora deste passo.

## Fase 5B — validação sintética concluída — 18/09/2026

A classificação isolada por página foi validada sem habilitar IA documental em produção e sem enviar documento clínico real ao provedor.

Evidências:

- run `35326613399`: **306/306 testes**, zero falhas/skips;
- provider mockado cobre gate false, uma única imagem, número técnico da página, rejeição de provenance mismatch, MIME/tamanho e sanitização de erro upstream;
- navegador/PDF.js no head funcional `819f3c7c…`: run `35326395619`, **75 passed / 3 skipped esperados**;
- staging bundle `35326613410`: sucesso;
- governança `35326613427`: sucesso;
- site `35326613393`: sucesso;
- commits posteriores ao head funcional alteraram somente contratos de teste, sem mudar runtime/frontend.

Primeiras falhas da suíte 5B eram exclusivamente contratos de teste ainda apontando para cache-busters antigos e para o nome direto `exportPageImage`; foram corrigidas sem mudança funcional.

**Decisão:** 5B aceita para merge sintético. Produção permanece com `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`; portanto o merge não habilita processamento de documento real. Próxima subfase: **5C — extração restritiva por página**.

## Fase 5C — extração restritiva implementada — 18/09/2026

A 5B já está integrada à `main` pelo merge `f1a5f22c10584ae8ce970ddde6dd42be4f43c441` (PR #216). A branch `feat/central-docs-phase5c-restricted-extraction` foi criada dessa base e o PR #217 está aberto em draft para validação sintética.

Implementação 5C concluída em código, mantendo produção fail-closed:

- `DOCUMENT_AI_PHASE=5C`, `phase5c-v1`;
- extração somente para `comprovante_atendimento` e `pagina_medica_autorizada`;
- schemas fechados de 8 campos por tipo;
- estados `encontrado`, `nao_consta`, `ilegivel` normalizados no backend;
- campos extras, ausentes, página divergente e tipo divergente são rejeitados;
- pipeline reclassifica a mesma página antes de extrair;
- provider recebe uma única imagem da página por chamada e nenhum nome/ref/ID do arquivo;
- UI permite copiar campo, copiar bloco e `Ver origem`, sem persistência;
- gates produtivos continuam `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`.

A primeira execução do workflow da Central encontrou somente contratos antigos de cache-buster em `documents-ui.test.mjs`: a página já usava `documents.css/js?v=20260918-3`, mas cinco testes ainda exigiam `20260918-2`. A implementação 5C propriamente dita passou nos testes específicos. O contrato foi alinhado ao asset real e o workflow foi renomeado para `Fases 1–5C`.

Próxima ação: aguardar o rerun do PR #217; se Worker, navegador, staging, governança e site permanecerem verdes, registrar o aceite sintético da 5C, retirar draft e mesclar. Depois iniciar 5D em branch separada, mantendo IA real desligada.

## Aceite sintético da Fase 5C — 18/09/2026

PR #217 validado após correção exclusiva de contratos antigos de cache-buster.

Evidências:

- suíte integrada da Central: **314/314**, zero falhas e zero skips;
- navegador/PDF.js real: **75 passed / 3 skipped esperados**;
- bundle de staging: sucesso;
- governança: sucesso;
- site: sucesso;
- gates produtivos da IA documental continuam `false/false`;
- nenhum documento clínico real foi enviado ao provedor.

Critérios 5C aceitos sinteticamente: schema restrito por tipo, estados `encontrado/nao_consta/ilegivel`, proveniência por página, reclassificação antes da extração, bloqueio de tipo `outro`, rejeição de campos extras/ausentes, copiar campo/bloco e `Ver origem`, sem persistência.

Decisão: 5C pode ser integrada. Próxima subfase: **5D — perguntas sobre o documento**, em branch separada e ainda fail-closed em produção.

## Fase 5D — perguntas documentais implementadas — 18/09/2026

A Fase 5C foi integrada à `main` pelo PR #217, merge `06db4b2e473603a460c815a55c9859dad6088ccc`. A 5D foi aberta em branch separada `feat/central-docs-phase5d-document-chat`.

Decisão arquitetural: o chat documental **não recebe o PDF inteiro nem imagens novas**. Ele recebe somente evidências estruturadas, já extraídas pela 5C e mantidas em memória da sessão. Isso preserva proveniência e impede que uma resposta livre altere os resultados institucionais.

Implementado:

- `DOCUMENT_AI_PHASE=5D`, `phase5d-v1`, `documentChat=true`;
- normalização estrita de pergunta, evidências e resposta;
- no máximo 12 páginas de evidência por consulta;
- rejeição de página duplicada e citação fora do conjunto fornecido;
- respostas comuns exigem citação `[p. N]`; `NÃO CONSTA`/`ILEGÍVEL` são terminais;
- provider usa `PROMPT_DOCUMENT_CHAT_V1` e envia somente pergunta + JSON estruturado paginado;
- rota `POST /api/documents/ai/chat` exige capability `extract` e feature gates ativos;
- frontend mantém `documentAiEvidence` e `documentAiChatHistory` apenas em memória;
- ao fechar/trocar o PDF, evidências e conversa são descartadas;
- respostas do chat não escrevem em `documentAiExtraction` nem `documentAiClassification`;
- UI permite navegar pelas páginas citadas;
- gates produtivos da IA continuam `false/false`.

Próxima ação: abrir PR da 5D e executar a validação sintética completa. Se verde, registrar aceite e integrar; depois preparar a 5E controlada sem ativar produção automaticamente.

## Aceite sintético da Fase 5D — 18/09/2026

A branch 5D foi reconciliada com a `main` `e990e768fdbf26c88225eace66e923c949cc0fac` por merge de dois pais em `f99a93c54bb3075c6d69eaf833265e441666d3d6`. A comparação desde a base mostrou **83 commits posteriores na main e nenhum arquivo sobreposto** aos 14 arquivos alterados pela 5D; portanto foram preservadas integralmente as correções recentes de Agenda/Worker e o escopo documental.

Validação do head reconciliado:

- suíte integrada Central: **320/320**, zero falhas;
- navegador/PDF.js real: **75 passed / 3 skipped esperados**;
- bundle de staging: sucesso;
- governança Central: sucesso;
- site: sucesso.

Critérios 5D aceitos: chat usa somente evidências estruturadas paginadas da sessão; não envia nova imagem/arquivo/ref/ID do Drive; respostas comuns exigem correspondência exata entre lista de páginas e citações `[p. N]`; `NÃO CONSTA` e `ILEGÍVEL` são terminais; histórico é efêmero; resposta livre não altera classificação nem extração institucional.

Produção permanece fail-closed: `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`. Nenhum documento real foi enviado ao provedor.

Decisão: **5D pode ser integrada**. Próxima subfase: **5E — homologação real controlada**, que deve ser preparada sem ativar o provedor até existir confirmação humana.

## Preparo técnico da Fase 5E implementado — 18/09/2026

A Fase 5D foi integrada pela PR #218 no merge `8fba51979aba95c31ec7ef6644949c8c508530f6`. Em seguida foi criada a branch `feat/central-docs-phase5e-controlled-homologation` diretamente dessa `main`.

Todo o trabalho realizado nesta etapa permanece **sintético e fail-closed**: nenhum PDF clínico, imagem de paciente ou conteúdo real foi enviado a provedor de IA; não houve mudança de D1, Cloudflare preview, secret, Google Drive ou gates de produção.

Artefatos 5E já preparados:

- `worker/homologation-5e.js`: entrypoint exclusivo de preview, não importado por produção;
- allowlist de rotas limitada a auth + config/classificação/extração/chat documental;
- origem Pages e origem Worker exatas, conta/capability `extract` e controle D1 temporário obrigatórios;
- header adicional `X-Document-Ai-Homologation: phase5e-synthetic-v1` para qualquer chamada de IA;
- escrita do Drive obrigatoriamente `false` durante a janela;
- controle D1 revalidado imediatamente antes do provider;
- laboratório `/homologacao-5e/` com token e alias apenas em memória;
- fixtures sintéticos: comprovante, duas páginas médicas conflitantes, página `outro` com prompt injection, campo ausente e CID propositalmente ilegível;
- chat da matriz recebe somente evidências estruturadas extraídas, sem reenviar imagens;
- `scripts/central-docs/preparar-homologacao-5e.mjs`: baixa runtime por commit fixo, valida git blobs, reconfirma produção, inspeciona bindings/secrets por nome/tipo, faz dry-run e cria somente Worker Version preview;
- `scripts/central-docs/encerrar-homologacao-5e.mjs`: revoga D1 primeiro, volta gates do alias a `false`, confirma produção intacta e HTTP 403;
- workflows/testes próprios para wrapper, harness, preparo, encerramento e bundle staging.

Decisão operacional: o Pages da 5E não precisa ser reconstruído com o endpoint Worker embutido. O laboratório pode receber **somente o alias oficial 5E** em um campo efêmero, validado no navegador e nunca persistido. Isso permite usar o preview Pages normal do PR e elimina dependência de um deploy Pages especial com variável dinâmica.

Bloqueio deliberado restante: a existência de `GEMINI_API_KEY` na baseline produtiva é desconhecida e não deve ser inferida. O procedimento 5E verifica somente metadata de binding; se a chave estiver ausente, para com `INTERVENCAO_NECESSARIA_GEMINI_API_KEY_AUSENTE` antes de upload/ativação. Se estiver presente, ainda exige a frase humana `PREPARAR HOMOLOGACAO 5E`.

Próxima ação exata: abrir PR do preparo 5E, executar os checks e corrigir regressões. Se verde, integrar **somente o preparo**. Parar antes de executar o script real/ativar preview, pois esse é o próximo ponto que exige o operador.

## Preparo 5E integrado e bloqueio externo confirmado — 18/09/2026

O PR #237 foi validado e mesclado em `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`. Ele integra **somente o preparo técnico fail-closed** da homologação 5E; nenhuma chamada real ao provedor foi executada e os gates produtivos continuam desligados.

Evidências pós-merge:

- suíte Central em `main`: **348/348**, zero falhas;
- procedimentos operacionais 5E: **9/9 wrapper + 8/8 preparo + 2/2 encerramento + 4/4 harness**, zero falhas;
- navegador/PDF.js, staging, governança, site e checks transversais: sucesso;
- Cloudflare Workers Build: sucesso, versão produtiva `342a4a84-2b45-416e-b63c-0ce0bad2be85`;
- Cloudflare Pages staging do commit homologável: `https://67dd934e.portal-regulacao-central-staging.pages.dev`;
- source ref congelado para a 5E: `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`.

Bloqueio externo agora confirmado: `docs/AGENDA-DIGSAUDE-STATUS.md` registra que a baseline produtiva atual **não expõe `GEMINI_API_KEY` como binding**. Portanto o procedimento 5E interromperá antes de upload/ativação com `INTERVENCAO_NECESSARIA_GEMINI_API_KEY_AUSENTE` até que o operador configure esse secret na Cloudflare. Isso é deliberado; não contornar nem migrar silenciosamente a 5E para outro provedor.

Próxima ação humana exata: configurar `GEMINI_API_KEY` como secret do Worker institucional. Depois executar o preparo 5E usando o source ref e a origem Pages congelados acima. O script ainda exigirá a frase humana `PREPARAR HOMOLOGACAO 5E` antes de criar/ativar a janela.

## Prontidão operacional 5E adiantada — 18/09/2026

Enquanto o bloqueio externo `GEMINI_API_KEY` permanece pendente, foi adiantado tudo que não exige valor de secret ou ação manual na Cloudflare.

Nova branch operacional: `chore/central-docs-phase5e-operator-readiness`.

Adicionado verificador somente leitura `scripts/central-docs/verificar-precondicoes-5e.mjs` que reconfirma a versão produtiva, presença nominal de secrets, capability `extract`, ausência de outra janela controlada e as referências congeladas da 5E. Ele não contém INSERT/UPDATE, upload de Worker, alteração de alias ou deployment.

Adicionado atalho `scripts/central-docs/iniciar-homologacao-5e.mjs`: primeiro executa o verificador; somente se tudo estiver verde chama o preparo 5E com source ref `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0` e Pages origin `https://67dd934e.portal-regulacao-central-staging.pages.dev`. A confirmação humana `PREPARAR HOMOLOGACAO 5E` continua obrigatória antes da criação do controle.

Foram adicionados testes específicos para provar que o verificador é read-only, que o atalho verifica antes de preparar e que nenhum valor de secret pode aparecer nesses artefatos. O workflow operacional 5E foi estendido para executá-los.

Produção continua com IA documental desligada; nenhuma chamada real ao Gemini, alteração D1, upload de preview ou escrita no Drive ocorreu nesta etapa.

## Descoberta técnica — Worker Preview não disponível no build de main — 18/09/2026

Após o merge do PR #239, o check `Workers Builds: yellow-wave-d0a1guia-regulacao-ia` falhou antes de concluir novo deploy com a mensagem: `Preview creation failed: You do not have access to use Worker Previews. Please ensure it is enabled.`

Impacto observado: o merge de prontidão operacional foi incorporado ao GitHub e o Pages staging publicou normalmente, mas o Workers Build desse commit não reportou nova versão produtiva concluída. O último deployment de Worker confirmado com sucesso antes dessa falha permanece o anterior; não inferir promoção a partir do commit do GitHub.

Causa arquitetural identificada: o gate produtivo usa `wrangler versions upload` para criar uma candidata sem tráfego. Sem configuração explícita, essa operação tenta participar do mecanismo de Preview URLs do Worker. O gate não precisa de URL de preview para validar bindings/secrets/D1 nem para promover a candidata.

Correção preparada em branch `fix/worker-preview-opt-in-phase5e`:

- produção declara `preview_urls = false` em `worker/wrangler.toml`;
- o gate produtivo continua usando versões desacopladas, mas sem depender de URL de preview;
- somente a homologação 5E declara `preview_urls: true` na configuração efêmera, pois ela realmente precisa do alias `central-docs-phase5e`;
- testes e workflows passam a proteger essa separação.

Essa correção não ativa a IA documental, não adiciona secret, não altera D1 e não escreve no Drive. A homologação 5E continua bloqueada por `GEMINI_API_KEY` ausente e, se Preview URLs também estiverem indisponíveis no momento da 5E, o preparo deve falhar fechado antes de qualquer uso real.

## Prontidão final da Fase 5E — 18/09/2026

O preparo operacional foi consolidado sem ativar IA documental em produção.

- PR **#239** mesclado: verificador somente leitura + atalho seguro para preparar a 5E;
- PR **#241** mesclado: produção passou a usar `preview_urls=false`, enquanto a homologação 5E faz opt-in explícito com `preview_urls=true`;
- após #241, o Workers Build voltou a concluir com sucesso, versão produtiva confirmada `c94de153-8de7-4784-a909-15d207b1209a`;
- PR **#240** mesclado: laboratório 5E ganhou `Copiar resumo seguro`, que omite respostas/evidências e expõe somente resultado técnico dos casos;
- source ref 5E permanece `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`, pois não houve mudança no runtime da IA/wrapper desde esse congelamento;
- origem Pages final congelada para a matriz: `https://67dd934e.portal-regulacao-central-staging.pages.dev`;
- produção continua com `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`.

A falha anterior `Preview creation failed` ficou restrita ao pipeline que ainda dependia implicitamente de Preview URLs; a produção foi desacoplada dessa exigência e voltou a publicar normalmente. Para a 5E, Preview URL continua requisito deliberado do ambiente controlado.

Bloqueio externo remanescente: `GEMINI_API_KEY` ainda precisa ser configurada como secret do Worker. Depois disso, executar primeiro `verificar-precondicoes-5e.mjs --verificar`; somente com `PRECONDICOES_5E_OK` usar `iniciar-homologacao-5e.mjs --iniciar`.

Nenhuma chamada real ao Gemini, alteração D1, janela 5E ativa ou escrita no Drive foi executada neste preparo.

## Handoff operacional 5E pronto — 18/09/2026

PR **#242** foi mesclado no commit `bb84ec75f12816e3f085d54e3b807ee5e608b9bd`, consolidando a prontidão final da homologação 5E.

Estado final antes da intervenção do operador:

- source ref da IA/wrapper congelado: `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`;
- Pages origin congelada: `https://67dd934e.portal-regulacao-central-staging.pages.dev`;
- Worker produtivo voltou a publicar com sucesso após #241; versão confirmada `c94de153-8de7-4784-a909-15d207b1209a`;
- produção permanece com IA documental `false/false`;
- 5E não possui janela ativa, controle D1 novo ou chamada real ao Gemini;
- verificador read-only, atalho de início, encerramento fail-closed e resumo seguro da matriz estão integrados e testados.

**Intervenção externa remanescente:** configurar `GEMINI_API_KEY` como secret do Worker na Cloudflare, sem compartilhar o valor no chat. Depois disso, executar o verificador read-only; somente com `PRECONDICOES_5E_OK` iniciar a janela 5E.

Não criar nova branch funcional antes desse passo: a próxima ação real é operacional, não desenvolvimento adicional.

## Endurecimento do aceite real 5E — PR #244 — 18/09/2026

Antes da primeira chamada real ao provedor foi encontrada uma lacuna de **cobertura da própria homologação**, não do backend: o harness 5E comparava apenas campos-amostra em páginas autorizadas, embora o critério da Fase 5 exija literalidade dos campos e ausência de mistura entre páginas.

A branch `chore/central-docs-phase5e-acceptance-tightening` corrige isso sem tocar produção, D1, Drive ou secrets:

- comprovante completo passa a validar os 8 campos do schema;
- páginas médicas A e B passam a validar os 8 campos de cada página, tornando a detecção de mistura integral;
- página com código ausente valida os outros 7 campos literalmente e exige `nao_consta` no código;
- página com CID borrado valida os outros 7 campos literalmente e exige `ilegivel` no CID;
- teste de contrato garante que a matriz real não volte a aceitar apenas campos-amostra;
- documentação da 5E explicita essa regra de aceite integral.

**Implicação operacional resolvida:** o Cloudflare Pages publicou com sucesso o commit `003da4d` na origem imutável `https://764243d1.portal-regulacao-central-staging.pages.dev`, já contendo a matriz reforçada. Essa origem foi congelada no verificador/atalho 5E e substitui `67dd934e...` para a execução real. A origem antiga permanece apenas como evidência histórica e não deve ser usada na homologação final.

## PR #244 integrada — Fase 5E pronta para intervenção externa — 18/09/2026

A PR **#244** foi mesclada na `main` pelo commit `e4fbda06e67752dafdd50b5746655ad3908f86d3`. O endurecimento da matriz 5E está agora integrado: cada página autorizada valida os **oito campos** do schema, inclusive os casos especiais `nao_consta` e `ilegivel`.

Evidências direcionadas da PR #244 antes do merge:
- Procedimentos operacionais 5E: run `35413947781`, **success**;
- Fases 1–5E (preparo): run `35413947712`, **success**;
- bundle de staging: run `35413947796`, **success**;
- governança: run `35413947803`, **success**;
- Cloudflare Pages: **success**, com deployment imutável reforçado `https://764243d1.portal-regulacao-central-staging.pages.dev`.

O check **Workers Builds** da branch da PR falhou apenas ao tentar criar Worker Preview, recurso indisponível naquele contexto. Isso não foi tratado como falha de produção. Após o merge, o build produtivo concluiu com **success**, versão `ac1d3d5e-b75c-4220-95d4-68028edd43c2`. O Cloudflare Pages da `main` também concluiu com sucesso no deployment `https://67d26d3e.portal-regulacao-central-staging.pages.dev`.

A origem 5E deliberadamente congelada continua sendo `764243d1...`: ela é imutável, contém a matriz reforçada e já está fixada no verificador/atalho. O deployment posterior da `main` serve como confirmação adicional do merge, não como nova origem obrigatória.

**Estado agora:** não existe mais trabalho funcional de GitHub que bloqueie a homologação real. Produção continua com IA documental desligada, nenhuma janela 5E foi aberta, nenhum segredo foi alterado e nenhuma chamada real ao Gemini foi executada.

**Próxima intervenção humana única:** configurar `GEMINI_API_KEY` como secret do Worker na Cloudflare, sem compartilhar o valor. Em seguida, executar o verificador somente leitura e somente avançar se retornar `PRECONDICOES_5E_OK`.

## GEMINI_API_KEY configurada no Worker — 18/09/2026

O operador confirmou visualmente no painel Cloudflare do Worker `yellow-wave-d0a1guia-regulacao-ia` que existe uma entrada:

- tipo: `Secret`;
- nome: `GEMINI_API_KEY`;
- valor: oculto pelo Cloudflare (`Value encrypted`).

Nenhum valor da chave foi compartilhado no chat ou versionado no GitHub. Esta confirmação resolve o bloqueio externo registrado para a Fase 5E.

**Próxima ação exata:** executar `scripts/central-docs/verificar-precondicoes-5e.mjs --verificar`, que é somente leitura. Somente se retornar `PRECONDICOES_5E_OK` iniciar a homologação controlada 5E.

## Verificador 5E bloqueado por capability extract — 18/09/2026

O operador executou o verificador somente leitura da Fase 5E após configurar `GEMINI_API_KEY` como Secret no Worker. Resultado sanitizado:

`PRECONDICOES_5E_BLOQUEADAS=INTERVENCAO_NECESSARIA_CAPABILITY_EXTRACT_AUSENTE`

Interpretação objetiva:
- a presença nominal de `GEMINI_API_KEY` já foi superada pelo verificador; caso estivesse ausente, o código teria parado antes com `INTERVENCAO_NECESSARIA_GEMINI_API_KEY_AUSENTE`;
- o bloqueio ocorreu ao validar a conta autorizada herdada do controle 4D no D1;
- para a 5E, essa conta precisa estar ativa e possuir simultaneamente `view=true` e `extract=true`;
- nenhuma janela 5E foi criada, nenhum controle novo foi ativado, nenhum upload de Worker foi feito e nenhuma chamada real ao Gemini ocorreu.

**Próxima ação humana:** no Portal, em **Usuários e acessos**, editar a mesma conta usada na Central/homologação e manter **Regulador(a)** habilitado; ativar **Permitir IA documental — classificação, extração e perguntas com proveniência por página**. Preservar as demais permissões existentes. Depois repetir somente o verificador read-only.

## Capability extract ainda ausente após ajuste visual — diagnóstico preparado — 18/09/2026

Após a intervenção no painel de **Usuários e acessos**, o operador repetiu somente o verificador read-only e o resultado permaneceu:

`PRECONDICOES_5E_BLOQUEADAS=INTERVENCAO_NECESSARIA_CAPABILITY_EXTRACT_AUSENTE`

Isso prova apenas que a conta referenciada pelo controle-template 4D ainda não satisfaz simultaneamente `active=1`, `can_view=1` e `can_extract=1`. Não é seguro presumir que a conta editada manualmente é exatamente a mesma conta usada pelo template.

Foi preparado `scripts/central-docs/diagnosticar-capability-5e.mjs`, somente leitura, que não imprime username e retorna apenas booleanos técnicos:
- existência/atividade da conta referenciada;
- existência da linha fina de acesso documental;
- função adicional Regulador(a);
- `canView`;
- `canExtract`;
- existência de outra janela controlada ativa.

O diagnóstico não contém INSERT/UPDATE/DELETE, não altera D1, não lê valor de secret, não faz upload/deploy e não inicia a 5E.

**Próxima ação exata:** executar esse diagnóstico no mesmo Windows autenticado e usar os booleanos retornados para determinar qual ajuste humano ainda falta. Não repetir alterações às cegas em permissões.

## Diagnóstico confirmou único bloqueio: canExtract=false — 18/09/2026

O diagnóstico booleano da Fase 5E retornou:

- userExists=true;
- userActive=true;
- accessRow=true;
- regulatorRole=true;
- canView=true;
- canExtract=false;
- activeControlledWindow=false.

Conclusão: a conta referenciada pelo controle-template é a conta válida e ativa da Central, possui Regulador(a) e leitura, e não há outra janela ativa. O **único** estado faltante é `can_extract=1`.

Como a tentativa pela interface não persistiu a capability, foi preparado um habilitador estreito e auditável: `scripts/central-docs/habilitar-extract-5e.mjs`. Ele:
- revalida todas as pré-condições;
- exige confirmação humana explícita `HABILITAR EXTRACT 5E`;
- altera somente `can_extract` de 0 para 1 na mesma conta já autorizada pelo template;
- não imprime username;
- não altera role, Regulador(a), view, edit, manage, secrets, Worker, Drive ou produção;
- revalida o estado após a mudança.

**Próxima ação exata:** executar o habilitador controlado; somente depois repetir o verificador read-only da 5E.

## Capability extract habilitada e pré-condições 5E aprovadas — 18/09/2026

O operador executou o habilitador estreito integrado no PR #249. O procedimento revalidou a mesma conta já autorizada e, após confirmação humana explícita, alterou somente `can_extract` de 0 para 1.

Resultado sanitizado:

- `CAPABILITY_EXTRACT_5E_HABILITADA`;
- `userActive=true`;
- `regulatorRole=true`;
- `canView=true`;
- `canExtract=true`;
- `activeControlledWindow=false`.

Em seguida, o operador repetiu o verificador somente leitura da Fase 5E. Resultado:

- `PRECONDICOES_5E_OK`;
- produção ativa observada: `604cde0b-e4f9-444a-8486-3ede9417baa7`;
- `geminiSecretPresent=true`;
- `extractCapability=true`;
- `activeControlledWindow=false`;
- source ref: `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`;
- Pages origin congelada: `https://764243d1.portal-regulacao-central-staging.pages.dev`.

Nenhuma janela 5E foi criada ainda, nenhum controle novo foi ativado, nenhum PDF/Drive foi tocado e nenhuma chamada documental real ao Gemini ocorreu até este ponto.

**Próxima ação exata:** executar `scripts/central-docs/iniciar-homologacao-5e.mjs --iniciar`. O atalho repetirá a verificação read-only e, somente se continuar verde, chamará o preparo existente, que ainda exige a confirmação humana `PREPARAR HOMOLOGACAO 5E` antes de criar a janela temporária.

## Janela 5E preparada com sucesso — 18/09/2026

O operador executou `iniciar-homologacao-5e.mjs --iniciar`. O atalho repetiu as pré-condições read-only com sucesso e o preparo foi confirmado humanamente com `PREPARAR HOMOLOGACAO 5E`.

Resultado sanitizado:

- `HOMOLOGACAO_5E_PREPARADA`;
- preview version: `47d891d6-fb1a-4e59-a369-cc9defe56a9e`;
- control ID: `phase5e_b541f0a9505f44b3aa12dc57cf5766be`;
- expiração: `2026-09-19T05:00:50.000Z`;
- release: `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`;
- `aiGate=true`;
- `driveWriteGate=false`;
- produção reconfirmada durante o preparo: `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- próxima ação operacional: `ABRIR_LABORATORIO_5E`.

O preparo concluiu as oito etapas previstas: runtime fixo/blobs, produção e bindings, controle inicialmente desabilitado, dry-run, upload somente de versão preview, bloqueio pré-ativação, ativação temporária do controle e confirmação de autenticação obrigatória com produção intacta.

**Estado de segurança:** somente o preview 5E está com IA documental habilitada; `DOCUMENTS_DRIVE_WRITE_ENABLED=false`; produção não foi promovida; nenhuma operação de Drive faz parte da matriz. A partir deste ponto, a primeira chamada real ao Gemini ocorrerá somente no laboratório sintético controlado.

**Próxima ação exata:** abrir `https://764243d1.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, selecionar/confirmar o alias oficial do Worker preview 5E, autenticar com a conta autorizada e executar a matriz sintética. Ao final, copiar apenas o **resumo seguro** e depois encerrar a janela em modo fail-closed.

## Laboratório 5E abriu, mas login retornou Failed to fetch — 18/09/2026

O operador abriu corretamente a origem congelada `https://764243d1.portal-regulacao-central-staging.pages.dev/homologacao-5e/`. A página carregou e confirmou o alias oficial 5E em memória, porém o primeiro login exibiu **Failed to fetch** no navegador.

Esse erro não comprova senha inválida nem falha do Gemini. Como o navegador não recebeu uma resposta HTTP utilizável, a causa pode estar na conectividade/CORS/preview entre Pages e Worker. O preparo anterior havia conseguido alcançar o alias por Node com Origin autorizado, portanto é necessário distinguir problema do ambiente browser de problema do Worker sem alterar a janela.

Foi preparado `scripts/central-docs/diagnosticar-conectividade-browser-5e.mjs`, somente leitura. Ele usa a própria origem registrada no ledger local e executa:
- GET protegido em `/api/documents/ai/config` com Origin autorizado, esperando 401 + CORS + release;
- preflight OPTIONS de `/api/auth/login`, esperando POST/content-type autorizados;
- POST sintético com usuário deliberadamente inválido, que é rejeitado no wrapper antes da autenticação real.

O diagnóstico não usa credenciais reais, não lê username autorizado, não chama Gemini, não altera D1/Drive/Worker e não promove produção.

**Próxima ação exata:** executar o diagnóstico no mesmo Windows e usar somente os marcadores `getProtected`, `preflightLogin`, `postSynthetic`, `workerReachable`, `corsReady` e `releaseMatch` para decidir se o defeito é do preview/CORS ou específico do navegador.

## Causa do Failed to fetch confirmada: CSP do Pages bloqueava o alias 5E — 18/09/2026

O diagnóstico executado no mesmo Windows confirmou:

- `getProtected=OK`;
- `preflightLogin=OK`;
- `postSynthetic=OK`;
- `workerReachable=true`;
- `corsReady=true`;
- `releaseMatch=true`.

Portanto Worker preview, CORS e release estavam corretos fora do contexto da página. A inspeção do bundle congelado mostrou a causa específica: quando o Cloudflare Pages constrói o staging sem `CENTRAL_DOCS_AI_HOMOLOGATION_WORKER_URL`, o laboratório fica com `workerConfigured=false` e permite selecionar manualmente apenas o alias oficial em memória, porém a CSP de `/homologacao-5e/*` ainda usava `https://disabled.invalid` em `connect-src`. O navegador bloqueava o `fetch` antes da requisição chegar ao Worker, resultando em `Failed to fetch`.

Correção na branch `fix/central-docs-phase5e-csp-official-alias`:
- a CSP 5E passa a permitir **sempre e somente** o alias oficial hardcoded `central-docs-phase5e-...workers.dev`;
- `workerConfigured=false` continua significando que o usuário precisa selecionar o alias na UI; não há autoativação;
- nenhuma origem arbitrária é liberada;
- produção, D1, Drive, secrets e gates não são alterados;
- teste de staging passa a exigir o alias oficial em `connect-src` mesmo no build desarmado.

A janela 5E atualmente ativa ainda está vinculada à origem antiga `764243d1...`, cujo deploy é imutável e não pode receber a correção. Ela deve ser encerrada fail-closed e substituída por uma nova janela apontando para um novo preview Pages imutável com a CSP corrigida.

O Cloudflare Pages da PR #253 concluiu **success** para o commit `310d2f65454122780bd98d20413daad8b1b2942e`, gerando a origem imutável corrigida `https://915c3113.portal-regulacao-central-staging.pages.dev`. Essa origem foi congelada no verificador/atalho 5E e substitui `764243d1...` para a próxima janela. O bundle direcionado, procedimentos 5E, Fases 1–5E, governança e site ficaram verdes nesta branch.

## Primeira janela 5E encerrada fail-closed após correção CSP — 18/09/2026

O operador encerrou corretamente a primeira janela 5E, que ainda estava vinculada ao Pages antigo `764243d1...`. Resultado sanitizado:

- `JANELA_5E_ENCERRADA`;
- control ID: `phase5e_b541f0a9505f44b3aa12dc57cf5766be`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado: `ed1547cc-9fed-4aae-9554-40a654476ab8`;
- release: `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`;
- `httpBlocked=true`.

Isso fecha a janela antiga antes de qualquer nova abertura e evita controles concorrentes. Nenhuma chamada real ao Gemini foi concluída nessa primeira janela, porque o navegador era bloqueado pela CSP do Pages antigo antes do login.

A PR #253 já está mesclada na `main` (`028c2dd33160b792d905b5f54955a6e83b495369`). O verificador/atalho 5E agora está congelado para a origem corrigida `https://915c3113.portal-regulacao-central-staging.pages.dev`.

**Próxima ação exata:** repetir o verificador read-only e, se retornar `PRECONDICOES_5E_OK`, iniciar uma nova janela 5E. A nova janela deverá nascer já vinculada ao Pages `915c3113...`; depois abrir o laboratório corrigido e executar a matriz sintética.

## Segunda janela 5E preparada na origem Pages com CSP corrigida — 18/09/2026

O operador repetiu o verificador read-only já com a origem corrigida e obteve novamente `PRECONDICOES_5E_OK`.

Resultado sanitizado da nova preparação:

- Pages origin: `https://915c3113.portal-regulacao-central-staging.pages.dev`;
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version: `8d09f2b5-69f9-496c-9fb6-b823ff2f19ce`;
- control ID: `phase5e_bd4d3fe2717e45678fc71e88aaff18c1`;
- expiração: `2026-09-19T05:20:08.000Z`;
- release: `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`;
- `aiGate=true`;
- `driveWriteGate=false`;
- produção reconfirmada: `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A primeira janela permanece encerrada e não foi reutilizada. A segunda janela é a única janela 5E ativa e está vinculada ao Pages com CSP corrigida.

**Próxima ação exata:** abrir `https://915c3113.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz sintética e copiar somente o resumo seguro. Depois encerrar imediatamente a janela em modo fail-closed.

## Matriz 5E executada e correções Titon em desenvolvimento — 18/09/2026

A segunda janela 5E abriu corretamente na origem `915c3113...`, o login foi autorizado e o operador executou a matriz sintética. Os seis fixtures falharam antes de produzir evidência homologável, todos com:

`DOCUMENT_AI_PAGE_INVALID: Número de página inválido.`

Não houve escrita no Drive; `driveWriteGate=false` permaneceu preservado. O resultado não deve ser interpretado como falha de compreensão do Gemini, porque a execução não chegou a produzir classificação/extração válida para avaliação.

### Diagnóstico e correção técnica

O contrato antigo confiava no JSON do provider para repetir `pageNumber`/`pageType`, embora esses valores já sejam metadados autorizados pelo backend. A correção passa a ancorar a proveniência no backend:

- classificação usa o `pageNumber` recebido em `X-Document-Page-Number`;
- extração usa o `pageNumber` da rota e o `pageType` autorizado após classificação;
- resposta do modelo não pode deslocar a origem técnica da página;
- schemas fechados e campos obrigatórios continuam validados.

### UX aprovada do Titon

O usuário aprovou substituir a sequência manual classificar/extrair por **um único botão `Extrair dados do PDF`**. A separação por página permanece interna como barreira de segurança.

Implementado na branch `feat/titon-one-click-document-ai`:

- PDF.js expõe apenas a contagem de páginas e a exportação efêmera de uma página por vez;
- Titon percorre páginas sequencialmente e chama `/api/documents/ai/page/extract` por página;
- páginas `outro` são ignoradas; cada página autorizada gera bloco independente;
- comprovante reconhece `COMPROVANTE DE ATENDIMENTO`, `CONTROLE DE ATENDIMENTO` ou `DADOS`;
- páginas médicas reconhecem guia/encaminhamento, receita simples, laudo médico, receituário médico e solicitações definidas pelo operador;
- `NÃO CONSTA` e `ILEGÍVEL` permanecem estados obrigatórios;
- CNS é normalizado somente para sequência numérica sem espaços e data de nascimento somente para `dd/mm/aaaa` quando inequívoca;
- demais campos preservam literalidade;
- múltiplas páginas médicas aparecem separadas com número da página e `Ver página`;
- `Copiar dados` produz o modelo institucional completo;
- chat permanece secundário e recebe somente evidências estruturadas da extração concluída;
- qualquer erro inesperado durante a varredura descarta o resultado parcial, evitando apresentar documento incompleto como completo;
- produção continua com `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`.

### Janela atual

A segunda janela 5E `phase5e_bd4d3fe2717e45678fc71e88aaff18c1` permanece associada ao runtime antigo `408bff...`. **Ela não deve ser reutilizada para o reteste do código novo.** Antes de congelar/abrir nova janela, deve ser encerrada em modo fail-closed pelo procedimento oficial.

**Próxima ação técnica:** concluir testes/PR desta branch. Em seguida encerrar a janela 5E atual, mesclar a correção, congelar novo source ref e novo Pages imutável e somente então repetir a matriz real.

## PR #256 integrada e referências do reteste 5E congeladas — 18/09/2026

A PR **#256 — Titon: corrigir PAGE_INVALID e extrair PDF inteiro em um clique** foi mesclada na `main` pelo commit `39ded96a1ef1e2f707f8cf96ae33c96ee405c5d2`.

Entrega integrada:
- correção do `DOCUMENT_AI_PAGE_INVALID` ancorando `pageNumber`/`pageType` no backend;
- JSON solicitado ao provider não exige mais que o modelo ecoe os metadados técnicos da página;
- prompts v2 com títulos autorizados e regras literais aprovadas;
- CNS/data com apenas as normalizações explicitamente autorizadas;
- Titon com um único botão **Extrair dados do PDF**;
- varredura sequencial página a página, páginas `outro` ignoradas e blocos separados por origem;
- copiar bloco/todos os dados, `Ver página` e chat secundário;
- resultado parcial descartado em falha inesperada;
- nenhuma persistência de conteúdo documental e telemetria restrita à allowlist técnica.

Evidências da PR #256 antes do merge: Fases 1–5E, staging bundle, governança, site, procedimentos operacionais 5E e navegador/Chromium concluíram com **success**. O Cloudflare Pages do merge publicou com sucesso a origem imutável `https://56753b53.portal-regulacao-central-staging.pages.dev`.

O check automático **Workers Builds** do Cloudflare no merge `39ded96...` concluiu com **failure** e o resumo do GitHub não expôs causa suficiente para atribuir o erro. Não inferir causa. Isso fica como bloqueio separado para futura publicação produtiva; a produção não deve ter os gates da IA documental ativados até essa frente ser resolvida.

Para o **reteste preview-only 5E**, foram congelados:
- source ref: `39ded96a1ef1e2f707f8cf96ae33c96ee405c5d2`;
- Pages origin: `https://56753b53.portal-regulacao-central-staging.pages.dev`;
- Worker preview alias oficial permanece `central-docs-phase5e-...workers.dev`.

A janela antiga `phase5e_bd4d3fe2717e45678fc71e88aaff18c1`, que executou a matriz no runtime `408bff...`, **não deve ser reutilizada**. Deve ser encerrada fail-closed antes da abertura da nova janela.

**Próxima ação humana:** encerrar a janela 5E antiga com `encerrar-homologacao-5e.mjs --encerrar`. Depois disso, executar o verificador read-only já com as referências novas; somente com `PRECONDICOES_5E_OK` iniciar a nova janela e repetir a matriz.

## Janela 5E antiga encerrada e reteste corrigido preparado — 18/09/2026

O operador encerrou corretamente a janela 5E que havia executado a matriz no runtime antigo e, em seguida, abriu uma nova janela controlada já usando as referências congeladas da correção #256.

Encerramento da janela antiga:
- control ID: `phase5e_bd4d3fe2717e45678fc71e88aaff18c1`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado: `df900b9e-7fcf-462a-98e8-fb0bf8ad266d`;
- release histórico: `408bff833f9437b0c8c2f8ec1bf2ffb8926609b0`;
- `httpBlocked=true`.

Em seguida, o verificador read-only retornou `PRECONDICOES_5E_OK` com:
- `geminiSecretPresent=true`;
- `extractCapability=true`;
- `activeControlledWindow=false`;
- source ref corrigido: `39ded96a1ef1e2f707f8cf96ae33c96ee405c5d2`;
- Pages origin corrigida: `https://56753b53.portal-regulacao-central-staging.pages.dev`.

Nova janela preparada:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version: `c08c989a-4255-4b86-906c-b26da5dcab66`;
- control ID: `phase5e_502e857dd0424fbe92ea406048e7ad7f`;
- expiração: `2026-09-19T06:07:45.000Z`;
- release: `39ded96a1ef1e2f707f8cf96ae33c96ee405c5d2`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção reconfirmada durante o preparo: `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

**Próxima ação exata:** abrir `https://56753b53.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz sintética corrigida, copiar somente o resumo seguro e encerrar a nova janela fail-closed imediatamente depois.

## Reteste 5E corrigido: 8 aprovados / 2 falhas; gargalo de latência identificado — 18/09/2026

O operador executou a matriz na nova janela corrigida. A captura visual mostra **8 casos aprovados e 2 falhas**.

Falhas observadas:
- a classificação da página 2 aprovou `pagina_medica_autorizada`, mas a etapa de extração da mesma página falhou com `DOCUMENT_AI_PAGE_NOT_AUTHORIZED: Esta página não foi classificada para extração institucional.`;
- o chat sobre o procedimento da página 2 respondeu `NÃO CONSTA` porque a extração da página 2 não gerou evidência aprovada. Essa segunda falha é consequência da primeira, não um defeito independente do chat.

### Causa técnica provável da inconsistência

O laboratório executa `/page/classify` para cada fixture e, depois, `/page/extract`. Porém `/page/extract` chama `classifyAndExtractDocumentAiPage()`, que **classifica a mesma página novamente antes de extrair**. Assim uma página autorizada pode ser classificada corretamente na primeira chamada e divergir na segunda chamada, como ocorreu na página 2.

### Gargalo de latência confirmado pelo fluxo atual

Na matriz de seis páginas:
- 6 chamadas ao provider para a classificação explícita do harness;
- 5 páginas autorizadas chamam `/page/extract`, e cada uma realiza internamente mais 2 chamadas ao provider (reclassificação + extração) = 10;
- 4 perguntas de chat realizam mais 4 chamadas;
- total potencial da matriz: **20 chamadas sequenciais ao Gemini**.

No Titon final, o botão único não executa a classificação externa do harness, mas ainda chama `/page/extract` sequencialmente e esse endpoint faz duas chamadas ao Gemini por página. Um PDF de seis páginas pode portanto exigir até **12 chamadas sequenciais** antes do chat. Isso explica grande parte da diferença para a experiência integrada do Google Drive.

### Direção de correção proposta

Preservar isolamento por página, mas reduzir chamadas e variabilidade:
1. substituir `classificar -> extrair` por **uma única chamada multimodal por página** que retorne `pageType` e, somente quando autorizado, os campos estruturados;
2. manter `pageNumber` ancorado no backend e validar schema por `pageType`; páginas `outro` retornam sem campos;
3. executar páginas independentes com pool limitado de concorrência (por exemplo 3), em vez de serializar o documento inteiro;
4. usar `temperature` baixa/zero e `responseSchema`/structured output para reduzir variação e respostas inválidas;
5. reduzir a imagem enviada (JPEG adaptativo) e usar resolução maior apenas em retry quando necessário;
6. alinhar timeouts específicos da IA documental; hoje o provider usa `DOCUMENTS_AI_TIMEOUT_MS` com fallback de 12 s por chamada e não usa automaticamente os timeouts `GEMINI_*` já existentes;
7. manter retry/fallback somente para erro transitório/timeout/schema inválido, nunca para `422` de regra de negócio;
8. no fluxo real, chat continua opcional e não participa do tempo de `Extrair dados do PDF`.

Meta operacional para o Titon: extração típica de documentos curtos em aproximadamente **5–10 segundos**, sem abrir o PDF inteiro no mesmo contexto do modelo e sem perder isolamento/proveniência.

**Próxima ação:** encerrar a janela 5E atual após copiar o resumo seguro; implementar a redução de chamadas em uma nova branch, validar sinteticamente e repetir a 5E com o runtime otimizado.

## Migração aprovada: Titon documental em Workers AI free-only — 18/09/2026

Após o reteste Gemini com 8 aprovados / 2 falhas e latência excessiva, o operador definiu duas restrições permanentes para a IA documental:
- **não pagar pela IA documental**;
- não aceitar automaticamente fallback para serviço/modelo que possa gerar cobrança.

A decisão anterior de permanecer no Gemini Free Tier foi superada porque esse nível não é adequado para documentos reais sensíveis segundo a política atual do serviço. A PR #259, criada apenas para registrar aquela direção intermediária, foi **fechada sem merge como superseded**.

### Provider aprovado para o Titon

- plataforma: Cloudflare Workers AI pelo binding nativo `AI` já existente no Worker;
- principal: `@cf/google/gemma-4-26b-a4b-it`;
- fallback: `@cf/qwen/qwen3.8-27b`;
- `DOCUMENTS_AI_FREE_ONLY=true`;
- sem AI Gateway, créditos pré-pagos ou fallback externo;
- modelos fora dessa allowlist são bloqueados pelo provider;
- franquia gratuita esgotada gera `DOCUMENT_AI_FREE_LIMIT_REACHED` e o Titon informa indisponibilidade até a renovação;
- erro de modelo que exige plano pago gera `DOCUMENT_AI_PAID_MODEL_BLOCKED`.

Essa migração é **somente da IA documental**. O módulo `worker/gemini-assistant.js` da pré-regulação permanece separado e não deve ser reutilizado para documentos identificáveis.

### Correção de desempenho/consistência

O pipeline anterior fazia classificação e extração separadas e podia reclassificar a mesma página. Isso produziu a falha da página 2 e multiplicou chamadas.

Novo desenho na branch `feat/titon-workers-ai-free`:
- `PROMPT_ANALISE_REGULACAO_V1` classifica + extrai uma página em uma única inferência;
- uma página `outro` retorna classificação e nenhum bloco de campos;
- `pageNumber` continua pertencendo ao backend, nunca ao modelo;
- o Titon processa até **3 páginas independentes em paralelo**;
- imagens do fluxo final usam JPEG `maxEdge=1600`, qualidade `0.85`;
- timeout padrão: 6 s por tentativa / 10 s total por operação;
- Gemma é usado primeiro; Qwen entra apenas em falha recuperável;
- chat permanece opcional e fora do tempo principal de `Extrair dados do PDF`;
- a matriz 5E passa a medir `duracao_extracao_ms` separadamente de `duracao_total_ms`.

### Homologação 5E

O preparo 5E foi ajustado para exigir o binding `AI`, não `GEMINI_API_KEY`, para a IA documental. O preview continua com escrita no Drive obrigatoriamente `false` e produção continua com os gates da IA documental desligados.

A janela atualmente aberta pertence ao runtime anterior e deve ser encerrada fail-closed antes de qualquer reteste do Workers AI. As referências de source/Pages atuais do verificador são históricas até o merge desta branch; não abrir nova janela antes de congelar as referências novas.

**Próxima ação técnica:** concluir testes/CI da branch, atualizar a documentação/controle operacional, encerrar a janela 5E antiga, mesclar a migração, congelar novo runtime + Pages e executar a matriz Workers AI.

## PR #260 integrada: Workers AI free-only pronto para novo reteste — 18/09/2026

A PR **#260 — Titon: migrar IA documental para Gemma 4 + Qwen free-only** foi mesclada na `main` pelo commit `a49ecd22e922267179fd8502f08fc5950df8fb0a`.

Entrega integrada:
- IA documental usa binding nativo `AI`, sem chamada ao Gemini API;
- Gemma 4 26B A4B principal e Qwen 3.8 27B fallback;
- allowlist rígida e `DOCUMENTS_AI_FREE_ONLY=true`;
- erro de franquia gratuita (3036) encerra sem fallback pago;
- erro de modelo que exige plano pago (5035) falha fechado;
- nenhum AI Gateway é configurado pelo provider;
- `rejectIfBusy=true` evita espera em fila de capacidade; capacidade indisponível pode cair para o único fallback aprovado;
- classificação + extração foram unificadas em **uma inferência por página**;
- Titon processa no máximo 3 páginas independentes em paralelo;
- imagem do fluxo final: JPEG 1600 px / qualidade 0,85;
- saída solicitada em `json_object` e validada novamente pelo backend;
- matriz 5E mede separadamente tempo de extração e tempo total com chat.

Checks direcionados da PR #260 ficaram verdes: Fases 1–5E, procedimentos 5E, staging bundle, governança e site. O navegador/Chromium do mesmo conteúdo de frontend já havia concluído com sucesso no head anterior; entre esse head e o head final mudaram apenas arquivos do provider backend.

O Pages da `main` publicou com sucesso o merge #260. A origem imutável observada imediatamente após o merge e congelada para o reteste é:
`https://60f66c8b.portal-regulacao-central-staging.pages.dev`.

Source ref congelado do reteste:
`a49ecd22e922267179fd8502f08fc5950df8fb0a`.

### Regra de custo zero

O código reduz risco de cobrança ao limitar modelos e não usar Gateway, mas **não consegue determinar o plano comercial da conta Cloudflare**. Portanto, antes da primeira inferência Workers AI desta rodada, o operador deve confirmar no painel:
- plano Workers = **Free**;
- nenhum AI Gateway com créditos/prepaid/unified billing será usado pelo Titon.

Essa confirmação é obrigatória porque no Workers Free a franquia de 10.000 Neurons/dia é hard-stop; no Workers Paid, excedente acima da franquia pode gerar cobrança.

A janela 5E anterior `phase5e_502e857dd0424fbe92ea406048e7ad7f` pertence ao runtime antigo e deve ser encerrada fail-closed antes de abrir a janela Workers AI.

**Próxima ação humana:** confirmar o plano Workers Free e encerrar a janela antiga. Depois executar o verificador read-only; somente com `PRECONDICOES_5E_OK` iniciar uma nova janela usando as referências congeladas acima.

## PR #261 integrada — reteste Workers AI congelado — 18/09/2026

A PR **#261** foi mesclada na `main` pelo commit `bbfdcec20b7d0e2629f9be1c93ea82d3136e3c32`.

Estado persistente após o merge:
- `main`: `bbfdcec20b7d0e2629f9be1c93ea82d3136e3c32`;
- runtime **intencionalmente congelado** para o reteste 5E: `a49ecd22e922267179fd8502f08fc5950df8fb0a` (merge funcional da PR #260);
- Pages imutável congelado: `https://60f66c8b.portal-regulacao-central-staging.pages.dev`;
- produção da IA documental continua com gates `false/false`.

Essa diferença entre `main` e source ref do reteste é intencional: `bbfdcec...` adiciona apenas congelamento/documentação do reteste; o runtime funcional homologado continua sendo `a49ecd22...`.

**Próxima ação humana permanece:** antes de qualquer inferência Workers AI, confirmar plano Workers Free e ausência de AI Gateway pago; depois encerrar a janela 5E antiga e executar o verificador read-only.

## Regra permanente do Titon: custo de IA documental = R$ 0 — 18/09/2026

O operador definiu como requisito permanente que a **IA documental do Titon deve operar 100% sem cobrança**.

Consequências obrigatórias:
- usar somente Cloudflare Workers AI dentro da franquia gratuita aplicável à conta;
- manter `DOCUMENTS_AI_FREE_ONLY=true`;
- permitir somente a allowlist aprovada: Gemma 4 principal e Qwen 3.8 fallback;
- não usar AI Gateway com unified billing, créditos prepaid ou qualquer mecanismo pay-as-you-go;
- não usar modelo que exija plano pago;
- não trocar automaticamente para API externa paga;
- ao atingir o limite gratuito diário, falhar fechado e informar indisponibilidade até a renovação da franquia;
- qualquer futura mudança de provider/modelo deve ser revisada primeiro contra esta regra de custo zero;
- se uma mudança comercial da Cloudflare tornar o fluxo potencialmente cobrável, o Titon deve permanecer bloqueado até nova decisão explícita do operador.

Essa regra é de governança do projeto e não deve ser tratada como preferência temporária.

## Incidente controlado: encerramento da janela 5E legado bloqueado — 18/09/2026

O operador tentou encerrar a janela 5E anterior após a migração do Titon para Workers AI. O procedimento parou na etapa `1/5 Reconfirmando preview e banco da janela...` com:
`INTERVENCAO_NECESSARIA_WORKERS_AI_BINDING_AUSENTE`.

Impacto: **nenhuma revogação D1, upload, alteração de alias, Drive ou produção ocorreu nessa tentativa**, porque a falha aconteceu antes da etapa 2/5 (`disableControlSql`).

Causa: `encerrar-homologacao-5e.mjs` reutilizava `inspectProductionVersion()` sobre o preview antigo. Após a migração da PR #260, essa função passou a exigir binding `AI` por padrão. O preview legado foi criado antes dessa exigência e, corretamente, não contém o binding Workers AI.

Correção: a inspeção agora aceita `requireWorkersAi:false` somente no caminho de encerramento. O preparo/verificador de **nova** janela continua exigindo Workers AI normalmente. O fechamento legado ainda preserva D1, runtime, secrets mínimos, upload preview bloqueado e confirmação HTTP final.

**Próxima ação:** após CI/merge desta correção, o operador deve baixar novamente os scripts da `main`, repetir apenas `encerrar-homologacao-5e.mjs --encerrar` e depois rodar o verificador read-only. Não recriar controle/janela antiga.

## Janela 5E legado encerrada com sucesso — 18/09/2026

O operador repetiu o encerramento com a correção da PR #264 e o procedimento concluiu as cinco etapas.

Evidência sanitizada:
- controle revogado: `phase5e_502e857dd0424fbe92ea406048e7ad7f`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado: `12ca457e-5035-403c-8b5e-f9c2e5d98142`;
- release histórico encerrado: `39ded96a1ef1e2f707f8cf96ae33c96ee405c5d2`;
- `httpBlocked=true`.

Resultado: a janela Gemini anterior está **fail-closed**. Ela não deve ser reutilizada.

A tentativa anterior que falhou por ausência de binding Workers AI não produziu mutação remota; esta execução subsequente confirmou revogação D1 e bloqueio HTTP final.

**Próxima ação:** executar somente o verificador read-only 5E da `main` atual. Antes de abrir a nova janela Gemma/Qwen, confirmar também no painel Cloudflare que a conta está em Workers Free e que este fluxo não usa AI Gateway/prepaid/unified billing.

## Readiness 5E Workers AI confirmado — 18/09/2026

O operador executou o verificador somente leitura após o encerramento fail-closed da janela anterior.

Resultado sanitizado:
- `PRECONDICOES_5E_OK`;
- produção ativa observada: `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- `workersAiBindingPresent=true`;
- `freeOnlyModels=true`;
- `extractCapability=true`;
- `activeControlledWindow=false`;
- source ref congelado: `a49ecd22e922267179fd8502f08fc5950df8fb0a`;
- Pages congelado: `https://60f66c8b.portal-regulacao-central-staging.pages.dev`;
- próxima ação técnica retornada pelo verificador: `PREPARAR_HOMOLOGACAO_5E`.

Interpretação: as precondições técnicas para abrir uma nova janela Gemma/Qwen estão satisfeitas. A única trava restante antes da primeira inferência é a regra de custo zero: confirmar no painel Cloudflare que a conta usa Workers Free e que o fluxo Titon não está associado a AI Gateway/prepaid/unified billing.

**Próxima ação humana:** confirmar Workers Free + ausência de cobrança por Gateway. Depois executar o preparo 5E e rodar a matriz sintética Workers AI, medindo `duracao_extracao_ms` e `duracao_total_ms`.

## Workers Free confirmado pelo operador — 18/09/2026

O operador enviou evidência visual do painel Cloudflare `Manage Account > Billing > Subscriptions`.

Evidência observada:
- produto `Workers` com status `Active`;
- plano exibido: **Workers Free**;
- a própria tela oferece `Upgrade to Workers Paid`, confirmando que o plano pago não está ativo.

Como o Titon documental chama o binding nativo `AI` diretamente e o provider não configura AI Gateway, a precondição de custo zero para esta rodada está satisfeita.

Resultado: **nenhuma trava humana de custo permanece para abrir a nova janela 5E**.

**Próxima ação:** executar o preparo 5E com as referências congeladas `a49ecd22e922267179fd8502f08fc5950df8fb0a` + `https://60f66c8b.portal-regulacao-central-staging.pages.dev`, mantendo `DOCUMENTS_DRIVE_WRITE_ENABLED=false`, e depois rodar a matriz Gemma 4 + Qwen.

## Nova janela 5E Gemma/Qwen preparada — 18/09/2026

O operador executou o preparo 5E após readiness verde, Workers Free confirmado e encerramento fail-closed da janela Gemini anterior.

Resultado sanitizado da nova janela:
- preview version: `388d2847-d9d8-478a-8d27-1618a869989f`;
- controle: `phase5e_53f22db9f82345c1b01425299595cad9`;
- expiração: `2026-09-19T07:53:15.000Z`;
- release funcional: `a49ecd22e922267179fd8502f08fc5950df8fb0a`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu em `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- próxima ação retornada pelo procedimento: `ABRIR_LABORATORIO_5E`.

Esta é a primeira janela 5E da migração Workers AI free-only. O laboratório continua 100% sintético, não acessa Drive e não contém dados reais de pacientes.

**Próxima ação operacional:** abrir exatamente `https://60f66c8b.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz, aguardar a conclusão, clicar `Copiar resumo seguro` e registrar `MATRIZ_5E_SINTETICA`, `aprovados`, `falhas`, `duracao_extracao_ms`, `duracao_total_ms` e nomes dos casos. Depois encerrar a janela fail-closed independentemente de aprovação/falha.

## Primeiro teste Gemma/Qwen: falha por timeout artificial do Titon, não por qualidade do modelo — 18/09/2026

O operador executou a matriz sintética na janela Workers AI preparada. Resultado visual:
- `MATRIZ_5E_SINTETICA=FALHOU`;
- **0 aprovados / 10 falhas**;
- extração das seis páginas: **27,2 s**;
- total com chat: **49,7 s**;
- as seis páginas falharam com o mesmo erro: `DOCUMENT_AI_PROVIDER_LOCAL_TIMEOUT`;
- os quatro casos de chat falharam em cascata porque nenhuma página gerou evidência aprovada.

Diagnóstico: esse resultado **não mede a capacidade do Gemma 4 nem do Qwen de extrair os documentos**. O provider local tinha um `Promise.race` de 6 s por tentativa. Quando esse relógio disparava, a chamada era abandonada pelo código mesmo sem erro nativo do Workers AI. Além disso, `DOCUMENT_AI_PROVIDER_LOCAL_TIMEOUT` era terminal, então **Qwen não era tentado** após o timeout do Gemma.

Outro gargalo encontrado: Gemma 4 e Qwen 3.8 são modelos com raciocínio. O input documental não desativava thinking. A documentação atual do Workers AI mostra `chat_template_kwargs.enable_thinking=false` para Gemma 4 e expõe controles de raciocínio para Qwen; manter thinking ligado é desnecessário para OCR/extração literal e aumenta latência.

### Correção V4 em desenvolvimento

Branch: `feat/titon-workers-ai-latency-v2`.

Mudanças:
- remover o timeout artificial `Promise.race`; usar o timeout nativo do Workers AI (`3007/3008`);
- manter `rejectIfBusy=true`; erro de capacidade `3040` vira fallback imediato para o Qwen gratuito;
- timeout nativo, resposta inválida e schema inválido também podem cair para Qwen;
- `3036` (franquia gratuita esgotada) continua terminal e sem cobrança;
- `5035` (modelo exige plano pago) continua terminal/fail-closed;
- desativar raciocínio com `reasoning_effort:null` e `chat_template_kwargs.enable_thinking=false`/`clear_thinking=true`;
- usar `max_completion_tokens` e prompt integrado mais curto;
- matriz passa a enviar JPEG 0,85, igual ao perfil do fluxo final;
- resumo seguro passa a registrar Gemma/Qwen usados e latência por página, sem conteúdo documental.

A janela atual do teste fracassado deve ser **encerrada fail-closed antes de qualquer novo preview/runtime**. Não repetir a matriz nessa mesma janela, pois ela serve o release antigo `a49ecd22...`.

**Próxima ação:** encerrar a janela atual; concluir CI/merge da correção; congelar novo source ref + Pages; abrir nova janela 5E e repetir a matriz.

## Correção V4 de latência integrada e reteste congelado — 18/09/2026

A PR **#269** foi integrada no merge `8ee43cfafcb35fd03834701acc4f3e96fcde1368` após checks direcionados verdes de Fases 1–5E, procedimentos 5E, staging bundle, governança e site.

Pages imutável observado após o merge:
`https://c92471f6.portal-regulacao-central-staging.pages.dev`.

Referências congeladas do próximo reteste:
- source ref: `8ee43cfafcb35fd03834701acc4f3e96fcde1368`;
- Pages: `https://c92471f6.portal-regulacao-central-staging.pages.dev`.

A V4 remove o timeout artificial que causou 0/10, desativa thinking, mantém fallback gratuito Gemma→Qwen para erros recuperáveis e acrescenta métricas técnicas por página/modelo.

A janela que produziu o resultado 0/10 ainda pertence ao runtime antigo:
- controle: `phase5e_53f22db9f82345c1b01425299595cad9`;
- preview: `388d2847-d9d8-478a-8d27-1618a869989f`;
- release: `a49ecd22e922267179fd8502f08fc5950df8fb0a`;
- Drive write permaneceu false.

**Próxima ação obrigatória:** encerrar essa janela fail-closed. Só depois executar readiness com as referências V4 e preparar outra janela. Não repetir a matriz no preview antigo.

## Janela 0/10 encerrada fail-closed; V4 liberada para nova abertura — 18/09/2026

O operador encerrou com sucesso a janela que executou a primeira matriz Workers AI 0/10.

Evidência sanitizada:
- controle encerrado: `phase5e_53f22db9f82345c1b01425299595cad9`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado: `85f57743-6c96-41d5-92ca-050ac864ef40`;
- release encerrado: `a49ecd22e922267179fd8502f08fc5950df8fb0a`;
- `httpBlocked=true`.

Resultado: o runtime antigo está fail-closed e não deve ser reutilizado.

As referências congeladas do reteste V4 permanecem:
- source ref: `8ee43cfafcb35fd03834701acc4f3e96fcde1368`;
- Pages: `https://c92471f6.portal-regulacao-central-staging.pages.dev`.

**Próxima ação exata:** baixar os scripts atuais da `main`, executar `iniciar-homologacao-5e.mjs --iniciar`, confirmar `PREPARAR HOMOLOGACAO 5E`, abrir o laboratório V4 e executar a matriz.

## Janela 5E V4 preparada para reteste Gemma/Qwen — 18/09/2026

O operador executou o atalho 5E já atualizado para a correção V4. O readiness foi reconfirmado imediatamente antes do preparo.

Evidência sanitizada do readiness:
- `PRECONDICOES_5E_OK`;
- `workersAiBindingPresent=true`;
- `freeOnlyModels=true`;
- `extractCapability=true`;
- `activeControlledWindow=false`;
- source ref: `8ee43cfafcb35fd03834701acc4f3e96fcde1368`;
- Pages: `https://c92471f6.portal-regulacao-central-staging.pages.dev`.

Nova janela V4 preparada:
- preview version: `051fae80-27ae-42c6-bcad-cb23fafc8f2f`;
- controle: `phase5e_a306e08ec60f46ac8102cc021c163164`;
- expiração: `2026-09-19T08:19:41.000Z`;
- release: `8ee43cfafcb35fd03834701acc4f3e96fcde1368`;
- `aiGate=true` apenas no preview;
- `driveWriteGate=false`;
- produção permaneceu em `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

Esta janela contém a correção V4: sem timeout artificial local, thinking desligado, fallback Gemma→Qwen em erros recuperáveis, JPEG 0,85 e métricas por página/modelo.

**Próxima ação operacional:** abrir exatamente `https://c92471f6.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz uma única vez, aguardar conclusão e usar `Copiar resumo seguro`. Registrar `MATRIZ_5E_SINTETICA`, contagens, `duracao_extracao_ms`, `duracao_total_ms`, `gemma_paginas`, `qwen_paginas` e linhas `pagina_XX_ms`. Depois encerrar a janela fail-closed independentemente do resultado.

## Segundo teste Workers AI: imagem não estava no formato multimodal correto — 18/09/2026

O operador executou a matriz V4. Resultado visual:
- `MATRIZ_5E_SINTETICA=FALHOU`;
- **1 aprovado / 9 falhas**;
- extração: aproximadamente **30,9 s**;
- total com chat: aproximadamente **54,1 s**;
- a única página aprovada foi a página administrativa esperada como `outro`.

Nas páginas 1, 2, 4, 5 e 6, o detalhe mostra classificação `pageType: "outro"` e `extraction: null`. As tentativas indicam Gemma falhando estruturalmente e Qwen retornando `success`, porém classificando as páginas visuais autorizadas como `outro`.

Diagnóstico: o provider V4 enviava a imagem em uma propriedade top-level `image`, enquanto os modelos modernos de chat multimodal do Workers AI usam conteúdo multimodal dentro da mensagem do usuário (`content` em array com `image_url` + `text`). O comportamento observado é compatível com modelo recebendo as instruções textuais mas não interpretando a página visual.

### Correção V5

Branch: `fix/titon-workers-ai-multimodal-payload-v5`.

Mudança principal:
- remover `image` top-level;
- enviar a página como `messages[1].content = [{type:'image_url', image_url:{url:dataUri}}, {type:'text', text:prompt}]`;
- manter isolamento de uma página, thinking off, fallback gratuito, JSON mode e proveniência backend-owned.

Essa correção ataca o ponto central observado na matriz: a página administrativa passa porque `outro` é a resposta segura quando o modelo não vê a imagem; as páginas autorizadas falham exatamente por serem classificadas da mesma forma.

**Critério de continuidade:** vale seguir com o projeto se, após a V5 multimodal correta, as páginas autorizadas começarem a ser reconhecidas/extrair campos. Se a V5 ainda falhar em reconhecer as páginas visuais, interromper a insistência nesses dois modelos e mudar a arquitetura para OCR/text-layer local + modelo apenas sobre texto estruturado.

A janela V4 atual deve ser encerrada fail-closed antes de qualquer teste V5. Não reutilizar o preview V4.

## V4 encerrada fail-closed; V5 multimodal congelada para teste decisivo — 18/09/2026

O operador encerrou com sucesso a janela V4 após o teste 1/10.

Evidência sanitizada do encerramento:
- controle: `phase5e_a306e08ec60f46ac8102cc021c163164`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado: `f31277f5-bf69-4235-af85-b458192c20d8`;
- release encerrado: `8ee43cfafcb35fd03834701acc4f3e96fcde1368`;
- `httpBlocked=true`.

A correção multimodal V5 foi integrada pela PR #273 no merge `20488871ce2556c06795367ededbdb49791c23f5`.

Referências congeladas do próximo reteste:
- source ref: `20488871ce2556c06795367ededbdb49791c23f5`;
- Pages: `https://e8003492.portal-regulacao-central-staging.pages.dev`.

Objetivo do próximo teste: verificar se, com a imagem efetivamente enviada como `image_url` dentro da mensagem multimodal, Gemma/Qwen passam a reconhecer `comprovante_atendimento` e `pagina_medica_autorizada` e extraem campos. Esse é o teste decisivo da estratégia de visão direta.

**Regra de parada:** se a V5 ainda classificar páginas visuais autorizadas como `outro` ou não produzir extração consistente, não insistir indefinidamente nesses modelos; migrar o Titon para text-layer PDF.js/OCR local + IA apenas sobre texto estruturado.

**Próxima ação:** atualizar scripts locais, rodar readiness V5 e, se verde, abrir nova janela 5E V5 e executar a matriz uma única vez.

## Janela 5E V5 multimodal preparada — 19/09/2026

O operador executou o atalho 5E atualizado para a V5 multimodal. O readiness foi reconfirmado imediatamente antes do preparo.

Evidência sanitizada:
- `PRECONDICOES_5E_OK`;
- produção ativa: `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- `workersAiBindingPresent=true`;
- `freeOnlyModels=true`;
- `extractCapability=true`;
- `activeControlledWindow=false` antes da abertura;
- source ref: `20488871ce2556c06795367ededbdb49791c23f5`;
- Pages: `https://e8003492.portal-regulacao-central-staging.pages.dev`.

Nova janela V5:
- preview version: `70ac2526-24ff-4eb0-9ef6-67b9a153753d`;
- controle: `phase5e_df6907b25f2a46e3b228ffb89b039461`;
- expiração: `2026-09-19T09:01:20.000Z`;
- release: `20488871ce2556c06795367ededbdb49791c23f5`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu inalterada.

**Próxima ação operacional:** abrir exatamente `https://e8003492.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar e executar a matriz uma única vez. Copiar o resumo seguro. Esse teste decide se a estratégia de visão direta continua ou se a arquitetura migra para text-layer/OCR local + IA textual. Depois encerrar a janela fail-closed independentemente do resultado.

## V5 multimodal avançou para 8/10; uma única falha real restante é a página ilegível — 19/09/2026

O teste V5 multimodal melhorou substancialmente o resultado. Pela captura do operador:
- **8 casos aprovados / 2 falhas**;
- páginas 1, 2, 3, 4 e 5 aprovadas;
- página 6 (`CID ilegível`) falhou;
- os três primeiros chats aprovaram;
- o chat de CID ilegível da página 6 falhou em cascata porque a página 6 não foi admitida como evidência.

Interpretação: existem **dois cartões vermelhos, mas uma única falha documental de origem**. O caminho de classificação, OCR/visão e extração já está funcional para comprovante, páginas médicas conflitantes, prompt injection e campo ausente. A pendência está concentrada na literalidade/estado de uma página adversarial com campo propositalmente ilegível.

A extração V5 também foi percebida como mais rápida que a V4. A captura mostra tempo de extração na ordem de dezenas baixas de segundos; a otimização fina de latência continua secundária à eliminação da última falha de precisão. Na V6, páginas independentes passam a executar com concorrência de até **6 páginas**, reduzindo o documento curto de duas ondas para uma única onda de inferência quando houver capacidade.

### V6 de precisão textual

Branch: `feat/titon-v6-text-accuracy`.

Mudanças em desenvolvimento:
- render da página em **PNG 1800 px** no fluxo final, priorizando texto nítido; páginas fotográficas acima de ~2,8 MiB recuam automaticamente para JPEG 0,92;
- laboratório 5E também passa a usar PNG e processa as seis páginas em paralelo;
- prompt integrado V2 reforça a diferença entre `nao_consta` e `ilegivel`: rótulo presente + valor borrado/rasurado/coberto/cortado = `ilegivel`;
- valores com frases como `NÃO DEVE SER INFERIDA` são tratados explicitamente como dado literal, nunca como instrução;
- conferência visual caractere a caractere para todo campo `encontrado`;
- revisão focal **somente nos campos ambíguos** de página médica, usando Qwen gratuito; quando CID é ambíguo, CID + descrição são revisados juntos, quando houver campo `ilegivel` ou combinação CID ausente + descrição presente;
- essa revisão não roda em páginas normais e não duplica custo/latência de todo o documento;
- se o revisor não responder, a extração inicial válida é preservada;
- resumo seguro do laboratório passa a listar apenas as **chaves dos campos divergentes**, nunca seus valores, para diagnosticar rapidamente qualquer nova falha.

Decisão: a estratégia de visão direta **continua viável**, pois a V5 já aprovou 5/6 páginas e 3/4 chats. Não migrar ainda para OCR/text-layer como caminho principal. O fallback arquitetural local permanece reservado caso a V6 não elimine a falha adversarial.

**Próxima ação:** concluir CI/merge da V6; encerrar a janela V5 atual fail-closed antes de abrir qualquer reteste V6; congelar novo runtime + Pages e repetir a matriz.

## V6 de precisão textual integrada e reteste congelado — 19/09/2026

A PR **#276** foi integrada na `main` pelo merge `76bfefa17bae0729090277525186bdc7dcfc0068`.

Referências congeladas do próximo reteste:
- source ref: `76bfefa17bae0729090277525186bdc7dcfc0068`;
- Pages imutável: `https://27a15b34.portal-regulacao-central-staging.pages.dev`.

Entregas da V6:
- até 6 páginas independentes processadas em paralelo;
- PNG 1800 como padrão e JPEG 0,92 apenas se PNG ultrapassar ~2,8 MiB;
- prompt integrado V2 para literalidade e `ilegivel` versus `nao_consta`;
- revisão focal no Qwen somente para campos médicos ambíguos;
- CID + descrição revisados em conjunto quando o CID é ambíguo;
- diagnóstico de `pagina_XX_campos_divergentes` no resumo seguro sem copiar valores.

A janela V5 que produziu **8/10** ainda precisa ser encerrada fail-closed antes da abertura V6. Não executar outra matriz nela.

**Próxima ação exata:** encerrar a janela V5; atualizar scripts locais para a `main`; rodar readiness V6; se verde, preparar a nova janela e executar a matriz.

## Fase atual

**Fase 5 — IA documental.** Subfase **5E — V6 de precisão textual integrada; reteste aguarda encerramento fail-closed da janela V5 8/10**. Produção continua com IA documental desligada.

A **Fase 0** e as Fases **1, 2, 3 e 4** permanecem encerradas após o merge/publicação desta entrega. Não reiniciar etapas encerradas; hardening de latência pertence à Fase 7.

- Branch funcional da correção #256: integrada. Branch atual é somente congelamento/documentação do reteste 5E.
- Fases 5A–5D: PRs **#215–#218 mesclados**. 5E está tecnicamente pronta e integrada, ainda sem ativação real do provider.
- Ref de base real da 5E: **`8fba51979aba95c31ec7ef6644949c8c508530f6`**. Preservar login/abertura/Home, editor, sincronização e gate seguro do Worker.
- Código congelado do reteste: **`2fee19e69e06ecd128be2b103354fc6c2fb4e431`**.
- Preview-base: **`a17473ce-ad9a-480c-8e53-901f2fcc3c92`**, configuração desarmada validada anteriormente pelo relatório V3. Não presumir que ainda atenda o alias `central-docs-phase4d`.

## Evidência nova — bloqueio HTTP do preview confirmado, 18/09 aproximadamente 02:04 local

O operador executou uma única requisição GET sem credenciais ao alias de homologação, com Origin Pages autorizado, sem redirecionamento. Resultado sanitizado:

- status HTTP: **403**;
- header **X-Central-Docs-Preview-Release: 2fee19e69e06ecd128be2b103354fc6c2fb4e431**.

Isso confirma conjuntamente que o endereço `central-docs-phase4d` está servindo o wrapper/release congelado 2fee19e e que, após a revogação explícita do controle no D1, a requisição é bloqueada antes do acesso documental. A evidência não depende apenas da descrição visual da versão nem de cache do Pages.

Combinada às evidências anteriores — enabled=0, revogada=1, upload_sessions=0; alias mais recente associado a a17473ce; configuração-base validada com DOCUMENTS_DRIVE_WRITE_ENABLED=false — a **janela antiga 4D está operacionalmente encerrada**. Não repetir SQL, HTTP, V3, OAuth ou downloads para confirmar de novo.

Limite: o 403 confirma o bloqueio daquela requisição e o release servido; não é prova retrospectiva sobre requisições já aceitas antes da revogação. A ausência de sessões registrada continua não sendo inventário universal de operações externas.

**Próxima ação exata:** preparar uma nova janela 4D limpa, com identificador e prazo novos, mantendo a mesma conta e PDF descartável autorizados. A reconciliação com a main já foi concluída e validada; não reutilizar o V3/janela vencida. Antes de qualquer escrita real, reconferir a produção Cloudflare atual, criar novo controle D1 revogável e manter o gate `DOCUMENTS_DRIVE_WRITE_ENABLED=false` até a confirmação humana da janela.

## Evidência nova — alias consultado por Wrangler, 18/09 aproximadamente 02:02 local

O operador executou a listagem somente leitura com Wrangler 4.133.0 usando a configuração de verificação já existente. Resultado sanitizado:

- 10 versões consultadas;
- preview-base a17473ce presente na lista;
- versões com anotação workers/alias=central-docs-phase4d: a17473ce (18:02:13Z), 9ae11ff5 (14:06:10Z), da1f2bc8 (13:57:15Z) e e37fccb3 (13:50:24Z).

A documentação Cloudflare define alias como endereço estável associado a uma versão no upload. Entre as dez versões mais recentes, a17473ce é a associação mais recente desse alias; nenhuma versão posterior consultada traz a mesma anotação. Combinado ao relatório V3 anterior, que validou a17473ce como configuração desarmada, naquele instante o melhor estado comprovado era: alias apontando para a17473ce e base com DOCUMENTS_DRIVE_WRITE_ENABLED=false. **Essa pendência foi superada pela confirmação HTTP registrada acima (403 + release 2fee19e); não repetir a consulta.**

A tentativa anterior que falhou em LER_PREPARO_LOCAL não alterou nada e foi superada. Não repetir download, OAuth, D1, V3 completo ou liberação. **A requisição HTTP prevista nesta etapa já foi executada posteriormente e confirmou o bloqueio; este trecho é histórico, não uma ação pendente.**

## Evidência nova — linha do preview e menu, 18/09 aproximadamente 01:43 local

O operador enviou a parte inferior da primeira página de Version History. A linha **a17473ce** está visível com a mensagem **Central Docs 4D: nova janela; escrita bloqueada**, rótulo **central-docs-phase4d** e origem Wrangler. A localização dessa versão no histórico está concluída: não pedir outra rolagem para encontrá-la.

O mesmo rótulo aparece em versões anteriores: 9ae11ff5 (baseline certificada salvamento), da1f2bc8 (diagnostico numerico restrito) e e37fccb3 (release identificavel para diagnostico real). O painel mostra **Showing 1-10 of 743**, página 1. Isso é o que a interface apresenta, não um inventário autenticado completo feito pelo assistente.

O menu aberto da linha a17473ce contém somente **Rollback, Split versions e View logs**. Nenhuma opção mostrada consulta a configuração dessa versão. Não selecionar Rollback/Split versions, não usar View logs como substituto de configuração e não supor outra opção de detalhes que não foi exibida. A descrição escrita bloqueada e o rótulo compartilhado não demonstram por si sós o valor de DOCUMENTS_DRIVE_WRITE_ENABLED nem o destino atual do endereço de teste.

**Decisão:** sair da navegação por menus e consultar somente metadados de versões pelo Wrangler já autenticado. Distinguir `workers/tag` de `workers/alias`; não tratar o rótulo visível como prova de roteamento. Nenhum novo download, instalação manual, login, preparação de código, SQL ou upload é necessário para essa consulta.

Fonte: screenshot fornecido pelo operador; não publicar imagem, autores, caminhos pessoais ou credenciais no repositório. O aviso Latest build failed continua visível, sem causa/branch/commit/relação com 4D identificados. Não inferir indisponibilidade nem acionar retry.

## Histórico superado — listagem restrita do alias (já executada)

No mesmo Windows, usar o PowerShell e o `configPath` já registrado em `%LOCALAPPDATA%\CentralDocumentos4D\ultimo-preview.json`. Invocar somente:

`npx.cmd --yes wrangler@4.133.0 versions list --name yellow-wave-d0a1guia-regulacao-ia --config <configPath existente> --json`

Capturar a saída em memória, verificar sucesso e interpretar o JSON antes de mostrar qualquer conteúdo. Filtrar pela anotação exata **workers/alias=central-docs-phase4d**, ordenar por metadata.created_on e projetar somente UUID de versão/data. Não mostrar JSON bruto, autor, outros bindings, configurações ou registros locais completos.

O bloco de resposta será **ALIAS_PREVIEW_SOMENTE_LEITURA**, com a quantidade retornada, indicação de a17473ce estar na lista e versões que efetivamente tragam aquela anotação. Ausência de candidatos não comprova ausência global do alias. O comando retorna no máximo dez versões recentes; os resultados são metadados das versões, não uma consulta HTTP ao alias nem exclusão de alteração concorrente.

A instrução fornecida captura erros sem expor saída bruta; em falha retorna CONSULTA_NAO_CONCLUIDA. Não repetir em laço ou executar publicação para corrigir uma listagem. O comando reutiliza a configuração local sem reescrevê-la e não executa o V3 inteiro, SQL, versions upload, deploy, rollback ou comando de segredo.

**Esta execução foi concluída posteriormente.** O resultado sanitizado e a confirmação HTTP estão registrados acima; não repetir a listagem nem o GET antigo. A janela anterior está encerrada e não deve ser reabilitada.

## Etapa D1 concluída — não repetir

O SELECT isolado do operador, aproximadamente às 01:31 locais de 18/09, confirmou:

| enabled | expires_at | revogada | upload_sessions |
| --- | --- | --- | --- |
| 0 | 1789675801 | 1 | 0 |

**Revogação explícita confirmada para `phase4d_d7275a73110548fc8fd26125a60d6a2b`.** A linha permanece presente e desativada, com o prazo original **17/09/2026 20:10:01 UTC — 16:10:01 em Eldorado/MS**. Não restaurar enabled=1, estender prazo, reutilizar identificador ou reenviar UPDATE/SELECT para confirmar de novo. Zero sessões significa zero registros dessa janela naquele instante, não prova universal sobre requisições já aceitas pelo Google.

A leitura às 01:21:54 retornou enabled=1, expires_at=1789675801, now_epoch=1789708914, same_scope=1, one_file=1, other_active_controls=0 e upload_sessions=0. A tentativa UPDATE/SELECT às aproximadamente 01:27 exibiu apenas This query returned no data; a leitura independente posterior resolveu a incerteza. Não inferir comportamento universal do Console a partir dessa exibição.

O wrapper congelado rejeita controle desativado ou expirado antes do encaminhamento. A evidência D1 não identifica sozinha o wrapper servido nem seu gate. Revogação não desfaz upload já aceito; troca de alias não revoga versões antigas.

## Evidências produtivas e operacionais preservadas

- Relatório V3 do operador, aproximadamente 01:13: deployment **250b3d7b-9012-4073-9986-de36dd14bc3d**, versão **91eae913-ebaa-4550-8e88-f701f6cef777**, **100%**, duas leituras coincidentes. O screenshot de Active deployment às 01:37 também identifica 91eae913, sem nova confirmação API dos percentuais. Preservar atualizações legítimas; f8848c45/83a620d7 e 239cca88 são históricos, não alvos de rollback.
- `basePreviewMatches=true`: configuração do preview-base/D1 esperado passou. `matchesReviewedProduction=false` identifica referência antiga do V3, não defeito produtivo. Não usar mensagens de merge ou proximidade de horários para atribuir conteúdo de deployment a um PR.
- Registro local após leitura V3: uploadAttempted=false, uploaded=false, newVersionId=null, v3MarkerExists=false, lockFileDetected=false. Não equivale a inventário global de uploads por outros computadores/consoles.
- Erro JANELA_D1/WRANGLER_FALHOU_OU_EXCEDEU_PRAZO foi contornado para a leitura via Console. Sua causa específica no Windows não foi diagnosticada; não afirmar timeout, quota, quoting ou credenciais. MODULE_NOT_FOUND foi superado. Preparo, login normal Wrangler e OAuth institucional anteriores permanecem concluídos.
- GET público do ambiente do assistente a `/api/documents/access`, com Origin Pages registrado, sem credenciais/redirects e limite de 15 s, havia retornado ConnectionError sem resposta HTTP. Não comprova bloqueio, release/gate ou indisponibilidade. Não foi repetido nesta intervenção.
- Nova busca no diretório de plugins por Cloudflare não retornou ferramenta nesta intervenção. É resultado desta sessão, não indisponibilidade permanente; não solicitar credenciais para contornar.

## Produto, segurança e critérios pendentes

Fases 1–3: navegação/leitura Drive, PDF.js próprio, operações reversíveis, editor essencial, exportação e impressão aceitos. Nenhuma regressão dessas fases demonstrada pelos erros operacionais. 4A–4C: sessão/capabilities/permissões/metadados/conflitos revalidados, referências opacas, upload resumable backend cifrado, assinatura PDF, recuperação e confirmação final. Autosync observa revisão real com um segundo de ociosidade; zoom/navegação não enviam. Estados normal → pending → syncing → success de um segundo → normal; failed permite retry. Assets/cache-buster preservados.

Confirmação de revisão anterior não comprova edição nova durante upload. X/saída/troca respeitam pendências; beforeunload é aviso, não garantia de envio após fechar. Primeiras provas reais preservaram/recuperaram revisão e mostraram feedback, mas envios seguintes tiveram conflito indevido. X foi corrigido/retestado. Base16/atual18 não comprovou causalidade do keepForever. Correção 2fee19e relê recibo/metadados e certifica baseline na ref, vinculada a usuário/arquivo/versão/identidade/contexto/origens/controle, TTL30min. Revisão externa inclusive com mesmos bytes permanece conflito; preflight/upload não são atômicos.

Ainda faltam provas reais de salvamentos consecutivos, edição durante upload, ausência de reenvio sem mudança, retry, fechamento com sucesso/falha, conflito externo verdadeiro, reabertura final e recuperação, depois encerramento/matriz. save_copy segue sem homologação real no wrapper restrito; replace_pdf sozinho não conclui toda a Fase 4. Reconciliação de #201 com main é etapa própria, preservando melhorias transversais e validando candidato sem escolher automaticamente um lado do conflito.

Jamais promover `worker/homologation-4d.js` para produção. D1/OAuth compartilhados; autenticação/capabilities reais e isolamento por host/origem, conta/PDF permitido, controle revogável/expirável e sessões. OAuth/reconexão/desconexão e rotas alheias bloqueados; replace_pdf permitido, save_copy bloqueado no wrapper.

Não registrar no GitHub/PostHog nomes/IDs de arquivos ou usuários, conteúdo PDF, referências/revisões, URL resumable, credenciais, CPF/CNS/CID/diagnósticos. Telemetria somente drive_sync_started/completed/failed e propriedades técnicas allowlisted. Não apagar ledger/locks, recriar tabelas, importar SQL via --file remoto, remover guards ou usar liberação antiga com prazo/referências vencidos.

## Validações e artefatos

Nesta intervenção: leitura de screenshot, status, ref main, Guia Mestre já disponibilizado integralmente e documentação oficial de Preview URLs/Wrangler versions list/view. Nenhum código do editor/V3 foi alterado; nenhuma suíte foi repetida ou CI declarado verde. PowerShell não está disponível no ambiente local; não alegar execução do bloco no Windows ou resultado remoto. Não houve SQL remoto, upload, deploy, retry de build, alteração de segredo/permissão ou main pelo assistente. Somente este status na branch foi atualizado.

Artefatos anteriores preservados:
- V3 `scripts/central-docs/liberar-escrita-preview-4d-v3.mjs`, criação89fa77590d675ce7edb5f91ddeded66405f2ce8f; SHA-256 **0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234**. Testes em831935b932bd86d62e6d74aac1fbc70406730758, SHA-25692c17049baaca1134651ee6bd4399e64fea3b4caec1d24d9fd6cd84acb45ec1b; CI4018be8c23befd0591efd09d43b9a6cea36b1b0b.
- Original recebido SHA-25653b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5. V2-R1 documentado em103ccd6, SHA-256812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8; liberação suspensa, execução remota não confirmada.
- Históricos: V3 87 testes Node/sintaxe/três casos SQLite; revogação cinco casos sintéticos em9c491c2; RESULTADOS registra274/274 Worker e75 passed/3 skipped navegador para2fee19e. Não são novos resultados do head atual.
- Proteções V3: herança restrita por nome, multipart, lock/registro/marcador antes de tentativa, confirmação/revalidação. Sem exclusão remota transacional; Wrangler pode reconciliar tags não versionadas no upload. Liberação continua vinculada à janela vencida/revogada: não usar.

## Janela V5 encerrada fail-closed — 19/09/2026

O operador concluiu o procedimento oficial `encerrar-homologacao-5e.mjs --encerrar` para a janela V5 que produziu o resultado 8/10.

Evidências sanitizadas do encerramento:
- `JANELA_5E_ENCERRADA`;
- controle D1 desabilitado (`controlEnabled=false`);
- gate de IA desligado (`aiGate=false`);
- gate de escrita Drive desligado (`driveWriteGate=false`);
- versão preview final bloqueada `1e4a404e-ba4d-4cc8-834c-f7598a2a3af7`;
- release encerrado `20488871ce2556c06795367ededbdb49791c23f5`;
- bloqueio HTTP final confirmado (`httpBlocked=true`).

Conclusão: a janela V5 está encerrada e não deve ser reutilizada. A produção continua com IA documental desligada. O runtime V6 congelado permanece `76bfefa17bae0729090277525186bdc7dcfc0068` e o Pages congelado permanece `https://27a15b34.portal-regulacao-central-staging.pages.dev`.

**Próxima ação exata:** atualizar os scripts locais para a versão atual da `main` e executar o verificador somente leitura V6. Somente após `PRECONDICOES_5E_OK` abrir uma nova janela 5E com identificador/prazo novos.

## Janela V6 preparada — 19/09/2026

O operador executou o readiness V6 e o preparo oficial da homologação 5E. As pré-condições foram aprovadas antes de qualquer ativação real:

- `PRECONDICOES_5E_OK`;
- produção ativa `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- binding Workers AI presente;
- somente modelos gratuitos permitidos;
- capability `extract` presente;
- nenhuma outra janela controlada ativa;
- source ref congelado `76bfefa17bae0729090277525186bdc7dcfc0068`;
- Pages congelado `https://27a15b34.portal-regulacao-central-staging.pages.dev`.

Depois da confirmação humana `PREPARAR HOMOLOGACAO 5E`, o procedimento concluiu 8/8 etapas e retornou:

- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `a8665b05-004d-41d7-b7d4-5ed73a9a7146`;
- controle novo `phase5e_fcbad5b5cfcf4de78064a73f4097dcd7`;
- expiração `2026-09-19T10:14:08.000Z`;
- release V6 `76bfefa17bae0729090277525186bdc7dcfc0068`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu na versão reconfirmada acima.

Nenhum documento real de paciente deve ser usado nesta janela. O laboratório permanece restrito a fixtures sintéticos. A escrita no Google Drive continua bloqueada.

**Próxima ação exata:** abrir o Pages congelado em `/homologacao-5e/`, autenticar com a conta previamente autorizada e executar a matriz sintética V6 uma única vez. Ao final, copiar somente o **resumo seguro** do laboratório e retornar o resultado para avaliação. Não copiar respostas detalhadas, credenciais ou conteúdo das páginas.

## Refinamento V7 de baixa latência iniciado — 19/09/2026

O operador executou a matriz V6 e forneceu evidência visual de conclusão, porém não colou o resumo seguro numérico. Portanto, **não registrar 10/10 nem duração exata sem evidência textual**. A decisão operacional confirmada pelo operador é suficiente: a latência continua alta e o novo requisito é tornar a extração **pelo menos 2x mais rápida**.

Foi feita pesquisa técnica atualizada na documentação oficial do Cloudflare Workers AI. Estratégia escolhida:

- fast path visual opt-in com `@cf/moondream/moondream3.1-9B-A2B`;
- Moondream é um modelo de visão 9B/2B ativos, direcionado a OCR e saída estruturada; a Cloudflare publica p50 aproximado de 770 ms para `query` em imagem simples e cita extração de campos de documento como caso de uso;
- no fast path, `reasoning=false` e a inferência continua síncrona com `rejectIfBusy=true`;
- Gemma 4 permanece fallback e modelo principal do chat textual;
- Qwen 3.8 permanece fallback final/revisor focal;
- se Moondream já retornar `ilegivel` de forma estruturalmente válida, a V7 não executa automaticamente uma segunda inferência Qwen; o revisor continua obrigatório para a inconsistência suspeita `cid=nao_consta` + `descricao_cid=encontrado`;
- concorrência de seis páginas permanece;
- produção recebe configuração explícita `DOCUMENTS_AI_FAST_VISION_ENABLED=false`; o fast path só pode ser ligado pelo preview controlado da 5E.

Alternativas descartadas nesta rodada:
- **Batch API assíncrona:** adiciona fila/polling e é indicada pela Cloudflare para workloads duráveis, não para menor latência interativa;
- **Markdown Conversion como OCR principal:** em imagens adiciona detecção de objetos e depois Gemma 4, portanto não elimina o gargalo visual;
- **reduzir resolução agora:** adiado para não desfazer o ganho de precisão da V6 no caso ilegível;
- **modelo pago/AI Gateway:** proibidos pelo requisito R$0.

Critério de aceite V7:
1. mesma matriz sintética 5E em 10/10;
2. `duracao_extracao_ms` <= 50% da V6 na mesma máquina/rede;
3. nenhum modelo pago e nenhuma escrita Drive;
4. encerramento fail-closed.

Se o ganho real ficar abaixo de 2x, a segunda estratégia já definida é um caminho híbrido: usar primeiro `PDF.js getTextContent()` localmente em PDFs digitais e recorrer à visão somente em páginas escaneadas/ambíguas. Esse passo não foi implementado ainda porque o Moondream pode resolver o gargalo com mudança menor e reversível.

Implementação isolada em andamento na branch `feat/titon-v7-low-latency-vision`. Documento técnico: `docs/CENTRAL-DOCUMENTOS-IA-LATENCIA-V7.md`.

A janela V6 existente não foi modificada por este desenvolvimento. Ela continua vinculada ao runtime V6 e deve ser encerrada fail-closed antes de qualquer janela V7; não reutilizar seu controle para o novo runtime.

## V7 de baixa latência integrada e reteste congelado — 19/09/2026

A PR **#280** foi integrada à `main` pelo merge `cfda5b47d2eafe5dac90685952a3c9429a7dda9f` depois de os checks do head funcional ficarem verdes, incluindo Fases 1–5E, procedimentos 5E, staging, governança, site e gate de deploy seguro.

O Pages imutável congelado para a próxima homologação é `https://a09f45c7.portal-regulacao-central-staging.pages.dev`, publicado a partir do head `31b11a0e145d1b41b54aed98b53a9aa6fb474da9`. A comparação GitHub entre esse head e o merge `cfda5b47d2eafe5dac90685952a3c9429a7dda9f` retornou **zero arquivos diferentes**; o merge apenas acrescenta o commit de integração e preserva a mesma árvore funcional. Assim, runtime e laboratório congelados correspondem ao mesmo conteúdo V7.

Entregas integradas:
- fast path visual opt-in com `@cf/moondream/moondream3.1-9B-A2B`;
- contrato nativo `task=query`, `reasoning=false` e `rejectIfBusy=true`;
- Gemma 4 mantido como fallback visual e modelo de chat textual;
- Qwen 3.8 mantido como fallback final/revisor focal;
- fast path não pode ser usado como modelo textual;
- quando Moondream já retorna `ilegivel` de forma estruturalmente válida, a página termina sem segunda inferência Qwen;
- a inconsistência `cid=nao_consta` + `descricao_cid=encontrado` continua acionando revisão focal;
- concorrência de seis páginas preservada;
- resumo seguro passa a contar páginas processadas por Moondream;
- produção mantém `DOCUMENTS_AI_FAST_VISION_ENABLED=false`, além de `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`.

Critério de aceite do próximo reteste: **10/10 e `duracao_extracao_ms` V7 <= 50% da V6** em comparação operacional equivalente. Não inventar o baseline numérico da V6: o operador forneceu captura visual, mas não o resumo seguro textual.

A janela V6 aberta anteriormente **não foi alterada** pelo desenvolvimento V7. Ela deve ser encerrada fail-closed antes de qualquer preparo V7. O verificador/readiness já foi atualizado para bloquear a nova abertura enquanto existir outra janela controlada ativa.

**Próxima ação exata:** quando o operador retornar, baixar os scripts atuais da `main` e executar primeiro `node .\encerrar-homologacao-5e.mjs --encerrar` para fechar a janela V6. Depois executar `node .\iniciar-homologacao-5e.mjs --iniciar`; o readiness deve mostrar source `cfda5b47d2eafe5dac90685952a3c9429a7dda9f` e Pages `https://a09f45c7.portal-regulacao-central-staging.pages.dev`. Somente então confirmar o preparo V7 e executar a matriz uma única vez.

## Revisão V7 — correção de contrato Moondream antes do reteste — 19/09/2026

Durante revisão técnica da V7 já integrada, a documentação oficial do Moondream 3.1 revelou um detalhe que não deve ser deixado para o operador descobrir na homologação: na tarefa `query`, o parâmetro `stream` tem padrão **true**. O Titon precisa da resposta completa para validar JSON/schema antes de aceitar uma extração.

Correção preparada em branch isolada:
- `stream=false` explícito no fast path Moondream;
- teste de regressão confirma que o input enviado ao provider permanece não-streaming;
- parser aceita um único objeto JSON válido mesmo quando o VLM o envolve em uma frase curta, evitando fallback caro por mero invólucro textual;
- o schema estrito continua validando pageType, campos, estados e proveniência logo depois;
- nenhuma configuração produtiva é ativada e a janela V6 atual não é tocada.

Decisão: **não abrir a homologação com o runtime V7 congelado anteriormente**. Primeiro integrar esta correção e renovar source ref + Pages imutável. Isso evita gastar uma nova janela em um contrato conhecido como potencialmente incompatível.

## V7 stream-safe integrada e referências renovadas — 19/09/2026

A PR #282 foi integrada pelo merge `8faf51af286eb631077645ee84bc34170c8d45a2`.

Correções confirmadas:
- Moondream `query` agora envia `stream=false` explicitamente, compatível com o parser JSON completo do Titon;
- respostas com um único JSON válido envolvido por texto curto não acionam fallback desnecessário; o mesmo schema estrito continua obrigatório;
- o resumo seguro da homologação agora separa `provider_ms` de `overhead_ms` e registra quantidade de tentativas por página, permitindo localizar gargalo sem conteúdo clínico;
- 23 checks do head da PR #282 passaram, incluindo Fases 1–5E, procedimentos 5E, staging, governança e site.

Referências congeladas renovadas:
- source ref: `8faf51af286eb631077645ee84bc34170c8d45a2`;
- Pages: `https://b8dd14db.portal-regulacao-central-staging.pages.dev`.

O Pages foi publicado em `d8b41104240903edaeda0a4a29e63d82cb8bf099`; a comparação até o merge mostra apenas o arquivo de teste do harness alterado depois disso, sem diferença funcional no laboratório servido.

A revisão arquitetural também confirmou o plano de contingência: se o V7 não atingir 2x, o próximo caminho é usar `PDFPageProxy.getTextContent()` do PDF.js para páginas digitais e reservar visão para páginas escaneadas/ambíguas. Esse caminho ainda não foi ativado, pois primeiro precisamos medir o fast path corrigido.

A janela V6 continua a última janela aberta e precisa ser encerrada fail-closed pelo operador quando ele voltar ao computador. Não preparar V7 antes disso.

**Próxima ação exata:** encerrar V6; atualizar scripts locais da main; executar readiness V7 e confirmar exatamente source `8faf51af...` + Pages `b8dd14db...`; preparar nova janela e rodar a matriz uma única vez.

## Revisão final de estratégia V7 — 19/09/2026

A revisão adicional concluiu que o melhor próximo passo é **medir o V7 stream-safe já congelado antes de adicionar outra otimização**.

Evidências técnicas:
- contrato Moondream revisado e corrigido (`stream=false`, `reasoning=false`, `task=query`);
- `rejectIfBusy=true` está conforme a API atual do Workers AI;
- concorrência 6 está muito abaixo do limite padrão de Image-to-Text (720 req/min), portanto não há motivo documental para reduzi-la preventivamente;
- Workers Free permanece com 10.000 Neurons/dia e falha ao exceder; Moondream não está na lista atual de modelos que exigem Workers Paid;
- Batch API e Markdown Conversion não melhoram o caminho interativo de imagem;
- prompt caching/Smart Placement não têm benefício comprovado para este caso e não serão adicionados especulativamente.

O laboratório já informa `provider_ms`, `overhead_ms`, número de tentativas e modelo por página. Esses dados determinam a próxima otimização:
- provider lento + 1 tentativa: avaliar prompt/modelo;
- muitas tentativas: tratar fallback/capacidade;
- overhead alto: otimizar render/compressão/transporte;
- V7 correto porém ainda <2x: iniciar V8 híbrida com text-layer PDF.js + visão seletiva, mantendo autorização backend.

**Decisão de governança:** não empilhar mudança de resolução, prompt, modelo ou text-layer antes desta medição. O próximo passo continua sendo a homologação V7 stream-safe após o encerramento fail-closed da janela V6.

## Revisão arquitetural adicional — veredito V7/V8 — 19/09/2026

Nova revisão do código atual, do pipeline PDF.js, do provider e da documentação oficial Cloudflare confirmou:

- a V7 stream-safe continua sendo o **melhor próximo experimento**; não há evidência suficiente para substituí-la antes da medição;
- a documentação oficial atual do Moondream registra `stream=false` como default para `query`; o runtime mantém `stream=false` explícito para congelar o contrato e receber a resposta completa e validável;
- Moondream permanece o melhor fast path entre os modelos avaliados para este caso por ser Image-to-Text dedicado a OCR/structured output; Gemma/Qwen permanecem como fallback/revisão;
- seis requisições concorrentes estão muito abaixo do limite atual de Image-to-Text (720 req/min);
- a arquitetura de longo prazo, caso V7 não entregue 2x, deve ser híbrida por página com `PDFPageProxy.getTextContent()` + roteamento para visão somente quando necessário;
- `env.AI.toMarkdown()` foi reavaliado: embora PDF use StructTree/texto e normalmente não precise de visão, o contrato público consultado retorna uma saída única do documento e não garante a proveniência por página que a Central exige; portanto não substitui o caminho PDF.js;
- não usar requests hedged, Batch API, Gateway pago, redução de resolução ou OCR local antes de observar as métricas V7.

**Decisão:** manter o próximo passo já congelado. Depois do teste, decidir com dados: provider lento -> modelo/prompt; fallback frequente -> capacidade/contrato; overhead alto -> render/compressão; V7 correta porém <2x -> V8 híbrida text-layer + visão seletiva.

## Última revisão técnica antes do reteste V7 — 19/09/2026

A revisão final encontrou apenas um ajuste material antes da próxima homologação: a decomposição de latência do laboratório não contabilizava a conversão canvas → Blob dentro da métrica por página. Isso não alterava a duração total, mas poderia levar a uma conclusão errada sobre o gargalo.

Correção preparada:
- tempo por página agora começa antes da preparação da imagem;
- resumo seguro separa `preparo_ms`, `provider_ms` e `transporte_backend_ms`;
- registra também `tentativas`, `revisado` e a cadeia técnica `modelos`;
- nenhuma dessas propriedades contém conteúdo documental ou identidade;
- a documentação foi conferida contra a página oficial atual do Moondream: `stream=false` é o default, e o Titon mantém `stream=false` explicitamente para congelar o contrato.

**Veredito:** não foi encontrado motivo técnico para alterar modelo, concorrência, resolução ou fallback antes da medição. A estrutura V7 permanece a melhor condição para o próximo teste. Se a meta de 2x falhar, o caminho seguinte continua sendo V8 híbrida com text-layer PDF.js + visão seletiva.

## Congelamento final V7 após última revisão — 19/09/2026

A PR #286 foi integrada na `main` pelo merge `28a4916840f450b2caa7d93138d0e127a5db1a88` com **23 checks verdes** no head funcional, incluindo Fases 1–5E, procedimentos 5E, staging, governança e site.

Essa última unidade não alterou o provider V7, modelo, concorrência, resolução ou fallback. Ela corrigiu somente a qualidade da medição:
- `pagina_ms` começa antes da preparação da imagem;
- `preparo_ms` mede canvas → Blob;
- `provider_ms` soma as tentativas do Worker;
- `transporte_backend_ms` isola requisição/backend fora do provider;
- `tentativas`, `revisado` e `modelos` tornam fallback/revisão identificáveis sem conteúdo documental.

Referências finais do próximo reteste:
- source ref `28a4916840f450b2caa7d93138d0e127a5db1a88`;
- Pages `https://0c46e41f.portal-regulacao-central-staging.pages.dev`;
- head do Pages `341b13d77fcacc7cb0b48ecfacf8eaf19aa545be`.

A comparação GitHub entre o head do Pages e o merge final mostrou **zero arquivos diferentes**, portanto ambos representam a mesma árvore V7.

Revisão final de arquitetura: não foi encontrado motivo para alterar Moondream, concorrência 6, PNG 1800 ou a cadeia de fallback antes da medição. O próximo passo deve permanecer comparável. Se a V7 não alcançar 2x, a frente seguinte será V8 híbrida com PDF.js text-layer + visão seletiva.

A janela V6 continua sendo a janela controlada anterior e deve ser encerrada fail-closed antes de preparar V7.

**Próxima ação exata quando o operador voltar ao computador:** baixar os scripts atuais da `main`, encerrar V6, executar `iniciar-homologacao-5e.mjs --iniciar`, conferir source `28a4916840f450b2caa7d93138d0e127a5db1a88` + Pages `https://0c46e41f.portal-regulacao-central-staging.pages.dev`, preparar nova janela e executar a matriz uma única vez.

## Janela V6 encerrada fail-closed — 19/09/2026

O operador executou o procedimento oficial de encerramento da janela V6. Evidências sanitizadas:

- `JANELA_5E_ENCERRADA`;
- controle `phase5e_fcbad5b5cfcf4de78064a73f4097dcd7`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `220155fd-478f-4171-a658-16e73a484c4c`;
- release encerrado `76bfefa17bae0729090277525186bdc7dcfc0068`;
- `httpBlocked=true`.

Conclusão: a janela V6 está encerrada e não deve ser reutilizada. O bloqueio para abrir a V7 foi removido de forma fail-closed.

**Próxima ação exata:** executar o readiness/início V7 com os scripts atuais já baixados. O readiness deve retornar source `28a4916840f450b2caa7d93138d0e127a5db1a88` e Pages `https://0c46e41f.portal-regulacao-central-staging.pages.dev`. Somente após isso confirmar `PREPARAR HOMOLOGACAO 5E`.

## Janela V7 final preparada — 19/09/2026

O operador concluiu o preparo oficial da janela V7 final.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `c281181c-8498-49fe-acf1-244c4f6ca400`;
- controle `phase5e_e43ea9c37bce46d8a598bbdf3fe3371c`;
- expiração `2026-09-20T01:30:18.000Z`;
- release `28a4916840f450b2caa7d93138d0e127a5db1a88`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção reconfirmada em `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A release corresponde exatamente ao runtime V7 final congelado. A escrita no Google Drive permanece bloqueada e produção não foi promovida.

**Próxima ação exata:** abrir o laboratório V7 em `https://0c46e41f.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta previamente autorizada, executar a matriz **uma única vez** e copiar somente o resumo seguro completo. Esse resumo deve conter `duracao_extracao_ms`, `preparo_ms`, `provider_ms`, `transporte_backend_ms`, `tentativas`, `revisado` e `modelos` por página.

## V7 executada — precisão visualmente concluída; latência ainda insatisfatória — 19/09/2026

O operador executou a matriz V7 final e forneceu captura de tela do laboratório com resultados concluídos. A percepção operacional permanece: **a extração ainda está lenta demais para o uso desejado**.

Importante: a captura visual não substitui o resumo seguro numérico. Não registrar ainda 10/10, duração, distribuição por modelo ou gargalo dominante sem o texto copiado pelo botão **Copiar resumo seguro**.

A V7 final já mede por página:
- `pagina_ms`;
- `preparo_ms`;
- `provider_ms`;
- `transporte_backend_ms`;
- `tentativas`;
- `revisado`;
- `modelos`.

**Próxima ação exata:** obter o resumo seguro desta execução, sem repetir a matriz. A partir dele:
- provider dominante → otimizar modelo/prompt/fallback;
- preparo dominante → reduzir custo de renderização/serialização;
- transporte/backend dominante → otimizar payload/rota;
- V7 correta porém ainda <2x → iniciar V8 híbrida com PDF.js text-layer para páginas digitais e visão seletiva para páginas escaneadas/ambíguas.

Não executar a matriz novamente só para obter o resumo; usar o botão de cópia da execução já concluída.

## Resultado real V7 — 10/10, porém 21,4 s; V7B em correção focada — 19/09/2026

O operador forneceu o resumo seguro completo da execução V7 final:

- `MATRIZ_5E_SINTETICA=APROVADA`;
- **10 aprovados / 0 falhas**;
- `duracao_extracao_ms=21428`;
- `duracao_total_ms=56706`;
- `moondream_paginas=0`;
- `gemma_paginas=5`;
- `qwen_paginas=1`.

Diagnóstico objetivo:
- Moondream foi tentado nas 6 páginas, mas nenhuma resposta dele chegou como resultado final aceito;
- páginas 1–5 usaram Moondream → Gemma;
- página 6 usou Moondream → Gemma → Qwen e revisão;
- `preparo_ms` foi irrelevante (28–95 ms);
- `transporte_backend_ms` ficou quase fixo em ~7,8–8,2 s por página;
- `provider_ms` variou de ~3,1 s a ~13,2 s.

Conclusão: existem **dois gargalos**, não um:
1. o fast path Moondream está falhando estruturalmente e forçando fallback em todas as páginas;
2. o wrapper/auth de homologação adiciona aproximadamente 8 s fora do provider por requisição.

A revisão de código encontrou múltiplos round-trips D1 redundantes no preview 5E: controle no preflight, controle antes da sessão, decoração completa do Portal, releitura de controle e segunda validação no router documental. Isso explica o padrão quase constante do overhead e é consistente com a latência de acesso D1 entre regiões.

V7B preparada em branch isolada:
- preflight sem D1 + cache CORS 600 s;
- validação de sessão específica da Central, sem decorar Telemedicina/Conselho/funções alheias;
- sessão pré-validada encaminhada ao router documental;
- uma única leitura do controle imediatamente antes da rota;
- prompt Moondream compacto e específico para JSON estruturado;
- resumo seguro passa a mostrar códigos técnicos de resultado das tentativas.

Nenhuma alteração foi aplicada à janela V7 ativa nem à produção. O próximo reteste exigirá encerramento fail-closed da janela atual, integração/CI da V7B e referências novas.

## V7B integrada e reteste congelado — 19/09/2026

A PR #291 foi integrada na `main` pelo merge `5e27d58a09751363392b1ee1c7560be3f5f473cc` depois de os checks direcionados da Central ficarem verdes, incluindo Fases 1–5E, procedimentos 5E, staging, governança e site.

O Pages imutável congelado é `https://18727b6f.portal-regulacao-central-staging.pages.dev`, publicado no head `5fecf9350295140ddb9f74003375fe52b8fc53da`. A comparação GitHub entre esse head e o merge final mostrou **zero arquivos diferentes**.

Mudanças V7B:
- preflight 5E sem consulta D1 e com `Access-Control-Max-Age=600`;
- uma única leitura do controle revogável por chamada autenticada, imediatamente antes da rota;
- validação de sessão específica para a Central de Documentos;
- sessão pré-validada encaminhada ao router, evitando segunda autenticação;
- prompt compacto específico para Moondream;
- resumo seguro inclui códigos técnicos `resultados=` de cada tentativa.

Objetivo do próximo reteste: manter **10/10** e reduzir os dois gargalos medidos na V7: ~8 s de overhead fora do provider e fallback Moondream→Gemma em todas as páginas.

A janela V7 atualmente ativa continua vinculada ao release anterior e deve ser encerrada fail-closed antes de preparar V7B.

**Próxima ação exata:** encerrar a janela V7 atual; atualizar scripts locais; executar readiness V7B e confirmar source `5e27d58a09751363392b1ee1c7560be3f5f473cc` + Pages `https://18727b6f.portal-regulacao-central-staging.pages.dev`; preparar nova janela e executar a matriz uma única vez.

## Janela V7 encerrada fail-closed — 20/09/2026

O operador concluiu o encerramento oficial da janela V7 após a matriz 10/10.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_e43ea9c37bce46d8a598bbdf3fe3371c`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `af1d06d6-6d76-47af-8c07-983c6b8c9494`;
- release encerrado `28a4916840f450b2caa7d93138d0e127a5db1a88`;
- `httpBlocked=true`.

Conclusão: a janela V7 está encerrada e não deve ser reutilizada. O bloqueio para abrir a V7B foi removido de forma fail-closed.

**Próxima ação exata:** atualizar os scripts locais para a `main` atual e executar `iniciar-homologacao-5e.mjs --iniciar`. O readiness V7B deve retornar source `5e27d58a09751363392b1ee1c7560be3f5f473cc` e Pages `https://18727b6f.portal-regulacao-central-staging.pages.dev`. Somente então confirmar `PREPARAR HOMOLOGACAO 5E`.

## Preparo V7B interrompido com segurança em 6/8 — diagnóstico e correção — 20/09/2026

O operador iniciou a abertura da V7B com readiness correto:
- `PRECONDICOES_5E_OK`;
- produção `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- nenhuma janela controlada ativa;
- source `5e27d58a09751363392b1ee1c7560be3f5f473cc`;
- Pages `https://18727b6f.portal-regulacao-central-staging.pages.dev`.

O procedimento avançou até **6/8 — Confirmando bloqueio antes de ativar controle** e interrompeu com:
- `NAO_REPETIR_SEM_CONFERIR_PREVIEW=true`;
- `OPERACAO_INTERROMPIDA=HTTP_5E_STATUS_DIVERGENTE`.

A etapa 7/8 **não foi alcançada**, portanto o controle novo nunca foi deliberadamente ativado pelo procedimento. O handler de erro executa desativação best-effort quando o controle foi criado e mantém o marcador local `upload-5e-incerto.json` justamente para impedir repetição cega.

### Causa encontrada

A otimização V7B alterou a ordem do wrapper 5E no caminho de leitura:
- antes, `GET /api/documents/ai/config` consultava o controle antes da sessão;
- com controle desabilitado, o probe de preparo recebia **403**;
- depois da ativação, o mesmo GET sem sessão recebia **401**.

Na V7B otimizada, a sessão passou a ser validada antes do controle também para a rota de leitura. Assim, com o controle ainda desabilitado, o probe retornou **401**, embora o estado continuasse fail-closed. O preparador corretamente rejeitou a divergência porque sua prova operacional exige 403 antes da ativação.

### Correção preparada

Branch isolada `fix/titon-v7b-prep-probe-recovery`:
- restaura a semântica **403 antes / 401 depois** apenas nas rotas de leitura usadas pelo probe;
- preserva o caminho quente de IA otimizado: sessão → uma única leitura do controle → provider;
- preflight continua sem D1 e cacheável;
- adiciona teste explícito para a prova 403/401;
- adiciona `recuperar-preparo-5e.mjs`, que nunca habilita controle, nunca faz upload/deploy e só limpa o marcador local depois de:
  - desabilitar idempotentemente o controle;
  - confirmar `enabled=0` no D1;
  - localizar exatamente uma versão preview recente com alias/tag/release/controlId correspondentes;
  - confirmar IA/free-only, Drive false, D1/AI bindings e que a versão não é produção;
- o preparador passa a imprimir `proxima_acao=RECUPERAR_PREPARO_5E` quando um upload já ocorreu e a preparação falha.

**Não apagar manualmente o marcador e não repetir `iniciar-homologacao-5e.mjs` antes da recuperação.**

**Próxima ação exata:** concluir CI e integrar a correção; congelar novo source/Pages; então, no Windows do operador, baixar e executar `recuperar-preparo-5e.mjs --recuperar`. Somente após `PREPARO_5E_RECUPERADO` atualizar os scripts/readiness e abrir uma nova janela V7B.

## V7B probe-fixed integrada e congelada — 20/09/2026

A PR #294 foi integrada na `main` pelo merge `09bf379f306579bcb7ca049ad02d4c6a94c1df67`.

O head funcional `1f5f4b9baf3179afe195880e2c08568ee7e311a7` passou os checks relevantes, incluindo Fases 1–5E, procedimentos 5E, staging, governança e site. O Pages imutável é `https://20627e1a.portal-regulacao-central-staging.pages.dev`. A comparação GitHub entre esse head e o merge final mostrou **zero arquivos diferentes**.

Correções da PR #294:
- restaura a prova HTTP operacional **403 antes / 401 depois** apenas na rota de leitura usada pelo preparador;
- mantém preflight OPTIONS sem D1 e cacheável;
- preserva o caminho quente de IA otimizado, sem recolocar leituras redundantes;
- adiciona recuperador fail-closed `recuperar-preparo-5e.mjs`;
- o recuperador nunca habilita controle, nunca faz upload/deploy/promoção e só remove o marcador local depois de confirmar controle desligado e preview correspondente;
- o preparador passa a sinalizar `proxima_acao=RECUPERAR_PREPARO_5E` em falhas após upload.

Referências finais para o próximo reteste:
- source ref `09bf379f306579bcb7ca049ad02d4c6a94c1df67`;
- Pages `https://20627e1a.portal-regulacao-central-staging.pages.dev`;
- head funcional do Pages `1f5f4b9baf3179afe195880e2c08568ee7e311a7`.

Existe um marcador local `upload-5e-incerto.json` deixado deliberadamente pela tentativa interrompida. **Não apagar manualmente.**

**Próxima ação exata:** no Windows do operador, baixar `preparar-homologacao-5e.mjs` e `recuperar-preparo-5e.mjs` atuais da `main` e executar `node .\recuperar-preparo-5e.mjs --recuperar`. Somente após `PREPARO_5E_RECUPERADO` baixar/atualizar os quatro scripts operacionais, executar readiness e confirmar source `09bf379f306579bcb7ca049ad02d4c6a94c1df67` + Pages `https://20627e1a.portal-regulacao-central-staging.pages.dev`.

## Preparo V7B interrompido recuperado com sucesso — 20/09/2026

O operador executou o recuperador fail-closed oficial após a interrupção do preparo em 6/8.

Evidências sanitizadas:
- `PREPARO_5E_RECUPERADO`;
- `controlEnabled=false`;
- `driveWriteGate=false`;
- preview localizado `3fa566d5-75d4-47bb-b16f-70eef05e7ab1`;
- release recuperado `5e27d58a09751363392b1ee1c7560be3f5f473cc`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- `markerCleared=true`.

Conclusão: o preparo anterior foi reconciliado e encerrado sem ativar a janela. O marcador local que bloqueava repetição foi removido pelo procedimento oficial. A próxima tentativa deve usar as referências probe-fixed atuais, não o release recuperado anterior.

**Próxima ação exata:** atualizar os quatro scripts operacionais a partir da `main` e executar `iniciar-homologacao-5e.mjs --iniciar`. O readiness correto deve mostrar source `09bf379f306579bcb7ca049ad02d4c6a94c1df67` e Pages `https://20627e1a.portal-regulacao-central-staging.pages.dev`.

## Janela V7B probe-fixed preparada — 20/09/2026

O operador concluiu o preparo oficial da janela V7B probe-fixed.

Evidências sanitizadas:
- `PRECONDICOES_5E_OK`;
- nenhuma janela controlada ativa no readiness;
- source `09bf379f306579bcb7ca049ad02d4c6a94c1df67`;
- Pages `https://20627e1a.portal-regulacao-central-staging.pages.dev`;
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `3d166f16-9a3b-4a30-b928-2e9162810637`;
- controle `phase5e_767dfb6c3d2f458a90d7914a7af8d66a`;
- expiração `2026-09-20T02:23:17.000Z`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A janela chegou a 8/8 com a semântica 403/401 restaurada. O próximo teste deve ser executado uma única vez e o resumo seguro deve ser copiado integralmente, com atenção especial a `resultados=`, `modelos=`, `transporte_backend_ms` e `provider_ms`.

**Próxima ação exata:** abrir `https://20627e1a.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz uma vez e copiar o resumo seguro completo.

## Resultado V7B — 10/10 e 17,154 s; V7C em desenvolvimento focado — 20/09/2026

Resumo seguro real da V7B:
- `MATRIZ_5E_SINTETICA=APROVADA`;
- **10 aprovados / 0 falhas**;
- `duracao_extracao_ms=17154`;
- `duracao_total_ms=33432`;
- `moondream_paginas=0`;
- `gemma_paginas=5`;
- `qwen_paginas=1`.

Ganho sobre V7: 21,428 s → 17,154 s na extração (~20%). O overhead fora do provider caiu de ~8 s para ~5 s por página, confirmando que a redução de round-trips D1 ajudou, mas ainda não é suficiente.

Causa exata do fallback Moondream nas seis páginas: `DOCUMENT_AI_PAGE_TYPE_INVALID`. A resposta chega parseável, porém o token `pageType` não é canônico.

V7C preparada em branch isolada `feat/titon-v7c-page-type-auth-latency`:
- normalização determinística de `pageType` pelo **shape exato** de `fields`, sem inferência semântica e sem alteração de valores;
- uma única consulta D1 `first-primary` para usuário + session version + capability documental + role adicional + controle revogável;
- assinatura do token verificada localmente antes da consulta;
- router continua recebendo usuário pré-validado;
- resumo seguro adiciona `tentativas_ms=` para medir cada provider individualmente.

A janela V7B atual não foi modificada por esse desenvolvimento. Produção continua com IA documental desligada.

**Próxima ação exata:** concluir CI/revisão V7C; se verde, integrar e congelar novo source/Pages. Depois encerrar a janela V7B atual fail-closed e abrir uma única rodada V7C.

## V7C integrada e reteste congelado — 20/09/2026

A PR #298 foi integrada na `main` pelo merge `d99a6642dc38b6d9a9bb27d2a7ba06f9335ffce7`.

O head funcional `985197e652b73a8a7f101da7f7394598d3aba6ce` passou os checks relevantes da Central e publicou o Pages imutável `https://82985cc2.portal-regulacao-central-staging.pages.dev`. A comparação GitHub entre esse head e o merge final mostrou **zero arquivos diferentes**.

Resultado que motivou a V7C:
- V7B: **10/10**;
- extração: **17,154 s**;
- total com chat: **33,432 s**;
- Moondream final: **0/6**;
- erro Moondream em todas as páginas: `DOCUMENT_AI_PAGE_TYPE_INVALID`;
- overhead fora do provider: ~4,8–5,0 s/página.

Mudanças V7C:
- `pageType` pode ser derivado pelo conjunto exato de chaves de `fields` quando o token retornado não é canônico;
- `fields={}` identifica somente `outro`;
- shapes diferentes continuam inválidos e acionam fallback;
- assinatura do token é verificada localmente;
- usuário + session version + capability documental + role adicional + controle 5E são validados em **uma única consulta D1 `first-primary`**;
- o controle continua sendo lido do primário para preservar revogação imediata;
- o resumo seguro inclui `tentativas_ms=`.

Referências congeladas:
- source ref `d99a6642dc38b6d9a9bb27d2a7ba06f9335ffce7`;
- Pages `https://82985cc2.portal-regulacao-central-staging.pages.dev`;
- head funcional `985197e652b73a8a7f101da7f7394598d3aba6ce`.

A janela V7B atualmente ativa não foi alterada por essa integração e deve ser encerrada fail-closed antes de preparar V7C.

**Próxima ação exata:** encerrar a janela V7B atual; atualizar scripts locais; executar readiness V7C e confirmar source `d99a6642dc38b6d9a9bb27d2a7ba06f9335ffce7` + Pages `https://82985cc2.portal-regulacao-central-staging.pages.dev`; preparar nova janela e executar a matriz uma única vez.

## Janela V7B encerrada fail-closed — 20/09/2026

O operador encerrou oficialmente a janela V7B após a matriz 10/10 e a análise de latência.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_767dfb6c3d2f458a90d7914a7af8d66a`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `9eb547ba-2f0f-4a11-ac00-161df592cec3`;
- release encerrado `09bf379f306579bcb7ca049ad02d4c6a94c1df67`;
- `httpBlocked=true`.

Conclusão: a janela V7B está encerrada e não deve ser reutilizada. O bloqueio para abrir a V7C foi removido de forma fail-closed.

**Próxima ação exata:** atualizar os quatro scripts operacionais a partir da `main` e executar `iniciar-homologacao-5e.mjs --iniciar`. O readiness correto deve mostrar source `d99a6642dc38b6d9a9bb27d2a7ba06f9335ffce7` e Pages `https://82985cc2.portal-regulacao-central-staging.pages.dev`. Somente então confirmar `PREPARAR HOMOLOGACAO 5E`.

## Janela V7C preparada — 20/09/2026

O operador concluiu o preparo oficial da janela V7C.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `4f385cc2-a023-43b9-9083-d45efd13dea3`;
- controle `phase5e_088289f2fcbd4052a832aef9650edefc`;
- expiração `2026-09-20T02:42:45.000Z`;
- release `d99a6642dc38b6d9a9bb27d2a7ba06f9335ffce7`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A janela corresponde exatamente ao runtime V7C congelado. Produção não foi promovida.

**Próxima ação exata:** abrir `https://82985cc2.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz **uma única vez** e copiar o resumo seguro completo. Conferir especialmente `moondream_paginas`, `tentativas`, `tentativas_ms`, `resultados`, `modelos`, `provider_ms` e `transporte_backend_ms`.

## Resultado V7C — 10/10 e 13,748 s; V7D Gemma direto preparada — 20/09/2026

Resumo seguro real da V7C:
- `MATRIZ_5E_SINTETICA=APROVADA`;
- **10 aprovados / 0 falhas**;
- `duracao_extracao_ms=13748`;
- `duracao_total_ms=17489`;
- `moondream_paginas=0`;
- `gemma_paginas=5`;
- `qwen_paginas=1`.

Ganho acumulado de extração:
- V7: 21,428 s;
- V7B: 17,154 s;
- V7C: 13,748 s.

O `transporte_backend_ms` caiu para ~0,63–0,88 s/página, portanto o overhead D1/backend deixou de ser o gargalo principal.

Moondream continuou falhando 6/6 com `DOCUMENT_AI_PAGE_TYPE_INVALID`, apesar do prompt compacto e da normalização estrutural. As durações individuais mostraram que a tentativa Moondream custa ~2,1–5,0 s e, na maioria das páginas, não é mais rápida que Gemma.

Decisão V7D:
- desligar `DOCUMENTS_AI_FAST_VISION_ENABLED` no preview;
- usar Gemma 4 diretamente como primeira tentativa visual;
- manter Qwen como fallback/revisor;
- registrar no resumo seguro `revisao_alterou=` somente com nomes de campos para descobrir se a revisão Qwen realmente muda a página 6.

Estimativa baseada na V7C: mantendo Qwen, a extração pode cair para ~8,7–9 s; não registrar como resultado até homologação.

A janela V7C atual permanece ativa e deve ser encerrada fail-closed antes de qualquer reteste V7D.

**Próxima ação exata:** concluir CI da V7D; integrar/congelar se verde; encerrar V7C; abrir uma única rodada V7D.

## V7D integrada e reteste congelado — 20/09/2026

A PR #302 foi integrada na `main` pelo merge `208639f021ca9d5f86a2df97a9bd8a5978e5224f`.

O head funcional `ffb5f9c485396378f6abc72bbadbe83c34e392ed` passou os checks relevantes da Central e publicou o Pages imutável `https://b5b3f33e.portal-regulacao-central-staging.pages.dev`. A comparação GitHub entre esse head e o merge final mostrou **zero arquivos diferentes**.

Resultado que motivou a V7D:
- V7C: **10/10**;
- extração: **13,748 s**;
- total com chat: **17,489 s**;
- Moondream final: **0/6**;
- overhead backend já reduzido para ~0,63–0,88 s/página;
- tentativa Moondream ainda custa ~2,1–5,0 s/página antes do Gemma.

Mudanças V7D:
- `DOCUMENTS_AI_FAST_VISION_ENABLED=false` no preview 5E;
- Gemma 4 vira primeira tentativa visual;
- Qwen permanece fallback/revisor;
- resumo seguro inclui `revisao_alterou=` apenas com chaves dos campos modificados pela revisão focal.

Estimativa baseada na V7C: mantendo a revisão Qwen, o gargalo da página 6 pode cair de ~13,7 s para ~8,7–9 s. Isso é somente estimativa até a homologação.

Referências congeladas:
- source ref `208639f021ca9d5f86a2df97a9bd8a5978e5224f`;
- Pages `https://b5b3f33e.portal-regulacao-central-staging.pages.dev`;
- head funcional `ffb5f9c485396378f6abc72bbadbe83c34e392ed`.

A janela V7C atualmente ativa não foi alterada por essa integração e deve ser encerrada fail-closed antes de preparar V7D.

**Próxima ação exata:** encerrar V7C; atualizar scripts locais; executar readiness V7D e confirmar source `208639f021ca9d5f86a2df97a9bd8a5978e5224f` + Pages `https://b5b3f33e.portal-regulacao-central-staging.pages.dev`; preparar nova janela e executar a matriz uma única vez.

## Janela V7C encerrada fail-closed — 20/09/2026

O operador encerrou oficialmente a janela V7C após a matriz 10/10 e a análise de latência.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_088289f2fcbd4052a832aef9650edefc`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `36cfeb25-2ed5-47b9-b2c8-15a01937bb46`;
- release encerrado `d99a6642dc38b6d9a9bb27d2a7ba06f9335ffce7`;
- `httpBlocked=true`.

Conclusão: a janela V7C está encerrada e não deve ser reutilizada. O bloqueio para abrir a V7D foi removido de forma fail-closed.

**Próxima ação exata:** atualizar os quatro scripts operacionais a partir da `main` e executar `iniciar-homologacao-5e.mjs --iniciar`. O readiness correto deve mostrar source `208639f021ca9d5f86a2df97a9bd8a5978e5224f` e Pages `https://b5b3f33e.portal-regulacao-central-staging.pages.dev`. Somente então confirmar `PREPARAR HOMOLOGACAO 5E`.

## Janela V7D preparada — 20/09/2026

O operador concluiu o preparo oficial da janela V7D.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `db442013-8c7a-4567-a708-8e62526f4f1e`;
- controle `phase5e_fa146f1c69b249cf8752337043ea5bee`;
- expiração `2026-09-20T03:12:40.000Z`;
- release `208639f021ca9d5f86a2df97a9bd8a5978e5224f`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A janela corresponde exatamente ao runtime V7D congelado. Produção não foi promovida.

**Próxima ação exata:** abrir `https://b5b3f33e.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz **uma única vez** e copiar o resumo seguro completo. Conferir especialmente `duracao_extracao_ms`, `tentativas`, `tentativas_ms`, `revisado`, `revisao_alterou`, `provider_ms` e `transporte_backend_ms`.

## Resultado V7D — 8/10 e 15,386 s; V7E em validação — 20/09/2026

Resumo seguro real da V7D:
- `MATRIZ_5E_SINTETICA=FALHOU`;
- **8 aprovados / 2 falhas**;
- `duracao_extracao_ms=15386`;
- `duracao_total_ms=18753`;
- página 6 divergiu em `titulo`;
- chat de CID ilegível falhou por depender da página 6;
- página 5 teve Gemma em `14818 ms`, dominando a extração;
- página 6 usou Gemma `5363 ms` + Qwen `2226 ms`;
- `revisao_alterou=nenhum`.

A V7D foi pior que a V7C (10/10 em 13,748 s), portanto **não é candidata a baseline**.

V7E preparada em branch isolada:
- Gemma continua direto;
- concorrência documental reduzida de 6 para 4;
- análise integrada limitada a 700 tokens;
- revisão focal limitada a 350 tokens;
- se uma página médica já exige revisão por CID/ilegibilidade, `titulo` é revisado na mesma chamada Qwen;
- backend D1 consolidado preservado;
- Moondream permanece desligado.

Critério: recuperar 10/10 e superar os 13,748 s da V7C. Se isso não acontecer, encerrar refinamentos V7.x e avançar para V8 híbrida.

A janela V7D atual não foi alterada por esse desenvolvimento. Produção continua com IA documental desligada.

**Próxima ação exata:** concluir CI/revisão V7E; integrar/congelar se verde; encerrar V7D fail-closed; executar uma única rodada V7E.

## V7E integrada e reteste congelado — 20/09/2026

A PR #306 foi integrada na `main` pelo merge `5fe6d24bb1b26b039a0221b0224201692cdf11ef`.

O head funcional `1f15869d7bb37d7a466433952f87377d60cb833c` passou os checks centrais da Central de Documentos e publicou o Pages imutável `https://ffdd1515.portal-regulacao-central-staging.pages.dev`. A comparação GitHub entre esse head e o merge final mostrou **zero arquivos diferentes**.

Resultado que motivou a V7E:
- V7D: **8/10**;
- extração: **15,386 s**;
- página 6 divergiu em `titulo`;
- chat de CID ilegível falhou por depender da página 6;
- página 5 teve Gemma em **14,818 s** numa única tentativa;
- Qwen revisou a página 6 mas `revisao_alterou=nenhum`;
- V7C continua sendo o baseline 10/10 mais rápido: **13,748 s**.

Mudanças V7E:
- Gemma direto preservado;
- concorrência documental reduzida de 6 para **4**;
- análise integrada limitada a **700 tokens**;
- revisão focal limitada a **350 tokens**;
- quando já existe revisão por CID/ilegibilidade, `titulo` entra na mesma chamada Qwen, sem inferência adicional;
- backend D1 consolidado preservado;
- Moondream permanece desligado.

Referências congeladas:
- source ref `5fe6d24bb1b26b039a0221b0224201692cdf11ef`;
- Pages `https://ffdd1515.portal-regulacao-central-staging.pages.dev`;
- head funcional `1f15869d7bb37d7a466433952f87377d60cb833c`.

Critério do próximo reteste: recuperar **10/10** e superar os **13,748 s** da V7C. Se V7E não cumprir os dois critérios, encerrar refinamentos V7.x e avançar para V8 híbrida PDF.js text-layer + visão seletiva.

A janela V7D atualmente ativa não foi alterada por essa integração e deve ser encerrada fail-closed antes de preparar V7E.

**Próxima ação exata:** encerrar V7D; atualizar scripts locais; executar readiness V7E e confirmar source `5fe6d24bb1b26b039a0221b0224201692cdf11ef` + Pages `https://ffdd1515.portal-regulacao-central-staging.pages.dev`; preparar nova janela e executar a matriz uma única vez.

## Janela V7D encerrada fail-closed — 20/09/2026

O operador encerrou oficialmente a janela V7D após a matriz 8/10 e a análise de regressão.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_fa146f1c69b249cf8752337043ea5bee`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `744d7bd8-fdd4-43e2-9ac4-ebc1acd025ad`;
- release encerrado `208639f021ca9d5f86a2df97a9bd8a5978e5224f`;
- `httpBlocked=true`.

Conclusão: a janela V7D está encerrada e não deve ser reutilizada. O bloqueio para abrir a V7E foi removido de forma fail-closed.

**Próxima ação exata:** atualizar os quatro scripts operacionais a partir da `main` e executar `iniciar-homologacao-5e.mjs --iniciar`. O readiness correto deve mostrar source `5fe6d24bb1b26b039a0221b0224201692cdf11ef` e Pages `https://ffdd1515.portal-regulacao-central-staging.pages.dev`. Somente então confirmar `PREPARAR HOMOLOGACAO 5E`.

## Janela V7E preparada — 20/09/2026

O operador concluiu o preparo oficial da janela V7E.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `b6a9e988-d93a-44d1-861d-e13ddb4ff637`;
- controle `phase5e_0c471718c5db4733974504c844088460`;
- expiração `2026-09-20T03:39:33.000Z`;
- release `5fe6d24bb1b26b039a0221b0224201692cdf11ef`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A janela corresponde exatamente ao runtime V7E congelado. Produção não foi promovida.

**Próxima ação exata:** abrir `https://ffdd1515.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz **uma única vez** e copiar o resumo seguro completo. Os critérios são simultâneos: **10/10** e `duracao_extracao_ms < 13748`. Conferir também `concorrencia_paginas=4`, `tentativas_ms`, `revisado` e `revisao_alterou`.

## Resultado V7E — 10/10 em 12,008 s; decisão de encerrar V7.x e iniciar V8 híbrida — 20/09/2026

Resumo seguro real da V7E:
- `MATRIZ_5E_SINTETICA=APROVADA`;
- **10 aprovados / 0 falhas**;
- `duracao_extracao_ms=12008`;
- `duracao_total_ms=15980`;
- `concorrencia_paginas=4`;
- Gemma final: 5 páginas;
- Qwen final: 1 página;
- backend fora do provider: ~0,26–0,55 s/página;
- página 6: Gemma 2,455 s + Qwen 3,225 s;
- `revisao_alterou=nenhum` na página 6.

Ganho acumulado:
- V7: 21,428 s;
- V7B: 17,154 s;
- V7C: 13,748 s;
- V7D: 15,386 s e 8/10 (regressão);
- V7E: **12,008 s e 10/10**.

A V7E é o melhor baseline image-only atual. O overhead de navegador/backend está suficientemente baixo; o tempo dominante é inferência visual Gemma/Qwen. Portanto, perseguir ~6 s apenas ajustando concorrência/tokens/modelos dentro da mesma arquitetura tem baixa previsibilidade e risco de nova regressão.

Nova meta solicitada pelo operador: tentar aproximadamente **metade dos 12,008 s (~6 s)**.

Decisão arquitetural:
- **encerrar refinamentos V7.x**;
- iniciar V8 híbrida por página;
- PDFs digitais com camada textual devem usar PDF.js `getTextContent()` antes de qualquer renderização de imagem;
- páginas sem text layer suficiente, escaneadas ou ambíguas continuam usando visão;
- manter autorização `extract` no backend, proveniência por página, sessão sem persistência e nenhuma telemetria de conteúdo;
- medir separadamente páginas resolvidas por texto e por visão.

Honestidade de meta:
- ~6 s é **plausível** para PDFs digitais ou mistos com boa text layer, porque várias páginas podem deixar de chamar Gemma;
- ~6 s **não é garantível** para PDFs 100% escaneados/imagem, pois a V7E já mostra ~4–6 s por página visual e a latência do provider não é controlável pelo Portal.

A janela V7E continua ativa apenas para encerramento formal posterior; não deve ser reutilizada para V8.

**Próxima ação exata:** desenvolver V8 em branch isolada com text-layer PDF.js + rota backend segura + fallback visual seletivo; validar testes e só depois encerrar V7E e abrir uma nova homologação V8.

## Exceção final V7F antes da V8 — 20/09/2026

Após registrar a decisão V8, a decomposição temporal da V7E mostrou uma oportunidade image-only mensurável que justifica **uma única última rodada V7.x** antes da mudança arquitetural.

Dados V7E usados:
- concorrência 4;
- primeira onda: páginas 1–4;
- página 3 concluiu em ~2,15 s e liberou página 5;
- página 1 liberou página 6 apenas em ~5,85 s;
- página 6 gastou Gemma 2,455 s + Qwen 3,225 s;
- Qwen retornou `revisao_alterou=nenhum`.

Simulação simples usando as durações observadas:
- mantendo concorrência 4 e removendo a revisão redundante da página 6, makespan estimado ~8,8 s;
- com concorrência 5 e sem essa revisão redundante, makespan estimado ~6,0 s **se as latências individuais se mantiverem próximas da V7E**.

Por isso a V7F é autorizada como **último experimento image-only**, com duas mudanças somente:
1. concorrência de páginas 4 → **5**;
2. quando Gemma retorna **somente CID=ilegivel**, descrição encontrada e nenhum outro campo ilegível, não chamar Qwen.

Qualquer outro caso ambíguo continua com revisão Qwen. O skip não se aplica a `cid=nao_consta` + descrição encontrada, nem a outros campos ilegíveis.

Critério V7F:
- manter **10/10**;
- buscar `duracao_extracao_ms <= 6500` como alvo operacional;
- se não atingir precisão total ou ficar materialmente acima dessa faixa, **encerrar V7.x sem nova variação** e iniciar V8 híbrida.

A decisão V8 permanece válida e pronta como fallback arquitetural. A V7F apenas testa uma hipótese de scheduling/revisão diretamente derivada dos dados V7E.

## V7F integrada e reteste congelado — 20/09/2026

A PR #311 foi integrada na `main` pelo merge `6e30117a1e0c342cb84d4cdf1f1a2f7351d86c82`.

O head funcional `1df84d2f53b8378d49854b285234ad4aefffcf20` publicou o Pages imutável `https://58d9fc14.portal-regulacao-central-staging.pages.dev`; a comparação GitHub com o merge final mostrou **zero arquivos diferentes**.

A V7F é o último experimento image-only autorizado antes da V8:
- concorrência documental 5;
- análise Gemma permanece com teto 700 tokens;
- backend D1 consolidado preservado;
- Qwen não é chamado somente quando Gemma retorna exatamente um único campo ilegível (`cid`), descrição do CID encontrada e nenhum outro campo ilegível;
- `cid=nao_consta` com descrição encontrada e outras ambiguidades continuam revisadas.

Base da hipótese:
- V7E 10/10 em 12,008 s;
- com as durações observadas, concorrência 5 + remoção da revisão Qwen no-op projeta makespan próximo de ~6,0 s se o provider mantiver latências semelhantes.

Referências congeladas:
- source ref `6e30117a1e0c342cb84d4cdf1f1a2f7351d86c82`;
- Pages `https://58d9fc14.portal-regulacao-central-staging.pages.dev`;
- head funcional `1df84d2f53b8378d49854b285234ad4aefffcf20`.

Critério:
- manter 10/10;
- alvo operacional <= 6,5 s;
- se não cumprir, não criar nova variação V7.x; iniciar V8 híbrida.

A janela V7E permanece ativa e deve ser encerrada fail-closed antes de preparar V7F.

**Próxima ação exata:** encerrar V7E; atualizar scripts locais; readiness V7F; preparar nova janela e executar a matriz uma única vez.

## Janela V7E encerrada fail-closed — 20/09/2026

O operador encerrou oficialmente a janela V7E após a matriz 10/10 e a definição da meta operacional ~6 s.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_0c471718c5db4733974504c844088460`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `ce3158b0-3cdc-48d1-800d-26863485794a`;
- release encerrado `5fe6d24bb1b26b039a0221b0224201692cdf11ef`;
- `httpBlocked=true`.

Conclusão: a janela V7E está encerrada e não deve ser reutilizada. O bloqueio para abrir a V7F foi removido de forma fail-closed.

**Próxima ação exata:** atualizar os quatro scripts operacionais a partir da `main` e executar `iniciar-homologacao-5e.mjs --iniciar`. O readiness correto deve mostrar source `6e30117a1e0c342cb84d4cdf1f1a2f7351d86c82` e Pages `https://58d9fc14.portal-regulacao-central-staging.pages.dev`. Somente então confirmar `PREPARAR HOMOLOGACAO 5E`.

## Janela V7F preparada — 20/09/2026

O operador concluiu o preparo oficial da janela V7F, último experimento image-only autorizado antes da V8.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `7208798a-9a7e-4464-bb99-705a83fd28cf`;
- controle `phase5e_6534697d4d83487fbb98effbd0d9f371`;
- expiração `2026-09-20T04:05:56.000Z`;
- release `6e30117a1e0c342cb84d4cdf1f1a2f7351d86c82`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A janela corresponde exatamente ao runtime V7F congelado. Produção não foi promovida.

**Próxima ação exata:** abrir `https://58d9fc14.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz **uma única vez** e copiar o resumo seguro completo. Critério: **10/10** e alvo operacional `duracao_extracao_ms <= 6500`. Se não cumprir, encerrar V7.x e iniciar V8 híbrida.

## Resultado V7F — 10/10 em 6,830 s; V7G final proposta — 20/09/2026

Resumo seguro real da V7F:
- `MATRIZ_5E_SINTETICA=APROVADA`;
- **10 aprovados / 0 falhas**;
- `duracao_extracao_ms=6830`;
- `duracao_total_ms=10215`;
- `concorrencia_paginas=5`;
- Gemma final: 6 páginas;
- Qwen final: 0 páginas;
- nenhuma revisão adicional;
- backend fora do provider ~0,25–0,60 s/página.

Tempos totais por página:
- p1 5,483 s;
- p2 4,234 s;
- p3 1,873 s;
- p4 4,989 s;
- p5 4,297 s;
- p6 4,957 s.

A V7F ficou apenas **330 ms acima** do alvo de 6,5 s. O makespan observado é explicado pela fila de concorrência 5: páginas 1–5 iniciam juntas, a página 3 libera o primeiro slot em ~1,873 s e só então a página 6 começa; 1,873 + 4,957 ≈ 6,830 s.

Isso revela uma última oportunidade estritamente de scheduling: concorrência **6**, sem alterar modelo, prompt, tokens, backend ou regras de precisão. Se as latências individuais permanecerem próximas da V7F, o limite observado seria aproximadamente o máximo das seis páginas, ~5,5 s. Há risco de contenção de provider, portanto esta deve ser a **última** rodada image-only.

V7G preparada em branch isolada:
- única mudança funcional: concorrência 5 → 6;
- Gemma 700 tokens preservado;
- skip Qwen seletivo da V7F preservado;
- backend D1 consolidado preservado;
- nenhuma outra alteração de prompt, modelo ou resolução.

Critério V7G:
- 10/10;
- idealmente <6,0 s e obrigatoriamente não regredir materialmente sobre 6,830 s;
- se houver outlier/queda de precisão, manter V7F como ápice image-only e iniciar V8 híbrida.

## V7G integrada e reteste congelado — 20/09/2026

A PR #315 foi integrada pelo merge `ba7d8a369940a9613a436b6b0f572bdedb99375f`. O Pages imutável `https://0e5a1474.portal-regulacao-central-staging.pages.dev` foi publicado no head funcional `0c5fc5b44bb885cd17179eaa4c0f836b9d494dc7`; a comparação GitHub mostrou zero arquivos diferentes entre esse head e o merge final.

A V7G altera somente concorrência 5 → 6. Gemma 700 tokens, backend D1 consolidado e o skip Qwen seletivo da V7F permanecem iguais.

Hipótese medida a partir da V7F: com seis páginas iniciando juntas, o makespan pode cair de 6,830 s para aproximadamente 5,5 s se as latências individuais não sofrerem contenção.

Referências congeladas:
- source ref `ba7d8a369940a9613a436b6b0f572bdedb99375f`;
- Pages `https://0e5a1474.portal-regulacao-central-staging.pages.dev`.

Critério final image-only:
- 10/10;
- idealmente <6,0 s;
- qualquer regressão de precisão ou outlier relevante encerra V7.x e mantém V7F como baseline, seguindo para V8 híbrida.

A janela V7F atual permanece ativa e deve ser encerrada fail-closed antes de preparar V7G.

**Próxima ação exata:** encerrar V7F; atualizar scripts locais; readiness V7G; preparar nova janela e executar uma única matriz.

## Janela V7F encerrada fail-closed — 20/09/2026

O operador encerrou oficialmente a janela V7F após a matriz 10/10 em 6,830 s.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_6534697d4d83487fbb98effbd0d9f371`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `d020c9a9-2180-4a58-abb1-58966ab01f07`;
- release encerrado `6e30117a1e0c342cb84d4cdf1f1a2f7351d86c82`;
- `httpBlocked=true`.

Conclusão: a janela V7F está encerrada e não deve ser reutilizada. O bloqueio para abrir a V7G foi removido de forma fail-closed.

**Próxima ação exata:** atualizar os quatro scripts operacionais a partir da `main` e executar `iniciar-homologacao-5e.mjs --iniciar`. O readiness correto deve mostrar source `ba7d8a369940a9613a436b6b0f572bdedb99375f` e Pages `https://0e5a1474.portal-regulacao-central-staging.pages.dev`. Somente então confirmar `PREPARAR HOMOLOGACAO 5E`.

## Janela V7G preparada — 20/09/2026

O operador concluiu o preparo oficial da janela V7G, teste final image-only.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `b4e44162-3e89-4a8f-95a0-1e4c3542a52f`;
- controle `phase5e_da3833884e1041eaaa92456590b8c86a`;
- expiração `2026-09-20T04:29:42.000Z`;
- release `ba7d8a369940a9613a436b6b0f572bdedb99375f`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A janela corresponde exatamente ao runtime V7G congelado. Produção não foi promovida.

**Próxima ação exata:** abrir `https://0e5a1474.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz **uma única vez** e copiar o resumo seguro completo. Critério final image-only: **10/10** e idealmente `duracao_extracao_ms < 6000`. Se houver regressão de precisão ou outlier relevante, manter V7F como baseline image-only e avançar para V8 híbrida.

## Resultado V7G — 10/10 em 7,202 s; V8A crop visual em validação — 20/09/2026

Resumo seguro real da V7G:
- `MATRIZ_5E_SINTETICA=APROVADA`;
- **10 aprovados / 0 falhas**;
- `duracao_extracao_ms=7202`;
- `duracao_total_ms=11381`;
- `concorrencia_paginas=6`;
- Gemma final: 6 páginas;
- Qwen final: 0 páginas.

A concorrência 6 regrediu sobre a V7F (6,830 s). As tentativas Gemma ficaram mais lentas em várias páginas, confirmando contenção/variabilidade do provider. **V7F permanece o melhor baseline image-only comprovado: 10/10 em 6,830 s.**

Não criar nova variação baseada apenas em concorrência/modelo/tokens.

### V8A — redução segura da área visual enviada

A primeira V8 mantém a imagem renderizada como fonte de verdade e volta à concorrência 5 da V7F.

Mudanças:
- detectar conteúdo relevante na imagem renderizada por blocos de pixels;
- recortar apenas margens/áreas predominantemente brancas antes do envio ao Gemma;
- preservar a resolução do texto dentro da área restante;
- usar a text layer **somente como limite de segurança do recorte**, nunca como fonte de valores;
- se a text layer indicar texto fora da área detectada por pixels, ampliar o crop para preservá-lo;
- se o crop economizar menos de 10% da área, enviar a página inteira;
- resumo seguro do laboratório passa a informar `imagem_area_pct`.

Motivo para não usar text layer diretamente como verdade documental: PDFs podem conter texto subjacente coberto, borrado ou redigido. Isso conflita com a distinção `encontrado` versus `ilegivel`. Portanto V8A reduz visual tokens sem permitir que texto oculto determine valores.

Critério V8A: manter 10/10 e produzir ganho material sobre 6,830 s. Se não houver ganho, manter V7F como baseline e avaliar OCR local sobre a imagem renderizada ou text layer apenas com validação visual explícita.

A janela V7G permanece ativa e deve ser encerrada fail-closed antes de homologar V8A.

## Janela V7G encerrada e V8A integrada/congelada — 20/09/2026

O operador encerrou oficialmente a janela V7G após a matriz 10/10 em 7,202 s.

Evidências sanitizadas do encerramento:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_da3833884e1041eaaa92456590b8c86a`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `463a5a76-5a92-4cc3-915f-549f2e1567a1`;
- release encerrado `ba7d8a369940a9613a436b6b0f572bdedb99375f`;
- `httpBlocked=true`.

Conclusão V7.x:
- V7G manteve 10/10, mas regrediu para 7,202 s;
- V7F permanece o melhor baseline image-only comprovado: **10/10 em 6,830 s**;
- refinamentos por concorrência/modelo/tokens estão encerrados.

A PR #319 integrou a V8A na `main` pelo merge `5268ed9984c6d792e1f3eb12e1d8f168d32d39a9` após **24 checks verdes** no head funcional `9b81e8a93b901b062761ff7b6574176bea60d2c5`.
O Pages imutável congelado é `https://09560ba9.portal-regulacao-central-staging.pages.dev`. A comparação GitHub entre o head funcional e o merge final mostrou **zero arquivos diferentes**.

V8A:
- concorrência volta para 5;
- imagem renderizada continua sendo a fonte de verdade;
- recorte automático remove somente margens/áreas predominantemente brancas;
- a text layer serve apenas como **limite de segurança do recorte**, nunca como fonte de valores;
- se o crop economizar menos de 10% da área, a página inteira é enviada;
- resumo seguro mede `imagem_area_pct` por página;
- Gemma 700 tokens, backend D1 consolidado e skip Qwen seletivo permanecem.

Referências congeladas do próximo reteste:
- source ref `5268ed9984c6d792e1f3eb12e1d8f168d32d39a9`;
- Pages `https://09560ba9.portal-regulacao-central-staging.pages.dev`;
- head funcional `9b81e8a93b901b062761ff7b6574176bea60d2c5`.

**Próxima ação exata:** atualizar scripts locais; executar readiness V8A; confirmar source `5268ed9984c6d792e1f3eb12e1d8f168d32d39a9` + Pages `https://09560ba9.portal-regulacao-central-staging.pages.dev`; preparar nova janela e executar a matriz uma única vez. Critério: 10/10 e ganho material sobre 6,830 s, observando `imagem_area_pct`.

## Janela V8A preparada — 20/09/2026

O operador concluiu o preparo oficial da janela V8A.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `fb0be219-dafa-466d-bc4e-88cd600093f5`;
- controle `phase5e_a074973e4760415081b04205fe3197ba`;
- expiração `2026-09-20T05:03:45.000Z`;
- release `5268ed9984c6d792e1f3eb12e1d8f168d32d39a9`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

A janela corresponde exatamente ao runtime V8A congelado. Produção não foi promovida.

**Próxima ação exata:** abrir `https://09560ba9.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada, executar a matriz **uma única vez** e copiar o resumo seguro completo. Critério V8A: manter **10/10** e obter ganho material sobre o baseline V7F de **6,830 s**. Analisar especialmente `imagem_area_pct`, `provider_ms`, `transporte_backend_ms` e `tentativas_ms`.

## Resultado V8A — 10/10 em 5,388 s; crop não foi a causa do ganho — 20/09/2026

Resumo seguro real:
- `MATRIZ_5E_SINTETICA=APROVADA`;
- **10 aprovados / 0 falhas**;
- `duracao_extracao_ms=5388`;
- `duracao_total_ms=9514`;
- `concorrencia_paginas=5`;
- Gemma final: 6 páginas;
- Qwen final: 0 páginas;
- `imagem_area_pct=100` em todas as 6 páginas.

Conclusão quantitativa:
- V7F baseline anterior: 6,830 s;
- V8A: 5,388 s;
- ganho observado: ~21,1%.

Porém, como `imagem_area_pct=100` em todas as páginas, o mecanismo de crop não reduziu a área enviada no laboratório. Portanto o ganho de 5,388 s **não pode ser atribuído ao crop**; ele é compatível com variação favorável de latência do provider.

Diagnóstico de limite atual:
- preparo local: 23–81 ms;
- transporte/backend: ~0,25–0,57 s/página;
- provider Gemma: ~1,25–4,78 s/página;
- gargalo dominante continua sendo inferência visual remota.

Decisão estratégica antes da próxima implementação:
1. não voltar a ajustar concorrência/modelo/tokens da linha V7;
2. não aceitar text layer como verdade documental, por risco de texto subjacente oculto/redigido;
3. avaliar V8B por **compactação visual sem descarte de conteúdo visível** (remoção/compactação de grandes faixas de espaço em branco, preservando os pixels de conteúdo);
4. manter V8A/V7F como baselines de rollback;
5. somente depois avaliar orçamento visual/resolução Gemma menor, se houver parâmetro suportado pela implementação Cloudflare e matriz comprovar 10/10.

Meta: reduzir estruturalmente a entrada visual sem trocar a fonte de verdade e sem criar novas inferências. Se a compactação não reduzir `imagem_area_pct`/tempo de forma material, considerar 5–6 s como teto prático do caminho visual remoto e avançar para arquitetura híbrida com validação visual explícita.

## V8B — medição de tokens antes de nova transformação visual — 20/09/2026

Após o resultado V8A (10/10 em 5,388 s, porém com `imagem_area_pct=100` em todas as páginas), a estratégia foi refinada com base no contrato atual do Workers AI e no código real da `main`.

A documentação oficial atual do Cloudflare para `@cf/google/gemma-4-26b-a4b-it` declara resposta síncrona com objeto `usage`, incluindo `prompt_tokens`, `completion_tokens` e `total_tokens`; a documentação de prompt caching também expõe `prompt_tokens_details.cached_tokens`. O provider do Titon já recebe esse payload de `env.AI.run()`, mas descartava essas contagens ao normalizar a resposta.

**Decisão:** antes de compactar faixas brancas, reduzir resolução ou alterar o protocolo de saída, medir o orçamento real de tokens do caminho visual atual. Isso separa três hipóteses que até agora estavam misturadas: custo de entrada visual/prompt, custo de geração do JSON e latência intrínseca do provider.

Branch isolada: `feat/central-docs-5e-v8b-token-metrics`.

Escopo desta subetapa:
- preservar modelo, prompt, imagem, resolução, concorrência 5, `max_completion_tokens=700`, revisão seletiva e regras de precisão exatamente como estão;
- propagar somente contagens técnicas de `usage` por tentativa: prompt, completion, total e cached prompt tokens;
- exibir as contagens no resumo seguro sintético por página e no agregado da extração;
- não registrar conteúdo de prompt, resposta, imagem, identidade clínica, nome de arquivo ou credenciais;
- nenhuma alteração de produção, gate, Drive, D1 ou permissões.

Ordem de decisão após a medição:
1. medir tokens em uma matriz real 10/10;
2. se `completion_tokens` forem relevantes, compactar primeiro o formato de saída sem perder estados/campos e medir novamente;
3. somente se o gargalo estiver principalmente no input visual, testar resolução/compactação visual;
4. deixar arquitetura híbrida text-layer + validação visual como etapa posterior, pois text layer não pode ser aceita como verdade documental sem confirmação visual.

Essa ordem substitui a ideia anterior de partir imediatamente para compactação visual V8B. V8A e V7F permanecem baselines de rollback.

## V8B integrada; referências congeladas para homologação — 20/09/2026

A PR **#323** foi integrada na `main` pelo merge `96ce5dec060c98c582a8925ae03bc25973b0f3bd`. Antes do merge, os **23 workflows/checks** associados ao head funcional `29d6eea3baf9e9a5d58164ffa901313fec9aa048` concluíram com sucesso, incluindo governança, Fases 1–5E, bundle de staging e procedimentos operacionais 5E. O workflow operacional 5E confirmou sintaxe, preparo, encerramento, contratos do laboratório sintético, capability/readiness e a garantia de não promover produção.

O Cloudflare Pages publicou para esse head funcional o preview imutável:
- `https://255ecf24.portal-regulacao-central-staging.pages.dev`.

A comparação GitHub entre o head funcional `29d6eea3...` e o merge final `96ce5dec...` mostrou **zero arquivos diferentes**. Portanto esse Pages imutável representa o conteúdo funcional integrado.

A instrumentação V8B altera somente telemetria técnica do laboratório:
- `prompt_tokens`;
- `completion_tokens`;
- `total_tokens`;
- `cached_prompt_tokens` quando o provider expuser esse detalhe.

Não houve mudança de prompt, imagem, resolução, modelo, concorrência, gates, Drive, D1, permissões ou produção.

**Estado operacional importante:** a última evidência persistente mostra a janela V8A preparada e usada, mas não registra seu encerramento fail-closed. Ela **não deve ser reutilizada** para V8B. Antes de abrir nova janela, executar o encerramento oficial no Windows do operador; se o ledger já estiver fechado/expirado, o procedimento deve reportar isso e o readiness seguinte confirmará `activeControlledWindow=false`.

Referências congeladas V8B:
- source ref: `96ce5dec060c98c582a8925ae03bc25973b0f3bd`;
- Pages: `https://255ecf24.portal-regulacao-central-staging.pages.dev`;
- head funcional: `29d6eea3baf9e9a5d58164ffa901313fec9aa048`.

**Próxima ação exata:** encerrar a janela V8A fail-closed; atualizar os scripts locais a partir da `main`; executar o readiness 5E e confirmar exatamente source/pages acima; então preparar uma nova janela V8B e rodar **uma única matriz**. A decisão de otimização só será tomada depois de observar as contagens reais de tokens.

## Janela V8A encerrada fail-closed — 20/09/2026

O operador encerrou oficialmente a janela V8A anterior antes da abertura da V8B diagnóstica.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_a074973e4760415081b04205fe3197ba`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `bd89b5ca-8c85-4b16-a80a-44563d183c6d`;
- release encerrado `5268ed9984c6d792e1f3eb12e1d8f168d32d39a9`;
- `httpBlocked=true`.

Conclusão: a janela V8A está encerrada e não deve ser reutilizada. A barreira operacional para o readiness da V8B foi removida de forma fail-closed. Produção permaneceu fora deste procedimento.

**Próxima ação exata:** atualizar os scripts locais a partir da `main` atual; executar `verificar-precondicoes-5e.mjs --verificar`; confirmar `activeControlledWindow=false`, source `96ce5dec060c98c582a8925ae03bc25973b0f3bd` e Pages `https://255ecf24.portal-regulacao-central-staging.pages.dev`. Somente depois preparar a nova janela V8B.

## Resultado V8B — 20/09/2026

A matriz V8B foi aprovada: 10/10, extração 6,179 s e total 10,160 s.

Métricas agregadas:
- prompt: 9.020 tokens;
- completion: 1.024 tokens;
- total: 10.044 tokens;
- prompt em cache: 2.048 tokens;
- área visual: 100% nas seis páginas.

Conclusão: V8B ficou entre V8A (5,388 s) e V7F (6,830 s), reforçando variabilidade relevante do provider. A página com saída mínima (11 completion tokens) foi muito mais rápida que as páginas autorizadas (~196–212 completion tokens), então o próximo experimento deve compactar a saída estruturada antes de alterar resolução ou imagem.

Próxima frente V8C: manter contrato público e regras atuais, usar formato interno JSON mais compacto e expandi-lo no backend, medir novamente completion tokens e latência. Cache de prompt permanece hipótese secundária.

## V8C implementada em branch isolada — aguardando CI — 20/09/2026

Branch: `feat/central-docs-5e-v8c-compact-output`.

Implementação:
- novo artefato versionado `PROMPT_ANALISE_REGULACAO_COMPACTA_V1`, derivado das mesmas regras de isolamento/literalidade da análise integrada atual;
- resposta interna compacta com `t=c|m|o` e, para páginas autorizadas, vetor ordenado de 8 pares `[s,v]`;
- estados internos `e/n/i` expandidos imediatamente no backend para `encontrado/nao_consta/ilegivel`;
- contrato público de classificação, extração, evidências e chat permanece inalterado;
- formato legado continua aceito somente como compatibilidade/fallback, sem ser solicitado ao modelo;
- provider passa a informar tecnicamente `responseFormat=compact|legacy`;
- laboratório 5E mede `formato_compacto_paginas`, `formato_legado_paginas` e `formato_resposta` por página;
- runtime público versionado como `phase5e-v8c-compact-output`;
- imagem, resolução, concorrência 5, Gemma/Qwen, `max_completion_tokens=700`, revisão seletiva, gates, Drive e produção não foram alterados.

Critério antes de homologar:
- testes do provider comprovarem expansão compacta para o mesmo schema público;
- prompts continuarem separados/versionados;
- checks da Central, governança e procedimentos 5E verdes;
- nenhuma promoção de produção.

Critério da matriz real V8C:
- 10/10;
- seis páginas em formato compacto e zero em legado;
- completion tokens agregados materialmente abaixo do baseline V8B de 1.024, alvo operacional <= 700;
- medir latência, mas não declarar ganho estrutural com base em uma única variação favorável do provider.

A janela V8B segue ativa apenas até o código V8C ser validado. Não reutilizar essa janela para V8C: após CI/merge/freeze, encerrar V8B fail-closed e só então abrir nova janela.

## V8C integrada e referências congeladas — 20/09/2026

A PR **#327** foi integrada na `main` pelo merge `cf8ed89cd2e5fa9ba7ed5c02d6f0cc1f50e2021e`.

Validação do head funcional `19c54c5609b8435b85a2e9ab8ea411149bbefcb8`:
- **23 workflows/checks verdes**;
- governança Central: sucesso;
- Fases 1–5E/preparo: sucesso;
- procedimentos operacionais 5E: sucesso;
- bundle de staging: sucesso;
- site e regressões transversais: sucesso.

O Cloudflare Pages publicou o preview imutável:
- `https://06b2c2ec.portal-regulacao-central-staging.pages.dev`.

A comparação GitHub entre o head funcional e o merge final mostrou **zero arquivos diferentes**. Portanto o Pages acima corresponde ao conteúdo funcional integrado.

V8C preserva:
- imagem/resolução da V8B;
- concorrência 5;
- Gemma/Qwen gratuitos;
- `max_completion_tokens=700`;
- revisão seletiva;
- contrato público de classificação/extração/chat;
- gates de produção e Drive inalterados.

V8C altera somente o transporte interno da resposta principal:
- `t=c|m|o`;
- 8 pares `[s,v]` nas páginas autorizadas;
- expansão imediata no backend para o schema público atual;
- telemetria técnica distingue `compact` de `legacy`.

Referências congeladas:
- source ref `cf8ed89cd2e5fa9ba7ed5c02d6f0cc1f50e2021e`;
- Pages `https://06b2c2ec.portal-regulacao-central-staging.pages.dev`;
- head funcional `19c54c5609b8435b85a2e9ab8ea411149bbefcb8`.

**Estado operacional:** a última evidência persistente da janela V8B mostra controle `phase5e_7296053755eb4142b94a80d2c2b5daa5`, preview `ff5d104b-b5e4-478b-8395-83a3d4dc4e1c`, release `96ce5dec060c98c582a8925ae03bc25973b0f3bd`, `aiGate=true` e `driveWriteGate=false`. Essa janela não pode ser reutilizada para V8C.

**Próxima ação exata:** encerrar V8B fail-closed; atualizar os scripts locais a partir da `main`; executar readiness V8C confirmando `activeControlledWindow=false`, source `cf8ed89...` e Pages `06b2c2ec...`; somente então preparar nova janela e rodar uma única matriz V8C.

## Readiness V8C aprovado — 20/09/2026

O operador executou o verificador 5E após a preparação da V8C e obteve:

- `PRECONDICOES_5E_OK`;
- produção ativa `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- `workersAiBindingPresent=true`;
- `freeOnlyModels=true`;
- `extractCapability=true`;
- `activeControlledWindow=false`;
- source ref `cf8ed89cd2e5fa9ba7ed5c02d6f0cc1f50e2021e`;
- Pages `https://06b2c2ec.portal-regulacao-central-staging.pages.dev`;
- próxima ação declarada pelo verificador: `PREPARAR_HOMOLOGACAO_5E`.

Conclusão: não há janela controlada ativa e as referências congeladas da V8C coincidem com o readiness local. A condição operacional para preparar uma nova janela V8C está satisfeita. Produção não foi alterada.

**Próxima ação exata:** executar `iniciar-homologacao-5e.mjs --iniciar` e, quando solicitado, confirmar `PREPARAR HOMOLOGACAO 5E`. Depois validar que a nova janela usa release `cf8ed89cd...`, `aiGate=true` somente no preview e `driveWriteGate=false`.

## Janela V8C preparada — 20/09/2026

O operador concluiu o preparo oficial da nova janela V8C.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `6b809a5c-01e3-415a-a4d7-352a19fd34af`;
- controle `phase5e_90b936fbb3d344ecb43d69b99891043c`;
- expiração `2026-09-20T06:24:55.000Z`;
- release `cf8ed89cd2e5fa9ba7ed5c02d6f0cc1f50e2021e`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

Conclusão: a janela corresponde ao runtime V8C congelado e produção não foi promovida.

**Próxima ação exata:** abrir `https://06b2c2ec.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada e executar a matriz **uma única vez**. Critérios V8C: 10/10, `formato_compacto_paginas=6`, `formato_legado_paginas=0` e redução material de `completion_tokens_extracao` em relação ao baseline V8B de 1.024 (alvo operacional <=700). Não encerrar a janela antes de analisar o resumo seguro.

## Resultado V8C — redução de tokens aprovada, precisão reprovada — 20/09/2026

Resumo seguro real:
- matriz: **3 aprovados / 7 falhas**;
- extração: **6,389 s**;
- total com chat: **8,998 s**;
- Gemma: 6 páginas; Qwen: 0;
- formato compacto: **6/6**;
- formato legado: **0/6**;
- prompt tokens: **9.679**;
- completion tokens: **579**;
- total tokens: **10.258**;
- cached prompt tokens: **2.560**;
- área visual: 100% nas seis páginas.

A meta de compactação foi atingida: completion caiu de **1.024 → 579 tokens** (~43,5% de redução), abaixo do alvo operacional de 700. Porém o critério principal de precisão falhou.

Falha localizada:
- páginas 2, 4, 5 e 6 divergiram **somente no campo `titulo`**;
- página 1 e página 3 passaram;
- os três chats dependentes das páginas médicas rejeitadas falharam por efeito cascata;
- o chat de código ausente da página 5 ainda retornou corretamente NÃO CONSTA;
- todas as seis chamadas do provider terminaram `success`, em formato compacto, sem fallback e sem revisão.

Diagnóstico: o vetor posicional compacto de oito campos retirou a âncora semântica explícita do campo `titulo`. Os outros sete campos médicos permaneceram corretos, o que isola a regressão no primeiro item do vetor. A regra antiga "usar primeiro o campo explicitamente rotulado Título" continuava no prompt-base, mas sem uma chave semântica na saída o Gemma passou a preferir o cabeçalho da folha em todas as páginas médicas sintéticas.

**Decisão:** não abandonar a compactação, porque ela comprovou redução forte de completion tokens. Corrigir apenas a perda semântica do título.

V8C.1:
- comprovante continua com `{"t":"c","f":[8 pares]}`;
- página médica passa a usar `{"t":"m","h":[s,v],"f":[7 pares]}`;
- `h` representa exclusivamente `titulo`;
- se existir rótulo explícito "Título", `h` deve usar exatamente esse valor; cabeçalho somente quando o rótulo não existir;
- os sete demais campos médicos continuam no vetor compacto;
- o backend rejeita o formato médico posicional antigo de oito itens para impedir regressão silenciosa;
- contrato público final permanece idêntico.

A janela V8C atual permanece aberta somente até o código V8C.1 ser validado. Não repetir a matriz V8C e não reutilizar esta janela para V8C.1.

## V8C.1 integrada e referências congeladas — 20/09/2026

A correção focal da V8C foi integrada pela PR **#331** no merge `22318ff06cb893733b9794001cd880380d237f64`.

Head funcional validado: `cbbcc6c3c858c983ab9f10320598f4a24a3c295f`.
Pages imutável: `https://62b72fe5.portal-regulacao-central-staging.pages.dev`.
A comparação GitHub head funcional → merge final mostrou **zero arquivos diferentes**.

A V8C.1 corrige somente o ponto que falhou na V8C real:
- `titulo` deixa de ser o primeiro item anônimo do vetor médico;
- passa a ser `h=[s,v]`, semanticamente dedicado ao título;
- se houver campo explicitamente rotulado "Título", `h` deve usar exatamente esse valor;
- os demais sete campos médicos permanecem no vetor compacto;
- comprovante permanece `f[8]`;
- formato médico V8C antigo `f[8]` sem `h` é rejeitado;
- contrato público continua idêntico.

A janela V8C atualmente ativa permanece no controle `phase5e_90b936fbb3d344ecb43d69b99891043c`, release `cf8ed89cd2e5fa9ba7ed5c02d6f0cc1f50e2021e`, e **não deve ser reutilizada** para V8C.1.

**Próxima ação exata:** encerrar V8C fail-closed; atualizar os scripts locais da `main`; executar readiness V8C.1 confirmando source `22318ff...`, Pages `62b72fe5...` e `activeControlledWindow=false`; só então preparar nova janela.

## Readiness V8C.1 aprovado — 20/09/2026

O operador executou o readiness após encerrar a janela V8C e atualizar os scripts locais.

Evidências sanitizadas:
- `PRECONDICOES_5E_OK`;
- produção `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- `workersAiBindingPresent=true`;
- `freeOnlyModels=true`;
- `extractCapability=true`;
- `activeControlledWindow=false`;
- source ref `22318ff06cb893733b9794001cd880380d237f64`;
- Pages `https://62b72fe5.portal-regulacao-central-staging.pages.dev`;
- próxima ação `PREPARAR_HOMOLOGACAO_5E`.

Conclusão: a janela V8C anterior não está mais ativa e o ambiente local aponta exatamente para as referências congeladas da V8C.1. Produção permaneceu inalterada.

**Próxima ação exata:** executar `iniciar-homologacao-5e.mjs --iniciar`; quando solicitado, confirmar `PREPARAR HOMOLOGACAO 5E`. A nova janela deve usar release `22318ff06cb893733b9794001cd880380d237f64`, `aiGate=true` somente no preview e `driveWriteGate=false`.

## Janela V8C.1 preparada — 20/09/2026

O operador concluiu o preparo oficial da nova janela V8C.1.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `0a26903d-921c-4e18-a646-ab7e6c0dad9c`;
- controle `phase5e_bd8ef3177d284d64b7a50846c075d016`;
- expiração `2026-09-20T06:44:15.000Z`;
- release `22318ff06cb893733b9794001cd880380d237f64`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

Conclusão: a janela corresponde exatamente ao runtime V8C.1 congelado e produção não foi promovida.

**Próxima ação exata:** abrir `https://62b72fe5.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada e executar a matriz **uma única vez**. Critérios: 10/10, `formato_compacto_paginas=6`, `formato_legado_paginas=0`, nenhuma divergência em `titulo` e completion tokens ainda materialmente abaixo do baseline V8B de 1.024. Não encerrar a janela antes de analisar o resumo seguro.

## Resultado V8C.1 — 7/10; fallback sistemático nas páginas médicas — 20/09/2026

Resumo seguro real:
- **7 aprovados / 3 falhas**;
- extração **14,469 s**;
- total **17,313 s**;
- `formato_compacto_paginas=6`;
- `formato_legado_paginas=0`;
- Gemma final: 2 páginas;
- Qwen final: 4 páginas;
- prompt tokens reportados: 19.157;
- completion tokens reportados: 678;
- cached prompt tokens: 0;
- divergências: `medico` nas páginas 5 e 6.

Comportamento por página:
- páginas 1 e 3: Gemma em uma tentativa;
- páginas 2, 4 e 5: Gemma retornou `DOCUMENT_AI_PROVIDER_SCHEMA_INVALID` e Qwen concluiu a segunda tentativa;
- página 6: Gemma schema-invalid → Qwen extração → Qwen revisão; a revisão não alterou nenhum campo;
- páginas 2 e 4 passaram após fallback;
- páginas 5 e 6 falharam somente em `medico`;
- falha do chat da página 6 foi efeito cascata da evidência reprovada.

Conclusão: a âncora isolada de `titulo` corrigiu o problema anterior, mas o restante do vetor posicional continuou frágil e o novo shape `h+f[7]` foi incompatível com a resposta inicial do Gemma em todas as páginas médicas. O custo de retries tornou a V8C.1 muito mais lenta.

Observação de telemetria: o provider anterior só anexava `usage` à tentativa que passava na validação; portanto os 19.157/678 tokens não incluem necessariamente todos os tokens gerados pelas quatro respostas Gemma que falharam no schema. Isso será corrigido na próxima versão.

## V8C.2 implementada — compacto semântico + JSON Schema — 20/09/2026

Branch: `feat/central-docs-5e-v8c2-semantic-json`.

Mudanças:
- elimina vetores posicionais para significado de campos;
- envelope `t+v`;
- chaves curtas semânticas fixas por campo (ex.: `ti=titulo`, `me=medico`, `ci=cid`);
- mantém pares compactos `[s,v]`;
- backend exige conjunto exato de chaves e expande para o schema público atual;
- usa JSON Mode estruturado do Workers AI com `response_format.type=json_schema` para garantir o shape mínimo `t+v`;
- validação documental estrita continua no backend;
- `usage` passa a ser preservado também em tentativas que falham após o provider responder;
- revisão focal redundante é evitada quando Gemma **ou Qwen** já retornam exclusivamente CID ilegível com descrição encontrada.

A documentação oficial atual do Cloudflare declara suporte a JSON Mode/JSON Schema no Workers AI e o modelo Gemma 4 expõe `response_format`; essa capacidade é usada somente para estrutura, nunca para relaxar regras documentais.

**Próxima ação exata:** validar CI da V8C.2. Se verde, integrar e congelar source/Pages; depois encerrar a janela V8C.1 fail-closed, executar readiness e abrir uma nova janela V8C.2. Não repetir a matriz V8C.1.

## V8C.2 integrada e referências congeladas — 20/09/2026

A PR **#335** foi integrada na `main` pelo merge `32bda4f6753d434cc134eafb3610de16b00e272d`.

Head funcional validado: `636d500580ea4083d131f96c0bf73e73f6ee86d7`.
Pages imutável: `https://821db519.portal-regulacao-central-staging.pages.dev`.
A comparação GitHub head funcional → merge final mostrou **zero arquivos diferentes**.

A V8C.2 substitui o significado posicional por chaves curtas semânticas:
- envelope `t+v`;
- comprovante: `np,cp,cn,dn,nm,te,en,ag`;
- página médica: `ti,mo,me,cr,ps,pc,ci,dc`;
- cada campo permanece no par compacto `[s,v]`;
- backend exige exatamente as chaves autorizadas e expande para o contrato público atual;
- `response_format=json_schema` do Workers AI é usado apenas para garantir o shape mínimo `t+v`;
- token usage passa a ser preservado inclusive em respostas do provider que depois falhem no schema;
- revisão focal redundante é evitada também quando Qwen já retorna exclusivamente CID ilegível + descrição encontrada.

A janela V8C.1 atualmente ativa continua no controle `phase5e_bd8ef3177d284d64b7a50846c075d016`, release `22318ff06cb893733b9794001cd880380d237f64`, e **não deve ser reutilizada** para V8C.2.

**Próxima ação exata:** encerrar V8C.1 fail-closed; atualizar scripts locais da `main`; executar readiness V8C.2 confirmando source `32bda4f...`, Pages `821db519...` e `activeControlledWindow=false`; só então preparar nova janela.

## Janela V8C.1 encerrada fail-closed — 20/09/2026

O operador encerrou oficialmente a janela V8C.1 antes de qualquer abertura da V8C.2.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_bd8ef3177d284d64b7a50846c075d016`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `768fb0f9-9483-4229-a671-a07caaee6862`;
- release encerrado `22318ff06cb893733b9794001cd880380d237f64`;
- `httpBlocked=true`.

Conclusão: a janela V8C.1 está encerrada e não pode ser reutilizada. O próximo passo operacional é somente leitura: atualizar os scripts locais da `main` e executar o readiness V8C.2.

**Próxima ação exata:** executar `verificar-precondicoes-5e.mjs --verificar` após atualizar os scripts locais, confirmando `activeControlledWindow=false`, source `32bda4f6753d434cc134eafb3610de16b00e272d` e Pages `https://821db519.portal-regulacao-central-staging.pages.dev`.

## Readiness V8C.2 aprovado — 20/09/2026

O operador executou o readiness após encerrar a janela V8C.1 e atualizar os scripts locais.

Evidências sanitizadas:
- `PRECONDICOES_5E_OK`;
- produção `298ba237-78f9-4d24-bad1-47e66b4c1e15`;
- `workersAiBindingPresent=true`;
- `freeOnlyModels=true`;
- `extractCapability=true`;
- `activeControlledWindow=false`;
- source ref `32bda4f6753d434cc134eafb3610de16b00e272d`;
- Pages `https://821db519.portal-regulacao-central-staging.pages.dev`;
- próxima ação `PREPARAR_HOMOLOGACAO_5E`.

Conclusão: o ambiente local está limpo, sem janela controlada ativa, e aponta exatamente para as referências congeladas da V8C.2. Produção permaneceu inalterada.

**Próxima ação exata:** executar `iniciar-homologacao-5e.mjs --iniciar`; quando solicitado, confirmar `PREPARAR HOMOLOGACAO 5E`. A nova janela deve usar release `32bda4f6753d434cc134eafb3610de16b00e272d`, `aiGate=true` somente no preview e `driveWriteGate=false`.

## Janela V8C.2 preparada — 20/09/2026

O operador concluiu o preparo oficial da nova janela V8C.2.

Evidências sanitizadas:
- `HOMOLOGACAO_5E_PREPARADA`;
- preview version `30b6d644-a3f1-43d9-8357-5618683de288`;
- controle `phase5e_c5fb89ad6616463d8a427fe5885cc1dd`;
- expiração `2026-09-20T07:06:06.000Z`;
- release `32bda4f6753d434cc134eafb3610de16b00e272d`;
- `aiGate=true` somente no preview;
- `driveWriteGate=false`;
- produção permaneceu `298ba237-78f9-4d24-bad1-47e66b4c1e15`.

Conclusão: a janela corresponde exatamente ao runtime V8C.2 congelado e produção não foi promovida.

**Próxima ação exata:** abrir `https://821db519.portal-regulacao-central-staging.pages.dev/homologacao-5e/`, autenticar com a conta autorizada e executar a matriz **uma única vez**. Critérios: 10/10, `formato_compacto_paginas=6`, `formato_legado_paginas=0`, nenhum `campos_divergentes`, ausência de fallback sistemático por schema nas páginas médicas e telemetria de tokens contabilizando todas as tentativas. Não encerrar a janela antes de analisar o resumo seguro.

## Resultado V8C.2 — 10/10 em 4,524 s; encerrar otimização de latência da Fase 5 — 20/09/2026

Resumo seguro real:
- `MATRIZ_5E_SINTETICA=APROVADA`;
- **10 aprovados / 0 falhas**;
- `duracao_extracao_ms=4524`;
- `duracao_total_ms=8281`;
- Gemma: 6 páginas;
- Qwen: 0 páginas;
- concorrência 5;
- `formato_compacto_paginas=6`;
- `formato_legado_paginas=0`;
- `prompt_tokens_extracao=10683`;
- `completion_tokens_extracao=622`;
- `total_tokens_extracao=11305`;
- `cached_prompt_tokens_extracao=2944`;
- todas as seis páginas concluíram em **uma única tentativa**;
- nenhuma revisão focal;
- nenhum `campos_divergentes`;
- os quatro casos de chat também passaram.

Comparação com baselines persistidos:
- V8C.2: **4,524 s**;
- V8A: 5,388 s;
- V8B: 6,179 s;
- V7F: 6,830 s.

A V8C.2 é o melhor resultado 10/10 persistido da linha atual. Ela também mantém completion tokens abaixo do alvo operacional de 700 e elimina o fallback/retry que havia degradado a V8C.1.

**Decisão de governança:** não continuar criando V8C.3/V8D apenas para reduzir algumas centenas de milissegundos numa única rodada. O Guia Mestre determina avançar quando o critério da fase está comprovado e não polir indefinidamente; análise de p75/p95/p99, cache e otimização contínua pertencem à **Fase 7**.

O valor numérico exato da V6 não foi persistido, portanto não registrar uma razão formal <=50% contra V6. Isso não bloqueia o aceite funcional da Fase 5: a matriz comprovou proveniência por página, ausência de mistura, NÃO CONSTA, ILEGÍVEL e literalidade, além de fluxo adversarial e chat por evidência.

**Estado da Fase 5:** critérios funcionais comprovados; **pendência operacional única** para encerramento formal: fechar a janela V8C.2 com o procedimento fail-closed e confirmar `httpBlocked=true`. Depois disso, registrar Fase 5 encerrada e avançar para **Fase 6 — Automação operacional**.

## Fase 5 encerrada; Fase 6 iniciada — 20/09/2026

A janela final V8C.2 foi encerrada oficialmente após a matriz 10/10.

Evidências sanitizadas:
- `JANELA_5E_ENCERRADA`;
- controle `phase5e_c5fb89ad6616463d8a427fe5885cc1dd`;
- `controlEnabled=false`;
- `aiGate=false`;
- `driveWriteGate=false`;
- preview final bloqueado `a3d8dd66-c4b7-4f55-8399-34ab2334919a`;
- release encerrado `32bda4f6753d434cc134eafb3610de16b00e272d`;
- `httpBlocked=true`.

**Conclusão da Fase 5:** encerrada e aceita. O critério funcional do Guia Mestre foi comprovado pela V8C.2 10/10; a janela foi fechada fail-closed; não existem gates de IA documental ativos em produção por efeito desta homologação.

**Decisão de avanço:** a fase atual passa a ser **Fase 6 — Automação operacional**. A Fase 6 deve preparar recursos em background e sugerir próximas ações, sem executar mudanças destrutivas automaticamente. A medição de p75/p95/p99 e micro-otimizações de latência ficam para a Fase 7.

Foi criado `docs/CENTRAL-DOCUMENTOS-FASE-6.md` com o diagnóstico inicial e as subfases 6A–6E. A primeira unidade é **6A — orquestrador de background e métricas**, sem nova chamada antecipatória de IA nesta unidade.

## Fase 6A–6E implementada em branch isolada — aguardando CI — 20/09/2026

Branch: `feat/central-docs-phase6-automation`.

Implementado:
- orquestrador `js/document-background.js` com idle queue, concorrência 1, deduplicação, `AbortController`, cancelamento por escopo e prioridade foreground;
- miniaturas iniciais pré-aquecidas após `pdf_ready`, reutilizando o viewer lazy;
- preparo efêmero de até duas páginas para futura IA;
- novo gate `DOCUMENTS_AI_BACKGROUND_ENABLED=false` em produção;
- preextração somente quando IA habilitada + processing habilitado + gate background + capability `extract`;
- reutilização do preparo quando o usuário clica em `Extrair dados do PDF`;
- aquecimento de próximos PDFs por posição, hover/focus e histórico opaco da sessão;
- sugestão discreta quando preparo de IA já está disponível;
- telemetria técnica `document_background_task` allowlisted no frontend e backend;
- staging atualizado para incluir o novo módulo;
- testes de contratos 6A–6E e privacidade adicionados.

Não alterado:
- produção continua com IA documental e IA antecipatória fail-closed;
- Drive não recebe escrita automática nova;
- autosync/editor/permissões não foram reabertos;
- nenhum conteúdo clínico entra na telemetria;
- V8C.2 continua baseline da IA documental.

**Próxima ação exata:** abrir PR da implementação completa da Fase 6, validar CI direcionado e staging. Se verde, integrar na `main`. Depois executar validação operacional da Fase 6 em uso real; somente essa medição pode encerrar formalmente a fase.

## Fase 6 integrada na main; homologação operacional preparada — 20/09/2026

A implementação completa 6A–6E foi integrada pela PR **#342** no merge `87b7b7b274d8d6392bfacd85e18eab19dc672885`.

Validação do head funcional `de1ddc5de6346da0911e6e2fc7ca86abb2b260a9`:
- **27 workflows/checks verdes**;
- Fases 1–6: sucesso;
- navegador Central: sucesso;
- bundle de staging: sucesso;
- governança: sucesso;
- deploy seguro do Worker: sucesso.

Cloudflare Pages staging do head funcional:
- `https://a2d88ca3.portal-regulacao-central-staging.pages.dev`.

A comparação GitHub head funcional → merge final mostrou **zero arquivos diferentes**.

Foi criado `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-6.md` com a matriz final de aceite operacional. Não há mais implementação estrutural pendente da Fase 6.

**Pendência única da Fase 6:** comprovar em uso real redução mensurável de tempo sem perda de controle do usuário. IA antecipatória permanece fail-closed em produção; a Fase 6 pode ser homologada pelo cache/prefetch, cancelamento e prioridade foreground sem ligar esse gate.

## Regressão visual encontrada na homologação 6 — botão IA fantasma — 20/09/2026

Durante a validação operacional em produção, o operador observou o botão lateral **IA documental** visível no editor, porém sem qualquer efeito ao clicar.

Diagnóstico no código da `main`:
- o botão nasce com atributo HTML `hidden`;
- a regra `.documents-rail-tool { display: inline-grid; }` tinha origem autoral e sobrescrevia o `display:none` padrão do navegador para `[hidden]`;
- a lógica JavaScript permanecia correta: `setDocumentAiPanelOpen()` exige `canUseDocumentAi()`;
- produção permanece com `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`, portanto o clique era corretamente recusado pelo gate, mas o ícone não deveria estar visível.

Conclusão: **não era comportamento correto**; era uma regressão exclusivamente visual de CSS. Não houve ativação de IA, chamada antecipatória ao provider, mudança de permissão ou escrita no Drive.

Correção em `fix/central-docs-phase6-hidden-rail-tools`:
- `.documents-rail-tool[hidden]` e `.documents-editor-tool[hidden]` passam a usar `display:none !important`;
- cache-buster de `documents.css` renovado para `20260920-3`;
- teste automatizado garante que ferramentas laterais com `hidden` não reapareçam por regras de display.

**Próxima ação exata:** validar CI/preview da correção, integrar se verde e repetir somente o caso visual em produção: com IA documental desabilitada, o botão IA não deve aparecer. A homologação operacional restante da Fase 6 continua conforme `CENTRAL-DOCUMENTOS-HOMOLOGACAO-6.md`.

## Fase 7F — renomeação inline de PDF na lista — PUBLICADA / AGUARDANDO HOMOLOGAÇÃO HUMANA — 23/09/2026

A PR **#445** foi mesclada em `main` pelo commit **`8d15b165`** após a branch ser reconciliada com as mudanças concorrentes do modo claro/escuro e do respectivo status.

**Resultado funcional publicado:**
- primeiro clique em um PDF continua apenas selecionando a linha;
- com o PDF já selecionado, um **segundo clique simples no nome** abre a edição inline;
- um **duplo clique rápido** continua abrindo o Titon;
- **Enter** ou saída do campo confirmam e sincronizam;
- **Esc** cancela;
- `.pdf` permanece protegida;
- a sincronização reutiliza `PATCH /api/documents/drive/rename` com `baseVersion` e `baseName`, mantendo detecção de conflito e confirmação real do Drive.

**Validação automática:** head final da PR #445 (`3584db89`) concluiu **23/23 workflows com sucesso**, incluindo `Validar Central de Documentos — Fases 1–6`, governança e `Validar Central de Documentos — navegador` com Chromium/PDF.js real. Nenhuma regressão conhecida ficou aberta antes do merge.

**Diagnóstico resolvido durante a implementação:** a primeira rodada de CI revelou interferência com o stub legado de `Element.closest` no teste `documents-close-guard.test.mjs`; a detecção de clique no nome foi restringida a `dataset.listRenameIndex`, preservando o handler normal da linha. A correção passou na matriz completa.

**Reconciliações concorrentes:** a PR #444 (tema global) e a PR #446 (status pós-publicação do tema) avançaram `main` durante o trabalho. A #445 foi reaplicada sobre ambas sem descartar mudanças; dois backups reversíveis foram mantidos para auditoria: `backup/titon-inline-list-rename-pre-theme-20260923` e `backup/titon-inline-list-rename-pre-status446-20260923`.

**Pendência não bloqueante:** falta apenas homologação humana em produção do gesto e da sincronização visual. A ordenação cronológica da 7E continua com sua homologação humana separada.

## Fase 7G — acesso operacional integral da Central — IMPLEMENTADA EM BRANCH — 23/09/2026

Durante a homologação humana da renomeação inline 7F, a produção exibiu **“Sua conta não possui permissão para renomear este PDF no Google Drive.”** embora a conta já tivesse acesso à Central. O diagnóstico confirmou que o modelo antigo ainda separava `view`, `extract` e `edit`: a função Regulador(a) podia liberar a Central em modo de leitura enquanto IA e edição permaneciam desabilitadas.

**Decisão funcional aprovada pelo operador:** quem possui acesso à Central de Documentos deve possuir **acesso operacional completo às funcionalidades documentais**. Portanto:
- `view=true` implica automaticamente `extract=true` e `edit=true`;
- a função adicional `documentos` (**Regulador(a)**) concede leitura, IA documental, editor, renomeação e sincronização segura com o Drive;
- permissões parciais de “somente leitura”, “IA separada” ou “editor separado” deixam de existir para contas que já têm acesso à Central;
- `manage` **permanece separado**, pois corresponde à administração de usuários/conexão institucional e não ao uso operacional dos documentos.

**Implementação técnica:** `worker/document-access.js` passa a derivar `extract` e `edit` diretamente de `view`. `setDocumentCapabilities()` também normaliza qualquer concessão operacional para `can_view=1, can_extract=1, can_edit=1`. As colunas D1 antigas permanecem por compatibilidade/auditoria, mas não restringem mais uma conta que já tenha `view`. Isso torna a correção efetiva para usuários existentes **sem migração destrutiva de banco**.

Em **Usuários e acessos**, foram removidos os checkboxes independentes “Permitir IA documental” e “Permitir editor de PDF”. O único controle operacional passa a ser a função Regulador(a), descrita explicitamente como acesso operacional completo. Remover Regulador(a) continua limpando o acesso legado por meio do mesmo PATCH administrativo.

**Segurança preservada:** nenhuma capability `manage` é ampliada; toda rota continua revalidando sessão e capability no Worker; não houve mudança de OAuth, segredo, Drive institucional, conteúdo documental ou PostHog. Nomes de arquivos e dados clínicos continuam proibidos na observabilidade.

**Alternativas descartadas:** conceder `edit` apenas à conta que encontrou o erro; migrar manualmente usuários um a um; manter três checkboxes separados. Essas opções preservariam o risco de novas contas entrarem em “somente leitura” contra a regra de produto aprovada.

Branch: `fix/central-full-operational-access-20260923`. Próximo passo: abrir PR, executar CI completo, mesclar somente se verde e confirmar o deploy do Worker antes da homologação real.

## Fase 7G.1 — rename pré-abertura + acesso operacional integral — PUBLICADA / AGUARDANDO HOMOLOGAÇÃO HUMANA — 23/09/2026

A correção foi concluída em duas camadas porque o aviso observado pelo operador tinha **dois problemas independentes**:

1. **Política de acesso antiga:** a Central permitia `view=true` com `extract/edit=false`. A PR **#448**, mesclada em `9bd56707`, alterou o contrato para que acesso operacional à Central implique `view + extract + edit`, mantendo somente `manage` separado para administração.
2. **Bug específico do rename antes de abrir:** `beginListPdfRename()` e `commitListPdfRename()` chamavam `canSyncDocuments()`, helper que exige `state.pdfItem` e, portanto, somente funciona quando o PDF já está aberto. Na lista, `state.pdfItem` é intencionalmente `null`. A PR **#449**, mesclada em `764e0764`, introduziu `canWriteDocument(item)` e passou a validar diretamente o PDF selecionado na lista.

**Comportamento final:**
- uma conta com acesso à Central recebe leitura, IA documental, editor, renomeação e sincronização segura;
- o rename da lista pode começar e ser confirmado **antes de abrir o PDF**, sem depender de `state.pdfItem`;
- `canWriteDocument(item)` continua exigindo capability de edição, Drive conectado, `writeEnabled=true`, referência opaca do arquivo e versão conhecida;
- `canSyncDocuments()` permanece como especialização do PDF já aberto;
- o chip fixo legado “Somente leitura” foi substituído por estado real: **Acesso completo** quando escrita está habilitada e **Somente leitura** somente se o gate de escrita estiver realmente desligado;
- frontend publicado como `documents.js?v=20260923-11`.

**Validação da PR #449:** **23/23 workflows success**, zero falhas no head final `f2368748`, incluindo Fases 1–6, governança e navegador real. Uma rodada intermediária falhou apenas porque o workflow ainda procurava literalmente o antigo texto estático “Somente leitura”; o contrato de CI foi atualizado para o chip dinâmico e a matriz seguinte ficou integralmente verde.

**Publicação pós-merge `764e0764`:**
- GitHub Actions: **23/23 success**;
- GitHub Pages `deploy`: **success**;
- Cloudflare Pages: **success**;
- Workers Builds produtivo: **success**;
- Build ID: `c3189a0e-8252-4b88-9402-488d7f4b9b62`;
- Worker Version: `25c48aad-de81-4904-8013-3542b3c7e3a9`.

Esse Workers Builds bem-sucedido **substitui como evidência operacional** a tentativa anterior da PR #448 cujo check externo final ficou vermelho. A versão Worker publicada após #449 já contém a política integral introduzida por #448.

**Privacidade e segurança preservadas:** `manage` não foi ampliado; não houve migração destrutiva de D1, novo endpoint, mudança de OAuth ou inclusão de dados documentais em observabilidade. Nomes de arquivos, refs, IDs e conteúdo continuam fora do PostHog.

**Pendência:** somente homologação humana em produção. O teste deve confirmar que, após Ctrl+F5, o chip mostra **Acesso completo**, o segundo clique simples no nome permite editar antes de abrir o PDF, Enter/clique fora sincronizam e o duplo clique rápido continua abrindo o Titon.

## Fase 7G.2 — ações rápidas de Salvar/Imprimir na lista — PUBLICADA / AGUARDANDO HOMOLOGAÇÃO HUMANA — 23/09/2026

A PR **#455** foi mesclada em `main` pelo commit **`24c8bc03`**.

**Comportamento publicado:**
- em desktop, passar o mouse sobre uma linha de PDF revela dois botões quadrados no canto direito: **Salvar PDF** e **Imprimir**;
- foco por teclado também revela as ações, preservando acessibilidade;
- **Salvar** obtém o PDF pelo mesmo fluxo autorizado/cacheado da Central e inicia download local com o nome do arquivo;
- **Imprimir** prepara o PDF em iframe interno e abre a caixa nativa de impressão, sem nova aba;
- nenhuma das duas ações abre o Titon ou altera `state.pdfItem`;
- pastas e arquivos não-PDF não recebem as ações;
- em mobile/touch os botões de hover permanecem ocultos para preservar o layout existente;
- clique simples para selecionar, segundo clique simples no nome para renomear e duplo clique rápido para abrir o Titon permanecem intactos.

**Validação:** head final reconciliado da PR #455 (`16ffd34f`) concluiu **23/23 workflows GitHub Actions com sucesso**, incluindo `Validar Central de Documentos — navegador` em Chromium/PDF.js real. A falha inicial no harness `documents-close-guard` foi corrigida restringindo o handler das ações rápidas aos elementos que realmente possuem `dataset.listSaveIndex` / `dataset.listPrintIndex`.

**Publicação pós-merge `24c8bc03`:**
- GitHub Actions: **23/23 success**;
- GitHub Pages `deploy`: **success**;
- Cloudflare Pages: **success**;
- Workers Builds: **success**;
- Worker Version observada no check de publicação: `781eab47-6ed5-4215-803c-a49b1369897c`.

A mudança em si continua sendo frontend e não depende de nova lógica de Worker; a evidência do Workers Builds é registrada apenas como confirmação de que a cadeia completa de publicação não ficou quebrada.

**Privacidade/segurança:** nenhum endpoint, capability, escrita no Drive ou evento de observabilidade novo foi criado. Nomes de arquivo, conteúdo do PDF e referências do Drive continuam fora do PostHog.

**Pendência:** homologação humana em produção, incluindo modo escuro e nomes longos. O aceite operacional é hover revelar exatamente os dois botões, Salvar iniciar download e Imprimir abrir a caixa de impressão, ambos sem abrir o Titon.

## Fase 7G.3 — botões autorais do Titon no modo escuro — PUBLICADA / AGUARDANDO HOMOLOGAÇÃO HUMANA — 23/09/2026

A PR **#459** foi mesclada em `main` pelo commit **`2c5ff85a`**.

**Problema corrigido:** no modo escuro, os controles **Ajustar largura**, **Salvar PDF** e **Imprimir PDF** do topo do visualizador apareciam como retângulos vazios.

**Causa confirmada:** o tema global escuro aplica `background: #142b3b !important` aos botões `.portal-button.secondary`. Como `background` é shorthand, ele apagava também a imagem, posição, repetição e tamanho dos backgrounds autorais desses três controles. Zoom -/+ não era afetado porque usa a variante `ghost`.

**Correção publicada:** `css/documents.css` restaura, somente no Titon + modo escuro, o background completo de:
- `ajustar-largura.svg`;
- `salvar-pdf.svg`;
- `imprimir-normal.svg`.

O tema global e o modo claro permanecem inalterados. Cache-buster publicado: `documents.css?v=20260923-8`.

**Validação:**
- PR #459: **23/23 GitHub Actions success**, incluindo Chromium/PDF.js real;
- Cloudflare Pages preview: **success**;
- pós-merge `2c5ff85a`: **23/23 GitHub Actions success**;
- GitHub Pages `deploy`: **success**;
- Cloudflare Pages: **success**;
- Workers Builds: **success**;
- Worker Version observada na cadeia de publicação: `cd6db6de-1c06-4edf-9e9b-7aee1461266d`.

A alteração funcional é somente CSS/cache-buster/teste/status; a evidência do Worker é registrada apenas para comprovar que a cadeia geral de publicação ficou íntegra.

**Privacidade/segurança:** nenhuma alteração em JavaScript, API, Drive, IA, permissões ou observabilidade.

**Pendência:** homologação visual humana em produção. O aceite é os três botões exibirem novamente seus desenhos no modo escuro, mantendo hover/foco e sem regressão do modo claro.

## Fase 7G.4 — contraste das ferramentas internas do editor no modo escuro — PUBLICADA / AGUARDANDO HOMOLOGAÇÃO HUMANA — 23/09/2026

A PR **#461** foi mesclada em `main` pelo commit **`a6f056de`**.

**Problema corrigido:** as ferramentas internas do editor PDF e da barra lateral usavam ícones/textos azul-escuros sobre o fundo navy do modo escuro, com contraste insuficiente.

**Correção publicada:** somente no modo escuro, as ferramentas genéricas recebem placa azul-clara:
- fundo `#d8e9f4`;
- borda `#78a9c4`;
- ícone/texto `#0b4568`;
- hover/foco `#f1f8fc`;
- estado ativo `#b9dff2`;
- disabled com `opacity: .5`.

Os botões autorais `.documents-art-button` foram explicitamente excluídos para preservar Grade, Drive, Salvar, Imprimir e Fechar, já corrigidos na 7G.3. O modo claro permanece inalterado. Cache-buster publicado: `documents.css?v=20260923-9`.

**Validação:**
- PR #461: **23/23 GitHub Actions success**, incluindo Chromium/PDF.js real;
- Cloudflare Pages preview: **success**;
- pós-merge `a6f056de`: **23/23 GitHub Actions success**;
- GitHub Pages `deploy`: **success**;
- Cloudflare Pages: **success**;
- Workers Builds pós-merge: **failure**, porém esta unidade não altera runtime/configuração do Worker; a publicação estática da correção foi confirmada por Pages.

**Privacidade/segurança:** nenhuma alteração em JavaScript, API, Drive, IA, permissões ou observabilidade.

**Pendência:** homologação visual humana em produção. O aceite é as ferramentas internas do editor/rail ficarem claramente legíveis no tema escuro sem alterar os botões autorais.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase atual | **Fase 7 — Robustez e otimização contínua** |
| Subfase / objetivo atual | **rollback da 7H.1: remover Especialidade definida pela Solicitação** |
| Última ação concluída | arquivos funcionais restaurados na branch ao estado anterior à PR #467; status atualizado |
| Branch atual | `revert/titon-specialty-request-20260924` |
| PR atual | **a abrir** |
| Último commit relevante | baseline funcional de restauração: `2fe0b47a598198e985bf268b6935e632709e5319` |
| Checks e testes | ainda pendentes nesta branch |
| Decisões tomadas | voltar ao contrato anterior: Especialidade somente por rótulo explícito na própria página |
| Justificativas | homologação humana reprovou a regra de Solicitação como fallback e pediu retorno ao comportamento anterior |
| Alternativas descartadas | recalibrar a heurística da Solicitação; manter parte da 7H.1 |
| Ações externas concluídas | nenhuma nesta reversão |
| Pendências e bloqueios | abrir PR, validar CI, mesclar e confirmar publicação do Worker |
| Riscos conhecidos | garantir que o rollback não remova o campo Especialidade nem a ordem operacional da 7H; somente a fonte alternativa por Solicitação deve desaparecer |
| Métricas / observabilidade | nenhuma telemetria nova; conteúdo clínico continua fora do PostHog |
| Próxima ação exata | **abrir PR do rollback → exigir CI verde → mesclar → confirmar Workers Builds success → registrar publicação** |
| Arquivos e fontes principais | Guia Mestre V1.1; PRs #467/#468; baseline `2fe0b47`; `worker/document-ai*.js`; matriz 5E; status |

## Histórico recuperável

Status integral anterior: `c1767a219389b660f59d3c8631bc1a96b12bec1e:docs/CENTRAL-DOCUMENTOS-STATUS.md`. Etapas anteriores emc90b774,5b1507c,9c491c2,402199d,f1824c7,4d64c5d; V2-R1 em103ccd6; V2 em9f295ca. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 preservam critérios/detalhes. Consultar apenas o necessário sem reiniciar etapas concluídas.

Referências externas desta etapa: Cloudflare Workers Preview URLs (versões e aliases, limitações de logs) e Wrangler Commands/Workers (versions list: dez recentes; versions view: detalhes de uma versão). Essas referências não comprovam configuração privada deste ambiente.


## Publicação produtiva da IA documental — AUTORIZADA, AGUARDANDO CI/DEPLOY — 20/09/2026

Após o encerramento formal da Fase 5 e a matriz V8C.2 10/10, o operador autorizou explicitamente disponibilizar a IA documental para uso real na Central. A decisão corrige a situação em que a funcionalidade já estava aprovada, porém os gates produtivos normais permaneciam desligados por cautela de rollout.

Escopo aprovado:
- ativar `DOCUMENTS_AI_ENABLED=true`;
- ativar `DOCUMENTS_AI_PROCESSING_ENABLED=true`;
- preservar `DOCUMENTS_AI_BACKGROUND_ENABLED=false` para não ligar preextração automática da Fase 6;
- preservar `DOCUMENTS_AI_FREE_ONLY=true` e `DOCUMENTS_AI_FAST_VISION_ENABLED=false`;
- preservar o binding Workers AI, o baseline V8C.2, a capability `extract` e todas as validações de backend;
- não ampliar permissões, não alterar OAuth, Drive, autosync, editor ou observabilidade.

Justificativa: a IA documental já cumpriu o aceite funcional da Fase 5; esconder/bloquear permanentemente a ferramenta impediria o uso do recurso aprovado. A publicação normal continua sob ação explícita do usuário e não habilita automação antecipatória.

Rollback: recolocar somente `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`, mantendo background `false`; nenhuma migração de dados ou alteração destrutiva é necessária.

Branch de publicação: `release/central-docs-ai-production-20260920`.

**Próxima ação exata:** validar CI completo da branch, abrir/mesclar PR somente se verde e confirmar o deploy seguro do Worker. Depois validar em produção que uma conta que já possua `extract` vê o botão IA e que uma conta sem `extract` continua sem acesso.


## Publicação produtiva da IA — código integrado; deploy do Worker BLOQUEADO externamente — 20/09/2026

A PR **#345** foi mesclada na `main` pelo commit `eab164bf4956d08a8f83e75a5e1172aebd0d385e`. O estado versionado passou a exigir:
- `DOCUMENTS_AI_ENABLED=true`;
- `DOCUMENTS_AI_PROCESSING_ENABLED=true`;
- `DOCUMENTS_AI_BACKGROUND_ENABLED=false`;
- `DOCUMENTS_AI_FREE_ONLY=true`;
- `DOCUMENTS_AI_FAST_VISION_ENABLED=false`;
- binding Workers AI `AI` preservado e capability `extract` obrigatória no backend.

Validação de código:
- PR #345: workflows relevantes verdes, inclusive **Central de Documentos — Fases 1–6**, governança, bundle e gate de deploy seguro;
- após o merge, **23/23 workflows GitHub Actions** do push concluíram com `success`;
- Cloudflare Pages também publicou o merge com sucesso.

**Bloqueio real:** o check externo `Workers Builds: yellow-wave-d0a1guia-regulacao-ia` do merge terminou em `failure` (build `c99d6f51-ec8b-40ae-9854-39cb82ca9d89`). No commit imediatamente anterior, o mesmo pipeline expôs a mensagem `Preview creation failed: You do not have access to use Worker Previews. Please ensure it is enabled.`. Portanto, **não declarar a IA ativa em produção ainda**: a `main` contém a configuração desejada, mas não há evidência de que uma nova Worker Version tenha sido promovida.

Reconciliação: `worker/wrangler.toml` continua contendo `preview_urls=false`, proteção introduzida pela PR #241. A mesma configuração já publicou com sucesso anteriormente (merge #241, Worker Version `c94de153-8de7-4784-a909-15d207b1209a`). A falha atual é, portanto, do pipeline/controle externo do Workers Builds, não uma remoção dessa proteção no repositório.

Próxima ação externa exata:
1. no Worker `yellow-wave-d0a1guia-regulacao-ia`, conferir **Settings > Build > Branch control** e garantir que a production branch é `main`;
2. desabilitar **Builds for non-production branches** se estiver ativo, pois o projeto não depende de Worker Previews para PRs;
3. em **Settings > Build**, manter root directory `/worker` e Deploy command `npm run deploy:safe`;
4. salvar e **Retry build** do commit `eab164bf...` (ou disparar nova build de `main`);
5. somente depois de `Workers Builds=success`, confirmar a nova Worker Version e validar em produção que uma conta com capability `extract` vê/abre a IA documental.

Alternativa operacional segura, caso o Workers Builds continue indisponível: executar `npm run deploy:safe` a partir do commit fixo `eab164bf...` em uma máquina já autenticada no Wrangler. O gate envia candidata sem tráfego, valida bindings/secrets/AUTH_DB, promove apenas se íntegra e possui rollback automático.

Risco conhecido: a configuração desejada já está na `main`; quando o pipeline externo voltar a funcionar, ela poderá ser publicada automaticamente. Isso é compatível com a autorização explícita do operador, mas exige validação pós-deploy antes de declarar encerrada a publicação.

### Handoff complementar — publicação da IA
- **Fase atual:** Fase 6 — Automação operacional; publicação da IA é mudança transversal autorizada.
- **Última ação concluída:** PR #345 mesclada; código e gates produtivos desejados integrados.
- **Bloqueio:** Workers Builds externo falha antes de comprovar promoção do Worker.
- **Produção comprovada:** não assumir que os gates true estão ativos até check do Worker verde + nova versão confirmada.
- **Próxima ação exata:** corrigir/verificar Branch control/Build settings na Cloudflare, retry do build de `eab164bf...`, depois teste real do botão IA sob capability `extract`.


## Diagnóstico definitivo do bloqueio do deploy da IA — gate confundia preview 5E com candidata produtiva — 20/09/2026

O operador forneceu o log integral do Workers Builds. A hipótese anterior de falha na configuração **Branch control / Preview URLs** foi descartada.

Evidências do log real:
- ambiente inicializado e repositório clonado normalmente;
- Node 24.18.0 e Wrangler 4.133.0 corretos;
- `npm run deploy:safe` foi executado;
- predeploy completo: **384 testes / 384 pass / 0 fail**;
- teste específico `produção libera Drive e IA documental normal sem automação antecipatória`: **pass**;
- a falha ocorreu somente em **1/7 Conferindo produção e cadeia de versões**;
- marcador exato: `DEPLOY_SEGURO_INTERROMPIDO=ULTIMA_VERSAO_NAO_E_A_PRODUCAO_PARE_E_REVISE`;
- nenhum upload de candidata, promoção ou alteração de tráfego ocorreu nessa execução.

Causa: o gate `worker/scripts/deploy-safe.mjs` exige que a Worker Version mais recente seja a produção ou uma candidata órfã criada pelo próprio `portal-safe-deploy`. A homologação 5E, porém, encerrou corretamente criando uma Worker Version **preview-only** mais recente, com alias/tag próprios `central-docs-phase5e`, sem promovê-la à produção. O gate interpretava esse artefato legítimo e isolado como versão de origem desconhecida.

Correção em `fix/worker-safe-deploy-isolated-5e-preview-20260920`:
- reconhecer preview 5E somente quando **alias + tag + mensagem** coincidirem exatamente com o perfil oficial;
- não tratar esse preview como candidata produtiva nem exigir equivalência de bindings, pois o wrapper 5E é deliberadamente reduzido;
- preservar a prova anterior de que produção é outra versão única em 100%;
- manter fail-closed para qualquer versão desconhecida ou annotation divergente;
- adicionar regressões automatizadas para o trio exato e casos negativos.

Decisão descartada: não habilitar Worker Previews globalmente, não apagar versões 5E manualmente e não enfraquecer `ULTIMA_VERSAO_NAO_E_A_PRODUCAO_PARE_E_REVISE`. A correção é específica para o artefato preview-only já governado.

**Próxima ação exata:** validar CI da correção, mesclar se verde e observar o Workers Builds da `main`. O esperado é o gate reconhecer o preview 5E isolado, prosseguir para dry-run/upload sem tráfego, validar bindings/secrets/AUTH_DB, promover a candidata e emitir `DEPLOY_SEGURO_CONCLUIDO`. Só então testar o botão IA documental em produção.


## Publicação produtiva da IA documental — DEPLOY CONCLUÍDO — 20/09/2026

A correção do gate foi integrada pela PR **#347**, merge `fc4fde95db6c8f044d37337e0d142c2928c16fbf`.

Validação pré-merge da correção:
- **22/22 workflows** do head funcional concluíram com `success`;
- gate de deploy seguro: sucesso;
- Central de Documentos Fases 1–6: sucesso;
- governança: sucesso;
- testes específicos do novo reconhecimento de preview isolado: sucesso.

Resultado real do Workers Builds após o merge:
- check `Workers Builds: yellow-wave-d0a1guia-regulacao-ia`: **success**;
- Build ID `f95e0e2c-3811-43fd-a986-67d46dc065bb`;
- nova Worker Version produtiva: `1c2458f8-76f9-4050-8f10-a9e6b5fbec37`;
- Cloudflare Pages do mesmo merge: **success**;
- o bloqueio `ULTIMA_VERSAO_NAO_E_A_PRODUCAO_PARE_E_REVISE` não reapareceu.

Conclusão: a publicação técnica da IA documental está concluída. A produção agora corresponde ao estado versionado:
- `DOCUMENTS_AI_ENABLED=true`;
- `DOCUMENTS_AI_PROCESSING_ENABLED=true`;
- `DOCUMENTS_AI_BACKGROUND_ENABLED=false`;
- `DOCUMENTS_AI_FREE_ONLY=true`;
- `DOCUMENTS_AI_FAST_VISION_ENABLED=false`.

A capability `extract` continua sendo obrigatória no backend. Nenhuma permissão foi ampliada automaticamente e nenhuma automação antecipatória foi ativada.

**Validação humana ainda pendente:** no Portal real, recarregar a Central, abrir um PDF permitido e confirmar que o botão **IA documental** aparece para uma conta que já possua `extract`; abrir o painel e executar uma extração normal por clique. Se o botão não aparecer, verificar primeiro a capability da conta antes de alterar gates.

### Handoff atualizado
- **Fase atual:** Fase 6 — Automação operacional; publicação normal da IA concluída.
- **Última ação concluída:** PR #349 integrada; pós-merge com 27/27 checks verdes e deploy seguro do Worker concluído com sucesso.
- **Bloqueio anterior:** resolvido pela PR #347; preview 5E isolado deixa de bloquear o gate sem enfraquecer versões desconhecidas.
- **Background IA:** continua `false`.
- **Próxima ação exata:** teste real do botão/painel/extrator IA com conta `extract`; depois continuar homologação operacional da Fase 6.


## Revisão geral pós-publicação — sem regressão funcional encontrada — 20/09/2026

Revisão somente de consistência realizada após a publicação da IA documental.

Evidências:
- `main` em `f40b8dffc75e188cf302b8a2346719c91ec7520f` na entrada da revisão;
- **27/27 check-runs** do commit concluídos com `success`;
- Workers Builds `success`, Worker Version `2ee1b3f2-77f6-4f78-a19f-327eabcb0d8d`;
- Cloudflare Pages `success`;
- `DOCUMENTS_AI_ENABLED=true`;
- `DOCUMENTS_AI_PROCESSING_ENABLED=true`;
- `DOCUMENTS_AI_BACKGROUND_ENABLED=false`;
- `DOCUMENTS_AI_FREE_ONLY=true`;
- `DOCUMENTS_AI_FAST_VISION_ENABLED=false`;
- binding `AI` presente;
- rotas de IA continuam exigindo capability `extract` no backend;
- provider documental continua sem `GEMINI_API_KEY`, sem endpoint Gemini externo e sem AI Gateway;
- observabilidade documental/background permanece sob allowlist técnica, sem conteúdo documental.

Correções de manutenção identificadas nesta revisão:
- nomenclatura de um teste ainda dizia “produção continua fail-closed”, embora suas próprias asserções já exigissem IA normal ativa; corrigido apenas o nome do teste;
- documento de publicação mantinha uma seção intermediária que podia ser lida como estado atual; marcada explicitamente como histórica;
- handoff/status ainda apontava para a primeira Worker Version do rollout e para referências V7; atualizado para V8C.2 e para a Worker Version produtiva atual;
- texto da homologação 6 ainda tratava `enabled=true` como futuro; alinhado ao estado atual;
- PR antiga **#172** da 3C.1f estava aberta, não mergeável e fortemente divergente da arquitetura atual; foi encerrada como obsoleta/supersedida, com justificativa registrada no próprio PR.

Nenhuma alteração funcional da IA, editor, Drive, OAuth, permissões ou observabilidade foi necessária nesta revisão.

Nota de governança: o UUID da Worker Version **não deve ser tratado como identificador estável no handoff**, porque qualquer commit novo em `main` aciona o Workers Builds e gera outra versão mesmo quando a mudança é somente documental. A referência operacional correta é: `main` + check `Workers Builds` concluído com sucesso; UUIDs específicos permanecem apenas como evidência histórica do commit que os gerou.

A PR #349, que integrou estas correções de manutenção, concluiu o pós-merge com **27/27 checks verdes** e Workers Builds `success`. A versão gerada por esse commit foi `ca0197db-1f06-4151-87fb-5162c3747ecb`; não tratá-la como constante eterna.

**Próxima ação exata:** validar no navegador real o botão/painel/extrator com conta que possua `extract`; depois concluir a matriz operacional da Fase 6.


## UX da Central — lista integral e Titon integral — IMPLEMENTAÇÃO PARA VALIDAÇÃO — 20/09/2026

Decisão aprovada pelo operador durante a Fase 6: remover a divisão permanente de tela entre lista e visualizador/editor. A mudança resolve a baixa largura disponível para nomes de arquivos sem introduzir letreiro ou animação contínua.

Escopo implementado na branch `feat/central-docs-titon-fullscreen-20260920`:
- a lista passa a ocupar a largura integral da área da Central;
- Titon e lista usam a mesma célula de layout, com Titon em primeiro plano enquanto um PDF está aberto;
- a lista não é desmontada, recarregada nem consultada novamente ao fechar o Titon;
- desktop: clique simples seleciona; duplo clique abre; `Enter` abre o item selecionado;
- mobile/touch: botão explícito **Abrir no Titon**;
- X do Titon fecha somente o documento e devolve foco ao item selecionado;
- browser/lista ficam `inert` enquanto Titon está em primeiro plano, evitando foco de teclado em controles invisíveis;
- durante **Unir PDF**, o painel ganhou **Escolher PDF da Central**; a lista pode vir temporariamente ao primeiro plano sem destruir a sessão do editor e retorna ao Titon após selecionar o PDF;
- `Escape` cancela somente esse modo temporário de seleção para união.

Preservado:
- permissões/capabilities;
- OAuth e Drive;
- cache criptografado;
- autosync e regras da Fase 4;
- IA documental V8C.2;
- background da IA continua `false`;
- observabilidade sem conteúdo sensível.

Alternativa descartada: letreiro/marquee para nomes longos. O problema é resolvido estruturalmente oferecendo largura integral à lista.

Risco principal tratado: a união de outro PDF dependia da lista lateral visível. A nova ação **Escolher PDF da Central** preserva esse fluxo sem reintroduzir a divisão permanente.

**Próxima ação exata:** CI/PR desta implementação; se verde, integrar e publicar. Depois o operador fará validação visual real de largura, duplo clique, Enter, botão mobile, X com retorno ao mesmo ponto e união de PDFs. A Fase 6 continua aberta até seu aceite operacional completo.


## UX lista integral + Titon integral — INTEGRADA E PUBLICADA PARA VALIDAÇÃO — 21/09/2026

A implementação aprovada pelo operador foi integrada pela PR **#351**, merge `d0bdbfa1ed8122af97bb0e59a746eeb632858744`.

Evidências antes do merge:
- head funcional final: `6647b4c498be90cfd60d0f2186b263dc5ef2384e`;
- **23/23 workflows** do PR concluídos com `success`;
- workflow de navegador com PDF.js real: **75 passed / 3 skipped esperados** em desktop e mobile;
- validação Fases 1–6, bundle de staging, governança e demais checks: verdes;
- revisão final removeu `aria-hidden` da alternância entre superfícies e manteve `inert`, evitando conflito de foco/acessibilidade ao trazer a lista para o primeiro plano durante a união de PDFs.

Evidências pós-merge:
- **27/27 checks** do merge concluídos com `success`;
- Cloudflare Pages: `success`;
- Workers Builds: `success`;
- Worker Version gerada pelo merge: `599d1a5c-dd43-4b87-8d28-6221fac8d141` — evidência histórica, não identificador permanente.

Estado publicado para validação humana:
- lista usa toda a largura da Central;
- desktop: clique simples seleciona PDF, duplo clique abre no Titon e `Enter` abre o selecionado;
- mobile/touch: botão **Abrir no Titon**;
- Titon usa a mesma superfície integral em primeiro plano;
- lista permanece viva em segundo plano, sem nova consulta ao Drive apenas por fechar o Titon;
- X retorna à lista preservada e devolve foco ao item selecionado;
- **Unir PDF** preservado pela ação **Escolher PDF da Central**, que alterna temporariamente a lista para primeiro plano sem destruir a sessão do editor.

A **Fase 6 continua formalmente aberta**. Esta publicação não substitui a homologação operacional real.

**Próxima ação exata:** o operador deve validar no navegador real: largura integral da lista; seleção por clique; abertura por duplo clique e Enter; botão mobile; Titon integral; X retornando à mesma pesquisa/pasta/posição; união via **Escolher PDF da Central**; e depois concluir os demais casos da matriz operacional da Fase 6.


## Titon — nome real no Drive, zoom legível e presença simultânea — EM IMPLEMENTAÇÃO — 21/09/2026

Nova decisão operacional aprovada pelo operador durante a Fase 6.

Motivação:
- o título do PDF no Titon precisa ser editável sem separar interface e arquivo real;
- o percentual de zoom já existia, mas estava praticamente invisível por contraste inadequado;
- dois operadores podem abrir o mesmo encaminhamento e, sem saber um do outro, solicitar a mesma especialidade/procedimento em duplicidade.

Branch: `feat/central-docs-titon-rename-presence-20260921`.

Escopo implementado:
- renomeação do arquivo real do Google Drive por `PATCH`, com capability `edit`, gate de escrita e verificação de `version`;
- extensão `.pdf` protegida; clique seleciona, duplo clique edita, Enter confirma e Esc cancela;
- atualização local de lista/Titon após confirmação, sem exigir relistagem;
- percentual de zoom mantido entre −/+ e corrigido para cor escura legível;
- presença efêmera em D1, heartbeat 25 s e TTL 75 s;
- chave do documento derivada por HMAC, sem fileId/nome/ref em claro no registro de presença;
- modos `view` e `edit`;
- borda laranja para outro usuário visualizando e destaque mais forte para outro usuário editando;
- aviso informativo, não bloqueante;
- mesma conta/username em duas abas não gera falso alerta;
- presença excluída da observabilidade analítica.

Regra permanente confirmada: alterações **confirmadas** do Titon devem sincronizar com o arquivo real do Drive. Estados provisórios permanecem locais até confirmação. A proteção de conflito/versionamento da Fase 4 permanece obrigatória.

Alternativas descartadas:
- renomear somente a legenda local do Titon;
- bloquear totalmente o PDF quando outro operador estiver presente;
- enviar nome/ref/fileId do documento à telemetria para correlacionar presença.

Riscos tratados:
- metadado de nome pode incrementar `version`; a resposta confirmada atualiza a baseline do Titon;
- se conteúdo mudar durante a renomeação, a baseline não é adotada silenciosamente;
- fechamento abrupto pode não executar release; TTL de 75 s remove presença órfã.

**Próxima ação exata:** concluir integração do cliente/testes, abrir PR, validar suíte e navegador, corrigir qualquer regressão antes de merge. Após publicação, validar com duas contas reais e concluir junto da matriz operacional da Fase 6.


## Titon — renomeação real, zoom legível e presença simultânea — INTEGRADO E PUBLICADO — 21/09/2026

A implementação foi integrada pela PR **#353**, merge `b7ef4ad6d91a001ef0af998b7d38821218b12846`.

Validação pré-merge do head funcional `7ec5fef8426697d74f5d774bcae95a4bdc63dbc8`:
- **23/23 workflows GitHub Actions** do conjunto final concluídos com `success`;
- navegador/PDF.js real: **75 passed / 3 skipped esperados** em desktop e mobile;
- Cloudflare Pages da branch: `success`;
- o check externo Workers Builds da branch falhou apenas ao tentar criar Worker Preview, recurso desabilitado para branches não-`main`; isso foi registrado no PR e não houve promoção/bypass produtivo;
- testes adicionados validaram renomeação real via Drive PATCH, versionamento, presença por HMAC, deduplicação de abas do mesmo operador e ausência de identidade documental no armazenamento/telemetria de presença.

Resultado pós-merge em `main`:
- **27/27 check-runs** concluídos com `success`;
- Cloudflare Pages: `success`;
- Workers Builds produtivo: `success`;
- gate seguro do Worker não foi contornado;
- Worker Version gerada por esse merge: `a887b4fa-4a08-4b8b-887f-051d1c0696df` — somente evidência histórica do deploy, não identificador permanente.

Estado publicado:
- título do PDF selecionável com um clique;
- duplo clique habilita renomeação;
- `.pdf` permanece protegido;
- `Enter` confirma no arquivo real do Google Drive e `Escape` cancela;
- renomeação disponível em visualização e edição para conta com capability `edit` e escrita Drive habilitada;
- percentual de zoom agora é legível em cor escura e continua atualizado pelo PDF.js;
- presença simultânea usa heartbeat de 25 s / TTL 75 s;
- outro operador no mesmo PDF gera borda laranja + aviso;
- outro operador editando gera destaque mais forte e alerta explícito contra solicitação duplicada;
- presença é informativa, não bloqueante;
- conflito/versionamento do Drive continua autoridade final;
- D1 de presença guarda chave HMAC opaca, sessão efêmera, identidade institucional, modo e expiração — sem fileId/nome/ref/conteúdo do documento;
- presença não é enviada ao PostHog.

Regra permanente preservada: alterações confirmadas no Titon devem refletir o arquivo real no Drive; estados provisórios continuam locais até confirmação.

**Fase atual:** Fase 6 — Automação operacional, ainda não formalmente encerrada.

**Próxima ação exata:** validação humana no Portal real: renomear em visualização e editor, confirmar nome no Drive, testar Enter/Escape, verificar zoom, abrir o mesmo PDF com duas contas para observar presença view/edit e então continuar/encerrar a matriz operacional da Fase 6 conforme os critérios já documentados.


## IA documental — painel compacto e resultados por categoria — EM IMPLEMENTAÇÃO — 21/09/2026

Decisão aprovada pelo operador: retirar textos explicativos do fluxo principal da IA documental e priorizar a ação operacional.

Branch: `feat/central-docs-ai-compact-results-20260921`.

Escopo:
- painel inicial reduzido para **Extrair dados do PDF**;
- botão discreto **i** abre informações de segurança/proveniência e detalhes técnicos;
- chat fica oculto antes da extração e recolhido por padrão depois;
- resultados organizados por página e por categorias: Paciente, Encaminhamento, Solicitação e Profissional;
- botão **Copiar** em cada campo, copiando somente o valor exibido;
- permanecem **Ver página**, **Copiar esta página** e **Copiar tudo**;
- status operacional reduzido para mensagens curtas.

Impacto de IA: **zero chamadas adicionais**. A categorização e as cópias usam somente o JSON estruturado já retornado pela V8C.2 no navegador; não alteram provider, prompt, tokens, neurons, modelos ou backend de inferência.

**Próxima ação exata:** validar CI/PR; se verde, integrar/publicar e pedir aceite visual do operador dentro da matriz ainda aberta da Fase 6.


## IA documental — painel compacto e resultados por categoria — INTEGRADO E PUBLICADO — 21/09/2026

A implementação foi integrada pela PR **#355**, merge `e913e96843060b21d7ba8a0f3922b2fd386f428b`.

Validação pré-merge do head `95b93180e258a1d4a885e472939fd46992ba3ef4`:
- **23/23 workflows GitHub Actions** do conjunto final concluídos com `success`;
- validação Fases 1–6: `success`;
- navegador/PDF.js real: `success`;
- Cloudflare Pages da branch: `success`;
- Workers Builds da branch falhou somente ao tentar Worker Preview, recurso indisponível fora da `main`, sem bypass produtivo;
- testes confirmam que agrupamento e cópia não executam `fetch`/API e portanto não geram nova inferência.

Resultado pós-merge em `main`:
- **27/27 check-runs** concluídos com `success`;
- Cloudflare Pages: `success`;
- Workers Builds produtivo: `success`;
- Worker Version gerada por esse merge: `ce5c9377-96c1-4436-af89-2f783edcb10b` — evidência histórica, não identificador permanente.

Estado publicado:
- painel inicial da IA mostra essencialmente **Extrair dados do PDF**;
- textos explicativos, regras de proveniência e detalhes técnicos ficam atrás do botão **i**;
- chat fica oculto antes da extração e recolhido por padrão depois;
- resultados permanecem separados por página;
- campos são agrupados visualmente em Paciente, Encaminhamento, Solicitação e Profissional conforme existirem naquela página;
- cada campo possui cópia individual do valor exibido;
- permanecem Ver página, Copiar esta página e Copiar tudo;
- nenhuma alteração em prompt, provider, modelo, concorrência, tokens, neurons ou gates.

**Fase atual:** Fase 6 ainda aberta para homologação operacional humana.

**Próxima ação exata:** o operador deve atualizar a Central com Ctrl+F5, abrir a IA em um PDF real, confirmar o painel compacto, extrair e validar a organização/cópia individual. Esse aceite entra na matriz restante da Fase 6.


## Lista de PDFs — limpeza visual e vermelho Ferrari — EM IMPLEMENTAÇÃO — 21/09/2026

Ajuste visual solicitado durante a homologação da Fase 6.

Escopo:
- remover da lista o texto auxiliar **“Duplo clique ou Enter”**;
- manter exatamente os mesmos atalhos de abertura por duplo clique e `Enter`;
- preservar o botão **Abrir no Titon** em mobile/touch;
- trocar o visual azul do selo **PDF** para vermelho Ferrari `#ff2800`, com fundo vermelho muito claro para contraste;
- trocar o marcador vertical do item selecionado para o mesmo vermelho Ferrari;
- harmonizar o fundo do item selecionado com um tom vermelho muito claro;
- ocultar a coluna de ação quando estiver vazia;
- ações temporárias do fluxo **Unir PDF** — “Já no editor” e “Selecionar para unir” — permanecem quando necessárias.

Nenhuma alteração em Drive, Titon, IA, permissões, presença simultânea ou regra de abertura.

Branch: `feat/central-docs-list-ferrari-red-20260921`.

**Próxima ação exata:** validar CI/PR; se verde, integrar/publicar e colher aceite visual na Central real. A Fase 6 continua aberta.


## Lista de PDFs — limpeza visual e vermelho Ferrari — INTEGRADO E PUBLICADO — 21/09/2026

Ajuste integrado pela PR **#357**, merge `10f87f832fd3187a372f1d65cb6af1aed391cd5e`.

Resultado:
- texto auxiliar **“Duplo clique ou Enter”** removido da lista;
- duplo clique e `Enter` continuam funcionando normalmente;
- botão **Abrir no Titon** permanece no mobile/touch;
- selo **PDF** passou para vermelho Ferrari `#ff2800`, com fundo vermelho muito claro;
- marcador vertical do item selecionado usa o mesmo vermelho Ferrari;
- fundo selecionado foi harmonizado com tom vermelho muito claro;
- coluna de ação fica oculta quando vazia;
- ações **Já no editor** e **Selecionar para unir** continuam aparecendo quando o fluxo de união exige.

Validação:
- 23/23 workflows GitHub Actions no PR: `success`;
- Cloudflare Pages da branch: `success`;
- pós-merge em `main`: **27/27 check-runs** `success`;
- Workers Builds produtivo: `success`;
- nenhuma alteração em Drive, IA, Titon, presença simultânea, permissões ou regras de negócio.

**Fase atual:** Fase 6 ainda aberta para homologação operacional humana.
**Próxima ação exata:** operador validar visualmente a lista em produção; depois continuar a matriz restante da Fase 6.


## Navegação da lista — pastas com a mesma lógica dos PDFs — EM IMPLEMENTAÇÃO — 21/09/2026

Ajuste solicitado na homologação da Fase 6 para eliminar comportamento inconsistente entre arquivos e pastas.

Contrato:
- desktop: um clique em PDF **ou pasta** apenas seleciona/destaca;
- duplo clique abre o item selecionado;
- `Enter` permanece como atalho de teclado aprovado;
- a pasta deixa de abrir no primeiro clique;
- o texto lateral **Abrir pasta** deixa de aparecer no desktop;
- em mobile/touch, onde duplo clique não é confiável, permanece uma ação explícita **Abrir pasta**, equivalente ao **Abrir no Titon** dos PDFs.

Nenhuma alteração em Google Drive, pesquisa, breadcrumbs, Titon, IA, permissões ou cache.

Branch: `feat/central-docs-folder-double-click-20260921`.

**Próxima ação exata:** validar CI/PR; se verde, publicar e confirmar no navegador real que pasta/PDF têm o mesmo comportamento de seleção no desktop. A Fase 6 continua aberta.


## Navegação da lista — pastas com a mesma lógica dos PDFs — INTEGRADO E PUBLICADO — 21/09/2026

Ajuste integrado pela PR **#359**, merge `d92ae6f5caf57ec2108071f6ba2c02deb6134a2d`.

Resultado publicado:
- desktop: clique simples em **pasta ou PDF** apenas seleciona/destaca;
- duplo clique abre pasta ou PDF;
- `Enter` permanece como atalho de teclado para abrir o item selecionado;
- pasta não abre mais no primeiro clique;
- texto lateral **Abrir pasta** removido no desktop;
- mobile/touch mantém ação explícita **Abrir pasta**, assim como **Abrir no Titon** para PDF.

Validação:
- conjunto final do PR com **23/23 workflows GitHub Actions** verdes;
- workflow de navegador teve uma falha transitória não relacionada em um teste de merge do editor e passou no rerun sem mudança funcional adicional;
- Cloudflare Pages da branch: `success`;
- pós-merge em `main`: **27/27 check-runs** `success`;
- Workers Builds produtivo: `success`;
- nenhuma alteração em Drive, busca, breadcrumbs, Titon, IA, permissões ou cache.

**Fase atual:** Fase 6 ainda aberta para homologação operacional humana.
**Próxima ação exata:** operador validar no navegador real que pastas e PDFs têm o mesmo comportamento de seleção no desktop; depois continuar a matriz restante da Fase 6.

## Titon — ordem personalizável, cópia confirmada e renomeação com feedback do Drive — EM IMPLEMENTAÇÃO — 21/09/2026

A partir do uso real gravado pelo operador, foram aprovados **somente** três refinamentos. As demais ideias avaliadas não entram neste escopo.

Branch: `feat/titon-field-order-copy-rename-feedback-20260921`.

Escopo aprovado:
- permitir reorganizar a ordem dos campos copiáveis da IA documental;
- persistir somente a sequência validada de chaves/tipos de campo no backend de preferências, por usuário institucional, sem conteúdo clínico ou identidade documental;
- após cópia individual bem-sucedida, trocar o botão para **✓ Copiado** e destacar o campo enquanto o PDF estiver aberto;
- exibir no cabeçalho do Titon o estado da renomeação;
- `Enter` e clique fora confirmam a renomeação;
- a confirmação visual de sucesso só aparece depois da resposta efetiva do endpoint de renomeação do Drive;
- erro deixa explícito que o nome não foi alterado;
- `Escape` continua cancelando;
- `.pdf`, capability `edit`, gate de escrita, versionamento/conflito e PATCH real do Google Drive permanecem obrigatórios.

Decisão técnica importante:
- a renomeação **já** era persistida no Google Drive por `PATCH /api/documents/drive/rename`; o problema observado era principalmente falta de feedback visível e o fato de `blur` cancelar a edição. O novo contrato não cria uma gravação paralela: ele usa o mesmo caminho seguro existente e torna a confirmação explícita.
- a primeira implementação de preferência local foi descartada porque a Central possui contrato explícito que proíbe `localStorage`/`sessionStorage`/IndexedDB para persistência documental. A ordem agora usa a API `/api/documents/preferences` e uma tabela D1 específica por conta, contendo somente chaves de campo validadas; nenhum valor extraído, PDF, fileId/ref, paciente ou conteúdo documental é gravado.
- reorganização e feedback de cópia são puramente de interface; zero novas inferências e zero novas chamadas de IA.

Arquivos em alteração:
- `js/documents.js`;
- `documentos/index.html`;
- `css/documents.css`;
- testes de UI;
- documentação da Fase 6/homologação/status.

**Fase atual:** Fase 6 — Automação operacional, homologação humana ainda aberta.

**Próxima ação exata:** concluir testes/CI desta branch, abrir PR e integrar somente se os checks relevantes ficarem verdes; após publicação, validar os Casos 10–12 no Portal real.

## Titon — ordem personalizável, confirmação de cópia e renomeação sincronizada — INTEGRADO NA MAIN — 21/09/2026

A PR **#361** foi integrada na `main` pelo merge `a6bfa6d9ed886102aec4ba90eb6e014fcdb121e2`.

Validação do head funcional `24fc6c3e04b9af31c8428b1040750668b24835f0`:
- **23/23 workflows GitHub Actions** do conjunto final concluídos com `success`;
- Central de Documentos — Fases 1–6: `success`;
- navegador/PDF.js real: `success`;
- governança e bundle de staging: `success`;
- PR mergeável e integrada sem bypass de proteção.

Resultado integrado:
- **Organizar campos** permite personalizar a ordem dos tipos de campo copiáveis;
- a preferência fica vinculada à conta institucional por `/api/documents/preferences`;
- o backend grava somente a sequência validada de chaves em `auth_document_ai_preferences`; não grava valores extraídos, PDF, ref/fileId ou conteúdo clínico;
- a alternativa inicial em `localStorage` foi descartada durante o CI por contrariar o contrato de persistência da Central;
- após cópia individual bem-sucedida, o botão passa para **Copiado** e o campo recebe destaque visual de sucesso durante a sessão do PDF;
- ao renomear, o Titon mostra **Sincronizando nome com o Google Drive…** durante a gravação;
- o sucesso **Nome alterado e sincronizado com o Google Drive.** só aparece após resposta positiva do endpoint real de renomeação;
- erro informa explicitamente que o nome não foi alterado;
- `Enter` e perda de foco confirmam a renomeação; `Escape` cancela;
- renomeação continua protegida por capability `edit`, gate de escrita, `baseVersion` e `PATCH /api/documents/drive/rename`;
- zero novas inferências ou chamadas de IA foram adicionadas.

**Fase atual:** Fase 6 — Automação operacional. A implementação está integrada; falta homologação operacional humana destes três refinamentos.

**Próxima ação exata:** no Portal real, atualizar com Ctrl+F5 e validar os Casos 10–12: reorganizar campos e reabrir para confirmar persistência da conta; copiar campos e conferir o estado **Copiado**; renomear uma vez com `Enter` e outra clicando fora, verificando a confirmação visual e o nome efetivo no Google Drive.

## Titon — seleção e cópia direta de texto do PDF — EM IMPLEMENTAÇÃO — 21/09/2026

Refinamento solicitado durante a homologação real da Fase 6.

Branch: `feat/titon-selectable-pdf-text-20260921`.

Escopo:
- adicionar uma camada `TextLayer` do PDF.js sobre cada página renderizada;
- permitir seleção nativa do navegador e cópia com `Ctrl+C` em PDFs que contenham texto interno;
- preservar o canvas atual como superfície visual;
- manter texto transparente na camada, usando somente o destaque de seleção do navegador;
- manter a camada sincronizada com zoom e com o viewport de recorte;
- carregar/descarregar a camada junto do ciclo lazy das páginas;
- impedir que a camada capture ponteiros enquanto ferramentas interativas de edição estiverem ativas;
- não adicionar OCR, IA, backend ou escrita no Drive.

Decisões:
- usar a `TextLayer` já exportada pelo PDF.js self-hosted 6.3.289, em vez de criar posicionamento textual próprio;
- documentos escaneados sem texto interno permanecem sem seleção; OCR foi explicitamente deixado fora deste escopo;
- seleção/cópia é somente leitura e não entra na observabilidade com conteúdo.

Arquivos em alteração:
- `js/document-viewer.js`;
- `css/documents.css`;
- `documentos/index.html`;
- `worker/tests/documents-ui.test.mjs`;
- documentação/homologação/status da Fase 6.

**Fase atual:** Fase 6 — Automação operacional, homologação humana ainda aberta.

**Próxima ação exata:** validar sintaxe e CI da branch, integrar apenas se os checks relevantes ficarem verdes e então executar o Caso 13 em um PDF textual real e um PDF escaneado.

## Titon — seleção e cópia direta de texto do PDF — INTEGRADO NA MAIN — 21/09/2026

A implementação foi integrada pela PR **#364**, merge `4758a9848258aed0e268a2f239b13325e46a359e`.

Validação do head funcional final `83b632243860fcf31c1da1811d51ad4354a35f40`:
- **23/23 workflows GitHub Actions** concluídos com `success`;
- Central de Documentos — Fases 1–6: `success`;
- navegador/PDF.js real em Chromium: `success`;
- governança, bundle de staging e validações transversais: `success`;
- branch ficou **0 commits atrás da main** antes da integração e a PR foi mesclada com `expected_head_sha`, sem bypass de proteção.

Estado integrado:
- PDFs com texto interno recebem uma `TextLayer` do PDF.js sobre o canvas do Titon;
- o usuário pode selecionar texto nativamente com o mouse e copiar com `Ctrl+C`/ação de copiar do navegador;
- o texto da camada permanece transparente; somente o realce de seleção é visível sobre a página;
- a camada acompanha escala/zoom, rotação da página e o mesmo viewport de recorte do canvas;
- carregamento e descarregamento permanecem lazy junto das páginas visíveis;
- Selecionar/mover, Escrever, Colar imagem, Desenhar/Borracha e Recortar assumem os gestos da página enquanto ativos, desabilitando a captura de ponteiros da camada textual;
- voltar ao modo sem ferramenta interativa reabilita a seleção;
- seleção/cópia não modifica o PDF, não sincroniza com Drive, não chama IA e não envia conteúdo à observabilidade;
- PDF puramente escaneado/imagem continua abrindo normalmente, porém sem texto selecionável; OCR continua fora deste escopo.

Cache-busters integrados:
- `/js/document-viewer.js?v=20260921-1`;
- `/css/documents.css?v=20260921-6`.

Limitação de evidência pós-merge: o navegador de pesquisa externo não conseguiu acessar diretamente a rota pública `/documentos/`; portanto a evidência final disponível neste ponto é a integração na `main` + CI integral verde. A homologação real deve ser feita pelo operador no Portal autenticado.

**Fase atual:** Fase 6 — Automação operacional, ainda aberta para homologação operacional humana.

**Próxima ação exata:** atualizar a Central com `Ctrl+F5`, abrir um PDF textual real, selecionar uma palavra/linha/parágrafo e copiar com `Ctrl+C`; repetir após mudar o zoom e depois confirmar que as ferramentas do editor continuam recebendo seus gestos. Em seguida abrir um PDF escaneado para confirmar que ele permanece visualizável sem seleção textual.

## Titon — OCR local para scans do HP Smart — EM IMPLEMENTAÇÃO — 21/09/2026

Descoberta operacional: os PDFs digitalizados pelo HP Smart usados pelo setor são, em muitos casos, PDFs-imagem. A `TextLayer` nativa integrada anteriormente deixa o cursor preparado, mas não existe texto PDF para selecionar.

Decisão aprovada pelo operador: o Titon deve reconhecer automaticamente essas páginas e criar uma camada invisível selecionável.

Branch: `feat/titon-ocr-scanned-pdf-20260921`.

Arquitetura implementada na branch:
- novo `js/document-ocr.js`, responsável por OCR local no navegador;
- Tesseract.js 7.0.0 + tesseract.js-core 7.0.0 + modelo português `por` 1.0.0 vendorizados em `vendor/tesseract/`;
- vendorização inicial foi feita por workflow temporário de branch; após materializar os arquivos, o workflow foi **removido** e não fará parte da solução final;
- os fallbacks internos de jsDelivr dos bundles Tesseract foram substituídos por rotas same-origin, evitando saída acidental para CDN;
- `workerBlobURL:false`;
- `cacheMethod:'none'`;
- CSP da Central: `wasm-unsafe-eval` + `worker-src 'self'`, sem `unsafe-eval`;
- OCR só entra quando a TextLayer nativa está vazia;
- fila serial, priorizando página ativa/visível;
- páginas offscreen ainda não iniciadas são retiradas da fila;
- raster OCR limitado a ~1900 px no maior lado e teto de pixels para controlar memória;
- resultado reduzido a linhas + caixas é guardado somente em memória na sessão;
- zoom reutiliza o resultado OCR sem nova inferência;
- fechar/trocar PDF limpa cache/fila OCR;
- nenhuma imagem ou texto OCR é enviado a backend, IA, Drive ou PostHog.

UX:
- cursor de texto só aparece quando `data-selectable-text` é `native` ou `ocr`;
- scans mostram status transitório **Preparando leitura / Lendo texto / Texto pronto para selecionar**;
- seleção/Ctrl+C usa o comportamento nativo do navegador;
- editor continua dono dos gestos enquanto ferramentas interativas estão ativas;
- falha ou ausência de texto reconhecido não bloqueia o visualizador.

Infra de teste/bundle também foi atualizada:
- staging e homologação copiam `document-ocr.js` + `vendor/tesseract/`;
- headers de staging permitem WASM local;
- workflow de navegador valida assets OCR e ausência de CDN;
- novo teste Playwright gera um PDF sintético **somente-imagem**, executa OCR real no Chromium, seleciona texto, testa zoom e verifica zero tráfego externo.

**Fase atual:** Fase 6 — Automação operacional, ainda aberta.

**Próxima ação exata:** concluir CI da implementação OCR; integrar somente com os checks relevantes verdes; depois homologar no Portal autenticado com um PDF real do HP Smart e registrar o resultado.

## Titon — OCR local para scans do HP Smart — INTEGRADO NA MAIN — 21/09/2026

A implementação foi integrada pela PR **#368**, merge `f4f443f502c5351048eeae4833b7b1d2fffdf090`.

Validação do head funcional final `4313897e6688c6513ed39bcb3ed1ce9e13d85ae0`:
- **25/25 workflows GitHub Actions** concluídos com `success`;
- Central de Documentos — Fases 1–6: `success`;
- bundle de staging: `success`;
- governança: `success`;
- navegador/PDF.js real em Chromium: `success`;
- suíte do navegador executou **80 casos**, com **76 aprovados e 4 skips esperados**;
- caso OCR real em desktop: `success` em **1,7 s** sobre PDF sintético composto somente por imagem;
- o caso OCR comprovou criação de camada selecionável e **zero tráfego HTTP(S) para host externo**;
- o caso pesado foi deliberadamente pulado no projeto mobile; os demais testes mobile continuaram verdes;
- branch ficou **0 commits atrás da main** antes do merge e foi integrada usando `expected_head_sha`, sem bypass de proteção.

Resultado integrado:
- PDF com texto nativo continua usando a `TextLayer` do PDF.js imediatamente e não executa OCR;
- PDF-imagem/scan sem texto entra automaticamente em OCR local;
- Tesseract.js 7.0.0, core 7.0.0 e modelo português estão self-hosted sob `vendor/tesseract/`;
- fallbacks de CDN dos bundles vendorizados foram removidos/substituídos por rotas same-origin;
- OCR é serial e lazy por página, priorizando página ativa/visível;
- resultado OCR fica somente na memória da sessão e é reutilizado ao mudar o zoom;
- fechar/trocar PDF descarta fila/cache OCR;
- cursor de texto aparece somente quando há texto selecionável real (`native` ou `ocr`);
- status transitório informa preparação/leitura e **Texto pronto para selecionar**;
- seleção e `Ctrl+C` usam o comportamento nativo do navegador;
- OCR não altera o PDF, não grava no Google Drive e não chama IA Documental;
- nenhuma imagem ou texto reconhecido é enviado a backend, serviço OCR externo ou PostHog;
- `workerBlobURL:false` e `cacheMethod:'none'` evitam Worker blob e persistência do modelo em IndexedDB;
- CSP da Central permite somente WebAssembly local por `wasm-unsafe-eval` e Worker same-origin; `unsafe-eval` não foi habilitado;
- ferramentas de edição continuam tendo prioridade sobre os gestos da página;
- falha de OCR é fail-soft: o PDF continua visualizável/editável.

Cache-busters integrados:
- `/js/document-ocr.js?v=20260921-1`;
- `/js/document-viewer.js?v=20260921-2`;
- `/css/documents.css?v=20260921-7`.

Evidência de publicação externa:
- a integração na `main` está comprovada;
- a rota pública do Portal não pôde ser consultada pelo navegador externo desta sessão, portanto não foi inventada confirmação de propagação do deploy;
- a validação final de produção será feita pelo operador autenticado após `Ctrl+F5`.

**Fase atual:** Fase 6 — Automação operacional, ainda aberta para homologação humana.

**Próxima ação exata:** operador deve atualizar a Central com `Ctrl+F5`, abrir um PDF real digitalizado pelo HP Smart, aguardar **Texto pronto para selecionar**, selecionar/copyar trechos e confirmar alinhamento/qualidade; em seguida alterar o zoom e repetir. Se aprovado, registrar o aceite do Caso 14 e continuar a matriz restante da Fase 6.



## Telemedicina — retry conservador da leitura do dashboard V41 — EM IMPLEMENTAÇÃO — 21/09/2026

Incidente transversal observado durante a Fase 6: `/telemedicina/` carregou a interface, mas a leitura do dashboard exibiu `Failed to fetch`; minutos depois voltou ao normal sem alteração de código. A abertura direta do endpoint respondeu corretamente com a barreira de autorização, confirmando que a rota e o Worker estavam acessíveis naquele momento.

Decisão: absorver somente falhas transitórias de rede na leitura `GET /api/telemedicina/dashboard`, com até duas repetições (350 ms e 900 ms). Erros HTTP reais não são repetidos e nenhuma operação `POST/PATCH/DELETE` entra no mecanismo, para não criar risco de duplicidade.

Branch isolada: `fix/telemedicina-dashboard-network-retry-20260921`.

Arquitetura: helper compartilhado `js/telemedicina-network-retry-v41.js`, consumido pelo carregamento desktop e pelo cache mobile. Teste focal prova sucesso após duas falhas de rede, ausência de retry em HTTP 503 e limite máximo de três tentativas totais.

Esta correção é transversal e **não altera a fase corrente da Central de Documentos**, que permanece na Fase 6 — Automação operacional, ainda aguardando homologação humana.

**Próxima ação exata:** abrir PR, executar os checks focais/transversais e integrar somente se verdes; depois confirmar em produção que a Telemedicina carrega normalmente. Não é necessário provocar uma falha de rede real para aceite.


## Telemedicina — retry conservador do dashboard V41 — INTEGRADO NA MAIN — 21/09/2026

A proteção transversal foi integrada pela PR **#370**, merge `a3fc815f11b3283acaa757f1830d1cdf4be71b7e`.

Contrato publicado no código:
- somente `GET /api/telemedicina/dashboard` pode ser repetido;
- após a tentativa inicial, existem no máximo **duas repetições**;
- atrasos curtos: **350 ms** e **900 ms**;
- retry somente para falhas de rede do navegador compatíveis com `Failed to fetch`, `NetworkError` ou `Load failed`;
- respostas HTTP reais do Worker não são repetidas;
- nenhuma operação `POST`, `PATCH` ou `DELETE` recebe retry;
- desktop e mobile usam o helper compartilhado `js/telemedicina-network-retry-v41.js`.

Evidência pré-merge do head funcional `3580d91bf03b24f52e9be6e6d9b5ec1f1b03142a`:
- **46/46 workflow runs** concluídos com `success`;
- branch **0 commits atrás da main**;
- teste focal comprovou sucesso após duas falhas transitórias, ausência de retry em HTTP 503 e teto de três tentativas totais;
- testes históricos/cache da Telemedicina foram alinhados ao novo cache-buster e voltaram a ficar verdes.

Justificativa: o incidente observado se recuperou sozinho sem deploy, compatível com oscilação transitória navegador → Worker. O retry é deliberadamente limitado à leitura idempotente para reduzir impacto operacional sem mascarar falhas HTTP reais e sem risco de duplicar gravações.

Esta correção **não altera a fase corrente da Central de Documentos**. A Central permanece na **Fase 6 — Automação operacional**, com a homologação humana já documentada como próxima frente.

**Próxima ação exata:** uso normal de `/telemedicina/`; se `Failed to fetch` reaparecer apesar das três tentativas totais, registrar horário e contexto para investigar uma indisponibilidade mais longa. Não provocar falha de rede artificial em produção.


## Titon — OCR local homologado em uso real — APROVADO — 21/09/2026

O operador confirmou no Portal autenticado que o OCR local integrado pela PR #368 está funcionando perfeitamente no fluxo real. A limitação observada não é uma regressão do OCR: manuscritos médicos podem continuar semanticamente ilegíveis mesmo quando há reconhecimento parcial.

Decisão: considerar o Caso 14 do OCR local aprovado em uso real e tratar a leitura manual de caligrafia como necessidade operacional separada, atendida por um rascunho efêmero que não altera nem persiste o documento.

## Titon — bloco de notas temporário para manuscritos — EM IMPLEMENTAÇÃO — 21/09/2026

Durante a validação real do OCR local, o operador confirmou que o reconhecimento está funcional e solicitou uma ferramenta mínima para os casos em que manuscritos médicos continuam ilegíveis para OCR.

Branch: `feat/titon-temporary-notepad-20260921`.

Escopo:
- botão pequeno de bloco de notas na barra lateral esquerda do Titon;
- janelinha compacta com campo de texto simples;
- `Ctrl+A` e `Ctrl+C` permanecem nativos do navegador;
- fechar/reabrir a janelinha mantém o rascunho enquanto o mesmo PDF estiver aberto;
- fechar ou trocar o PDF apaga o rascunho;
- `Escape` fecha a janelinha;
- sem salvar, autosave, backend, Drive, IA ou telemetria de conteúdo.

Justificativa: a ferramenta serve apenas como área de raciocínio/transcrição manual temporária quando TextLayer/OCR não conseguem resolver caligrafia. Não deve produzir uma segunda fonte de verdade nem persistir hipótese clínica.

Alternativas descartadas:
- persistência por conta;
- anotação embutida no PDF;
- envio do texto para IA;
- sincronização automática do rascunho.

**Fase atual:** Fase 6 — Automação operacional, homologação humana ainda aberta.

**Próxima ação exata:** validar CI e navegador; integrar somente se verde; depois o operador deve abrir um PDF real, digitar no rascunho, testar `Ctrl+A`/`Ctrl+C`, fechar/reabrir a janelinha e confirmar que trocar de PDF limpa o conteúdo.


## Titon — bloco de notas temporário — INTEGRADO E PUBLICADO PARA VALIDAÇÃO — 21/09/2026

O refinamento solicitado durante a homologação real do OCR foi integrado pela PR **#372**, merge `7fe65ed2d12f4be9ebb5a8142cefa5f24db762e3`.

Evidência pré-merge do head funcional `38b06e78a370e0cf5d7ba335fab1bb5c25254b3b`:
- **23/23 workflows GitHub Actions** concluídos com `success`;
- Central de Documentos — Fases 1–6: sucesso;
- navegador/PDF.js real: sucesso;
- bundle de staging e governança: sucesso;
- branch estava **0 commits atrás da main** antes do merge.

Evidência pós-merge:
- **27/27 check-runs** do commit final concluídos com `success`;
- **Cloudflare Pages: success**;
- **Workers Builds: success**;
- build/status do deploy: success.

Comportamento publicado:
- novo botão pequeno de bloco de notas na barra lateral esquerda do Titon;
- abre uma janela compacta de rascunho sobre o visualizador;
- `Ctrl+A`, seleção e `Ctrl+C` permanecem nativos do campo de texto;
- fechar e reabrir somente a janelinha preserva o texto enquanto o mesmo PDF continua aberto;
- `Escape` fecha apenas a janelinha;
- fechar o Titon ou trocar de PDF apaga integralmente o rascunho;
- não existe Salvar nem autosave;
- `spellcheck=false` foi mantido para evitar dependência de correção ortográfica do navegador;
- o rascunho não é gravado em D1, localStorage, sessionStorage, IndexedDB, Google Drive ou backend;
- nenhum conteúdo do rascunho é enviado à IA ou ao PostHog/observabilidade;
- o texto nunca é incorporado ao PDF.

Cache-busters publicados:
- `/css/documents.css?v=20260921-8`;
- `/js/documents.js?v=20260921-6`.

O **Caso 14 — OCR local em PDF-imagem** também foi registrado como **aprovado em uso real** a partir da validação do operador. O manuscrito médico de baixa legibilidade permanece uma limitação natural do reconhecimento e motivou este Caso 15 separado.

**Fase atual:** Fase 6 — Automação operacional, ainda aberta para homologação humana dos casos restantes.

**Próxima ação exata:** no Portal real, executar `Ctrl+F5`, abrir um PDF no Titon, clicar no novo botão de bloco de notas, digitar um rascunho, testar `Ctrl+A` + `Ctrl+C`, fechar/reabrir somente a janelinha e confirmar que o texto permanece; depois fechar/trocar o PDF e confirmar que o rascunho foi apagado.


## Titon — bloco de notas móvel e redimensionável — EM IMPLEMENTAÇÃO — 21/09/2026

O bloco temporário já foi confirmado visualmente pelo operador no Portal real. Novo refinamento solicitado a partir do uso real: o bloco não deve nascer cobrindo a folha; deve aproveitar as margens escuras do visualizador e permitir reposicionamento livre.

Branch: `feat/titon-notepad-move-resize-20260921`.

Escopo:
- posicionamento/tamanho inicial calculados pela maior margem escura lateral da página visível;
- mover por clique + arraste do cabeçalho;
- redimensionar pelas 4 bordas e pelos 4 cantos;
- contenção dentro da área de páginas do PDF;
- posição/tamanho manual preservados ao fechar/reabrir só a janelinha;
- geometria e texto continuam zerados ao fechar/trocar o PDF;
- zero persistência, backend, Drive, IA ou observabilidade.

Decisão técnica:
- foram descartados `resize: both` e o redimensionador nativo do navegador, porque só oferecem um canto e não atendem às oito direções pedidas;
- a implementação usa Pointer Events e oito zonas transparentes de redimensionamento;
- o cabeçalho é a alça de movimento para não disputar gestos com o `textarea`;
- o padrão usa a geometria real de `#pdfPageScroll` e da `.portal-pdf-page` mais visível, em vez de coordenadas fixas dependentes do monitor.

**Fase atual:** Fase 6 — Automação operacional, homologação humana ainda aberta.

**Próxima ação exata:** validar sintaxe/CI da branch, integrar se verde e então testar no Portal real posição inicial, arraste do cabeçalho e as oito direções de redimensionamento.


## Titon — bloco de notas móvel e redimensionável — INTEGRADO E PUBLICADO PARA VALIDAÇÃO — 21/09/2026

O refinamento foi integrado pela PR **#374**, merge `099e70ca98e16295e3384398f5ee393e38f7f2cd`.

Evidência pré-merge do head funcional `f8de32460b631a5f423bfb10433944f88c72e25f`:
- **23/23 workflows GitHub Actions** concluídos com `success`;
- Central de Documentos — Fases 1–6: sucesso;
- navegador/PDF.js real: sucesso;
- bundle de staging e governança: sucesso;
- branch **0 commits atrás da main** antes do merge.

Evidência pós-merge:
- **27/27 check-runs** concluídos com `success`;
- **Cloudflare Pages: success**;
- **Workers Builds: success**;
- **build / deploy / report-build-status: success**.

Comportamento publicado:
- ao abrir pela primeira vez em um PDF, o bloco mede a superfície de `#pdfPageScroll` e a `.portal-pdf-page` mais visível;
- quando existe largura suficiente, posiciona e dimensiona a janela na **maior margem escura lateral**, evitando cobrir a folha por padrão;
- o cabeçalho funciona como alça de mover por clique + arraste;
- as quatro bordas possuem zonas de redimensionamento;
- os quatro cantos possuem zonas de redimensionamento;
- movimento e resize ficam contidos na superfície de páginas do PDF;
- fechar/reabrir apenas a janelinha preserva posição e tamanho manual no mesmo PDF;
- fechar/trocar o PDF apaga texto e geometria, retornando ao padrão na próxima abertura;
- o `textarea` continua independente para digitação, seleção, `Ctrl+A` e `Ctrl+C`;
- posição, tamanho e conteúdo permanecem somente em memória: sem D1, localStorage, sessionStorage, IndexedDB, Drive, IA ou PostHog.

Cache-busters publicados:
- `/css/documents.css?v=20260921-9`;
- `/js/documents.js?v=20260921-7`.

**Fase atual:** Fase 6 — Automação operacional, ainda aberta para homologação humana dos casos restantes.

**Próxima ação exata:** no Portal real, executar `Ctrl+F5`, abrir um PDF e o bloco de notas; confirmar que nasce na margem escura sem cobrir a folha quando houver espaço, mover pelo cabeçalho e testar redimensionamento pelas quatro bordas e quatro quinas. Depois fechar/reabrir só o bloco para confirmar retenção da geometria e trocar de PDF para confirmar reset.

## Fase 6 — ENCERRADA E APROVADA; Fase 7 — ABERTA — 21/09/2026

O responsável operacional autorizou formalmente o encerramento da Fase 6 com a declaração **“fase 6 aprovada, pode encerrar”**.

### Encerramento da Fase 6

Resultado:
- 6A–6E permanecem integradas na `main`;
- refinamentos de uso real do Titon também permanecem baseline;
- OCR local já tinha aprovação explícita em documento real;
- bloco de notas temporário e sua ergonomia já estavam integrados/publicados;
- nenhuma permissão foi ampliada;
- nenhuma nova escrita automática no Drive foi introduzida;
- política de observabilidade sem conteúdo sensível permanece;
- IA antecipatória permanece fail-closed.

Aprovação humana final encerra a homologação operacional pendente. O projeto **não inventa** um percentual retroativo de economia de tempo: os artefatos atuais não preservam uma série quantitativa completa antes/depois. Essa limitação foi aceita como não bloqueante pelo encerramento explícito do responsável e passa a ser tratada corretamente na Fase 7, cuja finalidade é justamente criar baselines p75/p95/p99 e SLOs baseados em dados reais.

Alternativa descartada:
- manter a Fase 6 aberta indefinidamente apenas para reconstruir uma métrica histórica que não foi preservada. Isso contrariaria a regra do Guia de não usar pendências não bloqueantes como desculpa para manter a fase aberta.

### Abertura da Fase 7

Novo documento: `docs/CENTRAL-DOCUMENTOS-FASE-7.md`.

Escopo inicial:
- p75/p95/p99;
- cache hit/miss;
- falhas do Drive;
- PDFs grandes;
- mobile/desktop;
- tempo de IA;
- testes de regressão e recuperação;
- SLOs baseados em dados reais;
- painel técnico estável e sem dados sensíveis.

Bloqueio externo identificado:
- o conector PostHog exposto nesta sessão não corresponde ao projeto analítico do Portal; portanto ele não será usado para afirmar métricas da Central.

Risco principal da abertura da Fase 7:
- otimizar com base em amostra errada ou telemetria insuficiente. A primeira subfase é, portanto, inventário de instrumentação e baseline, não alteração de desempenho.

**Fase atual:** Fase 7 — Robustez e otimização contínua.  
**Próxima ação exata:** auditar a instrumentação técnica existente da Central no código e reconciliar com o projeto PostHog correto antes de definir SLOs ou modificar performance.

## Transição Fase 6 → Fase 7 — INTEGRADA NA MAIN — 21/09/2026

A transição documental foi integrada pela PR **#376**, merge `aa77e6593e6724dd235c9b7071fc21337c4513e0`.

Evidência pré-merge do head `822d6d85ebaf3c9ebe975c0ffa405d23a45b49fd`:
- **21/21 workflows GitHub Actions** concluídos com `success`;
- governança da Central: `success`;
- validação Fases 1–6: `success`;
- nenhuma alteração funcional de código, permissões, Drive, IA ou runtime.

Estado autoritativo após a integração:
- **Fase 6: ENCERRADA E APROVADA**;
- **Fase 7: ATIVA**;
- documento da fase: `docs/CENTRAL-DOCUMENTOS-FASE-7.md`;
- primeiro trabalho da Fase 7 é diagnóstico/instrumentação, não nova funcionalidade.

Limitação preservada: não há percentual histórico único e confiável de economia de tempo da Fase 6; nenhum número foi inventado. O responsável aprovou o encerramento após uso real, e a Fase 7 assume a medição contínua por percentis/SLOs.

**Próxima ação exata:** executar 7A — inventariar eventos/propriedades técnicos allowlisted no frontend/backend, mapear quais suportam p75/p95/p99, cache hit/miss, falhas de Drive, PDFs grandes, mobile/desktop e tempo de IA, e identificar o acesso correto ao projeto PostHog do Portal antes de definir qualquer SLO.

## Fase 7A — projeto PostHog do Portal reconciliado — 21/09/2026

O bloqueio de acesso analítico registrado na abertura da Fase 7 foi resolvido.

Estado real:
- organização PostHog acessível: **Regulação de saúde**;
- projeto analítico da Central: **Default project** (id 602473);
- o conector foi alterado para esse projeto;
- a taxonomia do projeto contém os eventos técnicos esperados da Central/Titon, incluindo abertura/prontidão de PDF, cache/Drive, edição, IA documental e tarefas de background.

Conclusão:
- esse é o projeto correto para a baseline da subfase 7A;
- não é necessário alterar o envio de telemetria do Portal, pois os eventos já estão chegando nesse projeto;
- nenhum token/chave foi registrado no status;
- sessões futuras do conector devem confirmar organização/projeto antes de consultar métricas.

**Próxima ação exata:** executar a baseline 7A no projeto correto: confirmar propriedades de cada evento, calcular p75/p95/p99 para abertura/prontidão/sincronização/IA, medir cache hit/miss e taxas de falha do Drive, então propor SLOs iniciais sem conteúdo sensível.

## Fase 7C — falha ao renomear após sincronização do PDF editado — DIAGNÓSTICO CONFIRMADO / EM CORREÇÃO — 21/09/2026

Incidente real observado no Titon:
- operador uniu PDFs;
- a sincronização do conteúdo com o Google Drive foi concluída e a interface exibiu **Sincronizado com o Google Drive**;
- em seguida, ao renomear o mesmo PDF, o Titon exibiu **Falha: o nome não foi alterado no Google Drive**.

Diagnóstico no estado atual da `main`:
- após `replace_pdf`, o backend devolve uma referência confirmada com prova efêmera do conteúdo salvo;
- o Google Drive pode incrementar o campo técnico `version` depois do recebimento confirmado, mesmo sem trocar o head binário do PDF;
- o fluxo de sincronização já trata esse caso com `confirmedBaselineMatches()`, aceitando somente uma versão posterior quando a referência prova: mesmo usuário, mesmo arquivo, mesmo head revision, mesmo MD5, mesmo tamanho, mesmo escopo e prova ainda válida;
- o fluxo de **renomeação** ainda fazia comparação estrita `before.version !== baseVersion` e não reutilizava essa reconciliação;
- por isso, logo após uma união + upload confirmado, uma atualização técnica posterior da versão do Drive pode gerar falso `DRIVE_VERSION_CONFLICT` na renomeação.

Correção aprovada para a branch `fix/titon-rename-after-drive-sync-20260921`:
- reutilizar a mesma prova confirmada de conteúdo já adotada no sync;
- só reconciliar versão posterior na renomeação quando o **nome atual no Drive ainda é exatamente o nome-base que o usuário tinha aberto**, evitando sobrescrever uma renomeação concorrente real;
- frontend enviará `baseName` junto de `baseVersion`;
- se conteúdo ou nome tiverem mudado externamente, o conflito real continuará bloqueando a renomeação;
- melhorar a mensagem inline para diferenciar conflito real de falha genérica;
- adicionar regressão automatizada para o contrato.

Alternativas descartadas:
- remover verificação de versão: inseguro;
- simplesmente buscar a versão mais recente e renomear: poderia sobrescrever alteração concorrente;
- retry cego no frontend: repetiria o mesmo conflito sem provar que a divergência é apenas técnica.

**Fase atual:** Fase 7 — robustez e otimização contínua. Esta correção pertence à 7C — robustez e recuperação.

**Próxima ação exata:** implementar a reconciliação conservadora, validar CI completo, integrar somente com checks verdes e publicar para reteste do fluxo união → sync → renomeação.

## Fase 7C — renomeação após sincronização do PDF editado — CORRIGIDA E INTEGRADA — 21/09/2026

A correção foi integrada pela PR **#379**, merge `be313d764c48ec309b9dc6085ad7752b4fca4454`.

Evidência pré-merge do head funcional `34318dadad7a481d7ac68512c1f1200fa292a51b`:
- **23/23 workflows GitHub Actions** concluídos com `success`;
- Central de Documentos — Fases 1–6: `success`;
- navegador/PDF.js real em Chromium: `success`;
- bundle de staging e governança: `success`;
- branch estava **0 commits atrás da main** antes do merge.

Correção integrada:
- `commitPdfRename()` envia `baseName` junto de `baseVersion`;
- `renameDrivePdf()` continua bloqueando qualquer divergência por padrão;
- somente quando existe uma referência confirmada do último upload, do mesmo usuário, com mesmo head revision, MD5, tamanho, escopo e prova não expirada, uma versão técnica posterior pode ser reconciliada;
- a reconciliação também exige que o nome atual no Drive continue exatamente igual ao `baseName`, portanto uma renomeação concorrente real não é sobrescrita;
- mudança concorrente real de conteúdo continua bloqueada por `DRIVE_VERSION_CONFLICT`;
- o feedback inline agora diferencia conflito real de falha genérica;
- cache-buster publicado no código: `/js/documents.js?v=20260921-8`.

Causa raiz:
- o Drive pode avançar o campo técnico `version` após o upload já confirmado sem trocar o conteúdo binário;
- o sync já possuía reconciliação segura para esse fenômeno;
- a renomeação ainda comparava a versão de forma absoluta e gerava falso conflito imediatamente depois de união + upload.

A proteção de concorrência **não foi afrouxada**: a correção reaproveita a prova criptograficamente selada do próprio fluxo de sincronização e adiciona a validação nominal do arquivo.

Limitação de publicação:
- a rota pública autenticada não pôde ser consultada pelo navegador externo desta sessão;
- portanto não foi inventada confirmação de propagação do deploy pós-merge.

**Fase atual:** Fase 7 — robustez e otimização contínua.  
**Próxima ação exata:** após o deploy da `main`, executar `Ctrl+F5` e repetir o caso real: unir PDF → aguardar **Sincronizado com o Google Drive** → alterar o nome → confirmar com Enter ou clique fora. O nome deve ser alterado no Drive sem exigir reabertura. Se existir mudança concorrente real, o conflito deve continuar bloqueado.

## Fase 7C — renomeação ainda falha após correção de versionamento — NOVA EVIDÊNCIA / EM CORREÇÃO — 21/09/2026

PR de correção: **#381** — confirmação pós-PATCH estabilizada e diagnóstico de erro exposto no feedback inline.

Após a PR #379 ter sido integrada e o Worker correspondente ter sido publicado com sucesso pela build produtiva subsequente, o operador repetiu o fluxo real e a renomeação ainda exibiu **Falha: o nome não foi alterado no Google Drive**.

Nova evidência:
- a build produtiva do Worker está atualizada; portanto o problema remanescente não é cache nem ausência de deploy;
- o feedback continuou genérico, o que torna improvável que a falha atual seja o mesmo `DRIVE_VERSION_CONFLICT` já tratado;
- o backend hoje confirma o PATCH do nome e em seguida faz uma leitura imediata do metadado para verificar nome/conteúdo/versão;
- essa leitura única pode observar metadado ainda não estabilizado e gerar `DRIVE_RENAME_CONFIRMATION_INVALID` mesmo após PATCH aceito pelo Google Drive.

Correção desta rodada:
- manter o PATCH único — **não repetir renomeação**;
- estabilizar apenas a leitura de confirmação do metadado com poucas tentativas curtas e limitadas;
- sucesso continua exigindo que o GET por ID observe exatamente o nome esperado;
- mudança concorrente de nome/conteúdo continua bloqueada;
- o frontend passará a mostrar a mensagem real devolvida pelo backend em vez do rótulo genérico, permitindo diagnóstico imediato caso reste outra causa.

Alternativas descartadas:
- repetir o PATCH: poderia sobrescrever alteração concorrente;
- remover a releitura pós-PATCH: perderia a detecção de conflito de conteúdo;
- declarar sucesso só pela resposta do PATCH: menos conservador do que o contrato atual.

**Fase atual:** Fase 7C — robustez/recuperação.  
**Próxima ação exata:** implementar confirmação estabilizada, renovar cache do cliente, validar CI/navegador/Worker e retestar o mesmo caso real.

## Fase 7C — confirmação estabilizada da renomeação — INTEGRADA E PUBLICADA PARA RETESTE — 21/09/2026

A segunda correção foi integrada pela PR **#381**, merge `caa979df63c37e5749eab783b135278792bb490b`.

Evidência pré-merge do head funcional `f6d4eced408060343ff9f16dbc1437c8c496d517`:
- **23/23 workflows GitHub Actions** concluídos com `success`;
- Central de Documentos — Fases 1–6: `success`;
- navegador/PDF.js real em Chromium: `success`;
- bundle de staging e governança: `success`;
- branch estava **0 commits atrás da main**.

Evidência pós-merge do commit funcional:
- **27/27 check-runs** concluídos com `success`;
- Cloudflare Pages: `success`;
- Workers Builds produtivo: `success`;
- Build ID: `b81a6d79-10db-498e-b311-c299a60208ac`;
- Worker Version produzida: `61dd44e7-3b88-4716-8bfa-146749dd2baf` — evidência histórica deste deploy, não identificador permanente;
- `deploy` e `report-build-status`: `success`.

Estado publicado:
- continua existindo exatamente um PATCH de renomeação;
- a confirmação pós-PATCH agora tolera apenas atraso curto de propagação do metadado, repetindo somente o GET de verificação por ID;
- tentativas de confirmação: imediata, +120 ms, +320 ms e +700 ms;
- sucesso exige observar exatamente o novo nome no Drive;
- conflito de conteúdo/versão e alteração concorrente continuam bloqueados;
- falha não-conflito passa a mostrar a mensagem real devolvida pelo backend no próprio Titon;
- frontend publicado com `/js/documents.js?v=20260921-9`.

A primeira correção (#379) estava efetivamente implantada quando o segundo teste falhou; portanto esta segunda rodada não atribui o problema a cache/deploy. Ela trata o próximo ponto conservador de confirmação do fluxo e torna qualquer falha residual autoexplicativa.

**Fase atual:** Fase 7 — robustez e otimização contínua.  
**Próxima ação exata:** operador deve executar `Ctrl+F5` e repetir união → aguardar sincronização confirmada → renomear. Se ainda falhar, copiar/enviar exatamente a nova mensagem inline, que agora corresponde à causa devolvida pelo backend, para diagnóstico sem adivinhação.

## Fase 7C — renomeação pós-sync — HOMOLOGADA EM USO REAL — 21/09/2026

O operador repetiu o fluxo real após a publicação da PR #381 e confirmou: **“agora funcionou”**.

Caso homologado:
- unir PDFs no Titon;
- aguardar confirmação **Sincronizado com o Google Drive**;
- alterar o nome do documento;
- confirmar a renomeação;
- o erro anterior não voltou a ocorrer.

Conclusão:
- a confirmação pós-PATCH estabilizada resolveu o incidente observado;
- a renomeação após sincronização de PDF unido fica aceita como recuperação funcional da Fase 7C;
- proteções de conflito, versão, conteúdo e concorrência permanecem ativas;
- não há pendência adicional deste incidente neste momento.

**Fase atual:** Fase 7 — robustez e otimização contínua.  
**Próxima ação exata:** retomar a subfase 7A de baseline/observabilidade e tratar novos incidentes somente se surgirem em uso real.

## Fase 7A — baseline real coletada; cobertura analítica em implementação — 21/09/2026

Fonte: projeto PostHog **Regulação de saúde / Default project (602473)**, já reconciliado.

Documento novo: `docs/CENTRAL-DOCUMENTOS-BASELINE-7A.md`.

Principais achados reais:
- `pdf_ready` com cache hit: 129 eventos, 64,2%, p95 ~544 ms;
- `pdf_ready` cache miss: 72 eventos, 35,8%, p95 ~9.918 ms;
- últimas 24 h: hit p95 ~515 ms; miss p95 ~16.034 ms;
- primeira página visível 24 h: p95 ~7.113 ms;
- pasta Drive 24 h: p95 ~5.040 ms;
- pesquisa Drive 24 h: p95 ~5.880 ms;
- IA documental: 29 started / 29 completed observados; p95 histórico ~31.930 ms; nenhum evento `document_ai_failed` observado até a coleta;
- Drive sync: 48 completed / 26 failed no histórico; 26/26 falhas com HTTP 409;
- `warm_pdf/cancelled`: p95 ~18.853 ms;
- somente 3 amostras `large` e zero `very_large`;
- 0/491 eventos centrais tinham device/browser: mobile vs desktop era impossível;
- não havia evento para comparar texto nativo vs OCR.

Interpretação:
- cache miss / Drive é o gargalo de abertura mais claro;
- a taxa bruta de falha de sync não pode virar SLO enquanto HTTP 409 não for classificado entre conflito legítimo e falha recuperável;
- a IA possui cauda longa, mas amostra por tamanho ainda é pequena;
- SLOs finais não serão inventados antes de fechar essas lacunas.

Implementação 7A na branch `feat/central-docs-phase7a-observability-baseline-20260921`:
- `viewport_class` coarse: somente `mobile|desktop`, derivado do layout, sem User-Agent/resolução/modelo;
- `failure_kind` coarse para sync/IA;
- `document_text_layer_ready` e `document_text_layer_failed` para medir nativo/OCR local;
- telemetria de texto continua sem conteúdo, página, coordenadas ou confiança;
- `portal_observability_version` sobe para 2.

Bloqueio analítico externo:
- conector PostHog atual não possui `data_catalog:read`, portanto a baseline é não canônica e não foi comparada a métrica governada.

**Fase atual:** Fase 7A — inventário/baseline real.  
**Próxima ação exata:** CI/PR da instrumentação; se verde, integrar/publicar e aguardar amostra real suficiente para recalcular por viewport/text_mode/failure_kind. Só depois abrir 7B/SLOs.

## Fase 7A — painel de observabilidade técnica consolidado — 21/09/2026

A continuidade da Fase 7 foi retomada pelo estado real da `main` após a PR #384.

Trabalho concluído:
- PostHog confirmado no projeto `602473`;
- dashboard existente **Portal Regulação — Observabilidade Técnica** reutilizado;
- nova seção **Central de Documentos — Fase 7** adicionada;
- seis insights técnicos salvos para PDF/cache, Drive, IA, background, viewport e texto nativo/OCR;
- queries validadas antes de salvar;
- nenhuma propriedade sensível ou conteúdo documental incluído.

Nova evidência pós-publicação:
- backend de observabilidade V2 está recebendo eventos;
- as novas dimensões `viewport_class`, `failure_kind` e `text_mode` ainda não têm amostra suficiente na taxonomia;
- portanto a Fase 7A **não é encerrada** e a 7B/SLOs ainda não deve ser aberta.

Baseline de 7 dias atualizada:
- PDF cache hit p95 ~519 ms;
- PDF cache miss p95 ~17.278 ms;
- Drive sync: 53 completed / 26 failed, falhas ainda legadas/sem classificação coarse;
- IA small p95 ~48.443 ms;
- warm_pdf/cancelled p95 ~18.476 ms.

**Próxima ação exata:** acumular tráfego após recarga real do frontend instrumentado e repetir a coleta até existirem amostras não legadas de viewport/failure_kind/text_mode. Em paralelo, usar o painel criado para observar regressões. Só então fechar 7A e abrir 7B.



## Fase 7E — primeira otimização do sync Drive por evidência real — 21/09/2026

Nova observação operacional: a sincronização do Titon com o Google Drive continua lenta.

PostHog confirmou a percepção:
- último `replace_pdf` small V2: **15.677 ms**;
- small V1 nas últimas 24 h: n=26, p95 **18.719 ms**;
- small V2: n=2, p95 **17.403 ms**;
- medium V2: n=4, p95 **25.654 ms**.

Diagnóstico:
- o frontend executava um `/sync/preflight` completo;
- imediatamente depois executava `/sync/start`;
- o Worker, dentro de `startDriveSync()`, já executa `driveSyncPreflightState()` antes de preservar revisão e iniciar upload;
- havia portanto uma validação remota duplicada, serial, sem ganho de segurança.

Correção isolada:
- branch `perf/central-docs-drive-sync-fastpath-20260921`;
- remover o preflight HTTP redundante do frontend;
- manter o preflight autoritativo dentro de `/sync/start`;
- preservar revision keepForever, resumable upload, confirmação final e todas as verificações de versão/head/MD5/tamanho;
- cache-buster `documents.js?v=20260921-11`;
- teste passa a exigir ausência do preflight duplicado no cliente e presença/ordem do preflight no Worker.

Não declarar percentual de melhora antes do pós-deploy. A mudança elimina uma chamada serial Google Drive por sincronização; o ganho real será medido no PostHog.

**Próxima ação exata:** abrir PR, validar CI, integrar se verde e comparar a nova amostra V2 com a baseline pré-otimização. Se ainda houver cauda alta, instrumentar/decompor geração local, start/preflight, upload e confirmação antes de mexer na confirmação ou na preservação de revisão.


## Fase 7E — sync Drive: primeira otimização integrada — 21/09/2026

A PR **#386** foi mesclada na `main` pelo commit **`f0aa1ab62778d09c85ee82ff31df3f714bc27635`**.

Evidência que motivou a mudança:
- `replace_pdf` small V2 mais recente antes da otimização: **15.677 ms**;
- small V1 p95: **18.719 ms**;
- small V2 p95: **17.403 ms**;
- medium V2 p95: **25.654 ms**.

Mudança integrada:
- removida a chamada frontend separada `/api/documents/drive/sync/preflight`;
- `/api/documents/drive/sync/start` continua executando `driveSyncPreflightState()` no Worker antes de qualquer upload;
- preservação de revisão `keepForever`, upload resumable, checagem de conflito e confirmação final por versão/headRevisionId/MD5/tamanho foram preservadas;
- frontend versionado como `/js/documents.js?v=20260921-11`;
- testes de fechamento/logout foram atualizados para o fluxo real de duas chamadas cliente (`start` + `upload`) e CI exige que o preflight permaneça no Worker.

Validação da PR:
- **24 checks funcionais verdes** no head final;
- PDF.js real em Chromium: sucesso;
- governança e Central: sucesso;
- o único check vermelho da branch foi o Workers Builds tentando criar Worker Preview não habilitado para branch não produtiva; não houve mudança no Worker nesta otimização e o erro não representa regressão funcional.

Estado pós-merge observado antes de encerrar este registro:
- workflows funcionais da `main`: verdes;
- GitHub Pages `build` e `deploy`: **sucesso**;
- `report-build-status`: sucesso;
- Cloudflare Pages: sucesso;
- 26/27 checks do merge concluíram com sucesso; o único vermelho foi Workers Builds tentando criar Worker Preview indisponível, sem mudança de Worker nesta PR e sem impedir a publicação estática;
- o frontend `documents.js?v=20260921-11` está publicado;
- não declarar ganho de desempenho antes de tráfego real com essa versão.

**Próxima ação exata:** executar **Ctrl+F5 uma vez**, fazer um sync real e medir o novo `drive_sync_completed` V2. Se a latência continuar alta, instrumentar tempos por estágio antes de alterar outra proteção.


## Fase 7E — lista/pesquisa Drive também confirmadas lentas — 21/09/2026

O operador informou que, além da sincronização, a própria lista da Central e a pesquisa por nome demoram muito mais que a interface nativa do Google Drive.

Evidência PostHog V2 desktop:
- pasta: n=6, p50 **3.972 ms**, p95 **4.542 ms**;
- pesquisa: n=8, p50 **4.428 ms**, p95 **7.072 ms**;
- buscas com apenas 1–5 resultados chegaram a **4.094 ms**, **6.974 ms** e **7.124 ms**;
- sync: n=9, p50 **13.855 ms**, p95 **20.130 ms**;
- dois syncs small recentes após a PR #386: **11.323 ms** e **13.855 ms**.

Diagnóstico de código:
- primeira página solicitava 80 itens;
- Drive recebia `orderBy=folder,name_natural` e o frontend ordenava novamente;
- normalização dos itens era serial;
- derivação/importação AES/HMAC era repetida por item;
- `cacheKey` era calculado mesmo para itens que não são PDF;
- busca sempre aguardava a chamada remota antes de mostrar qualquer correspondência.

Branch criada: `perf/central-docs-drive-navigation-fastpath-20260921`.

Implementação:
- 40 itens na primeira página e 80 apenas em paginação;
- remoção do `orderBy` remoto redundante;
- normalização concorrente com limite 16;
- cache de chaves criptográficas no isolate;
- `cacheKey` somente para PDF;
- fotografia da pasta atual somente em memória da aba, permitindo redesenho imediato e correspondência local instantânea enquanto o Drive remoto confirma;
- resultado remoto continua substituindo a fotografia local e é autoritativo;
- nova telemetria técnica para token/API/mapeamento e build/start/upload do sync.

Privacidade:
- nenhum nome de arquivo, termo pesquisado ou Drive ID é enviado ao PostHog;
- nenhuma listagem/nome novo é persistido em localStorage, sessionStorage ou IndexedDB;
- referências continuam seladas.

**Próxima ação exata:** CI + PR + publicação. Após isso, medir uma operação real para decidir se o restante da demora está no token OAuth, Files API, selagem local, geração do PDF, início seguro ou upload/confirmação.


## Fase 7E — fast-path de lista/pesquisa Drive integrado e publicado — 21/09/2026

A PR **#388 — Fase 7E: acelerar lista e pesquisa do Google Drive** foi integrada na `main` pelo merge **`e5d8e5cb4dc4e45a2ccfe06e8b96482fd77654a8`**.

Validação:
- PR: todos os checks funcionais concluíram com sucesso; o preview de Worker de branch continuou indisponível por configuração externa já conhecida;
- pós-merge da `main`: **29/29 checks verdes**;
- Workers Builds produtivo: **success**;
- Build ID: `72df236a-42a1-4614-8eff-5a976b2ba81d`;
- Worker Version histórica: `c0971049-86e4-45a9-a46d-f8bf47b3484a`;
- GitHub Pages/Cloudflare Pages: sucesso;
- testes reais de navegador, incluindo PDF.js e abertura pós-login: sucesso.

Estado publicado:
- `documents.js?v=20260921-12`;
- `portal-performance.js?v=20260921-2`;
- `portal-observability.js?v=20260921-2`;
- primeira página lista/pesquisa reduzida para 40 itens;
- `orderBy` redundante removido da Files API;
- mapeamento/selagem paralelo com concorrência limitada;
- derivação de chaves criptográficas reaproveitada por isolate;
- `cacheKey` somente para PDF;
- snapshot da pasta somente em memória e pesquisa local provisória imediata;
- resposta remota do Drive continua autoritativa;
- nova decomposição técnica de latência ativa.

Nenhum ganho percentual é declarado ainda. A próxima evidência deve vir de uso real depois da publicação.

**Próxima ação exata:** Ctrl+F5 uma vez, usar normalmente a lista/pesquisa e realizar sincronização quando houver edição. Em seguida comparar a nova amostra com a baseline e usar as métricas por estágio para decidir se há nova otimização necessária.


## Fase 7E — preload da Central após login autorizado — 22/09/2026

Solicitação aprovada: contas com a função Central de Documentos devem preparar a ferramenta em segundo plano assim que o login for concluído.

Constatação: o aquecimento existente do Portal já antecipava a página pública `/documentos/` e seus recursos referenciados, mas não executava as chamadas autenticadas necessárias para a primeira tela útil. A entrada ainda precisava consultar acesso, preferências, configuração da IA e raiz do Drive.

Implementação na branch `perf/central-docs-login-background-preload-20260922`:
- `portal-performance.js` dispara o preload no evento de sessão e no fluxo já existente de `warmForUser`, somente para `documentCapabilities.view/manage`;
- o Service Worker aquece a interface e recursos estáticos do Titon/PDF.js/OCR;
- acesso, preferências, IA e primeira página da raiz do Drive são obtidos com a sessão atual e mantidos exclusivamente em memória;
- snapshot privado: TTL 90 s, refresh ~30 s, chave SHA-256 derivada do Authorization, sem token bruto no snapshot;
- `PORTAL_DOCUMENTS_WARM_CLEAR` limpa os mapas; geração incremental impede corrida de uma requisição antiga repovoar o snapshot após logout;
- ao entrar em `/documentos/`, a Central consulta `/api/documents/access` ao vivo antes de aceitar qualquer fotografia aquecida;
- depois do paint imediato da raiz aquecida, uma listagem autoritativa é buscada em segundo plano e só repinta se o usuário ainda estiver na raiz sem interação concorrente;
- se preload falhar/expirar, o fluxo anterior continua sendo o fallback normal.

Privacidade e escopo:
- nenhum PDF é pré-baixado automaticamente;
- nomes/listagens privadas não entram em Cache Storage, localStorage, sessionStorage ou IndexedDB;
- nenhum conteúdo/identidade documental vai ao PostHog;
- não houve ampliação de permissão.

Baseline imediatamente anterior:
- página Central p95 ~**3,43 s**;
- raiz Drive p95 ~**4,55 s**;
- pesquisa p95 ~**6,94 s**.

**Próxima ação:** validar a branch em CI/navegador, publicar somente se verde e medir o primeiro acesso real com `cache_state=hit`.


## Fase 7E — preload pós-login integrado e publicado — 22/09/2026

A PR **#390 — Fase 7E: pré-carregar Central após login autorizado** foi integrada na `main` pelo merge **`0f569eed3e6e343fb5e82a48164c4b343134fcee`**.

Publicação confirmada:
- Workers Build produtivo: `b62961a3-7533-4bab-a701-4865dbd679b8` — **success**;
- Worker Version: `63de9dc0-9c44-4ea8-8d96-9cf4c286a220`;
- Cloudflare Pages: **success**;
- GitHub build/deploy: **success**;
- PDF.js real em Chromium: **success**;
- pós-merge: 53 checks verdes, incluindo vídeo, PDF.js, Pages e deploy. O Workers Build produtivo concluiu antes com sucesso e gerou Version ID `63de9dc0-9c44-4ea8-8d96-9cf4c286a220`. Após a criação da branch documental de handoff, um novo check de Worker Preview foi anexado ao mesmo SHA e falhou; ele não representa rollback nem falha da versão produtiva já criada.

Comportamento produtivo:
1. após login, contas com Central autorizada disparam aquecimento da rota e dos motores públicos;
2. o Service Worker consulta acesso/preferências/IA/raiz Drive em segundo plano e mantém a resposta privada só em memória por até 90 s;
3. a sessão renova o snapshot aproximadamente a cada 30 s enquanto houver página compatível ativa;
4. ao abrir a Central, o backend confirma a permissão atual ao vivo;
5. somente então a raiz aquecida pode aparecer imediatamente;
6. uma listagem real do Drive atualiza o estado em segundo plano sem travar a interface;
7. logout invalida a geração do preload para impedir repovoamento tardio;
8. ausência/expiração do preload cai no fluxo tradicional sem perda funcional.

Escopo deliberadamente não incluído: baixar PDFs dos pacientes ou persistir nomes/listas privadas. A ferramenta fica “pré-pronta” no sentido de interface, motores e dados iniciais seguros, sem antecipar conteúdo documental sensível.

**Próxima ação:** colher amostra real de `drive_folder_opened` com `cache_state=hit` e comparar com a baseline anterior antes de declarar ganho percentual.

## Fase 7E — prioridade para Consulta [2026] e Exames [2026] — 22/09/2026

O operador definiu duas pastas de uso prioritário: **Consulta [2026]** e **Exames [2026]**, solicitando que suas listas e os PDFs internos permaneçam carregados em segundo plano.

Branch: `perf/central-docs-priority-folders-20260922`.

Decisão:
- resolver as pastas por nome exato normalizado;
- aquecer as listagens no Service Worker;
- consumir a listagem aquecida imediatamente ao entrar na pasta;
- manter refresh autoritativo do Drive;
- pré-carregar os PDFs dessas pastas usando o cache criptografado já aprovado;
- preservar limites de 50 MB/arquivo, 256 MB total, 12 h de TTL e limpeza no logout;
- concorrência limitada a 2 e bloqueio em Save-Data/2G;
- não persistir nomes/IDs/listagens no cache documental; somente bytes cifrados + chave opaca/versão.

Alternativas descartadas:
- Cache Storage ou Service Worker com PDF em claro: descartado por privacidade;
- cache ilimitado de todos os arquivos: descartado por risco de quota e saturação;
- escolher automaticamente uma pasta quando houver mais de uma correspondência exata fora da raiz: descartado por risco de aquecer pasta errada.

Próxima ação: concluir CI/PR, publicar se verde e validar em uso real se as duas pastas aparecem imediatamente e os PDFs elegíveis passam a abrir pelo cache.


## Fase 7E — pastas prioritárias integradas e publicadas — 22/09/2026

A PR **#392 — Fase 7E: manter Consulta e Exames 2026 aquecidas** foi integrada na `main` pelo merge **`41da8b235ac461cf773d15bb9be1b9c457c6d144`**.

Resultado publicado:
- **Consulta [2026]** e **Exames [2026]** são resolvidas por nome exato normalizado;
- a raiz é preferida; uma busca global só é aceita quando existe uma única correspondência exata;
- as listagens ficam no snapshot privado em RAM do Service Worker e são renovadas no ciclo do preload;
- ao entrar numa pasta prioritária, a Central usa o snapshot aquecido sem esperar nova chamada serial;
- o refresh continua vindo do preload autoritativo do Drive;
- PDFs diretamente contidos nas duas pastas são baixados em segundo plano, com concorrência 2, e armazenados pelo `PortalDocumentCache` em AES-GCM;
- cache: 50 MB por arquivo, 256 MB total, TTL 12 h, limpeza por sessão/logout;
- PDFs prioritários têm precedência: o cache existente aplica poda LRU aos itens mais antigos quando necessário;
- Save-Data, 2G e slow-2G continuam bloqueando pré-download;
- nenhum nome/Drive ID/conteúdo documental é enviado ao PostHog.

Validação técnica:
- PR: 51 checks funcionais verdes; único vermelho foi o check externo de Worker da branch;
- pós-merge: **54/54 checks verdes**;
- Workers Build produtivo `f6f2a266-0a4c-45b3-9dc4-b6c5388c45fa` — success;
- Worker Version `0391b3ee-878d-4e99-a45a-368ff462dbcb`;
- PDF.js real em Chromium, vídeo pós-login, Pages e deploy: success.

**Próxima ação exata:** validar em uso real as duas pastas e PDFs. Se alguma pasta não for aquecida, primeiro verificar ambiguidade/localização real no Drive antes de alterar a lógica.


## Fase 7E — lote visível reduzido para 20 itens — 22/09/2026

Pedido do operador: reduzir o carregamento da lista de **40/80 para 20 itens por vez**.

Implementação na branch `perf/central-docs-page-size-20-20260922`:
- `worker/document-drive.js`: default de `pageSize` passou de 40 para **20** em listagem e pesquisa;
- `js/documents.js`: primeira página e “Carregar mais” usam **20** em pastas e pesquisa;
- refresh da raiz usa **20**;
- `portal-sw.js`: raiz aquecida usa **20**;
- Consulta [2026]/Exames [2026]: snapshot visível usa **20**, mas o prefetch de arquivos continua desacoplado, com uma coleta interna de metadados em lotes de 100, até 6 páginas;
- `js/portal-performance.js`: prefetch dos PDFs usa `prefetchItems`, não os 20 itens visíveis;
- listener de atualização não reduz novamente a lista caso o usuário já tenha carregado mais de 20 itens.

Motivo: diminuir o tempo até a primeira lista útil sem desfazer o preload criptografado das pastas prioritárias.

**Próxima ação:** validar CI completo, publicar se verde e comparar `drive_folder_opened`/`drive_search_completed` após uso real.


## Fase 7E — paginação de 20 integrada e publicada — 22/09/2026

A PR **#394 — Fase 7E: reduzir listas da Central para 20 itens por vez** foi integrada na `main` pelo merge **`2d12923e4319eb17aa87916df67aaa140227e4cd`**.

Estado publicado:
- listagem normal de pasta: **20 itens por chamada**;
- “Carregar mais”: acrescenta **20**;
- pesquisa: **20 resultados por chamada**;
- backend Drive: `pageSize` default **20**;
- raiz aquecida pós-login: **20 itens**;
- Consulta [2026] / Exames [2026]: snapshot visível de **20 itens** com token da próxima página preservado;
- prefetch de PDFs prioritários continua usando trilha separada de metadados (até 100 por chamada, 6 páginas), portanto a redução visual não desfez o cache antecipado;
- listener do preload não reduz a lista caso o operador já tenha carregado mais de 20 itens.

Validação técnica:
- PR: **51 checks funcionais verdes**; único vermelho foi Worker Preview de branch;
- pós-merge: **54/54 checks verdes**;
- Workers Build produtivo `43a9be31-c0cb-471a-9d5b-d3b24a4cf77e` — success;
- Worker Version `951f52ce-b324-4578-8eb2-9f05ca83100f`;
- Cloudflare Pages, GitHub deploy, PDF.js real em Chromium e vídeo pós-login: success.

**Próxima ação:** observar uso real e comparar `drive_folder_opened` e `drive_search_completed` com a baseline anterior antes de declarar ganho percentual.

## Mudança transversal — Telemedicina V34.2 — 22/09/2026

Incidente relatado: uma conta com acesso previamente concedido à Telemedicina recebeu novamente `403 — Acesso exclusivo da Telemedicina ou do Desenvolvedor` ao tentar registrar consulta.

Diagnóstico no código: `auth_telemedicine_access` é a fonte de verdade prevista pela V34, porém `worker/telemedicine.js`, `worker/telemedicine-router-v2.js` e `worker/agenda.js` ainda exigiam também `user.role === 'recepcao'`. Como a reconciliação global de papel-base roda uma vez por isolate, uma divergência criada depois dessa passagem podia bloquear temporariamente uma conta explicitamente autorizada.

Correção isolada na branch `fix/telemedicina-capability-source-truth-20260922`: as três rotas continuam validando sessão e capacidade server-side; capacidade ausente/revogada continua negada; capacidade ativa passa a autorizar e, se o papel-base estiver divergente, a própria requisição autocorrige para `recepcao`. Desenvolvedor permanece com acesso administrativo. Teste de regressão impede reintroduzir a dupla condição frágil.

Esta manutenção é transversal e não altera a Fase 7E da Central de Documentos.

**Próxima ação exata:** abrir PR, exigir os checks de Telemedicina/Agenda e, se verdes, integrar e confirmar o deploy produtivo antes de pedir novo teste à operadora.

## Mudança transversal — Telemedicina V34.2 integrada e publicada — 22/09/2026

A PR **#396 — fix: impedir 403 indevido para Técnico em Telemedicina autorizado** foi integrada à `main` no merge `65948b12195a62560f896579afa6665aed5a99d8`.

Correção efetiva: as rotas de Telemedicina principal, roteador V2 e Agenda continuam exigindo sessão válida e capacidade explícita em `auth_telemedicine_access`; a dupla dependência frágil de `user.role === 'recepcao'` foi removida. Quando a capacidade está ativa e o papel-base diverge, a própria requisição normaliza o papel para `recepcao`. Capacidade ausente ou revogada continua negada.

Validação relevante:
- PR: `Validar Telemedicina`, `Validar Telemedicina Acesso V34`, `Validar Agenda DigSaúde V1` e `Validar site` — **success**;
- pós-merge: `Validar Telemedicina`, `Validar Telemedicina Acesso V34` e `Validar Agenda DigSaúde V1` — **success**;
- Cloudflare Pages — **success**;
- Workers Build produtivo `cf8b32cc-b387-4314-8610-cd245ff79092` — **success**.

A correção não amplia permissões: ela somente faz o backend respeitar a capacidade server-side já concedida como fonte de verdade, conforme a V34/V34.2.

Esta manutenção não altera a Fase 7E da Central de Documentos.

**Próxima ação exata:** a operadora afetada deve atualizar `/telemedicina/` e tentar registrar uma consulta. Se ainda houver `403`, inspecionar a linha de capacidade da conta no backend antes de revogar/reconceder acesso ou alterar outros papéis.

## Fase 7E — seleção OCR granular por campo — 22/09/2026

Problema observado em uso real e confirmado pelo vídeo enviado pelo operador: o OCR do Titon reconhece corretamente o texto, porém a camada selecionável é montada por linhas absolutas e o navegador pode estender a seleção por vários blocos DOM fora da região visual arrastada. O efeito prático é destacar/copiar diversos campos do formulário quando o operador precisa apenas de um trecho.

Diagnóstico no código:
- `document-ocr.js` descartava a geometria individual das palavras e preservava somente cada linha;
- `document-viewer.js` criava um único `span` transparente por linha;
- a seleção nativa do Chromium percorre a ordem DOM desses elementos absolutos, que nem sempre coincide com a caixa visual pretendida em formulários digitalizados.

Correção na branch `fix/central-docs-ocr-granular-selection-20260922`:
- preservar palavra + bounding box produzidos pelo Tesseract;
- manter um identificador de grupo por parágrafo OCR, funcionando como ilha de seleção para um campo/bloco;
- renderizar uma camada transparente por palavra, em vez de uma caixa de texto inteira por linha;
- ao iniciar a seleção em um campo, os grupos OCR externos ficam temporariamente fora da seleção, impedindo que o arraste capture blocos distantes;
- permitir selecionar uma palavra, parte curta ou várias palavras do mesmo campo normalmente;
- manter fallback por linha quando um OCR não fornecer palavras;
- nenhum texto OCR passa a ser persistido ou enviado ao PostHog/terceiros.

Cache-busters candidatos: `document-ocr.js?v=20260922-1`, `document-viewer.js?v=20260922-1` e `documents.css?v=20260922-1`.

**Critério de aceite:** em PDF digitalizado, o operador deve conseguir selecionar/copy apenas uma palavra ou trecho de um campo sem o destaque saltar para outros campos; zoom e OCR local continuam funcionando.

**Próxima ação exata:** concluir CI e o teste Chromium dedicado; integrar somente se verdes e então repetir no mesmo tipo de PDF demonstrado no vídeo.

## Fase 7E — seleção OCR granular integrada e publicada — 22/09/2026

A PR **#398 — Fase 7E: corrigir seleção OCR granular no Titon** foi integrada à `main` no merge `e3be64838548f9d905a4955dcab1a64a042e444a`.

Resultado publicado:
- OCR local preserva bounding box por palavra, em vez de reduzir todo o conteúdo reconhecido a uma caixa por linha;
- cada palavra é posicionada individualmente sobre o scan;
- linhas do mesmo parágrafo OCR compartilham um grupo de seleção;
- ao iniciar a seleção em um grupo, palavras de grupos externos são excluídas temporariamente da seleção, evitando o salto para campos distantes;
- seleção de palavra ou trecho continua nativa do navegador e o texto copiado preserva separadores;
- fallback por linha permanece quando o OCR não fornece palavras;
- nenhum conteúdo OCR é persistido nem enviado ao PostHog/terceiros.

Validação:
- PR: Central Fases 1–6 — **success**;
- PR: navegador/PDF.js real em Chromium, incluindo OCR — **success**;
- PR: governança e site — **success**;
- pós-merge: Central Fases 1–6, governança e site — **success**;
- Cloudflare Pages — **success**;
- GitHub Pages build/deploy — **success**;
- Workers Build produtivo `451ac747-32de-42ef-9b17-8bb735cf38fa` — **success**.

Cache-busters publicados: `document-ocr.js?v=20260922-1`, `document-viewer.js?v=20260922-1` e `documents.css?v=20260922-1`.

**Próxima ação exata:** executar Ctrl+F5 uma vez e repetir a seleção no mesmo tipo de PDF demonstrado no vídeo. O aceite operacional é conseguir marcar/copiar apenas uma palavra ou trecho de um campo sem selecionar outros campos da página.

## Fase 7E — segunda correção da seleção OCR — 22/09/2026

Validação operacional após a PR #398: **reprovada**. O operador confirmou que, mesmo com palavras individuais e isolamento por grupo, ao clicar e arrastar o Chromium ainda puxava a seleção para praticamente a página inteira.

Diagnóstico refinado: a primeira correção ainda deixava o OCR sob a **seleção nativa do navegador** (`window.getSelection`/Range). Em uma camada formada por vários elementos absolutamente posicionados, o Chromium seleciona pela ordem do DOM entre o ponto inicial e o ponto final, e `user-select:none` aplicado aos irmãos não é uma barreira confiável para impedir que o Range atravesse conteúdo intermediário. Por isso o defeito real podia persistir mesmo com caixas por palavra.

Decisão: para páginas OCR, abandonar a seleção nativa como mecanismo de arraste. Texto nativo de PDF continua usando a seleção normal do PDF.js.

Implementação na branch `fix/central-docs-ocr-geometric-selection-20260922`:
- OCR passa a usar seleção geométrica controlada somente em páginas digitalizadas;
- `pointerdown` define a palavra inicial e o grupo/campo OCR;
- `pointermove` identifica pela posição real do mouse a palavra mais próxima dentro do mesmo grupo e seleciona apenas o intervalo de palavras entre início e fim;
- a seleção visual é aplicada somente às palavras realmente escolhidas (`ocr-custom-selected`);
- a seleção nativa da página é cancelada durante o arraste, impedindo o Chromium de criar um Range que atravesse a página;
- ao soltar, um proxy invisível e fora da página recebe somente o texto efetivamente escolhido, preservando Ctrl+C/cópia sem selecionar visualmente outros campos;
- clique fora ou Esc limpa a seleção;
- touch não é interceptado, preservando rolagem no mobile;
- nenhum texto OCR é persistido, registrado ou enviado à observabilidade.

A suíte de navegador foi alterada para reproduzir **arraste real do mouse**, em vez de validar apenas um Range criado programaticamente. O teste exige que a quantidade de palavras selecionadas seja menor que o total reconhecido da página e que o texto copiável também seja menor que o OCR integral.

Cache-busters candidatos: `document-viewer.js?v=20260922-2` e `documents.css?v=20260922-2`. `document-ocr.js` permanece em `20260922-1` porque a extração por palavra já estava correta; o defeito restante era exclusivamente o mecanismo de seleção do visualizador.

**Critério de aceite:** arrastar sobre uma palavra/trecho deve destacar somente o intervalo indicado dentro do campo e Ctrl+C deve copiar apenas esse texto; a página inteira não pode entrar no Range nativo.

**Próxima ação exata:** validar CI direcionado e navegador Chromium; publicar somente se o teste de arraste real passar. Depois repetir no PDF real do operador.

## Fase 7E — seleção OCR geométrica integrada e publicada — 22/09/2026

A validação real posterior à PR #398 mostrou que a correção anterior ainda era insuficiente: o Chromium continuava podendo formar um Range nativo atravessando grande parte da página. A PR **#400 — Fase 7E: impedir seleção da página inteira no OCR** substituiu a seleção nativa por uma seleção geométrica controlada somente para OCR.

Merge funcional: `541c2157f013522df04e23e25b87e0af3c58c3e3`.

Comportamento publicado:
- `pointerdown` fixa palavra e grupo inicial;
- `pointermove` acompanha a palavra real sob o cursor dentro do mesmo grupo OCR;
- somente o intervalo realmente arrastado recebe destaque visual;
- o Range nativo do Chromium é limpo durante o gesto;
- ao soltar, um proxy invisível recebe exclusivamente o texto selecionado para preservar Ctrl+C/cópia;
- PDFs com texto nativo continuam usando a seleção normal do PDF.js;
- clique fora ou Esc limpa a seleção OCR;
- nenhum conteúdo OCR é persistido ou enviado à observabilidade.

Validação técnica:
- PR: Central Fases 1–6 — **success**;
- PR: navegador/PDF.js real em Chromium — **success**, agora com arraste real de mouse e asserção de que a seleção não engloba o OCR inteiro;
- PR: governança e site — **success**;
- pós-merge: Cloudflare Pages, Workers Build produtivo `5757e6f3-c602-4a97-a3a7-d4ee6fffc9c2`, build e deploy — **success**.

Cache-busters publicados: `document-viewer.js?v=20260922-2` e `documents.css?v=20260922-2`.

**Próxima ação exata:** executar Ctrl+F5 e repetir no PDF real o mesmo gesto curto de clique + arraste. O aceite operacional é destacar/copiar apenas o trecho arrastado, sem seleção da página inteira.

## Fase 7E — controle vertical da seleção OCR — 22/09/2026

Validação operacional após a PR #400: **parcialmente aprovada**. O usuário confirmou melhora horizontal, porém ao selecionar um parágrafo na coluna direita o Titon ainda trouxe textos da coluna esquerda situados na mesma faixa vertical.

Evidência real: em formulário com conteúdo em duas colunas, o arraste sobre a justificativa da direita também destacou rótulos/valores à esquerda. Isso mostrou que selecionar um intervalo pela ordem das palavras ainda não corresponde ao gesto visual em documentos tabulares.

Diagnóstico refinado: a seleção geométrica anterior ainda transformava o gesto em um intervalo linear entre palavra inicial e palavra final. Em layouts com colunas, uma ordem OCR/DOM pode intercalar elementos da esquerda e da direita entre esses dois extremos.

Correção na branch `fix/central-docs-ocr-rectangular-selection-20260922`:
- a seleção OCR passa a ser **bidimensional/retangular**;
- o ponto inicial e a posição atual do mouse formam um retângulo real na tela;
- entram na seleção apenas palavras cujas caixas visuais intersectam esse retângulo;
- não há mais dependência de grupo, parágrafo, coluna inferida ou intervalo pela ordem DOM para decidir o que fica destacado;
- o texto copiado continua ordenado pelo `ocrOrder`, mas somente depois do filtro espacial 2D;
- clique simples continua selecionando a palavra inicial;
- a seleção nativa do Chromium continua desativada apenas para OCR; PDFs com texto nativo permanecem inalterados.

Regressão dedicada: o scan sintético do navegador agora contém duas colunas na mesma faixa vertical. O teste arrasta sobre a coluna direita e exige que **100% das palavras selecionadas permaneçam à direita da linha divisória**, comprovando que a coluna esquerda não foi capturada.

Cache-buster candidato: `document-viewer.js?v=20260922-3`. O OCR em si permanece em `document-ocr.js?v=20260922-1`, pois a geometria por palavra já estava correta.

**Critério de aceite:** selecionar verticalmente um parágrafo/caixa na direita não pode incluir qualquer texto da coluna esquerda que esteja na mesma altura.

**Próxima ação exata:** validar CI estrutural e o teste Chromium de duas colunas; integrar somente se verdes e então repetir no mesmo documento real mostrado pelo usuário.

## Fase 7E — seleção OCR retangular integrada e publicada — 22/09/2026

A PR **#402 — Fase 7E: dar controle vertical e por coluna à seleção OCR** foi integrada à `main` no merge `477222103dbd295aa39a215aba9570d1e9c76e27`.

Resultado publicado:
- seleção OCR passou de intervalo linear para filtro espacial **2D/retangular**;
- apenas palavras cujas caixas visuais intersectam o retângulo real entre ponto inicial e posição atual do mouse são destacadas;
- seleção deixa de depender de grupo/parágrafo/ordem DOM para decidir inclusão;
- texto copiado é ordenado depois do filtro geométrico, portanto uma coluna vizinha fora da área arrastada não entra na seleção;
- clique simples continua selecionando a palavra inicial;
- seleção nativa do PDF.js permanece intacta para PDFs com texto real.

Regressão adicionada:
- o scan sintético passou a conter **duas colunas na mesma faixa vertical**;
- o Playwright arrasta sobre a coluna direita e exige que todas as palavras selecionadas permaneçam à direita da linha divisória;
- Fases 1–6, navegador Chromium, governança e site passaram na PR.

Publicação estática pós-merge:
- GitHub build — **success**;
- GitHub deploy — **success**;
- Cloudflare Pages — **success**;
- governança — **success**.

Observação de infraestrutura: o check externo `Workers Builds: yellow-wave-d0a1guia-regulacao-ia` falhou neste merge. A PR #402 não alterou qualquer arquivo de runtime do Worker; os arquivos modificados foram somente `documentos/index.html`, `js/document-viewer.js`, testes/harness e status. Portanto essa falha não bloqueou a publicação estática da correção OCR e não representa regressão causada pelo mecanismo de seleção. Não declarar nova versão de Worker para este merge.

Cache-buster publicado: `document-viewer.js?v=20260922-3`.

**Próxima ação exata:** executar Ctrl+F5 e repetir no documento real mostrado pelo usuário, selecionando apenas o parágrafo da coluna direita. O aceite é a coluna esquerda permanecer totalmente fora do destaque/cópia.

## Fase 7E — seleção OCR retangular aprovada em uso real — 22/09/2026

Validação operacional do usuário: **APROVADA**.

Após a publicação da PR #402, o usuário repetiu no PDF real o caso que anteriormente falhava em formulário com conteúdo lado a lado e confirmou que o comportamento está **perfeito**.

Evidência funcional:
- controle horizontal preservado;
- controle vertical corrigido;
- seleção restrita à área 2D realmente arrastada;
- textos da coluna esquerda deixam de ser incluídos ao selecionar apenas o bloco da direita;
- cópia passa a refletir somente o trecho efetivamente selecionado.

Conclusão: o problema de seleção OCR ampla/involuntária está encerrado. Não continuar polindo esta frente sem nova evidência real de regressão.

**Próxima ação exata:** retomar a pendência normal da Fase 7E — observar uso real da paginação de 20 itens e comparar `drive_folder_opened` / `drive_search_completed` com a baseline anterior.

## Fase 7E — corrigir ordem da Home sem desfazer preload prioritário — 22/09/2026

Feedback operacional: houve uma interpretação incorreta do objetivo de **Consulta [2026]** e **Exames [2026]** como pastas prioritárias. A intenção sempre foi mantê-las e seus PDFs **aquecidos em segundo plano**, sem promovê-las, injetá-las ou alterar a ordem visual de **Meu Drive**.

Diagnóstico do estado real:
- o preload prioritário já armazena `priorityFolders` separadamente do snapshot `folder` da raiz;
- o listener do frontend já não encontra uma pasta prioritária quando `parentRef` é vazio, mas essa neutralidade estava implícita e passa a ser explicitamente protegida;
- a mudança visual de ordem percebida na Home não veio de uma regra que promovesse Consulta/Exames pelo nome;
- a causa técnica relevante foi a otimização da PR #388, que removeu o `orderBy=folder,name_natural` da consulta remota do Google Drive. Com paginação curta, o Drive podia entregar um primeiro lote arbitrário; o frontend ordenava apenas os 20 itens já recebidos, portanto a composição da primeira página deixou de reproduzir a ordem histórica.

Correção na branch `fix/central-docs-root-order-priority-neutral-20260922`:
- `listDriveFolder` volta a usar `orderBy=folder,name_natural`, restaurando a composição/ordem histórica antes da paginação;
- a pesquisa mantém o fast-path sem `orderBy`, para não reintroduzir custo desnecessário onde o usuário não pediu mudança;
- o evento `portal:documents-warm-updated` agora possui guarda explícita `if (!parentRef) return`, proibindo qualquer snapshot de pasta prioritária de substituir ou reordenar a Home;
- Consulta [2026] e Exames [2026] continuam sendo resolvidas/aquecidas em segundo plano e seus PDFs continuam elegíveis ao cache criptografado; somente a apresentação da Home fica neutra.

Alternativas descartadas:
- remover o preload de Consulta/Exames: descartado, pois o objetivo de velocidade permanece válido;
- ordenar manualmente Consulta/Exames no topo da Home: descartado, pois contraria a intenção do operador;
- restaurar `orderBy` também na pesquisa: não necessário para este problema e poderia devolver parte do custo removido no fast-path.

**Critério de aceite:** Meu Drive volta à ordem histórica; Consulta/Exames não recebem promoção visual por serem prioritárias; ao abrir essas pastas, o preload continua oferecendo resposta antecipada.

**Próxima ação exata:** validar CI, publicar se verde e pedir somente um Ctrl+F5 + conferência visual da Home e abertura das duas pastas prioritárias.

## Fase 7E — correção da ordem da Home integrada — 22/09/2026

A PR **#406 — Fase 7E: restaurar ordem da Home sem promover pastas prioritárias** foi integrada à `main` no merge `36c6b8383cb11f232021db823b8a7c46547fce8e`.

Estado confirmado:
- Consulta [2026] e Exames [2026] continuam prioridades **somente de preload em segundo plano**;
- o frontend possui guarda explícita para que `priorityFolders` nunca substitua/reordene a raiz `Meu Drive`;
- `listDriveFolder` recuperou `orderBy=folder,name_natural`, que existia antes do fast-path e define a composição estável da página antes do corte em 20 itens;
- pesquisa continua sem `orderBy`, preservando a otimização de busca;
- a paginação visual continua em 20 itens.

Validação da PR:
- teste estrutural específico da Fase 7E/Drive: **success**;
- navegador/PDF.js real em Chromium: **success**;
- site e governança: **success**;
- o workflow agregado Fases 1–6 ficou vermelho por regressões concorrentes da camada social já presentes na `main` naquele momento; os testes da Central executados dentro da mesma suíte ficaram verdes.

Publicação estática do merge #406: build e deploy GitHub — **success**. O Workers Build do merge falhou antes de confirmar a nova versão do backend. Portanto, a proteção frontend já está versionada, mas a restauração remota de `orderBy` só deve ser declarada produtiva depois de um Workers Build verde.

Após #406, a PR concorrente #404 atualizou a camada social e suas validações. Este registro documental também serve para provocar nova execução normal dos pipelines na `main`, sem alterar código funcional.

**Próxima ação exata:** confirmar o novo Workers Build. Se verde, validar Home com Ctrl+F5 e abrir Consulta/Exames para confirmar preload. Se vermelho, diagnosticar o bloqueio do gate sem reduzir segurança nem remover requisitos de secrets.

## Fase 7E — ordem histórica da Home publicada — 22/09/2026

A reconciliação pós-merge da PR #406 foi concluída.

Evidência final de publicação:
- PR funcional #406 integrada em `36c6b8383cb11f232021db823b8a7c46547fce8e`;
- PR documental #407 integrada em `7fd0ac98c499c3419814d61296b2c78ec9b64b9c`;
- Workers Build produtivo `7cbc3b05-87ab-41bb-b87c-3762a2969328` — **success**;
- GitHub build/deploy — **success**;
- governança e validações sociais/gerais do novo `main` — **success**.

Conclusão operacional: `listDriveFolder` com `orderBy=folder,name_natural` está novamente publicado no Worker; a Home pode voltar à composição/ordem histórica antes do corte de 20 itens. Consulta [2026] e Exames [2026] permanecem aquecidas exclusivamente em segundo plano, sem promoção visual na raiz.

**Próxima ação exata:** Ctrl+F5 uma vez na Central e conferir a Home. Depois abrir Consulta [2026] e Exames [2026] para confirmar que o preload continua ativo sem alterar a ordem de Meu Drive.


## Fase 7E — comparação controlada entre IA atual e Gemini pago — 22/09/2026

Decisão do operador: **não substituir nem remover a IA documental atual do Titon**. O objetivo é manter o pipeline atual de Cloudflare Workers AI em produção e adicionar o Gemini pago como **segunda opção manual**, para comparar precisão, latência e consumo antes de qualquer decisão futura.

Configuração externa concluída pelo operador, sem exposição de segredos:
- migração para **Google AI Pro**;
- benefício do Google Developer Program Premium ativo;
- dois créditos mensais do Google Cloud aplicados à conta de faturamento;
- projeto **Portal da Regulacao de Saude** importado no Google AI Studio e ativado em Nível 1 / pré-pagamento;
- chave Gemini criada no projeto correto;
- secret **`TITON_GEMINI_API_KEY`** criado no Cloudflare Worker. O valor não foi enviado ao chat, GitHub, frontend ou documentação.

Arquitetura aprovada para a comparação:
- provider atual permanece **`cloudflare-workers-ai`**, com `DOCUMENTS_AI_FREE_ONLY=true`, Gemma principal e Qwen/Moondream conforme as regras já homologadas;
- Gemini é provider separado **`google-gemini-api`**, nunca fallback automático da IA atual;
- chamada Gemini ocorre **somente quando o usuário clicar em “Extrair com Gemini”**;
- abrir PDF, OCR, preload e extração com a IA atual não geram chamadas pagas ao Gemini;
- resultados Gemini ficam em estado separado e não substituem `documentAiResults`, `documentAiEvidence` nem o chat documental canônico;
- interface mostra comparação campo a campo com rótulos neutros **Igual/Difere**, sem eleger automaticamente um vencedor;
- modelo inicial aprovado para teste: **`gemini-2.5-flash`** estável; `gemini-2.5-flash-lite` fica apenas como opção allowlisted futura;
- raciocínio do 2.5 Flash é desabilitado na extração (`thinkingBudget=0`) para reduzir latência/custo;
- resposta Gemini usa JSON estruturado e é revalidada pelos normalizadores restritivos já existentes do Titon.

Privacidade e segurança:
- o secret é lido somente no Worker e nunca retornado pelo endpoint de configuração;
- a página é enviada ao Gemini apenas por ação explícita de comparação;
- não são enviados nome de arquivo, Drive ID, username, termo de busca ou outros metadados desnecessários;
- conteúdo, imagem, prompt e resposta Gemini não entram no PostHog nem em logs;
- somente métricas técnicas agregadas já permitidas (tempo, origem técnica, status/tokens exibidos localmente) podem ser usadas;
- nenhum retry cego de chamada paga foi introduzido;
- o gate de deploy passa a tratar `TITON_GEMINI_API_KEY` como binding crítico, preservando o segredo entre versões.

Implementação em andamento na branch **`feat/titon-gemini-comparison-20260922`**:
- novo provider backend `worker/document-ai-gemini.js`;
- nova rota autenticada `POST /api/documents/ai/page/gemini`, protegida pela capability `extract`;
- configuração pública expõe apenas disponibilidade/modelo, nunca a chave;
- botão original passa a se identificar como **“Extrair com IA atual”** e mantém exatamente o pipeline existente;
- novo botão **“Extrair com Gemini”**;
- comparação por página/campo em área separada;
- testes unitários do provider, isolamento entre providers, segredo no backend e preservação do provider atual.

Alternativas descartadas:
- substituir Gemma/Qwen pelo Gemini: descartado pelo operador;
- executar as duas IAs automaticamente em todo PDF: descartado por custo, privacidade e necessidade de controle humano;
- usar Gemini como fallback silencioso: descartado porque impediria comparação justa e criaria consumo pago não explícito;
- colocar a chave no navegador: proibido por segurança.

**Critério de aceite desta janela:** IA atual continua funcionando sem alteração de provider; Gemini só roda por clique próprio; os dois resultados podem ser comparados no mesmo PDF; nenhuma chave ou conteúdo documental é exposto em frontend/telemetria; CI e gate de deploy permanecem verdes.

**Próxima ação exata:** concluir testes/CI da branch, abrir PR e integrar somente com todos os checks relevantes verdes. Depois executar comparação real no mesmo PDF com IA atual e Gemini e registrar precisão, latência e uso técnico antes de qualquer decisão sobre provider preferido.

## Fase 7E — comparação Gemini integrada e publicada — 22/09/2026

A PR **#414 — Fase 7E: adicionar Gemini como IA comparativa no Titon** foi integrada à `main` no merge **`64e7febceec81c9ec456b0181245e52ff6a41eae`**.

Resultado publicado:
- a IA atual do Titon **não foi removida nem substituída**;
- `cloudflare-workers-ai` continua como provider canônico, com `DOCUMENTS_AI_FREE_ONLY=true`;
- novo botão **Extrair com IA atual** executa o mesmo pipeline já homologado;
- novo botão **Extrair com Gemini** chama exclusivamente a rota `POST /api/documents/ai/page/gemini`;
- Gemini é manual, independente e nunca é fallback silencioso;
- resultados Gemini ficam separados dos resultados/evidências da IA atual;
- interface compara os dois resultados campo a campo e por página com estados neutros **Igual/Difere**;
- modelo inicial: `gemini-2.5-flash`, com `thinkingBudget=0`, temperatura 0 e saída JSON estruturada;
- o backend aplica novamente os normalizadores restritivos do Titon depois da resposta Gemini;
- nenhuma chamada Gemini é feita por preload, abertura de PDF, OCR, chat ou extração da IA atual.

Segurança e privacidade:
- `TITON_GEMINI_API_KEY` permanece somente como secret do Cloudflare Worker;
- o valor não foi versionado, retornado ao frontend nem registrado na documentação;
- o gate seguro agora exige esse secret como binding crítico;
- a chamada envia somente a imagem da página e as instruções/schema necessários;
- filename, Drive ID, usuário e termo de busca não são enviados;
- imagem, prompt e resposta Gemini não entram em PostHog/logs;
- não existe retry automático de chamada paga.

Validação:
- testes unitários do provider Gemini — **success**;
- validação explícita de que o provider atual continua `cloudflare-workers-ai` e gratuito — **success**;
- teste de segredo ausente/modelo não aprovado com fail-closed — **success**;
- Central Fases 1–6 — **success**;
- navegador/PDF.js real em Chromium — **success**;
- gate de deploy seguro — **success**;
- site e governança — **success**;
- Cloudflare Pages — **success**;
- GitHub build/deploy — **success**;
- Workers Build produtivo **`7181d753-8875-421b-a471-12cc64fbfca3`** — **success**.
- O check de Workers Build na branch da PR ficou vermelho no ambiente de PR; a publicação em `main` passou integralmente pelo gate seguro e confirmou o build produtivo acima.

Limite da evidência atual:
- a integração está publicada e validada estruturalmente com respostas Gemini simuladas nos testes;
- ainda **não foi executada uma inferência real autenticada contra a API Gemini em produção**, porque o secret nunca é exposto às ferramentas de CI/chat;
- portanto precisão, latência e consumo reais ainda precisam ser medidos pelo operador no Titon.

**Próxima ação exata:** executar Ctrl+F5 na Central, abrir um PDF conhecido e rodar primeiro **Extrair com IA atual** e depois **Extrair com Gemini**. Registrar se o Gemini conclui, tempo/tokens apresentados e diferenças campo a campo. Não escolher provider preferido nem automatizar Gemini antes dessa comparação real.

## Fase 7E — corrigir Gemini que carrega e some sem resultado — 23/09/2026

Feedback operacional após a publicação da PR #414: ao clicar em **Extrair com Gemini**, o Titon entrou em estado de carregamento e, ao terminar, não exibiu resultado nem mensagem de erro.

Diagnóstico no estado real da `main`:
1. **Defeito confirmado de UI:** no `catch` da extração Gemini a mensagem de erro era escrita em `documentsAiGeminiStatus`, porém o `finally` chamava `renderDocumentAiPanel()`. O renderer da comparação só mantinha a seção visível quando Gemini estava **executando** ou quando a extração havia **concluído com sucesso**. Como uma falha deixava `documentAiGeminiScanCompleted=false` e `documentAiBusy=false`, a própria seção que continha o erro era imediatamente escondida. Isso explica exatamente o comportamento “carregou e não mostrou nada”.
2. **Risco de compatibilidade do provider identificado:** a integração inicial usava `gemini-2.5-flash`. A documentação oficial atual do Google informa que projetos novos têm acesso limitado à série 2.5 e recomenda modelos atuais para novos projetos.
3. **Contrato REST desatualizado:** o provider usava `responseMimeType + responseJsonSchema`, `thinkingBudget` e um schema de topo com `oneOf`. A documentação atual de `generateContent` para Gemini 3.x usa `generationConfig.responseFormat.text.mimeType/schema`, `thinkingLevel` e documenta `anyOf` no subset de JSON Schema.

Correção na branch `fix/titon-gemini-empty-result-20260923`:
- Gemini comparativo migra para **`gemini-3.5-flash-lite`**, modelo GA atual orientado a baixa latência, baixo custo e análise/extração documental;
- `gemini-3.8-flash` permanece allowlisted para eventual comparação futura, com nível de pensamento `low`;
- 3.5 Flash-Lite usa `thinkingLevel=minimal`;
- request estruturado passa para `responseFormat.text.mimeType = application/json` + `schema`;
- schema deixa `oneOf` e passa a objeto fechado com `fields.anyOf`, continuando revalidado pelo schema restritivo do backend;
- parâmetros de amostragem antigos (`temperature`, `topP`, `seed`) são removidos do Gemini 3.x;
- HTTP 404 do provider vira erro explícito `DOCUMENT_AI_GEMINI_MODEL_UNAVAILABLE`;
- frontend mantém `documentAiGeminiLastError` em memória da sessão;
- a seção de comparação permanece visível quando houver erro, mesmo depois de o loading terminar;
- uma nova tentativa limpa o erro anterior;
- ao fechar o PDF, o erro também é descartado;
- cache-buster do cliente avança para `documents.js?v=20260923-1`.

A IA atual do Titon continua **inalterada** e canônica:
- `cloudflare-workers-ai` permanece provider principal;
- `DOCUMENTS_AI_FREE_ONLY=true` permanece;
- Gemini continua somente por clique explícito e nunca como fallback automático;
- nenhum resultado Gemini substitui `documentAiResults` ou `documentAiEvidence`.

Privacidade/observabilidade permanecem:
- secret `TITON_GEMINI_API_KEY` continua somente no Worker;
- nenhuma imagem, prompt, resposta, nome, Drive ID ou conteúdo é enviado ao PostHog/log;
- não foi adicionado retry automático de chamada paga.

**Critério de aceite:** ao clicar em **Extrair com Gemini**, a execução deve terminar em uma destas duas formas visíveis: (a) resultado/comparação, ou (b) mensagem de erro persistente e legível. Nunca pode voltar silenciosamente ao estado inicial.

**Próxima ação exata:** validar testes/CI, publicar se verdes e repetir no mesmo PDF real. Se houver falha do provider, a mensagem agora ficará visível e permitirá diagnóstico direto sem expor a chave.

## Fase 7E — correção Gemini publicada — 23/09/2026

A PR **#416 — Fase 7E: corrigir extração Gemini que terminava sem resultado** foi integrada à `main` no merge **`32ff226a82affd9b838b7151ac2efe8074806f1e`**.

Publicação confirmada:
- Central Fases 1–6 — **success**;
- navegador/PDF.js real em Chromium — **76 passed / 4 skipped**;
- gate de deploy seguro — **success**;
- site e governança — **success**;
- Cloudflare Pages — **success**;
- GitHub build/deploy — **success**;
- Workers Build produtivo **`18ec1340-55b0-4ecd-bab8-0ede2f81c94b`** — **success**.

Estado funcional publicado:
- Gemini comparativo agora usa **`gemini-3.5-flash-lite`**;
- request REST foi alinhado ao contrato atual de `generateContent` para Gemini 3.x;
- erro do Gemini permanece visível depois do loading e não pode mais desaparecer silenciosamente;
- HTTP 404 de modelo possui mensagem específica;
- nova tentativa limpa erro antigo;
- a IA atual Cloudflare permanece intacta, canônica e independente;
- Gemini continua somente por clique explícito, sem fallback ou retry pago automático;
- cache-buster ativo: **`documents.js?v=20260923-1`**.

Observação: a causa exata da primeira falha no provider não pôde ser recuperada porque a própria UI antiga escondia o erro e conteúdo do provider não é logado por política. A falha de UX foi comprovada no código. A atualização de modelo/contrato elimina os riscos de compatibilidade identificados, mas a confirmação final depende de uma nova chamada real autenticada.

**Próxima ação exata:** Ctrl+F5, abrir o mesmo PDF e clicar em **Extrair com Gemini**. O resultado esperado é comparação visível; se ainda houver falha, copiar somente a mensagem de erro exibida na própria janela, nunca a chave.

## Fase 7E — erro Gemini 400 por enums REST — 23/09/2026

Nova evidência operacional após a PR #416: o erro agora permaneceu visível e mostrou **“O Gemini recusou a estrutura da solicitação.”**. Isso confirma que billing, secret, autenticação da rota e renderização do erro avançaram até a chamada do provider; a falha atual é um HTTP 400 de contrato da requisição.

Revisão contra a documentação oficial atual do Google para `generateContent` identificou o erro preciso:
- `GenerationConfig.thinkingConfig.thinkingLevel` é um **enum protobuf REST** com valores `MINIMAL`, `LOW`, `MEDIUM`, `HIGH`;
- `GenerationConfig.responseFormat.text.mimeType` também é enum REST, e o valor JSON documentado para saída estruturada é `APPLICATION_JSON`;
- o código publicado enviava os aliases humanizados em minúsculas: `minimal` e `application/json`;
- esses valores são usados naturalmente nos SDKs e exemplos de alto nível, mas no corpo REST bruto do endpoint `v1beta/models/...:generateContent` o contrato exposto pelo Google espera os enums canônicos.

Correção na branch **`fix/titon-gemini-rest-enums-20260923`**:
- `thinkingLevel: 'MINIMAL'` para `gemini-3.5-flash-lite`;
- `thinkingLevel: 'LOW'` para eventual `gemini-3.8-flash`;
- `responseFormat.text.mimeType: 'APPLICATION_JSON'`;
- mensagem de HTTP 400 continua sanitizada e agora identifica apenas a categoria técnica quando o Google citar `thinkingLevel`, `responseFormat/mimeType` ou `schema`, sem devolver payload, conteúdo do documento ou chave;
- testes passam a bloquear regressão para aliases minúsculos no REST.

A IA atual permanece inalterada e independente. Não houve mudança de segredo, permissões, Drive, OCR, PostHog ou provider canônico.

**Critério de aceite:** a próxima chamada real não deve retornar o mesmo 400 de estrutura. Se houver outro 400, a UI deve indicar a categoria técnica sanitizada; se a API aceitar, o Gemini deve retornar JSON estruturado e a comparação aparecer.

**Próxima ação exata:** validar CI, integrar/publicar e repetir no mesmo PDF com Ctrl+F5 + **Extrair com Gemini**.

## Fase 7E — correção dos enums REST Gemini publicada — 23/09/2026

A PR **#418 — Fase 7E: corrigir contrato REST do Gemini** foi integrada à `main` no merge **`61de522beabe6eb6d344907a5ede763c55f52a8e`**.

Evidência operacional que levou à correção:
- após a PR #416, o erro deixou de desaparecer e passou a mostrar **“O Gemini recusou a estrutura da solicitação.”**;
- isso confirmou falha HTTP 400 na estrutura do request, não ausência de feedback.

Causa confirmada na documentação oficial do Google para REST `generateContent`:
- `thinkingConfig.thinkingLevel` é enum REST com valores `MINIMAL`, `LOW`, `MEDIUM`, `HIGH`;
- `responseFormat.text.mimeType` é enum REST e usa `APPLICATION_JSON`;
- o cliente enviava os aliases minúsculos `minimal` e `application/json`, adequados a camadas SDK/exemplos humanizados, mas não ao enum canônico do corpo REST bruto.

Correção publicada:
- `gemini-3.5-flash-lite` continua como modelo comparativo;
- `thinkingLevel='MINIMAL'`;
- eventual `gemini-3.8-flash` usa `thinkingLevel='LOW'`;
- `responseFormat.text.mimeType='APPLICATION_JSON'`;
- erro HTTP 400 continua sanitizado, podendo indicar apenas a categoria técnica (`thinkingLevel`, formato de resposta ou schema) sem expor payload ou conteúdo do documento;
- IA atual Cloudflare permanece canônica, independente e inalterada.

Validação:
- Central Fases 1–6 — **success**;
- site/governança — **success**;
- Cloudflare Pages — **success**;
- GitHub build/deploy — **success**;
- Workers Build produtivo **`33a85383-5856-4648-930e-a06d1b241005`** — **success**.

**Próxima ação exata:** Ctrl+F5, abrir o mesmo PDF e clicar **Extrair com Gemini**. Esperado: o HTTP 400 anterior não se repetir; se surgir outro erro, registrar somente a mensagem sanitizada exibida no painel.


## Fase 7E — Gemini 3.5 Flash-Lite escolhido como provider único do Titon — 23/09/2026

Decisão operacional do usuário após homologação real: **manter somente o Gemini 3.5 Flash-Lite como IA de extração documental visível no Titon**. Nos testes realizados, o operador considerou a velocidade satisfatória e os resultados mais fiéis que o provider anterior. Essa decisão não transforma a avaliação empírica em garantia absoluta de ausência de erro: as barreiras restritivas do Titon permanecem obrigatórias.

Evidências operacionais informadas nesta janela:
- PDF de 2 páginas: aproximadamente **5.000–5.500 tokens**;
- PDF de 3 páginas: aproximadamente **7.000 tokens**;
- PDF de 12 páginas: **29.175 tokens**;
- a maioria dos PDFs do fluxo real possui aproximadamente 2 páginas;
- projeto Google correto confirmado em **Tier 1**, com limites operacionais muito acima do volume esperado.

Arquitetura aprovada:
- `gemini-3.5-flash-lite` passa de provider comparativo para **provider canônico**;
- painel volta a ter um único botão **Extrair dados do PDF**;
- resultado Gemini alimenta diretamente `documentAiResults`, `documentAiEvidence` e os recursos de copiar/ordenar;
- comparação IA atual × Gemini é removida da interface;
- chat documental antigo fica desabilitado para que o fluxo normal não use Workers AI;
- nenhum fallback automático para Workers AI;
- nenhuma preextração paga automática;
- Workers AI permanece somente como código de rollback técnico, sem botão, sem provider canônico e sem execução normal;
- `TITON_GEMINI_API_KEY` continua exclusivamente no Worker;
- schema fechado, proveniência por página, estados NÃO CONSTA/ILEGÍVEL e normalizadores restritivos permanecem.

Implementação iniciada na branch `feat/titon-gemini-primary-20260923`:
- `TITON_GEMINI_ENABLED=true`;
- `TITON_GEMINI_COMPARISON_ENABLED=false`;
- configuração pública passa a declarar `google-gemini-api` como provider;
- botão primário usa exclusivamente `/api/documents/ai/page/gemini`;
- concorrência mantida em 3 páginas, já considerada satisfatória nos testes reais;
- tokens/modelo/tempo continuam disponíveis apenas como feedback técnico local da execução;
- cache-buster do cliente avança para `documents.js?v=20260923-2`.

**Critério de aceite:** em produção deve existir apenas um fluxo visível de extração, usando Gemini 3.5 Flash-Lite; nenhum clique normal deve chamar `/page/extract` do provider legado; resultados continuam separados por página e sujeitos às mesmas validações restritivas; ausência de secret/modelo deve falhar fechado; CI e deploy seguro devem permanecer verdes.

**Próxima ação exata:** concluir testes da branch, abrir PR e integrar somente com checks verdes. Após publicação, Ctrl+F5 e validar um PDF conhecido pelo botão único **Extrair dados do PDF**.


## Fase 7E — promoção do Gemini canônico integrada à main — 23/09/2026

A PR **#420 — Fase 7E: tornar Gemini 3.5 Flash-Lite a IA principal do Titon** foi integrada à `main` no merge **`1955d58e404402cc4cffa085ec9122358573efb9`**.

Resultado versionado:
- um único botão visível **Extrair dados do PDF**;
- `google-gemini-api` / `gemini-3.5-flash-lite` é o provider documental canônico;
- a extração principal chama exclusivamente `POST /api/documents/ai/page/gemini`;
- resultados Gemini alimentam diretamente os estados canônicos de resultado/evidência do Titon;
- comparação IA atual × Gemini foi removida da interface;
- chat documental legado ficou desabilitado no fluxo publicado;
- nenhum fallback automático para Workers AI;
- nenhuma inferência Gemini é antecipada em segundo plano; o background continua limitado a preparação local segura;
- Workers AI permanece somente como implementação de rollback técnico, sem botão e sem chamada no fluxo normal;
- `TITON_GEMINI_API_KEY` continua exclusivamente no Worker;
- cache-buster do cliente: **`documents.js?v=20260923-2`**.

Validação da PR no head final `569df902a364d5d027047f3512404423ade7ab04`:
- **25/25 workflows GitHub Actions concluídos com success**;
- Central de Documentos — Fases 1–6: **success**;
- navegador/PDF.js real em Chromium: **success**;
- gate de deploy seguro do Worker: **success**;
- bundle de staging: **success**;
- site: **success**;
- governança: **success**;
- demais workflows do Portal no mesmo head: **success**.

Correções realizadas durante a validação:
- testes históricos da Fase 6 foram reconciliados porque agora é decisão explícita **não antecipar inferência paga**;
- o workflow estrutural deixou de exigir concorrência 5 do provider antigo e passou a validar concorrência 3 do Gemini canônico;
- testes 5C passaram a validar que classificação/extração manual legada e chat não são recursos públicos do provider canônico.

Limite da evidência neste momento:
- o código funcional está integrado à `main`;
- o conector GitHub disponível nesta sessão lista runs vinculados a Pull Requests, mas não fornece os runs de push pós-merge usados para comprovar o Workers Build produtivo;
- por isso a publicação efetiva do Worker não deve ser declarada confirmada sem evidência adicional ou teste operacional.

**Próxima ação exata:** confirmar que o deploy de produção contém o merge #420. Em seguida executar Ctrl+F5 na Central, abrir um PDF conhecido e usar o botão único **Extrair dados do PDF**. Se o resultado Gemini aparecer normalmente, registrar a homologação produtiva e encerrar esta unidade da 7E.


## Fase 7E — falso negativo em laudo para procedimento ambulatorial — 23/09/2026

Evidência operacional real após a promoção do Gemini 3.5 Flash-Lite a provider canônico: um PDF que contém uma folha cujo cabeçalho principal é **`LAUDO PARA SOLICITAÇÃO/AUTORIZAÇÃO DE PROCEDIMENTO AMBULATORIAL`** foi exibido pelo Titon sem bloco de página médica autorizada.

Diagnóstico no código:
- o Gemini recebe `PROMPT_ANALISE_REGULACAO_V1.system`;
- a classificação usa allowlist fechada por título/cabeçalho;
- a lista incluía `LAUDO MÉDICO`, encaminhamentos, receitas e solicitações específicas, mas **não incluía** o título institucional acima;
- a mesma folha contém seções de identificação/dados cadastrais, portanto também era necessário reforçar que rótulos internos como `DADOS` não devem sobrepor o título médico principal.

Causa confirmada: **lacuna de governança/classificação no prompt**, não incapacidade de leitura do Gemini. A regra estava restritiva demais para um formulário médico real usado no fluxo.

Correção na branch `fix/titon-apac-medical-page-20260923`:
- adiciona como página médica autorizada:
  - `LAUDO PARA SOLICITAÇÃO/AUTORIZAÇÃO DE PROCEDIMENTO AMBULATORIAL`;
  - variação com espaços ao redor da barra;
- define precedência explícita do título/cabeçalho principal sobre rótulos internos;
- `DADOS` dentro de seção de identificação/cadastro não autoriza `comprovante_atendimento`;
- se o título principal for médico, a presença de dados cadastrais na mesma folha não altera `pagina_medica_autorizada`;
- prompt de classificação sobe para versão `v3`;
- prompt integrado Gemini sobe para `v3`;
- prompt compacto de rollback sobe para `v3`;
- documentação da Fase 5 e homologação 5E atualizadas;
- testes impedem regressão e conferem que a instrução enviada ao Gemini contém a nova categoria e a regra de precedência.

Alternativas descartadas:
- classificar como médica qualquer página que contenha CID, procedimento ou médico: ampliaria falso positivo e reduziria a barreira de segurança;
- inferência adicional/OCR apenas para decidir o tipo: custo e latência desnecessários;
- tornar a classificação semanticamente aberta: perderia a política restritiva já aprovada.

**Critério de aceite:** o formulário com esse cabeçalho deve gerar bloco de página médica autorizada, preservando literalidade e isolamento; folhas não autorizadas continuam `outro`; se houver `DADOS` apenas como seção interna de uma folha médica, o título médico principal prevalece.

**Próxima ação exata:** validar CI, integrar/publicar e retestar um PDF do mesmo tipo.


## Fase 7E — correção do laudo ambulatorial integrada — 23/09/2026

A PR **#422 — Fase 7E: reconhecer laudo ambulatorial como página médica** foi integrada à `main` no merge **`7b220f2527f76f3c714d6c3aa831070712d7cb19`**.

Validação do head funcional `5029808717b76f2446dadfc3a3b7731a5c48da1a`:
- **21/21 workflows GitHub Actions: success**;
- Central de Documentos — Fases 1–6: **success**;
- site: **success**;
- governança: **success**;
- demais workflows disparados para o head: **success**.

Estado versionado:
- `PROMPT_CLASSIFICACAO_PAGINAS_V1` em **v3**;
- `PROMPT_ANALISE_REGULACAO_V1` em **v3**;
- `PROMPT_ANALISE_REGULACAO_COMPACTA_V1` em **v3**;
- `LAUDO PARA SOLICITAÇÃO/AUTORIZAÇÃO DE PROCEDIMENTO AMBULATORIAL` e variação com espaços ao redor da barra são páginas médicas autorizadas;
- o título/cabeçalho principal tem precedência sobre rótulos internos;
- `DADOS` em identificação/cadastro não transforma uma folha médica em comprovante;
- Gemini canônico continua sem fallback automático e sem preextração paga.

**Próxima ação exata:** retestar em produção o mesmo tipo de formulário após Ctrl+F5. Só após a confirmação operacional declarar esta correção homologada.


## Fase 7E — preferência de zoom do Titon vinculada à conta — 23/09/2026

Pedido operacional: o último **zoom percentual definido manualmente** no visualizador deve se tornar automaticamente o padrão dos PDFs seguintes e deve ser lembrado pelo Portal por pessoa/conta.

Arquitetura adotada:
- nova preferência técnica por usuário em D1: `auth_document_viewer_preferences`;
- armazena somente `username` e `zoom_scale`, sem qualquer referência a PDF ou conteúdo;
- faixa aceita preserva a capacidade real do visualizador: **45% a 300%**;
- contas sem escolha manual gravada continuam usando o comportamento histórico do PDF.js/Titon: **114% como fallback inicial**, limitado pela largura quando necessário;
- após uma escolha manual, o próximo PDF abre com esse percentual exato;
- botões **−**, **+** e o botão percentual/reset são considerados escolha manual e sincronizam a conta;
- **Ajustar largura** continua dinâmico para o viewport atual e **não altera** o percentual salvo;
- gravações rápidas são serializadas para impedir que uma resposta antiga sobrescreva a última escolha;
- falha de sincronização não impede o zoom da sessão; o Portal informa que a preferência não pôde ser salva;
- a preferência é carregada junto das preferências documentais já aquecidas no login, antes da listagem ficar disponível.

Privacidade e escopo:
- não usar `localStorage`, `sessionStorage` ou IndexedDB para essa preferência;
- não persistir nome do arquivo, ID do Drive, página ativa ou qualquer dado clínico;
- preferência é isolada por username no backend;
- zoom do editor continua preservando o estado visual vivo durante rebuilds, sem criar gravações adicionais;
- nenhuma mudança em Google Drive, Gemini, OCR, permissões ou telemetria.

Critérios de aceite:
1. conta sem preferência abre com o fallback histórico de 114%;
2. usuário altera manualmente para, por exemplo, 144%;
3. fecha e abre outro PDF: inicia em 144%;
4. recarrega/loga novamente: continua em 144%;
5. outra conta permanece com sua própria escolha/default;
6. “Ajustar largura” não muda o valor persistido;
7. valores fora de 45%–300% falham fechado no backend.

**Próxima ação exata:** executar CI da branch, integrar somente com checks verdes e validar o fluxo real com duas contas.


## Fase 7E — preferência de zoom por conta integrada à main — 23/09/2026

A PR **#424 — Fase 7E: lembrar zoom do Titon por conta** foi integrada à `main` no merge **`a83d4b61f0e6af9d1813bb114fc40941a96eeacd`**.

Resultado versionado:
- nova tabela técnica D1 `auth_document_viewer_preferences`, indexada por `username`;
- guarda somente `zoom_scale`, limitado a 45%–300%;
- conta sem escolha gravada continua usando o comportamento histórico do viewer: fallback 114%, com ajuste de segurança à largura disponível;
- após uma escolha manual, os próximos PDFs recebem esse percentual como `initialViewState`;
- botões **−**, **+** e reset percentual gravam a preferência;
- **Ajustar largura** permanece temporário/dinâmico e não altera a preferência percentual;
- writes são serializados para que cliques rápidos não deixem uma gravação antiga vencer a escolha mais nova;
- reload/nova sessão recupera a preferência pelo endpoint autenticado `/api/documents/preferences`;
- preload existente da Central já traz a preferência antes da navegação ficar pronta;
- nenhuma preferência de zoom é armazenada em `localStorage`, `sessionStorage` ou IndexedDB;
- cache-buster do cliente avançou para **`documents.js?v=20260923-3`**.

Validação do head funcional `9bb05a994609ee163f573d30fc91e9757ba22bfe`:
- **23/23 workflows GitHub Actions: success**;
- Central de Documentos — Fases 1–6: **success**;
- navegador/PDF.js real em Chromium: **success**;
- bundle de staging: **success**;
- site e governança: **success**;
- demais workflows disparados para o head: **success**.

Testes adicionados:
- ausência de preferência não cria gravação implícita e preserva fallback do viewer;
- gravação/releitura do percentual;
- isolamento entre usernames;
- rejeição backend de escala fora de 45%–300%;
- aplicação da preferência no próximo PDF;
- `Ajustar largura` não chama persistência;
- frontend não usa armazenamento local do navegador para esta escolha.

Limite da evidência atual:
- código e CI estão concluídos;
- o conector GitHub desta sessão não comprova por si só o Workers Build de push pós-merge;
- a homologação final exige um teste real após o deploy de produção.

**Próxima ação exata:** Ctrl+F5 na Central; selecionar um percentual manual reconhecível (por exemplo 144%), abrir outro PDF e confirmar que ele inicia no mesmo percentual. Recarregar a página e repetir para provar persistência da conta.


## Fase 7E — Central abre diretamente na superfície de documentos — 23/09/2026

Pedido operacional: remover da entrada da Central o conteúdo introdutório que ocupava grande parte da primeira dobra e exigia rolagem antes da lista de arquivos.

Escopo aprovado:
- remover o hero com `Central de Documentos`, `Google Drive institucional dentro do Portal` e o parágrafo explicativo;
- remover o cabeçalho/card textual `Configuração institucional` e a nota visual de estado da conexão;
- manter somente os controles realmente necessários para administração:
  - **Conectar Google Drive** quando aplicável;
  - **Desconectar Drive** quando conectado;
  - **Gerenciar cargos e acessos** para administrador;
- esses controles ficam em uma faixa compacta sem card, título ou texto explicativo;
- status de conexão e mensagem institucional continuam no DOM como conteúdo somente para acessibilidade, sem ocupar a tela;
- erros/avisos operacionais reais continuam podendo aparecer em `documentsGlobalStatus`;
- workspace passa a ter margem superior zero e o `main` reduz o afastamento do cabeçalho;
- mobile mantém os botões administrativos responsivos, sem restaurar o bloco introdutório;
- cache-busters: `documents.css?v=20260923-1` e `documents.js?v=20260923-4`.

Decisão de arquitetura: os botões de conexão não foram movidos para dentro do browser/lista. Quando o Drive está desconectado, o workspace é corretamente bloqueado; se o botão `Conectar` estivesse dentro dele, o administrador poderia perder o caminho de reconexão. A faixa externa compacta preserva esse caminho sem sacrificar a primeira dobra.

Critérios de aceite:
1. não existe hero ou card textual introdutório em `/documentos/`;
2. busca/lista é a primeira superfície operacional principal;
3. administrador conectado vê somente **Gerenciar cargos e acessos** + **Desconectar Drive** acima da lista;
4. administrador desconectado e configurado continua podendo usar **Conectar Google Drive**;
5. usuário comum não recebe faixa administrativa vazia;
6. avisos reais de erro permanecem visíveis;
7. desktop e mobile continuam responsivos.

**Próxima ação exata:** validar CI, integrar somente se verde e confirmar em produção que a primeira dobra mostra imediatamente a pesquisa/lista de documentos.


## Fase 7E — entrada da Central simplificada e integrada — 23/09/2026

A PR **#426 — Fase 7E: abrir Central diretamente nos documentos** foi integrada à `main` no merge **`1f5c2ffc29102d3dcbecd068540b0d14b095ea1b`**.

Resultado versionado:
- removido o hero “Google Drive institucional dentro do Portal” e seu texto explicativo;
- removido o card visual “Configuração institucional” e a mensagem textual da conexão;
- permanecem visíveis somente as ações administrativas essenciais, conforme capability/estado:
  - **Conectar Google Drive**;
  - **Desconectar Drive**;
  - **Gerenciar cargos e acessos**;
- o estado técnico do Drive e a mensagem de configuração continuam no DOM apenas como conteúdo acessível `sr-only`/aria-live, sem ocupar espaço visual;
- erros e bloqueios reais continuam aparecendo em `documentsGlobalStatus`;
- o workspace perdeu a margem introdutória e passa a começar imediatamente abaixo da faixa administrativa compacta;
- para contas sem capability de gestão, a faixa administrativa fica totalmente oculta e a pesquisa/lista aparece diretamente após o cabeçalho do Portal.

Validação do head funcional `e50a177a06fe14bc2ff48315754f03cf0cc3d4b6`:
- **23/23 workflows GitHub Actions: success**;
- Central de Documentos — Fases 1–6: **success**;
- navegador/PDF.js real em Chromium: **success**;
- bundle de staging: **success**;
- site e governança: **success**;
- demais workflows disparados para o head: **success**.

Critério de aceite operacional restante:
- em produção, após Ctrl+F5, a primeira dobra deve mostrar pesquisa/pastas/documentos sem exigir rolagem para atravessar textos institucionais;
- administradores devem ver somente a pequena faixa de controles indispensáveis;
- usuários comuns devem ir direto ao acervo.

**Próxima ação exata:** validar visualmente a Central em produção após Ctrl+F5. Se a lista estiver imediatamente acessível, registrar homologação desta unidade da 7E.

## Fase 7E — remoção das pastas prioritárias e preload raiz-only — 23/09/2026

Decisão humana atual: **não carregar antecipadamente Consulta [2026] nem Exames [2026] e não pré-baixar PDFs dessas pastas**.

Diagnóstico que antecedeu a mudança:
- o preload pós-login primeiro obtinha acesso, preferências, configuração da IA e raiz;
- depois ainda descobria/listava Consulta [2026] e Exames [2026];
- cada pasta fazia primeira página de 20 e prefetch adicional em até 6 páginas de 100 itens;
- o cliente da Central esperava só 1,4 s pelo snapshot; se o Service Worker ainda estivesse nesse trabalho, podia abandonar o warmup e iniciar nova leitura da raiz;
- esse desenho aumentava trabalho de rede/CPU e atrasava o objetivo principal: mostrar os documentos da raiz rapidamente.

Implementação nesta branch:
- removidos nomes e constantes de pastas prioritárias do Service Worker;
- removida descoberta/busca/listagem especial dessas pastas;
- removido `priorityFolders` do snapshot;
- removido pré-download automático de PDFs e carregamento antecipado de `PortalDocumentCache` para esse fim;
- warmup privado mantém somente access, preferences, aiConfig (quando permitido) e raiz com 20 itens;
- snapshot da raiz é publicado assim que a raiz fica pronta, sem esperar obrigatoriamente todos os metadados secundários;
- `getDocumentsWarmPayload()` devolve snapshot já disponível antes de aguardar a operação em andamento;
- Central passa a aguardar o warmup por até 6 s em vez de 1,4 s, buscando reutilizar a requisição iniciada no login em vez de duplicá-la;
- navegação normal de qualquer pasta continua com lotes de 20;
- fallback direto continua intacto.

Segurança/privacidade preservadas:
- snapshot continua só em RAM do Service Worker, TTL 90 s;
- permissão atual continua sendo consultada ao vivo antes de exibir a raiz aquecida;
- token bruto não é persistido;
- nenhum conteúdo documental ou identificador entra na observabilidade;
- cache criptografado de PDFs permanece para uso normal, apenas sem prefetch por pasta.

Critério de aceite desta unidade: CI verde; ausência de runtime especial por nome; abertura da Central reutiliza raiz aquecida quando pronta; nenhuma requisição automática de conteúdo PDF por Consulta/Exames; fallback normal preservado.

**Próxima ação exata:** executar CI e integrar somente se todos os checks críticos permanecerem verdes; após deploy, validar em produção e medir `drive_folder_opened` hit/miss.

## Fase 7E — preload raiz-only integrado à main — 23/09/2026

A PR **#428 — Fase 7E: simplificar preload da Central para somente a raiz** foi integrada à `main` no merge **`1a2a1e3da617abfb4bce02f7bf0f221c9a214a97`**.

Resultado final versionado:
- removidas as constantes e rotinas `DOCUMENTS_PRIORITY_*`;
- removida qualquer descoberta/listagem especial de Consulta [2026] ou Exames [2026];
- removido `priorityFolders` do snapshot privado;
- removido pré-download automático de PDFs dessas pastas;
- removido carregamento antecipado de `PortalDocumentCache` exclusivamente para esse prefetch;
- preload pós-login mantém access, preferences, aiConfig quando permitido e **20 itens da raiz**;
- a raiz pode ser publicada em RAM assim que estiver pronta, antes de tarefas secundárias terminarem;
- `getDocumentsWarmPayload()` devolve snapshot já publicado antes de esperar operação em andamento;
- timeout de obtenção do warmup na Central passou de **1,4 s para 6 s**;
- `documents.js` não contém mais `warmedPriorityFolder`, `applyWarmedFolderSnapshot` nem listener `portal:documents-warm-updated`;
- qualquer pasta, inclusive Consulta [2026] e Exames [2026], volta ao fluxo normal de listagem de 20 itens;
- cache criptografado de PDFs permanece disponível no uso normal, sem prioridade por pasta.

Validação do head final `a0b461f0e9fc588ea3116f32b0924eb146ff56a8`:
- **50/50 workflows GitHub Actions: success**;
- Central de Documentos — Fases 1–6: **success**;
- Central de Documentos — navegador/PDF.js real: **success**;
- abertura pós-login — navegador: **success**;
- bundle de staging: **success**;
- site/governança e regressões do restante do Portal: **success**.

Durante a validação foram reconciliados cache-busters globais de `portal-performance.js` para `v=20260923-1` e a versão do Service Worker para `CACHE_VERSION=20260923-1`, garantindo que o cliente novo seja carregado nas entradas do Portal.

Limite da evidência atual:
- código e CI estão concluídos e integrados;
- o conector GitHub usado nesta sessão não expõe prova suficiente do Workers Build de push pós-merge;
- a melhora de latência não deve ser declarada numericamente antes de tráfego real pós-publicação.

**Próxima ação exata:** Ctrl+F5 na Central, observar a abertura da raiz e depois revisar a nova amostra de `drive_folder_opened` por `cache_state` e tempos internos.

## Fase 7E — falso negativo em LAUDO MÉDICO PARA PROCEDIMENTO DE ALTA COMPLEXIDADE — 23/09/2026

Incidente real: o Titon extraiu corretamente a página de comprovante, mas informou que não havia página médica autorizada em um PDF de duas páginas cuja primeira folha é um formulário institucional intitulado **LAUDO MÉDICO PARA PROCEDIMENTO DE ALTA COMPLEXIDADE**.

Diagnóstico:
- a página 1 possui título médico principal explícito;
- a mesma folha contém identificação do paciente, procedimento solicitado, descrição do diagnóstico, CID, resumo da anamnese/exame físico, justificativa do procedimento, profissional solicitante, assinatura/carimbo e blocos de autorização;
- `PROMPT_ANALISE_REGULACAO_V1` v3 aceitava `LAUDO MÉDICO` e `LAUDO PARA SOLICITAÇÃO/AUTORIZAÇÃO DE PROCEDIMENTO AMBULATORIAL`, mas não o título de alta complexidade;
- como a política é deliberadamente fail-closed por allowlist de cabeçalho, o Gemini classificou a página como `outro` em vez de `pagina_medica_autorizada`.

Causa confirmada: **lacuna de governança na allowlist de títulos**, não falha de visão do Gemini.

Correção na branch `fix/titon-high-complexity-medical-page-20260923`:
- adiciona `LAUDO MÉDICO PARA PROCEDIMENTO DE ALTA COMPLEXIDADE` às listas médicas de classificação e análise integrada;
- reforça que esse formulário permanece médico mesmo contendo identificação, procedimento, diagnóstico/CID, anamnese, justificativa e autorização na mesma folha;
- mantém a precedência do título principal sobre seções internas;
- mantém `DADOS` restrito ao título principal de comprovante, evitando falso positivo cadastral;
- versões de classificação/análise/compacto sobem de v3 para **v4**;
- prompt compacto do provider legado recebe a mesma categoria, apenas para coerência/rollback;
- Fase 5 e matriz de homologação 5E são atualizadas;
- testes verificam que a regra chega ao `systemInstruction` real do Gemini.

Alternativas descartadas:
- considerar qualquer página com CID, médico ou procedimento como médica: aumentaria falsos positivos e quebraria a política restritiva;
- usar o nome do arquivo como sinal: filename não deve governar classificação clínica/documental;
- inferência extra apenas para decidir o tipo: custo/latência sem necessidade diante de título explícito.

Critério de aceite: uma folha com o cabeçalho `LAUDO MÉDICO PARA PROCEDIMENTO DE ALTA COMPLEXIDADE` deve ser `pagina_medica_autorizada`; o comprovante da outra página continua sendo `comprovante_atendimento`; campos seguem isolados por página e valores ausentes/ilegíveis continuam `nao_consta`/`ilegivel`.

**Próxima ação exata:** CI → merge/publicação → Ctrl+F5 → reprocessar o PDF do mesmo tipo e confirmar o bloco médico.


## Fase 7E — laudo médico de alta complexidade integrado — 23/09/2026

A PR **#430 — Fase 7E: reconhecer laudo médico de alta complexidade** foi integrada à `main` no merge **`6bd6da462d99d56f5f89b24e871bd5872f980b8f`**.

Resultado:
- `LAUDO MÉDICO PARA PROCEDIMENTO DE ALTA COMPLEXIDADE` é explicitamente `pagina_medica_autorizada`;
- classificação/análise/compacto sobem para **v4**;
- o Gemini recebe a nova regra no `systemInstruction`;
- o provider legado recebe a mesma categoria apenas para coerência de rollback;
- páginas com identificação, procedimento, diagnóstico/CID, anamnese, justificativa e autorização continuam médicas quando esse for o título principal;
- o comprovante da segunda folha continua independente como `comprovante_atendimento`;
- isolamento por página, literalidade, `nao_consta` e `ilegivel` permanecem.

Validação do head funcional `dec37efd73375ae2d3f37296e7d7aeb705e3ff3c`:
- **21/21 workflows GitHub Actions: success**;
- Central de Documentos — Fases 1–6: success;
- site e governança: success;
- testes confirmam o novo título no prompt e no systemInstruction real do Gemini.

**Próxima ação exata:** retestar em produção o PDF do mesmo tipo após Ctrl+F5. Só então registrar homologação real.


## Fase 7E — Salvar PDF e Imprimir disponíveis fora da edição — 23/09/2026

Pedido operacional: as ações **Salvar PDF** e **Imprimir**, antes disponíveis apenas dentro do editor, devem permanecer acessíveis durante a visualização normal do Titon e ficar imediatamente à direita de **Ajustar largura**.

Implementação:
- novos controles `pdfSaveButton` e `pdfPrintButton` na barra principal do PDF;
- reutilização dos assets oficiais `salvar-pdf.svg` e `imprimir-normal.svg`;
- **Salvar PDF** obtém o PDF atual pelo cache criptografado existente ou pela leitura autorizada do Drive e baixa uma cópia local com o nome do documento, sem sufixo `-editado`;
- **Imprimir** obtém o PDF atual e usa o mesmo pipeline PDF.js + iframe oculto já aprovado no editor, sem abrir nova aba;
- nenhuma dessas ações escreve no Google Drive;
- durante edição, os dois controles da barra de visualização ficam ocultos para não duplicar os botões do editor;
- ao sair do editor, eles reaparecem automaticamente;
- ações obsoletas são invalidadas ao trocar/fechar o PDF para evitar download/impressão do documento anterior;
- a barra do PDF passa a aceitar rolagem horizontal em larguras pequenas, preservando os controles sem quebrar layout.

Critérios de aceite:
1. fora da edição, a ordem visual é: zoom −, percentual, zoom +, Ajustar largura, Salvar PDF, Imprimir;
2. Salvar PDF baixa apenas localmente e não chama sync/replace/save-copy;
3. Imprimir usa o mesmo caminho PDF.js sem `window.open`;
4. dentro do editor, os novos controles externos ficam ocultos;
5. ao sair da edição, voltam a aparecer;
6. CI e navegador permanecem verdes.

**Próxima ação:** validar PR/CI, integrar se verde e homologar visualmente em produção.


## Fase 7E — Salvar PDF e Imprimir integrados ao visualizador — 23/09/2026

A PR **#432 — Fase 7E: mostrar Salvar PDF e Imprimir no visualizador** foi integrada à `main` no merge **`e29fe0b8c5c5790e56ad61aa38295ebf0f0269ff`**.

Resultado versionado:
- novos botões **Salvar PDF** e **Imprimir** na barra principal, imediatamente após **Ajustar largura**;
- mesmos assets visuais aprovados do editor;
- Salvar PDF baixa o documento atual localmente com seu nome-base, sem sufixo de edição;
- Imprimir usa PDF.js e iframe oculto, sem `window.open` e sem abrir nova aba;
- nenhuma dessas ações chama `drive/sync`, `replace_pdf`, `save_copy` ou qualquer escrita no Google Drive;
- quando o editor é ativado, os controles externos são ocultados e os controles próprios do editor permanecem;
- ao sair do editor, Salvar/Imprimir reaparecem;
- troca/fechamento de PDF invalida ações locais antigas;
- barra principal ganhou overflow horizontal seguro para telas estreitas;
- cache-busters: `documents.css?v=20260923-2` e `documents.js?v=20260923-6`.

Validação do head funcional `f13356deefc89ecf3ad59af95c7e223fcdb436a4`:
- **23/23 workflows GitHub Actions: success**;
- Central de Documentos — Fases 1–6: success;
- Central de Documentos — navegador/PDF.js real: success;
- bundle/site/governança: success;
- regressão específica confirma posição, download local, impressão PDF.js e ausência de escrita no Drive.

**Próxima ação exata:** homologar visualmente em produção após Ctrl+F5.


## Fase 7E — pesquisa de conteúdo via fullText da Drive API — 23/09/2026

Diagnóstico do código atual: `searchDrive()` usava exclusivamente `name contains '<consulta>'`, portanto a Central não tinha como aproveitar o mesmo índice textual que o Google Drive usa para encontrar conteúdo interno.

Mudança preparada:
- uma única chamada `files.list` passa a usar `trashed = false and (name contains ... or fullText contains ...)`;
- para múltiplas palavras, o conteúdo exige todos os termos (`and`) para reduzir resultados irrelevantes;
- consulta inteira entre aspas é tratada como frase exata no `fullText`;
- nome continua no `or`, preservando o comportamento existente;
- paginação continua em 20;
- `corpora=user`, `spaces=drive`, suporte a drives compartilhados e referências opacas permanecem;
- UI passa a mostrar “Pesquisar por nome ou conteúdo no Drive”.

Não há nova dependência externa: **Google Drive API v3 já fornece `fullText`**. Drive Activity API, Drive Labels API, Drive MCP e Workspace Marketplace SDK continuam sem relação direta com esta necessidade.

Privacidade: a consulta já era enviada ao Google Drive para pesquisa por nome; agora é usada também pelo índice textual do próprio Drive. O Portal não baixa todos os PDFs, não grava índice local e não envia a consulta ao Gemini/PostHog.

**Próxima ação exata:** validar CI e publicar; depois testar em produção com um termo existente somente dentro de um PDF.


## Fase 7E — pesquisa fullText integrada à main — 23/09/2026

A PR **#434 — Fase 7E: pesquisar nome e conteúdo indexado do Google Drive** foi integrada à `main` no merge **`92c1650286b444161eea6520a92eee744234358b`**.

Resultado:
- `searchDrive()` deixou de usar apenas `name contains`;
- a consulta passa a combinar nome e conteúdo indexado pelo Google Drive em uma única chamada `files.list`;
- conteúdo usa `fullText contains`, sem baixar o arquivo;
- consultas comuns com várias palavras geram cláusulas `fullText` unidas por `and`;
- consultas inteiras entre aspas duplas são tratadas como frase exata;
- paginação continua em 20 resultados;
- UI informa “Pesquisar por nome ou conteúdo no Drive”;
- referências opacas, `corpora=user`, suporte a Drive compartilhado e observabilidade sanitizada permanecem.

Validação do head funcional `71aab8fde2043ec1e6d032aeff2113687746bfc1`:
- **23/23 workflows GitHub Actions: success**;
- Central Fases 1–6: success;
- navegador/PDF.js real: success;
- bundle/site/governança: success;
- testes confirmam busca multi-termo, frase exata e ausência de fileId bruto na resposta.

Revisão da decisão antiga sobre APIs Google:
- **Drive Activity API** continua útil apenas para histórico/auditoria futura;
- **Drive Labels API** continua opcional para metadados estruturados;
- **Drive MCP** e **Workspace Marketplace SDK** não são necessários para a pesquisa textual da Central;
- para esta necessidade específica, a decisão de não ativar APIs adicionais continua correta porque a **Drive API v3 já expõe o índice `fullText`**.

**Próxima ação exata:** retestar em produção com conteúdo que não aparece no nome do arquivo e registrar homologação.


## Fase 7E — filtro Só título preparado — 23/09/2026

Pedido operacional: manter a pesquisa ampla por nome + conteúdo como padrão, mas oferecer um filtro visual **Só título**, equivalente ao usado no Google Drive, para restringir a consulta apenas ao nome do arquivo.

Implementação na branch `feat/titon-search-title-only-20260923`:
- filtro checkbox/pílula abaixo da barra de pesquisa;
- estado inicial `searchTitleOnly=false`;
- cliente envia `titleOnly` no mesmo endpoint `/api/documents/drive/search`;
- router sanitiza com `body.titleOnly === true`;
- Worker usa `fullText` apenas quando `titleOnly` é falso;
- marcado, a query fica somente `trashed = false and name contains ...`;
- alternar o filtro com busca ativa refaz imediatamente a mesma consulta;
- refresh e paginação preservam o modo;
- cache-busters avançam para `documents.css?v=20260923-3` e `documents.js?v=20260923-7`.

Privacidade e segurança preservadas: nenhuma persistência do filtro, nenhum termo em telemetria, nenhuma mudança em OAuth, Drive write, Gemini ou OCR.

**Próxima ação exata:** CI e integração; depois validar a mesma palavra em modo amplo e em Só título.


## Fase 7E — filtro Só título integrado à main — 23/09/2026

A PR **#436 — Fase 7E: adicionar filtro Só título à pesquisa do Drive** foi integrada à `main` no merge **`5a557ed5056eb06fe48986d8fc4a098aee7061e4`**.

Resultado versionado:
- filtro **Só título** logo abaixo da barra de pesquisa;
- desmarcado por padrão;
- modo padrão continua `name contains OR fullText contains`;
- marcado, o Worker elimina `fullText` e envia somente `name contains`;
- alternar o filtro durante uma busca ativa refaz a mesma consulta imediatamente;
- botão Atualizar pasta e paginação mantêm o modo escolhido;
- backend aceita somente `titleOnly === true`, evitando valores ambíguos;
- nenhuma preferência de conta foi criada;
- cache-busters: `documents.css?v=20260923-3` e `documents.js?v=20260923-7`.

Validação do head funcional `f9ae471b936f5e9cd6feb32ead071298b536ee1b`:
- **23/23 workflows GitHub Actions: success**;
- Central de Documentos — Fases 1–6: success;
- Central de Documentos — navegador/PDF.js real: success;
- bundle/site/governança: success;
- testes confirmam que `titleOnly=true` gera query sem `fullText contains`, enquanto o padrão preserva pesquisa de conteúdo.

**Próxima ação exata:** homologar em produção comparando a mesma pesquisa com Só título desligado e ligado.


## Fase 7E — pesquisa avançada preparada — 23/09/2026

A branch `feat/titon-advanced-drive-search-20260923` amplia a pesquisa já integrada (nome + conteúdo + Só título) com um modal inspirado na Pesquisa avançada do Google Drive.

Controles implementados: Tipo, Proprietário, Com as palavras, Nome do item, Local, Com estrela, Na lixeira, Data da modificação e Compartilhado com.

O backend usa exclusivamente campos estruturados e monta `q` no Worker. A pasta atual é enviada ao servidor como referência opaca; o ID Google só é recuperado dentro do Worker. E-mails e datas são validados antes da chamada externa.

Não implementados deliberadamente nesta unidade:
- `Criptografado`: ausente dos termos de consulta oficiais de arquivos;
- aprovações/assinaturas eletrônicas: `approvals.list` existe, mas é por fileId e não um filtro de `files.list`; aplicar após a busca criaria fan-out de chamadas e latência elevada;
- picker “Mais locais...”: substituído por Pasta atual, evitando navegar/baixar uma árvore inteira apenas para escolher o local.

Cache-busters planejados: `documents.css?v=20260923-4` e `documents.js?v=20260923-8`.

**Próxima ação exata:** abrir PR e executar a matriz CI completa antes de integrar.


## Fase 7E — Pesquisa avançada integrada à main — 23/09/2026

A PR **#438 — Fase 7E: adicionar Pesquisa avançada à Central** foi integrada à `main` no merge **`8bfc671419f709831e1c550b0ce77a7118804475`**.

Resultado versionado:
- botão **Pesquisa avançada** ao lado de **Só título**;
- modal responsivo e acessível;
- filtros de Tipo, Proprietário, Com as palavras, Nome do item, Local, Com estrela, Na lixeira, Data da modificação e Compartilhado com;
- Local oferece Em qualquer lugar, Pasta atual e Compartilhados comigo;
- períodos: hoje, 7/30/90 dias, este ano e personalizado;
- busca pode rodar sem texto quando existir filtro real;
- modo normal, Só título e filtros avançados podem ser combinados;
- refresh/paginação preservam filtros da pesquisa ativa;
- sair da pesquisa para uma pasta limpa filtros avançados para evitar restrições invisíveis;
- query Google é montada exclusivamente no Worker a partir de campos estruturados;
- refs de pasta continuam opacas no navegador;
- cache-busters: `documents.css?v=20260923-4` e `documents.js?v=20260923-8`.

Filtros do Drive web não copiados de forma enganosa:
- Criptografado: não há termo equivalente em `files.list q`;
- Aprovações/assinaturas: recurso `approvals` é consultado por arquivo e não funciona como termo direto de `files.list`;
- Mais locais: nesta unidade foi substituído por Pasta atual, sem picker recursivo.

Validação do head funcional `d21f307a6b50b5516dd1e6f3a4253f5b34b08f4c`:
- **23/23 workflows GitHub Actions: success**;
- Central Fases 1–6: success;
- navegador/PDF.js real: success;
- bundle/site/governança: success;
- testes de backend cobrem filtro de pasta opaca, tipo PDF, proprietário, fullText, nome, estrela, lixeira, período, compartilhamento e e-mail inválido.

**Próxima ação exata:** homologar em produção após Ctrl+F5 e registrar qualquer diferença de comportamento em relação ao Drive web.


## Mudança transversal — ícones próprios da Agenda e Central de Documentos — 23/09/2026

Pedido operacional: substituir os SVGs genéricos usados nos cards **Agenda** e **Central de Documentos** pelos PNGs próprios já adicionados pelo operador em `assets/AGENDA.png` e `assets/CENTRAL_DOCUMENTOS.png`.

Estado de origem confirmado na `main`: os dois assets foram adicionados diretamente pelo operador no commit `70c41db804a63bf101e29358ecb540cbd6ba6bf7`. Esta mudança não altera a Fase 7E nem reabre escopo funcional da Central; é um refinamento visual transversal do catálogo compartilhado de ferramentas.

Implementação na branch `feat/tool-card-custom-icons-20260923`:
- card **Agenda** passa a usar `/assets/AGENDA.png?v=20260923-1`;
- card **Central de Documentos** passa a usar `/assets/CENTRAL_DOCUMENTOS.png?v=20260923-1`;
- os SVGs genéricos `calendar` e `documents` deixam de ser usados no catálogo;
- Home e página Ferramentas recebem novo cache-buster de `tools-catalog.js`;
- o Service Worker passa a referenciar a mesma versão nova do catálogo, sem pré-carregar os PNGs para perfis que não exibem esses cards;
- teste de regressão verifica os dois assets versionados.

Segurança/privacidade: somente apresentação visual. Sem mudança em permissões, autenticação, Drive, Agenda, IA, dados clínicos, PostHog ou APIs.

**Próxima ação exata:** abrir PR, executar CI; integrar somente se os checks permanecerem verdes e então homologar visualmente os dois cards na Home/Ferramentas.


## Mudança transversal — ícones próprios publicados — 23/09/2026

A PR **#440 — UI: usar ícones próprios na Agenda e Central de Documentos** foi integrada à `main` no merge **`985a109bb416546f4e7b2764dc40356f55e9e0db`**.

Resultado final:
- **Agenda** usa `/assets/AGENDA.png?v=20260923-1`;
- **Central de Documentos** usa `/assets/CENTRAL_DOCUMENTOS.png?v=20260923-1`;
- Home e Ferramentas carregam `tools-catalog.js?v=20260923-1`;
- Service Worker foi alinhado à mesma versão do catálogo;
- os SVGs genéricos `calendar` e `documents` deixaram de ser usados nesses cards;
- os PNGs continuam lazy-loaded, evitando pré-download global dos dois arquivos de aproximadamente 1,6 MB cada.

Validação:
- primeira rodada de CI no head `13cfeff5` revelou somente uma asserção histórica de teste que ainda exigia `tools-catalog.js?v=20260916-1`;
- a expectativa foi reconciliada em `ff03bdb098e0d18c900b307668a8306c56950d54`;
- rodada final: **26/26 workflows GitHub Actions success**, zero falhas;
- mudança não altera autenticação, permissões, Drive, Agenda, IA, APIs ou observabilidade.

**Próxima ação exata:** Ctrl+F5 em Home/Ferramentas e confirmar visualmente os dois novos ícones em produção.


## Fase 7E — ordenação cronológica da lista e pesquisa — 23/09/2026

Pedido operacional: adicionar na barra da Central um controle para alternar a ordem pela data de modificação entre **mais recentes → mais antigos** e **mais antigos → mais recentes**, com um botão separado para **Redefinir ordem** e voltar ao comportamento histórico.

Diagnóstico do estado anterior:
- a navegação de pasta usava a ordem histórica `folder,name_natural`;
- a pesquisa não enviava `orderBy` à Drive API e o cliente reorganizava os itens carregados por pasta/nome;
- ordenar apenas os 20 itens já carregados no navegador seria incorreto com paginação, pois não garantiria que os itens realmente mais recentes/antigos do resultado completo fossem trazidos primeiro.

Implementação na branch `feat/titon-chronological-order-20260923`:
- adiciona **Ordem cronológica** e **Redefinir ordem** ao lado dos filtros de pesquisa;
- primeiro clique ativa `modified_desc` (**Mais recentes ↓**);
- novo clique alterna para `modified_asc` (**Mais antigos ↑**) e vice-versa;
- **Redefinir ordem** restaura `original`;
- a escolha vale tanto para a pasta atual quanto para resultados de pesquisa, inclusive Pesquisa avançada e paginação;
- o Worker recebe apenas um enum controlado (`original`, `modified_desc`, `modified_asc`) e converte internamente para `orderBy` oficial da Drive API;
- `original` preserva exatamente o comportamento anterior: pasta em `folder,name_natural` e pesquisa sem `orderBy`;
- a ordenação cronológica usa `modifiedTime desc,name_natural` ou `modifiedTime,name_natural`;
- snapshots de pasta/raiz aquecida só são reaproveitados para a ordem original, evitando exibir 20 itens de uma página alfabética como se fossem o topo cronológico global;
- nenhuma preferência é persistida na conta: ao recarregar a página, a Central começa novamente na ordem original;
- nenhum valor de ordenação ou conteúdo documental é adicionado ao PostHog.

Decisão técnica: a ordenação é aplicada também no backend antes da paginação, e o cliente apenas mantém a mesma ordem nos itens já recebidos. Foi descartada a opção de ordenar somente no navegador porque produziria resultados cronológicos incompletos quando houver mais de 20 itens.

Cache-busters planejados: `documents.css?v=20260923-5` e `documents.js?v=20260923-9`.

**Próxima ação exata:** abrir PR, executar CI completo e integrar somente se todos os checks críticos permanecerem verdes; depois homologar em produção com uma pesquisa conhecida e comparar os dois sentidos cronológicos + Redefinir ordem.


## Fase 7E — ordenação cronológica integrada à main — 23/09/2026

A PR **#442 — Fase 7E: adicionar ordem cronológica à Central** foi integrada à `main` no merge **`5921b97b2d3f07d6e7416850decd5da2afe85b90`**.

Resultado versionado:
- novo botão **Ordem cronológica** ao lado de Só título/Pesquisa avançada;
- primeiro clique ativa **Mais recentes ↓** (`modified_desc`);
- clique seguinte alterna para **Mais antigos ↑** (`modified_asc`) e vice-versa;
- botão separado **Redefinir ordem** volta ao comportamento `original`;
- funciona em pasta normal, pesquisa por nome/conteúdo, Só título, Pesquisa avançada e **Carregar mais**;
- a Drive API recebe o `orderBy` antes da paginação, portanto a ordem vale para o conjunto global e não apenas para os 20 itens já carregados;
- modo original preserva `folder,name_natural` em pastas e ausência de `orderBy` em pesquisa;
- backend aceita somente o enum allowlisted `original|modified_desc|modified_asc`;
- snapshots aquecidos continuam exclusivos da ordem original;
- ordenação não é persistida na conta e nenhuma nova propriedade é enviada à observabilidade;
- cache-busters finais: `documents.css?v=20260923-5` e `documents.js?v=20260923-9`.

Validação da PR:
- primeira execução: **22/23 workflows verdes**; somente o workflow de navegador falhou em um teste móvel antigo do editor (redo por teclado), sem relação com a lista/ordenação;
- o mesmo job foi reexecutado **sem alteração de código** e passou integralmente, confirmando falha intermitente do teste;
- estado final da PR: **23/23 workflows GitHub Actions success**, zero falhas.

Validação pós-merge do commit `5921b97b`:
- **23/23 runs concluídos com success**;
- Fases 1–6: success;
- Central de Documentos — navegador: success;
- site/governança/bundle: success;
- **pages build and deployment: success**.

**Próxima ação exata:** homologar visualmente em produção após Ctrl+F5: pesquisar um conjunto conhecido, ativar Mais recentes ↓, inverter para Mais antigos ↑, usar Redefinir ordem e confirmar que o comportamento original retorna.


## Mudança transversal — infraestrutura global de modo claro/escuro preparada — 23/09/2026

Pedido operacional: preparar o Portal inteiro para alternar entre **Modo claro** (aparência atual) e **Modo escuro**, com o controle central em **Configurações**.

Diagnóstico e decisão arquitetural:
- o Portal já possuía uma camada global de preferências em `PortalInteractions`, usada para sons e sincronizada por `/api/auth/security`;
- vários módulos possuem CSS próprio e cores claras hardcoded; duplicar um tema dentro de cada módulo aumentaria risco de divergência;
- a Telemedicina neutraliza deliberadamente `PortalInteractions` para impedir animações/sons, então aparência não poderia depender exclusivamente dessa camada.

Implementação preparada na branch `feat/portal-light-dark-theme-20260923`:
- novo `js/portal-theme.js`, bootstrap visual independente e self-hosted, carregado no `<head>` das rotas ativas para aplicar a última aparência antes da pintura;
- `PortalInteractions` sobe para V1.1 e passa a controlar/sincronizar a preferência `theme`;
- novo card **Aparência** em `/configuracoes/`, com **Modo claro** e **Modo escuro**;
- preferência autenticada `interfaceTheme`, persistida em `auth_users.interface_theme`, com default `light` e allowlist estrita `light|dark`;
- cache autenticado de `auth-client.js` passa a carregar `interfaceTheme`;
- mudanças em outra aba são refletidas por `storage`;
- `css/portal-interactions.css` recebe a camada escura global com `html[data-portal-theme="dark"]`, cobrindo shell, navegação, cards, formulários, tabelas, modais, chat e módulos específicos;
- Telemedicina recebe o tema pelo bootstrap independente, sem reativar suas microinterações;
- Agenda e sua ponte de sincronização passam a carregar o bootstrap/CSS global, sem adicionar observabilidade clínica;
- páginas de PDF e impressão permanecem claras deliberadamente;
- Service Worker inclui o bootstrap de tema entre os recursos centrais;
- homologação da Central passa a copiar `portal-theme.js`;
- cache-busters planejados: `portal-theme.js?v=20260923-1`, `portal-interactions.css?v=20260923-1` e `portal-interactions.js?v=20260923-2`.

Rotas visuais ativas preparadas: Home, Ferramentas, Perfil, Amigos, Notificações, Login, Cadastro, Guia Médico, Protocolos, Recepção, Telemedicina, Agenda, ponte da Agenda, Canal do Cidadão, Conselho público/painel, Segurança, Configurações, Conquistas, Usuários, Monitoramento, Configuração técnica, Moderação social e Central de Documentos. `/home/`, `/conta/` e `/protocolo.html` permanecem redirecionamentos de compatibilidade; `/conta/` reconhece o novo destino `#interfaceAppearanceCard`.

Privacidade/segurança:
- tema não altera permissões, dados, OAuth, Drive, IA ou regras assistenciais;
- a preferência claro/escuro não entra no PostHog;
- nenhum conteúdo clínico é lido ou transmitido pela camada;
- não há biblioteca ou serviço externo de tema.

Documentação de arquitetura: `docs/PORTAL-APARENCIA-V1.md` e complemento em `docs/PORTAL-INTERACTIONS-V1.md`.

**Próxima ação exata:** abrir PR e executar a matriz CI completa. Só integrar se os testes de rotas, autenticação, Telemedicina, Central/staging e regressão global permanecerem verdes; depois homologar visualmente claro/escuro em produção.


## Mudança transversal — tema claro/escuro global — correção do bootstrap pós-login — 23/09/2026

Durante a primeira matriz CI da PR **#444**, 52/53 workflows ficaram verdes. O único workflow vermelho foi **Validar abertura pós-login — navegador**, e a repetição do mesmo job reproduziu a falha em 4 cenários da Home real.

Diagnóstico concluído com o artefato Playwright:
- a Home terminava sendo carregada somente depois do vídeo, em vez de ser preparada durante os 10 segundos;
- o documento da Home já continha o novo `/js/portal-theme.js`;
- `js/login-home-transition.js` possui uma allowlist explícita de scripts autorizados para o handoff da Home;
- o novo bootstrap de tema ainda não estava nessa allowlist;
- portanto `assetUrl(..., 'script')` rejeitava a Home preparada com `home_asset_not_allowed`, e o login caía corretamente no fallback de navegação após a abertura.

Correção no head `5240c26f01279baad88332206947b391d3680008`:
- `/js/portal-theme.js` foi incluído em `SCRIPT_GLOBALS` com o global esperado `PortalTheme`;
- o teste de contrato pós-login agora exige explicitamente essa allowlist;
- o workflow de navegador passa a ser disparado também quando `js/portal-theme.js` mudar, evitando regressão silenciosa futura.

Impacto de segurança: nenhum afrouxamento da política. A Home continua aceitando somente scripts locais explicitamente allowlisted; apenas o novo bootstrap oficial de aparência foi adicionado.

**Próxima ação exata:** aguardar a matriz CI do novo head, confirmar o navegador pós-login verde e integrar a PR #444 somente com a matriz completa aprovada.


## Mudança transversal — modo claro/escuro global integrado à main — 23/09/2026

A PR **#444 — Portal: preparar modo claro e escuro global** foi integrada à `main` no merge **`5ff0a028a673a886109b96f1d6fae80c41484a8f`**.

Resultado versionado:
- novo bootstrap `js/portal-theme.js`, aplicado antes da pintura nas rotas visuais ativas;
- novo card **Aparência** em **Configurações**, com **Modo claro** e **Modo escuro**;
- modo claro continua sendo o padrão e preserva a aparência anterior;
- escolha é aplicada imediatamente, mantida entre módulos e abas e sincronizada por conta quando o backend está disponível;
- backend persiste `interfaceTheme` como `light|dark` em `auth_users.interface_theme`;
- tema foi desacoplado das microinterações, permitindo Telemedicina em modo escuro sem reativar sons/animações globais;
- camada escura central cobre Home, Ferramentas, Perfil, Amigos, Notificações, Login/Cadastro, Guia Médico/Protocolos, Recepção, Telemedicina, Agenda/ponte, Central/Titon, Cidadão, Conselho, Segurança, Configurações, Conquistas e Administração;
- PDFs renderizados e impressão permanecem claros;
- imagens/logos não são recoloridos artificialmente;
- nenhuma propriedade de tema é enviada ao PostHog.

Descoberta/correção durante a CI:
- a primeira matriz teve **52/53 workflows verdes**;
- o único vermelho foi a abertura pós-login porque a Home preparada rejeitava o novo `portal-theme.js` por ele ainda não estar na allowlist de `login-home-transition.js`;
- a falha foi reproduzida em rerun e diagnosticada via artefato Playwright;
- o bootstrap foi adicionado explicitamente a `SCRIPT_GLOBALS`, mantendo a política fail-closed de scripts autorizados;
- o teste de contrato e o gatilho do workflow passaram a cobrir `portal-theme.js`.

Validação final:
- head funcional `b1d18fddb2bf92959c626524ac1bd2461d6c0060`: **53/53 workflows GitHub Actions success**;
- pós-merge `5ff0a028`: **52/52 runs success**, incluindo abertura pós-login e **pages build and deployment**;
- documento de arquitetura: `docs/PORTAL-APARENCIA-V1.md`.

**Próxima ação exata:** homologar visualmente em produção: Configurações → Aparência → Modo escuro; navegar pelos módulos principais em desktop/mobile e depois retornar ao Modo claro, registrando somente diferenças visuais reais que precisem de refinamento.


## Mudança transversal — completar modo escuro do chat interno — 23/09/2026

Homologação humana do modo escuro revelou que a janela do **Chat interno** ainda apresentava superfícies claras na lista de usuários e campos, apesar de o painel externo já receber a camada escura global.

Diagnóstico:
- `css/portal-chat.css` mantém cores claras hardcoded para `.portal-chat-body`, `.portal-chat-search-wrap`, `.portal-chat-list`, contatos, conversa, balões e compositor;
- a camada global de aparência cobria somente `.portal-chat-panel`, `.portal-chat-header` e uma classe inexistente `.portal-chat-composer`, enquanto o componente real usa `.portal-chat-compose`;
- por isso a captura de produção mostrava painel externo escuro, mas lista de contatos e busca ainda claras.

Implementação na branch `fix/portal-chat-dark-theme-20260923`:
- adiciona overrides de tema escuro diretamente no CSS próprio do chat, condicionados a `html[data-portal-theme="dark"]`;
- cobre painel, header, corpo, busca, contatos, avatares, presença, conversa, balões enviados/recebidos, horários, compositor, campo de mensagem, botão Enviar, avisos, notificações e scrollbars;
- modo claro permanece sem alteração;
- atualiza o cache-buster para `portal-chat.css?v=20260923-1` em todas as rotas estáticas que montam o chat e no carregador `js/medical-portal-nav.js`;
- amplia regressão automatizada e workflow do chat para exigir os seletores escuros e a nova versão do asset.

Decisão arquitetural: o refinamento fica em `css/portal-chat.css` porque a lacuna está nas superfícies internas específicas do componente; isso evita rebustar a folha global de aparência em rotas que não possuem chat, mantendo a arquitetura global intacta e o escopo mínimo.

Segurança/privacidade: somente CSS e cache-buster. Nenhuma alteração em mensagens, contatos, amizade, cargos, push, backend, permissões ou PostHog.

**Próxima ação exata:** abrir PR, executar CI completo e integrar somente se verde; depois Ctrl+F5 na Home em modo escuro e validar lista de contatos, pesquisa e conversa.


## Mudança transversal — modo escuro do chat interno integrado à main — 23/09/2026

A PR **#452 — UI: completar modo escuro do chat interno** foi integrada à `main` no merge **`77e50f016762bd1cf6cce5a808c9088879d38091`**.

Resultado final:
- o modo escuro do chat agora cobre painel, cabeçalho, corpo, lista de contatos, busca, avatares, presença, conversa, balões enviados/recebidos, horários, compositor, campo de mensagem, botão Enviar, avisos, cartões de notificação e scrollbars;
- o modo claro permanece inalterado;
- `portal-chat.css?v=20260923-1` foi aplicado nas rotas estáticas que montam o chat e no carregador do Guia Médico;
- regressão automatizada exige os seletores do modo escuro e a versão nova do asset;
- nenhuma regra funcional de mensagem, contato, amizade, cargo, push, backend, permissão ou observabilidade foi alterada.

Validação:
- head funcional da PR: **23/23 workflows GitHub Actions success**;
- após o merge, **pages build and deployment: success**;
- abertura pós-login — navegador: **success**;
- o workflow próprio de chat e as demais validações críticas também concluíram com success;
- no momento do registro, um wrapper não relacionado (`Validar complemento prático 6`) ainda aparecia como `in_progress` na API do run, embora seu único job já estivesse `completed/success`; isso não bloqueia a correção do chat.

**Próxima ação exata:** Ctrl+F5 na Home com Modo escuro ativo → abrir Chat interno → confirmar busca, lista de usuários e conversa totalmente escuras; se aprovado, retomar a homologação humana pendente da 7G.1 na Central de Documentos.
