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
  })
]);

export const PLANNED_MISSIONS = Object.freeze([
  ...PUBLISHED_MISSIONS.map((mission) => Object.freeze({ id: mission.id, status: 'published' })),
  Object.freeze({ id: 'banking.sfn.cvm', status: 'planned' }),
  Object.freeze({ id: 'banking.sfn.operadores', status: 'planned' }),
  Object.freeze({ id: 'banking.mercados.introducao', status: 'planned' }),
  Object.freeze({ id: 'banking.produtos.introducao', status: 'planned' }),
  Object.freeze({ id: 'portuguese.interpretacao', status: 'planned' }),
  Object.freeze({ id: 'math_finance.porcentagem', status: 'planned' }),
  Object.freeze({ id: 'sales.atendimento', status: 'planned' }),
  Object.freeze({ id: 'digital.fundamentos', status: 'planned' })
]);

export function missionById(id) {
  return PUBLISHED_MISSIONS.find((mission) => mission.id === String(id || '')) || null;
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
