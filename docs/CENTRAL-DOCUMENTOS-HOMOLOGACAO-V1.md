# Central de Documentos — Homologação e testes de navegador V1

Data: 16/09/2026  
Fase relacionada: 3 — Editor PDF essencial  
Estado: laboratório local + CI + Cloudflare Pages operacionais; 3C.6 tecnicamente concluída e aguardando homologação humana do PDF exportado, sem alteração em produção.

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

Organizar V2, 3C.3, 3C.4 e 3C.5 já foram aceitos. A unidade atual é **3C.6 — flatten/exportação local**: a implementação automatizada está verde e o encerramento da Fase 3 depende da homologação humana do PDF final exportado e reaberto.


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

## Resultado técnico final do painel RGB arrastável — 15/09/2026

Head funcional validado: `8596a2d92937cae3c0357f123e61ec1f50bbf257`.

O adendo final da 3C.3 substituiu o picker nativo de cor por um painel controlado pelo Portal para cumprir o requisito de movimentação livre sem depender do posicionamento imposto pelo navegador.

Cobertura comprovada:
- painel RGB/HEX abre acima da paleta contextual;
- alça inferior direita usa Pointer Events para mover o painel;
- painel permanece utilizável após o movimento e pode ser fechado por ×;
- posição movida é preservada ao fechar/reabrir durante a mesma barra contextual;
- selecionar slot predefinido sincroniza RGB/HEX;
- editar RGB/HEX substitui o slot ativo;
- `+` adiciona slot e o torna alvo da próxima edição RGB;
- quickbar, exclusão reversível, Undo/Redo e seleção de texto permanecem funcionais;
- desktop e perfil mobile não geram console/pageerror nesse fluxo.

Resultado de CI:
- **24/24 workflows aprovados**;
- Playwright: **51 passed / 1 skipped esperado**;
- teste específico da barra contextual/paleta aprovado em desktop e mobile;
- nenhum thread de review pendente no PR #179.

Staging candidato:
- imutável: `https://b92136d4.portal-regulacao-central-staging.pages.dev/`;
- alias: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`.

Limites desta homologação:
- staging continua somente com dados fictícios enquanto Cloudflare Access estiver pendente;
- nenhum teste automatizado substitui completamente o gesto touch em aparelho físico;
- nenhuma escrita no Google Drive faz parte da Fase 3.

Roteiro humano final específico do adendo:
1. selecionar/criar uma caixa de texto e abrir **Cor → RGB**;
2. confirmar abertura acima da paleta;
3. mover pelo puxador inferior direito em diferentes direções;
4. confirmar que × fecha e que reabrir mantém a posição;
5. selecionar um slot, alterar RGB/HEX e confirmar substituição daquele slot;
6. usar `+`, abrir RGB/HEX e preencher o novo slot;
7. se possível, repetir abrir/mover/fechar em celular físico.

Aceite desses pontos encerra o gate humano da 3C.3 e libera 3C.4 — Recortar.

## Aceite humano final da 3C.3 — 15/09/2026

O usuário declarou explicitamente **“Aprovado”** após testar o preview final da 3C.3.

Fica homologado o conjunto:
- Escrever;
- Selecionar e mover sem permitir edição do conteúdo textual;
- quickbar contextual de cor, A−, A+ e lixeira;
- clique externo confirmando/desmarcando;
- Colar imagem overlay;
- paleta predefinida por conta;
- criação de novos slots por `+`;
- edição do slot ativo por RGB/HEX;
- painel RGB próprio, arrastável pelo puxador inferior direito, com × para fechar e preservação de posição durante a sessão.

Evidência técnica associada:
- runtime funcional validado: `8596a2d92937cae3c0357f123e61ec1f50bbf257`;
- head documental/preview homologado: `4ea02f0722bfec022eeb58702e198498da3eef0f`;
- GitHub Actions: **24/24 workflows aprovados**;
- Playwright: **51 passed / 1 skipped esperado**;
- PR #179 sem threads de review pendentes;
- preview homologado: `https://a95d970c.portal-regulacao-central-staging.pages.dev/`.

