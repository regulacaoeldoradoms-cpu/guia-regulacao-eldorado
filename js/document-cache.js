'use strict';

(() => {
  if (window.PortalDocumentCache) return;

  const DB_NAME = 'regulacao.portal.documents.cache.v1';
  const DB_VERSION = 1;
  const PDF_STORE = 'pdfs';
  const META_STORE = 'meta';
  const SESSION_META_KEY = 'session';
  const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
  const MAX_TOTAL_BYTES = 256 * 1024 * 1024;
  const MAX_FILE_BYTES = 50 * 1024 * 1024;
  const PREFETCH_FILE_BYTES = 12 * 1024 * 1024;
  const encoder = new TextEncoder();
  let databasePromise = null;
  let activeFingerprint = '';
  let activeKeyPromise = null;

  function supported() {
    return Boolean(window.indexedDB && window.crypto?.subtle);
  }

  function bytesToBase64Url(bytes) {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function openDatabase() {
    if (!supported()) return Promise.resolve(null);
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PDF_STORE)) {
          const store = db.createObjectStore(PDF_STORE, { keyPath: 'id' });
          store.createIndex('lastAccess', 'lastAccess', { unique: false });
          store.createIndex('cacheKey', 'cacheKey', { unique: false });
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB indisponível.'));
      request.onblocked = () => reject(new Error('IndexedDB bloqueado.'));
    }).catch(() => null);
    return databasePromise;
  }

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Falha no cache local.'));
    });
  }

  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('Falha no cache local.'));
      transaction.onabort = () => reject(transaction.error || new Error('Cache local abortado.'));
    });
  }

  async function sha256(value) {
    return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(String(value || ''))));
  }

  async function fingerprintForToken(token) {
    const digest = await sha256('central-doc-cache-fingerprint-v1\u0000' + String(token || ''));
    return bytesToBase64Url(digest.slice(0, 18));
  }

  async function keyForToken(token, fingerprint) {
    if (activeFingerprint === fingerprint && activeKeyPromise) return activeKeyPromise;
    activeFingerprint = fingerprint;
    activeKeyPromise = (async () => {
      const material = await crypto.subtle.importKey(
        'raw',
        encoder.encode(String(token || '')),
        'HKDF',
        false,
        ['deriveKey']
      );
      const salt = await sha256('central-doc-cache-salt-v1');
      return crypto.subtle.deriveKey(
        {
          name: 'HKDF',
          hash: 'SHA-256',
          salt,
          info: encoder.encode('central-doc-cache-aes-v1')
        },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    })();
    return activeKeyPromise;
  }

  async function clearStores(db) {
    if (!db) return;
    const transaction = db.transaction([PDF_STORE, META_STORE], 'readwrite');
    transaction.objectStore(PDF_STORE).clear();
    transaction.objectStore(META_STORE).clear();
    await transactionDone(transaction);
  }

  async function ensureSession(token) {
    if (!supported() || !token) return null;
    const db = await openDatabase();
    if (!db) return null;
    const fingerprint = await fingerprintForToken(token);
    const transaction = db.transaction([META_STORE], 'readonly');
    const meta = await requestResult(transaction.objectStore(META_STORE).get(SESSION_META_KEY)).catch(() => null);

    if (!meta || meta.fingerprint !== fingerprint) {
      await clearStores(db).catch(() => {});
      const write = db.transaction([META_STORE], 'readwrite');
      write.objectStore(META_STORE).put({
        key: SESSION_META_KEY,
        fingerprint,
        createdAt: Date.now()
      });
      await transactionDone(write).catch(() => {});
    }

    const key = await keyForToken(token, fingerprint);
    return { db, key, fingerprint };
  }

  function cacheId(cacheKey, version) {
    const key = String(cacheKey || '').trim();
    const fileVersion = String(version || '').trim();
    return key && fileVersion ? key + ':' + fileVersion : '';
  }

  async function removeEntry(db, id) {
    if (!db || !id) return;
    const transaction = db.transaction([PDF_STORE], 'readwrite');
    transaction.objectStore(PDF_STORE).delete(id);
    await transactionDone(transaction).catch(() => {});
  }

  async function removeOtherVersions(db, cacheKey, keepId) {
    if (!db || !cacheKey) return;
    const transaction = db.transaction([PDF_STORE], 'readwrite');
    const index = transaction.objectStore(PDF_STORE).index('cacheKey');
    const request = index.openCursor(IDBKeyRange.only(cacheKey));
    await new Promise((resolve) => {
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return resolve();
        if (cursor.value?.id !== keepId) cursor.delete();
        cursor.continue();
      };
      request.onerror = () => resolve();
    });
    await transactionDone(transaction).catch(() => {});
  }

  async function prune(db) {
    if (!db) return;
    const now = Date.now();
    const read = db.transaction([PDF_STORE], 'readonly');
    const entries = await requestResult(read.objectStore(PDF_STORE).getAll()).catch(() => []);
    const ordered = (Array.isArray(entries) ? entries : [])
      .filter(Boolean)
      .sort((a, b) => Number(a.lastAccess || 0) - Number(b.lastAccess || 0));

    let total = ordered.reduce((sum, entry) => sum + Math.max(0, Number(entry.size || 0)), 0);
    const toDelete = [];
    for (const entry of ordered) {
      const expired = Number(entry.expiresAt || 0) <= now;
      if (expired || total > MAX_TOTAL_BYTES) {
        toDelete.push(entry.id);
        total -= Math.max(0, Number(entry.size || 0));
      }
    }
    if (!toDelete.length) return;

    const write = db.transaction([PDF_STORE], 'readwrite');
    const store = write.objectStore(PDF_STORE);
    for (const id of toDelete) store.delete(id);
    await transactionDone(write).catch(() => {});
  }

  async function get(options = {}) {
    const id = cacheId(options.cacheKey, options.version);
    const token = String(options.token || '');
    if (!id || !token) return null;

    const session = await ensureSession(token).catch(() => null);
    if (!session) return null;

    const transaction = session.db.transaction([PDF_STORE], 'readonly');
    const entry = await requestResult(transaction.objectStore(PDF_STORE).get(id)).catch(() => null);
    if (!entry) return null;
    if (Number(entry.expiresAt || 0) <= Date.now()) {
      await removeEntry(session.db, id);
      return null;
    }

    try {
      const clear = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(entry.iv),
          additionalData: encoder.encode(id)
        },
        session.key,
        entry.cipher
      );

      const touch = session.db.transaction([PDF_STORE], 'readwrite');
      entry.lastAccess = Date.now();
      touch.objectStore(PDF_STORE).put(entry);
      transactionDone(touch).catch(() => {});
      return new Blob([clear], { type: 'application/pdf' });
    } catch (_) {
      await removeEntry(session.db, id);
      return null;
    }
  }

  async function put(options = {}) {
    const id = cacheId(options.cacheKey, options.version);
    const token = String(options.token || '');
    const blob = options.blob;
    if (!id || !token || !(blob instanceof Blob)) return false;
    if (!(blob.size > 0) || blob.size > MAX_FILE_BYTES) return false;

    const session = await ensureSession(token).catch(() => null);
    if (!session) return false;

    try {
      const iv = new Uint8Array(12);
      crypto.getRandomValues(iv);
      const clear = await blob.arrayBuffer();
      const cipher = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv,
          additionalData: encoder.encode(id)
        },
        session.key,
        clear
      );
      const now = Date.now();
      const write = session.db.transaction([PDF_STORE], 'readwrite');
      write.objectStore(PDF_STORE).put({
        id,
        cacheKey: String(options.cacheKey || ''),
        version: String(options.version || ''),
        iv: iv.buffer,
        cipher,
        size: blob.size,
        cachedAt: now,
        lastAccess: now,
        expiresAt: now + CACHE_TTL_MS
      });
      await transactionDone(write);
      await removeOtherVersions(session.db, String(options.cacheKey || ''), id);
      await prune(session.db);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function has(options = {}) {
    const id = cacheId(options.cacheKey, options.version);
    const token = String(options.token || '');
    if (!id || !token) return false;
    const session = await ensureSession(token).catch(() => null);
    if (!session) return false;
    const transaction = session.db.transaction([PDF_STORE], 'readonly');
    const entry = await requestResult(transaction.objectStore(PDF_STORE).get(id)).catch(() => null);
    return Boolean(entry && Number(entry.expiresAt || 0) > Date.now());
  }

  async function clearAll() {
    activeFingerprint = '';
    activeKeyPromise = null;
    const db = await openDatabase();
    if (!db) return;
    await clearStores(db).catch(() => {});
  }

  async function stats(token) {
    const session = await ensureSession(String(token || '')).catch(() => null);
    if (!session) return { count: 0, bytes: 0 };
    const transaction = session.db.transaction([PDF_STORE], 'readonly');
    const entries = await requestResult(transaction.objectStore(PDF_STORE).getAll()).catch(() => []);
    const current = (Array.isArray(entries) ? entries : []).filter((entry) => Number(entry.expiresAt || 0) > Date.now());
    return {
      count: current.length,
      bytes: current.reduce((sum, entry) => sum + Math.max(0, Number(entry.size || 0)), 0)
    };
  }

  window.addEventListener('portal:session-cleared', () => {
    clearAll().catch(() => {});
  });

  window.PortalDocumentCache = Object.freeze({
    get,
    put,
    has,
    clearAll,
    stats,
    supported,
    limits: Object.freeze({
      ttlMs: CACHE_TTL_MS,
      maxTotalBytes: MAX_TOTAL_BYTES,
      maxFileBytes: MAX_FILE_BYTES,
      prefetchFileBytes: PREFETCH_FILE_BYTES
    })
  });
})();
