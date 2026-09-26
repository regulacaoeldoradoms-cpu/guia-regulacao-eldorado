'use strict';

// Casos formativos depois do ensino. Nunca entram no banco de questões pontuadas.
const task = (id, title, prompt, model, criteria, sectionIds, sourceIds) => Object.freeze({
  id, version: 1, kind: 'self-explanation', title, prompt, model,
  criteria: Object.freeze(criteria), sectionIds: Object.freeze(sectionIds),
  sourceIds: Object.freeze(sourceIds)
});

export const MARKET_APPLICATIONS = Object.freeze({
  'banking.sfn.copom': Object.freeze([
    task('apply.copom.contrato.v1', 'A meta determina todos os contratos?',
      'Situação fictícia: após uma decisão do Comitê de Política Monetária, um colega afirma que todos os bancos devem oferecer qualquer empréstimo exatamente à taxa Selic e com o mesmo prazo. Explique por que essa conclusão mistura uma decisão para a economia com as condições de um contrato. Você precisa saber a taxa vigente para perceber o erro?',
      'Não é necessário saber a taxa vigente. O Copom decide a meta para a taxa Selic; isso não fixa individualmente as condições de cada empréstimo. Prazo, risco e outras condições do contrato também importam. A taxa básica influencia o ambiente de crédito, mas influenciar não significa tornar todas as taxas e prazos iguais. A conclusão também não autoriza o banco a ignorar regras aplicáveis: apenas distingue a meta de política monetária da operação com um cliente. O enunciado não permite calcular a taxa de um empréstimo específico.',
      ['Distingui a meta Selic das condições de um empréstimo.', 'Expliquei por que influência não implica taxas e prazos idênticos.', 'Não inventei uma taxa atual nem um valor para o contrato.'],
      ['meta', 'exemplo-meta', 'resumo'], ['bcb.copom', 'planalto.bcb.lc179']),
    task('apply.copom.tres-sentidos.v1', 'Três usos do mesmo nome',
      'Você encontra três anotações fictícias: A descreve uma infraestrutura de liquidação e custódia de títulos públicos; B descreve uma taxa apurada a partir de operações; C descreve um objetivo para essa taxa decidido pelo Copom. Organize as anotações como sistema, taxa apurada e meta. Explique por que a palavra Selic, sozinha, não torna as três descrições iguais.',
      'A corresponde ao sistema; B, à taxa apurada; C, à meta. A infraestrutura organiza operações, a taxa apurada resulta das operações consideradas em seu cálculo e a meta é o objetivo decidido pelo comitê. Os conceitos estão relacionados, mas cumprem papéis diferentes. Dizer que o Copom decide a meta não significa que ele escolhe cada operação realizada no sistema. Também não basta comparar nomes para afirmar que toda taxa observada seja necessariamente igual à meta. A atividade pede a distinção conceitual, não o cálculo da taxa.',
      ['Associei A ao sistema, B à taxa apurada e C à meta.', 'Expliquei a diferença entre infraestrutura, resultado apurado e objetivo.', 'Não usei o mesmo nome como prova de que são conceitos idênticos.'],
      ['selic', 'meta', 'glossario'], ['bcb.copom']),
    task('apply.copom.efeito.v1', 'Uma observação já prova o resultado?',
      'Situação fictícia: no dia seguinte a uma decisão sobre a meta Selic, dois produtos de uma loja continuam com os mesmos preços. Um colega declara que isso prova que a política monetária fracassou. O que essa observação realmente informa? Explique por que ela não basta para comprovar sucesso ou fracasso da política, sem fazer previsões sobre a próxima decisão.',
      'A observação informa somente que os preços daqueles dois produtos não mudaram nesse intervalo. A aula não apresenta a política monetária como um botão que altera todos os preços imediatamente. Condições de crédito podem influenciar decisões de consumo e investimento, e a estabilidade de preços se refere ao conjunto da economia. O dado isolado não demonstra fracasso, mas também não demonstra sucesso. A resposta adequada reconhece o limite da evidência e não inventa uma medição de inflação ou uma previsão para a próxima reunião.',
      ['Limitei a conclusão aos produtos e ao intervalo observados.', 'Não tratei a política monetária como mudança imediata de todos os preços.', 'Evitei afirmar sucesso, fracasso ou previsão sem informação suficiente.'],
      ['juros', 'relacao', 'meta'], ['planalto.bcb.lc179'])
  ]),
  'banking.sfn.cvm': Object.freeze([
    task('apply.cvm.destino.v1', 'Quem recebe os recursos em cada momento?',
      'Situação fictícia: a companhia Horizonte emite novas ações, compradas por Elisa. Em outro momento, Elisa vende parte dessas mesmas ações a Diogo. Um colega afirma que os dois pagamentos vão para a companhia porque ambos envolvem ações dela. Identifique quem recebe o pagamento em cada etapa e explique a diferença entre emissão e negociação posterior.',
      'Na colocação das novas ações, a companhia recebe os recursos da emissão. Na venda posterior das ações que Elisa já possui, é Elisa quem recebe o pagamento de Diogo. A empresa continua sendo a emissora das ações, mas não está captando novamente nessa venda entre investidores. O primeiro caso é emissão; o segundo, negociação de instrumentos existentes. A conclusão deve se limitar aos dois casos descritos: não significa que toda oferta pública seja necessariamente emissão de ações novas. Também não informa se Elisa teve lucro, pois os preços não foram fornecidos.',
      ['Identifiquei a companhia como recebedora na emissão e Elisa na venda posterior.', 'Expliquei por que emissor e vendedor não são sempre a mesma pessoa.', 'Não presumi lucro nem generalizei que qualquer oferta seja captação nova.'],
      ['acoes', 'mercado', 'exemplo-oferta'], ['planalto.cvm.6385', 'planalto.sa.6404']),
    task('apply.cvm.participacao-divida.v1', 'Mesmo mercado, relações diferentes',
      'Uma estudante encontra ações e debêntures entre os valores mobiliários e conclui: “Se pertencem ao mesmo mercado, comprar qualquer um deles me torna acionista.” Corrija o raciocínio com base na aula. Explique a diferença entre participação no capital e uma relação de dívida, sem recomendar qual produto comprar.',
      'Estar no mercado de valores mobiliários não torna os instrumentos iguais. A ação representa participação no capital da sociedade; a debênture representa uma relação de dívida do emissor. A compra de uma debênture, por si só, não transforma alguém em acionista: condições especiais de um título não podem ser presumidas quando não foram descritas. A classificação geral não determina sozinha a natureza da relação. Essa distinção também não é uma promessa de retorno nem uma recomendação de investimento. O exercício pede compreender o vínculo, não escolher o melhor produto.',
      ['Distingui participação societária e relação de dívida.', 'Não concluí que todo valor mobiliário transforma seu titular em acionista.', 'Não converti a distinção em promessa de retorno ou recomendação.'],
      ['nome', 'acoes', 'resumo'], ['planalto.cvm.6385', 'planalto.sa.6404']),
    task('apply.cvm.fiscalizacao-risco.v1', 'Fiscalização equivale a lucro garantido?',
      'Situação fictícia: uma corretora intermedeia a compra de ações por um investidor. Ele afirma que, como a Comissão de Valores Mobiliários fiscaliza esse mercado, as ações necessariamente vão se valorizar. Distinga investidor, intermediário e supervisor e explique o que a fiscalização não permite prometer.',
      'O investidor compra as ações e está sujeito aos riscos da posição; a corretora intermedeia a operação; a CVM exerce regulação e fiscalização em seu campo. A proteção contra irregularidades e a supervisão do mercado não são uma garantia de valorização ou de ausência de perdas. A CVM não se transforma em compradora nem na empresa que emitiu as ações. Da mesma forma, uma oscilação de preço, isoladamente, não comprova que houve fraude. Seriam necessárias outras informações para analisar a regularidade de um caso concreto.',
      ['Separei investidor, intermediário e supervisor.', 'Não confundi proteção contra irregularidades com rentabilidade garantida.', 'Evitei deduzir fraude ou ausência de risco apenas do comportamento de um preço.'],
      ['participantes', 'supervisao', 'exemplo-fraude'], ['cvm.competencia', 'planalto.cvm.6385'])
  ])
});

export function attachMarketApplications(mission) {
  const items = MARKET_APPLICATIONS[mission?.id];
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

export function validateMarketApplications(missions, sources) {
  const errors = [];
  const seen = new Set();
  for (const [missionId, items] of Object.entries(MARKET_APPLICATIONS)) {
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
