import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../dist-staging');
const port = 4173;
const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.json', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.bcmap', 'application/octet-stream'],
  ['.icc', 'application/octet-stream'],
  ['.pfb', 'application/octet-stream'],
  ['.ttf', 'font/ttf']
]);

http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const candidate = path.resolve(root, relative);
    if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) throw new Error('invalid_path');
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error('not_file');
    const body = await readFile(candidate);
    response.writeHead(200, {
      'Content-Type': types.get(path.extname(candidate).toLowerCase()) || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(body);
  } catch (_) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`Central Docs staging em http://127.0.0.1:${port}\n`);
});
