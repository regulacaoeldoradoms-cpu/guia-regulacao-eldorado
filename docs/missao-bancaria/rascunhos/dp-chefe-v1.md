# DP-CHEFE — Chefe de Pagamentos Digitais: identifique papéis, etapas e limites

**Rascunho para revisão, não publicado.** Doze itens próprios redigidos conforme documento 86; revisão pedagógica independente e publicação pendentes; fora do catálogo.

Fonte editorial: [dp-chefe-v1.mjs](dp-chefe-v1.mjs). Regenerar com `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=dpchefe --render`.

Objetivo: Integrar doze casos próprios de pagamentos digitais, explicando as hipóteses e retomando o ensino de origem.

<a id="preparacao"></a>

## 1. Ensino antes do desafio

As aulas [DP-01](dp-01-v1.md), [DP-02](dp-02-v1.md), [DP-03](dp-03-v1.md), [DP-04](dp-04-v1.md), [DP-05](dp-05-v1.md), [DP-06](dp-06-v1.md), [DP-07](dp-07-v1.md), [DP-08](dp-08-v1.md), [DP-09](dp-09-v1.md), [DP-10](dp-10-v1.md), [DP-11](dp-11-v1.md), [DP-12](dp-12-v1.md) e a [revisão DP-R](dp-r-v1.md) ensinam os conceitos cobrados. Leia os trechos de origem antes de usar o comentário de uma questão. Os casos são fictícios, sem operação real, preço atual ou dado do aluno.

<a id="roteiro"></a>

## 2. Seis grupos para organizar a leitura

Itens 1–2: canal, processo, modelo e estado. Itens 3–4: rótulo, estrutura financeira e risco. Itens 5–6: regras de pagamento, instrução e compartilhamento. Itens 7–8: tecnologia, direito, emissor e estágio. Itens 9–10: papéis no atendimento e na oferta, comissão e repasse. Itens 11–12: necessidade do grupo, finalidade dos dados e indicador realmente observado. Não inferir um resultado além do caso.

<a id="exemplo-metodo"></a>

## 3. Exemplo resolvido: uma anotação não é todo o resultado

Uma anotação fictícia diz apenas “informação enviada”. Primeiro, pergunte qual informação e para quem. Segundo, identifique se a ação foi compartilhamento de dados, pedido de análise ou outra etapa. Terceiro, verifique se foi descrita uma conclusão. Sem essas informações, o envio não prova pagamento, concessão de crédito ou resolução de dúvida. Nos itens seguintes, use os papéis e estados efetivamente informados.

<a id="glossario"></a>

## 4. Termos para conferir

Canal: forma de interação. Processo: etapas e decisões. Modelo: organização de valor, participantes e remuneração. Liquidez: capacidade de obter caixa. Arranjo: regras de um serviço de pagamento. Escopo: dados, destinatário e período autorizados. Registro: representação de informações, sem provar todo fato externo. Contratante: instituição por conta da qual atua o correspondente. Repasse: valor transferido conforme as deduções descritas, distinto de lucro. Indicador: medida de uma etapa ou resultado definido.

<a id="recuperacao"></a>

## 5. Recuperar a confusão

Tente responder e justificar antes de ler os comentários. Se errar, nomeie a troca de papel, etapa, base de cálculo ou conclusão; retome as seções de origem e reconstrua o exemplo. Explique por que os outros três caminhos não atendem ao caso. Estes itens ficam expostos na prática e não são avaliação independente. Acerto ou conclusão não comprovam retenção duradoura nem prontidão de prova.

## Recordação e recuperação

- Explique quem faz o quê e qual etapa foi comprovada.
- Separe tecnologia, natureza, direitos e resultado.
- Refaça o cálculo e declare seu denominador e suas hipóteses.

## Prática comentada

Todos os casos são fictícios. Tente responder antes de abrir cada comentário.

### Questão 1

O banco fictício Aurora permite enviar pelo navegador um pedido antes entregue no balcão. O caso informa que as etapas internas permanecem iguais e mostra “documentação recebida, análise pendente”. Qual conclusão reúne corretamente mudança e estado?

A. O processo inteiro foi automatizado e o pedido aprovado.

B. O canal de entrada mudou; a documentação foi recebida, mas a análise ainda não terminou.

