# MISSÃO BANCÁRIA — FASE 2 — RECORTE B3
## Expansão do feedback para Operadores e Seguros/Previdência

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Dependências integradas: Recorte B / PR #548 e Recorte B2 / PR #549.

## Objetivo

Expandir o contrato reutilizável de feedback pós-resposta sem criar lógica específica por aula.

Este recorte cobre:
- `banking.sfn.operadores`;
- `banking.sfn.seguros-previdencia`.

## Escopo

São acrescentadas justificativas específicas para as quatro alternativas de:
- `q.oper.01`;
- `q.oper.02`;
- `q.oper.03`;
- `q.segprev.01`;
- `q.segprev.02`;
- `q.segprev.03`;
- `q.segprev.04`.

O catálogo passa de 15 para 22 questões enriquecidas.

## Contrato preservado

Nada muda no protocolo:
1. o bootstrap continua sem gabarito e sem motivos de distratores;
2. a tentativa é registrada primeiro;
3. somente depois da tentativa o backend pode devolver `selectedFeedback` e `reviewRefs`;
4. a interface reutiliza o mesmo renderer;
5. `reviewRefs` continua apontando apenas para ensino já publicado;
6. o botão **Rever conceito** não cria nova sessão nem concede XP.

## Preservação

Este recorte não altera:
- prompts;
- alternativas;
- gabaritos;
- explicações originais da resposta correta;
- IDs de missão ou questão;
- XP;
- cobertura;
- domínio/retenção;
- revisões;
- conquistas;
- avaliação independente.

## Validação

A suíte deve comprovar:
- sete missões cobertas pelo catálogo enriquecido;
- 22 questões com quatro justificativas não vazias;
- ausência de `optionReasons` e `selectedFeedback` nos objetos públicos;
- validação genérica sem erro;
- nenhuma alteração no renderer.

## Próximo recorte

Depois da integração deste B3, concluir o feedback do primeiro bloco com:
- Pagamentos/Consórcios;
- Chefe do SFN.

Esse B4 deverá enriquecer as 16 questões restantes sem introduzir matéria nova no Chefe.
