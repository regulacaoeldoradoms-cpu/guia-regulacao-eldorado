# MISSÃO BANCÁRIA — BANCO AUTORAL DA AVALIAÇÃO INDEPENDENTE — REVISÃO EDITORIAL V3

Data: 29/09/2026.  
Fase ativa: Fase 1.  
Estado: **registro editorial do banco já convertido em catálogo backend; ainda sujeito à homologação humana/factual final**.  
Dependência: especificação `41-AVALIACAO-INDEPENDENTE.md`.

## 1. Finalidade

Preparar o primeiro lote de 32 itens inéditos da avaliação independente do bloco `banking.sfn-foundation`, em duas formas sem sobreposição:

- Forma A: 16 itens;
- Forma B: 16 itens;
- duas questões primárias de cada uma das oito aulas por forma;
- nenhum ID abaixo pertence ao banco de treino `q.*`;
- prefixo reservado: `eval.sfn.*`.

Este arquivo é o registro editorial que originou o catálogo backend. O bootstrap comum continua sem enviar o banco completo; a interface recebe apenas os itens da forma iniciada, sem gabarito durante a rodada.

## 2. Convenções editoriais

Cada item registra:
- `teaches`: aula/trecho que fornece o conhecimento necessário;
- `sources`: IDs já cadastrados no repositório;
- resposta correta;
- explicação pós-rodada;
- motivo dos distratores.

As alternativas foram escritas para exigir distinção/aplicação, não mera lembrança da posição da alternativa usada no treino.

A distribuição das alternativas corretas foi balanceada editorialmente: cada forma possui quatro respostas em A, quatro em B, quatro em C e quatro em D, evitando pista por posição.

---

# FORMA A

## A01 — classificar pela função, não pelo nome

**ID:** `eval.sfn.a01`  
**Aula primária:** `banking.sfn.introducao`  
**teaches:** “Antes dos nomes, entenda a lógica” + “Três perguntas que resolvem muita questão”  
**sources:** `bcb.sfn`

**Enunciado:** Uma entidade não atende clientes nem executa operações de crédito. Sua função central é estabelecer diretrizes gerais que serão observadas por outros participantes do sistema. Em qual grupo funcional ela se enquadra?

A. Órgãos normativos  
B. Operadores  
C. Instituições de pagamento  
D. Intermediários de mercado

**Resposta:** A.

**Explicação:** O elemento decisivo é a função de formular diretrizes gerais. Isso caracteriza órgão normativo, independentemente do nome da entidade.

**Distratores:** B confunde execução com formulação; C é espécie de participante operacional; D descreve atuação de mercado, não função normativa.

## A02 — reconhecer o operador em situação concreta

**ID:** `eval.sfn.a02`  
**Aula primária:** `banking.sfn.introducao`  
**teaches:** “Três perguntas que resolvem muita questão”  
**sources:** `bcb.sfn`

**Enunciado:** Quatro instituições são descritas apenas por suas atividades. Qual descrição indica mais claramente um operador do sistema?

A. Define diretrizes para moeda e crédito.  
B. Recebe recursos de clientes e realiza operações financeiras autorizadas.  
C. Fiscaliza participantes de um segmento.  
D. Delibera sobre orientações gerais de política econômica.

**Resposta:** B.

**Explicação:** Operadores executam atividades e serviços no mercado. Receber recursos e realizar operações financeiras é comportamento operacional.

**Distratores:** A e D são funções normativas; C é função supervisora.

## A03 — relação CMN/execução

**ID:** `eval.sfn.a03`  
**Aula primária:** `banking.sfn.cmn`  
**teaches:** “O órgão superior” + “O que lembrar para prova”  
**sources:** `bcb.cmn`

**Enunciado:** Uma questão afirma: “Como órgão superior do SFN, o CMN formula diretrizes da política da moeda e do crédito; a execução cotidiana dessas diretrizes cabe a entidades competentes, e não ao próprio Conselho como banco operacional.” A afirmação é:

A. Incorreta, porque o CMN atua como banco comercial.  
B. Incorreta, porque essa competência pertence exclusivamente à CVM.  
C. Correta, porque separa formulação normativa e execução.  
D. Incorreta, porque o CMN atua apenas no orçamento federal.

**Resposta:** C.

