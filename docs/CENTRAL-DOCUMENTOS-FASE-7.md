# CENTRAL DE DOCUMENTOS — FASE 7

## Robustez e otimização contínua

Data de abertura: 21/09/2026  
Estado: **ATIVA**  
Pré-condição: Fase 6 formalmente encerrada por aceite humano do responsável operacional.

## Objetivo

Consolidar a Central de Documentos/Titon como ferramenta robusta e previsível, corrigindo gargalos com base em dados reais e testes de regressão.

O Guia Mestre define para esta fase:
- analisar **p75/p95/p99**;
- analisar **cache hit/miss**;
- analisar **falhas de Google Drive**;
- validar **PDFs grandes**;
- comparar **mobile/desktop**;
- acompanhar **tempo da IA**;
- corrigir gargalos com base em dados e testes de regressão.

Critério de aceite da Fase 7:
- **SLOs definidos a partir de dados reais**;
- **falhas recuperáveis**;
- **painel de observabilidade estável**.

## Regras permanentes

- nenhuma otimização pode reduzir integridade documental ou consistência com o Google Drive;
- estado definitivo de salvamento continua dependendo de confirmação real do Drive;
- PostHog recebe apenas telemetria técnica allowlisted;
- nunca enviar nome de paciente, CPF, CNS, telefone, endereço, nascimento, diagnóstico, CID, encaminhamento, prescrição, resultado, texto digitado, nome do arquivo, Drive ID ou conteúdo do PDF;
- não ampliar permissões;
- não colocar segredos no frontend/GitHub;
- mudanças experimentais seguem branch + testes + PR;
- regressão relevante de p75/p95 deve ser tratada antes de ampliar funcionalidade.

## Escopo operacional da fase

### 7A — Inventário de observabilidade e baseline real

Objetivo:
- levantar os eventos/propriedades técnicos já emitidos;
- identificar quais métricas realmente possuem amostra suficiente;
- medir p75/p95/p99 onde houver base confiável;
- separar desktop/mobile quando isso puder ser feito sem identificar pessoas;
- identificar lacunas antes de adicionar qualquer evento novo.

Entram:
- abertura e primeira página do PDF;
- PDF pronto;
- cache hit/miss;
- sincronização/falha do Drive;
- duração técnica de IA;
- falhas recuperáveis;
- tamanho/faixa técnica de documento quando já allowlisted e não identificável.

Não entra:
- conteúdo documental;
- identidade clínica;
- nome/ID/caminho de arquivo;
- ranking clínico.

### 7B — SLOs

Definir SLOs somente após baseline real.

Cada SLO deve registrar:
- métrica;
- população/ambiente;
- p75/p95/p99 quando aplicável;
- janela de medição;
- limite inicial;
- justificativa;
- estratégia de alerta/revisão.

Não definir metas por sensação isolada.

### 7C — Robustez e recuperação

Cobrir falhas recuperáveis em:
- rede;
- Google Drive;
- cache;
- PDF.js;
- OCR local;
- IA documental;
- cancelamento/troca de documento;
- conflito de versão;
- documentos grandes.

A recuperação nunca pode declarar sucesso antes da confirmação da fonte autoritativa.

### 7D — Matrizes de desempenho

Comparar:
- desktop vs mobile;
- PDF pequeno vs grande;
- texto nativo vs PDF-imagem/OCR;
- cache frio vs cache aquecido;
- abertura, navegação, edição e sincronização.

### 7E — Otimização guiada por evidência

Somente corrigir gargalos demonstrados por dados/testes.

Preferir:
- mudanças pequenas;
- reversíveis;
- com medição antes/depois;
- sem nova funcionalidade de produto quando uma otimização suficiente resolver o problema.

## Estado inicial recuperado

A baseline funcional ao abrir a Fase 7 inclui:
- PDF.js próprio;
- editor Titon;
- sincronização controlada com Drive;
- IA documental V8C.2;
- cache/prefetch da Fase 6;
- TextLayer nativa;
- OCR local para PDFs digitalizados;
- bloco de notas temporário móvel/redimensionável;
- confirmações visuais de cópia e renomeação.

