'use strict';

// Revisão editorial delimitada das quatro primeiras aulas. Não altera questões,
// ordem, IDs de seção, versão já em revisão, pontuação ou dados do estudante.
export const FUNDAMENTALS_SOURCES = Object.freeze([
  Object.freeze({
    id: 'planalto.bcb.lc179',
    label: 'Lei Complementar nº 179/2021 — objetivos e autonomia do Banco Central (arts. 1º, 2º e 6º)',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm',
    checkedAt: '2026-09-26',
    kind: 'norma-oficial'
  })
]);

const review = (sourceIds, sections) => Object.freeze({
  sourceIds: Object.freeze(sourceIds),
  sections: Object.freeze(sections)
});

export const FUNDAMENTALS_REVIEW = Object.freeze({
  'banking.sfn.introducao': review(['cvm.educacao.estrutura-sfn'], {
    cotidiano: 'Receber o salário em uma conta, guardar parte do dinheiro e procurar um empréstimo são situações diferentes. Guardar dinheiro, por si só, não exige usar um banco: você pode reservar uma quantia em casa. O sistema financeiro aparece quando instituições participam dessas relações, oferecendo serviços ou intermediando recursos. Nesta aula, partiremos de três perguntas: quem oferece o serviço? Quem verifica o cumprimento das obrigações da instituição? Quem estabelece as orientações gerais? São papéis diferentes, e você vai aprender o sentido de cada um antes de memorizar nomes.',
    intermediacao: 'Situação inventada: Ana recebe dinheiro que não pretende gastar imediatamente. Uma oficina precisa de recursos para comprar uma ferramenta antes de ter recebido o pagamento de seus clientes. Elas podem procurar serviços financeiros sem se conhecer. Captar recursos significa obtê-los; conceder crédito significa disponibilizá-los com condições de devolução. Ao exercer essas atividades, um banco pode intermediar relações entre quem disponibiliza recursos e quem precisa deles. Intermediação financeira é esse papel de ligação. A oficina terá de pagar conforme o contrato, e o banco precisa avaliar a possibilidade de não receber de volta: esse é um risco de crédito. O exemplo não significa que o depósito específico de Ana seja entregue diretamente à oficina, nem que todo crédito dependa de localizar um poupador correspondente. Ele explica a função de intermediação, não toda a criação de moeda pelos bancos.',
    'exemplo-operador': 'Situação inventada: uma instituição analisa um empréstimo solicitado por uma padaria. Primeiro identifique a atividade: oferecer crédito a um cliente. Depois classifique o papel: operador. Agora pense em uma entidade verificando se instituições cumprem suas obrigações: a atividade é de supervisão. Não transforme isso em um macete de palavra única. O Banco Central também pode editar regras dentro de suas competências; encontrar a palavra regra não prova, sozinho, que o enunciado fala do Conselho Monetário Nacional. A resposta depende da instituição, de sua atribuição e da situação descrita.'
  }),
  'banking.sfn.cmn': review(['fazenda.cmn.apresentacao', 'planalto.bcb.lc179'], {
    papel: 'Crédito, nesta aula, é a disponibilização de recursos com obrigação de pagamento futuro. Política significa um conjunto de orientações e medidas, não um partido político. O Conselho Monetário Nacional formula diretrizes para a moeda e o crédito. Para entender a diferença de escala, compare uma orientação sobre o funcionamento do crédito no país com a decisão de emprestar a um cliente específico. A primeira é orientação geral; a segunda é uma operação do prestador de serviços. O conselho não analisa o pedido individual de financiamento de cada pessoa.',
    diferencas: 'Normativo, supervisor e operador descrevem funções, não uma fila em que o conselho decide cada ação dos demais. O Conselho Monetário Nacional estabelece metas de política monetária. O Banco Central do Brasil conduz a política necessária para buscá-las e possui autonomia nos termos da lei. Autonomia significa poder exercer suas atribuições sem subordinação hierárquica ou vinculação a um ministério; não significa poder ignorar a lei ou os objetivos estabelecidos. Bancos comerciais prestam serviços aos clientes. Também não é correto dizer que somente o conselho pode editar qualquer norma: o Banco Central possui competências normativas próprias.',
    'exemplo-orientacao': 'Situação fictícia: uma padaria pede crédito para comprar um forno. Quem analisa esse pedido e oferece o contrato atua como operador. Em outro enunciado, um conselho formula diretrizes gerais para a moeda e o crédito: a descrição corresponde ao Conselho Monetário Nacional. Compare o alcance da decisão e o papel da instituição, não só a presença da palavra crédito. As duas situações tratam de dinheiro, mas uma é atendimento a um cliente e a outra é orientação geral do sistema.'
  }),
  'banking.sfn.bacen': review(['planalto.bcb.lc179'], {
    natureza: 'Autarquia é uma entidade pública com atribuições próprias. O Banco Central é uma autarquia de natureza especial. Essa expressão não quer dizer que seja uma agência comercial mais importante: a lei lhe confere autonomia e não o subordina hierarquicamente a um ministério. Sua função continua sujeita a objetivos e regras legais. Autonomia, portanto, é diferente de ausência de responsabilidades. Para a prova, separe duas perguntas: que tipo de entidade ele é? Uma autarquia especial. Ele atende ao público como um banco comercial comum? Não é essa a sua função institucional.',
    politicas: 'Política monetária envolve decisões sobre condições de moeda e juros. Câmbio é a troca entre moedas; política cambial trata desse campo. O objetivo fundamental do Banco Central é a estabilidade de preços. Isso não quer dizer congelar o preço de cada produto: trata-se da estabilidade no conjunto da economia. O Conselho Monetário Nacional estabelece metas de política monetária, e o Banco Central conduz as medidas para cumpri-las. É possível exercer essa condução com autonomia e, ao mesmo tempo, seguir objetivos definidos em lei. A aula do Comitê de Política Monetária mostrará a decisão sobre a meta Selic, que não deve ser confundida com toda meta de política monetária.',
    'exemplo-supervisao': 'Situação fictícia: o enunciado descreve uma entidade pública que acompanha instituições financeiras e conduz a política monetária. Passo 1: isso não é a venda de um empréstimo a um cliente. Passo 2: identifique as funções de supervisão e condução de política monetária. Passo 3: associe esse conjunto ao Banco Central do Brasil. Agora examine a afirmação esse órgão é uma agência subordinada ao Ministério da Fazenda. Ela acrescenta uma informação incorreta: o Banco Central possui autonomia nos termos da Lei Complementar nº 179. Acertar uma parte da descrição não torna correta a frase inteira.'
  }),
  'banking.sfn.copom': review(['bcb.copom', 'planalto.bcb.lc179'], {
    juros: 'Juros são a remuneração pelo uso do dinheiro ao longo do tempo. Em um exemplo fictício, sem outras cobranças, alguém recebe R$ 100 e combina devolver R$ 110 depois de um prazo: os R$ 10 adicionais são juros. Inflação é a elevação geral de preços em um período. Um único produto ficar mais caro não basta para concluir que todos os preços subiram. Para compreender poder de compra, imagine uma lista de compras que antes custava R$ 100 e passou a custar R$ 110: a mesma nota de R$ 100 já não paga aquela lista inteira. Esse exemplo explica a ideia; ele não é uma medição oficial da inflação.',
    selic: 'Selic significa Sistema Especial de Liquidação e de Custódia. Antes de continuar: título público federal é um instrumento de dívida da União; custódia se refere à guarda e ao registro; liquidação é a efetivação da operação. Além do nome do sistema, existe a taxa Selic, calculada a partir de certas operações de financiamento de curtíssimo prazo ligadas a títulos públicos federais. E existe a meta para essa taxa, definida pelo Copom. São três ideias relacionadas, mas não idênticas: sistema, taxa apurada e meta. Para as questões iniciais, retenha principalmente quem define a meta: o Comitê de Política Monetária.',
    meta: 'Meta é um objetivo numérico, mas metas diferentes não medem a mesma coisa. Uma meta para a inflação se refere à variação de preços; a meta para a taxa Selic se refere aos juros básicos. O Comitê de Política Monetária, Copom, decide a meta Selic no âmbito do Banco Central. O banco usa a política monetária para perseguir os objetivos estabelecidos, sem que isso torne a Selic igual aos juros de todos os empréstimos. Prazo, risco e outras condições também influenciam contratos. Logo, não confunda meta de inflação, meta Selic e taxa cobrada de um consumidor.',
    'exemplo-meta': 'Situação fictícia: uma notícia relata que o Presidente e os Diretores do Banco Central se reuniram para decidir a meta Selic. A composição indica o Comitê de Política Monetária; a decisão descrita confirma a associação. Agora uma segunda notícia descreve um banco oferecendo financiamento a uma família. Mesmo que a taxa de juros básica influencie as condições econômicas, esse contrato não é decidido individualmente pelo Copom. O primeiro caso é uma decisão de política monetária; o segundo, uma operação com um cliente. O objetivo é compreender essa diferença, não decorar uma taxa atual.'
  })
});

export function reviseFundamentalsSections(missionId, sections) {
  const changes = FUNDAMENTALS_REVIEW[missionId]?.sections;
  if (!changes) return sections;
  return Object.freeze(sections.map((section) =>
    Object.prototype.hasOwnProperty.call(changes, section.id)
      ? Object.freeze({ ...section, body: changes[section.id] })
      : section
  ));
}

// Usado no CI: um ID incorreto na revisão não pode ser ignorado silenciosamente.
export function validateFundamentalsTargets(missions) {
  const errors = [];
  for (const [missionId, changes] of Object.entries(FUNDAMENTALS_REVIEW)) {
    const mission = missions.find((item) => item.id === missionId);
    if (!mission) { errors.push(`${missionId}:missing-mission`); continue; }
    for (const sectionId of Object.keys(changes.sections)) {
      const section = mission.sections.find((item) => item.id === sectionId);
      if (!section) errors.push(`${missionId}:${sectionId}:missing-section`);
      else if (section.body !== changes.sections[sectionId]) errors.push(`${missionId}:${sectionId}:revision-not-applied`);
    }
  }
  return errors;
}
