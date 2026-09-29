# MISSÃO BANCÁRIA — BANCO AUTORAL DA AVALIAÇÃO INDEPENDENTE — RASCUNHO V1

Data: 29/09/2026.  
Fase ativa: Fase 1.  
Estado: **rascunho editorial, fora do produto e não servido por API**.  
Dependência: especificação `41-AVALIACAO-INDEPENDENTE.md`.

## 1. Finalidade

Preparar o primeiro lote de 32 itens inéditos da avaliação independente do bloco `banking.sfn-foundation`, em duas formas sem sobreposição:

- Forma A: 16 itens;
- Forma B: 16 itens;
- duas questões primárias de cada uma das oito aulas por forma;
- nenhum ID abaixo pertence ao banco de treino `q.*`;
- prefixo reservado: `eval.sfn.*`.

Este arquivo **não é catálogo de produção**. Nenhum item deve entrar no bootstrap, revisão, Chefe ou frontend antes da integração da cadeia técnica e da revisão pedagógica/factual.

## 2. Convenções editoriais

Cada item registra:
- `teaches`: aula/trecho que fornece o conhecimento necessário;
- `sources`: IDs já cadastrados no repositório;
- resposta correta;
- explicação pós-rodada;
- motivo dos distratores.

As alternativas foram escritas para exigir distinção/aplicação, não mera lembrança da posição da alternativa usada no treino.

---

# FORMA A

## A01 — classificar pela função, não pelo nome

**ID:** `eval.sfn.a01`  
**Aula primária:** `banking.sfn.introducao`  
**teaches:** “Antes dos nomes, entenda a lógica” + “Três perguntas que resolvem muita questão”  
**sources:** `bcb.sfn`

**Enunciado:** Uma entidade não atende clientes nem executa operações de crédito. Sua função central é estabelecer diretrizes gerais que serão observadas por outros participantes do sistema. Em qual grupo funcional ela se enquadra?

A. Operadores  
B. Órgãos normativos  
C. Instituições de pagamento  
D. Intermediários de mercado

**Resposta:** B.

**Explicação:** O elemento decisivo é a função de formular diretrizes gerais. Isso caracteriza órgão normativo, independentemente do nome da entidade.

**Distratores:** A confunde execução com formulação; C é espécie de participante operacional; D descreve atuação de mercado, não função normativa.

## A02 — reconhecer o operador em situação concreta

**ID:** `eval.sfn.a02`  
**Aula primária:** `banking.sfn.introducao`  
**teaches:** “Três perguntas que resolvem muita questão”  
**sources:** `bcb.sfn`

**Enunciado:** Quatro instituições são descritas apenas por suas atividades. Qual descrição indica mais claramente um operador do sistema?

A. Define diretrizes para moeda e crédito.  
B. Fiscaliza participantes de um segmento.  
C. Recebe recursos de clientes e realiza operações financeiras autorizadas.  
D. Delibera sobre orientações gerais de política econômica.

**Resposta:** C.

**Explicação:** Operadores executam atividades e serviços no mercado. Receber recursos e realizar operações financeiras é comportamento operacional.

**Distratores:** A e D são funções normativas; B é função supervisora.

## A03 — relação CMN/execução

**ID:** `eval.sfn.a03`  
**Aula primária:** `banking.sfn.cmn`  
**teaches:** “O órgão superior” + “O que lembrar para prova”  
**sources:** `bcb.cmn`

**Enunciado:** Uma questão afirma: “Como órgão superior do SFN, o CMN formula diretrizes da política da moeda e do crédito; a execução cotidiana dessas diretrizes cabe a entidades competentes, e não ao próprio Conselho como banco operacional.” A afirmação é:

A. Correta.  
B. Incorreta, pois o CMN é banco comercial.  
C. Incorreta, pois o CMN fiscaliza exclusivamente companhias abertas.  
D. Incorreta, pois o CMN apenas administra o orçamento federal.

