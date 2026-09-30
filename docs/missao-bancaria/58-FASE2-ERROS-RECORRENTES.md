# MISSÃO BANCÁRIA — FASE 2 — RECORTE C2
## Erros recorrentes

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Dependência: Recorte C1.

## Objetivo

Transformar o histórico de tentativas em um sinal simples e acionável de lacunas que continuam ativas, sem confundir erro repetido com domínio, retenção ou prontidão de prova.

## Critério conservador

Uma questão é classificada como **erro recorrente ativo** somente quando:
1. possui pelo menos duas tentativas incorretas no histórico;
2. a tentativa mais recente da mesma questão continua incorreta.

Se a tentativa mais recente estiver correta:
- o alerta deixa de ficar ativo;
- os erros anteriores permanecem armazenados;
- nenhuma tentativa é apagada;
- nenhuma métrica histórica é reescrita.

Esse desenho evita manter um alerta eterno depois de uma correção bem-sucedida.

## Fonte de verdade

O recorte usa apenas `study_attempts`.

Não há:
- tabela nova;
- migração;
- evento de XP;
- alteração em cobertura;
- alteração em revisão;
- alteração na avaliação independente.

A consulta agrupa por `topic_id + question_id`, conta tentativas/erros e identifica de forma determinística a tentativa mais recente.

## Contrato do bootstrap

Novo protocolo:
- `errorPatternProtocol: 1`.

Novos dados:
- `metrics.recurringErrors` — número total de questões com erro recorrente ativo;
- `recurringErrors[topicId].count`;
- `recurringErrors[topicId].items[]`.

Cada item contém apenas:
- `questionId`;
- `wrongAttempts`;
- `totalAttempts`;
- `lastAttemptAt`.

Não envia alternativa correta, gabarito ou motivo de distrator no bootstrap.

## Interface

Quando o protocolo estiver disponível:
- dashboard mostra **Erros recorrentes**;
- cada missão mostra **Erros recorrentes ativos: N**.

Com Worker antigo:
- o novo cartão de métrica permanece oculto;
- o restante do módulo continua funcionando.

## Semântica

Erro recorrente:
- não é reprovação;
- não é domínio;
- não é prontidão;
- não reduz XP;
- não bloqueia conteúdo.

É apenas uma indicação de que uma mesma questão ainda está sendo respondida incorretamente depois de repetição.

## Validação

A suíte deve comprovar:
1. uma única resposta errada não ativa o padrão;
2. dois erros com último resultado errado ativam;
3. resposta correta posterior desativa;
4. as tentativas antigas permanecem;
5. o total e o mapa por tópico são coerentes;
6. o navegador mostra a métrica somente quando o protocolo existe;
7. nenhum campo de gabarito novo entra no bootstrap.

## Próximo recorte

Implementar **domínio ponderado por recência** como métrica distinta:
- da cobertura;
- do XP;
- da prontidão de prova;
- do simples percentual histórico acumulado.

A fórmula deverá ser explícita, testável e conservadora.
