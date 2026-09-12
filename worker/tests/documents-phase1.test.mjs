import assert from 'node:assert/strict';
import test from 'node:test';

let DatabaseSync = null;
try {
  ({ DatabaseSync } = await import('node:sqlite'));
} catch (_) {}
const sqliteTest = DatabaseSync ? test : test.skip;

import { handlePortalRoute } from '../auth-management-v2.js';
import {
  documentCapabilitiesFor,
  setDocumentCapabilities
} from '../document-access.js';
import {
  additionalRolesFor,
  decorateAdditionalRolesUser,
  setAdditionalRoles
} from '../additional-roles.js';
import {
  completeDriveOAuth,
  createDriveAuthorizationUrl,
  fetchDrivePdf,
  listDriveFolder,
  openDriveFileRef,
  searchDrive
} from '../document-drive.js';
import { handleDocumentsRoute } from '../documents-router.js';

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
    AUTH_SESSION_SECRET: 'central-documents-session-test-only',
    AUTH_RATE_LIMIT_SECRET: 'central-documents-rate-test-only',
    GOOGLE_DRIVE_OAUTH_CLIENT_ID: 'client-id-test.apps.googleusercontent.com',
    GOOGLE_DRIVE_OAUTH_CLIENT_SECRET: 'client-secret-test-only',
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI: 'https://worker.test/api/documents/oauth/callback',
    DRIVE_TOKEN_ENCRYPTION_KEY: 'encryption-key-test-only-with-enough-entropy'
  };
}

async function register(env, username, ip) {
  const response = await handlePortalRoute(new Request('https://portal.test/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CF-Connecting-IP': ip
    },
    body: JSON.stringify({ username, password: 'Senha-Segura-2026' })
  }), env, '', true);
  assert.equal(response.status, 201);
  return response.json();
}

