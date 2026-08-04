'use strict';

(() => {
  const guidance = window.REFERRAL_PRACTICE_GUIDANCE;
  if (!guidance || guidance.__studyUpdate20260804) return;

  const array = (value) => Array.isArray(value) ? value : (value ? [value] : []);
  const appendUnique = (target, values) => {
    const destination = Array.isArray(target) ? target : [];
    const existing = new Set(destination.map((item) => String(item).trim()));
    array(values).forEach((item) => {
      const text = String(item || '').trim();
      if (text && !existing.has(text)) {
        destination.push(text);
        existing.add(text);
      }
    });
    return destination;
  };

  const profileById = (id) => guidance.profiles.find((profile) => profile.id === id);
  const extendProfile = (id, additions) => {
    const profile = profileById(id);
    if (!profile) return;
    Object.entries(additions).forEach(([field, values]) => {
      profile[field] = appendUnique(profile[field], values);
    });
  };

  guidance.version = '1.1';
  guidance.updatedAt = '04/08/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de 13 documentos analisados em 04/08/2026, sem dados identificáveis de pacientes ou profissionais.';
  guidance.methodology.limitation = 'A experiência prática deve ser apresentada como padrão observado, não como requisito universal. Quando protocolo e devolução abordarem pontos diferentes, responda em blocos separados: “Protocolo oficial” e “Prática regulatória observada”. Não transforme exame ou fluxo solicitado em caso isolado em obrigação geral. Se a justificativa da devolução parecer incompatível com a indicação original, sinalize possível divergência de registro e recomende conferência humana.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa: estudo operacional anonimizado de devoluções reais — lotes 1 a 10 e complemento de 13 documentos analisados em 04/08/2026, abrangendo casos de 2023 a 2026.';
  guidance.methodology.lastStudy = {
    date: '04/08/2026',
    documents: 13,
    specialties: ['Neuropediatria', 'Psiquiatria', 'Cirurgia Vascular', 'Oftalmologia', 'Endocrinologia', 'Cardiologia', 'Urologia', 'Ortopedia e exames de imagem'],
    privacy: 'Conteúdo incorporado somente de forma agregada e anonimizada.'
  };

  guidance.universal.returns = appendUnique(guidance.universal.returns, [
    'Resultado descrito apenas como “alterado”, “aumentado” ou “com complicação”, sem valor, data, conclusão ou repercussão clínica.',
    'Solicitação antiga, anteriormente aceita, devolvida para reavaliação porque o quadro atual e a necessidade podem ter mudado durante a espera.',
    'Procedimento solicitado sem explicar qual decisão clínica depende do resultado ou por que a investigação inicial não foi suficiente.',
    'Indicação clínica e justificativa da devolução aparentemente desalinhadas, exigindo conferência antes de aplicar uma exigência padronizada ao caso.'
  ]);
  guidance.universal.history = appendUnique(guidance.universal.history, [
    'Ao qualificar uma solicitação antiga, descreva o quadro atual e informe se a necessidade especializada permanece.',
    'Evite qualificadores vagos: transforme “piora”, “alterado” ou “complicação” em descrição objetiva, com cronologia e repercussão.'
  ]);
  guidance.universal.investigations = appendUnique(guidance.universal.investigations, [
    'Quando um exame motivar a solicitação, informe o valor ou a conclusão efetiva, a data e o laudo; não use apenas “exame alterado”.',
    'Para exame avançado após trauma, registre mecanismo, região examinada, achados físicos, exames prévios e a pergunta clínica que o exame deve responder.'
  ]);
  guidance.universal.caseDependent = appendUnique(guidance.universal.caseDependent, [
    'Ao explicar por que uma solicitação foi devolvida, diferencie cinco eixos: destino correto, suficiência para classificar risco, abordagem prévia na APS, segurança para fila eletiva e atualização após tempo de espera.',
    'Devolução por oferta, demanda ou tempo de fila não significa necessariamente que o encaminhamento original era clinicamente inadequado.',
    'Se o texto da devolução parecer um modelo padronizado incompatível com a indicação original, não o generalize; sinalize a divergência e peça revisão humana.'
  ]);

  extendProfile('neuropediatria', {
    returns: [
      'Dificuldade predominantemente escolar, de atenção ou comportamento encaminhada diretamente à Neurologia Pediátrica sem sinais descritos de lesão orgânica, regressão, crise, déficit focal ou alteração neurológica.',
      'Fluxo de primeira avaliação não esclarecido entre Psiquiatria Pediátrica e Neuropediatria.',
      'Cadastro do usuário divergente do município de residência atual, exigindo correção administrativa separada da complementação clínica.'
    ],
    history: [
      'Em dificuldade de aprendizagem, informe se o desenvolvimento das demais áreas está preservado, se houve regressão e se existem sintomas neurológicos associados.',
      'Descreva de forma objetiva o prejuízo escolar, séries cursadas, reprovações, alfabetização, atenção, organização e participação, preferencialmente apoiado por relatório escolar.'
    ],
    investigations: [
      'Em devoluções que redirecionaram o caso para Psiquiatria Pediátrica, foram solicitadas função renal, função hepática e função tireoidiana; trate essa cobrança como prática observada e confira o protocolo vigente antes de chamá-la de obrigatória.'
    ],
    caseDependent: [
      'Nos casos analisados em 03/08/2026, distúrbios de aprendizagem ou comportamento foram direcionados inicialmente à Psiquiatria Pediátrica, salvo suspeita de associação a lesão orgânica.',
      'Sinais como regressão, convulsões, déficit focal, alteração do exame neurológico ou outra suspeita orgânica podem modificar o destino e exigem avaliação profissional.'
    ]
  });

  extendProfile('psiquiatria', {
    returns: [
      'CID ou relato sugerindo psicose ou ideação suicida sem esclarecer se os sintomas são atuais, se existe ameaça à vida e se o paciente está estável para aguardar atendimento eletivo.',
      'Descrição de piora emocional sem avaliação profissional de risco e sem tratamento atual com dose e posologia.'
    ],
    history: [
      'Diferencie ideação passada de ideação atual e registre mudança recente do quadro, suporte sociofamiliar e prejuízo funcional, sem substituir a avaliação formal de risco.'
    ],
    safety: [
      'Sintomas psicóticos atuais, ameaça à própria vida, risco agudo de auto ou heteroagressão, agitação ou agressividade exigem avaliação em urgência ou emergência, não simples complementação para fila eletiva.',
      'Somente se houver estabilidade clínica documentada o encaminhamento ambulatorial deve ser qualificado com quadro atual, evolução e tratamento completo.'
    ],
    professionalOnly: [
      'Definição de presença de sintomas psicóticos, ameaça à vida, risco suicida atual e estabilidade para atendimento ambulatorial.'
    ]
  });

  extendProfile('cirurgia-vascular', {
    returns: [
      'Solicitação antiga de varizes devolvida para reavaliação atual, com cobrança recorrente de edema e classificação clínica CEAP.',
      'Laudo vascular ou diagnóstico anatômico sem descrição clínica atual de edema, pele, úlcera, dor, limitação e estágio da doença.',
      'Cobrança de CEAP aplicada a indicação originalmente diferente de doença venosa, situação que pode representar justificativa padronizada desalinhada do caso.'
    ],
    examination: [
      'Em doença venosa crônica, registre presença e distribuição de edema, alterações cutâneas, úlcera e classificação CEAP quando realizada por profissional habilitado.'
    ],
    caseDependent: [
      'A classificação CEAP foi cobrada repetidamente em reavaliações de varizes após longo tempo de espera; isso não deve ser transferido automaticamente para toda indicação vascular.',
      'Quando a indicação original for amputação, sequela arterial, oclusão ou outra condição não venosa, confira se a devolução realmente corresponde ao procedimento solicitado antes de orientar.'
    ]
  });

  extendProfile('oftalmologia', {
    returns: [
      'Pós-operatório de catarata encaminhado como Oftalmologia Geral sem data, local da cirurgia e definição entre revisão cirúrgica e nova avaliação clínica.',
      'Hipertensão ou diabetes apresentados isoladamente como justificativa, sem queixa ocular, déficit visual, duração das comorbidades e avaliação visual básica.'
    ],
    history: [
      'Informe queixa ocular atual, olho acometido, início, evolução, déficit visual percebido, dor, vermelhidão e outras patologias oculares associadas.',
      'Em paciente com diabetes ou hipertensão, informe duração, tratamento e motivo ocular específico do encaminhamento.'
    ],
    treatment: [
      'Registre medicamentos oculares, lentes corretivas, tratamentos e cirurgias anteriores.'
    ],
    investigations: [
      'Registre acuidade visual ou teste de Snellen quando possível e disponível na unidade.',
      'Após cirurgia ocular, informe data e estabelecimento executante; revisão pós-operatória costuma pertencer ao serviço que realizou o procedimento.'
    ],
    caseDependent: [
      'Diferencie revisão pós-operatória, consulta oftalmológica geral e avaliação para nova cirurgia, pois os fluxos não são equivalentes.'
    ]
  });

  extendProfile('endocrinologia', {
    returns: [
      'Hipotireoidismo ou outra doença tireoidiana complexa descrita sem resultados atuais de TSH e T4 livre, datas e exames de imagem solicitados pelo regulador.'
    ],
    investigations: [
      'Informe valores e datas de TSH e T4 livre, e transcreva a conclusão da ultrassonografia quando ela existir ou tiver sido especificamente solicitada.',
      'Ultrassonografia de tireoide foi cobrada em um caso complexo analisado; não a apresente como obrigatória para todo hipotireoidismo sem confirmação no protocolo.'
    ],
    caseDependent: [
      'Doença sistêmica complexa e acompanhamento em outro serviço não dispensam a apresentação dos resultados endócrinos atuais necessários à análise.'
    ]
  });

  extendProfile('cardiologia', {
    returns: [
      'Mesmo com sintomas e lista parcial de medicamentos, a solicitação pode ser devolvida quando faltam exame físico, cronologia clara e laudos dos exames citados.',
      'ECG descrito apenas como “alterado” sem transcrição do laudo ou resultado objetivo.'
    ],
    history: [
      'Caracterize dor torácica e sintomas associados com início, duração dos episódios, frequência, relação com esforço e evolução recente.'
    ],
    investigations: [
      'Transcreva a conclusão do ECG e dos demais exames com data; não informe somente que houve alteração.'
    ]
  });

  extendProfile('urologia', {
    returns: [
      'PSA descrito somente como “aumentado”, sem valor, data e quadro urinário que justifique a ultrassonografia ou a prioridade.'
    ],
    history: [
      'Em investigação prostática, descreva sintomas urinários, retenção, hematúria, infecção, dor, evolução e tratamentos já realizados.'
    ],
    investigations: [
      'Informe o valor exato e a data do PSA, além dos achados profissionais exigidos no protocolo; qualificadores como “alto” ou “alterado” são insuficientes para priorização.'
    ]
  });

  extendProfile('ortopedia', {
    returns: [
      'Ressonância de pé após trauma recente solicitada apenas com a informação de que ocorreu um acidente, sem mecanismo, exame físico, radiografias ou avaliação prévia.'
    ],
    history: [
      'Em trauma recente, detalhe mecanismo, data, local exato da dor, capacidade de apoio, evolução e atendimento de urgência já realizado.'
    ],
    examination: [
      'Registre edema, deformidade, pontos dolorosos, amplitude, estabilidade, integridade neurovascular e capacidade funcional conforme a região.'
    ],
    investigations: [
      'Antes de ressonância após trauma, informe exames iniciais já realizados e o que se pretende confirmar ou excluir com o exame avançado.'
    ],
    safety: [
      'Trauma recente com suspeita de fratura, deformidade, déficit neurovascular ou incapacidade importante deve ser avaliado no fluxo agudo antes da fila eletiva de imagem.'
    ]
  });

  Object.defineProperty(guidance, '__studyUpdate20260804', { value: true, enumerable: false });
})();
