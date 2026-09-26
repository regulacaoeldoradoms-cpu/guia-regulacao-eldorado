'use strict';

// Aplicação após o ensino: sem nota, XP ou alteração do banco de questões.
const task = (id, title, prompt, model, criteria, sectionIds, sourceIds, origins = []) => Object.freeze({
  id, version: 1, kind: 'self-explanation', title, prompt, model,
  criteria: Object.freeze(criteria), sectionIds: Object.freeze(sectionIds),
  sourceIds: Object.freeze(sourceIds),
  originRefs: Object.freeze(origins.map(([missionId, sectionId]) => Object.freeze({ missionId, sectionId })))
});

export const PAYMENTS_REVIEW_APPLICATIONS = Object.freeze({
  'banking.sfn.pagamentos-consorcios': Object.freeze([
    task('apply.pag.arranjo.v1', 'O serviço, a instituição e a infraestrutura',
      'Situação fictícia: Luana usa o Pix para pagar uma oficina. Neste caso, a transferência entre as instituições é liquidada pelo SPI. Um colega chama Pix, instituição prestadora e SPI de três nomes do mesmo banco. Corrija a explicação: qual é o arranjo, quem presta o serviço ao cliente e qual é a infraestrutura citada? O exemplo descreve obrigatoriamente o caminho de toda operação que aparece como Pix?',
      'Pix é o arranjo de pagamentos; a instituição atende o cliente; o Sistema de Pagamentos Instantâneos, SPI, é a infraestrutura de liquidação citada. Esses papéis estão relacionados, mas não são três nomes de um banco. A liquidação é a efetivação da obrigação financeira, não apenas um aviso na tela. O enunciado delimitou uma transferência liquidada pelo SPI; não demonstrou que todas as operações internas e modalidades de participação seguem o mesmo caminho. Para conferir os conceitos, releia as partes sobre arranjo e SPI antes de memorizar a sigla.',
      ['Separei arranjo, prestador e infraestrutura.', 'Expliquei liquidação sem reduzi-la a um aviso no aplicativo.', 'Não generalizei o caso descrito para todo fluxo de pagamento.'],
      ['arranjo', 'spi', 'exemplo-pix'], ['planalto.pagamentos.12865', 'bcb.spi']),
    task('apply.pag.aplicativo.v1', 'A mesma tela prova que é o mesmo prestador?',
      'Situação fictícia: um aplicativo apresenta uma conta de pagamento e uma opção de empréstimo. A única informação fornecida é a aparência da tela. Uma pessoa conclui que ambos são oferecidos pela mesma instituição de pagamento e que isso a torna um banco. Essa conclusão é sustentada? Explique o que seria necessário identificar, sem presumir que a oferta é regular ou irregular.',
      'A tela, sozinha, não identifica a pessoa jurídica responsável por cada serviço. Um aplicativo pode reunir serviços de empresas diferentes. Seria necessário identificar os prestadores e as atividades autorizadas de cada um. Instituição de pagamento não vira banco por exibir uma opção de empréstimo; há atividades privativas de instituições financeiras que ela não pode exercer por essa condição. Ao mesmo tempo, não se pode declarar irregularidade só porque o aplicativo mostra os dois serviços: o empréstimo pode ser prestado por outra instituição. A explicação adequada reconhece o limite da informação.',
      ['Não deduzi a identidade jurídica dos prestadores pela aparência da tela.', 'Distingui serviços de pagamento e atividades privativas de instituições financeiras.', 'Não declarei regularidade ou irregularidade sem os dados necessários.'],
      ['instituicao', 'glossario'], ['planalto.pagamentos.12865']),
    task('apply.pag.consorcio.v1', 'Autofinanciamento significa ausência de custos?',
      'Situação fictícia: um grupo de consórcio é administrado por uma empresa autorizada pelo Banco Central. Um participante afirma que a autorização faz do Banco Central o financiador do grupo, elimina qualquer custo e garante contemplação imediata. Examine as três conclusões usando as funções de grupo, administradora e supervisor ensinadas na aula.',
      'As conclusões confundem funções. O consórcio se organiza por autofinanciamento do grupo, não por um empréstimo automático do Banco Central. A administradora presta o serviço de organizar e administrar e pode receber a remuneração prevista nas condições aplicáveis. Por isso, autofinanciamento não significa ausência de custos. A autorização e a supervisão da administradora também não prometem contemplação imediata ao participante. Para analisar valores ou prazos específicos seria necessário conhecer o contrato; o caso não os informa. Releia o exemplo para separar origem dos recursos, prestação do serviço e fiscalização.',
      ['Relacionei os recursos ao autofinanciamento do grupo.', 'Separei remuneração da administradora de ausência de custos.', 'Não converti autorização em empréstimo do Banco Central ou contemplação imediata.'],
      ['consorcio', 'exemplo-consorcio'], ['planalto.consorcios.11795'])
  ]),
  'banking.sfn.boss': Object.freeze([
    task('apply.boss.funcoes.v1', 'Reconstrua as funções sem trocar as instituições',
      'Revisão cumulativa, com situação fictícia: uma loja solicita crédito a um banco comercial. No mesmo dia, um estudante lê sobre diretrizes do Conselho Monetário Nacional, condução de política monetária pelo Banco Central e decisão da meta Selic pelo Copom. Ele conclui que todos estão aprovando o empréstimo daquela loja. Reorganize os papéis e explique por que tratar de crédito ou juros não torna as quatro funções iguais.',
      'O banco comercial presta o serviço e analisa a operação com a loja: é o papel operacional. O Conselho Monetário Nacional formula diretrizes gerais; o Banco Central conduz a política monetária dentro de suas competências; o Comitê de Política Monetária decide a meta Selic no âmbito do Banco Central. Nenhuma dessas descrições permite afirmar que o conselho ou o comitê aprovou o contrato individual. Os assuntos se relacionam, mas o alcance de cada decisão é diferente. Para retomar os exemplos completos, as aulas de Introdução, CMN, Banco Central, Copom e Operadores permanecem no mapa. Os botões abaixo levam à síntese desta preparação, sem iniciar outra rodada.',
      ['Separei a operação com o cliente das decisões de alcance geral.', 'Distingui CMN, Banco Central e Copom sem tratá-los como a mesma instituição.', 'Não atribuí a aprovação do contrato ao órgão que define diretrizes ou a meta Selic.'],
      ['mapa-monetario', 'mapa-capitais', 'glossario'], ['planalto.bcb.lc179', 'bcb.copom', 'bcb.sfn'],
      [['banking.sfn.introducao', 'operadores'], ['banking.sfn.cmn', 'papel'], ['banking.sfn.bacen', 'politicas'], ['banking.sfn.copom', 'meta'], ['banking.sfn.operadores', 'papel']]),
    task('apply.boss.segmentos.v1', 'Um canal de oferta, três campos diferentes',
      'Revisão cumulativa, com casos fictícios: uma pessoa encontra informações sobre uma oferta pública de ações, um plano de previdência complementar aberto e um plano administrado por entidade fechada. Como tudo envolve dinheiro, ela escolhe o mesmo supervisor para os três. Identifique a entidade supervisora diretamente relacionada a cada campo e explique por que é preciso observar o produto e seu enquadramento, não apenas o canal da informação.',
      'A oferta pública de valores mobiliários se relaciona ao campo da Comissão de Valores Mobiliários, CVM. A previdência complementar aberta é supervisionada pela Superintendência de Seguros Privados, SUSEP. A entidade fechada se relaciona à Superintendência Nacional de Previdência Complementar, PREVIC. Estar no mesmo canal de informação ou envolver dinheiro não elimina essas distinções. O enquadramento aberto ou fechado precisa ser conhecido; uma oferta ligada ao trabalho, sozinha, não basta. Releia as aulas CVM e Seguros/Previdência no mapa para os exemplos desenvolvidos. Esta comparação identifica competências, não promete rentabilidade nem recomenda produtos.',
      ['Associei corretamente valores mobiliários, previdência aberta e entidade fechada.', 'Justifiquei pelo segmento e enquadramento, não pelo canal de oferta.', 'Não confundi supervisão com recomendação ou garantia de resultado.'],
      ['mapa-capitais', 'mapa-seguros', 'exemplo', 'contraste'], ['cvm.competencia', 'susep.sobre', 'previc.missao'],
      [['banking.sfn.cvm', 'supervisao'], ['banking.sfn.seguros-previdencia', 'previdencia-aberta'], ['banking.sfn.seguros-previdencia', 'previdencia-fechada']]),
    task('apply.boss.pagamento-grupo.v1', 'Pagar pelo Pix muda a natureza do consórcio?',
      'Revisão cumulativa, com situação fictícia: integrantes de um consórcio usam Pix para pagar suas contribuições. Um estudante afirma que isso transforma o grupo em banco, que o SPI passa a ser a administradora e que o Banco Central empresta o dinheiro a cada integrante. Separe a forma de pagamento, a infraestrutura mencionada e a organização do autofinanciamento. O meio usado para pagar determina quando haverá contemplação?',
      'Pix é o arranjo utilizado no pagamento, não a natureza do grupo. O SPI é infraestrutura de liquidação, não administradora de consórcio. O grupo continua organizado por autofinanciamento; a administradora presta o serviço de gestão; o Banco Central atua nas suas competências de autorização e supervisão. Usar Pix não transforma o grupo em banco nem cria empréstimo automático do Banco Central. Tampouco fixa a contemplação, que depende das condições do grupo. O caso conecta conceitos já ensinados em Pagamentos/Consórcios: forma de pagar e forma de financiar uma aquisição são perguntas diferentes.',
      ['Distingui arranjo de pagamento, infraestrutura e administradora.', 'Mantive a natureza de autofinanciamento apesar do meio de pagamento.', 'Não deduzi contemplação ou empréstimo automático a partir do uso do Pix.'],
      ['mapa-pagamentos', 'glossario', 'resumo'], ['bcb.spi', 'planalto.pagamentos.12865', 'planalto.consorcios.11795'],
      [['banking.sfn.pagamentos-consorcios', 'spi'], ['banking.sfn.pagamentos-consorcios', 'consorcio']])
  ])
});

