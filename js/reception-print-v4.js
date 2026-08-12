'use strict';

(() => {
  const DATA_SOURCE = 'https://raw.githubusercontent.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/3c09e13f343ddb4995910d02b349fb164dc08256/index.html';
  const DETAIL_ID = 'receptionDetail';
  const COMPLETE_BUTTON_ID = 'printCompleteOrientation';
  const MISSING_BUTTON_ID = 'printMissingItems';
  let protocolsPromise = null;
  let ensureQueued = false;

  const arr = (value) => Array.isArray(value) ? value : (value ? [value] : []);
  const norm = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const clean = (value) => String(value || '').replace(/^[-•✔\s]+/, '').replace(/\s+/g, ' ').trim();
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function unique(values) {
    const seen = new Set();
    return arr(values).flat().map(clean).filter(Boolean).filter((item) => {
      const key = norm(item).replace(/[^a-z0-9]+/g, ' ').trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function extractProtocolArray(source) {
    const start = source.indexOf('const PROTOCOLOS');
    if (start < 0) throw new Error('Base de protocolos não localizada.');
    const arrayStart = source.indexOf('[', start);
    const endings = ['];\n  const FOOTER_IMG', '];\r\n  const FOOTER_IMG', '];\nconst FOOTER_IMG', '];\r\nconst FOOTER_IMG'];
    let arrayEnd = -1;
    for (const ending of endings) {
      const position = source.indexOf(ending, arrayStart);
      if (position >= 0 && (arrayEnd < 0 || position < arrayEnd)) arrayEnd = position;
    }
    if (arrayEnd < 0) throw new Error('Final da base de protocolos não localizado.');
    return source.slice(arrayStart, arrayEnd + 1);
  }

  function displayName(protocol) {
    const text = norm(`${protocol?.id || ''} ${protocol?.nome || ''}`);
    return text.includes('neurologia pediatrica') || text.includes('neuroped') ? 'Neuropediatria' : (protocol?.nome || 'Solicitação regulada');
  }

  function loadProtocols() {
    if (!protocolsPromise) {
      protocolsPromise = fetch(`${DATA_SOURCE}?patient-orientation=4.0`, { cache: 'no-store' })
        .then((response) => {
          if (!response.ok) throw new Error(`Falha ao carregar protocolos (${response.status}).`);
          return response.text();
        })
        .then((source) => JSON.parse(extractProtocolArray(source)));
    }
    return protocolsPromise;
  }

  function currentRows() {
    return [...document.querySelectorAll(`#${DETAIL_ID} .reception-item`)].map((row) => ({
      type: row.dataset.type || 'mandatory',
      item: clean(row.dataset.item || row.querySelector('.reception-item-text')?.childNodes?.[0]?.textContent || ''),
      state: row.querySelector('.reception-status')?.value || 'pending',
      checked: Boolean(row.querySelector('.fast-check input')?.checked)
    })).filter((row) => row.item);
  }

  async function currentProtocolContext() {
    const protocols = await loadProtocols();
    const activeButton = document.querySelector('#receptionProtocolList button.active');
    const activeId = activeButton?.dataset.id || '';
    const title = document.querySelector(`#${DETAIL_ID} .reception-title`)?.textContent?.trim() || '';
    let protocol = protocols.find((item) => String(item.id || displayName(item)) === activeId);
    if (!protocol) protocol = protocols.find((item) => norm(displayName(item)) === norm(title));
    if (!protocol) throw new Error('Não foi possível identificar o protocolo selecionado para montar a orientação completa.');

    const select = document.getElementById('receptionSubprotocol');
    const selectedIndex = select ? Number(select.value) : -1;
    const subprotocol = Number.isInteger(selectedIndex) && selectedIndex >= 0 ? arr(protocol.subprotocolos)[selectedIndex] || null : null;
    return { protocol, subprotocol };
  }

  function officialData(protocol, subprotocol) {
    return {
      criteria: unique([arr(protocol.quandoSolicitar), arr(subprotocol?.quando)]),
      clinical: unique([arr(protocol.informacoesObrigatorias), arr(subprotocol?.obrigatorias)]),
      mandatoryExams: unique([arr(protocol.examesObrigatorios), arr(subprotocol?.examesObrigatorios)]),
      conditionalExams: unique([arr(protocol.examesCondicionais), arr(subprotocol?.condicionais)]),
      complementary: unique([arr(protocol.complementares), arr(subprotocol?.complementares)]),
      priority: unique(protocol.ajudaPriorizacao),
      alerts: unique(protocol.alertas)
    };
  }

  function profileMatches(profile, protocol) {
    const text = norm([protocol.id, protocol.nome, protocol.categoria, protocol.resumo, ...arr(protocol.tags)].join(' '));
    return arr(profile.matchAny).some((term) => text.includes(norm(term)))
      && !arr(profile.excludeAny).some((term) => text.includes(norm(term)));
  }

  function practicalData(protocol) {
    const data = window.REFERRAL_PRACTICE_GUIDANCE;
    if (!data) return null;
    const profiles = arr(data.profiles).filter((profile) => profileMatches(profile, protocol));
    const profileField = (field) => unique(profiles.flatMap((profile) => arr(profile[field])));
    const universal = data.universal || {};

    const core = unique([
      arr(universal.history).slice(0, 4),
      arr(universal.treatment).slice(0, 3),
      arr(universal.investigations).slice(0, 3)
    ]);

    return {
      labels: unique(profiles.map((profile) => profile.label)),
      core,
      specific: unique([
        profileField('history'),
        profileField('examination'),
        profileField('treatment'),
        profileField('investigations')
      ]),
      patientReportable: unique([arr(universal.patientReportable), profileField('patientReportable')]),
      professionalOnly: unique([arr(universal.professionalOnly), profileField('professionalOnly')]),
      updatedAt: data.updatedAt || '',
      sourceLabel: data.methodology?.sourceLabel || 'Estudo operacional anonimizado de devoluções regulatórias reais.'
    };
  }

  function listHtml(items) {
    if (!items?.length) return '';
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function sectionHtml(title, items, note = '', className = '') {
    if (!items?.length) return '';
    return `<section class="section ${className}"><h2>${escapeHtml(title)}</h2>${note ? `<p class="section-note">${escapeHtml(note)}</p>` : ''}${listHtml(items)}</section>`;
  }

  function practiceHtml(practice) {
    if (!practice) return '';
    const practicalPoints = unique([practice.core, practice.specific]);
    if (!practicalPoints.length && !practice.patientReportable.length && !practice.professionalOnly.length) return '';
    const profileText = practice.labels.length ? ` Áreas relacionadas identificadas no estudo: ${practice.labels.join(', ')}.` : '';
    return `
      <section class="practice-box">
        <h2>Pontos observados nas devoluções reais</h2>
        <p class="practice-warning"><strong>Importante:</strong> estes pontos vêm do estudo prático anonimizado de devoluções e ajudam a qualificar o encaminhamento. Eles não transformam uma exigência isolada em requisito oficial e devem ser aplicados somente quando fizerem sentido para o caso.${escapeHtml(profileText)}</p>
        ${practicalPoints.length ? `<h3>Para reduzir risco de nova devolução</h3>${listHtml(practicalPoints)}` : ''}
        ${practice.patientReportable.length ? `<h3>Informações que o paciente ou responsável pode relatar</h3>${listHtml(practice.patientReportable)}` : ''}
        ${practice.professionalOnly.length ? `<h3>Informações que exigem avaliação profissional</h3>${listHtml(practice.professionalOnly)}` : ''}
      </section>`;
  }

  function printableHtml(protocol, subprotocol, rows, fullMode) {
    const official = officialData(protocol, subprotocol);
    const practice = practicalData(protocol);
    const missing = rows.filter((row) => row.state === 'missing');
    const today = new Intl.DateTimeFormat('pt-BR').format(new Date());
    const heading = fullMode ? 'ORIENTAÇÃO COMPLETA PARA SOLICITAÇÃO' : 'ORIENTAÇÃO PARA COMPLEMENTAÇÃO';
    const sources = unique(protocol.fontes).join(' · ') || 'Base protocolar cadastrada no Guia Médico de Encaminhamentos Regulados.';

    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(heading)}</title>
  <style>
    @page { size: A4; margin: 13mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #173247; font-family: Arial, Helvetica, sans-serif; background: #fff; }
    .doc { max-width: 790px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 15px; padding-bottom: 13px; border-bottom: 3px solid #0f7881; }
    .header img { width: 68px; height: 68px; border-radius: 14px; object-fit: contain; }
    .header h1 { margin: 0 0 5px; color: #0d3157; font-size: 19px; line-height: 1.2; }
    .header p { margin: 0; color: #537087; font-size: 12px; }
    .print-help { margin: 0 0 14px; padding: 10px 12px; border: 1px solid #ead89b; border-radius: 8px; background: #fff8df; color: #5f4b12; font-size: 12px; }
    .meta { margin: 17px 0 14px; padding: 13px 15px; border: 1px solid #d5e3ed; border-radius: 11px; background: #f7fbfd; }
    .meta p { margin: 4px 0; font-size: 12px; line-height: 1.45; }
    .intro { margin: 14px 0 18px; padding: 13px 14px; border-left: 4px solid #0f7881; background: #f2fbfb; border-radius: 8px; font-size: 12px; line-height: 1.55; }
    .section { break-inside: avoid; margin: 18px 0 0; }
    .section h2, .practice-box h2 { margin: 0 0 7px; color: #0d3157; font-size: 15px; }
    .section-note { margin: 0 0 7px; color: #657c8d; font-size: 11px; line-height: 1.45; }
    ul { margin: 0; padding-left: 21px; }
    li { margin: 6px 0; font-size: 12.4px; line-height: 1.48; }
    .missing { padding: 12px 14px; border: 1px solid #e4c7a1; border-radius: 9px; background: #fff9f1; }
    .mandatory { padding: 11px 13px; border-left: 3px solid #0d3157; background: #f7f9fb; }
    .conditional { padding: 11px 13px; border-left: 3px solid #9b7425; background: #fffaf0; }
    .optional { padding: 11px 13px; border-left: 3px solid #6c8797; background: #f8fafb; }
    .practice-box { break-inside: avoid; margin-top: 22px; padding: 14px 15px; border: 1px solid #cfdde5; border-radius: 10px; background: #fbfdfe; }
    .practice-box h3 { margin: 13px 0 6px; color: #284e65; font-size: 13px; }
    .practice-warning { margin: 0 0 9px; font-size: 11.3px; line-height: 1.5; color: #536a7b; }
    .safety { margin-top: 18px; padding: 12px 14px; border: 1px solid #e6c7c7; border-radius: 9px; background: #fff7f7; }
    .footer { margin-top: 25px; padding-top: 11px; border-top: 1px solid #bccbd6; color: #536a7c; font-size: 10.3px; line-height: 1.5; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } .print-help { display: none !important; } }
  </style>
</head>
<body>
  <main class="doc">
    <div class="print-help">Se a janela de impressão não abrir automaticamente, pressione <strong>Ctrl+P</strong>.</div>
    <header class="header">
      <img src="${location.origin}/assets/app-icon.svg" alt="">
      <div><h1>${escapeHtml(heading)}</h1><p>Setor de Regulação de Saúde · Eldorado/MS</p></div>
    </header>

    <section class="meta">
      <p><strong>Especialidade/exame:</strong> ${escapeHtml(displayName(protocol))}</p>
      ${subprotocol?.titulo ? `<p><strong>Motivo/condição:</strong> ${escapeHtml(subprotocol.titulo)}</p>` : ''}
      ${protocol.faixaEtaria ? `<p><strong>Faixa etária do protocolo:</strong> ${escapeHtml(protocol.faixaEtaria)}</p>` : ''}
      ${protocol.solicitante ? `<p><strong>Profissional solicitante:</strong> ${escapeHtml(protocol.solicitante)}</p>` : ''}
      <p><strong>Data da orientação:</strong> ${today}</p>
    </section>

    <div class="intro"><strong>Como usar esta orientação:</strong> leve ou mostre este documento na unidade de saúde responsável pelo encaminhamento. O profissional deve conferir os critérios, registrar as informações clínicas necessárias e solicitar os exames obrigatórios que se aplicarem. O paciente não precisa preencher exame físico, hipótese diagnóstica, interpretação de exames ou classificação de risco. A impressão não é obrigatória: o documento também pode ser mostrado na tela do celular.</div>

    ${!fullMode && missing.length ? sectionHtml('O que ainda precisa ser apresentado', missing.map((row) => row.item), 'Itens marcados pela recepção como ainda não apresentados.', 'missing') : ''}
    ${sectionHtml('Critérios que o profissional deve confirmar', official.criteria, 'Confirme se o caso se enquadra nos critérios da especialidade ou do procedimento antes de enviar a solicitação.')}
    ${sectionHtml('Informações que devem constar no encaminhamento', official.clinical, 'Essas informações devem ser registradas pelo profissional solicitante; dados relatados pelo paciente devem ser identificados como relato.', 'mandatory')}
    ${sectionHtml('Exames e documentos obrigatórios', official.mandatoryExams, 'Devem acompanhar a solicitação quando o protocolo os classifica como obrigatórios.', 'mandatory')}
    ${sectionHtml('Obrigatórios somente conforme o caso', official.conditionalExams, 'Providenciar apenas quando a condição descrita no protocolo realmente se aplicar.', 'conditional')}
    ${sectionHtml('Se já possuir / quando disponível', official.complementary, 'Não devem ser tratados automaticamente como obrigatórios quando o protocolo os classifica apenas como complementares.', 'optional')}
    ${sectionHtml('Informações que ajudam na classificação e priorização', official.priority, 'Registrar quando disponíveis e pertinentes ao quadro clínico.')}
    ${practiceHtml(practice)}
    ${official.alerts.length ? `<section class="safety"><h2>Situações que não devem aguardar fila ambulatorial</h2>${listHtml(official.alerts)}<p class="section-note">A avaliação de gravidade e a definição do fluxo devem ser feitas pela equipe de saúde responsável.</p></section>` : ''}

    <footer class="footer">
      <strong>Setor de Regulação de Saúde</strong><br>
      Bairro Jardim das Grevílias, Rua Irmã Aristela, nº 836 · Eldorado/MS<br>
      Atendimento: segunda a sexta-feira, das 07:00 às 11:00.<br><br>
      <strong>Fonte protocolar:</strong> ${escapeHtml(sources)}<br>
      ${practice ? `<strong>Experiência prática:</strong> ${escapeHtml(practice.sourceLabel)}${practice.updatedAt ? ` Atualizada em ${escapeHtml(practice.updatedAt)}.` : ''}<br>` : ''}
      Esta orientação auxilia a preparação da solicitação e não representa autorização de consulta, exame ou procedimento.
    </footer>
  </main>
</body>
</html>`;
  }

  function waitForImages(doc, callback) {
    const pending = [...doc.images].filter((img) => !img.complete);
    if (!pending.length) return window.setTimeout(callback, 160);
    let remaining = pending.length;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.setTimeout(callback, 160);
    };
    const done = () => { remaining -= 1; if (remaining <= 0) finish(); };
    pending.forEach((img) => {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
    window.setTimeout(finish, 900);
  }

  function printInPopup(html) {
    const popup = window.open('', '_blank');
    if (!popup) throw new Error('O navegador bloqueou a janela de impressão.');
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    let printed = false;
    waitForImages(popup.document, () => {
      if (printed || popup.closed) return;
      printed = true;
      try { popup.focus(); popup.print(); } catch (_) { /* mantém a aba para Ctrl+P */ }
    });
  }

  function printInFrame(html) {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    Object.assign(frame.style, { position: 'fixed', right: '0', bottom: '0', width: '1px', height: '1px', border: '0', opacity: '0', pointerEvents: 'none' });
    document.body.appendChild(frame);
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc || !frame.contentWindow) { frame.remove(); throw new Error('Não foi possível preparar a impressão.'); }
    doc.open(); doc.write(html); doc.close();
    waitForImages(doc, () => {
      try { frame.contentWindow.focus(); frame.contentWindow.print(); } finally { window.setTimeout(() => frame.remove(), 2500); }
    });
  }

  function showError(message) {
    const text = document.getElementById('receptionSummaryText');
    if (text) text.textContent = message;
    window.alert(message);
  }

  async function handlePrint(button) {
    const rows = currentRows();
    const fullMode = button.id === COMPLETE_BUTTON_ID || !rows.some((row) => row.checked);
    try {
      const { protocol, subprotocol } = await currentProtocolContext();
      const html = printableHtml(protocol, subprotocol, rows, fullMode);
      try { printInPopup(html); }
      catch (_) {
        try { printInFrame(html); }
        catch (error) { showError('Não foi possível abrir a impressão. Verifique se o navegador está bloqueando pop-ups e tente novamente.'); }
      }
    } catch (error) {
      showError(error.message || 'Não foi possível montar a orientação completa para esta solicitação.');
    }
  }

  function ensureCompleteButton() {
    ensureQueued = false;
    const detail = document.getElementById(DETAIL_ID);
    if (!detail || !detail.querySelector('.reception-title') || detail.querySelector(`#${COMPLETE_BUTTON_ID}`)) return;
    const box = document.createElement('div');
    box.className = 'portal-note info reception-complete-orientation';
    box.innerHTML = '<strong>Orientação completa para o paciente</strong><br><span>Inclui critérios, informações clínicas, exames obrigatórios e pontos observados nas devoluções reais.</span><br><br><button class="portal-button primary" id="printCompleteOrientation" type="button">Imprimir orientação completa</button>';
    const anchor = detail.querySelector('.reception-scope-note');
    if (anchor) anchor.insertAdjacentElement('beforebegin', box);
    else detail.appendChild(box);
  }

  function scheduleEnsure() {
    if (ensureQueued) return;
    ensureQueued = true;
    requestAnimationFrame(ensureCompleteButton);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest(`#${COMPLETE_BUTTON_ID}, #${MISSING_BUTTON_ID}`);
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    handlePrint(button);
  }, true);

  const detail = document.getElementById(DETAIL_ID);
  if (detail) {
    new MutationObserver(scheduleEnsure).observe(detail, { childList: true, subtree: true });
    scheduleEnsure();
  }
})();
