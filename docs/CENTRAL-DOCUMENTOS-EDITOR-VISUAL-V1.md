# Central de Documentos — Pesquisa e Arquitetura do Visualizador/Editor Próprio V1

Data: 12/09/2026  
Fase: 3 — Editor PDF essencial  
Status: decisão técnica pesquisada; implementação funcional posterior em branch própria.

## 1. Objetivo

Definir a arquitetura do visualizador/editor PDF próprio da Central de Documentos, substituindo progressivamente o iframe/visualizador nativo do navegador e preservando as regras já aprovadas do projeto.

Requisitos explícitos aprovados pelo usuário:

1. miniaturas de páginas controladas pelo Portal;
2. reorganização de páginas por arrastar e soltar;
3. união de PDFs;
4. **Adicionar imagem como página** — a imagem vira uma página independente do PDF;
5. **Ctrl+V de print/imagem como nova página**, conforme decisão anterior já implementada;
6. nova função separada **Colar imagem** — o arquivo é escolhido no armazenamento do dispositivo e entra como objeto sobre uma página existente;
7. a imagem colada deve poder:
   - ser movida dentro da página;
   - ser transferida para outra página;
   - ser redimensionada por quatro alças;
   - ser rotacionada usando a alça inferior direita;
   - participar de desfazer/refazer;
8. toda edição permanece local/reversível na Fase 3;
9. escrita no Google Drive continua reservada à Fase 4.

## 2. Diferença funcional: Adicionar imagem x Colar imagem

### 2.1 Adicionar imagem como página

Resultado lógico:
- a imagem vira uma página do documento;
- participa da ordem de páginas;
- pode ser movida como página inteira;
- pode ser excluída como página;
- não fica “por cima” de outra página.

Exemplo:

`Página 1 -> Página 2 -> [imagem como Página 3] -> Página 4`

A implementação já existente converte a imagem localmente em página PDF.

### 2.2 Colar imagem

Resultado lógico:
- a imagem NÃO cria nova página;
- entra como objeto visual sobre a página atual;
- permanece editável durante a sessão;
- possui posição, tamanho, rotação e ordem de empilhamento próprios;
- pode ser movida para outra página sem alterar a ordem das páginas.

Exemplo:

`Página 2 + [imagem sobreposta]`

A origem aprovada para **Colar imagem** é exclusivamente o armazenamento do dispositivo por seletor de arquivo. O Ctrl+V continua associado à função já aprovada de adicionar print/imagem como nova página.

## 3. Pesquisa técnica — conclusão

### 3.1 PDF.js: escolhido para renderização, não como motor de edição

PDF.js é adequado para:
- parsear PDF;
- renderizar cada página em canvas;
- gerar miniaturas;
- controlar zoom/viewport;
- obter geometria/rotação da página;
- substituir o visualizador nativo do navegador.

A arquitetura deve usar a **Display Layer** pública do PDF.js, não copiar o viewer genérico inteiro.

Motivos:
- a própria documentação separa Core, Display e Viewer;
- a Display Layer expõe `getPage`, `getViewport` e `render`;
- o viewport já trata escala, rotação e transformação entre o sistema PDF e o canvas.

### 3.2 AnnotationEditorLayer do PDF.js: não será base do editor do Portal

O viewer moderno do PDF.js possui ferramentas internas de edição, inclusive imagem/stamp e resizers. Porém não é uma boa base pública para a Central.

Motivos:
- a API de edição é acoplada ao viewer/UI manager;
- solicitação pública por uma interface genérica para implementações externas foi fechada como “not planned”;
- há histórico recente de divergência entre preview do editor e PDF salvo em determinadas combinações de camadas;
- a Central precisa de regras próprias de páginas, permissões, cache, undo/redo e objetos transferíveis entre páginas.

Decisão:
- usar PDF.js apenas para renderização/visualização;
- manter o modelo de edição controlado pelo Portal.

### 3.3 pdf-lib: permanece como motor de montagem/exportação

O `pdf-lib` atual continua adequado para:
- copiar/reordenar páginas;
- excluir páginas via plano atual;
- unir PDFs;
- embedar PNG/JPEG;
- desenhar imagem sobre página com `drawImage`;
- aplicar `x`, `y`, `width`, `height` e `rotate`.

Isso permite manter o editor local e gerar o Blob PDF final sem enviar o documento a servidor.

### 3.4 Fabric.js e Konva.js: avaliados, mas não escolhidos como base principal

Ambos oferecem:
- seleção de objetos;
- drag;
- resize;
- rotação;
- controles/handles;
- canvas scene graph.

