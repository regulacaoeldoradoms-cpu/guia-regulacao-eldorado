# Telemedicina Mobile V8

## Decisão permanente

A V8 refina a interface mobile da Telemedicina sem alterar o desktop e preserva as duas visualizações introduzidas na V7: **Lista** e **Grade 2×2**.

O objetivo é corrigir dois problemas observados no uso real pelo celular:

- o limite visual anterior de 760 px deixava grandes áreas laterais vazias em navegadores Android que renderizam com viewport amplo;
- os quatro cards de resumo ocupavam altura excessiva para a quantidade de informação exibida.

## Regras visuais

- O desktop permanece fora do escopo desta mudança.
- A área principal mobile pode usar até 920 px no contexto mobile detectado, sempre respeitando pequenas margens laterais de segurança.
- A Grade 2×2 deve aproveitar a largura útil disponível e reduzir espaço morto entre os cards.
- Os cards de resumo continuam em grade 2×2, porém passam a ser baixos e informativos, com rótulo legível, número grande e texto de apoio curto.
- A compactação do resumo não deve reduzir tipografia a ponto de prejudicar a leitura.
- No modo Grade, nomes, especialidade, status, retorno, avisos e ações continuam visíveis.
- O botão principal de solicitação continua ocupando toda a largura disponível dentro do card da grade; Programar e Histórico permanecem como ações secundárias.
- A mudança é estritamente visual e não altera regras de negócio, filtros, permissões, estados, datas ou dados persistidos.

## Privacidade

Nenhum dado de paciente deve ser inserido no repositório, em testes ou nesta documentação. A V8 modifica somente CSS e marcadores de versão do frontend.
