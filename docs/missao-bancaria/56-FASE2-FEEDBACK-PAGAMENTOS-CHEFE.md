# MISSÃO BANCÁRIA — FASE 2 — RECORTE B4
## Feedback completo do primeiro bloco: Pagamentos/Consórcios + Chefe

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Dependência: Recorte B3.

## Objetivo

Completar o contrato de feedback pedagógico pós-resposta em todas as questões pontuadas do primeiro bloco de SFN.

## Escopo

Este recorte adiciona:
- 4 questões de Pagamentos/Consórcios;
- 12 questões cumulativas do Chefe do SFN.

Somadas às 22 questões já cobertas nos recortes anteriores, o catálogo passa a **38/38 questões enriquecidas**.

Cada questão mantém:
- quatro justificativas específicas, uma por alternativa;
- explicação original da alternativa correta;
- referências aos trechos que ensinaram o conceito.

## Chefe cumulativo

O Chefe não introduz matéria nova. Cada questão já possui uma referência à aula de origem por `BOSS_ORIGINS`.

O renderer passa a distinguir:
- **Rever conceito** — trecho local da missão atual, clicável;
- **Revisar depois** — aula anterior que originou o conteúdo cumulativo, exibida como orientação textual.

A referência externa não abre outra missão durante a rodada. Isso preserva a integridade da sessão e evita consulta cruzada acidental enquanto ainda informa onde a lacuna deve ser corrigida depois.

## Preservação

Não são alterados:
- prompts;
- alternativas;
- gabaritos;
- passScore do Chefe;
- XP;
- IDs;
- tentativas;
- cobertura;
- retenção;
- revisões;
- conquistas;
- avaliação independente.

## Validação

A suíte deve provar:
1. 38 entradas de feedback para as 38 questões pontuadas;
2. quatro justificativas não vazias por questão;
3. zero vazamento no bootstrap;
4. compatibilidade do renderer atual;
5. referência local continua clicável;
6. referência a outra aula aparece como “Revisar depois” e não cria nova sessão;
7. nenhuma regressão nas suítes existentes.

## Próximo passo da Fase 2

Com o contrato de feedback completo no primeiro bloco, o foco passa a ser:
- estados pedagógicos reutilizáveis;
- erros recorrentes;
- domínio ponderado por recência;
- publicação incremental de novas missões sem código específico por aula.
