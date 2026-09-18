# Central de Documentos — Status

Última atualização: 18/09/2026.

## Fase atual

**Fase 4 — Sincronização segura com Drive.** Subfase **4D — sem aceite; revogação D1 concluída; preview-base localizado no histórico; vínculo atual do alias e bloqueio servido ainda pendentes.**

A **Fase 0** e as Fases **1, 2 e 3** permanecem encerradas. 4A–4C têm implementação e evidências técnicas, não aceite real da 4D. Encerrar uma autorização não homologa o produto. Não reiniciar etapas encerradas.

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR **#201 aberto e sem merge conforme último registro**; `mergeable:false` na última consulta registrada. PR/checks não foram reconsultados nesta atualização operacional.
- Ref real da `main` reconferida: **`cd71ad566a443cd2f89b1d98285856c22baf73d7`**. Preservar login/abertura/Home. A ref Git não identifica deployment Cloudflare.
- Código congelado do reteste: **`2fee19e69e06ecd128be2b103354fc6c2fb4e431`**.
- Preview-base: **`a17473ce-ad9a-480c-8e53-901f2fcc3c92`**, configuração desarmada validada anteriormente pelo relatório V3. Não presumir que ainda atenda o alias `central-docs-phase4d`.

## Evidência nova — linha do preview e menu, 18/09 aproximadamente 01:43 local

O operador enviou a parte inferior da primeira página de Version History. A linha **a17473ce** está visível com a mensagem **Central Docs 4D: nova janela; escrita bloqueada**, rótulo **central-docs-phase4d** e origem Wrangler. A localização dessa versão no histórico está concluída: não pedir outra rolagem para encontrá-la.

O mesmo rótulo aparece em versões anteriores: 9ae11ff5 (baseline certificada salvamento), da1f2bc8 (diagnostico numerico restrito) e e37fccb3 (release identificavel para diagnostico real). O painel mostra **Showing 1-10 of 743**, página 1. Isso é o que a interface apresenta, não um inventário autenticado completo feito pelo assistente.

O menu aberto da linha a17473ce contém somente **Rollback, Split versions e View logs**. Nenhuma opção mostrada consulta a configuração dessa versão. Não selecionar Rollback/Split versions, não usar View logs como substituto de configuração e não supor outra opção de detalhes que não foi exibida. A descrição escrita bloqueada e o rótulo compartilhado não demonstram por si sós o valor de DOCUMENTS_DRIVE_WRITE_ENABLED nem o destino atual do endereço de teste.

**Decisão:** sair da navegação por menus e consultar somente metadados de versões pelo Wrangler já autenticado. Distinguir `workers/tag` de `workers/alias`; não tratar o rótulo visível como prova de roteamento. Nenhum novo download, instalação manual, login, preparação de código, SQL ou upload é necessário para essa consulta.

Fonte: screenshot fornecido pelo operador; não publicar imagem, autores, caminhos pessoais ou credenciais no repositório. O aviso Latest build failed continua visível, sem causa/branch/commit/relação com 4D identificados. Não inferir indisponibilidade nem acionar retry.

## Próxima ação exata — listagem restrita do alias, somente leitura

No mesmo Windows, usar o PowerShell e o `configPath` já registrado em `%LOCALAPPDATA%\CentralDocumentos4D\ultimo-preview.json`. Invocar somente:

`npx.cmd --yes wrangler@4.133.0 versions list --name yellow-wave-d0a1guia-regulacao-ia --config <configPath existente> --json`

Capturar a saída em memória, verificar sucesso e interpretar o JSON antes de mostrar qualquer conteúdo. Filtrar pela anotação exata **workers/alias=central-docs-phase4d**, ordenar por metadata.created_on e projetar somente UUID de versão/data. Não mostrar JSON bruto, autor, outros bindings, configurações ou registros locais completos.

