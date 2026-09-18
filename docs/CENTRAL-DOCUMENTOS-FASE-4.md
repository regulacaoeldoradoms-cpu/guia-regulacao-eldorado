# Central de Documentos — Fase 4: Sincronização segura com Drive

Data de início: 16/09/2026  
Branch: `codex/central-docs-drive-sync-phase4`  
PR: `#201`

## Continuidade conferida em 17/09/2026

O gate continua sendo a 4D. O verde de `6f45b7c` comprova o fechamento histórico da 4C, mas uma regressão posterior em `e2a8c76` quebrou o laboratório do head `faa40f1`. A retomada restaurou o harness completo, preservando a duração sintética de 900 ms em `syncing`, sem enfraquecer testes: 180/180 testes do Worker e 75 passed / 3 skipped previstos no navegador, desktop e mobile.

O acesso Cloudflare autenticado está restabelecido. A homologação usa entrypoint exclusivo de preview com controle revogável/expirável, usuário e PDF descartável permitidos no backend; consulte `CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-ISOLAMENTO.md` e o status para o estado operacional atual. Referências abaixo à indisponibilidade do conector descrevem a sessão anterior. Os resultados sintéticos não substituem a matriz real de Drive ainda pendente.

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
- divergência de versão interrompe a sobrescrita, exceto quando prova opaca de upload previamente confirmado pelo Worker certifica a mesma revisão binária atual; essa exceção exige validação de identidade e não dispensa autenticação nem permissões;
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
- versão divergente sem prova válida de conteúdo já confirmado bloqueia `replace_pdf` com `DRIVE_VERSION_CONFLICT` e zero upload;
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

### Ajuste 4D — versão de metadados e conteúdo confirmado

Na homologação real, o diagnóstico restrito do preview registrou preflight 409 com versão-base 16 e versão atual 18 depois de um upload confirmado, sem nova revisão externa observada. O `version` do Drive inclui alterações de metadados; a causa específica de cada incremento não foi estabelecida. Reler a versão imediatamente depois do upload não basta para cobrir um incremento posterior.

A correção em validação emite uma prova opaca somente depois da confirmação final, vinculada ao conteúdo certificado pelo Worker. Em uma tentativa seguinte, a exceção para divergência de `version` exige prova válida correspondente ao usuário, arquivo e versão-base, além de nova leitura do Drive com a mesma `headRevisionId`, MD5 e tamanho. Outra revisão é conflito mesmo quando conserva os mesmos bytes. Sem prova válida, permanece a comparação estrita de versões.

A prova não autoriza acesso nem escrita por si: sessão Portal, capability, permissão atual no Drive e feature gate continuam obrigatórios. No preview, permanecem obrigatórios também controle ativo, TTL, usuário/arquivo permitidos e registro da sessão resumable. A prova não vai para diagnóstico, PostHog ou logs. Cada novo upload confirmado substitui a prova anterior usada pelo editor.

Isso não transforma o preflight e o upload em transação atômica, nem comprova por teste sintético o resultado do Drive real. Repetir a matriz 4D com duas edições sequenciais, edição durante envio e conflito de conteúdo externo antes de declarar o gate concluído. O schema e o escopo do diagnóstico temporário estão em `CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-ISOLAMENTO.md`.

## 4C — autosync + interface + telemetria — CONCLUÍDA TECNICAMENTE

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

### Proteção ao sair do editor

- se a revisão atual ainda não foi confirmada, clicar em **Fechar** cancela o debounce e força a sincronização imediatamente;
- o editor só fecha depois que a revisão atual estiver confirmada;
- falha ou conflito mantém o editor aberto, preservando o estado local para retry;
- enquanto um upload está em andamento, o controle de fechamento permanece indisponível;
- fechamento/recarregamento da aba com alteração pendente ou upload em andamento aciona proteção de `beforeunload`.

### Telemetria

Mantidos somente:
- `drive_sync_started`;
- `drive_sync_completed`;
- `drive_sync_failed`.

As propriedades continuam restritas a dados técnicos allowlisted. Nome, conteúdo, referência, IDs brutos e dados clínicos não são enviados.

### Validação final da 4C

Head funcional validado: `6f45b7ca5d9cccf884c6dca2c964367dc0671bcd`.

Resultado:
- Fases 1–4: verde;
- bundle de staging: verde;
- governança: verde;
- navegador/PDF.js real em Chromium: verde;
- Playwright: **78 casos, 75 passed e 3 skipped esperados**, desktop e mobile.

As falhas anteriores eram incompatibilidades do teste com o harness atual (IDs antigos, toolbar intencionalmente oculta em Organizar, hit-test sintético e quebra responsiva mobile). Foram corrigidas somente na camada de teste, sem rollback do autosync ou da UI de produção.

### Staging

O laboratório sintético:
- inclui os cinco PNGs;
- simula todos os estados sem API de produção;
- reproduz a sequência de autosync a partir de uma mutação sintética;
- continua bloqueando endpoints Google e `/api/documents/` no bundle de staging.

## 4D — homologação controlada no Drive institucional — GATE ATUAL

Pré-condição técnica da 4C: **cumprida**.

Procedimento:
1. escolher PDF descartável, sem dado de paciente e sem valor operacional;
2. habilitar temporariamente `DOCUMENTS_DRIVE_WRITE_ENABLED=true` no ambiente controlado;
3. abrir o PDF e fazer uma edição simples;
4. confirmar `pending → syncing → success → normal` com sincronização automática;
5. confirmar a alteração real no Drive;
6. testar falha/retry com o botão de força;
7. testar substituição com revisão anterior recuperável;
8. confirmar continuidade com avanço apenas de metadados e prova válida; provocar alteração externa da revisão binária e confirmar bloqueio da sobrescrita;
9. conferir telemetria técnica sem conteúdo sensível;
10. registrar homologação e decidir estado final do feature gate.

A escrita real não deve ser habilitada em produção por atalho. O acesso Cloudflare foi restabelecido e a execução usa versão preview com controle revogável, sem promover deployment produtivo. Não usar credenciais, tokens ou segredos colados no chat como substituição. O estado operacional e os resultados de cada tentativa permanecem no status e no registro da homologação.

## Fora de escopo

- IA documental (Fase 5);
- renomear/mover/excluir arquivos fora do fluxo necessário de salvamento;
- automações destrutivas;
- ampliar permissões documentais;
- enviar conteúdo documental ao PostHog;
- usar documentos reais de pacientes em CI, staging ou fixtures.

## Gate atual

**4D — homologação real controlada.** A implementação e a matriz sintética da 4C estão verdes. O próximo trabalho não é acrescentar lógica de autosync: é comprovar o comportamento contra o Google Drive real em ambiente controlado, mantendo o gate desligado fora dessa homologação.

O acesso técnico e o PDF descartável estão disponíveis. O impedimento atual ao aceite é concluir a repetição da matriz real depois da correção de versões, com preservação da revisão, continuidade de edições e bloqueio de conflito externo comprovados. Registrar evidências técnicas sem conteúdo documental antes de considerar encerramento da Fase 4 e merge do PR #201.
