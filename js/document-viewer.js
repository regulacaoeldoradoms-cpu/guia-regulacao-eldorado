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
    session.dragSourceIndex = null;
    session.dragTargetIndex = null;
    session.touchDrag = null;
    session.dragGhost?.remove?.();
    session.dragGhost = null;
    for (const wrapper of session.thumbnailsRoot?.querySelectorAll?.('.portal-pdf-thumb-wrap') || []) {
      wrapper.classList.remove('dragging', 'drag-before', 'drag-after');
    }
  }

  function ensureDragGhost(session, wrapper, event) {
    if (!wrapper || session.dragGhost) return session.dragGhost;
    const rect = wrapper.getBoundingClientRect();
    const ghost = wrapper.cloneNode(true);
    ghost.className = 'portal-pdf-drag-ghost';
    ghost.style.width = `${Math.max(120, rect.width)}px`;
    ghost.style.height = `${Math.max(120, rect.height)}px`;
    ghost.querySelectorAll('button').forEach((button) => { button.tabIndex = -1; });
    document.body.appendChild(ghost);
    session.dragGhost = ghost;
    moveDragGhost(session, event);
    return ghost;
  }

  function moveDragGhost(session, event) {
    if (!session.dragGhost) return;
    session.dragGhost.style.transform = `translate3d(${Math.round(event.clientX + 14)}px,${Math.round(event.clientY + 14)}px,0)`;
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

    const pointerdown = (event) => {
      if (!isCurrentSession(session) || !session.thumbnailActions || event.button > 0) return;
      if (event.target.closest?.('[data-thumbnail-action]')) return;
      const handle = event.target.closest?.('[data-thumbnail-drag]');
      const button = event.target.closest?.('.portal-pdf-thumb[data-page-number]');
      if (event.pointerType === 'touch' && !handle) return;
      const origin = handle || button;
      const wrapper = origin?.closest?.('.portal-pdf-thumb-wrap');
      const pageNumber = Number(wrapper?.dataset.pageNumber);
      if (!origin || !wrapper || !Number.isInteger(pageNumber)) return;
      session.touchDrag = {
        pointerId: event.pointerId,
        sourceIndex: pageNumber - 1,
        startX: event.clientX,
        startY: event.clientY,
        started: Boolean(handle)
      };
      if (handle) {
        wrapper.classList.add('dragging');
        event.preventDefault();
      }
      try { origin.setPointerCapture?.(event.pointerId); } catch (_) {}
    };

    const pointermove = (event) => {
      const drag = session.touchDrag;
      if (!isCurrentSession(session) || !drag || drag.pointerId !== event.pointerId) return;
      if (!drag.started) {
        const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
        if (distance < 7) return;
        drag.started = true;
        const source = session.thumbnailsRoot.querySelector(`.portal-pdf-thumb-wrap[data-page-number="${drag.sourceIndex + 1}"]`);
        source?.classList.add('dragging');
        ensureDragGhost(session, source, event);
      }
      event.preventDefault();
      moveDragGhost(session, event);
      const element = document.elementFromPoint(event.clientX, event.clientY);
      const wrapper = element?.closest?.('.portal-pdf-thumb-wrap');
      const target = dropIndexForWrapper(session, wrapper, event.clientX, event.clientY, drag.sourceIndex);
      if (!target) return;
      session.dragTargetIndex = target.finalIndex;
      markThumbnailDropTarget(session, wrapper, target.after);
      const rect = root.getBoundingClientRect();
      if (event.clientY < rect.top + 36) root.scrollTop -= 20;
      else if (event.clientY > rect.bottom - 36) root.scrollTop += 20;
    };

    const pointerup = (event) => {
      const drag = session.touchDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const finalIndex = session.dragTargetIndex;
      const started = drag.started === true;
      clearThumbnailDragState(session);
      if (!started) return;
      event.preventDefault();
      if (Number.isInteger(finalIndex)) emitThumbnailReorder(session, drag.sourceIndex, finalIndex);
    };

    const pointercancel = () => clearThumbnailDragState(session);

    session.thumbnailDragHandlers = { dragstart, dragover, drop, dragend, pointerdown, pointermove, pointerup, pointercancel };
    for (const [type, handler] of Object.entries(session.thumbnailDragHandlers)) {
      root.addEventListener(type, handler, type === 'pointermove' ? { passive: false } : false);
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

    article.append(badge, canvas, loading);
    session.pagesRoot.appendChild(article);

    const record = {
      pageNumber,
      container: article,
      canvas,
      loading,
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
    if (!record || record.rendered || !isCurrentSession(session)) return;
    if (record.renderTask) {
      await settleRenderTask(record);
      return;
    }

    const page = await getPage(session, pageNumber);
    if (!page || !isCurrentSession(session)) return;

    const base = page.getViewport({ scale: 1 });
    const targetWidth = Number(session.thumbnailWidth || THUMB_WIDTH);
    const scale = targetWidth / Math.max(1, base.width);
    const viewport = page.getViewport({ scale });
    const outputScale = Math.min(Number(window.devicePixelRatio || 1), 1.5);

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
      if (isCurrentSession(session)) {
        record.rendered = true;
        record.button.classList.add('rendered');
      }
    } catch (error) {
      if (error?.name !== 'RenderingCancelledException' && isCurrentSession(session)) throw error;
    } finally {
      if (record.renderTask === task) record.renderTask = null;
    }
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
        if (session.initialPageTarget) return;
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
    session.thumbnailWidth = next ? ORGANIZER_THUMB_WIDTH : THUMB_WIDTH;
    session.root.dataset.organizerMode = next ? 'true' : 'false';

    for (const record of session.thumbs.values()) {
      cancelRender(record);
      record.rendered = false;
      record.canvas.width = 0;
      record.canvas.height = 0;
      record.canvas.removeAttribute('style');
    }
    for (let pageNumber = 1; pageNumber <= session.document.numPages; pageNumber += 1) {
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
      touchDrag: null,
      suppressThumbnailClickUntil: 0,
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
        record.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          if (!session.fitMode || !isCurrentSession(session)) return;
          if (session.resizeTimer) clearTimeout(session.resizeTimer);
          session.resizeTimer = window.setTimeout(() => {
            if (!session.fitMode || !isCurrentSession(session)) return;
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
    loadPdfJs,
    supported,
    version: `pdfjs-${PDFJS_VERSION}-legacy-phase3c2a`
  });
})();
