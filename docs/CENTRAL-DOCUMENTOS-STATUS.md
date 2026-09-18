# Central de Documentos — Status

Última atualização: 18/09/2026.

## Fase atual

**Fase 4 — Sincronização segura com Drive.** Subfase **4D — sem aceite; janela antiga vencida; operador submeteu a revogação restrita no Console D1, mas o estado após a tentativa ainda não foi confirmado. Próximo passo: somente o SELECT isolado de confirmação.**

A **Fase 0** e as Fases **1, 2 e 3** permanecem encerradas. 4A–4C têm implementação e evidências técnicas, não aceite real da 4D. Não reiniciar fases, iniciar outra fase ou mesclar o PR #201 antes dos critérios de aceite.

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR **#201 aberto e sem merge**, conforme última consulta da intervenção anterior, que indicou `mergeable:false`. Não houve nova consulta de checks ou aprovação nesta atualização documental.
- Ref real da `main` reconferida nesta intervenção: **`cd71ad566a443cd2f89b1d98285856c22baf73d7`**. Preservar login/abertura/Home, inclusive PRs #202–#204 e #207. O `base_sha` antigo do objeto do PR não é a ref atual da main nem identifica produção Cloudflare.
- Código congelado do reteste: **`2fee19e69e06ecd128be2b103354fc6c2fb4e431`**.
- Preview-base: **`a17473ce-ad9a-480c-8e53-901f2fcc3c92`**, configuração desarmada conferida pelo relatório V3 do operador; isso não identifica sozinho o alias efetivamente servido agora.

## Evidência nova — tentativa de revogação, 18/09 aproximadamente 01:27 local

O screenshot do operador mostra a submissão do bloco anterior contendo `UPDATE ... SET enabled = 0 ...; SELECT ...;` no Console D1. A resposta exibida é **This query returned no data**, sem tabela de confirmação nem quantidade de linhas alteradas visível. Não há mensagem de erro explícita no trecho apresentado.

A tabela com enabled=1 no alto do screenshot pertence à consulta anterior, com now_epoch=1789708914. Não tratá-la como leitura posterior ao UPDATE. Também não interpretar a mensagem sem dados como confirmação de sucesso, falha, exclusão da linha ou prova de que o SELECT foi executado/exibido. A imagem não permite distinguir esses estados.

**Estado da ação: tentativa de alteração submetida pelo operador; efeito ainda não confirmado.** A instrução anterior de executar o bloco com UPDATE não é mais a próxima ação. Não repetir o UPDATE nem restaurar enabled=1. Prosseguir apenas com leitura independente para recuperar o estado real, mantendo a janela vencida.

Fonte: screenshot fornecido pelo operador. Não foi execução autenticada da Cloudflare pelo assistente. Não publicar a imagem, caminho pessoal, usuário, fileId ou credenciais no repositório.

## Próxima ação exata — executar apenas este SELECT no mesmo Console D1

No banco `portal-regulacao-users`, substituir apenas o texto do campo de entrada SQL pela consulta abaixo e executar **um único SELECT**, sem incluir novamente o UPDATE. Não é necessário apagar o histórico de resultados, baixar arquivos, usar PowerShell, reinstalar ferramentas ou repetir OAuth.

