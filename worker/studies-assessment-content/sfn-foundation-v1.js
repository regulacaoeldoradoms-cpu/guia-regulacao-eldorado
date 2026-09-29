'use strict';

export const ASSESSMENT_VERSION = 1;
export const BLOCK_ID = 'banking.sfn-foundation';
export const BLOCK_CONTENT_VERSION = 2;
export const FORM_IDS = Object.freeze(['A','B']);
export const FORM_SIZE = 16;
export const REQUIRED_TOPIC_IDS = Object.freeze([
  'banking.sfn.introducao',
  'banking.sfn.cmn',
  'banking.sfn.bacen',
  'banking.sfn.copom',
  'banking.sfn.cvm',
  'banking.sfn.operadores',
  'banking.sfn.seguros-previdencia',
  'banking.sfn.pagamentos-consorcios',
  'banking.sfn.boss'
]);

const QUESTIONS = [
  {
    "id": "eval.sfn.a01",
    "formId": "A",
    "code": "A01",
    "title": "classificar pela função, não pelo nome",
    "primaryLessonId": "banking.sfn.introducao",
    "teaches": [
      "“Antes dos nomes, entenda a lógica” + “Três perguntas que resolvem muita questão”"
    ],
    "competencyIds": [
      "sfn.classificacao-funcional"
    ],
    "sourceIds": [
      "bcb.sfn"
    ],
    "prompt": "Uma entidade não atende clientes nem executa operações de crédito. Sua função central é estabelecer diretrizes gerais que serão observadas por outros participantes do sistema. Em qual grupo funcional ela se enquadra?",
    "options": [
      "Operadores",
      "Órgãos normativos",
      "Instituições de pagamento",
      "Intermediários de mercado"
    ],
    "answer": 1,
    "explanation": "O elemento decisivo é a função de formular diretrizes gerais. Isso caracteriza órgão normativo, independentemente do nome da entidade.",
    "distractorRationale": "A confunde execução com formulação; C é espécie de participante operacional; D descreve atuação de mercado, não função normativa."
  },
  {
    "id": "eval.sfn.a02",
    "formId": "A",
    "code": "A02",
    "title": "reconhecer o operador em situação concreta",
    "primaryLessonId": "banking.sfn.introducao",
    "teaches": [
      "“Três perguntas que resolvem muita questão”"
    ],
    "competencyIds": [
      "sfn.classificacao-funcional"
    ],
    "sourceIds": [
      "bcb.sfn"
    ],
    "prompt": "Quatro instituições são descritas apenas por suas atividades. Qual descrição indica mais claramente um operador do sistema?",
    "options": [
      "Define diretrizes para moeda e crédito.",
      "Fiscaliza participantes de um segmento.",
      "Recebe recursos de clientes e realiza operações financeiras autorizadas.",
      "Delibera sobre orientações gerais de política econômica."
    ],
    "answer": 2,
    "explanation": "Operadores executam atividades e serviços no mercado. Receber recursos e realizar operações financeiras é comportamento operacional.",
    "distractorRationale": "A e D são funções normativas; B é função supervisora."
  },
  {
    "id": "eval.sfn.a03",
    "formId": "A",
    "code": "A03",
    "title": "relação CMN/execução",
    "primaryLessonId": "banking.sfn.cmn",
    "teaches": [
      "“O órgão superior” + “O que lembrar para prova”"
    ],
    "competencyIds": [
      "sfn.cmn-diretrizes"
    ],
    "sourceIds": [
      "bcb.cmn"
    ],
    "prompt": "Uma questão afirma: “Como órgão superior do SFN, o CMN formula diretrizes da política da moeda e do crédito; a execução cotidiana dessas diretrizes cabe a entidades competentes, e não ao próprio Conselho como banco operacional.” A afirmação é:",
    "options": [
      "Correta.",
      "Incorreta, pois o CMN é banco comercial.",
      "Incorreta, pois o CMN fiscaliza exclusivamente companhias abertas.",
      "Incorreta, pois o CMN apenas administra o orçamento federal."
    ],
    "answer": 0,
    "explanation": "O CMN é órgão normativo superior e formula políticas/diretrizes; não funciona como banco operacional.",
    "distractorRationale": "B troca órgão normativo por operador; C desloca atribuição para o campo da CVM; D confunde SFN com execução orçamentária."
  },
  {
    "id": "eval.sfn.a04",
    "formId": "A",
    "code": "A04",
    "title": "composição do CMN em cenário de substituição",
    "primaryLessonId": "banking.sfn.cmn",
    "teaches": [
      "“Composição atual”"
    ],
    "competencyIds": [
      "sfn.cmn-diretrizes"
    ],
    "sourceIds": [
      "fazenda.cmn.apresentacao"
    ],
    "prompt": "Qual conjunto corresponde à composição ensinada para o Conselho Monetário Nacional nesta versão do curso?",
    "options": [
      "Ministro da Fazenda, Ministro do Planejamento e Orçamento e Presidente do Banco Central.",
      "Presidente da República, Presidente da CVM e Ministro da Fazenda.",
      "Ministro da Fazenda, Presidente do Banco do Brasil e Presidente da CAIXA.",
      "Presidente do Banco Central, Presidente da CVM e Superintendente da SUSEP."
    ],
    "answer": 0,
    "explanation": "A composição adotada no material é formada pelo Ministro da Fazenda, pelo Ministro do Planejamento e Orçamento e pelo Presidente do BCB.",
    "distractorRationale": "B, C e D incluem autoridades que não compõem o colegiado apresentado."
  },
  {
    "id": "eval.sfn.a05",
    "formId": "A",
    "code": "A05",
    "title": "distinguir execução/supervisão de formulação superior",
    "primaryLessonId": "banking.sfn.bacen",
    "teaches": [
      "“A ponte entre diretriz e execução” + “Pegadinha clássica”"
    ],
    "competencyIds": [
      "sfn.bcb-execucao-supervisao"
    ],
    "sourceIds": [
      "bcb.competencias",
      "bcb.sfn"
    ],
    "prompt": "Uma alternativa descreve determinada instituição como “autarquia de natureza especial que supervisiona participantes e executa políticas de sua competência, sem ser o órgão normativo superior do SFN”. A descrição corresponde a:",
    "options": [
      "Banco Central do Brasil.",
      "Conselho Monetário Nacional.",
      "Conselho Nacional de Seguros Privados.",
      "Banco comercial."
    ],
    "answer": 0,
    "explanation": "A combinação autarquia + supervisão + execução de políticas é característica do BCB; o órgão normativo superior é o CMN.",
    "distractorRationale": "B é colegiado normativo; C pertence ao segmento de seguros; D é operador."
  },
  {
    "id": "eval.sfn.a06",
    "formId": "A",
    "code": "A06",
    "title": "banco dos bancos em uma necessidade interbancária",
    "primaryLessonId": "banking.sfn.bacen",
    "teaches": [
      "seção `banco-dos-bancos`"
    ],
    "competencyIds": [
      "sfn.bcb-execucao-supervisao"
    ],
    "sourceIds": [
      "bcb.competencias"
    ],
    "prompt": "Uma instituição financeira precisa usar estruturas mantidas pela autoridade monetária para movimentar e liquidar recursos no relacionamento entre instituições. Qual função do Banco Central ajuda a compreender esse papel?",
    "options": [
      "Banco dos bancos.",
      "Atendimento bancário de varejo.",
      "Administração de fundos de pensão.",
      "Fiscalização de ofertas públicas de ações."
    ],
    "answer": 0,
    "explanation": "A expressão “banco dos bancos” resume relações e estruturas do Banco Central voltadas ao funcionamento entre instituições, não ao atendimento bancário comum do público.",
    "distractorRationale": "B descreve operador de varejo; C remete à previdência fechada; D ao mercado de valores mobiliários."
  },
  {
    "id": "eval.sfn.a07",
    "formId": "A",
    "code": "A07",
    "title": "decisão de política monetária",
    "primaryLessonId": "banking.sfn.copom",
    "teaches": [
      "“A decisão central”"
    ],
    "competencyIds": [
      "sfn.copom-politica-monetaria"
    ],
    "sourceIds": [
      "bcb.copom"
    ],
    "prompt": "Após analisar cenário macroeconômico e riscos, um colegiado define a meta de uma taxa básica que orienta a execução da política monetária. Qual colegiado é esse?",
    "options": [
      "Copom.",
      "CVM.",
      "CNSP.",
      "PREVIC."
    ],
    "answer": 0,
    "explanation": "O Copom define a meta para a Taxa Selic e orientações estratégicas da política monetária.",
    "distractorRationale": "B atua em valores mobiliários; C em diretrizes de seguros; D supervisiona previdência complementar fechada."
  },
  {
    "id": "eval.sfn.a08",
    "formId": "A",
    "code": "A08",
    "title": "reconhecer o colegiado pela composição",
    "primaryLessonId": "banking.sfn.copom",
    "teaches": [
      "seções `nome` e `composicao`"
    ],
    "competencyIds": [
      "sfn.copom-politica-monetaria"
    ],
    "sourceIds": [
      "bcb.copom"
    ],
    "prompt": "Um enunciado descreve um colegiado que funciona no âmbito do Banco Central e é formado pelo Presidente e pelos Diretores da própria instituição. Qual colegiado foi descrito?",
    "options": [
      "Copom.",
      "CMN.",
      "CVM.",
      "CNSP."
    ],
    "answer": 0,
    "explanation": "A composição Presidente + Diretores do Banco Central identifica o Copom no conteúdo ensinado.",
    "distractorRationale": "B possui composição diferente; C é autarquia do mercado de valores mobiliários; D é conselho do segmento de seguros."
  },
  {
    "id": "eval.sfn.a09",
    "formId": "A",
    "code": "A09",
    "title": "identificar CVM pelo objeto",
    "primaryLessonId": "banking.sfn.cvm",
    "teaches": [
      "“O território da CVM” + “CVM não é Banco Central”"
    ],
    "competencyIds": [
      "sfn.cvm-valores-mobiliarios"
    ],
    "sourceIds": [
      "cvm.papel",
      "cvm.competencia"
    ],
    "prompt": "Uma empresa pretende captar recursos por oferta pública de valores mobiliários a investidores. Qual supervisor aparece de forma mais direta nesse contexto?",
    "options": [
      "CVM.",
      "PREVIC.",
      "SUSEP.",
      "Copom."
    ],
    "answer": 0,
    "explanation": "Oferta pública e valores mobiliários pertencem ao núcleo de atuação da CVM.",
    "distractorRationale": "B trata de entidades fechadas de previdência; C de seguros e mercados correlatos; D decide política monetária."
  },
  {
    "id": "eval.sfn.a10",
    "formId": "A",
    "code": "A10",
    "title": "distinguir produto bancário de valor mobiliário",
    "primaryLessonId": "banking.sfn.cvm",
    "teaches": [
      "“CVM não é Banco Central”"
    ],
    "competencyIds": [
      "sfn.cvm-valores-mobiliarios"
    ],
    "sourceIds": [
      "cvm.competencia",
      "bcb.supervisionadas"
    ],
    "prompt": "Qual situação aponta mais diretamente para a esfera da CVM, e não para a supervisão bancária tradicional do Banco Central?",
    "options": [
      "Integridade de uma oferta pública de valores mobiliários.",
      "Funcionamento de conta corrente em banco comercial.",
      "Autorização de administradora de consórcio.",
      "Supervisão de uma cooperativa de crédito."
    ],
    "answer": 0,
    "explanation": "A CVM atua no mercado de valores mobiliários e ofertas públicas; as demais situações se relacionam mais diretamente ao BCB.",
    "distractorRationale": "B, C e D estão ligados a participantes/atividades supervisionados pelo Banco Central."
  },
  {
    "id": "eval.sfn.a11",
    "formId": "A",
    "code": "A11",
    "title": "reconhecer banco múltiplo em uma configuração nova",
    "primaryLessonId": "banking.sfn.operadores",
    "teaches": [
      "seções `carteira`, `multiplo` e `exemplo-carteiras`"
    ],
    "competencyIds": [
      "sfn.operadores-instituicoes"
    ],
    "sourceIds": [
      "cmn.bancos.5060"
    ],
    "prompt": "Uma instituição reúne, sob a mesma organização, uma carteira comercial e uma carteira de investimento. Considerando apenas a regra de carteiras ensinada, essa configuração é compatível com a classificação de:",
    "options": [
      "Banco múltiplo.",
      "Instituição de pagamento sem carteira bancária.",
      "Órgão normativo.",
      "Entidade fechada de previdência complementar."
    ],
    "answer": 0,
    "explanation": "Há pelo menos duas carteiras e uma delas é comercial ou de investimento, satisfazendo a regra básica estudada para banco múltiplo.",
    "distractorRationale": "B não descreve a organização por carteiras bancárias; C não é operador; D pertence a outro segmento."
  },
  {
    "id": "eval.sfn.a12",
    "formId": "A",
    "code": "A12",
    "title": "supervisionado continua operador",
    "primaryLessonId": "banking.sfn.operadores",
    "teaches": [
      "“Não confunda operador com supervisor”"
    ],
    "competencyIds": [
      "sfn.operadores-instituicoes"
    ],
    "sourceIds": [
      "bcb.supervisionadas",
      "bcb.sfn"
    ],
    "prompt": "Uma cooperativa de crédito segue regras e é supervisionada pelo Banco Central. Isso significa que ela:",
    "options": [
      "Continua sendo participante operacional; ser supervisionada não a transforma em supervisor.",
      "Passa a integrar o CMN.",
      "Torna-se órgão normativo.",
      "Assume a função do Copom."
    ],
    "answer": 0,
    "explanation": "A instituição supervisionada permanece operadora. Supervisor e supervisionado ocupam papéis diferentes.",
    "distractorRationale": "B, C e D confundem sujeição à supervisão com mudança de natureza institucional."
  },
  {
    "id": "eval.sfn.a13",
    "formId": "A",
    "code": "A13",
    "title": "aberta x fechada por vínculo",
    "primaryLessonId": "banking.sfn.seguros-previdencia",
    "teaches": [
      "“Previdência aberta e fechada não são a mesma coisa”"
    ],
    "competencyIds": [
      "sfn.seguros-previdencia-supervisao"
    ],
    "sourceIds": [
      "susep.previdencia-aberta",
      "previc.como-participar"
    ],
    "prompt": "Um plano é administrado por entidade fechada de previdência complementar e pressupõe vínculo com patrocinador ou instituidor. Qual supervisor deve ser associado ao caso?",
    "options": [
      "PREVIC.",
      "SUSEP.",
      "CVM.",
      "Copom."
    ],
    "answer": 0,
    "explanation": "Entidades fechadas de previdência complementar, os fundos de pensão, estão sob supervisão da PREVIC.",
    "distractorRationale": "B supervisiona previdência complementar aberta; C mercado de valores mobiliários; D política monetária."
  },
  {
    "id": "eval.sfn.a14",
    "formId": "A",
    "code": "A14",
    "title": "capitalização e supervisor",
    "primaryLessonId": "banking.sfn.seguros-previdencia",
    "teaches": [
      "“Capitalização entra no mesmo radar da SUSEP”"
    ],
    "competencyIds": [
      "sfn.seguros-previdencia-supervisao"
    ],
    "sourceIds": [
      "susep.sobre"
    ],
    "prompt": "Uma prova apresenta um título de capitalização e pergunta qual autarquia fiscaliza esse mercado. A resposta correta é:",
    "options": [
      "SUSEP.",
      "PREVIC.",
      "Banco Central.",
      "CVM."
    ],
    "answer": 0,
    "explanation": "O mercado de capitalização está entre os mercados fiscalizados pela SUSEP.",
    "distractorRationale": "B cuida de previdência fechada; C e D possuem outros campos de supervisão."
  },
  {
    "id": "eval.sfn.a15",
    "formId": "A",
    "code": "A15",
    "title": "instituição de pagamento e crédito próprio",
    "primaryLessonId": "banking.sfn.pagamentos-consorcios",
    "teaches": [
      "“Instituição de pagamento não é banco”"
    ],
    "competencyIds": [
      "sfn.pagamentos-consorcios"
    ],
    "sourceIds": [
      "bcb.instituicao-pagamento"
    ],
    "prompt": "Uma empresa é instituição de pagamento e gerencia contas de pagamento. Qual afirmação é compatível com o conteúdo estudado?",
    "options": [
      "Ela não se torna instituição financeira por isso e não pode exercer atividade privativa de instituição financeira por conta própria.",
      "Ela automaticamente se torna banco comercial.",
      "Ela pode definir a meta Selic.",
      "Ela substitui o Banco Central na supervisão do arranjo."
    ],
    "answer": 0,
    "explanation": "Instituição de pagamento não é instituição financeira e não pode exercer atividades privativas destas apenas por atuar em pagamentos.",
    "distractorRationale": "B confunde categorias; C e D atribuem competências públicas a operador privado."
  },
  {
    "id": "eval.sfn.a16",
    "formId": "A",
    "code": "A16",
    "title": "SPI e forma de liquidação",
    "primaryLessonId": "banking.sfn.pagamentos-consorcios",
    "teaches": [
      "“Pix e SPI”"
    ],
    "competencyIds": [
      "sfn.pagamentos-consorcios"
    ],
    "sourceIds": [
      "bcb.spi"
    ],
    "prompt": "No arranjo Pix, a infraestrutura centralizada gerida pelo Banco Central que liquida transações entre instituições distintas, uma a uma, é:",
    "options": [
      "SPI.",
      "CMN.",
      "CVM.",
      "PREVIC."
    ],
    "answer": 0,
    "explanation": "O SPI é a infraestrutura centralizada de liquidação de pagamentos instantâneos e opera em liquidação bruta em tempo real.",
    "distractorRationale": "B, C e D são órgãos/entidades com outras finalidades."
  },
  {
    "id": "eval.sfn.b01",
    "formId": "B",
    "code": "B01",
    "title": "supervisor x normativo em caso novo",
    "primaryLessonId": "banking.sfn.introducao",
    "teaches": [
      "“Antes dos nomes, entenda a lógica”"
    ],
    "competencyIds": [
      "sfn.classificacao-funcional"
    ],
    "sourceIds": [
      "bcb.sfn"
    ],
    "prompt": "Uma entidade recebe competência para verificar se participantes cumprem regras, aplicar supervisão em seu campo e acompanhar riscos do segmento. Sem saber seu nome, a função descrita é principalmente de:",
    "options": [
      "Entidade supervisora.",
      "Órgão normativo.",
      "Cliente institucional.",
      "Operador de varejo."
    ],
    "answer": 0,
    "explanation": "Fiscalizar e fazer cumprir regras em determinado campo caracteriza função supervisora.",
    "distractorRationale": "B formula diretrizes; C não é categoria funcional do SFN; D executa serviços e operações."
  },
  {
    "id": "eval.sfn.b02",
    "formId": "B",
    "code": "B02",
    "title": "sequência lógica de funções",
    "primaryLessonId": "banking.sfn.introducao",
    "teaches": [
      "“Três perguntas que resolvem muita questão”"
    ],
    "competencyIds": [
      "sfn.classificacao-funcional"
    ],
    "sourceIds": [
      "bcb.sfn"
    ],
    "prompt": "Qual sequência representa corretamente a passagem da regra geral para a atividade no mercado?",
    "options": [
      "Normativo formula diretrizes → supervisor acompanha o cumprimento → operador executa atividades.",
      "Operador formula diretrizes → cliente fiscaliza → supervisor concede crédito.",
      "Supervisor cria clientes → operador fiscaliza → normativo atende o público.",
      "Cliente define política → normativo empresta → operador fiscaliza."
    ],
    "answer": 0,
    "explanation": "A sequência reproduz a divisão funcional ensinada: formulação, supervisão e operação.",
    "distractorRationale": "B, C e D trocam as funções entre os grupos."
  },
  {
    "id": "eval.sfn.b03",
    "formId": "B",
    "code": "B03",
    "title": "CMN não é supervisor operacional",
    "primaryLessonId": "banking.sfn.cmn",
    "teaches": [
      "“O que lembrar para prova”"
    ],
    "competencyIds": [
      "sfn.cmn-diretrizes"
    ],
    "sourceIds": [
      "bcb.cmn"
    ],
    "prompt": "Qual atividade seria incompatível com a caracterização do CMN como colegiado normativo superior?",
    "options": [
      "Atender correntistas e conceder empréstimos diretamente como atividade bancária cotidiana.",
      "Formular política da moeda e do crédito.",
      "Estabelecer diretrizes gerais para o sistema.",
      "Orientar por normas a atuação das entidades competentes."
    ],
    "answer": 0,
    "explanation": "O CMN não é banco operacional que atende clientes; suas funções são normativas.",
    "distractorRationale": "B, C e D são compatíveis com o papel normativo ensinado."
  },
  {
    "id": "eval.sfn.b04",
    "formId": "B",
    "code": "B04",
    "title": "presidência do CMN",
    "primaryLessonId": "banking.sfn.cmn",
    "teaches": [
      "“Composição atual”"
    ],
    "competencyIds": [
      "sfn.cmn-diretrizes"
    ],
    "sourceIds": [
      "fazenda.cmn.apresentacao"
    ],
    "prompt": "Em uma ata hipotética do CMN, qual membro deve aparecer como presidente do colegiado conforme a composição estudada?",
    "options": [
      "Ministro da Fazenda.",
      "Presidente da CVM.",
      "Superintendente da SUSEP.",
      "Presidente do Banco do Brasil."
    ],
    "answer": 0,
    "explanation": "O Ministro da Fazenda preside o CMN na composição adotada no curso.",
    "distractorRationale": "B, C e D não exercem essa presidência."
  },
  {
    "id": "eval.sfn.b05",
    "formId": "B",
    "code": "B05",
    "title": "execução de política cambial",
    "primaryLessonId": "banking.sfn.bacen",
    "teaches": [
      "“Funções que aparecem em prova”"
    ],
    "competencyIds": [
      "sfn.bcb-execucao-supervisao"
    ],
    "sourceIds": [
      "bcb.competencias"
    ],
    "prompt": "A execução de políticas monetária, cambial e de crédito, dentro das competências legais, é associada principalmente a qual instituição?",
    "options": [
      "Banco Central.",
      "CVM.",
      "PREVIC.",
      "Banco comercial."
    ],
    "answer": 0,
    "explanation": "O BCB executa políticas monetária, cambial e de crédito e supervisiona o sistema em seu campo.",
    "distractorRationale": "B e C são supervisores de outros segmentos; D é operador."
  },
  {
    "id": "eval.sfn.b06",
    "formId": "B",
    "code": "B06",
    "title": "erro clássico sobre BCB",
    "primaryLessonId": "banking.sfn.bacen",
    "teaches": [
      "“Pegadinha clássica”"
    ],
    "competencyIds": [
      "sfn.bcb-execucao-supervisao"
    ],
    "sourceIds": [
      "bcb.sfn",
      "bcb.competencias"
    ],
    "prompt": "Qual afirmação deve ser rejeitada?",
    "options": [
      "“O Banco Central é o órgão normativo superior do SFN, acima do CMN.”",
      "“O Banco Central supervisiona instituições em sua competência.”",
      "“O Banco Central executa políticas em sua competência.”",
      "“CMN e Banco Central possuem funções institucionais distintas.”"
    ],
    "answer": 0,
    "explanation": "O órgão normativo superior é o CMN. O BCB possui funções supervisoras, regulatórias e executivas, mas não substitui essa posição do Conselho.",
    "distractorRationale": "B, C e D refletem a distinção ensinada."
  },
  {
    "id": "eval.sfn.b07",
    "formId": "B",
    "code": "B07",
    "title": "meta Selic não é a taxa de todo contrato",
    "primaryLessonId": "banking.sfn.copom",
    "teaches": [
      "seções `selic`, `meta` e `relacao`"
    ],
    "competencyIds": [
      "sfn.copom-politica-monetaria"
    ],
    "sourceIds": [
      "bcb.copom"
    ],
    "prompt": "Após uma decisão do Copom, um cliente conclui que todo empréstimo bancário deverá ter exatamente a mesma taxa definida pelo colegiado. Qual correção é adequada?",
    "options": [
      "O Copom define a meta para a Selic; a taxa de um contrato também depende de condições como prazo, risco e custos.",
      "A conclusão está correta: a meta Selic é obrigatoriamente a taxa de todo empréstimo.",
      "O Copom define apenas taxas de seguros privados.",
      "A taxa de cada empréstimo é definida diretamente pelo CMN para cada cliente."
    ],
    "answer": 0,
    "explanation": "A aula diferencia a meta da taxa básica das taxas específicas dos contratos de crédito.",
    "distractorRationale": "B confunde meta macroeconômica com preço individual; C desloca o assunto para seguros; D atribui análise individual de contrato ao CMN."
  },
  {
    "id": "eval.sfn.b08",
    "formId": "B",
    "code": "B08",
    "title": "dois sentidos relacionados à palavra Selic",
    "primaryLessonId": "banking.sfn.copom",
    "teaches": [
      "seções `selic` e `meta`"
    ],
    "competencyIds": [
      "sfn.copom-politica-monetaria"
    ],
    "sourceIds": [
      "bcb.copom"
    ],
    "prompt": "Qual afirmação organiza corretamente o uso da palavra “Selic” no conteúdo estudado?",
    "options": [
      "O nome vem do Sistema Especial de Liquidação e de Custódia; no contexto de juros, fala-se na taxa básica cuja meta é definida pelo Copom.",
      "Selic é o nome de um banco comercial que concede empréstimos ao público.",
      "Selic é uma modalidade de previdência complementar fechada.",
      "Selic é o órgão que fiscaliza companhias abertas."
    ],
    "answer": 0,
    "explanation": "A aula distingue a origem do nome Selic e o uso da expressão taxa Selic no contexto dos juros básicos e de sua meta.",
    "distractorRationale": "B, C e D confundem a expressão com instituições/segmentos sem relação com essa definição."
  },
  {
    "id": "eval.sfn.b09",
    "formId": "B",
    "code": "B09",
    "title": "proteção do investidor e manipulação",
    "primaryLessonId": "banking.sfn.cvm",
    "teaches": [
      "“Quem aparece sob sua supervisão”"
    ],
    "competencyIds": [
      "sfn.cvm-valores-mobiliarios"
    ],
    "sourceIds": [
      "cvm.papel",
      "cvm.competencia"
    ],
    "prompt": "Uma investigação envolve manipulação de mercado em negociações de valores mobiliários e proteção dos investidores. Qual entidade está no centro dessa atribuição?",
    "options": [
      "CVM.",
      "SUSEP.",
      "PREVIC.",
      "Copom."
    ],
    "answer": 0,
    "explanation": "Integridade do mercado de valores mobiliários, repressão a fraudes/manipulações e proteção de investidores estão no campo da CVM.",
    "distractorRationale": "B, C e D atuam em segmentos diferentes."
  },
  {
    "id": "eval.sfn.b10",
    "formId": "B",
    "code": "B10",
    "title": "fundos de investimento como pista",
    "primaryLessonId": "banking.sfn.cvm",
    "teaches": [
      "“Quem aparece sob sua supervisão”"
    ],
    "competencyIds": [
      "sfn.cvm-valores-mobiliarios"
    ],
    "sourceIds": [
      "cvm.competencia"
    ],
    "prompt": "Qual palavra-chave, isoladamente, é a pista mais forte para investigar a competência da CVM no contexto apresentado pelo curso?",
    "options": [
      "Fundo de investimento.",
      "Depósito à vista.",
      "Consórcio.",
      "Previdência complementar fechada."
    ],
    "answer": 0,
    "explanation": "Fundos de investimento aparecem entre os participantes/estruturas do mercado de valores mobiliários sujeitos à esfera da CVM.",
    "distractorRationale": "B remete a banco comercial; C ao BCB; D à PREVIC."
  },
  {
    "id": "eval.sfn.b11",
    "formId": "B",
    "code": "B11",
    "title": "banco comercial reconhecido pela atividade",
    "primaryLessonId": "banking.sfn.operadores",
    "teaches": [
      "“Banco comercial e banco múltiplo”"
    ],
    "competencyIds": [
      "sfn.operadores-instituicoes"
    ],
    "sourceIds": [
      "cmn.bancos.5060",
      "bcb.supervisionadas"
    ],
    "prompt": "Qual atividade ajuda a identificar um banco comercial em uma questão?",
    "options": [
      "Captação de depósitos à vista.",
      "Definição da meta Selic.",
      "Fiscalização de ofertas públicas.",
      "Supervisão de entidades fechadas de previdência."
    ],
    "answer": 0,
    "explanation": "A captação de depósitos à vista é uma atividade típica do banco comercial.",
    "distractorRationale": "B pertence ao Copom; C à CVM; D à PREVIC."
  },
  {
    "id": "eval.sfn.b12",
    "formId": "B",
    "code": "B12",
    "title": "operador não vira regulador",
    "primaryLessonId": "banking.sfn.operadores",
    "teaches": [
      "“A pergunta de prova” + “Não confunda operador com supervisor”"
    ],
    "competencyIds": [
      "sfn.operadores-instituicoes"
    ],
    "sourceIds": [
      "bcb.sfn",
      "bcb.supervisionadas"
    ],
    "prompt": "Uma financeira é autorizada e fiscalizada pelo Banco Central. Qual conclusão é correta?",
    "options": [
      "A financeira continua sendo operadora; o BCB exerce a função supervisora.",
      "A financeira passa a ser órgão normativo.",
      "A financeira passa a integrar o Copom.",
      "A financeira assume competência sobre companhias abertas."
    ],
    "answer": 0,
    "explanation": "Ser supervisionado não converte o participante em supervisor; a financeira continua no lado operacional.",
    "distractorRationale": "B, C e D atribuem funções públicas incompatíveis."
  },
  {
    "id": "eval.sfn.b13",
    "formId": "B",
    "code": "B13",
    "title": "aberta x fechada pelo supervisor",
    "primaryLessonId": "banking.sfn.seguros-previdencia",
    "teaches": [
      "“Previdência aberta e fechada não são a mesma coisa”"
    ],
    "competencyIds": [
      "sfn.seguros-previdencia-supervisao"
    ],
    "sourceIds": [
      "susep.previdencia-aberta",
      "previc.missao"
    ],
    "prompt": "Qual par está corretamente associado?",
    "options": [
      "Previdência complementar aberta — SUSEP; previdência complementar fechada — PREVIC.",
      "Previdência complementar aberta — PREVIC; fechada — Copom.",
      "Aberta — CVM; fechada — Banco Central.",
      "Aberta — CMN; fechada — CNSP."
    ],
    "answer": 0,
    "explanation": "A SUSEP supervisiona a previdência complementar aberta; a PREVIC, as entidades fechadas.",
    "distractorRationale": "B, C e D trocam os supervisores."
  },
  {
    "id": "eval.sfn.b14",
    "formId": "B",
    "code": "B14",
    "title": "CNSP x SUSEP",
    "primaryLessonId": "banking.sfn.seguros-previdencia",
    "teaches": [
      "“CNSP e SUSEP” + “Mapa mental”"
    ],
    "competencyIds": [
      "sfn.seguros-previdencia-supervisao"
    ],
    "sourceIds": [
      "susep.sobre"
    ],
    "prompt": "No segmento de seguros privados, qual relação funcional está correta?",
    "options": [
      "CNSP fixa diretrizes/normas e SUSEP controla e fiscaliza os mercados sob sua competência.",
      "SUSEP fixa a meta Selic e CNSP supervisiona bancos.",
      "PREVIC define política monetária e SUSEP fiscaliza companhias abertas.",
      "CVM normatiza previdência fechada e CNSP administra consórcios."
    ],
    "answer": 0,
    "explanation": "O CNSP exerce função normativa do segmento; a SUSEP é entidade supervisora dos mercados de seguros, previdência aberta, capitalização e resseguro.",
    "distractorRationale": "B, C e D misturam competências de segmentos distintos."
  },
  {
    "id": "eval.sfn.b15",
    "formId": "B",
    "code": "B15",
    "title": "consórcio sem promessa de contemplação",
    "primaryLessonId": "banking.sfn.pagamentos-consorcios",
    "teaches": [
      "“Consórcio é autofinanciamento”"
    ],
    "competencyIds": [
      "sfn.pagamentos-consorcios"
    ],
    "sourceIds": [
      "bcb.consorcio"
    ],
    "prompt": "Uma propaganda afirma que a simples adesão a um grupo de consórcio garante contemplação imediata. À luz do conteúdo estudado, a afirmação é:",
    "options": [
      "Incorreta; consórcio é mecanismo de autofinanciamento em grupo e adesão não garante contemplação imediata.",
      "Correta; todo consórcio funciona como empréstimo instantâneo.",
      "Correta; o Banco Central entrega o bem na adesão.",
      "Incorreta apenas porque consórcios são fiscalizados pela CVM."
    ],
    "answer": 0,
    "explanation": "A adesão não assegura contemplação imediata; consórcio organiza autofinanciamento em grupo.",
    "distractorRationale": "B e C inventam mecanismo de crédito/entrega; D atribui supervisor incorreto."
  },
  {
    "id": "eval.sfn.b16",
    "formId": "B",
    "code": "B16",
    "title": "SPB como sistema, não entidade única",
    "primaryLessonId": "banking.sfn.pagamentos-consorcios",
    "teaches": [
      "“Sistema de Pagamentos Brasileiro”"
    ],
    "competencyIds": [
      "sfn.pagamentos-consorcios"
    ],
    "sourceIds": [
      "bcb.spb"
    ],
    "prompt": "Qual descrição representa melhor o Sistema de Pagamentos Brasileiro (SPB)?",
    "options": [
      "Conjunto de infraestruturas, arranjos, regras e participantes que permitem transferências e liquidação de obrigações.",
      "Um único banco comercial responsável por todo pagamento no país.",
      "Um fundo de investimento administrado pela CVM.",
      "Um órgão colegiado que define a meta Selic."
    ],
    "answer": 0,
    "explanation": "O SPB é um sistema composto por infraestruturas, arranjos, regras e participantes; não uma instituição bancária isolada.",
    "distractorRationale": "B reduz o sistema a um banco; C e D pertencem a outros conceitos."
  }
];