**Explicação:** O CMN é órgão normativo superior e formula políticas/diretrizes; não funciona como banco operacional.

**Distratores:** A troca órgão normativo por operador; B desloca atribuição para o campo da CVM; D confunde SFN com execução orçamentária.

## A04 — composição do CMN em cenário de substituição

**ID:** `eval.sfn.a04`  
**Aula primária:** `banking.sfn.cmn`  
**teaches:** “Composição atual”  
**sources:** `fazenda.cmn.apresentacao`

**Enunciado:** Qual conjunto corresponde à composição ensinada para o Conselho Monetário Nacional nesta versão do curso?

A. Presidente da República, Presidente da CVM e Ministro da Fazenda.  
B. Ministro da Fazenda, Presidente do Banco do Brasil e Presidente da CAIXA.  
C. Presidente do Banco Central, Presidente da CVM e Superintendente da SUSEP.  
D. Ministro da Fazenda, Ministro do Planejamento e Orçamento e Presidente do Banco Central.

**Resposta:** D.

**Explicação:** A composição adotada no material é formada pelo Ministro da Fazenda, pelo Ministro do Planejamento e Orçamento e pelo Presidente do BCB.

**Distratores:** A, B e C incluem autoridades que não compõem o colegiado apresentado.

## A05 — distinguir execução/supervisão de formulação superior

**ID:** `eval.sfn.a05`  
**Aula primária:** `banking.sfn.bacen`  
**teaches:** “A ponte entre diretriz e execução” + “Pegadinha clássica”  
**sources:** `bcb.competencias`, `bcb.sfn`

**Enunciado:** Uma alternativa descreve determinada instituição como “autarquia de natureza especial que supervisiona participantes e executa políticas de sua competência, sem ser o órgão normativo superior do SFN”. A descrição corresponde a:

A. Banco Central do Brasil.  
B. Conselho Monetário Nacional.  
C. Conselho Nacional de Seguros Privados.  
D. Banco comercial.

**Resposta:** A.

**Explicação:** A combinação autarquia + supervisão + execução de políticas é característica do BCB; o órgão normativo superior é o CMN.

**Distratores:** B é colegiado normativo; C pertence ao segmento de seguros; D é operador.

## A06 — banco dos bancos em uma necessidade interbancária

**ID:** `eval.sfn.a06`  
**Aula primária:** `banking.sfn.bacen`  
**teaches:** seção `banco-dos-bancos`  
**sources:** `bcb.competencias`

**Enunciado:** Uma instituição financeira precisa usar estruturas mantidas pela autoridade monetária para movimentar e liquidar recursos no relacionamento entre instituições. Qual função do Banco Central ajuda a compreender esse papel?

A. Atendimento bancário de varejo.  
B. Banco dos bancos.  
C. Administração de fundos de pensão.  
D. Fiscalização de ofertas públicas de ações.

**Resposta:** B.

**Explicação:** A expressão “banco dos bancos” resume relações e estruturas do Banco Central voltadas ao funcionamento entre instituições, não ao atendimento bancário comum do público.

**Distratores:** A descreve operador de varejo; C remete à previdência fechada; D ao mercado de valores mobiliários.

## A07 — decisão de política monetária

**ID:** `eval.sfn.a07`  
**Aula primária:** `banking.sfn.copom`  
**teaches:** “A decisão central”  
**sources:** `bcb.copom`

**Enunciado:** Após analisar cenário macroeconômico e riscos, um colegiado define a meta de uma taxa básica que orienta a execução da política monetária. Qual colegiado é esse?

A. CVM.  
B. CNSP.  
C. Copom.  
D. PREVIC.

**Resposta:** C.

**Explicação:** O Copom define a meta para a Taxa Selic e orientações estratégicas da política monetária.

**Distratores:** A atua em valores mobiliários; B em diretrizes de seguros; D supervisiona previdência complementar fechada.

## A08 — reconhecer o colegiado pela composição

**ID:** `eval.sfn.a08`  
**Aula primária:** `banking.sfn.copom`  
**teaches:** seções `nome` e `composicao`  
**sources:** `bcb.copom`

**Enunciado:** Um enunciado descreve um colegiado que funciona no âmbito do Banco Central e é formado pelo Presidente e pelos Diretores da própria instituição. Qual colegiado foi descrito?

