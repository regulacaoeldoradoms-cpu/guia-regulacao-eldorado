# MISSÃO BANCÁRIA — AVALIAÇÃO INDEPENDENTE DO TREINO

Data: 28/09/2026.  
Fase ativa: Fase 1.  
Estado: especificação técnica/pedagógica; sem código de produção nesta entrega.

## 1. Problema

As questões atuais cumprem três funções importantes:
- verificar compreensão logo após a aula;
- corrigir erros;
- sustentar revisões e o Chefe do primeiro bloco.

Mas muitas delas ficam visíveis durante o próprio ciclo de aprendizagem. Depois de uma tentativa, o comentário e a alternativa correta também passam a fazer parte da memória do aluno.

Por isso, repetir essas mesmas questões mede uma combinação de:
- compreensão do conceito;
- familiaridade com o enunciado;
- lembrança da alternativa;
- retenção parcial.

Isso **não é evidência independente suficiente de domínio**.

## 2. Objetivo

Criar uma camada de avaliação separada do material de treino, composta por itens inéditos para o aluno até o início da rodada.

A avaliação independente deve medir se o aluno consegue:
1. reconhecer o conceito em formulação diferente;
2. distinguir alternativas plausíveis;
3. combinar conceitos de aulas distintas;
4. transferir o que aprendeu para uma situação nova;
5. responder sem consultar o material durante a rodada.

Ela não substitui ensino, prática ou revisão. Vem **depois** deles.

## 3. Separação obrigatória

### Questões de ensino/prática
- aparecem na missão;
- podem ser refeitas;
- recebem comentário imediato;
- servem para aprender e corrigir;
- podem alimentar retenção, mas não bastam para prontidão.

### Questões independentes
- não aparecem no material da aula;
- não aparecem no bootstrap como conteúdo navegável antes da rodada;
- não são usadas como exemplo resolvido;
- não são usadas nas atividades de autoexplicação;
- não são reutilizadas como revisão comum antes de terem cumprido sua função avaliativa;
- durante a rodada, o envio de uma resposta apenas registra a alternativa; acerto, gabarito e explicação ficam retidos até o encerramento da forma inteira, para uma questão não ensinar a seguinte.

## 4. Catálogo inicial — primeiro bloco de SFN

Criar um banco autoral separado do banco das 38 questões atuais.

Primeiro lote recomendado:
- **32 itens independentes**;
- quatro itens por cada uma das oito aulas de ensino;
- duas formas não sobrepostas, **A e B**, com 16 itens cada;
- cada forma contém dois itens primários de cada aula, evitando que uma aula fique sem amostra;
- nenhum item da forma A reaparece na forma B;
- o Chefe atual não conta como item independente;
- o banco deve equilibrar distinção entre conceitos próximos, aplicação em situação nova e integração entre aulas, sem virar prova de simples memorização literal.

A mudança de 24 para 32 itens resolve uma lacuna do desenho anterior: um banco de 24 itens não permitia duas medições equilibradas por aula sem consumir ou repetir itens. As duas formas de 16 preservam uma segunda evidência realmente inédita.

Cada item deve registrar:
- ID estável, prefixo `eval.sfn.*`;
- competências avaliadas;
- aulas/trechos que ensinam o conhecimento necessário;
- fontes oficiais que sustentam a resposta;
- dificuldade editorial;
- versão do conteúdo;
- alternativa correta e explicação;
- motivo de cada distrator plausível.

Nenhum item pode cobrar assunto que só apareça no próprio gabarito.

## 5. Rodadas

Uma avaliação independente é uma rodada própria.

Requisitos:
- identificação persistida;
- conjunto de questões congelado no início;
- uma resposta por item/rodada;
- sem consulta ao texto dentro da interface enquanto a rodada estiver ativa;
- **sem feedback de correção por item antes do fechamento da rodada**;
- resultado calculado apenas com itens daquela rodada;
- a primeira medição usa a forma A;
- a segunda medição usa a forma B e não pode ocorrer antes de sete dias após a conclusão da forma A;
- depois de A e B, uma nova avaliação só conta como evidência independente nova quando houver itens ainda não vistos ou variantes equivalentes editorialmente validadas;
- respostas de outra aba, revisão ou missão não contam;
- falha de rede precisa ser idempotente, seguindo as garantias já criadas para rodadas comuns.

Não reutilizar automaticamente `study_rounds.mode` enquanto seu CHECK aceitar apenas `lesson/boss/review`. Implementar schema compatível explicitamente ou tabela própria; não contornar a restrição.

## 6. Persistência recomendada