**Resposta:** A.

**Explicação:** O CMN é órgão normativo superior e formula políticas/diretrizes; não funciona como banco operacional.

**Distratores:** B troca órgão normativo por operador; C desloca atribuição para o campo da CVM; D confunde SFN com execução orçamentária.

## A04 — composição do CMN em cenário de substituição

**ID:** `eval.sfn.a04`  
**Aula primária:** `banking.sfn.cmn`  
**teaches:** “Composição atual”  
**sources:** `bcb.cmn`

**Enunciado:** Qual conjunto corresponde à composição ensinada para o Conselho Monetário Nacional nesta versão do curso?

A. Ministro da Fazenda, Ministro do Planejamento e Orçamento e Presidente do Banco Central.  
B. Presidente da República, Presidente da CVM e Ministro da Fazenda.  
C. Ministro da Fazenda, Presidente do Banco do Brasil e Presidente da CAIXA.  
D. Presidente do Banco Central, Presidente da CVM e Superintendente da SUSEP.

**Resposta:** A.

**Explicação:** A composição adotada no material é formada pelo Ministro da Fazenda, pelo Ministro do Planejamento e Orçamento e pelo Presidente do BCB.

**Distratores:** B, C e D incluem autoridades que não compõem o colegiado apresentado.

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

## A06 — banco dos bancos aplicado

**ID:** `eval.sfn.a06`  
**Aula primária:** `banking.sfn.bacen`  
**teaches:** “Funções que aparecem em prova”  
**sources:** `bcb.competencias`

**Enunciado:** Em uma explicação sobre a infraestrutura bancária, aparece a função de atuar perante as próprias instituições financeiras, em vez de prestar conta corrente ao público em geral. A expressão tradicional que resume essa função é:

A. Banco dos bancos.  
B. Banco de investimentos do Tesouro.  
C. Operador de valores mobiliários.  
D. Conselho de crédito.

**Resposta:** A.

**Explicação:** “Banco dos bancos” é expressão tradicional associada a uma das funções do Banco Central.

**Distratores:** B, C e D não descrevem essa função institucional do BCB.

## A07 — decisão de política monetária

**ID:** `eval.sfn.a07`  
**Aula primária:** `banking.sfn.copom`  
**teaches:** “A decisão central”  
**sources:** `bcb.copom`

**Enunciado:** Após analisar cenário macroeconômico e riscos, um colegiado define a meta de uma taxa básica que orienta a execução da política monetária. Qual colegiado é esse?

A. Copom.  
B. CVM.  
C. CNSP.  
D. PREVIC.

**Resposta:** A.

**Explicação:** O Copom define a meta para a Taxa Selic e orientações estratégicas da política monetária.

**Distratores:** B atua em valores mobiliários; C em diretrizes de seguros; D supervisiona previdência complementar fechada.

## A08 — estrutura do Copom

**ID:** `eval.sfn.a08`  
**Aula primária:** `banking.sfn.copom`  
**teaches:** “Onde o Copom fica” + “Ritmo das reuniões”  
**sources:** `bcb.copom`

**Enunciado:** Qual combinação descreve corretamente o Copom conforme a regulamentação usada no curso?

A. Funciona no BCB, é composto por seu Presidente e Diretores e realiza oito reuniões ordinárias por ano.  
B. Funciona na CVM, é composto por companhias abertas e se reúne mensalmente.  
C. Funciona no CMN, é composto por bancos comerciais e fixa impostos.  
D. Funciona na SUSEP, é composto por seguradoras e define a taxa de câmbio.

**Resposta:** A.

**Explicação:** O Copom está no âmbito do BCB, é composto pelo Presidente e Diretores e, na norma usada no curso, realiza oito reuniões ordinárias anuais.

**Distratores:** B, C e D deslocam instituição, composição e competência.

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

