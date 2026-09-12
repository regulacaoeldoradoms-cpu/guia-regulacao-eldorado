# Central de Documentos — Fase 2: Visualização de alta performance

Data: 11/09/2026  
Branch: `feat/central-docs-phase2-progressive-viewer`

## Objetivo

Reduzir o tempo percebido para abrir PDFs, priorizando o início da visualização e permitindo que o visualizador nativo solicite faixas do arquivo conforme necessário, sem persistir documentos clínicos no navegador e sem expor conteúdo ao PostHog.

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

Nenhum PDF é gravado em Cache Storage, IndexedDB, localStorage ou sessionStorage.

### Vida útil

O registro no Service Worker expira rapidamente e é renovado por heartbeat enquanto o visualizador estiver aberto. Ao fechar o PDF, trocar de documento, sair da conta ou abandonar a página, o registro é liberado.

Service Workers podem reiniciar; por isso o heartbeat reidrata somente a referência/token atuais em memória. Se o recurso progressivo não estiver disponível, o Portal volta automaticamente ao fluxo Blob da Fase 1.

## Métricas

- `pdf_open_started`: clique para abrir;
- `pdf_ready`: evento `load` do iframe do visualizador;
- `pdf_first_page_visible`: somente no modo progressivo, após `load` do iframe + dois frames de pintura e confirmação de que o iframe está visível e possui área renderizável.

A Fase 1 não emitia `pdf_first_page_visible`; a Fase 2 passa a exigir esse evento em uso real.

Propriedades continuam limitadas à allowlist:
- rota genérica;
- duração;
- origem;
- faixa de tamanho;
- estado de cache.

Nunca enviar nome de arquivo, referência opaca, fileId, usuário, conteúdo do PDF ou dado clínico.

## Fallback

Se não houver Service Worker controlador, se o registro não responder em tempo curto ou se houver incompatibilidade do navegador, o Portal usa o Blob integral da Fase 1. O fallback mantém funcionalidade, mas não emite `pdf_first_page_visible` porque a primeira página não é mensurável com confiabilidade nesse modo.

## Fora de escopo desta unidade

- edição de PDF;
- persistência offline;
- cache de conteúdo clínico;
- IA;
- escrita no Drive;
- bibliotecas PDF de terceiros;
- alteração de escopo OAuth.

## Critérios de aceite da Fase 2

- [ ] abertura progressiva funciona sem regressão da Fase 1;
- [ ] requisições Range continuam protegidas por sessão/capability no Worker;
- [ ] nenhuma resposta documental entra no cache persistente do Service Worker;
- [ ] fallback Blob continua funcional;
- [ ] `pdf_first_page_visible` aparece em produção com propriedades técnicas permitidas;
- [ ] `pdf_open_started` e `pdf_ready` continuam confiáveis;
- [ ] experiência melhora em PDFs médios/grandes sem perda de integridade;
- [ ] checks automatizados e testes de privacidade passam;
- [ ] resultado e métricas reais são registrados em `docs/CENTRAL-DOCUMENTOS-STATUS.md`.

A fase só encerra quando os critérios acima forem comprovados em uso real.
