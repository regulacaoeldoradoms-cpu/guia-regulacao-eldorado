# Central de Documentos — Status

Última atualização: 18/09/2026.

## Fase atual

**Fase 4 — Sincronização segura com Drive.** Subfase **4D — sem aceite; leitura da janela D1 concluída pelo operador no Console; janela vencida, ainda enabled=1, sem sessões registradas. Próximo passo: revogação explícita restrita e confirmação, ainda não executadas.**

A **Fase 0** e as Fases **1, 2 e 3** permanecem encerradas. 4A–4C têm implementação e evidências técnicas, não aceite real da 4D. Não reiniciar fases, iniciar outra fase ou mesclar o PR #201 antes dos critérios de aceite.

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR **#201 aberto e sem merge**; consulta desta intervenção retornou `mergeable:false`, head anterior à atualização documental `402199d10369718e86e9901d61ee8ed21fcb2b1b`.
- Ref real da `main` reconferida: **`cd71ad566a443cd2f89b1d98285856c22baf73d7`**. Preservar as melhorias transversais de login/abertura/Home já incorporadas, inclusive PRs #202–#204 e #207. O `base_sha` antigo do objeto do PR não é a ref atual da main nem identifica produção Cloudflare.
- Código congelado do reteste: **`2fee19e69e06ecd128be2b103354fc6c2fb4e431`**.
- Preview-base: **`a17473ce-ad9a-480c-8e53-901f2fcc3c92`**, configuração desarmada conferida pelo V3. Isso não identifica, sozinho, a versão atualmente servida pelo alias.

## Evidência nova — Console D1, 18/09/2026 01:21:54 local

O operador executou o SELECT CONTROL_SQL no Console do D1 e enviou screenshot da tabela. Leitura bem-sucedida, com uma linha e estes valores:

| enabled | expires_at | now_epoch | same_scope | one_file | other_active_controls | upload_sessions |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1789675801 | 1789708914 | 1 | 1 | 0 | 0 |

Conversão dos timestamps: expires_at = **17/09/2026 20:10:01 UTC (16:10:01 em Eldorado/MS)**; now_epoch = **18/09/2026 05:21:54 UTC (01:21:54 local)**. A janela estava vencida havia 9 h 11 min 53 s no instante da consulta, sem extensão do prazo original.

- same_scope=1: igualdade da conta e da lista com o controle anterior, conforme a comparação da consulta; não é uma nova auditoria de identidade.
- one_file=1: a lista contém um único identificador textual não vazio, preservando o escopo registrado do descartável. Não houve abertura/inspeção do PDF nesta consulta.
- other_active_controls=0: nenhum outro controle simultaneamente habilitado e não expirado foi contado naquela tabela/instante.
- upload_sessions=0: nenhuma sessão registrada para esta janela naquela tabela/instante. Isso não é prova universal de ausência de requisições já encaminhadas ao Google.
- enabled=1: a linha ainda não foi explicitamente revogada. No código congelado, controlFor() rejeita enabled diferente de 1 **ou** expires_at vencido. A leitura real prova expiração no D1; não comprova gate false em todas as versões nem qual wrapper atende o alias neste momento.

A consulta retornou via painel: não há evidência de erro de sintaxe do SELECT ou ausência dessas tabelas nesse acesso. Isso **não** resolve nem identifica a causa específica de WRANGLER_FALHOU_OU_EXCEDEU_PRAZO no Windows. Não concluir que foi timeout, quota ou quoting. Não repetir download, extração, instalação, OAuth ou o V3 completo para obter novamente essa leitura já concluída.

Fonte: resultado fornecido pelo operador, não execução autenticada da Cloudflare pelo assistente. Não publicar o screenshot, caminho pessoal do Windows, usuários, IDs de arquivos ou credenciais.

## Próxima ação exata — encerrar explicitamente somente o controle vencido

A revogação já pertence ao procedimento de encerramento da 4D. Orientar o operador a executá-la no **mesmo banco portal-regulacao-users, Console**, sem outra liberação/edição em paralelo. Diferentemente do SELECT anterior, o primeiro comando abaixo **altera enabled de 1 para 0 em uma única linha técnica**. Não exclui registros, não muda prazo/conta/arquivos, não toca documentos no Drive e não modifica deployment. Não executar isso por importação de arquivo.

