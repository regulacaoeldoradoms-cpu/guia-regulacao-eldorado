import assert from 'node:assert/strict';
import test from 'node:test';

let DatabaseSync = null;
try {
  ({ DatabaseSync } = await import('node:sqlite'));
} catch (_) {}
const sqliteTest = DatabaseSync ? test : test.skip;

import { sealDriveFileRef } from '../document-drive.js';
import {
  heartbeatDocumentPresence,
  releaseDocumentPresence,
  documentPresenceConstants
} from '../document-presence.js';

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
    GOOGLE_DRIVE_OAUTH_CLIENT_ID: 'presence-test.apps.googleusercontent.com',
    GOOGLE_DRIVE_OAUTH_CLIENT_SECRET: 'presence-client-secret-test-only',
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI: 'https://worker.test/api/documents/oauth/callback',
    DRIVE_TOKEN_ENCRYPTION_KEY: 'presence-test-encryption-key-with-enough-entropy'
  };
}

sqliteTest('presença do Titon detecta outro usuário no mesmo PDF sem armazenar fileId ou nome do arquivo', async () => {
  const env = environment();
  const refA = await sealDriveFileRef(env, 'raw-sensitive-file-id-001', 'application/pdf');
  const refB = await sealDriveFileRef(env, 'raw-sensitive-file-id-001', 'application/pdf');

  const first = await heartbeatDocumentPresence(env, {
    username: 'wellyton',
    name: 'Wellyton'
  }, {
    ref: refA,
    sessionId: 'presence_session_wellyton_001',
    mode: 'view'
  });
  assert.equal(first.otherCount, 0);

  const second = await heartbeatDocumentPresence(env, {
    username: 'josiane',
    name: 'Josiane'
  }, {
    ref: refB,
    sessionId: 'presence_session_josiane_001',
    mode: 'view'
  });

  assert.equal(second.otherCount, 1);
  assert.equal(second.editingCount, 0);
  assert.deepEqual(second.others, [{ name: 'Wellyton', mode: 'view' }]);
  assert.equal(documentPresenceConstants.ttlSeconds, 75);

  const rows = await env.AUTH_DB.prepare(
    'SELECT document_key, username, display_name, mode FROM document_titon_presence ORDER BY username'
  ).all();
  const serialized = JSON.stringify(rows.results);
  assert.equal(serialized.includes('raw-sensitive-file-id-001'), false);
  assert.equal(serialized.includes('.pdf'), false);
  assert.ok(rows.results.every((row) => /^[A-Za-z0-9_-]{32}$/.test(String(row.document_key || ''))));
});

sqliteTest('presença diferencia editor e desaparece imediatamente quando a outra sessão fecha', async () => {
  const env = environment();
  const refOne = await sealDriveFileRef(env, 'same-drive-file-002', 'application/pdf');
  const refTwo = await sealDriveFileRef(env, 'same-drive-file-002', 'application/pdf');

  await heartbeatDocumentPresence(env, {
    username: 'operador.um',
    name: 'Operador Um'
  }, {
    ref: refOne,
    sessionId: 'presence_session_operator_001',
    mode: 'edit'
  });

  let observed = await heartbeatDocumentPresence(env, {
    username: 'operador.dois',
    name: 'Operador Dois'
  }, {
    ref: refTwo,
    sessionId: 'presence_session_operator_002',
    mode: 'view'
  });
  assert.equal(observed.otherCount, 1);
  assert.equal(observed.editingCount, 1);
  assert.deepEqual(observed.others, [{ name: 'Operador Um', mode: 'edit' }]);

  const released = await releaseDocumentPresence(env, {
    username: 'operador.um',
    name: 'Operador Um'
  }, {
    ref: refOne,
    sessionId: 'presence_session_operator_001'
  });
  assert.equal(released.released, true);

  observed = await heartbeatDocumentPresence(env, {
    username: 'operador.dois',
    name: 'Operador Dois'
  }, {
    ref: refTwo,
    sessionId: 'presence_session_operator_002',
    mode: 'view'
  });
  assert.equal(observed.otherCount, 0);
  assert.equal(observed.editingCount, 0);
});

sqliteTest('duas abas do mesmo usuário não geram falso alerta de outro operador', async () => {
  const env = environment();
  const refA = await sealDriveFileRef(env, 'same-user-file-003', 'application/pdf');
  const refB = await sealDriveFileRef(env, 'same-user-file-003', 'application/pdf');

  await heartbeatDocumentPresence(env, {
    username: 'mesmo.usuario',
    name: 'Mesmo Usuário'
  }, {
    ref: refA,
    sessionId: 'presence_same_user_session_001',
    mode: 'view'
  });

  const observed = await heartbeatDocumentPresence(env, {
    username: 'mesmo.usuario',
    name: 'Mesmo Usuário'
  }, {
    ref: refB,
    sessionId: 'presence_same_user_session_002',
    mode: 'edit'
  });

  assert.equal(observed.otherCount, 0);
  assert.equal(observed.editingCount, 0);

  const refC = await sealDriveFileRef(env, 'same-user-file-003', 'application/pdf');
  const thirdParty = await heartbeatDocumentPresence(env, {
    username: 'outro.usuario',
    name: 'Outro Usuário'
  }, {
    ref: refC,
    sessionId: 'presence_third_party_session_003',
    mode: 'view'
  });
  assert.equal(thirdParty.otherCount, 1, 'Duas abas do mesmo operador devem aparecer como uma única pessoa.');
  assert.equal(thirdParty.editingCount, 1, 'Se qualquer aba do operador estiver editando, o estado agregado deve ser edit.');
  assert.deepEqual(thirdParty.others, [{ name: 'Mesmo Usuário', mode: 'edit' }]);
});
