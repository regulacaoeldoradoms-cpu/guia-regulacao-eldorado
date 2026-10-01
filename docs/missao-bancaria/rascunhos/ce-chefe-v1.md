# CE-CHEFE — Chefe de Capitais e Câmbio: conecte os dados do caso

**Rascunho para revisão, não publicado.** Doze itens próprios redigidos conforme documento 82; revisão independente do Chefe e publicação pendentes; fora do catálogo.

Fonte editorial: [ce-chefe-v1.mjs](ce-chefe-v1.mjs). Regenerar com `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=cechefe --render`.

Objetivo: Integrar instrumentos, riscos e câmbio em doze casos próprios, explicando hipóteses e limites com recuperação nas aulas de origem.

<a id="preparacao"></a>

## 1. Ensino antes do desafio

As aulas [CE-01](ce-01-v1.md), [CE-02](ce-02-v1.md), [CE-03](ce-03-v1.md), [CE-04](ce-04-v1.md), [CE-05](ce-05-v1.md), [CE-06](ce-06-v1.md), [CE-07](ce-07-v1.md), [CE-08](ce-08-v1.md), [CE-09](ce-09-v1.md), [CE-10](ce-10-v1.md) e [CE-11](ce-11-v1.md) ensinam os conceitos cobrados. A [revisão CE-R](ce-r-v1.md) prepara a recuperação. Leia o ensino antes de usar o comentário de uma questão. Os exemplos são fictícios e não descrevem ofertas ou cotações atuais.

<a id="roteiro"></a>

## 2. Seis grupos para organizar a leitura

Itens 1–2: identifique instrumento, direito, emissor e destino do pagamento. Itens 3–4: leia cota, prazo, custos e risco. Itens 5–6: marque moeda, perspectiva, finalidade e instituição. Itens 7–8: procure a regra cambial, sem classificá-la por um único episódio. Itens 9–10: separe preços relativos, receitas e resultado. Itens 11–12: complete a reconversão e mantenha as relações condicionais. Nenhum grupo cria uma nota de domínio por conceito.

<a id="exemplo-metodo"></a>

## 3. Exemplo resolvido: não responder antes de identificar a unidade

Uma anotação fictícia traz apenas '5% no período'. Primeiro, falta saber se é juros contratados, retorno realizado, variação de cotação ou outra medida. Segundo, falta saber a base e a moeda, quando pertinentes. Terceiro, o número sozinho não permite escolher o maior lucro em reais ou em dólares. A conclusão correta é identificar os dados que faltam. Nos casos seguintes esses dados são informados; use somente as condições efetivamente dadas.

<a id="glossario"></a>

## 4. Termos que ajudam a conferir

Emissão: criação de instrumentos; revenda: negociação de instrumento existente. Participação: fração societária sob o total informado. Credor: titular de direito de crédito. Cota: fração do patrimônio da classe no recorte estudado. Conversão: cálculo entre moedas ou determinação do valor de cotas, conforme o contexto. Paridade/banda: compromisso cambial descrito. Índice base 100: comparação normalizada. Ponto percentual: diferença entre taxas percentuais comparáveis. Reconversão: retorno à moeda de partida.

<a id="recuperacao"></a>

## 5. Corrigir a confusão, sem inferir prontidão

Tente responder e justificar antes de abrir o comentário. Se errar, nomeie o dado ou conceito confundido e siga o link da aula de origem. Refaça o exemplo e explique por que cada distrator não atende ao caso. Estes itens são próprios do Chefe, mas ficam expostos nesta prática; não compõem avaliação independente. Repetição, acerto ou conclusão de ciclos não comprovam retenção duradoura ou prontidão.

## Recordação e recuperação

- Explique os conceitos sem consultar e confira a seção de origem.
- Refaça o exemplo, separando dados, hipótese e conclusão.
- Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente.

## Prática comentada

Todos os casos são fictícios. Tente responder antes de abrir cada comentário.

### Questão 1

Após uma emissão nova, uma companhia tem 1.500 ações da mesma espécie/classe. Ivo subscreveu 60 delas a R$ 10 cada. Depois, Nara revendeu 25 ações que já possuía a outro investidor por R$ 12 cada. Sem custos, qual leitura reúne os fatos corretamente?

A. A companhia recebe os dois pagamentos e Ivo tem 60% das ações.

B. Ivo tem 4% das ações; a companhia recebe R$ 600 na subscrição e Nara recebe R$ 300 na revenda.

C. Nara recebe R$ 600 da emissão e a companhia recebe R$ 300 da revenda.

