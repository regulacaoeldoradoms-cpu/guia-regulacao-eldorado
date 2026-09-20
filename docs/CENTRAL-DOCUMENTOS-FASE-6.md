# Central de Documentos — Fase 6: Automação operacional

Data de início: 20/09/2026.

## Estado

**IMPLEMENTAÇÃO 6A–6E CONCLUÍDA EM BRANCH; aguardando CI e validação operacional.**

A Fase 6 começa da `main` com as Fases 0–5 encerradas. Não reabre editor, sincronização, permissões, arquitetura da IA documental nem a frente de micro-otimização de latência da Fase 5.

## Objetivo do Guia Mestre

Preparar em segundo plano, quando for seguro:
- miniaturas;
- leitura inicial;
- classificação de páginas;
- próximos documentos prováveis.

A automação deve **sugerir ações** e nunca executar mudança destrutiva sem regra explícita.

Critério de aceite da fase:
- redução mensurável de tempo operacional;
- sem perda de controle do usuário.

## Diagnóstico de entrada

Já existe infraestrutura útil que deve ser reutilizada em vez de duplicada:

### Visualização e miniaturas
- o visualizador PDF.js possui geração lazy de miniaturas por `IntersectionObserver`;
- miniaturas inválidas em troca de modo são reobservadas em vez de renderizar o documento inteiro;
- a primeira página e páginas visíveis têm prioridade.

### Cache e pré-aquecimento
- a Fase 2 já implementou cache local criptografado em IndexedDB;
- chave derivada da sessão; logout/troca de sessão limpa o cache;
- versão do Drive participa da invalidação;
- PDFs de até 12 MiB podem ser pré-aquecidos;
- itens prováveis/hover/focus já podem aquecer o PDF sem persistir conteúdo em texto puro.

### IA documental
- a V8C.2 é o baseline aprovado;
- processamento continua isolado por página;
- o frontend já consegue exportar imagem efêmera de uma página pelo PDF.js;
- o fluxo atual de extração começa somente após ação explícita do usuário;
- resultados/evidências continuam apenas em memória;
- nenhuma identificação documental pode entrar no PostHog.

## Decisões de arquitetura da Fase 6

1. **Não duplicar o cache da Fase 2.** Automação de próximos documentos deve usar o cache criptografado existente e sua invalidação.
2. **Não renderizar todas as miniaturas agressivamente.** O visualizador lazy continua sendo a fonte de verdade; a Fase 6 pode ampliar preparação apenas dentro de um orçamento de background.
3. **Não iniciar escrita no Drive automaticamente.** Ações de edição/salvamento continuam exigindo as regras da Fase 4.
4. **Não executar IA documental em background de forma irrestrita.** Qualquer leitura/classificação antecipatória exige capability `extract`, gates corretos, documento ativo e orçamento/cancelamento; resultados permanecem sugestões/estado efêmero.
5. **Não registrar conteúdo, nome, ref, fileId ou identidade clínica em observabilidade.**
6. **Automação deve ser cancelável.** Troca de PDF, logout, mudança de sessão, início de edição ou ação prioritária do usuário deve interromper/preemptar tarefas de fundo.
7. **Prioridade do usuário vence background.** Nunca atrasar primeira página, rolagem, edição ou sincronização por uma tarefa antecipatória.

## Subfases propostas

### 6A — Orquestrador de background e métricas

Objetivo:
- criar uma fila/orquestrador leve para tarefas antecipatórias;
- executar somente em idle/baixa prioridade;
- cancelar na troca de documento/sessão;
- definir orçamento de concorrência;
- medir apenas tempos/contagens técnicas.

Escopo inicial:
- inventariar tarefas já existentes de thumbnail/cache/IA;
- consolidar cancelamento e prioridade;
- criar eventos técnicos allowlisted para medir preparo e uso real das sugestões;
- **sem nova chamada de IA ainda**.

Aceite 6A:
- nenhuma tarefa de background atrasa a primeira página;
- cancelamento comprovado;
- observabilidade sem dados sensíveis;
- métricas permitem medir tempo poupado ou trabalho descartado.

### 6B — Preparação antecipatória do documento ativo

Objetivo:
- após `pdf_ready`, preparar de forma oportunista recursos da próxima ação provável do **documento já aberto**.

Candidatos:
- miniaturas próximas da área visível;
- representação efêmera de páginas para futura classificação;
- metadados técnicos necessários ao painel.

Regras:
- sem persistência clínica;
- sem chamada ao provider se a IA não estiver explicitamente autorizada para o ambiente;
- cancelamento imediato ao fechar/trocar PDF.

### 6C — Leitura/classificação inicial sugerida

Objetivo:
- quando gates/capability permitirem, antecipar somente classificação/extração que seja segura e útil;
- apresentar o resultado como preparo/sugestão, nunca como ação destrutiva;
- reutilizar resultado se o usuário acionar `Extrair dados do PDF`, desde que documento/versão/sessão ainda coincidam.

Aceite:
- redução mensurável do tempo entre clique e resultado;
- nenhuma mistura de versões/documentos;
- nenhum dado persistido indevidamente.

### 6D — Próximos documentos prováveis

Objetivo:
- aquecer documentos prováveis sem inventar ranking clínico.

Primeira estratégia permitida:
- posição/visibilidade na lista;
- navegação recente apenas em memória da sessão;
- hover/focus;
- pasta atual.

