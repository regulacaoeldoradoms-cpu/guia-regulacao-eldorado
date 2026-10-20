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
- A revisão de cache **20261019-3** é aplicada ao JS/CSS das rotas clínicas e ao marcador do service worker, garantindo a substituição das interfaces antigas sem invalidar os caches dos outros módulos.

## Consultar por motivo recolhido por padrão

Complemento de 19/10/2026, baseado na `main` `4d8c4106a856d0d3d97300ee5d534103d52ab0b9` (cards da PR #670). Dossiê Mestre V1 lido integralmente e status da Central conferido antes da implementação.

- No Guia Médico, o cabeçalho **Consultar por motivo** é um botão com contagem de motivos disponíveis e chevron discreto somente no cabeçalho. Começa fechado a cada montagem da especialidade, inclusive no retorno após consultar uma condição.
- Clique, Enter ou Espaço alternam a área dos cards existentes. `aria-expanded` acompanha o estado; `aria-controls` aponta para o grupo; `hidden` retira os cards recolhidos da navegação por teclado e da árvore de acessibilidade. O foco permanece no cabeçalho ao abrir/fechar.
- Não há persistência de abertura, animação de expansão ou novas sanfonas aninhadas. Os cards mantêm IDs, ordem, sistemas de origem e destino, sem setas decorativas.
- Links diretos para uma condição e pesquisa continuam pelos caminhos existentes. Dados e critérios clínicos, impressão, IA, permissões e backend permanecem intactos.
- A Recepção mantém o seletor visível, sem sanfona. As referências dos assets compartilhados são renovadas nas três rotas clínicas para manter a política de cache existente coerente.
- Os temas usam as mesmas variáveis de cor. O painel do seletor fica contido na largura disponível, com duas colunas quando houver espaço e uma no mobile.

Validação local: 84/84 testes do workflow clínico, mais seis cenários reais de navegador (320, 390 e 1366 px, claro/escuro), com autenticação sintética e tráfego externo bloqueado. Cobertura de teclado, ARIA/hidden, foco visível, largura, seleção TEA/SISREG, retorno recolhido, link direto e Recepção preservada. Capturas ficam em `.local/condition-picker/`, fora do versionamento.

O workflow clínico executa também `verify-condition-picker-browser.mjs` em Chromium. CI remoto, aprovação, integração e verificação em produção são etapas separadas; resultados locais não comprovam publicação. Reversão: PR pontual revertendo este complemento sobre a main vigente, sem reset ou force-push da main.

## Aceitação e testes

O teste `testing/clinical-pilot/condition-picker-ui.test.mjs` valida oito opções de Neuropediatria, três de Ortopedia, etiquetas corretas, ausência de setas, vínculo dos botões com a mesma condição, CSS responsivo, foco e movimento reduzido. Os contratos clínicos e a impressão seguem cobertos pelo workflow `validate-clinical-pilot.yml`.

Preservar a diretriz: **o Guia Médico é uma ferramenta enxuta para encaminhamentos, não uma enciclopédia**. A seleção deve organizar o acesso, não acrescentar conteúdo clínico ou sobrecarga visual.
