# MISSÃO BANCÁRIA — EVIDÊNCIA DE RETENÇÃO SEM FALSO DOMÍNIO

Data: 27/09/2026.  
Fase ativa: Fase 1.  
Branch inicial: `feat/missao-bancaria-evidencia-retencao`, empilhada sobre os pré-requisitos do backend.

## Problema

A plataforma já separava cobertura de acerto, mas o cartão da missão mostrava principalmente:
- estado de conclusão;
- acerto acumulado nas tentativas.

Isso não informa se o conteúdo ainda pode ser recuperado dias depois. Ao mesmo tempo, transformar uma revisão em selo de “dominado” seria precipitado, porque:
- as revisões atuais reapresentam questões do próprio bloco;
- ainda não há banco independente de avaliação suficiente;
- três ciclos não equivalem a um simulado representativo;
- parte do histórico foi criada antes do protocolo de rodadas com score isolável.

## Regra adotada

A interface passa a mostrar uma terceira dimensão: **evidência de retenção**.

Ela não concede XP, não altera progresso e não bloqueia estudo. É apenas diagnóstico descritivo.

Estados:

1. **Sem revisão posterior**
   - nenhuma revisão concluída registrada para aquele tópico.

2. **Revisão histórica sem nota isolável**
   - existe revisão concluída anterior ao protocolo que permite identificar seu score separadamente;
   - o registro é preservado, sem inventar uma pontuação retroativa.

3. **Evidência em coleta**
   - há uma ou duas revisões com score de rodada identificado;
   - mostra quantidade de ciclos e a pontuação da revisão mais recente;
   - não chama o conteúdo de dominado.

4. **Ciclos previstos observados**
   - os três ciclos atuais (+1, +7 e +30 dias) possuem evidência registrada;
   - ainda não significa prontidão de prova.

## Dados utilizados

Nenhuma tabela nova.

A evidência usa:
- `study_reviews`: tópico, ciclo e conclusão;
- `study_rounds`: score da rodada de revisão quando o protocolo novo o registrou.

Para revisões já concluídas sem uma rodada pontuada compatível, o score permanece desconhecido. Nenhuma tentativa é reatribuída por aproximação de horário.

## Dashboard

Cada missão continua exibindo:
- **Acerto nas tentativas** — desempenho acumulado das tentativas já registradas;
- **Retenção** — evidência de revisões posteriores.

Exemplos de rótulo:
- “Retenção: sem revisão posterior”;
- “Retenção: 2/3 revisões com resultado · última: 83.3% · evidência em coleta”.

O objetivo é impedir que uma boa pontuação logo depois da leitura seja confundida com memória duradoura.

## O que esta métrica NÃO faz

- não certifica domínio;
- não calcula probabilidade de aprovação;
- não muda a conquista do Chefe;
- não altera cobertura;
- não substitui questões independentes;
- não transforma repetição da mesma pergunta em simulado;
- não estabelece corte de 75% ou 85% como verdade universal.

Um critério de prontidão só poderá usar retenção depois que existirem avaliações independentes e simulados coerentes com o edital.

## Testes

Foram adicionados testes para:
- ausência de revisão;
- histórico sem score;
- uma/duas revisões como evidência em coleta;
- três ciclos sem linguagem de domínio;
- duplicidade do mesmo ciclo sem contagem dupla;
- interface mantendo “Acerto nas tentativas” e “Retenção” como conceitos distintos.

O cálculo escolhe um registro por ciclo e preserva a revisão mais recente daquele ciclo, sem inflar a quantidade.

## Continuidade

Próximos passos pedagógicos:
1. criar banco de avaliação independente do exemplo/questão já praticada;
2. adicionar caderno de erros por conceito;
3. usar retenção + avaliação independente + cobertura no futuro diagnóstico de prontidão;
4. manter “Prontidão de prova” como não medida até haver evidência suficiente.

A Fase 1 continua aberta e sem homologação humana. O objetivo desta entrega é coletar evidência melhor, não produzir uma conclusão mais otimista.
