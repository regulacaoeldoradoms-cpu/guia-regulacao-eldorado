# Telemedicina - Falta com nova solicitação opcional V43

Decisão permanente registrada em 30/09/2026.

## Objetivo

Corrigir a regra anterior em que toda **Falta** criava automaticamente uma pendência para solicitar o paciente novamente.

A partir da V43, registrar uma falta exige duas decisões separadas:

1. informar a **Justificativa da falta**;
2. informar explicitamente se o paciente **precisa** ou **não precisa** ser solicitado novamente.

Nenhuma das duas opções é presumida pela interface nova.

## Comportamento

### Solicitar novamente

Quando o operador escolher **Solicitar novamente**:

- a conduta continua sendo `FALTA DO PACIENTE`;
- a justificativa continua registrada no histórico;
- `absenceNeedsRequest` é gravado como `true`;
- `absencePendingRequest` fica `true`;
- o acompanhamento permanece ativo;
- o status derivado continua `SOLICITAR`;
- o card continua exibindo **SOLICITAR NOVAMENTE**;
- não são criadas data-alvo nem datas de lembrete artificiais.

### Não solicitar novamente

Quando o operador escolher **Não solicitar novamente**:

- a conduta continua sendo `FALTA DO PACIENTE`;
- a justificativa continua registrada no histórico longitudinal;
- `absenceNeedsRequest` é gravado como `false`;
- `absencePendingRequest` fica `false`;
- o acompanhamento daquela falta é encerrado sem criar pendência operacional;
- o registro não entra em **Solicitar agora**, **Atrasados**, **Em aguardo** ou **Sem programação**;
- não são criadas data-alvo nem datas de lembrete;
- a falta permanece disponível no histórico do paciente.

## Alterar situação

O fluxo **Alterar situação** usa a mesma decisão binária quando a situação correta é **Falta do paciente**.

Registros antigos de falta, criados antes da V43 e sem o campo `absenceNeedsRequest`, são interpretados no editor como **Solicitar novamente** para preservar o comportamento histórico. O operador pode então escolher **Não solicitar novamente** e salvar a correção.

A correção continua preservando o histórico anterior e gera o evento de correção já existente.

## Compatibilidade

Clientes antigos em cache que ainda não enviam `absenceNeedsRequest` mantêm o comportamento anterior no Worker: a ausência é tratada como se precisasse de nova solicitação. Isso evita que uma versão antiga do frontend encerre uma pendência silenciosamente.

O frontend V43 sempre exige a escolha explícita antes de salvar uma nova falta.

## Desktop e mobile

A mesma regra vale para:

- modal desktop **Registrar teleconsulta**;
- formulário inline mobile;
- modal **Alterar situação**.

A interface não usa apenas cor para comunicar a escolha: as opções possuem texto completo e controles de rádio acessíveis.

### Correção visual V43.1 — Alterar situação no tema escuro

Correção registrada em 30/09/2026 após validação visual em produção.

No modal **Alterar situação**:

- o bloco **Falta do paciente** deve herdar integralmente as superfícies, bordas, texto e campos do tema escuro;
- as opções **Solicitar novamente** e **Não solicitar novamente** permanecem em dois cartões equivalentes no desktop e uma coluna em telas estreitas;
- o controle de rádio deve manter tamanho compacto fixo e não pode herdar a regra genérica de inputs do desktop, que usa largura total e altura mínima de 48 px;
- título, descrição e ajuda de cada cartão devem permanecer dentro dos limites do próprio cartão, com quebra de linha quando necessário;
- a correção é restrita a este fluxo e não altera a composição geral do desktop.

## Segurança e dados

- nenhuma permissão ou papel foi ampliado;
- o endpoint autenticado da Telemedicina continua sendo utilizado;
- nenhum dado de paciente foi versionado;
- a nova informação persistida é apenas o estado operacional booleano `absenceNeedsRequest`.

## Arquivos principais

- `js/telemedicina-absence-v24.js`;
- `js/telemedicina.js`;
- `js/telemedicina-mobile-v9.js`;
- `css/telemedicina-absence-v24.css`;
- `worker/telemedicine.js`;
- `worker/telemedicine-router-v2.js`;
- `worker/tests/telemedicine-absence-request-v43.test.mjs`;
- `telemedicina/index.html`.

## Critérios de regressão

1. Falta continua exigindo justificativa.
2. Nova falta exige escolha explícita entre solicitar e não solicitar novamente.
3. **Solicitar novamente** continua entrando em `SOLICITAR`.
4. **Não solicitar novamente** não cria qualquer pendência operacional.
5. Ambas as escolhas mantêm a falta e a justificativa no histórico.
6. **Alterar situação** permite aplicar a mesma escolha a faltas existentes.
7. Registros legados sem a nova propriedade continuam compatíveis.
8. Nenhuma data ou lembrete artificial é criado para falta.
9. Desktop e mobile seguem a mesma regra.
10. Nenhum dado sensível é adicionado ao repositório.
