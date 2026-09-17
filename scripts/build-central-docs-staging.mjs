import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const out = path.join(root, 'dist-staging');

const files = [
  ['testing/central-docs/viewer-harness.html', 'testing/central-docs/viewer-harness.html'],
  ['testing/central-docs/fixture.js', 'testing/central-docs/fixture.js'],
  ['testing/central-docs/editor-harness.js', 'testing/central-docs/editor-harness.js'],
  ['testing/post-login-opening/harness.html', 'opening/index.html'],
  ['testing/post-login-opening/harness.js', 'opening/harness.js'],
  ['testing/post-login-opening/complete.html', 'opening/complete.html'],
  ['assets/portal-opening-v1.mp4', 'assets/portal-opening-v1.mp4'],
  ['js/login-opening.js', 'js/login-opening.js'],
  ['js/login.js', 'js/login.js'],
  ['js/home.js', 'js/home.js'],
  ['assets/editor-pdf-buttons', 'assets/editor-pdf-buttons'],
  ['assets/Unir_PDF.png', 'assets/Unir_PDF.png'],
  ['assets/Inserir_pagina_branca.png', 'assets/Inserir_pagina_branca.png'],
  ['assets/Adicionar_imagem.png', 'assets/Adicionar_imagem.png'],
  ['assets/Recortar_pagina.png', 'assets/Recortar_pagina.png'],
  ['assets/Selecionar_mover.png', 'assets/Selecionar_mover.png'],
  ['assets/Escrever.png', 'assets/Escrever.png'],
  ['assets/Colar_imagem.png', 'assets/Colar_imagem.png'],
  ['assets/Desenhar.png', 'assets/Desenhar.png'],
  ['css/documents.css', 'css/documents.css'],
  ['js/document-editor.js', 'js/document-editor.js'],
  ['js/document-viewer.js', 'js/document-viewer.js'],
  ['vendor/pdf-lib', 'vendor/pdf-lib'],
  ['vendor/pdfjs-legacy', 'vendor/pdfjs-legacy'],
  ['vendor/pdfjs/cmaps', 'vendor/pdfjs/cmaps'],
  ['vendor/pdfjs/standard_fonts', 'vendor/pdfjs/standard_fonts'],
  ['vendor/pdfjs/wasm', 'vendor/pdfjs/wasm'],
  ['vendor/pdfjs/iccs', 'vendor/pdfjs/iccs'],
  ['vendor/pdfjs/LICENSE', 'vendor/pdfjs/LICENSE']
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const [source, target] of files) {
  const src = path.join(root, source);
  const dest = path.join(out, target);
  await mkdir(path.dirname(dest), { recursive: true });
  await cp(src, dest, { recursive: true });
}

const harness = await readFile(path.join(root, 'testing/central-docs/viewer-harness.html'), 'utf8');
await writeFile(path.join(out, 'index.html'), harness, 'utf8');

await writeFile(
  path.join(out, 'robots.txt'),
  'User-agent: *\nDisallow: /\n',
  'utf8'
);

const headers = `/*
  X-Robots-Tag: noindex, nofollow, noarchive
  Cache-Control: no-store
  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'none'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
`;
await writeFile(path.join(out, '_headers'), headers, 'utf8');

const manifest = {
  environment: 'central-docs-staging',
  syntheticOnly: true,
  productionApisIncluded: false,
  sourceSha: process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || null
};
await writeFile(path.join(out, 'staging-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

const forbidden = [
  'yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev',
  'regulacaoeldoradoms.com.br/api/',
  'portal-regulacao-users',
  'googleapis.com',
  'googleusercontent.com',
  'accounts.google.com',
  'drive.google.com',
  '/api/documents/',
  'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET',
  'DRIVE_TOKEN_ENCRYPTION_KEY',
  'AUTH_SESSION_SECRET'
];

const textExtensions = new Set(['.html', '.js', '.css', '.json', '.txt', '']);
async function scan(dir) {
  const { readdir, stat } = await import('node:fs/promises');
  for (const name of await readdir(dir)) {
    const full = path.join(dir, name);
    const info = await stat(full);
    if (info.isDirectory()) {
      await scan(full);
      continue;
    }
    if (!textExtensions.has(path.extname(name)) && name !== '_headers') continue;
    const value = await readFile(full, 'utf8').catch(() => '');
    for (const token of forbidden) {
      if (value.includes(token)) {
        throw new Error(`Bundle de staging contém referência proibida: ${token} em ${path.relative(out, full)}`);
      }
    }
  }
}
await scan(out);

console.log(`Bundle de staging criado em ${out}`);
