import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FIXED,
  PUBLIC_NAMES,
  SECRET_NAMES,
  SOURCE_BLOBS,
  SafeError,
  productionSnapshot,
  inspectOldPreview,
  inspectProduction,
  buildConfig,
  oldControlSql,
  createControlSql,
  stateControlSql,
  enableControlSql,
  disableControlSql,
  validateOldControl,
  validateNewControl,
  latestVersion,
  uploadedId,
  verifyUploadedAlias,
  verifyVersion,
} from './preparar-nova-janela-4d-v4.mjs';

const db = '11111111-2222-3333-4444-555555555555';
const newControl = 'phase4d_0123456789abcdef0123456789abcdef';
const expires = 1790000000;

function previewVersion() {
  const vars = {
    ALLOWED_ORIGINS: FIXED.pages,
    AUTH_DEVELOPER_USERNAMES: 'dev',
    DOCUMENTS_DRIVE_WRITE_ENABLED: 'false',
    DOCUMENTS_HOMOLOGATION_CONTROL_ID: FIXED.oldControl,
    DOCUMENTS_HOMOLOGATION_DIAGNOSTICS: 'true',
    DOCUMENTS_HOMOLOGATION_ORIGIN: FIXED.pages,
    DOCUMENTS_HOMOLOGATION_RELEASE: '2fee19e69e06ecd128be2b103354fc6c2fb4e431',
    DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN: FIXED.origin,
    GOOGLE_DRIVE_OAUTH_CLIENT_ID: 'client',
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI: 'https://example.test/callback',
  };
  return {
    id: FIXED.oldPreview,
    resources: {
      bindings: [
        ...PUBLIC_NAMES.map(name => ({ name, type: 'plain_text', text: vars[name] })),
        ...SECRET_NAMES.map(name => ({ name, type: 'secret_text' })),
        { name: 'AUTH_DB', type: 'd1', id: db },
      ],
      script_runtime: { compatibility_date: '2026-08-25', compatibility_flags: [] },
    },
    annotations: { 'workers/alias': FIXED.alias },
  };
}

function productionVersion(base) {
  return {
    id: FIXED.productionVersion,
    resources: {
      bindings: [
        { name: 'AUTH_DB', type: 'd1', id: db },
        ...SECRET_NAMES.map(name => ({ name, type: 'secret_text' })),
        { name: 'AUTH_DEVELOPER_USERNAMES', type: 'plain_text', text: base.vars.AUTH_DEVELOPER_USERNAMES },
        { name: 'GOOGLE_DRIVE_OAUTH_CLIENT_ID', type: 'plain_text', text: base.vars.GOOGLE_DRIVE_OAUTH_CLIENT_ID },
        { name: 'GOOGLE_DRIVE_OAUTH_REDIRECT_URI', type: 'plain_text', text: base.vars.GOOGLE_DRIVE_OAUTH_REDIRECT_URI },
        { name: 'EXTRA_PRODUCTION_BINDING', type: 'plain_text', text: 'ignored' },
      ],
    },
  };
}

test('snapshot produtivo exige deployment, versão e 100% exatos', () => {
  assert.deepEqual(productionSnapshot({
    id: FIXED.productionDeployment,
    versions: [{ version_id: FIXED.productionVersion, percentage: 100 }],
  }), {
    deploymentId: FIXED.productionDeployment,
    versionId: FIXED.productionVersion,
    percentage: 100,
  });
  assert.throws(() => productionSnapshot({
    id: FIXED.productionDeployment,
    versions: [{ version_id: FIXED.productionVersion, percentage: 99 }],
  }), SafeError);
});

test('preview-base precisa estar desarmado e restrito', () => {
  const base = inspectOldPreview(previewVersion());
  assert.equal(base.db, db);
  assert.equal(base.vars.DOCUMENTS_DRIVE_WRITE_ENABLED, 'false');
  const bad = previewVersion();
  bad.resources.bindings.find(x => x.name === 'DOCUMENTS_DRIVE_WRITE_ENABLED').text = 'true';
  assert.throws(() => inspectOldPreview(bad), /PREVIEW_BASE_COM_ESCRITA/);
});

test('produção só precisa dos bindings compartilhados revisados', () => {
  const base = inspectOldPreview(previewVersion());
  assert.equal(inspectProduction(productionVersion(base), base), true);
  const bad = productionVersion(base);
  bad.resources.bindings = bad.resources.bindings.filter(x => x.name !== 'DRIVE_TOKEN_ENCRYPTION_KEY');
  assert.throws(() => inspectProduction(bad, base), /SEGREDO_PRODUTIVO_AUSENTE/);
});

