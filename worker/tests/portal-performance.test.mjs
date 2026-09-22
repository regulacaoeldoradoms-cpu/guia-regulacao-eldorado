import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
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
      (html.match(/portal-performance\.js\?v=20260922-3/g) || []).length,
      1,
      filename + ': bootstrap único'
    );
    assert.match(html, /portal-performance\.js\?v=20260922-3" async/);
    if (/auth-client\.js/.test(html)) {
      assert.match(html, /rel="preconnect" href="https:\/\/yellow-wave-d0a1guia-regulacao-ia\.regulacaoeldoradoms\.workers\.dev"/);
      assert.match(html, /rel="preload" href="\/js\/auth-client\.js\?v=20260910-4" as="script"/);
      assert.match(html, /auth-client\.js\?v=20260910-4/);
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
  assert.equal(api.__test.documentsAccessAllowed({
    documentCapabilities: { view: true },
    mustChangePassword: false,
    emailVerificationRequired: false
  }), true);
  assert.equal(api.__test.documentsAccessAllowed({
    documentCapabilities: { view: true },
    mustChangePassword: true
  }), false);
  assert.equal(api.__test.documentsAccessAllowed({
    documentCapabilities: { manage: true },
    emailVerificationRequired: true
  }), false);
  assert.equal(api.__test.documentsAccessAllowed({
    documentCapabilities: { view: false, manage: false }
  }), false);
});

test('pastas Consulta e Exames 2026 são prioridades exatas e seus PDFs usam cache criptografado', () => {
  const performanceClient = read('js/portal-performance.js');
  const worker = read('portal-sw.js');
  const cache = read('js/document-cache.js');

  assert.match(worker, /DOCUMENTS_PRIORITY_FOLDER_NAMES = Object\.freeze\(\[[\s\S]*'consulta \[2026\]'[\s\S]*'exames \[2026\]'/);
  assert.match(worker, /function exactPriorityFolder\(/);
  assert.match(worker, /normalizedPriorityFolderName/);
  assert.match(worker, /item\?\.isFolder === true/);
  assert.match(worker, /normalizedPriorityFolderName\(item\?\.name\) === expected/);
  assert.match(worker, /DOCUMENTS_WARM_PAGE_SIZE = 20/);
  assert.match(worker, /DOCUMENTS_PRIORITY_VISIBLE_PAGE_SIZE = 20/);
  assert.match(worker, /DOCUMENTS_PRIORITY_PREFETCH_PAGE_SIZE = 100/);
  assert.match(worker, /DOCUMENTS_PRIORITY_MAX_PAGES = 6/);
  assert.match(worker, /items: firstPage\.items/);
  assert.match(worker, /prefetchItems/);
  assert.match(performanceClient, /folder\?\.prefetchItems/);
  assert.match(worker, /priorityFolders:\s*\[\]/);
  assert.match(worker, /warmPriorityFolders\(/);

  assert.match(performanceClient, /ensureDocumentCacheClient/);
  assert.match(performanceClient, /prefetchPriorityDocumentFiles/);
  assert.match(performanceClient, /uniquePriorityPdfItems/);
  assert.match(performanceClient, /DOCUMENTS_PRIORITY_PREFETCH_CONCURRENCY = 2/);
  assert.match(performanceClient, /PortalDocumentCache/);
  assert.match(performanceClient, /cache\.has\(descriptor\)/);
  assert.match(performanceClient, /cache\.put\(\{ \.\.\.descriptor, blob \}\)/);
  assert.match(performanceClient, /portal:documents-warm-updated/);

  assert.match(cache, /AES-GCM/);
  assert.match(cache, /MAX_TOTAL_BYTES = 256 \* 1024 \* 1024/);
  assert.match(cache, /MAX_FILE_BYTES = 50 \* 1024 \* 1024/);
  assert.doesNotMatch(performanceClient, /posthog|patient_name|cpf|cns/i);
});

test('service worker aquece Central sem persistir payload privado e atualiza sem bloquear', () => {
  const source = read('portal-sw.js');
  assert.match(source, /CACHE_VERSION = '20260922-3'/);
  assert.match(source, /PORTAL_WARM_ROUTES/);
  assert.match(source, /PORTAL_WARM_DOCUMENTS/);
  assert.match(source, /PORTAL_DOCUMENTS_WARM_GET/);
  assert.match(source, /PORTAL_DOCUMENTS_WARM_CLEAR/);
  assert.match(source, /const documentWarmSnapshots = new Map\(\)/);
  assert.match(source, /let documentWarmGeneration = 0/);
  assert.match(source, /documentWarmGeneration \+= 1/);
  assert.match(source, /generation !== documentWarmGeneration/);
  assert.match(source, /crypto\.subtle\.digest/);
  assert.match(source, /cache:\s*'no-store'/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.ok(source.includes("'/documentos/'"));
  assert.ok(read('js/portal-performance.js').includes("'/documentos/'"));
  assert.match(source, /portal-observability\.js\?v=20260921-2/);
  assert.match(source, /document-cache\.js\?v=20260912-1/);
  assert.match(source, /document-editor\.js\?v=20260916-2/);
  assert.ok(source.includes("'/vendor/pdf-lib/pdf-lib.min.js'"));
  assert.match(read('js/portal-performance.js'), /portal-observability\.js\?v=20260921-2/);
  assert.match(source, /\/seguranca\//);
  assert.match(source, /\/configuracoes\//);
  assert.match(source, /\/conquistas\//);
  assert.match(source, /navigationPreload\.enable/);
  assert.match(source, /event\.waitUntil\(update\.catch/);
  assert.match(source, /url\.pathname\.startsWith\('\/api\/'\)/);
  assert.match(source, /request\.headers\.has\('Authorization'\)/);
  assert.match(source, /DOCUMENT_STREAM_PREFIX = '\/__portal_document_pdf\/'/);
  assert.match(source, /'Cache-Control': 'no-store'/);
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

test('cabeçalhos genéricos do Portal usam a logo oficial 512 sem o ícone legado', () => {
  const pages = [
    'index.html',
    'ferramentas/index.html',
    'notificacoes/index.html',
    'amigos/index.html',
    'seguranca/index.html',
    'perfil/index.html',
    'configuracoes/index.html',
    'conquistas/index.html',
    'admin/social/index.html',
    'admin/usuarios/index.html'
  ];
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /portal-regulacao-header_512x512\.png\?v=20260911-1/, page);
    assert.doesNotMatch(html, /portal-regulacao-icon\.webp/, page);
  }
  const home = read('index.html');
  assert.match(home, /fetchpriority="high"/);
  const accountBrand = read('js/account-brand.js');
  assert.match(accountBrand, /coordenacao:[\s\S]*portal-regulacao-header_512x512\.png/);
  assert.match(accountBrand, /admin:[\s\S]*portal-regulacao-header_512x512\.png/);
});

test('login inicia o aquecimento antes de navegar e usa a marca oficial em cache', () => {
  const login = read('js/login.js');
  const html = read('login/index.html');
  const tools = read('js/tools-catalog.js');
  assert.match(login, /PortalPerformance\?\.warmForUser\?\.\(user, \{ immediate: true \}\)/);
  assert.match(login, /getCachedUser/);
  assert.match(html, /portal-regulacao-header\.png\?v=20260910-1/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(read('portal-sw.js'), /portal-regulacao-header\.png\?v=20260910-1/);
  assert.match(html, /tools-catalog\.js\?v=20260916-1/);
  assert.match(tools, /loading="lazy" decoding="async" fetchpriority="low"/);
});