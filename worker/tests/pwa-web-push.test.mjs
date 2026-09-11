import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pushWorker = readFileSync(new URL('../push-notifications.js', import.meta.url), 'utf8');
const serviceWorker = readFileSync(new URL('../../portal-sw.js', import.meta.url), 'utf8');
const pwaClient = readFileSync(new URL('../../js/portal-pwa.js', import.meta.url), 'utf8');
const pwaStyle = readFileSync(new URL('../../css/portal-pwa.css', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../../portal.webmanifest', import.meta.url), 'utf8'));
const portalChat = readFileSync(new URL('../../js/portal-chat.js', import.meta.url), 'utf8');
const councilWorker = readFileSync(new URL('../council.js', import.meta.url), 'utf8');
const councilPolicy = readFileSync(new URL('../council-access-policy.js', import.meta.url), 'utf8');
const workerIndex = readFileSync(new URL('../index.js', import.meta.url), 'utf8');
const installEntries = [
  '../../cidadao/index.html',
  '../../recepcao/index.html',
  '../../medico/index.html',
  '../../conselho/painel/index.html'
];

test('Web Push não transporta conteúdo sensível no POST ao provedor', () => {
  assert.match(pushWorker, /method:\s*'POST'/);
  assert.match(pushWorker, /Authorization:\s*authorization/);
  assert.match(pushWorker, /TTL:\s*'300'/);
  assert.doesNotMatch(pushWorker, /Content-Encoding/);
  assert.doesNotMatch(pushWorker, /p256dh/i);
  assert.doesNotMatch(pushWorker, /auth[_-]?secret/i);
  assert.doesNotMatch(pushWorker, /body:\s*(?:JSON\.stringify|payload|message|notification)/i);
});

test('service worker trata push vazio com aviso genérico', () => {
  assert.match(serviceWorker, /addEventListener\('push'/);
  assert.match(serviceWorker, /Você recebeu uma nova notificação no Portal\. Abra para consultar\./);
  assert.match(serviceWorker, /PORTAL_PUSH_RECEIVED/);
  assert.match(serviceWorker, /visiblePortalWindows\.forEach[\s\S]+showNotification/);
  assert.doesNotMatch(serviceWorker, /if \(visiblePortalWindows\.length\)[\s\S]{0,260}return;/);
  assert.doesNotMatch(serviceWorker, /event\.data\.(?:text|json)/);
});

test('cliente PWA oferece instalação e inscrição Push autenticada', () => {
  assert.match(pwaClient, /beforeinstallprompt/);
  assert.match(pwaClient, /pushManager\.subscribe/);
  assert.match(pwaClient, /\/api\/push\/subscriptions/);
  assert.match(pwaClient, /Adicionar à Tela de Início/);
  assert.match(pwaClient, /detachCurrentSubscription/);
  assert.match(pwaClient, /subscription\.unsubscribe\(\)/);
  assert.match(pwaClient, /keepalive:\s*true/);
  assert.match(pwaClient, /ensurePortalManifest/);
  assert.match(pwaClient, /ensureAppleTouchIcon/);
  assert.match(pwaClient, /portal-regulacao-header_192x192\.png\?v=20260911-1/);
  assert.match(pwaClient, /portal-regulacao-header_180x180\.png\?v=20260911-1/);
});

test('manifesto usa os ícones oficiais 192 e 512 e o Apple usa 180', () => {
  assert.deepEqual(
    manifest.icons.map(({ src, sizes, type, purpose }) => ({ src, sizes, type, purpose })),
    [
      {
        src: '/assets/portal-regulacao-header_192x192.png?v=20260911-1',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/portal-regulacao-header_512x512.png?v=20260911-1',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  );
  assert.match(serviceWorker, /portal-regulacao-header_180x180\.png\?v=20260911-1/);
  assert.match(serviceWorker, /portal-regulacao-header_192x192\.png\?v=20260911-1/);
  assert.match(serviceWorker, /portal-regulacao-header_512x512\.png\?v=20260911-1/);
});

test('convite de instalação fica destacado no mobile sem ampliar o desktop', () => {
  assert.match(pwaStyle, /width:min\(390px,calc\(100vw - 36px\)\)/);
  assert.match(pwaStyle, /@media \(max-width:860px\), \(hover:none\) and \(pointer:coarse\)/);
  assert.match(pwaStyle, /grid-template-columns:76px minmax\(0,1fr\)/);
  assert.match(pwaStyle, /font-size:1\.3rem/);
  assert.match(pwaStyle, /min-height:58px/);
  assert.match(pwaClient, /portal-pwa\.css\?v=20260910-2/);
});

test('rotas instaláveis usam a identidade única do Portal', () => {
  for (const filename of installEntries) {
    const html = readFileSync(new URL(filename, import.meta.url), 'utf8');
    assert.match(html, /rel="manifest" href="\/portal\.webmanifest\?v=20260910-2"/, filename);
    assert.doesNotMatch(html, /rel="manifest" href="\/(?:cidadao|recepcao)\.webmanifest|rel="manifest" href="\/site\.webmanifest|conselho\/painel\/manifest\.webmanifest/, filename);
  }
});

test('Conselho agenda entrega Push fora do caminho da resposta', () => {
  assert.match(councilWorker, /executionContext\?\.waitUntil/);
  assert.match(councilPolicy, /baseHandleCouncilRoute\(request, effectiveEnv, origin, originAllowed, executionContext\)/);
  assert.match(workerIndex, /handleCouncilRoute\(request, env, origin, originAllowed, ctx\)/);
});

test('chat desativa notificação local quando Web Push real está ativo', () => {
  assert.match(portalChat, /PortalPWA\?\.hasActivePush\?\.\(\)/);
  assert.match(portalChat, /PortalPWA\?\.syncPush/);
});
