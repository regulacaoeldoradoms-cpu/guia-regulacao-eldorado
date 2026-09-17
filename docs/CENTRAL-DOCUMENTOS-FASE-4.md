# Central de Documentos — Fase 4: Sincronização segura com Drive

Data de início: 16/09/2026  
Branch: `codex/central-docs-drive-sync-phase4`  
PR: `#201`

## Objetivo

Permitir que o PDF final produzido pelo editor seja sincronizado com o Google Drive institucional com confirmação real do Drive, detecção de conflito e possibilidade de recuperação.

A intenção funcional consolidada é:
- sincronização automática quando o PDF realmente muda;
- nenhuma sincronização quando não há mudança;
- botão **Forçar sincronização com Google Drive** como fallback/retry e indicador de estado;
- sucesso visual somente depois da confirmação final do Google Drive.

## Regras permanentes

- sessão do Portal + capability `documents_edit` são revalidadas no Worker;
- refresh token, client secret, access token Google permanente, fileId bruto e URI resumable não chegam ao navegador;
- conteúdo PDF, nome do arquivo, fileId, pasta, paciente e dados clínicos não entram no PostHog;
- substituir exige comparação da `version` atual do Drive com a versão-base;
- conflito de versão interrompe a sobrescrita;
- a revisão anterior deve permanecer recuperável antes de substituir;
- upload interrompido/indeterminado nunca é apresentado como “salvo”;
- testes automatizados usam somente dados sintéticos;
- escrita real depende de `DOCUMENTS_DRIVE_WRITE_ENABLED` e permanece bloqueada até homologação controlada.

## 4A — preflight e conflito — CONCLUÍDA

Implementado:
- metadados atuais do Drive por referência opaca;
- validação de PDF, capacidade de edição e versão-base;
- detecção de conflito antes de escrita;
- diferenciação entre `replace_pdf` e `save_copy`;
- resposta sanitizada sem fileId bruto, nome, parentId ou revisionId;
- testes com Google Drive mockado.

Critério comprovado:
- versão divergente bloqueia `replace_pdf` com `DRIVE_VERSION_CONFLICT` e zero upload;
- usuário sem `documents_edit` é bloqueado no Worker;
- respostas não expõem identificadores brutos do Drive.

## 4B — resumable + revisão recuperável — CONCLUÍDA TECNICAMENTE

Implementado:
- sessão resumable criada no backend;
- URI Google cifrada e nunca entregue ao navegador;
- upload em blocos com `Content-Range`;
- tratamento de `308` e consulta explícita de status;
- assinatura `%PDF-` validada no primeiro bloco;
- revisão anterior preservada com `keepForever=true` antes de `replace_pdf`;
- conclusão somente após resposta final válida do Drive;
- erro temporário/indeterminado não produz falso sucesso;
- `save_copy` cria novo PDF sem modificar o original.

## 4C — autosync + interface + telemetria — IMPLEMENTADA, AGUARDANDO HOMOLOGAÇÃO VISUAL FINAL

### Gatilho de autosync

A sessão do editor possui uma `revision`. O Portal observa essa revisão a cada 200 ms apenas para detectar que houve uma mutação real.

Quando a revisão muda:
- o botão entra em `pending`;
- é iniciado um período ocioso de 1 segundo;
- cada nova alteração reinicia essa espera;
- depois de 1 segundo sem novas mudanças, é iniciada a sincronização automática da revisão mais recente.

Se a revisão não mudar, não há upload. Navegação, zoom e permanência ociosa no documento não criam sincronizações.

### Concorrência entre edições e upload

Se o usuário editar novamente enquanto uma revisão anterior está sendo enviada:
- o upload em andamento pode concluir;
- essa confirmação não é tratada como confirmação da revisão mais nova;
- a nova revisão permanece pendente;
- uma nova sincronização é agendada automaticamente.

### Feedback visual do botão

Assets aprovados e enviados pelo usuário:
- `Drive_normal.png` → estado `normal`;
- `Drive_pendente.png` → estado `pending`;
- `Drive_sincronizando.png` → estado `syncing`;
- `Drive_sincronizado_1seg.png` → estado `success` por 1 segundo;
- `Drive_falha.png` → estado `failed`.

Fluxo nominal:

`normal → pending → syncing → success (1 s) → normal`

Fluxo de erro:

`normal → pending → syncing → failed`

O botão usa `data-sync-state` para alternar os PNGs. O estado `success` dura `DRIVE_SYNC_SUCCESS_VISIBLE_MS = 1000` e só aparece após a confirmação final do Drive.

### Forçar sincronização

O botão permanece clicável como fallback/retry:
- se uma tentativa automática falhou, o clique tenta novamente a revisão atual;
- se há uma revisão pendente, força a tentativa sem esperar o debounce;
- se a revisão atual já está confirmada, não cria artificialmente outra alteração no PDF.

### Telemetria

Mantidos somente:
- `drive_sync_started`;
- `drive_sync_completed`;
- `drive_sync_failed`.

As propriedades continuam restritas a dados técnicos allowlisted. Nome, conteúdo, referência, IDs brutos e dados clínicos não são enviados.

### Staging

O laboratório sintético:
- inclui os cinco PNGs;
- simula todos os estados sem API de produção;
- reproduz a sequência de autosync a partir de uma mutação sintética;
- continua bloqueando endpoints Google e `/api/documents/` no bundle de staging.

## 4D — homologação controlada no Drive institucional — PENDENTE

Pré-condição: 4C verde no navegador + aceite visual humano do staging.

Procedimento:
1. escolher PDF descartável, sem dado de paciente e sem valor operacional;
2. habilitar temporariamente `DOCUMENTS_DRIVE_WRITE_ENABLED=true` no ambiente controlado;
3. abrir o PDF e fazer uma edição simples;
4. confirmar `pending → syncing → success → normal` com sincronização automática;
5. confirmar a alteração real no Drive;
6. testar falha/retry com o botão de força;
7. testar substituição com revisão anterior recuperável;
8. provocar conflito de `version` e confirmar bloqueio da sobrescrita;
9. conferir telemetria técnica sem conteúdo sensível;
10. registrar homologação e decidir estado final do feature gate.

## Fora de escopo

- IA documental (Fase 5);
- renomear/mover/excluir arquivos fora do fluxo necessário de salvamento;
- automações destrutivas;
- ampliar permissões documentais;
- enviar conteúdo documental ao PostHog;
- usar documentos reais de pacientes em CI, staging ou fixtures.

## Gate atual

A 4C foi reaberta após o usuário apontar que o staging anterior não mostrava a nova UI e esclarecer que a sincronização automática deveria ser o caminho normal.

Essa semântica agora está implementada: autosync somente após mutação real, 1 segundo de ociosidade, botão de força como fallback e cinco estados visuais usando os PNGs aprovados.

O último bloqueio técnico observado foi um hit-test flutuante no teste Playwright desktop ao clicar no botão de rotação usado somente para provocar uma mutação. O comportamento funcional passou no mobile; o teste foi estabilizado com clique forçado apenas nesse acionador sintético.

Próximo gate: workflow de navegador verde no head reconciliado + reteste visual humano no novo staging. Depois disso, retomar 4D com PDF descartável.
