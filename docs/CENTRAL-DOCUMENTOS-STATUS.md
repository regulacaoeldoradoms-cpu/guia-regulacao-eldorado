# Central de Documentos — Status

Última atualização: 18/09/2026.

## Atualização operacional — arquivo não encontrado no Windows

Screenshot do operador em 18/09 mostra duas tentativas de `node .\liberar-escrita-preview-4d-v3.mjs --verificar` a partir de Downloads. Ambas terminaram com `MODULE_NOT_FOUND`, apontando para o próprio arquivo de entrada, e `requireStack: []`. Essas duas tentativas não iniciaram o script nem suas consultas. Isso não prova ausência de outras tentativas em sessões anteriores e não diagnostica problema no editor/Drive. Não registrar o caminho pessoal do Windows ou a imagem no repositório.

O pacote `central-4d-v3-download.zip` foi inspecionado localmente: contém o executável na raiz do ZIP e LEIA-ME.txt. O SHA-256 do executável continua `0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234`, sem alteração de código. Não foi possível determinar pelo screenshot se o ZIP está sem extração, se foi extraído em subpasta ou se o arquivo não foi baixado. Decisão: orientar extração do ZIP em pasta local nova, conferir o hash e executar o caminho absoluto com **somente --verificar**, evitando depender da pasta atual. Não sobrescrever o preparo em LOCALAPPDATA, não apagar locks/ledger e não reinstalar Node ou repetir OAuth por causa desse erro.

**A janela documentada venceu em 17/09/2026 20:10:01 UTC (16:10:01 em Eldorado/MS).** Não orientar liberação dessa janela nem alterar o prazo. Expiração pelo relógio não comprova revogação explícita da linha D1 ou gate false em todas as versões. Continua necessário receber o relatório somente leitura, conferir tentativas/versões/controle e tratar o encerramento antes de planejar outra janela com confirmação apropriada.

Main reconferida pela ref real: `cd71ad566a443cd2f89b1d98285856c22baf73d7`. Seu status registra a melhoria transversal de inicialização da Home incorporada pelo PR #207 e a continuidade da Central no PR #201, sem aceite 4D. As referências 8cefaf6 e produção f8848c45 nas seções históricas abaixo são snapshots anteriores; não são novas confirmações da produção Cloudflare. Nenhuma alteração de main, código do V3, upload ou consulta autenticada Cloudflare/D1/Drive nesta atualização. Não foram repetidas suítes do produto para resolver localização de arquivo; foram conferidos pacote e hash.

**Próxima ação imediata:** operador localiza o ZIP em Downloads, extrai para pasta nova, confere o SHA-256 e executa o arquivo por caminho absoluto com --verificar. Receber apenas VERIFICACAO_SOMENTE_LEITURA ou as últimas linhas sanitizadas do erro. Não pedir configuração ou ledger completos. A solução do erro local e a execução real ainda não foram confirmadas pelo operador.

## Fase atual

**Fase 4 — Sincronização segura com Drive.** Subfase **4D — homologação real ainda sem aceite; janela anterior vencida e verificação somente leitura bloqueada localmente por arquivo não localizado.**

A **Fase 0** e as Fases **1, 2 e 3** permanecem encerradas. As subfases 4A–4C têm implementação e evidências técnicas; elas não substituem a matriz real 4D. Não reiniciar fases, mesclar o PR #201 nem iniciar outra fase para cumprir prazo.

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR **#201 aberto, sem merge** segundo o status consultado na main; consulta anterior do PR indicou `mergeable:false`.
- Ref efetiva da `main` reconferida em 18/09: **`cd71ad566a443cd2f89b1d98285856c22baf73d7`**. Preservar as melhorias transversais já incorporadas. Snapshot da intervenção anterior: 8cefaf6, merge do PR #204; o `base_sha=336b6473` retornado então pelo objeto do PR não representava a ref atual da main.
- Código do reteste restrito continua congelado em `2fee19e69e06ecd128be2b103354fc6c2fb4e431`; esta revisão não altera editor, wrapper, autenticação ou capacidades.
- Preview-base informado e anteriormente conferido pelo operador: `a17473ce-ad9a-480c-8e53-901f2fcc3c92`, gate false. Não presumir que ele ainda atenda o alias.