D. Ivo se torna credor da companhia, sem participação societária.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** Ivo possui 60 ÷ 1.500 = 4%. A subscrição rende 60 × 10 = R$ 600 à emissora; a revenda rende 25 × 12 = R$ 300 à vendedora.

- **A:** Revenda não gera nova captação pela companhia, e o percentual está errado.
- **B:** Correta: separa participação e os dois destinos do dinheiro.
- **C:** Troca os destinatários das duas operações.
- **D:** A compra de ações representa participação, não a dívida descrita em uma debênture simples.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-01: 5. Emissão nova e negociação posterior](ce-01-v1.md#mercados); [CE-01: 7. Exemplo resolvido: recursos para a vendedora](ce-01-v1.md#exemplo-revenda); [CE-02: 1. Ser acionista](ce-02-v1.md#inicio); [CE-02: 2. Fração do capital](ce-02-v1.md#ex-participacao).

### Questão 2

Uma plataforma distribui um CDB emitido pelo Banco Lago: aplicação de R$ 900, remuneração de 6% em um único período e pagamento ao fim, se cumpridas as obrigações. O caso não concede resgate antecipado pelo emissor, mas há oferta de terceiro para comprar o título por R$ 870 hoje. Sem outros fluxos ou custos, qual conclusão é correta?

A. A plataforma substitui o Banco Lago como devedora do CDB.

B. Aceitar R$ 870 produz o mesmo ganho do pagamento contratual ao fim.

C. A existência de 6% garante receber hoje R$ 954 de qualquer comprador.

D. O Banco Lago é o emissor; o pagamento contratual seria R$ 954 ao fim sob a hipótese dada, e a venda por R$ 870 realizaria perda de R$ 30.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** 900 × 1,06 = 954 no vencimento sob cumprimento. Na venda proposta, 870 − 900 = −30. O distribuidor não troca o emissor nem garante o preço de saída.

- **A:** O enunciado identifica o banco como emissor.
- **B:** Preço de venda e pagamento futuro são diferentes.
- **C:** A remuneração contratada não determina a oferta de terceiro nem elimina a hipótese de cumprimento.
- **D:** Correta: mantém emissor, prazo, condição e resultado da saída.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-03: 2. Uma tela, dois devedores](ce-03-v1.md#ex-emissor); [CE-03: 3. O que ler nas condições](ce-03-v1.md#contrato); [CE-03: 6. Vencimento não é disponibilidade diária](ce-03-v1.md#saida).

### Questão 3

Em uma data inicial, uma classe com única subclasse tem patrimônio líquido de R$ 9.000 e 750 cotas. Em data posterior, um pedido de resgate de 25 cotas é convertido a R$ 13 por cota, com pagamento dois dias úteis depois, conforme as condições do caso. Sem encargos, qual leitura é correta?

A. A cota inicial era R$ 12; o resgate convertido é R$ 325, a receber na data de pagamento informada.

B. A cota inicial era R$ 13 e o pedido garante recebimento imediato.

C. As 25 cotas dão direito a todo o patrimônio de R$ 9.000.

D. A quantidade de cotas impede qualquer mudança do seu preço entre datas.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** 9.000 ÷ 750 = R$ 12 inicialmente. O valor do resgate usa a conversão posterior: 25 × 13 = R$ 325, respeitado o prazo de pagamento.

- **A:** Correta: separa preço inicial, conversão e pagamento.
- **B:** Confunde as datas e ignora o prazo.
- **C:** O cotista possui apenas as cotas indicadas.
- **D:** Quantidade não fixa valor de cota.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-04: 2. Patrimônio e fração](ce-04-v1.md#cota); [CE-04: 3. Calcular a fração](ce-04-v1.md#ex-cota); [CE-04: 7. Aberta, fechada e prazos](ce-04-v1.md#movimentacao).

### Questão 4

Uma aplicação de R$ 750 resulta em recebimento bruto de R$ 840 e custos totais de R$ 15 no período. Em outra situação, o emissor deixa de pagar uma obrigação contratada. Qual alternativa combina corretamente a conta e o risco destacado?

A. Ganho líquido R$ 90 e risco necessariamente apenas de liquidez.

B. Taxa líquida de 12% e ausência de risco em dívida.

C. Ganho líquido R$ 75, taxa líquida de 10% e evento de risco de crédito na outra situação.

D. Ganho líquido R$ 840 e risco de mercado comprovado apenas pela falta de pagamento.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** 840 − 750 − 15 = R$ 75; 75 ÷ 750 = 10%. O descumprimento da obrigação destaca crédito, sem excluir outros riscos possíveis.

- **A:** R$ 90 é o ganho antes dos custos; falta de pagamento não é somente dificuldade de venda.
- **B:** 12% é a taxa bruta, e dívida não elimina risco.
- **C:** Correta: usa a base inicial, os custos e a definição do evento.
- **D:** R$ 840 inclui principal; inadimplência não é apenas variação de preço.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-05: 6. Do ganho bruto ao líquido](ce-05-v1.md#liquido); [CE-05: 7. Exemplo resolvido: custos em reais](ce-05-v1.md#ex-liquido); [CE-05: 2. Três riscos, três perguntas](ce-05-v1.md#riscos).

### Questão 5

Uma instituição informa, na perspectiva dela, compra do dólar a R$ 5,20 e venda a R$ 5,40. Um cliente vende US$ 150 à instituição, sem outros custos. Quanto recebe?

A. R$ 810, porque toda operação do cliente usa a venda da instituição.

B. US$ 780, pois multiplicar não altera a moeda.

C. R$ 795, pois é obrigatório usar a média das duas pontas.

D. R$ 780, usando a compra da instituição.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** A instituição compra os dólares: 150 × 5,20 = R$ 780. O cliente vende, logo não usa a taxa de venda da instituição.

- **A:** Escolhe a ponta contrária à operação.
- **B:** O produto da conversão está em reais.
- **C:** Nenhuma média foi contratada.
- **D:** Correta: identifica a perspectiva e converte na direção certa.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-06: 2. Multiplicar ou dividir?](ce-06-v1.md#conversao); [CE-06: 5. Quem compra a moeda estrangeira?](ce-06-v1.md#perspectiva).

### Questão 6

Uma cliente envia recursos próprios para sua conta no exterior. O canal é um aplicativo que informa o nome da instituição responsável e apresenta uma cotação. Qual leitura evita presumir dados não informados?

A. Toda remessa para conta própria é pagamento de importação.

B. A finalidade descrita é remessa à conta própria; cabe conferir a habilitação pertinente da instituição, e o preço isolado não comprova autorização.

C. O aplicativo substitui os deveres da instituição e dispensa identificar a finalidade.

D. Toda cotação diferente daquela de outra instituição é necessariamente ilegal.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** O motivo da transferência não é compra de mercadoria. Identificação e autorização devem ser verificadas para a atividade; a taxa pode ser pactuada dentro da legislação.

- **A:** Enviar recursos não implica compra do exterior.
- **B:** Correta: separa finalidade, canal, preço e habilitação.
- **C:** O canal não elimina responsabilidades.
- **D:** Diferença de preço, sozinha, não demonstra irregularidade.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-07: 2. Vocabulário básico](ce-07-v1.md#finalidades); [CE-07: 4. Quem realiza a operação?](ce-07-v1.md#autorizacao); [CE-07: 6. Taxa negociada e responsabilidades](ce-07-v1.md#regras).

### Questão 7

No país fictício A, a autoridade se compromete a defender os limites de 5,10 e 5,70 unidades domésticas por unidade estrangeira, admitindo variação dentro da faixa. No país B, o relatório apenas registra que a taxa oscilou entre esses números na semana, sem informar compromisso. Qual interpretação é sustentada?

A. Ambos têm obrigatoriamente a mesma banda oficial.

B. A tem uma paridade única fixa em 5,40.

C. A descreve uma banda; em B, a faixa observada não basta para identificar o regime.

D. B garante que a taxa ficará na mesma faixa na semana seguinte.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** O compromisso institucional diferencia uma banda de uma faixa de preços passados.

- **A:** O relatório de B não declara regra da autoridade.
- **B:** A faixa tem dois limites, não uma única paridade.
- **C:** Correta: não transforma estatística observada em compromisso.
- **D:** A observação passada não garante preços futuros.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-08: 2. Fixo: compromisso com uma referência](ce-08-v1.md#fixo); [CE-08: 6. Intermediário: leia o compromisso específico](ce-08-v1.md#intermediario); [CE-08: 7. Exemplo resolvido: uma banda fictícia](ce-08-v1.md#ex-banda); [CE-08: 9. Exemplo resolvido: três dias não definem o regime](ce-08-v1.md#ex-observacao).

### Questão 8

Em um país, a taxa é formada no mercado. A autoridade realiza uma intervenção para melhorar negociações durante uma disfunção, sem anunciar paridade a defender. O preço permanece igual em alguns dias. Esses fatos permitem concluir que:

A. São compatíveis com flutuação; intervenção e estabilidade temporária não provam, sozinhas, mudança para regime fixo.

B. A intervenção necessariamente criou uma paridade permanente.

C. A estabilidade de alguns dias revogou a formação de mercado.

D. Toda flutuação proíbe qualquer atuação da autoridade.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** A classificação depende da regra institucional; os episódios descritos não criam o compromisso de uma paridade.

- **A:** Correta: mantém os limites da evidência.
- **B:** Não há compromisso anunciado que sustente isso.
- **C:** Um preço repetido não determina mudança institucional.
- **D:** Flutuação não exige ausência absoluta de intervenção.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-08: 4. Flutuante não significa autoridade ausente](ce-08-v1.md#flutuante); [CE-08: 5. Exemplo resolvido: intervenção e finalidade](ce-08-v1.md#ex-flutuante); [CE-08: 9. Exemplo resolvido: três dias não definem o regime](ce-08-v1.md#ex-observacao).

### Questão 9

Use q = e × P* ÷ P. Na data atual, e = 6 R$/US$, P* = US$ 9 e P = R$ 45 para a cesta comparável. Na base, q₀ = 1 e o índice vale 100. Qual conclusão é correta?

A. O índice atual é 120; isso compara q com a base, sem provar por si só afastamento de um câmbio de equilíbrio.

B. O índice atual é 54, igual ao preço estrangeiro convertido.

C. q atual é 120 e, portanto, a cotação nominal também é 120 R$/US$.

D. O índice prova que qualquer investimento terá ganho de 20%.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** 6 × 9 = R$ 54; q = 54 ÷ 45 = 1,20; índice = 1,20 ÷ 1 × 100 = 120. Índice não é taxa de retorno ou prova isolada de equilíbrio.

- **A:** Correta: calcula e limita a interpretação.
- **B:** R$ 54 é uma etapa, ainda sem dividir pelo preço doméstico.
- **C:** Confunde nível q, índice e cotação.
- **D:** Comparação de preços não garante rendimento de aplicação.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-09: 2. Defina símbolos antes de calcular](ce-09-v1.md#formula); [CE-09: 8. Índice de base 100 é uma régua de comparação](ce-09-v1.md#indice); [CE-09: 9. Exemplo resolvido: nível e índice diferentes](ce-09-v1.md#ex-indice).

### Questão 10

Uma firma receberá US$ 150 por exportação, pagará US$ 60 de insumos e terá R$ 120 de outros custos. Todos esses valores e quantidades permanecem fixos no período do caso, sem outros itens. Se e passar de 4 para 5 R$/US$, o resultado em reais:

A. Aumenta R$ 150, exatamente como a receita.

B. Cai R$ 60, porque somente o custo importado reage.

C. Aumenta R$ 90, de R$ 240 para R$ 330, sem demonstrar aumento da quantidade exportada.

D. Permanece igual, pois todo exportador tem compensação cambial perfeita.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** Antes: 600 − 240 − 120 = R$ 240. Depois: 750 − 300 − 120 = R$ 330. A diferença é R$ 90; as quantidades foram mantidas.

- **A:** Ignora que o custo importado também sobe.
- **B:** Ignora a receita em dólares.
- **C:** Correta: considera ambos os fluxos e a hipótese de quantidade fixa.
- **D:** Os fluxos em dólares não têm o mesmo valor no caso.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-10: 6. Receita não é lucro](ce-10-v1.md#resultado); [CE-10: 7. Exemplo resolvido: os dois lados da mesma empresa](ce-10-v1.md#ex-resultado); [CE-10: 8. Incentivo não é promessa de volume](ce-10-v1.md#competitividade).

### Questão 11

Sem custos, US$ 80 são convertidos a 5 R$/US$ e aplicados por um ano a 5%, resultando em R$ 420. A taxa de uma alternativa em dólares é 2% para o mesmo ano. Na reconversão da aplicação em reais, e é 6 R$/US$. Qual leitura é correta?

A. O diferencial de 3 pontos percentuais garante ganhar 3% em dólares.

B. A aplicação rendeu 5% em reais, mas voltou a US$ 70, perda de 12,5% em dólares; o diferencial de 3 pontos percentuais não era ganho garantido.

C. A reconversão produz US$ 84, independentemente de e final.

D. A perda em dólares prova que os R$ 420 não foram pagos.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** 420 ÷ 6 = US$ 70; (70 − 80) ÷ 80 = −12,5%. O diferencial 5% − 2% é 3 pontos percentuais, não retorno certo após câmbio.

- **A:** Subtrair taxas não resolve o efeito das moedas.
- **B:** Correta: separa remuneração, diferencial e retorno reconvertido.
- **C:** US$ 84 usaria a cotação inicial, não a final dada.
- **D:** O caso informa pagamento em reais; a perda deriva da reconversão.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario).