A. CMN.  
B. CVM.  
C. CNSP.  
D. Copom.

**Resposta:** D.

**Explicação:** A composição Presidente + Diretores do Banco Central identifica o Copom no conteúdo ensinado.

**Distratores:** A possui composição diferente; B é autarquia do mercado de valores mobiliários; C é conselho do segmento de seguros.

## A09 — identificar CVM pelo objeto

**ID:** `eval.sfn.a09`  
**Aula primária:** `banking.sfn.cvm`  
**teaches:** “O território da CVM” + “CVM não é Banco Central”  
**sources:** `cvm.papel`, `cvm.competencia`

**Enunciado:** Uma empresa pretende captar recursos por oferta pública de valores mobiliários a investidores. Qual supervisor aparece de forma mais direta nesse contexto?

A. CVM.  
B. PREVIC.  
C. SUSEP.  
D. Copom.

**Resposta:** A.

**Explicação:** Oferta pública e valores mobiliários pertencem ao núcleo de atuação da CVM.

**Distratores:** B trata de entidades fechadas de previdência; C de seguros e mercados correlatos; D decide política monetária.

## A10 — distinguir produto bancário de valor mobiliário

**ID:** `eval.sfn.a10`  
**Aula primária:** `banking.sfn.cvm`  
**teaches:** “CVM não é Banco Central”  
**sources:** `cvm.competencia`, `bcb.supervisionadas`

**Enunciado:** Qual situação aponta mais diretamente para a esfera da CVM, e não para a supervisão bancária tradicional do Banco Central?

A. Funcionamento de conta corrente em banco comercial.  
B. Integridade de uma oferta pública de valores mobiliários.  
C. Autorização de administradora de consórcio.  
D. Supervisão de uma cooperativa de crédito.

**Resposta:** B.

**Explicação:** A CVM atua no mercado de valores mobiliários e ofertas públicas; as demais situações se relacionam mais diretamente ao BCB.

**Distratores:** A, C e D estão ligados a participantes/atividades supervisionados pelo Banco Central.

## A11 — reconhecer banco múltiplo em uma configuração nova

**ID:** `eval.sfn.a11`  
**Aula primária:** `banking.sfn.operadores`  
**teaches:** seções `carteira`, `multiplo` e `exemplo-carteiras`  
**sources:** `cmn.bancos.5060`

**Enunciado:** Uma instituição reúne, sob a mesma organização, uma carteira comercial e uma carteira de investimento. Considerando apenas a regra de carteiras ensinada, essa configuração é compatível com a classificação de:

A. Instituição de pagamento sem carteira bancária.  
B. Órgão normativo.  
C. Banco múltiplo.  
D. Entidade fechada de previdência complementar.

**Resposta:** C.

**Explicação:** Há pelo menos duas carteiras e uma delas é comercial ou de investimento, satisfazendo a regra básica estudada para banco múltiplo.

**Distratores:** A não descreve a organização por carteiras bancárias; B não é operador; D pertence a outro segmento.

## A12 — supervisionado continua operador

**ID:** `eval.sfn.a12`  
**Aula primária:** `banking.sfn.operadores`  
**teaches:** “Não confunda operador com supervisor”  
**sources:** `bcb.supervisionadas`, `bcb.sfn`

**Enunciado:** Uma cooperativa de crédito segue regras e é supervisionada pelo Banco Central. Isso significa que ela:

A. Passa a integrar a estrutura deliberativa do CMN como membro.  
B. Torna-se entidade supervisora do segmento por estar sujeita às regras.  
C. Assume competência do Copom para decisões de política monetária.  
D. Permanece operadora; a supervisão do BCB não muda sua natureza.

**Resposta:** D.

**Explicação:** A instituição supervisionada permanece operadora. Supervisor e supervisionado ocupam papéis diferentes.

**Distratores:** A, B e C confundem sujeição à supervisão com mudança de natureza institucional.

## A13 — aberta x fechada por vínculo

**ID:** `eval.sfn.a13`  
**Aula primária:** `banking.sfn.seguros-previdencia`  
**teaches:** “Previdência aberta e fechada não são a mesma coisa”  
**sources:** `susep.previdencia-aberta`, `previc.como-participar`

