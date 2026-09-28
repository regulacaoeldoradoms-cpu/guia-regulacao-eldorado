# MISSÃO BANCÁRIA — AVALIAÇÃO INDEPENDENTE DO PRIMEIRO BLOCO SFN

Data: 28/09/2026.  
Fase ativa: Fase 1.  
Branch inicial: `feat/missao-bancaria-avaliacao-independente-sfn`, empilhada sobre a evidência de retenção.

## 1. Problema pedagógico

As 38 questões atuais fazem parte do processo de ensino e prática. Revisões posteriores reutilizam o conteúdo publicado e, em vários casos, as mesmas questões de prática.

Essas respostas são úteis para aprender e revisar, mas não são evidência suficientemente independente para dizer que o aluno consegue transferir o conhecimento para uma situação nova.

A partir desta entrega ficam separados:

1. **Prática da aula** — ajuda a aprender e corrigir erros logo após o ensino.
2. **Revisão posterior** — observa recuperação depois de um intervalo.
3. **Avaliação independente** — usa questões autorais novas, não apresentadas como prática daquela aula, para verificar aplicação do conteúdo já ensinado.

Nenhuma dessas três dimensões, isoladamente, significa prontidão para o concurso.

## 2. Escopo da primeira avaliação

ID: `assessment.sfn-foundation.transfer.v1`.

Escopo: somente o bloco pedagógico `banking.sfn-foundation`, já ensinado pelas oito aulas e pela preparação do Chefe.

A avaliação é liberada apenas depois da conclusão do Chefe do primeiro bloco.

Ela contém duas formas equivalentes:

- Forma A — 12 questões;
- Forma B — 12 questões.

Total de banco: 24 questões autorais independentes das 38 questões de prática.

As formas cobrem seis competências:

- estrutura do SFN e separação de funções;
- política monetária, Banco Central e Copom;
- mercado de capitais e CVM;
- operadores e classificação básica;
- seguros/previdência/capitalização;
- pagamentos, SPI e consórcios.

Os 24 itens possuem IDs próprios `eval.sfn.*` e não podem colidir com IDs do banco de prática.

## 3. Vínculo obrigatório com o ensino

Cada questão da avaliação aponta para trechos reais das aulas anteriores.

O validador recusa:
- referência a missão inexistente;
- referência a seção inexistente;
- uso do Chefe como substituto da aula;
- item sem explicação;
- alternativa inválida;
- duplicidade de ID ou de enunciado;
- forma que não cubra as seis competências definidas.

A avaliação não introduz matéria nova. A correção orienta quais trechos reler.

## 4. Gabarito e feedback

Durante a tentativa:

- a API entrega somente ID, enunciado e alternativas;
- o backend armazena a correção internamente;
- a resposta do endpoint de registro não informa se houve acerto;
- não há `correctOption` antes da conclusão;
- uma resposta já registrada na mesma tentativa não pode ser trocada;
- sair da tela não encerra a avaliação: a tentativa ativa pode ser retomada.

Depois que as 12 respostas forem registradas:

- o score é calculado;
- o gabarito é revelado;
- cada item recebe explicação;
- os trechos de ensino recomendados para revisão são apresentados.

O último diagnóstico concluído pode ser reaberto sem iniciar uma nova tentativa.

## 5. Primeira tentativa preservada

A primeira pontuação é guardada separadamente da pontuação mais recente.

O histórico expõe:

- quantidade de tentativas concluídas;
- primeiro score;
- último score;
- formas já vistas;
- datas da primeira e da última conclusão.

Repetir a avaliação pode mostrar evolução, mas não substitui o primeiro diagnóstico.

As formas alternam A → B → A → B conforme novas tentativas concluídas. Com apenas duas formas, repetições futuras poderão sofrer efeito de familiaridade; por isso esta avaliação não deve ser usada indefinidamente como simulado de prontidão.

## 6. Sem XP e sem contaminação do treino

A avaliação independente:

- não concede XP;
- não desbloqueia conquista;
- não grava em `study_attempts`;
- não aumenta o contador de questões de prática;
- não altera a taxa de acerto das missões;
- não conclui missão;
- não altera cobertura curricular.