A Fase 7 não deve reabrir essas decisões sem evidência de regressão.

## Acesso ao PostHog do Portal — RESOLVIDO — 21/09/2026

O conector foi reconciliado com a organização **Regulação de saúde** e com o projeto analítico **Default project** (project id 602473).

Validação:
- o projeto selecionado contém os eventos técnicos da Central esperados pela instrumentação atual, incluindo `portal_page_ready`, `portal_web_vital`, `pdf_open_started`, `pdf_first_page_visible`, `pdf_ready`, `drive_folder_opened`, `drive_search_completed`, `pdf_edit_completed`, `drive_sync_started`, `drive_sync_completed`, `drive_sync_failed`, `document_ai_started`, `document_ai_completed` e `document_background_task`;
- portanto, esse é o projeto correto para a baseline 7A;
- nenhuma chave/token foi documentado ou exposto;
- o Portal já está enviando esses eventos ao projeto, então não foi necessária alteração no Worker ou no frontend.

A seleção ativa do projeto no conector é contexto de sessão do PostHog; se uma sessão futura abrir em outro projeto, deve-se selecionar novamente a organização **Regulação de saúde** e o projeto **Default project** antes de consultar métricas da Central.

## Próxima ação exata

1. auditar no código todos os eventos/propriedades allowlisted da Central;
2. mapear cada evento para as métricas exigidas pelo Guia;
3. usar o projeto PostHog já reconciliado da organização **Regulação de saúde**;
4. coletar baseline p75/p95/p99 e cache hit/miss;
5. definir os primeiros SLOs a partir dos dados reais;
6. abrir correções de gargalo apenas depois dessa baseline.

## 7C — correção de falso conflito na renomeação após upload confirmado — 21/09/2026

Incidente real: após unir PDFs e concluir `replace_pdf` com confirmação do Google Drive, a renomeação imediata podia falhar com conflito de versão.

Causa:
- o Drive usa `version` para mudanças de conteúdo **e** metadados;
- o upload seguro já gera uma prova efêmera selada do conteúdo confirmado;
- o preflight de sincronização já reutilizava essa prova para tolerar somente incremento técnico posterior de `version` com conteúdo idêntico;
- a renomeação não reutilizava essa regra e exigia igualdade absoluta da versão.

Contrato da correção:
- o cliente envia o nome-base atual e a versão-base;
- se a versão ainda for igual, fluxo normal;
- se a versão avançou, a renomeação só pode prosseguir quando:
  1. a referência contém prova confirmada válida do último upload do mesmo usuário;
  2. arquivo e escopo continuam iguais;
  3. head revision, MD5 e tamanho continuam iguais;
  4. a versão atual é posterior à versão confirmada;
  5. o nome atual no Drive ainda é exatamente o nome-base enviado pelo cliente.
- qualquer mudança real de conteúdo ou renomeação concorrente continua retornando `DRIVE_VERSION_CONFLICT`.

A regra evita dois extremos inseguros:
- falso conflito por estabilização técnica do Drive;
- sobrescrita silenciosa de renomeação concorrente.

Aceite de regressão:
- união → sincronização confirmada → renomeação deve funcionar sem reabrir o PDF;
- mudança concorrente real de nome continua bloqueada;
- mudança concorrente real de conteúdo continua bloqueada;
- sucesso só aparece após PATCH confirmado pelo Google Drive.

## 7C — confirmação estabilizada de renomeação — 21/09/2026

Depois da primeira correção de versionamento, o caso real ainda falhou mesmo com Worker atualizado. A falha remanescente foi tratada como problema de **confirmação pós-PATCH**, não como novo conflito de versionamento.

A Files API confirma o PATCH de nome primeiro; em seguida o Titon faz GET direto por ID para confirmar nome, versão e identidade do conteúdo. Uma leitura única e imediata pode observar metadado ainda não estabilizado.