O UPDATE exige identificador exato, enabled=1, prazo original exato já vencido e ausência de sessões dessa janela. Se qualquer condição divergir, não modifica a linha. O SELECT seguinte confirma o estado observado; não se promete uma transação única entre os dois comandos.

```sql
UPDATE document_drive_homologation_controls
SET enabled = 0
WHERE control_id = 'phase4d_d7275a73110548fc8fd26125a60d6a2b'
  AND enabled = 1
  AND expires_at = 1789675801
  AND expires_at <= CAST(strftime('%s','now') AS INTEGER)
  AND NOT EXISTS (
    SELECT 1
    FROM document_drive_homologation_sessions
    WHERE control_id = 'phase4d_d7275a73110548fc8fd26125a60d6a2b'
  );

SELECT
  enabled,
  expires_at,
  CASE WHEN enabled = 0 THEN 1 ELSE 0 END AS revogada,
  (
    SELECT count(*)
    FROM document_drive_homologation_sessions
    WHERE control_id = 'phase4d_d7275a73110548fc8fd26125a60d6a2b'
  ) AS upload_sessions
FROM document_drive_homologation_controls
WHERE control_id = 'phase4d_d7275a73110548fc8fd26125a60d6a2b';
```

Receber apenas o resultado final: esperado **enabled=0, expires_at=1789675801, revogada=1, upload_sessions=0**. Se enabled permanecer 1, prazo divergir, surgir sessão, houver erro ou nenhuma linha, não remover condições nem repetir o UPDATE em laço. Inspecionar o motivo por leitura. Se houver interrupção depois de tentar o UPDATE, executar somente o SELECT para conferir, nunca presumir falha nem reenviar para garantir.

**Estado da ação: preparada/orientada, não executada nem confirmada nesta intervenção.** Não registrar revogação concluída a partir da preparação deste bloco. A alteração pretendida é restritiva e preserva a linha/histórico; eventual futura reabertura deve usar outra janela com aprovação e identificador novo, nunca restaurar enabled=1 nesta janela vencida.

Depois da confirmação: conferir o bloqueio no preview e sua configuração/gate false, sem promover wrapper ou alterar produção. Só então planejar nova janela, com confirmação apropriada, e um único procedimento baseado na produção/dependências reconferidas. A 4D continua sem aceite até a matriz real; não executar --liberar-teste, V2-R1 ou V3 de liberação com referências/prazo antigos.

## Evidências anteriores preservadas — V3 às 01:13 locais

- Produção informada pelo operador: deployment **250b3d7b-9012-4073-9986-de36dd14bc3d**, versão **91eae913-ebaa-4550-8e88-f701f6cef777**, **100%**. Preservar; não fazer rollback para f8848c45 ou 239cca88, que são históricos.
- matchesReviewedProduction=false: diverge da referência histórica fixada no V3; não é defeito comprovado da produção. productionStableDuringRead=true: as duas observações do relatório coincidiram, sem exclusão remota transacional.
- basePreviewMatches=true: configuração do preview-base e D1 esperado passaram. Não presumir que essa versão ainda atenda o alias.
- Últimas versões mostradas: 91eae913 em 17/09 20:45:43.739 UTC; 6d37a098-2e74-4fcf-b91d-e8a69697391d em 20:40:05.537; f90c6da4-cfc3-4c4a-9947-6134006e744d em 19:09:37.075 UTC.
- priorAttemptAfterRead: recordExists=true, uploadAttempted=false, uploaded=false, newVersionId=null, v3MarkerExists=false, lockFileDetected=false. O início do JSON não aparece integralmente no screenshot; esses campos locais não equivalem a inventário de uploads por outros computadores/consoles.
- A única etapa com erro foi JANELA_D1, WRANGLER_FALHOU_OU_EXCEDEU_PRAZO. O V3 transforma falha de subprocesso/saída diferente de zero no mesmo código genérico. Nenhuma escrita foi habilitada pela execução somente leitura. O resultado D1 faltante foi posteriormente obtido via Console conforme seção nova acima.
- MODULE_NOT_FOUND anterior já foi superado. Preparo local e login normal Wrangler/OAuth anteriores preservados; não repetir para continuar esta etapa.

As consultas produtivas acima não foram refeitas nesta intervenção. A evolução da main não prova o conteúdo da versão Cloudflare. Disponibilidade/autorização dos conectores deve ser conferida quando necessária; a busca anterior sem Cloudflare é histórica, não restrição permanente.

## Validação proporcional desta intervenção

