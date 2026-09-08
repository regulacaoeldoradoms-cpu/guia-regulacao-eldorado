import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(new URL('../../', import.meta.url).pathname);
const read = (filename) => fs.readFileSync(path.join(root, filename), 'utf8');
const socialPages = [
  'index.html',
  'ferramentas/index.html',
  'perfil/index.html',
  'amigos/index.html',
  'notificacoes/index.html',
  'admin/social/index.html'
];

function toolsRuntime() {
  const window = {
    RegulationAuth: {
      hasCouncilAccess(user) {
        return ['membro', 'presidente'].includes(user?.councilRole);
      }
    }
  };
  vm.runInNewContext(read('js/tools-catalog.js'), { window });
  return window.PortalTools;
}

test('rotas sociais usam assets locais versionados e permanecem não indexáveis quando dedicadas', () => {
  for (const filename of socialPages) {
    const html = read(filename);
    assert.match(html, /portal-interactions\.css\?v=20260906-2/);
    assert.match(html, /portal-interactions\.js\?v=20260906-2/);
    assert.match(html, /social\.css\?v=20260906-1/);
    assert.match(html, /social-api\.js\?v=20260906-1/);
    if (filename !== 'index.html') assert.match(html, /name="robots" content="noindex,nofollow"/);
    assert.doesNotMatch(html, /https:\/\/(?:www\.)?(?:facebook|firebaseio|googleapis)\./i);
  }
});

test('Ferramentas mantém uma única matriz de autorização compartilhada', () => {
  const catalog = toolsRuntime();
  const ids = (user) => Array.from(catalog.cardsFor(user), (card) => card.id);
  assert.deepEqual(ids({ role: 'cidadao' }), ['citizen-channel']);
  assert.deepEqual(ids({ role: 'cidadao', councilRole: 'membro' }), ['council-panel']);
  assert.ok(ids({ role: 'medico', emailVerified: true }).includes('medical-guide'));
  assert.ok(!ids({ role: 'medico', emailVerified: true }).includes('reception-check'));
  assert.ok(ids({ role: 'recepcao', emailVerified: true }).includes('reception-check'));
  assert.ok(ids({ role: 'coordenacao', emailVerified: true }).includes('user-management'));
  assert.ok(ids({ role: 'telemedicina', emailVerified: true }).includes('telemedicine'));
  assert.ok(ids({ role: 'admin', emailVerified: true }).includes('social-moderation'));

  for (const filename of ['index.html', 'ferramentas/index.html']) {
    assert.match(read(filename), /tools-catalog\.js\?v=20260906-1/);
  }
});

test('Home social tem fallback independente e Ferramentas fica em primeiro nível', () => {
  const home = read('js/home.js');
  const navigation = read('js/social-navigation.js');
  const worker = read('worker/social.js');
  const flags = read('worker/wrangler.toml');
  assert.match(home, /showToolsFallback/);
  assert.match(home, /showToolsFallback\(\);[\s\S]+getConfig\(\)/);
  assert.match(home, /if \(!socialConfig\.homeEnabled\)/);
  assert.match(home, /catch \(_\)[\s\S]+showToolsFallback/);
  assert.match(navigation, /navLink\('\/ferramentas\/', 'Ferramentas'/);
  assert.match(navigation, /navLink\('\/conta\/', 'Conta'/);
  assert.match(navigation, /navLink\('\/notificacoes\/', 'Avisos'/);
  assert.match(worker, /socialHomeEnabled/);
  assert.match(read('js/social-api.js'), /AbortController/);
  assert.match(flags, /SOCIAL_BACKEND_ENABLED = "true"/);
  assert.match(flags, /^SOCIAL_HOME_ENABLED = "(?:true|false)"$/m);
});

test('chat profissional ignora amizade e oferece perfil sem liberar cidadãos', () => {
  const client = read('js/portal-chat.js');
  const backend = read('worker/portal-chat-v2.js');
  assert.match(client, /CHAT_ROLES = new Set\(\['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin'\]\)/);
  assert.match(client, /portalChatProfileLink/);
  assert.match(client, /\/perfil\/\?u=/);
  assert.doesNotMatch(client, /social_relationship|friend/i);
  assert.match(backend, /PROFESSIONAL_ROLES = new Set/);
  assert.doesNotMatch(backend, /social_relationship|friend/i);
});

test('cliente social renderiza texto do usuário sem interpolação HTML', () => {
  const files = [
    'js/social-feed.js',
    'js/social-friends.js',
    'js/social-profile.js',
    'js/social-notifications.js',
    'js/social-moderation.js'
  ];
  for (const filename of files) {
    const source = read(filename);
    assert.doesNotMatch(source, /innerHTML\s*=\s*`[^`]*\$\{/s, `${filename}: conteúdo interpolado em HTML`);
    assert.doesNotMatch(source, /insertAdjacentHTML|document\.write/);
  }
});

test('V1 é textual, responsiva e respeita preferências de acessibilidade', () => {
  const home = read('index.html');
  const feed = read('js/social-feed.js');
  const css = read('css/social.css');
  assert.doesNotMatch(home, /type="file"|accept="image/);
  assert.match(feed, /ordem é cronológica|ordem cronológica/i);
  assert.match(css, /@media \(max-width: 360px\)/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /:focus-visible/);
  for (const filename of socialPages) {
    assert.match(read(filename), /http-equiv="Content-Security-Policy"/);
  }
});

test('painel técnico expõe apenas o estado seguro dos flags sociais', () => {
  const readiness = read('worker/system-readiness.js');
  assert.match(readiness, /socialBackendEnabled/);
  assert.match(readiness, /socialHomeEnabled/);
  assert.match(readiness, /socialFlagsCoherent/);
  assert.match(readiness, /Configuração inválida: a Home social não pode ser ativada/);
});

test('Conta Prata governa a camada social e o login abre a nova raiz', () => {
  const account = read('conta/index.html');
  const levels = read('js/account-levels.js');
  const login = read('js/login.js');
  const signup = read('js/signup.js');
  assert.match(account, /id="socialPreferencesCard"/);
  assert.match(account, /id="socialProfileVisibility"/);
  assert.match(account, /id="socialDefaultAudience"/);
  assert.match(account, /id="socialHomePreference"/);
  assert.match(levels, /amizade|social/i);
  assert.match(login, /return '\/';/);
  assert.match(signup, /location\.replace\('\/'\)/);
});
