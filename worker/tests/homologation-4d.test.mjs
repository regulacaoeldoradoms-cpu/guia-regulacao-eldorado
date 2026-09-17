import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { createHomologation4dWorker } from '../homologation-4d.js';
import { completeDriveOAuth, createDriveAuthorizationUrl, openDriveFileRef, sealDriveFileRef } from '../document-drive.js';
import { handlePortalRoute } from '../auth-management-v2.js';
import { setDocumentCapabilities } from '../document-access.js';

const WORKER = 'https://four-d-test.example.workers.dev';
const PAGES = 'https://four-d-test.example.pages.dev';
const USERNAME = 'homologacao.teste';
const FILE = 'DISPOSABLE_FILE_4D_01';
const OTHER_FILE = 'DISPOSABLE_OTHER_4D_02';
const SYNC = 'synthetic_session_identifier_4d_0001';
const SCHEMA = readFileSync(new URL('../migrations/central-documents-homologation-4d.sql', import.meta.url), 'utf8');

class Statement {
  constructor(db, sql, values = []) { Object.assign(this, { db, sql, values }); }
  bind(...values) { return new Statement(this.db, this.sql, values); }
  first() { return this.db.prepare(this.sql).get(...this.values) || null; }
  all() { return { results: this.db.prepare(this.sql).all(...this.values) }; }
  run() {
    const result = this.db.prepare(this.sql).run(...this.values);
    return { success: true, meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } };
  }
}