A correção desta rodada:
- mantém exatamente **um** PATCH de renomeação;
- faz até quatro leituras de confirmação por ID com esperas curtas: 0 ms, 120 ms, 320 ms e 700 ms;
- encerra assim que o nome esperado aparece;
- se o nome esperado não aparecer, continua retornando falha;
- detecção de conflito de conteúdo permanece;
- não há retry do PATCH e não há sobrescrita cega;
- o cliente mostra a mensagem real do backend quando não for conflito de versão.

Critério de regressão:
- um metadado temporariamente antigo depois do PATCH não deve produzir falso erro;
- uma renomeação concorrente ou mudança real continua impedindo confirmação;
- nenhuma falha pode ser apresentada como sucesso sem GET confirmando o nome esperado.

### Homologação real do incidente de renomeação

Resultado em 21/09/2026: **aprovado em uso real**.

O operador repetiu o fluxo união → sincronização confirmada → renomeação após a publicação da confirmação estabilizada e informou que passou a funcionar.

Estado:
- incidente encerrado;
- sem nova alteração funcional necessária;
- proteções de concorrência e confirmação do Google Drive permanecem obrigatórias.

## 7A — baseline real V1 e cobertura adicional — 21/09/2026

Baseline persistida em `docs/CENTRAL-DOCUMENTOS-BASELINE-7A.md`.

Resultado da coleta real:
- cache de PDF já demonstra ganho forte: `pdf_ready` p95 ~544 ms em hit contra ~9,9 s em miss no histórico disponível;
- últimas 24 h: hit 67,1% com p95 ~515 ms; miss 32,9% com p95 ~16,0 s;
- primeira página visível nas últimas 24 h: p95 ~7,1 s;
- pasta Drive: p95 ~5,0 s; pesquisa Drive: p95 ~5,9 s;
- IA documental: 29 conclusões reais, p95 histórico ~31,9 s; amostra ainda curta e cauda longa;
- Drive sync: 48 sucessos / 26 falhas no histórico, todas as falhas com HTTP 409; causa ainda não separável pelo schema antigo;
- `warm_pdf` cancelado tem p95 ~18,9 s e merece revisão depois de distinguir contexto;
- 3 PDFs `large` e nenhum `very_large`: amostra insuficiente para SLO específico;
- não havia dimensão mobile/desktop;
- não havia telemetria de tempo nativo vs OCR.

Decisão:
- não abrir 7B/SLOs ainda com dimensões críticas ausentes;
- ampliar somente telemetria técnica coarse e allowlisted;
- adicionar `viewport_class=mobile|desktop`, `failure_kind` coarse e eventos de resultado da camada textual `native|ocr|none`;
- manter conteúdo, nomes, IDs, páginas, coordenadas, confiança OCR e texto completamente fora da telemetria.

O catálogo governado de métricas do PostHog não está acessível pela conexão atual por ausência do escopo `data_catalog:read`. A baseline é explicitamente **não canônica** até esse acesso existir.

**Próxima ação:** publicar a cobertura 7A, acumular amostra real e repetir os percentis por viewport/text_mode/failure_kind antes de definir SLOs.

## 7A — painel técnico consolidado — 21/09/2026

O dashboard existente **Portal Regulação — Observabilidade Técnica** foi ampliado com uma seção específica da Central de Documentos, evitando duplicação de painéis.

Cobertura adicionada:
- PDF pronto por cache;
- sincronização Drive e `failure_kind`;
- IA por tamanho;
- background prepared/cancelled;
- viewport + cache;
- texto selecionável nativo/OCR.

Os dois últimos dependem da instrumentação publicada na PR #384 e ainda aguardam amostra real suficiente.

A 7A permanece **aberta**. Critério para avançar a 7B:
- observar amostra não legada de `viewport_class`;
- observar `failure_kind` em falhas novas do Drive/IA;
- observar `document_text_layer_ready` ou `document_text_layer_failed`;
- recalcular percentis com essas dimensões;
- somente então propor SLOs iniciais.