Consequência de governança:
- **3C.3 está encerrada**;
- o gate humano que bloqueava **3C.4 — Recortar** foi satisfeito;
- a próxima unidade autorizada é 3C.4;
- continuam proibidos merge, escrita no Google Drive e deploy de produção durante esta etapa.

## Ajuste pós-feedback humano da 3C.4 — seleção explícita e única por página — 16/09/2026

Durante a homologação visual, foi rejeitado o comportamento que desenhava uma moldura inicial de recorte com margem de 4% ao apenas entrar no modo **Recortar**. Embora aquele retângulo ainda não estivesse gravado no histórico, a apresentação visual sugeria corte parcial predefinido.

Requisito funcional consolidado:
- **sem seleção do usuário, não há recorte**;
- a página deve permanecer visualmente inteira ao entrar no modo;
- o primeiro arraste direto sobre a página cria a área mantida;
- cada página aceita **no máximo uma área de recorte**;
- depois de criada, a mesma área pode ser movida/redimensionada ou removida por ↺;
- tentar iniciar uma segunda seleção fora da moldura não cria outro crop.

Implementação:
- removido o `defaultCropRect` de 4%/92%;
- `crop: null` não renderiza frame nem máscara;
- o gesto `create` nasce na própria `.portal-pdf-crop-layer` e só passa a existir quando largura e altura superam o limiar mínimo;
- o modelo continua sendo um único campo `crop` por `pageId`, preservando a restrição estrutural de 1 por página;
- mover, resize, Undo/Redo, rotação, duplicação, exclusão/reordenação e CropBox continuam usando o mesmo metadado reversível;
- nenhuma materialização no PDF final foi antecipada: isso permanece para 3C.6.

Validação do head `ca7801df7d6042a3d111a2185c21bd82b12923c8`:
- **25/25 checks verdes**;
- Cloudflare Pages: sucesso;
- workflow de navegador: sucesso;
- etapa Playwright: sucesso;
- a suíte específica de Recortar passou a verificar explicitamente o estado inicial sem moldura, criação por seleção, bloqueio de segunda seleção, resize, histórico, CropBox, reordenação e touch.

A 3C.4 permanece aguardando apenas o novo aceite humano dessa interação corrigida.

## Homologação candidata — confirmar/cancelar recorte antes de aplicar — 16/09/2026

Feedback humano incorporado:
- o arraste cria somente uma **seleção provisória**;
- a seleção exibe **Confirmar recorte** e **Cancelar**;
- **Cancelar** não modifica o plano nem o histórico;
- **Confirmar recorte** aplica o crop no preview e registra a alteração;
- após confirmação, o preview mostra somente a área mantida;
- um crop confirmado pode ser reaberto por **Ajustar**, voltando a draft até nova confirmação;
- permanece o limite de **1 crop por página**.

Arquitetura:
- `page.crop` guarda apenas o crop confirmado;
- `cropDrafts` existe somente na sessão do viewer;
- mover/redimensionar um draft não chama commit externo;
- confirmar promove o draft e executa uma única mutação;
- cancelar restaura o estado anterior sem histórico;
- o crop continua reversível por `pageId` e não é materializado no PDF final antes da 3C.6.

UX:
- barra de ações fica abaixo da seleção;
- se a seleção estiver muito próxima da borda inferior, a barra vai para cima;
- após confirmação, a moldura de edição some e a superfície passa a exibir somente o viewport recortado;
- ações do crop confirmado: **Ajustar** e ↺;
- botões são compatíveis com mouse e touch por Pointer Events/click.

