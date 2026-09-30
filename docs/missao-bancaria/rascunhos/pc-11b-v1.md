# PC-11B — Capitalização: parte do pagamento, sorteio e resgate

**Rascunho para revisão, não publicado.** Plano 66 reaproveitado; rascunho fora do catálogo, revisão independente e humana pendentes; Fase 2 sem aceite humano observado.

Fonte editorial: [pc-11b-v1.mjs](pc-11b-v1.mjs). Regenerar com `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=pc11b --render`.

Objetivo: Separar pagamento total, saldo capitalizado e prêmio de sorteio, reconhecer participantes e comparar modalidades sem confundi-las com poupança.

<a id="inicio"></a>

## 1. Não basta ouvir a palavra “guardar”

Título de capitalização forma um capital com parte do pagamento, segundo suas condições, e pode incluir participação em sorteios. É produto de sociedade de capitalização autorizada. Não é a mesma conta de [poupança](pc-11a-v1.md#inicio): distribuição dos pagamentos, disponibilidade, prazo e direitos são próprios. O nome capitalização também não deve ser confundido com o conceito matemático geral de aplicar juros a um valor. Antes de comparar, identifique o produto concreto.

Base conceitual: [SUSEP — Apresentação da capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/explicacao). Consulta: 30/09/2026.

<a id="partes"></a>

## 2. Quem paga e quem tem os direitos

Subscritor é quem assume o pagamento na aquisição do título; titular é quem tem os direitos previstos, como resgate e participação em sorteios. Esses papéis podem coincidir, mas isso não deve ser presumido em toda modalidade. As condições gerais descrevem deveres, direitos, percentuais e prazos. Vender o produto em uma agência bancária não transforma automaticamente o banco na sociedade de capitalização responsável, nem muda a natureza do título.

Base conceitual: [SUSEP — Apresentação da capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/explicacao). Consulta: 30/09/2026.

<a id="cotas"></a>

## 3. O pagamento tem destinos diferentes

A cota de capitalização é a parcela que contribui para formar o saldo de resgate. A cota de sorteio custeia sorteios; não é um prêmio já ganho. A cota de carregamento cobre despesas e demais componentes previstos na estrutura do produto. Os percentuais constam das condições gerais. A provisão matemática de resgate é o saldo formado para resgate segundo essas regras; os juros e a atualização incidem sobre essa provisão, não automaticamente sobre todo dinheiro pago. Não presumimos percentuais iguais para todos os títulos ou meses.

Base conceitual: [SUSEP — Apresentação da capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/explicacao). Consulta: 30/09/2026.

<a id="exemplo-cotas"></a>

## 4. Exemplo resolvido: dividir um pagamento hipotético

Em um título fictício, o pagamento considerado é de R$100: R$70 para capitalização, R$10 para sorteio e R$20 para carregamento. Passo 1: conferir 70 + 10 + 20 = R$100. Passo 2: identificar R$70 como parcela destinada à formação do capital naquele pagamento. Passo 3: não tratar R$100 inteiros como capital aplicado nem R$10 como prêmio recebido. Esses valores são uma decomposição didática dada, não padrão regulatório nem oferta real.

<a id="prazos"></a>

## 5. Pagar, manter e resgatar são momentos distintos

Prazo de pagamento é o período de contribuições; vigência é o período em que o título está em vigor, acumulando conforme as condições e dando os direitos previstos. Os prazos podem diferir. Resgate é receber o valor a que se tem direito segundo o título, não necessariamente retirar a soma integral de pagamentos a qualquer instante. Antes de inferir o valor disponível, consulte condições e tabela de resgate; nesta aula não existe promessa geral de liquidez imediata ou de restituição integral em toda modalidade.

Base conceitual: [SUSEP — Apresentação da capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/explicacao); [SUSEP — Modalidades de capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/modalidades). Consulta: 30/09/2026.

<a id="exemplo-prazo"></a>

## 6. Exemplo resolvido: o fim dos pagamentos não basta

Hipótese: título com seis pagamentos previstos e vigência de doze meses. Concluir o sexto pagamento não significa, por si, que a vigência terminou ou que todo valor pode ser resgatado naquele dia. Primeiro separe as duas linhas do calendário. Depois confira as condições do direito de resgate. Não calculamos valor antecipado porque o caso não fornece sua tabela.

<a id="modalidades"></a>

## 7. Tradicional e popular têm objetivos diferentes

Na modalidade tradicional, o objetivo é restituir ao final da vigência ao menos o total pago pelo subscritor, desde que todos os pagamentos previstos tenham sido feitos nas datas programadas. Isso não promete a mesma restituição a qualquer momento anterior nem ganho real acima da inflação. Na popular, a participação em sorteios é central e o valor devolvido ao final é inferior ao total pago. Por isso, afirmar que todo título devolve integralmente todos os pagamentos é errado. Outras modalidades têm destinação e direitos próprios: incentivo, filantropia premiável, instrumento de garantia e compra-programada. Não decoramos requisitos dessas modalidades sem ensino específico.

Base conceitual: [SUSEP — Modalidades de capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/modalidades). Consulta: 30/09/2026.

<a id="exemplo-modalidade"></a>

## 8. Exemplo resolvido: uma condição omitida muda a conclusão

Anúncio didático: “Você receberá ao final ao menos o total pago”. Antes de usar a frase como regra universal, identificamos que o caso se refere à modalidade tradicional e exige os pagamentos previstos nas datas. Não transportamos a conclusão para a popular nem para resgate antecipado. Se o texto não informa modalidade e condições, a resposta correta é identificar a informação faltante, não inventá-la.

<a id="sorteio"></a>

## 9. Possibilidade de prêmio não é rentabilidade certa

Participar de um sorteio não significa ser contemplado. Um prêmio eventual é diferente do saldo capitalizado e não deve ser somado como se fosse recebimento garantido na comparação de produtos. Na modalidade incentivo, por exemplo, o consumidor participa dos sorteios, enquanto o resgate pertence ao subscritor, segundo a explicação da SUSEP. Esse caso torna visível por que pagar, participar e ter direito ao resgate não são sempre a mesma posição. Não inferimos probabilidade de ganhar sem regras e dados do sorteio.

Base conceitual: [SUSEP — Apresentação da capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/explicacao); [SUSEP — Modalidades de capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/modalidades). Consulta: 30/09/2026.

<a id="exemplo-direitos"></a>

## 10. Exemplo resolvido: promoção com modalidade declarada

Uma empresa subscritora oferece a consumidores participação em sorteios de título da modalidade incentivo. O caso informa que o resgate pertence à subscritora. Primeiro identificamos a modalidade; depois os direitos distintos. O consumidor participante não pode ser apresentado, só por isso, como titular de uma poupança no valor do resgate. Ganhar o sorteio também não foi dado como fato.

<a id="glossario"></a>

## 11. Vocabulário de recuperação

Cota: destino de parte de um pagamento. Carregamento: componente destinado aos custos e demais finalidades previstas do produto. Capitalização: formação do saldo segundo as condições. Resgate: recebimento desse saldo nos termos aplicáveis. Prêmio de sorteio: pagamento condicionado ao resultado do sorteio. Vigência: período de duração do título; pode diferir do prazo de pagamento.

<a id="resumo"></a>

## 12. Antes de comparar

Identifique sociedade responsável, modalidade, subscritor e titular. Separe as cotas do pagamento e os calendários. Leia o resgate e as condições sem adicionar um prêmio incerto como retorno garantido. Poupança, capitalização e sorteio não são categorias intercambiáveis.

## Recordação e recuperação

- Refaça a decomposição de R$100 e diga o que cada parte representa.
- Compare tradicional e popular sem omitir condições e momento.
- Explique por que possível prêmio não é saldo próprio já disponível.

## Prática comentada

Todos os casos são fictícios. Tente responder antes de abrir cada comentário.

### Questão 1

No pagamento fictício de R$100, há R$70 para capitalização, R$10 para sorteio e R$20 para carregamento. Qual valor foi destinado à formação de capital nesse pagamento?

A. R$100, sem distinção.

B. R$10, pois é o prêmio ganho.

C. R$70.

D. R$20, porque todo custo é resgate.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** O enunciado separa a cota de capitalização das outras destinações.

- **A:** Ignora as cotas.
- **B:** Sorteio não é prêmio garantido nem capital.
- **C:** Usa a parcela expressamente indicada.
- **D:** Carregamento não é capitalização.

Para recuperar: [3. O pagamento tem destinos diferentes](#cotas); [4. Exemplo resolvido: dividir um pagamento hipotético](#exemplo-cotas).

</details>

### Questão 2

Qual leitura distingue subscritor e titular?

A. Quem assume o pagamento e quem tem os direitos podem ocupar papéis diferentes, conforme o título.

B. São sempre instituições reguladoras.

C. Titular significa exclusivamente quem vende na agência.

D. As condições gerais são irrelevantes para essa distinção.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** Os termos identificam posições contratuais, que podem ou não coincidir.

- **A:** Preserva a distinção.
- **B:** Não são funções do regulador.
- **C:** Venda não define titularidade.
- **D:** O instrumento justamente descreve os direitos.

Para recuperar: [2. Quem paga e quem tem os direitos](#partes).

</details>

### Questão 3

Seis pagamentos e doze meses de vigência foram informados. Após o sexto pagamento, o que cabe concluir?

A. Toda a vigência terminou automaticamente.

B. O resgate integral imediato é garantido.

C. Os prazos são necessariamente ilegais por serem diferentes.

D. Fim dos pagamentos e fim da vigência não são a mesma data; resgate depende das condições.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** A informação disponível não estabelece resgate imediato.

- **A:** Confunde calendários.
- **B:** Cria direito não informado.
- **C:** A fonte admite prazos distintos.
- **D:** Mantém o limite dos dados.

Para recuperar: [5. Pagar, manter e resgatar são momentos distintos](#prazos); [6. Exemplo resolvido: o fim dos pagamentos não basta](#exemplo-prazo).

</details>

### Questão 4

Na modalidade tradicional descrita, a restituição mínima do total pago ao final depende de:

A. ganhar obrigatoriamente um sorteio.

B. cumprir todos os pagamentos previstos nas datas programadas, segundo as condições.

C. resgatar antes da vigência terminar em qualquer data.

D. o produto virar conta de poupança.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** A condição acompanha a definição dessa modalidade.

- **A:** Prêmio não é a condição ensinada.
- **B:** Inclui o requisito omitido em generalizações.
- **C:** Muda o momento da restituição.
- **D:** A natureza do produto não se altera.

Para recuperar: [7. Tradicional e popular têm objetivos diferentes](#modalidades); [8. Exemplo resolvido: uma condição omitida muda a conclusão](#exemplo-modalidade).

</details>

### Questão 5

Qual afirmação é compatível com a modalidade popular ensinada?

A. A devolução final é inferior ao total pago; sorteios têm papel central.

B. Todo pagamento retorna integralmente por regra universal.

C. É idêntica à tradicional em todos os direitos.

D. O prêmio de sorteio é garantido a cada participante.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** A modalidade não tem a mesma restituição mínima da tradicional.

- **A:** Reconhece a característica relevante.
- **B:** Generaliza indevidamente.
- **C:** Apaga diferenças de finalidade e restituição.
- **D:** Participação não prova contemplação.

Para recuperar: [7. Tradicional e popular têm objetivos diferentes](#modalidades); [9. Possibilidade de prêmio não é rentabilidade certa](#sorteio).

</details>

### Questão 6

Ao comparar um título, alguém adiciona ao saldo um prêmio que ainda não ganhou. Qual erro comete?

A. Usa o valor certo de um prêmio já comprovado no caso.

B. Separa adequadamente risco e resultado.

C. Trata um evento incerto como recebimento garantido.

D. Aplica a regra de aniversário da poupança.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** Sorteio é possibilidade, não fluxo certo para todo participante.

- **A:** O caso diz que não ganhou.
- **B:** A soma elimina indevidamente a incerteza.
- **C:** Identifica o problema da comparação.
- **D:** O erro não é regra de poupança.

Para recuperar: [9. Possibilidade de prêmio não é rentabilidade certa](#sorteio).

</details>

### Questão 7

Na promoção declarada como modalidade incentivo, o resgate pertence à subscritora e o consumidor participa dos sorteios. O consumidor:

A. já ganhou todo o resgate automaticamente.

B. não deve ser tratado como titular de poupança no valor do resgate só por participar.

C. virou subscritor em qualquer hipótese.

D. ganhará obrigatoriamente o próximo sorteio.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** A modalidade permite distinguir os direitos do caso.

- **A:** Contraria a destinação informada.
- **B:** Evita confundir participação e resgate.
- **C:** O papel da empresa foi expressamente dado.
- **D:** Cria certeza inexistente.

Para recuperar: [9. Possibilidade de prêmio não é rentabilidade certa](#sorteio); [10. Exemplo resolvido: promoção com modalidade declarada](#exemplo-direitos).

</details>

### Questão 8

Para analisar título sem modalidade, tabela de resgate ou prazos informados, qual é o próximo passo?

A. Prometer restituição integral em qualquer data.

B. Usar automaticamente a regra da poupança.

C. Supor que todos os títulos têm as mesmas cotas.

D. Obter condições do produto antes de concluir disponibilidade e direitos.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** As informações ausentes são necessárias à leitura do produto.

- **A:** Inventa direito.
- **B:** Mistura categorias.
- **C:** Ignora percentuais e modalidades próprios.
- **D:** Identifica a lacuna correta.

Para recuperar: [5. Pagar, manter e resgatar são momentos distintos](#prazos); [12. Antes de comparar](#resumo).

</details>

## Fontes e limites editoriais

- [SUSEP — Apresentação da capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/explicacao): Fonte oficial consultada em 30/09/2026; regras do recorte identificado; Página modificada em 5/10/2022, consultada em 30/09/2026: participantes, cotas, provisão, prazos e condições gerais; consulta 2026-09-30.
- [SUSEP — Modalidades de capitalização](https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/modalidades): Fonte oficial consultada em 30/09/2026; regras do recorte identificado; Página modificada em 10/12/2024, consultada em 30/09/2026: distinção tradicional/popular e direitos nas modalidades; sem reproduzir numeração duplicada da página; consulta 2026-09-30.

- Sem percentuais mínimos, carências ou probabilidade de sorteio universal. Outras modalidades são apresentadas como fronteiras, sem alegar domínio integral de sua regulamentação.
- Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.
- Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico.
