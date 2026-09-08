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

  guidance.version = '1.9';
  guidance.updatedAt = '08/09/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de atualizações operacionais confirmadas pelo DigSaúde MS. Em 08/09/2026 foi corrigida a regra de saúde mental para uso de álcool e outras drogas: Psiquiatria aceita pacientes clinicamente estáveis; a restrição permanece para Psicologia quando a demanda estiver relacionada a substâncias.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa e operacional: estudo anonimizado de devoluções reais, complementado por confirmações operacionais do DigSaúde MS.';
  guidance.methodology.studyHistory = appendUnique(guidance.methodology.studyHistory, [
    'Correção operacional de 08/09/2026 - após nova conferência com o suporte do DigSaúde MS, ficou confirmado que a teleconsulta de Psiquiatria aceita pacientes em uso de álcool ou outras drogas quando clinicamente estáveis. A restrição de teleatendimento por alterações relacionadas a substâncias permanece para Psicologia.'
  ]);

  guidance.methodology.responsePolicy = appendUnique(guidance.methodology.responsePolicy, [
    'Para Psicologia via DigSaúde MS, manter a orientação de que demandas relacionadas ao uso de álcool ou outras drogas não são elegíveis para essa teleconsulta.',
    'Para Psiquiatria via DigSaúde MS, não tratar o uso de álcool ou outras drogas como motivo de inelegibilidade quando o paciente estiver clinicamente estável. O suporte confirmou em 08/09/2026 que esses pacientes podem ser atendidos pela especialidade.',
    'A estabilidade para teleatendimento é condição clínica e de segurança e deve ser avaliada pela equipe profissional responsável; não cabe à recepção concluir estabilidade, risco ou necessidade de internação.',
    'Intoxicação ou abstinência grave, agitação grave, risco de auto ou heteroagressão, alteração importante do estado de consciência ou outra situação aguda não devem aguardar teleconsulta ambulatorial e exigem avaliação pelo fluxo de urgência apropriado.',
    'Não transformar uso de substâncias, isoladamente, em indicação de internação hospitalar.'
  ]);

  extendProfile('psicologia-digsaude-alcool-drogas', 'Psicologia no DigSaúde - uso de álcool e outras drogas', [
    'psicologia'
  ], {
    returns: [
      'Psicologia via DigSaúde MS não deve ser solicitada quando a demanda estiver relacionada ao uso de álcool ou outras drogas, inclusive alterações decorrentes de substâncias, conforme os critérios vigentes da especialidade.'
    ],
    caseDependent: [
      'Não generalizar essa restrição da Psicologia para a Psiquiatria ou para outras especialidades do DigSaúde MS.',
      'Histórico remoto de uso de substâncias sem relação com a demanda psicológica atual não deve ser tratado automaticamente como a mesma situação sem avaliação do caso.'
    ],
    safety: [
      'Situações agudas relacionadas a intoxicação, abstinência, agitação ou risco exigem avaliação imediata pelo fluxo assistencial adequado.'
    ]
  });

  extendProfile('psiquiatria-digsaude-substancias-estavel', 'Psiquiatria no DigSaúde - uso de substâncias com estabilidade clínica', [
    'psiquiatria'
  ], {
    returns: [
      'Não considerar o uso de álcool ou outras drogas, por si só, como motivo para recusar ou devolver solicitação de Psiquiatria via DigSaúde MS quando o paciente estiver clinicamente estável.'
    ],
    caseDependent: [
      'Psiquiatria via DigSaúde MS aceita pacientes em uso de álcool ou outras drogas desde que estejam clinicamente estáveis para o teleatendimento.',
      'A condição de estabilidade é relevante para a segurança do atendimento e do profissional que acompanha o paciente durante a teleconsulta.'
    ],
    safety: [
      'Intoxicação ou abstinência grave, agitação grave, risco de auto ou heteroagressão, alteração importante do estado de consciência ou outra situação aguda exige avaliação imediata e não deve aguardar teleconsulta ambulatorial.',
      'Uso de substâncias, isoladamente, não constitui indicação de internação hospitalar.'
    ],
    professionalOnly: [
      'A avaliação de estabilidade clínica, risco, diagnóstico e eventual necessidade de internação permanece atribuição da equipe profissional habilitada.'
    ]
  });

  Object.defineProperty(guidance, '__operationalUpdate20260908SubstanceUse', {
    value: true,
    enumerable: false
  });
})();