Evidência técnica do runtime:
- head funcional: `0c228c3fe5b6a50a3bd6cdcdd603574a61568bca`;
- **25/25 checks verdes**;
- Cloudflare Pages: sucesso;
- workflow **Validar Central de Documentos — navegador**: sucesso;
- Playwright cobre cancelar sem histórico, confirmar com viewport recortado, ajustar + cancelar, Undo/Redo, CropBox não padrão, reordenação, rotações e toque no botão de confirmação em perfil mobile.

Roteiro humano final da 3C.4:
1. entrar em **Recortar**;
2. arrastar uma área;
3. confirmar que aparecem **Confirmar recorte** e **Cancelar** junto da seleção;
4. clicar **Cancelar** e confirmar que a página volta ao estado anterior;
5. selecionar novamente e clicar **Confirmar recorte**;
6. confirmar que a página passa a mostrar somente a área escolhida;
7. clicar **Ajustar**, modificar a moldura e cancelar, confirmando restauração do crop anterior;
8. repetir **Ajustar** e confirmar uma nova posição;
9. testar Undo/Redo;
10. se possível, repetir confirmação/cancelamento em celular físico.

Aceite humano desse roteiro encerra a 3C.4 e libera **3C.5 — Desenhar/Borracha**.

## Aceite humano final da 3C.4 e liberação da 3C.5 — 16/09/2026

O usuário aprovou explicitamente o fluxo final de **Recortar** no staging sintético.

Aceite confirmado:
- ausência de recorte predefinido;
- seleção inicial provisória;
- botões **Confirmar recorte** e **Cancelar**;
- cancelar não altera histórico;
- confirmar aplica visualmente somente a área mantida;
- **Ajustar** reabre o crop confirmado como draft;
- cancelamento de ajuste restaura o crop anterior;
- limite de 1 crop por página;
- Undo/Redo sobre estado confirmado.

Evidência técnica associada:
- runtime funcional: `0c228c3fe5b6a50a3bd6cdcdd603574a61568bca`;
- head documental anterior ao aceite: `17e42734a190253589d3cadec1bca41128cd2d5b`;
- 25/25 checks verdes;
- PR #179 aberto, mergeável e sem merge;
- nenhuma alteração de produção, `main` ou Google Drive.

Resultado:
- **3C.4 encerrada**;
- **3C.5 — Desenhar/Borracha liberada**.

Critérios de implementação/homologação da 3C.5:
1. traço livre renderizado como overlay vetorial local;
2. cada traço ligado ao `pageId`;
3. cor e espessura persistidas por traço;
4. um gesto contínuo gera uma única entrada de Undo/Redo;
5. borracha remove somente traços produzidos pelo modo Desenhar;
6. borracha não toca no conteúdo original do PDF, textos, imagens overlay ou outros objetos;
7. reorganizar/rotacionar/duplicar/excluir páginas preserva a semântica dos traços;
8. duplicação cria novos IDs para os traços clonados;
9. interação validada com mouse e touch;
10. nenhuma telemetria contém coordenadas ou conteúdo do desenho;
11. nenhum flatten/export antes da 3C.6.

Roteiro humano previsto para o preview da 3C.5:
- desenhar traço com mouse;
- alterar cor e espessura;
- desenhar em pelo menos duas páginas;
- testar Undo/Redo por traço;
- apagar apenas um traço com a borracha;
- confirmar que o PDF original não é apagado;
- reorganizar/girar página com desenho e confirmar acompanhamento;
- repetir no touch quando possível.

Somente após esse roteiro e checks verdes a 3C.5 poderá ser encerrada e a 3C.6 liberada.

## Homologação candidata da 3C.5 — Desenhar/Borracha — 16/09/2026

Head funcional candidato: `a2c28838df3138beec036baa809a5d7744eb21a5`.

### Cobertura técnica aprovada

