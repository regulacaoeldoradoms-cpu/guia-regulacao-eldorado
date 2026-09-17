# Central de Documentos — Status

Última atualização: 17/09/2026

## Fase atual

**Fase 4 — Sincronização segura com Drive**

Subfase atual: **4D — homologação real iniciada; correções de conflito e proteção de fechamento em andamento**.

Branch: `codex/central-docs-drive-sync-phase4`  
PR: **#201**  
Base atual: `main@336b647300faee2c958475a3b51b6b0522e0dd06`

## Retomada pelo estado real — 17/09/2026

Fontes conferidas antes das alterações: Guia Mestre Central de Documentos V1.1 (9 páginas integrais), Dossiê Mestre do Portal V1 (9 páginas integrais), delta de 11/09 da camada social, este status, documentos da Fase 4 e homologação, branch e PR #201. O checkout de continuidade foi obtido de `faa40f11d4a4c78464abdb218b483b86bfbb83ce`, sem modificar o checkout antigo de Telemedicina com alterações locais.

A comparação com as integrações corrigiu duas informações desatualizadas:
- o conector Cloudflare autenticado está disponível nesta sessão;
- o resultado verde de `6f45b7c` era histórico: o head `faa40f1` tinha cinco workflows vermelhos e o navegador cancelado após falhas de inicialização. Governança, bundle e Pages estavam verdes.

### Regressão posterior ao fechamento da 4C

O commit `e2a8c76` substituiu grande parte de `testing/central-docs/editor-harness.js`, removeu impressão real e passou argumentos incompatíveis para abrir o visualizador. A falha real reproduzida foi `Superfície do visualizador incompleta.`; cinco workflows também falhavam pela mesma asserção de impressão ausente.

Correção: restaurar o harness completo de `edd95fa`, preservando somente a duração sintética de 900 ms do estado `syncing`. Nenhum teste foi enfraquecido e nenhuma funcionalidade de produção foi reescrita.

Validação local do reparo: 180/180 testes do Worker; Playwright completo com PDF.js real, desktop e mobile, 75 passed / 3 skipped previstos, sem retries; sintaxe e `git diff --check` aprovados. Os checks remotos precisam ser conferidos no novo commit publicado.

### Infraestrutura real conferida

- PR #201 aberto, sem merge e sem reviews humanas; `main` permanece na base indicada acima.
- Pages da branch em `faa40f1`: deployment `aac31e36`, bem-sucedido, mas sem `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL` configurada.
- Worker de produção: versão `239cca88-9b19-400c-9cd1-82612f942ed0`, deployment `f2916211-e56e-4913-b3b2-e09294d99018`, 100% do tráfego. Gate de escrita ausente/desligado.
- Único trigger de Builds encontrado: produção/main; token original de build `Workers Builds - 2026-08-11 14:26` realmente persistido. Não confundir esse token com credencial da Builds API.
- Duas tentativas de criar trigger exclusivo de preview, usando o contrato documentado, retornaram `12002: Invalid request body`; leitura posterior confirmou que nenhum trigger foi criado ou alterado.
- Conexão OAuth institucional presente no D1, confirmada apenas por contagem de registro configurado; nenhum segredo foi extraído ou exposto.
- PDF descartável de três páginas sintéticas criado no Drive e verificado por leitura de metadados. Identificador permanece fora do repositório público.

Decisão: preparar uma versão preview por upload de versão, sem promover deployment nem modificar o trigger de produção. O preview deve reutilizar a conexão OAuth existente, bloquear reconexão/desconexão e limitar acesso ao usuário de homologação e ao PDF descartável. A URL estática de uma versão antiga não é revogada apenas trocando o alias; o controle de homologação precisa ser consultado no backend, com expiração e revogação.

Esta retomada **não reabre as fases concluídas nem comprova a 4D**. A matriz real de escrita, conflito, retry e recuperação continua pendente até execução com sessão legítima do Portal.

### Preview restrito implementado e validado

Novo entrypoint `worker/homologation-4d.js`, sem alteração da entrada de produção. O wrapper reutiliza autenticação, capabilities, handlers documentais e observabilidade existentes; permite somente host/origem autorizados, uma conta já autorizada, PDFs descartáveis listados no backend e sessões de upload emitidas pela própria homologação. OAuth e módulos alheios são bloqueados.

