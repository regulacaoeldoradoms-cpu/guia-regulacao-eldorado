import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  SAFE_DEPLOY,
  CRITICAL_BINDINGS,
  activeVersionFromDeployment,
  latestVersionEntry,
  latestVersionFromList,
  isSafeDeployCandidateVersion,
  newUploadedVersion,
  authDbDatabaseId,
  currentSecretBindingNames,
  validateCandidateBindings,
  injectAuthDbDatabaseId,
  injectRequiredSecrets,
  classifyAgendaProbe,
  wranglerArgs,
  wranglerCliPath
} from '../scripts/deploy-safe.mjs';

function version(bindings) {
  return { resources: { bindings } };
}

const DB = '11111111-2222-3333-4444-555555555555';

function activeBindings() {
  return [
    { name: 'AUTH_DB', type: 'd1', id: DB },
    { name: 'AI', type: 'ai' },
    { name: 'FIREBASE_PROJECT_ID', type: 'plain_text', text: 'portal-projeto' },
    { name: 'FIREBASE_CLIENT_EMAIL', type: 'plain_text', text: 'firebase@example.test' },
    { name: 'FIREBASE_PRIVATE_KEY', type: 'secret_text' },
    { name: 'FIREBASE_STORAGE_BUCKET', type: 'plain_text', text: 'portal-projeto.firebasestorage.app' },
    { name: 'AUTH_SESSION_SECRET', type: 'secret_text' },
    { name: 'AUTH_RATE_LIMIT_SECRET', type: 'secret_text' },
    { name: 'GEMINI_API_KEY', type: 'secret_text' },
    { name: 'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET', type: 'secret_text' },
    { name: 'DRIVE_TOKEN_ENCRYPTION_KEY', type: 'secret_text' },
    { name: 'POSTHOG_PROJECT_TOKEN', type: 'secret_text' },
    { name: 'ALLOWED_ORIGINS', type: 'plain_text', text: 'https://example.test' }
  ];
}

test('aceita somente deployment produtivo único em 100%', () => {
  const id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  assert.equal(activeVersionFromDeployment({
    versions: [{ version_id: id, percentage: 100 }]
  }), id);

  assert.throws(() => activeVersionFromDeployment({
    versions: [
      { version_id: id, percentage: 50 },
      { version_id: '99999999-8888-7777-6666-555555555555', percentage: 50 }
    ]
  }), /PRODUCAO_NAO_E_VERSAO_UNICA_EM_100/);
});

test('identifica a Worker Version mais recente por created_on', () => {
  const oldId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  const newId = '99999999-8888-7777-6666-555555555555';
  const values = [
    { id: oldId, metadata: { created_on: '2026-09-18T10:00:00.000Z' } },
    { id: newId, metadata: { created_on: '2026-09-18T11:00:00.000Z' } }
  ];
  assert.equal(latestVersionEntry(values).id, newId);
  assert.equal(latestVersionFromList(values), newId);
});

test('reconhece somente candidata órfã criada pelo próprio gate', () => {
  assert.equal(isSafeDeployCandidateVersion({
    annotations: { 'workers/message': SAFE_DEPLOY.candidateMessage }
  }), true);
  assert.equal(isSafeDeployCandidateVersion({
    annotations: { 'workers/tag': SAFE_DEPLOY.candidateTag }
  }), true);
  assert.equal(isSafeDeployCandidateVersion({
    annotations: { 'workers/message': 'upload manual qualquer' }
  }), false);
});

test('identifica exatamente uma candidata nova', () => {
  const oldId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  const newId = '99999999-8888-7777-6666-555555555555';
  assert.equal(newUploadedVersion(
    [{ id: oldId }],
    [{ id: newId }, { id: oldId }]
  ), newId);
  assert.throws(() => newUploadedVersion([{ id: oldId }], [{ id: oldId }]), /VERSAO_CANDIDATA_NAO_IDENTIFICADA/);
});

test('obtém o mesmo AUTH_DB da versão ativa', () => {
  assert.equal(authDbDatabaseId(version(activeBindings())), DB);
});

