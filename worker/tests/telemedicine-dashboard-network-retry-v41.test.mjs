import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const source = fs.readFileSync(path.join(root, 'js/telemedicina-network-retry-v41.js'), 'utf8');

function loadRetry() {
  const context = {
    window: {},
    setTimeout
  };
  vm.runInNewContext(source, context, { filename: 'telemedicina-network-retry-v41.js' });
  return context.window.TelemedicineNetworkRetry;
}

test('V41 repete o GET do dashboard duas vezes somente para falha transitória de rede', async () => {
  const retry = loadRetry();
  const calls = [];
  const auth = {
    async api(pathname, options) {
      calls.push({ pathname, method: options?.method });
      if (calls.length < 3) throw new TypeError('Failed to fetch');
      return { ok: true };
    }
  };

  const payload = await retry.readDashboard(auth, { delaysMs: [0, 0] });
  assert.equal(payload.ok, true);
  assert.equal(calls.length, 3);
  assert.deepEqual(calls.map((call) => call.pathname), [
    '/api/telemedicina/dashboard',
    '/api/telemedicina/dashboard',
    '/api/telemedicina/dashboard'
  ]);
  assert.deepEqual(calls.map((call) => call.method), ['GET', 'GET', 'GET']);
});

test('V41 não repete erro HTTP recebido do Worker', async () => {
  const retry = loadRetry();
  let calls = 0;
  const auth = {
    async api() {
      calls += 1;
      const error = new Error('Falha no portal (503).');
      error.status = 503;
      throw error;
    }
  };

  await assert.rejects(
    retry.readDashboard(auth, { delaysMs: [0, 0] }),
    /Falha no portal/
  );
  assert.equal(calls, 1);
});

test('V41 encerra após no máximo duas repetições de rede', async () => {
  const retry = loadRetry();
  let calls = 0;
  const auth = {
    async api() {
      calls += 1;
      throw new TypeError('NetworkError when attempting to fetch resource.');
    }
  };

  await assert.rejects(
    retry.readDashboard(auth, { delaysMs: [0, 0, 0, 0] }),
    /NetworkError/
  );
  assert.equal(calls, 3);
});
