'use strict';

(() => {
  const guidance = window.REFERRAL_PRACTICE_GUIDANCE;
  if (!guidance || guidance.__studyUpdate20260804Batch4) return;

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

  guidance.version = '1.4';
  guidance.updatedAt = '04/08/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de quatro complementos analisados em 04/08/2026. O quarto complemento reúne 19 documentos; 18 continham justificativa regulatória utilizável e 1 não apresentava motivo suficiente para inferência.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa: estudo operacional anonimizado de devoluções reais - lotes 1 a 10 e quatro complementos analisados em 04/08/2026, abrangendo casos de 2022 a 2026.';
  guidance.methodology.studyHistory = appendUnique(guidance.methodology.studyHistory, [
    'Complemento 1 - 13 documentos analisados em 04/08/2026.',
    'Complemento 2 - 20 documentos analisados em 04/08/2026.',
    'Complemento 3 - 17 documentos analisados em 04/08/2026.',
    'Complemento 4 - 19 documentos revisados em 04/08/2026; 18 com justificativa regulatória utilizável e 1 excluído da inferência por ausência de motivo registrado.'
  ]);
  guidance.methodology.responsePolicy = appendUnique(guidance.methodology.responsePolicy, [
    'Não inferir o motivo de uma devolução apenas pelo status. Se o documento não mostrar a justificativa do regulador, informar que o fundamento não está disponível e solicitar o histórico completo.',
    'Distinguir a situação atual DEVOLVIDA de uma advertência de que a solicitação poderá ser negada no futuro se não houver atualização. Não chamar de negada antes da decisão correspondente.',
    'Quando a devolução ocorrer após anos em fila, orientar atualização clínica objetiva e reavaliação da indicação sem atribuir culpa ao encaminhamento original, que já havia sido classificado.',
    'Em atualização de exame antigo, confirmar também se o procedimento já foi realizado por outro meio, se houve mudança terapêutica e qual decisão clínica ainda depende do resultado.',
    'Quando um exame de seguimento depende de intervalo temporal, exigir a data do exame anterior e não apenas a categoria ou o resultado.',
    'Diferenciar requisito protocolar obrigatório, informação útil para priorização e item solicitado apenas se disponível.',
    'Não transformar uma orientação de destino oncológico em regra automática: suspeita de câncer, escolha do fluxo e indicação de biópsia ou cirurgia exigem avaliação médica e conferência do fluxo vigente.',
    'Quando a devolução pedir avaliação profissional dirigida, não sugerir que o paciente produza exame físico, hipótese diagnóstica, lesão elementar, medida precisa, estado mental ou classificação de risco.'
  ]);

  guidance.universal.returns = appendUnique(guidance.universal.returns, [
    'Solicitação antiga já classificada, mas devolvida anos depois para confirmar necessidade atual, frequência e duração dos sintomas, limitações e medicamentos em uso.',
    'Exame de acompanhamento solicitado sem informar a data do exame anterior, impedindo confirmar o intervalo recomendado.',
    'História remota relevante usada como justificativa sem descrever o quadro clínico atual e a pergunta clínica presente.',
    'Documento com status devolvido, porém sem justificativa regulatória visível; o motivo não pode ser presumido.',
    'Pendência administrativa ou cadastral corrigida, mas solicitação devolvida novamente por desatualização clínica causada pelo tempo transcorrido.',
    'Exame solicitado para rastreamento genérico sem sintomas, exame físico dirigido ou fundamento clínico suficiente para a indicação.'
  ]);
  guidance.universal.history = appendUnique(guidance.universal.history, [
    'Em reavaliações após longo tempo, registrar frequência, duração e intensidade atuais dos sintomas, impacto nas atividades, tratamentos realizados desde o pedido e necessidade atual do procedimento.',
    'Quando a solicitação se basear em evento remoto, separar sequelas atuais, sintomas novos e motivo específico para nova avaliação ou repetição de exame.',
    'Em seguimento pós-operatório, informar data e local da cirurgia, alta, acompanhamento atual, sintomas residuais, limitação funcional e qual conduta depende do novo exame.'
  ]);
  guidance.universal.investigations = appendUnique(guidance.universal.investigations, [
    'Para exame seriado ou controle evolutivo, informar nome, data e conclusão do exame anterior e o intervalo recomendado.',
    'Quando o regulador solicitar resultado laboratorial para priorização, registrar valor, unidade, data e interpretação clínica profissional quando aplicável.',
    'Não usar apenas expressões como exame anterior alterado ou categoria de imagem sem informar a data e a conclusão relevante.',
    'Em solicitações antigas, verificar se o exame foi realizado, substituído por outro método ou perdeu utilidade clínica.'
  ]);
  guidance.universal.caseDependent = appendUnique(guidance.universal.caseDependent, [
    'Advertência de futura negativa por falta de atualização não altera o status atual de devolvida.',
    'Exame pedido se houver deve ser apresentado quando disponível; a ausência deve ser declarada sem inventar resultado.',
    'Uma exigência registrada pelo regulador pode ser operacional ou específica daquele caso e deve ser comparada ao protocolo antes de ser apresentada como obrigatória.'
  ]);

  extendProfile('batch4-ecocardiografia', 'Ecocardiografia e avaliação cardiovascular', ['ecocardiografia', 'ecocardiograma'], {
    returns: [
      'Ecocardiografia antiga devolvida após longo período sem atualização da frequência e duração de palpitação, dispneia, dor ou limitação funcional.',
      'Comorbidades e medicamentos antigos descritos, mas sem confirmação de esquema atual, evolução e necessidade presente do exame.',
      'Solicitação inicialmente aceita e classificada que pode ser negada posteriormente se a indicação não for reavaliada e atualizada.'
    ],
    history: [
      'Atualize sintomas cardiovasculares atuais, frequência, duração, relação com esforço, limitação nas atividades, eventos recentes e mudanças desde o pedido original.',
      'Confirme se o ecocardiograma ainda responde a uma pergunta clínica atual e se já foi realizado por outro meio.'
    ],
    treatment: [
      'Informe medicamentos cardiovasculares e metabólicos atuais com dose, posologia, adesão e mudanças desde a solicitação.'
    ],
    investigations: [
      'Registre exames cardiológicos realizados no intervalo, com data e conclusão, sem substituir a atualização clínica apenas por laudos antigos.'
    ],
    caseDependent: [
      'A mensagem de que solicitações sem atualização poderão ser negadas é advertência de fluxo; enquanto o sistema mostrar devolvida, não classificar como negada.'
    ]
  });

  extendProfile('batch4-psiquiatria', 'Psiquiatria e saúde mental', ['psiquiatria'], {
    returns: [
      'Encaminhamento clínico detalhado devolvido apenas pela ausência de informação sobre álcool, outras substâncias e histórico de CAPS.',
      'Queixas cognitivas, insônia ou confusão descritas sem esclarecer uso de substâncias e vínculo anterior com a rede de saúde mental.',
      'Investigação de transtorno do neurodesenvolvimento em adulto sem informar etilismo, substâncias ilícitas, alta do CAPS ou perda de seguimento.'
    ],
    history: [
      'Pergunte diretamente sobre uso atual e anterior de álcool e outras substâncias, frequência, última utilização e relação percebida com os sintomas.',
      'Confirme acompanhamento no CAPS, período, motivo, situação atual, alta formal ou perda de seguimento.'
    ],
    patientReportable: [
      'Uso de álcool e outras substâncias, histórico de CAPS, alta recebida, perda de seguimento, sintomas observados e impacto funcional podem ser relatados pelo paciente ou responsável.'
    ],
    professionalOnly: [
      'Confusão mental atual, exame do estado mental, diagnóstico diferencial entre causa psiquiátrica, neurológica ou clínica e estabilidade para fila eletiva exigem avaliação profissional.'
    ],
    safety: [
      'Confusão mental aguda, alteração importante do estado mental, risco para si ou terceiros ou piora grave exigem avaliação imediata, não apenas complementação administrativa.'
    ]
  });

  extendProfile('batch4-lesoes-cutaneas-cirurgia', 'Lesões cutâneas, Dermatologia e Cirurgia Geral', ['dermatologia', 'cirurgia geral', 'pequena cirurgia'], {
    returns: [
      'Lesão de partes moles ou pele descrita com crescimento, dor ou secreção, mas sem dimensão precisa.',
      'Lesão crônica bem descrita em aparência e evolução, porém sem lesão elementar, tamanho, tratamento instituído e hipótese diagnóstica.',
      'Pedido de avaliação dermatológica sem definição profissional sobre suspeita de neoplasia e destino clínico ou cirúrgico.'
    ],
    examination: [
      'Registrar localização anatômica, quantidade, dimensões em unidades objetivas, lesão elementar, superfície, bordas, cor, consistência, mobilidade, secreção e sinais inflamatórios quando pertinentes.'
    ],
    treatment: [
      'Informar tratamentos tópicos, sistêmicos ou procedimentos já realizados, duração e resposta.'
    ],
    professionalOnly: [
      'Lesão elementar, medida precisa, hipótese diagnóstica, suspeita de câncer, indicação de biópsia e escolha de fluxo oncológico exigem avaliação médica.'
    ],
    caseDependent: [
      'Encaminhamento para pequena cirurgia oncológica foi citado em uma devolução para lesão altamente sugestiva; não aplicar automaticamente sem suspeita médica fundamentada e conferência do fluxo vigente.'
    ]
  });

  extendProfile('batch4-imagem-mamaria', 'Ultrassonografia mamária e seguimento BI-RADS', ['ultrassonografia de mamas', 'usg mamaria', 'mamografia', 'mastologia'], {
    returns: [
      'Controle em seis meses solicitado com categorias BI-RADS informadas, mas sem a data do exame anterior.',
      'Indicação de seguimento sem laudo anterior completo ou sem comprovação do intervalo temporal.'
    ],
    investigations: [
      'Em controle BI-RADS, informar data, modalidade, lateralidade, categoria de cada mama, recomendação do laudo e anexar o documento quando disponível.'
    ],
    caseDependent: [
      'A data do exame anterior é essencial quando a justificativa depende de controle em prazo definido.'
    ]
  });

  extendProfile('batch4-ultrassom-articular-antigo', 'Ultrassonografia musculoesquelética', ['ultra-sonografia ombro', 'ultrassonografia ombro', 'ultra-sonografia punho', 'ultrassonografia punho', 'ultra-sonografia cotovelo', 'ultrassonografia cotovelo'], {
    returns: [
      'Ultrassonografia articular previamente aceita e depois devolvida para atualização do quadro e confirmação de necessidade.',
      'Dois exames articulares solicitados no mesmo processo sem atualização individual de cada região após longo tempo.',
      'Exame pós-operatório mantido em fila sem informar evolução, alta, acompanhamento, dor atual e limitação funcional.'
    ],
    history: [
      'Atualize separadamente cada articulação: dor, parestesia, edema, força, amplitude, limitação, piora com esforço, trauma e evolução desde o pedido.',
      'Em pós-operatório, informe data e lado da cirurgia, seguimento com o serviço, alta, reabilitação e sintomas atuais.'
    ],
    investigations: [
      'Confirme se cada ultrassonografia ainda é necessária, se já foi realizada e qual decisão clínica depende do resultado.'
    ]
  });

  extendProfile('batch4-neurologia-atual', 'Neurologia e quadro atual', ['neurologia'], {
    returns: [
      'TCE remoto e lista de medicamentos usados como justificativa para repetir exame, sem quadro neurológico atual.',
      'Expressão exame clínico e neurológico sem alterações sem detalhar sintomas, sequelas, evolução e indicação atual.'
    ],
    history: [
      'Descreva sintomas neurológicos atuais, início, evolução, frequência, impacto funcional, crises, déficits, alterações cognitivas e motivo objetivo da nova avaliação.'
    ],
    investigations: [
      'Ao pedir repetição de exame neurológico, informar exame anterior, data, resultado e qual mudança clínica ou decisão terapêutica justifica repetir.'
    ],
    professionalOnly: [
      'Exame neurológico dirigido, indicação de eletroencefalograma ou outro mapeamento, interpretação de sequelas e diagnóstico diferencial exigem avaliação profissional.'
    ]
  });

  extendProfile('batch4-prostata', 'Ultrassonografia de próstata e sintomas urinários', ['ultrassonografia de prostata', 'ultra-sonografia de prostata', 'prostata por via abdominal', 'prostata'], {
    returns: [
      'Ultrassonografia solicitada apenas para rastreamento de possível hiperplasia, sem quadro clínico dirigido ou resultados disponíveis.',
      'Sintomas urinários descritos, mas sem exames laboratoriais prostáticos objetivos para auxiliar classificação e prioridade.',
      'PSA solicitado se disponível, com risco de ser interpretado incorretamente como exigência universal do exame.'
    ],
    history: [
      'Caracterize noctúria, frequência, urgência, jato, hesitação, retenção, disúria, hematúria, dor, infecção recorrente e impacto funcional.'
    ],
    investigations: [
      'Quando houver PSA, informar valor, data e contexto clínico; não escrever apenas alterado.',
      'Conferir no protocolo oficial quais exames e achados são obrigatórios para a finalidade específica, distinguindo ultrassonografia de consulta em Urologia.'
    ],
    professionalOnly: [
      'Exame físico urológico, toque retal, hipótese de hiperplasia ou neoplasia e interpretação do PSA exigem avaliação médica.'
    ],
    caseDependent: [
      'Em uma devolução o PSA foi solicitado se disponível; em outra foram pedidos exames laboratoriais prostáticos para priorização. Não generalizar sem conferir o protocolo e a indicação.'
    ]
  });

  extendProfile('batch4-nefrologia', 'Nefrologia e doença renal avançada', ['nefrologia'], {
    returns: [
      'Doença renal crônica avançada com ureia e creatinina informadas, mas sem clearance ou taxa de filtração documentada e sem imagem renal.',
      'Solicitação com indicação forte, porém sem todos os dados usados pela especialidade para definir ambulatório geral ou pré-dialítico.'
    ],
    history: [
      'Informe estágio, tempo de evolução, sintomas urêmicos, diurese, edema, pressão arterial, infecções urinárias, tratamentos e acompanhamento anterior.'
    ],
    investigations: [
      'Registrar ureia, creatinina, taxa de filtração glomerular ou clearance com data, exame de urina e imagem renal quando prevista ou disponível.',
      'Quando a devolução citar clearance menor que 30 ml/min/1,73 m² e ambulatório pré-dialítico, conferir o protocolo e o fluxo local antes de reenviar.'
    ],
    professionalOnly: [
      'Cálculo e interpretação da função renal, estágio da doença, presença de uremia e definição do destino pré-dialítico exigem avaliação profissional.'
    ],
    safety: [
      'Uremia sintomática, oligúria com repercussão, distúrbio hidroeletrolítico importante, insuficiência renal aguda ou doença renal crônica agudizada não devem aguardar fila eletiva.'
    ],
    caseDependent: [
      'A devolução listou ureia, creatinina, clearance e imagem renal como exigência da especialidade; comparar essa lista ao protocolo oficial cadastrado e sinalizar divergência, se houver.'
    ]
  });

  extendProfile('batch4-oftalmologia', 'Oftalmologia e atualização clínica', ['oftalmologia'], {
    returns: [
      'Finalidade de rastreamento de retinopatia descrita, mas sem tempo de diabetes ou hipertensão, medicações, acuidade visual e avaliação ocular atual.',
      'Pendência cadastral corrigida após anos, porém o quadro clínico permaneceu desatualizado e gerou nova devolução.',
      'Queixa ocular antiga mantida sem atualizar evolução, tratamentos, lentes, comorbidades e Snellen quando possível.'
    ],
    history: [
      'Em diabetes e hipertensão, informar duração, controle atual, tratamento e presença ou ausência de queixas visuais.',
      'Após corrigir cadastro ou Cartão SUS, revisar também se a história clínica ainda representa o estado atual.'
    ],
    investigations: [
      'Registrar Snellen quando possível e documentar a impossibilidade quando houver limitação de cooperação ou condição clínica.',
      'Informar exames e tratamentos oculares anteriores, uso de colírios, lentes corretivas e outras patologias associadas.'
    ],
    caseDependent: [
      'Rastreamento de complicação diabética ainda pode exigir qualificação clínica e dados de doença de base conforme o fluxo regulatório local.'
    ]
  });

  extendProfile('batch4-neuropediatria-fluxo', 'Neurologia Pediátrica versus Psiquiatria Pediátrica', ['neurologia pediatrica', 'neuropediatria'], {
    returns: [
      'Distúrbio de comportamento, agressividade e dificuldade escolar encaminhados diretamente à Neurologia sem suspeita orgânica descrita.',
      'Exames de função renal, hepática e tireoidiana solicitados na devolução como complemento do novo fluxo, sem demonstração de que sejam universais para todo caso.'
    ],
    history: [
      'Diferencie alteração predominantemente comportamental ou escolar de regressão, convulsão, déficit focal, alteração neurológica ou suspeita de lesão orgânica.'
    ],
    safety: [
      'Agressividade com risco atual para terceiros exige avaliação profissional imediata e não deve ser tratada apenas como ajuste de especialidade.'
    ],
    professionalOnly: [
      'Suspeita de lesão orgânica, exame neurológico, avaliação de risco e decisão entre Psiquiatria e Neurologia exigem profissional habilitado.'
    ],
    caseDependent: [
      'O redirecionamento inicial para Psiquiatria Pediátrica foi explicitamente determinado no caso analisado; preservar a justificativa e conferir faixa etária e fluxo vigente.',
      'Função renal, hepática e tireoidiana foram cobradas na devolução observada; não declarar obrigatórias para todos os casos sem respaldo do protocolo.'
    ]
  });

  Object.defineProperty(guidance, '__studyUpdate20260804Batch4', {
    value: true,
    enumerable: false
  });
})();
