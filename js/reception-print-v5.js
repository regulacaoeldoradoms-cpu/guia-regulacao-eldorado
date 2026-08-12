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

  function routeFor(protocol) {
    const systems = protocol?.sistemas || {};
    const routes = [];
    if (systems.sisreg) routes.push('SISREG/CORE');
    if (systems.digsus && systems.digsusStatus === 'disponivel') routes.push('DigSaúde MS');
    if (systems.digsus && systems.digsusStatus === 'assincrona') routes.push('Discussão de conduta');
    return routes.join(' · ') || 'Conferir fluxo';
  }

  function loadProtocols() {
    if (!protocolsPromise) {
      protocolsPromise = fetch(`${DATA_SOURCE}?patient-orientation=5.0`, { cache: 'no-store' })
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
      item: clean(row.dataset.item || row.querySelector('.reception-item-text')?.childNodes?.[0]?.textContent || ''),
      state: row.querySelector('.reception-status')?.value || 'pending'
    })).filter((row) => row.item);
  }

  async function currentProtocolContext() {
    const protocols = await loadProtocols();
    const activeButton = document.querySelector('#receptionProtocolList button.active');
    const activeId = activeButton?.dataset.id || '';
    const title = document.querySelector(`#${DETAIL_ID} .reception-title`)?.textContent?.trim() || '';
    let protocol = protocols.find((item) => String(item.id || displayName(item)) === activeId);
    if (!protocol) protocol = protocols.find((item) => norm(displayName(item)) === norm(title));
    if (!protocol) throw new Error('Não foi possível identificar o protocolo selecionado para montar a orientação.');

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
      complementary: unique([arr(protocol.complementares), arr(subprotocol?.complementares)])
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

  function printableHtml(protocol, subprotocol, rows, fullMode) {
    const official = officialData(protocol, subprotocol);
    const missing = rows.filter((row) => row.state === 'missing');
    const today = new Intl.DateTimeFormat('pt-BR').format(new Date());
    const heading = fullMode ? 'ORIENTAÇÃO PARA SOLICITAÇÃO' : 'ORIENTAÇÃO PARA COMPLEMENTAÇÃO';
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
    .section h2 { margin: 0 0 7px; color: #0d3157; font-size: 15px; }
    .section-note { margin: 0 0 7px; color: #657c8d; font-size: 11px; line-height: 1.45; }
    ul { margin: 0; padding-left: 21px; }
    li { margin: 6px 0; font-size: 12.4px; line-height: 1.48; }
    .missing { padding: 12px 14px; border: 1px solid #e4c7a1; border-radius: 9px; background: #fff9f1; }
    .mandatory { padding: 11px 13px; border-left: 3px solid #0d3157; background: #f7f9fb; }
    .conditional { padding: 11px 13px; border-left: 3px solid #9b7425; background: #fffaf0; }
    .optional { padding: 11px 13px; border-left: 3px solid #6c8797; background: #f8fafb; }
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
      <p><strong>Via de acesso:</strong> ${escapeHtml(routeFor(protocol))}</p>
      ${subprotocol?.titulo ? `<p><strong>Motivo/condição:</strong> ${escapeHtml(subprotocol.titulo)}</p>` : ''}
      ${protocol.faixaEtaria ? `<p><strong>Faixa etária do protocolo:</strong> ${escapeHtml(protocol.faixaEtaria)}</p>` : ''}
      ${protocol.solicitante ? `<p><strong>Profissional solicitante:</strong> ${escapeHtml(protocol.solicitante)}</p>` : ''}
      <p><strong>Data da orientação:</strong> ${today}</p>
    </section>

    <div class="intro"><strong>Orientação ao paciente:</strong> leve ou mostre este documento na unidade de saúde responsável pelo encaminhamento. O médico ou profissional solicitante deve conferir as informações abaixo e registrar no encaminhamento o que for necessário para o seu caso. Você não precisa preencher exame físico, hipótese diagnóstica, interpretação de exames ou classificação de risco. A impressão não é obrigatória: este documento também pode ser mostrado na tela do celular.</div>

    ${!fullMode && missing.length ? sectionHtml('O que ainda precisa ser apresentado', missing.map((row) => row.item), 'Itens que foram marcados como faltantes na conferência.', 'missing') : ''}
    ${protocol.fluxoLocal ? sectionHtml('Como esta solicitação deve ser feita', [protocol.fluxoLocal]) : ''}
    ${sectionHtml('Quando este encaminhamento é indicado', official.criteria, 'O profissional da unidade deve confirmar se o caso se enquadra nestes critérios.')}
    ${sectionHtml('Informações que precisam constar no encaminhamento', official.clinical, 'Essas informações devem ser registradas pelo profissional solicitante conforme a avaliação do paciente.', 'mandatory')}
    ${sectionHtml('Exames e documentos obrigatórios', official.mandatoryExams, 'Providenciar quando o protocolo os exige para realizar a solicitação.', 'mandatory')}
    ${sectionHtml('Obrigatórios somente quando se aplicarem ao caso', official.conditionalExams, 'Não é necessário realizar todos: o profissional deve verificar quais se aplicam ao seu caso.', 'conditional')}
    ${sectionHtml('Se já possuir / quando disponível', official.complementary, 'Leve ou apresente se já tiver. Não são automaticamente obrigatórios quando o protocolo os classifica apenas como complementares.', 'optional')}

    <footer class="footer">
      <strong>Setor de Regulação de Saúde</strong><br>
      Bairro Jardim das Grevílias, Rua Irmã Aristela, nº 836 · Eldorado/MS<br>
      Atendimento: segunda a sexta-feira, das 07:00 às 11:00.<br><br>
      <strong>Fonte:</strong> ${escapeHtml(sources)}<br>
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
    const fullMode = button.id === COMPLETE_BUTTON_ID;
    try {
      const { protocol, subprotocol } = await currentProtocolContext();
      if (arr(protocol.subprotocolos).length && !subprotocol) {
        showError('Selecione primeiro o motivo / condição do encaminhamento para imprimir somente os requisitos corretos do caso.');
        return;
      }
      const html = printableHtml(protocol, subprotocol, rows, fullMode);
      try { printInPopup(html); }
      catch (_) {
        try { printInFrame(html); }
        catch (error) { showError('Não foi possível abrir a impressão. Verifique se o navegador está bloqueando pop-ups e tente novamente.'); }
      }
    } catch (error) {
      showError(error.message || 'Não foi possível montar a orientação para esta solicitação.');
    }
  }

  function ensureCompleteButton() {
    ensureQueued = false;
    const detail = document.getElementById(DETAIL_ID);
    if (!detail || !detail.querySelector('.reception-title') || detail.querySelector(`#${COMPLETE_BUTTON_ID}`)) return;
    const box = document.createElement('div');
    box.className = 'portal-note info reception-complete-orientation';
    box.innerHTML = '<strong>Orientação para o paciente</strong><br><span>Mostra apenas os requisitos do protocolo que podem ser entregues ao paciente para levar à unidade de saúde.</span><br><br><button class="portal-button primary" id="printCompleteOrientation" type="button">Imprimir orientação</button>';
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
