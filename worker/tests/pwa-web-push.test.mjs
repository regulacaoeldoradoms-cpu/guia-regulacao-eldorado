import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pushWorker = readFileSync(new URL('../push-notifications.js', import.meta.url), 'utf8');
const serviceWorker = readFileSync(new URL('../../portal-sw.js', import.meta.url), 'utf8');
const pwaClient = readFileSync(new URL('../../js/portal-pwa.js', import.meta.url), 'utf8');
const portalChat = readFileSync(new URL('../../js/portal-chat.js', import.meta.url), 'utf8');

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
  assert.doesNotMatch(serviceWorker, /event\.data\.(?:text|json)/);
});

test('cliente PWA oferece instalação e inscrição Push autenticada', () => {
  assert.match(pwaClient, /beforeinstallprompt/);
  assert.match(pwaClient, /pushManager\.subscribe/);
  assert.match(pwaClient, /\/api\/push\/subscriptions/);
  assert.match(pwaClient, /Adicionar à Tela de Início/);
  assert.match(pwaClient, /detachCurrentSubscription/);
});

test('chat desativa notificação local quando Web Push real está ativo', () => {
  assert.match(portalChat, /PortalPWA\?\.hasActivePush\?\.\(\)/);
  assert.match(portalChat, /PortalPWA\?\.syncPush/);
});