## 7E — primeira otimização guiada por evidência do sync Drive — 21/09/2026

Nova evidência de uso real confirmou que a sincronização de substituição do PDF continua lenta mesmo após a instrumentação 7A.

Amostra observada no PostHog antes desta alteração:
- último `replace_pdf` small V2: **15.677 ms**;
- small V1, últimas 24 h: n=26, p95 **18.719 ms**;
- small V2: n=2, p95 **17.403 ms**;
- medium V2: n=4, p95 **25.654 ms**.

Diagnóstico no código:
- o frontend fazia `POST /api/documents/drive/sync/preflight`;
- logo depois fazia `POST /api/documents/drive/sync/start`;
- `startDriveSync()` já executa `driveSyncPreflightState()` antes de preservar revisão e antes de iniciar qualquer upload;
- portanto o mesmo preflight autoritativo fazia uma leitura de metadados do Google Drive duas vezes em série.

Correção na branch `perf/central-docs-drive-sync-fastpath-20260921`:
- remover somente o preflight HTTP redundante do frontend;
- manter o preflight obrigatório dentro de `/sync/start`;
- manter preservação da revisão anterior, sessão resumable, confirmação do upload, checagem de versão/head/MD5/tamanho e bloqueio de conflito;
- renovar o cache-buster do cliente para `documents.js?v=20260921-11`;
- adicionar regressão estática exigindo que o frontend não faça o preflight separado e que `startDriveSync()` execute preflight antes de iniciar o upload.

Efeito esperado: eliminar uma chamada serial Worker → Google Drive por sincronização, sem reduzir a integridade nem a detecção de conflito. **Não registrar ganho percentual antes do pós-deploy real.**

Próxima ação: validar CI, integrar se verde e comparar as novas amostras V2 de `drive_sync_completed` com a baseline acima. Se a cauda continuar alta, decompor o tempo entre geração local, start/preflight, upload e confirmação antes da próxima otimização.


## 7E — segunda otimização: lista, pesquisa e decomposição do sync Drive — 21/09/2026

Nova evidência de uso real mostrou que a latência percebida não estava limitada ao upload do Titon. A própria navegação documental pela API do Google Drive também apresentava atraso incompatível com a experiência esperada.

Baseline V2 desktop imediatamente anterior a esta alteração:
- `drive_folder_opened`: n=6; p50 **3.972 ms**; p95 **4.542 ms**;
- `drive_search_completed`: n=8; p50 **4.428 ms**; p95 **7.072 ms**;
- buscas com apenas 1–5 resultados ainda levaram aproximadamente **4,1–7,1 s**;
- `drive_sync_completed`: n=9; p50 **13.855 ms**; p95 **20.130 ms**;
- após a primeira otimização do sync, os dois resultados small mais recentes foram **11.323 ms** e **13.855 ms**: melhora parcial, ainda insuficiente.

Diagnóstico do caminho lista/pesquisa:
- o Worker solicitava até **80 itens** já na primeira página;
- pedia `orderBy=folder,name_natural` ao Drive e o frontend ordenava novamente;
- depois da resposta do Google, `mapDriveFiles()` processava os itens **serialmente**;
- cada item repetia derivação/importação de chave criptográfica para selar a referência;
- também era calculado `cacheKey` para pastas e tipos não-PDF, embora essa chave só seja usada pelo cache de PDF;
- a busca sempre apagava a lista e aguardava a pesquisa remota mesmo quando o item já existia na pasta atualmente carregada.

Correção na branch `perf/central-docs-drive-navigation-fastpath-20260921`:
- primeira página de pasta/pesquisa reduzida para **40 itens**; paginação adicional continua aceitando 80;
- removido o `orderBy` remoto redundante; a ordenação local existente continua determinística;
- `mapDriveFiles()` passa a usar concorrência limitada a 16 itens;
- chaves AES/HMAC derivadas no Worker são reutilizadas dentro do isolate, em vez de recalculadas por item;
- `cacheKey` passa a ser criado somente para PDFs;
- a última pasta carregada fica apenas **em memória da aba** e pode ser redesenhada imediatamente durante refresh;
- ao pesquisar, nomes já presentes nessa fotografia em memória aparecem imediatamente enquanto a pesquisa autoritativa no Drive continua e substitui o resultado;
- nenhum nome, termo de pesquisa, ID do Drive ou metadado clínico é persistido nessa fotografia ou enviado à observabilidade.

