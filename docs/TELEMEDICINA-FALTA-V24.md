# Telemedicina - Registro de falta V24

Decisão permanente registrada em 08/09/2026.

> **Complemento V43 — 30/09/2026:** a premissa original de que toda falta exige nova solicitação foi substituída. A falta continua obrigatória no histórico, mas o operador agora escolhe explicitamente **Solicitar novamente** ou **Não solicitar novamente**. A regra vigente completa está em `docs/TELEMEDICINA-FALTA-SOLICITACAO-V43.md`.

## Objetivo

O formulário **Registrar consulta** passa a admitir **Falta** como quarto resultado operacional, ao lado de alta, retorno com prazo/data e retorno após uma condição.

A falta representa uma teleconsulta que não ocorreu porque o paciente não compareceu. Ela não recebe data de retorno artificial nem os três lembretes calculados para retornos clínicos. Desde a V43, a necessidade de nova solicitação é uma decisão operacional explícita, e não uma consequência automática da falta.

## Regras operacionais

- ao selecionar **Falta**, permanecem apenas paciente, data da falta, especialidade e **Justificativa da falta**;
- a justificativa é obrigatória e é preservada no histórico longitudinal;
- o Worker valida `followupMode: absence`; a regra não depende apenas da interface;
- o registro recebe conduta canônica `FALTA DO PACIENTE`;
- o evento longitudinal é gravado como `eventType: falta`;
- quando **Solicitar novamente** é escolhido, o acompanhamento recebe `absenceNeedsRequest: true` e `absencePendingRequest: true`, fica ativo e entra em `SOLICITAR`;
- quando **Não solicitar novamente** é escolhido, `absenceNeedsRequest: false` e `absencePendingRequest: false` são persistidos e não há pendência operacional;
- somente faltas que precisam de nova solicitação aparecem e são contadas junto de **Solicitar agora**;
- faltas não recebem `returnDueDate` nem `reminderDates` artificiais;
- depois de confirmar **Solicitado**, a precedência de `requestedAt` faz o acompanhamento passar para `SOLICITADO` normalmente;
- uma nova consulta posterior para o mesmo paciente e especialidade substitui o estado operacional atual sem apagar os eventos históricos anteriores.

## Interface

No desktop e no formulário inline mobile:

- a opção **Falta** usa ícone SVG profissional, sem emoji;
- o rótulo de data muda para **Data da falta** enquanto esse resultado estiver selecionado;
- os campos de prazo, data-alvo, condição e observação operacional comum ficam ocultos;
- aparecem **Justificativa da falta** e a escolha obrigatória entre **Solicitar novamente** e **Não solicitar novamente**;
- quando houver pendência, o card é identificado como **SOLICITAR NOVAMENTE**;
- a zona de retorno passa a informar **Nova solicitação necessária** e **Falta registrada - sem lembretes programados**;
- no histórico, o evento é apresentado como **Falta registrada** e a observação é identificada como justificativa.

## Relação com Solicitar agora

O indicador **Solicitar agora** passa a representar duas origens operacionais:

1. retornos que entraram na janela dos três dias úteis;
2. faltas registradas que precisam ser solicitadas novamente.

Isso não altera a regra temporal dos retornos existentes. A falta entra diretamente em `SOLICITAR` por sua própria marca estruturada.

## Movimento e acessibilidade

A V24 preserva integralmente a decisão V23 de manter `/telemedicina/` sem animações e transições. A nova opção não reativa confetes, deslocamentos, scroll suave ou qualquer outro movimento.

A informação não depende somente de cor; os textos `Falta`, `SOLICITAR NOVAMENTE`, `Nova solicitação necessária` e o histórico continuam explícitos.

## Arquivos

- `telemedicina/index.html`
- `css/telemedicina-absence-v24.css`
- `js/telemedicina-absence-v24.js`
- `worker/telemedicine.js`
- `worker/telemedicine-rules.js`
- `worker/tests/telemedicine-rules.test.mjs`
- `.github/workflows/validate-telemedicine-absence-v24.yml`

## Critérios de regressão

1. As três condutas anteriores continuam funcionando sem mudança de regra.
2. Falta exige justificativa no cliente e no Worker.
3. Falta não cria data-alvo nem lembretes.
4. Falta pendente deriva `SOLICITAR` mesmo sem `returnDueDate`.
5. Falta confirmada como solicitada deriva `SOLICITADO`.
6. O contador `Solicitar agora` inclui faltas pendentes.
7. O registro aparece no histórico e preserva a justificativa.
8. Desktop e mobile exibem a quarta opção.
9. A rota continua sem animações conforme V23.
10. Nenhum dado de paciente é versionado no repositório.
