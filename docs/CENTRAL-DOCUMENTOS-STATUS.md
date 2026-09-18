# Central de Documentos — Status

Última atualização: 18/09/2026.

## Fase atual

**Fase 4 — Sincronização segura com Drive.** Subfase **4D — sem aceite; V3 somente leitura executado no Windows, produção e preview-base conferidos pelo operador, consulta da janela D1 ainda sem resultado. Janela anterior vencida.**

A **Fase 0** e as Fases **1, 2 e 3** permanecem encerradas. 4A–4C têm implementação e evidências técnicas, não aceite real da 4D. Não reiniciar fases, iniciar outra fase ou mesclar o PR #201 antes dos critérios de aceite.

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR **#201 aberto e sem merge**; consulta desta intervenção retornou `mergeable:false`, head anterior à atualização documental `f1824c72983f82b214dbb15ad985672d0dea6bec`.
- Ref real da `main` reconferida: **`cd71ad566a443cd2f89b1d98285856c22baf73d7`**. Preservar as melhorias transversais de login/abertura/Home já incorporadas, inclusive PRs #202–#204 e #207. O `base_sha` antigo do objeto do PR não é a ref atual da main nem identifica produção Cloudflare.
- Código congelado do reteste: **`2fee19e69e06ecd128be2b103354fc6c2fb4e431`**.
- Preview-base: **`a17473ce-ad9a-480c-8e53-901f2fcc3c92`**, configuração desarmada conferida pelo V3. Isso não identifica, sozinho, a versão atualmente servida pelo alias.

## Evidência nova — relatório do operador em 18/09, aproximadamente 01:13 local

O screenshot mostra a parte final do relatório V3. A execução superou o erro anterior `MODULE_NOT_FOUND`. Não solicitar novamente download, extração, instalação do Node ou login OAuth por causa daquele erro já superado.

Valores visíveis no relatório:

- Produção: deployment **`250b3d7b-9012-4073-9986-de36dd14bc3d`**, versão **`91eae913-ebaa-4550-8e88-f701f6cef777`**, **100%**.
- `matchesReviewedProduction: false`: diverge da referência antiga f8848c45/83a620d7 fixada no V3. É informação de divergência, não defeito comprovado da produção nem autorização para rollback.
- `productionStableDuringRead: true`: as duas observações de deployment do relatório coincidiram. Não é uma exclusão remota transacional nem prova de estabilidade entre todas as requisições.
- `basePreviewMatches: true`: conferência da configuração do preview-base e do D1 esperado passou.
- Últimas versões mostradas: 91eae913 em 17/09 20:45:43.739 UTC; `6d37a098-2e74-4fcf-b91d-e8a69697391d` em 20:40:05.537 UTC; `f90c6da4-cfc3-4c4a-9947-6134006e744d` em 19:09:37.075 UTC.
- `priorAttemptAfterRead`: recordExists=true, uploadAttempted=false, uploaded=false, newVersionId=null, v3MarkerExists=false, lockFileDetected=false. São observações do registro/local consultado; não demonstram ausência universal de uploads por outros computadores, consoles ou procedimentos. O início do JSON não aparece integralmente no screenshot.
- Único erro listado: etapa **`JANELA_D1`**, código **`WRANGLER_FALHOU_OU_EXCEDEU_PRAZO`**. Não há resultado de prazo/escopo/contagens do D1 nesta execução.
- Rodapé informa que nenhuma escrita foi habilitada por esta execução somente leitura.

Estas são evidências recebidas do operador, não execução autenticada da Cloudflare pelo assistente. Não publicar o screenshot ou seu caminho pessoal do Windows. Não atribuir uma versão Cloudflare a um PR apenas pela proximidade dos horários.

## Diagnóstico limitado e decisão imediata

A leitura do V3 confirma que `runWrangler()` converte tanto falha de subprocesso quanto saída diferente de zero no mesmo código genérico. O relatório não comprova timeout, quota, falta de permissão, tabela ausente ou erro de SQL. A expiração da janela, por si só, não explica esse código: se a consulta tivesse retornado, seria avaliada depois por `validateWindow()`.

