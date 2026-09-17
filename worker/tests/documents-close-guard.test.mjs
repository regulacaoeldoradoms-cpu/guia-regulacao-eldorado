import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const clientPath = path.resolve(import.meta.dirname, '../../js/documents.js');

class ElementStub {
  constructor() {
    this.listeners = new Map();
    this.dataset = {};
    this.attributes = new Map();
    this.hidden = false;
    this.disabled = false;
    this.value = '';
    this.textContent = '';
    this.classList = { toggle() {}, add() {}, remove() {} };
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  querySelectorAll() { return []; }
  querySelector() { return null; }
  replaceChildren() {}
  appendChild() {}
  remove() {}
  focus() {}
}

const drainTasks = () => new Promise((resolve) => setImmediate(resolve));

async function createClient({ failure = '', holdUpload = false, incomplete = false, initialWriteEnabled = true, confirmResponse = true } = {}) {
  const elements = new Map();
  const element = (id) => {
    if (!elements.has(id)) elements.set(id, new ElementStub());
    return elements.get(id);
  };
  const calls = { requests: [], api: [], logout: 0, close: 0, revoked: [], navigation: [], streams: [], confirms: [], downloads: [] };
  const session = { revision: 1 };
  const timers = new Map();
  let nextTimer = 0;
  let finishUpload;
  const uploadWait = holdUpload ? new Promise((resolve) => { finishUpload = resolve; }) : null;
  const user = { role: 'admin', documentCapabilities: { edit: true } };
  const access = {
    capabilities: { edit: true, view: false, manage: false },
    drive: { connected: true, writeEnabled: initialWriteEnabled }
  };
  const document = Object.assign(new ElementStub(), {
    getElementById: element,
    body: new ElementStub(),
    createElement: (tag) => {
      const created = new ElementStub();
      if (tag === 'a') created.click = () => calls.downloads.push({ href: created.href, name: created.download });
      return created;
    }
  });
  const window = Object.assign(new ElementStub(), {
    RegulationAuth: {
      requireRole: async () => user,
      getCachedUser: () => user,
      authorizationHeader: () => ({ Authorization: 'Bearer test-only' }),
      api: async (url, options) => {
        calls.api.push({ url, options });
        return url === '/api/documents/access' ? access : {};
      },
      logout: async () => { calls.logout += 1; }
    },
    REGULATION_AUTH_CONFIG: { endpoint: 'https://worker.invalid' },
    PortalPdfEditor: {
      createSession: async () => session,
      canUndo: () => true,
      canRedo: () => false,
      buildFlattenedBlob: async () => new Blob(['%PDF-1.7\nsynthetic test bytes'], { type: 'application/pdf' })
    },
    PortalPdfViewer: {
      close: () => { calls.close += 1; },
      setThumbnailActions: () => true,
      open: async (_, options) => options.onReady?.()
    },
    setTimeout: (callback) => { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout: (id) => timers.delete(id),
    setInterval: () => ++nextTimer,
    clearInterval() {}
  });
  const sandbox = {
    window,
    document,
    Blob,
    Headers,
    URLSearchParams,
    HTMLElement: ElementStub,
    performance,
    navigator: { serviceWorker: Object.assign(new ElementStub(), {
      controller: { postMessage: (message) => calls.streams.push(message) }
    }) },
    location: { search: '', pathname: '/documentos/', replace: (url) => calls.navigation.push(url) },
    history: { replaceState() {} },
    confirm: (message) => { calls.confirms.push(message); return confirmResponse; },
    URL: { createObjectURL: () => 'blob:synthetic-pdf', revokeObjectURL: (url) => calls.revoked.push(url) },
    clearTimeout: window.clearTimeout,
    clearInterval: window.clearInterval,
    fetch: async (url, options) => {
      if (url.includes('/drive/content/')) {
        return { ok: true, blob: async () => new Blob(['%PDF-1.7\nsynthetic original'], { type: 'application/pdf' }) };
      }
      calls.requests.push({ url, options });
      let payload;
      let status = 200;
      if (url.endsWith('/preflight')) {
        if (failure) {
          status = failure === 'DRIVE_VERSION_CONFLICT' ? 409 : 503;
          payload = { code: failure, error: 'Falha de sincronização simulada' };
        } else payload = { allowed: true };
      } else if (url.endsWith('/start')) {
        payload = { syncId: 'test-session', chunkSize: 262144, safetyRevisionPreserved: true };
      } else if (url.includes('/upload/')) {
        if (uploadWait) await uploadWait;
        payload = incomplete ? { completed: true } : {
          completed: true, ref: 'confirmed-ref', cacheKey: 'confirmed-cache', currentVersion: '2'
        };
      } else assert.fail(`Unexpected request: ${url}`);
      return { ok: status < 400, status, headers: new Headers({ 'Content-Type': 'application/json' }), json: async () => payload };
    }
  };

  // TEST ONLY: expose closure state; the production listeners, exit/cleanup,
  // sync routine and HTTP-response validation execute without replacements.
  const source = fs.readFileSync(clientPath, 'utf8');
  const anchor = '  const oauthState = new URLSearchParams(location.search).get(\'oauth\');';
  assert.equal(source.split(anchor).length, 2, 'State exposure must have exactly one insertion point.');
  await vm.runInNewContext(source.replace(anchor, `  window.__closeGuardTest = { state };\n${anchor}`), sandbox, { filename: clientPath });
  const { state } = window.__closeGuardTest;
  const item = { ref: 'original-ref', cacheKey: 'original-cache', version: '1', name: 'Synthetic.pdf', isPdf: true };
  state.pdfItem = item;
  element('documentsViewer').hidden = false;
  element('documentsEditor').hidden = false;
  calls.api.length = 0;

  async function dispatch(target, type) {
    const listeners = target.listeners.get(type) || [];
    assert.ok(listeners.length, `Expected real ${type} listener.`);
    const errors = [];
    const event = { target, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    for (const listener of listeners) {
      Promise.resolve(listener(event)).catch((error) => errors.push(error));
    }
    // Like DOM dispatch, do not await an upload held open by the test.
    await drainTasks();
    if (errors.length) throw errors[0];
    return event;
  }

  // Start through the real edit-button listener so session policy is inferred
  // from actual capabilities, including sessions that begin as local-only.
  await dispatch(element('editPdfButton'), 'click');
  assert.equal(state.editorSession, session, 'The real editor-start listener must create the session.');
  session.revision = 2;
  state.driveSyncLastObservedRevision = 2;
  state.driveSyncVisualState = 'pending';

  return { state, session, item, calls, element, finishUpload,
    click: (id) => dispatch(element(id), 'click'),
    beforeunload: () => dispatch(window, 'beforeunload'),
    pagehide: () => dispatch(window, 'pagehide') };
}

function assertStillOpen(client) {
  assert.equal(client.state.editorSession, client.session, 'The edited session must survive.');
  assert.equal(client.state.pdfItem, client.item, 'The original document must remain open.');
  assert.equal(client.element('documentsViewer').hidden, false);
  assert.equal(client.calls.close, 0, 'The viewer must not be destroyed.');
}

for (const busyFlag of ['editorBusy', 'driveSyncInFlight']) {
  test(`real X listener preserves the session during ${busyFlag}`, async () => {
    const client = await createClient();
    client.state[busyFlag] = true;
    await client.click('closeViewerButton');
    assertStillOpen(client);
    assert.equal(client.state[busyFlag], true);
    assert.equal(client.calls.requests.length, 0);
  });
}

for (const failure of ['DRIVE_VERSION_CONFLICT', 'DRIVE_SYNC_UNAVAILABLE']) {
  test(`real X listener keeps edits after ${failure}`, async () => {
    const client = await createClient({ failure });
    await client.click('closeViewerButton');
    assertStillOpen(client);
    assert.equal(client.calls.requests.length, 1);
    assert.match(client.calls.requests[0].url, /\/sync\/preflight$/);
    assert.equal(client.state.driveSyncLastConfirmedRevision, 1);
    assert.equal(client.state.driveSyncVisualState, 'failed');
    assert.match(client.element('documentsEditorStatus').textContent, /permanecerá aberto/i);
  });
}

test('real X listener waits for confirmed upload before destroying the viewer', async () => {
  const client = await createClient({ holdUpload: true });
  await client.click('closeViewerButton');
  assertStillOpen(client);
  assert.equal(client.state.driveSyncInFlight, true);
  assert.equal(client.calls.requests.length, 3);
  assert.deepEqual(JSON.parse(client.calls.requests[0].options.body), {
    operation: 'replace_pdf', ref: 'original-ref', baseVersion: '1'
  });
  await client.click('closeViewerButton');
  assertStillOpen(client);
  assert.equal(client.calls.requests.length, 3, 'A second click must not start another upload.');
  client.finishUpload();
  await drainTasks();
  assert.equal(client.state.editorSession, null);
  assert.equal(client.state.pdfItem, null);
  assert.equal(client.element('documentsViewer').hidden, true);
  assert.equal(client.calls.close, 1);
});

test('completed upload without version confirmation cannot close the real viewer', async () => {
  const client = await createClient({ incomplete: true });
  await client.click('closeViewerButton');
  assertStillOpen(client);
  assert.equal(client.state.driveSyncVisualState, 'failed');
  assert.equal(client.state.driveSyncLastConfirmedRevision, 1);
});

test('real X listener retains a newer edit made while the prior revision uploads', async () => {
  const client = await createClient({ holdUpload: true });
  await client.click('closeViewerButton');
  client.session.revision = 3;
  client.finishUpload();
  await drainTasks();
  assert.equal(client.state.editorSession, client.session);
  assert.equal(client.state.driveSyncLastConfirmedRevision, 2);
  assert.equal(client.element('documentsViewer').hidden, false);
  assert.equal(client.calls.close, 0);
});

for (const gate of ['writeEnabled', 'connected', 'edit']) {
  test(`real X listener preserves pending edits when ${gate} is revoked`, async () => {
    const client = await createClient();
    if (gate === 'edit') client.state.access.capabilities.edit = false;
    else client.state.access.drive[gate] = false;
    await client.click('closeViewerButton');
    assertStillOpen(client);
    assert.equal(client.calls.requests.length, 0);
    assert.equal(client.calls.confirms.length, 0, 'A session requiring sync cannot fall back to local discard.');
  });
}

for (const button of ['closeViewerButton', 'editorExitButton', 'portalLogout']) {
  for (const confirmResponse of [true, false]) {
    test(`an initially local editor ${confirmResponse ? 'accepts' : 'cancels'} discard via ${button}`, async () => {
      const client = await createClient({ initialWriteEnabled: false, confirmResponse });
      await client.click(button);
      assert.equal(client.calls.confirms.length, 1);
      assert.match(client.calls.confirms[0], /descartar as alterações locais/i);
      assert.equal(client.calls.requests.length, 0, 'Local exit must never pretend to save to Drive.');
      if (!confirmResponse) {
        assertStillOpen(client);
        assert.equal(client.calls.logout, 0);
        assert.deepEqual(client.calls.navigation, []);
      } else {
        assert.equal(client.state.editorSession, null);
        assert.equal(client.element('documentsViewer').hidden, button !== 'editorExitButton');
        assert.equal(client.calls.logout, button === 'portalLogout' ? 1 : 0);
      }
    });
  }
}

test('local export followed by accepted discard closes without Drive requests', async () => {
  const client = await createClient({ initialWriteEnabled: false });
  await client.click('editorExportButton');
  assert.equal(client.calls.downloads.length, 1, 'The real export handler must initiate a local download.');
  assertStillOpen(client);
  assert.equal(client.state.driveSyncLastConfirmedRevision, 1);
  await client.click('closeViewerButton');
  assert.equal(client.calls.confirms.length, 1);
  assert.equal(client.state.editorSession, null);
  assert.equal(client.element('documentsViewer').hidden, true);
  assert.equal(client.calls.requests.length, 0);
});

test('a local editor that gains Drive sync cannot discard after the gate is revoked', async () => {
  const client = await createClient({ initialWriteEnabled: false });
  client.state.access.drive.writeEnabled = true;
  // Export runs the production control update before and after its operation.
  await client.click('editorExportButton');
  assert.equal(client.calls.downloads.length, 1);
  client.state.access.drive.writeEnabled = false;
  await client.click('closeViewerButton');
  assertStillOpen(client);
  assert.equal(client.calls.confirms.length, 0);
  assert.equal(client.calls.requests.length, 0);
});

test('read-only viewer closes normally and releases its URL and stream', async () => {
  const client = await createClient();
  client.state.editorSession = null;
  client.state.pdfObjectUrl = 'blob:test-readonly';
  client.state.pdfStreamId = 'test-stream';
  await client.click('closeViewerButton');
  assert.equal(client.state.pdfItem, null);
  assert.equal(client.element('documentsViewer').hidden, true);
  assert.equal(client.calls.close, 1);
  assert.deepEqual(client.calls.revoked, ['blob:test-readonly']);
  assert.equal(client.calls.streams[0].type, 'PORTAL_DOCUMENT_STREAM_RELEASE');
  assert.equal(client.calls.requests.length, 0);
});

test('an editor with its current revision confirmed closes without another upload', async () => {
  const client = await createClient();
  client.state.driveSyncLastConfirmedRevision = client.session.revision;
  client.state.driveSyncVisualState = 'normal';
  client.state.access.drive.writeEnabled = false;
  await client.click('closeViewerButton');
  assert.equal(client.state.editorSession, null);
  assert.equal(client.element('documentsViewer').hidden, true);
  assert.equal(client.calls.close, 1);
  assert.equal(client.calls.requests.length, 0);
});

test('beforeunload warns about pending changes even after the write gate is disabled', async () => {
  const client = await createClient();
  client.state.access.drive.writeEnabled = false;
  const event = await client.beforeunload();
  assert.equal(event.defaultPrevented, true);
  assert.equal(event.returnValue, '');
  assertStillOpen(client);
});

test('beforeunload warns during an editor operation even before its revision increments', async () => {
  const client = await createClient();
  client.state.driveSyncLastConfirmedRevision = client.session.revision;
  client.state.driveSyncVisualState = 'normal';
  client.state.editorBusy = true;
  const event = await client.beforeunload();
  assert.equal(event.defaultPrevented, true);
  assertStillOpen(client);
});

test('beforeunload allows leaving a read-only viewer', async () => {
  const client = await createClient();
  client.state.editorSession = null;
  const event = await client.beforeunload();
  assert.equal(event.defaultPrevented, false);
  assert.equal(event.returnValue, undefined);
});

for (const button of ['portalLogout', 'disconnectDriveButton']) {
  test(`${button} cannot revoke access or discard edits after failed sync`, async () => {
    const client = await createClient({ failure: 'DRIVE_VERSION_CONFLICT' });
    await client.click(button);
    assertStillOpen(client);
    assert.equal(client.calls.logout, 0);
    assert.equal(client.calls.api.length, 0);
    assert.deepEqual(client.calls.navigation, []);
  });

  test(`${button} proceeds after the Drive confirms the edited revision`, async () => {
    const client = await createClient();
    await client.click(button);
    assert.equal(client.state.editorSession, null);
    assert.equal(client.element('documentsViewer').hidden, true);
    assert.equal(client.calls.requests.length, 3);
    if (button === 'portalLogout') {
      assert.equal(client.calls.logout, 1);
      assert.deepEqual(client.calls.navigation, ['/login/']);
    } else {
      assert.equal(client.calls.api[0].url, '/api/documents/oauth/disconnect');
      assert.equal(client.element(button).disabled, false);
    }
  });
}

test('pagehide still performs synchronous cleanup without attempting asynchronous sync', async () => {
  const client = await createClient();
  client.state.editorBusy = true;
  const cleanup = client.pagehide();
  assert.equal(client.state.editorSession, null);
  assert.equal(client.state.pdfItem, null);
  assert.equal(client.calls.close, 1);
  assert.equal(client.calls.requests.length, 0);
  await cleanup;
});