Instrumentação adicionada para separar a próxima causa:
- pasta/pesquisa: `drive_token_ms`, `drive_api_ms`, `drive_map_ms`;
- sincronização: `build_ms`, `drive_start_ms`, `drive_upload_ms`;
- todas são durações técnicas numéricas allowlisted; a consulta e o nome do arquivo continuam proibidos.

A segurança permanece:
- resultado remoto continua sendo a fonte autoritativa;
- referências do Drive continuam seladas;
- permissões/capabilities continuam no backend;
- não há cache persistente novo de nomes/listagens;
- sincronização continua dependendo da confirmação real do Drive.

**Próxima ação exata:** validar CI e navegador, integrar/publicar se verde, executar uma recarga forte única e observar uso real. A próxima decisão de desempenho deve usar a decomposição token/API/map e build/start/upload, evitando nova otimização por hipótese.

## 7E — preload autorizado da Central logo após login — 22/09/2026

Pedido operacional: para contas que possuem a função Central de Documentos, preparar a ferramenta em segundo plano imediatamente após a autenticação, de modo que o primeiro acesso não precise repetir toda a inicialização.

Evidência anterior ao preload:
- `portal_page_ready /documentos/`: n=23, p50 **1.216 ms**, p75 **3.085 ms**, p95 **3.429 ms**, p99 **3.905 ms**;
- `drive_folder_opened`: n=45, p50 **3.923 ms**, p75 **4.321 ms**, p95 **4.555 ms**, p99 **4.897 ms**;
- `drive_search_completed`: n=45, p50 **4.157 ms**, p75 **4.569 ms**, p95 **6.940 ms**, p99 **8.741 ms**.

Diagnóstico:
- o Portal já aquecia a rota pública `/documentos/` depois do login;
- porém acesso documental, preferências, configuração da IA e primeira listagem do Drive continuavam sendo buscados somente ao entrar na Central;
- PDF.js e OCR também podiam ser carregados somente depois da navegação.

Arquitetura escolhida:
- somente contas cuja sessão já indica `documentCapabilities.view` ou `manage`, sem bloqueio de primeiro acesso/verificação, disparam o preload;
- o Service Worker aquece a página e recursos públicos do Titon, PDF.js, PDF-lib e runtime OCR;
- as respostas privadas de `/access`, preferências, configuração de IA e raiz do Drive ficam **somente em RAM do Service Worker**, com TTL de 90 s e renovação em torno de 30 s;
- o token bruto não é persistido: a chave da fotografia privada é um digest SHA-256 da autorização e o payload não vai para Cache Storage, localStorage, sessionStorage ou IndexedDB;
- logout/invalidação de sessão incrementa uma geração e impede que uma operação antiga republique o snapshot depois da limpeza;
- ao abrir a Central, `/api/documents/access` continua sendo consultado ao vivo **antes** de qualquer lista aquecida ser apresentada;
- somente após a permissão atual ser confirmada a lista em memória pode ser exibida; em seguida ocorre refresh autoritativo do Drive em segundo plano;
- nenhuma tentativa é feita de pré-baixar PDFs dos pacientes: “pronto” significa interface, motores e dados iniciais da raiz preparados, não conteúdo documental indiscriminado.

A decisão preserva menor privilégio e invalidação de permissões, enquanto antecipa o custo seguro de inicialização. Nenhum nome, ID, termo de pesquisa ou conteúdo é enviado ao PostHog.

