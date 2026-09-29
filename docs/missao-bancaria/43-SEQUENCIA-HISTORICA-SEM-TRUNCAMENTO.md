# MISSÃO BANCÁRIA — SEQUÊNCIA HISTÓRICA SEM TRUNCAMENTO

Data: 28/09/2026.  
Fase ativa: Fase 1.  
Branch: `fix/missao-bancaria-sequencia-historica`, empilhada sobre a retomada controlada de sessão.

## Problema

A sequência de estudo era calculada a partir dos 500 eventos mais recentes somando tentativas, sessões encerradas e eventos de XP.

Esse limite era suficiente no início, mas podia apagar dias antigos do histórico quando o usuário acumulasse muitas questões no mesmo período. Como consequência, a melhor sequência histórica poderia diminuir artificialmente apesar de os dados continuarem no banco.

## Regra implementada

O backend deixa de transportar até 500 eventos individuais e passa a agregar **dias locais distintos** diretamente no SQLite/D1.

Fontes consideradas permanecem as mesmas:
- tentativas de questões;
- sessões encerradas com pelo menos 60 segundos;
- eventos de XP legítimos.

A consulta usa `UNION` por dia e retorna somente os dias em que houve atividade válida.

Para os registros da Missão Bancária, criados a partir de 2026, o dia local de Campo Grande é calculado como UTC-4. Não há horário de verão aplicável a esse período.

## Resultado

- não existe mais `LIMIT 500` na fonte da sequência;
- 600, 6.000 ou mais eventos concentrados nos mesmos dias não fazem a série antiga desaparecer;
- o payload cresce pelo número de **dias distintos**, não pelo número de cliques;
- atividade duplicada no mesmo dia continua contando uma única vez;
- abertura simples da página continua sem criar dia de sequência.

## Preservação

- nenhuma tabela ou coluna nova;
- nenhum recálculo destrutivo;
- XP e histórico permanecem intactos;
- nenhuma sessão antiga é alterada;
- nenhuma ação visual sozinha cria sequência;
- regra de sessão válida (encerrada e >=60 s) permanece.

## Testes

A suíte mantém os testes de dias locais, lacunas e duplicações e acrescenta cenário com 600 eventos distribuídos sobre uma sequência histórica de 20 dias.

Também existe teste estrutural impedindo a volta de `LIMIT 500` no cálculo da sequência.

## Continuidade

Com esta correção e a retomada de sessão, os dois limites técnicos explicitamente registrados após o cronômetro deixam de depender de trabalho futuro.

Permanecem para o fechamento da Fase 1:
- integrar e validar as PRs empilhadas;
- avaliação independente especificada no documento 41;
- comprovação de publicação;
- homologação humana do fluxo pedagógico.