O controle no D1 é consultado sem cache, expira e pode ser revogado. Tabela/linha ausente ou inválida bloqueia o acesso. A escrita exige também `DOCUMENTS_DRIVE_WRITE_ENABLED=true`; preparação e login usam `false`. Revisões anteriores são preservadas mesmo quando o cliente envia `preserveRevision:false`; a chave de cache é HMAC por arquivo, evitando troca de conteúdo após reordenar a lista permitida.

Validação: 19/19 testes específicos, com revisão independente e integração dos handlers/autenticação reais usando somente Google mockado; suíte completa do Worker passou em **199/199**. Produção, autenticação e permissões não foram substituídas por mocks na implementação. O esquema idempotente de duas tabelas de controle foi aplicado no D1; nenhuma linha habilitada foi criada por essa migração. Detalhes: `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-ISOLAMENTO.md`.

### Publicação do preview — 17/09/2026, 13:07 UTC

- Implementação publicada no PR #201 em `63b56afd7938f9b19d8ce5d3ca3660d2b46767e6`.
- Versão não produtiva do Worker: `c8dab951-58a7-4264-817f-4578562ef55f`, alias `central-docs-phase4d`, bundle SHA256 `6e3de31eaa930384a0c9cd726b02b3210c503c3addffd31d0d786df2b1748224`.
- A API recusou herança por UUID e aceitou somente `version_id:latest`. Antes do upload foi confirmado, na mesma operação, que `latest` ainda era a versão de produção `239cca88-9b19-400c-9cd1-82612f942ed0`; apenas os dez bindings necessários foram herdados, sem leitura de segredos. Upload não criou deployment.
- Leitura posterior confirmou o mesmo deployment de produção, 100% na versão anterior. Preview com `DOCUMENTS_DRIVE_WRITE_ENABLED=false`.
- Configuração **preview** do Pages atualizada com `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL` apontando para `https://central-docs-phase4d-yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev`.
- Janela de leitura criada no D1 para uma conta já autorizada e um único PDF sintético, com expiração em 17/09/2026 às 15:08:57 UTC (11:08:57 em Cuiabá). Não publicar o identificador do arquivo.
- Verificação HTTP real: antes da janela, `403 HOMOLOGATION_DISABLED`; com janela ativa e sem sessão, `401 AUTH_REQUIRED`; rota administrativa e origem divergente retornam `403`. Nenhuma escrita no Drive foi habilitada.
- Os primeiros builds Pages do commit falharam porque o scanner confundiu o hostname de preview prefixado com o hostname de produção por busca de substring em `_headers`. Corrigido para comparar o hostname completo; `_headers` continua inspecionado. Build local aprovado com alias real, sem configuração e com rejeição das variantes de produção, porta e path. O workflow passou a cobrir essa regressão.
- Checks GitHub Actions de `63b56afd`: **26/26 workflows concluídos com sucesso**, incluindo navegador com 75 passed / 3 skipped previstos. O check automático Workers Builds informou falta de acesso a Worker Previews; ele não representa o upload manual de versão concluído e verificado acima.
- Correção do builder publicada em `125dcbe8c4c0197306490dbd387ffd9a7e13fed3`. Pages `3c3cb671-c18b-46a6-a602-89a5093198a8` concluiu com sucesso às 13:12:08 UTC, mantendo o alias estável da branch. HTTP real confirmou `200` em login/documentos, `workerConfigured:true` no manifest e CSP `connect-src` limitada à própria origem e ao Worker preview.
- Login habitual concluído pelo operador no Chrome, sem sessão artificial nem token copiado. Listagem e conteúdo do único PDF sintético foram conferidos.
- Preview `64dedfd6-2bd8-4272-b4fc-eb65f84c0181` ativou gate `true` após essa conferência. Primeiro autosync real gravou uma nova revisão; a revisão anterior foi marcada `keepForever:true` e recuperada pelo conector.
- Edição durante upload mostrou conflito indevido após o primeiro envio. O **X do visualizador** também fechou com edição pendente, contornando a proteção de `exitEditor`. Controle D1 revogado (`enabled=0`) durante a correção, com zero sessões de homologação restantes. O gate da versão preview permanece `true`, mas a revogação bloqueia suas requisições; desligá-lo ao encerrar.
- Evidências e critérios ainda pendentes: `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-RESULTADOS.md`. **A 4D não está aprovada.**

