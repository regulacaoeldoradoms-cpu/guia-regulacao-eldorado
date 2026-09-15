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
    mergePosition: document.getElementById('editorMergePosition'),
    mergePageField: document.getElementById('editorMergePageField'),
    mergeAfterPage: document.getElementById('editorMergeAfterPage'),
    mergeConfirm: document.getElementById('editorMergeConfirm'),
    mergeCancel: document.getElementById('editorMergeCancel'),
    blank: document.getElementById('editorBlank'),
    addImage: document.getElementById('editorAddImage'),
    select: document.getElementById('editorSelect'),
    write: document.getElementById('editorWrite'),
    overlayImage: document.getElementById('editorOverlayImage'),
    objectToolbar: document.getElementById('editorObjectToolbar'),
    objectFont: document.getElementById('editorObjectFont'),
    objectFontSize: document.getElementById('editorObjectFontSize'),
    objectColor: document.getElementById('editorObjectColor'),
    objectOpacity: document.getElementById('editorObjectOpacity'),
    objectDelete: document.getElementById('editorObjectDelete'),
    refresh: document.getElementById('editorRefresh'),
    exit: document.getElementById('editorExit')
  };

  const state = {
    originalBlob: fixture?.blob?.() || null,
    session: null,
    merging: false,
    mode: 'readonly',
    selectedObjectId: '',
    viewState: null,
    sequence: 0,
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
    }
    elements.objectOpacity.value = String(Math.round((object.opacity ?? 1) * 100));
  }

  function syncObjects() {
    if (!state.session) return false;
    const mode = ['write', 'image', 'select'].includes(state.mode) ? state.mode : 'none';
    const result = viewer.setEditorObjects?.(editor.objectModel(state.session), {
      mode,
      selectedObjectId: state.selectedObjectId,
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
    syncObjectToolbar();
    root.dataset.objectCount = String(editor.objectModel(state.session).length);
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
    elements.select.classList.toggle('active', editing && state.mode === 'select');
    elements.write.classList.toggle('active', editing && state.mode === 'write');
    elements.overlayImage.classList.toggle('active', editing && state.mode === 'image');
    viewer.setOrganizerMode?.(editing && (state.mode === 'organize' || state.mode === 'merge'));
    elements.surface.setAttribute('aria-label', editing ? 'Editor visual PDF sintético' : 'Visualizador PDF sintético');
    elements.undo.disabled = !editing || !editor.canUndo(state.session);
    elements.redo.disabled = !editing || !editor.canRedo(state.session);
    elements.organize.disabled = !editing;
    elements.merge.disabled = !editing;
    elements.mergeConfirm.disabled = !editing || !state.merging;
    elements.mergeCancel.disabled = !editing;
    elements.mergePosition.disabled = !editing;
    elements.mergeAfterPage.disabled = !editing;
    elements.blank.disabled = !editing;
    elements.addImage.disabled = !editing;
    elements.select.disabled = !editing;
    elements.write.disabled = !editing;
    elements.overlayImage.disabled = !editing;
    elements.objectDelete.disabled = !editing || !selectedObject();
    elements.refresh.disabled = !editing;
    elements.exit.disabled = !editing;
  }

  function setBusy(busy, message = '') {
    const active = busy === true;
    root.dataset.operationState = active ? 'busy' : 'ready';
    elements.surface.setAttribute('aria-busy', active ? 'true' : 'false');
    if (message) elements.editorStatus.textContent = message;
    if (active) {
      for (const button of [elements.undo, elements.redo, elements.organize, elements.merge, elements.mergeConfirm, elements.mergeCancel, elements.mergePosition, elements.mergeAfterPage, elements.blank, elements.addImage, elements.select, elements.write, elements.overlayImage, elements.objectDelete, elements.refresh, elements.exit]) {
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
    state.mode = 'organize';
    await rebuild(viewState ? { ...viewState, activePage: insertAt + 1 } : null, 'Unindo segundo PDF sintético…');
  }

  function showMergePanel() {
    if (!state.session) return;
    state.merging = true;
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

  function startWriteMode() {
    setMode('write');
    elements.editorStatus.textContent = 'Escrever: clique na página para criar uma caixa de texto. Dê duplo clique no texto para editar.';
  }

  function startSelectMode() {
    setMode('select');
    elements.editorStatus.textContent = 'Selecionar: arraste objetos para mover; use os pontos para redimensionar e o ponto inferior para rotacionar.';
  }

  async function addOverlayImage() {
    if (!state.session) return;
    const blob = await syntheticImageBlob();
    const activePage = Math.max(1, Number(viewer.getViewState()?.activePage || 1));
    const id = await editor.addImageOverlay(state.session, activePage - 1, blob, { width: .3, height: .2 });
    state.selectedObjectId = id || '';
    setMode('image');
    elements.editorStatus.textContent = 'Imagem sintética inserida sobre a página. Arraste, redimensione ou rotacione.';
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

  async function exitEditor() {
    if (!state.session) return;
    const changed = state.session.revision > 0;
    const viewState = viewer.getViewState() || state.viewState;
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
  elements.mergeConfirm.addEventListener('click', () => run(mergeSyntheticPdf));
  elements.mergeCancel.addEventListener('click', () => run(cancelMerge));
  elements.mergePosition.addEventListener('change', () => {
    elements.mergePageField.hidden = elements.mergePosition.value !== 'after-page';
  });
  elements.blank.addEventListener('click', () => run(addBlankPage));
  elements.addImage.addEventListener('click', () => run(addSyntheticImage));
  elements.select.addEventListener('click', () => run(startSelectMode));
  elements.write.addEventListener('click', () => run(startWriteMode));
  elements.overlayImage.addEventListener('click', () => run(addOverlayImage));
  elements.objectFont.addEventListener('change', () => run(() => updateSelectedObject({ fontFamily: elements.objectFont.value })));
  elements.objectFontSize.addEventListener('change', () => run(() => updateSelectedObject({ fontSize: Number(elements.objectFontSize.value || 18) / 560 })));
  elements.objectColor.addEventListener('input', () => run(() => updateSelectedObject({ color: elements.objectColor.value })));
  elements.objectOpacity.addEventListener('change', () => run(() => updateSelectedObject({ opacity: Number(elements.objectOpacity.value || 100) / 100 })));
  elements.objectDelete.addEventListener('click', () => run(deleteSelectedObject));
  elements.refresh.addEventListener('click', () => run(() => rebuild()));
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
