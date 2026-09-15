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
    if (session.objectHandlers) {
      for (const [type, handler] of Object.entries(session.objectHandlers)) {
        try { session.pagesRoot?.removeEventListener(type, handler); } catch (_) {}
      }
      session.objectHandlers = null;
    }
    if (session.objectWindowHandlers) {
      for (const [type, handler] of Object.entries(session.objectWindowHandlers)) {
        try { window.removeEventListener(type, handler, true); } catch (_) {}
      }
      session.objectWindowHandlers = null;
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
    element.style.removeProperty('opacity');
    element.style.setProperty('--object-opacity', String(clamp01(object.opacity, 1)));
    element.style.transform = `rotate(${Number(object.rotation || 0)}deg)`;
    element.style.setProperty('--object-rotation', `${Number(object.rotation || 0)}deg`);
    element.style.setProperty('--object-font-size', `${Math.max(8, Number(object.fontSize || 0.032) * Math.max(240, pageWidth))}px`);
    element.classList.toggle('quickbar-above', Number(object.y || 0) + height > 0.82);
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

  function normalizeObjectColor(value, fallback = '#111111') {
    const color = String(value || '').trim().toLowerCase();
    return /^#[0-9a-f]{6}$/.test(color) ? color : fallback;
  }

  function normalizeColorPalette(value) {
    const source = Array.isArray(value) ? value : [];
    const colors = [];
    for (const item of source) {
      const color = normalizeObjectColor(item, '');
      if (!color) continue;
      colors.push(color);
      if (colors.length >= 16) break;
    }
    return colors.length ? colors : ['#000000', '#ffffff', '#e53935', '#1565c0', '#2e7d32', '#f9a825'];
  }

  function hexToRgb(color) {
    const hex = normalizeObjectColor(color, '#111111');
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16)
    };
  }

  function rgbToHex(r, g, b) {
    const channel = (value) => Math.max(0, Math.min(255, Math.round(Number(value) || 0)))
      .toString(16).padStart(2, '0');
    return `#${channel(r)}${channel(g)}${channel(b)}`;
  }

  function rgbToHsv(r, g, b) {
    const red = Math.max(0, Math.min(255, Number(r) || 0)) / 255;
    const green = Math.max(0, Math.min(255, Number(g) || 0)) / 255;
    const blue = Math.max(0, Math.min(255, Number(b) || 0)) / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    let hue = 0;
    if (delta) {
      if (max === red) hue = 60 * (((green - blue) / delta) % 6);
      else if (max === green) hue = 60 * (((blue - red) / delta) + 2);
      else hue = 60 * (((red - green) / delta) + 4);
    }
    if (hue < 0) hue += 360;
    return { h: hue, s: max ? delta / max : 0, v: max };
  }

  function hsvToRgb(h, s, v) {
    const hue = ((Number(h) || 0) % 360 + 360) % 360;
    const saturation = clamp01(s);
    const value = clamp01(v);
    const chroma = value * saturation;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const match = value - chroma;
    let red = 0, green = 0, blue = 0;
    if (hue < 60) [red, green] = [chroma, x];
    else if (hue < 120) [red, green] = [x, chroma];
    else if (hue < 180) [green, blue] = [chroma, x];
    else if (hue < 240) [green, blue] = [x, chroma];
    else if (hue < 300) [red, blue] = [x, chroma];
    else [red, blue] = [chroma, x];
    return {
      r: Math.round((red + match) * 255),
      g: Math.round((green + match) * 255),
      b: Math.round((blue + match) * 255)
    };
  }

  function customPanelColor(panel) {
    const hue = Number(panel?.dataset?.colorHue || 0);
    const saturation = Number(panel?.dataset?.colorSaturation || 0);
    const value = Number(panel?.dataset?.colorValue || 0);
    const rgb = hsvToRgb(hue, saturation, value);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  function syncCustomColorPanel(panel, color) {
    if (!panel) return;
    const rgb = hexToRgb(color);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    panel.dataset.colorHue = String(hsv.h);
    panel.dataset.colorSaturation = String(hsv.s);
    panel.dataset.colorValue = String(hsv.v);

    const plane = panel.querySelector('[data-color-plane]');
    if (plane) {
      plane.style.setProperty('--picker-hue', String(hsv.h));
      const cursor = plane.querySelector('[data-color-plane-cursor]');
      if (cursor) {
        cursor.style.left = `${hsv.s * 100}%`;
        cursor.style.top = `${(1 - hsv.v) * 100}%`;
      }
    }
    const hue = panel.querySelector('[data-color-hue]');
    if (hue) hue.value = String(Math.round(hsv.h));
    const preview = panel.querySelector('[data-color-preview]');
    if (preview) preview.style.background = normalizeObjectColor(color);
    const red = panel.querySelector('[data-color-r]');
    const green = panel.querySelector('[data-color-g]');
    const blue = panel.querySelector('[data-color-b]');
    const hex = panel.querySelector('[data-color-hex]');
    if (red) red.value = String(rgb.r);
    if (green) green.value = String(rgb.g);
    if (blue) blue.value = String(rgb.b);
    if (hex) hex.value = normalizeObjectColor(color).toUpperCase();
  }

  function previewQuickbarColor(session, element, object, color) {
    const normalized = normalizeObjectColor(color, normalizeObjectColor(object?.color));
    if (!object || !normalized) return false;
    object.color = normalized;
    session.onObjectChange?.(object.id, { color: normalized });
    const text = element?.querySelector?.('.portal-pdf-object-text');
    if (text) text.style.color = normalized;
    const swatch = element?.querySelector?.('[data-text-quick-color] .portal-pdf-text-quickbar-swatch');
    if (swatch) swatch.style.background = normalized;
    return true;
  }

  function commitQuickbarColor(session, element, object, color) {
    const normalized = normalizeObjectColor(color, normalizeObjectColor(object?.color));
    previewQuickbarColor(session, element, object, normalized);
    const index = Number(session.paletteSelectedIndex);
    if (Number.isInteger(index) && index >= 0 && index < session.colorPalette.length) {
      const next = [...session.colorPalette];
      next[index] = normalized;
      session.colorPalette = normalizeColorPalette(next);
      session.paletteSelectedIndex = index;
      session.onColorPaletteChange?.([...session.colorPalette]);
      refreshPaletteButtons(session, element, object);
    }
    session.onObjectCommit?.(object.id, { color: normalized });
    return true;
  }

  function patchObjectFromQuickbar(session, objectId, patch) {
    const object = objectForId(session, objectId);
    if (!object) return false;
    Object.assign(object, patch);
    session.onObjectChange?.(objectId, patch);
    session.onObjectCommit?.(objectId, patch);
    const element = session.pagesRoot?.querySelector?.(`.portal-pdf-object[data-object-id="${CSS.escape(objectId)}"]`);
    if (element) {
      applyObjectGeometry(element, object, element.closest('.portal-pdf-page')?.clientWidth || 760);
      const text = element.querySelector('.portal-pdf-object-text');
      if (text && patch.color) text.style.color = patch.color;
      if (text && patch.fontSize) {
        element.style.setProperty('--object-font-size', `${Math.max(8, Number(patch.fontSize) * Math.max(240, element.closest('.portal-pdf-page')?.clientWidth || 760))}px`);
      }
      const swatch = element.querySelector('[data-text-quick-color] .portal-pdf-text-quickbar-swatch');
      if (swatch && patch.color) swatch.style.background = patch.color;
    }
    return true;
  }

  function refreshPaletteButtons(session, element, object) {
    const palette = element?.querySelector?.('[data-text-palette]');
    if (!palette) return;
    const colors = normalizeColorPalette(session.colorPalette);
    session.colorPalette = colors;
    const slots = palette.querySelector('[data-text-palette-slots]');
    if (!slots) return;
    slots.replaceChildren();
    const selectedIndex = Number.isInteger(Number(session.paletteSelectedIndex))
      && Number(session.paletteSelectedIndex) >= 0
      && Number(session.paletteSelectedIndex) < colors.length
      ? Number(session.paletteSelectedIndex)
      : colors.indexOf(normalizeObjectColor(object?.color));
    const addButton = palette.querySelector('[data-text-palette-add]');
    if (addButton) addButton.disabled = colors.length >= 16;
    colors.forEach((color, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'portal-pdf-text-palette-color';
      button.dataset.textPaletteIndex = String(index);
      button.title = `Usar cor ${color}`;
      button.setAttribute('aria-label', `Usar cor ${color}`);
      button.style.background = color;
      if (color === '#ffffff') button.classList.add('is-light');
      if (index === selectedIndex) button.classList.add('active');
      slots.appendChild(button);
    });
  }

  function customColorPanelBounds(panel) {
    if (!panel) return null;
    const palette = panel.closest?.('[data-text-palette]');
    if (!palette) return null;
    const host = palette.closest?.('.documents-pdf-scroll')
      || palette.closest?.('.documents-pdf-layout')
      || palette.closest?.('.documents-custom-viewer');
    const paletteRect = palette.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const hostRect = host?.getBoundingClientRect?.() || {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight
    };
    const inset = 8;
    const minLeft = hostRect.left + inset - paletteRect.left;
    const maxLeft = Math.max(minLeft, hostRect.right - inset - panelRect.width - paletteRect.left);
    const minTop = hostRect.top + inset - paletteRect.top;
    const maxTop = Math.max(minTop, hostRect.bottom - inset - panelRect.height - paletteRect.top);
    return { paletteRect, panelRect, hostRect, minLeft, maxLeft, minTop, maxTop };
  }

  function createTextQuickbar(session, element, object) {
    if (object?.type !== 'text' || session.selectedObjectId !== object.id) return;
    const bar = document.createElement('div');
    bar.className = 'portal-pdf-text-quickbar';
    bar.dataset.textQuickbar = 'true';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Atalhos da caixa de texto');

    const color = document.createElement('button');
    color.type = 'button';
    color.className = 'portal-pdf-text-quickbar-button portal-pdf-text-quickbar-color';
    color.dataset.textQuickColor = 'true';
    color.title = 'Cor do texto';
    color.setAttribute('aria-label', 'Cor do texto');
    const swatch = document.createElement('span');
    swatch.className = 'portal-pdf-text-quickbar-swatch';
    swatch.style.background = normalizeObjectColor(object.color);
    color.appendChild(swatch);
    bar.appendChild(color);

    for (const [action, label, title] of [
      ['smaller', 'A−', 'Diminuir texto'],
      ['larger', 'A+', 'Aumentar texto']
    ]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'portal-pdf-text-quickbar-button';
      button.dataset.textQuickSize = action;
      button.textContent = label;
      button.title = title;
      button.setAttribute('aria-label', title);
      bar.appendChild(button);
    }

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'portal-pdf-text-quickbar-button danger';
    remove.dataset.textQuickDelete = 'true';
    remove.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 11H7.7L7 9Zm3 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" fill="currentColor"/></svg>';
    remove.title = 'Excluir caixa de texto';
    remove.setAttribute('aria-label', 'Excluir caixa de texto');
    bar.appendChild(remove);

    const palette = document.createElement('div');
    palette.className = 'portal-pdf-text-palette';
    palette.dataset.textPalette = 'true';
    palette.hidden = true;

    const slots = document.createElement('div');
    slots.className = 'portal-pdf-text-palette-slots';
    slots.dataset.textPaletteSlots = 'true';
    palette.appendChild(slots);

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'portal-pdf-text-palette-action';
    add.dataset.textPaletteAdd = 'true';
    add.textContent = '+';
    add.title = 'Cadastrar nova cor predefinida';
    add.setAttribute('aria-label', 'Cadastrar nova cor predefinida');
    palette.appendChild(add);

    const custom = document.createElement('button');
    custom.type = 'button';
    custom.className = 'portal-pdf-text-palette-action';
    custom.dataset.textPaletteCustom = 'true';
    custom.textContent = 'RGB';
    custom.title = 'Escolher cor RGB/HEX';
    custom.setAttribute('aria-label', 'Escolher cor RGB ou hexadecimal');
    palette.appendChild(custom);

    const customPanel = document.createElement('div');
    customPanel.className = 'portal-pdf-custom-color-panel';
    customPanel.dataset.textCustomColorPanel = 'true';
    customPanel.hidden = true;
    customPanel.setAttribute('role', 'dialog');
    customPanel.setAttribute('aria-label', 'Seletor RGB e hexadecimal');

    const panelHeader = document.createElement('div');
    panelHeader.className = 'portal-pdf-custom-color-header';
    const panelTitle = document.createElement('strong');
    panelTitle.textContent = 'RGB / HEX';
    const panelClose = document.createElement('button');
    panelClose.type = 'button';
    panelClose.className = 'portal-pdf-custom-color-close';
    panelClose.dataset.colorPanelClose = 'true';
    panelClose.textContent = '×';
    panelClose.title = 'Fechar seletor de cor';
    panelClose.setAttribute('aria-label', 'Fechar seletor de cor');
    panelHeader.append(panelTitle, panelClose);
    customPanel.appendChild(panelHeader);

    const plane = document.createElement('div');
    plane.className = 'portal-pdf-custom-color-plane';
    plane.dataset.colorPlane = 'true';
    const planeCursor = document.createElement('span');
    planeCursor.className = 'portal-pdf-custom-color-plane-cursor';
    planeCursor.dataset.colorPlaneCursor = 'true';
    plane.appendChild(planeCursor);
    customPanel.appendChild(plane);

    const hueRow = document.createElement('div');
    hueRow.className = 'portal-pdf-custom-color-hue-row';
    const preview = document.createElement('span');
    preview.className = 'portal-pdf-custom-color-preview';
    preview.dataset.colorPreview = 'true';
    const hue = document.createElement('input');
    hue.type = 'range';
    hue.min = '0';
    hue.max = '359';
    hue.step = '1';
    hue.dataset.colorHue = 'true';
    hue.setAttribute('aria-label', 'Matiz');
    hueRow.append(preview, hue);
    customPanel.appendChild(hueRow);

    const rgbRow = document.createElement('div');
    rgbRow.className = 'portal-pdf-custom-color-rgb';
    for (const [channel, label] of [['r', 'R'], ['g', 'G'], ['b', 'B']]) {
      const field = document.createElement('label');
      field.textContent = label;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '255';
      input.step = '1';
      input.dataset[`color${channel.toUpperCase()}`] = 'true';
      field.appendChild(input);
      rgbRow.appendChild(field);
    }
    customPanel.appendChild(rgbRow);

    const bottomRow = document.createElement('div');
    bottomRow.className = 'portal-pdf-custom-color-bottom';
    const hex = document.createElement('label');
    hex.className = 'portal-pdf-custom-color-hex';
    hex.textContent = 'HEX';
    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.maxLength = 7;
    hexInput.dataset.colorHex = 'true';
    hexInput.setAttribute('aria-label', 'Cor hexadecimal');
    hex.appendChild(hexInput);
    bottomRow.appendChild(hex);

    const dragHandle = document.createElement('button');
    dragHandle.type = 'button';
    dragHandle.className = 'portal-pdf-custom-color-drag';
    dragHandle.dataset.colorDragHandle = 'true';
    dragHandle.title = 'Arrastar seletor de cor';
    dragHandle.setAttribute('aria-label', 'Arrastar seletor de cor');
    dragHandle.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span>';
    bottomRow.appendChild(dragHandle);
    customPanel.appendChild(bottomRow);

    palette.appendChild(customPanel);
    bar.appendChild(palette);
    element.appendChild(bar);
    refreshPaletteButtons(session, element, object);
    syncCustomColorPanel(customPanel, object.color);

    const colorFromRgbInputs = () => {
      const red = Number(customPanel.querySelector('[data-color-r]')?.value);
      const green = Number(customPanel.querySelector('[data-color-g]')?.value);
      const blue = Number(customPanel.querySelector('[data-color-b]')?.value);
      if (![red, green, blue].every(Number.isFinite)) return null;
      return rgbToHex(red, green, blue);
    };

    const previewPanelColor = (color) => {
      syncCustomColorPanel(customPanel, color);
      previewQuickbarColor(session, element, object, color);
    };
    const commitPanelColor = (color) => {
      syncCustomColorPanel(customPanel, color);
      commitQuickbarColor(session, element, object, color);
    };

    let planeDrag = null;
    const updatePlane = (event, commit = false) => {
      const rect = plane.getBoundingClientRect();
      const saturation = clamp01((event.clientX - rect.left) / Math.max(1, rect.width));
      const value = 1 - clamp01((event.clientY - rect.top) / Math.max(1, rect.height));
      customPanel.dataset.colorSaturation = String(saturation);
      customPanel.dataset.colorValue = String(value);
      const color = customPanelColor(customPanel);
      if (commit) commitPanelColor(color);
      else previewPanelColor(color);
    };

    plane.addEventListener('pointerdown', (event) => {
      if (event.button > 0) return;
      event.preventDefault();
      event.stopPropagation();
      planeDrag = { pointerId: event.pointerId };
      try { plane.setPointerCapture?.(event.pointerId); } catch (_) {}
      updatePlane(event, false);
    });
    plane.addEventListener('pointermove', (event) => {
      if (!planeDrag || planeDrag.pointerId !== event.pointerId) return;
      event.preventDefault();
      updatePlane(event, false);
    });
    const finishPlane = (event) => {
      if (!planeDrag || (event.pointerId != null && planeDrag.pointerId !== event.pointerId)) return;
      updatePlane(event, true);
      planeDrag = null;
      try { plane.releasePointerCapture?.(event.pointerId); } catch (_) {}
    };
    plane.addEventListener('pointerup', finishPlane);
    plane.addEventListener('pointercancel', () => { planeDrag = null; });

    hue.addEventListener('input', (event) => {
      customPanel.dataset.colorHue = String(Number(event.target.value) || 0);
      previewPanelColor(customPanelColor(customPanel));
    });
    hue.addEventListener('change', () => commitPanelColor(customPanelColor(customPanel)));

    for (const selector of ['[data-color-r]', '[data-color-g]', '[data-color-b]']) {
      customPanel.querySelector(selector)?.addEventListener('change', () => {
        const color = colorFromRgbInputs();
        if (color) commitPanelColor(color);
      });
    }
    hexInput.addEventListener('change', () => {
      const color = normalizeObjectColor(hexInput.value, '');
      if (!color) {
        syncCustomColorPanel(customPanel, object.color);
        return;
      }
      commitPanelColor(color);
    });

    let panelDrag = null;
    dragHandle.addEventListener('pointerdown', (event) => {
      if (event.button > 0) return;
      event.preventDefault();
      event.stopPropagation();
      const panelRect = customPanel.getBoundingClientRect();
      const paletteRect = palette.getBoundingClientRect();
      customPanel.style.left = `${panelRect.left - paletteRect.left}px`;
      customPanel.style.top = `${panelRect.top - paletteRect.top}px`;
      customPanel.style.right = 'auto';
      customPanel.style.bottom = 'auto';
      panelDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: parseFloat(customPanel.style.left) || 0,
        top: parseFloat(customPanel.style.top) || 0
      };
      try { dragHandle.setPointerCapture?.(event.pointerId); } catch (_) {}
    });
    dragHandle.addEventListener('pointermove', (event) => {
      if (!panelDrag || panelDrag.pointerId !== event.pointerId) return;
      event.preventDefault();
      event.stopPropagation();
      const bounds = customColorPanelBounds(customPanel);
      if (!bounds) return;
      const dx = event.clientX - panelDrag.startX;
      const dy = event.clientY - panelDrag.startY;
      customPanel.style.left = `${Math.min(bounds.maxLeft, Math.max(bounds.minLeft, panelDrag.left + dx))}px`;
      customPanel.style.top = `${Math.min(bounds.maxTop, Math.max(bounds.minTop, panelDrag.top + dy))}px`;
    });
    const finishPanelDrag = (event) => {
      if (!panelDrag || (event.pointerId != null && panelDrag.pointerId !== event.pointerId)) return;
      event.preventDefault();
      event.stopPropagation();
      panelDrag = null;
      try { dragHandle.releasePointerCapture?.(event.pointerId); } catch (_) {}
    };
    dragHandle.addEventListener('pointerup', finishPanelDrag);
    dragHandle.addEventListener('pointercancel', () => { panelDrag = null; });
    panelClose.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      customPanel.hidden = true;
    });
  }

  function finishTextEditing(session, { suppressCreate = true } = {}) {
    const id = String(session?.editingTextId || '');
    if (!id) return false;
    const selector = `.portal-pdf-object[data-object-id="${CSS.escape(id)}"] .portal-pdf-object-text[contenteditable="true"]`;
    const text = session.pagesRoot?.querySelector?.(selector);
    const object = objectForId(session, id);
    const value = String(text?.textContent ?? object?.text ?? '');
    session.editingTextId = '';
    if (text) text.contentEditable = 'false';
    if (object) object.text = value;
    session.onObjectTextCommit?.(id, value);
    if (suppressCreate) session.suppressCreateTextUntil = performance.now() + 400;
    return true;
  }

  function clearSelectedObject(session, { finishEditing = true, suppressCreate = true } = {}) {
    if (!session) return false;
    const hadSelection = Boolean(session.selectedObjectId || session.editingTextId);
    if (finishEditing && session.editingTextId) finishTextEditing(session, { suppressCreate });
    session.paletteSelectedIndex = -1;
    markSelectedObject(session, '');
    session.onObjectSelect?.('');
    return hadSelection;
  }

  function renderEditorObjectsForPage(session, pageNumber) {
    const record = session.pages.get(Number(pageNumber));
    const layer = record?.objectLayer;
    if (!layer) return;
    const mode = String(session.objectMode || 'none');
    layer.dataset.objectMode = mode;
    layer.replaceChildren();

    for (const object of session.editorObjects || []) {
      if (Number(object.displayPage) !== Number(pageNumber)) continue;
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
        content.style.fontWeight = object.fontWeight === 'bold' ? 'bold' : 'normal';
        content.style.fontStyle = object.fontStyle === 'italic' ? 'italic' : 'normal';
        content.style.textDecoration = object.textDecoration === 'underline' ? 'underline' : 'none';
        content.style.textAlign = ['left', 'center', 'right'].includes(object.textAlign) ? object.textAlign : 'left';
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
      createTextQuickbar(session, element, object);
      layer.appendChild(element);
    }
  }

  function refreshEditorObjectGeometryForPage(session, pageNumber) {
    const record = session.pages.get(Number(pageNumber));
    const layer = record?.objectLayer;
    if (!layer) return;
    const width = record.container.clientWidth || 760;
    for (const element of layer.querySelectorAll('.portal-pdf-object[data-object-id]')) {
      const object = objectForId(session, element.dataset.objectId);
      if (object) applyObjectGeometry(element, object, width);
    }
  }

  function renderEditorObjects(session) {
    if (!isCurrentSession(session)) return false;
    const liveIds = new Set((session.editorObjects || []).map((item) => String(item.id)));
    for (let pageNumber = 1; pageNumber <= (session.document?.numPages || 0); pageNumber += 1) {
      renderEditorObjectsForPage(session, pageNumber);
    }
    for (const [id, entry] of [...session.objectUrls.entries()]) {
      if (liveIds.has(id)) continue;
      try { URL.revokeObjectURL(entry.url); } catch (_) {}
      session.objectUrls.delete(id);
    }
    session.root.dataset.objectMode = String(session.objectMode || 'none');
    return true;
  }

  function markSelectedObject(session, objectId) {
    session.selectedObjectId = String(objectId || '');
    for (const element of session.pagesRoot?.querySelectorAll?.('.portal-pdf-object') || []) {
      const selected = element.dataset.objectId === session.selectedObjectId;
      element.classList.toggle('selected', selected);
      if (!selected) {
        element.querySelector('[data-text-quickbar]')?.remove();
        continue;
      }
      const object = objectForId(session, element.dataset.objectId);
      if (object?.type === 'text' && !element.querySelector('[data-text-quickbar]')) {
        createTextQuickbar(session, element, object);
      }
    }
  }

  function pageAtPoint(session, clientX, clientY) {
    for (const [pageNumber, record] of session.pages) {
      const rect = record.container?.getBoundingClientRect?.();
      if (!rect) continue;
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return { pageNumber, record, rect };
      }
    }
    return null;
  }

  function commitObjectGesture(session, drag) {
    if (!drag || !session.onObjectCommit) return;
    const object = objectForId(session, drag.id);
    if (!object) return;
    session.onObjectCommit(drag.id, {
      x: object.x, y: object.y, width: object.width, height: object.height, rotation: object.rotation
    });
  }

  function selectedObjectGestureHit(session, event) {
    const selectedId = String(session.selectedObjectId || '');
    if (!selectedId) return null;
    const element = session.pagesRoot?.querySelector?.(`.portal-pdf-object[data-object-id="${CSS.escape(selectedId)}"]`);
    const layer = element?.closest?.('.portal-pdf-object-layer');
    if (!element || !layer) return null;

    const rect = element.getBoundingClientRect();
    const x = Number(event.clientX);
    const y = Number(event.clientY);
    const tolerance = event.pointerType === 'touch' ? 28 : 20;
    const near = (px, py, radius = tolerance) => Math.hypot(x - px, y - py) <= radius;

    const rotateNode = element.querySelector('[data-object-rotate]');
    const rotateRect = rotateNode?.getBoundingClientRect?.();
    if (rotateRect) {
      const rx = rotateRect.left + rotateRect.width / 2;
      const ry = rotateRect.top + rotateRect.height / 2;
      if (near(rx, ry, tolerance + 4)) return { element, layer, kind: 'rotate', handle: '', origin: rotateNode };
    }

    const corners = [
      ['nw', rect.left, rect.top],
      ['ne', rect.right, rect.top],
      ['sw', rect.left, rect.bottom],
      ['se', rect.right, rect.bottom]
    ];
    for (const [handle, px, py] of corners) {
      if (near(px, py)) {
        return {
          element,
          layer,
          kind: handle === 'se' ? 'transform' : 'resize',
          handle,
          origin: element.querySelector(`[data-object-resize="${handle}"]`) || element
        };
      }
    }
    return null;
  }

  function installObjectHandlers(session) {
    if (session.objectHandlers) return;
    const pagesRoot = session.pagesRoot;

    const pointerdown = (event) => {
      if (!isCurrentSession(session) || session.organizerMode || String(session.objectMode || 'none') === 'none') return;
      if (event.target.closest?.('[data-text-custom-color-panel]')) {
        // Capture phase: do not cancel propagation here. The panel's own
        // controls need to receive pointer events (especially the drag grip).
        return;
      }
      if (event.target.closest?.('[data-text-quickbar]')) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const directElement = event.target.closest?.('.portal-pdf-object');
      const geometryHit = selectedObjectGestureHit(session, event);
      const element = directElement || geometryHit?.element;
      if (!element) return;
      const id = String(element.dataset.objectId || '');
      const object = objectForId(session, id);
      const layer = geometryHit?.layer || element.closest('.portal-pdf-object-layer');
      if (!object || !layer) return;

      const editingText = event.target.closest?.('.portal-pdf-object-text[contenteditable="true"]');
      const directResize = event.target.closest?.('[data-object-resize]')?.dataset?.objectResize || '';
      const directRotate = Boolean(event.target.closest?.('[data-object-rotate]'));
      const kind = geometryHit?.kind
        || (directRotate ? 'rotate'
          : directResize === 'se' ? 'transform'
            : directResize ? 'resize'
              : editingText ? 'edit-move-pending'
                : 'move');
      const handle = geometryHit?.handle || directResize;
      const origin = geometryHit?.origin || event.target.closest?.('[data-object-resize], [data-object-rotate]') || element;

      if (kind !== 'edit-move-pending') event.preventDefault();
      if (kind !== 'move' && kind !== 'edit-move-pending') session.suppressObjectClickUntil = performance.now() + 350;
      markSelectedObject(session, id);
      session.onObjectSelect?.(id);

      const rect = layer.getBoundingClientRect();
      const objectRect = element.getBoundingClientRect();
      const center = {
        x: objectRect.left + objectRect.width / 2,
        y: objectRect.top + objectRect.height / 2
      };
      session.objectDrag = {
        id,
        pointerId: event.pointerId,
        origin,
        kind,
        handle,
        startX: event.clientX,
        startY: event.clientY,
        layerWidth: Math.max(1, rect.width),
        layerHeight: Math.max(1, rect.height),
        center,
        startAngle: Math.atan2(event.clientY - center.y, event.clientX - center.x) * 180 / Math.PI,
        startDistance: Math.max(1, Math.hypot(event.clientX - center.x, event.clientY - center.y)),
        start: { ...object },
        currentPageNumber: Number(object.displayPage || layer.dataset.pageNumber || 1),
        changed: false
      };
      session.root.dataset.objectGesture = session.objectDrag.kind;
    };

    const pointermove = (event) => {
      const drag = session.objectDrag;
      if (!drag || !isCurrentSession(session) || (event.pointerId != null && drag.pointerId !== event.pointerId)) return;
      const object = objectForId(session, drag.id);
      if (!object) return;

      if (drag.kind === 'edit-move-pending') {
        if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 7) return;
        drag.kind = 'move';
        session.root.dataset.objectGesture = 'move';
        session.suppressObjectClickUntil = performance.now() + 350;
        try { window.getSelection()?.removeAllRanges?.(); } catch (_) {}
      }

      event.preventDefault();

      if (drag.kind === 'move') {
        const targetPage = pageAtPoint(session, event.clientX, event.clientY);
        if (targetPage && targetPage.pageNumber !== drag.currentPageNumber) {
          const x = Math.min(1 - object.width, Math.max(0,
            ((event.clientX - targetPage.rect.left) / Math.max(1, targetPage.rect.width)) - (object.width / 2)
          ));
          const y = Math.min(1 - object.height, Math.max(0,
            ((event.clientY - targetPage.rect.top) / Math.max(1, targetPage.rect.height)) - (object.height / 2)
          ));
          object.displayPage = targetPage.pageNumber;
          object.pageIndex = targetPage.pageNumber - 1;
          object.x = x;
          object.y = y;
          drag.currentPageNumber = targetPage.pageNumber;
          drag.startX = event.clientX;
          drag.startY = event.clientY;
          drag.layerWidth = Math.max(1, targetPage.rect.width);
          drag.layerHeight = Math.max(1, targetPage.rect.height);
          drag.start = { ...object };
          drag.changed = true;
          session.onObjectPageChange?.(drag.id, targetPage.pageNumber - 1, { x, y });
          renderEditorObjects(session);
          markSelectedObject(session, drag.id);
          return;
        }
      }

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
      } else if (drag.kind === 'transform') {
        const angle = Math.atan2(event.clientY - drag.center.y, event.clientX - drag.center.x) * 180 / Math.PI;
        const distance = Math.max(1, Math.hypot(event.clientX - drag.center.x, event.clientY - drag.center.y));
        const centerX = drag.start.x + (drag.start.width / 2);
        const centerY = drag.start.y + (drag.start.height / 2);
        const minScale = Math.max(
          0.035 / Math.max(0.001, drag.start.width),
          0.025 / Math.max(0.001, drag.start.height)
        );
        const maxScale = Math.min(
          0.95 / Math.max(0.001, drag.start.width),
          0.95 / Math.max(0.001, drag.start.height),
          (2 * centerX) / Math.max(0.001, drag.start.width),
          (2 * (1 - centerX)) / Math.max(0.001, drag.start.width),
          (2 * centerY) / Math.max(0.001, drag.start.height),
          (2 * (1 - centerY)) / Math.max(0.001, drag.start.height)
        );
        const scale = Math.min(maxScale, Math.max(minScale, distance / drag.startDistance));
        const width = drag.start.width * scale;
        const height = drag.start.height * scale;
        patch = {
          x: centerX - (width / 2),
          y: centerY - (height / 2),
          width,
          height,
          rotation: drag.start.rotation + (angle - drag.startAngle)
        };
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

      if (!Object.keys(patch).length) return;
      Object.assign(object, patch);
      drag.changed = true;
      session.root.dataset.objectGestureMoved = 'true';
      session.onObjectChange?.(drag.id, patch);
      const element = pagesRoot.querySelector(`.portal-pdf-object[data-object-id="${CSS.escape(drag.id)}"]`);
      if (element) applyObjectGeometry(element, object, element.closest('.portal-pdf-page')?.clientWidth || 760);
    };

    const finish = (event) => {
      const drag = session.objectDrag;
      if (!drag || (event.pointerId != null && drag.pointerId !== event.pointerId)) return;
      session.objectDrag = null;
      session.root.dataset.objectGesture = '';
      session.root.dataset.objectGestureMoved = drag.changed ? 'true' : 'false';
      if (drag.changed) commitObjectGesture(session, drag);
    };

    const click = (event) => {
      if (!isCurrentSession(session) || session.organizerMode) return;
      const suppressObjectClick = performance.now() < Number(session.suppressObjectClickUntil || 0);

      const quickbar = event.target.closest?.('[data-text-quickbar]');
      if (quickbar) {
        if (event.target.closest?.('[data-text-custom-color-panel]')) {
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        const element = quickbar.closest('.portal-pdf-object');
        const id = String(element?.dataset.objectId || '');
        const object = objectForId(session, id);
        if (!element || !object) return;

        if (event.target.closest('[data-text-quick-color]')) {
          const palette = quickbar.querySelector('[data-text-palette]');
          if (palette) {
            palette.hidden = !palette.hidden;
            session.paletteSelectedIndex = session.colorPalette.indexOf(normalizeObjectColor(object.color));
            refreshPaletteButtons(session, element, object);
          }
          return;
        }

        const sizeAction = event.target.closest('[data-text-quick-size]')?.dataset?.textQuickSize;
        if (sizeAction) {
          const current = Math.max(8, Math.min(96, Math.round(Number(object.fontSize || .032) * 560)));
          const next = Math.max(8, Math.min(96, current + (sizeAction === 'larger' ? 2 : -2)));
          patchObjectFromQuickbar(session, id, { fontSize: next / 560 });
          return;
        }

        if (event.target.closest('[data-text-quick-delete]')) {
          if (session.editingTextId === id) finishTextEditing(session, { suppressCreate: false });
          session.onObjectDelete?.(id);
          return;
        }

        const colorSlot = event.target.closest('[data-text-palette-index]');
        if (colorSlot) {
          const index = Number(colorSlot.dataset.textPaletteIndex);
          const selected = session.colorPalette[index];
          if (selected) {
            session.paletteSelectedIndex = index;
            patchObjectFromQuickbar(session, id, { color: selected });
            refreshPaletteButtons(session, element, object);
            const panel = quickbar.querySelector('[data-text-custom-color-panel]');
            if (panel && !panel.hidden) syncCustomColorPanel(panel, selected);
          }
          return;
        }

        if (event.target.closest('[data-text-palette-custom]')) {
          const panel = quickbar.querySelector('[data-text-custom-color-panel]');
          if (panel) {
            const index = Number(session.paletteSelectedIndex);
            const color = Number.isInteger(index) && index >= 0 && index < session.colorPalette.length
              ? normalizeObjectColor(session.colorPalette[index])
              : normalizeObjectColor(object.color);
            syncCustomColorPanel(panel, color);
            panel.hidden = !panel.hidden;
          }
          return;
        }

        if (event.target.closest('[data-text-palette-add]')) {
          if (session.colorPalette.length >= 16) return;
          const initialColor = normalizeObjectColor(object.color);
          const next = [...session.colorPalette, initialColor];
          session.colorPalette = normalizeColorPalette(next);
          session.paletteSelectedIndex = session.colorPalette.length - 1;
          session.onColorPaletteChange?.([...session.colorPalette]);
          refreshPaletteButtons(session, element, object);
          const panel = quickbar.querySelector('[data-text-custom-color-panel]');
          if (panel && !panel.hidden) syncCustomColorPanel(panel, initialColor);
          return;
        }
        return;
      }

      const element = event.target.closest?.('.portal-pdf-object');
      if (element) {
        if (suppressObjectClick) return;
        const id = String(element.dataset.objectId || '');
        if (id && session.selectedObjectId !== id) {
          markSelectedObject(session, id);
          session.onObjectSelect?.(id);
        } else if (id) {
          markSelectedObject(session, id);
        }
        return;
      }

      // Outside click confirms the current object state and deselects it first.
      // In Write mode the same click is consumed so it cannot create a second box.
      if (session.selectedObjectId || session.editingTextId) {
        clearSelectedObject(session, { finishEditing: true, suppressCreate: true });
        return;
      }

      const layer = event.target.closest?.('.portal-pdf-object-layer');
      if (!layer || String(session.objectMode || '') !== 'write') return;
      if (performance.now() < Number(session.suppressCreateTextUntil || 0)) return;
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
      if (String(session.objectMode || '') !== 'write') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const id = String(element.dataset.objectId || '');
      markSelectedObject(session, id);
      session.onObjectSelect?.(id);
      session.editingTextId = id;
      text.contentEditable = 'true';
      text.focus?.();
      try {
        const range = document.createRange();
        range.selectNodeContents(text);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (_) {}
    };

    const focusout = (event) => {
      const text = event.target.closest?.('.portal-pdf-object-text[contenteditable="true"]');
      if (!text) return;
      const element = text.closest?.('.portal-pdf-object');
      const id = String(element?.dataset.objectId || '');
      if (!id || session.editingTextId !== id) return;
      finishTextEditing(session);
    };

    const change = (event) => {
      const quickbar = event.target.closest?.('[data-text-quickbar]');
      if (!quickbar) return;
      const element = quickbar.closest('.portal-pdf-object');
      const id = String(element?.dataset.objectId || '');
      const object = objectForId(session, id);
      if (!element || !object) return;

      const customPanel = event.target.closest('[data-text-custom-color-panel]');
      if (customPanel) return;
    };

    session.objectHandlers = { pointerdown, click, dblclick, focusout, change };
    for (const [type, handler] of Object.entries(session.objectHandlers)) {
      pagesRoot.addEventListener(type, handler, type === 'pointerdown');
    }
    session.objectWindowHandlers = { pointermove, pointerup: finish, pointercancel: finish };
    for (const [type, handler] of Object.entries(session.objectWindowHandlers)) {
      window.addEventListener(type, handler, { capture: true, passive: type !== 'pointermove' });
    }
  }

  function setEditorObjects(objects = [], options = {}) {
    const session = active;
    if (!session || session.closed) return false;
    const nextMode = String(options.mode || session.objectMode || 'select');
    if (session.editingTextId && nextMode !== 'write') finishTextEditing(session, { suppressCreate: false });
    session.editorObjects = Array.isArray(objects) ? objects.map((item) => ({ ...item })) : [];
    session.objectMode = nextMode;
    if (Object.prototype.hasOwnProperty.call(options, 'selectedObjectId')) {
      session.selectedObjectId = String(options.selectedObjectId || '');
    }
    if (Array.isArray(options.colorPalette)) session.colorPalette = normalizeColorPalette(options.colorPalette);
    session.onObjectChange = typeof options.onChange === 'function' ? options.onChange : session.onObjectChange;
    session.onObjectCommit = typeof options.onCommit === 'function' ? options.onCommit : session.onObjectCommit;
    session.onObjectSelect = typeof options.onSelect === 'function' ? options.onSelect : session.onObjectSelect;
    session.onObjectDelete = typeof options.onDelete === 'function' ? options.onDelete : session.onObjectDelete;
    session.onColorPaletteChange = typeof options.onColorPaletteChange === 'function' ? options.onColorPaletteChange : session.onColorPaletteChange;
    session.onCreateText = typeof options.onCreateText === 'function' ? options.onCreateText : session.onCreateText;
    session.onObjectTextCommit = typeof options.onTextCommit === 'function' ? options.onTextCommit : session.onObjectTextCommit;
    session.onObjectPageChange = typeof options.onPageChange === 'function' ? options.onPageChange : session.onObjectPageChange;
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
    if (session.editorObjects?.length) refreshEditorObjectGeometryForPage(session, pageNumber);

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

    // Preserve the viewer's lazy thumbnail architecture on mode switches.
    // Re-observing invalidated records makes IntersectionObserver schedule only
    // thumbnails that are visible/near the rail viewport instead of eagerly
    // starting one PDF.js job per page on large documents.
    if (session.thumbObserver) {
      for (const record of session.thumbs.values()) {
        session.thumbObserver.unobserve(record.button);
        session.thumbObserver.observe(record.button);
      }
    } else if (typeof IntersectionObserver !== 'function') {
      for (let pageNumber = 1; pageNumber <= (session.document?.numPages || 0); pageNumber += 1) {
        renderThumbnail(session, pageNumber).catch(() => {});
      }
    } else {
      // setOrganizerMode() can be called in the narrow interval before
      // installObservers(). Keep only the active thumbnail warm; the observer
      // will pick up the remainder as soon as it is installed.
      const pageNumber = Math.min(
        Math.max(1, Number(session.activePage || 1)),
        Math.max(1, Number(session.document?.numPages || 1))
      );
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
      suppressCreateTextUntil: 0,
      objectDrag: null,
      suppressObjectClickUntil: 0,
      objectUrls: new Map(),
      colorPalette: ['#000000', '#ffffff', '#e53935', '#1565c0', '#2e7d32', '#f9a825'],
      paletteSelectedIndex: -1,
      objectHandlers: null,
      objectWindowHandlers: null,
      onObjectChange: null,
      onObjectCommit: null,
      onObjectSelect: null,
      onObjectDelete: null,
      onColorPaletteChange: null,
      onCreateText: null,
      onObjectTextCommit: null,
      onObjectPageChange: null,
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
    version: `pdfjs-${PDFJS_VERSION}-legacy-objects-v2n`
  });
})();
