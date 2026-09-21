'use strict';

(() => {
  const TESSERACT_VERSION = '7.0.0';
  const TESSERACT_SCRIPT_URL = '/vendor/tesseract/v7.0.0/tesseract.min.js';
  const TESSERACT_WORKER_URL = '/vendor/tesseract/v7.0.0/worker.min.js';
  const TESSERACT_CORE_PATH = '/vendor/tesseract/v7.0.0/core';
  const TESSERACT_LANG_PATH = 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/por@1.0.0/4.0.0_best_int';
  const TESSERACT_SCRIPT_INTEGRITY = 'sha256-AAwn2c0N72Vfd7NscqOJwKsTeTqjHLTXqrVtCcCvvH4=';
  const OCR_LANGUAGE = 'por';

  let scriptPromise = null;
  let workerPromise = null;
  let worker = null;
  let activeProgress = null;
  let queue = Promise.resolve();

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function normalizeStatus(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 _-]/g, '')
      .slice(0, 64);
  }

  function loadTesseract() {
    if (window.Tesseract?.createWorker) return Promise.resolve(window.Tesseract);
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-titon-ocr-runtime="true"]');
      if (existing) {
        existing.addEventListener('load', () => {
          if (window.Tesseract?.createWorker) resolve(window.Tesseract);
          else reject(new Error('Runtime OCR indisponível.'));
        }, { once: true });
        existing.addEventListener('error', () => reject(new Error('Não foi possível carregar o OCR local.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = TESSERACT_SCRIPT_URL;
      script.async = true;
      script.dataset.titonOcrRuntime = 'true';
      script.integrity = TESSERACT_SCRIPT_INTEGRITY;
      script.crossOrigin = 'anonymous';
      script.addEventListener('load', () => {
        if (window.Tesseract?.createWorker) resolve(window.Tesseract);
        else reject(new Error('Runtime OCR indisponível.'));
      }, { once: true });
      script.addEventListener('error', () => reject(new Error('Não foi possível carregar o OCR local.')), { once: true });
      document.head.appendChild(script);
    }).catch((error) => {
      scriptPromise = null;
      throw error;
    });

    return scriptPromise;
  }

  async function createLocalWorker() {
    if (worker) return worker;
    if (workerPromise) return workerPromise;

    workerPromise = (async () => {
      const Tesseract = await loadTesseract();
      const next = await Tesseract.createWorker(
        OCR_LANGUAGE,
        Tesseract.OEM?.LSTM_ONLY ?? 1,
        {
          workerPath: TESSERACT_WORKER_URL,
          corePath: TESSERACT_CORE_PATH,
          langPath: TESSERACT_LANG_PATH,
          workerBlobURL: false,
          cacheMethod: 'none',
          gzip: true,
          legacyCore: false,
          legacyLang: false,
          logger(message) {
            if (!activeProgress) return;
            const progress = clamp(message?.progress, 0, 1);
            activeProgress({
              status: normalizeStatus(message?.status),
              progress
            });
          },
          errorHandler() {
            // Erros são propagados pela Promise do worker; nunca registrar conteúdo documental.
          }
        }
      );
      worker = next;
      return next;
    })().catch((error) => {
      workerPromise = null;
      worker = null;
      throw error;
    });

    return workerPromise;
  }

  function lineRecords(data, imageWidth, imageHeight) {
    const width = Math.max(1, Number(imageWidth || 0));
    const height = Math.max(1, Number(imageHeight || 0));
    const lines = [];

    for (const block of Array.isArray(data?.blocks) ? data.blocks : []) {
      for (const paragraph of Array.isArray(block?.paragraphs) ? block.paragraphs : []) {
        for (const line of Array.isArray(paragraph?.lines) ? paragraph.lines : []) {
          const text = String(line?.text || '').replace(/\s+/g, ' ').trim();
          if (!text) continue;

          const bbox = line?.bbox || {};
          const x0 = clamp(bbox.x0, 0, width);
          const y0 = clamp(bbox.y0, 0, height);
          const x1 = clamp(bbox.x1, 0, width);
          const y1 = clamp(bbox.y1, 0, height);
          if (!(x1 > x0) || !(y1 > y0)) continue;

          lines.push({
            text,
            confidence: clamp(line?.confidence, 0, 100),
            x0,
            y0,
            x1,
            y1
          });
        }
      }
    }

    lines.sort((a, b) => {
      const rowTolerance = Math.max(4, Math.min((a.y1 - a.y0), (b.y1 - b.y0)) * 0.45);
      if (Math.abs(a.y0 - b.y0) <= rowTolerance) return a.x0 - b.x0;
      return a.y0 - b.y0;
    });

    return lines;
  }

  function recognize(image, options = {}) {
    if (!image) return Promise.reject(new Error('Página inválida para OCR.'));

    const run = async () => {
      const localWorker = await createLocalWorker();
      activeProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
      try {
        activeProgress?.({ status: 'recognizing text', progress: 0 });
        const result = await localWorker.recognize(
          image,
          {
            rotateAuto: false,
            tessedit_pageseg_mode: '3',
            preserve_interword_spaces: '1',
            user_defined_dpi: '300'
          },
          {
            text: true,
            blocks: true
          }
        );

        const width = Math.max(1, Number(image.width || options.width || 0));
        const height = Math.max(1, Number(image.height || options.height || 0));
        const lines = lineRecords(result?.data, width, height);
        const text = String(result?.data?.text || '').trim();

        return {
          engine: 'tesseract.js',
          version: TESSERACT_VERSION,
          language: OCR_LANGUAGE,
          width,
          height,
          confidence: clamp(result?.data?.confidence, 0, 100),
          text,
          lines
        };
      } finally {
        activeProgress = null;
      }
    };

    const job = queue.then(run, run);
    queue = job.then(() => undefined, () => undefined);
    return job;
  }

  async function terminate() {
    const current = worker;
    worker = null;
    workerPromise = null;
    activeProgress = null;
    queue = Promise.resolve();
    try {
      await current?.terminate?.();
    } catch (_) {}
  }

  window.addEventListener('pagehide', () => {
    terminate().catch(() => {});
  }, { once: true });

  window.PortalDocumentOcr = Object.freeze({
    version: TESSERACT_VERSION,
    language: OCR_LANGUAGE,
    recognize,
    terminate
  });
})();
