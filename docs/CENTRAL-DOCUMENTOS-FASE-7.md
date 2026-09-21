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

