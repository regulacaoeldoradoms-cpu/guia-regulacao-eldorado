import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  FIXED,
  REQUIRED_FIREBASE_BINDINGS,
  activeVersionFromDeployment,
  inspectFirebaseBindings,
  classifyAgendaProbe,
  chooseKnownGoodVersion,
  wranglerArgs
} from './recuperar-firebase-agenda.mjs';

function version(bindings) {
  return { resources: { bindings } };
}

test('identifica deployment produtivo único em 100%', () => {
  const id = '11111111-2222-3333-4444-555555555555';
  assert.equal(activeVersionFromDeployment({
    versions: [{ version_id: id, percentage: 100 }]
  }), id);
  assert.throws(() => activeVersionFromDeployment({
    versions: [
      { version_id: id, percentage: 50 },
      { version_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', percentage: 50 }
    ]
  }), /DISTRIBUICAO_PRODUTIVA_NAO_E_UNICA/);
});

test('considera Firebase pronto apenas com os três bindings necessários', () => {
  const ready = inspectFirebaseBindings(version([
    { name: 'FIREBASE_PROJECT_ID', type: 'plain_text', text: 'projeto' },
    { name: 'FIREBASE_CLIENT_EMAIL', type: 'plain_text', text: 'conta' },
    { name: 'FIREBASE_PRIVATE_KEY', type: 'secret_text' },
    { name: 'OUTRO_BINDING', type: 'plain_text', text: 'irrelevante' }
  ]));
  assert.equal(ready.ready, true);
  assert.deepEqual(ready.missing, []);

  const missing = inspectFirebaseBindings(version([
    { name: 'FIREBASE_PROJECT_ID', type: 'plain_text', text: 'projeto' },
    { name: 'FIREBASE_CLIENT_EMAIL', type: 'plain_text', text: 'conta' }
  ]));
  assert.equal(missing.ready, false);
  assert.deepEqual(missing.missing, ['FIREBASE_PRIVATE_KEY']);
});

test('chave privada precisa continuar como secret_text', () => {
  const summary = inspectFirebaseBindings(version([
    { name: 'FIREBASE_PROJECT_ID', type: 'plain_text', text: 'projeto' },
    { name: 'FIREBASE_CLIENT_EMAIL', type: 'secret_text' },
    { name: 'FIREBASE_PRIVATE_KEY', type: 'plain_text', text: 'nao-aceitar' }
  ]));
  assert.equal(summary.ready, false);
  assert.ok(summary.missing.includes('FIREBASE_PRIVATE_KEY'));
});

test('distingue incidente de armazenamento da barreira de autenticação', () => {
  assert.deepEqual(classifyAgendaProbe(503), {
    status: 503,
    incidentConfirmed: true,
    storageGuardPassed: false
  });
  assert.equal(classifyAgendaProbe(403).storageGuardPassed, true);
  assert.equal(classifyAgendaProbe(401).storageGuardPassed, true);
  assert.equal(classifyAgendaProbe(500).storageGuardPassed, false);
});

test('prioriza primeira versão conhecida que tenha bindings íntegros', () => {
  assert.equal(chooseKnownGoodVersion([
    { id: FIXED.knownGoodVersions[0], ready: false },
    { id: FIXED.knownGoodVersions[1], ready: true },
    { id: FIXED.knownGoodVersions[2], ready: true }
  ]), FIXED.knownGoodVersions[1]);
  assert.equal(chooseKnownGoodVersion([]), '');
});

test('comando Wrangler fixa versão e não embute credenciais', () => {
  const args = wranglerArgs(['deployments', 'status']);
  assert.deepEqual(args.slice(0, 2), ['--yes', 'wrangler@' + FIXED.wranglerVersion]);
  const joined = args.join(' ');
  for (const name of REQUIRED_FIREBASE_BINDINGS) assert.doesNotMatch(joined, new RegExp(name + '='));
  assert.doesNotMatch(joined, /token|private-key|client-secret/i);
});

test('script não contém valor real de segredo nem imprime payload de bindings', () => {
  const source = fs.readFileSync(new URL('./recuperar-firebase-agenda.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /AIza[0-9A-Za-z_-]{20,}/);
  assert.doesNotMatch(source, /-----BEGIN PRIVATE KEY-----/);
  assert.doesNotMatch(source, /console\.log\([^\n]*(binding\.text|stdout|stderr)/);
  assert.match(source, /firebaseBindingsAusentes/);
  assert.match(source, /ROLLBACK_DE_SEGURANCA/);
  assert.match(source, /keep_vars=true/);
});