- traços são vetores locais ligados a `pageId`;
- cada traço persiste cor, espessura e pontos normalizados;
- a camada de desenho é separada do canvas original do PDF;
- um gesto contínuo de caneta consolida uma única entrada de Undo/Redo;
- a borracha remove somente traços criados pela ferramenta Desenhar;
- texto, imagem overlay, crop e conteúdo original do PDF permanecem fora do alvo da borracha;
- rotação transforma os pontos do desenho junto da página;
- reorganização preserva o vínculo por `pageId`;
- duplicação cria novos IDs para os traços clonados;
- exclusão de página remove apenas os traços vinculados à página eliminada;
- Pointer Events cobrem mouse/pen/touch;
- não existe flatten/exportação dos desenhos nesta unidade.

### Resultado automatizado

- **25/25 checks GitHub verdes**;
- Cloudflare Pages: sucesso;
- workflow **PDF.js real em Chromium**: sucesso;
- Playwright: **64 casos**, com **61 passed / 3 skipped esperados**;
- cenário de caneta/espessura/cor/Undo/Redo/borracha passou em desktop e mobile;
- cenário de rotação/duplicação/exclusão por `pageId` passou em desktop e mobile;
- cenário touch específico passou no perfil mobile;
- nenhum erro conhecido de console/pageerror no fluxo validado.

### Preview candidato

