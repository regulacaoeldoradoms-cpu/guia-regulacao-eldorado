'use strict';

(() => {
  const PRINT_BUTTON_ID = 'printMissingItems';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function getMissingItems() {
    return [...document.querySelectorAll('#receptionDetail .reception-item')]
      .map((row) => ({
        item: row.dataset.item || row.querySelector('.reception-item-text')?.childNodes?.[0]?.textContent || '',
        state: row.querySelector('.reception-status')?.value || 'pending'
      }))
      .filter((row) => row.state === 'missing' && row.item.trim());
  }

  function currentContext() {
    const specialty = document.querySelector('#receptionDetail .reception-title')?.textContent?.trim() || 'Solicitação regulada';
    const select = document.getElementById('receptionSubprotocol');
    const selectedOption = select?.selectedOptions?.[0];
    const condition = selectedOption && selectedOption.value !== '-1' ? selectedOption.textContent.trim() : '';
    return { specialty, condition };
  }

  function printableHtml(missing) {
    const { specialty, condition } = currentContext();
    const today = new Intl.DateTimeFormat('pt-BR').format(new Date());
    const items = missing.map((row) => `<li>${escapeHtml(row.item)}</li>`).join('');

    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Orientação para complementação</title>
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
    h2 { margin: 19px 0 9px; color: #0d3157; font-size: 16px; }
    ul { margin: 0; padding-left: 22px; }
    li { margin: 9px 0; color: #243e53; font-size: 13px; line-height: 1.5; }
    .note { margin-top: 22px; padding: 14px 15px; border-left: 4px solid #0f7881; border-radius: 8px; background: #f2fbfb; color: #36586a; font-size: 11px; line-height: 1.55; }
    .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #bccbd6; color: #536a7c; font-size: 10.5px; line-height: 1.55; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <main class="doc">
    <header class="header">
      <img src="${location.origin}/assets/app-icon.svg" alt="">
      <div>
        <h1>ORIENTAÇÃO PARA COMPLEMENTAÇÃO DE DOCUMENTOS</h1>
        <p>Setor de Regulação de Saúde · Eldorado/MS</p>
      </div>
    </header>

    <section class="meta">
      <p><strong>Especialidade/exame:</strong> ${escapeHtml(specialty)}</p>
      ${condition ? `<p><strong>Motivo/condição selecionada:</strong> ${escapeHtml(condition)}</p>` : ''}
      <p><strong>Data da orientação:</strong> ${today}</p>
    </section>

    <h2>Itens que precisam ser providenciados</h2>
    <ul>${items}</ul>

    <div class="note">
      Apresente os itens acima para continuidade da solicitação. Este documento pode ser impresso ou mostrado diretamente na tela do celular. A impressão não é obrigatória. O documento não substitui avaliação profissional e não representa autorização de consulta ou procedimento.
    </div>

    <footer class="footer">
      <strong>Setor de Regulação de Saúde</strong><br>
      Bairro Jardim das Grevílias, Rua Irmã Aristela, nº 836 · Eldorado/MS<br>
      Atendimento: segunda a sexta-feira, das 07:00 às 11:00.<br><br>
      Fonte: requisitos documentais e exames da base protocolar cadastrada no Guia Médico de Encaminhamentos Regulados.
    </footer>
  </main>
</body>
</html>`;
  }

  function removeFrame(frame) {
    window.setTimeout(() => frame?.remove(), 800);
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

    const execute = () => {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        frame.contentWindow.addEventListener('afterprint', () => removeFrame(frame), { once: true });
        removeFrame(frame);
      } catch (error) {
        frame.remove();
        throw error;
      }
    };

    const logo = doc.querySelector('img');
    if (logo && !logo.complete) {
      logo.addEventListener('load', () => window.setTimeout(execute, 80), { once: true });
      logo.addEventListener('error', () => window.setTimeout(execute, 80), { once: true });
    } else {
      window.setTimeout(execute, 80);
    }
  }

  function printFallback(html) {
    const popup = window.open('', '_blank');
    if (!popup) throw new Error('O navegador bloqueou a janela de impressão.');
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    window.setTimeout(() => {
      popup.focus();
      popup.print();
    }, 180);
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

    const missing = getMissingItems();
    if (!missing.length) {
      showPrintError('Marque pelo menos um item como faltando antes de imprimir a orientação.');
      return;
    }

    const html = printableHtml(missing);
    try {
      printInFrame(html);
    } catch (frameError) {
      try {
        printFallback(html);
      } catch (popupError) {
        showPrintError('Não foi possível abrir a impressão. Verifique se o navegador está bloqueando janelas de impressão e tente novamente.');
      }
    }
  }, true);
})();