## Preparação manual anterior da 4D — 17/09/2026

O usuário confirmou que prefere concluir a homologação 4D manualmente pelo painel Cloudflare, sem depender do Codex enquanto o limite de uso estiver indisponível.

Foi criado o roteiro persistente:

`docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-MANUAL.md`

O roteiro registra, sem segredos:
- como obter/criar um Worker preview da branch;
- como configurar o Pages de staging com `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL`;
- como habilitar temporariamente `DOCUMENTS_DRIVE_WRITE_ENABLED=true` apenas no ambiente de homologação;
- como preparar um PDF descartável sem dado de paciente;
- a matriz completa de teste real: autosync, ausência de sync sem alteração, retry manual, fechamento com pendência, conflito de versão, revisão recuperável e privacidade;
- encerramento obrigatório com gate desligado e registro do resultado.

A branch já contém a infraestrutura necessária para essa homologação manual:
- `scripts/build-central-docs-staging.mjs` gera `/homologacao/documentos/`, `/homologacao/login/`, auth-config isolado, manifest e CSP específica;
- o build fica desarmado se `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL` não estiver configurado;
- o build rejeita explicitamente o Worker de produção como alvo 4D;
- `worker/wrangler.toml` já allowlista temporariamente a origem estável do preview Pages `https://codex-central-docs-drive-syn.portal-regulacao-central-staging.pages.dev` e registra `DOCUMENTS_HOMOLOGATION_ORIGIN` para a 4D;
- nenhuma variável secreta foi versionada;
- nenhuma escrita real no Drive foi habilitada.

Decisão: **não é necessário usar o Codex para executar a 4D**. O trabalho restante pode ser feito manualmente no painel Cloudflare, com orientação passo a passo, desde que o Worker usado seja preview/não-produção e o PDF de teste seja descartável e sem dados sensíveis.

## Fechamento técnico da 4C — 16/09/2026 21:39 (America/Campo_Grande)

A matriz final da 4C ficou verde no head funcional `6f45b7ca5d9cccf884c6dca2c964367dc0671bcd`.

Evidências:
- `Validar Central de Documentos — Fases 1–4`: sucesso;
- `Validar bundle de staging da Central`: sucesso;
- `Validar governança Central de Documentos`: sucesso;
- `Validar Central de Documentos — navegador`: sucesso;
- Playwright/PDF.js real: **78 casos, 75 passed e 3 skipped esperados**, desktop e mobile;
- staging sintético continua sem acesso a Google APIs/rotas de produção.

Durante a validação foram descobertas falhas apenas no contrato antigo dos testes de navegador, não no autosync:
- seletores antigos da janela **Unir** ainda procuravam IDs removidos do harness;
- um clique sintético de duplicação sofria interceptação pelo canvas da miniatura no Chromium desktop;
- o teste de zoom tentava usar a toolbar depois de entrar no modo Organizar, onde ela é intencionalmente ocultada;
- o teste de layout exigia uma única linha de miniaturas também no mobile, contrariando o comportamento responsivo real.

Correções aplicadas sem rollback de produto:
- testes alinhados aos IDs atuais do harness (`editorMergeConfirm`, `editorMergeSelectionLab`, `editorMergeFileInput`, `editorMergePreviewLab`);
- clique forçado restrito ao acionador sintético afetado pelo hit-test;
- estado de zoom/página estabelecido antes de entrar no editor;
- asserção de layout passou a respeitar quebra responsiva no mobile.

Decisão: **4C tecnicamente concluída**. O próximo gate é 4D. Nenhuma escrita real foi ativada para conseguir esse resultado.

## Correção visual do ícone pendente — 16/09/2026 20:12 (America/Campo_Grande)

O usuário substituiu em `main` o asset `assets/Drive_pendente.png` por uma versão corrigida, mantendo o mesmo nome. A versão anterior da branch apresentava falha de desenho.