Fabric.js ainda oferece serialização de estado e controles customizáveis; Konva possui `Transformer` pronto para resize/rotate.

Apesar disso, não são a primeira escolha para a Central porque:
- seria necessário um canvas de interação por página ou uma grande cena multi-página;
- transferência de objeto entre páginas se torna uma operação entre scene graphs;
- acessibilidade e foco de teclado ficam mais complexos;
- aumenta dependência e memória sobre PDF.js, que já usa canvas;
- o requisito exato da alça inferior direita combinando resize+rotação exige customização de qualquer forma.

Essas bibliotecas permanecem alternativas de contingência se os testes do motor DOM próprio mostrarem custo de manutenção alto.

### 3.5 Motor de interação escolhido: DOM overlay + Pointer Events

Cada página terá:
- canvas PDF.js como fundo;
- camada DOM própria acima do canvas;
- objetos de imagem como elementos posicionados;
- quatro alças de transformação controladas pelo Portal.

Vantagens:
- transferência entre páginas por reparenting é simples;
- funciona com mouse, touch e caneta via Pointer Events;
- permite `setPointerCapture` para não perder o gesto;
- melhor acessibilidade do que objetos puramente desenhados em canvas;
- não cria outro scene graph pesado;
- o Portal controla integralmente hit testing, atalhos, foco e estado.

## 4. Estrutura visual proposta

```text
Visualizador próprio
┌──────────────────────────────────────────────────────────────┐
│ Desfazer | Refazer | Unir PDF | Adicionar página | Colar img │
├───────────────┬──────────────────────────────────────────────┤
│ MINIATURAS    │  Página ativa                               │
│               │  ┌───────────────────────────────────────┐   │
│ [ pág. 1 ]    │  │ canvas PDF.js                         │   │
│ [ pág. 2 ]    │  │                                       │   │
│ [ pág. 3 ]    │  │      ┌─────────────────────┐          │   │
│               │  │      │ imagem colada       │          │   │
│ arraste ↑↓    │  │      │                     │          │   │
│               │  │      ●─────────────────────●          │   │
│               │  │      │                     │          │   │
│               │  │      ●─────────────────────◉          │   │
│               │  │                         resize+rotate  │   │
│               │  └───────────────────────────────────────┘   │
└───────────────┴──────────────────────────────────────────────┘
```

## 5. Modelo de estado

O editor não deve guardar coordenadas em pixels da tela. Pixels mudam com zoom, DPI e tamanho do dispositivo.

### Página

Cada página recebe um identificador lógico estável da sessão:

```js
{
  pageId,
  sourceIndex,
  sourcePageIndex,
  rotation,
  cropBox
}
```

### Imagem colada

```js
{
  id,
  type: "image-overlay",
  assetId,
  pageId,
  centerX: 0.50,
  centerY: 0.40,
  widthRatio: 0.30,
  heightRatio: 0.18,
  rotationDeg: 0,
  zIndex: 1
}
```

`centerX`, `centerY`, `widthRatio` e `heightRatio` são normalizados em relação à página visual. Isso mantém o objeto estável em zoom diferente e facilita mover para páginas com dimensões diferentes.

Os bytes da imagem ficam em um mapa efêmero da sessão:
- `assetId -> Blob/ImageBitmap`;
- sem nome de arquivo na telemetria;
- sem persistência no PostHog;
- sem upload na Fase 3.

## 6. Colar imagem — fluxo aprovado

1. usuário seleciona a página;
2. clica **Colar imagem**;
3. abre `<input type="file" accept="image/*">`;
4. escolhe uma imagem do armazenamento;
5. Portal decodifica localmente;
6. imagem entra centralizada na página ativa;
7. objeto já nasce selecionado com quatro alças;
8. operação entra no histórico de undo/redo.

O nome “Colar imagem” é uma ação visual do editor; tecnicamente a origem é o armazenamento do dispositivo, não o Clipboard API.

## 7. Movimento e transferência entre páginas

Enquanto o usuário arrasta:
- o objeto segue o ponteiro com `requestAnimationFrame`;
- `setPointerCapture` mantém o gesto estável;
- a posição visual é recalculada em coordenadas normalizadas;
- ao entrar na área de outra página, essa página vira candidata de destino;
- ao soltar, `pageId` muda para a página destino;
- posição/tamanho são convertidos para a geometria relativa da página destino.

Para documentos longos:
- auto-scroll deve ser ativado próximo às bordas superior/inferior do viewport;
- somente páginas próximas ao viewport permanecem renderizadas em alta resolução.

## 8. Quatro alças e rotação pela inferior direita

