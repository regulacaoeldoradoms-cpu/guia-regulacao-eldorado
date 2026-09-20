# Central de Documentos — Fase 6: Automação operacional

Data de início: 20/09/2026.

## Estado

**INICIADA após o encerramento formal da Fase 5.**

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

Implementar **6A — orquestrador de background e métricas**, começando por auditoria dos pontos de cancelamento/prioridade em `js/documents.js`, `js/document-viewer.js` e `js/document-cache.js`, sem ativar nova automação de IA nesta primeira unidade.
