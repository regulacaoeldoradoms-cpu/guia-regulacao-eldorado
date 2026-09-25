# MISSÃO BANCÁRIA — INTEGRAÇÃO COM CONQUISTAS

## Objetivo

Usar a rota já existente `/conquistas/` como catálogo oficial das medalhas obtidas na Missão Bancária, evitando criar um sistema paralelo.

## Separação obrigatória

A página de Conquistas possui hoje uma progressão de segurança da conta:
- Bronze;
- Prata;
- Ouro.

Esses níveis **não representam desempenho de estudo** e não devem ser alterados pela Missão Bancária.

As medalhas de estudo devem aparecer em categoria própria:

> **Missão Bancária**

Inicialmente, essa categoria e seus dados serão exibidos apenas para a conta `wellyton`.

## Regras técnicas

Cada conquista precisa de:
- ID lógico estável;
- título;
- descrição;
- condição objetiva;
- versão da regra;
- data/hora do desbloqueio;
- estado bloqueada/desbloqueada;
- processamento idempotente.

Exemplos de IDs:
- `study.first_mission`;
- `study.questions.100`;
- `study.questions.1000`;
- `study.sfn.boss`;
- `study.world.banking.complete`;
- `study.mock.exam_target`.

O backend é a autoridade do desbloqueio.

O frontend pode apresentar animação, medalha ou celebração, mas não pode conceder a conquista sozinho.

## Princípios de design

Uma conquista deve representar algo que mereça ser lembrado.

Evitar medalhas por:
- abrir uma tela;
- clicar em um botão;
- permanecer com a página aberta;
- repetir artificialmente uma ação;
- acumular XP sem aprendizagem.

Priorizar:
- conclusão;
- prática acumulada;
- domínio;
- retenção;
- recuperação de dificuldade;
- consistência sustentável;
- desempenho em simulados.

## Catálogo inicial proposto

### Primeira missão
**Regra:** concluir a primeira missão pedagógica real.

### Primeiras 100
**Regra:** responder 100 questões válidas.

### Primeiro chefe
**Regra:** concluir o primeiro chefe temático segundo seu critério mínimo.

### SFN dominado
**Regra:** superar o chefe de Sistema Financeiro Nacional com o critério de domínio definido para a versão vigente.

### Mundo Bancário
**Regra:** completar o primeiro mundo pedagógico de Conhecimentos Bancários.

### 500 questões
**Regra:** atingir 500 questões válidas respondidas.

### 1.000 questões
**Regra:** atingir 1.000 questões válidas respondidas.

### Recuperação
**Regra:** transformar um tópico previamente classificado como frágil em consolidado após ciclo de revisão.

### Simulado competitivo
**Regra:** atingir uma meta de desempenho previamente definida em simulado completo.

### Constância
**Regra:** cumprir uma meta sustentável de estudo em múltiplas semanas. A regra deve evitar incentivar privação de sono, estudo compulsivo ou obrigação de estudar todos os dias.

## Conquistas ocultas

Conquistas-surpresa podem existir no futuro, desde que:
- não dependam de comportamento prejudicial;
- tenham regra objetiva;
- não sejam essenciais para medir progresso;
- sejam registradas no catálogo interno mesmo que a condição fique oculta na interface.

## Celebração

Ao desbloquear:
1. registrar no backend;
2. atualizar XP quando a regra também conceder XP;
3. mostrar celebração curta no módulo de estudos;
4. refletir a medalha em `/conquistas/`;
5. não bloquear a continuidade da sessão de estudo.

A celebração pode usar animação/confete de forma discreta e respeitar preferências de movimento reduzido.

## Persistência

Uma conquista legitimamente obtida não deve desaparecer porque:
- uma aula mudou de posição;
- um novo módulo foi publicado;
- a campanha aumentou;
- houve ajuste editorial;
- o percentual global foi recalculado.

Se uma regra futura for alterada, preservar o registro histórico e a versão da regra que concedeu a medalha.

## Critério de aceite da integração inicial

A integração mínima é aceita quando:
1. Wellyton conclui a primeira missão real;
2. o backend concede `study.first_mission` uma única vez;
3. a interface mostra a conquista;
4. `/conquistas/` exibe a categoria Missão Bancária e a medalha;
5. recarregar ou repetir a missão não duplica a recompensa;
6. outra conta não recebe nem visualiza dados pessoais de estudo;
7. Bronze/Prata/Ouro continuam inalterados.
