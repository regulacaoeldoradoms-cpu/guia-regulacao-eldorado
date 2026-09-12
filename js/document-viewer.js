'use strict';

(() => {
  if (window.PortalPdfViewer) return;

  const PDFJS_MODULE_URL = '/vendor/pdfjs/pdf.min.mjs';
  const PDFJS_WORKER_URL = '/vendor/pdfjs/pdf.worker.min.mjs';
  const CMAP_URL = '/vendor/pdfjs/cmaps/';
  const STANDARD_FONT_URL = '/vendor/pdfjs/standard_fonts/';
  const WASM_URL = '/vendor/pdfjs/wasm/';
  const ICC_URL = '/vendor/pdfjs/iccs/';
  const PDFJS_VERSION = '6.3.289';
  const MIN_SCALE = 0.45;
  const MAX_SCALE = 3;
  const ZOOM_STEP = 0.15;
  const THUMB_WIDTH = 104;
  const MAX_CANVAS_PIXELS = 18_000_000;
  const MAX_DEVICE_SCALE = 2;

  let modulePromise = null;
  let active = null;

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
    if (record) record.renderTask = null;
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

  function destroySession(session) {
    if (!session) return;
    session.closed = true;
    session.pageObserver?.disconnect?.();
    session.thumbObserver?.disconnect?.();
    session.activeObserver?.disconnect?.();
    session.firstPageWindowObserver?.disconnect?.();
    session.resizeObserver?.disconnect?.();
    if (session.resizeTimer) clearTimeout(session.resizeTimer);
    for (const record of session.pages.values()) clearRenderedPage(record);
    for (const record of session.thumbs.values()) cancelRender(record);
    if (session.thumbClick) {
      try { session.thumbnailsRoot?.removeEventListener('click', session.thumbClick); } catch (_) {}
    }
    try { session.loadingTask?.destroy?.(); } catch (_) {}
    try { session.document?.destroy?.(); } catch (_) {}
    clearNode(session.pagesRoot);
    clearNode(session.thumbnailsRoot);
  }

  function close() {
    if (active) destroySession(active);
    active = null;
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
      renderedScale: 0,
      renderGeneration: 0
    };
    session.pages.set(pageNumber, record);
    return record;
  }

  function createThumbnailPlaceholder(session, pageNumber) {
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
    session.thumbnailsRoot.appendChild(button);

    const record = {
      pageNumber,
      button,
      canvas,
      page: null,
      renderTask: null,
      rendered: false
    };
    session.thumbs.set(pageNumber, record);
    return record;
  }

  async function getPage(session, pageNumber) {
    const main = session.pages.get(pageNumber);
    const thumb = session.thumbs.get(pageNumber);
    if (main?.page) return main.page;
    if (thumb?.page) return thumb.page;
    const page = await session.document.getPage(pageNumber);
    if (session.closed) return null;
    if (main) main.page = page;
    if (thumb) thumb.page = page;
    return page;
  }

  function setActivePage(session, pageNumber) {
    if (session.closed || !Number.isInteger(pageNumber) || pageNumber < 1) return;
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
    if (!record || session.closed) return;
    const generation = session.generation;
    const scale = session.scale;
    if (!force && record.renderedScale === scale && record.renderGeneration === generation && record.canvas.width > 0) return;

    const page = await getPage(session, pageNumber);
    if (!page || session.closed || generation !== session.generation) return;

    cancelRender(record);
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

    const context = record.canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!context) throw new Error('Canvas do visualizador indisponível.');

    const transform = outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0];
    record.loading.hidden = false;
    record.renderTask = page.render({
      canvasContext: context,
      viewport,
      transform,
      intent: 'display'
    });

    try {
      await record.renderTask.promise;
    } catch (error) {
      if (error?.name === 'RenderingCancelledException' || session.closed || generation !== session.generation) return;
      throw error;
    } finally {
      record.renderTask = null;
    }

    if (session.closed || generation !== session.generation) return;
    record.renderedScale = scale;
    record.renderGeneration = generation;
    record.loading.hidden = true;
    record.container.classList.add('rendered');

    if (pageNumber === 1 && !session.firstPageRendered) {
      session.firstPageRendered = true;
      const notifyVisible = () => {
        if (session.closed || session.firstPageNotified) return;
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
    if (!record || record.rendered || session.closed) return;

    const page = await getPage(session, pageNumber);
    if (!page || session.closed) return;

    const base = page.getViewport({ scale: 1 });
    const scale = THUMB_WIDTH / Math.max(1, base.width);
    const viewport = page.getViewport({ scale });
    const outputScale = Math.min(Number(window.devicePixelRatio || 1), 1.5);

    record.canvas.width = Math.max(1, Math.floor(viewport.width * outputScale));
    record.canvas.height = Math.max(1, Math.floor(viewport.height * outputScale));
    record.canvas.style.width = `${Math.ceil(viewport.width)}px`;
    record.canvas.style.height = `${Math.ceil(viewport.height)}px`;

    const context = record.canvas.getContext('2d', { alpha: false });
    if (!context) return;
    const transform = outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0];

    record.renderTask = page.render({
      canvasContext: context,
      viewport,
      transform,
      intent: 'display'
    });

    try {
      await record.renderTask.promise;
      if (!session.closed) {
        record.rendered = true;
        record.button.classList.add('rendered');
      }
    } catch (error) {
      if (error?.name !== 'RenderingCancelledException' && !session.closed) throw error;
    } finally {
      record.renderTask = null;
    }
  }

  function installObservers(session) {
    if (typeof IntersectionObserver === 'function') {
      session.pageObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const pageNumber = Number(entry.target.dataset.pageNumber);
          if (!Number.isInteger(pageNumber)) continue;
          if (entry.isIntersecting) {
            session.visiblePages.add(pageNumber);
            renderMainPage(session, pageNumber).catch(() => session.onError?.());
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
        for (const entry of entries) {
          const pageNumber = Number(entry.target.dataset.pageNumber);
          if (!Number.isInteger(pageNumber)) continue;
          session.pageRatios.set(pageNumber, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
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
        renderMainPage(session, pageNumber).catch(() => session.onError?.());
        renderThumbnail(session, pageNumber).catch(() => {});
      }
    }
  }

  async function calculateFitScale(session) {
    const firstPage = await getPage(session, 1);
    if (!firstPage || session.closed) return 1;
    const viewport = firstPage.getViewport({ scale: 1 });
    const available = Math.max(280, (session.scrollRoot.clientWidth || session.root.clientWidth || 720) - 38);
    return clamp(available / Math.max(1, viewport.width), MIN_SCALE, MAX_SCALE);
  }

  async function applyScale(session, nextScale, { fit = false } = {}) {
    if (!session || session.closed) return;
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

  async function open(source, options = {}) {
    close();

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
      onError = null
    } = options;

    if (!root || !scrollRoot || !pagesRoot || !thumbnailsRoot) {
      throw new Error('Superfície do visualizador incompleta.');
    }

    const pdfjs = await loadPdfJs();
    const input = await sourceParameters(source);
    const session = {
      root,
      scrollRoot,
      pagesRoot,
      thumbnailsRoot,
      zoomLabel,
      pageCountLabel,
      onReady,
      onFirstPageVisible,
      onPageChange,
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
      pageRatios: new Map(),
      visiblePages: new Set(),
      activePage: 1,
      scale: 1,
      fitMode: true,
      generation: 1,
      firstPageRendered: false,
      firstPageNotified: false,
      closed: false
    };
    active = session;

    clearNode(pagesRoot);
    clearNode(thumbnailsRoot);
    root.hidden = false;

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

    try {
      session.document = await loadingTask.promise;
      if (session.closed || active !== session) return null;
      if (!(session.document?.numPages > 0)) throw new Error('O PDF não possui páginas visíveis.');

      if (pageCountLabel) pageCountLabel.textContent = `${session.document.numPages} página(s)`;

      for (let pageNumber = 1; pageNumber <= session.document.numPages; pageNumber += 1) {
        createPagePlaceholder(session, pageNumber);
        createThumbnailPlaceholder(session, pageNumber);
      }

      thumbnailsRoot.addEventListener('click', session.thumbClick = (event) => {
        const button = event.target.closest?.('[data-page-number]');
        if (!button) return;
        scrollToPage(Number(button.dataset.pageNumber));
      });

      setActivePage(session, 1);
      session.scale = await calculateFitScale(session);
      if (zoomLabel) zoomLabel.textContent = `${Math.round(session.scale * 100)}%`;

      installObservers(session);
      session.visiblePages.add(1);
      await Promise.all([
        renderMainPage(session, 1, { force: true }),
        renderThumbnail(session, 1)
      ]);

      if (session.closed || active !== session) return null;

      if (typeof ResizeObserver === 'function') {
        session.resizeObserver = new ResizeObserver(() => {
          if (!session.fitMode || session.closed) return;
          if (session.resizeTimer) clearTimeout(session.resizeTimer);
          session.resizeTimer = window.setTimeout(() => fitWidth().catch(() => {}), 140);
        });
        session.resizeObserver.observe(scrollRoot);
      }

      onReady?.({
        pageCount: session.document.numPages,
        version: PDFJS_VERSION
      });
      return {
        pageCount: session.document.numPages,
        version: PDFJS_VERSION
      };
    } catch (error) {
      if (active === session) close();
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
    loadPdfJs,
    supported,
    version: `pdfjs-${PDFJS_VERSION}-phase3c1`
  });
})();
