// ==UserScript==
// @name         Portal da Regulação - Sincronizar Agenda DigSaúde
// @namespace    https://regulacaoeldoradoms.com.br/
// @version      1.2.1
// @description  Sincroniza automaticamente a lista Agendados do DigSaúde com a Agenda protegida do Portal enquanto o DigSaúde estiver aberto.
// @match        https://teleatendimento.saude.ms.gov.br/*/consultas*
// @updateURL    https://regulacaoeldoradoms.com.br/agenda/digsaude-agenda-sync.user.js?v=20261001-whatsapp-2
// @downloadURL  https://regulacaoeldoradoms.com.br/agenda/digsaude-agenda-sync.user.js?v=20261001-whatsapp-2
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  if (window.top !== window.self) return;

  const PORTAL_ORIGIN = 'https://regulacaoeldoradoms.com.br';
  const BRIDGE_URL = PORTAL_ORIGIN + '/agenda/sync/';
  const WIDGET_ID = 'portal-agenda-sync-widget';
  const BUTTON_ID = 'portal-agenda-sync-button';
  const PANEL_ID = 'portal-agenda-sync-panel';
  const STATUS_ID = 'portal-agenda-sync-status';
  const ACTION_ID = 'portal-agenda-sync-action';
  const AUTO_INTERVAL_MS = 15 * 60 * 1000;
  const RESULT_TIMEOUT_MS = 60 * 1000;
  const BRIDGE_WATCH_MS = 15 * 1000;
  const CONTACT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
  const CONTACT_CONCURRENCY = 1;
  const CONTACT_FRAME_TIMEOUT_MS = 15 * 1000;

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
  let everActivated = false;
  let detailPinned = false;
  let detailHideTimer = null;
  let currentStatusText = 'Sincronização automática ainda não ativada.';
  let currentTone = '';
  const contactCache = new Map();

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

  function normalizeSearch(value) {
    return compact(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function normalizePhone(value) {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (digits.length === 10 || digits.length === 11) digits = '55' + digits;
    return /^55\d{10,11}$/.test(digits) ? digits : '';
  }

  function consultationUrl(sourceId) {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    const basePath = url.pathname.replace(/\/consultas(?:\/.*)?$/, '/consultas/');
    url.pathname = basePath + encodeURIComponent(sourceId) + '/view';
    return url.toString();
  }

  function phoneFromRoot(root) {
    const selectors = [
      'input[name*="telefonecel" i]',
      'input[id*="telefonecel" i]',
      '[wire\\:model*="telefonecel" i]',
      'input[name*="telefone" i]',
      'input[id*="telefone" i]',
      '[wire\\:model*="telefone" i]',
      'input[name*="celular" i]',
      'input[id*="celular" i]'
    ];
    for (const selector of selectors) {
      for (const node of root.querySelectorAll(selector)) {
        const phone = normalizePhone(node.value || node.getAttribute('value') || node.textContent);
        if (phone) return phone;
      }
    }
    return '';
  }

  function patientAction(root) {
    return [...root.querySelectorAll('button, a, [role="button"]')]
      .find((node) => normalizeSearch(node.textContent).includes('ver dados do paciente')) || null;
  }

  async function extractContact(sourceId) {
    const cached = contactCache.get(sourceId);
    if (cached && cached.phone && Date.now() - cached.checkedAt < CONTACT_CACHE_TTL_MS) return cached.phone;

    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.style.cssText = [
      'position:fixed',
      'left:-10000px',
      'top:-10000px',
      'width:8px',
      'height:8px',
      'opacity:.01',
      'pointer-events:none',
      'border:0'
    ].join(';');

    const loaded = new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('Tempo excedido ao abrir a consulta.')), CONTACT_FRAME_TIMEOUT_MS);
      frame.addEventListener('load', () => {
        window.clearTimeout(timer);
        resolve();
      }, { once: true });
    });

    frame.src = consultationUrl(sourceId);
    document.body.appendChild(frame);

    try {
      await loaded;
      const frameWindow = frame.contentWindow;
      const root = frame.contentDocument;
      if (!frameWindow || !root) throw new Error('A consulta não ficou disponível para leitura.');

      if (/\/login(?:\/|$)/i.test(frameWindow.location.pathname)) {
        throw new Error('A sessão do DigSaúde expirou.');
      }

      let phone = phoneFromRoot(root);
      if (phone) {
        contactCache.set(sourceId, { phone, checkedAt: Date.now() });
        return phone;
      }

      const startedAt = Date.now();
      let clicked = false;
      while (Date.now() - startedAt < CONTACT_FRAME_TIMEOUT_MS) {
        if (/\/login(?:\/|$)/i.test(frameWindow.location.pathname)) {
          throw new Error('A sessão do DigSaúde expirou.');
        }

        phone = phoneFromRoot(root);
        if (phone) {
          contactCache.set(sourceId, { phone, checkedAt: Date.now() });
          return phone;
        }

        if (!clicked) {
          const action = patientAction(root);
          if (action) {
            action.click();
            clicked = true;
          }
        }

        await new Promise((resolve) => window.setTimeout(resolve, 180));
      }

      throw new Error(
        clicked
          ? 'O telefone não apareceu após abrir os dados do paciente.'
          : 'A ação Ver Dados do Paciente não foi localizada.'
      );
    } finally {
      frame.remove();
    }
  }

  async function enrichSnapshotContacts(snapshot) {
    const records = Array.isArray(snapshot?.records) ? snapshot.records : [];
    let cursor = 0;
    let failed = 0;

    const runner = async () => {
      while (cursor < records.length) {
        const index = cursor++;
        const record = records[index];
        setButton(`Automático ativo · contatos ${index + 1}/${records.length}…`, 'working');
        try {
          record.phone = await extractContact(record.sourceId);
        } catch (_) {
          record.phone = '';
          failed += 1;
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(CONTACT_CONCURRENCY, records.length || 1) }, () => runner()));
    return { total: records.length, failed };
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

  function widget() {
    return document.getElementById(WIDGET_ID);
  }

  function button() {
    return document.getElementById(BUTTON_ID);
  }

  function panel() {
    return document.getElementById(PANEL_ID);
  }

  function statusNode() {
    return document.getElementById(STATUS_ID);
  }

  function actionButton() {
    return document.getElementById(ACTION_ID);
  }

  function clearDetailHideTimer() {
    if (detailHideTimer) window.clearTimeout(detailHideTimer);
    detailHideTimer = null;
  }

  function showDetails({ pin = false } = {}) {
    clearDetailHideTimer();
    if (pin) detailPinned = true;
    const element = panel();
    if (!element) return;
    element.hidden = false;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    element.style.pointerEvents = 'auto';
    button()?.setAttribute('aria-expanded', 'true');
  }

  function hideDetails({ force = false } = {}) {
    if (detailPinned && !force) return;
    clearDetailHideTimer();
    const element = panel();
    if (!element) return;
    element.style.opacity = '0';
    element.style.transform = 'translateY(6px)';
    element.style.pointerEvents = 'none';
    button()?.setAttribute('aria-expanded', 'false');
    detailHideTimer = window.setTimeout(() => {
      if (!detailPinned) element.hidden = true;
    }, 160);
  }

  function scheduleHideDetails() {
    clearDetailHideTimer();
    detailHideTimer = window.setTimeout(() => hideDetails(), 220);
  }

  function toneBackground(tone) {
    if (tone === 'error') return '#a33434';
    if (tone === 'working') return '#315d86';
    return '#0d3157';
  }

  function updateActionButton() {
    const action = actionButton();
    if (!action) return;
    action.disabled = syncInFlight;
    if (autoEnabled) {
      action.textContent = syncInFlight ? 'Verificando…' : 'Verificar agora';
      return;
    }
    action.textContent = everActivated ? 'Reativar automático' : 'Ativar agora';
  }

  function setButton(text, tone = '') {
    currentStatusText = compact(text) || currentStatusText;
    currentTone = tone;

    const element = button();
    const status = statusNode();
    if (status) status.textContent = currentStatusText;
    if (!element) {
      updateActionButton();
      return;
    }

    const compactMode = everActivated || autoEnabled;
    element.dataset.tone = tone;
    element.dataset.compact = compactMode ? 'true' : 'false';
    element.style.background = toneBackground(tone);
    element.style.width = compactMode ? '38px' : 'auto';
    element.style.height = '38px';
    element.style.padding = compactMode ? '0' : '0 12px';
    element.style.borderRadius = compactMode ? '999px' : '12px';
    element.style.fontSize = compactMode ? '21px' : '12px';
    element.style.lineHeight = '1';
    element.style.minWidth = compactMode ? '38px' : '104px';
    element.textContent = compactMode ? '⟳' : 'Ativar sync';
    element.setAttribute(
      'aria-label',
      compactMode ? 'Status da sincronização automática da Agenda' : 'Ativar sincronização automática da Agenda'
    );
    element.setAttribute('aria-expanded', String(!panel()?.hidden));
    updateActionButton();
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
      const contactResult = await enrichSnapshotContacts(nextSnapshot);
      const nextFingerprint = fingerprint(nextSnapshot);

      if (!force && nextFingerprint === lastFingerprint) {
        syncInFlight = false;
        setButton(
          contactResult.failed
            ? `Automático ativo · sem mudanças · ${contactResult.failed} contato(s) pendente(s) · ${clock()}`
            : `Automático ativo · sem mudanças · ${clock()}`,
          contactResult.failed ? 'error' : 'success'
        );
        return;
      }

      pendingSnapshot = nextSnapshot;
      pendingFingerprint = nextFingerprint;
      pendingSyncId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      setButton(
        contactResult.failed
          ? `Automático ativo · enviando agenda · ${contactResult.failed} contato(s) pendente(s)…`
          : `Automático ativo · enviando ${nextSnapshot.records.length}…`,
        'working'
      );
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
      setButton('Não foi possível abrir a ponte do Portal. Libere pop-ups e tente novamente.', 'error');
      showDetails({ pin: true });
      window.alert('O navegador bloqueou a janela do Portal. Libere pop-ups para este site e tente novamente.');
      return;
    }

    everActivated = true;
    autoEnabled = true;
    detailPinned = false;
    hideDetails({ force: true });
    setButton('Conectando sincronização automática…', 'working');
    startAutomaticTimers();
  }

  function onButtonClick() {
    if (!everActivated && !autoEnabled) {
      activateAutomaticSync();
      return;
    }

    if (detailPinned) {
      detailPinned = false;
      hideDetails({ force: true });
      return;
    }

    showDetails({ pin: true });
  }

  function onActionClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (syncInFlight) return;
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

  function mountWidget() {
    if (widget()) return;

    const container = document.createElement('div');
    container.id = WIDGET_ID;
    container.style.cssText = [
      'position:fixed',
      'left:18px',
      'bottom:18px',
      'z-index:2147483646',
      'display:flex',
      'flex-direction:column',
      'align-items:flex-start',
      'gap:8px',
      'font-family:Inter,system-ui,sans-serif'
    ].join(';');

    const details = document.createElement('div');
    details.id = PANEL_ID;
    details.hidden = true;
    details.style.cssText = [
      'position:absolute',
      'left:0',
      'bottom:46px',
      'width:280px',
      'max-width:calc(100vw - 36px)',
      'padding:12px',
      'border:1px solid rgba(13,49,87,.16)',
      'border-radius:14px',
      'background:#fff',
      'color:#17324d',
      'box-shadow:0 12px 30px rgba(0,0,0,.18)',
      'opacity:0',
      'transform:translateY(6px)',
      'pointer-events:none',
      'transition:opacity .16s ease, transform .16s ease'
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Agenda automática';
    title.style.cssText = 'font:700 13px Inter,system-ui,sans-serif;margin-bottom:5px;';

    const status = document.createElement('div');
    status.id = STATUS_ID;
    status.textContent = currentStatusText;
    status.style.cssText = 'font:500 12px/1.45 Inter,system-ui,sans-serif;color:#526779;margin-bottom:10px;';

    const helper = document.createElement('div');
    helper.textContent = 'Verificação a cada 15 min enquanto o DigSaúde e a ponte do Portal estiverem abertos.';
    helper.style.cssText = 'font:400 11px/1.4 Inter,system-ui,sans-serif;color:#758697;margin-bottom:10px;';

    const action = document.createElement('button');
    action.id = ACTION_ID;
    action.type = 'button';
    action.style.cssText = [
      'border:0',
      'border-radius:9px',
      'padding:8px 10px',
      'background:#eef4fa',
      'color:#0d3157',
      'font:700 11px Inter,system-ui,sans-serif',
      'cursor:pointer'
    ].join(';');
    action.addEventListener('click', onActionClick);

    details.append(title, status, helper, action);

    const element = document.createElement('button');
    element.id = BUTTON_ID;
    element.type = 'button';
    element.title = '';
    element.style.cssText = [
      'border:0',
      'height:38px',
      'min-width:104px',
      'border-radius:12px',
      'padding:0 12px',
      'background:#0d3157',
      'color:#fff',
      'font:700 12px Inter,system-ui,sans-serif',
      'box-shadow:0 6px 18px rgba(0,0,0,.18)',
      'cursor:pointer',
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'transition:width .18s ease, min-width .18s ease, padding .18s ease, border-radius .18s ease, background .18s ease'
    ].join(';');
    element.addEventListener('click', onButtonClick);

    container.addEventListener('mouseenter', () => showDetails());
    container.addEventListener('mouseleave', scheduleHideDetails);
    container.addEventListener('focusin', () => showDetails());
    container.addEventListener('focusout', (event) => {
      if (!container.contains(event.relatedTarget)) scheduleHideDetails();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      detailPinned = false;
      hideDetails({ force: true });
    });

    container.append(details, element);
    document.body.appendChild(container);
    setButton(currentStatusText, currentTone);
  }

  mountWidget();
  new MutationObserver(mountWidget).observe(document.documentElement, { childList: true, subtree: true });
})();