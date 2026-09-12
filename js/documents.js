'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const config = window.REGULATION_AUTH_CONFIG || {};
  const endpoint = String(config.endpoint || '').replace(/\/$/, '');
  const documentCache = window.PortalDocumentCache || null;
  const cacheWarmInFlight = new Map();
  let cacheWarmTimer = null;
  const user = await auth.requireRole([]);
  if (!user) return;

  if (user.mustChangePassword) {
    location.replace('/seguranca/?primeiro-acesso=1');
    return;
  }

  const state = {
    user,
    access: null,
    stack: [],
    items: [],
    nextPageToken: '',
    searchQuery: '',
    searchMode: false,
    loading: false,
    pdfObjectUrl: '',
    pdfOpenedAt: 0,
    pdfOpenId: 0,
    pdfStreamId: '',
    pdfStreamRef: '',
    pdfStreamHeartbeat: null,
    pdfItem: null,
    pdfFallbackStarted: false,
    pdfProgressiveFailed: false,
    pdfFirstPageObserver: null,
    pdfFirstPageEmitted: false,
    cachePrefetchGeneration: 0,
    editorSession: null,
    editorPreviewUrl: '',
    editorPreviewTimer: null,
    editorBuildSeq: 0,
    editorMergedKeys: new Set()
  };

  const els = {
    userName: document.getElementById('portalUserName'),
    userRole: document.getElementById('portalUserRole'),
    logout: document.getElementById('portalLogout'),
    badge: document.getElementById('driveConnectionBadge'),
    status: document.getElementById('documentsGlobalStatus'),
    setup: document.getElementById('documentsSetup'),
    setupMessage: document.getElementById('driveSetupMessage'),
    connect: document.getElementById('connectDriveButton'),
    manageAccess: document.getElementById('manageDocumentsAccessLink'),
    disconnect: document.getElementById('disconnectDriveButton'),
    workspace: document.getElementById('documentsWorkspace'),
    searchForm: document.getElementById('documentsSearchForm'),
    search: document.getElementById('documentsSearch'),
    refreshFolder: document.getElementById('refreshFolderButton'),
    breadcrumbs: document.getElementById('documentsBreadcrumbs'),
    list: document.getElementById('documentsList'),
    listTitle: document.getElementById('documentsListTitle'),
    listCount: document.getElementById('documentsListCount'),
    pagination: document.getElementById('documentsPagination'),
    loadMore: document.getElementById('loadMoreButton'),
    viewer: document.getElementById('documentsViewer'),
    viewerModeLabel: document.getElementById('documentsViewerModeLabel'),
    viewerTitle: document.getElementById('documentsViewerTitle'),
    viewerState: document.getElementById('documentsViewerState'),
    frame: document.getElementById('documentsPdfFrame'),
    editPdf: document.getElementById('editPdfButton'),
    closeViewer: document.getElementById('closeViewerButton'),
    editor: document.getElementById('documentsEditor'),
    editorStatus: document.getElementById('documentsEditorStatus'),
    editorPages: document.getElementById('documentsEditorPages'),
    editorPageCount: document.getElementById('documentsEditorPageCount'),
    editorUndo: document.getElementById('editorUndoButton'),
    editorRedo: document.getElementById('editorRedoButton'),
    editorPreview: document.getElementById('editorPreviewButton'),
    editorExit: document.getElementById('editorExitButton')
  };

  els.userName.textContent = user.name || user.username || 'Usuário';
  els.userRole.textContent = window.PortalTools?.roleLabels?.[user.role] || user.role || '';

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function showStatus(message = '', type = 'info') {
    els.status.innerHTML = message
      ? `<div class="portal-note ${type}">${escapeHtml(message)}</div>`
      : '';
  }

  function capture(event, properties) {
    const send = () => window.PortalObservability?.capture?.(event, properties);
    if (!send()) window.setTimeout(send, 1100);
  }

  function duration(started) {
    return Math.max(0, Math.round(performance.now() - started));
  }

  function sizeBucket(size) {
    const bytes = Number(size || 0);
    if (!(bytes > 0)) return 'unknown';
    if (bytes < 250 * 1024) return 'tiny';
    if (bytes < 2 * 1024 * 1024) return 'small';
    if (bytes < 10 * 1024 * 1024) return 'medium';
    if (bytes < 40 * 1024 * 1024) return 'large';
    return 'very_large';
  }

  function resultCountBucket(count) {
    const value = Number(count || 0);
    if (value <= 0) return '0';
    if (value <= 5) return '1-5';
    if (value <= 20) return '6-20';
    if (value <= 100) return '21-100';
    return '100+';
  }

  function currentToken() {
    return String(auth.getToken?.() || '');
  }

  function cacheDescriptor(item) {
    const cacheKey = String(item?.cacheKey || '');
    const version = String(item?.version || '');
    return cacheKey && version && item?.isPdf
      ? { cacheKey, version, token: currentToken() }
      : null;
  }

  function connectionAllowsPrefetch() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection?.saveData) return false;
    return !['slow-2g', '2g'].includes(String(connection?.effectiveType || ''));
  }

  async function fetchPdfBlob(item) {
    const response = await fetch(`${endpoint}/api/documents/drive/content/${encodeURIComponent(item.ref)}`, {
      method: 'GET',
      headers: auth.authorizationHeader(),
      cache: 'no-store',
      credentials: 'omit'
    });
    if (!response.ok) {
      let message = `Não foi possível abrir o PDF (${response.status}).`;
      if ((response.headers.get('Content-Type') || '').includes('application/json')) {
        const payload = await response.json().catch(() => ({}));
        if (payload?.error) message = payload.error;
      }
      throw new Error(message);
    }
    return response.blob();
  }

  async function readCachedPdf(item) {
    const descriptor = cacheDescriptor(item);
    if (!descriptor || !documentCache?.get) return null;
    const key = `${descriptor.cacheKey}:${descriptor.version}`;
    const warming = cacheWarmInFlight.get(key);
    if (warming) {
      await Promise.race([
        warming.catch(() => false),
        new Promise((resolve) => window.setTimeout(resolve, 350))
      ]);
    }
    return documentCache.get(descriptor).catch(() => null);
  }

  async function storeCachedPdf(item, blob) {
    const descriptor = cacheDescriptor(item);
    if (!descriptor || !documentCache?.put || !(blob instanceof Blob)) return false;
    return documentCache.put({ ...descriptor, blob }).catch(() => false);
  }

  async function warmPdfCache(item, { prefetch = false } = {}) {
    const descriptor = cacheDescriptor(item);
    if (!descriptor || !documentCache?.has || !documentCache?.put) return false;
    const size = Number(item?.size || 0);
    const limits = documentCache.limits || {};
    const maximum = prefetch ? Number(limits.prefetchFileBytes || 0) : Number(limits.maxFileBytes || 0);
    if (maximum > 0 && (!(size > 0) || size > maximum)) return false;
    if (prefetch && !connectionAllowsPrefetch()) return false;

    const key = `${descriptor.cacheKey}:${descriptor.version}`;
    const existing = cacheWarmInFlight.get(key);
    if (existing) return existing;

    const task = (async () => {
      if (await documentCache.has(descriptor).catch(() => false)) return true;
      try {
        const blob = await fetchPdfBlob(item);
        return await storeCachedPdf(item, blob);
      } catch (_) {
        return false;
      }
    })();

    cacheWarmInFlight.set(key, task);
    try {
      return await task;
    } finally {
      if (cacheWarmInFlight.get(key) === task) cacheWarmInFlight.delete(key);
    }
  }

  function scheduleLikelyPdfWarmup() {
    if (!documentCache?.supported?.() || !connectionAllowsPrefetch()) return;
    if (cacheWarmTimer) clearTimeout(cacheWarmTimer);
    const generation = ++state.cachePrefetchGeneration;
    const run = async () => {
      cacheWarmTimer = null;
      if (generation !== state.cachePrefetchGeneration || document.visibilityState === 'hidden') return;
      const candidates = state.items
        .filter((item) => item?.isPdf && item.cacheKey && item.version)
        .filter((item) => Number(item.size || 0) > 0)
        .filter((item) => Number(item.size || 0) <= Number(documentCache.limits?.prefetchFileBytes || 0))
        .slice(0, 3);
      for (const item of candidates) {
        if (generation !== state.cachePrefetchGeneration || document.visibilityState === 'hidden') break;
        await warmPdfCache(item, { prefetch: true });
      }
    };

    if (typeof requestIdleCallback === 'function') {
      cacheWarmTimer = window.setTimeout(() => requestIdleCallback(run, { timeout: 1800 }), 700);
    } else {
      cacheWarmTimer = window.setTimeout(run, 1200);
    }
  }

  function warmPdfFromListEvent(event) {
    const button = event.target.closest?.('[data-index]');
    if (!button) return;
    const item = state.items[Number(button.dataset.index)];
    if (!item?.isPdf) return;
    warmPdfCache(item, { prefetch: true }).catch(() => {});
  }

  function canEditDocuments() {
    const caps = state.access?.capabilities || state.user?.documentCapabilities || {};
    return caps.edit === true;
  }

  function itemCacheIdentity(item) {
    const descriptor = cacheDescriptor(item);
    return descriptor ? `${descriptor.cacheKey}:${descriptor.version}` : '';
  }

  async function editablePdfBlob(item) {
    const cached = await readCachedPdf(item);
    if (cached) return cached;
    const blob = await fetchPdfBlob(item);
    storeCachedPdf(item, blob).catch(() => {});
    return blob;
  }

  function setEditorStatus(message = '', type = '') {
    if (!els.editorStatus) return;
    els.editorStatus.textContent = String(message || '');
    els.editorStatus.className = `documents-editor-status${type ? ` ${type}` : ''}`;
  }

  function clearEditorPreview() {
    if (state.editorPreviewTimer) {
      clearTimeout(state.editorPreviewTimer);
      state.editorPreviewTimer = null;
    }
    if (state.editorPreviewUrl) URL.revokeObjectURL(state.editorPreviewUrl);
    state.editorPreviewUrl = '';
    state.editorBuildSeq += 1;
  }

  function resetEditorState({ restoreOriginal = false } = {}) {
    clearEditorPreview();
    state.editorSession = null;
    state.editorMergedKeys = new Set();
    if (els.editor) els.editor.hidden = true;
    if (els.viewerModeLabel) els.viewerModeLabel.textContent = 'Visualização';
    if (els.editPdf) els.editPdf.hidden = !(canEditDocuments() && state.pdfItem);
    setEditorStatus('');
    if (restoreOriginal && state.pdfObjectUrl) {
      els.frame.src = state.pdfObjectUrl;
    }
  }

  function renderEditorPages() {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    if (!editor || !session) {
      if (els.editorPages) els.editorPages.innerHTML = '';
      if (els.editorPageCount) els.editorPageCount.textContent = '';
      return;
    }

    const pages = editor.pageModel(session);
    els.editorPageCount.textContent = `${pages.length} página(s)`;
    els.editorUndo.disabled = !editor.canUndo(session);
    els.editorRedo.disabled = !editor.canRedo(session);

    els.editorPages.innerHTML = pages.map((page) => `<article class="documents-editor-page" data-editor-index="${page.index}">
      <div class="documents-editor-page-copy">
        <strong>Página ${page.displayPage}</strong>
        <span>${escapeHtml(page.sourceLabel)} · página original ${page.sourcePage}</span>
      </div>
      <div class="documents-editor-page-actions">
        <button type="button" data-editor-action="up" aria-label="Mover página para cima" ${page.index === 0 ? 'disabled' : ''}>↑</button>
        <button type="button" data-editor-action="down" aria-label="Mover página para baixo" ${page.index === pages.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="danger" type="button" data-editor-action="delete" aria-label="Excluir página" ${pages.length <= 1 ? 'disabled' : ''}>Excluir</button>
      </div>
    </article>`).join('');
  }

  async function buildEditorPreview({ explicit = false } = {}) {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    if (!editor || !session) return;

    const seq = ++state.editorBuildSeq;
    els.editorPreview.disabled = true;
    setEditorStatus(explicit ? 'Gerando prévia local…' : 'Atualizando prévia…');
    const started = performance.now();

    try {
      const blob = await editor.buildBlob(session);
      if (seq !== state.editorBuildSeq || session !== state.editorSession) return;
      if (state.editorPreviewUrl) URL.revokeObjectURL(state.editorPreviewUrl);
      state.editorPreviewUrl = URL.createObjectURL(blob);
      els.viewerState.className = 'documents-viewer-state';
      els.viewerState.textContent = 'Carregando prévia editada…';
      els.frame.addEventListener('load', () => {
        if (seq !== state.editorBuildSeq) return;
        els.viewerState.className = 'documents-viewer-state ready';
        setEditorStatus(`Prévia local pronta em ${duration(started)} ms.`, 'success');
      }, { once: true });
      els.frame.src = state.editorPreviewUrl;
    } catch (error) {
      setEditorStatus(error.message || 'Não foi possível gerar a prévia.', 'warning');
    } finally {
      if (seq === state.editorBuildSeq) els.editorPreview.disabled = false;
    }
  }

  function scheduleEditorPreview() {
    if (state.editorPreviewTimer) clearTimeout(state.editorPreviewTimer);
    state.editorPreviewTimer = window.setTimeout(() => {
      state.editorPreviewTimer = null;
      buildEditorPreview().catch(() => {});
    }, 220);
  }

  async function startEditor() {
    if (!canEditDocuments()) {
      showStatus('Sua conta não possui permissão de edição de PDF.', 'warning');
      return;
    }
    if (!state.pdfItem || !window.PortalPdfEditor) return;

    els.editPdf.disabled = true;
    els.viewerState.className = 'documents-viewer-state';
    els.viewerState.textContent = 'Preparando editor local…';

    try {
      releaseProgressiveStream();
      const blob = await editablePdfBlob(state.pdfItem);
      if (!state.pdfObjectUrl) state.pdfObjectUrl = URL.createObjectURL(blob);
      const session = await window.PortalPdfEditor.createSession(blob, { label: 'Documento inicial' });
      state.editorSession = session;
      state.editorMergedKeys = new Set([itemCacheIdentity(state.pdfItem)].filter(Boolean));
      els.editor.hidden = false;
      els.viewerModeLabel.textContent = 'Editor PDF';
      els.editPdf.hidden = true;
      els.viewerState.className = 'documents-viewer-state ready';
      setEditorStatus('Editor pronto. Alterações são locais e reversíveis; nada será salvo no Drive nesta fase.', 'success');
      renderEditorPages();
      els.editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      els.viewerState.className = 'documents-viewer-state ready';
      showStatus(error.message || 'Não foi possível iniciar o editor PDF.', 'warning');
    } finally {
      els.editPdf.disabled = false;
    }
  }

  async function mergePdfIntoEditor(item) {
    if (!state.editorSession || !item?.isPdf || !canEditDocuments()) return;
    const identity = itemCacheIdentity(item);
    if (identity && state.editorMergedKeys.has(identity)) {
      setEditorStatus('Esse PDF já faz parte da sessão de edição.', 'warning');
      return;
    }

    const started = performance.now();
    setEditorStatus('Adicionando PDF ao resultado…');
    try {
      const blob = await editablePdfBlob(item);
      const sourceNumber = window.PortalPdfEditor.sourceCount(state.editorSession) + 1;
      await window.PortalPdfEditor.addDocument(state.editorSession, blob, { label: `Documento ${sourceNumber}` });
      if (identity) state.editorMergedKeys.add(identity);
      renderEditorPages();
      scheduleEditorPreview();
      capture('pdf_edit_completed', {
        route: '/documentos/',
        duration_ms: duration(started),
        operation: 'merge_pdf',
        size_bucket: sizeBucket(item.size)
      });
      setEditorStatus('PDF adicionado. A prévia está sendo atualizada.', 'success');
    } catch (error) {
      setEditorStatus(error.message || 'Não foi possível unir este PDF.', 'warning');
    }
  }

  function applyEditorOperation(operation, index) {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    if (!editor || !session) return;
    const started = performance.now();
    let changed = false;

    if (operation === 'delete') changed = editor.removePage(session, index);
    if (operation === 'up') changed = editor.movePage(session, index, -1);
    if (operation === 'down') changed = editor.movePage(session, index, 1);
    if (!changed) return;

    renderEditorPages();
    scheduleEditorPreview();
    capture('pdf_edit_completed', {
      route: '/documentos/',
      duration_ms: duration(started),
      operation: operation === 'delete' ? 'delete_page' : 'reorder_page',
      size_bucket: sizeBucket(state.pdfItem?.size)
    });
  }

  function undoEditor() {
    if (!state.editorSession || !window.PortalPdfEditor?.undo(state.editorSession)) return;
    renderEditorPages();
    scheduleEditorPreview();
  }

  function redoEditor() {
    if (!state.editorSession || !window.PortalPdfEditor?.redo(state.editorSession)) return;
    renderEditorPages();
    scheduleEditorPreview();
  }

  function exitEditor() {
    resetEditorState({ restoreOriginal: true });
  }

  function randomViewId() {
    try {
      if (crypto.randomUUID) return crypto.randomUUID();
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
    } catch (_) {
      return 'view-' + Math.round(performance.now()).toString(16) + '-' + Math.random().toString(16).slice(2);
    }
  }

  function documentStreamPayload(viewId, ref) {
    const authorization = String(auth.authorizationHeader?.().Authorization || '');
    if (!viewId || !ref || !authorization || !endpoint) return null;
    return {
      type: 'PORTAL_DOCUMENT_STREAM_REGISTER',
      viewId,
      ref,
      endpoint,
      authorization
    };
  }

  function releaseProgressiveStream() {
    if (state.pdfStreamHeartbeat) {
      clearInterval(state.pdfStreamHeartbeat);
      state.pdfStreamHeartbeat = null;
    }
    const viewId = state.pdfStreamId;
    state.pdfStreamId = '';
    state.pdfStreamRef = '';
    if (!viewId || !navigator.serviceWorker?.controller) return;
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'PORTAL_DOCUMENT_STREAM_RELEASE',
        viewId
      });
    } catch (_) {}
  }

  function refreshProgressiveStream() {
    if (!state.pdfStreamId || !state.pdfStreamRef || !navigator.serviceWorker?.controller) return;
    const payload = documentStreamPayload(state.pdfStreamId, state.pdfStreamRef);
    if (!payload) return;
    try { navigator.serviceWorker.controller.postMessage(payload); } catch (_) {}
  }

  async function registerProgressiveStream(item) {
    const controller = navigator.serviceWorker?.controller;
    if (!controller || typeof MessageChannel !== 'function') return '';

    const viewId = randomViewId();
    const payload = documentStreamPayload(viewId, item?.ref);
    if (!payload) return '';

    const response = await new Promise((resolve) => {
      const channel = new MessageChannel();
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try { channel.port1.close(); } catch (_) {}
        resolve(value || null);
      };
      const timer = window.setTimeout(() => finish(null), 900);
      channel.port1.onmessage = (event) => finish(event.data);
      try {
        controller.postMessage(payload, [channel.port2]);
      } catch (_) {
        finish(null);
      }
    });

    if (!response?.ok || !String(response.url || '').startsWith('/__portal_document_pdf/')) return '';

    state.pdfStreamId = viewId;
    state.pdfStreamRef = String(item.ref || '');
    state.pdfStreamHeartbeat = window.setInterval(refreshProgressiveStream, 5000);
    return String(response.url);
  }

  function frameVisibleInViewport() {
    if (els.viewer.hidden || document.visibilityState === 'hidden') return false;
    const rect = els.frame.getBoundingClientRect();
    const width = window.innerWidth || document.documentElement.clientWidth || 0;
    const height = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.width > 0
      && rect.height > 0
      && rect.bottom > 0
      && rect.right > 0
      && rect.top < height
      && rect.left < width;
  }

  function emitFirstPageVisible(openId, bucket, cacheState, source = 'drive') {
    if (state.pdfFirstPageEmitted || openId !== state.pdfOpenId) return;
    if (!frameVisibleInViewport()) return;
    state.pdfFirstPageEmitted = true;
    state.pdfFirstPageObserver?.disconnect?.();
    state.pdfFirstPageObserver = null;
    capture('pdf_first_page_visible', {
      route: '/documentos/',
      duration_ms: duration(state.pdfOpenedAt),
      source,
      size_bucket: bucket,
      cache_state: cacheState
    });
  }

  function observeFirstPageVisible(openId, bucket, cacheState, source = 'drive') {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (openId !== state.pdfOpenId) return;
        emitFirstPageVisible(openId, bucket, cacheState, source);
        if (state.pdfFirstPageEmitted || typeof IntersectionObserver !== 'function') return;
        state.pdfFirstPageObserver?.disconnect?.();
        state.pdfFirstPageObserver = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0)) {
            emitFirstPageVisible(openId, bucket, cacheState, source);
          }
        }, { threshold: 0.01 });
        state.pdfFirstPageObserver.observe(els.frame);
      });
    });
  }

  function markViewerReady(openId, bucket, cacheState, progressive, source = 'drive') {
    window.setTimeout(() => {
      if (openId !== state.pdfOpenId || (progressive && state.pdfProgressiveFailed)) return;
      els.viewerState.className = 'documents-viewer-state ready';
      capture('pdf_ready', {
        route: '/documentos/',
        duration_ms: duration(state.pdfOpenedAt),
        source,
        size_bucket: bucket,
        cache_state: cacheState
      });
      observeFirstPageVisible(openId, bucket, cacheState, source);
    }, progressive ? 100 : 40);
  }

  async function loadPdfBlobFallback(item, openId, bucket) {
    if (openId !== state.pdfOpenId || state.pdfFallbackStarted) return;
    state.pdfFallbackStarted = true;
    releaseProgressiveStream();
    els.viewerState.textContent = 'Carregando PDF em modo compatível…';
    els.viewerState.className = 'documents-viewer-state';

    const blob = await fetchPdfBlob(item);
    if (openId !== state.pdfOpenId) return;
    storeCachedPdf(item, blob).catch(() => {});
    state.pdfObjectUrl = URL.createObjectURL(blob);
    els.frame.addEventListener('load', () => {
      markViewerReady(openId, sizeBucket(blob.size || item.size), 'miss', false, 'drive');
    }, { once: true });
    els.frame.src = state.pdfObjectUrl;
  }

  function formatSize(size) {
    const bytes = Number(size);
    if (!Number.isFinite(bytes) || bytes < 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let value = bytes / 1024;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit += 1;
    }
    return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
  }

  function formatDate(value) {
    const date = new Date(String(value || ''));
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  }

  function itemSubtitle(item) {
    const parts = [];
    if (item.isFolder) parts.push('Pasta');
    else if (item.isPdf) parts.push('PDF');
    else parts.push('Arquivo');
    const size = formatSize(item.size);
    const modified = formatDate(item.modifiedTime);
    if (size) parts.push(size);
    if (modified) parts.push(`modificado ${modified}`);
    return parts.join(' · ');
  }

  function api(path, options = {}) {
    return auth.api(path, options);
  }

  async function loadAccess() {
    state.access = await api('/api/documents/access', { method: 'GET' });
    state.user = auth.getCachedUser() || state.user;
    renderAccessState();
  }

  function renderAccessState() {
    const caps = state.access?.capabilities || state.user?.documentCapabilities || {};
    const drive = state.access?.drive || {};
    const canManage = caps.manage === true;
    const canView = caps.view === true;

    els.setup.hidden = !canManage;
    els.workspace.hidden = !(canView && drive.connected);

    if (drive.connected) {
      els.badge.textContent = 'Drive conectado';
      els.badge.className = 'documents-hero-state connected';
    } else if (drive.configured) {
      els.badge.textContent = 'Drive aguardando conexão';
      els.badge.className = 'documents-hero-state pending';
    } else {
      els.badge.textContent = 'Integração aguardando configuração';
      els.badge.className = 'documents-hero-state pending';
    }

    if (canManage) {
      els.connect.hidden = Boolean(drive.connected) || !drive.configured;
      els.disconnect.hidden = !drive.connected;
      if (els.manageAccess) els.manageAccess.hidden = state.user.role !== 'admin';
      els.connect.disabled = !drive.configured;
      if (!drive.configured) {
        els.setupMessage.textContent = 'O código da Central está preparado, mas as credenciais OAuth do Google ainda precisam ser configuradas no ambiente seguro da Cloudflare.';
        els.setupMessage.className = 'portal-note warning';
      } else if (!drive.connected) {
        els.setupMessage.textContent = 'A integração está configurada. Autorize uma vez a conta institucional para liberar a navegação do Drive.';
        els.setupMessage.className = 'portal-note info';
      } else if (!canView) {
        els.setupMessage.textContent = 'O Drive está conectado. O acesso de leitura é concedido pela função adicional Central de Documentos em Usuários e acessos.';
        els.setupMessage.className = 'portal-note info';
      } else {
        els.setupMessage.textContent = 'Conexão institucional ativa. Os acessos são administrados em Usuários e acessos por funções acumuláveis.';
        els.setupMessage.className = 'portal-note success';
      }
    }

    if (!canView && !canManage) {
      showStatus('Sua conta não possui acesso à Central de Documentos.', 'warning');
    } else if (canView && !drive.connected) {
      showStatus('Seu acesso está liberado, mas a conta institucional do Google Drive ainda não foi conectada.', 'warning');
    } else {
      showStatus('');
    }
  }

  function sortItems(items) {
    return [...items].sort((a, b) => {
      if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
      return String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR', { numeric: true, sensitivity: 'base' });
    });
  }

  function currentParentRef() {
    return state.stack.length ? state.stack[state.stack.length - 1].ref : '';
  }

  function renderBreadcrumbs() {
    const parts = [
      '<button class="documents-crumb" type="button" data-depth="-1">Meu Drive</button>'
    ];
    state.stack.forEach((entry, index) => {
      parts.push('<span class="documents-crumb-sep">›</span>');
      parts.push(`<button class="documents-crumb" type="button" data-depth="${index}">${escapeHtml(entry.name)}</button>`);
    });
    if (state.searchMode) {
      parts.push('<span class="documents-crumb-sep">›</span><span class="documents-crumb">Resultados da pesquisa</span>');
    }
    els.breadcrumbs.innerHTML = parts.join('');
  }

  function renderItems() {
    renderBreadcrumbs();
    els.listTitle.textContent = state.searchMode
      ? `Pesquisa: ${state.searchQuery}`
      : (state.stack.length ? state.stack[state.stack.length - 1].name : 'Meu Drive');
    els.listCount.textContent = `${state.items.length} item(ns) carregado(s)`;

    if (!state.items.length) {
      els.list.innerHTML = `<div class="documents-empty">${state.searchMode
        ? 'Nenhum arquivo ou pasta encontrado para esta pesquisa.'
        : 'Esta pasta está vazia.'}</div>`;
    } else {
      els.list.innerHTML = state.items.map((item, index) => {
        const supported = item.isFolder || item.isPdf;
        const classes = ['documents-item', item.isFolder ? 'folder' : '', supported ? '' : 'unsupported'].filter(Boolean).join(' ');
        const action = item.isFolder ? 'Abrir pasta' : item.isPdf ? 'Abrir PDF' : 'Não suportado nesta fase';
        const icon = item.isFolder ? '▰' : item.isPdf ? 'PDF' : '•';
        return `<button class="${classes}" type="button" data-index="${index}" ${supported ? '' : 'aria-disabled="true"'}>
          <span class="documents-item-icon" aria-hidden="true">${icon}</span>
          <span class="documents-item-copy">
            <strong title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(itemSubtitle(item))}</span>
          </span>
          <span class="documents-item-action">${action}</span>
        </button>`;
      }).join('');
    }

    els.pagination.hidden = !state.nextPageToken;
    els.loadMore.disabled = false;
    scheduleLikelyPdfWarmup();
  }

  async function loadFolder({ append = false, pageToken = '' } = {}) {
    if (state.loading) return;
    state.loading = true;
    const started = performance.now();
    if (!append) {
      state.searchMode = false;
      state.searchQuery = '';
      els.search.value = '';
      els.list.innerHTML = '<div class="documents-loading">Carregando pasta…</div>';
    } else {
      els.loadMore.disabled = true;
    }

    try {
      const payload = await api('/api/documents/drive/list', {
        method: 'POST',
        body: JSON.stringify({
          parentRef: currentParentRef(),
          pageToken,
          pageSize: 80
        })
      });
      const incoming = sortItems(Array.isArray(payload?.items) ? payload.items : []);
      state.items = append ? sortItems([...state.items, ...incoming]) : incoming;
      state.nextPageToken = String(payload?.nextPageToken || '');
      renderItems();
      capture('drive_folder_opened', {
        route: '/documentos/',
        duration_ms: duration(started),
        source: 'drive',
        cache_state: 'miss'
      });
    } catch (error) {
      if (!append) els.list.innerHTML = '<div class="documents-empty">Não foi possível carregar esta pasta.</div>';
      showStatus(error.message || 'Não foi possível acessar o Google Drive.', 'warning');
    } finally {
      state.loading = false;
      els.loadMore.disabled = false;
    }
  }

  async function search(query, { append = false, pageToken = '' } = {}) {
    const value = String(query || '').trim();
    if (value.length < 2) {
      if (!value) return loadFolder();
      showStatus('Digite pelo menos dois caracteres para pesquisar.', 'warning');
      return;
    }
    if (state.loading) return;
    state.loading = true;
    const started = performance.now();
    if (!append) {
      state.searchMode = true;
      state.searchQuery = value;
      els.list.innerHTML = '<div class="documents-loading">Pesquisando no Drive…</div>';
    } else {
      els.loadMore.disabled = true;
    }

    try {
      const payload = await api('/api/documents/drive/search', {
        method: 'POST',
        body: JSON.stringify({ query: value, pageToken, pageSize: 80 })
      });
      const incoming = sortItems(Array.isArray(payload?.items) ? payload.items : []);
      state.items = append ? sortItems([...state.items, ...incoming]) : incoming;
      state.nextPageToken = String(payload?.nextPageToken || '');
      renderItems();
      capture('drive_search_completed', {
        route: '/documentos/',
        duration_ms: duration(started),
        source: 'drive',
        result_count_bucket: resultCountBucket(state.items.length)
      });
    } catch (error) {
      if (!append) els.list.innerHTML = '<div class="documents-empty">Não foi possível concluir a pesquisa.</div>';
      showStatus(error.message || 'Não foi possível pesquisar no Google Drive.', 'warning');
    } finally {
      state.loading = false;
      els.loadMore.disabled = false;
    }
  }

  function closePdf() {
    state.pdfOpenId += 1;
    releaseProgressiveStream();
    if (state.pdfObjectUrl) URL.revokeObjectURL(state.pdfObjectUrl);
    state.pdfObjectUrl = '';
    state.pdfItem = null;
    state.pdfFallbackStarted = false;
    state.pdfProgressiveFailed = false;
    state.pdfFirstPageEmitted = false;
    state.pdfFirstPageObserver?.disconnect?.();
    state.pdfFirstPageObserver = null;
    els.frame.removeAttribute('src');
    els.viewer.hidden = true;
    els.viewerState.className = 'documents-viewer-state';
    els.viewerState.textContent = 'Preparando PDF…';
  }

  async function openPdf(item) {
    closePdf();
    const openId = state.pdfOpenId;
    state.pdfItem = item;
    els.viewer.hidden = false;
    els.viewerTitle.textContent = item.name || 'Documento PDF';
    els.viewerState.textContent = 'Verificando cache seguro…';
    els.viewerState.className = 'documents-viewer-state';
    state.pdfOpenedAt = performance.now();
    const bucket = sizeBucket(item.size);

    capture('pdf_open_started', {
      route: '/documentos/',
      source: 'drive',
      size_bucket: bucket,
      cache_state: 'unknown'
    });

    try {
      const cachedBlob = await readCachedPdf(item);
      if (openId !== state.pdfOpenId) return;

      if (cachedBlob) {
        els.viewerState.textContent = 'Abrindo do cache local…';
        state.pdfObjectUrl = URL.createObjectURL(cachedBlob);
        els.frame.addEventListener('load', () => {
          markViewerReady(openId, sizeBucket(cachedBlob.size || item.size), 'hit', false, 'cache');
        }, { once: true });
        els.frame.src = state.pdfObjectUrl;
      } else {
        els.viewerState.textContent = 'Abrindo primeira página…';
        const progressiveUrl = await registerProgressiveStream(item);
        if (openId !== state.pdfOpenId) return;

        if (progressiveUrl) {
          els.frame.addEventListener('load', () => {
            markViewerReady(openId, bucket, 'miss', true, 'drive');
            const warm = () => warmPdfCache(item, { prefetch: false }).catch(() => {});
            if (typeof requestIdleCallback === 'function') requestIdleCallback(warm, { timeout: 2200 });
            else window.setTimeout(warm, 1400);
          }, { once: true });
          els.frame.src = progressiveUrl;
        } else {
          await loadPdfBlobFallback(item, openId, bucket);
        }
      }

      if (openId === state.pdfOpenId) {
        els.viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      if (openId !== state.pdfOpenId) return;
      els.viewerState.textContent = error.message || 'Não foi possível abrir este PDF.';
      showStatus(error.message || 'Não foi possível abrir este PDF.', 'warning');
    }
  }

  els.connect.addEventListener('click', async () => {
    els.connect.disabled = true;
    els.connect.textContent = 'Preparando autorização…';
    try {
      const payload = await api('/api/documents/oauth/start', { method: 'POST', body: '{}' });
      if (!payload?.authorizationUrl) throw new Error('Não foi possível iniciar a autorização do Google.');
      location.assign(payload.authorizationUrl);
    } catch (error) {
      showStatus(error.message || 'Não foi possível iniciar a conexão do Google Drive.', 'warning');
      els.connect.disabled = false;
      els.connect.textContent = 'Conectar Google Drive';
    }
  });

  els.disconnect.addEventListener('click', async () => {
    if (!confirm('Desconectar a conta institucional da Central? Os arquivos do Google Drive não serão apagados.')) return;
    els.disconnect.disabled = true;
    try {
      await api('/api/documents/oauth/disconnect', { method: 'POST', body: '{}' });
      closePdf();
      if (documentCache?.clearAll) await documentCache.clearAll().catch(() => {});
      await loadAccess();
      showStatus('Google Drive desconectado da Central.', 'info');
    } catch (error) {
      showStatus(error.message || 'Não foi possível desconectar o Google Drive.', 'warning');
    } finally {
      els.disconnect.disabled = false;
    }
  });

  els.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    search(els.search.value);
  });

  els.refreshFolder.addEventListener('click', () => {
    if (state.searchMode) search(state.searchQuery);
    else loadFolder();
  });

  els.breadcrumbs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-depth]');
    if (!button) return;
    const depth = Number(button.dataset.depth);
    state.stack = depth < 0 ? [] : state.stack.slice(0, depth + 1);
    state.searchMode = false;
    state.searchQuery = '';
    loadFolder();
  });

  els.list.addEventListener('mouseover', warmPdfFromListEvent);
  els.list.addEventListener('focusin', warmPdfFromListEvent);

  els.list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-index]');
    if (!button) return;
    const item = state.items[Number(button.dataset.index)];
    if (!item) return;
    if (item.isFolder) {
      state.stack.push({ ref: item.ref, name: item.name });
      state.searchMode = false;
      state.searchQuery = '';
      loadFolder();
      return;
    }
    if (item.isPdf) openPdf(item);
  });

  els.loadMore.addEventListener('click', () => {
    if (!state.nextPageToken) return;
    if (state.searchMode) search(state.searchQuery, { append: true, pageToken: state.nextPageToken });
    else loadFolder({ append: true, pageToken: state.nextPageToken });
  });

  els.closeViewer.addEventListener('click', closePdf);

  navigator.serviceWorker?.addEventListener('message', (event) => {
    if (event.data?.type !== 'PORTAL_DOCUMENT_STREAM_FAILED') return;
    if (!state.pdfStreamId || event.data.viewId !== state.pdfStreamId || !state.pdfItem) return;
    const item = state.pdfItem;
    const openId = state.pdfOpenId;
    state.pdfProgressiveFailed = true;
    loadPdfBlobFallback(item, openId, sizeBucket(item.size)).catch((error) => {
      if (openId !== state.pdfOpenId) return;
      els.viewerState.textContent = error.message || 'Não foi possível abrir este PDF.';
      showStatus(error.message || 'Não foi possível abrir este PDF.', 'warning');
    });
  });

  els.logout.addEventListener('click', async () => {
    closePdf();
    if (documentCache?.clearAll) await documentCache.clearAll().catch(() => {});
    await auth.logout();
    location.replace('/login/');
  });

  window.addEventListener('pagehide', () => {
    state.cachePrefetchGeneration += 1;
    if (cacheWarmTimer) clearTimeout(cacheWarmTimer);
    closePdf();
  }, { once: true });

  const oauthState = new URLSearchParams(location.search).get('oauth');
  if (oauthState) {
    history.replaceState(null, '', location.pathname);
    showStatus(
      oauthState === 'connected'
        ? 'Conta institucional conectada ao Google Drive com sucesso.'
        : 'A autorização do Google Drive não foi concluída. Tente novamente.',
      oauthState === 'connected' ? 'success' : 'warning'
    );
  }

  try {
    await loadAccess();
    if (state.access?.capabilities?.view && state.access?.drive?.connected) await loadFolder();
  } catch (error) {
    showStatus(error.message || 'Não foi possível iniciar a Central de Documentos.', 'warning');
    els.badge.textContent = 'Central indisponível';
    els.badge.className = 'documents-hero-state pending';
  }
})();
