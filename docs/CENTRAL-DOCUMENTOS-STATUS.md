# Central de Documentos — Status

Última atualização: 18/09/2026.

## Fase atual

**Fase 4 — Sincronização segura com Drive.** Subfase **4D — sem aceite; revogação explícita da janela antiga confirmada no D1; próximo passo: identificar e conferir o preview efetivamente servido, sem publicar ou liberar escrita.**

A **Fase 0** e as Fases **1, 2 e 3** permanecem encerradas. 4A–4C têm implementação e evidências técnicas, não aceite real da 4D. A conclusão da revogação no banco não conclui a homologação do produto.

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR **#201 aberto e sem merge**, conforme última consulta registrada, que indicou `mergeable:false`. Não houve nova consulta de PR/checks ou aprovação nesta atualização documental.
- Ref real da `main` reconferida nesta intervenção: **`cd71ad566a443cd2f89b1d98285856c22baf73d7`**. Preservar as melhorias de login/abertura/Home, incluindo PRs #202–#204 e #207. A ref Git não identifica deployment Cloudflare.
- Código congelado do reteste: **`2fee19e69e06ecd128be2b103354fc6c2fb4e431`**.
- Preview-base: **`a17473ce-ad9a-480c-8e53-901f2fcc3c92`**, configuração desarmada conferida anteriormente pelo relatório V3 do operador. Não presumir que ainda atenda o alias.

## Evidência nova — revogação confirmada, 18/09 aproximadamente 01:31 local

O operador executou o **SELECT isolado de confirmação** no Console D1 e enviou screenshot com uma linha:

| enabled | expires_at | revogada | upload_sessions |
| --- | --- | --- | --- |
| 0 | 1789675801 | 1 | 0 |

**Revogação explícita confirmada para o controle `phase4d_d7275a73110548fc8fd26125a60d6a2b`.** A linha permanece presente, desativada, com o prazo original de **17/09/2026 20:10:01 UTC — 16:10:01 em Eldorado/MS**. Nenhuma sessão dessa janela foi contada na tabela de sessões no momento da consulta. Essa contagem não atesta universalmente a ausência de requisições já aceitas pelo Google.

A evidência resolve a incerteza da tentativa anterior: às aproximadamente 01:27 o painel havia exibido apenas `This query returned no data` para o bloco UPDATE/SELECT. Aquela mensagem não permitia concluir o resultado; a nova leitura independente permite registrar enabled=0. Não inferir quantas linhas o UPDATE alterou a partir da nova tabela.

**A etapa de revogação no D1 está concluída. Não repetir UPDATE ou SELECT para confirmar novamente, não restaurar enabled=1 e não reabrir a janela antiga.** Não pedir novamente download/extração do V3, instalação do Node, consentimento OAuth ou login do Wrangler por causa de erros já superados.

Fonte: screenshot fornecido pelo operador; não execução autenticada da Cloudflare pelo assistente. Não publicar a imagem, caminhos pessoais, usuários, identificadores de arquivos ou credenciais.

## O que falta para encerrar o ambiente antigo

A revogação do controle e o gate de escrita da versão são camadas diferentes. O código congelado de `worker/homologation-4d.js` consulta o controle antes de autenticação/encaminhamento e rejeita enabled diferente de 1 ou prazo vencido. Esse contrato foi relido; a leitura do código não prova qual versão está servida agora nem o valor atual de `DOCUMENTS_DRIVE_WRITE_ENABLED` nela.

Continuam pendentes:

1. Identificar a versão associada ao alias **`central-docs-phase4d`** no Worker **`yellow-wave-d0a1guia-regulacao-ia`**.
2. Conferir a configuração dessa versão, em especial release, origens, controle e gate false, sem expor outros bindings ou valores de segredos. Preview-base validado não equivale a alias atual validado.
3. Conferir o bloqueio real da origem autorizada. Uma requisição sem Origin correto, um erro genérico ou uma página em cache não bastam para atribuir o bloqueio à revogação.

