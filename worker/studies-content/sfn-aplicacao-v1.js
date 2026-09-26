'use strict';

// Material formativo, não gabarito das 38 questões pontuadas.
// Cada atividade é sustentada por trechos já existentes na primeira aula.
const task = (id, title, prompt, model, criteria, sectionIds) => Object.freeze({
  id, version: 1, kind: 'self-explanation', title, prompt, model,
  criteria: Object.freeze(criteria), sectionIds: Object.freeze(sectionIds),
  sourceIds: Object.freeze(['cvm.educacao.estrutura-sfn', 'fazenda.cmn.apresentacao'])
});

export const INTRO_APPLICATIONS = Object.freeze([
  task('apply.sfn.papeis.v1', 'Quem faz o quê?',
    'Situações fictícias: uma instituição oferece uma conta e analisa crédito para uma loja; outra acompanha o cumprimento das obrigações das instituições sob sua responsabilidade; um conselho formula orientações gerais para a moeda e o crédito. Classifique as três funções e explique por que atender à loja não é a mesma tarefa que formular orientações para o sistema.',
    'O atendimento à loja é uma atividade operacional. A verificação das obrigações é supervisão. A formulação de diretrizes gerais corresponde à função normativa. A diferença não é quem trabalha com dinheiro: todos estão relacionados ao sistema. É o papel exercido em cada situação. Oferecer um serviço a um cliente não equivale a formular orientações gerais. Não é preciso adivinhar o nome de instituições que o enunciado não identificou.',
    ['Distingui serviço ao cliente, supervisão e orientação geral.', 'Justifiquei pelo papel exercido, não apenas por uma palavra conhecida.', 'Não inventei o nome das instituições não identificadas.'],
    ['regras', 'cmn', 'bcb', 'operadores']),
  task('apply.sfn.norma.v1', 'Uma palavra basta para classificar?',
    'Um colega afirma: “O Banco Central editou uma regra dentro de suas competências; portanto, deixou de ser supervisor e passou a ser o Conselho Monetário Nacional.” Explique o erro dessa conclusão com base na aula. É possível identificar a instituição apenas porque a frase contém a palavra regra?',
    'A conclusão confunde o nome de uma instituição com uma função que ela pode exercer. O Banco Central continua sendo o Banco Central: além de supervisionar, pode editar normas no seu campo de competência. Isso não o transforma no Conselho Monetário Nacional. A palavra regra, isolada, não resolve a classificação; é preciso analisar a instituição, sua competência e a situação descrita.',
    ['Expliquei que o Banco Central e o Conselho Monetário Nacional não são a mesma instituição.', 'Considerei que um supervisor também pode editar normas em suas competências.', 'Evitei o atalho de escolher uma instituição só pela palavra regra.'],
    ['cmn', 'bcb', 'exemplo-operador']),
  task('apply.sfn.intermediacao.v1', 'Explique sem repetir o exemplo da aula',
    'Situação fictícia: Beto reserva parte de sua renda, enquanto uma confeitaria procura recursos para comprar um equipamento antes de receber de seus clientes. Um banco capta recursos e concede crédito. Explique o papel de intermediação nesse caso. Beto precisa conhecer a dona da confeitaria? O exemplo permite afirmar que o depósito exato de Beto foi entregue a ela?',
    'A intermediação descreve a ligação feita pela instituição entre disponibilização de recursos e demanda por crédito. Beto não precisa negociar diretamente com a dona da confeitaria. Também não se pode concluir que o valor de um depósito específico tenha sido entregue a uma pessoa determinada. O caso ilustra uma função do sistema, não todos os mecanismos de criação de crédito. A análise dos riscos e as obrigações de pagamento continuam relevantes.',
    ['Descrevi a função de ligação exercida pela instituição.', 'Não exigi um encontro ou contrato direto entre Beto e a confeitaria.', 'Reconheci o limite do exemplo: ele não rastreia um depósito específico até um empréstimo.'],
    ['vocabulario', 'intermediacao', 'operadores'])
]);

export function attachIntroApplications(mission) {
  if (mission.id !== 'banking.sfn.introducao') return mission;
  return Object.freeze({
    ...mission,
    // Versão própria do suplemento; texto, IDs e contentVersion da aula preservados.
    sections: Object.freeze(mission.sections.map((section) => section.id === 'autoavaliacao'
      ? Object.freeze({ ...section, applicationVersion: 1, applicationTasks: INTRO_APPLICATIONS })
      : section))
  });
}

export function validateIntroApplications(missions, sources) {
  const errors = [];
  const intro = missions.find((mission) => mission.id === 'banking.sfn.introducao');
  const anchor = intro?.sections?.find((section) => section.id === 'autoavaliacao');
  if (!anchor) return ['application:missing-anchor'];
  if (anchor.applicationTasks !== INTRO_APPLICATIONS) errors.push('application:not-attached');
  const sections = new Set(intro.sections.map((section) => section.id));
  const ids = new Set();
  for (const item of INTRO_APPLICATIONS) {
    if (ids.has(item.id)) errors.push(`${item.id}:duplicate`);
    ids.add(item.id);
    for (const field of ['title', 'prompt', 'model']) {
      if (typeof item[field] !== 'string' || !item[field].trim()) errors.push(`${item.id}:empty-${field}`);
    }
    if (item.criteria.length < 1 || item.criteria.some((value) => !value.trim())) errors.push(`${item.id}:missing-criteria`);
    if (!item.sectionIds.length) errors.push(`${item.id}:missing-teaching`);
    for (const id of item.sectionIds) if (!sections.has(id)) errors.push(`${item.id}:unknown-section:${id}`);
    for (const id of item.sourceIds) if (!sources.has(id)) errors.push(`${item.id}:unknown-source:${id}`);
  }
  return errors;
}
