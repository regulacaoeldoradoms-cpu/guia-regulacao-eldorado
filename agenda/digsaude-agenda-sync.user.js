// ==UserScript==
// @name         Portal da Regulação - Sincronizar Agenda DigSaúde
// @namespace    https://regulacaoeldoradoms.com.br/
// @version      1.1.0
// @description  Sincroniza automaticamente a lista Agendados do DigSaúde com a Agenda protegida do Portal enquanto o DigSaúde estiver aberto.
// @match        https://teleatendimento.saude.ms.gov.br/*/consultas*
// @updateURL    https://regulacaoeldoradoms.com.br/agenda/digsaude-agenda-sync.user.js?v=20260916-2
// @downloadURL  https://regulacaoeldoradoms.com.br/agenda/digsaude-agenda-sync.user.js?v=20260916-2
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const PORTAL_ORIGIN = 'https://regulacaoeldoradoms.com.br';
  const BRIDGE_URL = PORTAL_ORIGIN + '/agenda/sync/';
  const BUTTON_ID = 'portal-agenda-sync-button';
  const AUTO_INTERVAL_MS = 15 * 60 * 1000;
  const RESULT_TIMEOUT_MS = 60 * 1000;
  const BRIDGE_WATCH_MS = 15 * 1000;

  let portalWindow = null;
  let autoEnabled = false;
  let autoTimer = null;
  let bridgeWatchTimer = null;
  let retryTimer = null;
  let stopTimer = null;
  let pendingSnapshot = null;
  let pendingFingerprint = '';
  let pendingSyncId = '';
  let lastFingerprint = '';
  let lastCheckAt = 0;
  let syncInFlight = false;

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

  function agendadosTotal(root = document) {
    const buttons = [...root.querySelectorAll('.fi-tabs-item')];
    const tab = buttons.find((item) => compact(item.querySelector('.fi-tabs-item-label')?.textContent) === 'Agendados');
    if (!tab) return null;
    const badge = compact(tab.querySelector('.fi-badge')?.textContent);
    if (!badge) return null;
    const total = Number.parseInt(badge.replace(/\D/g, ''), 10);
    return Number.isFinite(total) ? total : null;
  }

  function extractRows(root = document) {
    const rows = [...root.querySelectorAll('tr.fi-ta-row[wire\\:key*=".table.records."]')];
    const output = [];
    const seen = new Set();

    for (const row of rows) {
      const sourceId = sourceIdFor(row);
      if (!sourceId || seen.has(sourceId)) continue;
      const cells = [...row.querySelectorAll(':scope > td')];
      if (cells.length < 10) continue;

      output.push({
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
      });
      seen.add(sourceId);
    }

    return output;
  }

  function snapshotFrom(root) {
    const records = extractRows(root);
    const declaredTotal = agendadosTotal(root);

    if (declaredTotal === null && !records.length) {
      throw new Error('Não foi possível identificar a lista Agendados.');
    }
    if (declaredTotal !== null && declaredTotal > 0 && !records.length) {
      throw new Error('A lista Agendados não terminou de carregar.');
    }

    const totalCount = declaredTotal === null ? records.length : declaredTotal;
    return {
      source: 'digsaude-agendados-v1',
      capturedAt: new Date().toISOString(),
      totalCount,
      complete: declaredTotal !== null && declaredTotal === records.length,
      records
    };
  }

  function agendadosUrl() {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('activeTab', 'Agendados');
    return url.toString();
  }

  async function fetchSnapshot() {
    const response = await fetch(agendadosUrl(), {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'text/html' }
    });

    if (!response.ok || /\/login(?:\?|$)/i.test(new URL(response.url).pathname)) {
      throw new Error('A sessão do DigSaúde expirou. Entre novamente no sistema.');
    }

    const html = await response.text();
    const root = new DOMParser().parseFromString(html, 'text/html');
    return snapshotFrom(root);
  }

  function fingerprint(snapshot) {
    return JSON.stringify({
      totalCount: snapshot.totalCount,
      complete: snapshot.complete,
      records: snapshot.records
    });
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

  function clock(value = new Date()) {
    return value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function stopDeliveryRetry() {
    if (retryTimer) window.clearInterval(retryTimer);
    if (stopTimer) window.clearTimeout(stopTimer);
    retryTimer = null;
    stopTimer = null;
  }

  function sendSnapshot() {
    if (!portalWindow || portalWindow.closed || !pendingSnapshot || !pendingSyncId) return;
    try {
      portalWindow.postMessage({
        type: 'PORTAL_AGENDA_DIGSAUDE_SYNC',
        syncId: pendingSyncId,
        snapshot: pendingSnapshot
      }, PORTAL_ORIGIN);
    } catch (_) {}
  }

  function scheduleDeliveryRetry() {
    stopDeliveryRetry();
    sendSnapshot();
    retryTimer = window.setInterval(sendSnapshot, 800);
    stopTimer = window.setTimeout(() => {
      stopDeliveryRetry();
      syncInFlight = false;
      pendingSnapshot = null;
      pendingFingerprint = '';
      pendingSyncId = '';
      setButton('Automático ativo · Portal não respondeu', 'error');
    }, RESULT_TIMEOUT_MS);
  }

  function stopAutomaticTimers() {
    if (autoTimer) window.clearInterval(autoTimer);
    if (bridgeWatchTimer) window.clearInterval(bridgeWatchTimer);
    autoTimer = null;
    bridgeWatchTimer = null;
  }

  function pauseAutomatic(reason = 'Automático pausado · clique para reativar') {
    autoEnabled = false;
    stopAutomaticTimers();
    stopDeliveryRetry();
    syncInFlight = false;
    pendingSnapshot = null;
    pendingFingerprint = '';
    pendingSyncId = '';
    setButton(reason, 'error');
  }

  async function runAutomaticSync({ force = false } = {}) {
    if (!autoEnabled || syncInFlight) return;

    if (!portalWindow || portalWindow.closed) {
      pauseAutomatic();
      return;
    }

    syncInFlight = true;
    setButton('Automático ativo · verificando…', 'working');

    try {
      const nextSnapshot = await fetchSnapshot();
      lastCheckAt = Date.now();
      const nextFingerprint = fingerprint(nextSnapshot);

      if (!force && nextFingerprint === lastFingerprint) {
        syncInFlight = false;
        setButton(`Automático ativo · sem mudanças · ${clock()}`, 'success');
        return;
      }

      pendingSnapshot = nextSnapshot;
      pendingFingerprint = nextFingerprint;
      pendingSyncId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      setButton(`Automático ativo · enviando ${nextSnapshot.records.length}…`, 'working');
      scheduleDeliveryRetry();
    } catch (error) {
      syncInFlight = false;
      lastCheckAt = Date.now();
      setButton(`Automático ativo · ${compact(error?.message) || 'falha na verificação'}`, 'error');
    }
  }

  function startAutomaticTimers() {
    stopAutomaticTimers();
    autoTimer = window.setInterval(() => runAutomaticSync(), AUTO_INTERVAL_MS);
    bridgeWatchTimer = window.setInterval(() => {
      if (autoEnabled && (!portalWindow || portalWindow.closed)) pauseAutomatic();
    }, BRIDGE_WATCH_MS);
  }

  function activateAutomaticSync() {
    portalWindow = window.open(
      BRIDGE_URL,
      'portal-agenda-sync',
      'popup=yes,width=560,height=420,resizable=yes,scrollbars=yes'
    );

    if (!portalWindow) {
      setButton('Ativar sincronização automática', 'error');
      window.alert('O navegador bloqueou a janela do Portal. Libere pop-ups para este site e tente novamente.');
      return;
    }

    autoEnabled = true;
    setButton('Conectando sincronização automática…', 'working');
    startAutomaticTimers();
  }

  function onButtonClick() {
    if (!autoEnabled) {
      activateAutomaticSync();
      return;
    }
    runAutomaticSync({ force: true });
  }

  window.addEventListener('message', (event) => {
    if (event.origin !== PORTAL_ORIGIN) return;
    if (portalWindow && event.source !== portalWindow) return;

    if (event.data?.type === 'PORTAL_AGENDA_DIGSAUDE_READY') {
      if (!autoEnabled) return;
      setButton('Automático ativo · primeira verificação…', 'working');
      runAutomaticSync({ force: true });
      return;
    }

    if (event.data?.type !== 'PORTAL_AGENDA_DIGSAUDE_RESULT') return;
    if (!pendingSyncId || event.data?.syncId !== pendingSyncId) return;

    stopDeliveryRetry();
    syncInFlight = false;

    if (event.data.ok) {
      lastFingerprint = pendingFingerprint;
      const created = Number(event.data.created || 0);
      const changed = Number(event.data.changed || 0);
      const suffix = created || changed ? `+${created} / ~${changed}` : 'sem mudanças';
      setButton(`Automático ativo · ${suffix} · ${clock()}`, 'success');
    } else {
      setButton('Automático ativo · falha ao enviar; tentará novamente', 'error');
    }

    pendingSnapshot = null;
    pendingFingerprint = '';
    pendingSyncId = '';
  });

  window.addEventListener('focus', () => {
    if (!autoEnabled || !lastCheckAt) return;
    if (Date.now() - lastCheckAt >= AUTO_INTERVAL_MS) runAutomaticSync();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !autoEnabled || !lastCheckAt) return;
    if (Date.now() - lastCheckAt >= AUTO_INTERVAL_MS) runAutomaticSync();
  });

  function mountButton() {
    if (button()) return;
    const element = document.createElement('button');
    element.id = BUTTON_ID;
    element.type = 'button';
    element.textContent = 'Ativar sincronização automática';
    element.title = 'Atualiza a Agenda a cada 15 minutos enquanto o DigSaúde e a ponte do Portal permanecerem abertos.';
    element.setAttribute('aria-label', 'Ativar sincronização automática da Agenda com o Portal da Regulação');
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
      'cursor:pointer',
      'max-width:360px'
    ].join(';');
    element.addEventListener('click', onButtonClick);
    document.body.appendChild(element);
  }

  mountButton();
  new MutationObserver(mountButton).observe(document.documentElement, { childList: true, subtree: true });
})();