- imutável: `https://ea2088f5.portal-regulacao-central-staging.pages.dev/`;
- alias da branch: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`.

O staging continua restrito a **dados fictícios**, pois Cloudflare Access ainda não foi habilitado.

### Roteiro humano obrigatório da 3C.5

1. entrar em **Editar → Desenhar**;
2. desenhar um traço com mouse e confirmar resposta visual imediata;
3. alterar **cor** e **espessura** e criar um segundo traço visualmente diferente;
4. criar pelo menos um traço em outra página;
5. usar **Desfazer** e **Refazer**, confirmando operação por gesto/traço;
6. selecionar **Borracha** e apagar somente um dos traços criados;
7. confirmar visualmente que texto, imagem overlay, crop e conteúdo original do PDF permanecem intactos;
8. girar uma página que contém desenho e confirmar que o traço acompanha a página;
9. reorganizar/duplicar uma página desenhada e confirmar que o desenho acompanha/clona corretamente;
10. se possível, repetir caneta + borracha em celular/touch.

### Gate

A 3C.5 só pode ser encerrada após o aceite humano desse roteiro. A 3C.6 — flatten/exportação local — continua bloqueada até esse aceite.

Antes de qualquer merge posterior, a branch deverá ser sincronizada com a `main` atual e toda a matriz de CI deverá ser executada novamente, porque a `main` avançou com commits independentes do módulo Agenda/DigSaúde.

## Aceite humano final da 3C.5 — Desenhar/Borracha — 16/09/2026

O usuário concluiu a homologação humana do preview sintético da 3C.5 e respondeu que o comportamento está **“ótimo”**, autorizando o avanço.

Escopo aceito:
- traço livre vetorial;
- cor e espessura por traço;
- Undo/Redo por gesto;
- borracha exclusiva dos traços criados pelo modo Desenhar;
- preservação do conteúdo original do PDF, textos, imagens overlay e crop;
- vínculo dos traços por `pageId` durante operações de página;
- experiência visual/tátil considerada satisfatória.

Evidência técnica de suporte:
- head funcional homologado: `a2c28838df3138beec036baa809a5d7744eb21a5`;
- 25/25 checks verdes no candidato;
- Playwright: 64 casos, 61 passed / 3 skipped esperados;
- Chromium desktop/mobile e touch sintético já validados;
- staging permaneceu com dados fictícios e sem escrita no Drive.

Resultado:
- **3C.5 encerrada**;
- o próximo gate é reconciliar a branch com a `main` atual e repetir CI completo;
- com a reconciliação verde, fica liberada **3C.6 — flatten/exportação local**;
- a Fase 4 continua fora de escopo até o fechamento de toda a Fase 3.

## Liberação técnica da 3C.6 após reconciliação — 16/09/2026

A branch da Central foi reconciliada com a `main` após o aceite humano da 3C.5.

Evidência:
- `main`: `73997b4d108dd0392173e93640310d70dd3eeccf`;
- merge de reconciliação: `95c660d6e74c4aafdbb5d7be4c4383ac11d46995`;
- branch ficou 0 commits atrás da `main`;
- PR #179 continuou aberto, mergeável e sem merge;
- **25/25 checks verdes**, incluindo Cloudflare Pages e PDF.js real em Chromium.

Com esse gate concluído, fica liberada **3C.6 — flatten/exportação local**.

Critérios de homologação desta unidade:
1. `buildBlob()` estrutural continua reversível e sem overlays baked;
2. saída final separada incorpora texto, imagem, crop e desenhos via pdf-lib;
3. PDF original permanece vetorial/textual; rasterização integral de página não é permitida como atalho;
4. PDF final é reaberto pelo PDF.js e comparado ao preview;
5. rotação 0/90/180/270° e CropBox não padrão são cobertos;
6. exportação permanece local; nenhuma escrita no Google Drive;
7. desktop e mobile precisam permanecer funcionais;
8. reeditabilidade após exportar fica fora da Fase 3.

## Homologação candidata da 3C.6 — flatten/exportação local — 16/09/2026

Head funcional candidato: `d8d5b2e1938a6e8916cd6c6bc7cdafb3f92953c7`.

### Implementação validada

- `buildBlob()` continua gerando somente a estrutura de páginas para o preview reversível;
- `buildFlattenedBlob()` é a saída final independente;
- texto, imagem overlay, crop e desenhos são incorporados ao PDF final com pdf-lib;
- conteúdo original permanece vetorial/textual e não é rasterizado integralmente;
- crop vira `CropBox` final;
- texto/imagem/desenho seguem as transformações visuais e a rotação da página;
- exportação é feita pelo navegador usando Blob/Object URL e download local;
- não há endpoint de upload, escrita no Drive ou persistência remota nessa ação.

### Resultado automatizado

- **25/25 checks GitHub verdes**;
- Cloudflare Pages: sucesso;
- workflow **PDF.js real em Chromium**: sucesso;
- Playwright: **70 casos**, com **67 passed / 3 skipped esperados**;
- testes específicos da 3C.6 passaram em desktop e mobile;
- o PDF final foi gerado por pdf-lib e reaberto por PDF.js durante o teste;
- conteúdo final comprovado automaticamente: texto, imagem, traçado vetorial e crop;
- matriz de rotação comprovada em **0/90/180/270°**;
- duplicação/reordenação e CropBox não padrão cobertos;
- preview estrutural foi verificado para não conter os overlays já flattened, evitando duplicação.

### Preview candidato

- imutável: `https://afffb869.portal-regulacao-central-staging.pages.dev/`;
- alias da branch: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`.

O staging continua restrito a **dados fictícios** enquanto Cloudflare Access estiver pendente.

### Roteiro humano final da Fase 3

1. abrir o preview e entrar no editor;
2. criar/editar texto e confirmar posição, tamanho, estilo e cor;
3. inserir uma imagem sobre a página e mover/redimensionar/rotacionar;
4. desenhar pelo menos um traço;
5. recortar uma página e confirmar o recorte;
6. reorganizar ou girar pelo menos uma página;
7. clicar em **↓ Exportar PDF final localmente**;
8. abrir o PDF baixado fora do editor;
9. comparar visualmente o arquivo reaberto com o preview, verificando texto, imagem, desenho, crop, ordem e rotação;
10. confirmar que não há objetos duplicados, cortes indevidos ou deslocamentos perceptíveis.

### Gate

A 3C.6 e a Fase 3 só podem ser encerradas após esse aceite humano. A **Fase 4 — sincronização segura com Drive** permanece bloqueada até esse encerramento formal.