O bloco de resposta será **ALIAS_PREVIEW_SOMENTE_LEITURA**, com a quantidade retornada, indicação de a17473ce estar na lista e versões que efetivamente tragam aquela anotação. Ausência de candidatos não comprova ausência global do alias. O comando retorna no máximo dez versões recentes; os resultados são metadados das versões, não uma consulta HTTP ao alias nem exclusão de alteração concorrente.

A instrução fornecida captura erros sem expor saída bruta; em falha retorna CONSULTA_NAO_CONCLUIDA. Não repetir em laço ou executar publicação para corrigir uma listagem. O comando reutiliza a configuração local sem reescrevê-la e não executa o V3 inteiro, SQL, versions upload, deploy, rollback ou comando de segredo.

**Execução ainda pendente do operador.** Não afirmar que o alias já foi conferido a partir da preparação do comando. Depois do relatório: confrontar a versão candidata com a base cuja configuração já foi validada; se houver outra versão, consultar somente seus metadados necessários. Confirmar também bloqueio real no endereço autorizado. Não abrir nova janela até resolver o encerramento; não reabilitar o controle antigo.

## Etapa D1 concluída — não repetir

O SELECT isolado do operador, aproximadamente às 01:31 locais de 18/09, confirmou:

| enabled | expires_at | revogada | upload_sessions |
| --- | --- | --- | --- |
| 0 | 1789675801 | 1 | 0 |

**Revogação explícita confirmada para `phase4d_d7275a73110548fc8fd26125a60d6a2b`.** A linha permanece presente e desativada, com o prazo original **17/09/2026 20:10:01 UTC — 16:10:01 em Eldorado/MS**. Não restaurar enabled=1, estender prazo, reutilizar identificador ou reenviar UPDATE/SELECT para confirmar de novo. Zero sessões significa zero registros dessa janela naquele instante, não prova universal sobre requisições já aceitas pelo Google.

A leitura às 01:21:54 retornou enabled=1, expires_at=1789675801, now_epoch=1789708914, same_scope=1, one_file=1, other_active_controls=0 e upload_sessions=0. A tentativa UPDATE/SELECT às aproximadamente 01:27 exibiu apenas This query returned no data; a leitura independente posterior resolveu a incerteza. Não inferir comportamento universal do Console a partir dessa exibição.

O wrapper congelado rejeita controle desativado ou expirado antes do encaminhamento. A evidência D1 não identifica sozinha o wrapper servido nem seu gate. Revogação não desfaz upload já aceito; troca de alias não revoga versões antigas.

## Evidências produtivas e operacionais preservadas

- Relatório V3 do operador, aproximadamente 01:13: deployment **250b3d7b-9012-4073-9986-de36dd14bc3d**, versão **91eae913-ebaa-4550-8e88-f701f6cef777**, **100%**, duas leituras coincidentes. O screenshot de Active deployment às 01:37 também identifica 91eae913, sem nova confirmação API dos percentuais. Preservar atualizações legítimas; f8848c45/83a620d7 e 239cca88 são históricos, não alvos de rollback.
- `basePreviewMatches=true`: configuração do preview-base/D1 esperado passou. `matchesReviewedProduction=false` identifica referência antiga do V3, não defeito produtivo. Não usar mensagens de merge ou proximidade de horários para atribuir conteúdo de deployment a um PR.
- Registro local após leitura V3: uploadAttempted=false, uploaded=false, newVersionId=null, v3MarkerExists=false, lockFileDetected=false. Não equivale a inventário global de uploads por outros computadores/consoles.
- Erro JANELA_D1/WRANGLER_FALHOU_OU_EXCEDEU_PRAZO foi contornado para a leitura via Console. Sua causa específica no Windows não foi diagnosticada; não afirmar timeout, quota, quoting ou credenciais. MODULE_NOT_FOUND foi superado. Preparo, login normal Wrangler e OAuth institucional anteriores permanecem concluídos.
- GET público do ambiente do assistente a `/api/documents/access`, com Origin Pages registrado, sem credenciais/redirects e limite de 15 s, havia retornado ConnectionError sem resposta HTTP. Não comprova bloqueio, release/gate ou indisponibilidade. Não foi repetido nesta intervenção.
- Nova busca no diretório de plugins por Cloudflare não retornou ferramenta nesta intervenção. É resultado desta sessão, não indisponibilidade permanente; não solicitar credenciais para contornar.

