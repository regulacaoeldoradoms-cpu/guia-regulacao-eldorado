'use strict';

(() => {
  if (window.PortalPdfViewer) return;

  const PDFJS_MODULE_URL = '/vendor/pdfjs-legacy/pdf.min.mjs';
  const PDFJS_WORKER_URL = '/vendor/pdfjs-legacy/pdf.worker.min.mjs';
  const CMAP_URL = '/vendor/pdfjs/cmaps/';
  const STANDARD_FONT_URL = '/vendor/pdfjs/standard_fonts/';
  const WASM_URL = '/vendor/pdfjs/wasm/';
  const ICC_URL = '/vendor/pdfjs/iccs/';
  const PDFJS_VERSION = '6.3.289';
  const MIN_SCALE = 0.45;
  const MAX_SCALE = 3;
  const ZOOM_STEP = 0.15;
  const THUMB_WIDTH = 104;
  const ORGANIZER_THUMB_WIDTH = 210;
  const MAX_CANVAS_PIXELS = 18_000_000;
  const MAX_DEVICE_SCALE = 2;

  let modulePromise = null;
  let active = null;
  let openGeneration = 0;
  let currentInvocation = null;
  const OPEN_CANCELLED = Symbol('portal-pdf-open-cancelled');

  function cancelInvocation(invocation) {
    if (!invocation || invocation.cancelled) return;
    invocation.cancelled = true;
    invocation.resolveCancellation();
  }

  function beginOpenInvocation() {
    cancelInvocation(currentInvocation);
    let resolveCancellation;
    const invocation = {
      generation: ++openGeneration,
      cancelled: false,
      cancellation: new Promise((resolve) => { resolveCancellation = resolve; }),
      resolveCancellation
    };
    currentInvocation = invocation;
    return invocation;
  }

  function isCurrentInvocation(invocation) {
    return Boolean(
      invocation
      && !invocation.cancelled
      && currentInvocation === invocation
      && invocation.generation === openGeneration
    );
  }

  function waitForInvocation(invocation, promise) {
    return Promise.race([
      Promise.resolve(promise),
      invocation.cancellation.then(() => OPEN_CANCELLED)
    ]);
  }

  function isCurrentSession(session) {
    return Boolean(
      session
      && !session.closed
      && active === session
      && session.openGeneration === openGeneration
      && isCurrentInvocation(session.invocation)
    );
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  async function loadPdfJs() {
    if (modulePromise) return modulePromise;
    modulePromise = import(PDFJS_MODULE_URL).then((pdfjs) => {
      if (!pdfjs?.getDocument || !pdfjs?.GlobalWorkerOptions) {
        throw new Error('Motor de visualização PDF indisponível.');
      }
      pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      return pdfjs;
    }).catch((error) => {
      modulePromise = null;
      throw error;
    });
    return modulePromise;
  }

  function safeCanvasScale(viewport) {
    const deviceScale = clamp(Number(window.devicePixelRatio || 1), 1, MAX_DEVICE_SCALE);
    const cssPixels = Math.max(1, viewport.width * viewport.height);
    const memoryScale = Math.sqrt(MAX_CANVAS_PIXELS / cssPixels);
    return clamp(Math.min(deviceScale, memoryScale), 1, MAX_DEVICE_SCALE);
  }

  function sourceParameters(source) {
    if (source instanceof Blob) {
      return source.arrayBuffer().then((buffer) => ({ data: new Uint8Array(buffer) }));
    }
    if (source instanceof Uint8Array) return Promise.resolve({ data: source });
    if (source instanceof ArrayBuffer) return Promise.resolve({ data: new Uint8Array(source) });
    if (typeof source === 'string' && source) return Promise.resolve({ url: source });
    if (source && typeof source.url === 'string' && source.url) {
      return Promise.resolve({ url: source.url });
    }
    throw new Error('Fonte PDF inválida.');
  }

  function clearNode(node) {
    if (node) node.replaceChildren();
  }

  function cancelRender(record) {
    try { record?.renderTask?.cancel?.(); } catch (_) {}
  }

  function safelyDestroy(resource) {
    try {
      const result = resource?.destroy?.();
      if (result && typeof result.catch === 'function') result.catch(() => {});
    } catch (_) {}
  }

  async function settleRenderTask(record, { cancel = false } = {}) {
    const task = record?.renderTask || null;
    if (!task) return;
    if (cancel) {
      try { task.cancel?.(); } catch (_) {}
    }
    try {
      await task.promise;
    } catch (error) {
      if (error?.name !== 'RenderingCancelledException') throw error;
    } finally {
      if (record?.renderTask === task) record.renderTask = null;
    }
  }

  function clearRenderedPage(record) {
    if (!record?.canvas) return;
    cancelRender(record);
    record.canvas.width = 0;
    record.canvas.height = 0;
    record.canvas.removeAttribute('style');
    record.renderedScale = 0;
    record.renderGeneration = 0;
    record.container?.classList.remove('rendered');
  }

  function destroySession(session, { clearSurface = false } = {}) {
    if (!session) return;
    session.closed = true;
    session.pageObserver?.disconnect?.();
    session.thumbObserver?.disconnect?.();
    session.activeObserver?.disconnect?.();
    session.firstPageWindowObserver?.disconnect?.();
    session.resizeObserver?.disconnect?.();
    if (session.resizeTimer) clearTimeout(session.resizeTimer);
    session.resizeTimer = null;
    clearThumbnailDragState(session);
    clearEditorObjectUi(session);
    for (const record of session.pages.values()) clearRenderedPage(record);
    for (const record of session.thumbs.values()) {
      cancelRender(record);
      if (record.canvas) {
        record.canvas.width = 0;
        record.canvas.height = 0;
        record.canvas.removeAttribute('style');
      }
    }
    if (session.thumbClick) {
      try { session.thumbnailsRoot?.removeEventListener('click', session.thumbClick); } catch (_) {}
      session.thumbClick = null;
    }
    if (session.thumbnailDragHandlers) {
      for (const [type, handler] of Object.entries(session.thumbnailDragHandlers)) {
        try { session.thumbnailsRoot?.removeEventListener(type, handler); } catch (_) {}
      }
      session.thumbnailDragHandlers = null;
    }
    const loadingTask = session.loadingTask;
    const document = session.document;
    session.loadingTask = null;
    session.document = null;
    safelyDestroy(loadingTask);
    safelyDestroy(document);
    if (clearSurface) {
      clearNode(session.pagesRoot);
      clearNode(session.thumbnailsRoot);
    }
  }

  function closeActiveSession() {
    const session = active;
    if (!session) return;
    active = null;
    destroySession(session, { clearSurface: true });
  }

  function abandonSession(session) {
    const ownsSurface = active === session;
    if (ownsSurface) active = null;
    destroySession(session, { clearSurface: ownsSurface });
  }

  function close() {
    const invocation = currentInvocation;
    currentInvocation = null;
    openGeneration += 1;
    cancelInvocation(invocation);
    closeActiveSession();
  }

  function thumbnailActionSpecs(session, pageNumber) {
    return [
      { action: 'rotate-left', label: '↺', aria: `Girar página ${pageNumber} 90 graus para a esquerda`, disabled: false },
      { action: 'rotate-right', label: '↻', aria: `Girar página ${pageNumber} 90 graus para a direita`, disabled: false },
      { action: 'duplicate', label: '⧉', aria: `Duplicar página ${pageNumber}`, disabled: false },
      { action: 'delete', label: '×', aria: `Excluir página ${pageNumber}`, disabled: session.document.numPages <= 1 }
    ];
  }

  function syncThumbnailActionControls(session, record) {
    if (!record?.wrapper) return;
    let actions = record.wrapper.querySelector('.portal-pdf-thumb-actions');
    // Reordenação usa Pointer Events para evitar conflito entre drag nativo e pointer capture.
    record.button.draggable = false;
    record.button.classList.toggle('can-drag', session.thumbnailActions === true);
    record.button.title = session.thumbnailActions
      ? `Página ${record.pageNumber}. Clique para abrir ou arraste para reorganizar.`
      : `Ir para página ${record.pageNumber}`;

    if (!session.thumbnailActions) {
      actions?.remove();
      return;
    }

    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'portal-pdf-thumb-actions';
      record.wrapper.appendChild(actions);
    }

    actions.replaceChildren();
    const dragHandle = document.createElement('span');
    dragHandle.className = 'portal-pdf-thumb-drag';
    dragHandle.dataset.thumbnailDrag = 'true';
    dragHandle.setAttribute('aria-hidden', 'true');
    dragHandle.title = `Arraste a página ${record.pageNumber} para reorganizar`;
    dragHandle.textContent = '⠿';
    actions.appendChild(dragHandle);

    for (const spec of thumbnailActionSpecs(session, record.pageNumber)) {
      const actionButton = document.createElement('button');
      actionButton.type = 'button';
      actionButton.className = `portal-pdf-thumb-action${spec.action === 'delete' ? ' danger' : ''}`;
      actionButton.dataset.thumbnailAction = spec.action;
      actionButton.setAttribute('aria-label', spec.aria);
      actionButton.title = spec.aria;
      actionButton.textContent = spec.label;
      actionButton.disabled = spec.disabled;
      actions.appendChild(actionButton);
    }
  }

  function syncThumbnailActions(session) {
    if (!isCurrentSession(session)) return;
    for (const record of session.thumbs.values()) syncThumbnailActionControls(session, record);
    session.root.dataset.editorMode = session.thumbnailActions ? 'true' : 'false';
  }

  function clearThumbnailDragState(session) {
    const drag = session.touchDrag;
    if (drag?.holdTimer) clearTimeout(drag.holdTimer);
    if (session.dragFrame) cancelAnimationFrame(session.dragFrame);
    session.dragFrame = null;
    session.dragSourceIndex = null;
    session.dragTargetIndex = null;
    session.touchDrag = null;
    session.dragGhost?.remove?.();
    session.dragGhost = null;
    session.dragGhostOffsetX = 0;
    session.dragGhostOffsetY = 0;
    try { drag?.origin?.releasePointerCapture?.(drag.pointerId); } catch (_) {}
    for (const record of session.thumbs.values()) {
      record.wrapper?.classList.remove('dragging', 'drag-before', 'drag-after');
    }
  }

  function ensureDragGhost(session, wrapper, event) {
    if (!wrapper || session.dragGhost) return session.dragGhost;
    const rect = wrapper.getBoundingClientRect();
    const ghost = wrapper.cloneNode(true);
    ghost.className = 'portal-pdf-drag-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.style.width = `${Math.max(120, rect.width)}px`;
    ghost.style.height = `${Math.max(120, rect.height)}px`;
    ghost.querySelectorAll('button').forEach((button) => { button.tabIndex = -1; });

    const sourceCanvas = wrapper.querySelector('.portal-pdf-thumb-canvas');
    const ghostCanvas = ghost.querySelector('.portal-pdf-thumb-canvas');
    if (sourceCanvas && ghostCanvas && sourceCanvas.width > 0 && sourceCanvas.height > 0) {
      ghostCanvas.width = sourceCanvas.width;
      ghostCanvas.height = sourceCanvas.height;
      ghostCanvas.style.width = sourceCanvas.style.width || `${sourceCanvas.clientWidth}px`;
      ghostCanvas.style.height = sourceCanvas.style.height || `${sourceCanvas.clientHeight}px`;
      try {
        ghostCanvas.getContext('2d')?.drawImage(sourceCanvas, 0, 0);
      } catch (_) {}
    }

    document.body.appendChild(ghost);
    session.dragGhost = ghost;
    // O usuário arrasta a própria página: o ponteiro/dedo deve permanecer no centro
    // do cartão flutuante, em vez de ficar deslocado no canto superior esquerdo.
    session.dragGhostOffsetX = Math.max(60, rect.width / 2);
    session.dragGhostOffsetY = Math.max(60, rect.height / 2);
    moveDragGhost(session, event);
    return ghost;
  }

  function moveDragGhost(session, event) {
    if (!session.dragGhost) return;
    const offsetX = Number(session.dragGhostOffsetX || session.dragGhost.offsetWidth / 2 || 0);
    const offsetY = Number(session.dragGhostOffsetY || session.dragGhost.offsetHeight / 2 || 0);
    session.dragGhost.style.transform = `translate3d(${Math.round(event.clientX - offsetX)}px,${Math.round(event.clientY - offsetY)}px,0)`;
  }

  function dropIndexForWrapper(session, wrapper, clientX, clientY, sourceIndex) {
    if (!wrapper) return null;
    const targetPage = Number(wrapper.dataset.pageNumber);
    if (!Number.isInteger(targetPage) || targetPage < 1) return null;
    const targetIndex = targetPage - 1;
    const rect = wrapper.getBoundingClientRect();
    const after = session.organizerMode
      ? Number(clientX) > rect.left + (rect.width / 2)
      : Number(clientY) > rect.top + (rect.height / 2);
    let insertIndex = targetIndex + (after ? 1 : 0);
    if (sourceIndex < insertIndex) insertIndex -= 1;
    return { finalIndex: clamp(insertIndex, 0, session.document.numPages - 1), after };
  }

  function markThumbnailDropTarget(session, wrapper, after) {
    for (const candidate of session.thumbnailsRoot?.querySelectorAll?.('.portal-pdf-thumb-wrap') || []) {
      candidate.classList.remove('drag-before', 'drag-after');
    }
    if (wrapper) wrapper.classList.add(after ? 'drag-after' : 'drag-before');
  }

  function emitThumbnailReorder(session, sourceIndex, finalIndex) {
    if (!isCurrentSession(session) || !session.thumbnailActions || !Number.isInteger(sourceIndex) || !Number.isInteger(finalIndex) || sourceIndex === finalIndex) return false;
    session.suppressThumbnailClickUntil = performance.now() + 350;
    session.onThumbnailAction?.('reorder', sourceIndex, { toIndex: finalIndex });
    return true;
  }

  function installThumbnailReorder(session) {
    const root = session.thumbnailsRoot;
    if (!root || session.thumbnailDragHandlers) return;

    const dragstart = (event) => {
      if (!isCurrentSession(session) || !session.thumbnailActions) return;
      if (event.target.closest?.('[data-thumbnail-action]')) {
        event.preventDefault();
        return;
      }
      const button = event.target.closest?.('.portal-pdf-thumb[data-page-number]');
      const wrapper = button?.closest?.('.portal-pdf-thumb-wrap');
      const pageNumber = Number(wrapper?.dataset.pageNumber);
      if (!wrapper || !Number.isInteger(pageNumber)) return;
      session.dragSourceIndex = pageNumber - 1;
      wrapper.classList.add('dragging');
      try {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(session.dragSourceIndex));
      } catch (_) {}
    };

    const dragover = (event) => {
      if (!isCurrentSession(session) || !session.thumbnailActions || !Number.isInteger(session.dragSourceIndex)) return;
      const wrapper = event.target.closest?.('.portal-pdf-thumb-wrap');
      if (!wrapper) return;
      event.preventDefault();
      try { event.dataTransfer.dropEffect = 'move'; } catch (_) {}
      const target = dropIndexForWrapper(session, wrapper, event.clientX, event.clientY, session.dragSourceIndex);
      if (!target) return;
      session.dragTargetIndex = target.finalIndex;
      markThumbnailDropTarget(session, wrapper, target.after);
    };

    const drop = (event) => {
      if (!isCurrentSession(session) || !session.thumbnailActions || !Number.isInteger(session.dragSourceIndex)) return;
      event.preventDefault();
      const sourceIndex = session.dragSourceIndex;
      const wrapper = event.target.closest?.('.portal-pdf-thumb-wrap');
      const target = dropIndexForWrapper(session, wrapper, event.clientX, event.clientY, sourceIndex);
      const finalIndex = target?.finalIndex ?? session.dragTargetIndex;
      clearThumbnailDragState(session);
      if (Number.isInteger(finalIndex)) emitThumbnailReorder(session, sourceIndex, finalIndex);
    };

    const dragend = () => clearThumbnailDragState(session);

    // One session-owned loop keeps scrolling while the pointer rests at an edge.
    // Hit testing includes grid gaps; the page plan is untouched until pointerup.
    const updateDropTarget = (drag) => {
      const rect = root.getBoundingClientRect();
      if (drag.clientX < rect.left || drag.clientX > rect.right || drag.clientY < rect.top || drag.clientY > rect.bottom) {
        session.dragTargetIndex = null;
        markThumbnailDropTarget(session, null, false);
        return;
      }
      let nearest = null;
      let distance = Infinity;
      for (const wrapper of root.querySelectorAll('.portal-pdf-thumb-wrap')) {
        const box = wrapper.getBoundingClientRect();
        const dx = Math.max(box.left - drag.clientX, 0, drag.clientX - box.right);
        const dy = Math.max(box.top - drag.clientY, 0, drag.clientY - box.bottom);
        const score = dx * dx + dy * dy;
        if (score < distance) { nearest = wrapper; distance = score; }
      }
      const target = dropIndexForWrapper(session, nearest, drag.clientX, drag.clientY, drag.sourceIndex);
      session.dragTargetIndex = target?.finalIndex ?? null;
      markThumbnailDropTarget(session, nearest, target?.after);
    };

    const animateDrag = (time) => {
      session.dragFrame = null;
      const drag = session.touchDrag;
      if (!isCurrentSession(session) || !drag?.started) return;
      const rect = root.getBoundingClientRect();
      const edge = 54;
      const elapsed = Math.min(32, Math.max(0, time - (drag.frameTime || time)));
      drag.frameTime = time;
      if (drag.clientX >= rect.left && drag.clientX <= rect.right && drag.clientY >= rect.top && drag.clientY <= rect.bottom) {
        const speed = drag.clientY < rect.top + edge
          ? -clamp((rect.top + edge - drag.clientY) / edge, 0, 1)
          : clamp((drag.clientY - (rect.bottom - edge)) / edge, 0, 1);
        root.scrollTop += speed * elapsed * 0.75;
      }
      moveDragGhost(session, drag);
      updateDropTarget(drag);
      session.dragFrame = requestAnimationFrame(animateDrag);
    };

    const liftPage = (drag) => {
      if (!isCurrentSession(session) || session.touchDrag !== drag) return;
      if (drag.holdTimer) clearTimeout(drag.holdTimer);
      drag.holdTimer = null;
      drag.started = true;
      drag.wrapper.classList.add('dragging');
      ensureDragGhost(session, drag.wrapper, drag);
      if (!session.dragFrame) session.dragFrame = requestAnimationFrame(animateDrag);
    };

    const pointerdown = (event) => {
      if (!isCurrentSession(session) || !session.thumbnailActions || event.button > 0) return;
      if (event.target.closest?.('[data-thumbnail-action]')) return;
      const handle = event.target.closest?.('[data-thumbnail-drag]');
      const button = event.target.closest?.('.portal-pdf-thumb[data-page-number]');
      const origin = handle || button;
      const wrapper = origin?.closest?.('.portal-pdf-thumb-wrap');
      const pageNumber = Number(wrapper?.dataset.pageNumber);
      if (!origin || !wrapper || !Number.isInteger(pageNumber)) return;
      if (!session.thumbs.get(pageNumber)?.rendered) return;
      clearThumbnailDragState(session);
      session.touchDrag = {
        origin,
        wrapper,
        pointerType: event.pointerType,
        pointerId: event.pointerId,
        sourceIndex: pageNumber - 1,
        startX: event.clientX,
        startY: event.clientY,
        clientX: event.clientX,
        clientY: event.clientY,
        started: false
      };
      if (handle) {
        liftPage(session.touchDrag);
        event.preventDefault();
      } else if (event.pointerType === 'touch') {
        const drag = session.touchDrag;
        drag.holdTimer = setTimeout(() => liftPage(drag), 350);
      }
      try { origin.setPointerCapture?.(event.pointerId); } catch (_) {}
    };

    const pointermove = (event) => {
      const drag = session.touchDrag;
      if (!isCurrentSession(session) || !drag || drag.pointerId !== event.pointerId) return;
      drag.clientX = event.clientX;
      drag.clientY = event.clientY;
      if (!drag.started) {
        const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
        if (distance < 7) return;
        // A moving finger before the hold threshold is ordinary native scrolling.
        if (drag.pointerType === 'touch') { clearThumbnailDragState(session); return; }
        liftPage(drag);
      }
      event.preventDefault();
      updateDropTarget(drag);
    };

    const pointerup = (event) => {
      const drag = session.touchDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag.clientX = event.clientX;
      drag.clientY = event.clientY;
      if (drag.started) updateDropTarget(drag);
      const finalIndex = session.dragTargetIndex;
      const started = drag.started === true;
      clearThumbnailDragState(session);
      if (!started) return;
      event.preventDefault();
      if (Number.isInteger(finalIndex)) emitThumbnailReorder(session, drag.sourceIndex, finalIndex);
    };

    const pointercancel = (event) => {
      if (!session.touchDrag || event.pointerId == null || event.pointerId === session.touchDrag.pointerId) clearThumbnailDragState(session);
    };
    const touchmove = (event) => {
      if (session.touchDrag?.started && event.cancelable) event.preventDefault();
    };
    const contextmenu = (event) => {
      if (session.touchDrag?.started) event.preventDefault();
    };

    session.thumbnailDragHandlers = { dragstart, dragover, drop, dragend, pointerdown, pointermove, pointerup, pointercancel, lostpointercapture: pointercancel, touchmove, contextmenu };
    for (const [type, handler] of Object.entries(session.thumbnailDragHandlers)) {
      root.addEventListener(type, handler, (type === 'pointermove' || type === 'touchmove') ? { passive: false } : false);
    }
  }

  function createPagePlaceholder(session, pageNumber) {
    const article = document.createElement('article');
    article.className = 'portal-pdf-page';
    article.dataset.pageNumber = String(pageNumber);
    article.setAttribute('aria-label', `Página ${pageNumber}`);

    const badge = document.createElement('span');
    badge.className = 'portal-pdf-page-number';
    badge.textContent = String(pageNumber);

    const canvas = document.createElement('canvas');
    canvas.className = 'portal-pdf-page-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    const loading = document.createElement('div');
    loading.className = 'portal-pdf-page-loading';
    loading.textContent = 'Carregando página…';

    const objectLayer = document.createElement('div');
    objectLayer.className = 'portal-pdf-object-layer';
    objectLayer.dataset.pageNumber = String(pageNumber);
    objectLayer.setAttribute('aria-label', `Objetos da página ${pageNumber}`);

    article.append(badge, canvas, loading, objectLayer);
    session.pagesRoot.appendChild(article);

    const record = {
      pageNumber,
      container: article,
      canvas,
      loading,
      objectLayer,
      page: null,
      renderTask: null,
      pendingScale: 0,
      pendingGeneration: 0,
      renderedScale: 0,
      renderGeneration: 0
    };
    session.pages.set(pageNumber, record);
    return record;
  }

  function clamp01(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(1, Math.max(0, numeric));
  }

  function clearEditorObjectUi(session) {
    for (const entry of session?.objectUrls?.values?.() || []) {
      try { URL.revokeObjectURL(entry.url); } catch (_) {}
    }
    session?.objectUrls?.clear?.();
    if (session) {
      session.editorObjects = [];
      session.selectedObjectId = '';
      session.editingTextId = '';
      session.objectDrag = null;
    }
    for (const record of session?.pages?.values?.() || []) record.objectLayer?.replaceChildren();
  }

  function objectForId(session, objectId) {
    return (session.editorObjects || []).find((item) => String(item.id) === String(objectId || '')) || null;
  }

  function objectUrl(session, object) {
    if (!(object?.blob instanceof Blob)) return '';
    const existing = session.objectUrls.get(object.id);
    if (existing?.blob === object.blob) return existing.url;
    if (existing?.url) {
      try { URL.revokeObjectURL(existing.url); } catch (_) {}
    }
    const url = URL.createObjectURL(object.blob);
    session.objectUrls.set(object.id, { blob: object.blob, url });
    return url;
  }

  function applyObjectGeometry(element, object, pageWidth = 760) {
    const width = Math.min(0.95, Math.max(0.035, Number(object.width) || 0.2));
    const height = Math.min(0.95, Math.max(0.025, Number(object.height) || 0.08));
    element.style.left = `${clamp01(object.x) * 100}%`;
    element.style.top = `${clamp01(object.y) * 100}%`;
    element.style.width = `${width * 100}%`;
    element.style.height = `${height * 100}%`;
    element.style.opacity = String(clamp01(object.opacity, 1));
    element.style.transform = `rotate(${Number(object.rotation || 0)}deg)`;
    element.style.setProperty('--object-font-size', `${Math.max(8, Number(object.fontSize || 0.032) * Math.max(240, pageWidth))}px`);
  }

  function createObjectHandles(element) {
    for (const handle of ['nw', 'ne', 'sw', 'se']) {
      const node = document.createElement('span');
      node.className = `portal-pdf-object-handle portal-pdf-object-handle--${handle}`;
      node.dataset.objectResize = handle;
      node.setAttribute('aria-hidden', 'true');
      element.appendChild(node);
    }
    const rotate = document.createElement('span');
    rotate.className = 'portal-pdf-object-rotate';
    rotate.dataset.objectRotate = 'true';
    rotate.title = 'Rotacionar';
    rotate.setAttribute('aria-label', 'Rotacionar objeto');
    element.appendChild(rotate);
  }

  function renderEditorObjectsForPage(session, pageNumber) {
    const record = session.pages.get(Number(pageNumber));
    const layer = record?.objectLayer;
    if (!layer) return;
    const mode = String(session.objectMode || 'none');
    layer.dataset.objectMode = mode;
    layer.replaceChildren();

    const liveIds = new Set();
    for (const object of session.editorObjects || []) {
      if (Number(object.displayPage) !== Number(pageNumber)) continue;
      liveIds.add(String(object.id));
      const element = document.createElement('div');
      element.className = `portal-pdf-object portal-pdf-object--${object.type}`;
      element.dataset.objectId = String(object.id);
      element.tabIndex = 0;
      element.setAttribute('aria-label', object.type === 'text' ? 'Caixa de texto' : 'Imagem inserida');
      if (session.selectedObjectId === object.id) element.classList.add('selected');
      applyObjectGeometry(element, object, record.container.clientWidth || 760);

      if (object.type === 'text') {
        const content = document.createElement('div');
        content.className = 'portal-pdf-object-text';
        content.textContent = String(object.text || '');
        content.style.fontFamily = String(object.fontFamily || 'Arial');
        content.style.color = String(object.color || '#111111');
        content.contentEditable = session.editingTextId === object.id ? 'true' : 'false';
        content.spellcheck = false;
        element.appendChild(content);
      } else if (object.type === 'image') {
        const image = document.createElement('img');
        image.className = 'portal-pdf-object-image';
        image.alt = '';
        image.draggable = false;
        image.src = objectUrl(session, object);
        element.appendChild(image);
      }

      createObjectHandles(element);
      layer.appendChild(element);
    }

    for (const [id, entry] of [...session.objectUrls.entries()]) {
      if (liveIds.has(id)) continue;
      try { URL.revokeObjectURL(entry.url); } catch (_) {}
      session.objectUrls.delete(id);
    }
  }

  function renderEditorObjects(session) {
    if (!isCurrentSession(session)) return false;
    for (let pageNumber = 1; pageNumber <= (session.document?.numPages || 0); pageNumber += 1) {
      renderEditorObjectsForPage(session, pageNumber);
    }
    session.root.dataset.objectMode = String(session.objectMode || 'none');
    return true;
  }

  function commitObjectGesture(session, drag) {
    if (!drag || !session.onObjectCommit) return;
    const object = objectForId(session, drag.id);
    if (!object) return;
    session.onObjectCommit(drag.id, {
      x: object.x, y: object.y, width: object.width, height: object.height, rotation: object.rotation
    });
  }

  function installObjectHandlers(session) {
    if (session.objectHandlers) return;
    const pagesRoot = session.pagesRoot;

    const pointerdown = (event) => {
      if (!isCurrentSession(session) || session.organizerMode || String(session.objectMode || 'none') === 'none') return;
      const element = event.target.closest?.('.portal-pdf-object');
      if (!element) return;
      const id = String(element.dataset.objectId || '');
      const object = objectForId(session, id);
      const layer = element.closest('.portal-pdf-object-layer');
      if (!object || !layer) return;
      if (event.target.closest?.('.portal-pdf-object-text[contenteditable="true"]')) return;
      event.preventDefault();
      session.selectedObjectId = id;
      session.onObjectSelect?.(id);
      renderEditorObjects(session);

      const rect = layer.getBoundingClientRect();
      const objectRect = element.getBoundingClientRect();
      const resize = event.target.closest?.('[data-object-resize]')?.dataset?.objectResize || '';
      const rotate = Boolean(event.target.closest?.('[data-object-rotate]'));
      const center = {
        x: objectRect.left + objectRect.width / 2,
        y: objectRect.top + objectRect.height / 2
      };
      session.objectDrag = {
        id,
        pointerId: event.pointerId,
        origin: element,
        kind: rotate ? 'rotate' : resize ? 'resize' : 'move',
        handle: resize,
        startX: event.clientX,
        startY: event.clientY,
        layerWidth: Math.max(1, rect.width),
        layerHeight: Math.max(1, rect.height),
        center,
        startAngle: Math.atan2(event.clientY - center.y, event.clientX - center.x) * 180 / Math.PI,
        start: { ...object }
      };
      try { element.setPointerCapture?.(event.pointerId); } catch (_) {}
    };

    const pointermove = (event) => {
      const drag = session.objectDrag;
      if (!drag || !isCurrentSession(session) || (event.pointerId != null && drag.pointerId !== event.pointerId)) return;
      const object = objectForId(session, drag.id);
      if (!object) return;
      event.preventDefault();
      const dx = (event.clientX - drag.startX) / drag.layerWidth;
      const dy = (event.clientY - drag.startY) / drag.layerHeight;
      let patch = {};

      if (drag.kind === 'move') {
        patch = {
          x: Math.min(1 - drag.start.width, Math.max(0, drag.start.x + dx)),
          y: Math.min(1 - drag.start.height, Math.max(0, drag.start.y + dy))
        };
      } else if (drag.kind === 'rotate') {
        const angle = Math.atan2(event.clientY - drag.center.y, event.clientX - drag.center.x) * 180 / Math.PI;
        patch = { rotation: drag.start.rotation + (angle - drag.startAngle) };
      } else {
        let x = drag.start.x;
        let y = drag.start.y;
        let width = drag.start.width;
        let height = drag.start.height;
        if (drag.handle.includes('e')) width = drag.start.width + dx;
        if (drag.handle.includes('s')) height = drag.start.height + dy;
        if (drag.handle.includes('w')) {
          x = drag.start.x + dx;
          width = drag.start.width - dx;
        }
        if (drag.handle.includes('n')) {
          y = drag.start.y + dy;
          height = drag.start.height - dy;
        }
        width = Math.min(0.95, Math.max(0.035, width));
        height = Math.min(0.95, Math.max(0.025, height));
        x = Math.min(1 - width, Math.max(0, x));
        y = Math.min(1 - height, Math.max(0, y));
        patch = { x, y, width, height };
      }

      Object.assign(object, patch);
      session.onObjectChange?.(drag.id, patch);
      const element = pagesRoot.querySelector(`.portal-pdf-object[data-object-id="${CSS.escape(drag.id)}"]`);
      if (element) applyObjectGeometry(element, object, element.closest('.portal-pdf-page')?.clientWidth || 760);
    };

    const finish = (event) => {
      const drag = session.objectDrag;
      if (!drag || (event.pointerId != null && drag.pointerId !== event.pointerId)) return;
      session.objectDrag = null;
      try { drag.origin?.releasePointerCapture?.(drag.pointerId); } catch (_) {}
      commitObjectGesture(session, drag);
    };

    const click = (event) => {
      if (!isCurrentSession(session) || session.organizerMode) return;
      const element = event.target.closest?.('.portal-pdf-object');
      if (element) {
        const id = String(element.dataset.objectId || '');
        if (id && session.selectedObjectId !== id) {
          session.selectedObjectId = id;
          session.onObjectSelect?.(id);
          renderEditorObjects(session);
        }
        return;
      }
      const layer = event.target.closest?.('.portal-pdf-object-layer');
      if (!layer || String(session.objectMode || '') !== 'write') return;
      const pageNumber = Number(layer.dataset.pageNumber);
      const rect = layer.getBoundingClientRect();
      session.onCreateText?.(pageNumber, {
        x: clamp01((event.clientX - rect.left) / Math.max(1, rect.width)),
        y: clamp01((event.clientY - rect.top) / Math.max(1, rect.height))
      });
    };

    const dblclick = (event) => {
      const text = event.target.closest?.('.portal-pdf-object-text');
      const element = text?.closest?.('.portal-pdf-object');
      if (!text || !element || !isCurrentSession(session)) return;
      event.preventDefault();
      const id = String(element.dataset.objectId || '');
      session.selectedObjectId = id;
      session.editingTextId = id;
      renderEditorObjects(session);
      const next = pagesRoot.querySelector(`.portal-pdf-object[data-object-id="${CSS.escape(id)}"] .portal-pdf-object-text`);
      next?.focus?.();
      try {
        const range = document.createRange();
        range.selectNodeContents(next);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (_) {}
    };

    const focusout = (event) => {
      const text = event.target.closest?.('.portal-pdf-object-text[contenteditable="true"]');
      const element = text?.closest?.('.portal-pdf-object');
      if (!text || !element) return;
      const id = String(element.dataset.objectId || '');
      session.editingTextId = '';
      const value = String(text.textContent || '');
      const object = objectForId(session, id);
      if (object) object.text = value;
      session.onObjectTextCommit?.(id, value);
      renderEditorObjects(session);
    };

    session.objectHandlers = { pointerdown, pointermove, pointerup: finish, pointercancel: finish, click, dblclick, focusout };
    for (const [type, handler] of Object.entries(session.objectHandlers)) {
      pagesRoot.addEventListener(type, handler, type === 'pointermove' ? { passive: false } : false);
    }
  }

  function setEditorObjects(objects = [], options = {}) {
    const session = active;
    if (!session || session.closed) return false;
    session.editorObjects = Array.isArray(objects) ? objects.map((item) => ({ ...item })) : [];
    session.objectMode = String(options.mode || session.objectMode || 'select');
    session.selectedObjectId = String(options.selectedObjectId || session.selectedObjectId || '');
    session.onObjectChange = typeof options.onChange === 'function' ? options.onChange : session.onObjectChange;
    session.onObjectCommit = typeof options.onCommit === 'function' ? options.onCommit : session.onObjectCommit;
    session.onObjectSelect = typeof options.onSelect === 'function' ? options.onSelect : session.onObjectSelect;
    session.onCreateText = typeof options.onCreateText === 'function' ? options.onCreateText : session.onCreateText;
    session.onObjectTextCommit = typeof options.onTextCommit === 'function' ? options.onTextCommit : session.onObjectTextCommit;
    installObjectHandlers(session);
    return renderEditorObjects(session);
  }

  function createThumbnailPlaceholder(session, pageNumber) {
    const wrapper = document.createElement('div');
    wrapper.className = 'portal-pdf-thumb-wrap';
    wrapper.dataset.pageNumber = String(pageNumber);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portal-pdf-thumb';
    button.dataset.pageNumber = String(pageNumber);
    button.setAttribute('aria-label', `Ir para página ${pageNumber}`);

    const canvas = document.createElement('canvas');
    canvas.className = 'portal-pdf-thumb-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.textContent = `Página ${pageNumber}`;

    button.append(canvas, label);
    wrapper.appendChild(button);

    session.thumbnailsRoot.appendChild(wrapper);

    const record = {
      pageNumber,
      wrapper,
      button,
      canvas,
      page: null,
      renderTask: null,
      rendered: false
    };
    session.thumbs.set(pageNumber, record);
    syncThumbnailActionControls(session, record);
    return record;
  }

  async function getPage(session, pageNumber) {
    const main = session.pages.get(pageNumber);
    const thumb = session.thumbs.get(pageNumber);
    if (main?.page) return main.page;
    if (thumb?.page) return thumb.page;
    const page = await session.document.getPage(pageNumber);
    if (!isCurrentSession(session)) return null;
    if (main) main.page = page;
    if (thumb) thumb.page = page;
    return page;
  }

  function setActivePage(session, pageNumber) {
    if (!isCurrentSession(session) || !Number.isInteger(pageNumber) || pageNumber < 1) return;
    if (session.activePage === pageNumber) return;
    session.activePage = pageNumber;
    session.root.dataset.activePage = String(pageNumber);
    for (const [number, record] of session.thumbs) {
      record.button.classList.toggle('active', number === pageNumber);
      if (number === pageNumber) record.button.setAttribute('aria-current', 'page');
      else record.button.removeAttribute('aria-current');
    }
    session.onPageChange?.(pageNumber, session.document.numPages);
  }

  async function renderMainPage(session, pageNumber, { force = false } = {}) {
    const record = session.pages.get(pageNumber);
    if (!record || !isCurrentSession(session)) return;
    const generation = session.generation;
    const scale = session.scale;
    if (!force && record.renderedScale === scale && record.renderGeneration === generation && record.canvas.width > 0) return;

    if (record.renderTask) {
      const sameRender = record.pendingScale === scale && record.pendingGeneration === generation;
      if (!force && sameRender) {
        await settleRenderTask(record);
        return;
      }
      await settleRenderTask(record, { cancel: true });
      if (!isCurrentSession(session) || generation !== session.generation) return;
    }

    const page = await getPage(session, pageNumber);
    if (!page || !isCurrentSession(session) || generation !== session.generation) return;

    const viewport = page.getViewport({ scale });
    const outputScale = safeCanvasScale(viewport);
    const pixelWidth = Math.max(1, Math.floor(viewport.width * outputScale));
    const pixelHeight = Math.max(1, Math.floor(viewport.height * outputScale));

    record.container.style.setProperty('--page-width', `${Math.ceil(viewport.width)}px`);
    record.container.style.aspectRatio = `${Math.max(1, viewport.width)} / ${Math.max(1, viewport.height)}`;
    record.canvas.width = pixelWidth;
    record.canvas.height = pixelHeight;
    record.canvas.style.width = '100%';
    record.canvas.style.height = '100%';

    const transform = outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0];
    record.loading.hidden = false;
    const task = page.render({
      canvas: record.canvas,
      viewport,
      transform,
      intent: 'display'
    });
    record.renderTask = task;
    record.pendingScale = scale;
    record.pendingGeneration = generation;

    try {
      await task.promise;
    } catch (error) {
      if (error?.name === 'RenderingCancelledException' || !isCurrentSession(session) || generation !== session.generation) return;
      throw error;
    } finally {
      if (record.renderTask === task) record.renderTask = null;
    }

    if (!isCurrentSession(session) || generation !== session.generation) return;
    record.renderedScale = scale;
    record.renderGeneration = generation;
    record.loading.hidden = true;
    record.container.classList.add('rendered');
    if (session.editorObjects?.length) renderEditorObjectsForPage(session, pageNumber);

    if (pageNumber === 1 && !session.firstPageRendered) {
      session.firstPageRendered = true;
      const notifyVisible = () => {
        if (!isCurrentSession(session) || session.firstPageNotified) return;
        const rect = record.container.getBoundingClientRect();
        const width = window.innerWidth || document.documentElement.clientWidth || 0;
        const height = window.innerHeight || document.documentElement.clientHeight || 0;
        if (rect.width <= 0 || rect.height <= 0 || rect.bottom <= 0 || rect.right <= 0 || rect.top >= height || rect.left >= width) return;
        session.firstPageNotified = true;
        session.firstPageWindowObserver?.disconnect?.();
        session.firstPageWindowObserver = null;
        session.onFirstPageVisible?.();
      };

      requestAnimationFrame(() => requestAnimationFrame(notifyVisible));
      if (typeof IntersectionObserver === 'function') {
        session.firstPageWindowObserver?.disconnect?.();
        session.firstPageWindowObserver = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0)) notifyVisible();
        }, { threshold: 0.01 });
        session.firstPageWindowObserver.observe(record.container);
      }
    }
  }

  async function renderThumbnail(session, pageNumber) {
    const record = session.thumbs.get(pageNumber);
    if (!record || !isCurrentSession(session)) return;
    const targetWidth = Number(session.thumbnailWidth || THUMB_WIDTH);
    if (record.rendered && record.renderedWidth === targetWidth) return;
    // Serialize the entire job, including getPage(), not only PDF.js render().
    // A mode switch may arrive while either await is pending.
    if (record.thumbnailPromise) {
      await record.thumbnailPromise;
      return renderThumbnail(session, pageNumber);
    }

    const generation = session.thumbnailGeneration || 0;
    const isCurrentThumbnail = () => isCurrentSession(session)
      && generation === (session.thumbnailGeneration || 0);
    const promise = (async () => {
      if (record.renderTask) await settleRenderTask(record, { cancel: true });
      if (!isCurrentThumbnail()) return;
      const page = await getPage(session, pageNumber);
      if (!page || !isCurrentThumbnail()) return;

      const base = page.getViewport({ scale: 1 });
      const scale = targetWidth / Math.max(1, base.width);
      const viewport = page.getViewport({ scale });
      const outputScale = Math.min(Number(window.devicePixelRatio || 1), 1.5);

      // The previous task is settled before resizing its canvas.
      record.canvas.width = Math.max(1, Math.floor(viewport.width * outputScale));
      record.canvas.height = Math.max(1, Math.floor(viewport.height * outputScale));
      record.canvas.style.width = `${Math.ceil(viewport.width)}px`;
      record.canvas.style.height = `${Math.ceil(viewport.height)}px`;

      const transform = outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0];
      const task = page.render({
        canvas: record.canvas,
        viewport,
        transform,
        intent: 'display'
      });
      record.renderTask = task;

      try {
        await task.promise;
        if (isCurrentThumbnail()) {
          record.rendered = true;
          record.renderedWidth = targetWidth;
          record.button.classList.add('rendered');
        }
      } catch (error) {
        if (error?.name !== 'RenderingCancelledException' && isCurrentThumbnail()) throw error;
      } finally {
        if (record.renderTask === task) record.renderTask = null;
      }
    })();
    record.thumbnailPromise = promise;

    try {
      await promise;
    } finally {
      if (record.thumbnailPromise === promise) record.thumbnailPromise = null;
    }
    if (isCurrentSession(session) && !isCurrentThumbnail()) return renderThumbnail(session, pageNumber);
  }

  function installObservers(session) {
    if (!isCurrentSession(session)) return;
    if (typeof IntersectionObserver === 'function') {
      session.pageObserver = new IntersectionObserver((entries) => {
        if (!isCurrentSession(session)) return;
        for (const entry of entries) {
          const pageNumber = Number(entry.target.dataset.pageNumber);
          if (!Number.isInteger(pageNumber)) continue;
          if (entry.isIntersecting) {
            session.visiblePages.add(pageNumber);
            renderMainPage(session, pageNumber).catch(() => {
              if (isCurrentSession(session)) session.onError?.();
            });
          } else {
            session.visiblePages.delete(pageNumber);
            const record = session.pages.get(pageNumber);
            if (record && record.canvas.width > 0) clearRenderedPage(record);
          }
        }
      }, {
        root: session.scrollRoot,
        rootMargin: '1200px 0px',
        threshold: 0
      });

      session.thumbObserver = new IntersectionObserver((entries) => {
        if (!isCurrentSession(session)) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const pageNumber = Number(entry.target.dataset.pageNumber);
          if (Number.isInteger(pageNumber)) renderThumbnail(session, pageNumber).catch(() => {});
        }
      }, {
        root: session.thumbnailsRoot,
        rootMargin: '360px 0px',
        threshold: 0
      });

      session.activeObserver = new IntersectionObserver((entries) => {
        if (!isCurrentSession(session)) return;
        for (const entry of entries) {
          const pageNumber = Number(entry.target.dataset.pageNumber);
          if (!Number.isInteger(pageNumber)) continue;
          session.pageRatios.set(pageNumber, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        if (session.initialPageTarget || session.organizerMode) return;
        let bestPage = session.activePage || 1;
        let bestRatio = -1;
        for (const [pageNumber, ratio] of session.pageRatios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestPage = pageNumber;
          }
        }
        if (bestRatio > 0) setActivePage(session, bestPage);
      }, {
        root: session.scrollRoot,
        threshold: [0.05, 0.2, 0.45, 0.7]
      });

      for (const record of session.pages.values()) {
        session.pageObserver.observe(record.container);
        session.activeObserver.observe(record.container);
      }
      for (const record of session.thumbs.values()) {
        session.thumbObserver.observe(record.button);
      }
    } else {
      for (let pageNumber = 1; pageNumber <= session.document.numPages; pageNumber += 1) {
        session.visiblePages.add(pageNumber);
        renderMainPage(session, pageNumber).catch(() => {
          if (isCurrentSession(session)) session.onError?.();
        });
        renderThumbnail(session, pageNumber).catch(() => {});
      }
    }
  }

  async function calculateFitScale(session) {
    const firstPage = await getPage(session, 1);
    if (!firstPage || !isCurrentSession(session)) return 1;
    const viewport = firstPage.getViewport({ scale: 1 });
    const available = Math.max(280, (session.scrollRoot.clientWidth || session.root.clientWidth || 720) - 38);
    return clamp(available / Math.max(1, viewport.width), MIN_SCALE, MAX_SCALE);
  }

  async function applyScale(session, nextScale, { fit = false } = {}) {
    if (!isCurrentSession(session)) return;
    session.fitMode = fit;
    session.scale = clamp(Number(nextScale || 1), MIN_SCALE, MAX_SCALE);
    session.generation += 1;

    if (session.zoomLabel) session.zoomLabel.textContent = `${Math.round(session.scale * 100)}%`;
    for (const record of session.pages.values()) clearRenderedPage(record);

    const targets = session.visiblePages.size ? [...session.visiblePages] : [session.activePage || 1];
    await Promise.all(targets.map((pageNumber) => renderMainPage(session, pageNumber, { force: true }).catch(() => {})));
  }

  async function fitWidth() {
    const session = active;
    if (!session || session.closed) return;
    const scale = await calculateFitScale(session);
    await applyScale(session, scale, { fit: true });
  }

  function zoomIn() {
    const session = active;
    if (!session || session.closed) return Promise.resolve();
    return applyScale(session, session.scale + ZOOM_STEP, { fit: false });
  }

  function zoomOut() {
    const session = active;
    if (!session || session.closed) return Promise.resolve();
    return applyScale(session, session.scale - ZOOM_STEP, { fit: false });
  }

  function resetZoom() {
    const session = active;
    if (!session || session.closed) return Promise.resolve();
    return applyScale(session, 1, { fit: false });
  }

  function scrollToPage(pageNumber) {
    const session = active;
    const record = session?.pages.get(Number(pageNumber));
    if (!session || !record) return false;
    setActivePage(session, Number(pageNumber));
    record.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  function getViewState() {
    const session = active;
    if (!session || session.closed) return null;
    return Object.freeze({
      activePage: session.activePage || 1,
      scale: session.scale || 1,
      fitMode: session.fitMode === true
    });
  }

  function setThumbnailActions(enabled, onThumbnailAction = null) {
    const session = active;
    if (!session || session.closed) return false;
    session.thumbnailActions = enabled === true;
    if (!session.thumbnailActions) clearThumbnailDragState(session);
    session.onThumbnailAction = typeof onThumbnailAction === 'function' ? onThumbnailAction : null;
    syncThumbnailActions(session);
    return true;
  }

  function setOrganizerMode(enabled) {
    const session = active;
    if (!session || session.closed) return false;
    const next = enabled === true;
    if (session.organizerMode === next) return true;
    session.organizerMode = next;
    clearThumbnailDragState(session);
    session.thumbnailWidth = next ? ORGANIZER_THUMB_WIDTH : THUMB_WIDTH;
    session.thumbnailGeneration = (session.thumbnailGeneration || 0) + 1;
    session.root.dataset.organizerMode = next ? 'true' : 'false';

    for (const record of session.thumbs.values()) {
      cancelRender(record);
      record.rendered = false;
      record.button.classList.remove('rendered');
    }
    for (let pageNumber = 1; pageNumber <= (session.document?.numPages || 0); pageNumber += 1) {
      renderThumbnail(session, pageNumber).catch(() => {});
    }
    return true;
  }

  async function open(source, options = {}) {
    const invocation = beginOpenInvocation();
    const invocationGeneration = invocation.generation;
    closeActiveSession();

    const {
      root,
      scrollRoot,
      pagesRoot,
      thumbnailsRoot,
      zoomLabel = null,
      pageCountLabel = null,
      onReady = null,
      onFirstPageVisible = null,
      onPageChange = null,
      onThumbnailAction = null,
      thumbnailActions = false,
      organizerMode = false,
      thumbnailWidth = null,
      initialViewState = null,
      onError = null
    } = options;

    if (!root || !scrollRoot || !pagesRoot || !thumbnailsRoot) {
      if (currentInvocation === invocation) currentInvocation = null;
      cancelInvocation(invocation);
      throw new Error('Superfície do visualizador incompleta.');
    }

    let pdfjs;
    let input;
    try {
      pdfjs = await waitForInvocation(invocation, loadPdfJs());
      if (pdfjs === OPEN_CANCELLED || !isCurrentInvocation(invocation)) return null;
      input = await waitForInvocation(invocation, sourceParameters(source));
      if (input === OPEN_CANCELLED || !isCurrentInvocation(invocation)) return null;
    } catch (error) {
      if (!isCurrentInvocation(invocation)) return null;
      currentInvocation = null;
      cancelInvocation(invocation);
      throw error;
    }

    const session = {
      invocation,
      openGeneration: invocationGeneration,
      root,
      scrollRoot,
      pagesRoot,
      thumbnailsRoot,
      zoomLabel,
      pageCountLabel,
      onReady,
      onFirstPageVisible,
      onPageChange,
      onThumbnailAction,
      thumbnailActions: thumbnailActions === true,
      organizerMode: organizerMode === true,
      thumbnailWidth: Number(thumbnailWidth) > 0
        ? Number(thumbnailWidth)
        : (organizerMode === true ? ORGANIZER_THUMB_WIDTH : THUMB_WIDTH),
      onError,
      loadingTask: null,
      document: null,
      pages: new Map(),
      thumbs: new Map(),
      pageObserver: null,
      thumbObserver: null,
      activeObserver: null,
      firstPageWindowObserver: null,
      resizeObserver: null,
      resizeTimer: null,
      thumbnailDragHandlers: null,
      dragSourceIndex: null,
      dragTargetIndex: null,
      dragGhost: null,
      dragGhostOffsetX: 0,
      dragGhostOffsetY: 0,
      touchDrag: null,
      suppressThumbnailClickUntil: 0,
      editorObjects: [],
      objectMode: 'none',
      selectedObjectId: '',
      editingTextId: '',
      objectDrag: null,
      objectUrls: new Map(),
      objectHandlers: null,
      onObjectChange: null,
      onObjectCommit: null,
      onObjectSelect: null,
      onCreateText: null,
      onObjectTextCommit: null,
      pageRatios: new Map(),
      visiblePages: new Set(),
      activePage: 0,
      initialPageTarget: 0,
      scale: 1,
      fitMode: true,
      generation: 1,
      firstPageRendered: false,
      firstPageNotified: false,
      closed: false
    };

    if (!isCurrentInvocation(invocation)) {
      destroySession(session);
      return null;
    }
    active = session;

    clearNode(pagesRoot);
    clearNode(thumbnailsRoot);
    root.hidden = false;
    root.dataset.organizerMode = session.organizerMode ? 'true' : 'false';

    try {
      const loadingTask = pdfjs.getDocument({
        ...input,
        cMapUrl: CMAP_URL,
        cMapPacked: true,
        standardFontDataUrl: STANDARD_FONT_URL,
        wasmUrl: WASM_URL,
        iccUrl: ICC_URL,
        enableScripting: false,
        isEvalSupported: false,
        useSystemFonts: true,
        disableRange: false,
        disableStream: false,
        disableAutoFetch: false,
        withCredentials: false
      });
      session.loadingTask = loadingTask;

      const loadedDocument = await waitForInvocation(invocation, loadingTask.promise);
      if (loadedDocument === OPEN_CANCELLED) {
        abandonSession(session);
        return null;
      }
      session.document = loadedDocument;
      if (!isCurrentSession(session)) {
        abandonSession(session);
        return null;
      }
      if (!(session.document?.numPages > 0)) throw new Error('O PDF não possui páginas visíveis.');

      if (pageCountLabel) pageCountLabel.textContent = `${session.document.numPages} página(s)`;

      for (let pageNumber = 1; pageNumber <= session.document.numPages; pageNumber += 1) {
        createPagePlaceholder(session, pageNumber);
        createThumbnailPlaceholder(session, pageNumber);
      }
      syncThumbnailActions(session);
      installThumbnailReorder(session);

      thumbnailsRoot.addEventListener('click', session.thumbClick = (event) => {
        if (!isCurrentSession(session)) return;
        const actionButton = event.target.closest?.('[data-thumbnail-action]');
        if (actionButton) {
          const wrapper = actionButton.closest?.('.portal-pdf-thumb-wrap');
          const pageNumber = Number(wrapper?.dataset.pageNumber);
          if (Number.isInteger(pageNumber) && pageNumber > 0) {
            session.onThumbnailAction?.(String(actionButton.dataset.thumbnailAction || ''), pageNumber - 1);
          }
          return;
        }

        if (performance.now() < Number(session.suppressThumbnailClickUntil || 0)) return;
        const button = event.target.closest?.('.portal-pdf-thumb[data-page-number]');
        if (!button) return;
        const pageNumber = Number(button.dataset.pageNumber);
        const record = session.pages.get(pageNumber);
        if (!record) return;
        setActivePage(session, pageNumber);
        if (!session.organizerMode) {
          record.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      const requestedPage = Math.round(Number(initialViewState?.activePage || 1));
      const initialPage = clamp(Number.isFinite(requestedPage) ? requestedPage : 1, 1, session.document.numPages);
      setActivePage(session, initialPage);
      if (!isCurrentSession(session)) {
        abandonSession(session);
        return null;
      }

      const requestedScale = Number(initialViewState?.scale);
      const preserveManualScale = initialViewState?.fitMode === false && Number.isFinite(requestedScale);
      session.fitMode = !preserveManualScale;
      const initialScale = preserveManualScale
        ? clamp(requestedScale, MIN_SCALE, MAX_SCALE)
        : await calculateFitScale(session);
      if (!isCurrentSession(session)) {
        abandonSession(session);
        return null;
      }
      session.scale = initialScale;
      if (zoomLabel) zoomLabel.textContent = `${Math.round(session.scale * 100)}%`;

      session.visiblePages.add(initialPage);
      await Promise.all([
        renderMainPage(session, initialPage, { force: true }),
        renderThumbnail(session, initialPage)
      ]);

      if (!isCurrentSession(session)) {
        abandonSession(session);
        return null;
      }
      const initialRecord = session.pages.get(initialPage);
      session.initialPageTarget = initialPage;
      const restoreInitialViewport = () => {
        if (!isCurrentSession(session) || !initialRecord) return;
        const previousScrollBehavior = session.scrollRoot.style.scrollBehavior;
        session.scrollRoot.style.scrollBehavior = 'auto';
        const scrollRect = session.scrollRoot.getBoundingClientRect();
        const pageRect = initialRecord.container.getBoundingClientRect();
        const targetTop = Math.max(
          0,
          session.scrollRoot.scrollTop + (pageRect.top - scrollRect.top) - 16
        );
        session.scrollRoot.scrollTop = targetTop;
        session.scrollRoot.scrollLeft = 0;
        session.scrollRoot.style.scrollBehavior = previousScrollBehavior;
        setActivePage(session, initialPage);
      };

      restoreInitialViewport();
      installObservers(session);
      requestAnimationFrame(() => {
        if (!isCurrentSession(session)) return;
        restoreInitialViewport();
        requestAnimationFrame(() => {
          if (!isCurrentSession(session)) return;
          restoreInitialViewport();
          session.pageRatios.clear();
          session.initialPageTarget = 0;
        });
      });

      if (typeof ResizeObserver === 'function') {
        session.resizeObserver = new ResizeObserver(() => {
          if (!session.fitMode || session.organizerMode || !isCurrentSession(session)) return;
          if (session.resizeTimer) clearTimeout(session.resizeTimer);
          session.resizeTimer = window.setTimeout(() => {
            if (!session.fitMode || session.organizerMode || !isCurrentSession(session)) return;
            fitWidth().catch(() => {});
          }, 140);
        });
        session.resizeObserver.observe(scrollRoot);
      }

      onReady?.({
        pageCount: session.document.numPages,
        version: PDFJS_VERSION,
        viewState: getViewState()
      });
      if (!isCurrentSession(session)) {
        abandonSession(session);
        return null;
      }
      return {
        pageCount: session.document.numPages,
        version: PDFJS_VERSION
      };
    } catch (error) {
      const stale = !isCurrentSession(session);
      abandonSession(session);
      if (stale) return null;
      currentInvocation = null;
      cancelInvocation(invocation);
      throw error;
    }
  }

  function supported() {
    return typeof HTMLCanvasElement !== 'undefined'
      && typeof Promise !== 'undefined'
      && typeof Worker !== 'undefined';
  }

  window.PortalPdfViewer = Object.freeze({
    open,
    close,
    fitWidth,
    zoomIn,
    zoomOut,
    resetZoom,
    scrollToPage,
    getViewState,
    setThumbnailActions,
    setOrganizerMode,
    setEditorObjects,
    loadPdfJs,
    supported,
    version: `pdfjs-${PDFJS_VERSION}-legacy-objects-v1`
  });
})();
