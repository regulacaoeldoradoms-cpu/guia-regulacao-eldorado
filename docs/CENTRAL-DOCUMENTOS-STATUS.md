# Central de Documentos — Status

Última atualização: 18/09/2026.

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

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 5E — V7D integrada; V7C encerrada fail-closed; reteste pronto para abertura |
| Último resultado real | V7C 10/10; extração 13,748 s; V7D remove Moondream da cadeia |
| Runtime funcional V7D | `208639f021ca9d5f86a2df97a9bd8a5978e5224f` |
| Runtime próximo reteste | `208639f021ca9d5f86a2df97a9bd8a5978e5224f` |
| Pages próximo reteste | `https://b5b3f33e.portal-regulacao-central-staging.pages.dev` |
| Provider | V7 candidata: Moondream 3.1 fast vision; Gemma 4 fallback/chat; Qwen 3.8 fallback/revisor; Workers Free |
| Custo | requisito permanente R$ 0; sem Gateway/prepaid/pay-as-you-go |
| V7 integrada | Moondream reasoning=false; concorrência 6; imagem atual preservada; Gemma/Qwen fallback; revisão sequencial evitada quando fast path já confirma ilegivel |
| Janela V6 | encerrada fail-closed; HTTP bloqueado confirmado; não reutilizar |
| Produção | IA documental false/false; não ativar antes do aceite |
| Próxima ação exata | atualizar scripts; readiness V7D; preparar janela nova; executar matriz uma vez |
| Meta | 10/10 e duracao_extracao_ms V7 <= 50% da V6 na mesma máquina/rede |
| Fontes | Guia Mestre V1.1; FASE-5; HOMOLOGACAO-5E; IA-LATENCIA-V7; STATUS; documentação Cloudflare Workers AI |

## Histórico recuperável

Status integral anterior: `c1767a219389b660f59d3c8631bc1a96b12bec1e:docs/CENTRAL-DOCUMENTOS-STATUS.md`. Etapas anteriores emc90b774,5b1507c,9c491c2,402199d,f1824c7,4d64c5d; V2-R1 em103ccd6; V2 em9f295ca. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 preservam critérios/detalhes. Consultar apenas o necessário sem reiniciar etapas concluídas.

Referências externas desta etapa: Cloudflare Workers Preview URLs (versões e aliases, limitações de logs) e Wrangler Commands/Workers (versions list: dez recentes; versions view: detalhes de uma versão). Essas referências não comprovam configuração privada deste ambiente.
