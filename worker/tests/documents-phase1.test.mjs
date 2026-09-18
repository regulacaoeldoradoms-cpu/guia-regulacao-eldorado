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
  queryDriveSyncStatus,
  sealDriveFileRef,
  searchDrive,
  startDriveSync,
  uploadDriveSyncChunk
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

function syncChunkRequest(path, token, bytes, start, end, total) {
  return new Request(`https://worker.test${path}`, {
    method: 'PUT',
    headers: {
      Origin: 'https://regulacaoeldoradoms.com.br',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/pdf',
      'Content-Range': `bytes ${start}-${end}/${total}`
    },
    body: bytes
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

sqliteTest('paleta do editor é preferência por conta, editável e não contém conteúdo documental', async () => {
  const env = environment();
  const first = await register(env, 'documentos.paleta.um', '127.0.0.91');
  const second = await register(env, 'documentos.paleta.dois', '127.0.0.92');

  await setDocumentCapabilities(env, 'documentos.paleta.um', { view: true }, 'admin');
  await setDocumentCapabilities(env, 'documentos.paleta.dois', { view: true }, 'admin');

  const initialResponse = await handleDocumentsRoute(
    documentRequest('/api/documents/preferences', first.token),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.equal(initialResponse.status, 200);
  const initial = await initialResponse.json();
  assert.deepEqual(initial.colorPalette, ['#000000', '#ffffff', '#e53935', '#1565c0', '#2e7d32', '#f9a825']);

  const savedResponse = await handleDocumentsRoute(
    documentRequest('/api/documents/preferences', first.token, {
      method: 'PATCH',
      body: { colorPalette: ['#102030', '#ffffff', '#ff0000'] }
    }),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.equal(savedResponse.status, 200);
  assert.deepEqual((await savedResponse.json()).colorPalette, ['#102030', '#ffffff', '#ff0000']);

  const reloaded = await handleDocumentsRoute(
    documentRequest('/api/documents/preferences', first.token),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.deepEqual((await reloaded.json()).colorPalette, ['#102030', '#ffffff', '#ff0000']);

  const isolated = await handleDocumentsRoute(
    documentRequest('/api/documents/preferences', second.token),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.deepEqual((await isolated.json()).colorPalette, ['#000000', '#ffffff', '#e53935', '#1565c0', '#2e7d32', '#f9a825']);

  const invalid = await handleDocumentsRoute(
    documentRequest('/api/documents/preferences', first.token, {
      method: 'PATCH',
      body: { colorPalette: ['red'] }
    }),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).code, 'DOCUMENTS_EDITOR_PALETTE_INVALID');

  const row = await env.AUTH_DB.prepare(
    'SELECT username, color_palette_json FROM auth_document_editor_preferences WHERE username = ?'
  ).bind('documentos.paleta.um').first();
  assert.equal(row.username, 'documentos.paleta.um');
  assert.equal(String(row.color_palette_json).includes('Texto'), false);
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
    assert.match(listed.items[0].cacheKey, /^[A-Za-z0-9_-]{32}$/);
    assert.match(listed.items[1].cacheKey, /^[A-Za-z0-9_-]{32}$/);
    assert.notEqual(listed.items[0].cacheKey, listed.items[1].cacheKey);

    const opened = await openDriveFileRef(env, listed.items[1].ref);
    assert.equal(opened.id, 'raw-pdf-id-sensitive');
    assert.equal(opened.mime, 'application/pdf');

    const searched = await searchDrive(env, { query: 'DOCUMENTO' });
    assert.equal(searched.items.length, 2);
    assert.equal(JSON.stringify(searched).includes('raw-pdf-id-sensitive'), false);
    assert.equal(searched.items[0].cacheKey, listed.items[0].cacheKey);
    assert.equal(searched.items[1].cacheKey, listed.items[1].cacheKey);

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


sqliteTest('Fase 4A bloqueia preflight sem documents_edit antes de consultar o Drive', async () => {
  const env = environment();
  const user = await register(env, 'documentos.sync.bloqueado', '127.0.0.101');

  const originalFetch = globalThis.fetch;
  let externalCalls = 0;
  globalThis.fetch = async () => {
    externalCalls += 1;
    throw new Error('nenhuma chamada externa era esperada');
  };

  try {
    const response = await handleDocumentsRoute(
      documentRequest('/api/documents/drive/sync/preflight', user.token, {
        method: 'POST',
        body: { operation: 'replace_pdf', ref: 'referencia-opaca-ficticia', baseVersion: '1' }
      }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, 'DOCUMENTS_ACCESS_DENIED');
    assert.equal(externalCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

sqliteTest('Fase 4A detecta conflito de versão sem upload e mantém resposta sem fileId/nome', async () => {
  const env = environment();
  const user = await register(env, 'documentos.sync', '127.0.0.102');
  await setDocumentCapabilities(env, 'documentos.sync', { view: true, edit: true }, 'admin');

  const authorization = await createDriveAuthorizationUrl(env, 'documentos.sync');
  const state = new URL(authorization).searchParams.get('state');
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    const text = String(url);
    calls.push({ url: text, method: String(options.method || 'GET').toUpperCase() });

    if (text === 'https://oauth2.googleapis.com/token') {
      return new Response(JSON.stringify({
        access_token: 'access-sync-test',
        refresh_token: 'refresh-sync-test',
        expires_in: 3600
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const driveUrl = new URL(text);
    assert.equal(driveUrl.origin, 'https://www.googleapis.com');
    assert.equal(options.method, 'GET');
    assert.ok(driveUrl.pathname.includes('/drive/v3/files/raw-sync-pdf-id'));
    assert.match(driveUrl.searchParams.get('fields') || '', /version/);
    assert.match(driveUrl.searchParams.get('fields') || '', /md5Checksum/);
    assert.match(driveUrl.searchParams.get('fields') || '', /headRevisionId/);

    return new Response(JSON.stringify({
      id: 'raw-sync-pdf-id',
      name: 'NOME-QUE-NAO-PODE-VOLTAR.pdf',
      mimeType: 'application/pdf',
      size: '98765',
      modifiedTime: '2026-09-16T20:00:00Z',
      version: '9',
      md5Checksum: '0123456789abcdef0123456789abcdef',
      headRevisionId: 'revision-sensitive',
      parents: ['parent-sensitive'],
      capabilities: { canDownload: true, canEdit: true, canModifyContent: true }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  try {
    await completeDriveOAuth(env, 'authorization-code-sync', state);
    const ref = await sealDriveFileRef(env, 'raw-sync-pdf-id', 'application/pdf');

    const conflictResponse = await handleDocumentsRoute(
      documentRequest('/api/documents/drive/sync/preflight', user.token, {
        method: 'POST',
        body: { operation: 'replace_pdf', ref, baseVersion: '8' }
      }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(conflictResponse.status, 409);
    const conflict = await conflictResponse.json();
    assert.equal(conflict.code, 'DRIVE_VERSION_CONFLICT');
    assert.equal(JSON.stringify(conflict).includes('raw-sync-pdf-id'), false);
    assert.equal(JSON.stringify(conflict).includes('NOME-QUE-NAO-PODE-VOLTAR'), false);

    const copyResponse = await handleDocumentsRoute(
      documentRequest('/api/documents/drive/sync/preflight', user.token, {
        method: 'POST',
        body: { operation: 'save_copy', ref, baseVersion: '8' }
      }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(copyResponse.status, 200);
    const copy = await copyResponse.json();
    assert.equal(copy.operation, 'save_copy');
    assert.equal(copy.conflict, true);
    assert.equal(copy.blocking, false);
    assert.equal(copy.currentVersion, '9');
    assert.equal(JSON.stringify(copy).includes('raw-sync-pdf-id'), false);
    assert.equal(JSON.stringify(copy).includes('NOME-QUE-NAO-PODE-VOLTAR'), false);
    assert.equal(JSON.stringify(copy).includes('parent-sensitive'), false);
    assert.equal(JSON.stringify(copy).includes('revision-sensitive'), false);

    const replaceResponse = await handleDocumentsRoute(
      documentRequest('/api/documents/drive/sync/preflight', user.token, {
        method: 'POST',
        body: { operation: 'replace_pdf', ref, baseVersion: '9' }
      }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(replaceResponse.status, 200);
    const replace = await replaceResponse.json();
    assert.equal(replace.operation, 'replace_pdf');
    assert.equal(replace.conflict, false);
    assert.equal(replace.blocking, false);
    assert.equal(replace.canEditOriginal, true);

    const driveCalls = calls.filter((call) => call.url.startsWith('https://www.googleapis.com/'));
    assert.ok(driveCalls.length >= 3);
    assert.ok(driveCalls.every((call) => call.method === 'GET'));
    assert.equal(calls.some((call) => call.url.includes('/upload/')), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

sqliteTest('Fase 4A recusa substituir quando a conta Google não pode editar o arquivo', async () => {
  const env = environment();
  const user = await register(env, 'documentos.sync.readonly', '127.0.0.103');
  await setDocumentCapabilities(env, 'documentos.sync.readonly', { view: true, edit: true }, 'admin');

  const authorization = await createDriveAuthorizationUrl(env, 'documentos.sync.readonly');
  const state = new URL(authorization).searchParams.get('state');
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url) => {
    const text = String(url);
    if (text === 'https://oauth2.googleapis.com/token') {
      return new Response(JSON.stringify({
        access_token: 'access-sync-readonly',
        refresh_token: 'refresh-sync-readonly',
        expires_in: 3600
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({
      id: 'raw-sync-readonly-id',
      mimeType: 'application/pdf',
      size: '1000',
      modifiedTime: '2026-09-16T20:00:00Z',
      version: '3',
      capabilities: { canDownload: true, canEdit: false, canModifyContent: false }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  try {
    await completeDriveOAuth(env, 'authorization-code-readonly', state);
    const ref = await sealDriveFileRef(env, 'raw-sync-readonly-id', 'application/pdf');
    const response = await handleDocumentsRoute(
      documentRequest('/api/documents/drive/sync/preflight', user.token, {
        method: 'POST',
        body: { operation: 'replace_pdf', ref, baseVersion: '3' }
      }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, 'DRIVE_FILE_NOT_EDITABLE');
  } finally {
    globalThis.fetch = originalFetch;
  }
});


sqliteTest('Fase 4B mantém escrita desligada por padrão mesmo para usuário editor', async () => {
  const env = environment();
  const user = await register(env, 'documentos.sync.disabled', '127.0.0.104');
  await setDocumentCapabilities(env, 'documentos.sync.disabled', { view: true, edit: true }, 'admin');

  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    throw new Error('escrita desabilitada não deve consultar o Drive');
  };

  try {
    const response = await handleDocumentsRoute(
      documentRequest('/api/documents/drive/sync/start', user.token, {
        method: 'POST',
        body: {
          operation: 'replace_pdf',
          ref: 'opaque-ref-test',
          baseVersion: '1',
          totalBytes: 1024
        }
      }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, 'DRIVE_SYNC_WRITE_DISABLED');
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

sqliteTest('Fase 4B substituição usa revisão preservada, resumable e só conclui após 200 final', async () => {
  const env = environment();
  env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'true';
  const user = await register(env, 'documentos.sync.upload', '127.0.0.105');
  await setDocumentCapabilities(env, 'documentos.sync.upload', { view: true, edit: true }, 'admin');

  const authorization = await createDriveAuthorizationUrl(env, 'documentos.sync.upload');
  const state = new URL(authorization).searchParams.get('state');
  const originalFetch = globalThis.fetch;
  const calls = [];
  let sessionPutCount = 0;

  globalThis.fetch = async (url, options = {}) => {
    const text = String(url);
    const method = String(options.method || 'GET').toUpperCase();
    const headers = new Headers(options.headers || {});
    calls.push({ url: text, method, headers, body: options.body });

    if (text === 'https://oauth2.googleapis.com/token') {
      return new Response(JSON.stringify({
        access_token: 'access-sync-upload',
        refresh_token: 'refresh-sync-upload',
        expires_in: 3600
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (text.includes('/drive/v3/files/raw-sync-upload-id/revisions/rev-7')) {
      assert.equal(method, 'PATCH');
      assert.deepEqual(JSON.parse(String(options.body || '{}')), { keepForever: true });
      return new Response(JSON.stringify({ id: 'rev-7', keepForever: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (text.startsWith('https://www.googleapis.com/upload/drive/v3/files/raw-sync-upload-id?') && !text.includes('upload_id=')) {
      assert.equal(method, 'PATCH');
      const u = new URL(text);
      assert.equal(u.searchParams.get('uploadType'), 'resumable');
      assert.equal(headers.get('X-Upload-Content-Type'), 'application/pdf');
      assert.equal(headers.get('X-Upload-Content-Length'), '524288');
      return new Response(null, {
        status: 200,
        headers: {
          Location: 'https://www.googleapis.com/upload/drive/v3/files/raw-sync-upload-id?uploadType=resumable&upload_id=opaque-google-session'
        }
      });
    }

    if (text.includes('upload_id=opaque-google-session')) {
      assert.equal(method, 'PUT');
      sessionPutCount += 1;
      if (sessionPutCount === 1) {
        assert.equal(headers.get('Content-Range'), 'bytes 0-262143/524288');
        return new Response('temporário', { status: 503 });
      }
      if (sessionPutCount === 2) {
        assert.equal(headers.get('Content-Range'), 'bytes */524288');
        return new Response(null, { status: 308 });
      }
      if (sessionPutCount === 3) {
        assert.equal(headers.get('Content-Range'), 'bytes 0-262143/524288');
        return new Response(null, { status: 308, headers: { Range: 'bytes=0-262143' } });
      }
      assert.equal(headers.get('Content-Range'), 'bytes 262144-524287/524288');
      return new Response(JSON.stringify({
        id: 'raw-sync-upload-id',
        name: 'NAO-RETORNAR.pdf',
        mimeType: 'application/pdf',
        size: '524288',
        modifiedTime: '2026-09-16T22:00:00Z',
        version: '8',
        md5Checksum: 'abcdefabcdefabcdefabcdefabcdefab',
        headRevisionId: 'rev-8'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (text.includes('/drive/v3/files/raw-sync-upload-id?')) {
      assert.equal(method, 'GET');
      return new Response(JSON.stringify({
        id: 'raw-sync-upload-id',
        name: 'ARQUIVO-ORIGINAL.pdf',
        mimeType: 'application/pdf',
        size: '500000',
        modifiedTime: '2026-09-16T21:00:00Z',
        version: '7',
        md5Checksum: '0123456789abcdef0123456789abcdef',
        headRevisionId: 'rev-7',
        parents: ['parent-test'],
        capabilities: { canDownload: true, canEdit: true, canModifyContent: true },
        ...(sessionPutCount >= 4 ? {
          size: '524288', version: '8', headRevisionId: 'rev-8',
          md5Checksum: 'abcdefabcdefabcdefabcdefabcdefab', modifiedTime: '2026-09-16T22:00:00Z'
        } : {})
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    throw new Error('fetch não esperado: ' + method + ' ' + text);
  };

  try {
    await completeDriveOAuth(env, 'authorization-code-sync-upload', state);
    const ref = await sealDriveFileRef(env, 'raw-sync-upload-id', 'application/pdf');

    const startResponse = await handleDocumentsRoute(
      documentRequest('/api/documents/drive/sync/start', user.token, {
        method: 'POST',
        body: {
          operation: 'replace_pdf',
          ref,
          baseVersion: '7',
          totalBytes: 524288
        }
      }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(startResponse.status, 201);
    const started = await startResponse.json();
    assert.match(started.syncId, /^[A-Za-z0-9_-]{20,80}$/);
    assert.equal(started.operation, 'replace_pdf');
    assert.equal(started.chunkSize, 4 * 1024 * 1024);
    assert.equal(started.safetyRevisionPreserved, true);
    assert.equal(JSON.stringify(started).includes('upload_id='), false);
    assert.equal(JSON.stringify(started).includes('raw-sync-upload-id'), false);

    const stored = await env.AUTH_DB.prepare(`SELECT session_url_cipher, operation, total_bytes, next_offset
      FROM document_drive_sync_sessions WHERE sync_id = ?`).bind(started.syncId).first();
    assert.ok(stored?.session_url_cipher);
    assert.equal(String(stored.session_url_cipher).includes('upload_id='), false);
    assert.equal(stored.operation, 'replace_pdf');
    assert.equal(Number(stored.total_bytes), 524288);
    assert.equal(Number(stored.next_offset), 0);

    const firstChunk = new Uint8Array(262144);
    firstChunk.set([0x25, 0x50, 0x44, 0x46, 0x2d], 0);

    const interrupted = await handleDocumentsRoute(
      syncChunkRequest(
        `/api/documents/drive/sync/upload/${started.syncId}`,
        user.token,
        firstChunk,
        0,
        262143,
        524288
      ),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(interrupted.status, 503);
    assert.equal((await interrupted.json()).code, 'DRIVE_SYNC_INTERRUPTED');
    assert.ok(await env.AUTH_DB.prepare(
      'SELECT sync_id FROM document_drive_sync_sessions WHERE sync_id = ?'
    ).bind(started.syncId).first());

    const statusResponse = await handleDocumentsRoute(
      documentRequest(`/api/documents/drive/sync/status/${started.syncId}`, user.token, { method: 'POST' }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(statusResponse.status, 202);
    assert.equal((await statusResponse.json()).nextOffset, 0);

    const partial = await handleDocumentsRoute(
      syncChunkRequest(
        `/api/documents/drive/sync/upload/${started.syncId}`,
        user.token,
        firstChunk,
        0,
        262143,
        524288
      ),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(partial.status, 202);
    const partialPayload = await partial.json();
    assert.equal(partialPayload.completed, false);
    assert.equal(partialPayload.nextOffset, 262144);

    const finalChunk = new Uint8Array(262144);
    const completed = await handleDocumentsRoute(
      syncChunkRequest(
        `/api/documents/drive/sync/upload/${started.syncId}`,
        user.token,
        finalChunk,
        262144,
        524287,
        524288
      ),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(completed.status, 200);
    const finalPayload = await completed.json();
    assert.equal(finalPayload.completed, true);
    assert.equal(finalPayload.operation, 'replace_pdf');
    assert.equal(finalPayload.currentVersion, '8');
    assert.ok(finalPayload.ref.length > 30);
    assert.match(finalPayload.cacheKey, /^[A-Za-z0-9_-]{32}$/);
    assert.equal(JSON.stringify(finalPayload).includes('raw-sync-upload-id'), false);
    assert.equal(JSON.stringify(finalPayload).includes('NAO-RETORNAR'), false);
    assert.equal(await env.AUTH_DB.prepare(
      'SELECT sync_id FROM document_drive_sync_sessions WHERE sync_id = ?'
    ).bind(started.syncId).first(), null);

    const revisionCall = calls.find((call) => call.url.includes('/revisions/rev-7'));
    const initCall = calls.find((call) => call.url.includes('/upload/drive/v3/files/raw-sync-upload-id?') && !call.url.includes('upload_id='));
    assert.ok(revisionCall);
    assert.ok(initCall);
    assert.ok(calls.indexOf(revisionCall) < calls.indexOf(initCall));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

for (const scenario of [
  { name: 'outra revisão com os mesmos bytes', current: { headRevisionId: 'external-head' } },
  { name: 'outro checksum', current: { md5Checksum: 'b'.repeat(32) } },
  { name: 'outro tamanho', current: { size: '999' } },
  { name: 'outro arquivo', current: { id: 'external-file' } },
  { name: 'recibo sem checksum', receipt: { md5Checksum: '' }, code: 'DRIVE_SYNC_CONFIRMATION_INVALID', status: 502 },
  { name: 'recibo sem revisão', receipt: { headRevisionId: '' }, code: 'DRIVE_SYNC_CONFIRMATION_INVALID', status: 502 },
  { name: 'recibo com tamanho incorreto', receipt: { size: '999' }, code: 'DRIVE_SYNC_CONFIRMATION_INVALID', status: 502 },
  { name: 'versão lida anterior ao recibo', current: { version: '7' }, code: 'DRIVE_SYNC_INTERRUPTED', status: 503, recover: true }
]) {
  sqliteTest('Fase 4D confirmação não adota ' + scenario.name, async () => {
    const env = environment();
    env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'true';
    const pdf = new TextEncoder().encode('%PDF-1.7\nconfirmation-test\n');
    const username = 'confirmation.test';
    const base = { id: 'synthetic-confirmation-file', mimeType: 'application/pdf', size: String(pdf.length),
      version: '7', headRevisionId: 'head-7', md5Checksum: '0'.repeat(32), capabilities: { canEdit: true } };
    const receipt = { ...base, version: '8', headRevisionId: 'head-8', md5Checksum: 'a'.repeat(32), ...scenario.receipt };
    let current = { ...receipt, version: '9', ...scenario.current };
    let uploaded = false;
    let metadataReads = 0;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, init = {}) => {
      const value = new URL(String(url));
      if (value.hostname === 'oauth2.googleapis.com') return Response.json({
        access_token: 'synthetic-access', refresh_token: 'synthetic-refresh', expires_in: 3600
      });
      if (value.pathname.endsWith('/revisions/head-7')) {
        assert.equal(JSON.parse(init.body).keepForever, true);
        return Response.json({ keepForever: true });
      }
      if (value.pathname.startsWith('/upload/') && !value.searchParams.has('upload_id')) {
        return new Response(null, { headers: {
          Location: 'https://www.googleapis.com/upload/drive/v3/files/synthetic-confirmation-file?upload_id=confirmation'
        } });
      }
      if (value.searchParams.has('upload_id')) {
        uploaded = true;
        return Response.json(receipt);
      }
      assert.equal(init.method, 'GET');
      metadataReads += 1;
      return Response.json(uploaded ? current : base);
    };
    try {
      const authorization = await createDriveAuthorizationUrl(env, username);
      await completeDriveOAuth(env, 'synthetic-code', new URL(authorization).searchParams.get('state'));
      const ref = await sealDriveFileRef(env, base.id, 'application/pdf');
      const { syncId } = await startDriveSync(env, username, {
        operation: 'replace_pdf', ref, baseVersion: '7', totalBytes: pdf.length, preserveRevision: true
      });
      await assert.rejects(uploadDriveSyncChunk(env, username, syncId,
        syncChunkRequest('/synthetic-upload', 'synthetic-token', pdf, 0, pdf.length - 1, pdf.length)),
      (error) => error.code === (scenario.code || 'DRIVE_VERSION_CONFLICT') && error.status === (scenario.status || 409));
      assert.equal(metadataReads, scenario.receipt ? 1 : 2, 'invalid receipts must fail before adopting files.get');
      assert.ok(await env.AUTH_DB.prepare('SELECT sync_id FROM document_drive_sync_sessions WHERE sync_id = ?').bind(syncId).first());
      if (scenario.recover) {
        current = { ...receipt, version: '9' };
        const completed = await queryDriveSyncStatus(env, username, syncId);
        assert.equal(completed.completed, true);
        assert.equal(completed.currentVersion, '9');
      }
    } finally {
      globalThis.fetch = originalFetch;
      env.AUTH_DB.database.close();
    }
  });
}

sqliteTest('Fase 4B salvar como novo inicia create resumable no mesmo parent e pode ser cancelado', async () => {
  const env = environment();
  env.DOCUMENTS_DRIVE_WRITE_ENABLED = 'true';
  const user = await register(env, 'documentos.sync.copy', '127.0.0.106');
  await setDocumentCapabilities(env, 'documentos.sync.copy', { view: true, edit: true }, 'admin');

  const authorization = await createDriveAuthorizationUrl(env, 'documentos.sync.copy');
  const state = new URL(authorization).searchParams.get('state');
  const originalFetch = globalThis.fetch;
  let createMetadata = null;
  let revisionCalls = 0;

  globalThis.fetch = async (url, options = {}) => {
    const text = String(url);
    const method = String(options.method || 'GET').toUpperCase();

    if (text === 'https://oauth2.googleapis.com/token') {
      return new Response(JSON.stringify({
        access_token: 'access-sync-copy',
        refresh_token: 'refresh-sync-copy',
        expires_in: 3600
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (text.includes('/revisions/')) {
      revisionCalls += 1;
      throw new Error('save_copy não deve preservar revisão do original');
    }

    if (text.startsWith('https://www.googleapis.com/upload/drive/v3/files?')) {
      assert.equal(method, 'POST');
      createMetadata = JSON.parse(String(options.body || '{}'));
      return new Response(null, {
        status: 200,
        headers: {
          Location: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=copy-session'
        }
      });
    }

    if (text.includes('/drive/v3/files/raw-sync-copy-id?')) {
      assert.equal(method, 'GET');
      return new Response(JSON.stringify({
        id: 'raw-sync-copy-id',
        mimeType: 'application/pdf',
        size: '100',
        modifiedTime: '2026-09-16T21:00:00Z',
        version: '5',
        headRevisionId: 'rev-copy',
        parents: ['copy-parent-id'],
        capabilities: { canDownload: true, canEdit: false, canModifyContent: false }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    throw new Error('fetch não esperado: ' + method + ' ' + text);
  };

  try {
    await completeDriveOAuth(env, 'authorization-code-sync-copy', state);
    const ref = await sealDriveFileRef(env, 'raw-sync-copy-id', 'application/pdf');

    const response = await handleDocumentsRoute(
      documentRequest('/api/documents/drive/sync/start', user.token, {
        method: 'POST',
        body: {
          operation: 'save_copy',
          ref,
          baseVersion: '4',
          totalBytes: 262144,
          copyName: 'Cópia editada'
        }
      }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(response.status, 201);
    const started = await response.json();
    assert.equal(started.operation, 'save_copy');
    assert.equal(started.conflictDetected, true);
    assert.equal(started.safetyRevisionPreserved, false);
    assert.equal(revisionCalls, 0);
    assert.equal(createMetadata.name, 'Cópia editada.pdf');
    assert.equal(createMetadata.mimeType, 'application/pdf');
    assert.deepEqual(createMetadata.parents, ['copy-parent-id']);

    const cancel = await handleDocumentsRoute(
      documentRequest(`/api/documents/drive/sync/${started.syncId}`, user.token, { method: 'DELETE' }),
      env,
      'https://regulacaoeldoradoms.com.br',
      true
    );
    assert.equal(cancel.status, 200);
    assert.deepEqual(await cancel.json(), { cancelled: true, operation: 'save_copy' });
    assert.equal(await env.AUTH_DB.prepare(
      'SELECT sync_id FROM document_drive_sync_sessions WHERE sync_id = ?'
    ).bind(started.syncId).first(), null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});


sqliteTest('IA documental exige capability extract e permanece fail-closed na 5A', async () => {
  const env = environment();
  const user = await register(env, 'documentos.ia', '127.0.0.93');
  await setDocumentCapabilities(env, 'documentos.ia', { view: true }, 'admin');

  const denied = await handleDocumentsRoute(
    documentRequest('/api/documents/ai/config', user.token),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).code, 'DOCUMENTS_ACCESS_DENIED');

  await setDocumentCapabilities(env, 'documentos.ia', { extract: true }, 'admin');
  const disabled = await handleDocumentsRoute(
    documentRequest('/api/documents/ai/config', user.token),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.equal(disabled.status, 200);
  assert.deepEqual((await disabled.json()).ai.enabled, false);

  env.DOCUMENTS_AI_ENABLED = 'true';
  env.DOCUMENTS_AI_PROCESSING_ENABLED = 'false';
  const enabled = await handleDocumentsRoute(
    documentRequest('/api/documents/ai/config', user.token),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  const enabledPayload = await enabled.json();
  assert.equal(enabled.status, 200);
  assert.equal(enabledPayload.ai.enabled, true);
  assert.equal(enabledPayload.ai.processingEnabled, false);
  assert.equal(enabledPayload.ai.pageIsolation, true);
  assert.equal(enabledPayload.ai.provenanceRequired, true);

  const blockedProcessing = await handleDocumentsRoute(
    documentRequest('/api/documents/ai/page/analyze', user.token, { method: 'POST', body: { pageNumber: 1 } }),
    env,
    'https://regulacaoeldoradoms.com.br',
    true
  );
  assert.equal(blockedProcessing.status, 503);
  assert.equal((await blockedProcessing.json()).code, 'DOCUMENT_AI_PROCESSING_DISABLED');
});