**Enunciado:** Um plano é administrado por entidade fechada de previdência complementar e pressupõe vínculo com patrocinador ou instituidor. Qual supervisor deve ser associado ao caso?

A. PREVIC.  
B. SUSEP.  
C. CVM.  
D. Copom.

**Resposta:** A.

**Explicação:** Entidades fechadas de previdência complementar, os fundos de pensão, estão sob supervisão da PREVIC.

**Distratores:** B supervisiona previdência complementar aberta; C mercado de valores mobiliários; D política monetária.

## A14 — capitalização e supervisor

**ID:** `eval.sfn.a14`  
**Aula primária:** `banking.sfn.seguros-previdencia`  
**teaches:** “Capitalização entra no mesmo radar da SUSEP”  
**sources:** `susep.sobre`

**Enunciado:** Uma prova apresenta um título de capitalização e pergunta qual autarquia fiscaliza esse mercado. A resposta correta é:

A. PREVIC.  
B. SUSEP.  
C. Banco Central.  
D. CVM.

**Resposta:** B.

**Explicação:** O mercado de capitalização está entre os mercados fiscalizados pela SUSEP.

**Distratores:** A cuida de previdência fechada; C e D possuem outros campos de supervisão.

## A15 — instituição de pagamento e crédito próprio

**ID:** `eval.sfn.a15`  
**Aula primária:** `banking.sfn.pagamentos-consorcios`  
**teaches:** “Instituição de pagamento não é banco”  
**sources:** `bcb.instituicao-pagamento`

**Enunciado:** Uma empresa é instituição de pagamento e gerencia contas de pagamento. Qual afirmação é compatível com o conteúdo estudado?

A. Passa a ser banco comercial e pode captar depósitos à vista apenas por manter contas de pagamento.  
B. Pode definir a meta Selic e conceder crédito por participar do sistema de pagamentos.  
C. Continua sendo instituição de pagamento e não pode exercer atividade privativa de instituição financeira.  
D. Substitui o Banco Central na regulação e fiscalização dos participantes do arranjo.

**Resposta:** C.

**Explicação:** Instituição de pagamento não é instituição financeira e não pode exercer atividades privativas destas apenas por atuar em pagamentos.

**Distratores:** A confunde categorias; B e D atribuem competências públicas a operador privado.

## A16 — SPI e forma de liquidação

**ID:** `eval.sfn.a16`  
**Aula primária:** `banking.sfn.pagamentos-consorcios`  
**teaches:** “Pix e SPI”  
**sources:** `bcb.spi`

**Enunciado:** No arranjo Pix, a infraestrutura centralizada gerida pelo Banco Central que liquida transações entre instituições distintas, uma a uma, é:

A. CMN.  
B. CVM.  
C. PREVIC.  
D. SPI.

**Resposta:** D.

**Explicação:** O SPI é a infraestrutura centralizada de liquidação de pagamentos instantâneos e opera em liquidação bruta em tempo real.

**Distratores:** A, B e C são órgãos/entidades com outras finalidades.

---

# FORMA B

## B01 — supervisor x normativo em caso novo

**ID:** `eval.sfn.b01`  
**Aula primária:** `banking.sfn.introducao`  
**teaches:** “Antes dos nomes, entenda a lógica”  
**sources:** `bcb.sfn`

**Enunciado:** Uma entidade recebe competência para verificar se participantes cumprem regras, aplicar supervisão em seu campo e acompanhar riscos do segmento. Sem saber seu nome, a função descrita é principalmente de:

A. Órgão normativo.  
B. Cliente institucional.  
C. Entidade supervisora.  
D. Operador de varejo.

**Resposta:** C.

**Explicação:** Fiscalizar e fazer cumprir regras em determinado campo caracteriza função supervisora.

**Distratores:** A formula diretrizes; B não é categoria funcional do SFN; D executa serviços e operações.

## B02 — sequência lógica de funções

**ID:** `eval.sfn.b02`  
**Aula primária:** `banking.sfn.introducao`  
**teaches:** “Três perguntas que resolvem muita questão”  
**sources:** `bcb.sfn`

**Enunciado:** Qual sequência representa corretamente a passagem da regra geral para a atividade no mercado?

