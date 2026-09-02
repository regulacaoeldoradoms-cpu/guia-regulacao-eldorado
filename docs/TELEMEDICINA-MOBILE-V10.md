# Telemedicina Mobile V10 — resumo operacional lateral

## Decisão permanente

No mobile, o topo operacional da Telemedicina deixa de exibir o título "Retornos e lembretes" e passa a priorizar exclusivamente informação acionável.

A composição mobile do resumo deve ser:

- coluna esquerda com quatro indicadores em grade 2x2;
  - linha 1: `Solicitar agora` | `Atrasados`;
  - linha 2: `Em aguardo` | `Sem programação`;
- coluna direita com `Data operacional`, ocupando visualmente a altura das duas linhas de indicadores.

A mudança existe para aproveitar o espaço horizontal sem criar áreas vazias dentro dos indicadores e sem aumentar desnecessariamente a altura da primeira dobra.

## Regras de escopo

- a alteração é exclusivamente mobile;
- o desktop deve permanecer com a composição já existente;
- nenhuma regra de negócio, contagem, filtro, status, cálculo de retorno ou aviso é alterada;
- `Data operacional` continua usando os mesmos elementos e valores já preenchidos pelo JavaScript (`todayLabel` e `todayAlerts`);
- os quatro indicadores continuam sendo botões de filtro e preservam seus `data-status-filter`;
- nenhuma informação clínica ou identificador de paciente é introduzido no código ou na documentação.

## Implementação

A V10 é aplicada como camada de CSS posterior às regras mobile anteriores, dentro de `css/telemedicina-mobile-v9.css`, sem criar regras para viewport desktop.

No mobile, `telemedicine-main` torna-se uma grade de duas colunas apenas para posicionar o resumo superior. O `telemedicine-hero-copy` é ocultado, enquanto `telemedicine-today` ocupa a coluna direita. `telemedicine-stats` ocupa a coluna esquerda e mantém a grade interna 2x2. `systemNotice` e `telemedicine-workspace` permanecem em largura total abaixo do resumo.