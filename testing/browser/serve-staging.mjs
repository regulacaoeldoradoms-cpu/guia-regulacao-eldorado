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
  ['.mp4', 'video/mp4'],
  ['.json', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.bcmap', 'application/octet-stream'],
  ['.icc', 'application/octet-stream'],
  ['.pfb', 'application/octet-stream'],
  ['.ttf', 'font/ttf']
]);

function requestedRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(String(value || '').trim());
  if (!match || !size) return null;

  const startValue = match[1];
  const endValue = match[2];
  if (!startValue && !endValue) return null;

  let start;
  let end;

  if (!startValue) {
    const suffixLength = Number(endValue);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  } else {
    start = Number(startValue);
    if (!Number.isInteger(start) || start < 0 || start >= size) return null;
    if (endValue) {
      end = Number(endValue);
      if (!Number.isInteger(end) || end < start) return null;
      end = Math.min(end, size - 1);
    } else {
      end = size - 1;
    }
  }

  return { start, end };
}

http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const candidate = path.resolve(root, relative);
    if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) throw new Error('invalid_path');
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error('not_file');

    const contentType = types.get(path.extname(candidate).toLowerCase()) || 'application/octet-stream';
    const commonHeaders = {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'Accept-Ranges': 'bytes'
    };
    const rangeHeader = request.headers.range;

    if (rangeHeader) {
      const range = requestedRange(rangeHeader, info.size);
      if (!range) {
        response.writeHead(416, {
          ...commonHeaders,
          'Content-Range': `bytes */${info.size}`
        });
        response.end();
        return;
      }

      const body = await readFile(candidate);
      const chunk = body.subarray(range.start, range.end + 1);
      response.writeHead(206, {
        ...commonHeaders,
        'Content-Range': `bytes ${range.start}-${range.end}/${info.size}`,
        'Content-Length': String(chunk.byteLength)
      });
      if (request.method === 'HEAD') response.end();
      else response.end(chunk);
      return;
    }

    response.writeHead(200, {
      ...commonHeaders,
      'Content-Length': String(info.size)
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    response.end(await readFile(candidate));
  } catch (_) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`Central Docs staging em http://127.0.0.1:${port}\n`);
});