test('lista todos os secrets atuais para preservação dinâmica', () => {
  assert.deepEqual(currentSecretBindingNames(version(activeBindings())), [
    'AUTH_RATE_LIMIT_SECRET',
    'AUTH_SESSION_SECRET',
    'DRIVE_TOKEN_ENCRYPTION_KEY',
    'FIREBASE_PRIVATE_KEY',
    'GEMINI_API_KEY',
    'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET',
    'POSTHOG_PROJECT_TOKEN'
  ]);
});

test('candidata íntegra preserva críticos, secrets e Firebase público', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().map((binding) => ({ ...binding })));
  const result = validateCandidateBindings(active, candidate);
  assert.equal(result.critical, CRITICAL_BINDINGS.length);
  assert.equal(result.preservedSecrets, 7);
  assert.equal(result.authDbId, DB);
});

test('Gemini não é requisito fixo do gate quando já está ausente na produção', () => {
  const withoutGemini = activeBindings().filter((binding) => binding.name !== 'GEMINI_API_KEY');
  const active = version(withoutGemini);
  const candidate = version(withoutGemini.map((binding) => ({ ...binding })));
  const result = validateCandidateBindings(active, candidate);
  assert.equal(result.critical, CRITICAL_BINDINGS.length);
  assert.equal(result.preservedSecrets, 6);
});

test('se Gemini existir na produção, o gate continua bloqueando seu desaparecimento', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().filter((binding) => binding.name !== 'GEMINI_API_KEY'));
  assert.throws(
    () => validateCandidateBindings(active, candidate),
    /SEGREDO_ATUAL_NAO_PRESERVADO_GEMINI_API_KEY/
  );
});

test('bloqueia candidata sem chave privada Firebase', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().filter((binding) => binding.name !== 'FIREBASE_PRIVATE_KEY'));
  assert.throws(
    () => validateCandidateBindings(active, candidate),
    /BINDING_CRITICO_AUSENTE_FIREBASE_PRIVATE_KEY/
  );
});

test('bloqueia desaparecimento de qualquer segredo que já exista em produção', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().filter((binding) => binding.name !== 'POSTHOG_PROJECT_TOKEN'));
  assert.throws(
    () => validateCandidateBindings(active, candidate),
    /SEGREDO_ATUAL_NAO_PRESERVADO_POSTHOG_PROJECT_TOKEN/
  );
});

test('bloqueia troca silenciosa de project id, client email ou bucket Firebase', () => {
  const active = version(activeBindings());
  for (const name of ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_STORAGE_BUCKET']) {
    const bindings = activeBindings().map((binding) => (
      binding.name === name ? { ...binding, text: String(binding.text) + '-alterado' } : { ...binding }
    ));
    assert.throws(
      () => validateCandidateBindings(active, version(bindings)),
      new RegExp('FIREBASE_PUBLICO_DIVERGENTE_' + name)
    );
  }
});

test('bloqueia candidata apontando para outro D1', () => {
  const active = version(activeBindings());
  const bindings = activeBindings().map((binding) => (
    binding.name === 'AUTH_DB'
      ? { ...binding, id: '00000000-1111-2222-3333-444444444444' }
      : { ...binding }
  ));
  assert.throws(() => validateCandidateBindings(active, version(bindings)), /AUTH_DB_DIVERGENTE/);
});

test('injeta secrets.required dinamicamente sem gravar valores', () => {
  const source = [
    'name = "yellow-wave-d0a1guia-regulacao-ia"',
    'keep_vars = true',
    ''
  ].join('\n');
  const patched = injectRequiredSecrets(source, [
    'FIREBASE_PRIVATE_KEY',
    'AUTH_SESSION_SECRET',
    'AUTH_SESSION_SECRET'
  ]);
  assert.match(
    patched,
    /\[secrets\]\nrequired = \[ "AUTH_SESSION_SECRET", "FIREBASE_PRIVATE_KEY" \]/
  );
  assert.doesNotMatch(patched, /secret-value|private-key-value/);
  assert.throws(
    () => injectRequiredSecrets(patched, ['AUTH_SESSION_SECRET']),
    /SECAO_SECRETS_JA_EXISTE_NO_WRANGLER/
  );
});