A. Integridade de uma oferta pública de valores mobiliários.  
B. Funcionamento de conta corrente em banco comercial.  
C. Autorização de administradora de consórcio.  
D. Supervisão de uma cooperativa de crédito.

**Resposta:** A.

**Explicação:** A CVM atua no mercado de valores mobiliários e ofertas públicas; as demais situações se relacionam mais diretamente ao BCB.

**Distratores:** B, C e D estão ligados a participantes/atividades supervisionados pelo Banco Central.

## A11 — banco múltiplo por carteiras

**ID:** `eval.sfn.a11`  
**Aula primária:** `banking.sfn.operadores`  
**teaches:** “Banco comercial e banco múltiplo”  
**sources:** `cmn.bancos.5060`

**Enunciado:** Uma instituição pretende organizar-se como banco múltiplo. Qual configuração atende à regra básica ensinada?

A. Duas carteiras, sendo uma delas comercial ou de investimento.  
B. Uma única carteira de qualquer natureza.  
C. Duas carteiras exclusivamente de seguros.  
D. Três carteiras, desde que nenhuma seja comercial nem de investimento.

**Resposta:** A.

**Explicação:** O banco múltiplo deve possuir ao menos duas carteiras, sendo uma comercial ou de investimento.

**Distratores:** B não atinge o mínimo; C usa segmento que não substitui as carteiras bancárias exigidas; D exclui justamente a condição necessária.

## A12 — supervisionado continua operador

**ID:** `eval.sfn.a12`  
**Aula primária:** `banking.sfn.operadores`  
**teaches:** “Não confunda operador com supervisor”  
**sources:** `bcb.supervisionadas`, `bcb.sfn`

**Enunciado:** Uma cooperativa de crédito segue regras e é supervisionada pelo Banco Central. Isso significa que ela:

A. Continua sendo participante operacional; ser supervisionada não a transforma em supervisor.  
B. Passa a integrar o CMN.  
C. Torna-se órgão normativo.  
D. Assume a função do Copom.

**Resposta:** A.

**Explicação:** A instituição supervisionada permanece operadora. Supervisor e supervisionado ocupam papéis diferentes.

**Distratores:** B, C e D confundem sujeição à supervisão com mudança de natureza institucional.

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

A. SUSEP.  
B. PREVIC.  
C. Banco Central.  
D. CVM.

**Resposta:** A.

**Explicação:** O mercado de capitalização está entre os mercados fiscalizados pela SUSEP.

**Distratores:** B cuida de previdência fechada; C e D possuem outros campos de supervisão.

## A15 — instituição de pagamento e crédito próprio

**ID:** `eval.sfn.a15`  
**Aula primária:** `banking.sfn.pagamentos-consorcios`  
**teaches:** “Instituição de pagamento não é banco”  
**sources:** `bcb.instituicao-pagamento`

**Enunciado:** Uma empresa é instituição de pagamento e gerencia contas de pagamento. Qual afirmação é compatível com o conteúdo estudado?

A. Ela não se torna instituição financeira por isso e não pode exercer atividade privativa de instituição financeira por conta própria.  
B. Ela automaticamente se torna banco comercial.  
C. Ela pode definir a meta Selic.  
D. Ela substitui o Banco Central na supervisão do arranjo.

**Resposta:** A.

**Explicação:** Instituição de pagamento não é instituição financeira e não pode exercer atividades privativas destas apenas por atuar em pagamentos.

**Distratores:** B confunde categorias; C e D atribuem competências públicas a operador privado.

## A16 — SPI e forma de liquidação

**ID:** `eval.sfn.a16`  
**Aula primária:** `banking.sfn.pagamentos-consorcios`  
**teaches:** “Pix e SPI”  
**sources:** `bcb.spi`

**Enunciado:** No arranjo Pix, a infraestrutura centralizada gerida pelo Banco Central que liquida transações entre instituições distintas, uma a uma, é:

A. SPI.  
B. CMN.  
C. CVM.  
D. PREVIC.

