# Central de Documentos — Status

Última atualização: 18/09/2026.

## Fase atual

**Fase 4 — Sincronização segura com Drive.** Subfase **4D — sem aceite; revogação explícita da janela antiga confirmada no D1; identificação do preview efetivamente servido ainda pendente.**

A **Fase 0** e as Fases **1, 2 e 3** permanecem encerradas. 4A–4C têm implementação e evidências técnicas, não aceite real da 4D. Não reiniciar etapas encerradas nem confundir encerramento de uma autorização com homologação do produto.

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR **#201 aberto e sem merge conforme último registro**; `mergeable:false` na última consulta registrada. Não houve nova consulta de PR/checks nesta atualização documental.
- Ref real da `main` reconferida nesta intervenção: **`cd71ad566a443cd2f89b1d98285856c22baf73d7`**. Preservar as melhorias de login/abertura/Home. A ref Git não identifica deployment Cloudflare.
- Código congelado do reteste: **`2fee19e69e06ecd128be2b103354fc6c2fb4e431`**.
- Preview-base anteriormente conferido pelo relatório V3: **`a17473ce-ad9a-480c-8e53-901f2fcc3c92`**, configuração desarmada. Não presumir que ainda atenda o alias **`central-docs-phase4d`**.

## Evidência nova — tela Deployments, 18/09 aproximadamente 01:37 local

O operador abriu Workers & Pages → `yellow-wave-d0a1guia-regulacao-ia` → Deployments e forneceu screenshot.

- O quadro **Active deployment** identifica a versão curta **91eae913**. Ela coincide com a versão produtiva do relatório anterior do operador.
- O trecho visível de **Version History** mostra 91eae913, 6d37a098, f90c6da4 e c5658eaf, com mensagens de merges do Portal. A lista continua abaixo do recorte.
- **a17473ce e o alias central-docs-phase4d não aparecem no trecho visível.** Isso não prova ausência da versão/alias no histórico nem autoriza escolher a última versão como preview.
- Há um aviso **Latest build failed**. O screenshot não contém detalhes desse build: causa, branch, commit e relação com a 4D permanecem desconhecidos. Não atribuir a falha à revogação D1, ao editor, à última versão ativa ou aos testes. Não declarar indisponibilidade da produção nem acionar retry/deploy para investigar.
- Os percentuais e métricas do quadro não serão usados para inferir mudança da alocação produtiva. O último snapshot explícito de deployment continua sendo o relatório Wrangler anterior (91eae913/250b3d7b/100%); não é uma nova consulta autenticada nesta intervenção.

Fonte: screenshot fornecido pelo operador. Não publicar a imagem, autoria pessoal, e-mails, caminhos, credenciais ou dados documentais no repositório. Esta intervenção altera somente documentação na branch.

## Próxima ação exata — localizar a linha do preview, somente leitura

Na mesma aba **Deployments**, rolar mais para baixo em **Version History** e procurar **a17473ce** ou uma linha identificada como **Central Docs 4D / central-docs-phase4d**. A17473ce é somente a referência de preview-base, não confirmação do alias atual.

Ao localizar a linha, abrir **somente o menu de três pontos dessa linha** e enviar o recorte com ID, descrição e menu aberto; não escolher ações de publicação. Se a referência não aparecer, enviar a parte inferior da lista e eventual paginação. Não presumir nomes/opções de menu que ainda não foram exibidos. O objetivo é orientar a visualização dos detalhes da versão correta, não editar a produção.

**Não clicar em Deploy, Rollback, Edit code, Retry build, Save/Deploy; não alterar Bindings/Variables/Secrets nem desativar Preview URLs globalmente.** Não voltar ao D1, repetir V3/download/instalação/OAuth ou executar scripts de liberação para localizar uma versão.