test('configuração nova muda somente controle, release e mantém gate false', () => {
  const base = inspectOldPreview(previewVersion());
  const config = buildConfig(base, 'C:/tmp/worker/homologation-4d.js', newControl);
  assert.equal(config.vars.DOCUMENTS_DRIVE_WRITE_ENABLED, 'false');
  assert.equal(config.vars.DOCUMENTS_HOMOLOGATION_CONTROL_ID, newControl);
  assert.equal(config.vars.DOCUMENTS_HOMOLOGATION_RELEASE, FIXED.candidateRelease);
  assert.deepEqual(config.secrets.required, [...SECRET_NAMES]);
  assert.deepEqual(config.unsafe.metadata.keep_bindings, []);
  assert.equal(config.d1_databases[0].database_id, db);
});

test('SQL novo copia escopo sem conter usuário ou fileId e começa desabilitado', () => {
  const sql = createControlSql(newControl, expires);
  assert.match(sql, /SELECT 'phase4d_[a-f0-9]{32}',0,1790000000,allowed_username,allowed_file_ids_json/);
  assert.match(sql, /control_id='phase4d_d7275a73110548fc8fd26125a60d6a2b'/);
  assert.match(sql, /json_array_length\(allowed_file_ids_json\)=1/);
  assert.match(sql, /NOT EXISTS/);
  assert.doesNotMatch(sql, /@|drive\.google|fileId/i);
  assert.match(oldControlSql(), /active_controls/);
  assert.match(stateControlSql(newControl), /other_active_controls/);
  assert.match(enableControlSql(newControl, expires), /SET enabled=1/);
  assert.match(disableControlSql(newControl), /SET enabled=0/);
});

test('validação do D1 usa somente flags, prazo e contagens', () => {
  const old = [{ results: [{ enabled: 0, expires_at: 1, file_count: 1, active_controls: 0 }] }];
  assert.equal(validateOldControl(old), true);
  const fresh0 = [{ results: [{ enabled: 0, expires_at: expires, file_count: 1, other_active_controls: 0 }] }];
  const fresh1 = [{ results: [{ enabled: 1, expires_at: expires, file_count: 1, other_active_controls: 0 }] }];
  assert.equal(validateNewControl(fresh0, expires, 0), true);
  assert.equal(validateNewControl(fresh1, expires, 1), true);
  assert.throws(() => validateNewControl([{ results: [{ enabled: 1, expires_at: expires, file_count: 2, other_active_controls: 0 }] }], expires, 1), SafeError);
});

test('controle e hashes de runtime estão fechados sobre o candidato validado', () => {
  assert.equal(FIXED.candidateRelease.length, 40);
  assert.equal(Object.keys(SOURCE_BLOBS).length, 15);
  assert.equal(SOURCE_BLOBS['worker/homologation-4d.js'], 'eb4fb65ddb7bf40866e17e2a7402f2fc5b84f47b');
  assert.ok(Object.values(SOURCE_BLOBS).every(x => /^[a-f0-9]{40}$/.test(x)));
});

test('ordenação e leitura de saída não aceitam IDs ambíguos', () => {
  const now = Date.now();
  const a = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const b = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  assert.equal(latestVersion([
    { id: a, metadata: { created_on: new Date(now - 1000).toISOString() } },
    { id: b, metadata: { created_on: new Date(now).toISOString() } },
  ]), b);
  const id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  assert.equal(uploadedId('Worker Version ID: ' + id), id);
  assert.equal(verifyUploadedAlias('Version Preview Alias URL: ' + FIXED.origin), undefined);
});

test('versão publicada precisa refletir config e alias novos', () => {
  const base = inspectOldPreview(previewVersion());
  const config = buildConfig(base, 'C:/tmp/worker/homologation-4d.js', newControl);
  const id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  const v = previewVersion();
  v.id = id;
  v.resources.bindings = v.resources.bindings.map(b => {
    if (b.name === 'DOCUMENTS_HOMOLOGATION_CONTROL_ID') return { ...b, text: newControl };
    if (b.name === 'DOCUMENTS_HOMOLOGATION_RELEASE') return { ...b, text: FIXED.candidateRelease };
    return b;
  });
  v.annotations = { 'workers/alias': FIXED.alias };
  assert.equal(verifyVersion(v, config, id), true);
});
