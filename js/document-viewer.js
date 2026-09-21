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
  const DEFAULT_INITIAL_SCALE = 1.14;
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

  async function pageTextSafetyBounds(page, viewport) {
    if (!page?.getTextContent || !viewport?.convertToViewportPoint) return null;
    let content;
    try {
      content = await page.getTextContent({ disableNormalization: false });
    } catch (_) {
      return null;
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    let count = 0;

    for (const item of Array.isArray(content?.items) ? content.items : []) {
      if (!String(item?.str || '').trim()) continue;
      const transform = Array.isArray(item?.transform) ? item.transform : null;
      if (!transform || transform.length < 6) continue;
      const x = Number(transform[4]);
      const y = Number(transform[5]);
      const width = Math.max(0, Number(item?.width || 0));
      const height = Math.max(1, Number(item?.height || 0));
      if (![x, y, width, height].every(Number.isFinite)) continue;

      const corners = [
        viewport.convertToViewportPoint(x, y),
        viewport.convertToViewportPoint(x + width, y),
        viewport.convertToViewportPoint(x, y + height),
        viewport.convertToViewportPoint(x + width, y + height)
      ];
      for (const point of corners) {
        const px = Number(point?.[0]);
        const py = Number(point?.[1]);
        if (!Number.isFinite(px) || !Number.isFinite(py)) continue;
        minX = Math.min(minX, px);
        minY = Math.min(minY, py);
        maxX = Math.max(maxX, px);
        maxY = Math.max(maxY, py);
      }
      count += 1;
    }

    if (!count || ![minX, minY, maxX, maxY].every(Number.isFinite)) return null;
    if (maxX <= minX || maxY <= minY) return null;
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  function meaningfulContentBounds(canvas, options = {}, safetyBounds = null) {
    const width = Math.max(1, Number(canvas?.width || 0));
    const height = Math.max(1, Number(canvas?.height || 0));
    if (width < 120 || height < 120) return null;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;

    let imageData;
    try {
      imageData = context.getImageData(0, 0, width, height);
    } catch (_) {
      return null;
    }

    const data = imageData.data;
    const tile = clamp(Math.round(Number(options.tileSize || 64)), 32, 96);
    const sampleStep = clamp(Math.round(Number(options.sampleStep || 3)), 2, 6);
    const darkness = clamp(Math.round(Number(options.darkThreshold || 242)), 220, 252);
    const minimumFraction = clamp(Number(options.minimumDarkFraction || 0.055), 0.02, 0.12);

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let top = 0; top < height; top += tile) {
      const bottom = Math.min(height, top + tile);
      for (let left = 0; left < width; left += tile) {
        const right = Math.min(width, left + tile);
        let dark = 0;
        let sampled = 0;

        for (let y = top; y < bottom; y += sampleStep) {
          for (let x = left; x < right; x += sampleStep) {
            const offset = (y * width + x) * 4;
            const alpha = data[offset + 3];
            if (alpha < 24) continue;
            sampled += 1;
            if (
              data[offset] < darkness
              || data[offset + 1] < darkness
              || data[offset + 2] < darkness
            ) dark += 1;
          }
        }

        if (sampled > 0 && (dark / sampled) >= minimumFraction) {
          minX = Math.min(minX, left);
          minY = Math.min(minY, top);
          maxX = Math.max(maxX, right);
          maxY = Math.max(maxY, bottom);
        }
      }
    }

    if (safetyBounds) {
      const sx = clamp(Math.floor(Number(safetyBounds.x || 0)), 0, width);
      const sy = clamp(Math.floor(Number(safetyBounds.y || 0)), 0, height);
      const sr = clamp(Math.ceil(sx + Number(safetyBounds.width || 0)), 0, width);
      const sb = clamp(Math.ceil(sy + Number(safetyBounds.height || 0)), 0, height);
      if (sr > sx && sb > sy) {
        minX = Math.min(minX, sx);
        minY = Math.min(minY, sy);
        maxX = Math.max(maxX, sr);
        maxY = Math.max(maxY, sb);
      }
    }

    if (maxX <= minX || maxY <= minY) return null;

    const padding = clamp(Math.round(Number(options.padding || 56)), 24, 140);
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(width, maxX + padding);
    maxY = Math.min(height, maxY + padding);

    const cropWidth = Math.max(1, maxX - minX);
    const cropHeight = Math.max(1, maxY - minY);
    const areaRatio = (cropWidth * cropHeight) / (width * height);
    if (areaRatio >= 0.90 || cropWidth < 160 || cropHeight < 160) return null;

    return {
      x: minX,
      y: minY,
      width: cropWidth,
      height: cropHeight,
      areaRatio
    };
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

  function clearSelectableTextLayer(record) {
    if (!record) return;
    record.textLayerGeneration = Number(record.textLayerGeneration || 0) + 1;
    try { record.textLayerInstance?.cancel?.(); } catch (_) {}
    record.textLayerInstance = null;
    record.textLayerPromise = null;
    record.textLayer?.replaceChildren?.();
    record.container?.removeAttribute?.('data-selectable-text');
  }

  async function renderSelectableTextLayer(session, record, page, viewport, generation) {
    if (!record?.textLayer || !page || !viewport || !isCurrentSession(session)) return false;
    if (generation !== session.generation) return false;

    const TextLayer = session.pdfjs?.TextLayer;
    if (typeof TextLayer !== 'function') {
      record.container.dataset.selectableText = 'unsupported';
      return false;
    }

    clearSelectableTextLayer(record);
    const textGeneration = record.textLayerGeneration;
    const layerNode = record.textLayer;
    layerNode.style.setProperty('--scale-factor', String(viewport.scale || 1));
    layerNode.style.setProperty('--total-scale-factor', String(viewport.scale || 1));
    layerNode.style.setProperty('--scale-round-x', '1px');
    layerNode.style.setProperty('--scale-round-y', '1px');

    try {
      const textContentSource = typeof page.streamTextContent === 'function'
        ? page.streamTextContent({ includeMarkedContent: true, disableNormalization: false })
        : await page.getTextContent({ includeMarkedContent: true, disableNormalization: false });

      if (
        !isCurrentSession(session)
        || generation !== session.generation
        || textGeneration !== record.textLayerGeneration
      ) return false;

      const textLayer = new TextLayer({
        textContentSource,
        container: layerNode,
        viewport
      });
      record.textLayerInstance = textLayer;
      const promise = textLayer.render();
      record.textLayerPromise = promise;
      await promise;

      if (
        !isCurrentSession(session)
        || generation !== session.generation
        || textGeneration !== record.textLayerGeneration
        || record.textLayerInstance !== textLayer
      ) return false;

      const hasText = Array.isArray(textLayer.textDivs)
        && textLayer.textDivs.some((node) => String(node?.textContent || '').trim());
      record.container.dataset.selectableText = hasText ? 'true' : 'false';
      return hasText;
    } catch (error) {
      const stale = !isCurrentSession(session)
        || generation !== session.generation
        || textGeneration !== record.textLayerGeneration;
      if (!stale && error?.name !== 'AbortException') {
        record.container.dataset.selectableText = 'error';
      }
      return false;
    } finally {
      if (textGeneration === record.textLayerGeneration) {
        record.textLayerPromise = null;
      }
    }
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
    clearSelectableTextLayer(record);
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
    if (session.drawHandlers) {
      for (const [type, handler] of Object.entries(session.drawHandlers)) {
        try { session.pagesRoot?.removeEventListener(type, handler, type === 'pointerdown'); } catch (_) {}
      }
      session.drawHandlers = null;
    }
    if (session.drawWindowHandlers) {
      for (const [type, handler] of Object.entries(session.drawWindowHandlers)) {
        try { window.removeEventListener(type, handler, true); } catch (_) {}
      }
      session.drawWindowHandlers = null;
    }
    if (session.cropHandlers) {
      for (const [type, handler] of Object.entries(session.cropHandlers)) {
        try { session.pagesRoot?.removeEventListener(type, handler, type === 'pointerdown'); } catch (_) {}
      }
      session.cropHandlers = null;
    }
    if (session.cropWindowHandlers) {
      for (const [type, handler] of Object.entries(session.cropWindowHandlers)) {
        try { window.removeEventListener(type, handler, true); } catch (_) {}
      }
      session.cropWindowHandlers = null;
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

    const textLayer = document.createElement('div');
    textLayer.className = 'portal-pdf-text-layer';
    textLayer.dataset.pageNumber = String(pageNumber);
    textLayer.setAttribute('aria-label', `Texto selecionável da página ${pageNumber}`);

    const loading = document.createElement('div');
    loading.className = 'portal-pdf-page-loading';
    loading.textContent = 'Carregando página…';

    const drawLayer = document.createElement('div');
    drawLayer.className = 'portal-pdf-draw-layer';
    drawLayer.dataset.pageNumber = String(pageNumber);
    drawLayer.setAttribute('aria-label', `Desenhos da página ${pageNumber}`);

    const objectLayer = document.createElement('div');
    objectLayer.className = 'portal-pdf-object-layer';
    objectLayer.dataset.pageNumber = String(pageNumber);
    objectLayer.setAttribute('aria-label', `Objetos da página ${pageNumber}`);

    const cropLayer = document.createElement('div');
    cropLayer.className = 'portal-pdf-crop-layer';
    cropLayer.dataset.pageNumber = String(pageNumber);
    cropLayer.setAttribute('aria-label', `Recorte da página ${pageNumber}`);

    article.append(badge, canvas, textLayer, loading, drawLayer, objectLayer, cropLayer);
    session.pagesRoot.appendChild(article);

    const record = {
      pageNumber,
      container: article,
      canvas,
      textLayer,
      textLayerInstance: null,
      textLayerPromise: null,
      textLayerGeneration: 0,
      loading,
      drawLayer,
      objectLayer,
      cropLayer,
      page: null,
      renderTask: null,
      pendingScale: 0,
      pendingGeneration: 0,
      renderedScale: 0,
      renderGeneration: 0,
      fullPageWidth: 0,
      fullPageHeight: 0
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

  function normalizeCropRect(value, fallback = null) {
    if (!value || typeof value !== 'object') return fallback;
    const minSize = 0.04;
    let x = clamp01(value.x, 0);
    let y = clamp01(value.y, 0);
    let width = Number(value.width);
    let height = Number(value.height);
    if (!Number.isFinite(width) || !Number.isFinite(height)) return fallback;
    width = Math.min(1, Math.max(minSize, width));
    height = Math.min(1, Math.max(minSize, height));
    x = Math.min(1 - width, Math.max(0, x));
    y = Math.min(1 - height, Math.max(0, y));
    return { x, y, width, height };
  }

  function cropEntryForPage(session, pageNumber) {
    return (session.editorCrops || []).find((item) => Number(item.displayPage) === Number(pageNumber)) || null;
  }

  function fullCropRect() {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  function cropRectsEqual(a, b) {
    const left = normalizeCropRect(a);
    const right = normalizeCropRect(b);
    if (!left || !right) return !left && !right;
    return ['x', 'y', 'width', 'height'].every((key) => Math.abs(left[key] - right[key]) < 0.000001);
  }

  function cropDraftForPage(session, pageNumber) {
    return normalizeCropRect(session?.cropDrafts?.get?.(Number(pageNumber)));
  }

  function setCropDraft(session, pageNumber, crop) {
    if (!session?.cropDrafts) session.cropDrafts = new Map();
    const normalized = normalizeCropRect(crop);
    if (normalized) session.cropDrafts.set(Number(pageNumber), { ...normalized });
    else session.cropDrafts.delete(Number(pageNumber));
    return normalized;
  }

  function clearCropDraft(session, pageNumber) {
    session?.cropDrafts?.delete?.(Number(pageNumber));
  }

  function applyPageCropViewport(record, crop) {
    if (!record?.container || !record.canvas || !record.textLayer || !record.objectLayer || !record.drawLayer) return;
    const fullWidth = Math.max(1, Number(record.fullPageWidth || 0));
    const fullHeight = Math.max(1, Number(record.fullPageHeight || 0));
    const rect = normalizeCropRect(crop);

    const resetContent = (element, { canvas = false } = {}) => {
      if (!element) return;
      element.style.removeProperty('position');
      element.style.removeProperty('inset');
      element.style.removeProperty('left');
      element.style.removeProperty('top');
      element.style.removeProperty('right');
      element.style.removeProperty('bottom');
      if (canvas) {
        element.style.width = '100%';
        element.style.height = '100%';
      } else {
        element.style.removeProperty('width');
        element.style.removeProperty('height');
      }
    };

    if (!rect || !(record.fullPageWidth > 0) || !(record.fullPageHeight > 0)) {
      record.container.dataset.cropApplied = 'false';
      if (record.fullPageWidth > 0) record.container.style.setProperty('--page-width', `${Math.ceil(fullWidth)}px`);
      if (record.fullPageWidth > 0 && record.fullPageHeight > 0) {
        record.container.style.aspectRatio = `${fullWidth} / ${fullHeight}`;
      }
      resetContent(record.canvas, { canvas: true });
      resetContent(record.textLayer);
      resetContent(record.drawLayer);
      resetContent(record.objectLayer);
      return;
    }

    record.container.dataset.cropApplied = 'true';
    record.container.style.setProperty('--page-width', `${Math.max(1, Math.ceil(fullWidth * rect.width))}px`);
    record.container.style.aspectRatio = `${Math.max(1, fullWidth * rect.width)} / ${Math.max(1, fullHeight * rect.height)}`;

    const left = -(rect.x / rect.width) * 100;
    const top = -(rect.y / rect.height) * 100;
    const width = 100 / rect.width;
    const height = 100 / rect.height;

    for (const element of [record.canvas, record.textLayer, record.drawLayer, record.objectLayer]) {
      element.style.position = 'absolute';
      element.style.inset = 'auto';
      element.style.left = `${left}%`;
      element.style.top = `${top}%`;
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.width = `${width}%`;
      element.style.height = `${height}%`;
    }
  }

  function applyCropGeometry(element, crop) {
    const rect = normalizeCropRect(crop, fullCropRect());
    element.style.left = `${rect.x * 100}%`;
    element.style.top = `${rect.y * 100}%`;
    element.style.width = `${rect.width * 100}%`;
    element.style.height = `${rect.height * 100}%`;
    element.dataset.cropX = String(rect.x);
    element.dataset.cropY = String(rect.y);
    element.dataset.cropWidth = String(rect.width);
    element.dataset.cropHeight = String(rect.height);
    element.classList.toggle('actions-above', rect.y + rect.height > 0.84);
  }

  function cropRectFromElement(element) {
    return normalizeCropRect({
      x: Number(element?.dataset?.cropX),
      y: Number(element?.dataset?.cropY),
      width: Number(element?.dataset?.cropWidth),
      height: Number(element?.dataset?.cropHeight)
    }, fullCropRect());
  }

  function bindCropActionButton(button, action) {
    const invoke = (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      action();
    };
    // Direct pointer handling makes the actions reliable on touch even when
    // the parent crop layer uses touch-action:none for resize gestures.
    button.addEventListener('pointerup', (event) => {
      if (event.pointerType === 'touch') invoke(event);
    });
    button.addEventListener('click', invoke);
  }

  function confirmCropDraft(session, pageNumber) {
    const draft = cropDraftForPage(session, pageNumber);
    if (!(pageNumber > 0) || !draft) return false;
    const entry = cropEntryForPage(session, pageNumber);
    const committed = normalizeCropRect(entry?.crop);
    clearCropDraft(session, pageNumber);
    session.root.dataset.cropGesture = '';
    session.root.dataset.cropGestureMoved = 'false';

    if (!cropRectsEqual(committed, draft)) {
      if (entry) entry.crop = { ...draft };
      session.onCropConfirm?.(pageNumber - 1, { ...draft });
    }
    renderCropForPage(session, pageNumber);
    session.root.dataset.cropCount = String((session.editorCrops || []).filter((item) => normalizeCropRect(item.crop)).length);
    session.root.dataset.cropDraftCount = String(session.cropDrafts?.size || 0);
    return true;
  }

  function cancelCropDraft(session, pageNumber) {
    if (!(pageNumber > 0) || !cropDraftForPage(session, pageNumber)) return false;
    clearCropDraft(session, pageNumber);
    session.root.dataset.cropGesture = '';
    session.root.dataset.cropGestureMoved = 'false';
    renderCropForPage(session, pageNumber);
    session.root.dataset.cropDraftCount = String(session.cropDrafts?.size || 0);
    return true;
  }

  function adjustConfirmedCrop(session, pageNumber) {
    const entry = cropEntryForPage(session, pageNumber);
    const committed = normalizeCropRect(entry?.crop);
    if (!(pageNumber > 0) || !committed) return false;
    setCropDraft(session, pageNumber, committed);
    renderCropForPage(session, pageNumber);
    session.root.dataset.cropDraftCount = String(session.cropDrafts?.size || 0);
    return true;
  }

  function resetConfirmedCrop(session, pageNumber) {
    if (!(pageNumber > 0)) return false;
    const entry = cropEntryForPage(session, pageNumber);
    if (!normalizeCropRect(entry?.crop)) return false;
    if (entry) entry.crop = null;
    clearCropDraft(session, pageNumber);
    session.root.dataset.cropGesture = '';
    session.root.dataset.cropGestureMoved = 'false';
    session.onCropReset?.(pageNumber - 1);
    renderCropForPage(session, pageNumber);
    session.root.dataset.cropCount = String((session.editorCrops || []).filter((item) => normalizeCropRect(item.crop)).length);
    session.root.dataset.cropDraftCount = String(session.cropDrafts?.size || 0);
    return true;
  }

  function createCropDraftActions(session, frame, pageNumber) {
    const actions = document.createElement('div');
    actions.className = 'portal-pdf-crop-actions';
    actions.dataset.cropActions = 'true';

    const confirm = document.createElement('button');
    confirm.type = 'button';
    confirm.className = 'portal-pdf-crop-action portal-pdf-crop-action--confirm';
    confirm.dataset.cropConfirm = 'true';
    confirm.setAttribute('aria-label', `Confirmar recorte da página ${pageNumber}`);
    confirm.textContent = 'Confirmar recorte';
    bindCropActionButton(confirm, () => confirmCropDraft(session, pageNumber));

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'portal-pdf-crop-action portal-pdf-crop-action--cancel';
    cancel.dataset.cropCancel = 'true';
    cancel.setAttribute('aria-label', `Cancelar seleção de recorte da página ${pageNumber}`);
    cancel.textContent = 'Cancelar';
    bindCropActionButton(cancel, () => cancelCropDraft(session, pageNumber));

    actions.append(confirm, cancel);
    frame.appendChild(actions);
  }

  function createConfirmedCropActions(session, layer, pageNumber) {
    const actions = document.createElement('div');
    actions.className = 'portal-pdf-crop-confirmed-actions';

    const adjust = document.createElement('button');
    adjust.type = 'button';
    adjust.className = 'portal-pdf-crop-confirmed-action';
    adjust.dataset.cropAdjust = 'true';
    adjust.title = 'Ajustar recorte';
    adjust.setAttribute('aria-label', `Ajustar recorte da página ${pageNumber}`);
    adjust.textContent = 'Ajustar';
    bindCropActionButton(adjust, () => adjustConfirmedCrop(session, pageNumber));

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'portal-pdf-crop-confirmed-action portal-pdf-crop-confirmed-action--reset';
    reset.dataset.cropReset = 'true';
    reset.title = 'Remover recorte desta página';
    reset.setAttribute('aria-label', `Remover recorte da página ${pageNumber}`);
    reset.textContent = '↺';
    bindCropActionButton(reset, () => resetConfirmedCrop(session, pageNumber));

    actions.append(adjust, reset);
    layer.appendChild(actions);
  }

  function renderCropForPage(session, pageNumber) {
    const record = session.pages.get(Number(pageNumber));
    const layer = record?.cropLayer;
    if (!layer) return;
    layer.replaceChildren();

    const entry = cropEntryForPage(session, pageNumber);
    const committed = normalizeCropRect(entry?.crop);
    const draft = cropDraftForPage(session, pageNumber);
    const interactive = String(session.cropMode || 'none') === 'crop';
    const editingDraft = interactive && Boolean(draft);

    layer.dataset.cropMode = interactive ? 'crop' : 'none';
    layer.dataset.hasCrop = committed ? 'true' : 'false';
    layer.dataset.hasDraft = draft ? 'true' : 'false';
    layer.dataset.awaitingSelection = interactive && !committed && !draft ? 'true' : 'false';

    applyPageCropViewport(record, editingDraft ? null : committed);

    if (draft) {
      const frame = document.createElement('div');
      frame.className = 'portal-pdf-crop-frame';
      frame.dataset.cropFrame = 'true';
      frame.dataset.pageNumber = String(pageNumber);
      frame.dataset.interactive = interactive ? 'true' : 'false';
      frame.dataset.committed = 'false';
      frame.tabIndex = interactive ? 0 : -1;
      frame.setAttribute('aria-label', `Seleção provisória de recorte da página ${pageNumber}`);
      applyCropGeometry(frame, draft);

      if (interactive) {
        for (const handle of ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']) {
          const node = document.createElement('span');
          node.className = `portal-pdf-crop-handle portal-pdf-crop-handle--${handle}`;
          node.dataset.cropResize = handle;
          node.setAttribute('aria-hidden', 'true');
          frame.appendChild(node);
        }
        createCropDraftActions(session, frame, pageNumber);
      }
      layer.appendChild(frame);
      return;
    }

    if (committed && interactive) createConfirmedCropActions(session, layer, pageNumber);
  }

  function renderEditorCrops(session) {
    if (!isCurrentSession(session)) return false;
    for (let pageNumber = 1; pageNumber <= (session.document?.numPages || 0); pageNumber += 1) {
      renderCropForPage(session, pageNumber);
    }
    session.root.dataset.cropMode = String(session.cropMode || 'none');
    session.root.dataset.cropCount = String((session.editorCrops || []).filter((item) => normalizeCropRect(item.crop)).length);
    session.root.dataset.cropDraftCount = String(session.cropDrafts?.size || 0);
    return true;
  }

  function installCropHandlers(session) {
    if (session.cropHandlers) return;
    const pagesRoot = session.pagesRoot;

    const pointerdown = (event) => {
      if (!isCurrentSession(session) || session.organizerMode || String(session.cropMode || '') !== 'crop') return;
      if (event.target.closest?.('[data-crop-actions], [data-crop-reset], [data-crop-adjust]')) return;

      const frame = event.target.closest?.('[data-crop-frame]');
      const layer = frame?.closest('.portal-pdf-crop-layer') || event.target.closest?.('.portal-pdf-crop-layer');
      if (!layer) return;

      const pageNumber = Number(frame?.dataset?.pageNumber || layer.dataset.pageNumber);
      if (!(pageNumber > 0)) return;
      const entry = cropEntryForPage(session, pageNumber);
      const committed = normalizeCropRect(entry?.crop);
      const draft = cropDraftForPage(session, pageNumber);
      if (!frame && (committed || draft)) return;

      const rect = layer.getBoundingClientRect();
      if (!(rect.width > 0) || !(rect.height > 0)) return;
      event.preventDefault();
      event.stopPropagation();

      const handle = frame ? (event.target.closest?.('[data-crop-resize]')?.dataset?.cropResize || '') : '';
      const startPoint = {
        x: clamp01((event.clientX - rect.left) / Math.max(1, rect.width), 0),
        y: clamp01((event.clientY - rect.top) / Math.max(1, rect.height), 0)
      };
      session.cropDrag = {
        pointerId: event.pointerId,
        origin: event.target,
        pageNumber,
        pageIndex: pageNumber - 1,
        handle,
        kind: frame ? (handle ? 'resize' : 'move') : 'create',
        startX: event.clientX,
        startY: event.clientY,
        layerLeft: rect.left,
        layerTop: rect.top,
        layerWidth: Math.max(1, rect.width),
        layerHeight: Math.max(1, rect.height),
        startPoint,
        start: frame ? cropRectFromElement(frame) : null,
        changed: false
      };
      try { event.target.setPointerCapture?.(event.pointerId); } catch (_) {}
      session.root.dataset.cropGesture = session.cropDrag.kind;
      session.root.dataset.cropGestureMoved = 'false';
    };

    const pointermove = (event) => {
      const drag = session.cropDrag;
      if (!drag || !isCurrentSession(session) || (event.pointerId != null && drag.pointerId !== event.pointerId)) return;
      event.preventDefault();
      const minSize = 0.04;
      let crop = null;

      if (drag.kind === 'create') {
        const currentX = clamp01((event.clientX - drag.layerLeft) / drag.layerWidth, drag.startPoint.x);
        const currentY = clamp01((event.clientY - drag.layerTop) / drag.layerHeight, drag.startPoint.y);
        const x = Math.min(drag.startPoint.x, currentX);
        const y = Math.min(drag.startPoint.y, currentY);
        const width = Math.abs(currentX - drag.startPoint.x);
        const height = Math.abs(currentY - drag.startPoint.y);
        if (width < minSize || height < minSize) return;
        crop = normalizeCropRect({ x, y, width, height });
      } else {
        const dx = (event.clientX - drag.startX) / drag.layerWidth;
        const dy = (event.clientY - drag.startY) / drag.layerHeight;
        let { x, y, width, height } = drag.start;
        if (drag.kind === 'move') {
          x = Math.min(1 - width, Math.max(0, x + dx));
          y = Math.min(1 - height, Math.max(0, y + dy));
        } else {
          if (drag.handle.includes('e')) width = Math.max(minSize, Math.min(1 - x, drag.start.width + dx));
          if (drag.handle.includes('s')) height = Math.max(minSize, Math.min(1 - y, drag.start.height + dy));
          if (drag.handle.includes('w')) {
            const right = drag.start.x + drag.start.width;
            x = Math.max(0, Math.min(right - minSize, drag.start.x + dx));
            width = right - x;
          }
          if (drag.handle.includes('n')) {
            const bottom = drag.start.y + drag.start.height;
            y = Math.max(0, Math.min(bottom - minSize, drag.start.y + dy));
            height = bottom - y;
          }
        }
        crop = normalizeCropRect({ x, y, width, height }, drag.start);
      }

      if (!crop) return;
      const wasDraft = Boolean(cropDraftForPage(session, drag.pageNumber));
      setCropDraft(session, drag.pageNumber, crop);
      drag.changed = true;
      session.root.dataset.cropGestureMoved = 'true';
      session.root.dataset.cropDraftCount = String(session.cropDrafts?.size || 0);

      let frame = pagesRoot.querySelector(`.portal-pdf-crop-frame[data-page-number="${drag.pageNumber}"]`);
      if (!frame || !wasDraft) {
        renderCropForPage(session, drag.pageNumber);
        frame = pagesRoot.querySelector(`.portal-pdf-crop-frame[data-page-number="${drag.pageNumber}"]`);
      }
      if (frame) applyCropGeometry(frame, crop);
    };

    const finish = (event) => {
      const drag = session.cropDrag;
      if (!drag || (event.pointerId != null && drag.pointerId !== event.pointerId)) return;
      try { drag.origin?.releasePointerCapture?.(drag.pointerId); } catch (_) {}
      session.cropDrag = null;
      session.root.dataset.cropGesture = '';
      session.root.dataset.cropGestureMoved = drag.changed ? 'true' : 'false';
      if (drag.changed) renderCropForPage(session, drag.pageNumber);
    };

    session.cropHandlers = { pointerdown };
    for (const [type, handler] of Object.entries(session.cropHandlers)) {
      pagesRoot.addEventListener(type, handler, type === 'pointerdown');
    }
    session.cropWindowHandlers = { pointermove, pointerup: finish, pointercancel: finish };
    for (const [type, handler] of Object.entries(session.cropWindowHandlers)) {
      window.addEventListener(type, handler, { capture: true, passive: type !== 'pointermove' });
    }
  }

  function setEditorCrops(crops = [], options = {}) {
    const session = active;
    if (!session || session.closed) return false;
    session.editorCrops = Array.isArray(crops)
      ? crops.map((item) => ({ ...item, crop: normalizeCropRect(item?.crop) }))
      : [];
    const nextMode = String(options.mode || 'none') === 'crop' ? 'crop' : 'none';
    session.cropMode = nextMode;
    if (!session.cropDrafts) session.cropDrafts = new Map();
    if (nextMode !== 'crop') session.cropDrafts.clear();
    session.onCropConfirm = typeof options.onConfirm === 'function' ? options.onConfirm : session.onCropConfirm;
    session.onCropReset = typeof options.onReset === 'function' ? options.onReset : session.onCropReset;
    installCropHandlers(session);
    return renderEditorCrops(session);
  }

  function normalizeObjectColor(value, fallback = '#111111') {
    const color = String(value || '').trim().toLowerCase();
    return /^#[0-9a-f]{6}$/.test(color) ? color : fallback;
  }

  function normalizeEditorStroke(stroke) {
    const points = Array.isArray(stroke?.points)
      ? stroke.points.map((point) => ({ x: clamp01(point?.x), y: clamp01(point?.y) }))
        .filter((point, index, source) => !index || Math.abs(point.x - source[index - 1].x) > 0.00001 || Math.abs(point.y - source[index - 1].y) > 0.00001)
      : [];
    if (!stroke?.id || !(Number(stroke?.displayPage) > 0) || !points.length) return null;
    return {
      ...stroke,
      id: String(stroke.id),
      displayPage: Number(stroke.displayPage),
      color: normalizeObjectColor(stroke.color, '#111111'),
      width: Math.min(0.05, Math.max(0.001, Number(stroke.width) || 0.006)),
      points
    };
  }

  function strokePathData(points) {
    const normalized = Array.isArray(points) ? points : [];
    if (!normalized.length) return '';
    return normalized.map((point, index) => {
      const x = Math.round(clamp01(point.x) * 1000);
      const y = Math.round(clamp01(point.y) * 1000);
      return `${index ? 'L' : 'M'} ${x} ${y}`;
    }).join(' ');
  }

  function createStrokeSvg(layer) {
    let svg = layer?.querySelector?.('.portal-pdf-draw-svg');
    if (svg) return svg;
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('portal-pdf-draw-svg');
    svg.setAttribute('viewBox', '0 0 1000 1000');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    layer?.appendChild(svg);
    return svg;
  }

  function createStrokePath(svg, stroke, className = '') {
    if (!svg || !stroke) return null;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('portal-pdf-draw-path');
    if (className) path.classList.add(className);
    if (stroke.id) path.dataset.strokeId = String(stroke.id);
    path.setAttribute('d', strokePathData(stroke.points));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', normalizeObjectColor(stroke.color, '#111111'));
    path.setAttribute('stroke-width', String(Math.max(1, Number(stroke.width || 0.006) * 1000)));
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    return path;
  }

  function renderEditorStrokesForPage(session, pageNumber) {
    const record = session.pages.get(Number(pageNumber));
    const layer = record?.drawLayer;
    if (!layer) return;
    const mode = String(session.drawMode || 'none');
    layer.dataset.drawMode = mode;
    layer.replaceChildren();
    const svg = createStrokeSvg(layer);
    for (const stroke of session.editorStrokes || []) {
      if (Number(stroke.displayPage) !== Number(pageNumber)) continue;
      const path = createStrokePath(svg, stroke);
      if (path && session.eraseHits?.has?.(stroke.id)) path.classList.add('is-erasing');
    }
  }

  function renderEditorStrokes(session) {
    if (!isCurrentSession(session)) return false;
    const pageCount = session.document?.numPages || 0;
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      renderEditorStrokesForPage(session, pageNumber);
    }
    session.root.dataset.drawMode = String(session.drawMode || 'none');
    session.root.dataset.strokeCount = String((session.editorStrokes || []).length);
    return true;
  }

  function normalizedPointInLayer(layer, clientX, clientY) {
    const rect = layer?.getBoundingClientRect?.();
    if (!rect || !(rect.width > 0) || !(rect.height > 0)) return null;
    return {
      x: clamp01((clientX - rect.left) / rect.width),
      y: clamp01((clientY - rect.top) / rect.height),
      rect
    };
  }

  function pointSegmentDistance(point, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9) return Math.hypot(point.x - a.x, point.y - a.y);
    const t = Math.max(0, Math.min(1, (((point.x - a.x) * dx) + ((point.y - a.y) * dy)) / ((dx * dx) + (dy * dy))));
    const px = a.x + (t * dx);
    const py = a.y + (t * dy);
    return Math.hypot(point.x - px, point.y - py);
  }

  function strokeHitsPoint(stroke, point, radius) {
    const points = Array.isArray(stroke?.points) ? stroke.points : [];
    if (!points.length) return false;
    const threshold = Math.max(radius, Number(stroke.width || 0.006) * 0.7);
    if (points.length === 1) return Math.hypot(point.x - points[0].x, point.y - points[0].y) <= threshold;
    for (let index = 1; index < points.length; index += 1) {
      if (pointSegmentDistance(point, points[index - 1], points[index]) <= threshold) return true;
    }
    return false;
  }

  function markEraseHits(session, pageNumber, point) {
    const radius = Math.max(0.012, Number(session.drawWidth || 0.006) * 2.4);
    let changed = false;
    for (const stroke of session.editorStrokes || []) {
      if (Number(stroke.displayPage) !== Number(pageNumber) || session.eraseHits.has(stroke.id)) continue;
      if (!strokeHitsPoint(stroke, point, radius)) continue;
      session.eraseHits.add(stroke.id);
      changed = true;
    }
    if (changed) {
      const layer = session.pages.get(Number(pageNumber))?.drawLayer;
      for (const id of session.eraseHits) {
        layer?.querySelector?.(`[data-stroke-id="${CSS.escape(id)}"]`)?.classList.add('is-erasing');
      }
    }
    return changed;
  }

  function installDrawHandlers(session) {
    if (session.drawHandlers) return;
    const pagesRoot = session.pagesRoot;

    const pointerdown = (event) => {
      if (!isCurrentSession(session) || session.organizerMode || !['draw', 'erase'].includes(String(session.drawMode || 'none'))) return;
      const layer = event.target.closest?.('.portal-pdf-draw-layer');
      if (!layer) return;
      const pageNumber = Number(layer.dataset.pageNumber || 0);
      const point = normalizedPointInLayer(layer, event.clientX, event.clientY);
      if (!(pageNumber > 0) || !point) return;
      event.preventDefault();
      event.stopPropagation();

      session.eraseHits = new Set();
      session.drawGesture = {
        pointerId: event.pointerId,
        origin: event.target,
        pageNumber,
        pageIndex: pageNumber - 1,
        kind: session.drawMode,
        points: [{ x: point.x, y: point.y }],
        path: null
      };

      if (session.drawMode === 'draw') {
        const svg = createStrokeSvg(layer);
        session.drawGesture.path = createStrokePath(svg, {
          id: '',
          color: session.drawColor,
          width: session.drawWidth,
          points: session.drawGesture.points
        }, 'is-draft');
      } else {
        markEraseHits(session, pageNumber, point);
      }

      try { event.target.setPointerCapture?.(event.pointerId); } catch (_) {}
      session.root.dataset.drawGesture = session.drawMode;
    };

    const pointermove = (event) => {
      const gesture = session.drawGesture;
      if (!gesture || !isCurrentSession(session) || (event.pointerId != null && gesture.pointerId !== event.pointerId)) return;
      const layer = session.pages.get(Number(gesture.pageNumber))?.drawLayer;
      const point = normalizedPointInLayer(layer, event.clientX, event.clientY);
      if (!point) return;
      event.preventDefault();

      const previous = gesture.points[gesture.points.length - 1];
      if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) < 0.0015) return;
      gesture.points.push({ x: point.x, y: point.y });
      if (gesture.points.length > 12000) gesture.points.shift();

      if (gesture.kind === 'draw') {
        gesture.path?.setAttribute?.('d', strokePathData(gesture.points));
      } else {
        if (previous) {
          markEraseHits(session, gesture.pageNumber, {
            x: (previous.x + point.x) / 2,
            y: (previous.y + point.y) / 2
          });
        }
        markEraseHits(session, gesture.pageNumber, point);
      }
    };

    const finish = (event) => {
      const gesture = session.drawGesture;
      if (!gesture || (event.pointerId != null && gesture.pointerId !== event.pointerId)) return;
      try { gesture.origin?.releasePointerCapture?.(gesture.pointerId); } catch (_) {}
      session.drawGesture = null;
      session.root.dataset.drawGesture = '';

      if (gesture.kind === 'draw') {
        gesture.path?.remove?.();
        if (gesture.points.length) {
          session.onStrokeCommit?.(gesture.pageIndex, {
            color: session.drawColor,
            width: session.drawWidth,
            points: gesture.points.map((point) => ({ ...point }))
          });
        }
      } else {
        const ids = [...session.eraseHits];
        session.eraseHits.clear();
        if (ids.length) session.onEraseCommit?.(ids);
        else renderEditorStrokesForPage(session, gesture.pageNumber);
      }
    };

    session.drawHandlers = { pointerdown };
    pagesRoot.addEventListener('pointerdown', pointerdown, true);
    session.drawWindowHandlers = { pointermove, pointerup: finish, pointercancel: finish };
    for (const [type, handler] of Object.entries(session.drawWindowHandlers)) {
      window.addEventListener(type, handler, { capture: true, passive: type !== 'pointermove' });
    }
  }

  function setEditorStrokes(strokes = [], options = {}) {
    const session = active;
    if (!session || session.closed) return false;
    session.editorStrokes = Array.isArray(strokes)
      ? strokes.map(normalizeEditorStroke).filter(Boolean)
      : [];
    const requestedMode = String(options.mode || 'none');
    session.drawMode = ['draw', 'erase'].includes(requestedMode) ? requestedMode : 'none';
    session.drawColor = normalizeObjectColor(options.color, session.drawColor || '#111111');
    session.drawWidth = Math.min(0.05, Math.max(0.001, Number(options.width) || session.drawWidth || 0.006));
    session.onStrokeCommit = typeof options.onStrokeCommit === 'function' ? options.onStrokeCommit : session.onStrokeCommit;
    session.onEraseCommit = typeof options.onEraseCommit === 'function' ? options.onEraseCommit : session.onEraseCommit;
    if (session.drawMode === 'none') {
      session.drawGesture = null;
      session.eraseHits?.clear?.();
    }
    installDrawHandlers(session);
    return renderEditorStrokes(session);
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
      planeDrag = {
        pointerId: event.pointerId,
        startColor: normalizeObjectColor(object.color)
      };
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
    plane.addEventListener('pointercancel', (event) => {
      if (!planeDrag || (event.pointerId != null && planeDrag.pointerId !== event.pointerId)) return;
      const startColor = normalizeObjectColor(planeDrag.startColor, normalizeObjectColor(object.color));
      planeDrag = null;
      syncCustomColorPanel(customPanel, startColor);
      previewQuickbarColor(session, element, object, startColor);
      try { plane.releasePointerCapture?.(event.pointerId); } catch (_) {}
    });

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
      applyObjectGeometry(element, object, record.fullPageWidth || record.container.clientWidth || 760);

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
    const width = record.fullPageWidth || record.container.clientWidth || 760;
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
        if (!targetPage) return;

        const width = Math.max(0.035, Number(object.width) || 0.2);
        const height = Math.max(0.025, Number(object.height) || 0.08);
        const x = Math.min(1 - width, Math.max(0,
          ((event.clientX - targetPage.rect.left) / Math.max(1, targetPage.rect.width)) - (width / 2)
        ));
        const y = Math.min(1 - height, Math.max(0,
          ((event.clientY - targetPage.rect.top) / Math.max(1, targetPage.rect.height)) - (height / 2)
        ));
        const pageChanged = targetPage.pageNumber !== drag.currentPageNumber;
        const positionChanged = Math.abs(Number(object.x) - x) > 0.00001 || Math.abs(Number(object.y) - y) > 0.00001;
        if (!pageChanged && !positionChanged) return;

        object.displayPage = targetPage.pageNumber;
        object.pageIndex = targetPage.pageNumber - 1;
        object.x = x;
        object.y = y;
        drag.currentPageNumber = targetPage.pageNumber;
        drag.changed = true;
        session.root.dataset.objectGestureMoved = 'true';

        if (pageChanged) {
          session.onObjectPageChange?.(drag.id, targetPage.pageNumber - 1, { x, y });
          renderEditorObjects(session);
          markSelectedObject(session, drag.id);
        } else {
          session.onObjectChange?.(drag.id, { x, y });
          const movingElement = pagesRoot.querySelector(`.portal-pdf-object[data-object-id="${CSS.escape(drag.id)}"]`);
          if (movingElement) applyObjectGeometry(
            movingElement,
            object,
            movingElement.closest('.portal-pdf-page')?.clientWidth || 760
          );
        }
        return;
      }

      const screenDx = event.clientX - drag.startX;
      const screenDy = event.clientY - drag.startY;
      const dx = screenDx / drag.layerWidth;
      const dy = screenDy / drag.layerHeight;
      const theta = (Number(drag.start.rotation || 0) * Math.PI) / 180;
      const localDx = ((Math.cos(theta) * screenDx) + (Math.sin(theta) * screenDy)) / drag.layerWidth;
      const localDy = ((-Math.sin(theta) * screenDx) + (Math.cos(theta) * screenDy)) / drag.layerHeight;
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
        if (drag.handle.includes('e')) width = drag.start.width + localDx;
        if (drag.handle.includes('s')) height = drag.start.height + localDy;
        if (drag.handle.includes('w')) {
          x = drag.start.x + localDx;
          width = drag.start.width - localDx;
        }
        if (drag.handle.includes('n')) {
          y = drag.start.y + localDy;
          height = drag.start.height - localDy;
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

    record.fullPageWidth = viewport.width;
    record.fullPageHeight = viewport.height;
    record.container.style.setProperty('--page-width', `${Math.ceil(viewport.width)}px`);
    record.container.style.aspectRatio = `${Math.max(1, viewport.width)} / ${Math.max(1, viewport.height)}`;
    record.canvas.width = pixelWidth;
    record.canvas.height = pixelHeight;
    record.canvas.style.width = '100%';
    record.canvas.style.height = '100%';
    const cropEntry = cropEntryForPage(session, pageNumber);
    const cropDraft = cropDraftForPage(session, pageNumber);
    applyPageCropViewport(record, String(session.cropMode || 'none') === 'crop' && cropDraft ? null : cropEntry?.crop);

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
    renderSelectableTextLayer(session, record, page, viewport, generation).catch(() => {});
    if (session.editorObjects?.length) refreshEditorObjectGeometryForPage(session, pageNumber);
    // Rendering/lazy-loading a page must not replace an active crop frame while
    // the user is touching or dragging one of its handles. setEditorCrops()
    // owns structural refreshes when the mode/model changes.
    if (
      (session.editorCrops?.length || session.cropMode === 'crop')
      && !record.cropLayer?.querySelector?.('[data-crop-frame]')
    ) {
      renderCropForPage(session, pageNumber);
    }

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

  function getPageCount() {
    const session = active;
    if (!session || session.closed) return 0;
    return Math.max(0, Number(session.document?.numPages || 0));
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
      pdfjs,
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
      editorStrokes: [],
      drawMode: 'none',
      drawColor: '#111111',
      drawWidth: 0.006,
      drawGesture: null,
      drawHandlers: null,
      drawWindowHandlers: null,
      eraseHits: new Set(),
      onStrokeCommit: null,
      onEraseCommit: null,
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
      editorCrops: [],
      cropDrafts: new Map(),
      cropMode: 'none',
      cropDrag: null,
      cropHandlers: null,
      cropWindowHandlers: null,
      onCropConfirm: null,
      onCropReset: null,
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
      const preserveFitScale = initialViewState?.fitMode === true;
      session.fitMode = preserveFitScale;

      let initialScale;
      if (preserveManualScale) {
        initialScale = clamp(requestedScale, MIN_SCALE, MAX_SCALE);
      } else if (preserveFitScale) {
        initialScale = await calculateFitScale(session);
      } else {
        // Abertura inicial: 114% enquadra melhor em desktop; em telas menores,
        // nunca ultrapassa a escala necessária para caber na largura disponível.
        const fitScale = await calculateFitScale(session);
        initialScale = clamp(Math.min(DEFAULT_INITIAL_SCALE, fitScale), MIN_SCALE, MAX_SCALE);
      }
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

  async function prewarmThumbnails(pageNumbers = []) {
    const session = active;
    if (!isCurrentSession(session) || !session.document) return 0;
    const requested = Array.isArray(pageNumbers) ? pageNumbers : [pageNumbers];
    const targets = [...new Set(
      requested
        .map((value) => Math.round(Number(value)))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= session.document.numPages)
    )].slice(0, 6);
    let prepared = 0;
    for (const pageNumber of targets) {
      if (!isCurrentSession(session)) break;
      const record = session.thumbs.get(pageNumber);
      if (!record) continue;
      const targetWidth = Number(session.thumbnailWidth || THUMB_WIDTH);
      if (record.rendered && record.renderedWidth === targetWidth) {
        prepared += 1;
        continue;
      }
      await renderThumbnail(session, pageNumber);
      if (!isCurrentSession(session)) break;
      if (record.rendered) prepared += 1;
    }
    return prepared;
  }

  async function exportPageImage(pageNumber, options = {}) {
    const session = active;
    if (!isCurrentSession(session) || !session.document) {
      throw new Error('Nenhum PDF ativo para preparar a página.');
    }

    const targetPage = Math.round(Number(pageNumber));
    if (!Number.isInteger(targetPage) || targetPage < 1 || targetPage > session.document.numPages) {
      throw new Error('Página inválida para a IA documental.');
    }

    const page = await getPage(session, targetPage);
    if (!page || !isCurrentSession(session)) {
      throw new Error('A página não está mais disponível.');
    }

    const baseViewport = page.getViewport({ scale: 1 });
    const requestedMaxEdge = clamp(Number(options.maxEdge || 1800), 800, 2200);
    let scale = clamp(
      requestedMaxEdge / Math.max(1, baseViewport.width, baseViewport.height),
      0.6,
      3
    );
    let viewport = page.getViewport({ scale });
    const pixels = Math.max(1, viewport.width * viewport.height);
    if (pixels > MAX_CANVAS_PIXELS) {
      scale *= Math.sqrt(MAX_CANVAS_PIXELS / pixels);
      viewport = page.getViewport({ scale });
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    const task = page.render({
      canvas,
      viewport,
      intent: 'display'
    });
    await task.promise;
    if (!isCurrentSession(session)) {
      canvas.width = 0;
      canvas.height = 0;
      throw new Error('O documento mudou durante a preparação da página.');
    }

    let outputCanvas = canvas;
    let croppedCanvas = null;
    if (options.cropWhitespace === true) {
      const safetyBounds = await pageTextSafetyBounds(page, viewport);
      const bounds = meaningfulContentBounds(canvas, options.cropOptions || {}, safetyBounds);
      if (bounds) {
        croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = bounds.width;
        croppedCanvas.height = bounds.height;
        const croppedContext = croppedCanvas.getContext('2d', { alpha: false });
        if (croppedContext) {
          croppedContext.fillStyle = '#ffffff';
          croppedContext.fillRect(0, 0, bounds.width, bounds.height);
          croppedContext.drawImage(
            canvas,
            bounds.x, bounds.y, bounds.width, bounds.height,
            0, 0, bounds.width, bounds.height
          );
          outputCanvas = croppedCanvas;
        }
      }
    }

    const mimeType = options.mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
    const quality = clamp(Number(options.quality || 0.9), 0.72, 0.95);
    const blob = await new Promise((resolve, reject) => {
      outputCanvas.toBlob((value) => {
        if (value instanceof Blob && value.size > 0) resolve(value);
        else reject(new Error('Não foi possível preparar a imagem da página.'));
      }, mimeType, mimeType === 'image/jpeg' ? quality : undefined);
    });

    if (croppedCanvas) {
      croppedCanvas.width = 0;
      croppedCanvas.height = 0;
    }
    canvas.width = 0;
    canvas.height = 0;
    return blob;
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
    getPageCount,
    setThumbnailActions,
    setOrganizerMode,
    setEditorObjects,
    setEditorCrops,
    setEditorStrokes,
    loadPdfJs,
    prewarmThumbnails,
    exportPageImage,
    supported,
    version: `pdfjs-${PDFJS_VERSION}-legacy-drawing-page-export-v3-phase6`
  });
})();
