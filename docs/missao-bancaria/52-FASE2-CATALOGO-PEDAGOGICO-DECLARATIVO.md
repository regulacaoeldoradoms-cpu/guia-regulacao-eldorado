# MISSÃO BANCÁRIA — FASE 2 — RECORTE A
## Catálogo pedagógico declarativo

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Estado: **integrado na PR #547**; não encerra a fase.

## Problema

Ao final da Fase 1, o conteúdo era servido corretamente, mas `worker/studies-content/manifest.js` ainda conhecia cinco funções específicas de anexação de atividades formativas:

- introdução;
- CMN/BCB;
- Copom/CVM;
- operadores/seguros;
- pagamentos/revisão.

Esse desenho escala mal: cada novo conjunto de aulas poderia exigir mais uma função `attach*` no manifesto, misturando crescimento de conteúdo com mudança do motor.

## Solução do Recorte A

Criar `worker/studies-content/application-registry.js` como camada declarativa única.

O registro descreve por dados:
- `missionId`;
- seção-âncora;
- versão das atividades;
- conjunto de tarefas;
- necessidade de incorporar fontes adicionais;
- exigência de as fontes já pertencerem à aula.

O manifesto passa a executar apenas:

`BASE_MISSIONS.map(teachMission).map(attachApplications)`

A função genérica não contém conhecimento de CMN, Banco Central, Copom, CVM, seguros, pagamentos ou Chefe.

## Preservação

Este recorte não altera:
- IDs das nove missões;
- IDs ou textos das 27 atividades formativas;
- as 38 questões pontuadas;
- gabaritos;
- XP;
- passScore do Chefe;
- conteúdoVersion das aulas;
- tentativas ou progresso persistido;
- revisões;
- conquistas;
- avaliação independente.

Os módulos antigos de autoria continuam existindo como fontes dos dados nesta etapa. Suas funções específicas permanecem temporariamente para compatibilidade dos testes isolados, mas deixam de fazer parte da composição do manifesto de produção.

## Validação

A suíte deve comprovar:
1. nove definições declarativas atuais;
2. 27 atividades preservadas;
3. validador genérico sem erros;
4. o manifesto usa somente `attachApplications`;
5. uma missão sintética nova recebe atividades pelo mesmo `attachApplicationDefinition`, sem nova função por aula;
6. toda a suíte preexistente continua verde.

## Próximo recorte

Após a integração na `main` em `419e10644173effb548a230c82bd62476a21aa2e`, o próximo recorte é:
- transformar o feedback das questões em contrato reutilizável capaz de informar por que a resposta correta é correta, por que a escolha falhou e qual conceito/trecho revisar;
- preservar compatibilidade com questões antigas enquanto o conteúdo é enriquecido progressivamente.

Esse próximo passo atende diretamente a exigência de Feedback da Fase 2 sem reescrever o banco inteiro de uma só vez.
