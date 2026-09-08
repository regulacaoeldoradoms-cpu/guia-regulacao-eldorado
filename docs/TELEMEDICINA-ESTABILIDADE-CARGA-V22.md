# Telemedicina — estabilidade do viewport na carga V22

## Decisão de produto

A rota `/telemedicina/` deve permanecer visualmente estável desde a entrada na página até o término da hidratação inicial do dashboard. O carregamento assíncrono da data operacional, alertas e acompanhamentos não pode deslocar automaticamente o viewport para baixo.

A correção anterior da V21 impediu que os indicadores de situação executassem a rolagem explícita dos handlers legados. A V22 cobre um segundo mecanismo observado durante a carga inicial: navegadores podem restaurar uma posição anterior de rolagem ou reajustar a âncora visual quando o conteúdo curto de carregamento é substituído pelo dashboard completo.

## Comportamento obrigatório

- Ao entrar em `/telemedicina/`, a restauração automática de rolagem do histórico do navegador é desativada para essa rota.
- Enquanto a data operacional e a lista de acompanhamentos ainda estão sendo hidratadas, o viewport inicial permanece no topo.
- A ancoragem automática de rolagem é desativada nos principais contêineres da Telemedicina para que a troca de conteúdo de carregamento pelo conteúdo real não mova a página.
- Assim que `#todayLabel` recebe a data operacional e `#followupList` deixa o estado `Carregando acompanhamentos...`, a proteção aguarda a composição estabilizar e é liberada.
- Se o usuário demonstrar intenção explícita de rolar antes do fim da carga por roda do mouse, gesto de toque ou tecla de navegação, a proteção é liberada imediatamente e nunca combate a rolagem manual.
- Existe um limite máximo de tempo para a proteção, evitando bloqueio de rolagem caso o dashboard falhe ou demore excessivamente.

## Escopo

A V22 altera somente a estabilidade de viewport da rota `/telemedicina/`. Não modifica regras assistenciais, filtros, permissões, APIs, conteúdo clínico, dados persistidos ou layout desktop/mobile.

## Implementação

- `js/telemedicina-viewport-v22.js`: executado ainda no `<head>`, antes da hidratação do dashboard, define `history.scrollRestoration = 'manual'`, mantém a posição inicial estável e observa a conclusão da hidratação.
- `css/telemedicina-viewport-v22.css`: aplica `overflow-anchor: none` somente à Telemedicina e seus principais contêineres.
- O mecanismo não usa bibliotecas externas, não coleta dados e não interfere em navegação por teclado além de reconhecer teclas de rolagem como intenção do usuário.