Somente o UPDATE restrito e o SELECT de confirmação foram exercitados localmente em **SQLite 3.46.1 de memória, cinco casos sintéticos**, com relógio controlado: revoga apenas o alvo vencido, bloqueia prazo diferente, bloqueia sessão pendente, não reescreve linha já revogada e bloqueia janela ainda válida. Todos passaram; campos de prazo/escopo e outras linhas permaneceram iguais. Não houve banco remoto, credenciais ou documentos reais nos testes.

Não foram reexecutadas suites do produto/V3 nem declarado CI verde. Não foi executado UPDATE no D1 real pelo assistente. Referências técnicas consultadas: Cloudflare D1 SQL statements e Prepared statement methods; implementação controlFor() do wrapper no commit 2fee19e. A sintaxe validada localmente não atesta permissões/disponibilidade do Console do operador no momento da alteração.

## Artefatos e validações anteriores

V3 preservado sem alteração: `scripts/central-docs/liberar-escrita-preview-4d-v3.mjs` (criação 89fa77590d675ce7edb5f91ddeded66405f2ce8f); testes no arquivo `.test.mjs` correspondente (831935b932bd86d62e6d74aac1fbc70406730758); CI `.github/workflows/validate-central-docs-operational-v3.yml` (4018be8c23befd0591efd09d43b9a6cea36b1b0b).

SHA-256 V3: **0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234**. Testes: 92c17049baaca1134651ee6bd4399e64fea3b4caec1d24d9fd6cd84acb45ec1b. Original recebido: 53b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5. São identificações anteriores, não novos hashes de código modificado nesta etapa.

Retomada paralela V2-R1 documentada em 103ccd63a14f91963ff511112091002ce95c21fa, executável 812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8. Seus 31 testes/entrega pertencem àquela intervenção; execução remota não confirmada. Orientação de liberação permanece suspensa.

Preparação V3: 87 testes Node locais, sintaxe e três cenários SQLite; não representam homologação real. A intervenção anterior validou CONTROL_SQL em três casos SQLite/query_only, sem alteração. `verificar-janela-4d-console.sql` foi registrado com SHA-256 bc34284f81ad74bc3d27f1e511dd86b708eedcb41046690da6e000af860ea5aa. Essa leitura já foi concluída pelo operador, não é a próxima tarefa.

Proteções de liberação do V3 permanecem: histórico separado da produção, herança restrita a seis segredos por nome, multipart conferido, registro antes da tentativa, lock/marcador, revalidação e confirmação humana. Não há exclusão remota transacional nem coordenação garantida entre revisões; Wrangler versions upload também pode reconciliar tags não versionadas. O modo de liberação continua preso à janela vencida e não deve ser usado agora. Não usar --file remoto como substituto do SELECT: o fonte Wrangler 4.133.0 confirma fluxo de importação com impactos possíveis na disponibilidade.

## Produto e critérios ainda pendentes

Fases 1–3: navegação/leitura Drive, PDF.js próprio, operações locais reversíveis, editor essencial, exportação e impressão aceitos. Nenhuma regressão dessas fases foi demonstrada pelos erros operacionais.

4A–4C: preflight revalida sessão, documents_edit, permissões/metadados/conflito; referências opacas; upload resumable backend/cifrado, assinatura PDF, recuperação e confirmação final. Autosync observa revisão real com um segundo de ociosidade; zoom/navegação não enviam. Estados normal → pending → syncing → success de um segundo → normal; failed permite retry. Assets e cache-buster do pendente preservados. Confirmação de revisão anterior não comprova edição nova durante upload. X, saída/troca de documento respeitam pendências; beforeunload é aviso, não garantia de envio após fechar.

Primeiras provas reais preservaram/recuperaram revisão e mostraram confirmação visual; envios seguintes tiveram conflito indevido. X foi corrigido/retestado. Diagnóstico base16/atual18 sem revisão externa adicional conhecida não comprovou causalidade do keepForever. Correção 2fee19e: releitura do recibo/metadados e baseline certificada na ref, vinculada a usuário/arquivo/versão/identidade/contexto/origens/controle, TTL30min. Revisão externa inclusive com mesmos bytes continua conflito; preflight/upload não se tornam atômicos.