## Retomadas paralelas: decisão operacional vigente

O usuário anexou nesta conversa o original `liberar-escrita-preview-4d.mjs`. Seu SHA-256 foi calculado e corresponde exatamente ao histórico: `53b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5`.

Durante a revisão, nova consulta da ref da branch revelou o commit **`103ccd63a14f91963ff511112091002ce95c21fa`**, de outra retomada, registrando a reemissão do **V2-R1**. Esse registro documenta o executável `liberar-escrita-preview-4d-v2-r1.mjs`, SHA-256 `812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8`, pacote `preview-4d-liberar-escrita-v2-r1.zip` e 31 testes locais. Esses são registros daquela revisão, não testes reexecutados nesta. Não foi recuperado resultado do operador confirmando execução, upload ou liberação do V2-R1.

**A instrução anterior de executar diretamente V2-R1 fica suspensa até conferir o estado real.** Não executar dois procedimentos de liberação, apagar locks ou repetir upload para garantir. A evolução da main não prova, sozinha, qual versão atende a Cloudflare.

O V3 foi preparado do original recebido com identificação própria. Para esta entrega, executar **apenas `--verificar`**. A existência do modo `--liberar-teste` no arquivo não dispensa a reconciliação desta pendência. Não decidir automaticamente entre V2-R1 e V3 pelo nome mais recente.

Justificativa: a versão de produção pode ter mudado e a outra retomada pode ter alcançado uma tentativa de envio. É necessário distinguir ausência de tentativa de resultado incerto antes de permitir nova escrita. A verificação preserva evidências locais e retorna somente metadados técnicos.

## Evidências operacionais anteriores preservadas

- Login normal do Wrangler e preparo local no Windows já ocorreram. Não repetir OAuth institucional, criação do PDF, download do código ou formulário de Builds. O registro anterior informa Windows 10 Pro, Node 24.17.0, npm 11.13.0 e Wrangler 4.133.0.
- `enviar-preview-4d-seguro.mjs` informou `PREVIEW_ENVIADO_DESARMADO`, versão a17473ce, código 2fee19e, escrita false e produção então em 239cca88/100%.
- O operador criou uma nova janela D1, sem prorrogar a anterior, copiando somente a conta e um PDF descartável autorizados. Prazo original: **17/09/2026 20:10:01 UTC — 16:10:01 em Eldorado/MS**.
- Screenshot recebido aproximadamente às 14:17 locais confirmou listagem restrita e leitura de três páginas. Isso não comprova autosync com esta versão.
- O original interrompeu em `CONFERIR_PREVIEW_E_PRODUCAO`, código `VERSAO_DE_PRODUCAO_DIVERGENTE`, antes de qualquer upload; exigia a versão histórica 239cca88.
- Último deployment informado pelo operador: **`83a620d7-82cc-47ae-9779-f7002f45482d`**, versão **`f8848c45-0bfc-40d6-8508-92b33dea6f43`**, **100%**, criado às 18:26:45.063 UTC. Versões informadas: a17473ce às 18:02:13.211, eabef99f às 18:23:39.339 e f8848c45 às 18:26:44.579 UTC.

Esses são metadados recebidos do operador, não nova leitura autenticada da Cloudflare nesta intervenção. A descoberta de plugins da sessão de preparação não retornou Cloudflare; isso é histórico daquela sessão. Nenhum comando autenticado de upload/deploy, acesso a PDF ou alteração de linha D1 foi executado pelo assistente nas intervenções descritas. Não houve modificação da main ou merge do PR.

## Artefato V3 efetivamente versionado

Para evitar outra perda do executável entre conversas, os próprios arquivos estão na branch:

