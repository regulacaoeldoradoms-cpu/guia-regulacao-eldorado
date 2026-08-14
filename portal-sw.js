'use strict';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const chatUser = String(event.notification?.data?.chatUser || '');
  const fallbackUrl = event.notification?.data?.url || (chatUser ? `/?chat=${encodeURIComponent(chatUser)}` : '/');

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const portalWindow = windows.find((client) => {
      try { return new URL(client.url).origin === self.location.origin; }
      catch (_) { return false; }
    });

    if (portalWindow) {
      await portalWindow.focus();
      if (chatUser) portalWindow.postMessage({ type: 'OPEN_PORTAL_CHAT', chatUser });
      return;
    }

    if (self.clients.openWindow) await self.clients.openWindow(fallbackUrl);
  })());
});
