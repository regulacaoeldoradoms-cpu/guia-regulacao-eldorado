// Read-only loopback server for the real portal. No proxy, credentials or backend.
import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.webmanifest':'application/manifest+json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp', '.gif':'image/gif', '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf', '.mp4':'video/mp4', '.wav':'audio/wav', '.pdf':'application/pdf', '.wasm':'application/wasm' };
const pages = /^\/(?:|(?:admin\/(?:usuarios|social|monitoramento|configuracao)|agenda(?:\/sync)?|amigos|cadastro|cidadao|configuracoes|conquistas|conselho(?:\/painel)?|conta|documentos|estudos|ferramentas|home|login|medico|notificacoes|perfil|protocolo|recepcao|seguranca|telemedicina)\/?(?:index\.html)?)$/;
http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) throw new Error('read_only');
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (!pages.test(pathname) && !/^\/(?:css|js|assets|data|vendor)\/[\w./ -]+$/.test(pathname) && !['/portal.webmanifest','/protocolo.html'].includes(pathname)) throw new Error('not_allowlisted');
    let candidate = path.resolve(root, '.' + pathname);
    if ((await stat(candidate)).isDirectory()) candidate = path.join(candidate, 'index.html');
    candidate = await realpath(candidate);
    if (!candidate.startsWith(root + path.sep)) throw new Error('outside_root');
    const body = await readFile(candidate);
    response.writeHead(200, { 'Content-Type': types[path.extname(candidate)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Dark-Audit':'local-only' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(404, { 'Content-Type':'text/plain' }); response.end('Not found in local audit allowlist'); }
}).listen(4176, '127.0.0.1', () => process.stdout.write('Dark audit: http://127.0.0.1:4176 (read-only, loopback)\n'));
