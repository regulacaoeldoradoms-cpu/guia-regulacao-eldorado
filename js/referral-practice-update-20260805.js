'use strict';

(() => {
  const guidance = window.REFERRAL_PRACTICE_GUIDANCE;
  if (!guidance || guidance.__studyUpdate20260805Batch5) return;

  const asArray = (value) => Array.isArray(value) ? value : (value ? [value] : []);
  const appendUnique = (target, values) => {
    const destination = Array.isArray(target) ? target : [];
    const existing = new Set(destination.map((item) => String(item).trim()));
    asArray(values).forEach((item) => {
      const text = String(item || '').trim();
      if (text && !existing.has(text)) {
        destination.push(text);
        existing.add(text);
      }
    });
    return destination;
  };

  const profileById = (id) => guidance.profiles.find((profile) => profile.id === id);
  const ensureProfile = (id, label, matchAny) => {
    let profile = profileById(id);
    if (!profile) {
      profile = { id, label, matchAny: asArray(matchAny) };
      guidance.profiles.push(profile);
    } else {
      profile.matchAny = appendUnique(profile.matchAny, matchAny);
    }
    return profile;
  };
  const extendProfile = (id, label, matchAny, additions) => {
    const profile = ensureProfile(id, label, matchAny);
    Object.entries(additions).forEach(([field, values]) => {
      profile[field] = appendUnique(profile[field], values);
    });
  };

  guidance.version = '1.5';
  guidance.updatedAt = '05/08/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de um quinto complemento analisado em 05/08/2026. O novo lote reúne 4 documentos, todos com justificativa regulatória explícita e utilizável.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa: estudo operacional anonimizado de devoluções reais - lotes 1 a 10 e cinco complementos analisados entre 04/08/2026 e 05/08/2026, abrangendo casos de 2022 a 2026.';
  guidance.methodology.studyHistory = appendUnique(guidance.methodology.studyHistory, [
    'Complemento 5 - 4 documentos analisados em 05/08/2026, todos com justificativa regulatória explícita.'
  ]);
  guidance.methodology.responsePolicy = appendUnique(guidance.methodology.responsePolicy, [
    'Antes de orientar mudança de especialidade, identificar o sistema, a central reguladora e o protocolo aplicável. Uma rota observada no SISREG não deve ser transferida automaticamente para o DigSaúde, CORE ou outro fluxo.',
    'Quando protocolos ou devoluções de sistemas diferentes apontarem destinos distintos para o mesmo quadro, apresentar a divergência e vincular cada orientação ao respectivo sistema, sem escolher uma regra universal.',
    'Analisar o histórico em ordem cronológica. Uma pendência corrigida e aceita deixa de ser o motivo atual quando surge nova devolução posterior por tempo decorrido ou mudança clínica.',
    'Um encaminhamento detalhado pode ser devolvido por inadequação do destino, profissional solicitante não aceito ou falta de dado formal; não presumir que toda devolução indica história clínica insuficiente.',
    'A habilitação do profissional solicitante é específica do procedimento e do sistema. Não generalizar que uma categoria profissional é aceita ou recusada em todos os acessos.',
    'Em solicitações antigas de exames musculoesqueléticos, atualizar necessidade e quadro atual sem exigir repetição automática de exames já registrados, salvo previsão protocolar ou nova solicitação expressa do regulador.',
    'Quando a devolução determinar reinserção em outro procedimento, preservar o texto da decisão, mas alertar para a verificação de perda de data, posição ou classificação antes do cancelamento da solicitação original.'
  ]);

  guidance.universal.returns = appendUnique(guidance.universal.returns, [
    'Solicitação com descrição clínica extensa, porém devolvida porque o procedimento escolhido não corresponde ao fluxo regulatório daquela central.',
    'Solicitação inserida por profissional não aceito para aquele procedimento, exigindo avaliação e identificação de profissional habilitado.',
    'Primeira devolução corrigida e aceita, seguida meses depois por nova devolução exclusivamente para atualização do quadro e confirmação da necessidade.',
    'Exame musculoesquelético previamente classificado que permaneceu em fila e foi devolvido após longo período, sem que isso signifique erro na análise inicial.'
  ]);
  guidance.universal.history = appendUnique(guidance.universal.history, [
    'Para cada devolução, identificar qual é a justificativa mais recente e quais pendências anteriores já foram efetivamente resolvidas.',
    'Em atualização por tempo decorrido, registrar mudanças desde a última análise, sintomas atuais, limitações, tratamentos, novos exames e necessidade presente.'
  ]);
  guidance.universal.caseDependent = appendUnique(guidance.universal.caseDependent, [
    'A mesma condição pode ter elegibilidade diferente conforme SISREG, DigSaúde, CORE, faixa etária, central reguladora e modalidade de atendimento.',
    'Relatórios de Fonoaudiologia, Psicologia, escola e equipe multiprofissional podem qualificar o caso, mas não substituem o profissional solicitante exigido pelo procedimento quando o sistema restringe essa função.',
    'Exames citados em uma devolução vinculada à mudança de especialidade não se tornam automaticamente obrigatórios em todos os protocolos da área.'
  ]);

  extendProfile('batch5-neuropediatria-fluxos', 'Neurologia Pediátrica, Psiquiatria Pediátrica e linguagem', [
    'neurologia pediatrica',
    'neuropediatria',
    'psiquiatria pediatrica',
    'tea',
    'tdah',
    'tod',
    'gagueira',
    'tartamudez',
    'atraso de linguagem'
  ], {
    returns: [
      'Queixa de fala ou linguagem encaminhada com objetivo genérico de verificar normalidade cerebral, sem relato clínico objetivo, evolução, tratamentos, medicamentos e condições associadas.',
      'Consulta de Neurologia Pediátrica inserida a partir de avaliação de profissional não aceito pelo procedimento, sem nome e registro do médico solicitante exigido na devolução.',
      'Criança com diagnóstico de TEA ou TDAH, acompanhamento multiprofissional e descrição funcional detalhada, mas devolvida pelo SISREG para avaliação inicial em Psiquiatria Pediátrica por predomínio comportamental e ausência de suspeita orgânica descrita.',
      'Seguimento antigo com Neurologia Pediátrica usado como justificativa para retorno à mesma especialidade, embora a central tenha aplicado fluxo atual diferente para a demanda comportamental.'
    ],
    history: [
      'Em alterações de fala, descrever início, padrão, frequência, situações de piora, impacto escolar e social, desenvolvimento da linguagem, audição, regressão, crises, déficits motores e sinais neurológicos associados.',
      'Em TEA, TDAH ou TOD, diferenciar a demanda atual: ajuste medicamentoso, agressividade, prejuízo funcional, regressão, convulsão, déficit focal, alteração do desenvolvimento ou suspeita de lesão orgânica.',
      'Registrar acompanhamentos prévios, última avaliação especializada, terapias atuais e evolução desde o último atendimento.'
    ],
    treatment: [
      'Informar medicamentos com concentração, dose, horário, resposta e efeitos adversos, incluindo tentativas de ajuste e motivo de retorno à dose anterior.',
      'Descrever terapias multiprofissionais em curso e ganhos ou limitações observados, sem substituir a avaliação médica necessária.'
    ],
    investigations: [
      'Relatórios escolar, psicológico, fonoaudiológico e neuropsicopedagógico podem apoiar a análise quando pertinentes.',
      'Função renal, hepática e tireoidiana foram exigidas em uma devolução vinculada à reinserção em Psiquiatria Pediátrica; conferir protocolo e fluxo antes de tratá-las como universais.'
    ],
    patientReportable: [
      'Responsável pode relatar evolução, comportamento, impacto escolar, terapias, medicamentos, resposta e efeitos colaterais.',
      'A ocorrência de episódios de agressividade, contexto e frequência pode ser informada pelo responsável, deixando claro que se trata de relato.'
    ],
    professionalOnly: [
      'Exame neurológico, hipótese de lesão orgânica, decisão entre Neurologia e Psiquiatria, ajuste de medicação e avaliação de risco exigem profissional habilitado.',
      'A indicação formal e a identificação do profissional solicitante devem obedecer ao procedimento e ao sistema correspondente.'
    ],
    safety: [
      'Heteroagressividade com risco atual para colegas, familiares ou equipe exige avaliação imediata pela rede de saúde responsável, não apenas reinserção administrativa.',
      'Regressão de habilidades, convulsão, déficit focal, alteração importante de consciência ou piora neurológica devem ser destacados para avaliação profissional.'
    ],
    caseDependent: [
      'No SISREG analisado, quadros predominantemente comportamentais foram direcionados primeiro à Psiquiatria Pediátrica, salvo suspeita de lesão orgânica.',
      'O protocolo de Teleatendimento/DigSaúde cadastrado contempla condições de TEA, TDAH/TOD e transtornos de aprendizagem em Neurologia Pediátrica; portanto, não aplicar automaticamente ao DigSaúde o redirecionamento observado no SISREG.',
      'A recusa de solicitação originada por Fonoaudiologia foi específica da consulta de Neurologia Pediátrica analisada; outros procedimentos, como reabilitação auditiva, podem aceitar fonoaudiólogo conforme protocolo próprio.'
    ]
  });

  extendProfile('batch5-rm-coluna-lombossacra', 'Ressonância de coluna lombossacra e lombociatalgia', [
    'ressonancia coluna lombar',
    'ressonancia lombo sacra',
    'rm coluna lombossacra',
    'lombalgia',
    'lombociatalgia'
  ], {
    returns: [
      'Pedido de ressonância com apenas lombalgia ou lombociatalgia, sem história completa, exame físico e investigação inicial.',
      'Pendência inicial complementada com radiografia e posteriormente aceita, mas devolvida novamente após longo tempo somente para atualização clínica e confirmação da necessidade atual.',
      'Histórico contendo devoluções diferentes que não devem ser somadas como se todas permanecessem abertas.'
    ],
    history: [
      'Descrever início, evolução, intensidade e característica da dor, irradiação, parestesia, fraqueza, limitação, fatores de piora e alívio, trauma e tratamentos realizados.',
      'Na atualização por tempo, registrar o que mudou desde a classificação anterior e se a ressonância ainda modificará a conduta.'
    ],
    examination: [
      'Exame físico e neurológico atual, incluindo força, sensibilidade, reflexos, marcha e sinais radiculares quando pertinentes, devem ser realizados por profissional habilitado.'
    ],
    investigations: [
      'Informar investigação inicial já realizada com data e conclusão, sem pedir novamente o que já consta no histórico salvo necessidade clínica ou protocolar.',
      'Resultado de radiografia pode complementar a investigação, mas não substitui história clínica, exame físico e justificativa específica da ressonância.'
    ],
    professionalOnly: [
      'Interpretação de exame, presença de déficit sensitivo-motor, sinais de alarme e indicação de ressonância exigem avaliação profissional.'
    ],
    caseDependent: [
      'Quando a devolução atual pedir apenas atualização e confirmação da necessidade, não reapresentar automaticamente a primeira pendência como ainda não resolvida.'
    ]
  });

  extendProfile('batch4-ultrassom-articular-antigo', 'Ultrassonografia musculoesquelética', [
    'ultra-sonografia ombro',
    'ultrassonografia ombro',
    'usg ombro'
  ], {
    returns: [
      'Ultrassonografia de ombro inicialmente classificada e devolvida cerca de um ano depois apenas porque o quadro e a necessidade não estavam atualizados.'
    ],
    history: [
      'Em atualização de ombro, informar lado, localização e intensidade da dor, amplitude, movimentos limitados, impacto nas atividades, trauma, piora ou melhora e evolução desde o pedido.'
    ],
    treatment: [
      'Registrar analgesia, anti-inflamatórios, fisioterapia, exercícios, infiltração ou outros tratamentos, duração e resposta quando realizados.'
    ],
    investigations: [
      'Confirmar se a ultrassonografia foi realizada por outro meio e qual decisão clínica ainda depende do exame.'
    ],
    caseDependent: [
      'A devolução por tempo decorrido não invalida a classificação anterior; cria uma nova pendência de atualização clínica.'
    ]
  });

  Object.defineProperty(guidance, '__studyUpdate20260805Batch5', {
    value: true,
    enumerable: false
  });
})();
