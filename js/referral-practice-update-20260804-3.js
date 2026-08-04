'use strict';

(() => {
  const guidance = window.REFERRAL_PRACTICE_GUIDANCE;
  if (!guidance || guidance.__studyUpdate20260804Batch3) return;

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

  guidance.version = '1.3';
  guidance.updatedAt = '04/08/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de três complementos analisados em 04/08/2026. O terceiro complemento reúne 17 documentos, sem dados identificáveis de pacientes ou profissionais.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa: estudo operacional anonimizado de devoluções reais - lotes 1 a 10 e três complementos analisados em 04/08/2026, abrangendo casos de 2022 a 2026.';
  guidance.methodology.studyHistory = appendUnique(guidance.methodology.studyHistory, [
    'Complemento 1 - 13 documentos analisados em 04/08/2026.',
    'Complemento 2 - 20 documentos analisados em 04/08/2026.',
    'Complemento 3 - 17 documentos analisados em 04/08/2026.'
  ]);
  guidance.methodology.responsePolicy = appendUnique(guidance.methodology.responsePolicy, [
    'Antes de listar o que falta, reconhecer o que já está claramente descrito na solicitação e não pedir novamente a mesma informação.',
    'Expressões do regulador como "se houver" e "se possível" indicam elemento complementar ou condicionado, e não requisito universal obrigatório.',
    'Quando a devolução ocorrer somente pelo tempo de espera, explicar que a solicitação já havia sido analisada e que a finalidade é confirmar necessidade atual e atualizar o quadro, sem tratar o encaminhamento original como necessariamente inadequado.',
    'Em solicitação antiga já classificada, especialmente urgente, não orientar cancelamento e reinserção automaticamente; alertar sobre possível perda de data, posição e classificação e buscar complementação segura.',
    'Quando a queixa não corresponde à especialidade escolhida, explicar a incompatibilidade clínica e de fluxo. Só orientar cancelamento e reinserção quando a decisão registrada exigir esse procedimento, com alerta sobre preservação da fila.',
    'Quando uma exigência prática divergir do protocolo localizado, apresentar a divergência para conferência humana e não transformar a exigência isolada em regra oficial.'
  ]);

  guidance.universal.returns = appendUnique(guidance.universal.returns, [
    'Solicitação antiga devolvida exclusivamente para atualização do quadro e confirmação de que o exame ou consulta ainda é necessário.',
    'Pedido de mais de um exame sem atualização individual da necessidade de cada procedimento após longo tempo de espera.',
    'Informação clínica relevante já presente, mas sem conclusão profissional sobre estabilidade para aguardar atendimento eletivo.',
    'Queixa e CID incompatíveis com a especialidade selecionada, sem justificativa clínica para o destino escolhido.',
    'Frases genéricas como "exame físico sem alteração" ou "ao exame NDN" sem os achados dirigidos necessários à especialidade.',
    'Exame ou documento complementar solicitado apenas "se houver" interpretado incorretamente como requisito obrigatório.'
  ]);
  guidance.universal.history = appendUnique(guidance.universal.history, [
    'Em atualização por tempo de fila, registre o quadro atual, mudanças desde a solicitação original, tratamentos realizados no intervalo e se a necessidade permanece.',
    'Quando houver dois ou mais procedimentos na mesma solicitação, confirme separadamente se cada exame continua necessário e atualize sintomas e limitações de cada região.',
    'Quando a especialidade parecer incompatível com a queixa, explique a finalidade clínica pretendida e qual problema específico deve ser avaliado pelo destino escolhido.'
  ]);
  guidance.universal.examination = appendUnique(guidance.universal.examination, [
    'Afirmar que o exame está normal não substitui a descrição dirigida dos achados relacionados à queixa e à especialidade.',
    'A conclusão de que o paciente está estável para aguardar vaga eletiva exige avaliação profissional e deve ser registrada quando solicitada pelo regulador.'
  ]);
  guidance.universal.investigations = appendUnique(guidance.universal.investigations, [
    'Quando o regulador pedir exame de imagem "se tiver", informar e anexar o laudo se já realizado; se não existir, declarar objetivamente que não foi realizado, sem criar obrigação não prevista.',
    'Em pedidos antigos, verificar se o exame já foi feito por outro meio antes de manter a solicitação.',
    'Resultados anteriores continuam úteis, mas a atualização deve deixar claro se ainda representam o quadro atual.'
  ]);
  guidance.universal.caseDependent = appendUnique(guidance.universal.caseDependent, [
    'Teste ou exame descrito como "se possível" deve respeitar limitações clínicas, cognitivas, comportamentais ou de cooperação; se não for viável, documentar o motivo em vez de inventar resultado.',
    'A classificação anterior não é garantia de manutenção da mesma prioridade após a atualização clínica.',
    'Uma orientação específica para cancelar e reinserir por especialidade incorreta não deve ser generalizada para todas as devoluções.'
  ]);

  extendProfile('psiquiatria', 'Psiquiatria', ['psiquiatria', 'episodio depressivo', 'ansiedade', 'vaginismo'], {
    returns: [
      'Sintomas depressivos e acompanhamento psicológico descritos sem informar se houve estratégia farmacológica, dose, duração e resposta quando o protocolo exige falha ou resposta parcial ao tratamento inicial.',
      'Solicitação antiga com diagnóstico ou queixa original, mas sem quadro psiquiátrico atual, tratamento atual, uso de álcool ou outras substâncias e histórico de CAPS.',
      'Impacto funcional de condição ginecológica ou sexual usado como justificativa isolada, sem atualização dos sintomas de saúde mental e do tratamento psiquiátrico atual.',
      'Medicamentos antigos citados sem esclarecer interrupção, motivo, evolução após suspensão e necessidade atual do atendimento.'
    ],
    history: [
      'Em transtornos depressivos, informe sintomas atuais, duração, evolução, prejuízo funcional e se houve resposta ausente ou parcial à abordagem inicial prevista no protocolo.',
      'Em atualização de fila, confirme uso de álcool e outras substâncias, acompanhamento no CAPS, alta formal ou perda de seguimento e necessidade atual da consulta.'
    ],
    treatment: [
      'Registre medicação psiquiátrica atual e anterior com dose, posologia, tempo de uso, adesão, resposta, efeitos adversos e motivo de interrupção.',
      'Quando o protocolo exigir estratégia farmacológica eficaz por período mínimo, não substitua essa informação apenas por psicoterapia ou pedido genérico de avaliação.'
    ],
    patientReportable: [
      'Uso de álcool ou outras substâncias, acompanhamento anterior no CAPS, interrupção de medicamentos e necessidade atual podem ser confirmados com o paciente ou responsável e registrados como relato.'
    ],
    professionalOnly: [
      'A avaliação da gravidade, estabilidade para fila eletiva, exame do estado mental e indicação ou mudança farmacológica exigem profissional habilitado.'
    ]
  });

  extendProfile('dermatologia', 'Dermatologia', ['dermatologia', 'dermatite atopica', 'lesoes de pele'], {
    returns: [
      'Lesões bem descritas quanto a número, tamanho, localização, sintomas e tratamentos, mas sem hipótese diagnóstica profissional.',
      'Ausência de registro explícito sobre possibilidade de aguardar atendimento ambulatorial quando o regulador precisa excluir gravidade ou urgência.'
    ],
    examination: [
      'A hipótese diagnóstica dermatológica e a avaliação de estabilidade para aguardar são atribuições profissionais; não devem ser inferidas apenas da fotografia ou do relato.'
    ],
    caseDependent: [
      'Mesmo com descrição morfológica adequada, o regulador pode precisar de hipótese diagnóstica e avaliação de gravidade para classificar o risco.'
    ]
  });

  extendProfile('alergia-imunologia', 'Alergia e Imunologia', ['alergia e imunologia', 'alergia nao especificada', 'urticaria', 'angioedema', 'hipersensibilidade'], {
    returns: [
      'Quadro recorrente descrito sem frequência dos episódios, duração de cada crise, evolução global e possíveis fatores desencadeantes.',
      'Lesões cutâneas citadas sem detalhamento suficiente para relacionar o padrão clínico a uma reação alérgica específica.',
      'Ausência de exames já realizados, tratamentos tentados, medicamentos atuais e resposta obtida.'
    ],
    history: [
      'Caracterize repetição, duração, progressão, locais acometidos e relação temporal com medicamentos, alimentos, exposições ou outros possíveis desencadeantes quando conhecidos.'
    ],
    treatment: [
      'Informe tratamentos realizados, medicamentos em uso e resposta; não registre apenas histórico remoto de alergia sem relacioná-lo ao quadro atual.'
    ],
    investigations: [
      'Cite exames prévios somente quando realizados e informe seus resultados; não invente testes alérgicos ausentes.'
    ]
  });

  extendProfile('oftalmologia', 'Oftalmologia', ['oftalmologia', 'disturbios visuais', 'visao subnormal', 'acuidade visual', 'dor ocular'], {
    returns: [
      'Queixa de baixa visão, leitura próxima, prurido ou dor ocular sem tempo de evolução, tratamentos, medicamentos oculares, lentes e comorbidades relevantes.',
      'Expressão "exame físico sem alteração" sem avaliação ocular dirigida ou medida funcional disponível.',
      'Ausência do teste de Snellen quando viável, sem explicar impossibilidade clínica, comportamental ou de cooperação.'
    ],
    history: [
      'Descreva início, evolução, lateralidade, caráter intermitente ou contínuo, impacto funcional e outras queixas oculares associadas.'
    ],
    examination: [
      'Registre achados oculares dirigidos disponíveis e Snellen quando possível por médico ou enfermeiro da UBS.',
      'Em pessoa com dificuldade de cooperação, documente por que o Snellen não pôde ser realizado; não estime acuidade visual.'
    ],
    treatment: [
      'Informe colírios, outros medicamentos oculares, lentes corretivas, tratamentos prévios e resposta.'
    ],
    investigations: [
      'Informe presença e tempo de diabetes ou hipertensão, medicamentos relacionados e exames oftalmológicos anteriores quando existentes.'
    ],
    caseDependent: [
      'O teste de Snellen foi solicitado como "se possível"; a impossibilidade de realização deve ser justificada, não tratada como falha automática.'
    ]
  });

  extendProfile('exames-mamarios', 'Exames mamários', ['ultrassonografia de mamas', 'mastodinia', 'mastalgia'], {
    returns: [
      'Dor mamária e antecedente familiar descritos sem exame físico profissional das mamas.',
      'História familiar de câncer usada como substituto da descrição de inspeção, palpação, lateralidade e achados atuais.'
    ],
    examination: [
      'O exame físico das mamas deve ser realizado por profissional habilitado e registrar lateralidade, localização, presença ou ausência de nódulo e sinais associados.'
    ]
  });

  extendProfile('gastroenterologia-hepatites', 'Gastroenterologia e hepatites', ['gastroenterologia', 'hepatite viral', 'hcv', 'hepatite c'], {
    returns: [
      'Sorologias e sintomas relevantes informados, mas sem exame de imagem já existente que possa ajudar na classificação de risco e prioridade.',
      'Pedido complementar formulado como "se tiver" interpretado como exigência absoluta.'
    ],
    history: [
      'Mantenha sintomas, evolução, antecedentes e repercussão clínica claramente relacionados ao motivo da avaliação especializada.'
    ],
    investigations: [
      'Se houver ultrassonografia, tomografia ou outro exame de imagem já realizado, informe data e laudo para apoiar a classificação.',
      'Se não houver exame de imagem, declare essa ausência objetivamente; o caso analisado pediu imagem apenas se disponível.'
    ],
    caseDependent: [
      'A necessidade de imagem depende do quadro e do protocolo aplicável; a devolução analisada não autoriza transformar imagem em requisito universal para toda hepatite.'
    ]
  });

  extendProfile('neurologia', 'Neurologia', ['neurologia', 'acidente vascular cerebral', 'ait', 'lipotimia', 'desmaio'], {
    returns: [
      'Suspeita de AIT, AVC ou outro quadro potencialmente agudo enviada para fila eletiva sem esclarecer quando ocorreu, se há sintomas atuais e se o paciente está estável.',
      'Pedido de investigação etiológica sem descrição dos episódios, evolução, exames, tratamentos, medicamentos e comorbidades.'
    ],
    history: [
      'Informe cronologia dos episódios, sintomas neurológicos associados, duração, resolução, recorrência e estado atual.'
    ],
    safety: [
      'Suspeita de AVC ou AIT em fase aguda, déficit neurológico atual ou piora súbita deve ser direcionada à urgência e não aguardar consulta eletiva.',
      'Somente após avaliação profissional de estabilidade o caso pode ser descrito como apto a aguardar vaga ambulatorial.'
    ],
    professionalOnly: [
      'Exame neurológico, interpretação de neuroimagem e definição de estabilidade ou urgência exigem profissional habilitado.'
    ]
  });

  extendProfile('ortopedia', 'Ortopedia', ['ortopedia adulto', 'sindrome cervicobraquial', 'cervicalgia', 'dor e dormencia'], {
    returns: [
      'Dor e dormência crônicas descritas sem tempo de evolução preciso, distribuição dos sintomas, limitação, medicamentos e tentativa terapêutica na APS.',
      'Ausência dos exames complementares solicitados pelo regulador para o segmento afetado.'
    ],
    history: [
      'Descreva localização, irradiação, dormência, perda de força relatada, limitação funcional, evolução e resposta às medidas realizadas na APS.'
    ],
    treatment: [
      'Informe medicamentos, fisioterapia ou outras tentativas terapêuticas na APS, com duração e resposta.'
    ],
    investigations: [
      'Para cervicalgia, o protocolo localizado prevê radiografia AP e perfil; TC e ressonância aparecem como opcionais se já realizadas.',
      'A ultrassonografia foi solicitada na devolução analisada, mas não aparece no trecho protocolar localizado para cervicalgia. Apresente essa divergência para conferência humana e não a declare obrigatória em todos os casos.'
    ],
    caseDependent: [
      'Exames devem ser vinculados à região anatômica e à hipótese clínica; não generalize a ultrassonografia para toda síndrome cervicobraquial.'
    ]
  });

  extendProfile('exames-musculoesqueleticos', 'Ultrassonografias musculoesqueléticas', ['ultra-sonografia ombro', 'ultrassonografia ombro', 'ultra-sonografia punho', 'ultrassonografia punho', 'ultra-sonografia joelho', 'ultrassonografia joelho'], {
    returns: [
      'Exame previamente classificado e aguardando vaga devolvido após cerca de um ano apenas para atualizar o quadro e confirmar necessidade atual.',
      'Solicitação com mais de uma região anatômica sem atualização individual da dor, mobilidade e necessidade de cada exame.'
    ],
    history: [
      'Atualize dor, edema, mobilidade, capacidade funcional, evolução após trauma e tratamentos realizados desde a solicitação original.',
      'Quando houver ombro, punho ou outra região na mesma solicitação, responda separadamente sobre cada exame.'
    ],
    caseDependent: [
      'A devolução por tempo decorrido não significa que o exame original foi inadequado; a finalidade é verificar se ainda é necessário ou se já foi realizado por outro meio.'
    ]
  });

  extendProfile('colangiorressonancia', 'Colangiorressonância', ['colangiorressonancia', 'colangiorressonância', 'ectasia de coledoco', 'colecistopatia calculosa'], {
    returns: [
      'Exame previamente classificado como urgente devolvido após longo tempo para atualização do quadro e confirmação de necessidade atual.'
    ],
    history: [
      'Atualize sintomas biliares, evolução, intercorrências, tratamentos, exames realizados no intervalo e se o exame ainda é necessário.'
    ],
    safety: [
      'Se houver piora grave ou quadro agudo atual, a avaliação deve ocorrer pelo fluxo assistencial adequado e não apenas pela atualização administrativa da fila.'
    ],
    caseDependent: [
      'Por se tratar de solicitação antiga já classificada como urgente, não recomendar cancelamento e nova inserção sem avaliar perda de data e classificação.'
    ]
  });

  extendProfile('fonoaudiologia', 'Fonoaudiologia', ['fonoaudiologia', 'gagueira', 'tartamudez', 'disfluencia de fala'], {
    returns: [
      'Queixa de gagueira ou disfluência encaminhada para especialidade respiratória sem quadro clínico pneumológico que justifique o destino.',
      'Solicitação para Fonoaudiologia sem história da doença, intervenções realizadas, medicamentos quando pertinentes e quadro atual.'
    ],
    history: [
      'Em gagueira, descreva início, evolução, impacto funcional e intervenções já realizadas conforme o protocolo de Fonoaudiologia.'
    ],
    caseDependent: [
      'No caso analisado, a devolução orientou Fonoaudiologia/eMulti ou Consulta em Fonoaudiologia. A escolha do fluxo deve ser confirmada conforme cobertura e protocolo local.'
    ]
  });

  extendProfile('pneumologia', 'Pneumologia', ['pneumologia pediatria', 'pneumologia'], {
    returns: [
      'Queixa sem natureza respiratória encaminhada para Pneumologia sem justificativa específica para manter a especialidade.'
    ],
    history: [
      'Se houver motivo real para Pneumologia, descreva queixa respiratória, tempo de evolução, reavaliações, medicamentos e dados pertinentes do exame físico.'
    ],
    caseDependent: [
      'Quando a própria devolução determinar cancelamento e reinserção por especialidade incorreta, explique o motivo e confirme o impacto operacional antes da ação; não generalize essa conduta para outras devoluções.'
    ]
  });

  guidance.__studyUpdate20260804Batch3 = true;
})();
