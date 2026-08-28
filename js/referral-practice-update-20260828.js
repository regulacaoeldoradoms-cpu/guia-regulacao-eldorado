'use strict';

(() => {
  const guidance = window.REFERRAL_PRACTICE_GUIDANCE;
  if (!guidance || guidance.__operationalUpdate20260828PsychologyAutism) return;

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

  guidance.version = '1.7';
  guidance.updatedAt = '28/08/2026';
  guidance.methodology.scope = 'Síntese qualitativa e anonimizada das devoluções regulatórias previamente estudadas, acrescida de atualização operacional confirmada pelo suporte do DigSaúde MS em 28/08/2026.';
  guidance.methodology.sourceLabel = 'Camada prática não normativa e operacional: estudo anonimizado de devoluções reais, complementado por confirmação do suporte DigSaúde MS em 28/08/2026.';
  guidance.methodology.studyHistory = appendUnique(guidance.methodology.studyHistory, [
    'Atualização operacional de 28/08/2026 - suporte DigSaúde MS confirmou que a teleconsulta de Psicologia não aceita pacientes com TEA/autismo.'
  ]);

  guidance.methodology.responsePolicy = appendUnique(guidance.methodology.responsePolicy, [
    'Ao responder se o DigSaúde aceita autismo, distinguir a especialidade: Psicologia via teleconsulta não aceita pacientes com TEA/autismo, mas essa restrição não deve ser generalizada para todo o DigSaúde.',
    'Para demanda de atendimento psicológico de paciente com TEA/autismo, orientar o fluxo psicológico municipal/local aplicável. Não sugerir relançamento automático no SISREG ou encaminhamento para outro município sem confirmar referência e pactuação.',
    'Quando a pergunta for factual sobre esta restrição operacional, responder diretamente antes de iniciar qualquer entrevista clínica.'
  ]);

  extendProfile('psicologia-digsus-tea', 'Psicologia no DigSaúde - restrição para TEA/autismo', [
    'psicologia', 'psicologo'
  ], {
    returns: [
      'Solicitação de Psicologia via DigSaúde MS para paciente com TEA/autismo está fora dos critérios operacionais informados pelo suporte do sistema.'
    ],
    caseDependent: [
      'A restrição para TEA/autismo é específica da teleconsulta de Psicologia. Não concluir que Neuropediatria, Psiquiatria ou todas as demais especialidades do DigSaúde tenham a mesma exclusão.',
      'Psicologia continua disponível no DigSaúde para outros critérios de inclusão da especialidade; não marcar toda a oferta como indisponível.'
    ],
    professionalOnly: [
      'O diagnóstico ou a confirmação de TEA e a escolha clínica de outra especialidade permanecem atribuições de profissional habilitado.'
    ]
  });

  Object.defineProperty(guidance, '__operationalUpdate20260828PsychologyAutism', {
    value: true,
    enumerable: false
  });
})();
