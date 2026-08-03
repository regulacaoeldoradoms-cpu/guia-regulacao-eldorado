'use strict';

(() => {
  const guidance = {
    version: '1.0',
    updatedAt: '03/08/2026',
    title: 'Camada prática de qualificação do encaminhamento',
    methodology: {
      scope: 'Síntese qualitativa e anonimizada de devoluções, recusas, negativas e atualizações regulatórias analisadas pelo Setor de Regulação de Eldorado/MS.',
      limitation: 'Os achados práticos complementam o protocolo, mas não transformam uma exigência isolada em regra universal e não substituem avaliação clínica ou decisão regulatória.',
      sourceLabel: 'Camada prática não normativa: estudo operacional anonimizado de devoluções regulatórias reais — lotes 1 a 10, casos de 2023 a 2026.'
    },
    universal: {
      returns: [
        'Encaminhamento genérico, como “avaliação e conduta”, sem problema clínico bem definido.',
        'Ausência de início, duração, evolução, frequência ou intensidade dos sintomas.',
        'Falta de exame físico pertinente ou de achados objetivos que sustentem a solicitação.',
        'Tratamento informado sem medicamento, dose, posologia, duração, adesão e resposta.',
        'Exame citado sem data, resultado, laudo ou correlação com o quadro clínico.',
        'Impossibilidade de diferenciar atendimento eletivo de situação que exige urgência ou emergência.',
        'Especialidade, faixa etária, procedimento ou via de acesso incompatíveis com o caso.',
        'Solicitação antiga sem atualização do quadro e sem confirmação de que a necessidade permanece.'
      ],
      history: [
        'Defina a queixa principal e o motivo objetivo da avaliação especializada.',
        'Registre início, tempo de evolução, frequência, intensidade e comportamento ao longo do tempo.',
        'Descreva sintomas associados, fatores de piora ou melhora e repercussão funcional.',
        'Informe antecedentes e comorbidades que alterem a análise do caso.'
      ],
      examination: [
        'Registre exame físico dirigido à hipótese e à especialidade solicitada.',
        'Descreva achados positivos e negativos relevantes, sem substituir o exame por expressões genéricas.',
        'Quando houver suspeita neurológica, psiquiátrica, cirúrgica ou oncológica, documente a avaliação profissional pertinente.'
      ],
      treatment: [
        'Informe tratamentos farmacológicos e não farmacológicos já realizados.',
        'Para medicamentos, registre nome, dose, quantidade, horário, duração, adesão, resposta e efeitos adversos.',
        'Explique falha terapêutica, contraindicação, intolerância ou motivo para não realizar a abordagem inicial esperada na Atenção Primária.'
      ],
      investigations: [
        'Informe nome, data e resultado dos exames já realizados.',
        'Anexe ou transcreva o laudo quando ele for necessário para a classificação regulatória.',
        'Separe exames obrigatórios, condicionais e apenas recomendados quando disponíveis.',
        'Não solicite exame avançado sem demonstrar a investigação prévia exigida pelo protocolo, quando aplicável.'
      ],
      safety: [
        'Confirme que o paciente está clinicamente estável para aguardar atendimento ambulatorial.',
        'Instabilidade, piora grave, risco para si ou terceiros, fratura ou lesão aguda relevante, isquemia, reação grave e outras emergências devem seguir o fluxo assistencial imediato.',
        'Não utilize a palavra “urgente” sem descrever os elementos clínicos que sustentam a prioridade.'
      ],
      patientReportable: [
        'Início, duração e evolução dos sintomas.',
        'Piora, melhora, frequência, intensidade e limitações nas atividades.',
        'Medicamentos, dose, horário, tempo de uso, adesão, resposta e efeitos percebidos.',
        'Cirurgias, acompanhamentos anteriores, uso de álcool, cigarro ou outras substâncias.',
        'Se ainda necessita da solicitação ou se realizou o atendimento por outro meio.'
      ],
      professionalOnly: [
        'Exame físico, neurológico ou avaliação formal do estado mental.',
        'Hipótese diagnóstica, indicação cirúrgica e classificação de risco.',
        'Interpretação de exames, descrição técnica de lesões e medidas precisas.',
        'Suspeita de câncer, mudança de tratamento ou medicação e avaliação de gravidade.'
      ],
      caseDependent: [
        'Exames condicionais devem ser solicitados somente quando a condição descrita no protocolo estiver presente.',
        'Uma cobrança feita em caso isolado não deve ser apresentada como requisito universal.',
        'Atualização por tempo decorrido é uma providência administrativa e não um novo critério clínico da especialidade.',
        'Pactuação, disponibilidade de prestador e destino regional devem ser conferidos separadamente dos critérios clínicos.'
      ]
    },
    profiles: [
      {
        id: 'cardiologia',
        label: 'Cardiologia',
        matchAny: ['cardiologia', 'cardiologico', 'arritmia', 'hipertensao', 'coronariana'],
        returns: [
          'Ausência de resultados de exames cardiológicos recentes.',
          'Hipertensão ou arritmia descrita sem valores, sintomas atuais, frequência cardíaca ou evolução.',
          'Encaminhamento voltado apenas à renovação de receita, sem justificar a necessidade especializada.',
          'Tratamento anti-hipertensivo ou cardiológico sem dose, posologia, adesão e resposta.'
        ],
        history: [
          'Descreva dor torácica, dispneia, palpitações, síncope, tontura, edema e tolerância ao esforço, quando presentes.',
          'Informe eventos cardiovasculares, internações, procedimentos e acompanhamento anterior.'
        ],
        examination: [
          'Registre pressão arterial, frequência cardíaca, ritmo, sinais de congestão e demais achados pertinentes.'
        ],
        treatment: [
          'Liste anti-hipertensivos, antiarrítmicos, anticoagulantes e demais medicamentos com dose e resposta.'
        ],
        investigations: [
          'Informe resultados e datas de ECG, Holter, ecocardiograma, teste ergométrico ou outros exames, quando realizados.'
        ],
        safety: [
          'Dor torácica aguda, dispneia importante, síncope com instabilidade ou suspeita de síndrome coronariana não devem aguardar fila eletiva.'
        ]
      },
      {
        id: 'endocrinologia',
        label: 'Endocrinologia',
        matchAny: ['endocrinologia', 'tireoide', 'hipertireoidismo', 'hipotireoidismo', 'diabetes', 'hipoglicemia'],
        returns: [
          'Ausência de exames laboratoriais atuais relacionados ao problema endócrino.',
          'Uso prolongado de medicamento sem dose, controle laboratorial, sintomas ou motivo atual para avaliação.',
          'Diabetes descrito sem medidas de controle, tratamento, adesão e complicações.',
          'Solicitação antiga sem atualização clínica e sem confirmação da necessidade.'
        ],
        history: [
          'Descreva sintomas endócrinos atuais, evolução, variação de peso, episódios de hipo ou hiperglicemia e complicações.'
        ],
        treatment: [
          'Informe levotiroxina, antitireoidianos, insulinas e outros medicamentos com dose, esquema, adesão e resposta.'
        ],
        investigations: [
          'Para doenças tireoidianas, informe TSH, T4 livre e exames adicionais previstos para o quadro.',
          'Para diabetes, informe controle glicêmico e exames de complicações conforme o protocolo e a situação clínica.',
          'Quando houver ultrassonografia, transcreva conclusão e medidas relevantes em vez de citar apenas que o exame foi feito.'
        ]
      },
      {
        id: 'psiquiatria',
        label: 'Psiquiatria',
        matchAny: ['psiquiatria', 'psiquiatrico', 'transtorno bipolar', 'depressao', 'psicose', 'tdah', 'tod'],
        returns: [
          'Ausência de descrição do quadro psiquiátrico atual e do tempo de evolução.',
          'Medicamentos sem dose, horário, duração, adesão, resposta ou efeitos.',
          'Falta de histórico de internações, psicologia, CAPS, especialista anterior ou uso de substâncias.',
          'Não informar se o paciente está estável para aguardar atendimento ambulatorial.',
          'Pedido de retorno ou reagendamento sem atualização clínica.'
        ],
        history: [
          'Descreva sintomas atuais, frequência, prejuízo funcional, sono, comportamento e evolução.',
          'Informe acompanhamento psicológico, CAPS, internações, uso de álcool e outras substâncias.'
        ],
        examination: [
          'Registre avaliação formal do estado mental e avaliação de risco quando pertinentes; esses dados devem vir de profissional habilitado.'
        ],
        treatment: [
          'Detalhe tratamento farmacológico e não farmacológico, incluindo resposta, tolerabilidade e motivo de mudança ou falha.'
        ],
        safety: [
          'Ideação suicida atual, tentativa recente, psicose aguda, risco para si ou terceiros e alteração mental importante exigem avaliação imediata.'
        ],
        patientReportable: [
          'Sintomas percebidos, sono, adesão, resposta e efeitos dos medicamentos.',
          'Acompanhamentos anteriores e uso de álcool ou outras substâncias.'
        ],
        professionalOnly: [
          'Exame do estado mental, avaliação de risco, hipótese diagnóstica e definição de estabilidade para aguardar fila.'
        ]
      },
      {
        id: 'neurologia',
        label: 'Neurologia',
        matchAny: ['neurologia', 'neurologico', 'convulsao', 'epilepsia', 'cefaleia'],
        excludeAny: ['neuropediatria', 'neurologia pediatrica'],
        returns: [
          'Histórico incompleto, sem exame neurológico e sem laudos anteriores.',
          'Ausência de comorbidades, medicamentos, seguimento anterior e evolução atual.',
          'Solicitação de exame ou avaliação sem demonstrar mudança clínica ou suspeita orgânica.'
        ],
        history: [
          'Descreva início, evolução, frequência dos eventos, perda funcional e sintomas neurológicos associados.'
        ],
        examination: [
          'Registre exame neurológico dirigido, nível de consciência, força, sensibilidade, coordenação e outros achados pertinentes.'
        ],
        investigations: [
          'Informe laudos e resultados de exames neurológicos e de imagem já realizados.'
        ],
        safety: [
          'Déficit focal agudo, alteração súbita do nível de consciência, crise prolongada ou piora neurológica grave exigem avaliação imediata.'
        ]
      },
      {
        id: 'neuropediatria',
        label: 'Neuropediatria',
        matchAny: ['neuropediatria', 'neurologia pediatrica', 'neuroped', 'atraso do desenvolvimento'],
        returns: [
          'Ausência de relatório escolar atualizado e de relatórios das terapias.',
          'Dificuldade de aprendizagem ou comportamento encaminhada diretamente à Neurologia sem esclarecer suspeita de lesão orgânica.',
          'Falta de desenvolvimento neuropsicomotor, exame neurológico, histórico gestacional e perinatal.',
          'Documentos ou laudos anteriores não anexados.'
        ],
        history: [
          'Informe marcos do desenvolvimento, regressão ou perda de habilidades, linguagem, comportamento, aprendizagem e impacto funcional.',
          'Descreva história gestacional, parto, período neonatal, crises, sono e antecedentes familiares quando relevantes.'
        ],
        examination: [
          'Registre exame neurológico e avaliação do desenvolvimento realizados por profissional habilitado.'
        ],
        investigations: [
          'Anexe relatório escolar atualizado, relatórios de terapias e laudos anteriores quando o protocolo exigir ou quando já existirem.'
        ],
        caseDependent: [
          'Distúrbios predominantemente comportamentais ou de aprendizagem podem exigir avaliação inicial em Psiquiatria, salvo suspeita de lesão orgânica ou outro critério neurológico.'
        ]
      },
      {
        id: 'ortopedia',
        label: 'Ortopedia',
        matchAny: ['ortopedia', 'ortopedista', 'traumatologia', 'joelho', 'ombro', 'cotovelo', 'mao', 'coluna', 'quadril'],
        returns: [
          'Falta de data, mecanismo e contexto do trauma.',
          'Não informar se houve avaliação prévia em urgência ou emergência.',
          'Ausência de limitação funcional, instabilidade, bloqueio, restrição de movimento ou exame físico dirigido.',
          'Exames de imagem incompletos, sem incidências exigidas, laudo ou correlação clínica.',
          'Ressonância solicitada sem investigação prévia ou sem justificar por que o exame avançado é necessário.',
          'Quadro agudo potencialmente cirúrgico inserido em fila eletiva.'
        ],
        history: [
          'Informe lado, localização, mecanismo, data do trauma, evolução da dor e perda funcional.',
          'Descreva impacto no trabalho, marcha, autocuidado e atividades diárias.'
        ],
        examination: [
          'Registre amplitude de movimento, força, estabilidade, deformidade, edema, bloqueio e testes dirigidos quando aplicáveis.'
        ],
        treatment: [
          'Informe analgesia, anti-inflamatórios, imobilização, fisioterapia, infiltração e resposta.'
        ],
        investigations: [
          'Confira radiografias e incidências exigidas no protocolo antes de declarar um exame obrigatório.',
          'Informe laudo, data e resultado dos exames de imagem já realizados.'
        ],
        safety: [
          'Fratura recente, lesão tendínea aguda, déficit neurovascular, infecção articular ou trauma grave não devem aguardar fila eletiva.'
        ]
      },
      {
        id: 'ortopedia-joelho',
        label: 'Ortopedia — joelho',
        matchAny: ['joelho', 'menisco', 'patela', 'ligamento'],
        returns: [
          'Ausência de descrição de instabilidade, bloqueio, crepitação, restrição de movimento e trauma prévio.',
          'Radiografias sem as incidências previstas para o cenário clínico.',
          'Ressonância solicitada sem demonstrar suspeita de lesão meniscal ou ligamentar e investigação prévia.'
        ],
        examination: [
          'Descreva derrame, amplitude, estabilidade ligamentar, bloqueio, crepitação e testes meniscais quando pertinentes.'
        ],
        investigations: [
          'Diferencie radiografia obrigatória de ressonância condicionada à suspeita clínica e ao protocolo.'
        ]
      },
      {
        id: 'cirurgia-vascular',
        label: 'Cirurgia Vascular',
        matchAny: ['cirurgia vascular', 'vascular', 'varizes', 'claudicacao', 'oclusao arterial'],
        returns: [
          'Sintomas vasculares sem confirmação no exame físico.',
          'Varizes descritas sem localização, calibre, edema, alterações de pele, úlcera ou repercussão.',
          'Doppler com oclusão sem esclarecer se o quadro é agudo e se houve avaliação de urgência.',
          'Ausência de tempo de evolução, pulsos e sinais de insuficiência arterial ou venosa.'
        ],
        history: [
          'Descreva dor, peso, queimação, claudicação, edema, piora ortostática, feridas e evolução.'
        ],
        examination: [
          'Registre presença e distribuição de varizes, edema, alterações tróficas, úlceras, temperatura, coloração e pulsos.'
        ],
        investigations: [
          'Informe conclusão do Doppler e correlação com os sintomas e o exame físico.'
        ],
        safety: [
          'Suspeita de isquemia aguda, oclusão arterial aguda, trombose com gravidade ou perda de viabilidade do membro exige fluxo imediato.'
        ]
      },
      {
        id: 'oftalmologia',
        label: 'Oftalmologia',
        matchAny: ['oftalmologia', 'oftalmologico', 'catarata', 'pterigio', 'visao', 'ocular'],
        returns: [
          'Pedido genérico de “avaliação visual” sem queixa, evolução e déficit descritos.',
          'Ausência de tratamentos, medicamentos oculares, lentes corretivas e patologias associadas.',
          'Não diferenciar consulta clínica, indicação cirúrgica e revisão pós-operatória.',
          'Cirurgia anterior sem data, estabelecimento e esclarecimento sobre o objetivo da reavaliação.'
        ],
        history: [
          'Descreva olho acometido, déficit visual, dor, hiperemia, prurido, secreção, fotofobia e evolução.'
        ],
        examination: [
          'Registre acuidade visual ou teste de Snellen quando possível, além de achados oculares pertinentes.'
        ],
        treatment: [
          'Informe colírios, medicamentos oculares, lentes, procedimentos e resposta.'
        ],
        caseDependent: [
          'Revisão cirúrgica deve ser diferenciada de consulta geral e pode exigir contato com o serviço que realizou o procedimento.'
        ],
        safety: [
          'Perda visual súbita, trauma ocular, dor intensa com sinais de gravidade ou suspeita de glaucoma agudo exigem avaliação imediata.'
        ]
      },
      {
        id: 'audiometria-otorrino',
        label: 'Audiometria e Otorrinolaringologia',
        matchAny: ['audiometria', 'impedanciometria', 'otorrino', 'hipoacusia', 'perda auditiva', 'zumbido'],
        returns: [
          'Solicitação apenas para “avaliação auditiva”, sem história clínica e tempo de evolução.',
          'Ausência de otoscopia e sintomas associados.',
          'Falta de impacto funcional, linguagem, aprendizagem ou uso de aparelho auditivo.',
          'Laudos audiológicos anteriores não anexados ou não transcritos.'
        ],
        history: [
          'Descreva lateralidade, início, progressão, zumbido, dor, secreção, tontura e impacto na comunicação.'
        ],
        examination: [
          'Registre otoscopia e outros achados pertinentes.'
        ],
        investigations: [
          'Informe resultados de audiometria, impedanciometria e avaliações anteriores quando já realizadas.'
        ]
      },
      {
        id: 'gastro-endoscopia',
        label: 'Gastroenterologia, endoscopia e colonoscopia',
        matchAny: ['gastroenterologia', 'endoscopia', 'colonoscopia', 'refluxo', 'disfagia', 'constipacao'],
        returns: [
          'Sintomas digestivos pouco caracterizados, sem duração, sinais de alarme e exame físico.',
          'Ausência de tratamento inicial, dose, duração e resposta.',
          'Exames anteriores ou história de H. pylori sem documentação do resultado e tratamento.',
          'Solicitação antiga devolvida apenas para confirmar quadro atual e necessidade.'
        ],
        history: [
          'Descreva dor, refluxo, disfagia, vômitos, sangramento, alteração do hábito intestinal, perda de peso e evolução.'
        ],
        examination: [
          'Registre exame abdominal e achados gerais pertinentes.'
        ],
        treatment: [
          'Informe inibidor de bomba, erradicação de H. pylori, dieta e outras abordagens com duração e resposta.'
        ],
        investigations: [
          'Informe exames laboratoriais, imagem e endoscopias anteriores com data e resultado.'
        ],
        safety: [
          'Sangramento digestivo, instabilidade, abdome agudo, obstrução ou perda ponderal importante com sinais de gravidade exigem avaliação prioritária ou imediata conforme o quadro.'
        ]
      },
      {
        id: 'reumatologia',
        label: 'Reumatologia',
        matchAny: ['reumatologia', 'artrite', 'fibromialgia', 'lupus', 'dor articular'],
        returns: [
          'Não informar articulações acometidas, duração da rigidez matinal e sinais inflamatórios.',
          'Ausência de exame físico articular dirigido.',
          'Exames laboratoriais obrigatórios ou radiografias previstos no protocolo não apresentados.',
          'Tratamento anterior sem dose, duração e resposta.'
        ],
        history: [
          'Informe distribuição articular, padrão da dor, rigidez matinal, edema, sintomas sistêmicos e evolução.'
        ],
        examination: [
          'Registre articulações dolorosas ou edemaciadas, limitação, deformidades e testes dirigidos.'
        ],
        investigations: [
          'Diferencie exames obrigatórios, como os expressamente previstos no protocolo, de exames condicionais como Anti-CCP quando aplicável.'
        ]
      },
      {
        id: 'dermatologia',
        label: 'Dermatologia',
        matchAny: ['dermatologia', 'lesao de pele', 'prurido', 'melanoma', 'nevo'],
        returns: [
          'Ausência de anamnese dermatológica, evolução, sintomas e tratamentos anteriores.',
          'Lesão sem descrição do exame físico, localização e características clínicas.',
          'Fotografia ausente ou sem qualidade quando necessária para o fluxo.',
          'Suspeita oncológica não fundamentada por avaliação médica.'
        ],
        history: [
          'Descreva início, evolução, sintomas, recorrência, exposição, tratamentos e resposta.'
        ],
        examination: [
          'A descrição da lesão elementar, medidas, hipótese e suspeita de câncer deve ser realizada por médico.'
        ],
        investigations: [
          'Quando a única pendência for fotografia, orientar imagem nítida conforme o fluxo, sem deslocamento apenas para fotografar.'
        ],
        safety: [
          'Reações cutâneas graves, anafilaxia, necrose extensa ou outros sinais sistêmicos não devem aguardar fila ambulatorial.'
        ]
      },
      {
        id: 'urologia',
        label: 'Urologia',
        matchAny: ['urologia', 'calculo renal', 'litíase', 'prostata', 'escrotal'],
        returns: [
          'Exame de imagem citado sem dimensões, localização ou repercussão dos cálculos.',
          'Ausência de sintomas urinários, infecção, função renal, tratamentos e evolução.',
          'Doença escrotal sem descrição do exame físico e da ultrassonografia quando aplicável.'
        ],
        history: [
          'Descreva dor, hematúria, infecção, sintomas urinários, retenção, recorrência e evolução.'
        ],
        examination: [
          'Registre exame físico urológico dirigido quando necessário.'
        ],
        investigations: [
          'Informe imagem com localização e dimensões, função renal, urina e urocultura conforme o problema e o protocolo.'
        ],
        safety: [
          'Obstrução com infecção, retenção aguda, torção testicular ou deterioração renal aguda exigem avaliação imediata.'
        ]
      },
      {
        id: 'bucomaxilo',
        label: 'Cirurgia Bucomaxilofacial',
        matchAny: ['buco-maxilo', 'bucomaxilo', 'terceiro molar', 'dente incluso', 'pericoronarite'],
        returns: [
          'Não informar se o terceiro molar está erupcionado, incluso ou semi-incluso.',
          'Ausência de descrição anatômica, recorrência, infecção, limitação e exame de imagem odontológico.'
        ],
        examination: [
          'Descreva elemento dentário, posição, erupção, sinais inflamatórios, abertura bucal e demais achados odontológicos.'
        ],
        investigations: [
          'Apresente radiografia ou outro exame odontológico previsto, com descrição do achado.'
        ]
      },
      {
        id: 'cirurgia-plastica',
        label: 'Cirurgia Plástica',
        matchAny: ['cirurgia plastica', 'plastica', 'fissura palatal', 'reconstrucao'],
        returns: [
          'Suspeita anatômica ou sequela encaminhada sem descrição de exame de imagem ou avaliação prévia.',
          'Motivo clínico incompatível ou pouco relacionado à especialidade solicitada.',
          'Ausência de histórico cirúrgico, local, data, alta e acompanhamento.'
        ],
        history: [
          'Descreva deformidade, sequela, cirurgia prévia, repercussão funcional e objetivo da avaliação.'
        ],
        investigations: [
          'Informe laudos e imagens que sustentem a alteração anatômica quando já realizados.'
        ]
      },
      {
        id: 'pediatria',
        label: 'Pediatria',
        matchAny: ['pediatria geral', 'medico pediatra', 'consulta em pediatria'],
        returns: [
          'Encaminhamento pediátrico sem história perinatal, crescimento, alimentação, sinais vitais e exame físico.',
          'Quadro respiratório ou clínico potencialmente agudo enviado sem demonstrar estabilidade para teleatendimento.',
          'Reencaminhamento para Neuropediatria sem relatório escolar quando exigido.'
        ],
        history: [
          'Informe idade exata, história gestacional e neonatal quando pertinente, alimentação, crescimento, desenvolvimento e evolução do quadro.'
        ],
        examination: [
          'Registre sinais vitais, antropometria e exame físico dirigido ao problema.'
        ],
        safety: [
          'Lactente com desconforto respiratório, alteração de perfusão, febre com sinais de gravidade ou piora importante exige avaliação presencial imediata.'
        ]
      },
      {
        id: 'nutrologia',
        label: 'Nutrologia e Nutrição clínica',
        matchAny: ['nutrologia', 'nutricionista', 'nutricao', 'obesidade'],
        returns: [
          'Pedido de “avaliação e acompanhamento” sem dados antropométricos, comorbidades, hábitos e objetivo clínico.',
          'Ausência de exames metabólicos, tratamentos anteriores e evolução ponderal quando pertinentes.'
        ],
        history: [
          'Descreva evolução do peso, ingestão, restrições, sintomas, comorbidades e repercussão funcional.'
        ],
        examination: [
          'Registre peso, altura, IMC e outros dados antropométricos pertinentes.'
        ],
        investigations: [
          'Informe exames metabólicos e nutricionais conforme a condição clínica e o protocolo.'
        ]
      }
    ]
  };

  window.REFERRAL_PRACTICE_GUIDANCE = guidance;
})();
