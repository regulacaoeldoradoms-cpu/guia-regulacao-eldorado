'use strict';

(() => {
  const root = typeof window === 'object' ? window : globalThis;
  const copyFeedbackTimers = new WeakMap();

  function clean(value) {
    return String(value ?? '')
      .replace(/[\u0000-\u001f\u007f]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalize(value) {
    return clean(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  function formatDate(value) {
    const text = clean(value);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : (text || 'não informada');
  }

  function lowerDetail(value) {
    const text = clean(value).replace(/[.!?;:,\s]+$/g, '');
    return text ? text.toLocaleLowerCase('pt-BR') : '';
  }

  function sentenceDetail(value) {
    return clean(value).replace(/[.!?;:,\s]+$/g, '');
  }

  function intervalFrom(item) {
    const explicitDays = Number(item?.returnDays || 0);
    if (Number.isInteger(explicitDays) && explicitDays > 0 && explicitDays <= 730) {
      return `${explicitDays} ${explicitDays === 1 ? 'dia' : 'dias'}`;
    }

    const text = normalize(item?.resolution);
    const units = [
      { pattern: /\b(\d{1,3})\s+DIAS?\b/, singular: 'dia', plural: 'dias' },
      { pattern: /\b(\d{1,3})\s+SEMANAS?\b/, singular: 'semana', plural: 'semanas' },
      { pattern: /\b(\d{1,2})\s+MES(?:ES)?\b/, singular: 'mês', plural: 'meses' },
      { pattern: /\b(\d{1,2})\s+ANOS?\b/, singular: 'ano', plural: 'anos' }
    ];
    for (const unit of units) {
      const match = text.match(unit.pattern);
      if (!match) continue;
      const amount = Number(match[1]);
      if (Number.isInteger(amount) && amount > 0) return `${amount} ${amount === 1 ? unit.singular : unit.plural}`;
    }
    return '';
  }

  const conditionTypes = Object.freeze([
    'exams',
    'imaging',
    'laboratory',
    'physiotherapy',
    'occupational-therapy',
    'speech-therapy',
    'psychotherapy',
    'rehabilitation',
    'procedure',
    'surgery',
    'postoperative',
    'treatment',
    'medication',
    'clinical-evolution',
    'professional-evaluation',
    'documents',
    'monitoring',
    'hospital-discharge',
    'other'
  ]);

  function conditionFromText(value) {
    const text = normalize(value);
    if (!text) return '';
    if (/\bPOS[- ]?OPERATORI[OA]\b|\bREVISAO POS[- ]?CIRURGICA\b/.test(text)) return 'postoperative';
    if (/\bRESSONANCIA\b|\bTOMOGRAFIA\b|\bULTRASSO(?:M|NOGRAFIA)\b|\bRADIOGRAFIA\b|\bRAIO[ -]?X\b|\bMAMOGRAFIA\b|\bDOPPLER\b|\bENDOSCOPIA\b|\bCOLONOSCOPIA\b|\b(?:RNM|RMN|USG|RX|TC)\b/.test(text)) return 'imaging';
    if (/\bEXAMES? LABORATORIAIS?\b|\bLABS?\b|\bHEMOGRAMA\b|\bGLICEMIA\b|\bHEMOGLOBINA GLICADA\b|\bTSH\b|\bT4 LIVRE\b|\bCREATININA\b|\bUREIA\b/.test(text)) return 'laboratory';
    if (/\bEXAM(?:E|ES)?\b|\bRESULTADOS?\b.*\b(?:EXAME|BIOPSIA|ANATOMOPATOLOGICO)\b|\bANATOMOPATOLOGICO\b/.test(text)) return 'exams';
    if (/\bFISIO(?:TERAPIA)?\b|\bSESSOES? FISIOTERAPICAS?\b/.test(text)) return 'physiotherapy';
    if (/\bTERAPIA OCUPACIONAL\b/.test(text)) return 'occupational-therapy';
    if (/\bFONOAUDIOLOGIA\b|\bFONOTERAPIA\b|\bTERAPIA FONOAUDIOLOGICA\b/.test(text)) return 'speech-therapy';
    if (/\bPSICOTERAPIA\b|\bSESSOES? (?:DE )?PSICOLOGIA\b/.test(text)) return 'psychotherapy';
    if (/\bREABILITACAO\b/.test(text)) return 'rehabilitation';
    if (/\bPROCEDIMENTO\b.{0,15}\bCIRURGIA\b/.test(text)) return 'procedure';
    if (/\bCIRURGIA\b|\bOPERACAO\b|\bPROCEDIMENTO CIRURGICO\b/.test(text)) return 'surgery';
    if (/\bPROCEDIMENTO\b|\bPROC\.?\b|\bINFILTRACAO\b|\bBIOPSIA\b/.test(text)) return 'procedure';
    if (/\bALTA HOSPITALAR\b|\bALTA DA INTERNACAO\b|\bAPOS INTERNACAO\b/.test(text)) return 'hospital-discharge';
    if (/\bMEDICACAO\b|\bMEDICAMENTO\b|\bAJUSTE (?:DA |DE )?DOSE\b|\bTITULACAO\b|\bTROCA (?:DA |DE )?MEDICACAO\b/.test(text)) return 'medication';
    if (/\bTRATAMENTO\b|\bTTO\b|\bTERAPEUTIC[AO]\b|\bPLANO ALIMENTAR\b|\bDIETA\b/.test(text)) return 'treatment';
    if (/\bMELHORA CLINICA\b|\bEVOLUCAO CLINICA\b|\bRESPOSTA CLINICA\b|\bESTABILIZACAO\b|\bCONTROLE (?:DO |DA )?(?:QUADRO|SINTOMAS?)\b|\bCICATRIZACAO\b/.test(text)) return 'clinical-evolution';
    if (/\bAVALIACAO\b.*\b(?:EQUIPE|PROFISSIONAL|ESPECIALIDADE|ESPECIALISTA)\b|\bPARECER\b.*\b(?:EQUIPE|PROFISSIONAL|ESPECIALISTA)\b/.test(text)) return 'professional-evaluation';
    if (/\bLAUDO\b|\bRELATORIO\b|\bDOCUMENTACAO\b|\bDOCUMENTOS?\b|\bATESTADO\b|\bPARECER\b/.test(text)) return 'documents';
    if (/\bPERFIL GLICEMICO\b|\bDIARIO\b|\bREGISTRO\b.*\b(?:PRESSAO|GLICEM|SINTOMAS?)\b|\bMAPA\b|\bHOLTER\b|\bMONITORAMENTO\b/.test(text)) return 'monitoring';
    return '';
  }

  function resolutionIsGeneric(value) {
    const text = normalize(value);
    return !text
      || /^RETORNO PROGRAMADO PARA\b/.test(text)
      || /^ACOMPANHAMENTO SEM DATA DEFINIDA\b/.test(text)
      || /^(?:RETORNO|REAVALIACAO|ACOMPANHAMENTO)$/.test(text);
  }

  function inferredCondition(item) {
    const explicitType = clean(item?.returnConditionType).toLowerCase();
    if (explicitType === 'other') return 'other';
    if (conditionTypes.includes(explicitType)) return explicitType;

    const fromResolution = conditionFromText(item?.resolution);
    if (fromResolution) return fromResolution;
    if (resolutionIsGeneric(item?.resolution)) {
      const notes = normalize(item?.notes);
      if (/\b(?:RET|RETORNO|RETORNAR)\b|\bAPRESENTAR\b|\bAGUARDAR\b|\bAPOS\b|\bAO FINAL\b/.test(notes)) {
        return conditionFromText(item?.notes);
      }
    }
    return '';
  }

  function detailFrom(item) {
    const explicit = lowerDetail(item?.returnConditionDetail);
    if (explicit) return explicit;
    const resolution = clean(item?.resolution);
    const separated = resolution.match(/\s[-–—]\s(.+)$/u);
    return separated ? lowerDetail(separated[1]) : '';
  }

  function appendContext(base, detail, interval) {
    let sentence = base;
    if (detail) sentence += `: ${detail}`;
    if (interval) sentence += `, no prazo de ${interval}`;
    return `${sentence}.`;
  }

  function customConditionFromResolution(resolution) {
    const text = clean(resolution);
    if (!text) return '';
    const match = text.match(/^RET(?:ORNO|ORNAR)?\.?\s+(?:AP[ÓO]S|DEPOIS DE|QUANDO|AO FINAL DE|PARA)\s+(.+)$/iu);
    if (!match) return '';
    return lowerDetail(match[1].replace(/\s[-–—]\s.*$/u, ''));
  }

  function conditionDetailFor(item, category, inferredDetail) {
    const explicit = detailFrom(item);
    if (explicit) return explicit;
    if (!inferredDetail) return '';
    const value = normalize(inferredDetail);
    const generic = {
      exams: /^(?:APRESENTAR )?EXAMES?(?: SOLICITADOS?)?$/,
      imaging: /^(?:APRESENTAR )?(?:O )?(?:RESULTADO D[OE] )?EXAMES? DE IMAGEM(?: SOLICITADOS?)?$/,
      laboratory: /^(?:APRESENTAR )?(?:(?:OS )?(?:RESULTADOS D[OE]S? )?EXAMES? LABORATORIAIS?(?: SOLICITADOS?)?|LABS?)$/,
      physiotherapy: /^(?:CONCLUSAO D[AE] |FINAL D[AE] )?(?:SESSOES? DE )?FISIO(?:TERAPIA)?$/,
      'occupational-therapy': /^(?:CONCLUSAO D[AE] |FINAL D[AE] )?(?:SESSOES? DE )?TERAPIA OCUPACIONAL$/,
      'speech-therapy': /^(?:CONCLUSAO D[AE] |FINAL D[AE] )?(?:SESSOES? DE )?(?:FONOAUDIOLOGIA|FONOTERAPIA)$/,
      psychotherapy: /^(?:CONCLUSAO D[AE] |FINAL D[AE] )?(?:SESSOES? DE )?PSICOTERAPIA$/,
      rehabilitation: /^(?:CONCLUSAO D[AE] |FINAL D[AE] )?(?:PERIODO DE )?REABILITACAO$/,
      procedure: /^(?:REALIZACAO D[OE] )?PROCEDIMENTO(?: OU CIRURGIA)?(?: INDICAD[AO])?$/,
      surgery: /^(?:REALIZACAO D[AE] )?CIRURGIA(?: INDICADA)?$/,
      postoperative: /^(?:REAVALIACAO )?POS[- ]?OPERATORI[OA]$/,
      treatment: /^(?:(?:CONCLUSAO D[OE] |FINAL D[OE] )?TRATAMENTO(?: INDICADO)?|TTO)$/,
      medication: /^(?:USO|AJUSTE|TROCA) D[AE] MEDICACAO(?: INDICADA)?$/,
      documents: /^(?:APRESENTAR )?(?:LAUDO|RELATORIO|DOCUMENTOS?|DOCUMENTACAO)$/,
      monitoring: /^(?:APRESENTAR )?(?:REGISTROS? DE )?MONITORAMENTO$/,
      'hospital-discharge': /^(?:ALTA (?:HOSPITALAR|DA INTERNACAO)|INTERNACAO)$/
    }[category];
    return generic?.test(value) ? '' : inferredDetail;
  }

  function operationalCategory(item) {
    const fragments = [normalize(item?.resolution), normalize(item?.notes)].filter(Boolean);
    const text = fragments.join(' ');
    const matchesFragment = (pattern) => fragments.some((fragment) => pattern.test(fragment));
    if (!text) return '';

    if (/\bFALTOU (?:SEM|S\/) JUSTIFIC|\bN(?:AO)? COMPARECEU\b.{0,30}\b(?:SEM|S\/) JUSTIFIC|\bAUSENCIA N(?:AO)? JUSTIFIC/.test(text)) return 'absence-unjustified';
    if (/\bFALTA JUSTIFIC|\bAUSENCIA JUSTIFIC|\bNAO COMPARECEU\b.{0,30}\bCOM JUSTIFIC/.test(text)) return 'absence-justified';
    if (/\b(?:ESPECIALISTA|ESPECIALIDADE|ESPEC|MEDIC[OA]|PROFISSIONAL|PROF|TELECONSULTOR)\b.{0,50}\b(?:CANCELOU|CANCELAD[AO]|CANCELAMENTO|AUSENTE|N(?:AO)? COMPARECEU)\b|\b(?:CANCELAD[AO]|CANCELAMENTO)\b.{0,50}\b(?:PELO|PELA)\b.{0,20}\b(?:ESPECIALISTA|ESPECIALIDADE|ESPEC|MEDIC[OA]|PROFISSIONAL|PROF|SERVICO)\b/.test(text)) return 'specialist-cancellation';
    if (/\b(?:PACIENTE|PCT|PAC)\b.{0,50}\b(?:PEDIU|SOLICITOU)\b.{0,20}\b(?:REMARC|REAGEND)|\b(?:PACIENTE|PCT|PAC)\b.{0,50}\bCANCELOU\b|\bCANCELAMENTO\b.{0,30}\bA PEDIDO D[OA] PACIENTE\b/.test(text)) return 'patient-reschedule';
    if (/\b(?:PACIENTE|PCT|PAC)\b.{0,50}\b(?:N(?:AO)? COMPARECEU|FALTOU|AUSENTE)\b|\b(?:N(?:AO)? COMPARECEU|FALTOU|AUSENTE)\b.{0,50}\b(?:PACIENTE|PCT|PAC)\b|\bFALTA DO PACIENTE\b|\bN(?:AO)? COMPARECEU\b|\bFALTOU\b/.test(text)) return 'absence';
    if (/\b(?:FALHA|ERRO|INDISPONIBILIDADE|INSTABILIDADE)\b.{0,35}\b(?:SISTEMA|PLATAFORMA|APLICATIVO)\b|\b(?:SISTEMA|PLATAFORMA|APLICATIVO)\b.{0,35}\b(?:FALHOU|ERRO|INDISPONIVEL|INSTAVEL)\b/.test(text)) return 'system-failure';
    if (/\b(?:FALHA|PROBLEMA|QUEDA|SEM)\b.{0,30}\b(?:CONEXAO|INTERNET|SINAL|AUDIO|VIDEO)\b|\bCONEXAO\b.{0,25}\b(?:FALHOU|CAIU|INTERROMPIDA)\b/.test(text)) return 'connection-failure';
    if (/\b(?:CONSULTA|TELECONSULTA|ATENDIMENTO)\b.{0,35}\b(?:NAO CONCLUID[AO]|INCOMPLET[AO]|INTERROMPID[AO]|NAO REALIZAD[AO])\b|\bSOLICITAR NOVAMENTE\b.{0,40}\bNAO CONCLUID[AO]\b/.test(text)) return 'incomplete-appointment';
    if (matchesFragment(/\b(?:SOLICITACAO|PEDIDO|RETORNO)\b.{0,40}\bDEVOLVID[AO]\b|\bDEVOLVID[AO]\b.{0,40}\b(?:SOLICITACAO|PEDIDO|RETORNO)\b/)) return 'request-returned';
    if (matchesFragment(/\b(?:SOLICITACAO|PEDIDO|RETORNO)\b.{0,40}\b(?:INDEFERID[AO]|NEGAD[AO]|RECUSAD[AO]|REJEITAD[AO])\b|\b(?:INDEFERID[AO]|NEGAD[AO]|RECUSAD[AO]|REJEITAD[AO])\b.{0,40}\b(?:SOLICITACAO|PEDIDO|RETORNO)\b/)) return 'request-denied';
    if (matchesFragment(/\b(?:SOLICITACAO|PEDIDO|RETORNO)\b.{0,40}\bCANCELAD[AO]\b|\bCANCELAD[AO]\b.{0,40}\b(?:SOLICITACAO|PEDIDO|RETORNO)\b/)) return 'request-cancelled';
    if (matchesFragment(/\b(?:SOLICITACAO|PEDIDO|RETORNO)\b.{0,40}\b(?:EXPIRAD[AO]|VENCID[AO]|PERDEU A VALIDADE)\b|\b(?:EXPIRAD[AO]|VENCID[AO])\b.{0,40}\b(?:SOLICITACAO|PEDIDO|RETORNO)\b/)) return 'request-expired';
    if (/\b(?:PACIENTE|PCT)\b.{0,50}\bESQUECEU\b.{0,30}\bSOLICIT|\bNAO SOLICITOU\b.{0,30}\b(?:NO PRAZO|A TEMPO)|\bPERDEU (?:O )?PRAZO\b/.test(text)) return 'request-not-made';
    if (/\bPERDEU (?:O )?SEGUIMENTO\b|\bPERDA DE SEGUIMENTO\b|\bABANDONO DE ACOMPANHAMENTO\b/.test(text)) return 'lost-followup';
    if (/\b(?:NAO FOI POSSIVEL|SEM SUCESSO)\b.{0,35}\b(?:CONTATO|LOCALIZAR)\b|\b(?:PACIENTE|PCT)\b.{0,30}\b(?:INCOMUNICAVEL|NAO LOCALIZAD[AO])\b/.test(text)) return 'patient-unreachable';
    if (/\b(?:CONSULTA|TELECONSULTA|ATENDIMENTO) (?:CANCELAD[AO]|SUSPENS[AO])\b|\bCANCELAMENTO D[OA] (?:CONSULTA|TELECONSULTA|ATENDIMENTO)\b/.test(text)) return 'service-cancellation';
    if (/\bREAGEND|\bREMARC|\bSOLICITAR NOVAMENTE\b|\bNOVA SOLICITACAO\b|\bNOVO RETORNO\b/.test(text)) return 'reschedule';
    return '';
  }

  function operationalReason(category, interval = '') {
    const reasons = {
      'absence-unjustified': 'Nova solicitação de retorno devido à ausência não justificada do paciente no atendimento anterior.',
      'absence-justified': 'Nova solicitação de retorno devido à ausência justificada do paciente no atendimento anterior.',
      'absence': 'Nova solicitação de retorno devido ao não comparecimento do paciente no atendimento anterior.',
      'patient-reschedule': 'Nova solicitação de retorno para reagendamento, conforme pedido do paciente.',
      'specialist-cancellation': 'Nova solicitação de retorno devido ao cancelamento ou à indisponibilidade do especialista no atendimento anterior.',
      'service-cancellation': 'Nova solicitação de retorno devido ao cancelamento do atendimento anterior pelo serviço responsável.',
      'system-failure': 'Nova solicitação de retorno porque o atendimento anterior foi prejudicado por falha do sistema.',
      'connection-failure': 'Nova solicitação de retorno porque o teleatendimento anterior foi prejudicado por falha de conexão.',
      'incomplete-appointment': 'Nova solicitação de retorno porque o teleatendimento anterior não foi concluído.',
      'request-returned': 'Nova solicitação de retorno porque a solicitação anterior foi devolvida.',
      'request-denied': 'Nova solicitação de retorno porque a solicitação anterior foi indeferida.',
      'request-cancelled': 'Nova solicitação de retorno porque a solicitação anterior foi cancelada.',
      'request-expired': 'Nova solicitação de retorno porque a solicitação anterior perdeu a validade.',
      'request-not-made': 'Nova solicitação de retorno porque o pedido anterior não foi realizado dentro do prazo previsto.',
      'lost-followup': 'Nova solicitação de retorno para restabelecer o acompanhamento após perda de seguimento.',
      'patient-unreachable': 'Nova solicitação de retorno após o restabelecimento do contato com o paciente.',
      'reschedule': 'Nova solicitação de retorno para reagendamento do atendimento, conforme o registro operacional.'
    };
    const reason = reasons[category] || '';
    return reason && interval ? `${reason} O retorno foi indicado pela especialidade após ${interval}.` : reason;
  }

  function conditionReason(category, detail, interval) {
    const bases = {
      exams: 'Retorno solicitado para apresentar os exames solicitados',
      imaging: 'Retorno solicitado para apresentar o resultado do exame de imagem solicitado',
      laboratory: 'Retorno solicitado para apresentar os resultados dos exames laboratoriais solicitados',
      physiotherapy: 'Retorno solicitado após a conclusão das sessões de fisioterapia',
      'occupational-therapy': 'Retorno solicitado após a conclusão das sessões de terapia ocupacional',
      'speech-therapy': 'Retorno solicitado após a conclusão das sessões de fonoaudiologia',
      psychotherapy: 'Retorno solicitado após o período de acompanhamento em psicoterapia',
      rehabilitation: 'Retorno solicitado após a conclusão do período de reabilitação indicado',
      procedure: 'Retorno solicitado após a realização do procedimento indicado',
      surgery: 'Retorno solicitado após a realização da cirurgia indicada',
      postoperative: 'Retorno solicitado para reavaliação pós-operatória',
      treatment: 'Retorno solicitado após a conclusão do tratamento indicado',
      medication: 'Retorno solicitado após o período de uso ou ajuste da medicação indicada',
      'clinical-evolution': 'Retorno solicitado para reavaliação da evolução clínica',
      'professional-evaluation': 'Retorno solicitado após a avaliação da equipe, profissional ou especialidade indicada',
      documents: 'Retorno solicitado para apresentar o laudo, relatório ou documento solicitado',
      monitoring: 'Retorno solicitado para apresentar os registros de monitoramento solicitados',
      'hospital-discharge': 'Retorno solicitado após a alta hospitalar'
    };
    if (category === 'other') {
      if (!detail) return '';
      return `Retorno solicitado após ${detail}${interval ? `, no prazo de ${interval}` : ''}.`;
    }
    if (detail && ['clinical-evolution', 'professional-evaluation', 'hospital-discharge'].includes(category)) {
      return `Retorno solicitado após ${detail}${interval ? `, no prazo de ${interval}` : ''}.`;
    }
    if (category === 'procedure') {
      const base = detail
        ? 'Retorno solicitado após a realização do procedimento indicado'
        : 'Retorno solicitado após a realização do procedimento ou cirurgia indicada';
      return appendContext(base, detail, interval);
    }
    const base = bases[category];
    return base ? appendContext(base, detail, interval) : '';
  }

  function fallbackContext(item) {
    const resolution = sentenceDetail(item?.resolution);
    if (resolution && !resolutionIsGeneric(resolution)) return resolution;
    const notes = sentenceDetail(item?.notes);
    if (/\b(?:RET|RETORNO|RETORNAR|SOLICITAR|REAGENDAR|REMARCAR)\b/i.test(notes)) return notes;
    return '';
  }

  function reasonFor(item) {
    const resolution = normalize(item?.resolution);
    const interval = intervalFrom(item);
    const operation = operationalCategory(item);
    if (operation) return operationalReason(operation, interval);

    const condition = inferredCondition(item);
    const inferredDetail = customConditionFromResolution(item?.resolution)
      || (resolutionIsGeneric(item?.resolution) ? customConditionFromResolution(item?.notes) : '');
    const detail = conditionDetailFor(item, condition, inferredDetail);
    const byCondition = conditionReason(condition, detail, interval);
    if (byCondition) return byCondition;
    if (/\bRETORNO SE NECESSARIO\b/.test(resolution)) {
      return 'Retorno solicitado pela especialidade conforme necessidade clínica registrada.';
    }
    if (interval) return `Retorno solicitado pela especialidade após ${interval}.`;

    const customCondition = inferredDetail;
    if (customCondition) return `Retorno solicitado após ${customCondition}.`;
    const recordedContext = fallbackContext(item);
    if (resolutionIsGeneric(item?.resolution) && recordedContext) {
      return `Retorno solicitado conforme a conduta registrada na última consulta: ${recordedContext}.`;
    }
    if (/\bACOMPANHAMENTO\b/.test(resolution)) {
      return 'Retorno solicitado pela especialidade para continuidade do acompanhamento.';
    }
    if (recordedContext) {
      return `Retorno solicitado conforme a conduta registrada na última consulta: ${recordedContext}.`;
    }
    if (/^RETORNO PROGRAMADO PARA\b/.test(resolution)) {
      return 'Retorno solicitado pela especialidade para reavaliação na data indicada.';
    }
    return 'Retorno solicitado pela especialidade para continuidade do acompanhamento na data prevista.';
  }

  function build(item) {
    return `Data da última consulta: ${formatDate(item?.lastConsultationDate)}. ${reasonFor(item)} Previsão de retorno: ${formatDate(item?.returnDueDate)}.`;
  }

  function isAvailable(item) {
    return item?.active !== false
      && !item?.requestedAt
      && item?.requestedHistorical !== true
      && ['SOLICITAR', 'ATRASADO'].includes(clean(item?.status).toUpperCase());
  }

  async function write(text) {
    const clipboard = root.navigator?.clipboard;
    if (clipboard?.writeText) {
      try {
        await clipboard.writeText(text);
        return;
      } catch (_) {}
    }

    const documentRef = root.document;
    if (!documentRef?.body || typeof documentRef.execCommand !== 'function') {
      throw new Error('A cópia não está disponível neste navegador.');
    }
    const textarea = documentRef.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.setAttribute('aria-hidden', 'true');
    textarea.style.position = 'fixed';
    textarea.style.inset = '-9999px auto auto -9999px';
    documentRef.body.appendChild(textarea);
    let copied = false;
    try {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      copied = documentRef.execCommand('copy');
    } finally {
      textarea.remove();
    }
    if (!copied) throw new Error('Não foi possível copiar a justificativa.');
  }

  function restoreButton(button) {
    if (!button?.isConnected) return;
    button.textContent = button.dataset.copyLabel || 'Copiar motivo';
    button.setAttribute('aria-label', button.dataset.copyAriaLabel || 'Copiar justificativa da solicitação');
    button.classList.remove('is-copied', 'is-copy-error');
  }

  async function copyFromButton(button, item) {
    if (!button || !isAvailable(item)) return false;
    const existingTimer = copyFeedbackTimers.get(button);
    if (existingTimer) root.clearTimeout(existingTimer);
    if (!button.dataset.copyLabel) button.dataset.copyLabel = clean(button.textContent) || 'Copiar motivo';
    if (!button.dataset.copyAriaLabel) button.dataset.copyAriaLabel = button.getAttribute('aria-label') || 'Copiar justificativa da solicitação';

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.classList.remove('is-copied', 'is-copy-error');
    button.textContent = 'Copiando…';
    try {
      await write(build(item));
      button.textContent = 'Copiado';
      button.setAttribute('aria-label', 'Justificativa copiada');
      button.classList.add('is-copied');
      root.PortalInteractions?.notify?.('copy', 'Justificativa copiada.', button);
      return true;
    } catch (_) {
      button.textContent = 'Tente novamente';
      button.setAttribute('aria-label', 'Não foi possível copiar; tente novamente');
      button.classList.add('is-copy-error');
      root.PortalInteractions?.notify?.('error', 'Não foi possível copiar a justificativa.', button);
      return false;
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      const timer = root.setTimeout(() => restoreButton(button), 2400);
      copyFeedbackTimers.set(button, timer);
    }
  }

  root.TelemedicineJustification = Object.freeze({
    build,
    conditionFromText,
    formatDate,
    intervalFrom,
    isAvailable,
    operationalCategory,
    reasonFor,
    copyFromButton
  });
})();
