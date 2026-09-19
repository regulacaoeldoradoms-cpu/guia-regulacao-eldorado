import test from 'node:test';
import assert from 'node:assert/strict';

import {
  capabilityDiagnosticSql,
  safeCapabilityState
} from './diagnosticar-capability-5e.mjs';

test('diagnóstico 5E consulta apenas estado necessário sem alterar D1', () => {
  const sql = capabilityDiagnosticSql();
  assert.match(sql, /auth_users/);
  assert.match(sql, /auth_document_access/);
  assert.match(sql, /auth_user_additional_roles/);
  assert.match(sql, /can_extract/);
  assert.match(sql, /role_id='documentos'/);
  assert.doesNotMatch(sql, /\b(?:INSERT|UPDATE|DELETE|REPLACE|DROP|ALTER|CREATE)\b/i);
});

test('diagnóstico 5E projeta somente booleanos técnicos', () => {
  const state = safeCapabilityState([{
    results: [{
      user_exists: 1,
      user_active: 1,
      access_row: 1,
      can_view: 1,
      can_extract: 0,
      regulator_role: 1,
      active_controls: 0
    }]
  }]);
  assert.deepEqual({ ...state }, {
    userExists: true,
    userActive: true,
    accessRow: true,
    canView: true,
    canExtract: false,
    regulatorRole: true,
    activeControlledWindow: false
  });
});
