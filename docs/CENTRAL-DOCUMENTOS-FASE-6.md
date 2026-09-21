# Central de Documentos — Fase 6: Automação operacional

Data de início: 20/09/2026.

## Estado

**IMPLEMENTAÇÃO 6A–6E INTEGRADA NA `main`; aguardando somente validação operacional real para encerramento formal.**

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

Executar a validação operacional real documentada em `CENTRAL-DOCUMENTOS-HOMOLOGACAO-6.md`. Nenhuma nova implementação estrutural deve ser feita antes dessa medição, salvo correção de regressão encontrada.


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


## Integração da implementação 6A–6E — 20/09/2026

A PR **#342** foi integrada na `main` pelo merge `87b7b7b274d8d6392bfacd85e18eab19dc672885`.

Evidências:
- head funcional `de1ddc5de6346da0911e6e2fc7ca86abb2b260a9`;
- comparação head funcional → merge final: **zero arquivos diferentes**;
- **27 workflows/checks verdes** no head funcional;
- validação Fases 1–6: sucesso;
- navegador Central: sucesso;
- staging bundle: sucesso;
- governança: sucesso;
- deploy seguro do Worker: sucesso;
- Cloudflare Pages staging publicado em `https://a2d88ca3.portal-regulacao-central-staging.pages.dev`.

Estado após merge:
- código 6A–6E está integrado;
- produção mantém `DOCUMENTS_AI_BACKGROUND_ENABLED=false`;
- cache/prefetch não clínico pode operar com a infraestrutura já autorizada;
- IA antecipatória continua desligada em produção;
- nenhuma escrita automática foi introduzida.

A Fase 6 **não está encerrada ainda**. Falta somente a evidência operacional do critério do Guia Mestre: redução mensurável de tempo sem perda de controle do usuário.


## Extensão operacional do Titon — renomeação real, zoom legível e presença simultânea — 21/09/2026

Durante a homologação da Fase 6, o operador definiu uma regra permanente para o Titon: **qualquer alteração confirmada pelo usuário deve representar o arquivo real do Google Drive**, preservando os gates e proteções de conflito já aprovados na Fase 4. Rascunhos transitórios — digitação ainda não confirmada, área de recorte em ajuste ou gesto em andamento — continuam locais até a confirmação.

### Nome do PDF

O cabeçalho do Titon passa a tratar o nome como metadado editável do arquivo real:
- um clique seleciona o nome;
- duplo clique habilita a edição;
- a extensão `.pdf` fica protegida e não faz parte do campo editável;
- `Enter` confirma e grava o novo nome no Google Drive;
- `Escape` cancela;
- funciona tanto em visualização quanto no editor;
- exige capability `edit`, Drive conectado e gate de escrita ativo;
- a renomeação reconfere a `version` antes do PATCH e falha com conflito se a baseline mudou;
- após confirmação, lista e Titon recebem nome/ref/version/metadados atualizados sem nova listagem obrigatória;
- se o conteúdo mudar concorrentemente durante a renomeação, o cliente não adota a nova versão como baseline segura para edição e exige reabertura.

### Zoom

A porcentagem já existente entre os botões de menos/mais permanece a fonte única do estado de zoom do PDF.js. O ajuste desta etapa é visual: número escuro sobre fundo claro, mantendo atualização em tempo real e o clique no percentual para restaurar o zoom.

### Presença simultânea

Objetivo operacional: reduzir o risco de duas pessoas processarem/solicitarem a mesma especialidade ou procedimento por estarem trabalhando no mesmo documento sem saber.

Contrato:
- abrir um PDF cria presença efêmera;
- heartbeat a cada 25 s;
- expiração automática em 75 s;
- estado `view` ou `edit`;
- outro usuário no mesmo PDF gera borda laranja e aviso discreto;
- outro usuário em edição usa destaque laranja mais forte e aviso explícito para evitar duplicidade;
- presença **não bloqueia** o trabalho; o usuário mantém autonomia;
- conflito real do Google Drive continua sendo a autoridade final para impedir sobrescrita silenciosa;
- duas abas do mesmo username não são tratadas como duas pessoas distintas.

Privacidade:
- D1 armazena somente chave HMAC opaca do documento, session id efêmero, username/display name institucional, modo e expiração;
- não armazena fileId bruto, ref opaca completa, nome do PDF ou conteúdo;
- nenhum evento de presença é enviado ao PostHog/observabilidade analítica;
- limpeza acontece por fechamento explícito ou TTL quando navegador/conexão termina abruptamente.

A presença é uma proteção operacional adicional da Fase 6; não substitui versionamento, preflight nem proteção de conflito da Fase 4.


## Refinamento de uso da IA documental — painel compacto e campos copiáveis — 21/09/2026

Durante a homologação operacional, o operador definiu que a IA documental deve aparecer pronta para uso, sem textos explicativos ocupando a área principal.

