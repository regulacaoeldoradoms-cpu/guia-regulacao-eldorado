# Central de Documentos — Homologação e testes de navegador V1

Data: 15/09/2026  
Fase relacionada: 3 — Editor PDF essencial  
Estado: laboratório local + CI + Cloudflare Pages operacionais; PR funcional em homologação, sem alteração em produção.

## Objetivo

Criar uma camada de validação que detecte regressões reais do visualizador/editor antes de qualquer merge na `main`, sem usar documentos clínicos reais e sem depender do usuário como executor manual de todos os testes.

A necessidade foi comprovada pelo reteste real da 3C.1e: os checks existentes ficaram verdes, mas o visualizador PDF.js ainda falhou em produção.

## Primeira camada implementada nesta branch

A branch adiciona um laboratório local determinístico para o visualizador PDF.js:

- `testing/central-docs/viewer-harness.html`: superfície mínima que usa o mesmo `js/document-viewer.js` e os mesmos assets PDF.js self-hosted do Portal;
- `testing/central-docs/fixture.js`: PDF sintético embutido em base64, sem dado real, com três páginas incluindo retrato, paisagem e rotação;
- `testing/browser/`: Playwright com Chromium desktop e perfil mobile;
- workflow `Validar Central de Documentos — navegador`;
- captura automática de trace, screenshot e vídeo quando houver falha.

## Critérios do teste de navegador

O teste falha se qualquer um destes pontos não for atendido:

1. PDF.js abre o PDF sintético;
2. página 1 renderiza em canvas com dimensões reais;
3. miniatura da página 1 renderiza;
4. o documento expõe exatamente três páginas;
5. callback de primeira página visível ocorre;
6. zoom responde;
7. Ajustar largura responde;
8. navegação pela segunda miniatura muda a página ativa;
9. não ocorre erro de console/pageerror.

## Segurança e privacidade

- nenhum PDF clínico é utilizado;
- fixture é explicitamente sintética;
- nenhum token, cookie, fileId ou nome de paciente entra no laboratório;
- nenhum acesso ao Google Drive é necessário nesta primeira camada;
- nenhum segredo é armazenado no GitHub;
- nenhum deploy em produção é feito por este workflow;
- artefatos de diagnóstico contêm apenas a fixture fictícia e a UI de laboratório.

## Staging remoto operacional

O ambiente remoto já existe no Cloudflare Pages como `portal-regulacao-central-staging`.

Estado atual:
- URL canônica: `https://portal-regulacao-central-staging.pages.dev/`;
- previews automáticos por branch/PR: operacionais;
- bundle: exclusivamente sintético, sem Google Drive, Worker/D1 de produção, secrets ou documentos clínicos;
- `noindex,nofollow,noarchive`, `no-store` e CSP restritiva: preservados;
- Cloudflare Access: pendente de decisão humana de identidade/política;
- domínio personalizado: pendente enquanto a zona não estiver acessível;
- Worker/D1 de staging: não necessários para a versão estática atual.

O staging público só pode continuar usando dados fictícios enquanto Access estiver pendente.

## Regra de promoção

O ambiente de homologação não substitui os critérios do Guia Mestre. Ele acrescenta uma barreira automática:

`branch -> testes unitários/estáticos -> Playwright -> preview/homologação -> PR -> main -> produção`

O Organizar V2 já foi aceito. A unidade atual é 3C.3 — Escrever + Colar imagem; o avanço para 3C.4 depende de sua homologação humana.


## Resultado do primeiro ciclo automatizado — 14/09/2026

O laboratório já encontrou uma regressão que o CI anterior não detectava:

- o build moderno do PDF.js 6.3.289 falhou no Chromium automatizado com `getOrInsertComputed is not a function`;
- a falha é compatível com o erro observado pelo usuário em produção;
- a solução adotada foi usar o build **legacy oficial** da mesma versão 6.3.289, mantendo módulo e worker pareados;
- o build legacy foi self-hosted em `vendor/pdfjs-legacy/`;
- os recursos auxiliares da mesma versão permanecem em `vendor/pdfjs/`;
- não foi adicionado polyfill global ao Portal.

Após a correção, o Playwright passou em desktop e mobile para:
- Blob local;
- URL sintética;
- página 1;
- miniatura;
- zoom;
- Ajustar largura;
- navegação por miniatura;
- callback de primeira página visível.

Esse ciclo criou o baseline automatizado que posteriormente passou a ser publicado também no staging Cloudflare.


## Cobertura atual da 3C.1 — superfície única do editor

No head funcional `b02f2addf6eba16f383cc8ff7804c6eaee0b7879` do PR #179:

