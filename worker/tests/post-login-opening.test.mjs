import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const loginIndex = read('login/index.html');
const login = read('js/login.js');
const opening = read('js/login-opening.js');

function loginHarness({ loginResult = { role: 'admin' }, mediaPromise = Promise.resolve(), rejectLogin = false } = {}) {
  const elements = new Map();
  let handler;
  const state = { calls: 0, destination: null, mediaCalls: 0 };
  for (const id of ['loginForm', 'loginUsername', 'loginPassword', 'loginRemember', 'loginSubmit', 'loginStatus']) {
    elements.set(id, { value: 'ficticio', checked: false, disabled: false, textContent: '', className: '',
      setAttribute() {}, removeAttribute() {}, addEventListener(type, fn) { if (type === 'submit') handler = fn; } });
  }
  const window = {
    REGULATION_AUTH_CONFIG: { homePath: '/' },
    RegulationAuth: { enforcementEnabled: true, getToken: () => '', me: async () => null,
      async login() { state.calls++; if (rejectLogin) throw new Error('Senha inválida.'); return loginResult; } },
    PortalPerformance: { warmForUser() {} },
    PortalLoginOpening: { primeFromGesture() {}, async beforeNavigate() { state.mediaCalls++; await mediaPromise; } }
  };
  vm.runInNewContext(login, { window, document: {
    body: { classList: { contains: () => false } }, getElementById: (id) => elements.get(id)
  }, location: { hostname: 'localhost', protocol: 'http:', search: '', replace: (url) => { state.destination = url; } }, URL, URLSearchParams });
  return { state, submit: () => handler({ preventDefault() {} }), button: elements.get('loginSubmit'), status: elements.get('loginStatus') };
}

test('o MP4 oficial permanece byte a byte inalterado', () => {
  const data = fs.readFileSync(path.join(root, 'assets/portal-opening-v1.mp4'));
  assert.equal(data.byteLength, 2393970);
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'), '98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766');
});

test('HTML real e laboratório começam com Entrar habilitado', () => {
  for (const html of [loginIndex, read('testing/post-login-opening/harness.html')]) {
    const button = html.match(/<button\b[^>]*id="loginSubmit"[^>]*>[^<]*<\/button>/)?.[0];
    assert.ok(button);
    assert.match(button, />Entrar<\/button>/);
    assert.doesNotMatch(button, /disabled|opening-gate|opacity/);
    assert.doesNotMatch(html, /Preparando abertura/);
    assert.match(html, /login-opening\.js\?v=20260917-2/);
    assert.match(html, /login\.js\?v=20260917-2/);
  }
});

test('o controlador não pode desabilitar Entrar nem substituir a autenticação', () => {
  assert.doesNotMatch(opening, /loginSubmit|\.disabled\s*=|aria-disabled|openingGate|auth\.login\s*=|RegulationAuth/);
  assert.doesNotMatch(opening, /Preparando abertura|Iniciar abertura com som|portalOpeningStartWithSound/);
  assert.match(opening, /PortalLoginOpening = Object\.freeze/);
});

test('o primeiro clique autentica antes de a mídia ficar pronta e retém só a transição', async () => {
  let ready;
  const h = loginHarness({ mediaPromise: new Promise((resolve) => { ready = resolve; }) });
  assert.equal(h.button.disabled, false);
  const attempt = h.submit();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(h.state.calls, 1);
  assert.equal(h.state.mediaCalls, 1);
  assert.equal(h.state.destination, null);
  await h.submit();
  assert.equal(h.state.calls, 1, 'submits repetidos não duplicam autenticação');
  ready();
  await attempt;
  assert.equal(h.state.destination, '/');
});

test('senha incorreta é informada sem aguardar vídeo e permite nova tentativa', async () => {
  const h = loginHarness({ rejectLogin: true, mediaPromise: new Promise(() => {}) });
  await h.submit();
  assert.equal(h.state.calls, 1);
  assert.equal(h.state.mediaCalls, 0);
  assert.equal(h.state.destination, null);
  assert.equal(h.button.disabled, false);
  assert.equal(h.status.textContent, 'Senha inválida.');
});

test('falha da abertura não vira falha de credenciais nem muda o destino seguro', async () => {
  const mediaPromise = Promise.reject(new Error('mídia indisponível'));
  mediaPromise.catch(() => {});
  const h = loginHarness({ mediaPromise, loginResult: { mustChangePassword: true } });
  await h.submit();
  assert.equal(h.state.calls, 1);
  assert.equal(h.state.destination, '/seguranca/?primeiro-acesso=1');
  assert.equal(h.status.textContent, '');
});

test('espera finita cobre resposta completa, mídia e play pendente; normal termina em ended', () => {
  assert.match(opening, /OPENING_PREPARE_TIMEOUT_MS = 20000/);
  assert.match(opening, /OPENING_PLAYBACK_TIMEOUT_MS = 20000/);
  assert.match(opening, /await response\.blob\(\)/);
  assert.match(opening, /blob\.size !== OPENING_EXPECTED_BYTES/);
  assert.match(opening, /await waitForMediaReady|await ready/);
  assert.match(opening, /Promise\.race\(\[work\.catch/);
  assert.match(opening, /addEventListener\('ended', onEnded\)/);
  assert.match(opening, /Promise\.resolve\(element\.play\(\)\)\.catch\(onError\)/);
  assert.doesNotMatch(opening, /OPENING_RETRY_MS|setSubmitPreparing/);
});

test('Home preserva loader legado sem duplicar abertura', () => {
  assert.match(read('index.html'), /id="homeLoading"/);
  assert.match(read('css/home-loading.css'), /\.home-loading-spinner/);
  assert.doesNotMatch(read('js/home.js'), /portalOpeningStartWithSound|startPostLoginOpening/);
});

test('cache de páginas e scripts é invalidado sem apagar cache do MP4', () => {
  const sw = read('portal-sw.js');
  assert.match(sw, /loginCache\.delete\('\/js\/login-opening\.js\?v=20260917-1'\)/);
  assert.match(sw, /'\/js\/login-opening\.js\?v=20260917-2'/);
  assert.match(sw, /'\/js\/login\.js\?v=20260917-2'/);
  assert.match(sw, /PORTAL_CACHE_PREFIXES = \['portal-static-', 'portal-pages-'\]/);
  assert.match(opening, /portal-opening-media-v1/);
});
