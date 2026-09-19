import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('./diagnosticar-conectividade-browser-5e.mjs', import.meta.url), 'utf8');

test('diagnóstico de conectividade 5E não usa credenciais reais nem mutações', () => {
  assert.match(source, /Access-Control-Request-Method/);
  assert.match(source, /AI_HOMOLOGATION_USER_DENIED/);
  assert.match(source, /__phase5e_probe__/);
  assert.doesNotMatch(source, /GEMINI_API_KEY\s*[:=]\s*['"][^'"]+['"]/);
  assert.doesNotMatch(source, /INSERT\s+INTO|UPDATE\s+|DELETE\s+FROM/i);
  assert.doesNotMatch(source, /versions['"],\s*['"]upload|wrangler\s+deploy/i);
  assert.doesNotMatch(source, /allowed_username/);
});

test('diagnóstico cobre GET protegido, OPTIONS e POST sintético', () => {
  assert.match(source, /GET protegido/);
  assert.match(source, /Preflight CORS do login/);
  assert.match(source, /POST sintético/);
  assert.match(source, /getProtected=/);
  assert.match(source, /preflightLogin=/);
  assert.match(source, /postSynthetic=/);
  assert.match(source, /corsReady=/);
  assert.match(source, /releaseMatch=/);
});
