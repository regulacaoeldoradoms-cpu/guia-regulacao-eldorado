'use strict';

(() => {
  const DETAIL_ID = 'receptionDetail';
  const CARD_ID = 'receptionSubstanceOperationalCondition';
  const PRINT_BUTTON_ID = 'printSubstanceOperationalGuidance';

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function isSupportedMentalHealthProtocol(title) {
    const value = normalize(title);
    return value === 'psicologia' || value === 'psiquiatria adulto' || value === 'psiquiatria';
  }

  function currentSpecialty() {
    return document.querySelector(`#${DETAIL_ID} .reception-title`)?.textContent?.trim() || '';
  }

  function patientInformationHtml(specialty) {
    const today = new Intl.DateTimeFormat('pt-BR').format(new Date());
    const heading = 'ORIENTAÇÃO AO PACIENTE — FLUXO DE SAÚDE MENTAL';
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(heading)}</title><style>
      @page{size:A4;margin:14mm}*{box-sizing:border-box}body{margin:0;color:#173247;font-family:Arial,Helvetica,sans-serif;background:#fff}.doc{max-width:790px;margin:0 auto}.header{display:flex;align-items:center;gap:15px;padding-bottom:13px;border-bottom:3px solid #0f7881}.header img{width:68px;height:68px;border-radius:14px;object-fit:contain}.header h1{margin:0 0 5px;color:#0d3157;font-size:18px;line-height:1.22}.header p{margin:0;color:#537087;font-size:12px}.print-help{margin:0 0 14px;padding:10px 12px;border:1px solid #ead89b;border-radius:8px;background:#fff8df;color:#5f4b12;font-size:12px}.meta{margin:18px 0 16px;padding:13px 15px;border:1px solid #d5e3ed;border-radius:11px;background:#f7fbfd}.meta p{margin:5px 0;font-size:12.5px;line-height:1.45}.notice{margin:16px 0;padding:16px;border-left:4px solid #0f7881;background:#f2fbfb;border-radius:9px;font-size:13px;line-height:1.58}.notice p{margin:0 0 12px}.notice p:last-child{margin-bottom:0}.warning{margin:18px 0;padding:14px 15px;border-left:4px solid #9b7425;background:#fffaf0;border-radius:9px;font-size:12.5px;line-height:1.55}.footer{margin-top:26px;padding-top:11px;border-top:1px solid #bccbd6;color:#536a7c;font-size:10.5px;line-height:1.5}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.print-help{display:none!important}}
    </style></head><body><main class="doc">
      <div class="print-help">Se a janela de impressão não abrir automaticamente, pressione <strong>Ctrl+P</strong>.</div>
      <header class="header"><img src="${location.origin}/assets/recepcao-icon.png" alt=""><div><h1>${heading}</h1><p>Setor de Regulação de Saúde · Eldorado/MS</p></div></header>
      <section class="meta"><p><strong>Encaminhamento apresentado:</strong> ${escapeHtml(specialty || 'Saúde Mental')}</p><p><strong>Condição:</strong> uso de álcool e/ou outras drogas, inclusive quando em reabilitação por uso de substâncias.</p><p><strong>Data da orientação:</strong> ${today}</p></section>
      <section class="notice"><p><strong>Informação sobre o fluxo:</strong> conforme orientação operacional vigente do DigSaúde MS, o teleatendimento por <strong>Psicologia e Psiquiatria</strong> não recebe pacientes cuja demanda esteja relacionada ao uso de álcool ou outras drogas, inclusive em reabilitação, por critérios operacionais de segurança do atendimento.</p><p>Este documento informa somente que <strong>esse fluxo de teleatendimento não é aplicável para esta condição</strong>. Ele não representa recusa de cuidado e não significa, por si só, necessidade de internação hospitalar.</p><p>A unidade de saúde responsável pelo acompanhamento deverá avaliar o quadro e organizar a continuidade do cuidado conforme os fluxos assistenciais disponíveis.</p></section>
      <section class="warning"><strong>Em caso de agravamento agudo:</strong> situações como intoxicação ou abstinência importante, agitação grave, risco de a pessoa machucar a si mesma ou outras pessoas, alteração importante do estado de consciência ou outra urgência devem ser avaliadas imediatamente por um serviço de urgência.</section>
      <footer class="footer"><strong>Setor de Regulação de Saúde</strong><br>Bairro Jardim das Grevílias, Rua Irmã Aristela, nº 836 · Eldorado/MS<br>Atendimento: segunda a sexta-feira, das 07:00 às 11:00.<br><br><strong>Base da orientação:</strong> regra operacional confirmada do DigSaúde MS, registrada na camada prática municipal em 08/09/2026.</footer>
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

  function ensureConditionCard() {
    const detail = document.getElementById(DETAIL_ID);
    if (!detail) return;

    const specialty = currentSpecialty();
    const existing = document.getElementById(CARD_ID);
    if (!isSupportedMentalHealthProtocol(specialty)) {
      existing?.remove();
      return;
    }
    if (existing) return;

    const card = document.createElement('div');
    card.id = CARD_ID;
    card.className = 'portal-note info';
    card.innerHTML = '<strong>Condição operacional — uso de álcool e outras drogas</strong><br><span>Se o encaminhamento envolver uso de álcool e/ou outras drogas, inclusive paciente em reabilitação por uso de substâncias, este fluxo de teleatendimento não é aceito operacionalmente pelo DigSaúde MS. <strong>A recepção deve imprimir a orientação abaixo e entregar ao paciente.</strong></span><br><br><button class="portal-button primary" id="printSubstanceOperationalGuidance" type="button">Imprimir orientação para entregar ao paciente</button>';

    const anchor = detail.querySelector('.reception-scope-note');
    if (anchor) anchor.insertAdjacentElement('beforebegin', card);
    else detail.appendChild(card);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest(`#${PRINT_BUTTON_ID}`);
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    printHtml(patientInformationHtml(currentSpecialty()));
  });

  const detail = document.getElementById(DETAIL_ID);
  if (!detail) return;
  new MutationObserver(() => window.requestAnimationFrame(ensureConditionCard))
    .observe(detail, { childList: true, subtree: true, characterData: true });
  ensureConditionCard();
})();