- `scripts/central-docs/liberar-escrita-preview-4d-v3.mjs`, commit de criação **`89fa77590d675ce7edb5f91ddeded66405f2ce8f`**;
- `scripts/central-docs/liberar-escrita-preview-4d-v3.test.mjs`, commit **`831935b932bd86d62e6d74aac1fbc70406730758`**;
- `.github/workflows/validate-central-docs-operational-v3.yml`, commit **`4018be8c23befd0591efd09d43b9a6cea36b1b0b`**, executa somente testes com transporte simulado e permissão contents:read, sem credenciais de Cloudflare/Drive.

SHA-256 do executável V3: **`0b58085dc14cf274d94be117117c8417de0d3ad8e0723b94358db71b25892234`**.

SHA-256 dos testes: `92c17049baaca1134651ee6bd4399e64fea3b4caec1d24d9fd6cd84acb45ec1b`.

Os blobs retornados pelo GitHub foram conferidos contra os bytes locais: executável `c7e5e00322dfda484ab5a1c9c7b01909ea2392f3`; testes `9438cfb9301c178e9e9e6c26a63d08703d236187`. O V3 não é apresentado como o V2 perdido ou como o V2-R1.

### Modo permitido para a próxima execução: verificar

`node .\liberar-escrita-preview-4d-v3.mjs --verificar`

O exemplo acima pressupõe estar na pasta que contém o arquivo extraído; usar caminho absoluto para evitar o erro MODULE_NOT_FOUND registrado em 18/09.

Reutiliza o preparo em `%LOCALAPPDATA%\CentralDocumentos4D` e o login normal do Wrangler. Cria somente uma configuração local separada para as consultas. Não sobrescreve o registro de tentativa, não arquiva/apaga evidências, não remove locks, não compila e não chama upload ou deploy.

Consulta deployment, últimas versões, configuração do preview-base e o SELECT restrito do D1. Retorna prazo, flags de igualdade do escopo, contagens e metadados UUID/percentuais. Lê o resumo da tentativa local antes e depois das consultas. Estado desconhecido permanece null, não vira false. O bloco de saída é `VERIFICACAO_SOMENTE_LEITURA`; não solicitar o ledger completo, configurações, IDs de arquivos, nomes de usuários ou credenciais.

O modo de leitura não declara que o preview atualmente servido está desarmado: confirma a versão-base e apresenta a lista de versões para posterior reconciliação. `matchesReviewedProduction=false` é informação para análise, não aprovação automática de outra produção. Mesmo sem erros de consulta, o relatório não autoriza edição do PDF.

### Correções implementadas para eventual liberação posterior

Esta seção descreve a implementação histórica; a janela fixada já venceu e não está autorizada para liberação agora.

- Separa snapshot histórico da produção atual; exige f8848c45/83a620d7/100% antes e depois, sem rollback ou aceitação automática de outra versão.
- Confere preview-base, release, controle, origens, runtime, mesmo D1 e dependências públicas compartilhadas. Verifica presença/tipo dos seis segredos necessários sem ler valores.
- Restringe a herança a seis nomes com `secrets.required` e `unsafe.metadata.keep_bindings=[]`. O fonte fixado do Wrangler 4.133.0 foi consultado: required produz bindings inherit; o upload normalmente preserva todos os segredos; unsafe.metadata substitui o campo no multipart.
- Exige dois dry-runs com os mesmos argumentos e valida cada multipart: um módulo de homologação, dez variáveis, AUTH_DB e seis inherit sem valores. Bloqueia recursos, módulos e metadados extras ou herança ampla. Compara também o pacote emitido pelo upload após a tentativa; divergência posterior nunca é sucesso.
- Confere hash Git do wrapper local e estabilidade dos fontes/configuração durante o procedimento. O snapshot de estabilidade não é uma atestação independente de todos os imports contra o commit remoto.
- Só arquiva tentativa claramente anterior ao envio. Trava local, registro atômico e marcador persistente precedem o subprocesso de upload. Tentativa incerta bloqueia repetição.
- SELECT exige prazo original, um PDF, mesma conta/escopo, nenhuma outra janela ativa e nenhuma sessão pendente. Liberação exige pelo menos 20 minutos restantes e confirmação humana `LIBERAR TESTE`, sem estender prazo.
- Confere alias retornado, nova versão e predecessor esperado para detectar concorrência. Não oferece exclusão remota transacional nem coordenação garantida entre scripts de revisões distintas. Manter outras publicações e liberações paradas.

