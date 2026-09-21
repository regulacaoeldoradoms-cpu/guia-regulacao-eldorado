# CENTRAL DE DOCUMENTOS — FASE 7A — BASELINE DE OBSERVABILIDADE V1

Data da coleta: 21/09/2026  
Projeto PostHog: **Regulação de saúde / Default project (602473)**  
Estado: **baseline real coletada; cobertura adicional em implementação**

## Escopo e regra de interpretação

Esta baseline usa somente eventos técnicos já produzidos pela Central de Documentos/Titon e armazenados no PostHog.

Privacidade preservada:
- nenhum nome de paciente;
- nenhum CPF/CNS;
- nenhum diagnóstico/CID;
- nenhum conteúdo do PDF;
- nenhum nome/ref/Drive ID de arquivo;
- nenhuma pergunta/resposta da IA.

O catálogo governado de métricas do PostHog **não pôde ser consultado**, porque a conexão atual não possui o escopo `data_catalog:read`. Portanto os números abaixo são **derivações não canônicas**, calculadas diretamente da taxonomia verificada de eventos/propriedades. Não tratá-las como métricas governadas até esse escopo existir e o catálogo ser revisado.

## Janela disponível

Os eventos da Central começaram a aparecer em datas diferentes:
- `portal_page_ready`: desde 11/09/2026;
- abertura/prontidão de PDF: desde 12/09/2026;
- sincronização Drive: desde 17/09/2026;
- IA documental e background: desde 20/09/2026.

Assim, “30 dias” significa **todo o histórico disponível dentro dos últimos 30 dias**, não 30 dias completos de produção.

## Baseline de PDF

### PDF pronto — todo histórico disponível

Amostra: **201** eventos `pdf_ready`.

| Cache | n | Participação | p75 | p95 | p99 |
| --- | ---: | ---: | ---: | ---: | ---: |
| hit | 129 | 64,2% | 358 ms | 544 ms | 753 ms |
| miss | 72 | 35,8% | 6.845 ms | 9.918 ms | 23.658 ms |

Distribuição por tamanho:
- tiny: 19;
- small: 151;
- medium: 28;
- large: 3;
- very_large: **0**.

Interpretação:
- o cache local está entregando ganho real e muito expressivo;
- o gargalo principal de abertura está no caminho **cache miss / Drive**;
- ainda não existe amostra real suficiente de PDFs `large` e não existe amostra de `very_large` para SLO específico.

### PDF pronto — últimas 24 horas

Amostra: **73**.

| Cache | n | Participação | p75 | p95 | p99 |
| --- | ---: | ---: | ---: | ---: | ---: |
| hit | 49 | 67,1% | 436 ms | 515 ms | 699 ms |
| miss | 24 | 32,9% | 6.545 ms | 16.034 ms | 20.895 ms |

Outros percentis nas últimas 24 horas:
- primeira página visível: n=73; p75 **5.102 ms**; p95 **7.113 ms**; p99 **18.475 ms**;
- PDF pronto: n=73; p75 **5.130 ms**; p95 **7.136 ms**; p99 **18.796 ms**;
- abertura de pasta: n=61; p75 **4.323 ms**; p95 **5.040 ms**; p99 **6.469 ms**;
- pesquisa Drive: n=40; p75 **4.196 ms**; p95 **5.880 ms**; p99 **6.653 ms**.

## Baseline de sincronização com Google Drive

Histórico disponível:
- `drive_sync_completed`: **48**;
- `drive_sync_failed`: **26**;
- `drive_sync_started`: **74**.

Todas as falhas registradas possuem HTTP **409**.

Nas últimas 24 horas:
- concluídas: **26**;
- falhas: **18**;
- taxa bruta de falha: **40,9%**.

Essa taxa **não pode ser tratada ainda como taxa de indisponibilidade do Drive**. O schema atual registra status 409, mas não diferencia de forma confiável:
- conflito legítimo de versão;
- sessão de upload que precisa ser reiniciada;
- outro erro recuperável que também termine em 409.

Por isso, a Fase 7A adicionará a dimensão técnica coarse `failure_kind`. Até essa amostra existir, **não definir SLO de erro do Drive**.

Latência das sincronizações concluídas:
- medium, n=3: p95 **18.286 ms**;
- small, n=35: p95 **18.781 ms**;
- tiny, n=10: p95 **31.162 ms**.

Amostra ainda pequena para separar SLO por tamanho.

## Baseline da IA documental