**Resposta:** A.

**Explicação:** O SPI é a infraestrutura centralizada de liquidação de pagamentos instantâneos e opera em liquidação bruta em tempo real.

**Distratores:** B, C e D são órgãos/entidades com outras finalidades.

---

# FORMA B

## B01 — supervisor x normativo em caso novo

**ID:** `eval.sfn.b01`  
**Aula primária:** `banking.sfn.introducao`  
**teaches:** “Antes dos nomes, entenda a lógica”  
**sources:** `bcb.sfn`

**Enunciado:** Uma entidade recebe competência para verificar se participantes cumprem regras, aplicar supervisão em seu campo e acompanhar riscos do segmento. Sem saber seu nome, a função descrita é principalmente de:

A. Entidade supervisora.  
B. Órgão normativo.  
C. Cliente institucional.  
D. Operador de varejo.

**Resposta:** A.

**Explicação:** Fiscalizar e fazer cumprir regras em determinado campo caracteriza função supervisora.

**Distratores:** B formula diretrizes; C não é categoria funcional do SFN; D executa serviços e operações.

## B02 — sequência lógica de funções

**ID:** `eval.sfn.b02`  
**Aula primária:** `banking.sfn.introducao`  
**teaches:** “Três perguntas que resolvem muita questão”  
**sources:** `bcb.sfn`

**Enunciado:** Qual sequência representa corretamente a passagem da regra geral para a atividade no mercado?

A. Normativo formula diretrizes → supervisor acompanha o cumprimento → operador executa atividades.  
B. Operador formula diretrizes → cliente fiscaliza → supervisor concede crédito.  
C. Supervisor cria clientes → operador fiscaliza → normativo atende o público.  
D. Cliente define política → normativo empresta → operador fiscaliza.

**Resposta:** A.

**Explicação:** A sequência reproduz a divisão funcional ensinada: formulação, supervisão e operação.

**Distratores:** B, C e D trocam as funções entre os grupos.

## B03 — CMN não é supervisor operacional

**ID:** `eval.sfn.b03`  
**Aula primária:** `banking.sfn.cmn`  
**teaches:** “O que lembrar para prova”  
**sources:** `bcb.cmn`

**Enunciado:** Qual atividade seria incompatível com a caracterização do CMN como colegiado normativo superior?

A. Atender correntistas e conceder empréstimos diretamente como atividade bancária cotidiana.  
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
**sources:** `bcb.cmn`

**Enunciado:** Em uma ata hipotética do CMN, qual membro deve aparecer como presidente do colegiado conforme a composição estudada?

A. Ministro da Fazenda.  
B. Presidente da CVM.  
C. Superintendente da SUSEP.  
D. Presidente do Banco do Brasil.

**Resposta:** A.

**Explicação:** O Ministro da Fazenda preside o CMN na composição adotada no curso.

**Distratores:** B, C e D não exercem essa presidência.

## B05 — execução de política cambial

**ID:** `eval.sfn.b05`  
**Aula primária:** `banking.sfn.bacen`  
**teaches:** “Funções que aparecem em prova”  
**sources:** `bcb.competencias`

**Enunciado:** A execução de políticas monetária, cambial e de crédito, dentro das competências legais, é associada principalmente a qual instituição?

A. Banco Central.  
B. CVM.  
C. PREVIC.  
D. Banco comercial.

**Resposta:** A.

**Explicação:** O BCB executa políticas monetária, cambial e de crédito e supervisiona o sistema em seu campo.

**Distratores:** B e C são supervisores de outros segmentos; D é operador.

## B06 — erro clássico sobre BCB

**ID:** `eval.sfn.b06`  
**Aula primária:** `banking.sfn.bacen`  
**teaches:** “Pegadinha clássica”  
**sources:** `bcb.sfn`, `bcb.competencias`

**Enunciado:** Qual afirmação deve ser rejeitada?