O SELECT passa por PowerShell e `npx.cmd`, contendo quebras de linha e percentuais de `strftime`. A documentação Microsoft aponta diferenças de tratamento de argumentos nativos/batch; isso é um ponto de fragilidade a investigar, não causalidade comprovada neste computador. Não corrigir por suposição nem pedir dump de logs/credenciais.

**Próxima ação: executar diretamente no Console do D1 o SELECT já existente em `CONTROL_SQL` do V3**, no banco institucional `portal-regulacao-users` usado no preparo. Substituir somente o texto do editor SQL pela consulta indicada, sem deixar comandos antigos de criação/alteração para executar junto. Receber apenas a tabela de resultado ou a mensagem de erro dessa consulta.

A consulta projeta exclusivamente enabled, expires_at, now_epoch, same_scope, one_file, other_active_controls e upload_sessions. Compara o usuário e a lista de arquivos somente dentro do banco, sem retorná-los. Não usa SELECT *, não cria/revoga/prorroga janela e não altera dados. Resultado vazio deve ser registrado como tal: o JOIN depende da presença dos controles atual e anterior; não presumir ambos presentes nem recriar automaticamente.

Justificativa: concluir somente a leitura que faltou e distinguir falha de acesso/SQL/banco de falha no transporte do comando Windows, sem repetir as consultas produtivas já recebidas ou criar outro executável de liberação. Um sucesso no painel não prova que as credenciais/configuração do Wrangler estejam corretas.

Descartado nesta etapa: repetir o V3 inalterado em laço; trocar UUIDs produtivos para fazê-lo passar; reinstalar ferramentas; pedir tokens/logs completos; usar `d1 execute --file` como substituto. O fonte do Wrangler 4.133.0 confirma que --file remoto usa o fluxo de importação, não apenas a API de consulta, com possíveis impactos na disponibilidade. Manter a operação como SELECT no Console, sem importação.

## Prazo e proteção de produção

A janela documentada **venceu em 17/09/2026 20:10:01 UTC — 16:10:01 em Eldorado/MS**. Não orientar `--liberar-teste`, executar V2-R1, prolongar o prazo ou criar outra janela automaticamente. Expiração pelo relógio não comprova revogação explícita da linha D1 nem gate false em todas as versões.

Preservar a implantação atual observada 91eae913/250b3d7b, sem rollback. f8848c45/83a620d7 e 239cca88 são referências históricas. Antes de qualquer futura liberação, reconciliar a produção real, dependências, possíveis tentativas/sessões e encerramento da janela antiga. Uma nova janela exige planejamento e confirmação apropriada; o identificador antigo não pode ser reutilizado.

Não houve nesta intervenção alteração de main, código do editor/V3, permissões, segredo, deployment, upload ou escrita no Drive/D1 pelo assistente. A descoberta de plugins não retornou Cloudflare nesta sessão; isso não é afirmação permanente de indisponibilidade do conector.

## Artefatos e validações preservados

O V3 permanece efetivamente versionado, sem alteração de bytes nesta intervenção:

- `scripts/central-docs/liberar-escrita-preview-4d-v3.mjs`, criação em **89fa77590d675ce7edb5f91ddeded66405f2ce8f**;
- `scripts/central-docs/liberar-escrita-preview-4d-v3.test.mjs`, criação em **831935b932bd86d62e6d74aac1fbc70406730758**;
- `.github/workflows/validate-central-docs-operational-v3.yml`, criação em **4018be8c23befd0591efd09d43b9a6cea36b1b0b**.

SHA-256 V3 reconferido localmente: **`0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234`**. Testes: `92c17049baaca1134651ee6bd4399e64fea3b4caec1d24d9fd6cd84acb45ec1b`. Original recebido: `53b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5`.

Retomada paralela V2-R1 documentada em **103ccd63a14f91963ff511112091002ce95c21fa**, executável com hash `812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8`. Seus 31 testes e entrega são registros daquela intervenção; não houve prova nova de execução remota. A orientação de liberá-lo segue suspensa.