function fixture(t, options = {}) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(SCHEMA);
  const env = {
    AUTH_DB: { prepare: (sql) => new Statement(db, sql) },
    AUTH_SESSION_SECRET: 'synthetic-auth-secret-for-4d-tests',
    AUTH_RATE_LIMIT_SECRET: 'synthetic-rate-secret-for-4d-tests',
    DRIVE_TOKEN_ENCRYPTION_KEY: 'synthetic-reference-secret-for-4d-tests',
    DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN: WORKER,
    DOCUMENTS_HOMOLOGATION_ORIGIN: PAGES,
    DOCUMENTS_HOMOLOGATION_CONTROL_ID: 'synthetic-control-4d',
    DOCUMENTS_DRIVE_WRITE_ENABLED: 'true'
  };
  db.prepare('INSERT INTO document_drive_homologation_controls VALUES (?, 1, ?, ?, ?)')
    .run(env.DOCUMENTS_HOMOLOGATION_CONTROL_ID, Math.floor(Date.now() / 1000) + 600, USERNAME, JSON.stringify([FILE]));
  const calls = { portal: [], google: [] };
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls.google.push({ url: String(url), method: init?.method || 'GET' });
    return new Response('{}', { status: 200 });
  });
  const authorizedUser = { username: USERNAME, documentCapabilities: { view: true, edit: true } };
  const dependencies = {
    validateSession: async (request) => request.headers.get('Authorization') === 'Bearer synthetic-session'
      ? (options.user || authorizedUser) : null,
    portalFetch: async (request) => {
      const path = new URL(request.url).pathname;
      calls.portal.push(path);
      if (path.includes('/sync/') || path.includes('/content/')) {
        await fetch('https://www.googleapis.com/drive/v3/synthetic-test-only', { method: request.method });
      }
      if (path.endsWith('/start')) return Response.json({ syncId: SYNC }, { status: 201 });
      if (path.includes('/upload/')) return Response.json({ completed: options.completeUpload === true });
      if (path.includes('/status/')) return Response.json({ completed: true });
      if (request.method === 'DELETE') return Response.json({ cancelled: true });
      return Response.json({ ok: true });
    },
    preflight: async (innerEnv, input) => {
      const file = await openDriveFileRef(innerEnv, input.ref);
      await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`);
      return { currentVersion: '2', size: 100, modifiedTime: '', canEditOriginal: true };
    },
    ...options.dependencies
  };
  return { db, env, calls, worker: createHomologation4dWorker(dependencies) };
}

function request(path, { method = 'GET', body, origin = PAGES, host = WORKER, token = 'synthetic-session', headers = {} } = {}) {
  return new Request(host + path, {
    method,
    headers: { ...(origin ? { Origin: origin } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

async function start(f) {
  const ref = await sealDriveFileRef(f.env, FILE, 'application/pdf');
  return f.worker.fetch(request('/api/documents/drive/sync/start', {
    method: 'POST', body: { operation: 'replace_pdf', ref, baseVersion: '1', totalBytes: 100 }
  }), f.env, {});
}

function assertNoUpstream(f) {
  assert.deepEqual(f.calls.google, []);
  assert.deepEqual(f.calls.portal, []);
}

test('preview rejects production/other hosts, missing/other origins and configuration before upstream', async (t) => {
  const f = fixture(t);
  for (const options of [
    { host: 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev' },
    { host: 'https://immutable-other.example.workers.dev' },
    { origin: '' }, { origin: 'https://regulacaoeldoradoms.com.br' }, { origin: 'https://other.pages.dev' }
  ]) assert.equal((await f.worker.fetch(request('/api/documents/access', options), f.env, {})).status, 403);
  delete f.env.DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN;
  assert.equal((await f.worker.fetch(request('/api/documents/access'), f.env, {})).status, 403);
  assertNoUpstream(f);
});

test('missing table/row, expired, revoked and malformed control fail closed without upstream', async (t) => {
  const f = fixture(t);
  for (const sql of [
    'UPDATE document_drive_homologation_controls SET enabled = 0',
    'UPDATE document_drive_homologation_controls SET enabled = 1, expires_at = 1',
    "UPDATE document_drive_homologation_controls SET expires_at = 9999999999, allowed_file_ids_json = 'not-json'",
    'DELETE FROM document_drive_homologation_controls',
    'DROP TABLE document_drive_homologation_controls'
  ]) {
    f.db.exec(sql);
    assert.ok([403, 503].includes((await f.worker.fetch(request('/api/documents/access'), f.env, {})).status));
  }
  assertNoUpstream(f);
});

test('OAuth, admin, other modules, mutation of preferences, queries and copy are denied', async (t) => {
  const f = fixture(t);
  for (const [method, path] of [
    ['POST', '/api/documents/oauth/start'], ['GET', '/api/documents/oauth/callback'],
    ['POST', '/api/documents/oauth/disconnect'], ['PATCH', '/api/documents/admin/access/test'],
    ['PATCH', '/api/documents/preferences'], ['POST', '/api/auth/register'],
    ['POST', '/api/auth/change-password'], ['GET', '/api/social/feed'],
    ['GET', '/api/documents/access?other=true']
  ]) assert.equal((await f.worker.fetch(request(path, { method }), f.env, {})).status, 403);
  assert.equal((await f.worker.fetch(request('/api/documents/drive/sync/start', {
    method: 'POST', body: { operation: 'save_copy' }
  }), f.env, {})).status, 403);
  assertNoUpstream(f);
});

test('normal session and live view/edit capabilities are required', async (t) => {
  const f = fixture(t);
  assert.equal((await f.worker.fetch(request('/api/documents/access', { token: '' }), f.env, {})).status, 401);
  for (const user of [
    { username: 'other.user', documentCapabilities: { view: true, edit: true } },
    { username: USERNAME, documentCapabilities: { view: false, edit: true } },
    { username: USERNAME, documentCapabilities: { view: true, edit: false } }
  ]) {
    const worker = createHomologation4dWorker({ validateSession: async () => user, portalFetch: async () => assert.fail('must not forward') });
    assert.equal((await worker.fetch(request('/api/documents/drive/sync/start', { method: 'POST', body: {} }), f.env, {})).status, 403);
  }
  assertNoUpstream(f);
});

test('unknown login account is denied before real authentication, allowed login delegates normally', async (t) => {
  const f = fixture(t);
  assert.equal((await f.worker.fetch(request('/api/auth/login', { method: 'POST', body: { username: 'other.user' } }), f.env, {})).status, 403);
  assertNoUpstream(f);
  assert.equal((await f.worker.fetch(request('/api/auth/login', { method: 'POST', body: { username: USERNAME, password: 'synthetic' } }), f.env, {})).status, 200);
  assert.deepEqual(f.calls.portal, ['/api/auth/login']);
  assert.deepEqual(f.calls.google, []);
});

test('foreign PDF references are denied for content/preflight/start with zero Google requests', async (t) => {
  const f = fixture(t);
  const ref = await sealDriveFileRef(f.env, OTHER_FILE, 'application/pdf');
  assert.equal((await f.worker.fetch(request(`/api/documents/drive/content/${ref}`), f.env, {})).status, 403);
  for (const action of ['preflight', 'start']) {
    assert.equal((await f.worker.fetch(request(`/api/documents/drive/sync/${action}`, {
      method: 'POST', body: { operation: 'replace_pdf', ref, baseVersion: '1' }
    }), f.env, {})).status, 403);
  }
  assertNoUpstream(f);
});

test('list/search read only allowlisted PDFs and expose synthetic names without raw IDs', async (t) => {
  const f = fixture(t);
  for (const action of ['list', 'search']) {
    const response = await f.worker.fetch(request(`/api/documents/drive/${action}`, { method: 'POST', body: { query: 'arbitrary' } }), f.env, {});
    assert.equal(response.status, 200);
    const text = await response.text();
    assert.equal(text.includes(FILE), false);
    const payload = JSON.parse(text);
    assert.equal(payload.items.length, 1);
    assert.equal(payload.items[0].name, 'PDF descartável 4D 1.pdf');
    assert.equal((await openDriveFileRef(f.env, payload.items[0].ref)).id, FILE);
  }
  assert.equal(f.calls.google.length, 2);
  assert.ok(f.calls.google.every((call) => call.url.endsWith('/files/' + FILE)));
  assert.deepEqual(f.calls.portal, []);
});

test('unregistered, foreign control, foreign actor, removed file and expired upload sessions are denied', async (t) => {
  const f = fixture(t);
  const send = () => f.worker.fetch(request(`/api/documents/drive/sync/upload/${SYNC}`, { method: 'PUT' }), f.env, {});
  assert.equal((await send()).status, 403);
  for (const [control, user, file, expiry] of [
    ['different-control', USERNAME, FILE, 9999999999],
    [f.env.DOCUMENTS_HOMOLOGATION_CONTROL_ID, 'other.user', FILE, 9999999999],
    [f.env.DOCUMENTS_HOMOLOGATION_CONTROL_ID, USERNAME, OTHER_FILE, 9999999999],
    [f.env.DOCUMENTS_HOMOLOGATION_CONTROL_ID, USERNAME, FILE, 1]
  ]) {
    f.db.prepare('INSERT OR REPLACE INTO document_drive_homologation_sessions VALUES (?, ?, ?, ?, ?)').run(control, SYNC, user, file, expiry);
    assert.equal((await send()).status, 403);
  }
  assertNoUpstream(f);
});

test('start records allowed session; upload delegates; completion removes scope registry', async (t) => {
  const f = fixture(t);
  assert.equal((await start(f)).status, 201);
  const row = f.db.prepare('SELECT * FROM document_drive_homologation_sessions WHERE sync_id = ?').get(SYNC);
  assert.equal(row.file_id, FILE);
  assert.equal(row.username, USERNAME);
  assert.equal((await f.worker.fetch(request(`/api/documents/drive/sync/upload/${SYNC}`, { method: 'PUT' }), f.env, {})).status, 200);
  assert.equal((await f.worker.fetch(request(`/api/documents/drive/sync/status/${SYNC}`, { method: 'POST' }), f.env, {})).status, 200);
  assert.equal(f.db.prepare('SELECT count(*) AS n FROM document_drive_homologation_sessions').get().n, 0);
  assert.equal(f.calls.google.length, 3);
});

test('revocation after start blocks same immutable preview and existing session without more Google fetches', async (t) => {
  const f = fixture(t);
  assert.equal((await start(f)).status, 201);
  f.calls.google.length = 0;
  f.calls.portal.length = 0;
  f.db.exec('UPDATE document_drive_homologation_controls SET enabled = 0');
  for (const [method, suffix] of [['PUT', 'upload/'], ['POST', 'status/'], ['DELETE', '']]) {
    assert.equal((await f.worker.fetch(request(`/api/documents/drive/sync/${suffix}${SYNC}`, { method }), f.env, {})).status, 403);
  }
  assertNoUpstream(f);
});

test('gate off and missing session registry prevent any Google mutation', async (t) => {
  const f = fixture(t);
  f.env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'false';
  assert.equal((await start(f)).status, 503);
  f.env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'true';
  f.db.exec('DROP TABLE document_drive_homologation_sessions');
  assert.equal((await start(f)).status, 503);
  assertNoUpstream(f);
});

test('revocation during authentication is rechecked before start', async (t) => {
  const f = fixture(t);
  f.worker = createHomologation4dWorker({
    validateSession: async () => {
      f.db.exec('UPDATE document_drive_homologation_controls SET enabled = 0');
      return { username: USERNAME, documentCapabilities: { view: true, edit: true } };
    },
    portalFetch: async () => assert.fail('revocation must stop forwarding')
  });
  assert.equal((await start(f)).status, 403);
  assertNoUpstream(f);
});

test('oversized body is refused before upstream even without a Content-Length header', async (t) => {
  const f = fixture(t);
  assert.equal((await f.worker.fetch(request('/api/auth/login', { method: 'POST', body: { username: USERNAME, password: 'x'.repeat(17000) } }), f.env, {})).status, 503);
  assertNoUpstream(f);
});

test('preflight CORS is exact and cannot grant excluded routes', async (t) => {
  const f = fixture(t);
  const response = await f.worker.fetch(request('/api/documents/drive/sync/start', { method: 'OPTIONS', token: '', headers: { 'Access-Control-Request-Method': 'POST' } }), f.env, {});
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), PAGES);
  assert.equal(response.headers.get('Access-Control-Max-Age'), '0');
  assert.equal((await f.worker.fetch(request('/api/documents/oauth/disconnect', { method: 'OPTIONS', headers: { 'Access-Control-Request-Method': 'POST' } }), f.env, {})).status, 403);
  assertNoUpstream(f);
});

test('default authentication validates actual Portal sessions and current capability revocation', async (t) => {
  const f = fixture(t);
  const registration = await handlePortalRoute(request('/api/auth/register', {
    method: 'POST', body: { username: USERNAME, password: 'Synthetic-Test-Password-2026' },
    headers: { 'CF-Connecting-IP': '127.0.0.201' }
  }), f.env, PAGES, true);
  assert.equal(registration.status, 201);
  const { token } = await registration.json();
  await setDocumentCapabilities(f.env, USERNAME, { view: true, edit: true }, 'synthetic.admin');
  const worker = createHomologation4dWorker({ portalFetch: async () => Response.json({ ok: true }) });
  assert.equal((await worker.fetch(request('/api/documents/access', { token }), f.env, {})).status, 200);
  await setDocumentCapabilities(f.env, USERNAME, { view: false, edit: false }, 'synthetic.admin');
  assert.equal((await worker.fetch(request('/api/documents/access', { token }), f.env, {})).status, 403);
  assert.deepEqual(f.calls.google, []);
});

test('file removal during authorization also stops an existing upload on the second control read', async (t) => {
  const f = fixture(t);
  assert.equal((await start(f)).status, 201);
  f.calls.google.length = 0;
  f.calls.portal.length = 0;
  const worker = createHomologation4dWorker({
    validateSession: async () => {
      f.db.prepare('UPDATE document_drive_homologation_controls SET allowed_file_ids_json = ?').run(JSON.stringify([OTHER_FILE]));
      return { username: USERNAME, documentCapabilities: { view: true, edit: true } };
    },
    portalFetch: async () => assert.fail('removed file must not upload')
  });
  assert.equal((await worker.fetch(request(`/api/documents/drive/sync/upload/${SYNC}`, { method: 'PUT' }), f.env, {})).status, 403);
  assertNoUpstream(f);
});

test('real Portal/Drive handlers integrate login, listing, content, gate off and a scoped resumable replacement', async (t) => {
  const f = fixture(t);
  Object.assign(f.env, {
    GOOGLE_DRIVE_OAUTH_CLIENT_ID: 'synthetic-4d.apps.googleusercontent.com',
    GOOGLE_DRIVE_OAUTH_CLIENT_SECRET: 'synthetic-4d-client-secret',
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI: WORKER + '/api/documents/oauth/callback'
  });
  const pdf = '%PDF-1.7\nsynthetic only\n';
  const metadata = { id: FILE, mimeType: 'application/pdf', version: '7', size: String(pdf.length),
    headRevisionId: 'synthetic-revision-7', parents: ['SYNTHETIC_FOLDER_01'],
    capabilities: { canDownload: true, canEdit: true } };
  t.mock.method(globalThis, 'fetch', async (url, init = {}) => {
    const value = new URL(String(url));
    const method = init.method || 'GET';
    f.calls.google.push({ url: value.toString(), method });
    if (value.hostname === 'oauth2.googleapis.com') return Response.json({
      access_token: 'synthetic-access-token', refresh_token: 'synthetic-refresh-token', expires_in: 3600
    });
    assert.equal(value.hostname, 'www.googleapis.com');
    assert.ok(value.pathname.includes(FILE), 'no unrelated Drive file may be fetched');
    if (value.searchParams.get('alt') === 'media') return new Response(pdf, { headers: { 'Content-Type': 'application/pdf' } });
    if (value.pathname.endsWith('/revisions/synthetic-revision-7')) {
      assert.equal(method, 'PATCH');
      assert.equal(JSON.parse(init.body).keepForever, true);
      return Response.json({ id: 'synthetic-revision-7', keepForever: true });
    }
    if (value.pathname.startsWith('/upload/') && method === 'PATCH') return new Response(null, { headers: {
      Location: `https://www.googleapis.com/upload/drive/v3/files/${FILE}?upload_id=synthetic-4d-upload`
    } });
    if (value.searchParams.has('upload_id')) {
      assert.equal(method, 'PUT');
      return Response.json({ ...metadata, version: '8' });
    }
    assert.equal(method, 'GET');
    return Response.json(metadata);
  });

  const registered = await handlePortalRoute(request('/api/auth/register', {
    method: 'POST', body: { username: USERNAME, password: 'Synthetic-Test-Password-2026' },
    headers: { 'CF-Connecting-IP': '127.0.0.202' }
  }), f.env, PAGES, true);
  assert.equal(registered.status, 201);
  const unrelated = await handlePortalRoute(request('/api/auth/register', {
    method: 'POST', body: { username: 'unrelated.legacy', password: 'Synthetic-Test-Password-2026' },
    headers: { 'CF-Connecting-IP': '127.0.0.203' }
  }), f.env, PAGES, true);
  assert.equal(unrelated.status, 201);
  f.db.exec("UPDATE auth_users SET role = 'telemedicina' WHERE username = 'unrelated.legacy'");
  await setDocumentCapabilities(f.env, USERNAME, { view: true, edit: true }, 'synthetic.admin');
  const authorizationUrl = await createDriveAuthorizationUrl(f.env, USERNAME);
  await completeDriveOAuth(f.env, 'synthetic-code', new URL(authorizationUrl).searchParams.get('state'));
  f.calls.google.length = 0;

  const worker = createHomologation4dWorker();
  const login = await worker.fetch(request('/api/auth/login', {
    method: 'POST', token: '', body: { username: USERNAME, password: 'Synthetic-Test-Password-2026' }
  }), f.env, {});
  assert.equal(login.status, 200);
  const { token, user } = await login.json();
  assert.equal(user.documentCapabilities.edit, true);
  assert.equal((await worker.fetch(request('/api/auth/me', { token }), f.env, {})).status, 200);
  f.env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'false';
  const access = await worker.fetch(request('/api/documents/access', { token }), f.env, {});
  assert.equal((await access.json()).drive.writeEnabled, false);
  const listed = await worker.fetch(request('/api/documents/drive/list', { method: 'POST', body: {}, token }), f.env, {});
  assert.equal(listed.status, 200);
  const item = (await listed.json()).items[0];
  assert.equal(item.version, '7');
  assert.equal(item.canEdit, true);
  const content = await worker.fetch(request('/api/documents/drive/content/' + item.ref, { token }), f.env, {});
  assert.equal(content.status, 200);
  assert.equal(content.headers.get('Content-Type'), 'application/pdf');
  assert.equal(await content.text(), pdf);
  const body = { operation: 'replace_pdf', ref: item.ref, baseVersion: item.version, totalBytes: pdf.length, preserveRevision: false };
  const beforeBlockedStart = f.calls.google.length;
  const disabledStart = await worker.fetch(request('/api/documents/drive/sync/start', { method: 'POST', body, token }), f.env, {});
  assert.equal(disabledStart.status, 503);
  assert.equal(f.calls.google.length, beforeBlockedStart);

  f.env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'true';
  const started = await worker.fetch(request('/api/documents/drive/sync/start', { method: 'POST', body, token }), f.env, {});
  assert.equal(started.status, 201);
  const { syncId, safetyRevisionPreserved } = await started.json();
  assert.equal(safetyRevisionPreserved, true);
  assert.ok(f.calls.google.some((call) => call.method === 'PATCH' && call.url.includes('/revisions/synthetic-revision-7')));
  const upload = await worker.fetch(new Request(`${WORKER}/api/documents/drive/sync/upload/${syncId}`, {
    method: 'PUT', headers: { Origin: PAGES, Authorization: `Bearer ${token}`,
      'Content-Type': 'application/pdf', 'Content-Range': `bytes 0-${pdf.length - 1}/${pdf.length}` }, body: pdf
  }), f.env, {});
  assert.equal(upload.status, 200);
  const completed = await upload.json();
  assert.equal(completed.completed, true);
  assert.equal(completed.currentVersion, '8');
  assert.equal(f.db.prepare('SELECT count(*) AS n FROM document_drive_homologation_sessions').get().n, 0);
  assert.equal(f.db.prepare('SELECT count(*) AS n FROM document_drive_sync_sessions').get().n, 0);
  assert.equal(f.db.prepare("SELECT role FROM auth_users WHERE username = 'unrelated.legacy'").get().role, 'telemedicina');
});