O objetivo é preservar o valor diagnóstico. Recompensar diretamente o score poderia incentivar repetir até memorizar as formas.

## 7. Persistência

Duas tabelas aditivas são criadas após autenticação/autorização:

- `study_assessment_runs`;
- `study_assessment_answers`.

A primeira guarda tentativa, forma, conjunto de questões, score e conclusão. A segunda guarda uma resposta por questão/tentativa.

Há índice único parcial para impedir mais de uma tentativa ativa da mesma avaliação por usuário. Duas aberturas concorrentes convergem para a mesma tentativa ativa.

Nenhuma tabela existente é apagada ou migrada.

## 8. Acesso e segurança

Todas as rotas permanecem sob:

- gate de origem;
- sessão autenticada do Portal;
- autorização exclusiva de `wellyton`.

Rotas:

- `POST /api/studies/assessments/:id/runs` — iniciar/retomar;
- `POST /api/studies/assessments/:id/runs/:runId/answers` — registrar resposta sem revelar gabarito;
- `POST /api/studies/assessments/:id/runs/:runId/complete` — concluir e revelar correção;
- `GET /api/studies/assessments/:id/latest` — rever último diagnóstico.

A abertura é recusada antes da conclusão do Chefe.

## 9. Interface

O dashboard possui um painel **Avaliação independente do bloco**.

Antes do Chefe:
- o painel aparece bloqueado;
- explica o pré-requisito.

Depois do Chefe:
- permite iniciar ou retomar uma forma;
- mostra primeiro e último resultado quando existentes;
- oferece **Rever último diagnóstico**.

Na tentativa:
- o modo é separado da aula;
- não há XP;
- a correção não aparece pergunta a pergunta;
- é possível sair e continuar depois;
- conclusão só é habilitada após as 12 respostas.

Na correção:
- score é descrito como diagnóstico;
- não há “aprovado/reprovado”;
- cada erro informa explicação e material a revisar.

## 10. Testes

Foram preparados testes de conteúdo para:

- duas formas de 12;
- 24 IDs únicos;
- ausência de colisão com as 38 questões de prática;
- cobertura das seis competências;
- referências de ensino válidas;
- ausência de XP, pass score e readiness.

Testes de serviço com SQLite descartável cobrem:

- retomada da tentativa ativa;
- abertura concorrente;
- resposta idempotente;
- proibição de trocar resposta;
- bloqueio da conclusão incompleta;
- score e correção somente no final;
- alternância das formas;
- preservação do primeiro resultado;
- isolamento por usuário.

O roteador real é exercitado com módulos reais e catálogo/autenticação sintéticos para provar:

- bloqueio antes do Chefe;
- gabarito não exposto no endpoint de resposta;
- avaliação fora de `study_attempts` e do XP;
- conclusão apenas após todas as respostas;
- primeira evidência preservada.

O navegador sintético cobre:

- estado bloqueado;
- tentativa sem gabarito;
- saída e retomada;
- correção após as 12 respostas;
- métricas de XP/questões inalteradas;
- reabertura do último diagnóstico;
- responsividade em viewport móvel.

## 11. Limites

Esta avaliação:

- cobre apenas o primeiro bloco de fundamentos do SFN;
- não é prova oficial da Cesgranrio;
- não é simulado completo de CAIXA ou BB;
- não mede redação;
- não cobre as demais áreas do mapa curricular;
- não permite calcular probabilidade de aprovação;
- possui apenas duas formas nesta versão;
- não substitui revisão espaçada.

**Prontidão de prova permanece “Ainda não medida”.**

Avaliações independentes equivalentes deverão acompanhar futuros blocos depois que seu ensino estiver completo.

## 12. Continuidade

Depois da integração técnica:

1. usar esta arquitetura como modelo para avaliações independentes de novos blocos;
2. ampliar o banco somente após produzir ensino correspondente;
3. construir caderno de erros por conceito/competência;
4. posteriormente combinar cobertura, retenção, avaliação independente e simulados completos para um diagnóstico de prontidão;
5. nunca transformar XP ou repetição de uma forma conhecida em prova de domínio.