A. “O Banco Central é o órgão normativo superior do SFN, acima do CMN.”  
B. “O Banco Central supervisiona instituições em sua competência.”  
C. “O Banco Central executa políticas em sua competência.”  
D. “CMN e Banco Central possuem funções institucionais distintas.”

**Resposta:** A.

**Explicação:** O órgão normativo superior é o CMN. O BCB possui funções supervisoras, regulatórias e executivas, mas não substitui essa posição do Conselho.

**Distratores:** B, C e D refletem a distinção ensinada.

## B07 — duas sessões do Copom

**ID:** `eval.sfn.b07`  
**Aula primária:** `banking.sfn.copom`  
**teaches:** “Ritmo das reuniões”  
**sources:** `bcb.copom`

**Enunciado:** Nas reuniões ordinárias do Copom descritas no curso, as duas sessões cumprem, em linhas gerais, quais funções?

A. Apresentações técnicas e decisão da meta para a Selic.  
B. Aprovação de orçamento federal e concessão de crédito.  
C. Fiscalização de seguradoras e julgamento de ofertas públicas.  
D. Registro de consórcios e autorização de fundos de pensão.

**Resposta:** A.

**Explicação:** A regulamentação estudada organiza a reunião ordinária em sessão de apresentações técnicas e sessão de decisão da meta Selic.

**Distratores:** B, C e D atribuem matérias de outros órgãos/segmentos.

## B08 — composição versus competência do Copom

**ID:** `eval.sfn.b08`  
**Aula primária:** `banking.sfn.copom`  
**teaches:** “Onde o Copom fica” + “A decisão central”  
**sources:** `bcb.copom`

**Enunciado:** Qual alternativa combina corretamente composição e competência?

A. Presidente e Diretores do BCB — definição da meta para a Taxa Selic.  
B. Ministros do CMN — fiscalização de companhias abertas.  
C. Diretores da CVM — definição da meta Selic.  
D. Presidentes dos bancos públicos — supervisão de previdência fechada.

**Resposta:** A.

**Explicação:** O Copom é composto pelo Presidente e Diretores do BCB e define a meta Selic.

**Distratores:** B, C e D combinam participantes e competências de forma incorreta.

## B09 — proteção do investidor e manipulação

**ID:** `eval.sfn.b09`  
**Aula primária:** `banking.sfn.cvm`  
**teaches:** “Quem aparece sob sua supervisão”  
**sources:** `cvm.papel`, `cvm.competencia`

**Enunciado:** Uma investigação envolve manipulação de mercado em negociações de valores mobiliários e proteção dos investidores. Qual entidade está no centro dessa atribuição?

A. CVM.  
B. SUSEP.  
C. PREVIC.  
D. Copom.

**Resposta:** A.

**Explicação:** Integridade do mercado de valores mobiliários, repressão a fraudes/manipulações e proteção de investidores estão no campo da CVM.

**Distratores:** B, C e D atuam em segmentos diferentes.

## B10 — fundos de investimento como pista

**ID:** `eval.sfn.b10`  
**Aula primária:** `banking.sfn.cvm`  
**teaches:** “Quem aparece sob sua supervisão”  
**sources:** `cvm.competencia`

**Enunciado:** Qual palavra-chave, isoladamente, é a pista mais forte para investigar a competência da CVM no contexto apresentado pelo curso?

A. Fundo de investimento.  
B. Depósito à vista.  
C. Consórcio.  
D. Previdência complementar fechada.

**Resposta:** A.

**Explicação:** Fundos de investimento aparecem entre os participantes/estruturas do mercado de valores mobiliários sujeitos à esfera da CVM.

**Distratores:** B remete a banco comercial; C ao BCB; D à PREVIC.

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

A. A financeira continua sendo operadora; o BCB exerce a função supervisora.  
B. A financeira passa a ser órgão normativo.  
C. A financeira passa a integrar o Copom.  
D. A financeira assume competência sobre companhias abertas.

