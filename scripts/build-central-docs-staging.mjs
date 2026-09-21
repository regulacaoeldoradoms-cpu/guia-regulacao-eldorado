import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const out = path.join(root, 'dist-staging');
const homologationRoot = path.join(out, 'homologacao');
const PRODUCTION_WORKER_ORIGIN = 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';
const PRODUCTION_WORKER_HOST = new URL(PRODUCTION_WORKER_ORIGIN).hostname;
const productionWorkerHostPattern = new RegExp(
  `(^|[^a-z0-9.-])${PRODUCTION_WORKER_HOST.replaceAll('.', '\\.')}(?:\\.)?(?=$|[^a-z0-9.-])`,
  'i'
);
const DISABLED_WORKER_ORIGIN = 'https://disabled.invalid';
const AI_HOMOLOGATION_WORKER_ORIGIN = 'https://central-docs-phase5e-yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';

function normalizeHomologationWorkerUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  let url;
  try {
    url = new URL(raw);
  } catch (_) {
    throw new Error('CENTRAL_DOCS_HOMOLOGATION_WORKER_URL precisa ser uma URL HTTPS válida.');
  }
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.workers.dev')) {
    throw new Error('CENTRAL_DOCS_HOMOLOGATION_WORKER_URL deve apontar para um preview *.workers.dev via HTTPS.');
  }
  if (url.username || url.password || url.port || url.search || url.hash || (url.pathname && url.pathname !== '/')) {
    throw new Error('CENTRAL_DOCS_HOMOLOGATION_WORKER_URL deve conter somente a origem do Worker, sem credenciais, porta, path, query ou hash.');
  }
  if (url.hostname === PRODUCTION_WORKER_HOST) {
    throw new Error('A homologação 4D não pode apontar para o Worker de produção. Use uma versão/preview isolada.');
  }
  return url.origin;
}

const homologationWorkerUrl = normalizeHomologationWorkerUrl(process.env.CENTRAL_DOCS_HOMOLOGATION_WORKER_URL);
const effectiveWorkerOrigin = homologationWorkerUrl || DISABLED_WORKER_ORIGIN;

function normalizeAiHomologationWorkerUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  let url;
  try {
    url = new URL(raw);
  } catch (_) {
    throw new Error('CENTRAL_DOCS_AI_HOMOLOGATION_WORKER_URL precisa ser uma URL HTTPS válida.');
  }
  if (
    url.origin !== AI_HOMOLOGATION_WORKER_ORIGIN
    || url.href !== AI_HOMOLOGATION_WORKER_ORIGIN + '/'
    || url.username
    || url.password
    || url.port
    || url.search
    || url.hash
  ) {
    throw new Error('CENTRAL_DOCS_AI_HOMOLOGATION_WORKER_URL deve ser exatamente o alias oficial 5E.');
  }
  return url.origin;
}

const aiHomologationWorkerUrl = normalizeAiHomologationWorkerUrl(
  process.env.CENTRAL_DOCS_AI_HOMOLOGATION_WORKER_URL
);
// O laboratório 5E permite seleção manual apenas do alias oficial. A CSP precisa
// permitir esse alias mesmo quando o bundle não o recebe por variável de build;
// caso contrário o navegador bloqueia fetch antes que o CORS do Worker seja avaliado.
const effectiveAiWorkerOrigin = AI_HOMOLOGATION_WORKER_ORIGIN;

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
  ['assets/Drive_normal.png', 'assets/Drive_normal.png'],
  ['assets/Drive_pendente.png', 'assets/Drive_pendente.png'],
  ['assets/Drive_sincronizando.png', 'assets/Drive_sincronizando.png'],
  ['assets/Drive_sincronizado_1seg.png', 'assets/Drive_sincronizado_1seg.png'],
  ['assets/Drive_falha.png', 'assets/Drive_falha.png'],
  ['css/documents.css', 'css/documents.css'],
  ['js/document-background.js', 'js/document-background.js'],
  ['js/document-editor.js', 'js/document-editor.js'],
  ['js/document-ocr.js', 'js/document-ocr.js'],
  ['js/document-viewer.js', 'js/document-viewer.js'],
  ['vendor/pdf-lib', 'vendor/pdf-lib'],
  ['vendor/tesseract', 'vendor/tesseract'],
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

