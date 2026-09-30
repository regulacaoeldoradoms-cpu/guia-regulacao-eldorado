# MISSÃO BANCÁRIA — FASE 2
## Fechamento técnico candidato

Data: 30/09/2026.  
Estado: **candidato a fechamento técnico; não equivale a aceite humano da Fase 2**.

## Escopo verificado

A Fase 2 exige um motor pedagógico reutilizável capaz de ensinar de forma consistente, publicar conteúdo incrementalmente e preservar o histórico existente.

Esta matriz consolida os recortes:
- A — catálogo pedagógico declarativo;
- B–B4 — feedback pedagógico pós-resposta;
- C1 — estados pedagógicos;
- C2 — erros recorrentes;
- C3 — domínio ponderado por recência;
- C4 — publicação incremental declarativa.

## Matriz dos requisitos

### Unidade pedagógica reutilizável
**Candidato a atendido.**

As missões suportam:
- título e objetivo;
- leitura estruturada antes da prática;
- exemplos/glossário/resumo conforme o contrato;
- recordação ativa e aplicações formativas;
- questões;
- feedback pós-resposta;
- conclusão;
- revisão posterior.

O catálogo e as aplicações são compostos por contratos genéricos, sem função nova específica para cada aula.

### Estados pedagógicos
**Candidato a atendido.**

Estados disponíveis:
1. Não iniciado;
2. Em leitura;
3. Leitura concluída;
4. Prática;
5. Revisão;
6. Ciclos concluídos (ID legado `consolidated`).

“Leitura concluída” é persistida somente na transição real para prática. “Ciclos concluídos” descreve três resultados registrados, inclusive quando todos são zero, e não comprova domínio nem prontidão de prova. Os ciclos podem vencer juntos após atraso; a política atual não garante espaçamento entre as conclusões reais. O documento 63 propõe alternativas sem aprovar reagendamento ou revisão adaptativa.

### Feedback
**Candidato a atendido.**

As 38/38 questões pontuadas do primeiro bloco possuem justificativa específica por alternativa.

Após uma tentativa incorreta, o motor pode mostrar:
- por que a escolha falhou;
- resposta correta;
- por que a resposta correta está correta;
- conceito/trecho para revisão.

No Chefe, referências a aulas anteriores são apresentadas como **Revisar depois**, sem abrir outra missão durante a rodada.

### Métricas
**Candidato a atendido.**

Mantidas separadamente:
- acerto histórico;
- tentativas;
- tempo registrado;
- retenção por revisão;
- erros recorrentes ativos;
- domínio recente ponderado.

Domínio recente:
- usa até 20 tentativas mais recentes;
- aplica decaimento 0,85;
- combina 70% desempenho recente e 30% revisão posterior quando disponível;
- sem revisão, permanece provisório e com teto 70;
- não altera prontidão de prova.

### Erros recorrentes
**Candidato a atendido.**

Uma questão entra no sinal somente quando:
- possui ao menos dois erros históricos;
- a tentativa mais recente permanece incorreta.

Uma resposta correta posterior remove o alerta ativo sem apagar o histórico.

### Publicação incremental
**Candidato a atendido.**

Registro declarativo suporta:
- `draft` e `published`;
- `releaseId`;
- `releaseSequence`;
- impactos `baseline`, `new`, `editorial` e `conceptual`.

Uma missão futura pode ser adicionada por dados. Mudança editorial não força revisão; mudança conceitual já vista pode recomendar revisão sem apagar conclusão.

Metadado explícito inválido falha fechado também em runtime.

### Preservação
**Candidato a atendido.**

Os recortes não reescrevem:
- XP já concedido;
- tentativas históricas;
- conquistas;
- conclusões;
- revisões;
- avaliação independente;
- prontidão.

O teste estrutural do C4 adiciona uma quarta missão após três formatos diferentes e comprova que o objeto de progresso das três anteriores permanece integralmente igual.

## Gates obrigatórios antes do fechamento

Ainda são necessários:
1. integração do C3 na `main` com todos os workflows verdes;
2. integração do C4 na `main` com todos os workflows verdes;
3. confirmação pós-merge de frontend/Pages e Worker produtivo contendo a cadeia C1–C4;
4. homologação humana conforme o documento 62;
5. registro de aceite explícito de Wellyton.

## O que este documento não prova

Este fechamento técnico:
- não declara a Fase 2 aceita;
- não abre a Fase 3;
- não declara o curso completo;
- não mede probabilidade de aprovação;
- não transforma domínio recente em prontidão de prova;
- não aumenta a cobertura curricular além do conteúdo efetivamente publicado.

A cobertura curricular continua sendo registrada separadamente no mapa oficial do projeto.