test('reviewed schema is idempotent and provisions no enabled control', (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(SCHEMA);
  db.exec(SCHEMA);
  assert.equal(db.prepare('SELECT count(*) AS n FROM document_drive_homologation_controls').get().n, 0);
  db.prepare(`INSERT INTO document_drive_homologation_controls
    (control_id, expires_at, allowed_username, allowed_file_ids_json) VALUES (?, ?, ?, ?)`)
    .run('synthetic-new-control', 9999999999, USERNAME, JSON.stringify([FILE]));
  assert.equal(db.prepare('SELECT enabled FROM document_drive_homologation_controls').get().enabled, 0);
});

test('cache identity follows the file, not its position in the controlled allowlist', async (t) => {
  const f = fixture(t);
  const list = async () => {
    const response = await f.worker.fetch(request('/api/documents/drive/list', { method: 'POST', body: {} }), f.env, {});
    return (await response.json()).items;
  };
  const first = (await list())[0];
  f.db.prepare('UPDATE document_drive_homologation_controls SET allowed_file_ids_json = ?').run(JSON.stringify([OTHER_FILE, FILE]));
  const reordered = await list();
  assert.equal(first.cacheKey, reordered[1].cacheKey);
  assert.notEqual(first.cacheKey, reordered[0].cacheKey);
  assert.equal(first.cacheKey.includes(FILE), false);
});