C. O uso de navegador transformou a conta em outra categoria jurídica.

D. A análise deixou de existir porque o cliente não foi ao balcão.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** Separa a forma de entrada do resultado efetivamente informado.

- **A:** Acrescenta automação integral e aprovação, ambas ausentes.
- **B:** Separa a forma de entrada do resultado efetivamente informado.
- **C:** A natureza da conta não decorre apenas do canal.
- **D:** Contradiz a informação expressa de análise pendente.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-01: 4. O verbo e o estado da operação importam](dp-01-v1.md#estados); [DP-02: 2. Exemplo resolvido: a porta de entrada](dp-02-v1.md#ex-canal).

### Questão 2

Duas plataformas fictícias têm telas semelhantes. Uma cobra assinatura do usuário; a outra recebe remuneração por serviços concluídos para empresas parceiras. Nenhum preço, custo ou resultado de solicitação foi informado. Qual análise é sustentada?

A. Telas semelhantes tornam os modelos econômicos idênticos.

B. Receber por serviço concluído garante que toda solicitação será concluída.

C. Assinatura é sempre mais cara, mesmo sem preços.

D. As formas de remuneração diferem; não há dados para escolher a mais vantajosa nem garantir conclusão.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** Reconhece a diferença descrita e preserva os limites do caso.

- **A:** Confunde interface e organização econômica.
- **B:** A regra de remuneração não garante o resultado de cada pedido.
- **C:** A comparação exige condições e valores não apresentados.
- **D:** Reconhece a diferença descrita e preserva os limites do caso.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-01: 1. Cinco perguntas antes da resposta](dp-01-v1.md#camadas); [DP-02: 5. Modelo: participantes, necessidade e remuneração](dp-02-v1.md#modelo); [DP-02: 9. Promessa, dado e conclusão](dp-02-v1.md#evidencia).

### Questão 3

Uma empresa desenvolve tecnologia para inovar em serviços financeiros de um intermediário não bancário. O intermediário promete resgates curtos e mantém ativos que geram caixa muito depois. Qual leitura é adequada?

A. A atuação tecnológica financeira pode ser descrita como fintech; o descompasso de prazos/liquidez do intermediário ainda precisa ser analisado.

B. O rótulo fintech transforma todos os ativos em dinheiro disponível imediatamente.

C. Ser não bancário prova que o intermediário atua ilegalmente.

D. A tecnologia comprova enquadramento legal completo como startup e elimina o risco de resgate.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** Distingue característica da empresa tecnológica e estrutura de risco do intermediário.

- **A:** Distingue característica da empresa tecnológica e estrutura de risco do intermediário.
- **B:** Tecnologia não muda automaticamente prazo ou liquidez dos ativos.
- **C:** O canal não bancário não prova ilegalidade.
- **D:** Nem todos os requisitos legais nem a eliminação do risco foram demonstrados.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-03: 1. Três termos, perguntas diferentes](dp-03-v1.md#dimensoes); [DP-03: 7. O rótulo não substitui a atividade](dp-03-v1.md#rotulos); [DP-04: 3. Prazo e liquidez](dp-04-v1.md#liquidez).

### Questão 4

Uma entidade fictícia aplica R$100 em ativos, financiados por R$30 próprios e R$70 de dívida. Os ativos depois valem R$88, e a dívida permanece R$70. Sem qualquer outro ativo, obrigação, custo ou receita, qual cálculo e conclusão são corretos?

A. Restam R$88 próprios, pois a dívida não entra nessa conta.

B. Restam R$30 próprios, pois tecnologia financeira impede perda.

C. Restam R$18 próprios: a perda de R$12 equivale a 40% do capital inicial, ilustrando o efeito da alavancagem.

D. Restam R$70 próprios e a perda foi necessariamente ilegal.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** 88 − 70 = 18; 30 − 18 = 12; 12 ÷ 30 = 40%. A dívida amplia o efeito relativo da perda sobre os recursos próprios.

- **A:** R$88 é o ativo; é preciso deduzir R$70 de obrigação.
- **B:** O rótulo tecnológico não garante preservação do capital.
- **C:** 88 − 70 = 18; 30 − 18 = 12; 12 ÷ 30 = 40%. A dívida amplia o efeito relativo da perda sobre os recursos próprios.
- **D:** Troca dívida por capital próprio e acrescenta conclusão jurídica sem base.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-03: 7. O rótulo não substitui a atividade](dp-03-v1.md#rotulos); [DP-04: 5. Recursos próprios e dívida](dp-04-v1.md#alavancagem); [DP-04: 6. Exemplo resolvido: perda sobre recursos próprios](dp-04-v1.md#ex-alavancagem).

### Questão 5

Uma instituição participa de um arranjo de pagamento e seu aplicativo confirma apenas “Pix agendado para amanhã”. Qual conclusão combina a função do arranjo e a etapa informada?

A. O arranjo é a própria conta do cliente e o valor já chegou ao recebedor.

B. O arranjo fornece regras do serviço; o agendamento não comprova liquidação imediata.

C. Participar do arranjo garante saldo suficiente em todas as contas.

D. Qualquer agendamento representa empréstimo concedido pelo Banco Central.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** Separa as regras comuns da instrução para data futura.

- **A:** Confunde regras, conta e resultado da operação.
- **B:** Separa as regras comuns da instrução para data futura.
- **C:** A participação não demonstra saldo de cada cliente.
- **D:** O caso não descreve concessão de crédito.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-05: 3. Arranjo é um conjunto de regras](dp-05-v1.md#arranjo); [DP-06: 5. Agendar é instruir para depois](dp-06-v1.md#agendamento); [DP-06: 6. Exemplo resolvido: hoje e amanhã](dp-06-v1.md#ex-agenda).

### Questão 6

No cenário fictício, uma instituição participante de serviços de pagamento recebe autorização para acessar um conjunto de dados do cliente mantidos em outra instituição por um período informado. Nenhuma ordem de pagamento foi dada. O que se pode concluir?

A. Todas as instituições passaram a acessar qualquer dado.

B. Participar de serviços de pagamento torna o acesso uma transferência concluída.

C. A autorização garante concessão de crédito com a menor taxa.

D. Houve permissão de compartilhamento no escopo descrito, sem comprovação de pagamento ou garantia de crédito.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** Respeita o escopo autorizado e distingue informação de movimentação.

- **A:** A permissão tem destinatário, conteúdo e período delimitados.
- **B:** O papel da instituição não transforma acesso a dados em ordem ou liquidação.
- **C:** Informação adicional pode apoiar avaliação, sem garantir a oferta.
- **D:** Respeita o escopo autorizado e distingue informação de movimentação.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-05: 5. Quem faz o quê?](dp-05-v1.md#participantes); [DP-07: 3. O que conferir na autorização](dp-07-v1.md#controle); [DP-07: 5. Conhecer melhor não é prometer aprovação](dp-07-v1.md#oferta); [DP-07: 7. Informação e movimentação são ações diferentes](dp-07-v1.md#pagamento).

### Questão 7

Uma representação digital de direito privado usa registro distribuído. Um anúncio conclui: “por usar essa tecnologia, é moeda digital de banco central e terá valorização garantida”. Qual avaliação está correta?

A. Tecnologia de registro, natureza do direito e emissor precisam ser distinguidos; o anúncio não demonstra CBDC nem retorno garantido.

B. Qualquer registro distribuído é necessariamente emitido pelo Banco Central.

C. Preservar um registro garante que o preço do direito sempre aumenta.

D. Direito privado, Pix e CBDC são a mesma categoria por serem digitais.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** Evita atribuir propriedades monetárias ou financeiras apenas ao registro.

- **A:** Evita atribuir propriedades monetárias ou financeiras apenas ao registro.
- **B:** Distribuição do registro não identifica o emissor da moeda.
- **C:** Integridade do registro não determina valor futuro.
- **D:** As funções e naturezas ensinadas são distintas.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-08: 5. Tecnologia não é o próprio ativo](dp-08-v1.md#ativos); [DP-08: 7. Registro e investimento são perguntas distintas](dp-08-v1.md#risco); [DP-09: 1. Emissor e função vêm antes da tecnologia](dp-09-v1.md#cbdc); [DP-09: 2. Exemplo resolvido: três descrições](dp-09-v1.md#ex-distincao).

### Questão 8

Um projeto hipotético futuro prevê acesso por instituição autorizada e uma transação que condiciona entrega de um direito digital ao pagamento correspondente. Ainda não há confirmação de disponibilidade pública. Qual leitura respeita o desenho informado?

A. Toda pessoa já tem conta direta no Banco Central e acesso à função.

B. A programação garante a verdade de qualquer fato externo e elimina todo risco.

C. O desenho mantém intermediação e pode reduzir o risco de entrega sem contrapartida; não prova disponibilidade pública nem ausência de outros riscos.

D. Uma proposta de funcionalidade equivale a pagamento já realizado.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** Reconhece a condição proposta sem extrapolar emissor, estágio ou segurança.

- **A:** Apaga a intermediação e inventa disponibilidade.
- **B:** Validação de registros não verifica automaticamente o mundo externo nem elimina todos os riscos.
- **C:** Reconhece a condição proposta sem extrapolar emissor, estágio ou segurança.
- **D:** Uma descrição futura não comprova uma operação concreta.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-08: 2. Exemplo resolvido: registrar não é verificar o mundo](dp-08-v1.md#ex-registro); [DP-09: 3. Atacado e varejo não são a mesma relação](dp-09-v1.md#intermediacao); [DP-09: 6. Exemplo resolvido: entrega contra pagamento](dp-09-v1.md#ex-condicoes); [DP-09: 7. Proposta não é serviço público já disponível](dp-09-v1.md#estagio).

### Questão 9

Numa plataforma fictícia, a oferta identifica a loja Norte como vendedora. Separadamente, um correspondente do Banco Vale recebe uma proposta de crédito e a encaminha à análise ainda pendente do banco. Qual conjunto de papéis e etapas está correto?

A. A plataforma é obrigatoriamente a vendedora e o correspondente já concedeu o crédito.

B. Norte é a vendedora informada; o correspondente encaminhou a proposta, sem comprovar concessão, e a contratante mantém a responsabilidade pelo atendimento nos termos estudados.

C. O banco não tem responsabilidade pelo atendimento porque outra empresa recebeu a proposta.

D. O vendedor, a plataforma e o correspondente tornam-se a mesma entidade por aparecerem no fluxo.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** Preserva as atribuições explícitas, a análise pendente e a responsabilidade da contratante pelo atendimento.

- **A:** Contradiz o vendedor identificado e transforma o envio da proposta em concessão.
- **B:** Preserva as atribuições explícitas, a análise pendente e a responsabilidade da contratante pelo atendimento.
- **C:** Terceirizar o atendimento não afasta essa responsabilidade.
- **D:** Um fluxo com vários participantes não elimina seus papéis.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-10: 5. Encaminhar não é conceder](dp-10-v1.md#propostas); [DP-10: 3. Contratar não elimina responsabilidade](dp-10-v1.md#responsabilidade); [DP-11: 1. Uma vitrine com mais de um ofertante](dp-11-v1.md#plataforma); [DP-11: 3. Vender, aproximar e pagar são funções diferentes](dp-11-v1.md#papeis).

### Questão 10

Uma loja correspondente do Banco Vale também vende seus próprios produtos em um marketplace. Nessa venda, o preço é R$300 e a plataforma retém comissão de 4% sobre esse preço, sem outras deduções do repasse. A venda não é serviço prestado por conta do banco. Qual análise é correta?

A. A comissão é R$4 e tudo que a loja vende vira serviço bancário.

B. A plataforma recebe R$12 de lucro líquido comprovado, mesmo sem conhecer seus custos.

C. O Banco Vale é necessariamente o vendedor e recebe R$288.

D. A comissão é R$12 e o repasse é R$288 antes dos demais custos da loja; ser correspondente em outra atividade não transforma essa venda em serviço bancário.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** 300 × 0,04 = 12; 300 − 12 = 288. Os papéis são interpretados conforme a atividade descrita.

- **A:** 4% é uma proporção de 300, não R$4 fixos; o papel depende da atividade.
- **B:** R$12 é receita de comissão no caso, sem dados para apurar lucro líquido.
- **C:** O enunciado identifica venda própria da loja e exclui atuação por conta do banco.
- **D:** 300 × 0,04 = 12; 300 − 12 = 288. Os papéis são interpretados conforme a atividade descrita.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-10: 1. Quem atende e por conta de quem?](dp-10-v1.md#papel); [DP-11: 5. Como a plataforma se remunera?](dp-11-v1.md#remuneracao); [DP-11: 6. Exemplo resolvido: comissão expressamente definida](dp-11-v1.md#ex-comissao).

### Questão 11

Para organizar uma explicação, um grupo declara preferência por texto e outro por conversa. A equipe passa a registrar essa preferência para a finalidade informada. Qual raciocínio é adequado no recorte da aula?

A. Usar a necessidade declarada para orientar a interação, sem supor que todos do grupo sejam iguais ou dispensar finalidade, necessidade e base legal aplicável.

B. A preferência de formato prova renda, habilidade e toda necessidade futura de cada pessoa.

C. A existência de um grupo autoriza coletar qualquer informação que talvez seja útil depois.

D. Consentimento é sempre a única base possível para qualquer tratamento de dados.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** Relaciona critério relevante e atendimento, mantendo os limites do agrupamento e do uso de dados.

- **A:** Relaciona critério relevante e atendimento, mantendo os limites do agrupamento e do uso de dados.
- **B:** Extrapola uma característica para toda a pessoa e para situações futuras.
- **C:** Interesse eventual não substitui finalidade e necessidade.
- **D:** A LGPD prevê outras hipóteses; a base aplicável exige consideração do caso.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario).

