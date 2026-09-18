import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FIXED_5E,
  Safe5eError,
  activeVersionFromDeployment,
  buildPreviewConfig,
  createControlSql,
  enableControlSql,
  inspectMultipart,
  inspectProductionVersion,
  parseArgs,
  runWrangler,
  stateControlSql,
  validateControl,
  validatePagesOrigin,
  validateTemplateControl,
  verifyPreviewVersion
} from './preparar-homologacao-5e.mjs';

const DB = '11111111-2222-3333-4444-555555555555';
const VERSION = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
const CONTROL = 'phase5e_' + '1'.repeat(32);
const SOURCE = 'a'.repeat(40);
const PAGES = 'https://abc123.portal-regulacao-central-staging.pages.dev';

function production({ gemini = true } = {}) {
  const bindings = [
    { name: 'AUTH_DB', type: 'd1', id: DB },
    { name: 'AUTH_SESSION_SECRET', type: 'secret_text' },
    { name: 'AUTH_RATE_LIMIT_SECRET', type: 'secret_text' },
    { name: 'AUTH_USERS_JSON', type: 'secret_text' },
    { name: 'GEMINI_MODEL', type: 'plain_text', text: 'gemini-test-model' },
    { name: 'DOCUMENTS_AI_ENABLED', type: 'plain_text', text: 'false' },
    { name: 'DOCUMENTS_AI_PROCESSING_ENABLED', type: 'plain_text', text: 'false' },
    { name: 'DOCUMENTS_DRIVE_WRITE_ENABLED', type: 'plain_text', text: 'true' }
  ];
  if (gemini) bindings.push({ name: 'GEMINI_API_KEY', type: 'secret_text' });
  return {
    id: VERSION,
    resources: {
      bindings,
      script_runtime: {
        compatibility_date: '2026-08-25',
        compatibility_flags: []
      }
    },
    annotations: {}
  };
}

test('argumentos 5E exigem commit fixo e origem Pages HTTPS limpa', () => {
  const parsed = parseArgs([
    '--preparar',
    '--source-ref', SOURCE,
    '--pages-origin', PAGES
  ]);
  assert.equal(parsed.sourceRef, SOURCE);
  assert.equal(parsed.pagesOrigin, PAGES);

  assert.throws(() => parseArgs([
    '--preparar', '--source-ref', 'main', '--pages-origin', PAGES
  ]), /SOURCE_REF_5E_INVALIDO/);
  assert.throws(() => validatePagesOrigin('https://example.com/'), /PAGES_ORIGIN_5E_INVALIDA/);
  assert.throws(() => validatePagesOrigin(PAGES + '/rota'), /PAGES_ORIGIN_5E_INVALIDA/);
});

test('produção 5E precisa de AUTH_DB, sessão, rate limit e Gemini sem ler valores', () => {
  const base = inspectProductionVersion(production());
  assert.equal(base.dbId, DB);
  assert.equal(base.plainVars.GEMINI_MODEL, 'gemini-test-model');
  assert.deepEqual(base.secretNames, [
    'AUTH_RATE_LIMIT_SECRET',
    'AUTH_SESSION_SECRET',
    'AUTH_USERS_JSON',
    'GEMINI_API_KEY'
  ]);
  assert.throws(
    () => inspectProductionVersion(production({ gemini: false })),
    (error) => error instanceof Safe5eError
      && error.message === 'INTERVENCAO_NECESSARIA_GEMINI_API_KEY_AUSENTE'
  );
});

test('config preview 5E liga somente IA e mantém escrita Drive false', () => {
  const base = inspectProductionVersion(production());
  const config = buildPreviewConfig(base, 'C:/tmp/worker/homologation-5e.js', {
    sourceRef: SOURCE,
    pagesOrigin: PAGES,
    controlId: CONTROL
  });

  assert.equal(config.vars.DOCUMENTS_AI_ENABLED, 'true');
  assert.equal(config.vars.DOCUMENTS_AI_PROCESSING_ENABLED, 'true');
  assert.equal(config.vars.DOCUMENTS_DRIVE_WRITE_ENABLED, 'false');
  assert.equal(config.vars.ALLOWED_ORIGINS, PAGES);
  assert.equal(config.vars.DOCUMENTS_AI_HOMOLOGATION_CONTROL_ID, CONTROL);
  assert.equal(config.vars.DOCUMENTS_AI_HOMOLOGATION_RELEASE, SOURCE);
  assert.equal(config.d1_databases[0].database_id, DB);
  assert.deepEqual(config.unsafe.metadata.keep_bindings, []);
  assert.ok(config.secrets.required.includes('GEMINI_API_KEY'));
  assert.equal(JSON.stringify(config).includes('secret-value'), false);
});

