'use strict';

(() => {
  const guidance = window.REFERRAL_PRACTICE_GUIDANCE;
  if (!guidance || guidance.__studyUpdate20260804Batch2) return;

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

  guidance.version = '1.2';
  guidance.updatedAt = '04/08/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de dois complementos analisados em 04/08/2026. O segundo complemento reúne 20 documentos, sem dados identificáveis de pacientes ou profissionais.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa: estudo operacional anonimizado de devoluções reais — lotes 1 a 10 e dois complementos analisados em 04/08/2026, abrangendo casos de 2022 a 2026.';
  guidance.methodology.studyHistory = appendUnique(guidance.methodology.studyHistory, [
    'Complemento 1 — 13 documentos analisados em 04/08/2026.',
    'Complemento 2 — 20 documentos analisados em 04/08/2026.'
  ]);
  guidance.methodology.responsePolicy = appendUnique(guidance.methodology.responsePolicy, [
    'Ao responder, separar sempre que necessário: Protocolo oficial; Prática regulatória observada; Informação que exige avaliação profissional; Alerta de segurança.',
    'Uma resposta à devolução deve enfrentar diretamente cada pergunta do regulador. Repetir a finalidade genérica do pedido ou informar apenas que o paciente está em tratamento não resolve a pendência.',
    'Quando houver inconsistência de idade, procedimento, CID, especialidade ou narrativa, apontar a divergência e orientar conferência humana antes de reenviar.'
  ]);

  guidance.universal.returns = appendUnique(guidance.universal.returns, [
    'Exame solicitado sem correspondência entre a estrutura que se pretende avaliar e a modalidade escolhida.',
    'Pedido que não diferencia consulta diagnóstica, seguimento clínico, revisão pós-operatória, procedimento ou cirurgia.',
    'Resposta ao regulador que não enfrenta a pendência: declarar apenas “consulta geral”, “em tratamento em outro município” ou “necessita do procedimento” sem fornecer os dados solicitados.',
    'Diagnóstico ou rótulo clínico usado no lugar da descrição objetiva do achado, da evolução e do exame físico.',
    'Dados demográficos ou clínicos internamente contraditórios, como idade incompatível com o cadastro.',
    'Indicação de sedação, ambiente hospitalar ou atendimento especial sem justificativa clínica ou comportamental documentada.'
  ]);
  guidance.universal.history = appendUnique(guidance.universal.history, [
    'Explique qual problema clínico motivou o exame e qual decisão dependerá do resultado.',
    'Quando o pedido envolver procedimento ou cirurgia, informe se já houve consulta especializada, qual foi a indicação e qual etapa assistencial está sendo solicitada.',
    'Em reenvio, responda item por item ao motivo da devolução e atualize apenas os dados que realmente mudaram.'
  ]);
  guidance.universal.examination = appendUnique(guidance.universal.examination, [
    'Expressões como “exame normal”, “sem alterações” ou “NDN” não substituem a descrição dos achados dirigidos que o regulador precisa para classificar o caso.'
  ]);
  guidance.universal.investigations = appendUnique(guidance.universal.investigations, [
    'Informe os valores efetivos dos exames laboratoriais alterados, unidades quando disponíveis, data e conclusão clínica pertinente.',
    'Escolha o exame de imagem pela pergunta clínica e pela estrutura anatômica a ser avaliada; não use exame amplo quando a suspeita exige modalidade dirigida.',
    'Antes de exame avançado, descreva investigação inicial e exame de imagem anterior quando cobrados pelo protocolo ou pela devolução.'
  ]);
  guidance.universal.caseDependent = appendUnique(guidance.universal.caseDependent, [
    'Sedação e atendimento hospitalar dependem de indicação profissional individualizada; extensão do tratamento, por si só, não explica necessariamente por que o atendimento convencional é inviável.',
    'Exames pedidos em uma devolução específica, como beta-hCG, ultrassonografia prévia ou testes laboratoriais, devem ser apresentados como prática observada até confirmação no protocolo aplicável.',
    'Solicitação antiga já classificada pode ser devolvida apenas para atualização; não concluir que a indicação original estava errada nem prometer preservação da classificação anterior.'
  ]);

  extendProfile('dermatologia', 'Dermatologia', ['dermatologia', 'lesao de pele', 'verruga'], {
    returns: [
      'Uso de um diagnóstico presumido, como “verruga”, sem descrição morfológica suficiente para confirmar que a lesão é compatível.',
      'Lesão descrita sem quantidade, tamanho, localização precisa, tempo de evolução, sintomas e tratamento prévio.',
      'Reenvio para Dermatologia quando a etapa necessária já é excisão, exérese ou pequena cirurgia, sem definir corretamente o procedimento.'
    ],
    examination: [
      'A descrição de lesão elementar, medidas, hipótese diagnóstica e suspeita de malignidade exige avaliação profissional; fotografia nítida pode complementar, mas não substitui o exame.'
    ],
    caseDependent: [
      'Diferencie avaliação clínica dermatológica de cirurgia ambulatorial. Se o especialista já indicou retirada da lesão, confira o grupo de procedimento e o fluxo correspondente.'
    ]
  });

  extendProfile('ultrassonografia-abdome', 'Ultrassonografia de abdome', ['ultrassonografia de abdomen total', 'ultrassonografia de abdome total', 'usg abdome', 'exames hepaticos', 'figado'], {
    returns: [
      'Exames hepáticos descritos apenas como “alterados” ou “significativamente alterados”, sem resultados, datas ou padrão da alteração.',
      'Ausência de quadro clínico abdominal e exame físico dirigido, impedindo classificar risco e prioridade.',
      'Ultrassonografia de abdome total solicitada para suspeita focal de hérnia sem confirmar se a modalidade adequada seria exame de partes moles.'
    ],
    history: [
      'Descreva sintomas abdominais, duração, evolução e sinais associados que sustentem a investigação solicitada.'
    ],
    examination: [
      'Registre exame físico abdominal pertinente; esse dado exige avaliação profissional.'
    ],
    investigations: [
      'Transcreva os resultados dos exames hepáticos que motivaram o pedido, com data e valores efetivos.',
      'Confirme se a pergunta clínica é avaliação de vísceras abdominais ou de uma alteração superficial/localizada, como suspeita de hérnia.'
    ]
  });

  extendProfile('cirurgia-geral', 'Cirurgia Geral', ['cirurgia geral', 'biopsia', 'pequena cirurgia', 'exerese', 'hernia inguinal'], {
    returns: [
      'Solicitação antiga previamente aceita devolvida para reavaliação do quadro atual, exames recentes e tratamentos instituídos.',
      'Pedido de biópsia ou procedimento sem atualização da lesão, sinais de infecção, evolução e necessidade atual após longo tempo de espera.',
      'Confusão entre consulta cirúrgica, biópsia, exérese e exame de imagem.'
    ],
    history: [
      'Em lesão crônica ou massa, atualize localização, evolução, secreção, dor, sinais inflamatórios, alterações recentes e repercussão.'
    ],
    investigations: [
      'Informe exames atuais e tratamentos, incluindo medicamentos e doses, quando a solicitação estiver sendo reavaliada após longo período.'
    ],
    caseDependent: [
      'A atualização por tempo de fila não invalida automaticamente a indicação original; confirme se a necessidade permanece e se o destino ainda é o mesmo.'
    ]
  });

  extendProfile('odontologia-hospitalar', 'Odontologia hospitalar e paciente com necessidade especial', ['odontologia paciente com necessidade especial', 'odontologia hospitalar', 'sedacao odontologica', 'odontopediatria'], {
    returns: [
      'Uso do procedimento destinado a paciente com necessidade especial sem informar qual é a condição especial.',
      'Indicação de sedação hospitalar sem explicar por que a criança ou adulto não consegue receber tratamento odontológico convencional.',
      'Descrição apenas da quantidade de cáries, extrações ou reabilitação, sem justificativa individualizada para sedação ou ambiente hospitalar.'
    ],
    history: [
      'Descreva tentativas de atendimento convencional, comportamento e cooperação, condições clínicas relevantes e o motivo objetivo pelo qual o tratamento ambulatorial não é viável.'
    ],
    examination: [
      'A indicação de sedação e de atendimento hospitalar deve ser fundamentada por profissional habilitado.'
    ],
    caseDependent: [
      'Necessidade de múltiplos procedimentos não equivale automaticamente a paciente com necessidade especial; confira o código e o fluxo mais compatíveis.'
    ]
  });

  extendProfile('psiquiatria', 'Psiquiatria', ['psiquiatria', 'esquizofrenia', 'agressividade', 'alteracao mental'], {
    returns: [
      'Diagnóstico psiquiátrico antigo e lista parcial de medicamentos sem descrição do estado atual e sem confirmação de estabilidade para fila eletiva.',
      'Agressividade, fala desconexa ou risco potencial descritos sem avaliação atual de risco, estado mental e suporte disponível.',
      'Regime medicamentoso incompleto, com frequência, dose de apresentação ou intervalo de medicamento injetável ausentes.'
    ],
    history: [
      'Atualize sintomas psicóticos, comportamento, sono, funcionalidade, adesão, uso de substâncias, suporte sociofamiliar e mudanças recentes.'
    ],
    examination: [
      'Quando solicitado, o exame do estado mental deve abordar consciência, cognição, orientação, atenção, memória, aparência, juízo crítico, pensamento, linguagem, sensopercepção, humor/afeto e psicomotricidade; exige profissional habilitado.'
    ],
    treatment: [
      'Registre cada psicofármaco com dose, quantidade, horários, via, intervalo de aplicação, duração, adesão, resposta e efeitos adversos.'
    ],
    safety: [
      'Risco atual para si ou terceiros, psicose descompensada, agitação ou agressividade não devem aguardar vaga ambulatorial.',
      'Vulnerabilidade social ou ausência de suporte não substituem a avaliação clínica, mas podem aumentar a necessidade de resposta assistencial imediata.'
    ]
  });

  extendProfile('reumatologia', 'Reumatologia', ['reumatologia', 'artrite reumatoide'], {
    returns: [
      'Diagnóstico anterior de artrite reumatoide e abandono de tratamento sem descrição da atividade clínica atual.',
      'Medicamentos prévios citados sem doses, duração, motivo da interrupção, adesão ou resposta.',
      'Ausência de exame articular dirigido e exames complementares relacionados ao quadro atual.'
    ],
    history: [
      'Informe articulações acometidas, rigidez, edema, dor, limitação, evolução e repercussão funcional atuais.'
    ],
    treatment: [
      'Registre tratamento prévio e atual com dose, duração, resposta e motivo relatado para abandono ou interrupção.'
    ]
  });

  extendProfile('exames-mamarios', 'Exames mamários', ['ultrassonografia de mamas', 'ultrassonografia mamaria', 'nodulo mamario', 'dor mamaria'], {
    returns: [
      'Dor e nódulo mamário informados sem exame físico das mamas.',
      'Pedido de imagem sem localização, lateralidade ou descrição profissional dos achados palpáveis.'
    ],
    examination: [
      'Descreva inspeção e palpação dirigidas, localização do achado, lateralidade e outros sinais pertinentes; exame físico mamário exige profissional habilitado.'
    ]
  });

  extendProfile('oftalmologia', 'Oftalmologia', ['oftalmologia', 'catarata', 'pterigio'], {
    returns: [
      'Responder apenas “necessita Oftalmologia Geral” sem informar data e local da cirurgia, seguimento pós-operatório e existência de alta.',
      'Pós-operatório com perda visual sem diferenciar revisão do procedimento anterior de nova avaliação clínica.',
      'Pterígio encaminhado sem definir se a finalidade é consulta/avaliação ou cirurgia.',
      'Idade descrita na história clínica incompatível com a idade do cadastro.'
    ],
    history: [
      'Em cirurgia ocular anterior, informe data aproximada, estabelecimento, seguimento, alta e início da nova queixa.'
    ],
    caseDependent: [
      'Revisão pós-operatória deve ser diferenciada de Oftalmologia Geral; quando for revisão, confira o retorno ao serviço executante.',
      'Antes de reenviar, corrija divergências entre idade cadastral e idade registrada na observação.'
    ]
  });

  extendProfile('ginecologia-exames', 'Ginecologia e exames pélvicos', ['ginecologia', 'ultrassonografia pelvica', 'ressonancia de pelvis', 'endometriose', 'amenorreia'], {
    returns: [
      'Ressonância de pelve solicitada por suspeita de endometriose sem exame físico dirigido e sem ultrassonografia prévia informada.',
      'Amenorreia encaminhada para ultrassonografia sem exame físico e sem resultado de beta-hCG na devolução analisada.',
      'Expressão genérica “exame sem alterações” sem descrição suficiente para apoiar a classificação regulatória.'
    ],
    history: [
      'Descreva padrão menstrual, duração da amenorreia ou sangramento, dor, evolução e sintomas associados.'
    ],
    examination: [
      'O exame físico ginecológico e a interpretação dos achados devem ser realizados e registrados por profissional habilitado.'
    ],
    investigations: [
      'Em suspeita de endometriose, informe ultrassonografia prévia quando realizada ou quando exigida na devolução antes da ressonância.',
      'Em amenorreia, beta-hCG foi solicitado no caso analisado; apresentar como prática observada e conferir o protocolo aplicável.'
    ]
  });

  extendProfile('colonoscopia-gastro', 'Colonoscopia e Gastroenterologia', ['colonoscopia', 'gastroenterologia', 'hemorragia digestiva baixa', 'sangramento intestinal'], {
    returns: [
      'Hemorragia digestiva baixa descrita apenas como recorrente, sem quadro clínico completo, duração, exames ou tratamento.',
      'Ausência de elementos que permitam diferenciar investigação eletiva de sangramento com necessidade de avaliação imediata.'
    ],
    history: [
      'Caracterize o sangramento, frequência, duração, evolução, sintomas associados e repercussão clínica.'
    ],
    investigations: [
      'Informe exames já realizados e resultados, além do tratamento instituído e da resposta.'
    ],
    safety: [
      'Sangramento ativo importante, instabilidade ou piora grave não devem aguardar colonoscopia eletiva.'
    ]
  });

  extendProfile('cardiologia', 'Cardiologia', ['cardiologia', 'hipertensao', 'infarto', 'revascularizacao'], {
    returns: [
      'Histórico de infarto ou revascularização sem resultados de exames cardiológicos recentes.',
      'Pressão descrita como instável, alta ou baixa sem valores, frequência dos episódios, sintomas associados e tratamento completo.',
      'Indicação relevante de acompanhamento que ainda não permite priorização por falta de laudos atuais.'
    ],
    history: [
      'Em hipertensão de difícil controle, informe valores ou registros disponíveis, padrão das oscilações, sintomas e tempo de evolução.'
    ],
    investigations: [
      'Em seguimento após evento cardiovascular ou cirurgia, informe exames cardiológicos recentes, datas e laudos quando disponíveis.'
    ]
  });

  extendProfile('pneumologia', 'Pneumologia', ['pneumologia', 'dpoc', 'bronquite cronica', 'dispneia'], {
    returns: [
      'Solicitação antiga devolvida para confirmar necessidade atual e atualizar frequência e duração dos sintomas, limitações e medicamentos.',
      'História respiratória remota sem descrição do estado funcional e tratamento atuais.'
    ],
    history: [
      'Atualize dispneia, frequência das crises, duração, internações, infecções recentes, limitação para atividades e evolução desde a solicitação original.'
    ],
    treatment: [
      'Liste medicações respiratórias atuais com dose, frequência, adesão e resposta.'
    ],
    caseDependent: [
      'Classificação de risco antiga pode ser revista quando o quadro é atualizado; não presumir que a prioridade original será mantida.'
    ]
  });

  extendProfile('endocrinologia', 'Endocrinologia', ['endocrinologia', 'bocio multinodular', 'tireoide'], {
    returns: [
      'Nódulo ou bócio com ultrassonografia descrita, mas sem TSH e T4 livre com datas quando cobrados pelo regulador.',
      'Reenvio informando apenas que o paciente está em tratamento em outro município, sem responder aos exames solicitados nem esclarecer se ainda necessita da fila.'
    ],
    investigations: [
      'Em doença nodular da tireoide, registre TSH, T4 livre e data quando previstos no protocolo ou solicitados na devolução; transcreva também a conclusão ultrassonográfica pertinente.'
    ],
    caseDependent: [
      'Se o paciente está em acompanhamento em outro município, confirme se ainda necessita da solicitação local e responda separadamente às pendências clínicas registradas.'
    ]
  });

  guidance.__studyUpdate20260804Batch2 = true;
})();
