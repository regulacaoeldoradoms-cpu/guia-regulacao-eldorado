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
    syncDrive: document.getElementById('editorSync'),
    exportPdf: document.getElementById('editorExport'),
    printPdf: document.getElementById('editorPrint'),
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
    finalPdfCacheSession: null,
    finalPdfCacheRevision: -1,
    finalPdfCacheBlob: null,
    syncState: 'normal',
    syncLastRevision: 0,
    syncTimer: null,
    syncSuccessTimer: null,
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

  function clearSyntheticSyncTimers() {
    if (state.syncTimer) window.clearTimeout(state.syncTimer);
    if (state.syncSuccessTimer) window.clearTimeout(state.syncSuccessTimer);
    state.syncTimer = null;
    state.syncSuccessTimer = null;
  }

  function setSyntheticSyncState(next = 'normal') {
    const allowed = new Set(['normal', 'pending', 'syncing', 'success', 'failed']);
    const value = allowed.has(next) ? next : 'normal';
    state.syncState = value;
    root.dataset.syncState = value;
    elements.syncDrive.dataset.syncState = value;
    const labels = {
      normal: 'Forçar sincronização com Google Drive',
      pending: 'Alterações pendentes — aguardando sincronização automática',
      syncing: 'Sincronizando com Google Drive',
      success: 'Sincronizado com Google Drive',
      failed: 'Falha na sincronização — clique para tentar novamente'
    };
    elements.syncDrive.title = labels[value];
    elements.syncDrive.setAttribute('aria-label', labels[value]);
    return value;
  }

  function scheduleSyntheticSync({ forced = false } = {}) {
    if (!state.session) return false;
    clearSyntheticSyncTimers();

    const begin = () => {
      state.syncTimer = null;
      setSyntheticSyncState('syncing');
      elements.editorStatus.textContent = 'Simulação visual: sincronizando dados fictícios. Nenhuma chamada ao Google Drive é feita neste laboratório.';
      // O laboratório mantém o estado azul tempo suficiente para ser percebido por uma pessoa
      // e observado de forma determinística pelos testes. Isso não altera o tempo do autosync real.
      state.syncTimer = window.setTimeout(() => {
        state.syncTimer = null;
        setSyntheticSyncState('success');
        elements.editorStatus.textContent = 'Simulação visual: sincronização confirmada. O ícone verde fica visível por 1 segundo.';
        state.syncSuccessTimer = window.setTimeout(() => {
          state.syncSuccessTimer = null;
          if (!state.session) return;
          setSyntheticSyncState('normal');
          elements.editorStatus.textContent = 'Organizador pronto. Novas alterações reiniciam a simulação automática.';
        }, 1000);
      }, 900);
    };

    if (forced) {
      begin();
    } else {
      setSyntheticSyncState('pending');
      elements.editorStatus.textContent = 'Alteração detectada. Simulação visual aguardando a sincronização automática…';
      state.syncTimer = window.setTimeout(begin, 1000);
    }
    return true;
  }

  function observeSyntheticSyncRevision() {
    if (!state.session) return;
    const revision = Number(state.session.revision || 0);
    if (revision === state.syncLastRevision) return;
    state.syncLastRevision = revision;
    scheduleSyntheticSync();
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
        run(async () => {
          if (!state.session || state.mode !== 'draw') return;
          if (state.drawTool === 'erase') return;
          editor.addStroke(state.session, pageIndex, stroke);
          await syncEditorState({ preserveView: true });
        });
      },
      onEraseGesture(pageIndex, gesture) {
        run(async () => {
          if (!state.session || state.mode !== 'draw' || state.drawTool !== 'erase') return;
          editor.eraseStrokes(state.session, pageIndex, gesture);
          await syncEditorState({ preserveView: true });
        });
      }
    });
    return result;
  }

  function syncModeButtons() {
    for (const [mode, control] of [
      ['organize', elements.organize],
      ['crop', elements.crop],
      ['select', elements.select],
      ['write', elements.write],
      ['overlay-image', elements.overlayImage],
      ['draw', elements.draw]
    ]) {
      const active = state.mode === mode;
      control.classList.toggle('active', active);
      control.setAttribute('aria-pressed', String(active));
    }
    const organizing = state.mode === 'organize';
    elements.surface.dataset.organizerMode = String(organizing);
    elements.surface.dataset.editorWorkspaceMode = state.mode;
    elements.organize.title = organizing ? 'Organizar páginas — grade ativa' : 'Organizar páginas — ativar grade';
    elements.drawToolbar.hidden = state.mode !== 'draw';
    elements.drawPen.classList.toggle('active', state.drawTool === 'draw');
    elements.drawPen.setAttribute('aria-pressed', String(state.drawTool === 'draw'));
    elements.drawEraser.classList.toggle('active', state.drawTool === 'erase');
    elements.drawEraser.setAttribute('aria-pressed', String(state.drawTool === 'erase'));
  }

  function syncEditorControls() {
    const editing = Boolean(state.session);
    const blocked = state.merging;
    elements.undo.disabled = !editing || !state.session.canUndo || blocked;
    elements.redo.disabled = !editing || !state.session.canRedo || blocked;
    elements.organize.disabled = !editing || blocked;
    elements.merge.disabled = !editing || blocked;
    elements.blank.disabled = !editing || blocked;
    elements.addImage.disabled = !editing || blocked;
    elements.crop.disabled = !editing || blocked;
    elements.select.disabled = !editing || blocked;
    elements.write.disabled = !editing || blocked;
    elements.overlayImage.disabled = !editing || blocked;
    elements.draw.disabled = !editing || blocked;
    elements.objectDelete.disabled = !editing || !selectedObject();
    elements.syncDrive.disabled = !editing;
    elements.exportPdf.disabled = !editing || typeof editor?.buildFlattenedBlob !== 'function';
    elements.printPdf.disabled = !editing || typeof editor?.buildFlattenedBlob !== 'function';
    elements.exit.disabled = !editing || blocked;
    elements.editorControls.hidden = !editing;
    elements.enterEditor.hidden = editing;
    if (editing) elements.surface.classList.add('is-editing');
    else elements.surface.classList.remove('is-editing');
    syncModeButtons();
    syncObjectToolbar();
  }

  function preserveViewState() {
    if (!viewer?.getState) return null;
    try { return viewer.getState(); }
    catch (_) { return null; }
  }

  async function restoreViewState(snapshot) {
    if (!snapshot || !viewer?.setState) return;
    try { await viewer.setState(snapshot); }
    catch (_) {}
  }

  async function syncEditorState(options = {}) {
    if (!state.session) return;
    const snapshot = options.preserveView === false ? null : (options.viewState || preserveViewState());
    const model = editor.pageModel(state.session);
    root.dataset.pageOrder = pageOrder();
    root.dataset.pageKinds = model.map((page) => page.kind).join(',');
    root.dataset.editorRevision = String(state.session.revision || 0);
    await viewer.setEditorModel(model);
    if (editor?.objectModel && viewer?.setEditorObjects) {
      viewer.setEditorObjects(editor.objectModel(state.session), {
        mode: ['select', 'write', 'overlay-image'].includes(state.mode) ? state.mode : 'none',
        selectedId: state.selectedObjectId,
        onSelect(id) {
          state.selectedObjectId = id || '';
          syncObjectToolbar();
          syncEditorControls();
        },
        onCreateText(pageIndex, point) {
          run(async () => {
            if (!state.session || state.mode !== 'write') return;
            const existing = editor.objectModel(state.session).find((item) => item.type === 'text' && item.editing === true);
            if (existing) return;
            const object = editor.addTextObject(state.session, pageIndex, point, {
              fontFamily: elements.objectFont.value || 'Arial',
              fontSize: Number(elements.objectFontSize.value || 18) / 560,
              color: elements.objectColor.value || '#111111',
              opacity: Number(elements.objectOpacity.value || 100) / 100,
              text: ''
            });
            state.selectedObjectId = object.id;
            await syncEditorState({ preserveView: true });
          });
        },
        onChange(id, patch) {
          run(async () => {
            if (!state.session) return;
            editor.updateObject(state.session, id, patch);
            await syncEditorState({ preserveView: true });
          });
        },
        onConfirm(id) {
          run(async () => {
            if (!state.session) return;
            editor.confirmObject(state.session, id);
            await syncEditorState({ preserveView: true });
          });
        },
        onDelete(id) {
          run(async () => {
            if (!state.session) return;
            editor.deleteObject(state.session, id);
            if (state.selectedObjectId === id) state.selectedObjectId = '';
            await syncEditorState({ preserveView: true });
          });
        }
      });
    }
    syncDraws();
    await restoreViewState(snapshot);
    syncEditorControls();
    observeSyntheticSyncRevision();
  }

  async function buildFinalPdfBlob() {
    if (!state.session || typeof editor?.buildFlattenedBlob !== 'function') throw new Error('Nenhuma sessão de edição ativa.');
    const revision = Number(state.session.revision || 0);
    if (state.finalPdfCacheBlob && state.finalPdfCacheSession === state.session && state.finalPdfCacheRevision === revision) {
      return state.finalPdfCacheBlob;
    }
    const blob = await editor.buildFlattenedBlob(state.session);
    state.finalPdfCacheSession = state.session;
    state.finalPdfCacheRevision = revision;
    state.finalPdfCacheBlob = blob;
    return blob;
  }

  async function exportFlattenedPdf() {
    const blob = await buildFinalPdfBlob();
    const url = URL.createObjectURL(blob);
    try {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'central-docs-editor-lab.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } finally {
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
  }

  async function printFlattenedPdf() {
    const blob = await buildFinalPdfBlob();
    const preparation = document.getElementById('editorPrintPreparing');
    if (preparation) preparation.hidden = false;
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 180));
      root.dataset.printBytes = String(blob.size);
      elements.editorStatus.textContent = 'PDF final preparado localmente para impressão no laboratório.';
      window.dispatchEvent(new CustomEvent('central-docs-lab-print', { detail: { bytes: blob.size } }));
    } finally {
      if (preparation) preparation.hidden = true;
    }
  }

  function currentPageIndex() {
    const activePage = Number(root.dataset.activePage || 1);
    return Math.max(0, activePage - 1);
  }

  function showMergePanel() {
    if (!state.session) return;
    state.merging = false;
    elements.mergePanel.hidden = false;
    elements.mergePageField.hidden = elements.mergePosition.value !== 'after-page';
    syncMergeSelection();
    syncEditorControls();
  }

  function hideMergePanel() {
    elements.mergePanel.hidden = true;
    elements.mergePageField.hidden = true;
    clearMergeFiles();
    state.merging = false;
    syncEditorControls();
  }

  function revokeMergePreviewUrls() {
    for (const url of state.mergePreviewUrls) URL.revokeObjectURL(url);
    state.mergePreviewUrls = [];
  }

  function clearMergeFiles() {
    revokeMergePreviewUrls();
    state.mergeFiles = [];
    state.mergePreviewGeneration += 1;
    if (elements.mergeFileInput) elements.mergeFileInput.value = '';
    syncMergeSelection();
  }

  function syncMergeSelection() {
    if (!elements.mergeSelection || !elements.mergeConfirm) return;
    const localCount = state.mergeFiles.length;
    elements.mergeSelection.textContent = localCount
      ? `${localCount} arquivo(s) do dispositivo selecionado(s). Eles serão inseridos com o documento sintético de 3 páginas para testar a união.`
      : 'Segundo PDF sintético de 3 páginas selecionado para testar a união.';
    elements.mergeConfirm.disabled = Boolean(state.merging);
  }

  async function renderMergePreview() {
    if (!elements.mergePreview) return;
    const generation = state.mergePreviewGeneration;
    revokeMergePreviewUrls();
    elements.mergePreview.innerHTML = '';
    if (!state.mergeFiles.length) return;
    const fragment = document.createDocumentFragment();
    for (const file of state.mergeFiles) {
      if (generation !== state.mergePreviewGeneration) return;
      const item = document.createElement('div');
      item.className = 'documents-editor-merge-preview-item';
      const thumb = document.createElement('div');
      thumb.className = 'documents-editor-merge-preview-thumb';
      const label = document.createElement('span');
      label.textContent = file.type === 'application/pdf' ? 'PDF' : 'Imagem';
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        const url = URL.createObjectURL(file);
        state.mergePreviewUrls.push(url);
        img.src = url;
        img.alt = '';
        thumb.appendChild(img);
      } else {
        thumb.appendChild(label);
      }
      const text = document.createElement('strong');
      text.textContent = file.name || 'Arquivo local';
      item.append(thumb, text);
      fragment.appendChild(item);
    }
    elements.mergePreview.appendChild(fragment);
  }

  async function addMergeFiles(files) {
    const selected = [...(files || [])].filter((file) => file && (file.type === 'application/pdf' || file.type.startsWith('image/')));
    if (!selected.length) throw new Error('Selecione pelo menos um PDF ou imagem válido.');
    clearMergeFiles();
    state.mergeFiles = selected;
    state.mergePreviewGeneration += 1;
    syncMergeSelection();
    await renderMergePreview();
  }

  async function addBlankPage() {
    if (!state.session) return;
    const index = currentPageIndex();
    editor.insertBlankPage(state.session, index + 1);
    await syncEditorState({ preserveView: true });
  }

  async function addImagePage(file) {
    if (!state.session || !file) return;
    const index = currentPageIndex();
    editor.insertImagePage(state.session, index + 1, file);
    await syncEditorState({ preserveView: true });
  }

  async function mergeSelectedPdf() {
    if (!state.session || state.merging) return;
    state.merging = true;
    syncEditorControls();
    try {
      const position = elements.mergePosition.value;
      const page = position === 'after-page' ? Math.max(1, Number(elements.mergeAfterPage.value || 1)) : 1;
      const insertIndex = position === 'before-document' ? 0
        : position === 'after-page' ? Math.min(state.session.pages.length, page)
          : state.session.pages.length;
      const sources = [];
      for (const file of state.mergeFiles) {
        if (file.type === 'application/pdf') sources.push(file);
        else if (file.type.startsWith('image/')) sources.push(await editor.imageToPdfBlob(file));
      }
      sources.push(fixture.blob());
      for (let offset = 0; offset < sources.length; offset += 1) {
        await editor.mergeBlob(state.session, sources[offset], insertIndex + offset);
      }
      hideMergePanel();
      await syncEditorState({ preserveView: true });
    } finally {
      state.merging = false;
      syncEditorControls();
    }
  }

  async function enterEditor() {
    if (state.session) return;
    const source = state.originalBlob || fixture.blob();
    state.session = await editor.open(source);
    state.mode = 'organize';
    state.selectedObjectId = '';
    state.syncLastRevision = Number(state.session.revision || 0);
    clearSyntheticSyncTimers();
    setSyntheticSyncState('normal');
    root.dataset.editorMode = 'editor';
    root.dataset.operationState = 'ready';
    elements.editorStatus.textContent = 'Organizador pronto. Arraste miniaturas para reordenar.';
    await syncEditorState({ preserveView: true });
  }

  async function exitEditor() {
    if (!state.session) return;
    clearSyntheticSyncTimers();
    setSyntheticSyncState('normal');
    const source = state.originalBlob || fixture.blob();
    editor.close(state.session);
    state.session = null;
    state.mode = 'readonly';
    state.selectedObjectId = '';
    state.syncLastRevision = 0;
    state.finalPdfCacheBlob = null;
    state.finalPdfCacheSession = null;
    state.finalPdfCacheRevision = -1;
    root.dataset.editorMode = 'readonly';
    root.dataset.operationState = 'ready';
    elements.editorStatus.textContent = 'Editor fechado. O mesmo PDF.js continua ativo.';
    await viewer.open(source, {
      surface: elements.surface,
      pages: elements.pages,
      thumbnails: elements.thumbnails,
      scroll: elements.scroll,
      zoomOut: elements.zoomOut,
      zoomReset: elements.zoomReset,
      zoomIn: elements.zoomIn,
      fitWidth: elements.fitWidth,
      pageCount: elements.pageCount,
      status: elements.status
    });
    syncEditorControls();
  }

  function forceSyntheticSync() {
    if (!state.session) return false;
    root.dataset.syncPreview = 'force-visible';
    scheduleSyntheticSync({ forced: true });
    return true;
  }

  function setSyncStateForTest(value) {
    clearSyntheticSyncTimers();
    return setSyntheticSyncState(value);
  }

  elements.enterEditor.addEventListener('click', () => run(enterEditor));
  elements.exit.addEventListener('click', () => run(exitEditor));
  elements.undo.addEventListener('click', () => run(async () => {
    if (!state.session) return;
    editor.undo(state.session);
    await syncEditorState({ preserveView: true });
  }));
  elements.redo.addEventListener('click', () => run(async () => {
    if (!state.session) return;
    editor.redo(state.session);
    await syncEditorState({ preserveView: true });
  }));
  elements.organize.addEventListener('click', () => {
    state.mode = 'organize';
    syncEditorControls();
  });
  elements.merge.addEventListener('click', showMergePanel);
  elements.mergeCancel.addEventListener('click', hideMergePanel);
  elements.mergePosition.addEventListener('change', () => {
    elements.mergePageField.hidden = elements.mergePosition.value !== 'after-page';
  });
  elements.mergeConfirm.addEventListener('click', () => run(mergeSelectedPdf));
  elements.mergeFileButton.addEventListener('click', () => elements.mergeFileInput.click());
  elements.mergeFileInput.addEventListener('change', () => run(() => addMergeFiles(elements.mergeFileInput.files)));
  elements.blank.addEventListener('click', () => run(addBlankPage));
  elements.addImage.addEventListener('click', () => elements.addImageInput.click());
  elements.addImageInput.addEventListener('change', () => run(() => addImagePage(elements.addImageInput.files?.[0])));
  elements.crop.addEventListener('click', () => {
    state.mode = 'crop';
    syncEditorControls();
  });
  elements.select.addEventListener('click', () => {
    state.mode = 'select';
    syncEditorControls();
  });
  elements.write.addEventListener('click', () => {
    state.mode = 'write';
    syncEditorControls();
  });
  elements.overlayImage.addEventListener('click', () => elements.overlayImageInput.click());
  elements.overlayImageInput.addEventListener('change', () => run(async () => {
    const file = elements.overlayImageInput.files?.[0];
    if (!file || !state.session) return;
    const object = await editor.addImageObject(state.session, currentPageIndex(), file);
    state.selectedObjectId = object.id;
    state.mode = 'select';
    await syncEditorState({ preserveView: true });
    elements.overlayImageInput.value = '';
  }));
  elements.draw.addEventListener('click', () => {
    state.mode = 'draw';
    state.drawTool = 'draw';
    syncEditorControls();
    syncDraws();
  });
  elements.drawPen.addEventListener('click', () => {
    state.drawTool = 'draw';
    syncEditorControls();
    syncDraws();
  });
  elements.drawEraser.addEventListener('click', () => {
    state.drawTool = 'erase';
    syncEditorControls();
    syncDraws();
  });
  elements.drawColor.addEventListener('change', () => {
    state.drawColor = elements.drawColor.value || '#111111';
    syncDraws();
  });
  elements.drawWidth.addEventListener('input', () => {
    state.drawWidth = Number(elements.drawWidth.value || 4);
    syncDraws();
  });
  elements.objectFont.addEventListener('change', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.updateObject(state.session, object.id, { fontFamily: elements.objectFont.value });
    await syncEditorState({ preserveView: true });
  }));
  elements.objectFontSize.addEventListener('change', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.updateObject(state.session, object.id, { fontSize: Number(elements.objectFontSize.value || 18) / 560 });
    await syncEditorState({ preserveView: true });
  }));
  elements.objectColor.addEventListener('change', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.updateObject(state.session, object.id, { color: elements.objectColor.value || '#111111' });
    await syncEditorState({ preserveView: true });
  }));
  elements.objectBold.addEventListener('click', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.updateObject(state.session, object.id, { fontWeight: object.fontWeight === 'bold' ? 'normal' : 'bold' });
    await syncEditorState({ preserveView: true });
  }));
  elements.objectItalic.addEventListener('click', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.updateObject(state.session, object.id, { fontStyle: object.fontStyle === 'italic' ? 'normal' : 'italic' });
    await syncEditorState({ preserveView: true });
  }));
  elements.objectUnderline.addEventListener('click', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.updateObject(state.session, object.id, { textDecoration: object.textDecoration === 'underline' ? 'none' : 'underline' });
    await syncEditorState({ preserveView: true });
  }));
  elements.objectAlign.addEventListener('change', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.updateObject(state.session, object.id, { textAlign: elements.objectAlign.value || 'left' });
    await syncEditorState({ preserveView: true });
  }));
  elements.objectOpacity.addEventListener('input', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.updateObject(state.session, object.id, { opacity: Number(elements.objectOpacity.value || 100) / 100 });
    await syncEditorState({ preserveView: true });
  }));
  elements.objectDelete.addEventListener('click', () => run(async () => {
    const object = selectedObject();
    if (!object) return;
    editor.deleteObject(state.session, object.id);
    state.selectedObjectId = '';
    await syncEditorState({ preserveView: true });
  }));
  elements.syncDrive.addEventListener('click', () => run(forceSyntheticSync));
  elements.exportPdf.addEventListener('click', () => run(exportFlattenedPdf));
  elements.printPdf.addEventListener('click', () => run(printFlattenedPdf));

  window.addEventListener('keydown', (event) => {
    if (!state.session || event.defaultPrevented) return;
    const target = event.target;
    if (target?.matches?.('input, textarea, select, [contenteditable="true"]')) return;
    const key = String(event.key || '').toLowerCase();
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && key === 'z') {
      event.preventDefault();
      run(async () => {
        if (event.shiftKey) editor.redo(state.session);
        else editor.undo(state.session);
        await syncEditorState({ preserveView: true });
      });
      return;
    }
    if (modifier && key === 'y') {
      event.preventDefault();
      run(async () => {
        editor.redo(state.session);
        await syncEditorState({ preserveView: true });
      });
      return;
    }
  });

  if (elements.surface) {
    elements.surface.addEventListener('click', (event) => {
      if (!state.session || !state.selectedObjectId) return;
      if (event.target?.closest?.('.portal-pdf-object, .documents-object-toolbar')) return;
      state.selectedObjectId = '';
      if (editor?.selectObject) editor.selectObject(state.session, '');
      syncEditorState({ preserveView: true });
    });
  }

  window.CentralDocsEditorHarness = Object.freeze({
    enterEditor: () => run(enterEditor),
    exitEditor: () => run(exitEditor),
    refreshForTest: () => run(async () => {
      if (!state.session) return;
      await syncEditorState({ preserveView: true });
    }),
    forceSyncForTest: () => run(forceSyntheticSync),
    setSyncStateForTest,
    state: () => ({
      mode: state.mode,
      syncState: state.syncState,
      revision: Number(state.session?.revision || 0),
      order: pageOrder(),
      selectedObjectId: state.selectedObjectId,
      merging: state.merging
    })
  });

  async function boot() {
    if (!viewer || !editor || !fixture) throw new Error('Dependências do laboratório indisponíveis.');
    root.dataset.editorMode = 'readonly';
    root.dataset.operationState = 'loading';
    elements.status.dataset.state = 'loading';
    elements.status.textContent = 'Abrindo PDF sintético...';
    await viewer.open(state.originalBlob, {
      surface: elements.surface,
      pages: elements.pages,
      thumbnails: elements.thumbnails,
      scroll: elements.scroll,
      zoomOut: elements.zoomOut,
      zoomReset: elements.zoomReset,
      zoomIn: elements.zoomIn,
      fitWidth: elements.fitWidth,
      pageCount: elements.pageCount,
      status: elements.status
    });
    root.dataset.operationState = 'ready';
    elements.status.dataset.state = 'ready';
    elements.status.textContent = 'Laboratório pronto.';
    syncEditorControls();
  }

  run(boot);
})();
