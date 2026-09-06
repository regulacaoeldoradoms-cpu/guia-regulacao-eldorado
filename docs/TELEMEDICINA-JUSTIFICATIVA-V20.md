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

O nome do paciente e os campos de identificação pessoal não são acrescentados automaticamente ao texto copiado. A observação operacional só fornece o motivo quando registra explicitamente retorno, nova solicitação ou reagendamento; anotações sem relação com a solicitação são ignoradas.

## Cobertura integral de redação

Em 06/09/2026, a V20 foi ampliada de nove modelos básicos para **40 famílias de situações reconhecidas**, além de um fallback universal. O gerador usa primeiro os campos estruturados da conduta, interpreta a descrição antiga e consulta a observação operacional somente quando ela contém um motivo de retorno, nova solicitação ou reagendamento. Isso mantém compatibilidade com acompanhamentos importados sem inventar informação clínica.

### Condutas clínicas e condições de retorno

| Situação registrada | Redação central |
|---|---|
| Prazo em dias, semanas, meses ou anos | Retorno solicitado pela especialidade após o prazo registrado. |
| Apenas data-alvo | Retorno solicitado pela especialidade para reavaliação na data indicada. |
| Exames em geral | Retorno solicitado para apresentar os exames solicitados. |
| Exame de imagem | Retorno solicitado para apresentar o resultado do exame de imagem solicitado. |
| Exames laboratoriais | Retorno solicitado para apresentar os resultados dos exames laboratoriais solicitados. |
| Fisioterapia | Retorno solicitado após a conclusão das sessões de fisioterapia. |
| Terapia ocupacional | Retorno solicitado após a conclusão das sessões de terapia ocupacional. |
| Fonoaudiologia | Retorno solicitado após a conclusão das sessões de fonoaudiologia. |
| Psicoterapia | Retorno solicitado após o período de acompanhamento em psicoterapia. |
| Reabilitação | Retorno solicitado após a conclusão do período de reabilitação indicado. |
| Procedimento | Retorno solicitado após a realização do procedimento indicado. |
| Cirurgia | Retorno solicitado após a realização da cirurgia indicada. |
| Pós-operatório | Retorno solicitado para reavaliação pós-operatória. |
| Conclusão do tratamento | Retorno solicitado após a conclusão do tratamento indicado. |
| Uso, ajuste ou troca de medicação | Retorno solicitado após o período de uso ou ajuste da medicação indicada. |
| Evolução, melhora, estabilização ou cicatrização | Retorno solicitado para reavaliação da evolução clínica, preservando o detalhe registrado. |
| Avaliação de equipe, profissional ou outra especialidade | Retorno solicitado após a avaliação indicada. |
| Laudo, relatório, parecer ou documento | Retorno solicitado para apresentar o documento solicitado. |
| Perfil, diário ou outro monitoramento | Retorno solicitado para apresentar os registros de monitoramento solicitados. |
| Alta hospitalar ou fim de internação | Retorno solicitado após a alta hospitalar. |
| Outra condição | Retorno solicitado após a condição escrita pelo operador, preservando seu conteúdo. |
| Retorno se necessário | Retorno solicitado pela especialidade conforme necessidade clínica registrada. |
| Acompanhamento genérico | Retorno solicitado pela especialidade para continuidade do acompanhamento. |

### Ocorrências operacionais que exigem nova solicitação

| Situação registrada | Redação central |
|---|---|
| Falta sem justificativa | Nova solicitação devido à ausência não justificada do paciente. |
| Falta justificada | Nova solicitação devido à ausência justificada do paciente. |
| Não comparecimento sem qualificação | Nova solicitação devido ao não comparecimento do paciente. |
| Reagendamento pedido pelo paciente | Nova solicitação para reagendamento, conforme pedido do paciente. |
| Cancelamento ou indisponibilidade do especialista | Nova solicitação devido ao cancelamento ou à indisponibilidade do especialista. |
| Cancelamento pelo serviço | Nova solicitação devido ao cancelamento do atendimento pelo serviço. |
| Falha do sistema ou da plataforma | Nova solicitação porque o atendimento foi prejudicado por falha do sistema. |
| Falha de internet, conexão, áudio ou vídeo | Nova solicitação porque o teleatendimento foi prejudicado por falha de conexão. |
| Consulta não concluída, interrompida ou não realizada | Nova solicitação porque o teleatendimento não foi concluído. |
| Solicitação devolvida | Nova solicitação porque o pedido anterior foi devolvido. |
| Solicitação indeferida, negada, recusada ou rejeitada | Nova solicitação porque o pedido anterior foi indeferido. |
| Solicitação cancelada | Nova solicitação porque o pedido anterior foi cancelado. |
| Solicitação expirada ou vencida | Nova solicitação porque o pedido anterior perdeu a validade. |
| Retorno não solicitado dentro do prazo | Nova solicitação porque o pedido anterior não foi realizado no prazo. |
| Perda de seguimento | Nova solicitação para restabelecer o acompanhamento. |
| Paciente temporariamente não localizado | Nova solicitação após o restabelecimento do contato. |
| Reagendamento ou nova solicitação sem causa mais específica | Nova solicitação para reagendamento conforme o registro operacional. |

Quando existe também um prazo — por exemplo, `RET COM 60 DIAS` mais `PCT NÃO COMPARECEU` — o texto informa tanto o motivo operacional quanto os 60 dias indicados pela especialidade. Registros como `RETORNO COM EXAMES`, `RETORNO APÓS FISIO`, `SOLICITAR NOVAMENTE, NÃO CONCLUÍDO`, `ERRO NO SISTEMA - SOLICITADO NOVO RETORNO` e abreviações equivalentes são reconhecidos de forma determinística.

### Fallback universal

Uma conduta que não pertença às 40 famílias não recebe uma justificativa clínica inventada. O gerador transforma o próprio registro em texto pronto:

> Retorno solicitado conforme a conduta registrada na última consulta: CONDUTA REGISTRADA.

Se nem a conduta nem uma observação pertinente estiverem disponíveis, usa-se a formulação neutra de continuidade do acompanhamento. Portanto, o botão sempre entrega um texto completo com data da última consulta, motivo disponível e previsão de retorno, sem exigir que o operador redija o motivo novamente.

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
- `worker/tests/telemedicine-justification-v20.test.mjs` cobre as 40 famílias, o fallback universal, combinações entre prazo e ocorrência operacional, os estados de exibição e o feedback de cópia.
