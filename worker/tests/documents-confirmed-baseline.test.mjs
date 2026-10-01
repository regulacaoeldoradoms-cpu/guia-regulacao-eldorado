import assert from 'node:assert/strict';
import test from 'node:test';
import {
  completeDriveOAuth,
  createDriveAuthorizationUrl,
  listDriveFolder,
  openDriveFileRef,
  preflightDriveSync,
  sealDriveFileRef,
  startDriveSync,
  uploadDriveSyncChunk
} from '../document-drive.js';

let DatabaseSync;
try { ({ DatabaseSync } = await import('node:sqlite')); } catch (_) {}
const sqliteTest = DatabaseSync ? test : test.skip;

class D1Statement {
  constructor(database, sql, values = []) { Object.assign(this, { database, sql, values }); }
  bind(...values) { return new D1Statement(this.database, this.sql, values); }
  run() {
    const result = this.database.prepare(this.sql).run(...this.values);
    return { success: true, meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } };
  }
  first() { return this.database.prepare(this.sql).get(...this.values) || null; }
  all() { return { results: this.database.prepare(this.sql).all(...this.values) }; }
}

const previewScope = {
  DOCUMENTS_HOMOLOGATION_CONTROL_ID: 'synthetic-control-a',
  DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN: 'https://preview-a.workers.dev',
  DOCUMENTS_HOMOLOGATION_ORIGIN: 'https://preview-a.pages.dev'
};

async function confirmedFixture(t, {
  scope = {}, fileId = 'synthetic-baseline-file', head = 'confirmed-head-8',
  username = 'baseline.editor', versions = { initial: '7', receipt: '8', confirmed: '9', drift: '11' },
  confirmationLagReads = 0
} = {}) {
  const database = new DatabaseSync(':memory:');
  const env = {
    AUTH_DB: { prepare: (sql) => new D1Statement(database, sql) },
    AUTH_SESSION_SECRET: 'baseline-session-test-only',
    GOOGLE_DRIVE_OAUTH_CLIENT_ID: 'baseline-client.apps.googleusercontent.com',
    GOOGLE_DRIVE_OAUTH_CLIENT_SECRET: 'baseline-client-secret-test-only',
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI: 'https://worker.test/api/documents/oauth/callback',
    DRIVE_TOKEN_ENCRYPTION_KEY: 'baseline-encryption-key-test-only-with-enough-entropy',
    DOCUMENTS_DRIVE_WRITE_ENABLED: 'true',
    ...scope
  };
  const pdf = new TextEncoder().encode('%PDF-1.7\nsynthetic-baseline\n');
  const base = {
    id: fileId, name: 'Synthetic.pdf', mimeType: 'application/pdf', size: String(pdf.length),
    version: versions.initial, headRevisionId: 'initial-head-7', md5Checksum: '0'.repeat(32),
    capabilities: { canEdit: true, canDownload: true }
  };
  const receipt = { ...base, version: versions.receipt, headRevisionId: head, md5Checksum: 'a'.repeat(32) };
  const drive = {
    metadata: base,
    receipt,
    afterUpload: { ...receipt, version: versions.confirmed },
    requests: [],
    starts: 0,
    uploaded: false,
    confirmationLagReadsRemaining: Math.max(0, Number(confirmationLagReads || 0))
  };
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; database.close(); });
  globalThis.fetch = async (url, options = {}) => {
    const target = new URL(String(url));
    drive.requests.push({ url: target.toString(), method: options.method || 'GET' });
    if (target.hostname === 'oauth2.googleapis.com') {
      return Response.json({ access_token: 'synthetic-access', refresh_token: 'synthetic-refresh', expires_in: 3600 });
    }
    assert.equal(target.hostname, 'www.googleapis.com');
    if (target.pathname.includes('/revisions/')) {
      assert.equal(options.method, 'PATCH');
      assert.equal(JSON.parse(options.body).keepForever, true);
      return Response.json({ keepForever: true });
    }
    if (target.pathname.startsWith('/upload/') && !target.searchParams.has('upload_id')) {
      assert.equal(options.method, 'PATCH');
      drive.starts += 1;
      return new Response(null, { headers: {
        Location: `https://www.googleapis.com/upload/drive/v3/files/${fileId}?upload_id=synthetic-${drive.starts}`
      } });
    }
    if (target.searchParams.has('upload_id')) {
      assert.equal(options.method, 'PUT');
      drive.metadata = drive.afterUpload;
      drive.uploaded = true;
      return Response.json(drive.receipt);
    }
    assert.equal(options.method, 'GET');
    if (target.pathname === '/drive/v3/files') return Response.json({ files: [drive.metadata] });
    assert.equal(target.pathname, `/drive/v3/files/${fileId}`);
    if (drive.uploaded && drive.confirmationLagReadsRemaining > 0) {
      drive.confirmationLagReadsRemaining -= 1;
      return Response.json(base);
    }
    return Response.json(drive.metadata);
  };

  const authorization = await createDriveAuthorizationUrl(env, username);
  await completeDriveOAuth(env, 'synthetic-code', new URL(authorization).searchParams.get('state'));
  const originalRef = await sealDriveFileRef(env, fileId, 'application/pdf');
  const start = (ref, baseVersion, actor = username) => startDriveSync(env, actor, {
    operation: 'replace_pdf', ref, baseVersion, totalBytes: pdf.length, preserveRevision: true
  });
  const upload = (syncId) => uploadDriveSyncChunk(env, username, syncId, new Request('https://worker.test/synthetic', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/pdf', 'Content-Range': `bytes 0-${pdf.length - 1}/${pdf.length}` },
    body: pdf
  }));
  const first = await start(originalRef, versions.initial);
  const completed = await upload(first.syncId);
  assert.equal(completed.completed, true);
  assert.equal(completed.currentVersion, versions.confirmed);
  const input = { operation: 'replace_pdf', ref: completed.ref, baseVersion: versions.confirmed };
  drive.metadata = { ...drive.afterUpload, version: versions.drift };
  const preflight = (overrides = {}, actor = username) => preflightDriveSync(env, { ...input, ...overrides }, actor);
  return { env, username, drive, completed, originalRef, input, preflight, start, upload };
}

