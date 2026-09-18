import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

import {
  FIXED, PUBLIC_NAMES, SECRET_NAMES, inspectOldPreview
} from './preparar-nova-janela-4d-v4.mjs';
import {
  preparedBase, sessionSql, firstRow
} from './habilitar-escrita-nova-janela-4d-v4.mjs';

const db = '11111111-2222-3333-4444-555555555555';
const controlId = 'phase4d_0123456789abcdef0123456789abcdef';
const preparedId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

function oldPreview() {
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
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI: 'https://example.test/callback'
  };
  return {
    id: FIXED.oldPreview,
    resources: {
      bindings: [
        ...PUBLIC_NAMES.map(name => ({ name, type: 'plain_text', text: vars[name] })),
        ...SECRET_NAMES.map(name => ({ name, type: 'secret_text' })),
        { name: 'AUTH_DB', type: 'd1', id: db }
      ],
      script_runtime: { compatibility_date: '2026-08-25', compatibility_flags: [] }
    }
  };
}

function preparedPreview() {
  const base = inspectOldPreview(oldPreview());
  const vars = {
    ...base.vars,
    DOCUMENTS_DRIVE_WRITE_ENABLED: 'false',
    DOCUMENTS_HOMOLOGATION_CONTROL_ID: controlId,
    DOCUMENTS_HOMOLOGATION_RELEASE: FIXED.candidateRelease
  };
  return {
    id: preparedId,
    resources: {
      bindings: [
        ...PUBLIC_NAMES.map(name => ({ name, type: 'plain_text', text: vars[name] })),
        ...SECRET_NAMES.map(name => ({ name, type: 'secret_text' })),
        { name: 'AUTH_DB', type: 'd1', id: db }
      ],
      script_runtime: { compatibility_date: '2026-08-25', compatibility_flags: [] }
    }
  };
}

const ledger = {
  previewVersionId: preparedId,
  controlId,
  candidateRelease: FIXED.candidateRelease
};

test('preview preparado precisa continuar com gate false, mesmo controle e release', () => {
  const base = preparedBase(preparedPreview(), ledger);
  assert.equal(base.db, db);
  assert.equal(base.vars.DOCUMENTS_DRIVE_WRITE_ENABLED, 'false');
  assert.equal(base.vars.DOCUMENTS_HOMOLOGATION_CONTROL_ID, controlId);
  assert.equal(base.vars.DOCUMENTS_HOMOLOGATION_RELEASE, FIXED.candidateRelease);

  const bad = preparedPreview();
  bad.resources.bindings.find(x => x.name === 'DOCUMENTS_DRIVE_WRITE_ENABLED').text = 'true';
  assert.throws(() => preparedBase(bad, ledger), /PREVIEW_JA_TEM_ESCRITA/);
});

test('controle, release e origem divergentes são recusados', () => {
  for (const [name, value, code] of [
    ['DOCUMENTS_HOMOLOGATION_CONTROL_ID', FIXED.oldControl, 'CONTROLE_PREVIEW_DIVERGENTE'],
    ['DOCUMENTS_HOMOLOGATION_RELEASE', '0'.repeat(40), 'RELEASE_PREVIEW_DIVERGENTE'],
    ['ALLOWED_ORIGINS', 'https://example.pages.dev', 'ORIGENS_PREVIEW_DIVERGENTES']
  ]) {
    const v = preparedPreview();
    v.resources.bindings.find(x => x.name === name).text = value;
    assert.throws(() => preparedBase(v, ledger), new RegExp(code));
  }
});

test('consulta de sessões é restrita ao controle atual', () => {
  const sql = sessionSql(controlId);
  assert.match(sql, /count\(\*\) AS sessions/);
  assert.match(sql, new RegExp(controlId));
  assert.doesNotMatch(sql, /username|file_id|allowed_file_ids_json/);
});

test('firstRow aceita formato D1 em bloco ou direto e não inventa resultado', () => {
  assert.deepEqual(firstRow([{ results: [{ sessions: 0 }] }]), { sessions: 0 });
  assert.deepEqual(firstRow({ results: [{ sessions: 1 }] }), { sessions: 1 });
  assert.equal(firstRow([]), null);
});

test('fonte exige confirmação explícita e fail-closed antes do upload', async () => {
  const source = await fs.readFile(new URL('./habilitar-escrita-nova-janela-4d-v4.mjs', import.meta.url), 'utf8');
  assert.match(source, /CONFIRMO LEITURA E LIBERAR ESCRITA 4D/);
  assert.match(source, /JANELA_COM_POUCO_TEMPO_RESTANTE/);
  assert.match(source, /SESSAO_DE_UPLOAD_JA_EXISTE/);
  assert.match(source, /DOCUMENTS_DRIVE_WRITE_ENABLED = 'true'/);
  assert.match(source, /habilitar-v4-upload-tentado\.json/);
  assert.match(source, /productionSnapshot\(queryMinimal\(\['deployments', 'status'\]\)\)/);
  assert.match(source, /inspectMultipart\(fs\.readFileSync\(dry\), config, \{[\s\S]*'workers\/alias': FIXED\.alias,[\s\S]*'workers\/tag': TAG,[\s\S]*'workers\/message': MESSAGE/);
  assert.doesNotMatch(source, /deploy\b/);
});