Ação aplicada nesta branch:
- asset binário `Drive_pendente.png` atualizado a partir da versão corrigida existente em `main`;
- cache-buster específico alterado de `v=20260916-1` para `v=20260916-2`, evitando reutilização da imagem defeituosa pelo navegador;
- os demais estados visuais do Drive permanecem inalterados;
- nenhuma escrita real no Google Drive foi habilitada.

## Reconciliação com a main — 16/09/2026 20:23 (America/Campo_Grande)

A branch da Fase 4 foi reconciliada com a `main` vigente `336b647300faee2c958475a3b51b6b0522e0dd06` usando o merge calculado pelo próprio GitHub (`eeb544e633cbc198d3082e5460c271cca1dae593`). A `main` havia recebido somente a correção do asset `Drive_pendente.png` por exclusão/reupload; a branch já incorporava esse mesmo blob corrigido e preservou o cache-buster `v=20260916-2`.

Nenhuma mudança funcional adicional foi introduzida por essa reconciliação. O PR #201 continua aberto, sem merge, e a escrita real no Drive continua bloqueada.

## Estado consolidado

As Fases 1, 2 e 3 estão encerradas. A Fase 4 continua aberta. As subfases 4A, 4B e 4C estão concluídas tecnicamente. A 4D ainda precisa comprovar o fluxo contra o Google Drive real em ambiente controlado.

A **Fase 0** permanece encerrada e suas decisões de governança continuam válidas: escopo mínimo, segurança, privacidade, branches/PRs, não exposição de segredos e documentação persistente antes de avançar fases.

Nenhuma escrita real no Google Drive foi habilitada nesta etapa. O feature gate `DOCUMENTS_DRIVE_WRITE_ENABLED` continua sendo a barreira de segurança para a homologação real controlada.

## 4A — preflight e conflito — concluída

Implementado:
- sessão do Portal + `documents_edit` revalidados no Worker;
- metadados atuais do Drive lidos por referência opaca;
- comparação de `version` antes de substituir;
- `DRIVE_VERSION_CONFLICT` bloqueia `replace_pdf` antes de qualquer upload;
- respostas sanitizadas sem fileId bruto, nome, parentId ou revisionId;
- testes com Google Drive mockado e zero upload em caso de conflito.

## 4B — resumable + revisão recuperável — concluída tecnicamente

Implementado:
- upload resumable iniciado somente no backend;
- URI de sessão cifrada e nunca exposta ao navegador;
- envio em blocos com `Content-Range`, `308` e consulta de status;
- primeiro bloco validado pela assinatura `%PDF-`;
- revisão anterior preservada com `keepForever=true` antes de substituir;
- falha/interrupção não produz falso “salvo”;
- sucesso só existe após resposta final válida do Google Drive;
- conteúdo PDF não é persistido em D1, logs ou PostHog.

## 4C — sincronização automática e feedback visual — concluída tecnicamente

### Comportamento funcional aprovado

O caminho normal passou a ser **sincronização automática**. O botão no toolbar é **Forçar sincronização com Google Drive** e funciona como fallback/retry, além de indicador visual do estado da sincronização.

A sincronização automática só é agendada quando a `revision` da sessão do editor muda. Abrir o PDF, navegar, alterar zoom ou ficar sem editar não dispara upload.

Após uma modificação:
1. a revisão é detectada pelo observador técnico;
2. o botão entra em `pending`;
3. existe um debounce/ociosidade de **1 segundo**; novas alterações reiniciam a espera;
4. começa a sincronização `replace_pdf` da revisão mais recente;
5. o botão entra em `syncing`;
6. somente depois da confirmação real do Drive a revisão é marcada como confirmada;
7. o botão entra em `success` durante **1 segundo**;
8. se nenhuma edição nova ocorreu, volta a `normal`;
9. se uma edição nova ocorreu durante o envio, volta a `pending` e agenda a revisão mais nova;
10. em falha, entra em `failed` e o clique no botão força nova tentativa.

Constantes atuais:
- `DRIVE_AUTO_SYNC_IDLE_MS = 1000`;
- `DRIVE_SYNC_SUCCESS_VISIBLE_MS = 1000`;
- `DRIVE_SYNC_REVISION_POLL_MS = 200`.

