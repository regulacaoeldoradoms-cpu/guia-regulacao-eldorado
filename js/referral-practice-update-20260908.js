'use strict';

(() => {
  const guidance = window.REFERRAL_PRACTICE_GUIDANCE;
  if (!guidance || guidance.__operationalUpdate20260908SubstanceUse) return;

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

  const ensureProfile = (id, label, matchAny) => {
    let profile = guidance.profiles.find((item) => item.id === id);
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

  guidance.version = '1.8';
  guidance.updatedAt = '08/09/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de atualizações operacionais confirmadas pelo DigSaúde MS, incluindo a regra de saúde mental para uso de álcool e outras drogas registrada em 08/09/2026.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa e operacional: estudo anonimizado de devoluções reais, complementado por confirmações operacionais do DigSaúde MS.';
  guidance.methodology.studyHistory = appendUnique(guidance.methodology.studyHistory, [
    'Atualização operacional de 08/09/2026 - orientação do DigSaúde MS informa que teleconsultas de Psicologia e Psiquiatria não recebem pacientes cuja demanda esteja relacionada ao uso de álcool ou outras drogas, inclusive em reabilitação, por critérios operacionais de segurança do atendimento.'
  ]);

  guidance.methodology.responsePolicy = appendUnique(guidance.methodology.responsePolicy, [
    'Para demanda relacionada ao uso de álcool ou outras drogas, inclusive em reabilitação, informar que Psicologia e Psiquiatria via teleconsulta do DigSaúde MS não são o fluxo operacional aceito atualmente.',
    'Na Psiquiatria, explicitar a divergência: o protocolo formal de Teleatendimentos 2025 lista transtornos por uso de substâncias entre as condições atendidas, porém a orientação operacional confirmada do serviço é mais restritiva e prevalece para o fluxo local enquanto vigente.',
    'Não transformar ausência de fluxo ambulatorial disponível em indicação de internação. Regulação hospitalar depende de indicação clínica real, como intoxicação ou abstinência grave, agitação grave, risco de auto ou heteroagressão ou outra situação aguda que exija cuidado hospitalar.',
    'Quando o paciente estiver estável, orientar que a equipe assistente reorganize o seguimento pela rede de saúde mental e pelos fluxos disponíveis, sem inventar referência ambulatorial não confirmada.'
  ]);

  extendProfile('saude-mental-digsaude-alcool-drogas', 'Saúde mental no DigSaúde - uso de álcool e outras drogas', [
    'psicologia', 'psiquiatria'
  ], {
    returns: [
      'Teleconsulta de Psicologia ou Psiquiatria pelo DigSaúde MS não deve ser solicitada quando a demanda estiver relacionada ao uso de álcool ou outras drogas, inclusive em reabilitação, conforme orientação operacional vigente do serviço.'
    ],
    caseDependent: [
      'Esta é uma regra operacional confirmada e mais restritiva que o texto formal da Psiquiatria no protocolo de Teleatendimentos 2025; apresentar a divergência sem reescrever o protocolo oficial.',
      'Não generalizar a restrição para outras especialidades nem para situações em que exista apenas histórico remoto de uso sem relação com a demanda atual.'
    ],
    safety: [
      'Intoxicação ou abstinência grave, agitação grave, risco de auto ou heteroagressão e outras situações agudas exigem avaliação imediata pelo fluxo de urgência adequado.',
      'A inexistência de um fluxo ambulatorial disponível na Regulação não constitui, isoladamente, indicação de internação hospitalar.'
    ],
    professionalOnly: [
      'A necessidade de internação, o diagnóstico de transtorno por uso de substâncias e a definição do fluxo clínico permanecem atribuições da equipe profissional habilitada.'
    ]
  });

  Object.defineProperty(guidance, '__operationalUpdate20260908SubstanceUse', {
    value: true,
    enumerable: false
  });
})();
