# Telemedicina Desktop V16

## Decisão permanente

A experiência visual aprovada no mobile passa a ter uma camada própria para desktop, ativa a partir de 861 px quando o navegador não está no contexto mobile. Ela usa a largura adicional do monitor sem sobrepor as regras do celular.

## Visualizações

- **Lista** é o padrão inicial e organiza cada acompanhamento em um cartão horizontal independente.
- **Grade 3×3** organiza três cartões por linha.
- “3×3” descreve a densidade horizontal da grade: ao existir um quarto, décimo ou qualquer outro paciente, ele continua nas linhas seguintes. Não há limite de nove cartões.
- As preferências de Lista/Grade são salvas separadamente no desktop e no mobile.
- O celular continua usando **Grade 2×2**.

Nos dois modos permanecem visíveis paciente, conduta, especialidade, situação, última consulta, retorno, avisos e ações disponíveis.

## Linguagem visual e interação

- superfícies em azul suave e verde-azulado separam cabeçalho, resumo, filtros, cartões e formulários;
- âmbar identifica solicitação próxima, vermelho identifica atraso, verde-azulado identifica aguardo, cinza-azulado identifica ausência de programação e azul identifica solicitação já registrada;
- cartões reagem a foco e passagem do ponteiro, e botões apresentam foco visível;
- nome, cargo e foto continuam juntos no cabeçalho horizontal, que recebe largura e tipografia adequadas ao desktop;
- formulários, opções de conduta, histórico e mensagens preservam a hierarquia visual aprovada no mobile;
- `prefers-reduced-motion` remove deslocamentos e transições não essenciais.

## Escopo funcional

A V16 é exclusivamente visual. Ela não altera estados, cálculo de lembretes, permissões, persistência, histórico ou regras de privacidade.
