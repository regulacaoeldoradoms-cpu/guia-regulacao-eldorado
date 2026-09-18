import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  FIXED,
  REQUIRED_FIREBASE_BINDINGS,
  activeVersionFromDeployment,
  inspectFirebaseBindings,
  firebaseRecoveryPlan,
  injectVars,
  injectRequiredSecrets,
  buildRecoveryToml,
  authDbDatabaseId,
  injectAuthDbDatabaseId,
  classifyWranglerFailure,
  classifyAgendaProbe,
  chooseKnownGoodVersion,
  mainBranchApiUrl,
  mainArchiveUrl,
  remoteMainSha,
  locateExtractedRepository,
  wranglerArgs,
  npxCliPath
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

test('plano de recuperação copia apenas valores públicos e nomes de segredos Firebase', () => {
  const plan = firebaseRecoveryPlan(version([
    { name: 'FIREBASE_PROJECT_ID', type: 'plain_text', text: 'projeto-a' },
    { name: 'FIREBASE_CLIENT_EMAIL', type: 'plain_text', text: 'svc@example.test' },
    { name: 'FIREBASE_PRIVATE_KEY', type: 'secret_text' },
    { name: 'FIREBASE_WEB_API_KEY', type: 'secret_text' },
    { name: 'FIREBASE_STORAGE_BUCKET', type: 'plain_text', text: 'bucket-a' }
  ]));
  assert.deepEqual(plan.vars, {
    FIREBASE_PROJECT_ID: 'projeto-a',
    FIREBASE_CLIENT_EMAIL: 'svc@example.test',
    FIREBASE_STORAGE_BUCKET: 'bucket-a'
  });
  assert.deepEqual(plan.secrets, ['FIREBASE_PRIVATE_KEY', 'FIREBASE_WEB_API_KEY']);
});

test('plano rejeita chave privada Firebase fora de secret_text', () => {
  assert.throws(() => firebaseRecoveryPlan(version([
    { name: 'FIREBASE_PROJECT_ID', type: 'plain_text', text: 'projeto-a' },
    { name: 'FIREBASE_CLIENT_EMAIL', type: 'plain_text', text: 'svc@example.test' },
    { name: 'FIREBASE_PRIVATE_KEY', type: 'plain_text', text: 'nao-aceitar' }
  ])), /FIREBASE_PRIVATE_KEY_NAO_E_SEGREDO/);
});

test('injeta variáveis Firebase na seção vars sem alterar as demais', () => {
  const source = [
    'name = "worker"',
    'keep_vars = true',
    '',
    '[vars]',
    'ALLOWED_ORIGINS = "https://example.test"',
    '',
    '[ai]',
    'binding = "AI"',
    ''
  ].join('\n');
  const patched = injectVars(source, { FIREBASE_PROJECT_ID: 'projeto-a', FIREBASE_CLIENT_EMAIL: 'svc@example.test' });
  assert.match(patched, /ALLOWED_ORIGINS = "https:\/\/example\.test"/);
  assert.match(patched, /FIREBASE_PROJECT_ID = "projeto-a"/);
  assert.match(patched, /FIREBASE_CLIENT_EMAIL = "svc@example\.test"/);
  assert.ok(patched.indexOf('FIREBASE_PROJECT_ID') < patched.indexOf('[ai]'));
});

test('declara segredos Firebase exigidos sem gravar valores', () => {
  const source = 'name = "worker"\nkeep_vars = true\n';
  const patched = injectRequiredSecrets(source, ['FIREBASE_PRIVATE_KEY', 'FIREBASE_WEB_API_KEY']);
  assert.match(patched, /\[secrets\]/);
  assert.match(patched, /required = \[ "FIREBASE_PRIVATE_KEY", "FIREBASE_WEB_API_KEY" \]/);
  assert.doesNotMatch(patched, /PRIVATE KEY-----|AIza/);
});

test('configuração final combina D1, vars públicos e segredo obrigatório do Firebase', () => {
  const id = '11111111-2222-3333-4444-555555555555';
  const source = [
    'name = "worker"',
    'keep_vars = true',
    '',
    '[vars]',
    'ALLOWED_ORIGINS = "https://example.test"',
    '',
    '[[d1_databases]]',
    'binding = "AUTH_DB"',
    'database_name = "portal-regulacao-users"',
    ''
  ].join('\n');
  const recovered = version([
    { name: 'FIREBASE_PROJECT_ID', type: 'plain_text', text: 'projeto-a' },
    { name: 'FIREBASE_CLIENT_EMAIL', type: 'plain_text', text: 'svc@example.test' },
    { name: 'FIREBASE_PRIVATE_KEY', type: 'secret_text' },
    { name: 'FIREBASE_STORAGE_BUCKET', type: 'plain_text', text: 'bucket-a' }
  ]);
  const built = buildRecoveryToml(source, id, recovered);
  assert.match(built.toml, new RegExp('database_id = "' + id + '"'));
  assert.match(built.toml, /FIREBASE_PROJECT_ID = "projeto-a"/);
  assert.match(built.toml, /required = \[ "FIREBASE_PRIVATE_KEY" \]/);
  assert.deepEqual(built.plan.secrets, ['FIREBASE_PRIVATE_KEY']);
});
test('recuperação reaproveita o ID D1 já ligado ao AUTH_DB', () => {
  const id = '11111111-2222-3333-4444-555555555555';
  assert.equal(authDbDatabaseId(version([
    { name: 'AUTH_DB', type: 'd1', id }
  ])), id);
  assert.throws(() => authDbDatabaseId(version([
    { name: 'AUTH_DB', type: 'd1', id: 'invalido' }
  ])), /AUTH_DB_ID_NAO_IDENTIFICADO/);
});

