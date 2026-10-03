# DP-R — Revisão cumulativa de pagamentos digitais

**Rascunho para revisão, não publicado.** Autoria concluída; revisão pedagógica independente pendente; fora do catálogo.

Fonte editorial: [dp-r-v1.mjs](dp-r-v1.mjs). Regenerar com `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=dpr --render`.

Objetivo: Integrar canal, processo, atividade e instituição sem inferências indevidas.

<a id="mapa"></a>

## 1. Quatro perguntas para integrar

Antes de classificar, pergunte: qual necessidade está descrita, quem exerce cada função, qual operação ou informação está em jogo e que resultado foi comprovado? DP-01/02 separam canal e transformação; DP-03/04 distinguem empresas, atividades e estruturas financeiras. Uma aparência digital não resolve essas perguntas.

<a id="ex-integrado"></a>

## 2. Exemplo resolvido: interface e risco

Uma fintech fictícia fornece tecnologia a um intermediário não bancário. O intermediário, no caso, mantém ativos longos e oferece resgates curtos. O rótulo fintech descreve a atuação tecnológica financeira; o descompasso deve ser analisado na estrutura do intermediário. Trocar o nome da interface não elimina esse risco.

Base conceitual: [BCB — Fintechs](https://www.bcb.gov.br/estabilidadefinanceira/fintechs); [FSB — Non-Bank Financial Intermediation](https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/). Consulta: 01/10/2026.

<a id="fluxos"></a>

## 3. Instrução e execução

SPB e arranjos organizam infraestruturas e regras. Pix é um sistema de pagamento; agendamento é uma instrução futura. Correspondentes atendem por conta da contratante e podem encaminhar propostas. Em cada situação, o verbo importa: receber, autorizar, encaminhar e concluir não têm o mesmo significado.

Base conceitual: [BCB — Sistema de Pagamentos Brasileiro](https://www.bcb.gov.br/estabilidadefinanceira/spb); [BCB — Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix); [CMN — Resolução 4.935/2021](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935). Consulta: 01/10/2026.

<a id="ex-etapas"></a>

## 4. Exemplo resolvido: duas pendências

Um aplicativo confirma um agendamento para o dia seguinte. No mesmo cenário, um correspondente informa que encaminhou uma proposta de crédito para análise. Há duas ações realizadas: agendar e encaminhar. Não há evidência de recebimento do pagamento nem de concessão do crédito.

<a id="dados-ativos"></a>

## 5. Compartilhar e representar

No Open Finance, a autorização de dados é delimitada; ela não torna toda transferência autorizada. Blockchain é tecnologia de registro, enquanto o ativo representado possui natureza e direitos próprios. CBDC e ativo privado não se igualam pela forma digital. Proposta de funcionalidade não comprova disponibilidade pública.

Base conceitual: [BCB — Open Finance](https://www.bcb.gov.br/estabilidadefinanceira/openfinance); [NIST — Blockchain Technology Overview](https://csrc.nist.gov/pubs/ir/8202/final); [Lei 14.478/2022 — Ativos virtuais](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm); [BCB — Drex](https://www.bcb.gov.br/estabilidadefinanceira/drex). Consulta: 01/10/2026; 03/10/2026.

<a id="ex-digital"></a>

## 6. Exemplo resolvido: quatro afirmações diferentes

O cenário informa compartilhamento com uma instituição, representação digital de um direito, registro distribuído e uma função ainda proposta. Para responder, mantenha quatro linhas: permissão, direito, tecnologia e estágio. Nenhuma linha, sozinha, prova lucro certo, pagamento efetuado ou acesso universal.

<a id="interacao"></a>

## 7. Oferta e resultado

Marketplace pode reunir ofertantes e prestadores distintos. Segmentação organiza necessidades, mas não descreve toda a pessoa. Compare valores sob as mesmas condições e interprete indicadores conforme a etapa medida. Mais cliques não demonstram, por si só, contratação adequada ou resolução da necessidade.

Base conceitual: [BIS — Big tech in finance](https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks); [Lei 13.709/2018 — LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm). Consulta: 01/10/2026.

<a id="ex-comparar"></a>

## 8. Exemplo resolvido: duas evidências

A vitrine fictícia passou a mostrar o custo de entrega junto ao preço e registrou mais aberturas de ofertas. Mostrar o total pode facilitar comparação; o dado medido é abertura. Sem outra informação, não se pode declarar que todos compraram melhor ou que cada dúvida foi resolvida.

<a id="glossario"></a>

## Vocabulário essencial

Canal: forma de interação. Estrutura: como recursos e obrigações se organizam. Etapa: estado comprovado da operação. Natureza: o que o ativo ou serviço representa. Indicador: medida de algo definido, sem abranger automaticamente outros resultados.

<a id="resumo"></a>

## Recuperação e síntese

Faça uma linha para cada participante, etapa e resultado. Nomeie o erro e retome a aula de origem indicada após a questão. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.

## Recordação e recuperação

- Faça uma linha para cada participante, etapa e resultado.
- Nomeie o erro e retome a aula de origem indicada após a questão.

## Prática comentada

Todos os casos são fictícios. Tente responder antes de abrir cada comentário.

### Questão 1

Um formulário muda do papel para o aplicativo, mantendo as mesmas etapas internas. A tela informa apenas “pedido recebido”. O que está comprovado?

A. Automação de todas as etapas e conclusão do pedido.

B. Mudança de canal e recebimento da solicitação, sem prova de conclusão.

C. Mudança da natureza jurídica da instituição.

D. Eliminação de qualquer análise humana.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** Distingue mudança de acesso e estado da operação.

- **A:** Acrescenta duas conclusões não informadas.
- **B:** Distingue mudança de acesso e estado da operação.
- **C:** Canal não define natureza jurídica.
- **D:** As etapas foram mantidas.

Para recuperar: [1. Quatro perguntas para integrar](#mapa).

</details>

Aula de origem: [DP-01: 4. O verbo e o estado da operação importam](dp-01-v1.md#estados); [DP-02: 2. Exemplo resolvido: a porta de entrada](dp-02-v1.md#ex-canal).

### Questão 2

Uma fintech fornece tecnologia a intermediário não bancário com ativos longos e resgates curtos. Qual análise é correta?

A. O rótulo fintech elimina o risco de liquidez.

B. Todo intermediário não bancário é ilegal.

C. A tecnologia garante recursos imediatos.

D. É preciso analisar o descompasso de liquidez/prazos, sem inferir ilegalidade pelo rótulo.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** Aplica a distinção entre rótulo, estrutura e risco.

- **A:** Tecnologia não elimina o descompasso.
- **B:** O canal não prova infração.
- **C:** Não há tal garantia.
- **D:** Aplica a distinção entre rótulo, estrutura e risco.

Para recuperar: [2. Exemplo resolvido: interface e risco](#ex-integrado).

</details>

Aula de origem: [DP-03: 7. O rótulo não substitui a atividade](dp-03-v1.md#rotulos); [DP-04: 3. Prazo e liquidez](dp-04-v1.md#liquidez).

### Questão 3

Uma instituição participante de um arranjo informa Pix agendado para amanhã. Qual conclusão respeita regras e etapa?

A. A participação no arranjo não transforma o agendamento em liquidação imediata.

B. Arranjo é o nome do saldo da pessoa.

C. O recebedor já dispõe necessariamente do valor.

D. A instrução cria crédito novo.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** Separa regras comuns e resultado específico.

- **A:** Separa regras comuns e resultado específico.
- **B:** Arranjo é conjunto de regras, não saldo.
- **C:** O caso informa data futura.
- **D:** Não há empréstimo descrito.

Para recuperar: [3. Instrução e execução](#fluxos); [4. Exemplo resolvido: duas pendências](#ex-etapas).

</details>

Aula de origem: [DP-05: 3. Arranjo é um conjunto de regras](dp-05-v1.md#arranjo); [DP-06: 5. Agendar é instruir para depois](dp-06-v1.md#agendamento).

### Questão 4

O cliente autoriza B a receber um conjunto de dados de A. Não há ordem de pagamento. Qual leitura é adequada?

A. Todos os bancos receberam autorização.

B. O dinheiro foi transferido.

C. Há compartilhamento delimitado, sem prova de pagamento ou de aprovação de crédito.

D. O histórico tornou-se público.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** Preserva escopo e distingue ações.

- **A:** O destinatário é B.
- **B:** A operação não foi descrita.
- **C:** Preserva escopo e distingue ações.
- **D:** Compartilhamento não equivale a publicação.

Para recuperar: [5. Compartilhar e representar](#dados-ativos).

</details>

Aula de origem: [DP-07: 3. O que conferir na autorização](dp-07-v1.md#controle); [DP-07: 7. Informação e movimentação são ações diferentes](dp-07-v1.md#pagamento).

### Questão 5

Uma proposta descreve registro distribuído e possível transação com ativo digital. O que ainda precisa ser distinguido?

A. Apenas a cor do aplicativo.

B. Direito representado, emissor e estágio de disponibilidade, sem garantia automática de retorno.

C. Nada: blockchain garante todos os resultados.

D. Nada: todo ativo digital é CBDC.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: B.** Integra as distinções de tecnologia, natureza e estágio.

- **A:** Interface não identifica essas dimensões.
- **B:** Integra as distinções de tecnologia, natureza e estágio.
- **C:** Tecnologia não assegura retorno ou validade externa.
- **D:** Ativo privado e moeda de banco central são distintos.

Para recuperar: [5. Compartilhar e representar](#dados-ativos); [6. Exemplo resolvido: quatro afirmações diferentes](#ex-digital).

</details>

Aula de origem: [DP-08: 5. Tecnologia não é o próprio ativo](dp-08-v1.md#ativos); [DP-09: 1. Emissor e função vêm antes da tecnologia](dp-09-v1.md#cbdc); [DP-09: 7. Proposta não é serviço público já disponível](dp-09-v1.md#estagio).

### Questão 6

O correspondente encaminha uma proposta e a contratante ainda vai analisar. Qual afirmação é indevida?

A. A recepção e o envio da proposta ocorreram.

B. A concessão ainda não foi informada.

C. A contratante conserva a responsabilidade pelo atendimento nos termos estudados.

D. O envio da proposta já comprova aprovação do empréstimo.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: D.** Troca uma etapa pelo resultado que ainda falta.

- **A:** É a etapa descrita.
- **B:** Respeita a análise pendente.
- **C:** Aplica a regra sem julgar outras responsabilidades.
- **D:** Troca uma etapa pelo resultado que ainda falta.

Para recuperar: [3. Instrução e execução](#fluxos); [4. Exemplo resolvido: duas pendências](#ex-etapas).

</details>

Aula de origem: [DP-10: 5. Encaminhar não é conceder](dp-10-v1.md#propostas); [DP-10: 3. Contratar não elimina responsabilidade](dp-10-v1.md#responsabilidade).

### Questão 7

Mesmo produto e condições iguais: oferta A custa R$70 mais R$25 de entrega; B custa R$90 com entrega. Qual leitura é correta?

A. B tem menor total no caso: 90 contra 95.

B. A é menor porque anuncia 70.

C. A comissão da plataforma é necessariamente 25.

D. O menor total prova lucro do vendedor.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: A.** Soma o custo informado antes de comparar.

- **A:** Soma o custo informado antes de comparar.
- **B:** Ignora entrega.
- **C:** Frete não foi definido como comissão.
- **D:** Faltam os custos do vendedor.

Para recuperar: [7. Oferta e resultado](#interacao).

</details>

Aula de origem: [DP-11: 8. Exemplo resolvido: preço anunciado e total](dp-11-v1.md#ex-comparacao).

### Questão 8

Depois de uma mudança, aumentaram cliques de um grupo. O aluno concluiu que todas as necessidades desse grupo foram resolvidas. Como recuperar o erro?

A. Generalizar para todos os grupos.

B. Coletar qualquer informação sem finalidade.

C. Separar o indicador de clique do resultado de resolução, sem tratar o grupo como pessoas idênticas.

D. Supor que interação digital garante satisfação.

<details>
<summary>Resposta e justificativas</summary>

**Resposta: C.** Identifica duas extrapolações e retoma a medida correta.

- **A:** Amplia a inferência indevida.
- **B:** Contraria os limites de finalidade e necessidade.
- **C:** Identifica duas extrapolações e retoma a medida correta.
- **D:** Não há garantia universal.

Para recuperar: [7. Oferta e resultado](#interacao); [8. Exemplo resolvido: duas evidências](#ex-comparar); [Recuperação e síntese](#resumo).

</details>

Aula de origem: [DP-12: 1. Agrupar para compreender necessidades](dp-12-v1.md#segmentos); [DP-12: 7. Medir a etapa certa](dp-12-v1.md#indicadores).

## Fontes e limites editoriais

- [BCB — Fintechs](https://www.bcb.gov.br/estabilidadefinanceira/fintechs): Página oficial consultada em 01/10/2026; Definição introdutória; não utilizados limites ou normas antigos da página; consulta 2026-10-01.
- [FSB — Non-Bank Financial Intermediation](https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/): Página oficial consultada em 01/10/2026; Introdução e Monitoring: universo amplo, subconjunto de riscos, liquidez/prazos/alavancagem; consulta 2026-10-01.
- [BCB — Sistema de Pagamentos Brasileiro](https://www.bcb.gov.br/estabilidadefinanceira/spb): Página oficial consultada em 01/10/2026; Infraestruturas, arranjos e participantes; consulta 2026-10-01.
- [BCB — Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix): Página oficial consultada em 01/10/2026; Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais; consulta 2026-10-01.
- [BCB — Open Finance](https://www.bcb.gov.br/estabilidadefinanceira/openfinance): Página oficial consultada em 01/10/2026; Escolha de dados/destinatário/prazo, cancelamento e benefícios possíveis; consulta 2026-10-01.
- [NIST — Blockchain Technology Overview](https://csrc.nist.gov/pubs/ir/8202/final): NIST IR 8202, versão final de outubro de 2018; Resumo executivo e seção 2: registro, consenso e redes permissionadas/abertas; consulta 2026-10-01.
- [Lei 14.478/2022 — Ativos virtuais](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm): Texto oficial consultado em 01/10/2026; Art. 3º e exclusões; art. 1º parágrafo único; sem regime atual de autorização das prestadoras; consulta 2026-10-01.
- [BCB — Drex](https://www.bcb.gov.br/estabilidadefinanceira/drex): Página oficial; revalidada em 03/10/2026; Proposta de plataforma integrada e intermediação; sem data de lançamento ou acesso público presumido; consulta 2026-10-03.
- [CMN — Resolução 4.935/2021](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935): Versão vigente exibida pelo BCB, atualizada em 01/12/2025; Arts. 2º, 3º, 12 e 14: atuação contratada, responsabilidade e identificação; art. 8º revogado não utilizado; consulta 2026-10-01.
- [BIS — Big tech in finance](https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks): Annual Economic Report 2019, capítulo III; Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais; consulta 2026-10-01.
- [Lei 13.709/2018 — LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm): Texto oficial consultado em 01/10/2026; Art. 6º: finalidade, adequação, necessidade e não discriminação; art. 7º: bases legais; consulta 2026-10-01.

- Revisão exposta, não avaliação independente; oito itens integram doze aulas sem representar simulado completo de edital.
- Recortes marketplace/segmentação têm origem nominal BB; não representam cobertura nominal CAIXA.
- Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.
- Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2.
