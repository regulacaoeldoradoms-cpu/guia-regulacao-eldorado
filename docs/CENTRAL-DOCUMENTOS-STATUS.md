# Central de Documentos — Status

Última atualização: 16/09/2026

## Fase atual

**Fase 4 — Sincronização segura com Drive**

Subfase atual: **4C — correção de homologação visual: botão de força + definição da sincronização automática**.

Branch: `codex/central-docs-drive-sync-phase4`  
PR: **#201**  
Base da fase: `main@ccaa15c0c7b46dd53f7f508635079131806144b8`  
Head atual da correção de 4C: `4a2df338fb4081cc726cda7675f544de9bf15a5b`

## Correção após homologação visual humana — 16/09/2026 19:04 (America/Campo_Grande)

O usuário abriu o deployment de staging e comprovou que a tela publicada continuava visualmente igual à Fase 3: o botão esperado de sincronização não aparecia.

Diagnóstico confirmado:
- o URL de Cloudflare Pages publicado como staging usa `testing/central-docs/viewer-harness.html` como `index.html`;
- esse harness sintético não carrega `documentos/index.html` nem `js/documents.js`, exatamente onde a UI de sincronização da 4C havia sido implementada;
- portanto o link entregue para homologação visual **não demonstrava a mudança implementada**;
- no Portal real, o botão também estava condicionado a `drive.connected && drive.writeEnabled && ref && version`, de modo que o laboratório sintético jamais o exibiria;
- além disso, a implementação até aqui criou uma sincronização **manual** com escolha `save_copy/replace_pdf`; ela **não implementou a sincronização automática + botão de força como fallback** que o usuário agora esclareceu como comportamento desejado.

Correção já aplicada nesta branch:
- o controle real foi renomeado para **Forçar sincronização com Google Drive**;
- o laboratório sintético agora exibe o mesmo controle no espaço antes ocupado conceitualmente por Atualizar PDF;
- clicar nesse controle no laboratório apenas confirma visualmente a ação e informa que o ambiente sintético não grava no Drive;
- o teste Playwright passou a exigir que o botão esteja visível, use o asset self-hosted e responda ao clique sem chamada real ao Drive.

Decisão:
- **4C não está encerrada** sob o requisito esclarecido pelo usuário;
- a 4D fica suspensa até a semântica de sincronização automática ser definida e implementada com segurança;
- nenhuma escrita real foi habilitada e o PR #201 continua sem merge.

**Próxima ação exata:** validar o novo staging com o botão visível e definir o gatilho da sincronização automática (por exemplo, após período ocioso ou ao sair do editor) antes de implementar qualquer sobrescrita automática. O botão de força deve ser fallback/retry, não a única forma normal de salvar.

## Estado consolidado

As subfases **4A e 4B estão concluídas tecnicamente**. A base técnica originalmente chamada de 4C passou nos testes, porém a **4C foi reaberta** após o reteste humano porque o staging não mostrava a mudança e porque a semântica correta é sincronização automática como caminho normal, com botão de força como fallback. A Fase 4 ainda não pode ser encerrada. O gate de escrita continua desligado por padrão; nenhum documento real da Regulação foi gravado por esta implementação.

### 4A — contrato e preflight — CONCLUÍDA

Entregue:
- endpoint de preflight read-only protegido por `documents_edit`;
- leitura de metadados atuais por referência opaca;
- validação de PDF e capacidade de edição;
- comparação da `version` atual do Drive com a versão-base;
- `replace_pdf` bloqueado com `DRIVE_VERSION_CONFLICT` antes de qualquer upload;
- `save_copy` pode prosseguir mesmo quando o original mudou, pois não modifica o original;
- respostas sanitizadas, sem fileId bruto, nome, parentId ou revisionId.

Validação:
- usuário sem edição é bloqueado antes de consultar o Drive;
- conflito produz zero chamadas de upload;
- testes usam Google Drive mockado e dados sintéticos.

### 4B — transporte resumable e revisão recuperável — CONCLUÍDA TECNICAMENTE

Entregue:
- feature gate `DOCUMENTS_DRIVE_WRITE_ENABLED`, desligado por padrão;
- sessão resumable criada exclusivamente no backend;
- URI `Location` do Google armazenada cifrada e nunca exposta ao navegador;
- sessões técnicas expiram e são limpas ao desconectar o Drive;
- upload em blocos com `Content-Range` e retomada via resposta `308`;
- consulta explícita de status após interrupção/estado indeterminado;
- primeiro bloco validado por assinatura `%PDF-` antes do envio;
- substituição preserva a revisão anterior com `keepForever=true` antes de iniciar a atualização;
- sucesso só é retornado após resposta final válida do Google Drive;
- falhas 5xx não são convertidas em falso positivo;
- `save_copy` usa criação resumable e mantém o original intacto.

Decisão de segurança:
- o conteúdo PDF não é persistido em D1, logs ou PostHog;
- access token, refresh token, fileId bruto e URL da sessão resumable permanecem no backend;
- a escrita continua desabilitada até a homologação 4D.

### 4C — interface + telemetria — CONCLUÍDA TECNICAMENTE

