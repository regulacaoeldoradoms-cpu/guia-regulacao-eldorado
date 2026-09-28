# MISSÃO BANCÁRIA — SEQUÊNCIA HISTÓRICA SEM TRUNCAMENTO DE 500 EVENTOS

Data: 28/09/2026.  
Fase ativa: Fase 1.  
Branch: `fix/missao-bancaria-streak-historico-completo`, empilhada sobre o marcador de leitura.

## Problema

A sequência de estudo era calculada a partir dos 500 eventos mais recentes entre tentativas, sessões encerradas e eventos de XP.

Esse limite protegia a consulta inicial, mas criava um erro lógico: um usuário com mais de 500 eventos poderia ter dias consecutivos mais antigos simplesmente cortados antes do cálculo. O “melhor sequência” e, em casos de atividade muito intensa, até a sequência atual poderiam ficar menores do que o histórico real.

## Solução

A consulta passa a usar paginação por cursor, em lotes de 500 registros, até consumir o histórico existente.

A ordenação usa:
1. `activity_at DESC`;
2. uma chave estável por origem/evento (`a:`, `s:`, `x:`) para desempatar timestamps iguais.

O cursor da próxima página é o par:
- timestamp do último registro;
- chave do último registro.

Isso evita:
- `OFFSET` crescente;
- repetir registros com o mesmo timestamp;
- cortar silenciosamente o histórico no evento 500.

## O que continua igual

Depois da leitura paginada, o mesmo `computeStudyStreak`:
- converte timestamps para o calendário de `America/Campo_Grande`;
- deduplica múltiplas atividades no mesmo dia;
- calcula sequência atual;
- calcula melhor sequência histórica;
- preserva o último dia de estudo.

Nenhum evento passa a valer mais por existir várias vezes no mesmo dia.

## Teste de regressão

O roteador real com SQLite cria **520 dias consecutivos** de atividade sintética e exige:
- `streak.current === 520`;
- `streak.best === 520`.

A versão limitada a 500 eventos falharia esse teste.

## Segurança e custo

- nenhuma tabela ou migração nova;
- nenhum dado institucional;
- nenhuma alteração de XP, domínio, cobertura ou revisão;
- os lotes continuam limitados a 500 linhas por consulta;
- o número de consultas cresce somente quando o próprio histórico ultrapassa outro lote de 500 eventos.

Este recorte privilegia correção histórica sem fazer uma única leitura ilimitada do banco.

## Continuidade

Com recuperação da rodada, marcador da leitura e sequência histórica corrigidos, a Fase 1 fica mais próxima do fechamento técnico.

Próximos passos:
1. estabilizar/integrar a cadeia técnica pendente;
2. implementar a avaliação independente especificada no documento 41;
3. realizar validação humana da experiência real;
4. registrar aceite formal da Fase 1 antes de declarar avanço de fase.

A expansão de conteúdo continua separada do fechamento técnico do motor.
