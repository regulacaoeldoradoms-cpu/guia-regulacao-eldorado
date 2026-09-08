'use strict';

(() => {
  // Nome do arquivo mantido por compatibilidade. O módulo agora centraliza as
  // orientações condicionais da Recepção para os fluxos DigSaúde/Telessaúde MS.
  const DETAIL_ID = 'receptionDetail';
  const CARD_ID = 'receptionConditionalGuidance';
  const PRINT_BUTTON_ID = 'printReceptionConditionalGuidance';
  const OFFICIAL_SOURCE = 'Protocolo de Acesso aos Serviços de Teleatendimentos do Núcleo de Telessaúde Mato Grosso do Sul — versão 2.0/2025';
  const OPERATIONAL_SOURCE = 'Orientação operacional do DigSaúde MS confirmada em 08/09/2026';

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const rule = (kind, title, text, source = 'official') => ({ kind, title, text, source });

  const GUIDANCE = [
    {
      aliases: ['endocrinologia adulto', 'endocrinologia'],
      label: 'Endocrinologia Adulto',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 18 anos.'),
        rule('etapa-previa', 'LDL igual ou acima de 190 mg/dL', 'Antes do encaminhamento por dislipidemia com LDL ≥ 190 mg/dL, o protocolo orienta excluir hipotireoidismo. Se houver hipotireoidismo, tratar e repetir o LDL após o TSH atingir a meta; encaminhar por esse critério apenas se o LDL ≥ 190 mg/dL persistir.'),
        rule('etapa-previa', 'Obesidade', 'O protocolo contempla pacientes com IMC ≥ 30 kg/m² após falha de tratamento clínico com nutricionista.'),
      ],
    },
    {
      aliases: ['geriatria'],
      label: 'Geriatria',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 60 anos.'),
      ],
    },
    {
      aliases: ['hematologia adulto', 'hematologia'],
      label: 'Hematologia Adulto',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 18 anos.'),
      ],
    },
    {
      aliases: ['infectologia'],
      label: 'Infectologia',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 13 anos. A oferta descrita no protocolo é Teleconsultoria Assíncrona.'),
        rule('seguranca', 'Arboviroses', 'Para dengue, zika, chikungunya e oropouche, o protocolo descreve orientação de manejo clínico para pacientes estáveis e para complicações na fase crônica.'),
        rule('seguranca', 'Endocardite infecciosa', 'O protocolo inclui endocardite infecciosa suspeita ou confirmada em pacientes estáveis. A recepção não define estabilidade; essa avaliação cabe à equipe assistente.'),
      ],
    },
    {
      aliases: ['neurologia adulto', 'neurologia'],
      label: 'Neurologia Adulto',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 18 anos.'),
        rule('nao-encaminhar', 'Síncope ou perda transitória de consciência', 'O protocolo indica Neurologia apenas quando o episódio de alteração de consciência é sugestivo de crise convulsiva. Situações típicas de síncope vasovagal usualmente não necessitam avaliação em serviço especializado.'),
        rule('etapa-previa', 'Vertigem com suspeita de origem central', 'O protocolo prevê encaminhamento após avaliação em serviço de emergência.'),
      ],
    },
    {
      aliases: ['nefrologia adulto', 'nefrologia'],
      label: 'Nefrologia Adulto',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 18 anos.'),
        rule('outro-fluxo', 'Infecção urinária recorrente', 'Para Nefrologia, o protocolo considera ITU recorrente mesmo com profilaxia adequada após exclusão de causas anatômicas urológicas ou ginecológicas. Alteração anatômica do trato urinário que provoque ITU recorrente indica Urologia; alteração anatômica ginecológica indica Ginecologia.'),
      ],
    },
    {
      aliases: ['neuropediatria', 'neurologia pediatrica'],
      label: 'Neuropediatria',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações até 16 anos, 11 meses e 29 dias.'),
        rule('nao-encaminhar', 'Convulsão febril simples', 'No critério de Convulsão/Epilepsia, o protocolo contempla episódios sugestivos de crise convulsiva, exceto quadro de convulsão febril simples.'),
        rule('condicao-atendimento', 'Responsável no teleatendimento', 'O protocolo exige a presença de familiar ou responsável no dia do teleatendimento.'),
      ],
    },
    {
      aliases: ['nutricao', 'nutrologia'],
      label: 'Nutrição',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 3 anos.'),
        rule('nao-encaminhar', 'Condições não contempladas', 'O protocolo não contempla atendimentos para cardiopatas, nefropatas, pacientes bariátricos ou em processo bariátrico, transtornos alimentares como anorexia e bulimia, gestantes, nutrição esportiva para performance de atletas ou amadores e indivíduos em uso de insulinoterapia.'),
      ],
    },
    {
      aliases: ['obstetricia', 'obstetricia alto risco'],
      label: 'Obstetrícia — Alto Risco',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 14 anos.'),
        rule('escopo', 'Escopo da oferta', 'A oferta de Obstetrícia descrita no protocolo é destinada à Gestação de Alto Risco. A recepção não classifica o risco gestacional; a condição deve estar definida pela equipe assistente no encaminhamento.'),
      ],
    },
    {
      aliases: ['ortopedia adulto', 'ortopedia'],
      label: 'Ortopedia Adulto',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 18 anos.'),
        rule('etapa-previa', 'Luxação recorrente do ombro', 'O protocolo contempla luxação recorrente de ombro após avaliação em serviço de emergência.'),
        rule('seguranca', 'Ruptura tendínea', 'Para tornozelo/pé e mão/punho, o protocolo descreve como critério de teleatendimento a ruptura tendínea não operada em caráter emergencial. Situações com necessidade de abordagem imediata não devem ser convertidas pela recepção em fluxo ambulatorial.'),
      ],
    },
    {
      aliases: ['otorrinolaringologia', 'otorrino', 'otorrinolaringologia geral'],
      label: 'Otorrinolaringologia',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 2 anos.'),
        rule('etapa-previa', 'Otite externa maligna', 'O protocolo contempla casos de otite externa maligna após o manejo na emergência.'),
        rule('etapa-previa', 'Hipoacusia ou zumbido', 'Antes do encaminhamento, o protocolo recomenda excluir causas reversíveis, como causas infecciosas ou mecânicas, incluindo cerume obstrutivo.'),
        rule('etapa-previa', 'Disfonia sem causa identificável', 'O protocolo orienta excluir causas como infecções respiratórias agudas, uso excessivo da voz, uso de corticoide inalatório para asma/DPOC e doença do refluxo gastroesofágico.'),
      ],
    },
    {
      aliases: ['pediatria'],
      label: 'Pediatria',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações até 12 anos completos.'),
      ],
    },
    {
      aliases: ['pneumologia adulto', 'pneumologia'],
      label: 'Pneumologia Adulto',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 16 anos.'),
      ],
    },
    {
      aliases: ['psicologia'],
      label: 'Psicologia',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 18 anos.'),
        rule('nao-encaminhar', 'Não encaminhar', 'O protocolo não orienta encaminhar para este teleatendimento: dificuldades de aprendizagem; avaliações psicológicas; casos de cirurgia bariátrica; planejamento familiar; atendimento infantil; Transtorno do Espectro Autista (TEA); deficiência intelectual moderada/grave; alterações comportamentais devido ao uso de substâncias psicoativas; transtornos de personalidade; transtornos mentais graves com risco iminente; e transtornos com sintomas físicos.'),
        rule('regra-operacional', 'TEA/autismo', 'O suporte do DigSaúde MS confirmou que a teleconsulta de Psicologia não aceita pacientes com TEA/autismo. A regra é específica da Psicologia e não deve ser generalizada para outras especialidades.', 'operational'),
      ],
    },
    {
      aliases: ['psiquiatria adulto', 'psiquiatria'],
      label: 'Psiquiatria Adulto',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 18 anos.'),
        rule('regra-operacional', 'Uso de álcool e outras drogas', 'O DigSaúde MS aceita pacientes em uso de álcool ou outras drogas na Psiquiatria quando estão clinicamente estáveis para o teleatendimento. O uso de substâncias, isoladamente, não é motivo de exclusão nem indicação automática de internação. A recepção não avalia estabilidade; essa avaliação cabe à equipe de saúde responsável.', 'operational'),
      ],
    },
    {
      aliases: ['reumatologia adulto', 'reumatologia'],
      label: 'Reumatologia Adulto',
      rules: [
        rule('faixa-etaria', 'Faixa etária', 'Solicitações a partir de 18 anos.'),
      ],
    },
  ];

  function guidanceForSpecialty(title) {
    const value = normalize(title);
    return GUIDANCE.find((entry) => entry.aliases.some((alias) => normalize(alias) === value)) || null;
  }

  function currentSpecialty() {
    return document.querySelector(`#${DETAIL_ID} .reception-title`)?.textContent?.trim() || '';
  }

  function sourceLabel(source) {
    return source === 'operational' ? OPERATIONAL_SOURCE : OFFICIAL_SOURCE;
  }

  function ruleBadge(kind) {
    const labels = {
      'faixa-etaria': 'FAIXA ETÁRIA',
      'nao-encaminhar': 'NÃO ENCAMINHAR',
      'etapa-previa': 'ETAPA PRÉVIA',
      'outro-fluxo': 'OUTRO FLUXO',
      'seguranca': 'SEGURANÇA',
      'condicao-atendimento': 'CONDIÇÃO',
      'escopo': 'ESCOPO',
      'regra-operacional': 'REGRA OPERACIONAL',
    };
    return labels[kind] || 'CONDICIONAL';
  }

  function patientInformationHtml(specialty, guidance) {
    const today = new Intl.DateTimeFormat('pt-BR').format(new Date());
    const heading = 'ORIENTAÇÃO CONDICIONAL — FLUXO DIGSAÚDE MS';
    const rulesHtml = guidance.rules.map((item) => `
      <article class="rule">
        <div class="rule-type">${escapeHtml(ruleBadge(item.kind))}</div>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.text)}</p>
        <small><strong>Fonte:</strong> ${escapeHtml(sourceLabel(item.source))}</small>
      </article>`).join('');

    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(heading)}</title><style>
      @page{size:A4;margin:13mm}*{box-sizing:border-box}body{margin:0;color:#173247;font-family:Arial,Helvetica,sans-serif;background:#fff}.doc{max-width:790px;margin:0 auto}.header{display:flex;align-items:center;gap:15px;padding-bottom:13px;border-bottom:3px solid #b71c1c}.header img{width:68px;height:68px;border-radius:14px;object-fit:contain}.header h1{margin:0 0 5px;color:#7f1717;font-size:18px;line-height:1.22}.header p{margin:0;color:#537087;font-size:12px}.print-help{margin:0 0 14px;padding:10px 12px;border:1px solid #ead89b;border-radius:8px;background:#fff8df;color:#5f4b12;font-size:12px}.meta{margin:18px 0 14px;padding:13px 15px;border:1px solid #ead1d1;border-radius:11px;background:#fff8f8}.meta p{margin:5px 0;font-size:12.5px;line-height:1.45}.intro{margin:14px 0 16px;padding:14px 15px;border-left:4px solid #9b7425;background:#fffaf0;border-radius:9px;font-size:12.5px;line-height:1.55}.rule{margin:12px 0;padding:14px 15px;border:1px solid #e2e9ef;border-left:4px solid #b71c1c;border-radius:9px;background:#fff}.rule-type{display:inline-block;margin-bottom:6px;padding:4px 7px;border-radius:999px;background:#fdeaea;color:#9f2020;font-size:9.5px;font-weight:800;letter-spacing:.06em}.rule h2{margin:0 0 7px;color:#173b58;font-size:13.5px}.rule p{margin:0 0 8px;font-size:12.5px;line-height:1.55}.rule small{display:block;color:#60778a;font-size:10px;line-height:1.4}.warning{margin:18px 0;padding:14px 15px;border-left:4px solid #9b7425;background:#fffaf0;border-radius:9px;font-size:12.5px;line-height:1.55}.footer{margin-top:24px;padding-top:11px;border-top:1px solid #bccbd6;color:#536a7c;font-size:10.5px;line-height:1.5}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.print-help{display:none!important}}
    </style></head><body><main class="doc">
      <div class="print-help">Se a janela de impressão não abrir automaticamente, pressione <strong>Ctrl+P</strong>.</div>
      <header class="header"><img src="${location.origin}/assets/recepcao-icon.png" alt=""><div><h1>${heading}</h1><p>Setor de Regulação de Saúde · Eldorado/MS</p></div></header>
      <section class="meta"><p><strong>Especialidade:</strong> ${escapeHtml(guidance.label || specialty)}</p><p><strong>Data da orientação:</strong> ${today}</p></section>
      <section class="intro"><strong>Importante:</strong> esta folha reúne situações condicionais previstas para esta especialidade. <strong>Ela não afirma que todas se aplicam ao paciente.</strong> A unidade/equipe assistente deve revisar o encaminhamento e definir o fluxo adequado. A recepção apenas entrega a orientação e não realiza avaliação clínica.</section>
      ${rulesHtml}
      <section class="warning"><strong>Sobre situações agudas:</strong> quando o próprio protocolo exigir avaliação de emergência, estabilidade clínica ou abordagem imediata, a definição do quadro e da conduta cabe à equipe de saúde. A recepção não diagnostica, não classifica risco, não interpreta exames e não define estabilidade.</section>
      <footer class="footer"><strong>Setor de Regulação de Saúde</strong><br>Bairro Jardim das Grevílias, Rua Irmã Aristela, nº 836 · Eldorado/MS<br>Atendimento: segunda a sexta-feira, das 07:00 às 11:00.<br><br><strong>Base principal:</strong> ${escapeHtml(OFFICIAL_SOURCE)}. Regras operacionais adicionais aparecem identificadas individualmente.</footer>
    </main></body></html>`;
  }

  function waitForImages(doc, callback) {
    const pending = [...doc.images].filter((img) => !img.complete);
    if (!pending.length) return window.setTimeout(callback, 120);
    let remaining = pending.length;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.setTimeout(callback, 120);
    };
    const done = () => { remaining -= 1; if (remaining <= 0) finish(); };
    pending.forEach((img) => {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
    window.setTimeout(finish, 900);
  }

  function printHtml(html) {
    const popup = window.open('', '_blank');
    if (popup) {
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
      waitForImages(popup.document, () => {
        if (!popup.closed) {
          popup.focus();
          try { popup.print(); } catch (_) {}
        }
      });
      return;
    }

    const frame = document.createElement('iframe');
    Object.assign(frame.style, {
      position: 'fixed', right: '0', bottom: '0', width: '1px', height: '1px',
      border: '0', opacity: '0', pointerEvents: 'none'
    });
    document.body.appendChild(frame);
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc || !frame.contentWindow) {
      frame.remove();
      window.alert('Não foi possível preparar a impressão desta orientação.');
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();
    waitForImages(doc, () => {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      } finally {
        window.setTimeout(() => frame.remove(), 2500);
      }
    });
  }

  function cardSummary(guidance) {
    const clinicalRules = guidance.rules.filter((item) => item.kind !== 'faixa-etaria');
    const ageRule = guidance.rules.find((item) => item.kind === 'faixa-etaria');
    if (!clinicalRules.length && ageRule) {
      return `Esta especialidade possui condição de <strong>faixa etária</strong>. Imprima a orientação se o paciente estiver fora da faixa indicada no protocolo.`;
    }
    const labels = [...new Set(clinicalRules.map((item) => ruleBadge(item.kind).toLowerCase()))];
    const categories = labels.slice(0, 3).join(', ');
    return `Esta especialidade possui orientações condicionais${categories ? ` de <strong>${escapeHtml(categories)}</strong>` : ''}. Imprima somente quando a situação estiver claramente descrita no encaminhamento ou já tiver sido confirmada pela equipe assistente.`;
  }

  function ensureConditionCard() {
    const detail = document.getElementById(DETAIL_ID);
    if (!detail) return;

    const specialty = currentSpecialty();
    const guidance = guidanceForSpecialty(specialty);
    const existing = document.getElementById(CARD_ID);
    if (!guidance) {
      existing?.remove();
      return;
    }

    if (existing?.dataset.specialty === normalize(specialty)) return;
    existing?.remove();

    const card = document.createElement('div');
    card.id = CARD_ID;
    card.dataset.specialty = normalize(specialty);
    card.className = 'portal-note info';
    card.innerHTML = `<strong>Orientações condicionais — ${escapeHtml(guidance.label)}</strong><br><span>${cardSummary(guidance)}</span><br><br><button class="portal-button reception-conditional-print" id="${PRINT_BUTTON_ID}" type="button">Imprimir orientação condicional</button>`;

    const anchor = detail.querySelector('.reception-scope-note');
    if (anchor) anchor.insertAdjacentElement('beforebegin', card);
    else detail.appendChild(card);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest(`#${PRINT_BUTTON_ID}`);
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const specialty = currentSpecialty();
    const guidance = guidanceForSpecialty(specialty);
    if (!guidance) return;
    printHtml(patientInformationHtml(specialty, guidance));
  });

  const detail = document.getElementById(DETAIL_ID);
  if (!detail) return;
  new MutationObserver(() => window.requestAnimationFrame(ensureConditionCard))
    .observe(detail, { childList: true, subtree: true, characterData: true });
  ensureConditionCard();
})();