Não usar:
- diagnóstico;
- CID;
- nome de paciente;
- texto extraído;
- conteúdo do PDF;
- qualquer inferência clínica para ranking.

### 6E — Sugestões operacionais e aceite da fase

Objetivo:
- mostrar sugestões claras de próxima ação;
- medir ganho real de tempo operacional;
- preservar confirmação humana para ações com efeito.

Critério final:
- redução mensurável de tempo em fluxo real;
- sem regressão de controle, privacidade, integridade ou sincronização.

## Observabilidade

Eventos/propriedades novas só podem ser adicionados depois de allowlist explícita no frontend e backend.

Categorias aceitáveis:
- tarefa técnica;
- duração;
- estado `prepared|used|cancelled|expired|failed`;
- contagem/faixa;
- motivo técnico de cancelamento;
- cache hit/miss.

Proibido:
- nome de arquivo;
- ref/fileId/cacheKey;
- nome/CPF/CNS;
- CID/diagnóstico;
- texto extraído;
- conteúdo de prompt/resposta;
- nome da pasta ou caminho do Drive.

## Próxima ação exata

Validar em CI a implementação 6A–6E desta branch e, se verde, integrá-la na `main`. Depois, executar a validação operacional real de ganho de tempo e controle do usuário antes de encerrar formalmente a Fase 6.


## Implementação 6A–6E — 20/09/2026

Branch: `feat/central-docs-phase6-automation`.

### 6A implementada
- novo `js/document-background.js`;
- fila de baixa prioridade com concorrência máxima 1;
- `requestIdleCallback` quando disponível;
- deduplicação por chave;
- `AbortController` por tarefa;
- cancelamento por escopo e cancelamento global;
- pausa durante ação foreground/editor;
- cancelamento em ocultação da aba e limpeza de sessão;
- telemetria allowlisted `document_background_task`.

Estados de telemetria:
- `prepared`;
- `used`;
- `cancelled`;
- `expired`;
- `failed`;
- `skipped`.

Nenhum nome, ref, fileId, cacheKey ou conteúdo é enviado à observabilidade.

### 6B implementada
- `PortalPdfViewer.prewarmThumbnails()` reutiliza a renderização lazy existente;
- até três miniaturas iniciais podem ser pré-aquecidas somente depois de o viewer estar pronto;
- até duas imagens efêmeras para futura IA podem ser preparadas quando a IA documental está disponível;
- blobs ficam somente em memória do documento aberto e são apagados ao trocar/fechar PDF;
- primeira página e ações do usuário continuam prioritárias.

### 6C implementada com gate adicional
- novo gate `DOCUMENTS_AI_BACKGROUND_ENABLED`;
- produção mantém `DOCUMENTS_AI_BACKGROUND_ENABLED=false`;
- a preextração só ocorre se `enabled + processingEnabled + backgroundPreparation + capability extract` estiverem todos ativos;
- no máximo duas páginas são antecipadas;
- resultado fica somente em `Map` efêmero da sessão do PDF;
- ao clicar `Extrair dados do PDF`, resultados antecipados válidos são reaproveitados;
- ação humana cancela qualquer tarefa ainda em execução e assume prioridade;
- escrita no Drive não faz parte desse caminho.

### 6D implementada
O aquecimento de PDFs prováveis usa somente sinais operacionais:
- itens recentes da sessão representados por identidade opaca de cache;
- posição na lista;
- hover/focus;
- pasta/lista atual.

Continua proibido usar nome de paciente, CID, diagnóstico, texto extraído ou conteúdo do PDF para ranking. O cache usado continua sendo o cache criptografado da Fase 2.

### 6E implementada
- quando uma página de IA já foi preparada em background, o Portal mostra sugestão discreta de que o preparo será reaproveitado;
- nenhuma extração destrutiva, edição ou sincronização é disparada pela sugestão;
- o clique do usuário continua sendo a ação que materializa o fluxo principal;
- telemetria registra apenas preparo/uso/cancelamento técnico.

## Segurança adicional

A Fase 6 não liga automaticamente a IA de produção. O novo gate `DOCUMENTS_AI_BACKGROUND_ENABLED=false` impede chamada antecipatória ao provider até ativação explícita em ambiente autorizado.

A implementação também não altera:
- OAuth;
- capability `edit`;
- gates de escrita;
- autosync;
- contrato V8C.2;
- armazenamento do cache criptografado.

## Validação automatizada prevista

A suíte passa a exigir:
- orquestrador carregado antes de `documents.js`;
- concorrência unitária/cancelamento;
- gate triplo da IA antecipatória;
- reutilização efêmera;
- ranking não clínico;
- ausência de escrita automática;
- allowlist de observabilidade frontend/backend;
- bundle de staging contendo o novo módulo.

## Pendência para aceite final da Fase 6

Após CI verde e merge, ainda é necessário comprovar em uso real:
1. nenhuma regressão de abertura/primeira página;
2. tarefas canceladas ao trocar documento ou entrar no editor;
3. cache/prefetch reduz tempo de abertura ou de próxima ação em pelo menos um fluxo observado;
4. quando o gate de IA antecipatória for homologado separadamente, o clique em extração reutiliza preparo sem misturar documentos.

Até essa medição, a Fase 6 fica **implementada, mas não formalmente encerrada**.
