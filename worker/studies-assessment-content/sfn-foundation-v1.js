'use strict';

export const ASSESSMENT_VERSION = 2;
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

// A introdução mantém o topicId histórico "banking.sfn" no progresso persistido.
// REQUIRED_TOPIC_IDS também identifica aulas nos itens; não renomear esses vínculos.
export const REQUIRED_PROGRESS_TOPIC_IDS = Object.freeze(REQUIRED_TOPIC_IDS.map(
  id => id === 'banking.sfn.introducao' ? 'banking.sfn' : id
));

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
      "Órgãos normativos",
      "Operadores",
      "Instituições de pagamento",
      "Intermediários de mercado"
    ],
    "answer": 0,
    "explanation": "O elemento decisivo é a função de formular diretrizes gerais. Isso caracteriza órgão normativo, independentemente do nome da entidade.",
    "distractorRationale": "B confunde execução com formulação; C é espécie de participante operacional; D descreve atuação de mercado, não função normativa."
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
      "Recebe recursos de clientes e realiza operações financeiras autorizadas.",
      "Fiscaliza participantes de um segmento.",
      "Delibera sobre orientações gerais de política econômica."
    ],
    "answer": 1,
    "explanation": "Operadores executam atividades e serviços no mercado. Receber recursos e realizar operações financeiras é comportamento operacional.",
    "distractorRationale": "A e D são funções normativas; C é função supervisora."
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
      "Incorreta, porque o CMN atua como banco comercial.",
      "Incorreta, porque essa competência pertence exclusivamente à CVM.",
      "Correta, porque separa formulação normativa e execução.",
      "Incorreta, porque o CMN atua apenas no orçamento federal."
    ],
    "answer": 2,
    "explanation": "O CMN é órgão normativo superior e formula políticas/diretrizes; não funciona como banco operacional.",
    "distractorRationale": "A troca órgão normativo por operador; B desloca atribuição para o campo da CVM; D confunde SFN com execução orçamentária."
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
      "Presidente da República, Presidente da CVM e Ministro da Fazenda.",
      "Ministro da Fazenda, Presidente do Banco do Brasil e Presidente da CAIXA.",
      "Presidente do Banco Central, Presidente da CVM e Superintendente da SUSEP.",
      "Ministro da Fazenda, Ministro do Planejamento e Orçamento e Presidente do Banco Central."
    ],
    "answer": 3,
    "explanation": "A composição adotada no material é formada pelo Ministro da Fazenda, pelo Ministro do Planejamento e Orçamento e pelo Presidente do BCB.",
    "distractorRationale": "A, B e C incluem autoridades que não compõem o colegiado apresentado."
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
      "Atendimento bancário de varejo.",
      "Banco dos bancos.",
      "Administração de fundos de pensão.",
      "Fiscalização de ofertas públicas de ações."
    ],
    "answer": 1,
    "explanation": "A expressão “banco dos bancos” resume relações e estruturas do Banco Central voltadas ao funcionamento entre instituições, não ao atendimento bancário comum do público.",
    "distractorRationale": "A descreve operador de varejo; C remete à previdência fechada; D ao mercado de valores mobiliários."
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
      "CVM.",
      "CNSP.",
      "Copom.",
      "PREVIC."
    ],
    "answer": 2,
    "explanation": "O Copom define a meta para a Taxa Selic e orientações estratégicas da política monetária.",
    "distractorRationale": "A atua em valores mobiliários; B em diretrizes de seguros; D supervisiona previdência complementar fechada."
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
      "CMN.",
      "CVM.",
      "CNSP.",
      "Copom."
    ],
    "answer": 3,
    "explanation": "A composição Presidente + Diretores do Banco Central identifica o Copom no conteúdo ensinado.",
    "distractorRationale": "A possui composição diferente; B é autarquia do mercado de valores mobiliários; C é conselho do segmento de seguros."
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
      "Funcionamento de conta corrente em banco comercial.",
      "Integridade de uma oferta pública de valores mobiliários.",
      "Autorização de administradora de consórcio.",
      "Supervisão de uma cooperativa de crédito."
    ],
    "answer": 1,
    "explanation": "A CVM atua no mercado de valores mobiliários e ofertas públicas; as demais situações se relacionam mais diretamente ao BCB.",
    "distractorRationale": "A, C e D estão ligados a participantes/atividades supervisionados pelo Banco Central."
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
      "Instituição de pagamento sem carteira bancária.",
      "Órgão normativo.",
      "Banco múltiplo.",
      "Entidade fechada de previdência complementar."
    ],
    "answer": 2,
    "explanation": "Há pelo menos duas carteiras e uma delas é comercial ou de investimento, satisfazendo a regra básica estudada para banco múltiplo.",
    "distractorRationale": "A não descreve a organização por carteiras bancárias; B não é operador; D pertence a outro segmento."
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
      "Passa a integrar a estrutura deliberativa do CMN como membro.",
      "Torna-se entidade supervisora do segmento por estar sujeita às regras.",
      "Assume competência do Copom para decisões de política monetária.",
      "Permanece operadora; a supervisão do BCB não muda sua natureza."
    ],
    "answer": 3,
    "explanation": "A instituição supervisionada permanece operadora. Supervisor e supervisionado ocupam papéis diferentes.",
    "distractorRationale": "A, B e C confundem sujeição à supervisão com mudança de natureza institucional."
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
      "PREVIC.",
      "SUSEP.",
      "Banco Central.",
      "CVM."
    ],
    "answer": 1,
    "explanation": "O mercado de capitalização está entre os mercados fiscalizados pela SUSEP.",
    "distractorRationale": "A cuida de previdência fechada; C e D possuem outros campos de supervisão."
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
      "Passa a ser banco comercial e pode captar depósitos à vista apenas por manter contas de pagamento.",
      "Pode definir a meta Selic e conceder crédito por participar do sistema de pagamentos.",
      "Continua sendo instituição de pagamento e não pode exercer atividade privativa de instituição financeira.",
      "Substitui o Banco Central na regulação e fiscalização dos participantes do arranjo."
    ],
    "answer": 2,
    "explanation": "Instituição de pagamento não é instituição financeira e não pode exercer atividades privativas destas apenas por atuar em pagamentos.",
    "distractorRationale": "A confunde categorias; B e D atribuem competências públicas a operador privado."
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
      "CMN.",
      "CVM.",
      "PREVIC.",
      "SPI."
    ],
    "answer": 3,
    "explanation": "O SPI é a infraestrutura centralizada de liquidação de pagamentos instantâneos e opera em liquidação bruta em tempo real.",
    "distractorRationale": "A, B e C são órgãos/entidades com outras finalidades."
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
      "Órgão normativo.",
      "Cliente institucional.",
      "Entidade supervisora.",
      "Operador de varejo."
    ],
    "answer": 2,
    "explanation": "Fiscalizar e fazer cumprir regras em determinado campo caracteriza função supervisora.",
    "distractorRationale": "A formula diretrizes; B não é categoria funcional do SFN; D executa serviços e operações."
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
      "Operador formula diretrizes → cliente fiscaliza → supervisor concede crédito.",
      "Supervisor cria clientes → operador fiscaliza → normativo atende o público.",
      "Cliente define política → normativo empresta → operador fiscaliza.",
      "Normativo formula diretrizes → supervisor fiscaliza → operador executa atividades."
    ],
    "answer": 3,
    "explanation": "A sequência reproduz a divisão funcional ensinada: formulação, supervisão e operação.",
    "distractorRationale": "A, B e C trocam as funções entre os grupos."
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
      "Atender correntistas e conceder crédito diretamente ao público.",
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
      "Presidente da CVM.",
      "Ministro da Fazenda.",
      "Superintendente da SUSEP.",
      "Presidente do Banco do Brasil."
    ],
    "answer": 1,
    "explanation": "O Ministro da Fazenda preside o CMN na composição adotada no curso.",
    "distractorRationale": "A, C e D não exercem essa presidência."
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
      "CVM.",
      "PREVIC.",
      "Banco Central.",
      "Banco comercial."
    ],
    "answer": 2,
    "explanation": "O BCB executa políticas monetária, cambial e de crédito e supervisiona o sistema em seu campo.",
    "distractorRationale": "A e B são supervisores de outros segmentos; D é operador."
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
      "“O Banco Central supervisiona instituições em sua competência.”",
      "“O Banco Central executa políticas em sua competência.”",
      "“CMN e Banco Central possuem funções institucionais distintas.”",
      "“O Banco Central é o órgão normativo superior do SFN, acima do CMN.”"
    ],
    "answer": 3,
    "explanation": "O órgão normativo superior é o CMN. O BCB possui funções supervisoras, regulatórias e executivas, mas não substitui essa posição do Conselho.",
    "distractorRationale": "A, B e C refletem a distinção ensinada."
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
      "O Copom define a meta Selic; a taxa do empréstimo depende também de risco, prazo e custos.",
      "A conclusão está correta: a meta Selic é obrigatoriamente a taxa de todo empréstimo.",
      "O Copom atua apenas no mercado de seguros e define taxas obrigatórias para apólices privadas.",
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
      "Selic é o nome de um banco comercial que concede empréstimos ao público.",
      "Selic nomeia o sistema de liquidação e custódia; a meta da taxa Selic é definida pelo Copom.",
      "Selic é modalidade de previdência complementar fechada supervisionada pela PREVIC.",
      "Selic é a entidade responsável por fiscalizar companhias abertas e fundos de investimento."
    ],
    "answer": 1,
    "explanation": "A aula distingue a origem do nome Selic e o uso da expressão taxa Selic no contexto dos juros básicos e de sua meta.",
    "distractorRationale": "A, C e D confundem a expressão com instituições/segmentos sem relação com essa definição."
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
      "SUSEP.",
      "PREVIC.",
      "CVM.",
      "Copom."
    ],
    "answer": 2,
    "explanation": "Integridade do mercado de valores mobiliários, repressão a fraudes/manipulações e proteção de investidores estão no campo da CVM.",
    "distractorRationale": "A, B e D atuam em segmentos diferentes."
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
      "Depósito à vista.",
      "Consórcio.",
      "Previdência complementar fechada.",
      "Fundo de investimento."
    ],
    "answer": 3,
    "explanation": "Fundos de investimento aparecem entre os participantes/estruturas do mercado de valores mobiliários sujeitos à esfera da CVM.",
    "distractorRationale": "A remete a banco comercial; B ao BCB; C à PREVIC."
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
      "A financeira passa a ser órgão normativo.",
      "A financeira segue como operadora; o BCB é seu supervisor.",
      "A financeira passa a integrar o Copom.",
      "A financeira assume competência sobre companhias abertas."
    ],
    "answer": 1,
    "explanation": "Ser supervisionado não converte o participante em supervisor; a financeira continua no lado operacional.",
    "distractorRationale": "A, C e D atribuem funções públicas incompatíveis."
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
      "Aberta — PREVIC; fechada — SUSEP.",
      "Aberta — CVM; fechada — Banco Central.",
      "Aberta — SUSEP; fechada — PREVIC.",
      "Aberta — CNSP; fechada — CMN."
    ],
    "answer": 2,
    "explanation": "A SUSEP supervisiona a previdência complementar aberta; a PREVIC, as entidades fechadas.",
    "distractorRationale": "A, B e D trocam os supervisores."
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
      "SUSEP fixa a meta Selic e CNSP supervisiona bancos.",
      "PREVIC define política monetária e SUSEP fiscaliza companhias abertas.",
      "CVM normatiza previdência fechada e CNSP administra consórcios.",
      "CNSP define diretrizes e normas; SUSEP supervisiona e fiscaliza o segmento."
    ],
    "answer": 3,
    "explanation": "O CNSP exerce função normativa do segmento; a SUSEP é entidade supervisora dos mercados de seguros, previdência aberta, capitalização e resseguro.",
    "distractorRationale": "A, B e C misturam competências de segmentos distintos."
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
      "Incorreta; consórcio é autofinanciamento e não garante contemplação imediata.",
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
      "Um banco único que centraliza e executa todos os pagamentos do país.",
      "Rede de regras, infraestruturas e participantes usada para pagamentos e liquidações.",
      "Um fundo financeiro supervisionado exclusivamente pela CVM.",
      "Um colegiado do Banco Central responsável por definir a meta Selic."
    ],
    "answer": 1,
    "explanation": "O SPB é um sistema composto por infraestruturas, arranjos, regras e participantes; não uma instituição bancária isolada.",
    "distractorRationale": "A reduz o sistema a um banco; C e D pertencem a outros conceitos."
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
    const answers = new Map([[0,0],[1,0],[2,0],[3,0]]);
    for (const item of form) {
      lessons.set(item.primaryLessonId,(lessons.get(item.primaryLessonId)||0)+1);
      answers.set(item.answer,(answers.get(item.answer)||0)+1);
    }
    for (const topicId of REQUIRED_TOPIC_IDS.filter((id)=>id!=='banking.sfn.boss')) {
      if (lessons.get(topicId)!==2) errors.push(`${formId}:unbalanced:${topicId}`);
    }
    for (const [answer,count] of answers) if (count!==4) errors.push(`${formId}:answer-position:${answer}:${count}`);
  }
  const formA = new Set(assessmentQuestionsForForm('A').map((item)=>item.id));
  for (const item of assessmentQuestionsForForm('B')) if (formA.has(item.id)) errors.push(`${item.id}:cross-form-duplicate`);
  return errors;
}
