'use strict';

(() => {
  const viewer = window.PortalPdfViewer;
  const editor = window.PortalPdfEditor;
  const fixture = window.CentralDocsTestFixture;
  const root = document.documentElement;
  const elements = {
    surface: document.getElementById('pdfRoot'),
    scroll: document.getElementById('scrollRoot'),
    pages: document.getElementById('pages'),
    thumbnails: document.getElementById('thumbnails'),
    zoomOut: document.getElementById('zoomOut'),
    zoomReset: document.getElementById('zoomReset'),
    zoomIn: document.getElementById('zoomIn'),
    fitWidth: document.getElementById('fitWidth'),
    pageCount: document.getElementById('pageCount'),
    status: document.getElementById('labStatus'),
    enterEditor: document.getElementById('enterEditor'),
    editorControls: document.getElementById('editorControls'),
    editorStatus: document.getElementById('editorStatus'),
    undo: document.getElementById('editorUndo'),
    redo: document.getElementById('editorRedo'),
    organize: document.getElementById('editorOrganize'),
    merge: document.getElementById('editorMerge'),
    mergePanel: document.getElementById('editorMergePanel'),
    mergeSelection: document.getElementById('editorMergeSelectionLab'),
    mergePosition: document.getElementById('editorMergePosition'),
    mergePageField: document.getElementById('editorMergePageField'),
    mergeAfterPage: document.getElementById('editorMergeAfterPage'),
    mergeConfirm: document.getElementById('editorMergeConfirm'),
    mergeCancel: document.getElementById('editorMergeCancel'),
    mergeFileButton: document.getElementById('editorMergeFileButton'),
    mergeFileInput: document.getElementById('editorMergeFileInput'),
    mergePreview: document.getElementById('editorMergePreviewLab'),
    blank: document.getElementById('editorBlank'),
    addImage: document.getElementById('editorAddImage'),
    addImageInput: document.getElementById('editorAddImageInput'),
    crop: document.getElementById('editorCrop'),
    select: document.getElementById('editorSelect'),
    write: document.getElementById('editorWrite'),
    overlayImage: document.getElementById('editorOverlayImage'),
    overlayImageInput: document.getElementById('editorOverlayImageInput'),
    draw: document.getElementById('editorDraw'),
    drawToolbar: document.getElementById('editorDrawToolbar'),
    drawColor: document.getElementById('editorDrawColor'),
    drawWidth: document.getElementById('editorDrawWidth'),
    drawPen: document.getElementById('editorDrawPen'),
    drawEraser: document.getElementById('editorDrawEraser'),
    objectToolbar: document.getElementById('editorObjectToolbar'),
    objectFont: document.getElementById('editorObjectFont'),
    objectFontSize: document.getElementById('editorObjectFontSize'),
    objectColor: document.getElementById('editorObjectColor'),
    objectBold: document.getElementById('editorObjectBold'),
    objectItalic: document.getElementById('editorObjectItalic'),
    objectUnderline: document.getElementById('editorObjectUnderline'),
    objectAlign: document.getElementById('editorObjectAlign'),
    objectOpacity: document.getElementById('editorObjectOpacity'),
    objectDelete: document.getElementById('editorObjectDelete'),
    refresh: document.getElementById('editorRefresh'),
    exportPdf: document.getElementById('editorExport'),
    exit: document.getElementById('editorExit')
  };

  const state = {
    originalBlob: fixture?.blob?.() || null,
    session: null,
    merging: false,
    mergeFiles: [],
    mergePreviewUrls: [],
    mergePreviewGeneration: 0,
    mode: 'readonly',
    selectedObjectId: '',
    colorPalette: ['#000000', '#ffffff', '#e53935', '#1565c0', '#2e7d32', '#f9a825'],
    drawTool: 'draw',
    drawColor: '#111111',
    drawWidth: 4,
    viewState: null,
    sequence: 0,
    flattenSeeded: false,
    operation: Promise.resolve()
  };

  function fail(error) {
    const message = String(error?.message || error || 'falha desconhecida');
    root.dataset.viewerState = 'error';
    root.dataset.operationState = 'error';
    elements.status.dataset.state = 'error';
    elements.status.textContent = `ERRO: ${message}`;
    elements.editorStatus.textContent = message;
    elements.surface.removeAttribute('aria-busy');
    console.error('[central-docs-lab]', error);
  }

  function run(operation) {
    state.operation = state.operation.then(operation, operation).catch(fail);
    return state.operation;
  }

  function pageOrder() {
    if (!state.session) return '';
    return editor.pageModel(state.session)
      .map((page) => `${page.sourceIndex}:${page.sourcePage - 1}`)
      .join(',');
  }

  function selectedObject() {
    if (!state.session || !state.selectedObjectId) return null;
    return editor.objectModel(state.session).find((item) => item.id === state.selectedObjectId) || null;
  }

  function syncObjectToolbar() {
    const object = selectedObject();
    elements.objectToolbar.hidden = !object;
    if (!object) return;
    const text = object.type === 'text';
    for (const field of elements.objectToolbar.querySelectorAll('.documents-object-field--font')) field.hidden = !text;
    if (text) {
      elements.objectFont.value = object.fontFamily || 'Arial';
      elements.objectFontSize.value = String(Math.round((object.fontSize || .032) * 560));
      elements.objectColor.value = /^#[0-9a-f]{6}$/i.test(object.color || '') ? object.color : '#111111';
      elements.objectAlign.value = ['left', 'center', 'right'].includes(object.textAlign) ? object.textAlign : 'left';
      for (const [control, active] of [
        [elements.objectBold, object.fontWeight === 'bold'],
        [elements.objectItalic, object.fontStyle === 'italic'],
        [elements.objectUnderline, object.textDecoration === 'underline']
      ]) {
        control.classList.toggle('active', active);
        control.setAttribute('aria-pressed', String(active));
      }
    }
    elements.objectOpacity.value = String(Math.round((object.opacity ?? 1) * 100));
  }

  function normalizedDrawWidth() {
    return Math.min(0.05, Math.max(0.001, Number(state.drawWidth || 4) / 760));
  }

  function syncDraws() {
    if (!state.session || !editor?.strokeModel || !viewer?.setEditorStrokes) return false;
    const mode = state.mode === 'draw' && state.drawTool === 'erase' ? 'erase'
      : state.mode === 'draw' ? 'draw'
        : 'none';
    const result = viewer.setEditorStrokes(editor.strokeModel(state.session), {
      mode,
      color: state.drawColor,
      width: normalizedDrawWidth(),
      onStrokeCommit(pageIndex, stroke) {
        const id = editor.addStroke(state.session, pageIndex, stroke?.points, {
          color: stroke?.color || state.drawColor,
          width: stroke?.width || normalizedDrawWidth()
        });
        if (!id) return;
        syncEditorState();
        syncDraws();
      },
      onEraseCommit(strokeIds) {
        const removed = editor.removeStrokes(state.session, strokeIds);
        if (!removed) return;
        syncEditorState();
        syncDraws();
      }
    });
    return result;
  }

  function syncObjects() {
    if (!state.session) return false;
    const mode = ['write', 'image', 'select'].includes(state.mode) ? state.mode : 'none';
    const result = viewer.setEditorObjects?.(editor.objectModel(state.session), {
      mode,
      selectedObjectId: state.selectedObjectId,
      colorPalette: state.colorPalette,
      onSelect(id) {
        state.selectedObjectId = id;
        syncObjectToolbar();
      },
      onChange(id, patch) {
        editor.updateObject(state.session, id, patch, { commit: false });
      },
      onCommit() {
        editor.commitObjectMutation(state.session);
        syncEditorState();
      },
      onTextCommit(id, value) {
        editor.updateObject(state.session, id, { text: value }, { commit: false });
        editor.commitObjectMutation(state.session);
        syncEditorState();
      },
      onPageChange(id, pageIndex, patch) {
        editor.moveObjectToPage(state.session, id, pageIndex, { ...patch, commit: false });
      },
      onDelete(id) {
        if (!editor.removeObject(state.session, id)) return;
        if (state.selectedObjectId === id) state.selectedObjectId = '';
        syncEditorState();
        syncObjects();
      },
      onColorPaletteChange(colors) {
        state.colorPalette = Array.isArray(colors) ? [...colors] : state.colorPalette;
        root.dataset.editorPalette = state.colorPalette.join(',');
      },
      onCreateText(pageNumber, point) {
        if (state.mode !== 'write') return;
        const id = editor.addTextObject(state.session, pageNumber - 1, {
          x: Math.min(.82, Math.max(0, point.x - .04)),
          y: Math.min(.9, Math.max(0, point.y - .025)),
          text: 'Digite aqui'
        });
        state.selectedObjectId = id || '';
        syncEditorState();
        syncObjects();
        const node = elements.pages.querySelector(`.portal-pdf-object[data-object-id="${CSS.escape(state.selectedObjectId)}"] .portal-pdf-object-text`);
        node?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      }
    });
    viewer.setEditorCrops?.(editor.pageModel(state.session), {
      mode: state.mode === 'crop' ? 'crop' : 'none',
      onConfirm(pageIndex, crop) {
        if (!editor.setPageCrop(state.session, pageIndex, crop, { commit: false })) return;
        editor.commitObjectMutation(state.session);
        syncEditorState();
      },
      onReset(pageIndex) {
        if (!editor.clearPageCrop(state.session, pageIndex)) return;
        syncEditorState();
        syncObjects();
      }
    });
    syncObjectToolbar();
    syncDraws();
    root.dataset.objectCount = String(editor.objectModel(state.session).length);
    root.dataset.cropCount = String(editor.pageModel(state.session).filter((page) => page.crop).length);
    root.dataset.strokeCount = String(editor.strokeModel(state.session).length);
    root.dataset.strokePages = editor.strokeModel(state.session).map((stroke) => String(stroke.displayPage)).join(',');
    root.dataset.strokeIds = editor.strokeModel(state.session).map((stroke) => String(stroke.id)).join(',');
    return result;
  }

  function setMode(mode) {
    if (!state.session) return;
    state.mode = mode;
    state.merging = mode === 'merge';
    viewer.setOrganizerMode?.(mode === 'organize' || mode === 'merge');
    syncEditorState();
    syncObjects();
  }

  function syncEditorState() {
    const editing = Boolean(state.session);
    root.dataset.editorMode = editing ? 'editor' : 'readonly';
    root.dataset.editorRevision = String(state.session?.revision || 0);
    root.dataset.pageOrder = pageOrder();
    root.dataset.pageRotations = state.session ? editor.pageModel(state.session).map((page) => page.rotation).join(',') : '';
    root.dataset.pageKinds = state.session ? editor.pageModel(state.session).map((page) => page.sourceKind).join(',') : '';
    root.dataset.pageCrops = state.session ? editor.pageModel(state.session).map((page) => page.crop ? [page.crop.x, page.crop.y, page.crop.width, page.crop.height].map((value) => Number(value.toFixed(4))).join(':') : 'full').join(',') : '';
    root.dataset.cropCount = state.session ? String(editor.pageModel(state.session).filter((page) => page.crop).length) : '0';
    root.dataset.strokeCount = state.session ? String(editor.strokeModel(state.session).length) : '0';
    root.dataset.strokePages = state.session ? editor.strokeModel(state.session).map((stroke) => String(stroke.displayPage)).join(',') : '';
    root.dataset.strokeIds = state.session ? editor.strokeModel(state.session).map((stroke) => String(stroke.id)).join(',') : '';
    elements.editorControls.hidden = !editing;
    elements.enterEditor.hidden = editing;
    elements.enterEditor.disabled = editing || root.dataset.viewerState !== 'ready';
    elements.surface.classList.toggle('is-editing', editing);
    elements.surface.dataset.editorMode = editing ? 'true' : 'false';
    elements.surface.dataset.editorWorkspaceMode = editing ? state.mode : 'readonly';
    elements.mergePanel.hidden = !editing || state.mode !== 'merge';
    elements.organize.classList.toggle('active', editing && state.mode === 'organize');
    elements.organize.setAttribute('aria-pressed', String(editing && state.mode === 'organize'));
    elements.merge.classList.toggle('active', editing && state.mode === 'merge');
    elements.merge.setAttribute('aria-pressed', String(editing && state.mode === 'merge'));
    elements.crop.classList.toggle('active', editing && state.mode === 'crop');
    elements.crop.setAttribute('aria-pressed', String(editing && state.mode === 'crop'));
    elements.select.classList.toggle('active', editing && state.mode === 'select');
    elements.write.classList.toggle('active', editing && state.mode === 'write');
    elements.overlayImage.classList.toggle('active', editing && state.mode === 'image');
    elements.draw.classList.toggle('active', editing && state.mode === 'draw');
    elements.draw.setAttribute('aria-pressed', String(editing && state.mode === 'draw'));
    elements.drawToolbar.hidden = !editing || state.mode !== 'draw';
    const penActive = editing && state.mode === 'draw' && state.drawTool === 'draw';
    const eraserActive = editing && state.mode === 'draw' && state.drawTool === 'erase';
    elements.drawPen.classList.toggle('active', penActive);
    elements.drawPen.setAttribute('aria-pressed', String(penActive));
    elements.drawEraser.classList.toggle('active', eraserActive);
    elements.drawEraser.setAttribute('aria-pressed', String(eraserActive));
    viewer.setOrganizerMode?.(editing && (state.mode === 'organize' || state.mode === 'merge'));
    elements.surface.setAttribute('aria-label', editing ? 'Editor visual PDF sintético' : 'Visualizador PDF sintético');
    elements.undo.disabled = !editing || !editor.canUndo(state.session);
    elements.redo.disabled = !editing || !editor.canRedo(state.session);
    elements.organize.disabled = !editing;
    elements.merge.disabled = !editing;
    elements.mergeConfirm.disabled = !editing || !state.merging;
    elements.mergeFileButton.disabled = !editing || !state.merging;
    elements.mergeFileInput.disabled = !editing || !state.merging;
    elements.mergeCancel.disabled = !editing;
    elements.mergePosition.disabled = !editing;
    elements.mergeAfterPage.disabled = !editing;
    elements.blank.disabled = !editing;
    elements.addImage.disabled = !editing;
    elements.addImageInput.disabled = !editing;
    elements.crop.disabled = !editing;
    elements.select.disabled = !editing;
    elements.write.disabled = !editing;
    elements.overlayImage.disabled = !editing;
    elements.draw.disabled = !editing;
    elements.drawColor.disabled = !editing;
    elements.drawWidth.disabled = !editing;
    elements.drawPen.disabled = !editing;
    elements.drawEraser.disabled = !editing;
    elements.objectDelete.disabled = !editing || !selectedObject();
    elements.refresh.disabled = !editing;
    elements.exportPdf.disabled = !editing || typeof editor?.buildFlattenedBlob !== 'function';
    elements.exit.disabled = !editing;
  }

  function setBusy(busy, message = '') {
    const active = busy === true;
    root.dataset.operationState = active ? 'busy' : 'ready';
    elements.surface.setAttribute('aria-busy', active ? 'true' : 'false');
    if (message) elements.editorStatus.textContent = message;
    if (active) {
      for (const button of [elements.undo, elements.redo, elements.organize, elements.merge, elements.mergeConfirm, elements.mergeCancel, elements.mergePosition, elements.mergeAfterPage, elements.mergeFileButton, elements.blank, elements.addImage, elements.crop, elements.select, elements.write, elements.overlayImage, elements.draw, elements.drawColor, elements.drawWidth, elements.drawPen, elements.drawEraser, elements.objectDelete, elements.refresh, elements.exportPdf, elements.exit]) {
        button.disabled = true;
      }
      elements.thumbnails.querySelectorAll('[data-thumbnail-action]').forEach((button) => {
        button.disabled = true;
      });
    } else {
      syncEditorState();
    }
  }

  function adjustedViewState(operation, index, pageCount, baseState) {
    if (!baseState) return null;
    let activePage = Math.max(1, Math.round(Number(baseState.activePage || 1)));
    const sourcePage = index + 1;
    if (operation === 'delete') {
      if (activePage > sourcePage) activePage -= 1;
      else if (activePage === sourcePage) activePage = Math.min(sourcePage, pageCount);
    }
    return { ...baseState, activePage: Math.max(1, Math.min(pageCount, activePage)) };
  }

  function adjustedReorderViewState(fromIndex, toIndex, pageCount, baseState) {
    if (!baseState) return null;
    let activeIndex = Math.max(0, Math.round(Number(baseState.activePage || 1)) - 1);
    if (activeIndex === fromIndex) activeIndex = toIndex;
    else if (fromIndex < toIndex && activeIndex > fromIndex && activeIndex <= toIndex) activeIndex -= 1;
    else if (toIndex < fromIndex && activeIndex >= toIndex && activeIndex < fromIndex) activeIndex += 1;
    return { ...baseState, activePage: Math.max(1, Math.min(pageCount, activeIndex + 1)) };
  }

  function viewerOptions({ editing = false, initialViewState = null, sequence }) {
    return {
      root: elements.surface,
      scrollRoot: elements.scroll,
      pagesRoot: elements.pages,
      thumbnailsRoot: elements.thumbnails,
      zoomLabel: elements.zoomReset,
      pageCountLabel: elements.pageCount,
      thumbnailActions: editing,
      organizerMode: editing && (state.mode === 'organize' || state.mode === 'merge'),
      thumbnailWidth: editing && (state.mode === 'organize' || state.mode === 'merge') ? 210 : null,
      initialViewState,
      onThumbnailAction: editing ? handleThumbnailAction : null,
      onReady(info) {
        if (sequence !== state.sequence) return;
        root.dataset.viewerState = 'ready';
        root.dataset.pageCount = String(info.pageCount);
        state.viewState = viewer.getViewState();
        elements.status.dataset.state = 'ready';
        elements.status.textContent = `${editing ? 'Editor' : 'Visualizador'} pronto — PDF.js ${info.version} — ${info.pageCount} páginas`;
        elements.enterEditor.disabled = editing;
        if (editing) syncObjects();
      },
      onFirstPageVisible() {
        if (sequence === state.sequence) root.dataset.firstPageVisible = 'true';
      },
      onPageChange(pageNumber) {
        if (sequence === state.sequence) root.dataset.activePage = String(pageNumber);
      },
      onError() {
        if (sequence === state.sequence) fail(new Error('Falha assíncrona de renderização.'));
      }
    };
  }

  async function openViewer(source, { editing = false, initialViewState = null } = {}) {
    const sequence = ++state.sequence;
    root.dataset.viewerState = 'loading';
    const result = await viewer.open(source, viewerOptions({ editing, initialViewState, sequence }));
    if (!result || sequence !== state.sequence) throw new Error('Abertura do visualizador não retornou resultado.');
    state.viewState = viewer.getViewState();
    syncEditorState();
    return result;
  }

  async function rebuild(viewState = null, message = 'Atualizando PDF sintético…') {
    if (!state.session) return;
    const preservedViewState = viewState || viewer.getViewState() || state.viewState;
    setBusy(true, message);
    const session = state.session;
    const blob = await editor.buildBlob(session);
    if (session !== state.session) return;
    await openViewer(blob, {
      editing: true,
      initialViewState: preservedViewState
    });
    root.dataset.editorRevision = String(session.revision);
    root.dataset.pageOrder = pageOrder();
    elements.editorStatus.textContent = 'PDF sintético atualizado nesta mesma superfície.';
    setBusy(false);
  }

  function handleThumbnailAction(action, pageIndex, detail = null) {
    run(async () => {
      if (!state.session) return;
      const before = viewer.getViewState() || state.viewState;
      let changed = false;
      let targetIndex = pageIndex;
      if (action === 'delete') changed = editor.removePage(state.session, pageIndex);
      if (action === 'rotate-left') changed = editor.rotatePage(state.session, pageIndex, -1);
      if (action === 'rotate-right') changed = editor.rotatePage(state.session, pageIndex, 1);
      if (action === 'duplicate') {
        targetIndex = editor.duplicatePage(state.session, pageIndex);
        changed = Number.isInteger(targetIndex);
      }
      if (action === 'reorder') {
        targetIndex = Math.round(Number(detail?.toIndex));
        changed = editor.movePageTo(state.session, pageIndex, targetIndex);
      }
      if (!changed) return;
      const pageCount = editor.pageCount(state.session);
      const viewState = action === 'reorder'
        ? adjustedReorderViewState(pageIndex, targetIndex, pageCount, before)
        : action === 'duplicate'
          ? (before ? { ...before, activePage: targetIndex + 1 } : null)
          : adjustedViewState(action, pageIndex, pageCount, before);
      await rebuild(viewState);
    });
  }

  async function enterEditor() {
    if (state.session) return;
    setBusy(true, 'Preparando editor local sintético…');
    const viewState = viewer.getViewState();
    state.session = await editor.createSession(state.originalBlob, { label: 'PDF sintético' });
    state.viewState = viewState;
    state.mode = 'organize';
    state.selectedObjectId = '';
    syncEditorState();
    const installed = viewer.setThumbnailActions(true, handleThumbnailAction);
    if (!installed) {
      await openViewer(state.originalBlob, { editing: true, initialViewState: viewState });
    }
    root.dataset.editorRevision = '0';
    root.dataset.pageOrder = pageOrder();
    elements.editorStatus.textContent = 'Organizador pronto. Arraste páginas; use ↺/↻, duplicar ou excluir.';
    elements.status.textContent = `Editor pronto — PDF.js ${viewer.version} — ${editor.pageCount(state.session)} páginas`;
    setBusy(false);
  }

  async function syntheticImageBlob() {
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 240;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas sintético indisponível.');
    context.fillStyle = '#e9f4ff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#155b8f';
    context.fillRect(18, 18, canvas.width - 36, canvas.height - 36);
    context.fillStyle = '#ffffff';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.fillText('DADOS FICTICIOS', canvas.width / 2, canvas.height / 2);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Imagem sintética não pôde ser gerada.')), 'image/png');
    });
  }

  async function normalizeLocalImage(blob) {
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

  async function addLocalImagePages(files) {
    if (!state.session) return false;
    const images = Array.from(files || []).filter((file) => String(file?.type || '').startsWith('image/'));
    if (!images.length) {
      elements.editorStatus.textContent = 'Selecione pelo menos uma imagem.';
      return false;
    }
    const viewState = viewer.getViewState() || state.viewState;
    let firstInsertAt = editor.pageCount(state.session);
    setBusy(true, images.length === 1 ? 'Adicionando imagem…' : 'Adicionando imagens…');
    try {
      let insertAt = editor.pageCount(state.session);
      firstInsertAt = insertAt;
      for (const file of images) {
        const normalized = await normalizeLocalImage(file);
        await editor.addImagePage(state.session, normalized, { label: 'Imagem local', insertAt });
        insertAt += 1;
      }
      await rebuild(viewState ? { ...viewState, activePage: firstInsertAt + 1 } : null, 'Atualizando imagens…');
      elements.editorStatus.textContent = images.length === 1
        ? 'Imagem adicionada como nova página.'
        : String(images.length) + ' imagens adicionadas como novas páginas.';
      return true;
    } finally {
      if (elements.addImageInput) elements.addImageInput.value = '';
      setBusy(false);
    }
  }

  function localMergeKind(file) {
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
    if (!elements.mergePreview) return;
    elements.mergePreview.replaceChildren();
    elements.mergePreview.hidden = true;
  }

  async function renderMergePdfPreview(file, canvas, generation) {
    if (!(file instanceof Blob) || generation !== state.mergePreviewGeneration) return;
    let loadingTask = null;
    let documentPdf = null;
    try {
      const pdfjs = await viewer.loadPdfJs();
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (generation !== state.mergePreviewGeneration) return;
      loadingTask = pdfjs.getDocument({ data: bytes, isEvalSupported: false, enableScripting: false });
      documentPdf = await loadingTask.promise;
      if (generation !== state.mergePreviewGeneration) return;
      const page = await documentPdf.getPage(1);
      const natural = page.getViewport({ scale: 1 });
      const ratio = Math.min(54 / natural.width, 68 / natural.height);
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

  function syncMergeSelectionCopy() {
    if (!elements.mergeSelection) return;
    const count = state.mergeFiles.length;
    elements.mergeSelection.textContent = count
      ? (count === 1
        ? '1 arquivo do dispositivo selecionado. Escolha a posição e confirme em Unir.'
        : count + ' arquivos do dispositivo selecionados. Escolha a posição e confirme em Unir.')
      : 'Segundo PDF sintético de 3 páginas selecionado para o laboratório. Você também pode adicionar PDF ou imagem do dispositivo; nada é enviado ao Google Drive.';
  }

  function renderMergePreview(files = []) {
    clearMergePreview();
    if (!elements.mergePreview) return;
    const selected = Array.from(files || []).filter((file) => localMergeKind(file));
    const generation = state.mergePreviewGeneration;
    if (!selected.length) return;

    selected.forEach((file, index) => {
      const kind = localMergeKind(file);
      const card = document.createElement('div');
      card.className = 'documents-editor-merge-preview-item';

      const thumb = document.createElement('div');
      thumb.className = 'documents-editor-merge-preview-thumb';

      const copy = document.createElement('div');
      copy.className = 'documents-editor-merge-preview-copy';
      const name = document.createElement('span');
      name.className = 'documents-editor-merge-preview-name';
      name.textContent = file.name || (kind === 'image' ? 'Imagem selecionada' : 'PDF selecionado');
      const meta = document.createElement('span');
      meta.className = 'documents-editor-merge-preview-meta';
      meta.textContent = [kind === 'image' ? 'Imagem' : 'PDF', mergePreviewSizeLabel(file.size)].filter(Boolean).join(' · ');
      copy.append(name, meta);

      if (kind === 'image') {
        const image = document.createElement('img');
        image.alt = '';
        const url = URL.createObjectURL(file);
        state.mergePreviewUrls.push(url);
        image.src = url;
        thumb.appendChild(image);
      } else {
        const fallback = document.createElement('span');
        fallback.dataset.mergePreviewFallback = 'true';
        fallback.textContent = 'PDF';
        fallback.hidden = true;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        thumb.append(canvas, fallback);
        renderMergePdfPreview(file, canvas, generation).catch(() => {});
      }

      const remove = document.createElement('button');
      remove.className = 'documents-editor-merge-preview-remove';
      remove.type = 'button';
      remove.title = 'Remover arquivo selecionado';
      remove.setAttribute('aria-label', remove.title);
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        state.mergeFiles = state.mergeFiles.filter((_, itemIndex) => itemIndex !== index);
        if (elements.mergeFileInput) elements.mergeFileInput.value = '';
        syncMergeSelectionCopy();
        renderMergePreview(state.mergeFiles);
        syncEditorState();
      });

      card.append(thumb, copy, remove);
      elements.mergePreview.appendChild(card);
    });
    elements.mergePreview.hidden = false;
  }

  async function mergeLocalFiles(files) {
    if (!state.session || !state.merging) return false;
    const selected = Array.from(files || []).filter((file) => localMergeKind(file));
    if (!selected.length) {
      elements.editorStatus.textContent = 'Selecione pelo menos um PDF ou uma imagem válida.';
      return false;
    }
    const viewState = viewer.getViewState() || state.viewState;
    const count = editor.pageCount(state.session);
    const position = elements.mergePosition.value;
    if (position === 'after-page' && !elements.mergeAfterPage.reportValidity()) return false;
    let insertAt = position === 'before-document' ? 0
      : position === 'after-page' ? Math.max(1, Math.min(count, Number(elements.mergeAfterPage.value)))
        : count;
    const firstInsertAt = insertAt;
    setBusy(true, selected.length === 1 ? 'Adicionando arquivo…' : 'Adicionando arquivos…');
    try {
      for (const file of selected) {
        const kind = localMergeKind(file);
        if (kind === 'pdf') {
          const added = await editor.addDocument(state.session, file, { label: 'PDF local', insertAt });
          insertAt += Number(added || 0);
        } else {
          const normalized = await normalizeLocalImage(file);
          await editor.addImagePage(state.session, normalized, { label: 'Imagem local', insertAt });
          insertAt += 1;
        }
      }
      state.merging = false;
      state.mergeFiles = [];
      clearMergePreview();
      state.mode = 'organize';
      syncEditorState();
      await rebuild(viewState ? { ...viewState, activePage: firstInsertAt + 1 } : null, 'Atualizando documento…');
      elements.editorStatus.textContent = selected.length === 1
        ? 'Arquivo adicionado e painel de união fechado.'
        : String(selected.length) + ' arquivos adicionados e painel de união fechado.';
      return true;
    } finally {
      if (elements.mergeFileInput) elements.mergeFileInput.value = '';
      setBusy(false);
    }
  }

  async function addSyntheticImage() {
    if (!state.session) return;
    const viewState = viewer.getViewState() || state.viewState;
    const blob = await syntheticImageBlob();
    const insertAt = await editor.addImagePage(state.session, blob, { label: 'Imagem sintética' });
    await rebuild(viewState ? { ...viewState, activePage: insertAt + 1 } : null, 'Adicionando imagem sintética…');
  }

  async function mergeSyntheticPdf() {
    if (!state.session || !state.merging) return;
    const viewState = viewer.getViewState() || state.viewState;
    const count = editor.pageCount(state.session);
    const position = elements.mergePosition.value;
    if (position === 'after-page' && !elements.mergeAfterPage.reportValidity()) return;
    const insertAt = position === 'before-document' ? 0
      : position === 'after-page' ? Math.max(1, Math.min(count, Number(elements.mergeAfterPage.value)))
        : count;
    setBusy(true, 'Unindo segundo PDF sintético…');
    await editor.addDocument(state.session, fixture.blob(), {
      label: 'Segundo PDF sintético',
      insertAt
    });
    state.merging = false;
    state.mergeFiles = [];
    clearMergePreview();
    state.mode = 'organize';
    await rebuild(viewState ? { ...viewState, activePage: insertAt + 1 } : null, 'Unindo segundo PDF sintético…');
  }

  function showMergePanel() {
    if (!state.session) return;
    state.merging = true;
    state.mergeFiles = [];
    clearMergePreview();
    if (elements.mergeFileInput) elements.mergeFileInput.value = '';
    if (elements.mergeSelection) elements.mergeSelection.textContent = 'Segundo PDF sintético de 3 páginas selecionado para o laboratório. Você também pode adicionar PDF ou imagem do dispositivo; nada é enviado ao Google Drive.';
    state.mode = 'merge';
    elements.mergePosition.value = 'after-document';
    elements.mergeAfterPage.max = String(editor.pageCount(state.session));
    elements.mergeAfterPage.value = String(viewer.getViewState()?.activePage || 1);
    elements.mergePageField.hidden = true;
    syncEditorState();
    elements.editorStatus.textContent = 'Segundo PDF sintético selecionado. Escolha a posição e confirme em Unir.';
    elements.mergePosition.focus();
  }

  function cancelMerge() {
    state.merging = false;
    state.mergeFiles = [];
    clearMergePreview();
    if (elements.mergeFileInput) elements.mergeFileInput.value = '';
    state.mode = 'organize';
    syncEditorState();
    syncObjects();
    elements.editorStatus.textContent = 'Modo Organizar ativo.';
  }

  async function addBlankPage() {
    if (!state.session) return;
    const viewState = viewer.getViewState() || state.viewState;
    const insertAt = Math.max(0, Math.min(editor.pageCount(state.session), Number(viewState?.activePage || 1)));
    const pageIndex = await editor.addBlankPage(state.session, { insertAt });
    await rebuild(viewState ? { ...viewState, activePage: pageIndex + 1 } : null, 'Inserindo página em branco…');
  }

  function startCropMode() {
    setMode('crop');
    elements.editorStatus.textContent = 'Recortar: arraste sobre a página, ajuste a seleção e use Confirmar recorte ou Cancelar. Só após confirmar o preview mostra apenas a área mantida; ↺ restaura a página.';
  }

  function startWriteMode() {
    setMode('write');
    elements.editorStatus.textContent = 'Escrever: clique na página para criar uma caixa de texto. Dê duplo clique no texto para editar.';
  }

  function startSelectMode() {
    setMode('select');
    elements.editorStatus.textContent = 'Selecionar: clique no objeto para ajustar cor ou tamanho e arraste para mover; o conteúdo do texto fica protegido. Clique fora para confirmar e desmarcar.';
  }

  function startDrawMode(tool = 'draw') {
    state.drawTool = tool === 'erase' ? 'erase' : 'draw';
    setMode('draw');
    elements.editorStatus.textContent = state.drawTool === 'erase'
      ? 'Borracha: arraste somente sobre traços feitos pela ferramenta Desenhar; o PDF original e outros objetos permanecem intactos.'
      : 'Caneta: desenhe livremente. Cor e espessura são gravadas por traço e cada gesto ocupa uma única entrada do histórico.';
  }

  async function addOverlayImageFile(file) {
    if (!state.session || !(file instanceof Blob)) return false;
    const normalized = await normalizeLocalImage(file);
    const activePage = Math.max(1, Number(viewer.getViewState()?.activePage || 1));
    const id = await editor.addImageOverlay(state.session, activePage - 1, normalized, { width: .3 });
    state.selectedObjectId = id || '';
    setMode('image');
    elements.editorStatus.textContent = 'Imagem inserida sobre a página. Arraste, redimensione ou rotacione.';
    if (elements.overlayImageInput) elements.overlayImageInput.value = '';
    return true;
  }

  function updateSelectedObject(patch) {
    const object = selectedObject();
    if (!object) return;
    if (!editor.updateObject(state.session, object.id, patch)) return;
    syncEditorState();
    syncObjects();
  }

  function deleteSelectedObject() {
    const object = selectedObject();
    if (!object || !editor.removeObject(state.session, object.id)) return;
    state.selectedObjectId = '';
    syncEditorState();
    syncObjects();
  }

  async function changeHistory(direction) {
    if (!state.session) return;
    const changed = direction === 'undo' ? editor.undo(state.session) : editor.redo(state.session);
    if (!changed) return;
    state.selectedObjectId = '';
    const viewState = viewer.getViewState() || state.viewState;
    await rebuild(viewState ? {
      ...viewState,
      activePage: Math.min(viewState.activePage || 1, editor.pageCount(state.session))
    } : null, direction === 'undo' ? 'Desfazendo operação…' : 'Refazendo operação…');
  }


  async function seedFlattenFixture() {
    if (!state.session) throw new Error('Editor sintético não está ativo.');
    if (state.flattenSeeded) return true;

    editor.addTextObject(state.session, 0, {
      x: .16,
      y: .25,
      width: .46,
      height: .13,
      text: 'FLATTEN 3C6',
      fontFamily: 'Arial',
      fontSize: .038,
      fontWeight: 'bold',
      color: '#e53935',
      opacity: .9
    });
    const image = await syntheticImageBlob();
    await editor.addImageOverlay(state.session, 0, image, {
      x: .56,
      y: .54,
      width: .28,
      opacity: .78
    });
    editor.addStroke(state.session, 0, [
      { x: .18, y: .72 },
      { x: .34, y: .64 },
      { x: .52, y: .73 }
    ], { color: '#1565c0', width: .008 });
    editor.setPageCrop(state.session, 1, { x: .12, y: .14, width: .68, height: .62 });
    editor.rotatePage(state.session, 2, 1);
    state.flattenSeeded = true;
    syncEditorState();
    syncObjects();
    return true;
  }

  async function diagnosePdfBlob(blob) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const pdfjs = await viewer.loadPdfJs();
    const loadingTask = pdfjs.getDocument({
      data: bytes.slice(),
      isEvalSupported: false,
      enableScripting: false
    });
    const documentPdf = await loadingTask.promise;
    const imageOps = new Set([
      pdfjs.OPS?.paintImageXObject,
      pdfjs.OPS?.paintInlineImageXObject,
      pdfjs.OPS?.paintImageMaskXObject,
      pdfjs.OPS?.paintImageXObjectRepeat
    ].filter((value) => Number.isFinite(value)));
    const pathOps = new Set([
      pdfjs.OPS?.constructPath,
      pdfjs.OPS?.stroke,
      pdfjs.OPS?.fillStroke,
      pdfjs.OPS?.closeStroke
    ].filter((value) => Number.isFinite(value)));
    const pages = [];
    for (let pageNumber = 1; pageNumber <= documentPdf.numPages; pageNumber += 1) {
      const page = await documentPdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const textContent = await page.getTextContent();
      const operators = await page.getOperatorList();
      pages.push({
        width: Number(viewport.width.toFixed(2)),
        height: Number(viewport.height.toFixed(2)),
        rotation: Number(page.rotate || 0),
        text: textContent.items.map((item) => String(item.str || '')).join(' '),
        imageOps: operators.fnArray.filter((operation) => imageOps.has(operation)).length,
        pathOps: operators.fnArray.filter((operation) => pathOps.has(operation)).length
      });
      page.cleanup?.();
    }
    await documentPdf.destroy?.();
    return {
      header: String.fromCharCode(...bytes.slice(0, 4)),
      size: bytes.length,
      pageCount: pages.length,
      pages
    };
  }

  async function flattenDiagnostics() {
    if (!state.session) throw new Error('Editor sintético não está ativo.');
    const revisionBefore = state.session.revision;
    const structural = await editor.buildBlob(state.session);
    const flattened = await editor.buildFlattenedBlob(state.session);
    const result = {
      revisionBefore,
      structural: await diagnosePdfBlob(structural),
      flattened: await diagnosePdfBlob(flattened),
      revisionAfter: state.session.revision
    };
    root.dataset.flattenState = 'ready';
    root.dataset.flattenSize = String(result.flattened.size);
    return result;
  }

  async function exportFlattenedPdf() {
    if (!state.session || typeof editor?.buildFlattenedBlob !== 'function') return false;
    setBusy(true, 'Gerando PDF final sintético…');
    let url = '';
    try {
      const blob = await editor.buildFlattenedBlob(state.session);
      url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'synthetic-3-pages-editado.pdf';
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      root.dataset.flattenState = 'downloaded';
      root.dataset.flattenSize = String(blob.size);
      elements.editorStatus.textContent = 'PDF final sintético exportado localmente.';
      window.setTimeout(() => {
        try { URL.revokeObjectURL(url); } catch (_) {}
      }, 1500);
      url = '';
      return true;
    } finally {
      if (url) {
        try { URL.revokeObjectURL(url); } catch (_) {}
      }
      setBusy(false);
    }
  }


  async function flattenRotationDiagnostics() {
    const matrix = await editor.createSession(fixture.blob(), { label: 'Matriz 3C.6' });
    const duplicateIndex = editor.duplicatePage(matrix, 0);
    editor.rotatePage(matrix, duplicateIndex, 1);
    editor.rotatePage(matrix, duplicateIndex, 1);
    editor.rotatePage(matrix, duplicateIndex, 1);
    editor.movePageTo(matrix, duplicateIndex, 3);

    editor.rotatePage(matrix, 1, 1);
    editor.rotatePage(matrix, 2, 1);

    const labels = ['ROT0', 'ROT90', 'ROT180', 'ROT270'];
    labels.forEach((label, pageIndex) => {
      editor.addTextObject(matrix, pageIndex, {
        x: .2,
        y: .24,
        width: .44,
        height: .12,
        text: label,
        fontFamily: 'Helvetica',
        fontSize: .035,
        fontWeight: 'bold',
        color: '#111111'
      });
    });
    editor.setPageCrop(matrix, 3, { x: .08, y: .1, width: .8, height: .76 });

    const structural = await editor.buildBlob(matrix);
    const flattened = await editor.buildFlattenedBlob(matrix);
    return {
      pageModel: editor.pageModel(matrix).map((item) => ({
        sourcePage: item.sourcePage,
        rotation: item.rotation,
        crop: item.crop
      })),
      structural: await diagnosePdfBlob(structural),
      flattened: await diagnosePdfBlob(flattened)
    };
  }

  window.CentralDocsEditorHarness = Object.freeze({
    seedFlattenFixture,
    flattenDiagnostics,
    flattenRotationDiagnostics
  });

  async function exitEditor() {
    if (!state.session) return;
    const changed = state.session.revision > 0;
    const viewState = viewer.getViewState() || state.viewState;
    viewer.setEditorObjects?.([], { mode: 'none', selectedObjectId: '' });
    viewer.setEditorCrops?.([], { mode: 'none' });
    viewer.setEditorStrokes?.([], { mode: 'none' });
    state.session = null;
    state.merging = false;
    state.mode = 'readonly';
    state.selectedObjectId = '';
    syncEditorState();
    if (changed) {
      setBusy(true, 'Restaurando PDF sintético original…');
      await openViewer(state.originalBlob, { editing: false, initialViewState: viewState });
    } else {
      viewer.setThumbnailActions(false);
    }
    root.dataset.editorRevision = '0';
    root.dataset.pageOrder = '';
    elements.editorStatus.textContent = '';
    elements.status.textContent = `Visualizador pronto — PDF.js ${viewer.version} — ${fixture.pageCount} páginas`;
    setBusy(false);
  }

  window.addEventListener('error', (event) => fail(event.error || event.message));
  window.addEventListener('unhandledrejection', (event) => fail(event.reason));

  elements.zoomIn.addEventListener('click', () => run(() => viewer.zoomIn()));
  elements.zoomOut.addEventListener('click', () => run(() => viewer.zoomOut()));
  elements.zoomReset.addEventListener('click', () => run(() => viewer.resetZoom()));
  elements.fitWidth.addEventListener('click', () => run(() => viewer.fitWidth()));
  elements.enterEditor.addEventListener('click', () => run(enterEditor));
  elements.undo.addEventListener('click', () => run(() => changeHistory('undo')));
  elements.redo.addEventListener('click', () => run(() => changeHistory('redo')));
  elements.organize.addEventListener('click', () => run(() => { state.mode = 'organize'; cancelMerge(); }));
  elements.merge.addEventListener('click', () => run(showMergePanel));
  elements.mergeConfirm.addEventListener('click', () => run(() => state.mergeFiles.length ? mergeLocalFiles(state.mergeFiles) : mergeSyntheticPdf()));
  elements.mergeFileButton.addEventListener('click', () => {
    if (!state.session || !state.merging) return;
    elements.mergeFileInput.click();
  });
  elements.mergeFileInput.addEventListener('change', () => run(() => {
    const files = Array.from(elements.mergeFileInput.files || []).filter((file) => localMergeKind(file));
    state.mergeFiles = files;
    if (!files.length) {
      clearMergePreview();
      if (elements.mergeSelection) elements.mergeSelection.textContent = 'Nenhum PDF ou imagem válido selecionado.';
      elements.editorStatus.textContent = 'Selecione pelo menos um PDF ou uma imagem válida.';
      return;
    }
    syncMergeSelectionCopy();
    renderMergePreview(files);
    elements.editorStatus.textContent = 'Arquivo selecionado. Confirme em Unir.';
  }));
  elements.mergeCancel.addEventListener('click', () => run(cancelMerge));
  elements.mergePosition.addEventListener('change', () => {
    elements.mergePageField.hidden = elements.mergePosition.value !== 'after-page';
  });
  elements.blank.addEventListener('click', () => run(addBlankPage));
  elements.addImage.addEventListener('click', () => {
    if (!state.session) return;
    elements.addImageInput.click();
  });
  elements.addImageInput.addEventListener('change', () => run(() => addLocalImagePages(elements.addImageInput.files)));
  elements.crop.addEventListener('click', () => run(startCropMode));
  elements.select.addEventListener('click', () => run(startSelectMode));
  elements.write.addEventListener('click', () => run(startWriteMode));
  elements.draw.addEventListener('click', () => run(() => startDrawMode('draw')));
  elements.drawPen.addEventListener('click', () => run(() => startDrawMode('draw')));
  elements.drawEraser.addEventListener('click', () => run(() => startDrawMode('erase')));
  elements.drawColor.addEventListener('input', () => run(() => {
    state.drawColor = /^#[0-9a-f]{6}$/i.test(String(elements.drawColor.value || ''))
      ? String(elements.drawColor.value).toLowerCase()
      : '#111111';
    syncDraws();
  }));
  elements.drawWidth.addEventListener('input', () => run(() => {
    state.drawWidth = Math.max(1, Math.min(20, Number(elements.drawWidth.value || 4)));
    syncDraws();
  }));
  elements.overlayImage.addEventListener('click', () => {
    if (!state.session) return;
    if (state.mode === 'image') {
      elements.overlayImageInput?.click();
      return;
    }
    state.selectedObjectId = '';
    setMode('image');
    elements.editorStatus.textContent = 'Colar imagem ativo. Clique novamente no botão para escolher a imagem do dispositivo.';
  });
  elements.overlayImageInput?.addEventListener('change', () => {
    const file = elements.overlayImageInput.files?.[0];
    if (file) run(() => addOverlayImageFile(file));
  });
  elements.objectFont.addEventListener('change', () => run(() => updateSelectedObject({ fontFamily: elements.objectFont.value })));
  elements.objectFontSize.addEventListener('change', () => run(() => updateSelectedObject({ fontSize: Number(elements.objectFontSize.value || 18) / 560 })));
  elements.objectColor.addEventListener('input', () => run(() => updateSelectedObject({ color: elements.objectColor.value })));
  elements.objectBold.addEventListener('click', () => run(() => { const o = selectedObject(); if (o?.type === 'text') updateSelectedObject({ fontWeight: o.fontWeight === 'bold' ? 'normal' : 'bold' }); }));
  elements.objectItalic.addEventListener('click', () => run(() => { const o = selectedObject(); if (o?.type === 'text') updateSelectedObject({ fontStyle: o.fontStyle === 'italic' ? 'normal' : 'italic' }); }));
  elements.objectUnderline.addEventListener('click', () => run(() => { const o = selectedObject(); if (o?.type === 'text') updateSelectedObject({ textDecoration: o.textDecoration === 'underline' ? 'none' : 'underline' }); }));
  elements.objectAlign.addEventListener('change', () => run(() => updateSelectedObject({ textAlign: elements.objectAlign.value })));
  elements.objectOpacity.addEventListener('change', () => run(() => updateSelectedObject({ opacity: Number(elements.objectOpacity.value || 100) / 100 })));
  elements.objectDelete.addEventListener('click', () => run(deleteSelectedObject));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Delete' || !state.session || root.dataset.operationState === 'busy' || !state.selectedObjectId) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('textarea, select, [contenteditable="true"], [role="textbox"]')) return;
    const focusedInput = target?.closest('input');
    if (focusedInput) {
      const type = String(focusedInput.getAttribute('type') || 'text').toLowerCase();
      const nonEditingTypes = new Set(['file', 'hidden', 'button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color']);
      if (!nonEditingTypes.has(type)) return;
    }
    if (!selectedObject()) return;
    event.preventDefault();
    event.stopPropagation();
    run(deleteSelectedObject);
  }, true);
  elements.refresh.addEventListener('click', () => run(() => rebuild()));
  elements.exportPdf.addEventListener('click', () => run(exportFlattenedPdf));
  elements.exit.addEventListener('click', () => run(exitEditor));

  run(async () => {
    if (!viewer?.supported?.() || !editor || !fixture || !(state.originalBlob instanceof Blob)) {
      throw new Error('Componentes do laboratório não estão disponíveis.');
    }
    root.dataset.editorMode = 'readonly';
    root.dataset.operationState = 'ready';
    const source = new URLSearchParams(location.search).get('source') === 'url'
      ? '/testing/central-docs/_fixture.pdf'
      : state.originalBlob;
    root.dataset.sourceMode = typeof source === 'string' ? 'url' : 'blob';
    await openViewer(source);
  });
})();
