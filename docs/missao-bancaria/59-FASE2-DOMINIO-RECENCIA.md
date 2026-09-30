# MISSÃO BANCÁRIA — FASE 2 — RECORTE C3
## Domínio ponderado por recência

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Dependência: Recorte C2.

## Objetivo

Criar uma medida de domínio recente que:
- não seja simples média histórica;
- responda a melhora ou piora recente;
- use revisão posterior quando existir;
- não seja confundida com cobertura, XP ou prontidão de prova.

## Fórmula V1

### Desempenho recente

Para cada tópico:
1. selecionar no máximo as 20 tentativas mais recentes;
2. ordenar da mais recente para a mais antiga;
3. atribuir peso 1 à tentativa mais recente;
4. multiplicar o peso por 0,85 a cada tentativa anterior;
5. calcular a média ponderada de acertos.

Exemplo de pesos:
- mais recente: 1,0000;
- anterior: 0,8500;
- terceira: 0,7225;
- quarta: 0,6141.

Uma resposta recente, portanto, influencia mais que uma tentativa antiga.

### Retenção posterior

Quando houver nota isolável de revisão posterior:
- 70% do domínio vem do desempenho recente ponderado;
- 30% vem da nota da revisão posterior mais recente.

Sem revisão posterior com nota:
- os 30% permanecem sem evidência;
- não são substituídos por 100 nem por média histórica;
- o domínio é marcado como provisório;
- o valor máximo provisório é 70.

Isso é intencionalmente conservador.

## Estados da evidência

### Ainda não medido
Sem tentativas registradas.

### Provisório sem revisão
Existem tentativas, mas ainda não existe revisão posterior pontuada.

### Com revisão posterior
Existe pelo menos uma revisão posterior com nota isolável.

### Com ciclos de revisão observados
Os ciclos previstos já possuem evidência pontuada suficiente segundo o mecanismo de retenção atual.

O rótulo muda; a fórmula 70/30 não muda.

## Contrato

Bootstrap:
- `domainProtocol: 1`;
- `recentDomain.overallScore`;
- `recentDomain.observedTopics`;
- `recentDomain.totalTopics`;
- `recentDomain.byTopic`.

Por tópico:
- `score`;
- `immediateScore`;
- `retentionScore`;
- `attemptCount`;
- `status`;
- `label`;
- `explanation`.

## Domínio geral

O domínio geral é a média simples dos tópicos que possuem domínio medido.

Tópicos ainda sem tentativa:
- não recebem zero artificial;
- não entram na média;
- continuam explicitamente sem evidência.

Cobertura curricular continua mostrando separadamente quantos tópicos/blocos foram realmente estudados.

## Interface

Quando `domainProtocol: 1` estiver presente:
- dashboard mostra **Domínio recente**;
- informa quantos tópicos possuem evidência;
- cada missão exibe seu domínio recente e o estado da evidência.

Com Worker antigo:
- o cartão permanece oculto;
- nenhum fluxo de estudo é bloqueado.

## Preservação

Este recorte não:
- reescreve `study_topic_progress.mastery_score`;
- altera tentativas;
- altera XP;
- altera cobertura;
- muda revisões;
- muda avaliação independente;
- muda prontidão.

A métrica é derivada sob demanda a partir do histórico existente.

## Validação

A suíte deve provar:
1. sem tentativa → não medido;
2. tentativa recente pesa mais que antiga;
3. sem revisão → máximo provisório de 70;
4. revisão posterior entra com 30%;
5. ciclos de revisão alteram o estado descritivo, não a fórmula;
6. roteador real devolve o snapshot;
7. navegador mostra domínio separado de acerto acumulado;
8. prontidão permanece intocada.

## Próximo recorte

Depois do C3, atacar o requisito de **publicação incremental**:
- publicar missão nova sem lógica específica;
- preservar IDs e histórico existentes;
- identificar conteúdo novo disponível;
- distinguir correção editorial de mudança conceitual relevante.