A documentação oficial Cloudflare de Preview URLs confirma a navegação pela aba Deployments e distingue URLs por versão de aliases que podem apontar para versões. Ela não comprova o vínculo atual deste ambiente. O menu específico do painel não foi inspecionado. Como alternativa posterior existe listagem somente leitura do Wrangler; o fonte fixado 4.133.0 limita `versions list` às dez versões recentes, portanto ausência nessa listagem não prova ausência global.

Depois de localizar: conferir a associação do alias e a configuração da versão (release, origens, controle e `DOCUMENTS_DRIVE_WRITE_ENABLED=false`), sem expor outros bindings ou valores de segredos; confirmar o bloqueio real da origem autorizada. Falha sem Origin correto, erro genérico, marcador de release isolado ou página cacheada não comprovam revogação/gate. Só então planejar outra janela com identificador novo e confirmação apropriada, preservando conta/PDF autorizados e produção/dependências reconferidas. Nenhuma nova janela ou liberação foi autorizada por este screenshot.

## Etapa D1 concluída — não repetir

O SELECT isolado do operador, aproximadamente às 01:31 locais de 18/09, confirmou:

| enabled | expires_at | revogada | upload_sessions |
| --- | --- | --- | --- |
| 0 | 1789675801 | 1 | 0 |

**Revogação explícita confirmada para `phase4d_d7275a73110548fc8fd26125a60d6a2b`.** A linha permanece presente e desativada, com o prazo original **17/09/2026 20:10:01 UTC — 16:10:01 em Eldorado/MS**. Não restaurar enabled=1, estender prazo, reutilizar o identificador ou reenviar UPDATE/SELECT para confirmar de novo. Zero sessões significa zero registros dessa janela naquele instante, não prova universal sobre operações já aceitas pelo Google.

A leitura anterior, às 01:21:54 locais, retornou enabled=1, expires_at=1789675801, now_epoch=1789708914, same_scope=1, one_file=1, other_active_controls=0 e upload_sessions=0. O bloco UPDATE/SELECT enviado às aproximadamente 01:27 exibiu apenas This query returned no data; o SELECT independente posterior resolveu a incerteza. Não inferir contagem de linhas alteradas ou comportamento universal do Console a partir disso.

O wrapper congelado consulta o controle antes do encaminhamento e rejeita enabled diferente de 1 ou prazo vencido. A revogação real no banco não demonstra qual wrapper atende o alias ou o gate da versão servida. Revogação não desfaz upload já aceito; troca de alias não revoga versões antigas.

## Evidências operacionais anteriores e limites

Relatório V3 do operador, aproximadamente 01:13 local:

- Deployment **`250b3d7b-9012-4073-9986-de36dd14bc3d`**, versão **`91eae913-ebaa-4550-8e88-f701f6cef777`**, **100%**; duas leituras coincidentes (`productionStableDuringRead=true`). Preservar atualizações legítimas. F8848c45/83a620d7 e 239cca88 são históricos, não alvos de rollback.
- `basePreviewMatches=true`: configuração do preview-base e D1 esperado passaram. Não comprova o alias atual. Últimas versões informadas: 91eae913 em 17/09 20:45:43.739 UTC, 6d37a098-2e74-4fcf-b91d-e8a69697391d em 20:40:05.537, f90c6da4-cfc3-4c4a-9947-6134006e744d em 19:09:37.075.
- `matchesReviewedProduction=false` identifica divergência da referência antiga do V3, não defeito produtivo.
- Registro local após leitura: uploadAttempted=false, uploaded=false, newVersionId=null, v3MarkerExists=false, lockFileDetected=false. Isso não é inventário de uploads feitos por outros computadores/consoles.
- Apenas JANELA_D1 falhou com WRANGLER_FALHOU_OU_EXCEDEU_PRAZO, código genérico de subprocesso. A leitura faltante já foi concluída pelo Console; causa específica do erro Windows segue desconhecida. Não afirmar timeout, quota, quoting ou credenciais sem evidência.
- --verificar não habilitou escrita. MODULE_NOT_FOUND foi superado; preparo local, login normal Wrangler e OAuth institucional anteriores permanecem concluídos.