export const ASSESSMENT_QUESTIONS = Object.freeze(QUESTIONS.map((item) => Object.freeze({
  ...item,
  teaches: Object.freeze([...item.teaches]),
  competencyIds: Object.freeze([...item.competencyIds]),
  sourceIds: Object.freeze([...item.sourceIds]),
  options: Object.freeze([...item.options])
})));

export function assessmentQuestionById(id) {
  return ASSESSMENT_QUESTIONS.find((item) => item.id === String(id || '')) || null;
}

export function assessmentQuestionsForForm(formId) {
  return ASSESSMENT_QUESTIONS.filter((item) => item.formId === String(formId || '').toUpperCase());
}

export function publicAssessmentQuestion(item) {
  return {
    id: item.id,
    prompt: item.prompt,
    options: item.options,
    primaryLessonId: item.primaryLessonId,
    competencyIds: item.competencyIds
  };
}

export function validateAssessmentCatalog(sourceIds = new Set()) {
  const errors = [];
  const ids = new Set();
  for (const item of ASSESSMENT_QUESTIONS) {
    if (!/^eval\.sfn\.[ab]\d{2}$/.test(item.id)) errors.push(`${item.id}:invalid-id`);
    if (ids.has(item.id)) errors.push(`${item.id}:duplicate-id`);
    ids.add(item.id);
    if (!FORM_IDS.includes(item.formId)) errors.push(`${item.id}:invalid-form`);
    if (!REQUIRED_TOPIC_IDS.includes(item.primaryLessonId)) errors.push(`${item.id}:invalid-lesson`);
    if (!Array.isArray(item.options) || item.options.length !== 4) errors.push(`${item.id}:invalid-options`);
    if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) errors.push(`${item.id}:invalid-answer`);
    if (!item.prompt?.trim() || !item.explanation?.trim() || !item.distractorRationale?.trim()) errors.push(`${item.id}:incomplete-editorial`);
    if (!item.competencyIds?.length || !item.teaches?.length || !item.sourceIds?.length) errors.push(`${item.id}:missing-metadata`);
    for (const sourceId of item.sourceIds || []) if (sourceIds.size && !sourceIds.has(sourceId)) errors.push(`${item.id}:unknown-source:${sourceId}`);
  }
  for (const formId of FORM_IDS) {
    const form = assessmentQuestionsForForm(formId);
    if (form.length !== FORM_SIZE) errors.push(`${formId}:wrong-size`);
    const lessons = new Map();
    for (const item of form) lessons.set(item.primaryLessonId,(lessons.get(item.primaryLessonId)||0)+1);
    for (const topicId of REQUIRED_TOPIC_IDS.filter((id)=>id!=='banking.sfn.boss')) {
      if (lessons.get(topicId)!==2) errors.push(`${formId}:unbalanced:${topicId}`);
    }
  }
  const formA = new Set(assessmentQuestionsForForm('A').map((item)=>item.id));
  for (const item of assessmentQuestionsForForm('B')) if (formA.has(item.id)) errors.push(`${item.id}:cross-form-duplicate`);
  return errors;
}
