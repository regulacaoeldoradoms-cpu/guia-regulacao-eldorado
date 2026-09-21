'use strict';

(() => {
  const TESSERACT_SCRIPT_URL = '/vendor/tesseract/tesseract.min.js?v=7.0.0';
  const TESSERACT_WORKER_URL = '/vendor/tesseract/worker.min.js?v=7.0.0';
  const TESSERACT_CORE_URL = '/vendor/tesseract/core/';
  const TESSERACT_LANG_URL = '/vendor/tesseract/lang/';
  const LANGUAGE = 'por';

  let scriptPromise = null;
  let workerPromise = null;
  let activeProgress = null;
  let recognitionChain = Promise.resolve();

  function safeProgress(message) {
    if (typeof activeProgress !== 'function') return;
    const progress = Math.max(0, Math.min(1, Number(message?.progress || 0)));
    try {
      activeProgress(Object.freeze({ progress }));
    } catch (_) {}
  }

  function loadTesseractScript() {
    if (globalThis.Tesseract?.createWorker) return Promise.resolve(globalThis.Tesseract);
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-titon-ocr-runtime="true"]');
      if (existing) {
        existing.addEventListener('load', () => {
          if (globalThis.Tesseract?.createWorker) resolve(globalThis.Tesseract);
          else reject(new Error('Runtime OCR local indisponível.'));
        }, { once: true });
        existing.addEventListener('error', () => reject(new Error('Runtime OCR local indisponível.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = TESSERACT_SCRIPT_URL;
      script.async = true;
      script.dataset.titonOcrRuntime = 'true';
      script.addEventListener('load', () => {
        if (globalThis.Tesseract?.createWorker) resolve(globalThis.Tesseract);
        else reject(new Error('Runtime OCR local indisponível.'));
      }, { once: true });
      script.addEventListener('error', () => reject(new Error('Runtime OCR local indisponível.')), { once: true });
      document.head.appendChild(script);
    }).catch((error) => {
      scriptPromise = null;
      throw error;
    });

    return scriptPromise;
  }

  async function createLocalWorker() {
    const Tesseract = await loadTesseractScript();
    const worker = await Tesseract.createWorker(
      LANGUAGE,
      Tesseract.OEM?.LSTM_ONLY ?? 1,
      {
        workerPath: TESSERACT_WORKER_URL,
        corePath: TESSERACT_CORE_URL,
        langPath: TESSERACT_LANG_URL,
        workerBlobURL: false,
        cacheMethod: 'none',
        gzip: true,
        logger: safeProgress,
        errorHandler: () => {}
      }
    );

    await worker.setParameters({
      tessedit_pageseg_mode: String(Tesseract.PSM?.AUTO ?? '3'),
      preserve_interword_spaces: '1',
      user_defined_dpi: '300'
    });

    return worker;
  }

  function getWorker() {
    if (!workerPromise) {
      workerPromise = createLocalWorker().catch((error) => {
        workerPromise = null;
        throw error;
      });
    }
    return workerPromise;
  }

  function number(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function bbox(value) {
    if (!value || typeof value !== 'object') return null;
    const x0 = number(value.x0, NaN);
    const y0 = number(value.y0, NaN);
    const x1 = number(value.x1, NaN);
    const y1 = number(value.y1, NaN);
    if (![x0, y0, x1, y1].every(Number.isFinite)) return null;
    if (x1 <= x0 || y1 <= y0) return null;
    return { x0, y0, x1, y1 };
  }

  function bboxFromWords(words = []) {
    let x0 = Number.POSITIVE_INFINITY;
    let y0 = Number.POSITIVE_INFINITY;
    let x1 = Number.NEGATIVE_INFINITY;
    let y1 = Number.NEGATIVE_INFINITY;
    let found = false;

    for (const word of words) {
      const box = bbox(word?.bbox);
      if (!box) continue;
      found = true;
      x0 = Math.min(x0, box.x0);
      y0 = Math.min(y0, box.y0);
      x1 = Math.max(x1, box.x1);
      y1 = Math.max(y1, box.y1);
    }
    return found ? { x0, y0, x1, y1 } : null;
  }

  function normalizeLine(line) {
    const words = Array.isArray(line?.words) ? line.words : [];
    const text = String(line?.text || words.map((word) => String(word?.text || '')).join(' ')).trim();
    const box = bbox(line?.bbox) || bboxFromWords(words);
    if (!text || !box) return null;
    return Object.freeze({
      text,
      confidence: number(line?.confidence, 0),
      ...box
    });
  }

  function linesFromBlocks(blocks = []) {
    const lines = [];
    for (const block of Array.isArray(blocks) ? blocks : []) {
      for (const paragraph of Array.isArray(block?.paragraphs) ? block.paragraphs : []) {
        for (const line of Array.isArray(paragraph?.lines) ? paragraph.lines : []) {
          const normalized = normalizeLine(line);
          if (normalized) lines.push(normalized);
        }
      }
    }
    return lines;
  }

  async function recognize(image, options = {}) {
    const task = async () => {
      const worker = await getWorker();
      activeProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
      try {
        const result = await worker.recognize(
          image,
          {},
          {
            text: true,
            blocks: true
          }
        );
        const lines = linesFromBlocks(result?.data?.blocks);
        return Object.freeze({
          lines,
          confidence: number(result?.data?.confidence, 0)
        });
      } finally {
        activeProgress = null;
      }
    };

    const queued = recognitionChain.then(task, task);
    recognitionChain = queued.then(() => undefined, () => undefined);
    return queued;
  }

  async function preload() {
    await getWorker();
    return true;
  }

  async function terminate() {
    const pending = workerPromise;
    workerPromise = null;
    scriptPromise = scriptPromise && globalThis.Tesseract?.createWorker ? scriptPromise : null;
    if (!pending) return;
    try {
      const worker = await pending;
      await worker?.terminate?.();
    } catch (_) {}
  }

  window.addEventListener('pagehide', () => {
    terminate().catch(() => {});
  }, { once: true });

  window.PortalDocumentOcr = Object.freeze({
    version: '7.0.0',
    language: LANGUAGE,
    preload,
    recognize,
    terminate
  });
})();