Na intervenção anterior, um GET público sem credenciais a `/api/documents/access`, com Origin Pages registrado, sem redirects e limite de 15 s, retornou ConnectionError no ambiente do assistente, sem resposta HTTP. Não comprova 403, release, gate ou indisponibilidade do Portal. Não foi repetido nesta etapa. A busca anterior de plugins não retornou Cloudflare; não transformar isso em indisponibilidade permanente. Reconferir ferramentas quando necessário, sem pedir segredos.

## Produto, segurança e critérios pendentes

Fases 1–3: navegação/leitura Drive, PDF.js próprio, operações reversíveis, editor essencial, exportação e impressão aceitos; nenhuma regressão demonstrada pelos erros operacionais. 4A–4C: sessão/capabilities/permissões/metadados/conflitos revalidados, referências opacas, upload resumable backend cifrado, assinatura PDF, recuperação e confirmação final obrigatória. Autosync observa revisão real com um segundo de ociosidade; zoom/navegação não enviam. Botão normal → pending → syncing → success de um segundo → normal; failed permite retry. Assets/cache-buster preservados.

Confirmação de revisão anterior não comprova edição nova durante upload; X/saída/troca respeitam pendências; beforeunload é aviso, não garantia de envio após fechar. Primeiras provas reais preservaram/recuperaram revisão e mostraram feedback, mas envios seguintes apresentaram conflito indevido. X foi corrigido/retestado. Base16/atual18 não comprovou causalidade específica de keepForever. Correção 2fee19e relê recibo/metadados e certifica baseline na ref, vinculada a usuário/arquivo/versão/identidade/contexto/origens/controle, TTL de 30 minutos. Revisão externa inclusive com mesmos bytes continua conflito; preflight/upload não são atômicos.

Ainda faltam provas reais de salvamentos consecutivos, edição durante upload, ausência de reenvio sem mudança, retry, fechamento com sucesso/falha, conflito externo verdadeiro, reabertura final e recuperação, depois encerramento/matriz. save_copy segue sem homologação real no wrapper restrito; replace_pdf sozinho não conclui toda a Fase 4. Reconciliação de #201 com main é etapa própria, preservando melhorias transversais e validando o candidato sem escolher automaticamente um lado do conflito.

Jamais promover `worker/homologation-4d.js` para produção. D1/OAuth compartilhados; autenticação/capabilities reais e isolamento por host/origem, conta/PDF permitidos, controle revogável/expirável e sessões. OAuth/reconexão/desconexão e rotas alheias bloqueados; replace_pdf permitido e save_copy bloqueado nesse wrapper.

Não registrar nomes/IDs de arquivos ou usuários, conteúdo PDF, referências/revisões, URL resumable, credenciais, CPF/CNS/CID/diagnósticos no GitHub/PostHog. Telemetria somente drive_sync_started/completed/failed e propriedades técnicas allowlisted. Ausência de logs não prova privacidade. Não apagar ledger/locks, recriar tabelas, importar SQL via --file remoto, remover guards ou usar liberação antiga com prazo/referências vencidos.

## Validação e artefatos preservados

Nesta etapa: leitura do screenshot, ref main, status e referência oficial sobre preview. Nenhum código foi modificado; nenhuma suíte foi reexecutada e nenhum CI foi declarado verde. Nenhum SQL remoto, upload, deploy, retry de build, alteração de segredo/permissão ou mudança na main pelo assistente.

