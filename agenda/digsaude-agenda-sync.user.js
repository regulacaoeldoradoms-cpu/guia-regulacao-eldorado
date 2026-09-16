// ==UserScript==
// @name         Portal da Regulação - Sincronizar Agenda DigSaúde
// @namespace    https://regulacaoeldoradoms.com.br/
// @version      1.0.0
// @description  Envia somente a lista visível de Agendados do DigSaúde para a Agenda protegida do Portal.
// @match        https://teleatendimento.saude.ms.gov.br/*/consultas*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const PORTAL_ORIGIN = 'https://regulacaoeldoradoms.com.br';
  const BRIDGE_URL = PORTAL_ORIGIN + '/agenda/sync/';
  const BUTTON_ID = 'portal-agenda-sync-button';
  const RESULT_TIMEOUT_MS = 5 * 60 * 1000;
  let portalWindow = null;
  let pendingSnapshot = null;
  let retryTimer = null;
  let stopTimer = null;

  function compact(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function isoDate(value) {
    const source = compact(value);
    const match = source.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : source;
  }

  function requestedAt(value) {
    const source = compact(value);
    const match = source.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}:\d{2}))?$/);
    if (!match) return source;
    return `${match[3]}-${match[2]}-${match[1]}${match[4] ? ' ' + match[4] : ''}`;
  }

  function iconState(cell) {
    if (!cell) return '';
    if (cell.querySelector('.fi-color-success, .text-success-500, [class*="success"]')) return 'sim';
    if (cell.querySelector('.fi-color-danger, .text-danger-500, [class*="danger"]')) return 'nao';
    return '';
  }

  function tooltipText(cell) {
    if (!cell) return '';
    const node = cell.querySelector('[x-tooltip]') || cell.querySelector('[x-data][x-tooltip]');
    const source = String(node?.getAttribute('x-tooltip') || '');
    const single = source.match(/content\s*:\s*'([^']+)'/);
    const double = source.match(/content\s*:\s*"([^"]+)"/);
    return compact(single?.[1] || double?.[1] || '');
  }

  function sourceIdFor(row) {
    const wireKey = String(row.getAttribute('wire:key') || '');
    const match = wireKey.match(/\.table\.records\.([A-Za-z0-9_-]+)$/);
    if (match) return match[1];
    const checkbox = row.querySelector('input[type="checkbox"][value]');
    return compact(checkbox?.value || '');
  }

  function activeAgendadosTab() {
    const buttons = [...document.querySelectorAll('.fi-tabs-item')];
    return buttons.find((button) => {
      const label = compact(button.querySelector('.fi-tabs-item-label')?.textContent);
      const selected = button.classList.contains('fi-active') || button.getAttribute('aria-selected') === 'true' || button.hasAttribute('aria-selected');
      return label === 'Agendados' && selected;
    }) || null;
  }

  function agendadosTotal() {
    const buttons = [...document.querySelectorAll('.fi-tabs-item')];
    const button = buttons.find((item) => compact(item.querySelector('.fi-tabs-item-label')?.textContent) === 'Agendados');
    const badge = compact(button?.querySelector('.fi-badge')?.textContent);
    const total = Number.parseInt(badge.replace(/\D/g, ''), 10);
    return Number.isFinite(total) ? total : 0;
  }

  function extractRows() {
    const rows = [...document.querySelectorAll('tr.fi-ta-row[wire\\:key*=".table.records."]')];
    const output = [];
    const seen = new Set();

    for (const row of rows) {
      const sourceId = sourceIdFor(row);
      if (!sourceId || seen.has(sourceId)) continue;
      const cells = [...row.querySelectorAll(':scope > td')];
      if (cells.length < 10) continue;

      const record = {
        sourceId,
        requestedAt: requestedAt(cells[1]?.textContent),
        specialty: compact(cells[2]?.textContent),
        returnStatus: iconState(cells[3]),
        devolucaoStatus: iconState(cells[4]),
        classification: tooltipText(cells[5]) || compact(cells[5]?.textContent),
        appointmentDate: isoDate(cells[6]?.textContent),
        appointmentTime: compact(cells[7]?.textContent),
        specialist: compact(cells[8]?.textContent),
        patient: compact(cells[9]?.textContent),
        municipality: compact(cells[10]?.textContent),
        appointmentType: compact(cells[11]?.textContent),
        facility: compact(cells[12]?.textContent),
        status: compact(cells[13]?.textContent)
      };
      output.push(record);
      seen.add(sourceId);
    }
    return output;
  }

  function snapshot() {
    if (!activeAgendadosTab()) {
      throw new Error('Abra a aba Agendados antes de sincronizar.');
    }
    const records = extractRows();
    if (!records.length) {
      throw new Error('Nenhum agendamento foi encontrado na tabela.');
    }
    const totalCount = agendadosTotal();
    return {
      source: 'digsaude-agendados-v1',
      capturedAt: new Date().toISOString(),
      totalCount: totalCount || records.length,
      complete: Boolean(totalCount && totalCount === records.length),
      records
    };
  }

  function button() {
    return document.getElementById(BUTTON_ID);
  }

  function setButton(text, tone = '') {
    const element = button();
    if (!element) return;
    element.textContent = text;
    element.dataset.tone = tone;
  }

  function stopRetry() {
    if (retryTimer) window.clearInterval(retryTimer);
    if (stopTimer) window.clearTimeout(stopTimer);
    retryTimer = null;
    stopTimer = null;
  }

  function sendSnapshot() {
    if (!portalWindow || portalWindow.closed || !pendingSnapshot) return;
    try {
      portalWindow.postMessage({
        type: 'PORTAL_AGENDA_DIGSAUDE_SYNC',
        snapshot: pendingSnapshot
      }, PORTAL_ORIGIN);
    } catch (_) {}
  }

  function startSync() {
    try {
      pendingSnapshot = snapshot();
    } catch (error) {
      window.alert(error.message || 'Não foi possível ler a aba Agendados.');
      return;
    }

    setButton('Enviando ao Portal…', 'working');
    portalWindow = window.open(BRIDGE_URL, 'portal-agenda-sync', 'popup=yes,width=620,height=620,resizable=yes,scrollbars=yes');
    if (!portalWindow) {
      setButton('Enviar Agenda ao Portal', 'error');
      window.alert('O navegador bloqueou a janela do Portal. Libere pop-ups para este site e tente novamente.');
      return;
    }

    stopRetry();
    sendSnapshot();
    retryTimer = window.setInterval(sendSnapshot, 800);
    stopTimer = window.setTimeout(() => {
      stopRetry();
      pendingSnapshot = null;
      setButton('Tentar sincronizar novamente', 'error');
    }, RESULT_TIMEOUT_MS);
  }

  window.addEventListener('message', (event) => {
    if (event.origin !== PORTAL_ORIGIN) return;
    if (portalWindow && event.source !== portalWindow) return;

    if (event.data?.type === 'PORTAL_AGENDA_DIGSAUDE_READY') {
      sendSnapshot();
      return;
    }
    if (event.data?.type !== 'PORTAL_AGENDA_DIGSAUDE_RESULT') return;

    stopRetry();
    pendingSnapshot = null;
    if (event.data.ok) {
      const created = Number(event.data.created || 0);
      const changed = Number(event.data.changed || 0);
      setButton(`Agenda sincronizada · +${created} / ~${changed}`, 'success');
      window.setTimeout(() => setButton('Enviar Agenda ao Portal', ''), 6000);
    } else {
      setButton('Falha ao sincronizar', 'error');
      window.alert('O Portal não conseguiu receber a Agenda. Abra o Portal, confirme seu acesso e tente novamente.');
    }
  });

  function mountButton() {
    if (button()) return;
    const element = document.createElement('button');
    element.id = BUTTON_ID;
    element.type = 'button';
    element.textContent = 'Enviar Agenda ao Portal';
    element.setAttribute('aria-label', 'Sincronizar a aba Agendados com o Portal da Regulação');
    element.style.cssText = [
      'position:fixed',
      'right:22px',
      'bottom:22px',
      'z-index:2147483646',
      'border:0',
      'border-radius:14px',
      'padding:12px 16px',
      'background:#0d3157',
      'color:#fff',
      'font:700 14px Inter,system-ui,sans-serif',
      'box-shadow:0 10px 30px rgba(0,0,0,.22)',
      'cursor:pointer'
    ].join(';');
    element.addEventListener('click', startSync);
    document.body.appendChild(element);
  }

  mountButton();
  new MutationObserver(mountButton).observe(document.documentElement, { childList: true, subtree: true });
})();