Histórico disponível:
- iniciadas: **29**;
- concluídas: **29**;
- evento `document_ai_failed`: nenhum observado na taxonomia até esta coleta.

Isso significa apenas que **nenhuma falha foi observada nessa amostra**; não prova taxa de falha zero permanente.

Latência:
- geral: p75 **11.841 ms**; p95 **31.930 ms**; p99 **58.309 ms**;
- últimas 24 horas: n=24; p75 **13.925 ms**; p95 **32.734 ms**; p99 **60.051 ms**;
- small: n=28; p95 **29.229 ms**;
- medium: n=1; amostra insuficiente.

Ainda não definir SLO separado por tamanho.

## Web Vitals da rota /documentos/ — últimas 24 horas

| Métrica | n | p75 | p95 | p99 |
| --- | ---: | ---: | ---: | ---: |
| CLS | 26 | 0,16 | 0,178 | 0,188 |
| FCP | 27 | 522 ms | 1.587 ms | 2.363 ms |
| INP | 23 | 148 ms | 214 ms | 253 ms |
| LCP | 26 | 523 ms | 1.659 ms | 2.368 ms |

Esses dados são úteis como baseline técnica, mas ainda não estão separados por layout mobile/desktop.

## Background da Fase 6 — últimas 24 horas

`document_background_task` tem volume alto e precisa ser observado para não consumir recursos sem ganho operacional.

Principais resultados:
- `prepare_page / prepared`: n=728; p95 **127 ms**;
- `prepare_page / cancelled`: n=67; p95 **1.595 ms**;
- `prepare_page / failed`: n=6;
- `prepare_page / used`: n=44;
- `warm_pdf / prepared`: n=1.984; p95 **4.665 ms**;
- `warm_pdf / cancelled`: n=287; p95 **18.853 ms**;
- `warm_pdf / skipped`: n=3.

Conclusão preliminar: o warmup é um candidato real para análise de eficiência, principalmente cancelamentos longos. Não otimizar ainda sem separar melhor contexto/layout/cache.

## Lacunas comprovadas da instrumentação

### Mobile vs desktop

Consulta real:
- eventos centrais avaliados: **491**;
- com `$device_type`: **0**;
- com `$browser`: **0**.

Motivo: a telemetria passa pelo backend sanitizado e não encaminha User-Agent/fingerprint.

Correção 7A:
- adicionar somente `viewport_class = mobile|desktop`;
- derivação por largura do layout;
- não enviar resolução, User-Agent, modelo, navegador, memória, hardware ou identificador de dispositivo.

### Texto nativo vs OCR

A implementação já distingue localmente `native`, `ocr` e ausência de texto, mas não havia evento técnico para medir o tempo até o texto ficar selecionável.

Correção 7A:
- `document_text_layer_ready` com `duration_ms`, `text_mode=native|ocr`, `source=local`;
- `document_text_layer_failed` com `text_mode` e `failure_kind`;
- sem texto reconhecido, confiança, página, conteúdo ou coordenadas.

### Causa das falhas

Correção 7A:
- adicionar `failure_kind` coarse:
  `conflict`, `network`, `session`, `authorization`, `rate_limit`, `validation`, `provider`, `runtime`, `no_text`, `unsupported`, `unknown`;
- não enviar mensagem de erro, nome de arquivo ou conteúdo;
- `status_code` continua opcional quando existir HTTP válido.

## Gargalos demonstrados pelos dados

1. **Cache miss de PDF** é o maior gargalo de abertura observado.
2. **Drive list/search** ainda está na faixa de vários segundos.
3. **IA documental real** tem cauda longa: p95 ~32 s e p99 ~60 s na amostra atual.
4. **Sincronização do Drive** tem latência alta e taxa bruta 409 alta, mas a classificação de causa ainda é insuficiente.
5. **Warmup de PDF cancelado** apresenta cauda longa e merece análise após a nova instrumentação.
6. Mobile/desktop e OCR/nativo ainda não tinham cobertura, por isso qualquer conclusão nesses dois eixos seria especulação.

## Estado da Fase 7A

**Baseline V1 coletada com dados reais.**

A 7A ainda não deve ser considerada encerrada porque faltava cobertura para:
- mobile vs desktop;
- nativo vs OCR;
- causa coarse das falhas;
- amostra suficiente de PDFs large/very_large.

A instrumentação adicional é deliberadamente pequena, allowlisted e sem conteúdo sensível.

## Próxima ação