const versionConflict = (error) => error?.code === 'DRIVE_VERSION_CONFLICT' && error.status === 409;

sqliteTest('completion tolerates stale Drive metadata immediately after a successful upload', async (t) => {
  const fixture = await confirmedFixture(t, { confirmationLagReads: 1 });
  assert.equal(fixture.completed.completed, true);
  assert.equal(fixture.completed.currentVersion, '9');
  assert.equal(fixture.drive.confirmationLagReadsRemaining, 0);
  assert.ok(
    fixture.drive.requests.filter(({ method, url }) => method === 'GET' && /\/drive\/v3\/files\/synthetic-baseline-file/.test(url)).length >= 2
  );
});

sqliteTest('confirmed baseline allows metadata drift on the next preflight and start', async (t) => {
  const fixture = await confirmedFixture(t);
  const result = await fixture.preflight();
  assert.equal(result.currentVersion, '11');
  assert.equal(result.blocking, false);
  const next = await fixture.start(fixture.completed.ref, '9');
  assert.ok(next.syncId);
  assert.equal(fixture.drive.starts, 2);
});

sqliteTest('a confirmed baseline permits drift within the same preview control and origins', async (t) => {
  const fixture = await confirmedFixture(t, { scope: previewScope });
  assert.equal((await fixture.preflight()).blocking, false);
  assert.ok((await fixture.start(fixture.completed.ref, '9')).syncId);
});

sqliteTest('completion keeps baseline private inside a compatible opaque file reference', async (t) => {
  const fixture = await confirmedFixture(t, { fileId: 'f'.repeat(300), head: 'revision-'.repeat(400) });
  assert.deepEqual(Object.keys(fixture.completed).sort(), [
    'cacheKey', 'completed', 'currentVersion', 'modifiedTime', 'operation', 'ref', 'size', 'superseded'
  ].sort());
  assert.equal(fixture.completed.superseded, false);
  assert.ok(fixture.completed.ref.length <= 1200);
  assert.deepEqual(await openDriveFileRef(fixture.env, fixture.completed.ref), { id: 'f'.repeat(300), mime: 'application/pdf' });
  assert.equal((await fixture.preflight()).blocking, false);
});

sqliteTest('maximum file ID, actor and version fit existing ref limits with long preview origins and head', async (t) => {
  const versions = { initial: '1'.repeat(40), receipt: '2'.repeat(40), confirmed: '3'.repeat(40), drift: '4'.repeat(40) };
  const fixture = await confirmedFixture(t, {
    fileId: 'f'.repeat(300), username: 'u'.repeat(40), head: 'long-head-'.repeat(400), versions,
    scope: {
      DOCUMENTS_HOMOLOGATION_CONTROL_ID: 'c'.repeat(80),
      DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN: `https://${'w'.repeat(63)}.${'s'.repeat(63)}.workers.dev`,
      DOCUMENTS_HOMOLOGATION_ORIGIN: `https://${'p'.repeat(63)}.${'s'.repeat(63)}.pages.dev`
    }
  });
  assert.ok(fixture.completed.ref.length <= 1200, 'The complete ref must still pass the content route limit.');
  assert.ok(fixture.completed.ref.split('.')[1].length <= 1000, 'Its ciphertext must still pass openDriveFileRef.');
  assert.deepEqual(await openDriveFileRef(fixture.env, fixture.completed.ref), { id: 'f'.repeat(300), mime: 'application/pdf' });
  assert.equal((await fixture.preflight()).currentVersion, versions.drift);
  assert.ok((await fixture.start(fixture.completed.ref, versions.confirmed)).syncId);
});