Limite adicional: a comparação de deployment não atesta todos os metadados não versionados do serviço. O fonte do Wrangler contém reconciliação de tags de serviço/ambiente em versões upload; não prometer ausência universal de efeitos em tags. Nenhum upload real V3 foi executado pelo assistente.

### Validação registrada na preparação do V3

**87 testes Node locais aprovados, zero falhas/skips**, em Node 22.16.0, mais sintaxe. Inclui seis casos específicos do modo de leitura e fluxo completo com transporte simulado, confirmação, mudanças de produção, expiração, herança/multipart, resultado incerto, não repetição e sanitização.

O SELECT exato foi exercitado em SQLite de memória em **três cenários sintéticos**: escopo válido, JSON inválido e sessão pendente. Nenhuma identidade real foi usada.

Não foi possível executar o Wrangler real no ambiente da preparação; portanto o dry-run efetivo com Wrangler 4.133.0, o Windows real e o upload autenticado continuam sem comprovação nesta revisão. O workflow foi criado; seu resultado deve ser consultado, não presumido verde a partir dos testes locais. Esses 87 testes não substituem o aceite real do editor e não foram reexecutados para o erro local de caminho em 18/09.

## Produto: situação preservada e pendências de aceite

Visualizador PDF.js, editor essencial, operações reversíveis, exportação e impressão pertencem às fases encerradas. Autosync observa revisão real com um segundo de ociosidade; zoom/navegação não enviam. Estados normal/pending/syncing/success de um segundo/failed permanecem. Uma revisão anterior confirmada não significa que edição nova feita durante upload já esteja salva.

As primeiras provas reais registraram preservação/recuperação de revisão e confirmação visual, mas envios seguintes apresentaram conflito indevido. A proteção do X foi corrigida/retestada. O diagnóstico observou base 16/atual 18 sem nova revisão externa conhecida, sem provar causalidade específica do keepForever.

A correção 2fee19e relê recibo/metadados e certifica baseline na referência opaca, associada a usuário, arquivo, versão, identidade e contexto, com TTL de 30 minutos. Revisão externa, inclusive com bytes iguais, continua bloqueada. Não torna preflight/upload atômicos.

RESULTADOS registra para essa correção 274/274 testes Worker e 75 passed/3 skipped de navegador. São evidências históricas do produto, não novo resultado de todos os checks do head atual.

Ainda faltam salvamentos consecutivos reais com 2fee19e, edição durante upload, ausência de reenvio sem mudança, retry, fechamento com sucesso/falha, conflito externo verdadeiro, reabertura final e recuperação, seguidos de encerramento dos controles e registro da matriz.

## Isolamento, privacidade e encerramento

Jamais promover `worker/homologation-4d.js` para produção. D1/OAuth compartilhados; autenticação/capabilities reais e isolamento por host/origem, conta/PDF permitido, controle expirável/revogável e sessões. OAuth/reconexão/desconexão e rotas alheias bloqueados. replace_pdf permitido; save_copy continua sem homologação real nesse ambiente.

Não registrar no GitHub/PostHog nomes/IDs de arquivos, usuários, conteúdo de PDF, referências opacas, revisão, URL resumable, credenciais, CPF, CNS, CID ou diagnóstico. Telemetria restrita a drive_sync_started/completed/failed e propriedades técnicas allowlisted. Ausência de logs não prova privacidade.

O prazo original terminou em **17/09/2026 20:10:01 UTC**, sem extensão automática. A margem mínima de liberação era 20 minutos, não uma autorização para apressar a matriz. Ao encerrar: aguardar operações em voo, revogar controle D1, confirmar bloqueio e preparar gate false. Revogação não desfaz upload aceito; trocar alias não revoga versões antigas. Expiração não substitui evidência de encerramento operacional.

