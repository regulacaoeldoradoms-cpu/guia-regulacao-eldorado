# PC-11D — Seguros: risco coberto, prêmio e prestação

**Rascunho para revisão, não publicado.** Plano 66 reaproveitado; rascunho fora do catálogo, revisão independente e humana pendentes; Fase 2 sem aceite humano observado.

Fonte editorial: [pc-11d-v1.mjs](pc-11d-v1.mjs). Regenerar com `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=pc11d --render`.

Objetivo: Identificar a função do seguro e suas partes, distinguir prêmio de pagamento da seguradora e ler riscos e limites sem supor cobertura universal.

<a id="inicio"></a>

## 1. Proteger um interesse contra riscos definidos

Seguro organiza proteção de interesse legítimo do segurado ou beneficiário contra riscos predeterminados, mediante pagamento do prêmio e conforme o contrato e a lei. Interesse é a relação legítima com o que se quer proteger; risco é o evento incerto contemplado na cobertura. Contratar seguro não impede fisicamente que o evento ocorra: estabelece proteção nos termos pactuados. A referência normativa desta aula é a Lei 15.040/2024, já vigente na data da consulta. Não usar como atuais, sem conferir, dispositivos do Código Civil revogados por esse marco.

Base conceitual: [Lei 15.040/2024 — contrato de seguro](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm). Consulta: 30/09/2026.

<a id="partes"></a>

## 2. Seguradora, segurado e beneficiário

Seguradora é a entidade autorizada a assumir riscos em contrato de seguro. Segurado é a pessoa cujo interesse está protegido na relação; beneficiário é quem tem direito à prestação nas condições estabelecidas. Os papéis podem coincidir ou ser distintos. Corretor ou canal de venda não vira seguradora apenas por intermediar. Para entender o caso, localize quem assume a cobertura, qual interesse é protegido e a quem se destina a prestação, sem presumir que a agência que vendeu é responsável como seguradora.

Base conceitual: [Lei 15.040/2024 — contrato de seguro](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm). Consulta: 30/09/2026.

<a id="exemplo-partes"></a>

## 3. Exemplo resolvido: separar canal e responsável

Caso didático: uma seguradora autorizada emite contrato distribuído por uma agência; o interesse de Ana é protegido e o instrumento identifica o beneficiário aplicável. Passo 1: a seguradora assume a cobertura contratual. Passo 2: a agência é o canal informado, não automaticamente a seguradora. Passo 3: o destinatário do pagamento depende da posição prevista no contrato e do evento, não da pessoa que preencheu um formulário.

<a id="premio"></a>

## 4. Prêmio é o preço da proteção, não o dinheiro de um sorteio