```sql
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

A consulta é a mesma conferência já preparada, agora isolada. Retorna apenas flags, prazo e contagem; não altera dados nem projeta identidades. Esperado se a revogação estiver confirmada e sem sessões: **enabled=0, expires_at=1789675801, revogada=1, upload_sessions=0**.

- Se esse resultado vier, registrar revogação explícita da linha confirmada pelo operador; ainda faltará conferir bloqueio e configuração/gate false do preview efetivamente servido.
- Se enabled=1, prazo diferente, sessões, erro ou nenhum resultado: não remover condições, repetir mutação, recriar a linha ou declarar encerramento. Registrar o resultado e investigar somente por leitura.
- Não concluir ausência universal de operações em voo apenas pela contagem de sessões. Revogação não desfaz upload já aceito.

A consulta ainda não foi executada/confirmada nesta intervenção. Nenhum novo UPDATE, upload, alteração de main/código/V3, permissões ou segredo foi realizado pelo assistente. Esta atualização modifica somente o status na branch de trabalho. Não foram repetidos testes do produto nem os cinco testes sintéticos anteriores de SQL; não há mudança no SELECT.

## Evidências anteriores preservadas

### Leitura real do controle — 18/09/2026 01:21:54 local

O SELECT CONTROL_SQL retornou uma linha no Console D1:

| enabled | expires_at | now_epoch | same_scope | one_file | other_active_controls | upload_sessions |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1789675801 | 1789708914 | 1 | 1 | 0 | 0 |

Prazo: **17/09/2026 20:10:01 UTC (16:10:01 em Eldorado/MS)**. Relógio da consulta: **18/09/2026 05:21:54 UTC (01:21:54 local)**; vencida havia 9 h 11 min 53 s. same_scope=1 confirma a igualdade da conta/lista com o controle anterior pela comparação SQL; one_file=1 confirma um identificador textual não vazio. Não é inspeção do PDF. Outros controles habilitados e não expirados=0 e sessões dessa janela=0 naquele instante, não inventário universal de operações externas.

O código congelado controlFor() rejeita enabled diferente de 1 ou prazo vencido. Expiração comprovada no D1 não atesta gate false em todas as versões nem o wrapper atendendo o alias. O UPDATE restrito orientado anteriormente exigia identificador exato, enabled=1, prazo original vencido e ausência de sessões. Seu texto integral e cinco casos sintéticos de validação permanecem no status em `9c491c2f0b4f85e0e381ca448c61515d98da3fb5`. Não reenviá-lo como próximo passo após a tentativa ambígua.

### Relatório V3 — aproximadamente 01:13 local

- Produção informada pelo operador: deployment **`250b3d7b-9012-4073-9986-de36dd14bc3d`**, versão **`91eae913-ebaa-4550-8e88-f701f6cef777`**, **100%**. Preservar; f8848c45/83a620d7 e 239cca88 são referências históricas, não alvos de rollback.
- matchesReviewedProduction=false identifica divergência da referência fixada no V3, não defeito da produção. productionStableDuringRead=true significa que as duas observações do relatório coincidiram, sem exclusão remota transacional.
- basePreviewMatches=true: configuração do preview-base e D1 esperado passaram. Últimas versões mostradas: 91eae913 em 17/09 20:45:43.739 UTC; 6d37a098-2e74-4fcf-b91d-e8a69697391d em 20:40:05.537; f90c6da4-cfc3-4c4a-9947-6134006e744d em 19:09:37.075 UTC.
- priorAttemptAfterRead: recordExists=true, uploadAttempted=false, uploaded=false, newVersionId=null, v3MarkerExists=false, lockFileDetected=false. Esses campos locais não são inventário de uploads em outros computadores/consoles.
- Único erro: JANELA_D1 / WRANGLER_FALHOU_OU_EXCEDEU_PRAZO. O V3 usa o mesmo código para falha de subprocesso/saída diferente de zero. O SELECT posterior funcionou no Console: a leitura faltante foi concluída, mas a causa específica no Wrangler não foi diagnosticada. Não atribuir a timeout, quota, quoting, sintaxe ou credenciais sem evidência.
- Nenhuma escrita foi habilitada pelo modo --verificar. MODULE_NOT_FOUND foi superado. Preparo local, login normal do Wrangler e OAuth institucional já realizados não devem ser repetidos.

As consultas produtivas não foram refeitas nesta intervenção; a main não prova o conteúdo do deployment Cloudflare. Disponibilidade de conectores deve ser conferida quando necessária; buscas anteriores sem Cloudflare não são restrições permanentes.

## Produto, critérios e privacidade

Fases 1–3: navegação/leitura Drive, PDF.js próprio, operações locais reversíveis, editor essencial, exportação e impressão aceitos. Nenhuma regressão dessas fases foi demonstrada pelos erros operacionais.

4A–4C: preflight revalida sessão, documents_edit, permissões, metadados e conflito; referências opacas; upload resumable backend/cifrado, assinatura PDF, recuperação e confirmação final obrigatória. Autosync observa revisão real com um segundo de ociosidade; zoom/navegação não enviam. Botão normal → pending → syncing → success de um segundo → normal; failed permite retry. Assets e cache-buster do pendente preservados. Confirmação de revisão anterior não comprova edição nova durante upload. X/saída/troca respeitam pendências; beforeunload é aviso, não garantia de envio após fechar.

Primeiras provas reais preservaram/recuperaram revisão e mostraram confirmação visual; envios seguintes tiveram conflito indevido. X foi corrigido/retestado. Diagnóstico base16/atual18 sem revisão externa adicional conhecida não comprovou causalidade do keepForever. Correção 2fee19e: releitura de recibo/metadados e baseline certificada na ref, vinculada a usuário/arquivo/versão/identidade/contexto/origens/controle, TTL de 30 minutos. Revisão externa inclusive com mesmos bytes continua conflito; preflight/upload não são atômicos.

Faltam provas reais de salvamentos consecutivos, edição durante upload, ausência de reenvio sem mudança, retry, fechamento com sucesso/falha, conflito externo verdadeiro, reabertura final e recuperação, seguidas de encerramento e matriz. save_copy permanece sem homologação real no wrapper restrito; replace_pdf sozinho não conclui toda a Fase 4.

Jamais promover `worker/homologation-4d.js` para produção. D1/OAuth compartilhados; autenticação/capabilities reais e isolamento por host/origem, conta/PDF permitido, controle expirável/revogável e sessões. OAuth/reconexão/desconexão e rotas alheias bloqueados; replace_pdf permitido e save_copy bloqueado no wrapper.

Não registrar nomes/IDs de arquivos ou usuários, conteúdo PDF, referências/revisões, URL resumable, credenciais, CPF/CNS/CID/diagnósticos no GitHub/PostHog. Telemetria somente drive_sync_started/completed/failed e propriedades técnicas allowlisted. Ausência de logs não prova privacidade.

Antes de nova janela: confirmar revogação, bloqueio e configuração/gate false do preview efetivamente servido; reconciliar produção/dependências e possíveis operações em voo; obter confirmação apropriada e identificador novo. Não ampliar prazo/escopo nem reusar controle vencido. Não executar --liberar-teste/V2-R1/V3 com prazo ou referências antigos. Não apagar ledger/locks, recriar tabelas, importar SQL via --file remoto ou remover guards. A reconciliação de #201 com main é etapa própria, preservando melhorias transversais e checks do candidato, sem escolher automaticamente um lado do conflito.

## Artefatos e validações históricas

V3 sem alteração: `scripts/central-docs/liberar-escrita-preview-4d-v3.mjs`, criação 89fa77590d675ce7edb5f91ddeded66405f2ce8f; testes `.test.mjs`, criação 831935b932bd86d62e6d74aac1fbc70406730758; CI `.github/workflows/validate-central-docs-operational-v3.yml`, criação 4018be8c23befd0591efd09d43b9a6cea36b1b0b.

Hashes registrados: V3 `0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234`; testes `92c17049baaca1134651ee6bd4399e64fea3b4caec1d24d9fd6cd84acb45ec1b`; original recebido `53b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5`. Retomada paralela V2-R1 documentada em 103ccd63a14f91963ff511112091002ce95c21fa, executável `812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8`; execução remota não confirmada, liberação suspensa.

Evidências registradas, não reexecutadas agora: V3 87 testes locais + sintaxe/SQLite; V2-R1 31 locais; CONTROL_SQL três casos SQLite/query_only; UPDATE/SELECT restritos cinco casos SQLite sintéticos. RESULTADOS registra para 2fee19e 274/274 testes Worker e 75 passed/3 skipped no navegador. Nenhuma dessas evidências substitui a matriz real nem confirma todos os checks do head atual.

Proteções V3: histórico separado da produção, herança restrita a seis segredos por nome sem valores, multipart conferido, registro antes da tentativa, lock/marcador, revalidação e confirmação humana. Não há exclusão remota transacional ou coordenação garantida entre revisões. Wrangler versions upload também pode reconciliar tags não versionadas; --file remoto usa fluxo de importação, não simples consulta. Esses limites e os detalhes de validação permanecem no histórico.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D sem aceite; Fase 0 e Fases 1–3 encerradas |
| Última ação concluída | Screenshot de submissão UPDATE+SELECT recebido; painel exibiu This query returned no data; efeito da revogação não confirmado |
| Branch/PR | codex/central-docs-drive-sync-phase4; #201 aberto/sem merge e conflito indicado na consulta anterior |
| Main | cd71ad5, ref real reconferida nesta intervenção; preservar login/abertura/Home |
| Último commit anterior | 9c491c2; V3 89fa775, testes831935b, CI4018be8 |
| Código/preview | Reteste2fee19e; basea17473ce; alias/gate servidos não confirmados agora |
| Produção | Relato anterior91eae913/250b3d7b/100%; não reconfirmada na Cloudflare nesta intervenção |
| Janela | Prazo17/09 20:10:01UTC vencido; enabled1/sessões0 eram leitura ANTERIOR à tentativa; estado atual ainda desconhecido |
| Decisão/porquê | Ler estado com SELECT isolado, porque mensagem sem dados não comprova efeito da mutação; não reenviar UPDATE |
| Descartado | Declarar sucesso/falha sem tabela; interpretar tabela antiga como atual; repetir mutação; renovar prazo; rollback; recriar linha; novo download/OAuth |
| Testes | Nenhum teste novo nesta atualização documental; SELECT já validado, sem mudança; CI não reconsultado |
| Ações externas | Operador submeteu bloco no Console; assistente atualizou somente status na branch, sem D1/Drive/Cloudflare ou main |
| Bloqueios/riscos | Revogação sem leitura posterior; preview/gate não confirmados; D1/OAuth compartilhados; causa específica Wrangler desconhecida; conflito com main |
| Observabilidade | Flags/prazo/contagens, sem dados pessoais/documentais |
| Próxima ação exata | Receber tabela de um único SELECT isolado; esperado enabled0, expires_at1789675801, revogada1, upload_sessions0; resultado diferente/ausente exige leitura, não nova mutação |
| Depois | Confirmar bloqueio/configuração/gate false do preview; planejar nova janela com confirmação e referência real; concluir matriz4D antes da promoção |
| Fontes | STATUS; controlFor em2fee19e; Guia Mestre; Dossiê/deltas pertinentes; RESULTADOS; ISOLAMENTO; CONTINUIDADE-TARDE; PR#201 |

## Histórico e referências

O status integral anterior, incluindo o UPDATE restrito e sua validação, permanece em `9c491c2f0b4f85e0e381ca448c61515d98da3fb5:docs/CENTRAL-DOCUMENTOS-STATUS.md`. Estados anteriores: 402199d, f1824c7, 4d64c5d, V2-R1 em103ccd6, d36facb, V2 em9f295ca e histórico2caa479. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 complementam este registro. Não reiniciar etapas encerradas.

Documentação oficial D1 SQL statements confirma suporte a consultas no Console; ela não comprova qual resultado o painel exibiu neste envio multicomando. A interpretação operacional permanece limitada à evidência visível, sem diagnóstico presumido do comportamento da interface.