- **24/24 workflows** do GitHub concluíram com sucesso;
- o workflow de navegador executou **16/16 testes aprovados** em Chromium desktop e perfil Pixel 7;
- o editor permanece dentro da mesma superfície PDF.js;
- não existe lista textual paralela como editor principal;
- não existe `iframe`, `embed` ou `object` para o PDF;
- mover, excluir, undo/redo, adicionar imagem e unir PDF atualizam a mesma superfície;
- página ativa e zoom são preservados após **Atualizar PDF** e após rebuild de edição;
- corrida A → B → C de aberturas concorrentes é coberta deterministicamente;
- PDF-lib e PDF.js são self-hosted; o CSP da Central não depende mais de jsDelivr;
- o editor continua local e **não escreve no Google Drive** nesta fase;
- a permissão de editar continua explícita (`can_edit`) e não é herdada automaticamente do papel Regulador(a).

O deployment imutável correspondente foi publicado com sucesso em:

`https://cd41605e.portal-regulacao-central-staging.pages.dev/`

O alias estável da branch é:

`https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`

A matriz 14/14 é executada pelo GitHub Actions contra o bundle sintético construído no CI. A validação visual do deployment remoto continua sendo uma barreira separada antes do merge; não confundir CI de navegador com teste institucional em produção.

## Roteiro obrigatório de promoção para produção

Após aceite visual do preview e revisão final do PR:

1. mesclar somente com todos os checks obrigatórios verdes;
2. aguardar o deploy de produção;
3. usuário autorizado abrir `/documentos/` e um PDF institucional permitido;
4. confirmar canvas + miniaturas do PDF.js próprio e ausência de visualizador nativo;
5. navegar para uma página diferente e alterar o zoom;
6. entrar em **Editar PDF** e confirmar que permanece na mesma superfície;
7. executar **Atualizar PDF** e confirmar preservação de página/zoom;
8. mover e excluir página; validar undo/redo;
9. adicionar imagem e validar a nova página;
10. unir um segundo PDF autorizado;
11. sair do editor e confirmar retorno ao PDF original em somente leitura;
12. abrir rapidamente outro PDF e confirmar que o documento anterior não reassume a superfície;
13. confirmar que nenhuma operação escreveu no Drive e que não houve telemetria sensível;
14. registrar o aceite real no status.

Esse roteiro permanece como histórico da superfície única. No estado atual, o gate ativo é a homologação da 3C.3 antes de Recortar.


### Reorganização por arraste e rotação

Após o aceite humano rejeitar as setas ↑/↓ como interação final, a reorganização da Fase 3 foi ajustada para drag-and-drop.

Validação no head `ec518dc024ec79ea5ab52012082bcc68cdb99d36`:
- arrastar miniatura altera a posição exata no plano do PDF;
- feedback visual mostra inserção antes/depois;
- desktop usa Pointer Events diretamente sobre a miniatura;
- touch usa grip ⠿ com Pointer Events;
- setas ↑/↓ foram removidas da interface;
- ↻ gira a página 90° para a direita;
- rotação e reordenação integram Desfazer/Refazer;
- o PDF reconstruído pelo PDF-lib conserva as alterações;
- Playwright final: **16/16**, desktop + mobile;
- deployment imutável: `https://7c94b5a6.portal-regulacao-central-staging.pages.dev/`.

Essa homologação continua sintética. O merge depende do novo aceite visual humano.


## Matriz atual de homologação — 3C.3 Escrever + Colar imagem

A 3C.3 deve ser considerada pronta para aceite humano somente quando a matriz abaixo estiver verde no head corrente do PR:

1. **Escrever:** criar texto na página, editar conteúdo, fonte, tamanho, cor, negrito/itálico/sublinhado, alinhamento e opacidade.
2. **Mover:** deslocar texto e imagem dentro da página sem sair dos limites.
3. **Resize convencional:** alças NW/NE/SW continuam redimensionando de forma previsível.
4. **Transformação SE:** a alça inferior direita aumenta/reduz proporcionalmente e também rotaciona conforme o ângulo do ponteiro, preservando o centro do objeto.
5. **Rotação dedicada:** o controle próprio de rotação continua funcional como alternativa.
6. **Transferência entre páginas:** arrastar imagem para outra página atualiza `pageId`/posição e participa de Undo/Redo.
7. **Página reorganizada:** objetos continuam vinculados à página correta depois de reordenar o documento.
8. **Duplicar/excluir página:** duplicar clona objetos com novos IDs; excluir remove somente objetos da página eliminada.
9. **Undo/Redo:** um gesto contínuo de mover/resize/transformar gera uma única mutação consolidada.
10. **Zoom/rebuild:** objetos preservam posição relativa após mudança de zoom, Atualizar PDF e troca de modo.
11. **PDF maior:** Organizar ↔ Escrever não pode disparar renderização de todas as miniaturas; o `IntersectionObserver` continua governando o lazy loading.
12. **Desktop + mobile:** nenhuma exceção de console/pageerror e nenhuma regressão de scroll/touch.
13. **Rede/privacidade:** nenhum texto, imagem, nome de arquivo, ID do Drive ou conteúdo documental sai do laboratório; nenhuma chamada nova a `/api/`, Google ou Worker de produção.
14. **Drive:** nenhuma ação da Fase 3 pode declarar ou executar salvamento no Google Drive.