## Produto, segurança e critérios pendentes

Fases 1–3: navegação/leitura Drive, PDF.js próprio, operações reversíveis, editor essencial, exportação e impressão aceitos. Nenhuma regressão dessas fases demonstrada pelos erros operacionais. 4A–4C: sessão/capabilities/permissões/metadados/conflitos revalidados, referências opacas, upload resumable backend cifrado, assinatura PDF, recuperação e confirmação final. Autosync observa revisão real com um segundo de ociosidade; zoom/navegação não enviam. Estados normal → pending → syncing → success de um segundo → normal; failed permite retry. Assets/cache-buster preservados.

Confirmação de revisão anterior não comprova edição nova durante upload. X/saída/troca respeitam pendências; beforeunload é aviso, não garantia de envio após fechar. Primeiras provas reais preservaram/recuperaram revisão e mostraram feedback, mas envios seguintes tiveram conflito indevido. X foi corrigido/retestado. Base16/atual18 não comprovou causalidade do keepForever. Correção 2fee19e relê recibo/metadados e certifica baseline na ref, vinculada a usuário/arquivo/versão/identidade/contexto/origens/controle, TTL30min. Revisão externa inclusive com mesmos bytes permanece conflito; preflight/upload não são atômicos.

Ainda faltam provas reais de salvamentos consecutivos, edição durante upload, ausência de reenvio sem mudança, retry, fechamento com sucesso/falha, conflito externo verdadeiro, reabertura final e recuperação, depois encerramento/matriz. save_copy segue sem homologação real no wrapper restrito; replace_pdf sozinho não conclui toda a Fase 4. Reconciliação de #201 com main é etapa própria, preservando melhorias transversais e validando candidato sem escolher automaticamente um lado do conflito.

Jamais promover `worker/homologation-4d.js` para produção. D1/OAuth compartilhados; autenticação/capabilities reais e isolamento por host/origem, conta/PDF permitido, controle revogável/expirável e sessões. OAuth/reconexão/desconexão e rotas alheias bloqueados; replace_pdf permitido, save_copy bloqueado no wrapper.

Não registrar no GitHub/PostHog nomes/IDs de arquivos ou usuários, conteúdo PDF, referências/revisões, URL resumable, credenciais, CPF/CNS/CID/diagnósticos. Telemetria somente drive_sync_started/completed/failed e propriedades técnicas allowlisted. Não apagar ledger/locks, recriar tabelas, importar SQL via --file remoto, remover guards ou usar liberação antiga com prazo/referências vencidos.

## Validações e artefatos

Nesta intervenção: leitura de screenshot, status, ref main, Guia Mestre já disponibilizado integralmente e documentação oficial de Preview URLs/Wrangler versions list/view. Nenhum código do editor/V3 foi alterado; nenhuma suíte foi repetida ou CI declarado verde. PowerShell não está disponível no ambiente local; não alegar execução do bloco no Windows ou resultado remoto. Não houve SQL remoto, upload, deploy, retry de build, alteração de segredo/permissão ou main pelo assistente. Somente este status na branch foi atualizado.