A. Operador formula diretrizes → cliente fiscaliza → supervisor concede crédito.  
B. Supervisor cria clientes → operador fiscaliza → normativo atende o público.  
C. Cliente define política → normativo empresta → operador fiscaliza.  
D. Normativo formula diretrizes → supervisor fiscaliza → operador executa atividades.

**Resposta:** D.

**Explicação:** A sequência reproduz a divisão funcional ensinada: formulação, supervisão e operação.

**Distratores:** A, B e C trocam as funções entre os grupos.

## B03 — CMN não é supervisor operacional

**ID:** `eval.sfn.b03`  
**Aula primária:** `banking.sfn.cmn`  
**teaches:** “O que lembrar para prova”  
**sources:** `bcb.cmn`

**Enunciado:** Qual atividade seria incompatível com a caracterização do CMN como colegiado normativo superior?

A. Atender correntistas e conceder crédito diretamente ao público.  
B. Formular política da moeda e do crédito.  
C. Estabelecer diretrizes gerais para o sistema.  
D. Orientar por normas a atuação das entidades competentes.

**Resposta:** A.

**Explicação:** O CMN não é banco operacional que atende clientes; suas funções são normativas.

**Distratores:** B, C e D são compatíveis com o papel normativo ensinado.

## B04 — presidência do CMN

**ID:** `eval.sfn.b04`  
**Aula primária:** `banking.sfn.cmn`  
**teaches:** “Composição atual”  
**sources:** `fazenda.cmn.apresentacao`

**Enunciado:** Em uma ata hipotética do CMN, qual membro deve aparecer como presidente do colegiado conforme a composição estudada?

A. Presidente da CVM.  
B. Ministro da Fazenda.  
C. Superintendente da SUSEP.  
D. Presidente do Banco do Brasil.

**Resposta:** B.

**Explicação:** O Ministro da Fazenda preside o CMN na composição adotada no curso.

**Distratores:** A, C e D não exercem essa presidência.

## B05 — execução de política cambial

**ID:** `eval.sfn.b05`  
**Aula primária:** `banking.sfn.bacen`  
**teaches:** “Funções que aparecem em prova”  
**sources:** `bcb.competencias`

**Enunciado:** A execução de políticas monetária, cambial e de crédito, dentro das competências legais, é associada principalmente a qual instituição?

A. CVM.  
B. PREVIC.  
C. Banco Central.  
D. Banco comercial.

**Resposta:** C.

**Explicação:** O BCB executa políticas monetária, cambial e de crédito e supervisiona o sistema em seu campo.

**Distratores:** A e B são supervisores de outros segmentos; D é operador.

## B06 — erro clássico sobre BCB

**ID:** `eval.sfn.b06`  
**Aula primária:** `banking.sfn.bacen`  
**teaches:** “Pegadinha clássica”  
**sources:** `bcb.sfn`, `bcb.competencias`

**Enunciado:** Qual afirmação deve ser rejeitada?

A. “O Banco Central supervisiona instituições em sua competência.”  
B. “O Banco Central executa políticas em sua competência.”  
C. “CMN e Banco Central possuem funções institucionais distintas.”  
D. “O Banco Central é o órgão normativo superior do SFN, acima do CMN.”

**Resposta:** D.

**Explicação:** O órgão normativo superior é o CMN. O BCB possui funções supervisoras, regulatórias e executivas, mas não substitui essa posição do Conselho.

**Distratores:** A, B e C refletem a distinção ensinada.

## B07 — meta Selic não é a taxa de todo contrato

**ID:** `eval.sfn.b07`  
**Aula primária:** `banking.sfn.copom`  
**teaches:** seções `selic`, `meta` e `relacao`  
**sources:** `bcb.copom`

**Enunciado:** Após uma decisão do Copom, um cliente conclui que todo empréstimo bancário deverá ter exatamente a mesma taxa definida pelo colegiado. Qual correção é adequada?

A. O Copom define a meta Selic; a taxa do empréstimo depende também de risco, prazo e custos.  
B. A conclusão está correta: a meta Selic é obrigatoriamente a taxa de todo empréstimo.  
C. O Copom atua apenas no mercado de seguros e define taxas obrigatórias para apólices privadas.  
D. A taxa de cada empréstimo é definida diretamente pelo CMN para cada cliente.

**Resposta:** A.

**Explicação:** A aula diferencia a meta da taxa básica das taxas específicas dos contratos de crédito.