O teste sintético ampliado usa união repetida para criar mais de dez páginas e confirma que, após a troca de modo, o número de miniaturas renderizadas permanece menor que o total do documento.

### Roteiro humano da 3C.3

No preview sintético candidato:

1. entrar em **Editar** e selecionar **Escrever**;
2. criar um texto, alterar formatação e mover a caixa;
3. usar a alça inferior direita para aumentar e girar no mesmo gesto;
4. desfazer e refazer;
5. escolher **Colar imagem**, inserir uma imagem fictícia do dispositivo e mover/redimensionar/rotacionar;
6. transferir a imagem para outra página e conferir Undo/Redo;
7. alternar Organizar ↔ Escrever e confirmar que a interface continua responsiva;
8. testar em desktop e, se possível, celular físico;
9. confirmar que nenhuma ação oferece salvamento no Drive nesta fase.

Aceite humano dessa sequência libera **3C.4 — Recortar**. Sem esse aceite, a 3C.3 permanece aberta.

## Preparação das próximas unidades — sem implementação antecipada

Esta preparação existe para reduzir tempo de execução posterior; **não autoriza pular o gate da 3C.3**.

### 3C.4 — Recortar

Modelo previsto:
- crop associado ao `pageId`, não ao índice visual;
- retângulo em coordenadas normalizadas da página;
- moldura manipulável com preview imediato;
- commit único no fim do gesto e Undo/Redo;
- reorganizar/duplicar/excluir página preserva a semântica do crop;
- testes obrigatórios em rotações 0/90/180/270° e CropBox não padrão;
- nenhum raster obrigatório do conteúdo original durante a edição.

### 3C.5 — Desenhar/Borracha

Modelo previsto:
- traços vetoriais locais, normalizados por `pageId`;
- cor e espessura por traço;
- borracha atua somente sobre traços criados pela ferramenta Desenhar;
- conteúdo original do PDF nunca é apagado, mascarado ou reescrito pela borracha;
- Undo/Redo trabalha por gesto/traço, não por cada ponto capturado.

### 3C.6 — flatten/exportação local

Critério crítico:
- PDF.js continua como camada de visualização;
- pdf-lib incorpora texto, imagem, crop e desenhos ao Blob final;
- comparar visualmente **preview × PDF gerado e reaberto**;
- preservar conteúdo vetorial/textual original sempre que a operação não exigir rasterização;
- nenhuma sincronização com Drive entra aqui; isso pertence à Fase 4.


## Resultado automatizado da 3C.3 — 15/09/2026

Head validado: `32e3f45957142f1d6e6f0402db1ca70fe401377b`.

GitHub Actions:
- **24/24 workflows concluídos com sucesso**;
- `Validar Central de Documentos — Fases 1–3`: sucesso;
- governança: sucesso;
- bundle de staging: sucesso;
- workflow de navegador: sucesso.

Playwright:
- **44 casos descobertos**;
- **43 passaram**;
- **1 foi pulado intencionalmente** porque o teste “touch nativo” só se aplica ao projeto mobile;
- no perfil mobile, o mesmo teste touch passou;
- a regressão nova **“troca Organizar/Escrever mantém miniaturas lazy em documento maior”** passou em desktop e mobile;
- a transformação da alça inferior direita (escala + rotação) passou em desktop e mobile;
- nenhum diagnóstico de falha foi publicado porque a etapa correspondente foi corretamente ignorada.

Staging sintético:
- deployment imutável: `https://11589904.portal-regulacao-central-staging.pages.dev/`;
- alias da branch: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`;
- deploy reportado como sucesso pelo Cloudflare Pages;
- continua proibido usar documento real enquanto o staging público não estiver protegido por Access.

Conclusão técnica: a 3C.3 está pronta para **homologação humana de Escrever + Colar imagem**. O PR continua aberto e sem merge. Recortar permanece bloqueado até esse aceite.
