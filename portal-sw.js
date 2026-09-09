'use strict';

const CACHE_VERSION = '20260909-1';
const STATIC_CACHE = \`portal-static-\${CACHE_VERSION}\`;
const PAGE_CACHE = \`portal-pages-\${CACHE_VERSION}\`;
const PORTAL_CACHE_PREFIXES = ['portal-static-', 'portal-pages-'];
const MAX_WARM_ROUTES = 18;
const MAX_ASSETS_PER_PAGE = 90;
const inFlight = new Map();

const KNOWN_PAGE_PATHS = new Set([
  '/', '/home/', '/login/', '/cadastro/', '/ferramentas/', '/perfil/',
  '/amigos/', '/notificacoes/', '/conta/', '/medico/', '/protocolo/',
  '/recepcao/', '/telemedicina/', '/cidadao/', '/conselho/',
  '/conselho/painel/', '/admin/usuarios/', '/admin/monitoramento/',
  '/admin/configuracao/', '/admin/social/'
]);

const CORE_RESOURCES = Object.freeze([
  '/login/',
  '/',
  '/ferramentas/',
  '/css/portal.css?v=20260816-5',
  '/css/home-loading.css?v=20260909-1',
  '/css/social.css?v=20260909-3',
  '/js/auth-config.js?v=20260815-1',
  '/js/portal-performance.js?v=20260909-1',
  '/js/auth-client.js?v=20260909-1',
  '/js/tools-catalog.js?v=20260909-1',
  '/assets/portal-regulacao-icon.webp',
  '/assets/portal-regulacao-logo-v2.svg?v=20260909-1'
]);

function pagePath(value) {
  try {
    const url = new URL(value, self.location.origin);
    if (url.origin !== self.location.origin) return '';
    let path = url.pathname || '/';
    if (path === '/protocolo.html') path = '/protocolo/';
    if (path.endsWith('/index.html')) path = path.slice(0, -10) || '/';
    if (!path.endsWith('/') && path !== '/') path += '/';
    return KNOWN_PAGE_PATHS.has(path) ? path : '';
  } catch (_) {
    return '';
  }
}

function pageCacheKey(value) {
  const path = pagePath(value);
  return path ? new Request(new URL(path, self.location.origin).toString(), { credentials: 'same-origin' }) : null;
}

function isPrivateRequest(request, url) {
  if (request.method !== 'GET' || url.origin !== self.location.origin) return true;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/cdn-cgi/')) return true;
  if (request.headers.has('Authorization') || request.headers.has('Range')) return true;
  return false;
}

function isStaticAsset(url) {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/cdn-cgi/')) return false;
  return /^\/(?:css|js|assets|data)\//.test(url.pathname)
    || /\.(?:css|js|mjs|png|jpe?g|webp|svg|ico|woff2?|ttf|wav|webmanifest)$/i.test(url.pathname);
}

function responseCanBeCached(response) {
  if (!response || !response.ok || response.type === 'opaque') return false;
  const control = String(response.headers.get('Cache-Control') || '').toLowerCase();
  if (control.includes('no-store') || control.includes('private')) return false;
  if (response.headers.has('Set-Cookie')) return false;
  return true;
}

async function putResponse(cacheName, key, response) {
  if (!responseCanBeCached(response)) return response;
  const cache = await caches.open(cacheName);
  await cache.put(key, response.clone());
  return response;
}

function deduped(key, operation) {
  if (!inFlight.has(key)) {
    const promise = Promise.resolve()
      .then(operation)
      .finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
  }
  return inFlight.get(key).then((response) => response.clone());
}

async function fetchPage(request, key, event = null) {
  const id = \`page:\${new URL(key.url).pathname}\`;
  return deduped(id, async () => {
    const preloaded = event?.preloadResponse ? await event.preloadResponse.catch(() => null) : null;
    const response = preloaded || await fetch(request);
    await putResponse(PAGE_CACHE, key, response);
    return response;
  });
}

async function handlePage(event) {
  const key = pageCacheKey(event.request.url);
  if (!key) return fetch(event.request);
  const cache = await caches.open(PAGE_CACHE);
  const cached = await cache.match(key);
  const update = fetchPage(event.request, key, event);

  if (cached) {
    event.waitUntil(update.catch(() => null));
    return cached;
  }

  try {
    return await update;
  } catch (error) {
    const fallback = await cache.match(pageCacheKey('/')) || await cache.match(pageCacheKey('/login/'));
    if (fallback) return fallback;
    throw error;
  }
}

async function fetchAsset(request, event) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const versioned = new URL(request.url).searchParams.has('v');
  const id = \`asset:\${request.url}\`;
  const update = deduped(id, async () => {
    const response = await fetch(request);
    await putResponse(STATIC_CACHE, request, response);
    return response;
  });

  if (cached) {
    if (!versioned) event.waitUntil(update.catch(() => null));
    return cached;
  }
  return update;
}

function referencedAssets(text, baseUrl, contentType = '') {
  const values = [];
  const add = (value) => {
    const clean = String(value || '').trim().replace(/^['"]|['"]$/g, '');
    if (!clean || clean.startsWith('data:') || clean.startsWith('blob:') || clean.startsWith('#')) return;
    try {
      const url = new URL(clean, baseUrl);
      if (isStaticAsset(url)) values.push(url.toString());
    } catch (_) {}
  };

  if (contentType.includes('text/css')) {
    for (const match of text.matchAll(/url\(\s*([^)]*?)\s*\)/gi)) add(match[1]);
  } else {
    for (const match of text.matchAll(/\b(?:src|href)=["']([^"'<>]+)["']/gi)) add(match[1]);
  }
  return Array.from(new Set(values)).slice(0, MAX_ASSETS_PER_PAGE);
}

async function mapLimited(values, limit, operation) {
  const queue = values.slice();
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const value = queue.shift();
      try { await operation(value); } catch (_) {}
    }
  });
  await Promise.all(workers);
}

async function warmAsset(value, parseNestedCss = true) {
  const url = new URL(value, self.location.origin);
  if (!isStaticAsset(url)) return;
  const request = new Request(url.toString(), { credentials: 'same-origin' });
  const cache = await caches.open(STATIC_CACHE);
  let response = await cache.match(request);
  if (!response) {
    response = await deduped(\`asset:\${request.url}\`, async () => {
      const fetched = await fetch(request);
      await putResponse(STATIC_CACHE, request, fetched);
      return fetched;
    });
  }
  const type = String(response.headers.get('Content-Type') || '').toLowerCase();
  if (!parseNestedCss || !type.includes('text/css')) return;
  const css = await response.clone().text();
  await mapLimited(referencedAssets(css, url, type), 2, (asset) => warmAsset(asset, false));
}

async function warmPage(value) {
  const key = pageCacheKey(value);
  if (!key) return;
  const cache = await caches.open(PAGE_CACHE);
  let response = await cache.match(key);
  if (!response) {
    const request = new Request(key.url, { credentials: 'same-origin' });
    response = await fetchPage(request, key);
  }
  const type = String(response.headers.get('Content-Type') || '').toLowerCase();
  if (!type.includes('text/html')) return;
  const html = await response.clone().text();
  await mapLimited(referencedAssets(html, key.url, type), 3, warmAsset);
}

async function warmRoutes(values) {
  const routes = Array.from(new Set((values || []).map(pagePath).filter(Boolean))).slice(0, MAX_WARM_ROUTES);
  for (const route of routes) await warmPage(route);
}

async function precacheCore() {
  const pageValues = CORE_RESOURCES.filter((value) => pagePath(value));
  const assetValues = CORE_RESOURCES.filter((value) => !pagePath(value));
  await Promise.allSettled([
    ...pageValues.map(async (value) => {
      const key = pageCacheKey(value);
      if (!key) return;
      const response = await fetch(new Request(key.url, { credentials: 'same-origin', cache: 'reload' }));
      await putResponse(PAGE_CACHE, key, response);
    }),
    ...assetValues.map((value) => warmAsset(value, false))
  ]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(Promise.all([precacheCore(), self.skipWaiting()]));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const valid = new Set([STATIC_CACHE, PAGE_CACHE]);
    const names = await caches.keys();
    await Promise.all(names.map((name) => {
      const owned = PORTAL_CACHE_PREFIXES.some((prefix) => name.startsWith(prefix));
      return owned && !valid.has(name) ? caches.delete(name) : Promise.resolve(false);
    }));
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable().catch(() => {});
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (isPrivateRequest(request, url)) return;

  if (request.mode === 'navigate' && pagePath(url)) {
    event.respondWith(handlePage(event));
    return;
  }

  if (isStaticAsset(url)) event.respondWith(fetchAsset(request, event));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'PORTAL_SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
    return;
  }
  if (event.data?.type !== 'PORTAL_WARM_ROUTES') return;
  event.waitUntil(warmRoutes(Array.isArray(event.data.routes) ? event.data.routes : []));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const chatUser = String(event.notification?.data?.chatUser || '');
  const fallbackUrl = event.notification?.data?.url || (chatUser ? \`/?chat=\${encodeURIComponent(chatUser)}\` : '/');

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
