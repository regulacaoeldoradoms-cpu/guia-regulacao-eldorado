import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('../../', import.meta.url);

async function read(path) {
  return fs.readFile(new URL(path, root), 'utf8');
}

function functionSlice(source, name, nextName) {
  const start = source.indexOf(`  async function ${name}(`);
  assert.ok(start >= 0, `função ${name} ausente`);
  const end = source.indexOf(`  async function ${nextName}(`, start + 1);
  assert.ok(end > start, `limite de ${name} ausente`);
  return source.slice(start, end);
}

test('painel 5C permanece oculto e produção continua fail-closed', async () => {
  const [html, js, css, router, wrangler] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js'),
    read('css/documents.css'),
    read('worker/documents-router.js'),
    read('worker/wrangler.toml')
  ]);

  assert.match(html, /id="documentAiButton"[^>]*hidden/);
  assert.match(html, /id="documentsAiPanel"[^>]*hidden/);
  assert.match(html, /id="documentsAiClassifyButton"[^>]*disabled/);
  assert.match(html, /id="documentsAiExtractButton"[^>]*disabled/);
  assert.match(html, /id="documentsAiCopyBlockButton"/);
  assert.match(html, /id="documentsAiViewSourceButton"/);
  assert.match(css, /\.documents-ai-panel\[hidden\]/);
  assert.match(css, /\.documents-ai-classification/);
  assert.match(js, /\/api\/documents\/ai\/config/);
  assert.match(js, /documentAiCapabilities\(\)\.extract === true/);
  assert.match(js, /state\.documentAiConfig\?\.enabled === true/);
  assert.match(router, /requireCapability\(user, 'extract', origin\)/);
  assert.match(wrangler, /DOCUMENTS_AI_ENABLED = "false"/);
  assert.match(wrangler, /DOCUMENTS_AI_PROCESSING_ENABLED = "false"/);
});

test('classificação envia somente Blob da página e metadado técnico de proveniência', async () => {
  const [js, viewer] = await Promise.all([
    read('js/documents.js'),
    read('js/document-viewer.js')
  ]);
  const classify = functionSlice(js, 'classifyActiveDocumentPage', 'extractActiveDocumentPage');

  assert.match(classify, /const exporter = window\.PortalPdfViewer\?\.exportPageImage/);
  assert.match(classify, /await exporter\(pageNumber/);
  assert.match(classify, /\/api\/documents\/ai\/page\/classify/);
  assert.match(classify, /'X-Document-Page-Number': String\(pageNumber\)/);
  assert.match(classify, /body: blob/);
  assert.match(classify, /credentials: 'omit'/);
  assert.doesNotMatch(classify, /state\.pdfItem\.(?:name|ref)|fileId|filename|searchQuery|page_text|inlineData/);
  assert.match(viewer, /async function exportPageImage\(pageNumber/);
  assert.match(viewer, /canvas\.toBlob/);
  assert.match(viewer, /exportPageImage,/);
});

test('extração 5C também envia somente Blob da página e preserva origem', async () => {
  const js = await read('js/documents.js');
  const extract = functionSlice(js, 'extractActiveDocumentPage', 'loadAccess');

  assert.match(extract, /\/api\/documents\/ai\/page\/extract/);
  assert.match(extract, /'X-Document-Page-Number': String\(pageNumber\)/);
  assert.match(extract, /body: blob/);
  assert.match(extract, /credentials: 'omit'/);
  assert.match(extract, /state\.documentAiExtraction = extraction/);
  assert.doesNotMatch(extract, /state\.pdfItem\.(?:name|ref)|fileId|filename|searchQuery|page_text|inlineData/);
});

test('UI 5C possui copiar campo, copiar bloco e Ver origem sem persistência', async () => {
  const js = await read('js/documents.js');
  assert.match(js, /data-ai-copy-field/);
  assert.match(js, /documentAiExtractionBlock/);
  assert.match(js, /documentAiCopyBlock/);
  assert.match(js, /documentAiViewSource/);
  assert.match(js, /PortalPdfViewer\?\.scrollToPage\?\.\(pageNumber\)/);
  assert.doesNotMatch(js, /localStorage\.(?:setItem|getItem).*documentAi/i);
  assert.doesNotMatch(js, /indexedDB.*documentAi/i);
});

test('frontend 5C não contém segredo de provedor nem codifica a página em base64', async () => {
  const [html, js] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js')
  ]);
  const frontend = html + '\n' + js;
  assert.doesNotMatch(frontend, /GEMINI_API_KEY|DRIVE_TOKEN_ENCRYPTION_KEY|AUTH_SESSION_SECRET/);
  assert.doesNotMatch(frontend, /inlineData|bytesToBase64|page_text/i);
});

test('rotinas públicas exibidas no painel não incluem instrução interna', async () => {
  const js = await read('js/documents.js');
  assert.match(js, /routine\.id/);
  assert.match(js, /routine\.purpose/);
  assert.doesNotMatch(js, /routine\.system/);
});
