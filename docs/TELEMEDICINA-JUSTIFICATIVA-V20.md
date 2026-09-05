# Telemedicina — Justificativa de solicitação V20

## Decisão permanente

Em 05/09/2026, os cards de acompanhamento passam a oferecer a ação vetorial **Copiar motivo** quando o retorno entra em `SOLICITAR` ou permanece pendente em `ATRASADO`. A ação deixa de ser exibida depois de `Solicitado` e não aparece durante `EM AGUARDO`, `SEM PROGRAMAÇÃO`, `SOLICITADO` ou `CONCLUÍDO`.

Essa evolução não altera datas, alarmes, estados, permissões, persistência, modais, histórico ou o registro da solicitação. Ela somente transforma os dados já disponíveis no acompanhamento em uma justificativa pronta para colar no sistema de solicitação.

## Formato copiado

Toda justificativa contém, nesta ordem:

1. data da última consulta;
2. motivo do retorno;
3. previsão de retorno.

Exemplo de prazo:

> Data da última consulta: 06/08/2026. Retorno solicitado pela especialidade após 60 dias. Previsão de retorno: 05/10/2026.

Exemplo de exames:

> Data da última consulta: 06/08/2026. Retorno solicitado para apresentar os exames solicitados. Previsão de retorno: 05/10/2026.

O nome do paciente, observações livres e identificadores pessoais não são acrescentados automaticamente ao texto copiado.

## Regras de redação

O gerador usa primeiro os campos estruturados da conduta e consulta a descrição antiga apenas quando necessário para manter compatibilidade com acompanhamentos importados.

| Situação registrada | Redação central |
|---|---|
| Prazo em dias, semanas, meses ou anos | Retorno solicitado pela especialidade após o prazo registrado. |
| Apenas data-alvo | Retorno solicitado pela especialidade para reavaliação na data indicada. |
| Exames | Retorno solicitado para apresentar os exames solicitados. |
| Fisioterapia | Retorno solicitado após a conclusão das sessões de fisioterapia. |
| Procedimento ou cirurgia | Retorno solicitado após a realização do procedimento ou cirurgia indicada. |
| Conclusão do tratamento | Retorno solicitado após a conclusão do tratamento indicado. |
| Outra condição | Retorno solicitado após o cumprimento da condição registrada, incluindo o detalhe informado. |
| Retorno se necessário | Retorno solicitado pela especialidade conforme necessidade clínica registrada. |
| Acompanhamento genérico | Retorno solicitado pela especialidade para continuidade do acompanhamento. |

Quando a conduta possui detalhe, ele é incluído sem alterar seu significado. Registros legados como `RET 60 DIAS`, `RETORNO COM EXAMES`, `RETORNO APÓS FISIO` e `RETORNO COM 3 MESES APÓS TRATAMENTO` são reconhecidos de forma determinística.

## Interação e acessibilidade

- a ação usa um ícone SVG de prancheta no mesmo estilo de traço dos demais botões;
- a Clipboard API é usada em contexto seguro e existe uma alternativa compatível para navegadores sem essa API;
- o botão informa `Copiando…`, `Copiado` ou `Tente novamente` sem abrir modal;
- a mudança do rótulo é anunciada por tecnologia assistiva e o foco por teclado permanece visível;
- a confirmação visual não depende de animação e respeita a política de movimento reduzido já aplicada aos cards;
- Lista e Grade mantêm o mesmo comportamento no desktop e no mobile.

## Arquivos e validação

- `js/telemedicina-justification-v20.js` concentra a geração do texto e a cópia;
- `js/telemedicina.js` e `js/telemedicina-mobile-v9.js` exibem a ação conforme o mesmo critério;
- `css/telemedicina-cards-v19.css` contém o vetor e os estados visuais da nova ação;
- `worker/tests/telemedicine-justification-v20.test.mjs` cobre todos os tipos de retorno, os estados de exibição e o feedback de cópia.
