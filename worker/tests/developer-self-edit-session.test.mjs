import assert from 'node:assert/strict';
import test from 'node:test';

let DatabaseSync = null;
try {
  ({ DatabaseSync } = await import('node:sqlite'));
} catch (_) {}
const sqliteTest = DatabaseSync ? test : test.skip;

import { handlePortalRoute } from '../auth-management-flex.js';
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
    AUTH_SESSION_SECRET: 'self-edit-session-test-only',
    AUTH_RATE_LIMIT_SECRET: 'self-edit-rate-limit-test-only',
    GOOGLE_DRIVE_OAUTH_CLIENT_ID: 'client-id-test.apps.googleusercontent.com',
    GOOGLE_DRIVE_OAUTH_CLIENT_SECRET: 'client-secret-test-only',
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI: 'https://worker.test/api/documents/oauth/callback',
    DRIVE_TOKEN_ENCRYPTION_KEY: 'self-edit-encryption-key-test-only-with-enough-entropy'
  };
}

async function register(env, username, ip = '127.0.0.91') {
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

function request(path, token, options = {}) {
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

test('preflight CORS da gestão de usuários responde antes da validação de sessão', async () => {
  const origin = 'https://regulacaoeldoradoms.com.br';
  const response = await handlePortalRoute(new Request('https://worker.test/api/admin/users', {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization'
    }
  }), {}, origin, true);

  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.match(response.headers.get('Access-Control-Allow-Methods') || '', /GET/);
  assert.match(response.headers.get('Access-Control-Allow-Headers') || '', /Authorization/i);
});

sqliteTest('Desenvolvedor pode editar a própria conta e conceder editor PDF sem invalidar a sessão entre as duas operações', async () => {
  const env = environment();
  const account = await register(env, 'desenvolvedor.self');

  await env.AUTH_DB.prepare(`
    UPDATE auth_users
    SET role = 'admin', name = 'Desenvolvedor Self', job_title = 'Teste'
    WHERE username = ?
  `).bind('desenvolvedor.self').run();

  const before = await env.AUTH_DB.prepare('SELECT session_version FROM auth_users WHERE username = ?')
    .bind('desenvolvedor.self').first();
  assert.equal(Number(before.session_version), 1);

  const updateResponse = await handlePortalRoute(request('/api/admin/users/desenvolvedor.self', account.token, {
    method: 'PATCH',
    body: {
      name: 'Desenvolvedor Self',
      jobTitle: 'Teste atualizado',
      role: 'admin',
      active: true,
      additionalRoles: ['documentos']
    }
  }), env, 'https://regulacaoeldoradoms.com.br', true);

  assert.equal(updateResponse.status, 200);
  const updated = await updateResponse.json();
  assert.deepEqual(updated.user.additionalRoles, ['documentos']);

  const after = await env.AUTH_DB.prepare('SELECT session_version FROM auth_users WHERE username = ?')
    .bind('desenvolvedor.self').first();
  assert.equal(Number(after.session_version), 1);

  const capabilityResponse = await handleDocumentsRoute(request('/api/documents/admin/access/desenvolvedor.self', account.token, {
    method: 'PATCH',
    body: {
      view: true,
      extract: false,
      edit: true,
      manage: false
    }
  }), env, 'https://regulacaoeldoradoms.com.br', true);

  assert.equal(capabilityResponse.status, 200);
  const capabilityPayload = await capabilityResponse.json();
  assert.equal(capabilityPayload.capabilities.view, true);
  assert.equal(capabilityPayload.capabilities.edit, true);
});

sqliteTest('alteração de papel da própria conta continua invalidando a sessão por segurança', async () => {
  const env = environment();
  const account = await register(env, 'desenvolvedor.role', '127.0.0.92');

  await env.AUTH_DB.prepare(`
    UPDATE auth_users
    SET role = 'admin', name = 'Desenvolvedor Role'
    WHERE username = ?
  `).bind('desenvolvedor.role').run();

  const response = await handlePortalRoute(request('/api/admin/users/desenvolvedor.role', account.token, {
    method: 'PATCH',
    body: {
      name: 'Desenvolvedor Role',
      role: 'coordenacao',
      active: true
    }
  }), env, 'https://regulacaoeldoradoms.com.br', true);

  assert.equal(response.status, 200);
  const row = await env.AUTH_DB.prepare('SELECT role, session_version FROM auth_users WHERE username = ?')
    .bind('desenvolvedor.role').first();
  assert.equal(row.role, 'coordenacao');
  assert.equal(Number(row.session_version), 2);

  const staleResponse = await handlePortalRoute(request('/api/admin/users', account.token), env, 'https://regulacaoeldoradoms.com.br', true);
  assert.equal(staleResponse.status, 401);
  const payload = await staleResponse.json();
  assert.match(payload.error, /Sessão inválida ou expirada/);
});
