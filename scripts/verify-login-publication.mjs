// Smoke público e somente leitura: não autentica, não acessa APIs nem dados reais.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const origin = 'https://regulacaoeldoradoms.com.br';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const files = ['js/login.js', 'js/login-opening.js', 'portal-sw.js', 'assets/portal-opening-v1.mp4'];
const expected = new Map(await Promise.all(files.map(async (file) => [file, hash(await readFile(file))])));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let lastError;
for (let attempt = 1; attempt <= 20; attempt++) {
  try {
    const login = await fetch(`${origin}/login/?publication=20260917-2`, {
      cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(15000)
    });
    assert.equal(login.status, 200, 'login_public_status');
    const html = await login.text();
    const button = html.match(/<button\b[^>]*id="loginSubmit"[^>]*>[^<]*<\/button>/)?.[0];
    assert.ok(button, 'login_button_missing');
    assert.doesNotMatch(button, /disabled|opening-gate/, 'login_button_still_blocked');
    assert.match(html, /login-opening\.js\?v=20260917-2/, 'opening_controller_version');
    assert.match(html, /login\.js\?v=20260917-2/, 'login_controller_version');
    for (const file of files) {
      const response = await fetch(`${origin}/${file}?v=20260917-2`, {
        cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(15000)
      });
      assert.equal(response.status, 200, `public_status:${file}`);
      assert.equal(hash(Buffer.from(await response.arrayBuffer())), expected.get(file), `public_hash:${file}`);
    }
    console.log('PUBLICATION_OK: login habilitado; login.js, abertura, Service Worker e MP4 públicos iguais ao commit.');
    process.exit(0);
  } catch (error) {
    lastError = String(error?.message || 'publication_pending').split('\n')[0];
    console.log(`Tentativa ${attempt}/20: publicação ainda não confirmada (${lastError}).`);
    if (attempt < 20) await delay(6000);
  }
}
throw new Error(`publicacao_nao_confirmada:${lastError}`);
