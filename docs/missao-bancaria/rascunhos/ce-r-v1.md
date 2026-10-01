# CE-R — Revisão cumulativa: do instrumento ao câmbio

**Rascunho para revisão, não publicado.** Rascunho fora do catálogo; revisão independente agrupada e humana pendentes.

Fonte editorial: [ce-r-v1.mjs](ce-r-v1.mjs). Regenerar com `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=cer --render`.

Objetivo: Resolver casos que combinam instrumentos e câmbio, identificando a confusão e retomando a aula que a ensina.

<a id="inicio"></a>

## 1. Como usar esta revisão

Tente reconstruir o caminho da resposta antes de olhar o comentário. Para cada erro, escreva uma frase: 'Confundi X com Y'. Em seguida abra a aula de origem indicada na questão, refaça o exemplo correspondente e explique a distinção com seus próprios termos. Repetir a alternativa certa sem recuperar o conceito não demonstra retenção.

<a id="instrumentos"></a>

## 2. Instrumento e dinheiro: duas perguntas

Ação representa participação; dívida cria obrigação do emissor; cota representa fração de patrimônio de uma classe de fundo no recorte estudado. Depois pergunte se houve emissão nova ou revenda. A natureza do direito e o destino do dinheiro são dimensões diferentes. Retomada: [CE-01](ce-01-v1.md#mercados), [CE-02](ce-02-v1.md#inicio), [CE-03](ce-03-v1.md#ex-emissor) e [CE-04](ce-04-v1.md#cota).

Base conceitual: [CVM — Ações](https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes); [CVM — Debêntures](https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures); [CVM — Resolução 175, Parte Geral consolidada](https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf). Consulta: 01/10/2026.

<a id="ex-instrumentos"></a>

## 3. Exemplo resolvido: mesma emissora, direitos distintos

Na hipótese, uma companhia emite novas ações e novas debêntures simples. Ana subscreve ações: torna-se acionista. Bruno subscreve debêntures: torna-se credor. Em ambos os casos os recursos da emissão chegam à companhia, sem custos no exemplo. Se Ana depois vende suas ações a Carla, esse segundo pagamento vai a Ana, sem nova captação pela companhia.

<a id="riscos"></a>

## 4. Prazo e risco continuam presentes

Quantidade de cotas não fixa seu preço futuro. Uma dívida não elimina risco de crédito, mercado ou liquidez. Uma classe aberta admite resgates conforme regras, mas isso não significa receber imediatamente em qualquer circunstância. Retomada: [CE-04, movimentação](ce-04-v1.md#movimentacao) e [CE-05, riscos](ce-05-v1.md#riscos).

Base conceitual: [CVM — Resolução 175, Parte Geral consolidada](https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf); [CVM — Risco e a relação risco x retorno](https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno). Consulta: 01/10/2026.

<a id="ex-riscos"></a>

## 5. Exemplo resolvido: do pedido ao dinheiro

No caso fictício, 30 cotas são resgatadas segundo valor de R$ 12 na conversão: R$ 360, sem encargos. O regulamento do caso separa o dia de pedido do dia de pagamento. Pedir resgate não antecipa automaticamente o recebimento. A quantidade 30, sozinha, também não prova que o resultado foi positivo: seria necessário conhecer a aplicação inicial e os demais fluxos.

<a id="cambio"></a>

## 6. Taxa, operação e regime

Escreva a unidade da taxa e a perspectiva de compra/venda. Identifique a instituição e a finalidade da operação. Para classificar regime, leia o compromisso institucional: um episódio de intervenção não resolve a questão. Retomada: [CE-06](ce-06-v1.md#conversao), [CE-07](ce-07-v1.md#autorizacao) e [CE-08](ce-08-v1.md#flutuante).

Base conceitual: [Lei 14.286/2021 — câmbio](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm); [BCB — Política cambial](https://www.bcb.gov.br/estabilidadefinanceira/politicacambial). Consulta: 01/10/2026.

<a id="ex-conversao"></a>

## 7. Exemplo resolvido: compra do cliente

Uma instituição informa compra de dólar a R$ 4,90 e venda a R$ 5,10, na perspectiva dela. O cliente compra US$ 40 sem outros custos: utiliza a venda da instituição e paga 40 × 5,10 = R$ 204. O exercício não identifica o regime do país nem prova que a instituição esteja habilitada; esses dados exigem informações próprias.

<a id="efeitos"></a>

## 8. A mesma taxa em perguntas diferentes

Com q = e × P* ÷ P, é preciso acompanhar também os preços. Para receitas e despesas em dólares, mantenha contratos e custos explícitos. Para aplicar em reais e voltar a dólares, refaça as duas conversões. Retomada: [CE-09](ce-09-v1.md#formula), [CE-10](ce-10-v1.md#resultado) e [CE-11](ce-11-v1.md#moedas). Uma pressão sobre a cotação não é previsão garantida.

Base conceitual: [FMI — Real Exchange Rates: What Money Can Buy](https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates); [BCB — Mecanismos de transmissão da política monetária](https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria). Consulta: 01/10/2026; 30/09/2026.

<a id="ex-efeitos"></a>

## 9. Exemplo resolvido: separar duas contas

Um caso informa e = 5, preço externo da cesta US$ 8 e preço doméstico R$ 40: q = 5 × 8 ÷ 40 = 1. Outro contrato, independente, prevê receita US$ 50 e despesa US$ 20, sem outros custos: resultado em reais = (50 − 20) × 5 = R$ 150. q é uma comparação de preços; R$ 150 é um resultado monetário do contrato. Não se confundem as unidades nem se usa um como prova de equilíbrio do outro.

<a id="glossario"></a>

## 10. Vocabulário para separar confusões

Emissor: quem emite o instrumento. Cotista: titular de cotas. Crédito: cumprimento da obrigação. Liquidez: condição de converter em dinheiro. Cotação: relação entre moedas. Regime: regra de formação da taxa. Câmbio real: comparação ajustada pelos preços, conforme convenção. Diferencial: diferença entre taxas comparáveis. Prêmio de risco: compensação exigida, sem promessa de realização.

<a id="resumo"></a>

## 11. Síntese e recuperação

O caminho é instrumento → direito → fluxo → prazo/risco → moeda → hipótese → cálculo → limite da conclusão. As oito questões abaixo reaplicam esse caminho em casos novos; cada uma remete às seções de origem. As 11 aulas estão representadas nas referências. Prática comentada e conclusão de ciclos não equivalem a uma avaliação independente de prontidão.

## Recordação e recuperação

- Explique os conceitos sem consultar e confira a seção de origem.
- Refaça o exemplo, separando dados, hipótese e conclusão.
- Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente.

## Prática comentada

Todos os casos são fictícios. Tente responder antes de abrir cada comentário.

### Questão 1

Uma companhia emite ações e debêntures simples novas. Lia subscreve as ações e Rui, as debêntures. Sem custos no caso, qual leitura é correta?

A. Ambos se tornam proprietários de ações.

B. Lia é acionista, Rui é credor e a companhia recebe os recursos dessas emissões.

C. A companhia não recebe recursos de nenhuma emissão.

D. Rui recebe direito de voto de acionista apenas por ter a debênture simples.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** O tipo de instrumento define o direito; a emissão nova define o destino inicial do recurso.

- **A:** Debênture simples não é ação.
- **B:** Correta: separa participação, dívida e captação.
- **C:** Confunde emissão nova com revenda.
- **D:** O crédito não cria automaticamente voto societário.

Para recuperar: [2. Instrumento e dinheiro: duas perguntas](#instrumentos); [3. Exemplo resolvido: mesma emissora, direitos distintos](#ex-instrumentos).

</details>

Aula de origem: [CE-01: 5. Emissão nova e negociação posterior](ce-01-v1.md#mercados); [CE-02: 1. Ser acionista](ce-02-v1.md#inicio); [CE-03: 1. Comece pelo emissor](ce-03-v1.md#inicio).

### Questão 2

Uma classe aberta prevê pedido, conversão e pagamento em datas distintas. O cotista pede resgate, sem informação de conversão imediata. É correto concluir que:

A. O dinheiro necessariamente está disponível no mesmo momento.

B. A palavra 'aberta' elimina risco de mercado.

C. O número de cotas determina sozinho o ganho.

D. É preciso observar os prazos e condições; o pedido não é o pagamento.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** A admissão de resgate não iguala suas etapas nem garante resultado.

- **A:** Contraria a separação de datas informada.
- **B:** O preço pode variar mesmo em classe aberta.
- **C:** Faltam preços e fluxos da aplicação.
- **D:** Correta: lê a condição efetiva de liquidez.

Para recuperar: [4. Prazo e risco continuam presentes](#riscos); [5. Exemplo resolvido: do pedido ao dinheiro](#ex-riscos).

</details>

Aula de origem: [CE-04: 7. Aberta, fechada e prazos](ce-04-v1.md#movimentacao); [CE-05: 2. Três riscos, três perguntas](ce-05-v1.md#riscos).

### Questão 3

Uma instituição identificada informa, na perspectiva dela, compra a 4,70 e venda a 5,30 R$/US$. Sem outros custos, o cliente que compra US$ 20:

A. Paga R$ 106; a habilitação da instituição é uma verificação própria.

B. Paga R$ 94, e o preço sozinho prova autorização.

C. Paga R$ 100, usando a média obrigatória.

D. Recebe R$ 106, porque compra e venda são sempre do cliente.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** A instituição vende: 20 × 5,30 = R$ 106. Cotação não comprova autorização.

- **A:** Correta: resolve a conversão sem inferir habilitação do preço.
- **B:** Usa a ponta contrária e uma conclusão indevida.
- **C:** Não há obrigação de usar média.
- **D:** O cliente paga para comprar, e a perspectiva foi declarada.

Para recuperar: [6. Taxa, operação e regime](#cambio); [7. Exemplo resolvido: compra do cliente](#ex-conversao).

</details>

Aula de origem: [CE-06: 5. Quem compra a moeda estrangeira?](ce-06-v1.md#perspectiva); [CE-07: 4. Quem realiza a operação?](ce-07-v1.md#autorizacao).

### Questão 4

A taxa é formada no mercado e a autoridade intervém em uma disfunção, sem anunciar paridade a defender. Esse episódio:

A. Prova regime fixo permanente.

B. Prova uma banda de limites conhecidos.

C. É compatível com flutuação; intervenção isolada não prova mudança de regime.

D. Impede que o país adote flutuação.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** A finalidade e o compromisso institucional importam para a classificação.

- **A:** Não existe compromisso fixo informado.
- **B:** Não foram informados limites.
- **C:** Correta: evita classificar apenas pelo evento.
- **D:** Flutuação não requer inação absoluta.

Para recuperar: [6. Taxa, operação e regime](#cambio).

</details>

Aula de origem: [CE-08: 4. Flutuante não significa autoridade ausente](ce-08-v1.md#flutuante); [CE-08: 5. Exemplo resolvido: intervenção e finalidade](ce-08-v1.md#ex-flutuante).

### Questão 5

Use q = e × P* ÷ P. e permanece 4 R$/US$ e P* permanece US$ 10; P sobe de R$ 32 para R$ 40. q:

A. Fica constante porque e não mudou.

B. Sobe de 1 para 1,25.

C. Prova que a cotação estava em equilíbrio quando q era 1.

D. Cai de 1,25 para 1, apesar da cotação nominal constante.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** O numerador permanece R$ 40 e o denominador sobe: 40 ÷ 32 e 40 ÷ 40.

- **A:** Ignora o preço doméstico.
- **B:** Inverte antes e depois.
- **C:** q igual a 1 no modelo não demonstra equilíbrio econômico.
- **D:** Correta: os preços também alteram a medida real.

Para recuperar: [8. A mesma taxa em perguntas diferentes](#efeitos); [9. Exemplo resolvido: separar duas contas](#ex-efeitos).

</details>

Aula de origem: [CE-09: 2. Defina símbolos antes de calcular](ce-09-v1.md#formula); [CE-09: 7. Exemplo resolvido: muda apenas o preço doméstico](ce-09-v1.md#ex-precos).

### Questão 6

Uma firma recebe US$ 70, paga US$ 20 de insumos e R$ 50 de outros custos. A 5 R$/US$, sem outros itens, o resultado é:

A. R$ 350.

B. R$ 200.

C. R$ 250.

D. US$ 200.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** Receita R$ 350 menos custo importado R$ 100 menos custo local R$ 50 = R$ 200.

- **A:** É a receita antes dos custos.
- **B:** Correta: deduz os dois custos.
- **C:** Falta deduzir o custo local.
- **D:** A conta pedida usa reais.

Para recuperar: [8. A mesma taxa em perguntas diferentes](#efeitos); [9. Exemplo resolvido: separar duas contas](#ex-efeitos).

</details>

Aula de origem: [CE-10: 6. Receita não é lucro](ce-10-v1.md#resultado); [CE-10: 7. Exemplo resolvido: os dois lados da mesma empresa](ce-10-v1.md#ex-resultado).

### Questão 7

US$ 50 são convertidos a 4 R$/US$ e rendem 10% em reais no período. Sem custos, a reconversão a 4,40 R$/US$ dá:

A. US$ 55, pois rendimento em reais e em dólares sempre coincide.

B. US$ 220, ignorando a unidade.

C. US$ 50; o retorno em dólares foi zero no caso.

D. Ganho garantido de 10% em qualquer cotação.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** São R$ 200 iniciais, R$ 220 finais e 220 ÷ 4,40 = US$ 50.

- **A:** Ignora a nova taxa de conversão.
- **B:** Confunde reais com dólares.
- **C:** Correta: contabiliza as duas conversões.
- **D:** O câmbio final faz parte do resultado.

Para recuperar: [8. A mesma taxa em perguntas diferentes](#efeitos).

</details>

Aula de origem: [CE-11: 3. O caminho de ida e volta](ce-11-v1.md#moedas); [CE-11: 4. Exemplo resolvido: juros compensados pela cotação](ce-11-v1.md#ex-conversao); [CE-06: 2. Multiplicar ou dividir?](ce-06-v1.md#conversao).

### Questão 8

Um anúncio afirma: 'A taxa doméstica subiu; portanto a moeda certamente vai valorizar e qualquer aplicação local terá lucro em dólares'. Qual resposta é adequada?

A. Juros podem influenciar fluxos, mas riscos, expectativas e reconversão impedem essa garantia.

B. A promessa está correta porque uma taxa elimina todos os riscos.

C. A conclusão independe do câmbio de saída.

D. O retorno esperado é igual ao realizado por definição.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** O anúncio transforma relações condicionais em certeza sobre o retorno.

- **A:** Correta: considera os fatores ensinados.
- **B:** Taxa maior não elimina riscos.
- **C:** A reconversão altera o valor na moeda inicial.
- **D:** Expectativa não é resultado recebido.

Para recuperar: [4. Prazo e risco continuam presentes](#riscos); [8. A mesma taxa em perguntas diferentes](#efeitos).

</details>

Aula de origem: [CE-05: 4. Esperado não é recebido](ce-05-v1.md#retorno); [CE-11: 8. Juros maiores não decidem sozinhos](ce-11-v1.md#expectativas); [CE-11: 7. Como uma entrada pode pressionar a cotação](ce-11-v1.md#fluxo).

## Fontes e limites editoriais

- [CVM — Ações](https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes): Página educativa consultada em 01/10/2026; recorte conceitual; Participação e retorno; não usar os trechos tributários; consulta 2026-10-01.
- [CVM — Debêntures](https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures): Página educativa consultada em 01/10/2026; Credor da emissora, debênture simples, remuneração e risco; sem tributação ou ritos de oferta; consulta 2026-10-01.
- [CVM — Resolução 175, Parte Geral consolidada](https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf): Texto consolidado vinculado na página oficial que lista alteração 240/26; consultado em 01/10/2026; Arts. 3º (datas), 4º–5º, 14, 40 e 80–86 da Parte Geral consolidada; classes/cotas, resgate e prestadores. Somente recorte introdutório.; consulta 2026-10-01.
- [CVM — Risco e a relação risco x retorno](https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno): Página educacional de 15/09/2022; consulta em 01/10/2026; Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.; consulta 2026-10-01.
- [Lei 14.286/2021 — câmbio](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm): Texto oficial consultado em 01/10/2026; Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos; consulta 2026-10-01.
- [BCB — Política cambial](https://www.bcb.gov.br/estabilidadefinanceira/politicacambial): Página pública renderizada em 01/10/2026; Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços; consulta 2026-10-01.
- [FMI — Real Exchange Rates: What Money Can Buy](https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates): Texto educativo Back to Basics, consultado em 01/10/2026; Equação eP*/P; índices/base de comparação e limites da comparação de poder de compra; consulta 2026-10-01.
- [BCB — Mecanismos de transmissão da política monetária](https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria): Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota; Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação; consulta 2026-09-30.

- Revisão das 11 aulas escritas; não introduz conteúdo novo nem mede retenção independente. O Chefe ainda é proposta, sem itens publicados.
- Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.
- Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.
- Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação.