- V3: `scripts/central-docs/liberar-escrita-preview-4d-v3.mjs`, criação 89fa77590d675ce7edb5f91ddeded66405f2ce8f; SHA-256 **0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234**.
- Testes `.test.mjs`, criação 831935b932bd86d62e6d74aac1fbc70406730758; SHA-256 92c17049baaca1134651ee6bd4399e64fea3b4caec1d24d9fd6cd84acb45ec1b. CI `.github/workflows/validate-central-docs-operational-v3.yml`, criação 4018be8c23befd0591efd09d43b9a6cea36b1b0b.
- Original recebido: SHA-256 53b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5. V2-R1 documentado em 103ccd6, SHA-256 812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8; execução remota não confirmada, liberação suspensa.
- Históricos: V3 87 testes Node/sintaxe/três casos SQLite; revogação cinco casos sintéticos em 9c491c2; RESULTADOS registra 274/274 Worker e 75 passed/3 skipped navegador para 2fee19e. Nenhum é novo resultado do head atual.
- V3 mantém herança restrita por nome, multipart, lock/registro/marcador antes de tentativa, confirmação/revalidação; não há exclusão remota transacional. Wrangler pode reconciliar tags não versionadas no upload. O modo de liberação continua preso à janela vencida e revogada, não usar.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D sem aceite; Fase 0 e Fases 1–3 encerradas |
| Última ação concluída | Revogação D1 confirmada; recebido primeiro trecho de Deployments, ainda sem linha do preview |
| Branch/PR | codex/central-docs-drive-sync-phase4; #201 aberto/sem merge conforme último registro; mergeable:false histórico |
| Main | cd71ad5, ref real reconferida; preservar login/abertura/Home |
| Último commit anterior | c90b774; V3 89fa775, testes831935b, CI4018be8 |
| Código/preview | Reteste2fee19e; basea17473ce validada anteriormente; associação atual do alias/gate pendente |
| Produção | Active deployment exibe91eae913; snapshot explícito anterior91eae913/250b3d7b/100%; sem nova consulta API nesta etapa |
| Janela | Linha revogada enabled0/prazo1789675801/sessões0; não repetir SQL nem reabilitar |
| Nova observação | Latest build failed visível; causa/branch/commit/relação com4D não conhecidos; não inferir outage nem acionar retry |
| Decisão/justificativa | Continuar leitura mais abaixo em Version History e abrir somente menu da linha de preview-base; não usar produção ou última versão por suposição |
| Descartado | Repetir D1/V3/download/OAuth, rollback, publicar para localizar preview, atribuir causa ao build sem detalhes |
| Ações externas | Operador navega pelo painel; assistente atualiza só status na branch; nenhum acesso autenticado Cloudflare ou escrita em Drive/D1 |
| Testes/métricas | Sem novas suítes/checks; screenshot não estabelece mudança de tráfego nem métricas de sucesso |
| Bloqueios/riscos | Alias/gate/bloqueio real ainda não identificados; D1/OAuth compartilhados; histórico parcial; falha de build sem diagnóstico; conflito com main |
| Observabilidade | Somente flags/IDs técnicos/timestamps/contagens; nenhuma identidade ou conteúdo documental |
| Próxima ação exata | Receber linha a17473ce ou Central Docs4D/central-docs-phase4d, com menu de três pontos aberto; se não aparecer, parte inferior/paginação do histórico; não selecionar Deploy/Rollback |
| Depois | Conferir detalhes da versão/alias/gate/bloqueio; planejar nova janela confirmada com ID novo e produção reconferida; matriz4D e reconciliação |
| Fontes | STATUS; Guia MestreV1.1; Dossiê/deltas relevantes; wrapper2fee19e; RESULTADOS; ISOLAMENTO; CONTINUIDADE-TARDE; PR#201 |

## Histórico recuperável e referência externa

Status integral imediatamente anterior: `c90b774c0e95482f6d40c695acc29fec5ac21ad3:docs/CENTRAL-DOCUMENTOS-STATUS.md`. Revogação/leituras em 5b1507c, 9c491c2 e 402199d; antes f1824c7, 4d64c5d, V2-R1 em103ccd6, d36facb, V2 em9f295ca e histórico2caa479. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 preservam detalhes e critérios. Consultar somente o necessário, sem reiniciar etapas concluídas.

Referência externa: https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/ (navegação por Deployments; distinção versão/alias). Ela não comprova a configuração privada do ambiente do operador nem o menu específico deste screenshot.