**Distratores:** B confunde meta macroeconômica com preço individual; C desloca o assunto para seguros; D atribui análise individual de contrato ao CMN.

## B08 — dois sentidos relacionados à palavra Selic

**ID:** `eval.sfn.b08`  
**Aula primária:** `banking.sfn.copom`  
**teaches:** seções `selic` e `meta`  
**sources:** `bcb.copom`

**Enunciado:** Qual afirmação organiza corretamente o uso da palavra “Selic” no conteúdo estudado?

A. Selic é o nome de um banco comercial que concede empréstimos ao público.  
B. Selic nomeia o sistema de liquidação e custódia; a meta da taxa Selic é definida pelo Copom.  
C. Selic é modalidade de previdência complementar fechada supervisionada pela PREVIC.  
D. Selic é a entidade responsável por fiscalizar companhias abertas e fundos de investimento.

**Resposta:** B.

**Explicação:** A aula distingue a origem do nome Selic e o uso da expressão taxa Selic no contexto dos juros básicos e de sua meta.

**Distratores:** A, C e D confundem a expressão com instituições/segmentos sem relação com essa definição.

## B09 — proteção do investidor e manipulação

**ID:** `eval.sfn.b09`  
**Aula primária:** `banking.sfn.cvm`  
**teaches:** “Quem aparece sob sua supervisão”  
**sources:** `cvm.papel`, `cvm.competencia`

**Enunciado:** Uma investigação envolve manipulação de mercado em negociações de valores mobiliários e proteção dos investidores. Qual entidade está no centro dessa atribuição?

A. SUSEP.  
B. PREVIC.  
C. CVM.  
D. Copom.

**Resposta:** C.

**Explicação:** Integridade do mercado de valores mobiliários, repressão a fraudes/manipulações e proteção de investidores estão no campo da CVM.

**Distratores:** A, B e D atuam em segmentos diferentes.

## B10 — fundos de investimento como pista

**ID:** `eval.sfn.b10`  
**Aula primária:** `banking.sfn.cvm`  
**teaches:** “Quem aparece sob sua supervisão”  
**sources:** `cvm.competencia`

**Enunciado:** Qual palavra-chave, isoladamente, é a pista mais forte para investigar a competência da CVM no contexto apresentado pelo curso?

A. Depósito à vista.  
B. Consórcio.  
C. Previdência complementar fechada.  
D. Fundo de investimento.

**Resposta:** D.

**Explicação:** Fundos de investimento aparecem entre os participantes/estruturas do mercado de valores mobiliários sujeitos à esfera da CVM.

**Distratores:** A remete a banco comercial; B ao BCB; C à PREVIC.

## B11 — banco comercial reconhecido pela atividade

**ID:** `eval.sfn.b11`  
**Aula primária:** `banking.sfn.operadores`  
**teaches:** “Banco comercial e banco múltiplo”  
**sources:** `cmn.bancos.5060`, `bcb.supervisionadas`

**Enunciado:** Qual atividade ajuda a identificar um banco comercial em uma questão?

A. Captação de depósitos à vista.  
B. Definição da meta Selic.  
C. Fiscalização de ofertas públicas.  
D. Supervisão de entidades fechadas de previdência.

**Resposta:** A.

**Explicação:** A captação de depósitos à vista é uma atividade típica do banco comercial.

**Distratores:** B pertence ao Copom; C à CVM; D à PREVIC.

## B12 — operador não vira regulador

**ID:** `eval.sfn.b12`  
**Aula primária:** `banking.sfn.operadores`  
**teaches:** “A pergunta de prova” + “Não confunda operador com supervisor”  
**sources:** `bcb.sfn`, `bcb.supervisionadas`

**Enunciado:** Uma financeira é autorizada e fiscalizada pelo Banco Central. Qual conclusão é correta?

A. A financeira passa a ser órgão normativo.  
B. A financeira segue como operadora; o BCB é seu supervisor.  
C. A financeira passa a integrar o Copom.  
D. A financeira assume competência sobre companhias abertas.

**Resposta:** B.

**Explicação:** Ser supervisionado não converte o participante em supervisor; a financeira continua no lado operacional.

**Distratores:** A, C e D atribuem funções públicas incompatíveis.