</details>

Aula de origem: [DP-12: 1. Agrupar para compreender necessidades](dp-12-v1.md#segmentos); [DP-12: 4. Exemplo resolvido: preferência informada](dp-12-v1.md#ex-canal); [DP-12: 5. Dados têm finalidade e limites](dp-12-v1.md#dados).

### Questão 12

Após uma mensagem, 40 usuários responderam a uma pesquisa e 16 desses respondentes declararam que a dúvida foi resolvida. Não há dados sobre os demais usuários. Um aluno afirma que 40% de toda a população atendida teve sua dúvida resolvida. Qual correção enfrenta o erro?

A. Substituir 16 por 40 e concluir resolução universal.

B. Tratar cada resposta como aprovação automática de produto.

C. 16 ÷ 40 = 40% dos respondentes relataram resolução; falta base para estender o resultado a todos os usuários.

D. Descartar a definição do indicador e contar apenas mensagens enviadas.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** Corrige o denominador e limita a conclusão ao grupo observado e ao relato medido.

- **A:** A quantidade de respostas não equivale a quantidade de resoluções.
- **B:** A pesquisa não avalia aprovação de produto.
- **C:** Corrige o denominador e limita a conclusão ao grupo observado e ao relato medido.
- **D:** Mudar a contagem não resolve a extrapolação nem mede o resultado pretendido.

Para recuperar: [2. Seis grupos para organizar a leitura](#roteiro); [4. Termos para conferir](#glossario); [5. Recuperar a confusão](#recuperacao).

</details>

Aula de origem: [DP-12: 7. Medir a etapa certa](dp-12-v1.md#indicadores); [DP-12: 8. Exemplo resolvido: resultado limitado](dp-12-v1.md#ex-metrica); [DP-12: Recuperação e síntese](dp-12-v1.md#resumo).

## Fontes e limites editoriais

- [BCB — Conta bancária (corrente ou poupança)](https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-de-depositos): FAQ atualizada em 26/03/2024; consultada em 30/09/2026; Resposta oficial completa no recorte indicado; consulta 2026-09-30.
- [BCB — Conta digital ou eletrônica](https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-digital-ou-eletronica): FAQ atualizada em 26/03/2024; consultada em 30/09/2026; Resposta oficial completa no recorte indicado; consulta 2026-09-30.
- [BCB — Tipos de conta de pagamento](https://www.bcb.gov.br/meubc/faqs/p/quais-sao-os-tipos-de-conta-de-pagamento): FAQ atualizada em 31/01/2023; consultada em 30/09/2026; Resposta oficial completa no recorte indicado; consulta 2026-09-30.
- [CAIXA — App CAIXA e Internet Banking CAIXA](https://www.caixa.gov.br/atendimento/canais-digitais/app-caixa-internet-banking/Paginas/default.aspx): Página institucional consultada em 01/10/2026, 01:50 UTC; O que são os canais e exemplos de serviços; sem reproduzir procedimentos, limites ou versão Beta; consulta 2026-10-01.
- [BCB — Fintechs](https://www.bcb.gov.br/estabilidadefinanceira/fintechs): Página institucional; consulta em 01/10/2026, 01:43 UTC; Definição introdutória e benefícios possíveis; não reutilizar limites ou referências normativas de outras seções; consulta 2026-10-01.
- [LC 182/2021 — Startups](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp182.htm): Texto oficial consultado; sem ensino de limites numéricos; Art. 4º: conceito e requisitos adicionais para enquadramento; consulta 2026-10-01.
- [BIS — Big tech in finance](https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks): Annual Economic Report 2019, capítulo III; Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais; consulta 2026-10-01.
- [FSB — Non-Bank Financial Intermediation](https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/): Página oficial consultada em 01/10/2026; Introdução e Monitoring: universo amplo, subconjunto de riscos, liquidez/prazos/alavancagem; consulta 2026-10-01.
- [BCB — Sistema de Pagamentos Brasileiro](https://www.bcb.gov.br/estabilidadefinanceira/spb): Página oficial consultada em 01/10/2026; Infraestruturas, arranjos e participantes; consulta 2026-10-01.
- [BCB — Arranjos de pagamento](https://www.bcb.gov.br/estabilidadefinanceira/arranjospagamento): Página oficial consultada em 01/10/2026; Conceito e distinção entre arranjo, participantes e instituições; consulta 2026-10-01.
- [BCB — Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix): Página oficial consultada em 01/10/2026; Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais; consulta 2026-10-01.
- [BCB — Open Finance](https://www.bcb.gov.br/estabilidadefinanceira/openfinance): Página oficial consultada em 01/10/2026; Escolha de dados/destinatário/prazo, cancelamento e benefícios possíveis; consulta 2026-10-01.
- [NIST — Blockchain Technology Overview](https://csrc.nist.gov/pubs/ir/8202/final): NIST IR 8202, versão final de outubro de 2018; Resumo executivo e seção 2: registro, consenso e redes permissionadas/abertas; consulta 2026-10-01.
- [Lei 14.478/2022 — Ativos virtuais](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm): Texto oficial consultado em 01/10/2026; Art. 3º e exclusões; art. 1º parágrafo único; sem regime atual de autorização das prestadoras; consulta 2026-10-01.
- [BCB — Drex](https://www.bcb.gov.br/estabilidadefinanceira/drex): Página oficial consultada em 01/10/2026; Proposta de plataforma integrada e intermediação; sem data de lançamento ou acesso público presumido; consulta 2026-10-01.
- [BCB — FAQ Drex](https://www.bcb.gov.br/meubc/faqs/p/drex): FAQ com atualização exibida de 16/10/2023; CBDC; distinção entre emissão de atacado pelo BC e representações de varejo por instituições autorizadas; consulta 2026-10-01.
- [BCB — FAQ Lançamento do Drex](https://www.bcb.gov.br/meubc/faqs/p/lancamento-do-drex): FAQ com atualização exibida de 20/02/2024; consultada em 01/10/2026; Página mantém ausência de data específica; não é confirmação independente do estágio de todas as etapas; consulta 2026-10-01.
- [CMN — Resolução 4.935/2021](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935): Versão vigente exibida pelo BCB, atualizada em 01/12/2025; Arts. 2º, 3º, 12 e 14: atuação contratada, responsabilidade e identificação; art. 8º revogado não utilizado; consulta 2026-10-01.
- [Lei 13.709/2018 — LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm): Texto oficial consultado em 01/10/2026; Art. 6º: finalidade, adequação, necessidade e não discriminação; art. 7º: bases legais; consulta 2026-10-01.

- Itens expostos de integração introdutória; não constituem avaliação independente ou simulado integral de edital.
- Fontes e ensino de 01/10/2026 reaproveitados, sem nova afirmação sobre estágio atual do Drex; revalidar antes de publicação.
- Casos próprios fictícios; sem dados reais, oferta, tarifa atual ou operação em produção.
- Marketplace/segmentação têm correspondência nominal BB; não atribuir cobertura nominal CAIXA.
- Sem XP, ordem ou ativação. Aceite humano da Fase 2 não observado.
