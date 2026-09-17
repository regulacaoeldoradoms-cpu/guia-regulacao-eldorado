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

  const DEFAULT_EDITOR_COLOR_PALETTE = Object.freeze([
    '#000000', '#ffffff', '#e53935', '#1565c0', '#2e7d32', '#f9a825'
  ]);

  const DRIVE_AUTO_SYNC_IDLE_MS = 1000;
  const DRIVE_SYNC_SUCCESS_VISIBLE_MS = 1000;
  const DRIVE_SYNC_REVISION_POLL_MS = 200;

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
    pdfReadyEmitted: false,
    pdfCustomFallbackStarted: false,
    cachePrefetchGeneration: 0,
    editorSession: null,
    editorViewState: null,
    editorFocusRestore: null,
    editorBuildSeq: 0,
    editorStartSeq: 0,
    editorBusy: false,
    editorMode: 'readonly',
    selectedObjectId: '',
    editorColorPalette: [...DEFAULT_EDITOR_COLOR_PALETTE],
    editorColorGesture: null,
    editorDrawTool: 'draw',
    editorDrawColor: '#111111',
    editorDrawWidth: 4,
    editorPaletteWriteChain: Promise.resolve(),
    editorPaletteWriteGeneration: 0,
    pendingMergeItem: null,
    pendingMergeFiles: [],
    mergePreviewUrls: [],
    mergePreviewGeneration: 0,
    finalPdfCacheSession: null,
    finalPdfCacheRevision: -1,
    finalPdfCacheBlob: null,
    syncOperation: 'save_copy',
    driveSyncVisualState: 'normal',
    driveSyncLastObservedRevision: 0,
    driveSyncLastConfirmedRevision: 0,
    driveSyncTimer: null,
    driveSyncObserver: null,
    driveSyncSuccessTimer: null,
    driveSyncInFlight: false,
    driveSyncQueued: false,
    driveSyncFailureRevision: -1,
    driveSyncSafetyRevisionPreserved: false,
    driveSyncGeneration: 0
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
    customViewer: document.getElementById('documentsCustomViewer'),
    pdfPageScroll: document.getElementById('pdfPageScroll'),
    pdfPages: document.getElementById('pdfPages'),
    pdfThumbnails: document.getElementById('pdfThumbnailRail'),
    pdfZoomLabel: document.getElementById('pdfZoomLabel'),
    pdfPageCountLabel: document.getElementById('pdfPageCountLabel'),
    pdfZoomOut: document.getElementById('pdfZoomOutButton'),
    pdfZoomReset: document.getElementById('pdfZoomResetButton'),
    pdfZoomIn: document.getElementById('pdfZoomInButton'),
    pdfFitWidth: document.getElementById('pdfFitWidthButton'),
    editPdf: document.getElementById('editPdfButton'),
    editorRailEdit: document.getElementById('editorRailEditButton'),
    closeViewer: document.getElementById('closeViewerButton'),
    editor: document.getElementById('documentsEditor'),
    editorStatus: document.getElementById('documentsEditorStatus'),
    editorUndo: document.getElementById('editorUndoButton'),
    editorRedo: document.getElementById('editorRedoButton'),
    editorOrganize: document.getElementById('editorOrganizeButton'),
    editorMerge: document.getElementById('editorMergeButton'),
    editorBlankPage: document.getElementById('editorBlankPageButton'),
    editorImage: document.getElementById('editorImageButton'),
    editorCrop: document.getElementById('editorCropButton'),
    editorSelect: document.getElementById('editorSelectButton'),
    editorWrite: document.getElementById('editorWriteButton'),
    editorOverlayImage: document.getElementById('editorOverlayImageButton'),
    editorOverlayImageInput: document.getElementById('editorOverlayImageInput'),
    editorDraw: document.getElementById('editorDrawButton'),
    editorDrawToolbar: document.getElementById('editorDrawToolbar'),
    editorDrawColor: document.getElementById('editorDrawColor'),
    editorDrawWidth: document.getElementById('editorDrawWidth'),
    editorDrawPen: document.getElementById('editorDrawPen'),
    editorDrawEraser: document.getElementById('editorDrawEraser'),
    editorImageInput: document.getElementById('editorImageInput'),
    editorObjectToolbar: document.getElementById('editorObjectToolbar'),
    editorObjectFontField: document.getElementById('editorObjectFontField'),
    editorObjectSizeField: document.getElementById('editorObjectSizeField'),
    editorObjectColorField: document.getElementById('editorObjectColorField'),
    editorObjectFormatField: document.getElementById('editorObjectFormatField'),
    editorObjectFont: document.getElementById('editorObjectFont'),
    editorObjectFontSize: document.getElementById('editorObjectFontSize'),
    editorObjectColor: document.getElementById('editorObjectColor'),
    editorObjectBold: document.getElementById('editorObjectBold'),
    editorObjectItalic: document.getElementById('editorObjectItalic'),
    editorObjectUnderline: document.getElementById('editorObjectUnderline'),
    editorObjectAlign: document.getElementById('editorObjectAlign'),
    editorObjectOpacity: document.getElementById('editorObjectOpacity'),
    editorObjectDelete: document.getElementById('editorObjectDelete'),
    editorPreview: document.getElementById('editorPreviewButton'),
    editorSync: document.getElementById('editorSyncButton'),
    editorSyncPanel: document.getElementById('editorSyncPanel'),
    editorSyncCancel: document.getElementById('editorSyncCancelButton'),
    editorSyncApply: document.getElementById('editorSyncApplyButton'),
    editorSyncCopyNameField: document.getElementById('editorSyncCopyNameField'),
    editorSyncCopyName: document.getElementById('editorSyncCopyName'),
    editorSyncWarning: document.getElementById('editorSyncWarning'),
    editorSyncProgress: document.getElementById('editorSyncProgress'),
    editorExport: document.getElementById('editorExportButton'),
    editorPrint: document.getElementById('editorPrintButton'),
    editorExit: document.getElementById('editorExitButton'),
    editorMergePanel: document.getElementById('editorMergePanel'),
    editorMergeSelection: document.getElementById('editorMergeSelection'),
    editorMergeLocal: document.getElementById('editorMergeLocalButton'),
    editorMergeLocalInput: document.getElementById('editorMergeLocalInput'),
    editorMergePreview: document.getElementById('editorMergePreview'),
    editorMergePosition: document.getElementById('editorMergePosition'),
    editorMergePageField: document.getElementById('editorMergePageField'),
    editorMergeAfterPage: document.getElementById('editorMergeAfterPage'),
    editorMergeApply: document.getElementById('editorMergeApplyButton'),
    editorMergeCancel: document.getElementById('editorMergeCancelButton')
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

  function canSyncDocuments() {
    const drive = state.access?.drive || {};
    const item = state.pdfItem;
    return canEditDocuments()
      && drive.connected === true
      && drive.writeEnabled === true
      && Boolean(item?.isPdf && item?.ref && item?.version);
  }

  function itemCacheIdentity(item) {
    const descriptor = cacheDescriptor(item);
    return descriptor ? `${descriptor.cacheKey}:${descriptor.version}` : '';
  }

  function editorContainsItem(item) {
    const session = state.editorSession;
    const identity = itemCacheIdentity(item);
    if (!session || !identity) return false;
    const sourceIndexes = new Set(
      session.sources
        .map((source, index) => source?.cacheIdentity === identity ? index : -1)
        .filter((index) => index >= 0)
    );
    return session.plan.some((entry) => sourceIndexes.has(entry.sourceIndex));
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
    state.editorViewState = null;
    state.editorFocusRestore = null;
    state.editorBuildSeq += 1;
    state.editorStartSeq += 1;
    state.editorBusy = false;
  }

  function currentViewerState() {
    return window.PortalPdfViewer?.getViewState?.() || state.editorViewState || null;
  }

  function setEditorSurfaceMode(enabled) {
    const editing = enabled === true;
    if (els.editor) els.editor.hidden = !editing;
    if (els.customViewer) {
      els.customViewer.classList.toggle('is-editing', editing);
      els.customViewer.dataset.editorMode = editing ? 'true' : 'false';
      els.customViewer.setAttribute('aria-label', editing ? 'Editor visual de PDF' : 'Visualizador próprio de PDF');
    }
    if (els.editorRailEdit) {
      els.editorRailEdit.classList.toggle('active', editing);
      els.editorRailEdit.setAttribute('aria-pressed', editing ? 'true' : 'false');
    }
  }

  function normalizeEditorColorPalette(value) {
    const source = Array.isArray(value) ? value : [];
    const colors = [];
    for (const item of source) {
      const color = String(item || '').trim().toLowerCase();
      if (!/^#[0-9a-f]{6}$/.test(color)) continue;
      colors.push(color);
      if (colors.length >= 16) break;
    }
    return colors.length ? colors : [...DEFAULT_EDITOR_COLOR_PALETTE];
  }

  async function loadEditorPreferences() {
    const caps = state.access?.capabilities || state.user?.documentCapabilities || {};
    if (caps.view !== true && caps.manage !== true) return false;
    try {
      const payload = await api('/api/documents/preferences', { method: 'GET' });
      state.editorColorPalette = normalizeEditorColorPalette(payload?.colorPalette);
      return true;
    } catch (_) {
      state.editorColorPalette = [...DEFAULT_EDITOR_COLOR_PALETTE];
      return false;
    }
  }

  function persistEditorColorPalette(colors) {
    const normalized = normalizeEditorColorPalette(colors);
    state.editorColorPalette = normalized;
    const generation = ++state.editorPaletteWriteGeneration;

    const write = async () => {
      try {
        await api('/api/documents/preferences', {
          method: 'PATCH',
          body: JSON.stringify({ colorPalette: normalized })
        });
        return true;
      } catch (error) {
        if (generation === state.editorPaletteWriteGeneration) {
          setEditorStatus(error?.message || 'A paleta foi aplicada nesta sessão, mas não pôde ser sincronizada com sua conta.', 'warning');
        }
        return false;
      }
    };

    const queued = state.editorPaletteWriteChain.then(write, write);
    state.editorPaletteWriteChain = queued.then(() => true, () => false);
    return queued;
  }

  function selectedEditorObject() {
    const session = state.editorSession;
    if (!session || !state.selectedObjectId) return null;
    return window.PortalPdfEditor?.objectModel?.(session)
      ?.find?.((item) => item.id === state.selectedObjectId) || null;
  }

  function syncEditorObjectToolbar() {
    const object = selectedEditorObject();
    if (els.editorObjectToolbar) els.editorObjectToolbar.hidden = !object;
    if (!object || !els.editorObjectToolbar) return;
    const isText = object.type === 'text';
    for (const field of [els.editorObjectFontField, els.editorObjectSizeField, els.editorObjectColorField, els.editorObjectFormatField]) {
      if (field) field.hidden = !isText;
    }
    if (isText) {
      if (els.editorObjectFont) els.editorObjectFont.value = object.fontFamily || 'Arial';
      if (els.editorObjectFontSize) els.editorObjectFontSize.value = String(Math.max(8, Math.min(96, Math.round((object.fontSize || .032) * 560))));
      if (els.editorObjectColor) els.editorObjectColor.value = /^#[0-9a-f]{6}$/i.test(object.color || '') ? object.color : '#111111';
      if (els.editorObjectAlign) els.editorObjectAlign.value = ['left', 'center', 'right'].includes(object.textAlign) ? object.textAlign : 'left';
      for (const [control, active] of [
        [els.editorObjectBold, object.fontWeight === 'bold'],
        [els.editorObjectItalic, object.fontStyle === 'italic'],
        [els.editorObjectUnderline, object.textDecoration === 'underline']
      ]) {
        if (!control) continue;
        control.classList.toggle('active', active);
        control.setAttribute('aria-pressed', active ? 'true' : 'false');
      }
    }
    if (els.editorObjectOpacity) els.editorObjectOpacity.value = String(Math.round((object.opacity ?? 1) * 100));
  }

  function editorDrawWidthNormalized() {
    return Math.min(0.05, Math.max(0.001, Number(state.editorDrawWidth || 4) / 760));
  }

  function syncEditorStrokes() {
    const session = state.editorSession;
    const editor = window.PortalPdfEditor;
    const viewer = window.PortalPdfViewer;
    if (!session || !editor?.strokeModel || !viewer?.setEditorStrokes) return false;
    const mode = state.editorMode === 'draw' && state.editorDrawTool === 'erase' ? 'erase'
      : state.editorMode === 'draw' ? 'draw'
        : 'none';
    return viewer.setEditorStrokes(editor.strokeModel(session), {
      mode,
      color: state.editorDrawColor,
      width: editorDrawWidthNormalized(),
      onStrokeCommit(pageIndex, stroke) {
        if (session !== state.editorSession) return;
        const id = editor.addStroke?.(session, pageIndex, stroke?.points, {
          color: stroke?.color || state.editorDrawColor,
          width: stroke?.width || editorDrawWidthNormalized()
        });
        if (!id) return;
        syncEditorControls();
        syncEditorStrokes();
      },
      onEraseCommit(strokeIds) {
        if (session !== state.editorSession) return;
        const removed = editor.removeStrokes?.(session, strokeIds);
        if (!removed) return;
        syncEditorControls();
        syncEditorStrokes();
      }
    });
  }

  function syncEditorObjects() {
    const session = state.editorSession;
    const editor = window.PortalPdfEditor;
    const viewer = window.PortalPdfViewer;
    if (!session || !editor?.objectModel || !viewer?.setEditorObjects) return false;
    const mode = ['select', 'write', 'image'].includes(state.editorMode) ? state.editorMode : 'none';
    const result = viewer.setEditorObjects(editor.objectModel(session), {
      mode,
      selectedObjectId: state.selectedObjectId,
      colorPalette: state.editorColorPalette,
      onSelect(id) {
        if (session !== state.editorSession) return;
        if (state.editorColorGesture && state.editorColorGesture.objectId !== id) {
          commitEditorColorGesture({ sync: false });
        }
        state.selectedObjectId = id;
        syncEditorObjectToolbar();
      },
      onChange(id, patch) {
        if (session !== state.editorSession) return;
        editor.updateObject(session, id, patch, { commit: false });
      },
      onCommit() {
        if (session !== state.editorSession) return;
        editor.commitObjectMutation(session);
        syncEditorControls();
      },
      onTextCommit(id, value) {
        if (session !== state.editorSession) return;
        editor.updateObject(session, id, { text: value }, { commit: false });
        editor.commitObjectMutation(session);
        syncEditorControls();
        syncEditorObjectToolbar();
      },
      onPageChange(id, pageIndex, patch) {
        if (session !== state.editorSession) return;
        editor.moveObjectToPage(session, id, pageIndex, { ...patch, commit: false });
      },
      onDelete(id) {
        if (session !== state.editorSession) return;
        deleteEditorObjectById(id);
      },
      onColorPaletteChange(colors) {
        if (session !== state.editorSession) return;
        state.editorColorPalette = normalizeEditorColorPalette(colors);
        persistEditorColorPalette(state.editorColorPalette).catch(() => {});
      },
      onCreateText(pageNumber, point) {
        if (session !== state.editorSession || state.editorMode !== 'write') return;
        const id = editor.addTextObject(session, pageNumber - 1, {
          x: Math.min(.82, Math.max(0, point.x - .04)),
          y: Math.min(.9, Math.max(0, point.y - .025)),
          text: 'Digite aqui'
        });
        state.selectedObjectId = id || '';
        syncEditorControls();
        syncEditorObjects();
        requestAnimationFrame(() => {
          const selector = `.portal-pdf-object[data-object-id="${CSS.escape(state.selectedObjectId)}"] .portal-pdf-object-text`;
          els.pdfPages?.querySelector(selector)?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        });
      }
    });
    if (viewer?.setEditorCrops && editor?.pageModel) {
      viewer.setEditorCrops(editor.pageModel(session), {
        mode: state.editorMode === 'crop' ? 'crop' : 'none',
        onConfirm(pageIndex, crop) {
          if (session !== state.editorSession) return;
          if (!editor.setPageCrop?.(session, pageIndex, crop, { commit: false })) return;
          editor.commitObjectMutation(session);
          syncEditorControls();
        },
        onReset(pageIndex) {
          if (session !== state.editorSession) return;
          if (!editor.clearPageCrop?.(session, pageIndex)) return;
          syncEditorControls();
          syncEditorObjects();
        }
      });
    }
    syncEditorObjectToolbar();
    syncEditorStrokes();
    return result;
  }

  function setEditorWorkspaceMode(mode = 'organize') {
    const editing = Boolean(state.editorSession);
    const next = editing ? String(mode || 'organize') : 'readonly';
    state.editorMode = next;
    if (els.customViewer) els.customViewer.dataset.editorWorkspaceMode = next;
    const organizer = editing && (next === 'organize' || next === 'merge');
    window.PortalPdfViewer?.setOrganizerMode?.(organizer);
    if (els.editorOrganize) {
      els.editorOrganize.classList.toggle('active', next === 'organize');
      els.editorOrganize.setAttribute('aria-pressed', next === 'organize' ? 'true' : 'false');
    }
    if (els.editorMerge) {
      els.editorMerge.classList.toggle('active', next === 'merge');
      els.editorMerge.setAttribute('aria-pressed', next === 'merge' ? 'true' : 'false');
    }
    if (els.editorCrop) {
      els.editorCrop.classList.toggle('active', next === 'crop');
      els.editorCrop.setAttribute('aria-pressed', next === 'crop' ? 'true' : 'false');
    }
    if (els.editorSelect) {
      els.editorSelect.classList.toggle('active', next === 'select');
      els.editorSelect.setAttribute('aria-pressed', next === 'select' ? 'true' : 'false');
    }
    if (els.editorWrite) {
      els.editorWrite.classList.toggle('active', next === 'write');
      els.editorWrite.setAttribute('aria-pressed', next === 'write' ? 'true' : 'false');
    }
    if (els.editorOverlayImage) {
      els.editorOverlayImage.classList.toggle('active', next === 'image');
      els.editorOverlayImage.setAttribute('aria-pressed', next === 'image' ? 'true' : 'false');
    }
    if (els.editorDraw) {
      els.editorDraw.classList.toggle('active', next === 'draw');
      els.editorDraw.setAttribute('aria-pressed', next === 'draw' ? 'true' : 'false');
    }
    if (els.editorSync) {
      els.editorSync.classList.toggle('active', next === 'sync');
      els.editorSync.setAttribute('aria-pressed', next === 'sync' ? 'true' : 'false');
    }
    if (els.editorDrawToolbar) els.editorDrawToolbar.hidden = next !== 'draw';
    if (els.editorDrawPen) {
      const active = next === 'draw' && state.editorDrawTool === 'draw';
      els.editorDrawPen.classList.toggle('active', active);
      els.editorDrawPen.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    if (els.editorDrawEraser) {
      const active = next === 'draw' && state.editorDrawTool === 'erase';
      els.editorDrawEraser.classList.toggle('active', active);
      els.editorDrawEraser.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    if (els.editorMergePanel) els.editorMergePanel.hidden = next !== 'merge';
    if (els.editorSyncPanel) els.editorSyncPanel.hidden = next !== 'sync';
    syncEditorObjects();
    syncEditorStrokes();
  }

  function syncEditorControls() {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    const busy = state.editorBusy;
    els.editorUndo.disabled = busy || !editor || !session || !editor.canUndo(session);
    els.editorRedo.disabled = busy || !editor || !session || !editor.canRedo(session);
    if (els.editorOrganize) els.editorOrganize.disabled = busy || !session;
    els.editorMerge.disabled = busy || !session;
    if (els.editorBlankPage) els.editorBlankPage.disabled = busy || !session;
    els.editorImage.disabled = busy || !session;
    els.editorImageInput.disabled = busy || !session;
    if (els.editorCrop) els.editorCrop.disabled = busy || !session;
    if (els.editorSelect) els.editorSelect.disabled = busy || !session;
    if (els.editorWrite) els.editorWrite.disabled = busy || !session;
    if (els.editorOverlayImage) els.editorOverlayImage.disabled = busy || !session;
    if (els.editorOverlayImageInput) els.editorOverlayImageInput.disabled = busy || !session;
    if (els.editorDraw) els.editorDraw.disabled = busy || !session;
    if (els.editorDrawColor) els.editorDrawColor.disabled = busy || !session;
    if (els.editorDrawWidth) els.editorDrawWidth.disabled = busy || !session;
    if (els.editorDrawPen) els.editorDrawPen.disabled = busy || !session;
    if (els.editorDrawEraser) els.editorDrawEraser.disabled = busy || !session;
    if (els.editorObjectDelete) els.editorObjectDelete.disabled = busy || !selectedEditorObject();
    if (els.editorPreview) els.editorPreview.disabled = busy || !session;
    if (els.editorSync) {
      els.editorSync.hidden = !(canSyncDocuments() && session);
      els.editorSync.disabled = busy || state.driveSyncInFlight || !session || !canSyncDocuments() || typeof editor?.buildFlattenedBlob !== 'function';
    }
    if (els.editorSyncApply) els.editorSyncApply.disabled = busy || !session || !canSyncDocuments();
    if (els.editorSyncCancel) els.editorSyncCancel.disabled = busy;
    if (els.editorSyncCopyName) els.editorSyncCopyName.disabled = busy;
    document.querySelectorAll('input[name="editorSyncOperation"]').forEach((control) => {
      control.disabled = busy;
    });
    if (els.editorExport) els.editorExport.disabled = busy || !session || typeof editor?.buildFlattenedBlob !== 'function';
    if (els.editorPrint) els.editorPrint.disabled = busy || !session || typeof editor?.buildFlattenedBlob !== 'function';
    if (els.editorMergeLocal) els.editorMergeLocal.disabled = busy || !session;
    if (els.editorMergeLocalInput) els.editorMergeLocalInput.disabled = busy || !session;
    if (els.editorMergeApply) els.editorMergeApply.disabled = busy || !session || (!state.pendingMergeItem && !state.pendingMergeFiles.length);
    if (els.editorMergeCancel) els.editorMergeCancel.disabled = busy || !session;
    if (els.editorExit) els.editorExit.disabled = busy || state.driveSyncInFlight || !session;
  }

  function setEditorBusy(busy) {
    const active = busy === true;
    state.editorBusy = active;
    els.customViewer?.setAttribute('aria-busy', active ? 'true' : 'false');
    for (const control of [els.pdfZoomOut, els.pdfZoomReset, els.pdfZoomIn, els.pdfFitWidth]) {
      if (control) control.disabled = active;
    }
    syncEditorControls();
    const wrappers = [...(els.pdfThumbnails?.querySelectorAll('.portal-pdf-thumb-wrap') || [])];
    wrappers.forEach((wrapper, index) => {
      wrapper.querySelectorAll('[data-thumbnail-action]').forEach((button) => {
        const action = String(button.dataset.thumbnailAction || '');
        button.disabled = active || (action === 'delete' && wrappers.length <= 1);
      });
    });
    refreshPdfListActions();
  }

  function refreshPdfListActions() {
    if (!els.list) return;
    els.list.querySelectorAll('[data-index]').forEach((button) => {
      const item = state.items[Number(button.dataset.index)];
      const action = button.querySelector('.documents-item-action');
      if (!item?.isPdf || !action) return;
      action.textContent = state.editorSession
        ? (editorContainsItem(item) ? 'Já no editor' : 'Selecionar para unir')
        : 'Abrir PDF';
      button.disabled = Boolean(state.editorSession && state.editorBusy);
    });
  }

  function showEditorPortalFailure(error, { seq, initial = false } = {}) {
    if (seq !== state.editorBuildSeq || !state.editorSession) return false;
    window.PortalPdfViewer?.close?.();
    showCustomViewerSurface();
    els.viewerState.className = 'documents-viewer-state';
    els.viewerState.textContent = 'Não foi possível renderizar esta prévia no visualizador próprio do Portal.';
    setEditorStatus(
      initial
        ? 'O editor visual não conseguiu abrir este PDF. O Portal não usará o visualizador nativo do navegador.'
        : 'A visualização editada não pôde ser renderizada pelo PDF.js. O Portal manteve o editor próprio e não abriu o visualizador nativo.',
      'warning'
    );
    return false;
  }

  function restoreEditorFocus(target, seq, session) {
    if (!target) return;
    requestAnimationFrame(() => {
      if (seq !== state.editorBuildSeq || session !== state.editorSession) return;
      const wrappers = [...(els.pdfThumbnails?.querySelectorAll('.portal-pdf-thumb-wrap') || [])];
      const pageIndex = Math.max(0, Math.min(wrappers.length - 1, Number(target.pageNumber || 1) - 1));
      const wrapper = wrappers[pageIndex];
      const action = String(target.action || '');
      const control = action
        ? wrapper?.querySelector(`[data-thumbnail-action="${action}"]`)
        : wrapper?.querySelector('.portal-pdf-thumb');
      control?.focus?.({ preventScroll: true });
      if (state.editorFocusRestore === target) state.editorFocusRestore = null;
    });
  }

  async function openEditorWithPortalViewer(blob, {
    seq,
    started,
    initial = false,
    initialViewState = null,
    focusRestore = null
  } = {}) {
    const viewer = window.PortalPdfViewer;
    const session = state.editorSession;
    if (!session || seq !== state.editorBuildSeq) return false;

    if (!viewer?.open || viewer.supported?.() === false) {
      return showEditorPortalFailure(new Error('viewer_unsupported'), { seq, initial });
    }

    showCustomViewerSurface();
    els.viewerState.className = 'documents-viewer-state';
    els.viewerState.textContent = initial
      ? 'Preparando editor visual do Portal…'
      : 'Atualizando visualização editada…';

    let pageFailureHandled = false;
    try {
      await viewer.open(blob, {
        root: els.customViewer,
        scrollRoot: els.pdfPageScroll,
        pagesRoot: els.pdfPages,
        thumbnailsRoot: els.pdfThumbnails,
        zoomLabel: els.pdfZoomLabel,
        pageCountLabel: els.pdfPageCountLabel,
        thumbnailActions: true,
        organizerMode: state.editorMode === 'organize' || state.editorMode === 'merge',
        thumbnailWidth: 210,
        initialViewState,
        onThumbnailAction: (action, pageIndex, detail) => {
          if (session !== state.editorSession) return;
          applyEditorOperation(action, pageIndex, detail).catch(() => {});
        },
        onReady: () => {
          if (session !== state.editorSession || seq !== state.editorBuildSeq) return;
          state.editorViewState = viewer.getViewState?.() || initialViewState;
          els.viewerState.className = 'documents-viewer-state ready';
          setEditorStatus(
            initial
              ? 'Editor pronto. Arraste as miniaturas para reorganizar; use ↻ para girar e × para excluir. Alterações continuam locais e reversíveis.'
              : `Visualização editada atualizada em ${duration(started)} ms.`,
            'success'
          );
          syncEditorObjects();
          restoreEditorFocus(focusRestore, seq, session);
        },
        onError: (error) => {
          if (pageFailureHandled || session !== state.editorSession || seq !== state.editorBuildSeq) return;
          pageFailureHandled = true;
          showEditorPortalFailure(error, { seq, initial });
        }
      });

      if (session !== state.editorSession || seq !== state.editorBuildSeq) {
        return false;
      }
      return true;
    } catch (error) {
      if (session !== state.editorSession || seq !== state.editorBuildSeq) return false;
      viewer.close?.();
      return showEditorPortalFailure(error, { seq, initial });
    }
  }

  async function restoreOriginalPortalViewer(initialViewState = null) {
    const viewer = window.PortalPdfViewer;
    const url = state.pdfObjectUrl;
    const openId = state.pdfOpenId;
    if (!url || !state.pdfItem) return false;

    if (viewer?.open && viewer.supported?.() !== false) {
      showCustomViewerSurface();
      try {
        await viewer.open({ url }, {
          root: els.customViewer,
          scrollRoot: els.pdfPageScroll,
          pagesRoot: els.pdfPages,
          thumbnailsRoot: els.pdfThumbnails,
          zoomLabel: els.pdfZoomLabel,
          pageCountLabel: els.pdfPageCountLabel,
          initialViewState,
          onReady: () => {
            if (openId !== state.pdfOpenId || state.editorSession) return;
            els.viewerState.className = 'documents-viewer-state ready';
          }
        });
        if (openId === state.pdfOpenId && !state.editorSession) return true;
      } catch (_) {
        if (openId !== state.pdfOpenId || state.editorSession) return false;
        viewer.close?.();
      }
    }

    if (openId !== state.pdfOpenId || state.editorSession) return false;
    showCustomViewerSurface();
    els.viewerState.className = 'documents-viewer-state ready';
    els.viewerState.textContent = 'Não foi possível restaurar o PDF no visualizador próprio. Reabra o documento para tentar novamente.';
    return false;
  }

  function resetEditorState({ restoreOriginal = false } = {}) {
    const session = state.editorSession;
    const shouldRestoreOriginal = restoreOriginal && Boolean(session?.revision > 0);
    const viewState = currentViewerState();
    window.PortalPdfViewer?.setEditorObjects?.([], { mode: 'none', selectedObjectId: '' });
    window.PortalPdfViewer?.setEditorCrops?.([], { mode: 'none' });
    window.PortalPdfViewer?.setEditorStrokes?.([], { mode: 'none' });
    clearEditorPreview();
    document.querySelector('iframe.documents-print-frame[data-central-print-frame="true"]')?.remove();
    state.editorColorGesture = null;
    resetDriveSyncTracking();
    state.finalPdfCacheSession = null;
    state.finalPdfCacheRevision = -1;
    state.finalPdfCacheBlob = null;
    state.editorSession = null;
    state.pendingMergeItem = null;
    state.pendingMergeFiles = [];
    clearMergePreview();
    state.syncOperation = 'save_copy';
    setDriveSyncProgress('');
    state.selectedObjectId = '';
    state.editorMode = 'readonly';
    window.PortalPdfViewer?.setThumbnailActions?.(false);
    window.PortalPdfViewer?.setOrganizerMode?.(false);
    setEditorSurfaceMode(false);
    setEditorWorkspaceMode('readonly');
    setEditorBusy(false);
    els.customViewer?.removeAttribute('aria-busy');
    if (els.editPdf) els.editPdf.disabled = false;
    if (els.viewerModeLabel) els.viewerModeLabel.textContent = 'Visualização';
    if (els.editPdf) els.editPdf.hidden = !(canEditDocuments() && state.pdfItem);
    if (els.editorRailEdit) els.editorRailEdit.hidden = !(canEditDocuments() && state.pdfItem);
    setEditorStatus('');
    refreshPdfListActions();
    if (shouldRestoreOriginal && state.pdfObjectUrl) {
      restoreOriginalPortalViewer(viewState).catch(() => {
        if (!state.editorSession) {
          showCustomViewerSurface();
          els.viewerState.className = 'documents-viewer-state ready';
          els.viewerState.textContent = 'Não foi possível restaurar o PDF no visualizador próprio. Reabra o documento para tentar novamente.';
        }
      });
    }
  }

  async function buildEditorPreview({
    explicit = false,
    initialViewState = null,
    focusRestore = null,
    allowBusy = false
  } = {}) {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    if (!editor || !session || (state.editorBusy && !allowBusy)) return false;

    const seq = ++state.editorBuildSeq;
    const viewState = initialViewState || currentViewerState() || state.editorViewState;
    state.editorFocusRestore = focusRestore;
    setEditorBusy(true);
    setEditorStatus(explicit ? 'Gerando visualização local…' : 'Atualizando visualização…');
    const started = performance.now();
    let opened = false;

    try {
      const blob = await editor.buildBlob(session);
      if (seq !== state.editorBuildSeq || session !== state.editorSession) return;
      releaseProgressiveStream();
      opened = await openEditorWithPortalViewer(blob, {
        seq,
        started,
        initial: false,
        initialViewState: viewState,
        focusRestore
      });
    } catch (error) {
      if (seq === state.editorBuildSeq && session === state.editorSession) {
        setEditorStatus(error.message || 'Não foi possível atualizar a visualização.', 'warning');
      }
    } finally {
      if (seq === state.editorBuildSeq && session === state.editorSession) setEditorBusy(false);
    }
    return opened && seq === state.editorBuildSeq && session === state.editorSession;
  }


  function localEditedPdfName() {
    const source = String(state.pdfItem?.name || state.pdfItem?.label || 'documento').trim();
    const base = source.replace(/\.pdf$/i, '')
      .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120) || 'documento';
    return base + '-editado.pdf';
  }

  async function finalPdfBlobForSession(session) {
    const editor = window.PortalPdfEditor;
    if (!session || typeof editor?.buildFlattenedBlob !== 'function') return null;

    const revision = Number(session.revision || 0);
    if (
      state.finalPdfCacheSession === session
      && state.finalPdfCacheRevision === revision
      && state.finalPdfCacheBlob instanceof Blob
    ) {
      return state.finalPdfCacheBlob;
    }

    const blob = await editor.buildFlattenedBlob(session);
    if (session === state.editorSession && Number(session.revision || 0) === revision) {
      state.finalPdfCacheSession = session;
      state.finalPdfCacheRevision = revision;
      state.finalPdfCacheBlob = blob;
    }
    return blob;
  }

  function currentEditorRevision() {
    return Math.max(0, Number(state.editorSession?.revision || 0));
  }

  function clearDriveSyncTimer() {
    if (state.driveSyncTimer) window.clearTimeout(state.driveSyncTimer);
    state.driveSyncTimer = null;
  }

  function clearDriveSyncSuccessTimer() {
    if (state.driveSyncSuccessTimer) window.clearTimeout(state.driveSyncSuccessTimer);
    state.driveSyncSuccessTimer = null;
  }

  function setDriveSyncVisualState(next = 'normal') {
    const allowed = new Set(['normal', 'pending', 'syncing', 'success', 'failed']);
    const value = allowed.has(next) ? next : 'normal';
    state.driveSyncVisualState = value;
    if (!els.editorSync) return value;

    const labels = {
      normal: 'Forçar sincronização com Google Drive',
      pending: 'Alterações pendentes — aguardando sincronização automática',
      syncing: 'Sincronizando com Google Drive',
      success: 'Sincronizado com Google Drive',
      failed: 'Falha na sincronização — clique para tentar novamente'
    };
    els.editorSync.dataset.syncState = value;
    els.editorSync.title = labels[value];
    els.editorSync.setAttribute('aria-label', labels[value]);
    return value;
  }

  function resetDriveSyncTracking({ observe = false } = {}) {
    clearDriveSyncTimer();
    clearDriveSyncSuccessTimer();
    if (state.driveSyncObserver) window.clearInterval(state.driveSyncObserver);
    state.driveSyncObserver = null;
    state.driveSyncInFlight = false;
    state.driveSyncQueued = false;
    state.driveSyncFailureRevision = -1;
    state.driveSyncSafetyRevisionPreserved = false;
    state.driveSyncGeneration += 1;
    const revision = currentEditorRevision();
    state.driveSyncLastObservedRevision = revision;
    state.driveSyncLastConfirmedRevision = revision;
    setDriveSyncVisualState('normal');

    if (observe && state.editorSession) {
      state.driveSyncObserver = window.setInterval(() => {
        const session = state.editorSession;
        if (!session) return;
        const current = currentEditorRevision();
        if (current === state.driveSyncLastObservedRevision) return;
        state.driveSyncLastObservedRevision = current;
        state.driveSyncFailureRevision = -1;
        if (current !== state.driveSyncLastConfirmedRevision) {
          scheduleAutomaticDriveSync(current);
        }
      }, DRIVE_SYNC_REVISION_POLL_MS);
    }
  }

  function showDriveSyncSuccess(targetRevision) {
    clearDriveSyncSuccessTimer();
    if (currentEditorRevision() !== targetRevision) {
      setDriveSyncVisualState('pending');
      scheduleAutomaticDriveSync(currentEditorRevision());
      return;
    }
    setDriveSyncVisualState('success');
    state.driveSyncSuccessTimer = window.setTimeout(() => {
      state.driveSyncSuccessTimer = null;
      if (!state.editorSession) return;
      if (currentEditorRevision() === state.driveSyncLastConfirmedRevision) {
        setDriveSyncVisualState('normal');
      } else {
        setDriveSyncVisualState('pending');
      }
      syncEditorControls();
    }, DRIVE_SYNC_SUCCESS_VISIBLE_MS);
  }

  function scheduleAutomaticDriveSync(revision = currentEditorRevision()) {
    const session = state.editorSession;
    if (!session || revision === state.driveSyncLastConfirmedRevision) {
      if (session && !state.driveSyncInFlight) setDriveSyncVisualState('normal');
      return false;
    }

    clearDriveSyncSuccessTimer();
    if (state.driveSyncInFlight) {
      state.driveSyncQueued = true;
      return true;
    }

    clearDriveSyncTimer();
    setDriveSyncVisualState('pending');
    syncEditorControls();

    if (!canSyncDocuments()) return false;
    state.driveSyncTimer = window.setTimeout(() => {
      state.driveSyncTimer = null;
      if (!state.editorSession || currentEditorRevision() === state.driveSyncLastConfirmedRevision) return;
      syncEditedPdfToDrive({
        operation: 'replace_pdf',
        automatic: true,
        targetRevision: currentEditorRevision()
      }).catch(() => {});
    }, DRIVE_AUTO_SYNC_IDLE_MS);
    return true;
  }

  function forceDriveSync() {
    if (!state.editorSession || state.editorBusy) return false;
    if (!canSyncDocuments()) {
      setEditorStatus('A sincronização com Google Drive não está habilitada para este ambiente ou para esta conta.', 'warning');
      return false;
    }
    if (state.driveSyncInFlight) {
      state.driveSyncQueued = true;
      setEditorStatus('Uma sincronização já está em andamento. A versão mais recente será conferida em seguida.', 'success');
      return true;
    }

    clearDriveSyncTimer();
    clearDriveSyncSuccessTimer();
    const revision = currentEditorRevision();
    if (revision === state.driveSyncLastConfirmedRevision && state.driveSyncVisualState !== 'failed') {
      setEditorStatus('Não há alterações pendentes. O PDF já está sincronizado com o Google Drive.', 'success');
      showDriveSyncSuccess(revision);
      return true;
    }

    return syncEditedPdfToDrive({
      operation: 'replace_pdf',
      forced: true,
      targetRevision: revision
    });
  }

  function setDriveSyncProgress(message = '', type = '') {
    if (!els.editorSyncProgress) return;
    els.editorSyncProgress.textContent = String(message || '');
    els.editorSyncProgress.className = `documents-sync-progress${type ? ` ${type}` : ''}`;
  }

  function selectedDriveSyncOperation() {
    const selected = document.querySelector('input[name="editorSyncOperation"]:checked');
    return selected?.value === 'replace_pdf' ? 'replace_pdf' : 'save_copy';
  }

  function updateDriveSyncPanel() {
    const operation = selectedDriveSyncOperation();
    state.syncOperation = operation;
    if (els.editorSyncCopyNameField) els.editorSyncCopyNameField.hidden = operation !== 'save_copy';
    if (els.editorSyncWarning) {
      els.editorSyncWarning.textContent = operation === 'replace_pdf'
        ? 'Antes de substituir, o Portal reconfere a versão no Google Drive. Se houver conflito, a operação é interrompida. A revisão anterior precisa ser preservada antes do upload.'
        : 'Um novo PDF será criado no Google Drive e o arquivo original permanecerá intacto.';
    }
  }

  function openDriveSyncPanel() {
    if (!state.editorSession || state.editorBusy) return false;
    if (!canSyncDocuments()) {
      setEditorStatus('A sincronização com Google Drive não está habilitada para este ambiente ou para esta conta.', 'warning');
      return false;
    }
    state.syncOperation = 'save_copy';
    const saveCopy = document.querySelector('input[name="editorSyncOperation"][value="save_copy"]');
    if (saveCopy) saveCopy.checked = true;
    if (els.editorSyncCopyName) els.editorSyncCopyName.value = localEditedPdfName();
    setDriveSyncProgress('');
    updateDriveSyncPanel();
    setEditorWorkspaceMode('sync');
    setEditorStatus('Escolha como deseja salvar o PDF final no Google Drive.', 'success');
    return true;
  }

  function cancelDriveSyncPanel() {
    if (state.editorBusy) return false;
    setDriveSyncProgress('');
    setEditorWorkspaceMode('organize');
    return true;
  }

  async function driveSyncFetch(path, options = {}) {
    const headers = new Headers(auth.authorizationHeader?.() || {});
    for (const [name, value] of Object.entries(options.headers || {})) {
      if (value !== undefined && value !== null && value !== '') headers.set(name, String(value));
    }
    let body = options.body;
    if (Object.prototype.hasOwnProperty.call(options, 'json')) {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(options.json || {});
    }
    const response = await fetch(endpoint + path, {
      method: options.method || 'GET',
      headers,
      body,
      cache: 'no-store',
      credentials: 'omit'
    });
    const type = String(response.headers.get('Content-Type') || '');
    const payload = type.includes('application/json')
      ? await response.json().catch(() => ({}))
      : {};
    if (!response.ok) {
      const error = new Error(payload?.error || `Falha ao sincronizar com Google Drive (${response.status}).`);
      error.code = String(payload?.code || '');
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function applyConfirmedDriveSync(operation, result, blob, copyName) {
    if (!result?.completed || !result.ref || !result.cacheKey || !result.currentVersion) {
      throw new Error('O Google Drive não retornou confirmação suficiente do salvamento.');
    }

    const previous = state.pdfItem || {};
    const nextName = operation === 'save_copy'
      ? (String(copyName || '').trim() || localEditedPdfName())
      : String(previous.name || previous.label || 'PDF');
    const next = {
      ...previous,
      ref: result.ref,
      cacheKey: result.cacheKey,
      version: String(result.currentVersion),
      modifiedTime: String(result.modifiedTime || previous.modifiedTime || ''),
      size: Number.isFinite(Number(result.size)) ? Number(result.size) : blob.size,
      name: nextName,
      label: nextName,
      mimeType: 'application/pdf',
      originalMimeType: 'application/pdf',
      isPdf: true,
      isFolder: false
    };

    if (operation === 'replace_pdf') {
      const previousRef = String(previous.ref || '');
      const previousCacheKey = String(previous.cacheKey || '');
      state.items = state.items.map((item) => (
        (previousRef && item?.ref === previousRef) || (previousCacheKey && item?.cacheKey === previousCacheKey)
          ? { ...item, ...next }
          : item
      ));
    }

    state.pdfItem = next;
    if (els.viewerTitle) els.viewerTitle.textContent = nextName;
    storeCachedPdf(next, blob).catch(() => false);
    refreshPdfListActions();
    return next;
  }

  async function syncEditedPdfToDrive(options = {}) {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    const operation = options.operation === 'replace_pdf' || options.operation === 'save_copy'
      ? options.operation
      : selectedDriveSyncOperation();
    const copyName = operation === 'save_copy'
      ? String(options.copyName ?? els.editorSyncCopyName?.value ?? '').trim()
      : '';
    const targetRevision = Number.isSafeInteger(Number(options.targetRevision))
      ? Number(options.targetRevision)
      : currentEditorRevision();
    const replace = operation === 'replace_pdf';
    const generation = state.driveSyncGeneration;

    if (
      !session
      || !canSyncDocuments()
      || typeof editor?.buildFlattenedBlob !== 'function'
    ) return false;

    if (operation === 'save_copy' && !copyName) {
      setDriveSyncProgress('Informe um nome para o novo PDF.', 'warning');
      els.editorSyncCopyName?.focus?.();
      return false;
    }

    if (replace && state.driveSyncInFlight) {
      state.driveSyncQueued = true;
      return false;
    }

    if (replace && targetRevision === state.driveSyncLastConfirmedRevision && state.driveSyncVisualState !== 'failed') {
      showDriveSyncSuccess(targetRevision);
      return true;
    }

    if (state.editorBusy) {
      if (replace) scheduleAutomaticDriveSync(currentEditorRevision());
      return false;
    }

    const started = performance.now();
    let blob = null;
    let syncStarted = false;
    let lockedEditor = false;

    if (replace) {
      state.driveSyncInFlight = true;
      state.driveSyncQueued = false;
      clearDriveSyncTimer();
      clearDriveSyncSuccessTimer();
      setDriveSyncVisualState('syncing');
      syncEditorControls();
    } else {
      lockedEditor = true;
      setEditorBusy(true);
    }

    setDriveSyncProgress('Gerando o PDF final…');
    setEditorStatus(
      replace ? 'Sincronizando alterações com o Google Drive…' : 'Preparando cópia para o Google Drive…'
    );

    try {
      blob = await finalPdfBlobForSession(session);
      if (!(blob instanceof Blob) || session !== state.editorSession || generation !== state.driveSyncGeneration) return false;

      if (replace && currentEditorRevision() !== targetRevision) {
        setDriveSyncVisualState('pending');
        return false;
      }

      capture('drive_sync_started', {
        route: '/documentos/',
        operation,
        size_bucket: sizeBucket(blob.size)
      });
      syncStarted = true;

      setDriveSyncProgress('Validando a versão atual no Google Drive…');
      await driveSyncFetch('/api/documents/drive/sync/preflight', {
        method: 'POST',
        json: {
          operation,
          ref: state.pdfItem.ref,
          baseVersion: String(state.pdfItem.version || '')
        }
      });

      setDriveSyncProgress('Iniciando envio seguro ao Google Drive…');
      const preserveRevision = replace && !state.driveSyncSafetyRevisionPreserved;
      const startedSync = await driveSyncFetch('/api/documents/drive/sync/start', {
        method: 'POST',
        json: {
          operation,
          ref: state.pdfItem.ref,
          baseVersion: String(state.pdfItem.version || ''),
          totalBytes: blob.size,
          copyName: operation === 'save_copy' ? copyName : '',
          preserveRevision
        }
      });

      if (replace && startedSync?.safetyRevisionPreserved === true) {
        state.driveSyncSafetyRevisionPreserved = true;
      }

      const syncId = String(startedSync?.syncId || '');
      const chunkSize = Math.max(256 * 1024, Number(startedSync?.chunkSize || (4 * 1024 * 1024)));
      if (!syncId) throw new Error('O Google Drive não iniciou uma sessão de sincronização válida.');

      let offset = 0;
      let completed = null;

      while (offset < blob.size) {
        const endExclusive = Math.min(blob.size, offset + chunkSize);
        const chunk = blob.slice(offset, endExclusive, 'application/pdf');
        setDriveSyncProgress(
          `Enviando PDF… ${Math.min(99, Math.floor((offset / blob.size) * 100))}%`
        );

        let result;
        try {
          result = await driveSyncFetch(`/api/documents/drive/sync/upload/${encodeURIComponent(syncId)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Range': `bytes ${offset}-${endExclusive - 1}/${blob.size}`
            },
            body: chunk
          });
        } catch (error) {
          if (error?.code !== 'DRIVE_SYNC_INTERRUPTED') throw error;
          setDriveSyncProgress('Conferindo até onde o Google Drive recebeu o arquivo…');
          result = await driveSyncFetch(`/api/documents/drive/sync/status/${encodeURIComponent(syncId)}`, {
            method: 'POST'
          });
        }

        if (result?.completed === true) {
          completed = result;
          break;
        }

        const nextOffset = Number(result?.nextOffset);
        if (!Number.isSafeInteger(nextOffset) || nextOffset < 0 || nextOffset > blob.size) {
          throw new Error('O Google Drive retornou uma posição inválida para retomar o upload.');
        }
        if (nextOffset === offset && offset !== 0) {
          throw new Error('Não foi possível confirmar avanço no upload. O arquivo não foi marcado como salvo.');
        }
        offset = nextOffset;
      }

      if (!completed?.completed) {
        throw new Error('O Google Drive não confirmou a conclusão do upload.');
      }
      if (session !== state.editorSession || generation !== state.driveSyncGeneration) return false;

      applyConfirmedDriveSync(operation, completed, blob, copyName);
      setDriveSyncProgress('Salvo no Google Drive.', 'success');
      capture('drive_sync_completed', {
        route: '/documentos/',
        duration_ms: duration(started),
        operation,
        size_bucket: sizeBucket(blob.size)
      });

      if (replace) {
        state.driveSyncLastConfirmedRevision = targetRevision;
        state.driveSyncFailureRevision = -1;
        if (currentEditorRevision() === targetRevision) {
          setEditorStatus('Sincronizado com o Google Drive.', 'success');
          showDriveSyncSuccess(targetRevision);
        } else {
          setDriveSyncVisualState('pending');
          setEditorStatus('Uma versão foi sincronizada; há alterações mais recentes aguardando envio.', 'success');
        }
      } else {
        setEditorStatus('Cópia salva no Google Drive. A confirmação veio do próprio Google Drive.', 'success');
      }
      return true;
    } catch (error) {
      const conflict = error?.code === 'DRIVE_VERSION_CONFLICT';
      const message = conflict
        ? 'Conflito detectado: o arquivo foi alterado no Google Drive. Reabra o documento antes de substituir o original.'
        : (error?.message || 'Não foi possível sincronizar o PDF com o Google Drive.');
      setDriveSyncProgress(message, conflict ? 'warning' : 'error');
      setEditorStatus(message, 'warning');

      if (replace && session === state.editorSession && generation === state.driveSyncGeneration) {
        state.driveSyncFailureRevision = targetRevision;
        if (currentEditorRevision() === targetRevision) {
          setDriveSyncVisualState('failed');
        } else {
          setDriveSyncVisualState('pending');
        }
      }

      if (syncStarted) {
        capture('drive_sync_failed', {
          route: '/documentos/',
          duration_ms: duration(started),
          operation,
          size_bucket: sizeBucket(blob?.size || 0),
          status_code: Number(error?.status || 0)
        });
      }
      return false;
    } finally {
      if (lockedEditor && session === state.editorSession) setEditorBusy(false);

      if (replace && session === state.editorSession && generation === state.driveSyncGeneration) {
        state.driveSyncInFlight = false;
        syncEditorControls();
        const current = currentEditorRevision();
        const hasNewer = current !== state.driveSyncLastConfirmedRevision;
        const failedSameRevision = state.driveSyncVisualState === 'failed'
          && current === state.driveSyncFailureRevision;
        const queued = state.driveSyncQueued;
        state.driveSyncQueued = false;
        if (hasNewer && !failedSameRevision && (queued || current !== targetRevision)) {
          scheduleAutomaticDriveSync(current);
        }
      }
    }
  }

  async function exportEditedPdfLocal() {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    if (!session || state.editorBusy || typeof editor?.buildFlattenedBlob !== 'function') return false;

    setEditorBusy(true);
    setEditorStatus('Gerando PDF final localmente…');
    let url = '';
    try {
      const blob = await finalPdfBlobForSession(session);
      if (!(blob instanceof Blob) || session !== state.editorSession) return false;
      url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = localEditedPdfName();
      link.rel = 'noopener';
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setEditorStatus('PDF final gerado no dispositivo. Nenhum arquivo foi enviado ao Google Drive.', 'success');
      window.setTimeout(() => {
        try { URL.revokeObjectURL(url); } catch (_) {}
      }, 5000);
      url = '';
      return true;
    } catch (error) {
      setEditorStatus(error?.message || 'Não foi possível gerar o PDF final.', 'warning');
      return false;
    } finally {
      if (url) {
        try { URL.revokeObjectURL(url); } catch (_) {}
      }
      if (session === state.editorSession) setEditorBusy(false);
    }
  }

  function editorShortcutIsTypingTarget(target) {
    if (!(target instanceof Element)) return false;
    if (target.closest('textarea, select, [contenteditable="true"], [role="textbox"]')) return true;
    const input = target.closest('input');
    if (!input) return false;
    const type = String(input.getAttribute('type') || 'text').toLowerCase();
    const nonEditingTypes = new Set(['file', 'hidden', 'button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color']);
    return !nonEditingTypes.has(type);
  }

  function ensurePrintFrame() {
    let frame = document.querySelector('iframe.documents-print-frame[data-central-print-frame="true"]');
    if (frame) return frame;
    frame = document.createElement('iframe');
    frame.className = 'documents-print-frame';
    frame.dataset.centralPrintFrame = 'true';
    frame.title = 'Área temporária de impressão do PDF final';
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    document.body.appendChild(frame);
    return frame;
  }

  async function renderPdfBlobForPrint(blob, frame) {
    if (!(blob instanceof Blob) || !(frame instanceof HTMLIFrameElement)) return false;
    const pdfjs = await window.PortalPdfViewer?.loadPdfJs?.();
    if (!pdfjs) throw new Error('O mecanismo de impressão PDF.js não está disponível.');

    const printWindow = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!printWindow || !doc) throw new Error('Não foi possível preparar a área de impressão.');

    let loadingTask = null;
    let documentPdf = null;
    try {
      const bytes = new Uint8Array(await blob.arrayBuffer());
      loadingTask = pdfjs.getDocument({
        data: bytes,
        isEvalSupported: false,
        enableScripting: false
      });
      documentPdf = await loadingTask.promise;

      doc.open();
      doc.write('<!doctype html><html><head><meta charset="utf-8"><title>Imprimir PDF final</title><style>'
        + '@page{margin:0;}html,body{margin:0;padding:0;background:#fff;}'
        + '.print-pages{margin:0;padding:0;}'
        + '.print-sheet{display:flex;align-items:center;justify-content:center;margin:0 auto;background:#fff;break-after:page;page-break-after:always;overflow:hidden;}'
        + '.print-sheet:last-child{break-after:auto;page-break-after:auto;}'
        + '.print-sheet canvas{display:block;width:100%;height:100%;}'
        + '</style></head><body><main class="print-pages"></main></body></html>');
      doc.close();

      const container = doc.querySelector('.print-pages');
      if (!container) throw new Error('Não foi possível preparar as páginas para impressão.');

      const pageJobs = Array.from({ length: documentPdf.numPages }, (_, index) => index + 1);
      const concurrency = Math.min(3, Math.max(1, pageJobs.length));
      let cursor = 0;

      async function renderNext() {
        while (cursor < pageJobs.length) {
          const pageNumber = pageJobs[cursor];
          cursor += 1;
          const page = await documentPdf.getPage(pageNumber);
          const base = page.getViewport({ scale: 1 });
          const basePixels = Math.max(1, base.width * base.height);
          const renderScale = Math.max(1, Math.min(1.5, Math.sqrt(4_000_000 / basePixels)));
          const viewport = page.getViewport({ scale: renderScale });

          const sheet = document.createElement('section');
          sheet.className = 'print-sheet';
          sheet.dataset.printPage = String(pageNumber);
          sheet.style.width = base.width + 'pt';
          sheet.style.height = base.height + 'pt';

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(viewport.width));
          canvas.height = Math.max(1, Math.round(viewport.height));
          sheet.appendChild(canvas);

          await page.render({
            canvas,
            viewport,
            background: '#ffffff'
          }).promise;
          page.cleanup?.();
          container.appendChild(sheet);
        }
      }

      await Promise.all(Array.from({ length: concurrency }, () => renderNext()));
      [...container.querySelectorAll('.print-sheet')]
        .sort((a, b) => Number(a.dataset.printPage || 0) - Number(b.dataset.printPage || 0))
        .forEach((sheet) => container.appendChild(sheet));

      return true;
    } finally {
      try { await documentPdf?.destroy?.(); } catch (_) {}
      try { loadingTask?.destroy?.(); } catch (_) {}
    }
  }

  async function printEditedPdfLocal() {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    if (!session || state.editorBusy || typeof editor?.buildFlattenedBlob !== 'function') return false;

    setEditorBusy(true);
    setEditorStatus('Preparando impressão…');
    try {
      const blob = await finalPdfBlobForSession(session);
      if (!(blob instanceof Blob) || session !== state.editorSession) return false;

      const frame = ensurePrintFrame();
      await renderPdfBlobForPrint(blob, frame);
      if (session !== state.editorSession) return false;

      const printWindow = frame.contentWindow;
      if (!printWindow) throw new Error('Não foi possível abrir a caixa de impressão.');

      let cleaned = false;
      const cleanupPrintFrame = () => {
        if (cleaned) return;
        cleaned = true;
        try { frame.remove(); } catch (_) {}
      };
      printWindow.addEventListener?.('afterprint', cleanupPrintFrame, { once: true });
      window.setTimeout(cleanupPrintFrame, 60000);
      printWindow.focus();
      printWindow.print();

      setEditorStatus('Impressão aberta. Nenhum arquivo foi enviado ao Google Drive.', 'success');
      return true;
    } catch (error) {
      setEditorStatus(error?.message || 'Não foi possível abrir a impressão do PDF final.', 'warning');
      return false;
    } finally {
      if (session === state.editorSession) setEditorBusy(false);
    }
  }

  async function startEditor() {
    if (!canEditDocuments()) {
      showStatus('Sua conta não possui permissão de edição de PDF.', 'warning');
      return;
    }
    if (!state.pdfItem || !window.PortalPdfEditor || state.editorSession) return;

    const item = state.pdfItem;
    const openId = state.pdfOpenId;
    const startSeq = ++state.editorStartSeq;
    const isCurrentStart = () => (
      startSeq === state.editorStartSeq
      && openId === state.pdfOpenId
      && item === state.pdfItem
    );
    els.editPdf.disabled = true;
    els.viewerState.className = 'documents-viewer-state';
    els.viewerState.textContent = 'Preparando editor visual…';

    try {
      const initialViewState = currentViewerState();
      const blob = await editablePdfBlob(item);
      if (!isCurrentStart()) return;
      if (!state.pdfObjectUrl) state.pdfObjectUrl = URL.createObjectURL(blob);
      const session = await window.PortalPdfEditor.createSession(blob, {
        label: 'Documento inicial',
        cacheIdentity: itemCacheIdentity(item)
      });
      if (!isCurrentStart()) return;
      state.editorSession = session;
      state.editorViewState = initialViewState;
      resetDriveSyncTracking({ observe: true });
      state.pendingMergeItem = null;
      state.pendingMergeFiles = [];
      setEditorSurfaceMode(true);
      setEditorWorkspaceMode('organize');
      els.viewerModeLabel.textContent = 'Editor PDF';
      els.editPdf.hidden = true;
      syncEditorControls();
      refreshPdfListActions();

      const actionsInstalled = window.PortalPdfViewer?.setThumbnailActions?.(true, (action, pageIndex, detail) => {
        if (!state.editorSession) return;
        applyEditorOperation(action, pageIndex, detail).catch(() => {});
      });

      if (actionsInstalled) {
        window.PortalPdfViewer?.setOrganizerMode?.(true);
        els.viewerState.className = 'documents-viewer-state ready';
        setEditorStatus('Organize as páginas em grade. Arraste para mover; use os controles da página para girar, duplicar ou excluir.', 'success');
      } else {
        const seq = ++state.editorBuildSeq;
        await openEditorWithPortalViewer(blob, {
          seq,
          started: performance.now(),
          initial: true,
          initialViewState
        });
      }
    } catch (error) {
      if (!isCurrentStart()) return;
      state.editorSession = null;
      state.editorViewState = null;
      window.PortalPdfViewer?.setThumbnailActions?.(false);
      setEditorSurfaceMode(false);
      els.viewerState.className = 'documents-viewer-state ready';
      showStatus(error.message || 'Não foi possível iniciar o editor PDF.', 'warning');
    } finally {
      if (startSeq === state.editorStartSeq) els.editPdf.disabled = false;
    }
  }

  async function normalizeImageForPdf(blob) {
    if (!(blob instanceof Blob) || !String(blob.type || '').startsWith('image/')) {
      throw new Error('Selecione uma imagem válida.');
    }
    const type = String(blob.type || '').toLowerCase();
    if (type === 'image/png' || type === 'image/jpeg') return blob;

    const bitmap = await createImageBitmap(blob).catch(() => null);
    if (!bitmap) throw new Error('Este formato de imagem não pôde ser convertido pelo navegador.');
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, bitmap.width);
      canvas.height = Math.max(1, bitmap.height);
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) throw new Error('Não foi possível preparar a imagem.');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0);
      const converted = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!(converted instanceof Blob)) throw new Error('Não foi possível converter a imagem.');
      return converted;
    } finally {
      bitmap.close?.();
    }
  }

  function viewStateAfterPageOperation(operation, index, pageCount, baseState = null) {
    if (!baseState) return null;
    let activePage = Math.max(1, Math.round(Number(baseState.activePage || 1)));
    const sourcePage = index + 1;

    if (operation === 'delete') {
      if (activePage > sourcePage) activePage -= 1;
      else if (activePage === sourcePage) activePage = Math.min(sourcePage, pageCount);
    }

    return {
      ...baseState,
      activePage: Math.max(1, Math.min(pageCount, activePage))
    };
  }

  function viewStateAfterReorder(fromIndex, toIndex, pageCount, baseState = null) {
    if (!baseState) return null;
    let activeIndex = Math.max(0, Math.round(Number(baseState.activePage || 1)) - 1);
    if (activeIndex === fromIndex) {
      activeIndex = toIndex;
    } else if (fromIndex < toIndex && activeIndex > fromIndex && activeIndex <= toIndex) {
      activeIndex -= 1;
    } else if (toIndex < fromIndex && activeIndex >= toIndex && activeIndex < fromIndex) {
      activeIndex += 1;
    }
    return {
      ...baseState,
      activePage: Math.max(1, Math.min(pageCount, activeIndex + 1))
    };
  }

  async function addImageBlobToEditor(blob, { pasted = false } = {}) {
    const session = state.editorSession;
    if (!session || !canEditDocuments() || state.editorBusy) return false;
    const started = performance.now();
    const viewState = currentViewerState();
    setEditorBusy(true);
    setEditorStatus(pasted ? 'Colando imagem como nova página…' : 'Adicionando imagem como nova página…');
    try {
      const normalized = await normalizeImageForPdf(blob);
      if (session !== state.editorSession) return false;
      const insertAt = await window.PortalPdfEditor.addImagePage(session, normalized, {
        label: pasted ? 'Imagem colada' : 'Imagem adicionada'
      });
      if (session !== state.editorSession) return false;
      syncEditorControls();
      refreshPdfListActions();
      const rebuilt = await buildEditorPreview({
        initialViewState: viewState ? { ...viewState, activePage: insertAt + 1 } : null,
        focusRestore: { pageNumber: insertAt + 1, action: '' },
        allowBusy: true
      });
      if (!rebuilt) return false;
      capture('pdf_edit_completed', {
        route: '/documentos/',
        duration_ms: duration(started),
        operation: 'insert_image',
        size_bucket: sizeBucket(blob.size)
      });
      setEditorStatus(
        pasted
          ? 'Print colado como nova página. Você pode reorganizar ou excluir normalmente.'
          : 'Imagem adicionada como nova página. Você pode reorganizar ou excluir normalmente.',
        'success'
      );
      return true;
    } catch (error) {
      if (session === state.editorSession) {
        setEditorStatus(error.message || 'Não foi possível adicionar a imagem.', 'warning');
      }
      return false;
    } finally {
      if (session === state.editorSession && state.editorBusy) setEditorBusy(false);
    }
  }

  async function addSelectedImages(files) {
    const images = Array.from(files || []).filter((file) => String(file?.type || '').startsWith('image/'));
    if (!images.length) {
      setEditorStatus('Selecione pelo menos uma imagem.', 'warning');
      return;
    }
    for (const image of images) {
      await addImageBlobToEditor(image, { pasted: false });
    }
  }

  async function handleEditorPaste(event) {
    if (!state.editorSession || !canEditDocuments() || state.editorBusy) return;
    const images = Array.from(event.clipboardData?.items || [])
      .filter((item) => String(item.type || '').startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter(Boolean);
    if (!images.length) return;
    event.preventDefault();
    for (const image of images) {
      await addImageBlobToEditor(image, { pasted: true });
    }
  }

  function startCropPages() {
    if (!state.editorSession || state.editorBusy) return;
    state.selectedObjectId = '';
    setEditorWorkspaceMode('crop');
    setEditorStatus('Recortar: arraste sobre a página, ajuste a seleção e use Confirmar recorte ou Cancelar. Só após confirmar o preview mostra apenas a área mantida; ↺ restaura a página.', 'success');
  }

  function startSelectObjects() {
    if (!state.editorSession || state.editorBusy) return;
    setEditorWorkspaceMode('select');
    setEditorStatus('Selecionar: clique em um objeto para ajustar cor ou tamanho, arraste para mover; o conteúdo do texto fica protegido. Clique fora para confirmar e desmarcar.', 'success');
  }

  function startWriteObjects() {
    if (!state.editorSession || state.editorBusy) return;
    setEditorWorkspaceMode('write');
    setEditorStatus('Escrever: clique em uma página para criar uma caixa de texto. Dê duplo clique no texto para editar.', 'success');
  }

  function startDrawMode(tool = 'draw') {
    if (!state.editorSession || state.editorBusy) return;
    state.selectedObjectId = '';
    state.editorDrawTool = tool === 'erase' ? 'erase' : 'draw';
    setEditorWorkspaceMode('draw');
    syncEditorControls();
    setEditorStatus(
      state.editorDrawTool === 'erase'
        ? 'Borracha: arraste sobre traços criados pela ferramenta Desenhar. O conteúdo original do PDF e outros objetos não são alterados.'
        : 'Caneta: desenhe livremente sobre a página. Cor e espessura ficam salvas por traço; cada gesto pode ser desfeito/refeito.',
      'success'
    );
  }

  async function addOverlayImageFile(file) {
    const session = state.editorSession;
    if (!session || state.editorBusy || !(file instanceof Blob)) return false;
    setEditorBusy(true);
    try {
      const normalized = await normalizeImageForPdf(file);
      if (session !== state.editorSession) return false;
      const activePage = Math.max(1, Number(currentViewerState()?.activePage || 1));
      const id = await window.PortalPdfEditor.addImageOverlay(session, activePage - 1, normalized, {
        width: .3
      });
      if (!id || session !== state.editorSession) return false;
      state.selectedObjectId = id;
      setEditorWorkspaceMode('image');
      syncEditorControls();
      syncEditorObjects();
      setEditorStatus('Imagem inserida sobre a página. Arraste, redimensione pelos pontos ou rotacione pelo controle inferior.', 'success');
      return true;
    } catch (error) {
      setEditorStatus(error.message || 'Não foi possível inserir a imagem sobre a página.', 'warning');
      return false;
    } finally {
      if (session === state.editorSession) setEditorBusy(false);
      if (els.editorOverlayImageInput) els.editorOverlayImageInput.value = '';
    }
  }

  function normalizeEditorObjectColor(value, fallback = '#111111') {
    const color = String(value || '').trim().toLowerCase();
    return /^#[0-9a-f]{6}$/.test(color) ? color : fallback;
  }

  function paintSelectedEditorColor(objectId, color) {
    if (!objectId || !els.pdfPages) return;
    const element = els.pdfPages.querySelector(`.portal-pdf-object[data-object-id="${CSS.escape(objectId)}"]`);
    const text = element?.querySelector('.portal-pdf-object-text');
    if (text) text.style.color = color;
    const swatch = element?.querySelector('[data-text-quick-color] .portal-pdf-text-quickbar-swatch');
    if (swatch) swatch.style.background = color;
  }

  function previewSelectedEditorColor(value) {
    const session = state.editorSession;
    const editor = window.PortalPdfEditor;
    const object = selectedEditorObject();
    if (!session || !editor || !object || object.type !== 'text' || state.editorBusy) return false;

    const color = normalizeEditorObjectColor(value, normalizeEditorObjectColor(object.color));
    const currentColor = normalizeEditorObjectColor(object.color);
    if (!state.editorColorGesture || state.editorColorGesture.objectId !== object.id) {
      state.editorColorGesture = {
        objectId: object.id,
        startColor: currentColor
      };
    }
    if (currentColor === color) {
      paintSelectedEditorColor(object.id, color);
      return false;
    }

    editor.updateObject(session, object.id, { color }, { commit: false });
    paintSelectedEditorColor(object.id, color);
    return true;
  }

  function commitEditorColorGesture({ sync = true } = {}) {
    const session = state.editorSession;
    const editor = window.PortalPdfEditor;
    const gesture = state.editorColorGesture;
    state.editorColorGesture = null;
    if (!session || !editor || !gesture?.objectId) return false;

    const object = editor.objectModel(session).find((item) => item.id === gesture.objectId);
    if (!object || object.type !== 'text') return false;
    const finalColor = normalizeEditorObjectColor(object.color);
    if (finalColor === normalizeEditorObjectColor(gesture.startColor)) return false;

    editor.commitObjectMutation(session);
    if (sync) {
      syncEditorControls();
      syncEditorObjects();
    }
    return true;
  }

  function finalizeSelectedEditorColor(value) {
    const session = state.editorSession;
    const editor = window.PortalPdfEditor;
    const object = selectedEditorObject();
    if (!session || !editor || !object || object.type !== 'text' || state.editorBusy) return false;

    if (!state.editorColorGesture || state.editorColorGesture.objectId !== object.id) {
      state.editorColorGesture = {
        objectId: object.id,
        startColor: normalizeEditorObjectColor(object.color)
      };
    }
    const color = normalizeEditorObjectColor(value, normalizeEditorObjectColor(object.color));
    if (normalizeEditorObjectColor(object.color) !== color) {
      editor.updateObject(session, object.id, { color }, { commit: false });
      paintSelectedEditorColor(object.id, color);
    }
    return commitEditorColorGesture();
  }

  function updateSelectedEditorObject(patch) {
    const session = state.editorSession;
    const object = selectedEditorObject();
    if (!session || !object || state.editorBusy) return false;
    const changed = window.PortalPdfEditor.updateObject(session, object.id, patch);
    if (!changed) return false;
    syncEditorControls();
    syncEditorObjects();
    return true;
  }

  function deleteEditorObjectById(objectId) {
    const session = state.editorSession;
    const id = String(objectId || '');
    if (!session || !id || state.editorBusy) return false;
    if (!window.PortalPdfEditor.removeObject(session, id)) return false;
    if (state.selectedObjectId === id) state.selectedObjectId = '';
    syncEditorControls();
    syncEditorObjects();
    setEditorStatus('Objeto removido. Use Desfazer se precisar restaurá-lo.', 'success');
    return true;
  }

  function deleteSelectedEditorObject() {
    const object = selectedEditorObject();
    return object ? deleteEditorObjectById(object.id) : false;
  }

  async function mergePdfIntoEditor(item, { insertAt = null } = {}) {
    const session = state.editorSession;
    if (!session || !item?.isPdf || !canEditDocuments() || state.editorBusy) return false;
    const identity = itemCacheIdentity(item);
    if (identity && editorContainsItem(item)) {
      setEditorStatus('Esse PDF já faz parte do resultado atual.', 'warning');
      return false;
    }

    const started = performance.now();
    const viewState = currentViewerState();
    setEditorBusy(true);
    setEditorStatus('Unindo documento ao resultado…');
    try {
      const blob = await editablePdfBlob(item);
      if (session !== state.editorSession) return false;
      const sourceNumber = window.PortalPdfEditor.sourceCount(session) + 1;
      const insertion = Number.isInteger(Number(insertAt))
        ? Math.max(0, Math.min(window.PortalPdfEditor.pageCount(session), Number(insertAt)))
        : window.PortalPdfEditor.pageCount(session);
      await window.PortalPdfEditor.addDocument(session, blob, {
        label: `Documento ${sourceNumber}`,
        cacheIdentity: identity,
        insertAt: insertion
      });
      if (session !== state.editorSession) return false;
      state.pendingMergeItem = null;
      state.pendingMergeFiles = [];
      clearMergePreview();
      syncEditorControls();
      refreshPdfListActions();
      const rebuilt = await buildEditorPreview({
        initialViewState: viewState ? { ...viewState, activePage: Math.min(insertion + 1, window.PortalPdfEditor.pageCount(session)) } : null,
        allowBusy: true
      });
      if (!rebuilt) return false;
      capture('pdf_edit_completed', {
        route: '/documentos/',
        duration_ms: duration(started),
        operation: 'merge_pdf',
        size_bucket: sizeBucket(item.size)
      });
      setEditorWorkspaceMode('organize');
      setEditorStatus('Documento unido na posição escolhida.', 'success');
      return true;
    } catch (error) {
      if (session === state.editorSession) {
        setEditorStatus(error.message || 'Não foi possível unir este PDF.', 'warning');
      }
      return false;
    } finally {
      if (session === state.editorSession && state.editorBusy) setEditorBusy(false);
    }
  }

  function localMergeFileKind(file) {
    const type = String(file?.type || '').toLowerCase();
    const name = String(file?.name || '').toLowerCase();
    if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
    if (type.startsWith('image/')) return 'image';
    return '';
  }

  function mergePreviewSizeLabel(bytes) {
    const size = Math.max(0, Number(bytes || 0));
    if (size < 1024) return size ? size + ' B' : '';
    if (size < 1024 * 1024) return (size / 1024).toFixed(size >= 10 * 1024 ? 0 : 1) + ' KB';
    return (size / (1024 * 1024)).toFixed(size >= 10 * 1024 * 1024 ? 0 : 1) + ' MB';
  }

  function clearMergePreview() {
    state.mergePreviewGeneration += 1;
    for (const url of state.mergePreviewUrls.splice(0)) {
      try { URL.revokeObjectURL(url); } catch (_) {}
    }
    if (!els.editorMergePreview) return;
    els.editorMergePreview.replaceChildren();
    els.editorMergePreview.hidden = true;
  }

  async function renderMergePdfPreview(file, canvas, generation) {
    const pdfjs = await window.PortalPdfViewer?.loadPdfJs?.();
    if (!pdfjs || generation !== state.mergePreviewGeneration || !(file instanceof Blob)) return;
    let loadingTask = null;
    let documentPdf = null;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (generation !== state.mergePreviewGeneration) return;
      loadingTask = pdfjs.getDocument({
        data: bytes,
        isEvalSupported: false,
        enableScripting: false
      });
      documentPdf = await loadingTask.promise;
      if (generation !== state.mergePreviewGeneration) return;
      const page = await documentPdf.getPage(1);
      const natural = page.getViewport({ scale: 1 });
      const cssWidth = 54;
      const cssHeight = 68;
      const ratio = Math.min(cssWidth / natural.width, cssHeight / natural.height);
      const pixelRatio = Math.max(1, Math.min(2, Number(window.devicePixelRatio || 1)));
      const viewport = page.getViewport({ scale: ratio * pixelRatio });
      canvas.width = Math.max(1, Math.round(viewport.width));
      canvas.height = Math.max(1, Math.round(viewport.height));
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport }).promise;
    } catch (_) {
      canvas.hidden = true;
      const fallback = canvas.parentElement?.querySelector?.('[data-merge-preview-fallback]');
      if (fallback) fallback.hidden = false;
    } finally {
      try { await documentPdf?.destroy?.(); } catch (_) {}
      try { loadingTask?.destroy?.(); } catch (_) {}
    }
  }

  function syncPendingMergeSelectionCopy() {
    if (!els.editorMergeSelection) return;
    const count = state.pendingMergeFiles.length;
    els.editorMergeSelection.textContent = count
      ? (count === 1
        ? '1 arquivo do dispositivo selecionado.'
        : count + ' arquivos do dispositivo selecionados.')
      : 'Escolha outro PDF na lista da Central ou adicione um arquivo do dispositivo.';
  }

  function renderMergePreview(files = [], item = null) {
    clearMergePreview();
    if (!els.editorMergePreview) return;
    const localFiles = Array.from(files || []).filter((file) => localMergeFileKind(file));
    const generation = state.mergePreviewGeneration;
    const entries = item ? [{ item, kind: 'pdf' }] : localFiles.map((file, index) => ({ file, index, kind: localMergeFileKind(file) }));
    if (!entries.length) return;

    for (const entry of entries) {
      const card = document.createElement('div');
      card.className = 'documents-editor-merge-preview-item';

      const thumb = document.createElement('div');
      thumb.className = 'documents-editor-merge-preview-thumb';

      const copy = document.createElement('div');
      copy.className = 'documents-editor-merge-preview-copy';
      const name = document.createElement('span');
      name.className = 'documents-editor-merge-preview-name';
      name.textContent = entry.file?.name || entry.item?.name || 'PDF selecionado';
      const meta = document.createElement('span');
      meta.className = 'documents-editor-merge-preview-meta';
      const size = mergePreviewSizeLabel(entry.file?.size || entry.item?.size);
      meta.textContent = entry.kind === 'image'
        ? ['Imagem', size].filter(Boolean).join(' · ')
        : ['PDF', size].filter(Boolean).join(' · ');
      copy.append(name, meta);

      if (entry.kind === 'image' && entry.file) {
        const image = document.createElement('img');
        image.alt = '';
        const url = URL.createObjectURL(entry.file);
        state.mergePreviewUrls.push(url);
        image.src = url;
        thumb.appendChild(image);
      } else if (entry.file) {
        const fallback = document.createElement('span');
        fallback.dataset.mergePreviewFallback = 'true';
        fallback.textContent = 'PDF';
        fallback.hidden = true;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        thumb.append(canvas, fallback);
        renderMergePdfPreview(entry.file, canvas, generation).catch(() => {});
      } else {
        const fallback = document.createElement('span');
        fallback.textContent = 'PDF';
        thumb.appendChild(fallback);
      }

      const remove = document.createElement('button');
      remove.className = 'documents-editor-merge-preview-remove';
      remove.type = 'button';
      remove.title = entry.file ? 'Remover arquivo selecionado' : 'Limpar seleção';
      remove.setAttribute('aria-label', remove.title);
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        if (entry.file) {
          state.pendingMergeFiles = state.pendingMergeFiles.filter((_, index) => index !== entry.index);
          state.pendingMergeItem = null;
          if (els.editorMergeLocalInput) els.editorMergeLocalInput.value = '';
          syncPendingMergeSelectionCopy();
          renderMergePreview(state.pendingMergeFiles);
        } else {
          state.pendingMergeItem = null;
          syncPendingMergeSelectionCopy();
          renderMergePreview();
        }
        syncEditorControls();
      });

      card.append(thumb, copy, remove);
      els.editorMergePreview.appendChild(card);
    }
    els.editorMergePreview.hidden = false;
  }

  async function mergeLocalFilesIntoEditor(files) {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    if (!session || !editor || state.editorBusy) return false;

    const selected = Array.from(files || []).filter((file) => localMergeFileKind(file));
    if (!selected.length) {
      setEditorStatus('Selecione pelo menos um PDF ou uma imagem válida.', 'warning');
      return false;
    }

    const viewState = currentViewerState();
    const firstInsertAt = mergeInsertAt();
    let insertAt = firstInsertAt;
    setEditorBusy(true);
    setEditorStatus(selected.length === 1 ? 'Adicionando arquivo ao documento…' : 'Adicionando arquivos ao documento…');

    try {
      for (const file of selected) {
        if (session !== state.editorSession) return false;
        const kind = localMergeFileKind(file);
        if (kind === 'pdf') {
          const added = await editor.addDocument(session, file, {
            label: 'PDF local',
            insertAt
          });
          insertAt += Number(added || 0);
        } else if (kind === 'image') {
          const normalized = await normalizeImageForPdf(file);
          await editor.addImagePage(session, normalized, {
            label: 'Imagem local',
            insertAt
          });
          insertAt += 1;
        }
      }

      if (session !== state.editorSession) return false;
      state.pendingMergeItem = null;
      state.pendingMergeFiles = [];
      clearMergePreview();
      setEditorWorkspaceMode('organize');
      refreshPdfListActions();
      syncEditorControls();

      const rebuilt = await buildEditorPreview({
        initialViewState: viewState ? { ...viewState, activePage: Math.min(firstInsertAt + 1, editor.pageCount(session)) } : null,
        allowBusy: true
      });
      if (!rebuilt) return false;

      capture('pdf_edit_completed', {
        route: '/documentos/',
        duration_ms: 0,
        operation: 'merge_local_files',
        size_bucket: sizeBucket(selected.reduce((sum, file) => sum + Number(file?.size || 0), 0))
      });
      setEditorStatus(
        selected.length === 1
          ? 'Arquivo adicionado ao documento. A alteração permanece local até a exportação.'
          : String(selected.length) + ' arquivos adicionados ao documento. As alterações permanecem locais até a exportação.',
        'success'
      );
      return true;
    } catch (error) {
      if (session === state.editorSession) {
        setEditorStatus(error?.message || 'Não foi possível adicionar o arquivo.', 'warning');
      }
      return false;
    } finally {
      if (els.editorMergeLocalInput) els.editorMergeLocalInput.value = '';
      if (session === state.editorSession && state.editorBusy) setEditorBusy(false);
    }
  }

  function prepareMergePdf(item) {
    const session = state.editorSession;
    if (!session || !item?.isPdf || state.editorBusy) return false;
    if (editorContainsItem(item)) {
      setEditorStatus('Esse PDF já faz parte do resultado atual.', 'warning');
      return false;
    }
    state.pendingMergeItem = item;
    state.pendingMergeFiles = [];
    if (els.editorMergeLocalInput) els.editorMergeLocalInput.value = '';
    setEditorWorkspaceMode('merge');
    if (els.editorMergeSelection) els.editorMergeSelection.textContent = item.name || 'PDF selecionado';
    renderMergePreview([], item);
    if (els.editorMergeAfterPage) {
      els.editorMergeAfterPage.max = String(window.PortalPdfEditor.pageCount(session));
      els.editorMergeAfterPage.value = String(Math.max(1, currentViewerState()?.activePage || 1));
    }
    syncEditorControls();
    setEditorStatus('Escolha onde o documento deve entrar e confirme em Unir.', 'success');
    return true;
  }

  function mergeInsertAt() {
    const session = state.editorSession;
    if (!session) return 0;
    const pageCount = window.PortalPdfEditor.pageCount(session);
    const mode = String(els.editorMergePosition?.value || 'after-document');
    if (mode === 'before-document') return 0;
    if (mode === 'after-page') {
      const page = Math.max(1, Math.min(pageCount, Math.round(Number(els.editorMergeAfterPage?.value || 1))));
      return page;
    }
    return pageCount;
  }

  async function applyPendingMerge() {
    if (state.editorBusy) return false;
    if (state.pendingMergeFiles.length) return mergeLocalFilesIntoEditor(state.pendingMergeFiles);
    if (!state.pendingMergeItem) return false;
    return mergePdfIntoEditor(state.pendingMergeItem, { insertAt: mergeInsertAt() });
  }

  function cancelPendingMerge() {
    state.pendingMergeItem = null;
    state.pendingMergeFiles = [];
    if (els.editorMergeLocalInput) els.editorMergeLocalInput.value = '';
    clearMergePreview();
    if (els.editorMergeSelection) els.editorMergeSelection.textContent = 'Escolha outro PDF na lista da Central ou adicione um arquivo do dispositivo.';
    syncEditorControls();
    setEditorWorkspaceMode('organize');
    setEditorStatus('Modo Organizar ativo.', 'success');
  }

  async function applyEditorOperation(operation, index, detail = null) {
    const editor = window.PortalPdfEditor;
    const session = state.editorSession;
    if (!editor || !session || state.editorBusy) return false;
    const started = performance.now();
    const viewState = currentViewerState();
    setEditorBusy(true);
    try {
      let changed = false;
      let targetIndex = index;
      if (operation === 'delete') changed = editor.removePage(session, index);
      if (operation === 'rotate-left') changed = editor.rotatePage(session, index, -1);
      if (operation === 'rotate-right') changed = editor.rotatePage(session, index, 1);
      if (operation === 'duplicate') {
        targetIndex = editor.duplicatePage(session, index);
        changed = Number.isInteger(targetIndex);
      }
      if (operation === 'reorder') {
        targetIndex = Math.round(Number(detail?.toIndex));
        changed = editor.movePageTo(session, index, targetIndex);
      }
      if (!changed) return false;

      const pageCount = editor.pageCount(session);
      const pageNumber = operation === 'reorder' || operation === 'duplicate'
        ? Math.min(pageCount, targetIndex + 1)
        : Math.min(pageCount, index + 1);
      const nextViewState = operation === 'reorder'
        ? viewStateAfterReorder(index, targetIndex, pageCount, viewState)
        : operation === 'duplicate'
          ? (viewState ? { ...viewState, activePage: pageNumber } : null)
          : viewStateAfterPageOperation(operation, index, pageCount, viewState);
      const eventOperation = operation === 'delete'
        ? 'delete_page'
        : operation === 'duplicate'
          ? 'duplicate_page'
          : operation === 'rotate-left' || operation === 'rotate-right'
            ? 'rotate_page'
            : 'reorder_page';

      syncEditorControls();
      refreshPdfListActions();
      capture('pdf_edit_completed', {
        route: '/documentos/',
        duration_ms: duration(started),
        operation: eventOperation,
        size_bucket: sizeBucket(state.pdfItem?.size)
      });
      const rebuilt = await buildEditorPreview({
        initialViewState: nextViewState,
        focusRestore: {
          pageNumber,
          action: operation === 'rotate-left'
            ? 'rotate-left'
            : operation === 'rotate-right'
              ? 'rotate-right'
              : operation === 'duplicate'
                ? 'duplicate'
                : ''
        },
        allowBusy: true
      });
      if (rebuilt) {
        const messages = {
          'rotate-left': 'Página girada 90° para a esquerda.',
          'rotate-right': 'Página girada 90° para a direita.',
          duplicate: 'Página duplicada.',
          reorder: 'Página movida para a nova posição.',
          delete: 'Página excluída. Use Desfazer se precisar restaurá-la.'
        };
        setEditorStatus(messages[operation] || 'PDF atualizado.', 'success');
      }
      return rebuilt;
    } finally {
      if (session === state.editorSession && state.editorBusy) setEditorBusy(false);
    }
  }

  async function undoEditor() {
    const session = state.editorSession;
    if (!session || state.editorBusy || !window.PortalPdfEditor?.undo(session)) return false;
    state.selectedObjectId = '';
    const viewState = currentViewerState();
    setEditorBusy(true);
    try {
      syncEditorControls();
      refreshPdfListActions();
      return await buildEditorPreview({
        initialViewState: viewState ? {
          ...viewState,
          activePage: Math.min(viewState.activePage || 1, window.PortalPdfEditor.pageCount(session))
        } : null,
        allowBusy: true
      });
    } finally {
      if (session === state.editorSession && state.editorBusy) setEditorBusy(false);
    }
  }

  async function redoEditor() {
    const session = state.editorSession;
    if (!session || state.editorBusy || !window.PortalPdfEditor?.redo(session)) return false;
    state.selectedObjectId = '';
    const viewState = currentViewerState();
    setEditorBusy(true);
    try {
      syncEditorControls();
      refreshPdfListActions();
      return await buildEditorPreview({
        initialViewState: viewState ? {
          ...viewState,
          activePage: Math.min(viewState.activePage || 1, window.PortalPdfEditor.pageCount(session))
        } : null,
        allowBusy: true
      });
    } finally {
      if (session === state.editorSession && state.editorBusy) setEditorBusy(false);
    }
  }

  function choosePdfToMerge() {
    if (!state.editorSession || state.editorBusy) return;
    state.pendingMergeItem = null;
    state.pendingMergeFiles = [];
    if (els.editorMergeLocalInput) els.editorMergeLocalInput.value = '';
    clearMergePreview();
    if (els.editorMergeSelection) els.editorMergeSelection.textContent = 'Escolha outro PDF na lista da Central ou adicione um arquivo do dispositivo.';
    if (els.editorMergePosition) els.editorMergePosition.value = 'after-document';
    if (els.editorMergePageField) els.editorMergePageField.hidden = true;
    setEditorWorkspaceMode('merge');
    syncEditorControls();
    refreshPdfListActions();
    setEditorStatus('Selecione outro PDF na lista da Central ou use “Adicionar PDF ou imagem”; depois escolha a posição e confirme em Unir.', 'success');
    const candidate = [...els.list.querySelectorAll('[data-index]')].find((button) => {
      const item = state.items[Number(button.dataset.index)];
      return item?.isPdf && !editorContainsItem(item);
    });
    (candidate || els.list).scrollIntoView({ behavior: 'smooth', block: 'center' });
    candidate?.focus?.({ preventScroll: true });
  }

  async function addBlankPageToEditor() {
    const session = state.editorSession;
    if (!session || state.editorBusy) return false;
    const viewState = currentViewerState();
    const insertAt = Math.max(0, Math.min(
      window.PortalPdfEditor.pageCount(session),
      Math.round(Number(viewState?.activePage || window.PortalPdfEditor.pageCount(session)))
    ));
    setEditorBusy(true);
    setEditorStatus('Inserindo página em branco…');
    try {
      const pageIndex = await window.PortalPdfEditor.addBlankPage(session, { insertAt });
      syncEditorControls();
      const rebuilt = await buildEditorPreview({
        initialViewState: viewState ? { ...viewState, activePage: pageIndex + 1 } : null,
        allowBusy: true
      });
      if (rebuilt) {
        capture('pdf_edit_completed', {
          route: '/documentos/',
          duration_ms: 0,
          operation: 'insert_blank_page',
          size_bucket: sizeBucket(state.pdfItem?.size)
        });
        setEditorStatus('Página em branco inserida.', 'success');
      }
      return rebuilt;
    } finally {
      if (session === state.editorSession && state.editorBusy) setEditorBusy(false);
    }
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

  function showCustomViewerSurface() {
    if (els.customViewer) els.customViewer.hidden = false;
  }

  function showPortalViewerFailure(message = 'Não foi possível renderizar este PDF no visualizador próprio do Portal.') {
    window.PortalPdfViewer?.close?.();
    showCustomViewerSurface();
    if (els.pdfThumbnails) els.pdfThumbnails.replaceChildren();
    if (els.pdfPages) {
      els.pdfPages.replaceChildren();
      const error = document.createElement('div');
      error.className = 'documents-pdf-error';
      error.textContent = message;
      els.pdfPages.appendChild(error);
    }
    if (els.pdfPageCountLabel) els.pdfPageCountLabel.textContent = '';
    els.viewerState.className = 'documents-viewer-state';
    els.viewerState.textContent = message;
  }

  function recordFirstPageVisible(openId, bucket, cacheState, source = 'drive') {
    if (state.pdfFirstPageEmitted || openId !== state.pdfOpenId) return;
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

  function markViewerReady(openId, bucket, cacheState, progressive, source = 'drive') {
    window.setTimeout(() => {
      if (state.pdfReadyEmitted || openId !== state.pdfOpenId || (progressive && state.pdfProgressiveFailed)) return;
      state.pdfReadyEmitted = true;
      els.viewerState.className = 'documents-viewer-state ready';
      capture('pdf_ready', {
        route: '/documentos/',
        duration_ms: duration(state.pdfOpenedAt),
        source,
        size_bucket: bucket,
        cache_state: cacheState
      });
    }, progressive ? 30 : 20);
  }

  async function openWithPortalViewer(source, { openId, bucket, cacheState, progressive = false, sourceLabel = 'drive' }) {
    const viewer = window.PortalPdfViewer;
    if (!viewer?.open || viewer.supported?.() === false) {
      showPortalViewerFailure('O visualizador próprio do Portal não está disponível neste navegador.');
      return false;
    }

    showCustomViewerSurface();
    els.viewerState.textContent = 'Renderizando no visualizador do Portal…';
    els.viewerState.className = 'documents-viewer-state';

    try {
      await viewer.open(source, {
        root: els.customViewer,
        scrollRoot: els.pdfPageScroll,
        pagesRoot: els.pdfPages,
        thumbnailsRoot: els.pdfThumbnails,
        zoomLabel: els.pdfZoomLabel,
        pageCountLabel: els.pdfPageCountLabel,
        onFirstPageVisible: () => {
          if (openId !== state.pdfOpenId) return;
          recordFirstPageVisible(openId, bucket, cacheState, sourceLabel);
        },
        onReady: () => {
          if (openId !== state.pdfOpenId) return;
          els.viewerState.textContent = 'Visualizador do Portal pronto.';
          markViewerReady(openId, bucket, cacheState, progressive, sourceLabel);
        },
        onError: () => {
          if (openId !== state.pdfOpenId || state.pdfCustomFallbackStarted) return;
          state.pdfCustomFallbackStarted = true;
          if (progressive && state.pdfItem && !state.pdfFallbackStarted) {
            els.viewerState.textContent = 'Recarregando o PDF completo no visualizador do Portal…';
            loadPdfBlobFallback(state.pdfItem, openId, bucket).catch(() => {
              if (openId !== state.pdfOpenId) return;
              showPortalViewerFailure();
            });
            return;
          }
          showPortalViewerFailure();
        }
      });
      if (openId !== state.pdfOpenId) {
        return false;
      }
      return true;
    } catch (_) {
      if (openId !== state.pdfOpenId) return false;
      viewer.close();
      showPortalViewerFailure();
      return false;
    }
  }

  async function loadPdfBlobFallback(item, openId, bucket) {
    if (openId !== state.pdfOpenId || state.pdfFallbackStarted) return false;
    state.pdfFallbackStarted = true;
    releaseProgressiveStream();
    window.PortalPdfViewer?.close?.();
    showCustomViewerSurface();
    els.viewerState.textContent = 'Carregando o PDF completo no visualizador do Portal…';
    els.viewerState.className = 'documents-viewer-state';

    const blob = await fetchPdfBlob(item);
    if (openId !== state.pdfOpenId) return false;
    storeCachedPdf(item, blob).catch(() => {});
    if (state.pdfObjectUrl) URL.revokeObjectURL(state.pdfObjectUrl);
    state.pdfObjectUrl = URL.createObjectURL(blob);
    state.pdfCustomFallbackStarted = false;

    const customOpened = await openWithPortalViewer(blob, {
      openId,
      bucket: sizeBucket(blob.size || item.size),
      cacheState: 'miss',
      progressive: false,
      sourceLabel: 'drive'
    });
    if (!customOpened && openId === state.pdfOpenId) showPortalViewerFailure();
    return customOpened;
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

    if (els.editPdf) els.editPdf.hidden = !(canEditDocuments() && state.pdfItem && !state.editorSession);
    if (els.editorRailEdit) els.editorRailEdit.hidden = !(canEditDocuments() && state.pdfItem);

    if (els.editorSync) {
      els.editorSync.hidden = !(canSyncDocuments() && state.editorSession);
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
        const editorHasItem = Boolean(state.editorSession && editorContainsItem(item));
        const action = item.isFolder
          ? 'Abrir pasta'
          : item.isPdf
            ? (state.editorSession ? (editorHasItem ? 'Já no editor' : 'Selecionar para unir') : 'Abrir PDF')
            : 'Não suportado nesta fase';
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
    resetEditorState();
    state.pdfOpenId += 1;
    releaseProgressiveStream();
    window.PortalPdfViewer?.close?.();
    if (state.pdfObjectUrl) URL.revokeObjectURL(state.pdfObjectUrl);
    state.pdfObjectUrl = '';
    state.pdfItem = null;
    if (els.editorRailEdit) els.editorRailEdit.hidden = true;
    state.pdfFallbackStarted = false;
    state.pdfProgressiveFailed = false;
    state.pdfFirstPageEmitted = false;
    state.pdfReadyEmitted = false;
    state.pdfCustomFallbackStarted = false;
    state.pdfFirstPageObserver?.disconnect?.();
    state.pdfFirstPageObserver = null;
    if (els.customViewer) els.customViewer.hidden = true;
    if (els.pdfPages) els.pdfPages.replaceChildren();
    if (els.pdfThumbnails) els.pdfThumbnails.replaceChildren();
    if (els.pdfPageCountLabel) els.pdfPageCountLabel.textContent = '';
    if (els.pdfZoomLabel) els.pdfZoomLabel.textContent = '100%';
    els.viewer.hidden = true;
    els.viewerState.className = 'documents-viewer-state';
    els.viewerState.textContent = 'Preparando PDF…';
  }

  async function openPdf(item) {
    closePdf();
    const openId = state.pdfOpenId;
    state.pdfItem = item;
    els.viewer.hidden = false;
    els.viewerModeLabel.textContent = 'Visualização';
    els.editPdf.hidden = !canEditDocuments();
    if (els.editorRailEdit) els.editorRailEdit.hidden = !canEditDocuments();
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
        const customOpened = await openWithPortalViewer(cachedBlob, {
          openId,
          bucket: sizeBucket(cachedBlob.size || item.size),
          cacheState: 'hit',
          progressive: false,
          sourceLabel: 'cache'
        });

        if (!customOpened && openId === state.pdfOpenId) {
          showPortalViewerFailure();
        }
      } else {
        els.viewerState.textContent = 'Abrindo primeira página…';
        const progressiveUrl = await registerProgressiveStream(item);
        if (openId !== state.pdfOpenId) return;

        if (progressiveUrl) {
          const customOpened = await openWithPortalViewer({ url: progressiveUrl }, {
            openId,
            bucket,
            cacheState: 'miss',
            progressive: true,
            sourceLabel: 'drive'
          });
          if (openId !== state.pdfOpenId || state.pdfFallbackStarted) return;

          const warm = () => warmPdfCache(item, { prefetch: false }).catch(() => {});
          if (typeof requestIdleCallback === 'function') requestIdleCallback(warm, { timeout: 2200 });
          else window.setTimeout(warm, 1400);

          if (!customOpened) {
            await loadPdfBlobFallback(item, openId, bucket);
          }
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
    if (item.isPdf) {
      if (state.editorSession) prepareMergePdf(item);
      else openPdf(item);
    }
  });

  els.loadMore.addEventListener('click', () => {
    if (!state.nextPageToken) return;
    if (state.searchMode) search(state.searchQuery, { append: true, pageToken: state.nextPageToken });
    else loadFolder({ append: true, pageToken: state.nextPageToken });
  });

  els.closeViewer.addEventListener('click', closePdf);
  els.editPdf.addEventListener('click', startEditor);
  els.editorRailEdit?.addEventListener('click', () => {
    if (state.editorSession) setEditorWorkspaceMode('organize');
    else startEditor();
  });
  els.editorUndo.addEventListener('click', undoEditor);
  els.editorRedo.addEventListener('click', redoEditor);
  els.editorOrganize?.addEventListener('click', () => {
    if (!state.editorSession || state.editorBusy) return;
    state.pendingMergeItem = null;
    state.pendingMergeFiles = [];
    if (els.editorMergeLocalInput) els.editorMergeLocalInput.value = '';
    clearMergePreview();
    state.selectedObjectId = '';
    setEditorWorkspaceMode('organize');
    syncEditorControls();
    setEditorStatus('Modo Organizar ativo.', 'success');
  });
  els.editorCrop?.addEventListener('click', startCropPages);
  els.editorSelect?.addEventListener('click', startSelectObjects);
  els.editorWrite?.addEventListener('click', startWriteObjects);
  els.editorDraw?.addEventListener('click', () => startDrawMode('draw'));
  els.editorDrawPen?.addEventListener('click', () => startDrawMode('draw'));
  els.editorDrawEraser?.addEventListener('click', () => startDrawMode('erase'));
  els.editorDrawColor?.addEventListener('input', () => {
    state.editorDrawColor = /^#[0-9a-f]{6}$/i.test(String(els.editorDrawColor.value || ''))
      ? String(els.editorDrawColor.value).toLowerCase()
      : '#111111';
    syncEditorStrokes();
  });
  els.editorDrawWidth?.addEventListener('input', () => {
    state.editorDrawWidth = Math.max(1, Math.min(20, Number(els.editorDrawWidth.value || 4)));
    syncEditorStrokes();
  });
  els.editorOverlayImage?.addEventListener('click', () => {
    if (!state.editorSession || state.editorBusy) return;
    if (state.editorMode === 'image') {
      els.editorOverlayImageInput?.click();
      return;
    }
    state.selectedObjectId = '';
    setEditorWorkspaceMode('image');
    syncEditorControls();
    setEditorStatus('Colar imagem ativo. Clique novamente no botão para escolher a imagem do dispositivo.', 'success');
  });
  els.editorOverlayImageInput?.addEventListener('change', () => {
    const file = els.editorOverlayImageInput.files?.[0];
    if (file) addOverlayImageFile(file).catch(() => {});
  });
  els.editorObjectFont?.addEventListener('change', () => updateSelectedEditorObject({ fontFamily: els.editorObjectFont.value }));
  els.editorObjectFontSize?.addEventListener('change', () => updateSelectedEditorObject({ fontSize: Number(els.editorObjectFontSize.value || 18) / 560 }));
  els.editorObjectColor?.addEventListener('input', () => previewSelectedEditorColor(els.editorObjectColor.value));
  els.editorObjectColor?.addEventListener('change', () => finalizeSelectedEditorColor(els.editorObjectColor.value));
  els.editorObjectColor?.addEventListener('blur', () => finalizeSelectedEditorColor(els.editorObjectColor.value));
  els.editorObjectBold?.addEventListener('click', () => {
    const object = selectedEditorObject();
    if (object?.type === 'text') updateSelectedEditorObject({ fontWeight: object.fontWeight === 'bold' ? 'normal' : 'bold' });
  });
  els.editorObjectItalic?.addEventListener('click', () => {
    const object = selectedEditorObject();
    if (object?.type === 'text') updateSelectedEditorObject({ fontStyle: object.fontStyle === 'italic' ? 'normal' : 'italic' });
  });
  els.editorObjectUnderline?.addEventListener('click', () => {
    const object = selectedEditorObject();
    if (object?.type === 'text') updateSelectedEditorObject({ textDecoration: object.textDecoration === 'underline' ? 'none' : 'underline' });
  });
  els.editorObjectAlign?.addEventListener('change', () => updateSelectedEditorObject({ textAlign: els.editorObjectAlign.value }));
  els.editorObjectOpacity?.addEventListener('change', () => updateSelectedEditorObject({ opacity: Number(els.editorObjectOpacity.value || 100) / 100 }));
  els.editorObjectDelete?.addEventListener('click', deleteSelectedEditorObject);
  els.editorMerge.addEventListener('click', choosePdfToMerge);
  els.editorMergeLocal?.addEventListener('click', () => {
    if (!state.editorSession || state.editorBusy) return;
    els.editorMergeLocalInput?.click();
  });
  els.editorMergeLocalInput?.addEventListener('change', () => {
    const files = Array.from(els.editorMergeLocalInput.files || []).filter((file) => localMergeFileKind(file));
    if (!files.length) {
      state.pendingMergeFiles = [];
      clearMergePreview();
      syncPendingMergeSelectionCopy();
      syncEditorControls();
      setEditorStatus('Selecione pelo menos um PDF ou uma imagem válida.', 'warning');
      return;
    }
    state.pendingMergeItem = null;
    state.pendingMergeFiles = files;
    syncPendingMergeSelectionCopy();
    renderMergePreview(files);
    syncEditorControls();
    setEditorStatus('Arquivo selecionado. Escolha a posição e confirme em Unir.', 'success');
  });
  els.editorBlankPage?.addEventListener('click', () => addBlankPageToEditor().catch(() => {}));
  els.editorImage.addEventListener('click', () => els.editorImageInput.click());
  els.editorImageInput.addEventListener('change', async () => {
    const files = els.editorImageInput.files;
    els.editorImageInput.value = '';
    await addSelectedImages(files);
  });
  els.editorPreview?.addEventListener('click', () => buildEditorPreview({ explicit: true }).catch(() => {}));
  els.editorSync?.addEventListener('click', () => forceDriveSync().catch?.(() => {}));
  document.querySelectorAll('input[name="editorSyncOperation"]').forEach((control) => {
    control.addEventListener('change', updateDriveSyncPanel);
  });
  els.editorSyncApply?.addEventListener('click', () => syncEditedPdfToDrive().catch(() => {}));
  els.editorSyncCancel?.addEventListener('click', cancelDriveSyncPanel);
  els.editorExport?.addEventListener('click', () => exportEditedPdfLocal().catch(() => {}));
  els.editorPrint?.addEventListener('click', () => printEditedPdfLocal().catch(() => {}));
  els.editorExit.addEventListener('click', exitEditor);
  els.editorMergePosition?.addEventListener('change', () => {
    if (els.editorMergePageField) {
      els.editorMergePageField.hidden = els.editorMergePosition.value !== 'after-page';
    }
  });
  els.editorMergeApply?.addEventListener('click', () => applyPendingMerge().catch(() => {}));
  els.editorMergeCancel?.addEventListener('click', cancelPendingMerge);
  els.pdfZoomOut?.addEventListener('click', () => window.PortalPdfViewer?.zoomOut?.());
  els.pdfZoomReset?.addEventListener('click', () => window.PortalPdfViewer?.resetZoom?.());
  els.pdfZoomIn?.addEventListener('click', () => window.PortalPdfViewer?.zoomIn?.());
  els.pdfFitWidth?.addEventListener('click', () => window.PortalPdfViewer?.fitWidth?.());

  document.addEventListener('paste', (event) => {
    handleEditorPaste(event).catch(() => {});
  }, true);

  document.addEventListener('keydown', (event) => {
    if (!state.editorSession || state.editorBusy) return;

    const key = String(event.key || '').toLowerCase();
    const primary = (event.ctrlKey || event.metaKey) && !event.altKey;
    const typingTarget = editorShortcutIsTypingTarget(event.target);

    if (primary && key === 'z' && !event.shiftKey) {
      if (typingTarget) return;
      event.preventDefault();
      event.stopPropagation();
      undoEditor().catch(() => {});
      return;
    }

    if (primary && ((key === 'y' && !event.shiftKey) || (key === 'z' && event.shiftKey))) {
      if (typingTarget) return;
      event.preventDefault();
      event.stopPropagation();
      redoEditor().catch(() => {});
      return;
    }

    if (primary && key === 'p') {
      event.preventDefault();
      event.stopPropagation();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      printEditedPdfLocal().catch(() => {});
      return;
    }

    if (event.key !== 'Delete' || !state.selectedObjectId || typingTarget) return;
    if (!deleteSelectedEditorObject()) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

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
    if (state.access?.capabilities?.view || state.access?.capabilities?.manage) await loadEditorPreferences();
    if (state.access?.capabilities?.view && state.access?.drive?.connected) await loadFolder();
  } catch (error) {
    showStatus(error.message || 'Não foi possível iniciar a Central de Documentos.', 'warning');
    els.badge.textContent = 'Central indisponível';
    els.badge.className = 'documents-hero-state pending';
  }
})();