1. publicar a instrumentação 7A;
2. acumular amostra real após a publicação;
3. recalcular p75/p95/p99 por `viewport_class`, `text_mode`, cache e tamanho;
4. separar falhas recuperáveis de conflitos legítimos;
5. só então abrir **7B — SLOs**;
6. primeira otimização candidata, se os dados se mantiverem: caminho de abertura **cache miss / Drive**.

## Painel PostHog da Fase 7A — CRIADO/ATUALIZADO — 21/09/2026

Foi reutilizado o painel existente **Portal Regulação — Observabilidade Técnica** (dashboard id `2087919`) em vez de criar um dashboard duplicado.

Nova seção: **Central de Documentos — Fase 7**.

Insights adicionados:
- `9JVfMY1F` — **Central 7 — PDF pronto por cache**;
- `1m7X2CJM` — **Central 7 — Sincronização Drive**;
- `Bm9my01U` — **Central 7 — IA documental por tamanho**;
- `53aWB8al` — **Central 7 — Background prepared/cancelled**;
- `2BG73duF` — **Central 7 — PDF por viewport e cache**;
- `V1jDy4Hx` — **Central 7 — Texto selecionável nativo/OCR**.

Todos usam somente eventos/propriedades técnicos allowlisted e janelas temporais explícitas. Não há nome de paciente, CPF/CNS, CID, conteúdo de PDF, nome/ref/Drive ID ou texto da IA.

### Verificação após publicação da instrumentação 7A

A instrumentação da PR #384 foi publicada com Cloudflare Pages e Workers Builds em `success`.

Consulta pós-publicação encontrou eventos com `portal_observability_version=2`, confirmando que o backend novo está recebendo tráfego.

Até esta coleta, porém:
- `viewport_class` ainda não apareceu na taxonomia;
- `document_text_layer_ready/failed` ainda não apareceu na taxonomia;
- `failure_kind` ainda não apareceu em `drive_sync_failed`;
- houve pelo menos um `pdf_ready` V2 sem `viewport_class`.

Isso significa que **a cobertura nova ainda não possui amostra real suficiente**. Não concluir 7A nem abrir 7B com base nisso.

Hipótese operacional a verificar, não fato: parte desse tráfego pode vir de abas abertas antes da atualização do frontend, pois o backend V2 pode receber eventos de clientes antigos. A confirmação depende de eventos novos após recarga real do Portal.

### Baseline corrente de 7 dias no momento desta revisão

- `pdf_ready / hit`: n=101; p75 394 ms; p95 519 ms; p99 770 ms;
- `pdf_ready / miss`: n=42; p75 7.394 ms; p95 17.278 ms; p99 25.497 ms;
- Drive sync: 53 concluídas; 26 falhas ainda classificadas como `legacy_or_unknown`;
- IA documental small: n=30; p95 48.443 ms;
- IA documental medium: n=2; amostra insuficiente;
- warm_pdf/cancelled: n=357; p95 18.476 ms.

Conclusão preservada: cache miss/Drive e warmup cancelado continuam os principais candidatos de investigação, mas otimização só deve começar após a nova instrumentação gerar amostra suficiente por viewport/failure_kind/text_mode.



## Evidência adicional — sync Drive ainda lento antes da primeira otimização 7E — 21/09/2026

Após nova queixa em uso real, a telemetria confirmou que a latência de `replace_pdf` permanece material:

| Segmento | n | p50 | p75 | p95 | p99 |
| --- | ---: | ---: | ---: | ---: | ---: |
| small / V1 | 26 | 16.369 ms | 17.109 ms | 18.719 ms | 19.402 ms |
| small / V2 | 2 | 16.586 ms | 17.040 ms | 17.403 ms | 17.476 ms |
| medium / V2 | 4 | 22.707 ms | 23.994 ms | 25.654 ms | 25.986 ms |

Último evento observado antes da correção: `small / V2`, **15.677 ms**.

A inspeção do fluxo encontrou uma chamada redundante: o cliente executava `/sync/preflight` e depois `/sync/start`, enquanto `startDriveSync()` já repete o mesmo `driveSyncPreflightState()` antes de qualquer upload.

A primeira otimização 7E remove apenas o preflight HTTP duplicado do cliente. O preflight autoritativo, a preservação de revisão, a sessão resumable e a confirmação final continuam no Worker.

Esta seção é a **baseline pré-otimização**. O ganho será avaliado somente com amostras pós-publicação.
