# Central de Documentos — Fase 4: Sincronização segura com Drive

Data de início: 16/09/2026  
Branch: `codex/central-docs-drive-sync-phase4`  
PR: `#201`  
Base inicial: `main@ccaa15c0c7b46dd53f7f508635079131806144b8`

## Objetivo

Permitir que o PDF final produzido pelo editor seja salvo no Google Drive institucional de duas formas:

1. **Salvar como novo** — cria um novo PDF sem modificar o arquivo original.
2. **Substituir original** — cria uma nova revisão do mesmo arquivo somente após validação de concorrência e possibilidade de recuperação.

Nenhum estado visual pode declarar que o arquivo foi salvo antes da confirmação real do Google Drive.

## Regras permanentes desta fase

- sessão do Portal + capability `documents_edit` são revalidadas no Worker em toda operação de sincronização;
- o navegador nunca recebe refresh token, client secret, access token Google permanente, fileId bruto ou URL de sessão resumable do Google;
- conteúdo PDF, nome de arquivo, fileId, pasta, paciente e dados clínicos nunca entram no PostHog;
- o PDF final deve ser validado antes do upload;
- substituir exige comparação da `version` atual do Drive com a versão-base aberta pelo usuário;
- conflito de versão interrompe a substituição sem upload;
- a revisão binária anterior deve permanecer recuperável antes de substituir;
- upload interrompido/indeterminado nunca é apresentado como “salvo”;
- nenhum teste automatizado desta fase usa documento real da Regulação;
- escrita real depende do feature gate `DOCUMENTS_DRIVE_WRITE_ENABLED` e permanece desligada até a homologação controlada.

## Decisão técnica confirmada em documentação oficial do Google Drive

- uploads resumable são adequados também para arquivos pequenos e recomendados quando há risco de interrupção;
- criar arquivo usa `files.create`;
- atualizar conteúdo existente usa `files.update` com `PATCH` na solicitação inicial;
- o envio de dados de uma sessão resumable usa `PUT`;
- a URI da sessão resumable vem no cabeçalho `Location`;
- revisões binárias podem receber `keepForever=true`, com limite de 200 revisões preservadas por arquivo;
- o campo `version` do arquivo continua sendo a base de detecção de concorrência definida na arquitetura da Central.

Referências oficiais verificadas em 16/09/2026:
- Google Drive API — Upload file data;
- Google Drive API — files.update;
- Google Drive API — Manage file revisions;
- Google Drive API — revisions.update.

## Subfases

### 4A — Contrato e preflight de sincronização — CONCLUÍDA

Implementado:
- metadados atuais do Drive por referência opaca;
- validação de PDF, capacidade de edição e versão-base;
- detecção de conflito antes de qualquer escrita;
- diferenciação entre `replace_pdf` e `save_copy`;
- resposta técnica sanitizada sem fileId bruto, nome do arquivo, parentId ou revisionId;
- testes com Google Drive totalmente mockado.

Critério de aceite comprovado:
- substituição com versão divergente termina em `DRIVE_VERSION_CONFLICT` e zero chamadas de upload;
- usuário sem `documents_edit` é bloqueado no Worker;
- resposta não contém identificadores brutos do Drive nem nome do arquivo;
- testes automatizados passam.

### 4B — Transporte resumable + revisão recuperável — CONCLUÍDA TECNICAMENTE

Implementado:
- sessão resumable iniciada no backend;
- URI Google cifrada no backend e nunca entregue ao navegador;
- sessões técnicas com expiração e limpeza;
- revisão anterior preservada com `keepForever=true` antes de `replace_pdf`;
- envio em blocos com `Content-Range`;
- tratamento de `308` e consulta explícita de status para retomada;
- validação da assinatura `%PDF-` no primeiro bloco;
- conteúdo PDF não é persistido em D1, Cache Storage do Worker ou logs;
- conclusão somente após resposta final válida do Drive;
- erro temporário/indeterminado não produz falso “salvo”;
- testes de sucesso, interrupção, retomada, conflito e `save_copy` com Google mockado.

