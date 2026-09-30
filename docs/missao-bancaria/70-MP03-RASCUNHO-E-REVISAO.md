# MP-03 — preços, inflação e leitura de juros em rascunho

30/09/2026. Fase 2 ativa, aceite humano não observado. Unidade prevista no plano 66 da #559, preparada após MP-02 sem abrir Fase 3 ou publicar conteúdo. Leia a [aula com prática comentada](rascunhos/mp-03-v1.md); [fonte editorial](rascunhos/mp-03-v1.mjs).

## Recorte e correspondência

Pré-requisito editorial: moeda/poder de compra e datas da MP-02, também em rascunho. O apoio de porcentagem e período é ensinado dentro desta unidade, antes dos exemplos. Referências históricas preservadas: BB itens 3/14; CAIXA itens 16/17 e posição 28, impressa como 278. Não declara cobertura integral desses itens ou escolha de edital vigente.

| Objetivo local | Ensino | Verificação |
| --- | --- | --- |
| O1 — porcentagem, base e fatores | `porcentagem`, `exemplo-porcentagem` | q01/q03/q07 |
| O2 — item versus conjunto de preços | `inflacao`, `cesta`, `exemplo-cesta` | q02/q03 |
| O3 — taxa versus nível | `exemplo-desaceleracao` | q04 |
| O4 — quantia e poder de compra | `nominal`, `real`, exemplos respectivos | q05–q07 |
| O5 — períodos/informação suficiente | `nominal`, `limites` | q08 |
| O6 — reconstrução após erro | `resumo`, referências por questão | terceiro prompt e comentários |

Entrega: 14 trechos, cinco exemplos resolvidos, oito questões/32 justificativas e três prompts. A taxa real é derivada pela razão dos fatores, não apresentada como fórmula para decorar. A diferença simples é explicitamente aproximação. A definição de nominal é delimitada ao contraste com inflação; a convenção nominal/efetiva de capitalização não foi ensinada nem cobrada. Valores e índices são inventados; não há cotação, taxa atual, previsão ou recomendação financeira.

## Fontes, cálculos e limites

Reaproveitada a seção 3.2 do Caderno BCB 2026, p. 32, para juros/tempo. Consulta pontual à nota BCE “O que é a inflação?”, em 30/09/2026, apenas para conceitos de variação geral, peso dos gastos e diferenças de consumo. Não transpor índice harmonizado, meta ou números europeus ao Brasil. A razão exata de poder de compra é demonstrada algebricamente a partir das hipóteses explicitadas. URLs e localizadores constam na aula.

A página IBGE Explica tentada retornou 403; não foi usada como evidência. A nota específica BCE sobre juros nominais/reais não ficou acessível; não se atribui a ela uma revisão inexistente. Não houve busca ampla adicional. Metodologia de índices brasileiros, custos/tributos e conversão de períodos continuam fora do recorte e exigem fonte/ensino próprios antes de eventual ampliação.

B/C/E redigidas; D revisada pelo autor, incluindo bases, unidades, períodos, contas e arredondamento. Revisão independente de MP-03 aprovada por leitura integral em `5bedc461bc54e886e859dc8b91f0844db70aad85`, sem erro conceitual, ambiguidade relevante ou pré-requisito ausente; não repetiu esquema, contas ou fontes. Clareza humana/aceite de publicação pendentes; F não iniciada. Usar `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=mp03`: valida estrutura, cobertura, recuperação, prévia, fontes, links e 12 operações aritméticas com tolerância numérica explícita. Nenhum teste de aplicativo integral é necessário para este rascunho documental.

Continuidade atual: revisão dos novos recortes do [conjunto MP](71-MP-BLOCO-RASCUNHO-E-REVISAO.md). O status de autoria da prévia original antecede a revisão independente registrada aqui; seu corpo, exemplos e questões não mudaram. Reaproveitar a revisão de MP-03 enquanto permanecer válida. Conteúdo, revisão editorial, aprendizado e aceite de fase permanecem evidências separadas.