Requisito específico do usuário: quatro pontos ao redor da imagem e rotação ao mover a alça inferior direita.

Comportamento definido:

- superior esquerda: resize proporcional;
- superior direita: resize proporcional;
- inferior esquerda: resize proporcional;
- inferior direita: **transformação combinada de resize + rotação**.

Na alça inferior direita:
- distância do ponteiro ao centro controla a escala;
- ângulo do vetor centro -> ponteiro controla a rotação;
- portanto o mesmo gesto pode redimensionar e rotacionar;
- rotação pode ter snap visual em 0°, 90°, 180° e 270° próximo desses ângulos;
- a transformação só entra no histórico quando o usuário solta o ponteiro, evitando dezenas de snapshots por segundo.

Isso atende simultaneamente ao pedido de quatro pontos para redimensionamento e de rotação pelo ponto inferior direito.

## 9. Reordenação das páginas

Miniaturas serão próprias do Portal e geradas pelo PDF.js em resolução reduzida.

A primeira implementação pode usar Pointer Events próprios; se testes reais mostrarem problemas de touch/autoscroll, SortableJS é a contingência recomendada porque:
- é especializado em listas reordenáveis;
- suporta touch;
- suporta auto-scroll;
- suporta drag handles;
- pode evoluir para multi-drag.

Qualquer dependência escolhida deve ser:
- versionada;
- self-hosted no Portal;
- sem CDN em runtime para conteúdo documental;
- revisada antes de atualizar versão.

## 10. Zoom e geometria

PDF.js usa coordenadas de canvas com origem superior esquerda, enquanto PDF usa user space com origem inferior esquerda.

Regra:
- estado do editor permanece normalizado no espaço visual;
- renderização converte estado normalizado -> CSS/viewport;
- exportação converte estado normalizado -> coordenadas PDF da página final;
- testes obrigatórios cobrem rotações 0/90/180/270 e CropBox não padrão.

Não armazenar coordenadas derivadas diretamente de `clientX/clientY` como verdade persistente.

## 11. Geração do PDF final

Fluxo:

1. criar o PDF de saída;
2. copiar páginas conforme o plano atual;
3. mapear cada `pageId` para a página final;
4. embedar cada asset de imagem uma única vez quando possível;
5. para cada overlay:
   - localizar a página final;
   - converter posição/tamanho para pontos PDF;
   - aplicar rotação;
   - desenhar com `page.drawImage(...)`;
6. salvar em Blob local;
7. validar cabeçalho e abertura do resultado.

A imagem colada será **flattened** no PDF final: após salvar/reabrir o PDF ela será conteúdo da página, não um objeto selecionável do editor.

Reeditabilidade persistente após reabrir exigiria annotations ou metadados/sidecar próprios e fica fora da Fase 3.

## 12. Performance

Diretrizes:
- PDF.js renderiza somente páginas visíveis e próximas;
- thumbnails usam escala reduzida;
- `IntersectionObserver` controla renderização/descarga de páginas distantes;
- `ImageBitmap` pode ser reutilizado para imagens do usuário;
- manipulação durante drag/resize altera apenas CSS transform;
- não reconstruir o PDF a cada movimento;
- prévia binária é regenerada no fim da transformação ou com debounce;
- limite de escala/renderização evita canvas gigantes;
- assets e workers do PDF.js serão self-hosted.

## 13. Segurança PDF.js

Pesquisa atual encontrou dois avisos de segurança relevantes em PDF.js:
- CVE-2024-4367 / GHSA-wgrm-67xf-hhpq;
- CVE-2026-16633 / GHSA-hq66-cqwq-w95j.

Para a Central:
- usar versão corrigida e fixada do PDF.js; no momento da pesquisa, a release estável documentada é 6.3.289 e o advisory de 2026 indica correção a partir de 6.2.108;
- self-host do build e worker;
- `enableScripting: false`;
- `isEvalSupported: false`;
- CSP com scripts apenas do próprio Portal;
- não carregar viewer/editor remoto;
- revisar advisories antes de cada upgrade;
- aplicar limites de imagem/canvas para reduzir risco de exaustão de memória.

## 14. Privacidade e observabilidade

Nunca enviar:
- bytes da imagem;
- preview;
- nome do arquivo;
- posição `x/y`;
- dimensão da imagem;
- página exata;
- conteúdo PDF;
- identificador do documento.

Permitido:
- operação genérica;
- duração;
- faixa de tamanho;
- sucesso/falha;
- rota genérica.

Exemplos técnicos futuros:
- `operation: insert_image_page`;
- `operation: insert_image_overlay`;
- `operation: transform_image_overlay`;
- `operation: move_overlay_page`.