Decisão:
- ao abrir o painel, a ação principal visível é **Extrair dados do PDF**;
- regras de segurança, proveniência e detalhes técnicos permanecem acessíveis por um botão discreto **i**;
- o chat documental permanece disponível, mas só aparece após uma extração concluída e fica recolhido por padrão;
- resultados continuam separados por página e passam a ser organizados visualmente em **Paciente**, **Encaminhamento**, **Solicitação** e **Profissional**;
- cada campo extraído pode ser copiado individualmente, além de **Copiar esta página** e **Copiar tudo**.

A mudança é exclusivamente de apresentação/uso dos dados estruturados que a V8C.2 já devolve. Não altera prompt, modelo, provider, concorrência, número de chamadas, tokens ou neurons por extração.

## Refinamento operacional aprovado — ordem dos campos, confirmação de cópia e renomeação — 21/09/2026

Durante a homologação com uso real, o operador aprovou **somente** três refinamentos adicionais do Titon:

1. **ordem personalizável dos campos copiáveis**;
2. **confirmação visual inequívoca após copiar um campo**;
3. **confirmação visual da renomeação, vinculada à confirmação real do Google Drive**.

### Ordem dos campos

A ordem dos tipos de campo pode ser reorganizada pelo usuário e permanece vinculada à conta institucional. A persistência usa a API de preferências da Central e grava no backend somente a sequência validada de chaves dos campos reconhecidos; não usa `localStorage`, `sessionStorage` ou IndexedDB. Não guarda valores extraídos, nome do paciente, conteúdo do PDF, ref/fileId ou qualquer dado clínico.

A ordenação continua respeitando a separação por página e as categorias aprovadas. A posição escolhida influencia a ordem dos campos dentro das categorias e também a posição relativa das categorias conforme o primeiro campo configurado.

### Confirmação de cópia

Quando a cópia individual é concluída pelo navegador:
- o botão muda para **✓ Copiado**;
- o cartão do campo recebe destaque visual de sucesso;
- o estado permanece enquanto o mesmo PDF/resultados continuarem abertos;
- nenhuma nova chamada de IA é executada.

O estado é apenas efêmero da sessão do documento e não persiste valores copiados.

### Renomeação confirmada no Drive

A renomeação já utiliza o endpoint protegido de Drive por `PATCH`, capability `edit`, gate de escrita e verificação de versão. O refinamento desta etapa torna esse estado explícito no próprio cabeçalho do Titon:

- ao confirmar, exibir **Sincronizando nome com o Google Drive…**;
- somente após resposta positiva do backend/Drive exibir **✓ Nome alterado e sincronizado com o Google Drive**;
- em erro, indicar que o nome **não** foi alterado no Drive;
- conflito de conteúdo continua gerando aviso e não adota baseline insegura;
- `Enter` confirma;
- clicar fora do campo também confirma e executa a mesma gravação real;
- `Escape` continua cancelando sem escrita.

Nenhuma das outras sugestões avaliadas no vídeo foi aprovada para este refinamento. A Fase 6 permanece aberta até a homologação operacional real.

## Refinamento operacional aprovado — seleção de texto nativo do PDF — 21/09/2026

Durante a homologação da Fase 6, foi aprovado permitir que o usuário selecione com o mouse e copie texto diretamente da página exibida pelo Titon, como em visualizadores PDF convencionais.

Contrato:
- o visualizador continua usando o PDF.js self-hosted e o canvas atual para a imagem da página;
- sobre o canvas, o Titon passa a usar a `TextLayer` do próprio PDF.js para documentos que contenham texto nativo;
- arrastar o mouse seleciona texto; duplo clique pode selecionar palavra conforme o comportamento nativo do navegador; `Ctrl+C`/copiar usa a seleção do navegador;
- nenhuma seleção/cópia altera o PDF ou gera escrita no Google Drive;
- a camada acompanha zoom, rotação nativa da página e recorte aplicado pelo Titon;
- a camada é carregada de forma lazy junto das páginas visíveis e é descartada quando a página é descarregada, preservando a arquitetura de desempenho;
- quando uma ferramenta de edição precisa dos gestos da página — Selecionar/mover, Escrever, Colar imagem, Desenhar/Borracha ou Recortar — a camada de seleção deixa de receber ponteiros temporariamente para não disputar interação;
- ao sair dessas ferramentas, a seleção volta a ficar disponível.

Limitação deliberada:
- PDFs compostos apenas por imagem/escaneamento, sem texto interno, não ganham texto selecionável por esta mudança. OCR não faz parte deste refinamento e não deve ser ativado implicitamente.

Privacidade e observabilidade:
- o texto selecionado permanece somente no navegador/clipboard do usuário;
- nenhum conteúdo selecionado é enviado ao PostHog ou a outro serviço;
- não há nova chamada de IA, OCR ou backend para copiar texto.

