# Central de Documentos — Fase 4: Sincronização segura com Drive

Data de início: 16/09/2026  
Branch: `codex/central-docs-drive-sync-phase4`  
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
- nenhum teste automatizado desta fase usa documento real da Regulação.

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

### 4A — Contrato e preflight de sincronização

Escopo:
- obter metadados atuais do Drive por referência opaca;
- validar PDF, capacidade de edição e versão-base;
- detectar conflito antes de qualquer escrita;
- diferenciar `replace_pdf` e `save_copy`;
- expor somente metadados técnicos mínimos ao frontend;
- testes com Google Drive totalmente mockado.

**Nenhuma escrita real ou simulada de upload é permitida nesta subfase.**

Critério de aceite:
- substituição com versão divergente termina em conflito explícito e zero chamadas de upload;
- usuário sem `documents_edit` é bloqueado no Worker;
- resposta não contém fileId bruto nem nome do arquivo;
- testes automatizados passam.

### 4B — Transporte resumable + revisão recuperável

Escopo:
- iniciar sessão resumable no backend;
- manter a URI Google somente no backend;
- preservar a revisão anterior antes de substituir;
- transmitir bytes sem gravar PDF em D1/Cache Storage/logs;
- concluir somente após resposta final válida do Drive;
- tratar interrupção como pendente/indeterminada;
- testes de sucesso, 308, 4xx/5xx e conflito com Google mockado.

Critério de aceite:
- nenhuma resposta de sucesso ocorre sem confirmação final do Drive;
- falha/interrupção não perde o original e não gera falso positivo.

### 4C — Interface do editor + telemetria técnica

Escopo:
- ação explícita de sincronização no espaço liberado pelo antigo “Atualizar PDF”;
- escolha entre “Salvar como novo” e “Substituir original”;
- estados de progresso, conflito, falha e sucesso;
- `drive_sync_started/completed/failed` somente com propriedades allowlisted;
- invalidação/atualização do cache documental após sucesso.

Critério de aceite:
- feedback imediato;
- somente confirmação real exibe “Salvo no Drive”;
- telemetria não contém nome, referência, pasta, conteúdo ou dado clínico.

### 4D — Homologação controlada no Drive institucional

Escopo:
- validação humana com arquivo de teste deliberadamente escolhido;
- primeiro “Salvar como novo”;
- depois substituição apenas em arquivo de teste descartável e com confirmação explícita;
- confirmar revisão recuperável e conflito;
- registrar evidências sem conteúdo documental.

Critério de aceite da Fase 4:
- `drive_sync_started/completed/failed` medidos;
- save-copy e replace funcionam;
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

**4A em execução.** O primeiro incremento é deliberadamente read-only contra o Drive: somente metadados/preflight e testes mockados. Escrita real fica bloqueada até 4D.