test('dry-run multipart aceita só vars explícitas, inherits restritos e AUTH_DB', async () => {
  const base = inspectProductionVersion(production());
  const config = buildPreviewConfig(base, 'C:/tmp/worker/homologation-5e.js', {
    sourceRef: SOURCE,
    pagesOrigin: PAGES,
    controlId: CONTROL
  });

  const metadata = {
    main_module: 'homologation-5e.js',
    keep_bindings: [],
    annotations: {
      'workers/alias': FIXED_5E.alias,
      'workers/tag': FIXED_5E.tag,
      'workers/message': FIXED_5E.message
    },
    bindings: [
      ...Object.entries(config.vars).map(([name, text]) => ({
        name, type: 'plain_text', text
      })),
      ...config.secrets.required.map((name) => ({ name, type: 'inherit' })),
      { name: 'AUTH_DB', type: 'd1', id: DB }
    ]
  };

  const form = new FormData();
  form.append('metadata', JSON.stringify(metadata));
  form.append('homologation-5e.js', new Blob(['export default {};'], {
    type: 'application/javascript'
  }), 'homologation-5e.js');
  const request = new Request('https://example.invalid', {
    method: 'POST',
    body: form
  });
  const bytes = Buffer.from(await request.arrayBuffer());
  await assert.doesNotReject(() => inspectMultipart(bytes, config));

  metadata.bindings.find((item) => item.name === 'GEMINI_API_KEY').type = 'plain_text';
  const bad = new FormData();
  bad.append('metadata', JSON.stringify(metadata));
  bad.append('homologation-5e.js', new Blob(['export default {};']), 'homologation-5e.js');
  const badBytes = Buffer.from(await new Request('https://example.invalid', {
    method: 'POST',
    body: bad
  }).arrayBuffer());
  await assert.rejects(() => inspectMultipart(badBytes, config), /SEGREDO_5E_MULTIPART_NAO_RESTRITO/);
});

test('controle 5E nasce desabilitado, tem prazo fixo e só ativa sem outra janela', () => {
  const expiresAt = 1800000000;
  assert.match(createControlSql(CONTROL, expiresAt), /SELECT 'phase5e_/);
  assert.match(createControlSql(CONTROL, expiresAt), /,0,1800000000,/);
  assert.match(enableControlSql(CONTROL, expiresAt), /expires_at>CAST/);
  assert.match(stateControlSql(CONTROL), /other_active_controls/);

  assert.match(templateControlSql(), /auth_document_access/);
  assert.match(templateControlSql(), /can_extract=1/);
  assert.equal(validateTemplateControl([{
    results: [{ enabled: 0, active_controls: 0, extract_allowed: 1 }]
  }]), true);
  assert.throws(() => validateTemplateControl([{
    results: [{ enabled: 0, active_controls: 0, extract_allowed: 0 }]
  }]), /INTERVENCAO_NECESSARIA_CAPABILITY_EXTRACT_AUSENTE/);
  assert.equal(validateControl([{
    results: [{ enabled: 0, expires_at: expiresAt, other_active_controls: 0 }]
  }], expiresAt, 0), true);
});

test('versão produtiva precisa estar sozinha em 100%', () => {
  assert.equal(activeVersionFromDeployment({
    versions: [{ version_id: VERSION, percentage: 100 }]
  }), VERSION);
  assert.throws(() => activeVersionFromDeployment({
    versions: [
      { version_id: VERSION, percentage: 50 },
      { version_id: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', percentage: 50 }
    ]
  }), /PRODUCAO_5E_NAO_E_VERSAO_UNICA_EM_100/);
});

test('versão preview confirma alias, vars, secrets e D1 esperados', () => {
  const base = inspectProductionVersion(production());
  const config = buildPreviewConfig(base, 'C:/tmp/worker/homologation-5e.js', {
    sourceRef: SOURCE,
    pagesOrigin: PAGES,
    controlId: CONTROL
  });

  const bindings = [
    ...Object.entries(config.vars).map(([name, text]) => ({
      name, type: 'plain_text', text
    })),
    ...config.secrets.required.map((name) => ({ name, type: 'secret_text' })),
    { name: 'AUTH_DB', type: 'd1', id: DB }
  ];
  const preview = {
    id: VERSION,
    resources: {
      bindings,
      script_runtime: { compatibility_date: '2026-08-25', compatibility_flags: [] }
    },
    annotations: {
      'workers/alias': FIXED_5E.alias,
      'workers/tag': FIXED_5E.tag,
      'workers/message': FIXED_5E.message
    }
  };
  assert.equal(verifyPreviewVersion(preview, config, VERSION), true);
});

test('Wrangler 5E é fixado e usa somente comando recebido', () => {
  const calls = [];
  const fake = (command, args) => {
    calls.push({ command, args });
    return { status: 0, stdout: '{}', stderr: '', error: null };
  };
  runWrangler(['versions', 'list', '--json'], 'C:/tmp', fake);
  assert.equal(calls[0].command, 'powershell.exe');
  const serialized = JSON.stringify(calls[0].args);
  assert.match(serialized, /wrangler@4\.133\.0/);
  assert.match(serialized, /versions/);
  assert.doesNotMatch(serialized, /versions', 'deploy|wrangler deploy/);
});
