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
- A revisão de cache **20261020-1** é aplicada ao JS/CSS das rotas clínicas e ao marcador do service worker, garantindo a substituição das interfaces antigas sem invalidar os caches dos outros módulos.

## Consultar por motivo recolhido por padrão

Complemento de 19/10/2026, baseado na `main` `4d8c4106a856d0d3d97300ee5d534103d52ab0b9` (cards da PR #670). Dossiê Mestre V1 lido integralmente e status da Central conferido antes da implementação.

- No Guia Médico, o cabeçalho **Consultar por motivo** é um botão com contagem de motivos disponíveis e chevron discreto somente no cabeçalho. Começa fechado a cada montagem da especialidade, inclusive no retorno após consultar uma condição.
- Clique, Enter ou Espaço alternam a área dos cards existentes. `aria-expanded` acompanha o estado; `aria-controls` aponta para o grupo; `hidden` retira os cards recolhidos da navegação por teclado e da árvore de acessibilidade. O foco permanece no cabeçalho ao abrir/fechar.
- Não há persistência de abertura entre especialidades nem animação de expansão. Os cards mantêm IDs, ordem, sistemas de origem e destino, sem setas decorativas.
- Links diretos para uma condição e pesquisa continuam pelos caminhos existentes. Dados e critérios clínicos, impressão, IA, permissões e backend permanecem intactos.
- A Recepção mantém o seletor visível, sem sanfona. As referências dos assets compartilhados são renovadas nas três rotas clínicas para manter a política de cache existente coerente.
- Os temas usam as mesmas variáveis de cor. O painel do seletor fica contido na largura disponível, com duas colunas quando houver espaço e uma no mobile.

Validação local: 84/84 testes do workflow clínico, mais seis cenários reais de navegador (320, 390 e 1366 px, claro/escuro), com autenticação sintética e tráfego externo bloqueado. Cobertura de teclado, ARIA/hidden, foco visível, largura, seleção TEA/SISREG, retorno recolhido, link direto e Recepção preservada. Capturas ficam em `.local/condition-picker/`, fora do versionamento.

O workflow clínico executa também `verify-condition-picker-browser.mjs` em Chromium. CI remoto, aprovação, integração e verificação em produção são etapas separadas; resultados locais não comprovam publicação. Reversão: PR pontual revertendo este complemento sobre a main vigente, sem reset ou force-push da main.

## Aceitação e testes

### Complemento de navegação — 20/10/2026

Ajuste posterior solicitado pelo responsável: **Imprimir este recorte** aparece somente na Recepção. O Guia Médico mantém os critérios e os controles de recolhimento, sem essa ação. Geração do documento de impressão e impressão da Recepção preservadas; revisão clínica `20261020-2`.

O campo digitável **Faixa etária para conferência (opcional)** também fica somente na Recepção. A faixa etária informativa do protocolo permanece no Guia Médico. Idade já fornecida por pesquisa/contexto continua disponível aos alertas e à IA, independentemente do campo; revisão clínica `20261020-3`.

Correção de integridade da visão geral (20/10): o renderer de condições substituía todo o painel e descartava o protocolo geral. Agora preserva o artigo original e seus eventos no DOM, ocultando-o somente enquanto exibe uma condição. Recolher pelo card, topo, fim ou cabeçalho principal restaura esse mesmo artigo, incluindo aplicação prática, protocolo oficial, metadados e marcações do checklist. **Desmarcar todos** mantém o listener original. Nenhum armazenamento persistente foi adicionado.

Links diretos montam primeiro a visão geral pelo renderer existente, sem outro conjunto de dados; só então exibem a condição solicitada. Ao recolher, removem `condicao`, mantêm `protocolo` e limpam o contexto específico da IA. Reabrir o último card restaura seu recorte. Visões gerais e critérios de sistemas distintos não são mostrados juntos. Isso substitui a convenção anterior de manter condição ativa/URL específica ao recolher.

Cache clínico `20261020-4`; renderers Médico e Fontes em `20261020-general-1`. Teste de navegador existente ampliado somente com identidade do artigo/checkboxes, texto integral preservado, três marcações após consultas sucessivas, Desmarcar todos, retorno de links diretos e URL/contexto coerentes. Mesmos quatro cenários desktop/mobile e claro/escuro; sem nova suíte ou mudança no visual dos cards.

Sobre a main `d3eaa168` (#670, #671 e contraste #672 preservados), o Guia mantém os mesmos cards montados ao selecionar uma condição. Uma única área de critérios é substituída ao trocar de motivo; nunca são acumulados registros. A Recepção conserva o fluxo anterior.

- A lista principal começa fechada. Depois da escolha, permanece aberta; seu cabeçalho pode ocultar lista e critérios juntos, sem apagar a seleção.
- O card selecionado recebe destaque discreto. Clique/Enter/Espaço nele alterna apenas seus critérios. Também há **Recolher critérios** no início e no fim; ao recolher pelo fim, o foco retorna ao card selecionado, com deslocamento apenas quando necessário para revelá-lo abaixo do cabeçalho.
- Recolher restaura o protocolo geral com o checklist intacto e deixa somente `protocolo` na URL; a condição deixa de ser o contexto ativo da IA. Reabrir a mesma condição reutiliza seu conteúdo. Links diretos e atualização da página revelam lista e critérios solicitados.
- O conteúdo clínico e a impressão reutilizam `contentMarkup`/`printDocument`, sem cópias de regras ou novos resumos. O seletor mantém quantidade, ordem, sistemas e apresentação dos cards.
- Revisão clínica **20261020-1** nas três rotas e no marcador do Service Worker; cache global e revisão de `medical.css` da #672 preservados.

Validação focal: testes clínicos/cache existentes e quatro cenários de navegador (390/1366 px, claro/escuro), alternando todos os oito motivos, recolhendo por card/topo/fim, conferindo foco, dois controles independentes, URL/reload, conteúdo integral de tela/impressão, botão de impressão e contexto da IA. Somente duas capturas representativas; sem nova auditoria local de outros módulos. Checks obrigatórios do repositório continuam exigidos antes da integração. Esta decisão substitui o retorno à especialidade exigido pela navegação anterior.

O teste `testing/clinical-pilot/condition-picker-ui.test.mjs` valida oito opções de Neuropediatria, três de Ortopedia, etiquetas corretas, ausência de setas, vínculo dos botões com a mesma condição, CSS responsivo, foco e movimento reduzido. Os contratos clínicos e a impressão seguem cobertos pelo workflow `validate-clinical-pilot.yml`.

Preservar a diretriz: **o Guia Médico é uma ferramenta enxuta para encaminhamentos, não uma enciclopédia**. A seleção deve organizar o acesso, não acrescentar conteúdo clínico ou sobrecarga visual.
