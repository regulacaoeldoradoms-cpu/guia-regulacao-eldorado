// Local synthetic-document harness. No authentication or Drive access.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../../..');
const server = http.createServer((req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname;
  const file = name === '/test-pdf-lib.js'
    ? require.resolve('pdf-lib/dist/pdf-lib.min.js') : path.join(root, name);
  if (name !== '/test-pdf-lib.js' && !file.startsWith(root + path.sep)) {
    res.writeHead(403); return res.end();
  }
  try {
    const content = fs.readFileSync(file);
    const ext = path.extname(file);
    res.setHeader('Content-Type', {'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html'}[ext] || 'application/octet-stream');
    res.end(content);
  } catch { res.writeHead(404); res.end(); }
});
server.listen(8765, '127.0.0.1');
module.exports = server;
