# MISSÃO BANCÁRIA — FASE 2 — RECORTE C1
## Estados pedagógicos persistentes e derivados

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Dependência: Recorte B4.

## Objetivo

Implementar os estados pedagógicos definidos no documento da Fase 2 sem inventar progresso nem confundir estados locais com domínio ou prontidão de prova.

Estados:
1. Não iniciado;
2. Em leitura;
3. Leitura concluída;
4. Prática;
5. Revisão;
6. Consolidado.

## Fonte de verdade

Os estados são derivados de eventos persistidos já existentes:
- `study_topic_progress.coverage_state`;
- sessão/rodada ativa;
- respostas já registradas;
- evidência de revisões posteriores.

A única nova transição persistida é **leitura concluída**.

## Leitura concluída

Abrir uma aula não comprova leitura.

Por isso, `coverage_state=1` só é registrado quando o usuário passa da leitura para a prática por uma sessão real.

Contrato:
- endpoint `POST /api/studies/sessions/:sessionId/reading-complete`;
- exige sessão ativa pertencente ao usuário;
- é idempotente;
- não concede XP;
- não registra tentativa;
- não conclui missão;
- não altera prontidão;
- revisão não rebaixa nem reescreve progresso.

Frontend:
- chama o endpoint apenas quando `pedagogyProtocol: 1` estiver presente;
- Worker antigo continua funcionando sem a chamada;
- falha de rede não bloqueia a prática.

## Derivação

### Não iniciado
Sem cobertura persistida e sem sessão ativa.

### Em leitura
Sessão ativa da missão, ainda sem a transição para prática.

### Leitura concluída
`coverage_state=1` e nenhuma sessão ativa em prática.

### Prática
`coverage_state>=2` antes da conclusão, ou sessão ativa depois da leitura concluída.

### Revisão
Conteúdo coberto (`coverage_state=3`) enquanto o ciclo posterior de revisão ainda não atingiu a evidência completa prevista.

### Consolidado
Conteúdo coberto + três ciclos previstos de revisão com resultado observados.

**Consolidado não significa pronto para prova, domínio certificado ou probabilidade de aprovação.** É apenas um estado do ciclo pedagógico local.

## Preservação

- reabrir missão concluída não regride o estado;
- XP não muda;
- cobertura nunca diminui;
- tentativas e revisões anteriores permanecem;
- avaliação independente não é usada para forçar o estado;
- prontidão continua separada.

## API

Bootstrap adiciona:
- `pedagogyProtocol: 1`;
- `pedagogicalStates`.

Cada estado fornece:
- `id`;
- `label`;
- `explanation`.

## Validação

A suíte deve provar:
- os seis estados;
- leitura ativa antes da prática;
- persistência idempotente de leitura concluída;
- prática após a transição;
- leitura concluída após sair sem responder;
- revisão após cobertura;
- consolidado somente com evidência prevista;
- ausência de regressão ao reabrir conteúdo coberto;
- compatibilidade de frontend com Worker sem o protocolo.
