# Central de Documentos — Status

Última atualização: 16/09/2026

## Fase atual

**Fase 4 — Sincronização segura com Drive**

Subfase atual: **4C — sincronização automática + botão de força + feedback visual por estado**.

Branch: `codex/central-docs-drive-sync-phase4`  
PR: **#201**  
Base atual: `main@d6d4c1600f71b3e915cb57e5ca51a12f01285072`

## Estado consolidado

As Fases 1, 2 e 3 estão encerradas. A Fase 4 continua aberta. As subfases 4A e 4B estão concluídas tecnicamente; a 4C está implementada e em validação final de navegador/staging antes de retomar a 4D.

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

## 4C — sincronização automática e feedback visual — implementada

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

O laboratório sintético foi atualizado para mostrar o botão e simular os cinco estados sem acessar APIs reais do Drive. O bundle de staging inclui os cinco PNGs e continua proibindo `googleapis.com`, `/api/documents/` e outros endpoints de produção.

Cobertura de navegador adicionada:
- cada um dos cinco arquivos é servido e possui conteúdo;
- cada valor de `data-sync-state` aponta para o PNG correspondente;
- uma mutação real do editor produz a sequência `pending → syncing → success → normal`;
- o sucesso dura aproximadamente 1 segundo;
- o botão de força é verificável no laboratório sem gravar no Drive.

### Descoberta durante CI

No head `1089e320ad01c1055a6d134040765c41d99355f8`, 24 workflows ficaram verdes e somente o workflow de navegador falhou. A falha não foi de autosync: no perfil desktop do Playwright, o canvas da miniatura interceptou o hit-test do botão de rotação usado exclusivamente para provocar uma mutação no teste. No mobile o mesmo cenário passou.

Correção aplicada em `0a0f359de5ac73044672fbfb558f8868555cd1dd`: o teste de estado visual usa clique forçado apenas nesse acionador sintético, eliminando a flutuação de hit-test sem alterar o comportamento de produção.

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

- a 4C só pode ser considerada homologada depois do workflow de navegador e do staging final verdes;
- a 4D ainda exige um PDF descartável sem dado de paciente;
- `DOCUMENTS_DRIVE_WRITE_ENABLED` não deve ser habilitado em produção antes da homologação controlada;
- conflitos de `version` continuam bloqueando sobrescrita automática e manual.

## Próxima ação exata

1. Confirmar que o workflow **Validar Central de Documentos — navegador** está verde no head atual após a correção do hit-test.
2. Confirmar o novo deployment do staging e retestar visualmente os cinco estados do botão.
3. Se aprovado, marcar 4C como homologada e iniciar 4D com PDF descartável: primeiro autosync/`save_copy` controlado, depois substituição e conflito/revisão recuperável.
4. Somente após 4D encerrar a Fase 4 e considerar merge do PR #201.