**Resposta:** A.

**Explicação:** Ser supervisionado não converte o participante em supervisor; a financeira continua no lado operacional.

**Distratores:** B, C e D atribuem funções públicas incompatíveis.

## B13 — aberta x fechada pelo supervisor

**ID:** `eval.sfn.b13`  
**Aula primária:** `banking.sfn.seguros-previdencia`  
**teaches:** “Previdência aberta e fechada não são a mesma coisa”  
**sources:** `susep.previdencia-aberta`, `previc.missao`

**Enunciado:** Qual par está corretamente associado?

A. Previdência complementar aberta — SUSEP; previdência complementar fechada — PREVIC.  
B. Previdência complementar aberta — PREVIC; fechada — Copom.  
C. Aberta — CVM; fechada — Banco Central.  
D. Aberta — CMN; fechada — CNSP.

**Resposta:** A.

**Explicação:** A SUSEP supervisiona a previdência complementar aberta; a PREVIC, as entidades fechadas.

**Distratores:** B, C e D trocam os supervisores.

## B14 — CNSP x SUSEP

**ID:** `eval.sfn.b14`  
**Aula primária:** `banking.sfn.seguros-previdencia`  
**teaches:** “CNSP e SUSEP” + “Mapa mental”  
**sources:** `susep.sobre`

**Enunciado:** No segmento de seguros privados, qual relação funcional está correta?

A. CNSP fixa diretrizes/normas e SUSEP controla e fiscaliza os mercados sob sua competência.  
B. SUSEP fixa a meta Selic e CNSP supervisiona bancos.  
C. PREVIC define política monetária e SUSEP fiscaliza companhias abertas.  
D. CVM normatiza previdência fechada e CNSP administra consórcios.

**Resposta:** A.

**Explicação:** O CNSP exerce função normativa do segmento; a SUSEP é entidade supervisora dos mercados de seguros, previdência aberta, capitalização e resseguro.

**Distratores:** B, C e D misturam competências de segmentos distintos.

## B15 — consórcio sem promessa de contemplação

**ID:** `eval.sfn.b15`  
**Aula primária:** `banking.sfn.pagamentos-consorcios`  
**teaches:** “Consórcio é autofinanciamento”  
**sources:** `bcb.consorcio`

**Enunciado:** Uma propaganda afirma que a simples adesão a um grupo de consórcio garante contemplação imediata. À luz do conteúdo estudado, a afirmação é:

A. Incorreta; consórcio é mecanismo de autofinanciamento em grupo e adesão não garante contemplação imediata.  
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

A. Conjunto de infraestruturas, arranjos, regras e participantes que permitem transferências e liquidação de obrigações.  
B. Um único banco comercial responsável por todo pagamento no país.  
C. Um fundo de investimento administrado pela CVM.  
D. Um órgão colegiado que define a meta Selic.

**Resposta:** A.

**Explicação:** O SPB é um sistema composto por infraestruturas, arranjos, regras e participantes; não uma instituição bancária isolada.

**Distratores:** B reduz o sistema a um banco; C e D pertencem a outros conceitos.

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

## 4. Revisão ainda obrigatória antes de virar catálogo

Antes de qualquer item entrar no código:
1. comparar semanticamente com as 38 questões de treino e as 12 do Chefe, rejeitando paráfrase excessivamente próxima;
2. conferir cada resposta nas fontes oficiais já catalogadas;
3. confirmar que todo conhecimento aparece na aula/trecho indicado;
4. revisar equilíbrio de dificuldade e comprimento das alternativas;
5. revisar pistas gramaticais que revelem a resposta;
6. registrar versão editorial de cada item;
7. gerar teste que assegure A ∩ B = ∅;
8. garantir que o bootstrap comum nunca importe este banco.

A conclusão deste rascunho **não altera cobertura curricular, prontidão, XP nem percentual de aprendizado do usuário**.