</details>

Aula de origem: [CE-11: 1. Comparar taxas exige ler a moeda e o período](ce-11-v1.md#inicio); [CE-11: 2. Exemplo resolvido: pontos percentuais](ce-11-v1.md#ex-diferencial); [CE-11: 3. O caminho de ida e volta](ce-11-v1.md#moedas); [CE-11: 4. Exemplo resolvido: juros compensados pela cotação](ce-11-v1.md#ex-conversao).

### Questão 12

A taxa doméstica aumenta, mas o risco percebido e as expectativas também mudam. Um fluxo de saída descrito no caso exige vender reais e comprar dólares. Mantidos os demais fatores para analisar esse fluxo específico, qual leitura é adequada?

A. Juros maiores tornam impossível qualquer saída.

B. O fluxo exige necessariamente comprar reais, apesar do enunciado.

C. O maior retorno exigido elimina a possibilidade de perda.

D. A compra de dólares pode pressionar a alta de R$/US$; a alta dos juros, sozinha, não garante entrada líquida nem valorização.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** O sentido da conversão informada pode pressionar a cotação, enquanto juros, risco e expectativas atuam conjuntamente. Não há previsão garantida.

- **A:** O incentivo de juros não decide todos os fatores.
- **B:** Inverte a conversão expressamente dada.
- **C:** Compensação exigida não elimina incerteza.
- **D:** Correta: distingue pressão do fluxo e resultado agregado condicionado.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos que ajudam a conferir](#glossario); [5. Corrigir a confusão, sem inferir prontidão](#recuperacao).

</details>

Aula de origem: [CE-11: 5. Prêmio de risco não é prêmio já recebido](ce-11-v1.md#risco); [CE-11: 7. Como uma entrada pode pressionar a cotação](ce-11-v1.md#fluxo); [CE-11: 8. Juros maiores não decidem sozinhos](ce-11-v1.md#expectativas).

## Fontes e limites editoriais

- [CVM — Ações](https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes): Página educativa consultada em 01/10/2026; recorte conceitual; Participação e retorno; não usar os trechos tributários; consulta 2026-10-01.
- [Lei 6.404/1976 — texto consolidado](https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm): Texto oficial consolidado consultado em 01/10/2026; Arts. 15, 17, 109, 110, 110-A e 111: espécies e direitos; sem prazos ou percentuais de dividendos; consulta 2026-10-01.
- [CVM — Debêntures](https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures): Página educativa consultada em 01/10/2026; Credor da emissora, debênture simples, remuneração e risco; sem tributação ou ritos de oferta; consulta 2026-10-01.
- [CVM — Títulos bancários](https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/titulos-bancarios): Página educativa consultada em 01/10/2026; Somente captação bancária/CDB; sem FGC, tributação, prazos mínimos ou supervisão de outros produtos; consulta 2026-10-01.
- [CVM — Resolução 175, Parte Geral consolidada](https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf): Texto consolidado vinculado na página oficial que lista alteração 240/26; consultado em 01/10/2026; Arts. 3º (datas), 4º–5º, 14, 40 e 80–86 da Parte Geral consolidada; classes/cotas, resgate e prestadores. Somente recorte introdutório.; consulta 2026-10-01.
- [CVM — Risco e a relação risco x retorno](https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno): Página educacional de 15/09/2022; consulta em 01/10/2026; Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.; consulta 2026-10-01.
- [BCB — O que é câmbio](https://www.bcb.gov.br/estabilidadefinanceira/oqueecambio): Página pública renderizada em 01/10/2026; Conversão, turismo, remessas e comércio exterior; links para instituições e VET; consulta 2026-10-01.
- [Lei 14.286/2021 — câmbio](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm): Texto oficial consultado em 01/10/2026; Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos; consulta 2026-10-01.
- [BCB — Política cambial](https://www.bcb.gov.br/estabilidadefinanceira/politicacambial): Página pública renderizada em 01/10/2026; Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços; consulta 2026-10-01.
- [FMI — Real Exchange Rates: What Money Can Buy](https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates): Texto educativo Back to Basics, consultado em 01/10/2026; Equação eP*/P; índices/base de comparação e limites da comparação de poder de compra; consulta 2026-10-01.
- [BCB — Mecanismos de transmissão da política monetária](https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria): Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota; Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação; consulta 2026-09-30.

- Doze itens próprios de prática exposta, não avaliação independente. Fontes e conceitos das aulas já verificadas são reaproveitados; não há norma, produto ou procedimento novo.
- Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.
- Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.
- Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação.
