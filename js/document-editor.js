'use strict';

(() => {
  if (window.PortalPdfEditor) return;

  const LIB_URL = '/vendor/pdf-lib/pdf-lib.min.js';
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

  function normalizeRotation(value) {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return 0;
    const snapped = Math.round(numeric / 90) * 90;
    return ((snapped % 360) + 360) % 360;
  }

  function normalizeCropRect(value) {
    if (!value || typeof value !== 'object') return null;
    const minSize = 0.04;
    let x = clamp01(value.x, 0);
    let y = clamp01(value.y, 0);
    let width = Number(value.width);
    let height = Number(value.height);
    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
    width = Math.min(1, Math.max(minSize, width));
    height = Math.min(1, Math.max(minSize, height));
    x = Math.min(1 - width, Math.max(0, x));
    y = Math.min(1 - height, Math.max(0, y));
    const full = x <= 0.0001 && y <= 0.0001 && width >= 0.9999 && height >= 0.9999;
    return full ? null : { x, y, width, height };
  }

  function rotateCropRect(crop, quarterTurns = 1) {
    let rect = normalizeCropRect(crop);
    if (!rect) return null;
    const turns = ((Math.round(Number(quarterTurns) || 0) % 4) + 4) % 4;
    for (let index = 0; index < turns; index += 1) {
      rect = normalizeCropRect({
        x: 1 - (rect.y + rect.height),
        y: rect.x,
        width: rect.height,
        height: rect.width
      });
      if (!rect) break;
    }
    return rect;
  }

  function clonePlan(plan) {
    return plan.map((item) => ({
      pageId: String(item.pageId || ''),
      sourceIndex: item.sourceIndex,
      pageIndex: item.pageIndex,
      rotation: normalizeRotation(item.rotation),
      crop: normalizeCropRect(item.crop)
    }));
  }

  function cloneObjects(objects) {
    return (objects || []).map((item) => ({
      id: String(item.id || ''),
      type: String(item.type || ''),
      pageId: String(item.pageId || ''),
      x: Number(item.x || 0),
      y: Number(item.y || 0),
      width: Number(item.width || 0),
      height: Number(item.height || 0),
      rotation: Number(item.rotation || 0),
      opacity: Number.isFinite(Number(item.opacity)) ? Number(item.opacity) : 1,
      text: String(item.text || ''),
      fontFamily: String(item.fontFamily || 'Arial'),
      fontSize: Number(item.fontSize || 0.032),
      fontWeight: item.fontWeight === 'bold' ? 'bold' : 'normal',
      fontStyle: item.fontStyle === 'italic' ? 'italic' : 'normal',
      textDecoration: item.textDecoration === 'underline' ? 'underline' : 'none',
      textAlign: ['left', 'center', 'right'].includes(item.textAlign) ? item.textAlign : 'left',
      color: String(item.color || '#111111'),
      blob: item.blob instanceof Blob ? item.blob : null,
      mimeType: String(item.mimeType || ''),
      aspectRatio: Number(item.aspectRatio || 0)
    }));
  }

  function normalizeStrokePoints(points) {
    const source = Array.isArray(points) ? points : [];
    const normalized = [];
    for (const point of source) {
      const x = clamp01(point?.x, 0);
      const y = clamp01(point?.y, 0);
      const previous = normalized[normalized.length - 1];
      if (previous && Math.abs(previous.x - x) < 0.00001 && Math.abs(previous.y - y) < 0.00001) continue;
      normalized.push({ x, y });
      if (normalized.length >= 12000) break;
    }
    return normalized;
  }

  function cloneStrokes(strokes) {
    return (strokes || []).map((item) => ({
      id: String(item.id || ''),
      pageId: String(item.pageId || ''),
      color: /^#[0-9a-f]{6}$/i.test(String(item.color || '')) ? String(item.color).toLowerCase() : '#111111',
      width: Math.min(0.05, Math.max(0.001, Number(item.width) || 0.006)),
      points: normalizeStrokePoints(item.points)
    })).filter((item) => item.id && item.pageId && item.points.length > 0);
  }

  function rotateStrokePoints(points, quarterTurns = 1) {
    const turns = ((Math.round(Number(quarterTurns) || 0) % 4) + 4) % 4;
    return normalizeStrokePoints(points).map((point) => {
      let x = point.x;
      let y = point.y;
      for (let index = 0; index < turns; index += 1) {
        const nextX = 1 - y;
        const nextY = x;
        x = nextX;
        y = nextY;
      }
      return { x: clamp01(x), y: clamp01(y) };
    });
  }

  function snapshot(session) {
    return {
      plan: clonePlan(session.plan),
      objects: cloneObjects(session.objects),
      strokes: cloneStrokes(session.strokes)
    };
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
    const stored = session.history[index];
    const legacyPlan = Array.isArray(stored) ? stored : stored?.plan;
    if (!Array.isArray(legacyPlan)) return false;
    session.historyIndex = index;
    session.plan = clonePlan(legacyPlan);
    session.objects = cloneObjects(Array.isArray(stored) ? [] : stored?.objects);
    session.strokes = cloneStrokes(Array.isArray(stored) ? [] : stored?.strokes);
    session.revision += 1;
    return true;
  }

  function nextPageId(session) {
    const value = Math.max(1, Number(session.nextPageId || 1));
    session.nextPageId = value + 1;
    return `page-${value}`;
  }

  function nextObjectId(session) {
    const value = Math.max(1, Number(session.nextObjectId || 1));
    session.nextObjectId = value + 1;
    return `object-${value}`;
  }

  function nextStrokeId(session) {
    const value = Math.max(1, Number(session.nextStrokeId || 1));
    session.nextStrokeId = value + 1;
    return `stroke-${value}`;
  }

  function clamp01(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(1, Math.max(0, numeric));
  }

  function normalizeObjectPatch(patch = {}) {
    const normalized = {};
    if ('x' in patch) normalized.x = clamp01(patch.x);
    if ('y' in patch) normalized.y = clamp01(patch.y);
    if ('width' in patch) normalized.width = Math.min(0.95, Math.max(0.035, Number(patch.width) || 0.2));
    if ('height' in patch) normalized.height = Math.min(0.95, Math.max(0.025, Number(patch.height) || 0.08));
    if ('rotation' in patch) normalized.rotation = Number.isFinite(Number(patch.rotation)) ? Number(patch.rotation) : 0;
    if ('opacity' in patch) normalized.opacity = clamp01(patch.opacity, 1);
    if ('text' in patch) normalized.text = String(patch.text || '');
    if ('fontFamily' in patch) normalized.fontFamily = String(patch.fontFamily || 'Arial').slice(0, 80);
    if ('fontSize' in patch) normalized.fontSize = Math.min(0.18, Math.max(0.008, Number(patch.fontSize) || 0.032));
    if ('fontWeight' in patch) normalized.fontWeight = patch.fontWeight === 'bold' ? 'bold' : 'normal';
    if ('fontStyle' in patch) normalized.fontStyle = patch.fontStyle === 'italic' ? 'italic' : 'normal';
    if ('textDecoration' in patch) normalized.textDecoration = patch.textDecoration === 'underline' ? 'underline' : 'none';
    if ('textAlign' in patch) normalized.textAlign = ['left', 'center', 'right'].includes(patch.textAlign) ? patch.textAlign : 'left';
    if ('color' in patch && /^#[0-9a-f]{6}$/i.test(String(patch.color || ''))) normalized.color = String(patch.color);
    return normalized;
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

  async function loadBlankSource(label = 'Página em branco', options = {}) {
    const lib = await loadLibrary();
    const documentPdf = await lib.PDFDocument.create();
    const width = Math.max(120, Number(options.width || A4_PORTRAIT[0]));
    const height = Math.max(120, Number(options.height || A4_PORTRAIT[1]));
    documentPdf.addPage([width, height]);
    return {
      kind: 'blank',
      label: String(label || 'Página em branco'),
      cacheIdentity: '',
      blobSize: 0,
      document: documentPdf,
      pageCount: 1
    };
  }

  async function createSession(blob, options = {}) {
    const source = await loadSource(blob, options.label || 'Documento 1', options.cacheIdentity || '');
    const session = {
      sources: [source],
      plan: [],
      objects: [],
      strokes: [],
      history: [],
      historyIndex: 0,
      revision: 0,
      nextPageId: 1,
      nextObjectId: 1,
      nextStrokeId: 1,
      createdAt: performance.now()
    };
    session.plan = Array.from({ length: source.pageCount }, (_, pageIndex) => ({
      pageId: nextPageId(session),
      sourceIndex: 0,
      pageIndex,
      rotation: 0,
      crop: null
    }));
    session.history = [snapshot(session)];
    return session;
  }

  async function addDocument(session, blob, options = {}) {
    if (!session) throw new Error('Sessão de edição ausente.');
    const source = await loadSource(blob, options.label || `Documento ${session.sources.length + 1}`, options.cacheIdentity || '');
    const sourceIndex = session.sources.length;
    const requestedIndex = Number(options.insertAt);
    const insertAt = Number.isInteger(requestedIndex)
      ? Math.max(0, Math.min(session.plan.length, requestedIndex))
      : session.plan.length;
    const entries = Array.from({ length: source.pageCount }, (_, pageIndex) => ({
      pageId: nextPageId(session),
      sourceIndex,
      pageIndex,
      rotation: 0,
      crop: null
    }));
    session.sources.push(source);
    session.plan.splice(insertAt, 0, ...entries);
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
    session.plan.splice(insertAt, 0, { pageId: nextPageId(session), sourceIndex, pageIndex: 0, rotation: 0, crop: null });
    session.revision += 1;
    commitHistory(session);
    return insertAt;
  }

  async function addBlankPage(session, options = {}) {
    if (!session) throw new Error('Sessão de edição ausente.');
    const source = await loadBlankSource(options.label || 'Página em branco', options);
    const sourceIndex = session.sources.length;
    const requestedIndex = Number(options.insertAt);
    const insertAt = Number.isInteger(requestedIndex)
      ? Math.max(0, Math.min(session.plan.length, requestedIndex))
      : session.plan.length;
    session.sources.push(source);
    session.plan.splice(insertAt, 0, { pageId: nextPageId(session), sourceIndex, pageIndex: 0, rotation: 0, crop: null });
    session.revision += 1;
    commitHistory(session);
    return insertAt;
  }

  function duplicatePage(session, index) {
    if (!session || !Number.isInteger(index) || index < 0 || index >= session.plan.length) return false;
    const source = session.plan[index];
    const duplicate = {
      pageId: nextPageId(session),
      sourceIndex: source.sourceIndex,
      pageIndex: source.pageIndex,
      rotation: normalizeRotation(source.rotation),
      crop: normalizeCropRect(source.crop)
    };
    const insertAt = index + 1;
    session.plan.splice(insertAt, 0, duplicate);
    const cloned = cloneObjects(session.objects)
      .filter((item) => item.pageId === source.pageId)
      .map((item) => ({ ...item, id: nextObjectId(session), pageId: duplicate.pageId }));
    session.objects.push(...cloned);
    const clonedStrokes = cloneStrokes(session.strokes)
      .filter((item) => item.pageId === source.pageId)
      .map((item) => ({ ...item, id: nextStrokeId(session), pageId: duplicate.pageId }));
    session.strokes.push(...clonedStrokes);
    session.revision += 1;
    commitHistory(session);
    return insertAt;
  }

  function removePage(session, index) {
    if (!session || session.plan.length <= 1) return false;
    if (!Number.isInteger(index) || index < 0 || index >= session.plan.length) return false;
    const [removed] = session.plan.splice(index, 1);
    if (removed?.pageId) {
      session.objects = session.objects.filter((item) => item.pageId !== removed.pageId);
      session.strokes = session.strokes.filter((item) => item.pageId !== removed.pageId);
    }
    session.revision += 1;
    commitHistory(session);
    return true;
  }

  function movePageTo(session, fromIndex, toIndex) {
    if (!session || !Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) return false;
    if (
      fromIndex < 0
      || fromIndex >= session.plan.length
      || toIndex < 0
      || toIndex >= session.plan.length
      || fromIndex === toIndex
    ) return false;
    const [entry] = session.plan.splice(fromIndex, 1);
    session.plan.splice(toIndex, 0, entry);
    session.revision += 1;
    commitHistory(session);
    return true;
  }

  function movePage(session, index, delta) {
    if (!Number.isInteger(delta)) return false;
    return movePageTo(session, index, index + delta);
  }

  function rotatePage(session, index, quarterTurns = 1) {
    if (!session || !Number.isInteger(index) || index < 0 || index >= session.plan.length) return false;
    const turns = Number.isFinite(Number(quarterTurns)) ? Math.round(Number(quarterTurns)) : 1;
    if (!turns) return false;
    const entry = session.plan[index];
    entry.rotation = normalizeRotation((entry.rotation || 0) + (turns * 90));
    if (entry.crop) entry.crop = rotateCropRect(entry.crop, turns);
    for (const stroke of session.strokes || []) {
      if (stroke.pageId === entry.pageId) stroke.points = rotateStrokePoints(stroke.points, turns);
    }
    session.revision += 1;
    commitHistory(session);
    return true;
  }

  function setPageCrop(session, pageIndex, crop, options = {}) {
    const page = session?.plan?.[Number(pageIndex)];
    if (!page) return false;
    const next = normalizeCropRect(crop);
    const current = normalizeCropRect(page.crop);
    const same = (!current && !next) || (
      current && next
      && ['x', 'y', 'width', 'height'].every((key) => Math.abs(current[key] - next[key]) < 0.000001)
    );
    if (same) return false;
    page.crop = next;
    if (options.commit !== false) {
      session.revision += 1;
      commitHistory(session);
    }
    return true;
  }

  function clearPageCrop(session, pageIndex, options = {}) {
    return setPageCrop(session, pageIndex, null, options);
  }

  function addTextObject(session, pageIndex, options = {}) {
    const page = session?.plan?.[Number(pageIndex)];
    if (!page) return null;
    const object = {
      id: nextObjectId(session),
      type: 'text',
      pageId: page.pageId,
      x: clamp01(options.x, 0.16),
      y: clamp01(options.y, 0.16),
      width: Math.min(0.9, Math.max(0.12, Number(options.width) || 0.34)),
      height: Math.min(0.5, Math.max(0.045, Number(options.height) || 0.09)),
      rotation: Number(options.rotation || 0),
      opacity: clamp01(options.opacity, 1),
      text: String(options.text || 'Digite aqui'),
      fontFamily: String(options.fontFamily || 'Arial').slice(0, 80),
      fontSize: Math.min(0.18, Math.max(0.008, Number(options.fontSize) || 0.032)),
      fontWeight: options.fontWeight === 'bold' ? 'bold' : 'normal',
      fontStyle: options.fontStyle === 'italic' ? 'italic' : 'normal',
      textDecoration: options.textDecoration === 'underline' ? 'underline' : 'none',
      textAlign: ['left', 'center', 'right'].includes(options.textAlign) ? options.textAlign : 'left',
      color: /^#[0-9a-f]{6}$/i.test(String(options.color || '')) ? String(options.color) : '#111111',
      blob: null,
      mimeType: '',
      aspectRatio: 0
    };
    session.objects.push(object);
    session.revision += 1;
    commitHistory(session);
    return object.id;
  }

  function displayPageAspectRatio(session, pageIndex) {
    const ref = session?.plan?.[Number(pageIndex)];
    const source = ref ? session.sources?.[ref.sourceIndex] : null;
    const page = source?.document?.getPage?.(ref?.pageIndex);
    if (!ref || !page) return 0;
    let box = null;
    try { box = page.getCropBox?.(); } catch (_) {}
    if (!(box?.width > 0) || !(box?.height > 0)) {
      try { box = page.getMediaBox?.(); } catch (_) {}
    }
    if (!(box?.width > 0) || !(box?.height > 0)) {
      try { box = page.getSize?.(); } catch (_) {}
    }
    let width = Number(box?.width || 0);
    let height = Number(box?.height || 0);
    if (!(width > 0) || !(height > 0)) return 0;
    const sourceRotation = normalizeRotation(page.getRotation?.()?.angle || 0);
    const displayRotation = normalizeRotation(sourceRotation + normalizeRotation(ref.rotation));
    if (displayRotation === 90 || displayRotation === 270) [width, height] = [height, width];
    return width / height;
  }

  async function addImageOverlay(session, pageIndex, blob, options = {}) {
    const page = session?.plan?.[Number(pageIndex)];
    if (!page || !(blob instanceof Blob)) return null;
    const mimeType = String(blob.type || '').toLowerCase();
    if (!mimeType.startsWith('image/')) throw new Error('Selecione uma imagem válida.');
    let aspectRatio = Number(options.aspectRatio || 0);
    if (!(aspectRatio > 0) && typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(blob).catch(() => null);
      if (bitmap) {
        aspectRatio = bitmap.width > 0 && bitmap.height > 0 ? bitmap.width / bitmap.height : 0;
        bitmap.close?.();
      }
    }
    const width = Math.min(0.85, Math.max(0.08, Number(options.width) || 0.3));
    const pageAspectRatio = Number(options.pageAspectRatio || 0) || displayPageAspectRatio(session, pageIndex);
    const naturalHeight = aspectRatio > 0
      ? width * (pageAspectRatio > 0 ? pageAspectRatio : 1) / aspectRatio
      : 0.22;
    const height = Math.min(0.85, Math.max(0.06, Number(options.height) || naturalHeight));
    const object = {
      id: nextObjectId(session),
      type: 'image',
      pageId: page.pageId,
      x: clamp01(options.x, 0.18),
      y: clamp01(options.y, 0.18),
      width,
      height,
      rotation: Number(options.rotation || 0),
      opacity: clamp01(options.opacity, 1),
      text: '',
      fontFamily: '',
      fontSize: 0,
      color: '',
      blob,
      mimeType,
      aspectRatio
    };
    session.objects.push(object);
    session.revision += 1;
    commitHistory(session);
    return object.id;
  }

  function updateObject(session, objectId, patch = {}, options = {}) {
    if (!session) return false;
    const object = session.objects.find((item) => item.id === String(objectId || ''));
    if (!object) return false;
    Object.assign(object, normalizeObjectPatch(patch));
    if (options.commit !== false) {
      session.revision += 1;
      commitHistory(session);
    }
    return true;
  }

  function moveObjectToPage(session, objectId, pageIndex, options = {}) {
    if (!session) return false;
    const object = session.objects.find((item) => item.id === String(objectId || ''));
    const page = session.plan[Number(pageIndex)];
    if (!object || !page) return false;
    const patch = normalizeObjectPatch(options);
    const changedPage = object.pageId !== page.pageId;
    const changedGeometry = Object.keys(patch).some((key) => object[key] !== patch[key]);
    if (!changedPage && !changedGeometry) return false;
    object.pageId = page.pageId;
    Object.assign(object, patch);
    if (options.commit !== false) {
      session.revision += 1;
      commitHistory(session);
    }
    return true;
  }

  function commitObjectMutation(session) {
    if (!session) return false;
    session.revision += 1;
    commitHistory(session);
    return true;
  }

  function removeObject(session, objectId) {
    if (!session) return false;
    const index = session.objects.findIndex((item) => item.id === String(objectId || ''));
    if (index < 0) return false;
    session.objects.splice(index, 1);
    session.revision += 1;
    commitHistory(session);
    return true;
  }

  function objectModel(session, pageIndex = null) {
    if (!session) return [];
    const pageById = new Map(session.plan.map((page, index) => [page.pageId, index]));
    return cloneObjects(session.objects)
      .map((object) => {
        const index = pageById.get(object.pageId);
        return {
          ...object,
          pageIndex: Number.isInteger(index) ? index : -1,
          displayPage: Number.isInteger(index) ? index + 1 : 0
        };
      })
      .filter((object) => object.pageIndex >= 0 && (pageIndex == null || object.pageIndex === Number(pageIndex)));
  }

  function addStroke(session, pageIndex, points, options = {}) {
    const page = session?.plan?.[Number(pageIndex)];
    const normalizedPoints = normalizeStrokePoints(points);
    if (!page || !normalizedPoints.length) return null;
    if (normalizedPoints.length === 1) {
      normalizedPoints.push({
        x: Math.min(1, normalizedPoints[0].x + 0.0005),
        y: Math.min(1, normalizedPoints[0].y + 0.0005)
      });
    }
    const stroke = {
      id: nextStrokeId(session),
      pageId: page.pageId,
      color: /^#[0-9a-f]{6}$/i.test(String(options.color || '')) ? String(options.color).toLowerCase() : '#111111',
      width: Math.min(0.05, Math.max(0.001, Number(options.width) || 0.006)),
      points: normalizedPoints
    };
    session.strokes.push(stroke);
    if (options.commit !== false) {
      session.revision += 1;
      commitHistory(session);
    }
    return stroke.id;
  }

  function removeStrokes(session, strokeIds, options = {}) {
    if (!session) return 0;
    const ids = new Set((Array.isArray(strokeIds) ? strokeIds : [strokeIds]).map((id) => String(id || '')).filter(Boolean));
    if (!ids.size) return 0;
    const before = session.strokes.length;
    session.strokes = session.strokes.filter((stroke) => !ids.has(stroke.id));
    const removed = before - session.strokes.length;
    if (removed && options.commit !== false) {
      session.revision += 1;
      commitHistory(session);
    }
    return removed;
  }

  function strokeModel(session, pageIndex = null) {
    if (!session) return [];
    const pageById = new Map(session.plan.map((page, index) => [page.pageId, index]));
    return cloneStrokes(session.strokes)
      .map((stroke) => {
        const index = pageById.get(stroke.pageId);
        return {
          ...stroke,
          pageIndex: Number.isInteger(index) ? index : -1,
          displayPage: Number.isInteger(index) ? index + 1 : 0
        };
      })
      .filter((stroke) => stroke.pageIndex >= 0 && (pageIndex == null || stroke.pageIndex === Number(pageIndex)));
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
      pageId: ref.pageId,
      sourceIndex: ref.sourceIndex,
      sourcePage: ref.pageIndex + 1,
      sourceKind: session.sources[ref.sourceIndex]?.kind || 'pdf',
      sourceLabel: session.sources[ref.sourceIndex]?.label || `Documento ${ref.sourceIndex + 1}`,
      rotation: normalizeRotation(ref.rotation),
      crop: normalizeCropRect(ref.crop)
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
      const rotation = normalizeRotation(ref.rotation);
      if (rotation) {
        const sourceRotation = Number(page.getRotation?.()?.angle || 0);
        page.setRotation?.(lib.degrees(normalizeRotation(sourceRotation + rotation)));
      }
      output.addPage(page);
    }

    const bytes = await output.save({
      useObjectStreams: false,
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
    addBlankPage,
    duplicatePage,
    removePage,
    movePage,
    movePageTo,
    rotatePage,
    setPageCrop,
    clearPageCrop,
    addTextObject,
    addImageOverlay,
    updateObject,
    moveObjectToPage,
    commitObjectMutation,
    removeObject,
    objectModel,
    addStroke,
    removeStrokes,
    strokeModel,
    undo,
    redo,
    canUndo,
    canRedo,
    pageModel,
    pageCount,
    sourceCount,
    buildBlob,
    version: 'phase3-v11-drawing'
  });
})();