No seguro, prêmio é o valor devido pela cobertura contratada. A prestação da seguradora é o cumprimento da obrigação quando cabível, podendo assumir a forma prevista no seguro. Em seguros de danos, fala-se com frequência em indenização; no seguro de pessoas, não se deve reduzir toda prestação a ressarcimento de uma nota de conserto. O mesmo termo “prêmio” tem outro uso em [capitalização](pc-11b-v1.md#sorteio), onde se refere ao resultado de sorteio. Contexto muda o significado.

Base conceitual: [Lei 15.040/2024 — contrato de seguro](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm). Consulta: 30/09/2026.

<a id="exemplo-premio"></a>

## 5. Exemplo resolvido: fluxo de pagamento

Hipótese: prêmio total de R$600 por uma cobertura, pago em doze parcelas de R$50. A soma é 12 × 50 = R$600. Isso é o preço informado da proteção, não o valor que a seguradora prometeu pagar em todo evento. Também não é uma conta de poupança do segurado. O exemplo não estabelece que toda modalidade de seguro tenha esse parcelamento ou custo.

<a id="cobertura"></a>

## 6. O risco precisa estar dentro da cobertura

A lei trata de riscos predeterminados: é preciso identificar quais eventos pertencem à cobertura. Exclusões devem ser descritas de modo claro e inequívoco, segundo o art. 9º. Saber que alguém tem “um seguro” não demonstra proteção contra toda causa de dano ou qualquer despesa. É preciso ler objeto, risco, período e condições. A apólice é o documento que formaliza informações do seguro; um slogan publicitário isolado não descreve necessariamente todas essas condições. O exemplo seguinte dá o enquadramento apenas para exercício conceitual.

Base conceitual: [Lei 15.040/2024 — contrato de seguro](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm). Consulta: 30/09/2026.

<a id="exemplo-cobertura"></a>

## 7. Exemplo resolvido: dois eventos, cobertura declarada

Contrato fictício válido cobre dano por incêndio e exclui, de forma clara e juridicamente aplicável no caso, dano exclusivamente por inundação. Cenário A é dano causado por incêndio durante a cobertura; cenário B é dano exclusivamente por inundação. O primeiro corresponde ao risco coberto descrito; o segundo, à exclusão dada. Ainda não calculamos pagamento: limites e demais condições também precisam ser conhecidos. Não concluímos que todo seguro residencial tenha essas coberturas ou exclusões.

<a id="limites"></a>

## 8. Limite informado não é pagamento automático

Limite da cobertura é um teto ou parâmetro contratual aplicável, não uma promessa de pagar esse valor em qualquer evento. A prestação depende do seguro, do evento e das demais condições válidas. Não confunda custo do prêmio com extensão da cobertura: pagar prêmio maior não prova, por si, cobertura de qualquer risco. Franquias, carências e procedimentos de apuração têm regras próprias; esta aula não fornece fórmula universal nem prazo de regulação de sinistro.

Base conceitual: [Lei 15.040/2024 — contrato de seguro](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm). Consulta: 30/09/2026.

<a id="exemplo-limite"></a>

## 9. Exemplo resolvido: insuficiência de dados

Um resumo informa limite de R$10.000, mas não descreve evento, cobertura acionada ou demais condições. A pergunta é se a seguradora necessariamente deve pagar R$10.000 agora. Não: há apenas um limite informado, sem demonstração do fato que daria origem à prestação ou de seu valor. A conclusão correta é identificar os dados ausentes. Um limite não é saldo resgatável de uma aplicação.

<a id="comparar"></a>

## 10. Comparar proteção exige o mesmo recorte

Para comparar dois seguros, confira riscos cobertos, exclusões, interesse protegido, limite e período, além do prêmio e outras condições. Dois preços diferentes podem corresponder a proteções diferentes. Ausência de evento coberto não significa, por si só, que o prêmio pago em seguro de risco deva ser devolvido: ele remunerou a proteção contratada, segundo o regime aplicável. Existem produtos de pessoas com componentes e regras próprias, como o [VGBL](pc-11c-v1.md#natureza); não universalize o caso de um seguro de risco para todo produto chamado seguro.

Base conceitual: [Lei 15.040/2024 — contrato de seguro](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm). Consulta: 30/09/2026.

<a id="glossario"></a>

## 11. Vocabulário de recuperação

Risco: evento incerto abrangido ou excluído nos termos aplicáveis. Cobertura: proteção contratada. Prêmio: preço do seguro. Prestação: cumprimento devido pela seguradora quando cabível. Sinistro: ocorrência do evento relacionado ao risco descrito, cuja cobertura e efeitos precisam ser apurados. Exclusão: hipótese fora da cobertura, sujeita a requisitos legais. Limite: parâmetro/teto aplicável, não pagamento automático.

<a id="resumo"></a>

## 12. Leia a proteção antes do preço

Identifique a seguradora e as demais partes. Separe prêmio e prestação. Leia interesse, riscos, exclusões e período. Reconheça o limite sem inventar pagamento. A proteção decorre da combinação de contrato e lei, não do nome genérico ou de uma promessa de que nada poderá acontecer.

## Recordação e recuperação

- Diga quem paga o prêmio e em que sentido ele difere da prestação da seguradora.
- Volte ao exemplo de incêndio/inundação se confundiu risco, exclusão e limite.
- Explique quais dados faltam para transformar um limite informado em um pagamento efetivamente devido.

## Prática comentada

Todos os casos são fictícios. Tente responder antes de abrir cada comentário.

### Questão 1

Qual é o papel do prêmio em um seguro de risco?

A. É o prêmio de sorteio ganho pelo segurado.

B. É o valor devido pela cobertura contratada.

C. É necessariamente o teto da indenização.

D. É sempre saldo integralmente resgatável em qualquer momento.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** No seguro, o termo identifica o preço da cobertura.

- **A:** Confunde com o uso do termo em capitalização.
- **B:** Distingue o pagamento pela proteção.
- **C:** Teto e preço são informações distintas.
- **D:** Seguro de risco não é conta de poupança.

Para recuperar: [4. Prêmio é o preço da proteção, não o dinheiro de um sorteio](#premio); [5. Exemplo resolvido: fluxo de pagamento](#exemplo-premio).

</details>

### Questão 2

A agência distribui contrato emitido por seguradora autorizada. Só esse fato permite dizer que:

A. a agência sempre substituiu a seguradora.

B. qualquer funcionário é o beneficiário.

C. não há responsável contratual.

D. o canal de venda não se confunde automaticamente com a seguradora que assume a cobertura.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** É preciso identificar os papéis dados pelo instrumento.

- **A:** Inventa mudança de parte.
- **B:** A função profissional não define beneficiário.
- **C:** A seguradora foi identificada.
- **D:** Mantém a distinção necessária.

Para recuperar: [2. Seguradora, segurado e beneficiário](#partes); [3. Exemplo resolvido: separar canal e responsável](#exemplo-partes).

</details>

### Questão 3

Prêmio total dado: doze parcelas de R$50. Qual leitura é correta?

A. R$600 de prêmio, sem provar o valor de uma futura prestação da seguradora.

B. R$50 de prêmio total e indenização obrigatória de R$600.

C. R$600 são necessariamente saldo de poupança.

D. R$600 garantem cobertura de qualquer risco.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** A soma é preço; extensão e prestação da proteção exigem outras informações.

- **A:** Calcula e mantém o limite da conclusão.
- **B:** Troca parcela por total e inventa pagamento.
- **C:** Muda a natureza do produto.
- **D:** Preço não define cobertura universal.

Para recuperar: [5. Exemplo resolvido: fluxo de pagamento](#exemplo-premio); [8. Limite informado não é pagamento automático](#limites).

</details>

### Questão 4

Caso válido declara cobertura de incêndio e exclusão clara/aplicável de inundação. Dano exclusivamente por inundação corresponde a:

A. cobertura universal implícita.

B. indenização automática no teto.

C. hipótese excluída no caso, sem generalizar a outros seguros.

D. prova de que todos os seguros são idênticos.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** A resposta usa o enquadramento expressamente dado.

- **A:** Apaga a exclusão.
- **B:** Não há essa obrigação automática.
- **C:** Respeita o caso e o âmbito.
- **D:** Coberturas e condições podem diferir.

Para recuperar: [6. O risco precisa estar dentro da cobertura](#cobertura); [7. Exemplo resolvido: dois eventos, cobertura declarada](#exemplo-cobertura).

</details>

### Questão 5

Resumo de seguro informa apenas limite de R$10.000. O que falta para concluir pagamento devido agora?

A. Evento, cobertura acionada e condições aplicáveis; o limite sozinho não basta.

B. Nada, basta o teto existir.

C. Só saber a cor do documento.

D. A vontade de tratar limite como saldo de conta.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** Teto e ocorrência da obrigação de prestar são diferentes.

- **A:** Identifica os dados relevantes ausentes.
- **B:** Transforma limite em dívida automática.
- **C:** Informação irrelevante ao enquadramento.
- **D:** Não altera o contrato ou a lei.

Para recuperar: [8. Limite informado não é pagamento automático](#limites); [9. Exemplo resolvido: insuficiência de dados](#exemplo-limite).

</details>

### Questão 6

Dois seguros têm prêmios diferentes. Qual comparação é adequada?

A. Escolher sempre o mais caro como universalmente completo.

B. Conferir riscos, exclusões, limites e período, além do preço.

C. Supor coberturas iguais sem ler.

D. Ignorar exclusões porque nunca têm relevância jurídica.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** Proteções diferentes não são comparáveis apenas pelo preço.

- **A:** Preço não demonstra cobertura universal.
- **B:** Compara a proteção concreta.
- **C:** Presume o que precisa verificar.
- **D:** A lei disciplina exclusões, não as torna inexistentes.

Para recuperar: [10. Comparar proteção exige o mesmo recorte](#comparar); [6. O risco precisa estar dentro da cobertura](#cobertura).

</details>

### Questão 7

Seguro de risco permaneceu vigente sem ocorrência de evento coberto. Qual afirmação indevida deve ser evitada?

A. A proteção existiu nos termos contratados.

B. Prêmio e indenização são distintos.

C. É preciso observar o regime do produto.

D. Todo prêmio deve ser devolvido automaticamente só porque não houve sinistro.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** Ausência de sinistro não transforma por si só prêmio em depósito resgatável.

- **A:** É compatível com a finalidade.
- **B:** É a distinção central.
- **C:** Evita generalizar entre produtos.
- **D:** Cria devolução universal não ensinada.

Para recuperar: [10. Comparar proteção exige o mesmo recorte](#comparar).

</details>

### Questão 8

Sobre a referência normativa desta aula em 30/09/2026, qual atitude é correta?

A. Tratar todo artigo antigo do Código Civil sobre seguro como vigente sem conferir revogação.

B. Ignorar a lei porque existe contrato.

C. Usar o marco vigente indicado e conferir âmbito, contrato e lei ao analisar uma regra.

D. Presumir que uma regra de seguro vale para qualquer produto bancário.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** A versão normativa e o âmbito fazem parte da leitura responsável.

- **A:** Pode usar norma revogada.
- **B:** Contrato não elimina a disciplina legal.
- **C:** Conserva versão e enquadramento.
- **D:** Mistura categorias jurídicas distintas.

Para recuperar: [1. Proteger um interesse contra riscos definidos](#inicio); [12. Leia a proteção antes do preço](#resumo).

</details>

## Fontes e limites editoriais

- [Lei 15.040/2024 — contrato de seguro](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm): Fonte oficial consultada em 30/09/2026; regras do recorte identificado; Arts. 1º–2º, 4º, 9º e 133–134; marco legal vigente no momento da consulta, após vacância de um ano da publicação; consulta 2026-09-30.

- Recorte conceitual com Lei 15.040/2024; não ensina procedimentos de sinistro, prazos, franquias, carências, seguros obrigatórios ou todos os ramos.
- Casos declaram a validade/enquadramento apenas para exercício; não validam cláusulas reais nem recomendam contratação.
- Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.
- Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico.