function rewriteHomologationHtml(value) {
  return value
    .replaceAll(PRODUCTION_WORKER_ORIGIN, effectiveWorkerOrigin)
    .replace(/\s*<script src="\/js\/portal-performance\.js[^>]*><\/script>\s*/g, '\n')
    .replace(/\s*<link rel="manifest"[^>]*>\s*/g, '\n')
    .replaceAll('src="/js/', 'src="/homologacao/js/')
    .replaceAll('href="/css/', 'href="/homologacao/css/')
    .replaceAll('src="/assets/', 'src="/homologacao/assets/')
    .replaceAll('href="/assets/', 'href="/homologacao/assets/')
    .replaceAll('href="/ferramentas/"', 'href="/homologacao/documentos/"')
    .replaceAll('href="/cadastro/"', 'href="/homologacao/login/"')
    .replace('href="/" style="color:inherit;text-decoration:none"', 'href="/homologacao/documentos/" style="color:inherit;text-decoration:none"')
    .replace(
      '</head>',
      '  <meta name="central-docs-homologation" content="4D">\n</head>'
    )
    .replace(
      '<body ',
      '<body data-central-docs-homologation="4D" '
    )
    .replace(
      /(<body[^>]*>)/,
      '$1\n  <div role="status" style="position:sticky;top:0;z-index:99999;padding:8px 12px;background:#fff3cd;color:#664d03;border-bottom:1px solid #ffecb5;font:700 13px/1.4 system-ui;text-align:center">HOMOLOGAÇÃO 4D · use somente PDF descartável sem dados de paciente · gravação real só após habilitar o gate no Worker de preview</div>'
    );
}

function rewriteHomologationJs(value) {
  return value
    .replaceAll(PRODUCTION_WORKER_ORIGIN, effectiveWorkerOrigin)
    .replaceAll("'/vendor/", "'/homologacao/vendor/")
    .replaceAll('"/vendor/', '"/homologacao/vendor/');
}

const homologationCopies = [
  ['css/portal.css', 'css/portal.css', false],
  ['css/profile-account-link.css', 'css/profile-account-link.css', false],
  ['css/portal-interactions.css', 'css/portal-interactions.css', false],
  ['css/documents.css', 'css/documents.css', false],
  ['js/auth-client.js', 'js/auth-client.js', true],
  ['js/login.js', 'js/login.js', true],
  ['js/tools-catalog.js', 'js/tools-catalog.js', true],
  ['js/portal-interactions.js', 'js/portal-interactions.js', true],
  ['js/portal-observability.js', 'js/portal-observability.js', true],
  ['js/document-cache.js', 'js/document-cache.js', true],
  ['js/document-background.js', 'js/document-background.js', true],
  ['js/document-editor.js', 'js/document-editor.js', true],
  ['js/document-ocr.js', 'js/document-ocr.js', true],
  ['js/document-viewer.js', 'js/document-viewer.js', true],
  ['js/documents.js', 'js/documents.js', true]
];

await mkdir(homologationRoot, { recursive: true });
await cp(path.join(root, 'assets'), path.join(homologationRoot, 'assets'), { recursive: true });
await cp(path.join(root, 'vendor/pdf-lib'), path.join(homologationRoot, 'vendor/pdf-lib'), { recursive: true });
await cp(path.join(root, 'vendor/tesseract'), path.join(homologationRoot, 'vendor/tesseract'), { recursive: true });
await cp(path.join(root, 'vendor/pdfjs-legacy'), path.join(homologationRoot, 'vendor/pdfjs-legacy'), { recursive: true });
await cp(path.join(root, 'vendor/pdfjs/cmaps'), path.join(homologationRoot, 'vendor/pdfjs/cmaps'), { recursive: true });
await cp(path.join(root, 'vendor/pdfjs/standard_fonts'), path.join(homologationRoot, 'vendor/pdfjs/standard_fonts'), { recursive: true });
await cp(path.join(root, 'vendor/pdfjs/wasm'), path.join(homologationRoot, 'vendor/pdfjs/wasm'), { recursive: true });
await cp(path.join(root, 'vendor/pdfjs/iccs'), path.join(homologationRoot, 'vendor/pdfjs/iccs'), { recursive: true });
await cp(path.join(root, 'vendor/pdfjs/LICENSE'), path.join(homologationRoot, 'vendor/pdfjs/LICENSE'));

for (const [source, target, rewriteJs] of homologationCopies) {
  const value = await readFile(path.join(root, source), 'utf8');
  const dest = path.join(homologationRoot, target);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, rewriteJs ? rewriteHomologationJs(value) : value, 'utf8');
}