function documentRequest(path, token, options = {}) {
  return new Request(`https://worker.test${path}`, {
    method: options.method || 'GET',
    headers: {
      Origin: 'https://regulacaoeldoradoms.com.br',
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
}

sqliteTest('capabilities documentais são independentes do cargo e edit/extract implicam view', async () => {
  const env = environment();
  await register(env, 'documentos.um', '127.0.0.81');
  await register(env, 'documentos.dois', '127.0.0.82');

  const empty = await documentCapabilitiesFor(env, { username: 'documentos.um', role: 'cidadao' });
  assert.deepEqual(empty, { view: false, extract: false, edit: false, manage: false });

  const granted = await setDocumentCapabilities(env, 'documentos.um', {
    view: false,
    extract: true,
    edit: true,
    manage: false
  }, 'admin');
  assert.deepEqual(granted, { view: true, extract: true, edit: true, manage: false });

  const untouched = await documentCapabilitiesFor(env, { username: 'documentos.dois', role: 'cidadao' });
  assert.deepEqual(untouched, { view: false, extract: false, edit: false, manage: false });
});

sqliteTest('cargo adicional Central de Documentos acumula com o perfil principal e concede leitura', async () => {
  const env = environment();
  await register(env, 'documentos.acumulado', '127.0.0.87');

  const before = await decorateAdditionalRolesUser(env, { username: 'documentos.acumulado', role: 'cidadao' });
  assert.deepEqual(before.additionalRoles, []);
  assert.deepEqual(before.effectiveRoles, ['cidadao']);

  await setAdditionalRoles(env, 'documentos.acumulado', ['documentos'], 'admin');

  const roles = await additionalRolesFor(env, 'documentos.acumulado');
  assert.deepEqual(roles, ['documentos']);

  const decorated = await decorateAdditionalRolesUser(env, { username: 'documentos.acumulado', role: 'cidadao' });
  assert.deepEqual(decorated.effectiveRoles, ['cidadao', 'documentos']);

  const capabilities = await documentCapabilitiesFor(env, decorated);
  assert.equal(capabilities.view, true);
  assert.equal(capabilities.extract, false);
  assert.equal(capabilities.edit, false);
  assert.equal(capabilities.manage, false);

  await setAdditionalRoles(env, 'documentos.acumulado', [], 'admin');
  const removed = await documentCapabilitiesFor(env, { username: 'documentos.acumulado', role: 'cidadao', additionalRoles: [] });
  assert.equal(removed.view, false);
});

sqliteTest('router bloqueia leitura sem capability e não depende de esconder botão no frontend', async () => {
  const env = environment();
  const blocked = await register(env, 'documentos.bloqueado', '127.0.0.83');

  const response = await handleDocumentsRoute(
    documentRequest('/api/documents/drive/list', blocked.token, { method: 'POST', body: {} }),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.equal(response.status, 403);
  const payload = await response.json();
  assert.equal(payload.code, 'DOCUMENTS_ACCESS_DENIED');
});

sqliteTest('OAuth usa estado opaco sem username e mantém refresh token criptografado no D1', async () => {
  const env = environment();
  await register(env, 'documentos.oauth', '127.0.0.84');

  const authorization = await createDriveAuthorizationUrl(env, 'documentos.oauth');
  const authUrl = new URL(authorization);
  assert.equal(authUrl.origin, 'https://accounts.google.com');
  assert.equal(authUrl.searchParams.get('scope'), 'https://www.googleapis.com/auth/drive');
  assert.equal(authUrl.searchParams.get('access_type'), 'offline');
  assert.equal(authUrl.searchParams.get('prompt'), 'consent');

  const state = authUrl.searchParams.get('state') || '';
  assert.ok(state.length > 20);
  assert.equal(state.includes('documentos.oauth'), false);

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options = {}) => {
    assert.equal(String(url), 'https://oauth2.googleapis.com/token');
    assert.equal(options.method, 'POST');
    return new Response(JSON.stringify({
      access_token: 'access-token-test-only',
      refresh_token: 'refresh-token-test-only',
      expires_in: 3600,
      scope: 'https://www.googleapis.com/auth/drive'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  try {
    const result = await completeDriveOAuth(env, 'authorization-code-test', state);
    assert.equal(result.connected, true);
  } finally {
    globalThis.fetch = originalFetch;
  }

  const row = await env.AUTH_DB.prepare(`SELECT refresh_token_cipher, refresh_token_iv, connected_by
    FROM document_drive_oauth WHERE connection_id = 'institutional'`).first();
  assert.ok(row?.refresh_token_cipher);
  assert.ok(row?.refresh_token_iv);
  assert.equal(row.connected_by, 'documentos.oauth');
  assert.equal(row.refresh_token_cipher.includes('refresh-token-test-only'), false);
});

sqliteTest('listagem e pesquisa não devolvem fileId bruto e aceitam somente referência opaca', async () => {
  const env = environment();
  await register(env, 'documentos.drive', '127.0.0.85');

  const authorization = await createDriveAuthorizationUrl(env, 'documentos.drive');
  const state = new URL(authorization).searchParams.get('state');

  const originalFetch = globalThis.fetch;
  let phase = 'oauth';
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), headers: new Headers(options.headers || {}) });
    if (phase === 'oauth') {
      return new Response(JSON.stringify({
        access_token: 'access-drive-test',
        refresh_token: 'refresh-drive-test',
        expires_in: 3600
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const driveUrl = new URL(String(url));
    assert.equal(driveUrl.origin, 'https://www.googleapis.com');
    assert.equal(new Headers(options.headers || {}).get('Authorization'), 'Bearer access-drive-test');
    return new Response(JSON.stringify({
      files: [
        {
          id: 'raw-folder-id-sensitive',
          name: 'PASTA OPERACIONAL',
          mimeType: 'application/vnd.google-apps.folder',
          modifiedTime: '2026-09-11T12:00:00Z',
          version: '7',
          capabilities: { canDownload: false, canEdit: true }
        },
        {
          id: 'raw-pdf-id-sensitive',
          name: 'DOCUMENTO.pdf',
          mimeType: 'application/pdf',
          size: '12345',
          modifiedTime: '2026-09-11T12:01:00Z',
          version: '8',
          capabilities: { canDownload: true, canEdit: true }
        }
      ]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  try {
    await completeDriveOAuth(env, 'authorization-code', state);
    phase = 'drive';

    const listed = await listDriveFolder(env, {});
    assert.equal(listed.items.length, 2);
    assert.equal(JSON.stringify(listed).includes('raw-pdf-id-sensitive'), false);
    assert.equal(JSON.stringify(listed).includes('raw-folder-id-sensitive'), false);
    assert.ok(listed.items[0].ref.length > 30);

    const opened = await openDriveFileRef(env, listed.items[1].ref);
    assert.equal(opened.id, 'raw-pdf-id-sensitive');
    assert.equal(opened.mime, 'application/pdf');

    const searched = await searchDrive(env, { query: 'DOCUMENTO' });
    assert.equal(searched.items.length, 2);
    assert.equal(JSON.stringify(searched).includes('raw-pdf-id-sensitive'), false);

    const searchCall = calls.find((call) => call.url.includes('/drive/v3/files') && call.url.includes('name+contains'));
    assert.ok(searchCall);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

sqliteTest('stream PDF encaminha Range ao Drive sem transformar conteúdo em JSON', async () => {
  const env = environment();
  await register(env, 'documentos.pdf', '127.0.0.86');

  const authorization = await createDriveAuthorizationUrl(env, 'documentos.pdf');
  const state = new URL(authorization).searchParams.get('state');
  const originalFetch = globalThis.fetch;
  let pdfRef = '';

  globalThis.fetch = async (url, options = {}) => {
    const text = String(url);
    if (text === 'https://oauth2.googleapis.com/token') {
      return new Response(JSON.stringify({
        access_token: 'access-pdf-test',
        refresh_token: 'refresh-pdf-test',
        expires_in: 3600
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (text.includes('/drive/v3/files?')) {
      return new Response(JSON.stringify({
        files: [{
          id: 'raw-pdf-range-id',
          name: 'ARQUIVO.pdf',
          mimeType: 'application/pdf',
          size: '40',
          modifiedTime: '2026-09-11T12:01:00Z',
          version: '1',
          capabilities: { canDownload: true, canEdit: false }
        }]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (text.includes('/drive/v3/files/raw-pdf-range-id?')) {
      assert.equal(new Headers(options.headers || {}).get('Range'), 'bytes=0-7');
      return new Response(new Uint8Array([0x25,0x50,0x44,0x46,0x2d,0x31,0x2e,0x37]), {
        status: 206,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Range': 'bytes 0-7/40',
          'Accept-Ranges': 'bytes'
        }
      });
    }

    throw new Error('fetch não esperado: ' + text);
  };

  try {
    await completeDriveOAuth(env, 'authorization-code', state);
    const listed = await listDriveFolder(env, {});
    pdfRef = listed.items[0].ref;
    const response = await fetchDrivePdf(env, pdfRef, 'bytes=0-7');
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('Content-Range'), 'bytes 0-7/40');
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.deepEqual(Array.from(bytes), [0x25,0x50,0x44,0x46,0x2d,0x31,0x2e,0x37]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('código da Central não contém logs de conteúdo nem segredos hardcoded', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const root = path.resolve(import.meta.dirname, '..');
  const sources = [
    fs.readFileSync(path.join(root, 'additional-roles.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'document-access.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'document-drive.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'documents-router.js'), 'utf8')
  ].join('\n');

  assert.doesNotMatch(sources, /console\.(?:log|warn|error)\s*\(/);
  assert.doesNotMatch(sources, /ya29\.[0-9A-Za-z_-]+/);
  assert.doesNotMatch(sources, /GOCSPX-[0-9A-Za-z_-]+/);
  assert.doesNotMatch(sources, /AIza[0-9A-Za-z_-]{20,}/);
  assert.match(sources, /Cache-Control.*no-store/s);
});
