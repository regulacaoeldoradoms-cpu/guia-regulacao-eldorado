'use strict';

(() => {
  if (window.PortalPdfEditor) return;

  const LIB_URL = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
  const LIB_INTEGRITY = 'sha512-z8IYLHO8bTgFqj+yrPyIJnzBDf7DDhWwiEsk4sY+Oe6J2M+WQequeGS7qioI5vT6rXgVRb4K1UVQC5ER7MKzKQ==';
  const HISTORY_LIMIT = 50;
  const A4_PORTRAIT = Object.freeze([595.28, 841.89]);
  const IMAGE_PAGE_MARGIN = 18;
  let libraryPromise = null;

  function loadLibrary() {
    if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
    if (libraryPromise) return libraryPromise;

    libraryPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-portal-pdf-lib="1"]');
      if (existing) {
        existing.addEventListener('load', () => window.PDFLib?.PDFDocument ? resolve(window.PDFLib) : reject(new Error('Biblioteca PDF indisponível.')), { once: true });
        existing.addEventListener('error', () => reject(new Error('Não foi possível carregar o editor PDF.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = LIB_URL;
      script.integrity = LIB_INTEGRITY;
      script.crossOrigin = 'anonymous';
      script.referrerPolicy = 'no-referrer';
      script.dataset.portalPdfLib = '1';
      script.async = true;
      script.onload = () => {
        if (window.PDFLib?.PDFDocument) resolve(window.PDFLib);
        else reject(new Error('Biblioteca PDF carregada sem API esperada.'));
      };
      script.onerror = () => reject(new Error('Não foi possível carregar o editor PDF.'));
      document.head.appendChild(script);
    }).catch((error) => {
      libraryPromise = null;
      throw error;
    });

    return libraryPromise;
  }

  function clonePlan(plan) {
    return plan.map((item) => ({ sourceIndex: item.sourceIndex, pageIndex: item.pageIndex }));
  }

  function snapshot(session) {
    return clonePlan(session.plan);
  }

  function commitHistory(session) {
    const current = snapshot(session);
    session.history = session.history.slice(0, session.historyIndex + 1);
    session.history.push(current);
    if (session.history.length > HISTORY_LIMIT) session.history.shift();
    session.historyIndex = session.history.length - 1;
  }

  function restoreHistory(session, index) {
    if (!Number.isInteger(index) || index < 0 || index >= session.history.length) return false;
    session.historyIndex = index;
    session.plan = clonePlan(session.history[index]);
    session.revision += 1;
    return true;
  }

  async function loadSource(blob, label = '', cacheIdentity = '') {
    if (!(blob instanceof Blob)) throw new Error('PDF inválido para edição.');
    const lib = await loadLibrary();
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let documentPdf;
    try {
      documentPdf = await lib.PDFDocument.load(bytes, { updateMetadata: false });
    } catch (_) {
      throw new Error('Este PDF não pôde ser carregado pelo editor. Arquivos protegidos por senha podem não ser compatíveis.');
    }
    const pageCount = documentPdf.getPageCount();
    if (!(pageCount > 0)) throw new Error('O PDF não possui páginas editáveis.');
    return {
      kind: 'pdf',
      label: String(label || ''),
      cacheIdentity: String(cacheIdentity || ''),
      blobSize: blob.size,
      document: documentPdf,
      pageCount
    };
  }

  async function loadImageSource(blob, label = 'Imagem', cacheIdentity = '') {
    if (!(blob instanceof Blob)) throw new Error('Imagem inválida para edição.');
    const type = String(blob.type || '').toLowerCase();
    if (!['image/png', 'image/jpeg'].includes(type)) {
      throw new Error('Formato de imagem não suportado. Use PNG ou JPEG.');
    }

    const lib = await loadLibrary();
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const documentPdf = await lib.PDFDocument.create();
    let embedded;
    try {
      embedded = type === 'image/png'
        ? await documentPdf.embedPng(bytes)
        : await documentPdf.embedJpg(bytes);
    } catch (_) {
      throw new Error('Não foi possível converter esta imagem em página PDF.');
    }

    const natural = embedded.scale(1);
    if (!(natural?.width > 0) || !(natural?.height > 0)) {
      throw new Error('A imagem não possui dimensões válidas.');
    }

    const landscape = natural.width > natural.height;
    const pageWidth = landscape ? A4_PORTRAIT[1] : A4_PORTRAIT[0];
    const pageHeight = landscape ? A4_PORTRAIT[0] : A4_PORTRAIT[1];
    const availableWidth = Math.max(1, pageWidth - (IMAGE_PAGE_MARGIN * 2));
    const availableHeight = Math.max(1, pageHeight - (IMAGE_PAGE_MARGIN * 2));
    const scale = Math.min(availableWidth / natural.width, availableHeight / natural.height);
    const width = natural.width * scale;
    const height = natural.height * scale;
    const page = documentPdf.addPage([pageWidth, pageHeight]);

    page.drawImage(embedded, {
      x: (pageWidth - width) / 2,
      y: (pageHeight - height) / 2,
      width,
      height
    });

    return {
      kind: 'image',
      label: String(label || 'Imagem'),
      cacheIdentity: String(cacheIdentity || ''),
      blobSize: blob.size,
      document: documentPdf,
      pageCount: 1
    };
  }

  async function createSession(blob, options = {}) {
    const source = await loadSource(blob, options.label || 'Documento 1', options.cacheIdentity || '');
    const plan = Array.from({ length: source.pageCount }, (_, pageIndex) => ({ sourceIndex: 0, pageIndex }));
    return {
      sources: [source],
      plan,
      history: [clonePlan(plan)],
      historyIndex: 0,
      revision: 0,
      createdAt: performance.now()
    };
  }

  async function addDocument(session, blob, options = {}) {
    if (!session) throw new Error('Sessão de edição ausente.');
    const source = await loadSource(blob, options.label || `Documento ${session.sources.length + 1}`, options.cacheIdentity || '');
    const sourceIndex = session.sources.length;
    session.sources.push(source);
    for (let pageIndex = 0; pageIndex < source.pageCount; pageIndex += 1) {
      session.plan.push({ sourceIndex, pageIndex });
    }
    session.revision += 1;
    commitHistory(session);
    return source.pageCount;
  }

  async function addImagePage(session, blob, options = {}) {
    if (!session) throw new Error('Sessão de edição ausente.');
    const source = await loadImageSource(blob, options.label || `Imagem ${session.sources.length + 1}`, options.cacheIdentity || '');
    const sourceIndex = session.sources.length;
    const requestedIndex = Number(options.insertAt);
    const insertAt = Number.isInteger(requestedIndex)
      ? Math.max(0, Math.min(session.plan.length, requestedIndex))
      : session.plan.length;

    session.sources.push(source);
    session.plan.splice(insertAt, 0, { sourceIndex, pageIndex: 0 });
    session.revision += 1;
    commitHistory(session);
    return insertAt;
  }

  function removePage(session, index) {
    if (!session || session.plan.length <= 1) return false;
    if (!Number.isInteger(index) || index < 0 || index >= session.plan.length) return false;
    session.plan.splice(index, 1);
    session.revision += 1;
    commitHistory(session);
    return true;
  }

  function movePage(session, index, delta) {
    if (!session || !Number.isInteger(index) || !Number.isInteger(delta)) return false;
    const target = index + delta;
    if (index < 0 || index >= session.plan.length || target < 0 || target >= session.plan.length) return false;
    const [entry] = session.plan.splice(index, 1);
    session.plan.splice(target, 0, entry);
    session.revision += 1;
    commitHistory(session);
    return true;
  }

  function undo(session) {
    return restoreHistory(session, session.historyIndex - 1);
  }

  function redo(session) {
    return restoreHistory(session, session.historyIndex + 1);
  }

  function canUndo(session) {
    return Boolean(session && session.historyIndex > 0);
  }

  function canRedo(session) {
    return Boolean(session && session.historyIndex >= 0 && session.historyIndex < session.history.length - 1);
  }

  function pageModel(session) {
    if (!session) return [];
    return session.plan.map((ref, index) => ({
      index,
      displayPage: index + 1,
      sourceIndex: ref.sourceIndex,
      sourcePage: ref.pageIndex + 1,
      sourceKind: session.sources[ref.sourceIndex]?.kind || 'pdf',
      sourceLabel: session.sources[ref.sourceIndex]?.label || `Documento ${ref.sourceIndex + 1}`
    }));
  }

  async function buildBlob(session) {
    if (!session || !session.plan.length) throw new Error('Não há páginas para gerar.');
    const lib = await loadLibrary();
    const output = await lib.PDFDocument.create();

    for (const ref of session.plan) {
      const source = session.sources[ref.sourceIndex]?.document;
      if (!source) throw new Error('Fonte de página ausente.');
      const [page] = await output.copyPages(source, [ref.pageIndex]);
      output.addPage(page);
    }

    const bytes = await output.save({
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false
    });
    if (!(bytes?.length > 4) || String.fromCharCode(...bytes.slice(0, 4)) !== '%PDF') {
      throw new Error('O editor não conseguiu gerar um PDF válido.');
    }
    return new Blob([bytes], { type: 'application/pdf' });
  }

  function pageCount(session) {
    return session?.plan?.length || 0;
  }

  function sourceCount(session) {
    return session?.sources?.length || 0;
  }

  window.PortalPdfEditor = Object.freeze({
    loadLibrary,
    createSession,
    addDocument,
    addImagePage,
    removePage,
    movePage,
    undo,
    redo,
    canUndo,
    canRedo,
    pageModel,
    pageCount,
    sourceCount,
    buildBlob,
    version: 'phase3-v2'
  });
})();
