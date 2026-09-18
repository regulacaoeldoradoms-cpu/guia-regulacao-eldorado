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

## Fase atual

**Fase 5 — IA documental.** Subfase **5A — fundação segura**, iniciada em branch própria. A **Fase 4 está concluída e publicada em produção**; não reiniciar a 4D.

A **Fase 0** e as Fases **1, 2, 3 e 4** permanecem encerradas após o merge/publicação desta entrega. Não reiniciar etapas encerradas; hardening de latência pertence à Fase 7.

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR **#201 pronto para sair de draft e ser mesclado após este registro final**; branch 0 commits atrás da main antes do merge.
- Ref real da `main` reconferida: **`cd71ad566a443cd2f89b1d98285856c22baf73d7`**. Preservar login/abertura/Home. A ref Git não identifica deployment Cloudflare.
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

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 5 — IA documental; subfase 5A — fundação segura |
| Última ação concluída | Produção transversal confirmada; branch Fase 5 criada e escopo `CENTRAL-DOCUMENTOS-FASE-5.md` registrado |
| Branch/PR | `feat/central-docs-phase5-document-ai`; PR da Fase 5 ainda não aberto |
| Main | `7947815ef50881621b7aed50a7cabc50708e7272` — base reconciliada da Fase 5 após fechamento do vídeo |
| Último commit relevante | funcional `1d4decd03e0047a1bad678d60cee36ba6822d5b5`; commits posteriores na branch são somente documentação/handoff da reconciliação |
| Código/preview | Preview final bloqueado `1864a072…`; gate false; release `1d4decd…`; previews de escrita anteriores são históricos |
| Produção | Reconfirmada pelo operador: versão `91eae913-ebaa-4550-8e88-f701f6cef777`, deployment `250b3d7b-9012-4073-9986-de36dd14bc3d`, 100%; V4 reconfirma de novo antes de escrever |
| Janela | `phase4d_d28ac0d37fe3409f8751fac02007e777` encerrada: controlEnabled=false, writeGate=false, httpBlocked=true |
| Decisão/porquê | Reconciliar #201 com a main antes da nova 4D para preservar abertura/Home e eliminar base Git obsoleta; nova janela deve usar controle/prazo novos |
| Descartado | Rollback, Split versions, View logs para inferir configuração, inventar botão de detalhes, repetir V3 inteiro/download/SQL/OAuth, publicar para localizar alias |
| Ações externas | Janela antiga revogada; alias e bloqueio HTTP confirmados. Nenhuma nova alteração Cloudflare/D1/Drive foi feita durante a reconciliação GitHub |
| Checks/testes | Produção: abertura `35323251451` success com smoke público; Pages `35323249977`, Fases 1–4 `35323251417`, governança `35323251482` e site `35323251448` success |
| Bloqueios | Nenhum para 5A. Processamento real de documentos clínicos continuará desabilitado até homologação própria |
| Riscos | Cache antigo mitigado por `20260918-1` e invalidação pontual; fallback legado preservado; nenhuma regressão conhecida após confirmação pública |
| Observabilidade | Somente UUIDs/timestamps/flags/contagens técnicos; nunca saída JSON bruta de configuração/autores |
| Próxima ação exata | Implementar `worker/document-ai.js`, feature gate, painel lateral controlado por `extract`, prompts versionados e testes sintéticos de autorização/privacidade |
| Depois | Validar 5A; seguir para classificação isolada por página (5B), sem habilitar dados clínicos reais antes da homologação |
| Fontes | STATUS; Guia Mestre V1.1; PRs #212/#213; runs `35323251451`, `35323249977`, `35323251417`, `35323251482`, `35323251448`; Dossiê/deltas relevantes |

## Histórico recuperável

Status integral anterior: `c1767a219389b660f59d3c8631bc1a96b12bec1e:docs/CENTRAL-DOCUMENTOS-STATUS.md`. Etapas anteriores emc90b774,5b1507c,9c491c2,402199d,f1824c7,4d64c5d; V2-R1 em103ccd6; V2 em9f295ca. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 preservam critérios/detalhes. Consultar apenas o necessário sem reiniciar etapas concluídas.

Referências externas desta etapa: Cloudflare Workers Preview URLs (versões e aliases, limitações de logs) e Wrangler Commands/Workers (versions list: dez recentes; versions view: detalhes de uma versão). Essas referências não comprovam configuração privada deste ambiente.