### Assets visuais aprovados pelo usuário

Os cinco PNGs enviados pelo usuário em `assets/` foram vinculados diretamente aos estados do botão:
- `Drive_normal.png` → `normal`;
- `Drive_pendente.png` → `pending`;
- `Drive_sincronizando.png` → `syncing`;
- `Drive_sincronizado_1seg.png` → `success` por 1 segundo;
- `Drive_falha.png` → `failed`/retry.

O CSS usa `data-sync-state` no botão, sem sprite e sem dependência externa.

### Regra de confirmação

O estado verde de sucesso **não aparece quando o upload começa**. Ele só é exibido após o backend receber confirmação final válida do Google Drive e o estado local ter sido atualizado com a nova `version`/referência confirmada.

Se a revisão do editor mudar enquanto o upload anterior está em andamento, o sucesso da revisão antiga não é usado como indicação de que a revisão nova já está salva.

### Botão de força

- estado normal: `Drive_normal.png`;
- alterações aguardando autosync: `Drive_pendente.png`;
- envio em andamento: `Drive_sincronizando.png`;
- confirmação real: `Drive_sincronizado_1seg.png` por 1 segundo;
- falha: `Drive_falha.png`;
- clicar no botão força/reexecuta a sincronização da revisão atual;
- se não houver alteração pendente, o Portal não cria artificialmente uma nova revisão apenas para produzir atividade visual.

## Staging e testes

O laboratório sintético mostra o botão e simula os cinco estados sem acessar APIs reais do Drive. O bundle sintético inclui os cinco PNGs e continua proibindo `googleapis.com`, `/api/documents/` e outros endpoints de produção. A rota separada `/homologacao/` usa somente o Worker preview restrito configurado para a 4D.

Cobertura de navegador validada:
- cada um dos cinco arquivos é servido e possui conteúdo;
- cada valor de `data-sync-state` aponta para o PNG correspondente;
- uma mutação real do editor produz a sequência `pending → syncing → success → normal`;
- o sucesso dura aproximadamente 1 segundo;
- o botão de força é verificável no laboratório sem gravar no Drive;
- desktop e mobile passam na matriz real PDF.js/Chromium.

## Proteção ao fechar o editor — 16/09/2026 20:24 (America/Campo_Grande)

Durante a revisão da 4C foi identificado um caso limite relevante: uma alteração feita imediatamente antes de fechar o editor poderia ainda estar dentro do debounce de 1 segundo e, portanto, ser descartada localmente antes de o autosync iniciar.

Correção implementada:
- ao clicar em **Fechar** com revisão ainda não confirmada pelo Drive, o Portal cancela o debounce e tenta sincronizar imediatamente a revisão atual;
- o editor só fecha depois de a revisão mais recente ser confirmada;
- se houver falha ou conflito, o editor permanece aberto e informa que a confirmação ainda não ocorreu;
- enquanto um upload está em andamento, o botão Fechar permanece indisponível;
- o navegador recebe um guard de `beforeunload` quando há sincronização pendente/em andamento, reduzindo risco de perda por fechamento acidental da aba;
- nenhuma sincronização adicional é criada quando a revisão atual já está confirmada.

O cache do frontend avançou para `documents.js?v=20260916-13` / `CACHE_VERSION=20260916-13`.

## Privacidade e observabilidade

Mantido:
- `drive_sync_started`, `drive_sync_completed` e `drive_sync_failed` somente com propriedades técnicas allowlisted;
- nenhum nome de arquivo, ref opaca, fileId, parentId, paciente, CPF, CNS, CID, diagnóstico ou conteúdo do PDF no PostHog;
- tokens Google, URL resumable e identificadores brutos permanecem no backend;
- nenhum documento real de paciente em CI/staging.

## Decisões descartadas

- sincronizar por tempo fixo mesmo sem edição: descartado;
- enviar a cada movimento contínuo de mouse/toque: descartado; usa revisão + ociosidade para agrupar gestos contínuos;
- mostrar ✓ antes da confirmação do Drive: descartado;
- transformar o botão de força no caminho normal de salvamento: descartado; ele é fallback/retry;
- criar nova revisão só porque o usuário clicou no botão sem alterações: descartado;
- habilitar escrita real apenas porque mocks e staging passaram: descartado.