Entregue:
- ação explícita **Sincronizar com Google Drive** no editor;
- opções **Salvar como novo** e **Substituir original**;
- nome editável para a nova cópia;
- estados de validação, geração, envio, retomada, conflito, falha e sucesso;
- `Salvo no Google Drive` só aparece depois da confirmação final do backend/Google;
- após sucesso confirmado, referência opaca, `version`, `cacheKey`, tamanho e `modifiedTime` são atualizados no estado local;
- cache documental é reaquecido somente com o resultado confirmado;
- telemetria `drive_sync_started`, `drive_sync_completed` e `drive_sync_failed` usa apenas `route`, `duration_ms`, `operation`, `size_bucket` e `status_code` quando aplicável.

Privacidade:
- nenhum evento inclui nome de arquivo, referência opaca, fileId, parentId, paciente, CPF, CNS, diagnóstico, CID ou conteúdo do PDF;
- observabilidade do cliente e do Worker continuam usando allowlist técnica.

## Validação técnica final de 4A–4C

Head: `053e313dd45cab589a70c09b529b6c18a296b99f`.

Resultado:
- **25/25 workflows do PR concluídos com sucesso**;
- **Validar Central de Documentos — Fases 1–4: sucesso**;
- **Validar governança Central de Documentos: sucesso**;
- **Validar bundle de staging da Central: sucesso**;
- **PDF.js real em Chromium: sucesso**;
- Playwright: **78 casos — 75 passed / 3 skipped esperados**, em desktop e mobile;
- Cloudflare Pages: **deploy de staging concluído com sucesso** no preview imutável `https://1d846e38.portal-regulacao-central-staging.pages.dev`;
- alias da branch: `https://codex-central-docs-drive-syn.portal-regulacao-central-staging.pages.dev`;
- nenhuma regressão conhecida em visualização, edição, flatten, exportação local, impressão, crop, desenho, objetos, reorganização ou permissões.

## Decisões e alternativas descartadas

- Não usar upload simples para substituição: mantido upload resumable para permitir retomada e estado verificável.
- Não entregar a URI resumable ao frontend: ela fica cifrada no backend para evitar vazamento de capability externa.
- Não considerar resposta intermediária ou erro de rede como salvamento: somente resposta final válida do Drive conclui a operação.
- Não substituir arquivo com `version` divergente: conflito exige reabrir/revalidar o documento.
- Não habilitar escrita automaticamente em produção/staging apenas porque os testes mockados passaram.
- Não usar documentos reais de pacientes em CI, fixtures ou staging sintético.

## Risco/bloqueio atual

A **4D exige interação humana/ambiente institucional real**. Para cumprir o critério de aceite sem risco a documentos da Regulação, é necessário escolher deliberadamente um **PDF descartável de teste**, habilitar temporariamente o gate de escrita no ambiente controlado e executar:

1. `Salvar como novo`;
2. confirmar que o novo arquivo realmente aparece no Drive;
3. em arquivo descartável, `Substituir original`;
4. confirmar a nova `version` e a revisão anterior recuperável;
5. provocar/validar conflito de versão e confirmar que a sobrescrita é bloqueada;
6. conferir `drive_sync_started/completed/failed` sem conteúdo sensível;
7. desligar/restringir o gate conforme a política de promoção definida.

Nenhuma dessas etapas deve usar documento real de paciente nem arquivo operacional importante.

## Próxima ação exata

**Executar a homologação 4D com um PDF descartável escolhido conscientemente pelo usuário/operador institucional.** Até esse teste real, o PR #201 permanece aberto, merge bloqueado e `DOCUMENTS_DRIVE_WRITE_ENABLED` deve continuar desligado.

Após a 4D ser aprovada: registrar as evidências sem conteúdo documental, encerrar formalmente a Fase 4, mesclar o PR #201 na `main` e somente então iniciar a **Fase 5 — IA documental**.

## Fase 0 — governança preservada

As decisões estruturais da Fase 0 continuam válidas e documentadas em `docs/CENTRAL-DOCUMENTOS-ARQUITETURA-V1.md`: OAuth/Drive pelo backend intermediário, menor privilégio, referências opacas, `Cache-Control: no-store` nas APIs sensíveis, controle de concorrência por `version`, política de segredos e observabilidade sem conteúdo documental. A Fase 4 não reduz nem substitui essas garantias.

## Histórico anterior

A Fase 3 — Editor PDF essencial foi homologada pelo usuário em 16/09/2026 e mesclada na `main` pelo PR #179 no commit `ccaa15c0c7b46dd53f7f508635079131806144b8`. O histórico detalhado das etapas anteriores permanece preservado no histórico Git, em `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-V1.md` e nos commits anteriores deste arquivo.

## Handoff para o próximo chat

1. Ler o Guia Mestre e este arquivo antes de alterar código.
2. Confirmar o estado real da `main`, do PR #201, da branch `codex/central-docs-drive-sync-phase4` e dos checks do head mais recente.
3. Não reiniciar 4A, 4B ou 4C: elas estão tecnicamente concluídas.
4. Não mesclar o PR #201 nem habilitar escrita real por padrão antes da 4D.
5. Para 4D, usar somente PDF descartável sem dados de paciente e ambiente institucional controlado.
6. Validar `save_copy`, `replace_pdf`, revisão recuperável, conflito e telemetria técnica; registrar evidências sem conteúdo documental.
7. Se a 4D for aprovada, encerrar formalmente a Fase 4, atualizar este status, mesclar o PR #201 e só então iniciar a Fase 5.