Artefatos anteriores preservados:
- V3 `scripts/central-docs/liberar-escrita-preview-4d-v3.mjs`, criação89fa77590d675ce7edb5f91ddeded66405f2ce8f; SHA-256 **0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234**. Testes em831935b932bd86d62e6d74aac1fbc70406730758, SHA-25692c17049baaca1134651ee6bd4399e64fea3b4caec1d24d9fd6cd84acb45ec1b; CI4018be8c23befd0591efd09d43b9a6cea36b1b0b.
- Original recebido SHA-25653b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5. V2-R1 documentado em103ccd6, SHA-256812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8; liberação suspensa, execução remota não confirmada.
- Históricos: V3 87 testes Node/sintaxe/três casos SQLite; revogação cinco casos sintéticos em9c491c2; RESULTADOS registra274/274 Worker e75 passed/3 skipped navegador para2fee19e. Não são novos resultados do head atual.
- Proteções V3: herança restrita por nome, multipart, lock/registro/marcador antes de tentativa, confirmação/revalidação. Sem exclusão remota transacional; Wrangler pode reconciliar tags não versionadas no upload. Liberação continua vinculada à janela vencida/revogada: não usar.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D sem aceite; Fase 0 e Fases 1–3 encerradas |
| Última ação concluída | Linha a17473ce localizada no histórico e menu inspecionado; revogação D1 já confirmada |
| Branch/PR | codex/central-docs-drive-sync-phase4; #201 aberto/sem merge conforme último registro; mergeable:false histórico |
| Main | cd71ad5, ref real reconferida; preservar login/abertura/Home |
| Último commit anterior | c1767a219389b660f59d3c8631bc1a96b12bec1e |
| Código/preview | Reteste2fee19e; basea17473ce desarmada conforme V3; rótulo repetido não comprova alias atual |
| Produção | Active deployment91eae913; último snapshot explícito91eae913/250b3d7b/100%, relato anterior |
| Janela | Revogada: enabled0, expires_at1789675801, sessões0; não repetir SQL nem reabilitar |
| Decisão/porquê | Consultar workers/alias por listagem read-only, pois menu não oferece configuração e rótulo visual pode ser tag |
| Descartado | Rollback, Split versions, View logs para inferir configuração, inventar botão de detalhes, repetir V3 inteiro/download/SQL/OAuth, publicar para localizar alias |
| Ações externas | Operador localizou versão; assistente apenas documentação GitHub; nenhum novo acesso autenticado Cloudflare |
| Checks/testes | Nenhuma suíte/CI repetida; comando PowerShell não executado pelo assistente |
| Bloqueios | Metadados privados dependem de execução somente leitura do operador; plugin Cloudflare não encontrado nesta sessão |
| Riscos | D1/OAuth compartilhados; limite de dez versões da listagem; alias pode mudar; gate/bloqueio servido ainda pendentes; conflito com main |
| Observabilidade | Somente UUIDs/timestamps/flags/contagens técnicos; nunca saída JSON bruta de configuração/autores |
| Próxima ação exata | Receber ALIAS_PREVIEW_SOMENTE_LEITURA de versions list com filtro workers/alias; ausência nas dez não prova ausência global |
| Depois | Confrontar candidato com base validada, consultar configuração restrita se diferente e conferir bloqueio real; planejar nova janela com confirmação/ID novo, matriz4D e reconciliação |
| Fontes | STATUS; Guia MestreV1.1; Dossiê/deltas relevantes; wrapper2fee19e; RESULTADOS; ISOLAMENTO; PR#201; docs oficiais Cloudflare |

## Histórico recuperável

Status integral anterior: `c1767a219389b660f59d3c8631bc1a96b12bec1e:docs/CENTRAL-DOCUMENTOS-STATUS.md`. Etapas anteriores emc90b774,5b1507c,9c491c2,402199d,f1824c7,4d64c5d; V2-R1 em103ccd6; V2 em9f295ca. RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1 e STAGING-OPERACIONAL-V1 preservam critérios/detalhes. Consultar apenas o necessário sem reiniciar etapas concluídas.

Referências externas desta etapa: Cloudflare Workers Preview URLs (versões e aliases, limitações de logs) e Wrangler Commands/Workers (versions list: dez recentes; versions view: detalhes de uma versão). Essas referências não comprovam configuração privada deste ambiente.
