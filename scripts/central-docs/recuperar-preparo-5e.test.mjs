import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

import {
  markerValue,
  recentCandidate,
  matchesMarker
} from './recuperar-preparo-5e.mjs';

const marker = {
  sourceRef: 'a'.repeat(40),
  controlId: 'phase5e_' + '1'.repeat(32),
  expiresAt: 1900000000,
  attemptedAt: new Date(Date.now() - 60_000).toISOString()
};

function previewVersion(overrides = {}) {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    metadata: { created_on: new Date().toISOString() },
    annotations: {
      'workers/alias': 'central-docs-phase5e',
      'workers/tag': 'central-docs-phase5e',
      'workers/message': 'Central Docs 5E: IA documental controlada'
    },
    resources: {
      bindings: [
        { name: 'DOCUMENTS_AI_HOMOLOGATION_RELEASE', type: 'plain_text', text: marker.sourceRef },
        { name: 'DOCUMENTS_AI_HOMOLOGATION_CONTROL_ID', type: 'plain_text', text: marker.controlId },
        { name: 'DOCUMENTS_AI_HOMOLOGATION_ORIGIN', type: 'plain_text', text: 'https://example.pages.dev' },
        { name: 'DOCUMENTS_AI_ENABLED', type: 'plain_text', text: 'true' },
        { name: 'DOCUMENTS_AI_PROCESSING_ENABLED', type: 'plain_text', text: 'true' },
        { name: 'DOCUMENTS_AI_FREE_ONLY', type: 'plain_text', text: 'true' },
        { name: 'DOCUMENTS_DRIVE_WRITE_ENABLED', type: 'plain_text', text: 'false' },
        { name: 'AUTH_DB', type: 'd1', id: 'db-id' },
        { name: 'AI', type: 'ai' }
      ]
    },
    ...overrides
  };
}

test('marcador de preparo interrompido exige shape estrito', () => {
  assert.deepEqual(markerValue(marker), marker);
  assert.throws(
    () => markerValue({ ...marker, sourceRef: 'x' }),
    /MARCADOR_5E_SOURCE_INVALIDO/
  );
  assert.throws(
    () => markerValue({ ...marker, controlId: 'phase5e_invalido' }),
    /MARCADOR_5E_CONTROLE_INVALIDO/
  );
});

test('candidato recente exige alias tag mensagem e janela temporal', () => {
  const item = previewVersion();
  assert.equal(recentCandidate(item, marker.attemptedAt), true);
  assert.equal(recentCandidate({
    ...item,
    annotations: { ...item.annotations, 'workers/alias': 'outro' }
  }, marker.attemptedAt), false);
  assert.equal(recentCandidate({
    ...item,
    metadata: { created_on: '2020-01-01T00:00:00.000Z' }
  }, marker.attemptedAt), false);
});

test('preview recuperável exige release controle gates D1 AI e não pode ser produção', () => {
  const version = previewVersion();
  assert.equal(matchesMarker(version, marker, 'db-id', '22222222-2222-4222-8222-222222222222'), true);
  assert.equal(matchesMarker(version, marker, 'db-id', version.id), false);

  const changed = structuredClone(version);
  changed.resources.bindings.find((item) => item.name === 'DOCUMENTS_DRIVE_WRITE_ENABLED').text = 'true';
  assert.equal(matchesMarker(changed, marker, 'db-id', '22222222-2222-4222-8222-222222222222'), false);
});

test('recuperador é fail-closed e nunca contém operação de ativação/upload/deploy', async () => {
  const source = await fs.readFile(new URL('./recuperar-preparo-5e.mjs', import.meta.url), 'utf8');
  assert.match(source, /disableControlSql/);
  assert.match(source, /controlEnabled=false/);
  assert.match(source, /markerCleared=true/);
  assert.doesNotMatch(source, /enableControlSql/);
  assert.doesNotMatch(source, /versions['"],\s*['"]upload/);
  assert.doesNotMatch(source, /versions['"],\s*['"]deploy/);
  assert.doesNotMatch(source, /wrangler\s+deploy/);
  assert.doesNotMatch(source, /DOCUMENTS_DRIVE_WRITE_ENABLED['"]?\s*[:=]\s*['"]true/);
});