const documentsHtml = rewriteHomologationHtml(await readFile(path.join(root, 'documentos/index.html'), 'utf8'))
  .replace(
    '<script src="/homologacao/js/documents.js',
    '<script src="/homologacao/js/portal-observability.js?v=4d-1"></script>\n  <script src="/homologacao/js/documents.js'
  );
const loginHtml = rewriteHomologationHtml(await readFile(path.join(root, 'login/index.html'), 'utf8'));

await mkdir(path.join(homologationRoot, 'documentos'), { recursive: true });
await mkdir(path.join(homologationRoot, 'login'), { recursive: true });
await writeFile(path.join(homologationRoot, 'documentos/index.html'), documentsHtml, 'utf8');
await writeFile(path.join(homologationRoot, 'login/index.html'), loginHtml, 'utf8');
await writeFile(
  path.join(homologationRoot, 'index.html'),
  '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/homologacao/documentos/"><title>Homologação 4D</title><a href="/homologacao/documentos/">Abrir homologação 4D</a>\n',
  'utf8'
);

const authConfig = `'use strict';\nwindow.CENTRAL_DOCS_HOMOLOGATION = Object.freeze({\n  phase: '4D',\n  workerConfigured: ${Boolean(homologationWorkerUrl)},\n  workerOrigin: ${JSON.stringify(homologationWorkerUrl)}\n});\nwindow.REGULATION_AUTH_CONFIG = Object.freeze({\n  endpoint: ${JSON.stringify(homologationWorkerUrl)},\n  enforcement: true,\n  tokenStorageKey: 'central.docs.homologacao.session',\n  userStorageKey: 'central.docs.homologacao.user',\n  loginPath: '/homologacao/login/',\n  homePath: '/homologacao/documentos/'\n});\n`;
await writeFile(path.join(homologationRoot, 'js/auth-config.js'), authConfig, 'utf8');

