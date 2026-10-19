# Guia Médico — seleção de motivos em cards

Data: 19/10/2026.

## Decisão de interface

O seletor **Consultar por motivo**, disponível no contexto de especialidade do Guia Médico, deve priorizar clareza e sobriedade institucional, não uma lista extensa de barras ou elementos decorativos.

- Cards com nome da condição em destaque e identificação discreta do sistema de origem em uma etiqueta.
- **Sem setas decorativas** nos cards nem nos botões de seleção contextual do piloto.
- Duas colunas em painéis desktop com espaço suficiente; uma coluna em painéis estreitos e no mobile.
- Bordas e cores discretas compatíveis com os temas claro/escuro. Sem degradês chamativos, animação de translação, sombras fortes ou ícones decorativos.
- Hover e estado pressionado sutis; foco visível para uso pelo teclado; respeito a movimento reduzido.
- Botões HTML nativos, mantendo click/Enter/Espaço, IDs dos motivos, ordem das opções, distinção DigSaúde versus SISREG, checagem de critérios e impressão.
- A contagem identifica a quantidade de motivos do seletor. O título e a legenda são curtos e operacionais.
- O componente é compartilhado com a Recepção quando a mesma seleção é apresentada; não introduz requisitos clínicos adicionais nem muda a apresentação das demais especialidades.
- A revisão de cache **20261019-2** é aplicada ao JS/CSS das rotas clínicas e ao marcador do service worker, garantindo a substituição das interfaces antigas.

## Aceitação e testes

O teste `testing/clinical-pilot/condition-picker-ui.test.mjs` valida oito opções de Neuropediatria, três de Ortopedia, etiquetas corretas, ausência de setas, vínculo dos botões com a mesma condição, CSS responsivo, foco e movimento reduzido. Os contratos clínicos e a impressão seguem cobertos pelo workflow `validate-clinical-pilot.yml`.

Preservar a diretriz: **o Guia Médico é uma ferramenta enxuta para encaminhamentos, não uma enciclopédia**. A seleção deve organizar o acesso, não acrescentar conteúdo clínico ou sobrecarga visual.
