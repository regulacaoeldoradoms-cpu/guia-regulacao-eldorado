# PC-11A — Poupança: depósito, aniversário e remuneração

**Rascunho para revisão, não publicado.** Plano 66 reaproveitado; rascunho fora do catálogo, revisão independente e humana pendentes; Fase 2 sem aceite humano observado.

Fonte editorial: [pc-11a-v1.mjs](pc-11a-v1.mjs). Regenerar com `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=pc11a --render`.

Objetivo: Entender a poupança como depósito remunerado, ler a regra do período e distinguir os regimes dos depósitos sem prometer rentabilidade real ou comparar só números.

<a id="inicio"></a>

## 1. Poupar e ter uma conta de poupança

Poupar é separar recursos para uso futuro; não indica um único produto. A caderneta de poupança é uma modalidade de depósito com remuneração regulada. Em [PC-01](pc-01-v1.md#inicio), saldo próprio não se confunde com limite de crédito. Depositar R$500 de recursos próprios na poupança não cria uma dívida de R$500 do depositante perante o banco. Também não equivale a título de capitalização ou a prestação de consórcio; cada produto terá regra própria.

Base conceitual: [BCB — Remuneração dos depósitos de poupança](https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca). Consulta: 30/09/2026.

<a id="periodo"></a>

## 2. O período importa

No recorte usual de pessoa física, o período de rendimento é mensal e a remuneração é creditada ao final desse período. A data de aniversário orienta o ciclo; depósitos nos dias 29, 30 e 31 são tratados segundo a regra de aniversário no dia 1º do mês seguinte. Não se deve supor rendimento diário proporcional para todo valor retirado antes de completar o período. Nosso exemplo usa um único saldo com aniversário conhecido; contas com vários depósitos e datas exigem separar os respectivos registros. A regra geral da fonte prevê período trimestral para outros depósitos fora do grupo de pessoas físicas e entidades sem fins lucrativos.

Base conceitual: [BCB — Remuneração dos depósitos de poupança](https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca). Consulta: 30/09/2026.

<a id="base"></a>

## 3. O menor saldo do período

A remuneração considera o menor saldo do período de rendimento. Portanto, retirar uma parte e depois repô-la não faz essa parte ser tratada automaticamente como mantida durante todo o ciclo original. A retirada não apaga por si só o rendimento devido ao montante que permaneceu segundo a regra, mas o saldo retirado antes do aniversário não ganha rendimento proporcional pelo simples número de dias. É diferente de um empréstimo, em que calendário e juros seguem a obrigação contratada.

Base conceitual: [BCB — Remuneração dos depósitos de poupança](https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca). Consulta: 30/09/2026.

<a id="exemplo-saldo"></a>

## 4. Exemplo resolvido: base de um único ciclo

Caso didático simplificado: pessoa física mantém R$1.000 no início de um ciclo com aniversário conhecido. Retira R$300 antes do aniversário e não faz novos depósitos no período. O menor saldo é 1.000 − 300 = R$700. Se a taxa total hipotética informada para esse ciclo for 0,6%, a remuneração sobre a base é 700 × 0,006 = R$4,20. A taxa de 0,6% foi dada para a conta aritmética, não representa a taxa vigente nem é calculada somando componentes nesta aula.

<a id="regra"></a>

## 5. TR e remuneração adicional no regime novo

Para depósitos efetuados a partir de 4 de maio de 2012, há remuneração básica pela Taxa Referencial (TR) e remuneração adicional. Se a meta Selic anual for superior a 8,5%, a parcela adicional é de 0,5% ao mês. Se for igual ou inferior a 8,5%, a parcela adicional corresponde a 70% da meta Selic anual, mensalizada, considerando a meta no início do período. TR não é Selic. “70%” é proporção da meta, não taxa mensal de 70%; e 0,5% mensal é parcela adicional, não necessariamente toda a remuneração quando há TR. A fórmula de composição e conversão mensal fica fora deste recorte.

Base conceitual: [BCB — Remuneração dos depósitos de poupança](https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca); [Lei 12.703/2012 — transição da poupança](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12703.htm). Consulta: 30/09/2026.

<a id="exemplo-limiar"></a>

## 6. Exemplo resolvido: escolher o ramo da regra

São cenários hipotéticos, não a Selic atual. Cenário A: meta de 9% ao ano no início do período. Como 9 é maior que 8,5, aplica-se adicional de 0,5% ao mês. Cenário B: meta de exatamente 8,5% ao ano. A igualdade pertence ao ramo “igual ou inferior”: usa-se 70% da meta anual, mensalizada. Antes da mensalização, 8,5% × 0,70 = 5,95% ao ano. Não chamamos 5,95% de taxa mensal e não concluímos a remuneração total sem TR e a regra de composição.

<a id="antigos"></a>

## 7. A data do depósito diferencia regimes

A Lei 12.703 preservou, para o saldo dos depósitos anteriores ao regime iniciado em 4/5/2012, a remuneração por TR mais juros de 0,5% ao mês, nos termos legais. As instituições devem manter segregados os saldos antigos e novos. A data de abertura da conta sozinha não transforma depósitos novos em antigos: a separação se refere aos depósitos. Uma conta aberta antes de 2012 pode receber dinheiro depois dessa data, sujeito ao regime correspondente.

Base conceitual: [Lei 12.703/2012 — transição da poupança](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12703.htm). Consulta: 30/09/2026.

<a id="exemplo-data"></a>

## 8. Exemplo resolvido: conta antiga, depósito novo

Uma conta foi aberta em 2010, mas o valor descrito foi efetivamente depositado em 2026. Para esse depósito, olhamos a data em que o dinheiro foi creditado, e não apenas a idade da conta. Ele pertence ao regime dos depósitos a partir de 4/5/2012. O caso não descreve saldo antigo remanescente, que seria tratado separadamente.

<a id="limites"></a>

## 9. Rendimento nominal não prova ganho de compra

Rendimento nominal é aumento em reais; poder de compra depende também da evolução dos preços. Uma remuneração positiva não garante superar a inflação. Para comparar produtos, ainda importam prazo, disponibilidade, custos, risco e regras, sem concluir que um rótulo comercial torna um produto sempre melhor. Esta aula não especifica cobertura ou limites de garantia de depósitos, tributação de todos os titulares ou recomendação individual. Essas informações precisam de fonte própria e enquadramento antes de serem usadas em uma decisão real.

Base conceitual: [BCB — Remuneração dos depósitos de poupança](https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca). Consulta: 30/09/2026.

<a id="exemplo-poder"></a>

## 10. Exemplo resolvido: comparar grandezas proporcionais

Hipótese apenas matemática: saldo de R$1.000 passa a R$1.040 num período; uma cesta comparável de R$1.000 passa a custar R$1.050 no mesmo período. O saldo aumentou R$40, mas não compra a mesma cesta ao final: faltam R$10. Não calculamos aqui taxa real exata nem dizemos que essas foram taxas efetivas da poupança ou da inflação.

<a id="glossario"></a>

## 11. Vocabulário de recuperação

Depósito: recurso creditado na conta. Aniversário: referência do ciclo de remuneração. TR: taxa referencial usada na parcela básica da remuneração. Meta Selic: referência da condição do adicional no regime novo. Mensalizar: converter uma taxa para equivalente mensal segundo a regra, sem simplesmente mudar o nome do período. Saldo segregado: registro separado de regimes distintos.

<a id="resumo"></a>

## 12. Sequência de leitura

Identifique titular, depósito e regime. Confira aniversário e menor saldo do período. Escolha o ramo da regra da meta Selic quando for depósito do regime novo, conservando TR e unidades temporais. Não confunda taxa adicional com total nem rendimento nominal com ganho real.

## Recordação e recuperação

- Explique por que uma conta antiga pode conter depósitos do regime novo.
- Reconstrua o exemplo do menor saldo e escreva 0,6% como fração decimal.
- Diferencie TR, meta Selic, adicional e remuneração total sem trocar períodos.

## Prática comentada

Todos os casos são fictícios. Tente responder antes de abrir cada comentário.

### Questão 1

Pessoa transfere R$500 próprios para uma conta de poupança. O fato descrito é:

A. contratação automática de empréstimo pelo depositante.

B. depósito de recursos próprios em modalidade remunerada.

C. compra obrigatória de título de capitalização.

D. pagamento de lance de consórcio.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** As categorias não se confundem apenas porque envolvem dinheiro.

- **A:** Não há limite ou empréstimo utilizado no caso.
- **B:** Identifica o depósito.
- **C:** Capitalização é produto diferente.
- **D:** Nenhum grupo ou lance foi informado.

Para recuperar: [1. Poupar e ter uma conta de poupança](#inicio).

</details>

### Questão 2

No exemplo de um único ciclo, saldo R$1.000, saque R$300 e nenhum depósito posterior. Qual base foi usada para remuneração?

A. R$1.300.

B. R$1.000, sempre ignorando o saque.

C. R$300.

D. R$700, o menor saldo do período.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** A retirada reduz o menor saldo a 700.

- **A:** Soma um saque em vez de subtrair.
- **B:** Ignora a regra da base.
- **C:** Usa o valor retirado, não o saldo mantido.
- **D:** Aplica a regra ao caso simplificado.

Para recuperar: [3. O menor saldo do período](#base); [4. Exemplo resolvido: base de um único ciclo](#exemplo-saldo).

</details>

### Questão 3

Depósito do regime novo; meta Selic hipotética exatamente 8,5% a.a. Qual ramo corresponde?

A. 70% da meta anual, mensalizada, além da TR conforme a regra.

B. 0,5% adicional mensal porque igualdade significa superior.

C. 70% ao mês garantidos.

D. Nenhuma remuneração pode existir.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** A igualdade pertence ao ramo igual ou inferior a 8,5%.

- **A:** Mantém limiar e período corretos.
- **B:** Troca maior por maior ou igual.
- **C:** Transforma proporção em taxa mensal.
- **D:** Não decorre da regra.

Para recuperar: [5. TR e remuneração adicional no regime novo](#regra); [6. Exemplo resolvido: escolher o ramo da regra](#exemplo-limiar).

</details>

### Questão 4

No ramo de meta Selic superior a 8,5% a.a., a expressão 0,5% ao mês descreve:

A. a meta Selic anual.

B. sempre o total completo, mesmo com TR.

C. a remuneração adicional, distinguida da básica pela TR.

D. o rendimento diário.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** É a parcela adicional mensal, não toda referência possível da operação.

- **A:** Troca duas taxas e seus períodos.
- **B:** Ignora a parcela básica.
- **C:** Usa a abrangência correta.
- **D:** Troca mês por dia.

Para recuperar: [5. TR e remuneração adicional no regime novo](#regra).

</details>

### Questão 5

Conta aberta em 2010 recebe um depósito em 2026. Qual data define o regime desse depósito?

A. Somente 2010; tudo na conta será antigo.

B. O depósito em 2026 pertence ao regime a partir de 4/5/2012, com saldos antigos separados se existirem.

C. A data do nascimento do titular.

D. A data em que a questão foi respondida.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** A separação é por depósitos, não apenas pela abertura da conta.

- **A:** Confunde conta com regime de todos os depósitos.
- **B:** Reconhece a segregação.
- **C:** Não é o critério legal.
- **D:** Não altera quando o depósito ocorreu.

Para recuperar: [7. A data do depósito diferencia regimes](#antigos); [8. Exemplo resolvido: conta antiga, depósito novo](#exemplo-data).

</details>

### Questão 6

O saldo passou de R$1.000 para R$1.040, mas a cesta comparável passou de R$1.000 para R$1.050 no mesmo período. O que cabe afirmar?

A. Rendimento nominal positivo prova ganho de compra.

B. O saldo não aumentou em reais.

C. A diferença garante a taxa real exata sem cálculo.

D. Houve aumento nominal de R$40, insuficiente para comprar a mesma cesta ao final.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** A comparação distingue aumento em reais e compra da cesta.

- **A:** A cesta ficou proporcionalmente mais cara.
- **B:** O saldo aumentou 40.
- **C:** O caso não calculou a taxa real exata.
- **D:** Interpreta os valores sem extrapolar.

Para recuperar: [9. Rendimento nominal não prova ganho de compra](#limites); [10. Exemplo resolvido: comparar grandezas proporcionais](#exemplo-poder).

</details>

### Questão 7

A taxa total didática de um ciclo é dada como 0,6%, com base de R$700. Qual cálculo corresponde?

A. 700 × 0,006 = R$4,20.

B. 700 × 0,6 = R$420.

C. 700 + 0,6 = R$700,60 de rendimento.

D. R$0,60 independentemente do saldo.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** 0,6 por cento equivale a 0,006 na multiplicação.

- **A:** Converte e aplica a proporção.
- **B:** Usa 60% no lugar de 0,6%.
- **C:** Soma número de taxa a dinheiro sem calcular rendimento.
- **D:** Ignora a base.

Para recuperar: [4. Exemplo resolvido: base de um único ciclo](#exemplo-saldo).

</details>

### Questão 8

Sobre saque antes do aniversário no recorte de pessoa física, qual leitura respeita a aula?

A. Todo valor sacado recebe automaticamente rendimento proporcional por dia.

B. Todos os depósitos de qualquer titular rendem diariamente de modo idêntico.

C. Não se deve presumir rendimento diário proporcional; observe período, base e datas.

D. O saque torna todo o saldo uma dívida de crédito.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** Disponibilidade do dinheiro e regra de remuneração não são a mesma coisa.

- **A:** Inventa uma proporcionalidade que não é a regra ensinada.
- **B:** Ignora períodos e titulares.
- **C:** Conserva as condições necessárias.
- **D:** Saque de saldo próprio não contrata dívida automaticamente.

Para recuperar: [2. O período importa](#periodo); [3. O menor saldo do período](#base).

</details>

## Fontes e limites editoriais

- [BCB — Remuneração dos depósitos de poupança](https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca): Fonte oficial consultada em 30/09/2026; regras do recorte identificado; Regra de remuneração, menor saldo, período e aniversário; sem usar a tabela de taxas observadas; consulta 2026-09-30.
- [Lei 12.703/2012 — transição da poupança](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12703.htm): Fonte oficial consultada em 30/09/2026; regras do recorte identificado; Arts. 1º–3º: regra adicional e separação dos depósitos a partir de 4/5/2012; consulta 2026-09-30.

- Não calcula composição TR/adicional nem equivalência completa de taxas. Não utiliza Selic, TR ou rentabilidade observada como dado atual.
- Sem deduzir tributação/garantia de depósitos fora do escopo; exemplos de taxa total são hipotéticos e explicitamente fornecidos.
- Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.
- Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico.
