import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('../../', import.meta.url);

async function read(path) {
  return fs.readFile(new URL(path, root), 'utf8');
}

function asyncFunctionSlice(source, name, nextName) {
  const start = source.indexOf(`  async function ${name}(`);
  assert.ok(start >= 0, `função ${name} ausente`);
  const end = source.indexOf(`  async function ${nextName}(`, start + 1);
  assert.ok(end > start, `limite de ${name} ausente`);
  return source.slice(start, end);
}

test('painel Titon permanece oculto e produção continua fail-closed', async () => {
  const [html, js, css, router, wrangler] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js'),
    read('css/documents.css'),
    read('worker/documents-router.js'),
    read('worker/wrangler.toml')
  ]);

  assert.match(html, /id="documentAiButton"[^>]*hidden/);
  assert.match(html, /id="documentsAiPanel"[^>]*hidden/);
  assert.match(html, /Titon · IA documental/);
  assert.match(html, /id="documentsAiExtractDocumentButton"[^>]*disabled/);
  assert.match(html, /id="documentsAiDocumentResults"[^>]*hidden/);
  assert.match(html, /id="documentsAiCopyAllButton"/);
  assert.doesNotMatch(html, /id="documentsAiClassifyButton"/);
  assert.doesNotMatch(html, /id="documentsAiExtractButton"/);
  assert.match(css, /\.documents-ai-panel\[hidden\]/);
  assert.match(css, /\.documents-ai-batch/);
  assert.match(js, /\/api\/documents\/ai\/config/);
  assert.match(js, /documentAiCapabilities\(\)\.extract === true/);
  assert.match(js, /state\.documentAiConfig\?\.enabled === true/);
  assert.match(router, /requireCapability\(user, 'extract', origin\)/);
  assert.match(wrangler, /DOCUMENTS_AI_ENABLED = "true"/);
  assert.match(wrangler, /DOCUMENTS_AI_PROCESSING_ENABLED = "true"/);
  assert.match(wrangler, /DOCUMENTS_AI_BACKGROUND_ENABLED = "false"/);
  assert.match(wrangler, /DOCUMENTS_AI_FREE_ONLY = "true"/);
  assert.match(wrangler, /DOCUMENTS_AI_FAST_VISION_ENABLED = "false"/);
  assert.match(wrangler, /@cf\/moondream\/moondream3\.1-9B-A2B/);
  assert.match(wrangler, /@cf\/google\/gemma-4-26b-a4b-it/);
  assert.match(wrangler, /@cf\/qwen\/qwen3\.8-27b/);
});