RESULTADOS registra para essa correção 274/274 testes Worker e 75 passed/3 skipped de navegador, não novos resultados do head atual. Faltam provas reais de salvamentos consecutivos, edição durante upload, ausência de reenvio sem alteração, retry, fechamento com sucesso/falha, conflito externo verdadeiro, reabertura final e recuperação, seguidas de encerramento e matriz. save_copy permanece sem homologação real no wrapper restrito; replace_pdf sozinho não conclui toda a Fase 4.

## Isolamento, privacidade e encerramento

Jamais promover `worker/homologation-4d.js` para produção. Autenticação/capabilities reais, D1/OAuth compartilhados; isolamento por host/origem, conta/PDF permitido, controle revogável/expirável e sessões. OAuth/reconexão/desconexão/rotas alheias bloqueados; replace_pdf permitido e save_copy bloqueado no wrapper.

Não registrar nomes/IDs de arquivos ou usuários, conteúdo PDF, referências/revisões, URL resumable, credenciais, CPF/CNS/CID/diagnósticos no GitHub/PostHog. Somente drive_sync_started/completed/failed e propriedades técnicas allowlisted. Ausência de logs não prova privacidade.

A revogação explícita do controle, confirmação de bloqueio e configuração/gate false do preview ainda aguardam evidência. Expiração não prova encerramento integral. Revogação não desfaz upload já aceito; troca de alias não revoga versões antigas. Não ampliar prazo/escopo ou reutilizar identificador vencido. Não apagar ledger/locks, recriar tabelas ou remover condições para fazer a liberação passar.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D sem aceite; Fase 0 e Fases 1–3 encerradas |
| Última ação concluída | SELECT real no Console D1 recebido: enabled1, prazo1789675801 vencido, now1789708914, mesmo escopo/um arquivo, outros ativos0, sessões0; revogação restrita preparada e validada localmente |
| Branch/PR | codex/central-docs-drive-sync-phase4; #201 aberto/sem merge/mergeable:false, consultado nesta etapa |
| Main | cd71ad5, ref real reconferida; preservar login/abertura/Home |
| Último commit anterior | 402199d; V3 89fa775, testes831935b, CI4018be8 |
| Código/preview | 2fee19e; base a17473ce validada no relato V3; alias/gate efetivamente servidos não confirmados agora |
| Produção observada | Relato anterior 91eae913/250b3d7b/100%; não reconfirmada na Cloudflare nesta intervenção |
| Janela | Vencida em17/09 20:10:01UTC; leitura confirmou enabled1/sessões0; revogação ainda não executada/confirmada |
| Decisão/porquê | Encerrar explicitamente somente o controle vencido; preservar histórico e negar reabertura automática, antes de outra janela |
| Descartado | Repetir leituras concluídas/V3 completo, afirmar causa do erro Windows, rollback, renovar prazo, apagar dados, importar arquivo SQL, retirar guards |
| Testes | Cinco casos SQLite sintéticos do UPDATE/SELECT passaram; suites antigas não reexecutadas e CI não reconsultado |
| Ações externas | Operador concluiu SELECT Console; assistente alterou somente status na branch, sem D1/Drive/Cloudflare ou main |
| Bloqueio | Falha específica de transporte/configuração/acesso do Wrangler continua não diagnosticada; não impede encerramento via Console |
| Riscos | D1/OAuth compartilhados; ausência de sessão não atesta todas as operações em voo; preview servido/gate não confirmados; conflito com main |
| Observabilidade | Apenas flags/timestamps/contagens e referências técnicas, sem dados pessoais/documentais |
| Próxima ação exata | Receber resultado da revogação restrita e SELECT: esperado enabled0, expires_at1789675801, revogada1, upload_sessions0; erro/incerteza exige somente leitura, sem repetição cega |
| Depois | Conferir bloqueio/configuração/gate false do preview; planejar nova janela com confirmação e referência real, depois matriz4D/reconciliação com main |
| Fontes | STATUS; V3/CONTROL_SQL; controlFor em2fee19e; Guia Mestre; Dossiê/deltas; RESULTADOS; ISOLAMENTO; CONTINUIDADE-TARDE; PR#201 |

## Histórico e referências

Histórico integral imediatamente anterior: `402199d10369718e86e9901d61ee8ed21fcb2b1b:docs/CENTRAL-DOCUMENTOS-STATUS.md`; antes, f1824c7, 4d64c5d, V2-R1 em103ccd6, d36facb, V2 em9f295ca e histórico2caa479. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 preservam os detalhes e critérios. Ler o necessário à próxima ação, sem reiniciar etapas encerradas.
