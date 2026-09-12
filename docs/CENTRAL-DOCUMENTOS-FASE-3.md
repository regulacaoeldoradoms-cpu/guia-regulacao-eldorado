# Central de Documentos — Fase 3: Editor PDF essencial

Data: 12/09/2026  
Branch: `feat/central-docs-phase3-editor-core`

## Objetivo

Permitir edição **local e reversível** de PDFs já autorizados na Central, sem qualquer escrita no Google Drive nesta fase.

Escopo do Guia Mestre:
- excluir páginas;
- reorganizar páginas;
- unir PDFs;
- desfazer/refazer;
- visualizar o resultado.

Critério de aceite: operações preservam PDF válido e são testadas com documentos de tamanhos e estruturas diferentes.

## Fronteira de segurança

- abrir/listar conteúdo continua exigindo `documents_view`;
- a interface de edição exige capability documental `edit`;
- nenhuma rota de upload/substituição é criada na Fase 3;
- o editor trabalha em memória local e reutiliza o cache criptografado da Fase 2 como fonte quando disponível;
- resultado editado é um Blob local efêmero, revogado ao sair do editor;
- não enviar páginas, nomes, referências ou bytes ao PostHog;
- nenhuma operação de edição declara “salvo no Drive”.

A capability `edit` já existe no backend. Esta fase adiciona a superfície administrativa para concedê-la individualmente a Reguladores(as), mas **não concede a permissão automaticamente a ninguém**.

## Biblioteca de manipulação

Para manipulação binária será usado `pdf-lib 1.17.1`, carregado somente ao iniciar o editor.

Controles de supply chain:
- versão fixa;
- SRI `sha512-z8IYLHO8bTgFqj+yrPyIJnzBDf7DDhWwiEsk4sY+Oe6J2M+WQequeGS7qioI5vT6rXgVRb4K1UVQC5ER7MKzKQ==`;
- `crossorigin=anonymous`;
- `referrerPolicy=no-referrer`;
- editor falha de forma neutra se a biblioteca não carregar;
- visualização read-only da Fase 2 continua independente do editor.

A biblioteca não recebe chamadas de rede com conteúdo documental; processa bytes já autorizados no navegador.

## Modelo do editor

Uma sessão local mantém:
- fontes PDF carregadas;
- plano ordenado de páginas: `sourceIndex + pageIndex`;
- histórico de snapshots do plano;
- cursor de undo/redo;
- Blob da prévia atual.

Alterar ordem/excluir/mesclar modifica primeiro o plano em memória. A nova prévia é gerada em segundo plano.

### Undo/redo

- cada operação destrutiva ou estrutural gera snapshot;
- histórico limitado para evitar crescimento indefinido;
- undo e redo restauram somente o plano de páginas;
- fontes carregadas permanecem em memória até sair do editor;
- sair do editor descarta sessão e prévias locais.

## Unidades

### 3A — núcleo reversível
- [ ] iniciar editor a partir do PDF aberto;
- [ ] excluir página;
- [ ] mover página para cima/baixo;
- [ ] undo/redo;
- [ ] gerar e visualizar PDF resultante;
- [ ] impedir exclusão da última página;
- [ ] capability `edit` administrável sem ampliar acesso automaticamente.

### 3B — união
- [ ] adicionar outro PDF permitido à sessão;
- [ ] anexar páginas ao plano atual;
- [ ] undo/redo da união;
- [ ] validar documentos com diferentes contagens/tamanhos.

### 3C — validação final
- [ ] PDF de saída reabre no visualizador;
- [ ] page count corresponde ao plano;
- [ ] testes automatizados passam;
- [ ] nenhuma escrita Drive existe nesta fase;
- [ ] eventos `pdf_edit_completed` usam somente operation/duration/size bucket/route;
- [ ] resultado registrado em `docs/CENTRAL-DOCUMENTOS-STATUS.md`.

## Telemetria

Evento existente:
- `pdf_edit_completed`

Operações permitidas nesta fase:
- `delete_page`;
- `reorder_page`;
- `merge_pdf`.

Propriedades:
- rota genérica;
- duração;
- operação;
- faixa de tamanho.

Não registrar número da página, nome do arquivo, cacheKey, ref, fileId, quantidade exata de páginas ou conteúdo.

## Fora de escopo

- salvar/substituir arquivo no Drive;
- sincronização, conflitos e rollback remoto;
- extração IA;
- edição de texto/imagem dentro da página;
- assinatura;
- OCR;
- alteração automática das permissões do cargo Regulador(a).

## Critério de encerramento

A Fase 3 só encerra quando excluir, reorganizar, unir, desfazer/refazer e visualizar forem comprovados com PDFs válidos e sem regressão da leitura/cache da Fase 2. Escrita no Drive começa apenas na Fase 4.