sqliteTest('last-write-wins accepts remote content drift without blocking replace', async (t) => {
  const fixture = await confirmedFixture(t);
  fixture.drive.metadata = {
    ...fixture.drive.metadata,
    version: '12',
    headRevisionId: 'external-head-12',
    md5Checksum: 'b'.repeat(32),
    size: '999',
    capabilities: { canEdit: true, canDownload: true }
  };

  const result = await fixture.preflight();
  assert.equal(result.blocking, false);
  assert.equal(result.conflict, false);
  assert.equal(result.sourceChangedSinceOpen, true);
  assert.equal(result.currentVersion, '12');

  const next = await fixture.start(fixture.completed.ref, '9');
  assert.ok(next.syncId);
  assert.equal(next.conflictDetected, false);
  assert.equal(next.sourceChangedSinceOpen, true);
  assert.equal(fixture.drive.starts, 2);
});

for (const baseVersion of ['7', '8', '10']) {
  sqliteTest(`last-write-wins permits stale client baseVersion ${baseVersion}`, async (t) => {
    const fixture = await confirmedFixture(t);
    fixture.drive.metadata.version = '11';
    const result = await fixture.preflight({ baseVersion });
    assert.equal(result.blocking, false);
    assert.equal(result.conflict, false);
    assert.equal(result.sourceChangedSinceOpen, true);
    assert.ok((await fixture.start(fixture.completed.ref, baseVersion)).syncId);
  });
}

sqliteTest('tampering with a confirmed opaque reference is rejected before Drive lookup', async (t) => {
  const fixture = await confirmedFixture(t);
  const parts = fixture.completed.ref.split('.');
  const index = Math.floor(parts[1].length / 2);
  parts[1] = parts[1].slice(0, index) + (parts[1][index] === 'A' ? 'B' : 'A') + parts[1].slice(index + 1);
  const reads = fixture.drive.requests.length;
  await assert.rejects(fixture.preflight({ ref: parts.join('.') }), (error) => error.code === 'DRIVE_FILE_REF_INVALID');
  assert.equal(fixture.drive.requests.length, reads);
});

sqliteTest('stale second tab is allowed to save last under last-write-wins', async (t) => {
  const fixture = await confirmedFixture(t);
  const staleRef = fixture.originalRef;
  fixture.drive.metadata = { ...fixture.drive.metadata, version: '11', headRevisionId: 'external-head-11' };

  const stalePreflight = await preflightDriveSync(fixture.env, {
    operation: 'replace_pdf',
    ref: staleRef,
    baseVersion: '7'
  }, fixture.username);
  assert.equal(stalePreflight.blocking, false);
  assert.equal(stalePreflight.sourceChangedSinceOpen, true);

  const started = await fixture.start(staleRef, '7');
  assert.ok(started.syncId);
  assert.equal(started.sourceChangedSinceOpen, true);
});

sqliteTest('start revalidates current metadata but does not block a later remote version', async (t) => {
  const fixture = await confirmedFixture(t);
  assert.equal((await fixture.preflight()).blocking, false);
  fixture.drive.metadata = { ...fixture.drive.metadata, version: '12', headRevisionId: 'external-after-preflight' };
  const started = await fixture.start(fixture.completed.ref, '9');
  assert.ok(started.syncId);
  assert.equal(started.sourceChangedSinceOpen, true);
  assert.equal(fixture.drive.starts, 2);
});

sqliteTest('a valid baseline never bypasses a disabled write gate or current file capabilities', async (t) => {
  const fixture = await confirmedFixture(t);
  fixture.env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'false';
  const reads = fixture.drive.requests.length;
  await assert.rejects(fixture.start(fixture.completed.ref, '9'), (error) => error.code === 'DRIVE_SYNC_WRITE_DISABLED');
  assert.equal(fixture.drive.requests.length, reads);
  fixture.env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'true';
  fixture.drive.metadata.capabilities = { canEdit: false, canModifyContent: false };
  await assert.rejects(fixture.preflight(), (error) => error.code === 'DRIVE_FILE_NOT_EDITABLE' && error.status === 403);
  assert.equal(fixture.drive.starts, 1);
});
