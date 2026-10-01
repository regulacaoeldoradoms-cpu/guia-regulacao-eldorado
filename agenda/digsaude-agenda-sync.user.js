// ==UserScript==
// @name         Portal da Regulação - Sincronizar Agenda DigSaúde
// @namespace    https://regulacaoeldoradoms.com.br/
// @version      1.2.1
// @description  Sincroniza Agendados e os telefones dos pacientes com a Agenda protegida do Portal enquanto o DigSaúde estiver aberto.
// @match        https://teleatendimento.saude.ms.gov.br/*/consultas*
// @updateURL    https://regulacaoeldoradoms.com.br/agenda/digsaude-agenda-sync.user.js?v=20261001-contact-2
// @downloadURL  https://regulacaoeldoradoms.com.br/agenda/digsaude-agenda-sync.user.js?v=20261001-contact-2
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

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
  const CONTACT_TIMEOUT_MS = 14 * 1000;
  const CONTACT_CONCURRENCY = 2;
  const CONTACT_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
  const currentUrl = new URL(window.location.href);

  // O widget existe apenas na lista de consultas. A leitura dos contatos usa
  // GET + Livewire same-origin e nunca injeta outra instância do sincronizador.
  if (!/\/consultas\/?$/.test(currentUrl.pathname)) return;

  let portalWindow = null;
  let autoEnabled = false;
  let autoTimer = null;
  let bridgeWatchTimer = null;
  let retryTimer = null;
  let stopTimer = null;
  let pendingSnapshot = null;
  let pendingFingerprint = '';
  let pendingSyncId = '';
  let pendingMode = '';
  let pendingContactFailures = 0;
  let lastFingerprint = '';
  let lastPortalSyncAt = 0;
  let contactsPending = false;
  let lastCheckAt = 0;
  let syncInFlight = false;
  let everActivated = false;
  let detailPinned = false;
  let detailHideTimer = null;
  let currentStatusText = 'Sincronização automática ainda não ativada.';
  let currentTone = '';

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

  function phoneDigits(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 13 ? digits : '';
  }

  function phoneFromDocument(root) {
    if (!root) return '';
    const selectors = [
      'input[name*="telefonecel" i]',
      'input[id*="telefonecel" i]',
      'input[name*="telefone" i]',
      'input[id*="telefone" i]',
      '[wire\\:model*="telefonecel" i]',
      '[wire\\:model*="telefone" i]'
    ];
    for (const selector of selectors) {
      const field = root.querySelector(selector);
      const phone = phoneDigits(field?.value || field?.getAttribute?.('value') || '');
      if (phone) return phone;
    }
    return '';
  }

  function phoneFromValue(value, depth = 0, seen = new WeakSet()) {
    if (depth > 10 || value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return '';

    if (typeof value !== 'object') return '';
    if (seen.has(value)) return '';
    seen.add(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        const phone = phoneFromValue(item, depth + 1, seen);
        if (phone) return phone;
      }
      return '';
    }

    for (const [key, item] of Object.entries(value)) {
      if (/telefone(?:cel)?|celular|fone/i.test(key)) {
        const phone = phoneDigits(item);
        if (phone) return phone;
      }
    }
    for (const item of Object.values(value)) {
      const phone = phoneFromValue(item, depth + 1, seen);
      if (phone) return phone;
    }
    return '';
  }

  function phoneFromSnapshot(snapshot) {
    try {
      return phoneFromValue(JSON.parse(String(snapshot || '')));
    } catch (_) {
      return '';
    }
  }

  function patientDataTrigger(root) {
    if (!root) return null;
    return [...root.querySelectorAll('button, a')].find((node) =>
      compact(node.textContent).toLocaleLowerCase('pt-BR').includes('ver dados do paciente')
    ) || null;
  }

  function consultationViewUrl(sourceId) {
    const url = new URL(window.location.href);
    const basePath = url.pathname.replace(/\/consultas(?:\/.*)?$/, '/consultas');
    url.pathname = `${basePath}/${encodeURIComponent(sourceId)}/view`;
    url.search = '';
    url.hash = '';
    return url.toString();
  }

  async function fetchWithContactTimeout(url, options = {}) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (error) {
      if (String(error?.name || '') === 'AbortError') {
        throw new Error('Tempo esgotado ao consultar os Dados do Paciente.');
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function csrfToken(root) {
    return compact(root?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');
  }

  function wireClickExpression(node) {
    if (!node) return '';
    for (const attribute of [...node.attributes]) {
      const name = String(attribute.name || '').toLowerCase();
      if (name === 'wire:click' || name.startsWith('wire:click.')) {
        return compact(attribute.value);
      }
    }
    return '';
  }

  function parseWireArguments(source) {
    const input = String(source || '');
    const values = [];
    let index = 0;

    function skipSeparators() {
      while (index < input.length && /[\s,]/.test(input[index])) index += 1;
    }

    skipSeparators();
    while (index < input.length) {
      const char = input[index];

      if (char === "'" || char === '"') {
        const quote = char;
        index += 1;
        let value = '';
        let closed = false;
        while (index < input.length) {
          const next = input[index];
          index += 1;
          if (next === '\\' && index < input.length) {
            value += input[index];
            index += 1;
            continue;
          }
          if (next === quote) {
            closed = true;
            break;
          }
          value += next;
        }
        if (!closed) throw new Error('A ação de Dados do Paciente possui parâmetros não reconhecidos.');
        values.push(value);
      } else {
        const start = index;
        while (index < input.length && input[index] !== ',') index += 1;
        const token = input.slice(start, index).trim();
        if (!token) throw new Error('A ação de Dados do Paciente possui parâmetros vazios.');
        if (/^-?\d+(?:\.\d+)?$/.test(token)) values.push(Number(token));
        else if (token === 'true') values.push(true);
        else if (token === 'false') values.push(false);
        else if (token === 'null') values.push(null);
        else throw new Error('A ação de Dados do Paciente usa um parâmetro Livewire não suportado.');
      }
      skipSeparators();
    }
    return values;
  }

  function livewireCallFromTrigger(trigger) {
    let expression = wireClickExpression(trigger);
    expression = expression.replace(/^\$wire\./, '').trim();
    const match = /^([A-Za-z_$][\w$]*)\s*\(([\s\S]*)\)$/.exec(expression);
    if (!match) throw new Error('Não foi possível identificar a ação Livewire de Dados do Paciente.');
    return {
      method: match[1],
      params: parseWireArguments(match[2])
    };
  }

  function livewireComponentForTrigger(root, trigger) {
    const component = trigger?.closest?.('[wire\\:id][wire\\:snapshot]')
      || root?.querySelector?.('[wire\\:id][wire\\:snapshot]');
    const snapshot = String(component?.getAttribute?.('wire:snapshot') || '');
    if (!snapshot) throw new Error('O componente Livewire da consulta não foi localizado.');
    return { component, snapshot };
  }

  function livewireUpdateUrl(root, html) {
    const scripted = root?.querySelector?.('script[data-update-uri]')?.getAttribute?.('data-update-uri');
    if (scripted) return new URL(scripted, window.location.origin).toString();

    const source = String(html || '');
    const dataMatch = source.match(/data-update-uri=["']([^"']*livewire\/update[^"']*)["']/i);
    if (dataMatch?.[1]) return new URL(dataMatch[1].replace(/&amp;/g, '&'), window.location.origin).toString();

    const configMatch = source.match(/["']uri["']\s*:\s*["']([^"']*livewire\/update[^"']*)["']/i);
    if (configMatch?.[1]) return new URL(configMatch[1].replace(/\\\//g, '/'), window.location.origin).toString();

    return new URL('/livewire/update', window.location.origin).toString();
  }

  function phoneFromLivewireResponse(payload) {
    const components = Array.isArray(payload?.components) ? payload.components : [];
    for (const component of components) {
      const snapshotPhone = phoneFromSnapshot(component?.snapshot);
      if (snapshotPhone) return snapshotPhone;

      const html = String(component?.effects?.html || '');
      if (html) {
        const root = new DOMParser().parseFromString(html, 'text/html');
        const htmlPhone = phoneFromDocument(root);
        if (htmlPhone) return htmlPhone;
      }
    }
    return '';
  }

  async function contactForSourceId(sourceId) {
    const pageResponse = await fetchWithContactTimeout(consultationViewUrl(sourceId), {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'text/html' }
    });

    const finalUrl = new URL(pageResponse.url || consultationViewUrl(sourceId));
    if (!pageResponse.ok || /\/login(?:\/|$)/i.test(finalUrl.pathname)) {
      throw new Error('A sessão do DigSaúde expirou ou a consulta não pôde ser carregada.');
    }

    const html = await pageResponse.text();
    const root = new DOMParser().parseFromString(html, 'text/html');

    const direct = phoneFromDocument(root);
    if (direct) return direct;

    const trigger = patientDataTrigger(root);
    if (!trigger) throw new Error('A ação Ver Dados do Paciente não foi localizada.');

    const { snapshot } = livewireComponentForTrigger(root, trigger);
    const embedded = phoneFromSnapshot(snapshot);
    if (embedded) return embedded;

    const call = livewireCallFromTrigger(trigger);
    const token = csrfToken(root);
    if (!token) throw new Error('O token local da página do DigSaúde não foi localizado.');

    const updateResponse = await fetchWithContactTimeout(livewireUpdateUrl(root, html), {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
        'X-Livewire': 'true'
      },
      body: JSON.stringify({
        _token: token,
        components: [{
          snapshot,
          updates: {},
          calls: [{
            path: '',
            method: call.method,
            params: call.params
          }]
        }]
      })
    });

    if (!updateResponse.ok) {
      if (updateResponse.status === 419 || updateResponse.status === 401 || updateResponse.status === 403) {
        throw new Error('A sessão do DigSaúde expirou. Entre novamente no sistema.');
      }
      throw new Error('O DigSaúde não retornou os Dados do Paciente.');
    }

    const payload = await updateResponse.json().catch(() => null);
    const phone = phoneFromLivewireResponse(payload);
    if (phone) return phone;

    throw new Error('O telefone não foi localizado na resposta dos Dados do Paciente.');
  }

  async function contactSnapshot(baseSnapshot, sourceIds) {
    const wanted = new Set((sourceIds || []).map((value) => compact(value)).filter(Boolean));
    const candidates = (baseSnapshot?.records || []).filter((record) => wanted.has(record.sourceId));
    const enriched = new Array(candidates.length);
    let cursor = 0;
    let completed = 0;
    let failed = 0;

    async function worker() {
      while (cursor < candidates.length) {
        const index = cursor;
        cursor += 1;
        const record = candidates[index];
        try {
          const patientPhone = await contactForSourceId(record.sourceId);
          enriched[index] = patientPhone ? { ...record, patientPhone } : null;
          if (!patientPhone) failed += 1;
        } catch (_) {
          enriched[index] = null;
          failed += 1;
        } finally {
          completed += 1;
          setButton(`Automático ativo · localizando contatos ${completed}/${candidates.length}…`, 'working');
        }
      }
    }

    const workers = Array.from({ length: Math.min(CONTACT_CONCURRENCY, candidates.length) }, () => worker());
    await Promise.all(workers);
    const records = enriched.filter(Boolean);
    return {
      failed,
      snapshot: {
        source: 'digsaude-agendados-contact-v1',
        capturedAt: new Date().toISOString(),
        totalCount: records.length,
        complete: false,
        contactPass: true,
        records
      }
    };
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
      pendingMode = '';
      pendingContactFailures = 0;
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
    pendingMode = '';
    pendingContactFailures = 0;
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

      const contactRefreshDue = !lastPortalSyncAt || Date.now() - lastPortalSyncAt >= CONTACT_REFRESH_INTERVAL_MS;
      if (!force && nextFingerprint === lastFingerprint && !contactsPending && !contactRefreshDue) {
        syncInFlight = false;
        setButton(`Automático ativo · sem mudanças · ${clock()}`, 'success');
        return;
      }

      pendingSnapshot = nextSnapshot;
      pendingFingerprint = nextFingerprint;
      pendingSyncId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      pendingMode = 'agenda';
      pendingContactFailures = 0;
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

  window.addEventListener('message', async (event) => {
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

    if (!event.data.ok) {
      syncInFlight = false;
      pendingSnapshot = null;
      pendingFingerprint = '';
      pendingSyncId = '';
      pendingMode = '';
      pendingContactFailures = 0;
      setButton('Automático ativo · falha ao enviar; tentará novamente', 'error');
      return;
    }

    if (pendingMode === 'agenda') {
      lastFingerprint = pendingFingerprint;
      lastPortalSyncAt = Date.now();
      const baseSnapshot = pendingSnapshot;
      const created = Number(event.data.created || 0);
      const changed = Number(event.data.changed || 0);
      const suffix = created || changed ? `+${created} / ~${changed}` : 'sem mudanças';
      const refreshIds = Array.isArray(event.data.contactRefreshSourceIds)
        ? event.data.contactRefreshSourceIds.map((value) => compact(value)).filter(Boolean)
        : [];

      pendingSnapshot = null;
      pendingFingerprint = '';
      pendingSyncId = '';
      pendingMode = '';

      contactsPending = refreshIds.length > 0;
      if (refreshIds.length) {
        setButton(`Automático ativo · localizando ${refreshIds.length} contato(s)…`, 'working');
        try {
          const contacts = await contactSnapshot(baseSnapshot, refreshIds);
          pendingContactFailures = contacts.failed;
          if (contacts.snapshot.records.length) {
            pendingSnapshot = contacts.snapshot;
            pendingSyncId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
            pendingMode = 'contacts';
            setButton(`Automático ativo · salvando ${contacts.snapshot.records.length} contato(s)…`, 'working');
            scheduleDeliveryRetry();
            return;
          }
          syncInFlight = false;
          setButton(`Automático ativo · agenda atualizada; falha ao localizar ${contacts.failed} contato(s)`, 'error');
          return;
        } catch (_) {
          syncInFlight = false;
          pendingContactFailures = 0;
          setButton('Automático ativo · agenda atualizada; falha ao localizar contatos', 'error');
          return;
        }
      }

      syncInFlight = false;
      setButton(`Automático ativo · ${suffix} · ${clock()}`, 'success');
      return;
    }

    if (pendingMode === 'contacts') {
      const updated = Number(event.data.contactsUpdated || 0);
      const failed = pendingContactFailures;
      syncInFlight = false;
      pendingSnapshot = null;
      pendingFingerprint = '';
      pendingSyncId = '';
      pendingMode = '';
      pendingContactFailures = 0;
      contactsPending = failed > 0;
      if (failed) {
        setButton(`Automático ativo · ${updated} contato(s) sincronizado(s); ${failed} falha(s) · ${clock()}`, 'error');
      } else {
        setButton(`Automático ativo · ${updated} contato(s) sincronizado(s) · ${clock()}`, 'success');
      }
      return;
    }

    syncInFlight = false;
    pendingSnapshot = null;
    pendingFingerprint = '';
    pendingSyncId = '';
    pendingMode = '';
    pendingContactFailures = 0;
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