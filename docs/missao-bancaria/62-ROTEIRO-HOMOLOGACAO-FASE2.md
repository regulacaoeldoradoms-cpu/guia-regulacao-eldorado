# MISSÃO BANCÁRIA — FASE 2
## Roteiro de homologação humana

Data: 30/09/2026.  
Estado: roteiro preparado; executar somente após C1–C4 estarem integrados e publicados.

## Objetivo

Validar no uso real que o motor pedagógico da Fase 2 é compreensível, útil e semanticamente honesto.

A homologação humana complementa os testes automatizados. Ela não deve manipular datas produtivas, apagar histórico ou criar prontidão artificial.

## H1 — Feedback após erro

Em uma missão normal:
1. leia o conteúdo;
2. responda uma questão incorretamente;
3. confirme que o feedback aparece somente depois da tentativa;
4. confirme que explica por que a escolha falhou;
5. confirme que mostra a resposta correta e sua explicação;
6. confirme que **Rever conceito** leva ao trecho ensinado.

Aprovar se o feedback ajuda a corrigir o raciocínio sem ensinar o conceito pela primeira vez somente no gabarito.

## H2 — Feedback no Chefe

Ao errar questão cumulativa do Chefe:
- confirmar que o feedback identifica a origem;
- confirmar que aula anterior aparece como **Revisar depois**;
- confirmar que não troca de missão no meio da rodada.

## H3 — Estados pedagógicos

Durante uso natural, observar:
- aula nunca aberta → Não iniciado;
- sessão aberta antes da prática → Em leitura;
- leitura encerrada e saída antes de responder → Leitura concluída;
- questões em andamento → Prática;
- conteúdo concluído com ciclos posteriores pendentes/em andamento → Revisão;
- após os três ciclos com resultado registrado → Ciclos concluídos, independentemente da nota;
- o cartão explica que concluir ciclos não comprova domínio nem prontidão;
- revisão mais recente sem nota não mostra `null%`, zero inventado nem a nota de um ciclo anterior como se fosse a última.

Aprovar se nenhum estado sugere “pronto para prova” ou transforma ciclos concluídos em aprendizado comprovado. A execução consecutiva de ciclos atrasados continua sendo uma limitação da política atual, documentada no roteiro de continuidade 63; não manipular datas reais para reproduzi-la na homologação.

## H4 — Erros recorrentes

Quando ocorrer naturalmente ou em teste controlado:
- um erro isolado não deve ser apresentado como recorrente;
- após repetição do mesmo erro, o indicador pode aparecer;
- depois de acertar a mesma questão em tentativa posterior, o alerta ativo deve desaparecer;
- histórico de tentativas deve continuar preservado.

## H5 — Domínio recente

Confirmar no dashboard:
- aparece separado de **Acerto nas tentativas**;
- sem evidência suficiente pode aparecer como ainda não medido/provisório;
- revisão posterior pode alterar a métrica;
- nenhum texto associa esse valor a chance de aprovação ou prontidão de prova.

## H6 — Publicação incremental

Na baseline atual:
- o painel não deve marcar retroativamente as nove missões antigas como “novas”;
- com nenhum evento de release pendente, deve informar que não há conteúdo novo/revisão conceitual pendente.

Quando uma nova missão real for publicada no futuro:
- deverá aparecer como nova até ser iniciada;
- missões antigas e seus históricos devem permanecer intactos.

## H7 — Compatibilidade e continuidade

Confirmar que:
- continuar uma sessão existente ainda funciona;
- concluir missão continua funcionando;
- revisões continuam funcionando;
- avaliação independente permanece separada;
- XP e conquistas não mudam por causa dos novos indicadores.

## H8 — Desktop e mobile

Em ambos:
- métricas legíveis;
- cards sem sobreposição crítica;
- aviso de conteúdo novo legível;
- feedback de erro utilizável;
- leitura e prática acessíveis;
- sem alteração visual crítica em outras áreas do Portal.

## Critério de homologação

A Fase 2 pode receber aceite humano quando:
- H1, H2, H5, H7 e H8 forem aprovados;
- H3/H4 forem aprovados nos estados que puderem ser observados sem manipular histórico/datas;
- H6 baseline for aprovado;
- cenários naturalmente dependentes de tempo ou de futura publicação real podem ficar documentados como pendentes temporais, desde que a prova automatizada correspondente esteja verde;
- não exista falha que impeça estudar uma missão real de ponta a ponta.

## Aceite

Após a execução, registrar em `STATUS.md`:
- data;
- cenários observados;
- pendências temporais, se houver;
- problemas corrigidos;
- declaração explícita de aceite ou rejeição.

**Não abrir formalmente a Fase 3 antes do aceite explícito da Fase 2.**
