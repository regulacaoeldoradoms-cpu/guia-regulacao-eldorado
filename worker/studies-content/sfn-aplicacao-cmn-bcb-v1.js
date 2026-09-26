'use strict';

// Suplementos formativos apoiados nas aulas existentes. Não alteram avaliação
// pontuada, gabarito, tempo, XP ou dados. O leitor da aplicação já aceita este formato.
const task = (id, title, prompt, model, criteria, sectionIds, sourceIds) => Object.freeze({
  id, version: 1, kind: 'self-explanation', title, prompt, model,
  criteria: Object.freeze(criteria), sectionIds: Object.freeze(sectionIds),
  sourceIds: Object.freeze(sourceIds)
});

export const MONETARY_APPLICATIONS = Object.freeze({
  'banking.sfn.cmn': Object.freeze([
    task('apply.cmn.escala.v1', 'Orientar o sistema ou decidir um contrato?',
      'Situação fictícia: uma loja recebe de um banco uma proposta de crédito. O lojista conclui: “Como o Conselho Monetário Nacional formula diretrizes para o crédito, foi o conselho que escolheu o prazo deste contrato e aprovou meu pedido.” Reescreva essa explicação distinguindo a orientação geral da análise do pedido individual. Que informação a existência de diretrizes não permite concluir?',
      'O banco que analisa o pedido e oferece o contrato atua na prestação do serviço. As diretrizes do Conselho Monetário Nacional orientam o sistema, mas isso não significa que o conselho tenha analisado esse cliente ou escolhido individualmente seu prazo. Regras gerais podem influenciar operações; influência não equivale à decisão de cada contrato. O caso não informa quais regras específicas se aplicam nem permite afirmar que o banco tenha liberdade para ignorá-las. A resposta deve separar o alcance das decisões, não negar a existência de regulação.',
      ['Separei orientação geral e análise do pedido individual.', 'Não atribuí ao conselho a aprovação daquele contrato.', 'Não confundi a decisão do banco com ausência de regras.'],
      ['papel', 'diferencas', 'exemplo-orientacao'], ['fazenda.cmn.apresentacao']),
    task('apply.cmn.composicao.v1', 'Corrija somente o que está errado',
      'Um resumo fictício diz: “Participam do Conselho Monetário Nacional os titulares da Fazenda, do Planejamento e Orçamento e da Presidência do Banco Central. Como este último é chamado de presidente, ele também preside o conselho.” Preserve a parte correta e corrija a conclusão. Explique a diferença entre integrar um colegiado e presidi-lo, sem usar nomes de pessoas.',
      'A relação de cargos está correta para a composição apresentada nesta aula. A conclusão confunde a presidência de uma instituição com a presidência de outro colegiado. O Presidente do Banco Central integra o conselho; a presidência do Conselho Monetário Nacional cabe ao titular do Ministério da Fazenda. Participar é fazer parte do grupo que delibera; presidir é exercer sua condução. Não se deve invalidar a lista inteira por causa de um erro na função atribuída a um dos participantes. Esta composição foi cotejada com a página oficial em 26/09/2026.',
      ['Mantive os três cargos que compõem o conselho.', 'Atribuí a presidência do conselho ao titular da Fazenda.', 'Expliquei por que o título de presidente do Banco Central não se transfere ao conselho.'],
      ['composicao', 'exemplo-composicao', 'glossario'], ['fazenda.cmn.apresentacao']),
    task('apply.cmn.metas.v1', 'Metas e autonomia podem coexistir?',
      'Dois colegas fictícios discordam. Um afirma que, se o Conselho Monetário Nacional estabelece metas de política monetária, o Banco Central tem de ser subordinado a um ministério. O outro diz que, por ser autônomo, o Banco Central pode ignorar essas metas. Explique uma terceira posição que respeite as duas funções ensinadas na aula.',
      'As duas conclusões estão erradas. Estabelecer metas e conduzir a política para alcançá-las são atribuições diferentes. O Conselho Monetário Nacional estabelece metas de política monetária; o Banco Central conduz a política necessária ao seu cumprimento, com a autonomia definida em lei. Autonomia não elimina objetivos legais, e trabalhar para cumprir metas não equivale a subordinação hierárquica a um ministério. A resposta não precisa indicar uma taxa atual nem descrever instrumentos que ainda não foram ensinados.',
      ['Distingui estabelecer metas e conduzir a política para cumpri-las.', 'Expliquei por que autonomia não significa ignorar a lei.', 'Não deduzi subordinação ministerial a partir da existência de metas.'],
      ['diferencas', 'papel'], ['planalto.bcb.lc179'])
  ]),
  'banking.sfn.bacen': Object.freeze([
    task('apply.bcb.nomes.v1', 'Nomes parecidos, tarefas diferentes',
      'Situação fictícia: Renata procura o Banco do Brasil para um serviço de conta. Ao ler sobre o Banco Central do Brasil, conclui que são a mesma instituição e que fiscalizar bancos é apenas outro nome para atender correntistas. Explique os dois equívocos e dê uma descrição curta de cada papel, usando o que a aula ensinou.',
      'Banco do Brasil e Banco Central do Brasil são instituições distintas. O atendimento de conta exemplifica prestação de serviço bancário ao cliente. O Banco Central exerce funções de autoridade monetária e de supervisão no seu campo de competência. Fiscalizar obrigações de instituições não é o mesmo que executar o serviço contratado pelo correntista. A palavra banco e a semelhança dos nomes não substituem a identificação da entidade e de sua função. O caso não exige uma lista de produtos nem um procedimento de reclamação.',
      ['Distingui Banco do Brasil e Banco Central do Brasil.', 'Separei serviço ao correntista de supervisão de instituições.', 'Justifiquei pelas funções, não só pela semelhança dos nomes.'],
      ['nome', 'supervisao', 'exemplo-nomes'], ['bcb.sfn', 'bcb.competencias']),
    task('apply.bcb.precos.v1', 'Um preço isolado permite essa conclusão?',
      'Situação fictícia: um produto manteve o mesmo preço por um mês. Um colega afirma: “Isso basta para demonstrar que a estabilidade de preços da economia foi alcançada; aliás, a função do Banco Central é impedir qualquer mudança no preço de cada produto.” O que essa observação permite concluir e o que ela não demonstra? Não é necessário calcular inflação.',
      'A observação informa somente que aquele produto não mudou de preço nesse intervalo. Ela não descreve o conjunto de preços da economia. O objetivo fundamental do Banco Central é assegurar a estabilidade de preços, o que não significa congelar individualmente todos os produtos. Portanto, o dado isolado não prova que o objetivo geral foi alcançado; também não permite concluir que ele tenha fracassado. A explicação deve reconhecer o limite da evidência sem inventar uma medição de inflação.',
      ['Separei um preço individual do conjunto da economia.', 'Não transformei estabilidade de preços em congelamento de todos os produtos.', 'Não declarei sucesso nem fracasso do objetivo geral com base em um único dado.'],
      ['politicas'], ['planalto.bcb.lc179']),
    task('apply.bcb.escopo.v1', 'Supervisão não significa exclusividade sobre tudo',
      'Uma frase fictícia informa que o Banco Central supervisiona instituições sob sua responsabilidade. Um estudante acrescenta: “Logo, qualquer atividade que envolva dinheiro só pode ser supervisionada pelo Banco Central.” A conclusão decorre da primeira frase? Explique o limite da afirmação sem precisar listar os outros supervisores que serão estudados depois.',
      'Não. A expressão sob sua responsabilidade delimita o campo de atuação. Saber que o Banco Central supervisiona determinadas instituições não demonstra que toda atividade relacionada a dinheiro pertença exclusivamente a ele. A conclusão amplia a afirmação original sem informação que a sustente. Para classificar outro caso, seria necessário conhecer o segmento, a atividade e a competência aplicável. Nesta etapa, reconhecer esse limite basta; não é preciso adivinhar o nome de outro supervisor nem aprender uma matéria nova no gabarito.',
      ['Observei o limite indicado por sob sua responsabilidade.', 'Não transformei uma competência em exclusividade sobre toda atividade financeira.', 'Indiquei que seriam necessárias informações do caso, sem inventar outro supervisor.'],
      ['supervisao', 'exemplo-supervisao'], ['bcb.sfn'])
  ])
});

