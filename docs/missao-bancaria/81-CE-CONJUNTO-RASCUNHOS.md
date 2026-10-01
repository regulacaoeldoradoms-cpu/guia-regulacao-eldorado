# Capitais e Câmbio — conjunto de rascunhos

01/10/2026. Lote editorial conforme [plano e rastreabilidade do documento 80](80-CE-PLANO-E-PRIMEIRA-UNIDADE.md), no [PR #570 draft](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/570). **Não publicado nem importado pelo runtime.** Referências BB/CAIXA históricas, `referenceOnly`; Fase 2 sem aceite humano observado e Fase 3 não aberta. Nenhuma conclusão de cobertura integral de edital.

## Entrega e dependências

Cada unidade contém quatro exemplos resolvidos, oito questões novas com quatro justificativas, vocabulário e recuperação por seção. A fonte `.mjs` ao lado de cada leitura gera o `.md`; não editar os formatos em paralelo. Os pré-requisitos e os itens históricos permanecem os do documento 80.

| Unidade / leitura | Recorte efetivamente ensinado | BB / CAIXA | Contas verificadas |
| --- | --- | --- | ---: |
| [CE-02](rascunhos/ce-02-v1.md) | Participação, resultado com proventos e direitos básicos de ações | 5, 6 / 19, 20 | 20 |
| [CE-03](rascunhos/ce-03-v1.md) | Emissor, dívida, regra de remuneração, vencimento e saída | 5, 6 / 19, 20 | 8 |
| [CE-04](rascunhos/ce-04-v1.md) | Patrimônio/cota, administrador/gestor, pedido/conversão/pagamento | 5, 6 / 19, 20 | 13 |
| [CE-05](rascunhos/ce-05-v1.md) | Crédito/mercado/liquidez, ganho líquido e concentração | 5, 6 / 19, 20 | 10 |
| [CE-06](rascunhos/ce-06-v1.md) | R$/US$, conversão e perspectiva de compra/venda | 7, 9 nominal / 21, 23 nominal | 13 |
| [CE-07](rascunhos/ce-07-v1.md) | Finalidade, instituição habilitada, taxa pactuada e ressalva legal | 7 / 21 | 0 — conceitual |
| [CE-08](rascunhos/ce-08-v1.md) | Regra fixa/flutuante/intermediária versus episódio observado | 8 / 22 | 0 — conceitual |
| [CE-09](rascunhos/ce-09-v1.md) | Câmbio real, convenção eP*/P, preços e índice base 100 | 9 / 23 | 13 |
| [CE-10](rascunhos/ce-10-v1.md) | Receita/custo em dólares, resultado e efeitos condicionais no comércio | 10 / 24 | 21 |
| [CE-11](rascunhos/ce-11-v1.md) | Diferencial em pontos percentuais, reconversão, risco e fluxos condicionais | 11 / 25 | 13 |

A [revisão cumulativa e o Chefe](82-CE-REVISAO-E-PROPOSTA-CHEFE.md) fecham o recorte. O lote CE-02–11 + CE-R soma **118 trechos, 44 exemplos, 88 questões/352 justificativas e 128 contas**. Incluindo CE-01: **11 aulas + revisão, 48 exemplos e 96 questões/384 justificativas**. O Chefe posterior acrescenta 12 itens próprios, 48 justificativas e um exemplo de método; conjunto de **13 unidades/108 questões**, ainda fora do catálogo.

## Fontes e limites

Consultas novas em **01/10/2026**, com URL, versão, localizador e data em cada artefato: CVM (instrumentos, risco/liquidez), Lei 6.404 consolidada (direitos), Resolução CVM 175 consolidada (Parte Geral: classes/cotas, papéis e resgate), Lei 14.286 (arts. 2º–5º/19), páginas públicas BCB de câmbio/instituições/política cambial e FMI para convenção de câmbio real. A página oficial da Resolução 175 lista alteração 240/26; o recorte usa a Parte Geral vinculada, sem afirmar auditoria integral dos anexos. Art. 40 é a referência de pedido/conversão/pagamento.

A consulta BCB dos mecanismos de transmissão de **30/09/2026**, já usada em MP, foi reaproveitada com a data original. Não houve nova pesquisa ampla do currículo nem nova consulta dessa fonte. Páginas educacionais não sustentam neste lote alíquotas, cobertura FGC, limites operacionais ou procedimentos atuais fora do recorte.

Casos e valores são fictícios. Fórmulas declaram moeda, período, custos e hipóteses; câmbio real não é diagnóstico de equilíbrio, e pressão cambial não é previsão. Direitos preferenciais não significam pagamento mensal certo nem ausência universal de voto. O câmbio reconhece a exceção delimitada do art. 19 sem ensinar um limite quantitativo. Nenhuma orientação para caso financeiro real.

## Verificação proporcional

Executados em 01/10/2026: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=<ce02…ce11|cer> --render` e conferência final sem `--render`. Passaram esquema, quatro alternativas/justificativas, gabaritos válidos, objetivos, recuperação, origens, cálculos declarados, UTF-8, links locais e sincronização MD/MJS. Conferência conjunta confirmou 96 IDs/enunciados distintos e que adicionar os 12 drafts ao filtro preserva as **37 missões publicadas**. A revisão exige referências para **todas as 11 aulas**, e cada questão tem origem existente.

O validador ganhou somente a lista CE, os dois hosts oficiais adicionais restritos a CE, a consulta BCB reaproveitada com ID/data exatos, links/origens e conferência de oito itens (12 no Chefe, pelos seis grupos existentes). As restrições anteriores de MP/PC permanecem. Nenhuma suíte app, Chromium, D1 ou produção executada neste lote editorial; evidências anteriores não afetadas são reaproveitadas. A revisão pedagógica independente de **CE-01–11/CE-R em `96cdd5b2` foi aprovada sem correções substantivas**. Limitou-se à leitura dos 12 Markdown, sem repetir cálculos, esquema, fontes ou links; não inclui o Chefe e não representa aceite humano de fase.

Próxima entrega: revisão independente do Chefe e preparo técnico desativado pelo pipeline existente. Sem ativar catálogo, progressão ou XP. #569 permanece draft e sem autorização de integração.