export function attachPaymentsReviewApplications(mission) {
  const items = PAYMENTS_REVIEW_APPLICATIONS[mission?.id];
  if (!items || !Array.isArray(mission.sections)) return mission;
  const anchor = mission.sections.find((section) => section.id === 'resumo');
  if (!anchor || anchor.applicationTasks !== undefined) return mission;
  return Object.freeze({
    ...mission,
    sourceIds: Object.freeze([...new Set([...(mission.sourceIds || []), ...items.flatMap((item) => item.sourceIds)])]),
    sections: Object.freeze(mission.sections.map((section) => section !== anchor ? section :
      Object.freeze({ ...section, applicationVersion: 1, applicationTasks: items })))
  });
}

// Referências de origem do Chefe são editoriais: o botão Reler usa sectionIds
// da preparação atual. Nenhuma navegação entre missões ou sessão é criada aqui.
export function validatePaymentsReviewApplications(missions, sources) {
  const errors = [];
  const catalog = new Map(missions.map((mission) => [mission.id, mission]));
  const seen = new Set();
  for (const [missionId, items] of Object.entries(PAYMENTS_REVIEW_APPLICATIONS)) {
    const mission = catalog.get(missionId);
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
      if (!item.criteria.length || item.criteria.some((text) => !text.trim())) errors.push(`${item.id}:missing-criteria`);
      if (!item.sectionIds.length) errors.push(`${item.id}:missing-teaching`);
      for (const sectionId of item.sectionIds) {
        if (!mission.sections.some((section) => section.id === sectionId && section.body?.trim())) errors.push(`${item.id}:unknown-teaching:${sectionId}`);
      }
      if (!item.sourceIds.length) errors.push(`${item.id}:missing-source`);
      for (const sourceId of item.sourceIds) {
        if (!sources.has(sourceId)) errors.push(`${item.id}:unknown-source:${sourceId}`);
        if (!mission.sourceIds?.includes(sourceId)) errors.push(`${item.id}:source-outside-lesson:${sourceId}`);
      }
      if (mission.kind === 'boss' && !item.originRefs.length) errors.push(`${item.id}:missing-origin`);
      for (const ref of item.originRefs) {
        const origin = catalog.get(ref.missionId);
        if (!origin?.sections?.some((section) => section.id === ref.sectionId && section.body?.trim())) errors.push(`${item.id}:unknown-origin:${ref.missionId}:${ref.sectionId}`);
        if (origin && origin.order >= mission.order) errors.push(`${item.id}:origin-not-earlier:${ref.missionId}`);
      }
    }
  }
  return errors;
}