Critério de aceite desta rodada:
1. usuário sem Central não dispara preload privado;
2. usuário autorizado dispara preload após login sem bloquear a navegação;
3. primeira abertura confirma permissão ao vivo antes de usar snapshot;
4. logout impede reaparecimento de snapshot concluído tardiamente;
5. dados privados do preload não são persistidos em armazenamento do navegador;
6. fallback antigo continua funcional se o preload não estiver disponível;
7. medir `drive_folder_opened cache_state=hit` após publicação antes de declarar ganho percentual.


### Publicação do preload pós-login

A implementação descrita acima foi integrada pela PR **#390**, merge `0f569eed3e6e343fb5e82a48164c4b343134fcee`.

O Worker produtivo foi publicado com sucesso (Version ID `63de9dc0-9c44-4ea8-8d96-9cf4c286a220`) e os deploys de página também concluíram. Um check posterior de Worker Preview, provocado pela branch documental, falhou sem invalidar a publicação produtiva anterior. O critério funcional de código/privacidade foi atendido; o critério de desempenho continua dependente de amostra real posterior ao deploy, especialmente `drive_folder_opened cache_state=hit`.

## 7E — pastas prioritárias Consulta [2026] e Exames [2026] — 22/09/2026

Decisão operacional explícita: manter aquecidas as pastas **Consulta [2026]** e **Exames [2026]** e também pré-carregar os PDFs diretamente contidos nelas, para reduzir ao mínimo o tempo entre entrar na Central, abrir uma dessas pastas e abrir um documento.

Implementação:
- o preload pós-login procura as duas pastas por nome exato normalizado, primeiro na raiz já aquecida e, se necessário, pela busca do Drive;
- se houver ambiguidade de nome fora da raiz, a pasta não é escolhida automaticamente;
- para cada pasta resolvida, a listagem é carregada em páginas de até 100 itens, limitada a 6 páginas por ciclo; se houver mais itens, o token de continuação é preservado para a navegação normal;
- o snapshot das duas pastas permanece somente em RAM do Service Worker, junto do preload privado já existente;
- ao abrir uma pasta prioritária, a lista aquecida é mostrada imediatamente e a listagem autoritativa do Google Drive continua em segundo plano;
- PDFs elegíveis dessas pastas são baixados em segundo plano e gravados no **cache local criptografado existente** (`AES-GCM`), identificado apenas por `cacheKey + version`;
- o cache não grava nome do arquivo, pasta, paciente ou Drive ID;
- cada versão nova do arquivo gera identidade diferente e substitui a anterior quando armazenada;
- logout continua limpando o cache documental.

Limites de segurança preservados do cache existente:
- até **50 MB por PDF**;
- até **256 MB no total**;
- TTL de **12 horas**;
- em conexão com economia de dados, 2G ou slow-2G, o pré-download de PDFs não roda;
- concorrência de pré-download limitada a 2 arquivos para não saturar o computador/rede.

O preload dos conteúdos é uma exceção deliberada à decisão anterior de não pré-baixar PDFs, autorizada agora pelo operador especificamente para estas duas pastas. A exceção usa apenas armazenamento criptografado local e mantém o gate de permissão ao vivo antes da exibição de qualquer listagem aquecida.

Critério de aceite: as duas pastas devem abrir a partir de `cache_state=hit` quando o preload estiver pronto; PDFs já presentes no cache criptografado devem abrir pelo caminho de cache existente, enquanto arquivos fora do limite continuam com fallback normal de rede.


### Publicação das pastas prioritárias

A PR **#392** foi mesclada pelo commit `41da8b235ac461cf773d15bb9be1b9c457c6d144`. O pós-merge concluiu **54/54 checks verdes** e o Worker produtivo publicou a Version ID `0391b3ee-878d-4e99-a45a-368ff462dbcb`.

O comportamento está ativo em produção, mas o aceite de desempenho depende agora de dados reais: verificar `drive_folder_opened cache_state=hit` nas duas pastas e `pdf_ready cache_state=hit` para PDFs já aquecidos. Nenhum ganho percentual é declarado antes dessa amostra.