test('botão único percorre o PDF e envia somente uma página por chamada', async () => {
  const [js, viewer] = await Promise.all([
    read('js/documents.js'),
    read('js/document-viewer.js')
  ]);
  const prepare = asyncFunctionSlice(js, 'prepareDocumentAiPageBlob', 'requestDocumentAiPage');
  const request = asyncFunctionSlice(js, 'requestDocumentAiPage', 'extractWholeDocumentAi');
  const extract = asyncFunctionSlice(js, 'extractWholeDocumentAi', 'classifyActiveDocumentPage');

  assert.match(extract, /getPageCount\?\.\(\)/);
  assert.match(extract, /const concurrency = Math\.min\(5, pageCount\)/);
  assert.match(extract, /Promise\.all\(Array\.from\(\{ length: concurrency \}/);
  assert.match(extract, /prepareDocumentAiPageBlob\(pageNumber\)/);
  assert.match(extract, /requestDocumentAiPage\(pageNumber, blob\)/);
  assert.match(prepare, /await exporter\(pageNumber/);
  assert.match(prepare, /maxEdge: 1800/);
  assert.match(prepare, /mimeType: 'image\/png'/);
  assert.match(prepare, /cropWhitespace: true/);
  assert.match(prepare, /blob\.size > 2\.8 \* 1024 \* 1024/);
  assert.match(prepare, /mimeType: 'image\/jpeg'/);
  assert.match(prepare, /quality: 0\.92/);
  assert.match(request, /\/api\/documents\/ai\/page\/extract/);
  assert.match(request, /'X-Document-Page-Number': String\(pageNumber\)/);
  assert.match(request, /body: blob/);
  assert.match(request, /credentials: 'omit'/);
  assert.match(extract, /if \(analyzed\.pageType === 'outro'\)/);
  assert.match(extract, /state\.documentAiEvidence\.set\(pageNumber, normalized\)/);
  assert.doesNotMatch(extract, /DOCUMENT_AI_PAGE_NOT_AUTHORIZED/);
  assert.doesNotMatch(extract, /state\.pdfItem\.(?:name|ref)|fileId|filename|searchQuery|page_text|inlineData/);

  assert.match(viewer, /async function exportPageImage\(pageNumber/);
  assert.match(viewer, /function getPageCount\(\)/);
  assert.match(viewer, /session\.document\?\.numPages/);
  assert.match(viewer, /getPageCount,/);
  assert.match(viewer, /async function pageTextSafetyBounds\(page, viewport\)/);
  assert.match(viewer, /function meaningfulContentBounds\(canvas/);
  assert.match(viewer, /minimumDarkFraction/);
  assert.match(viewer, /cropWhitespace === true/);
  assert.match(viewer, /pageTextSafetyBounds\(page, viewport\)/);
  assert.match(viewer, /outputCanvas\.toBlob/);
});

test('resultado Titon segue o formato operacional e mantém cada página separada', async () => {
  const [html, js] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js')
  ]);

  assert.match(js, /\[DADOS DO COMPROVANTE DE ATENDIMENTO - Página \$\{pageNumber\}\]/);
  assert.match(js, /\[DADOS DA PÁGINA MÉDICA AUTORIZADA - Página \$\{pageNumber\} - Título encontrado:/);
  assert.match(js, /PÁGINA "COMPROVANTE DE ATENDIMENTO" NÃO ENCONTRADA/);
  assert.match(js, /NENHUMA PÁGINA MÉDICA AUTORIZADA FOI ENCONTRADA/);
  assert.match(js, /Fone do paciente:/);
  assert.match(js, /data-ai-source-page/);
  assert.match(js, /data-ai-copy-result-index/);
  assert.match(js, /documentAiAllResultsBlock/);
  assert.match(html, /Copiar dados/);
  assert.match(html, /Ver página|documentsAiDocumentResults/);
  assert.doesNotMatch(js, /localStorage\.(?:setItem|getItem).*documentAi/i);
  assert.doesNotMatch(js, /sessionStorage\.(?:setItem|getItem).*documentAi/i);
  assert.doesNotMatch(js, /indexedDB.*documentAi/i);
});

test('falha intermediária descarta resultado parcial para não simular documento completo', async () => {
  const js = await read('js/documents.js');
  const extract = asyncFunctionSlice(js, 'extractWholeDocumentAi', 'classifyActiveDocumentPage');

  assert.match(extract, /if \(failure\) throw failure/);
  assert.match(extract, /state\.documentAiResults = \[\]/);
  assert.match(extract, /state\.documentAiEvidence\.clear\(\)/);
  assert.match(extract, /state\.documentAiScanCompleted = false/);
});

test('chat continua secundário e usa somente evidências estruturadas em memória', async () => {
  const [html, js, router] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js'),
    read('worker/documents-router.js')
  ]);

  assert.match(html, /Perguntar sobre os dados extraídos/);
  assert.match(html, /id="documentsAiChatQuestion"/);
  assert.match(html, /id="documentsAiChatSendButton"[^>]*disabled/);
  assert.match(js, /documentAiEvidence: new Map\(\)/);
  assert.match(js, /documentAiChatHistory: \[\]/);
  assert.match(js, /state\.documentAiScanCompleted === true/);
  assert.match(js, /state\.documentAiEvidence\.size <= 12/);
  assert.match(js, /\/api\/documents\/ai\/chat/);
  assert.match(js, /evidence = \[\.\.\.state\.documentAiEvidence\.values\(\)\]/);
  assert.match(js, /data-ai-chat-page/);
  assert.match(router, /url\.pathname === '\/api\/documents\/ai\/chat'/);
  assert.doesNotMatch(js, /body:\s*JSON\.stringify\([^)]*(?:state\.pdfItem|filename|fileId|item\.ref)/s);
});

test('frontend não contém segredo de provedor nem converte página em base64', async () => {
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