A preparação V3 registra **87 testes Node locais**, sintaxe e três cenários SQLite. Não foram reexecutadas suites do produto ou do V3 nesta etapa documental. Foi exercitado apenas o SELECT exato em SQLite 3.46.1 de memória, com `query_only=ON`, em **três casos sintéticos**: janela vencida, sessão pendente e controle anterior ausente. Todos passaram e a consulta fez zero alterações. Isso valida a sintaxe/projeção local, não permissões nem disponibilidade no D1 real.

Arquivo local da mesma consulta: `verificar-janela-4d-console.sql`, SHA-256 **`bc34284f81ad74bc3d27f1e511dd86b708eedcb41046690da6e000af860ea5aa`**, equivalente a CONTROL_SQL mais uma quebra de linha final. Não há novo procedimento de envio nem nova revisão do V3. O resultado atual do CI não foi reconsultado nesta intervenção e não deve ser declarado verde.

## Produto e critérios ainda pendentes

Fases 1–3: navegação/leitura Drive, visualizador próprio PDF.js, operações locais reversíveis, editor essencial, exportação e impressão aceitos. Nenhuma regressão dessas fases foi demonstrada por este erro operacional.

4A–4C: preflight revalida sessão, documents_edit, permissões/metadados e conflito; referências opacas; upload resumable backend, sessão cifrada, assinatura PDF no primeiro bloco, recuperação e confirmação final obrigatória. Autosync observa revisão real e um segundo de ociosidade; zoom/navegação não enviam. Botão normal → pending → syncing → success de um segundo → normal; failed permite retry. Assets aprovados e cache-buster do pendente preservados.

Confirmação de revisão anterior não comprova edição feita durante upload. X, saída e troca de documento devem respeitar pendências; beforeunload oferece aviso, não garantia de envio após fechar o navegador.

As primeiras provas reais preservaram/recuperaram revisão e mostraram confirmação visual; envios seguintes apresentaram conflito indevido. A proteção do X foi corrigida/retestada. Diagnóstico observado: versão-base 16/atual 18 sem nova revisão externa conhecida, sem comprovação de causalidade específica do keepForever.

Correção 2fee19e: releitura do recibo/metadados e baseline certificada na ref, vinculada a usuário/arquivo/versão/identidade/contexto/origens/controle, com TTL de 30 minutos. Revisão externa, mesmo com bytes iguais, continua conflito. Não torna preflight/upload atômicos. RESULTADOS registra para essa correção **274/274 testes Worker** e **75 passed/3 skipped de navegador**; não são novos resultados do head atual.

Ainda faltam provas reais de salvamentos consecutivos com 2fee19e, edição durante upload, ausência de reenvio sem alteração, retry, fechamento com sucesso/falha, conflito externo verdadeiro, reabertura final e recuperação; depois, encerramento dos controles e matriz documentada. save_copy continua sem homologação real neste ambiente restrito. Não declarar Fase 4 plenamente concluída com base somente em replace_pdf.

## Isolamento, privacidade e encerramento

Jamais promover `worker/homologation-4d.js` para produção. O wrapper usa autenticação/capabilities reais e D1/OAuth compartilhados; isolamento depende de host/origem exatos, conta/PDF permitidos, controle expirável/revogável e sessões. OAuth/reconexão/desconexão e rotas alheias ficam bloqueados. replace_pdf permitido; save_copy bloqueado no wrapper.

Não publicar nomes/IDs de arquivos ou usuários, conteúdo de PDF, referências, revisão, URL resumable, credenciais, CPF, CNS, CID ou diagnóstico no GitHub/PostHog. Telemetria: drive_sync_started/completed/failed e propriedades técnicas allowlisted. Ausência de logs não prova privacidade.

Ao encerrar: aguardar operações em voo, revogar controle D1, conferir bloqueio e preparar gate false. Revogação não desfaz upload já aceito e troca de alias não revoga versões antigas. Esses passos externos ainda não foram comprovados para a última janela.

