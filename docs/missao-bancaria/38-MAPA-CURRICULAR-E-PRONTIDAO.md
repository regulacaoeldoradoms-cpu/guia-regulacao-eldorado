# MISSÃO BANCÁRIA — MAPA CURRICULAR E CRITÉRIOS DE PRONTIDÃO

Data: 27/09/2026.  
Fase ativa: Fase 1.  
Branch inicial: `feat/missao-bancaria-mapa-curricular`, empilhada sobre a entrega de tempo da PR #509.

## 1. Problema corrigido

O bloco inicial do Sistema Financeiro Nacional possuía nove missões publicadas e a aplicação usava a mesma lista como `PUBLISHED_MISSIONS` e `PLANNED_MISSIONS`. Isso fazia o dashboard poder apresentar **9/9** e 100% de disponibilidade sem deixar claro que se tratava somente do primeiro bloco de SFN.

Essa leitura seria pedagogicamente enganosa. O curso-base inclui diversas disciplinas além de Conhecimentos Bancários, e o próprio mundo de Conhecimentos Bancários possui vários blocos ainda não produzidos.

A partir desta entrega, três grandezas ficam separadas:

1. **Bloco atual publicado** — as nove missões hoje existentes no primeiro recorte de SFN.
2. **Cobertura curricular do curso-base** — áreas e blocos de formação previstos para CAIXA/BB.
3. **Prontidão de prova** — não é inferida de XP, leitura ou conclusão de aula; depende futuramente de cobertura, retenção e simulados representativos.

## 2. Editais-base versionados

O mapa usa os mesmos editais-base já registrados no repositório. Eles são referências históricas de planejamento e **não são apresentados como um edital futuro vigente**.

### Banco do Brasil — Seleção Externa 2022/001 — Agente Comercial

Fonte oficial já catalogada: `edital.bb.2022-001`.

Prova objetiva de 70 questões e 100 pontos:
- Língua Portuguesa: 10 questões / 15 pontos;
- Língua Inglesa: 5 / 5;
- Matemática: 5 / 7,5;
- Atualidades do Mercado Financeiro: 5 / 5;
- Matemática Financeira: 5 / 7,5;
- Conhecimentos Bancários: 10 / 15;
- Conhecimentos de Informática: 15 / 22,5;
- Vendas e Negociação: 15 / 22,5.

Redação é etapa separada prevista no edital.

### CAIXA — Edital nº 01/2024/NM — Técnico Bancário Novo

Fonte oficial já catalogada: `edital.caixa.2024-nm`.

Prova objetiva de 60 questões e 60 pontos:
- Língua Portuguesa: 5;
- Língua Inglesa: 5;
- Matemática Financeira: 5;
- Noções de Probabilidade e Estatística: 5;
- Comportamentos Éticos e Compliance: 5;
- Conhecimentos Bancários: 15;
- Conhecimentos de Tecnologia da Informação e Comunicação: 5;
- Conhecimentos e Comportamentos Digitais: 5;
- Atendimento Bancário: 10.

Redação é etapa separada prevista no edital.

Conferência das distribuições: 27/09/2026, nas fontes oficiais já adotadas. Um novo edital deverá gerar nova versão do mapa; não sobrescrever silenciosamente esta base histórica.

## 3. Áreas do curso

O curso-base passa a ter 12 áreas explícitas:

1. Conhecimentos Bancários;
2. Língua Portuguesa;
3. Língua Inglesa;
4. Matemática;
5. Matemática Financeira;
6. Probabilidade e Estatística;
7. Informática e TIC;
8. Vendas, Negociação e Atendimento;
9. Conhecimentos e Comportamentos Digitais;
10. Atualidades do Mercado Financeiro;
11. Ética e Compliance;
12. Redação e Integração de Prova.

Uma área pode ser exigida por apenas um dos editais-base. O mapa guarda essa relação.

## 4. Blocos de formação

Foram definidos **43 blocos de formação**. Esse número é uma decisão de arquitetura pedagógica para organizar o ensino e **não** uma contagem oficial de itens do edital.

Os blocos agrupam competências relacionadas em unidades que futuramente receberão:
- ensino por leitura;
- exemplos resolvidos;
- prática guiada;
- questões independentes;
- revisão;
- diagnóstico de retenção.

O primeiro e único bloco atualmente mapeado como publicado é:

> `banking.sfn-foundation` — SFN, supervisores, operadores e infraestrutura básica.

Ele reúne as nove missões existentes. Os demais blocos permanecem planejados até receberem material real; a existência de um nome no mapa não significa aula pronta.

Estado no momento desta decisão:
- 12 áreas totais;
- 43 blocos planejados;
- 1 área iniciada;
- 1 bloco com material publicado;
- 0 áreas integralmente cobertas.

Mesmo que Wellyton conclua as nove missões atuais, somente esse primeiro bloco pode ficar concluído. **Conhecimentos Bancários continua incompleto e o curso continua incompleto.**

## 5. Métricas exibidas

### Bloco atual

Continua mostrando:
- missões publicadas dentro do bloco;
- missões concluídas dentro do bloco.

Portanto 9/9 pode existir, mas agora é rotulado explicitamente como **bloco atual**, nunca como curso inteiro.

### Curso-base

O dashboard mostra:
- blocos com material publicado / 43;
- áreas iniciadas / 12;
- blocos concluídos / 43;
- áreas integralmente cobertas / 12.

A porcentagem de cobertura usa os blocos pedagógicos do mapa, não a quantidade de questões do edital. Pesos oficiais permanecem registrados separadamente para orientar priorização e simulados.

## 6. XP não é prontidão

Foram removidos nomes de nível que podiam sugerir conclusão competitiva, como:
- “Competitivo”;
- “Pré-aprovação”;
- “Reta final”.

A progressão de XP usa nomes de campanha neutros: Recruta, Explorador, Praticante, Estrategista, Maratonista e Veterano.

XP continua sendo motivação e registro de participação no jogo. Não é probabilidade de aprovação, nota prevista ou certificado de domínio.

## 7. Prontidão de prova

O dashboard passa a exibir **Prontidão de prova — Ainda não medida**.

Ela só poderá ganhar um diagnóstico quando houver evidência suficiente, incluindo:
- cobertura relevante do currículo adotado;
- retenção em revisões espaçadas;
- questões independentes e não apenas itens vistos no ensino;
- desempenho por disciplina, sem média esconder área crítica;
- simulados representativos da distribuição do edital-base;
- execução sob tempo;
- redação quando prevista.

Não definir percentual de prontidão apenas somando XP, horas ou quantidade de aulas lidas.

## 8. Implementação

Arquivo: `worker/studies-content/curriculum-v1.js`.

Ele contém:
- dois perfis de edital-base;
- distribuição oficial de questões/pontos usada como referência;
- 12 áreas;
- 43 blocos pedagógicos;
- vínculo do bloco inicial às nove missões existentes;
- validador;
- cálculo separado de disponibilidade e progresso curricular.

O bootstrap passa a enviar um snapshot do mapa. O dashboard mantém fallback: se um Worker antigo ainda não enviar `curriculum`, o painel novo fica oculto, sem quebrar o estudo.

Não há alteração de D1, perguntas, gabaritos, XP já conquistado, conquistas, aulas ou revisões nesta entrega.

## 9. Próxima prioridade de conteúdo

Depois de estabilizar as entregas técnicas já abertas, a prioridade deixa de ser criar funcionalidades de interface continuamente.

A sequência recomendada é:
1. detalhar Conhecimentos Bancários restante a partir do edital-base;
2. iniciar Português e Matemática/Matemática Financeira em paralelo, com pré-requisitos;
3. abrir Informática/TIC e Vendas/Atendimento cedo por seu peso no BB/CAIXA;
4. produzir Estatística, Ética/Compliance, Digital, Inglês e Atualidades conforme o perfil correspondente;
5. inserir redação antes da reta final, não apenas depois de todas as objetivas;
6. criar avaliações independentes e simulados somente depois de haver ensino correspondente.

A ordem de produção não precisa obrigar o aluno a estudar uma disciplina inteira antes de ver outra. O ciclo de estudo poderá alternar trilhas quando existirem unidades completas.

## 10. Aceite

Esta correção não encerra a Fase 1. O objetivo é impedir uma leitura falsa de progresso e criar a base para construir um curso realmente completo.

A aprovação técnica do mapa não comprova que os futuros materiais sejam suficientes. Cada bloco continua sujeito ao Contrato Pedagógico Global e à avaliação humana de clareza quando Wellyton utilizar o curso.
