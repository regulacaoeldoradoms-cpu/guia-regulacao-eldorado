# Telemedicina — padrão visual mobile V5

## Escopo

Esta decisão afeta exclusivamente a experiência mobile da rota `/telemedicina/`. O layout desktop permanece fora do escopo e deve ser preservado.

## Problema observado

A versão mobile V4 reduziu o desperdício de espaço, porém ficou excessivamente comprimida e horizontalizada. Em telas Android com viewport amplo, elementos importantes ficaram pequenos, os cards perderam hierarquia e os botões pareceram faixas esticadas.

## Decisão permanente

A Telemedicina mobile deve priorizar legibilidade e hierarquia antes de densidade máxima. O padrão adotado é:

- largura visual do conteúdo limitada em celulares com viewport amplo, mantendo o conteúdo centralizado;
- tipografia maior para nome do paciente, especialidade, retorno, filtros e ações;
- cabeçalho operacional compacto, porém com título e data claramente legíveis;
- indicadores em cards 2x2 com número em destaque e texto auxiliar visível;
- card do paciente com quatro blocos previsíveis: paciente/conduta, especialidade/status, retorno/avisos e ações;
- botões com largura coerente com o conteúdo, sem preencher a tela por padrão;
- ação principal apresentada como `Marcar solicitado`, com destaque visual; `Programar` e `Histórico` permanecem ações secundárias;
- em telas realmente estreitas, as ações podem quebrar em duas linhas de forma deliberada, sem reduzir tipografia para forçar encaixe;
- os modais continuam no padrão bottom sheet em celulares;
- nenhuma alteração mobile deve modificar a composição desktop.

## Implementação

O arquivo `css/telemedicina-mobile-v5.css` é carregado depois das versões mobile anteriores e contém apenas overrides mobile. A página marca a versão com `data-mobile-design="v5"`.

## Segurança e dados

A mudança é exclusivamente visual. Não altera autorização, APIs, Firestore, dados clínicos, regras de retorno ou armazenamento de pacientes.