## Riscos e bloqueios atuais

- A 4D ainda não tem aceite real de autosync, retry, conflito e revisão recuperável; testes mockados não substituem esse aceite.
- O preview compartilha a conexão institucional e o D1; usar somente o entrypoint restrito e manter OAuth bloqueado.
- `DOCUMENTS_DRIVE_WRITE_ENABLED` permanece desligado durante preparação/login. A janela de escrita exige também controle D1 ativo e deve ser revogada ao encerrar.
- Não trocar apenas o alias para desarmar versões anteriores; verificar bloqueio pelo controle e pelo host.
- A Builds API recusou criação do trigger de preview. O caminho atual é upload direto de versão sem deployment, com segredos herdados dentro da Cloudflare.
- Login real do operador deve ocorrer no navegador. Não fabricar sessão nem copiar segredos para chat, repositório ou frontend.
- `save_copy` continua testado sinteticamente, mas é bloqueado no wrapper restrito e não está homologado no Drive real.

## Próxima ação exata

1. Corrigir e testar o conflito após upload e o fechamento do cabeçalho que contorna a proteção de alterações pendentes.
2. Publicar a correção na mesma branch/preview; conferir checks e recarregar a UI. A sessão legítima já existe; não copiar tokens nem refazer OAuth.
3. Reativar somente o controle do mesmo usuário/PDF sintético, após conferir a expiração, e repetir a matriz real registrada em `CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-RESULTADOS.md`.
4. Desligar gate e manter controle D1 revogado; verificar bloqueio, registrar evidências sem dados sensíveis e só então avaliar encerramento da fase/merge.

## Handoff para o próximo chat

| Campo | Estado de continuidade |
| --- | --- |
| Fase/subfase | Fase 4, homologação real 4D; fases anteriores não reiniciadas |
| Última ação concluída | Primeiro autosync real e recuperação da revisão anterior confirmados; janela revogada após falhas encontradas na matriz |
| Branch/PR | `codex/central-docs-drive-sync-phase4`, PR #201 aberto e sem merge |
| Commits | Entrada `faa40f1`; implementação restrita e reparo em `63b56afd`; correção de build Pages em `125dcbe` |
| Checks | Local: 199/199 Worker, 75 passed / 3 skipped navegador. Remoto `125dcbe`: 26/26 Actions e Pages aprovados. Workers Builds automático com bloqueio externo de acesso a previews. Falhas reais 4D exigem novas regressões |
| Decisões | Preview próprio com autenticação real, usuário/arquivo/sessões restritos, preservação obrigatória de revisão, cache por identidade e controle D1 expirável/revogável |
| Justificativa | URL de preview e storage separado não isolam D1/OAuth; alias novo não elimina URL estática antiga |
| Alternativas descartadas | Habilitar gate em preview genérico; repetir OAuth; usar produção; enfraquecer testes; continuar tentando o mesmo formulário de Builds |
| Ações externas concluídas | Preview atual `64dedfd6` gate true porém controle D1 revogado; Pages `3c3cb671`; sessão legítima; um PDF sintético com duas revisões e anterior preservada/recuperada |
| Pendências | Corrigir conflito indevido e fechamento com pendência; repetir matriz real; desligar gate do preview ao encerrar |
| Riscos | Conexão/D1 compartilhados; segredo não deve sair do backend; escrita deve ficar desligada fora da janela; save_copy não homologado no ambiente restrito |
| Observabilidade | Eventos técnicos allowlisted; preview sem Workers Logs/tail não pode ser apresentado como evidência de privacidade por ausência de logs |
| Próxima ação exata | Concluir as correções causais, atualizar preview e repetir o teste no mesmo PDF, com reativação temporária do controle D1 existente |
| Fontes principais | Este status, FASE-4, HOMOLOGACAO-4D-ISOLAMENTO, HOMOLOGACAO-4D-MANUAL, HOMOLOGACAO-4D-RESULTADOS, PR #201 e checks atuais |