## B13 — aberta x fechada pelo supervisor

**ID:** `eval.sfn.b13`  
**Aula primária:** `banking.sfn.seguros-previdencia`  
**teaches:** “Previdência aberta e fechada não são a mesma coisa”  
**sources:** `susep.previdencia-aberta`, `previc.missao`

**Enunciado:** Qual par está corretamente associado?

A. Aberta — PREVIC; fechada — SUSEP.  
B. Aberta — CVM; fechada — Banco Central.  
C. Aberta — SUSEP; fechada — PREVIC.  
D. Aberta — CNSP; fechada — CMN.

**Resposta:** C.

**Explicação:** A SUSEP supervisiona a previdência complementar aberta; a PREVIC, as entidades fechadas.

**Distratores:** A, B e D trocam os supervisores.

## B14 — CNSP x SUSEP

**ID:** `eval.sfn.b14`  
**Aula primária:** `banking.sfn.seguros-previdencia`  
**teaches:** “CNSP e SUSEP” + “Mapa mental”  
**sources:** `susep.sobre`

**Enunciado:** No segmento de seguros privados, qual relação funcional está correta?

A. SUSEP fixa a meta Selic e CNSP supervisiona bancos.  
B. PREVIC define política monetária e SUSEP fiscaliza companhias abertas.  
C. CVM normatiza previdência fechada e CNSP administra consórcios.  
D. CNSP define diretrizes e normas; SUSEP supervisiona e fiscaliza o segmento.

**Resposta:** D.

**Explicação:** O CNSP exerce função normativa do segmento; a SUSEP é entidade supervisora dos mercados de seguros, previdência aberta, capitalização e resseguro.

**Distratores:** A, B e C misturam competências de segmentos distintos.

## B15 — consórcio sem promessa de contemplação

**ID:** `eval.sfn.b15`  
**Aula primária:** `banking.sfn.pagamentos-consorcios`  
**teaches:** “Consórcio é autofinanciamento”  
**sources:** `bcb.consorcio`

**Enunciado:** Uma propaganda afirma que a simples adesão a um grupo de consórcio garante contemplação imediata. À luz do conteúdo estudado, a afirmação é:

A. Incorreta; consórcio é autofinanciamento e não garante contemplação imediata.  
B. Correta; todo consórcio funciona como empréstimo instantâneo.  
C. Correta; o Banco Central entrega o bem na adesão.  
D. Incorreta apenas porque consórcios são fiscalizados pela CVM.

**Resposta:** A.

**Explicação:** A adesão não assegura contemplação imediata; consórcio organiza autofinanciamento em grupo.

**Distratores:** B e C inventam mecanismo de crédito/entrega; D atribui supervisor incorreto.

## B16 — SPB como sistema, não entidade única

**ID:** `eval.sfn.b16`  
**Aula primária:** `banking.sfn.pagamentos-consorcios`  
**teaches:** “Sistema de Pagamentos Brasileiro”  
**sources:** `bcb.spb`

**Enunciado:** Qual descrição representa melhor o Sistema de Pagamentos Brasileiro (SPB)?

A. Um banco único que centraliza e executa todos os pagamentos do país.  
B. Rede de regras, infraestruturas e participantes usada para pagamentos e liquidações.  
C. Um fundo financeiro supervisionado exclusivamente pela CVM.  
D. Um colegiado do Banco Central responsável por definir a meta Selic.

**Resposta:** B.

**Explicação:** O SPB é um sistema composto por infraestruturas, arranjos, regras e participantes; não uma instituição bancária isolada.

**Distratores:** A reduz o sistema a um banco; C e D pertencem a outros conceitos.

---

## 3. Matriz de cobertura das formas

| Aula | Forma A | Forma B |
|---|---|---|
| Introdução ao SFN | A01, A02 | B01, B02 |
| CMN | A03, A04 | B03, B04 |
| Banco Central | A05, A06 | B05, B06 |
| Copom | A07, A08 | B07, B08 |
| CVM | A09, A10 | B09, B10 |
| Operadores | A11, A12 | B11, B12 |
| Seguros/previdência | A13, A14 | B13, B14 |
| Pagamentos/consórcios | A15, A16 | B15, B16 |

## 4. Revisão editorial/factual e critérios de homologação

