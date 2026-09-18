import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('encerramento 5E revoga D1 antes de qualquer upload e fecha gates', async () => {
  const source = await fs.readFile(
    new URL('./encerrar-homologacao-5e.mjs', import.meta.url),
    'utf8'
  );

  const revoke = source.indexOf("queryD1(disableControlSql(ledger.controlId))");
  const upload = source.indexOf("'versions', 'upload'");
  assert.ok(revoke >= 0, 'revogação D1 ausente');
  assert.ok(upload > revoke, 'upload apareceu antes da revogação');

  assert.match(source, /DOCUMENTS_AI_ENABLED = 'false'/);
  assert.match(source, /DOCUMENTS_AI_PROCESSING_ENABLED = 'false'/);
  assert.match(source, /DOCUMENTS_DRIVE_WRITE_ENABLED = 'false'/);
  assert.match(source, /JANELA_5E_ENCERRADA/);
  assert.match(source, /CONTROLE_5E_REVOGADO=true/);
  assert.match(source, /HTTP_5E_NAO_BLOQUEADO_APOS_ENCERRAMENTO/);
  assert.doesNotMatch(source, /versions['"],\s*['"]deploy/);
});

test('encerramento 5E não contém segredo ou credencial versionada', async () => {
  const source = await fs.readFile(
    new URL('./encerrar-homologacao-5e.mjs', import.meta.url),
    'utf8'
  );
  assert.doesNotMatch(source, /AIza[0-9A-Za-z_-]{20,}/);
  assert.doesNotMatch(source, /-----BEGIN PRIVATE KEY-----/);
  assert.doesNotMatch(source, /password\s*[:=]\s*['"][^'"]+/i);
});
