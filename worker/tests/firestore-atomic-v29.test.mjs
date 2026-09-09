import assert from 'node:assert/strict';
import test from 'node:test';
import { buildFirestoreCommitWrites } from '../firestore-atomic-v29.js';

const env = { FIREBASE_PROJECT_ID: 'portal-regulacao-test' };

test('monta criação e atualização no mesmo commit com precondições', () => {
  const writes = buildFirestoreCommitWrites(env, [
    {
      path: 'telemedicine_patients/paciente-1',
      mode: 'create',
      data: { name: 'PACIENTE TESTE', active: true }
    },
    {
      path: 'telemedicine_followups/retorno-1',
      mode: 'update',
      data: { resolution: 'ALTA DO EPISÓDIO', active: false }
    }
  ]);

  assert.equal(writes.length, 2);
  assert.equal(
    writes[0].update.name,
    'projects/portal-regulacao-test/databases/(default)/documents/telemedicine_patients/paciente-1'
  );
  assert.deepEqual(writes[0].currentDocument, { exists: false });
  assert.equal(writes[0].update.fields.name.stringValue, 'PACIENTE TESTE');
  assert.equal(writes[0].update.fields.active.booleanValue, true);

  assert.equal(
    writes[1].update.name,
    'projects/portal-regulacao-test/databases/(default)/documents/telemedicine_followups/retorno-1'
  );
  assert.deepEqual(writes[1].currentDocument, { exists: true });
  assert.deepEqual(writes[1].updateMask.fieldPaths, ['resolution', 'active']);
  assert.equal(writes[1].update.fields.active.booleanValue, false);
});

test('rejeita commit vazio e modo desconhecido', () => {
  assert.throws(() => buildFirestoreCommitWrites(env, []), /Nenhuma gravação/);
  assert.throws(() => buildFirestoreCommitWrites(env, [
    { path: 'telemedicine_events/evento-1', mode: 'replace', data: { ok: true } }
  ]), /Modo de gravação atômica inválido/);
});
