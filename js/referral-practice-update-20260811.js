'use strict';

(() => {
  const guidance = window.REFERRAL_PRACTICE_GUIDANCE;
  if (!guidance || guidance.__studyUpdate20260811Batch6) return;

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

  guidance.version = '1.6';
  guidance.updatedAt = '11/08/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de um sexto complemento analisado em 11/08/2026. O novo lote reúne 5 documentos com motivo regulatório explícito.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa: estudo operacional anonimizado de devoluções reais - lotes 1 a 10 e seis complementos analisados entre 04/08/2026 e 11/08/2026.';
  guidance.methodology.studyHistory = appendUnique(guidance.methodology.studyHistory, [
    'Complemento 6 - 5 documentos analisados em 11/08/2026, todos com motivo regulatório explícito.'
  ]);

  guidance.methodology.responsePolicy = appendUnique(guidance.methodology.responsePolicy, [
    'Antes de listar pendências, identificar o que já está suficientemente informado e qual foi a justificativa regulatória mais recente. Se a devolução atual pedir apenas um item, não recriar pendências já resolvidas.',
    'Quando a resposta do solicitante usar expressão ambígua e o regulador tiver pedido uma escolha objetiva entre dois fluxos, explicar que a ambiguidade permanece e orientar a definir explicitamente uma das opções.',
    'Distinguir critério de elegibilidade do protocolo, conteúdo obrigatório do encaminhamento e exame obrigatório. Um caso pode ter descrição clínica suficiente e ainda não demonstrar o critério de elegibilidade da especialidade.',
    'Em Endocrinologia, não escolher automaticamente um subprotocolo apenas pelo diagnóstico histórico. Primeiro identificar a condição endócrina atual que fundamenta o encaminhamento e então conferir os exames obrigatórios daquele subprotocolo.',
    'Quando uma devolução genérica mandar verificar o protocolo e anexar exames atualizados, usar o protocolo oficial para apontar os exames obrigatórios da condição pertinente, deixando claro o que é obrigatório, condicional e não aplicável.',
    'Em quadro potencialmente grave descrito no encaminhamento, não limitar a resposta à burocracia da devolução: sinalizar que a gravidade e a possibilidade de aguardar fila eletiva exigem avaliação profissional atual.'
  ]);

  guidance.universal.returns = appendUnique(guidance.universal.returns, [
    'Encaminhamento já bem estruturado devolvido por uma única exigência documental específica; o erro é ampliar a pendência e pedir novamente tudo o que já consta.',
    'Resposta ao regulador aparentemente completa, mas que mantém ambiguidade sobre o procedimento realmente desejado, como consulta clínica versus cirurgia.',
    'Encaminhamento para Endocrinologia com diagnóstico histórico amplo, porém sem deixar claro qual condição atual do protocolo fundamenta a consulta e sem anexar os exames obrigatórios correspondentes.',
    'Obesidade com IMC elevado encaminhada ao especialista sem demonstrar no texto a tentativa terapêutica prévia exigida pelo protocolo, além de faltar a bateria de exames obrigatórios.'
  ]);

  guidance.universal.history = appendUnique(guidance.universal.history, [
    'Quando o protocolo exigir tentativa terapêutica prévia, informar profissional ou estratégia utilizada, duração, adesão, resposta e motivo de falha antes do encaminhamento.',
    'Quando houver diagnóstico antigo ou síndrome congênita, diferenciar histórico remoto, condição endócrina atual, complicações presentes e objetivo concreto da avaliação especializada.'
  ]);

  guidance.universal.investigations = appendUnique(guidance.universal.investigations, [
    'Em devolução por exames atualizados, não responder apenas que os exames foram solicitados: anexar ou registrar resultados recentes conforme a lista do subprotocolo aplicável.',
    'Quando um item documental já foi apresentado, não pedir novamente salvo se a devolução mais recente indicar que está ausente, desatualizado ou inadequado.'
  ]);

  guidance.universal.caseDependent = appendUnique(guidance.universal.caseDependent, [
    'Uma exigência de relatório escolar em criança pequena deve ser tratada como pendência expressa daquele caso e confrontada com a situação escolar real; não inventar documento nem declarar dispensa sem decisão do fluxo responsável.',
    'A expressão avaliação cirúrgica não é necessariamente equivalente ao procedimento cirurgia de catarata quando o regulador pede escolha explícita entre Oftalmologia Geral e cirurgia.',
    'Perda visual progressiva associada a evento tóxico ou outra condição potencialmente grave requer avaliação profissional da urgência; a devolução administrativa não comprova que seja seguro aguardar a fila.'
  ]);

  extendProfile('batch6-neuropediatria-relatorio', 'Neuropediatria - relatório escolar e pendência específica', [
    'neurologia pediatrica', 'neuropediatria', 'tea', 'autismo', 'atraso da fala', 'atraso de linguagem', 'm-chat', 'estereotipia'
  ], {
    returns: [
      'Criança pequena com atraso de fala, estereotipias e instrumento de rastreio já informado, devolvida especificamente pela ausência de relatório escolar atualizado.',
      'Encaminhamento com vários elementos clínicos presentes em que a pendência atual é documental e pontual, não uma falta geral de história.'
    ],
    history: [
      'Reconheça os dados já presentes, como idade, atraso de fala, estereotipias, instrumento aplicado e acompanhamento fonoaudiológico, antes de apontar o que falta.'
    ],
    investigations: [
      'Se o regulador exigir relatório escolar atualizado, orientar anexação do documento correspondente. Se a criança não frequenta escola ou creche, registrar essa situação e submeter a não aplicabilidade à conferência do fluxo, sem inventar relatório.'
    ],
    patientReportable: [
      'Responsável pode informar se a criança frequenta creche ou escola, qual instituição, desde quando e se existe relatório recente.'
    ],
    professionalOnly: [
      'Diagnóstico de TEA, interpretação de instrumento de rastreio, exame neurológico e definição da especialidade permanecem atribuições profissionais.'
    ],
    caseDependent: [
      'Neste caso, o regulador apontou somente relatório escolar atualizado como pendência. Não acrescentar outras exigências práticas se não houver respaldo no protocolo ou nova justificativa.'
    ]
  });

  extendProfile('batch6-endocrinologia-protocolo', 'Endocrinologia - enquadramento clínico e exames obrigatórios', [
    'endocrinologia', 'obesidade', 'hipopituitarismo', 'deficiencia hormonal', 'hormonio do crescimento', 'gh', 'sindrome congenita'
  ], {
    returns: [
      'Encaminhamento por síndrome congênita e deficiência hormonal com história remota, mas sem exames atualizados e sem definição suficientemente clara da condição endócrina atual que será regulada.',
      'Obesidade grave com IMC e comorbidade descritos, porém sem informar tentativa de tratamento clínico prévio exigida pelo protocolo e sem anexar exames obrigatórios atualizados.',
      'Devolução genérica que orienta revisar o protocolo porque o encaminhamento deve trazer história, evolução, complicações, tratamentos prévios, terapêutica medicamentosa e os exames obrigatórios.'
    ],
    history: [
      'Em síndrome congênita ou deficiência hormonal antiga, descreva diagnóstico confirmado ou hipótese atual, tratamentos hormonais prévios, período de uso, motivo da suspensão, sintomas e complicações atuais e objetivo específico da consulta.',
      'Em obesidade, registrar peso, altura, IMC, evolução ponderal, comorbidades e tentativa prévia de tratamento clínico, incluindo acompanhamento nutricional quando exigido pelo protocolo.'
    ],
    treatment: [
      'Informar terapias hormonais ou metabólicas prévias e atuais com nome, dose, duração, resposta e motivo de interrupção quando conhecido.',
      'Em obesidade, informar medidas não farmacológicas, acompanhamento nutricional, duração e resposta antes de caracterizar falha terapêutica.'
    ],
    investigations: [
      'A partir da condição endócrina definida, consultar a lista oficial de exames obrigatórios e anexar resultados atualizados; não usar uma bateria genérica igual para toda Endocrinologia.',
      'Em obesidade, conferir no protocolo oficial os exames obrigatórios e os condicionais, incluindo os itens adicionais relacionados a comorbidades quando aplicáveis.'
    ],
    professionalOnly: [
      'Enquadramento em hipopituitarismo, deficiência de GH, outra endocrinopatia ou obesidade secundária, interpretação de exames e definição terapêutica exigem avaliação médica.'
    ],
    caseDependent: [
      'Não inferir hipopituitarismo apenas pela expressão deficiência de fator de crescimento. O médico deve definir a hipótese ou diagnóstico atual e o motivo regulatório da consulta.',
      'A recomendação de emagrecimento feita por outra especialidade não substitui, por si só, o critério de elegibilidade da Endocrinologia quando o protocolo exige falha de tratamento clínico prévio.'
    ]
  });

  extendProfile('batch6-oftalmo-fluxo', 'Oftalmologia - consulta, cirurgia e qualificação clínica', [
    'oftalmologia', 'catarata', 'cirurgia de catarata', 'acuidade visual', 'campo visual', 'snellen', 'deficit visual'
  ], {
    returns: [
      'Pedido de Oftalmologia Geral por catarata devolvido para definir se a intenção é avaliação clínica ou cirurgia de catarata.',
      'Após complementação extensa do quadro, a nova devolução permaneceu exclusivamente porque a frase avaliação cirúrgica não respondeu de forma inequívoca qual fluxo deveria ser solicitado.',
      'Perda visual bilateral progressiva descrita com causa associada, mas sem exame ocular dirigido, tratamentos, lentes, comorbidades e Snellen quando possível.'
    ],
    history: [
      'Informar lateralidade, início, progressão, déficit visual percebido, fotofobia, prurido, dor, sintomas associados, patologias oculares prévias e repercussão funcional.',
      'Quando houver catarata já diagnosticada, esclarecer a finalidade atual: consulta oftalmológica geral para avaliação clínica ou encaminhamento para o fluxo específico de cirurgia, conforme decisão médica e disponibilidade do sistema.'
    ],
    treatment: [
      'Informar colírios ou outros medicamentos oculares, uso de lentes corretivas, tempo de uso, tratamentos prévios e resposta.'
    ],
    investigations: [
      'Registrar Snellen quando possível e identificar quem realizou. Se não for possível, documentar o motivo.',
      'Incluir exames oftalmológicos prévios e laudo particular quando disponíveis, sem tratar diagnóstico verbal como substituto de dados clínicos atuais.'
    ],
    patientReportable: [
      'Paciente pode relatar início, progressão da dificuldade visual, uso de óculos ou lentes, colírios, diabetes, hipertensão, tratamentos e limitações percebidas.'
    ],
    professionalOnly: [
      'Acuidade visual medida, exame ocular, hipótese etiológica, indicação cirúrgica, interpretação de exposição tóxica e decisão sobre urgência exigem profissional habilitado.'
    ],
    safety: [
      'Perda visual progressiva ou importante, especialmente associada a intoxicação ou outra condição potencialmente grave, deve gerar alerta para avaliação profissional da gravidade e da segurança de aguardar fila eletiva.'
    ],
    caseDependent: [
      'Se a devolução mais recente perguntar apenas consulta geral versus cirurgia de catarata, essa é a pendência atual; não reapresentar como faltantes os dados clínicos já complementados salvo nova exigência.',
      'Não presumir que a expressão avaliação cirúrgica define automaticamente o procedimento correto no SISREG; a solicitação deve identificar explicitamente o fluxo desejado conforme decisão do médico.'
    ]
  });

  Object.defineProperty(guidance, '__studyUpdate20260811Batch6', {
    value: true,
    enumerable: false
  });
})();
