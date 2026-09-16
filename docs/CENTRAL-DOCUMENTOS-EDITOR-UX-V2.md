# Central de Documentos — Editor PDF UX V2

Data: 15/09/2026  
Fase: 3 — Editor PDF  
Status: requisitos de UX aprovados pelo usuário; implementação incremental no staging antes de produção. O aceite humano mais recente exige a experiência completa da Fase 3, não apenas o Organizar V2.

## 1. Objetivo

Evoluir o editor próprio da Central para uma experiência de trabalho dedicada a documentos, usando o Lumin apenas como **referência de ergonomia e comportamento**, sem copiar identidade visual, código ou elementos proprietários.

A página do PDF continua sendo o conteúdo principal. Ferramentas devem ocupar pouco espaço, aparecer por contexto e mudar a superfície conforme a tarefa.

## 2. Modos da superfície

### 2.1 Visualizar
- página grande;
- navegação e zoom;
- acesso compacto **Editar** na lateral;
- nenhuma ferramenta estrutural exposta antes de entrar no editor.

### 2.2 Organizar
- ao entrar em **Editar**, páginas passam para uma grade de cartões/miniaturas maiores;
- drag-and-drop da própria página para qualquer posição;
- feedback visual claro do ponto de inserção;
- auto-scroll durante arraste;
- animação/ghost do item arrastado;
- controles contextuais por página em hover/foco:
  - girar 90° para a esquerda;
  - girar 90° para a direita;
  - duplicar;
  - excluir;
- não exibir botões globais redundantes de Mover/Rodar/Eliminar.

### 2.3 Escrever
- volta da grade para páginas grandes em lista;
- criar caixa de texto sobre a página;
- fonte, tamanho, cor, transparência e formatação;
- objeto continua editável na sessão;
- modo selecionar/mouse permite mover e redimensionar;
- duplo clique/clique de edição reabre o conteúdo e propriedades.

### 2.4 Imagem
- corresponde à função já aprovada **Colar imagem**;
- imagem escolhida no armazenamento entra como objeto sobre página existente;
- mover, redimensionar, rotacionar e transferir entre páginas;
- não confundir com **Adicionar imagem como nova página**, que permanece operação distinta.

### 2.5 Desenhar
- traço livre sobre a página;
- seleção de cor e espessura;
- borracha remove **somente traços criados pela ferramenta Desenhar**;
- nunca apaga ou mascara conteúdo original do PDF.

### 2.6 Recortar
- página selecionada volta a tamanho grande;
- moldura de crop manipulável;
- presets e dimensões/posição quando aplicável;
- operação reversível por undo/redo.

## 3. Barra de ferramentas

Ações principais devem usar **ícones compactos**, com nome por tooltip/aria-label.

Ferramentas previstas:
- Organizar;
- Unir;
- Recortar;
- Inserir página em branco;
- Escrever;
- Imagem;
- Desenhar;
- Desfazer;
- Refazer;
- sair do editor.

## 4. Unir documento

Depois de escolher o PDF a inserir, exibir painel de posição:
- antes do documento atual;
- após o documento atual;
- após uma página específica.

A união não deve obrigar o usuário a inserir no final e reorganizar manualmente depois.

## 5. Modelo de edição

- PDF.js continua responsável por renderização;
- pdf-lib continua responsável por montagem/exportação;
- modelo de páginas e objetos continua controlado pelo Portal;
- operações são locais e reversíveis;
- nenhuma escrita no Google Drive durante a Fase 3;
- nenhuma informação documental em PostHog/logs.

## 6. Plano incremental atualizado

### 3C.2 — shell de edição + Organizar V2
- grade;
- drag fluido;
- hover actions;
- girar esquerda/direita;
- duplicar;
- excluir;
- página em branco;
- Unir com posição de inserção.

### 3C.3 — objetos sobre página
- Escrever;
- Colar imagem;
- seleção, mover, resize e rotação;
- undo/redo.

### 3C.4 — Recortar
- crop por página;
- preview e undo/redo.

### 3C.5 — Desenhar
- caneta;
- cor/espessura;
- borracha exclusiva dos traços.

### 3C.6 — flatten/exportação local
- incorporar textos, imagens, crop e desenhos ao Blob PDF;
- comparação visual preview × PDF gerado;
- validação desktop/mobile e PDFs variados.

Somente após aceite real dessas unidades a Fase 3 poderá ser encerrada e a sincronização segura com Drive (Fase 4) iniciada.

## 7. Critério humano de aceite atualizado — 15/09/2026

O Organizar V2 é checkpoint técnico, não o editor final. O usuário explicitou que considera ausentes/incompletas as ferramentas Escrever, Colar imagem sobre página, Recortar e Desenhar. Portanto:
- não solicitar aceite global da Fase 3 somente com a grade;
- implementar as unidades 3C.3–3C.5 antes do aceite visual global;
- manter Inserir página em branco no Organizar, mas tornar seu ícone/tooltip facilmente reconhecível;
- durante drag, o centro visual do cartão flutuante deve acompanhar o cursor/dedo, sem deslocamento para o canto superior esquerdo.