Nesta intervenção foi tentado um GET sem credenciais a `/api/documents/access` na origem pública do preview, com o Origin Pages registrado, limite de 15 s e sem seguir redirects. O ambiente do assistente retornou **ConnectionError, sem resposta HTTP**. Não há evidência nova de HTTP 403, release servido, indisponibilidade do Portal ou gate false. Não repetir a tentativa em laço. A busca de plugins não retornou Cloudflare nesta sessão; isso não é restrição permanente de disponibilidade.

## Próxima ação exata — inspeção somente leitura do Worker

O operador deve abrir **Workers & Pages → yellow-wave-d0a1guia-regulacao-ia → Deployments**, no painel Cloudflare, e enviar somente a parte da lista com IDs/datas das versões e indicação de preview/alias quando disponível. Não precisa voltar ao D1.

**Não clicar em Deploy, Rollback, Edit code, Save/Deploy nem alterar Variables/Secrets ou desativar globalmente Preview URLs.** A lista será usada para localizar a versão do preview antes de orientar a consulta de sua configuração. Ocultar e-mails de autores, segredos e informações pessoais eventualmente visíveis no print. Não assumir que a versão de produção ou a última da lista seja a de homologação.

A documentação oficial Cloudflare confirma a navegação Workers & Pages → Worker → Deployments e distingue preview versionado de alias. Como alternativa posterior, `wrangler versions list --json` pode fornecer metadados; o fonte fixado 4.133.0 limita esse comando às dez versões recentes, portanto ausência na lista não prova ausência global do alias. Não executar outro procedimento de liberação para localizar uma versão.

Depois de identificar/configurar com segurança o encerramento do preview: planejar **uma nova janela**, com identificador novo e confirmação apropriada, preservando a conta/PDF autorizados e a produção real reconferida. Não ampliar o prazo anterior nem usar --liberar-teste/V2-R1/V3 com referências vencidas. O início de nova janela não está autorizado automaticamente pelo screenshot de confirmação.

## Evidências operacionais anteriores preservadas

### Leitura do controle — 18/09/2026 01:21:54 local

O SELECT CONTROL_SQL retornou enabled=1, expires_at=1789675801, now_epoch=1789708914, same_scope=1, one_file=1, other_active_controls=0 e upload_sessions=0. A janela estava vencida havia 9 h 11 min 53 s. Isso confirmou igualdade da conta/lista com o controle anterior e um identificador textual não vazio, não inspeção do PDF. O enabled=1 dessa leitura foi substituído pelo enabled=0 confirmado às aproximadamente 01:31.

### Relatório V3 — aproximadamente 01:13 local

- Última produção informada pelo operador: deployment **`250b3d7b-9012-4073-9986-de36dd14bc3d`**, versão **`91eae913-ebaa-4550-8e88-f701f6cef777`**, **100%**. Não foi reconsultada na Cloudflare nesta intervenção. Preservar as atualizações legítimas; f8848c45/83a620d7 e 239cca88 são referências históricas, não alvos de rollback.
- matchesReviewedProduction=false: divergência da referência fixada no V3, não defeito comprovado da produção. productionStableDuringRead=true: duas observações coincidiram, sem exclusão remota transacional.
- basePreviewMatches=true: configuração do preview-base e D1 esperado passaram. Últimas versões mostradas: 91eae913 em 17/09 20:45:43.739 UTC; 6d37a098-2e74-4fcf-b91d-e8a69697391d em 20:40:05.537; f90c6da4-cfc3-4c4a-9947-6134006e744d em 19:09:37.075 UTC.
- priorAttemptAfterRead: recordExists=true, uploadAttempted=false, uploaded=false, newVersionId=null, v3MarkerExists=false, lockFileDetected=false. Esses registros locais não são inventário de uploads em outros computadores/consoles.
- Único erro: JANELA_D1 / WRANGLER_FALHOU_OU_EXCEDEU_PRAZO. A consulta faltante foi obtida depois no Console, mas a causa específica do erro genérico do subprocesso não foi diagnosticada. Não atribuir a timeout, quota, quoting ou credenciais sem evidência.
- --verificar não habilitou escrita. MODULE_NOT_FOUND anterior foi superado. Preparo local, login normal Wrangler e OAuth institucional já realizados permanecem concluídos.