A allowlist de observabilidade deve continuar rejeitando propriedades extras.

## 15. Estratégia de undo/redo

O histórico da Fase 3 passa a abranger:
- ordem das páginas;
- páginas removidas;
- PDFs unidos;
- imagens adicionadas como página;
- imagens coladas como overlay;
- posição;
- tamanho;
- rotação;
- página destino;
- exclusão de overlay.

Gestos contínuos geram um único commit de histórico em `pointerup`.

## 16. Testes obrigatórios

### Geometria
- mover;
- quatro alças;
- resize preservando proporção;
- resize+rotate pela alça inferior direita;
- snap de rotação;
- transferência entre páginas de mesmo tamanho;
- transferência entre A4 retrato/paisagem;
- páginas rotacionadas 90/180/270;
- CropBox diferente de MediaBox.

### Histórico
- undo/redo depois de mover;
- undo/redo depois de resize;
- undo/redo depois de rotação;
- undo/redo depois de mover entre páginas;
- undo/redo combinado com reordenação de páginas.

### PDF final
- PNG com transparência;
- JPEG;
- múltiplas imagens na mesma página;
- imagem fora dos limites deve ser impedida/recortada conforme regra;
- PDF final abre no PDF.js e em viewer externo;
- ordem visual é igual à prévia;
- cabeçalho `%PDF` válido.

### UX
- mouse;
- touch;
- caneta;
- desktop;
- Android;
- zoom do Portal;
- scroll durante drag;
- tamanho mínimo das alças para toque.

### Segurança
- PDF com JavaScript embutido não executa scripts;
- CSP bloqueia script externo;
- imagem enorme é rejeitada/redimensionada;
- nenhum conteúdo aparece na telemetria.

## 17. Plano incremental de implementação

### 3C.1 — visualizador próprio somente leitura
- integrar PDF.js self-hosted;
- canvas por página;
- thumbnails;
- zoom;
- fallback para iframe durante validação.

### 3C.2 — drag-and-drop de páginas
- thumbnails reordenáveis;
- plano atual sincronizado;
- undo/redo;
- teste desktop + touch.

### 3C.3 — overlay de imagem
- botão **Colar imagem**;
- objeto sobre página;
- mover;
- quatro alças;
- resize+rotate na inferior direita;
- exclusão e undo/redo.

### 3C.4 — mover overlay entre páginas
- reparenting;
- conversão normalizada;
- auto-scroll;
- testes com tamanhos/rotações diferentes.

### 3C.5 — exportação final integrada
- flatten dos overlays via pdf-lib;
- validação de resultado;
- comparação visual prévia x PDF final.

Somente depois dessas unidades e da validação real a Fase 3 pode ser considerada encerrada.

## 18. Alternativas descartadas

### Continuar com iframe nativo
Descartado como editor principal porque o Portal não controla miniaturas, DOM interno, drag-and-drop nem clipboard de forma confiável.

### Usar AnnotationEditorLayer interno do PDF.js
Descartado como base por acoplamento ao viewer, ausência de API genérica estável para integrações externas e risco de regressão entre versões.

### Usar Fabric.js/Konva.js como scene graph principal
Não escolhido inicialmente por complexidade multi-página, memória adicional e transferência de objetos entre canvases. Permanecem alternativas se o motor DOM próprio não atingir estabilidade.

### Rasterizar a página inteira depois da edição
Descartado: destruiria texto/vetores, aumentaria tamanho e reduziria qualidade/acessibilidade.

## 19. Fontes técnicas consultadas

PDF.js:
- https://mozilla.github.io/pdf.js/getting_started/
- https://mozilla.github.io/pdf.js/examples/
- https://mozilla.github.io/pdf.js/api/
- https://github.com/mozilla/pdf.js/issues/18625
- https://github.com/mozilla/pdf.js/issues/21401
- https://github.com/mozilla/pdf.js/security/advisories/GHSA-hq66-cqwq-w95j
- https://github.com/mozilla/pdf.js/security/advisories/GHSA-wgrm-67xf-hhpq

pdf-lib:
- https://pdf-lib.js.org/docs/api/classes/pdfpage

Fabric.js:
- https://fabricjs.com/docs/core-concepts/
- https://fabricjs.com/docs/configuring-controls/
- https://fabricjs.com/demos/custom-controls/

Konva:
- https://konvajs.org/docs/select_and_transform/Basic_demo.html
- https://konvajs.org/docs/sandbox/Image_Resize.html

Web Platform:
- https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
- https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file
- https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent

SortableJS:
- https://github.com/SortableJS/Sortable