Critério de aceite técnico comprovado:
- nenhuma resposta de sucesso ocorre sem confirmação final do Drive;
- falha/interrupção mantém o original e não gera falso positivo;
- escrita continua bloqueada pelo feature gate fora da homologação 4D.

### 4C — Interface do editor + telemetria técnica — CONCLUÍDA TECNICAMENTE

Implementado:
- ação explícita **Sincronizar com Google Drive** no espaço liberado pelo antigo “Atualizar PDF”;
- escolha entre **Salvar como novo** e **Substituir original**;
- campo de nome para a nova cópia;
- estados de validação, geração, envio, retomada, conflito, falha e sucesso;
- `Salvo no Google Drive` só aparece depois da confirmação final;
- atualização do estado/cache documental apenas após confirmação real;
- `drive_sync_started`, `drive_sync_completed` e `drive_sync_failed` apenas com propriedades técnicas allowlisted.

Critério de aceite técnico comprovado:
- feedback imediato e estado de progresso explícito;
- somente confirmação final exibe sucesso;
- telemetria não contém nome, referência, pasta, fileId, conteúdo ou dado clínico.

Validação do head técnico `b4fffce6c69ed85b2f69e613adc36dec9f3bf055`:
- **25/25 workflows verdes**;
- validação **Central de Documentos — Fases 1–4** verde;
- governança e bundle de staging verdes;
- **PDF.js real em Chromium** verde;
- Playwright: **78 casos — 75 passed / 3 skipped esperados**, desktop e mobile.

### 4D — Homologação controlada no Drive institucional — PENDENTE DE INTERAÇÃO HUMANA

Escopo:
- validação humana com arquivo de teste deliberadamente escolhido;
- primeiro **Salvar como novo**;
- depois **Substituir original** somente em arquivo descartável e com confirmação explícita;
- confirmar revisão recuperável e conflito;
- confirmar `drive_sync_started/completed/failed` sem conteúdo documental;
- registrar evidências técnicas sem dados do arquivo.

Procedimento obrigatório:
1. escolher um PDF descartável, sem dado de paciente e sem valor operacional;
2. habilitar temporariamente `DOCUMENTS_DRIVE_WRITE_ENABLED=true` no ambiente controlado;
3. abrir o PDF pelo Portal e editar algo simples;
4. executar **Salvar como novo** e confirmar a existência real do novo arquivo no Drive;
5. abrir um arquivo descartável de teste e executar **Substituir original**;
6. confirmar nova `version` e que a revisão anterior permaneceu recuperável;
7. alterar o arquivo no Drive em paralelo, tentar substituir a versão antiga e confirmar que o conflito bloqueia a sobrescrita;
8. conferir a telemetria técnica sem conteúdo sensível;
9. registrar a homologação e decidir o estado final do feature gate.

Critério de aceite da Fase 4:
- `drive_sync_started/completed/failed` medidos;
- save-copy e replace funcionam no Drive real;
- conflito impede sobrescrita;
- revisão anterior permanece recuperável;
- nenhum salvamento é declarado antes da confirmação do Google Drive;
- homologação humana concluída.

## Fora de escopo

- IA documental (Fase 5);
- renomear/mover/excluir arquivos fora do fluxo necessário de salvamento;
- automações destrutivas;
- ampliar permissões documentais;
- enviar conteúdo documental ao PostHog;
- usar documentos reais de pacientes em CI, staging ou fixtures.

## Gate atual

**4C reaberta após homologação visual humana.** O staging anterior publicava apenas o harness sintético da Fase 3 e não mostrava a UI nova. O harness foi corrigido para exibir **Forçar sincronização com Google Drive** sem realizar escrita real.

A intenção funcional esclarecida pelo usuário é: **sincronização automática como caminho normal; botão de força como fallback/retry quando a automática falhar**. A implementação atual ainda é manual, portanto não deve ser promovida para 4D nem mesclada como conclusão da Fase 4.

Próximo gate: definir e implementar o gatilho seguro da sincronização automática, manter conflito por `version`, revisão recuperável e confirmação final do Google, e somente então retomar 4D com PDF descartável.
