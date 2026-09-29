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