Antes de considerar o banco homologado para uso pedagógico:
1. comparar semanticamente com as 38 questões de treino e as 12 do Chefe, rejeitando paráfrase excessivamente próxima;
2. conferir cada resposta nas fontes oficiais já catalogadas;
3. confirmar que todo conhecimento aparece na aula/trecho indicado;
4. revisar equilíbrio de dificuldade e comprimento das alternativas;
5. revisar pistas gramaticais que revelem a resposta;
6. registrar versão editorial de cada item;
7. gerar teste que assegure A ∩ B = ∅;
8. garantir que o bootstrap comum nunca importe este banco.

A conclusão deste rascunho **não altera cobertura curricular, prontidão, XP nem percentual de aprendizado do usuário**.




### Revisão V3 — 29/09/2026

Foi feita uma segunda passada editorial sobre as alternativas com foco em **pistas de comprimento e forma gramatical**. Os itens com maior diferença de tamanho entre a correta e os distratores foram reescritos sem mudar a competência avaliada nem a posição da resposta correta.

Também foi feita conferência dirigida dos pontos factuais mais sensíveis nas fontes oficiais já adotadas no projeto: composição do CMN, competências do BCB, Copom/meta Selic, campo da CVM, banco múltiplo, SUSEP/PREVIC, instituição de pagamento, SPI/SPB e consórcio.

O catálogo de produção foi elevado para `ASSESSMENT_VERSION = 2`. Rodadas de versão anterior permanecem históricas e não devem ser misturadas silenciosamente com a nova redação.

## 5. Referências estáveis de ensino para a conversão futura

Na implementação, `teaches` deve usar IDs estáveis do catálogo, não somente o título legível da seção.

| Item | missionId | sectionIds |
|---|---|---|
| A01 | banking.sfn.introducao | regras |
| A02 | banking.sfn.introducao | intermediacao, operadores |
| A03 | banking.sfn.cmn | papel, diferencas |
| A04 | banking.sfn.cmn | composicao, exemplo-composicao |
| A05 | banking.sfn.bacen | natureza, supervisao, politicas |
| A06 | banking.sfn.bacen | banco-dos-bancos |
| A07 | banking.sfn.copom | meta, exemplo-meta |
| A08 | banking.sfn.copom | nome, composicao |
| A09 | banking.sfn.cvm | mercado, exemplo-oferta |
| A10 | banking.sfn.cvm | comparacao, supervisao |
| A11 | banking.sfn.operadores | carteira, multiplo, exemplo-carteiras |
| A12 | banking.sfn.operadores | papel, outros |
| A13 | banking.sfn.seguros-previdencia | previdencia-fechada |
| A14 | banking.sfn.seguros-previdencia | capitalizacao, susep |
| A15 | banking.sfn.pagamentos-consorcios | instituicao |
| A16 | banking.sfn.pagamentos-consorcios | spi, exemplo-pix |
| B01 | banking.sfn.introducao | regras |
| B02 | banking.sfn.introducao | regras, intermediacao, operadores |
| B03 | banking.sfn.cmn | papel, diferencas |
| B04 | banking.sfn.cmn | composicao |
| B05 | banking.sfn.bacen | politicas |
| B06 | banking.sfn.bacen | politicas, resumo |
| B07 | banking.sfn.copom | selic, meta, relacao |
| B08 | banking.sfn.copom | selic, meta |
| B09 | banking.sfn.cvm | supervisao, exemplo-fraude |
| B10 | banking.sfn.cvm | participantes |
| B11 | banking.sfn.operadores | deposito, comercial |
| B12 | banking.sfn.operadores | papel, outros |
| B13 | banking.sfn.seguros-previdencia | previdencia-aberta, previdencia-fechada |
| B14 | banking.sfn.seguros-previdencia | cnsp, susep, resumo |
| B15 | banking.sfn.pagamentos-consorcios | consorcio, exemplo-consorcio |
| B16 | banking.sfn.pagamentos-consorcios | spb |

A revisão de 29/09 removeu dos itens independentes a cobrança do número/sessões ordinárias do Copom, porque esse detalhe permanece no arquivo-base histórico mas **não está no conjunto final de seções V2 servido pela missão atual**. A avaliação independente não pode cobrar conteúdo que não esteja no ensino efetivamente publicado.
