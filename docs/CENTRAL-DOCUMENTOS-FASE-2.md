# Central de Documentos — Fase 2: Visualização de alta performance

Data: 11/09/2026  
Branch: `feat/central-docs-phase2-progressive-viewer`

## Objetivo

Reduzir o tempo percebido para abrir PDFs, priorizando primeira página, stream progressivo e cache local controlado, sem expor conteúdo ao PostHog e sem gravar documento em texto puro fora da sessão autorizada.

## Estado de entrada

A Fase 1 foi encerrada após validação real de:
- OAuth institucional;
- navegação por Meu Drive e subpastas;
- pesquisa global;
- abertura de PDF dentro do Portal;
- eventos `drive_search_completed`, `pdf_open_started` e `pdf_ready` no PostHog sem propriedades sensíveis.

O visualizador da Fase 1 ainda usa `fetch -> Blob completo -> blob: URL -> iframe`, portanto o navegador precisa receber o arquivo inteiro antes de iniciar o visualizador.

## Unidade 2A — stream progressivo protegido

### Estratégia

A página registra temporariamente um PDF no Service Worker usando apenas memória volátil:
- ID efêmero aleatório da visualização;
- referência opaca do Drive já usada na Fase 1;
- token de sessão atual do Portal;
- endpoint fixo e validado do Worker.

O Service Worker expõe somente para a própria página uma URL virtual same-origin:

`/__portal_document_pdf/<viewId>`

Quando o visualizador nativo solicita essa URL, inclusive com `Range`, o Service Worker:
1. encontra o registro efêmero em memória;
2. encaminha a requisição para o endpoint documental protegido do Cloudflare Worker;
3. injeta o Authorization do Portal apenas na requisição backend;
4. encaminha `Range` quando houver;
5. devolve o corpo como stream, preservando `Content-Length`, `Content-Range` e `Accept-Ranges`;
6. aplica `Cache-Control: no-store`.

Nenhum PDF é gravado em Cache Storage, localStorage ou sessionStorage. A unidade 2B passa a permitir **IndexedDB criptografado**, conforme decisão explícita de desempenho registrada abaixo.

### Vida útil

O registro no Service Worker expira rapidamente e é renovado por heartbeat enquanto o visualizador estiver aberto. Ao fechar o PDF, trocar de documento, sair da conta ou abandonar a página, o registro é liberado.

Service Workers podem reiniciar; por isso o heartbeat reidrata somente a referência/token atuais em memória. Se o recurso progressivo não estiver disponível, o Portal volta automaticamente ao fluxo Blob da Fase 1.

## Métricas

- `pdf_open_started`: clique para abrir;
- `pdf_ready`: evento `load` do iframe do visualizador;
- `pdf_first_page_visible`: após `load` do iframe + dois frames de pintura e confirmação de que o iframe está visível e possui área renderizável, tanto em stream progressivo quanto em cache/fallback.

A Fase 1 não emitia `pdf_first_page_visible`; a Fase 2 passa a exigir esse evento em uso real.

Propriedades continuam limitadas à allowlist:
- rota genérica;
- duração;
- origem;
- faixa de tamanho;
- estado de cache.

Nunca enviar nome de arquivo, referência opaca, fileId, usuário, conteúdo do PDF ou dado clínico.

## Fallback

Se não houver Service Worker controlador, se o registro não responder em tempo curto ou se houver incompatibilidade do navegador, o Portal usa o Blob integral da Fase 1. O fallback continua funcional e passa a medir `pdf_first_page_visible` somente após `load`, pintura e confirmação de visibilidade.

## Unidade 2B — cache local criptografado

### Descoberta real

Após o deploy da unidade 2A, um PDF real voltou a abrir em produção, porém o usuário relatou que a experiência ainda estava lenta. O PostHog registrou `pdf_open_started` e `pdf_ready`, mas ainda não registrou `pdf_first_page_visible` nessa abertura. A estratégia somente por stream progressivo não atingiu sozinha a experiência desejada.

### Decisão aprovada

A Fase 2 passa a usar cache local persistente **controlado e criptografado**, coerente com o Guia Mestre, que prevê cache e pré-carregamento nesta fase.

Controles:
- armazenamento em IndexedDB dedicado à Central;
- bytes do PDF sempre cifrados com AES-GCM;
- chave derivada por HKDF da sessão atual do Portal; o token não é gravado dentro do cache;
- mudança de sessão/fingerprint invalida e limpa o cache anterior;
- logout e desconexão do Drive solicitam limpeza;
- chave de cache do arquivo é opaca e estável, derivada no Worker por HMAC; fileId bruto não sai do backend;
- `version` do Drive integra a chave lógica e invalida automaticamente conteúdo antigo;
- TTL inicial: 12 horas;
- limite total inicial: 256 MB;
- limite por PDF: 50 MB;
- pré-aquecimento automático somente para PDFs de até 12 MB;
- aquecimento dos primeiros PDFs prováveis e também ao passar/focar sobre um item;
- Cache Storage do Service Worker continua sem guardar PDFs;
- nomes de arquivo, referências, cacheKey e conteúdo continuam proibidos no PostHog.

O objetivo é que PDFs já abertos ou pré-aquecidos sejam exibidos a partir do cache local sem novo download completo.


- edição de PDF;
- funcionamento offline completo;
- cache clínico em texto puro ou compartilhado entre sessões;
- IA;
- escrita no Drive;
- bibliotecas PDF de terceiros;
- alteração de escopo OAuth.

## Critérios de aceite da Fase 2

- [x] abertura progressiva funciona sem regressão da Fase 1;
- [x] requisições Range continuam protegidas por sessão/capability no Worker;
- [x] nenhuma resposta documental entra no Cache Storage persistente do Service Worker;
- [x] cache IndexedDB permanece criptografado, limitado, versionado e segregado por sessão;
- [x] fallback Blob continua funcional;
- [x] `pdf_first_page_visible` aparece em produção com propriedades técnicas permitidas;
- [x] `pdf_open_started` e `pdf_ready` continuam confiáveis;
- [x] cache hit reduz de forma mensurável o tempo de `pdf_ready`/`pdf_first_page_visible` sem perda de integridade;
- [x] checks automatizados e testes de privacidade passam;
- [x] resultado e métricas reais são registrados em `docs/CENTRAL-DOCUMENTOS-STATUS.md`.

## Encerramento formal — 12/09/2026

Validação real no PostHog após o usuário abrir PDFs repetidamente:

- `pdf_ready` cache hit: 7 eventos, média **107 ms**, mediana **90 ms**, p95 **167,5 ms**;
- `pdf_ready` cache miss: 9 eventos, média **5.461,3 ms (~5,46 s)**, mediana **5.177 ms**, p95 **6.878,2 ms**;
- `pdf_first_page_visible` cache hit: 7 eventos, média **127,6 ms**, mediana **110 ms**, p95 **193 ms**;
- `pdf_first_page_visible` cache miss: 7 eventos, média **5.506,7 ms (~5,51 s)**, mediana **5.212 ms**, p95 **7.026,6 ms**.

O cache hit reduziu a média de `pdf_ready` em aproximadamente **98,0%** (cerca de **51x** mais rápido) e a primeira página em aproximadamente **97,7%** (cerca de **43x** mais rápido).

Nenhuma propriedade sensível foi adicionada à telemetria; a comparação usa somente duração, estado de cache, origem, rota genérica e faixa de tamanho.

**Conclusão:** todos os critérios de aceite da Fase 2 foram comprovados. A Fase 2 está encerrada e a próxima fase autorizada é a **Fase 3 — Editor PDF essencial**.