test('injeta database_id somente no bloco AUTH_DB do wrangler temporário', () => {
  const id = '11111111-2222-3333-4444-555555555555';
  const source = [
    'name = "worker"',
    'keep_vars = true',
    '',
    '[[d1_databases]]',
    'binding = "OUTRA_DB"',
    'database_name = "outra"',
    '',
    '[[d1_databases]]',
    'binding = "AUTH_DB"',
    'database_name = "portal-regulacao-users"',
    '',
    '[ai]',
    'binding = "AI"',
    ''
  ].join('\n');
  const patched = injectAuthDbDatabaseId(source, id);
  assert.match(patched, /binding = "AUTH_DB"\ndatabase_name = "portal-regulacao-users"\ndatabase_id = "11111111-2222-3333-4444-555555555555"/);
  assert.doesNotMatch(patched, /binding = "OUTRA_DB"\ndatabase_name = "outra"\ndatabase_id/);
  assert.equal((patched.match(/database_id =/g) || []).length, 1);
});

test('substitui database_id antigo no bloco AUTH_DB sem duplicar a chave', () => {
  const id = '11111111-2222-3333-4444-555555555555';
  const source = [
    '[[d1_databases]]',
    'binding = "AUTH_DB"',
    'database_name = "portal-regulacao-users"',
    'database_id = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"',
    ''
  ].join('\n');
  const patched = injectAuthDbDatabaseId(source, id);
  assert.equal((patched.match(/database_id =/g) || []).length, 1);
  assert.match(patched, new RegExp(id));
  assert.doesNotMatch(patched, /aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/);
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


test('baixa a main por API/ZIP público sem depender de Git instalado', async () => {
  const sha = '1234567890abcdef1234567890abcdef12345678';
  assert.equal(
    mainBranchApiUrl(),
    'https://api.github.com/repos/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/branches/main'
  );
  assert.equal(
    mainArchiveUrl(sha),
    'https://codeload.github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/zip/' + sha
  );
  const observed = await remoteMainSha(async () => ({
    ok: true,
    async json() { return { commit: { sha } }; }
  }));
  assert.equal(observed, sha);
});

test('localiza repositório extraído pelo nome do snapshot', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agenda-recovery-test-'));
  try {
    const folder = path.join(root, 'guia-regulacao-eldorado-1234567');
    fs.mkdirSync(path.join(folder, 'worker'), { recursive: true });
    fs.writeFileSync(path.join(folder, 'worker', 'wrangler.toml'), 'name = "teste"\n');
    assert.equal(locateExtractedRepository(root), folder);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('classifica falhas do Wrangler sem precisar exibir stdout ou stderr', () => {
  assert.equal(classifyWranglerFailure({ status: 1, stderr: 'Missing database_id for D1 binding' }), 'CONFIG_D1');
  assert.equal(classifyWranglerFailure({ status: 1, stderr: 'You are not logged in. Please login.' }), 'AUTENTICACAO_CLOUDFLARE');
  assert.equal(classifyWranglerFailure({ status: 1, stderr: 'fetch failed ETIMEDOUT' }), 'REDE');
  assert.equal(classifyWranglerFailure({ status: null, stderr: '' }), 'PROCESSO_NAO_INICIADO');
});

test('Windows resolve o npx-cli.js ao lado da instalação do Node', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agenda-npx-cli-test-'));
  try {
    const node = path.join(root, 'node.exe');
    const cli = path.join(root, 'node_modules', 'npm', 'bin', 'npx-cli.js');
    fs.mkdirSync(path.dirname(cli), { recursive: true });
    fs.writeFileSync(node, '');
    fs.writeFileSync(cli, '');
    assert.equal(npxCliPath(node), cli);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('launcher do Windows não depende de powershell.exe nem npx.cmd', () => {
  const source = fs.readFileSync(new URL('./recuperar-firebase-agenda.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /windowsWranglerCommand/);
  assert.doesNotMatch(source, /npx\.cmd/);
  assert.match(source, /process\.execPath/);
  assert.match(source, /npx-cli\.js/);
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
  assert.match(source, /bindings Firebase explícitos/);
  assert.match(source, /firebaseSegredosExigidos/);
  assert.doesNotMatch(source, /safeLine\([^\n]*(FIREBASE_PROJECT_ID|FIREBASE_CLIENT_EMAIL|FIREBASE_WEB_API_KEY|FIREBASE_STORAGE_BUCKET)/);
  assert.doesNotMatch(source, /git\s+clone|ls-remote|rev-parse/);
  assert.match(source, /codeload\.github\.com/);
  assert.match(source, /Expand-Archive/);
  assert.match(source, /npx-cli\.js/);
});