Evitar misturar o resultado independente com `mastery_score` atual até existir regra validada.

Estrutura sugerida:
- `study_assessment_rounds`;
- `study_assessment_answers`.

Campos mínimos da rodada:
- assessment_id;
- username;
- block_id;
- form_id (`A`, `B` ou versão posterior);
- assessment_version;
- content_version;
- question_ids;
- started_at;
- completed_at;
- score;
- status.

A resposta deve vincular:
- rodada;
- item;
- alternativa;
- correção;
- timestamp.

Nenhum dado institucional entra nessas tabelas.

## 7. Quando liberar

Para o primeiro bloco:
- só depois de concluir as oito aulas e o Chefe;
- a **forma A** pode ser liberada imediatamente para medir transferência sem consulta;
- a **forma B** só fica elegível após pelo menos sete dias da conclusão da forma A;
- a prontidão do bloco não deve ser definida por nenhuma dessas rodadas isoladamente.

A forma B funciona como evidência temporalmente separada. Revisões realizadas nesse intervalo continuam sendo parte legítima do aprendizado; o objetivo não é impedir revisão, e sim verificar aplicação em itens diferentes depois de tempo decorrido.

## 8. Resultado exibido

Mostrar separadamente:
- score da avaliação independente;
- quantidade de itens;
- data;
- competências com mais erros;
- comparação com avaliações independentes anteriores do mesmo bloco.

Não mostrar:
- “aprovado no concurso”;
- probabilidade de aprovação;
- “domínio total”;
- ranking social.

Rótulo sugerido:
**Avaliação independente — evidência de aplicação**.

## 9. Critério provisório e cautela

Não fixar agora 75% ou 85% como verdade pedagógica universal.

Enquanto o banco independente for pequeno:
- mostrar score bruto e histórico;
- registrar competências frágeis;
- não transformar um corte arbitrário em selo de domínio.

Critérios de prontidão devem ser calibrados depois de:
- ampliar o banco;
- observar uso real;
- comparar retenção;
- criar simulados representativos.

## 10. Proteção contra vazamento

O endpoint de catálogo público não deve enviar:
- resposta correta;
- explicação;
- banco inteiro de avaliação ainda não sorteado.

O servidor deve selecionar os IDs da rodada e retornar somente:
- prompt;
- alternativas;
- metadados necessários para exibição.

A correção vem do servidor. Durante a rodada, o endpoint de resposta retorna apenas recibo/idempotência; **não retorna `correct`, alternativa correta ou explicação**. O diagnóstico completo só é liberado depois do fechamento da forma.

## 11. Uso pedagógico do erro

Depois da rodada:
- indicar a competência que falhou;
- apontar qual aula/trecho revisar;
- não despejar apenas o gabarito;
- gerar uma missão de recuperação ou recomendação de releitura quando houver evidência suficiente.

O caderno de erros futuro deve registrar **conceito/categoria**, não apenas ID da questão.

## 12. Testes obrigatórios antes de integrar

- item independente não aparece no catálogo comum;
- gabarito não vaza no bootstrap;
- rodada congela os itens;
- forma A e forma B não compartilham itens;
- forma B é bloqueada antes do intervalo mínimo de sete dias;
- resposta individual não revela acerto/gabarito antes do encerramento;
- respostas de treino/revisão não contam;
- repetição de POST não duplica resposta;
- usuário diferente não acessa;
- outra missão/bloco não contamina score;
- conteúdo atualizado invalida rodada incompatível sem apagar histórico;
- resultado não concede XP por simples participação;
- resultado não altera prontidão automaticamente;
- questões possuem vínculo de ensino e fonte;
- todo item possui distratores justificados editorialmente.

## 13. Sequência de implementação

1. validar esta especificação contra o código já integrado;
2. definir schema sem violar CHECKs existentes;
3. criar catálogo independente inicial com 32 itens;
4. validar pedagogicamente os 32 itens e o equilíbrio das formas A/B;
5. implementar endpoints/rodadas;
6. implementar interface;
7. testar isolamento, vazamento e idempotência;
8. integrar somente depois da cadeia #510–#512 estar estabilizada;
9. usar os resultados apenas como evidência, não como selo de aprovação.

## 14. Critério de aceite

A entrega será considerada tecnicamente pronta quando Wellyton puder fazer uma rodada com questões que nunca apareceram no treino, receber diagnóstico por competência e retornar ao ensino indicado sem que o sistema confunda isso com XP, cobertura ou prontidão.

A suficiência pedagógica do banco ainda dependerá de uso real e expansão posterior.