## Produto e critérios de aceite pendentes

Fases 1–3: navegação/leitura Drive, PDF.js próprio, operações locais reversíveis, editor essencial, exportação e impressão aceitos. Nenhuma regressão dessas fases foi demonstrada por estes erros operacionais.

4A–4C: preflight revalida sessão, documents_edit, permissões, metadados e conflito; referências opacas; upload resumable backend/cifrado, assinatura PDF, recuperação e confirmação final obrigatória. Autosync observa revisão real com um segundo de ociosidade; zoom/navegação não enviam. Botão normal → pending → syncing → success de um segundo → normal; failed permite retry. Assets/cache-buster do pendente preservados. Confirmação de revisão anterior não comprova edição nova durante upload; X/saída/troca respeitam pendências; beforeunload é aviso, não garantia de envio após fechar.

Primeiras provas reais preservaram/recuperaram revisão e mostraram confirmação visual; envios seguintes tiveram conflito indevido. X foi corrigido/retestado. Diagnóstico base16/atual18 sem revisão externa adicional conhecida não comprovou causalidade do keepForever. Correção 2fee19e: releitura de recibo/metadados e baseline certificada na ref, vinculada a usuário/arquivo/versão/identidade/contexto/origens/controle, TTL de 30 minutos. Revisão externa inclusive com mesmos bytes continua conflito; preflight/upload não são atômicos.

Faltam provas reais de salvamentos consecutivos, edição durante upload, ausência de reenvio sem mudança, retry, fechamento com sucesso/falha, conflito externo verdadeiro, reabertura final e recuperação, seguidas de encerramento e matriz. save_copy permanece sem homologação real no wrapper restrito; replace_pdf sozinho não conclui toda a Fase 4. A reconciliação de #201 com a main é etapa própria, preservando as melhorias transversais e validando o candidato reconciliado, sem escolher automaticamente um lado do conflito.

## Isolamento e privacidade

Jamais promover `worker/homologation-4d.js` para produção. D1/OAuth são compartilhados; autenticação/capabilities reais e isolamento por host/origem, conta/PDF permitido, controle expirável/revogável e sessões. OAuth/reconexão/desconexão e rotas alheias bloqueados; replace_pdf permitido e save_copy bloqueado no wrapper.

Não registrar nomes/IDs de arquivos ou usuários, conteúdo PDF, referências/revisões, URL resumable, credenciais, CPF/CNS/CID/diagnósticos no GitHub/PostHog. Telemetria somente drive_sync_started/completed/failed e propriedades técnicas allowlisted. Ausência de logs não prova privacidade. Revogação não desfaz upload já aceito; troca de alias não revoga versões antigas. Não apagar ledger/locks, recriar tabelas, importar SQL via --file remoto ou remover guards.

## Validação e artefatos

Nesta intervenção houve conferência da nova tabela do operador, ref main, status e contrato do wrapper. Nenhum código foi alterado e nenhuma suíte do produto/V3 foi repetida para confirmar uma linha do banco. Não declarar CI verde: checks não foram reconsultados. O assistente não executou SQL remoto, upload, deploy, alteração de segredo/permissão ou mudança na main. O GET público sem credenciais não retornou resposta e não é evidência de homologação.

Artefatos históricos preservados:

- `scripts/central-docs/liberar-escrita-preview-4d-v3.mjs`, criação 89fa77590d675ce7edb5f91ddeded66405f2ce8f; SHA-256 **0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234**.
- Testes `.test.mjs`, criação 831935b932bd86d62e6d74aac1fbc70406730758; SHA-256 92c17049baaca1134651ee6bd4399e64fea3b4caec1d24d9fd6cd84acb45ec1b; CI `.github/workflows/validate-central-docs-operational-v3.yml`, criação 4018be8c23befd0591efd09d43b9a6cea36b1b0b.
- Original recebido: SHA-256 53b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5. V2-R1 documentado em 103ccd6, SHA-256 812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8; execução remota dessa revisão não confirmada e liberação suspensa.
- Preparação V3: 87 testes Node/sintaxe/três cenários SQLite registrados; SQL de revogação: cinco casos sintéticos registrados em 9c491c2; não foram reexecutados nesta intervenção. RESULTADOS registra para 2fee19e 274/274 testes Worker e 75 passed/3 skipped de navegador, não novos resultados do head atual.
- As proteções do V3 e seus limites permanecem documentados no histórico: herança restrita por nome, multipart, lock/registro/marcador antes de tentativa, confirmação/revalidação, sem exclusão remota transacional. O modo de liberação continua preso à janela vencida e revogada; não usá-lo agora. O Wrangler pode reconciliar tags não versionadas no upload.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D sem aceite; Fase 0 e Fases 1–3 encerradas |
| Última ação concluída | SELECT independente recebido: enabled0, expires_at1789675801, revogada1, upload_sessions0; revogação explícita confirmada |
| Branch/PR | codex/central-docs-drive-sync-phase4; #201 aberto/sem merge conforme último registro; mergeable:false histórico |
| Main | cd71ad5, ref real reconferida; preservar login/abertura/Home |
| Último commit anterior | 5b1507c; V3 89fa775, testes831935b, CI4018be8 |
| Código/preview | Reteste2fee19e; basea17473ce validada anteriormente; alias e gate efetivamente servidos pendentes |
| Produção observada | Relato anterior91eae913/250b3d7b/100%; não reconfirmada na Cloudflare nesta etapa |
| Janela | Vencida e agora explicitamente revogada no D1; nenhuma sessão registrada na leitura; não reutilizar |
| Decisão/porquê | Encerrar a etapa D1 e passar à identificação do preview, pois revogação da linha não prova gate/configuração da versão servida |
| Descartado | Repetir SQL concluído, reabilitar controle, repetir V3/download/OAuth, rollback, remover guards ou publicar para localizar preview |
| Ações externas | Operador confirmou revogação via SELECT; assistente tentou GET público sem credenciais, sem resposta HTTP; sem escrita externa além da documentação GitHub |
| Testes/checks | Leitura de evidência e código; sem suíte reexecutada ou novo CI declarado |
| Bloqueios | Consulta pública do ambiente retornou ConnectionError; busca atual de plugins sem Cloudflare; dependência de leitura do painel para configuração privada |
| Riscos | D1/OAuth compartilhados; ausência de sessão não atesta todas as operações em voo; gate/alias pendentes; conflito de integração com main |
| Observabilidade | Somente flags/timestamps/contagens e referências técnicas, sem conteúdo ou identidades |
| Próxima ação exata | Receber trecho da lista de versões em Workers & Pages → Worker yellow-wave-d0a1guia-regulacao-ia → Deployments, sem clicar em Deploy/editar; localizar preview central-docs-phase4d e conferir configuração/bloqueio |
| Depois | Fechar conferência do ambiente antigo; planejar nova janela confirmada com ID novo/produção reconferida; matriz4D e reconciliação com main |
| Fontes | STATUS; Guia MestreV1.1; Dossiê/deltas relevantes; wrapper2fee19e; RESULTADOS; ISOLAMENTO; CONTINUIDADE-TARDE; PR#201 |

## Histórico recuperável

Status integral imediatamente anterior: `5b1507c7eccc12f2ad169b4fe7562220d7ade532:docs/CENTRAL-DOCUMENTOS-STATUS.md`. Histórico de revogação em 9c491c2; Console/diagnóstico em 402199d; antes f1824c7, 4d64c5d, V2-R1 em103ccd6, d36facb, V2 em9f295ca e histórico2caa479. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 preservam detalhes e critérios. Consultar o necessário sem reiniciar etapas concluídas.

Referência externa desta etapa: Cloudflare Workers, Preview URLs, seção View versioned preview URLs on the Workers dashboard; fonte workers-sdk wrangler@4.133.0, packages/wrangler/src/versions/list.ts. A documentação externa não comprova a configuração privada do ambiente do operador.