test('injeta database_id somente no AUTH_DB e exige keep_vars', () => {
  const source = [
    'name = "yellow-wave-d0a1guia-regulacao-ia"',
    'keep_vars = true',
    '',
    '[[d1_databases]]',
    'binding = "OUTRA_DB"',
    'database_name = "outra"',
    '',
    '[[d1_databases]]',
    'binding = "AUTH_DB"',
    'database_name = "portal-regulacao-users"',
    ''
  ].join('\n');
  const patched = injectAuthDbDatabaseId(source, DB);
  assert.match(patched, new RegExp('binding = "AUTH_DB"\\ndatabase_name = "portal-regulacao-users"\\ndatabase_id = "' + DB + '"'));
  assert.doesNotMatch(patched, /binding = "OUTRA_DB"\ndatabase_name = "outra"\ndatabase_id/);
});

test('probe anônimo da Agenda distingue saudável de Firebase ausente', () => {
  assert.deepEqual(classifyAgendaProbe(403), { status: 403, healthy: true, firebaseBroken: false });
  assert.deepEqual(classifyAgendaProbe(401), { status: 401, healthy: true, firebaseBroken: false });
  assert.deepEqual(classifyAgendaProbe(503), { status: 503, healthy: false, firebaseBroken: true });
});

test('gate usa Wrangler local fixado pelo package.json sem passar por npx', () => {
  assert.deepEqual(wranglerArgs(['versions', 'list']), ['versions', 'list']);
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.devDependencies?.wrangler, SAFE_DEPLOY.wranglerVersion);

  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'safe-deploy-wrangler-'));
  try {
    const cli = path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
    fs.mkdirSync(path.dirname(cli), { recursive: true });
    fs.writeFileSync(cli, '#!/usr/bin/env node\n');
    assert.equal(wranglerCliPath(root), cli);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('fonte do gate não usa deploy monolítico nem contém credenciais', () => {
  const source = fs.readFileSync(new URL('../scripts/deploy-safe.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /wrangler\s+deploy/);
  assert.doesNotMatch(source, /-----BEGIN PRIVATE KEY-----/);
  assert.doesNotMatch(source, /AIza[0-9A-Za-z_-]{20,}/);
  assert.match(source, /'versions', 'upload'/);
  assert.match(source, /'versions', 'deploy'/);
  assert.match(source, /--experimental-provision=false/);
  assert.match(source, /--experimental-auto-create=false/);
  assert.doesNotMatch(source, /'--strict'/);
  assert.match(source, /'--tag', SAFE_DEPLOY\.candidateTag/);
  assert.match(source, /injectRequiredSecrets\(/);
  assert.match(source, /candidataOrfaAnterior/);
  assert.doesNotMatch(source, /must\(latestBefore === originalVersion/);
  assert.match(source, /CLOUDFLARE_ACCOUNT_ID: SAFE_DEPLOY\.account/);
  assert.match(source, /account_id: SAFE_DEPLOY\.account/);
  assert.match(source, /node_modules', 'wrangler', 'bin', 'wrangler\.js'/);
  assert.match(source, /run\(process\.execPath, \[cli, \.\.\.wranglerArgs\(args\)\]/);
  assert.doesNotMatch(source, /npx\.cmd|run\('npx'/);
  assert.match(source, /ULTIMA_VERSAO_NAO_E_A_PRODUCAO_PARE_E_REVISE/);
  assert.match(source, /path\.join\(root, '\.wrangler\.safe-deploy-'/);
  assert.match(source, /fs\.rmSync\(deployConfig/);
  assert.doesNotMatch(source, /path\.join\(tempRoot, 'wrangler\.safe-deploy\.toml'\)/);
  assert.match(source, /ROLLBACK_DE_SEGURANCA=OK/);
  assert.match(source, /AGENDA_FIREBASE_503_APOS_DEPLOY/);
});


test('produção desativa Preview URLs para o gate seguro', () => {
  const wrangler = fs.readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
  assert.match(wrangler, /^preview_urls\s*=\s*false\s*$/m);
  assert.match(wrangler, /^workers_dev\s*=\s*true\s*$/m);
});
