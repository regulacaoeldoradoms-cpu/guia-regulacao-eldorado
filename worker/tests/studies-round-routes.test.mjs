import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('roteador real com identidade/catalogo sintéticos e SQLite: sete fluxos integrados', () => {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--experimental-vm-modules', '--test', '--test-reporter=tap',
    fileURLToPath(new URL('./helpers/studies-route-runner.mjs', import.meta.url))], {
    env, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024
  });
  assert.equal(result.status, 0, result.stdout + '\n' + result.stderr);
  assert.match(result.stdout, /# pass 7\b/);
  assert.match(result.stdout, /# fail 0\b/);
});
