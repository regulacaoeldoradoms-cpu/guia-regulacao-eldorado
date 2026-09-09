# Telemedicina — Justificativa de falta no card e no Copiar motivo V27

Decisão permanente registrada em 09/09/2026.

## Objetivo

A justificativa informada ao registrar uma **Falta** deve permanecer visível no próprio card do acompanhamento e também substituir a informação de previsão de retorno no texto gerado por **Copiar motivo**.

A falta não possui data-alvo artificial. Por isso, a redação `Previsão de retorno: não informada` não representa corretamente esse fluxo e deixa de ser usada especificamente para registros estruturados de falta.

## Regras de apresentação

Para acompanhamentos cuja conduta seja `FALTA DO PACIENTE`, `followupMode` seja `absence` ou a marca estruturada `absence` esteja ativa:

- o card apresenta **Justificativa:** seguida exatamente da justificativa registrada;
- a informação é exibida tanto em Lista quanto em Grade e também na interface mobile;
- o texto não substitui nem altera o histórico longitudinal;
- o estado continua `SOLICITAR`/`SOLICITAR NOVAMENTE` até a confirmação da nova solicitação;
- não são criadas data-alvo ou datas de lembrete;
- a justificativa vem de `absenceReason`, com compatibilidade de leitura de `notes` para registros já existentes;
- nenhum dado novo é persistido apenas para esta apresentação.

## Regra do Copiar motivo

Para uma falta, o texto copiado segue este formato:

> Data da última consulta: 21/08/2026. Nova solicitação de retorno devido ao não comparecimento do paciente no atendimento anterior. Justificativa: NÃO PÔDE COMPARECER, TINHA ORTOPEDIA EM DOURADOS.

Assim, a falta é uma exceção deliberada ao formato geral da V20, que termina com **Previsão de retorno** nos retornos que efetivamente possuem previsão.

Para acompanhamentos que não sejam faltas, a geração V20 permanece inalterada.

## Implementação

A V27 é uma camada de compatibilidade pequena e isolada:

- `js/telemedicina-absence-reason-v27.js` captura os acompanhamentos já entregues pela API autenticada, exibe a justificativa no card e adapta somente a cópia de faltas;
- `css/telemedicina-absence-reason-v27.css` mantém a justificativa legível e integrada à identidade visual existente;
- a camada é carregada depois de `telemedicina-justification-v20.js` e antes de `telemedicina.js`, preservando os módulos anteriores;
- não há mudança de Worker, banco, autenticação, permissões ou regra assistencial.

## Segurança e privacidade

A justificativa já pertence ao acompanhamento autenticado e já é apresentada no histórico do paciente. A V27 não envia esse conteúdo a terceiros, não o grava no repositório e não amplia o conjunto de dados retornado pelo backend.

Nenhum dado real de paciente foi incluído nos arquivos versionados; exemplos e testes usam conteúdo fictício.

## Movimento e acessibilidade

A rota `/telemedicina/` continua sem animações e transições conforme a decisão anterior. A justificativa é textual, não depende de cor e possui contraste e quebra de linha apropriados para desktop e mobile.

## Critérios de regressão

1. Falta continua exigindo justificativa no registro.
2. A justificativa aparece no card de falta.
3. `Copiar motivo` de falta contém `Justificativa:` com o texto registrado.
4. `Copiar motivo` de falta não contém `Previsão de retorno: não informada`.
5. Retornos comuns continuam contendo previsão de retorno quando aplicável.
6. Estados, datas, lembretes, histórico, permissões e persistência permanecem inalterados.
7. Lista, Grade, desktop e mobile continuam funcionando.
8. A rota continua sem animações.
