import assert from 'node:assert/strict';
import test from 'node:test';

let DatabaseSync = null;
try {
  ({ DatabaseSync } = await import('node:sqlite'));
} catch (_) {}
const sqliteTest = DatabaseSync ? test : test.skip;

import {
  completeDriveOAuth,
  createDriveAuthorizationUrl,
  disconnectDrive,
  renameDrivePdf,
  sealDriveFileRef
} from '../document-drive.js';

class D1Statement {
  constructor(database, sql, values = []) {
    this.database = database;
    this.sql = sql;
    this.values = values;
  }
  bind(...values) {
    return new D1Statement(this.database, this.sql, values);
  }
  run() {
    const result = this.database.prepare(this.sql).run(...this.values);
    return {
      success: true,
      meta: {
        changes: Number(result.changes || 0),
        last_row_id: Number(result.lastInsertRowid || 0)
      }
    };
  }
  first() {
    return this.database.prepare(this.sql).get(...this.values) || null;
  }
  all() {
    return { results: this.database.prepare(this.sql).all(...this.values) };
  }
}

class D1Database {
  constructor() {
    this.database = new DatabaseSync(':memory:');
  }
  prepare(sql) {
    return new D1Statement(this.database, sql);
  }
}

function environment() {
  return {
    AUTH_DB: new D1Database(),
    AUTH_SESSION_SECRET: 'rename-session-secret-test-only',
    GOOGLE_DRIVE_OAUTH_CLIENT_ID: 'rename-test.apps.googleusercontent.com',
    GOOGLE_DRIVE_OAUTH_CLIENT_SECRET: 'rename-client-secret-test-only',
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI: 'https://worker.test/api/documents/oauth/callback',
    DRIVE_TOKEN_ENCRYPTION_KEY: 'rename-encryption-key-with-enough-entropy',
    DOCUMENTS_DRIVE_WRITE_ENABLED: 'true'
  };
}

function driveMetadata({ name, version }) {
  return {
    id: 'rename-sensitive-file-id',
    name,
    mimeType: 'application/pdf',
    size: '12345',
    modifiedTime: version === '7' ? '2026-09-21T00:00:00Z' : '2026-09-21T00:01:00Z',
    version,
    md5Checksum: '0123456789abcdef0123456789abcdef',
    headRevisionId: 'head-revision-same-content',
    parents: ['parent-sensitive'],
    capabilities: { canDownload: true, canEdit: true, canModifyContent: true }
  };
}

sqliteTest('renomeação do Titon altera o arquivo real no Drive e devolve baseline atualizada sem expor fileId', async () => {
  const env = environment();
  const authorization = await createDriveAuthorizationUrl(env, 'operador.rename');
  const state = new URL(authorization).searchParams.get('state');
  const calls = [];
  let phase = 'oauth';

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options = {}) => {
    const text = String(url);
    const method = String(options.method || 'GET').toUpperCase();
    calls.push({ url: text, method, body: String(options.body || '') });

    if (phase === 'oauth') {
      assert.equal(text, 'https://oauth2.googleapis.com/token');
      return new Response(JSON.stringify({
        access_token: 'rename-access-token',
        refresh_token: 'rename-refresh-token',
        expires_in: 3600,
        scope: 'https://www.googleapis.com/auth/drive'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const driveUrl = new URL(text);
    assert.equal(driveUrl.origin, 'https://www.googleapis.com');
    assert.match(driveUrl.pathname, /\/drive\/v3\/files\/rename-sensitive-file-id$/);
    assert.match(driveUrl.searchParams.get('fields') || '', /name/);

    if (method === 'GET' && calls.filter((call) => call.method === 'GET' && call.url.startsWith('https://www.googleapis.com/')).length === 1) {
      return new Response(JSON.stringify(driveMetadata({ name: 'Antigo.pdf', version: '7' })), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'PATCH') {
      assert.deepEqual(JSON.parse(String(options.body || '{}')), { name: 'Novo nome.pdf' });
      return new Response(JSON.stringify(driveMetadata({ name: 'Novo nome.pdf', version: '8' })), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      return new Response(JSON.stringify(driveMetadata({ name: 'Novo nome.pdf', version: '8' })), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (text === 'https://oauth2.googleapis.com/revoke') return new Response('', { status: 200 });
    throw new Error('fetch não esperado: ' + text);
  };

  try {
    await completeDriveOAuth(env, 'rename-authorization-code', state);
    phase = 'drive';
    const ref = await sealDriveFileRef(env, 'rename-sensitive-file-id', 'application/pdf');
    const result = await renameDrivePdf(env, {
      ref,
      baseVersion: '7',
      name: 'Novo nome'
    }, 'operador.rename');

    assert.equal(result.renamed, true);
    assert.equal(result.name, 'Novo nome.pdf');
    assert.equal(result.currentVersion, '8');
    assert.equal(result.contentConflict, false);
    assert.match(result.cacheKey, /^[A-Za-z0-9_-]{32}$/);
    assert.equal(String(result.ref).includes('rename-sensitive-file-id'), false);
    assert.equal(JSON.stringify(result).includes('parent-sensitive'), false);
    assert.equal(calls.some((call) => call.method === 'PATCH'), true);
  } finally {
    phase = 'drive';
    globalThis.fetch = async (url) => {
      if (String(url) === 'https://oauth2.googleapis.com/revoke') return new Response('', { status: 200 });
      return new Response('', { status: 200 });
    };
    await disconnectDrive(env).catch(() => {});
    globalThis.fetch = originalFetch;
  }
});
