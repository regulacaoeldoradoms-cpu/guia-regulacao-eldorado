import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(new URL('../../', import.meta.url).pathname);
const read = (filename) => fs.readFileSync(path.join(root, filename), 'utf8');

const ACTIVE_ROUTES = [
  'index.html',
  'login/index.html',
  'cadastro/index.html',
  'medico/index.html',
  'protocolo/index.html',
  'recepcao/index.html',
  'telemedicina/index.html',
  'cidadao/index.html',
  'conselho/index.html',
  'conselho/painel/index.html',
  'conta/index.html',
  'admin/usuarios/index.html',
  'admin/monitoramento/index.html',
  'admin/configuracao/index.html'
];

const RUNTIME_TEXT_FILES = [
  ...ACTIVE_ROUTES,
  ...fs.readdirSync(path.join(root, 'js')).filter((name) => name.endsWith('.js')).map((name) => `js/${name}`),
  ...fs.readdirSync(path.join(root, 'css')).filter((name) => name.endsWith('.css')).map((name) => `css/${name}`)
];

function interactionRuntime() {
  class FakeElement {}
  const localValues = new Map();
  const document = {
    readyState: 'loading',
    body: {},
    visibilityState: 'visible',
    documentElement: { dataset: {} },
    activeElement: null,
    addEventListener() {},
    dispatchEvent() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };
  const window = {
    matchMedia: () => ({ matches: false }),
    requestIdleCallback() {},
    setTimeout,
    clearTimeout,
    performance,
    localStorage: {
      getItem(key) { return localValues.get(key) || null; },
      setItem(key, value) { localValues.set(key, String(value)); }
    }
  };
  const context = {
    window,
    document,
    localStorage: window.localStorage,
    location: { pathname: '/' },
    Element: FakeElement,
    MutationObserver: class { observe() {} disconnect() {} },
    CustomEvent: class { constructor(type, input) { this.type = type; this.detail = input?.detail; } },
    AbortController,
    performance,
    fetch: async () => { throw new Error('áudio indisponível'); },
    setTimeout,
    clearTimeout
  };
  vm.createContext(context);
  vm.runInContext(read('js/portal-interactions.js'), context, { filename: 'js/portal-interactions.js' });
  return context.window.PortalInteractions;
}

test('todas as rotas ativas carregam uma única camada central versionada', () => {
  for (const filename of ACTIVE_ROUTES) {
    const html = read(filename);
    assert.equal((html.match(/portal-interactions\.css\?v=20260906-1/g) || []).length, 1, `${filename}: CSS central`);
    assert.equal((html.match(/portal-interactions\.js\?v=20260906-1/g) || []).length, 1, `${filename}: JS central`);
  }
});

test('API normaliza preferências e mantém sons desligados por padrão', async () => {
  const api = interactionRuntime();
  assert.equal(api.version, '1.0.0');
  assert.deepEqual({ ...api.__test.defaultPreferences }, { soundsEnabled: false, volume: 0.32, muted: false });
  assert.deepEqual(
    { ...api.__test.normalizePreferences({ interfaceSoundsEnabled: 1, interfaceSoundVolume: 78, interfaceSoundsMuted: 0 }) },
    { soundsEnabled: true, volume: 0.78, muted: false }
  );
  assert.equal(api.sounds.play('success'), false, 'som desligado não reproduz');
  await api.setPreferences({ soundsEnabled: true, volume: 0, muted: false });
  assert.equal(api.sounds.play('success'), false, 'volume mínimo não reproduz');
  await api.setPreferences({ soundsEnabled: true, volume: 1, muted: false });
  assert.equal(api.sounds.unlock(), false, 'bloqueio/ausência de AudioContext é tolerado');
  assert.doesNotThrow(() => api.emit('success'), 'feedback visual não depende de áudio');
  await api.setPreferences({ soundsEnabled: true, volume: 1, muted: true });
  assert.equal(api.sounds.play('error'), false, 'silêncio rápido impede reprodução');
});

