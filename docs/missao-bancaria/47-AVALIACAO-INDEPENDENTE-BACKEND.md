# MISSÃO BANCÁRIA — AVALIAÇÃO INDEPENDENTE — BACKEND V1

Data: 29/09/2026.  
Fase ativa: Fase 1.  
Branch: `feat/missao-bancaria-avaliacao-independente-backend`.  
Dependências: documentos 41, 44 e 45; cadeia técnica até a sequência histórica.

## Objetivo

Implementar a camada de backend da avaliação independente do primeiro bloco de SFN sem misturá-la ao banco de treino, sem expor gabarito durante a rodada e sem converter resultado em XP, cobertura ou prontidão.

## Catálogo

Arquivo: `worker/studies-assessment-content/sfn-foundation-v1.js`.

- 32 itens autorais;
- Forma A: 16;
- Forma B: 16;
- duas questões primárias de cada uma das oito aulas por forma;
- IDs `eval.sfn.*` separados do banco comum;
- respostas, explicações, competências e fontes ficam somente no backend;
- o manifesto comum das missões não importa esse banco;
- o bootstrap normal continua sem enviar itens independentes.

A estrutura foi gerada a partir do rascunho editorial do documento 44 e recebe validação automática de:
- unicidade dos IDs;
- tamanho e equilíbrio A/B;
- ausência de sobreposição;
- alternativas/resposta válidas;
- vínculo de aula, competência, ensino e fonte conhecida.

A revisão factual/editorial humana do banco continua necessária antes de chamar a experiência de homologada.

## Persistência

Serviço: `worker/study-assessments.js`.

Tabelas aditivas:
- `study_assessment_rounds`;
- `study_assessment_answers`.

A rodada armazena:
- bloco;
- forma;
- versão da avaliação;
- versão pedagógica do bloco;
- IDs congelados;
- início/conclusão;
- score;
- status;
- resultado final persistido.

A resposta armazena:
- avaliação;
- item;
- alternativa;
- correção;
- horário.

Nenhuma tabela de treino foi alterada.

## Elegibilidade

Forma A:
- somente após as oito aulas + Chefe com cobertura concluída;
- uma vez por versão;
- reutiliza rodada ativa compatível em vez de duplicar.

Forma B:
- somente depois da Forma A;
- intervalo mínimo de sete dias;
- sem reutilizar IDs da A;
- uma vez por versão.

Rodada ativa incompatível por versão é marcada como `invalidated`, sem apagar histórico.

## Endpoints

- `GET /api/studies/assessments/banking.sfn-foundation`
- `POST /api/studies/assessments/banking.sfn-foundation/start`
- `POST /api/studies/assessments/:assessmentId/answers`
- `POST /api/studies/assessments/:assessmentId/complete`

O GET retorna apenas estado, nunca o banco.

O início retorna somente os 16 itens da forma escolhida com prompt/opções/metadados públicos.

Durante a rodada, a resposta individual retorna apenas:
- avaliação;
- ID da questão;
- se a gravação foi nova;
- quantidade respondida;
- total.

Não retorna acerto, gabarito ou explicação.

A correção completa aparece somente no fechamento, depois de todos os 16 itens.

## Idempotência

- início repetido reutiliza a rodada ativa;
- resposta repetida com a mesma alternativa é idempotente;
- tentativa de trocar a alternativa já gravada retorna conflito;
- fechamento repetido devolve o mesmo resultado persistido.

## Diagnóstico

No fechamento:
- score bruto;
- total/acertos;
- diagnóstico por competência;
- aulas recomendadas para revisão;
- resultado item a item com explicação.

Isso é **evidência de aplicação**, não domínio certificado ou prontidão de concurso.

## Preservação

A avaliação independente:
- não concede XP;
- não altera cobertura;
- não altera `readiness`;
- não alimenta automaticamente `mastery_score`;
- não mistura dados institucionais;
- continua exclusiva para a conta autorizada pelo gate geral de `/api/studies/*`.

## Testes

A suíte nova cobre:
- 32 itens balanceados A/B;
- fontes conhecidas;
- ausência de `eval.sfn.*` no catálogo comum;
- bloqueio antes dos pré-requisitos;
- início A sem gabarito;
- reutilização da rodada ativa;
- resposta idempotente;
- conflito ao trocar alternativa;
- fechamento incompleto;
- fechamento completo e idempotente;
- intervalo de sete dias para B;
- não sobreposição A/B;
- invalidação de rodada ativa incompatível;
- ausência de XP/alteração de cobertura.

O roteador real com SQLite também cobre GET/POST sem vazamento de correção.

## Limites desta entrega

- interface da avaliação independente ainda não foi implementada;
- a forma B depende de tempo real entre as medições;
- o banco autoral ainda deve passar revisão factual/editorial final;
- esta branch permanece empilhada e não deve ser promovida antes das dependências técnicas.

## Próxima etapa

1. concluir e integrar retomada + sequência histórica;
2. validar CI deste backend;
3. revisar os 32 itens;
4. implementar interface;
5. testar fluxo de navegador sem consulta durante a rodada;
6. integrar somente com todos os gates aprovados.
