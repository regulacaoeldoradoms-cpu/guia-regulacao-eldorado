'use strict';

export const STUDY_SOURCES = Object.freeze([
  Object.freeze({
    id: 'edital.bb.2022-001',
    label: 'Banco do Brasil — Seleção Externa 2022/001',
    url: 'https://www.bb.com.br/docs/portal/dipes/EditalSelExtern2022001.pdf',
    checkedAt: '2026-09-25',
    kind: 'edital'
  }),
  Object.freeze({
    id: 'edital.caixa.2024-nm',
    label: 'CAIXA — Edital nº 01/2024/NM',
    url: 'https://www.caixa.gov.br/Downloads/concurso-publico-editais/EDITAL_N_01_2024_NM_DE_22_DE_FEVEREIRO_DE_2024_.pdf',
    checkedAt: '2026-09-25',
    kind: 'edital'
  }),
  Object.freeze({
    id: 'bcb.sfn',
    label: 'Banco Central — Sistema Financeiro Nacional',
    url: 'https://www.bcb.gov.br/estabilidadefinanceira/sfn',
    checkedAt: '2026-09-25',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'bcb.cmn',
    label: 'Banco Central — Secretaria do CMN',
    url: 'https://www.bcb.gov.br/acessoinformacao/cmn',
    checkedAt: '2026-09-25',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'bcb.competencias',
    label: 'Banco Central — Competências do Banco Central',
    url: 'https://www.bcb.gov.br/meubc/faqs/p/competencias-do-banco-central-do-brasil',
    checkedAt: '2026-09-25',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'bcb.copom',
    label: 'Banco Central — Resolução BCB nº 61 / Copom',
    url: 'https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=61&tipo=Resolu%C3%A7%C3%A3o+BCB',
    checkedAt: '2026-09-25',
    kind: 'norma-oficial'
  }),
  Object.freeze({
    id: 'cvm.papel',
    label: 'CVM — Qual o papel da CVM?',
    url: 'https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/perguntas-frequentes-da-cvm/teste-assunto/teste-combo-assunto',
    checkedAt: '2026-09-25',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'cvm.competencia',
    label: 'CVM — Mandato Legal',
    url: 'https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/institucional/competencia',
    checkedAt: '2026-09-25',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'bcb.supervisionadas',
    label: 'Banco Central — Instituições que o BC supervisiona',
    url: 'https://www.bcb.gov.br/meubc/faqs/p/instituicoesqueobancocentralsupervisiona',
    checkedAt: '2026-09-25',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'cmn.bancos.5060',
    label: 'CMN — Resolução nº 5.060/2023, versão vigente',
    url: 'https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=5060&tipo=Resolu%C3%A7%C3%A3o+CMN',
    checkedAt: '2026-09-25',
    kind: 'norma-oficial'
  }),
  Object.freeze({
    id: 'susep.sobre',
    label: 'SUSEP — competências e mercados supervisionados',
    url: 'https://www.gov.br/susep/pt-br/acesso-a-informacao/institucional/sobre-a-susep',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'susep.previdencia-aberta',
    label: 'SUSEP — Previdência Complementar Aberta',
    url: 'https://www.gov.br/susep/pt-br/copy_of_planos-e-produtos/previdencia-complementar-aberta',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'previc.como-participar',
    label: 'PREVIC — Previdência Complementar Fechada',
    url: 'https://www.gov.br/previc/pt-br/licenciamento-e-habilitacao/como-participar',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'previc.missao',
    label: 'PREVIC — missão institucional',
    url: 'https://www.gov.br/previc/pt-br/acesso-a-informacao-1/institucional/missao-visao-e-valores',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'bcb.spb',
    label: 'Banco Central — Sistema de Pagamentos Brasileiro',
    url: 'https://www.bcb.gov.br/estabilidadefinanceira/spb',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'bcb.instituicao-pagamento',
    label: 'Banco Central — Instituições de pagamento',
    url: 'https://www.bcb.gov.br/estabilidadefinanceira/instituicaopagamento',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'bcb.spi',
    label: 'Banco Central — Sistema de Pagamentos Instantâneos',
    url: 'https://www.bcb.gov.br/estabilidadefinanceira/sistemapagamentosinstantaneos',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'bcb.consorcio',
    label: 'Banco Central — FAQ Consórcio',
    url: 'https://www.bcb.gov.br/meubc/faqs/s/consorcio',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  })
]);

const q = (id, topicId, prompt, options, answer, explanation) =>
  Object.freeze({ id, topicId, prompt, options: Object.freeze(options), answer, explanation });

