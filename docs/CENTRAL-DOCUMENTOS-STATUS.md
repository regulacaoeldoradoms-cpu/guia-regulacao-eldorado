# Central de Documentos — Status

Última atualização: 16/09/2026

## Fase atual

**Fase 4 — Sincronização segura com Drive**

Subfase atual: **4D — preparação da homologação controlada no Drive real**.

Branch: `codex/central-docs-drive-sync-phase4`  
PR: **#201**  
Base atual: `main@336b647300faee2c958475a3b51b6b0522e0dd06`

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

O laboratório sintético mostra o botão e simula os cinco estados sem acessar APIs reais do Drive. O bundle de staging inclui os cinco PNGs e continua proibindo `googleapis.com`, `/api/documents/` e outros endpoints de produção.

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

## Riscos e bloqueios

- a 4D exige um PDF descartável sem dado de paciente;
- `DOCUMENTS_DRIVE_WRITE_ENABLED` não deve ser habilitado permanentemente antes da homologação controlada;
- conflitos de `version` continuam bloqueando sobrescrita automática e manual;
- a sessão atual não expõe uma integração Cloudflare autenticada para alterar o feature gate/deploy do Worker; não contornar isso por credenciais manuais ou segredos em chat.

## Próxima ação exata

1. Preparar a 4D em ambiente controlado com um PDF descartável, sem dado de paciente e sem valor operacional.
2. Habilitar temporariamente `DOCUMENTS_DRIVE_WRITE_ENABLED=true` somente no ambiente de homologação, usando integração Cloudflare autorizada.
3. Validar no Drive real: autosync após edição, confirmação visual, retry manual, proteção ao fechar, conflito por `version` e revisão anterior recuperável.
4. Desabilitar/reavaliar o gate conforme resultado, registrar evidências sem conteúdo documental e somente então encerrar a Fase 4/considerar merge do PR #201.

## Handoff para o próximo chat

Continuar a partir da branch `codex/central-docs-drive-sync-phase4` e do PR #201; não reiniciar a Fase 4. Antes de qualquer mudança, conferir `main`, este status, `docs/CENTRAL-DOCUMENTOS-FASE-4.md`, o estado dos workflows e o deployment mais recente do Cloudflare Pages.

Estado funcional esperado ao retomar:
- autosync apenas quando a `revision` do editor muda;
- 1 segundo de ociosidade antes do envio;
- sequência visual `normal → pending → syncing → success (1 s) → normal`;
- falha usa `Drive_falha.png` e botão força retry;
- sem alteração, sem upload;
- escrita real ainda protegida por `DOCUMENTS_DRIVE_WRITE_ENABLED`;
- 4C verde em CI; 4D ainda não executada.
