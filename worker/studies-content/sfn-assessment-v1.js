'use strict';

const ref = (missionId, sectionId) => Object.freeze({ missionId, sectionId });
const question = (id, competency, prompt, options, answer, explanation, teachingRefs) => Object.freeze({
  id,
  competency,
  prompt,
  options: Object.freeze(options),
  answer,
  explanation,
  teachingRefs: Object.freeze(teachingRefs)
});
const form = (id, questions) => Object.freeze({ id, questions: Object.freeze(questions) });

export const SFN_TRANSFER_ASSESSMENT = Object.freeze({
  id: 'assessment.sfn-foundation.transfer.v1',
  version: 1,
  blockId: 'banking.sfn-foundation',
  title: 'Avaliação independente — fundamentos do SFN',
  description: 'Questões novas para verificar aplicação do que foi ensinado no primeiro bloco. Não concede XP e não altera a taxa de acerto das práticas.',
  unlockMissionId: 'banking.sfn.boss',
  questionCount: 12,
  forms: Object.freeze([
    form('A', [
      question(
        'eval.sfn.a01', 'estrutura',
        'Uma empresa pede crédito a um banco. Ao mesmo tempo, um órgão colegiado define diretrizes gerais para moeda e crédito. Qual leitura separa corretamente as duas situações?',
        [
          'O colegiado decide se a empresa receberá aquele empréstimo específico.',
          'O banco analisa a operação individual; o CMN atua em diretrizes gerais da moeda e do crédito.',
          'O Banco Central substitui o banco e aprova todos os contratos privados.',
          'O CMN e o banco comercial exercem a mesma função em escalas diferentes.'
        ],
        1,
        'O CMN formula diretrizes gerais; a análise de um contrato específico pertence à atividade do prestador que opera com o cliente. Relacionar temas de crédito não torna as funções iguais.',
        [ref('banking.sfn.cmn', 'papel'), ref('banking.sfn.cmn', 'exemplo-orientacao')]
      ),
      question(
        'eval.sfn.a02', 'estrutura',
        'O Presidente do Banco Central participa do CMN. O que se pode concluir apenas dessa informação e da composição ensinada?',
        [
          'Ele participa do colegiado, mas a presidência do CMN cabe ao Ministro da Fazenda.',
          'Ele preside o CMN porque representa a autoridade monetária.',
          'Ele deixa de exercer funções no Banco Central enquanto participa do conselho.',
          'Ele decide sozinho todas as deliberações do CMN.'
        ],
        0,
        'Participar do colegiado não significa presidi-lo. Na composição ensinada, o Ministro da Fazenda preside o CMN.',
        [ref('banking.sfn.cmn', 'composicao'), ref('banking.sfn.cmn', 'exemplo-composicao')]
      ),
      question(
        'eval.sfn.a03', 'politica-monetaria',
        'Uma fiscalização verifica se instituições sob responsabilidade do Banco Central cumprem regras e administram riscos. Qual papel está sendo descrito?',
        [
          'Atendimento bancário ao consumidor.',
          'Formulação de uma oferta pública pela CVM.',
          'Supervisão exercida pelo Banco Central em seu campo de competência.',
          'Prestação de serviço por um banco comercial.'
        ],
        2,
        'Fiscalizar instituições e acompanhar o cumprimento das regras caracteriza supervisão. Isso é diferente de vender produtos ou atender um cliente.',
        [ref('banking.sfn.bacen', 'supervisao'), ref('banking.sfn.bacen', 'exemplo-supervisao')]
      ),
      question(
        'eval.sfn.a04', 'politica-monetaria',
        'Em uma reunião, um colegiado no âmbito do Banco Central decide a meta para a taxa básica de juros. Qual combinação identifica corretamente o colegiado e sua decisão?',
        [
          'CMN — aprovar cada operação de crédito bancário.',
          'CVM — definir a meta Selic.',
          'Copom — definir a meta para a taxa Selic.',
          'Banco comercial — definir a política monetária nacional.'
        ],
        2,
        'O Copom funciona no âmbito do Banco Central e decide a meta para a taxa Selic. Essa decisão não é a aprovação de contratos individuais.',
        [ref('banking.sfn.copom', 'meta'), ref('banking.sfn.copom', 'nome')]
      ),
      question(
        'eval.sfn.a05', 'mercado-capitais',
        'A empresa Alfa emite novas ações; uma corretora participa da distribuição e Carla compra os papéis. Nesse exemplo, quem capta recursos na emissão e quem supervisiona o mercado de valores mobiliários?',
        [
          'A corretora capta; o Banco Central supervisiona.',
          'Carla capta; o CMN supervisiona.',
          'A empresa Alfa capta; a CVM atua na supervisão do mercado.',
          'A CVM capta; a corretora supervisiona.'
        ],
        2,
        'Na emissão de novas ações, a empresa emissora capta os recursos. A CVM regula e fiscaliza o mercado de valores mobiliários; ela não é investidora nem emissora.',
        [ref('banking.sfn.cvm', 'mercado'), ref('banking.sfn.cvm', 'exemplo-oferta')]
      ),
      question(
        'eval.sfn.a06', 'mercado-capitais',
        'Carla vende a Bruno ações que já possuía. Qual afirmação é a mais adequada?',
        [
          'A venda necessariamente representa nova captação de recursos pela companhia emissora.',
          'É uma negociação de instrumento existente; o pagamento vai ao vendedor, não é automaticamente nova captação da companhia.',
          'A operação transforma a CVM em parte compradora.',
          'A existência de ações faz a companhia ser supervisionada exclusivamente pelo Banco Central.'
        ],
        1,
        'A negociação de ações já existentes entre investidores não é, por si, nova emissão da companhia. O exemplo ensina a separar emissão e negociação posterior.',
        [ref('banking.sfn.cvm', 'mercado'), ref('banking.sfn.cvm', 'exemplo-oferta')]
      ),
      question(
        'eval.sfn.a07', 'operadores',
        'Uma instituição possui duas carteiras, mas nenhuma delas é comercial nem de investimento. Considerando apenas a classificação básica ensinada para banco múltiplo, qual conclusão cabe?',
        [
          'Atende ao requisito porque duas carteiras sempre bastam.',
          'Não atende ao requisito apresentado, pois além da quantidade uma das carteiras deve ser comercial ou de investimento.',
          'Atende se possuir pelo menos duas agências.',
          'Não atende porque banco múltiplo precisa exatamente de três carteiras.'
        ],
        1,
        'A classificação ensinada combina duas condições: pelo menos duas carteiras e presença de carteira comercial ou de investimento. Quantidade de agências não substitui carteira.',
        [ref('banking.sfn.operadores', 'multiplo'), ref('banking.sfn.operadores', 'exemplo-carteiras')]
      ),
      question(
        'eval.sfn.a08', 'operadores',
        'Um aplicativo reúne uma conta de pagamento e uma oferta de empréstimo. Só pela tela, qual conclusão NÃO é segura?',
        [
          'Pode ser necessário identificar qual pessoa jurídica presta cada serviço.',
          'Instituição de pagamento não se torna banco apenas por sua condição de prestadora de pagamento.',
          'A mesma empresa que mantém a conta de pagamento necessariamente concede o empréstimo.',
          'Serviços diferentes podem aparecer na mesma interface.'
        ],
        2,
        'A aparência do aplicativo não prova que a mesma pessoa jurídica preste todos os serviços. É preciso identificar prestadores e atividades.',
        [ref('banking.sfn.pagamentos-consorcios', 'instituicao'), ref('banking.sfn.operadores', 'outros')]
      ),
      question(
        'eval.sfn.a09', 'seguros-previdencia',
        'Uma empresa oferece aos empregados acesso a um plano de previdência. Apenas essa informação basta para classificá-lo como previdência complementar fechada?',
        [
          'Sim, toda oferta ligada ao emprego é fechada.',
          'Não; é preciso identificar a entidade e o enquadramento do plano, pois também existem planos abertos coletivos.',
          'Sim, desde que o plano seja supervisionado pela SUSEP.',
          'Não, porque previdência fechada nunca possui patrocinador.'
        ],
        1,
        'O canal de oferta não basta. Previdência aberta pode ser coletiva; a modalidade fechada depende do enquadramento e do vínculo previsto com entidade fechada.',
        [ref('banking.sfn.seguros-previdencia', 'previdencia-aberta'), ref('banking.sfn.seguros-previdencia', 'previdencia-fechada')]
      ),
      question(
        'eval.sfn.a10', 'seguros-previdencia',
        'Um título de capitalização é vendido em uma agência bancária. Qual conclusão preserva a distinção ensinada?',
        [
          'O canal bancário transforma o título em depósito de poupança.',
          'O produto continua sendo capitalização; o canal de venda não altera automaticamente sua natureza nem o supervisor do segmento.',
          'A agência passa a ser a SUSEP nessa operação.',
          'Todo valor pago deve estar disponível para resgate integral imediato.'
        ],
        1,
        'Capitalização tem regras próprias e não se transforma em poupança por ser oferecida em banco. O mercado de capitalização está no campo de supervisão da SUSEP.',
        [ref('banking.sfn.seguros-previdencia', 'capitalizacao'), ref('banking.sfn.seguros-previdencia', 'resumo')]
      ),
      question(
        'eval.sfn.a11', 'pagamentos-consorcios',
        'Em um pagamento instantâneo entre instituições, qual separação conceitual está correta no recorte ensinado?',
        [
          'Pix é a instituição; SPI é o cliente; o banco é o arranjo.',
          'Pix é o arranjo; a instituição presta o serviço ao cliente; o SPI é infraestrutura de liquidação.',
          'SPI é o arranjo comercial e Pix é exclusivamente a conta bancária.',
          'Pix, SPI e instituição de pagamento são três nomes para a mesma entidade.'
        ],
        1,
        'O ensino separa arranjo, prestador e infraestrutura: Pix é o arranjo e o SPI é a infraestrutura central de liquidação citada.',
        [ref('banking.sfn.pagamentos-consorcios', 'spi'), ref('banking.sfn.pagamentos-consorcios', 'exemplo-pix')]
      ),
      question(
        'eval.sfn.a12', 'pagamentos-consorcios',
        'Num consórcio, participantes contribuem para um grupo administrado por empresa autorizada. Qual afirmação combina corretamente autofinanciamento, administradora e supervisão?',
        [
          'O Banco Central financia automaticamente cada participante e garante contemplação imediata.',
          'A administradora organiza o grupo; os recursos decorrem do autofinanciamento dos participantes; supervisão não é promessa de contemplação imediata.',
          'Autofinanciamento significa que não pode existir taxa de administração.',
          'A administradora é apenas um nome diferente para o SPI.'
        ],
        1,
        'Consórcio é autofinanciamento em grupo; a administradora presta o serviço de gestão e pode receber remuneração prevista. Supervisão não garante contemplação imediata.',
        [ref('banking.sfn.pagamentos-consorcios', 'consorcio'), ref('banking.sfn.pagamentos-consorcios', 'exemplo-consorcio')]
      )
    ]),
    form('B', [
      question(
        'eval.sfn.b01', 'estrutura',
        'Considere três ações: (1) estabelecer diretrizes gerais de moeda e crédito; (2) supervisionar instituições e executar políticas em sua competência; (3) receber depósitos e oferecer serviços a clientes. Qual sequência associa melhor CMN, Banco Central e banco comercial?',
        [
          'CMN–1; Banco Central–2; banco comercial–3.',
          'CMN–3; Banco Central–1; banco comercial–2.',
          'CMN–2; Banco Central–3; banco comercial–1.',
          'Os três podem ser tratados como a mesma função.'
        ],
        0,
        'O bloco inteiro se apoia nessa separação: CMN formula diretrizes, Banco Central supervisiona/executa em suas competências e bancos operam serviços.',
        [ref('banking.sfn.introducao', 'regras'), ref('banking.sfn.cmn', 'diferencas'), ref('banking.sfn.bacen', 'politicas')]
      ),
      question(
        'eval.sfn.b02', 'politica-monetaria',
        'A expressão “banco dos bancos” foi usada para explicar uma função do Banco Central. Qual interpretação evita a pegadinha?',
        [
          'Todas as agências bancárias são filiais do Banco Central.',
          'O Banco Central presta conta corrente comum a qualquer consumidor.',
          'Instituições financeiras mantêm relações e estruturas de liquidação com o Banco Central; isso não o transforma em banco comercial de varejo.',
          'A expressão significa que o Banco Central vende os mesmos produtos dos demais bancos.'
        ],
        2,
        '“Banco dos bancos” se relaciona às funções do Banco Central no sistema e às relações com instituições, não a atendimento bancário comum ao público.',
        [ref('banking.sfn.bacen', 'banco-dos-bancos'), ref('banking.sfn.bacen', 'natureza')]
      ),
      question(
        'eval.sfn.b03', 'politica-monetaria',
        'Uma alternativa afirma: “o Copom é formado pelos ministros que compõem o CMN e decide individualmente a concessão de crédito pelos bancos”. Qual é o principal problema?',
        [
          'Nenhum; essa é a função central do Copom.',
          'O Copom funciona no Banco Central e decide a meta Selic; não é o colegiado que aprova contratos individuais de crédito.',
          'O Copom é uma corretora de valores.',
          'O Copom supervisiona exclusivamente entidades fechadas de previdência.'
        ],
        1,
        'O Copom integra o Banco Central e sua decisão central estudada é a meta para a Selic. Contratos individuais de crédito não são aprovados pelo comitê.',
        [ref('banking.sfn.copom', 'nome'), ref('banking.sfn.copom', 'meta')]
      ),
      question(
        'eval.sfn.b04', 'mercado-capitais',
        'Uma companhia aberta, uma corretora, um investidor e a CVM aparecem no mesmo enunciado. Qual papel pertence à CVM?',
        [
          'Emitir ações da companhia em nome próprio.',
          'Investir o dinheiro do cliente para garantir rentabilidade.',
          'Regular e fiscalizar o mercado de valores mobiliários em seu campo de competência.',
          'Receber depósitos à vista como atividade típica.'
        ],
        2,
        'Regulador, emissor, intermediário e investidor são papéis distintos. A CVM atua na regulação e fiscalização do mercado de valores mobiliários.',
        [ref('banking.sfn.cvm', 'participantes'), ref('banking.sfn.cvm', 'mercado')]
      ),
      question(
        'eval.sfn.b05', 'operadores',
        'Qual exemplo atende às duas condições básicas ensinadas para a classificação de banco múltiplo?',
        [
          'Uma carteira comercial apenas.',
          'Duas carteiras, sendo uma comercial.',
          'Cinco agências e uma única carteira.',
          'Duas carteiras, nenhuma comercial nem de investimento.'
        ],
        1,
        'São exigidas pelo menos duas carteiras e uma delas deve ser comercial ou de investimento. Agências não são carteiras.',
        [ref('banking.sfn.operadores', 'carteira'), ref('banking.sfn.operadores', 'multiplo')]
      ),
      question(
        'eval.sfn.b06', 'operadores',
        'Duas organizações são supervisionadas pelo Banco Central. O que essa informação, sozinha, permite concluir?',
        [
          'Que possuem necessariamente a mesma natureza jurídica.',
          'Que oferecem obrigatoriamente os mesmos serviços.',
          'Que ambas estão sujeitas à supervisão do Banco Central em seus respectivos enquadramentos, sem torná-las idênticas.',
          'Que ambas são órgãos normativos.'
        ],
        2,
        'Compartilhar supervisor não transforma participantes diferentes na mesma espécie de instituição nem iguala suas atividades.',
        [ref('banking.sfn.operadores', 'outros'), ref('banking.sfn.operadores', 'resumo')]
      ),
      question(
        'eval.sfn.b07', 'seguros-previdencia',
        'Qual associação distingue corretamente previdência complementar aberta e fechada?',
        [
          'Aberta–PREVIC; fechada–SUSEP.',
          'Aberta–SUSEP; entidade fechada–PREVIC.',
          'Aberta–CVM; fechada–Copom.',
          'Ambas são necessariamente supervisionadas pelo Banco Central.'
        ],
        1,
        'Previdência complementar aberta está no campo da SUSEP; entidades fechadas de previdência complementar são supervisionadas pela PREVIC.',
        [ref('banking.sfn.seguros-previdencia', 'previdencia-aberta'), ref('banking.sfn.seguros-previdencia', 'previdencia-fechada')]
      ),
      question(
        'eval.sfn.b08', 'seguros-previdencia',
        'No segmento de seguros privados, qual comparação está correta entre CNSP e SUSEP no recorte ensinado?',
        [
          'CNSP atua na função normativa; SUSEP exerce supervisão dos mercados de sua competência.',
          'SUSEP formula sozinha todas as diretrizes do CNSP e o CNSP vende seguros.',
          'CNSP e SUSEP são nomes diferentes para a mesma autarquia.',
          'SUSEP supervisiona apenas previdência fechada.'
        ],
        0,
        'O CNSP exerce função normativa no segmento; a SUSEP supervisiona seguros, previdência aberta, capitalização e resseguro.',
        [ref('banking.sfn.seguros-previdencia', 'susep'), ref('banking.sfn.seguros-previdencia', 'resumo')]
      ),
      question(
        'eval.sfn.b09', 'seguros-previdencia',
        'Por que capitalização não deve ser tratada automaticamente como poupança?',
        [
          'Porque qualquer produto vendido em banco deixa de ser financeiro.',
          'Porque capitalização possui condições próprias de formação de capital, sorteio e resgate; canal de venda não muda sua natureza.',
          'Porque títulos de capitalização não podem ter resgate.',
          'Porque somente a PREVIC pode supervisionar capitalização.'
        ],
        1,
        'Capitalização é produto distinto de depósito de poupança e possui regras próprias. O canal onde é vendido não altera essa natureza.',
        [ref('banking.sfn.seguros-previdencia', 'capitalizacao')]
      ),
      question(
        'eval.sfn.b10', 'pagamentos-consorcios',
        'No contexto do SPI, o que significa liquidação?',
        [
          'Apenas a animação de “pagamento enviado” mostrada pelo aplicativo.',
          'A efetivação do cumprimento da obrigação financeira na infraestrutura descrita.',
          'A abertura de uma conta de pagamento.',
          'A concessão automática de crédito pelo Banco Central.'
        ],
        1,
        'Liquidação é a efetivação da obrigação financeira, e não apenas uma mensagem visual do aplicativo.',
        [ref('banking.sfn.pagamentos-consorcios', 'spi')]
      ),
      question(
        'eval.sfn.b11', 'pagamentos-consorcios',
        'Qual conclusão é compatível com a ideia de autofinanciamento em consórcio?',
        [
          'Os participantes contribuem para o grupo; isso não significa ausência de custos nem financiamento automático pelo Banco Central.',
          'A administradora deve financiar todos os participantes com recursos próprios.',
          'Autofinanciamento garante contemplação no momento da adesão.',
          'Não pode existir remuneração da administradora.'
        ],
        0,
        'Os próprios participantes formam os recursos do grupo. A administradora presta serviço e pode receber valores previstos; contemplação segue as regras do grupo.',
        [ref('banking.sfn.pagamentos-consorcios', 'consorcio'), ref('banking.sfn.pagamentos-consorcios', 'exemplo-consorcio')]
      ),
      question(
        'eval.sfn.b12', 'mercado-capitais',
        'Três situações aparecem juntas: oferta pública de valores mobiliários, plano de previdência aberta e entidade fechada de previdência complementar. Qual sequência de supervisores é a mais adequada?',
        [
          'Banco Central, PREVIC, SUSEP.',
          'CVM, SUSEP, PREVIC.',
          'CVM, Banco Central, Copom.',
          'SUSEP, CVM, Banco Central.'
        ],
        1,
        'Valores mobiliários apontam para CVM; previdência aberta para SUSEP; entidades fechadas para PREVIC. O assunto “dinheiro” não apaga os campos de atuação.',
        [ref('banking.sfn.cvm', 'mercado'), ref('banking.sfn.seguros-previdencia', 'previdencia-aberta'), ref('banking.sfn.seguros-previdencia', 'previdencia-fechada')]
      )
    ])
  ])
});