export const PUBLISHED_MISSIONS = Object.freeze([
  Object.freeze({
    id: 'banking.sfn.introducao',
    topicId: 'banking.sfn',
    contentVersion: 1,
    order: 1,
    title: 'O mapa do Sistema Financeiro Nacional',
    shortTitle: 'SFN: visão geral',
    estimatedMinutes: 22,
    xp: 100,
    sourceIds: Object.freeze(['edital.bb.2022-001', 'edital.caixa.2024-nm', 'bcb.sfn']),
    objective: 'Entender a lógica do SFN e distinguir quem cria regras, quem supervisiona e quem opera no mercado.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'Antes dos nomes, entenda a lógica',
        body: 'O Sistema Financeiro Nacional é a estrutura que organiza a intermediação financeira no Brasil. Para prova, o mais importante no início é separar funções: órgãos normativos estabelecem diretrizes; entidades supervisoras fazem cumprir as regras em seus campos de atuação; operadores executam atividades financeiras e lidam com o mercado e o público.'
      }),
      Object.freeze({
        heading: 'Três perguntas que resolvem muita questão',
        body: 'Quando aparecer uma instituição na prova, pergunte: ela formula diretrizes? supervisiona e fiscaliza? ou executa operações? Essa classificação evita decorar listas sem compreender a função de cada participante.'
      }),
      Object.freeze({
        heading: 'Pegadinha clássica',
        body: 'Não trate CMN e Banco Central como sinônimos. O CMN é órgão normativo. O Banco Central é entidade supervisora e executora das políticas de sua competência. Essa diferença aparece repetidamente em concursos bancários.'
      })
    ]),
    recall: Object.freeze([
      'Sem consultar: qual é a diferença central entre órgão normativo e entidade supervisora?',
      'Quem tende a lidar diretamente com clientes e operações: órgão normativo ou operador?'
    ]),
    questions: Object.freeze([
      q('q.sfn.01', 'banking.sfn', 'No SFN, qual grupo tem como função principal estabelecer diretrizes e normas gerais?', ['Operadores', 'Órgãos normativos', 'Correspondentes bancários', 'Clientes institucionais'], 1, 'Órgãos normativos formulam diretrizes. Supervisores fiscalizam e operadores executam atividades no mercado.'),
      q('q.sfn.02', 'banking.sfn', 'Uma instituição que realiza intermediação financeira e atende o público está mais próxima de qual papel?', ['Operador', 'Órgão normativo', 'Poder Legislativo', 'Órgão de planejamento orçamentário'], 0, 'Operadores executam as atividades-fim do sistema e podem lidar diretamente com o público.'),
      q('q.sfn.03', 'banking.sfn', 'Qual associação está correta?', ['CMN — operador bancário', 'Banco Central — órgão normativo máximo', 'CMN — órgão normativo', 'Banco comercial — entidade normativa'], 2, 'O CMN é órgão normativo do SFN; bancos comerciais são operadores e o BC atua como supervisor e executor.')
    ])
  }),
  Object.freeze({
    id: 'banking.sfn.cmn',
    topicId: 'banking.sfn.cmn',
    contentVersion: 1,
    order: 2,
    title: 'CMN: quem define as grandes diretrizes',
    shortTitle: 'CMN',
    estimatedMinutes: 20,
    xp: 100,
    sourceIds: Object.freeze(['edital.bb.2022-001', 'edital.caixa.2024-nm', 'bcb.cmn']),
    objective: 'Reconhecer o papel normativo do CMN, sua finalidade e sua composição atual.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'O órgão superior',
        body: 'O Conselho Monetário Nacional é o órgão superior do Sistema Financeiro Nacional. Ele formula a política da moeda e do crédito e coordena diretrizes gerais que orientam o funcionamento do sistema.'
      }),
      Object.freeze({
        heading: 'O que lembrar para prova',
        body: 'O CMN formula diretrizes; ele não é o banco que executa operações no dia a dia. Entre seus objetivos estão a estabilidade da moeda e o desenvolvimento econômico e social. Suas decisões são materializadas por normas e orientam a atuação das entidades competentes.'
      }),
      Object.freeze({
        heading: 'Composição atual',
        body: 'O CMN é composto pelo Ministro da Fazenda, que o preside, pelo Ministro do Planejamento e Orçamento e pelo Presidente do Banco Central do Brasil.'
      })
    ]),
    recall: Object.freeze([
      'Quem preside o CMN?',
      'CMN formula ou executa diretamente a política monetária?'
    ]),
    questions: Object.freeze([
      q('q.cmn.01', 'banking.sfn.cmn', 'Qual descrição melhor representa o CMN?', ['Órgão normativo superior do SFN', 'Banco público federal', 'Bolsa de valores', 'Autarquia supervisora subordinada à CVM'], 0, 'O CMN é o órgão superior e normativo do SFN.'),
      q('q.cmn.02', 'banking.sfn.cmn', 'Quem preside atualmente o Conselho Monetário Nacional?', ['Presidente da República', 'Presidente do Banco Central', 'Ministro da Fazenda', 'Presidente da CVM'], 2, 'A composição atual prevê o Ministro da Fazenda como presidente do CMN.'),
      q('q.cmn.03', 'banking.sfn.cmn', 'Em uma questão que atribui ao CMN a formulação da política da moeda e do crédito, a afirmação está:', ['Correta', 'Incorreta, pois isso cabe aos bancos comerciais', 'Incorreta, pois isso cabe exclusivamente à CVM', 'Incorreta, pois o CMN só fiscaliza seguradoras'], 0, 'A formulação da política da moeda e do crédito é responsabilidade central do CMN.')
    ])
  }),
  Object.freeze({
    id: 'banking.sfn.bacen',
    topicId: 'banking.sfn.bacen',
    contentVersion: 1,
    order: 3,
    title: 'Banco Central: supervisor e executor',
    shortTitle: 'Banco Central',
    estimatedMinutes: 22,
    xp: 100,
    sourceIds: Object.freeze(['edital.bb.2022-001', 'edital.caixa.2024-nm', 'bcb.competencias', 'bcb.sfn']),
    objective: 'Distinguir as funções do Banco Central das funções do CMN e reconhecer seus papéis mais cobrados.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'A ponte entre diretriz e execução',
        body: 'O Banco Central do Brasil é uma autarquia de natureza especial. No SFN, atua como supervisor e como principal executor das orientações do Conselho Monetário Nacional dentro de suas competências.'
      }),
      Object.freeze({
        heading: 'Funções que aparecem em prova',
        body: 'Entre os papéis do BC estão supervisionar o SFN, executar políticas monetária, cambial e de crédito, atuar como banco dos bancos e gerir o meio circulante. Em outras palavras: o CMN estabelece diretrizes gerais; o BC transforma muitas dessas diretrizes em atuação concreta e supervisão.'
      }),
      Object.freeze({
        heading: 'Pegadinha clássica',
        body: 'Se uma alternativa disser que o Banco Central é o órgão normativo máximo do SFN, desconfie. Esse papel cabe ao CMN. O BC possui poder regulatório e de supervisão em suas competências, mas ocupa posição diferente na estrutura.'
      })
    ]),
    recall: Object.freeze([
      'Qual é a relação entre CMN e Banco Central?',
      'Cite duas funções do Banco Central sem consultar o texto.'
    ]),
    questions: Object.freeze([
      q('q.bc.01', 'banking.sfn.bacen', 'Qual função é compatível com o Banco Central?', ['Supervisionar o SFN', 'Presidir o Poder Legislativo', 'Definir sozinho todas as normas de seguros privados', 'Atuar como banco comercial para o público em geral'], 0, 'O BC supervisiona o SFN dentro de suas competências e executa políticas monetária, cambial e de crédito.'),
      q('q.bc.02', 'banking.sfn.bacen', 'A expressão “banco dos bancos” é tradicionalmente associada a:', ['CMN', 'Banco Central', 'CVM', 'Tesouro Nacional'], 1, 'O Banco Central exerce funções de banco dos bancos.'),
      q('q.bc.03', 'banking.sfn.bacen', 'Qual comparação está correta?', ['CMN executa e BC apenas aconselha', 'CMN formula diretrizes e BC executa/supervisiona em suas competências', 'CMN e BC são a mesma entidade', 'BC é subordinado aos bancos comerciais'], 1, 'A distinção entre formulação normativa do CMN e execução/supervisão do BC é fundamental.')
    ])
  }),
  Object.freeze({
    id: 'banking.sfn.copom',
    topicId: 'banking.sfn.copom',
    contentVersion: 1,
    order: 4,
    title: 'Copom: a decisão sobre a meta Selic',
    shortTitle: 'Copom',
    estimatedMinutes: 20,
    xp: 100,
    sourceIds: Object.freeze(['edital.bb.2022-001', 'edital.caixa.2024-nm', 'bcb.copom']),
    objective: 'Entender onde o Copom se encaixa, quem o compõe e qual decisão central ele toma.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'Onde o Copom fica',
        body: 'O Comitê de Política Monetária é constituído no âmbito do Banco Central. Seus membros são o Presidente e os Diretores do Banco Central.'
      }),
      Object.freeze({
        heading: 'A decisão central',
        body: 'Com base na avaliação do cenário macroeconômico e de seus riscos, o Copom define a meta para a Taxa Selic e as orientações estratégicas para a execução da política monetária.'
      }),
      Object.freeze({
        heading: 'Ritmo das reuniões',
        body: 'Pela regulamentação vigente usada nesta versão do conteúdo, o Copom realiza oito reuniões ordinárias por ano. As reuniões ordinárias ocorrem em duas sessões: uma voltada às apresentações técnicas e outra à decisão da meta para a Taxa Selic.'
      })
    ]),
    recall: Object.freeze([
      'Quem são os membros do Copom?',
      'Qual é a decisão mais conhecida tomada pelo Copom?'
    ]),
    questions: Object.freeze([
      q('q.copom.01', 'banking.sfn.copom', 'O Copom é constituído no âmbito de qual instituição?', ['Tesouro Nacional', 'Banco Central', 'CVM', 'Banco do Brasil'], 1, 'O Copom integra a estrutura decisória de política monetária do Banco Central.'),
      q('q.copom.02', 'banking.sfn.copom', 'Qual decisão é competência do Copom?', ['Definir a meta para a Taxa Selic', 'Fixar o salário mínimo', 'Aprovar o orçamento da União', 'Conceder crédito diretamente ao consumidor'], 0, 'A definição da meta para a Taxa Selic é competência central do Copom.'),
      q('q.copom.03', 'banking.sfn.copom', 'Segundo a regulamentação vigente usada nesta versão, quem compõe o Copom?', ['Ministros da Fazenda e Planejamento', 'Presidente e Diretores do Banco Central', 'Presidentes dos bancos públicos', 'Diretores da CVM e da Susep'], 1, 'A Resolução BCB nº 61 estabelece Presidente e Diretores do Banco Central como membros do Copom.')
    ])
  }),
  Object.freeze({
    id: 'banking.sfn.cvm',
    topicId: 'banking.sfn.cvm',
    contentVersion: 1,
    order: 5,
    title: 'CVM: quem fiscaliza o mercado de capitais',
    shortTitle: 'CVM',
    estimatedMinutes: 22,
    xp: 110,
    sourceIds: Object.freeze(['edital.bb.2022-001', 'edital.caixa.2024-nm', 'cvm.papel', 'cvm.competencia']),
    objective: 'Distinguir a atuação da CVM da atuação do Banco Central e reconhecer o mercado que cada supervisor acompanha.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'O território da CVM',
        body: 'A Comissão de Valores Mobiliários regula e fiscaliza o mercado de valores mobiliários, também chamado de mercado de capitais. É nesse ambiente que empresas e outros emissores captam recursos diretamente de investidores por meio de instrumentos financeiros.'
      }),
      Object.freeze({
        heading: 'Quem aparece sob sua supervisão',
        body: 'A esfera de competência da CVM envolve, entre outros participantes, companhias abertas, fundos de investimento, securitizadoras, corretoras de valores mobiliários e ofertas públicas no mercado de capitais. A CVM também atua na proteção dos investidores e na repressão a fraudes e manipulações de mercado.'
      }),
      Object.freeze({
        heading: 'CVM não é Banco Central',
        body: 'Uma forma eficiente de resolver questões é observar o objeto supervisionado. Conta corrente, poupança e produtos bancários tradicionais apontam para a esfera do Banco Central. Valores mobiliários, companhias abertas, fundos e ofertas públicas apontam para a CVM. Há situações de competências que se relacionam, mas a prova costuma explorar essa divisão funcional.'
      })
    ]),
    recall: Object.freeze([
      'Qual mercado é regulado e fiscalizado pela CVM?',
      'Que indício em uma questão ajuda a escolher CVM em vez de Banco Central?'
    ]),
    questions: Object.freeze([
      q('q.cvm.01', 'banking.sfn.cvm', 'A CVM está diretamente associada à regulação e fiscalização de qual mercado?', ['Mercado de valores mobiliários', 'Mercado de trabalho', 'Mercado de bens de consumo', 'Sistema tributário municipal'], 0, 'A CVM regula e fiscaliza o mercado de valores mobiliários, também conhecido como mercado de capitais.'),
      q('q.cvm.02', 'banking.sfn.cvm', 'Qual participante está tipicamente dentro da esfera de competência da CVM?', ['Companhia aberta', 'Cartório de registro civil', 'Secretaria do Tesouro municipal', 'Instituto de previdência social'], 0, 'Companhias abertas, fundos, securitizadoras e agentes do mercado de valores mobiliários estão entre os participantes supervisionados pela CVM.'),
      q('q.cvm.03', 'banking.sfn.cvm', 'Uma questão trata de oferta pública de valores mobiliários e proteção do investidor contra manipulação de mercado. Qual supervisor é o mais diretamente relacionado?', ['Banco Central', 'CVM', 'CMN', 'Banco comercial'], 1, 'Ofertas públicas e integridade do mercado de valores mobiliários estão no núcleo de atuação da CVM.')
    ])
  }),
  Object.freeze({
    id: 'banking.sfn.operadores',
    topicId: 'banking.sfn.operadores',
    contentVersion: 1,
    order: 6,
    title: 'Operadores: quem faz o sistema funcionar',
    shortTitle: 'Operadores do SFN',
    estimatedMinutes: 24,
    xp: 110,
    sourceIds: Object.freeze(['edital.bb.2022-001', 'edital.caixa.2024-nm', 'bcb.sfn', 'bcb.supervisionadas', 'cmn.bancos.5060']),
    objective: 'Reconhecer instituições operadoras e diferenciar bancos comerciais, bancos múltiplos, cooperativas e outros participantes supervisionados.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'Da norma para a operação',
        body: 'Operadores são instituições que executam as atividades-fim do sistema. É nesse grupo que aparecem bancos, cooperativas de crédito, financeiras, corretoras, administradoras de consórcio, instituições de pagamento e outros participantes autorizados ou supervisionados, conforme o segmento.'
      }),
      Object.freeze({
        heading: 'Banco comercial e banco múltiplo',
        body: 'O banco comercial realiza intermediação financeira e tem na captação de depósitos à vista uma atividade típica. O banco múltiplo reúne operações de diferentes carteiras sob uma mesma instituição; pela regulamentação vigente, precisa possuir ao menos duas carteiras, sendo uma delas comercial ou de investimento.'
      }),
      Object.freeze({
        heading: 'A pergunta de prova',
        body: 'Se a instituição capta, empresta, recebe depósitos, presta serviços financeiros ou executa operações no mercado, ela está no campo operacional. Isso a diferencia de um órgão como o CMN, que formula diretrizes, e de um supervisor, que fiscaliza e regula dentro de sua competência.'
      }),
      Object.freeze({
        heading: 'Não confunda operador com supervisor',
        body: 'O Banco Central supervisiona diversos tipos de instituições, como bancos, cooperativas de crédito, financeiras, instituições de pagamento e administradoras de consórcio. A instituição supervisionada continua sendo operadora; o fato de seguir regras do BC não a transforma em órgão supervisor.'
      })
    ]),
    recall: Object.freeze([
      'Qual característica ajuda a reconhecer um operador do SFN?',
      'Qual é a exigência básica de carteiras para um banco múltiplo segundo a regulamentação vigente?'
    ]),
    questions: Object.freeze([
      q('q.oper.01', 'banking.sfn.operadores', 'Qual alternativa apresenta um participante tipicamente operacional do SFN?', ['CMN', 'Banco comercial', 'Copom', 'Conselho normativo'], 1, 'Bancos comerciais executam atividades financeiras e são operadores; CMN e Copom exercem funções institucionais diferentes.'),
      q('q.oper.02', 'banking.sfn.operadores', 'Qual atividade é típica do banco comercial?', ['Captação de depósitos à vista', 'Definição da meta Selic', 'Formulação da política da moeda e do crédito', 'Fiscalização de companhias abertas'], 0, 'A captação de depósitos à vista é atividade típica dos bancos comerciais.'),
      q('q.oper.03', 'banking.sfn.operadores', 'Segundo a regulamentação vigente, um banco múltiplo deve possuir:', ['Uma única carteira obrigatoriamente comercial', 'Ao menos duas carteiras, sendo uma comercial ou de investimento', 'Apenas carteiras de seguros e previdência', 'Somente carteira de desenvolvimento, mesmo se privado'], 1, 'O banco múltiplo deve possuir no mínimo duas carteiras, sendo uma delas comercial ou de investimento.')
    ])
  }),
  Object.freeze({
    id: 'banking.sfn.seguros-previdencia',
    topicId: 'banking.sfn.seguros-previdencia',
    contentVersion: 1,
    order: 7,
    title: 'Seguros, previdência e capitalização: quem regula o quê',
    shortTitle: 'Seguros e previdência',
    estimatedMinutes: 26,
    xp: 120,
    sourceIds: Object.freeze([
      'edital.bb.2022-001',
      'edital.caixa.2024-nm',
      'susep.sobre',
      'susep.previdencia-aberta',
      'previc.como-participar',
      'previc.missao'
    ]),
    objective: 'Distinguir CNSP, SUSEP e PREVIC e separar previdência complementar aberta da fechada.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'CNSP e SUSEP',
        body: 'No segmento de seguros privados, o Conselho Nacional de Seguros Privados fixa diretrizes e normas. A SUSEP é a autarquia responsável pelo controle e fiscalização dos mercados de seguros, previdência complementar aberta, capitalização e resseguro. Para prova, a lógica é a mesma do SFN: um órgão define diretrizes e uma entidade supervisora fiscaliza os participantes do mercado.'
      }),
      Object.freeze({
        heading: 'Previdência aberta e fechada não são a mesma coisa',
        body: 'A previdência complementar aberta é oferecida por entidades abertas de previdência complementar e sociedades seguradoras autorizadas, sob supervisão da SUSEP. A previdência complementar fechada é administrada por entidades fechadas, os chamados fundos de pensão, e pressupõe vínculo com patrocinador ou instituidor; sua supervisão cabe à PREVIC.'
      }),
      Object.freeze({
        heading: 'Capitalização entra no mesmo radar da SUSEP',
        body: 'Títulos de capitalização aparecem nos editais como produto bancário, mas seu mercado está entre aqueles fiscalizados pela SUSEP. A prova pode misturar nomes de órgãos para testar se você identifica o supervisor correto.'
      }),
      Object.freeze({
        heading: 'Mapa mental',
        body: 'CNSP: diretrizes e normas do segmento de seguros privados. SUSEP: seguros, previdência complementar aberta, capitalização e resseguro. PREVIC: entidades fechadas de previdência complementar.'
      })
    ]),
    recall: Object.freeze([
      'Quem supervisiona a previdência complementar aberta?',
      'Quem supervisiona as entidades fechadas de previdência complementar?',
      'Qual é o papel do CNSP em relação à SUSEP?'
    ]),
    questions: Object.freeze([
      q('q.segprev.01', 'banking.sfn.seguros-previdencia', 'Qual entidade fiscaliza seguros, previdência complementar aberta, capitalização e resseguro?', ['PREVIC', 'SUSEP', 'Banco Central', 'Tesouro Nacional'], 1, 'A SUSEP supervisiona esses mercados; a previdência complementar fechada fica sob a PREVIC.'),
      q('q.segprev.02', 'banking.sfn.seguros-previdencia', 'As entidades fechadas de previdência complementar são supervisionadas por:', ['SUSEP', 'CVM', 'PREVIC', 'Copom'], 2, 'A PREVIC é a autarquia responsável pela supervisão e fiscalização das entidades fechadas de previdência complementar.'),
      q('q.segprev.03', 'banking.sfn.seguros-previdencia', 'Qual associação está correta?', ['CNSP — fixa diretrizes e normas do segmento de seguros privados', 'SUSEP — define a meta Selic', 'PREVIC — supervisiona companhias abertas', 'CVM — fiscaliza títulos de capitalização'], 0, 'O CNSP exerce função normativa no segmento; SUSEP e PREVIC têm competências supervisoras distintas.'),
      q('q.segprev.04', 'banking.sfn.seguros-previdencia', 'Um plano de previdência complementar aberto está mais diretamente ligado à supervisão de qual entidade?', ['SUSEP', 'PREVIC', 'CMN', 'Banco do Brasil'], 0, 'Planos de previdência complementar aberta são supervisionados pela SUSEP.')
    ])
  }),
  Object.freeze({
    id: 'banking.sfn.pagamentos-consorcios',
    topicId: 'banking.sfn.pagamentos-consorcios',
    contentVersion: 1,
    order: 8,
    title: 'Pagamentos, Pix e consórcios: como o dinheiro circula',
    shortTitle: 'Pagamentos e consórcios',
    estimatedMinutes: 28,
    xp: 120,
    sourceIds: Object.freeze([
      'edital.bb.2022-001',
      'edital.caixa.2024-nm',
      'bcb.spb',
      'bcb.instituicao-pagamento',
      'bcb.spi',
      'bcb.consorcio'
    ]),
    objective: 'Entender a lógica do SPB, reconhecer instituições de pagamento, situar o Pix/SPI e compreender o consórcio.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'Sistema de Pagamentos Brasileiro',
        body: 'O Sistema de Pagamentos Brasileiro reúne infraestruturas, arranjos, regras e participantes que permitem transferir recursos e liquidar obrigações. Nos arranjos de pagamento integrantes do SPB, o Banco Central exerce papel regulatório e supervisor dentro de sua competência.'
      }),
      Object.freeze({
        heading: 'Instituição de pagamento não é banco',
        body: 'Instituições de pagamento viabilizam serviços de pagamento e podem gerenciar contas de pagamento. Elas não são instituições financeiras e, por isso, não podem praticar atividades privativas destas, como conceder empréstimos e financiamentos por conta própria. Ainda assim, estão sujeitas à supervisão do Banco Central quando enquadradas na regulamentação aplicável.'
      }),
      Object.freeze({
        heading: 'Pix e SPI',
        body: 'O Pix é um arranjo de pagamentos instantâneos. A liquidação entre instituições ocorre no Sistema de Pagamentos Instantâneos, o SPI, infraestrutura centralizada gerida pelo Banco Central. O SPI opera em liquidação bruta em tempo real: cada transação é processada e liquidada individualmente.'
      }),
      Object.freeze({
        heading: 'Consórcio é autofinanciamento',
        body: 'Consórcio reúne pessoas físicas ou jurídicas em grupo para aquisição de bens ou serviços por meio de autofinanciamento. Os grupos são constituídos e promovidos por administradoras de consórcio autorizadas pelo Banco Central. A adesão ao grupo não garante contemplação imediata.'
      })
    ]),
    recall: Object.freeze([
      'Instituição de pagamento é instituição financeira?',
      'Qual infraestrutura liquida pagamentos instantâneos entre instituições no Pix?',
      'Qual é a lógica econômica básica de um consórcio?'
    ]),
    questions: Object.freeze([
      q('q.pag.01', 'banking.sfn.pagamentos-consorcios', 'Sobre instituições de pagamento, qual afirmação está correta?', ['São sempre bancos comerciais', 'Não são instituições financeiras e não podem exercer atividades privativas destas', 'Definem a meta Selic', 'Supervisionam o Banco Central'], 1, 'Instituições de pagamento não são instituições financeiras, embora sejam reguladas/supervisionadas pelo Banco Central nos casos previstos.'),
      q('q.pag.02', 'banking.sfn.pagamentos-consorcios', 'No ecossistema Pix, o SPI é:', ['Um fundo de investimento', 'A infraestrutura centralizada de liquidação de pagamentos instantâneos', 'Uma administradora de consórcio', 'Um órgão normativo'], 1, 'O SPI é a infraestrutura centralizada e única de liquidação de pagamentos instantâneos entre instituições distintas.'),
      q('q.pag.03', 'banking.sfn.pagamentos-consorcios', 'Consórcio é melhor descrito como:', ['Empréstimo automático do Banco Central', 'Grupo de autofinanciamento para aquisição de bens ou serviços', 'Seguro obrigatório', 'Título público federal'], 1, 'O consórcio é um grupo organizado para autofinanciamento de seus integrantes.'),
      q('q.pag.04', 'banking.sfn.pagamentos-consorcios', 'Quem deve autorizar a administradora que constitui e promove grupos de consórcio?', ['Banco Central', 'PREVIC', 'CNSP', 'Tesouro Nacional'], 0, 'Administradoras de consórcio precisam de autorização do Banco Central.')
    ])
  }),
  Object.freeze({
    id: 'banking.sfn.boss',
    topicId: 'banking.sfn.boss',
    contentVersion: 1,
    order: 9,
    kind: 'boss',
    passScore: 75,
    title: 'Chefe do SFN: quem manda, quem fiscaliza e quem opera',
    shortTitle: 'Chefe do SFN',
    estimatedMinutes: 35,
    xp: 220,
    sourceIds: Object.freeze([
      'bcb.sfn','bcb.cmn','bcb.competencias','bcb.copom',
      'cvm.competencia','cmn.bancos.5060','susep.sobre','previc.missao',
      'bcb.spb','bcb.instituicao-pagamento','bcb.spi','bcb.consorcio'
    ]),
    objective: 'Integrar todo o mapa do SFN e demonstrar domínio mínimo de 75% em uma rodada cumulativa.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'Antes da batalha',
        body: 'O Chefe não apresenta matéria nova. Ele combina as funções, instituições e pegadinhas das oito missões anteriores. Para vencer, você precisa responder toda a rodada e atingir pelo menos 75% de acertos.'
      }),
      Object.freeze({
        heading: 'Mapa final',
        body: 'Normativos formulam diretrizes; supervisores regulam e fiscalizam seus segmentos; operadores executam atividades e serviços. Em cada questão, identifique primeiro o mercado envolvido e só depois escolha a instituição.'
      })
    ]),
    recall: Object.freeze([
      'CMN, Banco Central, CVM, SUSEP e PREVIC: qual é o território de cada um?',
      'Qual a diferença entre instituição financeira e instituição de pagamento?',
      'Como Pix/SPI e consórcio entram no mapa do sistema?'
    ]),
    questions: Object.freeze([
      q('q.boss.01', 'banking.sfn.boss', 'Qual órgão ocupa função normativa superior no SFN?', ['Banco Central', 'CMN', 'CVM', 'SUSEP'], 1, 'O CMN é o órgão normativo superior do Sistema Financeiro Nacional.'),
      q('q.boss.02', 'banking.sfn.boss', 'Qual entidade executa políticas monetária, cambial e de crédito e supervisiona instituições em sua competência?', ['Banco Central', 'PREVIC', 'CNSP', 'Banco comercial'], 0, 'O Banco Central exerce funções executivas e supervisoras no SFN.'),
      q('q.boss.03', 'banking.sfn.boss', 'A definição da meta para a Taxa Selic é competência de qual colegiado?', ['CMN', 'Copom', 'CVM', 'CNSP'], 1, 'O Copom define a meta para a Taxa Selic.'),
      q('q.boss.04', 'banking.sfn.boss', 'Companhias abertas e ofertas públicas de valores mobiliários remetem principalmente à supervisão de:', ['CVM', 'PREVIC', 'SUSEP', 'Copom'], 0, 'A CVM regula e fiscaliza o mercado de valores mobiliários.'),
      q('q.boss.05', 'banking.sfn.boss', 'Um banco múltiplo deve possuir, no mínimo:', ['Uma carteira qualquer', 'Duas carteiras, sendo uma comercial ou de investimento', 'Três carteiras, todas de crédito', 'Apenas carteira comercial'], 1, 'A regulamentação exige no mínimo duas carteiras, sendo uma comercial ou de investimento.'),
      q('q.boss.06', 'banking.sfn.boss', 'Qual entidade supervisiona o mercado de capitalização e a previdência complementar aberta?', ['PREVIC', 'SUSEP', 'CVM', 'Banco Central'], 1, 'A SUSEP fiscaliza seguros, previdência complementar aberta, capitalização e resseguro.'),
      q('q.boss.07', 'banking.sfn.boss', 'Fundos de pensão, enquanto entidades fechadas de previdência complementar, estão sob supervisão da:', ['SUSEP', 'PREVIC', 'CVM', 'Secretaria do Tesouro'], 1, 'A PREVIC supervisiona as entidades fechadas de previdência complementar.'),
      q('q.boss.08', 'banking.sfn.boss', 'Instituições de pagamento:', ['São sempre bancos', 'Podem conceder qualquer empréstimo', 'Não são instituições financeiras', 'Não se submetem ao Banco Central'], 2, 'Instituições de pagamento não são instituições financeiras e não podem exercer atividades privativas destas.'),
      q('q.boss.09', 'banking.sfn.boss', 'No Pix, o SPI exerce qual papel?', ['Define a política fiscal', 'Liquida pagamentos instantâneos entre instituições', 'Administra fundos de pensão', 'Fiscaliza companhias abertas'], 1, 'O SPI é a infraestrutura de liquidação dos pagamentos instantâneos entre instituições.'),
      q('q.boss.10', 'banking.sfn.boss', 'Qual característica define o consórcio?', ['Autofinanciamento em grupo', 'Seguro de crédito obrigatório', 'Empréstimo direto do CMN', 'Título de renda fixa do Tesouro'], 0, 'Consórcio é um mecanismo de autofinanciamento em grupo para aquisição de bens ou serviços.'),
      q('q.boss.11', 'banking.sfn.boss', 'Uma entidade aberta de previdência complementar se relaciona diretamente com qual supervisor?', ['SUSEP', 'PREVIC', 'Copom', 'CMN'], 0, 'A previdência complementar aberta está no campo de supervisão da SUSEP.'),
      q('q.boss.12', 'banking.sfn.boss', 'Ao separar normativo, supervisor e operador, um banco comercial é classificado principalmente como:', ['Órgão normativo', 'Supervisor', 'Operador', 'Conselho de política monetária'], 2, 'O banco comercial executa atividades financeiras e integra o conjunto de operadores.')
    ])
  })
]);

export const PLANNED_MISSIONS = Object.freeze(
  PUBLISHED_MISSIONS.map((mission) => Object.freeze({ id: mission.id, status: 'published' }))
);

export function missionById(id) {
  return PUBLISHED_MISSIONS.find((mission) => mission.id === String(id || '')) || null;
}

export function missionByTopicId(topicId) {
  return PUBLISHED_MISSIONS.find((mission) => mission.topicId === String(topicId || '')) || null;
}

export function questionById(id) {
  for (const mission of PUBLISHED_MISSIONS) {
    const question = mission.questions.find((item) => item.id === String(id || ''));
    if (question) return { mission, question };
  }
  return null;
}

export function sourceMap() {
  return new Map(STUDY_SOURCES.map((source) => [source.id, source]));
}