const manifest = {
  environment: 'central-docs-staging',
  syntheticOnly: true,
  productionApisIncluded: false,
  sourceSha: process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || null,
  homologation4d: {
    available: true,
    path: '/homologacao/documentos/',
    workerConfigured: Boolean(homologationWorkerUrl),
    productionWorkerBlocked: true
  },
  homologation5e: {
    available: true,
    path: '/homologacao-5e/',
    syntheticOnly: true,
    workerConfigured: Boolean(aiHomologationWorkerUrl),
    productionWorkerBlocked: true
  }
};
await writeFile(path.join(out, 'staging-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
await writeFile(
  path.join(homologationRoot, 'homologation-manifest.json'),
  JSON.stringify({
    environment: 'central-docs-homologation-4d',
    workerConfigured: Boolean(homologationWorkerUrl),
    workerOrigin: homologationWorkerUrl || null,
    writeGateExpected: 'DOCUMENTS_DRIVE_WRITE_ENABLED=true',
    disposablePdfOnly: true
  }, null, 2) + '\n',
  'utf8'
);

const aiHomologationRoot = path.join(out, 'homologacao-5e');
await mkdir(aiHomologationRoot, { recursive: true });
for (const [source, target] of [
  ['testing/central-docs-ai/phase5e-harness.html', 'index.html'],
  ['testing/central-docs-ai/phase5e-harness.js', 'phase5e.js'],
  ['testing/central-docs-ai/phase5e-harness.css', 'phase5e.css']
]) {
  await cp(path.join(root, source), path.join(aiHomologationRoot, target));
}
await writeFile(
  path.join(aiHomologationRoot, 'config.js'),
  `'use strict';\nwindow.CENTRAL_DOCS_AI_HOMOLOGATION = Object.freeze({\n  phase: '5E',\n  syntheticOnly: true,\n  workerConfigured: ${Boolean(aiHomologationWorkerUrl)},\n  workerOrigin: ${JSON.stringify(aiHomologationWorkerUrl)}\n});\n`,
  'utf8'
);
await writeFile(
  path.join(aiHomologationRoot, 'homologation-manifest.json'),
  JSON.stringify({
    environment: 'central-docs-ai-homologation-5e',
    syntheticOnly: true,
    workerConfigured: Boolean(aiHomologationWorkerUrl),
    workerOrigin: aiHomologationWorkerUrl || null,
    productionWorkerBlocked: true,
    productionAiGatesExpected: false
  }, null, 2) + '\n',
  'utf8'
);

const commonHeaders = `  X-Robots-Tag: noindex, nofollow, noarchive\n  Cache-Control: no-store\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n`;
const headers = `/*\n${commonHeaders}\n/index.html\n  Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'none'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'\n\n/testing/*\n  Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'none'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'\n\n/opening/*\n  Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'none'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'\n\n/homologacao-5e/*\n${commonHeaders}  Content-Security-Policy: default-src 'self'; connect-src 'self' ${effectiveAiWorkerOrigin}; img-src 'self' data: blob:; style-src 'self'; script-src 'self'; worker-src 'none'; child-src 'none'; frame-src 'none'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'\n\n/homologacao/*\n${commonHeaders}  Content-Security-Policy: default-src 'self'; connect-src 'self' ${effectiveWorkerOrigin}; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'none'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'\n`;
await writeFile(path.join(out, '_headers'), headers, 'utf8');

const forbiddenSynthetic = [
  PRODUCTION_WORKER_HOST,
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

const forbiddenEverywhere = [
  'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET',
  'DRIVE_TOKEN_ENCRYPTION_KEY',
  'AUTH_SESSION_SECRET'
];

const textExtensions = new Set(['.html', '.js', '.css', '.json', '.txt', '']);
async function scan(dir, tokens, options = {}) {
  const { readdir, stat } = await import('node:fs/promises');
  for (const name of await readdir(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(out, full);
    if (options.skipHomologation && (
      rel === 'homologacao'
      || rel.startsWith(`homologacao${path.sep}`)
      || rel === 'homologacao-5e'
      || rel.startsWith(`homologacao-5e${path.sep}`)
    )) continue;
    const info = await stat(full);
    if (info.isDirectory()) {
      await scan(full, tokens, options);
      continue;
    }
    if (!textExtensions.has(path.extname(name)) && name !== '_headers') continue;
    const value = await readFile(full, 'utf8').catch(() => '');
    for (const token of tokens) {
      // Preview aliases prefix the production hostname. Match the complete DNS
      // host here without exempting _headers or weakening any other token check.
      const forbidden = token === PRODUCTION_WORKER_HOST
        ? productionWorkerHostPattern.test(value)
        : value.includes(token);
      if (forbidden) {
        throw new Error(`Bundle de staging contém referência proibida: ${token} em ${rel}`);
      }
    }
  }
}
await scan(out, forbiddenSynthetic, { skipHomologation: true });
await scan(out, forbiddenEverywhere);

if (homologationWorkerUrl) {
  const homologationText = await readFile(path.join(homologationRoot, 'js/auth-config.js'), 'utf8');
  if (!homologationText.includes(homologationWorkerUrl)) throw new Error('Configuração do Worker de homologação não foi materializada.');
}

if (aiHomologationWorkerUrl) {
  const aiConfigText = await readFile(path.join(aiHomologationRoot, 'config.js'), 'utf8');
  if (!aiConfigText.includes(aiHomologationWorkerUrl)) {
    throw new Error('Configuração do Worker 5E não foi materializada.');
  }
}

console.log(`Bundle de staging criado em ${out}`);
console.log(`Homologação 4D: ${homologationWorkerUrl ? 'configurada para Worker preview' : 'aguardando CENTRAL_DOCS_HOMOLOGATION_WORKER_URL'}`);

console.log(`Homologação 5E: ${aiHomologationWorkerUrl ? 'configurada para Worker preview' : 'aguardando CENTRAL_DOCS_AI_HOMOLOGATION_WORKER_URL'}`);