Proteções do V3 permanecem: histórico separado da produção, seis segredos herdados por nome sem valores, multipart estritamente conferido, gravação de tentativa antes do subprocesso, lock/marcador local, revalidação e confirmação humana. Não há exclusão remota transacional ou coordenação garantida entre revisões distintas. A comparação de deployment também não atesta todos os metadados não versionados; o Wrangler pode reconciliar tags de serviço/ambiente no upload. Não contornar qualquer proteção para cumprir prazo.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D sem aceite; Fase 0 e Fases 1–3 encerradas |
| Última ação concluída | Recebido relatório real V3: erro de localização superado, produção/preview-base conferidos, somente JANELA_D1 falhou; SELECT local validado para consulta direta |
| Branch/PR | codex/central-docs-drive-sync-phase4; #201 aberto/sem merge; mergeable:false na consulta desta etapa |
| Main | cd71ad5, ref real reconferida; preservar melhorias de login/abertura/Home |
| Commits/artefatos | V3 89fa775; testes 831935b; CI 4018be8; histórico imediatamente anterior f1824c7 |
| Código/preview | 2fee19e; base a17473ce validada pelo relatório; alias efetivamente servido não confirmado |
| Produção observada | 91eae913-ebaa-4550-8e88-f701f6cef777 / 250b3d7b-9012-4073-9986-de36dd14bc3d / 100%, relato do operador; duas leituras coincidentes |
| Tentativa local | Após leitura: uploadAttempted=false, uploaded=false, ID novo nulo, sem marcador V3/lock; não equivale a inventário global remoto |
| Janela | Prazo histórico 17/09 20:10:01 UTC vencido; estado D1, sessões e revogação ainda não conferidos |
| Decisão/justificativa | Completar só a consulta faltante via Console D1, evitando repetir transporte Windows e preservando produção/privacidade |
| Descartado | Novo upload, rollback, alteração de UUID/prazo, --file remoto/importação, apagar ledger/locks, recriar banco ou repetir OAuth |
| Testes | Nesta etapa: SELECT exato, 3 casos SQLite em memória/query_only, zero alterações; 87 V3 e suites do produto somente históricos; CI não reconsultado |
| Ações externas | Operador executou leitura V3; assistente não executou Cloudflare/D1/Drive autenticados; sem mudança de código ou produção |
| Bloqueio | Código genérico do subprocesso não revela causa real da falha D1 |
| Riscos | D1/OAuth compartilhados, estado remoto incompleto, janela vencida, concorrência, cache e conflito de integração com main |
| Observabilidade | Somente metadados/flags/contagens técnicos; sem dados pessoais/documentais |
| Próxima ação exata | Receber tabela ou erro do SELECT CONTROL_SQL executado no Console do D1 portal-regulacao-users; conferir prazo/escopo/sessões e planejar encerramento, sem liberar janela vencida |
| Fontes | STATUS; V3/CONTROL_SQL; Guia Mestre; Dossiê/deltas; RESULTADOS; ISOLAMENTO; CONTINUIDADE-TARDE; PR #201 |

## Histórico e referências

Histórico integral anterior: `f1824c72983f82b214dbb15ad985672d0dea6bec:docs/CENTRAL-DOCUMENTOS-STATUS.md`. Retomadas: 4d64c5d, V2-R1 em 103ccd6, d36facb, V2 em 9f295ca, histórico operacional em 2caa479. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 preservam os detalhes e critérios. Ler o necessário à próxima ação, sem reiniciar etapas encerradas.

Fontes técnicas consultadas para esta decisão: Cloudflare workers-sdk, tag wrangler@4.133.0, `packages/wrangler/src/d1/execute.ts` (tratamento de erros e diferença command/file); Microsoft Learn, about_Parsing (argumentos nativos/batch); Cloudflare D1 Getting started (Console/Execute no painel). Nenhuma dessas fontes comprova por si só a causa do erro no computador do operador.
