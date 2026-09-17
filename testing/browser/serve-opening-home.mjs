// Servidor local dos testes da entrada real; somente HTML e assets públicos allowlisted.
import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const types = { '.js':'text/javascript', '.css':'text/css', '.html':'text/html', '.mp4':'video/mp4', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.woff2':'font/woff2', '.wav':'audio/wav' };
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    const name = url.pathname === '/' ? '/index.html' : url.pathname === '/login/' ? '/login/index.html' : url.pathname;
    if (!['/index.html','/login/index.html'].includes(name) && !/^\/(css|js|assets)\/[a-zA-Z0-9_./%-]+$/.test(name)) throw new Error('not_allowed');
    const file = await realpath(path.resolve(root, '.' + decodeURIComponent(name)));
    if (!file.startsWith(root + path.sep)) throw new Error('outside_root');
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    response.end(body);
  } catch (_) { response.writeHead(404); response.end('Not found'); }
}).listen(4174, '127.0.0.1');