// Deixar o catálogo legível mesmo se uma edição introduzir um erro: a validação
// de publicação detecta o problema; não remover material nem lançar erro no boot.
export function attachMonetaryApplications(mission) {
  const items = MONETARY_APPLICATIONS[mission?.id];
  if (!items || !Array.isArray(mission.sections)) return mission;
  const anchor = mission.sections.find((section) => section.id === 'resumo');
  if (!anchor || anchor.applicationTasks === items) return mission;
  if (anchor.applicationTasks !== undefined) return mission;
  return Object.freeze({
    ...mission,
    sections: Object.freeze(mission.sections.map((section) => section !== anchor ? section :
      Object.freeze({ ...section, applicationVersion: 1, applicationTasks: items })))
  });
}

export function validateMonetaryApplications(missions, sources) {
  const errors = [];
  const seen = new Set();
  for (const [missionId, items] of Object.entries(MONETARY_APPLICATIONS)) {
    const mission = missions.find((entry) => entry.id === missionId);
    if (!mission) { errors.push(`${missionId}:missing-mission`); continue; }
    const anchor = mission.sections?.find((section) => section.id === 'resumo');
    if (!anchor) { errors.push(`${missionId}:missing-anchor`); continue; }
    if (anchor.applicationTasks !== items) errors.push(`${missionId}:not-attached`);
    for (const item of items) {
      if (seen.has(item.id)) errors.push(`${item.id}:duplicate-id`);
      seen.add(item.id);
      for (const field of ['title', 'prompt', 'model']) {
        if (typeof item[field] !== 'string' || !item[field].trim()) errors.push(`${item.id}:empty-${field}`);
      }
      if (!item.criteria.length || item.criteria.some((entry) => !entry.trim())) errors.push(`${item.id}:missing-criteria`);
      if (!item.sectionIds.length) errors.push(`${item.id}:missing-teaching`);
      for (const sectionId of item.sectionIds) {
        if (!mission.sections.some((section) => section.id === sectionId && section.body?.trim())) {
          errors.push(`${item.id}:unknown-teaching:${sectionId}`);
        }
      }
      if (!item.sourceIds.length) errors.push(`${item.id}:missing-source`);
      for (const sourceId of item.sourceIds) {
        if (!sources.has(sourceId)) errors.push(`${item.id}:unknown-source:${sourceId}`);
        if (!mission.sourceIds?.includes(sourceId)) errors.push(`${item.id}:source-outside-lesson:${sourceId}`);
      }
    }
  }
  return errors;
}
