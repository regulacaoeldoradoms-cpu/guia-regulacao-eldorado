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

test('painel Titon inicia oculto e produção mantém somente Gemini no fluxo normal', async () => {
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
  assert.match(html, /id="documentsAiInfoButton"[^>]*aria-expanded="false"/);
  assert.match(html, /id="documentsAiInfoPanel"[^>]*hidden/);
  assert.match(html, /id="documentsAiExtractDocumentButton"[^>]*disabled[^>]*>Extrair dados do PDF<\/button>/);
  assert.doesNotMatch(html, /documentsAiExtractGeminiButton|documentsAiCompareSection|Extrair com IA atual|Extrair com Gemini/);
  assert.match(html, /Gemini 3\.5 Flash-Lite/);
  assert.match(html, /id="documentsAiDocumentResults"[^>]*hidden/);
  assert.match(html, /id="documentsAiCopyAllButton"[^>]*>Copiar tudo<\/button>/);
  assert.match(html, /id="documentsAiOrderFieldsButton"[^>]*>Organizar campos<\/button>/);
  assert.match(html, /id="documentsAiFieldOrderPanel"[^>]*hidden/);
  assert.match(html, /id="documentsAiChatSection"[^>]*hidden/);
  assert.doesNotMatch(html, />Extração automática</);
  assert.doesNotMatch(html, /id="documentsAiClassifyButton"/);
  assert.doesNotMatch(html, /id="documentsAiExtractButton"/);
  assert.match(css, /\.documents-ai-panel\[hidden\]/);
  assert.match(css, /\.documents-ai-batch/);
  assert.match(js, /\/api\/documents\/ai\/config/);
  assert.match(js, /\/api\/documents\/ai\/page\/gemini/);
  assert.match(router, /requireCapability\(user, 'extract', origin\)/);
  assert.match(wrangler, /DOCUMENTS_AI_ENABLED = "true"/);
  assert.match(wrangler, /DOCUMENTS_AI_PROCESSING_ENABLED = "true"/);
  assert.match(wrangler, /DOCUMENTS_AI_BACKGROUND_ENABLED = "false"/);
  assert.match(wrangler, /TITON_GEMINI_ENABLED = "true"/);
  assert.match(wrangler, /TITON_GEMINI_COMPARISON_ENABLED = "false"/);
  assert.match(wrangler, /TITON_GEMINI_MODEL = "gemini-3\.5-flash-lite"/);
  assert.doesNotMatch(wrangler, /TITON_GEMINI_API_KEY\s*=\s*["']/);
});

test('botão único percorre o PDF pelo Gemini e envia somente uma página por chamada', async () => {
  const [js, viewer] = await Promise.all([
    read('js/documents.js'),
    read('js/document-viewer.js')
  ]);
  const prepare = asyncFunctionSlice(js, 'prepareDocumentAiPageBlob', 'requestDocumentAiPage');
  const geminiRequest = asyncFunctionSlice(js, 'requestGeminiDocumentAiPage', 'extractWholeDocumentAi');
  const extract = asyncFunctionSlice(js, 'extractWholeDocumentAi', 'extractWholeDocumentAiGemini');

  assert.match(extract, /getPageCount\?\.\(\)/);
  assert.match(extract, /const concurrency = Math\.min\(3, pageCount\)/);
  assert.match(extract, /Promise\.all\(Array\.from\(\{ length: concurrency \}/);
  assert.match(extract, /prepareDocumentAiPageBlob\(pageNumber\)/);
  assert.match(extract, /requestGeminiDocumentAiPage\(pageNumber, blob\)/);
  assert.doesNotMatch(extract, /requestDocumentAiPage\(pageNumber, blob\)/);
  assert.match(prepare, /await exporter\(pageNumber/);
  assert.match(prepare, /maxEdge: 1800/);
  assert.match(prepare, /mimeType: 'image\/png'/);
  assert.match(prepare, /cropWhitespace: true/);
  assert.match(prepare, /blob\.size > 2\.8 \* 1024 \* 1024/);
  assert.match(geminiRequest, /\/api\/documents\/ai\/page\/gemini/);
  assert.match(geminiRequest, /'X-Document-Page-Number': String\(pageNumber\)/);
  assert.match(geminiRequest, /body: blob/);
  assert.match(geminiRequest, /credentials: 'omit'/);
  assert.match(extract, /if \(analyzed\.pageType === 'outro'\)/);
  assert.match(extract, /state\.documentAiEvidence\.set\(pageNumber, normalized\)/);
  assert.match(extract, /source: 'gemini'/);
  assert.doesNotMatch(extract, /source: 'cloudflare'/);
  assert.doesNotMatch(extract, /state\.pdfItem\.(?:name|ref)|fileId|filename|searchQuery|page_text/);

  assert.match(viewer, /async function exportPageImage\(pageNumber/);
  assert.match(viewer, /function getPageCount\(\)/);
  assert.match(viewer, /session\.document\?\.numPages/);
  assert.match(viewer, /getPageCount,/);
});

test('Gemini substitui a comparação e é a única extração visível do Titon', async () => {
  const [html, js, router, ai] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js'),
    read('worker/documents-router.js'),
    read('worker/document-ai.js')
  ]);
  const geminiRequest = asyncFunctionSlice(js, 'requestGeminiDocumentAiPage', 'extractWholeDocumentAi');
  const primaryExtract = asyncFunctionSlice(js, 'extractWholeDocumentAi', 'extractWholeDocumentAiGemini');

  assert.match(html, /Extrair dados do PDF/);
  assert.doesNotMatch(html, /Extrair com IA atual|Extrair com Gemini|documentsAiCompareSection/);
  assert.match(geminiRequest, /\/api\/documents\/ai\/page\/gemini/);
  assert.match(geminiRequest, /'X-Document-Page-Number': String\(pageNumber\)/);
  assert.match(primaryExtract, /requestGeminiDocumentAiPage\(pageNumber, blob\)/);
  assert.match(primaryExtract, /state\.documentAiResults\.push\(normalized\)/);
  assert.match(primaryExtract, /state\.documentAiEvidence\.set\(pageNumber, normalized\)/);
  assert.match(primaryExtract, /source: 'gemini'/);
  assert.doesNotMatch(primaryExtract, /requestDocumentAiPage\(/);
  assert.match(router, /\/api\/documents\/ai\/page\/gemini/);
  assert.match(ai, /provider: 'google-gemini-api'/);
  assert.match(ai, /documentChat: false/);
  assert.match(ai, /geminiComparison: false/);
});

test('provider Gemini envia enums REST em caixa alta', async () => {
  const provider = await read('worker/document-ai-gemini.js');
  assert.match(provider, /thinkingLevel: 'MINIMAL'/);
  assert.match(provider, /thinkingLevel: 'LOW'/);
  assert.match(provider, /mimeType: 'APPLICATION_JSON'/);
  assert.doesNotMatch(provider, /thinkingLevel: 'minimal'|thinkingLevel: 'low'|mimeType: 'application\/json'/);
});

test('falha do Gemini permanece visível no status principal após o carregamento', async () => {
  const js = await read('js/documents.js');
  const extract = asyncFunctionSlice(js, 'extractWholeDocumentAi', 'extractWholeDocumentAiGemini');
  assert.match(extract, /els\.documentAiDocumentStatus\.className = 'documents-ai-document-status warning'/);
  assert.match(extract, /A extração com Gemini foi interrompida/);
  assert.match(extract, /source: 'gemini'/);
  assert.doesNotMatch(extract, /source: 'cloudflare'/);
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
  assert.match(js, /DOCUMENT_AI_FIELD_GROUPS/);
  assert.match(js, /label: 'Paciente'/);
  assert.match(js, /label: 'Encaminhamento'/);
  assert.match(js, /label: 'Solicitação'/);
  assert.match(js, /label: 'Profissional'/);
  assert.match(js, /data-ai-copy-document-field/);
  assert.match(js, /data-ai-copy-document-page/);
  assert.match(js, /data-ai-copy-result-page/);
  assert.match(js, /documentAiAllResultsBlock/);
  assert.match(html, /Copiar tudo/);
  assert.match(html, /Ver página|documentsAiDocumentResults/);
  assert.doesNotMatch(js, /localStorage|sessionStorage|indexedDB/);
  assert.match(js, /body: JSON\.stringify\(\{ fieldOrder \}\)/);
});

test('painel IA fica minimalista e organização/cópia não dispara nova inferência', async () => {
  const [html, js] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js')
  ]);

  assert.match(html, /id="documentsAiInfoButton"/);
  assert.match(html, /id="documentsAiInfoPanel" hidden/);
  assert.match(html, /id="documentsAiChatSection" hidden/);
  assert.doesNotMatch(html, /<strong id="documentsAiBatchTitle">/);
  assert.doesNotMatch(html, /Opcional\. As respostas usam somente/);

  const renderStart = js.indexOf('  function documentAiResultGroups(');
  const renderEnd = js.indexOf('  function canExtractCurrentDocumentAiPage()', renderStart);
  assert.ok(renderStart >= 0 && renderEnd > renderStart, 'render estruturado ausente');
  const renderBlock = js.slice(renderStart, renderEnd);
  assert.doesNotMatch(renderBlock, /fetch\(|api\(/);
  assert.match(renderBlock, /DOCUMENT_AI_FIELD_GROUPS/);
  assert.match(renderBlock, /data-ai-copy-document-field/);

  const eventStart = js.indexOf("  els.documentAiDocumentResults?.addEventListener('click'");
  const eventEnd = js.indexOf("  els.documentAiCopyAll?.addEventListener('click'", eventStart);
  assert.ok(eventStart >= 0 && eventEnd > eventStart, 'handler de cópia individual ausente');
  const eventBlock = js.slice(eventStart, eventEnd);
  assert.doesNotMatch(eventBlock, /fetch\(|api\(/);
  assert.match(eventBlock, /copyDocumentAiText\(documentAiFieldDisplay\(field\)\)/);
  assert.match(eventBlock, /state\.documentAiCopiedFields\.add\(documentAiCopyToken\(pageNumber, key\)\)/);
  assert.match(eventBlock, /fieldCopy\.textContent = 'Copiado'/);
});

test('ordem dos campos é personalizável por conta sem persistir dados extraídos no navegador', async () => {
  const [html, js, css, router] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js'),
    read('css/documents.css'),
    read('worker/documents-router.js')
  ]);

  assert.match(html, /id="documentsAiOrderFieldsButton"/);
  assert.match(html, /id="documentsAiFieldOrderList"/);
  assert.match(html, /id="documentsAiFieldOrderResetButton"/);
  assert.match(html, /id="documentsAiFieldOrderDoneButton"/);
  assert.match(js, /function normalizeTitonFieldOrder\(/);
  assert.match(js, /function moveTitonFieldBefore\(/);
  assert.match(js, /function shiftTitonField\(/);
  assert.match(js, /draggable="true" data-ai-order-field=/);
  assert.match(js, /persistTitonFieldOrder\(\)/);
  assert.match(js, /\/api\/documents\/preferences/);
  assert.match(router, /auth_document_ai_preferences/);
  assert.match(router, /field_order_json/);
  assert.match(router, /DOCUMENTS_AI_FIELD_ORDER_INVALID/);
  assert.match(css, /\.documents-ai-order-row/);
  assert.match(css, /\.documents-ai-field\.is-copied/);

  const orderStart = js.indexOf('  function normalizeTitonFieldOrder(');
  const orderEnd = js.indexOf('  function documentAiResultGroups(', orderStart);
  assert.ok(orderStart >= 0 && orderEnd > orderStart, 'bloco de ordenação ausente');
  const orderBlock = js.slice(orderStart, orderEnd);
  assert.doesNotMatch(orderBlock, /\/api\/documents\/ai\//);
  assert.doesNotMatch(orderBlock, /documentAiResults|documentAiExtraction|documentAiEvidence/);
  assert.doesNotMatch(js, /localStorage|sessionStorage|indexedDB/);
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
  const chatStart = js.indexOf('  async function askDocumentAiQuestion(');
  const chatEnd = js.indexOf('  function renderDocumentAiPanel(', chatStart);
  assert.ok(chatStart >= 0 && chatEnd > chatStart, 'bloco de chat documental ausente');
  const chatBlock = js.slice(chatStart, chatEnd);
  assert.doesNotMatch(chatBlock, /body:\s*JSON\.stringify\([^)]*(?:state\.pdfItem|filename|fileId|item\.ref)/s);
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