export function assessmentById(id) {
  return String(id || '') === SFN_TRANSFER_ASSESSMENT.id ? SFN_TRANSFER_ASSESSMENT : null;
}

export function assessmentQuestionById(id) {
  for (const assessmentForm of SFN_TRANSFER_ASSESSMENT.forms) {
    const found = assessmentForm.questions.find((item) => item.id === String(id || ''));
    if (found) return { assessment: SFN_TRANSFER_ASSESSMENT, form: assessmentForm, question: found };
  }
  return null;
}

export function validateSfnTransferAssessment(missions = []) {
  const errors = [];
  const missionMap = new Map(missions.map((mission) => [mission.id, mission]));
  const regularIds = new Set(missions.flatMap((mission) => (mission.questions || []).map((q) => q.id)));
  const ids = new Set();
  const prompts = new Set();
  const requiredCompetencies = new Set([
    'estrutura', 'politica-monetaria', 'mercado-capitais',
    'operadores', 'seguros-previdencia', 'pagamentos-consorcios'
  ]);

  if (SFN_TRANSFER_ASSESSMENT.forms.length !== 2) errors.push('assessment:expected-two-forms');
  for (const assessmentForm of SFN_TRANSFER_ASSESSMENT.forms) {
    if (assessmentForm.questions.length !== SFN_TRANSFER_ASSESSMENT.questionCount) {
      errors.push(`${assessmentForm.id}:wrong-question-count`);
    }
    const competencies = new Set();
    for (const item of assessmentForm.questions) {
      if (ids.has(item.id)) errors.push(`${item.id}:duplicate-id`);
      ids.add(item.id);
      if (regularIds.has(item.id)) errors.push(`${item.id}:collides-with-practice`);
      const normalizedPrompt = item.prompt.trim().toLowerCase();
      if (prompts.has(normalizedPrompt)) errors.push(`${item.id}:duplicate-prompt`);
      prompts.add(normalizedPrompt);
      competencies.add(item.competency);
      if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) {
        errors.push(`${item.id}:invalid-answer`);
      }
      if (item.options.length !== 4 || new Set(item.options).size !== item.options.length) {
        errors.push(`${item.id}:invalid-options`);
      }
      if (!item.explanation?.trim()) errors.push(`${item.id}:missing-explanation`);
      if (!item.teachingRefs.length) errors.push(`${item.id}:missing-teaching-ref`);
      for (const teachingRef of item.teachingRefs) {
        const mission = missionMap.get(teachingRef.missionId);
        if (!mission) {
          errors.push(`${item.id}:unknown-mission:${teachingRef.missionId}`);
          continue;
        }
        if (mission.kind === 'boss') errors.push(`${item.id}:boss-is-not-teaching:${teachingRef.missionId}`);
        if (!mission.sections?.some((section) => section.id === teachingRef.sectionId && section.body?.trim())) {
          errors.push(`${item.id}:unknown-section:${teachingRef.missionId}:${teachingRef.sectionId}`);
        }
      }
    }
    for (const competency of requiredCompetencies) {
      if (!competencies.has(competency)) errors.push(`${assessmentForm.id}:missing-competency:${competency}`);
    }
  }
  return errors;
}
