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
    assert.match(html, /social\.css\?v=20260909-1/);
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

test('Home social ativa mantém fallback independente, recuperação de produção e Perfil sem Conta duplicada', () => {
  const home = read('js/home.js');
  const navigation = read('js/social-navigation.js');
  const worker = read('worker/social.js');
  const flags = read('worker/wrangler.toml');
  const index = read('index.html');
  assert.match(home, /showToolsFallback/);
  assert.match(home, /loadSocialConfigWithRecovery/);
  assert.match(home, /getConfig\(10000\)/);
  assert.match(home, /getConfig\(30000\)/);
  assert.match(home, /SOCIAL_CONFIG_TIMEOUT/);
  assert.match(home, /SOCIAL_DATABASE_UNAVAILABLE/);
  assert.match(home, /SOCIAL_TEMPORARILY_UNAVAILABLE/);
  assert.match(home, /showHomeSurface\('loading'\)/);
  assert.match(home, /announceLoading\('Conectando à Camada Social'\)/);
  assert.doesNotMatch(home, /showToolsFallback\('Conectando à Camada Social/);
  assert.match(home, /if \(!socialConfig\.homeEnabled\)/);
  assert.match(home, /Diagnóstico:/);
  assert.match(navigation, /navLink\('\/ferramentas\/', 'Ferramentas'/);
  assert.match(navigation, /navLink\('\/perfil\/', 'Perfil'/);
  assert.match(navigation, /navLink\('\/notificacoes\/', 'Avisos'/);
  assert.doesNotMatch(navigation, /navLink\('\/conta\/', 'Conta'/);
  assert.doesNotMatch(navigation, /'Meu perfil'/);
  assert.match(index, /social-navigation\.js\?v=20260908-1/);
  assert.match(index, /home-loading\.css\?v=20260909-1/);
  assert.match(index, /social-home\.js\?v=20260909-1/);
  assert.match(index, /home\.js\?v=20260909-1/);
  assert.match(index, /<body class="portal-page home-loading-active">/);
  assert.match(index, /id="homeLoading"[^>]*aria-busy="true"/);
  assert.match(index, /id="toolsFallback" hidden/);
  assert.doesNotMatch(read('js/social-home.js'), /home\.hidden = false|fallback\.hidden = true/);
  assert.match(worker, /socialHomeEnabled/);
  assert.match(read('js/social-api.js'), /AbortController/);
  assert.match(flags, /SOCIAL_BACKEND_ENABLED = "true"/);
  assert.match(flags, /^SOCIAL_HOME_ENABLED = "true"$/m);
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
  const homeMobileCss = read('css/home-mobile.css');
  assert.doesNotMatch(home, /type="file"|accept="image/);
  assert.match(feed, /ordem é cronológica|ordem cronológica/i);
  assert.match(css, /@media \(max-width: 360px\)/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /body\.mobile-home-mode \.social-layout\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /body\.mobile-home-mode \.social-global-nav\s*\{\s*display:\s*none/);
  assert.match(css, /body\.mobile-home-mode \.social-shortcuts \.portal-grid\s*\{[^}]*repeat\(3/s);
  assert.match(homeMobileCss, /body\.mobile-home-mode #toolsFallback \.hub-card\s*\{/);
  assert.doesNotMatch(homeMobileCss, /body\.mobile-home-mode \.hub-card\s*\{/);
  assert.match(home, /social-profile-rail/);
  assert.match(home, /social-feed-column/);
  assert.match(home, /social-tools-rail/);
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
