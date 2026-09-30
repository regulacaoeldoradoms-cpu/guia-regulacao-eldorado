# MISSÃO BANCÁRIA — FASE 2 — RECORTE B2
## Expansão do feedback pedagógico para Copom e CVM

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Dependência: Recorte B / PR #548.

## Objetivo

Comprovar que o contrato de feedback pós-resposta do Recorte B pode ser ampliado por **dados editoriais**, sem criar outra rota, outro renderer ou lógica específica por aula.

## Escopo

Acrescentar justificativas específicas das quatro alternativas para:
- `q.copom.01`;
- `q.copom.02`;
- `q.copom.03`;
- `q.cvm.01`;
- `q.cvm.02`;
- `q.cvm.03`.

O catálogo passa de 9 para 15 questões enriquecidas, cobrindo as cinco primeiras missões do bloco.

## Preservação

A expansão:
- não altera prompts;
- não altera opções;
- não altera gabaritos;
- não altera explicações já existentes da resposta correta;
- não altera XP;
- não altera cobertura, domínio, revisões ou conquistas;
- não adiciona campos ao bootstrap.

A interface continua sendo exatamente a mesma criada no Recorte B.

## Critério desta expansão

O teste do catálogo deve encontrar:
- cinco missões cobertas;
- quinze questões enriquecidas;
- uma justificativa não vazia para cada alternativa;
- os mesmos objetos de questão sem `optionReasons` ou `selectedFeedback`.

A integração depende da estabilidade e do merge da PR #548.
