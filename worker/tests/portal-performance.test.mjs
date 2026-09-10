import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(new URL('../../', import.meta.url).pathname);
const read = (filename) => fs.readFileSync(path.join(root, filename), 'utf8');

const ACTIVE_ROUTES = [
  'index.html',
  'ferramentas/index.html',
  'perfil/index.html',
  'amigos/index.html',
  'notificacoes/index.html',
  'login/index.html',
  'cadastro/index.html',
  'medico/index.html',
  'protocolo/index.html',
  'recepcao/index.html',
  'telemedicina/index.html',
  'cidadao/index.html',
  'conselho/index.html',
  'conselho/painel/index.html',
  'seguranca/index.html',
  'configuracoes/index.html',
  'conquistas/index.html',
  'admin/usuarios/index.html',
  'admin/monitoramento/index.html',
  'admin/configuracao/index.html',
  'admin/social/index.html'
];

function performanceRuntime(cards = []) {
  const listeners = new Map();
  const document = {
    readyState: 'loading',
    addEventListener(type, callback) { listeners.set(type, callback); },
    querySelectorAll() { return []; }
  };
  const navigator = {};
  const location = {
    origin: 'https://regulacaoeldoradoms.com.br',
    protocol: 'https:',
    hostname: 'regulacaoeldoradoms.com.br',
    pathname: '/'
  };
  const window = {
    RegulationAuth: { getCachedUser() { return null; } },
    PortalTools: { cardsFor() { return cards; } },
    addEventListener(type, callback) { listeners.set(type, callback); },
    setTimeout,
    requestIdleCallback(callback) { callback(); },
    dispatchEvent() {}
  };
  const context = {
    window,
    document,
    navigator,
    location,
    URL,
    CustomEvent: class {
      constructor(type, input) {
        this.type = type;
        this.detail = input?.detail;
      }
    },
    setTimeout,
    clearTimeout
  };
  vm.createContext(context);
  vm.runInContext(read('js/portal-performance.js'), context, { filename: 'js/portal-performance.js' });
  return { api: window.PortalPerformance, navigator };
}

test('todas as entradas ativas registram cedo a camada de desempenho', () => {
  for (const filename of ACTIVE_ROUTES) {
    const html = read(filename);
    assert.equal(
      (html.match(/portal-performance\.js\?v=20260910-2/g) || []).length,
      1,
      filename + ': bootstrap único'
    );
    assert.match(html, /portal-performance\.js\?v=20260910-2" async/);
    if (/auth-client\.js/.test(html)) {
      assert.match(html, /rel="preconnect" href="https:\/\/yellow-wave-d0a1guia-regulacao-ia\.regulacaoeldoradoms\.workers\.dev"/);
      assert.match(html, /rel="preload" href="\/js\/auth-client\.js\?v=20260910-2" as="script"/);
      assert.match(html, /auth-client\.js\?v=20260910-2/);
    }
  }
});

test('pré-carregamento deriva ferramentas da matriz existente e recusa rotas externas', () => {
  const { api, navigator } = performanceRuntime([
    { href: '/telemedicina/' },
    { href: '/admin/configuracao/' },
    { href: 'https://example.com/fora' }
  ]);
  const routes = Array.from(api.routesForUser({
    role: 'admin',
    username: 'desenvolvedor',
    emailVerified: true
  }));
  for (const route of ['/', '/ferramentas/', '/seguranca/', '/configuracoes/', '/conquistas/', '/amigos/', '/notificacoes/', '/perfil/', '/telemedicina/', '/admin/configuracao/']) {
    assert.ok(routes.includes(route), route);
  }
  assert.equal(api.__test.portalRoute('https://example.com/fora'), '');
  assert.equal(api.__test.portalRoute('/api/social/feed'), '');
  navigator.connection = { saveData: true, effectiveType: '4g' };
  assert.equal(api.__test.connectionIsConstrained(), true);
});

test('service worker armazena somente superfície pública e atualiza sem bloquear', () => {
  const source = read('portal-sw.js');
  assert.match(source, /CACHE_VERSION = '20260910-2'/);
  assert.match(source, /PORTAL_WARM_ROUTES/);
  assert.match(source, /\/seguranca\//);
  assert.match(source, /\/configuracoes\//);
  assert.match(source, /\/conquistas\//);
  assert.match(source, /navigationPreload\.enable/);
  assert.match(source, /event\.waitUntil\(update\.catch/);
  assert.match(source, /url\.pathname\.startsWith\('\/api\/'\)/);
  assert.match(source, /request\.headers\.has\('Authorization'\)/);
  assert.match(source, /control\.includes\('no-store'\)/);
  assert.match(source, /control\.includes\('private'\)/);
  assert.match(source, /request\.mode === 'navigate'/);
  assert.doesNotMatch(source, /caches\.open\([^)]*\)[\s\S]{0,160}\/api\//);
});

test('sessão válida abre a interface primeiro e é conferida em segundo plano', () => {
  const client = read('js/auth-client.js');
  const backend = read('worker/auth-management-v2.js');
  assert.match(client, /let user = getToken\(\) \? getCachedUser\(\) : null/);
  assert.match(client, /sessionValidationAge\(\) > SESSION_RECHECK_MS/);
  assert.match(client, /revalidateSession\(\{ redirectOnInvalid: true \}\)/);
  assert.match(client, /portal:background-refresh/);
  assert.match(client, /fetch\(\`\$\{endpoint\}\$\{path\}\`, \{ \.\.\.options, headers, cache: 'no-store' \}\)/);
  assert.doesNotMatch(client, /api\('\/api\/auth\/profile', \{ method: 'GET' \}\)/);
  assert.match(backend, /publicUser\(user, \{ includeAvatar: true \}\)/);
  assert.match(backend, /options\.includeAvatar/);
});

test('configuração social usa stale-while-revalidate sem persistir feed ou APIs', () => {
  const social = read('js/social-api.js');
  const home = read('js/social-home.js');
  assert.match(social, /CONFIG_CACHE_PREFIX = 'regulacao\.portal\.social\.config\.v1\.'/);
  assert.match(social, /sessionStorage\.setItem\(configCacheKey\(\)/);
  assert.match(social, /refreshConfig\(timeoutMs, true\)\.catch/);
  assert.match(social, /portal:social-config-updated/);
  assert.doesNotMatch(social, /localStorage\.setItem\(configCacheKey/);
  assert.doesNotMatch(social, /social\.feed.*sessionStorage|sessionStorage.*social\.feed/i);
  assert.match(home, /Promise\.all\(\[/);
  assert.match(home, /social\.api\('\/api\/social\/me'\)/);
  assert.match(home, /PortalSocialFeed\.load\(feed, more\)/);
});

test('login inicia o aquecimento antes de navegar e usa identidade visual leve', () => {
  const login = read('js/login.js');
  const html = read('login/index.html');
  const tools = read('js/tools-catalog.js');
  assert.match(login, /PortalPerformance\?\.warmForUser\?\.\(user, \{ immediate: true \}\)/);
  assert.match(login, /getCachedUser/);
  assert.match(html, /portal-regulacao-logo-v2\.svg\?v=20260909-1/);
  assert.match(html, /tools-catalog\.js\?v=20260910-2/);
  assert.match(tools, /loading="lazy" decoding="async" fetchpriority="low"/);
});