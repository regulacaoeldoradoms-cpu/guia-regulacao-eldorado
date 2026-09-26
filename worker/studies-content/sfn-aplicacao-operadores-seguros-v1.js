'use strict';

// Aplicação formativa após o ensino. Não integra as questões que concedem XP.
const task = (id, title, prompt, model, criteria, sectionIds, sourceIds) => Object.freeze({
  id, version: 1, kind: 'self-explanation', title, prompt, model,
  criteria: Object.freeze(criteria), sectionIds: Object.freeze(sectionIds),
  sourceIds: Object.freeze(sourceIds)
});

export const OPERATORS_INSURANCE_SOURCES = Object.freeze([Object.freeze({
  id: 'susep.faq.seguros.premio',
  label: 'SUSEP — perguntas sobre seguros: significado de prêmio (item 3)',
  url: 'https://www.gov.br/susep/pt-br/acesso-a-informacao/perguntas-frequentes/pasta-das-perguntas-frequentes/perguntas-mais-frequentes-sobre-seguros',
  checkedAt: '2026-09-26', kind: 'conteudo-oficial'
})]);

export const OPERATORS_INSURANCE_APPLICATIONS = Object.freeze({
  'banking.sfn.operadores': Object.freeze([
    task('apply.oper.canais.v1', 'Quatro agências são quatro carteiras?',
      'Situação fictícia: uma instituição abre quatro agências e lança dois aplicativos. Um colega conclui que ela tem seis carteiras e, por isso, já comprovou sua classificação como banco múltiplo. Explique o erro. Que informação sobre suas atividades seria necessária para analisar as carteiras, sem contar locais de atendimento ou aplicativos?',
      'Agência e aplicativo são formas de atendimento, não carteiras bancárias. Neste assunto, carteira identifica um conjunto de operações autorizado, como explicado na aula. A quantidade de canais não informa quais carteiras a instituição possui. Seria necessário conhecer suas carteiras efetivamente autorizadas e aplicar os critérios correspondentes. Não se pode concluir pela quantidade de agências que ela é banco múltiplo; também não se pode concluir que não seja. O exemplo verifica a diferença entre canais e atividades, não todas as exigências de autorização de um banco.',
      ['Distingui canais de atendimento e carteiras bancárias.', 'Identifiquei que faltam informações sobre as operações autorizadas.', 'Não concluí a classificação apenas contando agências ou aplicativos.'],
      ['carteira', 'multiplo', 'resumo'], ['bcb.bancos-multiplos.educacional']),
    task('apply.oper.papel.v1', 'Analisar o cliente é supervisionar o sistema?',
      'Situação fictícia: um banco comercial recebe depósitos e examina os documentos de uma empresa antes de lhe oferecer crédito. Um estudante diz que, por verificar documentos, o banco está exercendo o papel de supervisor do Sistema Financeiro Nacional. Explique por que analisar uma proposta de cliente não é o mesmo que fiscalizar instituições como autoridade supervisora.',
      'O banco está prestando serviços e analisando uma operação com seu cliente: é uma atuação operacional. Verificar informações para decidir um contrato não o transforma na autoridade que supervisiona instituições do sistema. Importam a finalidade e o papel exercido, não apenas o verbo verificar. O banco continua sujeito às regras e à supervisão que lhe são aplicáveis. Classificá-lo como operador não significa que possa ignorar essas obrigações, nem demonstra que o crédito já foi aprovado.',
      ['Reconheci a atividade de prestação de serviços ao cliente.', 'Expliquei por que conferir documentos não basta para caracterizar supervisão institucional.', 'Não confundi papel operacional com ausência de regras ou aprovação automática de crédito.'],
      ['papel', 'comercial', 'exemplo-papel'], ['cvm.educacao.estrutura-sfn']),
    task('apply.oper.natureza.v1', 'Mesmo supervisor, mesma natureza?',
      'Dois prestadores fictícios, um banco e uma instituição de pagamento, estão sujeitos à atuação do Banco Central nos campos aplicáveis. Um colega afirma: “Se são fiscalizados pela mesma entidade, ambos são bancos e podem praticar todas as mesmas operações.” A conclusão é válida? Use a distinção ensinada na aula, sem precisar listar modalidades de pagamento ainda não estudadas.',
      'Não. Compartilhar um supervisor não torna iguais a natureza jurídica e as atividades permitidas de cada prestador. Uma instituição de pagamento não se torna banco por estar sob supervisão do Banco Central. A legislação distingue suas atividades das atividades privativas de instituições financeiras. É preciso identificar o tipo de instituição e suas permissões, em vez de deduzir tudo do nome do supervisor. A resposta não exige antecipar as modalidades de pagamento: basta reconhecer o limite dessa inferência.',
      ['Não deduzi a natureza do prestador apenas de quem o supervisiona.', 'Distingui instituição de pagamento de banco.', 'Considerei as atividades permitidas sem antecipar produtos não ensinados.'],
      ['outros', 'papel'], ['planalto.pagamentos.12865'])
  ]),
  'banking.sfn.seguros-previdencia': Object.freeze([
    task('apply.segprev.premio.v1', 'Prêmio é um valor que vou ganhar?',
      'Situação fictícia: ao ler a expressão prêmio do seguro, uma pessoa entende que a seguradora vai premiá-la com aquele valor. Corrija a interpretação: o que significa prêmio neste contexto e em que sentido ocorre o pagamento? Explique também por que pagar pelo seguro não permite concluir que qualquer acontecimento estará coberto.',
      'Prêmio é o valor pago pela contratação do seguro, não uma recompensa recebida pelo segurado. Nesse sentido, o pagamento é destinado à seguradora pela cobertura contratada, e não o contrário. A proteção depende dos riscos, limites e condições previstos. Pagar o prêmio não transforma o contrato em cobertura de todos os acontecimentos. O caso não traz uma ocorrência concreta nem as condições do contrato, portanto não permite decidir se uma indenização específica seria devida.',
      ['Usei o significado técnico de prêmio, não o de premiação.', 'Expliquei o sentido do pagamento pela contratação.', 'Relacionei a proteção às condições contratadas, sem prometer cobertura de tudo.'],
      ['seguro', 'glossario'], ['susep.faq.seguros.premio']),
    task('apply.segprev.coletivo.v1', 'O empregador ofereceu: é necessariamente fechado?',
      'Compare duas situações fictícias. A empresa Aurora oferece aos empregados um plano aberto coletivo operado por entidade autorizada. Já os empregados da empresa Boreal participam de plano administrado por uma entidade fechada, vinculada à patrocinadora. Identifique a supervisão relacionada a cada modalidade. Se a informação fosse apenas “plano oferecido no trabalho”, seria possível escolher com certeza?',
      'A modalidade aberta está no campo da Superintendência de Seguros Privados, SUSEP; a entidade fechada é supervisionada pela Superintendência Nacional de Previdência Complementar, PREVIC. O vínculo com o trabalho, sozinho, não decide a classificação: existem planos abertos coletivos. Nos casos descritos, o enquadramento da entidade e do plano fornece a informação necessária. Sem esses dados, escolher aberta ou fechada com certeza seria ir além do enunciado. O empregador ou patrocinador também não se confunde com o supervisor.',
      ['Associei aberta à SUSEP e entidade fechada à PREVIC.', 'Não tratei toda oferta no trabalho como previdência fechada.', 'Indiquei o enquadramento da entidade e do plano como informação necessária.'],
      ['previdencia-aberta', 'previdencia-fechada', 'exemplo-fechado'], ['planalto.previdencia.109', 'susep.sobre', 'previc.como-participar']),
    task('apply.segprev.canal.v1', 'O lugar da oferta muda o tipo de produto?',
      'Situação fictícia: em uma agência bancária, uma pessoa recebe uma oferta identificada como título de capitalização. Ela conclui que o produto é igual a um depósito de poupança, com as mesmas condições, e que a SUSEP não tem relação com ele porque a oferta veio de um banco. Explique os dois problemas, sem recomendar a contratação ou supor valores de resgate.',
      'O local da oferta não transforma título de capitalização em depósito de poupança. São produtos com finalidades e condições próprias; não se pode transferir automaticamente as regras de um para o outro. O mercado de capitalização está no campo de supervisão da SUSEP. Isso não torna a SUSEP a vendedora do título nem elimina outras obrigações do prestador. Para avaliar um resgate específico seriam necessárias as condições do produto, ausentes do caso. O objetivo é separar canal de oferta, natureza do produto e função supervisora.',
      ['Não igualei produtos diferentes porque foram oferecidos na mesma agência.', 'Identifiquei o campo da SUSEP sem confundi-la com o vendedor.', 'Não inventei condições de resgate ou recomendação de compra.'],
      ['capitalizacao', 'cnsp', 'resumo'], ['susep.sobre'])
  ])
});

export function attachOperatorsInsuranceApplications(mission) {
  const items = OPERATORS_INSURANCE_APPLICATIONS[mission?.id];
  if (!items || !Array.isArray(mission.sections)) return mission;
  const anchor = mission.sections.find((section) => section.id === 'resumo');
  if (!anchor || anchor.applicationTasks === items || anchor.applicationTasks !== undefined) return mission;
  return Object.freeze({
    ...mission,
    sourceIds: Object.freeze([...new Set([...(mission.sourceIds || []), ...items.flatMap((item) => item.sourceIds)])]),
    sections: Object.freeze(mission.sections.map((section) => section !== anchor ? section :
      Object.freeze({ ...section, applicationVersion: 1, applicationTasks: items })))
  });
}

export function validateOperatorsInsuranceApplications(missions, sources) {
  const errors = [];
  const seen = new Set();
  for (const [missionId, items] of Object.entries(OPERATORS_INSURANCE_APPLICATIONS)) {
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
        if (!mission.sections.some((section) => section.id === sectionId && section.body?.trim())) errors.push(`${item.id}:unknown-teaching:${sectionId}`);
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
