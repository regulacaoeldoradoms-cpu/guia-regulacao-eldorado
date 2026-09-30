'use strict';

const entry = (questionId, optionReasons) => Object.freeze({
  questionId,
  version: 1,
  optionReasons: Object.freeze(optionReasons)
});

// Feedback pós-resposta. Não é importado pelo catálogo público das missões.
// A explicação da alternativa correta continua no próprio item; este catálogo
// acrescenta o motivo específico pelo qual cada escolha deve ou não ser aceita.
export const QUESTION_FEEDBACK_V1 = Object.freeze([
  entry('q.sfn.01', [
    'Operadores executam atividades no mercado; formular diretrizes gerais é função normativa.',
    'Órgãos normativos são justamente o grupo que estabelece diretrizes e normas gerais.',
    'O nome correspondente bancário não descreve o grupo que formula as diretrizes gerais cobradas nesta questão.',
    'Clientes institucionais não exercem, por essa condição, a função normativa do sistema.'
  ]),
  entry('q.sfn.02', [
    'Intermediar recursos e atender o público descreve uma atuação operacional.',
    'Órgão normativo formula diretrizes gerais; não é esse o papel descrito no atendimento e na intermediação.',
    'Poder Legislativo não é a categoria funcional do SFN descrita no caso.',
    'Planejamento orçamentário não corresponde ao papel de intermediação financeira apresentado na aula.'
  ]),
  entry('q.sfn.03', [
    'O CMN não é operador bancário; ele exerce função normativa.',
    'O Banco Central supervisiona e executa políticas em suas competências, mas o órgão normativo superior é o CMN.',
    'A associação está correta: o CMN exerce função normativa.',
    'Banco comercial atua como operador; não se torna entidade normativa por oferecer serviços bancários.'
  ]),
  entry('q.cmn.01', [
    'Esta é a caracterização ensinada: o CMN é o órgão normativo superior do SFN.',
    'O CMN não é banco que atende clientes ou concede crédito diretamente.',
    'Bolsa de valores é uma estrutura de mercado, não a natureza institucional do CMN.',
    'O CMN não é uma autarquia supervisora subordinada à CVM; é um colegiado normativo superior.'
  ]),
  entry('q.cmn.02', [
    'A Presidência da República não ocupa a presidência do CMN na composição estudada.',
    'O Presidente do Banco Central integra o CMN, mas não preside o conselho.',
    'O Ministro da Fazenda preside o CMN na composição apresentada na aula.',
    'O Presidente da CVM não integra a composição do CMN apresentada nesta unidade.'
  ]),
  entry('q.cmn.03', [
    'A afirmação está correta: formular a política da moeda e do crédito é atribuição central do CMN.',
    'Bancos comerciais executam operações; não substituem o CMN na formulação dessa política geral.',
    'A CVM atua no mercado de valores mobiliários e não substitui o CMN na formulação da política da moeda e do crédito.',
    'O CMN não se limita a fiscalizar seguradoras; a alternativa reduz incorretamente sua função normativa.'
  ]),
  entry('q.bc.01', [
    'Supervisionar o SFN em seu campo de competência é função compatível com o Banco Central.',
    'Presidir o Poder Legislativo não é atribuição do Banco Central.',
    'O Banco Central não define sozinho todas as normas de seguros privados; a afirmação extrapola sua competência.',
    'O Banco Central não atua como banco comercial de varejo para o público em geral.'
  ]),
  entry('q.bc.02', [
    'O CMN formula diretrizes gerais; a expressão banco dos bancos não é usada para descrevê-lo.',
    'Banco dos bancos é uma função tradicionalmente associada ao Banco Central.',
    'A CVM supervisiona o mercado de valores mobiliários; não exerce a função bancária indicada pela expressão.',
    'O Tesouro Nacional exerce funções fiscais e de gestão financeira pública, não a função indicada pela expressão.'
  ]),
  entry('q.bc.03', [
    'A relação está invertida: o CMN formula diretrizes, enquanto o Banco Central executa e supervisiona em suas competências.',
    'Esta comparação preserva a distinção central ensinada entre formulação normativa e execução/supervisão.',
    'CMN e Banco Central são instituições distintas e exercem papéis diferentes.',
    'O Banco Central não é subordinado aos bancos comerciais; ele exerce supervisão sobre instituições dentro de sua competência.'
  ]),
  entry('q.copom.01', [
    'O Tesouro Nacional exerce funções de gestão fiscal e financeira pública; o Copom não é constituído em seu âmbito.',
    'O Copom é constituído no âmbito do Banco Central, onde integra a estrutura decisória da política monetária.',
    'A CVM supervisiona o mercado de valores mobiliários; não é a instituição em cuja estrutura o Copom está constituído.',
    'O Banco do Brasil é um operador bancário e não abriga institucionalmente o Copom.'
  ]),
  entry('q.copom.02', [
    'Definir a meta para a Taxa Selic é a decisão central atribuída ao Copom no conteúdo estudado.',
    'Fixar o salário mínimo é matéria de política pública distinta e não é competência do Copom.',
    'Aprovar o orçamento da União não é atribuição do Copom; a questão trata de política monetária, não do processo orçamentário.',
    'O Copom não concede crédito diretamente a consumidores; ele toma decisões de política monetária.'
  ]),
  entry('q.copom.03', [
    'Ministros da Fazenda e do Planejamento participam da composição estudada do CMN, não da composição do Copom.',
    'Presidente e Diretores do Banco Central compõem o Copom segundo a regulamentação usada nesta versão.',
    'Presidentes dos bancos públicos não formam a composição do Copom apresentada na aula.',
    'Diretores da CVM e da SUSEP pertencem a outras entidades e não compõem o Copom na regra estudada.'
  ]),
  entry('q.cvm.01', [
    'Mercado de valores mobiliários, ou mercado de capitais no contexto ensinado, é o campo diretamente regulado e fiscalizado pela CVM.',
    'Mercado de trabalho não é o objeto institucional de regulação e fiscalização da CVM apresentado nesta unidade.',
    'Mercado de bens de consumo não corresponde ao campo específico de valores mobiliários supervisionado pela CVM.',
    'Sistema tributário municipal pertence a outra esfera de atuação pública e não define a competência da CVM.'
  ]),
  entry('q.cvm.02', [
    'Companhia aberta está entre os participantes tipicamente sujeitos à esfera de competência da CVM.',
    'Cartório de registro civil não é participante típico do mercado de valores mobiliários supervisionado pela CVM.',
    'Secretaria do Tesouro municipal não é participante do mercado de capitais enquadrado nesta questão.',
    'Instituto de previdência social não corresponde ao participante de mercado de valores mobiliários indicado pela aula.'
  ]),
  entry('q.cvm.03', [
    'O Banco Central supervisiona instituições em seu campo, mas oferta pública de valores mobiliários e manipulação de mercado apontam diretamente para a CVM.',
    'A CVM é o supervisor diretamente ligado a ofertas públicas, proteção do investidor e integridade do mercado de valores mobiliários.',
    'O CMN formula diretrizes gerais do sistema; não exerce a supervisão específica descrita no caso.',
    'Banco comercial é operador e não autoridade supervisora de ofertas públicas ou manipulação de valores mobiliários.'
  ]),
  entry('q.oper.01', [
    'O CMN formula diretrizes gerais; ele não é um participante operacional que oferece serviços bancários.',
    'Banco comercial é uma instituição operadora: executa atividades financeiras e atende o mercado.',
    'O Copom decide a política monetária e a meta para a Taxa Selic; não é operador bancário.',
    'Um conselho normativo descreve função de formulação de regras, não a execução cotidiana das operações financeiras.'
  ]),
  entry('q.oper.02', [
    'A captação de depósitos à vista é uma atividade típica do banco comercial e ajuda a reconhecê-lo em prova.',
    'A meta para a Taxa Selic é definida pelo Copom, não por banco comercial.',
    'A formulação da política da moeda e do crédito é função normativa do CMN, não atividade típica do banco comercial.',
    'A fiscalização de companhias abertas pertence ao campo da CVM, não à atividade operacional de um banco comercial.'
  ]),
  entry('q.oper.03', [
    'Uma única carteira não atende à exigência estudada para caracterizar banco múltiplo.',
    'A regra ensinada exige ao menos duas carteiras, sendo uma delas comercial ou de investimento.',
    'Carteiras de seguros e previdência não substituem a composição mínima exigida para banco múltiplo.',
    'Ter apenas carteira de desenvolvimento não satisfaz a regra geral indicada para banco múltiplo privado.'
  ]),
  entry('q.segprev.01', [
    'A PREVIC supervisiona entidades fechadas de previdência complementar; não responde pelo conjunto de seguros, capitalização e previdência aberta.',
    'A SUSEP fiscaliza seguros, previdência complementar aberta, capitalização e resseguro.',
    'O Banco Central supervisiona outros segmentos do sistema financeiro; não é o supervisor central dos mercados listados nesta questão.',
    'O Tesouro Nacional não exerce a supervisão específica dos mercados de seguros, capitalização e previdência complementar aberta.'
  ]),
  entry('q.segprev.02', [
    'A SUSEP atua sobre previdência complementar aberta; fundos de pensão e outras entidades fechadas ficam fora desse campo.',
    'A CVM supervisiona o mercado de valores mobiliários; não é a autarquia responsável pelas entidades fechadas de previdência complementar.',
    'A PREVIC supervisiona e fiscaliza as entidades fechadas de previdência complementar.',
    'O Copom atua na política monetária e na definição da meta Selic; não supervisiona fundos de pensão.'
  ]),
  entry('q.segprev.03', [
    'A associação está correta: o CNSP exerce função normativa, fixando diretrizes e normas para o segmento de seguros privados.',
    'A SUSEP não define a meta Selic; essa decisão pertence ao Copom.',
    'A PREVIC supervisiona entidades fechadas de previdência complementar, não companhias abertas.',
    'A CVM atua no mercado de valores mobiliários; títulos de capitalização estão no campo fiscalizado pela SUSEP.'
  ]),
  entry('q.segprev.04', [
    'Plano de previdência complementar aberto está no campo de supervisão da SUSEP.',
    'A PREVIC supervisiona previdência complementar fechada, ligada a entidades fechadas e fundos de pensão.',
    'O CMN é órgão normativo superior do SFN, mas não é o supervisor direto dos planos abertos indicado nesta questão.',
    'Banco do Brasil é operador bancário e não autoridade supervisora da previdência complementar aberta.'
  ])
]);

export function questionFeedbackById(questionId) {
  return QUESTION_FEEDBACK_V1.find((item) => item.questionId === String(questionId || '')) || null;
}

export function validateQuestionFeedback(missions, entries = QUESTION_FEEDBACK_V1) {
  const errors = [];
  const questions = new Map();
  for (const mission of missions || []) {
    for (const question of mission.questions || []) questions.set(question.id, { mission, question });
  }
  const seen = new Set();
  for (const item of entries || []) {
    if (seen.has(item.questionId)) errors.push(`${item.questionId}:duplicate-feedback`);
    seen.add(item.questionId);
    const found = questions.get(item.questionId);
    if (!found) {
      errors.push(`${item.questionId}:unknown-question`);
      continue;
    }
    if (!Array.isArray(item.optionReasons) || item.optionReasons.length !== found.question.options.length) {
      errors.push(`${item.questionId}:wrong-option-count`);
      continue;
    }
    if (item.optionReasons.some((reason) => typeof reason !== 'string' || !reason.trim())) {
      errors.push(`${item.questionId}:empty-option-reason`);
    }
  }
  return errors;
}
