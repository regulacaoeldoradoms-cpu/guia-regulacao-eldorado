import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

export const root = path.resolve(import.meta.dirname, '../..');
export const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
export const baseline = (file) => execFileSync('git', ['-c', 'safe.directory=*', 'show',
  `${process.env.DOCUMENT_NAVIGATION_BASELINE || '6c4fcd86198103ad6e1e8adc07901219c7957c92'}:${file}`],
  { cwd: root, encoding: 'utf8', maxBuffer: 2 ** 22 });
export const flush = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };
export function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

export function clock() {
  let time = 0;
  const timers = [];
  const now = () => time;
  const delay = (ms) => new Promise((resolve) => timers.push({ at: time + ms, resolve }));
  async function until(predicate) {
    for (let i = 0; i < 1000; i++) {
      await flush();
      if (predicate()) return;
      timers.sort((a, b) => a.at - b.at);
      const next = timers.shift();
      if (!next) throw new Error('Fixture stalled without a scheduled event.');
      time = next.at;
      next.resolve();
    }
    throw new Error('Fixture exceeded event budget.');
  }
  async function settle(promise) {
    let done = false, error, value;
    promise.then((result) => { value = result; done = true; }, (reason) => { error = reason; done = true; });
    await until(() => done);
    if (error) throw error;
    return value;
  }
  return { now, delay, until, settle, advance: (ms) => { time += ms; } };
}

export function functionSource(source, name) {
  const start = source.search(new RegExp(`^  (?:async )?function ${name}\\(`, 'm'));
  if (start < 0) throw new Error('Missing function: ' + name);
  const closing = /^  }$/m.exec(source.slice(start));
  if (!closing) throw new Error('Missing function end: ' + name);
  return source.slice(start, start + closing.index + closing[0].length);
}

export function centralFixture(source, { warm = null, accessMs = 25, driveMs = 300,
  preferencesMs = 100, aiMs = 180, timer: suppliedTimer = null } = {}) {
  const timer = suppliedTimer || clock();
  const events = [], calls = [], painted = [];
  let session = 'synthetic-account-a', allowed = true, failNext = false;
  const state = { user: {}, items: [], stack: [], loading: false, folderSnapshot: null,
    listSortOrder: 'original', selectedListIndex: -1, searchFilters: {}, searchTitleOnly: false };
  const els = { search: { value: '' }, searchTitleOnly: {}, list: {}, loadMore: {}, workspace: {},
    pagination: {}, badge: {} };
  async function request(route, options = {}) {
    const body = JSON.parse(options.body || '{}');
    calls.push({ route, body, at: timer.now(), session });
    await timer.delay(route.endsWith('/access') ? accessMs : route.endsWith('/preferences') ? preferencesMs
      : route.endsWith('/config') ? aiMs : driveMs);
    if (failNext) { failNext = false; throw Object.assign(new Error('Synthetic unavailable'), { status: 503 }); }
    if (route.endsWith('/access')) return { capabilities: { view: allowed, manage: allowed, extract: allowed },
      drive: { connected: true } };
    if (route.endsWith('/preferences')) return { colorPalette: ['#000000'] };
    if (route.endsWith('/config')) return { ai: { enabled: false } };
    return { items: [{ name: body.query ? 'Synthetic match' : 'Synthetic folder',
      ref: body.parentRef || 'synthetic-root', isFolder: true }], nextPageToken: '', timing: { apiMs: driveMs } };
  }
  const auth = { getCachedUser: () => session ? { username: session } : null,
    getToken: () => session ? 'synthetic-token-' + session : '', api: request };
  const sandbox = vm.createContext({ window: { PortalPerformance: { clearDocumentsWarm() {} } },
    state, els, auth, performance: { now: timer.now }, DOCUMENT_READ_LABELS: {},
    centralStartupStarted: 0, background: null, DEFAULT_EDITOR_COLOR_PALETTE: ['#000000'],
    withDocumentReadRetry: (operation) => operation(),
    readApi: request, duration: (start) => timer.now() - start,
    capture: (name, props) => events.push({ name, ...props }),
    renderAccessState: () => { els.workspace.hidden = !state.access?.capabilities?.view; },
    renderItems: () => painted.push({ at: timer.now(), items: JSON.parse(JSON.stringify(state.items)) }),
    closePdf: () => { state.pdfItem = null; },
    showStatus: () => {}, sortItems: (items) => items.slice(),
    normalizeAdvancedSearchFilters: (value) => value, defaultAdvancedSearchFilters: () => ({}),
    advancedSearchHasCriteria: () => false, normalizedSearchText: (value) => String(value).toLowerCase(),
    syncAdvancedSearchButton: () => {}, documentAiCapabilities: () => state.access?.capabilities || {},
    normalizeEditorColorPalette: (value) => value, normalizeViewerZoomScale: (value) => value,
    normalizeTitonFieldOrder: (value) => value, scheduleActiveDocumentPreparation: () => {},
    driveTimingValue: (payload, key) => payload.timing?.[key] || 0,
    resultCountBucket: () => '1-5', Promise, JSON, Map, Set,
    Date: class extends Date { static now() { return timer.now(); } } });
  vm.runInContext(read('js/document-navigation.js'), sandbox);
  const upgraded = source.includes('const navigationReads =');
  if (upgraded) {
    const start = source.indexOf('  let navigationRequestId =');
    const end = source.indexOf('  function pdfBaseName(', start);
    vm.runInContext(source.slice(start, end), sandbox);
  }
  for (const name of ['loadAccess', 'currentParentRef', 'warmedRootFolder', 'refreshWarmedRootFolderInBackground',
    'loadFolder', 'search', 'loadEditorPreferences', 'loadDocumentAiConfig']) {
    vm.runInContext(functionSource(source, name), sandbox);
  }
  sandbox.backgroundWarmPayloadPromise = () => Promise.resolve(warm);
  const startup = source.slice(source.lastIndexOf('  try {'), source.lastIndexOf('})();'));
  return { timer, calls, events, painted, state, els, sandbox,
    start: () => vm.runInContext(`(async () => { ${startup} })()`, sandbox),
    folder: (parentRef) => { state.stack = parentRef ? [{ ref: parentRef }] : []; return sandbox.loadFolder(); },
    search: (query, extra) => sandbox.search(query, extra),
    navigation: upgraded ? vm.runInContext('navigationReads', sandbox) : null,
    setSession: (value) => { session = value; if (upgraded) vm.runInContext('navigationReads.syncSession()', sandbox); },
    deny: () => { allowed = false; }, fail: () => { failNext = true; } };
}