test('registro semântico cobre rotas e não sonoriza todo botão ou hover', () => {
  const source = read('js/portal-interactions.js');
  const api = interactionRuntime();
  assert.equal(api.__test.routeRules.length, ACTIVE_ROUTES.length);
  assert.doesNotMatch(source, /querySelectorAll\(\s*['"](?:button|a|button\s*,)/);
  assert.doesNotMatch(source, /addEventListener\(\s*['"](?:mouseover|mouseenter|pointermove)/);
  for (const type of ['primary', 'open', 'close', 'filter', 'loading', 'save', 'success', 'warning', 'error', 'destructive', 'notification', 'state-change', 'task-complete']) {
    assert.ok(api.__test.feedbackTypes[type], `categoria ${type}`);
  }
});

test('estados textuais produzem feedback coerente e acessível', () => {
  const { __test } = interactionRuntime();
  assert.equal(__test.classifyStatus({ textContent: 'Alteração salva com sucesso.', className: 'account-status success' }), 'success');
  assert.equal(__test.classifyStatus({ textContent: 'Salvando alteração…', className: 'account-status' }), 'loading');
  assert.equal(__test.classifyStatus({ textContent: 'Não foi possível salvar.', className: 'account-status error' }), 'error');
  assert.equal(__test.classifyStatus({ textContent: 'Atenção: revisão pendente.', className: 'warning' }), 'warning');
  assert.equal(
    __test.semanticClassName({ className: 'account-status visible success portal-feedback-success portal-feedback-context-success' }),
    'account-status success visible',
    'classes transitórias do próprio gerenciador não criam um novo estado'
  );
});

test('Telemedicina confirma a cópia somente depois do resultado real', () => {
  const source = read('js/telemedicina-justification-v20.js');
  assert.match(source, /await write\(build\(item\)\)[\s\S]+notify\?\.\('copy'/);
  assert.match(source, /catch \(_\)[\s\S]+notify\?\.\('error'/);
  assert.doesNotMatch(source, /patientName[\s\S]{0,120}notify\?\./);
});

test('identidade sonora é original, curta, mono e leve', () => {
  const expected = ['click', 'open', 'close', 'transition', 'success', 'warning', 'error', 'notification', 'destructive', 'complete'];
  const files = fs.readdirSync(path.join(root, 'assets/sounds')).filter((name) => name.endsWith('.wav')).sort();
  assert.deepEqual(files, expected.map((name) => `ui-${name}.wav`).sort());
  for (const filename of files) {
    const wav = fs.readFileSync(path.join(root, 'assets/sounds', filename));
    assert.equal(wav.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(wav.subarray(8, 12).toString('ascii'), 'WAVE');
    assert.equal(wav.readUInt16LE(22), 1, `${filename}: áudio mono`);
    assert.equal(wav.readUInt32LE(24), 22050, `${filename}: taxa de amostragem`);
    const duration = wav.readUInt32LE(40) / (wav.readUInt32LE(24) * wav.readUInt16LE(22) * (wav.readUInt16LE(34) / 8));
    assert.ok(duration <= 0.26, `${filename}: duração ${duration.toFixed(3)}s`);
    assert.ok(wav.length < 12000, `${filename}: ${wav.length} bytes`);
  }
});

test('CSS central preserva foco, movimento reduzido, contraste forçado e transição progressiva', () => {
  const css = read('css/portal-interactions.css');
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /@view-transition/);
  assert.match(css, /pointer-events:\s*none/);
});

test('modais estáticos e dinâmicos usam a mesma entrada, saída e gestão de foco', () => {
  const manager = read('js/portal-interactions.js');
  const css = read('css/portal-interactions.css');
  const councilExport = read('js/council-export.js');
  const councilPage = read('conselho/painel/index.html');
  assert.match(manager, /\.portal-auxiliary-dialog/);
  assert.match(manager, /layerFocus/);
  assert.match(css, /\.portal-auxiliary-dialog\.open/);
  assert.match(councilExport, /className = 'portal-auxiliary-dialog'/);
  assert.match(councilExport, /aria-modal="true"/);
  assert.match(councilExport, /event\.key !== 'Escape'/);
  assert.match(councilPage, /council-export\.js\?v=20260906-1/);
});

test('preferências persistem no backend sem mudar permissões', () => {
  const backend = read('worker/auth-management-v2.js');
  const client = read('js/auth-client.js');
  assert.match(backend, /interface_sounds_enabled[^\n]+DEFAULT 0/);
  assert.match(backend, /interface_sound_volume[^\n]+DEFAULT 32/);
  assert.match(backend, /interface_sounds_muted[^\n]+DEFAULT 0/);
  assert.match(backend, /volume < 0 \|\| volume > 100/);
  assert.match(client, /interfaceSoundsEnabled/);
  assert.match(client, /interfaceSoundVolume/);
  assert.match(client, /interfaceSoundsMuted/);
});

test('interfaces ativas não usam emojis como pictogramas', () => {
  const emoji = /[\u2600-\u27BF\u{1F000}-\u{1FAFF}]/u;
  for (const filename of RUNTIME_TEXT_FILES) {
    assert.doesNotMatch(read(filename), emoji, `${filename}: use SVG vetorial`);
  }
});
