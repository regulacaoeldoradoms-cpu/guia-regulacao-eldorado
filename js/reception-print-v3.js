'use strict';

(() => {
  const PRINT_BUTTON_ID = 'printMissingItems';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function allRows() {
    return [...document.querySelectorAll('#receptionDetail .reception-item')].map((row) => ({
      type: row.dataset.type || 'mandatory',
      item: row.dataset.item || row.querySelector('.reception-item-text')?.childNodes?.[0]?.textContent || '',
      state: row.querySelector('.reception-status')?.value || 'pending',
      checked: Boolean(row.querySelector('.fast-check input')?.checked)
    })).filter((row) => row.item.trim());
  }

  function currentContext() {
    const specialty = document.querySelector('#receptionDetail .reception-title')?.textContent?.trim() || 'Solicitação regulada';
    const select = document.getElementById('receptionSubprotocol');
    const selectedOption = select?.selectedOptions?.[0];
    const condition = selectedOption && selectedOption.value !== '-1' ? selectedOption.textContent.trim() : '';
    return { specialty, condition };
  }

  function listHtml(items) {
    if (!items.length) return '';
    return `<ul>${items.map((row) => `<li>${escapeHtml(row.item)}</li>`).join('')}</ul>`;
  }

  function fullSections(rows) {
    const mandatory = rows.filter((row) => row.type === 'mandatory');
    const conditional = rows.filter((row) => row.type === 'conditional');
    const available = rows.filter((row) => row.type === 'available');

    return `
      ${mandatory.length ? `<section><h2>Itens que devem acompanhar a solicitação</h2>${listHtml(mandatory)}</section>` : ''}
      ${conditional.length ? `<section><h2>Conforme o caso</h2><p class="section-note">Providenciar somente quando a condição se aplicar ao caso.</p>${listHtml(conditional)}</section>` : ''}
      ${available.length ? `<section><h2>Quando já disponível</h2><p class="section-note">Apresentar se o paciente já possuir. Estes itens não devem ser tratados automaticamente como obrigatórios.</p>${listHtml(available)}</section>` : ''}`;
  }

  function missingSections(rows) {
    const missing = rows.filter((row) => row.state === 'missing');
    return `<section><h2>Itens que precisam ser providenciados</h2>${listHtml(missing)}</section>`;
  }

  function printableHtml(rows, fullMode) {
    const { specialty, condition } = currentContext();
    const today = new Intl.DateTimeFormat('pt-BR').format(new Date());
    const heading = fullMode
      ? 'ORIENTAÇÃO COMPLETA PARA O PACIENTE'
      : 'ORIENTAÇÃO PARA COMPLEMENTAÇÃO';

    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fullMode ? 'Orientação completa' : 'Orientação para complementação'}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #102c45; font-family: Arial, Helvetica, sans-serif; background: #fff; }
    .doc { max-width: 780px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 16px; padding-bottom: 14px; border-bottom: 3px solid #0f7881; }
    .header img { width: 72px; height: 72px; border-radius: 15px; object-fit: contain; }
    .header h1 { margin: 0 0 5px; color: #0d3157; font-size: 19px; line-height: 1.2; }
    .header p { margin: 0; color: #537087; font-size: 12px; }
    .meta { margin: 20px 0 18px; padding: 14px 16px; border: 1px solid #d5e3ed; border-radius: 12px; background: #f7fbfd; }
    .meta p { margin: 5px 0; font-size: 12px; line-height: 1.45; }
    h2 { margin: 20px 0 8px; color: #0d3157; font-size: 16px; }
    ul { margin: 0; padding-left: 22px; }
    li { margin: 8px 0; color: #243e53; font-size: 13px; line-height: 1.5; }
    .section-note { margin: -2px 0 9px; color: #667d8f; font-size: 11px; line-height: 1.45; }
    .note { margin-top: 22px; padding: 14px 15px; border-left: 4px solid #0f7881; border-radius: 8px; background: #f2fbfb; color: #36586a; font-size: 11px; line-height: 1.55; }
    .print-help { margin: 18px 0; padding: 10px 12px; border: 1px solid #d5e3ed; border-radius: 8px; background: #fff7dc; color: #5f4b12; font-size: 12px; }
    .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #bccbd6; color: #536a7c; font-size: 10.5px; line-height: 1.55; }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .print-help { display: none !important; }
    }
  </style>
</head>
<body>
  <main class="doc">
    <div class="print-help">Se a janela de impressão não abrir automaticamente, pressione <strong>Ctrl+P</strong>.</div>
    <header class="header">
      <img src="${location.origin}/assets/app-icon.svg" alt="">
      <div>
        <h1>${heading}</h1>
        <p>Setor de Regulação de Saúde · Eldorado/MS</p>
      </div>
    </header>

    <section class="meta">
      <p><strong>Especialidade/exame:</strong> ${escapeHtml(specialty)}</p>
      ${condition ? `<p><strong>Motivo/condição selecionada:</strong> ${escapeHtml(condition)}</p>` : ''}
      <p><strong>Data da orientação:</strong> ${today}</p>
    </section>

    ${fullMode ? fullSections(rows) : missingSections(rows)}

    <div class="note">
      ${fullMode
        ? 'Esta orientação apresenta a conferência completa disponível para esta solicitação. Os itens da seção “Conforme o caso” devem ser providenciados somente quando realmente se aplicarem. O documento pode ser impresso ou mostrado diretamente na tela do celular; a impressão não é obrigatória.'
        : 'Apresente os itens acima para continuidade da solicitação. Este documento pode ser impresso ou mostrado diretamente na tela do celular; a impressão não é obrigatória.'}
      O documento não substitui avaliação profissional e não representa autorização de consulta ou procedimento.
    </div>

    <footer class="footer">
      <strong>Setor de Regulação de Saúde</strong><br>
      Bairro Jardim das Grevílias, Rua Irmã Aristela, nº 836 · Eldorado/MS<br>
      Atendimento: segunda a sexta-feira, das 07:00 às 11:00.<br><br>
      Fonte: requisitos documentais e informações cadastradas no Guia Médico de Encaminhamentos Regulados.
    </footer>
  </main>
</body>
</html>`;
  }

  function waitForImages(doc, callback) {
    const pending = [...doc.images].filter((img) => !img.complete);
    if (!pending.length) {
      window.setTimeout(callback, 180);
      return;
    }

    let remaining = pending.length;
    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      window.setTimeout(callback, 180);
    };
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) finish();
    };
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
    const execute = () => {
      if (printed || popup.closed) return;
      printed = true;
      try {
        popup.focus();
        popup.print();
      } catch (error) {
        // Mantém a nova aba aberta para permitir Ctrl+P manualmente.
      }
    };

    waitForImages(popup.document, execute);
    return popup;
  }

  function removeFrame(frame) {
    window.setTimeout(() => frame?.remove(), 2500);
  }

  function printInFrame(html) {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '1px';
    frame.style.height = '1px';
    frame.style.border = '0';
    frame.style.opacity = '0';
    frame.style.pointerEvents = 'none';
    document.body.appendChild(frame);

    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc || !frame.contentWindow) {
      frame.remove();
      throw new Error('Não foi possível preparar a impressão.');
    }

    doc.open();
    doc.write(html);
    doc.close();

    waitForImages(doc, () => {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        frame.contentWindow.addEventListener('afterprint', () => frame.remove(), { once: true });
        removeFrame(frame);
      } catch (error) {
        frame.remove();
      }
    });
  }

  function showPrintError(message) {
    const summaryText = document.getElementById('receptionSummaryText');
    if (summaryText) summaryText.textContent = message;
    window.alert(message);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest(`#${PRINT_BUTTON_ID}`);
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const rows = allRows();
    if (!rows.length) {
      showPrintError('Não há itens de conferência disponíveis para imprimir neste protocolo.');
      return;
    }

    const fullMode = !rows.some((row) => row.checked);
    const missing = rows.filter((row) => row.state === 'missing');

    if (!fullMode && !missing.length) {
      showPrintError('Não há item obrigatório faltando para imprimir.');
      return;
    }

    const html = printableHtml(rows, fullMode);
    try {
      printInPopup(html);
    } catch (popupError) {
      try {
        printInFrame(html);
      } catch (frameError) {
        showPrintError('Não foi possível abrir a impressão. Verifique se o navegador está bloqueando pop-ups e tente novamente.');
      }
    }
  }, true);
})();