## Próxima ação exata

1. Corrigir a localização/extração do arquivo no Windows e executar **somente V3 --verificar** por caminho absoluto, sem iniciar V2-R1 ou outra liberação paralela. Receber somente o bloco sanitizado final.
2. Conferir tentativas antes/depois, locks, versões, deployment e prazo. Havendo envio tentado/estado incerto: não repetir nem editar; inspecionar e revogar conforme necessário. Havendo mudança de produção: preservar a nova implantação, revisar dependências e referência explicitamente, sem apenas trocar UUIDs.
3. A janela anterior está vencida. Conferir encerramento e pendências; eventual nova janela requer procedimento/escopo revistos e confirmação apropriada, sem prolongar a linha antiga, reaproveitar seu identificador ou mudar apenas a data do script.
4. Em uma janela futura validamente autorizada, executar a matriz real e encerramento. Reconciliar #201 com a main em etapa própria, preservando melhorias transversais incorporadas e rodando checks do candidato reconciliado. Não escolher automaticamente um lado do conflito.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D, sem aceite; Fase 0 e Fases 1–3 encerradas |
| Última ação concluída | Screenshot diagnosticado como arquivo de entrada não localizado; ZIP e hash V3 conferidos; solução de extração/caminho absoluto orientada, execução do operador ainda pendente |
| Branch/PR | codex/central-docs-drive-sync-phase4; #201 sem merge segundo o status atual da main; conflito indicado em consulta anterior |
| Commits relevantes | V2-R1 documentado em 103ccd6; V3 em 89fa775; testes em 831935b; CI em 4018be8; continuidade anterior em 4d64c5d |
| Main | Ref real cd71ad5 conferida em 18/09; status registra PR #207 incorporado; preservar melhorias transversais |
| Código/preview | Reteste 2fee19e; preview-base a17473ce; versão atualmente servida ainda a reconferir |
| Produção | Último relato do operador f8848c45/83a620d7/100%; não reconfirmada pela Cloudflare nesta intervenção |
| Janela | Prazo anterior vencido em 17/09 20:10:01 UTC; nenhuma extensão/nova janela autorizada nesta atualização |
| Decisão/porquê | Resolver extração/caminho sem alterar o script; somente leitura para distinguir tentativas passadas e conferir encerramento |
| Descartado | Reinstalar Node, repetir OAuth, rollback, remover guards, trocar só UUID/data, apagar locks/ledger ou executar dois scripts |
| Testes | Nesta atualização: inspeção do ZIP e SHA-256 idêntico. V3 87 locais/SQLite e produto conforme registros anteriores, sem repetição |
| Ações externas | As duas tentativas do screenshot não iniciaram V3. Outras tentativas permanecem a conferir. Nenhuma operação autenticada Cloudflare/D1/Drive nesta atualização |
| Riscos | Tentativa concorrente/incerta, D1/OAuth compartilhados, janela vencida sem revogação confirmada, herança, cache, tags e integração com main |
| Observabilidade | Somente eventos/propriedades técnicos allowlisted, sem dados sensíveis |
| Próximo passo | Receber VERIFICACAO_SOMENTE_LEITURA do V3 após resolver localização; não orientar --liberar-teste para a janela vencida |
| Fontes | Este status; scripts/central-docs/V3 e testes; Guia Mestre; Dossiê/deltas; RESULTADOS; ISOLAMENTO; CONTINUIDADE-TARDE; PR #201 |

## Histórico recuperável

O conteúdo integral da reentrega V2-R1 permanece em `103ccd63a14f91963ff511112091002ce95c21fa:docs/CENTRAL-DOCUMENTOS-STATUS.md`; a retomada anterior em d36facb; preparação V2 em 9f295ca; histórico operacional anterior em 2caa479; estado integral anterior ao erro de localização em 4d64c5d. Documentos FASE-4, ARQUITETURA-V1, HOMOLOGACAO-V1, STAGING-OPERACIONAL-V1 e deltas continuam complementares. Ler somente o necessário à próxima ação; não reiniciar investigações encerradas.
