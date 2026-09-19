import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const file = new URL('./habilitar-extract-5e.mjs', import.meta.url);

test('habilitador extract 5E é estreito e exige confirmação humana', async () => {
  const source = await fs.readFile(file, 'utf8');
  assert.match(source, /HABILITAR EXTRACT 5E/);
  assert.match(source, /SET can_extract=1/);
  assert.match(source, /can_view=1 AND can_extract=0/);
  assert.match(source, /role_id='documentos'/);
  assert.match(source, /active=1/);
  assert.doesNotMatch(source, /SET\s+(?:can_view|can_edit|can_manage)\s*=/i);
  assert.doesNotMatch(source, /INSERT\s+INTO\s+auth_document_access/i);
  assert.doesNotMatch(source, /DELETE\s+FROM/i);
  assert.doesNotMatch(source, /versions['"],\s*['"]upload|wrangler\s+deploy/i);
  assert.doesNotMatch(source, /allowed_username\s*=/i);
});

test('habilitador extract 5E não imprime username nem valor de secret', async () => {
  const source = await fs.readFile(file, 'utf8');
  assert.doesNotMatch(source, /console\.log\([^\n]*username/i);
  assert.doesNotMatch(source, /GEMINI_API_KEY\s*[:=]\s*['"][^'"]+['"]/);
  assert.doesNotMatch(source, /-----BEGIN PRIVATE KEY-----/);
});
